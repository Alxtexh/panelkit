<?php

declare(strict_types=1);

namespace App\Demo\Documents;

use App\Demo\Models\Client;
use Alxtexh\Panel\Documents\Kinds\InvoiceKind;

/**
 * The packaged invoice kind, taught about this application's subscribers.
 *
 * THIS IS WHAT THE REGISTRY IS FOR, demonstrated rather than described. The
 * package ships an invoice that previews against invented data, because it has
 * never heard of a `clients` table. This subclass adds the two methods that need
 * local knowledge - which records exist, and how to turn one into a document -
 * and registers under the SAME id, so the last registration wins and every
 * screen, route and doctor check picks it up with no other edit anywhere.
 *
 * NOTHING ABOUT THE DESIGN IS REPEATED HERE. The fields, the defaults, the
 * blocks and the variables all come from the parent; if the package adds a
 * setting, this inherits it.
 *
 * WHY IT MATTERS THAT THE PREVIEW CAN USE A REAL SUBSCRIBER: sample data never
 * has a 40-character company name, a missing phone number, or a plan whose name
 * wraps onto a second line. Those are the things that break a layout, and they
 * are exactly what invented data is guaranteed not to contain.
 */
final class ClientInvoiceKind extends InvoiceKind
{
    /** VAT in basis points, so the rate itself needs no float. */
    private const TAX_BASIS_POINTS = 1600;

    /**
     * A handful of subscribers to preview against.
     *
     * DELIBERATELY NOT ALL OF THEM. This is a dropdown next to a preview, not a
     * record picker - the point is to see the template against something real,
     * and the twelfth name does that no better than the first. On a tenant with
     * 250,000 subscribers, `all()` here would be the one query in the panel that
     * nobody budgeted for.
     *
     * The query runs through the model, so the tenant scope applies and this can
     * only ever list subscribers the person is already entitled to see.
     */
    public function records(): array
    {
        $records = [];

        foreach (Client::query()
            ->orderByDesc('id')
            ->limit(10)
            ->get(['id', 'name']) as $client) {
            $records[] = [
                'id' => $client->id,
                'label' => $client->name,
            ];
        }

        return $records;
    }

    /**
     * One subscriber as an invoice.
     *
     * MONEY IS INTEGER CENTS UNTIL THE MOMENT IT IS RENDERED. A float total is
     * wrong by a fraction of a cent per line and visibly wrong by the twentieth -
     * the classic invoice that adds up to 99.99 when every line is right.
     *
     * NULL WHEN IT DOES NOT RESOLVE, and the id arrives from a query string, so
     * "not found" has to cover a deleted subscriber and another organisation's
     * subscriber alike. The tenant scope makes both the same lookup, which is
     * what stops this being a way to read a name across the boundary.
     */
    public function data(int|string $id): ?array
    {
        $client = Client::query()->with('plan')->find($id);

        if ($client === null) {
            return null;
        }

        $lines = [];
        $subtotal = 0;

        if ($client->plan !== null) {
            $amount = (int) $client->plan->price_cents;
            $subtotal += $amount;

            $lines[] = [
                'description' => $client->plan->name.' - monthly subscription',
                'detail' => $client->plan->speed_mbps.' Mbps, '.strtoupper((string) $client->plan_type),
                'quantity' => 1,
                'unit' => $this->money($amount),
                'amount' => $this->money($amount),
            ];
        }

        $tax = (int) round($subtotal * self::TAX_BASIS_POINTS / 10000);

        return [
            /*
             * A STABLE, HUMAN-QUOTABLE NUMBER derived from the record rather
             * than a counter. A counter needs its own table and a lock to stay
             * gapless; this is a preview of a document rather than a filed one,
             * and the moment invoices are issued for real this is the line that
             * has to change.
             */
            'number' => sprintf('INV-%s-%06d', now()->format('Ym'), $client->id),
            'customer' => $client->name,
            'phone' => (string) $client->phone,
            'reference' => (string) $client->access_code,
            'issued' => now()->toDateString(),
            'due' => now()->addDays(14)->toDateString(),
            'currency' => 'KES',
            'lines' => $lines,
            'subtotal' => $this->money($subtotal),
            'tax' => $this->money($tax),
            'taxLabel' => 'VAT ('.(self::TAX_BASIS_POINTS / 100).'%)',
            'total' => $this->money($subtotal + $tax),
        ];
    }

    /** Cents to a displayable amount. The ONLY place a division happens. */
    private function money(int $cents): string
    {
        return number_format($cents / 100, 2);
    }
}

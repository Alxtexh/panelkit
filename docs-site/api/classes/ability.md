# Ability

`Alxtexh\Panel\Support\Ability` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Support/Ability.php#L44)

DOES THIS PERSON HOLD THIS ABILITY - the one place that answers it.

## Methods

### `static allows(?mixed $user, string $ability): bool`

Does this person hold this ability? Null-safe, and safe on any model.

### `static held(Illuminate\Contracts\Auth\Authenticatable&Illuminate\Contracts\Auth\Access\Authorizable $user, string $ability): bool`

### `static withTeam(callable $body): bool`

RUN THE CHECK WITH THIS ORGANISATION AS SPATIE'S TEAM.


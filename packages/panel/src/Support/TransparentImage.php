<?php

declare(strict_types=1);

namespace Alxtexh\Panel\Support;

use InvalidArgumentException;

/**
 * Courtesy check for logos and stamps that must sit on a document, not in a box.
 *
 * JPEG HAS NO ALPHA. The Vue half (`assertTransparentImage`) refuses before
 * upload; this is the server half so a request that skipped the browser still
 * cannot store an opaque rectangle.
 *
 * Requires GD. If GD is missing, JPEG is still refused; PNG/WebP are allowed
 * without a pixel walk rather than crashing the upload.
 */
final class TransparentImage
{
    public const HELP = 'Upload a PNG with a transparent background so it sits on invoices and contracts without a white box.';

    public const OPAQUE = 'This image has no transparent background. Upload a PNG (or WebP) with alpha so it sits on invoices and contracts without a white box.';

    public const JPEG = 'JPEG files are fully opaque and stamp a white rectangle. Upload a PNG with a transparent background.';

    public static function assert(string $path, ?string $filename = null): void
    {
        $name = strtolower($filename ?? basename($path));

        if (str_ends_with($name, '.jpg') || str_ends_with($name, '.jpeg')) {
            throw new InvalidArgumentException(self::JPEG);
        }

        $info = @getimagesize($path);

        if (! is_array($info)) {
            throw new InvalidArgumentException(self::HELP);
        }

        $mime = strtolower((string) $info['mime']);

        if ($mime === 'image/jpeg') {
            throw new InvalidArgumentException(self::JPEG);
        }

        if ($mime !== 'image/png' && $mime !== 'image/webp') {
            throw new InvalidArgumentException(self::HELP);
        }

        if (! function_exists('imagecreatefrompng') && ! function_exists('imagecreatefromwebp')) {
            return;
        }

        if (! self::hasTransparency($path, $mime)) {
            throw new InvalidArgumentException(self::OPAQUE);
        }
    }

    public static function hasTransparency(string $path, ?string $mime = null): bool
    {
        if ($mime === null) {
            $info = @getimagesize($path);
            $mime = $info === false ? '' : strtolower((string) $info['mime']);
        }

        $image = match ($mime) {
            'image/png' => function_exists('imagecreatefrompng') ? @imagecreatefrompng($path) : false,
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false,
            default => false,
        };

        if ($image === false) {
            return false;
        }

        $width = imagesx($image);
        $height = imagesy($image);

        for ($y = 0; $y < $height; $y++) {
            for ($x = 0; $x < $width; $x++) {
                $rgba = imagecolorat($image, $x, $y);
                $alpha = ($rgba >> 24) & 0x7F;

                if ($alpha > 0) {
                    imagedestroy($image);

                    return true;
                }
            }
        }

        imagedestroy($image);

        return false;
    }
}

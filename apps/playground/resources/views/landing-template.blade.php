<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $landing['brand'] }}</title>
    <meta name="description" content="{{ $landing['tagline'] }}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/landing-template/assets/index.css">
</head>
<body>
    <div id="root"></div>
    <script>window.__PANELKIT_LANDING__ = @json($landing);</script>
    <script type="module" src="/landing-template/assets/index.js"></script>
</body>
</html>

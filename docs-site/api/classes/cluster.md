# Cluster

`Alxtexh\Panel\Resources\Cluster` &middot; `abstract-class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Resources/Cluster.php#L33)

Several resources presented as ONE navigation item - roadmap 4.1.

## Configuration properties

| Property | Type |
| --- | --- |
| `$icon` | `string` |
| `$group` | `?string` |
| `$sort` | `?int` |

## Methods

### `static key(): string`

`NetworkCluster` becomes `network` - the same convention as resources.

### `static label(): string`

### `static icon(): string`

### `static group(): ?string`

The heading the cluster's single entry sits under, if any.

### `static navigationSort(): int`

### `static pages(): array`

Non-resource screens that belong in this cluster's sub-navigation.


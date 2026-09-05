# Panel Operations

Optional queued operations for Panel: imports, exports, bulk actions, and scheduled reports.

Install `alxtexh-enterprise/panel-operations` to enable these workflows. Core keeps the
status and storage contracts so an installation without this package can still boot and
report that the feature is unavailable.

Queued bulk actions process bounded keyset chunks. Each chunk is recorded in the
`panel_bulk_action_checkpoints` migration in the same database transaction as
the mutation, so worker retries resume from the last committed cursor without
reapplying a completed chunk. Queue delivery is at-least-once; a token already
marked done or canceled is treated as a no-op.

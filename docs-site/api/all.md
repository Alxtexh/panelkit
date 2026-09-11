# All classes

Generated from the main source tree by `scripts/generate-api-manifest.php` — every
signature below was read with PHP Reflection against the actual loaded classes, not typed
by hand. Regenerate with `php scripts/generate-api-manifest.php` after adding a class to
`docs/api-manifest/classes.json`.

## Actions

- [`Action`](/api/classes/action) — `class`
- [`ActionGroup`](/api/classes/action-group) — `class`
- [`BulkAction`](/api/classes/bulk-action) — `class`
- [`ImpersonateAction`](/api/classes/impersonate-action) — `class`
- [`JobStatus`](/api/classes/job-status) — `class`
- [`ModalFooterAction`](/api/classes/modal-footer-action) — `class`
- [`RecordAction`](/api/classes/record-action) — `class`
- [`ReplicateAction`](/api/classes/replicate-action) — `class`
- [`ImportController`](/api/classes/import-controller) — `class`

## Authentication

- [`PasswordPolicy`](/api/classes/password-policy) — `class`
- [`SocialProviders`](/api/classes/social-providers) — `class`
- [`Turnstile`](/api/classes/turnstile) — `class`
- [`VerifyTurnstile`](/api/classes/verify-turnstile) — `class`

## Authorization

- [`TenantScope`](/api/classes/tenant-scope) — `class`
- [`TenantResourcePolicy`](/api/classes/tenant-resource-policy) — `abstract-class`
- [`Abilities`](/api/classes/abilities) — `class`
- [`Ability`](/api/classes/ability) — `class`
- [`TenantContext`](/api/classes/tenant-context) — `class`

## Billing

- [`BillingState`](/api/classes/billing-state) — `class`
- [`BillingAccess`](/api/classes/billing-access) — `class`
- [`BillingStateStore`](/api/classes/billing-state-store) — `class`

## Commands

- [`BlueprintCommand`](/api/classes/blueprint-command) — `class`
- [`DoctorCommand`](/api/classes/doctor-command) — `class`
- [`InstallCommand`](/api/classes/install-command) — `class`
- [`MakeImporterCommand`](/api/classes/make-importer-command) — `class`
- [`MakeRelationManagerCommand`](/api/classes/make-relation-manager-command) — `class`
- [`PermissionsCommand`](/api/classes/permissions-command) — `class`

## Core

- [`Panel`](/api/classes/panel) — `class`
- [`PanelManager`](/api/classes/panel-manager) — `class`
- [`Module`](/api/classes/module) — `class`
- [`ModuleRegistry`](/api/classes/module-registry) — `class`

## Forms

- [`BuilderField`](/api/classes/builder-field) — `class`
- [`CheckboxField`](/api/classes/checkbox-field) — `class`
- [`CodeField`](/api/classes/code-field) — `class`
- [`CountryField`](/api/classes/country-field) — `class`
- [`DateField`](/api/classes/date-field) — `class`
- [`Field`](/api/classes/field) — `abstract-class`
- [`FileUploadField`](/api/classes/file-upload-field) — `class`
- [`HiddenField`](/api/classes/hidden-field) — `class`
- [`KeyValueField`](/api/classes/key-value-field) — `class`
- [`MarkdownField`](/api/classes/markdown-field) — `class`
- [`MoneyField`](/api/classes/money-field) — `class`
- [`MultiSelectField`](/api/classes/multi-select-field) — `class`
- [`NumberField`](/api/classes/number-field) — `class`
- [`PasswordField`](/api/classes/password-field) — `class`
- [`RepeaterField`](/api/classes/repeater-field) — `class`
- [`RichEditorField`](/api/classes/rich-editor-field) — `class`
- [`SelectField`](/api/classes/select-field) — `class`
- [`TagsField`](/api/classes/tags-field) — `class`
- [`TextField`](/api/classes/text-field) — `class`
- [`TextareaField`](/api/classes/textarea-field) — `class`
- [`ToggleField`](/api/classes/toggle-field) — `class`
- [`Form`](/api/classes/form) — `class`
- [`Component`](/api/classes/component) — `abstract-class`
- [`Grid`](/api/classes/grid) — `class`
- [`Section`](/api/classes/section) — `class`
- [`Tabs`](/api/classes/tabs) — `class`
- [`Wizard`](/api/classes/wizard) — `class`

## Infolists

- [`BadgeEntry`](/api/classes/badge-entry) — `class`
- [`DateTimeEntry`](/api/classes/date-time-entry) — `class`
- [`Entry`](/api/classes/entry) — `abstract-class`
- [`IconEntry`](/api/classes/icon-entry) — `class`
- [`ImageEntry`](/api/classes/image-entry) — `class`
- [`KeyValueEntry`](/api/classes/key-value-entry) — `class`
- [`MoneyEntry`](/api/classes/money-entry) — `class`
- [`RepeatableEntry`](/api/classes/repeatable-entry) — `class`
- [`TextEntry`](/api/classes/text-entry) — `class`
- [`ViewEntry`](/api/classes/view-entry) — `class`

## Notifications

- [`Alert`](/api/classes/alert) — `class`
- [`AlertRule`](/api/classes/alert-rule) — `class`
- [`Notification`](/api/classes/notification) — `class`

## Plugins

- [`AnnouncementsPlugin`](/api/classes/announcements-plugin) — `class`
- [`PanelPlugin`](/api/classes/panel-plugin) — `interface`
- [`Plugin`](/api/classes/plugin) — `abstract-class`
- [`PluginContext`](/api/classes/plugin-context) — `class`
- [`RenderHooks`](/api/classes/render-hooks) — `class`
- [`TicketingPlugin`](/api/classes/ticketing-plugin) — `class`

## Relation managers

- [`RelationManager`](/api/classes/relation-manager) — `class`

## Resources

- [`Board`](/api/classes/board) — `class`
- [`Cluster`](/api/classes/cluster) — `abstract-class`
- [`Lens`](/api/classes/lens) — `class`
- [`Resource`](/api/classes/resource) — `abstract-class`
- [`ResourceConfigurator`](/api/classes/resource-configurator) — `class`
- [`SingularResource`](/api/classes/singular-resource) — `abstract-class`

## Support

- [`HasQualifiedSource`](/api/classes/has-qualified-source) — `trait`

## Tables

- [`BadgeColumn`](/api/classes/badge-column) — `class`
- [`Column`](/api/classes/column) — `abstract-class`
- [`ColumnGroup`](/api/classes/column-group) — `class`
- [`DateColumn`](/api/classes/date-column) — `class`
- [`IconColumn`](/api/classes/icon-column) — `class`
- [`ImageColumn`](/api/classes/image-column) — `class`
- [`MoneyColumn`](/api/classes/money-column) — `class`
- [`SelectColumn`](/api/classes/select-column) — `class`
- [`TagsColumn`](/api/classes/tags-column) — `class`
- [`TextColumn`](/api/classes/text-column) — `class`
- [`ToggleColumn`](/api/classes/toggle-column) — `class`
- [`BooleanFilter`](/api/classes/boolean-filter) — `class`
- [`DateRangeFilter`](/api/classes/date-range-filter) — `class`
- [`Filter`](/api/classes/filter) — `abstract-class`
- [`MultiSelectFilter`](/api/classes/multi-select-filter) — `class`
- [`NumberRangeFilter`](/api/classes/number-range-filter) — `class`
- [`QueryBuilderFilter`](/api/classes/query-builder-filter) — `class`
- [`SelectFilter`](/api/classes/select-filter) — `class`
- [`TrashedFilter`](/api/classes/trashed-filter) — `class`
- [`Group`](/api/classes/group) — `class`
- [`Summarizer`](/api/classes/summarizer) — `class`
- [`Table`](/api/classes/table) — `class`
- [`Tabs`](/api/classes/tabs) — `class`

## Testing

- [`InteractsWithPanels`](/api/classes/interacts-with-panels) — `trait`

## Webhooks

- [`WebhookDelivery`](/api/classes/webhook-delivery) — `class`
- [`WebhookDispatcher`](/api/classes/webhook-dispatcher) — `class`
- [`WebhookEndpoint`](/api/classes/webhook-endpoint) — `class`
- [`WebhooksPlugin`](/api/classes/webhooks-plugin) — `class`

## Widgets

- [`DashboardPage`](/api/classes/dashboard-page) — `abstract-class`
- [`ChartWidget`](/api/classes/chart-widget) — `class`
- [`StatWidget`](/api/classes/stat-widget) — `class`
- [`TableWidget`](/api/classes/table-widget) — `class`

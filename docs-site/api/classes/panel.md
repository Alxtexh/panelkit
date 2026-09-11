# Panel

`Alxtexh\Panel\Panel` &middot; `class` &middot; [source](https://github.com/Alxtexh/panelkit/blob/main/packages/panel/src/Panel.php#L33)

A panel: an id, a path, a guard, middleware, and a tenancy context.

## Methods

### `static make(string $id): self`

### `plugins(array $plugins): self`

Install plugins into this panel.

### `getPlugins(): array`

### `widgets(array $widgets): self`

WIDGETS THIS PORTAL SHOWS, REGISTERED RATHER THAN INHERITED.

### `userDashboards(bool $enabled = true): self`

Let each operator rearrange dashboard widgets and persist the layout.

### `hasUserDashboards(): bool`

### `resourceForms(string $mode): self`

Default create, edit and view presentation for resources on this panel.

### `getResourceForms(): string`

### `getWidgets(): array`

### `modules(array $modules): self`

Declare product modules this portal's plans may grant.

### `getModules(): array`

### `discoverWidgets(string $in, string $for = NULL): self`

WIDGETS FOUND BY SCANNING, the way resources and pages are found.

### `getWidgetDirectories(): array`

### `userMenuItems(array $items): self`

MENU ENTRIES THIS PORTAL ADDS TO THE ACCOUNT DROPDOWN.

### `getUserMenuItems(): array`

### `navigationItems(array $items): self`

NAVIGATION ENTRIES THAT ARE NOT RESOURCES.

### `getNavigationItems(): array`

### `favicon(string $url): self`

THE BROWSER-TAB ICON FOR THIS PORTAL.

### `getFavicon(): ?string`

### `registerErrorNotification(int $status, string $title, string $body = NULL): self`

WHAT AN ERROR SCREEN SAYS, PER STATUS CODE.

### `getErrorNotification(int $status): ?array`

### `discoverResources(string $in, string $for): self`

THE DIRECTORY THIS PORTAL'S RESOURCES LIVE IN, and therefore owns.

### `discoverPages(string $in, string $for): self`

As `discoverResources()`, for the portal's non-resource screens.

### `getResourceDirectories(): array`

### `getPageDirectories(): array`

### `login(string|bool $slug = 'login'): self`

THIS PORTAL GETS ITS OWN SIGN-IN, mounted under its own path.

### `hasLogin(): bool`

### `idleLock(int|bool $minutes = 15, int $warningSeconds = 60): self`

Lock this portal after idle minutes, with a client warning first.

### `hasIdleLock(): bool`

### `twoFactorChallenge(bool $enabled = true): self`

After a correct password, ask for TOTP, a recovery code, or an email

### `hasTwoFactorChallenge(): bool`

### `requireTwoFactor(bool $required = true): self`

After login, send users with no TOTP, email OTP, or passkey to Security

### `twoFactorRequired(bool $required = true): self`

Alias of `requireTwoFactor()`.

### `requiresTwoFactor(): bool`

### `registration(string|bool $slug = 'register'): self`

Self-service registration on this portal, the way `login()` mounts

### `hasRegistration(): bool`

### `getRegistrationSlug(): string`

### `emailVerification(bool $enabled = true): self`

Prove the mailbox before the panel. Mounts the notice, the signed

### `hasEmailVerification(): bool`

### `socialite(array|bool $providers = true): self`

Social buttons on this portal's login.

### `socialiteAllowlist(): ?array`

Null means every configured provider (or the full catalogue when

### `turnstile(bool $enabled = true): self`

Cloudflare Turnstile on this portal's auth writes.

### `hasTurnstile(): bool`

### `environmentBanner(bool $enabled = true): self`

Environment badge API (no-op).

### `environmentBannerOverride(): ?bool`

### `showsEnvironmentBanner(): bool`

### `quickCreate(bool $enabled = true): self`

Header Quick Create of creatable resources. `->quickCreate(false)` hides

### `showsQuickCreate(): bool`

### `sidebarSettings(bool $enabled = true): self`

Put Settings in the sidebar (Settings group). Default on for every install.

### `hasSidebarSettings(): bool`

### `presence(bool $enabled = true): self`

Who's viewing a record (Echo presence). Off by default.

### `presenceOverride(): ?bool`

### `hasPresence(): bool`

### `idleLockMinutes(): ?int`

### `idleLockWarningSeconds(): int`

### `subscriptionGate(Closure $isActive, string $billingPath = NULL): self`

Opt-in expiry wall. When the callback returns false, company users on a

### `hasSubscriptionGate(): bool`

### `subscriptionIsActive(): bool`

### `billingState(Closure $state = NULL, string $billingPath = NULL): self`

Rich subscription state for packaged SaaS access flows.

### `billingStateData(): ?array`

### `resolveBillingState(): array`

### `billingWebhookVerifier(Closure $verifier): self`

Optional signature verifier for inbound billing webhooks.

### `billingWebhookVerifierUsing(): ?Closure`

### `billingWebhookMapper(Closure $mapper): self`

Optional payload mapper for inbound billing webhooks.

### `billingWebhookMapperUsing(): ?Closure`

### `billingPortalActions(Closure $actions): self`

Optional billing portal action resolver.

### `resolveBillingPortalActions(): array`

### `subscriptionBillingPath(): string`

### `suspendedPage(string $component = 'BillingSuspended'): self`

Which component the packaged suspended route renders.

### `getSuspendedPageComponent(): string`

### `loginComponent(string $component): self`

THE COMPONENT THIS PORTAL'S SIGN-IN RENDERS.

### `getLoginComponent(): string`

### `authLayout(string $layout): self`

Prefer `authFamily()`. Kept as an alias so existing panels keep compiling.

### `authFamily(string $family): self`

Pick the auth design family for login, register, OTP, and related screens.

### `getAuthLayout(): string`

### `getAuthFamily(): string`

### `static authFamilies(): array`

### `authTestimonial(string $quote, string $author, string $role = NULL): self`

A short quote beside the `showcase` auth layout's preview panel.

### `getAuthTestimonial(): ?array`

### `authImage(string $src, string $alt = NULL): self`

A real image for the `card`, `showcase` and `split` auth layouts'

### `getAuthImage(): ?array`

### `sidebarVariant(string $variant): self`

Prefer `sidebarLayout()`. Alias kept for call sites that say "variant".

### `sidebarLayout(string $layout): self`

Pick the sidebar chrome family for AppSidebar / PanelShell.

### `getSidebarLayout(): string`

### `getSidebarVariant(): string`

### `static sidebarLayouts(): array`

### `sharedLogin(string $path = 'login'): self`

Opt this panel into a shared sign-in page at `$path`.

### `getSharedLoginPath(): ?string`

### `getLoginSlug(): string`

### `passwordReset(bool $enabled = true): self`

A "FORGOT PASSWORD?" LINK LEADING NOWHERE IS WORSE THAN NO LINK,

### `hasPasswordReset(): bool`

### `passwordless(bool $enabled = true): self`

Email a one-time sign-in link on this portal's login screen.

### `magicLink(bool $enabled = true): self`

Alias of `passwordless()`.

### `hasPasswordless(): bool`

### `passwordlessActive(): bool`

Panel opt-in and config must both be on for magic link to run.

### `passwordBroker(string $broker): self`

THE BROKER THIS PORTAL RESETS THROUGH, and it must match the guard.

### `getPasswordBroker(): ?string`

### `path(string $path): self`

### `domain(string $domain): self`

Restrict this panel to requests arriving on a specific hostname.

### `getDomain(): ?string`

### `guard(string $guard): self`

### `middleware(array $middleware): self`

### `authMiddleware(array $middleware): self`

### `canAccess(Closure $callback): self`

First-class panel access hook, after the guard authenticates.

### `accessUsing(): ?Closure`

### `context(string $context): self`

### `brandName(Closure $brandName): self`

Resolved lazily - branding is tenant data and must not be cached.

### `without(array $screens): self`

PACKAGED SCREENS THIS PANEL DOES NOT WANT.

### `editableSupport(bool $enabled = true): self`

Opt this portal into editing Help, FAQ, What's new and About on those

### `isSupportEditable(): bool`

### `pageFooter(bool $enabled): self`

Render `AppPageFooter` after every page in this panel's shell.

### `hasPageFooter(): bool`

### `groupedSettingsCards(bool $enabled = true): self`

Bordered cards on the multi-section settings screens (Profile,

### `hasGroupedSettingsCards(): bool`

### `paymentSettings(Closure $gateways = NULL): self`

Opt this portal into `/settings/payments`. Default off.

### `offersPaymentSettings(): bool`

### `paymentGatewaysResolver(): ?Closure`

### `mailSettings(): self`

Opt this portal into `/settings/smtp` - the outgoing mail server this

### `offersMailSettings(): bool`

### `planCatalog(Closure $createCheckoutSession): self`

Opt this portal into `PlanCatalogPage` - a customer browses the plan

### `planCheckoutResolver(): ?Closure`

### `apps(array $names): self`

Opt this portal into empty kit apps: `mail`, `chat`, `api-keys`, `invites`,

### `webhooks(): self`

Shorthand for `->apps(['webhooks'])`.

### `apiDocs(string $openapiUrl = NULL): self`

Built-in Scalar API docs (nav, page, OpenAPI). Shorthand for

### `logTail(string $defaultFile = 'laravel.log', array $allowlist = NULL): self`

Read-only log tail (`apps/logs`). Shorthand for `->apps(['logs'])`.

### `kitShowcase(): self`

Kit-only showcase of fields, columns, and widgets. Shorthand for

### `getLogTailDefault(): ?string`

### `getLogTailAllowlist(): ?array`

### `getOpenapiUrl(): ?string`

OpenAPI URL for the Scalar screen, or null to use the generated route.

### `offersApp(string $name): bool`

### `feedback(Closure $persist = NULL): self`

Opt this portal into in-panel feedback (`POST {panel}/feedback`).

### `offersFeedback(): bool`

### `feedbackPersister(): ?Closure`

### `setupWizard(Closure $resolver): self`

Opt this portal into a full-screen first-run setup wizard, separate

### `setupWizardResolver(): ?Closure`

### `offersSetupWizard(): bool`

### `onboardingSteps(Closure $resolver): self`

Replace or wrap the default first-run setup steps shown on the dashboard.

### `onboardingStepsResolver(): ?Closure`

### `onboarding(bool $enabled = true): self`

Opt this portal into the first-run "Get started" guide. Default off.

### `offersOnboarding(): bool`

### `supportGithubRepository(string $repository): self`

Optional source for What's new: GitHub releases for this repository.

### `getSupportGithubRepository(): ?string`

### `offers(string $screen): bool`

Whether a packaged screen is mounted on this panel.

### `colors(Closure $colors): self`

PER-PANEL COLOUR TOKENS, applied as CSS variables on every screen.

### `routeName(string $prefix): self`

The prefix every route in this panel is named with.

### `getRouteName(): string`

### `getPath(): string`

### `getGuard(): string`

### `getContext(): string`

### `isCentral(): bool`

### `databaseTransactions(bool $enabled = true): self`

Wrap every write this panel performs in a database transaction.

### `hasDatabaseTransactions(): bool`

### `getMiddleware(): array`

THE GATE DEFAULTS TO THIS PANEL'S OWN GUARD, DERIVED RATHER THAN TYPED.

### `getGuestMiddleware(): array`

The panel's middleware WITHOUT the part that demands a session.

### `user(): ?Illuminate\Contracts\Auth\Authenticatable`

The acting user, resolved through THIS panel's guard.

### `resolveBrandName(): ?string`

### `resolveColors(): array`


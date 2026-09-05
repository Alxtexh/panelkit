/**
 * The screens Alxtexhpanel's PHP half renders.
 *
 * WHY THIS PACKAGE EXISTS. `alxtexh-enterprise/panel` answers five requests with
 * `Inertia::render('ResourceIndex')`, `'ResourceForm'`, `'ResourceView'`,
 * `'Trash'` and `'PanelHome'` - and shipped no Vue at all. So a fresh
 * `composer require alxtexh-enterprise/panel` produced routes that resolved to components
 * that did not exist: a white page and a console error naming a file the
 * developer had never heard of, on the very first screen they visited. The PHP
 * half was installable and the panel was not.
 *
 * WHY A PACKAGE RATHER THAN PUBLISHED STUBS. Publishing 3,000 lines of Vue into
 * an application makes every fix a manual re-publish, and re-publishing
 * overwrites whatever the application changed. A package upgrades with
 * `npm update`, and an application that wants to change a screen still can - it
 * owns the one-line page file that imports from here, so replacing a screen
 * means editing that file rather than forking a tree.
 *
 * WHY IT IS SEPARATE FROM `@alxtexh-enterprise/panel`. That package is deliberately
 * transport-agnostic: nothing in it imports Inertia, which is what lets its
 * table and form components run under Livewire, a plain SPA, or in a test with
 * no router at all. These pages are Inertia to their bones - `useForm`, `Link`,
 * `router.reload`, partial reloads by prop name - so putting them there would
 * have cost that property for every consumer.
 *
 * WHAT AN APPLICATION MUST STILL PROVIDE: a layout. These pages name none, so
 * the shell - sidebar, header, account menu - stays the application's. See the
 * README.
 */

export { default as ResourceIndex } from './pages/ResourceIndex.vue'
export { default as ResourceKanban } from './pages/ResourceKanban.vue'
export { default as ResourceWorkflow } from './pages/ResourceWorkflow.vue'
export { default as ResourceForm } from './pages/ResourceForm.vue'
export { default as ResourceView } from './pages/ResourceView.vue'
export { default as ResourceAttach } from './pages/ResourceAttach.vue'
export { default as ResourcePicker } from './pages/ResourcePicker.vue'
export { default as Trash } from './pages/Trash.vue'
export { default as PanelHome } from './pages/PanelHome.vue'
export { default as PanelDashboard } from './pages/PanelDashboard.vue'
export { default as PanelPage } from './pages/PanelPage.vue'
export { default as Changelog } from './pages/Changelog.vue'
export { default as Environment } from './pages/Environment.vue'
export { default as Sitemap } from './pages/Sitemap.vue'
export { default as Roles } from './pages/settings/Roles.vue'
export { default as Profile } from './pages/settings/Profile.vue'
export { default as Security } from './pages/settings/Security.vue'
export { default as Notifications } from './pages/settings/Notifications.vue'
export { default as Help } from './pages/support/Help.vue'
export { default as Faq } from './pages/support/Faq.vue'
export { default as About } from './pages/support/About.vue'
export { default as UserManagement } from './pages/UserManagement.vue'
export { default as Workspaces } from './pages/settings/Workspaces.vue'
export { default as Organisation } from './pages/settings/Organisation.vue'
export { default as SettingsIndex } from './pages/settings/Index.vue'
export { default as SettingsPayments } from './pages/settings/Payments.vue'
export { default as SettingsLayout } from './layouts/SettingsLayout.vue'
export { default as BillingSuspended } from './pages/BillingSuspended.vue'
export { default as Catalog } from './pages/Catalog.vue'
export { default as PlanSetup } from './pages/PlanSetup.vue'
export { default as CatalogItem } from './pages/CatalogItem.vue'
export { default as CatalogRegister } from './pages/CatalogRegister.vue'
export { default as Signatures } from './pages/Signatures.vue'
export { default as Till } from './pages/Till.vue'
export { default as DevicePreview } from './pages/DevicePreview.vue'
export { default as Mail } from './pages/Mail.vue'
export { default as Chat } from './pages/Chat.vue'
export { default as TicketAnalysis } from './pages/TicketAnalysis.vue'
export { default as DocumentTemplates } from './pages/documents/Templates.vue'
export { default as DocumentTemplateDesigner } from './pages/documents/TemplateDesigner.vue'
export { default as DocumentPrint } from './pages/documents/DocumentPrint.vue'

export { default as AuditTimeline } from './components/AuditTimeline.vue'
export { default as CommentsSection } from './components/CommentsSection.vue'

/*
 * WIDGETS, FOR ANY SCREEN THAT HOSTS THEM.
 *
 * `WidgetSet` serialises stats and charts for three hosts - `DashboardPage`,
 * `Resource::headerWidgets()` and `Page::headerWidgets()` - and only the
 * dashboard could draw one, so a custom page received the props and had nothing
 * to render them with. `PanelWidgets` takes the same `$prefix` the server used
 * and draws both rows; `ChartBody` is the per-type plot on its own, for a screen
 * that wants its own card around it.
 */
export { default as PanelWidgets } from './components/widgets/PanelWidgets.vue'
export { default as ChartBody } from './components/widgets/ChartBody.vue'
export type { Chart, Dataset, Series, StatDefinition, StatValue } from './components/widgets/types'

export { useListTable, type ListPageProps } from './composables/useListTable'
export { useBulkJob } from './composables/useBulkJob'
export { useUnsavedGuard } from './composables/useUnsavedGuard'
export { usePanelIdleLock, type PanelIdleLockShared } from './composables/usePanelIdleLock'

/*
 * THE SHELL, which the package did not ship until now.
 *
 * `panel:install` published a scaffold layout and the reference app built its
 * own sidebar, topbar and account menu - so a generated portal got the
 * packaged SCREENS inside a plainer frame, and read as a less finished product
 * than the demo it was supposed to look like. A sidebar is not
 * business-specific; every panel has one, and every consumer rebuilt it.
 *
 * The published `PanelLayout.vue` is now a thin wrapper over `PanelShell`, so
 * the frame arrives working and stays editable - the file is still yours.
 */
export { default as PanelShell } from './components/shell/PanelShell.vue'
export { default as PanelAccountMenu } from './components/shell/PanelAccountMenu.vue'
export { default as PanelCommandPalette } from './components/shell/PanelCommandPalette.vue'
export { default as PanelInfoSidebar } from './components/shell/PanelInfoSidebar.vue'
export { default as PanelNotificationBell } from './components/shell/PanelNotificationBell.vue'
export { default as PanelBreadcrumbs } from './components/shell/PanelBreadcrumbs.vue'
export { default as PanelImpersonationBanner } from './components/shell/PanelImpersonationBanner.vue'
export { default as PanelIdleLockGuard } from './components/shell/PanelIdleLockGuard.vue'
export { default as PanelLockButton } from './components/shell/PanelLockButton.vue'
export type { NavItem } from './components/shell/types'

/*
 * THE REFERENCE APP'S SHELL, MOVED WHOLE.
 *
 * `PanelShell` above is the thin frame written for consumers who had nothing;
 * this is the one the demo actually uses - 509 lines of sidebar with flyouts
 * when collapsed, collapsible groups, a mobile sheet and a horizontal mode.
 * Rebuilding that against a thinner primitive is exactly how a generated portal
 * ends up looking almost right, so it moved instead.
 *
 * `NavUser` TAKES ITS MENU AS A SLOT. The reference app links from there to its
 * settings centre, its operations screen and its lock screen - its routes,
 * which a package cannot name. The trigger, the avatar and the placement are
 * packaged; the items are passed in.
 */
export { default as AppSidebar } from './components/shell/AppSidebar.vue'
export { default as AppLogo } from './components/shell/AppLogo.vue'
export { default as AppLogoIcon } from './components/shell/AppLogoIcon.vue'
export { default as AppShell } from './components/shell/AppShell.vue'
export { default as AppContent } from './components/shell/AppContent.vue'
export {
    useSidebarLayout,
    SIDEBAR_LAYOUTS,
    type SidebarLayout,
    type SidebarChrome,
} from './composables/useSidebarLayout'
export { AppPageFooter, useShellPageFooter } from '@alxtexh-enterprise/panel'
export { default as SessionExpired } from './components/SessionExpired.vue'
export { default as Toaster } from './components/Toaster.vue'
export { default as DeleteUser } from './components/DeleteUser.vue'

/*
 * THE ERROR SCREENS, moved from the reference app.
 *
 * `Error` is the one page every status renders through - five near-identical
 * page components drift, and the 500 is the one nobody revisits because it is
 * the hardest to trigger on purpose. The copy is deliberately unhelpful about
 * CAUSES: a 403 that names the missing permission tells whoever probed for it
 * what to ask for next.
 */
export { default as ErrorPage } from './pages/errors/Error.vue'
export { default as ErrorScreen } from './pages/errors/ErrorScreen.vue'
export { default as ErrorArt } from './pages/errors/ErrorArt.vue'

/*
 * THE INSTALLATION'S OWN HEALTH, moved from the reference app.
 *
 * The services behind these - `BackupStatus`, `BackupArchive`, `LogReader`,
 * `MonitorSampler` - were packaged long before the screens were, so an
 * installation had every piece of the machinery and nothing to reach it from.
 *
 * Their Wayfinder route helpers became a `routes` prop, which the packaged
 * `OperationsController` fills from the CURRENT PANEL'S path.
 */
export { default as Backups } from './pages/operations/Backups.vue'
export { default as BackupSettings } from './pages/operations/BackupSettings.vue'
export { default as Logs } from './pages/operations/Logs.vue'
export { default as Monitoring } from './pages/operations/Monitoring.vue'
export { default as AssistantSettings } from './pages/settings/Assistant.vue'
export { default as SmtpSettings } from './pages/settings/Smtp.vue'
export {
    installSessionExpiryPreview,
    notifySessionExpired,
    sessionExpired,
    watchForSessionExpiry,
} from './lib/sessionExpired'
export { default as NavMain } from './components/shell/NavMain.vue'
export { default as NavFooter } from './components/shell/NavFooter.vue'
export { default as NavUser } from './components/shell/NavUser.vue'
export { default as DefaultAccountMenuItems } from './components/shell/DefaultAccountMenuItems.vue'
export { default as UserInfo } from './components/shell/UserInfo.vue'
export { default as AppHeader } from './components/shell/AppHeader.vue'
export { default as AppTopNav } from './components/shell/AppTopNav.vue'
export { default as AppSidebarHeader } from './components/shell/AppSidebarHeader.vue'
export { default as AssistantDrawer } from './components/shell/AssistantDrawer.vue'
export { default as Breadcrumbs } from './components/shell/Breadcrumbs.vue'
export { default as TopNavUser } from './components/shell/TopNavUser.vue'
export { usePanelNav } from './composables/usePanelNav'
export { useCurrentUrl } from './composables/useCurrentUrl'
export { getInitials } from './composables/useInitials'
export { useSidebarOpener } from './lib/mobileNav'
export { useTranslations } from './composables/useTranslations'

/**
 * The page names the PHP half renders, and the component each one means.
 *
 * FOR AN APPLICATION THAT RESOLVES PAGES ITSELF. Inertia's Vite plugin globs
 * `resources/js/pages/**` and knows nothing about a package, so the supported
 * arrangement is a one-line page file per screen - which is what
 * `php artisan panel:install --js` writes. An application with a hand-written
 * `resolve` can use this map instead and skip the files entirely:
 *
 * ```ts
 * resolve: (name) => PANEL_PAGES[name] ?? resolvePageComponent(...)
 * ```
 *
 * KEYED BY THE NAME THE SERVER SENDS, not by file path, because the server is
 * the only side that decides it. A rename here without a rename in
 * `ResourceController` is a white page, so the panel's own test walks both.
 */
export const PANEL_PAGES = {
    ResourceIndex: () => import('./pages/ResourceIndex.vue'),
    ResourceKanban: () => import('./pages/ResourceKanban.vue'),
    ResourceWorkflow: () => import('./pages/ResourceWorkflow.vue'),
    ResourceForm: () => import('./pages/ResourceForm.vue'),
    ResourceView: () => import('./pages/ResourceView.vue'),
    ResourceAttach: () => import('./pages/ResourceAttach.vue'),
    ResourcePicker: () => import('./pages/ResourcePicker.vue'),
    Trash: () => import('./pages/Trash.vue'),
    PanelHome: () => import('./pages/PanelHome.vue'),
    TicketAnalysis: () => import('./pages/TicketAnalysis.vue'),
    Till: () => import('./pages/Till.vue'),
    DevicePreview: () => import('./pages/DevicePreview.vue'),
    Mail: () => import('./pages/Mail.vue'),
    Chat: () => import('./pages/Chat.vue'),
    PanelDashboard: () => import('./pages/PanelDashboard.vue'),
    PanelPage: () => import('./pages/PanelPage.vue'),
    Onboarding: () => import('./pages/Onboarding.vue'),
    SetupWizard: () => import('./pages/SetupWizard.vue'),
    Changelog: () => import('./pages/Changelog.vue'),
    ApiKeys: () => import('./pages/ApiKeys.vue'),
    ApiDocs: () => import('./pages/ApiDocs.vue'),
    Logs: () => import('./pages/Logs.vue'),
    BillingPortal: () => import('./pages/BillingPortal.vue'),
    EmailTemplates: () => import('./pages/EmailTemplates.vue'),
    FeatureFlags: () => import('./pages/FeatureFlags.vue'),
    Invites: () => import('./pages/Invites.vue'),
    MediaLibrary: () => import('./pages/MediaLibrary.vue'),
    Webhooks: () => import('./pages/Webhooks.vue'),
    Environment: () => import('./pages/Environment.vue'),
    Sitemap: () => import('./pages/Sitemap.vue'),

    /*
     * The document designer. Nested names, because the server sends
     * `documents/TemplateDesigner` - a flat key here would not match and the
     * failure is a white page.
     */
    'documents/Templates': () => import('./pages/documents/Templates.vue'),
    'documents/TemplateDesigner': () => import('./pages/documents/TemplateDesigner.vue'),
    'documents/DocumentPrint': () => import('./pages/documents/DocumentPrint.vue'),

    // The permission matrix - the package owns the roles system now.
    'settings/Roles': () => import('./pages/settings/Roles.vue'),
    'settings/Profile': () => import('./pages/settings/Profile.vue'),
    'settings/Security': () => import('./pages/settings/Security.vue'),
    'settings/Notifications': () => import('./pages/settings/Notifications.vue'),
    'support/Help': () => import('./pages/support/Help.vue'),
    'support/Faq': () => import('./pages/support/Faq.vue'),
    'support/About': () => import('./pages/support/About.vue'),
    UserManagement: () => import('./pages/UserManagement.vue'),
    'settings/Workspaces': () => import('./pages/settings/Workspaces.vue'),
    'settings/Organisation': () => import('./pages/settings/Organisation.vue'),
    'settings/Index': () => import('./pages/settings/Index.vue'),
    'settings/Payments': () => import('./pages/settings/Payments.vue'),
    BillingSuspended: () => import('./pages/BillingSuspended.vue'),
    Catalog: () => import('./pages/Catalog.vue'),
    PlanSetup: () => import('./pages/PlanSetup.vue'),
    CatalogItem: () => import('./pages/CatalogItem.vue'),
    CatalogRegister: () => import('./pages/CatalogRegister.vue'),
    Signatures: () => import('./pages/Signatures.vue'),

    // Backups, logs and monitoring - the installation's own health.
    'operations/Backups': () => import('./pages/operations/Backups.vue'),
    'operations/BackupSettings': () => import('./pages/operations/BackupSettings.vue'),
    'operations/Logs': () => import('./pages/operations/Logs.vue'),
    'operations/Monitoring': () => import('./pages/operations/Monitoring.vue'),

    // The assistant's provider and key.
    'settings/Assistant': () => import('./pages/settings/Assistant.vue'),

    // The outgoing mail server this installation sends through.
    'settings/Smtp': () => import('./pages/settings/Smtp.vue'),

    /*
     * A PANEL'S OWN SIGN-IN, UNDER A NAME NO APPLICATION OWNS.
     *
     * IT USED TO RENDER `auth/Login` AND THAT WAS THE BUG. Inertia resolves a
     * page name against the APPLICATION's `resources/js/pages` first, so a
     * portal's sign-in rendered whatever the starter kit had put at
     * `auth/Login` - a component written for the application's OWN controller,
     * with a different prop contract entirely. The packaged controller sends
     * `socialProviders` as a list of `{key,label,url}`; the reference app's
     * screen expects a `key => label` map and did `Object.entries` on it, so
     * the superadmin login rendered a button captioned with raw JSON. The
     * `heading` and `description` the panel configured were dropped on the
     * floor for the same reason, and the screen said "Log in to your account"
     * under the wrong brand.
     *
     * NOTHING FAILED, WHICH IS WHY IT SHIPPED. A page that renders is a page
     * that looks like it works.
     *
     * `panel/auth/*` CANNOT COLLIDE. The application keeps `auth/Login` for
     * its own front door, a portal gets the packaged screen that matches the
     * packaged controller, and creating a panel no longer depends on the host
     * application happening to have a compatible component - which is the
     * whole point of a panel bringing its own sign-in.
     */
    'panel/auth/Login': () => import('./pages/panel/auth/Login.vue'),
    'panel/auth/ForgotPassword': () => import('./pages/panel/auth/ForgotPassword.vue'),
    'panel/auth/ResetPassword': () => import('./pages/panel/auth/ResetPassword.vue'),
    'panel/auth/TwoFactorChallenge': () => import('./pages/panel/auth/TwoFactorChallenge.vue'),
    'panel/auth/Register': () => import('./pages/panel/auth/Register.vue'),
    'panel/auth/VerifyEmail': () => import('./pages/panel/auth/VerifyEmail.vue'),
    'auth/LockScreen': () => import('./pages/auth/LockScreen.vue'),
    'errors/Error': () => import('./pages/errors/Error.vue'),
} as const

/*
 | RENDER HOOKS - roadmap 4.4. `RenderHook` is dropped at named positions
 | inside the packaged pages; an application registers which components a
 | plugin is allowed to mount, because a name from the server that resolved
 | to any component in the bundle would be a plugin mounting anything
 | anywhere.
 */
export { default as RenderHook } from './components/RenderHook.vue'
export { default as SocialLoginButtons } from './components/SocialLoginButtons.vue'
export { default as TicketThread } from './components/TicketThread.vue'
export { default as AnnouncementBanners } from './components/AnnouncementBanners.vue'
export { default as FeedbackDialog } from './components/FeedbackDialog.vue'
export { default as Onboarding } from './pages/Onboarding.vue'
export { default as SetupWizard } from './pages/SetupWizard.vue'
/*
 * `User` IS EXPORTED because the shell hands one out.
 *
 * `AppHeader`'s `userMenu` slot passes this value to the consuming
 * application, and a slot whose payload type is not importable forces every
 * consumer to re-declare the shape by hand - which compiles, then reads a
 * field the shell never sends.
 */
export type { Announcement, Passkey, TwoFactorConfigContent, User } from './types'

/*
 * THE SIGN-IN SCREENS - v0.5.0.
 *
 * Exported like every other page, and routed like none of them: they belong to
 * a PANEL rather than to the application, so `make:panel --auth` writes the
 * routes and the page shims. See `PanelAuthController`.
 */
export { default as AuthLayout } from './pages/auth/AuthLayout.vue'
export { default as Login } from './pages/auth/Login.vue'
export { default as ForgotPassword } from './pages/auth/ForgotPassword.vue'
export { default as ResetPassword } from './pages/auth/ResetPassword.vue'

/*
 * THE REST OF THE DEMO'S AUTH, MOVED RATHER THAN REDRAWN.
 *
 * The reference app had ten of these and the package shipped three, which is
 * most of what "the design does not come with it" meant. Each file below is the
 * demo's markup with its `@/components/ui/*` imports swapped for this package's
 * primitives and its Wayfinder route helpers swapped for props - because a
 * package cannot know a consuming application's route names.
 */
export { default as Register } from './pages/auth/Register.vue'
export { default as VerifyEmail } from './pages/auth/VerifyEmail.vue'
export { default as TwoFactorChallenge } from './pages/auth/TwoFactorChallenge.vue'
export { default as ConfirmPassword } from './pages/auth/ConfirmPassword.vue'
export { default as RenewPassword } from './pages/auth/RenewPassword.vue'
export { default as LockScreen } from './pages/auth/LockScreen.vue'
export { default as VerifyOtp } from './pages/auth/VerifyOtp.vue'
export { default as AuthField } from './components/AuthField.vue'
export { default as AuthTurnstile } from './components/AuthTurnstile.vue'
export { default as AuthPasskeyButton } from './components/AuthPasskeyButton.vue'
export { default as AuthInputError } from './components/AuthInputError.vue'
export { default as AuthTextLink } from './components/AuthTextLink.vue'
export {
    registerRenderHookComponent,
    resolveRenderHookComponent,
} from './components/renderHookRegistry'

/*
 * THE ACCOUNT'S SECURITY CONTROLS, moved from the reference app.
 *
 * Passkeys and two-factor were a solved problem there and absent from a fresh
 * installation - so every consumer either rebuilt them or shipped a panel where
 * "manage your sign-in" meant a password field and nothing else.
 *
 * Every route defaults to what `laravel/fortify` and `laravel/passkeys`
 * register, so an installation that took those as they came passes nothing.
 */
export { default as ManagePasskeys } from './components/security/ManagePasskeys.vue'
export { default as PasskeyItem } from './components/security/PasskeyItem.vue'
export { default as ManageTwoFactor } from './components/security/ManageTwoFactor.vue'
export { default as TwoFactorRecoveryCodes } from './components/security/TwoFactorRecoveryCodes.vue'
export { default as TwoFactorSetupModal } from './components/security/TwoFactorSetupModal.vue'
export { useTwoFactorAuth } from './composables/useTwoFactorAuth'
export type { TwoFactorRoutes, UseTwoFactorAuthReturn } from './composables/useTwoFactorAuth'
export { useOtpAutoSubmit, type OtpFormHandle } from './composables/useOtpAutoSubmit'

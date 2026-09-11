import { defineConfig } from 'vitepress'

const CURRENT_VERSION = '1.5.0'

export default defineConfig({
  title: 'PanelKit',
  description: 'Laravel + Vue + Inertia administration framework',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'PanelKit' }],
  ],
  sitemap: {
    hostname: 'https://alxtexh.github.io/panelkit/',
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/getting-started/', activeMatch: '^/(getting-started|resources|authentication|forms|tables|infolists|relation-managers|actions|authorization|navigation|money|customization|extending|commands|testing|deployment|troubleshooting)/' },
      { text: 'API Reference', link: '/api/', activeMatch: '^/api/' },
      { text: 'AI Blueprint', link: '/ai/', activeMatch: '^/ai/' },
      {
        text: CURRENT_VERSION,
        items: [
          { text: 'Changelog', link: 'https://github.com/Alxtexh/panelkit/blob/main/CHANGELOG.md' },
          { text: 'Source (this version)', link: `https://github.com/Alxtexh/panelkit/tree/v${CURRENT_VERSION}` },
        ],
      },
    ],
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },
    sidebar: {
      '/getting-started/': sidebarGuide(),
      '/resources/': sidebarGuide(),
      '/authentication/': sidebarGuide(),
      '/forms/': sidebarGuide(),
      '/tables/': sidebarGuide(),
      '/infolists/': sidebarGuide(),
      '/relation-managers/': sidebarGuide(),
      '/actions/': sidebarGuide(),
      '/authorization/': sidebarGuide(),
      '/navigation/': sidebarGuide(),
      '/money/': sidebarGuide(),
      '/customization/': sidebarGuide(),
      '/extending/': sidebarGuide(),
      '/commands/': sidebarGuide(),
      '/testing/': sidebarGuide(),
      '/deployment/': sidebarGuide(),
      '/troubleshooting/': sidebarGuide(),
      '/api/': sidebarApi(),
      '/ai/': sidebarAi(),
    },
    editLink: {
      pattern: 'https://github.com/Alxtexh/panelkit/edit/main/docs-site/:path',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Alxtexh/panelkit' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Alxtexh',
    },
    outline: {
      level: [2, 3],
    },
  },
})

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      items: [
        { text: 'What is PanelKit?', link: '/getting-started/' },
        { text: 'Philosophy', link: '/getting-started/philosophy' },
        { text: 'Architecture', link: '/getting-started/architecture' },
        { text: 'Requirements', link: '/getting-started/requirements' },
        { text: 'Installation', link: '/getting-started/installation' },
        { text: 'Quick start', link: '/getting-started/quick-start' },
        { text: 'Your first resource', link: '/getting-started/first-resource' },
        { text: 'Project structure', link: '/getting-started/project-structure' },
      ],
    },
    {
      text: 'Resources',
      items: [
        { text: 'Creating resources', link: '/resources/' },
        { text: 'Resource configuration', link: '/resources/#resource-configuration' },
        { text: 'Record titles', link: '/resources/#record-titles' },
        { text: 'Navigation metadata', link: '/resources/#resource-configuration' },
        { text: 'Row navigation', link: '/resources/#row-navigation' },
        { text: 'CRUD lifecycle hooks', link: '/resources/#crud-lifecycle-hooks' },
        { text: 'Custom queries', link: '/resources/#custom-queries' },
        { text: 'Nested resources', link: '/resources/nested-resources' },
        { text: 'Singular resources', link: '/resources/singular-resources' },
        { text: 'Global search', link: '/resources/global-search' },
      ],
    },
    {
      text: 'Authentication',
      items: [
        { text: 'Overview', link: '/authentication/' },
        { text: 'MFA (TOTP, email OTP, passkeys)', link: '/authentication/mfa' },
        { text: 'Social sign-in', link: '/authentication/social' },
        { text: 'Turnstile', link: '/authentication/turnstile' },
        { text: 'Registration & email verification', link: '/authentication/registration' },
      ],
    },
    {
      text: 'Forms',
      items: [
        { text: 'Form schema & layout', link: '/forms/' },
        { text: 'Text fields', link: '/forms/text-fields' },
        { text: 'Numbers & money', link: '/forms/numbers-and-money' },
        { text: 'Selects & relationships', link: '/forms/selects-and-relationships' },
        { text: 'Dates', link: '/forms/dates' },
        { text: 'Textarea, markdown, rich text, code', link: '/forms/text-content' },
        { text: 'Checkboxes & toggles', link: '/forms/checkboxes-and-toggles' },
        { text: 'Uploads', link: '/forms/uploads' },
        { text: 'Validation', link: '/forms/validation' },
        { text: 'Custom fields', link: '/forms/custom-fields' },
      ],
    },
    {
      text: 'Tables',
      items: [
        { text: 'Columns', link: '/tables/' },
        { text: 'Sorting, searching, filtering', link: '/tables/#sorting-searching-filtering' },
        { text: 'Pagination', link: '/tables/#pagination' },
        { text: 'Actions & bulk actions', link: '/tables/#actions-and-bulk-actions' },
        { text: 'Money, badges, dates', link: '/tables/#money-badges-dates' },
        { text: 'Joined & computed values', link: '/tables/#joined-computed-values' },
        { text: 'Row click navigation', link: '/tables/#row-click-navigation' },
      ],
    },
    {
      text: 'Infolists & View pages',
      items: [
        { text: 'Entries', link: '/infolists/' },
        { text: 'Automatic fallback', link: '/infolists/#automatic-fallback' },
        { text: 'Custom infolists', link: '/infolists/#custom-infolists' },
        { text: 'Independent View data', link: '/infolists/#independent-view-data' },
        { text: 'Relationship display', link: '/infolists/#relationship-display' }, // matches the now-plain "Relationship display" heading
      ],
    },
    {
      text: 'Relation Managers',
      items: [
        { text: 'Overview', link: '/relation-managers/' },
        { text: 'Simple RelationManager', link: '/relation-managers/simple' },
        { text: 'Resource-backed RelationManager', link: '/relation-managers/resource-backed' },
        { text: 'Capability comparison', link: '/relation-managers/capability-comparison' },
        { text: 'Example: Order → OrderItems → Product', link: '/relation-managers/example-orders' },
      ],
    },
    {
      text: 'Actions',
      items: [
        { text: 'Overview', link: '/actions/' },
        { text: 'Record actions', link: '/actions/record-actions' },
        { text: 'Bulk actions', link: '/actions/bulk-actions' },
        { text: 'Forms inside actions', link: '/actions/forms-in-actions' },
      ],
    },
    {
      text: 'Authorization',
      items: [
        { text: 'Overview', link: '/authorization/' },
        { text: 'Policies', link: '/authorization/#policies' },
        { text: 'Permissions', link: '/authorization/#permissions' },
        { text: 'Deny-by-default', link: '/authorization/#deny-by-default' },
        { text: 'Tenancy', link: '/authorization/#tenancy' },
        { text: 'Nested resources & relation managers', link: '/authorization/#nested-resources-relation-managers' },
      ],
    },
    {
      text: 'Navigation',
      items: [
        { text: 'Overview', link: '/navigation/' },
        { text: 'Icons', link: '/navigation/#icons' },
        { text: 'Sidebar behavior', link: '/navigation/#sidebar-behavior' },
        { text: 'panel:doctor', link: '/navigation/#panel-doctor' },
      ],
    },
    {
      text: 'Money',
      items: [
        { text: 'The money guide', link: '/money/' },
      ],
    },
    {
      text: 'Customization',
      items: [
        { text: 'Overview', link: '/customization/' },
        { text: 'Design tokens', link: '/customization/#design-tokens' },
        { text: 'Density', link: '/customization/#density' },
        { text: 'Layout & branding', link: '/customization/#branding' },
      ],
    },
    {
      text: 'Extending PanelKit',
      items: [
        { text: 'Overview', link: '/extending/' },
        { text: 'Custom fields', link: '/forms/custom-fields' },
        { text: 'Custom columns & entries', link: '/extending/custom-columns-and-entries' },
        { text: 'Custom pages', link: '/extending/custom-pages' },
        { text: 'Plugins', link: '/extending/plugins' },
        { text: 'Vue extension points', link: '/extending/vue-extension-points' },
      ],
    },
    {
      text: 'Commands',
      items: [
        { text: 'Command reference', link: '/commands/' },
      ],
    },
    {
      text: 'Testing',
      items: [
        { text: 'Testing PanelKit apps', link: '/testing/' },
      ],
    },
    {
      text: 'Deployment',
      items: [
        { text: 'Production checklist', link: '/deployment/' },
      ],
    },
    {
      text: 'Troubleshooting',
      items: [
        { text: 'Known failure modes', link: '/troubleshooting/' },
      ],
    },
  ]
}

function sidebarApi() {
  return [
    {
      text: 'API Reference',
      items: [
        { text: 'Overview', link: '/api/' },
        { text: 'Resource', link: '/api/classes/resource' },
        { text: 'Table', link: '/api/classes/table' },
        { text: 'TextColumn', link: '/api/classes/text-column' },
        { text: 'MoneyColumn', link: '/api/classes/money-column' },
        { text: 'BadgeColumn', link: '/api/classes/badge-column' },
        { text: 'TextField', link: '/api/classes/text-field' },
        { text: 'MoneyField', link: '/api/classes/money-field' },
        { text: 'SelectField', link: '/api/classes/select-field' },
        { text: 'DateField', link: '/api/classes/date-field' },
        { text: 'TextEntry', link: '/api/classes/text-entry' },
        { text: 'MoneyEntry', link: '/api/classes/money-entry' },
        { text: 'RelationManager', link: '/api/classes/relation-manager' },
        { text: 'Action', link: '/api/classes/action' },
        { text: 'Filter', link: '/api/classes/filter' },
        { text: 'Panel', link: '/api/classes/panel' },
        { text: 'All classes (generated)', link: '/api/all' },
      ],
    },
  ]
}

function sidebarAi() {
  return [
    {
      text: 'PanelKit AI Blueprint',
      items: [
        { text: 'Start here', link: '/ai/' },
        { text: '1. Core identity', link: '/ai/panelkit-core' },
        { text: '2. Resources', link: '/ai/resources' },
        { text: '3. Forms', link: '/ai/forms' },
        { text: '4. Tables', link: '/ai/tables' },
        { text: '5. Infolists', link: '/ai/infolists' },
        { text: '6. Relation managers', link: '/ai/relation-managers' },
        { text: '7. Money', link: '/ai/money' },
        { text: '8. Navigation', link: '/ai/navigation' },
        { text: '9. Authorization', link: '/ai/authorization' },
        { text: '10. Tenancy', link: '/ai/tenancy' },
        { text: '11. SaaS blueprint', link: '/ai/saas-blueprint' },
        { text: '12. Testing & verification', link: '/ai/testing' },
        { text: '13. Common errors', link: '/ai/common-errors' },
      ],
    },
  ]
}

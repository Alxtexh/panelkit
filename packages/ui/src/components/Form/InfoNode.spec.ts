import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InfoNode from './InfoNode.vue'
import type { InfoNode as InfoNodeType } from './InfoNode.vue'

describe('InfoNode - dedicated view entries', () => {
    const record = {
        title: 'Headline',
        cover: 'https://example.test/cover.png',
        meta: { region: 'west' },
        accent: '#7c3aed',
        snippet: '{"ok":true}',
        extras: [{ label: 'Docs', url: 'https://example.test' }],
    }

    it('renders an image entry', () => {
        const node: InfoNodeType = {
            component: 'entry',
            key: 'cover',
            label: 'Cover',
            type: 'image',
        }

        const html = mount(InfoNode, { props: { node, record } }).html()

        expect(html).toContain('https://example.test/cover.png')
        expect(html).toContain('Cover')
    })

    /**
     * `BadgeEntry` has no `->labels()`, so this always renders the raw
     * stored value - and `capitalize` alone turned `in_progress` into
     * "In_progress" (it does not know `_` is a word boundary). Confirmed
     * live on a Ticket's Status entry by Phase 6's audit.
     */
    it('humanizes a snake_case badge value', () => {
        const node: InfoNodeType = {
            component: 'entry',
            key: 'status',
            label: 'Status',
            type: 'badge',
        }

        const wrapper = mount(InfoNode, {
            props: { node, record: { ...record, status: 'in_progress' } },
        })

        // `capitalize` (CSS text-transform) does the per-word upper-casing
        // visually; jsdom's text() reflects the DOM text node, not the paint,
        // so this asserts the separator was swapped for a space and the
        // `capitalize` class is what turns it into "In Progress" on screen.
        expect(wrapper.text()).toContain('in progress')
        expect(wrapper.text()).not.toContain('in_progress')
        expect(wrapper.find('.capitalize').text()).toBe('in progress')
    })

    it('renders key-value pairs', () => {
        const node: InfoNodeType = {
            component: 'entry',
            key: 'meta',
            label: 'Meta',
            type: 'keyvalue',
        }

        const text = mount(InfoNode, { props: { node, record } }).text()

        expect(text).toContain('region')
        expect(text).toContain('west')
    })

    it('renders a colour swatch', () => {
        const node: InfoNodeType = {
            component: 'entry',
            key: 'accent',
            label: 'Accent',
            type: 'color',
        }

        const html = mount(InfoNode, { props: { node, record } }).html()

        expect(html).toContain('#7c3aed')
        expect(html).toContain('background-color')
    })

    it('renders a code block with a language hint', () => {
        const node: InfoNodeType = {
            component: 'entry',
            key: 'snippet',
            label: 'Snippet',
            type: 'code',
            language: 'json',
        }

        const text = mount(InfoNode, { props: { node, record } }).text()

        expect(text).toContain('json')
        expect(text).toContain('{"ok":true}')
    })

    it('renders repeatable child entries', () => {
        const node: InfoNodeType = {
            component: 'entry',
            key: 'extras',
            label: 'Extras',
            type: 'repeatable',
            entries: [
                { component: 'entry', key: 'label', label: 'Label', type: 'text' },
                { component: 'entry', key: 'url', label: 'Url', type: 'text' },
            ],
        }

        const text = mount(InfoNode, { props: { node, record } }).text()

        expect(text).toContain('Docs')
        expect(text).toContain('https://example.test')
    })

    it('keeps url and action on a text entry', () => {
        const node: InfoNodeType = {
            component: 'entry',
            key: 'title',
            label: 'Title',
            type: 'text',
            url: 'https://example.test/articles',
            action: { key: 'copy', label: 'Copy' },
        }

        const wrapper = mount(InfoNode, { props: { node, record } })

        expect(wrapper.find('a').attributes('href')).toBe('https://example.test/articles')
        expect(wrapper.text()).toContain('Copy')
    })

    it('uses quiet labels, loud values, and None for blanks', () => {
        const node: InfoNodeType = {
            component: 'section',
            label: 'Identity',
            children: [
                { component: 'entry', key: 'title', label: 'Title', type: 'text' },
                { component: 'entry', key: 'missing', label: 'Missing', type: 'text' },
            ],
        }

        const wrapper = mount(InfoNode, {
            props: {
                node,
                record: { title: 'Headline', missing: null },
            },
        })

        const dts = wrapper.findAll('dt')

        expect(dts[0].classes()).toContain('uppercase')
        expect(dts[0].classes()).toContain('text-muted-foreground')
        expect(wrapper.find('dd').classes()).toContain('font-medium')
        expect(wrapper.text()).toContain('—')
        expect(wrapper.find('section').classes()).toContain('rounded-xl')
        expect(wrapper.find('dl').classes().join(' ')).toMatch(/sm:grid-cols-2/)
    })

    it('renders a registered ViewEntry component', async () => {
        const { registerEntryView, resetEntryViews } =
            await import('../../composables/useEntryViews')
        const { defineComponent } = await import('vue')

        resetEntryViews()
        registerEntryView(
            'invoice-summary',
            defineComponent({
                name: 'InvoiceSummary',
                props: ['node', 'record', 'value'],
                template: '<div data-testid="custom-view">{{ value }} summary</div>',
            }),
        )

        const node: InfoNodeType = {
            component: 'entry',
            key: 'title',
            label: 'Preview',
            type: 'view',
            view: 'invoice-summary',
        }

        const wrapper = mount(InfoNode, { props: { node, record } })

        expect(wrapper.get('[data-testid="custom-view"]').text()).toContain('Headline summary')
        resetEntryViews()
    })

    it('reports a missing ViewEntry registration', () => {
        const node: InfoNodeType = {
            component: 'entry',
            key: 'title',
            label: 'Preview',
            type: 'view',
            view: 'missing-view',
        }

        const text = mount(InfoNode, { props: { node, record } }).text()

        expect(text).toContain('No entry view for [missing-view]')
    })
})

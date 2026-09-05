import { describe, expect, it } from 'vitest'
import { packWidgetColumns } from './packWidgetColumns'

describe('packWidgetColumns', () => {
    it('keeps declaration order in a single column', () => {
        const items = [
            { key: 'a', span: 1 },
            { key: 'b', span: 1 },
            { key: 'c', span: 1 },
        ]

        expect(packWidgetColumns(items, 1)).toEqual([{ type: 'columns', columns: [items] }])
    })

    it('round-robins span-1 widgets so each column stacks independently', () => {
        const signups = { key: 'signups', span: 1 }
        const look = { key: 'look', span: 1 }
        const newest = { key: 'newest', span: 1 }

        expect(packWidgetColumns([signups, look, newest], 2)).toEqual([
            {
                type: 'columns',
                columns: [[signups, newest], [look]],
            },
        ])
    })

    it('places span-2 widgets on their own full-width band', () => {
        const wide = { key: 'sessions', span: 2 }
        const left = { key: 'status', span: 1 }
        const right = { key: 'plans', span: 1 }

        expect(packWidgetColumns([wide, left, right], 2)).toEqual([
            { type: 'wide', item: wide },
            { type: 'columns', columns: [[left], [right]] },
        ])
    })

    it('reads a responsive span object by its lg value', () => {
        const wide = { key: 'sessions', span: { default: 1, lg: 2 } }
        const narrow = { key: 'status', span: { default: 1, lg: 1 } }

        expect(packWidgetColumns([wide, narrow], 2)).toEqual([
            { type: 'wide', item: wide },
            { type: 'columns', columns: [[narrow]] },
        ])
    })

    it('falls back to default, then the largest breakpoint, when lg is absent', () => {
        const usesDefault = { key: 'a', span: { default: 2 } }
        const usesMax = { key: 'b', span: { sm: 1, md: 3 } }

        expect(packWidgetColumns([usesDefault], 2)).toEqual([{ type: 'wide', item: usesDefault }])
        expect(packWidgetColumns([usesMax], 2)).toEqual([{ type: 'wide', item: usesMax }])
    })
})

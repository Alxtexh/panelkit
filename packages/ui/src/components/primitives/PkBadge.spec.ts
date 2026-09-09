import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PkBadge from './PkBadge.vue'

describe('PkBadge', () => {
    it('is a solid fill by default', () => {
        const wrapper = mount(PkBadge, { props: { variant: 'success' } })
        const classes = wrapper.get('[data-slot="badge"]').classes()

        expect(classes).toContain('bg-success')
        expect(classes).not.toContain('bg-success/15')
    })

    it('tints instead of filling when soft', () => {
        const wrapper = mount(PkBadge, { props: { variant: 'success', soft: true } })
        const classes = wrapper.get('[data-slot="badge"]').classes()

        expect(classes).toContain('bg-success/15')
        expect(classes).not.toContain('bg-success')
    })

    it('leaves outline unaffected by soft, since it has no fill to soften', () => {
        const solid = mount(PkBadge, { props: { variant: 'outline' } })
        const soft = mount(PkBadge, { props: { variant: 'outline', soft: true } })

        expect(solid.get('[data-slot="badge"]').classes()).toEqual(
            soft.get('[data-slot="badge"]').classes(),
        )
    })
})

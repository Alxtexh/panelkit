<script setup lang="ts">
/**
 * A switch: on or off, applied immediately in intent.
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT A SECOND CHECKBOX. `ToggleField` rendered
 * a bare `<input type="checkbox">`, so Alxtexhpanel had one control wearing two
 * names - the field was called a toggle and drew a checkbox. Adding a
 * `CheckboxField` beside it would have shipped a second name for the same
 * markup, which is a seam with nothing behind it.
 *
 * The two are different affordances and readers know the difference:
 *
 *   - a SWITCH is a setting. "Notifications: on." It reads as state.
 *   - a CHECKBOX is a selection or an assertion. "I agree." It reads as a
 *     thing you tick as part of filling something in.
 *
 * So the switch is built, `toggle` moves onto it, and `checkbox` gets the
 * checkbox that was already in the tree. Both names now describe what they draw.
 */
import { reactiveOmit } from '@vueuse/core'
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../../lib/cn'

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<SwitchRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)
</script>

<template>
    <!--
        `aria-invalid:border-destructive`, matching `Checkbox.vue`'s
        already-established pattern one file over - Switch has a
        transparent border in its unchecked/neutral state, so turning
        it destructive-coloured on invalid is the same "always-visible
        signal, ring only reinforces on focus" convention every other
        control in this file uses, not a new one invented for Switch.
    -->
    <SwitchRoot
        data-slot="switch"
        v-bind="forwarded"
        :class="
            cn(
                'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                props.class,
            )
        "
    >
        <SwitchThumb
            data-slot="switch-thumb"
            class="bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        />
    </SwitchRoot>
</template>

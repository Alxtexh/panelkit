# What Alxtexhpanel's interface is built on, and why

Part G.8. The question asked was direct: Nuxt UI, Naive UI, Reka (Radix Vue),
Headless UI or Ark UI — which is the **Enterprise Ready Workhorse**, and which
is the **Lightweight High Performance Pick**?

The answer for this codebase is that **one choice is both**, and we are already
most of the way into it.

## The constraint that decides it

Alxtexhpanel is **Vue 3 + Inertia + Laravel. It is not Nuxt.** That is not a
preference, it is the architecture: pages are served by Laravel controllers and
mounted by Inertia, there is no Nuxt server, no Nitro, no `app.vue`, no
auto-imports and no module system to install a Nuxt module into.

That single fact rules on half the list before any comparison of components:

| Library | Verdict here |
| --- | --- |
| **Nuxt UI** | Its Vue-without-Nuxt mode exists, but the value of Nuxt UI is the Nuxt integration — modules, auto-imports, app config theming. Taking it without Nuxt means importing a large component library and leaving most of what you paid for on the table. Its **templates** are still worth reading for landing-page composition (G.9). |
| **Naive UI** | Genuinely good, genuinely complete, and a whole design language with its own runtime and its own theming system. Adopting it means our Tailwind tokens stop being the source of truth and every existing screen gets rebuilt to match somebody else's look. That is a rewrite, not an upgrade. |
| **Headless UI** | Correct instinct — behaviour without appearance — but the Vue port is the smaller sibling of the React one, and its component set stops well short of what a panel needs (no combobox parity, no date primitives, no toast). |
| **Ark UI** | Excellent state-machine primitives (Zag), framework-agnostic, and the closest genuine rival. It is heavier in concept than we need and would be a second primitive layer beside the one already in place. |
| **Reka UI** (Radix Vue) | **This is our foundation, and it already is.** |

## The decision

**Reka UI primitives + shadcn-style components we own + Tailwind tokens,
all living in `@alxtexh-enterprise/panel`.**

It is the **Enterprise Workhorse** because:

- accessibility is in the primitive, not in our review checklist — focus
  traps, roving tabindex, `aria-*` wiring, dismiss behaviour;
- **we own the markup.** Every component is a file in this repo. There is no
  vendor release that changes how a panel looks, and no upstream deprecation
  that strands a screen;
- theming is Tailwind tokens, so a tenant's brand colour flows through
  everything without a second theming system to teach it;
- there is no runtime design language to fight when a customer wants their own.

It is simultaneously the **Lightweight High Performance Pick** because
headless primitives ship behaviour, not a component runtime: the bytes are the
components we actually use, tree-shaken, with no global CSS bundle and no
theme engine loaded on first paint.

## The rule this creates

**One copy of every shared component, in `@alxtexh-enterprise/panel`.** Not a copy in the
playground, not a near-copy in a generated portal. Where a component exists in
both places today, the package version is the survivor and the application
imports it. The same rule holds for shared functions: a helper that two screens
need lives in the package, not in whichever page needed it first.

The reason is the one the user gave, and it is the correct one: duplicated
copies drift, and drift is invisible until the day two screens disagree in
front of a customer.

## The de-duplication sweep

**Done:** the application-owned duplicate component folders were removed or
reduced to package re-exports. The application no longer carries separate
button, skeleton, dropdown-menu, dialog, badge, collapsible, or select
implementations that can drift from the package.

**The trap, for whoever finishes this:** the remaining overlaps are **not
drop-in swaps**, and treating them as a find-and-replace would break real
behaviour.

| Pair | Why it is not a rename |
| --- | --- |
| app `button` (34 files) ↔ `PkButton` | The app's is a reka-ui `Primitive` and supports **`as-child`**; `PkButton` deliberately does not — see its own note on the two-interactive-elements bug that omission was made to prevent. Call sites using `as-child` need `buttonClasses()` on their own element instead. |
| app `skeleton` ↔ `PkSkeleton` | Different concepts wearing one name. The app's is a bare `class`-driven `div`; `PkSkeleton` is a **named-variant** placeholder (`text`, `row`, `circle`, with counts) so six call sites cannot each invent a height. Its one consumer, `SidebarMenuSkeleton`, wants the bare div. |
| app `dropdown-menu` (4 files) ↔ `PkDropdown` | Composed parts versus one component with an items prop. Genuinely different APIs. |

The migration is complete for the current application. Future shared
components must follow the same rule: add them to the package first, expose a
stable public contract, and make application shims re-export that contract
instead of introducing a second implementation.

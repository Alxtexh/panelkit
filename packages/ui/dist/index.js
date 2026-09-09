import './ui.css';
import { defineComponent as L, useSlots as Yt, openBlock as t, createElementBlock as n, normalizeClass as z, unref as x, renderSlot as K, createElementVNode as l, toDisplayString as f, createCommentVNode as b, computed as y, normalizeStyle as ie, Fragment as _, renderList as j, ref as q, watch as pe, useId as Xe, withModifiers as he, createTextVNode as U, createVNode as I, createStaticVNode as ut, createBlock as T, createSlots as ct, withCtx as O, nextTick as De, onBeforeUnmount as ke, Teleport as pt, Transition as et, onMounted as be, withDirectives as ge, vModelText as ze, mergeProps as de, normalizeProps as Le, guardReactiveProps as Re, resolveDynamicComponent as Ce, resolveComponent as Qt, vModelSelect as Ze, vModelDynamic as va, defineAsyncComponent as hn, inject as wt, vShow as Ke, withKeys as Ft, onUnmounted as ga, isRef as ha, useTemplateRef as ba, onErrorCaptured as ya, provide as Nt, reactive as ft, useModel as vt, mergeModels as Ne, markRaw as xa, shallowRef as ka, getCurrentInstance as On, watchEffect as $a } from "vue";
import { useForwardPropsEmits as ye, DialogRoot as jn, DialogOverlay as Xt, DialogPortal as en, DialogContent as tn, DialogClose as tt, CheckboxRoot as wa, CheckboxIndicator as Ca, SwitchRoot as Sa, SwitchThumb as Ma, DialogDescription as Vn, DialogTitle as Dn, DialogTrigger as Tn, createContext as Ba, Primitive as nt, TooltipRoot as Aa, TooltipPortal as za, TooltipContent as _a, TooltipArrow as Pa, TooltipProvider as In, TooltipTrigger as La, Separator as Oa, DropdownMenuRoot as ja, DropdownMenuCheckboxItem as Va, DropdownMenuItemIndicator as En, DropdownMenuPortal as Da, DropdownMenuContent as Ta, DropdownMenuGroup as Ia, useForwardProps as Oe, DropdownMenuItem as Ea, DropdownMenuLabel as Fa, DropdownMenuRadioGroup as Na, DropdownMenuRadioItem as Ra, DropdownMenuSeparator as Ua, DropdownMenuSub as Ha, DropdownMenuSubContent as qa, DropdownMenuSubTrigger as Ka, DropdownMenuTrigger as Ga, AvatarRoot as Wa, AvatarFallback as Za, AvatarImage as Ja, NavigationMenuViewport as Ya, NavigationMenuRoot as Qa, NavigationMenuContent as Xa, NavigationMenuIndicator as el, NavigationMenuItem as tl, NavigationMenuLink as nl, NavigationMenuList as al, NavigationMenuTrigger as ll, Label as ol } from "reka-ui";
import { DropdownMenuPortal as HS } from "reka-ui";
import { X as nn, Check as Fn, AlertCircle as sl, EyeOff as rl, Eye as il, PanelLeftOpen as dl, PanelLeftClose as ul, Circle as cl, ChevronRight as Nn, MoreHorizontal as fl, ChevronDown as ml, Loader2Icon as pl } from "@lucide/vue";
import { reactiveOmit as ve, useVModel as Rn, useMediaQuery as vl, useEventListener as gl, defaultDocument as hl } from "@vueuse/core";
import { clsx as bl } from "clsx";
import { twMerge as yl } from "tailwind-merge";
import { usePage as an, Link as Rt } from "@inertiajs/vue3";
import { cva as ln } from "class-variance-authority";
const $t = {
  /* -------------------------------------------------- state and feedback */
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  dot: "M12 12h.01",
  alert: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  clock: "M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  star: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z",
  pause: "M10 4v16M14 4v16",
  play: "m5 3 14 9-14 9V3Z",
  /* ------------------------------------------------------------ network */
  wifi: "M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01M2 8.8a15 15 0 0 1 20 0",
  "wifi-off": "M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.6M2 8.8a15 15 0 0 1 4.2-2.5M22 8.8a15 15 0 0 0-6-3.4M12 20h.01",
  plus: "M5 12h14M12 5v14",
  minus: "M5 12h14",
  search: "M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14",
  /* ------------------------------------------------------------ actions */
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  "eye-off": "M10.7 5.1A11 11 0 0 1 12 5c7 0 10 7 10 7a13 13 0 0 1-1.6 2.4M9.9 4.2 2 2l20 20M6.7 6.7C3.4 8.8 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4.4-1M9.9 9.9a3 3 0 0 0 4.2 4.2",
  pencil: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  trash: "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
  copy: "M9 9h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z M5 15H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1",
  ban: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M4.9 4.9l14.2 14.2",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  // `undo` was declared by the Restore action and had no path here, so it
  // silently rendered the fallback dot - a bulk action that looked unfinished
  // rather than one whose icon was missing.
  undo: "M3 7v6h6M3.5 13a9 9 0 1 0 2.1-9.4L3 7",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  "user-check": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M16 11l2 2 4-4",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  refresh: "M21 2v6h-6M3 22v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L21 8M21 15a9 9 0 0 1-14.9 3.4L3 16",
  send: "m22 2-7 20-4-9-9-4Z M22 2 11 13",
  cart: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0",
  key: "M15.5 2a6.5 6.5 0 1 0-5.6 9.8L2 19.7V22h2.3l1-1v-2h2v-2h2l1.9-1.9A6.5 6.5 0 0 0 15.5 2Z M17 7h.01",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
  archive: "M21 8v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8M2 4h20v4H2zM10 12h4",
  /* ------------------------------------------------------------ chrome */
  "more-horizontal": "M12 12h.01M19 12h.01M5 12h.01",
  // Vertical, because the actions column is narrow and a horizontal glyph
  // reads as "more columns this way" next to a scrollable table.
  "more-vertical": "M12 12h.01M12 19h.01M12 5h.01",
  "chevron-right": "m9 18 6-6-6-6",
  "chevron-down": "m6 9 6 6 6-6",
  /* -------------------------------------------------------- destinations */
  /*
   * THE NAVIGATION SET, AND ITS ABSENCE WAS VISIBLE ON EVERY PHONE.
   *
   * Everything above is an ACTION - the vocabulary of a row menu and a
   * confirmation dialog - because that is all this registry was ever asked
   * for. Then the bottom bar started drawing the same navigation the sidebar
   * draws, and the sidebar resolves its icons through Lucide components while
   * this resolves them through these paths. Every name the server sends -
   * `users`, `router`, `mail`, `home` - was missing, `iconPath()` fell back to
   * the dot for all of them, and the bar rendered five identical specks above
   * five labels.
   *
   * Nothing failed. The fallback is deliberate and correct, and it made an
   * entirely unusable navigation look like a design choice.
   *
   * NAMES MATCH THE SERVER'S VOCABULARY, not Lucide's file names, because a
   * resource says `->icon('router')` and neither half should have to know what
   * the other calls it.
   */
  home: "M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z M9 21v-8h6v8",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8",
  package: "M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z m3.3 7L12 12l8.7-5 M12 22V12 m7.5 4.3 9 5.1",
  router: "M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z M6.01 17H6 M10.01 17H10 M15 10v2 M17.8 7.2a4 4 0 0 0-5.6 0 M20.7 4.3a8 8 0 0 0-11.4 0",
  mail: "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z m22 6-10 7L2 6",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0",
  chat: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
  "book-open": "M12 7v14 M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z",
  smartphone: "M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z M12 18h.01",
  lock: "M7 11V7a5 5 0 0 1 10 0v4 M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z",
  // Same gap as the rest of this section: the sidebar's Settings row
  // resolves through `panelIcons.ts` (Lucide components) and had its own
  // matching miss there. This is that icon's path data, copied from
  // `@lucide/vue`'s `settings.mjs` rather than hand-drawn, so the bottom
  // bar's gear is pixel-identical to the sidebar's.
  settings: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915 M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  gauge: "m12 14 4-4 M3.3 19a10 10 0 1 1 17.4 0",
  "file-text": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z M14 2v4a2 2 0 0 0 2 2h4 M16 13H8 M16 17H8 M10 9H8",
  "file-question": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z M15 2v5h5 M10 11a2 2 0 1 1 2 2v1 M12 17h.01",
  "server-crash": "M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2 M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2 M6 6h.01 M6 18h.01 M13 6l-3 5h4l-3 5",
  "shield-alert": "M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.5 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z M12 8v4 M12 16h.01",
  "timer-off": "M10 2h4 M12 12v-2 M4.6 11a8 8 0 0 0 10.4 10.4 M7.4 7.4a8 8 0 0 1 11.2 11.2 M2 2l20 20",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9Z",
  // Configuring the SHAPE of something rather than repairing it, which is
  // what `wrench` already says - the custom-fields screen decides which
  // fields a resource has, and sliders read as "adjust these settings".
  sliders: "M21 4h-7 M10 4H3 M21 12h-9 M8 12H3 M21 20h-5 M12 20H3 M12 2v4 M6 10v4 M14 18v4",
  menu: "M4 6h16M4 12h16M4 18h16",
  /*
   * NINE MORE OF THE SAME GAP - `DeclaredIconsExistTest` names every icon
   * `app/Panel/Pages.php` declares and checks each has a path here; these
   * nine did not, so the reference app's own nav fell back to the dot on
   * a phone the same way `undo` and the row-menu names above once did.
   * Copied from `@lucide/vue`'s icon sources (`node_modules/@lucide/vue/
   * dist/esm/icons/*.mjs`), including converting each icon's `<rect rx>`
   * primitive into the equivalent rounded-corner path by hand - this
   * registry holds `<path d>` strings only, no nested shape elements.
   *
   * A LOWERCASE `m` STARTING A LATER SUBPATH IS NOT ABSOLUTE, and joining
   * several Lucide icons' separate `<path>` elements into one `d` string
   * hits this the moment one of them originally started with lowercase
   * `m`. SVG only treats the very FIRST moveto in an entire path string as
   * absolute either way; every subsequent `m` is relative to wherever the
   * previous subpath ended, not a fresh (0,0) - `panel-left-close`'s
   * chevron and `chevrons-up-down`'s second arrow both silently moved
   * off-canvas as a result. Capitalising that `m` to `M` is only HALF the
   * fix: an SVG moveto's own trailing coordinate pairs are implicit
   * linetos in the SAME case as the moveto, so `M16 15-3-3 3-3` draws an
   * ABSOLUTE line out to (-3,-3) - nowhere near the chevron. The pairs
   * after the first need their own explicit lowercase `l` to stay
   * relative: `M16 15l-3-3 3-3`. Caught by actually rendering these to
   * PNG and looking, not by reading the coordinates.
   */
  "panel-left": "M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z M9 3v18",
  "panel-left-close": "M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z M9 3v18 M16 15l-3-3 3-3",
  square: "M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z",
  layers: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12 M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
  "app-window": "M4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H4A2 2 0 0 1 2 18V6A2 2 0 0 1 4 4Z M10 4v4 M2 8h20 M6 4v4",
  "app-window-mac": "M4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H4A2 2 0 0 1 2 18V6A2 2 0 0 1 4 4Z M6 8h.01 M10 8h.01 M14 8h.01",
  "chevrons-up-down": "m7 15 5 5 5-5 M7 9l5-5 5 5",
  "folder-tree": "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z M3 5a2 2 0 0 0 2 2h3 M3 3v13a2 2 0 0 0 2 2h3",
  calendar: "M8 2v3 M16 2v3 M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z M3 9h18",
  /*
   * ROW-MENU VOCABULARY that hosts declare without always shipping a path.
   *
   * `log-in` / `impersonate` and `coins` / `wallet` / `recharge` are the
   * names that turned into the fallback `dot` on Users row menus: a coloured
   * speck beside "Recharge Credits" and "Log in as user", while Delete
   * looked finished because the destructive branch hard-coded `trash`.
   */
  "log-in": "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  wallet: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3V5a2 2 0 0 1 2-2",
  coins: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8 M12 18V6",
  "credit-card": "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z M2 10h20",
  // Hollow ring: used when a coloured action still has no semantic glyph, so
  // the tone paints a readable mark instead of a one-pixel speck.
  circle: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01"
}, xl = {
  login: "log-in",
  "login-as": "log-in",
  "log-in-as": "log-in",
  impersonate: "log-in",
  "user-check": "user-check",
  recharge: "coins",
  credits: "coins",
  "recharge-credits": "coins",
  "currency-dollar": "coins",
  "currency-euro": "coins",
  banknotes: "wallet",
  "heroicon-o-currency-dollar": "coins",
  "heroicon-m-currency-dollar": "coins",
  "heroicon-o-wallet": "wallet",
  "heroicon-o-arrow-left-on-rectangle": "log-in",
  "arrow-left-on-rectangle": "log-in",
  "arrow-right-on-rectangle": "log-in"
}, bn = {
  delete: "trash",
  __delete: "trash",
  destroy: "trash",
  "force-delete": "trash",
  forceDelete: "trash",
  force_delete: "trash",
  impersonate: "log-in",
  "login-as": "log-in",
  "log-in-as": "log-in",
  "log-in-as-user": "log-in",
  login_as: "log-in",
  loginAs: "log-in",
  recharge: "coins",
  "recharge-credits": "coins",
  recharge_credits: "coins",
  credits: "coins",
  view: "eye",
  edit: "pencil",
  restore: "undo",
  replicate: "copy",
  duplicate: "copy",
  export: "download",
  download: "download",
  suspend: "ban",
  activate: "play",
  ban: "ban"
}, yn = {
  success: "coins",
  danger: "trash",
  warning: "alert",
  primary: "activity",
  info: "info",
  gray: "circle"
};
function me(e) {
  if (!e)
    return $t.dot;
  const o = xl[e] ?? e;
  return $t[o] ?? $t.dot;
}
function Te(e) {
  if (e.icon) {
    const s = me(e.icon);
    if (s !== $t.dot || e.icon === "dot")
      return s;
  }
  const o = (e.key ?? "").trim();
  if (o) {
    const s = bn[o] ?? bn[o.replace(/_/g, "-")];
    if (s)
      return me(s);
  }
  const a = kl(e.label);
  if (a)
    return me(a);
  if (e.destructive)
    return me("trash");
  const r = e.color ?? "";
  return r && yn[r] ? me(yn[r]) : me("circle");
}
function kl(e) {
  if (!e)
    return null;
  const o = e.toLowerCase();
  return /\b(delete|remove|destroy|trash)\b/.test(o) ? "trash" : /\b(log\s*in|impersonat|sign\s*in\s+as)\b/.test(o) ? "log-in" : /\b(recharge|credit|wallet|top\s*up|topup)\b/.test(o) ? "coins" : /\b(edit|update)\b/.test(o) ? "pencil" : /\b(view|open|show)\b/.test(o) ? "eye" : /\b(restore|undo)\b/.test(o) ? "undo" : /\b(copy|replicate|duplicate)\b/.test(o) ? "copy" : /\b(export|download)\b/.test(o) ? "download" : /\b(suspend|ban|block)\b/.test(o) ? "ban" : /\b(activate|resume|enable)\b/.test(o) ? "play" : null;
}
const $l = {
  key: 0,
  class: "flex max-w-xs items-center justify-center",
  "aria-hidden": "true"
}, wl = ["d"], Cl = { class: "flex max-w-sm flex-col gap-1" }, Sl = {
  key: 0,
  class: "text-sm font-normal"
}, Ml = {
  key: 2,
  class: "mt-1 flex flex-wrap items-center justify-center gap-2"
}, Ut = /* @__PURE__ */ L({
  __name: "PkEmptyState",
  props: {
    title: {},
    description: {},
    icon: { default: "package" },
    compact: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = Yt();
    return (a, r) => (t(), n("div", {
      "data-slot": "empty-state",
      class: z(["text-muted-foreground flex flex-col items-center justify-center text-center", e.compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-12"]),
      role: "status"
    }, [
      x(o).illustration ? (t(), n("div", $l, [
        K(a.$slots, "illustration")
      ])) : (t(), n("div", {
        key: 1,
        class: z(["bg-muted text-muted-foreground flex items-center justify-center rounded-full", e.compact ? "size-10" : "size-12"]),
        "aria-hidden": "true"
      }, [
        K(a.$slots, "icon", {}, () => [
          (t(), n("svg", {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.75",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            class: z(e.compact ? "size-5" : "size-6")
          }, [
            l("path", {
              d: x(me)(e.icon)
            }, null, 8, wl)
          ], 2))
        ])
      ], 2)),
      l("div", Cl, [
        l("p", {
          class: z(["text-foreground font-medium", e.compact ? "text-sm" : "text-base"])
        }, f(e.title), 3),
        e.description ? (t(), n("p", Sl, f(e.description), 1)) : b("", !0)
      ]),
      a.$slots.actions ? (t(), n("div", Ml, [
        K(a.$slots, "actions")
      ])) : b("", !0)
    ], 2));
  }
}), Bl = ["aria-label"], Pe = /* @__PURE__ */ L({
  __name: "PkSkeleton",
  props: {
    variant: { default: "text" },
    count: { default: 1 },
    height: {},
    label: { default: "Loading" }
  },
  setup(e) {
    const o = e, a = {
      text: "h-4 w-full",
      number: "h-6 w-24",
      badge: "h-4 w-7",
      block: "h-full w-full",
      row: "h-9 w-full",
      circle: "size-8 rounded-full"
    }, r = y(() => a[o.variant] ?? a.text), s = y(() => Math.max(1, Math.min(o.count, 50)));
    function i(d) {
      if (!(o.variant !== "text" || s.value === 1))
        return d === s.value - 1 ? "60%" : void 0;
    }
    return (d, u) => (t(), n("div", {
      role: "status",
      "aria-label": e.label,
      "aria-live": "polite",
      class: "flex flex-col gap-2",
      style: ie(e.height ? { height: `${e.height}px` } : void 0)
    }, [
      (t(!0), n(_, null, j(s.value, (c) => (t(), n("span", {
        key: c,
        "aria-hidden": "true",
        class: z(["bg-muted motion-safe:animate-pulse rounded", r.value]),
        style: ie({
          width: i(c - 1),
          height: e.height && e.variant === "block" ? `${e.height}px` : void 0
        })
      }, null, 6))), 128))
    ], 12, Bl));
  }
}), Al = { class: "w-max min-w-full border-collapse text-sm" }, zl = { class: "bg-background sticky top-0 z-10" }, _l = {
  key: 0,
  class: "bg-muted/40"
}, Pl = {
  key: 0,
  class: "w-8 border-b px-2 py-1.5"
}, Ll = {
  key: 1,
  class: "w-10 border-b px-3 py-1.5"
}, Ol = ["colspan"], jl = {
  key: 2,
  class: "pk-actions bg-muted/40 sticky right-0 w-12 border-b border-l px-2 py-1.5 shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, Vl = { class: "bg-muted/50" }, Dl = {
  key: 0,
  class: "w-8 border-b px-2 py-2.5"
}, Tl = ["id", "checked", "indeterminate"], Il = ["onClick"], El = {
  key: 0,
  class: "text-xs"
}, Fl = {
  key: 1,
  class: "text-xs opacity-40"
}, Nl = { key: 1 }, Rl = ["aria-label", "onPointerdown"], Ul = {
  key: 2,
  class: "pk-actions bg-muted/50 sticky right-0 w-12 border-b border-l px-2 py-2.5 shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, Hl = {
  key: 0,
  "data-slot": "table-skeleton",
  class: "transition-opacity"
}, ql = {
  key: 0,
  class: "w-8 px-2 py-2.5"
}, Kl = {
  key: 1,
  class: "px-3 py-2.5"
}, Gl = {
  key: 2,
  class: "px-2 py-2.5"
}, Wl = {
  key: 0,
  class: "bg-muted/40"
}, Zl = ["colspan"], Jl = ["aria-expanded", "dusk", "onClick"], Yl = {
  class: "text-[9px]",
  "aria-hidden": "true"
}, Ql = {
  key: 1,
  dusk: "group-header"
}, Xl = ["draggable", "onDragstart", "onDragover", "onDrop", "onContextmenu", "onClick"], eo = {
  key: 0,
  class: "w-8 px-2 py-2 align-middle"
}, to = ["id", "value", "checked", "disabled", "aria-label", "onClick"], no = {
  key: 0,
  class: "inline-flex items-center gap-1.5"
}, ao = ["aria-label", "onClick"], lo = { class: "text-xs" }, oo = {
  key: 1,
  class: "text-muted-foreground"
}, so = { key: 2 }, ro = {
  key: 2,
  class: "pk-actions bg-background group-hover:bg-muted/40 sticky right-0 border-l px-2 py-2 text-right shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, io = {
  key: 2,
  class: "bg-muted/40 border-t-2"
}, uo = { key: 0 }, co = { class: "text-muted-foreground block text-[10px] font-medium" }, fo = { class: "font-semibold tabular-nums" }, mo = { key: 1 }, po = 40, vo = /* @__PURE__ */ L({
  __name: "DataTable",
  props: {
    columns: {},
    rows: {},
    groupBy: {},
    collapsedGroupsByDefault: { type: Boolean, default: !1 },
    reordering: { type: Boolean },
    rowClickable: { type: Boolean },
    rowKey: { default: "id" },
    sort: {},
    direction: { default: "desc" },
    loading: { type: Boolean, default: !1 },
    hidden: {},
    selectable: { type: Boolean, default: !1 },
    selected: {},
    filtered: { type: Boolean, default: !1 },
    emptyTitle: { default: "Nothing here yet" },
    emptyHint: {},
    emptyIcon: { default: "package" },
    summaries: { default: null },
    summaryValues: { default: null },
    framed: { type: Boolean, default: !0 },
    striped: { type: Boolean, default: !1 },
    stickyFirst: { type: Boolean, default: !1 },
    resizable: { type: Boolean, default: !1 },
    columnWidths: { default: () => ({}) }
  },
  emits: ["sort", "toggle-row", "toggle-page", "reorder", "row-contextmenu", "row-click", "resize"],
  setup(e, { emit: o }) {
    const a = e;
    function r(ee) {
      if (!ee || !a.groupBy)
        return "";
      if (ee.__group !== void 0 && ee.__group !== null)
        return String(ee.__group);
      const re = ee[a.groupBy.key];
      return re == null || re === "" ? "" : String(re);
    }
    function s(ee) {
      return a.groupBy ? ee === 0 ? !0 : r(a.rows[ee]) !== r(a.rows[ee - 1]) : !1;
    }
    function i(ee) {
      if (ee.__groupTitle)
        return String(ee.__groupTitle);
      const re = a.groupBy ? ee[a.groupBy.key] : null, ae = re == null || re === "" ? "None" : String(re);
      return !a.groupBy || a.groupBy.titlePrefixed === !1 ? ae : `${a.groupBy.label}: ${ae}`;
    }
    const d = q(/* @__PURE__ */ new Set()), u = q(/* @__PURE__ */ new Set());
    function c(ee) {
      return a.groupBy?.collapsible ? d.value.has(ee) : !1;
    }
    function v(ee) {
      if (!a.groupBy?.collapsible)
        return;
      const re = new Set(u.value);
      re.add(ee), u.value = re;
      const ae = new Set(d.value);
      ae.has(ee) ? ae.delete(ee) : ae.add(ee), d.value = ae;
    }
    function m(ee) {
      return a.groupBy?.collapsible ? !c(r(a.rows[ee])) : !0;
    }
    pe(
      () => a.rows,
      (ee) => {
        if (!a.groupBy?.collapsible || !a.collapsedGroupsByDefault)
          return;
        const re = new Set(d.value);
        for (const ae of ee) {
          const fe = r(ae);
          fe !== "" && !u.value.has(fe) && re.add(fe);
        }
        d.value = re;
      },
      { immediate: !0 }
    );
    const h = q(null), w = q(null);
    function k(ee, re) {
      h.value = ee, re.dataTransfer?.setData("text/plain", String(ee)), re.dataTransfer && (re.dataTransfer.effectAllowed = "move");
    }
    function S() {
      h.value = null, w.value = null;
    }
    function C(ee) {
      return h.value === null || w.value !== ee ? "" : h.value > ee ? "border-primary border-t-2" : "border-primary border-b-2";
    }
    function B(ee, re) {
      h.value !== null && (re.preventDefault(), w.value = ee);
    }
    function A(ee) {
      const re = h.value;
      if (h.value = null, w.value = null, re === null || re === ee)
        return;
      const ae = a.rows.map((ue) => ue[a.rowKey]), [fe] = ae.splice(re, 1);
      ae.splice(ee, 0, fe), $("reorder", ae);
    }
    const $ = o;
    function p(ee, re) {
      !a.rowClickable || a.reordering || re.button !== 0 || re.metaKey || re.ctrlKey || re.shiftKey || re.altKey || re.target?.closest('a, button, input, select, textarea, label, [role="menuitem"]') || (window.getSelection()?.toString().length ?? 0) > 0 || $("row-click", ee);
    }
    const g = q(null), M = Xe(), F = y(() => a.columns.filter((ee) => !a.hidden?.has(ee.key))), D = y(() => {
      const ee = F.value.find((re) => re.sticky);
      return ee ? ee.key : a.stickyFirst && F.value.length > 0 ? F.value[0].key : null;
    });
    function Y(ee) {
      return D.value === ee.key;
    }
    function G() {
      return a.selectable && !a.reordering ? `${po}px` : "0";
    }
    function Z(ee) {
      const re = a.columnWidths?.[ee.key];
      return typeof re == "number" ? re : ee.width;
    }
    function W(ee) {
      const re = Z(ee), ae = Y(ee), fe = {};
      return re !== void 0 && (fe.width = `${re}px`, fe.minWidth = `${re}px`, fe.maxWidth = `${re}px`), ae && (fe.left = G()), Object.keys(fe).length ? fe : void 0;
    }
    function H(ee) {
      return a.resizable ? ee.resizable !== !1 : !1;
    }
    function N(ee, re) {
      if (!H(ee))
        return;
      re.preventDefault(), re.stopPropagation();
      const ae = re.clientX, fe = Z(ee) ?? 160, ue = re.currentTarget;
      try {
        ue.setPointerCapture(re.pointerId);
      } catch {
      }
      function Ge(st) {
        const jt = fe + (st.clientX - ae);
        $("resize", ee.key, Math.min(1200, Math.max(48, jt)));
      }
      function Ue(st) {
        try {
          ue.releasePointerCapture(st.pointerId);
        } catch {
        }
        ue.removeEventListener("pointermove", Ge), ue.removeEventListener("pointerup", Ue), ue.removeEventListener("pointercancel", Ue);
      }
      ue.addEventListener("pointermove", Ge), ue.addEventListener("pointerup", Ue), ue.addEventListener("pointercancel", Ue);
    }
    const R = y(() => F.value.some((ee) => !!ee.group)), X = y(() => {
      const ee = [];
      for (const re of F.value) {
        const ae = re.group ?? null, fe = ee[ee.length - 1];
        fe && fe.label === ae ? fe.span += 1 : ee.push({ label: ae, span: 1, key: `${ae ?? "loose"}-${re.key}` });
      }
      return ee;
    });
    function P(ee) {
      const re = ee[a.rowKey];
      return re == null || re === "" ? null : re;
    }
    function J(ee) {
      const re = P(ee);
      return re !== null && !!a.selected?.has(re);
    }
    const V = q(null);
    function E(ee) {
      return a.rows.findIndex((re) => {
        const ae = P(re);
        return ae !== null && ae === ee;
      });
    }
    function te(ee, re) {
      const ae = P(ee);
      if (ae === null)
        return;
      const fe = re.shiftKey, ue = !!a.selected?.has(ae);
      if (fe && V.value !== null && V.value !== ae) {
        const Ge = E(V.value), Ue = E(ae);
        if (Ge !== -1 && Ue !== -1) {
          const st = Math.min(Ge, Ue), jt = Math.max(Ge, Ue), pa = !ue;
          for (let xt = st; xt <= jt; xt++) {
            if (!m(xt))
              continue;
            const Vt = P(a.rows[xt]);
            if (Vt === null)
              continue;
            !!a.selected?.has(Vt) !== pa && $("toggle-row", Vt);
          }
          V.value = ae;
          return;
        }
      }
      $("toggle-row", ae), V.value = ae;
    }
    const le = y(
      () => a.rows.map((ee) => P(ee)).filter((ee) => ee !== null)
    ), Q = y(
      () => le.value.length > 0 && le.value.every((ee) => a.selected?.has(ee))
    ), ne = y(
      () => !Q.value && le.value.some((ee) => a.selected?.has(ee))
    );
    function se(ee) {
      return ee.sortKey ?? ee.key;
    }
    function Me(ee) {
      return a.sort === se(ee);
    }
    async function vn(ee, re, ae) {
      try {
        await navigator.clipboard.writeText(String(ae)), g.value = `${ee}-${re.key}`, setTimeout(() => g.value = null, 1200);
      } catch {
      }
    }
    const fa = y(
      () => !!a.summaries && !!a.summaryValues && Object.keys(a.summaries).length > 0
    );
    function gn(ee) {
      return a.summaries?.[ee] ?? null;
    }
    function ma(ee) {
      const re = a.summaries?.[ee], ae = a.summaryValues?.[ee];
      if (!re)
        return "";
      if (ae == null)
        return "None";
      const fe = re.divideBy ? ae / re.divideBy : ae, ue = new Intl.NumberFormat(void 0, {
        minimumFractionDigits: re.decimals,
        maximumFractionDigits: re.decimals
      }).format(fe);
      return `${re.prefix ?? ""}${ue}${re.suffix ?? ""}`;
    }
    return (ee, re) => (t(), n("div", {
      class: z(["pk-scroll relative min-h-0 w-full min-w-0 max-w-full shrink grow-0 overflow-x-auto overflow-y-auto overscroll-x-contain", e.framed ? "rounded-lg border shadow-sm" : ""])
    }, [
      l("table", Al, [
        l("thead", zl, [
          R.value ? (t(), n("tr", _l, [
            e.reordering ? (t(), n("th", Pl)) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("th", Ll)) : b("", !0),
            (t(!0), n(_, null, j(X.value, (ae) => (t(), n("th", {
              key: ae.key,
              colspan: ae.span,
              class: "text-muted-foreground border-b px-3 py-1.5 text-left text-xs font-medium"
            }, f(ae.label ?? ""), 9, Ol))), 128)),
            ee.$slots.actions ? (t(), n("th", jl)) : b("", !0)
          ])) : b("", !0),
          l("tr", Vl, [
            e.reordering ? (t(), n("th", Dl)) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("th", {
              key: 1,
              class: z(["w-10 border-b px-3 py-2.5", D.value ? "bg-muted/50 sticky left-0 z-[11]" : ""])
            }, [
              l("input", {
                id: `${x(M)}-page`,
                type: "checkbox",
                class: "accent-primary size-3.5 cursor-pointer align-middle",
                checked: Q.value,
                indeterminate: ne.value,
                "aria-label": "Select all rows on this page",
                onClick: re[0] || (re[0] = he(() => {
                }, ["stop"])),
                onChange: re[1] || (re[1] = he((ae) => $("toggle-page", !Q.value), ["stop"]))
              }, null, 40, Tl)
            ], 2)) : b("", !0),
            (t(!0), n(_, null, j(F.value, (ae) => (t(), n("th", {
              key: ae.key,
              class: z([
                "text-muted-foreground relative border-b px-3 py-2.5 text-left font-medium whitespace-nowrap",
                Y(ae) ? "bg-muted/50 sticky z-[11] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)]" : ""
              ]),
              style: ie(W(ae))
            }, [
              ae.sortable ? (t(), n("button", {
                key: 0,
                class: "hover:text-foreground inline-flex items-center gap-1 transition-colors",
                onClick: (fe) => $("sort", se(ae))
              }, [
                U(f(ae.label) + " ", 1),
                Me(ae) ? (t(), n("span", El, f(e.direction === "desc" ? "↓" : "↑"), 1)) : (t(), n("span", Fl, "↕"))
              ], 8, Il)) : (t(), n("span", Nl, f(ae.label), 1)),
              H(ae) ? (t(), n("span", {
                key: 2,
                class: "hover:bg-primary/40 absolute top-0 right-0 z-[12] h-full w-1.5 cursor-col-resize",
                role: "separator",
                "aria-orientation": "vertical",
                "aria-label": `Resize ${ae.label}`,
                onPointerdown: (fe) => N(ae, fe)
              }, null, 40, Rl)) : b("", !0)
            ], 6))), 128)),
            ee.$slots.actions ? (t(), n("th", Ul, [...re[2] || (re[2] = [
              l("span", { class: "sr-only" }, "Actions", -1)
            ])])) : b("", !0)
          ])
        ]),
        e.loading && e.rows.length === 0 ? (t(), n("tbody", Hl, [
          (t(), n(_, null, j(6, (ae) => l("tr", {
            key: `skel-${ae}`,
            class: "border-b"
          }, [
            e.reordering ? (t(), n("td", ql, [
              I(Pe, {
                variant: "circle",
                class: "!size-4"
              })
            ])) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("td", Kl, [
              I(Pe, {
                variant: "circle",
                class: "!size-4"
              })
            ])) : b("", !0),
            (t(!0), n(_, null, j(F.value, (fe) => (t(), n("td", {
              key: fe.key,
              class: "px-3 py-2.5"
            }, [
              I(Pe, { variant: "text" })
            ]))), 128)),
            ee.$slots.actions ? (t(), n("td", Gl, [
              I(Pe, {
                variant: "circle",
                class: "!size-4 ml-auto"
              })
            ])) : b("", !0)
          ])), 64))
        ])) : (t(), n("tbody", {
          key: 1,
          class: z(e.loading ? "opacity-50 transition-opacity" : "transition-opacity")
        }, [
          (t(!0), n(_, null, j(e.rows, (ae, fe) => (t(), n(_, {
            key: P(ae) ?? `row-${fe}`
          }, [
            e.groupBy && s(fe) ? (t(), n("tr", Wl, [
              l("td", {
                colspan: e.columns.length + (e.selectable ? 1 : 0) + (e.reordering ? 1 : 0) + 1,
                class: "text-muted-foreground px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase"
              }, [
                e.groupBy.collapsible ? (t(), n("button", {
                  key: 0,
                  type: "button",
                  class: "hover:text-foreground inline-flex items-center gap-1.5",
                  "aria-expanded": !c(r(ae)),
                  dusk: `group-header-${r(ae) || "none"}`,
                  onClick: (ue) => v(r(ae))
                }, [
                  l("span", Yl, f(c(r(ae)) ? "▸" : "▾"), 1),
                  U(" " + f(i(ae)), 1)
                ], 8, Jl)) : (t(), n("span", Ql, f(i(ae)), 1))
              ], 8, Zl)
            ])) : b("", !0),
            m(fe) ? (t(), n("tr", {
              key: 1,
              "data-slot": "table-row",
              class: z(["group pk-row border-b transition-colors hover:bg-muted/50", [
                J(ae) ? "bg-primary/5 shadow-[inset_3px_0_0_0_var(--color-primary)]" : e.striped && fe % 2 === 1 ? "bg-muted/20" : "",
                h.value === fe ? "opacity-40" : "",
                C(fe),
                e.reordering ? "cursor-grab active:cursor-grabbing" : "",
                e.rowClickable && !e.reordering ? "cursor-pointer" : ""
              ]]),
              draggable: e.reordering,
              onDragstart: (ue) => k(fe, ue),
              onDragover: (ue) => B(fe, ue),
              onDrop: he((ue) => A(fe), ["prevent"]),
              onDragend: S,
              onContextmenu: (ue) => $("row-contextmenu", ae, ue),
              onClick: (ue) => p(ae, ue)
            }, [
              e.reordering ? (t(), n("td", eo, [...re[3] || (re[3] = [
                ut('<span class="text-muted-foreground/50 flex cursor-grab active:cursor-grabbing" aria-hidden="true" data-v-33b13e51><svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-v-33b13e51><circle cx="9" cy="6" r="1.5" data-v-33b13e51></circle><circle cx="15" cy="6" r="1.5" data-v-33b13e51></circle><circle cx="9" cy="12" r="1.5" data-v-33b13e51></circle><circle cx="15" cy="12" r="1.5" data-v-33b13e51></circle><circle cx="9" cy="18" r="1.5" data-v-33b13e51></circle><circle cx="15" cy="18" r="1.5" data-v-33b13e51></circle></svg></span>', 1)
              ])])) : b("", !0),
              e.selectable && !e.reordering ? (t(), n("td", {
                key: 1,
                class: z([
                  "px-3 py-2",
                  D.value ? "bg-background sticky left-0 z-[1] group-hover:bg-muted/50" : ""
                ])
              }, [
                l("input", {
                  id: `${x(M)}-row-${P(ae) ?? fe}`,
                  type: "checkbox",
                  class: "accent-primary size-3.5 cursor-pointer align-middle",
                  value: P(ae) ?? void 0,
                  checked: J(ae),
                  disabled: P(ae) === null,
                  "aria-label": P(ae) === null ? "This row has no id and cannot be selected" : `Select row ${P(ae)}`,
                  onClick: he((ue) => te(ae, ue), ["stop"])
                }, null, 8, to)
              ], 2)) : b("", !0),
              (t(!0), n(_, null, j(F.value, (ue) => (t(), n("td", {
                key: ue.key,
                class: z(["px-3 py-2 whitespace-nowrap", [
                  ue.cellClass,
                  Y(ue) ? "bg-background sticky z-[1] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)] group-hover:bg-muted/50" : ""
                ]]),
                style: ie(W(ue))
              }, [
                K(ee.$slots, `cell:${ue.key}`, {
                  row: ae,
                  value: ae[ue.key],
                  column: ue
                }, () => [
                  ue.copyable ? (t(), n("span", no, [
                    U(f(ae[ue.key]) + " ", 1),
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100",
                      "aria-label": `Copy ${ue.label.toLowerCase()}`,
                      onClick: (Ge) => vn(String(ae[e.rowKey]), ue, ae[ue.key])
                    }, [
                      l("span", lo, f(g.value === `${ae[e.rowKey]}-${ue.key}` ? "✓" : "⧉"), 1)
                    ], 8, ao)
                  ])) : ae[ue.key] == null || ae[ue.key] === "" ? (t(), n("span", oo, "None")) : (t(), n("span", so, f(ae[ue.key]), 1))
                ], !0)
              ], 6))), 128)),
              ee.$slots.actions ? (t(), n("td", ro, [
                K(ee.$slots, "actions", { row: ae }, void 0, !0)
              ])) : b("", !0)
            ], 42, Xl)) : b("", !0)
          ], 64))), 128))
        ], 2)),
        fa.value ? (t(), n("tfoot", io, [
          l("tr", null, [
            e.selectable ? (t(), n("td", uo)) : b("", !0),
            (t(!0), n(_, null, j(e.columns, (ae) => (t(), n(_, {
              key: `s-${ae.key}`
            }, [
              e.hidden?.has(ae.key) ? b("", !0) : (t(), n("td", {
                key: 0,
                class: z(["px-3 py-2 align-top text-sm whitespace-nowrap", ae.cellClass])
              }, [
                gn(ae.key) ? (t(), n(_, { key: 0 }, [
                  l("span", co, f(gn(ae.key).label), 1),
                  l("span", fo, f(ma(ae.key)), 1)
                ], 64)) : b("", !0)
              ], 2))
            ], 64))), 128)),
            ee.$slots.actions ? (t(), n("td", mo)) : b("", !0)
          ])
        ])) : b("", !0)
      ]),
      e.rows.length === 0 && !e.loading && e.filtered ? (t(), T(Ut, {
        key: 0,
        compact: "",
        icon: "search",
        title: "Nothing matches these filters",
        description: "Try clearing filters or searching for something else."
      }, ct({ _: 2 }, [
        ee.$slots["clear-filters"] ? {
          name: "actions",
          fn: O(() => [
            K(ee.$slots, "clear-filters", {}, void 0, !0)
          ]),
          key: "0"
        } : void 0
      ]), 1024)) : e.rows.length === 0 && !e.loading ? (t(), T(Ut, {
        key: 1,
        icon: e.emptyIcon,
        title: e.emptyTitle,
        description: e.emptyHint
      }, ct({ _: 2 }, [
        ee.$slots["empty-actions"] ? {
          name: "actions",
          fn: O(() => [
            K(ee.$slots, "empty-actions", {}, void 0, !0)
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["icon", "title", "description"])) : b("", !0)
    ], 2));
  }
}), at = (e, o) => {
  const a = e.__vccOpts || e;
  for (const [r, s] of o)
    a[r] = s;
  return a;
}, go = /* @__PURE__ */ at(vo, [["__scopeId", "data-v-33b13e51"]]), lt = "w-full min-w-0 px-4 py-6 sm:px-6", z8 = "w-full min-w-0 p-3 sm:p-4", _8 = "w-full min-w-0 space-y-6 px-4 py-6 sm:px-6", ho = "w-full max-w-7xl", bo = "px-4 py-4", Un = "w-full min-w-0", yo = {
  /** Filters, short lists (~24rem). */
  sm: "w-full max-w-sm",
  /** Notifications, inspect (~28rem). */
  md: "w-full max-w-md",
  /** Secondary action forms (~36rem). */
  lg: "w-full max-w-xl",
  /** Opt-in CRUD slide-over (~42rem). */
  xl: "w-full max-w-2xl"
}, rt = "bg-popover text-popover-foreground flex w-full max-h-[min(85vh,720px)] flex-col overflow-hidden rounded-xl border shadow-2xl", Ct = {
  /** Short confirmations with no fields (~24rem). */
  sm: `${rt} max-w-md`,
  /** The long-standing default: confirmations and short copy (~32rem). */
  confirm: `${rt} max-w-lg`,
  /** Wider than confirm when an action form needs more room than confirm copy (~36rem). */
  form: `${rt} max-w-xl`,
  /** A field stack too wide for `form` without becoming a page (~42rem). */
  lg: `${rt} max-w-2xl`,
  /** The widest dense modal offers - past this, use PkSlideover instead (~56rem). */
  xl: `${rt} max-w-4xl`
}, P8 = Ct.confirm, L8 = Ct.form, dt = /* @__PURE__ */ new Set();
let Ht = "";
function Hn(e) {
  typeof document > "u" || dt.has(e) || (dt.size === 0 && (Ht = document.body.style.overflow), dt.add(e), document.body.style.overflow = "hidden");
}
function St(e) {
  return typeof document > "u" || !dt.delete(e) ? !1 : dt.size === 0 ? (document.body.style.overflow = Ht, Ht = "", !0) : !1;
}
const xo = ["aria-busy", "aria-describedby"], ko = { class: "bg-popover sticky top-0 z-10 shrink-0 border-b px-6 py-5" }, $o = {
  key: 0,
  "data-slot": "modal-footer",
  class: "bg-muted/30 sticky bottom-0 z-10 flex shrink-0 flex-wrap items-center justify-end gap-3 border-t px-6 py-4 [&>[data-slot='button']]:min-h-10 [&>[data-slot='button']]:min-w-20 [&>[data-slot='button']]:px-4 [&>[data-slot='button'][data-variant='destructive']]:min-w-24"
}, mt = /* @__PURE__ */ L({
  __name: "PkModal",
  props: {
    open: { type: Boolean },
    title: {},
    description: {},
    busy: { type: Boolean, default: !1 },
    size: { default: "confirm" }
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = `pk-modal-title-${Xe()}`, d = `pk-modal-description-${Xe()}`, u = /* @__PURE__ */ Symbol("pk-modal");
    let c = null, v = !1;
    const m = q(!1), h = y(() => Ct[a.size] ?? Ct.confirm);
    function w(C) {
      m.value = C.target === C.currentTarget;
    }
    function k(C) {
      m.value && C.target === C.currentTarget && !a.busy && r("close"), m.value = !1;
    }
    function S(C) {
      if (!a.open)
        return;
      if (C.key === "Escape" && !a.busy) {
        C.stopPropagation(), r("close");
        return;
      }
      if (C.key !== "Tab" || !s.value)
        return;
      const B = s.value.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (B.length === 0)
        return;
      const A = B[0], $ = B[B.length - 1];
      C.shiftKey && document.activeElement === A ? (C.preventDefault(), $.focus()) : !C.shiftKey && document.activeElement === $ && (C.preventDefault(), A.focus());
    }
    return pe(
      () => a.open,
      (C) => {
        if (C)
          c = document.activeElement, Hn(u), v = !0, document.addEventListener("keydown", S), De(
            () => s.value?.querySelector("input, select, textarea, button")?.focus()
          );
        else if (v) {
          const B = St(u);
          v = !1, document.removeEventListener("keydown", S), B && c?.focus(), c = null;
        }
      },
      { immediate: !0 }
    ), ke(() => {
      document.removeEventListener("keydown", S), v && (St(u), v = !1);
    }), (C, B) => (t(), T(pt, { to: "body" }, [
      I(et, {
        "enter-active-class": "transition duration-100 ease-out",
        "enter-from-class": "opacity-0",
        "leave-active-class": "transition duration-75 ease-in",
        "leave-to-class": "opacity-0"
      }, {
        default: O(() => [
          e.open ? (t(), n("div", {
            key: 0,
            class: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-[8vh] backdrop-blur-sm",
            onPointerdown: w,
            onPointerup: k
          }, [
            l("div", {
              ref_key: "panel",
              ref: s,
              "data-pk-overlay": "",
              role: "dialog",
              "aria-modal": "true",
              "aria-busy": e.busy ? "true" : void 0,
              "aria-labelledby": i,
              "aria-describedby": e.description ? d : void 0,
              class: z(h.value)
            }, [
              l("div", ko, [
                l("h2", {
                  id: i,
                  class: "text-lg font-semibold tracking-tight"
                }, f(e.title), 1),
                e.description ? (t(), n("p", {
                  key: 0,
                  id: d,
                  class: "text-muted-foreground mt-1 text-sm leading-5"
                }, f(e.description), 1)) : b("", !0)
              ]),
              l("div", {
                class: z([
                  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5",
                  x(Un)
                ])
              }, [
                K(C.$slots, "default")
              ], 2),
              C.$slots.footer ? (t(), n("div", $o, [
                K(C.$slots, "footer")
              ])) : b("", !0)
            ], 10, xo)
          ], 32)) : b("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), wo = 160, qe = /* @__PURE__ */ L({
  __name: "PkDropdown",
  props: {
    align: { default: "end" },
    width: { default: "max-w-sm" },
    offset: { default: 4 },
    placement: { default: "bottom" },
    hoverable: { type: Boolean, default: !1 },
    dismissOnPanelClick: { type: Boolean, default: !0 }
  },
  setup(e, { expose: o }) {
    const a = e, r = q(!1), s = q(null), i = q(null), d = q({ top: 0, left: 0, minWidth: 0 }), u = q(null);
    let c = null;
    function v(p) {
      !a.dismissOnPanelClick || p.target?.closest("input, select, textarea, label, [data-keep-open]") || S();
    }
    async function m() {
      c && (clearTimeout(c), c = null), !r.value && (r.value = !0, await De(), C());
    }
    function h() {
      c = setTimeout(S, 180);
    }
    async function w() {
      u.value = null, r.value = !r.value, r.value && (await De(), C());
    }
    async function k(p, g) {
      u.value = { x: p, y: g }, r.value = !0, await De(), C();
    }
    function S() {
      r.value = !1, u.value = null;
    }
    function C() {
      const p = s.value, g = i.value;
      if (!p || !g)
        return;
      const M = g.getBoundingClientRect(), F = 8, D = u.value ? new DOMRect(u.value.x, u.value.y, 0, 0) : p.getBoundingClientRect();
      let Y, G;
      if (a.placement === "bottom")
        Y = D.bottom + a.offset, Y + M.height > window.innerHeight - F && D.top - M.height - a.offset > F && (Y = D.top - M.height - a.offset), G = a.align === "end" && !u.value ? D.right - M.width : D.left;
      else {
        Y = D.top;
        const Z = a.placement === "right", W = D.right + a.offset + M.width < window.innerWidth - F, H = D.left - a.offset - M.width > F;
        G = (Z ? W || !H : !H && W) ? D.right + a.offset : D.left - a.offset - M.width;
      }
      G = Math.min(Math.max(F, G), window.innerWidth - M.width - F), Y = Math.min(Math.max(F, Y), window.innerHeight - M.height - F), d.value = { top: Y, left: G, minWidth: Math.max(D.width, wo) };
    }
    function B(p) {
      if (!r.value)
        return;
      const g = p.target;
      s.value?.contains(g) || i.value?.contains(g) || (g instanceof Element ? g : g.parentElement)?.closest("[data-pk-overlay]") || S();
    }
    function A(p) {
      p.key === "Escape" && r.value && (p.stopPropagation(), S());
    }
    function $() {
      if (r.value) {
        if (u.value) {
          S();
          return;
        }
        C();
      }
    }
    return be(() => {
      document.addEventListener("pointerdown", B), document.addEventListener("keydown", A), window.addEventListener("scroll", $, !0), window.addEventListener("resize", $);
    }), ke(() => {
      c && clearTimeout(c), document.removeEventListener("pointerdown", B), document.removeEventListener("keydown", A), window.removeEventListener("scroll", $, !0), window.removeEventListener("resize", $);
    }), o({ close: S, openAt: k }), (p, g) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "relative",
      onPointerenter: g[3] || (g[3] = (M) => e.hoverable && m()),
      onPointerleave: g[4] || (g[4] = (M) => e.hoverable && h())
    }, [
      l("div", {
        onClick: g[0] || (g[0] = (M) => e.hoverable ? m() : w())
      }, [
        K(p.$slots, "trigger", { open: r.value })
      ]),
      (t(), T(pt, { to: "body" }, [
        I(et, {
          "enter-active-class": "transition duration-100 ease-out",
          "enter-from-class": "opacity-0 scale-95",
          "leave-active-class": "transition duration-75 ease-in",
          "leave-to-class": "opacity-0 scale-95"
        }, {
          default: O(() => [
            r.value ? (t(), n("div", {
              key: 0,
              ref_key: "panel",
              ref: i,
              class: z([
                "bg-popover text-popover-foreground fixed z-[100] w-max overflow-hidden rounded-md border p-1.5 shadow-lg",
                e.width
              ]),
              style: ie({
                top: `${d.value.top}px`,
                left: `${d.value.left}px`,
                /*
                 * AT LEAST AS WIDE AS WHAT OPENED IT. A menu narrower
                 * than its own trigger reads as a different control
                 * belonging to something else.
                 *
                 * This was computed on every open and never applied -
                 * the template set only `top` and `left` - so the
                 * measurement existed and did nothing.
                 */
                minWidth: `${d.value.minWidth}px`
              }),
              "data-pk-overlay": "",
              role: "menu",
              onPointerenter: g[1] || (g[1] = (M) => e.hoverable && m()),
              onPointerleave: g[2] || (g[2] = (M) => e.hoverable && h()),
              onClick: v
            }, [
              K(p.$slots, "panel", { close: S })
            ], 38)) : b("", !0)
          ]),
          _: 3
        })
      ]))
    ], 544));
  }
}), Co = ["disabled", "aria-label", "aria-busy"], So = {
  key: 0,
  class: "size-4 animate-spin",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, Mo = {
  key: 1,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Bo = {
  key: 2,
  class: "bg-primary-foreground/15 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums"
}, Ao = {
  key: 3,
  class: "size-4 opacity-80",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, zo = { class: "min-w-[14rem] p-1.5" }, _o = {
  key: 0,
  class: "text-muted-foreground px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
}, Po = ["disabled", "onClick"], Lo = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Oo = ["d"], jo = { class: "min-w-0 flex-1 truncate" }, Vo = ["disabled"], Do = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, To = ["d"], Io = {
  key: 2,
  class: "mt-1 border-t px-0 pt-1"
}, Eo = ["disabled", "onClick"], Fo = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, No = ["d"], Ro = { class: "min-w-0 flex-1 truncate" }, Uo = { class: "text-muted-foreground text-sm font-normal" }, Ho = { class: "text-foreground font-medium tabular-nums" }, qo = {
  key: 0,
  class: "text-destructive mt-1 text-xs"
}, Ko = ["disabled"], Go = { class: "text-muted-foreground text-sm font-normal" }, Wo = { class: "text-foreground font-medium tabular-nums" }, Zo = {
  key: 0,
  class: "text-destructive mt-1 text-xs"
}, Jo = ["disabled"], O8 = /* @__PURE__ */ L({
  __name: "BulkActions",
  props: {
    actions: {},
    count: {},
    allMatching: { type: Boolean },
    total: {},
    busy: { type: Boolean, default: !1 },
    canExport: { type: Boolean, default: !0 }
  },
  emits: ["run", "export"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = q(!1), d = y(() => a.allMatching ? a.total : a.count), u = y(() => d.value !== void 0), c = y(() => u.value && d.value === 0), v = y(() => a.actions.filter(($) => !$.destructive)), m = y(() => a.actions.filter(($) => $.destructive)), h = y(
      () => v.value.length + m.value.length + (a.canExport ? 1 : 0)
    ), w = {
      primary: "text-primary",
      gray: "text-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-500",
      danger: "text-destructive",
      info: "text-sky-600 dark:text-sky-400"
    };
    function k($) {
      return w[$.color ?? "gray"] ?? w.gray;
    }
    function S($) {
      if ($.confirmation) {
        s.value = $;
        return;
      }
      r("run", $.key);
    }
    function C() {
      s.value && r("run", s.value.key), s.value = null;
    }
    function B() {
      i.value = !1, r("export");
    }
    const A = ($) => new Intl.NumberFormat().format($);
    return ($, p) => (t(), n(_, null, [
      I(qe, null, {
        trigger: O(() => [
          l("button", {
            type: "button",
            class: "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-60",
            disabled: e.busy,
            "aria-haspopup": "menu",
            "aria-label": e.busy ? "Bulk actions are running" : "Open bulk actions",
            "aria-busy": e.busy
          }, [
            e.busy ? (t(), n("svg", So, [...p[5] || (p[5] = [
              l("path", { d: "M12 3a9 9 0 1 0 9 9" }, null, -1)
            ])])) : (t(), n("svg", Mo, [...p[6] || (p[6] = [
              l("path", { d: "M4 6h16M7 12h10M10 18h4" }, null, -1)
            ])])),
            l("span", null, f(e.busy ? "Working…" : "Bulk actions"), 1),
            !e.busy && h.value ? (t(), n("span", Bo, f(h.value), 1)) : b("", !0),
            e.busy ? b("", !0) : (t(), n("svg", Ao, [...p[7] || (p[7] = [
              l("path", { d: "m6 9 6 6 6-6" }, null, -1)
            ])]))
          ], 8, Co)
        ]),
        panel: O(() => [
          l("div", zo, [
            v.value.length || e.canExport ? (t(), n("div", _o, " Actions ")) : b("", !0),
            (t(!0), n(_, null, j(v.value, (g) => (t(), n("button", {
              key: g.key,
              type: "button",
              role: "menuitem",
              class: z(["hover:bg-accent focus:bg-accent flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50", k(g)]),
              disabled: e.busy,
              onClick: (M) => S(g)
            }, [
              (t(), n("svg", Lo, [
                l("path", {
                  d: x(Te)(g)
                }, null, 8, Oo)
              ])),
              l("span", jo, f(g.label), 1)
            ], 10, Po))), 128)),
            e.canExport ? (t(), n("button", {
              key: 1,
              type: "button",
              role: "menuitem",
              class: "text-foreground hover:bg-accent focus:bg-accent flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              disabled: e.busy,
              onClick: p[0] || (p[0] = (g) => i.value = !0)
            }, [
              (t(), n("svg", Do, [
                l("path", {
                  d: x(me)("download")
                }, null, 8, To)
              ])),
              p[8] || (p[8] = U(" Export CSV ", -1))
            ], 8, Vo)) : b("", !0),
            m.value.length ? (t(), n("div", Io, [
              p[9] || (p[9] = l("div", { class: "text-destructive/80 px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em]" }, " Destructive ", -1)),
              (t(!0), n(_, null, j(m.value, (g) => (t(), n("button", {
                key: g.key,
                type: "button",
                role: "menuitem",
                class: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                disabled: e.busy,
                onClick: (M) => S(g)
              }, [
                (t(), n("svg", Fo, [
                  l("path", {
                    d: x(Te)({ ...g, destructive: !0 })
                  }, null, 8, No)
                ])),
                l("span", Ro, f(g.label), 1)
              ], 8, Eo))), 128))
            ])) : b("", !0)
          ])
        ]),
        _: 1
      }),
      I(mt, {
        open: s.value !== null,
        title: s.value?.label ?? "",
        description: s.value?.confirmation ?? "",
        onClose: p[2] || (p[2] = (g) => s.value = null)
      }, {
        footer: O(() => [
          l("button", {
            type: "button",
            class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm",
            onClick: p[1] || (p[1] = (g) => s.value = null)
          }, " Cancel "),
          l("button", {
            type: "button",
            class: z([
              "rounded-md px-3 py-1.5 text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
              s.value?.destructive ? "bg-destructive text-white hover:opacity-90" : "bg-primary text-primary-foreground hover:opacity-90"
            ]),
            disabled: !u.value || c.value,
            onClick: C
          }, f(s.value?.label), 11, Ko)
        ]),
        default: O(() => [
          l("p", Uo, [
            p[10] || (p[10] = U(" This will affect ", -1)),
            l("span", Ho, [
              u.value ? (t(), n(_, { key: 1 }, [
                U(f(A(d.value)) + " record" + f(d.value === 1 ? "" : "s"), 1)
              ], 64)) : (t(), n(_, { key: 0 }, [
                U("…")
              ], 64))
            ]),
            p[11] || (p[11] = U(" . ", -1))
          ]),
          c.value ? (t(), n("p", qo, " Nothing matches the current filters - there is nothing to " + f(s.value?.label?.toLowerCase()) + ". ", 1)) : b("", !0)
        ]),
        _: 1
      }, 8, ["open", "title", "description"]),
      I(mt, {
        open: i.value,
        title: "Export CSV",
        description: "A download link appears once the file is ready.",
        onClose: p[4] || (p[4] = (g) => i.value = !1)
      }, {
        footer: O(() => [
          l("button", {
            type: "button",
            class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm",
            onClick: p[3] || (p[3] = (g) => i.value = !1)
          }, " Cancel "),
          l("button", {
            type: "button",
            class: "bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
            disabled: !u.value || c.value,
            onClick: B
          }, " Export CSV ", 8, Jo)
        ]),
        default: O(() => [
          l("p", Go, [
            p[12] || (p[12] = U(" This will export ", -1)),
            l("span", Wo, [
              u.value ? (t(), n(_, { key: 1 }, [
                U(f(A(d.value)) + " record" + f(d.value === 1 ? "" : "s"), 1)
              ], 64)) : (t(), n(_, { key: 0 }, [
                U("…")
              ], 64))
            ]),
            p[13] || (p[13] = U(". ", -1))
          ]),
          c.value ? (t(), n("p", Zo, " Nothing matches the current filters - there is nothing to export. ")) : b("", !0)
        ]),
        _: 1
      }, 8, ["open"])
    ], 64));
  }
}), Yo = { class: "pk-surface flex min-h-0 w-full min-w-0 shrink grow-0 flex-col overflow-hidden rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.04),0_14px_32px_-24px_rgb(0_0_0/0.28)]" }, Qo = {
  key: 0,
  class: "shrink-0 border-b px-3 py-2.5 sm:px-4"
}, Xo = {
  key: 1,
  class: "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4"
}, es = {
  key: 3,
  class: "shrink-0 border-t px-3 py-2.5 sm:px-4"
}, ts = /* @__PURE__ */ L({
  __name: "TableShell",
  props: {
    toolbarTint: { default: "none" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", Yo, [
      o.$slots.tabs ? (t(), n("div", Qo, [
        K(o.$slots, "tabs")
      ])) : b("", !0),
      o.$slots.title ? (t(), n("div", Xo, [
        K(o.$slots, "title")
      ])) : b("", !0),
      o.$slots.toolbar ? (t(), n("div", {
        key: 2,
        class: z(["shrink-0 border-b px-3 py-2.5 sm:px-4", e.toolbarTint === "muted" ? "bg-muted/40" : ""])
      }, [
        K(o.$slots, "toolbar")
      ], 2)) : b("", !0),
      K(o.$slots, "default"),
      o.$slots.pagination ? (t(), n("div", es, [
        K(o.$slots, "pagination")
      ])) : b("", !0)
    ]));
  }
}), Be = "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", xn = "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]", j8 = "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]", ns = ["aria-expanded", "aria-activedescendant"], as = ["aria-label", "onClick"], ls = {
  key: 0,
  class: "text-muted-foreground flex-1 text-sm"
}, os = { class: "ml-auto flex shrink-0 items-center gap-1" }, ss = {
  key: 0,
  class: "border-b p-1"
}, rs = ["placeholder"], is = { class: "max-h-60 overflow-y-auto p-1" }, ds = ["id", "onMouseenter", "onClick"], us = {
  key: 0,
  class: "text-muted-foreground px-2 py-3 text-sm"
}, on = /* @__PURE__ */ L({
  __name: "PkMultiSelect",
  props: {
    modelValue: {},
    options: {},
    placeholder: { default: "Select…" },
    searchPlaceholder: { default: "Start typing to search..." },
    searchable: { type: [Boolean, null], default: null },
    disabled: { type: Boolean, default: !1 },
    max: { default: null }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = q(null), d = q(null), u = `pk-multi-select-${Xe()}`, c = q(!1), v = q(""), m = q(0), h = q({ top: 0, left: 0, width: 0 }), w = y(
      () => a.modelValue.map(
        (W) => a.options.find((H) => H.value === W) ?? {
          value: W,
          label: String(W)
        }
      ).filter(Boolean)
    ), k = y(() => a.searchable ?? a.options.length > 6), S = y(() => {
      const W = new Set(a.modelValue), H = v.value.trim().toLowerCase();
      return a.options.filter((N) => !W.has(N.value)).filter((N) => H ? N.label.toLowerCase().includes(H) : !0);
    }), C = y(() => a.max !== null && a.modelValue.length >= a.max);
    function B() {
      const W = s.value, H = i.value;
      if (!W || !H)
        return;
      const N = W.getBoundingClientRect(), R = H.getBoundingClientRect(), X = 8;
      let P = N.bottom + 4;
      P + R.height > window.innerHeight - X && N.top - R.height - 4 > X && (P = N.top - R.height - 4), h.value = {
        top: P,
        left: Math.min(Math.max(X, N.left), window.innerWidth - N.width - X),
        // Matching the trigger's width is what makes it read as one control
        // rather than as a menu that happens to be nearby.
        width: N.width
      };
    }
    async function A() {
      a.disabled || c.value || (c.value = !0, v.value = "", m.value = 0, await De(), B(), d.value?.focus());
    }
    function $() {
      c.value = !1, v.value = "";
    }
    function p() {
      c.value ? $() : A();
    }
    function g(W) {
      C.value || (r("update:modelValue", [...a.modelValue, W.value]), v.value = "", m.value = 0, De(() => {
        B(), d.value?.focus();
      }));
    }
    function M(W) {
      r(
        "update:modelValue",
        a.modelValue.filter((H) => H !== W)
      ), De(B);
    }
    function F() {
      r("update:modelValue", []), De(B);
    }
    function D(W) {
      if (!a.disabled) {
        if (W.key === "Escape" && c.value) {
          W.stopPropagation(), $();
          return;
        }
        if (W.key === "Backspace" && v.value === "" && a.modelValue.length > 0) {
          M(a.modelValue[a.modelValue.length - 1]);
          return;
        }
        if (!c.value && (W.key === "ArrowDown" || W.key === "Enter")) {
          W.preventDefault(), A();
          return;
        }
        if (c.value) {
          if (W.key === "ArrowDown")
            W.preventDefault(), m.value = Math.min(m.value + 1, S.value.length - 1);
          else if (W.key === "ArrowUp")
            W.preventDefault(), m.value = Math.max(m.value - 1, 0);
          else if (W.key === "Enter") {
            W.preventDefault();
            const H = S.value[m.value];
            H && g(H);
          }
        }
      }
    }
    function Y(W) {
      if (!c.value)
        return;
      const H = W.target;
      s.value?.contains(H) || i.value?.contains(H) || (H instanceof Element ? H : H.parentElement)?.closest("[data-pk-overlay]") || $();
    }
    function G(W) {
      return `${u}-option-${W}`;
    }
    function Z() {
      c.value && B();
    }
    return pe(S, (W) => {
      m.value > W.length - 1 && (m.value = Math.max(0, W.length - 1));
    }), be(() => {
      document.addEventListener("pointerdown", Y), window.addEventListener("scroll", Z, !0), window.addEventListener("resize", Z);
    }), ke(() => {
      document.removeEventListener("pointerdown", Y), window.removeEventListener("scroll", Z, !0), window.removeEventListener("resize", Z);
    }), (W, H) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "relative w-full",
      onKeydown: D
    }, [
      l("div", {
        class: z(["bg-background flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors", [
          c.value ? "ring-ring border-ring ring-2" : "hover:border-ring/50",
          e.disabled ? "cursor-not-allowed opacity-50" : ""
        ]]),
        role: "combobox",
        "aria-expanded": c.value,
        "aria-controls": u,
        "aria-activedescendant": c.value && S.value[m.value] ? G(m.value) : void 0,
        "aria-haspopup": "listbox",
        tabindex: "0",
        onClick: p
      }, [
        (t(!0), n(_, null, j(w.value, (N) => (t(), n("span", {
          key: N.value,
          class: "bg-primary/10 text-primary flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium"
        }, [
          U(f(N.label) + " ", 1),
          l("button", {
            type: "button",
            class: "hover:text-destructive -mr-0.5 leading-none",
            "aria-label": `Remove ${N.label}`,
            onClick: he((R) => M(N.value), ["stop"])
          }, [...H[1] || (H[1] = [
            l("svg", {
              viewBox: "0 0 24 24",
              class: "size-3",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "3"
            }, [
              l("path", { d: "M18 6 6 18M6 6l12 12" })
            ], -1)
          ])], 8, as)
        ]))), 128)),
        w.value.length === 0 ? (t(), n("span", ls, f(e.placeholder), 1)) : b("", !0),
        l("span", os, [
          w.value.length > 1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground text-xs",
            "aria-label": "Clear all",
            onClick: he(F, ["stop"])
          }, " Clear ")) : b("", !0),
          (t(), n("svg", {
            viewBox: "0 0 24 24",
            class: z(["text-muted-foreground size-4 transition-transform", c.value ? "rotate-180" : ""]),
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "aria-hidden": "true"
          }, [...H[2] || (H[2] = [
            l("path", { d: "m6 9 6 6 6-6" }, null, -1)
          ])], 2))
        ])
      ], 10, ns),
      (t(), T(pt, { to: "body" }, [
        I(et, {
          "enter-active-class": "transition duration-100 ease-out",
          "enter-from-class": "opacity-0 scale-95",
          "leave-active-class": "transition duration-75 ease-in",
          "leave-to-class": "opacity-0 scale-95"
        }, {
          default: O(() => [
            c.value ? (t(), n("div", {
              key: 0,
              ref_key: "panel",
              ref: i,
              id: u,
              "data-pk-overlay": "",
              class: "bg-popover fixed z-[100] overflow-hidden rounded-md border shadow-lg",
              style: ie({
                top: `${h.value.top}px`,
                left: `${h.value.left}px`,
                width: `${h.value.width}px`
              }),
              role: "listbox"
            }, [
              k.value ? (t(), n("div", ss, [
                ge(l("input", {
                  ref_key: "searchInput",
                  ref: d,
                  "onUpdate:modelValue": H[0] || (H[0] = (N) => v.value = N),
                  type: "text",
                  class: "w-full bg-transparent px-2 py-1.5 text-sm outline-none",
                  placeholder: e.searchPlaceholder,
                  onKeydown: D
                }, null, 40, rs), [
                  [ze, v.value]
                ])
              ])) : b("", !0),
              l("div", is, [
                (t(!0), n(_, null, j(S.value, (N, R) => (t(), n("button", {
                  key: N.value,
                  id: G(R),
                  type: "button",
                  class: z(["flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors", R === m.value ? "bg-accent" : "hover:bg-accent/60"]),
                  role: "option",
                  "aria-selected": "false",
                  onMouseenter: (X) => m.value = R,
                  onClick: (X) => g(N)
                }, f(N.label), 43, ds))), 128)),
                S.value.length === 0 ? (t(), n("p", us, [
                  C.value ? (t(), n(_, { key: 0 }, [
                    U("You have selected the maximum.")
                  ], 64)) : v.value ? (t(), n(_, { key: 1 }, [
                    U("Nothing matches “" + f(v.value) + "”.", 1)
                  ], 64)) : (t(), n(_, { key: 2 }, [
                    U("Everything is selected.")
                  ], 64))
                ])) : b("", !0)
              ])
            ], 4)) : b("", !0)
          ]),
          _: 1
        })
      ]))
    ], 544));
  }
}), sn = /* @__PURE__ */ L({
  __name: "Sheet",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean },
    unmountOnHide: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), T(x(jn), de({ "data-slot": "sheet" }, x(s)), {
      default: O((u) => [
        K(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
});
function oe(...e) {
  return yl(bl(e));
}
function V8(e) {
  return typeof e == "string" ? e : e?.url ?? "";
}
const cs = /* @__PURE__ */ L({
  __name: "SheetOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Xt), de({
      "data-slot": "sheet-overlay",
      class: x(oe)(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        o.class
      )
    }, x(a)), {
      default: O(() => [
        K(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), rn = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "SheetContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    side: { default: "right" },
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class", "side"), i = ye(s, r);
    return (d, u) => (t(), T(x(en), null, {
      default: O(() => [
        I(cs),
        I(x(tn), de({
          "data-slot": "sheet-content",
          class: x(oe)(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
            e.side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
            e.side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
            e.side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
            e.side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
            a.class
          )
        }, { ...d.$attrs, ...x(i) }), {
          default: O(() => [
            K(d.$slots, "default"),
            I(x(tt), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
              default: O(() => [
                I(x(nn), { class: "size-4" }),
                u[0] || (u[0] = l("span", { class: "sr-only" }, "Close", -1))
              ]),
              _: 1
            })
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), fs = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", ms = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline"
}, ps = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
  "icon-sm": "size-8",
  "icon-lg": "size-10"
};
function Ye(e = {}) {
  const o = e.variant ?? "default", a = e.size ?? "default";
  return [fs, ms[o], ps[a], e.class].filter(Boolean).join(" ");
}
const ce = /* @__PURE__ */ L({
  __name: "PkButton",
  props: {
    variant: { default: "default" },
    size: { default: "default" },
    as: { default: "button" },
    class: {},
    disabled: { type: Boolean },
    type: { default: "button" }
  },
  setup(e) {
    const o = e, a = y(
      () => Ye({ variant: o.variant, size: o.size, class: o.class })
    ), r = y(() => o.as === "button" ? o.type : void 0);
    return (s, i) => (t(), T(Ce(e.as), {
      "data-slot": "button",
      "data-variant": e.variant,
      "data-size": e.size,
      type: r.value,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.as !== "button" && e.disabled ? "true" : void 0,
      class: z(["pk-focus-ring", a.value])
    }, {
      default: O(() => [
        K(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["data-variant", "data-size", "type", "disabled", "aria-disabled", "class"]));
  }
}), vs = { class: "flex items-center gap-2" }, gs = ["onUpdate:modelValue", "onChange"], hs = ["value"], bs = ["onUpdate:modelValue"], ys = ["value"], xs = ["onUpdate:modelValue"], ks = ["onUpdate:modelValue", "multiple"], $s = ["value"], ws = ["onUpdate:modelValue", "type"], Cs = ["aria-label", "onClick"], Ss = { class: "flex items-center gap-2" }, Ms = /* @__PURE__ */ L({
  __name: "PkQueryBuilder",
  props: {
    modelValue: {},
    fields: {},
    operators: {},
    maxDepth: { default: 5 },
    depth: { default: 0 },
    root: { type: Boolean, default: !0 }
  },
  emits: ["update:modelValue", "apply"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = () => ({ logic: "and", rules: [] }), i = q(a.modelValue ? structuredClone(a.modelValue) : s());
    pe(
      () => a.modelValue,
      ($) => {
        i.value = $ ? structuredClone($) : s();
      }
    );
    const d = ($) => "rules" in $, u = y(() => Object.keys(a.fields));
    function c($) {
      const p = $ ? a.fields[$]?.kind : void 0;
      return p ? a.operators[p] ?? [] : [];
    }
    const v = {
      is: "is",
      is_not: "is not",
      is_any_of: "is any of",
      is_none_of: "is none of",
      before: "is before",
      after: "is after",
      between: "is between"
    };
    function m() {
      r("update:modelValue", i.value);
    }
    function h() {
      const $ = u.value[0];
      i.value.rules.push({
        field: $,
        operator: c($)[0],
        value: void 0
      }), m();
    }
    function w() {
      i.value.rules.push(s()), m();
    }
    function k($) {
      i.value.rules.splice($, 1), m();
    }
    function S($) {
      $.operator = c($.field)[0], $.value = void 0, m();
    }
    const C = y(() => a.depth + 1 < a.maxDepth);
    function B() {
      i.value = s(), m(), r("apply", null);
    }
    function A() {
      r("apply", i.value.rules.length ? i.value : null);
    }
    return ($, p) => {
      const g = Qt("PkQueryBuilder", !0);
      return t(), n("div", {
        class: z(["flex flex-col gap-2 rounded-lg border p-3", e.depth > 0 ? "bg-muted/30" : "bg-card"])
      }, [
        l("div", vs, [
          ge(l("select", {
            "onUpdate:modelValue": p[0] || (p[0] = (M) => i.value.logic = M),
            class: "border-input bg-background rounded-md border px-2 py-1 text-xs",
            "aria-label": "Match all or any",
            onChange: m
          }, [...p[1] || (p[1] = [
            l("option", { value: "and" }, "Match all", -1),
            l("option", { value: "or" }, "Match any", -1)
          ])], 544), [
            [Ze, i.value.logic]
          ]),
          p[2] || (p[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "of the following", -1))
        ]),
        (t(!0), n(_, null, j(i.value.rules, (M, F) => (t(), n("div", {
          key: F,
          class: "flex items-start gap-2"
        }, [
          d(M) ? (t(), T(g, {
            key: 0,
            modelValue: i.value.rules[F],
            "onUpdate:modelValue": [(D) => i.value.rules[F] = D, m],
            fields: e.fields,
            operators: e.operators,
            "max-depth": e.maxDepth,
            depth: e.depth + 1,
            root: !1,
            class: "flex-1"
          }, null, 8, ["modelValue", "onUpdate:modelValue", "fields", "operators", "max-depth", "depth"])) : (t(), n(_, { key: 1 }, [
            ge(l("select", {
              "onUpdate:modelValue": (D) => M.field = D,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Field",
              onChange: (D) => S(M)
            }, [
              (t(!0), n(_, null, j(u.value, (D) => (t(), n("option", {
                key: D,
                value: D
              }, f(e.fields[D].label), 9, hs))), 128))
            ], 40, gs), [
              [Ze, M.field]
            ]),
            ge(l("select", {
              "onUpdate:modelValue": (D) => M.operator = D,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Operator",
              onChange: m
            }, [
              (t(!0), n(_, null, j(c(M.field), (D) => (t(), n("option", {
                key: D,
                value: D
              }, f(v[D] ?? D), 9, ys))), 128))
            ], 40, bs), [
              [Ze, M.operator]
            ]),
            M.field && e.fields[M.field]?.kind === "boolean" ? ge((t(), n("select", {
              key: 0,
              "onUpdate:modelValue": (D) => M.value = D,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: m
            }, [...p[3] || (p[3] = [
              l("option", { value: !0 }, "Yes", -1),
              l("option", { value: !1 }, "No", -1)
            ])], 40, xs)), [
              [Ze, M.value]
            ]) : M.field && e.fields[M.field]?.options?.length ? ge((t(), n("select", {
              key: 1,
              "onUpdate:modelValue": (D) => M.value = D,
              multiple: e.fields[M.field].kind === "multiselect",
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: m
            }, [
              (t(!0), n(_, null, j(e.fields[M.field].options, (D) => (t(), n("option", {
                key: D,
                value: D
              }, f(D), 9, $s))), 128))
            ], 40, ks)), [
              [Ze, M.value]
            ]) : ge((t(), n("input", {
              key: 2,
              "onUpdate:modelValue": (D) => M.value = D,
              type: M.field && e.fields[M.field]?.kind === "daterange" ? "date" : "text",
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: m
            }, null, 40, ws)), [
              [va, M.value]
            ])
          ], 64)),
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:text-destructive px-1 py-1 text-sm",
            "aria-label": `Remove ${d(M) ? "group" : "rule"}`,
            onClick: (D) => k(F)
          }, " × ", 8, Cs)
        ]))), 128)),
        l("div", Ss, [
          I(ce, {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: h
          }, {
            default: O(() => [...p[4] || (p[4] = [
              U("Add rule", -1)
            ])]),
            _: 1
          }),
          C.value ? (t(), T(ce, {
            key: 0,
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: w
          }, {
            default: O(() => [...p[5] || (p[5] = [
              U(" Add group ", -1)
            ])]),
            _: 1
          })) : b("", !0),
          e.root ? (t(), n(_, { key: 1 }, [
            p[8] || (p[8] = l("span", { class: "flex-1" }, null, -1)),
            I(ce, {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: B
            }, {
              default: O(() => [...p[6] || (p[6] = [
                U(" Clear ", -1)
              ])]),
              _: 1
            }),
            I(ce, {
              type: "button",
              size: "sm",
              onClick: A
            }, {
              default: O(() => [...p[7] || (p[7] = [
                U(" Apply ", -1)
              ])]),
              _: 1
            })
          ], 64)) : b("", !0)
        ])
      ], 2);
    };
  }
}), Bs = {
  "data-slot": "table-toolbar",
  class: "flex flex-col gap-2"
}, As = { class: "flex items-center gap-2 md:hidden" }, zs = { class: "relative min-w-0 flex-1" }, _s = ["placeholder", "title", "aria-label"], Ps = {
  key: 0,
  class: "bg-primary text-primary-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px]"
}, Ls = { class: "flex max-h-[85vh] flex-col" }, Os = { class: "flex-1 overflow-y-auto px-4 py-3" }, js = {
  key: 0,
  class: "mb-4 flex flex-col gap-3"
}, Vs = { class: "text-xs font-medium" }, Ds = ["value", "onChange"], Ts = ["value"], Is = { class: "mb-4" }, Es = { class: "flex flex-col gap-1" }, Fs = ["disabled", "onClick"], Ns = {
  key: 0,
  class: "text-primary ml-auto text-xs"
}, Rs = {
  key: 1,
  class: "mb-4"
}, Us = { class: "flex flex-col gap-1" }, Hs = ["onClick"], qs = { class: "border-t p-4" }, Ks = ["disabled"], Gs = { class: "hidden flex-wrap items-center justify-end gap-2 md:flex" }, Ws = { class: "relative min-w-0 flex-1 sm:w-72 sm:flex-none" }, Zs = ["placeholder", "title", "aria-label"], Js = ["aria-label"], Ys = {
  key: 0,
  class: "bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums"
}, Qs = { class: "flex max-h-96 flex-col gap-4 overflow-y-auto px-1 pb-3" }, Xs = { class: "text-xs font-medium" }, er = ["value", "onChange"], tr = ["value"], nr = { class: "grid grid-cols-2 gap-2" }, ar = ["value", "onChange"], lr = ["value", "onChange"], or = {
  key: 3,
  class: "grid grid-cols-2 gap-2"
}, sr = ["value", "onChange"], rr = ["value", "onChange"], ir = {
  key: 4,
  class: "flex items-center gap-2"
}, dr = ["aria-checked", "onClick"], ur = { class: "text-xs" }, cr = ["onClick"], fr = ["value", "onChange"], mr = ["value"], pr = ["disabled", "onClick"], vr = { class: "flex max-h-80 flex-col overflow-y-auto py-1" }, gr = ["disabled", "onClick"], hr = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, br = {
  key: 1,
  class: "size-4 shrink-0",
  "aria-hidden": "true"
}, yr = {
  key: 1,
  class: "border-input inline-flex shrink-0 overflow-hidden rounded-md border",
  role: "group",
  "aria-label": "Index layout"
}, xr = ["aria-pressed", "aria-label", "title", "onClick"], kr = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, $r = {
  key: 1,
  viewBox: "0 0 24 24",
  class: "size-4",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, wr = ["aria-pressed", "aria-label", "title"], Cr = ["aria-label", "title"], Sr = { class: "flex flex-col gap-0.5 p-1" }, Mr = ["onClick"], Br = ["onClick"], Ar = {
  key: 5,
  class: "text-muted-foreground shrink-0 text-xs"
}, zr = {
  key: 0,
  class: "flex flex-wrap items-center gap-1.5",
  dusk: "filter-indicators"
}, _r = ["dusk"], Pr = ["aria-label", "onClick"], Lr = /* @__PURE__ */ L({
  __name: "TableToolbar",
  props: {
    search: {},
    searchPlaceholder: { default: "Search…" },
    searchHint: {},
    filterSchema: {},
    filters: {},
    columns: {},
    hidden: {},
    loading: { type: Boolean, default: !1 },
    reorderable: { type: Boolean, default: !1 },
    reordering: { type: Boolean, default: !1 },
    groups: { default: () => [] },
    groupBy: { default: null },
    indicators: { default: () => [] },
    layouts: { default: () => [] },
    layout: { default: "table" }
  },
  emits: ["update:search", "apply-filters", "apply-columns", "clear", "toggle-reorder", "group", "clear-filter", "clear-filters", "layout"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(!1), i = q(a.search);
    pe(
      () => a.search,
      (V) => {
        V !== i.value && (i.value = V);
      }
    );
    let d;
    pe(i, (V) => {
      clearTimeout(d), d = setTimeout(() => {
        V !== a.search && r("update:search", V);
      }, 250);
    }), ke(() => {
      clearTimeout(d);
    });
    const u = q({ ...a.filters });
    pe(
      () => a.filters,
      (V) => {
        u.value = { ...V };
      },
      { deep: !0 }
    );
    const c = y(
      () => a.filterSchema.filter(
        (V) => a.filters[V.key] !== null && a.filters[V.key] !== void 0
      ).length
    ), v = y(() => JSON.stringify(u.value) !== JSON.stringify(a.filters)), m = y(() => a.search !== "" || c.value > 0), h = y(() => a.indicators.length ? a.indicators : a.filterSchema.filter((V) => a.filters[V.key] !== null && a.filters[V.key] !== void 0).map((V) => ({
      key: V.key,
      label: `${V.label}: ${String(a.filters[V.key])}`,
      removable: !0
    })));
    function w(V) {
      r("group", V);
    }
    function k(V) {
      w(V), s.value = !1;
    }
    function S(V, E) {
      w(V), E();
    }
    function C(V) {
      r("clear-filter", V);
    }
    function B(V) {
      return V.type === "multiselect";
    }
    function A(V) {
      const E = u.value[V.key];
      return Array.isArray(E) ? E : E == null ? [] : [E];
    }
    function $(V) {
      return A(V).filter(
        (E) => typeof E == "string" || typeof E == "number"
      );
    }
    function p(V) {
      return W(V).flatMap(
        (E) => typeof E.value == "string" || typeof E.value == "number" ? [{ value: E.value, label: E.label }] : []
      );
    }
    function g(V, E) {
      u.value = { ...u.value, [V.key]: E === "" ? null : E };
    }
    function M(V, E) {
      const te = u.value[V.key];
      if (typeof te != "string" || !te.includes(".."))
        return "";
      const [le, Q] = te.split("..");
      return E === "from" ? le ?? "" : Q ?? "";
    }
    function F(V, E, te) {
      const le = E === "from" ? te : M(V, "from"), Q = E === "to" ? te : M(V, "to");
      u.value = {
        ...u.value,
        [V.key]: le && Q ? `${le}..${Q}` : null
      };
    }
    function D(V, E, te) {
      const le = E === "from" ? te : M(V, "from"), Q = E === "to" ? te : M(V, "to");
      u.value = {
        ...u.value,
        [V.key]: le || Q ? `${le}..${Q}` : null
      };
    }
    function Y(V) {
      r("apply-filters", { ...u.value }), V();
    }
    function G(V, E) {
      u.value[V] = E, r("apply-filters", { ...u.value });
    }
    function Z() {
      u.value = Object.fromEntries(a.filterSchema.map((V) => [V.key, null]));
    }
    function W(V) {
      return V.type === "boolean" ? [
        { value: !0, label: V.trueLabel ?? "Yes" },
        { value: !1, label: V.falseLabel ?? "No" }
      ] : V.type === "daterange" ? Object.entries(V.presets ?? {}).map(([E, te]) => ({
        value: E,
        label: te
      })) : (V.options ?? []).map(
        (E) => typeof E == "object" && E !== null && "value" in E ? { value: E.value, label: E.label } : { value: E, label: String(E) }
      );
    }
    const H = q(new Set(a.hidden));
    pe(
      () => a.hidden,
      (V) => {
        H.value = new Set(V);
      },
      { deep: !0 }
    );
    function N(V) {
      const E = new Set(H.value);
      E.has(V) ? E.delete(V) : E.add(V), H.value = E, r("apply-columns", [...E]);
    }
    function R() {
      H.value = /* @__PURE__ */ new Set(), r("apply-columns", []);
    }
    function X() {
      r("apply-filters", { ...u.value }), s.value = !1;
    }
    function P() {
      i.value = "", r("clear");
    }
    function J() {
      P(), s.value = !1;
    }
    return (V, E) => (t(), n("div", Bs, [
      l("div", As, [
        l("div", zs, [
          E[8] || (E[8] = l("svg", {
            class: "text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }, [
            l("circle", {
              cx: "11",
              cy: "11",
              r: "7"
            }),
            l("path", { d: "m20 20-3.5-3.5" })
          ], -1)),
          ge(l("input", {
            "onUpdate:modelValue": E[0] || (E[0] = (te) => i.value = te),
            type: "search",
            placeholder: e.searchPlaceholder,
            title: e.searchHint,
            "aria-label": e.searchHint ?? e.searchPlaceholder,
            class: z([
              "border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors",
              x(Be)
            ])
          }, null, 10, _s), [
            [ze, i.value]
          ])
        ]),
        l("button", {
          type: "button",
          dusk: "mobile-table-tools",
          class: "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-sm",
          onClick: E[1] || (E[1] = (te) => s.value = !0)
        }, [
          E[9] || (E[9] = l("svg", {
            viewBox: "0 0 24 24",
            class: "size-4",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2"
          }, [
            l("path", { d: "M3 5h18M6 12h12M10 19h4" })
          ], -1)),
          E[10] || (E[10] = U(" Tools ", -1)),
          c.value ? (t(), n("span", Ps, f(c.value), 1)) : b("", !0)
        ]),
        I(sn, {
          open: s.value,
          "onUpdate:open": E[3] || (E[3] = (te) => s.value = te)
        }, {
          default: O(() => [
            I(rn, {
              side: "bottom",
              class: "max-h-[85vh] gap-0 overflow-hidden p-0"
            }, {
              default: O(() => [
                l("div", Ls, [
                  E[15] || (E[15] = l("div", { class: "border-b px-4 py-3" }, [
                    l("p", { class: "text-sm font-semibold" }, "Table tools"),
                    l("p", { class: "text-muted-foreground text-xs font-normal" }, " Filters, columns, and grouping ")
                  ], -1)),
                  l("div", Os, [
                    e.filterSchema.length ? (t(), n("div", js, [
                      l("div", { class: "flex items-center justify-between" }, [
                        E[11] || (E[11] = l("span", { class: "text-sm font-medium" }, "Filters", -1)),
                        l("button", {
                          class: "text-destructive text-xs hover:underline",
                          onClick: Z
                        }, " Reset ")
                      ]),
                      (t(!0), n(_, null, j(e.filterSchema, (te) => (t(), n("div", {
                        key: `mobile-${te.key}`,
                        class: "flex flex-col gap-1.5"
                      }, [
                        l("label", Vs, f(te.label), 1),
                        te.type !== "multiselect" && te.type !== "querybuilder" && te.type !== "daterange" && te.type !== "numberrange" && te.type !== "boolean" ? (t(), n("select", {
                          key: 0,
                          value: u.value[te.key] ?? "",
                          class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
                          onChange: (le) => g(
                            te,
                            le.target.value
                          )
                        }, [
                          E[12] || (E[12] = l("option", { value: "" }, "All", -1)),
                          (t(!0), n(_, null, j(W(te), (le) => (t(), n("option", {
                            key: String(le.value),
                            value: le.value
                          }, f(le.label), 9, Ts))), 128))
                        ], 40, Ds)) : b("", !0)
                      ]))), 128))
                    ])) : b("", !0),
                    l("div", Is, [
                      E[13] || (E[13] = l("p", { class: "mb-2 text-sm font-medium" }, "Columns", -1)),
                      l("div", Es, [
                        (t(!0), n(_, null, j(e.columns, (te) => (t(), n("button", {
                          key: `mobile-col-${te.key}`,
                          type: "button",
                          class: "hover:bg-accent flex items-center gap-2 rounded px-2 py-1.5 text-sm",
                          disabled: te.locked,
                          onClick: (le) => N(te.key)
                        }, [
                          l("span", null, f(te.label), 1),
                          H.value.has(te.key) ? b("", !0) : (t(), n("span", Ns, "On"))
                        ], 8, Fs))), 128))
                      ])
                    ]),
                    e.groups.length ? (t(), n("div", Rs, [
                      E[14] || (E[14] = l("p", { class: "mb-2 text-sm font-medium" }, "Grouping", -1)),
                      l("div", Us, [
                        l("button", {
                          type: "button",
                          class: "hover:bg-accent rounded px-2 py-1.5 text-left text-sm",
                          onClick: E[2] || (E[2] = (te) => k(null))
                        }, " No grouping "),
                        (t(!0), n(_, null, j(e.groups, (te) => (t(), n("button", {
                          key: te.key,
                          type: "button",
                          class: "hover:bg-accent rounded px-2 py-1.5 text-left text-sm",
                          onClick: (le) => k(te.key)
                        }, f(te.label), 9, Hs))), 128))
                      ])
                    ])) : b("", !0)
                  ]),
                  l("div", qs, [
                    e.filterSchema.length ? (t(), n("button", {
                      key: 0,
                      type: "button",
                      class: "bg-primary text-primary-foreground hover:bg-primary/90 mb-2 h-9 w-full rounded-md text-sm font-medium disabled:opacity-50",
                      disabled: !v.value,
                      onClick: X
                    }, " Apply filters ", 8, Ks)) : b("", !0),
                    m.value ? (t(), n("button", {
                      key: 1,
                      type: "button",
                      class: "text-muted-foreground hover:text-foreground w-full text-xs underline-offset-2 hover:underline",
                      onClick: J
                    }, " Clear search and filters ")) : b("", !0)
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["open"])
      ]),
      l("div", Gs, [
        l("div", Ws, [
          E[17] || (E[17] = l("svg", {
            class: "text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round"
          }, [
            l("circle", {
              cx: "11",
              cy: "11",
              r: "7"
            }),
            l("path", { d: "m20 20-3.5-3.5" })
          ], -1)),
          ge(l("input", {
            "onUpdate:modelValue": E[4] || (E[4] = (te) => i.value = te),
            type: "search",
            placeholder: e.searchPlaceholder,
            title: e.searchHint,
            "aria-label": e.searchHint ?? e.searchPlaceholder,
            class: z([
              "border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors",
              x(Be)
            ])
          }, null, 10, Zs), [
            [ze, i.value]
          ]),
          i.value ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2",
            "aria-label": "Clear search",
            onClick: E[5] || (E[5] = (te) => i.value = "")
          }, [...E[16] || (E[16] = [
            l("svg", {
              viewBox: "0 0 24 24",
              class: "size-3.5",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5"
            }, [
              l("path", { d: "M18 6 6 18M6 6l12 12" })
            ], -1)
          ])])) : b("", !0)
        ]),
        e.filterSchema.length ? (t(), T(qe, {
          key: 0,
          width: "w-80",
          "dismiss-on-panel-click": !1
        }, {
          trigger: O(() => [
            l("button", {
              type: "button",
              dusk: "filters-trigger",
              class: z(["border-input bg-background hover:bg-accent hover:text-accent-foreground relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors", c.value ? "border-primary text-primary" : ""]),
              "aria-label": c.value ? `Filters (${c.value} active)` : "Filters",
              title: "Filters"
            }, [
              E[18] || (E[18] = l("svg", {
                viewBox: "0 0 24 24",
                class: "size-4",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round"
              }, [
                l("path", { d: "M3 5h18M6 12h12M10 19h4" })
              ], -1)),
              c.value ? (t(), n("span", Ys, f(c.value), 1)) : b("", !0)
            ], 10, Js)
          ]),
          panel: O(({ close: te }) => [
            l("div", { class: "flex items-center justify-between px-1 pt-1 pb-2" }, [
              E[19] || (E[19] = l("span", { class: "text-sm font-semibold" }, "Filters", -1)),
              l("button", {
                class: "text-destructive text-xs hover:underline",
                onClick: Z
              }, " Reset ")
            ]),
            E[22] || (E[22] = l("p", { class: "text-muted-foreground px-1 pb-3 text-xs" }, " Select one or more - all chosen filters must match. ", -1)),
            l("div", Qs, [
              (t(!0), n(_, null, j(e.filterSchema, (le) => (t(), n("div", {
                key: le.key,
                class: "flex flex-col gap-1.5"
              }, [
                l("label", Xs, f(le.label), 1),
                B(le) ? (t(), T(on, {
                  key: 0,
                  "model-value": $(le),
                  options: p(le),
                  placeholder: `Any ${le.label.toLowerCase()}`,
                  "onUpdate:modelValue": (Q) => u.value[le.key] = Q.length ? Q : null
                }, null, 8, ["model-value", "options", "placeholder", "onUpdate:modelValue"])) : le.type === "querybuilder" ? (t(), T(Ms, {
                  key: 1,
                  "model-value": u.value[le.key] ?? null,
                  fields: le.fields ?? {},
                  operators: le.operators ?? {},
                  "max-depth": le.maxDepth ?? 5,
                  onApply: (Q) => G(le.key, Q)
                }, null, 8, ["model-value", "fields", "operators", "max-depth", "onApply"])) : le.type === "daterange" ? (t(), n(_, { key: 2 }, [
                  l("select", {
                    value: typeof u.value[le.key] == "string" && !String(u.value[le.key]).includes("..") ? u.value[le.key] : "",
                    class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
                    onChange: (Q) => g(le, Q.target.value)
                  }, [
                    E[20] || (E[20] = l("option", { value: "" }, "Any time", -1)),
                    (t(!0), n(_, null, j(W(le), (Q) => (t(), n("option", {
                      key: String(Q.value),
                      value: Q.value
                    }, f(Q.label), 9, tr))), 128))
                  ], 40, er),
                  l("div", nr, [
                    l("input", {
                      type: "date",
                      value: M(le, "from"),
                      "aria-label": "From",
                      class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                      onChange: (Q) => F(
                        le,
                        "from",
                        Q.target.value
                      )
                    }, null, 40, ar),
                    l("input", {
                      type: "date",
                      value: M(le, "to"),
                      "aria-label": "To",
                      class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                      onChange: (Q) => F(
                        le,
                        "to",
                        Q.target.value
                      )
                    }, null, 40, lr)
                  ])
                ], 64)) : le.type === "numberrange" ? (t(), n("div", or, [
                  l("input", {
                    type: "number",
                    value: M(le, "from"),
                    "aria-label": "From",
                    placeholder: "From",
                    class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                    onChange: (Q) => D(
                      le,
                      "from",
                      Q.target.value
                    )
                  }, null, 40, sr),
                  l("input", {
                    type: "number",
                    value: M(le, "to"),
                    "aria-label": "To",
                    placeholder: "To",
                    class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                    onChange: (Q) => D(
                      le,
                      "to",
                      Q.target.value
                    )
                  }, null, 40, rr)
                ])) : le.type === "boolean" ? (t(), n("div", ir, [
                  l("button", {
                    type: "button",
                    role: "switch",
                    "aria-checked": u.value[le.key] === !0,
                    class: z([
                      "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                      u.value[le.key] === !0 ? "bg-primary" : "bg-muted-foreground/30"
                    ]),
                    onClick: (Q) => g(le, u.value[le.key] === !0 ? null : !0)
                  }, [
                    l("span", {
                      class: z([
                        "bg-background absolute top-0.5 size-4 rounded-full transition-all",
                        u.value[le.key] === !0 ? "left-4.5" : "left-0.5"
                      ])
                    }, null, 2)
                  ], 10, dr),
                  l("span", ur, f(le.trueLabel ?? "Yes"), 1),
                  l("button", {
                    type: "button",
                    class: z([
                      "text-muted-foreground ml-auto text-xs hover:underline",
                      u.value[le.key] === !1 ? "text-primary font-medium" : ""
                    ]),
                    onClick: (Q) => g(le, u.value[le.key] === !1 ? null : !1)
                  }, f(le.falseLabel ?? "No") + " only ", 11, cr)
                ])) : (t(), n("select", {
                  key: 5,
                  value: u.value[le.key] ?? "",
                  class: "border-input bg-background h-9 rounded-md border px-3 text-sm capitalize",
                  onChange: (Q) => g(le, Q.target.value)
                }, [
                  E[21] || (E[21] = l("option", { value: "" }, "All", -1)),
                  (t(!0), n(_, null, j(W(le), (Q) => (t(), n("option", {
                    key: String(Q.value),
                    value: Q.value
                  }, f(Q.label), 9, mr))), 128))
                ], 40, fr))
              ]))), 128))
            ]),
            l("button", {
              type: "button",
              class: "bg-primary text-primary-foreground hover:bg-primary/90 mt-1 h-9 w-full rounded-md text-sm font-medium transition-colors disabled:opacity-50",
              disabled: !v.value,
              onClick: (le) => Y(te)
            }, " Apply filters ", 8, pr)
          ]),
          _: 1
        })) : b("", !0),
        I(qe, { "dismiss-on-panel-click": !1 }, {
          trigger: O(() => [...E[23] || (E[23] = [
            l("button", {
              type: "button",
              class: "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors",
              "aria-label": "Toggle columns",
              title: "Columns"
            }, [
              l("svg", {
                viewBox: "0 0 24 24",
                class: "size-4 shrink-0",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                l("rect", {
                  x: "3",
                  y: "4",
                  width: "18",
                  height: "16",
                  rx: "2"
                }),
                l("path", { d: "M9 4v16M15 4v16" })
              ])
            ], -1)
          ])]),
          panel: O(() => [
            E[26] || (E[26] = l("p", { class: "text-muted-foreground px-3 pt-2.5 pb-1 text-xs font-medium" }, " Toggle columns ", -1)),
            l("div", vr, [
              (t(!0), n(_, null, j(e.columns, (te) => (t(), n("button", {
                key: te.key,
                type: "button",
                class: z(["hover:bg-accent flex items-center gap-2 px-3 py-1.5 text-sm", te.locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"]),
                disabled: te.locked,
                onClick: (le) => N(te.key)
              }, [
                H.value.has(te.key) ? (t(), n("span", br)) : (t(), n("svg", hr, [...E[24] || (E[24] = [
                  l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
                ])])),
                U(" " + f(te.label), 1)
              ], 10, gr))), 128))
            ]),
            l("div", { class: "border-t" }, [
              l("button", {
                type: "button",
                class: "hover:bg-accent flex w-full items-center gap-2 px-3 py-1.5 text-sm",
                onClick: R
              }, [...E[25] || (E[25] = [
                l("svg", {
                  viewBox: "0 0 24 24",
                  class: "size-4 shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }, [
                  l("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                  l("path", { d: "M3 3v5h5" })
                ], -1),
                U(" Reset ", -1)
              ])])
            ])
          ]),
          _: 1
        }),
        e.layouts.length > 1 ? (t(), n("div", yr, [
          (t(!0), n(_, null, j(e.layouts, (te) => (t(), n("button", {
            key: te,
            type: "button",
            class: z(["hover:bg-accent inline-flex size-9 items-center justify-center transition-colors", e.layout === te ? "bg-accent text-foreground" : "text-muted-foreground"]),
            "aria-pressed": e.layout === te,
            "aria-label": te === "cards" ? "Card layout" : "Table layout",
            title: te === "cards" ? "Cards" : "Table",
            onClick: (le) => r("layout", te)
          }, [
            te === "table" ? (t(), n("svg", kr, [...E[27] || (E[27] = [
              l("path", { d: "M3 5h18M3 12h18M3 19h18" }, null, -1)
            ])])) : (t(), n("svg", $r, [...E[28] || (E[28] = [
              l("rect", {
                x: "3",
                y: "3",
                width: "7",
                height: "7",
                rx: "1"
              }, null, -1),
              l("rect", {
                x: "14",
                y: "3",
                width: "7",
                height: "7",
                rx: "1"
              }, null, -1),
              l("rect", {
                x: "3",
                y: "14",
                width: "7",
                height: "7",
                rx: "1"
              }, null, -1),
              l("rect", {
                x: "14",
                y: "14",
                width: "7",
                height: "7",
                rx: "1"
              }, null, -1)
            ])]))
          ], 10, xr))), 128))
        ])) : b("", !0),
        e.reorderable ? (t(), n("button", {
          key: 2,
          type: "button",
          class: z(["border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors", e.reordering ? "border-primary text-primary" : ""]),
          "aria-pressed": e.reordering,
          "aria-label": e.reordering ? "Finish reordering" : "Reorder records",
          title: e.reordering ? "Finish reordering" : "Reorder records",
          onClick: E[6] || (E[6] = (te) => r("toggle-reorder"))
        }, [...E[29] || (E[29] = [
          l("svg", {
            viewBox: "0 0 24 24",
            class: "size-4",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            l("path", { d: "m3 16 4 4 4-4M7 20V4m14 4-4-4-4 4m4-4v16" })
          ], -1)
        ])], 10, wr)) : b("", !0),
        e.groups.length ? (t(), T(qe, {
          key: 3,
          align: "end"
        }, {
          trigger: O(() => [
            l("button", {
              type: "button",
              dusk: "group-picker",
              class: z(["border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors", e.groupBy ? "border-primary text-primary" : ""]),
              "aria-label": e.groupBy ? `Grouped by ${e.groupBy.label}` : "Group records",
              title: e.groupBy ? `Grouped by ${e.groupBy.label}` : "Group records"
            }, [...E[30] || (E[30] = [
              l("svg", {
                viewBox: "0 0 24 24",
                class: "size-4",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round"
              }, [
                l("path", { d: "M4 6h16M4 12h10M4 18h7" })
              ], -1)
            ])], 10, Cr)
          ]),
          panel: O(({ close: te }) => [
            l("div", Sr, [
              l("button", {
                type: "button",
                class: z(["hover:bg-accent rounded px-2 py-1.5 text-left text-sm", e.groupBy ? "" : "text-primary font-medium"]),
                onClick: (le) => S(null, te)
              }, " No grouping ", 10, Mr),
              (t(!0), n(_, null, j(e.groups, (le) => (t(), n("button", {
                key: le.key,
                type: "button",
                class: z(["hover:bg-accent rounded px-2 py-1.5 text-left text-sm", e.groupBy?.key === le.key ? "text-primary font-medium" : ""]),
                onClick: (Q) => S(le.key, te)
              }, f(le.label), 11, Br))), 128))
            ])
          ]),
          _: 1
        })) : b("", !0),
        m.value ? (t(), n("button", {
          key: 4,
          type: "button",
          class: "text-muted-foreground hover:text-foreground shrink-0 text-xs underline-offset-2 hover:underline",
          onClick: P
        }, " Clear ")) : b("", !0),
        e.loading ? (t(), n("span", Ar, "Loading…")) : b("", !0)
      ]),
      h.value.length ? (t(), n("div", zr, [
        (t(!0), n(_, null, j(h.value, (te) => (t(), n("span", {
          key: te.key + te.label,
          class: "border-input bg-muted/60 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
          dusk: `filter-indicator-${te.key}`
        }, [
          U(f(te.label) + " ", 1),
          te.removable !== !1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "hover:text-foreground text-muted-foreground",
            "aria-label": `Clear ${te.label}`,
            onClick: (le) => C(te.key)
          }, [...E[31] || (E[31] = [
            l("svg", {
              viewBox: "0 0 24 24",
              class: "size-3",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5"
            }, [
              l("path", { d: "M18 6 6 18M6 6l12 12" })
            ], -1)
          ])], 8, Pr)) : b("", !0)
        ], 8, _r))), 128)),
        h.value.length > 1 ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline",
          dusk: "clear-all-filters",
          onClick: E[7] || (E[7] = (te) => r("clear-filters"))
        }, " Clear all ")) : b("", !0)
      ])) : b("", !0)
    ]));
  }
}), Or = { class: "min-w-0" }, jr = {
  key: 0,
  class: "text-sm font-semibold tracking-tight"
}, Vr = {
  key: 0,
  class: "flex shrink-0 flex-wrap items-center justify-end gap-2"
}, Dr = {
  key: 0,
  class: "text-muted-foreground px-4 py-10 text-center text-sm"
}, Tr = {
  key: 2,
  class: "pk-table-scroll pk-scroll w-full min-w-0 max-w-full overflow-x-auto overflow-y-auto overscroll-x-contain"
}, Ir = { class: "w-max min-w-full border-collapse text-sm" }, Er = { class: "bg-muted/40" }, Fr = { class: "divide-y" }, Nr = ["href"], Rr = {
  key: 1,
  class: "text-muted-foreground"
}, Ur = {
  key: 0,
  class: "flex justify-center"
}, Hr = ["disabled"], qr = {
  key: 1,
  class: "text-muted-foreground text-center text-xs"
}, Kr = ["href"], D8 = /* @__PURE__ */ L({
  __name: "RelationPanel",
  props: {
    columns: {},
    rows: {},
    loading: { type: Boolean, default: !1 },
    nextCursor: { default: null },
    capped: { type: Boolean, default: !1 },
    loaded: { type: Boolean, default: !1 },
    title: { default: null },
    emptyTitle: { default: "Nothing here yet" },
    emptyText: { default: "Related records will show up here once they exist." },
    indexHref: { default: null },
    recordBase: { default: null },
    filterSchema: { default: () => [] },
    filters: { default: () => ({}) },
    search: { default: "" },
    indicators: { default: () => [] }
  },
  emits: ["load", "update:search", "apply-filters", "clear-filters", "clear-filter"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = Yt(), i = y(() => a.columns.filter((w) => w.type !== "image")), d = y(() => !!s.actions), u = y(() => !!a.title || d.value), c = y(() => a.filterSchema.length > 0), v = y(
      () => a.columns.map((w) => ({ key: w.key, label: w.label, locked: !0 }))
    );
    function m(w, k) {
      return k == null || k === "" ? "None" : w.type === "date" || w.type === "datetime" ? new Date(String(k)).toLocaleString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...w.type === "datetime" ? { hour: "2-digit", minute: "2-digit" } : {}
      }) : typeof k == "number" ? new Intl.NumberFormat().format(k) : String(k);
    }
    function h(w) {
      return w == null || w === "";
    }
    return (w, k) => (t(), T(ts, null, ct({
      default: O(() => [
        e.loading && e.rows.length === 0 ? (t(), n("div", Dr, " Loading… ")) : e.loaded && e.rows.length === 0 ? (t(), T(Ut, {
          key: 1,
          compact: "",
          icon: "package",
          title: e.emptyTitle,
          description: e.emptyText
        }, ct({ _: 2 }, [
          w.$slots.illustration ? {
            name: "illustration",
            fn: O(() => [
              K(w.$slots, "illustration")
            ]),
            key: "0"
          } : void 0,
          w.$slots["empty-actions"] ? {
            name: "actions",
            fn: O(() => [
              K(w.$slots, "empty-actions")
            ]),
            key: "1"
          } : void 0
        ]), 1032, ["title", "description"])) : e.rows.length > 0 ? (t(), n("div", Tr, [
          l("table", Ir, [
            l("thead", Er, [
              l("tr", null, [
                (t(!0), n(_, null, j(i.value, (S) => (t(), n("th", {
                  key: S.key,
                  class: "text-muted-foreground px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap"
                }, f(S.label), 1))), 128))
              ])
            ]),
            l("tbody", Fr, [
              (t(!0), n(_, null, j(e.rows, (S, C) => (t(), n("tr", {
                key: S.id ?? C,
                "data-slot": "table-row",
                class: "pk-row hover:bg-muted/40 transition-colors"
              }, [
                (t(!0), n(_, null, j(i.value, (B) => (t(), n("td", {
                  key: B.key,
                  class: z(["px-3 whitespace-nowrap", [
                    B.mono ? "font-mono text-xs" : "",
                    B.muted ? "text-muted-foreground" : ""
                  ]])
                }, [
                  K(w.$slots, `cell:${B.key}`, {
                    row: S,
                    value: S[B.key],
                    column: B
                  }, () => [
                    e.recordBase && S.id != null && B === i.value[0] ? (t(), n("a", {
                      key: 0,
                      href: `${e.recordBase}/${S.id}`,
                      class: "text-foreground underline-offset-2 hover:underline"
                    }, f(m(B, S[B.key])), 9, Nr)) : h(S[B.key]) ? (t(), n("span", Rr, " None ")) : (t(), n(_, { key: 2 }, [
                      U(f(m(B, S[B.key])), 1)
                    ], 64))
                  ])
                ], 2))), 128))
              ]))), 128))
            ])
          ])
        ])) : b("", !0)
      ]),
      _: 2
    }, [
      u.value ? {
        name: "title",
        fn: O(() => [
          l("div", Or, [
            e.title ? (t(), n("h3", jr, f(e.title), 1)) : b("", !0)
          ]),
          d.value ? (t(), n("div", Vr, [
            K(w.$slots, "actions")
          ])) : b("", !0)
        ]),
        key: "0"
      } : void 0,
      c.value ? {
        name: "toolbar",
        fn: O(() => [
          I(Lr, {
            search: e.search,
            "search-placeholder": "Search related…",
            "filter-schema": e.filterSchema,
            filters: e.filters,
            columns: v.value,
            hidden: /* @__PURE__ */ new Set(),
            loading: e.loading,
            indicators: e.indicators,
            "onUpdate:search": k[0] || (k[0] = (S) => r("update:search", S)),
            onApplyFilters: k[1] || (k[1] = (S) => r("apply-filters", S)),
            onClearFilters: k[2] || (k[2] = (S) => r("clear-filters")),
            onClearFilter: k[3] || (k[3] = (S) => r("clear-filter", S)),
            onClear: k[4] || (k[4] = (S) => r("clear-filters")),
            onApplyColumns: k[5] || (k[5] = () => {
            })
          }, null, 8, ["search", "filter-schema", "filters", "columns", "hidden", "loading", "indicators"])
        ]),
        key: "1"
      } : void 0,
      e.nextCursor || e.capped ? {
        name: "pagination",
        fn: O(() => [
          e.nextCursor ? (t(), n("div", Ur, [
            l("button", {
              type: "button",
              class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm font-medium disabled:opacity-50",
              disabled: e.loading,
              onClick: k[6] || (k[6] = (S) => r("load", e.nextCursor))
            }, f(e.loading ? "Loading…" : "Load more"), 9, Hr)
          ])) : e.capped ? (t(), n("p", qr, [
            U(" Showing the first " + f(e.rows.length) + ". ", 1),
            e.indexHref ? (t(), n("a", {
              key: 0,
              href: e.indexHref,
              class: "text-foreground underline-offset-2 hover:underline"
            }, " Open the full list ", 8, Kr)) : (t(), n(_, { key: 1 }, [
              U("Open the full list to search or filter the rest.")
            ], 64))
          ])) : b("", !0)
        ]),
        key: "2"
      } : void 0
    ]), 1024));
  }
}), Gr = { class: "flex items-center gap-2 overflow-x-auto" }, Wr = {
  key: 0,
  class: "size-3",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Zr = {
  key: 1,
  class: "size-3",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Jr = { class: "flex flex-col" }, Yr = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, Qr = {
  key: 0,
  class: "bg-destructive size-1.5 shrink-0 rounded-full",
  "aria-label": "has errors"
}, Xr = {
  key: 0,
  class: "bg-border h-px w-6 shrink-0",
  "aria-hidden": "true"
}, ei = /* @__PURE__ */ L({
  __name: "PkStepIndicator",
  props: {
    steps: {},
    activeStep: {},
    hasError: { type: Function, default: () => !1 },
    failedStep: { default: null },
    interactive: { type: Boolean, default: !0 }
  },
  emits: ["update:activeStep"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s(c) {
      return a.failedStep !== null && c === a.failedStep ? "bg-destructive text-destructive-foreground border-destructive" : a.failedStep !== null && c > a.failedStep ? "" : c < a.activeStep ? "bg-primary text-primary-foreground border-primary" : c === a.activeStep ? "border-primary text-primary" : "";
    }
    function i(c) {
      if (a.failedStep !== null) {
        if (c === a.failedStep)
          return "text-destructive font-medium";
        if (c > a.failedStep)
          return "text-muted-foreground/60";
      }
      return c === a.activeStep ? "text-foreground font-medium" : c < a.activeStep ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/60";
    }
    function d(c) {
      return a.failedStep !== null ? c < a.failedStep : c < a.activeStep;
    }
    function u(c) {
      return a.failedStep === c;
    }
    return (c, v) => (t(), n("ol", Gr, [
      (t(!0), n(_, null, j(e.steps, (m, h) => (t(), n("li", {
        key: h,
        class: "flex shrink-0 items-center gap-2"
      }, [
        (t(), T(Ce(e.interactive ? "button" : "div"), de({
          type: e.interactive ? "button" : void 0,
          class: ["flex items-center gap-2 text-left text-sm", [
            e.interactive ? "transition-colors disabled:cursor-default" : "",
            i(h)
          ]]
        }, { ref_for: !0 }, e.interactive ? { disabled: h > e.activeStep } : {}, {
          onClick: (w) => e.interactive && h <= e.activeStep && r("update:activeStep", h)
        }), {
          default: O(() => [
            l("span", {
              class: z(["flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums", s(h)])
            }, [
              u(h) ? (t(), n("svg", Wr, [...v[0] || (v[0] = [
                l("path", { d: "M18 6 6 18M6 6l12 12" }, null, -1)
              ])])) : d(h) ? (t(), n("svg", Zr, [...v[1] || (v[1] = [
                l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
              ])])) : (t(), n(_, { key: 2 }, [
                U(f(h + 1), 1)
              ], 64))
            ], 2),
            l("span", Jr, [
              l("span", null, f(m.label), 1),
              m.description ? (t(), n("span", Yr, f(m.description), 1)) : b("", !0)
            ]),
            e.hasError(h) ? (t(), n("span", Qr)) : b("", !0)
          ]),
          _: 2
        }, 1040, ["type", "class", "onClick"])),
        h < e.steps.length - 1 ? (t(), n("span", Xr)) : b("", !0)
      ]))), 128))
    ]));
  }
}), ti = ["data-variant"], ni = "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none", Ie = /* @__PURE__ */ L({
  __name: "PkBadge",
  props: {
    variant: { default: "default" },
    soft: { type: Boolean, default: !1 },
    class: {}
  },
  setup(e) {
    const o = e, a = {
      default: "border-transparent bg-primary text-primary-foreground",
      secondary: "border-transparent bg-secondary text-secondary-foreground",
      destructive: "border-transparent bg-destructive text-white dark:bg-destructive/60",
      outline: "text-foreground",
      success: "border-transparent bg-success text-success-foreground",
      warning: "border-transparent bg-warning text-warning-foreground",
      info: "border-transparent bg-info text-info-foreground"
    }, r = {
      default: "border-transparent bg-primary/12 text-primary",
      secondary: "border-transparent bg-secondary/70 text-secondary-foreground",
      destructive: "border-transparent bg-destructive/12 text-destructive",
      success: "border-transparent bg-success/15 text-success",
      warning: "border-transparent bg-warning/15 text-warning",
      info: "border-transparent bg-info/15 text-info"
    }, s = y(() => {
      const i = o.soft ? r[o.variant] ?? a[o.variant] : a[o.variant];
      return [ni, i, o.class].filter(Boolean).join(" ");
    });
    return (i, d) => (t(), n("span", {
      "data-slot": "badge",
      "data-variant": e.variant,
      class: z(s.value)
    }, [
      K(i.$slots, "default")
    ], 10, ti));
  }
}), gt = /* @__PURE__ */ new Map();
function xe(e, o) {
  gt.set(e, o);
}
function ai(e) {
  return gt.get(e);
}
function T8(e) {
  return gt.has(e);
}
function I8() {
  return [...gt.keys()].sort();
}
function E8() {
  gt.clear();
}
const F8 = "text-sm text-muted-foreground font-normal", N8 = "text-xs text-muted-foreground font-normal", kt = "text-xs text-muted-foreground font-normal leading-snug";
class li extends Error {
  fieldErrors;
  constructor(o, a = {}) {
    super(o), this.name = "CreateOptionError", this.fieldErrors = a;
  }
}
function R8(e) {
  if (!e || typeof e != "object")
    return {};
  const o = {};
  for (const [a, r] of Object.entries(e)) {
    const s = Array.isArray(r) ? r[0] : r;
    typeof s == "string" && s !== "" && (o[a] = s);
  }
  return o;
}
function oi(e) {
  if (e.createOptionLabel)
    return e.createOptionLabel;
  const o = e.label.replace(/\s*id$/i, "").trim();
  return o !== "" ? `Create ${o.toLowerCase()}` : "Create option";
}
function si(e) {
  if (e.createOptionActionLabel)
    return e.createOptionActionLabel;
  const o = e.label.replace(/\s*id$/i, "").trim();
  return o !== "" ? `Create ${o.toLowerCase()}` : "Create new";
}
const ri = "text-foreground font-normal", ii = "placeholder:text-muted-foreground placeholder:font-normal", He = `${ri} ${ii}`, di = /* @__PURE__ */ L({
  __name: "Checkbox",
  props: {
    defaultValue: {},
    modelValue: {},
    disabled: { type: Boolean },
    value: {},
    id: {},
    trueValue: {},
    falseValue: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(wa), de({ "data-slot": "checkbox" }, x(i), {
      class: x(oe)(
        "peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        a.class
      )
    }), {
      default: O((c) => [
        I(x(Ca), {
          "data-slot": "checkbox-indicator",
          class: "grid place-content-center text-current transition-none"
        }, {
          default: O(() => [
            K(d.$slots, "default", Le(Re(c)), () => [
              I(x(Fn), { class: "size-3.5" })
            ])
          ]),
          _: 2
        }, 1024)
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Je = /* @__PURE__ */ L({
  __name: "Switch",
  props: {
    defaultValue: {},
    modelValue: {},
    disabled: { type: Boolean },
    id: {},
    value: {},
    trueValue: {},
    falseValue: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ye(ve(a, "class"), r);
    return (i, d) => (t(), T(x(Sa), de({ "data-slot": "switch" }, x(s), {
      class: x(oe)(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        a.class
      )
    }), {
      default: O(() => [
        I(x(Ma), {
          "data-slot": "switch-thumb",
          class: "bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), ui = {
  key: 0,
  class: "text-destructive text-sm",
  role: "alert"
}, ci = /* @__PURE__ */ L({
  __name: "CreateOptionDialog",
  props: {
    open: { type: Boolean },
    title: {},
    description: { default: void 0 },
    fields: {},
    processing: { type: Boolean, default: !1 },
    errors: { default: () => ({}) },
    generalError: { default: null }
  },
  emits: ["close", "submit"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q({});
    pe(
      () => a.open,
      (d) => {
        d && (s.value = {});
      }
    );
    function i() {
      r("submit", { ...s.value });
    }
    return (d, u) => (t(), T(mt, {
      open: e.open,
      title: e.title,
      description: e.description,
      size: "form",
      busy: e.processing,
      onClose: u[1] || (u[1] = (c) => r("close"))
    }, {
      footer: O(() => [
        I(ce, {
          type: "button",
          variant: "outline",
          disabled: e.processing,
          onClick: u[0] || (u[0] = (c) => r("close"))
        }, {
          default: O(() => [...u[2] || (u[2] = [
            U(" Cancel ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        I(ce, {
          type: "button",
          disabled: e.processing,
          onClick: i
        }, {
          default: O(() => [
            U(f(e.processing ? "Creating…" : "Create"), 1)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: O(() => [
        l("form", {
          class: "flex flex-col gap-4",
          onSubmit: he(i, ["prevent"])
        }, [
          e.generalError ? (t(), n("p", ui, f(e.generalError), 1)) : b("", !0),
          (t(!0), n(_, null, j(e.fields, (c) => (t(), T(We, {
            key: c.key,
            field: c,
            value: s.value[c.key],
            error: e.errors[c.key],
            processing: e.processing,
            onChange: (v) => s.value[c.key] = v
          }, null, 8, ["field", "value", "error", "processing", "onChange"]))), 128))
        ], 32)
      ]),
      _: 1
    }, 8, ["open", "title", "description", "busy"]));
  }
}), fi = ["accept", "disabled"], mi = { class: "text-sm font-medium" }, pi = { key: 0 }, vi = { key: 1 }, gi = { class: "text-muted-foreground text-xs font-normal" }, hi = {
  key: 0,
  class: "bg-muted mt-2 h-1 w-40 overflow-hidden rounded-full"
}, bi = {
  key: 1,
  class: "flex items-center gap-3 rounded-lg border p-3"
}, yi = ["src"], xi = {
  key: 1,
  class: "bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded text-[10px] font-semibold uppercase"
}, ki = { class: "min-w-0 flex-1" }, $i = { class: "block truncate text-sm font-medium" }, wi = { class: "text-muted-foreground text-xs font-normal" }, Ci = ["href"], Si = {
  key: 2,
  class: "text-destructive mt-1.5 text-xs"
}, qn = /* @__PURE__ */ L({
  __name: "PkFileUpload",
  props: {
    modelValue: {},
    accept: { default: () => [] },
    maxKilobytes: { default: 10240 },
    image: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 },
    upload: {},
    discard: { type: Function, default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = q(!1), d = q(null), u = q(null), c = q(null), v = y(() => a.accept.map((p) => `.${p}`).join(",")), m = y(() => c.value ?? a.modelValue?.url ?? null), h = y(() => `${a.accept.length ? a.accept.join(", ").toUpperCase() : "Any file"} · up to ${w(a.maxKilobytes * 1024)}`);
    function w(p) {
      if (!p)
        return "";
      const g = ["B", "KB", "MB", "GB"];
      let M = p, F = 0;
      for (; M >= 1024 && F < g.length - 1; )
        M /= 1024, F++;
      return `${M.toFixed(M < 10 && F > 0 ? 1 : 0)} ${g[F]}`;
    }
    function k(p) {
      return p.split(".").pop()?.toLowerCase() ?? "";
    }
    function S(p) {
      return a.accept.length && !a.accept.includes(k(p.name)) ? `${k(p.name).toUpperCase() || "That"} files are not accepted here.` : p.size > a.maxKilobytes * 1024 ? `That file is ${w(p.size)}; the limit is ${w(a.maxKilobytes * 1024)}.` : null;
    }
    async function C(p) {
      const g = p?.[0];
      if (!(!g || a.disabled) && (u.value = S(g), !u.value)) {
        B(), a.image && g.type.startsWith("image/") && (c.value = URL.createObjectURL(g)), d.value = 0;
        try {
          const M = await a.upload(g, (F) => {
            d.value = F;
          });
          r("update:modelValue", M);
        } catch (M) {
          u.value = M instanceof Error ? M.message : "The upload failed.", B();
        } finally {
          d.value = null, s.value && (s.value.value = "");
        }
      }
    }
    function B() {
      c.value && URL.revokeObjectURL(c.value), c.value = null;
    }
    async function A() {
      const p = a.modelValue;
      B(), u.value = null, r("update:modelValue", null), p && !p.url && a.discard && await a.discard(p.value).catch(() => {
      });
    }
    function $(p) {
      i.value = !1, C(p.dataTransfer?.files ?? null);
    }
    return (p, g) => (t(), n("div", null, [
      e.modelValue ? (t(), n("div", bi, [
        e.image && m.value ? (t(), n("img", {
          key: 0,
          src: m.value,
          alt: "",
          class: "bg-muted size-12 shrink-0 rounded object-cover"
        }, null, 8, yi)) : (t(), n("span", xi, f(k(e.modelValue.name) || "file"), 1)),
        l("span", ki, [
          l("span", $i, f(e.modelValue.name), 1),
          l("span", wi, [
            U(f(w(e.modelValue.size)) + " ", 1),
            e.modelValue.url ? (t(), n(_, { key: 0 }, [
              g[4] || (g[4] = U(" · ", -1)),
              l("a", {
                href: e.modelValue.url,
                class: "hover:underline"
              }, "Download", 8, Ci)
            ], 64)) : (t(), n(_, { key: 1 }, [
              U(" · not saved yet")
            ], 64))
          ])
        ]),
        e.disabled ? b("", !0) : (t(), n("button", {
          key: 2,
          type: "button",
          class: "text-muted-foreground hover:text-destructive shrink-0 rounded p-1.5",
          "aria-label": "Remove file",
          onClick: A
        }, [...g[5] || (g[5] = [
          l("svg", {
            class: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "M18 6 6 18M6 6l12 12" })
          ], -1)
        ])]))
      ])) : (t(), n("label", {
        key: 0,
        class: z(["flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-6 text-center transition-colors", [
          i.value ? "border-primary bg-primary/5" : "hover:bg-accent/40",
          e.disabled ? "pointer-events-none opacity-50" : ""
        ]]),
        onDragover: g[1] || (g[1] = he((M) => i.value = !0, ["prevent"])),
        onDragleave: g[2] || (g[2] = he((M) => i.value = !1, ["prevent"])),
        onDrop: he($, ["prevent"])
      }, [
        l("input", {
          ref_key: "input",
          ref: s,
          type: "file",
          class: "sr-only",
          accept: v.value,
          disabled: e.disabled,
          onChange: g[0] || (g[0] = (M) => C(M.target.files))
        }, null, 40, fi),
        g[3] || (g[3] = l("svg", {
          class: "text-muted-foreground size-6",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "1.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "aria-hidden": "true"
        }, [
          l("path", { d: "M12 16V4" }),
          l("path", { d: "m7 9 5-5 5 5" }),
          l("path", { d: "M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" })
        ], -1)),
        l("span", mi, [
          d.value === null ? (t(), n("span", pi, "Drop a file or click to choose")) : (t(), n("span", vi, "Uploading…"))
        ]),
        l("span", gi, f(h.value), 1),
        d.value !== null ? (t(), n("span", hi, [
          l("span", {
            class: "bg-primary block h-full transition-[width] duration-150",
            style: ie({ width: `${d.value}%` })
          }, null, 4)
        ])) : b("", !0)
      ], 34)),
      u.value ? (t(), n("p", Si, f(u.value), 1)) : b("", !0)
    ]));
  }
}), Mi = { class: "flex flex-col gap-2" }, Bi = {
  key: 0,
  class: "flex flex-col gap-1.5"
}, Ai = { class: "text-muted-foreground grid grid-cols-[1fr_1fr_auto] gap-2 text-xs" }, zi = { class: "flex flex-col gap-1" }, _i = ["onUpdate:modelValue", "disabled", "aria-label"], Pi = {
  key: 0,
  class: "text-destructive text-xs",
  role: "alert"
}, Li = {
  key: 1,
  class: "text-destructive text-xs",
  role: "alert"
}, Oi = ["onUpdate:modelValue", "disabled", "aria-label"], ji = ["disabled", "aria-label", "onClick"], Vi = {
  key: 1,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, Di = { class: "flex items-center gap-3" }, Ti = ["disabled"], Ii = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal tabular-nums"
}, Ei = /* @__PURE__ */ L({
  __name: "PkKeyValue",
  props: {
    modelValue: {},
    keyLabel: { default: "Key" },
    valueLabel: { default: "Value" },
    maxPairs: { default: null },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = /^[A-Za-z0-9_-]{1,64}$/;
    let i = 0;
    const d = q(u(a.modelValue));
    function u(C) {
      return C ? Object.entries(C).map(([B, A]) => ({
        uid: i++,
        key: B,
        value: A ?? ""
      })) : [];
    }
    pe(
      () => a.modelValue,
      (C) => {
        JSON.stringify(C ?? null) !== JSON.stringify(c()) && (d.value = u(C));
      }
    );
    function c() {
      const C = {};
      for (const B of d.value) {
        const A = B.key.trim();
        A !== "" && (C[A] = B.value);
      }
      return Object.keys(C).length ? C : null;
    }
    function v() {
      r("update:modelValue", c());
    }
    const m = y(() => {
      const C = /* @__PURE__ */ new Map();
      for (const B of d.value) {
        const A = B.key.trim();
        A !== "" && C.set(A, (C.get(A) ?? 0) + 1);
      }
      return new Set([...C.entries()].filter(([, B]) => B > 1).map(([B]) => B));
    }), h = y(
      () => new Set(
        d.value.map((C) => C.key.trim()).filter((C) => C !== "" && !s.test(C))
      )
    ), w = y(() => a.maxPairs !== null && d.value.length >= a.maxPairs);
    function k() {
      w.value || a.disabled || d.value.push({ uid: i++, key: "", value: "" });
    }
    function S(C) {
      d.value = d.value.filter((B) => B.uid !== C), v();
    }
    return (C, B) => (t(), n("div", Mi, [
      d.value.length ? (t(), n("div", Bi, [
        l("div", Ai, [
          l("span", null, f(e.keyLabel), 1),
          l("span", null, f(e.valueLabel), 1),
          B[0] || (B[0] = l("span", { class: "w-7" }, null, -1))
        ]),
        (t(!0), n(_, null, j(d.value, (A) => (t(), n("div", {
          key: A.uid,
          class: "grid grid-cols-[1fr_1fr_auto] items-start gap-2"
        }, [
          l("div", zi, [
            ge(l("input", {
              "onUpdate:modelValue": ($) => A.key = $,
              type: "text",
              class: z([
                "border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
                m.value.has(A.key.trim()) || h.value.has(A.key.trim()) ? "border-destructive" : ""
              ]),
              disabled: e.disabled,
              "aria-label": e.keyLabel,
              onInput: v
            }, null, 42, _i), [
              [ze, A.key]
            ]),
            h.value.has(A.key.trim()) ? (t(), n("p", Pi, " Letters, numbers, underscores and dashes only. ")) : m.value.has(A.key.trim()) ? (t(), n("p", Li, " Used twice - only the last value will be saved. ")) : b("", !0)
          ]),
          ge(l("input", {
            "onUpdate:modelValue": ($) => A.value = $,
            type: "text",
            class: "border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
            disabled: e.disabled,
            "aria-label": e.valueLabel,
            onInput: v
          }, null, 40, Oi), [
            [ze, A.value]
          ]),
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-40",
            disabled: e.disabled,
            "aria-label": `Remove ${A.key || "this entry"}`,
            onClick: ($) => S(A.uid)
          }, [...B[1] || (B[1] = [
            l("svg", {
              class: "size-4",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "aria-hidden": "true"
            }, [
              l("path", { d: "M18 6 6 18M6 6l12 12" })
            ], -1)
          ])], 8, ji)
        ]))), 128))
      ])) : (t(), n("p", Vi, " Nothing here yet. ")),
      l("div", Di, [
        l("button", {
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled || w.value,
          onClick: k
        }, [
          B[2] || (B[2] = l("svg", {
            class: "size-3.5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "M12 5v14M5 12h14" })
          ], -1)),
          U(" Add " + f(e.keyLabel.toLowerCase()), 1)
        ], 8, Ti),
        e.maxPairs !== null ? (t(), n("p", Ii, f(d.value.length) + " of " + f(e.maxPairs), 1)) : b("", !0)
      ])
    ]));
  }
}), Fi = { class: "border-input bg-background focus-within:ring-ring overflow-hidden rounded-md border focus-within:ring-2" }, Ni = { class: "bg-muted/40 flex flex-wrap items-center gap-0.5 border-b px-1.5 py-1" }, Ri = ["disabled", "title", "aria-label", "onClick"], Ui = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Hi = ["d"], qi = ["disabled"], Ki = ["contenteditable", "data-placeholder"], Gi = {
  key: 0,
  class: "text-muted-foreground border-t px-3 py-1 text-right text-xs tabular-nums"
}, Wi = /* @__PURE__ */ L({
  __name: "PkRichEditor",
  props: {
    modelValue: {},
    toolbar: { default: () => ["bold", "italic", "heading", "list", "link"] },
    maxLength: { default: null },
    disabled: { type: Boolean, default: !1 },
    placeholder: { default: "Write a note…" }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null);
    let i = null;
    const d = [
      {
        id: "bold",
        label: "Bold",
        command: "bold",
        path: "M6 4h6a4 4 0 0 1 0 8H6zM6 12h7a4 4 0 0 1 0 8H6z"
      },
      {
        id: "italic",
        label: "Italic",
        command: "italic",
        path: "M19 4h-9M14 20H5M15 4 9 20"
      },
      {
        id: "underline",
        label: "Underline",
        command: "underline",
        path: "M6 4v6a6 6 0 0 0 12 0V4M4 21h16"
      },
      {
        id: "strike",
        label: "Strikethrough",
        command: "strikeThrough",
        path: "M16 4H9a3 3 0 0 0-2 5M14 12a4 4 0 0 1 0 8H6M4 12h16"
      },
      {
        id: "heading",
        label: "Heading",
        command: "formatBlock",
        argument: "h2",
        path: "M6 12h12M6 4v16M18 4v16"
      },
      {
        id: "list",
        label: "Bulleted list",
        command: "insertUnorderedList",
        path: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      },
      {
        id: "quote",
        label: "Quote",
        command: "formatBlock",
        argument: "blockquote",
        path: "M3 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6h4M15 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6h4"
      },
      {
        id: "code",
        label: "Code",
        command: "formatBlock",
        argument: "pre",
        path: "m16 18 6-6-6-6M8 6l-6 6 6 6"
      }
    ], u = y(() => d.filter((S) => a.toolbar.includes(S.id))), c = y(() => a.toolbar.includes("link")), v = q(0);
    function m() {
      const S = s.value?.innerHTML ?? "", C = (s.value?.innerText ?? "").trim();
      v.value = C.length;
      const B = C === "" ? null : S;
      i = B, r("update:modelValue", B);
    }
    function h(S) {
      a.disabled || (s.value?.focus(), document.execCommand(S.command, !1, S.argument), m());
    }
    function w() {
      if (a.disabled)
        return;
      const S = window.prompt("Link address");
      S && (s.value?.focus(), document.execCommand("createLink", !1, S), m());
    }
    function k(S) {
      S.preventDefault();
      const C = S.clipboardData?.getData("text/plain") ?? "";
      document.execCommand("insertText", !1, C), m();
    }
    return be(() => {
      s.value && (s.value.innerHTML = a.modelValue ?? "", v.value = s.value.innerText.trim().length);
    }), pe(
      () => a.modelValue,
      (S) => {
        S !== i && s.value && (s.value.innerHTML = S ?? "", v.value = s.value.innerText.trim().length);
      }
    ), (S, C) => (t(), n("div", Fi, [
      l("div", Ni, [
        (t(!0), n(_, null, j(u.value, (B) => (t(), n("button", {
          key: B.id,
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40",
          disabled: e.disabled,
          title: B.label,
          "aria-label": B.label,
          onMousedown: C[0] || (C[0] = he(() => {
          }, ["prevent"])),
          onClick: (A) => h(B)
        }, [
          (t(), n("svg", Ui, [
            l("path", {
              d: B.path
            }, null, 8, Hi)
          ]))
        ], 40, Ri))), 128)),
        c.value ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40",
          disabled: e.disabled,
          title: "Link",
          "aria-label": "Link",
          onMousedown: C[1] || (C[1] = he(() => {
          }, ["prevent"])),
          onClick: w
        }, [...C[2] || (C[2] = [
          l("svg", {
            class: "size-3.5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" })
          ], -1)
        ])], 40, qi)) : b("", !0)
      ]),
      l("div", {
        ref_key: "editor",
        ref: s,
        class: z(["pk-prose min-h-28 px-3 py-2 text-sm focus:outline-none", e.disabled ? "pointer-events-none opacity-60" : ""]),
        contenteditable: !e.disabled,
        role: "textbox",
        "aria-multiline": "true",
        "data-placeholder": e.placeholder,
        onInput: m,
        onBlur: m,
        onPaste: k
      }, null, 42, Ki),
      e.maxLength !== null ? (t(), n("div", Gi, f(v.value) + " / " + f(e.maxLength), 1)) : b("", !0)
    ]));
  }
}), Zi = /* @__PURE__ */ at(Wi, [["__scopeId", "data-v-32c63bc7"]]), Ji = ["role"], Yi = ["title"], Qi = ["type", "name", "value", "checked", "disabled", "aria-label", "onChange"], Xi = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, ed = ["d"], td = { key: 1 }, nd = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Kn = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkToggleButtons",
  props: {
    field: {},
    modelValue: {},
    options: { default: () => [] },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => !!a.field.multiple), i = y(() => !!a.field.grouped), d = y(() => !!a.field.hiddenLabels), u = y(() => a.field.inline !== !1), c = y(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    );
    function v(p) {
      return s.value ? c.value.some((g) => g == p.value) : a.modelValue != null && p.value == a.modelValue;
    }
    function m(p) {
      if (!a.disabled) {
        if (s.value) {
          r(
            "update:modelValue",
            v(p) ? c.value.filter((g) => g != p.value) : [...c.value, p.value]
          );
          return;
        }
        r("update:modelValue", p.value);
      }
    }
    function h(p) {
      return a.field.colors?.[String(p.value)] ?? "primary";
    }
    function w(p) {
      const g = a.field.icons?.[String(p.value)];
      return g ? me(g) : null;
    }
    function k(p) {
      return a.field.tooltips?.[String(p.value)] ?? p.label;
    }
    const S = {
      primary: "border-primary bg-primary text-primary-foreground",
      success: "border-success bg-success text-white",
      warning: "border-warning bg-warning text-white",
      danger: "border-destructive bg-destructive text-white",
      info: "border-info bg-info text-white",
      neutral: "border-foreground bg-foreground text-background"
    }, C = {
      primary: "border-input hover:border-primary/60 hover:bg-primary/5",
      success: "border-input hover:border-success/60 hover:bg-success/5",
      warning: "border-input hover:border-warning/60 hover:bg-warning/5",
      danger: "border-input hover:border-destructive/60 hover:bg-destructive/5",
      info: "border-input hover:border-info/60 hover:bg-info/5",
      neutral: "border-input hover:border-foreground/40 hover:bg-muted"
    };
    function B(p) {
      const g = h(p), M = v(p);
      return [
        Be,
        "inline-flex items-center justify-center gap-1.5 border px-3 py-1.5 text-sm font-medium transition-colors",
        i.value ? "rounded-none first:rounded-l-md last:rounded-r-md -ml-px first:ml-0" : "rounded-md",
        M ? S[g] ?? S.primary : C[g] ?? C.primary,
        a.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      ].join(" ");
    }
    const A = y(() => {
      if (!(u.value || i.value) && a.field.columns && a.field.columns > 1)
        return { gridTemplateColumns: `repeat(${a.field.columns}, minmax(0, 1fr))` };
    }), $ = y(() => i.value ? "inline-flex flex-wrap" : u.value ? "flex flex-wrap gap-2" : "grid gap-2");
    return (p, g) => (t(), n("div", {
      role: s.value ? "group" : "radiogroup",
      class: z($.value),
      style: ie(A.value),
      "data-test": "toggle-buttons-field"
    }, [
      (t(!0), n(_, null, j(e.options, (M) => (t(), n("label", {
        key: String(M.value),
        class: z(B(M)),
        title: k(M)
      }, [
        l("input", {
          class: "sr-only",
          type: s.value ? "checkbox" : "radio",
          name: s.value ? void 0 : `f-${e.field.key}`,
          value: M.value,
          checked: v(M),
          disabled: e.disabled,
          "aria-label": d.value ? M.label : void 0,
          onChange: (F) => m(M)
        }, null, 40, Qi),
        w(M) ? (t(), n("svg", Xi, [
          l("path", {
            d: w(M)
          }, null, 8, ed)
        ])) : b("", !0),
        d.value ? b("", !0) : (t(), n("span", td, f(M.label), 1))
      ], 10, Yi))), 128)),
      e.options.length === 0 ? (t(), n("p", nd, " Nothing to choose from yet. ")) : b("", !0)
    ], 14, Ji));
  }
}), ad = {
  key: 1,
  class: "flex flex-col gap-2"
}, ld = { class: "flex items-center justify-between gap-2" }, od = ["for"], sd = {
  key: 0,
  class: "text-destructive",
  "aria-hidden": "true"
}, rd = ["aria-label", "disabled"], id = {
  key: 7,
  class: "flex flex-col gap-2"
}, dd = ["id", "value", "disabled"], ud = ["value"], cd = {
  key: 2,
  class: "relative"
}, fd = ["disabled"], md = {
  key: 0,
  class: "bg-popover absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md"
}, pd = { class: "max-h-56 overflow-y-auto p-1" }, vd = ["onClick"], gd = {
  key: 8,
  class: "relative"
}, hd = ["disabled", "aria-invalid"], bd = {
  key: 0,
  class: "bg-popover absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md"
}, yd = { class: "max-h-56 overflow-y-auto p-1" }, xd = {
  key: 0,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, kd = {
  key: 1,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, $d = ["onClick"], wd = ["id", "value", "disabled", "aria-invalid"], Cd = ["value"], Sd = {
  key: 10,
  class: "flex items-center gap-2 text-sm"
}, Md = {
  key: 11,
  class: "flex items-center gap-2 text-sm"
}, Bd = ["id", "value", "rows", "placeholder", "disabled", "aria-invalid"], Ad = {
  key: 0,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, zd = ["aria-label", "disabled"], _d = ["id", "value", "rows", "placeholder", "disabled", "aria-invalid"], Pd = {
  key: 2,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Ld = ["aria-label", "disabled"], Od = ["id", "type", "value", "placeholder", "autocomplete", "min", "max", "disabled", "aria-invalid"], jd = {
  key: 0,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Vd = ["aria-label", "disabled"], Dd = ["id", "type", "value", "placeholder", "autocomplete", "min", "max", "disabled", "aria-invalid"], Td = {
  key: 2,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Id = ["aria-label", "disabled"], Ed = {
  key: 16,
  class: "flex flex-wrap gap-1.5"
}, Fd = ["disabled", "aria-pressed", "onClick"], Nd = {
  key: 17,
  class: "flex flex-wrap gap-1.5"
}, Rd = ["title", "disabled", "onClick"], Ud = ["href"], Hd = {
  key: 19,
  class: "text-destructive text-xs leading-snug",
  role: "alert"
}, We = /* @__PURE__ */ L({
  __name: "FormFieldControl",
  props: {
    field: {},
    value: {},
    error: {},
    options: { default: () => [] },
    processing: { type: Boolean, default: !1 },
    searchOptions: {},
    upload: {},
    discard: {},
    errors: { default: () => ({}) },
    childOptions: { default: () => ({}) },
    values: {}
  },
  emits: ["change", "affix-action"],
  setup(e, { emit: o }) {
    const a = hn(() => import("./PkRepeater-J84jGe3T.js")), r = hn(() => import("./PkBuilder-DXeyw3Du.js")), s = e, i = o, d = q(!1), u = q(""), c = q([]), v = q(!1), m = q(null);
    let h;
    pe(u, (Q) => {
      s.searchOptions && (clearTimeout(h), v.value = !0, h = setTimeout(async () => {
        try {
          c.value = await s.searchOptions(Q);
        } catch {
        } finally {
          v.value = !1;
        }
      }, 200));
    });
    async function w() {
      if (!(s.processing || s.field.disabled) && (d.value = !0, c.value.length === 0 && s.searchOptions)) {
        v.value = !0;
        try {
          c.value = await s.searchOptions("");
        } finally {
          v.value = !1;
        }
      }
    }
    function k(Q) {
      m.value = Q.label, i("change", Q.value), d.value = !1, u.value = "";
    }
    function S() {
      m.value = null, i("change", null);
    }
    const C = wt("panelPicker", null), B = wt("panelCreateOption", null), A = q(!1), $ = q(!1), p = q({}), g = q(null), M = y(() => oi(s.field)), F = y(() => si(s.field));
    function D() {
      p.value = {}, g.value = null, A.value = !0, d.value = !1;
    }
    function Y() {
      $.value || (A.value = !1, p.value = {}, g.value = null);
    }
    async function G(Q) {
      if (B) {
        $.value = !0, p.value = {}, g.value = null;
        try {
          const ne = await B.run(s.field.key, { ...Q });
          k(ne), A.value = !1;
        } catch (ne) {
          ne instanceof li ? (p.value = ne.fieldErrors, g.value = Object.keys(ne.fieldErrors).length === 0 ? ne.message : null) : g.value = ne instanceof Error ? ne.message : "Could not create that option.";
        } finally {
          $.value = !1;
        }
      }
    }
    const Z = y(() => {
      if (!s.field.tableSelect || !C?.base)
        return;
      const Q = C.returnUrl || "/";
      return `${C.base}/pick/${s.field.key}?return=${encodeURIComponent(Q)}`;
    }), W = y(() => s.field.morphTo ?? []), H = y(() => {
      const Q = s.value;
      return Q && typeof Q == "object" && !Array.isArray(Q) ? Q : { type: void 0, id: void 0 };
    });
    function N(Q) {
      i("change", { type: Q || null, id: null });
    }
    function R(Q) {
      i("change", { type: H.value.type ?? null, id: Q });
    }
    function X(Q) {
      m.value = Q.label, R(Q.value), d.value = !1, u.value = "";
    }
    ke(() => clearTimeout(h));
    const P = y(() => ai(s.field.type)), J = y(
      () => !!s.field.prefix || !!s.field.suffix || !!s.field.prefixIcon || !!s.field.suffixIcon || !!s.field.prefixAction || !!s.field.suffixAction
    );
    function V(Q) {
      if (Q) {
        if (Q.copy) {
          const ne = s.value == null ? "" : String(s.value);
          ne !== "" && typeof navigator < "u" && navigator.clipboard && navigator.clipboard.writeText(ne);
          return;
        }
        if (Q.url && typeof window < "u") {
          window.open(Q.url, "_blank", "noopener,noreferrer");
          return;
        }
        Q.key && i("affix-action", Q.key);
      }
    }
    const E = `border-input bg-background h-9 rounded-md border px-3 text-sm disabled:opacity-50 ${He} ${Be}`, te = `bg-background h-9 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:outline-none disabled:opacity-50 ${He}`;
    function le(Q) {
      const ne = document.getElementById(`f-${s.field.key}`);
      if (!(ne instanceof HTMLTextAreaElement) && !(ne instanceof HTMLInputElement))
        return;
      const se = ne.selectionStart ?? ne.value.length, Me = ne.selectionEnd ?? se;
      ne.setRangeText(Q, se, Me, "end"), ne.dispatchEvent(new Event("input", { bubbles: !0 })), ne.focus();
    }
    return (Q, ne) => (t(), n(_, null, [
      e.field.type === "hidden" ? (t(), n(_, { key: 0 }, [], 64)) : (t(), n("div", ad, [
        l("div", ld, [
          l("label", {
            for: `f-${e.field.key}`,
            class: z(["text-sm font-medium leading-none", { "sr-only": e.field.labelHidden }])
          }, [
            U(f(e.field.label) + " ", 1),
            e.field.required ? (t(), n("span", sd, "*")) : b("", !0)
          ], 10, od),
          e.field.hint ? (t(), n("span", {
            key: 0,
            class: z(["flex items-center gap-1", x(kt)])
          }, [
            U(f(e.field.hint) + " ", 1),
            e.field.hintAction ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "hover:text-foreground rounded px-1",
              "aria-label": e.field.hintAction.label ?? "Copy",
              disabled: e.field.disabled || e.processing,
              onClick: ne[0] || (ne[0] = (se) => V(e.field.hintAction))
            }, f(e.field.hintAction.label ?? "⧉"), 9, rd)) : b("", !0)
          ], 2)) : b("", !0)
        ]),
        P.value ? (t(), T(Ce(P.value), {
          key: 0,
          field: e.field,
          "model-value": e.value,
          values: e.values,
          options: e.options,
          errors: e.errors,
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": ne[1] || (ne[1] = (se) => i("change", se))
        }, null, 8, ["field", "model-value", "values", "options", "errors", "disabled"])) : e.field.type === "file" && e.upload ? (t(), T(qn, {
          key: 1,
          "model-value": e.value ?? null,
          accept: e.field.accept ?? [],
          "max-kilobytes": e.field.maxKilobytes ?? 10240,
          image: e.field.image ?? !1,
          disabled: e.field.disabled || e.processing,
          upload: e.upload,
          discard: e.discard,
          "onUpdate:modelValue": ne[2] || (ne[2] = (se) => i("change", se))
        }, null, 8, ["model-value", "accept", "max-kilobytes", "image", "disabled", "upload", "discard"])) : e.field.type === "repeater" ? (t(), T(x(a), {
          key: 2,
          "model-value": e.value ?? null,
          children: e.field.children ?? [],
          "field-key": e.field.key,
          "item-label": e.field.itemLabel ?? "Item",
          "min-items": e.field.minItems ?? null,
          "max-items": e.field.maxItems ?? null,
          collapsible: e.field.collapsible ?? !1,
          addable: e.field.addable ?? !0,
          deletable: e.field.deletable ?? !0,
          cloneable: e.field.cloneable ?? !1,
          table: e.field.table ?? !1,
          relationship: e.field.relationship ?? null,
          disabled: e.field.disabled || e.processing,
          errors: e.errors,
          "child-options": e.childOptions,
          "onUpdate:modelValue": ne[3] || (ne[3] = (se) => i("change", se))
        }, null, 8, ["model-value", "children", "field-key", "item-label", "min-items", "max-items", "collapsible", "addable", "deletable", "cloneable", "table", "relationship", "disabled", "errors", "child-options"])) : e.field.type === "builder" ? (t(), T(x(r), {
          key: 3,
          "model-value": e.value ?? null,
          blocks: e.field.blocks ?? [],
          "max-blocks": e.field.maxBlocks ?? null,
          disabled: e.field.disabled || e.processing,
          errors: e.errors,
          "onUpdate:modelValue": ne[4] || (ne[4] = (se) => i("change", se))
        }, null, 8, ["model-value", "blocks", "max-blocks", "disabled", "errors"])) : e.field.type === "richtext" ? (t(), T(Zi, {
          key: 4,
          "model-value": e.value ?? null,
          toolbar: e.field.toolbar ?? ["bold", "italic", "heading", "list", "link"],
          "max-length": e.field.maxLength ?? null,
          placeholder: e.field.placeholder ?? "Write a note…",
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": ne[5] || (ne[5] = (se) => i("change", se))
        }, null, 8, ["model-value", "toolbar", "max-length", "placeholder", "disabled"])) : e.field.type === "keyvalue" ? (t(), T(Ei, {
          key: 5,
          "model-value": e.value ?? null,
          "key-label": e.field.keyLabel ?? "Key",
          "value-label": e.field.valueLabel ?? "Value",
          "max-pairs": e.field.maxPairs ?? null,
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": ne[6] || (ne[6] = (se) => i("change", se))
        }, null, 8, ["model-value", "key-label", "value-label", "max-pairs", "disabled"])) : e.field.type === "multiselect" ? (t(), T(on, {
          key: 6,
          "model-value": Array.isArray(e.value) ? e.value : [],
          options: e.options ?? [],
          disabled: e.field.disabled || e.processing,
          max: e.field.max ?? null,
          placeholder: e.field.placeholder ?? "Select…",
          "onUpdate:modelValue": ne[7] || (ne[7] = (se) => i("change", se))
        }, null, 8, ["model-value", "options", "disabled", "max", "placeholder"])) : W.value.length ? (t(), n("div", id, [
          e.field.morphTypeSelect === "toggle-buttons" ? (t(), T(Kn, {
            key: 0,
            field: { key: `${e.field.key}-type`, grouped: !0, inline: !0 },
            "model-value": H.value.type ?? null,
            options: W.value.map((se) => ({ value: se.value, label: se.label })),
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": ne[8] || (ne[8] = (se) => N(se == null ? "" : String(se)))
          }, null, 8, ["field", "model-value", "options", "disabled"])) : (t(), n("select", {
            key: 1,
            id: `f-${e.field.key}-type`,
            value: H.value.type ?? "",
            disabled: e.field.disabled || e.processing,
            class: z([
              "border-input bg-background h-9 rounded-md border px-3 text-sm disabled:opacity-50",
              x(Be)
            ]),
            onChange: ne[9] || (ne[9] = (se) => N(se.target.value))
          }, [
            ne[25] || (ne[25] = l("option", { value: "" }, "Type", -1)),
            (t(!0), n(_, null, j(W.value, (se) => (t(), n("option", {
              key: se.value,
              value: se.value
            }, f(se.label), 9, ud))), 128))
          ], 42, dd)),
          H.value.type && e.searchOptions ? (t(), n("div", cd, [
            l("button", {
              type: "button",
              class: z([
                "border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50",
                x(Be)
              ]),
              disabled: e.field.disabled || e.processing,
              onClick: w
            }, [
              l("span", {
                class: z(m.value || H.value.id ? "" : "text-muted-foreground")
              }, f(m.value ?? (H.value.id ? String(H.value.id) : "Search…")), 3)
            ], 10, fd),
            d.value ? (t(), n("div", md, [
              ge(l("input", {
                "onUpdate:modelValue": ne[10] || (ne[10] = (se) => u.value = se),
                type: "search",
                class: "h-9 w-full border-b bg-transparent px-3 text-sm outline-none",
                placeholder: "Type to search…",
                autofocus: ""
              }, null, 512), [
                [ze, u.value]
              ]),
              l("div", pd, [
                (t(!0), n(_, null, j(c.value, (se) => (t(), n("button", {
                  key: String(se.value),
                  type: "button",
                  class: "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
                  onClick: (Me) => X(se)
                }, f(se.label), 9, vd))), 128))
              ])
            ])) : b("", !0),
            d.value ? (t(), n("div", {
              key: 1,
              class: "fixed inset-0 z-40",
              onClick: ne[11] || (ne[11] = (se) => d.value = !1)
            })) : b("", !0)
          ])) : b("", !0)
        ])) : e.field.type === "select" && e.searchOptions ? (t(), n("div", gd, [
          l("button", {
            type: "button",
            class: z([
              "border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50",
              x(Be)
            ]),
            disabled: e.field.disabled || e.processing,
            "aria-invalid": !!e.error,
            onClick: w
          }, [
            l("span", {
              class: z(m.value || e.value ? "" : "text-muted-foreground")
            }, f(m.value ?? (e.value ? String(e.value) : "Search…")), 3),
            e.value ? (t(), n("span", {
              key: 0,
              class: "text-muted-foreground hover:text-foreground ml-2 text-xs",
              role: "button",
              "aria-label": "Clear selection",
              onClick: he(S, ["stop"])
            }, " ✕ ")) : b("", !0)
          ], 10, hd),
          d.value ? (t(), n("div", bd, [
            ge(l("input", {
              "onUpdate:modelValue": ne[12] || (ne[12] = (se) => u.value = se),
              type: "search",
              class: "h-9 w-full border-b bg-transparent px-3 text-sm outline-none",
              placeholder: "Type to search…",
              autofocus: ""
            }, null, 512), [
              [ze, u.value]
            ]),
            l("div", yd, [
              v.value ? (t(), n("p", xd, " Searching… ")) : c.value.length === 0 ? (t(), n("p", kd, " No matches ")) : b("", !0),
              (t(!0), n(_, null, j(c.value, (se) => (t(), n("button", {
                key: String(se.value),
                type: "button",
                class: "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
                onClick: (Me) => k(se)
              }, f(se.label), 9, $d))), 128)),
              e.field.createOption && x(B) ? (t(), n("button", {
                key: 2,
                type: "button",
                class: "text-primary hover:bg-accent mt-1 flex w-full items-center gap-1.5 rounded border-t px-2 py-2 text-left text-sm font-medium",
                onClick: D
              }, [
                ne[26] || (ne[26] = l("span", { "aria-hidden": "true" }, "+", -1)),
                U(" " + f(F.value), 1)
              ])) : b("", !0)
            ])
          ])) : b("", !0),
          d.value ? (t(), n("div", {
            key: 1,
            class: "fixed inset-0 z-40",
            onClick: ne[13] || (ne[13] = (se) => d.value = !1)
          })) : b("", !0)
        ])) : e.field.type === "select" ? (t(), n("select", {
          key: 9,
          id: `f-${e.field.key}`,
          value: e.value ?? "",
          disabled: e.field.disabled || e.processing,
          "aria-invalid": !!e.error,
          class: z([
            "border-input bg-background h-9 rounded-md border px-3 text-sm disabled:opacity-50",
            x(Be)
          ]),
          onChange: ne[14] || (ne[14] = (se) => i("change", se.target.value || null))
        }, [
          ne[27] || (ne[27] = l("option", { value: "" }, "-", -1)),
          (t(!0), n(_, null, j(e.options, (se) => (t(), n("option", {
            key: String(se.value),
            value: se.value
          }, f(se.label), 9, Cd))), 128))
        ], 42, wd)) : e.field.type === "toggle" ? (t(), n("label", Sd, [
          I(x(Je), {
            id: `f-${e.field.key}`,
            "model-value": !!e.value,
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": ne[15] || (ne[15] = (se) => i("change", se))
          }, null, 8, ["id", "model-value", "disabled"]),
          l("span", {
            class: z(x(kt))
          }, f(e.field.help ?? "Enabled"), 3)
        ])) : e.field.type === "checkbox" ? (t(), n("label", Md, [
          I(x(di), {
            id: `f-${e.field.key}`,
            "model-value": !!e.value,
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": ne[16] || (ne[16] = (se) => i("change", se === !0))
          }, null, 8, ["id", "model-value", "disabled"]),
          l("span", {
            class: z(x(kt))
          }, f(e.field.help ?? e.field.label), 3)
        ])) : e.field.type === "textarea" && !J.value ? (t(), n("textarea", {
          key: 12,
          id: `f-${e.field.key}`,
          value: e.value ?? "",
          rows: e.field.rows ?? 3,
          placeholder: e.field.placeholder,
          disabled: e.field.disabled || e.processing,
          "aria-invalid": !!e.error,
          class: z([
            "border-input bg-background rounded-md border px-3 py-2 text-sm disabled:opacity-50",
            x(He),
            x(Be)
          ]),
          onInput: ne[17] || (ne[17] = (se) => i("change", se.target.value))
        }, null, 42, Bd)) : e.field.type === "textarea" ? (t(), n("div", {
          key: 13,
          class: z([
            "border-input flex overflow-hidden rounded-md border",
            x(xn),
            { "opacity-50": e.field.disabled || e.processing }
          ])
        }, [
          e.field.prefix || e.field.prefixIcon ? (t(), n("span", Ad, f(e.field.prefix ?? e.field.prefixIcon), 1)) : b("", !0),
          e.field.prefixAction ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.prefixAction.label ?? "Action",
            disabled: e.field.disabled || e.processing,
            onClick: ne[18] || (ne[18] = (se) => V(e.field.prefixAction))
          }, f(e.field.prefixAction.label ?? "⧉"), 9, zd)) : b("", !0),
          l("textarea", {
            id: `f-${e.field.key}`,
            value: e.value ?? "",
            rows: e.field.rows ?? 3,
            placeholder: e.field.placeholder,
            disabled: e.field.disabled || e.processing,
            "aria-invalid": !!e.error,
            class: z([
              "min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm focus-visible:outline-none",
              x(He)
            ]),
            onInput: ne[19] || (ne[19] = (se) => i("change", se.target.value))
          }, null, 42, _d),
          e.field.suffix || e.field.suffixIcon ? (t(), n("span", Pd, f(e.field.suffix ?? e.field.suffixIcon), 1)) : b("", !0),
          e.field.suffixAction ? (t(), n("button", {
            key: 3,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.suffixAction.label ?? "Copy",
            disabled: e.field.disabled || e.processing,
            onClick: ne[20] || (ne[20] = (se) => V(e.field.suffixAction))
          }, f(e.field.suffixAction.label ?? "⧉"), 9, Ld)) : b("", !0)
        ], 2)) : J.value ? (t(), n("div", {
          key: 15,
          class: z([
            "border-input flex h-9 overflow-hidden rounded-md border",
            x(xn),
            { "opacity-50": e.field.disabled || e.processing }
          ])
        }, [
          e.field.prefix || e.field.prefixIcon ? (t(), n("span", jd, f(e.field.prefix ?? e.field.prefixIcon), 1)) : b("", !0),
          e.field.prefixAction ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.prefixAction.label ?? "Action",
            disabled: e.field.disabled || e.processing,
            onClick: ne[22] || (ne[22] = (se) => V(e.field.prefixAction))
          }, f(e.field.prefixAction.label ?? "⧉"), 9, Vd)) : b("", !0),
          l("input", {
            id: `f-${e.field.key}`,
            type: e.field.type === "number" ? "number" : e.field.type === "date" ? "date" : e.field.type === "datetime" ? "datetime-local" : e.field.type === "password" ? "password" : e.field.inputType ?? "text",
            value: e.value ?? "",
            placeholder: e.field.placeholder,
            autocomplete: e.field.type === "password" ? "new-password" : void 0,
            min: e.field.min,
            max: e.field.max,
            disabled: e.field.disabled || e.processing,
            "aria-invalid": !!e.error,
            class: z(te),
            onInput: ne[23] || (ne[23] = (se) => i("change", se.target.value))
          }, null, 40, Dd),
          e.field.suffix || e.field.suffixIcon ? (t(), n("span", Td, f(e.field.suffix ?? e.field.suffixIcon), 1)) : b("", !0),
          e.field.suffixAction ? (t(), n("button", {
            key: 3,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.suffixAction.label ?? "Copy",
            disabled: e.field.disabled || e.processing,
            onClick: ne[24] || (ne[24] = (se) => V(e.field.suffixAction))
          }, f(e.field.suffixAction.label ?? "⧉"), 9, Id)) : b("", !0)
        ], 2)) : (t(), n("input", {
          key: 14,
          id: `f-${e.field.key}`,
          type: e.field.type === "number" ? "number" : e.field.type === "date" ? "date" : e.field.type === "datetime" ? "datetime-local" : e.field.type === "password" ? "password" : e.field.inputType ?? "text",
          value: e.value ?? "",
          placeholder: e.field.placeholder,
          autocomplete: e.field.type === "password" ? "new-password" : void 0,
          min: e.field.min,
          max: e.field.max,
          disabled: e.field.disabled || e.processing,
          "aria-invalid": !!e.error,
          class: z(E),
          onInput: ne[21] || (ne[21] = (se) => i("change", se.target.value))
        }, null, 40, Od)),
        e.field.type === "number" && e.field.presets?.length ? (t(), n("div", Ed, [
          (t(!0), n(_, null, j(e.field.presets, (se) => (t(), n("button", {
            key: se,
            type: "button",
            disabled: e.field.disabled || e.processing,
            class: z([
              "rounded-md border px-2.5 py-1 text-xs transition-colors disabled:opacity-50",
              x(Be),
              // eslint-disable-next-line eqeqeq
              e.value != null && e.value == se ? "border-primary bg-primary/10 text-primary font-medium" : "border-input hover:bg-muted"
            ]),
            "aria-pressed": (
              // eslint-disable-next-line eqeqeq
              e.value != null && e.value == se
            ),
            onClick: (Me) => i("change", String(se))
          }, f(se), 11, Fd))), 128))
        ])) : b("", !0),
        e.field.type === "textarea" && e.field.chips && Object.keys(e.field.chips).length ? (t(), n("div", Nd, [
          (t(!0), n(_, null, j(e.field.chips, (se, Me) => (t(), n("button", {
            key: Me,
            type: "button",
            title: se,
            disabled: e.field.disabled || e.processing,
            class: "border-input hover:bg-muted rounded-md border px-2 py-1 font-mono text-xs transition-colors disabled:opacity-50",
            onClick: (vn) => le(String(Me))
          }, f(Me), 9, Rd))), 128))
        ])) : b("", !0),
        Z.value ? (t(), n("a", {
          key: 18,
          href: Z.value,
          class: "text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
        }, " Browse ", 8, Ud)) : b("", !0),
        e.error ? (t(), n("p", Hd, f(e.error), 1)) : e.field.help && e.field.type !== "toggle" ? (t(), n("p", {
          key: 20,
          class: z(x(kt))
        }, f(e.field.help), 3)) : b("", !0)
      ])),
      e.field.createOption && x(B) ? (t(), T(ci, {
        key: 2,
        open: A.value,
        title: M.value,
        description: e.field.help ?? void 0,
        fields: e.field.createOption,
        processing: $.value,
        errors: p.value,
        "general-error": g.value,
        onClose: Y,
        onSubmit: G
      }, null, 8, ["open", "title", "description", "fields", "processing", "errors", "general-error"])) : b("", !0)
    ], 64));
  }
}), qd = { class: "flex min-w-0 items-start gap-2.5" }, Kd = {
  key: 0,
  class: "bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
  "aria-hidden": "true"
}, Gd = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "size-3.5"
}, Wd = ["d"], Zd = { class: "min-w-0" }, Jd = { class: "text-sm font-semibold" }, Yd = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, Qd = {
  key: 2,
  class: "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10"
}, Xd = { class: "border-b px-4 py-3.5 sm:px-5" }, eu = { class: "text-sm font-semibold" }, tu = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, nu = {
  key: 4,
  class: "min-w-0 space-y-4"
}, au = {
  key: 7,
  class: "flex flex-col gap-3"
}, lu = { class: "text-sm font-medium" }, ou = {
  key: 0,
  class: "text-muted-foreground -mt-2 text-sm"
}, su = {
  key: 0,
  class: "mb-1 font-medium"
}, ru = ["aria-selected", "onClick"], iu = {
  key: 1,
  class: "bg-destructive size-1.5 rounded-full",
  "aria-label": "has errors"
}, du = { class: "flex items-center justify-between gap-3 border-t p-4" }, uu = ["disabled"], cu = /* @__PURE__ */ L({
  __name: "SchemaNode",
  props: {
    node: {},
    values: {},
    errors: { default: () => ({}) },
    options: { default: () => ({}) },
    processing: { type: Boolean, default: !1 },
    searchOptions: {},
    upload: {},
    discard: {},
    depth: { default: 0 }
  },
  emits: ["change", "affix-action"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(!a.node.collapsed);
    function i() {
      const g = a.node.persistInQueryString;
      if (!g || typeof window > "u")
        return 0;
      const M = new URLSearchParams(window.location.search).get(g), F = M === null ? NaN : Number.parseInt(M, 10), D = a.node.children?.length ?? 0;
      return Number.isInteger(F) && F >= 0 && F < D ? F : 0;
    }
    const d = q(a.node.component === "tabs" ? i() : 0), u = q(a.node.component === "wizard" ? i() : 0);
    function c(g, M) {
      if (!g || typeof window > "u")
        return;
      const F = new URL(window.location.href);
      F.searchParams.set(g, String(M)), window.history.replaceState(window.history.state, "", F);
    }
    pe(d, (g) => c(a.node.persistInQueryString, g)), pe(u, (g) => c(a.node.persistInQueryString, g));
    const v = y(
      () => (a.node.children ?? []).map((g) => ({
        label: g.label ?? "",
        description: g.description
      }))
    ), m = y(() => a.depth === 0), h = y(() => {
      const g = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline"
      }, M = { sm: "gap-2", md: "gap-4", lg: "gap-6" };
      return [
        g[a.node.align ?? "start"] ?? "items-start",
        M[a.node.gap ?? "md"] ?? "gap-4",
        a.node.wrap === !1 ? "flex-nowrap" : "flex-wrap"
      ];
    }), w = y(() => {
      const g = {
        info: "border-border bg-muted/50 text-foreground",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
        danger: "border-destructive/30 bg-destructive/10 text-destructive"
      };
      return g[a.node.tone ?? "info"] ?? g.info;
    }), k = y(() => {
      const g = a.node.columns, M = typeof g == "number" ? g : g?.default ?? g?.sm ?? g?.md ?? 1;
      return M >= 3 ? "sm:grid-cols-3" : M === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
    });
    function S(g) {
      const M = g.children?.length ?? 1;
      return M >= 3 ? "md:grid-cols-3" : M === 2 ? "md:grid-cols-2" : "md:grid-cols-1";
    }
    function C(g) {
      const M = g.columns, F = typeof M == "number" ? { default: M } : M, D = {};
      for (const Y of ["default", "sm", "md", "lg", "xl", "2xl"]) {
        const G = F?.[Y];
        typeof G == "number" && G > 0 && (D[`--pk-grid-cols-${Y}`] = String(Math.min(12, Math.max(1, G))));
      }
      return D;
    }
    function B(g = 1) {
      return g >= 4 ? "md:col-span-4" : g === 3 ? "md:col-span-3" : g === 2 ? "md:col-span-2" : "md:col-span-1";
    }
    function A(g) {
      const M = [], F = (D) => {
        D.component === "field" && D.key && M.push(D.key), D.children?.forEach(F);
      };
      return F(g), M.some((D) => a.errors[D]);
    }
    function $(g) {
      if (g.hidden)
        return !1;
      const M = g.visibleWhen;
      return M ? a.values[M.field] == M.value : !0;
    }
    function p(g) {
      if (a.upload)
        return (M, F) => a.upload(g, M, F);
    }
    return (g, M) => {
      const F = Qt("SchemaNode", !0);
      return e.node.component === "field" && $(e.node) ? (t(), T(We, {
        key: 0,
        field: e.node,
        value: e.values[e.node.key],
        values: e.values,
        error: e.errors[e.node.key],
        errors: e.errors,
        options: e.options[e.node.key],
        "child-options": e.options,
        processing: e.processing,
        "search-options": e.node.searchable && e.searchOptions ? (D) => e.searchOptions(e.node.key, D) : void 0,
        upload: p(e.node.key),
        discard: e.discard,
        onChange: M[0] || (M[0] = (D) => r("change", e.node.key, D)),
        onAffixAction: M[1] || (M[1] = (D) => r("affix-action", e.node.key, D))
      }, null, 8, ["field", "value", "values", "error", "errors", "options", "child-options", "processing", "search-options", "upload", "discard"])) : e.node.component === "section" && $(e.node) ? (t(), n("section", {
        key: 1,
        class: z(
          m.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("header", {
          class: z(["flex items-start justify-between gap-3", [
            m.value ? "px-4 py-3.5 sm:px-5" : "pb-2",
            e.node.collapsible ? "cursor-pointer select-none" : ""
          ]]),
          onClick: M[2] || (M[2] = (D) => e.node.collapsible && (s.value = !s.value))
        }, [
          l("div", qd, [
            e.node.icon ? (t(), n("div", Kd, [
              (t(), n("svg", Gd, [
                l("path", {
                  d: x(me)(e.node.icon)
                }, null, 8, Wd)
              ]))
            ])) : b("", !0),
            l("div", Zd, [
              l("h3", Jd, f(e.node.label), 1),
              e.node.description ? (t(), n("p", Yd, f(e.node.description), 1)) : b("", !0)
            ])
          ]),
          e.node.collapsible ? (t(), n("svg", {
            key: 0,
            viewBox: "0 0 24 24",
            class: z(["text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform", s.value ? "rotate-180" : ""]),
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5"
          }, [...M[24] || (M[24] = [
            l("path", { d: "m6 9 6 6 6-6" }, null, -1)
          ])], 2)) : b("", !0)
        ], 2),
        s.value ? (t(), n("div", {
          key: 0,
          class: z(["grid grid-cols-1 gap-4", [k.value, m.value ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""]])
        }, [
          (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), n("div", {
            key: Y,
            class: z(D.span && D.span >= 2 ? "sm:col-span-2" : "")
          }, [
            I(F, {
              node: D,
              values: e.values,
              errors: e.errors,
              options: e.options,
              processing: e.processing,
              "search-options": e.searchOptions,
              upload: e.upload,
              discard: e.discard,
              depth: e.depth + 1,
              onChange: M[3] || (M[3] = (G, Z) => r("change", G, Z)),
              onAffixAction: M[4] || (M[4] = (G, Z) => r("affix-action", G, Z))
            }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"])
          ], 2))), 128))
        ], 2)) : b("", !0)
      ], 2)) : e.node.component === "card" && $(e.node) ? (t(), n("section", Qd, [
        l("header", Xd, [
          l("h3", eu, f(e.node.title), 1),
          e.node.description ? (t(), n("p", tu, f(e.node.description), 1)) : b("", !0)
        ]),
        l("div", {
          class: z(["grid grid-cols-1 gap-4 px-4 py-4", k.value])
        }, [
          (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), T(F, {
            key: Y,
            node: D,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: M[5] || (M[5] = (G, Z) => r("change", G, Z)),
            onAffixAction: M[6] || (M[6] = (G, Z) => r("affix-action", G, Z))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)
      ])) : e.node.component === "columns" && $(e.node) ? (t(), n("div", {
        key: 3,
        class: z(["grid grid-cols-1 gap-4", S(e.node)])
      }, [
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), n("div", {
          key: Y,
          class: z(D.component === "column" ? B(D.span) : "")
        }, [
          I(F, {
            node: D,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: M[7] || (M[7] = (G, Z) => r("change", G, Z)),
            onAffixAction: M[8] || (M[8] = (G, Z) => r("affix-action", G, Z))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"])
        ], 2))), 128))
      ], 2)) : e.node.component === "column" && $(e.node) ? (t(), n("div", nu, [
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), T(F, {
          key: Y,
          node: D,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: M[9] || (M[9] = (G, Z) => r("change", G, Z)),
          onAffixAction: M[10] || (M[10] = (G, Z) => r("affix-action", G, Z))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ])) : e.node.component === "grid" && $(e.node) ? (t(), n("div", {
        key: 5,
        class: "pk-responsive-grid grid gap-4",
        style: ie(C(e.node))
      }, [
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), T(F, {
          key: Y,
          node: D,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: M[11] || (M[11] = (G, Z) => r("change", G, Z)),
          onAffixAction: M[12] || (M[12] = (G, Z) => r("affix-action", G, Z))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ], 4)) : e.node.component === "flex" && $(e.node) ? (t(), n("div", {
        key: 6,
        class: z(["flex", h.value])
      }, [
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), T(F, {
          key: Y,
          node: D,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: M[13] || (M[13] = (G, Z) => r("change", G, Z)),
          onAffixAction: M[14] || (M[14] = (G, Z) => r("affix-action", G, Z))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ], 2)) : e.node.component === "fieldset" && $(e.node) ? (t(), n("fieldset", au, [
        l("legend", lu, f(e.node.label), 1),
        e.node.description ? (t(), n("p", ou, f(e.node.description), 1)) : b("", !0),
        l("div", {
          class: z(["grid grid-cols-1 gap-4", k.value])
        }, [
          (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), T(F, {
            key: Y,
            node: D,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: M[15] || (M[15] = (G, Z) => r("change", G, Z)),
            onAffixAction: M[16] || (M[16] = (G, Z) => r("affix-action", G, Z))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)
      ])) : e.node.component === "callout" && $(e.node) ? (t(), n("div", {
        key: 8,
        role: "note",
        class: z(["rounded-lg border px-4 py-3 text-sm", w.value])
      }, [
        e.node.title ? (t(), n("p", su, f(e.node.title), 1)) : b("", !0),
        l("p", null, f(e.node.body), 1)
      ], 2)) : e.node.component === "tabs" && $(e.node) ? (t(), n("div", {
        key: 9,
        class: z(
          m.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("div", {
          class: z(["bg-muted/30 flex gap-1 overflow-x-auto p-1", m.value ? "rounded-t-lg border-b" : "rounded-md"]),
          role: "tablist",
          "aria-label": "Form sections"
        }, [
          (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), n("button", {
            key: Y,
            type: "button",
            role: "tab",
            class: z([
              "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              d.value === Y ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
            ]),
            "aria-selected": d.value === Y,
            onClick: (G) => d.value = Y
          }, [
            U(f(D.label) + " ", 1),
            D.badge !== null && D.badge !== void 0 ? (t(), T(Ie, {
              key: 0,
              variant: "secondary"
            }, {
              default: O(() => [
                U(f(D.badge), 1)
              ]),
              _: 2
            }, 1024)) : b("", !0),
            A(D) ? (t(), n("span", iu)) : b("", !0)
          ], 10, ru))), 128))
        ], 2),
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => ge((t(), n("div", {
          key: Y,
          class: z(["flex flex-col gap-5", m.value ? "p-4" : "pt-4"])
        }, [
          (t(!0), n(_, null, j(D.children ?? [], (G, Z) => (t(), T(F, {
            key: Z,
            node: G,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: M[17] || (M[17] = (W, H) => r("change", W, H)),
            onAffixAction: M[18] || (M[18] = (W, H) => r("affix-action", W, H))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)), [
          [Ke, d.value === Y]
        ])), 128))
      ], 2)) : e.node.component === "wizard" && $(e.node) ? (t(), n("div", {
        key: 10,
        class: z(
          m.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        I(ei, {
          class: z(["p-4", m.value ? "border-b" : ""]),
          steps: v.value,
          "active-step": u.value,
          "has-error": (D) => A((e.node.children ?? [])[D]),
          "onUpdate:activeStep": M[19] || (M[19] = (D) => u.value = D)
        }, null, 8, ["class", "steps", "active-step", "has-error"]),
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => ge((t(), n("div", {
          key: Y,
          class: z(["flex flex-col gap-5", m.value ? "p-4" : "pt-4"])
        }, [
          (t(!0), n(_, null, j(D.children ?? [], (G, Z) => (t(), T(F, {
            key: Z,
            node: G,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: M[20] || (M[20] = (W, H) => r("change", W, H)),
            onAffixAction: M[21] || (M[21] = (W, H) => r("affix-action", W, H))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)), [
          [Ke, u.value === Y]
        ])), 128)),
        l("div", du, [
          l("button", {
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-sm transition-colors disabled:pointer-events-none disabled:opacity-40",
            disabled: u.value === 0,
            onClick: M[22] || (M[22] = (D) => u.value--)
          }, " Back ", 8, uu),
          u.value < (e.node.children ?? []).length - 1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm transition-opacity hover:opacity-90",
            onClick: M[23] || (M[23] = (D) => u.value++)
          }, " Next ")) : b("", !0)
        ])
      ], 2)) : b("", !0);
    };
  }
}), Gn = /* @__PURE__ */ at(cu, [["__scopeId", "data-v-f2c53774"]]), U8 = /* @__PURE__ */ L({
  __name: "RelationCreateDialog",
  props: {
    open: { type: Boolean },
    title: { default: "Add" },
    form: { default: null },
    formOptions: { default: () => ({}) },
    processing: { type: Boolean, default: !1 },
    errors: { default: () => ({}) },
    searchOptions: { type: Function, default: void 0 }
  },
  emits: ["close", "submit"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q({});
    pe(
      () => a.open,
      (d) => {
        d && (s.value = {});
      }
    );
    function i() {
      r("submit", { ...s.value });
    }
    return (d, u) => (t(), T(mt, {
      open: e.open,
      title: e.title,
      size: "form",
      busy: e.processing,
      onClose: u[2] || (u[2] = (c) => r("close"))
    }, {
      footer: O(() => [
        I(ce, {
          variant: "ghost",
          size: "sm",
          disabled: e.processing,
          onClick: u[1] || (u[1] = (c) => r("close"))
        }, {
          default: O(() => [...u[3] || (u[3] = [
            U(" Cancel ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        I(ce, {
          size: "sm",
          disabled: e.processing,
          onClick: i
        }, {
          default: O(() => [
            U(f(e.processing ? "Saving…" : e.title), 1)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: O(() => [
        l("form", {
          class: "flex flex-col gap-4",
          onSubmit: he(i, ["prevent"])
        }, [
          (t(!0), n(_, null, j(e.form?.nodes ?? [], (c, v) => (t(), T(Gn, {
            key: v,
            node: c,
            values: s.value,
            errors: e.errors,
            processing: e.processing,
            options: e.formOptions,
            "search-options": e.searchOptions,
            onChange: u[0] || (u[0] = (m, h) => s.value[m] = h)
          }, null, 8, ["node", "values", "errors", "processing", "options", "search-options"]))), 128))
        ], 32)
      ]),
      _: 1
    }, 8, ["open", "title", "busy"]));
  }
}), fu = ["title"], mu = ["aria-label"], pu = ["d"], vu = { class: "sr-only" }, gu = /* @__PURE__ */ L({
  __name: "IconCell",
  props: {
    value: {},
    icons: { default: () => ({}) },
    colors: { default: () => ({}) },
    labels: { default: () => ({}) },
    defaultIcon: { default: "dot" }
  },
  setup(e) {
    const o = e, a = {
      check: "M20 6 9 17l-5-5",
      x: "M18 6 6 18M6 6l12 12",
      dot: "M12 12h.01",
      wifi: "M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01M2 8.8a15 15 0 0 1 20 0",
      "wifi-off": "M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.6M2 8.8a15 15 0 0 1 4.2-2.5M22 8.8a15 15 0 0 0-6-3.4M12 20h.01",
      alert: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
      clock: "M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
      star: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z",
      pause: "M10 4v16M14 4v16"
    }, r = {
      success: "text-emerald-600 dark:text-emerald-400",
      danger: "text-rose-600 dark:text-rose-400",
      warning: "text-amber-600 dark:text-amber-400",
      neutral: "text-muted-foreground"
    }, s = y(() => typeof o.value == "boolean" ? o.value ? "1" : "" : o.value === null || o.value === void 0 ? "" : String(o.value)), i = y(() => o.icons[s.value] ?? o.defaultIcon), d = y(() => a[i.value] ?? a.dot), u = y(() => r[o.colors[s.value] ?? "neutral"] ?? r.neutral), c = y(() => o.labels[s.value] ?? String(o.value ?? "-"));
    return (v, m) => (t(), n("span", {
      class: "inline-flex items-center",
      title: c.value
    }, [
      (t(), n("svg", {
        viewBox: "0 0 24 24",
        class: z(["size-4", u.value]),
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2.2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        role: "img",
        "aria-label": c.value
      }, [
        l("path", { d: d.value }, null, 8, pu)
      ], 10, mu)),
      l("span", vu, f(c.value), 1)
    ], 8, fu));
  }
}), hu = ["aria-label"], bu = ["fill"], H8 = /* @__PURE__ */ L({
  __name: "RatingCell",
  props: {
    value: {},
    max: { default: 5 }
  },
  setup(e) {
    const o = e, a = y(() => Math.max(1, Math.min(10, Number(o.max ?? 5)))), r = y(() => {
      const s = Number(o.value);
      return Number.isFinite(s) ? Math.max(0, Math.min(a.value, s)) : 0;
    });
    return (s, i) => (t(), n("span", {
      class: "inline-flex items-center gap-0.5 text-amber-500",
      "aria-label": `${r.value} of ${a.value}`,
      "data-test": "rating-cell"
    }, [
      (t(!0), n(_, null, j(a.value, (d) => (t(), n("svg", {
        key: d,
        class: "size-3.5",
        viewBox: "0 0 24 24",
        "aria-hidden": "true"
      }, [
        l("path", {
          d: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z",
          fill: r.value >= d ? "currentColor" : "none",
          stroke: "currentColor",
          "stroke-width": "1.5",
          "stroke-linejoin": "round"
        }, null, 8, bu)
      ]))), 128))
    ], 8, hu));
  }
}), yu = ["src"], xu = {
  key: 2,
  viewBox: "0 0 24 24",
  class: "size-1/2",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, ku = /* @__PURE__ */ L({
  __name: "ImageCell",
  props: {
    src: {},
    fallbackText: {},
    rounded: { type: Boolean, default: !0 },
    size: { default: "md" },
    fallback: { default: "initials" }
  },
  setup(e) {
    const o = e, a = q(!1);
    pe(
      () => o.src,
      () => a.value = !1
    );
    const r = { sm: "size-6", md: "size-8", lg: "size-10" }, s = y(() => {
      const d = typeof o.src == "string" ? o.src.trim() : "";
      return d === "" ? null : /^(https?:)?\/\//i.test(d) ? d : null;
    }), i = y(() => {
      const d = typeof o.fallbackText == "string" ? o.fallbackText.trim() : "";
      return d === "" ? "?" : d.split(/\s+/).slice(0, 2).map((u) => u[0]?.toUpperCase() ?? "").join("");
    });
    return (d, u) => (t(), n("span", {
      class: z(["bg-muted text-muted-foreground inline-flex shrink-0 items-center justify-center overflow-hidden text-[10px] font-medium", [r[e.size], e.rounded ? "rounded-full" : "rounded"]])
    }, [
      s.value && !a.value ? (t(), n("img", {
        key: 0,
        src: s.value,
        alt: "",
        loading: "lazy",
        class: "size-full object-cover",
        onError: u[0] || (u[0] = (c) => a.value = !0)
      }, null, 40, yu)) : e.fallback === "initials" ? (t(), n(_, { key: 1 }, [
        U(f(i.value), 1)
      ], 64)) : e.fallback === "icon" ? (t(), n("svg", xu, [...u[1] || (u[1] = [
        l("path", { d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" }, null, -1)
      ])])) : b("", !0)
    ], 2));
  }
}), $u = {
  key: 0,
  class: "text-muted-foreground"
}, wu = {
  key: 1,
  class: "inline-flex items-center gap-2"
}, Cu = {
  key: 0,
  class: "font-mono text-xs"
}, Su = {
  key: 1,
  class: "sr-only"
}, Mu = /* @__PURE__ */ L({
  __name: "ColourCell",
  props: {
    value: { default: null },
    showValue: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$|^[a-z]{3,20}$/i, r = y(() => {
      const s = (o.value ?? "").trim();
      return a.test(s) ? s : null;
    });
    return (s, i) => r.value === null ? (t(), n("span", $u, "-")) : (t(), n("span", wu, [
      l("span", {
        class: "size-4 shrink-0 rounded border",
        style: ie({ backgroundColor: r.value }),
        "aria-hidden": "true"
      }, null, 4),
      e.showValue ? (t(), n("span", Cu, f(r.value), 1)) : (t(), n("span", Su, f(r.value), 1))
    ]));
  }
}), Bu = { class: "inline-flex items-center" }, Au = ["checked", "aria-label"], zu = { class: "sr-only" }, q8 = /* @__PURE__ */ L({
  __name: "CheckboxCell",
  props: {
    value: {},
    trueLabel: { default: null },
    falseLabel: { default: null }
  },
  setup(e) {
    const o = e, a = y(() => {
      const s = o.value;
      return typeof s == "string" ? s !== "" && s !== "0" && s.toLowerCase() !== "false" : !!s;
    }), r = y(
      () => a.value ? o.trueLabel ?? "Yes" : o.falseLabel ?? "No"
    );
    return (s, i) => (t(), n("span", Bu, [
      l("input", {
        type: "checkbox",
        checked: a.value,
        disabled: "",
        "aria-readonly": "true",
        "aria-label": r.value,
        class: "border-input text-primary size-4 rounded disabled:opacity-100"
      }, null, 8, Au),
      l("span", zu, f(r.value), 1)
    ]));
  }
}), _u = {
  key: 0,
  class: "text-muted-foreground"
}, Pu = {
  key: 1,
  class: "block max-w-[28rem] truncate font-mono text-xs"
}, K8 = /* @__PURE__ */ L({
  __name: "CodeCell",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, a = y(
      () => String(o.value ?? "").replace(/\s+/g, " ").trim()
    );
    return (r, s) => a.value ? (t(), n("code", Pu, f(a.value), 1)) : (t(), n("span", _u, "—"));
  }
}), Lu = {
  key: 0,
  class: "font-mono text-xs"
}, Ou = {
  key: 1,
  class: "text-muted-foreground"
}, ju = {
  key: 2,
  class: "text-muted-foreground text-sm font-normal"
}, G8 = /* @__PURE__ */ L({
  __name: "KeyValueCell",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, a = y(
      () => o.value && typeof o.value == "object" && !Array.isArray(o.value) ? Object.keys(o.value) : null
    );
    return (r, s) => a.value === null && e.value != null ? (t(), n("span", Lu, f(e.value), 1)) : !a.value || a.value.length === 0 ? (t(), n("span", Ou, "—")) : (t(), n("span", ju, f(a.value.length) + " " + f(a.value.length === 1 ? "entry" : "entries"), 1));
  }
}), Vu = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Du = {
  key: 1,
  class: "inline-flex flex-wrap items-center gap-1"
}, W8 = /* @__PURE__ */ L({
  __name: "TagsCell",
  props: {
    value: {},
    limit: { default: null },
    separator: { default: "," }
  },
  setup(e) {
    const o = e;
    function a(d, u) {
      if (d == null || d === "")
        return [];
      if (Array.isArray(d))
        return d.map((c) => c == null ? "" : String(c).trim()).filter((c) => c !== "");
      if (typeof d == "string") {
        const c = d.trim();
        if (c.startsWith("["))
          try {
            const v = JSON.parse(c);
            if (Array.isArray(v))
              return a(v, u);
          } catch {
          }
        return c.split(u).map((v) => v.trim()).filter((v) => v !== "");
      }
      return [String(d)];
    }
    const r = y(() => a(o.value, o.separator)), s = y(() => o.limit === null || o.limit === void 0 || o.limit < 1 ? r.value : r.value.slice(0, o.limit)), i = y(() => Math.max(0, r.value.length - s.value.length));
    return (d, u) => r.value.length === 0 ? (t(), n("span", Vu, "None")) : (t(), n("span", Du, [
      (t(!0), n(_, null, j(s.value, (c) => (t(), T(Ie, {
        key: c,
        variant: "secondary"
      }, {
        default: O(() => [
          U(f(c), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      i.value > 0 ? (t(), T(Ie, {
        key: 0,
        variant: "outline"
      }, {
        default: O(() => [
          U("+" + f(i.value), 1)
        ]),
        _: 1
      })) : b("", !0)
    ]));
  }
}), Tu = ["aria-checked", "aria-label", "title", "disabled"], Iu = ["value", "placeholder", "disabled"], Eu = ["value", "disabled"], Fu = ["value"], Z8 = /* @__PURE__ */ L({
  __name: "EditableCell",
  props: {
    type: {},
    value: {},
    options: { default: () => ({}) },
    busy: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 },
    onLabel: { default: null },
    offLabel: { default: null },
    placeholder: { default: null }
  },
  emits: ["change"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.value === !0 || a.value === 1 || a.value === "1"), i = y(() => a.busy || a.disabled), d = y(
      () => s.value ? a.onLabel ?? "Enabled" : a.offLabel ?? "Disabled"
    );
    function u() {
      i.value || r("change", !s.value);
    }
    function c(w) {
      const k = w.target.value;
      k !== String(a.value ?? "") && r("change", k);
    }
    function v(w) {
      const S = w.target.value;
      S !== String(a.value ?? "") && r("change", S);
    }
    function m(w) {
      w.target.blur();
    }
    function h(w) {
      const k = w.target;
      k.value = String(a.value ?? ""), k.blur();
    }
    return (w, k) => e.type === "toggle" ? (t(), n("button", {
      key: 0,
      type: "button",
      role: "switch",
      "aria-checked": s.value,
      "aria-label": d.value,
      title: d.value,
      disabled: i.value,
      class: z(["relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50", s.value ? "bg-primary" : "bg-muted-foreground/30"]),
      onClick: he(u, ["stop"])
    }, [
      l("span", {
        class: z(["bg-background size-4 rounded-full shadow-sm transition-transform", s.value ? "translate-x-4.5" : "translate-x-0.5"])
      }, null, 2)
    ], 10, Tu)) : e.type === "text" ? (t(), n("input", {
      key: 1,
      type: "text",
      class: "bg-background hover:bg-accent focus:ring-ring w-full min-w-28 rounded-md border px-2 py-1 text-xs transition-colors focus:ring-2 focus:outline-none disabled:opacity-50",
      value: String(e.value ?? ""),
      placeholder: e.placeholder ?? void 0,
      disabled: i.value,
      onClick: k[0] || (k[0] = he(() => {
      }, ["stop"])),
      onBlur: v,
      onKeydown: [
        Ft(m, ["enter"]),
        Ft(h, ["esc"])
      ]
    }, null, 40, Iu)) : (t(), n("select", {
      key: 2,
      class: "bg-background hover:bg-accent focus:ring-ring w-full min-w-28 rounded-md border px-2 py-1 text-xs transition-colors focus:ring-2 focus:outline-none disabled:opacity-50",
      value: String(e.value ?? ""),
      disabled: i.value,
      onClick: k[1] || (k[1] = he(() => {
      }, ["stop"])),
      onChange: c
    }, [
      (t(!0), n(_, null, j(e.options, (S, C) => (t(), n("option", {
        key: C,
        value: C
      }, f(S), 9, Fu))), 128))
    ], 40, Eu));
  }
}), dn = {
  success: "success",
  danger: "destructive",
  warning: "warning",
  info: "info",
  neutral: "outline"
};
function Nu(e) {
  return e != null && e !== "";
}
function Ru(e) {
  const o = [];
  return e.type === "toggle" || e.type === "select" || e.type === "image" ? (e.align === "right" && o.push("text-right"), e.align === "center" && o.push("text-center"), o.join(" ")) : (e.key === "name" && o.push("font-medium"), e.mono && o.push("font-mono text-xs"), e.muted && o.push("text-muted-foreground"), e.transform === "upper" && o.push("uppercase"), e.transform === "lower" && o.push("lowercase"), e.align === "right" && o.push("text-right"), e.align === "center" && o.push("text-center"), o.join(" "));
}
function J8(e) {
  const o = y(
    () => e.value.map((s) => ({
      key: s.key,
      label: s.label,
      sortable: s.sortable,
      sortKey: s.sortKey,
      locked: s.locked,
      sticky: s.sticky,
      width: s.width,
      resizable: s.resizable,
      copyable: s.copyable,
      cellClass: Ru(s),
      group: s.group
    }))
  ), a = y(() => Object.fromEntries(e.value.map((s) => [s.key, s])));
  function r(s, i) {
    const d = a.value[s];
    if (!d)
      return "outline";
    const u = typeof i == "boolean" ? i ? "1" : "" : String(i), c = d.colors?.[u] ?? d.defaultColor ?? "neutral";
    return dn[c] ?? "outline";
  }
  return { columns: o, byKey: a, badgeVariant: r };
}
const Uu = ["disabled", "aria-label", "aria-busy"], Hu = {
  class: "text-muted-foreground size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, qu = ["d"], Ku = { class: "text-muted-foreground px-2 py-1.5 text-xs font-medium" }, Gu = ["disabled", "onClick"], Wu = {
  key: 0,
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-label": "Current"
}, Zu = ["d"], Ju = {
  key: 1,
  class: "size-4 shrink-0",
  "aria-hidden": "true"
}, Y8 = /* @__PURE__ */ L({
  __name: "BadgeResolver",
  props: {
    value: {},
    options: { default: () => ({}) },
    colors: { default: () => ({}) },
    defaultColor: { default: "neutral" },
    label: { default: "value" },
    busy: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 },
    soft: { type: Boolean, default: !0 }
  },
  emits: ["change"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.busy || a.disabled), i = y(() => String(a.value ?? "")), d = y(() => `Select ${(a.label || "value").trim().toLowerCase()}`);
    function u(h) {
      return typeof h == "boolean" ? h ? "1" : "" : String(h ?? "");
    }
    function c(h) {
      const w = a.colors[u(h)] ?? a.defaultColor ?? "neutral";
      return dn[w] ?? "outline";
    }
    function v(h) {
      return a.options[h] ?? h;
    }
    function m(h, w) {
      if (s.value || h === i.value) {
        w();
        return;
      }
      r("change", h), w();
    }
    return (h, w) => (t(), n("div", {
      onClick: w[0] || (w[0] = he(() => {
      }, ["stop"]))
    }, [
      e.disabled ? (t(), T(Ie, {
        key: 1,
        variant: c(e.value),
        soft: e.soft,
        class: "capitalize"
      }, {
        default: O(() => [
          U(f(v(i.value) || "-"), 1)
        ]),
        _: 1
      }, 8, ["variant", "soft"])) : (t(), T(qe, {
        key: 0,
        align: "start"
      }, {
        trigger: O(() => [
          l("button", {
            type: "button",
            class: "inline-flex items-center gap-0.5 rounded-full disabled:opacity-50",
            disabled: s.value,
            "aria-label": d.value,
            "aria-busy": e.busy
          }, [
            I(Ie, {
              variant: c(e.value),
              soft: e.soft,
              class: "capitalize"
            }, {
              default: O(() => [
                U(f(v(i.value) || "-"), 1)
              ]),
              _: 1
            }, 8, ["variant", "soft"]),
            (t(), n("svg", Hu, [
              l("path", {
                d: x(me)("chevron-down")
              }, null, 8, qu)
            ]))
          ], 8, Uu)
        ]),
        panel: O(({ close: k }) => [
          l("div", Ku, f(d.value), 1),
          (t(!0), n(_, null, j(e.options, (S, C) => (t(), n("button", {
            key: C,
            type: "button",
            role: "menuitem",
            class: "hover:bg-accent flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-left disabled:opacity-50",
            disabled: s.value,
            onClick: (B) => m(String(C), k)
          }, [
            I(Ie, {
              variant: c(C),
              soft: e.soft,
              class: "capitalize"
            }, {
              default: O(() => [
                U(f(S), 1)
              ]),
              _: 2
            }, 1032, ["variant", "soft"]),
            String(C) === i.value ? (t(), n("svg", Wu, [
              l("path", {
                d: x(me)("check")
              }, null, 8, Zu)
            ])) : (t(), n("span", Ju))
          ], 8, Gu))), 128))
        ]),
        _: 1
      }))
    ]));
  }
}), kn = {
  primary: "text-primary",
  gray: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-500",
  danger: "text-destructive",
  info: "text-sky-600 dark:text-sky-400"
};
function Yu(e) {
  return kn[e ?? "gray"] ?? kn.gray;
}
const Qu = { class: "flex items-center justify-end" }, Xu = ["aria-label"], ec = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, tc = ["d"], nc = ["href"], ac = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, lc = ["d"], oc = { class: "min-w-0 flex-1 truncate" }, sc = ["disabled", "onClick"], rc = ["d"], ic = { class: "min-w-0 flex-1 truncate" }, dc = {
  key: 0,
  class: "mt-0.5 border-t pt-0.5"
}, uc = ["disabled", "onClick"], cc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, fc = ["d"], mc = { class: "min-w-0 flex-1 truncate" }, pc = /* @__PURE__ */ L({
  __name: "RecordActions",
  props: {
    groups: {},
    title: {},
    busy: { default: null }
  },
  emits: ["run"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = q(null), d = q(null), u = y(() => r.groups.flatMap((A) => A.actions)), c = y(() => u.value.filter((A) => !A.destructive)), v = y(() => u.value.filter((A) => A.destructive));
    function m(A) {
      return Yu(A.color);
    }
    const h = y(() => u.value.length === 0);
    function w(A) {
      s("run", A);
    }
    function k(A) {
      if (r.busy !== A.key) {
        if (A.link) {
          A.url && window.location.assign(A.url);
          return;
        }
        w(A);
      }
    }
    function S(A, $) {
      const p = $.toLowerCase().split("+").map((F) => F.trim()), g = p.at(-1);
      return !g || A.key.toLowerCase() !== g ? !1 : (A.ctrlKey || A.metaKey) === p.includes("mod") && A.shiftKey === p.includes("shift") && A.altKey === p.includes("alt");
    }
    function C(A) {
      h.value || (A.preventDefault(), i.value?.openAt(A.clientX, A.clientY));
    }
    function B(A) {
      const $ = u.value.find(
        (D) => (D.keyBindings ?? []).some((Y) => S(A, Y))
      );
      if ($) {
        A.preventDefault(), k($);
        return;
      }
      if (A.key !== "ArrowDown" && A.key !== "ArrowUp")
        return;
      const p = Array.from(
        d.value?.querySelectorAll("[data-menu-item]") ?? []
      );
      if (p.length === 0)
        return;
      A.preventDefault();
      const g = p.indexOf(document.activeElement), M = A.key === "ArrowDown" ? 1 : -1, F = (g + M + p.length) % p.length;
      p[F]?.focus();
    }
    return o({ openContextMenu: C }), (A, $) => (t(), n("div", Qu, [
      h.value ? b("", !0) : (t(), T(qe, {
        key: 0,
        ref_key: "menu",
        ref: i,
        placement: "left"
      }, {
        trigger: O(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none",
            "aria-label": `Actions for ${e.title}`,
            "aria-haspopup": "menu"
          }, [
            (t(), n("svg", ec, [
              l("path", {
                d: x(me)("more-vertical")
              }, null, 8, tc)
            ]))
          ], 8, Xu)
        ]),
        panel: O(() => [
          l("div", {
            ref_key: "items",
            ref: d,
            class: "py-0.5",
            onKeydown: B
          }, [
            (t(!0), n(_, null, j(c.value, (p) => (t(), n(_, {
              key: p.key
            }, [
              p.link ? (t(), n("a", {
                key: 0,
                href: p.url ?? "#",
                "data-menu-item": "",
                role: "menuitem",
                class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none", m(p)])
              }, [
                (t(), n("svg", ac, [
                  l("path", {
                    d: x(Te)(p)
                  }, null, 8, lc)
                ])),
                l("span", oc, f(p.label), 1)
              ], 10, nc)) : (t(), n("button", {
                key: 1,
                type: "button",
                "data-menu-item": "",
                role: "menuitem",
                class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50", m(p)]),
                disabled: e.busy === p.key,
                onClick: (g) => w(p)
              }, [
                (t(), n("svg", {
                  class: z(["size-4 shrink-0", e.busy === p.key && "animate-pulse"]),
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "aria-hidden": "true"
                }, [
                  l("path", {
                    d: x(Te)(p)
                  }, null, 8, rc)
                ], 2)),
                l("span", ic, f(p.label), 1)
              ], 10, sc))
            ], 64))), 128)),
            v.value.length ? (t(), n("div", dc, [
              (t(!0), n(_, null, j(v.value, (p) => (t(), n("button", {
                key: p.key,
                type: "button",
                "data-menu-item": "",
                role: "menuitem",
                class: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                disabled: e.busy === p.key,
                onClick: (g) => w(p)
              }, [
                (t(), n("svg", cc, [
                  l("path", {
                    d: x(Te)({ ...p, destructive: !0 })
                  }, null, 8, fc)
                ])),
                l("span", mc, f(p.label), 1)
              ], 8, uc))), 128))
            ])) : b("", !0)
          ], 544)
        ]),
        _: 1
      }, 512))
    ]));
  }
}), vc = { class: "flex items-center justify-end gap-1" }, gc = { class: "hidden items-center gap-1 sm:flex" }, hc = ["href"], bc = {
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, yc = ["d"], xc = ["disabled", "onClick"], kc = ["d"], $c = {
  type: "button",
  class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors",
  "aria-haspopup": "menu"
}, wc = {
  key: 0,
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Cc = ["d"], Sc = { class: "py-0.5" }, Mc = ["href"], Bc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Ac = ["d"], zc = { class: "min-w-0 flex-1 truncate" }, _c = ["disabled", "onClick"], Pc = ["d"], Lc = { class: "min-w-0 flex-1 truncate" }, Q8 = /* @__PURE__ */ L({
  __name: "InlineRecordActions",
  props: {
    groups: {},
    title: {},
    busy: { default: null }
  },
  emits: ["run"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = q(null), d = y(() => r.groups.filter((A) => !A.label)), u = y(() => r.groups.filter((A) => A.label)), c = y(() => d.value.flatMap((A) => A.actions)), v = y(() => c.value.filter((A) => !A.destructive)), m = y(() => c.value.filter((A) => A.destructive)), h = y(() => r.groups.every((A) => A.actions.length === 0)), w = {
      primary: "text-primary",
      gray: "text-muted-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-500",
      danger: "text-destructive",
      info: "text-sky-600 dark:text-sky-400"
    };
    function k(A) {
      return w[A.color ?? "gray"] ?? w.gray;
    }
    function S(A) {
      s("run", A);
    }
    function C(A) {
      r.busy !== A.key && S(A);
    }
    function B(A) {
      h.value || i.value?.openContextMenu(A);
    }
    return o({ openContextMenu: B }), (A, $) => (t(), n("div", vc, [
      l("div", gc, [
        (t(!0), n(_, null, j([...v.value, ...m.value], (p) => (t(), n(_, {
          key: p.key
        }, [
          p.link ? (t(), n("a", {
            key: 0,
            href: p.url ?? "#",
            class: z(["hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors", k(p)])
          }, [
            (t(), n("svg", bc, [
              l("path", {
                d: x(Te)(p)
              }, null, 8, yc)
            ])),
            l("span", null, f(p.label), 1)
          ], 10, hc)) : (t(), n("button", {
            key: 1,
            type: "button",
            class: z(["hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50", k(p)]),
            disabled: e.busy === p.key,
            onClick: (g) => C(p)
          }, [
            (t(), n("svg", {
              class: z(["size-3.5 shrink-0", e.busy === p.key && "animate-pulse"]),
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "aria-hidden": "true"
            }, [
              l("path", {
                d: x(Te)(p)
              }, null, 8, kc)
            ], 2)),
            l("span", null, f(p.label), 1)
          ], 10, xc))
        ], 64))), 128)),
        (t(!0), n(_, null, j(u.value, (p) => (t(), T(qe, {
          key: p.label,
          align: "end",
          placement: "left"
        }, {
          trigger: O(() => [
            l("button", $c, [
              p.icon ? (t(), n("svg", wc, [
                l("path", {
                  d: x(me)(p.icon)
                }, null, 8, Cc)
              ])) : b("", !0),
              l("span", null, f(p.label), 1)
            ])
          ]),
          panel: O(() => [
            l("div", Sc, [
              (t(!0), n(_, null, j([
                ...p.actions.filter((g) => !g.destructive),
                ...p.actions.filter((g) => g.destructive)
              ], (g) => (t(), n(_, {
                key: g.key
              }, [
                g.link ? (t(), n("a", {
                  key: 0,
                  href: g.url ?? "#",
                  role: "menuitem",
                  class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none", g.destructive ? "text-destructive" : k(g)])
                }, [
                  (t(), n("svg", Bc, [
                    l("path", {
                      d: x(Te)(g)
                    }, null, 8, Ac)
                  ])),
                  l("span", zc, f(g.label), 1)
                ], 10, Mc)) : (t(), n("button", {
                  key: 1,
                  type: "button",
                  role: "menuitem",
                  class: z([
                    "hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    g.destructive ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10" : k(g)
                  ]),
                  disabled: e.busy === g.key,
                  onClick: (M) => S(g)
                }, [
                  (t(), n("svg", {
                    class: z(["size-4 shrink-0", e.busy === g.key && "animate-pulse"]),
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "aria-hidden": "true"
                  }, [
                    l("path", {
                      d: x(Te)({
                        ...g,
                        destructive: g.destructive
                      })
                    }, null, 8, Pc)
                  ], 2)),
                  l("span", Lc, f(g.label), 1)
                ], 10, _c))
              ], 64))), 128))
            ])
          ]),
          _: 2
        }, 1024))), 128))
      ]),
      I(pc, {
        ref_key: "fallback",
        ref: i,
        class: "sm:hidden",
        groups: e.groups,
        title: e.title,
        busy: e.busy,
        onRun: $[0] || ($[0] = (p) => s("run", p))
      }, null, 8, ["groups", "title", "busy"])
    ]));
  }
}), qt = {
  slate: {
    label: "Slate",
    // Keep the default action surface dark enough for white 14px text
    // in Chromium's contrast calculation, including antialiased glyphs.
    value: "oklch(0.24 0.02 260)",
    foreground: "oklch(0.98 0 0)"
  },
  emerald: {
    label: "Emerald",
    value: "oklch(0.60 0.14 163)",
    foreground: "oklch(0.99 0 0)"
  },
  green: {
    label: "Green",
    value: "oklch(0.63 0.17 145)",
    foreground: "oklch(0.99 0 0)"
  },
  lime: {
    label: "Lime",
    value: "oklch(0.72 0.18 130)",
    foreground: "oklch(0.20 0 0)"
  },
  orange: {
    label: "Orange",
    value: "oklch(0.68 0.18 45)",
    foreground: "oklch(0.99 0 0)"
  },
  amber: {
    label: "Amber",
    value: "oklch(0.75 0.15 75)",
    foreground: "oklch(0.20 0 0)"
  },
  yellow: {
    label: "Yellow",
    value: "oklch(0.82 0.16 95)",
    foreground: "oklch(0.20 0 0)"
  },
  teal: {
    label: "Teal",
    value: "oklch(0.62 0.11 190)",
    foreground: "oklch(0.99 0 0)"
  },
  cyan: {
    label: "Cyan",
    value: "oklch(0.68 0.12 215)",
    foreground: "oklch(0.20 0 0)"
  },
  sky: {
    label: "Sky",
    value: "oklch(0.63 0.15 240)",
    foreground: "oklch(0.99 0 0)"
  },
  blue: {
    label: "Blue",
    value: "oklch(0.55 0.20 262)",
    foreground: "oklch(0.99 0 0)"
  },
  indigo: {
    label: "Indigo",
    value: "oklch(0.51 0.22 277)",
    foreground: "oklch(0.99 0 0)"
  },
  violet: {
    label: "Violet",
    value: "oklch(0.56 0.24 295)",
    foreground: "oklch(0.99 0 0)"
  },
  fuchsia: {
    label: "Fuchsia",
    value: "oklch(0.63 0.26 320)",
    foreground: "oklch(0.99 0 0)"
  },
  pink: {
    label: "Pink",
    value: "oklch(0.63 0.22 355)",
    foreground: "oklch(0.99 0 0)"
  },
  rose: {
    label: "Rose",
    value: "oklch(0.62 0.22 15)",
    foreground: "oklch(0.99 0 0)"
  }
}, Kt = {
  neutral: { label: "Neutral", hue: 0, chroma: 0 },
  slate: { label: "Slate", hue: 260, chroma: 0.012 },
  gray: { label: "Gray", hue: 250, chroma: 6e-3 },
  zinc: { label: "Zinc", hue: 280, chroma: 6e-3 },
  stone: { label: "Stone", hue: 60, chroma: 8e-3 },
  warm: { label: "Warm", hue: 40, chroma: 0.014 },
  cool: { label: "Cool", hue: 220, chroma: 0.014 },
  sand: { label: "Sand", hue: 80, chroma: 0.016 }
}, Mt = 12, Bt = 20, Oc = [0, 0.25, 0.5, 0.75, 1], un = "alxtexhpanel.appearance", Ae = {
  // LIGHT, NOT THE OPERATING SYSTEM'S. See the Theme type - this is the whole
  // of the "mandatory light default": there is no branch that can produce
  // anything else before somebody chooses it.
  theme: "light",
  density: "comfortable",
  fontSize: 16,
  sidebarSide: "left",
  cardStyle: "transparent",
  // Matches the static `--radius: 0.5rem` app.css already shipped, so
  // nobody's panel visibly changes shape the first time this loads.
  radius: 0.5,
  contentLayout: "full",
  menuStyle: "collapsible",
  primary: "slate",
  // Untouched. `reset()` restores these defaults, so Reset is also the way
  // back to the organisation's colour.
  primaryChosen: !1,
  surface: "neutral"
}, Ve = q({ ...Ae });
let Qe = !1;
const Wn = "alxtexhpanel.appearance.vars", Gt = "pk-appearance";
function ot() {
  return typeof window > "u" ? null : window;
}
let At = null;
function Zn(e) {
  return JSON.stringify({
    theme: e.theme,
    density: e.density,
    fontSize: e.fontSize,
    sidebarSide: e.sidebarSide,
    cardStyle: e.cardStyle,
    radius: e.radius,
    contentLayout: e.contentLayout,
    menuStyle: e.menuStyle,
    primary: e.primary,
    primaryChosen: !!e.primaryChosen,
    surface: e.surface
  });
}
function Jn(e) {
  const o = ot();
  o && (o.__panelAppearance = { ...e });
}
function jc(e) {
  if (typeof document > "u")
    return;
  let o = document.getElementById(Gt);
  o || (o = document.createElement("style"), o.id = Gt, document.head.appendChild(o));
  const a = Object.entries(e).map(([r, s]) => `${r}: ${s};`).join(" ");
  o.textContent = `:root { ${a} }`;
}
function X8() {
  Qe = !1, At = null, Ve.value = { ...Ae };
  const e = ot();
  e && (e.__panelAppearanceApplied = !1), typeof document < "u" && document.getElementById(Gt)?.remove();
}
function cn(e) {
  return e.theme === "dark";
}
const $n = {
  compact: "0.25rem",
  comfortable: "0.5rem",
  spacious: "0.875rem"
}, wn = {
  compact: "0.75rem",
  comfortable: "1rem",
  spacious: "1.5rem"
};
function Yn(e) {
  const o = qt[e.primary] ?? qt.slate, a = Kt[e.surface] ?? Kt.neutral, r = a.chroma, s = a.hue, i = r > 0 ? r : 6e-3, d = r > 0 ? s : 250, c = cn(e) ? {
    "--background": `oklch(0.15 ${r} ${s})`,
    "--card": `oklch(${e.cardStyle === "filled" ? 0.19 : 0.15} ${r} ${s})`,
    "--popover": `oklch(0.18 ${r} ${s})`,
    "--muted": `oklch(0.24 ${r} ${s})`,
    "--muted-foreground": "oklch(0.78 0 0)",
    "--accent": `oklch(0.24 ${r} ${s})`,
    "--border": `oklch(0.27 ${r} ${s})`,
    "--input": `oklch(0.27 ${r} ${s})`
  } : {
    "--background": `oklch(0.975 ${i} ${d})`,
    "--card": `oklch(${e.cardStyle === "filled" ? 0.985 : 1} ${r} ${s})`,
    "--popover": "oklch(1 0 0)",
    "--muted": `oklch(0.965 ${r} ${s})`,
    "--muted-foreground": "oklch(0.28 0 0)",
    "--accent": `oklch(0.965 ${r} ${s})`,
    "--border": `oklch(0.925 ${r} ${s})`,
    "--input": `oklch(0.90 ${r} ${s})`
  };
  return {
    "--primary": o.value,
    "--primary-foreground": o.foreground,
    "--ring": o.value,
    ...c,
    "--pk-font-size": `${e.fontSize}px`,
    "--radius": `${e.radius}rem`,
    /*
     * A LOOKUP, not a ternary chain. The two-level version was
     * `compact ? a : b`, which silently treats every unrecognised value as
     * comfortable - including a third level added later, which is exactly
     * what happened. A map with an explicit fallback fails visibly instead:
     * the row simply does not change, rather than changing to something
     * plausible.
     */
    "--pk-row-padding": $n[e.density] ?? $n.comfortable,
    "--pk-form-gap": wn[e.density] ?? wn.comfortable
  };
}
function Vc(e) {
  return {
    dark: cn(e),
    theme: e.theme,
    vars: Yn(e),
    sidebar: e.sidebarSide,
    contentLayout: e.contentLayout
  };
}
function fn() {
  if (typeof window > "u")
    return { ...Ae };
  try {
    const e = localStorage.getItem(un);
    if (!e)
      return { ...Ae };
    const o = { ...Ae, ...JSON.parse(e) };
    o.theme === "system" && (o.theme = Ae.theme);
    const a = { small: 14, normal: 16, large: 18 };
    return typeof o.fontSize == "string" && (o.fontSize = a[o.fontSize] ?? Ae.fontSize), (typeof o.fontSize != "number" || Number.isNaN(o.fontSize) || o.fontSize < Mt || o.fontSize > Bt) && (o.fontSize = Ae.fontSize), o;
  } catch {
    return { ...Ae };
  }
}
function Dc() {
  const e = ot();
  if (!e)
    return null;
  const o = e.__panelAppearance;
  if (o && typeof o == "object")
    return o;
  try {
    const a = document.getElementById("app")?.dataset.page;
    if (!a)
      return null;
    const r = JSON.parse(a)?.props?.appearance;
    return r && typeof r == "object" ? r : null;
  } catch {
    return null;
  }
}
function Qn(e) {
  const o = fn(), a = e ? { ...Ae, ...o, ...e } : { ...Ae, ...o }, r = !Qe, s = Zn(a);
  if (Ve.value = a, Qe = !0, e) {
    Jn(a);
    try {
      localStorage.setItem(un, JSON.stringify(a));
    } catch {
    }
  }
  const d = ot()?.__panelAppearanceApplied === !0;
  if (At !== s) {
    if (r && d && e) {
      At = s;
      try {
        const u = Vc(a);
        localStorage.setItem(Wn, JSON.stringify(u));
      } catch {
      }
      return;
    }
    Wt(a);
  }
}
function eC() {
  Qn(Dc());
}
function tC(e) {
  const o = e?.props?.appearance;
  o != null && typeof o == "object" && Qn(o);
}
let Xn = null;
function nC(e) {
  Xn = e;
}
let ea = {};
function Tc(e) {
  if (ea = e, !(typeof document > "u") && !fn().primaryChosen)
    for (const [o, a] of Object.entries(e))
      document.documentElement.style.setProperty(o, a);
}
function Wt(e) {
  if (typeof document > "u")
    return;
  const o = document.documentElement, a = Yn(e), r = { ...a, ...e.primaryChosen ? {} : ea }, s = {
    dark: cn(e),
    theme: e.theme,
    vars: r,
    sidebar: e.sidebarSide,
    contentLayout: e.contentLayout
  };
  o.classList.toggle("dark", s.dark);
  for (const [d, u] of Object.entries(r))
    o.style.setProperty(d, u);
  o.dataset.sidebar = s.sidebar, o.dataset.contentLayout = s.contentLayout, jc(a), Jn(e), At = Zn(e);
  const i = ot();
  i && (i.__panelAppearanceApplied = !0);
  try {
    localStorage.setItem(Wn, JSON.stringify(s));
  } catch {
  }
}
function ta() {
  function e(r) {
    Wt(r);
  }
  function o(r) {
    const s = r.primary !== void 0 ? { primaryChosen: !0 } : {};
    Ve.value = { ...Ve.value, ...r, ...s };
    try {
      localStorage.setItem(un, JSON.stringify(Ve.value));
    } catch {
    }
    e(Ve.value), Xn?.({ ...r, ...s });
  }
  function a() {
    o({ ...Ae });
  }
  return be(() => {
    if (Qe || ot()?.__panelAppearanceApplied) {
      Qe = !0;
      return;
    }
    Qe = !0, Ve.value = fn(), Wt(Ve.value);
  }), {
    appearance: y(() => Ve.value),
    set: o,
    reset: a,
    PRIMARY_COLORS: qt,
    SURFACE_TINTS: Kt,
    FONT_SIZE_MIN: Mt,
    FONT_SIZE_MAX: Bt,
    RADIUS_OPTIONS: Oc
  };
}
const Ic = ["aria-busy", "aria-describedby"], Ec = { class: "bg-background flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3" }, Fc = { class: "min-w-0" }, Nc = { class: "flex shrink-0 items-center gap-2" }, Rc = ["disabled"], Uc = { class: "min-h-0 flex-1 overflow-y-auto overscroll-contain" }, Hc = {
  key: 0,
  class: "bg-muted/30 flex shrink-0 items-center justify-end gap-2 border-t px-4 py-3"
}, Pt = /* @__PURE__ */ L({
  __name: "PkSlideover",
  props: {
    open: { type: Boolean },
    title: {},
    description: { default: null },
    side: { default: "right" },
    size: { default: "sm" },
    width: { default: null },
    busy: { type: Boolean, default: !1 },
    padded: { type: Boolean, default: !0 }
  },
  emits: ["close"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = `pk-slideover-title-${Xe()}`, d = `pk-slideover-description-${Xe()}`, u = /* @__PURE__ */ Symbol("pk-slideover");
    let c = null, v = !1;
    const m = q(!1), h = y(() => a.width ?? yo[a.size]), w = y(
      () => [Un, a.padded ? bo : ""].filter(Boolean).join(" ")
    );
    function k(B) {
      m.value = B.target === B.currentTarget;
    }
    function S(B) {
      m.value && B.target === B.currentTarget && !a.busy && r("close"), m.value = !1;
    }
    function C(B) {
      if (!a.open)
        return;
      if (B.key === "Escape") {
        if (a.busy)
          return;
        B.stopPropagation(), r("close");
        return;
      }
      if (B.key !== "Tab" || !s.value)
        return;
      const A = s.value.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (A.length === 0)
        return;
      const $ = A[0], p = A[A.length - 1];
      B.shiftKey && document.activeElement === $ ? (B.preventDefault(), p.focus()) : !B.shiftKey && document.activeElement === p && (B.preventDefault(), $.focus());
    }
    return pe(
      () => a.open,
      async (B) => {
        if (B) {
          c = document.activeElement, Hn(u), v = !0, document.addEventListener("keydown", C), await De(), s.value?.querySelector("input, button, [tabindex]")?.focus();
          return;
        }
        if (v) {
          const A = St(u);
          v = !1, document.removeEventListener("keydown", C), A && c?.focus?.(), c = null;
        }
      },
      { immediate: !0 }
    ), ke(() => {
      document.removeEventListener("keydown", C), v && (St(u), v = !1);
    }), (B, A) => (t(), T(pt, { to: "body" }, [
      I(et, {
        "enter-active-class": "transition duration-150 ease-out",
        "enter-from-class": "opacity-0",
        "leave-active-class": "transition duration-100 ease-in",
        "leave-to-class": "opacity-0"
      }, {
        default: O(() => [
          e.open ? (t(), n("div", {
            key: 0,
            class: "fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]",
            onPointerdown: k,
            onPointerup: S
          }, null, 32)) : b("", !0)
        ]),
        _: 1
      }),
      I(et, {
        "enter-active-class": "transition duration-200 ease-out",
        "enter-from-class": e.side === "left" ? "-translate-x-full" : "translate-x-full",
        "leave-active-class": "transition duration-150 ease-in",
        "leave-to-class": e.side === "left" ? "-translate-x-full" : "translate-x-full"
      }, {
        default: O(() => [
          e.open ? (t(), n("aside", {
            key: 0,
            ref_key: "panel",
            ref: s,
            "data-pk-overlay": "",
            class: z(["bg-background fixed inset-y-0 z-50 flex h-dvh max-h-dvh max-w-full flex-col shadow-2xl", [h.value, e.side === "left" ? "left-0 border-r" : "right-0 border-l"]]),
            role: "dialog",
            "aria-modal": "true",
            "aria-busy": e.busy ? "true" : void 0,
            "aria-labelledby": i,
            "aria-describedby": e.description ? d : void 0
          }, [
            l("header", Ec, [
              l("div", Fc, [
                l("h2", {
                  id: i,
                  class: "text-base font-semibold"
                }, f(e.title), 1),
                e.description ? (t(), n("p", {
                  key: 0,
                  id: d,
                  class: "text-muted-foreground mt-0.5 text-xs"
                }, f(e.description), 1)) : b("", !0)
              ]),
              l("div", Nc, [
                K(B.$slots, "header-actions"),
                l("button", {
                  type: "button",
                  class: "text-muted-foreground hover:text-foreground disabled:opacity-50",
                  "aria-label": "Close",
                  disabled: e.busy,
                  onClick: A[0] || (A[0] = ($) => r("close"))
                }, [...A[1] || (A[1] = [
                  l("svg", {
                    viewBox: "0 0 24 24",
                    class: "size-4",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2.5"
                  }, [
                    l("path", { d: "M18 6 6 18M6 6l12 12" })
                  ], -1)
                ])], 8, Rc)
              ])
            ]),
            l("div", Uc, [
              l("div", {
                class: z(w.value)
              }, [
                K(B.$slots, "default")
              ], 2)
            ]),
            B.$slots.footer ? (t(), n("footer", Hc, [
              K(B.$slots, "footer")
            ])) : b("", !0)
          ], 10, Ic)) : b("", !0)
        ]),
        _: 3
      }, 8, ["enter-from-class", "leave-to-class"])
    ]));
  }
}), qc = { class: "flex flex-col gap-5 px-4 py-4" }, Kc = { class: "flex flex-col gap-2" }, Gc = { class: "grid grid-cols-8 gap-2" }, Wc = ["title", "aria-label", "aria-pressed", "onClick"], Zc = { class: "flex flex-col gap-2" }, Jc = { class: "grid grid-cols-8 gap-2" }, Yc = ["title", "aria-label", "aria-pressed", "onClick"], Qc = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "absolute inset-0 m-auto size-4 text-black",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3.5"
}, Xc = { class: "flex flex-col gap-2" }, ef = { class: "bg-muted/50 flex gap-0.5 rounded-md p-0.5" }, tf = ["aria-pressed", "aria-label", "onClick"], nf = { class: "text-sm font-semibold" }, af = { class: "bg-muted/50 flex gap-0.5 rounded-md p-0.5" }, lf = ["onClick"], of = { class: "flex flex-col gap-2" }, sf = { class: "flex items-center justify-between" }, rf = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, df = { class: "flex items-center gap-2" }, uf = ["disabled"], cf = ["min", "max", "value"], ff = ["disabled"], aC = /* @__PURE__ */ L({
  __name: "AppearanceDrawer",
  setup(e) {
    const { appearance: o, set: a, reset: r, PRIMARY_COLORS: s, SURFACE_TINTS: i, RADIUS_OPTIONS: d } = ta(), u = q(!1), c = y(() => o.value.sidebarSide === "right"), v = y(() => c.value ? "left" : "right"), m = [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" }
    ], h = [
      { value: "compact", label: "Compact" },
      { value: "comfortable", label: "Comfortable" },
      { value: "spacious", label: "Spacious" }
    ], w = [
      { value: "transparent", label: "Transparent" },
      { value: "filled", label: "Filled" }
    ], k = [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
      { value: "horizontal", label: "Top" }
    ], S = [
      { value: "full", label: "Full" },
      { value: "centered", label: "Centered" }
    ], C = [
      { value: "collapsible", label: "Collapsible" },
      { value: "drilldown", label: "Drill-down" }
    ];
    function B(A, $) {
      return `oklch(0.72 ${$ * 3} ${A})`;
    }
    return (A, $) => (t(), n(_, null, [
      l("button", {
        type: "button",
        class: "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors",
        "aria-label": "Appearance settings",
        title: "Appearance",
        onClick: $[0] || ($[0] = (p) => u.value = !0)
      }, [...$[6] || ($[6] = [
        ut('<svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 1 0-20c5 0 9 3.6 9 8 0 2.2-1.8 4-4 4h-2.2a1.8 1.8 0 0 0-1.3 3 1.8 1.8 0 0 1-1.5 3z"></path><circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="10.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="15" cy="8.5" r="1.2" fill="currentColor" stroke="none"></circle></svg>', 1)
      ])]),
      I(Pt, {
        open: u.value,
        title: "Settings",
        side: v.value,
        width: "w-80",
        padded: !1,
        onClose: $[5] || ($[5] = (p) => u.value = !1)
      }, {
        "header-actions": O(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground text-xs font-normal hover:underline",
            onClick: $[1] || ($[1] = //@ts-ignore
            (...p) => x(r) && x(r)(...p))
          }, " Reset ")
        ]),
        default: O(() => [
          l("div", qc, [
            l("section", Kc, [
              $[8] || ($[8] = l("h3", { class: "text-sm font-semibold" }, "Primary", -1)),
              l("div", Gc, [
                (t(!0), n(_, null, j(x(s), (p, g) => (t(), n("button", {
                  key: g,
                  type: "button",
                  class: "relative size-7 rounded-md transition-transform hover:scale-110",
                  style: ie({ background: p.value }),
                  title: p.label,
                  "aria-label": p.label,
                  "aria-pressed": x(o).primary === g,
                  onClick: (M) => x(a)({ primary: g })
                }, [
                  x(o).primary === g ? (t(), n("svg", {
                    key: 0,
                    viewBox: "0 0 24 24",
                    class: "absolute inset-0 m-auto size-4",
                    style: ie({ color: p.foreground }),
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "3.5"
                  }, [...$[7] || ($[7] = [
                    l("path", { d: "m5 13 4 4L19 7" }, null, -1)
                  ])], 4)) : b("", !0)
                ], 12, Wc))), 128))
              ])
            ]),
            l("section", Zc, [
              $[10] || ($[10] = l("h3", { class: "text-sm font-semibold" }, "Surface", -1)),
              l("div", Jc, [
                (t(!0), n(_, null, j(x(i), (p, g) => (t(), n("button", {
                  key: g,
                  type: "button",
                  class: "relative size-7 rounded-md border transition-transform hover:scale-110",
                  style: ie({ background: B(p.hue, p.chroma) }),
                  title: p.label,
                  "aria-label": p.label,
                  "aria-pressed": x(o).surface === g,
                  onClick: (M) => x(a)({ surface: g })
                }, [
                  x(o).surface === g ? (t(), n("svg", Qc, [...$[9] || ($[9] = [
                    l("path", { d: "m5 13 4 4L19 7" }, null, -1)
                  ])])) : b("", !0)
                ], 12, Yc))), 128))
              ])
            ]),
            l("section", Xc, [
              $[11] || ($[11] = l("h3", { class: "text-sm font-semibold" }, "Radius", -1)),
              l("div", ef, [
                (t(!0), n(_, null, j(x(d), (p) => (t(), n("button", {
                  key: p,
                  type: "button",
                  class: z([
                    "flex flex-1 flex-col items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors",
                    x(o).radius === p ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ]),
                  "aria-pressed": x(o).radius === p,
                  "aria-label": `${p}rem radius`,
                  onClick: (g) => x(a)({ radius: p })
                }, [
                  l("span", {
                    class: "border-foreground/50 block size-4 border-2",
                    style: ie({ borderRadius: `${Math.min(p, 0.5)}rem` })
                  }, null, 4),
                  U(" " + f(p), 1)
                ], 10, tf))), 128))
              ])
            ]),
            (t(!0), n(_, null, j([
              { label: "Color scheme", key: "theme", options: m },
              { label: "Card style", key: "cardStyle", options: w },
              { label: "Density", key: "density", options: h },
              { label: "Sidebar", key: "sidebarSide", options: k },
              { label: "Content layout", key: "contentLayout", options: S },
              { label: "Menu style", key: "menuStyle", options: C }
            ], (p) => (t(), n("section", {
              key: p.key,
              class: "flex flex-col gap-2"
            }, [
              l("h3", nf, f(p.label), 1),
              l("div", af, [
                (t(!0), n(_, null, j(p.options, (g) => (t(), n("button", {
                  key: String(g.value),
                  type: "button",
                  class: z([
                    "flex-1 rounded px-2 py-1.5 text-xs transition-colors",
                    x(o)[p.key] === g.value ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ]),
                  onClick: (M) => x(a)({ [p.key]: g.value })
                }, f(g.label), 11, lf))), 128))
              ])
            ]))), 128)),
            l("section", of, [
              l("div", sf, [
                $[12] || ($[12] = l("h3", { class: "text-sm font-semibold" }, "Font size", -1)),
                l("span", rf, f(x(o).fontSize) + "px", 1)
              ]),
              l("div", df, [
                l("button", {
                  type: "button",
                  class: "border-input hover:bg-accent size-7 rounded-md border text-sm disabled:opacity-40",
                  disabled: x(o).fontSize <= x(Mt),
                  "aria-label": "Decrease font size",
                  onClick: $[2] || ($[2] = (p) => x(a)({ fontSize: x(o).fontSize - 1 }))
                }, " − ", 8, uf),
                l("input", {
                  type: "range",
                  class: "accent-primary flex-1",
                  min: x(Mt),
                  max: x(Bt),
                  value: x(o).fontSize,
                  "aria-label": "Font size in pixels",
                  onInput: $[3] || ($[3] = (p) => x(a)({
                    fontSize: Number(p.target.value)
                  }))
                }, null, 40, cf),
                l("button", {
                  type: "button",
                  class: "border-input hover:bg-accent size-7 rounded-md border text-sm disabled:opacity-40",
                  disabled: x(o).fontSize >= x(Bt),
                  "aria-label": "Increase font size",
                  onClick: $[4] || ($[4] = (p) => x(a)({ fontSize: x(o).fontSize + 1 }))
                }, " + ", 8, ff)
              ])
            ])
          ])
        ]),
        _: 1
      }, 8, ["open", "side"])
    ], 64));
  }
}), mf = {
  class: "bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur sm:hidden",
  "aria-label": "Primary",
  style: { paddingBottom: "env(safe-area-inset-bottom)" }
}, pf = { class: "flex items-stretch" }, vf = ["href", "aria-current"], gf = {
  class: "size-5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, hf = ["d"], bf = { class: "w-full truncate text-center" }, yf = {
  key: 0,
  class: "flex-1"
}, xf = {
  class: "size-5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, kf = ["d"], $f = { class: "w-full truncate text-center" }, Dt = 5, lC = /* @__PURE__ */ L({
  __name: "PkBottomNav",
  props: {
    items: {},
    current: { default: "" },
    moreLabel: { default: "More" }
  },
  emits: ["more"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(
      () => a.items.length <= Dt ? a.items : a.items.slice(0, Dt - 1)
    ), i = y(() => a.items.length > Dt);
    function d(u) {
      return u === "/" ? a.current === "/" : a.current === u || a.current.startsWith(`${u}/`);
    }
    return (u, c) => (t(), n("nav", mf, [
      l("ul", pf, [
        (t(!0), n(_, null, j(s.value, (v) => (t(), n("li", {
          key: v.key,
          class: "flex-1"
        }, [
          l("a", {
            href: v.href,
            class: z([
              "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] transition-colors",
              d(v.href) ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            ]),
            "aria-current": d(v.href) ? "page" : void 0
          }, [
            (t(), n("svg", gf, [
              l("path", {
                d: x(me)(v.icon)
              }, null, 8, hf)
            ])),
            l("span", bf, f(v.title), 1)
          ], 10, vf)
        ]))), 128)),
        i.value ? (t(), n("li", yf, [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:text-foreground flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] transition-colors",
            onClick: c[0] || (c[0] = (v) => r("more"))
          }, [
            (t(), n("svg", xf, [
              l("path", {
                d: x(me)("more-horizontal")
              }, null, 8, kf)
            ])),
            l("span", $f, f(e.moreLabel), 1)
          ])
        ])) : b("", !0)
      ])
    ]));
  }
}), wf = { class: "lg:shrink-0 lg:self-start" }, Cf = { class: "lg:hidden" }, Sf = ["aria-expanded", "aria-label"], Mf = { class: "flex min-w-0 items-center gap-2" }, Bf = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Af = ["d"], zf = { class: "truncate" }, _f = ["aria-label"], Pf = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Lf = ["d"], Of = { class: "flex-1" }, jf = {
  key: 0,
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Vf = ["d"], Df = { class: "sticky top-6 hidden w-60 shrink-0 self-start lg:block" }, Tf = ["aria-label"], If = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Ef = ["d"], oC = /* @__PURE__ */ L({
  __name: "PkSubNav",
  props: {
    items: {},
    ariaLabel: { default: "Section" },
    fallbackIcon: { default: "sliders" }
  },
  setup(e) {
    const o = e, a = an();
    function r(u) {
      if (!u.startsWith("http"))
        return u;
      try {
        return new URL(u).pathname;
      } catch {
        return u;
      }
    }
    function s(u) {
      const c = r(a.url.split("?")[0]), v = r(u);
      return c === v || c.startsWith(`${v}/`);
    }
    const i = y(
      () => o.items.find((u) => s(u.href)) ?? o.items[0]
    );
    function d(u) {
      return u?.icon ?? o.fallbackIcon;
    }
    return (u, c) => (t(), n("div", wf, [
      l("div", Cf, [
        I(qe, { align: "start" }, {
          trigger: O(({ open: v }) => [
            l("button", {
              type: "button",
              class: "border-input bg-background hover:bg-accent flex h-10 w-full items-center justify-between rounded-md border px-3 text-sm shadow-xs",
              "aria-expanded": v,
              "aria-haspopup": "listbox",
              "aria-label": e.ariaLabel
            }, [
              l("span", Mf, [
                (t(), n("svg", Bf, [
                  l("path", {
                    d: x(me)(d(i.value))
                  }, null, 8, Af)
                ])),
                l("span", zf, f(i.value?.title), 1)
              ]),
              c[0] || (c[0] = l("svg", {
                class: "text-muted-foreground size-4 shrink-0 opacity-70",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "aria-hidden": "true"
              }, [
                l("path", { d: "m7 15 5 5 5-5M7 9l5-5 5 5" })
              ], -1))
            ], 8, Sf)
          ]),
          panel: O(() => [
            l("div", {
              class: "flex flex-col",
              role: "listbox",
              "aria-label": e.ariaLabel
            }, [
              (t(!0), n(_, null, j(e.items, (v) => (t(), T(x(Rt), {
                key: v.href,
                href: v.href,
                role: "option",
                "aria-selected": s(v.href),
                class: z([
                  "flex items-center gap-2 rounded-sm px-2 py-2 text-sm",
                  s(v.href) ? "bg-muted font-medium" : "hover:bg-muted/70"
                ])
              }, {
                default: O(() => [
                  (t(), n("svg", Pf, [
                    l("path", {
                      d: x(me)(d(v))
                    }, null, 8, Lf)
                  ])),
                  l("span", Of, f(v.title), 1),
                  s(v.href) ? (t(), n("svg", jf, [
                    l("path", {
                      d: x(me)("check")
                    }, null, 8, Vf)
                  ])) : b("", !0)
                ]),
                _: 2
              }, 1032, ["href", "aria-selected", "class"]))), 128))
            ], 8, _f)
          ]),
          _: 1
        })
      ]),
      l("aside", Df, [
        l("nav", {
          class: "flex flex-col space-y-1",
          "aria-label": e.ariaLabel
        }, [
          (t(!0), n(_, null, j(e.items, (v) => (t(), T(x(Rt), {
            key: v.href,
            href: v.href,
            class: z([
              x(Ye)({ variant: "ghost" }),
              "w-full justify-start",
              s(v.href) ? "bg-primary/10 text-foreground font-medium ring-1 ring-primary/15" : ""
            ])
          }, {
            default: O(() => [
              (t(), n("svg", If, [
                l("path", {
                  d: x(me)(d(v))
                }, null, 8, Ef)
              ])),
              U(" " + f(v.title), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"]))), 128))
        ], 8, Tf)
      ])
    ]));
  }
}), Ff = ["value"], we = /* @__PURE__ */ L({
  __name: "PkTextInput",
  props: {
    defaultValue: {},
    modelValue: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = `file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${He}`;
    return (i, d) => (t(), n("input", {
      "data-slot": "input",
      value: a.modelValue ?? a.defaultValue,
      class: z([s, a.class]),
      onInput: d[0] || (d[0] = (u) => r("update:modelValue", u.target.value))
    }, null, 42, Ff));
  }
}), Nf = ["for"], _e = /* @__PURE__ */ L({
  __name: "PkFieldLabel",
  props: {
    for: {},
    class: {}
  },
  setup(e) {
    return (o, a) => (t(), n("label", {
      "data-slot": "label",
      for: o.$props.for,
      class: z([
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        o.$props.class
      ])
    }, [
      K(o.$slots, "default")
    ], 10, Nf));
  }
}), sC = /* @__PURE__ */ L({
  __name: "PkSpinner",
  props: {
    class: {}
  },
  setup(e) {
    return (o, a) => (t(), n("svg", {
      role: "status",
      "aria-label": "Loading",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      class: z(["size-4 animate-spin", o.$props.class])
    }, [...a[0] || (a[0] = [
      l("circle", {
        cx: "12",
        cy: "12",
        r: "9",
        class: "opacity-25"
      }, null, -1),
      l("path", { d: "M21 12a9 9 0 0 0-9-9" }, null, -1)
    ])], 2));
  }
}), Rf = { class: "relative flex items-center gap-2 has-disabled:opacity-50" }, Uf = ["id", "name", "value", "disabled", "maxlength"], Hf = ["data-active"], qf = {
  key: 0,
  class: "pointer-events-none absolute inset-0 flex items-center justify-center"
}, Kf = /* @__PURE__ */ L({
  __name: "PkOtpInput",
  props: {
    modelValue: { default: "" },
    length: { default: 6 },
    disabled: { type: Boolean, default: !1 },
    autofocus: { type: Boolean, default: !1 },
    name: {},
    id: {}
  },
  emits: ["update:modelValue", "complete"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(!1), i = q(null), d = q("");
    be(() => {
      a.autofocus && i.value?.focus();
    });
    const u = y(
      () => Array.from({ length: a.length }, (A, $) => a.modelValue[$] ?? "")
    ), c = y(() => Math.min(a.modelValue.length, a.length - 1));
    function v(A) {
      return A.replace(/\D/g, "").slice(0, a.length);
    }
    function m(A) {
      a.disabled || A.length !== a.length || d.value !== A && (d.value = A, r("complete", A));
    }
    function h(A) {
      const $ = v(A);
      $ !== a.modelValue && r("update:modelValue", $), m($);
    }
    function w(A) {
      h(A.target.value);
    }
    function k(A) {
      h(A.target.value);
    }
    function S() {
      h(i.value?.value ?? "");
    }
    function C(A) {
      A.animationName === "pkOtpAutofillStart" && S();
    }
    pe(
      () => a.modelValue,
      (A) => {
        A.length < a.length ? d.value = "" : m(A);
      }
    );
    let B;
    return be(() => {
      B = window.setInterval(() => {
        if (a.disabled || !i.value)
          return;
        (i.value.matches(":-webkit-autofill") || i.value.matches(":autofill") || document.activeElement === i.value) && S();
      }, 250);
    }), ga(() => {
      B !== void 0 && window.clearInterval(B);
    }), (A, $) => (t(), n("div", Rf, [
      l("input", {
        ref_key: "field",
        ref: i,
        id: a.id,
        name: a.name,
        value: a.modelValue,
        disabled: a.disabled,
        inputmode: "numeric",
        autocomplete: "one-time-code",
        maxlength: a.length,
        class: "pk-otp-input absolute inset-0 z-10 w-full cursor-default bg-transparent text-transparent caret-transparent outline-none disabled:cursor-not-allowed",
        onInput: w,
        onChange: k,
        onAnimationstart: C,
        onFocus: $[0] || ($[0] = (p) => s.value = !0),
        onBlur: $[1] || ($[1] = (p) => s.value = !1)
      }, null, 40, Uf),
      (t(!0), n(_, null, j(u.value, (p, g) => (t(), n("div", {
        key: g,
        "data-slot": "input-otp-slot",
        "data-active": s.value && g === c.value,
        class: "data-[active=true]:border-ring data-[active=true]:ring-ring/50 border-input dark:bg-input/30 relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]"
      }, [
        U(f(p) + " ", 1),
        s.value && g === c.value && p === "" ? (t(), n("div", qf, [...$[2] || ($[2] = [
          l("div", { class: "bg-foreground h-4 w-px animate-pulse duration-1000" }, null, -1)
        ])])) : b("", !0)
      ], 8, Hf))), 128))
    ]));
  }
}), rC = /* @__PURE__ */ at(Kf, [["__scopeId", "data-v-0fdf60b6"]]), Gf = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Ee = /* @__PURE__ */ L({
  __name: "PkHeading",
  props: {
    title: {},
    description: {},
    variant: { default: "default" }
  },
  setup(e) {
    return (o, a) => (t(), n("header", {
      class: z(e.variant === "small" ? "" : "mb-8 space-y-0.5")
    }, [
      l("h2", {
        class: z(
          e.variant === "small" ? "mb-0.5 text-base font-medium" : "text-xl font-semibold tracking-tight"
        )
      }, f(e.title), 3),
      e.description ? (t(), n("p", Gf, f(e.description), 1)) : b("", !0)
    ], 2));
  }
}), Wf = {
  "data-slot": "page-header",
  class: "pk-section-heading flex flex-wrap items-start justify-between gap-3 pb-0.5"
}, Zf = { class: "min-w-0 space-y-1" }, Jf = { class: "flex flex-wrap items-center gap-2.5" }, Yf = { class: "text-2xl font-semibold tracking-tight" }, Qf = {
  key: 0,
  class: "flex items-center gap-2"
}, Xf = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, em = {
  key: 0,
  class: "flex shrink-0 flex-wrap items-center gap-2"
}, iC = /* @__PURE__ */ L({
  __name: "PkPageHeader",
  props: {
    title: {},
    purpose: {}
  },
  setup(e) {
    return (o, a) => (t(), n("header", Wf, [
      l("div", Zf, [
        l("div", Jf, [
          l("h1", Yf, f(e.title), 1),
          o.$slots.status ? (t(), n("div", Qf, [
            K(o.$slots, "status")
          ])) : b("", !0)
        ]),
        e.purpose ? (t(), n("p", Xf, f(e.purpose), 1)) : b("", !0)
      ]),
      o.$slots.actions ? (t(), n("div", em, [
        K(o.$slots, "actions")
      ])) : b("", !0)
    ]));
  }
}), tm = /* @__PURE__ */ L({
  __name: "Alert",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    variant: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert",
      class: z(x(oe)(x(lm)({ variant: e.variant }), o.class)),
      role: "alert"
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), nm = /* @__PURE__ */ L({
  __name: "AlertDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert-description",
      class: z(
        x(oe)(
          "col-start-2 text-sm font-normal text-muted-foreground [&_p]:leading-relaxed",
          o.class
        )
      )
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), am = /* @__PURE__ */ L({
  __name: "AlertTitle",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert-title",
      class: z(x(oe)("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), lm = ln(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
), om = { class: "list-inside list-disc text-sm" }, dC = /* @__PURE__ */ L({
  __name: "PkAlertError",
  props: {
    errors: {},
    title: { default: "Something went wrong." }
  },
  setup(e) {
    const o = e, a = y(() => Array.from(new Set(o.errors)));
    return (r, s) => (t(), T(x(tm), { variant: "destructive" }, {
      default: O(() => [
        I(x(sl), { class: "size-4" }),
        I(x(am), null, {
          default: O(() => [
            U(f(e.title), 1)
          ]),
          _: 1
        }),
        I(x(nm), null, {
          default: O(() => [
            l("ul", om, [
              (t(!0), n(_, null, j(a.value, (i, d) => (t(), n("li", { key: d }, f(i), 1))), 128))
            ])
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}), na = /* @__PURE__ */ L({
  __name: "Input",
  props: {
    defaultValue: {},
    modelValue: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, s = Rn(a, "modelValue", o, {
      passive: !0,
      defaultValue: a.defaultValue
    });
    return (i, d) => ge((t(), n("input", {
      "onUpdate:modelValue": d[0] || (d[0] = (u) => ha(s) ? s.value = u : null),
      "data-slot": "input",
      class: z(
        x(oe)(
          "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          x(He),
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          a.class
        )
      )
    }, null, 2)), [
      [ze, x(s)]
    ]);
  }
}), sm = { class: "relative" }, rm = ["aria-label"], uC = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkPasswordInput",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e, { expose: o }) {
    const a = e, r = q(!1), s = ba("inputRef");
    return o({
      $el: s,
      focus: () => s.value?.$el?.focus()
    }), (i, d) => (t(), n("div", sm, [
      I(x(na), de({
        ref_key: "inputRef",
        ref: s,
        type: r.value ? "text" : "password",
        class: x(oe)("pr-10", a.class)
      }, i.$attrs), null, 16, ["type", "class"]),
      l("button", {
        type: "button",
        class: z(
          x(oe)(
            "text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 focus-visible:ring-[3px] focus-visible:outline-none"
          )
        ),
        "aria-label": r.value ? "Hide password" : "Show password",
        tabindex: -1,
        onClick: d[0] || (d[0] = (u) => r.value = !r.value)
      }, [
        r.value ? (t(), T(x(rl), {
          key: 0,
          class: "size-4"
        })) : (t(), T(x(il), {
          key: 1,
          class: "size-4"
        }))
      ], 10, rm)
    ]));
  }
}), aa = "@container min-w-0", im = "grid grid-cols-1 gap-3 @lg:grid-cols-2 @3xl:grid-cols-3", cC = "grid grid-cols-1 gap-2 @lg:grid-cols-2 @3xl:grid-cols-3", dm = "grid grid-cols-1 gap-4 @lg:grid-cols-2 @lg:gap-5 @3xl:grid-cols-3";
function um(e) {
  if (e === void 0)
    return 1;
  if (typeof e == "number")
    return e;
  if (e.lg !== void 0)
    return e.lg;
  if (e.default !== void 0)
    return e.default;
  const o = Object.values(e);
  return o.length > 0 ? Math.max(...o) : 1;
}
function fC(e, o) {
  const a = Math.max(1, Math.floor(o));
  if (e.length === 0)
    return [];
  if (a === 1)
    return [{ type: "columns", columns: [[...e]] }];
  const r = [];
  let s = [];
  const i = () => {
    if (s.length === 0)
      return;
    const d = Array.from({ length: Math.min(a, s.length) }, () => []);
    s.forEach((u, c) => {
      d[c % a].push(u);
    }), r.push({ type: "columns", columns: d }), s = [];
  };
  for (const d of e)
    um(d.span) >= 2 ? (i(), r.push({ type: "wide", item: d })) : s.push(d);
  return i(), r;
}
function Cn(e, o) {
  return `${e}:${o}`;
}
function mC(e) {
  const o = /^(stat|chart|table):([a-z0-9_-]+)$/i.exec(e);
  return o ? {
    kind: o[1].toLowerCase(),
    key: o[2]
  } : null;
}
function Zt(e, o = 1) {
  return (e ?? o) >= 2 ? 2 : 1;
}
function pC(e, o, a, r) {
  const s = [
    { kind: "stat", items: e },
    { kind: "chart", items: o },
    { kind: "table", items: a }
  ], i = /* @__PURE__ */ new Map();
  for (const c of s)
    for (const v of c.items)
      i.set(Cn(c.kind, v.key), {
        kind: c.kind,
        source: v
      });
  const d = [], u = /* @__PURE__ */ new Set();
  for (const c of r?.widgets ?? []) {
    const v = c.id.toLowerCase(), m = i.get(v);
    m && (u.add(v), d.push({
      id: v,
      kind: m.kind,
      key: m.source.key,
      span: Zt(c.span),
      hidden: !!c.hidden,
      source: m.source
    }));
  }
  for (const c of s)
    for (const v of c.items) {
      const m = Cn(c.kind, v.key);
      u.has(m) || d.push({
        id: m,
        kind: c.kind,
        key: v.key,
        span: Zt(v.span),
        hidden: !1,
        source: v
      });
    }
  return d;
}
function vC(e) {
  return {
    widgets: e.map((o) => ({
      id: o.id.toLowerCase(),
      span: Zt(o.span),
      hidden: !!o.hidden
    }))
  };
}
const la = "Upload a PNG with a transparent background so it sits on invoices and contracts without a white box.", cm = "This image has no transparent background. Upload a PNG (or WebP) with alpha so it sits on invoices and contracts without a white box.", fm = "JPEG files are fully opaque and stamp a white rectangle. Upload a PNG with a transparent background.";
function mm(e) {
  const o = e.name.toLowerCase(), a = e.type.toLowerCase();
  return a === "image/jpeg" || a === "image/jpg" || o.endsWith(".jpg") || o.endsWith(".jpeg");
}
function pm(e) {
  const o = e.name.toLowerCase(), a = e.type.toLowerCase();
  return a === "image/png" || a === "image/webp" || o.endsWith(".png") || o.endsWith(".webp");
}
async function vm(e) {
  const o = URL.createObjectURL(e);
  try {
    const a = await gm(o), r = document.createElement("canvas"), s = Math.max(1, a.naturalWidth), i = Math.max(1, a.naturalHeight);
    r.width = s, r.height = i;
    const d = r.getContext("2d", { willReadFrequently: !0 });
    if (!d)
      return !1;
    d.drawImage(a, 0, 0);
    const { data: u } = d.getImageData(0, 0, s, i);
    for (let c = 3; c < u.length; c += 4)
      if ((u[c] ?? 255) < 255)
        return !0;
    return !1;
  } finally {
    URL.revokeObjectURL(o);
  }
}
function gm(e) {
  return new Promise((o, a) => {
    const r = new Image();
    r.onload = () => o(r), r.onerror = () => a(new Error("Could not read that image.")), r.src = e;
  });
}
async function hm(e) {
  if (mm(e))
    throw new Error(fm);
  if (!pm(e))
    throw new Error(la);
  if (!await vm(e))
    throw new Error(cm);
}
const gC = /* @__PURE__ */ L({
  __name: "SheetClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(tt), de({ "data-slot": "sheet-close" }, o), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), bm = /* @__PURE__ */ L({
  __name: "SheetDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Vn), de({
      "data-slot": "sheet-description",
      class: x(oe)("text-sm text-muted-foreground font-normal", o.class)
    }, x(a)), {
      default: O(() => [
        K(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), hC = /* @__PURE__ */ L({
  __name: "SheetFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sheet-footer",
      class: z(x(oe)("mt-auto flex flex-col gap-2 p-4", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), ym = /* @__PURE__ */ L({
  __name: "SheetHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sheet-header",
      class: z(x(oe)("flex flex-col gap-1.5 p-4", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), xm = /* @__PURE__ */ L({
  __name: "SheetTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Dn), de({
      "data-slot": "sheet-title",
      class: x(oe)("text-foreground font-semibold", o.class)
    }, x(a)), {
      default: O(() => [
        K(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), bC = /* @__PURE__ */ L({
  __name: "SheetTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Tn), de({ "data-slot": "sheet-trigger" }, o), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Sn = "sidebar_state", km = 3600 * 24 * 7, $m = "16rem", wm = "18rem", Cm = "3rem", Sm = "b", [Lt, Mm] = Ba("Sidebar"), Bm = { class: "flex h-full w-full flex-col" }, Am = ["data-state", "data-collapsible", "data-variant", "data-side"], zm = {
  "data-sidebar": "sidebar",
  class: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
}, yC = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "Sidebar",
  props: {
    side: { default: "left" },
    variant: { default: "sidebar" },
    collapsible: { default: "offcanvas" },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { isMobile: a, state: r, openMobile: s, setOpenMobile: i } = Lt();
    return (d, u) => e.collapsible === "none" ? (t(), n("div", de({
      key: 0,
      "data-slot": "sidebar",
      class: x(oe)(
        "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
        o.class
      )
    }, d.$attrs), [
      K(d.$slots, "default")
    ], 16)) : x(a) ? (t(), T(x(sn), de({
      key: 1,
      open: x(s)
    }, d.$attrs, { "onUpdate:open": x(i) }), {
      default: O(() => [
        I(x(rn), {
          "data-sidebar": "sidebar",
          "data-slot": "sidebar",
          "data-mobile": "true",
          "data-state": "expanded",
          "data-collapsible": "",
          side: e.side,
          class: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) max-w-none min-w-[16rem] p-0 sm:max-w-none [&>button]:hidden",
          style: ie({
            "--sidebar-width": x(wm)
          })
        }, {
          default: O(() => [
            I(ym, { class: "sr-only" }, {
              default: O(() => [
                I(xm, null, {
                  default: O(() => [...u[0] || (u[0] = [
                    U("Sidebar", -1)
                  ])]),
                  _: 1
                }),
                I(bm, null, {
                  default: O(() => [...u[1] || (u[1] = [
                    U("Displays the mobile sidebar.", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }),
            l("div", Bm, [
              K(d.$slots, "default")
            ])
          ]),
          _: 3
        }, 8, ["side", "style"])
      ]),
      _: 3
    }, 16, ["open", "onUpdate:open"])) : (t(), n("div", {
      key: 2,
      class: "group peer text-sidebar-foreground hidden md:block",
      "data-slot": "sidebar",
      "data-state": x(r),
      "data-collapsible": x(r) === "collapsed" ? e.collapsible : "",
      "data-variant": e.variant,
      "data-side": e.side
    }, [
      l("div", {
        class: z(
          x(oe)(
            "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            e.variant === "floating" || e.variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
          )
        )
      }, null, 2),
      l("div", de({
        class: x(oe)(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          e.side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          e.variant === "floating" || e.variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          o.class
        )
      }, d.$attrs), [
        l("div", zm, [
          K(d.$slots, "default")
        ])
      ], 16)
    ], 8, Am));
  }
}), xC = /* @__PURE__ */ L({
  __name: "SidebarContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      class: z(
        x(oe)(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          o.class
        )
      )
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), kC = /* @__PURE__ */ L({
  __name: "SidebarFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      class: z(x(oe)("flex flex-col gap-2 p-2", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), $C = /* @__PURE__ */ L({
  __name: "SidebarGroup",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      class: z(x(oe)("relative flex w-full min-w-0 flex-col p-2", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), wC = /* @__PURE__ */ L({
  __name: "SidebarGroupAction",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(nt), {
      "data-slot": "sidebar-group-action",
      "data-sidebar": "group-action",
      as: e.as,
      "as-child": e.asChild,
      class: z(
        x(oe)(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-sidebar-ring/50 focus-visible:ring-[3px] [&>svg]:size-4 [&>svg]:shrink-0",
          "after:absolute after:-inset-2 md:after:hidden",
          "group-data-[collapsible=icon]:hidden",
          o.class
        )
      )
    }, {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), CC = /* @__PURE__ */ L({
  __name: "SidebarGroupContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      class: z(x(oe)("w-full text-sm", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), SC = /* @__PURE__ */ L({
  __name: "SidebarGroupLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(nt), {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      as: e.as,
      "as-child": e.asChild,
      class: z(
        x(oe)(
          // /70 measured at 4.26:1 against the sidebar background - short of the
          // 4.5:1 WCAG AA floor for normal text. /80 measures ~5.6:1.
          "text-sidebar-foreground/80 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-sidebar-ring/50 focus-visible:ring-[3px] [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          o.class
        )
      )
    }, {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), MC = /* @__PURE__ */ L({
  __name: "SidebarHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      class: z(x(oe)("flex flex-col gap-2 p-2", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), BC = /* @__PURE__ */ L({
  __name: "SidebarInput",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(na), {
      "data-slot": "sidebar-input",
      "data-sidebar": "input",
      class: z(x(oe)("bg-background h-8 w-full shadow-none", o.class))
    }, {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), AC = /* @__PURE__ */ L({
  __name: "SidebarInset",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("main", {
      "data-slot": "sidebar-inset",
      class: z(
        x(oe)(
          "bg-background relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto",
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm",
          // Side-aware insets. The upstream component hardcodes ml-0, so with the
          // sidebar on the right the content kept a left gutter it did not need and
          // reserved nothing on the right - the panel then overlapped the table.
          "md:peer-data-[variant=inset]:peer-data-[side=left]:ml-0 md:peer-data-[variant=inset]:peer-data-[side=left]:peer-data-[state=collapsed]:ml-2",
          "md:peer-data-[variant=inset]:peer-data-[side=right]:mr-0 md:peer-data-[variant=inset]:peer-data-[side=right]:peer-data-[state=collapsed]:mr-2",
          o.class
        )
      )
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), zC = /* @__PURE__ */ L({
  __name: "SidebarMenu",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("ul", {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      class: z(x(oe)("flex w-full min-w-0 flex-col gap-1", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), _C = /* @__PURE__ */ L({
  __name: "SidebarMenuAction",
  props: {
    asChild: { type: Boolean },
    as: { default: "button" },
    showOnHover: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(nt), {
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      class: z(
        x(oe)(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-sidebar-ring/50 focus-visible:ring-[3px] [&>svg]:size-4 [&>svg]:shrink-0",
          "after:absolute after:-inset-2 md:after:hidden",
          "peer-data-[size=sm]/menu-button:top-1",
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "group-data-[collapsible=icon]:hidden",
          e.showOnHover && "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
          o.class
        )
      ),
      as: e.as,
      "as-child": e.asChild
    }, {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "as", "as-child"]));
  }
}), PC = /* @__PURE__ */ L({
  __name: "SidebarMenuBadge",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-menu-badge",
      "data-sidebar": "menu-badge",
      class: z(
        x(oe)(
          "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
          "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
          "peer-data-[size=sm]/menu-button:top-1",
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "group-data-[collapsible=icon]:hidden",
          o.class
        )
      )
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), _m = /* @__PURE__ */ L({
  __name: "Tooltip",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    delayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), T(x(Aa), de({ "data-slot": "tooltip" }, x(s)), {
      default: O((u) => [
        K(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
}), Pm = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "TooltipContent",
  props: {
    forceMount: { type: Boolean },
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: { default: 4 },
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(za), null, {
      default: O(() => [
        I(x(_a), de({ "data-slot": "tooltip-content" }, { ...x(i), ...d.$attrs }, {
          class: x(oe)(
            "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
            a.class
          )
        }), {
          default: O(() => [
            K(d.$slots, "default"),
            I(x(Pa), { class: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), LC = /* @__PURE__ */ L({
  __name: "TooltipProvider",
  props: {
    delayDuration: { default: 0 },
    skipDelayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean },
    content: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(In), Le(Re(o)), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Lm = /* @__PURE__ */ L({
  __name: "TooltipTrigger",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(La), de({ "data-slot": "tooltip-trigger" }, o), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Mn = /* @__PURE__ */ L({
  __name: "SidebarMenuButtonChild",
  props: {
    variant: { default: "default" },
    size: { default: "default" },
    isActive: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] },
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(nt), de({
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": e.size,
      "data-active": e.isActive,
      class: x(oe)(x(jm)({ variant: e.variant, size: e.size }), o.class),
      as: e.as,
      "as-child": e.asChild
    }, a.$attrs), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-size", "data-active", "class", "as", "as-child"]));
  }
}), OC = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "SidebarMenuButton",
  props: {
    variant: { default: "default" },
    size: { default: "default" },
    isActive: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] },
    asChild: { type: Boolean },
    as: { default: "button" },
    tooltip: {}
  },
  setup(e) {
    const o = e, { isMobile: a, state: r } = Lt(), s = ve(o, "tooltip");
    return (i, d) => e.tooltip ? (t(), T(x(_m), { key: 1 }, {
      default: O(() => [
        I(x(Lm), { "as-child": "" }, {
          default: O(() => [
            I(Mn, Le(Re({ ...x(s), ...i.$attrs })), {
              default: O(() => [
                K(i.$slots, "default")
              ]),
              _: 3
            }, 16)
          ]),
          _: 3
        }),
        I(x(Pm), {
          side: "right",
          align: "center",
          hidden: x(r) !== "collapsed" || x(a)
        }, {
          default: O(() => [
            typeof e.tooltip == "string" ? (t(), n(_, { key: 0 }, [
              U(f(e.tooltip), 1)
            ], 64)) : (t(), T(Ce(e.tooltip), { key: 1 }))
          ]),
          _: 1
        }, 8, ["hidden"])
      ]),
      _: 3
    })) : (t(), T(Mn, Le(de({ key: 0 }, { ...x(s), ...i.$attrs })), {
      default: O(() => [
        K(i.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), jC = /* @__PURE__ */ L({
  __name: "SidebarMenuItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      class: z(x(oe)("group/menu-item relative", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), Bn = "animate-pulse rounded-md bg-primary/10", VC = /* @__PURE__ */ L({
  __name: "SidebarMenuSkeleton",
  props: {
    showIcon: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = y(() => `${Math.floor(Math.random() * 40) + 50}%`);
    return (r, s) => (t(), n("div", {
      "data-slot": "sidebar-menu-skeleton",
      "data-sidebar": "menu-skeleton",
      class: z(x(oe)("flex h-8 items-center gap-2 rounded-md px-2", o.class))
    }, [
      e.showIcon ? (t(), n("div", {
        key: 0,
        class: z(x(oe)(Bn, "size-4")),
        "data-sidebar": "menu-skeleton-icon"
      }, null, 2)) : b("", !0),
      l("div", {
        class: z(x(oe)(Bn, "h-4 max-w-(--skeleton-width) flex-1")),
        "data-sidebar": "menu-skeleton-text",
        style: ie({ "--skeleton-width": a.value })
      }, null, 6)
    ], 2));
  }
}), DC = /* @__PURE__ */ L({
  __name: "SidebarMenuSub",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("ul", {
      "data-slot": "sidebar-menu-sub",
      "data-sidebar": "menu-badge",
      class: z(
        x(oe)(
          "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
          "group-data-[collapsible=icon]:hidden",
          o.class
        )
      )
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), TC = /* @__PURE__ */ L({
  __name: "SidebarMenuSubButton",
  props: {
    asChild: { type: Boolean },
    as: { default: "a" },
    size: { default: "md" },
    isActive: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(nt), {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      as: e.as,
      "as-child": e.asChild,
      "data-size": e.size,
      "data-active": e.isActive,
      class: z(
        x(oe)(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-sidebar-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
          "data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
          e.size === "sm" && "text-xs",
          e.size === "md" && "text-sm",
          "group-data-[collapsible=icon]:hidden",
          o.class
        )
      )
    }, {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "data-size", "data-active", "class"]));
  }
}), IC = /* @__PURE__ */ L({
  __name: "SidebarMenuSubItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      class: z(x(oe)("group/menu-sub-item relative", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), EC = /* @__PURE__ */ L({
  __name: "SidebarProvider",
  props: {
    defaultOpen: { type: Boolean, default: !hl?.cookie.includes(`${Sn}=false`) },
    open: { type: Boolean, default: void 0 },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = vl("(max-width: 767px)"), i = q(!1), d = Rn(a, "open", r, {
      defaultValue: a.defaultOpen ?? !1,
      passive: a.open === void 0
    });
    function u(h) {
      d.value = h, document.cookie = `${Sn}=${d.value}; path=/; max-age=${km}`;
    }
    function c(h) {
      i.value = h;
    }
    function v() {
      return s.value ? c(!i.value) : u(!d.value);
    }
    gl("keydown", (h) => {
      h.key === Sm && (h.metaKey || h.ctrlKey) && (h.preventDefault(), v());
    });
    const m = y(() => s.value || d.value ? "expanded" : "collapsed");
    return Mm({
      state: m,
      open: d,
      setOpen: u,
      isMobile: s,
      openMobile: i,
      setOpenMobile: c,
      toggleSidebar: v
    }), (h, w) => (t(), T(x(In), { "delay-duration": 0 }, {
      default: O(() => [
        l("div", de({
          "data-slot": "sidebar-wrapper",
          style: {
            "--sidebar-width": x($m),
            "--sidebar-width-icon": x(Cm)
          },
          class: x(oe)(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex h-svh min-h-svh w-full overflow-hidden",
            a.class
          )
        }, h.$attrs), [
          K(h.$slots, "default")
        ], 16)
      ]),
      _: 3
    }));
  }
}), FC = /* @__PURE__ */ L({
  __name: "SidebarRail",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { toggleSidebar: a } = Lt();
    return (r, s) => (t(), n("button", {
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabindex: -1,
      title: "Toggle Sidebar",
      class: z(
        x(oe)(
          "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
          "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          o.class
        )
      ),
      onClick: s[0] || (s[0] = //@ts-ignore
      (...i) => x(a) && x(a)(...i))
    }, [
      K(r.$slots, "default")
    ], 2));
  }
}), Om = /* @__PURE__ */ L({
  __name: "Separator",
  props: {
    orientation: { default: "horizontal" },
    decorative: { type: Boolean, default: !0 },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Oa), de({ "data-slot": "separator" }, x(a), {
      class: x(oe)(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        o.class
      )
    }), null, 16, ["class"]));
  }
}), NC = /* @__PURE__ */ L({
  __name: "SidebarSeparator",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Om), {
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      class: z(x(oe)("bg-sidebar-border mx-2 w-auto", o.class))
    }, {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), RC = /* @__PURE__ */ L({
  __name: "SidebarTrigger",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { isMobile: a, state: r, toggleSidebar: s } = Lt();
    return (i, d) => (t(), T(ce, {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      class: z(x(oe)("h-7 w-7", o.class)),
      onClick: x(s)
    }, {
      default: O(() => [
        x(a) || x(r) === "collapsed" ? (t(), T(x(dl), { key: 0 })) : (t(), T(x(ul), { key: 1 })),
        d[0] || (d[0] = l("span", { class: "sr-only" }, "Toggle sidebar", -1))
      ]),
      _: 1
    }, 8, ["class", "onClick"]));
  }
}), jm = ln(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-sidebar-ring/50 focus-visible:ring-[3px] active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), UC = /* @__PURE__ */ L({
  __name: "DropdownMenu",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    dir: {},
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), T(x(ja), de({ "data-slot": "dropdown-menu" }, x(s)), {
      default: O((u) => [
        K(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
}), Vm = { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, HC = /* @__PURE__ */ L({
  __name: "DropdownMenuCheckboxItem",
  props: {
    modelValue: { type: [Boolean, String] },
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["select", "update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(Va), de({ "data-slot": "dropdown-menu-checkbox-item" }, x(i), {
      class: x(oe)(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: O(() => [
        l("span", Vm, [
          I(x(En), null, {
            default: O(() => [
              K(d.$slots, "indicator-icon", {}, () => [
                I(x(Fn), { class: "size-4" })
              ])
            ]),
            _: 3
          })
        ]),
        K(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), qC = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "DropdownMenuContent",
  props: {
    forceMount: { type: Boolean },
    loop: { type: Boolean },
    memoDependencies: {},
    side: {},
    sideOffset: { default: 4 },
    sideFlip: { type: Boolean },
    align: {},
    alignOffset: {},
    alignFlip: { type: Boolean },
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    hideShiftedArrow: { type: Boolean },
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(Da), null, {
      default: O(() => [
        I(x(Ta), de({ "data-slot": "dropdown-menu-content" }, { ...d.$attrs, ...x(i) }, {
          class: x(oe)(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--reka-dropdown-menu-content-available-height) min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
            a.class
          )
        }), {
          default: O(() => [
            K(d.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), KC = /* @__PURE__ */ L({
  __name: "DropdownMenuGroup",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Ia), de({ "data-slot": "dropdown-menu-group" }, o), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), GC = /* @__PURE__ */ L({
  __name: "DropdownMenuItem",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean },
    variant: { default: "default" }
  },
  setup(e) {
    const o = e, a = ve(o, "inset", "variant", "class"), r = Oe(a);
    return (s, i) => (t(), T(x(Ea), de({
      "data-slot": "dropdown-menu-item",
      "data-inset": e.inset ? "" : void 0,
      "data-variant": e.variant
    }, x(r), {
      class: x(oe)(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        o.class
      )
    }), {
      default: O(() => [
        K(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-inset", "data-variant", "class"]));
  }
}), WC = /* @__PURE__ */ L({
  __name: "DropdownMenuLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, a = ve(o, "class", "inset"), r = Oe(a);
    return (s, i) => (t(), T(x(Fa), de({
      "data-slot": "dropdown-menu-label",
      "data-inset": e.inset ? "" : void 0
    }, x(r), {
      class: x(oe)("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", o.class)
    }), {
      default: O(() => [
        K(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-inset", "class"]));
  }
}), ZC = /* @__PURE__ */ L({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), T(x(Na), de({ "data-slot": "dropdown-menu-radio-group" }, x(s)), {
      default: O(() => [
        K(i.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Dm = { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, JC = /* @__PURE__ */ L({
  __name: "DropdownMenuRadioItem",
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(Ra), de({ "data-slot": "dropdown-menu-radio-item" }, x(i), {
      class: x(oe)(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: O(() => [
        l("span", Dm, [
          I(x(En), null, {
            default: O(() => [
              K(d.$slots, "indicator-icon", {}, () => [
                I(x(cl), { class: "size-2 fill-current" })
              ])
            ]),
            _: 3
          })
        ]),
        K(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), YC = /* @__PURE__ */ L({
  __name: "DropdownMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Ua), de({ "data-slot": "dropdown-menu-separator" }, x(a), {
      class: x(oe)("bg-border -mx-1 my-1 h-px", o.class)
    }), null, 16, ["class"]));
  }
}), QC = /* @__PURE__ */ L({
  __name: "DropdownMenuShortcut",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("span", {
      "data-slot": "dropdown-menu-shortcut",
      class: z(x(oe)("text-muted-foreground ml-auto text-xs tracking-widest", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), XC = /* @__PURE__ */ L({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), T(x(Ha), de({ "data-slot": "dropdown-menu-sub" }, x(s)), {
      default: O((u) => [
        K(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
}), e6 = /* @__PURE__ */ L({
  __name: "DropdownMenuSubContent",
  props: {
    forceMount: { type: Boolean },
    loop: { type: Boolean },
    memoDependencies: {},
    sideOffset: {},
    sideFlip: { type: Boolean },
    alignOffset: {},
    alignFlip: { type: Boolean },
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    hideShiftedArrow: { type: Boolean },
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(qa), de({ "data-slot": "dropdown-menu-sub-content" }, x(i), {
      class: x(oe)(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        a.class
      )
    }), {
      default: O(() => [
        K(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), t6 = /* @__PURE__ */ L({
  __name: "DropdownMenuSubTrigger",
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, a = ve(o, "class", "inset"), r = Oe(a);
    return (s, i) => (t(), T(x(Ka), de({ "data-slot": "dropdown-menu-sub-trigger" }, x(r), {
      "data-inset": e.inset ? "" : void 0,
      class: x(oe)(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground",
        o.class
      )
    }), {
      default: O(() => [
        K(s.$slots, "default"),
        I(x(Nn), { class: "ml-auto size-4" })
      ]),
      _: 3
    }, 16, ["data-inset", "class"]));
  }
}), n6 = /* @__PURE__ */ L({
  __name: "DropdownMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const a = Oe(e);
    return (r, s) => (t(), T(x(Ga), de({ "data-slot": "dropdown-menu-trigger" }, x(a)), {
      default: O(() => [
        K(r.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), a6 = /* @__PURE__ */ L({
  __name: "Avatar",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Wa), {
      "data-slot": "avatar",
      class: z(x(oe)("relative flex size-8 shrink-0 overflow-hidden rounded-full", o.class))
    }, {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), l6 = /* @__PURE__ */ L({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Za), de({ "data-slot": "avatar-fallback" }, x(a), {
      class: x(oe)("bg-muted flex size-full items-center justify-center rounded-full", o.class)
    }), {
      default: O(() => [
        K(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), o6 = /* @__PURE__ */ L({
  __name: "AvatarImage",
  props: {
    src: {},
    referrerPolicy: {},
    crossOrigin: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Ja), de({ "data-slot": "avatar-image" }, o, { class: "aspect-square size-full" }), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), s6 = /* @__PURE__ */ L({
  __name: "Breadcrumb",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("nav", {
      "aria-label": "breadcrumb",
      "data-slot": "breadcrumb",
      class: z(o.class)
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), r6 = /* @__PURE__ */ L({
  __name: "BreadcrumbEllipsis",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("span", {
      "data-slot": "breadcrumb-ellipsis",
      role: "presentation",
      "aria-hidden": "true",
      class: z(x(oe)("flex size-9 items-center justify-center", o.class))
    }, [
      K(a.$slots, "default", {}, () => [
        I(x(fl), { class: "size-4" })
      ]),
      r[0] || (r[0] = l("span", { class: "sr-only" }, "More", -1))
    ], 2));
  }
}), i6 = /* @__PURE__ */ L({
  __name: "BreadcrumbItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "breadcrumb-item",
      class: z(x(oe)("inline-flex items-center gap-1.5", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), d6 = /* @__PURE__ */ L({
  __name: "BreadcrumbLink",
  props: {
    asChild: { type: Boolean },
    as: { default: "a" },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(nt), {
      "data-slot": "breadcrumb-link",
      as: e.as,
      "as-child": e.asChild,
      class: z(x(oe)("hover:text-foreground transition-colors", o.class))
    }, {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), u6 = /* @__PURE__ */ L({
  __name: "BreadcrumbList",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("ol", {
      "data-slot": "breadcrumb-list",
      class: z(
        x(oe)(
          "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
          o.class
        )
      )
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), c6 = /* @__PURE__ */ L({
  __name: "BreadcrumbPage",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("span", {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      class: z(x(oe)("text-foreground font-normal", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), f6 = /* @__PURE__ */ L({
  __name: "BreadcrumbSeparator",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      class: z(x(oe)("[&>svg]:size-3.5", o.class))
    }, [
      K(a.$slots, "default", {}, () => [
        I(x(Nn))
      ])
    ], 2));
  }
}), Tm = { class: "absolute top-full left-0 isolate z-50 flex justify-center" }, Im = /* @__PURE__ */ L({
  __name: "NavigationMenuViewport",
  props: {
    forceMount: { type: Boolean },
    align: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), n("div", Tm, [
      I(x(Ya), de({ "data-slot": "navigation-menu-viewport" }, x(r), {
        class: x(oe)(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--reka-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--reka-navigation-menu-viewport-width)] left-[var(--reka-navigation-menu-viewport-left)]",
          o.class
        )
      }), null, 16, ["class"])
    ]));
  }
}), m6 = /* @__PURE__ */ L({
  __name: "NavigationMenu",
  props: {
    modelValue: {},
    defaultValue: {},
    dir: {},
    orientation: {},
    delayDuration: {},
    skipDelayDuration: {},
    disableClickTrigger: { type: Boolean },
    disableHoverTrigger: { type: Boolean },
    disablePointerLeaveClose: { type: Boolean },
    unmountOnHide: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    viewport: { type: Boolean, default: !0 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class", "viewport"), i = ye(s, r);
    return (d, u) => (t(), T(x(Qa), de({
      "data-slot": "navigation-menu",
      "data-viewport": e.viewport
    }, x(i), {
      class: x(oe)(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        a.class
      )
    }), {
      default: O((c) => [
        K(d.$slots, "default", Le(Re(c))),
        e.viewport ? (t(), T(Im, { key: 0 })) : b("", !0)
      ]),
      _: 3
    }, 16, ["data-viewport", "class"]));
  }
}), p6 = /* @__PURE__ */ L({
  __name: "NavigationMenuContent",
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(Xa), de({ "data-slot": "navigation-menu-content" }, x(i), {
      class: x(oe)(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        a.class
      )
    }), {
      default: O(() => [
        K(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), v6 = /* @__PURE__ */ L({
  __name: "NavigationMenuIndicator",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), T(x(el), de({ "data-slot": "navigation-menu-indicator" }, x(r), {
      class: x(oe)(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        o.class
      )
    }), {
      default: O(() => [...i[0] || (i[0] = [
        l("div", { class: "bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" }, null, -1)
      ])]),
      _: 1
    }, 16, ["class"]));
  }
}), g6 = /* @__PURE__ */ L({
  __name: "NavigationMenuItem",
  props: {
    value: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(tl), de({ "data-slot": "navigation-menu-item" }, x(a), {
      class: x(oe)("relative", o.class)
    }), {
      default: O(() => [
        K(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), h6 = /* @__PURE__ */ L({
  __name: "NavigationMenuLink",
  props: {
    active: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(nl), de({ "data-slot": "navigation-menu-link" }, x(i), {
      class: x(oe)(
        "data-active:focus:bg-accent data-active:hover:bg-accent data-active:bg-accent/50 data-active:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: O(() => [
        K(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), b6 = /* @__PURE__ */ L({
  __name: "NavigationMenuList",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), T(x(al), de({ "data-slot": "navigation-menu-list" }, x(r), {
      class: x(oe)("group flex flex-1 list-none items-center justify-center gap-1", o.class)
    }), {
      default: O(() => [
        K(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), y6 = /* @__PURE__ */ L({
  __name: "NavigationMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), T(x(ll), de({ "data-slot": "navigation-menu-trigger" }, x(r), {
      class: x(oe)(x(Em)(), "group", o.class)
    }), {
      default: O(() => [
        K(s.$slots, "default"),
        I(x(ml), {
          class: "relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Em = ln(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
), x6 = /* @__PURE__ */ L({
  __name: "Dialog",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean },
    unmountOnHide: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), T(x(jn), de({ "data-slot": "dialog" }, x(s)), {
      default: O((u) => [
        K(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
}), k6 = /* @__PURE__ */ L({
  __name: "DialogClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(tt), de({ "data-slot": "dialog-close" }, o), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Fm = /* @__PURE__ */ L({
  __name: "DialogOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Xt), de({ "data-slot": "dialog-overlay" }, x(a), {
      class: x(oe)(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        o.class
      )
    }), {
      default: O(() => [
        K(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), $6 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "DialogContent",
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    showCloseButton: { type: Boolean, default: !0 }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(en), null, {
      default: O(() => [
        I(Fm),
        I(x(tn), de({ "data-slot": "dialog-content" }, { ...d.$attrs, ...x(i) }, {
          class: x(oe)(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            a.class
          )
        }), {
          default: O(() => [
            K(d.$slots, "default"),
            e.showCloseButton ? (t(), T(x(tt), {
              key: 0,
              "data-slot": "dialog-close",
              class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            }, {
              default: O(() => [
                I(x(nn)),
                u[0] || (u[0] = l("span", { class: "sr-only" }, "Close", -1))
              ]),
              _: 1
            })) : b("", !0)
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), w6 = /* @__PURE__ */ L({
  __name: "DialogDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), T(x(Vn), de({ "data-slot": "dialog-description" }, x(r), {
      class: x(oe)("text-sm text-muted-foreground font-normal", o.class)
    }), {
      default: O(() => [
        K(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), C6 = /* @__PURE__ */ L({
  __name: "DialogFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    showCloseButton: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "dialog-footer",
      class: z(x(oe)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", o.class))
    }, [
      K(a.$slots, "default"),
      e.showCloseButton ? (t(), T(x(tt), {
        key: 0,
        "as-child": ""
      }, {
        default: O(() => [
          I(ce, { variant: "outline" }, {
            default: O(() => [...r[0] || (r[0] = [
              U(" Close ", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : b("", !0)
    ], 2));
  }
}), S6 = /* @__PURE__ */ L({
  __name: "DialogHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "dialog-header",
      class: z(x(oe)("flex flex-col gap-2 text-center sm:text-left", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), M6 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "DialogScrollContent",
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ve(a, "class"), i = ye(s, r);
    return (d, u) => (t(), T(x(en), null, {
      default: O(() => [
        I(x(Xt), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
          default: O(() => [
            I(x(tn), de({
              class: x(oe)(
                "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                a.class
              )
            }, { ...d.$attrs, ...x(i) }, {
              onPointerDownOutside: u[0] || (u[0] = (c) => {
                const v = c.detail.originalEvent, m = v.target;
                (v.offsetX > m.clientWidth || v.offsetY > m.clientHeight) && c.preventDefault();
              })
            }), {
              default: O(() => [
                K(d.$slots, "default"),
                I(x(tt), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                  default: O(() => [
                    I(x(nn), { class: "w-4 h-4" }),
                    u[1] || (u[1] = l("span", { class: "sr-only" }, "Close", -1))
                  ]),
                  _: 1
                })
              ]),
              _: 3
            }, 16, ["class"])
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), B6 = /* @__PURE__ */ L({
  __name: "DialogTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), T(x(Dn), de({ "data-slot": "dialog-title" }, x(r), {
      class: x(oe)("text-lg leading-none font-semibold", o.class)
    }), {
      default: O(() => [
        K(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), A6 = /* @__PURE__ */ L({
  __name: "DialogTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Tn), de({ "data-slot": "dialog-trigger" }, o), {
      default: O(() => [
        K(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), z6 = /* @__PURE__ */ L({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(ol), de({ "data-slot": "label" }, x(a), {
      class: x(oe)(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        o.class
      )
    }), {
      default: O(() => [
        K(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), _6 = /* @__PURE__ */ L({
  __name: "Spinner",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(pl), {
      role: "status",
      "aria-label": "Loading",
      class: z(x(oe)("size-4 animate-spin", o.class))
    }, null, 8, ["class"]));
  }
}), P6 = /* @__PURE__ */ L({
  __name: "Card",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card",
      class: z(
        x(oe)(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
          o.class
        )
      )
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), L6 = /* @__PURE__ */ L({
  __name: "CardAction",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-action",
      class: z(x(oe)("col-start-2 row-span-2 row-start-1 self-start justify-self-end", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), O6 = /* @__PURE__ */ L({
  __name: "CardContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-content",
      class: z(x(oe)("px-6", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), j6 = /* @__PURE__ */ L({
  __name: "CardDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("p", {
      "data-slot": "card-description",
      class: z(x(oe)("text-sm text-muted-foreground font-normal", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), V6 = /* @__PURE__ */ L({
  __name: "CardFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-footer",
      class: z(x(oe)("flex items-center px-6 [.border-t]:pt-6", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), D6 = /* @__PURE__ */ L({
  __name: "CardHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-header",
      class: z(
        x(oe)(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
          o.class
        )
      )
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), T6 = /* @__PURE__ */ L({
  __name: "CardTitle",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("h3", {
      "data-slot": "card-title",
      class: z(x(oe)("leading-none font-semibold", o.class))
    }, [
      K(a.$slots, "default")
    ], 2));
  }
}), Nm = {
  key: 0,
  class: "border-destructive/30 bg-destructive/5 rounded-lg border border-dashed p-4"
}, Rm = { class: "flex items-start gap-3" }, Um = { class: "min-w-0 flex-1" }, Hm = { class: "text-foreground text-sm font-medium" }, qm = {
  key: 0,
  class: "text-muted-foreground mt-0.5 truncate text-xs"
}, I6 = /* @__PURE__ */ L({
  __name: "PkBoundary",
  props: {
    label: { default: "This section" },
    silent: { type: Boolean, default: !1 },
    fill: { type: Boolean, default: !1 }
  },
  emits: ["error"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = q(!1), d = q(null), u = q(0);
    ya((v) => (console.error(`[PkBoundary] ${r.label} failed to render`, v), i.value = !0, d.value = v instanceof Error ? v.message : null, s("error", v), !1));
    function c() {
      i.value = !1, d.value = null, u.value++;
    }
    return o({ retry: c }), (v, m) => (t(), n("div", {
      class: z(e.fill ? "h-full [&>*:only-child]:h-full" : void 0)
    }, [
      i.value && !e.silent ? (t(), n("div", Nm, [
        l("div", Rm, [
          m[1] || (m[1] = l("svg", {
            class: "text-destructive mt-0.5 size-4 shrink-0",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" })
          ], -1)),
          l("div", Um, [
            l("p", Hm, f(e.label) + " could not be displayed ", 1),
            d.value ? (t(), n("p", qm, f(d.value), 1)) : b("", !0),
            l("button", {
              type: "button",
              class: "text-foreground hover:bg-accent mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
              onClick: c
            }, [...m[0] || (m[0] = [
              l("svg", {
                class: "size-3",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [
                l("path", { d: "M21 2v6h-6M3.5 9a9 9 0 0 1 14.9-3.4L21 8" })
              ], -1),
              U(" Try again ", -1)
            ])])
          ])
        ])
      ])) : i.value ? b("", !0) : K(v.$slots, "default", { key: u.value })
    ], 2));
  }
}), Km = { class: "pk-surface rounded-lg" }, Gm = {
  key: 0,
  class: "flex items-start justify-between gap-4 border-b px-4 py-3"
}, Wm = { class: "min-w-0" }, Zm = {
  key: 0,
  class: "truncate text-sm font-medium"
}, Jm = {
  key: 1,
  class: "text-muted-foreground mt-0.5 text-sm"
}, Ym = {
  key: 0,
  class: "flex shrink-0 items-center gap-2"
}, Qm = {
  key: 1,
  class: "flex items-center gap-2 border-t px-4 py-3"
}, E6 = /* @__PURE__ */ L({
  __name: "PkCard",
  props: {
    title: {},
    description: {},
    padded: { type: Boolean, default: !0 }
  },
  setup(e) {
    return (o, a) => (t(), n("section", Km, [
      e.title || e.description || o.$slots.header || o.$slots.actions ? (t(), n("header", Gm, [
        l("div", Wm, [
          K(o.$slots, "header", {}, () => [
            e.title ? (t(), n("h2", Zm, f(e.title), 1)) : b("", !0),
            e.description ? (t(), n("p", Jm, f(e.description), 1)) : b("", !0)
          ])
        ]),
        o.$slots.actions ? (t(), n("div", Ym, [
          K(o.$slots, "actions")
        ])) : b("", !0)
      ])) : b("", !0),
      l("div", {
        class: z(e.padded ? "p-4" : "")
      }, [
        K(o.$slots, "default")
      ], 2),
      o.$slots.footer ? (t(), n("footer", Qm, [
        K(o.$slots, "footer")
      ])) : b("", !0)
    ]));
  }
}), oa = /* @__PURE__ */ Symbol("pkPageFooterFromShell");
function F6() {
  const e = an(), o = y(() => e.props.panel?.pageFooter === !0);
  return Nt(oa, o), o;
}
const Xm = {
  key: 0,
  "data-slot": "app-footer",
  class: "mt-auto shrink-0 border-t bg-background px-4 py-3 text-sm text-muted-foreground sm:px-6"
}, ep = { class: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" }, tp = {
  key: 0,
  class: "flex flex-wrap gap-x-4 gap-y-1",
  "aria-label": "Footer"
}, N6 = /* @__PURE__ */ L({
  __name: "AppPageFooter",
  props: {
    host: { type: Boolean }
  },
  setup(e) {
    const o = e, a = an(), r = (/* @__PURE__ */ new Date()).getFullYear(), s = y(() => a.props.panel?.brand || a.props.panelBrand || a.props.name || "Panel"), i = y(() => {
      const c = a.props.panel;
      return Array.isArray(c?.footerLinks) ? c.footerLinks : [];
    }), d = wt(
      oa,
      y(() => !1)
    ), u = y(() => !o.host && x(d) === !0);
    return (c, v) => u.value ? b("", !0) : (t(), n("footer", Xm, [
      l("div", ep, [
        l("p", null, "© " + f(x(r)) + " " + f(s.value), 1),
        i.value.length ? (t(), n("nav", tp, [
          (t(!0), n(_, null, j(i.value, (m) => (t(), T(x(Rt), {
            key: m.href,
            href: m.href,
            class: "hover:text-foreground"
          }, {
            default: O(() => [
              U(f(m.label), 1)
            ]),
            _: 2
          }, 1032, ["href"]))), 128))
        ])) : b("", !0)
      ])
    ]));
  }
}), np = { class: "flex shrink-0 flex-col items-center" }, ap = {
  key: 0,
  class: "absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-800 dark:bg-neutral-700",
  "aria-hidden": "true"
}, R6 = /* @__PURE__ */ L({
  __name: "PkDeviceFrame",
  props: {
    width: { default: 390 },
    height: { default: 844 },
    notch: { type: Boolean, default: !0 },
    kind: { default: "phone" }
  },
  setup(e) {
    const o = e, a = y(() => o.kind === "laptop"), r = y(
      () => a.value ? "rounded-lg border-[6px] border-neutral-800 bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-700" : "rounded-[2.5rem] border-[10px] border-neutral-800 bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-700"
    ), s = y(() => a.value ? "rounded-sm" : "rounded-[2rem]");
    return (i, d) => (t(), n("div", np, [
      l("div", {
        class: z(["relative box-content shadow-2xl", r.value]),
        style: ie({ width: `${e.width}px`, height: `${e.height}px` })
      }, [
        e.notch && !a.value ? (t(), n("div", ap)) : b("", !0),
        l("div", {
          class: z(["size-full overflow-hidden bg-white", s.value])
        }, [
          K(i.$slots, "default")
        ], 2)
      ], 6),
      a.value ? (t(), n(_, { key: 0 }, [
        l("div", {
          class: "h-3 rounded-b-xl bg-neutral-700 dark:bg-neutral-600",
          style: ie({ width: `${e.width + 60}px` }),
          "aria-hidden": "true"
        }, null, 4),
        l("div", {
          class: "h-1 rounded-b-full bg-neutral-500/60 dark:bg-neutral-400/50",
          style: ie({ width: `${Math.round(e.width / 6)}px` }),
          "aria-hidden": "true"
        }, null, 4)
      ], 64)) : b("", !0)
    ]));
  }
}), lp = { class: "flex flex-col gap-6 text-center sm:text-left" }, op = { class: "text-foreground text-xl font-semibold" }, sp = {
  key: 0,
  class: "flex flex-col gap-2"
}, rp = { class: "text-foreground font-medium" }, ip = {
  key: 0,
  class: "text-muted-foreground"
}, dp = {
  key: 1,
  class: "flex flex-col gap-2"
}, up = { class: "flex flex-col gap-1" }, cp = {
  key: 2,
  class: "flex flex-wrap justify-center gap-2 sm:justify-start"
}, U6 = /* @__PURE__ */ L({
  __name: "PkSetupWizardCompletion",
  props: {
    heading: {},
    summary: { default: () => [] },
    nextSteps: { default: () => [] },
    actions: { default: () => [] },
    linkComponent: { default: "a" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", lp, [
      l("h1", op, f(e.heading), 1),
      e.summary.length ? (t(), n("ul", sp, [
        (t(!0), n(_, null, j(e.summary, (r, s) => (t(), n("li", {
          key: s,
          class: "flex items-baseline gap-2 text-sm"
        }, [
          l("span", rp, f(r.label), 1),
          r.detail ? (t(), n("span", ip, "– " + f(r.detail), 1)) : b("", !0)
        ]))), 128))
      ])) : b("", !0),
      e.nextSteps.length ? (t(), n("div", dp, [
        a[0] || (a[0] = l("p", { class: "text-foreground text-sm font-medium" }, "Next steps", -1)),
        l("ul", up, [
          (t(!0), n(_, null, j(e.nextSteps, (r, s) => (t(), n("li", { key: s }, [
            (t(), T(Ce(e.linkComponent), {
              href: r.href,
              class: "text-primary text-sm hover:underline"
            }, {
              default: O(() => [
                U(f(r.label), 1)
              ]),
              _: 2
            }, 1032, ["href"]))
          ]))), 128))
        ])
      ])) : b("", !0),
      e.actions.length ? (t(), n("div", cp, [
        (t(!0), n(_, null, j(e.actions, (r, s) => (t(), T(Ce(e.linkComponent), {
          key: s,
          href: r.href,
          class: z(x(Ye)({ variant: r.primary ? "default" : "outline" }))
        }, {
          default: O(() => [
            U(f(r.label), 1)
          ]),
          _: 2
        }, 1032, ["href", "class"]))), 128))
      ])) : b("", !0)
    ]));
  }
}), fp = {
  key: 0,
  class: "flex justify-end"
}, mp = {
  key: 1,
  class: "flex flex-col gap-2"
}, pp = ["onDrop"], vp = ["aria-label", "onDragstart"], gp = ["onClick"], hp = { class: "font-medium" }, bp = {
  key: 0,
  class: "text-muted-foreground ml-2 truncate"
}, yp = {
  key: 2,
  class: "min-w-0 flex-1"
}, xp = {
  key: 1,
  class: "grid grid-cols-1 gap-3 sm:grid-cols-2"
}, kp = ["aria-label", "onClick"], $p = ["disabled", "aria-label", "onClick"], wp = ["disabled", "aria-label", "onClick"], Cp = ["disabled", "title", "aria-label", "onClick"], Sp = ["disabled", "title", "aria-label", "onClick"], Mp = {
  key: 0,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, Bp = ["disabled"], Ap = {
  key: 2,
  class: "flex flex-col gap-2"
}, zp = {
  key: 0,
  class: "overflow-x-auto rounded-md border"
}, _p = { class: "w-full text-sm" }, Pp = { class: "bg-muted/40" }, Lp = {
  key: 0,
  class: "w-8 border-b px-2 py-1.5"
}, Op = {
  key: 0,
  class: "text-destructive",
  "aria-hidden": "true"
}, jp = ["onDrop"], Vp = {
  key: 0,
  class: "px-2 py-1.5 align-top"
}, Dp = ["aria-label", "onDragstart"], Tp = { class: "px-2 py-1.5 align-top" }, Ip = { class: "mt-0.5 flex items-center gap-0.5" }, Ep = ["disabled", "aria-label", "onClick"], Fp = ["disabled", "aria-label", "onClick"], Np = ["disabled", "title", "aria-label", "onClick"], Rp = ["disabled", "title", "aria-label", "onClick"], Up = {
  key: 1,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, Hp = ["disabled"], H6 = /* @__PURE__ */ L({
  __name: "PkRepeater",
  props: {
    modelValue: {},
    children: {},
    itemLabel: { default: "Item" },
    minItems: { default: null },
    maxItems: { default: null },
    collapsible: { type: Boolean, default: !1 },
    addable: { type: Boolean, default: !0 },
    deletable: { type: Boolean, default: !0 },
    cloneable: { type: Boolean, default: !1 },
    table: { type: Boolean, default: !1 },
    relationship: { default: null },
    disabled: { type: Boolean, default: !1 },
    errors: { default: () => ({}) },
    fieldKey: {},
    childOptions: { default: () => ({}) }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    let s = 0;
    const i = q(d(a.modelValue));
    function d(H) {
      return Array.isArray(H) ? H.map((N) => ({ uid: s++, data: { ...N } })) : [];
    }
    pe(
      () => a.modelValue,
      (H) => {
        JSON.stringify(H ?? null) !== JSON.stringify(u()) && (i.value = d(H));
      }
    );
    function u() {
      const H = [];
      for (const N of i.value) {
        const R = {};
        let X = !1;
        a.relationship && N.data._id !== void 0 && (R._id = N.data._id);
        for (const P of a.children) {
          const J = N.data[P.key] ?? null;
          R[P.key] = J, J !== null && J !== "" && !(Array.isArray(J) && J.length === 0) && (X = !0);
        }
        X && H.push(R);
      }
      return H.length ? H : null;
    }
    function c() {
      r("update:modelValue", u());
    }
    const v = y(() => a.maxItems !== null && i.value.length >= a.maxItems), m = y(() => a.minItems !== null && i.value.length <= a.minItems), h = y(() => a.children.length === 1);
    function w() {
      if (v.value || a.disabled || !a.addable)
        return;
      const H = {};
      for (const N of a.children)
        H[N.key] = null;
      i.value.push({ uid: s++, data: H });
    }
    function k(H) {
      i.value = i.value.filter((N) => N.uid !== H), c();
    }
    function S(H) {
      if (v.value || a.disabled || !a.cloneable)
        return;
      const N = i.value.findIndex((J) => J.uid === H);
      if (N < 0)
        return;
      const R = i.value[N], X = {};
      for (const J of a.children) {
        const V = R.data[J.key];
        X[J.key] = Array.isArray(V) ? [...V] : V;
      }
      const P = [...i.value];
      P.splice(N + 1, 0, { uid: s++, data: X }), i.value = P, c();
    }
    function C(H, N) {
      const R = H + N;
      if (R < 0 || R >= i.value.length)
        return;
      const X = [...i.value], [P] = X.splice(H, 1);
      X.splice(R, 0, P), i.value = X, c();
    }
    function B(H, N, R) {
      const X = i.value.find((P) => P.uid === H);
      X && (X.data[N] = R, c());
    }
    function A(H, N) {
      return a.errors[`${a.fieldKey}.${H}.${N}`];
    }
    const $ = q(/* @__PURE__ */ new Set());
    function p(H) {
      return a.collapsible && $.value.has(H);
    }
    function g(H) {
      const N = new Set($.value);
      N.has(H) ? N.delete(H) : N.add(H), $.value = N;
    }
    const M = y(
      () => i.value.length > 0 && i.value.every((H) => $.value.has(H.uid))
    );
    function F() {
      $.value = M.value ? /* @__PURE__ */ new Set() : new Set(i.value.map((H) => H.uid));
    }
    function D(H) {
      const N = a.children[0];
      if (!N)
        return "";
      const R = H.data[N.key];
      if (typeof R != "string" && typeof R != "number")
        return "";
      const X = String(R).trim();
      return X === "" || X.length > 60 ? "" : X;
    }
    const Y = q(null);
    function G(H, N) {
      if (a.disabled) {
        N.preventDefault();
        return;
      }
      Y.value = H, N.dataTransfer?.setData("text/plain", String(H)), N.dataTransfer && (N.dataTransfer.effectAllowed = "move");
    }
    function Z() {
      Y.value = null;
    }
    function W(H, N) {
      N.preventDefault();
      const R = Y.value;
      if (Y.value = null, a.disabled || R === null || R === H)
        return;
      const X = [...i.value], P = X.findIndex((E) => E.uid === R), J = X.findIndex((E) => E.uid === H);
      if (P < 0 || J < 0)
        return;
      const [V] = X.splice(P, 1);
      X.splice(J, 0, V), i.value = X, c();
    }
    return (H, N) => (t(), n(_, null, [
      !e.table && e.collapsible && i.value.length > 1 ? (t(), n("div", fp, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-xs font-medium",
          onClick: F
        }, f(M.value ? "Expand all" : "Collapse all"), 1)
      ])) : b("", !0),
      e.table ? (t(), n("div", Ap, [
        i.value.length ? (t(), n("div", zp, [
          l("table", _p, [
            l("thead", null, [
              l("tr", Pp, [
                e.disabled ? b("", !0) : (t(), n("th", Lp, [...N[9] || (N[9] = [
                  l("span", { class: "sr-only" }, "Reorder", -1)
                ])])),
                (t(!0), n(_, null, j(e.children, (R) => (t(), n("th", {
                  key: R.key,
                  class: "text-muted-foreground border-b px-2 py-1.5 text-left text-xs font-medium"
                }, [
                  U(f(R.label) + " ", 1),
                  R.required ? (t(), n("span", Op, "*")) : b("", !0)
                ]))), 128)),
                N[10] || (N[10] = l("th", { class: "border-b px-2 py-1.5" }, [
                  l("span", { class: "sr-only" }, "Row actions")
                ], -1))
              ])
            ]),
            l("tbody", null, [
              (t(!0), n(_, null, j(i.value, (R, X) => (t(), n("tr", {
                key: R.uid,
                class: z(["border-b last:border-b-0", Y.value === R.uid ? "opacity-40" : ""]),
                onDragover: N[1] || (N[1] = he(() => {
                }, ["prevent"])),
                onDrop: (P) => W(R.uid, P)
              }, [
                e.disabled ? b("", !0) : (t(), n("td", Vp, [
                  l("button", {
                    type: "button",
                    class: "text-muted-foreground/60 hover:text-muted-foreground mt-0.5 flex size-6 cursor-grab items-center justify-center active:cursor-grabbing",
                    draggable: "true",
                    "aria-label": `Drag to reorder ${e.itemLabel} ${X + 1}`,
                    onDragstart: (P) => G(R.uid, P),
                    onDragend: Z
                  }, [...N[11] || (N[11] = [
                    ut('<svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.4"></circle><circle cx="15" cy="6" r="1.4"></circle><circle cx="9" cy="12" r="1.4"></circle><circle cx="15" cy="12" r="1.4"></circle><circle cx="9" cy="18" r="1.4"></circle><circle cx="15" cy="18" r="1.4"></circle></svg>', 1)
                  ])], 40, Dp)
                ])),
                (t(!0), n(_, null, j(e.children, (P) => (t(), n("td", {
                  key: P.key,
                  class: "min-w-[8rem] px-2 py-1.5 align-top"
                }, [
                  I(We, {
                    field: {
                      ...P,
                      disabled: P.disabled || e.disabled,
                      labelHidden: !0
                    },
                    value: R.data[P.key],
                    error: A(X, P.key),
                    options: e.childOptions[P.key] ?? [],
                    onChange: (J) => B(R.uid, P.key, J)
                  }, null, 8, ["field", "value", "error", "options", "onChange"])
                ]))), 128)),
                l("td", Tp, [
                  l("div", Ip, [
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || X === 0,
                      "aria-label": `Move ${e.itemLabel} ${X + 1} up`,
                      onClick: (P) => C(X, -1)
                    }, [...N[12] || (N[12] = [
                      l("svg", {
                        class: "size-3.5",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-hidden": "true"
                      }, [
                        l("path", { d: "m18 15-6-6-6 6" })
                      ], -1)
                    ])], 8, Ep),
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || X === i.value.length - 1,
                      "aria-label": `Move ${e.itemLabel} ${X + 1} down`,
                      onClick: (P) => C(X, 1)
                    }, [...N[13] || (N[13] = [
                      l("svg", {
                        class: "size-3.5",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-hidden": "true"
                      }, [
                        l("path", { d: "m6 9 6 6 6-6" })
                      ], -1)
                    ])], 8, Fp),
                    e.cloneable ? (t(), n("button", {
                      key: 0,
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || v.value,
                      title: v.value ? `At most ${e.maxItems} allowed` : void 0,
                      "aria-label": `Duplicate ${e.itemLabel} ${X + 1}`,
                      onClick: (P) => S(R.uid)
                    }, [...N[14] || (N[14] = [
                      l("svg", {
                        class: "size-3.5",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-hidden": "true"
                      }, [
                        l("rect", {
                          x: "8",
                          y: "8",
                          width: "12",
                          height: "12",
                          rx: "2"
                        }),
                        l("path", { d: "M4 16V6a2 2 0 0 1 2-2h10" })
                      ], -1)
                    ])], 8, Np)) : b("", !0),
                    e.deletable ? (t(), n("button", {
                      key: 1,
                      type: "button",
                      class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || m.value,
                      title: m.value ? `At least ${e.minItems} required` : void 0,
                      "aria-label": `Remove ${e.itemLabel} ${X + 1}`,
                      onClick: (P) => k(R.uid)
                    }, [...N[15] || (N[15] = [
                      l("svg", {
                        class: "size-3.5",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "aria-hidden": "true"
                      }, [
                        l("path", { d: "M18 6 6 18M6 6l12 12" })
                      ], -1)
                    ])], 8, Rp)) : b("", !0)
                  ])
                ])
              ], 42, jp))), 128))
            ])
          ])
        ])) : (t(), n("p", Up, " No " + f(e.itemLabel.toLowerCase()) + "s yet. ", 1)),
        !v.value && e.addable ? (t(), n("button", {
          key: 2,
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled,
          onClick: w
        }, [
          N[16] || (N[16] = l("svg", {
            class: "size-3.5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "M12 5v14M5 12h14" })
          ], -1)),
          U(" Add " + f(e.itemLabel.toLowerCase()), 1)
        ], 8, Hp)) : b("", !0)
      ])) : (t(), n("div", mp, [
        (t(!0), n(_, null, j(i.value, (R, X) => (t(), n("div", {
          key: R.uid,
          class: z(["flex items-start gap-2", Y.value === R.uid ? "opacity-40" : ""]),
          onDragover: N[0] || (N[0] = he(() => {
          }, ["prevent"])),
          onDrop: (P) => W(R.uid, P)
        }, [
          e.disabled ? b("", !0) : (t(), n("button", {
            key: 0,
            type: "button",
            class: z(["text-muted-foreground/60 hover:text-muted-foreground flex size-6 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing", h.value ? "mt-1.5" : "mt-0.5"]),
            draggable: "true",
            "aria-label": `Drag to reorder ${e.itemLabel} ${X + 1}`,
            onDragstart: (P) => G(R.uid, P),
            onDragend: Z
          }, [...N[2] || (N[2] = [
            ut('<svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.4"></circle><circle cx="15" cy="6" r="1.4"></circle><circle cx="9" cy="12" r="1.4"></circle><circle cx="15" cy="12" r="1.4"></circle><circle cx="9" cy="18" r="1.4"></circle><circle cx="15" cy="18" r="1.4"></circle></svg>', 1)
          ])], 42, vp)),
          l("span", {
            class: z(["bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums", h.value ? "mt-1.5" : "mt-0.5"]),
            "aria-hidden": "true"
          }, f(X + 1), 3),
          p(R.uid) ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "hover:bg-accent min-w-0 flex-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
            onClick: (P) => g(R.uid)
          }, [
            l("span", hp, f(e.itemLabel) + " " + f(X + 1), 1),
            D(R) ? (t(), n("span", bp, f(D(R)), 1)) : b("", !0)
          ], 8, gp)) : (t(), n("div", yp, [
            h.value ? (t(), T(We, {
              key: 0,
              field: {
                ...e.children[0],
                disabled: e.children[0].disabled || e.disabled,
                labelHidden: !0
              },
              value: R.data[e.children[0].key],
              error: A(X, e.children[0].key),
              options: e.childOptions[e.children[0].key] ?? [],
              onChange: (P) => B(R.uid, e.children[0].key, P)
            }, null, 8, ["field", "value", "error", "options", "onChange"])) : (t(), n("div", xp, [
              (t(!0), n(_, null, j(e.children, (P) => (t(), T(We, {
                key: P.key,
                field: { ...P, disabled: P.disabled || e.disabled },
                value: R.data[P.key],
                error: A(X, P.key),
                options: e.childOptions[P.key] ?? [],
                onChange: (J) => B(R.uid, P.key, J)
              }, null, 8, ["field", "value", "error", "options", "onChange"]))), 128))
            ]))
          ])),
          l("div", {
            class: z(["flex shrink-0 items-center gap-0.5", h.value ? "mt-1" : "mt-0"])
          }, [
            e.collapsible ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors",
              "aria-label": p(R.uid) ? `Expand ${e.itemLabel} ${X + 1}` : `Collapse ${e.itemLabel} ${X + 1}`,
              onClick: (P) => g(R.uid)
            }, [
              (t(), n("svg", {
                class: z(["size-3.5 transition-transform", p(R.uid) ? "" : "rotate-180"]),
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [...N[3] || (N[3] = [
                l("path", { d: "m6 9 6 6 6-6" }, null, -1)
              ])], 2))
            ], 8, kp)) : b("", !0),
            l("button", {
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || X === 0,
              "aria-label": `Move ${e.itemLabel} ${X + 1} up`,
              onClick: (P) => C(X, -1)
            }, [...N[4] || (N[4] = [
              l("svg", {
                class: "size-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [
                l("path", { d: "m18 15-6-6-6 6" })
              ], -1)
            ])], 8, $p),
            l("button", {
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || X === i.value.length - 1,
              "aria-label": `Move ${e.itemLabel} ${X + 1} down`,
              onClick: (P) => C(X, 1)
            }, [...N[5] || (N[5] = [
              l("svg", {
                class: "size-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [
                l("path", { d: "m6 9 6 6 6-6" })
              ], -1)
            ])], 8, wp),
            e.cloneable ? (t(), n("button", {
              key: 1,
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || v.value,
              title: v.value ? `At most ${e.maxItems} allowed` : void 0,
              "aria-label": `Duplicate ${e.itemLabel} ${X + 1}`,
              onClick: (P) => S(R.uid)
            }, [...N[6] || (N[6] = [
              l("svg", {
                class: "size-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [
                l("rect", {
                  x: "8",
                  y: "8",
                  width: "12",
                  height: "12",
                  rx: "2"
                }),
                l("path", { d: "M4 16V6a2 2 0 0 1 2-2h10" })
              ], -1)
            ])], 8, Cp)) : b("", !0),
            e.deletable ? (t(), n("button", {
              key: 2,
              type: "button",
              class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || m.value,
              title: m.value ? `At least ${e.minItems} required` : void 0,
              "aria-label": `Remove ${e.itemLabel} ${X + 1}`,
              onClick: (P) => k(R.uid)
            }, [...N[7] || (N[7] = [
              l("svg", {
                class: "size-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "aria-hidden": "true"
              }, [
                l("path", { d: "M18 6 6 18M6 6l12 12" })
              ], -1)
            ])], 8, Sp)) : b("", !0)
          ], 2)
        ], 42, pp))), 128)),
        i.value.length === 0 ? (t(), n("p", Mp, " No " + f(e.itemLabel.toLowerCase()) + "s yet. ", 1)) : b("", !0),
        !v.value && e.addable ? (t(), n("button", {
          key: 1,
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled,
          onClick: w
        }, [
          N[8] || (N[8] = l("svg", {
            class: "size-3.5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "M12 5v14M5 12h14" })
          ], -1)),
          U(" Add " + f(e.itemLabel.toLowerCase()), 1)
        ], 8, Bp)) : b("", !0)
      ]))
    ], 64));
  }
}), qp = { class: "space-y-1" }, Kp = { class: "flex items-center gap-1" }, Gp = ["disabled", "title", "aria-label", "onClick"], Wp = ["aria-pressed"], Zp = ["id", "value", "rows", "disabled"], Jp = ["innerHTML"], Yp = /* @__PURE__ */ L({
  __name: "PkMarkdownInput",
  props: {
    modelValue: { default: "" },
    rows: { default: 12 },
    toolbar: {},
    disabled: { type: Boolean, default: !1 },
    id: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(!1), i = y(() => a.modelValue ?? "");
    function d(h) {
      return h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    const u = y(
      () => d(i.value).replace(/^### (.*)$/gm, '<h3 class="font-semibold">$1</h3>').replace(/^## (.*)$/gm, '<h2 class="font-semibold text-lg">$1</h2>').replace(/^# (.*)$/gm, '<h1 class="font-semibold text-xl">$1</h1>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*]+?)\*/g, "$1<em>$2</em>").replace(/`([^`]+?)`/g, '<code class="bg-muted rounded px-1">$1</code>').replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" class="underline">$1</a>').replace(/^[-*] (.*)$/gm, '<li class="ml-4 list-disc">$1</li>').replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>")
    );
    function c(h, w = h) {
      const k = document.getElementById(a.id ?? "");
      if (k === null)
        return;
      const S = k.selectionStart, C = k.selectionEnd, B = i.value.slice(S, C);
      r(
        "update:modelValue",
        `${i.value.slice(0, S)}${h}${B}${w}${i.value.slice(C)}`
      );
    }
    const v = {
      bold: { label: "B", run: () => c("**") },
      italic: { label: "I", run: () => c("*") },
      code: { label: "</>", run: () => c("`") },
      heading: { label: "H", run: () => c("## ", "") },
      list: { label: "•", run: () => c("- ", "") },
      link: { label: "🔗", run: () => c("[", "](https://)") }
    }, m = y(
      () => (a.toolbar ?? Object.keys(v)).filter((h) => h in v)
    );
    return (h, w) => (t(), n("div", qp, [
      l("div", Kp, [
        (t(!0), n(_, null, j(m.value, (k) => (t(), n("button", {
          key: k,
          type: "button",
          disabled: e.disabled,
          title: k,
          "aria-label": k,
          class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-50",
          onClick: (S) => v[k].run()
        }, f(v[k].label), 9, Gp))), 128)),
        l("button", {
          type: "button",
          class: "hover:bg-accent ml-auto rounded border px-2 py-0.5 text-xs",
          "aria-pressed": s.value,
          onClick: w[0] || (w[0] = (k) => s.value = !s.value)
        }, " Preview ", 8, Wp)
      ]),
      s.value ? (t(), n("div", {
        key: 1,
        class: "bg-card min-h-32 rounded-md border px-3 py-2 text-sm",
        innerHTML: u.value
      }, null, 8, Jp)) : (t(), n("textarea", {
        key: 0,
        id: e.id,
        value: i.value,
        rows: e.rows,
        disabled: e.disabled,
        class: "bg-card w-full resize-y rounded-md border px-3 py-2 font-mono text-sm outline-none",
        onInput: w[1] || (w[1] = (k) => r("update:modelValue", k.target.value))
      }, null, 40, Zp))
    ]));
  }
}), Qp = { class: "space-y-1" }, Xp = { class: "bg-card flex overflow-hidden rounded-md border font-mono text-xs" }, ev = {
  "aria-hidden": "true",
  class: "text-muted-foreground bg-muted/40 shrink-0 border-r px-2 py-2 text-right leading-5 select-none"
}, tv = ["id", "value", "rows", "disabled"], nv = { class: "text-muted-foreground text-xs font-normal" }, av = {
  key: 0,
  class: "text-destructive text-xs"
}, lv = /* @__PURE__ */ L({
  __name: "PkCodeInput",
  props: {
    modelValue: { default: "" },
    language: { default: "plain" },
    rows: { default: 14 },
    disabled: { type: Boolean, default: !1 },
    id: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = q(!0), d = y(() => a.modelValue ?? ""), u = y(() => Math.max(d.value.split(`
`).length, 1)), c = y(() => {
      if (a.language !== "json" || d.value.trim() === "")
        return null;
      try {
        return JSON.parse(d.value), null;
      } catch (h) {
        return h instanceof Error ? h.message : "Not valid JSON.";
      }
    });
    function v(h) {
      r("update:modelValue", h.target.value);
    }
    function m(h) {
      if (h.key === "Escape") {
        i.value = !1;
        return;
      }
      if (h.key !== "Tab" && (i.value = !0), h.key !== "Tab" || !i.value)
        return;
      h.preventDefault();
      const w = h.target, k = w.selectionStart, S = w.selectionEnd, C = `${d.value.slice(0, k)}    ${d.value.slice(S)}`;
      r("update:modelValue", C), requestAnimationFrame(() => {
        w.selectionStart = w.selectionEnd = k + 4;
      });
    }
    return (h, w) => (t(), n("div", Qp, [
      l("div", Xp, [
        l("div", ev, [
          (t(!0), n(_, null, j(u.value, (k) => (t(), n("div", { key: k }, f(k), 1))), 128))
        ]),
        l("textarea", {
          id: e.id,
          ref_key: "area",
          ref: s,
          value: d.value,
          rows: e.rows,
          disabled: e.disabled,
          spellcheck: "false",
          autocapitalize: "off",
          autocomplete: "off",
          autocorrect: "off",
          class: "w-full resize-y bg-transparent px-3 py-2 leading-5 outline-none",
          onInput: v,
          onKeydown: m
        }, null, 40, tv)
      ]),
      l("p", nv, f(e.language === "plain" ? "Plain text" : e.language.toUpperCase()) + ". Tab indents; press Escape first to move focus out. ", 1),
      c.value ? (t(), n("p", av, f(c.value), 1)) : b("", !0)
    ]));
  }
}), ov = { class: "space-y-3" }, sv = { class: "flex items-center justify-between gap-2 border-b px-3 py-2" }, rv = { class: "text-sm font-medium" }, iv = { class: "flex items-center gap-1" }, dv = ["disabled", "onClick"], uv = ["disabled", "onClick"], cv = ["disabled", "onClick"], fv = { class: "space-y-3 p-3" }, mv = { class: "flex flex-wrap items-center gap-2" }, pv = ["disabled", "onClick"], vv = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, q6 = /* @__PURE__ */ L({
  __name: "PkBuilder",
  props: {
    modelValue: { default: null },
    blocks: { default: () => [] },
    maxBlocks: { default: null },
    disabled: { type: Boolean, default: !1 },
    errors: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.modelValue ?? []), i = y(
      () => Object.fromEntries(a.blocks.map((w) => [w.type, w]))
    ), d = y(() => a.maxBlocks !== null && s.value.length >= a.maxBlocks);
    function u(w) {
      r("update:modelValue", w);
    }
    function c(w) {
      d.value || u([...s.value, { type: w, data: {} }]);
    }
    function v(w) {
      u(s.value.filter((k, S) => S !== w));
    }
    function m(w, k) {
      const S = w + k;
      if (S < 0 || S >= s.value.length)
        return;
      const C = [...s.value], [B] = C.splice(w, 1);
      C.splice(S, 0, B), u(C);
    }
    function h(w, k, S) {
      u(
        s.value.map(
          (C, B) => B === w ? { ...C, data: { ...C.data, [k]: S } } : C
        )
      );
    }
    return (w, k) => (t(), n("div", ov, [
      (t(!0), n(_, null, j(s.value, (S, C) => (t(), n("div", {
        key: `${S.type}-${C}`,
        class: "bg-card rounded-lg border"
      }, [
        l("div", sv, [
          l("span", rv, f(i.value[S.type]?.label ?? S.type), 1),
          l("div", iv, [
            l("button", {
              type: "button",
              class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-40",
              disabled: e.disabled || C === 0,
              "aria-label": "Move up",
              onClick: (B) => m(C, -1)
            }, " ↑ ", 8, dv),
            l("button", {
              type: "button",
              class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-40",
              disabled: e.disabled || C === s.value.length - 1,
              "aria-label": "Move down",
              onClick: (B) => m(C, 1)
            }, " ↓ ", 8, uv),
            l("button", {
              type: "button",
              class: "text-destructive hover:bg-accent rounded border px-2 py-0.5 text-xs",
              disabled: e.disabled,
              "aria-label": "Remove block",
              onClick: (B) => v(C)
            }, " Remove ", 8, cv)
          ])
        ]),
        l("div", fv, [
          (t(!0), n(_, null, j(i.value[S.type]?.fields ?? [], (B) => (t(), T(We, {
            key: B.key,
            field: B,
            value: S.data[B.key] ?? null,
            error: e.errors?.[B.key],
            processing: e.disabled,
            onChange: (A) => h(C, B.key, A)
          }, null, 8, ["field", "value", "error", "processing", "onChange"]))), 128))
        ])
      ]))), 128)),
      l("div", mv, [
        (t(!0), n(_, null, j(e.blocks, (S) => (t(), n("button", {
          key: S.type,
          type: "button",
          class: "hover:bg-accent rounded-md border px-2.5 py-1 text-sm disabled:opacity-50",
          disabled: e.disabled || d.value,
          onClick: (C) => c(S.type)
        }, " + " + f(S.label), 9, pv))), 128)),
        d.value ? (t(), n("span", vv, f(e.maxBlocks) + " is the maximum here. ", 1)) : b("", !0)
      ])
    ]));
  }
}), gv = ["name", "value", "checked", "disabled", "onChange"], hv = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, bv = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkRadioGroup",
  props: {
    field: {},
    modelValue: {},
    options: { default: () => [] },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s(i) {
      return a.modelValue != null && i.value == a.modelValue;
    }
    return (i, d) => (t(), n("div", {
      role: "radiogroup",
      class: z(["flex gap-x-4 gap-y-2", e.field.inline ? "flex-row flex-wrap items-center" : "flex-col"])
    }, [
      (t(!0), n(_, null, j(e.options, (u) => (t(), n("label", {
        key: String(u.value),
        class: z(["flex items-center gap-2 text-sm", e.disabled ? "opacity-50" : "cursor-pointer"])
      }, [
        l("input", {
          type: "radio",
          class: "text-primary focus-visible:ring-ring size-4 shrink-0 border focus-visible:ring-2",
          name: `f-${e.field.key}`,
          value: u.value,
          checked: s(u),
          disabled: e.disabled,
          onChange: (c) => r("update:modelValue", u.value)
        }, null, 40, gv),
        U(" " + f(u.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", hv, " Nothing to choose from yet. ")) : b("", !0)
    ], 2));
  }
}), yv = ["value", "checked", "disabled", "onChange"], xv = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, kv = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkCheckboxList",
  props: {
    field: {},
    modelValue: {},
    options: { default: () => [] },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    );
    function i(c) {
      return s.value.some((v) => v == c.value);
    }
    function d(c) {
      r(
        "update:modelValue",
        i(c) ? s.value.filter((v) => v != c.value) : [...s.value, c.value]
      );
    }
    const u = y(
      () => a.field.columns && a.field.columns > 1 ? { gridTemplateColumns: `repeat(${a.field.columns}, minmax(0, 1fr))` } : void 0
    );
    return (c, v) => (t(), n("div", {
      class: "grid gap-x-4 gap-y-2",
      style: ie(u.value)
    }, [
      (t(!0), n(_, null, j(e.options, (m) => (t(), n("label", {
        key: String(m.value),
        class: z(["flex items-center gap-2 text-sm", e.disabled ? "opacity-50" : "cursor-pointer"])
      }, [
        l("input", {
          type: "checkbox",
          class: "text-primary focus-visible:ring-ring size-4 shrink-0 rounded border focus-visible:ring-2",
          value: m.value,
          checked: i(m),
          disabled: e.disabled,
          onChange: (h) => d(m)
        }, null, 40, yv),
        U(" " + f(m.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", xv, " Nothing to choose from yet. ")) : b("", !0)
    ], 4));
  }
}), $v = { class: "flex flex-col gap-1.5" }, wv = ["aria-label", "onClick"], Cv = ["placeholder", "disabled", "maxlength"], Sv = {
  key: 0,
  class: "flex flex-wrap items-center gap-1.5"
}, Mv = ["onClick"], Bv = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal"
}, Av = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkTagsInput",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(""), i = y(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    ), d = y(() => i.value.length >= (a.field.max ?? 25)), u = y(
      () => (a.field.suggestions ?? []).filter(
        (h) => !i.value.some((w) => w.toLowerCase() === h.toLowerCase())
      )
    );
    function c(h) {
      const w = h.trim().slice(0, a.field.maxLength ?? 40);
      if (w === "" || d.value) {
        s.value = "";
        return;
      }
      if (i.value.some((k) => k.toLowerCase() === w.toLowerCase())) {
        s.value = "";
        return;
      }
      r("update:modelValue", [...i.value, w]), s.value = "";
    }
    function v(h) {
      r(
        "update:modelValue",
        i.value.filter((w, k) => k !== h)
      );
    }
    function m(h) {
      if (h.key === "Enter" || h.key === ",") {
        h.preventDefault(), c(s.value);
        return;
      }
      h.key === "Backspace" && s.value === "" && i.value.length > 0 && v(i.value.length - 1);
    }
    return (h, w) => (t(), n("div", $v, [
      l("div", {
        class: z(["border-input bg-background flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5", e.disabled ? "opacity-50" : ""])
      }, [
        (t(!0), n(_, null, j(i.value, (k, S) => (t(), n("span", {
          key: `${k}-${S}`,
          class: "bg-muted flex items-center gap-1 rounded px-2 py-0.5 text-xs"
        }, [
          U(f(k) + " ", 1),
          e.disabled ? b("", !0) : (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground",
            "aria-label": `Remove ${k}`,
            onClick: (C) => v(S)
          }, " × ", 8, wv))
        ]))), 128)),
        ge(l("input", {
          "onUpdate:modelValue": w[0] || (w[0] = (k) => s.value = k),
          type: "text",
          class: "min-w-24 flex-1 bg-transparent text-sm outline-none",
          placeholder: d.value ? "" : e.field.placeholder ?? "Add a tag…",
          disabled: e.disabled || d.value,
          maxlength: e.field.maxLength ?? 40,
          onKeydown: m,
          onBlur: w[1] || (w[1] = (k) => c(s.value))
        }, null, 40, Cv), [
          [ze, s.value]
        ])
      ], 2),
      u.value.length > 0 && !d.value && !e.disabled ? (t(), n("div", Sv, [
        w[2] || (w[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "Suggestions:", -1)),
        (t(!0), n(_, null, j(u.value, (k) => (t(), n("button", {
          key: k,
          type: "button",
          class: "hover:bg-accent rounded border px-2 py-0.5 text-xs",
          onClick: (S) => c(k)
        }, f(k), 9, Mv))), 128))
      ])) : b("", !0),
      d.value ? (t(), n("p", Bv, " That is the maximum of " + f(e.field.max ?? 25) + " tags. ", 1)) : b("", !0)
    ]));
  }
}), zv = 4.5, An = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function sa(e) {
  let o = e.replace("#", "");
  return o.length === 3 && (o = o[0] + o[0] + o[1] + o[1] + o[2] + o[2]), [parseInt(o.slice(0, 2), 16), parseInt(o.slice(2, 4), 16), parseInt(o.slice(4, 6), 16)];
}
function Tt(e) {
  const o = e / 255;
  return o <= 0.03928 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4;
}
function Jt(e) {
  const [o, a, r] = sa(e);
  return 0.2126 * Tt(o) + 0.7152 * Tt(a) + 0.0722 * Tt(r);
}
function ra(e, o) {
  const a = Jt(e), r = Jt(o);
  return (Math.max(a, r) + 0.05) / (Math.min(a, r) + 0.05);
}
function _v(e, o, a) {
  if (!An.test(e) || !An.test(o))
    return e;
  const r = Jt(o) > 0.5, s = r ? 0 : 255;
  let i = sa(e);
  for (let d = 0; d <= 20; d++) {
    const u = Pv(i);
    if (ra(u, o) >= a)
      return u;
    i = i.map((c) => c + (s - c) * 0.15);
  }
  return r ? "#000000" : "#ffffff";
}
function Pv(e) {
  return "#" + e.map(
    (o) => Math.round(Math.max(0, Math.min(255, o))).toString(16).padStart(2, "0")
  ).join("");
}
const Lv = { class: "flex flex-col gap-2" }, Ov = { class: "flex items-center gap-2" }, jv = {
  key: 0,
  class: "border-input size-9 shrink-0 rounded-md border",
  style: { "background-image": `linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%)`, "background-size": "8px 8px", "background-position": `0 0,
                        0 4px,
                        4px -4px,
                        -4px 0` },
  "aria-hidden": "true"
}, Vv = ["value", "disabled", "aria-label"], Dv = ["value", "disabled", "placeholder"], Tv = {
  key: 0,
  class: "flex flex-wrap gap-1.5"
}, Iv = ["aria-label", "title", "onClick"], Ev = {
  key: 1,
  class: "text-amber-600 dark:text-amber-500 flex flex-wrap items-center gap-2 text-xs"
}, Fv = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkColourPicker",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, i = y(() => typeof a.modelValue == "string" ? a.modelValue : ""), d = y(() => s.test(i.value));
    function u(k) {
      const S = k.trim();
      if (S === "")
        return "";
      const C = S.startsWith("#") ? S : `#${S}`;
      return s.test(C) ? C.toLowerCase() : S;
    }
    function c(k) {
      r("update:modelValue", u(k.target.value));
    }
    const v = y(() => !d.value || !a.field.contrastBackground || !s.test(a.field.contrastBackground) ? null : ra(i.value, a.field.contrastBackground)), m = y(() => a.field.contrastMinRatio ?? zv), h = y(() => v.value !== null && v.value < m.value);
    function w() {
      a.field.contrastBackground && r(
        "update:modelValue",
        _v(i.value, a.field.contrastBackground, m.value)
      );
    }
    return (k, S) => (t(), n("div", Lv, [
      l("div", Ov, [
        d.value ? (t(), n("input", {
          key: 1,
          type: "color",
          class: "border-input size-9 shrink-0 cursor-pointer rounded-md border bg-transparent",
          value: i.value,
          disabled: e.disabled,
          "aria-label": `Colour for ${e.field.key}`,
          onInput: S[0] || (S[0] = (C) => r("update:modelValue", C.target.value))
        }, null, 40, Vv)) : (t(), n("span", jv)),
        l("input", {
          type: "text",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
          value: i.value,
          disabled: e.disabled,
          placeholder: e.field.placeholder ?? "#1e90ff",
          spellcheck: "false",
          onInput: c
        }, null, 40, Dv)
      ]),
      (e.field.presets ?? []).length > 0 && !e.disabled ? (t(), n("div", Tv, [
        (t(!0), n(_, null, j(e.field.presets, (C) => (t(), n("button", {
          key: C,
          type: "button",
          class: z(["size-6 rounded border", i.value.toLowerCase() === C.toLowerCase() ? "ring-ring ring-2" : ""]),
          style: ie({ backgroundColor: C }),
          "aria-label": C,
          title: C,
          onClick: (B) => r("update:modelValue", C.toLowerCase())
        }, null, 14, Iv))), 128))
      ])) : b("", !0),
      h.value ? (t(), n("p", Ev, [
        l("span", null, " This fails contrast at " + f(v.value.toFixed(1)) + ":1 - it needs at least " + f(m.value.toFixed(1)) + ":1 to stay readable. ", 1),
        e.disabled ? b("", !0) : (t(), n("button", {
          key: 0,
          type: "button",
          class: "font-medium underline underline-offset-2",
          onClick: w
        }, " Use a readable shade "))
      ])) : b("", !0)
    ]));
  }
}), Nv = ["aria-disabled"], Rv = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkMap",
  props: {
    modelValue: { default: null },
    markers: { default: () => [] },
    center: { default: null },
    zoom: { default: 12 },
    height: { default: 280 },
    latKey: { default: "lat" },
    lngKey: { default: "lng" },
    disabled: { type: Boolean, default: !1 },
    pickable: { type: Boolean, default: !0 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null);
    let i = null, d = null, u = null;
    const c = y(() => {
      const w = a.modelValue?.[a.latKey], k = a.modelValue?.[a.lngKey];
      return typeof w == "number" && typeof k == "number" ? { lat: w, lng: k } : a.center ? a.center : a.markers.length > 0 ? { lat: a.markers[0].lat, lng: a.markers[0].lng } : { lat: 0, lng: 0 };
    });
    async function v() {
      if (!s.value || i)
        return;
      const w = await import("leaflet");
      await import("leaflet/dist/leaflet.css"), u = w, i = w.map(s.value).setView([c.value.lat, c.value.lng], a.zoom), w.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19
      }).addTo(i), m(), h(), a.pickable && !a.disabled && i.on("click", (k) => {
        r("update:modelValue", {
          [a.latKey]: Number(k.latlng.lat.toFixed(6)),
          [a.lngKey]: Number(k.latlng.lng.toFixed(6))
        });
      });
    }
    function m() {
      if (!(!i || !u))
        for (const w of a.markers) {
          const k = u.circleMarker([w.lat, w.lng], {
            radius: 7,
            color: "hsl(var(--primary))",
            fillColor: "hsl(var(--primary))",
            fillOpacity: 0.85
          }).addTo(i);
          (w.label || w.popup) && k.bindPopup(
            `<strong>${w.label ?? ""}</strong>${w.popup ? `<br>${w.popup}` : ""}`
          );
        }
    }
    function h() {
      if (!i || !u)
        return;
      const w = a.modelValue?.[a.latKey], k = a.modelValue?.[a.lngKey];
      if (typeof w != "number" || typeof k != "number") {
        d && (i.removeLayer(d), d = null);
        return;
      }
      d ? d.setLatLng([w, k]) : d = u.circleMarker([w, k], {
        radius: 8,
        color: "#0f172a",
        fillColor: "#38bdf8",
        fillOpacity: 1,
        weight: 2
      }).addTo(i), i.setView([w, k], i.getZoom());
    }
    return be(() => {
      v();
    }), ke(() => {
      i?.remove(), i = null, d = null;
    }), pe(
      () => a.modelValue,
      () => h(),
      { deep: !0 }
    ), (w, k) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "border-input bg-muted/20 w-full overflow-hidden rounded-md border",
      style: ie({ height: `${e.height}px` }),
      "aria-disabled": e.disabled || void 0
    }, null, 12, Nv));
  }
}), Uv = { class: "flex flex-col gap-2" }, Hv = { class: "text-muted-foreground text-xs font-normal" }, qv = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkMapField",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.modelValue && typeof a.modelValue == "object" ? a.modelValue : null), i = y(() => a.field.latKey ?? "lat"), d = y(() => a.field.lngKey ?? "lng");
    return (u, c) => (t(), n("div", Uv, [
      I(Rv, {
        "model-value": s.value,
        center: e.field.defaultCenter ?? null,
        zoom: e.field.zoom ?? 12,
        height: e.field.height ?? 280,
        "lat-key": i.value,
        "lng-key": d.value,
        disabled: e.disabled,
        pickable: "",
        "onUpdate:modelValue": c[0] || (c[0] = (v) => r("update:modelValue", v))
      }, null, 8, ["model-value", "center", "zoom", "height", "lat-key", "lng-key", "disabled"]),
      l("p", Hv, [
        U(" Click the map to set " + f(i.value) + " / " + f(d.value) + " ", 1),
        s.value ? (t(), n(_, { key: 0 }, [
          U(" (" + f(s.value[i.value]?.toFixed?.(5) ?? s.value[i.value]) + ", " + f(s.value[d.value]?.toFixed?.(5) ?? s.value[d.value]) + ") ", 1)
        ], 64)) : b("", !0)
      ])
    ]));
  }
}), Kv = { class: "flex flex-col gap-2" }, Gv = ["width", "height"], Wv = ["value", "disabled"], Zv = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal"
}, Jv = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkQrCode",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    values: { default: () => ({}) }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = y(() => {
      if (a.field.from) {
        const c = a.values?.[a.field.from];
        return c == null ? "" : String(c);
      }
      return a.modelValue == null ? "" : String(a.modelValue);
    }), d = y(() => a.field.size ?? 160);
    async function u() {
      if (!s.value)
        return;
      const c = i.value;
      if (c === "") {
        s.value.getContext("2d")?.clearRect(0, 0, d.value, d.value);
        return;
      }
      await (await import("qrcode")).toCanvas(s.value, c, {
        width: d.value,
        margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" }
      });
    }
    return be(() => {
      u();
    }), pe(i, () => {
      u();
    }), (c, v) => (t(), n("div", Kv, [
      l("canvas", {
        ref_key: "canvas",
        ref: s,
        class: "border-input bg-background rounded-md border",
        width: d.value,
        height: d.value
      }, null, 8, Gv),
      e.field.from ? (t(), n("p", Zv, "From " + f(e.field.from), 1)) : (t(), n("input", {
        key: 0,
        type: "text",
        class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
        value: e.modelValue == null ? "" : String(e.modelValue),
        disabled: e.disabled,
        placeholder: "QR payload",
        onInput: v[0] || (v[0] = (m) => r("update:modelValue", m.target.value))
      }, null, 40, Wv))
    ]));
  }
}), Yv = { class: "flex flex-col gap-2" }, Qv = { class: "border-input bg-background inline-flex min-h-16 items-center justify-center overflow-x-auto rounded-md border p-2" }, Xv = ["aria-label"], eg = {
  key: 0,
  class: "text-destructive text-xs"
}, tg = ["value", "disabled"], ng = {
  key: 2,
  class: "text-muted-foreground text-xs font-normal"
}, ag = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkBarcode",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    values: { default: () => ({}) }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = q(null), d = y(() => {
      if (a.field.from) {
        const v = a.values?.[a.field.from];
        return v == null ? "" : String(v);
      }
      return a.modelValue == null ? "" : String(a.modelValue);
    }), u = y(() => (a.field.format ?? "CODE128").toUpperCase());
    async function c() {
      if (!s.value)
        return;
      const v = d.value.trim();
      for (i.value = null; s.value.firstChild; )
        s.value.removeChild(s.value.firstChild);
      if (v !== "")
        try {
          const h = (await import("jsbarcode")).default;
          h(s.value, v, {
            format: u.value,
            height: a.field.height ?? 80,
            width: a.field.width ?? 2,
            displayValue: a.field.displayValue !== !1,
            margin: 8,
            background: "#ffffff",
            lineColor: "#0f172a",
            fontSize: 14
          });
        } catch (m) {
          i.value = m instanceof Error ? m.message : "Could not render barcode";
        }
    }
    return be(() => {
      c();
    }), pe([d, u], () => {
      c();
    }), (v, m) => (t(), n("div", Yv, [
      l("div", Qv, [
        (t(), n("svg", {
          ref_key: "svg",
          ref: s,
          class: "max-w-full",
          role: "img",
          "aria-label": `Barcode ${u.value}`
        }, null, 8, Xv))
      ]),
      i.value ? (t(), n("p", eg, f(i.value), 1)) : b("", !0),
      e.field.from ? (t(), n("p", ng, " From " + f(e.field.from) + " (" + f(u.value) + ") ", 1)) : (t(), n("input", {
        key: 1,
        type: "text",
        class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
        value: e.modelValue == null ? "" : String(e.modelValue),
        disabled: e.disabled,
        placeholder: "Barcode value",
        onInput: m[0] || (m[0] = (h) => r("update:modelValue", h.target.value))
      }, null, 40, tg))
    ]));
  }
}), lg = { class: "mr-2 inline-block w-3 opacity-60" }, og = {
  key: 0,
  class: "text-muted-foreground p-3"
}, sg = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkDiff",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    values: { default: () => ({}) }
  },
  setup(e) {
    const o = e;
    function a(d) {
      if (d == null)
        return "";
      if (typeof d == "string")
        return d;
      if (typeof d == "object")
        try {
          return JSON.stringify(d, null, 2);
        } catch {
          return String(d);
        }
      return String(d);
    }
    const r = y(() => {
      if (o.field.originalKey)
        return a(o.values?.[o.field.originalKey]);
      const d = o.modelValue;
      return a(d?.original);
    }), s = y(() => {
      if (o.field.modifiedKey)
        return a(o.values?.[o.field.modifiedKey]);
      const d = o.modelValue;
      return a(d?.modified);
    }), i = y(() => {
      const d = r.value.split(`
`), u = s.value.split(`
`), c = Math.max(d.length, u.length), v = [];
      for (let m = 0; m < c; m++) {
        const h = d[m], w = u[m];
        if (h === w) {
          h !== void 0 && v.push({ kind: "same", text: h });
          continue;
        }
        h !== void 0 && v.push({ kind: "del", text: h }), w !== void 0 && v.push({ kind: "add", text: w });
      }
      return v;
    });
    return (d, u) => (t(), n("div", {
      class: "border-input bg-background overflow-auto rounded-md border font-mono text-xs leading-5",
      style: ie({ maxHeight: `${(e.field.rows ?? 12) * 1.25}rem` })
    }, [
      (t(!0), n(_, null, j(i.value, (c, v) => (t(), n("div", {
        key: v,
        class: z(["px-2 whitespace-pre-wrap", {
          "bg-destructive/10 text-destructive": c.kind === "del",
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300": c.kind === "add",
          "text-muted-foreground": c.kind === "same"
        }])
      }, [
        l("span", lg, f(c.kind === "add" ? "+" : c.kind === "del" ? "-" : " "), 1),
        U(" " + f(c.text), 1)
      ], 2))), 128)),
      i.value.length === 0 ? (t(), n("p", og, "No differences.")) : b("", !0)
    ], 4));
  }
}), rg = { class: "flex flex-col gap-3" }, ig = { class: "flex items-center justify-between gap-2" }, dg = { class: "text-sm font-medium" }, ug = { class: "text-muted-foreground grid grid-cols-7 gap-1 text-center text-[10px] uppercase" }, cg = { class: "grid grid-cols-7 gap-1" }, fg = {
  key: 0,
  class: "text-muted-foreground mb-1 text-[10px]"
}, mg = ["title"], K6 = /* @__PURE__ */ L({
  __name: "PkCalendar",
  props: {
    events: {}
  },
  setup(e) {
    const o = e, a = q(/* @__PURE__ */ new Date()), r = y(() => a.value.getFullYear()), s = y(() => a.value.getMonth()), i = y(
      () => a.value.toLocaleString(void 0, { month: "long", year: "numeric" })
    ), d = y(() => {
      const m = /* @__PURE__ */ new Map();
      for (const h of o.events ?? []) {
        const w = m.get(h.date) ?? [];
        w.push(h), m.set(h.date, w);
      }
      return m;
    }), u = y(() => {
      const h = new Date(r.value, s.value, 1).getDay(), w = new Date(r.value, s.value + 1, 0).getDate(), k = [];
      for (let S = 0; S < h; S++)
        k.push({ day: null, key: `pad-${S}`, events: [] });
      for (let S = 1; S <= w; S++) {
        const C = `${r.value}-${String(s.value + 1).padStart(2, "0")}-${String(S).padStart(2, "0")}`;
        k.push({ day: S, key: C, events: d.value.get(C) ?? [] });
      }
      return k;
    });
    function c() {
      a.value = new Date(r.value, s.value - 1, 1);
    }
    function v() {
      a.value = new Date(r.value, s.value + 1, 1);
    }
    return (m, h) => (t(), n("div", rg, [
      l("div", ig, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-sm",
          onClick: c
        }, " Prev "),
        l("p", dg, f(i.value), 1),
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-sm",
          onClick: v
        }, " Next ")
      ]),
      l("div", ug, [
        (t(), n(_, null, j(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], (w) => l("span", { key: w }, f(w), 1)), 64))
      ]),
      l("div", cg, [
        (t(!0), n(_, null, j(u.value, (w) => (t(), n("div", {
          key: w.key,
          class: z(["border-border/60 min-h-16 rounded-md border p-1", w.day ? "bg-background" : "bg-transparent border-transparent"])
        }, [
          w.day ? (t(), n("p", fg, f(w.day), 1)) : b("", !0),
          (t(!0), n(_, null, j(w.events.slice(0, 3), (k, S) => (t(), n("p", {
            key: `${w.key}-${S}`,
            class: "bg-primary/10 text-foreground mb-0.5 truncate rounded px-1 text-[10px] leading-4",
            title: k.label
          }, f(k.label), 9, mg))), 128))
        ], 2))), 128))
      ])
    ]));
  }
}), pg = { class: "flex items-center gap-3" }, vg = ["min", "max", "step", "value", "disabled", "aria-label"], gg = { class: "flex shrink-0 items-center gap-1" }, hg = ["min", "max", "step", "value", "disabled"], bg = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, yg = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkSlider",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.field.min ?? 0), i = y(() => a.field.max ?? 100), d = y(() => a.field.step ?? 1), u = y(() => {
      const m = Number(a.modelValue);
      return Number.isFinite(m) ? m : s.value;
    }), c = y(
      () => a.modelValue === null || a.modelValue === void 0 || a.modelValue === ""
    );
    function v(m) {
      if (m === "") {
        r("update:modelValue", null);
        return;
      }
      const h = Number(m);
      r("update:modelValue", Number.isFinite(h) ? h : null);
    }
    return (m, h) => (t(), n("div", pg, [
      l("input", {
        type: "range",
        class: "accent-primary h-9 flex-1 cursor-pointer disabled:opacity-50",
        min: s.value,
        max: i.value,
        step: d.value,
        value: u.value,
        disabled: e.disabled,
        "aria-label": `${e.field.key} value`,
        onInput: h[0] || (h[0] = (w) => v(w.target.value))
      }, null, 40, vg),
      l("div", gg, [
        l("input", {
          type: "number",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-20 rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
          min: s.value,
          max: i.value,
          step: d.value,
          value: c.value ? "" : u.value,
          disabled: e.disabled,
          onInput: h[1] || (h[1] = (w) => v(w.target.value))
        }, null, 40, hg),
        e.field.unit ? (t(), n("span", bg, f(e.field.unit), 1)) : b("", !0)
      ])
    ]));
  }
}), ht = /* @__PURE__ */ new Map();
function It(e, o) {
  ht.set(e, o);
}
function xg(e) {
  return ht.get(e);
}
function G6(e) {
  return ht.has(e);
}
function kg() {
  return [...ht.keys()].sort();
}
function W6() {
  ht.clear();
}
const $g = ["name", "value", "checked", "disabled", "onChange"], wg = {
  key: 0,
  class: "flex shrink-0 scale-75 items-center",
  "aria-hidden": "true"
}, Cg = { class: "whitespace-nowrap" }, Sg = {
  key: 0,
  class: "text-muted-foreground px-2 py-1 text-xs"
}, Mg = ["name", "value", "checked", "disabled", "onChange"], Bg = {
  class: "bg-muted/40 flex h-16 items-center justify-center overflow-hidden rounded",
  "aria-hidden": "true"
}, Ag = {
  key: 1,
  class: "text-destructive px-1 text-center text-[10px] leading-tight"
}, zg = { class: "text-center text-xs font-medium" }, _g = {
  key: 0,
  class: "text-muted-foreground col-span-full text-sm"
}, Pg = {
  key: 1,
  class: "text-muted-foreground col-span-full text-xs"
}, Lg = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkVisualSelect",
  props: {
    field: {},
    modelValue: {},
    options: { default: () => [] },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(
      () => a.field.preview ? xg(a.field.preview) : void 0
    ), i = y(() => !!a.field.preview && !s.value), d = y(() => a.field.layout === "segmented"), u = y(() => {
      switch (a.field.columns ?? 3) {
        case 1:
          return "grid-cols-1";
        case 2:
          return "grid-cols-1 sm:grid-cols-2";
        case 4:
          return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
        case 5:
          return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
        case 6:
          return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
        default:
          return "grid-cols-2 sm:grid-cols-3";
      }
    });
    function c(v) {
      return a.modelValue != null && v.value == a.modelValue;
    }
    return (v, m) => d.value ? (t(), n("div", {
      key: 0,
      role: "radiogroup",
      class: z(["bg-muted inline-flex w-fit max-w-full items-stretch gap-0.5 rounded-full p-1", e.disabled ? "opacity-50" : ""])
    }, [
      (t(!0), n(_, null, j(e.options, (h) => (t(), n("label", {
        key: String(h.value),
        class: z(["relative flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors", [
          c(h) ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          e.disabled ? "" : "cursor-pointer"
        ]])
      }, [
        l("input", {
          type: "radio",
          class: "peer sr-only",
          name: `f-${e.field.key}`,
          value: h.value,
          checked: c(h),
          disabled: e.disabled,
          onChange: (w) => r("update:modelValue", h.value)
        }, null, 40, $g),
        m[0] || (m[0] = l("span", {
          class: "ring-ring pointer-events-none absolute inset-0 rounded-full peer-focus-visible:ring-2",
          "aria-hidden": "true"
        }, null, -1)),
        s.value ? (t(), n("span", wg, [
          (t(), T(Ce(s.value), {
            value: h.value,
            label: h.label,
            selected: c(h)
          }, null, 8, ["value", "label", "selected"]))
        ])) : b("", !0),
        l("span", Cg, f(h.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", Sg, " Nothing to choose from yet. ")) : b("", !0)
    ], 2)) : (t(), n("div", {
      key: 1,
      role: "radiogroup",
      class: z(["grid gap-3", u.value])
    }, [
      (t(!0), n(_, null, j(e.options, (h) => (t(), n("label", {
        key: String(h.value),
        class: z(["group relative flex flex-col gap-2 rounded-lg border p-2 transition-colors", [
          c(h) ? "border-primary ring-primary/30 bg-primary/5 ring-2" : "border-border hover:border-muted-foreground/40",
          e.disabled ? "opacity-50" : "cursor-pointer"
        ]])
      }, [
        l("input", {
          type: "radio",
          class: "peer sr-only",
          name: `f-${e.field.key}`,
          value: h.value,
          checked: c(h),
          disabled: e.disabled,
          onChange: (w) => r("update:modelValue", h.value)
        }, null, 40, Mg),
        m[1] || (m[1] = l("span", {
          class: "ring-ring pointer-events-none absolute inset-0 rounded-lg peer-focus-visible:ring-2",
          "aria-hidden": "true"
        }, null, -1)),
        l("span", Bg, [
          s.value ? (t(), T(Ce(s.value), {
            key: 0,
            value: h.value,
            label: h.label,
            selected: c(h)
          }, null, 8, ["value", "label", "selected"])) : i.value ? (t(), n("span", Ag, " no preview ")) : b("", !0)
        ]),
        l("span", zg, f(h.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", _g, " Nothing to choose from yet. ")) : b("", !0),
      i.value && e.options.length > 0 ? (t(), n("p", Pg, [
        m[2] || (m[2] = U(" No preview registered for ", -1)),
        l("code", null, f(e.field.preview), 1),
        U(". Registered: " + f(x(kg)().join(", ") || "none") + ". ", 1)
      ])) : b("", !0)
    ], 2));
  }
}), Og = {
  class: "border-border size-10 overflow-hidden rounded-md border",
  style: {
    backgroundImage: "linear-gradient(45deg, rgba(0,0,0,.10) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.10) 75%), linear-gradient(45deg, rgba(0,0,0,.10) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.10) 75%)",
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 4px 4px"
  }
}, jg = /* @__PURE__ */ L({
  __name: "PkSwatchPreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), n("span", Og, [
      l("span", {
        class: "block size-full",
        style: ie({ backgroundColor: String(e.value) })
      }, null, 4)
    ]));
  }
}), Vg = { class: "flex flex-col items-center gap-1 text-center" }, Dg = {
  key: 0,
  class: "text-xs text-neutral-500"
}, ia = /* @__PURE__ */ L({
  __name: "PkCodeBox",
  props: {
    code: {},
    caption: { default: "" },
    style: { default: "dashed" },
    accent: { default: "#0f172a" },
    mono: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = y(() => o.mono ? "#000000" : o.accent), r = y(() => {
      switch (o.style) {
        case "solid":
          return "border-2 border-solid rounded-md";
        case "ticket":
          return "border-2 border-solid rounded-none [clip-path:polygon(0_14%,6%_0,94%_0,100%_14%,100%_86%,94%_100%,6%_100%,0_86%)]";
        case "pill":
          return "border rounded-full";
        case "stamp":
          return "border-4 border-double rounded-sm";
        case "minimal":
          return "border-0 border-b-2 rounded-none";
        default:
          return "border-2 border-dashed rounded-md";
      }
    });
    return (s, i) => (t(), n("div", Vg, [
      l("div", {
        class: z(["inline-flex items-center justify-center font-mono font-semibold whitespace-nowrap tabular-nums", [
          r.value,
          e.compact ? "px-2 py-1 text-[10px]" : "px-6 py-3 text-xl tracking-[0.2em]"
        ]]),
        style: ie({ borderColor: a.value, color: a.value })
      }, f(e.code), 7),
      e.caption && !e.compact ? (t(), n("p", Dg, f(e.caption), 1)) : b("", !0)
    ]));
  }
}), Tg = {
  dusk: "document",
  class: "flex flex-col gap-6 bg-white p-8 text-black"
}, Ig = { class: "flex items-center gap-3" }, Eg = ["src"], Fg = {
  key: 0,
  class: "mt-1 text-sm text-neutral-600"
}, Ng = {
  key: 1,
  class: "mt-1 font-mono text-sm text-neutral-600"
}, Rg = {
  key: 0,
  class: "text-right text-sm"
}, Ug = { class: "text-neutral-500" }, Hg = { class: "tabular-nums" }, qg = { key: 1 }, Kg = { class: "text-xs font-semibold tracking-wider text-neutral-500 uppercase" }, Gg = { class: "mt-2 font-medium" }, Wg = { key: 2 }, Zg = { class: "w-full text-sm" }, Jg = { class: "w-full py-3 pr-2" }, Yg = {
  key: 0,
  class: "text-xs text-neutral-500"
}, Qg = { key: 0 }, Xg = ["colspan"], e1 = {
  key: 0,
  class: "mt-6 flex break-inside-avoid justify-end"
}, t1 = { class: "w-64 text-sm" }, n1 = { class: "tabular-nums" }, a1 = {
  key: 3,
  class: "py-2"
}, l1 = { key: 4 }, o1 = { class: "text-xs font-semibold tracking-wider text-neutral-500 uppercase" }, s1 = { class: "mt-2 flex flex-col gap-1 text-sm" }, r1 = {
  key: 6,
  class: "mt-auto border-t border-neutral-200 pt-4 text-xs text-neutral-500"
}, i1 = { key: 0 }, d1 = {
  key: 1,
  class: "mt-1"
}, u1 = {
  key: 7,
  class: "rounded border border-dashed border-red-300 p-2 text-xs text-red-600"
}, c1 = /* @__PURE__ */ L({
  __name: "PkDocument",
  props: {
    document: {}
  },
  setup(e) {
    const o = e;
    function a() {
      return o.document.branding.mono ? "#000000" : o.document.branding.accent;
    }
    function r(c) {
      return c.meta ?? [];
    }
    function s(c) {
      return c.rows ?? [];
    }
    function i(c) {
      return c.totals ?? [];
    }
    function d(c) {
      return c ?? [];
    }
    function u(c) {
      return c ?? "";
    }
    return (c, v) => (t(), n("article", Tg, [
      l("div", Ig, [
        e.document.branding.logoUrl ? (t(), n("img", {
          key: 0,
          src: e.document.branding.logoUrl,
          alt: "",
          class: "max-h-10 max-w-40 object-contain"
        }, null, 8, Eg)) : (t(), n("p", {
          key: 1,
          class: "text-lg font-semibold",
          style: ie({ color: a() })
        }, f(e.document.branding.company), 5))
      ]),
      (t(!0), n(_, null, j(e.document.blocks, (m, h) => (t(), n(_, { key: h }, [
        m.type === "header" ? (t(), n("header", {
          key: 0,
          class: "flex items-start justify-between gap-8 border-b pb-4",
          style: ie({ borderColor: a() })
        }, [
          l("div", null, [
            l("h1", {
              class: "text-2xl font-semibold tracking-tight",
              style: ie({ color: a() })
            }, f(m.title), 5),
            m.subtitle ? (t(), n("p", Fg, f(m.subtitle), 1)) : b("", !0),
            m.reference ? (t(), n("p", Ng, f(m.reference), 1)) : b("", !0)
          ]),
          r(m).length ? (t(), n("dl", Rg, [
            (t(!0), n(_, null, j(r(m), (w, k) => (t(), n("div", {
              key: k,
              class: "flex justify-end gap-4 py-0.5"
            }, [
              l("dt", Ug, f(w.label), 1),
              l("dd", Hg, f(w.value), 1)
            ]))), 128))
          ])) : b("", !0)
        ], 4)) : m.type === "party" ? (t(), n("section", qg, [
          l("h2", Kg, f(m.heading), 1),
          l("p", Gg, f(m.name), 1),
          (t(!0), n(_, null, j(d(m.lines), (w, k) => (t(), n("p", {
            key: k,
            class: "text-sm text-neutral-600"
          }, f(w), 1))), 128))
        ])) : m.type === "lines" ? (t(), n("section", Wg, [
          l("table", Zg, [
            l("thead", null, [
              l("tr", {
                class: "border-b-2 text-left",
                style: ie({ borderColor: a() })
              }, [
                (t(!0), n(_, null, j(d(m.columns), (w, k) => (t(), n("th", {
                  key: k,
                  class: z(["pb-2 font-medium", k > 0 ? "pl-3 text-right whitespace-nowrap" : ""])
                }, f(w), 3))), 128))
              ], 4)
            ]),
            l("tbody", null, [
              (t(!0), n(_, null, j(s(m), (w, k) => (t(), n("tr", {
                key: k,
                class: "border-b border-neutral-200"
              }, [
                l("td", Jg, [
                  l("p", null, f(w.description), 1),
                  w.detail ? (t(), n("p", Yg, f(w.detail), 1)) : b("", !0)
                ]),
                (t(!0), n(_, null, j(w.cells, (S, C) => (t(), n("td", {
                  key: C,
                  class: "py-3 pl-3 text-right whitespace-nowrap tabular-nums"
                }, f(S), 1))), 128))
              ]))), 128)),
              s(m).length === 0 ? (t(), n("tr", Qg, [
                l("td", {
                  colspan: d(m.columns).length || 1,
                  class: "py-6 text-center text-neutral-500"
                }, f(m.empty), 9, Xg)
              ])) : b("", !0)
            ])
          ]),
          i(m).length ? (t(), n("div", e1, [
            l("dl", t1, [
              (t(!0), n(_, null, j(i(m), (w, k) => (t(), n("div", {
                key: k,
                class: z([
                  "flex justify-between py-1",
                  w.strong ? "mt-1 border-t-2 pt-2 text-base font-semibold" : ""
                ]),
                style: ie(w.strong ? { color: a(), borderColor: a() } : void 0)
              }, [
                l("dt", {
                  class: z(w.strong ? "" : "text-neutral-600")
                }, f(w.label), 3),
                l("dd", n1, f(w.value), 1)
              ], 6))), 128))
            ])
          ])) : b("", !0)
        ])) : m.type === "code" ? (t(), n("section", a1, [
          I(ia, {
            code: u(m.code),
            caption: u(m.caption),
            style: ie(u(m.style)),
            accent: e.document.branding.accent,
            mono: e.document.branding.mono
          }, null, 8, ["code", "caption", "style", "accent", "mono"])
        ])) : m.type === "steps" ? (t(), n("section", l1, [
          l("h2", o1, f(m.heading), 1),
          l("ol", s1, [
            (t(!0), n(_, null, j(d(m.items), (w, k) => (t(), n("li", {
              key: k,
              class: "flex gap-2"
            }, [
              l("span", {
                class: "font-semibold tabular-nums",
                style: ie({ color: a() })
              }, f(k + 1) + ".", 5),
              l("span", null, f(w), 1)
            ]))), 128))
          ])
        ])) : m.type === "note" ? (t(), n("p", {
          key: 5,
          class: z(["text-sm", m.emphasis ? "font-medium" : "text-neutral-600"]),
          style: ie(m.emphasis ? { color: a() } : void 0)
        }, f(m.text), 7)) : m.type === "footer" ? (t(), n("footer", r1, [
          m.text ? (t(), n("p", i1, f(m.text), 1)) : b("", !0),
          d(m.contacts).length ? (t(), n("p", d1, f(d(m.contacts).join(" · ")), 1)) : b("", !0)
        ])) : (t(), n("p", u1, " This document contains a “" + f(m.type) + "” block, which this version cannot draw. ", 1))
      ], 64))), 128))
    ]));
  }
}), f1 = ["aria-label", "title"], m1 = {
  class: "size-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, p1 = {
  key: 1,
  d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
}, Z6 = /* @__PURE__ */ L({
  __name: "ThemeToggle",
  setup(e) {
    const { appearance: o, set: a } = ta(), r = y(() => o.value.theme === "dark");
    function s() {
      a({ theme: r.value ? "light" : "dark" });
    }
    return (i, d) => (t(), n("button", {
      type: "button",
      class: "text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-2 transition-colors",
      "aria-label": r.value ? "Switch to light theme" : "Switch to dark theme",
      title: r.value ? "Light theme" : "Dark theme",
      onClick: s
    }, [
      (t(), n("svg", m1, [
        r.value ? (t(), n(_, { key: 0 }, [
          d[0] || (d[0] = l("circle", {
            cx: "12",
            cy: "12",
            r: "4"
          }, null, -1)),
          d[1] || (d[1] = l("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" }, null, -1))
        ], 64)) : (t(), n("path", p1))
      ]))
    ], 8, f1));
  }
}), v1 = ["width", "height"], g1 = { key: 0 }, h1 = ["x1", "x2", "y1", "y2"], b1 = ["x", "y"], y1 = ["x1", "x2", "y1", "y2"], x1 = ["x", "y"], k1 = ["x", "y", "width", "height", "fill-opacity", "onMouseenter"], $1 = ["x", "y", "width", "height", "fill", "fill-opacity"], w1 = ["x", "y"], C1 = ["x", "y"], S1 = {
  key: 0,
  class: "bg-popover pointer-events-none absolute top-2 right-2 z-10 min-w-32 rounded-lg border p-2 shadow-lg"
}, M1 = { class: "text-muted-foreground mb-1 text-[11px] capitalize" }, B1 = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, A1 = { class: "text-xs font-semibold tabular-nums" }, z1 = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, _1 = { class: "text-muted-foreground" }, zn = 5.6, J6 = /* @__PURE__ */ L({
  __name: "BarChart",
  props: {
    data: {},
    series: {},
    height: { default: 220 },
    orientation: { default: "vertical" },
    stacked: { type: Boolean, default: !1 },
    format: {},
    showAxis: { type: Boolean, default: !0 },
    showLegend: { type: Boolean, default: !1 },
    thresholds: { default: null },
    aboveColor: { default: "var(--chart-2)" },
    maxValue: { default: null }
  },
  setup(e) {
    const o = e, a = {
      danger: "var(--destructive)",
      warning: "var(--chart-4)",
      success: "var(--chart-2)",
      neutral: "var(--muted-foreground)"
    };
    function r(P) {
      return a[P] ?? P;
    }
    function s(P, J) {
      if (!o.thresholds?.length)
        return J;
      const V = o.thresholds.find((E) => P < E.max);
      return r(V ? V.color : o.aboveColor);
    }
    const i = q(null), d = q(560), u = q(null);
    let c = null;
    be(() => {
      c = new ResizeObserver((P) => {
        d.value = Math.max(160, P[0].contentRect.width);
      }), i.value && c.observe(i.value);
    }), ke(() => c?.disconnect());
    const v = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)"
    ], m = y(() => (o.series?.length ? o.series : o.data?.length ? [{ name: "", points: o.data }] : []).map((J, V) => ({
      ...J,
      color: J.color ?? v[V % v.length]
    }))), h = y(() => m.value[0]?.points.map((P) => P.label) ?? []), w = y(() => h.value.length), k = y(() => o.orientation === "horizontal"), S = y(() => Math.max(0, ...h.value.map((P) => P.length))), C = y(() => {
      if (!k.value)
        return o.showAxis ? 44 : 8;
      const P = S.value * zn + 16;
      return Math.round(Math.min(Math.max(60, P), d.value * 0.4));
    }), B = y(() => Math.max(4, Math.floor((C.value - 16) / zn)));
    function A(P) {
      return P.length <= B.value ? P : `${P.slice(0, B.value - 1)}…`;
    }
    const $ = y(() => ({
      top: 12,
      right: 12,
      bottom: 26,
      left: C.value
    })), p = y(() => ({
      w: Math.max(1, d.value - $.value.left - $.value.right),
      h: Math.max(1, o.height - $.value.top - $.value.bottom)
    })), g = (P) => o.format ? o.format(P) : M(P);
    function M(P) {
      return Math.abs(P) >= 1e6 ? `${(P / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(P) >= 1e3 ? `${(P / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(P * 100) / 100);
    }
    const F = y(() => {
      const P = h.value.map(
        (te, le) => o.stacked ? m.value.reduce((Q, ne) => Q + Math.max(0, ne.points[le]?.value ?? 0), 0) : Math.max(...m.value.map((Q) => Q.points[le]?.value ?? 0))
      );
      if (o.maxValue)
        return o.maxValue;
      const J = Math.max(...P, 0);
      if (J <= 0)
        return 1;
      const V = 10 ** Math.floor(Math.log10(J));
      return ([1, 2, 2.5, 5, 10].find((te) => J <= te * V) ?? 10) * V;
    }), D = y(
      () => (k.value ? p.value.h : p.value.w) / Math.max(1, w.value)
    ), Y = y(() => D.value * 0.68), G = y(
      () => o.stacked || m.value.length <= 1 ? Y.value : Y.value / m.value.length
    ), Z = y(() => {
      const P = [], J = new Array(w.value).fill(0);
      return m.value.forEach((V, E) => {
        V.points.forEach((te, le) => {
          const ne = Math.max(0, te.value) / F.value * (k.value ? p.value.w : p.value.h), se = (k.value ? $.value.top : $.value.left) + le * D.value + (D.value - Y.value) / 2, Me = o.stacked ? 0 : E * G.value;
          P.push(
            k.value ? {
              x: $.value.left + J[le],
              y: se + Me,
              w: ne,
              h: Math.max(0, G.value - 2),
              color: s(te.value, V.color),
              label: te.label,
              name: V.name,
              value: te.value,
              index: le
            } : {
              x: se + Me,
              y: $.value.top + p.value.h - ne - J[le],
              w: Math.max(0, G.value - 2),
              h: ne,
              color: s(te.value, V.color),
              label: te.label,
              name: V.name,
              value: te.value,
              index: le
            }
          ), o.stacked && (J[le] += ne);
        });
      }), P;
    }), W = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((P) => ({
        value: F.value * (k.value ? P : 1 - P),
        x: $.value.left + p.value.w * P,
        y: $.value.top + p.value.h * P
      }))
    ), H = y(() => Math.max(1, Math.ceil(w.value / (k.value ? 14 : 10))));
    function N(P) {
      return P === w.value - 1 || P % H.value === 0;
    }
    function R(P) {
      return (k.value ? $.value.top : $.value.left) + P * D.value + D.value / 2;
    }
    const X = y(() => u.value === null ? null : {
      label: h.value[u.value],
      rows: m.value.map((P) => ({
        name: P.name,
        color: P.color,
        value: P.points[u.value]?.value ?? 0
      }))
    });
    return (P, J) => (t(), n("div", {
      ref_key: "host",
      ref: i,
      class: "relative w-full"
    }, [
      w.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(_, { key: 1 }, [
        (t(), n("svg", {
          width: d.value,
          height: e.height,
          onMouseleave: J[0] || (J[0] = (V) => u.value = null)
        }, [
          e.showAxis ? (t(), n("g", g1, [
            k.value ? (t(), n(_, { key: 0 }, [
              (t(!0), n(_, null, j(W.value, (V) => (t(), n("line", {
                key: `g-${V.x}`,
                x1: V.x,
                x2: V.x,
                y1: $.value.top,
                y2: $.value.top + p.value.h,
                stroke: "var(--border)",
                "stroke-width": "1"
              }, null, 8, h1))), 128)),
              (t(!0), n(_, null, j(W.value, (V) => (t(), n("text", {
                key: `gt-${V.x}`,
                x: V.x,
                y: e.height - 6,
                "text-anchor": "middle",
                class: "fill-muted-foreground text-[10px] tabular-nums"
              }, f(M(V.value)), 9, b1))), 128))
            ], 64)) : (t(), n(_, { key: 1 }, [
              (t(!0), n(_, null, j(W.value, (V) => (t(), n("line", {
                key: `g-${V.y}`,
                x1: $.value.left,
                x2: d.value - $.value.right,
                y1: V.y,
                y2: V.y,
                stroke: "var(--border)",
                "stroke-width": "1"
              }, null, 8, y1))), 128)),
              (t(!0), n(_, null, j(W.value, (V) => (t(), n("text", {
                key: `gt-${V.y}`,
                x: $.value.left - 8,
                y: V.y + 3,
                "text-anchor": "end",
                class: "fill-muted-foreground text-[10px] tabular-nums"
              }, f(M(V.value)), 9, x1))), 128))
            ], 64))
          ])) : b("", !0),
          (t(!0), n(_, null, j(h.value, (V, E) => (t(), n("rect", {
            key: `hit-${E}`,
            x: k.value ? $.value.left : $.value.left + E * D.value,
            y: k.value ? $.value.top + E * D.value : $.value.top,
            width: k.value ? p.value.w : D.value,
            height: k.value ? D.value : p.value.h,
            fill: "var(--muted)",
            "fill-opacity": u.value === E ? 0.4 : 0,
            onMouseenter: (te) => u.value = E
          }, null, 40, k1))), 128)),
          (t(!0), n(_, null, j(Z.value, (V, E) => (t(), n("rect", {
            key: `b-${E}`,
            x: V.x,
            y: V.y,
            width: V.w,
            height: V.h,
            fill: V.color,
            "fill-opacity": u.value === null || u.value === V.index ? 0.9 : 0.35,
            rx: "3",
            class: "transition-[fill-opacity]",
            "pointer-events": "none"
          }, null, 8, $1))), 128)),
          k.value ? (t(!0), n(_, { key: 1 }, j(h.value, (V, E) => ge((t(), n("text", {
            key: `c-${E}`,
            x: $.value.left - 8,
            y: R(E) + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[10px]"
          }, [
            U(f(A(V)) + " ", 1),
            l("title", null, f(V), 1)
          ], 8, w1)), [
            [Ke, N(E)]
          ])), 128)) : (t(!0), n(_, { key: 2 }, j(h.value, (V, E) => ge((t(), n("text", {
            key: `c-${E}`,
            x: R(E),
            y: e.height - 8,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, f(V), 9, C1)), [
            [Ke, N(E)]
          ])), 128))
        ], 40, v1)),
        X.value ? (t(), n("div", S1, [
          l("p", M1, f(X.value.label), 1),
          (t(!0), n(_, null, j(X.value.rows, (V, E) => (t(), n("div", {
            key: E,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", B1, f(V.name || "Value"), 1),
            l("span", A1, f(g(V.value)), 1)
          ]))), 128))
        ])) : b("", !0),
        e.showLegend && m.value.length > 1 ? (t(), n("div", z1, [
          (t(!0), n(_, null, j(m.value, (V, E) => (t(), n("span", {
            key: E,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", _1, f(V.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), P1 = ["width", "height"], L1 = ["id"], O1 = ["stop-color"], j1 = ["stop-color"], V1 = { key: 0 }, D1 = ["x1", "x2", "y1", "y2"], T1 = ["x", "y"], I1 = ["x", "y"], E1 = ["x1", "x2", "y1", "y2"], F1 = ["d", "fill"], N1 = ["d", "stroke", "stroke-dasharray"], R1 = ["cx", "cy", "fill"], U1 = { key: 1 }, H1 = ["x1", "x2", "y1", "y2"], q1 = ["cx", "cy", "fill"], K1 = ["x", "y"], G1 = { class: "text-muted-foreground mb-1.5 text-[11px] whitespace-nowrap" }, W1 = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, Z1 = { class: "text-xs font-semibold tabular-nums" }, J1 = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, Y1 = { class: "text-muted-foreground" }, Q1 = /* @__PURE__ */ L({
  __name: "LineChart",
  props: {
    data: {},
    series: {},
    height: { default: 220 },
    type: { default: "area" },
    format: {},
    showAxis: { type: Boolean, default: !0 },
    showLegend: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = y(() => v.value.some((P) => P.axis === "right")), r = q(null), s = q(560), i = q(null);
    let d = null;
    be(() => {
      d = new ResizeObserver((P) => {
        s.value = Math.max(160, P[0].contentRect.width);
      }), r.value && d.observe(r.value);
    }), ke(() => d?.disconnect());
    const u = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)"
    ], c = Math.random().toString(36).slice(2, 9), v = y(() => (o.series?.length ? o.series : o.data?.length ? [{ name: "", points: o.data }] : []).map((J, V) => ({
      ...J,
      color: J.color ?? u[V % u.length]
    }))), m = y(() => v.value[0]?.points.map((P) => P.label) ?? []), h = y(() => m.value.length), w = y(() => ({
      top: 12,
      right: o.showAxis && a.value ? 44 : 12,
      bottom: 22,
      // The axis gutter disappears entirely when the axis is hidden, rather than
      // sitting there as dead space.
      left: o.showAxis ? 44 : 8
    })), k = (P) => o.format ? o.format(P) : S(P);
    function S(P) {
      return Math.abs(P) >= 1e6 ? `${(P / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(P) >= 1e3 ? `${(P / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(P * 100) / 100);
    }
    function C(P) {
      const J = Math.max(...P, 0);
      if (J <= 0)
        return 1;
      const V = 10 ** Math.floor(Math.log10(J));
      return ([1, 2, 2.5, 5, 10].find((te) => J <= te * V) ?? 10) * V;
    }
    const B = y(
      () => C(
        v.value.filter((P) => P.axis !== "right").flatMap((P) => P.points.map((J) => J.value))
      )
    ), A = y(
      () => C(
        v.value.filter((P) => P.axis === "right").flatMap((P) => P.points.map((J) => J.value))
      )
    ), $ = y(() => ({
      w: Math.max(1, s.value - w.value.left - w.value.right),
      h: Math.max(1, o.height - w.value.top - w.value.bottom)
    }));
    function p(P) {
      return w.value.left + (h.value <= 1 ? 0 : P / (h.value - 1) * $.value.w);
    }
    function g(P, J = "left") {
      const V = J === "right" ? A.value : B.value;
      return w.value.top + $.value.h - P / V * $.value.h;
    }
    const M = y(
      () => v.value.map((P) => {
        const J = P.points.map((E, te) => ({
          ...E,
          x: p(te),
          y: g(E.value, P.axis ?? "left")
        })), V = P.stepped ? F(J) : D(J);
        return { ...P, pts: J, line: V, area: Y(V, J) };
      })
    );
    function F(P) {
      if (P.length === 0)
        return "";
      let J = `M${P[0].x.toFixed(2)},${P[0].y.toFixed(2)}`;
      for (let V = 1; V < P.length; V++)
        J += ` L${P[V].x.toFixed(2)},${P[V - 1].y.toFixed(2)} L${P[V].x.toFixed(2)},${P[V].y.toFixed(2)}`;
      return J;
    }
    function D(P) {
      const J = P.length;
      if (J === 0)
        return "";
      if (J === 1)
        return `M${P[0].x},${P[0].y}`;
      const V = [], E = [];
      for (let Q = 0; Q < J - 1; Q++)
        V[Q] = P[Q + 1].x - P[Q].x, E[Q] = V[Q] === 0 ? 0 : (P[Q + 1].y - P[Q].y) / V[Q];
      const te = [E[0]];
      for (let Q = 1; Q < J - 1; Q++)
        if (E[Q - 1] * E[Q] <= 0)
          te[Q] = 0;
        else {
          const ne = 2 * V[Q] + V[Q - 1], se = V[Q] + 2 * V[Q - 1];
          te[Q] = (ne + se) / (ne / E[Q - 1] + se / E[Q]);
        }
      te[J - 1] = E[J - 2];
      let le = `M${P[0].x.toFixed(2)},${P[0].y.toFixed(2)}`;
      for (let Q = 0; Q < J - 1; Q++) {
        const ne = V[Q] / 3;
        le += ` C${(P[Q].x + ne).toFixed(2)},${(P[Q].y + te[Q] * ne).toFixed(2)} ${(P[Q + 1].x - ne).toFixed(2)},${(P[Q + 1].y - te[Q + 1] * ne).toFixed(2)} ${P[Q + 1].x.toFixed(2)},${P[Q + 1].y.toFixed(2)}`;
      }
      return le;
    }
    function Y(P, J) {
      if (J.length === 0)
        return "";
      const V = w.value.top + $.value.h;
      return `${P} L${J[J.length - 1].x.toFixed(2)},${V} L${J[0].x.toFixed(2)},${V} Z`;
    }
    const G = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((P) => ({
        y: w.value.top + $.value.h * P,
        value: B.value * (1 - P)
      }))
    ), Z = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((P) => ({
        y: w.value.top + $.value.h * P,
        value: A.value * (1 - P)
      }))
    ), W = y(() => Math.max(1, Math.ceil(h.value / 8)));
    function H(P) {
      return P === h.value - 1 || P % W.value === 0;
    }
    function N(P) {
      const J = P.currentTarget.getBoundingClientRect(), V = P.clientX - J.left - w.value.left, E = h.value <= 1 ? 1 : $.value.w / (h.value - 1);
      i.value = Math.min(h.value - 1, Math.max(0, Math.round(V / E)));
    }
    const R = y(() => {
      if (i.value === null || h.value === 0)
        return null;
      const P = i.value;
      return {
        i: P,
        x: p(P),
        label: m.value[P],
        rows: M.value.map((J) => ({
          name: J.name,
          color: J.color,
          value: J.points[P]?.value ?? 0,
          y: J.pts[P]?.y ?? 0
        }))
      };
    }), X = y(() => {
      if (!R.value)
        return {};
      const P = R.value.x > s.value * 0.6;
      return {
        left: `${R.value.x}px`,
        top: "8px",
        transform: P ? "translateX(-100%) translateX(-12px)" : "translateX(12px)"
      };
    });
    return (P, J) => (t(), n("div", {
      ref_key: "host",
      ref: r,
      class: "relative w-full"
    }, [
      h.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(_, { key: 1 }, [
        (t(), n("svg", {
          width: s.value,
          height: e.height,
          class: "overflow-visible",
          onMousemove: N,
          onMouseleave: J[0] || (J[0] = (V) => i.value = null)
        }, [
          l("defs", null, [
            (t(!0), n(_, null, j(M.value, (V, E) => (t(), n("linearGradient", {
              id: `pk-fill-${x(c)}-${E}`,
              key: E,
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "1"
            }, [
              l("stop", {
                offset: "0%",
                "stop-color": V.color,
                "stop-opacity": "0.25"
              }, null, 8, O1),
              l("stop", {
                offset: "100%",
                "stop-color": V.color,
                "stop-opacity": "0.01"
              }, null, 8, j1)
            ], 8, L1))), 128))
          ]),
          e.showAxis ? (t(), n("g", V1, [
            (t(!0), n(_, null, j(G.value, (V) => (t(), n("line", {
              key: V.y,
              x1: w.value.left,
              x2: s.value - w.value.right,
              y1: V.y,
              y2: V.y,
              stroke: "var(--border)",
              "stroke-width": "1"
            }, null, 8, D1))), 128)),
            (t(!0), n(_, null, j(G.value, (V) => (t(), n("text", {
              key: `t-${V.y}`,
              x: w.value.left - 8,
              y: V.y + 3,
              "text-anchor": "end",
              class: "fill-muted-foreground text-[10px] tabular-nums"
            }, f(S(V.value)), 9, T1))), 128)),
            a.value ? (t(!0), n(_, { key: 0 }, j(Z.value, (V) => (t(), n("text", {
              key: `rt-${V.y}`,
              x: s.value - w.value.right + 8,
              y: V.y + 3,
              "text-anchor": "start",
              class: "fill-muted-foreground text-[10px] tabular-nums"
            }, f(S(V.value)), 9, I1))), 128)) : b("", !0)
          ])) : b("", !0),
          (t(!0), n(_, null, j(m.value, (V, E) => ge((t(), n("line", {
            key: `v-${E}`,
            x1: p(E),
            x2: p(E),
            y1: w.value.top,
            y2: w.value.top + $.value.h,
            stroke: "var(--border)",
            "stroke-width": "1",
            "stroke-dasharray": "2 4",
            opacity: "0.7"
          }, null, 8, E1)), [
            [Ke, H(E)]
          ])), 128)),
          (t(!0), n(_, null, j(M.value, (V, E) => (t(), n("g", {
            key: `s-${E}`
          }, [
            V.filled ?? e.type === "area" ? (t(), n("path", {
              key: 0,
              d: V.area,
              fill: `url(#pk-fill-${x(c)}-${E})`
            }, null, 8, F1)) : b("", !0),
            l("path", {
              d: V.line,
              fill: "none",
              stroke: V.color,
              "stroke-width": "2",
              "stroke-linejoin": "round",
              "stroke-linecap": "round",
              "stroke-dasharray": V.dashed ? "6 4" : void 0
            }, null, 8, N1),
            V.pts.length === 1 ? (t(), n("circle", {
              key: 1,
              cx: V.pts[0].x,
              cy: V.pts[0].y,
              r: "3",
              fill: V.color
            }, null, 8, R1)) : b("", !0)
          ]))), 128)),
          R.value ? (t(), n("g", U1, [
            l("line", {
              x1: R.value.x,
              x2: R.value.x,
              y1: w.value.top,
              y2: w.value.top + $.value.h,
              stroke: "var(--muted-foreground)",
              "stroke-width": "1",
              "stroke-dasharray": "4 3"
            }, null, 8, H1),
            (t(!0), n(_, null, j(R.value.rows, (V, E) => (t(), n("circle", {
              key: `d-${E}`,
              cx: R.value.x,
              cy: V.y,
              r: "4",
              fill: V.color,
              stroke: "var(--card)",
              "stroke-width": "2"
            }, null, 8, q1))), 128))
          ])) : b("", !0),
          (t(!0), n(_, null, j(m.value, (V, E) => ge((t(), n("text", {
            key: `x-${E}`,
            x: p(E),
            y: e.height - 6,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px]"
          }, f(V), 9, K1)), [
            [Ke, H(E)]
          ])), 128))
        ], 40, P1)),
        R.value ? (t(), n("div", {
          key: 0,
          class: "bg-popover pointer-events-none absolute z-10 min-w-36 rounded-lg border p-2 shadow-lg",
          style: ie(X.value)
        }, [
          l("p", G1, f(R.value.label), 1),
          (t(!0), n(_, null, j(R.value.rows, (V, E) => (t(), n("div", {
            key: E,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", W1, f(V.name || "Value"), 1),
            l("span", Z1, f(k(V.value)), 1)
          ]))), 128))
        ], 4)) : b("", !0),
        e.showLegend && v.value.length > 1 ? (t(), n("div", J1, [
          (t(!0), n(_, null, j(M.value, (V, E) => (t(), n("span", {
            key: E,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", Y1, f(V.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), X1 = { class: "bg-popover pointer-events-none absolute top-2 left-2 z-10 rounded-lg border px-2.5 py-1.5 shadow-lg" }, eh = { class: "text-muted-foreground text-[11px] capitalize" }, th = { class: "text-sm font-semibold tabular-nums" }, nh = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, bt = /* @__PURE__ */ L({
  __name: "ChartTooltip",
  props: {
    label: {},
    value: {},
    share: { default: null }
  },
  setup(e) {
    return (o, a) => (t(), n("div", X1, [
      l("p", eh, f(e.label), 1),
      l("p", th, [
        U(f(e.value) + " ", 1),
        e.share ? (t(), n("span", nh, " (" + f(e.share) + ") ", 1)) : b("", !0)
      ])
    ]));
  }
}), ah = {
  key: 1,
  class: "relative flex flex-wrap items-center gap-4 sm:flex-nowrap"
}, lh = ["width", "height", "viewBox", "aria-label"], oh = ["d", "fill", "fill-opacity", "onMouseenter"], sh = ["x", "y"], rh = ["x", "y"], ih = { class: "flex min-w-0 flex-1 flex-col gap-0.5" }, dh = ["onMouseenter"], uh = { class: "min-w-0 flex-1 truncate capitalize" }, ch = { class: "tabular-nums font-medium" }, fh = { class: "text-muted-foreground w-9 text-right tabular-nums" }, Y6 = /* @__PURE__ */ L({
  __name: "PieChart",
  props: {
    data: {},
    height: { default: 220 },
    type: { default: "doughnut" },
    format: {}
  },
  setup(e) {
    const o = e, a = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)",
      "var(--chart-1)"
    ], r = y(() => o.data.reduce((B, A) => B + A.value, 0)), s = q(null), i = y(() => o.height), d = y(() => i.value / 2 - 4), u = y(() => o.type === "doughnut" ? d.value * 0.62 : 0);
    function c(B) {
      return a[B % a.length];
    }
    function v(B) {
      return 1 - Math.min(0.55, Math.floor(B / a.length) * 0.28);
    }
    const m = y(() => {
      if (r.value <= 0)
        return [];
      const B = i.value / 2;
      let A = -Math.PI / 2;
      return o.data.map(($, p) => {
        const g = $.value / r.value, M = g * Math.PI * 2, F = A, D = A + M;
        return A = D, {
          ...$,
          share: g,
          colour: c(p),
          opacity: v(p),
          /*
           * The 100% case. An arc from a point back to itself is degenerate
           * and SVG draws nothing, so it is expressed as two half circles.
           */
          path: g >= 0.9999 ? k(B) : w(B, F, D, d.value, u.value)
        };
      });
    });
    function h(B, A, $) {
      return `${(B + Math.cos(A) * $).toFixed(2)},${(B + Math.sin(A) * $).toFixed(2)}`;
    }
    function w(B, A, $, p, g) {
      const M = $ - A > Math.PI ? 1 : 0;
      return g <= 0 ? `M${B},${B} L${h(B, A, p)} A${p},${p} 0 ${M} 1 ${h(B, $, p)} Z` : [
        `M${h(B, A, p)}`,
        `A${p},${p} 0 ${M} 1 ${h(B, $, p)}`,
        `L${h(B, $, g)}`,
        `A${g},${g} 0 ${M} 0 ${h(B, A, g)}`,
        "Z"
      ].join(" ");
    }
    function k(B) {
      const A = d.value, $ = u.value, p = [
        `M${B - A},${B}`,
        `A${A},${A} 0 1 1 ${B + A},${B}`,
        `A${A},${A} 0 1 1 ${B - A},${B}`,
        "Z"
      ];
      return $ <= 0 ? p.join(" ") : [
        ...p,
        `M${B - $},${B}`,
        `A${$},${$} 0 1 0 ${B + $},${B}`,
        `A${$},${$} 0 1 0 ${B - $},${B}`,
        "Z"
      ].join(" ");
    }
    const S = (B) => o.format ? o.format(B) : new Intl.NumberFormat().format(B), C = (B) => `${(B * 100).toFixed(B < 0.01 ? 2 : 0)}%`;
    return (B, A) => r.value <= 0 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " No data ", 4)) : (t(), n("div", ah, [
      (t(), n("svg", {
        width: i.value,
        height: i.value,
        viewBox: `0 0 ${i.value} ${i.value}`,
        class: "shrink-0",
        role: "img",
        "aria-label": `Total ${S(r.value)}`
      }, [
        (t(!0), n(_, null, j(m.value, ($, p) => (t(), n("path", {
          key: p,
          d: $.path,
          fill: $.colour,
          "fill-opacity": s.value === null || s.value === p ? $.opacity : $.opacity * 0.35,
          "fill-rule": "evenodd",
          stroke: "var(--card)",
          "stroke-width": "2",
          class: "cursor-default transition-[fill-opacity]",
          onMouseenter: (g) => s.value = p,
          onMouseleave: A[0] || (A[0] = (g) => s.value = null)
        }, null, 40, oh))), 128)),
        e.type === "doughnut" ? (t(), n(_, { key: 0 }, [
          l("text", {
            x: i.value / 2,
            y: i.value / 2 - 2,
            "text-anchor": "middle",
            class: "fill-foreground text-base font-semibold tabular-nums"
          }, f(S(s.value === null ? r.value : m.value[s.value].value)), 9, sh),
          l("text", {
            x: i.value / 2,
            y: i.value / 2 + 14,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, f(s.value === null ? "Total" : m.value[s.value].label), 9, rh)
        ], 64)) : b("", !0)
      ], 8, lh)),
      l("ul", ih, [
        (t(!0), n(_, null, j(m.value, ($, p) => (t(), n("li", {
          key: p,
          class: z(["flex cursor-default items-center gap-2 rounded px-1.5 py-1 text-xs transition-colors", s.value === p ? "bg-muted" : ""]),
          onMouseenter: (g) => s.value = p,
          onMouseleave: A[1] || (A[1] = (g) => s.value = null)
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: $.colour, opacity: $.opacity })
          }, null, 4),
          l("span", uh, f($.label), 1),
          l("span", ch, f(S($.value)), 1),
          l("span", fh, f(C($.share)), 1)
        ], 42, dh))), 128))
      ]),
      s.value !== null && e.type === "pie" ? (t(), T(bt, {
        key: 0,
        label: m.value[s.value].label,
        value: S(m.value[s.value].value),
        share: C(m.value[s.value].share)
      }, null, 8, ["label", "value", "share"])) : b("", !0)
    ]));
  }
}), mh = ["width", "height", "viewBox", "aria-label"], ph = { class: "text-border" }, vh = ["x1", "x2", "y1", "y2", "stroke-dasharray"], gh = { class: "fill-muted-foreground text-[10px]" }, hh = ["x", "y"], bh = ["x", "y"], yh = ["cx", "cy", "r", "fill", "fill-opacity", "stroke", "opacity", "onMouseenter"], xh = {
  key: 1,
  class: "mt-2 flex flex-wrap gap-3"
}, Q6 = /* @__PURE__ */ L({
  __name: "ScatterChart",
  props: {
    data: {},
    series: {},
    height: { default: 260 },
    xLabel: {},
    yLabel: {},
    formatX: {},
    formatY: {},
    showLegend: { type: Boolean, default: !1 },
    maxRadius: { default: 22 }
  },
  setup(e) {
    const o = e, a = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)"
    ], r = q(null), s = q(560), i = q(null);
    let d = null;
    be(() => {
      d = new ResizeObserver((W) => {
        const H = W[0]?.contentRect.width ?? 0;
        H > 0 && (s.value = H);
      }), r.value && d.observe(r.value);
    }), ke(() => d?.disconnect());
    const u = y(
      () => o.series?.length ? o.series : [{ name: "", points: o.data ?? [] }]
    ), c = (W, H) => H.color ?? a[W % a.length], v = y(() => u.value.flatMap((W) => W.points)), m = y(() => v.value.some((W) => typeof W.r == "number")), h = { top: 12, right: 16, bottom: 32, left: 48 }, w = y(() => Math.max(10, s.value - h.left - h.right)), k = y(() => Math.max(10, o.height - h.top - h.bottom));
    function S(W) {
      if (W.length === 0)
        return [0, 1];
      const H = Math.min(...W), N = Math.max(...W), R = N - H || Math.abs(N) || 1;
      return [H - R * 0.08, N + R * 0.08];
    }
    const C = y(() => S(v.value.map((W) => W.x))), B = y(() => S(v.value.map((W) => W.y))), A = (W) => {
      const [H, N] = C.value;
      return h.left + (W - H) / (N - H) * w.value;
    }, $ = (W) => {
      const [H, N] = B.value;
      return h.top + k.value - (W - H) / (N - H) * k.value;
    }, p = y(() => Math.max(...v.value.map((W) => W.r ?? 0), 0));
    function g(W) {
      if (!m.value || !p.value)
        return 4;
      const H = Math.max(0, W.r ?? 0) / p.value;
      return 3 + Math.sqrt(H) * (o.maxRadius - 3);
    }
    function M([W, H]) {
      return Array.from({ length: 5 }, (N, R) => W + (H - W) / 4 * R);
    }
    const F = y(() => M(C.value)), D = y(() => M(B.value)), Y = (W) => o.formatX?.(W) ?? String(Math.round(W * 100) / 100), G = (W) => o.formatY?.(W) ?? String(Math.round(W * 100) / 100), Z = y(() => {
      if (!i.value)
        return null;
      const W = u.value[i.value.s], H = W?.points[i.value.p];
      return H ? { series: W, point: H } : null;
    });
    return (W, H) => (t(), n("div", {
      ref_key: "host",
      ref: r,
      class: "w-full"
    }, [
      (t(), n("svg", {
        width: s.value,
        height: e.height,
        viewBox: `0 0 ${s.value} ${e.height}`,
        class: "overflow-visible",
        role: "img",
        "aria-label": m.value ? "Bubble chart" : "Scatter chart"
      }, [
        l("g", ph, [
          (t(!0), n(_, null, j(D.value, (N, R) => (t(), n("line", {
            key: `gy-${R}`,
            x1: h.left,
            x2: h.left + w.value,
            y1: $(N),
            y2: $(N),
            stroke: "currentColor",
            "stroke-width": "1",
            "stroke-dasharray": R === 0 ? "0" : "3 3",
            opacity: "0.5"
          }, null, 8, vh))), 128))
        ]),
        l("g", gh, [
          (t(!0), n(_, null, j(D.value, (N, R) => (t(), n("text", {
            key: `ty-${R}`,
            x: h.left - 8,
            y: $(N) + 3,
            "text-anchor": "end"
          }, f(G(N)), 9, hh))), 128)),
          (t(!0), n(_, null, j(F.value, (N, R) => (t(), n("text", {
            key: `tx-${R}`,
            x: A(N),
            y: e.height - 10,
            "text-anchor": "middle"
          }, f(Y(N)), 9, bh))), 128))
        ]),
        (t(!0), n(_, null, j(u.value, (N, R) => (t(), n("g", {
          key: `s-${R}`
        }, [
          (t(!0), n(_, null, j(N.points, (X, P) => (t(), n("circle", {
            key: `p-${R}-${P}`,
            cx: A(X.x),
            cy: $(X.y),
            r: g(X),
            fill: c(R, N),
            "fill-opacity": m.value ? 0.55 : 0.85,
            stroke: c(R, N),
            "stroke-width": "1.5",
            class: "cursor-pointer transition-opacity",
            opacity: i.value && (i.value.s !== R || i.value.p !== P) ? 0.35 : 1,
            onMouseenter: (J) => i.value = { s: R, p: P },
            onMouseleave: H[0] || (H[0] = (J) => i.value = null)
          }, null, 40, yh))), 128))
        ]))), 128))
      ], 8, mh)),
      Z.value ? (t(), T(bt, {
        key: 0,
        label: Z.value.point.label ?? Z.value.series.name ?? "Point",
        value: `${e.xLabel ? e.xLabel + " " : ""}${Y(Z.value.point.x)} · ${e.yLabel ? e.yLabel + " " : ""}${G(Z.value.point.y)}`,
        share: m.value && Z.value.point.r != null ? String(Z.value.point.r) : null
      }, null, 8, ["label", "value", "share"])) : b("", !0),
      e.showLegend && u.value.length > 1 ? (t(), n("div", xh, [
        (t(!0), n(_, null, j(u.value, (N, R) => (t(), n("span", {
          key: `l-${R}`,
          class: "text-muted-foreground flex items-center gap-1.5 text-xs"
        }, [
          l("span", {
            class: "size-2.5 rounded-full",
            style: ie({ backgroundColor: c(R, N) }),
            "aria-hidden": "true"
          }, null, 4),
          U(" " + f(N.name), 1)
        ]))), 128))
      ])) : b("", !0)
    ], 512));
  }
}), kh = {
  key: 1,
  class: "relative flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap"
}, $h = ["width", "height", "viewBox"], wh = ["points"], Ch = ["x1", "y1", "x2", "y2"], Sh = ["points", "fill", "stroke"], Mh = ["cx", "cy", "fill", "onMouseenter"], Bh = ["x", "y", "text-anchor"], Ah = {
  key: 0,
  class: "flex min-w-0 flex-col gap-1.5"
}, zh = { class: "truncate" }, X6 = /* @__PURE__ */ L({
  __name: "RadarChart",
  props: {
    series: {},
    height: { default: 240 },
    format: {},
    showLegend: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)"
    ], r = y(
      () => o.series.map(($, p) => ({
        ...$,
        color: $.color ?? a[p % a.length]
      }))
    ), s = y(() => r.value[0]?.points.map(($) => $.label) ?? []), i = y(() => s.value.length), d = y(() => o.height), u = y(() => d.value / 2), c = y(() => d.value / 2 - 34), v = y(() => {
      const $ = Math.max(...r.value.flatMap((M) => M.points.map((F) => F.value)), 0);
      if ($ <= 0)
        return 1;
      const p = 10 ** Math.floor(Math.log10($));
      return ([1, 2, 2.5, 5, 10].find((M) => $ <= M * p) ?? 10) * p;
    });
    function m($) {
      return $ / i.value * Math.PI * 2 - Math.PI / 2;
    }
    function h($, p) {
      const g = m($);
      return {
        x: u.value + Math.cos(g) * c.value * p,
        y: u.value + Math.sin(g) * c.value * p
      };
    }
    function w($) {
      return Array.from({ length: i.value }, (p, g) => {
        const M = h(g, $);
        return `${M.x.toFixed(2)},${M.y.toFixed(2)}`;
      }).join(" ");
    }
    const k = y(() => [0.25, 0.5, 0.75, 1].map(($) => ({ f: $, points: w($) }))), S = y(
      () => r.value.map(($) => {
        const p = $.points.map((g) => Math.max(0, g.value) / v.value);
        return {
          name: $.name,
          color: $.color,
          values: $.points,
          outline: p.map((g, M) => {
            const F = h(M, g);
            return `${F.x.toFixed(2)},${F.y.toFixed(2)}`;
          }).join(" "),
          dots: p.map((g, M) => h(M, g))
        };
      })
    ), C = y(
      () => s.value.map(($, p) => {
        const g = m(p), M = u.value + Math.cos(g) * (c.value + 14), F = u.value + Math.sin(g) * (c.value + 14), D = Math.cos(g);
        return {
          label: $,
          x: M,
          y: F + 3,
          anchor: Math.abs(D) < 0.2 ? "middle" : D > 0 ? "start" : "end"
        };
      })
    ), B = q(null), A = ($) => o.format ? o.format($) : new Intl.NumberFormat().format($);
    return ($, p) => i.value < 3 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " A radar needs at least three axes ", 4)) : (t(), n("div", kh, [
      (t(), n("svg", {
        width: d.value,
        height: d.value,
        viewBox: `0 0 ${d.value} ${d.value}`,
        class: "shrink-0"
      }, [
        (t(!0), n(_, null, j(k.value, (g) => (t(), n("polygon", {
          key: g.f,
          points: g.points,
          fill: "none",
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, wh))), 128)),
        (t(!0), n(_, null, j(s.value, (g, M) => (t(), n("line", {
          key: `spoke-${M}`,
          x1: u.value,
          y1: u.value,
          x2: h(M, 1).x,
          y2: h(M, 1).y,
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, Ch))), 128)),
        (t(!0), n(_, null, j(S.value, (g, M) => (t(), n("g", {
          key: `s-${M}`
        }, [
          l("polygon", {
            points: g.outline,
            fill: g.color,
            "fill-opacity": "0.16",
            stroke: g.color,
            "stroke-width": "2"
          }, null, 8, Sh),
          (t(!0), n(_, null, j(g.dots, (F, D) => (t(), n("circle", {
            key: D,
            cx: F.x,
            cy: F.y,
            r: "3",
            fill: g.color,
            stroke: "var(--card)",
            "stroke-width": "1.5",
            class: "cursor-default",
            onMouseenter: (Y) => B.value = {
              series: g.name,
              axis: s.value[D],
              value: g.values[D]?.value ?? 0
            },
            onMouseleave: p[0] || (p[0] = (Y) => B.value = null)
          }, null, 40, Mh))), 128))
        ]))), 128)),
        (t(!0), n(_, null, j(C.value, (g, M) => (t(), n("text", {
          key: `l-${M}`,
          x: g.x,
          y: g.y,
          "text-anchor": g.anchor,
          class: "fill-muted-foreground text-[10px] capitalize"
        }, f(g.label), 9, Bh))), 128))
      ], 8, $h)),
      e.showLegend ? (t(), n("ul", Ah, [
        (t(!0), n(_, null, j(r.value, (g, M) => (t(), n("li", {
          key: M,
          class: "flex items-center gap-2 text-xs"
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: g.color })
          }, null, 4),
          l("span", zh, f(g.name), 1)
        ]))), 128))
      ])) : b("", !0),
      B.value ? (t(), T(bt, {
        key: 1,
        label: `${B.value.series} — ${B.value.axis}`,
        value: A(B.value.value)
      }, null, 8, ["label", "value"])) : b("", !0)
    ]));
  }
}), _h = {
  key: 1,
  class: "relative flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap"
}, Ph = ["width", "height", "viewBox"], Lh = ["cx", "cy", "r"], Oh = ["d", "fill", "fill-opacity", "onMouseenter"], jh = {
  key: 0,
  class: "flex min-w-0 flex-col gap-1.5"
}, Vh = { class: "min-w-0 flex-1 truncate capitalize" }, Dh = { class: "font-medium tabular-nums" }, eS = /* @__PURE__ */ L({
  __name: "PolarAreaChart",
  props: {
    data: {},
    height: { default: 240 },
    format: {},
    showLegend: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)",
      "var(--chart-1)"
    ], r = q(null), s = y(() => o.height), i = y(() => s.value / 2), d = y(() => s.value / 2 - 6), u = y(() => Math.max(...o.data.map((w) => Math.max(0, w.value)), 0)), c = y(() => {
      const w = o.data.length;
      if (w === 0 || u.value <= 0)
        return [];
      const k = Math.PI * 2 / w;
      return o.data.map((S, C) => {
        const B = Math.sqrt(Math.max(0, S.value) / u.value), A = d.value * B, $ = C * k - Math.PI / 2, p = $ + k;
        return {
          ...S,
          color: a[C % a.length],
          share: u.value === 0 ? 0 : S.value / u.value,
          path: v(i.value, $, p, A)
        };
      });
    });
    function v(w, k, S, C) {
      if (C <= 0)
        return "";
      if (S - k >= Math.PI * 2 - 1e-6)
        return `M${w - C},${w} A${C},${C} 0 1 1 ${w + C},${w} A${C},${C} 0 1 1 ${w - C},${w} Z`;
      const B = S - k > Math.PI ? 1 : 0, A = w + Math.cos(k) * C, $ = w + Math.sin(k) * C, p = w + Math.cos(S) * C, g = w + Math.sin(S) * C;
      return `M${w},${w} L${A.toFixed(2)},${$.toFixed(2)} A${C.toFixed(2)},${C.toFixed(2)} 0 ${B} 1 ${p.toFixed(2)},${g.toFixed(2)} Z`;
    }
    const m = y(() => [0.5, 0.75, 1].map((w) => d.value * w)), h = (w) => o.format ? o.format(w) : new Intl.NumberFormat().format(w);
    return (w, k) => c.value.length === 0 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " No data ", 4)) : (t(), n("div", _h, [
      (t(), n("svg", {
        width: s.value,
        height: s.value,
        viewBox: `0 0 ${s.value} ${s.value}`,
        class: "shrink-0"
      }, [
        (t(!0), n(_, null, j(m.value, (S) => (t(), n("circle", {
          key: S,
          cx: i.value,
          cy: i.value,
          r: S,
          fill: "none",
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, Lh))), 128)),
        (t(!0), n(_, null, j(c.value, (S, C) => (t(), n("path", {
          key: C,
          d: S.path,
          fill: S.color,
          stroke: "var(--card)",
          "stroke-width": "1.5",
          class: "cursor-default transition-opacity",
          "fill-opacity": r.value === null || r.value === C ? 0.75 : 0.3,
          onMouseenter: (B) => r.value = C,
          onMouseleave: k[0] || (k[0] = (B) => r.value = null)
        }, null, 40, Oh))), 128))
      ], 8, Ph)),
      e.showLegend ? (t(), n("ul", jh, [
        (t(!0), n(_, null, j(c.value, (S, C) => (t(), n("li", {
          key: C,
          class: "flex items-center gap-2 text-xs"
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: S.color })
          }, null, 4),
          l("span", Vh, f(S.label), 1),
          l("span", Dh, f(h(S.value)), 1)
        ]))), 128))
      ])) : b("", !0),
      r.value !== null ? (t(), T(bt, {
        key: 1,
        label: c.value[r.value].label,
        value: h(c.value[r.value].value)
      }, null, 8, ["label", "value"])) : b("", !0)
    ]));
  }
}), Th = ["width", "height"], Ih = ["x1", "x2", "y1", "y2"], Eh = ["x", "y"], Fh = ["x", "y"], Nh = ["x", "y", "width", "height", "fill-opacity", "onMouseenter"], Rh = ["x", "y", "width", "height", "fill", "fill-opacity"], Uh = ["d", "stroke"], Hh = ["cx", "cy", "fill"], qh = ["x", "y"], Kh = {
  key: 0,
  class: "bg-popover pointer-events-none absolute top-2 right-2 z-10 min-w-36 rounded-lg border p-2 shadow-lg"
}, Gh = { class: "text-muted-foreground mb-1 text-[11px] capitalize" }, Wh = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, Zh = { class: "text-xs font-semibold tabular-nums" }, Jh = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, Yh = { class: "text-muted-foreground" }, tS = /* @__PURE__ */ L({
  __name: "ComboChart",
  props: {
    bars: {},
    lines: {},
    height: { default: 240 },
    lineAxis: { default: "left" },
    format: {},
    showLegend: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = q(null), r = q(560), s = q(null);
    let i = null;
    be(() => {
      i = new ResizeObserver((R) => {
        r.value = Math.max(160, R[0].contentRect.width);
      }), a.value && i.observe(a.value);
    }), ke(() => i?.disconnect());
    const d = ["var(--chart-2)", "var(--chart-4)", "var(--chart-3)"], u = ["var(--primary)", "var(--chart-5)"], c = y(
      () => o.bars.map((R, X) => ({
        ...R,
        color: R.color ?? d[X % d.length]
      }))
    ), v = y(
      () => o.lines.map((R, X) => ({
        ...R,
        color: R.color ?? u[X % u.length]
      }))
    ), m = y(
      () => c.value[0]?.points.map((R) => R.label) ?? v.value[0]?.points.map((R) => R.label) ?? []
    ), h = y(() => m.value.length), w = y(() => o.lineAxis === "right"), k = y(() => ({
      top: 12,
      right: w.value ? 44 : 12,
      bottom: 26,
      left: 44
    })), S = y(() => ({
      w: Math.max(1, r.value - k.value.left - k.value.right),
      h: Math.max(1, o.height - k.value.top - k.value.bottom)
    }));
    function C(R) {
      const X = Math.max(...R, 0);
      if (X <= 0)
        return 1;
      const P = 10 ** Math.floor(Math.log10(X));
      return ([1, 2, 2.5, 5, 10].find((V) => X <= V * P) ?? 10) * P;
    }
    const B = y(
      () => C([
        ...c.value.flatMap((R) => R.points.map((X) => X.value)),
        ...w.value ? [] : v.value.flatMap((R) => R.points.map((X) => X.value))
      ])
    ), A = y(
      () => w.value ? C(v.value.flatMap((R) => R.points.map((X) => X.value))) : B.value
    ), $ = y(() => S.value.w / Math.max(1, h.value)), p = y(() => $.value * 0.6), g = y(() => p.value / Math.max(1, c.value.length));
    function M(R) {
      return k.value.left + R * $.value + $.value / 2;
    }
    const F = y(
      () => c.value.flatMap(
        (R, X) => R.points.map((P, J) => {
          const V = Math.max(0, P.value) / B.value * S.value.h;
          return {
            x: M(J) - p.value / 2 + X * g.value,
            y: k.value.top + S.value.h - V,
            w: Math.max(0, g.value - 2),
            h: V,
            color: R.color,
            index: J,
            name: R.name,
            value: P.value,
            label: P.label
          };
        })
      )
    ), D = y(
      () => v.value.map((R) => {
        const X = R.points.map((P, J) => ({
          x: M(J),
          y: k.value.top + S.value.h - Math.max(0, P.value) / A.value * S.value.h,
          value: P.value
        }));
        return {
          ...R,
          pts: X,
          d: X.map((P, J) => `${J === 0 ? "M" : "L"}${P.x.toFixed(2)},${P.y.toFixed(2)}`).join(" ")
        };
      })
    ), Y = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((R) => ({
        y: k.value.top + S.value.h * R,
        left: B.value * (1 - R),
        right: A.value * (1 - R)
      }))
    ), G = y(() => Math.max(1, Math.ceil(h.value / 10)));
    function Z(R) {
      return R === h.value - 1 || R % G.value === 0;
    }
    const W = (R) => o.format ? o.format(R) : H(R);
    function H(R) {
      return Math.abs(R) >= 1e6 ? `${(R / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(R) >= 1e3 ? `${(R / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(R * 100) / 100);
    }
    const N = y(() => {
      if (s.value === null)
        return null;
      const R = s.value;
      return {
        label: m.value[R],
        rows: [
          ...c.value.map((X) => ({
            name: X.name,
            color: X.color,
            value: X.points[R]?.value ?? 0
          })),
          ...v.value.map((X) => ({
            name: X.name,
            color: X.color,
            value: X.points[R]?.value ?? 0
          }))
        ]
      };
    });
    return (R, X) => (t(), n("div", {
      ref_key: "host",
      ref: a,
      class: "relative w-full"
    }, [
      h.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(_, { key: 1 }, [
        (t(), n("svg", {
          width: r.value,
          height: e.height,
          class: "overflow-visible",
          onMouseleave: X[0] || (X[0] = (P) => s.value = null)
        }, [
          (t(!0), n(_, null, j(Y.value, (P) => (t(), n("line", {
            key: `g-${P.y}`,
            x1: k.value.left,
            x2: r.value - k.value.right,
            y1: P.y,
            y2: P.y,
            stroke: "var(--border)",
            "stroke-width": "1"
          }, null, 8, Ih))), 128)),
          (t(!0), n(_, null, j(Y.value, (P) => (t(), n("text", {
            key: `lt-${P.y}`,
            x: k.value.left - 8,
            y: P.y + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[10px] tabular-nums"
          }, f(H(P.left)), 9, Eh))), 128)),
          w.value ? (t(!0), n(_, { key: 0 }, j(Y.value, (P) => (t(), n("text", {
            key: `rt-${P.y}`,
            x: r.value - k.value.right + 8,
            y: P.y + 3,
            "text-anchor": "start",
            class: "fill-muted-foreground text-[10px] tabular-nums"
          }, f(H(P.right)), 9, Fh))), 128)) : b("", !0),
          (t(!0), n(_, null, j(m.value, (P, J) => (t(), n("rect", {
            key: `hit-${J}`,
            x: k.value.left + J * $.value,
            y: k.value.top,
            width: $.value,
            height: S.value.h,
            fill: "var(--muted)",
            "fill-opacity": s.value === J ? 0.4 : 0,
            onMouseenter: (V) => s.value = J
          }, null, 40, Nh))), 128)),
          (t(!0), n(_, null, j(F.value, (P, J) => (t(), n("rect", {
            key: `b-${J}`,
            x: P.x,
            y: P.y,
            width: P.w,
            height: P.h,
            fill: P.color,
            "fill-opacity": s.value === null || s.value === P.index ? 0.85 : 0.3,
            rx: "3",
            "pointer-events": "none"
          }, null, 8, Rh))), 128)),
          (t(!0), n(_, null, j(D.value, (P, J) => (t(), n("g", {
            key: `l-${J}`
          }, [
            l("path", {
              d: P.d,
              fill: "none",
              stroke: P.color,
              "stroke-width": "2.5",
              "stroke-linejoin": "round",
              "stroke-linecap": "round",
              "pointer-events": "none"
            }, null, 8, Uh),
            s.value !== null && P.pts[s.value] ? (t(), n("circle", {
              key: 0,
              cx: P.pts[s.value].x,
              cy: P.pts[s.value].y,
              r: "4",
              fill: P.color,
              stroke: "var(--card)",
              "stroke-width": "2",
              "pointer-events": "none"
            }, null, 8, Hh)) : b("", !0)
          ]))), 128)),
          (t(!0), n(_, null, j(m.value, (P, J) => ge((t(), n("text", {
            key: `x-${J}`,
            x: M(J),
            y: e.height - 8,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, f(P), 9, qh)), [
            [Ke, Z(J)]
          ])), 128))
        ], 40, Th)),
        N.value ? (t(), n("div", Kh, [
          l("p", Gh, f(N.value.label), 1),
          (t(!0), n(_, null, j(N.value.rows, (P, J) => (t(), n("div", {
            key: J,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: P.color })
            }, null, 4),
            l("span", Wh, f(P.name), 1),
            l("span", Zh, f(W(P.value)), 1)
          ]))), 128))
        ])) : b("", !0),
        e.showLegend ? (t(), n("div", Jh, [
          (t(!0), n(_, null, j([...c.value, ...v.value], (P, J) => (t(), n("span", {
            key: J,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: P.color })
            }, null, 4),
            l("span", Yh, f(P.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), Qh = { class: "mb-3 flex flex-wrap items-center justify-center gap-3" }, Xh = { class: "text-muted-foreground" }, eb = {
  key: 0,
  class: "text-muted-foreground mb-2 text-center text-xs"
}, tb = ["width", "height"], nb = ["x", "y"], ab = ["x", "y", "width", "height", "fill", "fill-opacity", "onMouseenter"], lb = ["x", "y"], ob = {
  key: 1,
  class: "bg-popover pointer-events-none absolute top-0 right-0 z-10 rounded-lg border px-2.5 py-1.5 shadow-lg"
}, sb = { class: "text-[11px] font-medium capitalize" }, rb = { class: "text-muted-foreground text-[11px] capitalize" }, ib = { class: "text-sm font-semibold tabular-nums" }, db = { class: "text-muted-foreground text-xs font-normal" }, nS = /* @__PURE__ */ L({
  __name: "HeatmapChart",
  props: {
    series: {},
    buckets: { default: () => [
      { max: 1, label: "0" },
      { max: 11, label: "1-10" },
      { max: 31, label: "11-30" },
      { max: 61, label: "31-60" },
      { label: "61+" }
    ] },
    height: { default: 240 },
    format: {},
    showColumnLabels: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = q(null), r = q(560), s = q(null);
    let i = null;
    be(() => {
      i = new ResizeObserver((p) => {
        r.value = Math.max(160, p[0].contentRect.width);
      }), a.value && i.observe(a.value);
    }), ke(() => i?.disconnect());
    const d = y(() => o.series[0]?.points.map((p) => p.label) ?? []), u = y(() => o.series.length), c = y(() => d.value.length), v = y(() => Math.min(140, Math.max(60, r.value * 0.16))), m = y(() => Math.max(1, r.value - v.value - 8)), h = y(() => m.value / Math.max(1, c.value)), w = y(() => Math.max(1, (o.height - 8) / Math.max(1, u.value)));
    function k(p) {
      if (p === 0)
        return "var(--muted)";
      const g = Math.max(1, o.buckets.length - 1);
      return `color-mix(in oklch, var(--primary) ${Math.round(p / g * 100)}%, var(--muted))`;
    }
    function S(p) {
      for (let g = 0; g < o.buckets.length; g++) {
        const M = o.buckets[g].max;
        if (M === void 0 || p < M)
          return g;
      }
      return o.buckets.length - 1;
    }
    const C = y(
      () => o.series.flatMap(
        (p, g) => p.points.map((M, F) => {
          const D = S(M.value);
          return {
            row: g,
            col: F,
            x: v.value + F * h.value,
            y: 4 + g * w.value,
            w: Math.max(1, h.value - 1),
            h: Math.max(1, w.value - 4),
            colour: k(D),
            label: M.label,
            value: M.value,
            rowName: p.name,
            bucketLabel: o.buckets[D].label
          };
        })
      )
    ), B = y(() => h.value < 2), A = y(() => s.value ? C.value.find((p) => p.row === s.value.row && p.col === s.value.col) ?? null : null), $ = (p) => o.format ? o.format(p) : new Intl.NumberFormat().format(p);
    return (p, g) => (t(), n("div", {
      ref_key: "host",
      ref: a,
      class: "relative w-full"
    }, [
      u.value === 0 || c.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(_, { key: 1 }, [
        l("div", Qh, [
          (t(!0), n(_, null, j(e.buckets, (M, F) => (t(), n("span", {
            key: F,
            class: "flex items-center gap-1.5 text-[11px]"
          }, [
            l("span", {
              class: "size-3 rounded-sm border",
              style: ie({ background: k(F) })
            }, null, 4),
            l("span", Xh, f(M.label), 1)
          ]))), 128))
        ]),
        B.value ? (t(), n("p", eb, f(c.value) + " columns - too many to label individually ", 1)) : b("", !0),
        (t(), n("svg", {
          width: r.value,
          height: e.height,
          class: "overflow-visible",
          onMouseleave: g[0] || (g[0] = (M) => s.value = null)
        }, [
          (t(!0), n(_, null, j(e.series, (M, F) => (t(), n("text", {
            key: `r-${F}`,
            x: v.value - 10,
            y: 4 + F * w.value + w.value / 2 + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[11px] capitalize"
          }, f(M.name), 9, nb))), 128)),
          (t(!0), n(_, null, j(C.value, (M, F) => (t(), n("rect", {
            key: F,
            x: M.x,
            y: M.y,
            width: M.w,
            height: M.h,
            fill: M.colour,
            "fill-opacity": s.value === null || s.value.row === M.row && s.value.col === M.col ? 1 : 0.55,
            rx: "1",
            class: "transition-[fill-opacity]",
            onMouseenter: (D) => s.value = { row: M.row, col: M.col }
          }, null, 40, ab))), 128)),
          e.showColumnLabels && !B.value ? (t(!0), n(_, { key: 0 }, j(d.value, (M, F) => (t(), n("text", {
            key: `c-${F}`,
            x: v.value + F * h.value + h.value / 2,
            y: e.height - 2,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[9px]"
          }, f(M), 9, lb))), 128)) : b("", !0)
        ], 40, tb)),
        A.value ? (t(), n("div", ob, [
          l("p", sb, f(A.value.label), 1),
          l("p", rb, f(A.value.rowName), 1),
          l("p", ib, [
            U(f($(A.value.value)) + " ", 1),
            l("span", db, "(" + f(A.value.bucketLabel) + ")", 1)
          ])
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), ub = ["viewBox"], cb = { key: 0 }, fb = ["id"], mb = ["stop-color"], pb = ["stop-color"], vb = ["d", "fill"], gb = ["d", "stroke"], _n = 100, it = 30, Ot = /* @__PURE__ */ L({
  __name: "Sparkline",
  props: {
    data: {},
    height: { default: 32 },
    color: { default: "var(--primary)" },
    filled: { type: Boolean, default: !1 },
    smooth: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = Math.random().toString(36).slice(2, 9), r = y(() => {
      const u = o.data.map((h) => h.value);
      if (u.length < 2)
        return [];
      const c = Math.min(...u), m = Math.max(...u) - c || 1;
      return u.map((h, w) => ({
        x: w / (u.length - 1) * _n,
        y: it - (h - c) / m * (it - 4) - 2
      }));
    });
    function s(u) {
      const c = u.length;
      if (c < 2)
        return "";
      const v = [], m = [];
      for (let k = 0; k < c - 1; k++)
        v[k] = u[k + 1].x - u[k].x, m[k] = v[k] === 0 ? 0 : (u[k + 1].y - u[k].y) / v[k];
      const h = [m[0]];
      for (let k = 1; k < c - 1; k++)
        if (m[k - 1] * m[k] <= 0)
          h[k] = 0;
        else {
          const S = 2 * v[k] + v[k - 1], C = v[k] + 2 * v[k - 1];
          h[k] = (S + C) / (S / m[k - 1] + C / m[k]);
        }
      h[c - 1] = m[c - 2];
      let w = `M${u[0].x.toFixed(2)},${u[0].y.toFixed(2)}`;
      for (let k = 0; k < c - 1; k++) {
        const S = v[k] / 3;
        w += ` C${(u[k].x + S).toFixed(2)},${(u[k].y + h[k] * S).toFixed(2)} ${(u[k + 1].x - S).toFixed(2)},${(u[k + 1].y - h[k + 1] * S).toFixed(2)} ${u[k + 1].x.toFixed(2)},${u[k + 1].y.toFixed(2)}`;
      }
      return w;
    }
    const i = y(() => {
      const u = r.value;
      return u.length < 2 ? "" : o.smooth ? s(u) : u.map((c, v) => `${v === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(" ");
    }), d = y(() => {
      const u = r.value;
      return !o.filled || u.length < 2 ? "" : `${i.value} L${u[u.length - 1].x.toFixed(2)},${it} L${u[0].x.toFixed(2)},${it} Z`;
    });
    return (u, c) => i.value ? (t(), n("svg", {
      key: 0,
      viewBox: `0 0 ${_n} ${it}`,
      preserveAspectRatio: "none",
      class: "w-full",
      style: ie({ height: `${e.height}px` }),
      "aria-hidden": "true"
    }, [
      e.filled ? (t(), n("defs", cb, [
        l("linearGradient", {
          id: `pk-spark-${x(a)}`,
          x1: "0",
          y1: "0",
          x2: "0",
          y2: "1"
        }, [
          l("stop", {
            offset: "0%",
            "stop-color": e.color,
            "stop-opacity": "0.35"
          }, null, 8, mb),
          l("stop", {
            offset: "100%",
            "stop-color": e.color,
            "stop-opacity": "0"
          }, null, 8, pb)
        ], 8, fb)
      ])) : b("", !0),
      e.filled ? (t(), n("path", {
        key: 1,
        d: d.value,
        fill: `url(#pk-spark-${x(a)})`
      }, null, 8, vb)) : b("", !0),
      l("path", {
        d: i.value,
        fill: "none",
        stroke: e.color,
        "stroke-width": "1.5",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "vector-effect": "non-scaling-stroke"
      }, null, 8, gb)
    ], 12, ub)) : b("", !0);
  }
}), hb = { class: "flex items-center gap-1 text-xs" }, bb = {
  "aria-hidden": "true",
  class: "text-[9px]"
}, yb = {
  key: 0,
  class: "text-muted-foreground truncate"
}, da = /* @__PURE__ */ L({
  __name: "TrendBadge",
  props: {
    direction: {},
    percentage: {},
    comparison: {},
    inverted: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = y(() => o.direction === "flat" ? null : o.direction === "new" ? !o.inverted : o.inverted ? o.direction === "down" : o.direction === "up"), r = y(
      () => a.value === null ? "text-muted-foreground" : a.value ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
    ), s = y(
      () => o.direction === "flat" ? "→" : o.direction === "down" ? "▼" : "▲"
    ), i = y(() => o.direction === "new" ? "New" : o.percentage === null ? "-" : `${Math.abs(o.percentage)}%`);
    return (d, u) => (t(), n("span", hb, [
      l("span", {
        class: z(["flex items-center gap-0.5 font-medium tabular-nums", r.value])
      }, [
        l("span", bb, f(s.value), 1),
        U(" " + f(i.value), 1)
      ], 2),
      e.comparison ? (t(), n("span", yb, f(e.comparison), 1)) : b("", !0)
    ]));
  }
}), xb = ["data-collapsed", "aria-busy"], kb = { class: "flex flex-wrap items-start justify-between gap-2" }, $b = { class: "flex min-w-0 items-start gap-2" }, wb = {
  key: 0,
  class: "text-muted-foreground mt-0.5 size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Cb = ["d"], Sb = { class: "min-w-0" }, Mb = { class: "text-sm font-medium" }, Bb = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, Ab = { class: "flex shrink-0 items-center gap-1.5" }, zb = {
  key: 0,
  class: "bg-muted/60 flex items-center gap-0.5 rounded-md p-0.5",
  role: "group",
  "aria-label": "Period"
}, _b = ["aria-pressed", "onClick"], Pb = ["aria-expanded", "aria-label", "title"], Lb = ["aria-label"], Ob = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, jb = ["d"], Vb = /* @__PURE__ */ L({
  __name: "ChartCard",
  props: {
    label: {},
    description: { default: null },
    periods: { default: null },
    period: {},
    loading: { type: Boolean, default: !1 },
    error: { type: Boolean, default: !1 },
    retryable: { type: Boolean, default: !1 },
    bodyHeight: { default: 220 },
    fitBody: { type: Boolean, default: !1 },
    collapsible: { type: Boolean, default: !0 },
    defaultCollapsed: { type: Boolean, default: !1 },
    hideable: { type: Boolean, default: !1 },
    icon: { default: null }
  },
  emits: ["update:period", "hide", "retry"],
  setup(e) {
    const o = e, a = Yt(), r = q(o.defaultCollapsed), s = y(() => !!o.icon && !a.icon), i = y(() => {
      if (!(o.fitBody && !o.loading && !o.error))
        return { minHeight: `${o.bodyHeight}px` };
    });
    return (d, u) => (t(), n("div", {
      class: z(["@container/card bg-card flex w-full flex-col self-start rounded-lg border", r.value ? "px-4 py-2" : "gap-3 p-4"]),
      "data-slot": "chart-card",
      "data-collapsed": r.value ? "true" : "false",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      l("div", kb, [
        l("div", $b, [
          K(d.$slots, "icon", {}, () => [
            s.value ? (t(), n("svg", wb, [
              l("path", {
                d: x(me)(e.icon)
              }, null, 8, Cb)
            ])) : b("", !0)
          ]),
          l("div", Sb, [
            l("p", Mb, f(e.label), 1),
            e.description ? (t(), n("p", Bb, f(e.description), 1)) : b("", !0),
            K(d.$slots, "trend")
          ])
        ]),
        l("div", Ab, [
          K(d.$slots, "actions"),
          e.periods && e.periods.length ? (t(), n("div", zb, [
            (t(!0), n(_, null, j(e.periods, (c) => (t(), n("button", {
              key: c.value,
              type: "button",
              class: z([
                "rounded px-2 py-1 text-xs transition-colors",
                e.period === c.value ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
              ]),
              "aria-pressed": e.period === c.value,
              onClick: (v) => d.$emit("update:period", c.value)
            }, f(c.label), 11, _b))), 128))
          ])) : b("", !0),
          e.collapsible ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-expanded": !r.value,
            "aria-label": r.value ? `Expand ${e.label}` : `Collapse ${e.label}`,
            title: r.value ? "Expand" : "Collapse",
            onClick: u[0] || (u[0] = (c) => r.value = !r.value)
          }, [
            (t(), n("svg", {
              class: z(["size-4 transition-transform", r.value ? "" : "rotate-180"]),
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "aria-hidden": "true"
            }, [...u[3] || (u[3] = [
              l("path", { d: "m6 9 6 6 6-6" }, null, -1)
            ])], 2))
          ], 8, Pb)) : b("", !0),
          e.hideable ? (t(), n("button", {
            key: 2,
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-label": `Hide ${e.label}`,
            title: "Hide",
            onClick: u[1] || (u[1] = (c) => d.$emit("hide"))
          }, [
            (t(), n("svg", Ob, [
              l("path", {
                d: x(me)("eye-off")
              }, null, 8, jb)
            ]))
          ], 8, Lb)) : b("", !0)
        ])
      ]),
      r.value ? b("", !0) : (t(), n("div", {
        key: 0,
        style: ie(i.value),
        class: "flex flex-col justify-center",
        "data-slot": "chart-card-body"
      }, [
        e.loading ? (t(), T(Pe, {
          key: 0,
          variant: "block",
          height: e.bodyHeight
        }, null, 8, ["height"])) : e.error ? (t(), n("p", {
          key: 1,
          class: "text-destructive flex flex-col items-center justify-center gap-3 text-sm",
          style: ie({ height: `${e.bodyHeight}px` }),
          role: "alert"
        }, [
          u[4] || (u[4] = U(" Could not load ", -1)),
          e.retryable ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            onClick: u[2] || (u[2] = (c) => d.$emit("retry"))
          }, " Try again ")) : b("", !0)
        ], 4)) : K(d.$slots, "default", {}, void 0, void 0, 2)
      ], 4))
    ], 10, xb));
  }
}), Db = ["aria-pressed", "aria-label", "title"], Tb = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Ib = ["d"], Eb = {
  key: 0,
  class: "flex flex-col items-start gap-2 py-1",
  "data-slot": "shortcuts-empty"
}, Fb = {
  key: 1,
  class: "flex flex-wrap items-center gap-x-5 gap-y-2"
}, Nb = ["href"], Rb = {
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Ub = ["d"], Hb = ["aria-label", "onClick"], qb = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Kb = ["d"], Gb = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Wb = ["d"], Zb = {
  key: 0,
  class: "flex flex-col gap-1"
}, Jb = ["onClick"], Yb = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Qb = ["d"], Xb = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, ey = /* @__PURE__ */ L({
  __name: "ShortcutsWidget",
  props: {
    items: {},
    catalog: {},
    hideable: { type: Boolean, default: !1 }
  },
  emits: ["update:items", "hide"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(!1), i = q(!1), d = y(
      () => a.catalog.filter((v) => !a.items.some((m) => m.id === v.id))
    );
    function u(v) {
      r(
        "update:items",
        a.items.filter((m) => m.id !== v)
      );
    }
    function c(v) {
      r("update:items", [...a.items, v]), i.value = !1;
    }
    return (v, m) => (t(), n(_, null, [
      I(Vb, {
        label: "Shortcuts",
        icon: "star",
        hideable: e.hideable,
        "fit-body": !0,
        "body-height": 72,
        onHide: m[3] || (m[3] = (h) => r("hide"))
      }, {
        actions: O(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-pressed": s.value,
            "aria-label": s.value ? "Done editing shortcuts" : "Edit shortcuts",
            title: s.value ? "Done" : "Edit",
            onClick: m[0] || (m[0] = (h) => s.value = !s.value)
          }, [
            (t(), n("svg", Tb, [
              l("path", {
                d: x(me)(s.value ? "check" : "pencil")
              }, null, 8, Ib)
            ]))
          ], 8, Db)
        ]),
        default: O(() => [
          e.items.length === 0 ? (t(), n("div", Eb, [
            m[7] || (m[7] = l("p", { class: "text-muted-foreground text-sm font-normal" }, "No shortcuts yet.", -1)),
            I(ce, {
              size: "sm",
              variant: "outline",
              onClick: m[1] || (m[1] = (h) => i.value = !0)
            }, {
              default: O(() => [...m[6] || (m[6] = [
                U("Add shortcut", -1)
              ])]),
              _: 1
            })
          ])) : (t(), n("div", Fb, [
            (t(!0), n(_, null, j(e.items, (h) => (t(), n("div", {
              key: h.id,
              class: "inline-flex items-center gap-1"
            }, [
              l("a", {
                href: h.href,
                class: "text-primary inline-flex items-center gap-1.5 text-sm hover:underline"
              }, [
                (t(), n("svg", Rb, [
                  l("path", {
                    d: x(me)(h.icon)
                  }, null, 8, Ub)
                ])),
                U(" " + f(h.label), 1)
              ], 8, Nb),
              s.value ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "text-muted-foreground hover:text-destructive rounded p-0.5",
                "aria-label": `Remove ${h.label}`,
                onClick: (w) => u(h.id)
              }, [
                (t(), n("svg", qb, [
                  l("path", {
                    d: x(me)("x")
                  }, null, 8, Kb)
                ]))
              ], 8, Hb)) : b("", !0)
            ]))), 128)),
            s.value ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "text-primary inline-flex items-center gap-1.5 text-sm hover:underline",
              onClick: m[2] || (m[2] = (h) => i.value = !0)
            }, [
              (t(), n("svg", Gb, [
                l("path", {
                  d: x(me)("plus")
                }, null, 8, Wb)
              ])),
              m[8] || (m[8] = U(" Add ", -1))
            ])) : b("", !0)
          ]))
        ]),
        _: 1
      }, 8, ["hideable"]),
      I(mt, {
        open: i.value,
        title: "Add a shortcut",
        description: "Pick a screen this dashboard already knows.",
        onClose: m[5] || (m[5] = (h) => i.value = !1)
      }, {
        footer: O(() => [
          I(ce, {
            variant: "outline",
            onClick: m[4] || (m[4] = (h) => i.value = !1)
          }, {
            default: O(() => [...m[9] || (m[9] = [
              U("Cancel", -1)
            ])]),
            _: 1
          })
        ]),
        default: O(() => [
          d.value.length ? (t(), n("ul", Zb, [
            (t(!0), n(_, null, j(d.value, (h) => (t(), n("li", {
              key: h.id
            }, [
              l("button", {
                type: "button",
                class: "hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                onClick: (w) => c(h)
              }, [
                (t(), n("svg", Yb, [
                  l("path", {
                    d: x(me)(h.icon)
                  }, null, 8, Qb)
                ])),
                U(" " + f(h.label), 1)
              ], 8, Jb)
            ]))), 128))
          ])) : (t(), n("p", Xb, " Every catalog shortcut is already on the card. "))
        ]),
        _: 1
      }, 8, ["open"])
    ], 64));
  }
}), ty = ["aria-busy"], ny = { class: "flex flex-1 flex-col gap-1 p-4" }, ay = { class: "text-muted-foreground relative text-xs font-medium" }, ly = {
  key: 1,
  class: "text-destructive relative flex h-8 items-center gap-3 text-sm",
  role: "alert"
}, oy = {
  key: 2,
  class: "relative flex h-8 items-center text-2xl font-semibold tabular-nums"
}, sy = {
  key: 4,
  class: "text-muted-foreground relative text-xs"
}, ry = {
  key: 0,
  class: "-mb-px",
  "aria-hidden": "true"
}, aS = /* @__PURE__ */ L({
  __name: "StatCard",
  props: {
    label: {},
    description: { default: null },
    value: {},
    trend: { default: null },
    comparison: {},
    sparkline: { default: null },
    loading: { type: Boolean, default: !1 },
    error: { type: Boolean, default: !1 },
    retryable: { type: Boolean, default: !1 },
    inverted: { type: Boolean, default: !1 }
  },
  emits: ["retry"],
  setup(e) {
    const o = (a) => typeof a == "number" ? new Intl.NumberFormat().format(a) : String(a ?? "-");
    return (a, r) => (t(), n("div", {
      class: "bg-card flex flex-col overflow-hidden rounded-lg border",
      "data-slot": "stat-card",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      l("div", ny, [
        l("p", ay, f(e.label), 1),
        e.loading ? (t(), T(Pe, {
          key: 0,
          variant: "number",
          class: "my-1"
        })) : e.error ? (t(), n("div", ly, [
          r[1] || (r[1] = l("span", null, "Could not load", -1)),
          e.retryable ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-2 py-1 text-xs font-medium transition-colors",
            onClick: r[0] || (r[0] = (s) => a.$emit("retry"))
          }, " Retry ")) : b("", !0)
        ])) : (t(), n("span", oy, f(o(e.value)), 1)),
        e.trend && !e.loading && !e.error ? (t(), T(da, {
          key: 3,
          class: "relative",
          direction: e.trend.direction,
          percentage: e.trend.percentage,
          comparison: e.comparison,
          inverted: e.inverted
        }, null, 8, ["direction", "percentage", "comparison", "inverted"])) : e.description ? (t(), n("p", sy, f(e.description), 1)) : b("", !0)
      ]),
      e.sparkline && e.sparkline.length > 1 && !e.loading && !e.error ? (t(), n("div", ry, [
        I(Ot, {
          data: e.sparkline,
          height: 44,
          filled: ""
        }, null, 8, ["data"])
      ])) : b("", !0)
    ], 8, ty));
  }
}), iy = { class: "bg-card relative flex flex-col overflow-hidden rounded-lg border" }, dy = { class: "flex flex-col gap-1 p-4" }, uy = { class: "flex items-start justify-between gap-2" }, cy = { class: "text-sm font-medium" }, fy = {
  key: 0,
  class: "text-muted-foreground font-mono text-xs"
}, my = { class: "mt-1 flex flex-wrap items-center gap-2" }, py = {
  key: 1,
  class: "text-xl font-semibold tabular-nums"
}, vy = {
  key: 0,
  class: "-mb-px"
}, zt = /* @__PURE__ */ L({
  __name: "MiniStatCard",
  props: {
    label: {},
    value: {},
    caption: { default: null },
    delta: { default: null },
    inverted: { type: Boolean, default: !1 },
    series: { default: null },
    color: { default: "var(--primary)" },
    loading: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = y(() => o.delta === null || o.delta === 0 ? null : o.inverted ? o.delta < 0 : o.delta > 0), r = y(
      () => a.value === null ? "bg-muted text-muted-foreground" : a.value ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    ), s = y(
      () => typeof o.value == "number" ? new Intl.NumberFormat().format(o.value) : o.value
    );
    return (i, d) => (t(), n("div", iy, [
      l("div", dy, [
        l("div", uy, [
          l("p", cy, f(e.label), 1),
          K(i.$slots, "menu")
        ]),
        e.caption ? (t(), n("p", fy, f(e.caption), 1)) : b("", !0),
        l("div", my, [
          e.loading ? (t(), T(Pe, {
            key: 0,
            variant: "number"
          })) : (t(), n("span", py, f(s.value), 1)),
          e.delta !== null && !e.loading ? (t(), n("span", {
            key: 2,
            class: z(["rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums", r.value])
          }, f(e.delta > 0 ? "+" : "") + f(e.delta) + "% ", 3)) : b("", !0)
        ])
      ]),
      e.series && e.series.length > 1 && !e.loading ? (t(), n("div", vy, [
        I(Ot, {
          data: e.series,
          color: e.color,
          height: 56,
          filled: ""
        }, null, 8, ["data", "color"])
      ])) : b("", !0)
    ]));
  }
}), gy = { class: "relative flex flex-col gap-2" }, hy = ["aria-label"], by = ["onMouseenter"], yy = {
  key: 0,
  class: "flex flex-wrap gap-x-6 gap-y-1"
}, xy = { class: "text-muted-foreground flex items-center gap-1.5 text-xs" }, ky = { class: "truncate" }, $y = { class: "text-sm font-semibold tabular-nums" }, lS = /* @__PURE__ */ L({
  __name: "SegmentedBar",
  props: {
    segments: {},
    total: { default: null },
    format: {},
    showLegend: { type: Boolean, default: !0 },
    height: { default: 8 }
  },
  setup(e) {
    const o = e, a = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)"
    ], r = y(() => o.segments.reduce((v, m) => v + Math.max(0, m.value), 0)), s = y(() => Math.max(o.total ?? r.value, r.value, 1)), i = y(
      () => o.segments.map((v, m) => {
        const h = Math.max(0, v.value) / s.value;
        return {
          ...v,
          color: v.color ?? a[m % a.length],
          share: h,
          // A visible sliver rather than nothing, for a non-zero value too
          // small to round to a pixel.
          width: v.value > 0 ? `max(2px, ${(h * 100).toFixed(2)}%)` : "0px"
        };
      })
    ), d = (v) => o.format ? o.format(v) : new Intl.NumberFormat().format(v), u = q(null), c = (v) => `${(v * 100).toFixed(v > 0 && v < 0.01 ? 1 : 0)}%`;
    return (v, m) => (t(), n("div", gy, [
      l("div", {
        class: "bg-muted flex w-full overflow-hidden rounded-full",
        style: ie({ height: `${e.height}px` }),
        role: "img",
        "aria-label": e.segments.map((h) => `${h.label} ${d(h.value)}`).join(", ")
      }, [
        (t(!0), n(_, null, j(i.value, (h, w) => (t(), n("span", {
          key: w,
          class: z(["h-full transition-all", [
            w === 0 ? "rounded-l-full" : "",
            w === i.value.length - 1 && !e.total ? "rounded-r-full" : ""
          ]]),
          style: ie({
            width: h.width,
            background: h.color,
            opacity: u.value === null || u.value === w ? 1 : 0.4
          }),
          onMouseenter: (k) => u.value = w,
          onMouseleave: m[0] || (m[0] = (k) => u.value = null)
        }, null, 46, by))), 128))
      ], 12, hy),
      e.showLegend ? (t(), n("div", yy, [
        (t(!0), n(_, null, j(i.value, (h, w) => (t(), n("div", {
          key: w,
          class: "flex min-w-0 flex-col"
        }, [
          l("span", xy, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: h.color })
            }, null, 4),
            l("span", ky, f(h.label), 1)
          ]),
          l("span", $y, f(d(h.value)), 1)
        ]))), 128))
      ])) : b("", !0),
      u.value !== null ? (t(), T(bt, {
        key: 1,
        label: i.value[u.value].label,
        value: d(i.value[u.value].value),
        share: c(i.value[u.value].share)
      }, null, 8, ["label", "value", "share"])) : b("", !0)
    ]));
  }
}), wy = {
  class: "divide-border flex flex-col divide-y",
  "data-slot": "stat-list"
}, Cy = ["data-heading"], Sy = {
  key: 1,
  class: "flex items-center justify-between gap-3 text-sm"
}, My = { class: "text-muted-foreground truncate" }, By = ["aria-label"], oS = /* @__PURE__ */ L({
  __name: "StatListChart",
  props: {
    rows: {}
  },
  setup(e) {
    const o = e, a = {
      success: "text-success",
      warning: "text-warning",
      danger: "text-destructive",
      info: "text-info",
      neutral: ""
    }, r = {
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-destructive",
      info: "bg-info",
      neutral: "bg-muted-foreground/40"
    }, s = y(
      () => o.rows.map((i) => {
        if (!i.bar || i.bar.segments.length === 0)
          return { ...i, segments: [] };
        const d = i.bar.segments.reduce((c, v) => c + Math.max(0, v.value), 0), u = Math.max(i.bar.total ?? d, d, 1);
        return {
          ...i,
          segments: i.bar.segments.map((c) => ({
            ...c,
            // A visible sliver rather than nothing, for a non-zero value
            // too small to round to a pixel - see `SegmentedBar`.
            width: c.value > 0 ? `max(2px, ${(Math.max(0, c.value) / u * 100).toFixed(2)}%)` : "0px"
          }))
        };
      })
    );
    return (i, d) => (t(), n("div", wy, [
      (t(!0), n(_, null, j(s.value, (u) => (t(), n("div", {
        key: u.key,
        class: "flex flex-col gap-1.5 py-2.5 first:pt-0 last:pb-0",
        "data-heading": u.heading ? "true" : void 0
      }, [
        u.heading ? (t(), n("div", {
          key: 0,
          class: z(["pt-1 text-xs font-semibold tracking-wide uppercase", u.tone ? a[u.tone] : "text-muted-foreground"])
        }, f(u.label), 3)) : (t(), n("div", Sy, [
          l("span", My, f(u.label), 1),
          l("span", {
            class: z(["shrink-0 font-medium tabular-nums", u.tone ? a[u.tone] : "text-foreground"])
          }, f(u.value), 3)
        ])),
        u.segments.length ? (t(), n("div", {
          key: 2,
          class: "bg-muted flex h-1.5 w-full overflow-hidden rounded-full",
          role: "img",
          "aria-label": u.segments.map((c) => `${c.label} ${c.value}`).join(", ")
        }, [
          (t(!0), n(_, null, j(u.segments, (c, v) => (t(), n("span", {
            key: v,
            class: z(["h-full transition-all", r[c.tone ?? "neutral"]]),
            style: ie({ width: c.width })
          }, null, 6))), 128))
        ], 8, By)) : b("", !0)
      ], 8, Cy))), 128))
    ]));
  }
}), Ay = {
  online: "success",
  paid: "success",
  active: "success",
  available: "success",
  occupied: "success",
  instock: "success",
  "in-stock": "success",
  in_stock: "success",
  fulfilled: "success",
  pending: "warning",
  reserved: "warning",
  low: "warning",
  due: "warning",
  degraded: "warning",
  offline: "danger",
  unpaid: "danger",
  overdue: "danger",
  failed: "danger",
  outofstock: "danger",
  "out-of-stock": "danger",
  out_of_stock: "danger",
  expired: "danger",
  vacant: "info",
  processing: "info",
  draft: "info",
  ending: "warning",
  connected: "success",
  disconnected: "neutral",
  live: "success",
  test: "info",
  enabled: "success",
  offered: "success",
  disabled: "neutral",
  default: "info"
}, zy = {
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "info",
  neutral: "outline"
};
function _y(e) {
  return e.trim().toLowerCase().replace(/\s+/g, "-");
}
function Py(e, o) {
  return o || (e ? Ay[_y(e)] ?? "neutral" : "neutral");
}
function Ly(e, o) {
  return zy[Py(e, o)];
}
const $e = /* @__PURE__ */ L({
  __name: "PkStatusBadge",
  props: {
    status: { default: null },
    tone: { default: null },
    class: {}
  },
  setup(e) {
    const o = e, a = y(() => Ly(o.status, o.tone));
    return (r, s) => (t(), T(Ie, {
      variant: a.value,
      class: z(o.class)
    }, {
      default: O(() => [
        K(r.$slots, "default", {}, () => [
          U(f(e.status), 1)
        ])
      ]),
      _: 3
    }, 8, ["variant", "class"]));
  }
}), Oy = ["data-layout"], jy = ["src", "alt"], Vy = {
  key: 1,
  class: "text-muted-foreground flex size-full items-center justify-center text-lg font-medium"
}, Dy = ["src"], Ty = {
  key: 3,
  class: "absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1",
  "data-slot": "catalog-dots"
}, Iy = ["onMouseenter"], Ey = { class: "flex min-w-0 flex-1 items-start justify-between gap-2" }, Fy = { class: "min-w-0" }, Ny = { class: "truncate text-sm font-medium" }, Ry = {
  key: 0,
  class: "text-muted-foreground truncate text-xs"
}, Uy = {
  key: 1,
  class: "text-muted-foreground line-clamp-2 text-xs"
}, Hy = { class: "mt-auto flex items-end justify-between gap-2 pt-1" }, qy = { class: "min-w-0" }, Ky = {
  key: 0,
  class: "text-sm font-semibold tabular-nums"
}, Gy = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal tabular-nums"
}, Wy = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Zy = ["d"], Jy = ["aria-label"], Yy = /* @__PURE__ */ L({
  __name: "CatalogCard",
  props: {
    item: {},
    layout: { default: "grid" }
  },
  emits: ["select", "cart"],
  setup(e, { emit: o }) {
    const a = {
      success: "bg-success",
      warning: "bg-warning",
      danger: "bg-destructive",
      info: "bg-info",
      neutral: "bg-muted-foreground/40"
    }, r = e, s = o, i = q(0);
    function d(C) {
      if (typeof C != "string")
        return null;
      const B = C.trim();
      return B === "" ? null : /^(https?:)?\/\//i.test(B) ? B : null;
    }
    const u = y(() => {
      const C = [r.item.image, ...r.item.images ?? []].map(d).filter((B) => B !== null);
      return [...new Set(C)];
    }), c = y(() => u.value[i.value] ?? u.value[0] ?? null), v = y(
      () => r.item.label.split(/\s+/).slice(0, 2).map((C) => C[0]?.toUpperCase() ?? "").join("")
    ), m = y(() => {
      const C = r.item.progress;
      if (!C)
        return null;
      const B = Math.max(C.total ?? 100, C.value, 1);
      return `${Math.min(100, Math.max(0, C.value / B * 100)).toFixed(2)}%`;
    }), h = y(() => u.value.length > 1 ? u.value[1] : null), w = y(
      () => (r.item.kind ?? "product") === "product" && r.item.status !== "out-of-stock"
    ), k = y(() => typeof r.item.stock != "number" ? null : `${r.item.stock} in stock`);
    function S(C) {
      C.stopPropagation(), s("cart", r.item.key);
    }
    return (C, B) => (t(), n("article", {
      "data-slot": "catalog-card",
      class: z(["bg-card hover:bg-muted/40 flex w-full cursor-pointer overflow-hidden rounded-lg border text-left transition-colors", e.layout === "list" ? "flex-row items-stretch" : "flex-col"]),
      "data-layout": e.layout,
      role: "button",
      tabindex: "0",
      onClick: B[0] || (B[0] = (A) => s("select", e.item.key)),
      onKeydown: B[1] || (B[1] = Ft(he((A) => s("select", e.item.key), ["prevent"]), ["enter"])),
      onMouseleave: B[2] || (B[2] = (A) => i.value = 0)
    }, [
      l("div", {
        class: z([
          "bg-muted relative overflow-hidden",
          e.layout === "list" ? "aspect-square w-20 shrink-0 sm:w-24" : "aspect-[4/3] w-full"
        ])
      }, [
        c.value ? (t(), n("img", {
          key: 0,
          src: c.value,
          alt: e.item.label,
          loading: "lazy",
          class: "size-full object-cover"
        }, null, 8, jy)) : (t(), n("span", Vy, f(v.value), 1)),
        e.layout === "grid" && h.value && i.value === 0 ? (t(), n("img", {
          key: 2,
          src: h.value,
          alt: "",
          loading: "lazy",
          class: "ring-background pointer-events-none absolute right-1.5 bottom-1.5 size-10 rounded-md object-cover ring-2",
          "data-slot": "catalog-peek"
        }, null, 8, Dy)) : b("", !0),
        e.layout === "grid" && u.value.length > 1 ? (t(), n("div", Ty, [
          (t(!0), n(_, null, j(u.value, (A, $) => (t(), n("span", {
            key: $,
            class: z(["size-1.5 rounded-full", $ === i.value ? "bg-background" : "bg-background/50"]),
            onMouseenter: (p) => i.value = $
          }, null, 42, Iy))), 128))
        ])) : b("", !0)
      ], 2),
      l("div", {
        class: z(["flex min-w-0 flex-1", e.layout === "list" ? "items-center gap-3 p-3" : "flex-col gap-1 p-3"])
      }, [
        l("div", Ey, [
          l("div", Fy, [
            l("p", Ny, f(e.item.label), 1),
            e.item.caption ? (t(), n("p", Ry, f(e.item.caption), 1)) : b("", !0),
            e.item.facts?.length ? (t(), n("p", Uy, f(e.item.facts.join(" · ")), 1)) : b("", !0)
          ]),
          e.item.status ? (t(), T($e, {
            key: 0,
            status: e.item.status,
            tone: e.item.tone
          }, null, 8, ["status", "tone"])) : b("", !0)
        ]),
        l("div", Hy, [
          l("div", qy, [
            e.item.price ? (t(), n("p", Ky, f(e.item.price), 1)) : b("", !0),
            k.value ? (t(), n("p", Gy, f(k.value), 1)) : b("", !0)
          ]),
          w.value ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-muted inline-flex size-8 shrink-0 items-center justify-center rounded-md border",
            "aria-label": "Add to cart",
            "data-slot": "catalog-cart",
            onClick: S
          }, [
            (t(), n("svg", Wy, [
              l("path", {
                d: x(me)("cart")
              }, null, 8, Zy)
            ]))
          ])) : b("", !0)
        ]),
        m.value && e.layout === "grid" ? (t(), n("div", {
          key: 0,
          class: "bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full",
          role: "img",
          "aria-label": `${e.item.label} ${e.item.progress.value}`
        }, [
          l("span", {
            class: z(["block h-full", a[e.item.progress?.tone ?? "neutral"]]),
            style: ie({ width: m.value })
          }, null, 6)
        ], 8, Jy)) : b("", !0)
      ], 2)
    ], 42, Oy));
  }
});
function Qy(e) {
  return e === 30 ? "Per month" : e === 365 ? "Per year" : "Lifetime";
}
function Xy(e) {
  return e === !0 || e === !1 ? "" : e === -1 || e === "-1" ? "Unlimited" : Array.isArray(e) ? e.join(", ") : String(e);
}
function ex(e) {
  return e === !1 || e === 0 || e === "0" || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : !0;
}
const tx = ["data-featured", "data-recommended"], nx = { class: "flex flex-col gap-1" }, ax = {
  key: 0,
  class: "text-muted-foreground mb-1 flex flex-wrap gap-2 text-xs font-medium"
}, lx = { key: 0 }, ox = { key: 1 }, sx = { key: 2 }, rx = { key: 3 }, ix = { class: "text-sm font-semibold" }, dx = { class: "flex items-baseline gap-1" }, ux = { class: "text-3xl font-semibold tracking-tight tabular-nums" }, cx = { class: "text-muted-foreground text-sm font-normal" }, fx = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal text-pretty"
}, mx = { class: "text-muted-foreground mt-1 text-xs" }, px = { class: "flex flex-1 flex-col gap-2 text-sm" }, vx = { class: "flex min-w-0 items-start gap-2" }, gx = {
  key: 0,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, hx = ["d"], bx = {
  key: 1,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, yx = ["d"], xx = { class: "capitalize" }, kx = {
  key: 0,
  class: "text-muted-foreground max-w-[40%] shrink-0 text-end text-xs font-medium"
}, $x = { class: "text-foreground font-medium" }, wx = { class: "mt-auto flex gap-2 pt-2" }, Cx = /* @__PURE__ */ L({
  __name: "PlanCard",
  props: {
    plan: {},
    canDelete: { type: Boolean }
  },
  emits: ["edit", "delete"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.plan.priceFormatted ?? String(a.plan.price)), i = y(() => !!(a.plan.featured || a.plan.recommended)), d = y(() => {
      const c = a.plan.perks ?? {};
      return Object.entries(c).map(([v, m]) => ({
        key: v,
        label: v.replace(/_/g, " "),
        granted: ex(m.value),
        display: Xy(m.value)
      }));
    }), u = y(() => a.plan.extraPerks ?? []);
    return (c, v) => (t(), n("article", {
      class: z(["bg-card text-card-foreground flex flex-col gap-4 rounded-lg border p-6", i.value ? "border-primary shadow-sm" : ""]),
      "data-slot": "plan-card",
      "data-featured": e.plan.featured ? "true" : void 0,
      "data-recommended": e.plan.recommended ? "true" : void 0
    }, [
      l("header", nx, [
        e.plan.recommended || e.plan.featured || e.plan.trial || e.plan.active === !1 ? (t(), n("p", ax, [
          e.plan.recommended ? (t(), n("span", lx, "Recommended")) : e.plan.featured ? (t(), n("span", ox, "Featured")) : b("", !0),
          e.plan.trial ? (t(), n("span", sx, "Trial")) : b("", !0),
          e.plan.active === !1 ? (t(), n("span", rx, "Inactive")) : b("", !0)
        ])) : b("", !0),
        l("h3", ix, f(e.plan.name), 1),
        l("p", dx, [
          l("span", ux, f(s.value), 1),
          l("span", cx, f(x(Qy)(e.plan.days)), 1)
        ]),
        e.plan.shortDescription ? (t(), n("p", fx, f(e.plan.shortDescription), 1)) : b("", !0),
        l("p", mx, " Active seats: " + f(e.plan.activeUsers ?? 0), 1)
      ]),
      l("ul", px, [
        (t(!0), n(_, null, j(d.value, (m) => (t(), n("li", {
          key: m.key,
          class: "flex items-start justify-between gap-3"
        }, [
          l("span", vx, [
            l("span", {
              class: z(["mt-0.5 shrink-0", m.granted ? "text-success" : "text-muted-foreground"]),
              "aria-hidden": "true"
            }, [
              m.granted ? (t(), n("svg", gx, [
                l("path", {
                  d: x(me)("check")
                }, null, 8, hx)
              ])) : (t(), n("svg", bx, [
                l("path", {
                  d: x(me)("x")
                }, null, 8, yx)
              ]))
            ], 2),
            l("span", xx, f(m.label), 1)
          ]),
          m.display ? (t(), n("span", kx, f(m.display), 1)) : b("", !0)
        ]))), 128)),
        (t(!0), n(_, null, j(u.value, (m, h) => (t(), n("li", {
          key: `extra-${h}`,
          class: "text-muted-foreground flex justify-between gap-3 text-sm"
        }, [
          l("span", null, f(m.key), 1),
          l("span", $x, f(m.value), 1)
        ]))), 128))
      ]),
      l("footer", wx, [
        I(ce, {
          class: "flex-1",
          variant: "default",
          size: "sm",
          onClick: v[0] || (v[0] = (m) => r("edit", e.plan.id))
        }, {
          default: O(() => [...v[2] || (v[2] = [
            U(" Edit ", -1)
          ])]),
          _: 1
        }),
        I(ce, {
          class: "flex-1",
          variant: "outline",
          size: "sm",
          disabled: e.canDelete === !1 || (e.plan.activeUsers ?? 0) > 0,
          onClick: v[1] || (v[1] = (m) => r("delete", e.plan.id))
        }, {
          default: O(() => [...v[3] || (v[3] = [
            U(" Delete ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 10, tx));
  }
}), Sx = { class: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" }, Mx = {
  key: 0,
  class: "text-xl font-semibold tracking-tight sm:text-2xl"
}, Bx = {
  key: 1,
  class: "text-muted-foreground mt-1 text-sm"
}, Ax = {
  key: 0,
  class: "text-muted-foreground rounded-lg border border-dashed px-6 py-16 text-center text-sm"
}, zx = {
  key: 1,
  class: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
}, sS = /* @__PURE__ */ L({
  __name: "PlanGrid",
  props: {
    plans: {},
    title: {},
    description: { default: null },
    embedded: { type: Boolean, default: !0 }
  },
  emits: ["create", "edit", "delete"],
  setup(e, { emit: o }) {
    const a = o;
    return (r, s) => (t(), n("div", {
      class: z(["w-full space-y-6", e.embedded ? "" : x(lt)]),
      "data-slot": "plan-grid"
    }, [
      l("header", Sx, [
        l("div", null, [
          e.title ? (t(), n("h1", Mx, f(e.title), 1)) : b("", !0),
          e.description ? (t(), n("p", Bx, f(e.description), 1)) : b("", !0)
        ]),
        I(ce, {
          type: "button",
          onClick: s[0] || (s[0] = (i) => a("create"))
        }, {
          default: O(() => [...s[3] || (s[3] = [
            U("Create plan", -1)
          ])]),
          _: 1
        })
      ]),
      e.plans.length === 0 ? (t(), n("p", Ax, " No plans yet. Create one to offer organisations a bundle of modules and limits. ")) : (t(), n("div", zx, [
        (t(!0), n(_, null, j(e.plans, (i) => (t(), T(Cx, {
          key: i.id,
          plan: i,
          onEdit: s[1] || (s[1] = (d) => a("edit", d)),
          onDelete: s[2] || (s[2] = (d) => a("delete", d))
        }, null, 8, ["plan"]))), 128))
      ]))
    ], 2));
  }
}), _x = { class: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" }, Px = { class: "text-xl font-semibold tracking-tight sm:text-2xl" }, Lx = { class: "flex flex-col-reverse items-start gap-6 lg:flex-row" }, Ox = { class: "bg-card w-full flex-1 space-y-4 rounded-lg border p-5" }, jx = { class: "space-y-1.5" }, Vx = { class: "space-y-1.5" }, Dx = { class: "space-y-1.5" }, Tx = { class: "space-y-1.5" }, Ix = { class: "space-y-1.5" }, Ex = { class: "flex items-center gap-3 text-sm" }, Fx = { class: "flex items-center gap-3 text-sm" }, Nx = { class: "flex items-center gap-3 text-sm" }, Rx = {
  key: 0,
  class: "space-y-1.5"
}, Ux = { class: "flex items-center gap-3 text-sm" }, Hx = { class: "bg-card w-full flex-1 space-y-4 rounded-lg border p-5" }, qx = { class: "space-y-1.5" }, Kx = ["value"], Gx = {
  key: 0,
  class: "flex items-center gap-3 text-sm"
}, Wx = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, Zx = ["id", "value", "onInput"], Jx = { class: "space-y-2" }, Yx = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Qx = ["d"], rS = /* @__PURE__ */ L({
  __name: "PlanEditor",
  props: {
    plan: { default: null },
    modules: { default: () => [] },
    limits: { default: () => [] },
    mode: { default: "create" },
    processing: { type: Boolean, default: !1 },
    embedded: { type: Boolean, default: !0 }
  },
  emits: ["save", "cancel"],
  setup(e, { emit: o }) {
    const a = () => ({
      id: "",
      name: "",
      shortDescription: "",
      description: "",
      days: 30,
      price: 0,
      featured: !1,
      recommended: !1,
      trial: !1,
      trialDays: 0,
      active: !0,
      perks: {},
      extraPerks: []
    }), r = e, s = o, i = ft(a());
    function d($, p) {
      const g = i.perks?.[$]?.value;
      return g ?? p;
    }
    function u($, p, g) {
      const M = i.perks?.[$];
      i.perks = {
        ...i.perks ?? {},
        [$]: {
          value: p,
          overview: g ?? M?.overview ?? ""
        }
      };
    }
    function c($, p) {
      const g = i.perks?.[$];
      i.perks = {
        ...i.perks ?? {},
        [$]: {
          value: g?.value ?? ($ === "modules" ? [] : 0),
          overview: p
        }
      };
    }
    function v($) {
      const p = $ ? { ...a(), ...$ } : a();
      i.id = p.id, i.name = p.name, i.shortDescription = p.shortDescription ?? "", i.description = p.description ?? "", i.days = p.days, i.price = p.price, i.featured = p.featured ?? !1, i.recommended = p.recommended ?? !1, i.trial = p.trial ?? !1, i.trialDays = p.trialDays ?? 0, i.active = p.active ?? !0, i.perks = { ...p.perks ?? {} }, i.extraPerks = [...p.extraPerks ?? []], i.perks.modules || u("modules", []);
    }
    v(r.plan), pe(
      () => r.plan,
      ($) => v($),
      { deep: !0 }
    );
    const m = y({
      get: () => {
        const $ = d("modules", []);
        return Array.isArray($) ? $.map(String) : [];
      },
      set: ($) => {
        u(
          "modules",
          w($.map(String)),
          i.perks?.modules?.overview ?? ""
        );
      }
    }), h = y(
      () => r.modules.map(($) => ({ value: $.key, label: $.label }))
    );
    function w($) {
      const p = Object.fromEntries(r.modules.map((F) => [F.key, F])), g = new Set($);
      for (const F of r.modules)
        if (!g.has(F.key))
          for (const D of F.children ?? [])
            g.delete(D);
      let M = !0;
      for (; M; ) {
        M = !1;
        for (const F of [...g])
          for (const D of p[F]?.requires ?? [])
            g.has(D) || (g.add(D), M = !0);
      }
      return [...g];
    }
    function k() {
      i.extraPerks = [...i.extraPerks ?? [], { key: "", value: "" }];
    }
    function S($) {
      i.extraPerks = (i.extraPerks ?? []).filter((p, g) => g !== $);
    }
    function C() {
      s("save", {
        ...i,
        extraPerks: (i.extraPerks ?? []).filter(($) => $.key.trim() !== "")
      });
    }
    const B = `file:text-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${He}`, A = `dark:bg-input/30 border-input min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${He}`;
    return ($, p) => (t(), n("form", {
      class: z(["w-full space-y-6", e.embedded ? "" : x(lt)]),
      "data-slot": "plan-editor",
      onSubmit: he(C, ["prevent"])
    }, [
      l("header", _x, [
        l("div", null, [
          l("h1", Px, f(e.mode === "edit" ? "Edit plan" : "Create plan"), 1),
          p[13] || (p[13] = l("p", { class: "text-muted-foreground mt-1 text-sm" }, " Plans are organisation-wide. Charge a recurring amount. Perks are modules and numeric limits (-1 is Unlimited). ", -1))
        ]),
        I(ce, {
          type: "button",
          variant: "outline",
          onClick: p[0] || (p[0] = (g) => s("cancel"))
        }, {
          default: O(() => [...p[14] || (p[14] = [
            U("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      l("div", Lx, [
        l("section", Ox, [
          p[26] || (p[26] = l("h2", { class: "font-semibold" }, "Plan details", -1)),
          l("div", jx, [
            I(_e, { for: "plan-name" }, {
              default: O(() => [...p[15] || (p[15] = [
                U("Plan name", -1)
              ])]),
              _: 1
            }),
            I(we, {
              id: "plan-name",
              modelValue: i.name,
              "onUpdate:modelValue": p[1] || (p[1] = (g) => i.name = g),
              required: ""
            }, null, 8, ["modelValue"])
          ]),
          l("div", Vx, [
            I(_e, { for: "plan-short" }, {
              default: O(() => [...p[16] || (p[16] = [
                U("Short description (optional)", -1)
              ])]),
              _: 1
            }),
            I(we, {
              id: "plan-short",
              modelValue: i.shortDescription,
              "onUpdate:modelValue": p[2] || (p[2] = (g) => i.shortDescription = g),
              placeholder: "For an organisation getting started"
            }, null, 8, ["modelValue"])
          ]),
          l("div", Dx, [
            I(_e, { for: "plan-description" }, {
              default: O(() => [...p[17] || (p[17] = [
                U("Plan description", -1)
              ])]),
              _: 1
            }),
            ge(l("textarea", {
              id: "plan-description",
              "onUpdate:modelValue": p[3] || (p[3] = (g) => i.description = g),
              required: "",
              placeholder: "Shown on the company-wide catalogue",
              class: z(A)
            }, null, 512), [
              [ze, i.description]
            ])
          ]),
          l("div", Tx, [
            I(_e, { for: "plan-days" }, {
              default: O(() => [...p[18] || (p[18] = [
                U("Duration", -1)
              ])]),
              _: 1
            }),
            ge(l("select", {
              id: "plan-days",
              "onUpdate:modelValue": p[4] || (p[4] = (g) => i.days = g),
              class: z(B)
            }, [...p[19] || (p[19] = [
              l("option", { value: 30 }, "Monthly", -1),
              l("option", { value: 365 }, "Yearly", -1),
              l("option", { value: 999999 }, "Lifetime", -1)
            ])], 512), [
              [
                Ze,
                i.days,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          l("div", Ix, [
            I(_e, { for: "plan-price" }, {
              default: O(() => [...p[20] || (p[20] = [
                U("Price", -1)
              ])]),
              _: 1
            }),
            I(we, {
              id: "plan-price",
              "model-value": i.price,
              type: "number",
              step: "any",
              required: "",
              "onUpdate:modelValue": p[5] || (p[5] = (g) => i.price = Number(g))
            }, null, 8, ["model-value"])
          ]),
          l("label", Ex, [
            I(x(Je), {
              checked: !!i.featured,
              "onUpdate:checked": p[6] || (p[6] = (g) => i.featured = g)
            }, null, 8, ["checked"]),
            p[21] || (p[21] = U(" Featured ", -1))
          ]),
          l("label", Fx, [
            I(x(Je), {
              checked: !!i.recommended,
              "onUpdate:checked": p[7] || (p[7] = (g) => i.recommended = g)
            }, null, 8, ["checked"]),
            p[22] || (p[22] = U(" Recommended ", -1))
          ]),
          l("label", Nx, [
            I(x(Je), {
              checked: !!i.trial,
              "onUpdate:checked": p[8] || (p[8] = (g) => i.trial = g)
            }, null, 8, ["checked"]),
            p[23] || (p[23] = U(" Offer a trial ", -1))
          ]),
          i.trial ? (t(), n("div", Rx, [
            I(_e, { for: "plan-trial-days" }, {
              default: O(() => [...p[24] || (p[24] = [
                U("Trial days", -1)
              ])]),
              _: 1
            }),
            I(we, {
              id: "plan-trial-days",
              "model-value": i.trialDays ?? 0,
              type: "number",
              required: "",
              "onUpdate:modelValue": p[9] || (p[9] = (g) => i.trialDays = Number(g))
            }, null, 8, ["model-value"])
          ])) : b("", !0),
          l("label", Ux, [
            I(x(Je), {
              checked: i.active !== !1,
              "onUpdate:checked": p[10] || (p[10] = (g) => i.active = g)
            }, null, 8, ["checked"]),
            p[25] || (p[25] = U(" Active ", -1))
          ]),
          I(ce, {
            type: "submit",
            disabled: e.processing
          }, {
            default: O(() => [
              U(f(e.mode === "edit" ? "Save plan" : "Create plan"), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        l("section", Hx, [
          p[33] || (p[33] = l("h2", { class: "font-semibold" }, "Plan perks", -1)),
          l("div", qx, [
            I(_e, null, {
              default: O(() => [...p[27] || (p[27] = [
                U("Modules access", -1)
              ])]),
              _: 1
            }),
            I(on, {
              modelValue: m.value,
              "onUpdate:modelValue": p[11] || (p[11] = (g) => m.value = g),
              options: h.value,
              placeholder: "Select modules"
            }, null, 8, ["modelValue", "options"]),
            I(_e, { for: "plan-modules-overview" }, {
              default: O(() => [...p[28] || (p[28] = [
                U("Overview", -1)
              ])]),
              _: 1
            }),
            l("textarea", {
              id: "plan-modules-overview",
              value: i.perks?.modules?.overview ?? "",
              class: z(A),
              onInput: p[12] || (p[12] = (g) => c("modules", g.target.value))
            }, null, 40, Kx)
          ]),
          (t(!0), n(_, null, j(e.limits, (g) => (t(), n("div", {
            key: g.key,
            class: "space-y-1.5"
          }, [
            g.kind === "toggle" ? (t(), n("label", Gx, [
              I(x(Je), {
                checked: !!d(g.key, !1),
                "onUpdate:checked": (M) => u(
                  g.key,
                  M,
                  i.perks?.[g.key]?.overview ?? ""
                )
              }, null, 8, ["checked", "onUpdate:checked"]),
              U(" " + f(g.label), 1)
            ])) : (t(), n(_, { key: 1 }, [
              I(_e, {
                for: `plan-limit-${g.key}`
              }, {
                default: O(() => [
                  U(f(g.label), 1)
                ]),
                _: 2
              }, 1032, ["for"]),
              g.hint ? (t(), n("p", Wx, f(g.hint), 1)) : b("", !0),
              I(we, {
                id: `plan-limit-${g.key}`,
                "model-value": Number(d(g.key, 0)),
                type: "number",
                step: g.step ?? 1,
                required: "",
                "onUpdate:modelValue": (M) => u(
                  g.key,
                  Number(M),
                  i.perks?.[g.key]?.overview ?? ""
                )
              }, null, 8, ["id", "model-value", "step", "onUpdate:modelValue"]),
              p[29] || (p[29] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " Use -1 for Unlimited. ", -1))
            ], 64)),
            I(_e, {
              for: `plan-overview-${g.key}`
            }, {
              default: O(() => [...p[30] || (p[30] = [
                U("Overview", -1)
              ])]),
              _: 1
            }, 8, ["for"]),
            l("textarea", {
              id: `plan-overview-${g.key}`,
              value: i.perks?.[g.key]?.overview ?? "",
              class: z(A),
              onInput: (M) => c(g.key, M.target.value)
            }, null, 40, Zx)
          ]))), 128)),
          l("div", Jx, [
            p[32] || (p[32] = l("p", { class: "text-sm font-semibold" }, "Extra perks", -1)),
            (t(!0), n(_, null, j(i.extraPerks ?? [], (g, M) => (t(), n("div", {
              key: M,
              class: "flex items-center gap-2"
            }, [
              I(we, {
                modelValue: g.key,
                "onUpdate:modelValue": (F) => g.key = F,
                placeholder: "Label"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              I(we, {
                modelValue: g.value,
                "onUpdate:modelValue": (F) => g.value = F,
                placeholder: "Value"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              I(ce, {
                type: "button",
                variant: "destructive",
                size: "icon",
                "aria-label": "Remove perk",
                onClick: (F) => S(M)
              }, {
                default: O(() => [
                  (t(), n("svg", Yx, [
                    l("path", {
                      d: x(me)("x")
                    }, null, 8, Qx)
                  ]))
                ]),
                _: 1
              }, 8, ["onClick"])
            ]))), 128)),
            I(ce, {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: k
            }, {
              default: O(() => [...p[31] || (p[31] = [
                U(" Add extra perk ", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ])
    ], 34));
  }
}), Xx = ["data-current", "data-recommended"], e0 = {
  key: 0,
  class: "bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
}, t0 = {
  key: 1,
  class: "bg-primary/10 text-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold"
}, n0 = { class: "text-sm font-semibold" }, a0 = { class: "flex items-baseline gap-1" }, l0 = { class: "text-4xl font-bold tracking-tight tabular-nums" }, o0 = { class: "text-muted-foreground text-sm font-normal" }, s0 = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal text-pretty"
}, r0 = {
  key: 2,
  class: "flex flex-1 flex-col gap-2 text-sm"
}, i0 = {
  class: "text-success mt-0.5 shrink-0",
  "aria-hidden": "true"
}, d0 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, u0 = ["d"], c0 = { class: "text-muted-foreground" }, f0 = {
  key: 3,
  class: "flex-1"
}, m0 = {
  key: 4,
  class: "mt-auto pt-2"
}, iS = /* @__PURE__ */ L({
  __name: "PlanPurchaseCard",
  props: {
    plan: {},
    annual: { type: Boolean, default: !1 },
    processing: { type: Boolean, default: !1 }
  },
  emits: ["choose"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.annual && a.plan.annualPrice !== void 0 ? a.plan.annualPriceFormatted ?? String(a.plan.annualPrice) : a.plan.priceFormatted ?? String(a.plan.price)), i = y(() => a.annual && a.plan.annualPrice !== void 0 ? "year" : a.plan.interval ?? "month"), d = y(() => !!a.plan.recommended && !a.plan.current);
    return (u, c) => (t(), n("article", {
      class: z([
        "bg-card text-card-foreground relative flex flex-col gap-4 rounded-xl border p-6 transition-shadow",
        d.value ? "border-primary shadow-lg ring-1 ring-primary/20" : e.plan.current ? "border-primary/40" : ""
      ]),
      "data-slot": "plan-purchase-card",
      "data-current": e.plan.current ? "true" : void 0,
      "data-recommended": e.plan.recommended ? "true" : void 0
    }, [
      d.value ? (t(), n("span", e0, " Most popular ")) : e.plan.current ? (t(), n("span", t0, " Current plan ")) : b("", !0),
      l("header", {
        class: z(["flex flex-col gap-1", d.value || e.plan.current ? "pt-2" : ""])
      }, [
        l("h3", n0, f(e.plan.name), 1),
        l("p", a0, [
          l("span", l0, f(s.value), 1),
          l("span", o0, "/ " + f(i.value), 1)
        ]),
        e.plan.description ? (t(), n("p", s0, f(e.plan.description), 1)) : b("", !0)
      ], 2),
      e.plan.features?.length ? (t(), n("ul", r0, [
        (t(!0), n(_, null, j(e.plan.features, (v, m) => (t(), n("li", {
          key: m,
          class: "flex items-start gap-2"
        }, [
          l("span", i0, [
            (t(), n("svg", d0, [
              l("path", {
                d: x(me)("check")
              }, null, 8, u0)
            ]))
          ]),
          l("span", c0, f(v), 1)
        ]))), 128))
      ])) : (t(), n("div", f0)),
      e.plan.current ? b("", !0) : (t(), n("footer", m0, [
        I(ce, {
          class: "w-full",
          variant: d.value ? "default" : "outline",
          size: "sm",
          disabled: e.processing,
          onClick: c[0] || (c[0] = (v) => r("choose", e.plan.id))
        }, {
          default: O(() => [
            U(f(e.processing ? "Redirecting…" : "Choose plan"), 1)
          ]),
          _: 1
        }, 8, ["variant", "disabled"])
      ]))
    ], 10, Xx));
  }
}), p0 = {
  key: 0,
  "data-slot": "catalog-toolbar",
  class: "flex flex-col gap-3"
}, v0 = { class: "flex flex-wrap items-center gap-2 sm:flex-nowrap" }, g0 = {
  key: 0,
  class: "relative min-w-0 max-w-sm flex-1"
}, h0 = {
  class: "text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, b0 = ["d"], y0 = {
  key: 1,
  class: "ml-auto inline-flex shrink-0 rounded-md border",
  "data-slot": "catalog-layout",
  role: "group",
  "aria-label": "Layout"
}, x0 = ["aria-pressed"], k0 = ["aria-pressed"], $0 = {
  key: 0,
  class: "flex flex-col gap-2"
}, w0 = ["aria-label"], C0 = {
  key: 0,
  class: "text-muted-foreground mr-1 text-xs font-medium"
}, S0 = ["aria-pressed", "onClick"], M0 = ["aria-label"], B0 = { class: "text-muted-foreground mr-1 text-xs font-medium" }, A0 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, z0 = ["data-slot"], _0 = {
  key: 3,
  class: "flex items-center justify-between gap-3",
  "data-slot": "catalog-pagination"
}, P0 = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, L0 = { class: "flex items-center gap-2" }, O0 = ["disabled"], j0 = ["disabled"], mn = /* @__PURE__ */ L({
  __name: "CatalogGrid",
  props: /* @__PURE__ */ Ne({
    items: {},
    searchable: { type: Boolean, default: !1 },
    searchPlaceholder: { default: "Search…" },
    facets: { default: () => [] },
    layoutToggle: { type: Boolean, default: !1 },
    autofocus: { type: Boolean, default: !1 },
    pageSize: { default: null }
  }, {
    modelValue: { default: "grid" },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ Ne(["select", "cart", "filter", "scan"], ["update:modelValue"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(""), i = vt(e, "modelValue"), d = ft({}), u = ft({});
    pe(s, () => h());
    function c(D) {
      const Y = D.trim();
      if (Y === "")
        return null;
      const G = Number(Y);
      return Number.isFinite(G) ? G : null;
    }
    function v() {
      const D = {};
      for (const [Y, G] of Object.entries(u))
        D[Y] = { min: c(G.min), max: c(G.max) };
      return D;
    }
    function m() {
      return { query: s.value, selected: { ...d }, ranges: v() };
    }
    function h() {
      r("filter", m());
    }
    function w(D, Y) {
      d[D] = d[D] === Y ? null : Y, h();
    }
    function k(D) {
      return u[D] ?? { min: "", max: "" };
    }
    function S(D, Y, G) {
      const Z = u[D] ?? { min: "", max: "" };
      u[D] = { ...Z, [Y]: G }, h();
    }
    function C(D) {
      D.key === "Enter" && (D.preventDefault(), r("scan", s.value.trim()));
    }
    const B = y(
      () => a.facets.filter((D) => (D.kind ?? "chips") === "chips")
    ), A = y(() => a.facets.filter((D) => D.kind === "range")), $ = y(
      () => a.searchable || a.facets.length > 0 || a.layoutToggle
    ), p = q(1);
    pe(
      () => a.items.map((D) => D.key).join(","),
      () => {
        p.value = 1;
      }
    );
    const g = y(() => {
      const D = a.pageSize;
      return !D || D < 1 ? 1 : Math.max(1, Math.ceil(a.items.length / D));
    }), M = y(() => {
      const D = a.pageSize;
      if (!D || D < 1)
        return a.items;
      const Y = (p.value - 1) * D;
      return a.items.slice(Y, Y + D);
    });
    function F(D) {
      p.value = Math.min(g.value, Math.max(1, D));
    }
    return (D, Y) => (t(), n("div", {
      class: z(["flex flex-col gap-4", x(aa)])
    }, [
      $.value ? (t(), n("div", p0, [
        l("div", v0, [
          e.searchable ? (t(), n("div", g0, [
            (t(), n("svg", h0, [
              l("path", {
                d: x(me)("search")
              }, null, 8, b0)
            ])),
            I(we, {
              modelValue: s.value,
              "onUpdate:modelValue": Y[0] || (Y[0] = (G) => s.value = G),
              type: "search",
              placeholder: e.searchPlaceholder,
              class: "pl-8",
              "aria-label": e.searchPlaceholder,
              autofocus: e.autofocus || void 0,
              onKeydown: C
            }, null, 8, ["modelValue", "placeholder", "aria-label", "autofocus"])
          ])) : b("", !0),
          K(D.$slots, "toolbar"),
          e.layoutToggle ? (t(), n("div", y0, [
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "grid" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "grid" ? "true" : "false",
              "aria-label": "Grid",
              onClick: Y[1] || (Y[1] = (G) => i.value = "grid")
            }, " Tiles ", 10, x0),
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "list" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "list" ? "true" : "false",
              "aria-label": "List",
              onClick: Y[2] || (Y[2] = (G) => i.value = "list")
            }, " List ", 10, k0)
          ])) : b("", !0)
        ]),
        B.value.length || A.value.length ? (t(), n("div", $0, [
          (t(!0), n(_, null, j(B.value, (G) => (t(), n("div", {
            key: G.key,
            class: "flex flex-wrap items-center gap-1.5",
            "aria-label": G.label ?? G.key
          }, [
            G.label ? (t(), n("span", C0, f(G.label), 1)) : b("", !0),
            (t(!0), n(_, null, j(G.options ?? [], (Z) => (t(), n("button", {
              key: Z.value,
              type: "button",
              class: z([
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                d[G.key] === Z.value ? "bg-foreground text-background border-foreground" : "bg-background text-foreground hover:bg-muted/60"
              ]),
              "aria-pressed": d[G.key] === Z.value ? "true" : "false",
              onClick: (W) => w(G.key, Z.value)
            }, f(Z.label), 11, S0))), 128))
          ], 8, w0))), 128)),
          (t(!0), n(_, null, j(A.value, (G) => (t(), n("div", {
            key: G.key,
            class: "flex flex-wrap items-center gap-1.5",
            "aria-label": G.label ?? G.key,
            "data-slot": "catalog-range"
          }, [
            l("span", B0, f(G.label ?? G.key), 1),
            I(we, {
              type: "number",
              class: "h-8 w-24 px-2 text-xs",
              placeholder: "From",
              "aria-label": `${G.label ?? G.key} from`,
              "model-value": k(G.key).min,
              "onUpdate:modelValue": (Z) => S(G.key, "min", String(Z))
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
            Y[7] || (Y[7] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "to", -1)),
            I(we, {
              type: "number",
              class: "h-8 w-24 px-2 text-xs",
              placeholder: "To",
              "aria-label": `${G.label ?? G.key} to`,
              "model-value": k(G.key).max,
              "onUpdate:modelValue": (Z) => S(G.key, "max", String(Z))
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ], 8, M0))), 128))
        ])) : b("", !0)
      ])) : b("", !0),
      e.items.length === 0 ? (t(), n("p", A0, " No matching items. ")) : (t(), n("div", {
        key: 2,
        class: z(i.value === "list" ? "flex flex-col gap-3" : x(dm)),
        "data-slot": i.value === "list" ? "catalog-list" : "catalog-grid"
      }, [
        (t(!0), n(_, null, j(M.value, (G) => (t(), T(Yy, {
          key: G.key,
          item: G,
          layout: i.value,
          onSelect: Y[3] || (Y[3] = (Z) => r("select", Z)),
          onCart: Y[4] || (Y[4] = (Z) => r("cart", Z))
        }, null, 8, ["item", "layout"]))), 128))
      ], 10, z0)),
      e.pageSize && g.value > 1 ? (t(), n("div", _0, [
        l("p", P0, " Page " + f(p.value) + " of " + f(g.value), 1),
        l("div", L0, [
          l("button", {
            type: "button",
            class: "rounded-md border bg-background px-2.5 py-1 text-xs font-medium disabled:opacity-40",
            disabled: p.value <= 1,
            onClick: Y[5] || (Y[5] = (G) => F(p.value - 1))
          }, " Previous ", 8, O0),
          l("button", {
            type: "button",
            class: "rounded-md border bg-background px-2.5 py-1 text-xs font-medium disabled:opacity-40",
            disabled: p.value >= g.value,
            onClick: Y[6] || (Y[6] = (G) => F(p.value + 1))
          }, " Next ", 8, j0)
        ])
      ])) : b("", !0)
    ], 2));
  }
}), V0 = ["aria-disabled"], D0 = ["disabled"], T0 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, I0 = ["d"], E0 = {
  class: "min-w-6 px-1 text-center text-sm tabular-nums",
  "aria-live": "polite"
}, F0 = ["disabled"], N0 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, R0 = ["d"], U0 = /* @__PURE__ */ L({
  __name: "PkQtyStepper",
  props: /* @__PURE__ */ Ne({
    min: { default: 1 },
    max: { default: null },
    disabled: { type: Boolean, default: !1 }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ Ne(["decrease", "increase"], ["update:modelValue"]),
  setup(e, { emit: o }) {
    const a = vt(e, "modelValue"), r = o, s = y(() => a.value <= e.min), i = y(() => e.max !== null && a.value >= e.max);
    function d(u) {
      if (e.disabled)
        return;
      const c = a.value + u;
      c < e.min || e.max !== null && c > e.max || (a.value = c, u < 0 ? r("decrease", c) : r("increase", c));
    }
    return (u, c) => (t(), n("div", {
      class: "inline-flex h-8 items-center rounded-md border",
      "data-slot": "qty-stepper",
      role: "group",
      "aria-disabled": e.disabled ? "true" : void 0
    }, [
      l("button", {
        type: "button",
        class: "hover:bg-muted inline-flex size-8 items-center justify-center disabled:opacity-40",
        disabled: e.disabled || s.value,
        "aria-label": "Decrease quantity",
        onClick: c[0] || (c[0] = (v) => d(-1))
      }, [
        (t(), n("svg", T0, [
          l("path", {
            d: x(me)("minus")
          }, null, 8, I0)
        ]))
      ], 8, D0),
      l("span", E0, f(a.value), 1),
      l("button", {
        type: "button",
        class: "hover:bg-muted inline-flex size-8 items-center justify-center disabled:opacity-40",
        disabled: e.disabled || i.value,
        "aria-label": "Increase quantity",
        onClick: c[1] || (c[1] = (v) => d(1))
      }, [
        (t(), n("svg", N0, [
          l("path", {
            d: x(me)("plus")
          }, null, 8, R0)
        ]))
      ], 8, F0)
    ], 8, V0));
  }
}), H0 = { class: "divide-border flex flex-col divide-y" }, q0 = { class: "min-w-0" }, K0 = { class: "truncate text-sm font-medium" }, G0 = {
  key: 0,
  class: "text-muted-foreground mt-0.5 truncate text-xs"
}, W0 = { class: "flex shrink-0 items-center gap-2 text-sm" }, Z0 = {
  key: 1,
  class: "text-muted-foreground tabular-nums"
}, J0 = {
  key: 2,
  class: "font-medium tabular-nums"
}, Y0 = ["aria-label", "onClick"], Q0 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, X0 = ["d"], e2 = /* @__PURE__ */ L({
  __name: "LineItems",
  props: {
    items: {},
    editable: { type: Boolean, default: !1 }
  },
  emits: ["qty", "remove"],
  setup(e, { emit: o }) {
    const a = o;
    function r(s) {
      const i = s.qty;
      if (typeof i == "number" && Number.isFinite(i))
        return i;
      const d = Number(i);
      return Number.isFinite(d) && d > 0 ? d : 1;
    }
    return (s, i) => (t(), n("div", H0, [
      (t(!0), n(_, null, j(e.items, (d) => (t(), n("div", {
        key: d.key,
        class: "flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
      }, [
        l("div", q0, [
          l("p", K0, f(d.label), 1),
          d.detail ? (t(), n("p", G0, f(d.detail), 1)) : b("", !0)
        ]),
        l("div", W0, [
          e.editable ? (t(), T(U0, {
            key: 0,
            "model-value": r(d),
            "onUpdate:modelValue": (u) => a("qty", d.key, u)
          }, null, 8, ["model-value", "onUpdate:modelValue"])) : d.qty !== null && d.qty !== void 0 && d.qty !== "" ? (t(), n("span", Z0, " ×" + f(d.qty), 1)) : b("", !0),
          d.amount ? (t(), n("span", J0, f(d.amount), 1)) : b("", !0),
          d.status ? (t(), T($e, {
            key: 3,
            status: d.status,
            tone: d.tone
          }, null, 8, ["status", "tone"])) : b("", !0),
          e.editable ? (t(), n("button", {
            key: 4,
            type: "button",
            class: "text-muted-foreground hover:text-destructive inline-flex size-8 items-center justify-center rounded-md",
            "aria-label": `Remove ${d.label}`,
            onClick: (u) => a("remove", d.key)
          }, [
            (t(), n("svg", Q0, [
              l("path", {
                d: x(me)("trash")
              }, null, 8, X0)
            ]))
          ], 8, Y0)) : b("", !0)
        ])
      ]))), 128))
    ]));
  }
}), t2 = {
  "data-slot": "cart-panel",
  class: "bg-card flex flex-col overflow-hidden rounded-lg border"
}, n2 = { class: "border-b px-4 py-3" }, a2 = { class: "text-sm font-medium" }, l2 = { class: "flex-1 px-4 py-3" }, o2 = {
  key: 0,
  class: "text-muted-foreground py-8 text-center text-sm",
  "data-slot": "cart-empty"
}, s2 = { class: "text-foreground block font-medium" }, r2 = { class: "mt-1 block" }, i2 = {
  key: 0,
  class: "flex flex-col gap-2 border-t px-4 py-3"
}, d2 = {
  key: 0,
  class: "flex items-center justify-between text-sm"
}, u2 = { class: "tabular-nums" }, c2 = {
  key: 1,
  class: "flex items-center justify-between text-sm",
  "data-slot": "cart-discount"
}, f2 = { class: "text-muted-foreground" }, m2 = {
  key: 0,
  class: "tabular-nums"
}, p2 = {
  key: 2,
  class: "flex items-center justify-between text-sm"
}, v2 = { class: "text-muted-foreground" }, g2 = { class: "tabular-nums" }, h2 = {
  key: 3,
  class: "flex items-center justify-between text-sm font-semibold"
}, b2 = { class: "tabular-nums" }, y2 = {
  key: 4,
  class: "pt-1"
}, x2 = /* @__PURE__ */ L({
  __name: "CartPanel",
  props: {
    items: {},
    title: { default: "Cart" },
    emptyTitle: { default: "Cart is empty" },
    emptyDescription: { default: "Select a product to add it." },
    subtotal: { default: null },
    discountLabel: { default: "Discount" },
    discount: { default: null },
    taxLabel: { default: "Tax" },
    tax: { default: null },
    total: { default: null }
  },
  emits: ["qty", "remove"],
  setup(e, { emit: o }) {
    const a = o;
    return (r, s) => (t(), n("aside", t2, [
      l("header", n2, [
        l("h2", a2, f(e.title), 1)
      ]),
      l("div", l2, [
        e.items.length === 0 ? (t(), n("p", o2, [
          l("span", s2, f(e.emptyTitle), 1),
          l("span", r2, f(e.emptyDescription), 1)
        ])) : (t(), T(e2, {
          key: 1,
          items: e.items,
          editable: "",
          onQty: s[0] || (s[0] = (i, d) => a("qty", i, d)),
          onRemove: s[1] || (s[1] = (i) => a("remove", i))
        }, null, 8, ["items"]))
      ]),
      e.items.length > 0 ? (t(), n("footer", i2, [
        e.subtotal ? (t(), n("div", d2, [
          s[2] || (s[2] = l("span", { class: "text-muted-foreground" }, "Subtotal", -1)),
          l("span", u2, f(e.subtotal), 1)
        ])) : b("", !0),
        e.discount || r.$slots.discount ? (t(), n("div", c2, [
          l("span", f2, f(e.discountLabel), 1),
          e.discount ? (t(), n("span", m2, f(e.discount), 1)) : b("", !0),
          K(r.$slots, "discount")
        ])) : b("", !0),
        e.tax ? (t(), n("div", p2, [
          l("span", v2, f(e.taxLabel), 1),
          l("span", g2, f(e.tax), 1)
        ])) : b("", !0),
        e.total ? (t(), n("div", h2, [
          s[3] || (s[3] = l("span", null, "Total", -1)),
          l("span", b2, f(e.total), 1)
        ])) : b("", !0),
        r.$slots.pay ? (t(), n("div", y2, [
          K(r.$slots, "pay")
        ])) : b("", !0)
      ])) : b("", !0)
    ]));
  }
});
function Fe() {
  return { query: "", selected: {}, ranges: {} };
}
function k2(e, o) {
  const a = e.metrics?.[o];
  if (typeof a == "number" && Number.isFinite(a))
    return a;
  const r = e.facets?.[o];
  if (r == null || r === "")
    return null;
  const s = Number(r);
  return Number.isFinite(s) ? s : null;
}
function $2(e, o) {
  return !o || o.min === null && o.max === null ? !0 : !(e === null || o.min !== null && e < o.min || o.max !== null && e > o.max);
}
function pn(e, o) {
  const a = o.query.trim().toLowerCase();
  if (a !== "" && ![
    e.key,
    e.sku ?? "",
    e.label,
    e.caption ?? "",
    ...e.facts ?? []
  ].join(" ").toLowerCase().includes(a))
    return !1;
  for (const [r, s] of Object.entries(o.selected ?? {}))
    if (s && (e.facets?.[r] ?? null) !== s)
      return !1;
  for (const [r, s] of Object.entries(o.ranges ?? {}))
    if (!$2(k2(e, r), s))
      return !1;
  return !0;
}
function w2(e, o) {
  const a = o.trim().toLowerCase();
  return a === "" ? null : e.find((r) => {
    const s = (r.sku ?? "").trim().toLowerCase(), i = r.key.trim().toLowerCase();
    return s === a || i === a;
  }) ?? null;
}
function _t(e) {
  return e.query.trim() !== "" || Object.values(e.selected ?? {}).some(Boolean) ? !0 : Object.values(e.ranges ?? {}).some(
    (o) => o.min !== null || o.max !== null
  );
}
const C2 = { class: "flex flex-col gap-6" }, S2 = {
  key: 0,
  class: "flex flex-col gap-1.5"
}, M2 = { class: "text-sm font-semibold" }, B2 = { class: "flex flex-wrap items-center gap-1.5" }, A2 = ["aria-pressed", "onClick"], z2 = { class: "text-sm font-semibold" }, _2 = { class: "flex flex-wrap items-center gap-1.5" }, P2 = { key: 0 }, ua = /* @__PURE__ */ L({
  __name: "CatalogFilterSheet",
  props: {
    open: { type: Boolean },
    title: { default: "Filters" },
    searchPlaceholder: { default: "Search…" },
    hideSearch: { type: Boolean, default: !1 },
    facets: {},
    applied: {},
    description: { default: "" }
  },
  emits: ["close", "apply", "reset"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(""), i = ft({}), d = ft({}), u = y(
      () => a.facets.filter((g) => (g.kind ?? "chips") === "chips")
    ), c = y(() => a.facets.filter((g) => g.kind === "range"));
    function v(g) {
      return g == null ? "" : String(g);
    }
    function m() {
      s.value = a.applied.query ?? "";
      for (const g of Object.keys(i))
        delete i[g];
      for (const [g, M] of Object.entries(a.applied.selected ?? {}))
        i[g] = M;
      for (const g of Object.keys(d))
        delete d[g];
      for (const [g, M] of Object.entries(a.applied.ranges ?? {}))
        d[g] = { min: v(M.min), max: v(M.max) };
    }
    pe(
      () => a.open,
      (g) => {
        g && m();
      }
    );
    function h(g) {
      const M = g.trim();
      if (M === "")
        return null;
      const F = Number(M);
      return Number.isFinite(F) ? F : null;
    }
    function w() {
      const g = {};
      for (const [M, F] of Object.entries(d))
        g[M] = { min: h(F.min), max: h(F.max) };
      return g;
    }
    function k() {
      return {
        query: a.hideSearch ? a.applied.query : s.value,
        selected: { ...i },
        ranges: w()
      };
    }
    const S = y(() => {
      let g = a.hideSearch || s.value.trim() === "" ? 0 : 1;
      for (const M of Object.values(i))
        M && (g += 1);
      for (const M of Object.values(w()))
        (M.min !== null || M.max !== null) && (g += 1);
      return g;
    });
    function C(g, M) {
      i[g] = i[g] === M ? null : M;
    }
    function B(g) {
      return d[g] ?? { min: "", max: "" };
    }
    function A(g, M, F) {
      const D = d[g] ?? { min: "", max: "" };
      d[g] = { ...D, [M]: F };
    }
    function $() {
      r("apply", k());
    }
    function p() {
      s.value = "";
      for (const g of Object.keys(i))
        i[g] = null;
      for (const g of Object.keys(d))
        d[g] = { min: "", max: "" };
      r("reset"), r(
        "apply",
        a.hideSearch ? { ...Fe(), query: a.applied.query } : Fe()
      );
    }
    return (g, M) => (t(), T(Pt, {
      open: e.open,
      title: e.title,
      description: e.description || (e.hideSearch ? "Category and stock for this list" : "Search, categories and ranges for this list"),
      size: "sm",
      onClose: M[2] || (M[2] = (F) => r("close"))
    }, {
      footer: O(() => [
        l("button", {
          type: "button",
          class: "text-muted-foreground mr-auto text-xs hover:underline",
          onClick: p
        }, " Reset all "),
        I(ce, {
          variant: "outline",
          size: "sm",
          onClick: M[1] || (M[1] = (F) => r("close"))
        }, {
          default: O(() => [...M[5] || (M[5] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }),
        I(ce, {
          size: "sm",
          onClick: $
        }, {
          default: O(() => [
            M[6] || (M[6] = U(" Apply", -1)),
            S.value ? (t(), n("span", P2, " (" + f(S.value) + ")", 1)) : b("", !0)
          ]),
          _: 1
        })
      ]),
      default: O(() => [
        l("div", C2, [
          e.hideSearch ? b("", !0) : (t(), n("label", S2, [
            M[3] || (M[3] = l("span", { class: "text-sm font-semibold" }, "Search", -1)),
            I(we, {
              modelValue: s.value,
              "onUpdate:modelValue": M[0] || (M[0] = (F) => s.value = F),
              type: "search",
              placeholder: e.searchPlaceholder,
              "aria-label": e.searchPlaceholder
            }, null, 8, ["modelValue", "placeholder", "aria-label"])
          ])),
          (t(!0), n(_, null, j(u.value, (F) => (t(), n("section", {
            key: F.key,
            class: "flex flex-col gap-2"
          }, [
            l("h3", M2, f(F.label ?? F.key), 1),
            l("div", B2, [
              (t(!0), n(_, null, j(F.options ?? [], (D) => (t(), n("button", {
                key: D.value,
                type: "button",
                class: z([
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  i[F.key] === D.value ? "border-foreground bg-foreground text-background" : "bg-background text-foreground hover:bg-muted/60"
                ]),
                "aria-pressed": i[F.key] === D.value ? "true" : "false",
                onClick: (Y) => C(F.key, D.value)
              }, f(D.label), 11, A2))), 128))
            ])
          ]))), 128)),
          (t(!0), n(_, null, j(c.value, (F) => (t(), n("section", {
            key: F.key,
            class: "flex flex-col gap-2"
          }, [
            l("h3", z2, f(F.label ?? F.key), 1),
            l("div", _2, [
              I(we, {
                type: "number",
                class: "h-8 w-24 px-2 text-xs",
                placeholder: "From",
                "aria-label": `${F.label ?? F.key} from`,
                "model-value": B(F.key).min,
                "onUpdate:modelValue": (D) => A(F.key, "min", String(D))
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
              M[4] || (M[4] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "to", -1)),
              I(we, {
                type: "number",
                class: "h-8 w-24 px-2 text-xs",
                placeholder: "To",
                "aria-label": `${F.label ?? F.key} to`,
                "model-value": B(F.key).max,
                "onUpdate:modelValue": (D) => A(F.key, "max", String(D))
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])
      ]),
      _: 1
    }, 8, ["open", "title", "description"]));
  }
}), L2 = {
  "data-slot": "catalog-till",
  class: "grid w-full items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
}, O2 = { class: "flex flex-col gap-4" }, j2 = { class: "flex flex-wrap items-start justify-between gap-3" }, V2 = { class: "flex items-center gap-2" }, D2 = {
  key: 0,
  class: "bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
}, dS = /* @__PURE__ */ L({
  __name: "CatalogTill",
  props: /* @__PURE__ */ Ne({
    items: {},
    facets: { default: () => [] },
    shelfTitle: { default: "Shelf" },
    shelfDescription: { default: "Tap a product, or type a SKU and press Enter." },
    searchPlaceholder: { default: "Search or scan SKU…" },
    cartTitle: { default: "Cart" },
    taxRate: { default: 0 },
    taxLabel: { default: "Tax" },
    discountRate: { default: 0 },
    discountLabel: { default: "Discount" },
    formatMoney: { type: Function, default: (e) => new Intl.NumberFormat(void 0, { maximumFractionDigits: 0 }).format(
      Math.round(e)
    ) },
    parsePrice: { type: Function, default: (e) => Number(String(e.price ?? "").replace(/[^\d.]/g, "")) || 0 }
  }, {
    cart: { default: () => [] },
    cartModifiers: {}
  }),
  emits: /* @__PURE__ */ Ne(["select", "pay"], ["update:cart"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(Fe()), i = q(!1), d = vt(e, "cart"), u = q(!1), c = y(
      () => a.items.filter((G) => pn(G, s.value))
    );
    function v(G) {
      s.value = { ...s.value, query: G.query };
    }
    function m(G) {
      s.value = {
        ...s.value,
        selected: G.selected,
        ranges: G.ranges,
        query: s.value.query
      }, i.value = !1;
    }
    function h(G) {
      return G ? a.parsePrice(G) : 0;
    }
    function w(G, Z, W) {
      return {
        ...G,
        qty: Z,
        amount: a.formatMoney(W * Z)
      };
    }
    function k(G) {
      const Z = w2(a.items, G);
      Z && S(Z.key);
    }
    function S(G) {
      const Z = a.items.find((N) => N.key === G);
      if (!Z || Z.status === "out-of-stock")
        return;
      u.value = !1;
      const W = h(Z);
      if (d.value.find((N) => N.key === G)) {
        d.value = d.value.map(
          (N) => N.key === G ? w(N, Number(N.qty ?? 1) + 1, W) : N
        );
        return;
      }
      d.value = [
        ...d.value,
        {
          key: Z.key,
          label: Z.label,
          detail: Z.caption ?? null,
          qty: 1,
          amount: a.formatMoney(W)
        }
      ];
    }
    function C(G, Z) {
      const W = a.items.find((N) => N.key === G), H = h(W);
      d.value = d.value.map((N) => N.key === G ? w(N, Z, H) : N);
    }
    function B(G) {
      d.value = d.value.filter((Z) => Z.key !== G);
    }
    const A = y(
      () => d.value.reduce((G, Z) => {
        const W = a.items.find((H) => H.key === Z.key);
        return G + h(W) * Number(Z.qty ?? 1);
      }, 0)
    ), $ = y(
      () => a.discountRate > 0 ? Math.round(A.value * a.discountRate) : 0
    ), p = y(
      () => Math.round((A.value - $.value) * a.taxRate)
    ), g = y(() => d.value.length ? a.formatMoney(A.value) : null), M = y(
      () => d.value.length && $.value > 0 ? `−${a.formatMoney($.value)}` : null
    ), F = y(
      () => d.value.length && a.taxRate > 0 ? a.formatMoney(p.value) : null
    ), D = y(
      () => d.value.length ? a.formatMoney(A.value - $.value + p.value) : null
    );
    function Y() {
      u.value = !0, r("pay", d.value);
    }
    return (G, Z) => (t(), n(_, null, [
      l("div", L2, [
        l("section", O2, [
          l("div", j2, [
            I(Ee, {
              variant: "small",
              title: e.shelfTitle,
              description: e.shelfDescription ?? void 0
            }, null, 8, ["title", "description"]),
            l("div", V2, [
              x(_t)(s.value) ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "text-muted-foreground hover:text-foreground text-xs hover:underline",
                onClick: Z[0] || (Z[0] = (W) => s.value = {
                  ...x(Fe)(),
                  query: s.value.query
                })
              }, " Clear ")) : b("", !0),
              e.facets.length > 0 ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "relative inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
                onClick: Z[1] || (Z[1] = (W) => i.value = !0)
              }, [
                Z[5] || (Z[5] = l("svg", {
                  viewBox: "0 0 24 24",
                  class: "size-4",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  l("path", { d: "M3 5h18M6 12h12M10 19h4" })
                ], -1)),
                Z[6] || (Z[6] = U(" Filters ", -1)),
                x(_t)(s.value) ? (t(), n("span", D2, " on ")) : b("", !0)
              ])) : b("", !0)
            ])
          ]),
          I(mn, {
            searchable: "",
            autofocus: "",
            "search-placeholder": e.searchPlaceholder,
            items: c.value,
            onFilter: v,
            onSelect: Z[2] || (Z[2] = (W) => r("select", W)),
            onCart: S,
            onScan: k
          }, null, 8, ["search-placeholder", "items"])
        ]),
        I(x2, {
          class: "lg:sticky lg:top-4",
          title: e.cartTitle,
          items: d.value,
          subtotal: g.value,
          "discount-label": e.discountLabel,
          discount: M.value,
          "tax-label": e.taxLabel,
          tax: F.value,
          total: D.value,
          onQty: C,
          onRemove: B
        }, {
          pay: O(() => [
            K(G.$slots, "pay", {
              cart: d.value,
              paid: u.value,
              pay: Y
            }, () => [
              I(ce, {
                class: "w-full",
                disabled: d.value.length === 0,
                onClick: Y
              }, {
                default: O(() => [
                  U(f(u.value ? "Paid" : "Pay"), 1)
                ]),
                _: 1
              }, 8, ["disabled"])
            ])
          ]),
          _: 3
        }, 8, ["title", "items", "subtotal", "discount-label", "discount", "tax-label", "tax", "total"])
      ]),
      I(ua, {
        open: i.value,
        title: "Filter shelf",
        "hide-search": "",
        facets: e.facets,
        applied: s.value,
        onClose: Z[3] || (Z[3] = (W) => i.value = !1),
        onApply: m,
        onReset: Z[4] || (Z[4] = (W) => s.value = { ...x(Fe)(), query: s.value.query })
      }, null, 8, ["open", "facets", "applied"])
    ], 64));
  }
}), T2 = {
  key: 0,
  class: "flex flex-col gap-5"
}, I2 = { class: "bg-muted aspect-[4/3] overflow-hidden rounded-lg" }, E2 = ["src", "alt"], F2 = {
  key: 0,
  class: "flex gap-2 overflow-x-auto"
}, N2 = ["src"], R2 = { class: "flex items-start justify-between gap-3" }, U2 = { class: "text-lg font-semibold tabular-nums" }, H2 = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, q2 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, K2 = { class: "grid grid-cols-2 gap-3" }, G2 = { class: "flex flex-col gap-2" }, W2 = { class: "text-xs font-semibold tracking-wide text-muted-foreground uppercase" }, uS = /* @__PURE__ */ L({
  __name: "CatalogInspect",
  props: {
    open: { type: Boolean },
    item: {}
  },
  emits: ["close", "cart"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s(m) {
      let h = 0;
      for (const w of m)
        h = h * 31 + w.charCodeAt(0) >>> 0;
      return h;
    }
    function i(m, h) {
      return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((k, S) => ({
        label: k,
        value: Math.max(0, Math.round(m + Math.sin(S + h) * m * 0.18))
      }));
    }
    const d = y(() => a.item?.kind === "unit"), u = y(() => {
      const m = a.item;
      if (!m)
        return [];
      const h = m.stock ?? m.progress?.value ?? m.metrics?.price ?? m.metrics?.rent ?? 12;
      return i(Number(h) || 12, s(m.key) % 7);
    }), c = y(() => {
      const m = a.item;
      if (!m)
        return [];
      const h = m.progress?.value ?? (m.status === "occupied" ? 80 : 20);
      return i(Number(h) || 20, s(m.key) % 5 + 1);
    }), v = y(
      () => !!a.item && !d.value && a.item?.status !== "out-of-stock"
    );
    return (m, h) => (t(), T(Pt, {
      open: e.open,
      title: e.item?.label ?? "Item",
      description: e.item?.caption ?? e.item?.sku ?? null,
      size: "md",
      onClose: h[1] || (h[1] = (w) => r("close"))
    }, ct({
      default: O(() => [
        e.item ? (t(), n("div", T2, [
          l("div", I2, [
            e.item.image ? (t(), n("img", {
              key: 0,
              src: e.item.image,
              alt: e.item.label,
              class: "size-full object-cover"
            }, null, 8, E2)) : b("", !0)
          ]),
          e.item.images?.length ? (t(), n("div", F2, [
            (t(!0), n(_, null, j(e.item.images, (w, k) => (t(), n("img", {
              key: k,
              src: w,
              alt: "",
              class: "size-16 shrink-0 rounded-md object-cover"
            }, null, 8, N2))), 128))
          ])) : b("", !0),
          l("div", R2, [
            l("div", null, [
              l("p", U2, f(e.item.price), 1),
              typeof e.item.stock == "number" ? (t(), n("p", H2, f(e.item.stock) + " in stock ", 1)) : b("", !0)
            ]),
            e.item.status ? (t(), T($e, {
              key: 0,
              status: e.item.status,
              tone: e.item.tone
            }, null, 8, ["status", "tone"])) : b("", !0)
          ]),
          e.item.facts?.length ? (t(), n("p", q2, f(e.item.facts.join(" · ")), 1)) : b("", !0),
          l("div", K2, [
            I(zt, {
              label: d.value ? "Occupancy" : "Stock",
              value: d.value ? `${e.item.progress?.value ?? 0}%` : String(e.item.stock ?? e.item.progress?.value ?? 0),
              series: d.value ? c.value : u.value
            }, null, 8, ["label", "value", "series"]),
            I(zt, {
              label: "Price",
              value: e.item.price ?? "-",
              series: u.value
            }, null, 8, ["value", "series"])
          ]),
          l("div", G2, [
            l("p", W2, f(d.value ? "Occupancy, last 6 months" : "Stock movement, last 6 months"), 1),
            I(Ot, {
              data: d.value ? c.value : u.value,
              height: 72,
              filled: ""
            }, null, 8, ["data"])
          ])
        ])) : b("", !0)
      ]),
      _: 2
    }, [
      v.value && e.item ? {
        name: "footer",
        fn: O(() => [
          l("button", {
            type: "button",
            class: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
            onClick: h[0] || (h[0] = (w) => r("cart", e.item.key))
          }, " Add to cart ")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["open", "title", "description"]));
  }
}), Z2 = { class: "flex flex-col gap-10" }, J2 = { class: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" }, Y2 = { class: "flex flex-col gap-3" }, Q2 = { class: "bg-muted aspect-[4/3] overflow-hidden rounded-lg border" }, X2 = ["src", "alt"], ek = {
  key: 0,
  class: "flex gap-2 overflow-x-auto"
}, tk = ["aria-label", "aria-pressed", "onClick"], nk = ["src"], ak = { class: "flex flex-col gap-5" }, lk = { class: "flex flex-wrap items-start justify-between gap-3" }, ok = { class: "min-w-0" }, sk = { class: "text-2xl font-semibold tracking-tight" }, rk = { class: "text-muted-foreground mt-1 text-sm" }, ik = { class: "text-2xl font-semibold tabular-nums" }, dk = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, uk = { class: "grid grid-cols-2 gap-3 text-sm" }, ck = {
  key: 0,
  class: "rounded-lg border p-3"
}, fk = { class: "mt-1 font-medium" }, mk = { class: "rounded-lg border p-3" }, pk = { class: "text-muted-foreground text-xs font-medium tracking-wide uppercase" }, vk = { class: "mt-1 font-medium" }, gk = { class: "flex flex-col gap-4" }, hk = { class: "grid gap-4 sm:grid-cols-2" }, bk = { class: "bg-card rounded-lg border p-4" }, yk = { class: "mb-3 text-sm font-medium" }, xk = /* @__PURE__ */ L({
  __name: "CatalogItemDetail",
  props: {
    item: {}
  },
  emits: ["cart"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s(k) {
      let S = 0;
      for (const C of k)
        S = S * 31 + C.charCodeAt(0) >>> 0;
      return S;
    }
    function i(k, S) {
      return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((B, A) => ({
        label: B,
        value: Math.max(0, Math.round(k + Math.sin(A + S) * k * 0.18))
      }));
    }
    const d = y(() => a.item.kind === "unit"), u = y(() => {
      const k = [a.item.image, ...a.item.images ?? []].filter(
        (S) => typeof S == "string" && S !== ""
      );
      return [...new Set(k)];
    }), c = q(0), v = y(() => {
      const k = a.item.stock ?? a.item.progress?.value ?? a.item.metrics?.price ?? a.item.metrics?.rent ?? 12;
      return i(Number(k) || 12, s(a.item.key) % 7);
    }), m = y(() => {
      const k = a.item.progress?.value ?? (a.item.status === "occupied" ? 80 : 20);
      return i(Number(k) || 20, s(a.item.key) % 5 + 1);
    }), h = y(() => d.value ? m.value : v.value), w = y(() => !d.value && a.item.status !== "out-of-stock");
    return (k, S) => (t(), n("div", Z2, [
      l("div", J2, [
        l("div", Y2, [
          l("div", Q2, [
            u.value[c.value] ? (t(), n("img", {
              key: 0,
              src: u.value[c.value],
              alt: e.item.label,
              class: "size-full object-cover"
            }, null, 8, X2)) : b("", !0)
          ]),
          u.value.length > 1 ? (t(), n("div", ek, [
            (t(!0), n(_, null, j(u.value, (C, B) => (t(), n("button", {
              key: C,
              type: "button",
              class: z(["size-16 shrink-0 overflow-hidden rounded-md border", B === c.value ? "ring-2 ring-foreground" : "opacity-80"]),
              "aria-label": `Photo ${B + 1}`,
              "aria-pressed": B === c.value ? "true" : "false",
              onClick: (A) => c.value = B
            }, [
              l("img", {
                src: C,
                alt: "",
                class: "size-full object-cover"
              }, null, 8, nk)
            ], 10, tk))), 128))
          ])) : b("", !0)
        ]),
        l("div", ak, [
          l("div", lk, [
            l("div", ok, [
              l("h1", sk, f(e.item.label), 1),
              l("p", rk, f(e.item.caption ?? e.item.sku), 1)
            ]),
            e.item.status ? (t(), T($e, {
              key: 0,
              status: e.item.status,
              tone: e.item.tone
            }, null, 8, ["status", "tone"])) : b("", !0)
          ]),
          l("p", ik, f(e.item.price), 1),
          e.item.facts?.length ? (t(), n("p", dk, f(e.item.facts.join(" · ")), 1)) : b("", !0),
          l("dl", uk, [
            e.item.sku ? (t(), n("div", ck, [
              S[1] || (S[1] = l("dt", { class: "text-muted-foreground text-xs font-medium tracking-wide uppercase" }, " SKU ", -1)),
              l("dd", fk, f(e.item.sku), 1)
            ])) : b("", !0),
            l("div", mk, [
              l("dt", pk, f(d.value ? "Occupancy" : "Stock"), 1),
              l("dd", vk, f(d.value ? `${e.item.progress?.value ?? 0}%` : `${e.item.stock ?? e.item.progress?.value ?? 0} in stock`), 1)
            ])
          ]),
          w.value ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2.5 text-sm font-medium sm:w-auto",
            onClick: S[0] || (S[0] = (C) => r("cart", e.item.key))
          }, " Add to cart ")) : b("", !0)
        ])
      ]),
      l("section", gk, [
        S[2] || (S[2] = l("h2", { class: "text-sm font-semibold tracking-wide text-muted-foreground uppercase" }, " Analytics ", -1)),
        l("div", hk, [
          I(zt, {
            label: d.value ? "Occupancy" : "Stock",
            value: d.value ? `${e.item.progress?.value ?? 0}%` : String(e.item.stock ?? e.item.progress?.value ?? 0),
            series: h.value
          }, null, 8, ["label", "value", "series"]),
          I(zt, {
            label: "Price",
            value: e.item.price ?? "-",
            series: v.value
          }, null, 8, ["value", "series"])
        ]),
        l("div", bk, [
          l("p", yk, f(d.value ? "Occupancy, last 6 months" : "Stock movement, last 6 months"), 1),
          I(Q1, {
            data: h.value,
            type: "area",
            height: 220
          }, null, 8, ["data"])
        ])
      ])
    ]));
  }
}), kk = ["href"], cS = /* @__PURE__ */ L({
  __name: "CatalogItemView",
  props: {
    item: {},
    catalogHref: { default: "/catalog" },
    backLabel: { default: "Back to catalog" },
    embedded: { type: Boolean, default: !0 }
  },
  emits: ["cart"],
  setup(e, { emit: o }) {
    const a = o;
    return (r, s) => (t(), n("div", {
      class: z(["flex w-full flex-col gap-8", e.embedded ? "" : x(lt)])
    }, [
      l("a", {
        href: e.catalogHref,
        class: "text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm"
      }, [
        s[1] || (s[1] = l("svg", {
          class: "size-4",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "aria-hidden": "true"
        }, [
          l("path", { d: "m15 18-6-6 6-6" })
        ], -1)),
        U(" " + f(e.backLabel), 1)
      ], 8, kk),
      I(xk, {
        item: e.item,
        onCart: s[0] || (s[0] = (i) => a("cart", i))
      }, null, 8, ["item"])
    ], 2));
  }
}), $k = {
  key: 0,
  class: "inline-flex w-fit rounded-md border",
  role: "tablist",
  "aria-label": "Catalog section"
}, wk = ["aria-selected", "onClick"], Ck = {
  class: "flex flex-wrap items-center gap-2 sm:flex-nowrap",
  "data-slot": "catalog-page-toolbar"
}, Sk = {
  key: 0,
  class: "bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
}, Mk = {
  class: "ml-auto inline-flex shrink-0 rounded-md border",
  role: "group",
  "aria-label": "Layout"
}, Bk = ["aria-pressed"], Ak = ["aria-pressed"], fS = /* @__PURE__ */ L({
  __name: "CatalogBrowser",
  props: /* @__PURE__ */ Ne({
    title: { default: "Catalog" },
    description: { default: null },
    tabs: {},
    pageSize: { default: 8 },
    embedded: { type: Boolean, default: !0 }
  }, {
    layout: { default: "grid" },
    layoutModifiers: {}
  }),
  emits: /* @__PURE__ */ Ne(["select", "cart"], ["update:layout"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(a.tabs[0]?.key ?? ""), i = vt(e, "layout"), d = q({}), u = q(!1);
    pe(
      () => a.tabs.map((C) => C.key).join(","),
      (C) => {
        C.split(",").includes(s.value) || (s.value = a.tabs[0]?.key ?? "");
      }
    );
    function c(C) {
      return d.value[C] ?? Fe();
    }
    const v = y(
      () => a.tabs.find((C) => C.key === s.value) ?? a.tabs[0] ?? null
    ), m = y(
      () => v.value ? c(v.value.key) : Fe()
    ), h = y(() => {
      const C = v.value;
      return C ? C.items.filter((B) => pn(B, c(C.key))) : [];
    });
    function w(C) {
      const B = v.value?.key;
      B && (d.value = {
        ...d.value,
        [B]: { ...c(B), query: C }
      });
    }
    function k() {
      const C = v.value?.key;
      C && (d.value = { ...d.value, [C]: Fe() });
    }
    function S(C) {
      const B = v.value?.key;
      B && (d.value = { ...d.value, [B]: C }, u.value = !1);
    }
    return (C, B) => (t(), n(_, null, [
      l("div", {
        class: z(["flex w-full flex-col gap-8", e.embedded ? "" : x(lt)])
      }, [
        I(Ee, {
          title: e.title,
          description: e.description ?? void 0
        }, null, 8, ["title", "description"]),
        e.tabs.length > 1 ? (t(), n("div", $k, [
          (t(!0), n(_, null, j(e.tabs, (A) => (t(), n("button", {
            key: A.key,
            type: "button",
            class: z([
              "rounded px-3 py-1.5 text-sm transition-colors",
              s.value === A.key ? "bg-foreground text-background font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            ]),
            role: "tab",
            "aria-selected": s.value === A.key ? "true" : "false",
            onClick: ($) => s.value = A.key
          }, f(A.label), 11, wk))), 128))
        ])) : b("", !0),
        l("div", Ck, [
          I(we, {
            class: "min-w-0 w-full flex-1 sm:max-w-xs",
            "model-value": m.value.query,
            type: "search",
            placeholder: v.value?.searchPlaceholder ?? "Search…",
            "aria-label": v.value?.searchPlaceholder ?? "Search",
            "onUpdate:modelValue": B[0] || (B[0] = (A) => w(String(A)))
          }, null, 8, ["model-value", "placeholder", "aria-label"]),
          x(_t)(m.value) ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline",
            onClick: k
          }, " Clear ")) : b("", !0),
          (v.value?.facets ?? []).length > 0 ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "relative inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
            onClick: B[1] || (B[1] = (A) => u.value = !0)
          }, [
            B[8] || (B[8] = l("svg", {
              viewBox: "0 0 24 24",
              class: "size-4",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2"
            }, [
              l("path", { d: "M3 5h18M6 12h12M10 19h4" })
            ], -1)),
            B[9] || (B[9] = U(" Filters ", -1)),
            x(_t)(m.value) ? (t(), n("span", Sk, " on ")) : b("", !0)
          ])) : b("", !0),
          l("div", Mk, [
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "grid" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "grid" ? "true" : "false",
              "aria-label": "Grid",
              onClick: B[2] || (B[2] = (A) => i.value = "grid")
            }, " Tiles ", 10, Bk),
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "list" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "list" ? "true" : "false",
              "aria-label": "List",
              onClick: B[3] || (B[3] = (A) => i.value = "list")
            }, " List ", 10, Ak)
          ])
        ]),
        I(mn, {
          layout: i.value,
          "onUpdate:layout": B[4] || (B[4] = (A) => i.value = A),
          "page-size": e.pageSize,
          items: h.value,
          onSelect: B[5] || (B[5] = (A) => r("select", A)),
          onCart: B[6] || (B[6] = (A) => r("cart", A))
        }, null, 8, ["layout", "page-size", "items"])
      ], 2),
      I(ua, {
        open: u.value,
        title: v.value?.filterTitle ?? "Filters",
        "search-placeholder": v.value?.searchPlaceholder ?? "Search…",
        facets: v.value?.facets ?? [],
        applied: m.value,
        onClose: B[7] || (B[7] = (A) => u.value = !1),
        onApply: S,
        onReset: k
      }, null, 8, ["open", "title", "search-placeholder", "facets", "applied"])
    ], 64));
  }
}), zk = { class: "flex flex-col gap-4" }, _k = { class: "flex flex-col gap-4" }, mS = /* @__PURE__ */ L({
  __name: "CatalogRegister",
  props: {
    title: { default: "Register" },
    description: { default: null },
    cardsTitle: { default: "Units" },
    cardsDescription: { default: null },
    tableTitle: { default: "Register" },
    tableDescription: { default: null },
    cards: { default: () => [] },
    facets: { default: () => [] },
    rows: { default: () => [] },
    columns: { default: () => [] },
    searchPlaceholder: { default: "Search…" },
    emptyTitle: { default: "Nothing here" },
    embedded: { type: Boolean, default: !0 }
  },
  emits: ["select", "cart"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(Fe()), i = y(
      () => a.cards.filter((d) => pn(d, s.value))
    );
    return (d, u) => (t(), n("div", {
      class: z(["flex w-full flex-col gap-10", e.embedded ? "" : x(lt)])
    }, [
      I(Ee, {
        title: e.title,
        description: e.description ?? void 0
      }, null, 8, ["title", "description"]),
      l("section", zk, [
        I(Ee, {
          variant: "small",
          title: e.cardsTitle,
          description: e.cardsDescription ?? void 0
        }, null, 8, ["title", "description"]),
        I(mn, {
          searchable: "",
          "layout-toggle": "",
          "search-placeholder": e.searchPlaceholder,
          facets: e.facets,
          items: i.value,
          onFilter: u[0] || (u[0] = (c) => s.value = c),
          onSelect: u[1] || (u[1] = (c) => r("select", c)),
          onCart: u[2] || (u[2] = (c) => r("cart", c))
        }, null, 8, ["search-placeholder", "facets", "items"])
      ]),
      l("section", _k, [
        I(Ee, {
          variant: "small",
          title: e.tableTitle,
          description: e.tableDescription ?? void 0
        }, null, 8, ["title", "description"]),
        I(go, {
          columns: e.columns,
          rows: e.rows,
          "empty-title": e.emptyTitle
        }, {
          "cell:status": O(({ value: c }) => [
            I($e, {
              status: String(c)
            }, {
              default: O(() => [
                U(f(c), 1)
              ]),
              _: 2
            }, 1032, ["status"])
          ]),
          _: 1
        }, 8, ["columns", "rows", "empty-title"])
      ])
    ], 2));
  }
}), Pk = {
  class: "flex flex-col gap-2",
  "data-slot": "signature-pad"
}, Lk = { class: "text-sm font-medium" }, Ok = ["width", "height", "aria-label"], jk = { class: "flex items-center gap-2" }, Vk = /* @__PURE__ */ L({
  __name: "PkSignaturePad",
  props: {
    width: { default: 480 },
    height: { default: 160 },
    disabled: { type: Boolean, default: !1 },
    label: { default: "Draw your signature" }
  },
  emits: ["save", "clear"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(null), i = q(!1);
    let d = null;
    function u() {
      return s.value?.getContext("2d") ?? null;
    }
    function c(C) {
      const B = s.value;
      if (!B)
        return null;
      const A = B.getBoundingClientRect(), $ = B.width / A.width, p = B.height / A.height;
      return {
        x: (C.clientX - A.left) * $,
        y: (C.clientY - A.top) * p
      };
    }
    function v(C) {
      a.disabled || (i.value = !0, d = c(C), s.value?.setPointerCapture(C.pointerId));
    }
    function m(C) {
      if (!i.value || a.disabled)
        return;
      const B = u(), A = c(C);
      !B || !A || !d || (B.strokeStyle = "#111827", B.lineWidth = 2.4, B.lineCap = "round", B.lineJoin = "round", B.beginPath(), B.moveTo(d.x, d.y), B.lineTo(A.x, A.y), B.stroke(), d = A);
    }
    function h() {
      i.value = !1, d = null;
    }
    function w() {
      const C = s.value, B = u();
      !C || !B || (B.clearRect(0, 0, C.width, C.height), r("clear"));
    }
    function k() {
      const C = s.value;
      C && r("save", C.toDataURL("image/png"));
    }
    function S() {
      const C = s.value, B = u();
      !C || !B || (B.fillStyle = "#ffffff", B.fillRect(0, 0, C.width, C.height));
    }
    return be(S), ke(() => {
      i.value = !1;
    }), (C, B) => (t(), n("div", Pk, [
      l("p", Lk, f(e.label), 1),
      l("canvas", {
        ref_key: "canvas",
        ref: s,
        width: e.width,
        height: e.height,
        class: z(["bg-background w-full max-w-full cursor-crosshair touch-none rounded-md border", e.disabled ? "pointer-events-none opacity-50" : ""]),
        "aria-label": e.label,
        onPointerdown: he(v, ["prevent"]),
        onPointermove: he(m, ["prevent"]),
        onPointerup: he(h, ["prevent"]),
        onPointerleave: he(h, ["prevent"])
      }, null, 42, Ok),
      l("div", jk, [
        I(ce, {
          variant: "outline",
          size: "sm",
          disabled: e.disabled,
          onClick: w
        }, {
          default: O(() => [...B[0] || (B[0] = [
            U(" Clear ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        I(ce, {
          size: "sm",
          disabled: e.disabled,
          onClick: k
        }, {
          default: O(() => [...B[1] || (B[1] = [
            U("Save signature", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}), Dk = { class: "grid gap-8 lg:grid-cols-2" }, Tk = { class: "flex flex-col gap-3" }, Ik = { class: "text-muted-foreground text-xs font-normal" }, Ek = {
  key: 0,
  class: "flex flex-col gap-3"
}, Fk = { class: "flex flex-wrap gap-3" }, Nk = ["onClick"], Rk = ["src", "alt"], Uk = {
  key: 1,
  class: "flex flex-col gap-3"
}, Hk = { class: "flex flex-wrap gap-3" }, qk = ["onClick"], Kk = ["src", "alt"], Gk = {
  key: 2,
  class: "flex flex-col gap-4"
}, Wk = { class: "flex flex-wrap items-center gap-2" }, Zk = { class: "mx-auto w-full max-w-3xl overflow-hidden rounded-lg border shadow-sm" }, Jk = { class: "flex items-end justify-between gap-6 bg-white px-8 pb-8 text-black" }, Yk = { class: "flex flex-col gap-2" }, Qk = ["src"], Xk = {
  key: 1,
  class: "text-sm text-neutral-400"
}, e$ = ["src"], pS = /* @__PURE__ */ L({
  __name: "SignatureStudio",
  props: {
    title: { default: "Signatures" },
    description: { default: null },
    documents: { default: () => [] },
    storageKey: { default: null },
    embedded: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = q([]), r = q([]), s = q(null), i = q(null), d = q(null), u = q(o.documents[0]?.key ?? "");
    function c(C) {
      try {
        const B = localStorage.getItem(C), A = B ? JSON.parse(B) : [];
        return Array.isArray(A) ? A : [];
      } catch {
        return [];
      }
    }
    be(() => {
      !o.storageKey || typeof localStorage > "u" || (a.value = c(`${o.storageKey}.signatures`), r.value = c(`${o.storageKey}.stamps`), s.value = a.value[0]?.id ?? null, i.value = r.value[0]?.id ?? null);
    }), pe(
      a,
      (C) => {
        !o.storageKey || typeof localStorage > "u" || localStorage.setItem(`${o.storageKey}.signatures`, JSON.stringify(C));
      },
      { deep: !0 }
    ), pe(
      r,
      (C) => {
        !o.storageKey || typeof localStorage > "u" || localStorage.setItem(`${o.storageKey}.stamps`, JSON.stringify(C));
      },
      { deep: !0 }
    );
    function v(C) {
      const B = {
        id: `sig-${Date.now()}`,
        name: `Signature ${a.value.length + 1}`,
        dataUrl: C
      };
      a.value = [B, ...a.value].slice(0, 8), s.value = B.id;
    }
    async function m(C, B) {
      await hm(C), B(40);
      const A = await new Promise(($, p) => {
        const g = new FileReader();
        g.onload = () => $(String(g.result)), g.onerror = () => p(new Error("Could not read the file")), g.readAsDataURL(C);
      });
      return B(100), { value: A, name: C.name, size: C.size, url: A };
    }
    function h() {
      const C = d.value?.url ?? d.value?.value;
      if (!C)
        return;
      const B = {
        id: `stamp-${Date.now()}`,
        name: d.value?.name ?? "Stamp",
        dataUrl: C
      };
      r.value = [B, ...r.value].slice(0, 8), i.value = B.id;
    }
    const w = y(
      () => a.value.find((C) => C.id === s.value)?.dataUrl ?? null
    ), k = y(
      () => r.value.find((C) => C.id === i.value)?.dataUrl ?? null
    ), S = y(() => {
      const C = o.documents.find((A) => A.key === u.value)?.document ?? o.documents[0]?.document ?? {}, B = {
        ...C?.branding ?? {},
        logoUrl: d.value?.url ?? null
      };
      return {
        ...C,
        branding: B
      };
    });
    return (C, B) => (t(), n("div", {
      class: z(["flex w-full flex-col gap-10", e.embedded ? "" : x(lt)])
    }, [
      I(Ee, {
        title: e.title,
        description: e.description ?? void 0
      }, null, 8, ["title", "description"]),
      l("section", Dk, [
        I(Vk, {
          label: "Draw a signature",
          onSave: v
        }),
        l("div", Tk, [
          B[2] || (B[2] = l("p", { class: "text-sm font-medium" }, "Company logo / stamp", -1)),
          l("p", Ik, f(x(la)), 1),
          I(qn, {
            modelValue: d.value,
            "onUpdate:modelValue": B[0] || (B[0] = (A) => d.value = A),
            image: "",
            accept: ["png", "webp"],
            "max-kilobytes": 2048,
            upload: m
          }, null, 8, ["modelValue"]),
          I(ce, {
            size: "sm",
            variant: "outline",
            disabled: !d.value,
            onClick: h
          }, {
            default: O(() => [...B[1] || (B[1] = [
              U(" Save as stamp ", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ]),
      a.value.length ? (t(), n("section", Ek, [
        I(Ee, {
          variant: "small",
          title: "Saved signatures"
        }),
        l("div", Fk, [
          (t(!0), n(_, null, j(a.value, (A) => (t(), n("button", {
            key: A.id,
            type: "button",
            class: z(["rounded-md border p-2", A.id === s.value ? "ring-ring ring-2" : ""]),
            onClick: ($) => s.value = A.id
          }, [
            l("img", {
              src: A.dataUrl,
              alt: A.name,
              class: "h-12 w-40 bg-white object-contain"
            }, null, 8, Rk)
          ], 10, Nk))), 128))
        ])
      ])) : b("", !0),
      r.value.length ? (t(), n("section", Uk, [
        I(Ee, {
          variant: "small",
          title: "Saved stamps"
        }),
        l("div", Hk, [
          (t(!0), n(_, null, j(r.value, (A) => (t(), n("button", {
            key: A.id,
            type: "button",
            class: z(["rounded-md border p-2", A.id === i.value ? "ring-ring ring-2" : ""]),
            onClick: ($) => i.value = A.id
          }, [
            l("img", {
              src: A.dataUrl,
              alt: A.name,
              class: "size-16 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-[length:12px_12px] object-contain"
            }, null, 8, Kk)
          ], 10, qk))), 128))
        ])
      ])) : b("", !0),
      e.documents.length ? (t(), n("section", Gk, [
        l("div", Wk, [
          (t(!0), n(_, null, j(e.documents, (A) => (t(), T(ce, {
            key: A.key,
            size: "sm",
            variant: u.value === A.key ? "default" : "outline",
            onClick: ($) => u.value = A.key
          }, {
            default: O(() => [
              U(f(A.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "onClick"]))), 128))
        ]),
        l("div", Zk, [
          I(c1, {
            document: S.value
          }, null, 8, ["document"]),
          l("div", Jk, [
            l("div", Yk, [
              B[3] || (B[3] = l("p", { class: "text-xs tracking-wider text-neutral-500 uppercase" }, "Signed", -1)),
              w.value ? (t(), n("img", {
                key: 0,
                src: w.value,
                alt: "Signature",
                class: "h-16 w-48 object-contain"
              }, null, 8, Qk)) : (t(), n("p", Xk, "Draw and save a signature"))
            ]),
            k.value ? (t(), n("img", {
              key: 0,
              src: k.value,
              alt: "Stamp",
              class: "h-20 w-20 object-contain"
            }, null, 8, e$)) : b("", !0)
          ])
        ])
      ])) : b("", !0)
    ], 2));
  }
}), vS = "panel.dashboard.hiddenWidgets", t$ = /* @__PURE__ */ Symbol("dashboardHide"), n$ = {
  key: 0,
  class: "w-full",
  "data-slot": "dashboard-shortcuts"
}, gS = /* @__PURE__ */ L({
  __name: "DashboardShortcuts",
  props: {
    catalog: {},
    defaults: { default: () => [] },
    storageKey: { default: "panel.dashboard.shortcuts" }
  },
  setup(e) {
    const o = e, a = wt(t$, null), r = q(
      o.catalog.filter((d) => o.defaults.includes(d.id))
    ), s = q(!1);
    be(() => {
      if (a?.register("shortcuts", "Shortcuts"), !o.storageKey) {
        s.value = !0;
        return;
      }
      try {
        const d = localStorage.getItem(o.storageKey);
        if (d) {
          const u = JSON.parse(d);
          Array.isArray(u) && (r.value = u.filter(
            (c) => typeof c?.id == "string" && typeof c.label == "string" && typeof c.href == "string"
          ));
        }
      } catch {
      }
      s.value = !0;
    }), pe(
      r,
      (d) => {
        if (!(!s.value || !o.storageKey))
          try {
            localStorage.setItem(o.storageKey, JSON.stringify(d));
          } catch {
          }
      },
      { deep: !0 }
    );
    const i = y(() => a?.hidden.value.has("shortcuts") ?? !1);
    return (d, u) => i.value ? b("", !0) : (t(), n("div", n$, [
      I(ey, {
        items: r.value,
        catalog: e.catalog,
        hideable: "",
        "onUpdate:items": u[0] || (u[0] = (c) => r.value = c),
        onHide: u[1] || (u[1] = (c) => x(a)?.hide("shortcuts", "Shortcuts"))
      }, null, 8, ["items", "catalog"])
    ]));
  }
}), a$ = ["aria-busy"], l$ = ["data-slot"], o$ = ["aria-pressed", "aria-label", "title"], s$ = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, r$ = { class: "text-muted-foreground text-[11px] font-semibold tracking-wider uppercase" }, i$ = { class: "flex h-8 items-center" }, d$ = ["aria-label", "title", "onClick"], u$ = ["aria-label", "title", "onClick"], c$ = {
  key: 3,
  class: "truncate text-2xl font-semibold tabular-nums"
}, f$ = {
  key: 1,
  class: "text-muted-foreground truncate text-xs"
}, hS = /* @__PURE__ */ L({
  __name: "StatStrip",
  props: {
    segments: {},
    columns: { default: 4 },
    maskable: { type: Boolean, default: !0 },
    hidden: { type: Boolean, default: !0 },
    loading: { type: Boolean, default: !1 }
  },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(a.maskable ? !a.hidden : !0), i = q(/* @__PURE__ */ new Set());
    function d($) {
      return a.maskable && ($.sensitive ?? !0);
    }
    function u($) {
      return d($) && !s.value && !i.value.has($.key);
    }
    const c = y(() => a.segments.some(u)), v = y(() => a.segments.some(d)), m = {
      2: "grid-cols-2",
      3: "grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    }, h = y(() => m[a.columns] ?? m[4]), w = y(() => {
      const $ = a.columns ?? 4, p = Math.floor(a.segments.length / $) * $;
      return a.segments.slice(0, p);
    }), k = y(() => {
      const $ = a.columns ?? 4, p = Math.floor(a.segments.length / $) * $;
      return a.segments.slice(p);
    }), S = y(() => {
      const $ = [];
      return w.value.length > 0 && $.push({ key: "packed", joined: !0, segments: w.value }), k.value.length > 0 && $.push({ key: "leftover", joined: !1, segments: k.value }), $;
    });
    function C() {
      const $ = c.value === !1;
      s.value = !$, i.value = /* @__PURE__ */ new Set(), r("toggle", $);
    }
    function B($) {
      if (!d($))
        return;
      const p = new Set(i.value);
      if (u($))
        p.add($.key);
      else if (p.delete($.key), s.value) {
        s.value = !1;
        for (const g of a.segments)
          g.key !== $.key && d(g) && p.add(g.key);
      }
      i.value = p, r("toggle", c.value);
    }
    function A($) {
      return typeof $ == "number" ? new Intl.NumberFormat().format($) : $;
    }
    return ($, p) => (t(), n("div", {
      class: "flex flex-col gap-3",
      "data-slot": "stat-strip",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      (t(!0), n(_, null, j(S.value, (g) => (t(), n("div", {
        key: g.key,
        class: z(["relative shrink-0", g.joined ? "bg-border overflow-hidden rounded-xl border shadow-sm" : ""]),
        "data-slot": g.joined ? "stat-packed" : "stat-leftover"
      }, [
        e.maskable && v.value && g.key === S.value[0]?.key ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 rounded p-1 transition-colors",
          "aria-pressed": c.value,
          "aria-label": c.value ? "Show all values" : "Hide all values",
          title: c.value ? "Show all values" : "Hide all values",
          onClick: C
        }, [
          (t(), n("svg", s$, [
            c.value ? (t(), n(_, { key: 0 }, [
              p[0] || (p[0] = l("path", { d: "M10.7 6.2A9 9 0 0 1 12 6c5 0 9 4.5 9 6a12 12 0 0 1-2.2 3" }, null, -1)),
              p[1] || (p[1] = l("path", { d: "M6.6 6.9A13 13 0 0 0 3 12c0 1.5 4 6 9 6a9 9 0 0 0 3.7-.8" }, null, -1)),
              p[2] || (p[2] = l("path", { d: "M9.9 9.9a3 3 0 0 0 4.2 4.2" }, null, -1)),
              p[3] || (p[3] = l("path", { d: "m3 3 18 18" }, null, -1))
            ], 64)) : (t(), n(_, { key: 1 }, [
              p[4] || (p[4] = l("path", { d: "M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6Z" }, null, -1)),
              p[5] || (p[5] = l("circle", {
                cx: "12",
                cy: "12",
                r: "3"
              }, null, -1))
            ], 64))
          ]))
        ], 8, o$)) : b("", !0),
        l("div", {
          class: z(["grid", [g.joined ? "gap-px" : "gap-3", h.value]])
        }, [
          (t(!0), n(_, null, j(g.segments, (M) => (t(), n("div", {
            key: M.key,
            class: z(["bg-card flex min-w-0 flex-col gap-2 p-4 sm:p-5", g.joined ? "" : "overflow-hidden rounded-xl border"])
          }, [
            l("p", r$, f(M.label), 1),
            l("div", i$, [
              e.loading ? (t(), T(Pe, {
                key: 0,
                variant: "number"
              })) : u(M) ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "hover:bg-muted/60 -mx-1 flex items-center gap-1.5 rounded px-1 py-1 transition-colors",
                "aria-label": `${M.label} hidden. Show it.`,
                title: `Show ${M.label}`,
                onClick: (F) => B(M)
              }, [
                (t(), n(_, null, j(5, (F) => l("span", {
                  key: F,
                  class: "bg-muted-foreground/70 size-1.5 rounded-full"
                })), 64))
              ], 8, d$)) : d(M) ? (t(), n("button", {
                key: 2,
                type: "button",
                class: "hover:bg-muted/60 -mx-1 truncate rounded px-1 text-2xl font-semibold tabular-nums transition-colors",
                "aria-label": `${M.label}, ${A(M.value)}. Hide it.`,
                title: `Hide ${M.label}`,
                onClick: (F) => B(M)
              }, f(A(M.value)), 9, u$)) : (t(), n("span", c$, f(A(M.value)), 1)),
              M.trend && !e.loading && !u(M) ? (t(), T(da, {
                key: 4,
                direction: M.trend.direction,
                percentage: M.trend.percentage,
                inverted: M.inverted,
                class: "ml-2 shrink-0"
              }, null, 8, ["direction", "percentage", "inverted"])) : b("", !0)
            ]),
            M.sparkline?.length && !e.loading && !u(M) ? (t(), T(Ot, {
              key: 0,
              data: M.sparkline,
              height: 24
            }, null, 8, ["data"])) : b("", !0),
            M.caption || M.comparison && M.trend ? (t(), n("p", f$, f(M.caption ?? M.comparison), 1)) : b("", !0)
          ], 2))), 128))
        ], 2)
      ], 10, l$))), 128))
    ], 8, a$));
  }
}), m$ = ["aria-label"], p$ = { class: "flex items-center justify-between gap-3" }, v$ = ["aria-valuenow", "aria-label"], g$ = { class: "flex items-center gap-3" }, h$ = { class: "min-w-0 flex-1 text-sm" }, b$ = { class: "font-medium" }, y$ = {
  key: 0,
  class: "text-muted-foreground mt-0.5 block text-xs sm:mt-0 sm:inline sm:before:content-[':_']"
}, x$ = {
  key: 1,
  class: "flex flex-col gap-3 rounded-lg border bg-card p-4"
}, k$ = { class: "flex items-center justify-between gap-2" }, $$ = { class: "text-sm font-semibold" }, w$ = { class: "flex items-center gap-3" }, C$ = ["href"], S$ = {
  key: 0,
  class: "flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3"
}, M$ = { class: "flex min-w-0 flex-col gap-0.5" }, B$ = { class: "text-sm font-medium" }, A$ = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, z$ = {
  key: 1,
  class: "flex flex-col gap-2"
}, _$ = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-3.5",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, P$ = { class: "flex min-w-0 flex-1 flex-col gap-0.5" }, L$ = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, bS = /* @__PURE__ */ L({
  __name: "SetupChecklist",
  props: {
    items: {},
    reportHref: { default: null },
    heading: { default: "Setup checklist" },
    skipLabel: { default: null },
    linkComponent: { default: "a" },
    variant: { default: "doctor" }
  },
  emits: ["skip"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.items.find((k) => !k.done) ?? null), i = y(() => a.items.filter((k) => k.key !== s.value?.key)), d = y(() => a.items.length), u = y(() => a.items.filter((k) => k.done).length), c = y(
      () => d.value > 0 ? Math.round(u.value / d.value * 100) : 0
    ), v = y(() => {
      const k = a.linkComponent;
      return typeof k == "string" ? k : xa(k);
    }), m = Ye({
      variant: "default",
      size: "sm",
      class: "no-underline mt-2 self-start"
    }), h = Ye({
      variant: "default",
      size: "sm",
      class: "no-underline shrink-0"
    }), w = Ye({
      variant: "outline",
      size: "sm",
      class: "no-underline shrink-0"
    });
    return (k, S) => e.items.length && e.variant === "onboarding" ? (t(), n("section", {
      key: 0,
      class: "flex flex-col gap-2.5 rounded-md border bg-card p-3",
      "aria-label": e.heading
    }, [
      l("div", p$, [
        l("div", {
          class: "flex flex-1 items-center gap-1",
          role: "progressbar",
          "aria-valuenow": c.value,
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          "aria-label": `${e.heading}, ${c.value} percent complete`
        }, [
          (t(!0), n(_, null, j(e.items, (C, B) => (t(), n("span", {
            key: C.key,
            class: z(["h-1.5 flex-1 rounded-sm transition-colors duration-300", B < u.value ? "bg-amber-500" : "bg-muted"])
          }, null, 2))), 128))
        ], 8, v$),
        e.skipLabel ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline",
          onClick: S[0] || (S[0] = (C) => r("skip"))
        }, f(e.skipLabel), 1)) : b("", !0)
      ]),
      l("div", g$, [
        l("p", h$, [
          l("span", b$, f(s.value ? s.value.title : e.heading), 1),
          s.value?.detail ? (t(), n("span", y$, f(s.value.detail), 1)) : b("", !0)
        ]),
        s.value?.href ? (t(), T(Ce(v.value), {
          key: 0,
          href: s.value.href,
          class: z(x(h))
        }, {
          default: O(() => [
            U(f(s.value.actionLabel || "Open"), 1)
          ]),
          _: 1
        }, 8, ["href", "class"])) : b("", !0)
      ])
    ], 8, m$)) : e.items.length ? (t(), n("section", x$, [
      l("div", k$, [
        l("h2", $$, f(e.heading), 1),
        l("div", w$, [
          e.skipLabel ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-xs text-muted-foreground font-normal hover:text-foreground hover:underline",
            onClick: S[1] || (S[1] = (C) => r("skip"))
          }, f(e.skipLabel), 1)) : b("", !0),
          e.reportHref ? (t(), n("a", {
            key: 1,
            href: e.reportHref,
            class: "text-xs text-muted-foreground font-normal hover:text-foreground hover:underline"
          }, " Full report ", 8, C$)) : b("", !0)
        ])
      ]),
      s.value ? (t(), n("div", S$, [
        S[2] || (S[2] = l("span", {
          class: "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-500",
          "aria-hidden": "true"
        }, null, -1)),
        l("div", M$, [
          l("p", B$, f(s.value.title), 1),
          s.value.detail ? (t(), n("p", A$, f(s.value.detail), 1)) : b("", !0),
          s.value.href ? (t(), T(Ce(v.value), {
            key: 1,
            href: s.value.href,
            class: z(x(m))
          }, {
            default: O(() => [
              U(f(s.value.actionLabel || "Open"), 1)
            ]),
            _: 1
          }, 8, ["href", "class"])) : b("", !0)
        ])
      ])) : b("", !0),
      i.value.length ? (t(), n("ul", z$, [
        (t(!0), n(_, null, j(i.value, (C) => (t(), n("li", {
          key: C.key,
          class: "flex items-start gap-3"
        }, [
          l("span", {
            class: z([
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
              C.done ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "border-2 border-amber-500"
            ]),
            "aria-hidden": "true"
          }, [
            C.done ? (t(), n("svg", _$, [...S[3] || (S[3] = [
              l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
            ])])) : b("", !0)
          ], 2),
          l("div", P$, [
            l("p", {
              class: z(["text-sm", C.done ? "text-muted-foreground line-through" : "font-medium"])
            }, f(C.title), 3),
            !C.done && C.detail ? (t(), n("p", L$, f(C.detail), 1)) : b("", !0)
          ]),
          !C.done && C.href ? (t(), T(Ce(v.value), {
            key: 0,
            href: C.href,
            class: z(x(w))
          }, {
            default: O(() => [
              U(f(C.actionLabel || "Open"), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"])) : b("", !0)
        ]))), 128))
      ])) : b("", !0)
    ])) : b("", !0);
  }
}), O$ = {
  class: "border-primary/20 bg-primary/[0.06] flex min-h-12 flex-wrap items-center gap-2.5 rounded-lg border px-3 py-2 text-sm sm:gap-3 sm:px-3.5",
  role: "status",
  "aria-live": "polite",
  "aria-label": "Selection actions"
}, j$ = { class: "min-w-0 flex-1 basis-[9rem]" }, V$ = { class: "text-foreground truncate text-sm font-semibold leading-5 tabular-nums" }, D$ = { class: "text-muted-foreground hidden text-xs leading-4 sm:block" }, T$ = { class: "hidden items-center gap-2 md:flex" }, I$ = { class: "md:hidden" }, E$ = { class: "border-b px-4 py-4" }, F$ = { class: "flex items-start gap-3" }, N$ = { class: "text-muted-foreground text-sm font-normal" }, R$ = { class: "flex flex-col gap-2 overflow-y-auto p-4" }, U$ = { class: "ml-auto flex items-center gap-1" }, yS = /* @__PURE__ */ L({
  __name: "SelectionBar",
  props: {
    count: {},
    allMatching: { type: Boolean },
    total: {}
  },
  emits: ["select-all-matching", "clear"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(!1), i = (u) => new Intl.NumberFormat().format(u), d = y(() => a.allMatching ? a.total !== void 0 ? `All ${i(a.total)} matching records` : "All matching records" : `${i(a.count)} selected`);
    return (u, c) => (t(), n("div", O$, [
      c[8] || (c[8] = l("span", {
        class: "bg-primary/10 text-primary inline-flex size-8 shrink-0 items-center justify-center rounded-md",
        "aria-hidden": "true"
      }, [
        l("svg", {
          class: "size-4",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }, [
          l("path", { d: "m5 12 4 4L19 6" })
        ])
      ], -1)),
      l("div", j$, [
        l("p", V$, f(d.value), 1),
        l("p", D$, f(e.allMatching ? "Every matching record is included" : "Ready for a bulk action"), 1)
      ]),
      !e.allMatching && e.total !== void 0 && e.total > e.count ? (t(), n("button", {
        key: 0,
        type: "button",
        class: "border-primary/25 bg-background text-primary hover:bg-primary/10 inline-flex min-h-9 items-center rounded-md border px-3 text-sm font-medium transition-colors",
        onClick: c[0] || (c[0] = (v) => r("select-all-matching"))
      }, " Select all " + f(i(e.total)), 1)) : b("", !0),
      l("div", T$, [
        K(u.$slots, "actions")
      ]),
      l("div", I$, [
        l("button", {
          type: "button",
          dusk: "mobile-bulk-actions",
          class: "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium shadow-sm transition-colors",
          onClick: c[1] || (c[1] = (v) => s.value = !0)
        }, [...c[4] || (c[4] = [
          l("svg", {
            class: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "M4 6h16M7 12h10M10 18h4" })
          ], -1),
          U(" Actions ", -1)
        ])]),
        I(sn, {
          open: s.value,
          "onUpdate:open": c[2] || (c[2] = (v) => s.value = v)
        }, {
          default: O(() => [
            I(rn, {
              side: "bottom",
              class: "max-h-[70vh] gap-0 overflow-hidden p-0"
            }, {
              default: O(() => [
                l("div", E$, [
                  l("div", F$, [
                    c[6] || (c[6] = l("span", {
                      class: "bg-primary/10 text-primary inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
                      "aria-hidden": "true"
                    }, [
                      l("svg", {
                        class: "size-4",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2.5",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, [
                        l("path", { d: "m5 12 4 4L19 6" })
                      ])
                    ], -1)),
                    l("div", null, [
                      c[5] || (c[5] = l("p", { class: "text-foreground text-base font-semibold" }, "Bulk actions", -1)),
                      l("p", N$, f(d.value), 1)
                    ])
                  ])
                ]),
                l("div", R$, [
                  K(u.$slots, "actions")
                ])
              ]),
              _: 3
            })
          ]),
          _: 3
        }, 8, ["open"])
      ]),
      l("div", U$, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors",
          "aria-label": "Clear selection",
          onClick: c[3] || (c[3] = (v) => r("clear"))
        }, [...c[7] || (c[7] = [
          l("svg", {
            class: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "M18 6 6 18M6 6l12 12" })
          ], -1),
          l("span", { class: "hidden sm:inline" }, "Clear", -1)
        ])])
      ])
    ]));
  }
}), H$ = { class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, q$ = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, K$ = {
  key: 0,
  class: "text-muted-foreground flex items-center gap-2 text-xs"
}, G$ = ["value"], W$ = ["value"], Z$ = {
  class: "flex items-center gap-1",
  "aria-label": "Pagination"
}, J$ = ["disabled"], Y$ = ["disabled"], Q$ = {
  class: "bg-primary/10 text-primary inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-sm font-medium tabular-nums",
  "aria-current": "page"
}, X$ = {
  key: 0,
  class: "text-muted-foreground px-1 text-xs tabular-nums"
}, ew = ["disabled"], xS = /* @__PURE__ */ L({
  __name: "TablePagination",
  props: {
    page: {},
    perPage: {},
    perPageOptions: { default: () => [10, 25, 50] },
    rowsOnPage: {},
    hasNext: { type: Boolean },
    hasPrevious: { type: Boolean },
    total: {},
    loading: { type: Boolean, default: !1 }
  },
  emits: ["next", "previous", "first", "update:perPage"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = (c) => new Intl.NumberFormat().format(c), i = y(() => a.rowsOnPage === 0 ? 0 : (a.page - 1) * a.perPage + 1), d = y(() => (a.page - 1) * a.perPage + a.rowsOnPage), u = y(
      () => a.total === void 0 ? null : Math.max(1, Math.ceil(a.total / a.perPage))
    );
    return (c, v) => (t(), n("div", H$, [
      l("p", q$, [
        U(" Showing " + f(s(i.value)) + "-" + f(s(d.value)) + " ", 1),
        e.total !== void 0 ? (t(), n(_, { key: 0 }, [
          U("of " + f(s(e.total)), 1)
        ], 64)) : b("", !0)
      ]),
      e.perPageOptions.length > 1 ? (t(), n("label", K$, [
        v[4] || (v[4] = l("span", null, "Per page", -1)),
        l("select", {
          value: e.perPage,
          class: "border-input bg-background text-foreground h-8 rounded-md border px-2 text-xs",
          onChange: v[0] || (v[0] = (m) => r("update:perPage", Number(m.target.value)))
        }, [
          (t(!0), n(_, null, j(e.perPageOptions, (m) => (t(), n("option", {
            key: m,
            value: m
          }, f(m), 9, W$))), 128))
        ], 40, G$)
      ])) : b("", !0),
      l("nav", Z$, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30",
          disabled: !e.hasPrevious || e.loading,
          "aria-label": "First page",
          title: "First page",
          onClick: v[1] || (v[1] = (m) => r("first"))
        }, [...v[5] || (v[5] = [
          l("svg", {
            class: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "m17 18-6-6 6-6M11 18l-6-6 6-6" })
          ], -1)
        ])], 8, J$),
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30",
          disabled: !e.hasPrevious || e.loading,
          "aria-label": "Previous page",
          title: "Previous page",
          onClick: v[2] || (v[2] = (m) => r("previous"))
        }, [...v[6] || (v[6] = [
          l("svg", {
            class: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "m15 18-6-6 6-6" })
          ], -1)
        ])], 8, Y$),
        l("span", Q$, f(e.page), 1),
        u.value !== null ? (t(), n("span", X$, " of " + f(s(u.value)), 1)) : b("", !0),
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30",
          disabled: !e.hasNext || e.loading,
          "aria-label": "Next page",
          title: "Next page",
          onClick: v[3] || (v[3] = (m) => r("next"))
        }, [...v[7] || (v[7] = [
          l("svg", {
            class: "size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true"
          }, [
            l("path", { d: "m9 18 6-6-6-6" })
          ], -1)
        ])], 8, ew)
      ])
    ]));
  }
}), tw = {
  class: "pk-tabs bg-muted/40 flex w-fit max-w-full shrink-0 items-center gap-0.5 overflow-x-auto rounded-lg p-1",
  role: "tablist",
  "aria-label": "Table views"
}, nw = ["aria-current", "aria-selected"], aw = ["title"], lw = ["aria-current", "aria-selected", "onClick"], ow = ["title"], sw = /* @__PURE__ */ L({
  __name: "TableTabs",
  props: {
    tabs: {},
    active: {},
    counts: {}
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const a = o;
    function r(s) {
      return s >= 1e6 ? (s / 1e6).toFixed(s % 1e6 === 0 ? 0 : 1) + "M" : s >= 1e4 ? Math.round(s / 1e3) + "k" : new Intl.NumberFormat().format(s);
    }
    return (s, i) => (t(), n("div", tw, [
      l("button", {
        type: "button",
        role: "tab",
        class: z([
          "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm capitalize transition-colors",
          e.active === null ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
        ]),
        "aria-current": e.active === null ? "page" : void 0,
        "aria-selected": e.active === null,
        onClick: i[0] || (i[0] = (d) => a("select", null))
      }, [
        i[1] || (i[1] = U(" All ", -1)),
        e.counts ? (t(), n("span", {
          key: 0,
          class: z([
            "rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums",
            e.active === null ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15"
          ]),
          title: new Intl.NumberFormat().format(e.counts.all ?? 0)
        }, f(r(e.counts.all ?? 0)), 11, aw)) : (t(), T(Pe, {
          key: 1,
          variant: "badge",
          label: "Counting"
        }))
      ], 10, nw),
      (t(!0), n(_, null, j(e.tabs, (d) => (t(), n("button", {
        key: d,
        type: "button",
        role: "tab",
        class: z([
          "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm capitalize transition-colors",
          e.active === d ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
        ]),
        "aria-current": e.active === d ? "page" : void 0,
        "aria-selected": e.active === d,
        onClick: (u) => a("select", d)
      }, [
        U(f(d) + " ", 1),
        e.counts ? (t(), n("span", {
          key: 0,
          class: z([
            "rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums",
            e.active === d ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15"
          ]),
          title: new Intl.NumberFormat().format(e.counts[d] ?? 0)
        }, f(r(e.counts[d] ?? 0)), 11, ow)) : (t(), T(Pe, {
          key: 1,
          variant: "badge",
          label: "Counting"
        }))
      ], 10, lw))), 128))
    ]));
  }
}), kS = /* @__PURE__ */ at(sw, [["__scopeId", "data-v-8348f90f"]]), rw = { class: "group/saved relative shrink-0" }, iw = {
  class: "pk-focus-ring inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-md border px-2.5 text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden",
  "aria-label": "Saved table views"
}, dw = {
  key: 0,
  class: "max-w-28 truncate text-xs text-foreground"
}, uw = { class: "bg-popover text-popover-foreground absolute top-full left-0 z-30 mt-2 w-72 rounded-lg border p-2 shadow-xl" }, cw = {
  key: 0,
  class: "mt-1 max-h-56 overflow-y-auto"
}, fw = ["onClick"], mw = ["aria-label", "onClick"], pw = {
  key: 1,
  class: "px-2 py-3 text-xs text-muted-foreground"
}, $S = /* @__PURE__ */ L({
  __name: "SavedViews",
  props: {
    views: {},
    active: {}
  },
  emits: ["save", "apply", "remove"],
  setup(e, { emit: o }) {
    const a = o;
    function r(s) {
      const i = s.currentTarget, d = String(new FormData(i).get("name") ?? "").trim();
      d && (a("save", d), i.reset());
    }
    return (s, i) => (t(), n("details", rw, [
      l("summary", iw, [
        i[0] || (i[0] = U(" Views ", -1)),
        e.active ? (t(), n("span", dw, f(e.active), 1)) : b("", !0),
        i[1] || (i[1] = l("span", { "aria-hidden": "true" }, "⌄", -1))
      ]),
      l("div", uw, [
        l("form", {
          class: "flex gap-2 border-b pb-2",
          onSubmit: he(r, ["prevent"])
        }, [...i[2] || (i[2] = [
          l("label", {
            class: "sr-only",
            for: "pk-save-view"
          }, "View name", -1),
          l("input", {
            id: "pk-save-view",
            name: "name",
            class: "pk-control min-w-0 flex-1 px-2 text-sm",
            placeholder: "Save current view…",
            maxlength: "40"
          }, null, -1),
          l("button", {
            type: "submit",
            class: "pk-focus-ring rounded-md bg-primary px-2.5 text-xs text-primary-foreground"
          }, " Save ", -1)
        ])], 32),
        e.views.length ? (t(), n("div", cw, [
          (t(!0), n(_, null, j(e.views, (d) => (t(), n("div", {
            key: d.name,
            class: "flex items-center gap-1 rounded-md px-1 hover:bg-muted"
          }, [
            l("button", {
              type: "button",
              class: z(["pk-focus-ring min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left text-sm", d.name === e.active ? "font-medium text-primary" : ""]),
              onClick: (u) => a("apply", d)
            }, f(d.name), 11, fw),
            l("button", {
              type: "button",
              class: "pk-focus-ring rounded px-2 py-1 text-xs text-muted-foreground hover:text-destructive",
              "aria-label": `Delete saved view ${d.name}`,
              onClick: (u) => a("remove", d.name)
            }, " × ", 8, mw)
          ]))), 128))
        ])) : (t(), n("p", pw, " Save filters, columns, and layout for quick reuse. "))
      ])
    ]));
  }
}), vw = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, gw = { class: "grid gap-2" }, hw = {
  key: 0,
  class: "text-destructive text-sm"
}, bw = { class: "flex gap-2" }, wS = /* @__PURE__ */ L({
  __name: "PkPasskeyRegister",
  emits: ["success"],
  setup(e, { emit: o }) {
    const a = o, s = q((() => {
      const w = navigator.userAgent, k = [
        { pattern: /Edg|Edge/, name: "Edge" },
        { pattern: /OPR|Opera|OPiOS/, name: "Opera" },
        { pattern: /Firefox|FxiOS/, name: "Firefox" },
        { pattern: /Chrome|CriOS/, name: "Chrome" },
        { pattern: /Safari/, name: "Safari" }
      ].find(({ pattern: C }) => C.test(w))?.name, S = [
        { pattern: /iPhone/, name: "iPhone" },
        { pattern: /iPad|Macintosh(?=.*Mobile)/, name: "iPad" },
        { pattern: /Android/, name: "Android" },
        { pattern: /Mac/, name: "Mac" },
        { pattern: /Windows/, name: "Windows" }
      ].find(({ pattern: C }) => C.test(w))?.name;
      return [k, S].filter(Boolean).join(" on ") || "";
    })()), i = q(!1), d = ka(null), u = y(() => d.value?.isLoading.value ?? !1), c = y(() => d.value?.error.value ?? null), v = y(() => d.value?.isSupported.value ?? !1);
    be(async () => {
      try {
        const { usePasskeyRegister: w } = await import("@laravel/passkeys/vue");
        d.value = w({
          onSuccess: () => {
            s.value = "", i.value = !1, a("success");
          }
        });
      } catch {
        d.value = null;
      }
    });
    const m = async (w) => {
      w.preventDefault(), !(!s.value.trim() || d.value === null) && await d.value.register(s.value);
    }, h = () => {
      i.value = !1, s.value = "";
    };
    return (w, k) => v.value ? i.value ? (t(), n("form", {
      key: 2,
      class: "border-border bg-muted/50 space-y-4 rounded-lg border p-4",
      onSubmit: m
    }, [
      l("div", gw, [
        k[3] || (k[3] = l("label", {
          for: "pk-passkey-name",
          class: "text-sm font-medium"
        }, " Passkey name ", -1)),
        ge(l("input", {
          id: "pk-passkey-name",
          "onUpdate:modelValue": k[1] || (k[1] = (S) => s.value = S),
          type: "text",
          autofocus: "",
          placeholder: "e.g. MacBook Pro, iPhone",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        }, null, 512), [
          [ze, s.value]
        ]),
        k[4] || (k[4] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " A name helps you identify this passkey later. ", -1))
      ]),
      c.value ? (t(), n("p", hw, f(c.value), 1)) : b("", !0),
      l("div", bw, [
        I(ce, {
          type: "submit",
          disabled: u.value || !s.value.trim()
        }, {
          default: O(() => [
            U(f(u.value ? "Registering…" : "Register passkey"), 1)
          ]),
          _: 1
        }, 8, ["disabled"]),
        I(ce, {
          type: "button",
          variant: "ghost",
          onClick: h
        }, {
          default: O(() => [...k[5] || (k[5] = [
            U(" Cancel ", -1)
          ])]),
          _: 1
        })
      ])
    ], 32)) : (t(), T(ce, {
      key: 1,
      variant: "outline",
      onClick: k[0] || (k[0] = (S) => i.value = !0)
    }, {
      default: O(() => [...k[2] || (k[2] = [
        U(" Add passkey ", -1)
      ])]),
      _: 1
    })) : (t(), n("p", vw, " Passkeys are not supported in this browser. "));
  }
}), yw = { class: "pk-form-stack" }, xw = {
  key: 0,
  class: "border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm",
  role: "alert"
}, CS = /* @__PURE__ */ L({
  __name: "RecordForm",
  props: {
    nodes: { default: () => [] },
    fields: { default: () => [] },
    columns: { default: 1 },
    modelValue: {},
    errors: { default: () => ({}) },
    options: { default: () => ({}) },
    processing: { type: Boolean, default: !1 },
    searchOptions: {},
    upload: {},
    discard: {},
    pickerBase: {},
    returnUrl: {},
    createOption: {}
  },
  emits: ["change", "affix-action"],
  setup(e, { emit: o }) {
    const a = e;
    Nt("panelPicker", {
      get base() {
        return a.pickerBase ?? "";
      },
      get returnUrl() {
        return a.returnUrl ?? "";
      }
    }), Nt("panelCreateOption", {
      run(c, v) {
        return a.createOption ? a.createOption(c, v) : Promise.reject(new Error("Create is not available on this field."));
      }
    });
    const r = o, s = y(() => a.nodes.length > 0), i = y(() => a.columns >= 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"), d = y(() => a.errors._conflict);
    function u(c) {
      if (a.upload)
        return (v, m) => a.upload(c, v, m);
    }
    return (c, v) => (t(), n("div", yw, [
      d.value ? (t(), n("p", xw, f(d.value), 1)) : b("", !0),
      s.value ? (t(!0), n(_, { key: 1 }, j(e.nodes, (m, h) => (t(), T(Gn, {
        key: h,
        node: m,
        values: e.modelValue,
        errors: e.errors,
        options: e.options,
        processing: e.processing,
        "search-options": e.searchOptions,
        upload: e.upload,
        discard: e.discard,
        onChange: v[0] || (v[0] = (w, k) => r("change", w, k)),
        onAffixAction: v[1] || (v[1] = (w, k) => r("affix-action", w, k))
      }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard"]))), 128)) : (t(), n("div", {
        key: 2,
        class: z(["grid grid-cols-1 gap-4", i.value])
      }, [
        (t(!0), n(_, null, j(e.fields, (m) => (t(), n("div", {
          key: m.key,
          class: z(m.span && m.span >= 2 ? "sm:col-span-2" : "")
        }, [
          I(We, {
            field: m,
            value: e.modelValue[m.key],
            error: e.errors[m.key],
            errors: e.errors,
            options: e.options[m.key],
            "child-options": e.options,
            processing: e.processing,
            "search-options": m.searchable && e.searchOptions ? (h) => e.searchOptions(m.key, h) : void 0,
            upload: u(m.key),
            discard: e.discard,
            onChange: (h) => r("change", m.key, h),
            onAffixAction: (h) => r("affix-action", m.key, h)
          }, null, 8, ["field", "value", "error", "errors", "options", "child-options", "processing", "search-options", "upload", "discard", "onChange", "onAffixAction"])
        ], 2))), 128))
      ], 2))
    ]));
  }
}), kw = { class: "min-w-0 flex-1 truncate text-sm font-medium" }, $w = ["disabled"], ww = ["disabled"], Cw = ["disabled"], Sw = ["disabled"], SS = /* @__PURE__ */ L({
  __name: "UnsavedBar",
  props: {
    show: { type: Boolean },
    processing: { type: Boolean, default: !1 },
    message: { default: "Unsaved changes" },
    saveLabel: { default: "Save" },
    cancelLabel: { default: "Cancel" },
    discardLabel: {},
    extraLabel: {}
  },
  emits: ["save", "cancel", "discard", "extra"],
  setup(e) {
    const o = q(!1);
    be(() => {
      o.value = !!document.getElementById("pk-main");
    });
    const a = y(() => o.value ? "#pk-main" : "body"), r = y(() => !o.value), s = y(
      () => o.value ? "pointer-events-none fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 px-3 pb-3 sm:bottom-0 sm:px-4 sm:pb-4" : "pointer-events-none sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 px-3 pb-3 sm:bottom-0 sm:px-4 sm:pb-4"
    ), i = { opacity: "0", transform: "translateY(0.75rem)" }, d = { opacity: "1", transform: "translateY(0)" };
    function u(v, m) {
      const h = v;
      Object.assign(h.style, i, { transition: "none" }), requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          h.style.transition = "opacity 200ms ease-out, transform 200ms ease-out", Object.assign(h.style, d);
        });
      }), setTimeout(m, 200);
    }
    function c(v, m) {
      const h = v;
      Object.assign(h.style, d, {
        transition: "opacity 150ms ease-in, transform 150ms ease-in"
      }), requestAnimationFrame(() => {
        Object.assign(h.style, i);
      }), setTimeout(m, 150);
    }
    return (v, m) => (t(), T(pt, {
      to: a.value,
      disabled: r.value
    }, [
      I(et, {
        css: !1,
        onEnter: u,
        onLeave: c
      }, {
        default: O(() => [
          e.show ? (t(), n("div", {
            key: 0,
            class: z(s.value),
            role: "status",
            "aria-live": "polite",
            "data-slot": "unsaved-bar"
          }, [
            l("div", {
              class: z([
                x(ho),
                "pointer-events-auto flex items-center gap-3 rounded-xl border bg-card/95 py-3 pr-3 pl-4 shadow-md ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10"
              ])
            }, [
              m[4] || (m[4] = l("span", {
                class: "text-amber-600 dark:text-amber-400",
                "aria-hidden": "true"
              }, [
                l("svg", {
                  viewBox: "0 0 24 24",
                  class: "size-4",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  l("circle", {
                    cx: "12",
                    cy: "12",
                    r: "9"
                  }),
                  l("path", { d: "M12 8v4M12 16h.01" })
                ])
              ], -1)),
              l("span", kw, f(e.message), 1),
              e.discardLabel ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "hover:bg-muted inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: m[0] || (m[0] = (h) => v.$emit("discard"))
              }, f(e.discardLabel), 9, $w)) : b("", !0),
              l("button", {
                type: "button",
                class: "bg-muted hover:bg-muted/70 inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: m[1] || (m[1] = (h) => v.$emit("cancel"))
              }, f(e.cancelLabel), 9, ww),
              e.extraLabel ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "hover:bg-muted inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: m[2] || (m[2] = (h) => v.$emit("extra"))
              }, f(e.extraLabel), 9, Cw)) : b("", !0),
              l("button", {
                type: "button",
                class: "bg-primary text-primary-foreground inline-flex min-h-9 items-center rounded-lg px-4 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50",
                disabled: e.processing,
                onClick: m[3] || (m[3] = (h) => v.$emit("save"))
              }, f(e.processing ? "Saving…" : e.saveLabel), 9, Sw)
            ], 2)
          ], 2)) : b("", !0)
        ]),
        _: 1
      })
    ], 8, ["to", "disabled"]));
  }
});
function MS(e, o = {}) {
  const { warnOnUnload: a = !0 } = o, r = q(Et(e.value)), s = y(() => Et(e.value) !== r.value);
  function i() {
    r.value = Et(e.value);
  }
  function d() {
    e.value = JSON.parse(r.value);
  }
  function u(c) {
    s.value && (c.preventDefault(), c.returnValue = "");
  }
  return be(() => {
    a && window.addEventListener("beforeunload", u);
  }), ke(() => {
    window.removeEventListener("beforeunload", u);
  }), { dirty: s, commit: i, discard: d, baseline: r };
}
function Et(e) {
  return JSON.stringify(e, (o, a) => a === void 0 ? null : a === null || typeof a != "object" || Array.isArray(a) ? a : Object.fromEntries(
    Object.entries(a).sort(([r], [s]) => r.localeCompare(s))
  ));
}
const yt = /* @__PURE__ */ new Map();
function BS(e, o) {
  yt.set(e, o);
}
function Mw(e) {
  return yt.get(e);
}
function AS(e) {
  return yt.has(e);
}
function Bw() {
  return [...yt.keys()].sort();
}
function zS() {
  yt.clear();
}
const Aw = {
  key: 0,
  class: "flex flex-col gap-1"
}, zw = { class: "text-muted-foreground text-[11px] font-medium tracking-wide uppercase" }, _w = { class: "text-foreground text-sm font-medium" }, Pw = {
  key: 1,
  class: "text-muted-foreground font-normal"
}, Lw = {
  key: 5,
  class: "max-w-full font-normal"
}, Ow = {
  key: 0,
  class: "text-muted-foreground mb-1 font-mono text-[10px] uppercase"
}, jw = { class: "bg-muted/50 overflow-x-auto rounded-md border p-3 font-mono text-xs font-normal" }, Vw = {
  key: 6,
  class: "font-normal"
}, Dw = {
  key: 0,
  class: "divide-y rounded-md border"
}, Tw = { class: "text-muted-foreground truncate font-medium" }, Iw = { class: "text-foreground col-span-2 break-words" }, Ew = {
  key: 1,
  class: "text-muted-foreground font-normal"
}, Fw = {
  key: 7,
  class: "flex flex-col gap-3 font-normal"
}, Nw = {
  key: 0,
  class: "text-muted-foreground font-normal"
}, Rw = {
  key: 10,
  class: "text-destructive text-xs font-normal",
  "data-testid": "missing-entry-view"
}, Uw = ["href"], Hw = { class: "flex min-w-0 items-start gap-2.5" }, qw = {
  key: 0,
  class: "bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
  "aria-hidden": "true"
}, Kw = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "size-3.5"
}, Gw = ["d"], Ww = { class: "min-w-0" }, Zw = { class: "flex flex-wrap items-center gap-2" }, Jw = { class: "text-sm font-semibold" }, Yw = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, Qw = ["aria-selected", "onClick"], Xw = /* @__PURE__ */ L({
  __name: "InfoNode",
  props: {
    node: {},
    record: {},
    depth: { default: 0 }
  },
  emits: ["action"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(!a.node.collapsed), i = q(0), d = y(() => a.depth === 0), u = y(() => {
      const A = a.node.columns, $ = typeof A == "number" ? A : A?.default ?? A?.sm ?? A?.md ?? (a.node.component === "section" ? 2 : 1);
      return $ >= 3 ? "sm:grid-cols-3" : $ === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
    });
    function c(A) {
      const $ = A.columns, p = typeof $ == "number" ? { default: $ } : $, g = {};
      for (const M of ["default", "sm", "md", "lg", "xl", "2xl"]) {
        const F = p?.[M];
        typeof F == "number" && F > 0 && (g[`--pk-grid-cols-${M}`] = String(Math.min(12, Math.max(1, F))));
      }
      return g;
    }
    const v = {
      date: { year: "numeric", month: "long", day: "numeric" },
      datetime: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    }, m = y(() => a.node.key ? a.record[a.node.key] : null), h = y(() => {
      const A = m.value;
      return A == null || A === "";
    }), w = y(() => {
      if (h.value)
        return "None";
      const A = Number(m.value);
      if (Number.isNaN(A))
        return "None";
      const $ = a.node.divideBy ?? 100, p = A / $, g = a.node.currency ?? "USD";
      try {
        return new Intl.NumberFormat(void 0, { style: "currency", currency: g }).format(p);
      } catch {
        return `${g} ${p.toFixed(2)}`;
      }
    }), k = y(() => {
      if (h.value)
        return "None";
      const A = m.value;
      if (a.node.type === "date" || a.node.type === "datetime")
        return new Date(String(A)).toLocaleDateString(void 0, v[a.node.type]);
      if (a.node.type === "money")
        return w.value;
      let $ = String(A);
      return a.node.transform === "upper" && ($ = $.toUpperCase()), a.node.transform === "lower" && ($ = $.toLowerCase()), [a.node.prefix, $, a.node.suffix].filter(Boolean).join(" ");
    }), S = y(() => {
      const A = typeof m.value == "boolean" ? m.value ? "1" : "" : String(m.value), $ = a.node.colors?.[A] ?? a.node.defaultColor ?? "neutral";
      return dn[$] ?? "outline";
    }), C = y(() => {
      const A = typeof a.node.view == "string" ? a.node.view : "";
      return A ? Mw(A) : void 0;
    }), B = y(() => {
      const A = typeof a.node.view == "string" ? a.node.view : "";
      if (!A)
        return "ViewEntry has no view name.";
      const $ = Bw(), p = $.length > 0 ? $.join(", ") : "(none)";
      return `No entry view for [${A}]; registered: ${p}`;
    });
    return (A, $) => {
      const p = Qt("InfoNode", !0);
      return e.node.component === "entry" ? (t(), n("div", Aw, [
        l("dt", zw, f(e.node.label), 1),
        l("dd", _w, [
          e.node.type === "badge" && x(Nu)(m.value) ? (t(), T(Ie, {
            key: 0,
            variant: S.value,
            class: "capitalize"
          }, {
            default: O(() => [
              U(f(m.value), 1)
            ]),
            _: 1
          }, 8, ["variant"])) : e.node.type === "badge" ? (t(), n("span", Pw, "None")) : e.node.type === "icon" ? (t(), T(gu, {
            key: 2,
            value: m.value,
            icons: e.node.icons,
            colors: e.node.colors,
            labels: e.node.labels,
            "default-icon": e.node.defaultIcon
          }, null, 8, ["value", "icons", "colors", "labels", "default-icon"])) : e.node.type === "image" ? (t(), T(ku, {
            key: 3,
            src: m.value,
            "fallback-text": e.record[e.node.fallbackFrom ?? "name"],
            rounded: e.node.rounded !== !1,
            size: e.node.size ?? "md",
            fallback: e.node.fallback ?? "initials"
          }, null, 8, ["src", "fallback-text", "rounded", "size", "fallback"])) : e.node.type === "color" || e.node.type === "colour" ? (t(), T(Mu, {
            key: 4,
            value: typeof m.value == "string" ? m.value : null,
            "show-value": e.node.showValue !== !1
          }, null, 8, ["value", "show-value"])) : e.node.type === "code" ? (t(), n("div", Lw, [
            e.node.language ? (t(), n("p", Ow, f(e.node.language), 1)) : b("", !0),
            l("pre", jw, [
              l("code", null, f(m.value ?? ""), 1)
            ])
          ])) : e.node.type === "keyvalue" ? (t(), n("div", Vw, [
            m.value && typeof m.value == "object" && !Array.isArray(m.value) && Object.keys(m.value).length ? (t(), n("dl", Dw, [
              (t(!0), n(_, null, j(m.value, (g, M) => (t(), n("div", {
                key: M,
                class: "grid grid-cols-3 gap-2 px-3 py-2 text-sm"
              }, [
                l("dt", Tw, f(M), 1),
                l("dd", Iw, f(g), 1)
              ]))), 128))
            ])) : (t(), n("span", Ew, "None"))
          ])) : e.node.type === "repeatable" ? (t(), n("div", Fw, [
            (t(!0), n(_, null, j(Array.isArray(m.value) ? m.value : [], (g, M) => (t(), n("div", {
              key: M,
              class: "rounded-md border p-3"
            }, [
              (t(!0), n(_, null, j(e.node.entries ?? [], (F, D) => (t(), T(p, {
                key: D,
                node: F,
                record: g,
                depth: e.depth + 1,
                onAction: $[0] || ($[0] = (Y) => r("action", Y))
              }, null, 8, ["node", "record", "depth"]))), 128))
            ]))), 128)),
            !Array.isArray(m.value) || m.value.length === 0 ? (t(), n("span", Nw, "None")) : b("", !0)
          ])) : e.node.type === "money" ? (t(), n("span", {
            key: 8,
            class: z(h.value ? "text-muted-foreground font-normal" : "")
          }, f(w.value), 3)) : e.node.type === "view" && C.value ? (t(), T(Ce(C.value), {
            key: 9,
            node: e.node,
            record: e.record,
            value: m.value
          }, null, 8, ["node", "record", "value"])) : e.node.type === "view" ? (t(), n("p", Rw, f(B.value), 1)) : e.node.url && !h.value ? (t(), n("a", {
            key: 11,
            href: e.node.url,
            class: "text-foreground font-medium underline-offset-2 hover:underline"
          }, f(k.value), 9, Uw)) : (t(), n("span", {
            key: 12,
            class: z([
              h.value || e.node.muted ? "text-muted-foreground font-normal" : "",
              e.node.mono ? "font-mono text-xs" : ""
            ])
          }, f(k.value), 3)),
          e.node.action ? (t(), n("button", {
            key: 13,
            type: "button",
            class: "text-muted-foreground hover:text-foreground mt-0.5 text-xs font-normal underline-offset-2 hover:underline",
            onClick: $[1] || ($[1] = (g) => r("action", e.node.action))
          }, f(e.node.action.label), 1)) : b("", !0)
        ])
      ])) : e.node.component === "section" ? (t(), n("section", {
        key: 1,
        class: z(
          d.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("header", {
          class: z(["flex items-start justify-between gap-3", [
            d.value ? "px-4 py-3.5 sm:px-5" : "pb-2",
            e.node.collapsible ? "cursor-pointer select-none" : ""
          ]]),
          onClick: $[2] || ($[2] = (g) => e.node.collapsible && (s.value = !s.value))
        }, [
          l("div", Hw, [
            e.node.icon ? (t(), n("div", qw, [
              (t(), n("svg", Kw, [
                l("path", {
                  d: x(me)(e.node.icon)
                }, null, 8, Gw)
              ]))
            ])) : b("", !0),
            l("div", Ww, [
              l("div", Zw, [
                l("h3", Jw, f(e.node.label), 1),
                e.node.status ? (t(), T($e, {
                  key: 0,
                  status: e.node.status,
                  class: "capitalize"
                }, null, 8, ["status"])) : b("", !0)
              ]),
              e.node.description ? (t(), n("p", Yw, f(e.node.description), 1)) : b("", !0)
            ])
          ])
        ], 2),
        s.value ? (t(), n("dl", {
          key: 0,
          class: z(["grid grid-cols-1 gap-x-6 gap-y-4", [u.value, d.value ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""]])
        }, [
          (t(!0), n(_, null, j(e.node.children ?? [], (g, M) => (t(), T(p, {
            key: M,
            node: g,
            record: e.record,
            depth: e.depth + 1,
            onAction: $[3] || ($[3] = (F) => r("action", F))
          }, null, 8, ["node", "record", "depth"]))), 128))
        ], 2)) : b("", !0)
      ], 2)) : e.node.component === "grid" ? (t(), n("dl", {
        key: 2,
        class: "pk-responsive-grid grid gap-x-6 gap-y-4",
        style: ie(c(e.node))
      }, [
        (t(!0), n(_, null, j(e.node.children ?? [], (g, M) => (t(), T(p, {
          key: M,
          node: g,
          record: e.record,
          depth: e.depth + 1,
          onAction: $[4] || ($[4] = (F) => r("action", F))
        }, null, 8, ["node", "record", "depth"]))), 128))
      ], 4)) : e.node.component === "tabs" ? (t(), n("div", {
        key: 3,
        class: z(
          d.value ? "bg-card overflow-hidden rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("div", {
          class: z(["bg-muted/30 flex gap-1 overflow-x-auto p-1", d.value ? "border-b" : "rounded-md"]),
          role: "tablist",
          "aria-label": "Information sections"
        }, [
          (t(!0), n(_, null, j(e.node.children ?? [], (g, M) => (t(), n("button", {
            key: M,
            type: "button",
            role: "tab",
            class: z([
              "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors",
              i.value === M ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
            ]),
            "aria-selected": i.value === M,
            onClick: (F) => i.value = M
          }, [
            U(f(g.label) + " ", 1),
            g.badge !== null && g.badge !== void 0 ? (t(), T(Ie, {
              key: 0,
              variant: "secondary"
            }, {
              default: O(() => [
                U(f(g.badge), 1)
              ]),
              _: 2
            }, 1024)) : b("", !0)
          ], 10, Qw))), 128))
        ], 2),
        (t(!0), n(_, null, j(e.node.children ?? [], (g, M) => ge((t(), n("div", {
          key: M,
          class: z(["flex flex-col gap-5", d.value ? "p-4 sm:p-5" : "pt-4"])
        }, [
          (t(!0), n(_, null, j(g.children ?? [], (F, D) => (t(), T(p, {
            key: D,
            node: F,
            record: e.record,
            depth: e.depth + 1,
            onAction: $[5] || ($[5] = (Y) => r("action", Y))
          }, null, 8, ["node", "record", "depth"]))), 128))
        ], 2)), [
          [Ke, i.value === M]
        ])), 128))
      ], 2)) : b("", !0);
    };
  }
}), _S = /* @__PURE__ */ at(Xw, [["__scopeId", "data-v-d44efc4d"]]), e4 = { class: "text-muted-foreground text-sm font-normal" }, t4 = { class: "flex items-start gap-3" }, n4 = { class: "min-w-0 flex-1" }, a4 = { class: "flex flex-wrap items-center gap-2" }, l4 = { class: "truncate text-sm font-medium" }, o4 = { class: "text-muted-foreground mt-0.5 text-xs" }, s4 = { class: "text-muted-foreground text-xs font-normal" }, r4 = { class: "mt-auto flex items-center gap-2" }, i4 = /* @__PURE__ */ L({
  __name: "PaymentGateways",
  props: {
    gateways: {}
  },
  emits: ["configure", "toggle"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.gateways.filter((i) => i.connected).length);
    return (i, d) => (t(), n("div", {
      class: z(["flex flex-col gap-4", x(aa)]),
      "data-slot": "payment-gateways"
    }, [
      l("p", e4, f(s.value) + " of " + f(e.gateways.length) + " connected, showcase only, no live processors. ", 1),
      l("div", {
        class: z(x(im))
      }, [
        (t(!0), n(_, null, j(e.gateways, (u) => (t(), n("article", {
          key: u.key,
          class: "bg-background flex flex-col gap-4 rounded-lg border p-4"
        }, [
          l("div", t4, [
            l("span", {
              class: "flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white",
              style: ie({ background: u.color }),
              "aria-hidden": "true"
            }, f(u.mark), 5),
            l("div", n4, [
              l("div", a4, [
                l("h3", l4, f(u.label), 1),
                I($e, {
                  status: u.connected ? "connected" : "disconnected"
                }, {
                  default: O(() => [
                    U(f(u.connected ? "Connected" : "Not connected"), 1)
                  ]),
                  _: 2
                }, 1032, ["status"]),
                u.connected && u.enabled !== !1 ? (t(), T($e, {
                  key: 0,
                  status: "offered"
                }, {
                  default: O(() => [...d[0] || (d[0] = [
                    U(" Offered ", -1)
                  ])]),
                  _: 1
                })) : u.connected ? (t(), T($e, {
                  key: 1,
                  status: "disabled"
                }, {
                  default: O(() => [...d[1] || (d[1] = [
                    U(" Disabled ", -1)
                  ])]),
                  _: 1
                })) : b("", !0),
                u.isDefault ? (t(), T($e, {
                  key: 2,
                  status: "default"
                }, {
                  default: O(() => [...d[2] || (d[2] = [
                    U(" Default ", -1)
                  ])]),
                  _: 1
                })) : b("", !0),
                u.connected && u.mode ? (t(), T($e, {
                  key: 3,
                  status: u.mode
                }, {
                  default: O(() => [
                    U(f(u.mode), 1)
                  ]),
                  _: 2
                }, 1032, ["status"])) : b("", !0)
              ]),
              l("p", o4, f(u.caption), 1)
            ])
          ]),
          l("p", s4, f(u.methods.join(" · ")), 1),
          l("div", r4, [
            I(ce, {
              size: "sm",
              variant: "outline",
              onClick: (c) => r("configure", u.key)
            }, {
              default: O(() => [...d[3] || (d[3] = [
                U(" Configure ", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            I(ce, {
              size: "sm",
              variant: "ghost",
              onClick: (c) => r("toggle", u.key)
            }, {
              default: O(() => [
                U(f(u.connected ? "Disconnect" : "Connect"), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ])
        ]))), 128))
      ], 2)
    ], 2));
  }
}), d4 = { class: "flex flex-col gap-6" }, u4 = { class: "relative" }, c4 = {
  class: "text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, f4 = ["d"], m4 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, p4 = {
  key: 0,
  class: "flex flex-col gap-4"
}, v4 = { class: "flex flex-wrap items-center gap-2" }, g4 = { class: "text-muted-foreground text-sm font-normal" }, h4 = { class: "flex flex-col gap-1 text-sm" }, b4 = ["value"], y4 = {
  key: 0,
  class: "flex flex-col gap-2"
}, x4 = { class: "flex flex-wrap items-center gap-2" }, k4 = {
  key: 1,
  class: "flex items-center gap-2"
}, PS = /* @__PURE__ */ L({
  __name: "PaymentGatewaySettings",
  props: /* @__PURE__ */ Ne({
    title: { default: "Payment gateways" },
    description: { default: null },
    headingVariant: { default: "default" }
  }, {
    gateways: { default: () => [] },
    gatewaysModifiers: {}
  }),
  emits: ["update:gateways"],
  setup(e) {
    const o = vt(e, "gateways"), a = q(null), r = q(""), s = y(
      () => o.value.find((k) => k.key === a.value) ?? null
    ), i = y(() => {
      const k = r.value.trim().toLowerCase();
      return k === "" ? o.value : o.value.filter((S) => [S.key, S.label, S.caption, ...S.methods].join(" ").toLowerCase().includes(k));
    });
    function d(k) {
      return k.connected && k.enabled !== !1;
    }
    function u(k, S) {
      o.value = o.value.map(
        (C) => C.key === k ? { ...C, ...S } : C
      );
    }
    function c(k) {
      a.value = k;
    }
    function v(k) {
      const S = o.value.find((B) => B.key === k);
      if (!S)
        return;
      const C = !S.connected;
      u(k, {
        connected: C,
        mode: C ? S.mode ?? "test" : null,
        enabled: C,
        isDefault: !1
      });
    }
    function m(k, S) {
      const C = o.value.find((B) => B.key === k);
      C?.connected && u(k, { enabled: S, isDefault: S ? C.isDefault : !1 });
    }
    function h(k) {
      const S = o.value.find((C) => C.key === k);
      !S || !d(S) || (o.value = o.value.map((C) => ({
        ...C,
        isDefault: C.key === k
      })));
    }
    function w(k) {
      const S = a.value;
      !S || !o.value.find((B) => B.key === S)?.connected || u(S, { mode: k });
    }
    return (k, S) => (t(), n(_, null, [
      l("div", d4, [
        I(Ee, {
          variant: e.headingVariant,
          title: e.title,
          description: e.description ?? void 0
        }, null, 8, ["variant", "title", "description"]),
        l("div", u4, [
          (t(), n("svg", c4, [
            l("path", {
              d: x(me)("search")
            }, null, 8, f4)
          ])),
          I(we, {
            modelValue: r.value,
            "onUpdate:modelValue": S[0] || (S[0] = (C) => r.value = C),
            type: "search",
            class: "pl-9",
            placeholder: "Search gateways…",
            "aria-label": "Search payment gateways"
          }, null, 8, ["modelValue"])
        ]),
        i.value.length > 0 ? (t(), T(i4, {
          key: 0,
          gateways: i.value,
          onConfigure: c,
          onToggle: v
        }, null, 8, ["gateways"])) : (t(), n("p", m4, " No gateways match “" + f(r.value.trim()) + "”. ", 1))
      ]),
      I(Pt, {
        open: s.value !== null,
        title: s.value?.label ?? "Gateway",
        description: "Showcase fields only. Values are not sent anywhere.",
        size: "md",
        onClose: S[8] || (S[8] = (C) => a.value = null)
      }, {
        footer: O(() => [
          I(ce, {
            variant: "outline",
            size: "sm",
            onClick: S[6] || (S[6] = (C) => a.value = null)
          }, {
            default: O(() => [...S[21] || (S[21] = [
              U("Close", -1)
            ])]),
            _: 1
          }),
          s.value ? (t(), T(ce, {
            key: 0,
            size: "sm",
            onClick: S[7] || (S[7] = (C) => v(s.value.key))
          }, {
            default: O(() => [
              U(f(s.value.connected ? "Disconnect" : "Mark connected"), 1)
            ]),
            _: 1
          })) : b("", !0)
        ]),
        default: O(() => [
          s.value ? (t(), n("div", p4, [
            l("div", v4, [
              I($e, {
                status: s.value.connected ? "connected" : "disconnected"
              }, {
                default: O(() => [
                  U(f(s.value.connected ? "Connected" : "Not connected"), 1)
                ]),
                _: 1
              }, 8, ["status"]),
              s.value.connected && s.value.enabled !== !1 ? (t(), T($e, {
                key: 0,
                status: "offered"
              }, {
                default: O(() => [...S[9] || (S[9] = [
                  U(" Offered ", -1)
                ])]),
                _: 1
              })) : s.value.connected ? (t(), T($e, {
                key: 1,
                status: "disabled"
              }, {
                default: O(() => [...S[10] || (S[10] = [
                  U(" Disabled ", -1)
                ])]),
                _: 1
              })) : b("", !0),
              s.value.isDefault ? (t(), T($e, {
                key: 2,
                status: "default"
              }, {
                default: O(() => [...S[11] || (S[11] = [
                  U(" Default ", -1)
                ])]),
                _: 1
              })) : b("", !0),
              s.value.connected && s.value.mode ? (t(), T($e, {
                key: 3,
                status: s.value.mode
              }, {
                default: O(() => [
                  U(f(s.value.mode), 1)
                ]),
                _: 1
              }, 8, ["status"])) : b("", !0)
            ]),
            l("p", g4, f(s.value.caption), 1),
            l("label", h4, [
              S[12] || (S[12] = U(" Display name ", -1)),
              l("input", {
                class: "border-input h-9 rounded-md border bg-transparent px-3 text-sm",
                value: s.value.label,
                readonly: ""
              }, null, 8, b4)
            ]),
            S[20] || (S[20] = l("label", { class: "flex flex-col gap-1 text-sm" }, [
              U(" Merchant / till (placeholder) "),
              l("input", {
                class: "border-input h-9 rounded-md border bg-transparent px-3 text-sm",
                placeholder: "Not stored, demo field",
                autocomplete: "off"
              })
            ], -1)),
            s.value.connected ? (t(), n("div", y4, [
              S[16] || (S[16] = l("p", { class: "text-sm font-medium" }, "Checkout", -1)),
              S[17] || (S[17] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " Disabled gateways stay connected but are not offered at checkout. Only one gateway can be the default tender. ", -1)),
              l("div", x4, [
                I(ce, {
                  size: "sm",
                  variant: s.value.enabled !== !1 ? "default" : "outline",
                  onClick: S[1] || (S[1] = (C) => m(s.value.key, !0))
                }, {
                  default: O(() => [...S[13] || (S[13] = [
                    U(" Enable ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant"]),
                I(ce, {
                  size: "sm",
                  variant: s.value.enabled === !1 ? "default" : "outline",
                  onClick: S[2] || (S[2] = (C) => m(s.value.key, !1))
                }, {
                  default: O(() => [...S[14] || (S[14] = [
                    U(" Disable ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant"]),
                I(ce, {
                  size: "sm",
                  variant: s.value.isDefault ? "default" : "outline",
                  disabled: !d(s.value),
                  onClick: S[3] || (S[3] = (C) => h(s.value.key))
                }, {
                  default: O(() => [...S[15] || (S[15] = [
                    U(" Use as default ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant", "disabled"])
              ])
            ])) : b("", !0),
            s.value.connected ? (t(), n("div", k4, [
              I(ce, {
                size: "sm",
                variant: s.value.mode === "test" ? "default" : "outline",
                onClick: S[4] || (S[4] = (C) => w("test"))
              }, {
                default: O(() => [...S[18] || (S[18] = [
                  U(" Test ", -1)
                ])]),
                _: 1
              }, 8, ["variant"]),
              I(ce, {
                size: "sm",
                variant: s.value.mode === "live" ? "default" : "outline",
                onClick: S[5] || (S[5] = (C) => w("live"))
              }, {
                default: O(() => [...S[19] || (S[19] = [
                  U(" Live ", -1)
                ])]),
                _: 1
              }, 8, ["variant"])
            ])) : b("", !0)
          ])) : b("", !0)
        ]),
        _: 1
      }, 8, ["open", "title"])
    ], 64));
  }
});
function Pn(e) {
  if (typeof localStorage > "u")
    return /* @__PURE__ */ new Set();
  try {
    const o = localStorage.getItem(e);
    if (o)
      return new Set(JSON.parse(o));
  } catch {
  }
  return /* @__PURE__ */ new Set();
}
function LS(e) {
  const o = q(Pn(e));
  be(() => {
    o.value = Pn(e);
  }), pe(
    o,
    (u) => {
      try {
        localStorage.setItem(e, JSON.stringify([...u]));
      } catch {
      }
    },
    { deep: !0 }
  );
  function a(u) {
    const c = new Set(o.value);
    c.has(u) ? c.delete(u) : c.add(u), o.value = c;
  }
  function r(u) {
    const c = new Set(o.value);
    c.add(u), o.value = c;
  }
  function s(u) {
    const c = new Set(o.value);
    c.delete(u), o.value = c;
  }
  function i(u) {
    o.value = new Set(u);
  }
  function d() {
    o.value = /* @__PURE__ */ new Set();
  }
  return { hidden: o, toggle: a, hide: r, show: s, setHidden: i, reset: d };
}
function Ln(e) {
  if (typeof localStorage > "u")
    return {};
  try {
    const o = localStorage.getItem(e);
    if (!o)
      return {};
    const a = JSON.parse(o), r = {};
    for (const [s, i] of Object.entries(a))
      typeof i == "number" && i >= 48 && i <= 1200 && (r[s] = i);
    return r;
  } catch {
    return {};
  }
}
function OS(e) {
  const o = q(Ln(e));
  On() && be(() => {
    o.value = Ln(e);
  }), pe(
    o,
    (i) => {
      try {
        localStorage.setItem(e, JSON.stringify(i));
      } catch {
      }
    },
    { deep: !0, flush: "sync" }
  );
  function a(i, d) {
    const u = Math.min(1200, Math.max(48, Math.round(d)));
    o.value = { ...o.value, [i]: u };
  }
  function r(i) {
    const d = {};
    for (const [u, c] of Object.entries(i))
      typeof c == "number" && c >= 48 && c <= 1200 && (d[u] = Math.round(c));
    o.value = d;
  }
  function s() {
    o.value = {};
  }
  return { widths: o, setWidth: a, setWidths: r, reset: s };
}
function jS(e) {
  const { config: o, rows: a, rowKey: r = "id", fetchChanges: s, onResync: i, onInsert: d } = e, u = q(
    o.driver === "none" ? "off" : "connecting"
  ), c = q(/* @__PURE__ */ new Set());
  let v = /* @__PURE__ */ new Map(), m, h, w, k = (/* @__PURE__ */ new Date()).toISOString(), S = null;
  function C(Z, W) {
    v.set(Z, { ...v.get(Z) ?? {}, ...W }), !m && (m = setTimeout(() => {
      m = void 0, B();
    }, o.batchMs));
  }
  function B() {
    if (v.size === 0)
      return;
    const Z = v;
    v = /* @__PURE__ */ new Map();
    const W = /* @__PURE__ */ new Set();
    for (const [H, N] of Z) {
      const R = a.value.find((X) => X[r] === H);
      if (!R) {
        d?.(H, N);
        continue;
      }
      Object.assign(R, N), W.add(H);
    }
    W.size !== 0 && (c.value = /* @__PURE__ */ new Set([...c.value, ...W]), setTimeout(() => {
      const H = new Set(c.value);
      W.forEach((N) => H.delete(N)), c.value = H;
    }, 1500));
  }
  async function A() {
    if (!(!s || a.value.length === 0)) {
      w?.abort(), w = new AbortController();
      try {
        const Z = a.value.map((N) => N[r]), { records: W, at: H } = await s(Z, k);
        k = H, u.value = "live";
        for (const N of W)
          C(N[r], N);
      } catch {
        u.value = "connecting";
      }
    }
  }
  function $() {
    p(), u.value = "live", h = setInterval(A, o.intervalMs);
  }
  function p() {
    clearInterval(h), h = void 0, w?.abort();
  }
  function g() {
    return window.Echo ?? null;
  }
  function M() {
    const Z = g();
    if (!Z || !o.channel) {
      u.value = "connecting", console.warn(
        "[alxtexhpanel] broadcast driver configured but window.Echo is unavailable."
      );
      return;
    }
    S = o.channel;
    const W = Z.private(o.channel);
    for (const H of o.events)
      W.listen(H, (N) => {
        N?.[r] !== void 0 && C(N[r], N);
      });
    u.value = "live", Z.connector?.pusher?.connection?.bind("connected", () => {
      u.value = "live", i?.();
    }), Z.connector?.pusher?.connection?.bind("disconnected", () => {
      u.value = "connecting";
    });
  }
  function F() {
    S && (g()?.leave(S), S = null);
  }
  function D() {
    o.driver === "poll" && $(), o.driver === "broadcast" && M();
  }
  function Y() {
    p(), F(), clearTimeout(m), m = void 0, v = /* @__PURE__ */ new Map();
  }
  function G() {
    o.pauseWhenHidden && (document.hidden ? (Y(), u.value = "paused") : (k = (/* @__PURE__ */ new Date()).toISOString(), D(), i?.()));
  }
  return On() && (be(() => {
    o.driver !== "none" && (D(), o.pauseWhenHidden && document.addEventListener("visibilitychange", G));
  }), ke(() => {
    document.removeEventListener("visibilitychange", G), Y();
  })), { status: u, recentlyChanged: c, applyPatch: C, flush: B, pollOnce: A };
}
const $4 = /^[a-z0-9-]+$/, w4 = /^[a-zA-Z0-9\s.,()%#/-]+$/;
function VS(e) {
  $a(() => {
    if (typeof document > "u")
      return;
    const o = {};
    for (const [a, r] of Object.entries(e.value ?? {}))
      !$4.test(a) || typeof r != "string" || !w4.test(r) || (o[`--${a}`] = r);
    Tc(o);
  });
}
const C4 = { class: "flex items-center gap-0.5" }, S4 = /* @__PURE__ */ L({
  __name: "PkColourModePreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), n("span", C4, [
      String(e.value) === "mono" ? (t(), n(_, { key: 0 }, [
        a[0] || (a[0] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-black" }, null, -1)),
        a[1] || (a[1] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-neutral-500" }, null, -1)),
        a[2] || (a[2] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-white" }, null, -1))
      ], 64)) : (t(), n(_, { key: 1 }, [
        a[3] || (a[3] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-sky-600" }, null, -1)),
        a[4] || (a[4] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-amber-500" }, null, -1)),
        a[5] || (a[5] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-emerald-600" }, null, -1))
      ], 64))
    ]));
  }
}), M4 = /* @__PURE__ */ L({
  __name: "PkVoucherCodeBoxPreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), T(ia, {
      code: "AB-1234",
      style: ie(String(e.value)),
      compact: ""
    }, null, 8, ["style"]));
  }
}), B4 = {
  class: "flex flex-wrap gap-1.5",
  role: "listbox",
  "data-test": "icon-picker-field"
}, A4 = ["aria-selected", "disabled", "title", "onClick"], z4 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkIconPicker",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.field.icons ?? []), i = y(() => typeof a.modelValue == "string" ? a.modelValue : "");
    function d(u) {
      a.disabled || r("update:modelValue", u === i.value ? null : u);
    }
    return (u, c) => (t(), n("div", B4, [
      (t(!0), n(_, null, j(s.value, (v) => (t(), n("button", {
        key: v,
        type: "button",
        role: "option",
        class: z(["border-input hover:bg-accent inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-xs font-medium disabled:opacity-50", [
          x(Be),
          i.value === v ? "border-primary bg-primary/10 text-primary" : ""
        ]]),
        "aria-selected": i.value === v,
        disabled: e.disabled,
        title: v,
        onClick: (m) => d(v)
      }, f(v), 11, A4))), 128))
    ]));
  }
}), _4 = ["value", "placeholder", "disabled"], P4 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkPhone",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => typeof a.modelValue == "string" ? a.modelValue : "");
    function i(d) {
      const u = d.target.value;
      r("update:modelValue", u === "" ? null : u.trim());
    }
    return (d, u) => (t(), n("input", {
      type: "tel",
      inputmode: "tel",
      autocomplete: "tel",
      class: z(["border-input bg-background h-10 w-full rounded-md border px-3 text-sm", x(Be)]),
      value: s.value,
      placeholder: e.field.placeholder ?? "+254712345678",
      disabled: e.disabled,
      "data-test": "phone-field",
      onInput: i
    }, null, 42, _4));
  }
}), L4 = ["aria-label"], O4 = ["disabled", "aria-label", "aria-pressed", "onClick"], j4 = {
  class: "size-5",
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, V4 = { key: 0 }, D4 = ["id"], T4 = ["fill"], I4 = ["disabled"], E4 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkRating",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => Math.max(1, Math.min(10, Number(a.field.max ?? 5)))), i = y(() => !!a.field.allowHalf), d = y(() => {
      const v = Number(a.modelValue);
      return Number.isFinite(v) ? v : 0;
    });
    function u(v) {
      a.disabled || r("update:modelValue", v);
    }
    function c(v) {
      return d.value >= v ? "full" : i.value && d.value >= v - 0.5 ? "half" : "empty";
    }
    return (v, m) => (t(), n("div", {
      class: "inline-flex items-center gap-0.5",
      role: "group",
      "aria-label": `Rating out of ${s.value}`,
      "data-test": "rating-field"
    }, [
      (t(!0), n(_, null, j(s.value, (h) => (t(), n("button", {
        key: h,
        type: "button",
        class: "rounded p-0.5 text-amber-500 transition-colors hover:text-amber-600 disabled:opacity-50",
        disabled: e.disabled,
        "aria-label": `${h} of ${s.value}`,
        "aria-pressed": d.value >= h,
        onClick: (w) => u(h)
      }, [
        (t(), n("svg", j4, [
          c(h) === "half" ? (t(), n("defs", V4, [
            l("linearGradient", {
              id: `half-${e.field.key}-${h}`,
              x1: "0",
              x2: "1",
              y1: "0",
              y2: "0"
            }, [...m[1] || (m[1] = [
              l("stop", {
                offset: "50%",
                "stop-color": "currentColor"
              }, null, -1),
              l("stop", {
                offset: "50%",
                "stop-color": "transparent",
                "stop-opacity": "1"
              }, null, -1)
            ])], 8, D4)
          ])) : b("", !0),
          l("path", {
            d: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z",
            fill: c(h) === "full" ? "currentColor" : c(h) === "half" ? `url(#half-${e.field.key}-${h})` : "none",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }, null, 8, T4)
        ]))
      ], 8, O4))), 128)),
      d.value > 0 ? (t(), n("button", {
        key: 0,
        type: "button",
        class: "text-muted-foreground ml-1 text-xs hover:text-foreground disabled:opacity-50",
        disabled: e.disabled,
        onClick: m[0] || (m[0] = (h) => u(0))
      }, " Clear ", 8, I4)) : b("", !0)
    ], 8, L4));
  }
}), F4 = { class: "flex flex-col gap-2" }, N4 = { class: "bg-card rounded-lg border p-4" }, R4 = { class: "text-muted-foreground truncate text-xs" }, U4 = { class: "flex flex-wrap gap-x-4 gap-y-1 text-xs" }, H4 = /* @__PURE__ */ L({
  __name: "PkSeoPreview",
  props: {
    field: {},
    values: { default: () => ({}) }
  },
  setup(e) {
    const o = e, a = {
      titleMax: 60,
      titleMin: 30,
      descriptionMax: 160,
      descriptionMin: 70
    }, r = y(() => ({ ...a, ...o.field.limits ?? {} })), s = y(
      () => String(o.values[o.field.watch?.title ?? "seo_title"] ?? "").trim()
    ), i = y(
      () => String(o.values[o.field.watch?.description ?? "seo_description"] ?? "").trim()
    ), d = y(
      () => String(o.field.siteUrl ?? "").replace(/^https?:\/\//, "").replace(/\/+$/, "")
    ), u = y(() => {
      const S = String(o.field.path ?? "/").split("?")[0].replace(/^\/+|\/+$/g, "");
      return S === "" ? d.value : `${d.value} › ${S.split("/").join(" › ")}`;
    });
    function c(S, C) {
      return S.length <= C ? S : `${S.slice(0, C - 1).trimEnd()}…`;
    }
    const v = y(() => c(s.value, r.value.titleMax)), m = y(() => c(i.value, r.value.descriptionMax));
    function h(S, C, B) {
      return S === 0 ? { tone: "text-muted-foreground", note: "empty" } : S > B ? { tone: "text-amber-600 dark:text-amber-400", note: "truncated" } : S < C ? { tone: "text-muted-foreground", note: "short" } : { tone: "text-emerald-600 dark:text-emerald-400", note: "good" };
    }
    const w = y(
      () => h(s.value.length, r.value.titleMin, r.value.titleMax)
    ), k = y(
      () => h(i.value.length, r.value.descriptionMin, r.value.descriptionMax)
    );
    return (S, C) => (t(), n("div", F4, [
      l("div", N4, [
        l("p", R4, f(u.value), 1),
        l("p", {
          class: z(["mt-1 truncate text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]", v.value === "" ? "text-muted-foreground italic" : ""])
        }, f(v.value || "Untitled page"), 3),
        l("p", {
          class: z(["text-muted-foreground mt-1 line-clamp-2 text-sm", m.value === "" ? "italic" : ""])
        }, f(m.value || "No description. The engine writes its own from the page text, which is usually a mid-sentence fragment."), 3)
      ]),
      l("div", U4, [
        l("span", {
          class: z(w.value.tone)
        }, " Title " + f(s.value.length) + "/" + f(r.value.titleMax) + " · " + f(w.value.note), 3),
        l("span", {
          class: z(k.value.tone)
        }, " Description " + f(i.value.length) + "/" + f(r.value.descriptionMax) + " · " + f(k.value.note), 3)
      ]),
      C[0] || (C[0] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " An approximation. Engines measure pixel width rather than characters, and may rewrite a title they judge unhelpful. ", -1))
    ]));
  }
}), q4 = {
  class: "relative",
  "data-test": "tree-select-field"
}, K4 = ["disabled"], G4 = {
  key: 0,
  class: "bg-popover absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-md border p-1 shadow-md"
}, W4 = ["onClick"], Z4 = ["onClick"], J4 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkTreeSelect",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = q(""), i = q(!1), d = y(() => a.field.options ?? []);
    function u(h, w) {
      return !w || h.label.toLowerCase().includes(w) ? !0 : (h.children ?? []).some((k) => u(k, w));
    }
    const c = y(() => {
      const h = s.value.trim().toLowerCase();
      return h ? d.value.filter((w) => u(w, h)) : d.value;
    }), v = y(() => {
      const h = (w) => {
        for (const k of w) {
          if (k.value === a.modelValue)
            return k.label;
          const S = h(k.children ?? []);
          if (S)
            return S;
        }
        return null;
      };
      return h(d.value);
    });
    function m(h) {
      a.disabled || (r("update:modelValue", h), i.value = !1);
    }
    return (h, w) => (t(), n("div", q4, [
      l("button", {
        type: "button",
        class: z(["border-input bg-background flex h-10 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50", x(Be)]),
        disabled: e.disabled,
        onClick: w[0] || (w[0] = (k) => i.value = !i.value)
      }, [
        l("span", {
          class: z(v.value ? "" : "text-muted-foreground")
        }, f(v.value ?? "Select…"), 3),
        w[2] || (w[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "▾", -1))
      ], 10, K4),
      i.value ? (t(), n("div", G4, [
        e.field.searchable ? ge((t(), n("input", {
          key: 0,
          "onUpdate:modelValue": w[1] || (w[1] = (k) => s.value = k),
          type: "search",
          class: "border-input mb-1 h-8 w-full rounded border px-2 text-sm",
          placeholder: "Search…"
        }, null, 512)), [
          [ze, s.value]
        ]) : b("", !0),
        (t(!0), n(_, null, j(c.value, (k) => (t(), n(_, {
          key: String(k.value)
        }, [
          l("button", {
            type: "button",
            class: z(["hover:bg-accent flex w-full rounded px-2 py-1.5 text-left text-sm font-medium", e.modelValue === k.value ? "bg-accent" : ""]),
            onClick: (S) => m(k.value)
          }, f(k.label), 11, W4),
          (t(!0), n(_, null, j(k.children ?? [], (S) => (t(), n("button", {
            key: String(S.value),
            type: "button",
            class: z(["hover:bg-accent text-muted-foreground flex w-full rounded py-1.5 pr-2 pl-6 text-left text-sm", e.modelValue === S.value ? "bg-accent text-foreground" : ""]),
            onClick: (C) => m(S.value)
          }, f(S.label), 11, Z4))), 128))
        ], 64))), 128))
      ])) : b("", !0)
    ]));
  }
});
function Y4() {
  xe("radio", bv), xe("toggle-buttons", Kn), xe("checkboxlist", kv), xe("tags", Av), xe("colour", Fv), xe("slider", yg), xe("rating", E4), xe("phone", P4), xe("icon-picker", z4), xe("tree-select", J4), xe("visual-select", Lg), xe("markdown", Yp), xe("code", lv), xe("map", qv), xe("qrcode", Jv), xe("barcode", ag), xe("diff", sg), xe("seo-preview", H4), It("swatch", jg), It("voucher-code-box", M4), It("document-colour-mode", S4);
}
function ca() {
  const e = q(null), o = q(!1);
  let a = null;
  return be(() => {
    if (typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver > "u" || !e.value) {
      o.value = !0;
      return;
    }
    a = new IntersectionObserver(
      (s) => {
        for (const i of s)
          i.isIntersecting && (o.value = !0, a?.disconnect());
      },
      // A little before it arrives, so the motion finishes as it lands
      // rather than starting once the reader is already looking at it.
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    ), a.observe(e.value);
  }), ke(() => a?.disconnect()), { el: e, shown: o };
}
const Q4 = /* @__PURE__ */ L({
  __name: "PkReveal",
  props: {
    delay: { default: 0 }
  },
  setup(e) {
    const { el: o, shown: a } = ca();
    return (r, s) => (t(), n("div", {
      ref_key: "el",
      ref: o,
      class: z(["transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none", x(a) ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"]),
      style: ie({ transitionDelay: `${e.delay}ms` })
    }, [
      K(r.$slots, "default")
    ], 6));
  }
}), X4 = ["id"], Se = /* @__PURE__ */ L({
  __name: "PkSection",
  props: {
    muted: { type: Boolean, default: !1 },
    narrow: { type: Boolean, default: !1 },
    id: {}
  },
  setup(e) {
    return (o, a) => (t(), n("section", {
      id: e.id,
      class: z(["pk-landing-section w-full px-4 sm:px-6", e.muted ? "bg-muted/40" : ""])
    }, [
      l("div", {
        class: z(["mx-auto w-full", e.narrow ? "max-w-3xl" : "max-w-6xl"])
      }, [
        I(Q4, null, {
          default: O(() => [
            K(o.$slots, "default")
          ]),
          _: 3
        })
      ], 2)
    ], 10, X4));
  }
}), e5 = {
  key: 0,
  class: "text-xs font-semibold tracking-widest text-primary uppercase"
}, t5 = {
  key: 1,
  class: "text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
}, n5 = {
  key: 2,
  class: "max-w-2xl text-pretty text-muted-foreground"
}, je = /* @__PURE__ */ L({
  __name: "PkSectionHeading",
  props: {
    eyebrow: {},
    title: {},
    body: {},
    centred: { type: Boolean, default: !0 }
  },
  setup(e) {
    return (o, a) => e.title || e.body || e.eyebrow ? (t(), n("div", {
      key: 0,
      class: z(["flex flex-col gap-3", e.centred ? "items-center text-center" : ""])
    }, [
      e.eyebrow ? (t(), n("p", e5, f(e.eyebrow), 1)) : b("", !0),
      e.title ? (t(), n("h2", t5, f(e.title), 1)) : b("", !0),
      e.body ? (t(), n("p", n5, f(e.body), 1)) : b("", !0)
    ], 2)) : b("", !0);
  }
}), a5 = { class: "flex flex-col gap-10" }, l5 = { class: "grid gap-4 md:grid-cols-3" }, o5 = {
  key: 0,
  class: "text-xs font-medium text-muted-foreground"
}, s5 = { class: "text-sm font-semibold text-balance" }, r5 = {
  key: 1,
  class: "text-pretty text-sm text-muted-foreground"
}, i5 = /* @__PURE__ */ L({
  __name: "PkArticles",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", a5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", l5, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", { key: s }, [
              (t(), T(Ce(r.href ? "a" : "div"), {
                href: r.href || void 0,
                class: "flex h-full flex-col gap-3 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
              }, {
                default: O(() => [
                  r.meta ? (t(), n("p", o5, f(r.meta), 1)) : b("", !0),
                  l("h3", s5, f(r.title), 1),
                  r.body ? (t(), n("p", r5, f(r.body), 1)) : b("", !0)
                ]),
                _: 2
              }, 1032, ["href"]))
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
});
function d5() {
  const e = q(null);
  let o = null;
  function a(s) {
    if (!o)
      return;
    const i = o.getBoundingClientRect();
    o.style.setProperty("--pk-px", String((s.clientX - i.left) / i.width)), o.style.setProperty("--pk-py", String((s.clientY - i.top) / i.height));
  }
  function r() {
    o?.style.setProperty("--pk-px", "0.5"), o?.style.setProperty("--pk-py", "0.5");
  }
  return be(() => {
    typeof window < "u" && typeof window.matchMedia == "function" && (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover)").matches) || !e.value || (o = e.value, r(), o.addEventListener("pointermove", a, { passive: !0 }), o.addEventListener("pointerleave", r, { passive: !0 }));
  }), ke(() => {
    o?.removeEventListener("pointermove", a), o?.removeEventListener("pointerleave", r);
  }), { el: e };
}
const u5 = { class: "pk-tilt-inner relative h-full" }, c5 = /* @__PURE__ */ L({
  __name: "PkTiltCard",
  setup(e) {
    const { el: o } = d5();
    return (a, r) => (t(), n("div", {
      ref_key: "el",
      ref: o,
      class: "pk-tilt group/tilt"
    }, [
      l("div", u5, [
        r[0] || (r[0] = l("span", {
          class: "pk-tilt-glow pointer-events-none absolute inset-0 rounded-lg",
          "aria-hidden": "true"
        }, null, -1)),
        K(a.$slots, "default")
      ])
    ], 512));
  }
}), f5 = { class: "flex flex-col gap-10" }, m5 = { class: "grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-3" }, p5 = { class: "text-base font-semibold" }, v5 = { class: "text-sm text-pretty text-muted-foreground" }, g5 = /* @__PURE__ */ L({
  __name: "PkBento",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    function o(a) {
      return {
        wide: "sm:col-span-2",
        tall: "sm:row-span-2",
        large: "sm:col-span-2 sm:row-span-2"
      }[a ?? ""] ?? "";
    }
    return (a, r) => (t(), T(Se, null, {
      default: O(() => [
        l("div", f5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", m5, [
            (t(!0), n(_, null, j(e.items ?? [], (s, i) => (t(), T(c5, {
              key: i,
              class: z(o(s.span))
            }, {
              default: O(() => [
                l("div", {
                  class: z([
                    "flex h-full flex-col justify-end gap-2 overflow-hidden rounded-xl border p-6 transition-shadow duration-300 hover:shadow-lg",
                    s.accent ? "bg-primary/5 border-primary/30 dark:bg-primary/10" : "bg-card"
                  ])
                }, [
                  l("h3", p5, f(s.title), 1),
                  l("p", v5, f(s.body), 1)
                ], 2)
              ]),
              _: 2
            }, 1032, ["class"]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), h5 = { class: "grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center" }, b5 = { class: "flex flex-col gap-4 rounded-xl border bg-card p-6 sm:p-8" }, y5 = { class: "grid gap-4 text-sm" }, x5 = {
  key: 0,
  class: "grid gap-1"
}, k5 = ["href"], $5 = {
  key: 1,
  class: "grid gap-1"
}, w5 = ["href"], C5 = {
  key: 2,
  class: "grid gap-1"
}, S5 = { class: "text-pretty text-muted-foreground" }, M5 = ["href"], B5 = /* @__PURE__ */ L({
  __name: "PkContact",
  props: {
    title: {},
    body: {},
    email: {},
    phone: {},
    address: {},
    label: {},
    href: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, { muted: "" }, {
      default: O(() => [
        l("div", h5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", b5, [
            l("dl", y5, [
              e.email ? (t(), n("div", x5, [
                a[0] || (a[0] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Email ", -1)),
                l("dd", null, [
                  l("a", {
                    href: `mailto:${e.email}`,
                    class: "font-medium text-foreground underline-offset-4 hover:underline"
                  }, f(e.email), 9, k5)
                ])
              ])) : b("", !0),
              e.phone ? (t(), n("div", $5, [
                a[1] || (a[1] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Phone ", -1)),
                l("dd", null, [
                  l("a", {
                    href: `tel:${e.phone.replace(/\s+/g, "")}`,
                    class: "font-medium text-foreground underline-offset-4 hover:underline"
                  }, f(e.phone), 9, w5)
                ])
              ])) : b("", !0),
              e.address ? (t(), n("div", C5, [
                a[2] || (a[2] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Address ", -1)),
                l("dd", S5, f(e.address), 1)
              ])) : b("", !0)
            ]),
            e.label ? (t(), n("a", {
              key: 0,
              href: e.href ?? (e.email ? `mailto:${e.email}` : "#"),
              class: "inline-flex h-11 w-fit items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            }, f(e.label), 9, M5)) : b("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), A5 = { class: "flex flex-col items-center gap-5 rounded-xl border bg-card px-6 py-12 text-center" }, z5 = { class: "max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl" }, _5 = {
  key: 0,
  class: "max-w-xl text-pretty text-muted-foreground"
}, P5 = ["href"], L5 = /* @__PURE__ */ L({
  __name: "PkCta",
  props: {
    title: {},
    body: {},
    label: {},
    href: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", A5, [
          l("h2", z5, f(e.title), 1),
          e.body ? (t(), n("p", _5, f(e.body), 1)) : b("", !0),
          e.label ? (t(), n("a", {
            key: 1,
            href: e.href ?? "#",
            class: "inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          }, f(e.label), 9, P5)) : b("", !0)
        ])
      ]),
      _: 1
    }));
  }
}), O5 = { class: "flex flex-col gap-8" }, j5 = { class: "divide-y rounded-lg border" }, V5 = { class: "flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent/50" }, D5 = { class: "px-4 pb-4 text-sm text-pretty text-muted-foreground" }, T5 = /* @__PURE__ */ L({
  __name: "PkFaq",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, { narrow: "" }, {
      default: O(() => [
        l("div", O5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", j5, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("details", {
              key: s,
              class: "group"
            }, [
              l("summary", V5, [
                U(f(r.question) + " ", 1),
                a[0] || (a[0] = l("span", {
                  class: "text-muted-foreground transition-transform group-open:rotate-45",
                  "aria-hidden": "true"
                }, " + ", -1))
              ]),
              l("p", D5, f(r.answer), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), I5 = { class: "flex flex-col gap-10" }, E5 = { class: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }, F5 = { class: "text-sm font-semibold" }, N5 = { class: "text-sm text-pretty text-muted-foreground" }, R5 = /* @__PURE__ */ L({
  __name: "PkFeatureGrid",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", I5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", E5, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-2 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              l("h3", F5, f(r.title), 1),
              l("p", N5, f(r.body), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), U5 = {
  key: 0,
  class: "pk-hero-brand text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
}, H5 = {
  key: 1,
  class: "rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground"
}, q5 = {
  key: 2,
  class: "max-w-2xl text-lg text-pretty text-muted-foreground"
}, K5 = {
  key: 3,
  class: "flex flex-wrap items-center justify-center gap-3"
}, G5 = ["href"], W5 = ["href"], Z5 = {
  key: 4,
  class: "text-xs font-normal text-muted-foreground"
}, J5 = /* @__PURE__ */ L({
  __name: "PkHero",
  props: {
    brand: {},
    eyebrow: {},
    title: {},
    body: {},
    primaryLabel: {},
    primaryHref: {},
    secondaryLabel: {},
    secondaryHref: {},
    note: {},
    variant: { default: "centered" }
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", {
          class: z(["flex flex-col items-center gap-6 text-center", e.variant === "bleed" ? "min-h-[70vh] justify-center py-8 sm:py-12" : ""])
        }, [
          e.brand ? (t(), n("p", U5, f(e.brand), 1)) : b("", !0),
          e.eyebrow ? (t(), n("p", H5, f(e.eyebrow), 1)) : b("", !0),
          l("h1", {
            class: z(["max-w-3xl font-semibold tracking-tight text-balance", e.brand ? "text-2xl sm:text-3xl md:text-4xl" : "text-4xl sm:text-5xl"])
          }, f(e.title), 3),
          e.body ? (t(), n("p", q5, f(e.body), 1)) : b("", !0),
          e.primaryLabel || e.secondaryLabel ? (t(), n("div", K5, [
            e.secondaryLabel ? (t(), n("a", {
              key: 0,
              href: e.secondaryHref ?? "#",
              class: "inline-flex h-11 items-center rounded-md border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent"
            }, f(e.secondaryLabel), 9, G5)) : b("", !0),
            e.primaryLabel ? (t(), n("a", {
              key: 1,
              href: e.primaryHref ?? "#",
              class: "inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            }, f(e.primaryLabel), 9, W5)) : b("", !0)
          ])) : b("", !0),
          e.note ? (t(), n("p", Z5, f(e.note), 1)) : b("", !0)
        ], 2)
      ]),
      _: 1
    }));
  }
}), Y5 = { class: "flex flex-col items-center gap-6" }, Q5 = {
  key: 0,
  class: "text-xs font-medium tracking-widest text-muted-foreground uppercase"
}, X5 = { class: "flex flex-wrap items-center justify-center gap-x-10 gap-y-4" }, e3 = /* @__PURE__ */ L({
  __name: "PkLogoCloud",
  props: {
    title: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, { muted: "" }, {
      default: O(() => [
        l("div", Y5, [
          e.title ? (t(), n("p", Q5, f(e.title), 1)) : b("", !0),
          l("ul", X5, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "text-lg font-semibold text-muted-foreground/70"
            }, f(r.name), 1))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), t3 = {
  key: 0,
  class: "mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
}, n3 = {
  class: "pk-marquee-track",
  role: "list"
}, a3 = ["href"], l3 = {
  key: 1,
  role: "listitem",
  class: "pk-marquee-item"
}, o3 = /* @__PURE__ */ L({
  __name: "PkMarquee",
  props: {
    title: { default: "" },
    items: { default: () => [] },
    speed: { default: "normal" },
    reverse: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = y(() => [...o.items, ...o.items]);
    return (r, s) => e.items.length ? (t(), T(Se, {
      key: 0,
      class: "overflow-hidden",
      "aria-label": e.title || "Highlights"
    }, {
      default: O(() => [
        e.title ? (t(), n("p", t3, f(e.title), 1)) : b("", !0),
        l("div", {
          class: z(["pk-marquee", [`pk-marquee-${e.speed}`, e.reverse ? "pk-marquee-reverse" : ""]])
        }, [
          l("div", n3, [
            (t(!0), n(_, null, j(a.value, (i, d) => (t(), n(_, {
              key: `${i.name}-${d}`
            }, [
              i.href ? (t(), n("a", {
                key: 0,
                href: i.href,
                role: "listitem",
                class: "pk-marquee-item"
              }, f(i.name), 9, a3)) : (t(), n("span", l3, f(i.name), 1))
            ], 64))), 128))
          ])
        ], 2)
      ]),
      _: 1
    }, 8, ["aria-label"])) : b("", !0);
  }
}), s3 = { class: "flex flex-col gap-10" }, r3 = {
  key: 0,
  class: "flex items-center justify-center gap-3"
}, i3 = {
  class: "inline-flex rounded-md border bg-background p-1",
  role: "group"
}, d3 = ["aria-pressed"], u3 = ["aria-pressed"], c3 = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, f3 = { class: "grid gap-4 md:grid-cols-3" }, m3 = { class: "flex flex-col gap-1" }, p3 = { class: "text-sm font-semibold" }, v3 = { class: "flex items-baseline gap-1" }, g3 = { class: "text-3xl font-semibold tracking-tight" }, h3 = {
  key: 0,
  class: "text-sm text-muted-foreground font-normal"
}, b3 = {
  key: 0,
  class: "text-sm text-pretty text-muted-foreground"
}, y3 = { class: "flex flex-col gap-2 text-sm" }, x3 = { class: "text-muted-foreground" }, k3 = ["href"], $3 = /* @__PURE__ */ L({
  __name: "PkPricing",
  props: {
    title: {},
    body: {},
    annualNote: {},
    items: {}
  },
  setup(e) {
    const o = e, a = q(!1), r = y(() => (o.items ?? []).some((i) => !!i.annualPrice));
    function s(i) {
      return a.value && i.annualPrice ? i.annualPrice : i.price;
    }
    return (i, d) => (t(), T(Se, { muted: "" }, {
      default: O(() => [
        l("div", s3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          r.value ? (t(), n("div", r3, [
            l("div", i3, [
              l("button", {
                type: "button",
                class: z([
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  a.value ? "text-muted-foreground" : "bg-primary text-primary-foreground"
                ]),
                "aria-pressed": !a.value,
                onClick: d[0] || (d[0] = (u) => a.value = !1)
              }, " Monthly ", 10, d3),
              l("button", {
                type: "button",
                class: z([
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  a.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                ]),
                "aria-pressed": a.value,
                onClick: d[1] || (d[1] = (u) => a.value = !0)
              }, " Annual ", 10, u3)
            ]),
            e.annualNote ? (t(), n("p", c3, f(e.annualNote), 1)) : b("", !0)
          ])) : b("", !0),
          l("ul", f3, [
            (t(!0), n(_, null, j(e.items ?? [], (u, c) => (t(), n("li", {
              key: c,
              class: z(["flex flex-col gap-4 rounded-lg border bg-card p-6", u.featured ? "border-primary shadow-sm" : ""])
            }, [
              l("div", m3, [
                l("h3", p3, f(u.name), 1),
                l("p", v3, [
                  l("span", g3, f(s(u)), 1),
                  u.period ? (t(), n("span", h3, f(u.period), 1)) : b("", !0)
                ]),
                u.body ? (t(), n("p", b3, f(u.body), 1)) : b("", !0)
              ]),
              l("ul", y3, [
                (t(!0), n(_, null, j(u.features ?? [], (v, m) => (t(), n("li", {
                  key: m,
                  class: "flex items-start gap-2"
                }, [
                  d[2] || (d[2] = l("span", {
                    class: "mt-0.5 text-success",
                    "aria-hidden": "true"
                  }, "✓", -1)),
                  l("span", x3, f(v.title), 1)
                ]))), 128))
              ]),
              u.label ? (t(), n("a", {
                key: 0,
                href: u.href ?? "#",
                class: z([
                  "mt-auto inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                  u.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border bg-background hover:bg-accent"
                ])
              }, f(u.label), 11, k3)) : b("", !0)
            ], 2))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
});
function w3() {
  const e = q(null);
  let o = null, a = null, r = !1, s = !1;
  function i() {
    if (r = !1, !o || !s)
      return;
    const u = o.getBoundingClientRect(), c = u.height + window.innerHeight, v = c <= 0 ? 0 : (window.innerHeight - u.top) / c;
    o.style.setProperty("--pk-progress", String(Math.min(Math.max(v, 0), 1)));
  }
  function d() {
    r || (r = !0, requestAnimationFrame(i));
  }
  return be(() => {
    const u = typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (e.value) {
      if (o = e.value, u || typeof IntersectionObserver > "u") {
        o.style.setProperty("--pk-progress", "1");
        return;
      }
      o.style.setProperty("--pk-progress", "0"), a = new IntersectionObserver((c) => {
        s = c.some((v) => v.isIntersecting), s && d();
      }), a.observe(o), window.addEventListener("scroll", d, { passive: !0 }), window.addEventListener("resize", d, { passive: !0 }), d();
    }
  }), ke(() => {
    a?.disconnect(), window.removeEventListener("scroll", d), window.removeEventListener("resize", d);
  }), { el: e };
}
const C3 = { class: "mx-auto h-[190vh] w-full max-w-6xl" }, S3 = { class: "sticky top-[12vh] flex flex-col items-center gap-8" }, M3 = { class: "flex max-w-2xl flex-col items-center gap-3 text-center" }, B3 = { class: "text-2xl font-semibold tracking-tight text-balance sm:text-3xl" }, A3 = {
  key: 0,
  class: "text-pretty text-muted-foreground"
}, z3 = { class: "pk-showcase-stage w-full [perspective:1400px]" }, _3 = { class: "pk-showcase-frame overflow-hidden rounded-xl border bg-card shadow-2xl" }, P3 = { class: "flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5" }, L3 = { class: "ml-3 truncate text-xs text-muted-foreground" }, O3 = { class: "flex" }, j3 = { class: "hidden w-40 shrink-0 flex-col gap-2 border-r p-4 sm:flex" }, V3 = { class: "min-w-0 flex-1 p-4" }, D3 = { class: "flex flex-col divide-y rounded-md border" }, T3 = /* @__PURE__ */ L({
  __name: "PkShowcase",
  props: {
    title: {},
    body: {},
    rows: { default: 6 },
    caption: {}
  },
  setup(e) {
    const { el: o } = w3();
    return (a, r) => (t(), n("section", {
      ref_key: "el",
      ref: o,
      class: "pk-showcase relative w-full px-4 sm:px-6"
    }, [
      l("div", C3, [
        l("div", S3, [
          l("div", M3, [
            l("h2", B3, f(e.title), 1),
            e.body ? (t(), n("p", A3, f(e.body), 1)) : b("", !0)
          ]),
          l("div", z3, [
            l("div", _3, [
              l("div", P3, [
                r[0] || (r[0] = l("span", { class: "size-2.5 rounded-full bg-red-400/70" }, null, -1)),
                r[1] || (r[1] = l("span", { class: "size-2.5 rounded-full bg-amber-400/70" }, null, -1)),
                r[2] || (r[2] = l("span", { class: "size-2.5 rounded-full bg-emerald-400/70" }, null, -1)),
                l("span", L3, f(e.caption ?? "yourpanel.example / records"), 1)
              ]),
              l("div", O3, [
                l("div", j3, [
                  (t(), n(_, null, j(6, (s) => l("span", {
                    key: s,
                    class: "h-2.5 rounded bg-foreground/10",
                    style: ie({ width: `${55 + s * 13 % 40}%` })
                  }, null, 4)), 64))
                ]),
                l("div", V3, [
                  r[4] || (r[4] = l("div", { class: "mb-3 flex gap-2" }, [
                    l("span", { class: "h-7 w-28 rounded-md bg-foreground/[0.07]" }),
                    l("span", { class: "h-7 w-20 rounded-md bg-foreground/[0.07]" }),
                    l("span", { class: "ml-auto h-7 w-24 rounded-md bg-primary/25" })
                  ], -1)),
                  l("div", D3, [
                    (t(!0), n(_, null, j(e.rows, (s) => (t(), n("div", {
                      key: s,
                      class: "pk-showcase-row flex items-center gap-3 px-3 py-2.5",
                      style: ie({ "--pk-row": String(s) })
                    }, [...r[3] || (r[3] = [
                      l("span", { class: "size-6 shrink-0 rounded-full bg-foreground/10" }, null, -1),
                      l("span", { class: "h-2.5 flex-1 rounded bg-foreground/10" }, null, -1),
                      l("span", { class: "hidden h-2.5 w-24 rounded bg-foreground/[0.07] sm:block" }, null, -1),
                      l("span", { class: "h-5 w-14 rounded-full bg-emerald-500/20" }, null, -1)
                    ])], 4))), 128))
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ], 512));
  }
}), I3 = /* @__PURE__ */ L({
  __name: "PkCountUp",
  props: {
    to: {},
    prefix: {},
    suffix: {},
    decimals: { default: 0 },
    duration: { default: 1400 }
  },
  setup(e) {
    const o = e, { el: a, shown: r } = ca(), s = q(0);
    return pe(r, (i) => {
      if (!i)
        return;
      if (typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof requestAnimationFrame > "u") {
        s.value = o.to;
        return;
      }
      const u = performance.now(), c = (v) => {
        const m = Math.min((v - u) / o.duration, 1);
        s.value = o.to * (1 - Math.pow(1 - m, 3)), m < 1 ? requestAnimationFrame(c) : s.value = o.to;
      };
      requestAnimationFrame(c);
    }), (i, d) => (t(), n("span", {
      ref_key: "el",
      ref: a
    }, f(e.prefix ?? "") + f(s.value.toFixed(e.decimals)) + f(e.suffix ?? ""), 513));
  }
}), E3 = { class: "flex flex-col gap-10" }, F3 = { class: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4" }, N3 = { class: "order-2 text-sm text-muted-foreground" }, R3 = { class: "order-1 text-3xl font-semibold tracking-tight sm:text-4xl" }, U3 = /* @__PURE__ */ L({
  __name: "PkStats",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    function o(a) {
      const r = /^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/.exec((a ?? "").trim());
      if (!r)
        return null;
      const s = r[2].includes(".") ? r[2].split(".")[1].length : 0;
      return { prefix: r[1], number: Number(r[2]), suffix: r[3], decimals: s };
    }
    return (a, r) => (t(), T(Se, { muted: "" }, {
      default: O(() => [
        l("div", E3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("dl", F3, [
            (t(!0), n(_, null, j(e.items ?? [], (s, i) => (t(), n("div", {
              key: i,
              class: "flex flex-col items-center gap-1 text-center"
            }, [
              l("dt", N3, f(s.label), 1),
              l("dd", R3, [
                o(s.value) ? (t(), T(I3, {
                  key: 0,
                  to: o(s.value).number,
                  prefix: o(s.value).prefix,
                  suffix: o(s.value).suffix,
                  decimals: o(s.value).decimals
                }, null, 8, ["to", "prefix", "suffix", "decimals"])) : (t(), n(_, { key: 1 }, [
                  U(f(s.value), 1)
                ], 64))
              ])
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), H3 = { class: "flex flex-col gap-10" }, q3 = { class: "grid gap-6 md:grid-cols-3" }, K3 = { class: "flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary" }, G3 = { class: "text-sm font-semibold" }, W3 = { class: "text-sm text-pretty text-muted-foreground" }, Z3 = /* @__PURE__ */ L({
  __name: "PkSteps",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", H3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ol", q3, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-2"
            }, [
              l("span", K3, f(s + 1), 1),
              l("h3", G3, f(r.title), 1),
              l("p", W3, f(r.body), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), J3 = { class: "flex flex-col gap-10" }, Y3 = { class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" }, Q3 = ["src"], X3 = {
  key: 1,
  class: "mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-lg font-semibold",
  "aria-hidden": "true"
}, e8 = { class: "min-w-0" }, t8 = { class: "truncate text-sm font-semibold" }, n8 = {
  key: 0,
  class: "truncate text-xs text-muted-foreground"
}, a8 = {
  key: 2,
  class: "text-pretty text-xs text-muted-foreground"
}, l8 = /* @__PURE__ */ L({
  __name: "PkTeam",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", J3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", Y3, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-3 rounded-lg border bg-card p-5 text-center transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              r.avatar ? (t(), n("img", {
                key: 0,
                src: r.avatar,
                alt: "",
                class: "mx-auto size-16 rounded-full object-cover"
              }, null, 8, Q3)) : (t(), n("span", X3, f((r.name ?? "?").slice(0, 1)), 1)),
              l("div", e8, [
                l("h3", t8, f(r.name), 1),
                r.role ? (t(), n("p", n8, f(r.role), 1)) : b("", !0)
              ]),
              r.bio ? (t(), n("p", a8, f(r.bio), 1)) : b("", !0)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), o8 = { class: "flex flex-col gap-10" }, s8 = { class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, r8 = { class: "flex h-full flex-col gap-4" }, i8 = { class: "text-pretty text-sm leading-relaxed" }, d8 = { class: "mt-auto flex items-center gap-3" }, u8 = ["src"], c8 = {
  key: 1,
  class: "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium",
  "aria-hidden": "true"
}, f8 = { class: "min-w-0" }, m8 = { class: "block truncate text-sm font-medium" }, p8 = {
  key: 0,
  class: "block truncate text-xs text-muted-foreground"
}, v8 = /* @__PURE__ */ L({
  __name: "PkTestimonials",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", o8, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", s8, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-4 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              l("figure", r8, [
                l("blockquote", i8, " “" + f(r.quote) + "” ", 1),
                l("figcaption", d8, [
                  r.avatar ? (t(), n("img", {
                    key: 0,
                    src: r.avatar,
                    alt: "",
                    class: "size-9 shrink-0 rounded-full object-cover"
                  }, null, 8, u8)) : (t(), n("span", c8, f((r.name ?? "?").slice(0, 1)), 1)),
                  l("span", f8, [
                    l("span", m8, f(r.name), 1),
                    r.role ? (t(), n("span", p8, f(r.role), 1)) : b("", !0)
                  ])
                ])
              ])
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), DS = /* @__PURE__ */ L({
  __name: "PkLandingSections",
  props: {
    sections: {},
    warnOnUnknown: { type: Boolean, default: !1 }
  },
  setup(e, { expose: o }) {
    const a = e, r = {
      hero: J5,
      logos: e3,
      marquee: o3,
      features: R5,
      bento: g5,
      showcase: T3,
      steps: Z3,
      stats: U3,
      testimonials: v8,
      team: l8,
      articles: i5,
      contact: B5,
      pricing: $3,
      faq: T5,
      cta: L5
    }, s = y(
      () => (a.sections ?? []).map((i, d) => ({
        key: `${i.type}-${d}`,
        component: r[i.type],
        type: i.type,
        data: i.data ?? {}
      })).filter((i) => (!i.component && a.warnOnUnknown && console.warn(`[alxtexhpanel] Unknown landing section "${i.type}" - skipped.`), !!i.component))
    );
    return o({ known: Object.keys(r) }), (i, d) => (t(!0), n(_, null, j(s.value, (u) => (t(), T(Ce(u.component), de({
      key: u.key
    }, { ref_for: !0 }, u.data), null, 16))), 128));
  }
}), g8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, TS = /* @__PURE__ */ L({
  __name: "PkAuroraBackdrop",
  props: {
    intensity: { default: "full" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", g8, [
      l("div", {
        class: z([
          "pk-blob absolute -top-32 -left-24 size-[38rem] rounded-full blur-3xl",
          e.intensity === "full" ? "opacity-60 dark:opacity-40" : "opacity-30 dark:opacity-20"
        ]),
        style: { background: "radial-gradient(circle at 30% 30%, var(--pk-aurora-1), transparent 70%)", "animation-delay": "0s" }
      }, null, 2),
      l("div", {
        class: z([
          "pk-blob absolute -top-16 right-0 size-[32rem] rounded-full blur-3xl",
          e.intensity === "full" ? "opacity-50 dark:opacity-35" : "opacity-25 dark:opacity-15"
        ]),
        style: { background: "radial-gradient(circle at 60% 40%, var(--pk-aurora-2), transparent 70%)", "animation-delay": "-7s" }
      }, null, 2),
      l("div", {
        class: z([
          "pk-blob absolute top-1/3 left-1/4 size-[30rem] rounded-full blur-3xl",
          e.intensity === "full" ? "opacity-40 dark:opacity-30" : "opacity-20 dark:opacity-10"
        ]),
        style: { background: "radial-gradient(circle at 40% 60%, var(--pk-aurora-3), transparent 70%)", "animation-delay": "-14s" }
      }, null, 2),
      a[0] || (a[0] = l("div", {
        class: "absolute inset-0 opacity-[0.15] dark:opacity-[0.08]",
        style: { "background-image": `linear-gradient(to right, currentColor 1px, transparent 1px),
                    linear-gradient(to bottom, currentColor 1px, transparent 1px)`, "background-size": "64px 64px", "mask-image": "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)" }
      }, null, -1))
    ]));
  }
}), h8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, IS = /* @__PURE__ */ L({
  __name: "PkEditorialBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", h8, [...a[0] || (a[0] = [
      ut('<div class="pk-wash absolute inset-0"></div><div class="absolute inset-y-0 left-1/2 hidden w-full max-w-3xl -translate-x-1/2 lg:block"><div class="absolute inset-y-0 left-0 w-px bg-foreground/[0.06]"></div><div class="absolute inset-y-0 right-0 w-px bg-foreground/[0.06]"></div></div><div class="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]" style="background-image:url(&quot;data:image/svg+xml;utf8,&lt;svg xmlns=&#39;http://www.w3.org/2000/svg&#39; width=&#39;160&#39; height=&#39;160&#39;&gt;&lt;filter id=&#39;n&#39;&gt;&lt;feTurbulence type=&#39;fractalNoise&#39; baseFrequency=&#39;0.85&#39; numOctaves=&#39;3&#39;/&gt;&lt;/filter&gt;&lt;rect width=&#39;160&#39; height=&#39;160&#39; filter=&#39;url(%23n)&#39;/&gt;&lt;/svg&gt;&quot;);"></div>', 3)
    ])]));
  }
}), b8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, ES = /* @__PURE__ */ L({
  __name: "PkConsoleBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", b8, [...a[0] || (a[0] = [
      l("div", {
        class: "absolute inset-0 opacity-[0.18] dark:opacity-[0.14]",
        style: { "background-image": "radial-gradient(currentColor 1px, transparent 1px)", "background-size": "22px 22px", "mask-image": "radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent 80%)" }
      }, null, -1),
      l("div", {
        class: "absolute inset-x-0 top-0 h-[36rem]",
        style: { background: `radial-gradient(
                    ellipse 60% 100% at 50% 0%,
                    var(--pk-console-glow),
                    transparent 70%
                )` }
      }, null, -1),
      l("div", { class: "pk-scanlines absolute inset-0" }, null, -1)
    ])]));
  }
}), y8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, FS = /* @__PURE__ */ L({
  __name: "PkStudioBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", y8, [...a[0] || (a[0] = [
      l("div", {
        class: "pk-studio-grid absolute inset-0",
        style: { "background-image": `linear-gradient(to right, var(--pk-studio-grid-major) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--pk-studio-grid-major) 1px, transparent 1px),
                    linear-gradient(to right, var(--pk-studio-grid-minor) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--pk-studio-grid-minor) 1px, transparent 1px)`, "background-size": `80px 80px,
                    80px 80px,
                    20px 20px,
                    20px 20px`, "mask-image": "radial-gradient(ellipse 80% 55% at 50% 0%, black, transparent 70%)" }
      }, null, -1),
      l("div", {
        class: "absolute top-16 left-1/2 -translate-x-1/2",
        style: { width: "36rem", height: "36rem", "border-radius": "50%", border: "1px solid var(--pk-studio-arc)" }
      }, null, -1),
      l("div", {
        class: "absolute inset-x-0 top-0 h-[32rem]",
        style: { background: `radial-gradient(
                    ellipse 70% 90% at 50% 0%,
                    var(--pk-studio-wash),
                    transparent 70%
                )` }
      }, null, -1)
    ])]));
  }
});
Y4();
const NS = "0.0.1";
export {
  bn as ACTION_KEY_ICONS,
  Gt as APPEARANCE_STYLE_ID,
  tm as Alert,
  nm as AlertDescription,
  am as AlertTitle,
  N6 as AppPageFooter,
  aC as AppearanceDrawer,
  a6 as Avatar,
  l6 as AvatarFallback,
  o6 as AvatarImage,
  dn as BADGE_VARIANTS,
  Y8 as BadgeResolver,
  J6 as BarChart,
  s6 as Breadcrumb,
  r6 as BreadcrumbEllipsis,
  i6 as BreadcrumbItem,
  d6 as BreadcrumbLink,
  u6 as BreadcrumbList,
  c6 as BreadcrumbPage,
  f6 as BreadcrumbSeparator,
  O8 as BulkActions,
  aa as CATALOGUE_CONTAINER,
  im as CATALOGUE_GRID,
  cC as CATALOGUE_GRID_TIGHT,
  dm as CATALOGUE_GRID_TILES,
  P6 as Card,
  L6 as CardAction,
  O6 as CardContent,
  j6 as CardDescription,
  V6 as CardFooter,
  D6 as CardHeader,
  T6 as CardTitle,
  x2 as CartPanel,
  fS as CatalogBrowser,
  Yy as CatalogCard,
  ua as CatalogFilterSheet,
  mn as CatalogGrid,
  uS as CatalogInspect,
  xk as CatalogItemDetail,
  cS as CatalogItemView,
  mS as CatalogRegister,
  dS as CatalogTill,
  Vb as ChartCard,
  bt as ChartTooltip,
  di as Checkbox,
  q8 as CheckboxCell,
  K8 as CodeCell,
  Mu as ColourCell,
  tS as ComboChart,
  ci as CreateOptionDialog,
  li as CreateOptionError,
  vS as DASHBOARD_HIDDEN_STORAGE_KEY,
  t$ as DASHBOARD_HIDE_KEY,
  gS as DashboardShortcuts,
  go as DataTable,
  x6 as Dialog,
  k6 as DialogClose,
  $6 as DialogContent,
  w6 as DialogDescription,
  C6 as DialogFooter,
  S6 as DialogHeader,
  Fm as DialogOverlay,
  M6 as DialogScrollContent,
  B6 as DialogTitle,
  A6 as DialogTrigger,
  UC as DropdownMenu,
  HC as DropdownMenuCheckboxItem,
  qC as DropdownMenuContent,
  KC as DropdownMenuGroup,
  GC as DropdownMenuItem,
  WC as DropdownMenuLabel,
  HS as DropdownMenuPortal,
  ZC as DropdownMenuRadioGroup,
  JC as DropdownMenuRadioItem,
  YC as DropdownMenuSeparator,
  QC as DropdownMenuShortcut,
  XC as DropdownMenuSub,
  e6 as DropdownMenuSubContent,
  t6 as DropdownMenuSubTrigger,
  n6 as DropdownMenuTrigger,
  Z8 as EditableCell,
  Be as FOCUS_RING,
  j8 as FOCUS_RING_SOFT,
  xn as FOCUS_RING_WITHIN,
  ho as FORM_MEASURE,
  We as FormFieldControl,
  nS as HeatmapChart,
  xl as ICON_ALIASES,
  $t as ICON_PATHS,
  He as INPUT_COPY,
  ii as INPUT_PLACEHOLDER,
  ri as INPUT_TEXT,
  gu as IconCell,
  ku as ImageCell,
  _S as InfoNode,
  Q8 as InlineRecordActions,
  fm as JPEG_IMAGE_ERROR,
  G8 as KeyValueCell,
  z6 as Label,
  Q1 as LineChart,
  e2 as LineItems,
  P8 as MODAL_PANEL,
  L8 as MODAL_PANEL_FORM,
  Ct as MODAL_WIDTH,
  F8 as MUTED_COPY,
  kt as MUTED_COPY_SNUG,
  N8 as MUTED_COPY_XS,
  zt as MiniStatCard,
  m6 as NavigationMenu,
  p6 as NavigationMenuContent,
  v6 as NavigationMenuIndicator,
  g6 as NavigationMenuItem,
  h6 as NavigationMenuLink,
  b6 as NavigationMenuList,
  y6 as NavigationMenuTrigger,
  Im as NavigationMenuViewport,
  cm as OPAQUE_IMAGE_ERROR,
  Un as OVERLAY_FORM_MEASURE,
  lt as PAGE_SHELL,
  z8 as PAGE_SHELL_COMPACT,
  _8 as PAGE_SHELL_STACK,
  PS as PaymentGatewaySettings,
  i4 as PaymentGateways,
  Y6 as PieChart,
  dC as PkAlertError,
  i5 as PkArticles,
  TS as PkAuroraBackdrop,
  Ie as PkBadge,
  ag as PkBarcode,
  g5 as PkBento,
  lC as PkBottomNav,
  I6 as PkBoundary,
  q6 as PkBuilder,
  ce as PkButton,
  K6 as PkCalendar,
  E6 as PkCard,
  kv as PkCheckboxList,
  ia as PkCodeBox,
  lv as PkCodeInput,
  Fv as PkColourPicker,
  ES as PkConsoleBackdrop,
  B5 as PkContact,
  I3 as PkCountUp,
  L5 as PkCta,
  R6 as PkDeviceFrame,
  sg as PkDiff,
  c1 as PkDocument,
  qe as PkDropdown,
  IS as PkEditorialBackdrop,
  Ut as PkEmptyState,
  T5 as PkFaq,
  R5 as PkFeatureGrid,
  _e as PkFieldLabel,
  qn as PkFileUpload,
  Ee as PkHeading,
  J5 as PkHero,
  Ei as PkKeyValue,
  DS as PkLandingSections,
  e3 as PkLogoCloud,
  Rv as PkMap,
  qv as PkMapField,
  Yp as PkMarkdownInput,
  o3 as PkMarquee,
  mt as PkModal,
  on as PkMultiSelect,
  rC as PkOtpInput,
  iC as PkPageHeader,
  wS as PkPasskeyRegister,
  uC as PkPasswordInput,
  $3 as PkPricing,
  Jv as PkQrCode,
  U0 as PkQtyStepper,
  Ms as PkQueryBuilder,
  bv as PkRadioGroup,
  H6 as PkRepeater,
  Q4 as PkReveal,
  Zi as PkRichEditor,
  Se as PkSection,
  je as PkSectionHeading,
  U6 as PkSetupWizardCompletion,
  T3 as PkShowcase,
  Vk as PkSignaturePad,
  Pe as PkSkeleton,
  Pt as PkSlideover,
  yg as PkSlider,
  sC as PkSpinner,
  U3 as PkStats,
  $e as PkStatusBadge,
  ei as PkStepIndicator,
  Z3 as PkSteps,
  FS as PkStudioBackdrop,
  oC as PkSubNav,
  jg as PkSwatchPreview,
  Av as PkTagsInput,
  l8 as PkTeam,
  v8 as PkTestimonials,
  we as PkTextInput,
  c5 as PkTiltCard,
  Kn as PkToggleButtons,
  Lg as PkVisualSelect,
  Cx as PlanCard,
  rS as PlanEditor,
  sS as PlanGrid,
  iS as PlanPurchaseCard,
  eS as PolarAreaChart,
  X6 as RadarChart,
  H8 as RatingCell,
  pc as RecordActions,
  CS as RecordForm,
  U8 as RelationCreateDialog,
  D8 as RelationPanel,
  bo as SLIDEOVER_BODY,
  yo as SLIDEOVER_WIDTH,
  Ay as STATUS_TONES,
  $S as SavedViews,
  Q6 as ScatterChart,
  Gn as SchemaNode,
  lS as SegmentedBar,
  yS as SelectionBar,
  Om as Separator,
  bS as SetupChecklist,
  na as ShadcnInput,
  sn as Sheet,
  gC as SheetClose,
  rn as SheetContent,
  bm as SheetDescription,
  hC as SheetFooter,
  ym as SheetHeader,
  xm as SheetTitle,
  bC as SheetTrigger,
  ey as ShortcutsWidget,
  yC as Sidebar,
  xC as SidebarContent,
  kC as SidebarFooter,
  $C as SidebarGroup,
  wC as SidebarGroupAction,
  CC as SidebarGroupContent,
  SC as SidebarGroupLabel,
  MC as SidebarHeader,
  BC as SidebarInput,
  AC as SidebarInset,
  zC as SidebarMenu,
  _C as SidebarMenuAction,
  PC as SidebarMenuBadge,
  OC as SidebarMenuButton,
  jC as SidebarMenuItem,
  VC as SidebarMenuSkeleton,
  DC as SidebarMenuSub,
  TC as SidebarMenuSubButton,
  IC as SidebarMenuSubItem,
  EC as SidebarProvider,
  FC as SidebarRail,
  NC as SidebarSeparator,
  RC as SidebarTrigger,
  pS as SignatureStudio,
  Ot as Sparkline,
  _6 as Spinner,
  aS as StatCard,
  oS as StatListChart,
  hS as StatStrip,
  Je as Switch,
  la as TRANSPARENT_IMAGE_HELP,
  xS as TablePagination,
  ts as TableShell,
  kS as TableTabs,
  Lr as TableToolbar,
  W8 as TagsCell,
  Z6 as ThemeToggle,
  _m as Tooltip,
  Pm as TooltipContent,
  LC as TooltipProvider,
  Lm as TooltipTrigger,
  da as TrendBadge,
  SS as UnsavedBar,
  Yu as actionColorTone,
  lm as alertVariants,
  Vc as appearancePayload,
  Yn as appearanceVars,
  Wt as applyAppearance,
  hm as assertTransparentImage,
  eC as bootstrapAppearance,
  Ye as buttonClasses,
  _t as catalogFiltersActive,
  oe as cn,
  si as createOptionActionLabel,
  oi as createOptionTitle,
  Qy as cycleLabel,
  Fe as emptyCatalogFilters,
  Mw as entryView,
  ai as fieldControl,
  R8 as fieldErrorsFromPayload,
  w2 as findExactSku,
  Xy as formatPerkValue,
  Nu as hasBadgeValue,
  AS as hasEntryView,
  T8 as hasFieldControl,
  G6 as hasOptionPreview,
  me as iconPath,
  vm as imageHasTransparency,
  Qn as initializeAppearance,
  cn as isDark,
  pn as matchCatalogItem,
  pC as mergeLayoutItems,
  Em as navigationMenuTriggerStyle,
  xg as optionPreview,
  fC as packWidgetColumns,
  mC as parseWidgetId,
  ex as perkGranted,
  fn as readAppearance,
  Dc as readServerAppearance,
  Y4 as registerBuiltInFieldControls,
  BS as registerEntryView,
  xe as registerFieldControl,
  It as registerOptionPreview,
  Bw as registeredEntryViews,
  I8 as registeredFieldTypes,
  kg as registeredOptionPreviews,
  X8 as resetAppearanceBootstrapForTests,
  zS as resetEntryViews,
  E8 as resetFieldControls,
  W6 as resetOptionPreviews,
  Te as resolveActionIcon,
  nC as setAppearancePersister,
  jm as sidebarMenuButtonVariants,
  Ly as statusBadgeVariant,
  Py as statusTone,
  tC as syncAppearanceFromInertiaPage,
  vC as toPersistedLayout,
  V8 as toUrl,
  ta as useAppearance,
  LS as useColumnVisibility,
  OS as useColumnWidths,
  jS as useLiveUpdates,
  d5 as usePointer,
  ca as useReveal,
  J8 as useSchemaColumns,
  w3 as useScrollProgress,
  F6 as useShellPageFooter,
  Lt as useSidebar,
  VS as useTenantTheme,
  MS as useUnsavedChanges,
  NS as version,
  Cn as widgetId
};
//# sourceMappingURL=index.js.map

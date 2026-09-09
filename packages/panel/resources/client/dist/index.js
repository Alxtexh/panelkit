import './ui.css';
import { defineComponent as L, useSlots as Yt, openBlock as t, createElementBlock as n, normalizeClass as z, unref as x, renderSlot as q, createElementVNode as l, toDisplayString as c, createCommentVNode as b, computed as y, normalizeStyle as ie, Fragment as _, renderList as j, ref as K, watch as pe, useId as Xe, withModifiers as ge, createTextVNode as U, createVNode as I, createStaticVNode as ut, createBlock as T, createSlots as ct, withCtx as O, nextTick as De, onBeforeUnmount as ke, Teleport as pt, Transition as et, onMounted as be, withDirectives as he, vModelText as ze, mergeProps as de, normalizeProps as Le, guardReactiveProps as Re, resolveDynamicComponent as Ce, resolveComponent as Qt, vModelSelect as Ze, vModelDynamic as va, defineAsyncComponent as hn, inject as wt, vShow as qe, withKeys as Ct, onUnmounted as ga, isRef as ha, useTemplateRef as ba, onErrorCaptured as ya, provide as Nt, reactive as ft, useModel as vt, mergeModels as Ne, markRaw as xa, shallowRef as ka, getCurrentInstance as On, watchEffect as $a } from "vue";
import { router as wa, usePage as Xt, Link as Rt } from "@inertiajs/vue3";
import { useForwardPropsEmits as ye, DialogRoot as jn, DialogOverlay as en, DialogPortal as tn, DialogContent as nn, DialogClose as tt, CheckboxRoot as Ca, CheckboxIndicator as Sa, SwitchRoot as Ma, SwitchThumb as Ba, DialogDescription as Vn, DialogTitle as Dn, DialogTrigger as Tn, createContext as Aa, Primitive as nt, TooltipRoot as za, TooltipPortal as _a, TooltipContent as Pa, TooltipArrow as La, TooltipProvider as In, TooltipTrigger as Oa, Separator as ja, DropdownMenuRoot as Va, DropdownMenuCheckboxItem as Da, DropdownMenuItemIndicator as En, DropdownMenuPortal as Ta, DropdownMenuContent as Ia, DropdownMenuGroup as Ea, useForwardProps as Oe, DropdownMenuItem as Fa, DropdownMenuLabel as Na, DropdownMenuRadioGroup as Ra, DropdownMenuRadioItem as Ua, DropdownMenuSeparator as Ha, DropdownMenuSub as Ka, DropdownMenuSubContent as qa, DropdownMenuSubTrigger as Ga, DropdownMenuTrigger as Wa, AvatarRoot as Za, AvatarFallback as Ja, AvatarImage as Ya, NavigationMenuViewport as Qa, NavigationMenuRoot as Xa, NavigationMenuContent as el, NavigationMenuIndicator as tl, NavigationMenuItem as nl, NavigationMenuLink as al, NavigationMenuList as ll, NavigationMenuTrigger as ol, Label as sl } from "reka-ui";
import { DropdownMenuPortal as US } from "reka-ui";
import { X as an, Check as Fn, AlertCircle as rl, EyeOff as il, Eye as dl, PanelLeftOpen as ul, PanelLeftClose as cl, Circle as fl, ChevronRight as Nn, MoreHorizontal as ml, ChevronDown as pl, Loader2Icon as vl } from "@lucide/vue";
import { reactiveOmit as ve, useVModel as Rn, useMediaQuery as gl, useEventListener as hl, defaultDocument as bl } from "@vueuse/core";
import { clsx as yl } from "clsx";
import { twMerge as xl } from "tailwind-merge";
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
}, kl = {
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
  const o = kl[e] ?? e;
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
  const a = $l(e.label);
  if (a)
    return me(a);
  if (e.destructive)
    return me("trash");
  const r = e.color ?? "";
  return r && yn[r] ? me(yn[r]) : me("circle");
}
function $l(e) {
  if (!e)
    return null;
  const o = e.toLowerCase();
  return /\b(delete|remove|destroy|trash)\b/.test(o) ? "trash" : /\b(log\s*in|impersonat|sign\s*in\s+as)\b/.test(o) ? "log-in" : /\b(recharge|credit|wallet|top\s*up|topup)\b/.test(o) ? "coins" : /\b(edit|update)\b/.test(o) ? "pencil" : /\b(view|open|show)\b/.test(o) ? "eye" : /\b(restore|undo)\b/.test(o) ? "undo" : /\b(copy|replicate|duplicate)\b/.test(o) ? "copy" : /\b(export|download)\b/.test(o) ? "download" : /\b(suspend|ban|block)\b/.test(o) ? "ban" : /\b(activate|resume|enable)\b/.test(o) ? "play" : null;
}
const wl = {
  key: 0,
  class: "flex max-w-xs items-center justify-center",
  "aria-hidden": "true"
}, Cl = ["d"], Sl = { class: "flex max-w-sm flex-col gap-1" }, Ml = {
  key: 0,
  class: "text-sm font-normal"
}, Bl = {
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
      x(o).illustration ? (t(), n("div", wl, [
        q(a.$slots, "illustration")
      ])) : (t(), n("div", {
        key: 1,
        class: z(["bg-muted text-muted-foreground flex items-center justify-center rounded-full", e.compact ? "size-10" : "size-12"]),
        "aria-hidden": "true"
      }, [
        q(a.$slots, "icon", {}, () => [
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
            }, null, 8, Cl)
          ], 2))
        ])
      ], 2)),
      l("div", Sl, [
        l("p", {
          class: z(["text-foreground font-medium", e.compact ? "text-sm" : "text-base"])
        }, c(e.title), 3),
        e.description ? (t(), n("p", Ml, c(e.description), 1)) : b("", !0)
      ]),
      a.$slots.actions ? (t(), n("div", Bl, [
        q(a.$slots, "actions")
      ])) : b("", !0)
    ], 2));
  }
}), Al = ["aria-label"], Pe = /* @__PURE__ */ L({
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
      (t(!0), n(_, null, j(s.value, (f) => (t(), n("span", {
        key: f,
        "aria-hidden": "true",
        class: z(["bg-muted motion-safe:animate-pulse rounded", r.value]),
        style: ie({
          width: i(f - 1),
          height: e.height && e.variant === "block" ? `${e.height}px` : void 0
        })
      }, null, 6))), 128))
    ], 12, Al));
  }
}), zl = { class: "w-max min-w-full border-collapse text-sm" }, _l = { class: "bg-background sticky top-0 z-10" }, Pl = {
  key: 0,
  class: "bg-muted/40"
}, Ll = {
  key: 0,
  class: "w-8 border-b px-2 py-1.5"
}, Ol = {
  key: 1,
  class: "w-10 border-b px-3 py-1.5"
}, jl = ["colspan"], Vl = {
  key: 2,
  class: "pk-actions bg-muted/40 sticky right-0 w-12 border-b border-l px-2 py-1.5 shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, Dl = { class: "bg-muted/50" }, Tl = {
  key: 0,
  class: "w-8 border-b px-2 py-2.5"
}, Il = ["id", "checked", "indeterminate"], El = ["onClick"], Fl = {
  key: 0,
  class: "text-xs"
}, Nl = {
  key: 1,
  class: "text-xs opacity-40"
}, Rl = { key: 1 }, Ul = ["aria-label", "onPointerdown"], Hl = {
  key: 2,
  class: "pk-actions bg-muted/50 sticky right-0 w-12 border-b border-l px-2 py-2.5 shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, Kl = {
  key: 0,
  "data-slot": "table-skeleton",
  class: "transition-opacity"
}, ql = {
  key: 0,
  class: "w-8 px-2 py-2.5"
}, Gl = {
  key: 1,
  class: "px-3 py-2.5"
}, Wl = {
  key: 2,
  class: "px-2 py-2.5"
}, Zl = {
  key: 0,
  class: "bg-muted/40"
}, Jl = ["colspan"], Yl = ["aria-expanded", "dusk", "onClick"], Ql = {
  class: "text-[9px]",
  "aria-hidden": "true"
}, Xl = {
  key: 1,
  dusk: "group-header"
}, eo = ["draggable", "onDragstart", "onDragover", "onDrop", "onContextmenu", "onClick"], to = {
  key: 0,
  class: "w-8 px-2 py-2 align-middle"
}, no = ["id", "value", "checked", "disabled", "aria-label", "onClick"], ao = {
  key: 0,
  class: "inline-flex items-center gap-1.5"
}, lo = ["aria-label", "onClick"], oo = { class: "text-xs" }, so = {
  key: 1,
  class: "text-muted-foreground"
}, ro = { key: 2 }, io = {
  key: 2,
  class: "pk-actions bg-background group-hover:bg-muted/40 sticky right-0 border-l px-2 py-2 text-right shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, uo = {
  key: 2,
  class: "bg-muted/40 border-t-2"
}, co = { key: 0 }, fo = { class: "text-muted-foreground block text-[10px] font-medium" }, mo = { class: "font-semibold tabular-nums" }, po = { key: 1 }, vo = 40, go = /* @__PURE__ */ L({
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
    const d = K(/* @__PURE__ */ new Set()), u = K(/* @__PURE__ */ new Set());
    function f(ee) {
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
      return a.groupBy?.collapsible ? !f(r(a.rows[ee])) : !0;
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
    const h = K(null), M = K(null);
    function $(ee, re) {
      h.value = ee, re.dataTransfer?.setData("text/plain", String(ee)), re.dataTransfer && (re.dataTransfer.effectAllowed = "move");
    }
    function C() {
      h.value = null, M.value = null;
    }
    function k(ee) {
      return h.value === null || M.value !== ee ? "" : h.value > ee ? "border-primary border-t-2" : "border-primary border-b-2";
    }
    function A(ee, re) {
      h.value !== null && (re.preventDefault(), M.value = ee);
    }
    function B(ee) {
      const re = h.value;
      if (h.value = null, M.value = null, re === null || re === ee)
        return;
      const ae = a.rows.map((ue) => ue[a.rowKey]), [fe] = ae.splice(re, 1);
      ae.splice(ee, 0, fe), w("reorder", ae);
    }
    const w = o;
    function p(ee, re) {
      !a.rowClickable || a.reordering || re.button !== 0 || re.metaKey || re.ctrlKey || re.shiftKey || re.altKey || re.target?.closest('a, button, input, select, textarea, label, [role="menuitem"]') || (window.getSelection()?.toString().length ?? 0) > 0 || w("row-click", ee);
    }
    const g = K(null), S = Xe(), F = y(() => a.columns.filter((ee) => !a.hidden?.has(ee.key))), D = y(() => {
      const ee = F.value.find((re) => re.sticky);
      return ee ? ee.key : a.stickyFirst && F.value.length > 0 ? F.value[0].key : null;
    });
    function Y(ee) {
      return D.value === ee.key;
    }
    function G() {
      return a.selectable && !a.reordering ? `${vo}px` : "0";
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
        const Vt = fe + (st.clientX - ae);
        w("resize", ee.key, Math.min(1200, Math.max(48, Vt)));
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
    const V = K(null);
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
          const st = Math.min(Ge, Ue), Vt = Math.max(Ge, Ue), pa = !ue;
          for (let xt = st; xt <= Vt; xt++) {
            if (!m(xt))
              continue;
            const Dt = P(a.rows[xt]);
            if (Dt === null)
              continue;
            !!a.selected?.has(Dt) !== pa && w("toggle-row", Dt);
          }
          V.value = ae;
          return;
        }
      }
      w("toggle-row", ae), V.value = ae;
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
      l("table", zl, [
        l("thead", _l, [
          R.value ? (t(), n("tr", Pl, [
            e.reordering ? (t(), n("th", Ll)) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("th", Ol)) : b("", !0),
            (t(!0), n(_, null, j(X.value, (ae) => (t(), n("th", {
              key: ae.key,
              colspan: ae.span,
              class: "text-muted-foreground border-b px-3 py-1.5 text-left text-xs font-medium"
            }, c(ae.label ?? ""), 9, jl))), 128)),
            ee.$slots.actions ? (t(), n("th", Vl)) : b("", !0)
          ])) : b("", !0),
          l("tr", Dl, [
            e.reordering ? (t(), n("th", Tl)) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("th", {
              key: 1,
              class: z(["w-10 border-b px-3 py-2.5", D.value ? "bg-muted/50 sticky left-0 z-[11]" : ""])
            }, [
              l("input", {
                id: `${x(S)}-page`,
                type: "checkbox",
                class: "accent-primary size-3.5 cursor-pointer align-middle",
                checked: Q.value,
                indeterminate: ne.value,
                "aria-label": "Select all rows on this page",
                onClick: re[0] || (re[0] = ge(() => {
                }, ["stop"])),
                onChange: re[1] || (re[1] = ge((ae) => w("toggle-page", !Q.value), ["stop"]))
              }, null, 40, Il)
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
                onClick: (fe) => w("sort", se(ae))
              }, [
                U(c(ae.label) + " ", 1),
                Me(ae) ? (t(), n("span", Fl, c(e.direction === "desc" ? "↓" : "↑"), 1)) : (t(), n("span", Nl, "↕"))
              ], 8, El)) : (t(), n("span", Rl, c(ae.label), 1)),
              H(ae) ? (t(), n("span", {
                key: 2,
                class: "hover:bg-primary/40 absolute top-0 right-0 z-[12] h-full w-1.5 cursor-col-resize",
                role: "separator",
                "aria-orientation": "vertical",
                "aria-label": `Resize ${ae.label}`,
                onPointerdown: (fe) => N(ae, fe)
              }, null, 40, Ul)) : b("", !0)
            ], 6))), 128)),
            ee.$slots.actions ? (t(), n("th", Hl, [...re[2] || (re[2] = [
              l("span", { class: "sr-only" }, "Actions", -1)
            ])])) : b("", !0)
          ])
        ]),
        e.loading && e.rows.length === 0 ? (t(), n("tbody", Kl, [
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
            e.selectable && !e.reordering ? (t(), n("td", Gl, [
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
            ee.$slots.actions ? (t(), n("td", Wl, [
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
            e.groupBy && s(fe) ? (t(), n("tr", Zl, [
              l("td", {
                colspan: e.columns.length + (e.selectable ? 1 : 0) + (e.reordering ? 1 : 0) + 1,
                class: "text-muted-foreground px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase"
              }, [
                e.groupBy.collapsible ? (t(), n("button", {
                  key: 0,
                  type: "button",
                  class: "hover:text-foreground inline-flex items-center gap-1.5",
                  "aria-expanded": !f(r(ae)),
                  dusk: `group-header-${r(ae) || "none"}`,
                  onClick: (ue) => v(r(ae))
                }, [
                  l("span", Ql, c(f(r(ae)) ? "▸" : "▾"), 1),
                  U(" " + c(i(ae)), 1)
                ], 8, Yl)) : (t(), n("span", Xl, c(i(ae)), 1))
              ], 8, Jl)
            ])) : b("", !0),
            m(fe) ? (t(), n("tr", {
              key: 1,
              "data-slot": "table-row",
              class: z(["group pk-row border-b transition-colors hover:bg-muted/50", [
                J(ae) ? "bg-primary/5 shadow-[inset_3px_0_0_0_var(--color-primary)]" : e.striped && fe % 2 === 1 ? "bg-muted/20" : "",
                h.value === fe ? "opacity-40" : "",
                k(fe),
                e.reordering ? "cursor-grab active:cursor-grabbing" : "",
                e.rowClickable && !e.reordering ? "cursor-pointer" : ""
              ]]),
              draggable: e.reordering,
              onDragstart: (ue) => $(fe, ue),
              onDragover: (ue) => A(fe, ue),
              onDrop: ge((ue) => B(fe), ["prevent"]),
              onDragend: C,
              onContextmenu: (ue) => w("row-contextmenu", ae, ue),
              onClick: (ue) => p(ae, ue)
            }, [
              e.reordering ? (t(), n("td", to, [...re[3] || (re[3] = [
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
                  id: `${x(S)}-row-${P(ae) ?? fe}`,
                  type: "checkbox",
                  class: "accent-primary size-3.5 cursor-pointer align-middle",
                  value: P(ae) ?? void 0,
                  checked: J(ae),
                  disabled: P(ae) === null,
                  "aria-label": P(ae) === null ? "This row has no id and cannot be selected" : `Select row ${P(ae)}`,
                  onClick: ge((ue) => te(ae, ue), ["stop"])
                }, null, 8, no)
              ], 2)) : b("", !0),
              (t(!0), n(_, null, j(F.value, (ue) => (t(), n("td", {
                key: ue.key,
                class: z(["px-3 py-2 whitespace-nowrap", [
                  ue.cellClass,
                  Y(ue) ? "bg-background sticky z-[1] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)] group-hover:bg-muted/50" : ""
                ]]),
                style: ie(W(ue))
              }, [
                q(ee.$slots, `cell:${ue.key}`, {
                  row: ae,
                  value: ae[ue.key],
                  column: ue
                }, () => [
                  ue.copyable ? (t(), n("span", ao, [
                    U(c(ae[ue.key]) + " ", 1),
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100",
                      "aria-label": `Copy ${ue.label.toLowerCase()}`,
                      onClick: (Ge) => vn(String(ae[e.rowKey]), ue, ae[ue.key])
                    }, [
                      l("span", oo, c(g.value === `${ae[e.rowKey]}-${ue.key}` ? "✓" : "⧉"), 1)
                    ], 8, lo)
                  ])) : ae[ue.key] == null || ae[ue.key] === "" ? (t(), n("span", so, "None")) : (t(), n("span", ro, c(ae[ue.key]), 1))
                ], !0)
              ], 6))), 128)),
              ee.$slots.actions ? (t(), n("td", io, [
                q(ee.$slots, "actions", { row: ae }, void 0, !0)
              ])) : b("", !0)
            ], 42, eo)) : b("", !0)
          ], 64))), 128))
        ], 2)),
        fa.value ? (t(), n("tfoot", uo, [
          l("tr", null, [
            e.selectable ? (t(), n("td", co)) : b("", !0),
            (t(!0), n(_, null, j(e.columns, (ae) => (t(), n(_, {
              key: `s-${ae.key}`
            }, [
              e.hidden?.has(ae.key) ? b("", !0) : (t(), n("td", {
                key: 0,
                class: z(["px-3 py-2 align-top text-sm whitespace-nowrap", ae.cellClass])
              }, [
                gn(ae.key) ? (t(), n(_, { key: 0 }, [
                  l("span", fo, c(gn(ae.key).label), 1),
                  l("span", mo, c(ma(ae.key)), 1)
                ], 64)) : b("", !0)
              ], 2))
            ], 64))), 128)),
            ee.$slots.actions ? (t(), n("td", po)) : b("", !0)
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
            q(ee.$slots, "clear-filters", {}, void 0, !0)
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
            q(ee.$slots, "empty-actions", {}, void 0, !0)
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
}, ho = /* @__PURE__ */ at(go, [["__scopeId", "data-v-33b13e51"]]), lt = "w-full min-w-0 px-4 py-6 sm:px-6", A8 = "w-full min-w-0 p-3 sm:p-4", z8 = "w-full min-w-0 space-y-6 px-4 py-6 sm:px-6", bo = "w-full max-w-7xl", yo = "px-4 py-4", Un = "w-full min-w-0", xo = {
  /** Filters, short lists (~24rem). */
  sm: "w-full max-w-sm",
  /** Notifications, inspect (~28rem). */
  md: "w-full max-w-md",
  /** Secondary action forms (~36rem). */
  lg: "w-full max-w-xl",
  /** Opt-in CRUD slide-over (~42rem). */
  xl: "w-full max-w-2xl"
}, rt = "bg-popover text-popover-foreground flex w-full max-h-[min(85vh,720px)] flex-col overflow-hidden rounded-xl border shadow-2xl", St = {
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
}, _8 = St.confirm, P8 = St.form, dt = /* @__PURE__ */ new Set();
let Ht = "";
function Hn(e) {
  typeof document > "u" || dt.has(e) || (dt.size === 0 && (Ht = document.body.style.overflow), dt.add(e), document.body.style.overflow = "hidden");
}
function Mt(e) {
  return typeof document > "u" || !dt.delete(e) ? !1 : dt.size === 0 ? (document.body.style.overflow = Ht, Ht = "", !0) : !1;
}
const ko = ["aria-busy", "aria-describedby"], $o = { class: "bg-popover sticky top-0 z-10 shrink-0 border-b px-6 py-5" }, wo = {
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
    const a = e, r = o, s = K(null), i = `pk-modal-title-${Xe()}`, d = `pk-modal-description-${Xe()}`, u = /* @__PURE__ */ Symbol("pk-modal");
    let f = null, v = !1;
    const m = K(!1), h = y(() => St[a.size] ?? St.confirm);
    function M(k) {
      m.value = k.target === k.currentTarget;
    }
    function $(k) {
      m.value && k.target === k.currentTarget && !a.busy && r("close"), m.value = !1;
    }
    function C(k) {
      if (!a.open)
        return;
      if (k.key === "Escape" && !a.busy) {
        k.stopPropagation(), r("close");
        return;
      }
      if (k.key !== "Tab" || !s.value)
        return;
      const A = s.value.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (A.length === 0)
        return;
      const B = A[0], w = A[A.length - 1];
      k.shiftKey && document.activeElement === B ? (k.preventDefault(), w.focus()) : !k.shiftKey && document.activeElement === w && (k.preventDefault(), B.focus());
    }
    return pe(
      () => a.open,
      (k) => {
        if (k)
          f = document.activeElement, Hn(u), v = !0, document.addEventListener("keydown", C), De(
            () => s.value?.querySelector("input, select, textarea, button")?.focus()
          );
        else if (v) {
          const A = Mt(u);
          v = !1, document.removeEventListener("keydown", C), A && f?.focus(), f = null;
        }
      },
      { immediate: !0 }
    ), ke(() => {
      document.removeEventListener("keydown", C), v && (Mt(u), v = !1);
    }), (k, A) => (t(), T(pt, { to: "body" }, [
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
            onPointerdown: M,
            onPointerup: $
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
              l("div", $o, [
                l("h2", {
                  id: i,
                  class: "text-lg font-semibold tracking-tight"
                }, c(e.title), 1),
                e.description ? (t(), n("p", {
                  key: 0,
                  id: d,
                  class: "text-muted-foreground mt-1 text-sm leading-5"
                }, c(e.description), 1)) : b("", !0)
              ]),
              l("div", {
                class: z([
                  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5",
                  x(Un)
                ])
              }, [
                q(k.$slots, "default")
              ], 2),
              k.$slots.footer ? (t(), n("div", wo, [
                q(k.$slots, "footer")
              ])) : b("", !0)
            ], 10, ko)
          ], 32)) : b("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), Co = 160, Ke = /* @__PURE__ */ L({
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
    const a = e, r = K(!1), s = K(null), i = K(null), d = K({ top: 0, left: 0, minWidth: 0 }), u = K(null);
    let f = null;
    function v(p) {
      !a.dismissOnPanelClick || p.target?.closest("input, select, textarea, label, [data-keep-open]") || C();
    }
    async function m() {
      f && (clearTimeout(f), f = null), !r.value && (r.value = !0, await De(), k());
    }
    function h() {
      f = setTimeout(C, 180);
    }
    async function M() {
      u.value = null, r.value = !r.value, r.value && (await De(), k());
    }
    async function $(p, g) {
      u.value = { x: p, y: g }, r.value = !0, await De(), k();
    }
    function C() {
      r.value = !1, u.value = null;
    }
    function k() {
      const p = s.value, g = i.value;
      if (!p || !g)
        return;
      const S = g.getBoundingClientRect(), F = 8, D = u.value ? new DOMRect(u.value.x, u.value.y, 0, 0) : p.getBoundingClientRect();
      let Y, G;
      if (a.placement === "bottom")
        Y = D.bottom + a.offset, Y + S.height > window.innerHeight - F && D.top - S.height - a.offset > F && (Y = D.top - S.height - a.offset), G = a.align === "end" && !u.value ? D.right - S.width : D.left;
      else {
        Y = D.top;
        const Z = a.placement === "right", W = D.right + a.offset + S.width < window.innerWidth - F, H = D.left - a.offset - S.width > F;
        G = (Z ? W || !H : !H && W) ? D.right + a.offset : D.left - a.offset - S.width;
      }
      G = Math.min(Math.max(F, G), window.innerWidth - S.width - F), Y = Math.min(Math.max(F, Y), window.innerHeight - S.height - F), d.value = { top: Y, left: G, minWidth: Math.max(D.width, Co) };
    }
    function A(p) {
      if (!r.value)
        return;
      const g = p.target;
      s.value?.contains(g) || i.value?.contains(g) || (g instanceof Element ? g : g.parentElement)?.closest("[data-pk-overlay]") || C();
    }
    function B(p) {
      p.key === "Escape" && r.value && (p.stopPropagation(), C());
    }
    function w() {
      if (r.value) {
        if (u.value) {
          C();
          return;
        }
        k();
      }
    }
    return be(() => {
      document.addEventListener("pointerdown", A), document.addEventListener("keydown", B), window.addEventListener("scroll", w, !0), window.addEventListener("resize", w);
    }), ke(() => {
      f && clearTimeout(f), document.removeEventListener("pointerdown", A), document.removeEventListener("keydown", B), window.removeEventListener("scroll", w, !0), window.removeEventListener("resize", w);
    }), o({ close: C, openAt: $ }), (p, g) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "relative",
      onPointerenter: g[3] || (g[3] = (S) => e.hoverable && m()),
      onPointerleave: g[4] || (g[4] = (S) => e.hoverable && h())
    }, [
      l("div", {
        onClick: g[0] || (g[0] = (S) => e.hoverable ? m() : M())
      }, [
        q(p.$slots, "trigger", { open: r.value })
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
              onPointerenter: g[1] || (g[1] = (S) => e.hoverable && m()),
              onPointerleave: g[2] || (g[2] = (S) => e.hoverable && h()),
              onClick: v
            }, [
              q(p.$slots, "panel", { close: C })
            ], 38)) : b("", !0)
          ]),
          _: 3
        })
      ]))
    ], 544));
  }
}), So = ["disabled", "aria-label", "aria-busy"], Mo = {
  key: 0,
  class: "size-4 animate-spin",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, Bo = {
  key: 1,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Ao = {
  key: 2,
  class: "bg-primary-foreground/15 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums"
}, zo = {
  key: 3,
  class: "size-4 opacity-80",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, _o = { class: "min-w-[14rem] p-1.5" }, Po = {
  key: 0,
  class: "text-muted-foreground px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
}, Lo = ["disabled", "onClick"], Oo = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, jo = ["d"], Vo = { class: "min-w-0 flex-1 truncate" }, Do = ["disabled"], To = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Io = ["d"], Eo = {
  key: 2,
  class: "mt-1 border-t px-0 pt-1"
}, Fo = ["disabled", "onClick"], No = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Ro = ["d"], Uo = { class: "min-w-0 flex-1 truncate" }, Ho = { class: "text-muted-foreground text-sm font-normal" }, Ko = { class: "text-foreground font-medium tabular-nums" }, qo = {
  key: 0,
  class: "text-destructive mt-1 text-xs"
}, Go = ["disabled"], Wo = { class: "text-muted-foreground text-sm font-normal" }, Zo = { class: "text-foreground font-medium tabular-nums" }, Jo = {
  key: 0,
  class: "text-destructive mt-1 text-xs"
}, Yo = ["disabled"], L8 = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(null), i = K(!1), d = y(() => a.allMatching ? a.total : a.count), u = y(() => d.value !== void 0), f = y(() => u.value && d.value === 0), v = y(() => a.actions.filter((w) => !w.destructive)), m = y(() => a.actions.filter((w) => w.destructive)), h = y(
      () => v.value.length + m.value.length + (a.canExport ? 1 : 0)
    ), M = {
      primary: "text-primary",
      gray: "text-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-500",
      danger: "text-destructive",
      info: "text-sky-600 dark:text-sky-400"
    };
    function $(w) {
      return M[w.color ?? "gray"] ?? M.gray;
    }
    function C(w) {
      if (w.confirmation) {
        s.value = w;
        return;
      }
      r("run", w.key);
    }
    function k() {
      s.value && r("run", s.value.key), s.value = null;
    }
    function A() {
      i.value = !1, r("export");
    }
    const B = (w) => new Intl.NumberFormat().format(w);
    return (w, p) => (t(), n(_, null, [
      I(Ke, null, {
        trigger: O(() => [
          l("button", {
            type: "button",
            class: "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-60",
            disabled: e.busy,
            "aria-haspopup": "menu",
            "aria-label": e.busy ? "Bulk actions are running" : "Open bulk actions",
            "aria-busy": e.busy
          }, [
            e.busy ? (t(), n("svg", Mo, [...p[5] || (p[5] = [
              l("path", { d: "M12 3a9 9 0 1 0 9 9" }, null, -1)
            ])])) : (t(), n("svg", Bo, [...p[6] || (p[6] = [
              l("path", { d: "M4 6h16M7 12h10M10 18h4" }, null, -1)
            ])])),
            l("span", null, c(e.busy ? "Working…" : "Bulk actions"), 1),
            !e.busy && h.value ? (t(), n("span", Ao, c(h.value), 1)) : b("", !0),
            e.busy ? b("", !0) : (t(), n("svg", zo, [...p[7] || (p[7] = [
              l("path", { d: "m6 9 6 6 6-6" }, null, -1)
            ])]))
          ], 8, So)
        ]),
        panel: O(() => [
          l("div", _o, [
            v.value.length || e.canExport ? (t(), n("div", Po, " Actions ")) : b("", !0),
            (t(!0), n(_, null, j(v.value, (g) => (t(), n("button", {
              key: g.key,
              type: "button",
              role: "menuitem",
              class: z(["hover:bg-accent focus:bg-accent flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50", $(g)]),
              disabled: e.busy,
              onClick: (S) => C(g)
            }, [
              (t(), n("svg", Oo, [
                l("path", {
                  d: x(Te)(g)
                }, null, 8, jo)
              ])),
              l("span", Vo, c(g.label), 1)
            ], 10, Lo))), 128)),
            e.canExport ? (t(), n("button", {
              key: 1,
              type: "button",
              role: "menuitem",
              class: "text-foreground hover:bg-accent focus:bg-accent flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              disabled: e.busy,
              onClick: p[0] || (p[0] = (g) => i.value = !0)
            }, [
              (t(), n("svg", To, [
                l("path", {
                  d: x(me)("download")
                }, null, 8, Io)
              ])),
              p[8] || (p[8] = U(" Export CSV ", -1))
            ], 8, Do)) : b("", !0),
            m.value.length ? (t(), n("div", Eo, [
              p[9] || (p[9] = l("div", { class: "text-destructive/80 px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em]" }, " Destructive ", -1)),
              (t(!0), n(_, null, j(m.value, (g) => (t(), n("button", {
                key: g.key,
                type: "button",
                role: "menuitem",
                class: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                disabled: e.busy,
                onClick: (S) => C(g)
              }, [
                (t(), n("svg", No, [
                  l("path", {
                    d: x(Te)({ ...g, destructive: !0 })
                  }, null, 8, Ro)
                ])),
                l("span", Uo, c(g.label), 1)
              ], 8, Fo))), 128))
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
            disabled: !u.value || f.value,
            onClick: k
          }, c(s.value?.label), 11, Go)
        ]),
        default: O(() => [
          l("p", Ho, [
            p[10] || (p[10] = U(" This will affect ", -1)),
            l("span", Ko, [
              u.value ? (t(), n(_, { key: 1 }, [
                U(c(B(d.value)) + " record" + c(d.value === 1 ? "" : "s"), 1)
              ], 64)) : (t(), n(_, { key: 0 }, [
                U("…")
              ], 64))
            ]),
            p[11] || (p[11] = U(" . ", -1))
          ]),
          f.value ? (t(), n("p", qo, " Nothing matches the current filters - there is nothing to " + c(s.value?.label?.toLowerCase()) + ". ", 1)) : b("", !0)
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
            disabled: !u.value || f.value,
            onClick: A
          }, " Export CSV ", 8, Yo)
        ]),
        default: O(() => [
          l("p", Wo, [
            p[12] || (p[12] = U(" This will export ", -1)),
            l("span", Zo, [
              u.value ? (t(), n(_, { key: 1 }, [
                U(c(B(d.value)) + " record" + c(d.value === 1 ? "" : "s"), 1)
              ], 64)) : (t(), n(_, { key: 0 }, [
                U("…")
              ], 64))
            ]),
            p[13] || (p[13] = U(". ", -1))
          ]),
          f.value ? (t(), n("p", Jo, " Nothing matches the current filters - there is nothing to export. ")) : b("", !0)
        ]),
        _: 1
      }, 8, ["open"])
    ], 64));
  }
}), Qo = { class: "pk-surface flex min-h-0 w-full min-w-0 shrink grow-0 flex-col overflow-hidden rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.04),0_14px_32px_-24px_rgb(0_0_0/0.28)]" }, Xo = {
  key: 0,
  class: "shrink-0 border-b px-3 py-2.5 sm:px-4"
}, es = {
  key: 1,
  class: "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4"
}, ts = {
  key: 3,
  class: "shrink-0 border-t px-3 py-2.5 sm:px-4"
}, ns = /* @__PURE__ */ L({
  __name: "TableShell",
  props: {
    toolbarTint: { default: "none" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", Qo, [
      o.$slots.tabs ? (t(), n("div", Xo, [
        q(o.$slots, "tabs")
      ])) : b("", !0),
      o.$slots.title ? (t(), n("div", es, [
        q(o.$slots, "title")
      ])) : b("", !0),
      o.$slots.toolbar ? (t(), n("div", {
        key: 2,
        class: z(["shrink-0 border-b px-3 py-2.5 sm:px-4", e.toolbarTint === "muted" ? "bg-muted/40" : ""])
      }, [
        q(o.$slots, "toolbar")
      ], 2)) : b("", !0),
      q(o.$slots, "default"),
      o.$slots.pagination ? (t(), n("div", ts, [
        q(o.$slots, "pagination")
      ])) : b("", !0)
    ]));
  }
}), Be = "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", xn = "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]", O8 = "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]", as = ["aria-expanded", "aria-activedescendant"], ls = ["aria-label", "onClick"], os = {
  key: 0,
  class: "text-muted-foreground flex-1 text-sm"
}, ss = { class: "ml-auto flex shrink-0 items-center gap-1" }, rs = {
  key: 0,
  class: "border-b p-1"
}, is = ["placeholder"], ds = { class: "max-h-60 overflow-y-auto p-1" }, us = ["id", "onMouseenter", "onClick"], cs = {
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
    const a = e, r = o, s = K(null), i = K(null), d = K(null), u = `pk-multi-select-${Xe()}`, f = K(!1), v = K(""), m = K(0), h = K({ top: 0, left: 0, width: 0 }), M = y(
      () => a.modelValue.map(
        (W) => a.options.find((H) => H.value === W) ?? {
          value: W,
          label: String(W)
        }
      ).filter(Boolean)
    ), $ = y(() => a.searchable ?? a.options.length > 6), C = y(() => {
      const W = new Set(a.modelValue), H = v.value.trim().toLowerCase();
      return a.options.filter((N) => !W.has(N.value)).filter((N) => H ? N.label.toLowerCase().includes(H) : !0);
    }), k = y(() => a.max !== null && a.modelValue.length >= a.max);
    function A() {
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
    async function B() {
      a.disabled || f.value || (f.value = !0, v.value = "", m.value = 0, await De(), A(), d.value?.focus());
    }
    function w() {
      f.value = !1, v.value = "";
    }
    function p() {
      f.value ? w() : B();
    }
    function g(W) {
      k.value || (r("update:modelValue", [...a.modelValue, W.value]), v.value = "", m.value = 0, De(() => {
        A(), d.value?.focus();
      }));
    }
    function S(W) {
      r(
        "update:modelValue",
        a.modelValue.filter((H) => H !== W)
      ), De(A);
    }
    function F() {
      r("update:modelValue", []), De(A);
    }
    function D(W) {
      if (!a.disabled) {
        if (W.key === "Escape" && f.value) {
          W.stopPropagation(), w();
          return;
        }
        if (W.key === "Backspace" && v.value === "" && a.modelValue.length > 0) {
          S(a.modelValue[a.modelValue.length - 1]);
          return;
        }
        if (!f.value && (W.key === "ArrowDown" || W.key === "Enter")) {
          W.preventDefault(), B();
          return;
        }
        if (f.value) {
          if (W.key === "ArrowDown")
            W.preventDefault(), m.value = Math.min(m.value + 1, C.value.length - 1);
          else if (W.key === "ArrowUp")
            W.preventDefault(), m.value = Math.max(m.value - 1, 0);
          else if (W.key === "Enter") {
            W.preventDefault();
            const H = C.value[m.value];
            H && g(H);
          }
        }
      }
    }
    function Y(W) {
      if (!f.value)
        return;
      const H = W.target;
      s.value?.contains(H) || i.value?.contains(H) || (H instanceof Element ? H : H.parentElement)?.closest("[data-pk-overlay]") || w();
    }
    function G(W) {
      return `${u}-option-${W}`;
    }
    function Z() {
      f.value && A();
    }
    return pe(C, (W) => {
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
          f.value ? "ring-ring border-ring ring-2" : "hover:border-ring/50",
          e.disabled ? "cursor-not-allowed opacity-50" : ""
        ]]),
        role: "combobox",
        "aria-expanded": f.value,
        "aria-controls": u,
        "aria-activedescendant": f.value && C.value[m.value] ? G(m.value) : void 0,
        "aria-haspopup": "listbox",
        tabindex: "0",
        onClick: p
      }, [
        (t(!0), n(_, null, j(M.value, (N) => (t(), n("span", {
          key: N.value,
          class: "bg-primary/10 text-primary flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium"
        }, [
          U(c(N.label) + " ", 1),
          l("button", {
            type: "button",
            class: "hover:text-destructive -mr-0.5 leading-none",
            "aria-label": `Remove ${N.label}`,
            onClick: ge((R) => S(N.value), ["stop"])
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
          ])], 8, ls)
        ]))), 128)),
        M.value.length === 0 ? (t(), n("span", os, c(e.placeholder), 1)) : b("", !0),
        l("span", ss, [
          M.value.length > 1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground text-xs",
            "aria-label": "Clear all",
            onClick: ge(F, ["stop"])
          }, " Clear ")) : b("", !0),
          (t(), n("svg", {
            viewBox: "0 0 24 24",
            class: z(["text-muted-foreground size-4 transition-transform", f.value ? "rotate-180" : ""]),
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "aria-hidden": "true"
          }, [...H[2] || (H[2] = [
            l("path", { d: "m6 9 6 6 6-6" }, null, -1)
          ])], 2))
        ])
      ], 10, as),
      (t(), T(pt, { to: "body" }, [
        I(et, {
          "enter-active-class": "transition duration-100 ease-out",
          "enter-from-class": "opacity-0 scale-95",
          "leave-active-class": "transition duration-75 ease-in",
          "leave-to-class": "opacity-0 scale-95"
        }, {
          default: O(() => [
            f.value ? (t(), n("div", {
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
              $.value ? (t(), n("div", rs, [
                he(l("input", {
                  ref_key: "searchInput",
                  ref: d,
                  "onUpdate:modelValue": H[0] || (H[0] = (N) => v.value = N),
                  type: "text",
                  class: "w-full bg-transparent px-2 py-1.5 text-sm outline-none",
                  placeholder: e.searchPlaceholder,
                  onKeydown: D
                }, null, 40, is), [
                  [ze, v.value]
                ])
              ])) : b("", !0),
              l("div", ds, [
                (t(!0), n(_, null, j(C.value, (N, R) => (t(), n("button", {
                  key: N.value,
                  id: G(R),
                  type: "button",
                  class: z(["flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors", R === m.value ? "bg-accent" : "hover:bg-accent/60"]),
                  role: "option",
                  "aria-selected": "false",
                  onMouseenter: (X) => m.value = R,
                  onClick: (X) => g(N)
                }, c(N.label), 43, us))), 128)),
                C.value.length === 0 ? (t(), n("p", cs, [
                  k.value ? (t(), n(_, { key: 0 }, [
                    U("You have selected the maximum.")
                  ], 64)) : v.value ? (t(), n(_, { key: 1 }, [
                    U("Nothing matches “" + c(v.value) + "”.", 1)
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
        q(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
});
function oe(...e) {
  return xl(yl(e));
}
function j8(e) {
  return typeof e == "string" ? e : e?.url ?? "";
}
const fs = /* @__PURE__ */ L({
  __name: "SheetOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(en), de({
      "data-slot": "sheet-overlay",
      class: x(oe)(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        o.class
      )
    }, x(a)), {
      default: O(() => [
        q(r.$slots, "default")
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
    return (d, u) => (t(), T(x(tn), null, {
      default: O(() => [
        I(fs),
        I(x(nn), de({
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
            q(d.$slots, "default"),
            I(x(tt), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
              default: O(() => [
                I(x(an), { class: "size-4" }),
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
}), ms = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", ps = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline"
}, vs = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
  "icon-sm": "size-8",
  "icon-lg": "size-10"
};
function Ye(e = {}) {
  const o = e.variant ?? "default", a = e.size ?? "default";
  return [ms, ps[o], vs[a], e.class].filter(Boolean).join(" ");
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
        q(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["data-variant", "data-size", "type", "disabled", "aria-disabled", "class"]));
  }
}), gs = { class: "flex items-center gap-2" }, hs = ["onUpdate:modelValue", "onChange"], bs = ["value"], ys = ["onUpdate:modelValue"], xs = ["value"], ks = ["onUpdate:modelValue"], $s = ["onUpdate:modelValue", "multiple"], ws = ["value"], Cs = ["onUpdate:modelValue", "type"], Ss = ["aria-label", "onClick"], Ms = { class: "flex items-center gap-2" }, Bs = /* @__PURE__ */ L({
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
    const a = e, r = o, s = () => ({ logic: "and", rules: [] }), i = K(a.modelValue ? structuredClone(a.modelValue) : s());
    pe(
      () => a.modelValue,
      (w) => {
        i.value = w ? structuredClone(w) : s();
      }
    );
    const d = (w) => "rules" in w, u = y(() => Object.keys(a.fields));
    function f(w) {
      const p = w ? a.fields[w]?.kind : void 0;
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
      const w = u.value[0];
      i.value.rules.push({
        field: w,
        operator: f(w)[0],
        value: void 0
      }), m();
    }
    function M() {
      i.value.rules.push(s()), m();
    }
    function $(w) {
      i.value.rules.splice(w, 1), m();
    }
    function C(w) {
      w.operator = f(w.field)[0], w.value = void 0, m();
    }
    const k = y(() => a.depth + 1 < a.maxDepth);
    function A() {
      i.value = s(), m(), r("apply", null);
    }
    function B() {
      r("apply", i.value.rules.length ? i.value : null);
    }
    return (w, p) => {
      const g = Qt("PkQueryBuilder", !0);
      return t(), n("div", {
        class: z(["flex flex-col gap-2 rounded-lg border p-3", e.depth > 0 ? "bg-muted/30" : "bg-card"])
      }, [
        l("div", gs, [
          he(l("select", {
            "onUpdate:modelValue": p[0] || (p[0] = (S) => i.value.logic = S),
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
        (t(!0), n(_, null, j(i.value.rules, (S, F) => (t(), n("div", {
          key: F,
          class: "flex items-start gap-2"
        }, [
          d(S) ? (t(), T(g, {
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
            he(l("select", {
              "onUpdate:modelValue": (D) => S.field = D,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Field",
              onChange: (D) => C(S)
            }, [
              (t(!0), n(_, null, j(u.value, (D) => (t(), n("option", {
                key: D,
                value: D
              }, c(e.fields[D].label), 9, bs))), 128))
            ], 40, hs), [
              [Ze, S.field]
            ]),
            he(l("select", {
              "onUpdate:modelValue": (D) => S.operator = D,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Operator",
              onChange: m
            }, [
              (t(!0), n(_, null, j(f(S.field), (D) => (t(), n("option", {
                key: D,
                value: D
              }, c(v[D] ?? D), 9, xs))), 128))
            ], 40, ys), [
              [Ze, S.operator]
            ]),
            S.field && e.fields[S.field]?.kind === "boolean" ? he((t(), n("select", {
              key: 0,
              "onUpdate:modelValue": (D) => S.value = D,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: m
            }, [...p[3] || (p[3] = [
              l("option", { value: !0 }, "Yes", -1),
              l("option", { value: !1 }, "No", -1)
            ])], 40, ks)), [
              [Ze, S.value]
            ]) : S.field && e.fields[S.field]?.options?.length ? he((t(), n("select", {
              key: 1,
              "onUpdate:modelValue": (D) => S.value = D,
              multiple: e.fields[S.field].kind === "multiselect",
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: m
            }, [
              (t(!0), n(_, null, j(e.fields[S.field].options, (D) => (t(), n("option", {
                key: D,
                value: D
              }, c(D), 9, ws))), 128))
            ], 40, $s)), [
              [Ze, S.value]
            ]) : he((t(), n("input", {
              key: 2,
              "onUpdate:modelValue": (D) => S.value = D,
              type: S.field && e.fields[S.field]?.kind === "daterange" ? "date" : "text",
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: m
            }, null, 40, Cs)), [
              [va, S.value]
            ])
          ], 64)),
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:text-destructive px-1 py-1 text-sm",
            "aria-label": `Remove ${d(S) ? "group" : "rule"}`,
            onClick: (D) => $(F)
          }, " × ", 8, Ss)
        ]))), 128)),
        l("div", Ms, [
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
          k.value ? (t(), T(ce, {
            key: 0,
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: M
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
              onClick: A
            }, {
              default: O(() => [...p[6] || (p[6] = [
                U(" Clear ", -1)
              ])]),
              _: 1
            }),
            I(ce, {
              type: "button",
              size: "sm",
              onClick: B
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
}), As = {
  "data-slot": "table-toolbar",
  class: "flex flex-col gap-2"
}, zs = { class: "flex items-center gap-2 md:hidden" }, _s = { class: "relative min-w-0 flex-1" }, Ps = ["placeholder", "title", "aria-label"], Ls = {
  key: 0,
  class: "bg-primary text-primary-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px]"
}, Os = { class: "flex max-h-[85vh] flex-col" }, js = { class: "flex-1 overflow-y-auto px-4 py-3" }, Vs = {
  key: 0,
  class: "mb-4 flex flex-col gap-3"
}, Ds = { class: "text-xs font-medium" }, Ts = ["value", "onChange"], Is = ["value"], Es = { class: "mb-4" }, Fs = { class: "flex flex-col gap-1" }, Ns = ["disabled", "onClick"], Rs = {
  key: 0,
  class: "text-primary ml-auto text-xs"
}, Us = {
  key: 1,
  class: "mb-4"
}, Hs = { class: "flex flex-col gap-1" }, Ks = ["onClick"], qs = { class: "border-t p-4" }, Gs = ["disabled"], Ws = { class: "hidden flex-wrap items-center justify-end gap-2 md:flex" }, Zs = { class: "relative min-w-0 flex-1 sm:w-72 sm:flex-none" }, Js = ["placeholder", "title", "aria-label"], Ys = ["aria-label"], Qs = {
  key: 0,
  class: "bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums"
}, Xs = { class: "flex max-h-96 flex-col gap-4 overflow-y-auto px-1 pb-3" }, er = { class: "text-xs font-medium" }, tr = ["value", "onChange"], nr = ["value"], ar = { class: "grid grid-cols-2 gap-2" }, lr = ["value", "onChange"], or = ["value", "onChange"], sr = {
  key: 3,
  class: "grid grid-cols-2 gap-2"
}, rr = ["value", "onChange"], ir = ["value", "onChange"], dr = {
  key: 4,
  class: "flex items-center gap-2"
}, ur = ["aria-checked", "onClick"], cr = { class: "text-xs" }, fr = ["onClick"], mr = ["value", "onChange"], pr = ["value"], vr = ["disabled", "onClick"], gr = { class: "flex max-h-80 flex-col overflow-y-auto py-1" }, hr = ["disabled", "onClick"], br = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, yr = {
  key: 1,
  class: "size-4 shrink-0",
  "aria-hidden": "true"
}, xr = {
  key: 1,
  class: "border-input inline-flex shrink-0 overflow-hidden rounded-md border",
  role: "group",
  "aria-label": "Index layout"
}, kr = ["aria-pressed", "aria-label", "title", "onClick"], $r = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, wr = {
  key: 1,
  viewBox: "0 0 24 24",
  class: "size-4",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Cr = ["aria-pressed", "aria-label", "title"], Sr = ["aria-label", "title"], Mr = { class: "flex flex-col gap-0.5 p-1" }, Br = ["onClick"], Ar = ["onClick"], zr = {
  key: 5,
  class: "text-muted-foreground shrink-0 text-xs"
}, _r = {
  key: 0,
  class: "flex flex-wrap items-center gap-1.5",
  dusk: "filter-indicators"
}, Pr = ["dusk"], Lr = ["aria-label", "onClick"], Or = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(!1), i = K(a.search);
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
    const u = K({ ...a.filters });
    pe(
      () => a.filters,
      (V) => {
        u.value = { ...V };
      },
      { deep: !0 }
    );
    const f = y(
      () => a.filterSchema.filter(
        (V) => a.filters[V.key] !== null && a.filters[V.key] !== void 0
      ).length
    ), v = y(() => JSON.stringify(u.value) !== JSON.stringify(a.filters)), m = y(() => a.search !== "" || f.value > 0), h = y(() => a.indicators.length ? a.indicators : a.filterSchema.filter((V) => a.filters[V.key] !== null && a.filters[V.key] !== void 0).map((V) => ({
      key: V.key,
      label: `${V.label}: ${String(a.filters[V.key])}`,
      removable: !0
    })));
    function M(V) {
      r("group", V);
    }
    function $(V) {
      M(V), s.value = !1;
    }
    function C(V, E) {
      M(V), E();
    }
    function k(V) {
      r("clear-filter", V);
    }
    function A(V) {
      return V.type === "multiselect";
    }
    function B(V) {
      const E = u.value[V.key];
      return Array.isArray(E) ? E : E == null ? [] : [E];
    }
    function w(V) {
      return B(V).filter(
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
    function S(V, E) {
      const te = u.value[V.key];
      if (typeof te != "string" || !te.includes(".."))
        return "";
      const [le, Q] = te.split("..");
      return E === "from" ? le ?? "" : Q ?? "";
    }
    function F(V, E, te) {
      const le = E === "from" ? te : S(V, "from"), Q = E === "to" ? te : S(V, "to");
      u.value = {
        ...u.value,
        [V.key]: le && Q ? `${le}..${Q}` : null
      };
    }
    function D(V, E, te) {
      const le = E === "from" ? te : S(V, "from"), Q = E === "to" ? te : S(V, "to");
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
    const H = K(new Set(a.hidden));
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
    return (V, E) => (t(), n("div", As, [
      l("div", zs, [
        l("div", _s, [
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
          he(l("input", {
            "onUpdate:modelValue": E[0] || (E[0] = (te) => i.value = te),
            type: "search",
            placeholder: e.searchPlaceholder,
            title: e.searchHint,
            "aria-label": e.searchHint ?? e.searchPlaceholder,
            class: z([
              "border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors",
              x(Be)
            ])
          }, null, 10, Ps), [
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
          f.value ? (t(), n("span", Ls, c(f.value), 1)) : b("", !0)
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
                l("div", Os, [
                  E[15] || (E[15] = l("div", { class: "border-b px-4 py-3" }, [
                    l("p", { class: "text-sm font-semibold" }, "Table tools"),
                    l("p", { class: "text-muted-foreground text-xs font-normal" }, " Filters, columns, and grouping ")
                  ], -1)),
                  l("div", js, [
                    e.filterSchema.length ? (t(), n("div", Vs, [
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
                        l("label", Ds, c(te.label), 1),
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
                          }, c(le.label), 9, Is))), 128))
                        ], 40, Ts)) : b("", !0)
                      ]))), 128))
                    ])) : b("", !0),
                    l("div", Es, [
                      E[13] || (E[13] = l("p", { class: "mb-2 text-sm font-medium" }, "Columns", -1)),
                      l("div", Fs, [
                        (t(!0), n(_, null, j(e.columns, (te) => (t(), n("button", {
                          key: `mobile-col-${te.key}`,
                          type: "button",
                          class: "hover:bg-accent flex items-center gap-2 rounded px-2 py-1.5 text-sm",
                          disabled: te.locked,
                          onClick: (le) => N(te.key)
                        }, [
                          l("span", null, c(te.label), 1),
                          H.value.has(te.key) ? b("", !0) : (t(), n("span", Rs, "On"))
                        ], 8, Ns))), 128))
                      ])
                    ]),
                    e.groups.length ? (t(), n("div", Us, [
                      E[14] || (E[14] = l("p", { class: "mb-2 text-sm font-medium" }, "Grouping", -1)),
                      l("div", Hs, [
                        l("button", {
                          type: "button",
                          class: "hover:bg-accent rounded px-2 py-1.5 text-left text-sm",
                          onClick: E[2] || (E[2] = (te) => $(null))
                        }, " No grouping "),
                        (t(!0), n(_, null, j(e.groups, (te) => (t(), n("button", {
                          key: te.key,
                          type: "button",
                          class: "hover:bg-accent rounded px-2 py-1.5 text-left text-sm",
                          onClick: (le) => $(te.key)
                        }, c(te.label), 9, Ks))), 128))
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
                    }, " Apply filters ", 8, Gs)) : b("", !0),
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
      l("div", Ws, [
        l("div", Zs, [
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
          he(l("input", {
            "onUpdate:modelValue": E[4] || (E[4] = (te) => i.value = te),
            type: "search",
            placeholder: e.searchPlaceholder,
            title: e.searchHint,
            "aria-label": e.searchHint ?? e.searchPlaceholder,
            class: z([
              "border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors",
              x(Be)
            ])
          }, null, 10, Js), [
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
        e.filterSchema.length ? (t(), T(Ke, {
          key: 0,
          width: "w-80",
          "dismiss-on-panel-click": !1
        }, {
          trigger: O(() => [
            l("button", {
              type: "button",
              dusk: "filters-trigger",
              class: z(["border-input bg-background hover:bg-accent hover:text-accent-foreground relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors", f.value ? "border-primary text-primary" : ""]),
              "aria-label": f.value ? `Filters (${f.value} active)` : "Filters",
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
              f.value ? (t(), n("span", Qs, c(f.value), 1)) : b("", !0)
            ], 10, Ys)
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
            l("div", Xs, [
              (t(!0), n(_, null, j(e.filterSchema, (le) => (t(), n("div", {
                key: le.key,
                class: "flex flex-col gap-1.5"
              }, [
                l("label", er, c(le.label), 1),
                A(le) ? (t(), T(on, {
                  key: 0,
                  "model-value": w(le),
                  options: p(le),
                  placeholder: `Any ${le.label.toLowerCase()}`,
                  "onUpdate:modelValue": (Q) => u.value[le.key] = Q.length ? Q : null
                }, null, 8, ["model-value", "options", "placeholder", "onUpdate:modelValue"])) : le.type === "querybuilder" ? (t(), T(Bs, {
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
                    }, c(Q.label), 9, nr))), 128))
                  ], 40, tr),
                  l("div", ar, [
                    l("input", {
                      type: "date",
                      value: S(le, "from"),
                      "aria-label": "From",
                      class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                      onChange: (Q) => F(
                        le,
                        "from",
                        Q.target.value
                      )
                    }, null, 40, lr),
                    l("input", {
                      type: "date",
                      value: S(le, "to"),
                      "aria-label": "To",
                      class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                      onChange: (Q) => F(
                        le,
                        "to",
                        Q.target.value
                      )
                    }, null, 40, or)
                  ])
                ], 64)) : le.type === "numberrange" ? (t(), n("div", sr, [
                  l("input", {
                    type: "number",
                    value: S(le, "from"),
                    "aria-label": "From",
                    placeholder: "From",
                    class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                    onChange: (Q) => D(
                      le,
                      "from",
                      Q.target.value
                    )
                  }, null, 40, rr),
                  l("input", {
                    type: "number",
                    value: S(le, "to"),
                    "aria-label": "To",
                    placeholder: "To",
                    class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                    onChange: (Q) => D(
                      le,
                      "to",
                      Q.target.value
                    )
                  }, null, 40, ir)
                ])) : le.type === "boolean" ? (t(), n("div", dr, [
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
                  ], 10, ur),
                  l("span", cr, c(le.trueLabel ?? "Yes"), 1),
                  l("button", {
                    type: "button",
                    class: z([
                      "text-muted-foreground ml-auto text-xs hover:underline",
                      u.value[le.key] === !1 ? "text-primary font-medium" : ""
                    ]),
                    onClick: (Q) => g(le, u.value[le.key] === !1 ? null : !1)
                  }, c(le.falseLabel ?? "No") + " only ", 11, fr)
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
                  }, c(Q.label), 9, pr))), 128))
                ], 40, mr))
              ]))), 128))
            ]),
            l("button", {
              type: "button",
              class: "bg-primary text-primary-foreground hover:bg-primary/90 mt-1 h-9 w-full rounded-md text-sm font-medium transition-colors disabled:opacity-50",
              disabled: !v.value,
              onClick: (le) => Y(te)
            }, " Apply filters ", 8, vr)
          ]),
          _: 1
        })) : b("", !0),
        I(Ke, { "dismiss-on-panel-click": !1 }, {
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
            l("div", gr, [
              (t(!0), n(_, null, j(e.columns, (te) => (t(), n("button", {
                key: te.key,
                type: "button",
                class: z(["hover:bg-accent flex items-center gap-2 px-3 py-1.5 text-sm", te.locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"]),
                disabled: te.locked,
                onClick: (le) => N(te.key)
              }, [
                H.value.has(te.key) ? (t(), n("span", yr)) : (t(), n("svg", br, [...E[24] || (E[24] = [
                  l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
                ])])),
                U(" " + c(te.label), 1)
              ], 10, hr))), 128))
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
        e.layouts.length > 1 ? (t(), n("div", xr, [
          (t(!0), n(_, null, j(e.layouts, (te) => (t(), n("button", {
            key: te,
            type: "button",
            class: z(["hover:bg-accent inline-flex size-9 items-center justify-center transition-colors", e.layout === te ? "bg-accent text-foreground" : "text-muted-foreground"]),
            "aria-pressed": e.layout === te,
            "aria-label": te === "cards" ? "Card layout" : "Table layout",
            title: te === "cards" ? "Cards" : "Table",
            onClick: (le) => r("layout", te)
          }, [
            te === "table" ? (t(), n("svg", $r, [...E[27] || (E[27] = [
              l("path", { d: "M3 5h18M3 12h18M3 19h18" }, null, -1)
            ])])) : (t(), n("svg", wr, [...E[28] || (E[28] = [
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
          ], 10, kr))), 128))
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
        ])], 10, Cr)) : b("", !0),
        e.groups.length ? (t(), T(Ke, {
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
            ])], 10, Sr)
          ]),
          panel: O(({ close: te }) => [
            l("div", Mr, [
              l("button", {
                type: "button",
                class: z(["hover:bg-accent rounded px-2 py-1.5 text-left text-sm", e.groupBy ? "" : "text-primary font-medium"]),
                onClick: (le) => C(null, te)
              }, " No grouping ", 10, Br),
              (t(!0), n(_, null, j(e.groups, (le) => (t(), n("button", {
                key: le.key,
                type: "button",
                class: z(["hover:bg-accent rounded px-2 py-1.5 text-left text-sm", e.groupBy?.key === le.key ? "text-primary font-medium" : ""]),
                onClick: (Q) => C(le.key, te)
              }, c(le.label), 11, Ar))), 128))
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
        e.loading ? (t(), n("span", zr, "Loading…")) : b("", !0)
      ]),
      h.value.length ? (t(), n("div", _r, [
        (t(!0), n(_, null, j(h.value, (te) => (t(), n("span", {
          key: te.key + te.label,
          class: "border-input bg-muted/60 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
          dusk: `filter-indicator-${te.key}`
        }, [
          U(c(te.label) + " ", 1),
          te.removable !== !1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "hover:text-foreground text-muted-foreground",
            "aria-label": `Clear ${te.label}`,
            onClick: (le) => k(te.key)
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
          ])], 8, Lr)) : b("", !0)
        ], 8, Pr))), 128)),
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
}), jr = { class: "min-w-0" }, Vr = {
  key: 0,
  class: "text-sm font-semibold tracking-tight"
}, Dr = {
  key: 0,
  class: "flex shrink-0 flex-wrap items-center justify-end gap-2"
}, Tr = {
  key: 0,
  class: "text-muted-foreground px-4 py-10 text-center text-sm"
}, Ir = {
  key: 2,
  class: "pk-table-scroll pk-scroll w-full min-w-0 max-w-full overflow-x-auto overflow-y-auto overscroll-x-contain"
}, Er = { class: "w-max min-w-full border-collapse text-sm" }, Fr = { class: "bg-muted/40" }, Nr = { class: "divide-y" }, Rr = ["onClick"], Ur = ["href"], Hr = {
  key: 1,
  class: "text-muted-foreground"
}, Kr = {
  key: 0,
  class: "flex justify-center"
}, qr = ["disabled"], Gr = {
  key: 1,
  class: "text-muted-foreground text-center text-xs"
}, Wr = ["href"], V8 = /* @__PURE__ */ L({
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
    const a = e, r = o, s = Yt(), i = y(() => a.columns.filter(($) => $.type !== "image")), d = y(() => !!s.actions), u = y(() => !!a.title || d.value), f = y(() => a.filterSchema.length > 0), v = y(
      () => a.columns.map(($) => ({ key: $.key, label: $.label, locked: !0 }))
    );
    function m($, C) {
      return C == null || C === "" ? "None" : $.type === "date" || $.type === "datetime" ? new Date(String(C)).toLocaleString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...$.type === "datetime" ? { hour: "2-digit", minute: "2-digit" } : {}
      }) : typeof C == "number" ? new Intl.NumberFormat().format(C) : String(C);
    }
    function h($) {
      return $ == null || $ === "";
    }
    function M($, C) {
      !a.recordBase || $.id == null || C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || C.target?.closest('a, button, input, select, textarea, label, [role="menuitem"]') || (window.getSelection()?.toString().length ?? 0) > 0 || wa.visit(`${a.recordBase}/${$.id}`);
    }
    return ($, C) => (t(), T(ns, null, ct({
      default: O(() => [
        e.loading && e.rows.length === 0 ? (t(), n("div", Tr, " Loading… ")) : e.loaded && e.rows.length === 0 ? (t(), T(Ut, {
          key: 1,
          compact: "",
          icon: "package",
          title: e.emptyTitle,
          description: e.emptyText
        }, ct({ _: 2 }, [
          $.$slots.illustration ? {
            name: "illustration",
            fn: O(() => [
              q($.$slots, "illustration")
            ]),
            key: "0"
          } : void 0,
          $.$slots["empty-actions"] ? {
            name: "actions",
            fn: O(() => [
              q($.$slots, "empty-actions")
            ]),
            key: "1"
          } : void 0
        ]), 1032, ["title", "description"])) : e.rows.length > 0 ? (t(), n("div", Ir, [
          l("table", Er, [
            l("thead", Fr, [
              l("tr", null, [
                (t(!0), n(_, null, j(i.value, (k) => (t(), n("th", {
                  key: k.key,
                  class: "text-muted-foreground px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap"
                }, c(k.label), 1))), 128))
              ])
            ]),
            l("tbody", Nr, [
              (t(!0), n(_, null, j(e.rows, (k, A) => (t(), n("tr", {
                key: k.id ?? A,
                "data-slot": "table-row",
                class: z(["pk-row hover:bg-muted/40 transition-colors", e.recordBase && k.id != null ? "cursor-pointer" : ""]),
                onClick: (B) => M(k, B)
              }, [
                (t(!0), n(_, null, j(i.value, (B) => (t(), n("td", {
                  key: B.key,
                  class: z(["px-3 whitespace-nowrap", [
                    B.mono ? "font-mono text-xs" : "",
                    B.muted ? "text-muted-foreground" : ""
                  ]])
                }, [
                  q($.$slots, `cell:${B.key}`, {
                    row: k,
                    value: k[B.key],
                    column: B
                  }, () => [
                    e.recordBase && k.id != null && B === i.value[0] ? (t(), n("a", {
                      key: 0,
                      href: `${e.recordBase}/${k.id}`,
                      class: "text-foreground underline-offset-2 hover:underline"
                    }, c(m(B, k[B.key])), 9, Ur)) : h(k[B.key]) ? (t(), n("span", Hr, " None ")) : (t(), n(_, { key: 2 }, [
                      U(c(m(B, k[B.key])), 1)
                    ], 64))
                  ])
                ], 2))), 128))
              ], 10, Rr))), 128))
            ])
          ])
        ])) : b("", !0)
      ]),
      _: 2
    }, [
      u.value ? {
        name: "title",
        fn: O(() => [
          l("div", jr, [
            e.title ? (t(), n("h3", Vr, c(e.title), 1)) : b("", !0)
          ]),
          d.value ? (t(), n("div", Dr, [
            q($.$slots, "actions")
          ])) : b("", !0)
        ]),
        key: "0"
      } : void 0,
      f.value ? {
        name: "toolbar",
        fn: O(() => [
          I(Or, {
            search: e.search,
            "search-placeholder": "Search related…",
            "filter-schema": e.filterSchema,
            filters: e.filters,
            columns: v.value,
            hidden: /* @__PURE__ */ new Set(),
            loading: e.loading,
            indicators: e.indicators,
            "onUpdate:search": C[0] || (C[0] = (k) => r("update:search", k)),
            onApplyFilters: C[1] || (C[1] = (k) => r("apply-filters", k)),
            onClearFilters: C[2] || (C[2] = (k) => r("clear-filters")),
            onClearFilter: C[3] || (C[3] = (k) => r("clear-filter", k)),
            onClear: C[4] || (C[4] = (k) => r("clear-filters")),
            onApplyColumns: C[5] || (C[5] = () => {
            })
          }, null, 8, ["search", "filter-schema", "filters", "columns", "hidden", "loading", "indicators"])
        ]),
        key: "1"
      } : void 0,
      e.nextCursor || e.capped ? {
        name: "pagination",
        fn: O(() => [
          e.nextCursor ? (t(), n("div", Kr, [
            l("button", {
              type: "button",
              class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm font-medium disabled:opacity-50",
              disabled: e.loading,
              onClick: C[6] || (C[6] = (k) => r("load", e.nextCursor))
            }, c(e.loading ? "Loading…" : "Load more"), 9, qr)
          ])) : e.capped ? (t(), n("p", Gr, [
            U(" Showing the first " + c(e.rows.length) + ". ", 1),
            e.indexHref ? (t(), n("a", {
              key: 0,
              href: e.indexHref,
              class: "text-foreground underline-offset-2 hover:underline"
            }, " Open the full list ", 8, Wr)) : (t(), n(_, { key: 1 }, [
              U("Open the full list to search or filter the rest.")
            ], 64))
          ])) : b("", !0)
        ]),
        key: "2"
      } : void 0
    ]), 1024));
  }
}), Zr = { class: "flex items-center gap-2 overflow-x-auto" }, Jr = {
  key: 0,
  class: "size-3",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Yr = {
  key: 1,
  class: "size-3",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Qr = { class: "flex flex-col" }, Xr = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, ei = {
  key: 0,
  class: "bg-destructive size-1.5 shrink-0 rounded-full",
  "aria-label": "has errors"
}, ti = {
  key: 0,
  class: "bg-border h-px w-6 shrink-0",
  "aria-hidden": "true"
}, ni = /* @__PURE__ */ L({
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
    function s(f) {
      return a.failedStep !== null && f === a.failedStep ? "bg-destructive text-destructive-foreground border-destructive" : a.failedStep !== null && f > a.failedStep ? "" : f < a.activeStep ? "bg-primary text-primary-foreground border-primary" : f === a.activeStep ? "border-primary text-primary" : "";
    }
    function i(f) {
      if (a.failedStep !== null) {
        if (f === a.failedStep)
          return "text-destructive font-medium";
        if (f > a.failedStep)
          return "text-muted-foreground/60";
      }
      return f === a.activeStep ? "text-foreground font-medium" : f < a.activeStep ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/60";
    }
    function d(f) {
      return a.failedStep !== null ? f < a.failedStep : f < a.activeStep;
    }
    function u(f) {
      return a.failedStep === f;
    }
    return (f, v) => (t(), n("ol", Zr, [
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
          onClick: (M) => e.interactive && h <= e.activeStep && r("update:activeStep", h)
        }), {
          default: O(() => [
            l("span", {
              class: z(["flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums", s(h)])
            }, [
              u(h) ? (t(), n("svg", Jr, [...v[0] || (v[0] = [
                l("path", { d: "M18 6 6 18M6 6l12 12" }, null, -1)
              ])])) : d(h) ? (t(), n("svg", Yr, [...v[1] || (v[1] = [
                l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
              ])])) : (t(), n(_, { key: 2 }, [
                U(c(h + 1), 1)
              ], 64))
            ], 2),
            l("span", Qr, [
              l("span", null, c(m.label), 1),
              m.description ? (t(), n("span", Xr, c(m.description), 1)) : b("", !0)
            ]),
            e.hasError(h) ? (t(), n("span", ei)) : b("", !0)
          ]),
          _: 2
        }, 1040, ["type", "class", "onClick"])),
        h < e.steps.length - 1 ? (t(), n("span", ti)) : b("", !0)
      ]))), 128))
    ]));
  }
}), ai = ["data-variant"], li = "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none", Ie = /* @__PURE__ */ L({
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
      return [li, i, o.class].filter(Boolean).join(" ");
    });
    return (i, d) => (t(), n("span", {
      "data-slot": "badge",
      "data-variant": e.variant,
      class: z(s.value)
    }, [
      q(i.$slots, "default")
    ], 10, ai));
  }
}), gt = /* @__PURE__ */ new Map();
function xe(e, o) {
  gt.set(e, o);
}
function oi(e) {
  return gt.get(e);
}
function D8(e) {
  return gt.has(e);
}
function T8() {
  return [...gt.keys()].sort();
}
function I8() {
  gt.clear();
}
const E8 = "text-sm text-muted-foreground font-normal", F8 = "text-xs text-muted-foreground font-normal", kt = "text-xs text-muted-foreground font-normal leading-snug";
class si extends Error {
  fieldErrors;
  constructor(o, a = {}) {
    super(o), this.name = "CreateOptionError", this.fieldErrors = a;
  }
}
function N8(e) {
  if (!e || typeof e != "object")
    return {};
  const o = {};
  for (const [a, r] of Object.entries(e)) {
    const s = Array.isArray(r) ? r[0] : r;
    typeof s == "string" && s !== "" && (o[a] = s);
  }
  return o;
}
function ri(e) {
  if (e.createOptionLabel)
    return e.createOptionLabel;
  const o = e.label.replace(/\s*id$/i, "").trim();
  return o !== "" ? `Create ${o.toLowerCase()}` : "Create option";
}
function ii(e) {
  if (e.createOptionActionLabel)
    return e.createOptionActionLabel;
  const o = e.label.replace(/\s*id$/i, "").trim();
  return o !== "" ? `Create ${o.toLowerCase()}` : "Create new";
}
const di = "text-foreground font-normal", ui = "placeholder:text-muted-foreground placeholder:font-normal", He = `${di} ${ui}`, ci = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(Ca), de({ "data-slot": "checkbox" }, x(i), {
      class: x(oe)(
        "peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        a.class
      )
    }), {
      default: O((f) => [
        I(x(Sa), {
          "data-slot": "checkbox-indicator",
          class: "grid place-content-center text-current transition-none"
        }, {
          default: O(() => [
            q(d.$slots, "default", Le(Re(f)), () => [
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
    return (i, d) => (t(), T(x(Ma), de({ "data-slot": "switch" }, x(s), {
      class: x(oe)(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        a.class
      )
    }), {
      default: O(() => [
        I(x(Ba), {
          "data-slot": "switch-thumb",
          class: "bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), fi = {
  key: 0,
  class: "text-destructive text-sm",
  role: "alert"
}, mi = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K({});
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
      onClose: u[1] || (u[1] = (f) => r("close"))
    }, {
      footer: O(() => [
        I(ce, {
          type: "button",
          variant: "outline",
          disabled: e.processing,
          onClick: u[0] || (u[0] = (f) => r("close"))
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
            U(c(e.processing ? "Creating…" : "Create"), 1)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: O(() => [
        l("form", {
          class: "flex flex-col gap-4",
          onSubmit: ge(i, ["prevent"])
        }, [
          e.generalError ? (t(), n("p", fi, c(e.generalError), 1)) : b("", !0),
          (t(!0), n(_, null, j(e.fields, (f) => (t(), T(We, {
            key: f.key,
            field: f,
            value: s.value[f.key],
            error: e.errors[f.key],
            processing: e.processing,
            onChange: (v) => s.value[f.key] = v
          }, null, 8, ["field", "value", "error", "processing", "onChange"]))), 128))
        ], 32)
      ]),
      _: 1
    }, 8, ["open", "title", "description", "busy"]));
  }
}), pi = ["accept", "disabled"], vi = { class: "text-sm font-medium" }, gi = { key: 0 }, hi = { key: 1 }, bi = { class: "text-muted-foreground text-xs font-normal" }, yi = {
  key: 0,
  class: "bg-muted mt-2 h-1 w-40 overflow-hidden rounded-full"
}, xi = {
  key: 1,
  class: "flex items-center gap-3 rounded-lg border p-3"
}, ki = ["src"], $i = {
  key: 1,
  class: "bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded text-[10px] font-semibold uppercase"
}, wi = { class: "min-w-0 flex-1" }, Ci = { class: "block truncate text-sm font-medium" }, Si = { class: "text-muted-foreground text-xs font-normal" }, Mi = ["href"], Bi = {
  key: 2,
  class: "text-destructive mt-1.5 text-xs"
}, Kn = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(null), i = K(!1), d = K(null), u = K(null), f = K(null), v = y(() => a.accept.map((p) => `.${p}`).join(",")), m = y(() => f.value ?? a.modelValue?.url ?? null), h = y(() => `${a.accept.length ? a.accept.join(", ").toUpperCase() : "Any file"} · up to ${M(a.maxKilobytes * 1024)}`);
    function M(p) {
      if (!p)
        return "";
      const g = ["B", "KB", "MB", "GB"];
      let S = p, F = 0;
      for (; S >= 1024 && F < g.length - 1; )
        S /= 1024, F++;
      return `${S.toFixed(S < 10 && F > 0 ? 1 : 0)} ${g[F]}`;
    }
    function $(p) {
      return p.split(".").pop()?.toLowerCase() ?? "";
    }
    function C(p) {
      return a.accept.length && !a.accept.includes($(p.name)) ? `${$(p.name).toUpperCase() || "That"} files are not accepted here.` : p.size > a.maxKilobytes * 1024 ? `That file is ${M(p.size)}; the limit is ${M(a.maxKilobytes * 1024)}.` : null;
    }
    async function k(p) {
      const g = p?.[0];
      if (!(!g || a.disabled) && (u.value = C(g), !u.value)) {
        A(), a.image && g.type.startsWith("image/") && (f.value = URL.createObjectURL(g)), d.value = 0;
        try {
          const S = await a.upload(g, (F) => {
            d.value = F;
          });
          r("update:modelValue", S);
        } catch (S) {
          u.value = S instanceof Error ? S.message : "The upload failed.", A();
        } finally {
          d.value = null, s.value && (s.value.value = "");
        }
      }
    }
    function A() {
      f.value && URL.revokeObjectURL(f.value), f.value = null;
    }
    async function B() {
      const p = a.modelValue;
      A(), u.value = null, r("update:modelValue", null), p && !p.url && a.discard && await a.discard(p.value).catch(() => {
      });
    }
    function w(p) {
      i.value = !1, k(p.dataTransfer?.files ?? null);
    }
    return (p, g) => (t(), n("div", null, [
      e.modelValue ? (t(), n("div", xi, [
        e.image && m.value ? (t(), n("img", {
          key: 0,
          src: m.value,
          alt: "",
          class: "bg-muted size-12 shrink-0 rounded object-cover"
        }, null, 8, ki)) : (t(), n("span", $i, c($(e.modelValue.name) || "file"), 1)),
        l("span", wi, [
          l("span", Ci, c(e.modelValue.name), 1),
          l("span", Si, [
            U(c(M(e.modelValue.size)) + " ", 1),
            e.modelValue.url ? (t(), n(_, { key: 0 }, [
              g[4] || (g[4] = U(" · ", -1)),
              l("a", {
                href: e.modelValue.url,
                class: "hover:underline"
              }, "Download", 8, Mi)
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
          onClick: B
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
        onDragover: g[1] || (g[1] = ge((S) => i.value = !0, ["prevent"])),
        onDragleave: g[2] || (g[2] = ge((S) => i.value = !1, ["prevent"])),
        onDrop: ge(w, ["prevent"])
      }, [
        l("input", {
          ref_key: "input",
          ref: s,
          type: "file",
          class: "sr-only",
          accept: v.value,
          disabled: e.disabled,
          onChange: g[0] || (g[0] = (S) => k(S.target.files))
        }, null, 40, pi),
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
        l("span", vi, [
          d.value === null ? (t(), n("span", gi, "Drop a file or click to choose")) : (t(), n("span", hi, "Uploading…"))
        ]),
        l("span", bi, c(h.value), 1),
        d.value !== null ? (t(), n("span", yi, [
          l("span", {
            class: "bg-primary block h-full transition-[width] duration-150",
            style: ie({ width: `${d.value}%` })
          }, null, 4)
        ])) : b("", !0)
      ], 34)),
      u.value ? (t(), n("p", Bi, c(u.value), 1)) : b("", !0)
    ]));
  }
}), Ai = { class: "flex flex-col gap-2" }, zi = {
  key: 0,
  class: "flex flex-col gap-1.5"
}, _i = { class: "text-muted-foreground grid grid-cols-[1fr_1fr_auto] gap-2 text-xs" }, Pi = { class: "flex flex-col gap-1" }, Li = ["onUpdate:modelValue", "disabled", "aria-label"], Oi = {
  key: 0,
  class: "text-destructive text-xs",
  role: "alert"
}, ji = {
  key: 1,
  class: "text-destructive text-xs",
  role: "alert"
}, Vi = ["onUpdate:modelValue", "disabled", "aria-label"], Di = ["disabled", "aria-label", "onClick"], Ti = {
  key: 1,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, Ii = { class: "flex items-center gap-3" }, Ei = ["disabled"], Fi = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal tabular-nums"
}, Ni = /* @__PURE__ */ L({
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
    const d = K(u(a.modelValue));
    function u(k) {
      return k ? Object.entries(k).map(([A, B]) => ({
        uid: i++,
        key: A,
        value: B ?? ""
      })) : [];
    }
    pe(
      () => a.modelValue,
      (k) => {
        JSON.stringify(k ?? null) !== JSON.stringify(f()) && (d.value = u(k));
      }
    );
    function f() {
      const k = {};
      for (const A of d.value) {
        const B = A.key.trim();
        B !== "" && (k[B] = A.value);
      }
      return Object.keys(k).length ? k : null;
    }
    function v() {
      r("update:modelValue", f());
    }
    const m = y(() => {
      const k = /* @__PURE__ */ new Map();
      for (const A of d.value) {
        const B = A.key.trim();
        B !== "" && k.set(B, (k.get(B) ?? 0) + 1);
      }
      return new Set([...k.entries()].filter(([, A]) => A > 1).map(([A]) => A));
    }), h = y(
      () => new Set(
        d.value.map((k) => k.key.trim()).filter((k) => k !== "" && !s.test(k))
      )
    ), M = y(() => a.maxPairs !== null && d.value.length >= a.maxPairs);
    function $() {
      M.value || a.disabled || d.value.push({ uid: i++, key: "", value: "" });
    }
    function C(k) {
      d.value = d.value.filter((A) => A.uid !== k), v();
    }
    return (k, A) => (t(), n("div", Ai, [
      d.value.length ? (t(), n("div", zi, [
        l("div", _i, [
          l("span", null, c(e.keyLabel), 1),
          l("span", null, c(e.valueLabel), 1),
          A[0] || (A[0] = l("span", { class: "w-7" }, null, -1))
        ]),
        (t(!0), n(_, null, j(d.value, (B) => (t(), n("div", {
          key: B.uid,
          class: "grid grid-cols-[1fr_1fr_auto] items-start gap-2"
        }, [
          l("div", Pi, [
            he(l("input", {
              "onUpdate:modelValue": (w) => B.key = w,
              type: "text",
              class: z([
                "border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
                m.value.has(B.key.trim()) || h.value.has(B.key.trim()) ? "border-destructive" : ""
              ]),
              disabled: e.disabled,
              "aria-label": e.keyLabel,
              onInput: v
            }, null, 42, Li), [
              [ze, B.key]
            ]),
            h.value.has(B.key.trim()) ? (t(), n("p", Oi, " Letters, numbers, underscores and dashes only. ")) : m.value.has(B.key.trim()) ? (t(), n("p", ji, " Used twice - only the last value will be saved. ")) : b("", !0)
          ]),
          he(l("input", {
            "onUpdate:modelValue": (w) => B.value = w,
            type: "text",
            class: "border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
            disabled: e.disabled,
            "aria-label": e.valueLabel,
            onInput: v
          }, null, 40, Vi), [
            [ze, B.value]
          ]),
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-40",
            disabled: e.disabled,
            "aria-label": `Remove ${B.key || "this entry"}`,
            onClick: (w) => C(B.uid)
          }, [...A[1] || (A[1] = [
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
          ])], 8, Di)
        ]))), 128))
      ])) : (t(), n("p", Ti, " Nothing here yet. ")),
      l("div", Ii, [
        l("button", {
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled || M.value,
          onClick: $
        }, [
          A[2] || (A[2] = l("svg", {
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
          U(" Add " + c(e.keyLabel.toLowerCase()), 1)
        ], 8, Ei),
        e.maxPairs !== null ? (t(), n("p", Fi, c(d.value.length) + " of " + c(e.maxPairs), 1)) : b("", !0)
      ])
    ]));
  }
}), Ri = { class: "border-input bg-background focus-within:ring-ring overflow-hidden rounded-md border focus-within:ring-2" }, Ui = { class: "bg-muted/40 flex flex-wrap items-center gap-0.5 border-b px-1.5 py-1" }, Hi = ["disabled", "title", "aria-label", "onClick"], Ki = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, qi = ["d"], Gi = ["disabled"], Wi = ["contenteditable", "data-placeholder"], Zi = {
  key: 0,
  class: "text-muted-foreground border-t px-3 py-1 text-right text-xs tabular-nums"
}, Ji = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(null);
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
    ], u = y(() => d.filter((C) => a.toolbar.includes(C.id))), f = y(() => a.toolbar.includes("link")), v = K(0);
    function m() {
      const C = s.value?.innerHTML ?? "", k = (s.value?.innerText ?? "").trim();
      v.value = k.length;
      const A = k === "" ? null : C;
      i = A, r("update:modelValue", A);
    }
    function h(C) {
      a.disabled || (s.value?.focus(), document.execCommand(C.command, !1, C.argument), m());
    }
    function M() {
      if (a.disabled)
        return;
      const C = window.prompt("Link address");
      C && (s.value?.focus(), document.execCommand("createLink", !1, C), m());
    }
    function $(C) {
      C.preventDefault();
      const k = C.clipboardData?.getData("text/plain") ?? "";
      document.execCommand("insertText", !1, k), m();
    }
    return be(() => {
      s.value && (s.value.innerHTML = a.modelValue ?? "", v.value = s.value.innerText.trim().length);
    }), pe(
      () => a.modelValue,
      (C) => {
        C !== i && s.value && (s.value.innerHTML = C ?? "", v.value = s.value.innerText.trim().length);
      }
    ), (C, k) => (t(), n("div", Ri, [
      l("div", Ui, [
        (t(!0), n(_, null, j(u.value, (A) => (t(), n("button", {
          key: A.id,
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40",
          disabled: e.disabled,
          title: A.label,
          "aria-label": A.label,
          onMousedown: k[0] || (k[0] = ge(() => {
          }, ["prevent"])),
          onClick: (B) => h(A)
        }, [
          (t(), n("svg", Ki, [
            l("path", {
              d: A.path
            }, null, 8, qi)
          ]))
        ], 40, Hi))), 128)),
        f.value ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40",
          disabled: e.disabled,
          title: "Link",
          "aria-label": "Link",
          onMousedown: k[1] || (k[1] = ge(() => {
          }, ["prevent"])),
          onClick: M
        }, [...k[2] || (k[2] = [
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
        ])], 40, Gi)) : b("", !0)
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
        onPaste: $
      }, null, 42, Wi),
      e.maxLength !== null ? (t(), n("div", Zi, c(v.value) + " / " + c(e.maxLength), 1)) : b("", !0)
    ]));
  }
}), Yi = /* @__PURE__ */ at(Ji, [["__scopeId", "data-v-32c63bc7"]]), Qi = ["role"], Xi = ["title"], ed = ["type", "name", "value", "checked", "disabled", "aria-label", "onChange"], td = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, nd = ["d"], ad = { key: 1 }, ld = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, qn = /* @__PURE__ */ L({
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
    const a = e, r = o, s = y(() => !!a.field.multiple), i = y(() => !!a.field.grouped), d = y(() => !!a.field.hiddenLabels), u = y(() => a.field.inline !== !1), f = y(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    );
    function v(p) {
      return s.value ? f.value.some((g) => g == p.value) : a.modelValue != null && p.value == a.modelValue;
    }
    function m(p) {
      if (!a.disabled) {
        if (s.value) {
          r(
            "update:modelValue",
            v(p) ? f.value.filter((g) => g != p.value) : [...f.value, p.value]
          );
          return;
        }
        r("update:modelValue", p.value);
      }
    }
    function h(p) {
      return a.field.colors?.[String(p.value)] ?? "primary";
    }
    function M(p) {
      const g = a.field.icons?.[String(p.value)];
      return g ? me(g) : null;
    }
    function $(p) {
      return a.field.tooltips?.[String(p.value)] ?? p.label;
    }
    const C = {
      primary: "border-primary bg-primary text-primary-foreground",
      success: "border-success bg-success text-white",
      warning: "border-warning bg-warning text-white",
      danger: "border-destructive bg-destructive text-white",
      info: "border-info bg-info text-white",
      neutral: "border-foreground bg-foreground text-background"
    }, k = {
      primary: "border-input hover:border-primary/60 hover:bg-primary/5",
      success: "border-input hover:border-success/60 hover:bg-success/5",
      warning: "border-input hover:border-warning/60 hover:bg-warning/5",
      danger: "border-input hover:border-destructive/60 hover:bg-destructive/5",
      info: "border-input hover:border-info/60 hover:bg-info/5",
      neutral: "border-input hover:border-foreground/40 hover:bg-muted"
    };
    function A(p) {
      const g = h(p), S = v(p);
      return [
        Be,
        "inline-flex items-center justify-center gap-1.5 border px-3 py-1.5 text-sm font-medium transition-colors",
        i.value ? "rounded-none first:rounded-l-md last:rounded-r-md -ml-px first:ml-0" : "rounded-md",
        S ? C[g] ?? C.primary : k[g] ?? k.primary,
        a.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      ].join(" ");
    }
    const B = y(() => {
      if (!(u.value || i.value) && a.field.columns && a.field.columns > 1)
        return { gridTemplateColumns: `repeat(${a.field.columns}, minmax(0, 1fr))` };
    }), w = y(() => i.value ? "inline-flex flex-wrap" : u.value ? "flex flex-wrap gap-2" : "grid gap-2");
    return (p, g) => (t(), n("div", {
      role: s.value ? "group" : "radiogroup",
      class: z(w.value),
      style: ie(B.value),
      "data-test": "toggle-buttons-field"
    }, [
      (t(!0), n(_, null, j(e.options, (S) => (t(), n("label", {
        key: String(S.value),
        class: z(A(S)),
        title: $(S)
      }, [
        l("input", {
          class: "sr-only",
          type: s.value ? "checkbox" : "radio",
          name: s.value ? void 0 : `f-${e.field.key}`,
          value: S.value,
          checked: v(S),
          disabled: e.disabled,
          "aria-label": d.value ? S.label : void 0,
          onChange: (F) => m(S)
        }, null, 40, ed),
        M(S) ? (t(), n("svg", td, [
          l("path", {
            d: M(S)
          }, null, 8, nd)
        ])) : b("", !0),
        d.value ? b("", !0) : (t(), n("span", ad, c(S.label), 1))
      ], 10, Xi))), 128)),
      e.options.length === 0 ? (t(), n("p", ld, " Nothing to choose from yet. ")) : b("", !0)
    ], 14, Qi));
  }
}), od = {
  key: 1,
  class: "flex flex-col gap-2"
}, sd = { class: "flex items-center justify-between gap-2" }, rd = ["for"], id = {
  key: 0,
  class: "text-destructive",
  "aria-hidden": "true"
}, dd = ["aria-label", "disabled"], ud = {
  key: 7,
  class: "flex flex-col gap-2"
}, cd = ["id", "value", "disabled"], fd = ["value"], md = {
  key: 2,
  class: "relative"
}, pd = ["disabled"], vd = {
  key: 0,
  class: "bg-popover absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md"
}, gd = { class: "max-h-56 overflow-y-auto p-1" }, hd = ["onClick"], bd = {
  key: 8,
  class: "relative"
}, yd = ["disabled", "aria-invalid"], xd = {
  key: 0,
  class: "bg-popover absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md"
}, kd = { class: "max-h-56 overflow-y-auto p-1" }, $d = {
  key: 0,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, wd = {
  key: 1,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, Cd = ["onClick"], Sd = ["id", "value", "disabled", "aria-invalid"], Md = ["value"], Bd = {
  key: 10,
  class: "flex items-center gap-2 text-sm"
}, Ad = {
  key: 11,
  class: "flex items-center gap-2 text-sm"
}, zd = ["id", "value", "rows", "placeholder", "disabled", "aria-invalid"], _d = {
  key: 0,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Pd = ["aria-label", "disabled"], Ld = ["id", "value", "rows", "placeholder", "disabled", "aria-invalid"], Od = {
  key: 2,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, jd = ["aria-label", "disabled"], Vd = ["id", "type", "value", "placeholder", "autocomplete", "min", "max", "disabled", "aria-invalid"], Dd = {
  key: 0,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Td = ["aria-label", "disabled"], Id = ["id", "type", "value", "placeholder", "autocomplete", "min", "max", "disabled", "aria-invalid"], Ed = {
  key: 2,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Fd = ["aria-label", "disabled"], Nd = {
  key: 16,
  class: "flex flex-wrap gap-1.5"
}, Rd = ["disabled", "aria-pressed", "onClick"], Ud = {
  key: 17,
  class: "flex flex-wrap gap-1.5"
}, Hd = ["title", "disabled", "onClick"], Kd = ["href"], qd = {
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
    const a = hn(() => import("./PkRepeater-J84jGe3T.js")), r = hn(() => import("./PkBuilder-DXeyw3Du.js")), s = e, i = o, d = K(!1), u = K(""), f = K([]), v = K(!1), m = K(null);
    let h;
    pe(u, (Q) => {
      s.searchOptions && (clearTimeout(h), v.value = !0, h = setTimeout(async () => {
        try {
          f.value = await s.searchOptions(Q);
        } catch {
        } finally {
          v.value = !1;
        }
      }, 200));
    });
    async function M() {
      if (!(s.processing || s.field.disabled) && (d.value = !0, f.value.length === 0 && s.searchOptions)) {
        v.value = !0;
        try {
          f.value = await s.searchOptions("");
        } finally {
          v.value = !1;
        }
      }
    }
    function $(Q) {
      m.value = Q.label, i("change", Q.value), d.value = !1, u.value = "";
    }
    function C() {
      m.value = null, i("change", null);
    }
    const k = wt("panelPicker", null), A = wt("panelCreateOption", null), B = K(!1), w = K(!1), p = K({}), g = K(null), S = y(() => ri(s.field)), F = y(() => ii(s.field));
    function D() {
      p.value = {}, g.value = null, B.value = !0, d.value = !1;
    }
    function Y() {
      w.value || (B.value = !1, p.value = {}, g.value = null);
    }
    async function G(Q) {
      if (A) {
        w.value = !0, p.value = {}, g.value = null;
        try {
          const ne = await A.run(s.field.key, { ...Q });
          $(ne), B.value = !1;
        } catch (ne) {
          ne instanceof si ? (p.value = ne.fieldErrors, g.value = Object.keys(ne.fieldErrors).length === 0 ? ne.message : null) : g.value = ne instanceof Error ? ne.message : "Could not create that option.";
        } finally {
          w.value = !1;
        }
      }
    }
    const Z = y(() => {
      if (!s.field.tableSelect || !k?.base)
        return;
      const Q = k.returnUrl || "/";
      return `${k.base}/pick/${s.field.key}?return=${encodeURIComponent(Q)}`;
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
    const P = y(() => oi(s.field.type)), J = y(
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
      e.field.type === "hidden" ? (t(), n(_, { key: 0 }, [], 64)) : (t(), n("div", od, [
        l("div", sd, [
          l("label", {
            for: `f-${e.field.key}`,
            class: z(["text-sm font-medium leading-none", { "sr-only": e.field.labelHidden }])
          }, [
            U(c(e.field.label) + " ", 1),
            e.field.required ? (t(), n("span", id, "*")) : b("", !0)
          ], 10, rd),
          e.field.hint ? (t(), n("span", {
            key: 0,
            class: z(["flex items-center gap-1", x(kt)])
          }, [
            U(c(e.field.hint) + " ", 1),
            e.field.hintAction ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "hover:text-foreground rounded px-1",
              "aria-label": e.field.hintAction.label ?? "Copy",
              disabled: e.field.disabled || e.processing,
              onClick: ne[0] || (ne[0] = (se) => V(e.field.hintAction))
            }, c(e.field.hintAction.label ?? "⧉"), 9, dd)) : b("", !0)
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
        }, null, 8, ["field", "model-value", "values", "options", "errors", "disabled"])) : e.field.type === "file" && e.upload ? (t(), T(Kn, {
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
        }, null, 8, ["model-value", "blocks", "max-blocks", "disabled", "errors"])) : e.field.type === "richtext" ? (t(), T(Yi, {
          key: 4,
          "model-value": e.value ?? null,
          toolbar: e.field.toolbar ?? ["bold", "italic", "heading", "list", "link"],
          "max-length": e.field.maxLength ?? null,
          placeholder: e.field.placeholder ?? "Write a note…",
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": ne[5] || (ne[5] = (se) => i("change", se))
        }, null, 8, ["model-value", "toolbar", "max-length", "placeholder", "disabled"])) : e.field.type === "keyvalue" ? (t(), T(Ni, {
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
        }, null, 8, ["model-value", "options", "disabled", "max", "placeholder"])) : W.value.length ? (t(), n("div", ud, [
          e.field.morphTypeSelect === "toggle-buttons" ? (t(), T(qn, {
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
            }, c(se.label), 9, fd))), 128))
          ], 42, cd)),
          H.value.type && e.searchOptions ? (t(), n("div", md, [
            l("button", {
              type: "button",
              class: z([
                "border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50",
                x(Be)
              ]),
              disabled: e.field.disabled || e.processing,
              onClick: M
            }, [
              l("span", {
                class: z(m.value || H.value.id ? "" : "text-muted-foreground")
              }, c(m.value ?? (H.value.id ? String(H.value.id) : "Search…")), 3)
            ], 10, pd),
            d.value ? (t(), n("div", vd, [
              he(l("input", {
                "onUpdate:modelValue": ne[10] || (ne[10] = (se) => u.value = se),
                type: "search",
                class: "h-9 w-full border-b bg-transparent px-3 text-sm outline-none",
                placeholder: "Type to search…",
                autofocus: ""
              }, null, 512), [
                [ze, u.value]
              ]),
              l("div", gd, [
                (t(!0), n(_, null, j(f.value, (se) => (t(), n("button", {
                  key: String(se.value),
                  type: "button",
                  class: "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
                  onClick: (Me) => X(se)
                }, c(se.label), 9, hd))), 128))
              ])
            ])) : b("", !0),
            d.value ? (t(), n("div", {
              key: 1,
              class: "fixed inset-0 z-40",
              onClick: ne[11] || (ne[11] = (se) => d.value = !1)
            })) : b("", !0)
          ])) : b("", !0)
        ])) : e.field.type === "select" && e.searchOptions ? (t(), n("div", bd, [
          l("button", {
            type: "button",
            class: z([
              "border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50",
              x(Be)
            ]),
            disabled: e.field.disabled || e.processing,
            "aria-invalid": !!e.error,
            onClick: M
          }, [
            l("span", {
              class: z(m.value || e.value ? "" : "text-muted-foreground")
            }, c(m.value ?? (e.value ? String(e.value) : "Search…")), 3),
            e.value ? (t(), n("span", {
              key: 0,
              class: "text-muted-foreground hover:text-foreground ml-2 text-xs",
              role: "button",
              "aria-label": "Clear selection",
              onClick: ge(C, ["stop"])
            }, " ✕ ")) : b("", !0)
          ], 10, yd),
          d.value ? (t(), n("div", xd, [
            he(l("input", {
              "onUpdate:modelValue": ne[12] || (ne[12] = (se) => u.value = se),
              type: "search",
              class: "h-9 w-full border-b bg-transparent px-3 text-sm outline-none",
              placeholder: "Type to search…",
              autofocus: ""
            }, null, 512), [
              [ze, u.value]
            ]),
            l("div", kd, [
              v.value ? (t(), n("p", $d, " Searching… ")) : f.value.length === 0 ? (t(), n("p", wd, " No matches ")) : b("", !0),
              (t(!0), n(_, null, j(f.value, (se) => (t(), n("button", {
                key: String(se.value),
                type: "button",
                class: "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
                onClick: (Me) => $(se)
              }, c(se.label), 9, Cd))), 128)),
              e.field.createOption && x(A) ? (t(), n("button", {
                key: 2,
                type: "button",
                class: "text-primary hover:bg-accent mt-1 flex w-full items-center gap-1.5 rounded border-t px-2 py-2 text-left text-sm font-medium",
                onClick: D
              }, [
                ne[26] || (ne[26] = l("span", { "aria-hidden": "true" }, "+", -1)),
                U(" " + c(F.value), 1)
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
          }, c(se.label), 9, Md))), 128))
        ], 42, Sd)) : e.field.type === "toggle" ? (t(), n("label", Bd, [
          I(x(Je), {
            id: `f-${e.field.key}`,
            "model-value": !!e.value,
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": ne[15] || (ne[15] = (se) => i("change", se))
          }, null, 8, ["id", "model-value", "disabled"]),
          l("span", {
            class: z(x(kt))
          }, c(e.field.help ?? "Enabled"), 3)
        ])) : e.field.type === "checkbox" ? (t(), n("label", Ad, [
          I(x(ci), {
            id: `f-${e.field.key}`,
            "model-value": !!e.value,
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": ne[16] || (ne[16] = (se) => i("change", se === !0))
          }, null, 8, ["id", "model-value", "disabled"]),
          l("span", {
            class: z(x(kt))
          }, c(e.field.help ?? e.field.label), 3)
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
        }, null, 42, zd)) : e.field.type === "textarea" ? (t(), n("div", {
          key: 13,
          class: z([
            "border-input flex overflow-hidden rounded-md border",
            x(xn),
            { "opacity-50": e.field.disabled || e.processing }
          ])
        }, [
          e.field.prefix || e.field.prefixIcon ? (t(), n("span", _d, c(e.field.prefix ?? e.field.prefixIcon), 1)) : b("", !0),
          e.field.prefixAction ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.prefixAction.label ?? "Action",
            disabled: e.field.disabled || e.processing,
            onClick: ne[18] || (ne[18] = (se) => V(e.field.prefixAction))
          }, c(e.field.prefixAction.label ?? "⧉"), 9, Pd)) : b("", !0),
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
          }, null, 42, Ld),
          e.field.suffix || e.field.suffixIcon ? (t(), n("span", Od, c(e.field.suffix ?? e.field.suffixIcon), 1)) : b("", !0),
          e.field.suffixAction ? (t(), n("button", {
            key: 3,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.suffixAction.label ?? "Copy",
            disabled: e.field.disabled || e.processing,
            onClick: ne[20] || (ne[20] = (se) => V(e.field.suffixAction))
          }, c(e.field.suffixAction.label ?? "⧉"), 9, jd)) : b("", !0)
        ], 2)) : J.value ? (t(), n("div", {
          key: 15,
          class: z([
            "border-input flex h-9 overflow-hidden rounded-md border",
            x(xn),
            { "opacity-50": e.field.disabled || e.processing }
          ])
        }, [
          e.field.prefix || e.field.prefixIcon ? (t(), n("span", Dd, c(e.field.prefix ?? e.field.prefixIcon), 1)) : b("", !0),
          e.field.prefixAction ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.prefixAction.label ?? "Action",
            disabled: e.field.disabled || e.processing,
            onClick: ne[22] || (ne[22] = (se) => V(e.field.prefixAction))
          }, c(e.field.prefixAction.label ?? "⧉"), 9, Td)) : b("", !0),
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
          }, null, 40, Id),
          e.field.suffix || e.field.suffixIcon ? (t(), n("span", Ed, c(e.field.suffix ?? e.field.suffixIcon), 1)) : b("", !0),
          e.field.suffixAction ? (t(), n("button", {
            key: 3,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.suffixAction.label ?? "Copy",
            disabled: e.field.disabled || e.processing,
            onClick: ne[24] || (ne[24] = (se) => V(e.field.suffixAction))
          }, c(e.field.suffixAction.label ?? "⧉"), 9, Fd)) : b("", !0)
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
        }, null, 40, Vd)),
        e.field.type === "number" && e.field.presets?.length ? (t(), n("div", Nd, [
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
          }, c(se), 11, Rd))), 128))
        ])) : b("", !0),
        e.field.type === "textarea" && e.field.chips && Object.keys(e.field.chips).length ? (t(), n("div", Ud, [
          (t(!0), n(_, null, j(e.field.chips, (se, Me) => (t(), n("button", {
            key: Me,
            type: "button",
            title: se,
            disabled: e.field.disabled || e.processing,
            class: "border-input hover:bg-muted rounded-md border px-2 py-1 font-mono text-xs transition-colors disabled:opacity-50",
            onClick: (vn) => le(String(Me))
          }, c(Me), 9, Hd))), 128))
        ])) : b("", !0),
        Z.value ? (t(), n("a", {
          key: 18,
          href: Z.value,
          class: "text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
        }, " Browse ", 8, Kd)) : b("", !0),
        e.error ? (t(), n("p", qd, c(e.error), 1)) : e.field.help && e.field.type !== "toggle" ? (t(), n("p", {
          key: 20,
          class: z(x(kt))
        }, c(e.field.help), 3)) : b("", !0)
      ])),
      e.field.createOption && x(A) ? (t(), T(mi, {
        key: 2,
        open: B.value,
        title: S.value,
        description: e.field.help ?? void 0,
        fields: e.field.createOption,
        processing: w.value,
        errors: p.value,
        "general-error": g.value,
        onClose: Y,
        onSubmit: G
      }, null, 8, ["open", "title", "description", "fields", "processing", "errors", "general-error"])) : b("", !0)
    ], 64));
  }
}), Gd = { class: "flex min-w-0 items-start gap-2.5" }, Wd = {
  key: 0,
  class: "bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
  "aria-hidden": "true"
}, Zd = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "size-3.5"
}, Jd = ["d"], Yd = { class: "min-w-0" }, Qd = { class: "text-sm font-semibold" }, Xd = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, eu = {
  key: 2,
  class: "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10"
}, tu = { class: "border-b px-4 py-3.5 sm:px-5" }, nu = { class: "text-sm font-semibold" }, au = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, lu = {
  key: 4,
  class: "min-w-0 space-y-4"
}, ou = {
  key: 7,
  class: "flex flex-col gap-3"
}, su = { class: "text-sm font-medium" }, ru = {
  key: 0,
  class: "text-muted-foreground -mt-2 text-sm"
}, iu = {
  key: 0,
  class: "mb-1 font-medium"
}, du = ["aria-selected", "onClick"], uu = {
  key: 1,
  class: "bg-destructive size-1.5 rounded-full",
  "aria-label": "has errors"
}, cu = { class: "flex items-center justify-between gap-3 border-t p-4" }, fu = ["disabled"], mu = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(!a.node.collapsed);
    function i() {
      const g = a.node.persistInQueryString;
      if (!g || typeof window > "u")
        return 0;
      const S = new URLSearchParams(window.location.search).get(g), F = S === null ? NaN : Number.parseInt(S, 10), D = a.node.children?.length ?? 0;
      return Number.isInteger(F) && F >= 0 && F < D ? F : 0;
    }
    const d = K(a.node.component === "tabs" ? i() : 0), u = K(a.node.component === "wizard" ? i() : 0);
    function f(g, S) {
      if (!g || typeof window > "u")
        return;
      const F = new URL(window.location.href);
      F.searchParams.set(g, String(S)), window.history.replaceState(window.history.state, "", F);
    }
    pe(d, (g) => f(a.node.persistInQueryString, g)), pe(u, (g) => f(a.node.persistInQueryString, g));
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
      }, S = { sm: "gap-2", md: "gap-4", lg: "gap-6" };
      return [
        g[a.node.align ?? "start"] ?? "items-start",
        S[a.node.gap ?? "md"] ?? "gap-4",
        a.node.wrap === !1 ? "flex-nowrap" : "flex-wrap"
      ];
    }), M = y(() => {
      const g = {
        info: "border-border bg-muted/50 text-foreground",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
        danger: "border-destructive/30 bg-destructive/10 text-destructive"
      };
      return g[a.node.tone ?? "info"] ?? g.info;
    }), $ = y(() => {
      const g = a.node.columns, S = typeof g == "number" ? g : g?.default ?? g?.sm ?? g?.md ?? 1;
      return S >= 3 ? "sm:grid-cols-3" : S === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
    });
    function C(g) {
      const S = g.children?.length ?? 1;
      return S >= 3 ? "md:grid-cols-3" : S === 2 ? "md:grid-cols-2" : "md:grid-cols-1";
    }
    function k(g) {
      const S = g.columns, F = typeof S == "number" ? { default: S } : S, D = {};
      for (const Y of ["default", "sm", "md", "lg", "xl", "2xl"]) {
        const G = F?.[Y];
        typeof G == "number" && G > 0 && (D[`--pk-grid-cols-${Y}`] = String(Math.min(12, Math.max(1, G))));
      }
      return D;
    }
    function A(g = 1) {
      return g >= 4 ? "md:col-span-4" : g === 3 ? "md:col-span-3" : g === 2 ? "md:col-span-2" : "md:col-span-1";
    }
    function B(g) {
      const S = [], F = (D) => {
        D.component === "field" && D.key && S.push(D.key), D.children?.forEach(F);
      };
      return F(g), S.some((D) => a.errors[D]);
    }
    function w(g) {
      if (g.hidden)
        return !1;
      const S = g.visibleWhen;
      return S ? a.values[S.field] == S.value : !0;
    }
    function p(g) {
      if (a.upload)
        return (S, F) => a.upload(g, S, F);
    }
    return (g, S) => {
      const F = Qt("SchemaNode", !0);
      return e.node.component === "field" && w(e.node) ? (t(), T(We, {
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
        onChange: S[0] || (S[0] = (D) => r("change", e.node.key, D)),
        onAffixAction: S[1] || (S[1] = (D) => r("affix-action", e.node.key, D))
      }, null, 8, ["field", "value", "values", "error", "errors", "options", "child-options", "processing", "search-options", "upload", "discard"])) : e.node.component === "section" && w(e.node) ? (t(), n("section", {
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
          onClick: S[2] || (S[2] = (D) => e.node.collapsible && (s.value = !s.value))
        }, [
          l("div", Gd, [
            e.node.icon ? (t(), n("div", Wd, [
              (t(), n("svg", Zd, [
                l("path", {
                  d: x(me)(e.node.icon)
                }, null, 8, Jd)
              ]))
            ])) : b("", !0),
            l("div", Yd, [
              l("h3", Qd, c(e.node.label), 1),
              e.node.description ? (t(), n("p", Xd, c(e.node.description), 1)) : b("", !0)
            ])
          ]),
          e.node.collapsible ? (t(), n("svg", {
            key: 0,
            viewBox: "0 0 24 24",
            class: z(["text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform", s.value ? "rotate-180" : ""]),
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5"
          }, [...S[24] || (S[24] = [
            l("path", { d: "m6 9 6 6 6-6" }, null, -1)
          ])], 2)) : b("", !0)
        ], 2),
        s.value ? (t(), n("div", {
          key: 0,
          class: z(["grid grid-cols-1 gap-4", [$.value, m.value ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""]])
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
              onChange: S[3] || (S[3] = (G, Z) => r("change", G, Z)),
              onAffixAction: S[4] || (S[4] = (G, Z) => r("affix-action", G, Z))
            }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"])
          ], 2))), 128))
        ], 2)) : b("", !0)
      ], 2)) : e.node.component === "card" && w(e.node) ? (t(), n("section", eu, [
        l("header", tu, [
          l("h3", nu, c(e.node.title), 1),
          e.node.description ? (t(), n("p", au, c(e.node.description), 1)) : b("", !0)
        ]),
        l("div", {
          class: z(["grid grid-cols-1 gap-4 px-4 py-4", $.value])
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
            onChange: S[5] || (S[5] = (G, Z) => r("change", G, Z)),
            onAffixAction: S[6] || (S[6] = (G, Z) => r("affix-action", G, Z))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)
      ])) : e.node.component === "columns" && w(e.node) ? (t(), n("div", {
        key: 3,
        class: z(["grid grid-cols-1 gap-4", C(e.node)])
      }, [
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => (t(), n("div", {
          key: Y,
          class: z(D.component === "column" ? A(D.span) : "")
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
            onChange: S[7] || (S[7] = (G, Z) => r("change", G, Z)),
            onAffixAction: S[8] || (S[8] = (G, Z) => r("affix-action", G, Z))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"])
        ], 2))), 128))
      ], 2)) : e.node.component === "column" && w(e.node) ? (t(), n("div", lu, [
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
          onChange: S[9] || (S[9] = (G, Z) => r("change", G, Z)),
          onAffixAction: S[10] || (S[10] = (G, Z) => r("affix-action", G, Z))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ])) : e.node.component === "grid" && w(e.node) ? (t(), n("div", {
        key: 5,
        class: "pk-responsive-grid grid gap-4",
        style: ie(k(e.node))
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
          onChange: S[11] || (S[11] = (G, Z) => r("change", G, Z)),
          onAffixAction: S[12] || (S[12] = (G, Z) => r("affix-action", G, Z))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ], 4)) : e.node.component === "flex" && w(e.node) ? (t(), n("div", {
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
          onChange: S[13] || (S[13] = (G, Z) => r("change", G, Z)),
          onAffixAction: S[14] || (S[14] = (G, Z) => r("affix-action", G, Z))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ], 2)) : e.node.component === "fieldset" && w(e.node) ? (t(), n("fieldset", ou, [
        l("legend", su, c(e.node.label), 1),
        e.node.description ? (t(), n("p", ru, c(e.node.description), 1)) : b("", !0),
        l("div", {
          class: z(["grid grid-cols-1 gap-4", $.value])
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
            onChange: S[15] || (S[15] = (G, Z) => r("change", G, Z)),
            onAffixAction: S[16] || (S[16] = (G, Z) => r("affix-action", G, Z))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)
      ])) : e.node.component === "callout" && w(e.node) ? (t(), n("div", {
        key: 8,
        role: "note",
        class: z(["rounded-lg border px-4 py-3 text-sm", M.value])
      }, [
        e.node.title ? (t(), n("p", iu, c(e.node.title), 1)) : b("", !0),
        l("p", null, c(e.node.body), 1)
      ], 2)) : e.node.component === "tabs" && w(e.node) ? (t(), n("div", {
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
            U(c(D.label) + " ", 1),
            D.badge !== null && D.badge !== void 0 ? (t(), T(Ie, {
              key: 0,
              variant: "secondary"
            }, {
              default: O(() => [
                U(c(D.badge), 1)
              ]),
              _: 2
            }, 1024)) : b("", !0),
            B(D) ? (t(), n("span", uu)) : b("", !0)
          ], 10, du))), 128))
        ], 2),
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => he((t(), n("div", {
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
            onChange: S[17] || (S[17] = (W, H) => r("change", W, H)),
            onAffixAction: S[18] || (S[18] = (W, H) => r("affix-action", W, H))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)), [
          [qe, d.value === Y]
        ])), 128))
      ], 2)) : e.node.component === "wizard" && w(e.node) ? (t(), n("div", {
        key: 10,
        class: z(
          m.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        I(ni, {
          class: z(["p-4", m.value ? "border-b" : ""]),
          steps: v.value,
          "active-step": u.value,
          "has-error": (D) => B((e.node.children ?? [])[D]),
          "onUpdate:activeStep": S[19] || (S[19] = (D) => u.value = D)
        }, null, 8, ["class", "steps", "active-step", "has-error"]),
        (t(!0), n(_, null, j(e.node.children ?? [], (D, Y) => he((t(), n("div", {
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
            onChange: S[20] || (S[20] = (W, H) => r("change", W, H)),
            onAffixAction: S[21] || (S[21] = (W, H) => r("affix-action", W, H))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)), [
          [qe, u.value === Y]
        ])), 128)),
        l("div", cu, [
          l("button", {
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-sm transition-colors disabled:pointer-events-none disabled:opacity-40",
            disabled: u.value === 0,
            onClick: S[22] || (S[22] = (D) => u.value--)
          }, " Back ", 8, fu),
          u.value < (e.node.children ?? []).length - 1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm transition-opacity hover:opacity-90",
            onClick: S[23] || (S[23] = (D) => u.value++)
          }, " Next ")) : b("", !0)
        ])
      ], 2)) : b("", !0);
    };
  }
}), Gn = /* @__PURE__ */ at(mu, [["__scopeId", "data-v-f2c53774"]]), R8 = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K({});
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
      onClose: u[2] || (u[2] = (f) => r("close"))
    }, {
      footer: O(() => [
        I(ce, {
          variant: "ghost",
          size: "sm",
          disabled: e.processing,
          onClick: u[1] || (u[1] = (f) => r("close"))
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
            U(c(e.processing ? "Saving…" : e.title), 1)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: O(() => [
        l("form", {
          class: "flex flex-col gap-4",
          onSubmit: ge(i, ["prevent"])
        }, [
          (t(!0), n(_, null, j(e.form?.nodes ?? [], (f, v) => (t(), T(Gn, {
            key: v,
            node: f,
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
}), pu = ["title"], vu = ["aria-label"], gu = ["d"], hu = { class: "sr-only" }, bu = /* @__PURE__ */ L({
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
    }, s = y(() => typeof o.value == "boolean" ? o.value ? "1" : "" : o.value === null || o.value === void 0 ? "" : String(o.value)), i = y(() => o.icons[s.value] ?? o.defaultIcon), d = y(() => a[i.value] ?? a.dot), u = y(() => r[o.colors[s.value] ?? "neutral"] ?? r.neutral), f = y(() => o.labels[s.value] ?? String(o.value ?? "-"));
    return (v, m) => (t(), n("span", {
      class: "inline-flex items-center",
      title: f.value
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
        "aria-label": f.value
      }, [
        l("path", { d: d.value }, null, 8, gu)
      ], 10, vu)),
      l("span", hu, c(f.value), 1)
    ], 8, pu));
  }
}), yu = ["aria-label"], xu = ["fill"], U8 = /* @__PURE__ */ L({
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
        }, null, 8, xu)
      ]))), 128))
    ], 8, yu));
  }
}), ku = ["src"], $u = {
  key: 2,
  viewBox: "0 0 24 24",
  class: "size-1/2",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, wu = /* @__PURE__ */ L({
  __name: "ImageCell",
  props: {
    src: {},
    fallbackText: {},
    rounded: { type: Boolean, default: !0 },
    size: { default: "md" },
    fallback: { default: "initials" }
  },
  setup(e) {
    const o = e, a = K(!1);
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
        onError: u[0] || (u[0] = (f) => a.value = !0)
      }, null, 40, ku)) : e.fallback === "initials" ? (t(), n(_, { key: 1 }, [
        U(c(i.value), 1)
      ], 64)) : e.fallback === "icon" ? (t(), n("svg", $u, [...u[1] || (u[1] = [
        l("path", { d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" }, null, -1)
      ])])) : b("", !0)
    ], 2));
  }
}), Cu = {
  key: 0,
  class: "text-muted-foreground"
}, Su = {
  key: 1,
  class: "inline-flex items-center gap-2"
}, Mu = {
  key: 0,
  class: "font-mono text-xs"
}, Bu = {
  key: 1,
  class: "sr-only"
}, Au = /* @__PURE__ */ L({
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
    return (s, i) => r.value === null ? (t(), n("span", Cu, "-")) : (t(), n("span", Su, [
      l("span", {
        class: "size-4 shrink-0 rounded border",
        style: ie({ backgroundColor: r.value }),
        "aria-hidden": "true"
      }, null, 4),
      e.showValue ? (t(), n("span", Mu, c(r.value), 1)) : (t(), n("span", Bu, c(r.value), 1))
    ]));
  }
}), zu = { class: "inline-flex items-center" }, _u = ["checked", "aria-label"], Pu = { class: "sr-only" }, H8 = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("span", zu, [
      l("input", {
        type: "checkbox",
        checked: a.value,
        disabled: "",
        "aria-readonly": "true",
        "aria-label": r.value,
        class: "border-input text-primary size-4 rounded disabled:opacity-100"
      }, null, 8, _u),
      l("span", Pu, c(r.value), 1)
    ]));
  }
}), Lu = {
  key: 0,
  class: "text-muted-foreground"
}, Ou = {
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
    return (r, s) => a.value ? (t(), n("code", Ou, c(a.value), 1)) : (t(), n("span", Lu, "—"));
  }
}), ju = {
  key: 0,
  class: "font-mono text-xs"
}, Vu = {
  key: 1,
  class: "text-muted-foreground"
}, Du = {
  key: 2,
  class: "text-muted-foreground text-sm font-normal"
}, q8 = /* @__PURE__ */ L({
  __name: "KeyValueCell",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, a = y(
      () => o.value && typeof o.value == "object" && !Array.isArray(o.value) ? Object.keys(o.value) : null
    );
    return (r, s) => a.value === null && e.value != null ? (t(), n("span", ju, c(e.value), 1)) : !a.value || a.value.length === 0 ? (t(), n("span", Vu, "—")) : (t(), n("span", Du, c(a.value.length) + " " + c(a.value.length === 1 ? "entry" : "entries"), 1));
  }
}), Tu = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Iu = {
  key: 1,
  class: "inline-flex flex-wrap items-center gap-1"
}, G8 = /* @__PURE__ */ L({
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
        return d.map((f) => f == null ? "" : String(f).trim()).filter((f) => f !== "");
      if (typeof d == "string") {
        const f = d.trim();
        if (f.startsWith("["))
          try {
            const v = JSON.parse(f);
            if (Array.isArray(v))
              return a(v, u);
          } catch {
          }
        return f.split(u).map((v) => v.trim()).filter((v) => v !== "");
      }
      return [String(d)];
    }
    const r = y(() => a(o.value, o.separator)), s = y(() => o.limit === null || o.limit === void 0 || o.limit < 1 ? r.value : r.value.slice(0, o.limit)), i = y(() => Math.max(0, r.value.length - s.value.length));
    return (d, u) => r.value.length === 0 ? (t(), n("span", Tu, "None")) : (t(), n("span", Iu, [
      (t(!0), n(_, null, j(s.value, (f) => (t(), T(Ie, {
        key: f,
        variant: "secondary"
      }, {
        default: O(() => [
          U(c(f), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      i.value > 0 ? (t(), T(Ie, {
        key: 0,
        variant: "outline"
      }, {
        default: O(() => [
          U("+" + c(i.value), 1)
        ]),
        _: 1
      })) : b("", !0)
    ]));
  }
}), Eu = ["aria-checked", "aria-label", "title", "disabled"], Fu = ["value", "placeholder", "disabled"], Nu = ["value", "disabled"], Ru = ["value"], W8 = /* @__PURE__ */ L({
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
    function f(M) {
      const $ = M.target.value;
      $ !== String(a.value ?? "") && r("change", $);
    }
    function v(M) {
      const C = M.target.value;
      C !== String(a.value ?? "") && r("change", C);
    }
    function m(M) {
      M.target.blur();
    }
    function h(M) {
      const $ = M.target;
      $.value = String(a.value ?? ""), $.blur();
    }
    return (M, $) => e.type === "toggle" ? (t(), n("button", {
      key: 0,
      type: "button",
      role: "switch",
      "aria-checked": s.value,
      "aria-label": d.value,
      title: d.value,
      disabled: i.value,
      class: z(["relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50", s.value ? "bg-primary" : "bg-muted-foreground/30"]),
      onClick: ge(u, ["stop"])
    }, [
      l("span", {
        class: z(["bg-background size-4 rounded-full shadow-sm transition-transform", s.value ? "translate-x-4.5" : "translate-x-0.5"])
      }, null, 2)
    ], 10, Eu)) : e.type === "text" ? (t(), n("input", {
      key: 1,
      type: "text",
      class: "bg-background hover:bg-accent focus:ring-ring w-full min-w-28 rounded-md border px-2 py-1 text-xs transition-colors focus:ring-2 focus:outline-none disabled:opacity-50",
      value: String(e.value ?? ""),
      placeholder: e.placeholder ?? void 0,
      disabled: i.value,
      onClick: $[0] || ($[0] = ge(() => {
      }, ["stop"])),
      onBlur: v,
      onKeydown: [
        Ct(m, ["enter"]),
        Ct(h, ["esc"])
      ]
    }, null, 40, Fu)) : (t(), n("select", {
      key: 2,
      class: "bg-background hover:bg-accent focus:ring-ring w-full min-w-28 rounded-md border px-2 py-1 text-xs transition-colors focus:ring-2 focus:outline-none disabled:opacity-50",
      value: String(e.value ?? ""),
      disabled: i.value,
      onClick: $[1] || ($[1] = ge(() => {
      }, ["stop"])),
      onChange: f
    }, [
      (t(!0), n(_, null, j(e.options, (C, k) => (t(), n("option", {
        key: k,
        value: k
      }, c(C), 9, Ru))), 128))
    ], 40, Nu));
  }
}), dn = {
  success: "success",
  danger: "destructive",
  warning: "warning",
  info: "info",
  neutral: "outline"
};
function Uu(e) {
  return e != null && e !== "";
}
function Hu(e) {
  const o = [];
  return e.type === "toggle" || e.type === "select" || e.type === "image" ? (e.align === "right" && o.push("text-right"), e.align === "center" && o.push("text-center"), o.join(" ")) : (e.key === "name" && o.push("font-medium"), e.mono && o.push("font-mono text-xs"), e.muted && o.push("text-muted-foreground"), e.transform === "upper" && o.push("uppercase"), e.transform === "lower" && o.push("lowercase"), e.align === "right" && o.push("text-right"), e.align === "center" && o.push("text-center"), o.join(" "));
}
function Z8(e) {
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
      cellClass: Hu(s),
      group: s.group
    }))
  ), a = y(() => Object.fromEntries(e.value.map((s) => [s.key, s])));
  function r(s, i) {
    const d = a.value[s];
    if (!d)
      return "outline";
    const u = typeof i == "boolean" ? i ? "1" : "" : String(i), f = d.colors?.[u] ?? d.defaultColor ?? "neutral";
    return dn[f] ?? "outline";
  }
  return { columns: o, byKey: a, badgeVariant: r };
}
const Ku = ["disabled", "aria-label", "aria-busy"], qu = {
  class: "text-muted-foreground size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Gu = ["d"], Wu = { class: "text-muted-foreground px-2 py-1.5 text-xs font-medium" }, Zu = ["disabled", "onClick"], Ju = {
  key: 0,
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-label": "Current"
}, Yu = ["d"], Qu = {
  key: 1,
  class: "size-4 shrink-0",
  "aria-hidden": "true"
}, J8 = /* @__PURE__ */ L({
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
    function f(h) {
      const M = a.colors[u(h)] ?? a.defaultColor ?? "neutral";
      return dn[M] ?? "outline";
    }
    function v(h) {
      return a.options[h] ?? h;
    }
    function m(h, M) {
      if (s.value || h === i.value) {
        M();
        return;
      }
      r("change", h), M();
    }
    return (h, M) => (t(), n("div", {
      onClick: M[0] || (M[0] = ge(() => {
      }, ["stop"]))
    }, [
      e.disabled ? (t(), T(Ie, {
        key: 1,
        variant: f(e.value),
        soft: e.soft,
        class: "capitalize"
      }, {
        default: O(() => [
          U(c(v(i.value) || "-"), 1)
        ]),
        _: 1
      }, 8, ["variant", "soft"])) : (t(), T(Ke, {
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
              variant: f(e.value),
              soft: e.soft,
              class: "capitalize"
            }, {
              default: O(() => [
                U(c(v(i.value) || "-"), 1)
              ]),
              _: 1
            }, 8, ["variant", "soft"]),
            (t(), n("svg", qu, [
              l("path", {
                d: x(me)("chevron-down")
              }, null, 8, Gu)
            ]))
          ], 8, Ku)
        ]),
        panel: O(({ close: $ }) => [
          l("div", Wu, c(d.value), 1),
          (t(!0), n(_, null, j(e.options, (C, k) => (t(), n("button", {
            key: k,
            type: "button",
            role: "menuitem",
            class: "hover:bg-accent flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-left disabled:opacity-50",
            disabled: s.value,
            onClick: (A) => m(String(k), $)
          }, [
            I(Ie, {
              variant: f(k),
              soft: e.soft,
              class: "capitalize"
            }, {
              default: O(() => [
                U(c(C), 1)
              ]),
              _: 2
            }, 1032, ["variant", "soft"]),
            String(k) === i.value ? (t(), n("svg", Ju, [
              l("path", {
                d: x(me)("check")
              }, null, 8, Yu)
            ])) : (t(), n("span", Qu))
          ], 8, Zu))), 128))
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
function Xu(e) {
  return kn[e ?? "gray"] ?? kn.gray;
}
const ec = { class: "flex items-center justify-end" }, tc = ["aria-label"], nc = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, ac = ["d"], lc = ["href"], oc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, sc = ["d"], rc = { class: "min-w-0 flex-1 truncate" }, ic = ["disabled", "onClick"], dc = ["d"], uc = { class: "min-w-0 flex-1 truncate" }, cc = {
  key: 0,
  class: "mt-0.5 border-t pt-0.5"
}, fc = ["disabled", "onClick"], mc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, pc = ["d"], vc = { class: "min-w-0 flex-1 truncate" }, gc = /* @__PURE__ */ L({
  __name: "RecordActions",
  props: {
    groups: {},
    title: {},
    busy: { default: null }
  },
  emits: ["run"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = K(null), d = K(null), u = y(() => r.groups.flatMap((B) => B.actions)), f = y(() => u.value.filter((B) => !B.destructive)), v = y(() => u.value.filter((B) => B.destructive));
    function m(B) {
      return Xu(B.color);
    }
    const h = y(() => u.value.length === 0);
    function M(B) {
      s("run", B);
    }
    function $(B) {
      if (r.busy !== B.key) {
        if (B.link) {
          B.url && window.location.assign(B.url);
          return;
        }
        M(B);
      }
    }
    function C(B, w) {
      const p = w.toLowerCase().split("+").map((F) => F.trim()), g = p.at(-1);
      return !g || B.key.toLowerCase() !== g ? !1 : (B.ctrlKey || B.metaKey) === p.includes("mod") && B.shiftKey === p.includes("shift") && B.altKey === p.includes("alt");
    }
    function k(B) {
      h.value || (B.preventDefault(), i.value?.openAt(B.clientX, B.clientY));
    }
    function A(B) {
      const w = u.value.find(
        (D) => (D.keyBindings ?? []).some((Y) => C(B, Y))
      );
      if (w) {
        B.preventDefault(), $(w);
        return;
      }
      if (B.key !== "ArrowDown" && B.key !== "ArrowUp")
        return;
      const p = Array.from(
        d.value?.querySelectorAll("[data-menu-item]") ?? []
      );
      if (p.length === 0)
        return;
      B.preventDefault();
      const g = p.indexOf(document.activeElement), S = B.key === "ArrowDown" ? 1 : -1, F = (g + S + p.length) % p.length;
      p[F]?.focus();
    }
    return o({ openContextMenu: k }), (B, w) => (t(), n("div", ec, [
      h.value ? b("", !0) : (t(), T(Ke, {
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
            (t(), n("svg", nc, [
              l("path", {
                d: x(me)("more-vertical")
              }, null, 8, ac)
            ]))
          ], 8, tc)
        ]),
        panel: O(() => [
          l("div", {
            ref_key: "items",
            ref: d,
            class: "py-0.5",
            onKeydown: A
          }, [
            (t(!0), n(_, null, j(f.value, (p) => (t(), n(_, {
              key: p.key
            }, [
              p.link ? (t(), n("a", {
                key: 0,
                href: p.url ?? "#",
                "data-menu-item": "",
                role: "menuitem",
                class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none", m(p)])
              }, [
                (t(), n("svg", oc, [
                  l("path", {
                    d: x(Te)(p)
                  }, null, 8, sc)
                ])),
                l("span", rc, c(p.label), 1)
              ], 10, lc)) : (t(), n("button", {
                key: 1,
                type: "button",
                "data-menu-item": "",
                role: "menuitem",
                class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50", m(p)]),
                disabled: e.busy === p.key,
                onClick: (g) => M(p)
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
                  }, null, 8, dc)
                ], 2)),
                l("span", uc, c(p.label), 1)
              ], 10, ic))
            ], 64))), 128)),
            v.value.length ? (t(), n("div", cc, [
              (t(!0), n(_, null, j(v.value, (p) => (t(), n("button", {
                key: p.key,
                type: "button",
                "data-menu-item": "",
                role: "menuitem",
                class: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                disabled: e.busy === p.key,
                onClick: (g) => M(p)
              }, [
                (t(), n("svg", mc, [
                  l("path", {
                    d: x(Te)({ ...p, destructive: !0 })
                  }, null, 8, pc)
                ])),
                l("span", vc, c(p.label), 1)
              ], 8, fc))), 128))
            ])) : b("", !0)
          ], 544)
        ]),
        _: 1
      }, 512))
    ]));
  }
}), hc = { class: "flex items-center justify-end gap-1" }, bc = { class: "hidden items-center gap-1 sm:flex" }, yc = ["href"], xc = {
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, kc = ["d"], $c = ["disabled", "onClick"], wc = ["d"], Cc = {
  type: "button",
  class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors",
  "aria-haspopup": "menu"
}, Sc = {
  key: 0,
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Mc = ["d"], Bc = { class: "py-0.5" }, Ac = ["href"], zc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, _c = ["d"], Pc = { class: "min-w-0 flex-1 truncate" }, Lc = ["disabled", "onClick"], Oc = ["d"], jc = { class: "min-w-0 flex-1 truncate" }, Y8 = /* @__PURE__ */ L({
  __name: "InlineRecordActions",
  props: {
    groups: {},
    title: {},
    busy: { default: null }
  },
  emits: ["run"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = K(null), d = y(() => r.groups.filter((B) => !B.label)), u = y(() => r.groups.filter((B) => B.label)), f = y(() => d.value.flatMap((B) => B.actions)), v = y(() => f.value.filter((B) => !B.destructive)), m = y(() => f.value.filter((B) => B.destructive)), h = y(() => r.groups.every((B) => B.actions.length === 0)), M = {
      primary: "text-primary",
      gray: "text-muted-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-500",
      danger: "text-destructive",
      info: "text-sky-600 dark:text-sky-400"
    };
    function $(B) {
      return M[B.color ?? "gray"] ?? M.gray;
    }
    function C(B) {
      s("run", B);
    }
    function k(B) {
      r.busy !== B.key && C(B);
    }
    function A(B) {
      h.value || i.value?.openContextMenu(B);
    }
    return o({ openContextMenu: A }), (B, w) => (t(), n("div", hc, [
      l("div", bc, [
        (t(!0), n(_, null, j([...v.value, ...m.value], (p) => (t(), n(_, {
          key: p.key
        }, [
          p.link ? (t(), n("a", {
            key: 0,
            href: p.url ?? "#",
            class: z(["hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors", $(p)])
          }, [
            (t(), n("svg", xc, [
              l("path", {
                d: x(Te)(p)
              }, null, 8, kc)
            ])),
            l("span", null, c(p.label), 1)
          ], 10, yc)) : (t(), n("button", {
            key: 1,
            type: "button",
            class: z(["hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50", $(p)]),
            disabled: e.busy === p.key,
            onClick: (g) => k(p)
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
              }, null, 8, wc)
            ], 2)),
            l("span", null, c(p.label), 1)
          ], 10, $c))
        ], 64))), 128)),
        (t(!0), n(_, null, j(u.value, (p) => (t(), T(Ke, {
          key: p.label,
          align: "end",
          placement: "left"
        }, {
          trigger: O(() => [
            l("button", Cc, [
              p.icon ? (t(), n("svg", Sc, [
                l("path", {
                  d: x(me)(p.icon)
                }, null, 8, Mc)
              ])) : b("", !0),
              l("span", null, c(p.label), 1)
            ])
          ]),
          panel: O(() => [
            l("div", Bc, [
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
                  class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none", g.destructive ? "text-destructive" : $(g)])
                }, [
                  (t(), n("svg", zc, [
                    l("path", {
                      d: x(Te)(g)
                    }, null, 8, _c)
                  ])),
                  l("span", Pc, c(g.label), 1)
                ], 10, Ac)) : (t(), n("button", {
                  key: 1,
                  type: "button",
                  role: "menuitem",
                  class: z([
                    "hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    g.destructive ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10" : $(g)
                  ]),
                  disabled: e.busy === g.key,
                  onClick: (S) => C(g)
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
                    }, null, 8, Oc)
                  ], 2)),
                  l("span", jc, c(g.label), 1)
                ], 10, Lc))
              ], 64))), 128))
            ])
          ]),
          _: 2
        }, 1024))), 128))
      ]),
      I(gc, {
        ref_key: "fallback",
        ref: i,
        class: "sm:hidden",
        groups: e.groups,
        title: e.title,
        busy: e.busy,
        onRun: w[0] || (w[0] = (p) => s("run", p))
      }, null, 8, ["groups", "title", "busy"])
    ]));
  }
}), Kt = {
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
}, qt = {
  neutral: { label: "Neutral", hue: 0, chroma: 0 },
  slate: { label: "Slate", hue: 260, chroma: 0.012 },
  gray: { label: "Gray", hue: 250, chroma: 6e-3 },
  zinc: { label: "Zinc", hue: 280, chroma: 6e-3 },
  stone: { label: "Stone", hue: 60, chroma: 8e-3 },
  warm: { label: "Warm", hue: 40, chroma: 0.014 },
  cool: { label: "Cool", hue: 220, chroma: 0.014 },
  sand: { label: "Sand", hue: 80, chroma: 0.016 }
}, Bt = 12, At = 20, Vc = [0, 0.25, 0.5, 0.75, 1], un = "alxtexhpanel.appearance", Ae = {
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
}, Ve = K({ ...Ae });
let Qe = !1;
const Wn = "alxtexhpanel.appearance.vars", Gt = "pk-appearance";
function ot() {
  return typeof window > "u" ? null : window;
}
let zt = null;
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
function Dc(e) {
  if (typeof document > "u")
    return;
  let o = document.getElementById(Gt);
  o || (o = document.createElement("style"), o.id = Gt, document.head.appendChild(o));
  const a = Object.entries(e).map(([r, s]) => `${r}: ${s};`).join(" ");
  o.textContent = `:root { ${a} }`;
}
function Q8() {
  Qe = !1, zt = null, Ve.value = { ...Ae };
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
  const o = Kt[e.primary] ?? Kt.slate, a = qt[e.surface] ?? qt.neutral, r = a.chroma, s = a.hue, i = r > 0 ? r : 6e-3, d = r > 0 ? s : 250, f = cn(e) ? {
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
    ...f,
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
function Tc(e) {
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
    return typeof o.fontSize == "string" && (o.fontSize = a[o.fontSize] ?? Ae.fontSize), (typeof o.fontSize != "number" || Number.isNaN(o.fontSize) || o.fontSize < Bt || o.fontSize > At) && (o.fontSize = Ae.fontSize), o;
  } catch {
    return { ...Ae };
  }
}
function Ic() {
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
  if (zt !== s) {
    if (r && d && e) {
      zt = s;
      try {
        const u = Tc(a);
        localStorage.setItem(Wn, JSON.stringify(u));
      } catch {
      }
      return;
    }
    Wt(a);
  }
}
function X8() {
  Qn(Ic());
}
function eC(e) {
  const o = e?.props?.appearance;
  o != null && typeof o == "object" && Qn(o);
}
let Xn = null;
function tC(e) {
  Xn = e;
}
let ea = {};
function Ec(e) {
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
  o.dataset.sidebar = s.sidebar, o.dataset.contentLayout = s.contentLayout, Dc(a), Jn(e), zt = Zn(e);
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
    PRIMARY_COLORS: Kt,
    SURFACE_TINTS: qt,
    FONT_SIZE_MIN: Bt,
    FONT_SIZE_MAX: At,
    RADIUS_OPTIONS: Vc
  };
}
const Fc = ["aria-busy", "aria-describedby"], Nc = { class: "bg-background flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3" }, Rc = { class: "min-w-0" }, Uc = { class: "flex shrink-0 items-center gap-2" }, Hc = ["disabled"], Kc = { class: "min-h-0 flex-1 overflow-y-auto overscroll-contain" }, qc = {
  key: 0,
  class: "bg-muted/30 flex shrink-0 items-center justify-end gap-2 border-t px-4 py-3"
}, Lt = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(null), i = `pk-slideover-title-${Xe()}`, d = `pk-slideover-description-${Xe()}`, u = /* @__PURE__ */ Symbol("pk-slideover");
    let f = null, v = !1;
    const m = K(!1), h = y(() => a.width ?? xo[a.size]), M = y(
      () => [Un, a.padded ? yo : ""].filter(Boolean).join(" ")
    );
    function $(A) {
      m.value = A.target === A.currentTarget;
    }
    function C(A) {
      m.value && A.target === A.currentTarget && !a.busy && r("close"), m.value = !1;
    }
    function k(A) {
      if (!a.open)
        return;
      if (A.key === "Escape") {
        if (a.busy)
          return;
        A.stopPropagation(), r("close");
        return;
      }
      if (A.key !== "Tab" || !s.value)
        return;
      const B = s.value.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (B.length === 0)
        return;
      const w = B[0], p = B[B.length - 1];
      A.shiftKey && document.activeElement === w ? (A.preventDefault(), p.focus()) : !A.shiftKey && document.activeElement === p && (A.preventDefault(), w.focus());
    }
    return pe(
      () => a.open,
      async (A) => {
        if (A) {
          f = document.activeElement, Hn(u), v = !0, document.addEventListener("keydown", k), await De(), s.value?.querySelector("input, button, [tabindex]")?.focus();
          return;
        }
        if (v) {
          const B = Mt(u);
          v = !1, document.removeEventListener("keydown", k), B && f?.focus?.(), f = null;
        }
      },
      { immediate: !0 }
    ), ke(() => {
      document.removeEventListener("keydown", k), v && (Mt(u), v = !1);
    }), (A, B) => (t(), T(pt, { to: "body" }, [
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
            onPointerdown: $,
            onPointerup: C
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
            l("header", Nc, [
              l("div", Rc, [
                l("h2", {
                  id: i,
                  class: "text-base font-semibold"
                }, c(e.title), 1),
                e.description ? (t(), n("p", {
                  key: 0,
                  id: d,
                  class: "text-muted-foreground mt-0.5 text-xs"
                }, c(e.description), 1)) : b("", !0)
              ]),
              l("div", Uc, [
                q(A.$slots, "header-actions"),
                l("button", {
                  type: "button",
                  class: "text-muted-foreground hover:text-foreground disabled:opacity-50",
                  "aria-label": "Close",
                  disabled: e.busy,
                  onClick: B[0] || (B[0] = (w) => r("close"))
                }, [...B[1] || (B[1] = [
                  l("svg", {
                    viewBox: "0 0 24 24",
                    class: "size-4",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2.5"
                  }, [
                    l("path", { d: "M18 6 6 18M6 6l12 12" })
                  ], -1)
                ])], 8, Hc)
              ])
            ]),
            l("div", Kc, [
              l("div", {
                class: z(M.value)
              }, [
                q(A.$slots, "default")
              ], 2)
            ]),
            A.$slots.footer ? (t(), n("footer", qc, [
              q(A.$slots, "footer")
            ])) : b("", !0)
          ], 10, Fc)) : b("", !0)
        ]),
        _: 3
      }, 8, ["enter-from-class", "leave-to-class"])
    ]));
  }
}), Gc = { class: "flex flex-col gap-5 px-4 py-4" }, Wc = { class: "flex flex-col gap-2" }, Zc = { class: "grid grid-cols-8 gap-2" }, Jc = ["title", "aria-label", "aria-pressed", "onClick"], Yc = { class: "flex flex-col gap-2" }, Qc = { class: "grid grid-cols-8 gap-2" }, Xc = ["title", "aria-label", "aria-pressed", "onClick"], ef = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "absolute inset-0 m-auto size-4 text-black",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3.5"
}, tf = { class: "flex flex-col gap-2" }, nf = { class: "bg-muted/50 flex gap-0.5 rounded-md p-0.5" }, af = ["aria-pressed", "aria-label", "onClick"], lf = { class: "text-sm font-semibold" }, of = { class: "bg-muted/50 flex gap-0.5 rounded-md p-0.5" }, sf = ["onClick"], rf = { class: "flex flex-col gap-2" }, df = { class: "flex items-center justify-between" }, uf = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, cf = { class: "flex items-center gap-2" }, ff = ["disabled"], mf = ["min", "max", "value"], pf = ["disabled"], nC = /* @__PURE__ */ L({
  __name: "AppearanceDrawer",
  setup(e) {
    const { appearance: o, set: a, reset: r, PRIMARY_COLORS: s, SURFACE_TINTS: i, RADIUS_OPTIONS: d } = ta(), u = K(!1), f = y(() => o.value.sidebarSide === "right"), v = y(() => f.value ? "left" : "right"), m = [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" }
    ], h = [
      { value: "compact", label: "Compact" },
      { value: "comfortable", label: "Comfortable" },
      { value: "spacious", label: "Spacious" }
    ], M = [
      { value: "transparent", label: "Transparent" },
      { value: "filled", label: "Filled" }
    ], $ = [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
      { value: "horizontal", label: "Top" }
    ], C = [
      { value: "full", label: "Full" },
      { value: "centered", label: "Centered" }
    ], k = [
      { value: "collapsible", label: "Collapsible" },
      { value: "drilldown", label: "Drill-down" }
    ];
    function A(B, w) {
      return `oklch(0.72 ${w * 3} ${B})`;
    }
    return (B, w) => (t(), n(_, null, [
      l("button", {
        type: "button",
        class: "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors",
        "aria-label": "Appearance settings",
        title: "Appearance",
        onClick: w[0] || (w[0] = (p) => u.value = !0)
      }, [...w[6] || (w[6] = [
        ut('<svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 1 0-20c5 0 9 3.6 9 8 0 2.2-1.8 4-4 4h-2.2a1.8 1.8 0 0 0-1.3 3 1.8 1.8 0 0 1-1.5 3z"></path><circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="10.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="15" cy="8.5" r="1.2" fill="currentColor" stroke="none"></circle></svg>', 1)
      ])]),
      I(Lt, {
        open: u.value,
        title: "Settings",
        side: v.value,
        width: "w-80",
        padded: !1,
        onClose: w[5] || (w[5] = (p) => u.value = !1)
      }, {
        "header-actions": O(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground text-xs font-normal hover:underline",
            onClick: w[1] || (w[1] = //@ts-ignore
            (...p) => x(r) && x(r)(...p))
          }, " Reset ")
        ]),
        default: O(() => [
          l("div", Gc, [
            l("section", Wc, [
              w[8] || (w[8] = l("h3", { class: "text-sm font-semibold" }, "Primary", -1)),
              l("div", Zc, [
                (t(!0), n(_, null, j(x(s), (p, g) => (t(), n("button", {
                  key: g,
                  type: "button",
                  class: "relative size-7 rounded-md transition-transform hover:scale-110",
                  style: ie({ background: p.value }),
                  title: p.label,
                  "aria-label": p.label,
                  "aria-pressed": x(o).primary === g,
                  onClick: (S) => x(a)({ primary: g })
                }, [
                  x(o).primary === g ? (t(), n("svg", {
                    key: 0,
                    viewBox: "0 0 24 24",
                    class: "absolute inset-0 m-auto size-4",
                    style: ie({ color: p.foreground }),
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "3.5"
                  }, [...w[7] || (w[7] = [
                    l("path", { d: "m5 13 4 4L19 7" }, null, -1)
                  ])], 4)) : b("", !0)
                ], 12, Jc))), 128))
              ])
            ]),
            l("section", Yc, [
              w[10] || (w[10] = l("h3", { class: "text-sm font-semibold" }, "Surface", -1)),
              l("div", Qc, [
                (t(!0), n(_, null, j(x(i), (p, g) => (t(), n("button", {
                  key: g,
                  type: "button",
                  class: "relative size-7 rounded-md border transition-transform hover:scale-110",
                  style: ie({ background: A(p.hue, p.chroma) }),
                  title: p.label,
                  "aria-label": p.label,
                  "aria-pressed": x(o).surface === g,
                  onClick: (S) => x(a)({ surface: g })
                }, [
                  x(o).surface === g ? (t(), n("svg", ef, [...w[9] || (w[9] = [
                    l("path", { d: "m5 13 4 4L19 7" }, null, -1)
                  ])])) : b("", !0)
                ], 12, Xc))), 128))
              ])
            ]),
            l("section", tf, [
              w[11] || (w[11] = l("h3", { class: "text-sm font-semibold" }, "Radius", -1)),
              l("div", nf, [
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
                  U(" " + c(p), 1)
                ], 10, af))), 128))
              ])
            ]),
            (t(!0), n(_, null, j([
              { label: "Color scheme", key: "theme", options: m },
              { label: "Card style", key: "cardStyle", options: M },
              { label: "Density", key: "density", options: h },
              { label: "Sidebar", key: "sidebarSide", options: $ },
              { label: "Content layout", key: "contentLayout", options: C },
              { label: "Menu style", key: "menuStyle", options: k }
            ], (p) => (t(), n("section", {
              key: p.key,
              class: "flex flex-col gap-2"
            }, [
              l("h3", lf, c(p.label), 1),
              l("div", of, [
                (t(!0), n(_, null, j(p.options, (g) => (t(), n("button", {
                  key: String(g.value),
                  type: "button",
                  class: z([
                    "flex-1 rounded px-2 py-1.5 text-xs transition-colors",
                    x(o)[p.key] === g.value ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ]),
                  onClick: (S) => x(a)({ [p.key]: g.value })
                }, c(g.label), 11, sf))), 128))
              ])
            ]))), 128)),
            l("section", rf, [
              l("div", df, [
                w[12] || (w[12] = l("h3", { class: "text-sm font-semibold" }, "Font size", -1)),
                l("span", uf, c(x(o).fontSize) + "px", 1)
              ]),
              l("div", cf, [
                l("button", {
                  type: "button",
                  class: "border-input hover:bg-accent size-7 rounded-md border text-sm disabled:opacity-40",
                  disabled: x(o).fontSize <= x(Bt),
                  "aria-label": "Decrease font size",
                  onClick: w[2] || (w[2] = (p) => x(a)({ fontSize: x(o).fontSize - 1 }))
                }, " − ", 8, ff),
                l("input", {
                  type: "range",
                  class: "accent-primary flex-1",
                  min: x(Bt),
                  max: x(At),
                  value: x(o).fontSize,
                  "aria-label": "Font size in pixels",
                  onInput: w[3] || (w[3] = (p) => x(a)({
                    fontSize: Number(p.target.value)
                  }))
                }, null, 40, mf),
                l("button", {
                  type: "button",
                  class: "border-input hover:bg-accent size-7 rounded-md border text-sm disabled:opacity-40",
                  disabled: x(o).fontSize >= x(At),
                  "aria-label": "Increase font size",
                  onClick: w[4] || (w[4] = (p) => x(a)({ fontSize: x(o).fontSize + 1 }))
                }, " + ", 8, pf)
              ])
            ])
          ])
        ]),
        _: 1
      }, 8, ["open", "side"])
    ], 64));
  }
}), vf = {
  class: "bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur sm:hidden",
  "aria-label": "Primary",
  style: { paddingBottom: "env(safe-area-inset-bottom)" }
}, gf = { class: "flex items-stretch" }, hf = ["href", "aria-current"], bf = {
  class: "size-5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, yf = ["d"], xf = { class: "w-full truncate text-center" }, kf = {
  key: 0,
  class: "flex-1"
}, $f = {
  class: "size-5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, wf = ["d"], Cf = { class: "w-full truncate text-center" }, Tt = 5, aC = /* @__PURE__ */ L({
  __name: "PkBottomNav",
  props: {
    items: {},
    current: { default: "" },
    moreLabel: { default: "More" }
  },
  emits: ["more"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(
      () => a.items.length <= Tt ? a.items : a.items.slice(0, Tt - 1)
    ), i = y(() => a.items.length > Tt);
    function d(u) {
      return u === "/" ? a.current === "/" : a.current === u || a.current.startsWith(`${u}/`);
    }
    return (u, f) => (t(), n("nav", vf, [
      l("ul", gf, [
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
            (t(), n("svg", bf, [
              l("path", {
                d: x(me)(v.icon)
              }, null, 8, yf)
            ])),
            l("span", xf, c(v.title), 1)
          ], 10, hf)
        ]))), 128)),
        i.value ? (t(), n("li", kf, [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:text-foreground flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] transition-colors",
            onClick: f[0] || (f[0] = (v) => r("more"))
          }, [
            (t(), n("svg", $f, [
              l("path", {
                d: x(me)("more-horizontal")
              }, null, 8, wf)
            ])),
            l("span", Cf, c(e.moreLabel), 1)
          ])
        ])) : b("", !0)
      ])
    ]));
  }
}), Sf = { class: "lg:shrink-0 lg:self-start" }, Mf = { class: "lg:hidden" }, Bf = ["aria-expanded", "aria-label"], Af = { class: "flex min-w-0 items-center gap-2" }, zf = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, _f = ["d"], Pf = { class: "truncate" }, Lf = ["aria-label"], Of = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, jf = ["d"], Vf = { class: "flex-1" }, Df = {
  key: 0,
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Tf = ["d"], If = { class: "sticky top-6 hidden w-60 shrink-0 self-start lg:block" }, Ef = ["aria-label"], Ff = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Nf = ["d"], lC = /* @__PURE__ */ L({
  __name: "PkSubNav",
  props: {
    items: {},
    ariaLabel: { default: "Section" },
    fallbackIcon: { default: "sliders" }
  },
  setup(e) {
    const o = e, a = Xt();
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
      const f = r(a.url.split("?")[0]), v = r(u);
      return f === v || f.startsWith(`${v}/`);
    }
    const i = y(
      () => o.items.find((u) => s(u.href)) ?? o.items[0]
    );
    function d(u) {
      return u?.icon ?? o.fallbackIcon;
    }
    return (u, f) => (t(), n("div", Sf, [
      l("div", Mf, [
        I(Ke, { align: "start" }, {
          trigger: O(({ open: v }) => [
            l("button", {
              type: "button",
              class: "border-input bg-background hover:bg-accent flex h-10 w-full items-center justify-between rounded-md border px-3 text-sm shadow-xs",
              "aria-expanded": v,
              "aria-haspopup": "listbox",
              "aria-label": e.ariaLabel
            }, [
              l("span", Af, [
                (t(), n("svg", zf, [
                  l("path", {
                    d: x(me)(d(i.value))
                  }, null, 8, _f)
                ])),
                l("span", Pf, c(i.value?.title), 1)
              ]),
              f[0] || (f[0] = l("svg", {
                class: "text-muted-foreground size-4 shrink-0 opacity-70",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "aria-hidden": "true"
              }, [
                l("path", { d: "m7 15 5 5 5-5M7 9l5-5 5 5" })
              ], -1))
            ], 8, Bf)
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
                  (t(), n("svg", Of, [
                    l("path", {
                      d: x(me)(d(v))
                    }, null, 8, jf)
                  ])),
                  l("span", Vf, c(v.title), 1),
                  s(v.href) ? (t(), n("svg", Df, [
                    l("path", {
                      d: x(me)("check")
                    }, null, 8, Tf)
                  ])) : b("", !0)
                ]),
                _: 2
              }, 1032, ["href", "aria-selected", "class"]))), 128))
            ], 8, Lf)
          ]),
          _: 1
        })
      ]),
      l("aside", If, [
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
              (t(), n("svg", Ff, [
                l("path", {
                  d: x(me)(d(v))
                }, null, 8, Nf)
              ])),
              U(" " + c(v.title), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"]))), 128))
        ], 8, Ef)
      ])
    ]));
  }
}), Rf = ["value"], we = /* @__PURE__ */ L({
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
    }, null, 42, Rf));
  }
}), Uf = ["for"], _e = /* @__PURE__ */ L({
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
      q(o.$slots, "default")
    ], 10, Uf));
  }
}), oC = /* @__PURE__ */ L({
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
}), Hf = { class: "relative flex items-center gap-2 has-disabled:opacity-50" }, Kf = ["id", "name", "value", "disabled", "maxlength"], qf = ["data-active"], Gf = {
  key: 0,
  class: "pointer-events-none absolute inset-0 flex items-center justify-center"
}, Wf = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(!1), i = K(null), d = K("");
    be(() => {
      a.autofocus && i.value?.focus();
    });
    const u = y(
      () => Array.from({ length: a.length }, (B, w) => a.modelValue[w] ?? "")
    ), f = y(() => Math.min(a.modelValue.length, a.length - 1));
    function v(B) {
      return B.replace(/\D/g, "").slice(0, a.length);
    }
    function m(B) {
      a.disabled || B.length !== a.length || d.value !== B && (d.value = B, r("complete", B));
    }
    function h(B) {
      const w = v(B);
      w !== a.modelValue && r("update:modelValue", w), m(w);
    }
    function M(B) {
      h(B.target.value);
    }
    function $(B) {
      h(B.target.value);
    }
    function C() {
      h(i.value?.value ?? "");
    }
    function k(B) {
      B.animationName === "pkOtpAutofillStart" && C();
    }
    pe(
      () => a.modelValue,
      (B) => {
        B.length < a.length ? d.value = "" : m(B);
      }
    );
    let A;
    return be(() => {
      A = window.setInterval(() => {
        if (a.disabled || !i.value)
          return;
        (i.value.matches(":-webkit-autofill") || i.value.matches(":autofill") || document.activeElement === i.value) && C();
      }, 250);
    }), ga(() => {
      A !== void 0 && window.clearInterval(A);
    }), (B, w) => (t(), n("div", Hf, [
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
        onInput: M,
        onChange: $,
        onAnimationstart: k,
        onFocus: w[0] || (w[0] = (p) => s.value = !0),
        onBlur: w[1] || (w[1] = (p) => s.value = !1)
      }, null, 40, Kf),
      (t(!0), n(_, null, j(u.value, (p, g) => (t(), n("div", {
        key: g,
        "data-slot": "input-otp-slot",
        "data-active": s.value && g === f.value,
        class: "data-[active=true]:border-ring data-[active=true]:ring-ring/50 border-input dark:bg-input/30 relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]"
      }, [
        U(c(p) + " ", 1),
        s.value && g === f.value && p === "" ? (t(), n("div", Gf, [...w[2] || (w[2] = [
          l("div", { class: "bg-foreground h-4 w-px animate-pulse duration-1000" }, null, -1)
        ])])) : b("", !0)
      ], 8, qf))), 128))
    ]));
  }
}), sC = /* @__PURE__ */ at(Wf, [["__scopeId", "data-v-0fdf60b6"]]), Zf = {
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
      }, c(e.title), 3),
      e.description ? (t(), n("p", Zf, c(e.description), 1)) : b("", !0)
    ], 2));
  }
}), Jf = {
  "data-slot": "page-header",
  class: "pk-section-heading flex flex-wrap items-start justify-between gap-3 pb-0.5"
}, Yf = { class: "min-w-0 space-y-1" }, Qf = { class: "flex flex-wrap items-center gap-2.5" }, Xf = { class: "text-2xl font-semibold tracking-tight" }, em = {
  key: 0,
  class: "flex items-center gap-2"
}, tm = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, nm = {
  key: 0,
  class: "flex shrink-0 flex-wrap items-center gap-2"
}, rC = /* @__PURE__ */ L({
  __name: "PkPageHeader",
  props: {
    title: {},
    purpose: {}
  },
  setup(e) {
    return (o, a) => (t(), n("header", Jf, [
      l("div", Yf, [
        l("div", Qf, [
          l("h1", Xf, c(e.title), 1),
          o.$slots.status ? (t(), n("div", em, [
            q(o.$slots, "status")
          ])) : b("", !0)
        ]),
        e.purpose ? (t(), n("p", tm, c(e.purpose), 1)) : b("", !0)
      ]),
      o.$slots.actions ? (t(), n("div", nm, [
        q(o.$slots, "actions")
      ])) : b("", !0)
    ]));
  }
}), am = /* @__PURE__ */ L({
  __name: "Alert",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    variant: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert",
      class: z(x(oe)(x(sm)({ variant: e.variant }), o.class)),
      role: "alert"
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), lm = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), om = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), sm = ln(
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
), rm = { class: "list-inside list-disc text-sm" }, iC = /* @__PURE__ */ L({
  __name: "PkAlertError",
  props: {
    errors: {},
    title: { default: "Something went wrong." }
  },
  setup(e) {
    const o = e, a = y(() => Array.from(new Set(o.errors)));
    return (r, s) => (t(), T(x(am), { variant: "destructive" }, {
      default: O(() => [
        I(x(rl), { class: "size-4" }),
        I(x(om), null, {
          default: O(() => [
            U(c(e.title), 1)
          ]),
          _: 1
        }),
        I(x(lm), null, {
          default: O(() => [
            l("ul", rm, [
              (t(!0), n(_, null, j(a.value, (i, d) => (t(), n("li", { key: d }, c(i), 1))), 128))
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
    return (i, d) => he((t(), n("input", {
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
}), im = { class: "relative" }, dm = ["aria-label"], dC = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkPasswordInput",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e, { expose: o }) {
    const a = e, r = K(!1), s = ba("inputRef");
    return o({
      $el: s,
      focus: () => s.value?.$el?.focus()
    }), (i, d) => (t(), n("div", im, [
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
        r.value ? (t(), T(x(il), {
          key: 0,
          class: "size-4"
        })) : (t(), T(x(dl), {
          key: 1,
          class: "size-4"
        }))
      ], 10, dm)
    ]));
  }
}), aa = "@container min-w-0", um = "grid grid-cols-1 gap-3 @lg:grid-cols-2 @3xl:grid-cols-3", uC = "grid grid-cols-1 gap-2 @lg:grid-cols-2 @3xl:grid-cols-3", cm = "grid grid-cols-1 gap-4 @lg:grid-cols-2 @lg:gap-5 @3xl:grid-cols-3";
function fm(e) {
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
function cC(e, o) {
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
    s.forEach((u, f) => {
      d[f % a].push(u);
    }), r.push({ type: "columns", columns: d }), s = [];
  };
  for (const d of e)
    fm(d.span) >= 2 ? (i(), r.push({ type: "wide", item: d })) : s.push(d);
  return i(), r;
}
function Cn(e, o) {
  return `${e}:${o}`;
}
function fC(e) {
  const o = /^(stat|chart|table):([a-z0-9_-]+)$/i.exec(e);
  return o ? {
    kind: o[1].toLowerCase(),
    key: o[2]
  } : null;
}
function Zt(e, o = 1) {
  return (e ?? o) >= 2 ? 2 : 1;
}
function mC(e, o, a, r) {
  const s = [
    { kind: "stat", items: e },
    { kind: "chart", items: o },
    { kind: "table", items: a }
  ], i = /* @__PURE__ */ new Map();
  for (const f of s)
    for (const v of f.items)
      i.set(Cn(f.kind, v.key), {
        kind: f.kind,
        source: v
      });
  const d = [], u = /* @__PURE__ */ new Set();
  for (const f of r?.widgets ?? []) {
    const v = f.id.toLowerCase(), m = i.get(v);
    m && (u.add(v), d.push({
      id: v,
      kind: m.kind,
      key: m.source.key,
      span: Zt(f.span),
      hidden: !!f.hidden,
      source: m.source
    }));
  }
  for (const f of s)
    for (const v of f.items) {
      const m = Cn(f.kind, v.key);
      u.has(m) || d.push({
        id: m,
        kind: f.kind,
        key: v.key,
        span: Zt(v.span),
        hidden: !1,
        source: v
      });
    }
  return d;
}
function pC(e) {
  return {
    widgets: e.map((o) => ({
      id: o.id.toLowerCase(),
      span: Zt(o.span),
      hidden: !!o.hidden
    }))
  };
}
const la = "Upload a PNG with a transparent background so it sits on invoices and contracts without a white box.", mm = "This image has no transparent background. Upload a PNG (or WebP) with alpha so it sits on invoices and contracts without a white box.", pm = "JPEG files are fully opaque and stamp a white rectangle. Upload a PNG with a transparent background.";
function vm(e) {
  const o = e.name.toLowerCase(), a = e.type.toLowerCase();
  return a === "image/jpeg" || a === "image/jpg" || o.endsWith(".jpg") || o.endsWith(".jpeg");
}
function gm(e) {
  const o = e.name.toLowerCase(), a = e.type.toLowerCase();
  return a === "image/png" || a === "image/webp" || o.endsWith(".png") || o.endsWith(".webp");
}
async function hm(e) {
  const o = URL.createObjectURL(e);
  try {
    const a = await bm(o), r = document.createElement("canvas"), s = Math.max(1, a.naturalWidth), i = Math.max(1, a.naturalHeight);
    r.width = s, r.height = i;
    const d = r.getContext("2d", { willReadFrequently: !0 });
    if (!d)
      return !1;
    d.drawImage(a, 0, 0);
    const { data: u } = d.getImageData(0, 0, s, i);
    for (let f = 3; f < u.length; f += 4)
      if ((u[f] ?? 255) < 255)
        return !0;
    return !1;
  } finally {
    URL.revokeObjectURL(o);
  }
}
function bm(e) {
  return new Promise((o, a) => {
    const r = new Image();
    r.onload = () => o(r), r.onerror = () => a(new Error("Could not read that image.")), r.src = e;
  });
}
async function ym(e) {
  if (vm(e))
    throw new Error(pm);
  if (!gm(e))
    throw new Error(la);
  if (!await hm(e))
    throw new Error(mm);
}
const vC = /* @__PURE__ */ L({
  __name: "SheetClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(tt), de({ "data-slot": "sheet-close" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), xm = /* @__PURE__ */ L({
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
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), gC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), km = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), $m = /* @__PURE__ */ L({
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
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), hC = /* @__PURE__ */ L({
  __name: "SheetTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Tn), de({ "data-slot": "sheet-trigger" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Sn = "sidebar_state", wm = 3600 * 24 * 7, Cm = "16rem", Sm = "18rem", Mm = "3rem", Bm = "b", [Ot, Am] = Aa("Sidebar"), zm = { class: "flex h-full w-full flex-col" }, _m = ["data-state", "data-collapsible", "data-variant", "data-side"], Pm = {
  "data-sidebar": "sidebar",
  class: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
}, bC = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "Sidebar",
  props: {
    side: { default: "left" },
    variant: { default: "sidebar" },
    collapsible: { default: "offcanvas" },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { isMobile: a, state: r, openMobile: s, setOpenMobile: i } = Ot();
    return (d, u) => e.collapsible === "none" ? (t(), n("div", de({
      key: 0,
      "data-slot": "sidebar",
      class: x(oe)(
        "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
        o.class
      )
    }, d.$attrs), [
      q(d.$slots, "default")
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
            "--sidebar-width": x(Sm)
          })
        }, {
          default: O(() => [
            I(km, { class: "sr-only" }, {
              default: O(() => [
                I($m, null, {
                  default: O(() => [...u[0] || (u[0] = [
                    U("Sidebar", -1)
                  ])]),
                  _: 1
                }),
                I(xm, null, {
                  default: O(() => [...u[1] || (u[1] = [
                    U("Displays the mobile sidebar.", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }),
            l("div", zm, [
              q(d.$slots, "default")
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
        l("div", Pm, [
          q(d.$slots, "default")
        ])
      ], 16)
    ], 8, _m));
  }
}), yC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), xC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), kC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), $C = /* @__PURE__ */ L({
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
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), wC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), CC = /* @__PURE__ */ L({
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
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), SC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), MC = /* @__PURE__ */ L({
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
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), BC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), AC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), zC = /* @__PURE__ */ L({
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
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "as", "as-child"]));
  }
}), _C = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), Lm = /* @__PURE__ */ L({
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
    return (i, d) => (t(), T(x(za), de({ "data-slot": "tooltip" }, x(s)), {
      default: O((u) => [
        q(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
}), Om = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(_a), null, {
      default: O(() => [
        I(x(Pa), de({ "data-slot": "tooltip-content" }, { ...x(i), ...d.$attrs }, {
          class: x(oe)(
            "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
            a.class
          )
        }), {
          default: O(() => [
            q(d.$slots, "default"),
            I(x(La), { class: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), PC = /* @__PURE__ */ L({
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
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), jm = /* @__PURE__ */ L({
  __name: "TooltipTrigger",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Oa), de({ "data-slot": "tooltip-trigger" }, o), {
      default: O(() => [
        q(a.$slots, "default")
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
      class: x(oe)(x(Dm)({ variant: e.variant, size: e.size }), o.class),
      as: e.as,
      "as-child": e.asChild
    }, a.$attrs), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-size", "data-active", "class", "as", "as-child"]));
  }
}), LC = /* @__PURE__ */ L({
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
    const o = e, { isMobile: a, state: r } = Ot(), s = ve(o, "tooltip");
    return (i, d) => e.tooltip ? (t(), T(x(Lm), { key: 1 }, {
      default: O(() => [
        I(x(jm), { "as-child": "" }, {
          default: O(() => [
            I(Mn, Le(Re({ ...x(s), ...i.$attrs })), {
              default: O(() => [
                q(i.$slots, "default")
              ]),
              _: 3
            }, 16)
          ]),
          _: 3
        }),
        I(x(Om), {
          side: "right",
          align: "center",
          hidden: x(r) !== "collapsed" || x(a)
        }, {
          default: O(() => [
            typeof e.tooltip == "string" ? (t(), n(_, { key: 0 }, [
              U(c(e.tooltip), 1)
            ], 64)) : (t(), T(Ce(e.tooltip), { key: 1 }))
          ]),
          _: 1
        }, 8, ["hidden"])
      ]),
      _: 3
    })) : (t(), T(Mn, Le(de({ key: 0 }, { ...x(s), ...i.$attrs })), {
      default: O(() => [
        q(i.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), OC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), Bn = "animate-pulse rounded-md bg-primary/10", jC = /* @__PURE__ */ L({
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
}), VC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), DC = /* @__PURE__ */ L({
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
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "data-size", "data-active", "class"]));
  }
}), TC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), IC = /* @__PURE__ */ L({
  __name: "SidebarProvider",
  props: {
    defaultOpen: { type: Boolean, default: !bl?.cookie.includes(`${Sn}=false`) },
    open: { type: Boolean, default: void 0 },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = gl("(max-width: 767px)"), i = K(!1), d = Rn(a, "open", r, {
      defaultValue: a.defaultOpen ?? !1,
      passive: a.open === void 0
    });
    function u(h) {
      d.value = h, document.cookie = `${Sn}=${d.value}; path=/; max-age=${wm}`;
    }
    function f(h) {
      i.value = h;
    }
    function v() {
      return s.value ? f(!i.value) : u(!d.value);
    }
    hl("keydown", (h) => {
      h.key === Bm && (h.metaKey || h.ctrlKey) && (h.preventDefault(), v());
    });
    const m = y(() => s.value || d.value ? "expanded" : "collapsed");
    return Am({
      state: m,
      open: d,
      setOpen: u,
      isMobile: s,
      openMobile: i,
      setOpenMobile: f,
      toggleSidebar: v
    }), (h, M) => (t(), T(x(In), { "delay-duration": 0 }, {
      default: O(() => [
        l("div", de({
          "data-slot": "sidebar-wrapper",
          style: {
            "--sidebar-width": x(Cm),
            "--sidebar-width-icon": x(Mm)
          },
          class: x(oe)(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex h-svh min-h-svh w-full overflow-hidden",
            a.class
          )
        }, h.$attrs), [
          q(h.$slots, "default")
        ], 16)
      ]),
      _: 3
    }));
  }
}), EC = /* @__PURE__ */ L({
  __name: "SidebarRail",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { toggleSidebar: a } = Ot();
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
      q(r.$slots, "default")
    ], 2));
  }
}), Vm = /* @__PURE__ */ L({
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
    return (r, s) => (t(), T(x(ja), de({ "data-slot": "separator" }, x(a), {
      class: x(oe)(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        o.class
      )
    }), null, 16, ["class"]));
  }
}), FC = /* @__PURE__ */ L({
  __name: "SidebarSeparator",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Vm), {
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      class: z(x(oe)("bg-sidebar-border mx-2 w-auto", o.class))
    }, {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), NC = /* @__PURE__ */ L({
  __name: "SidebarTrigger",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { isMobile: a, state: r, toggleSidebar: s } = Ot();
    return (i, d) => (t(), T(ce, {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      class: z(x(oe)("h-7 w-7", o.class)),
      onClick: x(s)
    }, {
      default: O(() => [
        x(a) || x(r) === "collapsed" ? (t(), T(x(ul), { key: 0 })) : (t(), T(x(cl), { key: 1 })),
        d[0] || (d[0] = l("span", { class: "sr-only" }, "Toggle sidebar", -1))
      ]),
      _: 1
    }, 8, ["class", "onClick"]));
  }
}), Dm = ln(
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
), RC = /* @__PURE__ */ L({
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
    return (i, d) => (t(), T(x(Va), de({ "data-slot": "dropdown-menu" }, x(s)), {
      default: O((u) => [
        q(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
}), Tm = { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, UC = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(Da), de({ "data-slot": "dropdown-menu-checkbox-item" }, x(i), {
      class: x(oe)(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: O(() => [
        l("span", Tm, [
          I(x(En), null, {
            default: O(() => [
              q(d.$slots, "indicator-icon", {}, () => [
                I(x(Fn), { class: "size-4" })
              ])
            ]),
            _: 3
          })
        ]),
        q(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), HC = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(Ta), null, {
      default: O(() => [
        I(x(Ia), de({ "data-slot": "dropdown-menu-content" }, { ...d.$attrs, ...x(i) }, {
          class: x(oe)(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--reka-dropdown-menu-content-available-height) min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
            a.class
          )
        }), {
          default: O(() => [
            q(d.$slots, "default")
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
    return (a, r) => (t(), T(x(Ea), de({ "data-slot": "dropdown-menu-group" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), qC = /* @__PURE__ */ L({
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
    return (s, i) => (t(), T(x(Fa), de({
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
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-inset", "data-variant", "class"]));
  }
}), GC = /* @__PURE__ */ L({
  __name: "DropdownMenuLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, a = ve(o, "class", "inset"), r = Oe(a);
    return (s, i) => (t(), T(x(Na), de({
      "data-slot": "dropdown-menu-label",
      "data-inset": e.inset ? "" : void 0
    }, x(r), {
      class: x(oe)("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", o.class)
    }), {
      default: O(() => [
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-inset", "class"]));
  }
}), WC = /* @__PURE__ */ L({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), T(x(Ra), de({ "data-slot": "dropdown-menu-radio-group" }, x(s)), {
      default: O(() => [
        q(i.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Im = { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, ZC = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(Ua), de({ "data-slot": "dropdown-menu-radio-item" }, x(i), {
      class: x(oe)(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: O(() => [
        l("span", Im, [
          I(x(En), null, {
            default: O(() => [
              q(d.$slots, "indicator-icon", {}, () => [
                I(x(fl), { class: "size-2 fill-current" })
              ])
            ]),
            _: 3
          })
        ]),
        q(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), JC = /* @__PURE__ */ L({
  __name: "DropdownMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Ha), de({ "data-slot": "dropdown-menu-separator" }, x(a), {
      class: x(oe)("bg-border -mx-1 my-1 h-px", o.class)
    }), null, 16, ["class"]));
  }
}), YC = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), QC = /* @__PURE__ */ L({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), T(x(Ka), de({ "data-slot": "dropdown-menu-sub" }, x(s)), {
      default: O((u) => [
        q(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
}), XC = /* @__PURE__ */ L({
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
        q(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), e6 = /* @__PURE__ */ L({
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
    return (s, i) => (t(), T(x(Ga), de({ "data-slot": "dropdown-menu-sub-trigger" }, x(r), {
      "data-inset": e.inset ? "" : void 0,
      class: x(oe)(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground",
        o.class
      )
    }), {
      default: O(() => [
        q(s.$slots, "default"),
        I(x(Nn), { class: "ml-auto size-4" })
      ]),
      _: 3
    }, 16, ["data-inset", "class"]));
  }
}), t6 = /* @__PURE__ */ L({
  __name: "DropdownMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const a = Oe(e);
    return (r, s) => (t(), T(x(Wa), de({ "data-slot": "dropdown-menu-trigger" }, x(a)), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), n6 = /* @__PURE__ */ L({
  __name: "Avatar",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Za), {
      "data-slot": "avatar",
      class: z(x(oe)("relative flex size-8 shrink-0 overflow-hidden rounded-full", o.class))
    }, {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), a6 = /* @__PURE__ */ L({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(Ja), de({ "data-slot": "avatar-fallback" }, x(a), {
      class: x(oe)("bg-muted flex size-full items-center justify-center rounded-full", o.class)
    }), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), l6 = /* @__PURE__ */ L({
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
    return (a, r) => (t(), T(x(Ya), de({ "data-slot": "avatar-image" }, o, { class: "aspect-square size-full" }), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), o6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), s6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default", {}, () => [
        I(x(ml), { class: "size-4" })
      ]),
      r[0] || (r[0] = l("span", { class: "sr-only" }, "More", -1))
    ], 2));
  }
}), r6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), i6 = /* @__PURE__ */ L({
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
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), d6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), u6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), c6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default", {}, () => [
        I(x(Nn))
      ])
    ], 2));
  }
}), Em = { class: "absolute top-full left-0 isolate z-50 flex justify-center" }, Fm = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("div", Em, [
      I(x(Qa), de({ "data-slot": "navigation-menu-viewport" }, x(r), {
        class: x(oe)(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--reka-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--reka-navigation-menu-viewport-width)] left-[var(--reka-navigation-menu-viewport-left)]",
          o.class
        )
      }), null, 16, ["class"])
    ]));
  }
}), f6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(Xa), de({
      "data-slot": "navigation-menu",
      "data-viewport": e.viewport
    }, x(i), {
      class: x(oe)(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        a.class
      )
    }), {
      default: O((f) => [
        q(d.$slots, "default", Le(Re(f))),
        e.viewport ? (t(), T(Fm, { key: 0 })) : b("", !0)
      ]),
      _: 3
    }, 16, ["data-viewport", "class"]));
  }
}), m6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(el), de({ "data-slot": "navigation-menu-content" }, x(i), {
      class: x(oe)(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        a.class
      )
    }), {
      default: O(() => [
        q(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), p6 = /* @__PURE__ */ L({
  __name: "NavigationMenuIndicator",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), T(x(tl), de({ "data-slot": "navigation-menu-indicator" }, x(r), {
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
}), v6 = /* @__PURE__ */ L({
  __name: "NavigationMenuItem",
  props: {
    value: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(nl), de({ "data-slot": "navigation-menu-item" }, x(a), {
      class: x(oe)("relative", o.class)
    }), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), g6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(al), de({ "data-slot": "navigation-menu-link" }, x(i), {
      class: x(oe)(
        "data-active:focus:bg-accent data-active:hover:bg-accent data-active:bg-accent/50 data-active:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: O(() => [
        q(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), h6 = /* @__PURE__ */ L({
  __name: "NavigationMenuList",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), T(x(ll), de({ "data-slot": "navigation-menu-list" }, x(r), {
      class: x(oe)("group flex flex-1 list-none items-center justify-center gap-1", o.class)
    }), {
      default: O(() => [
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), b6 = /* @__PURE__ */ L({
  __name: "NavigationMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), T(x(ol), de({ "data-slot": "navigation-menu-trigger" }, x(r), {
      class: x(oe)(x(Nm)(), "group", o.class)
    }), {
      default: O(() => [
        q(s.$slots, "default"),
        I(x(pl), {
          class: "relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Nm = ln(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
), y6 = /* @__PURE__ */ L({
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
        q(i.$slots, "default", Le(Re(u)))
      ]),
      _: 3
    }, 16));
  }
}), x6 = /* @__PURE__ */ L({
  __name: "DialogClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(tt), de({ "data-slot": "dialog-close" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Rm = /* @__PURE__ */ L({
  __name: "DialogOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(en), de({ "data-slot": "dialog-overlay" }, x(a), {
      class: x(oe)(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        o.class
      )
    }), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), k6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(tn), null, {
      default: O(() => [
        I(Rm),
        I(x(nn), de({ "data-slot": "dialog-content" }, { ...d.$attrs, ...x(i) }, {
          class: x(oe)(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            a.class
          )
        }), {
          default: O(() => [
            q(d.$slots, "default"),
            e.showCloseButton ? (t(), T(x(tt), {
              key: 0,
              "data-slot": "dialog-close",
              class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            }, {
              default: O(() => [
                I(x(an)),
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
}), $6 = /* @__PURE__ */ L({
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
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), w6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default"),
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
}), C6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), S6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), T(x(tn), null, {
      default: O(() => [
        I(x(en), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
          default: O(() => [
            I(x(nn), de({
              class: x(oe)(
                "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                a.class
              )
            }, { ...d.$attrs, ...x(i) }, {
              onPointerDownOutside: u[0] || (u[0] = (f) => {
                const v = f.detail.originalEvent, m = v.target;
                (v.offsetX > m.clientWidth || v.offsetY > m.clientHeight) && f.preventDefault();
              })
            }), {
              default: O(() => [
                q(d.$slots, "default"),
                I(x(tt), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                  default: O(() => [
                    I(x(an), { class: "w-4 h-4" }),
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
}), M6 = /* @__PURE__ */ L({
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
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), B6 = /* @__PURE__ */ L({
  __name: "DialogTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(Tn), de({ "data-slot": "dialog-trigger" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), A6 = /* @__PURE__ */ L({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), T(x(sl), de({ "data-slot": "label" }, x(a), {
      class: x(oe)(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        o.class
      )
    }), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), z6 = /* @__PURE__ */ L({
  __name: "Spinner",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(x(vl), {
      role: "status",
      "aria-label": "Loading",
      class: z(x(oe)("size-4 animate-spin", o.class))
    }, null, 8, ["class"]));
  }
}), _6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), P6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), L6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), O6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), j6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), V6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), D6 = /* @__PURE__ */ L({
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
      q(a.$slots, "default")
    ], 2));
  }
}), Um = {
  key: 0,
  class: "border-destructive/30 bg-destructive/5 rounded-lg border border-dashed p-4"
}, Hm = { class: "flex items-start gap-3" }, Km = { class: "min-w-0 flex-1" }, qm = { class: "text-foreground text-sm font-medium" }, Gm = {
  key: 0,
  class: "text-muted-foreground mt-0.5 truncate text-xs"
}, T6 = /* @__PURE__ */ L({
  __name: "PkBoundary",
  props: {
    label: { default: "This section" },
    silent: { type: Boolean, default: !1 },
    fill: { type: Boolean, default: !1 }
  },
  emits: ["error"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = K(!1), d = K(null), u = K(0);
    ya((v) => (console.error(`[PkBoundary] ${r.label} failed to render`, v), i.value = !0, d.value = v instanceof Error ? v.message : null, s("error", v), !1));
    function f() {
      i.value = !1, d.value = null, u.value++;
    }
    return o({ retry: f }), (v, m) => (t(), n("div", {
      class: z(e.fill ? "h-full [&>*:only-child]:h-full" : void 0)
    }, [
      i.value && !e.silent ? (t(), n("div", Um, [
        l("div", Hm, [
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
          l("div", Km, [
            l("p", qm, c(e.label) + " could not be displayed ", 1),
            d.value ? (t(), n("p", Gm, c(d.value), 1)) : b("", !0),
            l("button", {
              type: "button",
              class: "text-foreground hover:bg-accent mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
              onClick: f
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
      ])) : i.value ? b("", !0) : q(v.$slots, "default", { key: u.value })
    ], 2));
  }
}), Wm = { class: "pk-surface rounded-lg" }, Zm = {
  key: 0,
  class: "flex items-start justify-between gap-4 border-b px-4 py-3"
}, Jm = { class: "min-w-0" }, Ym = {
  key: 0,
  class: "truncate text-sm font-medium"
}, Qm = {
  key: 1,
  class: "text-muted-foreground mt-0.5 text-sm"
}, Xm = {
  key: 0,
  class: "flex shrink-0 items-center gap-2"
}, ep = {
  key: 1,
  class: "flex items-center gap-2 border-t px-4 py-3"
}, I6 = /* @__PURE__ */ L({
  __name: "PkCard",
  props: {
    title: {},
    description: {},
    padded: { type: Boolean, default: !0 }
  },
  setup(e) {
    return (o, a) => (t(), n("section", Wm, [
      e.title || e.description || o.$slots.header || o.$slots.actions ? (t(), n("header", Zm, [
        l("div", Jm, [
          q(o.$slots, "header", {}, () => [
            e.title ? (t(), n("h2", Ym, c(e.title), 1)) : b("", !0),
            e.description ? (t(), n("p", Qm, c(e.description), 1)) : b("", !0)
          ])
        ]),
        o.$slots.actions ? (t(), n("div", Xm, [
          q(o.$slots, "actions")
        ])) : b("", !0)
      ])) : b("", !0),
      l("div", {
        class: z(e.padded ? "p-4" : "")
      }, [
        q(o.$slots, "default")
      ], 2),
      o.$slots.footer ? (t(), n("footer", ep, [
        q(o.$slots, "footer")
      ])) : b("", !0)
    ]));
  }
}), oa = /* @__PURE__ */ Symbol("pkPageFooterFromShell");
function E6() {
  const e = Xt(), o = y(() => e.props.panel?.pageFooter === !0);
  return Nt(oa, o), o;
}
const tp = {
  key: 0,
  "data-slot": "app-footer",
  class: "mt-auto shrink-0 border-t bg-background px-4 py-3 text-sm text-muted-foreground sm:px-6"
}, np = { class: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" }, ap = {
  key: 0,
  class: "flex flex-wrap gap-x-4 gap-y-1",
  "aria-label": "Footer"
}, F6 = /* @__PURE__ */ L({
  __name: "AppPageFooter",
  props: {
    host: { type: Boolean }
  },
  setup(e) {
    const o = e, a = Xt(), r = (/* @__PURE__ */ new Date()).getFullYear(), s = y(() => a.props.panel?.brand || a.props.panelBrand || a.props.name || "Panel"), i = y(() => {
      const f = a.props.panel;
      return Array.isArray(f?.footerLinks) ? f.footerLinks : [];
    }), d = wt(
      oa,
      y(() => !1)
    ), u = y(() => !o.host && x(d) === !0);
    return (f, v) => u.value ? b("", !0) : (t(), n("footer", tp, [
      l("div", np, [
        l("p", null, "© " + c(x(r)) + " " + c(s.value), 1),
        i.value.length ? (t(), n("nav", ap, [
          (t(!0), n(_, null, j(i.value, (m) => (t(), T(x(Rt), {
            key: m.href,
            href: m.href,
            class: "hover:text-foreground"
          }, {
            default: O(() => [
              U(c(m.label), 1)
            ]),
            _: 2
          }, 1032, ["href"]))), 128))
        ])) : b("", !0)
      ])
    ]));
  }
}), lp = { class: "flex shrink-0 flex-col items-center" }, op = {
  key: 0,
  class: "absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-800 dark:bg-neutral-700",
  "aria-hidden": "true"
}, N6 = /* @__PURE__ */ L({
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
    return (i, d) => (t(), n("div", lp, [
      l("div", {
        class: z(["relative box-content shadow-2xl", r.value]),
        style: ie({ width: `${e.width}px`, height: `${e.height}px` })
      }, [
        e.notch && !a.value ? (t(), n("div", op)) : b("", !0),
        l("div", {
          class: z(["size-full overflow-hidden bg-white", s.value])
        }, [
          q(i.$slots, "default")
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
}), sp = { class: "flex flex-col gap-6 text-center sm:text-left" }, rp = { class: "text-foreground text-xl font-semibold" }, ip = {
  key: 0,
  class: "flex flex-col gap-2"
}, dp = { class: "text-foreground font-medium" }, up = {
  key: 0,
  class: "text-muted-foreground"
}, cp = {
  key: 1,
  class: "flex flex-col gap-2"
}, fp = { class: "flex flex-col gap-1" }, mp = {
  key: 2,
  class: "flex flex-wrap justify-center gap-2 sm:justify-start"
}, R6 = /* @__PURE__ */ L({
  __name: "PkSetupWizardCompletion",
  props: {
    heading: {},
    summary: { default: () => [] },
    nextSteps: { default: () => [] },
    actions: { default: () => [] },
    linkComponent: { default: "a" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", sp, [
      l("h1", rp, c(e.heading), 1),
      e.summary.length ? (t(), n("ul", ip, [
        (t(!0), n(_, null, j(e.summary, (r, s) => (t(), n("li", {
          key: s,
          class: "flex items-baseline gap-2 text-sm"
        }, [
          l("span", dp, c(r.label), 1),
          r.detail ? (t(), n("span", up, "– " + c(r.detail), 1)) : b("", !0)
        ]))), 128))
      ])) : b("", !0),
      e.nextSteps.length ? (t(), n("div", cp, [
        a[0] || (a[0] = l("p", { class: "text-foreground text-sm font-medium" }, "Next steps", -1)),
        l("ul", fp, [
          (t(!0), n(_, null, j(e.nextSteps, (r, s) => (t(), n("li", { key: s }, [
            (t(), T(Ce(e.linkComponent), {
              href: r.href,
              class: "text-primary text-sm hover:underline"
            }, {
              default: O(() => [
                U(c(r.label), 1)
              ]),
              _: 2
            }, 1032, ["href"]))
          ]))), 128))
        ])
      ])) : b("", !0),
      e.actions.length ? (t(), n("div", mp, [
        (t(!0), n(_, null, j(e.actions, (r, s) => (t(), T(Ce(e.linkComponent), {
          key: s,
          href: r.href,
          class: z(x(Ye)({ variant: r.primary ? "default" : "outline" }))
        }, {
          default: O(() => [
            U(c(r.label), 1)
          ]),
          _: 2
        }, 1032, ["href", "class"]))), 128))
      ])) : b("", !0)
    ]));
  }
}), pp = {
  key: 0,
  class: "flex justify-end"
}, vp = {
  key: 1,
  class: "flex flex-col gap-2"
}, gp = ["onDrop"], hp = ["aria-label", "onDragstart"], bp = ["onClick"], yp = { class: "font-medium" }, xp = {
  key: 0,
  class: "text-muted-foreground ml-2 truncate"
}, kp = {
  key: 2,
  class: "min-w-0 flex-1"
}, $p = {
  key: 1,
  class: "grid grid-cols-1 gap-3 sm:grid-cols-2"
}, wp = ["aria-label", "onClick"], Cp = ["disabled", "aria-label", "onClick"], Sp = ["disabled", "aria-label", "onClick"], Mp = ["disabled", "title", "aria-label", "onClick"], Bp = ["disabled", "title", "aria-label", "onClick"], Ap = {
  key: 0,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, zp = ["disabled"], _p = {
  key: 2,
  class: "flex flex-col gap-2"
}, Pp = {
  key: 0,
  class: "overflow-x-auto rounded-md border"
}, Lp = { class: "w-full text-sm" }, Op = { class: "bg-muted/40" }, jp = {
  key: 0,
  class: "w-8 border-b px-2 py-1.5"
}, Vp = {
  key: 0,
  class: "text-destructive",
  "aria-hidden": "true"
}, Dp = ["onDrop"], Tp = {
  key: 0,
  class: "px-2 py-1.5 align-top"
}, Ip = ["aria-label", "onDragstart"], Ep = { class: "px-2 py-1.5 align-top" }, Fp = { class: "mt-0.5 flex items-center gap-0.5" }, Np = ["disabled", "aria-label", "onClick"], Rp = ["disabled", "aria-label", "onClick"], Up = ["disabled", "title", "aria-label", "onClick"], Hp = ["disabled", "title", "aria-label", "onClick"], Kp = {
  key: 1,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, qp = ["disabled"], U6 = /* @__PURE__ */ L({
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
    const i = K(d(a.modelValue));
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
    function f() {
      r("update:modelValue", u());
    }
    const v = y(() => a.maxItems !== null && i.value.length >= a.maxItems), m = y(() => a.minItems !== null && i.value.length <= a.minItems), h = y(() => a.children.length === 1);
    function M() {
      if (v.value || a.disabled || !a.addable)
        return;
      const H = {};
      for (const N of a.children)
        H[N.key] = null;
      i.value.push({ uid: s++, data: H });
    }
    function $(H) {
      i.value = i.value.filter((N) => N.uid !== H), f();
    }
    function C(H) {
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
      P.splice(N + 1, 0, { uid: s++, data: X }), i.value = P, f();
    }
    function k(H, N) {
      const R = H + N;
      if (R < 0 || R >= i.value.length)
        return;
      const X = [...i.value], [P] = X.splice(H, 1);
      X.splice(R, 0, P), i.value = X, f();
    }
    function A(H, N, R) {
      const X = i.value.find((P) => P.uid === H);
      X && (X.data[N] = R, f());
    }
    function B(H, N) {
      return a.errors[`${a.fieldKey}.${H}.${N}`];
    }
    const w = K(/* @__PURE__ */ new Set());
    function p(H) {
      return a.collapsible && w.value.has(H);
    }
    function g(H) {
      const N = new Set(w.value);
      N.has(H) ? N.delete(H) : N.add(H), w.value = N;
    }
    const S = y(
      () => i.value.length > 0 && i.value.every((H) => w.value.has(H.uid))
    );
    function F() {
      w.value = S.value ? /* @__PURE__ */ new Set() : new Set(i.value.map((H) => H.uid));
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
    const Y = K(null);
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
      X.splice(J, 0, V), i.value = X, f();
    }
    return (H, N) => (t(), n(_, null, [
      !e.table && e.collapsible && i.value.length > 1 ? (t(), n("div", pp, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-xs font-medium",
          onClick: F
        }, c(S.value ? "Expand all" : "Collapse all"), 1)
      ])) : b("", !0),
      e.table ? (t(), n("div", _p, [
        i.value.length ? (t(), n("div", Pp, [
          l("table", Lp, [
            l("thead", null, [
              l("tr", Op, [
                e.disabled ? b("", !0) : (t(), n("th", jp, [...N[9] || (N[9] = [
                  l("span", { class: "sr-only" }, "Reorder", -1)
                ])])),
                (t(!0), n(_, null, j(e.children, (R) => (t(), n("th", {
                  key: R.key,
                  class: "text-muted-foreground border-b px-2 py-1.5 text-left text-xs font-medium"
                }, [
                  U(c(R.label) + " ", 1),
                  R.required ? (t(), n("span", Vp, "*")) : b("", !0)
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
                onDragover: N[1] || (N[1] = ge(() => {
                }, ["prevent"])),
                onDrop: (P) => W(R.uid, P)
              }, [
                e.disabled ? b("", !0) : (t(), n("td", Tp, [
                  l("button", {
                    type: "button",
                    class: "text-muted-foreground/60 hover:text-muted-foreground mt-0.5 flex size-6 cursor-grab items-center justify-center active:cursor-grabbing",
                    draggable: "true",
                    "aria-label": `Drag to reorder ${e.itemLabel} ${X + 1}`,
                    onDragstart: (P) => G(R.uid, P),
                    onDragend: Z
                  }, [...N[11] || (N[11] = [
                    ut('<svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.4"></circle><circle cx="15" cy="6" r="1.4"></circle><circle cx="9" cy="12" r="1.4"></circle><circle cx="15" cy="12" r="1.4"></circle><circle cx="9" cy="18" r="1.4"></circle><circle cx="15" cy="18" r="1.4"></circle></svg>', 1)
                  ])], 40, Ip)
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
                    error: B(X, P.key),
                    options: e.childOptions[P.key] ?? [],
                    onChange: (J) => A(R.uid, P.key, J)
                  }, null, 8, ["field", "value", "error", "options", "onChange"])
                ]))), 128)),
                l("td", Ep, [
                  l("div", Fp, [
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || X === 0,
                      "aria-label": `Move ${e.itemLabel} ${X + 1} up`,
                      onClick: (P) => k(X, -1)
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
                    ])], 8, Np),
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || X === i.value.length - 1,
                      "aria-label": `Move ${e.itemLabel} ${X + 1} down`,
                      onClick: (P) => k(X, 1)
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
                    ])], 8, Rp),
                    e.cloneable ? (t(), n("button", {
                      key: 0,
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || v.value,
                      title: v.value ? `At most ${e.maxItems} allowed` : void 0,
                      "aria-label": `Duplicate ${e.itemLabel} ${X + 1}`,
                      onClick: (P) => C(R.uid)
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
                    ])], 8, Up)) : b("", !0),
                    e.deletable ? (t(), n("button", {
                      key: 1,
                      type: "button",
                      class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || m.value,
                      title: m.value ? `At least ${e.minItems} required` : void 0,
                      "aria-label": `Remove ${e.itemLabel} ${X + 1}`,
                      onClick: (P) => $(R.uid)
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
                    ])], 8, Hp)) : b("", !0)
                  ])
                ])
              ], 42, Dp))), 128))
            ])
          ])
        ])) : (t(), n("p", Kp, " No " + c(e.itemLabel.toLowerCase()) + "s yet. ", 1)),
        !v.value && e.addable ? (t(), n("button", {
          key: 2,
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled,
          onClick: M
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
          U(" Add " + c(e.itemLabel.toLowerCase()), 1)
        ], 8, qp)) : b("", !0)
      ])) : (t(), n("div", vp, [
        (t(!0), n(_, null, j(i.value, (R, X) => (t(), n("div", {
          key: R.uid,
          class: z(["flex items-start gap-2", Y.value === R.uid ? "opacity-40" : ""]),
          onDragover: N[0] || (N[0] = ge(() => {
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
          ])], 42, hp)),
          l("span", {
            class: z(["bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums", h.value ? "mt-1.5" : "mt-0.5"]),
            "aria-hidden": "true"
          }, c(X + 1), 3),
          p(R.uid) ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "hover:bg-accent min-w-0 flex-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
            onClick: (P) => g(R.uid)
          }, [
            l("span", yp, c(e.itemLabel) + " " + c(X + 1), 1),
            D(R) ? (t(), n("span", xp, c(D(R)), 1)) : b("", !0)
          ], 8, bp)) : (t(), n("div", kp, [
            h.value ? (t(), T(We, {
              key: 0,
              field: {
                ...e.children[0],
                disabled: e.children[0].disabled || e.disabled,
                labelHidden: !0
              },
              value: R.data[e.children[0].key],
              error: B(X, e.children[0].key),
              options: e.childOptions[e.children[0].key] ?? [],
              onChange: (P) => A(R.uid, e.children[0].key, P)
            }, null, 8, ["field", "value", "error", "options", "onChange"])) : (t(), n("div", $p, [
              (t(!0), n(_, null, j(e.children, (P) => (t(), T(We, {
                key: P.key,
                field: { ...P, disabled: P.disabled || e.disabled },
                value: R.data[P.key],
                error: B(X, P.key),
                options: e.childOptions[P.key] ?? [],
                onChange: (J) => A(R.uid, P.key, J)
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
            ], 8, wp)) : b("", !0),
            l("button", {
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || X === 0,
              "aria-label": `Move ${e.itemLabel} ${X + 1} up`,
              onClick: (P) => k(X, -1)
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
            ])], 8, Cp),
            l("button", {
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || X === i.value.length - 1,
              "aria-label": `Move ${e.itemLabel} ${X + 1} down`,
              onClick: (P) => k(X, 1)
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
            ])], 8, Sp),
            e.cloneable ? (t(), n("button", {
              key: 1,
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || v.value,
              title: v.value ? `At most ${e.maxItems} allowed` : void 0,
              "aria-label": `Duplicate ${e.itemLabel} ${X + 1}`,
              onClick: (P) => C(R.uid)
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
            ])], 8, Mp)) : b("", !0),
            e.deletable ? (t(), n("button", {
              key: 2,
              type: "button",
              class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || m.value,
              title: m.value ? `At least ${e.minItems} required` : void 0,
              "aria-label": `Remove ${e.itemLabel} ${X + 1}`,
              onClick: (P) => $(R.uid)
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
            ])], 8, Bp)) : b("", !0)
          ], 2)
        ], 42, gp))), 128)),
        i.value.length === 0 ? (t(), n("p", Ap, " No " + c(e.itemLabel.toLowerCase()) + "s yet. ", 1)) : b("", !0),
        !v.value && e.addable ? (t(), n("button", {
          key: 1,
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled,
          onClick: M
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
          U(" Add " + c(e.itemLabel.toLowerCase()), 1)
        ], 8, zp)) : b("", !0)
      ]))
    ], 64));
  }
}), Gp = { class: "space-y-1" }, Wp = { class: "flex items-center gap-1" }, Zp = ["disabled", "title", "aria-label", "onClick"], Jp = ["aria-pressed"], Yp = ["id", "value", "rows", "disabled"], Qp = ["innerHTML"], Xp = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(!1), i = y(() => a.modelValue ?? "");
    function d(h) {
      return h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    const u = y(
      () => d(i.value).replace(/^### (.*)$/gm, '<h3 class="font-semibold">$1</h3>').replace(/^## (.*)$/gm, '<h2 class="font-semibold text-lg">$1</h2>').replace(/^# (.*)$/gm, '<h1 class="font-semibold text-xl">$1</h1>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*]+?)\*/g, "$1<em>$2</em>").replace(/`([^`]+?)`/g, '<code class="bg-muted rounded px-1">$1</code>').replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" class="underline">$1</a>').replace(/^[-*] (.*)$/gm, '<li class="ml-4 list-disc">$1</li>').replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>")
    );
    function f(h, M = h) {
      const $ = document.getElementById(a.id ?? "");
      if ($ === null)
        return;
      const C = $.selectionStart, k = $.selectionEnd, A = i.value.slice(C, k);
      r(
        "update:modelValue",
        `${i.value.slice(0, C)}${h}${A}${M}${i.value.slice(k)}`
      );
    }
    const v = {
      bold: { label: "B", run: () => f("**") },
      italic: { label: "I", run: () => f("*") },
      code: { label: "</>", run: () => f("`") },
      heading: { label: "H", run: () => f("## ", "") },
      list: { label: "•", run: () => f("- ", "") },
      link: { label: "🔗", run: () => f("[", "](https://)") }
    }, m = y(
      () => (a.toolbar ?? Object.keys(v)).filter((h) => h in v)
    );
    return (h, M) => (t(), n("div", Gp, [
      l("div", Wp, [
        (t(!0), n(_, null, j(m.value, ($) => (t(), n("button", {
          key: $,
          type: "button",
          disabled: e.disabled,
          title: $,
          "aria-label": $,
          class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-50",
          onClick: (C) => v[$].run()
        }, c(v[$].label), 9, Zp))), 128)),
        l("button", {
          type: "button",
          class: "hover:bg-accent ml-auto rounded border px-2 py-0.5 text-xs",
          "aria-pressed": s.value,
          onClick: M[0] || (M[0] = ($) => s.value = !s.value)
        }, " Preview ", 8, Jp)
      ]),
      s.value ? (t(), n("div", {
        key: 1,
        class: "bg-card min-h-32 rounded-md border px-3 py-2 text-sm",
        innerHTML: u.value
      }, null, 8, Qp)) : (t(), n("textarea", {
        key: 0,
        id: e.id,
        value: i.value,
        rows: e.rows,
        disabled: e.disabled,
        class: "bg-card w-full resize-y rounded-md border px-3 py-2 font-mono text-sm outline-none",
        onInput: M[1] || (M[1] = ($) => r("update:modelValue", $.target.value))
      }, null, 40, Yp))
    ]));
  }
}), ev = { class: "space-y-1" }, tv = { class: "bg-card flex overflow-hidden rounded-md border font-mono text-xs" }, nv = {
  "aria-hidden": "true",
  class: "text-muted-foreground bg-muted/40 shrink-0 border-r px-2 py-2 text-right leading-5 select-none"
}, av = ["id", "value", "rows", "disabled"], lv = { class: "text-muted-foreground text-xs font-normal" }, ov = {
  key: 0,
  class: "text-destructive text-xs"
}, sv = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(null), i = K(!0), d = y(() => a.modelValue ?? ""), u = y(() => Math.max(d.value.split(`
`).length, 1)), f = y(() => {
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
      const M = h.target, $ = M.selectionStart, C = M.selectionEnd, k = `${d.value.slice(0, $)}    ${d.value.slice(C)}`;
      r("update:modelValue", k), requestAnimationFrame(() => {
        M.selectionStart = M.selectionEnd = $ + 4;
      });
    }
    return (h, M) => (t(), n("div", ev, [
      l("div", tv, [
        l("div", nv, [
          (t(!0), n(_, null, j(u.value, ($) => (t(), n("div", { key: $ }, c($), 1))), 128))
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
        }, null, 40, av)
      ]),
      l("p", lv, c(e.language === "plain" ? "Plain text" : e.language.toUpperCase()) + ". Tab indents; press Escape first to move focus out. ", 1),
      f.value ? (t(), n("p", ov, c(f.value), 1)) : b("", !0)
    ]));
  }
}), rv = { class: "space-y-3" }, iv = { class: "flex items-center justify-between gap-2 border-b px-3 py-2" }, dv = { class: "text-sm font-medium" }, uv = { class: "flex items-center gap-1" }, cv = ["disabled", "onClick"], fv = ["disabled", "onClick"], mv = ["disabled", "onClick"], pv = { class: "space-y-3 p-3" }, vv = { class: "flex flex-wrap items-center gap-2" }, gv = ["disabled", "onClick"], hv = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, H6 = /* @__PURE__ */ L({
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
      () => Object.fromEntries(a.blocks.map((M) => [M.type, M]))
    ), d = y(() => a.maxBlocks !== null && s.value.length >= a.maxBlocks);
    function u(M) {
      r("update:modelValue", M);
    }
    function f(M) {
      d.value || u([...s.value, { type: M, data: {} }]);
    }
    function v(M) {
      u(s.value.filter(($, C) => C !== M));
    }
    function m(M, $) {
      const C = M + $;
      if (C < 0 || C >= s.value.length)
        return;
      const k = [...s.value], [A] = k.splice(M, 1);
      k.splice(C, 0, A), u(k);
    }
    function h(M, $, C) {
      u(
        s.value.map(
          (k, A) => A === M ? { ...k, data: { ...k.data, [$]: C } } : k
        )
      );
    }
    return (M, $) => (t(), n("div", rv, [
      (t(!0), n(_, null, j(s.value, (C, k) => (t(), n("div", {
        key: `${C.type}-${k}`,
        class: "bg-card rounded-lg border"
      }, [
        l("div", iv, [
          l("span", dv, c(i.value[C.type]?.label ?? C.type), 1),
          l("div", uv, [
            l("button", {
              type: "button",
              class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-40",
              disabled: e.disabled || k === 0,
              "aria-label": "Move up",
              onClick: (A) => m(k, -1)
            }, " ↑ ", 8, cv),
            l("button", {
              type: "button",
              class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-40",
              disabled: e.disabled || k === s.value.length - 1,
              "aria-label": "Move down",
              onClick: (A) => m(k, 1)
            }, " ↓ ", 8, fv),
            l("button", {
              type: "button",
              class: "text-destructive hover:bg-accent rounded border px-2 py-0.5 text-xs",
              disabled: e.disabled,
              "aria-label": "Remove block",
              onClick: (A) => v(k)
            }, " Remove ", 8, mv)
          ])
        ]),
        l("div", pv, [
          (t(!0), n(_, null, j(i.value[C.type]?.fields ?? [], (A) => (t(), T(We, {
            key: A.key,
            field: A,
            value: C.data[A.key] ?? null,
            error: e.errors?.[A.key],
            processing: e.disabled,
            onChange: (B) => h(k, A.key, B)
          }, null, 8, ["field", "value", "error", "processing", "onChange"]))), 128))
        ])
      ]))), 128)),
      l("div", vv, [
        (t(!0), n(_, null, j(e.blocks, (C) => (t(), n("button", {
          key: C.type,
          type: "button",
          class: "hover:bg-accent rounded-md border px-2.5 py-1 text-sm disabled:opacity-50",
          disabled: e.disabled || d.value,
          onClick: (k) => f(C.type)
        }, " + " + c(C.label), 9, gv))), 128)),
        d.value ? (t(), n("span", hv, c(e.maxBlocks) + " is the maximum here. ", 1)) : b("", !0)
      ])
    ]));
  }
}), bv = ["name", "value", "checked", "disabled", "onChange"], yv = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, xv = /* @__PURE__ */ L({
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
          onChange: (f) => r("update:modelValue", u.value)
        }, null, 40, bv),
        U(" " + c(u.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", yv, " Nothing to choose from yet. ")) : b("", !0)
    ], 2));
  }
}), kv = ["value", "checked", "disabled", "onChange"], $v = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, wv = /* @__PURE__ */ L({
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
    function i(f) {
      return s.value.some((v) => v == f.value);
    }
    function d(f) {
      r(
        "update:modelValue",
        i(f) ? s.value.filter((v) => v != f.value) : [...s.value, f.value]
      );
    }
    const u = y(
      () => a.field.columns && a.field.columns > 1 ? { gridTemplateColumns: `repeat(${a.field.columns}, minmax(0, 1fr))` } : void 0
    );
    return (f, v) => (t(), n("div", {
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
        }, null, 40, kv),
        U(" " + c(m.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", $v, " Nothing to choose from yet. ")) : b("", !0)
    ], 4));
  }
}), Cv = { class: "flex flex-col gap-1.5" }, Sv = ["aria-label", "onClick"], Mv = ["placeholder", "disabled", "maxlength"], Bv = {
  key: 0,
  class: "flex flex-wrap items-center gap-1.5"
}, Av = ["onClick"], zv = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal"
}, _v = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkTagsInput",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(""), i = y(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    ), d = y(() => i.value.length >= (a.field.max ?? 25)), u = y(
      () => (a.field.suggestions ?? []).filter(
        (h) => !i.value.some((M) => M.toLowerCase() === h.toLowerCase())
      )
    );
    function f(h) {
      const M = h.trim().slice(0, a.field.maxLength ?? 40);
      if (M === "" || d.value) {
        s.value = "";
        return;
      }
      if (i.value.some(($) => $.toLowerCase() === M.toLowerCase())) {
        s.value = "";
        return;
      }
      r("update:modelValue", [...i.value, M]), s.value = "";
    }
    function v(h) {
      r(
        "update:modelValue",
        i.value.filter((M, $) => $ !== h)
      );
    }
    function m(h) {
      if (h.key === "Enter" || h.key === ",") {
        h.preventDefault(), f(s.value);
        return;
      }
      h.key === "Backspace" && s.value === "" && i.value.length > 0 && v(i.value.length - 1);
    }
    return (h, M) => (t(), n("div", Cv, [
      l("div", {
        class: z(["border-input bg-background flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5", e.disabled ? "opacity-50" : ""])
      }, [
        (t(!0), n(_, null, j(i.value, ($, C) => (t(), n("span", {
          key: `${$}-${C}`,
          class: "bg-muted flex items-center gap-1 rounded px-2 py-0.5 text-xs"
        }, [
          U(c($) + " ", 1),
          e.disabled ? b("", !0) : (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground",
            "aria-label": `Remove ${$}`,
            onClick: (k) => v(C)
          }, " × ", 8, Sv))
        ]))), 128)),
        he(l("input", {
          "onUpdate:modelValue": M[0] || (M[0] = ($) => s.value = $),
          type: "text",
          class: "min-w-24 flex-1 bg-transparent text-sm outline-none",
          placeholder: d.value ? "" : e.field.placeholder ?? "Add a tag…",
          disabled: e.disabled || d.value,
          maxlength: e.field.maxLength ?? 40,
          onKeydown: m,
          onBlur: M[1] || (M[1] = ($) => f(s.value))
        }, null, 40, Mv), [
          [ze, s.value]
        ])
      ], 2),
      u.value.length > 0 && !d.value && !e.disabled ? (t(), n("div", Bv, [
        M[2] || (M[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "Suggestions:", -1)),
        (t(!0), n(_, null, j(u.value, ($) => (t(), n("button", {
          key: $,
          type: "button",
          class: "hover:bg-accent rounded border px-2 py-0.5 text-xs",
          onClick: (C) => f($)
        }, c($), 9, Av))), 128))
      ])) : b("", !0),
      d.value ? (t(), n("p", zv, " That is the maximum of " + c(e.field.max ?? 25) + " tags. ", 1)) : b("", !0)
    ]));
  }
}), Pv = 4.5, An = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function sa(e) {
  let o = e.replace("#", "");
  return o.length === 3 && (o = o[0] + o[0] + o[1] + o[1] + o[2] + o[2]), [parseInt(o.slice(0, 2), 16), parseInt(o.slice(2, 4), 16), parseInt(o.slice(4, 6), 16)];
}
function It(e) {
  const o = e / 255;
  return o <= 0.03928 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4;
}
function Jt(e) {
  const [o, a, r] = sa(e);
  return 0.2126 * It(o) + 0.7152 * It(a) + 0.0722 * It(r);
}
function ra(e, o) {
  const a = Jt(e), r = Jt(o);
  return (Math.max(a, r) + 0.05) / (Math.min(a, r) + 0.05);
}
function Lv(e, o, a) {
  if (!An.test(e) || !An.test(o))
    return e;
  const r = Jt(o) > 0.5, s = r ? 0 : 255;
  let i = sa(e);
  for (let d = 0; d <= 20; d++) {
    const u = Ov(i);
    if (ra(u, o) >= a)
      return u;
    i = i.map((f) => f + (s - f) * 0.15);
  }
  return r ? "#000000" : "#ffffff";
}
function Ov(e) {
  return "#" + e.map(
    (o) => Math.round(Math.max(0, Math.min(255, o))).toString(16).padStart(2, "0")
  ).join("");
}
const jv = { class: "flex flex-col gap-2" }, Vv = { class: "flex items-center gap-2" }, Dv = {
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
}, Tv = ["value", "disabled", "aria-label"], Iv = ["value", "disabled", "placeholder"], Ev = {
  key: 0,
  class: "flex flex-wrap gap-1.5"
}, Fv = ["aria-label", "title", "onClick"], Nv = {
  key: 1,
  class: "text-amber-600 dark:text-amber-500 flex flex-wrap items-center gap-2 text-xs"
}, Rv = /* @__PURE__ */ L({
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
    function u($) {
      const C = $.trim();
      if (C === "")
        return "";
      const k = C.startsWith("#") ? C : `#${C}`;
      return s.test(k) ? k.toLowerCase() : C;
    }
    function f($) {
      r("update:modelValue", u($.target.value));
    }
    const v = y(() => !d.value || !a.field.contrastBackground || !s.test(a.field.contrastBackground) ? null : ra(i.value, a.field.contrastBackground)), m = y(() => a.field.contrastMinRatio ?? Pv), h = y(() => v.value !== null && v.value < m.value);
    function M() {
      a.field.contrastBackground && r(
        "update:modelValue",
        Lv(i.value, a.field.contrastBackground, m.value)
      );
    }
    return ($, C) => (t(), n("div", jv, [
      l("div", Vv, [
        d.value ? (t(), n("input", {
          key: 1,
          type: "color",
          class: "border-input size-9 shrink-0 cursor-pointer rounded-md border bg-transparent",
          value: i.value,
          disabled: e.disabled,
          "aria-label": `Colour for ${e.field.key}`,
          onInput: C[0] || (C[0] = (k) => r("update:modelValue", k.target.value))
        }, null, 40, Tv)) : (t(), n("span", Dv)),
        l("input", {
          type: "text",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
          value: i.value,
          disabled: e.disabled,
          placeholder: e.field.placeholder ?? "#1e90ff",
          spellcheck: "false",
          onInput: f
        }, null, 40, Iv)
      ]),
      (e.field.presets ?? []).length > 0 && !e.disabled ? (t(), n("div", Ev, [
        (t(!0), n(_, null, j(e.field.presets, (k) => (t(), n("button", {
          key: k,
          type: "button",
          class: z(["size-6 rounded border", i.value.toLowerCase() === k.toLowerCase() ? "ring-ring ring-2" : ""]),
          style: ie({ backgroundColor: k }),
          "aria-label": k,
          title: k,
          onClick: (A) => r("update:modelValue", k.toLowerCase())
        }, null, 14, Fv))), 128))
      ])) : b("", !0),
      h.value ? (t(), n("p", Nv, [
        l("span", null, " This fails contrast at " + c(v.value.toFixed(1)) + ":1 - it needs at least " + c(m.value.toFixed(1)) + ":1 to stay readable. ", 1),
        e.disabled ? b("", !0) : (t(), n("button", {
          key: 0,
          type: "button",
          class: "font-medium underline underline-offset-2",
          onClick: M
        }, " Use a readable shade "))
      ])) : b("", !0)
    ]));
  }
}), Uv = ["aria-disabled"], Hv = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(null);
    let i = null, d = null, u = null;
    const f = y(() => {
      const M = a.modelValue?.[a.latKey], $ = a.modelValue?.[a.lngKey];
      return typeof M == "number" && typeof $ == "number" ? { lat: M, lng: $ } : a.center ? a.center : a.markers.length > 0 ? { lat: a.markers[0].lat, lng: a.markers[0].lng } : { lat: 0, lng: 0 };
    });
    async function v() {
      if (!s.value || i)
        return;
      const M = await import("leaflet");
      await import("leaflet/dist/leaflet.css"), u = M, i = M.map(s.value).setView([f.value.lat, f.value.lng], a.zoom), M.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19
      }).addTo(i), m(), h(), a.pickable && !a.disabled && i.on("click", ($) => {
        r("update:modelValue", {
          [a.latKey]: Number($.latlng.lat.toFixed(6)),
          [a.lngKey]: Number($.latlng.lng.toFixed(6))
        });
      });
    }
    function m() {
      if (!(!i || !u))
        for (const M of a.markers) {
          const $ = u.circleMarker([M.lat, M.lng], {
            radius: 7,
            color: "hsl(var(--primary))",
            fillColor: "hsl(var(--primary))",
            fillOpacity: 0.85
          }).addTo(i);
          (M.label || M.popup) && $.bindPopup(
            `<strong>${M.label ?? ""}</strong>${M.popup ? `<br>${M.popup}` : ""}`
          );
        }
    }
    function h() {
      if (!i || !u)
        return;
      const M = a.modelValue?.[a.latKey], $ = a.modelValue?.[a.lngKey];
      if (typeof M != "number" || typeof $ != "number") {
        d && (i.removeLayer(d), d = null);
        return;
      }
      d ? d.setLatLng([M, $]) : d = u.circleMarker([M, $], {
        radius: 8,
        color: "#0f172a",
        fillColor: "#38bdf8",
        fillOpacity: 1,
        weight: 2
      }).addTo(i), i.setView([M, $], i.getZoom());
    }
    return be(() => {
      v();
    }), ke(() => {
      i?.remove(), i = null, d = null;
    }), pe(
      () => a.modelValue,
      () => h(),
      { deep: !0 }
    ), (M, $) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "border-input bg-muted/20 w-full overflow-hidden rounded-md border",
      style: ie({ height: `${e.height}px` }),
      "aria-disabled": e.disabled || void 0
    }, null, 12, Uv));
  }
}), Kv = { class: "flex flex-col gap-2" }, qv = { class: "text-muted-foreground text-xs font-normal" }, Gv = /* @__PURE__ */ L({
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
    return (u, f) => (t(), n("div", Kv, [
      I(Hv, {
        "model-value": s.value,
        center: e.field.defaultCenter ?? null,
        zoom: e.field.zoom ?? 12,
        height: e.field.height ?? 280,
        "lat-key": i.value,
        "lng-key": d.value,
        disabled: e.disabled,
        pickable: "",
        "onUpdate:modelValue": f[0] || (f[0] = (v) => r("update:modelValue", v))
      }, null, 8, ["model-value", "center", "zoom", "height", "lat-key", "lng-key", "disabled"]),
      l("p", qv, [
        U(" Click the map to set " + c(i.value) + " / " + c(d.value) + " ", 1),
        s.value ? (t(), n(_, { key: 0 }, [
          U(" (" + c(s.value[i.value]?.toFixed?.(5) ?? s.value[i.value]) + ", " + c(s.value[d.value]?.toFixed?.(5) ?? s.value[d.value]) + ") ", 1)
        ], 64)) : b("", !0)
      ])
    ]));
  }
}), Wv = { class: "flex flex-col gap-2" }, Zv = ["width", "height"], Jv = ["value", "disabled"], Yv = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal"
}, Qv = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(null), i = y(() => {
      if (a.field.from) {
        const f = a.values?.[a.field.from];
        return f == null ? "" : String(f);
      }
      return a.modelValue == null ? "" : String(a.modelValue);
    }), d = y(() => a.field.size ?? 160);
    async function u() {
      if (!s.value)
        return;
      const f = i.value;
      if (f === "") {
        s.value.getContext("2d")?.clearRect(0, 0, d.value, d.value);
        return;
      }
      await (await import("qrcode")).toCanvas(s.value, f, {
        width: d.value,
        margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" }
      });
    }
    return be(() => {
      u();
    }), pe(i, () => {
      u();
    }), (f, v) => (t(), n("div", Wv, [
      l("canvas", {
        ref_key: "canvas",
        ref: s,
        class: "border-input bg-background rounded-md border",
        width: d.value,
        height: d.value
      }, null, 8, Zv),
      e.field.from ? (t(), n("p", Yv, "From " + c(e.field.from), 1)) : (t(), n("input", {
        key: 0,
        type: "text",
        class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
        value: e.modelValue == null ? "" : String(e.modelValue),
        disabled: e.disabled,
        placeholder: "QR payload",
        onInput: v[0] || (v[0] = (m) => r("update:modelValue", m.target.value))
      }, null, 40, Jv))
    ]));
  }
}), Xv = { class: "flex flex-col gap-2" }, eg = { class: "border-input bg-background inline-flex min-h-16 items-center justify-center overflow-x-auto rounded-md border p-2" }, tg = ["aria-label"], ng = {
  key: 0,
  class: "text-destructive text-xs"
}, ag = ["value", "disabled"], lg = {
  key: 2,
  class: "text-muted-foreground text-xs font-normal"
}, og = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(null), i = K(null), d = y(() => {
      if (a.field.from) {
        const v = a.values?.[a.field.from];
        return v == null ? "" : String(v);
      }
      return a.modelValue == null ? "" : String(a.modelValue);
    }), u = y(() => (a.field.format ?? "CODE128").toUpperCase());
    async function f() {
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
      f();
    }), pe([d, u], () => {
      f();
    }), (v, m) => (t(), n("div", Xv, [
      l("div", eg, [
        (t(), n("svg", {
          ref_key: "svg",
          ref: s,
          class: "max-w-full",
          role: "img",
          "aria-label": `Barcode ${u.value}`
        }, null, 8, tg))
      ]),
      i.value ? (t(), n("p", ng, c(i.value), 1)) : b("", !0),
      e.field.from ? (t(), n("p", lg, " From " + c(e.field.from) + " (" + c(u.value) + ") ", 1)) : (t(), n("input", {
        key: 1,
        type: "text",
        class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
        value: e.modelValue == null ? "" : String(e.modelValue),
        disabled: e.disabled,
        placeholder: "Barcode value",
        onInput: m[0] || (m[0] = (h) => r("update:modelValue", h.target.value))
      }, null, 40, ag))
    ]));
  }
}), sg = { class: "mr-2 inline-block w-3 opacity-60" }, rg = {
  key: 0,
  class: "text-muted-foreground p-3"
}, ig = /* @__PURE__ */ L({
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
`), f = Math.max(d.length, u.length), v = [];
      for (let m = 0; m < f; m++) {
        const h = d[m], M = u[m];
        if (h === M) {
          h !== void 0 && v.push({ kind: "same", text: h });
          continue;
        }
        h !== void 0 && v.push({ kind: "del", text: h }), M !== void 0 && v.push({ kind: "add", text: M });
      }
      return v;
    });
    return (d, u) => (t(), n("div", {
      class: "border-input bg-background overflow-auto rounded-md border font-mono text-xs leading-5",
      style: ie({ maxHeight: `${(e.field.rows ?? 12) * 1.25}rem` })
    }, [
      (t(!0), n(_, null, j(i.value, (f, v) => (t(), n("div", {
        key: v,
        class: z(["px-2 whitespace-pre-wrap", {
          "bg-destructive/10 text-destructive": f.kind === "del",
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300": f.kind === "add",
          "text-muted-foreground": f.kind === "same"
        }])
      }, [
        l("span", sg, c(f.kind === "add" ? "+" : f.kind === "del" ? "-" : " "), 1),
        U(" " + c(f.text), 1)
      ], 2))), 128)),
      i.value.length === 0 ? (t(), n("p", rg, "No differences.")) : b("", !0)
    ], 4));
  }
}), dg = { class: "flex flex-col gap-3" }, ug = { class: "flex items-center justify-between gap-2" }, cg = { class: "text-sm font-medium" }, fg = { class: "text-muted-foreground grid grid-cols-7 gap-1 text-center text-[10px] uppercase" }, mg = { class: "grid grid-cols-7 gap-1" }, pg = {
  key: 0,
  class: "text-muted-foreground mb-1 text-[10px]"
}, vg = ["title"], K6 = /* @__PURE__ */ L({
  __name: "PkCalendar",
  props: {
    events: {}
  },
  setup(e) {
    const o = e, a = K(/* @__PURE__ */ new Date()), r = y(() => a.value.getFullYear()), s = y(() => a.value.getMonth()), i = y(
      () => a.value.toLocaleString(void 0, { month: "long", year: "numeric" })
    ), d = y(() => {
      const m = /* @__PURE__ */ new Map();
      for (const h of o.events ?? []) {
        const M = m.get(h.date) ?? [];
        M.push(h), m.set(h.date, M);
      }
      return m;
    }), u = y(() => {
      const h = new Date(r.value, s.value, 1).getDay(), M = new Date(r.value, s.value + 1, 0).getDate(), $ = [];
      for (let C = 0; C < h; C++)
        $.push({ day: null, key: `pad-${C}`, events: [] });
      for (let C = 1; C <= M; C++) {
        const k = `${r.value}-${String(s.value + 1).padStart(2, "0")}-${String(C).padStart(2, "0")}`;
        $.push({ day: C, key: k, events: d.value.get(k) ?? [] });
      }
      return $;
    });
    function f() {
      a.value = new Date(r.value, s.value - 1, 1);
    }
    function v() {
      a.value = new Date(r.value, s.value + 1, 1);
    }
    return (m, h) => (t(), n("div", dg, [
      l("div", ug, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-sm",
          onClick: f
        }, " Prev "),
        l("p", cg, c(i.value), 1),
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-sm",
          onClick: v
        }, " Next ")
      ]),
      l("div", fg, [
        (t(), n(_, null, j(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], (M) => l("span", { key: M }, c(M), 1)), 64))
      ]),
      l("div", mg, [
        (t(!0), n(_, null, j(u.value, (M) => (t(), n("div", {
          key: M.key,
          class: z(["border-border/60 min-h-16 rounded-md border p-1", M.day ? "bg-background" : "bg-transparent border-transparent"])
        }, [
          M.day ? (t(), n("p", pg, c(M.day), 1)) : b("", !0),
          (t(!0), n(_, null, j(M.events.slice(0, 3), ($, C) => (t(), n("p", {
            key: `${M.key}-${C}`,
            class: "bg-primary/10 text-foreground mb-0.5 truncate rounded px-1 text-[10px] leading-4",
            title: $.label
          }, c($.label), 9, vg))), 128))
        ], 2))), 128))
      ])
    ]));
  }
}), gg = { class: "flex items-center gap-3" }, hg = ["min", "max", "step", "value", "disabled", "aria-label"], bg = { class: "flex shrink-0 items-center gap-1" }, yg = ["min", "max", "step", "value", "disabled"], xg = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, kg = /* @__PURE__ */ L({
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
    }), f = y(
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
    return (m, h) => (t(), n("div", gg, [
      l("input", {
        type: "range",
        class: "accent-primary h-9 flex-1 cursor-pointer disabled:opacity-50",
        min: s.value,
        max: i.value,
        step: d.value,
        value: u.value,
        disabled: e.disabled,
        "aria-label": `${e.field.key} value`,
        onInput: h[0] || (h[0] = (M) => v(M.target.value))
      }, null, 40, hg),
      l("div", bg, [
        l("input", {
          type: "number",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-20 rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
          min: s.value,
          max: i.value,
          step: d.value,
          value: f.value ? "" : u.value,
          disabled: e.disabled,
          onInput: h[1] || (h[1] = (M) => v(M.target.value))
        }, null, 40, yg),
        e.field.unit ? (t(), n("span", xg, c(e.field.unit), 1)) : b("", !0)
      ])
    ]));
  }
}), ht = /* @__PURE__ */ new Map();
function Et(e, o) {
  ht.set(e, o);
}
function $g(e) {
  return ht.get(e);
}
function q6(e) {
  return ht.has(e);
}
function wg() {
  return [...ht.keys()].sort();
}
function G6() {
  ht.clear();
}
const Cg = ["name", "value", "checked", "disabled", "onChange"], Sg = {
  key: 0,
  class: "flex shrink-0 scale-75 items-center",
  "aria-hidden": "true"
}, Mg = { class: "whitespace-nowrap" }, Bg = {
  key: 0,
  class: "text-muted-foreground px-2 py-1 text-xs"
}, Ag = ["name", "value", "checked", "disabled", "onChange"], zg = {
  class: "bg-muted/40 flex h-16 items-center justify-center overflow-hidden rounded",
  "aria-hidden": "true"
}, _g = {
  key: 1,
  class: "text-destructive px-1 text-center text-[10px] leading-tight"
}, Pg = { class: "text-center text-xs font-medium" }, Lg = {
  key: 0,
  class: "text-muted-foreground col-span-full text-sm"
}, Og = {
  key: 1,
  class: "text-muted-foreground col-span-full text-xs"
}, jg = /* @__PURE__ */ L({
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
      () => a.field.preview ? $g(a.field.preview) : void 0
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
    function f(v) {
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
          f(h) ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          e.disabled ? "" : "cursor-pointer"
        ]])
      }, [
        l("input", {
          type: "radio",
          class: "peer sr-only",
          name: `f-${e.field.key}`,
          value: h.value,
          checked: f(h),
          disabled: e.disabled,
          onChange: (M) => r("update:modelValue", h.value)
        }, null, 40, Cg),
        m[0] || (m[0] = l("span", {
          class: "ring-ring pointer-events-none absolute inset-0 rounded-full peer-focus-visible:ring-2",
          "aria-hidden": "true"
        }, null, -1)),
        s.value ? (t(), n("span", Sg, [
          (t(), T(Ce(s.value), {
            value: h.value,
            label: h.label,
            selected: f(h)
          }, null, 8, ["value", "label", "selected"]))
        ])) : b("", !0),
        l("span", Mg, c(h.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", Bg, " Nothing to choose from yet. ")) : b("", !0)
    ], 2)) : (t(), n("div", {
      key: 1,
      role: "radiogroup",
      class: z(["grid gap-3", u.value])
    }, [
      (t(!0), n(_, null, j(e.options, (h) => (t(), n("label", {
        key: String(h.value),
        class: z(["group relative flex flex-col gap-2 rounded-lg border p-2 transition-colors", [
          f(h) ? "border-primary ring-primary/30 bg-primary/5 ring-2" : "border-border hover:border-muted-foreground/40",
          e.disabled ? "opacity-50" : "cursor-pointer"
        ]])
      }, [
        l("input", {
          type: "radio",
          class: "peer sr-only",
          name: `f-${e.field.key}`,
          value: h.value,
          checked: f(h),
          disabled: e.disabled,
          onChange: (M) => r("update:modelValue", h.value)
        }, null, 40, Ag),
        m[1] || (m[1] = l("span", {
          class: "ring-ring pointer-events-none absolute inset-0 rounded-lg peer-focus-visible:ring-2",
          "aria-hidden": "true"
        }, null, -1)),
        l("span", zg, [
          s.value ? (t(), T(Ce(s.value), {
            key: 0,
            value: h.value,
            label: h.label,
            selected: f(h)
          }, null, 8, ["value", "label", "selected"])) : i.value ? (t(), n("span", _g, " no preview ")) : b("", !0)
        ]),
        l("span", Pg, c(h.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", Lg, " Nothing to choose from yet. ")) : b("", !0),
      i.value && e.options.length > 0 ? (t(), n("p", Og, [
        m[2] || (m[2] = U(" No preview registered for ", -1)),
        l("code", null, c(e.field.preview), 1),
        U(". Registered: " + c(x(wg)().join(", ") || "none") + ". ", 1)
      ])) : b("", !0)
    ], 2));
  }
}), Vg = {
  class: "border-border size-10 overflow-hidden rounded-md border",
  style: {
    backgroundImage: "linear-gradient(45deg, rgba(0,0,0,.10) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.10) 75%), linear-gradient(45deg, rgba(0,0,0,.10) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.10) 75%)",
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 4px 4px"
  }
}, Dg = /* @__PURE__ */ L({
  __name: "PkSwatchPreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), n("span", Vg, [
      l("span", {
        class: "block size-full",
        style: ie({ backgroundColor: String(e.value) })
      }, null, 4)
    ]));
  }
}), Tg = { class: "flex flex-col items-center gap-1 text-center" }, Ig = {
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
    return (s, i) => (t(), n("div", Tg, [
      l("div", {
        class: z(["inline-flex items-center justify-center font-mono font-semibold whitespace-nowrap tabular-nums", [
          r.value,
          e.compact ? "px-2 py-1 text-[10px]" : "px-6 py-3 text-xl tracking-[0.2em]"
        ]]),
        style: ie({ borderColor: a.value, color: a.value })
      }, c(e.code), 7),
      e.caption && !e.compact ? (t(), n("p", Ig, c(e.caption), 1)) : b("", !0)
    ]));
  }
}), Eg = {
  dusk: "document",
  class: "flex flex-col gap-6 bg-white p-8 text-black"
}, Fg = { class: "flex items-center gap-3" }, Ng = ["src"], Rg = {
  key: 0,
  class: "mt-1 text-sm text-neutral-600"
}, Ug = {
  key: 1,
  class: "mt-1 font-mono text-sm text-neutral-600"
}, Hg = {
  key: 0,
  class: "text-right text-sm"
}, Kg = { class: "text-neutral-500" }, qg = { class: "tabular-nums" }, Gg = { key: 1 }, Wg = { class: "text-xs font-semibold tracking-wider text-neutral-500 uppercase" }, Zg = { class: "mt-2 font-medium" }, Jg = { key: 2 }, Yg = { class: "w-full text-sm" }, Qg = { class: "w-full py-3 pr-2" }, Xg = {
  key: 0,
  class: "text-xs text-neutral-500"
}, e1 = { key: 0 }, t1 = ["colspan"], n1 = {
  key: 0,
  class: "mt-6 flex break-inside-avoid justify-end"
}, a1 = { class: "w-64 text-sm" }, l1 = { class: "tabular-nums" }, o1 = {
  key: 3,
  class: "py-2"
}, s1 = { key: 4 }, r1 = { class: "text-xs font-semibold tracking-wider text-neutral-500 uppercase" }, i1 = { class: "mt-2 flex flex-col gap-1 text-sm" }, d1 = {
  key: 6,
  class: "mt-auto border-t border-neutral-200 pt-4 text-xs text-neutral-500"
}, u1 = { key: 0 }, c1 = {
  key: 1,
  class: "mt-1"
}, f1 = {
  key: 7,
  class: "rounded border border-dashed border-red-300 p-2 text-xs text-red-600"
}, m1 = /* @__PURE__ */ L({
  __name: "PkDocument",
  props: {
    document: {}
  },
  setup(e) {
    const o = e;
    function a() {
      return o.document.branding.mono ? "#000000" : o.document.branding.accent;
    }
    function r(f) {
      return f.meta ?? [];
    }
    function s(f) {
      return f.rows ?? [];
    }
    function i(f) {
      return f.totals ?? [];
    }
    function d(f) {
      return f ?? [];
    }
    function u(f) {
      return f ?? "";
    }
    return (f, v) => (t(), n("article", Eg, [
      l("div", Fg, [
        e.document.branding.logoUrl ? (t(), n("img", {
          key: 0,
          src: e.document.branding.logoUrl,
          alt: "",
          class: "max-h-10 max-w-40 object-contain"
        }, null, 8, Ng)) : (t(), n("p", {
          key: 1,
          class: "text-lg font-semibold",
          style: ie({ color: a() })
        }, c(e.document.branding.company), 5))
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
            }, c(m.title), 5),
            m.subtitle ? (t(), n("p", Rg, c(m.subtitle), 1)) : b("", !0),
            m.reference ? (t(), n("p", Ug, c(m.reference), 1)) : b("", !0)
          ]),
          r(m).length ? (t(), n("dl", Hg, [
            (t(!0), n(_, null, j(r(m), (M, $) => (t(), n("div", {
              key: $,
              class: "flex justify-end gap-4 py-0.5"
            }, [
              l("dt", Kg, c(M.label), 1),
              l("dd", qg, c(M.value), 1)
            ]))), 128))
          ])) : b("", !0)
        ], 4)) : m.type === "party" ? (t(), n("section", Gg, [
          l("h2", Wg, c(m.heading), 1),
          l("p", Zg, c(m.name), 1),
          (t(!0), n(_, null, j(d(m.lines), (M, $) => (t(), n("p", {
            key: $,
            class: "text-sm text-neutral-600"
          }, c(M), 1))), 128))
        ])) : m.type === "lines" ? (t(), n("section", Jg, [
          l("table", Yg, [
            l("thead", null, [
              l("tr", {
                class: "border-b-2 text-left",
                style: ie({ borderColor: a() })
              }, [
                (t(!0), n(_, null, j(d(m.columns), (M, $) => (t(), n("th", {
                  key: $,
                  class: z(["pb-2 font-medium", $ > 0 ? "pl-3 text-right whitespace-nowrap" : ""])
                }, c(M), 3))), 128))
              ], 4)
            ]),
            l("tbody", null, [
              (t(!0), n(_, null, j(s(m), (M, $) => (t(), n("tr", {
                key: $,
                class: "border-b border-neutral-200"
              }, [
                l("td", Qg, [
                  l("p", null, c(M.description), 1),
                  M.detail ? (t(), n("p", Xg, c(M.detail), 1)) : b("", !0)
                ]),
                (t(!0), n(_, null, j(M.cells, (C, k) => (t(), n("td", {
                  key: k,
                  class: "py-3 pl-3 text-right whitespace-nowrap tabular-nums"
                }, c(C), 1))), 128))
              ]))), 128)),
              s(m).length === 0 ? (t(), n("tr", e1, [
                l("td", {
                  colspan: d(m.columns).length || 1,
                  class: "py-6 text-center text-neutral-500"
                }, c(m.empty), 9, t1)
              ])) : b("", !0)
            ])
          ]),
          i(m).length ? (t(), n("div", n1, [
            l("dl", a1, [
              (t(!0), n(_, null, j(i(m), (M, $) => (t(), n("div", {
                key: $,
                class: z([
                  "flex justify-between py-1",
                  M.strong ? "mt-1 border-t-2 pt-2 text-base font-semibold" : ""
                ]),
                style: ie(M.strong ? { color: a(), borderColor: a() } : void 0)
              }, [
                l("dt", {
                  class: z(M.strong ? "" : "text-neutral-600")
                }, c(M.label), 3),
                l("dd", l1, c(M.value), 1)
              ], 6))), 128))
            ])
          ])) : b("", !0)
        ])) : m.type === "code" ? (t(), n("section", o1, [
          I(ia, {
            code: u(m.code),
            caption: u(m.caption),
            style: ie(u(m.style)),
            accent: e.document.branding.accent,
            mono: e.document.branding.mono
          }, null, 8, ["code", "caption", "style", "accent", "mono"])
        ])) : m.type === "steps" ? (t(), n("section", s1, [
          l("h2", r1, c(m.heading), 1),
          l("ol", i1, [
            (t(!0), n(_, null, j(d(m.items), (M, $) => (t(), n("li", {
              key: $,
              class: "flex gap-2"
            }, [
              l("span", {
                class: "font-semibold tabular-nums",
                style: ie({ color: a() })
              }, c($ + 1) + ".", 5),
              l("span", null, c(M), 1)
            ]))), 128))
          ])
        ])) : m.type === "note" ? (t(), n("p", {
          key: 5,
          class: z(["text-sm", m.emphasis ? "font-medium" : "text-neutral-600"]),
          style: ie(m.emphasis ? { color: a() } : void 0)
        }, c(m.text), 7)) : m.type === "footer" ? (t(), n("footer", d1, [
          m.text ? (t(), n("p", u1, c(m.text), 1)) : b("", !0),
          d(m.contacts).length ? (t(), n("p", c1, c(d(m.contacts).join(" · ")), 1)) : b("", !0)
        ])) : (t(), n("p", f1, " This document contains a “" + c(m.type) + "” block, which this version cannot draw. ", 1))
      ], 64))), 128))
    ]));
  }
}), p1 = ["aria-label", "title"], v1 = {
  class: "size-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, g1 = {
  key: 1,
  d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
}, W6 = /* @__PURE__ */ L({
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
      (t(), n("svg", v1, [
        r.value ? (t(), n(_, { key: 0 }, [
          d[0] || (d[0] = l("circle", {
            cx: "12",
            cy: "12",
            r: "4"
          }, null, -1)),
          d[1] || (d[1] = l("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" }, null, -1))
        ], 64)) : (t(), n("path", g1))
      ]))
    ], 8, p1));
  }
}), h1 = ["width", "height"], b1 = { key: 0 }, y1 = ["x1", "x2", "y1", "y2"], x1 = ["x", "y"], k1 = ["x1", "x2", "y1", "y2"], $1 = ["x", "y"], w1 = ["x", "y", "width", "height", "fill-opacity", "onMouseenter"], C1 = ["x", "y", "width", "height", "fill", "fill-opacity"], S1 = ["x", "y"], M1 = ["x", "y"], B1 = {
  key: 0,
  class: "bg-popover pointer-events-none absolute top-2 right-2 z-10 min-w-32 rounded-lg border p-2 shadow-lg"
}, A1 = { class: "text-muted-foreground mb-1 text-[11px] capitalize" }, z1 = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, _1 = { class: "text-xs font-semibold tabular-nums" }, P1 = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, L1 = { class: "text-muted-foreground" }, zn = 5.6, Z6 = /* @__PURE__ */ L({
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
    const i = K(null), d = K(560), u = K(null);
    let f = null;
    be(() => {
      f = new ResizeObserver((P) => {
        d.value = Math.max(160, P[0].contentRect.width);
      }), i.value && f.observe(i.value);
    }), ke(() => f?.disconnect());
    const v = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)"
    ], m = y(() => (o.series?.length ? o.series : o.data?.length ? [{ name: "", points: o.data }] : []).map((J, V) => ({
      ...J,
      color: J.color ?? v[V % v.length]
    }))), h = y(() => m.value[0]?.points.map((P) => P.label) ?? []), M = y(() => h.value.length), $ = y(() => o.orientation === "horizontal"), C = y(() => Math.max(0, ...h.value.map((P) => P.length))), k = y(() => {
      if (!$.value)
        return o.showAxis ? 44 : 8;
      const P = C.value * zn + 16;
      return Math.round(Math.min(Math.max(60, P), d.value * 0.4));
    }), A = y(() => Math.max(4, Math.floor((k.value - 16) / zn)));
    function B(P) {
      return P.length <= A.value ? P : `${P.slice(0, A.value - 1)}…`;
    }
    const w = y(() => ({
      top: 12,
      right: 12,
      bottom: 26,
      left: k.value
    })), p = y(() => ({
      w: Math.max(1, d.value - w.value.left - w.value.right),
      h: Math.max(1, o.height - w.value.top - w.value.bottom)
    })), g = (P) => o.format ? o.format(P) : S(P);
    function S(P) {
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
      () => ($.value ? p.value.h : p.value.w) / Math.max(1, M.value)
    ), Y = y(() => D.value * 0.68), G = y(
      () => o.stacked || m.value.length <= 1 ? Y.value : Y.value / m.value.length
    ), Z = y(() => {
      const P = [], J = new Array(M.value).fill(0);
      return m.value.forEach((V, E) => {
        V.points.forEach((te, le) => {
          const ne = Math.max(0, te.value) / F.value * ($.value ? p.value.w : p.value.h), se = ($.value ? w.value.top : w.value.left) + le * D.value + (D.value - Y.value) / 2, Me = o.stacked ? 0 : E * G.value;
          P.push(
            $.value ? {
              x: w.value.left + J[le],
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
              y: w.value.top + p.value.h - ne - J[le],
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
        value: F.value * ($.value ? P : 1 - P),
        x: w.value.left + p.value.w * P,
        y: w.value.top + p.value.h * P
      }))
    ), H = y(() => Math.max(1, Math.ceil(M.value / ($.value ? 14 : 10))));
    function N(P) {
      return P === M.value - 1 || P % H.value === 0;
    }
    function R(P) {
      return ($.value ? w.value.top : w.value.left) + P * D.value + D.value / 2;
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
      M.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(_, { key: 1 }, [
        (t(), n("svg", {
          width: d.value,
          height: e.height,
          onMouseleave: J[0] || (J[0] = (V) => u.value = null)
        }, [
          e.showAxis ? (t(), n("g", b1, [
            $.value ? (t(), n(_, { key: 0 }, [
              (t(!0), n(_, null, j(W.value, (V) => (t(), n("line", {
                key: `g-${V.x}`,
                x1: V.x,
                x2: V.x,
                y1: w.value.top,
                y2: w.value.top + p.value.h,
                stroke: "var(--border)",
                "stroke-width": "1"
              }, null, 8, y1))), 128)),
              (t(!0), n(_, null, j(W.value, (V) => (t(), n("text", {
                key: `gt-${V.x}`,
                x: V.x,
                y: e.height - 6,
                "text-anchor": "middle",
                class: "fill-muted-foreground text-[10px] tabular-nums"
              }, c(S(V.value)), 9, x1))), 128))
            ], 64)) : (t(), n(_, { key: 1 }, [
              (t(!0), n(_, null, j(W.value, (V) => (t(), n("line", {
                key: `g-${V.y}`,
                x1: w.value.left,
                x2: d.value - w.value.right,
                y1: V.y,
                y2: V.y,
                stroke: "var(--border)",
                "stroke-width": "1"
              }, null, 8, k1))), 128)),
              (t(!0), n(_, null, j(W.value, (V) => (t(), n("text", {
                key: `gt-${V.y}`,
                x: w.value.left - 8,
                y: V.y + 3,
                "text-anchor": "end",
                class: "fill-muted-foreground text-[10px] tabular-nums"
              }, c(S(V.value)), 9, $1))), 128))
            ], 64))
          ])) : b("", !0),
          (t(!0), n(_, null, j(h.value, (V, E) => (t(), n("rect", {
            key: `hit-${E}`,
            x: $.value ? w.value.left : w.value.left + E * D.value,
            y: $.value ? w.value.top + E * D.value : w.value.top,
            width: $.value ? p.value.w : D.value,
            height: $.value ? D.value : p.value.h,
            fill: "var(--muted)",
            "fill-opacity": u.value === E ? 0.4 : 0,
            onMouseenter: (te) => u.value = E
          }, null, 40, w1))), 128)),
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
          }, null, 8, C1))), 128)),
          $.value ? (t(!0), n(_, { key: 1 }, j(h.value, (V, E) => he((t(), n("text", {
            key: `c-${E}`,
            x: w.value.left - 8,
            y: R(E) + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[10px]"
          }, [
            U(c(B(V)) + " ", 1),
            l("title", null, c(V), 1)
          ], 8, S1)), [
            [qe, N(E)]
          ])), 128)) : (t(!0), n(_, { key: 2 }, j(h.value, (V, E) => he((t(), n("text", {
            key: `c-${E}`,
            x: R(E),
            y: e.height - 8,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, c(V), 9, M1)), [
            [qe, N(E)]
          ])), 128))
        ], 40, h1)),
        X.value ? (t(), n("div", B1, [
          l("p", A1, c(X.value.label), 1),
          (t(!0), n(_, null, j(X.value.rows, (V, E) => (t(), n("div", {
            key: E,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", z1, c(V.name || "Value"), 1),
            l("span", _1, c(g(V.value)), 1)
          ]))), 128))
        ])) : b("", !0),
        e.showLegend && m.value.length > 1 ? (t(), n("div", P1, [
          (t(!0), n(_, null, j(m.value, (V, E) => (t(), n("span", {
            key: E,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", L1, c(V.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), O1 = ["width", "height"], j1 = ["id"], V1 = ["stop-color"], D1 = ["stop-color"], T1 = { key: 0 }, I1 = ["x1", "x2", "y1", "y2"], E1 = ["x", "y"], F1 = ["x", "y"], N1 = ["x1", "x2", "y1", "y2"], R1 = ["d", "fill"], U1 = ["d", "stroke", "stroke-dasharray"], H1 = ["cx", "cy", "fill"], K1 = { key: 1 }, q1 = ["x1", "x2", "y1", "y2"], G1 = ["cx", "cy", "fill"], W1 = ["x", "y"], Z1 = { class: "text-muted-foreground mb-1.5 text-[11px] whitespace-nowrap" }, J1 = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, Y1 = { class: "text-xs font-semibold tabular-nums" }, Q1 = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, X1 = { class: "text-muted-foreground" }, eh = /* @__PURE__ */ L({
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
    const o = e, a = y(() => v.value.some((P) => P.axis === "right")), r = K(null), s = K(560), i = K(null);
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
    ], f = Math.random().toString(36).slice(2, 9), v = y(() => (o.series?.length ? o.series : o.data?.length ? [{ name: "", points: o.data }] : []).map((J, V) => ({
      ...J,
      color: J.color ?? u[V % u.length]
    }))), m = y(() => v.value[0]?.points.map((P) => P.label) ?? []), h = y(() => m.value.length), M = y(() => ({
      top: 12,
      right: o.showAxis && a.value ? 44 : 12,
      bottom: 22,
      // The axis gutter disappears entirely when the axis is hidden, rather than
      // sitting there as dead space.
      left: o.showAxis ? 44 : 8
    })), $ = (P) => o.format ? o.format(P) : C(P);
    function C(P) {
      return Math.abs(P) >= 1e6 ? `${(P / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(P) >= 1e3 ? `${(P / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(P * 100) / 100);
    }
    function k(P) {
      const J = Math.max(...P, 0);
      if (J <= 0)
        return 1;
      const V = 10 ** Math.floor(Math.log10(J));
      return ([1, 2, 2.5, 5, 10].find((te) => J <= te * V) ?? 10) * V;
    }
    const A = y(
      () => k(
        v.value.filter((P) => P.axis !== "right").flatMap((P) => P.points.map((J) => J.value))
      )
    ), B = y(
      () => k(
        v.value.filter((P) => P.axis === "right").flatMap((P) => P.points.map((J) => J.value))
      )
    ), w = y(() => ({
      w: Math.max(1, s.value - M.value.left - M.value.right),
      h: Math.max(1, o.height - M.value.top - M.value.bottom)
    }));
    function p(P) {
      return M.value.left + (h.value <= 1 ? 0 : P / (h.value - 1) * w.value.w);
    }
    function g(P, J = "left") {
      const V = J === "right" ? B.value : A.value;
      return M.value.top + w.value.h - P / V * w.value.h;
    }
    const S = y(
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
      const V = M.value.top + w.value.h;
      return `${P} L${J[J.length - 1].x.toFixed(2)},${V} L${J[0].x.toFixed(2)},${V} Z`;
    }
    const G = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((P) => ({
        y: M.value.top + w.value.h * P,
        value: A.value * (1 - P)
      }))
    ), Z = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((P) => ({
        y: M.value.top + w.value.h * P,
        value: B.value * (1 - P)
      }))
    ), W = y(() => Math.max(1, Math.ceil(h.value / 8)));
    function H(P) {
      return P === h.value - 1 || P % W.value === 0;
    }
    function N(P) {
      const J = P.currentTarget.getBoundingClientRect(), V = P.clientX - J.left - M.value.left, E = h.value <= 1 ? 1 : w.value.w / (h.value - 1);
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
        rows: S.value.map((J) => ({
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
            (t(!0), n(_, null, j(S.value, (V, E) => (t(), n("linearGradient", {
              id: `pk-fill-${x(f)}-${E}`,
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
              }, null, 8, V1),
              l("stop", {
                offset: "100%",
                "stop-color": V.color,
                "stop-opacity": "0.01"
              }, null, 8, D1)
            ], 8, j1))), 128))
          ]),
          e.showAxis ? (t(), n("g", T1, [
            (t(!0), n(_, null, j(G.value, (V) => (t(), n("line", {
              key: V.y,
              x1: M.value.left,
              x2: s.value - M.value.right,
              y1: V.y,
              y2: V.y,
              stroke: "var(--border)",
              "stroke-width": "1"
            }, null, 8, I1))), 128)),
            (t(!0), n(_, null, j(G.value, (V) => (t(), n("text", {
              key: `t-${V.y}`,
              x: M.value.left - 8,
              y: V.y + 3,
              "text-anchor": "end",
              class: "fill-muted-foreground text-[10px] tabular-nums"
            }, c(C(V.value)), 9, E1))), 128)),
            a.value ? (t(!0), n(_, { key: 0 }, j(Z.value, (V) => (t(), n("text", {
              key: `rt-${V.y}`,
              x: s.value - M.value.right + 8,
              y: V.y + 3,
              "text-anchor": "start",
              class: "fill-muted-foreground text-[10px] tabular-nums"
            }, c(C(V.value)), 9, F1))), 128)) : b("", !0)
          ])) : b("", !0),
          (t(!0), n(_, null, j(m.value, (V, E) => he((t(), n("line", {
            key: `v-${E}`,
            x1: p(E),
            x2: p(E),
            y1: M.value.top,
            y2: M.value.top + w.value.h,
            stroke: "var(--border)",
            "stroke-width": "1",
            "stroke-dasharray": "2 4",
            opacity: "0.7"
          }, null, 8, N1)), [
            [qe, H(E)]
          ])), 128)),
          (t(!0), n(_, null, j(S.value, (V, E) => (t(), n("g", {
            key: `s-${E}`
          }, [
            V.filled ?? e.type === "area" ? (t(), n("path", {
              key: 0,
              d: V.area,
              fill: `url(#pk-fill-${x(f)}-${E})`
            }, null, 8, R1)) : b("", !0),
            l("path", {
              d: V.line,
              fill: "none",
              stroke: V.color,
              "stroke-width": "2",
              "stroke-linejoin": "round",
              "stroke-linecap": "round",
              "stroke-dasharray": V.dashed ? "6 4" : void 0
            }, null, 8, U1),
            V.pts.length === 1 ? (t(), n("circle", {
              key: 1,
              cx: V.pts[0].x,
              cy: V.pts[0].y,
              r: "3",
              fill: V.color
            }, null, 8, H1)) : b("", !0)
          ]))), 128)),
          R.value ? (t(), n("g", K1, [
            l("line", {
              x1: R.value.x,
              x2: R.value.x,
              y1: M.value.top,
              y2: M.value.top + w.value.h,
              stroke: "var(--muted-foreground)",
              "stroke-width": "1",
              "stroke-dasharray": "4 3"
            }, null, 8, q1),
            (t(!0), n(_, null, j(R.value.rows, (V, E) => (t(), n("circle", {
              key: `d-${E}`,
              cx: R.value.x,
              cy: V.y,
              r: "4",
              fill: V.color,
              stroke: "var(--card)",
              "stroke-width": "2"
            }, null, 8, G1))), 128))
          ])) : b("", !0),
          (t(!0), n(_, null, j(m.value, (V, E) => he((t(), n("text", {
            key: `x-${E}`,
            x: p(E),
            y: e.height - 6,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px]"
          }, c(V), 9, W1)), [
            [qe, H(E)]
          ])), 128))
        ], 40, O1)),
        R.value ? (t(), n("div", {
          key: 0,
          class: "bg-popover pointer-events-none absolute z-10 min-w-36 rounded-lg border p-2 shadow-lg",
          style: ie(X.value)
        }, [
          l("p", Z1, c(R.value.label), 1),
          (t(!0), n(_, null, j(R.value.rows, (V, E) => (t(), n("div", {
            key: E,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", J1, c(V.name || "Value"), 1),
            l("span", Y1, c($(V.value)), 1)
          ]))), 128))
        ], 4)) : b("", !0),
        e.showLegend && v.value.length > 1 ? (t(), n("div", Q1, [
          (t(!0), n(_, null, j(S.value, (V, E) => (t(), n("span", {
            key: E,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", X1, c(V.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), th = { class: "bg-popover pointer-events-none absolute top-2 left-2 z-10 rounded-lg border px-2.5 py-1.5 shadow-lg" }, nh = { class: "text-muted-foreground text-[11px] capitalize" }, ah = { class: "text-sm font-semibold tabular-nums" }, lh = {
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
    return (o, a) => (t(), n("div", th, [
      l("p", nh, c(e.label), 1),
      l("p", ah, [
        U(c(e.value) + " ", 1),
        e.share ? (t(), n("span", lh, " (" + c(e.share) + ") ", 1)) : b("", !0)
      ])
    ]));
  }
}), oh = {
  key: 1,
  class: "relative flex flex-wrap items-center gap-4 sm:flex-nowrap"
}, sh = ["width", "height", "viewBox", "aria-label"], rh = ["d", "fill", "fill-opacity", "onMouseenter"], ih = ["x", "y"], dh = ["x", "y"], uh = { class: "flex min-w-0 flex-1 flex-col gap-0.5" }, ch = ["onMouseenter"], fh = { class: "min-w-0 flex-1 truncate capitalize" }, mh = { class: "tabular-nums font-medium" }, ph = { class: "text-muted-foreground w-9 text-right tabular-nums" }, J6 = /* @__PURE__ */ L({
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
    ], r = y(() => o.data.reduce((A, B) => A + B.value, 0)), s = K(null), i = y(() => o.height), d = y(() => i.value / 2 - 4), u = y(() => o.type === "doughnut" ? d.value * 0.62 : 0);
    function f(A) {
      return a[A % a.length];
    }
    function v(A) {
      return 1 - Math.min(0.55, Math.floor(A / a.length) * 0.28);
    }
    const m = y(() => {
      if (r.value <= 0)
        return [];
      const A = i.value / 2;
      let B = -Math.PI / 2;
      return o.data.map((w, p) => {
        const g = w.value / r.value, S = g * Math.PI * 2, F = B, D = B + S;
        return B = D, {
          ...w,
          share: g,
          colour: f(p),
          opacity: v(p),
          /*
           * The 100% case. An arc from a point back to itself is degenerate
           * and SVG draws nothing, so it is expressed as two half circles.
           */
          path: g >= 0.9999 ? $(A) : M(A, F, D, d.value, u.value)
        };
      });
    });
    function h(A, B, w) {
      return `${(A + Math.cos(B) * w).toFixed(2)},${(A + Math.sin(B) * w).toFixed(2)}`;
    }
    function M(A, B, w, p, g) {
      const S = w - B > Math.PI ? 1 : 0;
      return g <= 0 ? `M${A},${A} L${h(A, B, p)} A${p},${p} 0 ${S} 1 ${h(A, w, p)} Z` : [
        `M${h(A, B, p)}`,
        `A${p},${p} 0 ${S} 1 ${h(A, w, p)}`,
        `L${h(A, w, g)}`,
        `A${g},${g} 0 ${S} 0 ${h(A, B, g)}`,
        "Z"
      ].join(" ");
    }
    function $(A) {
      const B = d.value, w = u.value, p = [
        `M${A - B},${A}`,
        `A${B},${B} 0 1 1 ${A + B},${A}`,
        `A${B},${B} 0 1 1 ${A - B},${A}`,
        "Z"
      ];
      return w <= 0 ? p.join(" ") : [
        ...p,
        `M${A - w},${A}`,
        `A${w},${w} 0 1 0 ${A + w},${A}`,
        `A${w},${w} 0 1 0 ${A - w},${A}`,
        "Z"
      ].join(" ");
    }
    const C = (A) => o.format ? o.format(A) : new Intl.NumberFormat().format(A), k = (A) => `${(A * 100).toFixed(A < 0.01 ? 2 : 0)}%`;
    return (A, B) => r.value <= 0 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " No data ", 4)) : (t(), n("div", oh, [
      (t(), n("svg", {
        width: i.value,
        height: i.value,
        viewBox: `0 0 ${i.value} ${i.value}`,
        class: "shrink-0",
        role: "img",
        "aria-label": `Total ${C(r.value)}`
      }, [
        (t(!0), n(_, null, j(m.value, (w, p) => (t(), n("path", {
          key: p,
          d: w.path,
          fill: w.colour,
          "fill-opacity": s.value === null || s.value === p ? w.opacity : w.opacity * 0.35,
          "fill-rule": "evenodd",
          stroke: "var(--card)",
          "stroke-width": "2",
          class: "cursor-default transition-[fill-opacity]",
          onMouseenter: (g) => s.value = p,
          onMouseleave: B[0] || (B[0] = (g) => s.value = null)
        }, null, 40, rh))), 128)),
        e.type === "doughnut" ? (t(), n(_, { key: 0 }, [
          l("text", {
            x: i.value / 2,
            y: i.value / 2 - 2,
            "text-anchor": "middle",
            class: "fill-foreground text-base font-semibold tabular-nums"
          }, c(C(s.value === null ? r.value : m.value[s.value].value)), 9, ih),
          l("text", {
            x: i.value / 2,
            y: i.value / 2 + 14,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, c(s.value === null ? "Total" : m.value[s.value].label), 9, dh)
        ], 64)) : b("", !0)
      ], 8, sh)),
      l("ul", uh, [
        (t(!0), n(_, null, j(m.value, (w, p) => (t(), n("li", {
          key: p,
          class: z(["flex cursor-default items-center gap-2 rounded px-1.5 py-1 text-xs transition-colors", s.value === p ? "bg-muted" : ""]),
          onMouseenter: (g) => s.value = p,
          onMouseleave: B[1] || (B[1] = (g) => s.value = null)
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: w.colour, opacity: w.opacity })
          }, null, 4),
          l("span", fh, c(w.label), 1),
          l("span", mh, c(C(w.value)), 1),
          l("span", ph, c(k(w.share)), 1)
        ], 42, ch))), 128))
      ]),
      s.value !== null && e.type === "pie" ? (t(), T(bt, {
        key: 0,
        label: m.value[s.value].label,
        value: C(m.value[s.value].value),
        share: k(m.value[s.value].share)
      }, null, 8, ["label", "value", "share"])) : b("", !0)
    ]));
  }
}), vh = ["width", "height", "viewBox", "aria-label"], gh = { class: "text-border" }, hh = ["x1", "x2", "y1", "y2", "stroke-dasharray"], bh = { class: "fill-muted-foreground text-[10px]" }, yh = ["x", "y"], xh = ["x", "y"], kh = ["cx", "cy", "r", "fill", "fill-opacity", "stroke", "opacity", "onMouseenter"], $h = {
  key: 1,
  class: "mt-2 flex flex-wrap gap-3"
}, Y6 = /* @__PURE__ */ L({
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
    ], r = K(null), s = K(560), i = K(null);
    let d = null;
    be(() => {
      d = new ResizeObserver((W) => {
        const H = W[0]?.contentRect.width ?? 0;
        H > 0 && (s.value = H);
      }), r.value && d.observe(r.value);
    }), ke(() => d?.disconnect());
    const u = y(
      () => o.series?.length ? o.series : [{ name: "", points: o.data ?? [] }]
    ), f = (W, H) => H.color ?? a[W % a.length], v = y(() => u.value.flatMap((W) => W.points)), m = y(() => v.value.some((W) => typeof W.r == "number")), h = { top: 12, right: 16, bottom: 32, left: 48 }, M = y(() => Math.max(10, s.value - h.left - h.right)), $ = y(() => Math.max(10, o.height - h.top - h.bottom));
    function C(W) {
      if (W.length === 0)
        return [0, 1];
      const H = Math.min(...W), N = Math.max(...W), R = N - H || Math.abs(N) || 1;
      return [H - R * 0.08, N + R * 0.08];
    }
    const k = y(() => C(v.value.map((W) => W.x))), A = y(() => C(v.value.map((W) => W.y))), B = (W) => {
      const [H, N] = k.value;
      return h.left + (W - H) / (N - H) * M.value;
    }, w = (W) => {
      const [H, N] = A.value;
      return h.top + $.value - (W - H) / (N - H) * $.value;
    }, p = y(() => Math.max(...v.value.map((W) => W.r ?? 0), 0));
    function g(W) {
      if (!m.value || !p.value)
        return 4;
      const H = Math.max(0, W.r ?? 0) / p.value;
      return 3 + Math.sqrt(H) * (o.maxRadius - 3);
    }
    function S([W, H]) {
      return Array.from({ length: 5 }, (N, R) => W + (H - W) / 4 * R);
    }
    const F = y(() => S(k.value)), D = y(() => S(A.value)), Y = (W) => o.formatX?.(W) ?? String(Math.round(W * 100) / 100), G = (W) => o.formatY?.(W) ?? String(Math.round(W * 100) / 100), Z = y(() => {
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
        l("g", gh, [
          (t(!0), n(_, null, j(D.value, (N, R) => (t(), n("line", {
            key: `gy-${R}`,
            x1: h.left,
            x2: h.left + M.value,
            y1: w(N),
            y2: w(N),
            stroke: "currentColor",
            "stroke-width": "1",
            "stroke-dasharray": R === 0 ? "0" : "3 3",
            opacity: "0.5"
          }, null, 8, hh))), 128))
        ]),
        l("g", bh, [
          (t(!0), n(_, null, j(D.value, (N, R) => (t(), n("text", {
            key: `ty-${R}`,
            x: h.left - 8,
            y: w(N) + 3,
            "text-anchor": "end"
          }, c(G(N)), 9, yh))), 128)),
          (t(!0), n(_, null, j(F.value, (N, R) => (t(), n("text", {
            key: `tx-${R}`,
            x: B(N),
            y: e.height - 10,
            "text-anchor": "middle"
          }, c(Y(N)), 9, xh))), 128))
        ]),
        (t(!0), n(_, null, j(u.value, (N, R) => (t(), n("g", {
          key: `s-${R}`
        }, [
          (t(!0), n(_, null, j(N.points, (X, P) => (t(), n("circle", {
            key: `p-${R}-${P}`,
            cx: B(X.x),
            cy: w(X.y),
            r: g(X),
            fill: f(R, N),
            "fill-opacity": m.value ? 0.55 : 0.85,
            stroke: f(R, N),
            "stroke-width": "1.5",
            class: "cursor-pointer transition-opacity",
            opacity: i.value && (i.value.s !== R || i.value.p !== P) ? 0.35 : 1,
            onMouseenter: (J) => i.value = { s: R, p: P },
            onMouseleave: H[0] || (H[0] = (J) => i.value = null)
          }, null, 40, kh))), 128))
        ]))), 128))
      ], 8, vh)),
      Z.value ? (t(), T(bt, {
        key: 0,
        label: Z.value.point.label ?? Z.value.series.name ?? "Point",
        value: `${e.xLabel ? e.xLabel + " " : ""}${Y(Z.value.point.x)} · ${e.yLabel ? e.yLabel + " " : ""}${G(Z.value.point.y)}`,
        share: m.value && Z.value.point.r != null ? String(Z.value.point.r) : null
      }, null, 8, ["label", "value", "share"])) : b("", !0),
      e.showLegend && u.value.length > 1 ? (t(), n("div", $h, [
        (t(!0), n(_, null, j(u.value, (N, R) => (t(), n("span", {
          key: `l-${R}`,
          class: "text-muted-foreground flex items-center gap-1.5 text-xs"
        }, [
          l("span", {
            class: "size-2.5 rounded-full",
            style: ie({ backgroundColor: f(R, N) }),
            "aria-hidden": "true"
          }, null, 4),
          U(" " + c(N.name), 1)
        ]))), 128))
      ])) : b("", !0)
    ], 512));
  }
}), wh = {
  key: 1,
  class: "relative flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap"
}, Ch = ["width", "height", "viewBox"], Sh = ["points"], Mh = ["x1", "y1", "x2", "y2"], Bh = ["points", "fill", "stroke"], Ah = ["cx", "cy", "fill", "onMouseenter"], zh = ["x", "y", "text-anchor"], _h = {
  key: 0,
  class: "flex min-w-0 flex-col gap-1.5"
}, Ph = { class: "truncate" }, Q6 = /* @__PURE__ */ L({
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
      () => o.series.map((w, p) => ({
        ...w,
        color: w.color ?? a[p % a.length]
      }))
    ), s = y(() => r.value[0]?.points.map((w) => w.label) ?? []), i = y(() => s.value.length), d = y(() => o.height), u = y(() => d.value / 2), f = y(() => d.value / 2 - 34), v = y(() => {
      const w = Math.max(...r.value.flatMap((S) => S.points.map((F) => F.value)), 0);
      if (w <= 0)
        return 1;
      const p = 10 ** Math.floor(Math.log10(w));
      return ([1, 2, 2.5, 5, 10].find((S) => w <= S * p) ?? 10) * p;
    });
    function m(w) {
      return w / i.value * Math.PI * 2 - Math.PI / 2;
    }
    function h(w, p) {
      const g = m(w);
      return {
        x: u.value + Math.cos(g) * f.value * p,
        y: u.value + Math.sin(g) * f.value * p
      };
    }
    function M(w) {
      return Array.from({ length: i.value }, (p, g) => {
        const S = h(g, w);
        return `${S.x.toFixed(2)},${S.y.toFixed(2)}`;
      }).join(" ");
    }
    const $ = y(() => [0.25, 0.5, 0.75, 1].map((w) => ({ f: w, points: M(w) }))), C = y(
      () => r.value.map((w) => {
        const p = w.points.map((g) => Math.max(0, g.value) / v.value);
        return {
          name: w.name,
          color: w.color,
          values: w.points,
          outline: p.map((g, S) => {
            const F = h(S, g);
            return `${F.x.toFixed(2)},${F.y.toFixed(2)}`;
          }).join(" "),
          dots: p.map((g, S) => h(S, g))
        };
      })
    ), k = y(
      () => s.value.map((w, p) => {
        const g = m(p), S = u.value + Math.cos(g) * (f.value + 14), F = u.value + Math.sin(g) * (f.value + 14), D = Math.cos(g);
        return {
          label: w,
          x: S,
          y: F + 3,
          anchor: Math.abs(D) < 0.2 ? "middle" : D > 0 ? "start" : "end"
        };
      })
    ), A = K(null), B = (w) => o.format ? o.format(w) : new Intl.NumberFormat().format(w);
    return (w, p) => i.value < 3 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " A radar needs at least three axes ", 4)) : (t(), n("div", wh, [
      (t(), n("svg", {
        width: d.value,
        height: d.value,
        viewBox: `0 0 ${d.value} ${d.value}`,
        class: "shrink-0"
      }, [
        (t(!0), n(_, null, j($.value, (g) => (t(), n("polygon", {
          key: g.f,
          points: g.points,
          fill: "none",
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, Sh))), 128)),
        (t(!0), n(_, null, j(s.value, (g, S) => (t(), n("line", {
          key: `spoke-${S}`,
          x1: u.value,
          y1: u.value,
          x2: h(S, 1).x,
          y2: h(S, 1).y,
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, Mh))), 128)),
        (t(!0), n(_, null, j(C.value, (g, S) => (t(), n("g", {
          key: `s-${S}`
        }, [
          l("polygon", {
            points: g.outline,
            fill: g.color,
            "fill-opacity": "0.16",
            stroke: g.color,
            "stroke-width": "2"
          }, null, 8, Bh),
          (t(!0), n(_, null, j(g.dots, (F, D) => (t(), n("circle", {
            key: D,
            cx: F.x,
            cy: F.y,
            r: "3",
            fill: g.color,
            stroke: "var(--card)",
            "stroke-width": "1.5",
            class: "cursor-default",
            onMouseenter: (Y) => A.value = {
              series: g.name,
              axis: s.value[D],
              value: g.values[D]?.value ?? 0
            },
            onMouseleave: p[0] || (p[0] = (Y) => A.value = null)
          }, null, 40, Ah))), 128))
        ]))), 128)),
        (t(!0), n(_, null, j(k.value, (g, S) => (t(), n("text", {
          key: `l-${S}`,
          x: g.x,
          y: g.y,
          "text-anchor": g.anchor,
          class: "fill-muted-foreground text-[10px] capitalize"
        }, c(g.label), 9, zh))), 128))
      ], 8, Ch)),
      e.showLegend ? (t(), n("ul", _h, [
        (t(!0), n(_, null, j(r.value, (g, S) => (t(), n("li", {
          key: S,
          class: "flex items-center gap-2 text-xs"
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: g.color })
          }, null, 4),
          l("span", Ph, c(g.name), 1)
        ]))), 128))
      ])) : b("", !0),
      A.value ? (t(), T(bt, {
        key: 1,
        label: `${A.value.series} — ${A.value.axis}`,
        value: B(A.value.value)
      }, null, 8, ["label", "value"])) : b("", !0)
    ]));
  }
}), Lh = {
  key: 1,
  class: "relative flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap"
}, Oh = ["width", "height", "viewBox"], jh = ["cx", "cy", "r"], Vh = ["d", "fill", "fill-opacity", "onMouseenter"], Dh = {
  key: 0,
  class: "flex min-w-0 flex-col gap-1.5"
}, Th = { class: "min-w-0 flex-1 truncate capitalize" }, Ih = { class: "font-medium tabular-nums" }, X6 = /* @__PURE__ */ L({
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
    ], r = K(null), s = y(() => o.height), i = y(() => s.value / 2), d = y(() => s.value / 2 - 6), u = y(() => Math.max(...o.data.map((M) => Math.max(0, M.value)), 0)), f = y(() => {
      const M = o.data.length;
      if (M === 0 || u.value <= 0)
        return [];
      const $ = Math.PI * 2 / M;
      return o.data.map((C, k) => {
        const A = Math.sqrt(Math.max(0, C.value) / u.value), B = d.value * A, w = k * $ - Math.PI / 2, p = w + $;
        return {
          ...C,
          color: a[k % a.length],
          share: u.value === 0 ? 0 : C.value / u.value,
          path: v(i.value, w, p, B)
        };
      });
    });
    function v(M, $, C, k) {
      if (k <= 0)
        return "";
      if (C - $ >= Math.PI * 2 - 1e-6)
        return `M${M - k},${M} A${k},${k} 0 1 1 ${M + k},${M} A${k},${k} 0 1 1 ${M - k},${M} Z`;
      const A = C - $ > Math.PI ? 1 : 0, B = M + Math.cos($) * k, w = M + Math.sin($) * k, p = M + Math.cos(C) * k, g = M + Math.sin(C) * k;
      return `M${M},${M} L${B.toFixed(2)},${w.toFixed(2)} A${k.toFixed(2)},${k.toFixed(2)} 0 ${A} 1 ${p.toFixed(2)},${g.toFixed(2)} Z`;
    }
    const m = y(() => [0.5, 0.75, 1].map((M) => d.value * M)), h = (M) => o.format ? o.format(M) : new Intl.NumberFormat().format(M);
    return (M, $) => f.value.length === 0 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " No data ", 4)) : (t(), n("div", Lh, [
      (t(), n("svg", {
        width: s.value,
        height: s.value,
        viewBox: `0 0 ${s.value} ${s.value}`,
        class: "shrink-0"
      }, [
        (t(!0), n(_, null, j(m.value, (C) => (t(), n("circle", {
          key: C,
          cx: i.value,
          cy: i.value,
          r: C,
          fill: "none",
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, jh))), 128)),
        (t(!0), n(_, null, j(f.value, (C, k) => (t(), n("path", {
          key: k,
          d: C.path,
          fill: C.color,
          stroke: "var(--card)",
          "stroke-width": "1.5",
          class: "cursor-default transition-opacity",
          "fill-opacity": r.value === null || r.value === k ? 0.75 : 0.3,
          onMouseenter: (A) => r.value = k,
          onMouseleave: $[0] || ($[0] = (A) => r.value = null)
        }, null, 40, Vh))), 128))
      ], 8, Oh)),
      e.showLegend ? (t(), n("ul", Dh, [
        (t(!0), n(_, null, j(f.value, (C, k) => (t(), n("li", {
          key: k,
          class: "flex items-center gap-2 text-xs"
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: C.color })
          }, null, 4),
          l("span", Th, c(C.label), 1),
          l("span", Ih, c(h(C.value)), 1)
        ]))), 128))
      ])) : b("", !0),
      r.value !== null ? (t(), T(bt, {
        key: 1,
        label: f.value[r.value].label,
        value: h(f.value[r.value].value)
      }, null, 8, ["label", "value"])) : b("", !0)
    ]));
  }
}), Eh = ["width", "height"], Fh = ["x1", "x2", "y1", "y2"], Nh = ["x", "y"], Rh = ["x", "y"], Uh = ["x", "y", "width", "height", "fill-opacity", "onMouseenter"], Hh = ["x", "y", "width", "height", "fill", "fill-opacity"], Kh = ["d", "stroke"], qh = ["cx", "cy", "fill"], Gh = ["x", "y"], Wh = {
  key: 0,
  class: "bg-popover pointer-events-none absolute top-2 right-2 z-10 min-w-36 rounded-lg border p-2 shadow-lg"
}, Zh = { class: "text-muted-foreground mb-1 text-[11px] capitalize" }, Jh = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, Yh = { class: "text-xs font-semibold tabular-nums" }, Qh = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, Xh = { class: "text-muted-foreground" }, eS = /* @__PURE__ */ L({
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
    const o = e, a = K(null), r = K(560), s = K(null);
    let i = null;
    be(() => {
      i = new ResizeObserver((R) => {
        r.value = Math.max(160, R[0].contentRect.width);
      }), a.value && i.observe(a.value);
    }), ke(() => i?.disconnect());
    const d = ["var(--chart-2)", "var(--chart-4)", "var(--chart-3)"], u = ["var(--primary)", "var(--chart-5)"], f = y(
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
      () => f.value[0]?.points.map((R) => R.label) ?? v.value[0]?.points.map((R) => R.label) ?? []
    ), h = y(() => m.value.length), M = y(() => o.lineAxis === "right"), $ = y(() => ({
      top: 12,
      right: M.value ? 44 : 12,
      bottom: 26,
      left: 44
    })), C = y(() => ({
      w: Math.max(1, r.value - $.value.left - $.value.right),
      h: Math.max(1, o.height - $.value.top - $.value.bottom)
    }));
    function k(R) {
      const X = Math.max(...R, 0);
      if (X <= 0)
        return 1;
      const P = 10 ** Math.floor(Math.log10(X));
      return ([1, 2, 2.5, 5, 10].find((V) => X <= V * P) ?? 10) * P;
    }
    const A = y(
      () => k([
        ...f.value.flatMap((R) => R.points.map((X) => X.value)),
        ...M.value ? [] : v.value.flatMap((R) => R.points.map((X) => X.value))
      ])
    ), B = y(
      () => M.value ? k(v.value.flatMap((R) => R.points.map((X) => X.value))) : A.value
    ), w = y(() => C.value.w / Math.max(1, h.value)), p = y(() => w.value * 0.6), g = y(() => p.value / Math.max(1, f.value.length));
    function S(R) {
      return $.value.left + R * w.value + w.value / 2;
    }
    const F = y(
      () => f.value.flatMap(
        (R, X) => R.points.map((P, J) => {
          const V = Math.max(0, P.value) / A.value * C.value.h;
          return {
            x: S(J) - p.value / 2 + X * g.value,
            y: $.value.top + C.value.h - V,
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
          x: S(J),
          y: $.value.top + C.value.h - Math.max(0, P.value) / B.value * C.value.h,
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
        y: $.value.top + C.value.h * R,
        left: A.value * (1 - R),
        right: B.value * (1 - R)
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
          ...f.value.map((X) => ({
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
            x1: $.value.left,
            x2: r.value - $.value.right,
            y1: P.y,
            y2: P.y,
            stroke: "var(--border)",
            "stroke-width": "1"
          }, null, 8, Fh))), 128)),
          (t(!0), n(_, null, j(Y.value, (P) => (t(), n("text", {
            key: `lt-${P.y}`,
            x: $.value.left - 8,
            y: P.y + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[10px] tabular-nums"
          }, c(H(P.left)), 9, Nh))), 128)),
          M.value ? (t(!0), n(_, { key: 0 }, j(Y.value, (P) => (t(), n("text", {
            key: `rt-${P.y}`,
            x: r.value - $.value.right + 8,
            y: P.y + 3,
            "text-anchor": "start",
            class: "fill-muted-foreground text-[10px] tabular-nums"
          }, c(H(P.right)), 9, Rh))), 128)) : b("", !0),
          (t(!0), n(_, null, j(m.value, (P, J) => (t(), n("rect", {
            key: `hit-${J}`,
            x: $.value.left + J * w.value,
            y: $.value.top,
            width: w.value,
            height: C.value.h,
            fill: "var(--muted)",
            "fill-opacity": s.value === J ? 0.4 : 0,
            onMouseenter: (V) => s.value = J
          }, null, 40, Uh))), 128)),
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
          }, null, 8, Hh))), 128)),
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
            }, null, 8, Kh),
            s.value !== null && P.pts[s.value] ? (t(), n("circle", {
              key: 0,
              cx: P.pts[s.value].x,
              cy: P.pts[s.value].y,
              r: "4",
              fill: P.color,
              stroke: "var(--card)",
              "stroke-width": "2",
              "pointer-events": "none"
            }, null, 8, qh)) : b("", !0)
          ]))), 128)),
          (t(!0), n(_, null, j(m.value, (P, J) => he((t(), n("text", {
            key: `x-${J}`,
            x: S(J),
            y: e.height - 8,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, c(P), 9, Gh)), [
            [qe, Z(J)]
          ])), 128))
        ], 40, Eh)),
        N.value ? (t(), n("div", Wh, [
          l("p", Zh, c(N.value.label), 1),
          (t(!0), n(_, null, j(N.value.rows, (P, J) => (t(), n("div", {
            key: J,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: P.color })
            }, null, 4),
            l("span", Jh, c(P.name), 1),
            l("span", Yh, c(W(P.value)), 1)
          ]))), 128))
        ])) : b("", !0),
        e.showLegend ? (t(), n("div", Qh, [
          (t(!0), n(_, null, j([...f.value, ...v.value], (P, J) => (t(), n("span", {
            key: J,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: P.color })
            }, null, 4),
            l("span", Xh, c(P.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), eb = { class: "mb-3 flex flex-wrap items-center justify-center gap-3" }, tb = { class: "text-muted-foreground" }, nb = {
  key: 0,
  class: "text-muted-foreground mb-2 text-center text-xs"
}, ab = ["width", "height"], lb = ["x", "y"], ob = ["x", "y", "width", "height", "fill", "fill-opacity", "onMouseenter"], sb = ["x", "y"], rb = {
  key: 1,
  class: "bg-popover pointer-events-none absolute top-0 right-0 z-10 rounded-lg border px-2.5 py-1.5 shadow-lg"
}, ib = { class: "text-[11px] font-medium capitalize" }, db = { class: "text-muted-foreground text-[11px] capitalize" }, ub = { class: "text-sm font-semibold tabular-nums" }, cb = { class: "text-muted-foreground text-xs font-normal" }, tS = /* @__PURE__ */ L({
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
    const o = e, a = K(null), r = K(560), s = K(null);
    let i = null;
    be(() => {
      i = new ResizeObserver((p) => {
        r.value = Math.max(160, p[0].contentRect.width);
      }), a.value && i.observe(a.value);
    }), ke(() => i?.disconnect());
    const d = y(() => o.series[0]?.points.map((p) => p.label) ?? []), u = y(() => o.series.length), f = y(() => d.value.length), v = y(() => Math.min(140, Math.max(60, r.value * 0.16))), m = y(() => Math.max(1, r.value - v.value - 8)), h = y(() => m.value / Math.max(1, f.value)), M = y(() => Math.max(1, (o.height - 8) / Math.max(1, u.value)));
    function $(p) {
      if (p === 0)
        return "var(--muted)";
      const g = Math.max(1, o.buckets.length - 1);
      return `color-mix(in oklch, var(--primary) ${Math.round(p / g * 100)}%, var(--muted))`;
    }
    function C(p) {
      for (let g = 0; g < o.buckets.length; g++) {
        const S = o.buckets[g].max;
        if (S === void 0 || p < S)
          return g;
      }
      return o.buckets.length - 1;
    }
    const k = y(
      () => o.series.flatMap(
        (p, g) => p.points.map((S, F) => {
          const D = C(S.value);
          return {
            row: g,
            col: F,
            x: v.value + F * h.value,
            y: 4 + g * M.value,
            w: Math.max(1, h.value - 1),
            h: Math.max(1, M.value - 4),
            colour: $(D),
            label: S.label,
            value: S.value,
            rowName: p.name,
            bucketLabel: o.buckets[D].label
          };
        })
      )
    ), A = y(() => h.value < 2), B = y(() => s.value ? k.value.find((p) => p.row === s.value.row && p.col === s.value.col) ?? null : null), w = (p) => o.format ? o.format(p) : new Intl.NumberFormat().format(p);
    return (p, g) => (t(), n("div", {
      ref_key: "host",
      ref: a,
      class: "relative w-full"
    }, [
      u.value === 0 || f.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(_, { key: 1 }, [
        l("div", eb, [
          (t(!0), n(_, null, j(e.buckets, (S, F) => (t(), n("span", {
            key: F,
            class: "flex items-center gap-1.5 text-[11px]"
          }, [
            l("span", {
              class: "size-3 rounded-sm border",
              style: ie({ background: $(F) })
            }, null, 4),
            l("span", tb, c(S.label), 1)
          ]))), 128))
        ]),
        A.value ? (t(), n("p", nb, c(f.value) + " columns - too many to label individually ", 1)) : b("", !0),
        (t(), n("svg", {
          width: r.value,
          height: e.height,
          class: "overflow-visible",
          onMouseleave: g[0] || (g[0] = (S) => s.value = null)
        }, [
          (t(!0), n(_, null, j(e.series, (S, F) => (t(), n("text", {
            key: `r-${F}`,
            x: v.value - 10,
            y: 4 + F * M.value + M.value / 2 + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[11px] capitalize"
          }, c(S.name), 9, lb))), 128)),
          (t(!0), n(_, null, j(k.value, (S, F) => (t(), n("rect", {
            key: F,
            x: S.x,
            y: S.y,
            width: S.w,
            height: S.h,
            fill: S.colour,
            "fill-opacity": s.value === null || s.value.row === S.row && s.value.col === S.col ? 1 : 0.55,
            rx: "1",
            class: "transition-[fill-opacity]",
            onMouseenter: (D) => s.value = { row: S.row, col: S.col }
          }, null, 40, ob))), 128)),
          e.showColumnLabels && !A.value ? (t(!0), n(_, { key: 0 }, j(d.value, (S, F) => (t(), n("text", {
            key: `c-${F}`,
            x: v.value + F * h.value + h.value / 2,
            y: e.height - 2,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[9px]"
          }, c(S), 9, sb))), 128)) : b("", !0)
        ], 40, ab)),
        B.value ? (t(), n("div", rb, [
          l("p", ib, c(B.value.label), 1),
          l("p", db, c(B.value.rowName), 1),
          l("p", ub, [
            U(c(w(B.value.value)) + " ", 1),
            l("span", cb, "(" + c(B.value.bucketLabel) + ")", 1)
          ])
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), fb = ["viewBox"], mb = { key: 0 }, pb = ["id"], vb = ["stop-color"], gb = ["stop-color"], hb = ["d", "fill"], bb = ["d", "stroke"], _n = 100, it = 30, jt = /* @__PURE__ */ L({
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
      const f = Math.min(...u), m = Math.max(...u) - f || 1;
      return u.map((h, M) => ({
        x: M / (u.length - 1) * _n,
        y: it - (h - f) / m * (it - 4) - 2
      }));
    });
    function s(u) {
      const f = u.length;
      if (f < 2)
        return "";
      const v = [], m = [];
      for (let $ = 0; $ < f - 1; $++)
        v[$] = u[$ + 1].x - u[$].x, m[$] = v[$] === 0 ? 0 : (u[$ + 1].y - u[$].y) / v[$];
      const h = [m[0]];
      for (let $ = 1; $ < f - 1; $++)
        if (m[$ - 1] * m[$] <= 0)
          h[$] = 0;
        else {
          const C = 2 * v[$] + v[$ - 1], k = v[$] + 2 * v[$ - 1];
          h[$] = (C + k) / (C / m[$ - 1] + k / m[$]);
        }
      h[f - 1] = m[f - 2];
      let M = `M${u[0].x.toFixed(2)},${u[0].y.toFixed(2)}`;
      for (let $ = 0; $ < f - 1; $++) {
        const C = v[$] / 3;
        M += ` C${(u[$].x + C).toFixed(2)},${(u[$].y + h[$] * C).toFixed(2)} ${(u[$ + 1].x - C).toFixed(2)},${(u[$ + 1].y - h[$ + 1] * C).toFixed(2)} ${u[$ + 1].x.toFixed(2)},${u[$ + 1].y.toFixed(2)}`;
      }
      return M;
    }
    const i = y(() => {
      const u = r.value;
      return u.length < 2 ? "" : o.smooth ? s(u) : u.map((f, v) => `${v === 0 ? "M" : "L"}${f.x.toFixed(2)},${f.y.toFixed(2)}`).join(" ");
    }), d = y(() => {
      const u = r.value;
      return !o.filled || u.length < 2 ? "" : `${i.value} L${u[u.length - 1].x.toFixed(2)},${it} L${u[0].x.toFixed(2)},${it} Z`;
    });
    return (u, f) => i.value ? (t(), n("svg", {
      key: 0,
      viewBox: `0 0 ${_n} ${it}`,
      preserveAspectRatio: "none",
      class: "w-full",
      style: ie({ height: `${e.height}px` }),
      "aria-hidden": "true"
    }, [
      e.filled ? (t(), n("defs", mb, [
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
          }, null, 8, vb),
          l("stop", {
            offset: "100%",
            "stop-color": e.color,
            "stop-opacity": "0"
          }, null, 8, gb)
        ], 8, pb)
      ])) : b("", !0),
      e.filled ? (t(), n("path", {
        key: 1,
        d: d.value,
        fill: `url(#pk-spark-${x(a)})`
      }, null, 8, hb)) : b("", !0),
      l("path", {
        d: i.value,
        fill: "none",
        stroke: e.color,
        "stroke-width": "1.5",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "vector-effect": "non-scaling-stroke"
      }, null, 8, bb)
    ], 12, fb)) : b("", !0);
  }
}), yb = { class: "flex items-center gap-1 text-xs" }, xb = {
  "aria-hidden": "true",
  class: "text-[9px]"
}, kb = {
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
    return (d, u) => (t(), n("span", yb, [
      l("span", {
        class: z(["flex items-center gap-0.5 font-medium tabular-nums", r.value])
      }, [
        l("span", xb, c(s.value), 1),
        U(" " + c(i.value), 1)
      ], 2),
      e.comparison ? (t(), n("span", kb, c(e.comparison), 1)) : b("", !0)
    ]));
  }
}), $b = ["data-collapsed", "aria-busy"], wb = { class: "flex flex-wrap items-start justify-between gap-2" }, Cb = { class: "flex min-w-0 items-start gap-2" }, Sb = {
  key: 0,
  class: "text-muted-foreground mt-0.5 size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Mb = ["d"], Bb = { class: "min-w-0" }, Ab = { class: "text-sm font-medium" }, zb = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, _b = { class: "flex shrink-0 items-center gap-1.5" }, Pb = {
  key: 0,
  class: "bg-muted/60 flex items-center gap-0.5 rounded-md p-0.5",
  role: "group",
  "aria-label": "Period"
}, Lb = ["aria-pressed", "onClick"], Ob = ["aria-expanded", "aria-label", "title"], jb = ["aria-label"], Vb = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Db = ["d"], Tb = /* @__PURE__ */ L({
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
    const o = e, a = Yt(), r = K(o.defaultCollapsed), s = y(() => !!o.icon && !a.icon), i = y(() => {
      if (!(o.fitBody && !o.loading && !o.error))
        return { minHeight: `${o.bodyHeight}px` };
    });
    return (d, u) => (t(), n("div", {
      class: z(["@container/card bg-card flex w-full flex-col self-start rounded-lg border", r.value ? "px-4 py-2" : "gap-3 p-4"]),
      "data-slot": "chart-card",
      "data-collapsed": r.value ? "true" : "false",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      l("div", wb, [
        l("div", Cb, [
          q(d.$slots, "icon", {}, () => [
            s.value ? (t(), n("svg", Sb, [
              l("path", {
                d: x(me)(e.icon)
              }, null, 8, Mb)
            ])) : b("", !0)
          ]),
          l("div", Bb, [
            l("p", Ab, c(e.label), 1),
            e.description ? (t(), n("p", zb, c(e.description), 1)) : b("", !0),
            q(d.$slots, "trend")
          ])
        ]),
        l("div", _b, [
          q(d.$slots, "actions"),
          e.periods && e.periods.length ? (t(), n("div", Pb, [
            (t(!0), n(_, null, j(e.periods, (f) => (t(), n("button", {
              key: f.value,
              type: "button",
              class: z([
                "rounded px-2 py-1 text-xs transition-colors",
                e.period === f.value ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
              ]),
              "aria-pressed": e.period === f.value,
              onClick: (v) => d.$emit("update:period", f.value)
            }, c(f.label), 11, Lb))), 128))
          ])) : b("", !0),
          e.collapsible ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-expanded": !r.value,
            "aria-label": r.value ? `Expand ${e.label}` : `Collapse ${e.label}`,
            title: r.value ? "Expand" : "Collapse",
            onClick: u[0] || (u[0] = (f) => r.value = !r.value)
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
          ], 8, Ob)) : b("", !0),
          e.hideable ? (t(), n("button", {
            key: 2,
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-label": `Hide ${e.label}`,
            title: "Hide",
            onClick: u[1] || (u[1] = (f) => d.$emit("hide"))
          }, [
            (t(), n("svg", Vb, [
              l("path", {
                d: x(me)("eye-off")
              }, null, 8, Db)
            ]))
          ], 8, jb)) : b("", !0)
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
            onClick: u[2] || (u[2] = (f) => d.$emit("retry"))
          }, " Try again ")) : b("", !0)
        ], 4)) : q(d.$slots, "default", {}, void 0, void 0, 2)
      ], 4))
    ], 10, $b));
  }
}), Ib = ["aria-pressed", "aria-label", "title"], Eb = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Fb = ["d"], Nb = {
  key: 0,
  class: "flex flex-col items-start gap-2 py-1",
  "data-slot": "shortcuts-empty"
}, Rb = {
  key: 1,
  class: "flex flex-wrap items-center gap-x-5 gap-y-2"
}, Ub = ["href"], Hb = {
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Kb = ["d"], qb = ["aria-label", "onClick"], Gb = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Wb = ["d"], Zb = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Jb = ["d"], Yb = {
  key: 0,
  class: "flex flex-col gap-1"
}, Qb = ["onClick"], Xb = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, ey = ["d"], ty = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, ny = /* @__PURE__ */ L({
  __name: "ShortcutsWidget",
  props: {
    items: {},
    catalog: {},
    hideable: { type: Boolean, default: !1 }
  },
  emits: ["update:items", "hide"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(!1), i = K(!1), d = y(
      () => a.catalog.filter((v) => !a.items.some((m) => m.id === v.id))
    );
    function u(v) {
      r(
        "update:items",
        a.items.filter((m) => m.id !== v)
      );
    }
    function f(v) {
      r("update:items", [...a.items, v]), i.value = !1;
    }
    return (v, m) => (t(), n(_, null, [
      I(Tb, {
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
            (t(), n("svg", Eb, [
              l("path", {
                d: x(me)(s.value ? "check" : "pencil")
              }, null, 8, Fb)
            ]))
          ], 8, Ib)
        ]),
        default: O(() => [
          e.items.length === 0 ? (t(), n("div", Nb, [
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
          ])) : (t(), n("div", Rb, [
            (t(!0), n(_, null, j(e.items, (h) => (t(), n("div", {
              key: h.id,
              class: "inline-flex items-center gap-1"
            }, [
              l("a", {
                href: h.href,
                class: "text-primary inline-flex items-center gap-1.5 text-sm hover:underline"
              }, [
                (t(), n("svg", Hb, [
                  l("path", {
                    d: x(me)(h.icon)
                  }, null, 8, Kb)
                ])),
                U(" " + c(h.label), 1)
              ], 8, Ub),
              s.value ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "text-muted-foreground hover:text-destructive rounded p-0.5",
                "aria-label": `Remove ${h.label}`,
                onClick: (M) => u(h.id)
              }, [
                (t(), n("svg", Gb, [
                  l("path", {
                    d: x(me)("x")
                  }, null, 8, Wb)
                ]))
              ], 8, qb)) : b("", !0)
            ]))), 128)),
            s.value ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "text-primary inline-flex items-center gap-1.5 text-sm hover:underline",
              onClick: m[2] || (m[2] = (h) => i.value = !0)
            }, [
              (t(), n("svg", Zb, [
                l("path", {
                  d: x(me)("plus")
                }, null, 8, Jb)
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
          d.value.length ? (t(), n("ul", Yb, [
            (t(!0), n(_, null, j(d.value, (h) => (t(), n("li", {
              key: h.id
            }, [
              l("button", {
                type: "button",
                class: "hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                onClick: (M) => f(h)
              }, [
                (t(), n("svg", Xb, [
                  l("path", {
                    d: x(me)(h.icon)
                  }, null, 8, ey)
                ])),
                U(" " + c(h.label), 1)
              ], 8, Qb)
            ]))), 128))
          ])) : (t(), n("p", ty, " Every catalog shortcut is already on the card. "))
        ]),
        _: 1
      }, 8, ["open"])
    ], 64));
  }
}), ay = ["aria-busy"], ly = { class: "flex flex-1 flex-col gap-1 p-4" }, oy = { class: "text-muted-foreground relative text-xs font-medium" }, sy = {
  key: 1,
  class: "text-destructive relative flex h-8 items-center gap-3 text-sm",
  role: "alert"
}, ry = {
  key: 2,
  class: "relative flex h-8 items-center text-2xl font-semibold tabular-nums"
}, iy = {
  key: 4,
  class: "text-muted-foreground relative text-xs"
}, dy = {
  key: 0,
  class: "-mb-px",
  "aria-hidden": "true"
}, nS = /* @__PURE__ */ L({
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
      l("div", ly, [
        l("p", oy, c(e.label), 1),
        e.loading ? (t(), T(Pe, {
          key: 0,
          variant: "number",
          class: "my-1"
        })) : e.error ? (t(), n("div", sy, [
          r[1] || (r[1] = l("span", null, "Could not load", -1)),
          e.retryable ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-2 py-1 text-xs font-medium transition-colors",
            onClick: r[0] || (r[0] = (s) => a.$emit("retry"))
          }, " Retry ")) : b("", !0)
        ])) : (t(), n("span", ry, c(o(e.value)), 1)),
        e.trend && !e.loading && !e.error ? (t(), T(da, {
          key: 3,
          class: "relative",
          direction: e.trend.direction,
          percentage: e.trend.percentage,
          comparison: e.comparison,
          inverted: e.inverted
        }, null, 8, ["direction", "percentage", "comparison", "inverted"])) : e.description ? (t(), n("p", iy, c(e.description), 1)) : b("", !0)
      ]),
      e.sparkline && e.sparkline.length > 1 && !e.loading && !e.error ? (t(), n("div", dy, [
        I(jt, {
          data: e.sparkline,
          height: 44,
          filled: ""
        }, null, 8, ["data"])
      ])) : b("", !0)
    ], 8, ay));
  }
}), uy = { class: "bg-card relative flex flex-col overflow-hidden rounded-lg border" }, cy = { class: "flex flex-col gap-1 p-4" }, fy = { class: "flex items-start justify-between gap-2" }, my = { class: "text-sm font-medium" }, py = {
  key: 0,
  class: "text-muted-foreground font-mono text-xs"
}, vy = { class: "mt-1 flex flex-wrap items-center gap-2" }, gy = {
  key: 1,
  class: "text-xl font-semibold tabular-nums"
}, hy = {
  key: 0,
  class: "-mb-px"
}, _t = /* @__PURE__ */ L({
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
    return (i, d) => (t(), n("div", uy, [
      l("div", cy, [
        l("div", fy, [
          l("p", my, c(e.label), 1),
          q(i.$slots, "menu")
        ]),
        e.caption ? (t(), n("p", py, c(e.caption), 1)) : b("", !0),
        l("div", vy, [
          e.loading ? (t(), T(Pe, {
            key: 0,
            variant: "number"
          })) : (t(), n("span", gy, c(s.value), 1)),
          e.delta !== null && !e.loading ? (t(), n("span", {
            key: 2,
            class: z(["rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums", r.value])
          }, c(e.delta > 0 ? "+" : "") + c(e.delta) + "% ", 3)) : b("", !0)
        ])
      ]),
      e.series && e.series.length > 1 && !e.loading ? (t(), n("div", hy, [
        I(jt, {
          data: e.series,
          color: e.color,
          height: 56,
          filled: ""
        }, null, 8, ["data", "color"])
      ])) : b("", !0)
    ]));
  }
}), by = { class: "relative flex flex-col gap-2" }, yy = ["aria-label"], xy = ["onMouseenter"], ky = {
  key: 0,
  class: "flex flex-wrap gap-x-6 gap-y-1"
}, $y = { class: "text-muted-foreground flex items-center gap-1.5 text-xs" }, wy = { class: "truncate" }, Cy = { class: "text-sm font-semibold tabular-nums" }, aS = /* @__PURE__ */ L({
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
    ), d = (v) => o.format ? o.format(v) : new Intl.NumberFormat().format(v), u = K(null), f = (v) => `${(v * 100).toFixed(v > 0 && v < 0.01 ? 1 : 0)}%`;
    return (v, m) => (t(), n("div", by, [
      l("div", {
        class: "bg-muted flex w-full overflow-hidden rounded-full",
        style: ie({ height: `${e.height}px` }),
        role: "img",
        "aria-label": e.segments.map((h) => `${h.label} ${d(h.value)}`).join(", ")
      }, [
        (t(!0), n(_, null, j(i.value, (h, M) => (t(), n("span", {
          key: M,
          class: z(["h-full transition-all", [
            M === 0 ? "rounded-l-full" : "",
            M === i.value.length - 1 && !e.total ? "rounded-r-full" : ""
          ]]),
          style: ie({
            width: h.width,
            background: h.color,
            opacity: u.value === null || u.value === M ? 1 : 0.4
          }),
          onMouseenter: ($) => u.value = M,
          onMouseleave: m[0] || (m[0] = ($) => u.value = null)
        }, null, 46, xy))), 128))
      ], 12, yy),
      e.showLegend ? (t(), n("div", ky, [
        (t(!0), n(_, null, j(i.value, (h, M) => (t(), n("div", {
          key: M,
          class: "flex min-w-0 flex-col"
        }, [
          l("span", $y, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: h.color })
            }, null, 4),
            l("span", wy, c(h.label), 1)
          ]),
          l("span", Cy, c(d(h.value)), 1)
        ]))), 128))
      ])) : b("", !0),
      u.value !== null ? (t(), T(bt, {
        key: 1,
        label: i.value[u.value].label,
        value: d(i.value[u.value].value),
        share: f(i.value[u.value].share)
      }, null, 8, ["label", "value", "share"])) : b("", !0)
    ]));
  }
}), Sy = {
  class: "divide-border flex flex-col divide-y",
  "data-slot": "stat-list"
}, My = ["data-heading"], By = {
  key: 1,
  class: "flex items-center justify-between gap-3 text-sm"
}, Ay = { class: "text-muted-foreground truncate" }, zy = ["aria-label"], lS = /* @__PURE__ */ L({
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
        const d = i.bar.segments.reduce((f, v) => f + Math.max(0, v.value), 0), u = Math.max(i.bar.total ?? d, d, 1);
        return {
          ...i,
          segments: i.bar.segments.map((f) => ({
            ...f,
            // A visible sliver rather than nothing, for a non-zero value
            // too small to round to a pixel - see `SegmentedBar`.
            width: f.value > 0 ? `max(2px, ${(Math.max(0, f.value) / u * 100).toFixed(2)}%)` : "0px"
          }))
        };
      })
    );
    return (i, d) => (t(), n("div", Sy, [
      (t(!0), n(_, null, j(s.value, (u) => (t(), n("div", {
        key: u.key,
        class: "flex flex-col gap-1.5 py-2.5 first:pt-0 last:pb-0",
        "data-heading": u.heading ? "true" : void 0
      }, [
        u.heading ? (t(), n("div", {
          key: 0,
          class: z(["pt-1 text-xs font-semibold tracking-wide uppercase", u.tone ? a[u.tone] : "text-muted-foreground"])
        }, c(u.label), 3)) : (t(), n("div", By, [
          l("span", Ay, c(u.label), 1),
          l("span", {
            class: z(["shrink-0 font-medium tabular-nums", u.tone ? a[u.tone] : "text-foreground"])
          }, c(u.value), 3)
        ])),
        u.segments.length ? (t(), n("div", {
          key: 2,
          class: "bg-muted flex h-1.5 w-full overflow-hidden rounded-full",
          role: "img",
          "aria-label": u.segments.map((f) => `${f.label} ${f.value}`).join(", ")
        }, [
          (t(!0), n(_, null, j(u.segments, (f, v) => (t(), n("span", {
            key: v,
            class: z(["h-full transition-all", r[f.tone ?? "neutral"]]),
            style: ie({ width: f.width })
          }, null, 6))), 128))
        ], 8, zy)) : b("", !0)
      ], 8, My))), 128))
    ]));
  }
}), _y = {
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
}, Py = {
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "info",
  neutral: "outline"
};
function Ly(e) {
  return e.trim().toLowerCase().replace(/\s+/g, "-");
}
function Oy(e, o) {
  return o || (e ? _y[Ly(e)] ?? "neutral" : "neutral");
}
function jy(e, o) {
  return Py[Oy(e, o)];
}
const $e = /* @__PURE__ */ L({
  __name: "PkStatusBadge",
  props: {
    status: { default: null },
    tone: { default: null },
    class: {}
  },
  setup(e) {
    const o = e, a = y(() => jy(o.status, o.tone));
    return (r, s) => (t(), T(Ie, {
      variant: a.value,
      class: z(o.class)
    }, {
      default: O(() => [
        q(r.$slots, "default", {}, () => [
          U(c(e.status), 1)
        ])
      ]),
      _: 3
    }, 8, ["variant", "class"]));
  }
}), Vy = ["data-layout"], Dy = ["src", "alt"], Ty = {
  key: 1,
  class: "text-muted-foreground flex size-full items-center justify-center text-lg font-medium"
}, Iy = ["src"], Ey = {
  key: 3,
  class: "absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1",
  "data-slot": "catalog-dots"
}, Fy = ["onMouseenter"], Ny = { class: "flex min-w-0 flex-1 items-start justify-between gap-2" }, Ry = { class: "min-w-0" }, Uy = { class: "truncate text-sm font-medium" }, Hy = {
  key: 0,
  class: "text-muted-foreground truncate text-xs"
}, Ky = {
  key: 1,
  class: "text-muted-foreground line-clamp-2 text-xs"
}, qy = { class: "mt-auto flex items-end justify-between gap-2 pt-1" }, Gy = { class: "min-w-0" }, Wy = {
  key: 0,
  class: "text-sm font-semibold tabular-nums"
}, Zy = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal tabular-nums"
}, Jy = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Yy = ["d"], Qy = ["aria-label"], Xy = /* @__PURE__ */ L({
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
    }, r = e, s = o, i = K(0);
    function d(k) {
      if (typeof k != "string")
        return null;
      const A = k.trim();
      return A === "" ? null : /^(https?:)?\/\//i.test(A) ? A : null;
    }
    const u = y(() => {
      const k = [r.item.image, ...r.item.images ?? []].map(d).filter((A) => A !== null);
      return [...new Set(k)];
    }), f = y(() => u.value[i.value] ?? u.value[0] ?? null), v = y(
      () => r.item.label.split(/\s+/).slice(0, 2).map((k) => k[0]?.toUpperCase() ?? "").join("")
    ), m = y(() => {
      const k = r.item.progress;
      if (!k)
        return null;
      const A = Math.max(k.total ?? 100, k.value, 1);
      return `${Math.min(100, Math.max(0, k.value / A * 100)).toFixed(2)}%`;
    }), h = y(() => u.value.length > 1 ? u.value[1] : null), M = y(
      () => (r.item.kind ?? "product") === "product" && r.item.status !== "out-of-stock"
    ), $ = y(() => typeof r.item.stock != "number" ? null : `${r.item.stock} in stock`);
    function C(k) {
      k.stopPropagation(), s("cart", r.item.key);
    }
    return (k, A) => (t(), n("article", {
      "data-slot": "catalog-card",
      class: z(["bg-card hover:bg-muted/40 flex w-full cursor-pointer overflow-hidden rounded-lg border text-left transition-colors", e.layout === "list" ? "flex-row items-stretch" : "flex-col"]),
      "data-layout": e.layout,
      role: "button",
      tabindex: "0",
      onClick: A[0] || (A[0] = (B) => s("select", e.item.key)),
      onKeydown: A[1] || (A[1] = Ct(ge((B) => s("select", e.item.key), ["prevent"]), ["enter"])),
      onMouseleave: A[2] || (A[2] = (B) => i.value = 0)
    }, [
      l("div", {
        class: z([
          "bg-muted relative overflow-hidden",
          e.layout === "list" ? "aspect-square w-20 shrink-0 sm:w-24" : "aspect-[4/3] w-full"
        ])
      }, [
        f.value ? (t(), n("img", {
          key: 0,
          src: f.value,
          alt: e.item.label,
          loading: "lazy",
          class: "size-full object-cover"
        }, null, 8, Dy)) : (t(), n("span", Ty, c(v.value), 1)),
        e.layout === "grid" && h.value && i.value === 0 ? (t(), n("img", {
          key: 2,
          src: h.value,
          alt: "",
          loading: "lazy",
          class: "ring-background pointer-events-none absolute right-1.5 bottom-1.5 size-10 rounded-md object-cover ring-2",
          "data-slot": "catalog-peek"
        }, null, 8, Iy)) : b("", !0),
        e.layout === "grid" && u.value.length > 1 ? (t(), n("div", Ey, [
          (t(!0), n(_, null, j(u.value, (B, w) => (t(), n("span", {
            key: w,
            class: z(["size-1.5 rounded-full", w === i.value ? "bg-background" : "bg-background/50"]),
            onMouseenter: (p) => i.value = w
          }, null, 42, Fy))), 128))
        ])) : b("", !0)
      ], 2),
      l("div", {
        class: z(["flex min-w-0 flex-1", e.layout === "list" ? "items-center gap-3 p-3" : "flex-col gap-1 p-3"])
      }, [
        l("div", Ny, [
          l("div", Ry, [
            l("p", Uy, c(e.item.label), 1),
            e.item.caption ? (t(), n("p", Hy, c(e.item.caption), 1)) : b("", !0),
            e.item.facts?.length ? (t(), n("p", Ky, c(e.item.facts.join(" · ")), 1)) : b("", !0)
          ]),
          e.item.status ? (t(), T($e, {
            key: 0,
            status: e.item.status,
            tone: e.item.tone
          }, null, 8, ["status", "tone"])) : b("", !0)
        ]),
        l("div", qy, [
          l("div", Gy, [
            e.item.price ? (t(), n("p", Wy, c(e.item.price), 1)) : b("", !0),
            $.value ? (t(), n("p", Zy, c($.value), 1)) : b("", !0)
          ]),
          M.value ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-muted inline-flex size-8 shrink-0 items-center justify-center rounded-md border",
            "aria-label": "Add to cart",
            "data-slot": "catalog-cart",
            onClick: C
          }, [
            (t(), n("svg", Jy, [
              l("path", {
                d: x(me)("cart")
              }, null, 8, Yy)
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
        ], 8, Qy)) : b("", !0)
      ], 2)
    ], 42, Vy));
  }
});
function ex(e) {
  return e === 30 ? "Per month" : e === 365 ? "Per year" : "Lifetime";
}
function tx(e) {
  return e === !0 || e === !1 ? "" : e === -1 || e === "-1" ? "Unlimited" : Array.isArray(e) ? e.join(", ") : String(e);
}
function nx(e) {
  return e === !1 || e === 0 || e === "0" || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : !0;
}
const ax = ["data-featured", "data-recommended"], lx = { class: "flex flex-col gap-1" }, ox = {
  key: 0,
  class: "text-muted-foreground mb-1 flex flex-wrap gap-2 text-xs font-medium"
}, sx = { key: 0 }, rx = { key: 1 }, ix = { key: 2 }, dx = { key: 3 }, ux = { class: "text-sm font-semibold" }, cx = { class: "flex items-baseline gap-1" }, fx = { class: "text-3xl font-semibold tracking-tight tabular-nums" }, mx = { class: "text-muted-foreground text-sm font-normal" }, px = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal text-pretty"
}, vx = { class: "text-muted-foreground mt-1 text-xs" }, gx = { class: "flex flex-1 flex-col gap-2 text-sm" }, hx = { class: "flex min-w-0 items-start gap-2" }, bx = {
  key: 0,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, yx = ["d"], xx = {
  key: 1,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, kx = ["d"], $x = { class: "capitalize" }, wx = {
  key: 0,
  class: "text-muted-foreground max-w-[40%] shrink-0 text-end text-xs font-medium"
}, Cx = { class: "text-foreground font-medium" }, Sx = { class: "mt-auto flex gap-2 pt-2" }, Mx = /* @__PURE__ */ L({
  __name: "PlanCard",
  props: {
    plan: {},
    canDelete: { type: Boolean, default: !0 }
  },
  emits: ["edit", "delete"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.plan.priceFormatted ?? String(a.plan.price)), i = y(() => !!(a.plan.featured || a.plan.recommended)), d = y(() => {
      const f = a.plan.perks ?? {};
      return Object.entries(f).map(([v, m]) => ({
        key: v,
        label: v.replace(/_/g, " "),
        granted: nx(m.value),
        display: tx(m.value)
      }));
    }), u = y(() => a.plan.extraPerks ?? []);
    return (f, v) => (t(), n("article", {
      class: z(["bg-card text-card-foreground hover:bg-muted/40 flex cursor-pointer flex-col gap-4 rounded-lg border p-6 text-left transition-colors", i.value ? "border-primary shadow-sm" : ""]),
      "data-slot": "plan-card",
      "data-featured": e.plan.featured ? "true" : void 0,
      "data-recommended": e.plan.recommended ? "true" : void 0,
      role: "button",
      tabindex: "0",
      onClick: v[2] || (v[2] = (m) => r("edit", e.plan.id)),
      onKeydown: v[3] || (v[3] = Ct(ge((m) => r("edit", e.plan.id), ["prevent"]), ["enter"]))
    }, [
      l("header", lx, [
        e.plan.recommended || e.plan.featured || e.plan.trial || e.plan.active === !1 ? (t(), n("p", ox, [
          e.plan.recommended ? (t(), n("span", sx, "Recommended")) : e.plan.featured ? (t(), n("span", rx, "Featured")) : b("", !0),
          e.plan.trial ? (t(), n("span", ix, "Trial")) : b("", !0),
          e.plan.active === !1 ? (t(), n("span", dx, "Inactive")) : b("", !0)
        ])) : b("", !0),
        l("h3", ux, c(e.plan.name), 1),
        l("p", cx, [
          l("span", fx, c(s.value), 1),
          l("span", mx, c(x(ex)(e.plan.days)), 1)
        ]),
        e.plan.shortDescription ? (t(), n("p", px, c(e.plan.shortDescription), 1)) : b("", !0),
        l("p", vx, " Active seats: " + c(e.plan.activeUsers ?? 0), 1)
      ]),
      l("ul", gx, [
        (t(!0), n(_, null, j(d.value, (m) => (t(), n("li", {
          key: m.key,
          class: "flex items-start justify-between gap-3"
        }, [
          l("span", hx, [
            l("span", {
              class: z(["mt-0.5 shrink-0", m.granted ? "text-success" : "text-muted-foreground"]),
              "aria-hidden": "true"
            }, [
              m.granted ? (t(), n("svg", bx, [
                l("path", {
                  d: x(me)("check")
                }, null, 8, yx)
              ])) : (t(), n("svg", xx, [
                l("path", {
                  d: x(me)("x")
                }, null, 8, kx)
              ]))
            ], 2),
            l("span", $x, c(m.label), 1)
          ]),
          m.display ? (t(), n("span", wx, c(m.display), 1)) : b("", !0)
        ]))), 128)),
        (t(!0), n(_, null, j(u.value, (m, h) => (t(), n("li", {
          key: `extra-${h}`,
          class: "text-muted-foreground flex justify-between gap-3 text-sm"
        }, [
          l("span", null, c(m.key), 1),
          l("span", Cx, c(m.value), 1)
        ]))), 128))
      ]),
      l("footer", Sx, [
        I(ce, {
          class: "flex-1",
          variant: "default",
          size: "sm",
          onClick: v[0] || (v[0] = ge((m) => r("edit", e.plan.id), ["stop"]))
        }, {
          default: O(() => [...v[4] || (v[4] = [
            U(" Edit ", -1)
          ])]),
          _: 1
        }),
        I(ce, {
          class: "flex-1",
          variant: "outline",
          size: "sm",
          disabled: e.canDelete === !1 || (e.plan.activeUsers ?? 0) > 0,
          onClick: v[1] || (v[1] = ge((m) => r("delete", e.plan.id), ["stop"]))
        }, {
          default: O(() => [...v[5] || (v[5] = [
            U(" Delete ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 42, ax));
  }
}), Bx = { class: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" }, Ax = {
  key: 0,
  class: "text-xl font-semibold tracking-tight sm:text-2xl"
}, zx = {
  key: 1,
  class: "text-muted-foreground mt-1 text-sm"
}, _x = {
  key: 0,
  class: "text-muted-foreground rounded-lg border border-dashed px-6 py-16 text-center text-sm"
}, Px = {
  key: 1,
  class: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
}, oS = /* @__PURE__ */ L({
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
      l("header", Bx, [
        l("div", null, [
          e.title ? (t(), n("h1", Ax, c(e.title), 1)) : b("", !0),
          e.description ? (t(), n("p", zx, c(e.description), 1)) : b("", !0)
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
      e.plans.length === 0 ? (t(), n("p", _x, " No plans yet. Create one to offer organisations a bundle of modules and limits. ")) : (t(), n("div", Px, [
        (t(!0), n(_, null, j(e.plans, (i) => (t(), T(Mx, {
          key: i.id,
          plan: i,
          onEdit: s[1] || (s[1] = (d) => a("edit", d)),
          onDelete: s[2] || (s[2] = (d) => a("delete", d))
        }, null, 8, ["plan"]))), 128))
      ]))
    ], 2));
  }
}), Lx = { class: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" }, Ox = { class: "text-xl font-semibold tracking-tight sm:text-2xl" }, jx = { class: "flex flex-col-reverse items-start gap-6 lg:flex-row" }, Vx = { class: "bg-card w-full flex-1 space-y-4 rounded-lg border p-5" }, Dx = { class: "space-y-1.5" }, Tx = { class: "space-y-1.5" }, Ix = { class: "space-y-1.5" }, Ex = { class: "space-y-1.5" }, Fx = { class: "space-y-1.5" }, Nx = { class: "flex items-center gap-3 text-sm" }, Rx = { class: "flex items-center gap-3 text-sm" }, Ux = { class: "flex items-center gap-3 text-sm" }, Hx = {
  key: 0,
  class: "space-y-1.5"
}, Kx = { class: "flex items-center gap-3 text-sm" }, qx = { class: "bg-card w-full flex-1 space-y-4 rounded-lg border p-5" }, Gx = { class: "space-y-1.5" }, Wx = ["value"], Zx = {
  key: 0,
  class: "flex items-center gap-3 text-sm"
}, Jx = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, Yx = ["id", "value", "onInput"], Qx = { class: "space-y-2" }, Xx = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, e0 = ["d"], sS = /* @__PURE__ */ L({
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
    function d(w, p) {
      const g = i.perks?.[w]?.value;
      return g ?? p;
    }
    function u(w, p, g) {
      const S = i.perks?.[w];
      i.perks = {
        ...i.perks ?? {},
        [w]: {
          value: p,
          overview: g ?? S?.overview ?? ""
        }
      };
    }
    function f(w, p) {
      const g = i.perks?.[w];
      i.perks = {
        ...i.perks ?? {},
        [w]: {
          value: g?.value ?? (w === "modules" ? [] : 0),
          overview: p
        }
      };
    }
    function v(w) {
      const p = w ? { ...a(), ...w } : a();
      i.id = p.id, i.name = p.name, i.shortDescription = p.shortDescription ?? "", i.description = p.description ?? "", i.days = p.days, i.price = p.price, i.featured = p.featured ?? !1, i.recommended = p.recommended ?? !1, i.trial = p.trial ?? !1, i.trialDays = p.trialDays ?? 0, i.active = p.active ?? !0, i.perks = { ...p.perks ?? {} }, i.extraPerks = [...p.extraPerks ?? []], i.perks.modules || u("modules", []);
    }
    v(r.plan), pe(
      () => r.plan,
      (w) => v(w),
      { deep: !0 }
    );
    const m = y({
      get: () => {
        const w = d("modules", []);
        return Array.isArray(w) ? w.map(String) : [];
      },
      set: (w) => {
        u(
          "modules",
          M(w.map(String)),
          i.perks?.modules?.overview ?? ""
        );
      }
    }), h = y(
      () => r.modules.map((w) => ({ value: w.key, label: w.label }))
    );
    function M(w) {
      const p = Object.fromEntries(r.modules.map((F) => [F.key, F])), g = new Set(w);
      for (const F of r.modules)
        if (!g.has(F.key))
          for (const D of F.children ?? [])
            g.delete(D);
      let S = !0;
      for (; S; ) {
        S = !1;
        for (const F of [...g])
          for (const D of p[F]?.requires ?? [])
            g.has(D) || (g.add(D), S = !0);
      }
      return [...g];
    }
    function $() {
      i.extraPerks = [...i.extraPerks ?? [], { key: "", value: "" }];
    }
    function C(w) {
      i.extraPerks = (i.extraPerks ?? []).filter((p, g) => g !== w);
    }
    function k() {
      s("save", {
        ...i,
        extraPerks: (i.extraPerks ?? []).filter((w) => w.key.trim() !== "")
      });
    }
    const A = `file:text-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${He}`, B = `dark:bg-input/30 border-input min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${He}`;
    return (w, p) => (t(), n("form", {
      class: z(["w-full space-y-6", e.embedded ? "" : x(lt)]),
      "data-slot": "plan-editor",
      onSubmit: ge(k, ["prevent"])
    }, [
      l("header", Lx, [
        l("div", null, [
          l("h1", Ox, c(e.mode === "edit" ? "Edit plan" : "Create plan"), 1),
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
      l("div", jx, [
        l("section", Vx, [
          p[26] || (p[26] = l("h2", { class: "font-semibold" }, "Plan details", -1)),
          l("div", Dx, [
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
          l("div", Tx, [
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
          l("div", Ix, [
            I(_e, { for: "plan-description" }, {
              default: O(() => [...p[17] || (p[17] = [
                U("Plan description", -1)
              ])]),
              _: 1
            }),
            he(l("textarea", {
              id: "plan-description",
              "onUpdate:modelValue": p[3] || (p[3] = (g) => i.description = g),
              required: "",
              placeholder: "Shown on the company-wide catalogue",
              class: z(B)
            }, null, 512), [
              [ze, i.description]
            ])
          ]),
          l("div", Ex, [
            I(_e, { for: "plan-days" }, {
              default: O(() => [...p[18] || (p[18] = [
                U("Duration", -1)
              ])]),
              _: 1
            }),
            he(l("select", {
              id: "plan-days",
              "onUpdate:modelValue": p[4] || (p[4] = (g) => i.days = g),
              class: z(A)
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
          l("div", Fx, [
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
          l("label", Nx, [
            I(x(Je), {
              checked: !!i.featured,
              "onUpdate:checked": p[6] || (p[6] = (g) => i.featured = g)
            }, null, 8, ["checked"]),
            p[21] || (p[21] = U(" Featured ", -1))
          ]),
          l("label", Rx, [
            I(x(Je), {
              checked: !!i.recommended,
              "onUpdate:checked": p[7] || (p[7] = (g) => i.recommended = g)
            }, null, 8, ["checked"]),
            p[22] || (p[22] = U(" Recommended ", -1))
          ]),
          l("label", Ux, [
            I(x(Je), {
              checked: !!i.trial,
              "onUpdate:checked": p[8] || (p[8] = (g) => i.trial = g)
            }, null, 8, ["checked"]),
            p[23] || (p[23] = U(" Offer a trial ", -1))
          ]),
          i.trial ? (t(), n("div", Hx, [
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
          l("label", Kx, [
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
              U(c(e.mode === "edit" ? "Save plan" : "Create plan"), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        l("section", qx, [
          p[33] || (p[33] = l("h2", { class: "font-semibold" }, "Plan perks", -1)),
          l("div", Gx, [
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
              class: z(B),
              onInput: p[12] || (p[12] = (g) => f("modules", g.target.value))
            }, null, 40, Wx)
          ]),
          (t(!0), n(_, null, j(e.limits, (g) => (t(), n("div", {
            key: g.key,
            class: "space-y-1.5"
          }, [
            g.kind === "toggle" ? (t(), n("label", Zx, [
              I(x(Je), {
                checked: !!d(g.key, !1),
                "onUpdate:checked": (S) => u(
                  g.key,
                  S,
                  i.perks?.[g.key]?.overview ?? ""
                )
              }, null, 8, ["checked", "onUpdate:checked"]),
              U(" " + c(g.label), 1)
            ])) : (t(), n(_, { key: 1 }, [
              I(_e, {
                for: `plan-limit-${g.key}`
              }, {
                default: O(() => [
                  U(c(g.label), 1)
                ]),
                _: 2
              }, 1032, ["for"]),
              g.hint ? (t(), n("p", Jx, c(g.hint), 1)) : b("", !0),
              I(we, {
                id: `plan-limit-${g.key}`,
                "model-value": Number(d(g.key, 0)),
                type: "number",
                step: g.step ?? 1,
                required: "",
                "onUpdate:modelValue": (S) => u(
                  g.key,
                  Number(S),
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
              class: z(B),
              onInput: (S) => f(g.key, S.target.value)
            }, null, 40, Yx)
          ]))), 128)),
          l("div", Qx, [
            p[32] || (p[32] = l("p", { class: "text-sm font-semibold" }, "Extra perks", -1)),
            (t(!0), n(_, null, j(i.extraPerks ?? [], (g, S) => (t(), n("div", {
              key: S,
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
                onClick: (F) => C(S)
              }, {
                default: O(() => [
                  (t(), n("svg", Xx, [
                    l("path", {
                      d: x(me)("x")
                    }, null, 8, e0)
                  ]))
                ]),
                _: 1
              }, 8, ["onClick"])
            ]))), 128)),
            I(ce, {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: $
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
}), t0 = ["data-current", "data-recommended"], n0 = {
  key: 0,
  class: "bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
}, a0 = {
  key: 1,
  class: "bg-primary/10 text-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold"
}, l0 = { class: "text-sm font-semibold" }, o0 = { class: "flex items-baseline gap-1" }, s0 = { class: "text-4xl font-bold tracking-tight tabular-nums" }, r0 = { class: "text-muted-foreground text-sm font-normal" }, i0 = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal text-pretty"
}, d0 = {
  key: 2,
  class: "flex flex-1 flex-col gap-2 text-sm"
}, u0 = {
  class: "text-success mt-0.5 shrink-0",
  "aria-hidden": "true"
}, c0 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, f0 = ["d"], m0 = { class: "text-muted-foreground" }, p0 = {
  key: 3,
  class: "flex-1"
}, v0 = {
  key: 4,
  class: "mt-auto pt-2"
}, rS = /* @__PURE__ */ L({
  __name: "PlanPurchaseCard",
  props: {
    plan: {},
    annual: { type: Boolean, default: !1 },
    processing: { type: Boolean, default: !1 }
  },
  emits: ["choose"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.annual && a.plan.annualPrice !== void 0 ? a.plan.annualPriceFormatted ?? String(a.plan.annualPrice) : a.plan.priceFormatted ?? String(a.plan.price)), i = y(() => a.annual && a.plan.annualPrice !== void 0 ? "year" : a.plan.interval ?? "month"), d = y(() => !!a.plan.recommended && !a.plan.current);
    return (u, f) => (t(), n("article", {
      class: z([
        "bg-card text-card-foreground relative flex flex-col gap-4 rounded-xl border p-6 transition-shadow",
        d.value ? "border-primary shadow-lg ring-1 ring-primary/20" : e.plan.current ? "border-primary/40" : ""
      ]),
      "data-slot": "plan-purchase-card",
      "data-current": e.plan.current ? "true" : void 0,
      "data-recommended": e.plan.recommended ? "true" : void 0
    }, [
      d.value ? (t(), n("span", n0, " Most popular ")) : e.plan.current ? (t(), n("span", a0, " Current plan ")) : b("", !0),
      l("header", {
        class: z(["flex flex-col gap-1", d.value || e.plan.current ? "pt-2" : ""])
      }, [
        l("h3", l0, c(e.plan.name), 1),
        l("p", o0, [
          l("span", s0, c(s.value), 1),
          l("span", r0, "/ " + c(i.value), 1)
        ]),
        e.plan.description ? (t(), n("p", i0, c(e.plan.description), 1)) : b("", !0)
      ], 2),
      e.plan.features?.length ? (t(), n("ul", d0, [
        (t(!0), n(_, null, j(e.plan.features, (v, m) => (t(), n("li", {
          key: m,
          class: "flex items-start gap-2"
        }, [
          l("span", u0, [
            (t(), n("svg", c0, [
              l("path", {
                d: x(me)("check")
              }, null, 8, f0)
            ]))
          ]),
          l("span", m0, c(v), 1)
        ]))), 128))
      ])) : (t(), n("div", p0)),
      e.plan.current ? b("", !0) : (t(), n("footer", v0, [
        I(ce, {
          class: "w-full",
          variant: d.value ? "default" : "outline",
          size: "sm",
          disabled: e.processing,
          onClick: f[0] || (f[0] = (v) => r("choose", e.plan.id))
        }, {
          default: O(() => [
            U(c(e.processing ? "Redirecting…" : "Choose plan"), 1)
          ]),
          _: 1
        }, 8, ["variant", "disabled"])
      ]))
    ], 10, t0));
  }
}), g0 = {
  key: 0,
  "data-slot": "catalog-toolbar",
  class: "flex flex-col gap-3"
}, h0 = { class: "flex flex-wrap items-center gap-2 sm:flex-nowrap" }, b0 = {
  key: 0,
  class: "relative min-w-0 max-w-sm flex-1"
}, y0 = {
  class: "text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, x0 = ["d"], k0 = {
  key: 1,
  class: "ml-auto inline-flex shrink-0 rounded-md border",
  "data-slot": "catalog-layout",
  role: "group",
  "aria-label": "Layout"
}, $0 = ["aria-pressed"], w0 = ["aria-pressed"], C0 = {
  key: 0,
  class: "flex flex-col gap-2"
}, S0 = ["aria-label"], M0 = {
  key: 0,
  class: "text-muted-foreground mr-1 text-xs font-medium"
}, B0 = ["aria-pressed", "onClick"], A0 = ["aria-label"], z0 = { class: "text-muted-foreground mr-1 text-xs font-medium" }, _0 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, P0 = ["data-slot"], L0 = {
  key: 3,
  class: "flex items-center justify-between gap-3",
  "data-slot": "catalog-pagination"
}, O0 = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, j0 = { class: "flex items-center gap-2" }, V0 = ["disabled"], D0 = ["disabled"], mn = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(""), i = vt(e, "modelValue"), d = ft({}), u = ft({});
    pe(s, () => h());
    function f(D) {
      const Y = D.trim();
      if (Y === "")
        return null;
      const G = Number(Y);
      return Number.isFinite(G) ? G : null;
    }
    function v() {
      const D = {};
      for (const [Y, G] of Object.entries(u))
        D[Y] = { min: f(G.min), max: f(G.max) };
      return D;
    }
    function m() {
      return { query: s.value, selected: { ...d }, ranges: v() };
    }
    function h() {
      r("filter", m());
    }
    function M(D, Y) {
      d[D] = d[D] === Y ? null : Y, h();
    }
    function $(D) {
      return u[D] ?? { min: "", max: "" };
    }
    function C(D, Y, G) {
      const Z = u[D] ?? { min: "", max: "" };
      u[D] = { ...Z, [Y]: G }, h();
    }
    function k(D) {
      D.key === "Enter" && (D.preventDefault(), r("scan", s.value.trim()));
    }
    const A = y(
      () => a.facets.filter((D) => (D.kind ?? "chips") === "chips")
    ), B = y(() => a.facets.filter((D) => D.kind === "range")), w = y(
      () => a.searchable || a.facets.length > 0 || a.layoutToggle
    ), p = K(1);
    pe(
      () => a.items.map((D) => D.key).join(","),
      () => {
        p.value = 1;
      }
    );
    const g = y(() => {
      const D = a.pageSize;
      return !D || D < 1 ? 1 : Math.max(1, Math.ceil(a.items.length / D));
    }), S = y(() => {
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
      w.value ? (t(), n("div", g0, [
        l("div", h0, [
          e.searchable ? (t(), n("div", b0, [
            (t(), n("svg", y0, [
              l("path", {
                d: x(me)("search")
              }, null, 8, x0)
            ])),
            I(we, {
              modelValue: s.value,
              "onUpdate:modelValue": Y[0] || (Y[0] = (G) => s.value = G),
              type: "search",
              placeholder: e.searchPlaceholder,
              class: "pl-8",
              "aria-label": e.searchPlaceholder,
              autofocus: e.autofocus || void 0,
              onKeydown: k
            }, null, 8, ["modelValue", "placeholder", "aria-label", "autofocus"])
          ])) : b("", !0),
          q(D.$slots, "toolbar"),
          e.layoutToggle ? (t(), n("div", k0, [
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "grid" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "grid" ? "true" : "false",
              "aria-label": "Grid",
              onClick: Y[1] || (Y[1] = (G) => i.value = "grid")
            }, " Tiles ", 10, $0),
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "list" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "list" ? "true" : "false",
              "aria-label": "List",
              onClick: Y[2] || (Y[2] = (G) => i.value = "list")
            }, " List ", 10, w0)
          ])) : b("", !0)
        ]),
        A.value.length || B.value.length ? (t(), n("div", C0, [
          (t(!0), n(_, null, j(A.value, (G) => (t(), n("div", {
            key: G.key,
            class: "flex flex-wrap items-center gap-1.5",
            "aria-label": G.label ?? G.key
          }, [
            G.label ? (t(), n("span", M0, c(G.label), 1)) : b("", !0),
            (t(!0), n(_, null, j(G.options ?? [], (Z) => (t(), n("button", {
              key: Z.value,
              type: "button",
              class: z([
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                d[G.key] === Z.value ? "bg-foreground text-background border-foreground" : "bg-background text-foreground hover:bg-muted/60"
              ]),
              "aria-pressed": d[G.key] === Z.value ? "true" : "false",
              onClick: (W) => M(G.key, Z.value)
            }, c(Z.label), 11, B0))), 128))
          ], 8, S0))), 128)),
          (t(!0), n(_, null, j(B.value, (G) => (t(), n("div", {
            key: G.key,
            class: "flex flex-wrap items-center gap-1.5",
            "aria-label": G.label ?? G.key,
            "data-slot": "catalog-range"
          }, [
            l("span", z0, c(G.label ?? G.key), 1),
            I(we, {
              type: "number",
              class: "h-8 w-24 px-2 text-xs",
              placeholder: "From",
              "aria-label": `${G.label ?? G.key} from`,
              "model-value": $(G.key).min,
              "onUpdate:modelValue": (Z) => C(G.key, "min", String(Z))
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
            Y[7] || (Y[7] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "to", -1)),
            I(we, {
              type: "number",
              class: "h-8 w-24 px-2 text-xs",
              placeholder: "To",
              "aria-label": `${G.label ?? G.key} to`,
              "model-value": $(G.key).max,
              "onUpdate:modelValue": (Z) => C(G.key, "max", String(Z))
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ], 8, A0))), 128))
        ])) : b("", !0)
      ])) : b("", !0),
      e.items.length === 0 ? (t(), n("p", _0, " No matching items. ")) : (t(), n("div", {
        key: 2,
        class: z(i.value === "list" ? "flex flex-col gap-3" : x(cm)),
        "data-slot": i.value === "list" ? "catalog-list" : "catalog-grid"
      }, [
        (t(!0), n(_, null, j(S.value, (G) => (t(), T(Xy, {
          key: G.key,
          item: G,
          layout: i.value,
          onSelect: Y[3] || (Y[3] = (Z) => r("select", Z)),
          onCart: Y[4] || (Y[4] = (Z) => r("cart", Z))
        }, null, 8, ["item", "layout"]))), 128))
      ], 10, P0)),
      e.pageSize && g.value > 1 ? (t(), n("div", L0, [
        l("p", O0, " Page " + c(p.value) + " of " + c(g.value), 1),
        l("div", j0, [
          l("button", {
            type: "button",
            class: "rounded-md border bg-background px-2.5 py-1 text-xs font-medium disabled:opacity-40",
            disabled: p.value <= 1,
            onClick: Y[5] || (Y[5] = (G) => F(p.value - 1))
          }, " Previous ", 8, V0),
          l("button", {
            type: "button",
            class: "rounded-md border bg-background px-2.5 py-1 text-xs font-medium disabled:opacity-40",
            disabled: p.value >= g.value,
            onClick: Y[6] || (Y[6] = (G) => F(p.value + 1))
          }, " Next ", 8, D0)
        ])
      ])) : b("", !0)
    ], 2));
  }
}), T0 = ["aria-disabled"], I0 = ["disabled"], E0 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, F0 = ["d"], N0 = {
  class: "min-w-6 px-1 text-center text-sm tabular-nums",
  "aria-live": "polite"
}, R0 = ["disabled"], U0 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, H0 = ["d"], K0 = /* @__PURE__ */ L({
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
      const f = a.value + u;
      f < e.min || e.max !== null && f > e.max || (a.value = f, u < 0 ? r("decrease", f) : r("increase", f));
    }
    return (u, f) => (t(), n("div", {
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
        onClick: f[0] || (f[0] = (v) => d(-1))
      }, [
        (t(), n("svg", E0, [
          l("path", {
            d: x(me)("minus")
          }, null, 8, F0)
        ]))
      ], 8, I0),
      l("span", N0, c(a.value), 1),
      l("button", {
        type: "button",
        class: "hover:bg-muted inline-flex size-8 items-center justify-center disabled:opacity-40",
        disabled: e.disabled || i.value,
        "aria-label": "Increase quantity",
        onClick: f[1] || (f[1] = (v) => d(1))
      }, [
        (t(), n("svg", U0, [
          l("path", {
            d: x(me)("plus")
          }, null, 8, H0)
        ]))
      ], 8, R0)
    ], 8, T0));
  }
}), q0 = { class: "divide-border flex flex-col divide-y" }, G0 = { class: "min-w-0" }, W0 = { class: "truncate text-sm font-medium" }, Z0 = {
  key: 0,
  class: "text-muted-foreground mt-0.5 truncate text-xs"
}, J0 = { class: "flex shrink-0 items-center gap-2 text-sm" }, Y0 = {
  key: 1,
  class: "text-muted-foreground tabular-nums"
}, Q0 = {
  key: 2,
  class: "font-medium tabular-nums"
}, X0 = ["aria-label", "onClick"], e2 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, t2 = ["d"], n2 = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("div", q0, [
      (t(!0), n(_, null, j(e.items, (d) => (t(), n("div", {
        key: d.key,
        class: "flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
      }, [
        l("div", G0, [
          l("p", W0, c(d.label), 1),
          d.detail ? (t(), n("p", Z0, c(d.detail), 1)) : b("", !0)
        ]),
        l("div", J0, [
          e.editable ? (t(), T(K0, {
            key: 0,
            "model-value": r(d),
            "onUpdate:modelValue": (u) => a("qty", d.key, u)
          }, null, 8, ["model-value", "onUpdate:modelValue"])) : d.qty !== null && d.qty !== void 0 && d.qty !== "" ? (t(), n("span", Y0, " ×" + c(d.qty), 1)) : b("", !0),
          d.amount ? (t(), n("span", Q0, c(d.amount), 1)) : b("", !0),
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
            (t(), n("svg", e2, [
              l("path", {
                d: x(me)("trash")
              }, null, 8, t2)
            ]))
          ], 8, X0)) : b("", !0)
        ])
      ]))), 128))
    ]));
  }
}), a2 = {
  "data-slot": "cart-panel",
  class: "bg-card flex flex-col overflow-hidden rounded-lg border"
}, l2 = { class: "border-b px-4 py-3" }, o2 = { class: "text-sm font-medium" }, s2 = { class: "flex-1 px-4 py-3" }, r2 = {
  key: 0,
  class: "text-muted-foreground py-8 text-center text-sm",
  "data-slot": "cart-empty"
}, i2 = { class: "text-foreground block font-medium" }, d2 = { class: "mt-1 block" }, u2 = {
  key: 0,
  class: "flex flex-col gap-2 border-t px-4 py-3"
}, c2 = {
  key: 0,
  class: "flex items-center justify-between text-sm"
}, f2 = { class: "tabular-nums" }, m2 = {
  key: 1,
  class: "flex items-center justify-between text-sm",
  "data-slot": "cart-discount"
}, p2 = { class: "text-muted-foreground" }, v2 = {
  key: 0,
  class: "tabular-nums"
}, g2 = {
  key: 2,
  class: "flex items-center justify-between text-sm"
}, h2 = { class: "text-muted-foreground" }, b2 = { class: "tabular-nums" }, y2 = {
  key: 3,
  class: "flex items-center justify-between text-sm font-semibold"
}, x2 = { class: "tabular-nums" }, k2 = {
  key: 4,
  class: "pt-1"
}, $2 = /* @__PURE__ */ L({
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
    return (r, s) => (t(), n("aside", a2, [
      l("header", l2, [
        l("h2", o2, c(e.title), 1)
      ]),
      l("div", s2, [
        e.items.length === 0 ? (t(), n("p", r2, [
          l("span", i2, c(e.emptyTitle), 1),
          l("span", d2, c(e.emptyDescription), 1)
        ])) : (t(), T(n2, {
          key: 1,
          items: e.items,
          editable: "",
          onQty: s[0] || (s[0] = (i, d) => a("qty", i, d)),
          onRemove: s[1] || (s[1] = (i) => a("remove", i))
        }, null, 8, ["items"]))
      ]),
      e.items.length > 0 ? (t(), n("footer", u2, [
        e.subtotal ? (t(), n("div", c2, [
          s[2] || (s[2] = l("span", { class: "text-muted-foreground" }, "Subtotal", -1)),
          l("span", f2, c(e.subtotal), 1)
        ])) : b("", !0),
        e.discount || r.$slots.discount ? (t(), n("div", m2, [
          l("span", p2, c(e.discountLabel), 1),
          e.discount ? (t(), n("span", v2, c(e.discount), 1)) : b("", !0),
          q(r.$slots, "discount")
        ])) : b("", !0),
        e.tax ? (t(), n("div", g2, [
          l("span", h2, c(e.taxLabel), 1),
          l("span", b2, c(e.tax), 1)
        ])) : b("", !0),
        e.total ? (t(), n("div", y2, [
          s[3] || (s[3] = l("span", null, "Total", -1)),
          l("span", x2, c(e.total), 1)
        ])) : b("", !0),
        r.$slots.pay ? (t(), n("div", k2, [
          q(r.$slots, "pay")
        ])) : b("", !0)
      ])) : b("", !0)
    ]));
  }
});
function Fe() {
  return { query: "", selected: {}, ranges: {} };
}
function w2(e, o) {
  const a = e.metrics?.[o];
  if (typeof a == "number" && Number.isFinite(a))
    return a;
  const r = e.facets?.[o];
  if (r == null || r === "")
    return null;
  const s = Number(r);
  return Number.isFinite(s) ? s : null;
}
function C2(e, o) {
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
    if (!C2(w2(e, r), s))
      return !1;
  return !0;
}
function S2(e, o) {
  const a = o.trim().toLowerCase();
  return a === "" ? null : e.find((r) => {
    const s = (r.sku ?? "").trim().toLowerCase(), i = r.key.trim().toLowerCase();
    return s === a || i === a;
  }) ?? null;
}
function Pt(e) {
  return e.query.trim() !== "" || Object.values(e.selected ?? {}).some(Boolean) ? !0 : Object.values(e.ranges ?? {}).some(
    (o) => o.min !== null || o.max !== null
  );
}
const M2 = { class: "flex flex-col gap-6" }, B2 = {
  key: 0,
  class: "flex flex-col gap-1.5"
}, A2 = { class: "text-sm font-semibold" }, z2 = { class: "flex flex-wrap items-center gap-1.5" }, _2 = ["aria-pressed", "onClick"], P2 = { class: "text-sm font-semibold" }, L2 = { class: "flex flex-wrap items-center gap-1.5" }, O2 = { key: 0 }, ua = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(""), i = ft({}), d = ft({}), u = y(
      () => a.facets.filter((g) => (g.kind ?? "chips") === "chips")
    ), f = y(() => a.facets.filter((g) => g.kind === "range"));
    function v(g) {
      return g == null ? "" : String(g);
    }
    function m() {
      s.value = a.applied.query ?? "";
      for (const g of Object.keys(i))
        delete i[g];
      for (const [g, S] of Object.entries(a.applied.selected ?? {}))
        i[g] = S;
      for (const g of Object.keys(d))
        delete d[g];
      for (const [g, S] of Object.entries(a.applied.ranges ?? {}))
        d[g] = { min: v(S.min), max: v(S.max) };
    }
    pe(
      () => a.open,
      (g) => {
        g && m();
      }
    );
    function h(g) {
      const S = g.trim();
      if (S === "")
        return null;
      const F = Number(S);
      return Number.isFinite(F) ? F : null;
    }
    function M() {
      const g = {};
      for (const [S, F] of Object.entries(d))
        g[S] = { min: h(F.min), max: h(F.max) };
      return g;
    }
    function $() {
      return {
        query: a.hideSearch ? a.applied.query : s.value,
        selected: { ...i },
        ranges: M()
      };
    }
    const C = y(() => {
      let g = a.hideSearch || s.value.trim() === "" ? 0 : 1;
      for (const S of Object.values(i))
        S && (g += 1);
      for (const S of Object.values(M()))
        (S.min !== null || S.max !== null) && (g += 1);
      return g;
    });
    function k(g, S) {
      i[g] = i[g] === S ? null : S;
    }
    function A(g) {
      return d[g] ?? { min: "", max: "" };
    }
    function B(g, S, F) {
      const D = d[g] ?? { min: "", max: "" };
      d[g] = { ...D, [S]: F };
    }
    function w() {
      r("apply", $());
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
    return (g, S) => (t(), T(Lt, {
      open: e.open,
      title: e.title,
      description: e.description || (e.hideSearch ? "Category and stock for this list" : "Search, categories and ranges for this list"),
      size: "sm",
      onClose: S[2] || (S[2] = (F) => r("close"))
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
          onClick: S[1] || (S[1] = (F) => r("close"))
        }, {
          default: O(() => [...S[5] || (S[5] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }),
        I(ce, {
          size: "sm",
          onClick: w
        }, {
          default: O(() => [
            S[6] || (S[6] = U(" Apply", -1)),
            C.value ? (t(), n("span", O2, " (" + c(C.value) + ")", 1)) : b("", !0)
          ]),
          _: 1
        })
      ]),
      default: O(() => [
        l("div", M2, [
          e.hideSearch ? b("", !0) : (t(), n("label", B2, [
            S[3] || (S[3] = l("span", { class: "text-sm font-semibold" }, "Search", -1)),
            I(we, {
              modelValue: s.value,
              "onUpdate:modelValue": S[0] || (S[0] = (F) => s.value = F),
              type: "search",
              placeholder: e.searchPlaceholder,
              "aria-label": e.searchPlaceholder
            }, null, 8, ["modelValue", "placeholder", "aria-label"])
          ])),
          (t(!0), n(_, null, j(u.value, (F) => (t(), n("section", {
            key: F.key,
            class: "flex flex-col gap-2"
          }, [
            l("h3", A2, c(F.label ?? F.key), 1),
            l("div", z2, [
              (t(!0), n(_, null, j(F.options ?? [], (D) => (t(), n("button", {
                key: D.value,
                type: "button",
                class: z([
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  i[F.key] === D.value ? "border-foreground bg-foreground text-background" : "bg-background text-foreground hover:bg-muted/60"
                ]),
                "aria-pressed": i[F.key] === D.value ? "true" : "false",
                onClick: (Y) => k(F.key, D.value)
              }, c(D.label), 11, _2))), 128))
            ])
          ]))), 128)),
          (t(!0), n(_, null, j(f.value, (F) => (t(), n("section", {
            key: F.key,
            class: "flex flex-col gap-2"
          }, [
            l("h3", P2, c(F.label ?? F.key), 1),
            l("div", L2, [
              I(we, {
                type: "number",
                class: "h-8 w-24 px-2 text-xs",
                placeholder: "From",
                "aria-label": `${F.label ?? F.key} from`,
                "model-value": A(F.key).min,
                "onUpdate:modelValue": (D) => B(F.key, "min", String(D))
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
              S[4] || (S[4] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "to", -1)),
              I(we, {
                type: "number",
                class: "h-8 w-24 px-2 text-xs",
                placeholder: "To",
                "aria-label": `${F.label ?? F.key} to`,
                "model-value": A(F.key).max,
                "onUpdate:modelValue": (D) => B(F.key, "max", String(D))
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])
      ]),
      _: 1
    }, 8, ["open", "title", "description"]));
  }
}), j2 = {
  "data-slot": "catalog-till",
  class: "grid w-full items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
}, V2 = { class: "flex flex-col gap-4" }, D2 = { class: "flex flex-wrap items-start justify-between gap-3" }, T2 = { class: "flex items-center gap-2" }, I2 = {
  key: 0,
  class: "bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
}, iS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(Fe()), i = K(!1), d = vt(e, "cart"), u = K(!1), f = y(
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
    function M(G, Z, W) {
      return {
        ...G,
        qty: Z,
        amount: a.formatMoney(W * Z)
      };
    }
    function $(G) {
      const Z = S2(a.items, G);
      Z && C(Z.key);
    }
    function C(G) {
      const Z = a.items.find((N) => N.key === G);
      if (!Z || Z.status === "out-of-stock")
        return;
      u.value = !1;
      const W = h(Z);
      if (d.value.find((N) => N.key === G)) {
        d.value = d.value.map(
          (N) => N.key === G ? M(N, Number(N.qty ?? 1) + 1, W) : N
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
    function k(G, Z) {
      const W = a.items.find((N) => N.key === G), H = h(W);
      d.value = d.value.map((N) => N.key === G ? M(N, Z, H) : N);
    }
    function A(G) {
      d.value = d.value.filter((Z) => Z.key !== G);
    }
    const B = y(
      () => d.value.reduce((G, Z) => {
        const W = a.items.find((H) => H.key === Z.key);
        return G + h(W) * Number(Z.qty ?? 1);
      }, 0)
    ), w = y(
      () => a.discountRate > 0 ? Math.round(B.value * a.discountRate) : 0
    ), p = y(
      () => Math.round((B.value - w.value) * a.taxRate)
    ), g = y(() => d.value.length ? a.formatMoney(B.value) : null), S = y(
      () => d.value.length && w.value > 0 ? `−${a.formatMoney(w.value)}` : null
    ), F = y(
      () => d.value.length && a.taxRate > 0 ? a.formatMoney(p.value) : null
    ), D = y(
      () => d.value.length ? a.formatMoney(B.value - w.value + p.value) : null
    );
    function Y() {
      u.value = !0, r("pay", d.value);
    }
    return (G, Z) => (t(), n(_, null, [
      l("div", j2, [
        l("section", V2, [
          l("div", D2, [
            I(Ee, {
              variant: "small",
              title: e.shelfTitle,
              description: e.shelfDescription ?? void 0
            }, null, 8, ["title", "description"]),
            l("div", T2, [
              x(Pt)(s.value) ? (t(), n("button", {
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
                x(Pt)(s.value) ? (t(), n("span", I2, " on ")) : b("", !0)
              ])) : b("", !0)
            ])
          ]),
          I(mn, {
            searchable: "",
            autofocus: "",
            "search-placeholder": e.searchPlaceholder,
            items: f.value,
            onFilter: v,
            onSelect: Z[2] || (Z[2] = (W) => r("select", W)),
            onCart: C,
            onScan: $
          }, null, 8, ["search-placeholder", "items"])
        ]),
        I($2, {
          class: "lg:sticky lg:top-4",
          title: e.cartTitle,
          items: d.value,
          subtotal: g.value,
          "discount-label": e.discountLabel,
          discount: S.value,
          "tax-label": e.taxLabel,
          tax: F.value,
          total: D.value,
          onQty: k,
          onRemove: A
        }, {
          pay: O(() => [
            q(G.$slots, "pay", {
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
                  U(c(u.value ? "Paid" : "Pay"), 1)
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
}), E2 = {
  key: 0,
  class: "flex flex-col gap-5"
}, F2 = { class: "bg-muted aspect-[4/3] overflow-hidden rounded-lg" }, N2 = ["src", "alt"], R2 = {
  key: 0,
  class: "flex gap-2 overflow-x-auto"
}, U2 = ["src"], H2 = { class: "flex items-start justify-between gap-3" }, K2 = { class: "text-lg font-semibold tabular-nums" }, q2 = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, G2 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, W2 = { class: "grid grid-cols-2 gap-3" }, Z2 = { class: "flex flex-col gap-2" }, J2 = { class: "text-xs font-semibold tracking-wide text-muted-foreground uppercase" }, dS = /* @__PURE__ */ L({
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
      for (const M of m)
        h = h * 31 + M.charCodeAt(0) >>> 0;
      return h;
    }
    function i(m, h) {
      return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(($, C) => ({
        label: $,
        value: Math.max(0, Math.round(m + Math.sin(C + h) * m * 0.18))
      }));
    }
    const d = y(() => a.item?.kind === "unit"), u = y(() => {
      const m = a.item;
      if (!m)
        return [];
      const h = m.stock ?? m.progress?.value ?? m.metrics?.price ?? m.metrics?.rent ?? 12;
      return i(Number(h) || 12, s(m.key) % 7);
    }), f = y(() => {
      const m = a.item;
      if (!m)
        return [];
      const h = m.progress?.value ?? (m.status === "occupied" ? 80 : 20);
      return i(Number(h) || 20, s(m.key) % 5 + 1);
    }), v = y(
      () => !!a.item && !d.value && a.item?.status !== "out-of-stock"
    );
    return (m, h) => (t(), T(Lt, {
      open: e.open,
      title: e.item?.label ?? "Item",
      description: e.item?.caption ?? e.item?.sku ?? null,
      size: "md",
      onClose: h[1] || (h[1] = (M) => r("close"))
    }, ct({
      default: O(() => [
        e.item ? (t(), n("div", E2, [
          l("div", F2, [
            e.item.image ? (t(), n("img", {
              key: 0,
              src: e.item.image,
              alt: e.item.label,
              class: "size-full object-cover"
            }, null, 8, N2)) : b("", !0)
          ]),
          e.item.images?.length ? (t(), n("div", R2, [
            (t(!0), n(_, null, j(e.item.images, (M, $) => (t(), n("img", {
              key: $,
              src: M,
              alt: "",
              class: "size-16 shrink-0 rounded-md object-cover"
            }, null, 8, U2))), 128))
          ])) : b("", !0),
          l("div", H2, [
            l("div", null, [
              l("p", K2, c(e.item.price), 1),
              typeof e.item.stock == "number" ? (t(), n("p", q2, c(e.item.stock) + " in stock ", 1)) : b("", !0)
            ]),
            e.item.status ? (t(), T($e, {
              key: 0,
              status: e.item.status,
              tone: e.item.tone
            }, null, 8, ["status", "tone"])) : b("", !0)
          ]),
          e.item.facts?.length ? (t(), n("p", G2, c(e.item.facts.join(" · ")), 1)) : b("", !0),
          l("div", W2, [
            I(_t, {
              label: d.value ? "Occupancy" : "Stock",
              value: d.value ? `${e.item.progress?.value ?? 0}%` : String(e.item.stock ?? e.item.progress?.value ?? 0),
              series: d.value ? f.value : u.value
            }, null, 8, ["label", "value", "series"]),
            I(_t, {
              label: "Price",
              value: e.item.price ?? "-",
              series: u.value
            }, null, 8, ["value", "series"])
          ]),
          l("div", Z2, [
            l("p", J2, c(d.value ? "Occupancy, last 6 months" : "Stock movement, last 6 months"), 1),
            I(jt, {
              data: d.value ? f.value : u.value,
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
            onClick: h[0] || (h[0] = (M) => r("cart", e.item.key))
          }, " Add to cart ")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["open", "title", "description"]));
  }
}), Y2 = { class: "flex flex-col gap-10" }, Q2 = { class: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" }, X2 = { class: "flex flex-col gap-3" }, ek = { class: "bg-muted aspect-[4/3] overflow-hidden rounded-lg border" }, tk = ["src", "alt"], nk = {
  key: 0,
  class: "flex gap-2 overflow-x-auto"
}, ak = ["aria-label", "aria-pressed", "onClick"], lk = ["src"], ok = { class: "flex flex-col gap-5" }, sk = { class: "flex flex-wrap items-start justify-between gap-3" }, rk = { class: "min-w-0" }, ik = { class: "text-2xl font-semibold tracking-tight" }, dk = { class: "text-muted-foreground mt-1 text-sm" }, uk = { class: "text-2xl font-semibold tabular-nums" }, ck = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, fk = { class: "grid grid-cols-2 gap-3 text-sm" }, mk = {
  key: 0,
  class: "rounded-lg border p-3"
}, pk = { class: "mt-1 font-medium" }, vk = { class: "rounded-lg border p-3" }, gk = { class: "text-muted-foreground text-xs font-medium tracking-wide uppercase" }, hk = { class: "mt-1 font-medium" }, bk = { class: "flex flex-col gap-4" }, yk = { class: "grid gap-4 sm:grid-cols-2" }, xk = { class: "bg-card rounded-lg border p-4" }, kk = { class: "mb-3 text-sm font-medium" }, $k = /* @__PURE__ */ L({
  __name: "CatalogItemDetail",
  props: {
    item: {}
  },
  emits: ["cart"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s($) {
      let C = 0;
      for (const k of $)
        C = C * 31 + k.charCodeAt(0) >>> 0;
      return C;
    }
    function i($, C) {
      return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((A, B) => ({
        label: A,
        value: Math.max(0, Math.round($ + Math.sin(B + C) * $ * 0.18))
      }));
    }
    const d = y(() => a.item.kind === "unit"), u = y(() => {
      const $ = [a.item.image, ...a.item.images ?? []].filter(
        (C) => typeof C == "string" && C !== ""
      );
      return [...new Set($)];
    }), f = K(0), v = y(() => {
      const $ = a.item.stock ?? a.item.progress?.value ?? a.item.metrics?.price ?? a.item.metrics?.rent ?? 12;
      return i(Number($) || 12, s(a.item.key) % 7);
    }), m = y(() => {
      const $ = a.item.progress?.value ?? (a.item.status === "occupied" ? 80 : 20);
      return i(Number($) || 20, s(a.item.key) % 5 + 1);
    }), h = y(() => d.value ? m.value : v.value), M = y(() => !d.value && a.item.status !== "out-of-stock");
    return ($, C) => (t(), n("div", Y2, [
      l("div", Q2, [
        l("div", X2, [
          l("div", ek, [
            u.value[f.value] ? (t(), n("img", {
              key: 0,
              src: u.value[f.value],
              alt: e.item.label,
              class: "size-full object-cover"
            }, null, 8, tk)) : b("", !0)
          ]),
          u.value.length > 1 ? (t(), n("div", nk, [
            (t(!0), n(_, null, j(u.value, (k, A) => (t(), n("button", {
              key: k,
              type: "button",
              class: z(["size-16 shrink-0 overflow-hidden rounded-md border", A === f.value ? "ring-2 ring-foreground" : "opacity-80"]),
              "aria-label": `Photo ${A + 1}`,
              "aria-pressed": A === f.value ? "true" : "false",
              onClick: (B) => f.value = A
            }, [
              l("img", {
                src: k,
                alt: "",
                class: "size-full object-cover"
              }, null, 8, lk)
            ], 10, ak))), 128))
          ])) : b("", !0)
        ]),
        l("div", ok, [
          l("div", sk, [
            l("div", rk, [
              l("h1", ik, c(e.item.label), 1),
              l("p", dk, c(e.item.caption ?? e.item.sku), 1)
            ]),
            e.item.status ? (t(), T($e, {
              key: 0,
              status: e.item.status,
              tone: e.item.tone
            }, null, 8, ["status", "tone"])) : b("", !0)
          ]),
          l("p", uk, c(e.item.price), 1),
          e.item.facts?.length ? (t(), n("p", ck, c(e.item.facts.join(" · ")), 1)) : b("", !0),
          l("dl", fk, [
            e.item.sku ? (t(), n("div", mk, [
              C[1] || (C[1] = l("dt", { class: "text-muted-foreground text-xs font-medium tracking-wide uppercase" }, " SKU ", -1)),
              l("dd", pk, c(e.item.sku), 1)
            ])) : b("", !0),
            l("div", vk, [
              l("dt", gk, c(d.value ? "Occupancy" : "Stock"), 1),
              l("dd", hk, c(d.value ? `${e.item.progress?.value ?? 0}%` : `${e.item.stock ?? e.item.progress?.value ?? 0} in stock`), 1)
            ])
          ]),
          M.value ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2.5 text-sm font-medium sm:w-auto",
            onClick: C[0] || (C[0] = (k) => r("cart", e.item.key))
          }, " Add to cart ")) : b("", !0)
        ])
      ]),
      l("section", bk, [
        C[2] || (C[2] = l("h2", { class: "text-sm font-semibold tracking-wide text-muted-foreground uppercase" }, " Analytics ", -1)),
        l("div", yk, [
          I(_t, {
            label: d.value ? "Occupancy" : "Stock",
            value: d.value ? `${e.item.progress?.value ?? 0}%` : String(e.item.stock ?? e.item.progress?.value ?? 0),
            series: h.value
          }, null, 8, ["label", "value", "series"]),
          I(_t, {
            label: "Price",
            value: e.item.price ?? "-",
            series: v.value
          }, null, 8, ["value", "series"])
        ]),
        l("div", xk, [
          l("p", kk, c(d.value ? "Occupancy, last 6 months" : "Stock movement, last 6 months"), 1),
          I(eh, {
            data: h.value,
            type: "area",
            height: 220
          }, null, 8, ["data"])
        ])
      ])
    ]));
  }
}), wk = ["href"], uS = /* @__PURE__ */ L({
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
        U(" " + c(e.backLabel), 1)
      ], 8, wk),
      I($k, {
        item: e.item,
        onCart: s[0] || (s[0] = (i) => a("cart", i))
      }, null, 8, ["item"])
    ], 2));
  }
}), Ck = {
  key: 0,
  class: "inline-flex w-fit rounded-md border",
  role: "tablist",
  "aria-label": "Catalog section"
}, Sk = ["aria-selected", "onClick"], Mk = {
  class: "flex flex-wrap items-center gap-2 sm:flex-nowrap",
  "data-slot": "catalog-page-toolbar"
}, Bk = {
  key: 0,
  class: "bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
}, Ak = {
  class: "ml-auto inline-flex shrink-0 rounded-md border",
  role: "group",
  "aria-label": "Layout"
}, zk = ["aria-pressed"], _k = ["aria-pressed"], cS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(a.tabs[0]?.key ?? ""), i = vt(e, "layout"), d = K({}), u = K(!1);
    pe(
      () => a.tabs.map((k) => k.key).join(","),
      (k) => {
        k.split(",").includes(s.value) || (s.value = a.tabs[0]?.key ?? "");
      }
    );
    function f(k) {
      return d.value[k] ?? Fe();
    }
    const v = y(
      () => a.tabs.find((k) => k.key === s.value) ?? a.tabs[0] ?? null
    ), m = y(
      () => v.value ? f(v.value.key) : Fe()
    ), h = y(() => {
      const k = v.value;
      return k ? k.items.filter((A) => pn(A, f(k.key))) : [];
    });
    function M(k) {
      const A = v.value?.key;
      A && (d.value = {
        ...d.value,
        [A]: { ...f(A), query: k }
      });
    }
    function $() {
      const k = v.value?.key;
      k && (d.value = { ...d.value, [k]: Fe() });
    }
    function C(k) {
      const A = v.value?.key;
      A && (d.value = { ...d.value, [A]: k }, u.value = !1);
    }
    return (k, A) => (t(), n(_, null, [
      l("div", {
        class: z(["flex w-full flex-col gap-8", e.embedded ? "" : x(lt)])
      }, [
        I(Ee, {
          title: e.title,
          description: e.description ?? void 0
        }, null, 8, ["title", "description"]),
        e.tabs.length > 1 ? (t(), n("div", Ck, [
          (t(!0), n(_, null, j(e.tabs, (B) => (t(), n("button", {
            key: B.key,
            type: "button",
            class: z([
              "rounded px-3 py-1.5 text-sm transition-colors",
              s.value === B.key ? "bg-foreground text-background font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            ]),
            role: "tab",
            "aria-selected": s.value === B.key ? "true" : "false",
            onClick: (w) => s.value = B.key
          }, c(B.label), 11, Sk))), 128))
        ])) : b("", !0),
        l("div", Mk, [
          I(we, {
            class: "min-w-0 w-full flex-1 sm:max-w-xs",
            "model-value": m.value.query,
            type: "search",
            placeholder: v.value?.searchPlaceholder ?? "Search…",
            "aria-label": v.value?.searchPlaceholder ?? "Search",
            "onUpdate:modelValue": A[0] || (A[0] = (B) => M(String(B)))
          }, null, 8, ["model-value", "placeholder", "aria-label"]),
          x(Pt)(m.value) ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline",
            onClick: $
          }, " Clear ")) : b("", !0),
          (v.value?.facets ?? []).length > 0 ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "relative inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
            onClick: A[1] || (A[1] = (B) => u.value = !0)
          }, [
            A[8] || (A[8] = l("svg", {
              viewBox: "0 0 24 24",
              class: "size-4",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2"
            }, [
              l("path", { d: "M3 5h18M6 12h12M10 19h4" })
            ], -1)),
            A[9] || (A[9] = U(" Filters ", -1)),
            x(Pt)(m.value) ? (t(), n("span", Bk, " on ")) : b("", !0)
          ])) : b("", !0),
          l("div", Ak, [
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "grid" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "grid" ? "true" : "false",
              "aria-label": "Grid",
              onClick: A[2] || (A[2] = (B) => i.value = "grid")
            }, " Tiles ", 10, zk),
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "list" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "list" ? "true" : "false",
              "aria-label": "List",
              onClick: A[3] || (A[3] = (B) => i.value = "list")
            }, " List ", 10, _k)
          ])
        ]),
        I(mn, {
          layout: i.value,
          "onUpdate:layout": A[4] || (A[4] = (B) => i.value = B),
          "page-size": e.pageSize,
          items: h.value,
          onSelect: A[5] || (A[5] = (B) => r("select", B)),
          onCart: A[6] || (A[6] = (B) => r("cart", B))
        }, null, 8, ["layout", "page-size", "items"])
      ], 2),
      I(ua, {
        open: u.value,
        title: v.value?.filterTitle ?? "Filters",
        "search-placeholder": v.value?.searchPlaceholder ?? "Search…",
        facets: v.value?.facets ?? [],
        applied: m.value,
        onClose: A[7] || (A[7] = (B) => u.value = !1),
        onApply: C,
        onReset: $
      }, null, 8, ["open", "title", "search-placeholder", "facets", "applied"])
    ], 64));
  }
}), Pk = { class: "flex flex-col gap-4" }, Lk = { class: "flex flex-col gap-4" }, fS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(Fe()), i = y(
      () => a.cards.filter((d) => pn(d, s.value))
    );
    return (d, u) => (t(), n("div", {
      class: z(["flex w-full flex-col gap-10", e.embedded ? "" : x(lt)])
    }, [
      I(Ee, {
        title: e.title,
        description: e.description ?? void 0
      }, null, 8, ["title", "description"]),
      l("section", Pk, [
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
          onFilter: u[0] || (u[0] = (f) => s.value = f),
          onSelect: u[1] || (u[1] = (f) => r("select", f)),
          onCart: u[2] || (u[2] = (f) => r("cart", f))
        }, null, 8, ["search-placeholder", "facets", "items"])
      ]),
      l("section", Lk, [
        I(Ee, {
          variant: "small",
          title: e.tableTitle,
          description: e.tableDescription ?? void 0
        }, null, 8, ["title", "description"]),
        I(ho, {
          columns: e.columns,
          rows: e.rows,
          "empty-title": e.emptyTitle
        }, {
          "cell:status": O(({ value: f }) => [
            I($e, {
              status: String(f)
            }, {
              default: O(() => [
                U(c(f), 1)
              ]),
              _: 2
            }, 1032, ["status"])
          ]),
          _: 1
        }, 8, ["columns", "rows", "empty-title"])
      ])
    ], 2));
  }
}), Ok = {
  class: "flex flex-col gap-2",
  "data-slot": "signature-pad"
}, jk = { class: "text-sm font-medium" }, Vk = ["width", "height", "aria-label"], Dk = { class: "flex items-center gap-2" }, Tk = /* @__PURE__ */ L({
  __name: "PkSignaturePad",
  props: {
    width: { default: 480 },
    height: { default: 160 },
    disabled: { type: Boolean, default: !1 },
    label: { default: "Draw your signature" }
  },
  emits: ["save", "clear"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(null), i = K(!1);
    let d = null;
    function u() {
      return s.value?.getContext("2d") ?? null;
    }
    function f(k) {
      const A = s.value;
      if (!A)
        return null;
      const B = A.getBoundingClientRect(), w = A.width / B.width, p = A.height / B.height;
      return {
        x: (k.clientX - B.left) * w,
        y: (k.clientY - B.top) * p
      };
    }
    function v(k) {
      a.disabled || (i.value = !0, d = f(k), s.value?.setPointerCapture(k.pointerId));
    }
    function m(k) {
      if (!i.value || a.disabled)
        return;
      const A = u(), B = f(k);
      !A || !B || !d || (A.strokeStyle = "#111827", A.lineWidth = 2.4, A.lineCap = "round", A.lineJoin = "round", A.beginPath(), A.moveTo(d.x, d.y), A.lineTo(B.x, B.y), A.stroke(), d = B);
    }
    function h() {
      i.value = !1, d = null;
    }
    function M() {
      const k = s.value, A = u();
      !k || !A || (A.clearRect(0, 0, k.width, k.height), r("clear"));
    }
    function $() {
      const k = s.value;
      k && r("save", k.toDataURL("image/png"));
    }
    function C() {
      const k = s.value, A = u();
      !k || !A || (A.fillStyle = "#ffffff", A.fillRect(0, 0, k.width, k.height));
    }
    return be(C), ke(() => {
      i.value = !1;
    }), (k, A) => (t(), n("div", Ok, [
      l("p", jk, c(e.label), 1),
      l("canvas", {
        ref_key: "canvas",
        ref: s,
        width: e.width,
        height: e.height,
        class: z(["bg-background w-full max-w-full cursor-crosshair touch-none rounded-md border", e.disabled ? "pointer-events-none opacity-50" : ""]),
        "aria-label": e.label,
        onPointerdown: ge(v, ["prevent"]),
        onPointermove: ge(m, ["prevent"]),
        onPointerup: ge(h, ["prevent"]),
        onPointerleave: ge(h, ["prevent"])
      }, null, 42, Vk),
      l("div", Dk, [
        I(ce, {
          variant: "outline",
          size: "sm",
          disabled: e.disabled,
          onClick: M
        }, {
          default: O(() => [...A[0] || (A[0] = [
            U(" Clear ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        I(ce, {
          size: "sm",
          disabled: e.disabled,
          onClick: $
        }, {
          default: O(() => [...A[1] || (A[1] = [
            U("Save signature", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}), Ik = { class: "grid gap-8 lg:grid-cols-2" }, Ek = { class: "flex flex-col gap-3" }, Fk = { class: "text-muted-foreground text-xs font-normal" }, Nk = {
  key: 0,
  class: "flex flex-col gap-3"
}, Rk = { class: "flex flex-wrap gap-3" }, Uk = ["onClick"], Hk = ["src", "alt"], Kk = {
  key: 1,
  class: "flex flex-col gap-3"
}, qk = { class: "flex flex-wrap gap-3" }, Gk = ["onClick"], Wk = ["src", "alt"], Zk = {
  key: 2,
  class: "flex flex-col gap-4"
}, Jk = { class: "flex flex-wrap items-center gap-2" }, Yk = { class: "mx-auto w-full max-w-3xl overflow-hidden rounded-lg border shadow-sm" }, Qk = { class: "flex items-end justify-between gap-6 bg-white px-8 pb-8 text-black" }, Xk = { class: "flex flex-col gap-2" }, e$ = ["src"], t$ = {
  key: 1,
  class: "text-sm text-neutral-400"
}, n$ = ["src"], mS = /* @__PURE__ */ L({
  __name: "SignatureStudio",
  props: {
    title: { default: "Signatures" },
    description: { default: null },
    documents: { default: () => [] },
    storageKey: { default: null },
    embedded: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = K([]), r = K([]), s = K(null), i = K(null), d = K(null), u = K(o.documents[0]?.key ?? "");
    function f(k) {
      try {
        const A = localStorage.getItem(k), B = A ? JSON.parse(A) : [];
        return Array.isArray(B) ? B : [];
      } catch {
        return [];
      }
    }
    be(() => {
      !o.storageKey || typeof localStorage > "u" || (a.value = f(`${o.storageKey}.signatures`), r.value = f(`${o.storageKey}.stamps`), s.value = a.value[0]?.id ?? null, i.value = r.value[0]?.id ?? null);
    }), pe(
      a,
      (k) => {
        !o.storageKey || typeof localStorage > "u" || localStorage.setItem(`${o.storageKey}.signatures`, JSON.stringify(k));
      },
      { deep: !0 }
    ), pe(
      r,
      (k) => {
        !o.storageKey || typeof localStorage > "u" || localStorage.setItem(`${o.storageKey}.stamps`, JSON.stringify(k));
      },
      { deep: !0 }
    );
    function v(k) {
      const A = {
        id: `sig-${Date.now()}`,
        name: `Signature ${a.value.length + 1}`,
        dataUrl: k
      };
      a.value = [A, ...a.value].slice(0, 8), s.value = A.id;
    }
    async function m(k, A) {
      await ym(k), A(40);
      const B = await new Promise((w, p) => {
        const g = new FileReader();
        g.onload = () => w(String(g.result)), g.onerror = () => p(new Error("Could not read the file")), g.readAsDataURL(k);
      });
      return A(100), { value: B, name: k.name, size: k.size, url: B };
    }
    function h() {
      const k = d.value?.url ?? d.value?.value;
      if (!k)
        return;
      const A = {
        id: `stamp-${Date.now()}`,
        name: d.value?.name ?? "Stamp",
        dataUrl: k
      };
      r.value = [A, ...r.value].slice(0, 8), i.value = A.id;
    }
    const M = y(
      () => a.value.find((k) => k.id === s.value)?.dataUrl ?? null
    ), $ = y(
      () => r.value.find((k) => k.id === i.value)?.dataUrl ?? null
    ), C = y(() => {
      const k = o.documents.find((B) => B.key === u.value)?.document ?? o.documents[0]?.document ?? {}, A = {
        ...k?.branding ?? {},
        logoUrl: d.value?.url ?? null
      };
      return {
        ...k,
        branding: A
      };
    });
    return (k, A) => (t(), n("div", {
      class: z(["flex w-full flex-col gap-10", e.embedded ? "" : x(lt)])
    }, [
      I(Ee, {
        title: e.title,
        description: e.description ?? void 0
      }, null, 8, ["title", "description"]),
      l("section", Ik, [
        I(Tk, {
          label: "Draw a signature",
          onSave: v
        }),
        l("div", Ek, [
          A[2] || (A[2] = l("p", { class: "text-sm font-medium" }, "Company logo / stamp", -1)),
          l("p", Fk, c(x(la)), 1),
          I(Kn, {
            modelValue: d.value,
            "onUpdate:modelValue": A[0] || (A[0] = (B) => d.value = B),
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
            default: O(() => [...A[1] || (A[1] = [
              U(" Save as stamp ", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ]),
      a.value.length ? (t(), n("section", Nk, [
        I(Ee, {
          variant: "small",
          title: "Saved signatures"
        }),
        l("div", Rk, [
          (t(!0), n(_, null, j(a.value, (B) => (t(), n("button", {
            key: B.id,
            type: "button",
            class: z(["rounded-md border p-2", B.id === s.value ? "ring-ring ring-2" : ""]),
            onClick: (w) => s.value = B.id
          }, [
            l("img", {
              src: B.dataUrl,
              alt: B.name,
              class: "h-12 w-40 bg-white object-contain"
            }, null, 8, Hk)
          ], 10, Uk))), 128))
        ])
      ])) : b("", !0),
      r.value.length ? (t(), n("section", Kk, [
        I(Ee, {
          variant: "small",
          title: "Saved stamps"
        }),
        l("div", qk, [
          (t(!0), n(_, null, j(r.value, (B) => (t(), n("button", {
            key: B.id,
            type: "button",
            class: z(["rounded-md border p-2", B.id === i.value ? "ring-ring ring-2" : ""]),
            onClick: (w) => i.value = B.id
          }, [
            l("img", {
              src: B.dataUrl,
              alt: B.name,
              class: "size-16 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-[length:12px_12px] object-contain"
            }, null, 8, Wk)
          ], 10, Gk))), 128))
        ])
      ])) : b("", !0),
      e.documents.length ? (t(), n("section", Zk, [
        l("div", Jk, [
          (t(!0), n(_, null, j(e.documents, (B) => (t(), T(ce, {
            key: B.key,
            size: "sm",
            variant: u.value === B.key ? "default" : "outline",
            onClick: (w) => u.value = B.key
          }, {
            default: O(() => [
              U(c(B.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "onClick"]))), 128))
        ]),
        l("div", Yk, [
          I(m1, {
            document: C.value
          }, null, 8, ["document"]),
          l("div", Qk, [
            l("div", Xk, [
              A[3] || (A[3] = l("p", { class: "text-xs tracking-wider text-neutral-500 uppercase" }, "Signed", -1)),
              M.value ? (t(), n("img", {
                key: 0,
                src: M.value,
                alt: "Signature",
                class: "h-16 w-48 object-contain"
              }, null, 8, e$)) : (t(), n("p", t$, "Draw and save a signature"))
            ]),
            $.value ? (t(), n("img", {
              key: 0,
              src: $.value,
              alt: "Stamp",
              class: "h-20 w-20 object-contain"
            }, null, 8, n$)) : b("", !0)
          ])
        ])
      ])) : b("", !0)
    ], 2));
  }
}), pS = "panel.dashboard.hiddenWidgets", a$ = /* @__PURE__ */ Symbol("dashboardHide"), l$ = {
  key: 0,
  class: "w-full",
  "data-slot": "dashboard-shortcuts"
}, vS = /* @__PURE__ */ L({
  __name: "DashboardShortcuts",
  props: {
    catalog: {},
    defaults: { default: () => [] },
    storageKey: { default: "panel.dashboard.shortcuts" }
  },
  setup(e) {
    const o = e, a = wt(a$, null), r = K(
      o.catalog.filter((d) => o.defaults.includes(d.id))
    ), s = K(!1);
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
            (f) => typeof f?.id == "string" && typeof f.label == "string" && typeof f.href == "string"
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
    return (d, u) => i.value ? b("", !0) : (t(), n("div", l$, [
      I(ny, {
        items: r.value,
        catalog: e.catalog,
        hideable: "",
        "onUpdate:items": u[0] || (u[0] = (f) => r.value = f),
        onHide: u[1] || (u[1] = (f) => x(a)?.hide("shortcuts", "Shortcuts"))
      }, null, 8, ["items", "catalog"])
    ]));
  }
}), o$ = ["aria-busy"], s$ = ["data-slot"], r$ = ["aria-pressed", "aria-label", "title"], i$ = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, d$ = { class: "text-muted-foreground text-[11px] font-semibold tracking-wider uppercase" }, u$ = { class: "flex h-8 items-center" }, c$ = ["aria-label", "title", "onClick"], f$ = ["aria-label", "title", "onClick"], m$ = {
  key: 3,
  class: "truncate text-2xl font-semibold tabular-nums"
}, p$ = {
  key: 1,
  class: "text-muted-foreground truncate text-xs"
}, gS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = K(a.maskable ? !a.hidden : !0), i = K(/* @__PURE__ */ new Set());
    function d(w) {
      return a.maskable && (w.sensitive ?? !0);
    }
    function u(w) {
      return d(w) && !s.value && !i.value.has(w.key);
    }
    const f = y(() => a.segments.some(u)), v = y(() => a.segments.some(d)), m = {
      2: "grid-cols-2",
      3: "grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    }, h = y(() => m[a.columns] ?? m[4]), M = y(() => {
      const w = a.columns ?? 4, p = Math.floor(a.segments.length / w) * w;
      return a.segments.slice(0, p);
    }), $ = y(() => {
      const w = a.columns ?? 4, p = Math.floor(a.segments.length / w) * w;
      return a.segments.slice(p);
    }), C = y(() => {
      const w = [];
      return M.value.length > 0 && w.push({ key: "packed", joined: !0, segments: M.value }), $.value.length > 0 && w.push({ key: "leftover", joined: !1, segments: $.value }), w;
    });
    function k() {
      const w = f.value === !1;
      s.value = !w, i.value = /* @__PURE__ */ new Set(), r("toggle", w);
    }
    function A(w) {
      if (!d(w))
        return;
      const p = new Set(i.value);
      if (u(w))
        p.add(w.key);
      else if (p.delete(w.key), s.value) {
        s.value = !1;
        for (const g of a.segments)
          g.key !== w.key && d(g) && p.add(g.key);
      }
      i.value = p, r("toggle", f.value);
    }
    function B(w) {
      return typeof w == "number" ? new Intl.NumberFormat().format(w) : w;
    }
    return (w, p) => (t(), n("div", {
      class: "flex flex-col gap-3",
      "data-slot": "stat-strip",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      (t(!0), n(_, null, j(C.value, (g) => (t(), n("div", {
        key: g.key,
        class: z(["relative shrink-0", g.joined ? "bg-border overflow-hidden rounded-xl border shadow-sm" : ""]),
        "data-slot": g.joined ? "stat-packed" : "stat-leftover"
      }, [
        e.maskable && v.value && g.key === C.value[0]?.key ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 rounded p-1 transition-colors",
          "aria-pressed": f.value,
          "aria-label": f.value ? "Show all values" : "Hide all values",
          title: f.value ? "Show all values" : "Hide all values",
          onClick: k
        }, [
          (t(), n("svg", i$, [
            f.value ? (t(), n(_, { key: 0 }, [
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
        ], 8, r$)) : b("", !0),
        l("div", {
          class: z(["grid", [g.joined ? "gap-px" : "gap-3", h.value]])
        }, [
          (t(!0), n(_, null, j(g.segments, (S) => (t(), n("div", {
            key: S.key,
            class: z(["bg-card flex min-w-0 flex-col gap-2 p-4 sm:p-5", g.joined ? "" : "overflow-hidden rounded-xl border"])
          }, [
            l("p", d$, c(S.label), 1),
            l("div", u$, [
              e.loading ? (t(), T(Pe, {
                key: 0,
                variant: "number"
              })) : u(S) ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "hover:bg-muted/60 -mx-1 flex items-center gap-1.5 rounded px-1 py-1 transition-colors",
                "aria-label": `${S.label} hidden. Show it.`,
                title: `Show ${S.label}`,
                onClick: (F) => A(S)
              }, [
                (t(), n(_, null, j(5, (F) => l("span", {
                  key: F,
                  class: "bg-muted-foreground/70 size-1.5 rounded-full"
                })), 64))
              ], 8, c$)) : d(S) ? (t(), n("button", {
                key: 2,
                type: "button",
                class: "hover:bg-muted/60 -mx-1 truncate rounded px-1 text-2xl font-semibold tabular-nums transition-colors",
                "aria-label": `${S.label}, ${B(S.value)}. Hide it.`,
                title: `Hide ${S.label}`,
                onClick: (F) => A(S)
              }, c(B(S.value)), 9, f$)) : (t(), n("span", m$, c(B(S.value)), 1)),
              S.trend && !e.loading && !u(S) ? (t(), T(da, {
                key: 4,
                direction: S.trend.direction,
                percentage: S.trend.percentage,
                inverted: S.inverted,
                class: "ml-2 shrink-0"
              }, null, 8, ["direction", "percentage", "inverted"])) : b("", !0)
            ]),
            S.sparkline?.length && !e.loading && !u(S) ? (t(), T(jt, {
              key: 0,
              data: S.sparkline,
              height: 24
            }, null, 8, ["data"])) : b("", !0),
            S.caption || S.comparison && S.trend ? (t(), n("p", p$, c(S.caption ?? S.comparison), 1)) : b("", !0)
          ], 2))), 128))
        ], 2)
      ], 10, s$))), 128))
    ], 8, o$));
  }
}), v$ = ["aria-label"], g$ = { class: "flex items-center justify-between gap-3" }, h$ = ["aria-valuenow", "aria-label"], b$ = { class: "flex items-center gap-3" }, y$ = { class: "min-w-0 flex-1 text-sm" }, x$ = { class: "font-medium" }, k$ = {
  key: 0,
  class: "text-muted-foreground mt-0.5 block text-xs sm:mt-0 sm:inline sm:before:content-[':_']"
}, $$ = {
  key: 1,
  class: "flex flex-col gap-3 rounded-lg border bg-card p-4"
}, w$ = { class: "flex items-center justify-between gap-2" }, C$ = { class: "text-sm font-semibold" }, S$ = { class: "flex items-center gap-3" }, M$ = ["href"], B$ = {
  key: 0,
  class: "flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3"
}, A$ = { class: "flex min-w-0 flex-col gap-0.5" }, z$ = { class: "text-sm font-medium" }, _$ = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, P$ = {
  key: 1,
  class: "flex flex-col gap-2"
}, L$ = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-3.5",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, O$ = { class: "flex min-w-0 flex-1 flex-col gap-0.5" }, j$ = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, hS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = y(() => a.items.find(($) => !$.done) ?? null), i = y(() => a.items.filter(($) => $.key !== s.value?.key)), d = y(() => a.items.length), u = y(() => a.items.filter(($) => $.done).length), f = y(
      () => d.value > 0 ? Math.round(u.value / d.value * 100) : 0
    ), v = y(() => {
      const $ = a.linkComponent;
      return typeof $ == "string" ? $ : xa($);
    }), m = Ye({
      variant: "default",
      size: "sm",
      class: "no-underline mt-2 self-start"
    }), h = Ye({
      variant: "default",
      size: "sm",
      class: "no-underline shrink-0"
    }), M = Ye({
      variant: "outline",
      size: "sm",
      class: "no-underline shrink-0"
    });
    return ($, C) => e.items.length && e.variant === "onboarding" ? (t(), n("section", {
      key: 0,
      class: "flex flex-col gap-2.5 rounded-md border bg-card p-3",
      "aria-label": e.heading
    }, [
      l("div", g$, [
        l("div", {
          class: "flex flex-1 items-center gap-1",
          role: "progressbar",
          "aria-valuenow": f.value,
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          "aria-label": `${e.heading}, ${f.value} percent complete`
        }, [
          (t(!0), n(_, null, j(e.items, (k, A) => (t(), n("span", {
            key: k.key,
            class: z(["h-1.5 flex-1 rounded-sm transition-colors duration-300", A < u.value ? "bg-amber-500" : "bg-muted"])
          }, null, 2))), 128))
        ], 8, h$),
        e.skipLabel ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline",
          onClick: C[0] || (C[0] = (k) => r("skip"))
        }, c(e.skipLabel), 1)) : b("", !0)
      ]),
      l("div", b$, [
        l("p", y$, [
          l("span", x$, c(s.value ? s.value.title : e.heading), 1),
          s.value?.detail ? (t(), n("span", k$, c(s.value.detail), 1)) : b("", !0)
        ]),
        s.value?.href ? (t(), T(Ce(v.value), {
          key: 0,
          href: s.value.href,
          class: z(x(h))
        }, {
          default: O(() => [
            U(c(s.value.actionLabel || "Open"), 1)
          ]),
          _: 1
        }, 8, ["href", "class"])) : b("", !0)
      ])
    ], 8, v$)) : e.items.length ? (t(), n("section", $$, [
      l("div", w$, [
        l("h2", C$, c(e.heading), 1),
        l("div", S$, [
          e.skipLabel ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-xs text-muted-foreground font-normal hover:text-foreground hover:underline",
            onClick: C[1] || (C[1] = (k) => r("skip"))
          }, c(e.skipLabel), 1)) : b("", !0),
          e.reportHref ? (t(), n("a", {
            key: 1,
            href: e.reportHref,
            class: "text-xs text-muted-foreground font-normal hover:text-foreground hover:underline"
          }, " Full report ", 8, M$)) : b("", !0)
        ])
      ]),
      s.value ? (t(), n("div", B$, [
        C[2] || (C[2] = l("span", {
          class: "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-500",
          "aria-hidden": "true"
        }, null, -1)),
        l("div", A$, [
          l("p", z$, c(s.value.title), 1),
          s.value.detail ? (t(), n("p", _$, c(s.value.detail), 1)) : b("", !0),
          s.value.href ? (t(), T(Ce(v.value), {
            key: 1,
            href: s.value.href,
            class: z(x(m))
          }, {
            default: O(() => [
              U(c(s.value.actionLabel || "Open"), 1)
            ]),
            _: 1
          }, 8, ["href", "class"])) : b("", !0)
        ])
      ])) : b("", !0),
      i.value.length ? (t(), n("ul", P$, [
        (t(!0), n(_, null, j(i.value, (k) => (t(), n("li", {
          key: k.key,
          class: "flex items-start gap-3"
        }, [
          l("span", {
            class: z([
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
              k.done ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "border-2 border-amber-500"
            ]),
            "aria-hidden": "true"
          }, [
            k.done ? (t(), n("svg", L$, [...C[3] || (C[3] = [
              l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
            ])])) : b("", !0)
          ], 2),
          l("div", O$, [
            l("p", {
              class: z(["text-sm", k.done ? "text-muted-foreground line-through" : "font-medium"])
            }, c(k.title), 3),
            !k.done && k.detail ? (t(), n("p", j$, c(k.detail), 1)) : b("", !0)
          ]),
          !k.done && k.href ? (t(), T(Ce(v.value), {
            key: 0,
            href: k.href,
            class: z(x(M))
          }, {
            default: O(() => [
              U(c(k.actionLabel || "Open"), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"])) : b("", !0)
        ]))), 128))
      ])) : b("", !0)
    ])) : b("", !0);
  }
}), V$ = {
  "data-slot": "selection-bar",
  class: "flex min-h-9 flex-wrap items-center gap-x-4 gap-y-2 text-sm",
  role: "status",
  "aria-live": "polite",
  "aria-label": "Selection actions"
}, D$ = { class: "text-foreground font-medium tabular-nums" }, T$ = { class: "ml-auto hidden items-center gap-2 md:flex" }, I$ = { class: "ml-auto md:hidden" }, E$ = { class: "border-b px-4 py-4" }, F$ = { class: "flex items-start gap-3" }, N$ = { class: "text-muted-foreground text-sm font-normal" }, R$ = { class: "flex flex-col gap-2 overflow-y-auto p-4" }, bS = /* @__PURE__ */ L({
  __name: "SelectionBar",
  props: {
    count: {},
    allMatching: { type: Boolean },
    total: {}
  },
  emits: ["select-all-matching", "clear"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(!1), i = (u) => new Intl.NumberFormat().format(u), d = y(() => a.allMatching ? a.total !== void 0 ? `All ${i(a.total)} matching records` : "All matching records" : `${i(a.count)} selected`);
    return (u, f) => (t(), n("div", V$, [
      l("span", D$, c(d.value), 1),
      !e.allMatching && e.total !== void 0 && e.total > e.count ? (t(), n("button", {
        key: 0,
        type: "button",
        class: "text-primary font-medium hover:underline",
        onClick: f[0] || (f[0] = (v) => r("select-all-matching"))
      }, " Select all " + c(i(e.total)), 1)) : b("", !0),
      l("button", {
        type: "button",
        class: "text-destructive font-medium hover:underline",
        onClick: f[1] || (f[1] = (v) => r("clear"))
      }, " Deselect all "),
      l("div", T$, [
        q(u.$slots, "actions")
      ]),
      l("div", I$, [
        l("button", {
          type: "button",
          dusk: "mobile-bulk-actions",
          class: "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium shadow-sm transition-colors",
          onClick: f[2] || (f[2] = (v) => s.value = !0)
        }, [...f[4] || (f[4] = [
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
          "onUpdate:open": f[3] || (f[3] = (v) => s.value = v)
        }, {
          default: O(() => [
            I(rn, {
              side: "bottom",
              class: "max-h-[70vh] gap-0 overflow-hidden p-0"
            }, {
              default: O(() => [
                l("div", E$, [
                  l("div", F$, [
                    f[6] || (f[6] = l("span", {
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
                      f[5] || (f[5] = l("p", { class: "text-foreground text-base font-semibold" }, "Bulk actions", -1)),
                      l("p", N$, c(d.value), 1)
                    ])
                  ])
                ]),
                l("div", R$, [
                  q(u.$slots, "actions")
                ])
              ]),
              _: 3
            })
          ]),
          _: 3
        }, 8, ["open"])
      ])
    ]));
  }
}), U$ = { class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, H$ = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, K$ = {
  key: 0,
  class: "text-muted-foreground flex items-center gap-2 text-xs"
}, q$ = ["value"], G$ = ["value"], W$ = {
  class: "flex items-center gap-1",
  "aria-label": "Pagination"
}, Z$ = ["disabled"], J$ = ["disabled"], Y$ = {
  class: "bg-primary/10 text-primary inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-sm font-medium tabular-nums",
  "aria-current": "page"
}, Q$ = {
  key: 0,
  class: "text-muted-foreground px-1 text-xs tabular-nums"
}, X$ = ["disabled"], yS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = (f) => new Intl.NumberFormat().format(f), i = y(() => a.rowsOnPage === 0 ? 0 : (a.page - 1) * a.perPage + 1), d = y(() => (a.page - 1) * a.perPage + a.rowsOnPage), u = y(
      () => a.total === void 0 ? null : Math.max(1, Math.ceil(a.total / a.perPage))
    );
    return (f, v) => (t(), n("div", U$, [
      l("p", H$, [
        U(" Showing " + c(s(i.value)) + "-" + c(s(d.value)) + " ", 1),
        e.total !== void 0 ? (t(), n(_, { key: 0 }, [
          U("of " + c(s(e.total)), 1)
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
          }, c(m), 9, G$))), 128))
        ], 40, q$)
      ])) : b("", !0),
      l("nav", W$, [
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
        ])], 8, Z$),
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
        ])], 8, J$),
        l("span", Y$, c(e.page), 1),
        u.value !== null ? (t(), n("span", Q$, " of " + c(s(u.value)), 1)) : b("", !0),
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
        ])], 8, X$)
      ])
    ]));
  }
}), ew = {
  class: "pk-tabs bg-muted/40 flex w-fit max-w-full shrink-0 items-center gap-0.5 overflow-x-auto rounded-lg p-1",
  role: "tablist",
  "aria-label": "Table views"
}, tw = ["aria-current", "aria-selected"], nw = ["title"], aw = ["aria-current", "aria-selected", "onClick"], lw = ["title"], ow = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("div", ew, [
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
        }, c(r(e.counts.all ?? 0)), 11, nw)) : (t(), T(Pe, {
          key: 1,
          variant: "badge",
          label: "Counting"
        }))
      ], 10, tw),
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
        U(c(d) + " ", 1),
        e.counts ? (t(), n("span", {
          key: 0,
          class: z([
            "rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums",
            e.active === d ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15"
          ]),
          title: new Intl.NumberFormat().format(e.counts[d] ?? 0)
        }, c(r(e.counts[d] ?? 0)), 11, lw)) : (t(), T(Pe, {
          key: 1,
          variant: "badge",
          label: "Counting"
        }))
      ], 10, aw))), 128))
    ]));
  }
}), xS = /* @__PURE__ */ at(ow, [["__scopeId", "data-v-8348f90f"]]), sw = { class: "group/saved relative shrink-0" }, rw = {
  class: "pk-focus-ring inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-md border px-2.5 text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden",
  "aria-label": "Saved table views"
}, iw = {
  key: 0,
  class: "max-w-28 truncate text-xs text-foreground"
}, dw = { class: "bg-popover text-popover-foreground absolute top-full left-0 z-30 mt-2 w-72 rounded-lg border p-2 shadow-xl" }, uw = {
  key: 0,
  class: "mt-1 max-h-56 overflow-y-auto"
}, cw = ["onClick"], fw = ["aria-label", "onClick"], mw = {
  key: 1,
  class: "px-2 py-3 text-xs text-muted-foreground"
}, kS = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("details", sw, [
      l("summary", rw, [
        i[0] || (i[0] = U(" Views ", -1)),
        e.active ? (t(), n("span", iw, c(e.active), 1)) : b("", !0),
        i[1] || (i[1] = l("span", { "aria-hidden": "true" }, "⌄", -1))
      ]),
      l("div", dw, [
        l("form", {
          class: "flex gap-2 border-b pb-2",
          onSubmit: ge(r, ["prevent"])
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
        e.views.length ? (t(), n("div", uw, [
          (t(!0), n(_, null, j(e.views, (d) => (t(), n("div", {
            key: d.name,
            class: "flex items-center gap-1 rounded-md px-1 hover:bg-muted"
          }, [
            l("button", {
              type: "button",
              class: z(["pk-focus-ring min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left text-sm", d.name === e.active ? "font-medium text-primary" : ""]),
              onClick: (u) => a("apply", d)
            }, c(d.name), 11, cw),
            l("button", {
              type: "button",
              class: "pk-focus-ring rounded px-2 py-1 text-xs text-muted-foreground hover:text-destructive",
              "aria-label": `Delete saved view ${d.name}`,
              onClick: (u) => a("remove", d.name)
            }, " × ", 8, fw)
          ]))), 128))
        ])) : (t(), n("p", mw, " Save filters, columns, and layout for quick reuse. "))
      ])
    ]));
  }
}), pw = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, vw = { class: "grid gap-2" }, gw = {
  key: 0,
  class: "text-destructive text-sm"
}, hw = { class: "flex gap-2" }, $S = /* @__PURE__ */ L({
  __name: "PkPasskeyRegister",
  emits: ["success"],
  setup(e, { emit: o }) {
    const a = o, s = K((() => {
      const M = navigator.userAgent, $ = [
        { pattern: /Edg|Edge/, name: "Edge" },
        { pattern: /OPR|Opera|OPiOS/, name: "Opera" },
        { pattern: /Firefox|FxiOS/, name: "Firefox" },
        { pattern: /Chrome|CriOS/, name: "Chrome" },
        { pattern: /Safari/, name: "Safari" }
      ].find(({ pattern: k }) => k.test(M))?.name, C = [
        { pattern: /iPhone/, name: "iPhone" },
        { pattern: /iPad|Macintosh(?=.*Mobile)/, name: "iPad" },
        { pattern: /Android/, name: "Android" },
        { pattern: /Mac/, name: "Mac" },
        { pattern: /Windows/, name: "Windows" }
      ].find(({ pattern: k }) => k.test(M))?.name;
      return [$, C].filter(Boolean).join(" on ") || "";
    })()), i = K(!1), d = ka(null), u = y(() => d.value?.isLoading.value ?? !1), f = y(() => d.value?.error.value ?? null), v = y(() => d.value?.isSupported.value ?? !1);
    be(async () => {
      try {
        const { usePasskeyRegister: M } = await import("@laravel/passkeys/vue");
        d.value = M({
          onSuccess: () => {
            s.value = "", i.value = !1, a("success");
          }
        });
      } catch {
        d.value = null;
      }
    });
    const m = async (M) => {
      M.preventDefault(), !(!s.value.trim() || d.value === null) && await d.value.register(s.value);
    }, h = () => {
      i.value = !1, s.value = "";
    };
    return (M, $) => v.value ? i.value ? (t(), n("form", {
      key: 2,
      class: "border-border bg-muted/50 space-y-4 rounded-lg border p-4",
      onSubmit: m
    }, [
      l("div", vw, [
        $[3] || ($[3] = l("label", {
          for: "pk-passkey-name",
          class: "text-sm font-medium"
        }, " Passkey name ", -1)),
        he(l("input", {
          id: "pk-passkey-name",
          "onUpdate:modelValue": $[1] || ($[1] = (C) => s.value = C),
          type: "text",
          autofocus: "",
          placeholder: "e.g. MacBook Pro, iPhone",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        }, null, 512), [
          [ze, s.value]
        ]),
        $[4] || ($[4] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " A name helps you identify this passkey later. ", -1))
      ]),
      f.value ? (t(), n("p", gw, c(f.value), 1)) : b("", !0),
      l("div", hw, [
        I(ce, {
          type: "submit",
          disabled: u.value || !s.value.trim()
        }, {
          default: O(() => [
            U(c(u.value ? "Registering…" : "Register passkey"), 1)
          ]),
          _: 1
        }, 8, ["disabled"]),
        I(ce, {
          type: "button",
          variant: "ghost",
          onClick: h
        }, {
          default: O(() => [...$[5] || ($[5] = [
            U(" Cancel ", -1)
          ])]),
          _: 1
        })
      ])
    ], 32)) : (t(), T(ce, {
      key: 1,
      variant: "outline",
      onClick: $[0] || ($[0] = (C) => i.value = !0)
    }, {
      default: O(() => [...$[2] || ($[2] = [
        U(" Add passkey ", -1)
      ])]),
      _: 1
    })) : (t(), n("p", pw, " Passkeys are not supported in this browser. "));
  }
}), bw = { class: "pk-form-stack" }, yw = {
  key: 0,
  class: "border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm",
  role: "alert"
}, wS = /* @__PURE__ */ L({
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
      run(f, v) {
        return a.createOption ? a.createOption(f, v) : Promise.reject(new Error("Create is not available on this field."));
      }
    });
    const r = o, s = y(() => a.nodes.length > 0), i = y(() => a.columns >= 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"), d = y(() => a.errors._conflict);
    function u(f) {
      if (a.upload)
        return (v, m) => a.upload(f, v, m);
    }
    return (f, v) => (t(), n("div", bw, [
      d.value ? (t(), n("p", yw, c(d.value), 1)) : b("", !0),
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
        onChange: v[0] || (v[0] = (M, $) => r("change", M, $)),
        onAffixAction: v[1] || (v[1] = (M, $) => r("affix-action", M, $))
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
}), xw = { class: "min-w-0 flex-1 truncate text-sm font-medium" }, kw = ["disabled"], $w = ["disabled"], ww = ["disabled"], Cw = ["disabled"], CS = /* @__PURE__ */ L({
  __name: "UnsavedBar",
  props: {
    show: { type: Boolean },
    processing: { type: Boolean, default: !1 },
    message: { default: "Unsaved changes" },
    saveLabel: { default: "Save" },
    cancelLabel: { default: "Cancel" },
    discardLabel: {},
    extraLabel: {},
    destructive: { type: Boolean, default: !1 }
  },
  emits: ["save", "cancel", "discard", "extra"],
  setup(e) {
    const o = K(!1);
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
    function f(v, m) {
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
        onLeave: f
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
                x(bo),
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
              l("span", xw, c(e.message), 1),
              e.discardLabel ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "hover:bg-muted inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: m[0] || (m[0] = (h) => v.$emit("discard"))
              }, c(e.discardLabel), 9, kw)) : b("", !0),
              l("button", {
                type: "button",
                class: "bg-muted hover:bg-muted/70 inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: m[1] || (m[1] = (h) => v.$emit("cancel"))
              }, c(e.cancelLabel), 9, $w),
              e.extraLabel ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "hover:bg-muted inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: m[2] || (m[2] = (h) => v.$emit("extra"))
              }, c(e.extraLabel), 9, ww)) : b("", !0),
              l("button", {
                type: "button",
                class: z([
                  "inline-flex min-h-9 items-center rounded-lg px-4 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50",
                  e.destructive ? "bg-destructive text-white" : "bg-primary text-primary-foreground"
                ]),
                disabled: e.processing,
                onClick: m[3] || (m[3] = (h) => v.$emit("save"))
              }, c(e.processing ? "Saving…" : e.saveLabel), 11, Cw)
            ], 2)
          ], 2)) : b("", !0)
        ]),
        _: 1
      })
    ], 8, ["to", "disabled"]));
  }
});
function SS(e, o = {}) {
  const { warnOnUnload: a = !0 } = o, r = K(Ft(e.value)), s = y(() => Ft(e.value) !== r.value);
  function i() {
    r.value = Ft(e.value);
  }
  function d() {
    e.value = JSON.parse(r.value);
  }
  function u(f) {
    s.value && (f.preventDefault(), f.returnValue = "");
  }
  return be(() => {
    a && window.addEventListener("beforeunload", u);
  }), ke(() => {
    window.removeEventListener("beforeunload", u);
  }), { dirty: s, commit: i, discard: d, baseline: r };
}
function Ft(e) {
  return JSON.stringify(e, (o, a) => a === void 0 ? null : a === null || typeof a != "object" || Array.isArray(a) ? a : Object.fromEntries(
    Object.entries(a).sort(([r], [s]) => r.localeCompare(s))
  ));
}
const yt = /* @__PURE__ */ new Map();
function MS(e, o) {
  yt.set(e, o);
}
function Sw(e) {
  return yt.get(e);
}
function BS(e) {
  return yt.has(e);
}
function Mw() {
  return [...yt.keys()].sort();
}
function AS() {
  yt.clear();
}
const Bw = {
  key: 0,
  class: "flex flex-col gap-1"
}, Aw = { class: "text-muted-foreground text-[11px] font-medium tracking-wide uppercase" }, zw = { class: "text-foreground text-sm font-medium" }, _w = {
  key: 1,
  class: "text-muted-foreground font-normal"
}, Pw = {
  key: 5,
  class: "max-w-full font-normal"
}, Lw = {
  key: 0,
  class: "text-muted-foreground mb-1 font-mono text-[10px] uppercase"
}, Ow = { class: "bg-muted/50 overflow-x-auto rounded-md border p-3 font-mono text-xs font-normal" }, jw = {
  key: 6,
  class: "font-normal"
}, Vw = {
  key: 0,
  class: "divide-y rounded-md border"
}, Dw = { class: "text-muted-foreground truncate font-medium" }, Tw = { class: "text-foreground col-span-2 break-words" }, Iw = {
  key: 1,
  class: "text-muted-foreground font-normal"
}, Ew = {
  key: 7,
  class: "flex flex-col gap-3 font-normal"
}, Fw = {
  key: 0,
  class: "text-muted-foreground font-normal"
}, Nw = {
  key: 10,
  class: "text-destructive text-xs font-normal",
  "data-testid": "missing-entry-view"
}, Rw = ["href"], Uw = { class: "flex min-w-0 items-start gap-2.5" }, Hw = {
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
}, qw = ["d"], Gw = { class: "min-w-0" }, Ww = { class: "flex flex-wrap items-center gap-2" }, Zw = { class: "text-sm font-semibold" }, Jw = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, Yw = ["aria-selected", "onClick"], Qw = /* @__PURE__ */ L({
  __name: "InfoNode",
  props: {
    node: {},
    record: {},
    depth: { default: 0 }
  },
  emits: ["action"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(!a.node.collapsed), i = K(0), d = y(() => a.depth === 0), u = y(() => {
      const B = a.node.columns, w = typeof B == "number" ? B : B?.default ?? B?.sm ?? B?.md ?? (a.node.component === "section" ? 2 : 1);
      return w >= 3 ? "sm:grid-cols-3" : w === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
    });
    function f(B) {
      const w = B.columns, p = typeof w == "number" ? { default: w } : w, g = {};
      for (const S of ["default", "sm", "md", "lg", "xl", "2xl"]) {
        const F = p?.[S];
        typeof F == "number" && F > 0 && (g[`--pk-grid-cols-${S}`] = String(Math.min(12, Math.max(1, F))));
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
      const B = m.value;
      return B == null || B === "";
    }), M = y(() => {
      if (h.value)
        return "None";
      const B = Number(m.value);
      if (Number.isNaN(B))
        return "None";
      const w = a.node.divideBy ?? 100, p = B / w, g = a.node.currency ?? "USD";
      try {
        return new Intl.NumberFormat(void 0, { style: "currency", currency: g }).format(p);
      } catch {
        return `${g} ${p.toFixed(2)}`;
      }
    }), $ = y(() => {
      if (h.value)
        return "None";
      const B = m.value;
      if (a.node.type === "date" || a.node.type === "datetime")
        return new Date(String(B)).toLocaleDateString(void 0, v[a.node.type]);
      if (a.node.type === "money")
        return M.value;
      let w = String(B);
      return a.node.transform === "upper" && (w = w.toUpperCase()), a.node.transform === "lower" && (w = w.toLowerCase()), [a.node.prefix, w, a.node.suffix].filter(Boolean).join(" ");
    }), C = y(() => {
      const B = typeof m.value == "boolean" ? m.value ? "1" : "" : String(m.value), w = a.node.colors?.[B] ?? a.node.defaultColor ?? "neutral";
      return dn[w] ?? "outline";
    }), k = y(() => {
      const B = typeof a.node.view == "string" ? a.node.view : "";
      return B ? Sw(B) : void 0;
    }), A = y(() => {
      const B = typeof a.node.view == "string" ? a.node.view : "";
      if (!B)
        return "ViewEntry has no view name.";
      const w = Mw(), p = w.length > 0 ? w.join(", ") : "(none)";
      return `No entry view for [${B}]; registered: ${p}`;
    });
    return (B, w) => {
      const p = Qt("InfoNode", !0);
      return e.node.component === "entry" ? (t(), n("div", Bw, [
        l("dt", Aw, c(e.node.label), 1),
        l("dd", zw, [
          e.node.type === "badge" && x(Uu)(m.value) ? (t(), T(Ie, {
            key: 0,
            variant: C.value,
            class: "capitalize"
          }, {
            default: O(() => [
              U(c(m.value), 1)
            ]),
            _: 1
          }, 8, ["variant"])) : e.node.type === "badge" ? (t(), n("span", _w, "None")) : e.node.type === "icon" ? (t(), T(bu, {
            key: 2,
            value: m.value,
            icons: e.node.icons,
            colors: e.node.colors,
            labels: e.node.labels,
            "default-icon": e.node.defaultIcon
          }, null, 8, ["value", "icons", "colors", "labels", "default-icon"])) : e.node.type === "image" ? (t(), T(wu, {
            key: 3,
            src: m.value,
            "fallback-text": e.record[e.node.fallbackFrom ?? "name"],
            rounded: e.node.rounded !== !1,
            size: e.node.size ?? "md",
            fallback: e.node.fallback ?? "initials"
          }, null, 8, ["src", "fallback-text", "rounded", "size", "fallback"])) : e.node.type === "color" || e.node.type === "colour" ? (t(), T(Au, {
            key: 4,
            value: typeof m.value == "string" ? m.value : null,
            "show-value": e.node.showValue !== !1
          }, null, 8, ["value", "show-value"])) : e.node.type === "code" ? (t(), n("div", Pw, [
            e.node.language ? (t(), n("p", Lw, c(e.node.language), 1)) : b("", !0),
            l("pre", Ow, [
              l("code", null, c(m.value ?? ""), 1)
            ])
          ])) : e.node.type === "keyvalue" ? (t(), n("div", jw, [
            m.value && typeof m.value == "object" && !Array.isArray(m.value) && Object.keys(m.value).length ? (t(), n("dl", Vw, [
              (t(!0), n(_, null, j(m.value, (g, S) => (t(), n("div", {
                key: S,
                class: "grid grid-cols-3 gap-2 px-3 py-2 text-sm"
              }, [
                l("dt", Dw, c(S), 1),
                l("dd", Tw, c(g), 1)
              ]))), 128))
            ])) : (t(), n("span", Iw, "None"))
          ])) : e.node.type === "repeatable" ? (t(), n("div", Ew, [
            (t(!0), n(_, null, j(Array.isArray(m.value) ? m.value : [], (g, S) => (t(), n("div", {
              key: S,
              class: "rounded-md border p-3"
            }, [
              (t(!0), n(_, null, j(e.node.entries ?? [], (F, D) => (t(), T(p, {
                key: D,
                node: F,
                record: g,
                depth: e.depth + 1,
                onAction: w[0] || (w[0] = (Y) => r("action", Y))
              }, null, 8, ["node", "record", "depth"]))), 128))
            ]))), 128)),
            !Array.isArray(m.value) || m.value.length === 0 ? (t(), n("span", Fw, "None")) : b("", !0)
          ])) : e.node.type === "money" ? (t(), n("span", {
            key: 8,
            class: z(h.value ? "text-muted-foreground font-normal" : "")
          }, c(M.value), 3)) : e.node.type === "view" && k.value ? (t(), T(Ce(k.value), {
            key: 9,
            node: e.node,
            record: e.record,
            value: m.value
          }, null, 8, ["node", "record", "value"])) : e.node.type === "view" ? (t(), n("p", Nw, c(A.value), 1)) : e.node.url && !h.value ? (t(), n("a", {
            key: 11,
            href: e.node.url,
            class: "text-foreground font-medium underline-offset-2 hover:underline"
          }, c($.value), 9, Rw)) : (t(), n("span", {
            key: 12,
            class: z([
              h.value || e.node.muted ? "text-muted-foreground font-normal" : "",
              e.node.mono ? "font-mono text-xs" : ""
            ])
          }, c($.value), 3)),
          e.node.action ? (t(), n("button", {
            key: 13,
            type: "button",
            class: "text-muted-foreground hover:text-foreground mt-0.5 text-xs font-normal underline-offset-2 hover:underline",
            onClick: w[1] || (w[1] = (g) => r("action", e.node.action))
          }, c(e.node.action.label), 1)) : b("", !0)
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
          onClick: w[2] || (w[2] = (g) => e.node.collapsible && (s.value = !s.value))
        }, [
          l("div", Uw, [
            e.node.icon ? (t(), n("div", Hw, [
              (t(), n("svg", Kw, [
                l("path", {
                  d: x(me)(e.node.icon)
                }, null, 8, qw)
              ]))
            ])) : b("", !0),
            l("div", Gw, [
              l("div", Ww, [
                l("h3", Zw, c(e.node.label), 1),
                e.node.status ? (t(), T($e, {
                  key: 0,
                  status: e.node.status,
                  class: "capitalize"
                }, null, 8, ["status"])) : b("", !0)
              ]),
              e.node.description ? (t(), n("p", Jw, c(e.node.description), 1)) : b("", !0)
            ])
          ])
        ], 2),
        s.value ? (t(), n("dl", {
          key: 0,
          class: z(["grid grid-cols-1 gap-x-6 gap-y-4", [u.value, d.value ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""]])
        }, [
          (t(!0), n(_, null, j(e.node.children ?? [], (g, S) => (t(), T(p, {
            key: S,
            node: g,
            record: e.record,
            depth: e.depth + 1,
            onAction: w[3] || (w[3] = (F) => r("action", F))
          }, null, 8, ["node", "record", "depth"]))), 128))
        ], 2)) : b("", !0)
      ], 2)) : e.node.component === "grid" ? (t(), n("dl", {
        key: 2,
        class: "pk-responsive-grid grid gap-x-6 gap-y-4",
        style: ie(f(e.node))
      }, [
        (t(!0), n(_, null, j(e.node.children ?? [], (g, S) => (t(), T(p, {
          key: S,
          node: g,
          record: e.record,
          depth: e.depth + 1,
          onAction: w[4] || (w[4] = (F) => r("action", F))
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
          (t(!0), n(_, null, j(e.node.children ?? [], (g, S) => (t(), n("button", {
            key: S,
            type: "button",
            role: "tab",
            class: z([
              "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors",
              i.value === S ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
            ]),
            "aria-selected": i.value === S,
            onClick: (F) => i.value = S
          }, [
            U(c(g.label) + " ", 1),
            g.badge !== null && g.badge !== void 0 ? (t(), T(Ie, {
              key: 0,
              variant: "secondary"
            }, {
              default: O(() => [
                U(c(g.badge), 1)
              ]),
              _: 2
            }, 1024)) : b("", !0)
          ], 10, Yw))), 128))
        ], 2),
        (t(!0), n(_, null, j(e.node.children ?? [], (g, S) => he((t(), n("div", {
          key: S,
          class: z(["flex flex-col gap-5", d.value ? "p-4 sm:p-5" : "pt-4"])
        }, [
          (t(!0), n(_, null, j(g.children ?? [], (F, D) => (t(), T(p, {
            key: D,
            node: F,
            record: e.record,
            depth: e.depth + 1,
            onAction: w[5] || (w[5] = (Y) => r("action", Y))
          }, null, 8, ["node", "record", "depth"]))), 128))
        ], 2)), [
          [qe, i.value === S]
        ])), 128))
      ], 2)) : b("", !0);
    };
  }
}), zS = /* @__PURE__ */ at(Qw, [["__scopeId", "data-v-d44efc4d"]]), Xw = { class: "text-muted-foreground text-sm font-normal" }, e4 = { class: "flex items-start gap-3" }, t4 = { class: "min-w-0 flex-1" }, n4 = { class: "flex flex-wrap items-center gap-2" }, a4 = { class: "truncate text-sm font-medium" }, l4 = { class: "text-muted-foreground mt-0.5 text-xs" }, o4 = { class: "text-muted-foreground text-xs font-normal" }, s4 = { class: "mt-auto flex items-center gap-2" }, r4 = /* @__PURE__ */ L({
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
      l("p", Xw, c(s.value) + " of " + c(e.gateways.length) + " connected, showcase only, no live processors. ", 1),
      l("div", {
        class: z(x(um))
      }, [
        (t(!0), n(_, null, j(e.gateways, (u) => (t(), n("article", {
          key: u.key,
          class: "bg-background flex flex-col gap-4 rounded-lg border p-4"
        }, [
          l("div", e4, [
            l("span", {
              class: "flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white",
              style: ie({ background: u.color }),
              "aria-hidden": "true"
            }, c(u.mark), 5),
            l("div", t4, [
              l("div", n4, [
                l("h3", a4, c(u.label), 1),
                I($e, {
                  status: u.connected ? "connected" : "disconnected"
                }, {
                  default: O(() => [
                    U(c(u.connected ? "Connected" : "Not connected"), 1)
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
                    U(c(u.mode), 1)
                  ]),
                  _: 2
                }, 1032, ["status"])) : b("", !0)
              ]),
              l("p", l4, c(u.caption), 1)
            ])
          ]),
          l("p", o4, c(u.methods.join(" · ")), 1),
          l("div", s4, [
            I(ce, {
              size: "sm",
              variant: "outline",
              onClick: (f) => r("configure", u.key)
            }, {
              default: O(() => [...d[3] || (d[3] = [
                U(" Configure ", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            I(ce, {
              size: "sm",
              variant: "ghost",
              onClick: (f) => r("toggle", u.key)
            }, {
              default: O(() => [
                U(c(u.connected ? "Disconnect" : "Connect"), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ])
        ]))), 128))
      ], 2)
    ], 2));
  }
}), i4 = { class: "flex flex-col gap-6" }, d4 = { class: "relative" }, u4 = {
  class: "text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, c4 = ["d"], f4 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, m4 = {
  key: 0,
  class: "flex flex-col gap-4"
}, p4 = { class: "flex flex-wrap items-center gap-2" }, v4 = { class: "text-muted-foreground text-sm font-normal" }, g4 = { class: "flex flex-col gap-1 text-sm" }, h4 = ["value"], b4 = {
  key: 0,
  class: "flex flex-col gap-2"
}, y4 = { class: "flex flex-wrap items-center gap-2" }, x4 = {
  key: 1,
  class: "flex items-center gap-2"
}, _S = /* @__PURE__ */ L({
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
    const o = vt(e, "gateways"), a = K(null), r = K(""), s = y(
      () => o.value.find(($) => $.key === a.value) ?? null
    ), i = y(() => {
      const $ = r.value.trim().toLowerCase();
      return $ === "" ? o.value : o.value.filter((C) => [C.key, C.label, C.caption, ...C.methods].join(" ").toLowerCase().includes($));
    });
    function d($) {
      return $.connected && $.enabled !== !1;
    }
    function u($, C) {
      o.value = o.value.map(
        (k) => k.key === $ ? { ...k, ...C } : k
      );
    }
    function f($) {
      a.value = $;
    }
    function v($) {
      const C = o.value.find((A) => A.key === $);
      if (!C)
        return;
      const k = !C.connected;
      u($, {
        connected: k,
        mode: k ? C.mode ?? "test" : null,
        enabled: k,
        isDefault: !1
      });
    }
    function m($, C) {
      const k = o.value.find((A) => A.key === $);
      k?.connected && u($, { enabled: C, isDefault: C ? k.isDefault : !1 });
    }
    function h($) {
      const C = o.value.find((k) => k.key === $);
      !C || !d(C) || (o.value = o.value.map((k) => ({
        ...k,
        isDefault: k.key === $
      })));
    }
    function M($) {
      const C = a.value;
      !C || !o.value.find((A) => A.key === C)?.connected || u(C, { mode: $ });
    }
    return ($, C) => (t(), n(_, null, [
      l("div", i4, [
        I(Ee, {
          variant: e.headingVariant,
          title: e.title,
          description: e.description ?? void 0
        }, null, 8, ["variant", "title", "description"]),
        l("div", d4, [
          (t(), n("svg", u4, [
            l("path", {
              d: x(me)("search")
            }, null, 8, c4)
          ])),
          I(we, {
            modelValue: r.value,
            "onUpdate:modelValue": C[0] || (C[0] = (k) => r.value = k),
            type: "search",
            class: "pl-9",
            placeholder: "Search gateways…",
            "aria-label": "Search payment gateways"
          }, null, 8, ["modelValue"])
        ]),
        i.value.length > 0 ? (t(), T(r4, {
          key: 0,
          gateways: i.value,
          onConfigure: f,
          onToggle: v
        }, null, 8, ["gateways"])) : (t(), n("p", f4, " No gateways match “" + c(r.value.trim()) + "”. ", 1))
      ]),
      I(Lt, {
        open: s.value !== null,
        title: s.value?.label ?? "Gateway",
        description: "Showcase fields only. Values are not sent anywhere.",
        size: "md",
        onClose: C[8] || (C[8] = (k) => a.value = null)
      }, {
        footer: O(() => [
          I(ce, {
            variant: "outline",
            size: "sm",
            onClick: C[6] || (C[6] = (k) => a.value = null)
          }, {
            default: O(() => [...C[21] || (C[21] = [
              U("Close", -1)
            ])]),
            _: 1
          }),
          s.value ? (t(), T(ce, {
            key: 0,
            size: "sm",
            onClick: C[7] || (C[7] = (k) => v(s.value.key))
          }, {
            default: O(() => [
              U(c(s.value.connected ? "Disconnect" : "Mark connected"), 1)
            ]),
            _: 1
          })) : b("", !0)
        ]),
        default: O(() => [
          s.value ? (t(), n("div", m4, [
            l("div", p4, [
              I($e, {
                status: s.value.connected ? "connected" : "disconnected"
              }, {
                default: O(() => [
                  U(c(s.value.connected ? "Connected" : "Not connected"), 1)
                ]),
                _: 1
              }, 8, ["status"]),
              s.value.connected && s.value.enabled !== !1 ? (t(), T($e, {
                key: 0,
                status: "offered"
              }, {
                default: O(() => [...C[9] || (C[9] = [
                  U(" Offered ", -1)
                ])]),
                _: 1
              })) : s.value.connected ? (t(), T($e, {
                key: 1,
                status: "disabled"
              }, {
                default: O(() => [...C[10] || (C[10] = [
                  U(" Disabled ", -1)
                ])]),
                _: 1
              })) : b("", !0),
              s.value.isDefault ? (t(), T($e, {
                key: 2,
                status: "default"
              }, {
                default: O(() => [...C[11] || (C[11] = [
                  U(" Default ", -1)
                ])]),
                _: 1
              })) : b("", !0),
              s.value.connected && s.value.mode ? (t(), T($e, {
                key: 3,
                status: s.value.mode
              }, {
                default: O(() => [
                  U(c(s.value.mode), 1)
                ]),
                _: 1
              }, 8, ["status"])) : b("", !0)
            ]),
            l("p", v4, c(s.value.caption), 1),
            l("label", g4, [
              C[12] || (C[12] = U(" Display name ", -1)),
              l("input", {
                class: "border-input h-9 rounded-md border bg-transparent px-3 text-sm",
                value: s.value.label,
                readonly: ""
              }, null, 8, h4)
            ]),
            C[20] || (C[20] = l("label", { class: "flex flex-col gap-1 text-sm" }, [
              U(" Merchant / till (placeholder) "),
              l("input", {
                class: "border-input h-9 rounded-md border bg-transparent px-3 text-sm",
                placeholder: "Not stored, demo field",
                autocomplete: "off"
              })
            ], -1)),
            s.value.connected ? (t(), n("div", b4, [
              C[16] || (C[16] = l("p", { class: "text-sm font-medium" }, "Checkout", -1)),
              C[17] || (C[17] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " Disabled gateways stay connected but are not offered at checkout. Only one gateway can be the default tender. ", -1)),
              l("div", y4, [
                I(ce, {
                  size: "sm",
                  variant: s.value.enabled !== !1 ? "default" : "outline",
                  onClick: C[1] || (C[1] = (k) => m(s.value.key, !0))
                }, {
                  default: O(() => [...C[13] || (C[13] = [
                    U(" Enable ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant"]),
                I(ce, {
                  size: "sm",
                  variant: s.value.enabled === !1 ? "default" : "outline",
                  onClick: C[2] || (C[2] = (k) => m(s.value.key, !1))
                }, {
                  default: O(() => [...C[14] || (C[14] = [
                    U(" Disable ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant"]),
                I(ce, {
                  size: "sm",
                  variant: s.value.isDefault ? "default" : "outline",
                  disabled: !d(s.value),
                  onClick: C[3] || (C[3] = (k) => h(s.value.key))
                }, {
                  default: O(() => [...C[15] || (C[15] = [
                    U(" Use as default ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant", "disabled"])
              ])
            ])) : b("", !0),
            s.value.connected ? (t(), n("div", x4, [
              I(ce, {
                size: "sm",
                variant: s.value.mode === "test" ? "default" : "outline",
                onClick: C[4] || (C[4] = (k) => M("test"))
              }, {
                default: O(() => [...C[18] || (C[18] = [
                  U(" Test ", -1)
                ])]),
                _: 1
              }, 8, ["variant"]),
              I(ce, {
                size: "sm",
                variant: s.value.mode === "live" ? "default" : "outline",
                onClick: C[5] || (C[5] = (k) => M("live"))
              }, {
                default: O(() => [...C[19] || (C[19] = [
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
function PS(e) {
  const o = K(Pn(e));
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
    const f = new Set(o.value);
    f.has(u) ? f.delete(u) : f.add(u), o.value = f;
  }
  function r(u) {
    const f = new Set(o.value);
    f.add(u), o.value = f;
  }
  function s(u) {
    const f = new Set(o.value);
    f.delete(u), o.value = f;
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
function LS(e) {
  const o = K(Ln(e));
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
    for (const [u, f] of Object.entries(i))
      typeof f == "number" && f >= 48 && f <= 1200 && (d[u] = Math.round(f));
    o.value = d;
  }
  function s() {
    o.value = {};
  }
  return { widths: o, setWidth: a, setWidths: r, reset: s };
}
function OS(e) {
  const { config: o, rows: a, rowKey: r = "id", fetchChanges: s, onResync: i, onInsert: d } = e, u = K(
    o.driver === "none" ? "off" : "connecting"
  ), f = K(/* @__PURE__ */ new Set());
  let v = /* @__PURE__ */ new Map(), m, h, M, $ = (/* @__PURE__ */ new Date()).toISOString(), C = null;
  function k(Z, W) {
    v.set(Z, { ...v.get(Z) ?? {}, ...W }), !m && (m = setTimeout(() => {
      m = void 0, A();
    }, o.batchMs));
  }
  function A() {
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
    W.size !== 0 && (f.value = /* @__PURE__ */ new Set([...f.value, ...W]), setTimeout(() => {
      const H = new Set(f.value);
      W.forEach((N) => H.delete(N)), f.value = H;
    }, 1500));
  }
  async function B() {
    if (!(!s || a.value.length === 0)) {
      M?.abort(), M = new AbortController();
      try {
        const Z = a.value.map((N) => N[r]), { records: W, at: H } = await s(Z, $);
        $ = H, u.value = "live";
        for (const N of W)
          k(N[r], N);
      } catch {
        u.value = "connecting";
      }
    }
  }
  function w() {
    p(), u.value = "live", h = setInterval(B, o.intervalMs);
  }
  function p() {
    clearInterval(h), h = void 0, M?.abort();
  }
  function g() {
    return window.Echo ?? null;
  }
  function S() {
    const Z = g();
    if (!Z || !o.channel) {
      u.value = "connecting", console.warn(
        "[alxtexhpanel] broadcast driver configured but window.Echo is unavailable."
      );
      return;
    }
    C = o.channel;
    const W = Z.private(o.channel);
    for (const H of o.events)
      W.listen(H, (N) => {
        N?.[r] !== void 0 && k(N[r], N);
      });
    u.value = "live", Z.connector?.pusher?.connection?.bind("connected", () => {
      u.value = "live", i?.();
    }), Z.connector?.pusher?.connection?.bind("disconnected", () => {
      u.value = "connecting";
    });
  }
  function F() {
    C && (g()?.leave(C), C = null);
  }
  function D() {
    o.driver === "poll" && w(), o.driver === "broadcast" && S();
  }
  function Y() {
    p(), F(), clearTimeout(m), m = void 0, v = /* @__PURE__ */ new Map();
  }
  function G() {
    o.pauseWhenHidden && (document.hidden ? (Y(), u.value = "paused") : ($ = (/* @__PURE__ */ new Date()).toISOString(), D(), i?.()));
  }
  return On() && (be(() => {
    o.driver !== "none" && (D(), o.pauseWhenHidden && document.addEventListener("visibilitychange", G));
  }), ke(() => {
    document.removeEventListener("visibilitychange", G), Y();
  })), { status: u, recentlyChanged: f, applyPatch: k, flush: A, pollOnce: B };
}
const k4 = /^[a-z0-9-]+$/, $4 = /^[a-zA-Z0-9\s.,()%#/-]+$/;
function jS(e) {
  $a(() => {
    if (typeof document > "u")
      return;
    const o = {};
    for (const [a, r] of Object.entries(e.value ?? {}))
      !k4.test(a) || typeof r != "string" || !$4.test(r) || (o[`--${a}`] = r);
    Ec(o);
  });
}
const w4 = { class: "flex items-center gap-0.5" }, C4 = /* @__PURE__ */ L({
  __name: "PkColourModePreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), n("span", w4, [
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
}), S4 = /* @__PURE__ */ L({
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
}), M4 = {
  class: "flex flex-wrap gap-1.5",
  role: "listbox",
  "data-test": "icon-picker-field"
}, B4 = ["aria-selected", "disabled", "title", "onClick"], A4 = /* @__PURE__ */ L({
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
    return (u, f) => (t(), n("div", M4, [
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
      }, c(v), 11, B4))), 128))
    ]));
  }
}), z4 = ["value", "placeholder", "disabled"], _4 = /* @__PURE__ */ L({
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
    }, null, 42, z4));
  }
}), P4 = ["aria-label"], L4 = ["disabled", "aria-label", "aria-pressed", "onClick"], O4 = {
  class: "size-5",
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, j4 = { key: 0 }, V4 = ["id"], D4 = ["fill"], T4 = ["disabled"], I4 = /* @__PURE__ */ L({
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
    function f(v) {
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
        onClick: (M) => u(h)
      }, [
        (t(), n("svg", O4, [
          f(h) === "half" ? (t(), n("defs", j4, [
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
            ])], 8, V4)
          ])) : b("", !0),
          l("path", {
            d: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z",
            fill: f(h) === "full" ? "currentColor" : f(h) === "half" ? `url(#half-${e.field.key}-${h})` : "none",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }, null, 8, D4)
        ]))
      ], 8, L4))), 128)),
      d.value > 0 ? (t(), n("button", {
        key: 0,
        type: "button",
        class: "text-muted-foreground ml-1 text-xs hover:text-foreground disabled:opacity-50",
        disabled: e.disabled,
        onClick: m[0] || (m[0] = (h) => u(0))
      }, " Clear ", 8, T4)) : b("", !0)
    ], 8, P4));
  }
}), E4 = { class: "flex flex-col gap-2" }, F4 = { class: "bg-card rounded-lg border p-4" }, N4 = { class: "text-muted-foreground truncate text-xs" }, R4 = { class: "flex flex-wrap gap-x-4 gap-y-1 text-xs" }, U4 = /* @__PURE__ */ L({
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
      const C = String(o.field.path ?? "/").split("?")[0].replace(/^\/+|\/+$/g, "");
      return C === "" ? d.value : `${d.value} › ${C.split("/").join(" › ")}`;
    });
    function f(C, k) {
      return C.length <= k ? C : `${C.slice(0, k - 1).trimEnd()}…`;
    }
    const v = y(() => f(s.value, r.value.titleMax)), m = y(() => f(i.value, r.value.descriptionMax));
    function h(C, k, A) {
      return C === 0 ? { tone: "text-muted-foreground", note: "empty" } : C > A ? { tone: "text-amber-600 dark:text-amber-400", note: "truncated" } : C < k ? { tone: "text-muted-foreground", note: "short" } : { tone: "text-emerald-600 dark:text-emerald-400", note: "good" };
    }
    const M = y(
      () => h(s.value.length, r.value.titleMin, r.value.titleMax)
    ), $ = y(
      () => h(i.value.length, r.value.descriptionMin, r.value.descriptionMax)
    );
    return (C, k) => (t(), n("div", E4, [
      l("div", F4, [
        l("p", N4, c(u.value), 1),
        l("p", {
          class: z(["mt-1 truncate text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]", v.value === "" ? "text-muted-foreground italic" : ""])
        }, c(v.value || "Untitled page"), 3),
        l("p", {
          class: z(["text-muted-foreground mt-1 line-clamp-2 text-sm", m.value === "" ? "italic" : ""])
        }, c(m.value || "No description. The engine writes its own from the page text, which is usually a mid-sentence fragment."), 3)
      ]),
      l("div", R4, [
        l("span", {
          class: z(M.value.tone)
        }, " Title " + c(s.value.length) + "/" + c(r.value.titleMax) + " · " + c(M.value.note), 3),
        l("span", {
          class: z($.value.tone)
        }, " Description " + c(i.value.length) + "/" + c(r.value.descriptionMax) + " · " + c($.value.note), 3)
      ]),
      k[0] || (k[0] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " An approximation. Engines measure pixel width rather than characters, and may rewrite a title they judge unhelpful. ", -1))
    ]));
  }
}), H4 = {
  class: "relative",
  "data-test": "tree-select-field"
}, K4 = ["disabled"], q4 = {
  key: 0,
  class: "bg-popover absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-md border p-1 shadow-md"
}, G4 = ["onClick"], W4 = ["onClick"], Z4 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkTreeSelect",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(""), i = K(!1), d = y(() => a.field.options ?? []);
    function u(h, M) {
      return !M || h.label.toLowerCase().includes(M) ? !0 : (h.children ?? []).some(($) => u($, M));
    }
    const f = y(() => {
      const h = s.value.trim().toLowerCase();
      return h ? d.value.filter((M) => u(M, h)) : d.value;
    }), v = y(() => {
      const h = (M) => {
        for (const $ of M) {
          if ($.value === a.modelValue)
            return $.label;
          const C = h($.children ?? []);
          if (C)
            return C;
        }
        return null;
      };
      return h(d.value);
    });
    function m(h) {
      a.disabled || (r("update:modelValue", h), i.value = !1);
    }
    return (h, M) => (t(), n("div", H4, [
      l("button", {
        type: "button",
        class: z(["border-input bg-background flex h-10 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50", x(Be)]),
        disabled: e.disabled,
        onClick: M[0] || (M[0] = ($) => i.value = !i.value)
      }, [
        l("span", {
          class: z(v.value ? "" : "text-muted-foreground")
        }, c(v.value ?? "Select…"), 3),
        M[2] || (M[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "▾", -1))
      ], 10, K4),
      i.value ? (t(), n("div", q4, [
        e.field.searchable ? he((t(), n("input", {
          key: 0,
          "onUpdate:modelValue": M[1] || (M[1] = ($) => s.value = $),
          type: "search",
          class: "border-input mb-1 h-8 w-full rounded border px-2 text-sm",
          placeholder: "Search…"
        }, null, 512)), [
          [ze, s.value]
        ]) : b("", !0),
        (t(!0), n(_, null, j(f.value, ($) => (t(), n(_, {
          key: String($.value)
        }, [
          l("button", {
            type: "button",
            class: z(["hover:bg-accent flex w-full rounded px-2 py-1.5 text-left text-sm font-medium", e.modelValue === $.value ? "bg-accent" : ""]),
            onClick: (C) => m($.value)
          }, c($.label), 11, G4),
          (t(!0), n(_, null, j($.children ?? [], (C) => (t(), n("button", {
            key: String(C.value),
            type: "button",
            class: z(["hover:bg-accent text-muted-foreground flex w-full rounded py-1.5 pr-2 pl-6 text-left text-sm", e.modelValue === C.value ? "bg-accent text-foreground" : ""]),
            onClick: (k) => m(C.value)
          }, c(C.label), 11, W4))), 128))
        ], 64))), 128))
      ])) : b("", !0)
    ]));
  }
});
function J4() {
  xe("radio", xv), xe("toggle-buttons", qn), xe("checkboxlist", wv), xe("tags", _v), xe("colour", Rv), xe("slider", kg), xe("rating", I4), xe("phone", _4), xe("icon-picker", A4), xe("tree-select", Z4), xe("visual-select", jg), xe("markdown", Xp), xe("code", sv), xe("map", Gv), xe("qrcode", Qv), xe("barcode", og), xe("diff", ig), xe("seo-preview", U4), Et("swatch", Dg), Et("voucher-code-box", S4), Et("document-colour-mode", C4);
}
function ca() {
  const e = K(null), o = K(!1);
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
const Y4 = /* @__PURE__ */ L({
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
      q(r.$slots, "default")
    ], 6));
  }
}), Q4 = ["id"], Se = /* @__PURE__ */ L({
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
        I(Y4, null, {
          default: O(() => [
            q(o.$slots, "default")
          ]),
          _: 3
        })
      ], 2)
    ], 10, Q4));
  }
}), X4 = {
  key: 0,
  class: "text-xs font-semibold tracking-widest text-primary uppercase"
}, e5 = {
  key: 1,
  class: "text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
}, t5 = {
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
      e.eyebrow ? (t(), n("p", X4, c(e.eyebrow), 1)) : b("", !0),
      e.title ? (t(), n("h2", e5, c(e.title), 1)) : b("", !0),
      e.body ? (t(), n("p", t5, c(e.body), 1)) : b("", !0)
    ], 2)) : b("", !0);
  }
}), n5 = { class: "flex flex-col gap-10" }, a5 = { class: "grid gap-4 md:grid-cols-3" }, l5 = {
  key: 0,
  class: "text-xs font-medium text-muted-foreground"
}, o5 = { class: "text-sm font-semibold text-balance" }, s5 = {
  key: 1,
  class: "text-pretty text-sm text-muted-foreground"
}, r5 = /* @__PURE__ */ L({
  __name: "PkArticles",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", n5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", a5, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", { key: s }, [
              (t(), T(Ce(r.href ? "a" : "div"), {
                href: r.href || void 0,
                class: "flex h-full flex-col gap-3 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
              }, {
                default: O(() => [
                  r.meta ? (t(), n("p", l5, c(r.meta), 1)) : b("", !0),
                  l("h3", o5, c(r.title), 1),
                  r.body ? (t(), n("p", s5, c(r.body), 1)) : b("", !0)
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
function i5() {
  const e = K(null);
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
const d5 = { class: "pk-tilt-inner relative h-full" }, u5 = /* @__PURE__ */ L({
  __name: "PkTiltCard",
  setup(e) {
    const { el: o } = i5();
    return (a, r) => (t(), n("div", {
      ref_key: "el",
      ref: o,
      class: "pk-tilt group/tilt"
    }, [
      l("div", d5, [
        r[0] || (r[0] = l("span", {
          class: "pk-tilt-glow pointer-events-none absolute inset-0 rounded-lg",
          "aria-hidden": "true"
        }, null, -1)),
        q(a.$slots, "default")
      ])
    ], 512));
  }
}), c5 = { class: "flex flex-col gap-10" }, f5 = { class: "grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-3" }, m5 = { class: "text-base font-semibold" }, p5 = { class: "text-sm text-pretty text-muted-foreground" }, v5 = /* @__PURE__ */ L({
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
        l("div", c5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", f5, [
            (t(!0), n(_, null, j(e.items ?? [], (s, i) => (t(), T(u5, {
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
                  l("h3", m5, c(s.title), 1),
                  l("p", p5, c(s.body), 1)
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
}), g5 = { class: "grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center" }, h5 = { class: "flex flex-col gap-4 rounded-xl border bg-card p-6 sm:p-8" }, b5 = { class: "grid gap-4 text-sm" }, y5 = {
  key: 0,
  class: "grid gap-1"
}, x5 = ["href"], k5 = {
  key: 1,
  class: "grid gap-1"
}, $5 = ["href"], w5 = {
  key: 2,
  class: "grid gap-1"
}, C5 = { class: "text-pretty text-muted-foreground" }, S5 = ["href"], M5 = /* @__PURE__ */ L({
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
        l("div", g5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", h5, [
            l("dl", b5, [
              e.email ? (t(), n("div", y5, [
                a[0] || (a[0] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Email ", -1)),
                l("dd", null, [
                  l("a", {
                    href: `mailto:${e.email}`,
                    class: "font-medium text-foreground underline-offset-4 hover:underline"
                  }, c(e.email), 9, x5)
                ])
              ])) : b("", !0),
              e.phone ? (t(), n("div", k5, [
                a[1] || (a[1] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Phone ", -1)),
                l("dd", null, [
                  l("a", {
                    href: `tel:${e.phone.replace(/\s+/g, "")}`,
                    class: "font-medium text-foreground underline-offset-4 hover:underline"
                  }, c(e.phone), 9, $5)
                ])
              ])) : b("", !0),
              e.address ? (t(), n("div", w5, [
                a[2] || (a[2] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Address ", -1)),
                l("dd", C5, c(e.address), 1)
              ])) : b("", !0)
            ]),
            e.label ? (t(), n("a", {
              key: 0,
              href: e.href ?? (e.email ? `mailto:${e.email}` : "#"),
              class: "inline-flex h-11 w-fit items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            }, c(e.label), 9, S5)) : b("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), B5 = { class: "flex flex-col items-center gap-5 rounded-xl border bg-card px-6 py-12 text-center" }, A5 = { class: "max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl" }, z5 = {
  key: 0,
  class: "max-w-xl text-pretty text-muted-foreground"
}, _5 = ["href"], P5 = /* @__PURE__ */ L({
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
        l("div", B5, [
          l("h2", A5, c(e.title), 1),
          e.body ? (t(), n("p", z5, c(e.body), 1)) : b("", !0),
          e.label ? (t(), n("a", {
            key: 1,
            href: e.href ?? "#",
            class: "inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          }, c(e.label), 9, _5)) : b("", !0)
        ])
      ]),
      _: 1
    }));
  }
}), L5 = { class: "flex flex-col gap-8" }, O5 = { class: "divide-y rounded-lg border" }, j5 = { class: "flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent/50" }, V5 = { class: "px-4 pb-4 text-sm text-pretty text-muted-foreground" }, D5 = /* @__PURE__ */ L({
  __name: "PkFaq",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, { narrow: "" }, {
      default: O(() => [
        l("div", L5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", O5, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("details", {
              key: s,
              class: "group"
            }, [
              l("summary", j5, [
                U(c(r.question) + " ", 1),
                a[0] || (a[0] = l("span", {
                  class: "text-muted-foreground transition-transform group-open:rotate-45",
                  "aria-hidden": "true"
                }, " + ", -1))
              ]),
              l("p", V5, c(r.answer), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), T5 = { class: "flex flex-col gap-10" }, I5 = { class: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }, E5 = { class: "text-sm font-semibold" }, F5 = { class: "text-sm text-pretty text-muted-foreground" }, N5 = /* @__PURE__ */ L({
  __name: "PkFeatureGrid",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", T5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", I5, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-2 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              l("h3", E5, c(r.title), 1),
              l("p", F5, c(r.body), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), R5 = {
  key: 0,
  class: "pk-hero-brand text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
}, U5 = {
  key: 1,
  class: "rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground"
}, H5 = {
  key: 2,
  class: "max-w-2xl text-lg text-pretty text-muted-foreground"
}, K5 = {
  key: 3,
  class: "flex flex-wrap items-center justify-center gap-3"
}, q5 = ["href"], G5 = ["href"], W5 = {
  key: 4,
  class: "text-xs font-normal text-muted-foreground"
}, Z5 = /* @__PURE__ */ L({
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
          e.brand ? (t(), n("p", R5, c(e.brand), 1)) : b("", !0),
          e.eyebrow ? (t(), n("p", U5, c(e.eyebrow), 1)) : b("", !0),
          l("h1", {
            class: z(["max-w-3xl font-semibold tracking-tight text-balance", e.brand ? "text-2xl sm:text-3xl md:text-4xl" : "text-4xl sm:text-5xl"])
          }, c(e.title), 3),
          e.body ? (t(), n("p", H5, c(e.body), 1)) : b("", !0),
          e.primaryLabel || e.secondaryLabel ? (t(), n("div", K5, [
            e.secondaryLabel ? (t(), n("a", {
              key: 0,
              href: e.secondaryHref ?? "#",
              class: "inline-flex h-11 items-center rounded-md border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent"
            }, c(e.secondaryLabel), 9, q5)) : b("", !0),
            e.primaryLabel ? (t(), n("a", {
              key: 1,
              href: e.primaryHref ?? "#",
              class: "inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            }, c(e.primaryLabel), 9, G5)) : b("", !0)
          ])) : b("", !0),
          e.note ? (t(), n("p", W5, c(e.note), 1)) : b("", !0)
        ], 2)
      ]),
      _: 1
    }));
  }
}), J5 = { class: "flex flex-col items-center gap-6" }, Y5 = {
  key: 0,
  class: "text-xs font-medium tracking-widest text-muted-foreground uppercase"
}, Q5 = { class: "flex flex-wrap items-center justify-center gap-x-10 gap-y-4" }, X5 = /* @__PURE__ */ L({
  __name: "PkLogoCloud",
  props: {
    title: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, { muted: "" }, {
      default: O(() => [
        l("div", J5, [
          e.title ? (t(), n("p", Y5, c(e.title), 1)) : b("", !0),
          l("ul", Q5, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "text-lg font-semibold text-muted-foreground/70"
            }, c(r.name), 1))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), e3 = {
  key: 0,
  class: "mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
}, t3 = {
  class: "pk-marquee-track",
  role: "list"
}, n3 = ["href"], a3 = {
  key: 1,
  role: "listitem",
  class: "pk-marquee-item"
}, l3 = /* @__PURE__ */ L({
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
        e.title ? (t(), n("p", e3, c(e.title), 1)) : b("", !0),
        l("div", {
          class: z(["pk-marquee", [`pk-marquee-${e.speed}`, e.reverse ? "pk-marquee-reverse" : ""]])
        }, [
          l("div", t3, [
            (t(!0), n(_, null, j(a.value, (i, d) => (t(), n(_, {
              key: `${i.name}-${d}`
            }, [
              i.href ? (t(), n("a", {
                key: 0,
                href: i.href,
                role: "listitem",
                class: "pk-marquee-item"
              }, c(i.name), 9, n3)) : (t(), n("span", a3, c(i.name), 1))
            ], 64))), 128))
          ])
        ], 2)
      ]),
      _: 1
    }, 8, ["aria-label"])) : b("", !0);
  }
}), o3 = { class: "flex flex-col gap-10" }, s3 = {
  key: 0,
  class: "flex items-center justify-center gap-3"
}, r3 = {
  class: "inline-flex rounded-md border bg-background p-1",
  role: "group"
}, i3 = ["aria-pressed"], d3 = ["aria-pressed"], u3 = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, c3 = { class: "grid gap-4 md:grid-cols-3" }, f3 = { class: "flex flex-col gap-1" }, m3 = { class: "text-sm font-semibold" }, p3 = { class: "flex items-baseline gap-1" }, v3 = { class: "text-3xl font-semibold tracking-tight" }, g3 = {
  key: 0,
  class: "text-sm text-muted-foreground font-normal"
}, h3 = {
  key: 0,
  class: "text-sm text-pretty text-muted-foreground"
}, b3 = { class: "flex flex-col gap-2 text-sm" }, y3 = { class: "text-muted-foreground" }, x3 = ["href"], k3 = /* @__PURE__ */ L({
  __name: "PkPricing",
  props: {
    title: {},
    body: {},
    annualNote: {},
    items: {}
  },
  setup(e) {
    const o = e, a = K(!1), r = y(() => (o.items ?? []).some((i) => !!i.annualPrice));
    function s(i) {
      return a.value && i.annualPrice ? i.annualPrice : i.price;
    }
    return (i, d) => (t(), T(Se, { muted: "" }, {
      default: O(() => [
        l("div", o3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          r.value ? (t(), n("div", s3, [
            l("div", r3, [
              l("button", {
                type: "button",
                class: z([
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  a.value ? "text-muted-foreground" : "bg-primary text-primary-foreground"
                ]),
                "aria-pressed": !a.value,
                onClick: d[0] || (d[0] = (u) => a.value = !1)
              }, " Monthly ", 10, i3),
              l("button", {
                type: "button",
                class: z([
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  a.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                ]),
                "aria-pressed": a.value,
                onClick: d[1] || (d[1] = (u) => a.value = !0)
              }, " Annual ", 10, d3)
            ]),
            e.annualNote ? (t(), n("p", u3, c(e.annualNote), 1)) : b("", !0)
          ])) : b("", !0),
          l("ul", c3, [
            (t(!0), n(_, null, j(e.items ?? [], (u, f) => (t(), n("li", {
              key: f,
              class: z(["flex flex-col gap-4 rounded-lg border bg-card p-6", u.featured ? "border-primary shadow-sm" : ""])
            }, [
              l("div", f3, [
                l("h3", m3, c(u.name), 1),
                l("p", p3, [
                  l("span", v3, c(s(u)), 1),
                  u.period ? (t(), n("span", g3, c(u.period), 1)) : b("", !0)
                ]),
                u.body ? (t(), n("p", h3, c(u.body), 1)) : b("", !0)
              ]),
              l("ul", b3, [
                (t(!0), n(_, null, j(u.features ?? [], (v, m) => (t(), n("li", {
                  key: m,
                  class: "flex items-start gap-2"
                }, [
                  d[2] || (d[2] = l("span", {
                    class: "mt-0.5 text-success",
                    "aria-hidden": "true"
                  }, "✓", -1)),
                  l("span", y3, c(v.title), 1)
                ]))), 128))
              ]),
              u.label ? (t(), n("a", {
                key: 0,
                href: u.href ?? "#",
                class: z([
                  "mt-auto inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                  u.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border bg-background hover:bg-accent"
                ])
              }, c(u.label), 11, x3)) : b("", !0)
            ], 2))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
});
function $3() {
  const e = K(null);
  let o = null, a = null, r = !1, s = !1;
  function i() {
    if (r = !1, !o || !s)
      return;
    const u = o.getBoundingClientRect(), f = u.height + window.innerHeight, v = f <= 0 ? 0 : (window.innerHeight - u.top) / f;
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
      o.style.setProperty("--pk-progress", "0"), a = new IntersectionObserver((f) => {
        s = f.some((v) => v.isIntersecting), s && d();
      }), a.observe(o), window.addEventListener("scroll", d, { passive: !0 }), window.addEventListener("resize", d, { passive: !0 }), d();
    }
  }), ke(() => {
    a?.disconnect(), window.removeEventListener("scroll", d), window.removeEventListener("resize", d);
  }), { el: e };
}
const w3 = { class: "mx-auto h-[190vh] w-full max-w-6xl" }, C3 = { class: "sticky top-[12vh] flex flex-col items-center gap-8" }, S3 = { class: "flex max-w-2xl flex-col items-center gap-3 text-center" }, M3 = { class: "text-2xl font-semibold tracking-tight text-balance sm:text-3xl" }, B3 = {
  key: 0,
  class: "text-pretty text-muted-foreground"
}, A3 = { class: "pk-showcase-stage w-full [perspective:1400px]" }, z3 = { class: "pk-showcase-frame overflow-hidden rounded-xl border bg-card shadow-2xl" }, _3 = { class: "flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5" }, P3 = { class: "ml-3 truncate text-xs text-muted-foreground" }, L3 = { class: "flex" }, O3 = { class: "hidden w-40 shrink-0 flex-col gap-2 border-r p-4 sm:flex" }, j3 = { class: "min-w-0 flex-1 p-4" }, V3 = { class: "flex flex-col divide-y rounded-md border" }, D3 = /* @__PURE__ */ L({
  __name: "PkShowcase",
  props: {
    title: {},
    body: {},
    rows: { default: 6 },
    caption: {}
  },
  setup(e) {
    const { el: o } = $3();
    return (a, r) => (t(), n("section", {
      ref_key: "el",
      ref: o,
      class: "pk-showcase relative w-full px-4 sm:px-6"
    }, [
      l("div", w3, [
        l("div", C3, [
          l("div", S3, [
            l("h2", M3, c(e.title), 1),
            e.body ? (t(), n("p", B3, c(e.body), 1)) : b("", !0)
          ]),
          l("div", A3, [
            l("div", z3, [
              l("div", _3, [
                r[0] || (r[0] = l("span", { class: "size-2.5 rounded-full bg-red-400/70" }, null, -1)),
                r[1] || (r[1] = l("span", { class: "size-2.5 rounded-full bg-amber-400/70" }, null, -1)),
                r[2] || (r[2] = l("span", { class: "size-2.5 rounded-full bg-emerald-400/70" }, null, -1)),
                l("span", P3, c(e.caption ?? "yourpanel.example / records"), 1)
              ]),
              l("div", L3, [
                l("div", O3, [
                  (t(), n(_, null, j(6, (s) => l("span", {
                    key: s,
                    class: "h-2.5 rounded bg-foreground/10",
                    style: ie({ width: `${55 + s * 13 % 40}%` })
                  }, null, 4)), 64))
                ]),
                l("div", j3, [
                  r[4] || (r[4] = l("div", { class: "mb-3 flex gap-2" }, [
                    l("span", { class: "h-7 w-28 rounded-md bg-foreground/[0.07]" }),
                    l("span", { class: "h-7 w-20 rounded-md bg-foreground/[0.07]" }),
                    l("span", { class: "ml-auto h-7 w-24 rounded-md bg-primary/25" })
                  ], -1)),
                  l("div", V3, [
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
}), T3 = /* @__PURE__ */ L({
  __name: "PkCountUp",
  props: {
    to: {},
    prefix: {},
    suffix: {},
    decimals: { default: 0 },
    duration: { default: 1400 }
  },
  setup(e) {
    const o = e, { el: a, shown: r } = ca(), s = K(0);
    return pe(r, (i) => {
      if (!i)
        return;
      if (typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof requestAnimationFrame > "u") {
        s.value = o.to;
        return;
      }
      const u = performance.now(), f = (v) => {
        const m = Math.min((v - u) / o.duration, 1);
        s.value = o.to * (1 - Math.pow(1 - m, 3)), m < 1 ? requestAnimationFrame(f) : s.value = o.to;
      };
      requestAnimationFrame(f);
    }), (i, d) => (t(), n("span", {
      ref_key: "el",
      ref: a
    }, c(e.prefix ?? "") + c(s.value.toFixed(e.decimals)) + c(e.suffix ?? ""), 513));
  }
}), I3 = { class: "flex flex-col gap-10" }, E3 = { class: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4" }, F3 = { class: "order-2 text-sm text-muted-foreground" }, N3 = { class: "order-1 text-3xl font-semibold tracking-tight sm:text-4xl" }, R3 = /* @__PURE__ */ L({
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
        l("div", I3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("dl", E3, [
            (t(!0), n(_, null, j(e.items ?? [], (s, i) => (t(), n("div", {
              key: i,
              class: "flex flex-col items-center gap-1 text-center"
            }, [
              l("dt", F3, c(s.label), 1),
              l("dd", N3, [
                o(s.value) ? (t(), T(T3, {
                  key: 0,
                  to: o(s.value).number,
                  prefix: o(s.value).prefix,
                  suffix: o(s.value).suffix,
                  decimals: o(s.value).decimals
                }, null, 8, ["to", "prefix", "suffix", "decimals"])) : (t(), n(_, { key: 1 }, [
                  U(c(s.value), 1)
                ], 64))
              ])
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), U3 = { class: "flex flex-col gap-10" }, H3 = { class: "grid gap-6 md:grid-cols-3" }, K3 = { class: "flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary" }, q3 = { class: "text-sm font-semibold" }, G3 = { class: "text-sm text-pretty text-muted-foreground" }, W3 = /* @__PURE__ */ L({
  __name: "PkSteps",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", U3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ol", H3, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-2"
            }, [
              l("span", K3, c(s + 1), 1),
              l("h3", q3, c(r.title), 1),
              l("p", G3, c(r.body), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Z3 = { class: "flex flex-col gap-10" }, J3 = { class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" }, Y3 = ["src"], Q3 = {
  key: 1,
  class: "mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-lg font-semibold",
  "aria-hidden": "true"
}, X3 = { class: "min-w-0" }, e8 = { class: "truncate text-sm font-semibold" }, t8 = {
  key: 0,
  class: "truncate text-xs text-muted-foreground"
}, n8 = {
  key: 2,
  class: "text-pretty text-xs text-muted-foreground"
}, a8 = /* @__PURE__ */ L({
  __name: "PkTeam",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", Z3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", J3, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-3 rounded-lg border bg-card p-5 text-center transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              r.avatar ? (t(), n("img", {
                key: 0,
                src: r.avatar,
                alt: "",
                class: "mx-auto size-16 rounded-full object-cover"
              }, null, 8, Y3)) : (t(), n("span", Q3, c((r.name ?? "?").slice(0, 1)), 1)),
              l("div", X3, [
                l("h3", e8, c(r.name), 1),
                r.role ? (t(), n("p", t8, c(r.role), 1)) : b("", !0)
              ]),
              r.bio ? (t(), n("p", n8, c(r.bio), 1)) : b("", !0)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), l8 = { class: "flex flex-col gap-10" }, o8 = { class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, s8 = { class: "flex h-full flex-col gap-4" }, r8 = { class: "text-pretty text-sm leading-relaxed" }, i8 = { class: "mt-auto flex items-center gap-3" }, d8 = ["src"], u8 = {
  key: 1,
  class: "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium",
  "aria-hidden": "true"
}, c8 = { class: "min-w-0" }, f8 = { class: "block truncate text-sm font-medium" }, m8 = {
  key: 0,
  class: "block truncate text-xs text-muted-foreground"
}, p8 = /* @__PURE__ */ L({
  __name: "PkTestimonials",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Se, null, {
      default: O(() => [
        l("div", l8, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", o8, [
            (t(!0), n(_, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-4 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              l("figure", s8, [
                l("blockquote", r8, " “" + c(r.quote) + "” ", 1),
                l("figcaption", i8, [
                  r.avatar ? (t(), n("img", {
                    key: 0,
                    src: r.avatar,
                    alt: "",
                    class: "size-9 shrink-0 rounded-full object-cover"
                  }, null, 8, d8)) : (t(), n("span", u8, c((r.name ?? "?").slice(0, 1)), 1)),
                  l("span", c8, [
                    l("span", f8, c(r.name), 1),
                    r.role ? (t(), n("span", m8, c(r.role), 1)) : b("", !0)
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
}), VS = /* @__PURE__ */ L({
  __name: "PkLandingSections",
  props: {
    sections: {},
    warnOnUnknown: { type: Boolean, default: !1 }
  },
  setup(e, { expose: o }) {
    const a = e, r = {
      hero: Z5,
      logos: X5,
      marquee: l3,
      features: N5,
      bento: v5,
      showcase: D3,
      steps: W3,
      stats: R3,
      testimonials: p8,
      team: a8,
      articles: r5,
      contact: M5,
      pricing: k3,
      faq: D5,
      cta: P5
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
}), v8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, DS = /* @__PURE__ */ L({
  __name: "PkAuroraBackdrop",
  props: {
    intensity: { default: "full" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", v8, [
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
}), g8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, TS = /* @__PURE__ */ L({
  __name: "PkEditorialBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", g8, [...a[0] || (a[0] = [
      ut('<div class="pk-wash absolute inset-0"></div><div class="absolute inset-y-0 left-1/2 hidden w-full max-w-3xl -translate-x-1/2 lg:block"><div class="absolute inset-y-0 left-0 w-px bg-foreground/[0.06]"></div><div class="absolute inset-y-0 right-0 w-px bg-foreground/[0.06]"></div></div><div class="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]" style="background-image:url(&quot;data:image/svg+xml;utf8,&lt;svg xmlns=&#39;http://www.w3.org/2000/svg&#39; width=&#39;160&#39; height=&#39;160&#39;&gt;&lt;filter id=&#39;n&#39;&gt;&lt;feTurbulence type=&#39;fractalNoise&#39; baseFrequency=&#39;0.85&#39; numOctaves=&#39;3&#39;/&gt;&lt;/filter&gt;&lt;rect width=&#39;160&#39; height=&#39;160&#39; filter=&#39;url(%23n)&#39;/&gt;&lt;/svg&gt;&quot;);"></div>', 3)
    ])]));
  }
}), h8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, IS = /* @__PURE__ */ L({
  __name: "PkConsoleBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", h8, [...a[0] || (a[0] = [
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
}), b8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, ES = /* @__PURE__ */ L({
  __name: "PkStudioBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", b8, [...a[0] || (a[0] = [
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
J4();
const FS = "0.0.1";
export {
  bn as ACTION_KEY_ICONS,
  Gt as APPEARANCE_STYLE_ID,
  am as Alert,
  lm as AlertDescription,
  om as AlertTitle,
  F6 as AppPageFooter,
  nC as AppearanceDrawer,
  n6 as Avatar,
  a6 as AvatarFallback,
  l6 as AvatarImage,
  dn as BADGE_VARIANTS,
  J8 as BadgeResolver,
  Z6 as BarChart,
  o6 as Breadcrumb,
  s6 as BreadcrumbEllipsis,
  r6 as BreadcrumbItem,
  i6 as BreadcrumbLink,
  d6 as BreadcrumbList,
  u6 as BreadcrumbPage,
  c6 as BreadcrumbSeparator,
  L8 as BulkActions,
  aa as CATALOGUE_CONTAINER,
  um as CATALOGUE_GRID,
  uC as CATALOGUE_GRID_TIGHT,
  cm as CATALOGUE_GRID_TILES,
  _6 as Card,
  P6 as CardAction,
  L6 as CardContent,
  O6 as CardDescription,
  j6 as CardFooter,
  V6 as CardHeader,
  D6 as CardTitle,
  $2 as CartPanel,
  cS as CatalogBrowser,
  Xy as CatalogCard,
  ua as CatalogFilterSheet,
  mn as CatalogGrid,
  dS as CatalogInspect,
  $k as CatalogItemDetail,
  uS as CatalogItemView,
  fS as CatalogRegister,
  iS as CatalogTill,
  Tb as ChartCard,
  bt as ChartTooltip,
  ci as Checkbox,
  H8 as CheckboxCell,
  K8 as CodeCell,
  Au as ColourCell,
  eS as ComboChart,
  mi as CreateOptionDialog,
  si as CreateOptionError,
  pS as DASHBOARD_HIDDEN_STORAGE_KEY,
  a$ as DASHBOARD_HIDE_KEY,
  vS as DashboardShortcuts,
  ho as DataTable,
  y6 as Dialog,
  x6 as DialogClose,
  k6 as DialogContent,
  $6 as DialogDescription,
  w6 as DialogFooter,
  C6 as DialogHeader,
  Rm as DialogOverlay,
  S6 as DialogScrollContent,
  M6 as DialogTitle,
  B6 as DialogTrigger,
  RC as DropdownMenu,
  UC as DropdownMenuCheckboxItem,
  HC as DropdownMenuContent,
  KC as DropdownMenuGroup,
  qC as DropdownMenuItem,
  GC as DropdownMenuLabel,
  US as DropdownMenuPortal,
  WC as DropdownMenuRadioGroup,
  ZC as DropdownMenuRadioItem,
  JC as DropdownMenuSeparator,
  YC as DropdownMenuShortcut,
  QC as DropdownMenuSub,
  XC as DropdownMenuSubContent,
  e6 as DropdownMenuSubTrigger,
  t6 as DropdownMenuTrigger,
  W8 as EditableCell,
  Be as FOCUS_RING,
  O8 as FOCUS_RING_SOFT,
  xn as FOCUS_RING_WITHIN,
  bo as FORM_MEASURE,
  We as FormFieldControl,
  tS as HeatmapChart,
  kl as ICON_ALIASES,
  $t as ICON_PATHS,
  He as INPUT_COPY,
  ui as INPUT_PLACEHOLDER,
  di as INPUT_TEXT,
  bu as IconCell,
  wu as ImageCell,
  zS as InfoNode,
  Y8 as InlineRecordActions,
  pm as JPEG_IMAGE_ERROR,
  q8 as KeyValueCell,
  A6 as Label,
  eh as LineChart,
  n2 as LineItems,
  _8 as MODAL_PANEL,
  P8 as MODAL_PANEL_FORM,
  St as MODAL_WIDTH,
  E8 as MUTED_COPY,
  kt as MUTED_COPY_SNUG,
  F8 as MUTED_COPY_XS,
  _t as MiniStatCard,
  f6 as NavigationMenu,
  m6 as NavigationMenuContent,
  p6 as NavigationMenuIndicator,
  v6 as NavigationMenuItem,
  g6 as NavigationMenuLink,
  h6 as NavigationMenuList,
  b6 as NavigationMenuTrigger,
  Fm as NavigationMenuViewport,
  mm as OPAQUE_IMAGE_ERROR,
  Un as OVERLAY_FORM_MEASURE,
  lt as PAGE_SHELL,
  A8 as PAGE_SHELL_COMPACT,
  z8 as PAGE_SHELL_STACK,
  _S as PaymentGatewaySettings,
  r4 as PaymentGateways,
  J6 as PieChart,
  iC as PkAlertError,
  r5 as PkArticles,
  DS as PkAuroraBackdrop,
  Ie as PkBadge,
  og as PkBarcode,
  v5 as PkBento,
  aC as PkBottomNav,
  T6 as PkBoundary,
  H6 as PkBuilder,
  ce as PkButton,
  K6 as PkCalendar,
  I6 as PkCard,
  wv as PkCheckboxList,
  ia as PkCodeBox,
  sv as PkCodeInput,
  Rv as PkColourPicker,
  IS as PkConsoleBackdrop,
  M5 as PkContact,
  T3 as PkCountUp,
  P5 as PkCta,
  N6 as PkDeviceFrame,
  ig as PkDiff,
  m1 as PkDocument,
  Ke as PkDropdown,
  TS as PkEditorialBackdrop,
  Ut as PkEmptyState,
  D5 as PkFaq,
  N5 as PkFeatureGrid,
  _e as PkFieldLabel,
  Kn as PkFileUpload,
  Ee as PkHeading,
  Z5 as PkHero,
  Ni as PkKeyValue,
  VS as PkLandingSections,
  X5 as PkLogoCloud,
  Hv as PkMap,
  Gv as PkMapField,
  Xp as PkMarkdownInput,
  l3 as PkMarquee,
  mt as PkModal,
  on as PkMultiSelect,
  sC as PkOtpInput,
  rC as PkPageHeader,
  $S as PkPasskeyRegister,
  dC as PkPasswordInput,
  k3 as PkPricing,
  Qv as PkQrCode,
  K0 as PkQtyStepper,
  Bs as PkQueryBuilder,
  xv as PkRadioGroup,
  U6 as PkRepeater,
  Y4 as PkReveal,
  Yi as PkRichEditor,
  Se as PkSection,
  je as PkSectionHeading,
  R6 as PkSetupWizardCompletion,
  D3 as PkShowcase,
  Tk as PkSignaturePad,
  Pe as PkSkeleton,
  Lt as PkSlideover,
  kg as PkSlider,
  oC as PkSpinner,
  R3 as PkStats,
  $e as PkStatusBadge,
  ni as PkStepIndicator,
  W3 as PkSteps,
  ES as PkStudioBackdrop,
  lC as PkSubNav,
  Dg as PkSwatchPreview,
  _v as PkTagsInput,
  a8 as PkTeam,
  p8 as PkTestimonials,
  we as PkTextInput,
  u5 as PkTiltCard,
  qn as PkToggleButtons,
  jg as PkVisualSelect,
  Mx as PlanCard,
  sS as PlanEditor,
  oS as PlanGrid,
  rS as PlanPurchaseCard,
  X6 as PolarAreaChart,
  Q6 as RadarChart,
  U8 as RatingCell,
  gc as RecordActions,
  wS as RecordForm,
  R8 as RelationCreateDialog,
  V8 as RelationPanel,
  yo as SLIDEOVER_BODY,
  xo as SLIDEOVER_WIDTH,
  _y as STATUS_TONES,
  kS as SavedViews,
  Y6 as ScatterChart,
  Gn as SchemaNode,
  aS as SegmentedBar,
  bS as SelectionBar,
  Vm as Separator,
  hS as SetupChecklist,
  na as ShadcnInput,
  sn as Sheet,
  vC as SheetClose,
  rn as SheetContent,
  xm as SheetDescription,
  gC as SheetFooter,
  km as SheetHeader,
  $m as SheetTitle,
  hC as SheetTrigger,
  ny as ShortcutsWidget,
  bC as Sidebar,
  yC as SidebarContent,
  xC as SidebarFooter,
  kC as SidebarGroup,
  $C as SidebarGroupAction,
  wC as SidebarGroupContent,
  CC as SidebarGroupLabel,
  SC as SidebarHeader,
  MC as SidebarInput,
  BC as SidebarInset,
  AC as SidebarMenu,
  zC as SidebarMenuAction,
  _C as SidebarMenuBadge,
  LC as SidebarMenuButton,
  OC as SidebarMenuItem,
  jC as SidebarMenuSkeleton,
  VC as SidebarMenuSub,
  DC as SidebarMenuSubButton,
  TC as SidebarMenuSubItem,
  IC as SidebarProvider,
  EC as SidebarRail,
  FC as SidebarSeparator,
  NC as SidebarTrigger,
  mS as SignatureStudio,
  jt as Sparkline,
  z6 as Spinner,
  nS as StatCard,
  lS as StatListChart,
  gS as StatStrip,
  Je as Switch,
  la as TRANSPARENT_IMAGE_HELP,
  yS as TablePagination,
  ns as TableShell,
  xS as TableTabs,
  Or as TableToolbar,
  G8 as TagsCell,
  W6 as ThemeToggle,
  Lm as Tooltip,
  Om as TooltipContent,
  PC as TooltipProvider,
  jm as TooltipTrigger,
  da as TrendBadge,
  CS as UnsavedBar,
  Xu as actionColorTone,
  sm as alertVariants,
  Tc as appearancePayload,
  Yn as appearanceVars,
  Wt as applyAppearance,
  ym as assertTransparentImage,
  X8 as bootstrapAppearance,
  Ye as buttonClasses,
  Pt as catalogFiltersActive,
  oe as cn,
  ii as createOptionActionLabel,
  ri as createOptionTitle,
  ex as cycleLabel,
  Fe as emptyCatalogFilters,
  Sw as entryView,
  oi as fieldControl,
  N8 as fieldErrorsFromPayload,
  S2 as findExactSku,
  tx as formatPerkValue,
  Uu as hasBadgeValue,
  BS as hasEntryView,
  D8 as hasFieldControl,
  q6 as hasOptionPreview,
  me as iconPath,
  hm as imageHasTransparency,
  Qn as initializeAppearance,
  cn as isDark,
  pn as matchCatalogItem,
  mC as mergeLayoutItems,
  Nm as navigationMenuTriggerStyle,
  $g as optionPreview,
  cC as packWidgetColumns,
  fC as parseWidgetId,
  nx as perkGranted,
  fn as readAppearance,
  Ic as readServerAppearance,
  J4 as registerBuiltInFieldControls,
  MS as registerEntryView,
  xe as registerFieldControl,
  Et as registerOptionPreview,
  Mw as registeredEntryViews,
  T8 as registeredFieldTypes,
  wg as registeredOptionPreviews,
  Q8 as resetAppearanceBootstrapForTests,
  AS as resetEntryViews,
  I8 as resetFieldControls,
  G6 as resetOptionPreviews,
  Te as resolveActionIcon,
  tC as setAppearancePersister,
  Dm as sidebarMenuButtonVariants,
  jy as statusBadgeVariant,
  Oy as statusTone,
  eC as syncAppearanceFromInertiaPage,
  pC as toPersistedLayout,
  j8 as toUrl,
  ta as useAppearance,
  PS as useColumnVisibility,
  LS as useColumnWidths,
  OS as useLiveUpdates,
  i5 as usePointer,
  ca as useReveal,
  Z8 as useSchemaColumns,
  $3 as useScrollProgress,
  E6 as useShellPageFooter,
  Ot as useSidebar,
  jS as useTenantTheme,
  SS as useUnsavedChanges,
  FS as version,
  Cn as widgetId
};
//# sourceMappingURL=index.js.map

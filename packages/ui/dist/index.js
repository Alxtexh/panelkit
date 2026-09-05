import './ui.css';
import { defineComponent as L, useSlots as Yt, openBlock as t, createElementBlock as n, normalizeClass as A, unref as x, renderSlot as q, createElementVNode as l, toDisplayString as c, createCommentVNode as b, computed as y, normalizeStyle as ie, Fragment as z, renderList as j, ref as H, watch as pe, useId as Xe, withModifiers as he, createTextVNode as U, createVNode as I, createStaticVNode as dt, createBlock as D, createSlots as ut, withCtx as O, nextTick as De, onBeforeUnmount as ke, Teleport as mt, Transition as et, onMounted as be, withDirectives as ge, vModelText as _e, mergeProps as de, normalizeProps as Le, guardReactiveProps as Ne, resolveDynamicComponent as Ce, resolveComponent as Qt, vModelSelect as Ze, vModelDynamic as va, defineAsyncComponent as hn, inject as $t, vShow as qe, withKeys as Ft, onUnmounted as ga, isRef as ha, useTemplateRef as ba, onErrorCaptured as ya, provide as Nt, reactive as ct, useModel as pt, mergeModels as Fe, markRaw as xa, shallowRef as ka, getCurrentInstance as On, watchEffect as $a } from "vue";
import { useForwardPropsEmits as ye, DialogRoot as jn, DialogOverlay as Xt, DialogPortal as en, DialogContent as tn, DialogClose as tt, CheckboxRoot as wa, CheckboxIndicator as Ca, SwitchRoot as Sa, SwitchThumb as Ma, DialogDescription as Vn, DialogTitle as Dn, DialogTrigger as Tn, createContext as Ba, Primitive as nt, TooltipRoot as Aa, TooltipPortal as _a, TooltipContent as za, TooltipArrow as Pa, TooltipProvider as In, TooltipTrigger as La, Separator as Oa, DropdownMenuRoot as ja, DropdownMenuCheckboxItem as Va, DropdownMenuItemIndicator as En, DropdownMenuPortal as Da, DropdownMenuContent as Ta, DropdownMenuGroup as Ia, useForwardProps as Oe, DropdownMenuItem as Ea, DropdownMenuLabel as Fa, DropdownMenuRadioGroup as Na, DropdownMenuRadioItem as Ra, DropdownMenuSeparator as Ua, DropdownMenuSub as Ha, DropdownMenuSubContent as qa, DropdownMenuSubTrigger as Ka, DropdownMenuTrigger as Ga, AvatarRoot as Wa, AvatarFallback as Za, AvatarImage as Ja, NavigationMenuViewport as Ya, NavigationMenuRoot as Qa, NavigationMenuContent as Xa, NavigationMenuIndicator as el, NavigationMenuItem as tl, NavigationMenuLink as nl, NavigationMenuList as al, NavigationMenuTrigger as ll, Label as ol } from "reka-ui";
import { DropdownMenuPortal as jS } from "reka-ui";
import { X as nn, Check as Fn, AlertCircle as sl, EyeOff as rl, Eye as il, PanelLeftOpen as dl, PanelLeftClose as ul, Circle as cl, ChevronRight as Nn, MoreHorizontal as fl, ChevronDown as ml, Loader2Icon as pl } from "@lucide/vue";
import { reactiveOmit as ve, useVModel as Rn, useMediaQuery as vl, useEventListener as gl, defaultDocument as hl } from "@vueuse/core";
import { clsx as bl } from "clsx";
import { twMerge as yl } from "tailwind-merge";
import { usePage as an, Link as Rt } from "@inertiajs/vue3";
import { cva as ln } from "class-variance-authority";
const kt = {
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
    return kt.dot;
  const o = xl[e] ?? e;
  return kt[o] ?? kt.dot;
}
function Te(e) {
  if (e.icon) {
    const s = me(e.icon);
    if (s !== kt.dot || e.icon === "dot")
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
      class: A(["text-muted-foreground flex flex-col items-center justify-center text-center", e.compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-12"]),
      role: "status"
    }, [
      x(o).illustration ? (t(), n("div", $l, [
        q(a.$slots, "illustration")
      ])) : (t(), n("div", {
        key: 1,
        class: A(["bg-muted text-muted-foreground flex items-center justify-center rounded-full", e.compact ? "size-10" : "size-12"]),
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
            class: A(e.compact ? "size-5" : "size-6")
          }, [
            l("path", {
              d: x(me)(e.icon)
            }, null, 8, wl)
          ], 2))
        ])
      ], 2)),
      l("div", Cl, [
        l("p", {
          class: A(["text-foreground font-medium", e.compact ? "text-sm" : "text-base"])
        }, c(e.title), 3),
        e.description ? (t(), n("p", Sl, c(e.description), 1)) : b("", !0)
      ]),
      a.$slots.actions ? (t(), n("div", Ml, [
        q(a.$slots, "actions")
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
      (t(!0), n(z, null, j(s.value, (f) => (t(), n("span", {
        key: f,
        "aria-hidden": "true",
        class: A(["bg-muted motion-safe:animate-pulse rounded", r.value]),
        style: ie({
          width: i(f - 1),
          height: e.height && e.variant === "block" ? `${e.height}px` : void 0
        })
      }, null, 6))), 128))
    ], 12, Bl));
  }
}), Al = { class: "w-full border-collapse text-sm" }, _l = { class: "bg-background sticky top-0 z-10" }, zl = {
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
    const d = H(/* @__PURE__ */ new Set()), u = H(/* @__PURE__ */ new Set());
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
    function p(ee) {
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
    const h = H(null), $ = H(null);
    function k(ee, re) {
      h.value = ee, re.dataTransfer?.setData("text/plain", String(ee)), re.dataTransfer && (re.dataTransfer.effectAllowed = "move");
    }
    function S() {
      h.value = null, $.value = null;
    }
    function w(ee) {
      return h.value === null || $.value !== ee ? "" : h.value > ee ? "border-primary border-t-2" : "border-primary border-b-2";
    }
    function C(ee, re) {
      h.value !== null && (re.preventDefault(), $.value = ee);
    }
    function B(ee) {
      const re = h.value;
      if (h.value = null, $.value = null, re === null || re === ee)
        return;
      const ae = a.rows.map((ue) => ue[a.rowKey]), [fe] = ae.splice(re, 1);
      ae.splice(ee, 0, fe), M("reorder", ae);
    }
    const M = o;
    function m(ee, re) {
      !a.rowClickable || a.reordering || re.button !== 0 || re.metaKey || re.ctrlKey || re.shiftKey || re.altKey || re.target?.closest('a, button, input, select, textarea, label, [role="menuitem"]') || (window.getSelection()?.toString().length ?? 0) > 0 || M("row-click", ee);
    }
    const g = H(null), _ = Xe(), T = y(() => a.columns.filter((ee) => !a.hidden?.has(ee.key))), F = y(() => {
      const ee = T.value.find((re) => re.sticky);
      return ee ? ee.key : a.stickyFirst && T.value.length > 0 ? T.value[0].key : null;
    });
    function Z(ee) {
      return F.value === ee.key;
    }
    function G() {
      return a.selectable && !a.reordering ? `${po}px` : "0";
    }
    function X(ee) {
      const re = a.columnWidths?.[ee.key];
      return typeof re == "number" ? re : ee.width;
    }
    function W(ee) {
      const re = X(ee), ae = Z(ee), fe = {};
      return re !== void 0 && (fe.width = `${re}px`, fe.minWidth = `${re}px`, fe.maxWidth = `${re}px`), ae && (fe.left = G()), Object.keys(fe).length ? fe : void 0;
    }
    function K(ee) {
      return a.resizable ? ee.resizable !== !1 : !1;
    }
    function N(ee, re) {
      if (!K(ee))
        return;
      re.preventDefault(), re.stopPropagation();
      const ae = re.clientX, fe = X(ee) ?? 160, ue = re.currentTarget;
      try {
        ue.setPointerCapture(re.pointerId);
      } catch {
      }
      function Ke(ot) {
        const jt = fe + (ot.clientX - ae);
        M("resize", ee.key, Math.min(1200, Math.max(48, jt)));
      }
      function Re(ot) {
        try {
          ue.releasePointerCapture(ot.pointerId);
        } catch {
        }
        ue.removeEventListener("pointermove", Ke), ue.removeEventListener("pointerup", Re), ue.removeEventListener("pointercancel", Re);
      }
      ue.addEventListener("pointermove", Ke), ue.addEventListener("pointerup", Re), ue.addEventListener("pointercancel", Re);
    }
    const R = y(() => T.value.some((ee) => !!ee.group)), Q = y(() => {
      const ee = [];
      for (const re of T.value) {
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
    const V = H(null);
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
        const Ke = E(V.value), Re = E(ae);
        if (Ke !== -1 && Re !== -1) {
          const ot = Math.min(Ke, Re), jt = Math.max(Ke, Re), pa = !ue;
          for (let yt = ot; yt <= jt; yt++) {
            if (!p(yt))
              continue;
            const Vt = P(a.rows[yt]);
            if (Vt === null)
              continue;
            !!a.selected?.has(Vt) !== pa && M("toggle-row", Vt);
          }
          V.value = ae;
          return;
        }
      }
      M("toggle-row", ae), V.value = ae;
    }
    const le = y(
      () => a.rows.map((ee) => P(ee)).filter((ee) => ee !== null)
    ), Y = y(
      () => le.value.length > 0 && le.value.every((ee) => a.selected?.has(ee))
    ), ne = y(
      () => !Y.value && le.value.some((ee) => a.selected?.has(ee))
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
      class: A(["pk-scroll relative min-h-0 w-full min-w-0 shrink grow-0 overflow-auto", e.framed ? "rounded-lg border" : ""])
    }, [
      l("table", Al, [
        l("thead", _l, [
          R.value ? (t(), n("tr", zl, [
            e.reordering ? (t(), n("th", Pl)) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("th", Ll)) : b("", !0),
            (t(!0), n(z, null, j(Q.value, (ae) => (t(), n("th", {
              key: ae.key,
              colspan: ae.span,
              class: "text-muted-foreground border-b px-3 py-1.5 text-left text-xs font-medium"
            }, c(ae.label ?? ""), 9, Ol))), 128)),
            ee.$slots.actions ? (t(), n("th", jl)) : b("", !0)
          ])) : b("", !0),
          l("tr", Vl, [
            e.reordering ? (t(), n("th", Dl)) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("th", {
              key: 1,
              class: A(["w-10 border-b px-3 py-2.5", F.value ? "bg-muted/50 sticky left-0 z-[11]" : ""])
            }, [
              l("input", {
                id: `${x(_)}-page`,
                type: "checkbox",
                class: "accent-primary size-3.5 cursor-pointer align-middle",
                checked: Y.value,
                indeterminate: ne.value,
                "aria-label": "Select all rows on this page",
                onClick: re[0] || (re[0] = he(() => {
                }, ["stop"])),
                onChange: re[1] || (re[1] = he((ae) => M("toggle-page", !Y.value), ["stop"]))
              }, null, 40, Tl)
            ], 2)) : b("", !0),
            (t(!0), n(z, null, j(T.value, (ae) => (t(), n("th", {
              key: ae.key,
              class: A([
                "text-muted-foreground relative border-b px-3 py-2.5 text-left font-medium whitespace-nowrap",
                Z(ae) ? "bg-muted/50 sticky z-[11] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)]" : ""
              ]),
              style: ie(W(ae))
            }, [
              ae.sortable ? (t(), n("button", {
                key: 0,
                class: "hover:text-foreground inline-flex items-center gap-1 transition-colors",
                onClick: (fe) => M("sort", se(ae))
              }, [
                U(c(ae.label) + " ", 1),
                Me(ae) ? (t(), n("span", El, c(e.direction === "desc" ? "↓" : "↑"), 1)) : (t(), n("span", Fl, "↕"))
              ], 8, Il)) : (t(), n("span", Nl, c(ae.label), 1)),
              K(ae) ? (t(), n("span", {
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
          (t(), n(z, null, j(6, (ae) => l("tr", {
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
            (t(!0), n(z, null, j(T.value, (fe) => (t(), n("td", {
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
          class: A(e.loading ? "opacity-50 transition-opacity" : "transition-opacity")
        }, [
          (t(!0), n(z, null, j(e.rows, (ae, fe) => (t(), n(z, {
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
                  "aria-expanded": !f(r(ae)),
                  dusk: `group-header-${r(ae) || "none"}`,
                  onClick: (ue) => v(r(ae))
                }, [
                  l("span", Yl, c(f(r(ae)) ? "▸" : "▾"), 1),
                  U(" " + c(i(ae)), 1)
                ], 8, Jl)) : (t(), n("span", Ql, c(i(ae)), 1))
              ], 8, Zl)
            ])) : b("", !0),
            p(fe) ? (t(), n("tr", {
              key: 1,
              "data-slot": "table-row",
              class: A(["group pk-row border-b transition-colors hover:bg-muted/50", [
                J(ae) ? "bg-primary/5 shadow-[inset_3px_0_0_0_var(--color-primary)]" : e.striped && fe % 2 === 1 ? "bg-muted/20" : "",
                h.value === fe ? "opacity-40" : "",
                w(fe),
                e.reordering ? "cursor-grab active:cursor-grabbing" : "",
                e.rowClickable && !e.reordering ? "cursor-pointer" : ""
              ]]),
              draggable: e.reordering,
              onDragstart: (ue) => k(fe, ue),
              onDragover: (ue) => C(fe, ue),
              onDrop: he((ue) => B(fe), ["prevent"]),
              onDragend: S,
              onContextmenu: (ue) => M("row-contextmenu", ae, ue),
              onClick: (ue) => m(ae, ue)
            }, [
              e.reordering ? (t(), n("td", eo, [...re[3] || (re[3] = [
                dt('<span class="text-muted-foreground/50 flex cursor-grab active:cursor-grabbing" aria-hidden="true" data-v-9654c938><svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-v-9654c938><circle cx="9" cy="6" r="1.5" data-v-9654c938></circle><circle cx="15" cy="6" r="1.5" data-v-9654c938></circle><circle cx="9" cy="12" r="1.5" data-v-9654c938></circle><circle cx="15" cy="12" r="1.5" data-v-9654c938></circle><circle cx="9" cy="18" r="1.5" data-v-9654c938></circle><circle cx="15" cy="18" r="1.5" data-v-9654c938></circle></svg></span>', 1)
              ])])) : b("", !0),
              e.selectable && !e.reordering ? (t(), n("td", {
                key: 1,
                class: A([
                  "px-3 py-2",
                  F.value ? "bg-background sticky left-0 z-[1] group-hover:bg-muted/50" : ""
                ])
              }, [
                l("input", {
                  id: `${x(_)}-row-${P(ae) ?? fe}`,
                  type: "checkbox",
                  class: "accent-primary size-3.5 cursor-pointer align-middle",
                  value: P(ae) ?? void 0,
                  checked: J(ae),
                  disabled: P(ae) === null,
                  "aria-label": P(ae) === null ? "This row has no id and cannot be selected" : `Select row ${P(ae)}`,
                  onClick: he((ue) => te(ae, ue), ["stop"])
                }, null, 8, to)
              ], 2)) : b("", !0),
              (t(!0), n(z, null, j(T.value, (ue) => (t(), n("td", {
                key: ue.key,
                class: A(["px-3 py-2 whitespace-nowrap", [
                  ue.cellClass,
                  Z(ue) ? "bg-background sticky z-[1] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)] group-hover:bg-muted/50" : ""
                ]]),
                style: ie(W(ue))
              }, [
                q(ee.$slots, `cell:${ue.key}`, {
                  row: ae,
                  value: ae[ue.key],
                  column: ue
                }, () => [
                  ue.copyable ? (t(), n("span", no, [
                    U(c(ae[ue.key]) + " ", 1),
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100",
                      "aria-label": `Copy ${ue.label.toLowerCase()}`,
                      onClick: (Ke) => vn(String(ae[e.rowKey]), ue, ae[ue.key])
                    }, [
                      l("span", lo, c(g.value === `${ae[e.rowKey]}-${ue.key}` ? "✓" : "⧉"), 1)
                    ], 8, ao)
                  ])) : ae[ue.key] == null || ae[ue.key] === "" ? (t(), n("span", oo, "None")) : (t(), n("span", so, c(ae[ue.key]), 1))
                ], !0)
              ], 6))), 128)),
              ee.$slots.actions ? (t(), n("td", ro, [
                q(ee.$slots, "actions", { row: ae }, void 0, !0)
              ])) : b("", !0)
            ], 42, Xl)) : b("", !0)
          ], 64))), 128))
        ], 2)),
        fa.value ? (t(), n("tfoot", io, [
          l("tr", null, [
            e.selectable ? (t(), n("td", uo)) : b("", !0),
            (t(!0), n(z, null, j(e.columns, (ae) => (t(), n(z, {
              key: `s-${ae.key}`
            }, [
              e.hidden?.has(ae.key) ? b("", !0) : (t(), n("td", {
                key: 0,
                class: A(["px-3 py-2 align-top text-sm whitespace-nowrap", ae.cellClass])
              }, [
                gn(ae.key) ? (t(), n(z, { key: 0 }, [
                  l("span", co, c(gn(ae.key).label), 1),
                  l("span", fo, c(ma(ae.key)), 1)
                ], 64)) : b("", !0)
              ], 2))
            ], 64))), 128)),
            ee.$slots.actions ? (t(), n("td", mo)) : b("", !0)
          ])
        ])) : b("", !0)
      ]),
      e.rows.length === 0 && !e.loading && e.filtered ? (t(), D(Ut, {
        key: 0,
        compact: "",
        icon: "search",
        title: "Nothing matches these filters",
        description: "Try clearing filters or searching for something else."
      }, ut({ _: 2 }, [
        ee.$slots["clear-filters"] ? {
          name: "actions",
          fn: O(() => [
            q(ee.$slots, "clear-filters", {}, void 0, !0)
          ]),
          key: "0"
        } : void 0
      ]), 1024)) : e.rows.length === 0 && !e.loading ? (t(), D(Ut, {
        key: 1,
        icon: e.emptyIcon,
        title: e.emptyTitle,
        description: e.emptyHint
      }, ut({ _: 2 }, [
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
}), zt = (e, o) => {
  const a = e.__vccOpts || e;
  for (const [r, s] of o)
    a[r] = s;
  return a;
}, go = /* @__PURE__ */ zt(vo, [["__scopeId", "data-v-9654c938"]]), at = "w-full min-w-0 px-4 py-6 sm:px-6", y8 = "w-full min-w-0 p-3 sm:p-4", x8 = "w-full min-w-0 space-y-6 px-4 py-6 sm:px-6", ho = "w-full max-w-7xl", bo = "px-4 py-4", Un = "w-full min-w-0", yo = {
  /** Filters, short lists (~24rem). */
  sm: "w-full max-w-sm",
  /** Notifications, inspect (~28rem). */
  md: "w-full max-w-md",
  /** Secondary action forms (~36rem). */
  lg: "w-full max-w-xl",
  /** Opt-in CRUD slide-over (~42rem). */
  xl: "w-full max-w-2xl"
}, st = "bg-popover text-popover-foreground flex w-full max-h-[min(85vh,720px)] flex-col overflow-hidden rounded-xl border shadow-2xl", wt = {
  /** Short confirmations with no fields (~24rem). */
  sm: `${st} max-w-md`,
  /** The long-standing default: confirmations and short copy (~32rem). */
  confirm: `${st} max-w-lg`,
  /** Wider than confirm when an action form needs more room than confirm copy (~36rem). */
  form: `${st} max-w-xl`,
  /** A field stack too wide for `form` without becoming a page (~42rem). */
  lg: `${st} max-w-2xl`,
  /** The widest dense modal offers - past this, use PkSlideover instead (~56rem). */
  xl: `${st} max-w-4xl`
}, k8 = wt.confirm, $8 = wt.form, it = /* @__PURE__ */ new Set();
let Ht = "";
function Hn(e) {
  typeof document > "u" || it.has(e) || (it.size === 0 && (Ht = document.body.style.overflow), it.add(e), document.body.style.overflow = "hidden");
}
function Ct(e) {
  return typeof document > "u" || !it.delete(e) ? !1 : it.size === 0 ? (document.body.style.overflow = Ht, Ht = "", !0) : !1;
}
const xo = ["aria-busy", "aria-describedby"], ko = { class: "bg-popover sticky top-0 z-10 shrink-0 border-b px-6 py-5" }, $o = {
  key: 0,
  "data-slot": "modal-footer",
  class: "bg-muted/30 sticky bottom-0 z-10 flex shrink-0 flex-wrap items-center justify-end gap-3 border-t px-6 py-4 [&>[data-slot='button']]:min-h-10 [&>[data-slot='button']]:min-w-20 [&>[data-slot='button']]:px-4 [&>[data-slot='button'][data-variant='destructive']]:min-w-24"
}, ft = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(null), i = `pk-modal-title-${Xe()}`, d = `pk-modal-description-${Xe()}`, u = /* @__PURE__ */ Symbol("pk-modal");
    let f = null, v = !1;
    const p = H(!1), h = y(() => wt[a.size] ?? wt.confirm);
    function $(w) {
      p.value = w.target === w.currentTarget;
    }
    function k(w) {
      p.value && w.target === w.currentTarget && !a.busy && r("close"), p.value = !1;
    }
    function S(w) {
      if (!a.open)
        return;
      if (w.key === "Escape" && !a.busy) {
        w.stopPropagation(), r("close");
        return;
      }
      if (w.key !== "Tab" || !s.value)
        return;
      const C = s.value.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (C.length === 0)
        return;
      const B = C[0], M = C[C.length - 1];
      w.shiftKey && document.activeElement === B ? (w.preventDefault(), M.focus()) : !w.shiftKey && document.activeElement === M && (w.preventDefault(), B.focus());
    }
    return pe(
      () => a.open,
      (w) => {
        if (w)
          f = document.activeElement, Hn(u), v = !0, document.addEventListener("keydown", S), De(
            () => s.value?.querySelector("input, select, textarea, button")?.focus()
          );
        else if (v) {
          const C = Ct(u);
          v = !1, document.removeEventListener("keydown", S), C && f?.focus(), f = null;
        }
      },
      { immediate: !0 }
    ), ke(() => {
      document.removeEventListener("keydown", S), v && (Ct(u), v = !1);
    }), (w, C) => (t(), D(mt, { to: "body" }, [
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
            onPointerdown: $,
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
              class: A(h.value)
            }, [
              l("div", ko, [
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
                class: A([
                  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5",
                  x(Un)
                ])
              }, [
                q(w.$slots, "default")
              ], 2),
              w.$slots.footer ? (t(), n("div", $o, [
                q(w.$slots, "footer")
              ])) : b("", !0)
            ], 10, xo)
          ], 32)) : b("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), wo = 160, He = /* @__PURE__ */ L({
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
    const a = e, r = H(!1), s = H(null), i = H(null), d = H({ top: 0, left: 0, minWidth: 0 }), u = H(null);
    let f = null;
    function v(m) {
      !a.dismissOnPanelClick || m.target?.closest("input, select, textarea, label, [data-keep-open]") || S();
    }
    async function p() {
      f && (clearTimeout(f), f = null), !r.value && (r.value = !0, await De(), w());
    }
    function h() {
      f = setTimeout(S, 180);
    }
    async function $() {
      u.value = null, r.value = !r.value, r.value && (await De(), w());
    }
    async function k(m, g) {
      u.value = { x: m, y: g }, r.value = !0, await De(), w();
    }
    function S() {
      r.value = !1, u.value = null;
    }
    function w() {
      const m = s.value, g = i.value;
      if (!m || !g)
        return;
      const _ = g.getBoundingClientRect(), T = 8, F = u.value ? new DOMRect(u.value.x, u.value.y, 0, 0) : m.getBoundingClientRect();
      let Z, G;
      if (a.placement === "bottom")
        Z = F.bottom + a.offset, Z + _.height > window.innerHeight - T && F.top - _.height - a.offset > T && (Z = F.top - _.height - a.offset), G = a.align === "end" && !u.value ? F.right - _.width : F.left;
      else {
        Z = F.top;
        const X = a.placement === "right", W = F.right + a.offset + _.width < window.innerWidth - T, K = F.left - a.offset - _.width > T;
        G = (X ? W || !K : !K && W) ? F.right + a.offset : F.left - a.offset - _.width;
      }
      G = Math.min(Math.max(T, G), window.innerWidth - _.width - T), Z = Math.min(Math.max(T, Z), window.innerHeight - _.height - T), d.value = { top: Z, left: G, minWidth: Math.max(F.width, wo) };
    }
    function C(m) {
      if (!r.value)
        return;
      const g = m.target;
      s.value?.contains(g) || i.value?.contains(g) || (g instanceof Element ? g : g.parentElement)?.closest("[data-pk-overlay]") || S();
    }
    function B(m) {
      m.key === "Escape" && r.value && (m.stopPropagation(), S());
    }
    function M() {
      if (r.value) {
        if (u.value) {
          S();
          return;
        }
        w();
      }
    }
    return be(() => {
      document.addEventListener("pointerdown", C), document.addEventListener("keydown", B), window.addEventListener("scroll", M, !0), window.addEventListener("resize", M);
    }), ke(() => {
      f && clearTimeout(f), document.removeEventListener("pointerdown", C), document.removeEventListener("keydown", B), window.removeEventListener("scroll", M, !0), window.removeEventListener("resize", M);
    }), o({ close: S, openAt: k }), (m, g) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "relative",
      onPointerenter: g[3] || (g[3] = (_) => e.hoverable && p()),
      onPointerleave: g[4] || (g[4] = (_) => e.hoverable && h())
    }, [
      l("div", {
        onClick: g[0] || (g[0] = (_) => e.hoverable ? p() : $())
      }, [
        q(m.$slots, "trigger", { open: r.value })
      ]),
      (t(), D(mt, { to: "body" }, [
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
              class: A([
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
              onPointerenter: g[1] || (g[1] = (_) => e.hoverable && p()),
              onPointerleave: g[2] || (g[2] = (_) => e.hoverable && h()),
              onClick: v
            }, [
              q(m.$slots, "panel", { close: S })
            ], 38)) : b("", !0)
          ]),
          _: 3
        })
      ]))
    ], 544));
  }
}), Co = ["disabled"], So = { class: "py-0.5" }, Mo = ["disabled", "onClick"], Bo = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Ao = ["d"], _o = { class: "min-w-0 flex-1 truncate" }, zo = ["disabled"], Po = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Lo = ["d"], Oo = {
  key: 1,
  class: "mt-0.5 border-t pt-0.5"
}, jo = ["disabled", "onClick"], Vo = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Do = ["d"], To = { class: "min-w-0 flex-1 truncate" }, Io = { class: "text-muted-foreground text-sm font-normal" }, Eo = { class: "text-foreground font-medium tabular-nums" }, Fo = {
  key: 0,
  class: "text-destructive mt-1 text-xs"
}, No = ["disabled"], Ro = { class: "text-muted-foreground text-sm font-normal" }, Uo = { class: "text-foreground font-medium tabular-nums" }, Ho = {
  key: 0,
  class: "text-destructive mt-1 text-xs"
}, qo = ["disabled"], w8 = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(null), i = H(!1), d = y(() => a.allMatching ? a.total : a.count), u = y(() => d.value !== void 0), f = y(() => u.value && d.value === 0), v = y(() => a.actions.filter((B) => !B.destructive)), p = y(() => a.actions.filter((B) => B.destructive)), h = {
      primary: "text-primary",
      gray: "text-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-500",
      danger: "text-destructive",
      info: "text-sky-600 dark:text-sky-400"
    };
    function $(B) {
      return h[B.color ?? "gray"] ?? h.gray;
    }
    function k(B) {
      if (B.confirmation) {
        s.value = B;
        return;
      }
      r("run", B.key);
    }
    function S() {
      s.value && r("run", s.value.key), s.value = null;
    }
    function w() {
      i.value = !1, r("export");
    }
    const C = (B) => new Intl.NumberFormat().format(B);
    return (B, M) => (t(), n(z, null, [
      I(He, null, {
        trigger: O(() => [
          l("button", {
            type: "button",
            class: "bg-background hover:bg-accent inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
            disabled: e.busy,
            "aria-haspopup": "menu"
          }, [...M[5] || (M[5] = [
            U(" Bulk actions ", -1),
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
          ])], 8, Co)
        ]),
        panel: O(() => [
          l("div", So, [
            (t(!0), n(z, null, j(v.value, (m) => (t(), n("button", {
              key: m.key,
              type: "button",
              role: "menuitem",
              class: A(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50", $(m)]),
              disabled: e.busy,
              onClick: (g) => k(m)
            }, [
              (t(), n("svg", Bo, [
                l("path", {
                  d: x(Te)(m)
                }, null, 8, Ao)
              ])),
              l("span", _o, c(m.label), 1)
            ], 10, Mo))), 128)),
            e.canExport ? (t(), n("button", {
              key: 0,
              type: "button",
              role: "menuitem",
              class: "text-foreground hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              disabled: e.busy,
              onClick: M[0] || (M[0] = (m) => i.value = !0)
            }, [
              (t(), n("svg", Po, [
                l("path", {
                  d: x(me)("download")
                }, null, 8, Lo)
              ])),
              M[6] || (M[6] = U(" Export CSV ", -1))
            ], 8, zo)) : b("", !0),
            p.value.length ? (t(), n("div", Oo, [
              (t(!0), n(z, null, j(p.value, (m) => (t(), n("button", {
                key: m.key,
                type: "button",
                role: "menuitem",
                class: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                disabled: e.busy,
                onClick: (g) => k(m)
              }, [
                (t(), n("svg", Vo, [
                  l("path", {
                    d: x(Te)({ ...m, destructive: !0 })
                  }, null, 8, Do)
                ])),
                l("span", To, c(m.label), 1)
              ], 8, jo))), 128))
            ])) : b("", !0)
          ])
        ]),
        _: 1
      }),
      I(ft, {
        open: s.value !== null,
        title: s.value?.label ?? "",
        description: s.value?.confirmation ?? "",
        onClose: M[2] || (M[2] = (m) => s.value = null)
      }, {
        footer: O(() => [
          l("button", {
            type: "button",
            class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm",
            onClick: M[1] || (M[1] = (m) => s.value = null)
          }, " Cancel "),
          l("button", {
            type: "button",
            class: A([
              "rounded-md px-3 py-1.5 text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
              s.value?.destructive ? "bg-destructive text-white hover:opacity-90" : "bg-primary text-primary-foreground hover:opacity-90"
            ]),
            disabled: !u.value || f.value,
            onClick: S
          }, c(s.value?.label), 11, No)
        ]),
        default: O(() => [
          l("p", Io, [
            M[7] || (M[7] = U(" This will affect ", -1)),
            l("span", Eo, [
              u.value ? (t(), n(z, { key: 1 }, [
                U(c(C(d.value)) + " record" + c(d.value === 1 ? "" : "s"), 1)
              ], 64)) : (t(), n(z, { key: 0 }, [
                U("…")
              ], 64))
            ]),
            M[8] || (M[8] = U(" . ", -1))
          ]),
          f.value ? (t(), n("p", Fo, " Nothing matches the current filters - there is nothing to " + c(s.value?.label?.toLowerCase()) + ". ", 1)) : b("", !0)
        ]),
        _: 1
      }, 8, ["open", "title", "description"]),
      I(ft, {
        open: i.value,
        title: "Export CSV",
        description: "A download link appears once the file is ready.",
        onClose: M[4] || (M[4] = (m) => i.value = !1)
      }, {
        footer: O(() => [
          l("button", {
            type: "button",
            class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm",
            onClick: M[3] || (M[3] = (m) => i.value = !1)
          }, " Cancel "),
          l("button", {
            type: "button",
            class: "bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
            disabled: !u.value || f.value,
            onClick: w
          }, " Export CSV ", 8, qo)
        ]),
        default: O(() => [
          l("p", Ro, [
            M[9] || (M[9] = U(" This will export ", -1)),
            l("span", Uo, [
              u.value ? (t(), n(z, { key: 1 }, [
                U(c(C(d.value)) + " record" + c(d.value === 1 ? "" : "s"), 1)
              ], 64)) : (t(), n(z, { key: 0 }, [
                U("…")
              ], 64))
            ]),
            M[10] || (M[10] = U(". ", -1))
          ]),
          f.value ? (t(), n("p", Ho, " Nothing matches the current filters - there is nothing to export. ")) : b("", !0)
        ]),
        _: 1
      }, 8, ["open"])
    ], 64));
  }
}), Ko = { class: "pk-surface flex min-h-0 w-full min-w-0 shrink grow-0 flex-col overflow-hidden rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.04),0_14px_32px_-24px_rgb(0_0_0/0.28)]" }, Go = {
  key: 0,
  class: "shrink-0 border-b px-3 py-2.5 sm:px-4"
}, Wo = {
  key: 1,
  class: "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4"
}, Zo = {
  key: 3,
  class: "shrink-0 border-t px-3 py-2.5 sm:px-4"
}, Jo = /* @__PURE__ */ L({
  __name: "TableShell",
  props: {
    toolbarTint: { default: "none" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", Ko, [
      o.$slots.tabs ? (t(), n("div", Go, [
        q(o.$slots, "tabs")
      ])) : b("", !0),
      o.$slots.title ? (t(), n("div", Wo, [
        q(o.$slots, "title")
      ])) : b("", !0),
      o.$slots.toolbar ? (t(), n("div", {
        key: 2,
        class: A(["shrink-0 border-b px-3 py-2.5 sm:px-4", e.toolbarTint === "muted" ? "bg-muted/40" : ""])
      }, [
        q(o.$slots, "toolbar")
      ], 2)) : b("", !0),
      q(o.$slots, "default"),
      o.$slots.pagination ? (t(), n("div", Zo, [
        q(o.$slots, "pagination")
      ])) : b("", !0)
    ]));
  }
}), Be = "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", xn = "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]", C8 = "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]", Yo = ["aria-expanded", "aria-activedescendant"], Qo = ["aria-label", "onClick"], Xo = {
  key: 0,
  class: "text-muted-foreground flex-1 text-sm"
}, es = { class: "ml-auto flex shrink-0 items-center gap-1" }, ts = {
  key: 0,
  class: "border-b p-1"
}, ns = ["placeholder"], as = { class: "max-h-60 overflow-y-auto p-1" }, ls = ["id", "onMouseenter", "onClick"], os = {
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
    const a = e, r = o, s = H(null), i = H(null), d = H(null), u = `pk-multi-select-${Xe()}`, f = H(!1), v = H(""), p = H(0), h = H({ top: 0, left: 0, width: 0 }), $ = y(
      () => a.modelValue.map(
        (W) => a.options.find((K) => K.value === W) ?? {
          value: W,
          label: String(W)
        }
      ).filter(Boolean)
    ), k = y(() => a.searchable ?? a.options.length > 6), S = y(() => {
      const W = new Set(a.modelValue), K = v.value.trim().toLowerCase();
      return a.options.filter((N) => !W.has(N.value)).filter((N) => K ? N.label.toLowerCase().includes(K) : !0);
    }), w = y(() => a.max !== null && a.modelValue.length >= a.max);
    function C() {
      const W = s.value, K = i.value;
      if (!W || !K)
        return;
      const N = W.getBoundingClientRect(), R = K.getBoundingClientRect(), Q = 8;
      let P = N.bottom + 4;
      P + R.height > window.innerHeight - Q && N.top - R.height - 4 > Q && (P = N.top - R.height - 4), h.value = {
        top: P,
        left: Math.min(Math.max(Q, N.left), window.innerWidth - N.width - Q),
        // Matching the trigger's width is what makes it read as one control
        // rather than as a menu that happens to be nearby.
        width: N.width
      };
    }
    async function B() {
      a.disabled || f.value || (f.value = !0, v.value = "", p.value = 0, await De(), C(), d.value?.focus());
    }
    function M() {
      f.value = !1, v.value = "";
    }
    function m() {
      f.value ? M() : B();
    }
    function g(W) {
      w.value || (r("update:modelValue", [...a.modelValue, W.value]), v.value = "", p.value = 0, De(() => {
        C(), d.value?.focus();
      }));
    }
    function _(W) {
      r(
        "update:modelValue",
        a.modelValue.filter((K) => K !== W)
      ), De(C);
    }
    function T() {
      r("update:modelValue", []), De(C);
    }
    function F(W) {
      if (!a.disabled) {
        if (W.key === "Escape" && f.value) {
          W.stopPropagation(), M();
          return;
        }
        if (W.key === "Backspace" && v.value === "" && a.modelValue.length > 0) {
          _(a.modelValue[a.modelValue.length - 1]);
          return;
        }
        if (!f.value && (W.key === "ArrowDown" || W.key === "Enter")) {
          W.preventDefault(), B();
          return;
        }
        if (f.value) {
          if (W.key === "ArrowDown")
            W.preventDefault(), p.value = Math.min(p.value + 1, S.value.length - 1);
          else if (W.key === "ArrowUp")
            W.preventDefault(), p.value = Math.max(p.value - 1, 0);
          else if (W.key === "Enter") {
            W.preventDefault();
            const K = S.value[p.value];
            K && g(K);
          }
        }
      }
    }
    function Z(W) {
      if (!f.value)
        return;
      const K = W.target;
      s.value?.contains(K) || i.value?.contains(K) || (K instanceof Element ? K : K.parentElement)?.closest("[data-pk-overlay]") || M();
    }
    function G(W) {
      return `${u}-option-${W}`;
    }
    function X() {
      f.value && C();
    }
    return pe(S, (W) => {
      p.value > W.length - 1 && (p.value = Math.max(0, W.length - 1));
    }), be(() => {
      document.addEventListener("pointerdown", Z), window.addEventListener("scroll", X, !0), window.addEventListener("resize", X);
    }), ke(() => {
      document.removeEventListener("pointerdown", Z), window.removeEventListener("scroll", X, !0), window.removeEventListener("resize", X);
    }), (W, K) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "relative w-full",
      onKeydown: F
    }, [
      l("div", {
        class: A(["bg-background flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors", [
          f.value ? "ring-ring border-ring ring-2" : "hover:border-ring/50",
          e.disabled ? "cursor-not-allowed opacity-50" : ""
        ]]),
        role: "combobox",
        "aria-expanded": f.value,
        "aria-controls": u,
        "aria-activedescendant": f.value && S.value[p.value] ? G(p.value) : void 0,
        "aria-haspopup": "listbox",
        tabindex: "0",
        onClick: m
      }, [
        (t(!0), n(z, null, j($.value, (N) => (t(), n("span", {
          key: N.value,
          class: "bg-primary/10 text-primary flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium"
        }, [
          U(c(N.label) + " ", 1),
          l("button", {
            type: "button",
            class: "hover:text-destructive -mr-0.5 leading-none",
            "aria-label": `Remove ${N.label}`,
            onClick: he((R) => _(N.value), ["stop"])
          }, [...K[1] || (K[1] = [
            l("svg", {
              viewBox: "0 0 24 24",
              class: "size-3",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "3"
            }, [
              l("path", { d: "M18 6 6 18M6 6l12 12" })
            ], -1)
          ])], 8, Qo)
        ]))), 128)),
        $.value.length === 0 ? (t(), n("span", Xo, c(e.placeholder), 1)) : b("", !0),
        l("span", es, [
          $.value.length > 1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground text-xs",
            "aria-label": "Clear all",
            onClick: he(T, ["stop"])
          }, " Clear ")) : b("", !0),
          (t(), n("svg", {
            viewBox: "0 0 24 24",
            class: A(["text-muted-foreground size-4 transition-transform", f.value ? "rotate-180" : ""]),
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "aria-hidden": "true"
          }, [...K[2] || (K[2] = [
            l("path", { d: "m6 9 6 6 6-6" }, null, -1)
          ])], 2))
        ])
      ], 10, Yo),
      (t(), D(mt, { to: "body" }, [
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
              k.value ? (t(), n("div", ts, [
                ge(l("input", {
                  ref_key: "searchInput",
                  ref: d,
                  "onUpdate:modelValue": K[0] || (K[0] = (N) => v.value = N),
                  type: "text",
                  class: "w-full bg-transparent px-2 py-1.5 text-sm outline-none",
                  placeholder: e.searchPlaceholder,
                  onKeydown: F
                }, null, 40, ns), [
                  [_e, v.value]
                ])
              ])) : b("", !0),
              l("div", as, [
                (t(!0), n(z, null, j(S.value, (N, R) => (t(), n("button", {
                  key: N.value,
                  id: G(R),
                  type: "button",
                  class: A(["flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors", R === p.value ? "bg-accent" : "hover:bg-accent/60"]),
                  role: "option",
                  "aria-selected": "false",
                  onMouseenter: (Q) => p.value = R,
                  onClick: (Q) => g(N)
                }, c(N.label), 43, ls))), 128)),
                S.value.length === 0 ? (t(), n("p", os, [
                  w.value ? (t(), n(z, { key: 0 }, [
                    U("You have selected the maximum.")
                  ], 64)) : v.value ? (t(), n(z, { key: 1 }, [
                    U("Nothing matches “" + c(v.value) + "”.", 1)
                  ], 64)) : (t(), n(z, { key: 2 }, [
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
    return (i, d) => (t(), D(x(jn), de({ "data-slot": "sheet" }, x(s)), {
      default: O((u) => [
        q(i.$slots, "default", Le(Ne(u)))
      ]),
      _: 3
    }, 16));
  }
});
function oe(...e) {
  return yl(bl(e));
}
function S8(e) {
  return typeof e == "string" ? e : e?.url ?? "";
}
const ss = /* @__PURE__ */ L({
  __name: "SheetOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), D(x(Xt), de({
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
    return (d, u) => (t(), D(x(en), null, {
      default: O(() => [
        I(ss),
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
            q(d.$slots, "default"),
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
}), rs = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", is = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline"
}, ds = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
  "icon-sm": "size-8",
  "icon-lg": "size-10"
};
function Ye(e = {}) {
  const o = e.variant ?? "default", a = e.size ?? "default";
  return [rs, is[o], ds[a], e.class].filter(Boolean).join(" ");
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
    return (s, i) => (t(), D(Ce(e.as), {
      "data-slot": "button",
      "data-variant": e.variant,
      "data-size": e.size,
      type: r.value,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.as !== "button" && e.disabled ? "true" : void 0,
      class: A(["pk-focus-ring", a.value])
    }, {
      default: O(() => [
        q(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["data-variant", "data-size", "type", "disabled", "aria-disabled", "class"]));
  }
}), us = { class: "flex items-center gap-2" }, cs = ["onUpdate:modelValue", "onChange"], fs = ["value"], ms = ["onUpdate:modelValue"], ps = ["value"], vs = ["onUpdate:modelValue"], gs = ["onUpdate:modelValue", "multiple"], hs = ["value"], bs = ["onUpdate:modelValue", "type"], ys = ["aria-label", "onClick"], xs = { class: "flex items-center gap-2" }, ks = /* @__PURE__ */ L({
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
    const a = e, r = o, s = () => ({ logic: "and", rules: [] }), i = H(a.modelValue ? structuredClone(a.modelValue) : s());
    pe(
      () => a.modelValue,
      (M) => {
        i.value = M ? structuredClone(M) : s();
      }
    );
    const d = (M) => "rules" in M, u = y(() => Object.keys(a.fields));
    function f(M) {
      const m = M ? a.fields[M]?.kind : void 0;
      return m ? a.operators[m] ?? [] : [];
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
    function p() {
      r("update:modelValue", i.value);
    }
    function h() {
      const M = u.value[0];
      i.value.rules.push({
        field: M,
        operator: f(M)[0],
        value: void 0
      }), p();
    }
    function $() {
      i.value.rules.push(s()), p();
    }
    function k(M) {
      i.value.rules.splice(M, 1), p();
    }
    function S(M) {
      M.operator = f(M.field)[0], M.value = void 0, p();
    }
    const w = y(() => a.depth + 1 < a.maxDepth);
    function C() {
      i.value = s(), p(), r("apply", null);
    }
    function B() {
      r("apply", i.value.rules.length ? i.value : null);
    }
    return (M, m) => {
      const g = Qt("PkQueryBuilder", !0);
      return t(), n("div", {
        class: A(["flex flex-col gap-2 rounded-lg border p-3", e.depth > 0 ? "bg-muted/30" : "bg-card"])
      }, [
        l("div", us, [
          ge(l("select", {
            "onUpdate:modelValue": m[0] || (m[0] = (_) => i.value.logic = _),
            class: "border-input bg-background rounded-md border px-2 py-1 text-xs",
            "aria-label": "Match all or any",
            onChange: p
          }, [...m[1] || (m[1] = [
            l("option", { value: "and" }, "Match all", -1),
            l("option", { value: "or" }, "Match any", -1)
          ])], 544), [
            [Ze, i.value.logic]
          ]),
          m[2] || (m[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "of the following", -1))
        ]),
        (t(!0), n(z, null, j(i.value.rules, (_, T) => (t(), n("div", {
          key: T,
          class: "flex items-start gap-2"
        }, [
          d(_) ? (t(), D(g, {
            key: 0,
            modelValue: i.value.rules[T],
            "onUpdate:modelValue": [(F) => i.value.rules[T] = F, p],
            fields: e.fields,
            operators: e.operators,
            "max-depth": e.maxDepth,
            depth: e.depth + 1,
            root: !1,
            class: "flex-1"
          }, null, 8, ["modelValue", "onUpdate:modelValue", "fields", "operators", "max-depth", "depth"])) : (t(), n(z, { key: 1 }, [
            ge(l("select", {
              "onUpdate:modelValue": (F) => _.field = F,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Field",
              onChange: (F) => S(_)
            }, [
              (t(!0), n(z, null, j(u.value, (F) => (t(), n("option", {
                key: F,
                value: F
              }, c(e.fields[F].label), 9, fs))), 128))
            ], 40, cs), [
              [Ze, _.field]
            ]),
            ge(l("select", {
              "onUpdate:modelValue": (F) => _.operator = F,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Operator",
              onChange: p
            }, [
              (t(!0), n(z, null, j(f(_.field), (F) => (t(), n("option", {
                key: F,
                value: F
              }, c(v[F] ?? F), 9, ps))), 128))
            ], 40, ms), [
              [Ze, _.operator]
            ]),
            _.field && e.fields[_.field]?.kind === "boolean" ? ge((t(), n("select", {
              key: 0,
              "onUpdate:modelValue": (F) => _.value = F,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: p
            }, [...m[3] || (m[3] = [
              l("option", { value: !0 }, "Yes", -1),
              l("option", { value: !1 }, "No", -1)
            ])], 40, vs)), [
              [Ze, _.value]
            ]) : _.field && e.fields[_.field]?.options?.length ? ge((t(), n("select", {
              key: 1,
              "onUpdate:modelValue": (F) => _.value = F,
              multiple: e.fields[_.field].kind === "multiselect",
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: p
            }, [
              (t(!0), n(z, null, j(e.fields[_.field].options, (F) => (t(), n("option", {
                key: F,
                value: F
              }, c(F), 9, hs))), 128))
            ], 40, gs)), [
              [Ze, _.value]
            ]) : ge((t(), n("input", {
              key: 2,
              "onUpdate:modelValue": (F) => _.value = F,
              type: _.field && e.fields[_.field]?.kind === "daterange" ? "date" : "text",
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: p
            }, null, 40, bs)), [
              [va, _.value]
            ])
          ], 64)),
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:text-destructive px-1 py-1 text-sm",
            "aria-label": `Remove ${d(_) ? "group" : "rule"}`,
            onClick: (F) => k(T)
          }, " × ", 8, ys)
        ]))), 128)),
        l("div", xs, [
          I(ce, {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: h
          }, {
            default: O(() => [...m[4] || (m[4] = [
              U("Add rule", -1)
            ])]),
            _: 1
          }),
          w.value ? (t(), D(ce, {
            key: 0,
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: $
          }, {
            default: O(() => [...m[5] || (m[5] = [
              U(" Add group ", -1)
            ])]),
            _: 1
          })) : b("", !0),
          e.root ? (t(), n(z, { key: 1 }, [
            m[8] || (m[8] = l("span", { class: "flex-1" }, null, -1)),
            I(ce, {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: C
            }, {
              default: O(() => [...m[6] || (m[6] = [
                U(" Clear ", -1)
              ])]),
              _: 1
            }),
            I(ce, {
              type: "button",
              size: "sm",
              onClick: B
            }, {
              default: O(() => [...m[7] || (m[7] = [
                U(" Apply ", -1)
              ])]),
              _: 1
            })
          ], 64)) : b("", !0)
        ])
      ], 2);
    };
  }
}), $s = {
  "data-slot": "table-toolbar",
  class: "flex flex-col gap-2"
}, ws = { class: "flex items-center gap-2 md:hidden" }, Cs = { class: "relative min-w-0 flex-1" }, Ss = ["placeholder", "title", "aria-label"], Ms = {
  key: 0,
  class: "bg-primary text-primary-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px]"
}, Bs = { class: "flex max-h-[85vh] flex-col" }, As = { class: "flex-1 overflow-y-auto px-4 py-3" }, _s = {
  key: 0,
  class: "mb-4 flex flex-col gap-3"
}, zs = { class: "text-xs font-medium" }, Ps = ["value", "onChange"], Ls = ["value"], Os = { class: "mb-4" }, js = { class: "flex flex-col gap-1" }, Vs = ["disabled", "onClick"], Ds = {
  key: 0,
  class: "text-primary ml-auto text-xs"
}, Ts = {
  key: 1,
  class: "mb-4"
}, Is = { class: "flex flex-col gap-1" }, Es = ["onClick"], Fs = { class: "border-t p-4" }, Ns = ["disabled"], Rs = { class: "hidden flex-wrap items-center justify-end gap-2 md:flex" }, Us = { class: "relative min-w-0 flex-1 sm:w-72 sm:flex-none" }, Hs = ["placeholder", "title", "aria-label"], qs = ["aria-label"], Ks = {
  key: 0,
  class: "bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums"
}, Gs = { class: "flex max-h-96 flex-col gap-4 overflow-y-auto px-1 pb-3" }, Ws = { class: "text-xs font-medium" }, Zs = ["value", "onChange"], Js = ["value"], Ys = { class: "grid grid-cols-2 gap-2" }, Qs = ["value", "onChange"], Xs = ["value", "onChange"], er = {
  key: 3,
  class: "grid grid-cols-2 gap-2"
}, tr = ["value", "onChange"], nr = ["value", "onChange"], ar = {
  key: 4,
  class: "flex items-center gap-2"
}, lr = ["aria-checked", "onClick"], or = { class: "text-xs" }, sr = ["onClick"], rr = ["value", "onChange"], ir = ["value"], dr = ["disabled", "onClick"], ur = { class: "flex max-h-80 flex-col overflow-y-auto py-1" }, cr = ["disabled", "onClick"], fr = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, mr = {
  key: 1,
  class: "size-4 shrink-0",
  "aria-hidden": "true"
}, pr = {
  key: 1,
  class: "border-input inline-flex shrink-0 overflow-hidden rounded-md border",
  role: "group",
  "aria-label": "Index layout"
}, vr = ["aria-pressed", "aria-label", "title", "onClick"], gr = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, hr = {
  key: 1,
  viewBox: "0 0 24 24",
  class: "size-4",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, br = ["aria-pressed", "aria-label", "title"], yr = ["aria-label", "title"], xr = { class: "flex flex-col gap-0.5 p-1" }, kr = ["onClick"], $r = ["onClick"], wr = {
  key: 5,
  class: "text-muted-foreground shrink-0 text-xs"
}, Cr = {
  key: 0,
  class: "flex flex-wrap items-center gap-1.5",
  dusk: "filter-indicators"
}, Sr = ["dusk"], Mr = ["aria-label", "onClick"], Br = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(!1), i = H(a.search);
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
    const u = H({ ...a.filters });
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
    ), v = y(() => JSON.stringify(u.value) !== JSON.stringify(a.filters)), p = y(() => a.search !== "" || f.value > 0), h = y(() => a.indicators.length ? a.indicators : a.filterSchema.filter((V) => a.filters[V.key] !== null && a.filters[V.key] !== void 0).map((V) => ({
      key: V.key,
      label: `${V.label}: ${String(a.filters[V.key])}`,
      removable: !0
    })));
    function $(V) {
      r("group", V);
    }
    function k(V) {
      $(V), s.value = !1;
    }
    function S(V, E) {
      $(V), E();
    }
    function w(V) {
      r("clear-filter", V);
    }
    function C(V) {
      return V.type === "multiselect";
    }
    function B(V) {
      const E = u.value[V.key];
      return Array.isArray(E) ? E : E == null ? [] : [E];
    }
    function M(V) {
      return B(V).filter(
        (E) => typeof E == "string" || typeof E == "number"
      );
    }
    function m(V) {
      return W(V).flatMap(
        (E) => typeof E.value == "string" || typeof E.value == "number" ? [{ value: E.value, label: E.label }] : []
      );
    }
    function g(V, E) {
      u.value = { ...u.value, [V.key]: E === "" ? null : E };
    }
    function _(V, E) {
      const te = u.value[V.key];
      if (typeof te != "string" || !te.includes(".."))
        return "";
      const [le, Y] = te.split("..");
      return E === "from" ? le ?? "" : Y ?? "";
    }
    function T(V, E, te) {
      const le = E === "from" ? te : _(V, "from"), Y = E === "to" ? te : _(V, "to");
      u.value = {
        ...u.value,
        [V.key]: le && Y ? `${le}..${Y}` : null
      };
    }
    function F(V, E, te) {
      const le = E === "from" ? te : _(V, "from"), Y = E === "to" ? te : _(V, "to");
      u.value = {
        ...u.value,
        [V.key]: le || Y ? `${le}..${Y}` : null
      };
    }
    function Z(V) {
      r("apply-filters", { ...u.value }), V();
    }
    function G(V, E) {
      u.value[V] = E, r("apply-filters", { ...u.value });
    }
    function X() {
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
    const K = H(new Set(a.hidden));
    pe(
      () => a.hidden,
      (V) => {
        K.value = new Set(V);
      },
      { deep: !0 }
    );
    function N(V) {
      const E = new Set(K.value);
      E.has(V) ? E.delete(V) : E.add(V), K.value = E, r("apply-columns", [...E]);
    }
    function R() {
      K.value = /* @__PURE__ */ new Set(), r("apply-columns", []);
    }
    function Q() {
      r("apply-filters", { ...u.value }), s.value = !1;
    }
    function P() {
      i.value = "", r("clear");
    }
    function J() {
      P(), s.value = !1;
    }
    return (V, E) => (t(), n("div", $s, [
      l("div", ws, [
        l("div", Cs, [
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
            class: A([
              "border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors",
              x(Be)
            ])
          }, null, 10, Ss), [
            [_e, i.value]
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
          f.value ? (t(), n("span", Ms, c(f.value), 1)) : b("", !0)
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
                l("div", Bs, [
                  E[15] || (E[15] = l("div", { class: "border-b px-4 py-3" }, [
                    l("p", { class: "text-sm font-semibold" }, "Table tools"),
                    l("p", { class: "text-muted-foreground text-xs font-normal" }, " Filters, columns, and grouping ")
                  ], -1)),
                  l("div", As, [
                    e.filterSchema.length ? (t(), n("div", _s, [
                      l("div", { class: "flex items-center justify-between" }, [
                        E[11] || (E[11] = l("span", { class: "text-sm font-medium" }, "Filters", -1)),
                        l("button", {
                          class: "text-destructive text-xs hover:underline",
                          onClick: X
                        }, " Reset ")
                      ]),
                      (t(!0), n(z, null, j(e.filterSchema, (te) => (t(), n("div", {
                        key: `mobile-${te.key}`,
                        class: "flex flex-col gap-1.5"
                      }, [
                        l("label", zs, c(te.label), 1),
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
                          (t(!0), n(z, null, j(W(te), (le) => (t(), n("option", {
                            key: String(le.value),
                            value: le.value
                          }, c(le.label), 9, Ls))), 128))
                        ], 40, Ps)) : b("", !0)
                      ]))), 128))
                    ])) : b("", !0),
                    l("div", Os, [
                      E[13] || (E[13] = l("p", { class: "mb-2 text-sm font-medium" }, "Columns", -1)),
                      l("div", js, [
                        (t(!0), n(z, null, j(e.columns, (te) => (t(), n("button", {
                          key: `mobile-col-${te.key}`,
                          type: "button",
                          class: "hover:bg-accent flex items-center gap-2 rounded px-2 py-1.5 text-sm",
                          disabled: te.locked,
                          onClick: (le) => N(te.key)
                        }, [
                          l("span", null, c(te.label), 1),
                          K.value.has(te.key) ? b("", !0) : (t(), n("span", Ds, "On"))
                        ], 8, Vs))), 128))
                      ])
                    ]),
                    e.groups.length ? (t(), n("div", Ts, [
                      E[14] || (E[14] = l("p", { class: "mb-2 text-sm font-medium" }, "Grouping", -1)),
                      l("div", Is, [
                        l("button", {
                          type: "button",
                          class: "hover:bg-accent rounded px-2 py-1.5 text-left text-sm",
                          onClick: E[2] || (E[2] = (te) => k(null))
                        }, " No grouping "),
                        (t(!0), n(z, null, j(e.groups, (te) => (t(), n("button", {
                          key: te.key,
                          type: "button",
                          class: "hover:bg-accent rounded px-2 py-1.5 text-left text-sm",
                          onClick: (le) => k(te.key)
                        }, c(te.label), 9, Es))), 128))
                      ])
                    ])) : b("", !0)
                  ]),
                  l("div", Fs, [
                    e.filterSchema.length ? (t(), n("button", {
                      key: 0,
                      type: "button",
                      class: "bg-primary text-primary-foreground hover:bg-primary/90 mb-2 h-9 w-full rounded-md text-sm font-medium disabled:opacity-50",
                      disabled: !v.value,
                      onClick: Q
                    }, " Apply filters ", 8, Ns)) : b("", !0),
                    p.value ? (t(), n("button", {
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
      l("div", Rs, [
        l("div", Us, [
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
            class: A([
              "border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors",
              x(Be)
            ])
          }, null, 10, Hs), [
            [_e, i.value]
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
        e.filterSchema.length ? (t(), D(He, {
          key: 0,
          width: "w-80",
          "dismiss-on-panel-click": !1
        }, {
          trigger: O(() => [
            l("button", {
              type: "button",
              dusk: "filters-trigger",
              class: A(["border-input bg-background hover:bg-accent hover:text-accent-foreground relative inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors", f.value ? "border-primary text-primary" : ""]),
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
              f.value ? (t(), n("span", Ks, c(f.value), 1)) : b("", !0)
            ], 10, qs)
          ]),
          panel: O(({ close: te }) => [
            l("div", { class: "flex items-center justify-between px-1 pt-1 pb-2" }, [
              E[19] || (E[19] = l("span", { class: "text-sm font-semibold" }, "Filters", -1)),
              l("button", {
                class: "text-destructive text-xs hover:underline",
                onClick: X
              }, " Reset ")
            ]),
            E[22] || (E[22] = l("p", { class: "text-muted-foreground px-1 pb-3 text-xs" }, " Select one or more - all chosen filters must match. ", -1)),
            l("div", Gs, [
              (t(!0), n(z, null, j(e.filterSchema, (le) => (t(), n("div", {
                key: le.key,
                class: "flex flex-col gap-1.5"
              }, [
                l("label", Ws, c(le.label), 1),
                C(le) ? (t(), D(on, {
                  key: 0,
                  "model-value": M(le),
                  options: m(le),
                  placeholder: `Any ${le.label.toLowerCase()}`,
                  "onUpdate:modelValue": (Y) => u.value[le.key] = Y.length ? Y : null
                }, null, 8, ["model-value", "options", "placeholder", "onUpdate:modelValue"])) : le.type === "querybuilder" ? (t(), D(ks, {
                  key: 1,
                  "model-value": u.value[le.key] ?? null,
                  fields: le.fields ?? {},
                  operators: le.operators ?? {},
                  "max-depth": le.maxDepth ?? 5,
                  onApply: (Y) => G(le.key, Y)
                }, null, 8, ["model-value", "fields", "operators", "max-depth", "onApply"])) : le.type === "daterange" ? (t(), n(z, { key: 2 }, [
                  l("select", {
                    value: typeof u.value[le.key] == "string" && !String(u.value[le.key]).includes("..") ? u.value[le.key] : "",
                    class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
                    onChange: (Y) => g(le, Y.target.value)
                  }, [
                    E[20] || (E[20] = l("option", { value: "" }, "Any time", -1)),
                    (t(!0), n(z, null, j(W(le), (Y) => (t(), n("option", {
                      key: String(Y.value),
                      value: Y.value
                    }, c(Y.label), 9, Js))), 128))
                  ], 40, Zs),
                  l("div", Ys, [
                    l("input", {
                      type: "date",
                      value: _(le, "from"),
                      "aria-label": "From",
                      class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                      onChange: (Y) => T(
                        le,
                        "from",
                        Y.target.value
                      )
                    }, null, 40, Qs),
                    l("input", {
                      type: "date",
                      value: _(le, "to"),
                      "aria-label": "To",
                      class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                      onChange: (Y) => T(
                        le,
                        "to",
                        Y.target.value
                      )
                    }, null, 40, Xs)
                  ])
                ], 64)) : le.type === "numberrange" ? (t(), n("div", er, [
                  l("input", {
                    type: "number",
                    value: _(le, "from"),
                    "aria-label": "From",
                    placeholder: "From",
                    class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                    onChange: (Y) => F(
                      le,
                      "from",
                      Y.target.value
                    )
                  }, null, 40, tr),
                  l("input", {
                    type: "number",
                    value: _(le, "to"),
                    "aria-label": "To",
                    placeholder: "To",
                    class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                    onChange: (Y) => F(
                      le,
                      "to",
                      Y.target.value
                    )
                  }, null, 40, nr)
                ])) : le.type === "boolean" ? (t(), n("div", ar, [
                  l("button", {
                    type: "button",
                    role: "switch",
                    "aria-checked": u.value[le.key] === !0,
                    class: A([
                      "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                      u.value[le.key] === !0 ? "bg-primary" : "bg-muted-foreground/30"
                    ]),
                    onClick: (Y) => g(le, u.value[le.key] === !0 ? null : !0)
                  }, [
                    l("span", {
                      class: A([
                        "bg-background absolute top-0.5 size-4 rounded-full transition-all",
                        u.value[le.key] === !0 ? "left-4.5" : "left-0.5"
                      ])
                    }, null, 2)
                  ], 10, lr),
                  l("span", or, c(le.trueLabel ?? "Yes"), 1),
                  l("button", {
                    type: "button",
                    class: A([
                      "text-muted-foreground ml-auto text-xs hover:underline",
                      u.value[le.key] === !1 ? "text-primary font-medium" : ""
                    ]),
                    onClick: (Y) => g(le, u.value[le.key] === !1 ? null : !1)
                  }, c(le.falseLabel ?? "No") + " only ", 11, sr)
                ])) : (t(), n("select", {
                  key: 5,
                  value: u.value[le.key] ?? "",
                  class: "border-input bg-background h-9 rounded-md border px-3 text-sm capitalize",
                  onChange: (Y) => g(le, Y.target.value)
                }, [
                  E[21] || (E[21] = l("option", { value: "" }, "All", -1)),
                  (t(!0), n(z, null, j(W(le), (Y) => (t(), n("option", {
                    key: String(Y.value),
                    value: Y.value
                  }, c(Y.label), 9, ir))), 128))
                ], 40, rr))
              ]))), 128))
            ]),
            l("button", {
              type: "button",
              class: "bg-primary text-primary-foreground hover:bg-primary/90 mt-1 h-9 w-full rounded-md text-sm font-medium transition-colors disabled:opacity-50",
              disabled: !v.value,
              onClick: (le) => Z(te)
            }, " Apply filters ", 8, dr)
          ]),
          _: 1
        })) : b("", !0),
        I(He, { "dismiss-on-panel-click": !1 }, {
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
            l("div", ur, [
              (t(!0), n(z, null, j(e.columns, (te) => (t(), n("button", {
                key: te.key,
                type: "button",
                class: A(["hover:bg-accent flex items-center gap-2 px-3 py-1.5 text-sm", te.locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"]),
                disabled: te.locked,
                onClick: (le) => N(te.key)
              }, [
                K.value.has(te.key) ? (t(), n("span", mr)) : (t(), n("svg", fr, [...E[24] || (E[24] = [
                  l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
                ])])),
                U(" " + c(te.label), 1)
              ], 10, cr))), 128))
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
        e.layouts.length > 1 ? (t(), n("div", pr, [
          (t(!0), n(z, null, j(e.layouts, (te) => (t(), n("button", {
            key: te,
            type: "button",
            class: A(["hover:bg-accent inline-flex size-9 items-center justify-center transition-colors", e.layout === te ? "bg-accent text-foreground" : "text-muted-foreground"]),
            "aria-pressed": e.layout === te,
            "aria-label": te === "cards" ? "Card layout" : "Table layout",
            title: te === "cards" ? "Cards" : "Table",
            onClick: (le) => r("layout", te)
          }, [
            te === "table" ? (t(), n("svg", gr, [...E[27] || (E[27] = [
              l("path", { d: "M3 5h18M3 12h18M3 19h18" }, null, -1)
            ])])) : (t(), n("svg", hr, [...E[28] || (E[28] = [
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
          ], 10, vr))), 128))
        ])) : b("", !0),
        e.reorderable ? (t(), n("button", {
          key: 2,
          type: "button",
          class: A(["border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors", e.reordering ? "border-primary text-primary" : ""]),
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
        ])], 10, br)) : b("", !0),
        e.groups.length ? (t(), D(He, {
          key: 3,
          align: "end"
        }, {
          trigger: O(() => [
            l("button", {
              type: "button",
              dusk: "group-picker",
              class: A(["border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors", e.groupBy ? "border-primary text-primary" : ""]),
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
            ])], 10, yr)
          ]),
          panel: O(({ close: te }) => [
            l("div", xr, [
              l("button", {
                type: "button",
                class: A(["hover:bg-accent rounded px-2 py-1.5 text-left text-sm", e.groupBy ? "" : "text-primary font-medium"]),
                onClick: (le) => S(null, te)
              }, " No grouping ", 10, kr),
              (t(!0), n(z, null, j(e.groups, (le) => (t(), n("button", {
                key: le.key,
                type: "button",
                class: A(["hover:bg-accent rounded px-2 py-1.5 text-left text-sm", e.groupBy?.key === le.key ? "text-primary font-medium" : ""]),
                onClick: (Y) => S(le.key, te)
              }, c(le.label), 11, $r))), 128))
            ])
          ]),
          _: 1
        })) : b("", !0),
        p.value ? (t(), n("button", {
          key: 4,
          type: "button",
          class: "text-muted-foreground hover:text-foreground shrink-0 text-xs underline-offset-2 hover:underline",
          onClick: P
        }, " Clear ")) : b("", !0),
        e.loading ? (t(), n("span", wr, "Loading…")) : b("", !0)
      ]),
      h.value.length ? (t(), n("div", Cr, [
        (t(!0), n(z, null, j(h.value, (te) => (t(), n("span", {
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
            onClick: (le) => w(te.key)
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
          ])], 8, Mr)) : b("", !0)
        ], 8, Sr))), 128)),
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
}), Ar = { class: "min-w-0" }, _r = {
  key: 0,
  class: "text-sm font-semibold tracking-tight"
}, zr = {
  key: 0,
  class: "flex shrink-0 flex-wrap items-center justify-end gap-2"
}, Pr = {
  key: 0,
  class: "text-muted-foreground px-4 py-10 text-center text-sm"
}, Lr = {
  key: 2,
  class: "pk-table-scroll pk-scroll w-full"
}, Or = { class: "w-full border-collapse text-sm" }, jr = { class: "bg-muted/40" }, Vr = { class: "divide-y" }, Dr = ["href"], Tr = {
  key: 1,
  class: "text-muted-foreground"
}, Ir = {
  key: 0,
  class: "flex justify-center"
}, Er = ["disabled"], Fr = {
  key: 1,
  class: "text-muted-foreground text-center text-xs"
}, Nr = ["href"], M8 = /* @__PURE__ */ L({
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
    function p($, k) {
      return k == null || k === "" ? "None" : $.type === "date" || $.type === "datetime" ? new Date(String(k)).toLocaleString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...$.type === "datetime" ? { hour: "2-digit", minute: "2-digit" } : {}
      }) : typeof k == "number" ? new Intl.NumberFormat().format(k) : String(k);
    }
    function h($) {
      return $ == null || $ === "";
    }
    return ($, k) => (t(), D(Jo, null, ut({
      default: O(() => [
        e.loading && e.rows.length === 0 ? (t(), n("div", Pr, " Loading… ")) : e.loaded && e.rows.length === 0 ? (t(), D(Ut, {
          key: 1,
          compact: "",
          icon: "package",
          title: e.emptyTitle,
          description: e.emptyText
        }, ut({ _: 2 }, [
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
        ]), 1032, ["title", "description"])) : e.rows.length > 0 ? (t(), n("div", Lr, [
          l("table", Or, [
            l("thead", jr, [
              l("tr", null, [
                (t(!0), n(z, null, j(i.value, (S) => (t(), n("th", {
                  key: S.key,
                  class: "text-muted-foreground px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap"
                }, c(S.label), 1))), 128))
              ])
            ]),
            l("tbody", Vr, [
              (t(!0), n(z, null, j(e.rows, (S, w) => (t(), n("tr", {
                key: S.id ?? w,
                "data-slot": "table-row",
                class: "pk-row hover:bg-muted/40 transition-colors"
              }, [
                (t(!0), n(z, null, j(i.value, (C) => (t(), n("td", {
                  key: C.key,
                  class: A(["px-3 whitespace-nowrap", [
                    C.mono ? "font-mono text-xs" : "",
                    C.muted ? "text-muted-foreground" : ""
                  ]])
                }, [
                  q($.$slots, `cell:${C.key}`, {
                    row: S,
                    value: S[C.key],
                    column: C
                  }, () => [
                    e.recordBase && S.id != null && C === i.value[0] ? (t(), n("a", {
                      key: 0,
                      href: `${e.recordBase}/${S.id}`,
                      class: "text-foreground underline-offset-2 hover:underline"
                    }, c(p(C, S[C.key])), 9, Dr)) : h(S[C.key]) ? (t(), n("span", Tr, " None ")) : (t(), n(z, { key: 2 }, [
                      U(c(p(C, S[C.key])), 1)
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
          l("div", Ar, [
            e.title ? (t(), n("h3", _r, c(e.title), 1)) : b("", !0)
          ]),
          d.value ? (t(), n("div", zr, [
            q($.$slots, "actions")
          ])) : b("", !0)
        ]),
        key: "0"
      } : void 0,
      f.value ? {
        name: "toolbar",
        fn: O(() => [
          I(Br, {
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
          e.nextCursor ? (t(), n("div", Ir, [
            l("button", {
              type: "button",
              class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm font-medium disabled:opacity-50",
              disabled: e.loading,
              onClick: k[6] || (k[6] = (S) => r("load", e.nextCursor))
            }, c(e.loading ? "Loading…" : "Load more"), 9, Er)
          ])) : e.capped ? (t(), n("p", Fr, [
            U(" Showing the first " + c(e.rows.length) + ". ", 1),
            e.indexHref ? (t(), n("a", {
              key: 0,
              href: e.indexHref,
              class: "text-foreground underline-offset-2 hover:underline"
            }, " Open the full list ", 8, Nr)) : (t(), n(z, { key: 1 }, [
              U("Open the full list to search or filter the rest.")
            ], 64))
          ])) : b("", !0)
        ]),
        key: "2"
      } : void 0
    ]), 1024));
  }
}), Rr = { class: "flex items-center gap-2 overflow-x-auto" }, Ur = {
  key: 0,
  class: "size-3",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Hr = {
  key: 1,
  class: "size-3",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, qr = { class: "flex flex-col" }, Kr = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, Gr = {
  key: 0,
  class: "bg-destructive size-1.5 shrink-0 rounded-full",
  "aria-label": "has errors"
}, Wr = {
  key: 0,
  class: "bg-border h-px w-6 shrink-0",
  "aria-hidden": "true"
}, Zr = /* @__PURE__ */ L({
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
    return (f, v) => (t(), n("ol", Rr, [
      (t(!0), n(z, null, j(e.steps, (p, h) => (t(), n("li", {
        key: h,
        class: "flex shrink-0 items-center gap-2"
      }, [
        (t(), D(Ce(e.interactive ? "button" : "div"), de({
          type: e.interactive ? "button" : void 0,
          class: ["flex items-center gap-2 text-left text-sm", [
            e.interactive ? "transition-colors disabled:cursor-default" : "",
            i(h)
          ]]
        }, { ref_for: !0 }, e.interactive ? { disabled: h > e.activeStep } : {}, {
          onClick: ($) => e.interactive && h <= e.activeStep && r("update:activeStep", h)
        }), {
          default: O(() => [
            l("span", {
              class: A(["flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums", s(h)])
            }, [
              u(h) ? (t(), n("svg", Ur, [...v[0] || (v[0] = [
                l("path", { d: "M18 6 6 18M6 6l12 12" }, null, -1)
              ])])) : d(h) ? (t(), n("svg", Hr, [...v[1] || (v[1] = [
                l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
              ])])) : (t(), n(z, { key: 2 }, [
                U(c(h + 1), 1)
              ], 64))
            ], 2),
            l("span", qr, [
              l("span", null, c(p.label), 1),
              p.description ? (t(), n("span", Kr, c(p.description), 1)) : b("", !0)
            ]),
            e.hasError(h) ? (t(), n("span", Gr)) : b("", !0)
          ]),
          _: 2
        }, 1040, ["type", "class", "onClick"])),
        h < e.steps.length - 1 ? (t(), n("span", Wr)) : b("", !0)
      ]))), 128))
    ]));
  }
}), vt = /* @__PURE__ */ new Map();
function xe(e, o) {
  vt.set(e, o);
}
function Jr(e) {
  return vt.get(e);
}
function B8(e) {
  return vt.has(e);
}
function A8() {
  return [...vt.keys()].sort();
}
function _8() {
  vt.clear();
}
const z8 = "text-sm text-muted-foreground font-normal", P8 = "text-xs text-muted-foreground font-normal", xt = "text-xs text-muted-foreground font-normal leading-snug";
class Yr extends Error {
  fieldErrors;
  constructor(o, a = {}) {
    super(o), this.name = "CreateOptionError", this.fieldErrors = a;
  }
}
function L8(e) {
  if (!e || typeof e != "object")
    return {};
  const o = {};
  for (const [a, r] of Object.entries(e)) {
    const s = Array.isArray(r) ? r[0] : r;
    typeof s == "string" && s !== "" && (o[a] = s);
  }
  return o;
}
function Qr(e) {
  if (e.createOptionLabel)
    return e.createOptionLabel;
  const o = e.label.replace(/\s*id$/i, "").trim();
  return o !== "" ? `Create ${o.toLowerCase()}` : "Create option";
}
function Xr(e) {
  if (e.createOptionActionLabel)
    return e.createOptionActionLabel;
  const o = e.label.replace(/\s*id$/i, "").trim();
  return o !== "" ? `Create ${o.toLowerCase()}` : "Create new";
}
const ei = "text-foreground font-normal", ti = "placeholder:text-muted-foreground placeholder:font-normal", Ue = `${ei} ${ti}`, ni = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(wa), de({ "data-slot": "checkbox" }, x(i), {
      class: x(oe)(
        "peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        a.class
      )
    }), {
      default: O((f) => [
        I(x(Ca), {
          "data-slot": "checkbox-indicator",
          class: "grid place-content-center text-current transition-none"
        }, {
          default: O(() => [
            q(d.$slots, "default", Le(Ne(f)), () => [
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
    return (i, d) => (t(), D(x(Sa), de({ "data-slot": "switch" }, x(s), {
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
}), ai = {
  key: 0,
  class: "text-destructive text-sm",
  role: "alert"
}, li = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H({});
    pe(
      () => a.open,
      (d) => {
        d && (s.value = {});
      }
    );
    function i() {
      r("submit", { ...s.value });
    }
    return (d, u) => (t(), D(ft, {
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
          onSubmit: he(i, ["prevent"])
        }, [
          e.generalError ? (t(), n("p", ai, c(e.generalError), 1)) : b("", !0),
          (t(!0), n(z, null, j(e.fields, (f) => (t(), D(Ge, {
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
}), oi = ["accept", "disabled"], si = { class: "text-sm font-medium" }, ri = { key: 0 }, ii = { key: 1 }, di = { class: "text-muted-foreground text-xs font-normal" }, ui = {
  key: 0,
  class: "bg-muted mt-2 h-1 w-40 overflow-hidden rounded-full"
}, ci = {
  key: 1,
  class: "flex items-center gap-3 rounded-lg border p-3"
}, fi = ["src"], mi = {
  key: 1,
  class: "bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded text-[10px] font-semibold uppercase"
}, pi = { class: "min-w-0 flex-1" }, vi = { class: "block truncate text-sm font-medium" }, gi = { class: "text-muted-foreground text-xs font-normal" }, hi = ["href"], bi = {
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
    const a = e, r = o, s = H(null), i = H(!1), d = H(null), u = H(null), f = H(null), v = y(() => a.accept.map((m) => `.${m}`).join(",")), p = y(() => f.value ?? a.modelValue?.url ?? null), h = y(() => `${a.accept.length ? a.accept.join(", ").toUpperCase() : "Any file"} · up to ${$(a.maxKilobytes * 1024)}`);
    function $(m) {
      if (!m)
        return "";
      const g = ["B", "KB", "MB", "GB"];
      let _ = m, T = 0;
      for (; _ >= 1024 && T < g.length - 1; )
        _ /= 1024, T++;
      return `${_.toFixed(_ < 10 && T > 0 ? 1 : 0)} ${g[T]}`;
    }
    function k(m) {
      return m.split(".").pop()?.toLowerCase() ?? "";
    }
    function S(m) {
      return a.accept.length && !a.accept.includes(k(m.name)) ? `${k(m.name).toUpperCase() || "That"} files are not accepted here.` : m.size > a.maxKilobytes * 1024 ? `That file is ${$(m.size)}; the limit is ${$(a.maxKilobytes * 1024)}.` : null;
    }
    async function w(m) {
      const g = m?.[0];
      if (!(!g || a.disabled) && (u.value = S(g), !u.value)) {
        C(), a.image && g.type.startsWith("image/") && (f.value = URL.createObjectURL(g)), d.value = 0;
        try {
          const _ = await a.upload(g, (T) => {
            d.value = T;
          });
          r("update:modelValue", _);
        } catch (_) {
          u.value = _ instanceof Error ? _.message : "The upload failed.", C();
        } finally {
          d.value = null, s.value && (s.value.value = "");
        }
      }
    }
    function C() {
      f.value && URL.revokeObjectURL(f.value), f.value = null;
    }
    async function B() {
      const m = a.modelValue;
      C(), u.value = null, r("update:modelValue", null), m && !m.url && a.discard && await a.discard(m.value).catch(() => {
      });
    }
    function M(m) {
      i.value = !1, w(m.dataTransfer?.files ?? null);
    }
    return (m, g) => (t(), n("div", null, [
      e.modelValue ? (t(), n("div", ci, [
        e.image && p.value ? (t(), n("img", {
          key: 0,
          src: p.value,
          alt: "",
          class: "bg-muted size-12 shrink-0 rounded object-cover"
        }, null, 8, fi)) : (t(), n("span", mi, c(k(e.modelValue.name) || "file"), 1)),
        l("span", pi, [
          l("span", vi, c(e.modelValue.name), 1),
          l("span", gi, [
            U(c($(e.modelValue.size)) + " ", 1),
            e.modelValue.url ? (t(), n(z, { key: 0 }, [
              g[4] || (g[4] = U(" · ", -1)),
              l("a", {
                href: e.modelValue.url,
                class: "hover:underline"
              }, "Download", 8, hi)
            ], 64)) : (t(), n(z, { key: 1 }, [
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
        class: A(["flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-6 text-center transition-colors", [
          i.value ? "border-primary bg-primary/5" : "hover:bg-accent/40",
          e.disabled ? "pointer-events-none opacity-50" : ""
        ]]),
        onDragover: g[1] || (g[1] = he((_) => i.value = !0, ["prevent"])),
        onDragleave: g[2] || (g[2] = he((_) => i.value = !1, ["prevent"])),
        onDrop: he(M, ["prevent"])
      }, [
        l("input", {
          ref_key: "input",
          ref: s,
          type: "file",
          class: "sr-only",
          accept: v.value,
          disabled: e.disabled,
          onChange: g[0] || (g[0] = (_) => w(_.target.files))
        }, null, 40, oi),
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
        l("span", si, [
          d.value === null ? (t(), n("span", ri, "Drop a file or click to choose")) : (t(), n("span", ii, "Uploading…"))
        ]),
        l("span", di, c(h.value), 1),
        d.value !== null ? (t(), n("span", ui, [
          l("span", {
            class: "bg-primary block h-full transition-[width] duration-150",
            style: ie({ width: `${d.value}%` })
          }, null, 4)
        ])) : b("", !0)
      ], 34)),
      u.value ? (t(), n("p", bi, c(u.value), 1)) : b("", !0)
    ]));
  }
}), yi = { class: "flex flex-col gap-2" }, xi = {
  key: 0,
  class: "flex flex-col gap-1.5"
}, ki = { class: "text-muted-foreground grid grid-cols-[1fr_1fr_auto] gap-2 text-xs" }, $i = { class: "flex flex-col gap-1" }, wi = ["onUpdate:modelValue", "disabled", "aria-label"], Ci = {
  key: 0,
  class: "text-destructive text-xs",
  role: "alert"
}, Si = {
  key: 1,
  class: "text-destructive text-xs",
  role: "alert"
}, Mi = ["onUpdate:modelValue", "disabled", "aria-label"], Bi = ["disabled", "aria-label", "onClick"], Ai = {
  key: 1,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, _i = { class: "flex items-center gap-3" }, zi = ["disabled"], Pi = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal tabular-nums"
}, Li = /* @__PURE__ */ L({
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
    const d = H(u(a.modelValue));
    function u(w) {
      return w ? Object.entries(w).map(([C, B]) => ({
        uid: i++,
        key: C,
        value: B ?? ""
      })) : [];
    }
    pe(
      () => a.modelValue,
      (w) => {
        JSON.stringify(w ?? null) !== JSON.stringify(f()) && (d.value = u(w));
      }
    );
    function f() {
      const w = {};
      for (const C of d.value) {
        const B = C.key.trim();
        B !== "" && (w[B] = C.value);
      }
      return Object.keys(w).length ? w : null;
    }
    function v() {
      r("update:modelValue", f());
    }
    const p = y(() => {
      const w = /* @__PURE__ */ new Map();
      for (const C of d.value) {
        const B = C.key.trim();
        B !== "" && w.set(B, (w.get(B) ?? 0) + 1);
      }
      return new Set([...w.entries()].filter(([, C]) => C > 1).map(([C]) => C));
    }), h = y(
      () => new Set(
        d.value.map((w) => w.key.trim()).filter((w) => w !== "" && !s.test(w))
      )
    ), $ = y(() => a.maxPairs !== null && d.value.length >= a.maxPairs);
    function k() {
      $.value || a.disabled || d.value.push({ uid: i++, key: "", value: "" });
    }
    function S(w) {
      d.value = d.value.filter((C) => C.uid !== w), v();
    }
    return (w, C) => (t(), n("div", yi, [
      d.value.length ? (t(), n("div", xi, [
        l("div", ki, [
          l("span", null, c(e.keyLabel), 1),
          l("span", null, c(e.valueLabel), 1),
          C[0] || (C[0] = l("span", { class: "w-7" }, null, -1))
        ]),
        (t(!0), n(z, null, j(d.value, (B) => (t(), n("div", {
          key: B.uid,
          class: "grid grid-cols-[1fr_1fr_auto] items-start gap-2"
        }, [
          l("div", $i, [
            ge(l("input", {
              "onUpdate:modelValue": (M) => B.key = M,
              type: "text",
              class: A([
                "border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
                p.value.has(B.key.trim()) || h.value.has(B.key.trim()) ? "border-destructive" : ""
              ]),
              disabled: e.disabled,
              "aria-label": e.keyLabel,
              onInput: v
            }, null, 42, wi), [
              [_e, B.key]
            ]),
            h.value.has(B.key.trim()) ? (t(), n("p", Ci, " Letters, numbers, underscores and dashes only. ")) : p.value.has(B.key.trim()) ? (t(), n("p", Si, " Used twice - only the last value will be saved. ")) : b("", !0)
          ]),
          ge(l("input", {
            "onUpdate:modelValue": (M) => B.value = M,
            type: "text",
            class: "border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
            disabled: e.disabled,
            "aria-label": e.valueLabel,
            onInput: v
          }, null, 40, Mi), [
            [_e, B.value]
          ]),
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-40",
            disabled: e.disabled,
            "aria-label": `Remove ${B.key || "this entry"}`,
            onClick: (M) => S(B.uid)
          }, [...C[1] || (C[1] = [
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
          ])], 8, Bi)
        ]))), 128))
      ])) : (t(), n("p", Ai, " Nothing here yet. ")),
      l("div", _i, [
        l("button", {
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled || $.value,
          onClick: k
        }, [
          C[2] || (C[2] = l("svg", {
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
        ], 8, zi),
        e.maxPairs !== null ? (t(), n("p", Pi, c(d.value.length) + " of " + c(e.maxPairs), 1)) : b("", !0)
      ])
    ]));
  }
}), Oi = { class: "border-input bg-background focus-within:ring-ring overflow-hidden rounded-md border focus-within:ring-2" }, ji = { class: "bg-muted/40 flex flex-wrap items-center gap-0.5 border-b px-1.5 py-1" }, Vi = ["disabled", "title", "aria-label", "onClick"], Di = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Ti = ["d"], Ii = ["disabled"], Ei = ["contenteditable", "data-placeholder"], Fi = {
  key: 0,
  class: "text-muted-foreground border-t px-3 py-1 text-right text-xs tabular-nums"
}, Ni = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(null);
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
    ], u = y(() => d.filter((S) => a.toolbar.includes(S.id))), f = y(() => a.toolbar.includes("link")), v = H(0);
    function p() {
      const S = s.value?.innerHTML ?? "", w = (s.value?.innerText ?? "").trim();
      v.value = w.length;
      const C = w === "" ? null : S;
      i = C, r("update:modelValue", C);
    }
    function h(S) {
      a.disabled || (s.value?.focus(), document.execCommand(S.command, !1, S.argument), p());
    }
    function $() {
      if (a.disabled)
        return;
      const S = window.prompt("Link address");
      S && (s.value?.focus(), document.execCommand("createLink", !1, S), p());
    }
    function k(S) {
      S.preventDefault();
      const w = S.clipboardData?.getData("text/plain") ?? "";
      document.execCommand("insertText", !1, w), p();
    }
    return be(() => {
      s.value && (s.value.innerHTML = a.modelValue ?? "", v.value = s.value.innerText.trim().length);
    }), pe(
      () => a.modelValue,
      (S) => {
        S !== i && s.value && (s.value.innerHTML = S ?? "", v.value = s.value.innerText.trim().length);
      }
    ), (S, w) => (t(), n("div", Oi, [
      l("div", ji, [
        (t(!0), n(z, null, j(u.value, (C) => (t(), n("button", {
          key: C.id,
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40",
          disabled: e.disabled,
          title: C.label,
          "aria-label": C.label,
          onMousedown: w[0] || (w[0] = he(() => {
          }, ["prevent"])),
          onClick: (B) => h(C)
        }, [
          (t(), n("svg", Di, [
            l("path", {
              d: C.path
            }, null, 8, Ti)
          ]))
        ], 40, Vi))), 128)),
        f.value ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40",
          disabled: e.disabled,
          title: "Link",
          "aria-label": "Link",
          onMousedown: w[1] || (w[1] = he(() => {
          }, ["prevent"])),
          onClick: $
        }, [...w[2] || (w[2] = [
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
        ])], 40, Ii)) : b("", !0)
      ]),
      l("div", {
        ref_key: "editor",
        ref: s,
        class: A(["pk-prose min-h-28 px-3 py-2 text-sm focus:outline-none", e.disabled ? "pointer-events-none opacity-60" : ""]),
        contenteditable: !e.disabled,
        role: "textbox",
        "aria-multiline": "true",
        "data-placeholder": e.placeholder,
        onInput: p,
        onBlur: p,
        onPaste: k
      }, null, 42, Ei),
      e.maxLength !== null ? (t(), n("div", Fi, c(v.value) + " / " + c(e.maxLength), 1)) : b("", !0)
    ]));
  }
}), Ri = /* @__PURE__ */ zt(Ni, [["__scopeId", "data-v-32c63bc7"]]), Ui = ["role"], Hi = ["title"], qi = ["type", "name", "value", "checked", "disabled", "aria-label", "onChange"], Ki = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Gi = ["d"], Wi = { key: 1 }, Zi = {
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
    const a = e, r = o, s = y(() => !!a.field.multiple), i = y(() => !!a.field.grouped), d = y(() => !!a.field.hiddenLabels), u = y(() => a.field.inline !== !1), f = y(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    );
    function v(m) {
      return s.value ? f.value.some((g) => g == m.value) : a.modelValue != null && m.value == a.modelValue;
    }
    function p(m) {
      if (!a.disabled) {
        if (s.value) {
          r(
            "update:modelValue",
            v(m) ? f.value.filter((g) => g != m.value) : [...f.value, m.value]
          );
          return;
        }
        r("update:modelValue", m.value);
      }
    }
    function h(m) {
      return a.field.colors?.[String(m.value)] ?? "primary";
    }
    function $(m) {
      const g = a.field.icons?.[String(m.value)];
      return g ? me(g) : null;
    }
    function k(m) {
      return a.field.tooltips?.[String(m.value)] ?? m.label;
    }
    const S = {
      primary: "border-primary bg-primary text-primary-foreground",
      success: "border-success bg-success text-white",
      warning: "border-warning bg-warning text-white",
      danger: "border-destructive bg-destructive text-white",
      info: "border-info bg-info text-white",
      neutral: "border-foreground bg-foreground text-background"
    }, w = {
      primary: "border-input hover:border-primary/60 hover:bg-primary/5",
      success: "border-input hover:border-success/60 hover:bg-success/5",
      warning: "border-input hover:border-warning/60 hover:bg-warning/5",
      danger: "border-input hover:border-destructive/60 hover:bg-destructive/5",
      info: "border-input hover:border-info/60 hover:bg-info/5",
      neutral: "border-input hover:border-foreground/40 hover:bg-muted"
    };
    function C(m) {
      const g = h(m), _ = v(m);
      return [
        Be,
        "inline-flex items-center justify-center gap-1.5 border px-3 py-1.5 text-sm font-medium transition-colors",
        i.value ? "rounded-none first:rounded-l-md last:rounded-r-md -ml-px first:ml-0" : "rounded-md",
        _ ? S[g] ?? S.primary : w[g] ?? w.primary,
        a.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      ].join(" ");
    }
    const B = y(() => {
      if (!(u.value || i.value) && a.field.columns && a.field.columns > 1)
        return { gridTemplateColumns: `repeat(${a.field.columns}, minmax(0, 1fr))` };
    }), M = y(() => i.value ? "inline-flex flex-wrap" : u.value ? "flex flex-wrap gap-2" : "grid gap-2");
    return (m, g) => (t(), n("div", {
      role: s.value ? "group" : "radiogroup",
      class: A(M.value),
      style: ie(B.value),
      "data-test": "toggle-buttons-field"
    }, [
      (t(!0), n(z, null, j(e.options, (_) => (t(), n("label", {
        key: String(_.value),
        class: A(C(_)),
        title: k(_)
      }, [
        l("input", {
          class: "sr-only",
          type: s.value ? "checkbox" : "radio",
          name: s.value ? void 0 : `f-${e.field.key}`,
          value: _.value,
          checked: v(_),
          disabled: e.disabled,
          "aria-label": d.value ? _.label : void 0,
          onChange: (T) => p(_)
        }, null, 40, qi),
        $(_) ? (t(), n("svg", Ki, [
          l("path", {
            d: $(_)
          }, null, 8, Gi)
        ])) : b("", !0),
        d.value ? b("", !0) : (t(), n("span", Wi, c(_.label), 1))
      ], 10, Hi))), 128)),
      e.options.length === 0 ? (t(), n("p", Zi, " Nothing to choose from yet. ")) : b("", !0)
    ], 14, Ui));
  }
}), Ji = {
  key: 1,
  class: "flex flex-col gap-2"
}, Yi = { class: "flex items-center justify-between gap-2" }, Qi = ["for"], Xi = {
  key: 0,
  class: "text-destructive",
  "aria-hidden": "true"
}, ed = ["aria-label", "disabled"], td = {
  key: 7,
  class: "flex flex-col gap-2"
}, nd = ["id", "value", "disabled"], ad = ["value"], ld = {
  key: 2,
  class: "relative"
}, od = ["disabled"], sd = {
  key: 0,
  class: "bg-popover absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md"
}, rd = { class: "max-h-56 overflow-y-auto p-1" }, id = ["onClick"], dd = {
  key: 8,
  class: "relative"
}, ud = ["disabled", "aria-invalid"], cd = {
  key: 0,
  class: "bg-popover absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md"
}, fd = { class: "max-h-56 overflow-y-auto p-1" }, md = {
  key: 0,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, pd = {
  key: 1,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, vd = ["onClick"], gd = ["id", "value", "disabled", "aria-invalid"], hd = ["value"], bd = {
  key: 10,
  class: "flex items-center gap-2 text-sm"
}, yd = {
  key: 11,
  class: "flex items-center gap-2 text-sm"
}, xd = ["id", "value", "rows", "placeholder", "disabled", "aria-invalid"], kd = {
  key: 0,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, $d = ["aria-label", "disabled"], wd = ["id", "value", "rows", "placeholder", "disabled", "aria-invalid"], Cd = {
  key: 2,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Sd = ["aria-label", "disabled"], Md = ["id", "type", "value", "placeholder", "autocomplete", "min", "max", "disabled", "aria-invalid"], Bd = {
  key: 0,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Ad = ["aria-label", "disabled"], _d = ["id", "type", "value", "placeholder", "autocomplete", "min", "max", "disabled", "aria-invalid"], zd = {
  key: 2,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Pd = ["aria-label", "disabled"], Ld = {
  key: 16,
  class: "flex flex-wrap gap-1.5"
}, Od = ["disabled", "aria-pressed", "onClick"], jd = {
  key: 17,
  class: "flex flex-wrap gap-1.5"
}, Vd = ["title", "disabled", "onClick"], Dd = ["href"], Td = {
  key: 19,
  class: "text-destructive text-xs leading-snug",
  role: "alert"
}, Ge = /* @__PURE__ */ L({
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
    const a = hn(() => import("./PkRepeater-J84jGe3T.js")), r = hn(() => import("./PkBuilder-DXeyw3Du.js")), s = e, i = o, d = H(!1), u = H(""), f = H([]), v = H(!1), p = H(null);
    let h;
    pe(u, (Y) => {
      s.searchOptions && (clearTimeout(h), v.value = !0, h = setTimeout(async () => {
        try {
          f.value = await s.searchOptions(Y);
        } catch {
        } finally {
          v.value = !1;
        }
      }, 200));
    });
    async function $() {
      if (!(s.processing || s.field.disabled) && (d.value = !0, f.value.length === 0 && s.searchOptions)) {
        v.value = !0;
        try {
          f.value = await s.searchOptions("");
        } finally {
          v.value = !1;
        }
      }
    }
    function k(Y) {
      p.value = Y.label, i("change", Y.value), d.value = !1, u.value = "";
    }
    function S() {
      p.value = null, i("change", null);
    }
    const w = $t("panelPicker", null), C = $t("panelCreateOption", null), B = H(!1), M = H(!1), m = H({}), g = H(null), _ = y(() => Qr(s.field)), T = y(() => Xr(s.field));
    function F() {
      m.value = {}, g.value = null, B.value = !0, d.value = !1;
    }
    function Z() {
      M.value || (B.value = !1, m.value = {}, g.value = null);
    }
    async function G(Y) {
      if (C) {
        M.value = !0, m.value = {}, g.value = null;
        try {
          const ne = await C.run(s.field.key, { ...Y });
          k(ne), B.value = !1;
        } catch (ne) {
          ne instanceof Yr ? (m.value = ne.fieldErrors, g.value = Object.keys(ne.fieldErrors).length === 0 ? ne.message : null) : g.value = ne instanceof Error ? ne.message : "Could not create that option.";
        } finally {
          M.value = !1;
        }
      }
    }
    const X = y(() => {
      if (!s.field.tableSelect || !w?.base)
        return;
      const Y = w.returnUrl || "/";
      return `${w.base}/pick/${s.field.key}?return=${encodeURIComponent(Y)}`;
    }), W = y(() => s.field.morphTo ?? []), K = y(() => {
      const Y = s.value;
      return Y && typeof Y == "object" && !Array.isArray(Y) ? Y : { type: void 0, id: void 0 };
    });
    function N(Y) {
      i("change", { type: Y || null, id: null });
    }
    function R(Y) {
      i("change", { type: K.value.type ?? null, id: Y });
    }
    function Q(Y) {
      p.value = Y.label, R(Y.value), d.value = !1, u.value = "";
    }
    ke(() => clearTimeout(h));
    const P = y(() => Jr(s.field.type)), J = y(
      () => !!s.field.prefix || !!s.field.suffix || !!s.field.prefixIcon || !!s.field.suffixIcon || !!s.field.prefixAction || !!s.field.suffixAction
    );
    function V(Y) {
      if (Y) {
        if (Y.copy) {
          const ne = s.value == null ? "" : String(s.value);
          ne !== "" && typeof navigator < "u" && navigator.clipboard && navigator.clipboard.writeText(ne);
          return;
        }
        if (Y.url && typeof window < "u") {
          window.open(Y.url, "_blank", "noopener,noreferrer");
          return;
        }
        Y.key && i("affix-action", Y.key);
      }
    }
    const E = `border-input bg-background h-9 rounded-md border px-3 text-sm disabled:opacity-50 ${Ue} ${Be}`, te = `bg-background h-9 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:outline-none disabled:opacity-50 ${Ue}`;
    function le(Y) {
      const ne = document.getElementById(`f-${s.field.key}`);
      if (!(ne instanceof HTMLTextAreaElement) && !(ne instanceof HTMLInputElement))
        return;
      const se = ne.selectionStart ?? ne.value.length, Me = ne.selectionEnd ?? se;
      ne.setRangeText(Y, se, Me, "end"), ne.dispatchEvent(new Event("input", { bubbles: !0 })), ne.focus();
    }
    return (Y, ne) => (t(), n(z, null, [
      e.field.type === "hidden" ? (t(), n(z, { key: 0 }, [], 64)) : (t(), n("div", Ji, [
        l("div", Yi, [
          l("label", {
            for: `f-${e.field.key}`,
            class: A(["text-sm font-medium leading-none", { "sr-only": e.field.labelHidden }])
          }, [
            U(c(e.field.label) + " ", 1),
            e.field.required ? (t(), n("span", Xi, "*")) : b("", !0)
          ], 10, Qi),
          e.field.hint ? (t(), n("span", {
            key: 0,
            class: A(["flex items-center gap-1", x(xt)])
          }, [
            U(c(e.field.hint) + " ", 1),
            e.field.hintAction ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "hover:text-foreground rounded px-1",
              "aria-label": e.field.hintAction.label ?? "Copy",
              disabled: e.field.disabled || e.processing,
              onClick: ne[0] || (ne[0] = (se) => V(e.field.hintAction))
            }, c(e.field.hintAction.label ?? "⧉"), 9, ed)) : b("", !0)
          ], 2)) : b("", !0)
        ]),
        P.value ? (t(), D(Ce(P.value), {
          key: 0,
          field: e.field,
          "model-value": e.value,
          values: e.values,
          options: e.options,
          errors: e.errors,
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": ne[1] || (ne[1] = (se) => i("change", se))
        }, null, 8, ["field", "model-value", "values", "options", "errors", "disabled"])) : e.field.type === "file" && e.upload ? (t(), D(qn, {
          key: 1,
          "model-value": e.value ?? null,
          accept: e.field.accept ?? [],
          "max-kilobytes": e.field.maxKilobytes ?? 10240,
          image: e.field.image ?? !1,
          disabled: e.field.disabled || e.processing,
          upload: e.upload,
          discard: e.discard,
          "onUpdate:modelValue": ne[2] || (ne[2] = (se) => i("change", se))
        }, null, 8, ["model-value", "accept", "max-kilobytes", "image", "disabled", "upload", "discard"])) : e.field.type === "repeater" ? (t(), D(x(a), {
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
        }, null, 8, ["model-value", "children", "field-key", "item-label", "min-items", "max-items", "collapsible", "addable", "deletable", "cloneable", "table", "relationship", "disabled", "errors", "child-options"])) : e.field.type === "builder" ? (t(), D(x(r), {
          key: 3,
          "model-value": e.value ?? null,
          blocks: e.field.blocks ?? [],
          "max-blocks": e.field.maxBlocks ?? null,
          disabled: e.field.disabled || e.processing,
          errors: e.errors,
          "onUpdate:modelValue": ne[4] || (ne[4] = (se) => i("change", se))
        }, null, 8, ["model-value", "blocks", "max-blocks", "disabled", "errors"])) : e.field.type === "richtext" ? (t(), D(Ri, {
          key: 4,
          "model-value": e.value ?? null,
          toolbar: e.field.toolbar ?? ["bold", "italic", "heading", "list", "link"],
          "max-length": e.field.maxLength ?? null,
          placeholder: e.field.placeholder ?? "Write a note…",
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": ne[5] || (ne[5] = (se) => i("change", se))
        }, null, 8, ["model-value", "toolbar", "max-length", "placeholder", "disabled"])) : e.field.type === "keyvalue" ? (t(), D(Li, {
          key: 5,
          "model-value": e.value ?? null,
          "key-label": e.field.keyLabel ?? "Key",
          "value-label": e.field.valueLabel ?? "Value",
          "max-pairs": e.field.maxPairs ?? null,
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": ne[6] || (ne[6] = (se) => i("change", se))
        }, null, 8, ["model-value", "key-label", "value-label", "max-pairs", "disabled"])) : e.field.type === "multiselect" ? (t(), D(on, {
          key: 6,
          "model-value": Array.isArray(e.value) ? e.value : [],
          options: e.options ?? [],
          disabled: e.field.disabled || e.processing,
          max: e.field.max ?? null,
          placeholder: e.field.placeholder ?? "Select…",
          "onUpdate:modelValue": ne[7] || (ne[7] = (se) => i("change", se))
        }, null, 8, ["model-value", "options", "disabled", "max", "placeholder"])) : W.value.length ? (t(), n("div", td, [
          e.field.morphTypeSelect === "toggle-buttons" ? (t(), D(Kn, {
            key: 0,
            field: { key: `${e.field.key}-type`, grouped: !0, inline: !0 },
            "model-value": K.value.type ?? null,
            options: W.value.map((se) => ({ value: se.value, label: se.label })),
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": ne[8] || (ne[8] = (se) => N(se == null ? "" : String(se)))
          }, null, 8, ["field", "model-value", "options", "disabled"])) : (t(), n("select", {
            key: 1,
            id: `f-${e.field.key}-type`,
            value: K.value.type ?? "",
            disabled: e.field.disabled || e.processing,
            class: A([
              "border-input bg-background h-9 rounded-md border px-3 text-sm disabled:opacity-50",
              x(Be)
            ]),
            onChange: ne[9] || (ne[9] = (se) => N(se.target.value))
          }, [
            ne[25] || (ne[25] = l("option", { value: "" }, "Type", -1)),
            (t(!0), n(z, null, j(W.value, (se) => (t(), n("option", {
              key: se.value,
              value: se.value
            }, c(se.label), 9, ad))), 128))
          ], 42, nd)),
          K.value.type && e.searchOptions ? (t(), n("div", ld, [
            l("button", {
              type: "button",
              class: A([
                "border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50",
                x(Be)
              ]),
              disabled: e.field.disabled || e.processing,
              onClick: $
            }, [
              l("span", {
                class: A(p.value || K.value.id ? "" : "text-muted-foreground")
              }, c(p.value ?? (K.value.id ? String(K.value.id) : "Search…")), 3)
            ], 10, od),
            d.value ? (t(), n("div", sd, [
              ge(l("input", {
                "onUpdate:modelValue": ne[10] || (ne[10] = (se) => u.value = se),
                type: "search",
                class: "h-9 w-full border-b bg-transparent px-3 text-sm outline-none",
                placeholder: "Type to search…",
                autofocus: ""
              }, null, 512), [
                [_e, u.value]
              ]),
              l("div", rd, [
                (t(!0), n(z, null, j(f.value, (se) => (t(), n("button", {
                  key: String(se.value),
                  type: "button",
                  class: "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
                  onClick: (Me) => Q(se)
                }, c(se.label), 9, id))), 128))
              ])
            ])) : b("", !0),
            d.value ? (t(), n("div", {
              key: 1,
              class: "fixed inset-0 z-40",
              onClick: ne[11] || (ne[11] = (se) => d.value = !1)
            })) : b("", !0)
          ])) : b("", !0)
        ])) : e.field.type === "select" && e.searchOptions ? (t(), n("div", dd, [
          l("button", {
            type: "button",
            class: A([
              "border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50",
              x(Be)
            ]),
            disabled: e.field.disabled || e.processing,
            "aria-invalid": !!e.error,
            onClick: $
          }, [
            l("span", {
              class: A(p.value || e.value ? "" : "text-muted-foreground")
            }, c(p.value ?? (e.value ? String(e.value) : "Search…")), 3),
            e.value ? (t(), n("span", {
              key: 0,
              class: "text-muted-foreground hover:text-foreground ml-2 text-xs",
              role: "button",
              "aria-label": "Clear selection",
              onClick: he(S, ["stop"])
            }, " ✕ ")) : b("", !0)
          ], 10, ud),
          d.value ? (t(), n("div", cd, [
            ge(l("input", {
              "onUpdate:modelValue": ne[12] || (ne[12] = (se) => u.value = se),
              type: "search",
              class: "h-9 w-full border-b bg-transparent px-3 text-sm outline-none",
              placeholder: "Type to search…",
              autofocus: ""
            }, null, 512), [
              [_e, u.value]
            ]),
            l("div", fd, [
              v.value ? (t(), n("p", md, " Searching… ")) : f.value.length === 0 ? (t(), n("p", pd, " No matches ")) : b("", !0),
              (t(!0), n(z, null, j(f.value, (se) => (t(), n("button", {
                key: String(se.value),
                type: "button",
                class: "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
                onClick: (Me) => k(se)
              }, c(se.label), 9, vd))), 128)),
              e.field.createOption && x(C) ? (t(), n("button", {
                key: 2,
                type: "button",
                class: "text-primary hover:bg-accent mt-1 flex w-full items-center gap-1.5 rounded border-t px-2 py-2 text-left text-sm font-medium",
                onClick: F
              }, [
                ne[26] || (ne[26] = l("span", { "aria-hidden": "true" }, "+", -1)),
                U(" " + c(T.value), 1)
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
          class: A([
            "border-input bg-background h-9 rounded-md border px-3 text-sm disabled:opacity-50",
            x(Be)
          ]),
          onChange: ne[14] || (ne[14] = (se) => i("change", se.target.value || null))
        }, [
          ne[27] || (ne[27] = l("option", { value: "" }, "-", -1)),
          (t(!0), n(z, null, j(e.options, (se) => (t(), n("option", {
            key: String(se.value),
            value: se.value
          }, c(se.label), 9, hd))), 128))
        ], 42, gd)) : e.field.type === "toggle" ? (t(), n("label", bd, [
          I(x(Je), {
            id: `f-${e.field.key}`,
            "model-value": !!e.value,
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": ne[15] || (ne[15] = (se) => i("change", se))
          }, null, 8, ["id", "model-value", "disabled"]),
          l("span", {
            class: A(x(xt))
          }, c(e.field.help ?? "Enabled"), 3)
        ])) : e.field.type === "checkbox" ? (t(), n("label", yd, [
          I(x(ni), {
            id: `f-${e.field.key}`,
            "model-value": !!e.value,
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": ne[16] || (ne[16] = (se) => i("change", se === !0))
          }, null, 8, ["id", "model-value", "disabled"]),
          l("span", {
            class: A(x(xt))
          }, c(e.field.help ?? e.field.label), 3)
        ])) : e.field.type === "textarea" && !J.value ? (t(), n("textarea", {
          key: 12,
          id: `f-${e.field.key}`,
          value: e.value ?? "",
          rows: e.field.rows ?? 3,
          placeholder: e.field.placeholder,
          disabled: e.field.disabled || e.processing,
          "aria-invalid": !!e.error,
          class: A([
            "border-input bg-background rounded-md border px-3 py-2 text-sm disabled:opacity-50",
            x(Ue),
            x(Be)
          ]),
          onInput: ne[17] || (ne[17] = (se) => i("change", se.target.value))
        }, null, 42, xd)) : e.field.type === "textarea" ? (t(), n("div", {
          key: 13,
          class: A([
            "border-input flex overflow-hidden rounded-md border",
            x(xn),
            { "opacity-50": e.field.disabled || e.processing }
          ])
        }, [
          e.field.prefix || e.field.prefixIcon ? (t(), n("span", kd, c(e.field.prefix ?? e.field.prefixIcon), 1)) : b("", !0),
          e.field.prefixAction ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.prefixAction.label ?? "Action",
            disabled: e.field.disabled || e.processing,
            onClick: ne[18] || (ne[18] = (se) => V(e.field.prefixAction))
          }, c(e.field.prefixAction.label ?? "⧉"), 9, $d)) : b("", !0),
          l("textarea", {
            id: `f-${e.field.key}`,
            value: e.value ?? "",
            rows: e.field.rows ?? 3,
            placeholder: e.field.placeholder,
            disabled: e.field.disabled || e.processing,
            "aria-invalid": !!e.error,
            class: A([
              "min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm focus-visible:outline-none",
              x(Ue)
            ]),
            onInput: ne[19] || (ne[19] = (se) => i("change", se.target.value))
          }, null, 42, wd),
          e.field.suffix || e.field.suffixIcon ? (t(), n("span", Cd, c(e.field.suffix ?? e.field.suffixIcon), 1)) : b("", !0),
          e.field.suffixAction ? (t(), n("button", {
            key: 3,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.suffixAction.label ?? "Copy",
            disabled: e.field.disabled || e.processing,
            onClick: ne[20] || (ne[20] = (se) => V(e.field.suffixAction))
          }, c(e.field.suffixAction.label ?? "⧉"), 9, Sd)) : b("", !0)
        ], 2)) : J.value ? (t(), n("div", {
          key: 15,
          class: A([
            "border-input flex h-9 overflow-hidden rounded-md border",
            x(xn),
            { "opacity-50": e.field.disabled || e.processing }
          ])
        }, [
          e.field.prefix || e.field.prefixIcon ? (t(), n("span", Bd, c(e.field.prefix ?? e.field.prefixIcon), 1)) : b("", !0),
          e.field.prefixAction ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.prefixAction.label ?? "Action",
            disabled: e.field.disabled || e.processing,
            onClick: ne[22] || (ne[22] = (se) => V(e.field.prefixAction))
          }, c(e.field.prefixAction.label ?? "⧉"), 9, Ad)) : b("", !0),
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
            class: A(te),
            onInput: ne[23] || (ne[23] = (se) => i("change", se.target.value))
          }, null, 40, _d),
          e.field.suffix || e.field.suffixIcon ? (t(), n("span", zd, c(e.field.suffix ?? e.field.suffixIcon), 1)) : b("", !0),
          e.field.suffixAction ? (t(), n("button", {
            key: 3,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.suffixAction.label ?? "Copy",
            disabled: e.field.disabled || e.processing,
            onClick: ne[24] || (ne[24] = (se) => V(e.field.suffixAction))
          }, c(e.field.suffixAction.label ?? "⧉"), 9, Pd)) : b("", !0)
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
          class: A(E),
          onInput: ne[21] || (ne[21] = (se) => i("change", se.target.value))
        }, null, 40, Md)),
        e.field.type === "number" && e.field.presets?.length ? (t(), n("div", Ld, [
          (t(!0), n(z, null, j(e.field.presets, (se) => (t(), n("button", {
            key: se,
            type: "button",
            disabled: e.field.disabled || e.processing,
            class: A([
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
          }, c(se), 11, Od))), 128))
        ])) : b("", !0),
        e.field.type === "textarea" && e.field.chips && Object.keys(e.field.chips).length ? (t(), n("div", jd, [
          (t(!0), n(z, null, j(e.field.chips, (se, Me) => (t(), n("button", {
            key: Me,
            type: "button",
            title: se,
            disabled: e.field.disabled || e.processing,
            class: "border-input hover:bg-muted rounded-md border px-2 py-1 font-mono text-xs transition-colors disabled:opacity-50",
            onClick: (vn) => le(String(Me))
          }, c(Me), 9, Vd))), 128))
        ])) : b("", !0),
        X.value ? (t(), n("a", {
          key: 18,
          href: X.value,
          class: "text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
        }, " Browse ", 8, Dd)) : b("", !0),
        e.error ? (t(), n("p", Td, c(e.error), 1)) : e.field.help && e.field.type !== "toggle" ? (t(), n("p", {
          key: 20,
          class: A(x(xt))
        }, c(e.field.help), 3)) : b("", !0)
      ])),
      e.field.createOption && x(C) ? (t(), D(li, {
        key: 2,
        open: B.value,
        title: _.value,
        description: e.field.help ?? void 0,
        fields: e.field.createOption,
        processing: M.value,
        errors: m.value,
        "general-error": g.value,
        onClose: Z,
        onSubmit: G
      }, null, 8, ["open", "title", "description", "fields", "processing", "errors", "general-error"])) : b("", !0)
    ], 64));
  }
}), Id = { class: "flex min-w-0 items-start gap-2.5" }, Ed = {
  key: 0,
  class: "bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
  "aria-hidden": "true"
}, Fd = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "size-3.5"
}, Nd = ["d"], Rd = { class: "min-w-0" }, Ud = { class: "text-sm font-semibold" }, Hd = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, qd = {
  key: 2,
  class: "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10"
}, Kd = { class: "border-b px-4 py-3.5 sm:px-5" }, Gd = { class: "text-sm font-semibold" }, Wd = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, Zd = {
  key: 4,
  class: "min-w-0 space-y-4"
}, Jd = {
  key: 7,
  class: "flex flex-col gap-3"
}, Yd = { class: "text-sm font-medium" }, Qd = {
  key: 0,
  class: "text-muted-foreground -mt-2 text-sm"
}, Xd = {
  key: 0,
  class: "mb-1 font-medium"
}, eu = ["onClick"], tu = {
  key: 0,
  class: "bg-destructive size-1.5 rounded-full",
  "aria-label": "has errors"
}, nu = { class: "flex items-center justify-between gap-3 border-t p-4" }, au = ["disabled"], Gn = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(!a.node.collapsed);
    function i() {
      const m = a.node.persistInQueryString;
      if (!m || typeof window > "u")
        return 0;
      const g = new URLSearchParams(window.location.search).get(m), _ = g === null ? NaN : Number.parseInt(g, 10), T = a.node.children?.length ?? 0;
      return Number.isInteger(_) && _ >= 0 && _ < T ? _ : 0;
    }
    const d = H(a.node.component === "tabs" ? i() : 0), u = H(a.node.component === "wizard" ? i() : 0);
    function f(m, g) {
      if (!m || typeof window > "u")
        return;
      const _ = new URL(window.location.href);
      _.searchParams.set(m, String(g)), window.history.replaceState(window.history.state, "", _);
    }
    pe(d, (m) => f(a.node.persistInQueryString, m)), pe(u, (m) => f(a.node.persistInQueryString, m));
    const v = y(
      () => (a.node.children ?? []).map((m) => ({
        label: m.label ?? "",
        description: m.description
      }))
    ), p = y(() => a.depth === 0), h = y(() => {
      const m = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline"
      }, g = { sm: "gap-2", md: "gap-4", lg: "gap-6" };
      return [
        m[a.node.align ?? "start"] ?? "items-start",
        g[a.node.gap ?? "md"] ?? "gap-4",
        a.node.wrap === !1 ? "flex-nowrap" : "flex-wrap"
      ];
    }), $ = y(() => {
      const m = {
        info: "border-border bg-muted/50 text-foreground",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
        danger: "border-destructive/30 bg-destructive/10 text-destructive"
      };
      return m[a.node.tone ?? "info"] ?? m.info;
    }), k = y(() => {
      const m = a.node.columns ?? 1;
      return m >= 3 ? "sm:grid-cols-3" : m === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
    });
    function S(m) {
      const g = m.children?.length ?? 1;
      return g >= 3 ? "md:grid-cols-3" : g === 2 ? "md:grid-cols-2" : "md:grid-cols-1";
    }
    function w(m = 1) {
      return m >= 4 ? "md:col-span-4" : m === 3 ? "md:col-span-3" : m === 2 ? "md:col-span-2" : "md:col-span-1";
    }
    function C(m) {
      const g = [], _ = (T) => {
        T.component === "field" && T.key && g.push(T.key), T.children?.forEach(_);
      };
      return _(m), g.some((T) => a.errors[T]);
    }
    function B(m) {
      if (m.hidden)
        return !1;
      const g = m.visibleWhen;
      return g ? a.values[g.field] == g.value : !0;
    }
    function M(m) {
      if (a.upload)
        return (g, _) => a.upload(m, g, _);
    }
    return (m, g) => {
      const _ = Qt("SchemaNode", !0);
      return e.node.component === "field" && B(e.node) ? (t(), D(Ge, {
        key: 0,
        field: e.node,
        value: e.values[e.node.key],
        values: e.values,
        error: e.errors[e.node.key],
        errors: e.errors,
        options: e.options[e.node.key],
        "child-options": e.options,
        processing: e.processing,
        "search-options": e.node.searchable && e.searchOptions ? (T) => e.searchOptions(e.node.key, T) : void 0,
        upload: M(e.node.key),
        discard: e.discard,
        onChange: g[0] || (g[0] = (T) => r("change", e.node.key, T)),
        onAffixAction: g[1] || (g[1] = (T) => r("affix-action", e.node.key, T))
      }, null, 8, ["field", "value", "values", "error", "errors", "options", "child-options", "processing", "search-options", "upload", "discard"])) : e.node.component === "section" && B(e.node) ? (t(), n("section", {
        key: 1,
        class: A(
          p.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("header", {
          class: A(["flex items-start justify-between gap-3", [
            p.value ? "px-4 py-3.5 sm:px-5" : "pb-2",
            e.node.collapsible ? "cursor-pointer select-none" : ""
          ]]),
          onClick: g[2] || (g[2] = (T) => e.node.collapsible && (s.value = !s.value))
        }, [
          l("div", Id, [
            e.node.icon ? (t(), n("div", Ed, [
              (t(), n("svg", Fd, [
                l("path", {
                  d: x(me)(e.node.icon)
                }, null, 8, Nd)
              ]))
            ])) : b("", !0),
            l("div", Rd, [
              l("h3", Ud, c(e.node.label), 1),
              e.node.description ? (t(), n("p", Hd, c(e.node.description), 1)) : b("", !0)
            ])
          ]),
          e.node.collapsible ? (t(), n("svg", {
            key: 0,
            viewBox: "0 0 24 24",
            class: A(["text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform", s.value ? "rotate-180" : ""]),
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.5"
          }, [...g[24] || (g[24] = [
            l("path", { d: "m6 9 6 6 6-6" }, null, -1)
          ])], 2)) : b("", !0)
        ], 2),
        s.value ? (t(), n("div", {
          key: 0,
          class: A(["grid grid-cols-1 gap-4", [k.value, p.value ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""]])
        }, [
          (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => (t(), n("div", {
            key: F,
            class: A(T.span && T.span >= 2 ? "sm:col-span-2" : "")
          }, [
            I(_, {
              node: T,
              values: e.values,
              errors: e.errors,
              options: e.options,
              processing: e.processing,
              "search-options": e.searchOptions,
              upload: e.upload,
              discard: e.discard,
              depth: e.depth + 1,
              onChange: g[3] || (g[3] = (Z, G) => r("change", Z, G)),
              onAffixAction: g[4] || (g[4] = (Z, G) => r("affix-action", Z, G))
            }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"])
          ], 2))), 128))
        ], 2)) : b("", !0)
      ], 2)) : e.node.component === "card" && B(e.node) ? (t(), n("section", qd, [
        l("header", Kd, [
          l("h3", Gd, c(e.node.title), 1),
          e.node.description ? (t(), n("p", Wd, c(e.node.description), 1)) : b("", !0)
        ]),
        l("div", {
          class: A(["grid grid-cols-1 gap-4 px-4 py-4", k.value])
        }, [
          (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => (t(), D(_, {
            key: F,
            node: T,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: g[5] || (g[5] = (Z, G) => r("change", Z, G)),
            onAffixAction: g[6] || (g[6] = (Z, G) => r("affix-action", Z, G))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)
      ])) : e.node.component === "columns" && B(e.node) ? (t(), n("div", {
        key: 3,
        class: A(["grid grid-cols-1 gap-4", S(e.node)])
      }, [
        (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => (t(), n("div", {
          key: F,
          class: A(T.component === "column" ? w(T.span) : "")
        }, [
          I(_, {
            node: T,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: g[7] || (g[7] = (Z, G) => r("change", Z, G)),
            onAffixAction: g[8] || (g[8] = (Z, G) => r("affix-action", Z, G))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"])
        ], 2))), 128))
      ], 2)) : e.node.component === "column" && B(e.node) ? (t(), n("div", Zd, [
        (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => (t(), D(_, {
          key: F,
          node: T,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: g[9] || (g[9] = (Z, G) => r("change", Z, G)),
          onAffixAction: g[10] || (g[10] = (Z, G) => r("affix-action", Z, G))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ])) : e.node.component === "grid" && B(e.node) ? (t(), n("div", {
        key: 5,
        class: A(["grid grid-cols-1 gap-4", k.value])
      }, [
        (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => (t(), D(_, {
          key: F,
          node: T,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: g[11] || (g[11] = (Z, G) => r("change", Z, G)),
          onAffixAction: g[12] || (g[12] = (Z, G) => r("affix-action", Z, G))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ], 2)) : e.node.component === "flex" && B(e.node) ? (t(), n("div", {
        key: 6,
        class: A(["flex", h.value])
      }, [
        (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => (t(), D(_, {
          key: F,
          node: T,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: g[13] || (g[13] = (Z, G) => r("change", Z, G)),
          onAffixAction: g[14] || (g[14] = (Z, G) => r("affix-action", Z, G))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ], 2)) : e.node.component === "fieldset" && B(e.node) ? (t(), n("fieldset", Jd, [
        l("legend", Yd, c(e.node.label), 1),
        e.node.description ? (t(), n("p", Qd, c(e.node.description), 1)) : b("", !0),
        l("div", {
          class: A(["grid grid-cols-1 gap-4", k.value])
        }, [
          (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => (t(), D(_, {
            key: F,
            node: T,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: g[15] || (g[15] = (Z, G) => r("change", Z, G)),
            onAffixAction: g[16] || (g[16] = (Z, G) => r("affix-action", Z, G))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)
      ])) : e.node.component === "callout" && B(e.node) ? (t(), n("div", {
        key: 8,
        role: "note",
        class: A(["rounded-lg border px-4 py-3 text-sm", $.value])
      }, [
        e.node.title ? (t(), n("p", Xd, c(e.node.title), 1)) : b("", !0),
        l("p", null, c(e.node.body), 1)
      ], 2)) : e.node.component === "tabs" && B(e.node) ? (t(), n("div", {
        key: 9,
        class: A(
          p.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("div", {
          class: A(["bg-muted/30 flex gap-1 overflow-x-auto p-1", p.value ? "rounded-t-lg border-b" : "rounded-md"])
        }, [
          (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => (t(), n("button", {
            key: F,
            type: "button",
            class: A([
              "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              d.value === F ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
            ]),
            onClick: (Z) => d.value = F
          }, [
            U(c(T.label) + " ", 1),
            C(T) ? (t(), n("span", tu)) : b("", !0)
          ], 10, eu))), 128))
        ], 2),
        (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => ge((t(), n("div", {
          key: F,
          class: A(["flex flex-col gap-5", p.value ? "p-4" : "pt-4"])
        }, [
          (t(!0), n(z, null, j(T.children ?? [], (Z, G) => (t(), D(_, {
            key: G,
            node: Z,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: g[17] || (g[17] = (X, W) => r("change", X, W)),
            onAffixAction: g[18] || (g[18] = (X, W) => r("affix-action", X, W))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)), [
          [qe, d.value === F]
        ])), 128))
      ], 2)) : e.node.component === "wizard" && B(e.node) ? (t(), n("div", {
        key: 10,
        class: A(
          p.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        I(Zr, {
          class: A(["p-4", p.value ? "border-b" : ""]),
          steps: v.value,
          "active-step": u.value,
          "has-error": (T) => C((e.node.children ?? [])[T]),
          "onUpdate:activeStep": g[19] || (g[19] = (T) => u.value = T)
        }, null, 8, ["class", "steps", "active-step", "has-error"]),
        (t(!0), n(z, null, j(e.node.children ?? [], (T, F) => ge((t(), n("div", {
          key: F,
          class: A(["flex flex-col gap-5", p.value ? "p-4" : "pt-4"])
        }, [
          (t(!0), n(z, null, j(T.children ?? [], (Z, G) => (t(), D(_, {
            key: G,
            node: Z,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: g[20] || (g[20] = (X, W) => r("change", X, W)),
            onAffixAction: g[21] || (g[21] = (X, W) => r("affix-action", X, W))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)), [
          [qe, u.value === F]
        ])), 128)),
        l("div", nu, [
          l("button", {
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-sm transition-colors disabled:pointer-events-none disabled:opacity-40",
            disabled: u.value === 0,
            onClick: g[22] || (g[22] = (T) => u.value--)
          }, " Back ", 8, au),
          u.value < (e.node.children ?? []).length - 1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm transition-opacity hover:opacity-90",
            onClick: g[23] || (g[23] = (T) => u.value++)
          }, " Next ")) : b("", !0)
        ])
      ], 2)) : b("", !0);
    };
  }
}), O8 = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H({});
    pe(
      () => a.open,
      (d) => {
        d && (s.value = {});
      }
    );
    function i() {
      r("submit", { ...s.value });
    }
    return (d, u) => (t(), D(ft, {
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
          onSubmit: he(i, ["prevent"])
        }, [
          (t(!0), n(z, null, j(e.form?.nodes ?? [], (f, v) => (t(), D(Gn, {
            key: v,
            node: f,
            values: s.value,
            errors: e.errors,
            processing: e.processing,
            options: e.formOptions,
            "search-options": e.searchOptions,
            onChange: u[0] || (u[0] = (p, h) => s.value[p] = h)
          }, null, 8, ["node", "values", "errors", "processing", "options", "search-options"]))), 128))
        ], 32)
      ]),
      _: 1
    }, 8, ["open", "title", "busy"]));
  }
}), lu = ["title"], ou = ["aria-label"], su = ["d"], ru = { class: "sr-only" }, iu = /* @__PURE__ */ L({
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
    return (v, p) => (t(), n("span", {
      class: "inline-flex items-center",
      title: f.value
    }, [
      (t(), n("svg", {
        viewBox: "0 0 24 24",
        class: A(["size-4", u.value]),
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2.2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        role: "img",
        "aria-label": f.value
      }, [
        l("path", { d: d.value }, null, 8, su)
      ], 10, ou)),
      l("span", ru, c(f.value), 1)
    ], 8, lu));
  }
}), du = ["aria-label"], uu = ["fill"], j8 = /* @__PURE__ */ L({
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
      (t(!0), n(z, null, j(a.value, (d) => (t(), n("svg", {
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
        }, null, 8, uu)
      ]))), 128))
    ], 8, du));
  }
}), cu = ["src"], fu = {
  key: 2,
  viewBox: "0 0 24 24",
  class: "size-1/2",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, mu = /* @__PURE__ */ L({
  __name: "ImageCell",
  props: {
    src: {},
    fallbackText: {},
    rounded: { type: Boolean, default: !0 },
    size: { default: "md" },
    fallback: { default: "initials" }
  },
  setup(e) {
    const o = e, a = H(!1);
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
      class: A(["bg-muted text-muted-foreground inline-flex shrink-0 items-center justify-center overflow-hidden text-[10px] font-medium", [r[e.size], e.rounded ? "rounded-full" : "rounded"]])
    }, [
      s.value && !a.value ? (t(), n("img", {
        key: 0,
        src: s.value,
        alt: "",
        loading: "lazy",
        class: "size-full object-cover",
        onError: u[0] || (u[0] = (f) => a.value = !0)
      }, null, 40, cu)) : e.fallback === "initials" ? (t(), n(z, { key: 1 }, [
        U(c(i.value), 1)
      ], 64)) : e.fallback === "icon" ? (t(), n("svg", fu, [...u[1] || (u[1] = [
        l("path", { d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" }, null, -1)
      ])])) : b("", !0)
    ], 2));
  }
}), pu = {
  key: 0,
  class: "text-muted-foreground"
}, vu = {
  key: 1,
  class: "inline-flex items-center gap-2"
}, gu = {
  key: 0,
  class: "font-mono text-xs"
}, hu = {
  key: 1,
  class: "sr-only"
}, bu = /* @__PURE__ */ L({
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
    return (s, i) => r.value === null ? (t(), n("span", pu, "-")) : (t(), n("span", vu, [
      l("span", {
        class: "size-4 shrink-0 rounded border",
        style: ie({ backgroundColor: r.value }),
        "aria-hidden": "true"
      }, null, 4),
      e.showValue ? (t(), n("span", gu, c(r.value), 1)) : (t(), n("span", hu, c(r.value), 1))
    ]));
  }
}), yu = { class: "inline-flex items-center" }, xu = ["checked", "aria-label"], ku = { class: "sr-only" }, V8 = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("span", yu, [
      l("input", {
        type: "checkbox",
        checked: a.value,
        disabled: "",
        "aria-readonly": "true",
        "aria-label": r.value,
        class: "border-input text-primary size-4 rounded disabled:opacity-100"
      }, null, 8, xu),
      l("span", ku, c(r.value), 1)
    ]));
  }
}), $u = {
  key: 0,
  class: "text-muted-foreground"
}, wu = {
  key: 1,
  class: "block max-w-[28rem] truncate font-mono text-xs"
}, D8 = /* @__PURE__ */ L({
  __name: "CodeCell",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, a = y(
      () => String(o.value ?? "").replace(/\s+/g, " ").trim()
    );
    return (r, s) => a.value ? (t(), n("code", wu, c(a.value), 1)) : (t(), n("span", $u, "—"));
  }
}), Cu = {
  key: 0,
  class: "font-mono text-xs"
}, Su = {
  key: 1,
  class: "text-muted-foreground"
}, Mu = {
  key: 2,
  class: "text-muted-foreground text-sm font-normal"
}, T8 = /* @__PURE__ */ L({
  __name: "KeyValueCell",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, a = y(
      () => o.value && typeof o.value == "object" && !Array.isArray(o.value) ? Object.keys(o.value) : null
    );
    return (r, s) => a.value === null && e.value != null ? (t(), n("span", Cu, c(e.value), 1)) : !a.value || a.value.length === 0 ? (t(), n("span", Su, "—")) : (t(), n("span", Mu, c(a.value.length) + " " + c(a.value.length === 1 ? "entry" : "entries"), 1));
  }
}), Bu = ["data-variant"], Au = "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none", We = /* @__PURE__ */ L({
  __name: "PkBadge",
  props: {
    variant: { default: "default" },
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
    }, r = y(
      () => [Au, a[o.variant], o.class].filter(Boolean).join(" ")
    );
    return (s, i) => (t(), n("span", {
      "data-slot": "badge",
      "data-variant": e.variant,
      class: A(r.value)
    }, [
      q(s.$slots, "default")
    ], 10, Bu));
  }
}), _u = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, zu = {
  key: 1,
  class: "inline-flex flex-wrap items-center gap-1"
}, I8 = /* @__PURE__ */ L({
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
    return (d, u) => r.value.length === 0 ? (t(), n("span", _u, "None")) : (t(), n("span", zu, [
      (t(!0), n(z, null, j(s.value, (f) => (t(), D(We, {
        key: f,
        variant: "secondary"
      }, {
        default: O(() => [
          U(c(f), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      i.value > 0 ? (t(), D(We, {
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
}), Pu = ["aria-checked", "aria-label", "title", "disabled"], Lu = ["value", "placeholder", "disabled"], Ou = ["value", "disabled"], ju = ["value"], E8 = /* @__PURE__ */ L({
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
    function f($) {
      const k = $.target.value;
      k !== String(a.value ?? "") && r("change", k);
    }
    function v($) {
      const S = $.target.value;
      S !== String(a.value ?? "") && r("change", S);
    }
    function p($) {
      $.target.blur();
    }
    function h($) {
      const k = $.target;
      k.value = String(a.value ?? ""), k.blur();
    }
    return ($, k) => e.type === "toggle" ? (t(), n("button", {
      key: 0,
      type: "button",
      role: "switch",
      "aria-checked": s.value,
      "aria-label": d.value,
      title: d.value,
      disabled: i.value,
      class: A(["relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50", s.value ? "bg-primary" : "bg-muted-foreground/30"]),
      onClick: he(u, ["stop"])
    }, [
      l("span", {
        class: A(["bg-background size-4 rounded-full shadow-sm transition-transform", s.value ? "translate-x-4.5" : "translate-x-0.5"])
      }, null, 2)
    ], 10, Pu)) : e.type === "text" ? (t(), n("input", {
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
        Ft(p, ["enter"]),
        Ft(h, ["esc"])
      ]
    }, null, 40, Lu)) : (t(), n("select", {
      key: 2,
      class: "bg-background hover:bg-accent focus:ring-ring w-full min-w-28 rounded-md border px-2 py-1 text-xs transition-colors focus:ring-2 focus:outline-none disabled:opacity-50",
      value: String(e.value ?? ""),
      disabled: i.value,
      onClick: k[1] || (k[1] = he(() => {
      }, ["stop"])),
      onChange: f
    }, [
      (t(!0), n(z, null, j(e.options, (S, w) => (t(), n("option", {
        key: w,
        value: w
      }, c(S), 9, ju))), 128))
    ], 40, Ou));
  }
}), dn = {
  success: "success",
  danger: "destructive",
  warning: "warning",
  info: "info",
  neutral: "outline"
};
function Vu(e) {
  return e != null && e !== "";
}
function Du(e) {
  const o = [];
  return e.type === "toggle" || e.type === "select" || e.type === "image" ? (e.align === "right" && o.push("text-right"), e.align === "center" && o.push("text-center"), o.join(" ")) : (e.key === "name" && o.push("font-medium"), e.mono && o.push("font-mono text-xs"), e.muted && o.push("text-muted-foreground"), e.transform === "upper" && o.push("uppercase"), e.transform === "lower" && o.push("lowercase"), e.align === "right" && o.push("text-right"), e.align === "center" && o.push("text-center"), o.join(" "));
}
function F8(e) {
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
      cellClass: Du(s),
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
const Tu = ["disabled", "aria-label", "aria-busy"], Iu = {
  class: "text-muted-foreground size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Eu = ["d"], Fu = { class: "text-muted-foreground px-2 py-1.5 text-xs font-medium" }, Nu = ["disabled", "onClick"], Ru = {
  key: 0,
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-label": "Current"
}, Uu = ["d"], Hu = {
  key: 1,
  class: "size-4 shrink-0",
  "aria-hidden": "true"
}, N8 = /* @__PURE__ */ L({
  __name: "BadgeResolver",
  props: {
    value: {},
    options: { default: () => ({}) },
    colors: { default: () => ({}) },
    defaultColor: { default: "neutral" },
    label: { default: "value" },
    busy: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["change"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.busy || a.disabled), i = y(() => String(a.value ?? "")), d = y(() => `Select ${(a.label || "value").trim().toLowerCase()}`);
    function u(h) {
      return typeof h == "boolean" ? h ? "1" : "" : String(h ?? "");
    }
    function f(h) {
      const $ = a.colors[u(h)] ?? a.defaultColor ?? "neutral";
      return dn[$] ?? "outline";
    }
    function v(h) {
      return a.options[h] ?? h;
    }
    function p(h, $) {
      if (s.value || h === i.value) {
        $();
        return;
      }
      r("change", h), $();
    }
    return (h, $) => (t(), n("div", {
      onClick: $[0] || ($[0] = he(() => {
      }, ["stop"]))
    }, [
      e.disabled ? (t(), D(We, {
        key: 1,
        variant: f(e.value),
        class: "capitalize"
      }, {
        default: O(() => [
          U(c(v(i.value) || "-"), 1)
        ]),
        _: 1
      }, 8, ["variant"])) : (t(), D(He, {
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
            I(We, {
              variant: f(e.value),
              class: "capitalize"
            }, {
              default: O(() => [
                U(c(v(i.value) || "-"), 1)
              ]),
              _: 1
            }, 8, ["variant"]),
            (t(), n("svg", Iu, [
              l("path", {
                d: x(me)("chevron-down")
              }, null, 8, Eu)
            ]))
          ], 8, Tu)
        ]),
        panel: O(({ close: k }) => [
          l("div", Fu, c(d.value), 1),
          (t(!0), n(z, null, j(e.options, (S, w) => (t(), n("button", {
            key: w,
            type: "button",
            role: "menuitem",
            class: "hover:bg-accent flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-left disabled:opacity-50",
            disabled: s.value,
            onClick: (C) => p(String(w), k)
          }, [
            I(We, {
              variant: f(w),
              class: "capitalize"
            }, {
              default: O(() => [
                U(c(S), 1)
              ]),
              _: 2
            }, 1032, ["variant"]),
            String(w) === i.value ? (t(), n("svg", Ru, [
              l("path", {
                d: x(me)("check")
              }, null, 8, Uu)
            ])) : (t(), n("span", Hu))
          ], 8, Nu))), 128))
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
function qu(e) {
  return kn[e ?? "gray"] ?? kn.gray;
}
const Ku = { class: "flex items-center justify-end" }, Gu = ["aria-label"], Wu = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, Zu = ["d"], Ju = ["href"], Yu = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Qu = ["d"], Xu = { class: "min-w-0 flex-1 truncate" }, ec = ["disabled", "onClick"], tc = ["d"], nc = { class: "min-w-0 flex-1 truncate" }, ac = {
  key: 0,
  class: "mt-0.5 border-t pt-0.5"
}, lc = ["disabled", "onClick"], oc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, sc = ["d"], rc = { class: "min-w-0 flex-1 truncate" }, ic = /* @__PURE__ */ L({
  __name: "RecordActions",
  props: {
    groups: {},
    title: {},
    busy: { default: null }
  },
  emits: ["run"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = H(null), d = H(null), u = y(() => r.groups.flatMap((B) => B.actions)), f = y(() => u.value.filter((B) => !B.destructive)), v = y(() => u.value.filter((B) => B.destructive));
    function p(B) {
      return qu(B.color);
    }
    const h = y(() => u.value.length === 0);
    function $(B) {
      s("run", B);
    }
    function k(B) {
      if (r.busy !== B.key) {
        if (B.link) {
          B.url && window.location.assign(B.url);
          return;
        }
        $(B);
      }
    }
    function S(B, M) {
      const m = M.toLowerCase().split("+").map((T) => T.trim()), g = m.at(-1);
      return !g || B.key.toLowerCase() !== g ? !1 : (B.ctrlKey || B.metaKey) === m.includes("mod") && B.shiftKey === m.includes("shift") && B.altKey === m.includes("alt");
    }
    function w(B) {
      h.value || (B.preventDefault(), i.value?.openAt(B.clientX, B.clientY));
    }
    function C(B) {
      const M = u.value.find(
        (F) => (F.keyBindings ?? []).some((Z) => S(B, Z))
      );
      if (M) {
        B.preventDefault(), k(M);
        return;
      }
      if (B.key !== "ArrowDown" && B.key !== "ArrowUp")
        return;
      const m = Array.from(
        d.value?.querySelectorAll("[data-menu-item]") ?? []
      );
      if (m.length === 0)
        return;
      B.preventDefault();
      const g = m.indexOf(document.activeElement), _ = B.key === "ArrowDown" ? 1 : -1, T = (g + _ + m.length) % m.length;
      m[T]?.focus();
    }
    return o({ openContextMenu: w }), (B, M) => (t(), n("div", Ku, [
      h.value ? b("", !0) : (t(), D(He, {
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
            (t(), n("svg", Wu, [
              l("path", {
                d: x(me)("more-vertical")
              }, null, 8, Zu)
            ]))
          ], 8, Gu)
        ]),
        panel: O(() => [
          l("div", {
            ref_key: "items",
            ref: d,
            class: "py-0.5",
            onKeydown: C
          }, [
            (t(!0), n(z, null, j(f.value, (m) => (t(), n(z, {
              key: m.key
            }, [
              m.link ? (t(), n("a", {
                key: 0,
                href: m.url ?? "#",
                "data-menu-item": "",
                role: "menuitem",
                class: A(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none", p(m)])
              }, [
                (t(), n("svg", Yu, [
                  l("path", {
                    d: x(Te)(m)
                  }, null, 8, Qu)
                ])),
                l("span", Xu, c(m.label), 1)
              ], 10, Ju)) : (t(), n("button", {
                key: 1,
                type: "button",
                "data-menu-item": "",
                role: "menuitem",
                class: A(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50", p(m)]),
                disabled: e.busy === m.key,
                onClick: (g) => $(m)
              }, [
                (t(), n("svg", {
                  class: A(["size-4 shrink-0", e.busy === m.key && "animate-pulse"]),
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "aria-hidden": "true"
                }, [
                  l("path", {
                    d: x(Te)(m)
                  }, null, 8, tc)
                ], 2)),
                l("span", nc, c(m.label), 1)
              ], 10, ec))
            ], 64))), 128)),
            v.value.length ? (t(), n("div", ac, [
              (t(!0), n(z, null, j(v.value, (m) => (t(), n("button", {
                key: m.key,
                type: "button",
                "data-menu-item": "",
                role: "menuitem",
                class: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                disabled: e.busy === m.key,
                onClick: (g) => $(m)
              }, [
                (t(), n("svg", oc, [
                  l("path", {
                    d: x(Te)({ ...m, destructive: !0 })
                  }, null, 8, sc)
                ])),
                l("span", rc, c(m.label), 1)
              ], 8, lc))), 128))
            ])) : b("", !0)
          ], 544)
        ]),
        _: 1
      }, 512))
    ]));
  }
}), dc = { class: "flex items-center justify-end gap-1" }, uc = { class: "hidden items-center gap-1 sm:flex" }, cc = ["href"], fc = {
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, mc = ["d"], pc = ["disabled", "onClick"], vc = ["d"], gc = {
  type: "button",
  class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors",
  "aria-haspopup": "menu"
}, hc = {
  key: 0,
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, bc = ["d"], yc = { class: "py-0.5" }, xc = ["href"], kc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, $c = ["d"], wc = { class: "min-w-0 flex-1 truncate" }, Cc = ["disabled", "onClick"], Sc = ["d"], Mc = { class: "min-w-0 flex-1 truncate" }, R8 = /* @__PURE__ */ L({
  __name: "InlineRecordActions",
  props: {
    groups: {},
    title: {},
    busy: { default: null }
  },
  emits: ["run"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = H(null), d = y(() => r.groups.filter((B) => !B.label)), u = y(() => r.groups.filter((B) => B.label)), f = y(() => d.value.flatMap((B) => B.actions)), v = y(() => f.value.filter((B) => !B.destructive)), p = y(() => f.value.filter((B) => B.destructive)), h = y(() => r.groups.every((B) => B.actions.length === 0)), $ = {
      primary: "text-primary",
      gray: "text-muted-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-500",
      danger: "text-destructive",
      info: "text-sky-600 dark:text-sky-400"
    };
    function k(B) {
      return $[B.color ?? "gray"] ?? $.gray;
    }
    function S(B) {
      s("run", B);
    }
    function w(B) {
      r.busy !== B.key && S(B);
    }
    function C(B) {
      h.value || i.value?.openContextMenu(B);
    }
    return o({ openContextMenu: C }), (B, M) => (t(), n("div", dc, [
      l("div", uc, [
        (t(!0), n(z, null, j([...v.value, ...p.value], (m) => (t(), n(z, {
          key: m.key
        }, [
          m.link ? (t(), n("a", {
            key: 0,
            href: m.url ?? "#",
            class: A(["hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors", k(m)])
          }, [
            (t(), n("svg", fc, [
              l("path", {
                d: x(Te)(m)
              }, null, 8, mc)
            ])),
            l("span", null, c(m.label), 1)
          ], 10, cc)) : (t(), n("button", {
            key: 1,
            type: "button",
            class: A(["hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50", k(m)]),
            disabled: e.busy === m.key,
            onClick: (g) => w(m)
          }, [
            (t(), n("svg", {
              class: A(["size-3.5 shrink-0", e.busy === m.key && "animate-pulse"]),
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "aria-hidden": "true"
            }, [
              l("path", {
                d: x(Te)(m)
              }, null, 8, vc)
            ], 2)),
            l("span", null, c(m.label), 1)
          ], 10, pc))
        ], 64))), 128)),
        (t(!0), n(z, null, j(u.value, (m) => (t(), D(He, {
          key: m.label,
          align: "end",
          placement: "left"
        }, {
          trigger: O(() => [
            l("button", gc, [
              m.icon ? (t(), n("svg", hc, [
                l("path", {
                  d: x(me)(m.icon)
                }, null, 8, bc)
              ])) : b("", !0),
              l("span", null, c(m.label), 1)
            ])
          ]),
          panel: O(() => [
            l("div", yc, [
              (t(!0), n(z, null, j([
                ...m.actions.filter((g) => !g.destructive),
                ...m.actions.filter((g) => g.destructive)
              ], (g) => (t(), n(z, {
                key: g.key
              }, [
                g.link ? (t(), n("a", {
                  key: 0,
                  href: g.url ?? "#",
                  role: "menuitem",
                  class: A(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none", g.destructive ? "text-destructive" : k(g)])
                }, [
                  (t(), n("svg", kc, [
                    l("path", {
                      d: x(Te)(g)
                    }, null, 8, $c)
                  ])),
                  l("span", wc, c(g.label), 1)
                ], 10, xc)) : (t(), n("button", {
                  key: 1,
                  type: "button",
                  role: "menuitem",
                  class: A([
                    "hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    g.destructive ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10" : k(g)
                  ]),
                  disabled: e.busy === g.key,
                  onClick: (_) => S(g)
                }, [
                  (t(), n("svg", {
                    class: A(["size-4 shrink-0", e.busy === g.key && "animate-pulse"]),
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
                    }, null, 8, Sc)
                  ], 2)),
                  l("span", Mc, c(g.label), 1)
                ], 10, Cc))
              ], 64))), 128))
            ])
          ]),
          _: 2
        }, 1024))), 128))
      ]),
      I(ic, {
        ref_key: "fallback",
        ref: i,
        class: "sm:hidden",
        groups: e.groups,
        title: e.title,
        busy: e.busy,
        onRun: M[0] || (M[0] = (m) => s("run", m))
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
}, St = 12, Mt = 20, Bc = [0, 0.25, 0.5, 0.75, 1], un = "alxtexhpanel.appearance", Ae = {
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
}, Ve = H({ ...Ae });
let Qe = !1;
const Wn = "alxtexhpanel.appearance.vars", Gt = "pk-appearance";
function lt() {
  return typeof window > "u" ? null : window;
}
let Bt = null;
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
  const o = lt();
  o && (o.__panelAppearance = { ...e });
}
function Ac(e) {
  if (typeof document > "u")
    return;
  let o = document.getElementById(Gt);
  o || (o = document.createElement("style"), o.id = Gt, document.head.appendChild(o));
  const a = Object.entries(e).map(([r, s]) => `${r}: ${s};`).join(" ");
  o.textContent = `:root { ${a} }`;
}
function U8() {
  Qe = !1, Bt = null, Ve.value = { ...Ae };
  const e = lt();
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
  const o = qt[e.primary] ?? qt.slate, a = Kt[e.surface] ?? Kt.neutral, r = a.chroma, s = a.hue, i = r > 0 ? r : 6e-3, d = r > 0 ? s : 250, f = cn(e) ? {
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
function _c(e) {
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
    return typeof o.fontSize == "string" && (o.fontSize = a[o.fontSize] ?? Ae.fontSize), (typeof o.fontSize != "number" || Number.isNaN(o.fontSize) || o.fontSize < St || o.fontSize > Mt) && (o.fontSize = Ae.fontSize), o;
  } catch {
    return { ...Ae };
  }
}
function zc() {
  const e = lt();
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
  const d = lt()?.__panelAppearanceApplied === !0;
  if (Bt !== s) {
    if (r && d && e) {
      Bt = s;
      try {
        const u = _c(a);
        localStorage.setItem(Wn, JSON.stringify(u));
      } catch {
      }
      return;
    }
    Wt(a);
  }
}
function H8() {
  Qn(zc());
}
function q8(e) {
  const o = e?.props?.appearance;
  o != null && typeof o == "object" && Qn(o);
}
let Xn = null;
function K8(e) {
  Xn = e;
}
let ea = {};
function Pc(e) {
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
  o.dataset.sidebar = s.sidebar, o.dataset.contentLayout = s.contentLayout, Ac(a), Jn(e), Bt = Zn(e);
  const i = lt();
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
    if (Qe || lt()?.__panelAppearanceApplied) {
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
    FONT_SIZE_MIN: St,
    FONT_SIZE_MAX: Mt,
    RADIUS_OPTIONS: Bc
  };
}
const Lc = ["aria-busy", "aria-describedby"], Oc = { class: "bg-background flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3" }, jc = { class: "min-w-0" }, Vc = { class: "flex shrink-0 items-center gap-2" }, Dc = ["disabled"], Tc = { class: "min-h-0 flex-1 overflow-y-auto overscroll-contain" }, Ic = {
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
    const a = e, r = o, s = H(null), i = `pk-slideover-title-${Xe()}`, d = `pk-slideover-description-${Xe()}`, u = /* @__PURE__ */ Symbol("pk-slideover");
    let f = null, v = !1;
    const p = H(!1), h = y(() => a.width ?? yo[a.size]), $ = y(
      () => [Un, a.padded ? bo : ""].filter(Boolean).join(" ")
    );
    function k(C) {
      p.value = C.target === C.currentTarget;
    }
    function S(C) {
      p.value && C.target === C.currentTarget && !a.busy && r("close"), p.value = !1;
    }
    function w(C) {
      if (!a.open)
        return;
      if (C.key === "Escape") {
        if (a.busy)
          return;
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
      const M = B[0], m = B[B.length - 1];
      C.shiftKey && document.activeElement === M ? (C.preventDefault(), m.focus()) : !C.shiftKey && document.activeElement === m && (C.preventDefault(), M.focus());
    }
    return pe(
      () => a.open,
      async (C) => {
        if (C) {
          f = document.activeElement, Hn(u), v = !0, document.addEventListener("keydown", w), await De(), s.value?.querySelector("input, button, [tabindex]")?.focus();
          return;
        }
        if (v) {
          const B = Ct(u);
          v = !1, document.removeEventListener("keydown", w), B && f?.focus?.(), f = null;
        }
      },
      { immediate: !0 }
    ), ke(() => {
      document.removeEventListener("keydown", w), v && (Ct(u), v = !1);
    }), (C, B) => (t(), D(mt, { to: "body" }, [
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
            class: A(["bg-background fixed inset-y-0 z-50 flex h-dvh max-h-dvh max-w-full flex-col shadow-2xl", [h.value, e.side === "left" ? "left-0 border-r" : "right-0 border-l"]]),
            role: "dialog",
            "aria-modal": "true",
            "aria-busy": e.busy ? "true" : void 0,
            "aria-labelledby": i,
            "aria-describedby": e.description ? d : void 0
          }, [
            l("header", Oc, [
              l("div", jc, [
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
              l("div", Vc, [
                q(C.$slots, "header-actions"),
                l("button", {
                  type: "button",
                  class: "text-muted-foreground hover:text-foreground disabled:opacity-50",
                  "aria-label": "Close",
                  disabled: e.busy,
                  onClick: B[0] || (B[0] = (M) => r("close"))
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
                ])], 8, Dc)
              ])
            ]),
            l("div", Tc, [
              l("div", {
                class: A($.value)
              }, [
                q(C.$slots, "default")
              ], 2)
            ]),
            C.$slots.footer ? (t(), n("footer", Ic, [
              q(C.$slots, "footer")
            ])) : b("", !0)
          ], 10, Lc)) : b("", !0)
        ]),
        _: 3
      }, 8, ["enter-from-class", "leave-to-class"])
    ]));
  }
}), Ec = { class: "flex flex-col gap-5 px-4 py-4" }, Fc = { class: "flex flex-col gap-2" }, Nc = { class: "grid grid-cols-8 gap-2" }, Rc = ["title", "aria-label", "aria-pressed", "onClick"], Uc = { class: "flex flex-col gap-2" }, Hc = { class: "grid grid-cols-8 gap-2" }, qc = ["title", "aria-label", "aria-pressed", "onClick"], Kc = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "absolute inset-0 m-auto size-4 text-black",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3.5"
}, Gc = { class: "flex flex-col gap-2" }, Wc = { class: "bg-muted/50 flex gap-0.5 rounded-md p-0.5" }, Zc = ["aria-pressed", "aria-label", "onClick"], Jc = { class: "text-sm font-semibold" }, Yc = { class: "bg-muted/50 flex gap-0.5 rounded-md p-0.5" }, Qc = ["onClick"], Xc = { class: "flex flex-col gap-2" }, ef = { class: "flex items-center justify-between" }, tf = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, nf = { class: "flex items-center gap-2" }, af = ["disabled"], lf = ["min", "max", "value"], of = ["disabled"], G8 = /* @__PURE__ */ L({
  __name: "AppearanceDrawer",
  setup(e) {
    const { appearance: o, set: a, reset: r, PRIMARY_COLORS: s, SURFACE_TINTS: i, RADIUS_OPTIONS: d } = ta(), u = H(!1), f = y(() => o.value.sidebarSide === "right"), v = y(() => f.value ? "left" : "right"), p = [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" }
    ], h = [
      { value: "compact", label: "Compact" },
      { value: "comfortable", label: "Comfortable" },
      { value: "spacious", label: "Spacious" }
    ], $ = [
      { value: "transparent", label: "Transparent" },
      { value: "filled", label: "Filled" }
    ], k = [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
      { value: "horizontal", label: "Top" }
    ], S = [
      { value: "full", label: "Full" },
      { value: "centered", label: "Centered" }
    ], w = [
      { value: "collapsible", label: "Collapsible" },
      { value: "drilldown", label: "Drill-down" }
    ];
    function C(B, M) {
      return `oklch(0.72 ${M * 3} ${B})`;
    }
    return (B, M) => (t(), n(z, null, [
      l("button", {
        type: "button",
        class: "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors",
        "aria-label": "Appearance settings",
        title: "Appearance",
        onClick: M[0] || (M[0] = (m) => u.value = !0)
      }, [...M[6] || (M[6] = [
        dt('<svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 1 0-20c5 0 9 3.6 9 8 0 2.2-1.8 4-4 4h-2.2a1.8 1.8 0 0 0-1.3 3 1.8 1.8 0 0 1-1.5 3z"></path><circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="10.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="15" cy="8.5" r="1.2" fill="currentColor" stroke="none"></circle></svg>', 1)
      ])]),
      I(Pt, {
        open: u.value,
        title: "Settings",
        side: v.value,
        width: "w-80",
        padded: !1,
        onClose: M[5] || (M[5] = (m) => u.value = !1)
      }, {
        "header-actions": O(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground text-xs font-normal hover:underline",
            onClick: M[1] || (M[1] = //@ts-ignore
            (...m) => x(r) && x(r)(...m))
          }, " Reset ")
        ]),
        default: O(() => [
          l("div", Ec, [
            l("section", Fc, [
              M[8] || (M[8] = l("h3", { class: "text-sm font-semibold" }, "Primary", -1)),
              l("div", Nc, [
                (t(!0), n(z, null, j(x(s), (m, g) => (t(), n("button", {
                  key: g,
                  type: "button",
                  class: "relative size-7 rounded-md transition-transform hover:scale-110",
                  style: ie({ background: m.value }),
                  title: m.label,
                  "aria-label": m.label,
                  "aria-pressed": x(o).primary === g,
                  onClick: (_) => x(a)({ primary: g })
                }, [
                  x(o).primary === g ? (t(), n("svg", {
                    key: 0,
                    viewBox: "0 0 24 24",
                    class: "absolute inset-0 m-auto size-4",
                    style: ie({ color: m.foreground }),
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "3.5"
                  }, [...M[7] || (M[7] = [
                    l("path", { d: "m5 13 4 4L19 7" }, null, -1)
                  ])], 4)) : b("", !0)
                ], 12, Rc))), 128))
              ])
            ]),
            l("section", Uc, [
              M[10] || (M[10] = l("h3", { class: "text-sm font-semibold" }, "Surface", -1)),
              l("div", Hc, [
                (t(!0), n(z, null, j(x(i), (m, g) => (t(), n("button", {
                  key: g,
                  type: "button",
                  class: "relative size-7 rounded-md border transition-transform hover:scale-110",
                  style: ie({ background: C(m.hue, m.chroma) }),
                  title: m.label,
                  "aria-label": m.label,
                  "aria-pressed": x(o).surface === g,
                  onClick: (_) => x(a)({ surface: g })
                }, [
                  x(o).surface === g ? (t(), n("svg", Kc, [...M[9] || (M[9] = [
                    l("path", { d: "m5 13 4 4L19 7" }, null, -1)
                  ])])) : b("", !0)
                ], 12, qc))), 128))
              ])
            ]),
            l("section", Gc, [
              M[11] || (M[11] = l("h3", { class: "text-sm font-semibold" }, "Radius", -1)),
              l("div", Wc, [
                (t(!0), n(z, null, j(x(d), (m) => (t(), n("button", {
                  key: m,
                  type: "button",
                  class: A([
                    "flex flex-1 flex-col items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors",
                    x(o).radius === m ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ]),
                  "aria-pressed": x(o).radius === m,
                  "aria-label": `${m}rem radius`,
                  onClick: (g) => x(a)({ radius: m })
                }, [
                  l("span", {
                    class: "border-foreground/50 block size-4 border-2",
                    style: ie({ borderRadius: `${Math.min(m, 0.5)}rem` })
                  }, null, 4),
                  U(" " + c(m), 1)
                ], 10, Zc))), 128))
              ])
            ]),
            (t(!0), n(z, null, j([
              { label: "Color scheme", key: "theme", options: p },
              { label: "Card style", key: "cardStyle", options: $ },
              { label: "Density", key: "density", options: h },
              { label: "Sidebar", key: "sidebarSide", options: k },
              { label: "Content layout", key: "contentLayout", options: S },
              { label: "Menu style", key: "menuStyle", options: w }
            ], (m) => (t(), n("section", {
              key: m.key,
              class: "flex flex-col gap-2"
            }, [
              l("h3", Jc, c(m.label), 1),
              l("div", Yc, [
                (t(!0), n(z, null, j(m.options, (g) => (t(), n("button", {
                  key: String(g.value),
                  type: "button",
                  class: A([
                    "flex-1 rounded px-2 py-1.5 text-xs transition-colors",
                    x(o)[m.key] === g.value ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ]),
                  onClick: (_) => x(a)({ [m.key]: g.value })
                }, c(g.label), 11, Qc))), 128))
              ])
            ]))), 128)),
            l("section", Xc, [
              l("div", ef, [
                M[12] || (M[12] = l("h3", { class: "text-sm font-semibold" }, "Font size", -1)),
                l("span", tf, c(x(o).fontSize) + "px", 1)
              ]),
              l("div", nf, [
                l("button", {
                  type: "button",
                  class: "border-input hover:bg-accent size-7 rounded-md border text-sm disabled:opacity-40",
                  disabled: x(o).fontSize <= x(St),
                  "aria-label": "Decrease font size",
                  onClick: M[2] || (M[2] = (m) => x(a)({ fontSize: x(o).fontSize - 1 }))
                }, " − ", 8, af),
                l("input", {
                  type: "range",
                  class: "accent-primary flex-1",
                  min: x(St),
                  max: x(Mt),
                  value: x(o).fontSize,
                  "aria-label": "Font size in pixels",
                  onInput: M[3] || (M[3] = (m) => x(a)({
                    fontSize: Number(m.target.value)
                  }))
                }, null, 40, lf),
                l("button", {
                  type: "button",
                  class: "border-input hover:bg-accent size-7 rounded-md border text-sm disabled:opacity-40",
                  disabled: x(o).fontSize >= x(Mt),
                  "aria-label": "Increase font size",
                  onClick: M[4] || (M[4] = (m) => x(a)({ fontSize: x(o).fontSize + 1 }))
                }, " + ", 8, of)
              ])
            ])
          ])
        ]),
        _: 1
      }, 8, ["open", "side"])
    ], 64));
  }
}), sf = {
  class: "bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur sm:hidden",
  "aria-label": "Primary",
  style: { paddingBottom: "env(safe-area-inset-bottom)" }
}, rf = { class: "flex items-stretch" }, df = ["href", "aria-current"], uf = {
  class: "size-5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, cf = ["d"], ff = { class: "w-full truncate text-center" }, mf = {
  key: 0,
  class: "flex-1"
}, pf = {
  class: "size-5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, vf = ["d"], gf = { class: "w-full truncate text-center" }, Dt = 5, W8 = /* @__PURE__ */ L({
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
    return (u, f) => (t(), n("nav", sf, [
      l("ul", rf, [
        (t(!0), n(z, null, j(s.value, (v) => (t(), n("li", {
          key: v.key,
          class: "flex-1"
        }, [
          l("a", {
            href: v.href,
            class: A([
              "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] transition-colors",
              d(v.href) ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            ]),
            "aria-current": d(v.href) ? "page" : void 0
          }, [
            (t(), n("svg", uf, [
              l("path", {
                d: x(me)(v.icon)
              }, null, 8, cf)
            ])),
            l("span", ff, c(v.title), 1)
          ], 10, df)
        ]))), 128)),
        i.value ? (t(), n("li", mf, [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:text-foreground flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] transition-colors",
            onClick: f[0] || (f[0] = (v) => r("more"))
          }, [
            (t(), n("svg", pf, [
              l("path", {
                d: x(me)("more-horizontal")
              }, null, 8, vf)
            ])),
            l("span", gf, c(e.moreLabel), 1)
          ])
        ])) : b("", !0)
      ])
    ]));
  }
}), hf = { class: "lg:shrink-0 lg:self-start" }, bf = { class: "lg:hidden" }, yf = ["aria-expanded", "aria-label"], xf = { class: "flex min-w-0 items-center gap-2" }, kf = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, $f = ["d"], wf = { class: "truncate" }, Cf = ["aria-label"], Sf = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Mf = ["d"], Bf = { class: "flex-1" }, Af = {
  key: 0,
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, _f = ["d"], zf = { class: "sticky top-6 hidden w-60 shrink-0 self-start lg:block" }, Pf = ["aria-label"], Lf = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Of = ["d"], Z8 = /* @__PURE__ */ L({
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
      const f = r(a.url.split("?")[0]), v = r(u);
      return f === v || f.startsWith(`${v}/`);
    }
    const i = y(
      () => o.items.find((u) => s(u.href)) ?? o.items[0]
    );
    function d(u) {
      return u?.icon ?? o.fallbackIcon;
    }
    return (u, f) => (t(), n("div", hf, [
      l("div", bf, [
        I(He, { align: "start" }, {
          trigger: O(({ open: v }) => [
            l("button", {
              type: "button",
              class: "border-input bg-background hover:bg-accent flex h-10 w-full items-center justify-between rounded-md border px-3 text-sm shadow-xs",
              "aria-expanded": v,
              "aria-haspopup": "listbox",
              "aria-label": e.ariaLabel
            }, [
              l("span", xf, [
                (t(), n("svg", kf, [
                  l("path", {
                    d: x(me)(d(i.value))
                  }, null, 8, $f)
                ])),
                l("span", wf, c(i.value?.title), 1)
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
            ], 8, yf)
          ]),
          panel: O(() => [
            l("div", {
              class: "flex flex-col",
              role: "listbox",
              "aria-label": e.ariaLabel
            }, [
              (t(!0), n(z, null, j(e.items, (v) => (t(), D(x(Rt), {
                key: v.href,
                href: v.href,
                role: "option",
                "aria-selected": s(v.href),
                class: A([
                  "flex items-center gap-2 rounded-sm px-2 py-2 text-sm",
                  s(v.href) ? "bg-muted font-medium" : "hover:bg-muted/70"
                ])
              }, {
                default: O(() => [
                  (t(), n("svg", Sf, [
                    l("path", {
                      d: x(me)(d(v))
                    }, null, 8, Mf)
                  ])),
                  l("span", Bf, c(v.title), 1),
                  s(v.href) ? (t(), n("svg", Af, [
                    l("path", {
                      d: x(me)("check")
                    }, null, 8, _f)
                  ])) : b("", !0)
                ]),
                _: 2
              }, 1032, ["href", "aria-selected", "class"]))), 128))
            ], 8, Cf)
          ]),
          _: 1
        })
      ]),
      l("aside", zf, [
        l("nav", {
          class: "flex flex-col space-y-1",
          "aria-label": e.ariaLabel
        }, [
          (t(!0), n(z, null, j(e.items, (v) => (t(), D(x(Rt), {
            key: v.href,
            href: v.href,
            class: A([
              x(Ye)({ variant: "ghost" }),
              "w-full justify-start",
              s(v.href) ? "bg-primary/10 text-foreground font-medium ring-1 ring-primary/15" : ""
            ])
          }, {
            default: O(() => [
              (t(), n("svg", Lf, [
                l("path", {
                  d: x(me)(d(v))
                }, null, 8, Of)
              ])),
              U(" " + c(v.title), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"]))), 128))
        ], 8, Pf)
      ])
    ]));
  }
}), jf = ["value"], we = /* @__PURE__ */ L({
  __name: "PkTextInput",
  props: {
    defaultValue: {},
    modelValue: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = `file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${Ue}`;
    return (i, d) => (t(), n("input", {
      "data-slot": "input",
      value: a.modelValue ?? a.defaultValue,
      class: A([s, a.class]),
      onInput: d[0] || (d[0] = (u) => r("update:modelValue", u.target.value))
    }, null, 42, jf));
  }
}), Vf = ["for"], ze = /* @__PURE__ */ L({
  __name: "PkFieldLabel",
  props: {
    for: {},
    class: {}
  },
  setup(e) {
    return (o, a) => (t(), n("label", {
      "data-slot": "label",
      for: o.$props.for,
      class: A([
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        o.$props.class
      ])
    }, [
      q(o.$slots, "default")
    ], 10, Vf));
  }
}), J8 = /* @__PURE__ */ L({
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
      class: A(["size-4 animate-spin", o.$props.class])
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
}), Df = { class: "relative flex items-center gap-2 has-disabled:opacity-50" }, Tf = ["id", "name", "value", "disabled", "maxlength"], If = ["data-active"], Ef = {
  key: 0,
  class: "pointer-events-none absolute inset-0 flex items-center justify-center"
}, Ff = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(!1), i = H(null), d = H("");
    be(() => {
      a.autofocus && i.value?.focus();
    });
    const u = y(
      () => Array.from({ length: a.length }, (B, M) => a.modelValue[M] ?? "")
    ), f = y(() => Math.min(a.modelValue.length, a.length - 1));
    function v(B) {
      return B.replace(/\D/g, "").slice(0, a.length);
    }
    function p(B) {
      a.disabled || B.length !== a.length || d.value !== B && (d.value = B, r("complete", B));
    }
    function h(B) {
      const M = v(B);
      M !== a.modelValue && r("update:modelValue", M), p(M);
    }
    function $(B) {
      h(B.target.value);
    }
    function k(B) {
      h(B.target.value);
    }
    function S() {
      h(i.value?.value ?? "");
    }
    function w(B) {
      B.animationName === "pkOtpAutofillStart" && S();
    }
    pe(
      () => a.modelValue,
      (B) => {
        B.length < a.length ? d.value = "" : p(B);
      }
    );
    let C;
    return be(() => {
      C = window.setInterval(() => {
        if (a.disabled || !i.value)
          return;
        (i.value.matches(":-webkit-autofill") || i.value.matches(":autofill") || document.activeElement === i.value) && S();
      }, 250);
    }), ga(() => {
      C !== void 0 && window.clearInterval(C);
    }), (B, M) => (t(), n("div", Df, [
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
        onInput: $,
        onChange: k,
        onAnimationstart: w,
        onFocus: M[0] || (M[0] = (m) => s.value = !0),
        onBlur: M[1] || (M[1] = (m) => s.value = !1)
      }, null, 40, Tf),
      (t(!0), n(z, null, j(u.value, (m, g) => (t(), n("div", {
        key: g,
        "data-slot": "input-otp-slot",
        "data-active": s.value && g === f.value,
        class: "data-[active=true]:border-ring data-[active=true]:ring-ring/50 border-input dark:bg-input/30 relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]"
      }, [
        U(c(m) + " ", 1),
        s.value && g === f.value && m === "" ? (t(), n("div", Ef, [...M[2] || (M[2] = [
          l("div", { class: "bg-foreground h-4 w-px animate-pulse duration-1000" }, null, -1)
        ])])) : b("", !0)
      ], 8, If))), 128))
    ]));
  }
}), Y8 = /* @__PURE__ */ zt(Ff, [["__scopeId", "data-v-0fdf60b6"]]), Nf = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Ie = /* @__PURE__ */ L({
  __name: "PkHeading",
  props: {
    title: {},
    description: {},
    variant: { default: "default" }
  },
  setup(e) {
    return (o, a) => (t(), n("header", {
      class: A(e.variant === "small" ? "" : "mb-8 space-y-0.5")
    }, [
      l("h2", {
        class: A(
          e.variant === "small" ? "mb-0.5 text-base font-medium" : "text-xl font-semibold tracking-tight"
        )
      }, c(e.title), 3),
      e.description ? (t(), n("p", Nf, c(e.description), 1)) : b("", !0)
    ], 2));
  }
}), Rf = {
  "data-slot": "page-header",
  class: "pk-section-heading flex flex-wrap items-start justify-between gap-3 pb-0.5"
}, Uf = { class: "min-w-0 space-y-1" }, Hf = { class: "flex flex-wrap items-center gap-2.5" }, qf = { class: "text-2xl font-semibold tracking-tight" }, Kf = {
  key: 0,
  class: "flex items-center gap-2"
}, Gf = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Wf = {
  key: 0,
  class: "flex shrink-0 flex-wrap items-center gap-2"
}, Q8 = /* @__PURE__ */ L({
  __name: "PkPageHeader",
  props: {
    title: {},
    purpose: {}
  },
  setup(e) {
    return (o, a) => (t(), n("header", Rf, [
      l("div", Uf, [
        l("div", Hf, [
          l("h1", qf, c(e.title), 1),
          o.$slots.status ? (t(), n("div", Kf, [
            q(o.$slots, "status")
          ])) : b("", !0)
        ]),
        e.purpose ? (t(), n("p", Gf, c(e.purpose), 1)) : b("", !0)
      ]),
      o.$slots.actions ? (t(), n("div", Wf, [
        q(o.$slots, "actions")
      ])) : b("", !0)
    ]));
  }
}), Zf = /* @__PURE__ */ L({
  __name: "Alert",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    variant: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert",
      class: A(x(oe)(x(Qf)({ variant: e.variant }), o.class)),
      role: "alert"
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), Jf = /* @__PURE__ */ L({
  __name: "AlertDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert-description",
      class: A(
        x(oe)(
          "col-start-2 text-sm font-normal text-muted-foreground [&_p]:leading-relaxed",
          o.class
        )
      )
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), Yf = /* @__PURE__ */ L({
  __name: "AlertTitle",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert-title",
      class: A(x(oe)("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), Qf = ln(
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
), Xf = { class: "list-inside list-disc text-sm" }, X8 = /* @__PURE__ */ L({
  __name: "PkAlertError",
  props: {
    errors: {},
    title: { default: "Something went wrong." }
  },
  setup(e) {
    const o = e, a = y(() => Array.from(new Set(o.errors)));
    return (r, s) => (t(), D(x(Zf), { variant: "destructive" }, {
      default: O(() => [
        I(x(sl), { class: "size-4" }),
        I(x(Yf), null, {
          default: O(() => [
            U(c(e.title), 1)
          ]),
          _: 1
        }),
        I(x(Jf), null, {
          default: O(() => [
            l("ul", Xf, [
              (t(!0), n(z, null, j(a.value, (i, d) => (t(), n("li", { key: d }, c(i), 1))), 128))
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
      class: A(
        x(oe)(
          "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          x(Ue),
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          a.class
        )
      )
    }, null, 2)), [
      [_e, x(s)]
    ]);
  }
}), em = { class: "relative" }, tm = ["aria-label"], eC = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkPasswordInput",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e, { expose: o }) {
    const a = e, r = H(!1), s = ba("inputRef");
    return o({
      $el: s,
      focus: () => s.value?.$el?.focus()
    }), (i, d) => (t(), n("div", em, [
      I(x(na), de({
        ref_key: "inputRef",
        ref: s,
        type: r.value ? "text" : "password",
        class: x(oe)("pr-10", a.class)
      }, i.$attrs), null, 16, ["type", "class"]),
      l("button", {
        type: "button",
        class: A(
          x(oe)(
            "text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 focus-visible:ring-[3px] focus-visible:outline-none"
          )
        ),
        "aria-label": r.value ? "Hide password" : "Show password",
        tabindex: -1,
        onClick: d[0] || (d[0] = (u) => r.value = !r.value)
      }, [
        r.value ? (t(), D(x(rl), {
          key: 0,
          class: "size-4"
        })) : (t(), D(x(il), {
          key: 1,
          class: "size-4"
        }))
      ], 10, tm)
    ]));
  }
}), aa = "@container min-w-0", nm = "grid grid-cols-1 gap-3 @lg:grid-cols-2 @3xl:grid-cols-3", tC = "grid grid-cols-1 gap-2 @lg:grid-cols-2 @3xl:grid-cols-3", am = "grid grid-cols-1 gap-4 @lg:grid-cols-2 @lg:gap-5 @3xl:grid-cols-3";
function lm(e) {
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
function nC(e, o) {
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
    const d = Array.from(
      { length: Math.min(a, s.length) },
      () => []
    );
    s.forEach((u, f) => {
      d[f % a].push(u);
    }), r.push({ type: "columns", columns: d }), s = [];
  };
  for (const d of e)
    lm(d.span) >= 2 ? (i(), r.push({ type: "wide", item: d })) : s.push(d);
  return i(), r;
}
function Cn(e, o) {
  return `${e}:${o}`;
}
function aC(e) {
  const o = /^(stat|chart|table):([a-z0-9_-]+)$/i.exec(e);
  return o ? {
    kind: o[1].toLowerCase(),
    key: o[2]
  } : null;
}
function Zt(e, o = 1) {
  return (e ?? o) >= 2 ? 2 : 1;
}
function lC(e, o, a, r) {
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
    const v = f.id.toLowerCase(), p = i.get(v);
    p && (u.add(v), d.push({
      id: v,
      kind: p.kind,
      key: p.source.key,
      span: Zt(f.span),
      hidden: !!f.hidden,
      source: p.source
    }));
  }
  for (const f of s)
    for (const v of f.items) {
      const p = Cn(f.kind, v.key);
      u.has(p) || d.push({
        id: p,
        kind: f.kind,
        key: v.key,
        span: Zt(v.span),
        hidden: !1,
        source: v
      });
    }
  return d;
}
function oC(e) {
  return {
    widgets: e.map((o) => ({
      id: o.id.toLowerCase(),
      span: Zt(o.span),
      hidden: !!o.hidden
    }))
  };
}
const la = "Upload a PNG with a transparent background so it sits on invoices and contracts without a white box.", om = "This image has no transparent background. Upload a PNG (or WebP) with alpha so it sits on invoices and contracts without a white box.", sm = "JPEG files are fully opaque and stamp a white rectangle. Upload a PNG with a transparent background.";
function rm(e) {
  const o = e.name.toLowerCase(), a = e.type.toLowerCase();
  return a === "image/jpeg" || a === "image/jpg" || o.endsWith(".jpg") || o.endsWith(".jpeg");
}
function im(e) {
  const o = e.name.toLowerCase(), a = e.type.toLowerCase();
  return a === "image/png" || a === "image/webp" || o.endsWith(".png") || o.endsWith(".webp");
}
async function dm(e) {
  const o = URL.createObjectURL(e);
  try {
    const a = await um(o), r = document.createElement("canvas"), s = Math.max(1, a.naturalWidth), i = Math.max(1, a.naturalHeight);
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
function um(e) {
  return new Promise((o, a) => {
    const r = new Image();
    r.onload = () => o(r), r.onerror = () => a(new Error("Could not read that image.")), r.src = e;
  });
}
async function cm(e) {
  if (rm(e))
    throw new Error(sm);
  if (!im(e))
    throw new Error(la);
  if (!await dm(e))
    throw new Error(om);
}
const sC = /* @__PURE__ */ L({
  __name: "SheetClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(tt), de({ "data-slot": "sheet-close" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), fm = /* @__PURE__ */ L({
  __name: "SheetDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), D(x(Vn), de({
      "data-slot": "sheet-description",
      class: x(oe)("text-sm text-muted-foreground font-normal", o.class)
    }, x(a)), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), rC = /* @__PURE__ */ L({
  __name: "SheetFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sheet-footer",
      class: A(x(oe)("mt-auto flex flex-col gap-2 p-4", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), mm = /* @__PURE__ */ L({
  __name: "SheetHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sheet-header",
      class: A(x(oe)("flex flex-col gap-1.5 p-4", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), pm = /* @__PURE__ */ L({
  __name: "SheetTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), D(x(Dn), de({
      "data-slot": "sheet-title",
      class: x(oe)("text-foreground font-semibold", o.class)
    }, x(a)), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), iC = /* @__PURE__ */ L({
  __name: "SheetTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(Tn), de({ "data-slot": "sheet-trigger" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Sn = "sidebar_state", vm = 3600 * 24 * 7, gm = "16rem", hm = "18rem", bm = "3rem", ym = "b", [Lt, xm] = Ba("Sidebar"), km = { class: "flex h-full w-full flex-col" }, $m = ["data-state", "data-collapsible", "data-variant", "data-side"], wm = {
  "data-sidebar": "sidebar",
  class: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
}, dC = /* @__PURE__ */ L({
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
      q(d.$slots, "default")
    ], 16)) : x(a) ? (t(), D(x(sn), de({
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
            "--sidebar-width": x(hm)
          })
        }, {
          default: O(() => [
            I(mm, { class: "sr-only" }, {
              default: O(() => [
                I(pm, null, {
                  default: O(() => [...u[0] || (u[0] = [
                    U("Sidebar", -1)
                  ])]),
                  _: 1
                }),
                I(fm, null, {
                  default: O(() => [...u[1] || (u[1] = [
                    U("Displays the mobile sidebar.", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }),
            l("div", km, [
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
        class: A(
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
        l("div", wm, [
          q(d.$slots, "default")
        ])
      ], 16)
    ], 8, $m));
  }
}), uC = /* @__PURE__ */ L({
  __name: "SidebarContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      class: A(
        x(oe)(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          o.class
        )
      )
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), cC = /* @__PURE__ */ L({
  __name: "SidebarFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      class: A(x(oe)("flex flex-col gap-2 p-2", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), fC = /* @__PURE__ */ L({
  __name: "SidebarGroup",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      class: A(x(oe)("relative flex w-full min-w-0 flex-col p-2", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), mC = /* @__PURE__ */ L({
  __name: "SidebarGroupAction",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(nt), {
      "data-slot": "sidebar-group-action",
      "data-sidebar": "group-action",
      as: e.as,
      "as-child": e.asChild,
      class: A(
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
}), pC = /* @__PURE__ */ L({
  __name: "SidebarGroupContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      class: A(x(oe)("w-full text-sm", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), vC = /* @__PURE__ */ L({
  __name: "SidebarGroupLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(nt), {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      as: e.as,
      "as-child": e.asChild,
      class: A(
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
}), gC = /* @__PURE__ */ L({
  __name: "SidebarHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      class: A(x(oe)("flex flex-col gap-2 p-2", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), hC = /* @__PURE__ */ L({
  __name: "SidebarInput",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(na), {
      "data-slot": "sidebar-input",
      "data-sidebar": "input",
      class: A(x(oe)("bg-background h-8 w-full shadow-none", o.class))
    }, {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), bC = /* @__PURE__ */ L({
  __name: "SidebarInset",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("main", {
      "data-slot": "sidebar-inset",
      class: A(
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
}), yC = /* @__PURE__ */ L({
  __name: "SidebarMenu",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("ul", {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      class: A(x(oe)("flex w-full min-w-0 flex-col gap-1", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), xC = /* @__PURE__ */ L({
  __name: "SidebarMenuAction",
  props: {
    asChild: { type: Boolean },
    as: { default: "button" },
    showOnHover: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(nt), {
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      class: A(
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
}), kC = /* @__PURE__ */ L({
  __name: "SidebarMenuBadge",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-menu-badge",
      "data-sidebar": "menu-badge",
      class: A(
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
}), Cm = /* @__PURE__ */ L({
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
    return (i, d) => (t(), D(x(Aa), de({ "data-slot": "tooltip" }, x(s)), {
      default: O((u) => [
        q(i.$slots, "default", Le(Ne(u)))
      ]),
      _: 3
    }, 16));
  }
}), Sm = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(_a), null, {
      default: O(() => [
        I(x(za), de({ "data-slot": "tooltip-content" }, { ...x(i), ...d.$attrs }, {
          class: x(oe)(
            "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
            a.class
          )
        }), {
          default: O(() => [
            q(d.$slots, "default"),
            I(x(Pa), { class: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), $C = /* @__PURE__ */ L({
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
    return (a, r) => (t(), D(x(In), Le(Ne(o)), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Mm = /* @__PURE__ */ L({
  __name: "TooltipTrigger",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(La), de({ "data-slot": "tooltip-trigger" }, o), {
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
    return (a, r) => (t(), D(x(nt), de({
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": e.size,
      "data-active": e.isActive,
      class: x(oe)(x(Am)({ variant: e.variant, size: e.size }), o.class),
      as: e.as,
      "as-child": e.asChild
    }, a.$attrs), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-size", "data-active", "class", "as", "as-child"]));
  }
}), wC = /* @__PURE__ */ L({
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
    return (i, d) => e.tooltip ? (t(), D(x(Cm), { key: 1 }, {
      default: O(() => [
        I(x(Mm), { "as-child": "" }, {
          default: O(() => [
            I(Mn, Le(Ne({ ...x(s), ...i.$attrs })), {
              default: O(() => [
                q(i.$slots, "default")
              ]),
              _: 3
            }, 16)
          ]),
          _: 3
        }),
        I(x(Sm), {
          side: "right",
          align: "center",
          hidden: x(r) !== "collapsed" || x(a)
        }, {
          default: O(() => [
            typeof e.tooltip == "string" ? (t(), n(z, { key: 0 }, [
              U(c(e.tooltip), 1)
            ], 64)) : (t(), D(Ce(e.tooltip), { key: 1 }))
          ]),
          _: 1
        }, 8, ["hidden"])
      ]),
      _: 3
    })) : (t(), D(Mn, Le(de({ key: 0 }, { ...x(s), ...i.$attrs })), {
      default: O(() => [
        q(i.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), CC = /* @__PURE__ */ L({
  __name: "SidebarMenuItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      class: A(x(oe)("group/menu-item relative", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), Bn = "animate-pulse rounded-md bg-primary/10", SC = /* @__PURE__ */ L({
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
      class: A(x(oe)("flex h-8 items-center gap-2 rounded-md px-2", o.class))
    }, [
      e.showIcon ? (t(), n("div", {
        key: 0,
        class: A(x(oe)(Bn, "size-4")),
        "data-sidebar": "menu-skeleton-icon"
      }, null, 2)) : b("", !0),
      l("div", {
        class: A(x(oe)(Bn, "h-4 max-w-(--skeleton-width) flex-1")),
        "data-sidebar": "menu-skeleton-text",
        style: ie({ "--skeleton-width": a.value })
      }, null, 6)
    ], 2));
  }
}), MC = /* @__PURE__ */ L({
  __name: "SidebarMenuSub",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("ul", {
      "data-slot": "sidebar-menu-sub",
      "data-sidebar": "menu-badge",
      class: A(
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
}), BC = /* @__PURE__ */ L({
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
    return (a, r) => (t(), D(x(nt), {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      as: e.as,
      "as-child": e.asChild,
      "data-size": e.size,
      "data-active": e.isActive,
      class: A(
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
}), AC = /* @__PURE__ */ L({
  __name: "SidebarMenuSubItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      class: A(x(oe)("group/menu-sub-item relative", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), _C = /* @__PURE__ */ L({
  __name: "SidebarProvider",
  props: {
    defaultOpen: { type: Boolean, default: !hl?.cookie.includes(`${Sn}=false`) },
    open: { type: Boolean, default: void 0 },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = vl("(max-width: 767px)"), i = H(!1), d = Rn(a, "open", r, {
      defaultValue: a.defaultOpen ?? !1,
      passive: a.open === void 0
    });
    function u(h) {
      d.value = h, document.cookie = `${Sn}=${d.value}; path=/; max-age=${vm}`;
    }
    function f(h) {
      i.value = h;
    }
    function v() {
      return s.value ? f(!i.value) : u(!d.value);
    }
    gl("keydown", (h) => {
      h.key === ym && (h.metaKey || h.ctrlKey) && (h.preventDefault(), v());
    });
    const p = y(() => s.value || d.value ? "expanded" : "collapsed");
    return xm({
      state: p,
      open: d,
      setOpen: u,
      isMobile: s,
      openMobile: i,
      setOpenMobile: f,
      toggleSidebar: v
    }), (h, $) => (t(), D(x(In), { "delay-duration": 0 }, {
      default: O(() => [
        l("div", de({
          "data-slot": "sidebar-wrapper",
          style: {
            "--sidebar-width": x(gm),
            "--sidebar-width-icon": x(bm)
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
}), zC = /* @__PURE__ */ L({
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
      class: A(
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
}), Bm = /* @__PURE__ */ L({
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
    return (r, s) => (t(), D(x(Oa), de({ "data-slot": "separator" }, x(a), {
      class: x(oe)(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        o.class
      )
    }), null, 16, ["class"]));
  }
}), PC = /* @__PURE__ */ L({
  __name: "SidebarSeparator",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(Bm), {
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      class: A(x(oe)("bg-sidebar-border mx-2 w-auto", o.class))
    }, {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), LC = /* @__PURE__ */ L({
  __name: "SidebarTrigger",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { isMobile: a, state: r, toggleSidebar: s } = Lt();
    return (i, d) => (t(), D(ce, {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      class: A(x(oe)("h-7 w-7", o.class)),
      onClick: x(s)
    }, {
      default: O(() => [
        x(a) || x(r) === "collapsed" ? (t(), D(x(dl), { key: 0 })) : (t(), D(x(ul), { key: 1 })),
        d[0] || (d[0] = l("span", { class: "sr-only" }, "Toggle sidebar", -1))
      ]),
      _: 1
    }, 8, ["class", "onClick"]));
  }
}), Am = ln(
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
), OC = /* @__PURE__ */ L({
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
    return (i, d) => (t(), D(x(ja), de({ "data-slot": "dropdown-menu" }, x(s)), {
      default: O((u) => [
        q(i.$slots, "default", Le(Ne(u)))
      ]),
      _: 3
    }, 16));
  }
}), _m = { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, jC = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(Va), de({ "data-slot": "dropdown-menu-checkbox-item" }, x(i), {
      class: x(oe)(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        a.class
      )
    }), {
      default: O(() => [
        l("span", _m, [
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
}), VC = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(Da), null, {
      default: O(() => [
        I(x(Ta), de({ "data-slot": "dropdown-menu-content" }, { ...d.$attrs, ...x(i) }, {
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
}), DC = /* @__PURE__ */ L({
  __name: "DropdownMenuGroup",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(Ia), de({ "data-slot": "dropdown-menu-group" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), TC = /* @__PURE__ */ L({
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
    return (s, i) => (t(), D(x(Ea), de({
      "data-slot": "dropdown-menu-item",
      "data-inset": e.inset ? "" : void 0,
      "data-variant": e.variant
    }, x(r), {
      class: x(oe)(
        'focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        o.class
      )
    }), {
      default: O(() => [
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-inset", "data-variant", "class"]));
  }
}), IC = /* @__PURE__ */ L({
  __name: "DropdownMenuLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, a = ve(o, "class", "inset"), r = Oe(a);
    return (s, i) => (t(), D(x(Fa), de({
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
}), EC = /* @__PURE__ */ L({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), D(x(Na), de({ "data-slot": "dropdown-menu-radio-group" }, x(s)), {
      default: O(() => [
        q(i.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), zm = { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, FC = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(Ra), de({ "data-slot": "dropdown-menu-radio-item" }, x(i), {
      class: x(oe)(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        a.class
      )
    }), {
      default: O(() => [
        l("span", zm, [
          I(x(En), null, {
            default: O(() => [
              q(d.$slots, "indicator-icon", {}, () => [
                I(x(cl), { class: "size-2 fill-current" })
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
}), NC = /* @__PURE__ */ L({
  __name: "DropdownMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), D(x(Ua), de({ "data-slot": "dropdown-menu-separator" }, x(a), {
      class: x(oe)("bg-border -mx-1 my-1 h-px", o.class)
    }), null, 16, ["class"]));
  }
}), RC = /* @__PURE__ */ L({
  __name: "DropdownMenuShortcut",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("span", {
      "data-slot": "dropdown-menu-shortcut",
      class: A(x(oe)("text-muted-foreground ml-auto text-xs tracking-widest", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), UC = /* @__PURE__ */ L({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = ye(e, o);
    return (i, d) => (t(), D(x(Ha), de({ "data-slot": "dropdown-menu-sub" }, x(s)), {
      default: O((u) => [
        q(i.$slots, "default", Le(Ne(u)))
      ]),
      _: 3
    }, 16));
  }
}), HC = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(qa), de({ "data-slot": "dropdown-menu-sub-content" }, x(i), {
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
}), qC = /* @__PURE__ */ L({
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
    return (s, i) => (t(), D(x(Ka), de({ "data-slot": "dropdown-menu-sub-trigger" }, x(r), {
      "data-inset": e.inset ? "" : void 0,
      class: x(oe)(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*="text-"])]:text-muted-foreground',
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
}), KC = /* @__PURE__ */ L({
  __name: "DropdownMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const a = Oe(e);
    return (r, s) => (t(), D(x(Ga), de({ "data-slot": "dropdown-menu-trigger" }, x(a)), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), GC = /* @__PURE__ */ L({
  __name: "Avatar",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(Wa), {
      "data-slot": "avatar",
      class: A(x(oe)("relative flex size-8 shrink-0 overflow-hidden rounded-full", o.class))
    }, {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), WC = /* @__PURE__ */ L({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), D(x(Za), de({ "data-slot": "avatar-fallback" }, x(a), {
      class: x(oe)("bg-muted flex size-full items-center justify-center rounded-full", o.class)
    }), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), ZC = /* @__PURE__ */ L({
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
    return (a, r) => (t(), D(x(Ja), de({ "data-slot": "avatar-image" }, o, { class: "aspect-square size-full" }), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), JC = /* @__PURE__ */ L({
  __name: "Breadcrumb",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("nav", {
      "aria-label": "breadcrumb",
      "data-slot": "breadcrumb",
      class: A(o.class)
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), YC = /* @__PURE__ */ L({
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
      class: A(x(oe)("flex size-9 items-center justify-center", o.class))
    }, [
      q(a.$slots, "default", {}, () => [
        I(x(fl), { class: "size-4" })
      ]),
      r[0] || (r[0] = l("span", { class: "sr-only" }, "More", -1))
    ], 2));
  }
}), QC = /* @__PURE__ */ L({
  __name: "BreadcrumbItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "breadcrumb-item",
      class: A(x(oe)("inline-flex items-center gap-1.5", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), XC = /* @__PURE__ */ L({
  __name: "BreadcrumbLink",
  props: {
    asChild: { type: Boolean },
    as: { default: "a" },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(nt), {
      "data-slot": "breadcrumb-link",
      as: e.as,
      "as-child": e.asChild,
      class: A(x(oe)("hover:text-foreground transition-colors", o.class))
    }, {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), e6 = /* @__PURE__ */ L({
  __name: "BreadcrumbList",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("ol", {
      "data-slot": "breadcrumb-list",
      class: A(
        x(oe)(
          "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
          o.class
        )
      )
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), t6 = /* @__PURE__ */ L({
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
      class: A(x(oe)("text-foreground font-normal", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), n6 = /* @__PURE__ */ L({
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
      class: A(x(oe)("[&>svg]:size-3.5", o.class))
    }, [
      q(a.$slots, "default", {}, () => [
        I(x(Nn))
      ])
    ], 2));
  }
}), Pm = { class: "absolute top-full left-0 isolate z-50 flex justify-center" }, Lm = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("div", Pm, [
      I(x(Ya), de({ "data-slot": "navigation-menu-viewport" }, x(r), {
        class: x(oe)(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--reka-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--reka-navigation-menu-viewport-width)] left-[var(--reka-navigation-menu-viewport-left)]",
          o.class
        )
      }), null, 16, ["class"])
    ]));
  }
}), a6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(Qa), de({
      "data-slot": "navigation-menu",
      "data-viewport": e.viewport
    }, x(i), {
      class: x(oe)(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        a.class
      )
    }), {
      default: O((f) => [
        q(d.$slots, "default", Le(Ne(f))),
        e.viewport ? (t(), D(Lm, { key: 0 })) : b("", !0)
      ]),
      _: 3
    }, 16, ["data-viewport", "class"]));
  }
}), l6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(Xa), de({ "data-slot": "navigation-menu-content" }, x(i), {
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
}), o6 = /* @__PURE__ */ L({
  __name: "NavigationMenuIndicator",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), D(x(el), de({ "data-slot": "navigation-menu-indicator" }, x(r), {
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
}), s6 = /* @__PURE__ */ L({
  __name: "NavigationMenuItem",
  props: {
    value: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), D(x(tl), de({ "data-slot": "navigation-menu-item" }, x(a), {
      class: x(oe)("relative", o.class)
    }), {
      default: O(() => [
        q(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), r6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(nl), de({ "data-slot": "navigation-menu-link" }, x(i), {
      class: x(oe)(
        'data-active:focus:bg-accent data-active:hover:bg-accent data-active:bg-accent/50 data-active:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*="text-"])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*="size-"])]:size-4',
        a.class
      )
    }), {
      default: O(() => [
        q(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), i6 = /* @__PURE__ */ L({
  __name: "NavigationMenuList",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), D(x(al), de({ "data-slot": "navigation-menu-list" }, x(r), {
      class: x(oe)("group flex flex-1 list-none items-center justify-center gap-1", o.class)
    }), {
      default: O(() => [
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), d6 = /* @__PURE__ */ L({
  __name: "NavigationMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), D(x(ll), de({ "data-slot": "navigation-menu-trigger" }, x(r), {
      class: x(oe)(x(Om)(), "group", o.class)
    }), {
      default: O(() => [
        q(s.$slots, "default"),
        I(x(ml), {
          class: "relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Om = ln(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
), u6 = /* @__PURE__ */ L({
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
    return (i, d) => (t(), D(x(jn), de({ "data-slot": "dialog" }, x(s)), {
      default: O((u) => [
        q(i.$slots, "default", Le(Ne(u)))
      ]),
      _: 3
    }, 16));
  }
}), c6 = /* @__PURE__ */ L({
  __name: "DialogClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(tt), de({ "data-slot": "dialog-close" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), jm = /* @__PURE__ */ L({
  __name: "DialogOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), D(x(Xt), de({ "data-slot": "dialog-overlay" }, x(a), {
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
}), f6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(en), null, {
      default: O(() => [
        I(jm),
        I(x(tn), de({ "data-slot": "dialog-content" }, { ...d.$attrs, ...x(i) }, {
          class: x(oe)(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            a.class
          )
        }), {
          default: O(() => [
            q(d.$slots, "default"),
            e.showCloseButton ? (t(), D(x(tt), {
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
}), m6 = /* @__PURE__ */ L({
  __name: "DialogDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), D(x(Vn), de({ "data-slot": "dialog-description" }, x(r), {
      class: x(oe)("text-sm text-muted-foreground font-normal", o.class)
    }), {
      default: O(() => [
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), p6 = /* @__PURE__ */ L({
  __name: "DialogFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    showCloseButton: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "dialog-footer",
      class: A(x(oe)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", o.class))
    }, [
      q(a.$slots, "default"),
      e.showCloseButton ? (t(), D(x(tt), {
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
}), v6 = /* @__PURE__ */ L({
  __name: "DialogHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "dialog-header",
      class: A(x(oe)("flex flex-col gap-2 text-center sm:text-left", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), g6 = /* @__PURE__ */ L({
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
    return (d, u) => (t(), D(x(en), null, {
      default: O(() => [
        I(x(Xt), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
          default: O(() => [
            I(x(tn), de({
              class: x(oe)(
                "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                a.class
              )
            }, { ...d.$attrs, ...x(i) }, {
              onPointerDownOutside: u[0] || (u[0] = (f) => {
                const v = f.detail.originalEvent, p = v.target;
                (v.offsetX > p.clientWidth || v.offsetY > p.clientHeight) && f.preventDefault();
              })
            }), {
              default: O(() => [
                q(d.$slots, "default"),
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
}), h6 = /* @__PURE__ */ L({
  __name: "DialogTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class"), r = Oe(a);
    return (s, i) => (t(), D(x(Dn), de({ "data-slot": "dialog-title" }, x(r), {
      class: x(oe)("text-lg leading-none font-semibold", o.class)
    }), {
      default: O(() => [
        q(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), b6 = /* @__PURE__ */ L({
  __name: "DialogTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(Tn), de({ "data-slot": "dialog-trigger" }, o), {
      default: O(() => [
        q(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), y6 = /* @__PURE__ */ L({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ve(o, "class");
    return (r, s) => (t(), D(x(ol), de({ "data-slot": "label" }, x(a), {
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
}), x6 = /* @__PURE__ */ L({
  __name: "Spinner",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), D(x(pl), {
      role: "status",
      "aria-label": "Loading",
      class: A(x(oe)("size-4 animate-spin", o.class))
    }, null, 8, ["class"]));
  }
}), k6 = /* @__PURE__ */ L({
  __name: "Card",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card",
      class: A(
        x(oe)(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
          o.class
        )
      )
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), $6 = /* @__PURE__ */ L({
  __name: "CardAction",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-action",
      class: A(x(oe)("col-start-2 row-span-2 row-start-1 self-start justify-self-end", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), w6 = /* @__PURE__ */ L({
  __name: "CardContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-content",
      class: A(x(oe)("px-6", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), C6 = /* @__PURE__ */ L({
  __name: "CardDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("p", {
      "data-slot": "card-description",
      class: A(x(oe)("text-sm text-muted-foreground font-normal", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), S6 = /* @__PURE__ */ L({
  __name: "CardFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-footer",
      class: A(x(oe)("flex items-center px-6 [.border-t]:pt-6", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), M6 = /* @__PURE__ */ L({
  __name: "CardHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-header",
      class: A(
        x(oe)(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
          o.class
        )
      )
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), B6 = /* @__PURE__ */ L({
  __name: "CardTitle",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("h3", {
      "data-slot": "card-title",
      class: A(x(oe)("leading-none font-semibold", o.class))
    }, [
      q(a.$slots, "default")
    ], 2));
  }
}), Vm = {
  key: 0,
  class: "border-destructive/30 bg-destructive/5 rounded-lg border border-dashed p-4"
}, Dm = { class: "flex items-start gap-3" }, Tm = { class: "min-w-0 flex-1" }, Im = { class: "text-foreground text-sm font-medium" }, Em = {
  key: 0,
  class: "text-muted-foreground mt-0.5 truncate text-xs"
}, A6 = /* @__PURE__ */ L({
  __name: "PkBoundary",
  props: {
    label: { default: "This section" },
    silent: { type: Boolean, default: !1 },
    fill: { type: Boolean, default: !1 }
  },
  emits: ["error"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = H(!1), d = H(null), u = H(0);
    ya((v) => (console.error(`[PkBoundary] ${r.label} failed to render`, v), i.value = !0, d.value = v instanceof Error ? v.message : null, s("error", v), !1));
    function f() {
      i.value = !1, d.value = null, u.value++;
    }
    return o({ retry: f }), (v, p) => (t(), n("div", {
      class: A(e.fill ? "h-full [&>*:only-child]:h-full" : void 0)
    }, [
      i.value && !e.silent ? (t(), n("div", Vm, [
        l("div", Dm, [
          p[1] || (p[1] = l("svg", {
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
          l("div", Tm, [
            l("p", Im, c(e.label) + " could not be displayed ", 1),
            d.value ? (t(), n("p", Em, c(d.value), 1)) : b("", !0),
            l("button", {
              type: "button",
              class: "text-foreground hover:bg-accent mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
              onClick: f
            }, [...p[0] || (p[0] = [
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
}), Fm = { class: "pk-surface rounded-lg" }, Nm = {
  key: 0,
  class: "flex items-start justify-between gap-4 border-b px-4 py-3"
}, Rm = { class: "min-w-0" }, Um = {
  key: 0,
  class: "truncate text-sm font-medium"
}, Hm = {
  key: 1,
  class: "text-muted-foreground mt-0.5 text-sm"
}, qm = {
  key: 0,
  class: "flex shrink-0 items-center gap-2"
}, Km = {
  key: 1,
  class: "flex items-center gap-2 border-t px-4 py-3"
}, _6 = /* @__PURE__ */ L({
  __name: "PkCard",
  props: {
    title: {},
    description: {},
    padded: { type: Boolean, default: !0 }
  },
  setup(e) {
    return (o, a) => (t(), n("section", Fm, [
      e.title || e.description || o.$slots.header || o.$slots.actions ? (t(), n("header", Nm, [
        l("div", Rm, [
          q(o.$slots, "header", {}, () => [
            e.title ? (t(), n("h2", Um, c(e.title), 1)) : b("", !0),
            e.description ? (t(), n("p", Hm, c(e.description), 1)) : b("", !0)
          ])
        ]),
        o.$slots.actions ? (t(), n("div", qm, [
          q(o.$slots, "actions")
        ])) : b("", !0)
      ])) : b("", !0),
      l("div", {
        class: A(e.padded ? "p-4" : "")
      }, [
        q(o.$slots, "default")
      ], 2),
      o.$slots.footer ? (t(), n("footer", Km, [
        q(o.$slots, "footer")
      ])) : b("", !0)
    ]));
  }
}), oa = /* @__PURE__ */ Symbol("pkPageFooterFromShell");
function z6() {
  const e = an(), o = y(() => e.props.panel?.pageFooter === !0);
  return Nt(oa, o), o;
}
const Gm = {
  key: 0,
  "data-slot": "app-footer",
  class: "mt-auto shrink-0 border-t bg-background px-4 py-3 text-sm text-muted-foreground sm:px-6"
}, Wm = { class: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" }, Zm = {
  key: 0,
  class: "flex flex-wrap gap-x-4 gap-y-1",
  "aria-label": "Footer"
}, P6 = /* @__PURE__ */ L({
  __name: "AppPageFooter",
  props: {
    host: { type: Boolean }
  },
  setup(e) {
    const o = e, a = an(), r = (/* @__PURE__ */ new Date()).getFullYear(), s = y(() => a.props.panel?.brand || a.props.panelBrand || a.props.name || "Panel"), i = y(() => {
      const f = a.props.panel;
      return Array.isArray(f?.footerLinks) ? f.footerLinks : [];
    }), d = $t(
      oa,
      y(() => !1)
    ), u = y(() => !o.host && x(d) === !0);
    return (f, v) => u.value ? b("", !0) : (t(), n("footer", Gm, [
      l("div", Wm, [
        l("p", null, "© " + c(x(r)) + " " + c(s.value), 1),
        i.value.length ? (t(), n("nav", Zm, [
          (t(!0), n(z, null, j(i.value, (p) => (t(), D(x(Rt), {
            key: p.href,
            href: p.href,
            class: "hover:text-foreground"
          }, {
            default: O(() => [
              U(c(p.label), 1)
            ]),
            _: 2
          }, 1032, ["href"]))), 128))
        ])) : b("", !0)
      ])
    ]));
  }
}), Jm = { class: "flex shrink-0 flex-col items-center" }, Ym = {
  key: 0,
  class: "absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-800 dark:bg-neutral-700",
  "aria-hidden": "true"
}, L6 = /* @__PURE__ */ L({
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
    return (i, d) => (t(), n("div", Jm, [
      l("div", {
        class: A(["relative box-content shadow-2xl", r.value]),
        style: ie({ width: `${e.width}px`, height: `${e.height}px` })
      }, [
        e.notch && !a.value ? (t(), n("div", Ym)) : b("", !0),
        l("div", {
          class: A(["size-full overflow-hidden bg-white", s.value])
        }, [
          q(i.$slots, "default")
        ], 2)
      ], 6),
      a.value ? (t(), n(z, { key: 0 }, [
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
}), Qm = { class: "flex flex-col gap-6 text-center sm:text-left" }, Xm = { class: "text-foreground text-xl font-semibold" }, ep = {
  key: 0,
  class: "flex flex-col gap-2"
}, tp = { class: "text-foreground font-medium" }, np = {
  key: 0,
  class: "text-muted-foreground"
}, ap = {
  key: 1,
  class: "flex flex-col gap-2"
}, lp = { class: "flex flex-col gap-1" }, op = {
  key: 2,
  class: "flex flex-wrap justify-center gap-2 sm:justify-start"
}, O6 = /* @__PURE__ */ L({
  __name: "PkSetupWizardCompletion",
  props: {
    heading: {},
    summary: { default: () => [] },
    nextSteps: { default: () => [] },
    actions: { default: () => [] },
    linkComponent: { default: "a" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", Qm, [
      l("h1", Xm, c(e.heading), 1),
      e.summary.length ? (t(), n("ul", ep, [
        (t(!0), n(z, null, j(e.summary, (r, s) => (t(), n("li", {
          key: s,
          class: "flex items-baseline gap-2 text-sm"
        }, [
          l("span", tp, c(r.label), 1),
          r.detail ? (t(), n("span", np, "– " + c(r.detail), 1)) : b("", !0)
        ]))), 128))
      ])) : b("", !0),
      e.nextSteps.length ? (t(), n("div", ap, [
        a[0] || (a[0] = l("p", { class: "text-foreground text-sm font-medium" }, "Next steps", -1)),
        l("ul", lp, [
          (t(!0), n(z, null, j(e.nextSteps, (r, s) => (t(), n("li", { key: s }, [
            (t(), D(Ce(e.linkComponent), {
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
      e.actions.length ? (t(), n("div", op, [
        (t(!0), n(z, null, j(e.actions, (r, s) => (t(), D(Ce(e.linkComponent), {
          key: s,
          href: r.href,
          class: A(x(Ye)({ variant: r.primary ? "default" : "outline" }))
        }, {
          default: O(() => [
            U(c(r.label), 1)
          ]),
          _: 2
        }, 1032, ["href", "class"]))), 128))
      ])) : b("", !0)
    ]));
  }
}), sp = {
  key: 0,
  class: "flex justify-end"
}, rp = {
  key: 1,
  class: "flex flex-col gap-2"
}, ip = ["onDrop"], dp = ["aria-label", "onDragstart"], up = ["onClick"], cp = { class: "font-medium" }, fp = {
  key: 0,
  class: "text-muted-foreground ml-2 truncate"
}, mp = {
  key: 2,
  class: "min-w-0 flex-1"
}, pp = {
  key: 1,
  class: "grid grid-cols-1 gap-3 sm:grid-cols-2"
}, vp = ["aria-label", "onClick"], gp = ["disabled", "aria-label", "onClick"], hp = ["disabled", "aria-label", "onClick"], bp = ["disabled", "title", "aria-label", "onClick"], yp = ["disabled", "title", "aria-label", "onClick"], xp = {
  key: 0,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, kp = ["disabled"], $p = {
  key: 2,
  class: "flex flex-col gap-2"
}, wp = {
  key: 0,
  class: "overflow-x-auto rounded-md border"
}, Cp = { class: "w-full text-sm" }, Sp = { class: "bg-muted/40" }, Mp = {
  key: 0,
  class: "w-8 border-b px-2 py-1.5"
}, Bp = {
  key: 0,
  class: "text-destructive",
  "aria-hidden": "true"
}, Ap = ["onDrop"], _p = {
  key: 0,
  class: "px-2 py-1.5 align-top"
}, zp = ["aria-label", "onDragstart"], Pp = { class: "px-2 py-1.5 align-top" }, Lp = { class: "mt-0.5 flex items-center gap-0.5" }, Op = ["disabled", "aria-label", "onClick"], jp = ["disabled", "aria-label", "onClick"], Vp = ["disabled", "title", "aria-label", "onClick"], Dp = ["disabled", "title", "aria-label", "onClick"], Tp = {
  key: 1,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, Ip = ["disabled"], j6 = /* @__PURE__ */ L({
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
    const i = H(d(a.modelValue));
    function d(K) {
      return Array.isArray(K) ? K.map((N) => ({ uid: s++, data: { ...N } })) : [];
    }
    pe(
      () => a.modelValue,
      (K) => {
        JSON.stringify(K ?? null) !== JSON.stringify(u()) && (i.value = d(K));
      }
    );
    function u() {
      const K = [];
      for (const N of i.value) {
        const R = {};
        let Q = !1;
        a.relationship && N.data._id !== void 0 && (R._id = N.data._id);
        for (const P of a.children) {
          const J = N.data[P.key] ?? null;
          R[P.key] = J, J !== null && J !== "" && !(Array.isArray(J) && J.length === 0) && (Q = !0);
        }
        Q && K.push(R);
      }
      return K.length ? K : null;
    }
    function f() {
      r("update:modelValue", u());
    }
    const v = y(() => a.maxItems !== null && i.value.length >= a.maxItems), p = y(() => a.minItems !== null && i.value.length <= a.minItems), h = y(() => a.children.length === 1);
    function $() {
      if (v.value || a.disabled || !a.addable)
        return;
      const K = {};
      for (const N of a.children)
        K[N.key] = null;
      i.value.push({ uid: s++, data: K });
    }
    function k(K) {
      i.value = i.value.filter((N) => N.uid !== K), f();
    }
    function S(K) {
      if (v.value || a.disabled || !a.cloneable)
        return;
      const N = i.value.findIndex((J) => J.uid === K);
      if (N < 0)
        return;
      const R = i.value[N], Q = {};
      for (const J of a.children) {
        const V = R.data[J.key];
        Q[J.key] = Array.isArray(V) ? [...V] : V;
      }
      const P = [...i.value];
      P.splice(N + 1, 0, { uid: s++, data: Q }), i.value = P, f();
    }
    function w(K, N) {
      const R = K + N;
      if (R < 0 || R >= i.value.length)
        return;
      const Q = [...i.value], [P] = Q.splice(K, 1);
      Q.splice(R, 0, P), i.value = Q, f();
    }
    function C(K, N, R) {
      const Q = i.value.find((P) => P.uid === K);
      Q && (Q.data[N] = R, f());
    }
    function B(K, N) {
      return a.errors[`${a.fieldKey}.${K}.${N}`];
    }
    const M = H(/* @__PURE__ */ new Set());
    function m(K) {
      return a.collapsible && M.value.has(K);
    }
    function g(K) {
      const N = new Set(M.value);
      N.has(K) ? N.delete(K) : N.add(K), M.value = N;
    }
    const _ = y(
      () => i.value.length > 0 && i.value.every((K) => M.value.has(K.uid))
    );
    function T() {
      M.value = _.value ? /* @__PURE__ */ new Set() : new Set(i.value.map((K) => K.uid));
    }
    function F(K) {
      const N = a.children[0];
      if (!N)
        return "";
      const R = K.data[N.key];
      if (typeof R != "string" && typeof R != "number")
        return "";
      const Q = String(R).trim();
      return Q === "" || Q.length > 60 ? "" : Q;
    }
    const Z = H(null);
    function G(K, N) {
      if (a.disabled) {
        N.preventDefault();
        return;
      }
      Z.value = K, N.dataTransfer?.setData("text/plain", String(K)), N.dataTransfer && (N.dataTransfer.effectAllowed = "move");
    }
    function X() {
      Z.value = null;
    }
    function W(K, N) {
      N.preventDefault();
      const R = Z.value;
      if (Z.value = null, a.disabled || R === null || R === K)
        return;
      const Q = [...i.value], P = Q.findIndex((E) => E.uid === R), J = Q.findIndex((E) => E.uid === K);
      if (P < 0 || J < 0)
        return;
      const [V] = Q.splice(P, 1);
      Q.splice(J, 0, V), i.value = Q, f();
    }
    return (K, N) => (t(), n(z, null, [
      !e.table && e.collapsible && i.value.length > 1 ? (t(), n("div", sp, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-xs font-medium",
          onClick: T
        }, c(_.value ? "Expand all" : "Collapse all"), 1)
      ])) : b("", !0),
      e.table ? (t(), n("div", $p, [
        i.value.length ? (t(), n("div", wp, [
          l("table", Cp, [
            l("thead", null, [
              l("tr", Sp, [
                e.disabled ? b("", !0) : (t(), n("th", Mp, [...N[9] || (N[9] = [
                  l("span", { class: "sr-only" }, "Reorder", -1)
                ])])),
                (t(!0), n(z, null, j(e.children, (R) => (t(), n("th", {
                  key: R.key,
                  class: "text-muted-foreground border-b px-2 py-1.5 text-left text-xs font-medium"
                }, [
                  U(c(R.label) + " ", 1),
                  R.required ? (t(), n("span", Bp, "*")) : b("", !0)
                ]))), 128)),
                N[10] || (N[10] = l("th", { class: "border-b px-2 py-1.5" }, [
                  l("span", { class: "sr-only" }, "Row actions")
                ], -1))
              ])
            ]),
            l("tbody", null, [
              (t(!0), n(z, null, j(i.value, (R, Q) => (t(), n("tr", {
                key: R.uid,
                class: A(["border-b last:border-b-0", Z.value === R.uid ? "opacity-40" : ""]),
                onDragover: N[1] || (N[1] = he(() => {
                }, ["prevent"])),
                onDrop: (P) => W(R.uid, P)
              }, [
                e.disabled ? b("", !0) : (t(), n("td", _p, [
                  l("button", {
                    type: "button",
                    class: "text-muted-foreground/60 hover:text-muted-foreground mt-0.5 flex size-6 cursor-grab items-center justify-center active:cursor-grabbing",
                    draggable: "true",
                    "aria-label": `Drag to reorder ${e.itemLabel} ${Q + 1}`,
                    onDragstart: (P) => G(R.uid, P),
                    onDragend: X
                  }, [...N[11] || (N[11] = [
                    dt('<svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.4"></circle><circle cx="15" cy="6" r="1.4"></circle><circle cx="9" cy="12" r="1.4"></circle><circle cx="15" cy="12" r="1.4"></circle><circle cx="9" cy="18" r="1.4"></circle><circle cx="15" cy="18" r="1.4"></circle></svg>', 1)
                  ])], 40, zp)
                ])),
                (t(!0), n(z, null, j(e.children, (P) => (t(), n("td", {
                  key: P.key,
                  class: "min-w-[8rem] px-2 py-1.5 align-top"
                }, [
                  I(Ge, {
                    field: {
                      ...P,
                      disabled: P.disabled || e.disabled,
                      labelHidden: !0
                    },
                    value: R.data[P.key],
                    error: B(Q, P.key),
                    options: e.childOptions[P.key] ?? [],
                    onChange: (J) => C(R.uid, P.key, J)
                  }, null, 8, ["field", "value", "error", "options", "onChange"])
                ]))), 128)),
                l("td", Pp, [
                  l("div", Lp, [
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || Q === 0,
                      "aria-label": `Move ${e.itemLabel} ${Q + 1} up`,
                      onClick: (P) => w(Q, -1)
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
                    ])], 8, Op),
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || Q === i.value.length - 1,
                      "aria-label": `Move ${e.itemLabel} ${Q + 1} down`,
                      onClick: (P) => w(Q, 1)
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
                    ])], 8, jp),
                    e.cloneable ? (t(), n("button", {
                      key: 0,
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || v.value,
                      title: v.value ? `At most ${e.maxItems} allowed` : void 0,
                      "aria-label": `Duplicate ${e.itemLabel} ${Q + 1}`,
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
                    ])], 8, Vp)) : b("", !0),
                    e.deletable ? (t(), n("button", {
                      key: 1,
                      type: "button",
                      class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || p.value,
                      title: p.value ? `At least ${e.minItems} required` : void 0,
                      "aria-label": `Remove ${e.itemLabel} ${Q + 1}`,
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
                    ])], 8, Dp)) : b("", !0)
                  ])
                ])
              ], 42, Ap))), 128))
            ])
          ])
        ])) : (t(), n("p", Tp, " No " + c(e.itemLabel.toLowerCase()) + "s yet. ", 1)),
        !v.value && e.addable ? (t(), n("button", {
          key: 2,
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled,
          onClick: $
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
        ], 8, Ip)) : b("", !0)
      ])) : (t(), n("div", rp, [
        (t(!0), n(z, null, j(i.value, (R, Q) => (t(), n("div", {
          key: R.uid,
          class: A(["flex items-start gap-2", Z.value === R.uid ? "opacity-40" : ""]),
          onDragover: N[0] || (N[0] = he(() => {
          }, ["prevent"])),
          onDrop: (P) => W(R.uid, P)
        }, [
          e.disabled ? b("", !0) : (t(), n("button", {
            key: 0,
            type: "button",
            class: A(["text-muted-foreground/60 hover:text-muted-foreground flex size-6 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing", h.value ? "mt-1.5" : "mt-0.5"]),
            draggable: "true",
            "aria-label": `Drag to reorder ${e.itemLabel} ${Q + 1}`,
            onDragstart: (P) => G(R.uid, P),
            onDragend: X
          }, [...N[2] || (N[2] = [
            dt('<svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.4"></circle><circle cx="15" cy="6" r="1.4"></circle><circle cx="9" cy="12" r="1.4"></circle><circle cx="15" cy="12" r="1.4"></circle><circle cx="9" cy="18" r="1.4"></circle><circle cx="15" cy="18" r="1.4"></circle></svg>', 1)
          ])], 42, dp)),
          l("span", {
            class: A(["bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums", h.value ? "mt-1.5" : "mt-0.5"]),
            "aria-hidden": "true"
          }, c(Q + 1), 3),
          m(R.uid) ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "hover:bg-accent min-w-0 flex-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
            onClick: (P) => g(R.uid)
          }, [
            l("span", cp, c(e.itemLabel) + " " + c(Q + 1), 1),
            F(R) ? (t(), n("span", fp, c(F(R)), 1)) : b("", !0)
          ], 8, up)) : (t(), n("div", mp, [
            h.value ? (t(), D(Ge, {
              key: 0,
              field: {
                ...e.children[0],
                disabled: e.children[0].disabled || e.disabled,
                labelHidden: !0
              },
              value: R.data[e.children[0].key],
              error: B(Q, e.children[0].key),
              options: e.childOptions[e.children[0].key] ?? [],
              onChange: (P) => C(R.uid, e.children[0].key, P)
            }, null, 8, ["field", "value", "error", "options", "onChange"])) : (t(), n("div", pp, [
              (t(!0), n(z, null, j(e.children, (P) => (t(), D(Ge, {
                key: P.key,
                field: { ...P, disabled: P.disabled || e.disabled },
                value: R.data[P.key],
                error: B(Q, P.key),
                options: e.childOptions[P.key] ?? [],
                onChange: (J) => C(R.uid, P.key, J)
              }, null, 8, ["field", "value", "error", "options", "onChange"]))), 128))
            ]))
          ])),
          l("div", {
            class: A(["flex shrink-0 items-center gap-0.5", h.value ? "mt-1" : "mt-0"])
          }, [
            e.collapsible ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors",
              "aria-label": m(R.uid) ? `Expand ${e.itemLabel} ${Q + 1}` : `Collapse ${e.itemLabel} ${Q + 1}`,
              onClick: (P) => g(R.uid)
            }, [
              (t(), n("svg", {
                class: A(["size-3.5 transition-transform", m(R.uid) ? "" : "rotate-180"]),
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
            ], 8, vp)) : b("", !0),
            l("button", {
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || Q === 0,
              "aria-label": `Move ${e.itemLabel} ${Q + 1} up`,
              onClick: (P) => w(Q, -1)
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
            ])], 8, gp),
            l("button", {
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || Q === i.value.length - 1,
              "aria-label": `Move ${e.itemLabel} ${Q + 1} down`,
              onClick: (P) => w(Q, 1)
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
            ])], 8, hp),
            e.cloneable ? (t(), n("button", {
              key: 1,
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || v.value,
              title: v.value ? `At most ${e.maxItems} allowed` : void 0,
              "aria-label": `Duplicate ${e.itemLabel} ${Q + 1}`,
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
            ])], 8, bp)) : b("", !0),
            e.deletable ? (t(), n("button", {
              key: 2,
              type: "button",
              class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || p.value,
              title: p.value ? `At least ${e.minItems} required` : void 0,
              "aria-label": `Remove ${e.itemLabel} ${Q + 1}`,
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
            ])], 8, yp)) : b("", !0)
          ], 2)
        ], 42, ip))), 128)),
        i.value.length === 0 ? (t(), n("p", xp, " No " + c(e.itemLabel.toLowerCase()) + "s yet. ", 1)) : b("", !0),
        !v.value && e.addable ? (t(), n("button", {
          key: 1,
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled,
          onClick: $
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
        ], 8, kp)) : b("", !0)
      ]))
    ], 64));
  }
}), Ep = { class: "space-y-1" }, Fp = { class: "flex items-center gap-1" }, Np = ["disabled", "title", "aria-label", "onClick"], Rp = ["aria-pressed"], Up = ["id", "value", "rows", "disabled"], Hp = ["innerHTML"], qp = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(!1), i = y(() => a.modelValue ?? "");
    function d(h) {
      return h.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    const u = y(
      () => d(i.value).replace(/^### (.*)$/gm, '<h3 class="font-semibold">$1</h3>').replace(/^## (.*)$/gm, '<h2 class="font-semibold text-lg">$1</h2>').replace(/^# (.*)$/gm, '<h1 class="font-semibold text-xl">$1</h1>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*]+?)\*/g, "$1<em>$2</em>").replace(/`([^`]+?)`/g, '<code class="bg-muted rounded px-1">$1</code>').replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" class="underline">$1</a>').replace(/^[-*] (.*)$/gm, '<li class="ml-4 list-disc">$1</li>').replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>")
    );
    function f(h, $ = h) {
      const k = document.getElementById(a.id ?? "");
      if (k === null)
        return;
      const S = k.selectionStart, w = k.selectionEnd, C = i.value.slice(S, w);
      r(
        "update:modelValue",
        `${i.value.slice(0, S)}${h}${C}${$}${i.value.slice(w)}`
      );
    }
    const v = {
      bold: { label: "B", run: () => f("**") },
      italic: { label: "I", run: () => f("*") },
      code: { label: "</>", run: () => f("`") },
      heading: { label: "H", run: () => f("## ", "") },
      list: { label: "•", run: () => f("- ", "") },
      link: { label: "🔗", run: () => f("[", "](https://)") }
    }, p = y(
      () => (a.toolbar ?? Object.keys(v)).filter((h) => h in v)
    );
    return (h, $) => (t(), n("div", Ep, [
      l("div", Fp, [
        (t(!0), n(z, null, j(p.value, (k) => (t(), n("button", {
          key: k,
          type: "button",
          disabled: e.disabled,
          title: k,
          "aria-label": k,
          class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-50",
          onClick: (S) => v[k].run()
        }, c(v[k].label), 9, Np))), 128)),
        l("button", {
          type: "button",
          class: "hover:bg-accent ml-auto rounded border px-2 py-0.5 text-xs",
          "aria-pressed": s.value,
          onClick: $[0] || ($[0] = (k) => s.value = !s.value)
        }, " Preview ", 8, Rp)
      ]),
      s.value ? (t(), n("div", {
        key: 1,
        class: "bg-card min-h-32 rounded-md border px-3 py-2 text-sm",
        innerHTML: u.value
      }, null, 8, Hp)) : (t(), n("textarea", {
        key: 0,
        id: e.id,
        value: i.value,
        rows: e.rows,
        disabled: e.disabled,
        class: "bg-card w-full resize-y rounded-md border px-3 py-2 font-mono text-sm outline-none",
        onInput: $[1] || ($[1] = (k) => r("update:modelValue", k.target.value))
      }, null, 40, Up))
    ]));
  }
}), Kp = { class: "space-y-1" }, Gp = { class: "bg-card flex overflow-hidden rounded-md border font-mono text-xs" }, Wp = {
  "aria-hidden": "true",
  class: "text-muted-foreground bg-muted/40 shrink-0 border-r px-2 py-2 text-right leading-5 select-none"
}, Zp = ["id", "value", "rows", "disabled"], Jp = { class: "text-muted-foreground text-xs font-normal" }, Yp = {
  key: 0,
  class: "text-destructive text-xs"
}, Qp = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(null), i = H(!0), d = y(() => a.modelValue ?? ""), u = y(() => Math.max(d.value.split(`
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
    function p(h) {
      if (h.key === "Escape") {
        i.value = !1;
        return;
      }
      if (h.key !== "Tab" && (i.value = !0), h.key !== "Tab" || !i.value)
        return;
      h.preventDefault();
      const $ = h.target, k = $.selectionStart, S = $.selectionEnd, w = `${d.value.slice(0, k)}    ${d.value.slice(S)}`;
      r("update:modelValue", w), requestAnimationFrame(() => {
        $.selectionStart = $.selectionEnd = k + 4;
      });
    }
    return (h, $) => (t(), n("div", Kp, [
      l("div", Gp, [
        l("div", Wp, [
          (t(!0), n(z, null, j(u.value, (k) => (t(), n("div", { key: k }, c(k), 1))), 128))
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
          onKeydown: p
        }, null, 40, Zp)
      ]),
      l("p", Jp, c(e.language === "plain" ? "Plain text" : e.language.toUpperCase()) + ". Tab indents; press Escape first to move focus out. ", 1),
      f.value ? (t(), n("p", Yp, c(f.value), 1)) : b("", !0)
    ]));
  }
}), Xp = { class: "space-y-3" }, ev = { class: "flex items-center justify-between gap-2 border-b px-3 py-2" }, tv = { class: "text-sm font-medium" }, nv = { class: "flex items-center gap-1" }, av = ["disabled", "onClick"], lv = ["disabled", "onClick"], ov = ["disabled", "onClick"], sv = { class: "space-y-3 p-3" }, rv = { class: "flex flex-wrap items-center gap-2" }, iv = ["disabled", "onClick"], dv = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, V6 = /* @__PURE__ */ L({
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
      () => Object.fromEntries(a.blocks.map(($) => [$.type, $]))
    ), d = y(() => a.maxBlocks !== null && s.value.length >= a.maxBlocks);
    function u($) {
      r("update:modelValue", $);
    }
    function f($) {
      d.value || u([...s.value, { type: $, data: {} }]);
    }
    function v($) {
      u(s.value.filter((k, S) => S !== $));
    }
    function p($, k) {
      const S = $ + k;
      if (S < 0 || S >= s.value.length)
        return;
      const w = [...s.value], [C] = w.splice($, 1);
      w.splice(S, 0, C), u(w);
    }
    function h($, k, S) {
      u(
        s.value.map(
          (w, C) => C === $ ? { ...w, data: { ...w.data, [k]: S } } : w
        )
      );
    }
    return ($, k) => (t(), n("div", Xp, [
      (t(!0), n(z, null, j(s.value, (S, w) => (t(), n("div", {
        key: `${S.type}-${w}`,
        class: "bg-card rounded-lg border"
      }, [
        l("div", ev, [
          l("span", tv, c(i.value[S.type]?.label ?? S.type), 1),
          l("div", nv, [
            l("button", {
              type: "button",
              class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-40",
              disabled: e.disabled || w === 0,
              "aria-label": "Move up",
              onClick: (C) => p(w, -1)
            }, " ↑ ", 8, av),
            l("button", {
              type: "button",
              class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-40",
              disabled: e.disabled || w === s.value.length - 1,
              "aria-label": "Move down",
              onClick: (C) => p(w, 1)
            }, " ↓ ", 8, lv),
            l("button", {
              type: "button",
              class: "text-destructive hover:bg-accent rounded border px-2 py-0.5 text-xs",
              disabled: e.disabled,
              "aria-label": "Remove block",
              onClick: (C) => v(w)
            }, " Remove ", 8, ov)
          ])
        ]),
        l("div", sv, [
          (t(!0), n(z, null, j(i.value[S.type]?.fields ?? [], (C) => (t(), D(Ge, {
            key: C.key,
            field: C,
            value: S.data[C.key] ?? null,
            error: e.errors?.[C.key],
            processing: e.disabled,
            onChange: (B) => h(w, C.key, B)
          }, null, 8, ["field", "value", "error", "processing", "onChange"]))), 128))
        ])
      ]))), 128)),
      l("div", rv, [
        (t(!0), n(z, null, j(e.blocks, (S) => (t(), n("button", {
          key: S.type,
          type: "button",
          class: "hover:bg-accent rounded-md border px-2.5 py-1 text-sm disabled:opacity-50",
          disabled: e.disabled || d.value,
          onClick: (w) => f(S.type)
        }, " + " + c(S.label), 9, iv))), 128)),
        d.value ? (t(), n("span", dv, c(e.maxBlocks) + " is the maximum here. ", 1)) : b("", !0)
      ])
    ]));
  }
}), uv = ["name", "value", "checked", "disabled", "onChange"], cv = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, fv = /* @__PURE__ */ L({
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
      class: A(["flex gap-x-4 gap-y-2", e.field.inline ? "flex-row flex-wrap items-center" : "flex-col"])
    }, [
      (t(!0), n(z, null, j(e.options, (u) => (t(), n("label", {
        key: String(u.value),
        class: A(["flex items-center gap-2 text-sm", e.disabled ? "opacity-50" : "cursor-pointer"])
      }, [
        l("input", {
          type: "radio",
          class: "text-primary focus-visible:ring-ring size-4 shrink-0 border focus-visible:ring-2",
          name: `f-${e.field.key}`,
          value: u.value,
          checked: s(u),
          disabled: e.disabled,
          onChange: (f) => r("update:modelValue", u.value)
        }, null, 40, uv),
        U(" " + c(u.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", cv, " Nothing to choose from yet. ")) : b("", !0)
    ], 2));
  }
}), mv = ["value", "checked", "disabled", "onChange"], pv = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, vv = /* @__PURE__ */ L({
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
      (t(!0), n(z, null, j(e.options, (p) => (t(), n("label", {
        key: String(p.value),
        class: A(["flex items-center gap-2 text-sm", e.disabled ? "opacity-50" : "cursor-pointer"])
      }, [
        l("input", {
          type: "checkbox",
          class: "text-primary focus-visible:ring-ring size-4 shrink-0 rounded border focus-visible:ring-2",
          value: p.value,
          checked: i(p),
          disabled: e.disabled,
          onChange: (h) => d(p)
        }, null, 40, mv),
        U(" " + c(p.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", pv, " Nothing to choose from yet. ")) : b("", !0)
    ], 4));
  }
}), gv = { class: "flex flex-col gap-1.5" }, hv = ["aria-label", "onClick"], bv = ["placeholder", "disabled", "maxlength"], yv = {
  key: 0,
  class: "flex flex-wrap items-center gap-1.5"
}, xv = ["onClick"], kv = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal"
}, $v = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkTagsInput",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = H(""), i = y(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    ), d = y(() => i.value.length >= (a.field.max ?? 25)), u = y(
      () => (a.field.suggestions ?? []).filter(
        (h) => !i.value.some(($) => $.toLowerCase() === h.toLowerCase())
      )
    );
    function f(h) {
      const $ = h.trim().slice(0, a.field.maxLength ?? 40);
      if ($ === "" || d.value) {
        s.value = "";
        return;
      }
      if (i.value.some((k) => k.toLowerCase() === $.toLowerCase())) {
        s.value = "";
        return;
      }
      r("update:modelValue", [...i.value, $]), s.value = "";
    }
    function v(h) {
      r(
        "update:modelValue",
        i.value.filter(($, k) => k !== h)
      );
    }
    function p(h) {
      if (h.key === "Enter" || h.key === ",") {
        h.preventDefault(), f(s.value);
        return;
      }
      h.key === "Backspace" && s.value === "" && i.value.length > 0 && v(i.value.length - 1);
    }
    return (h, $) => (t(), n("div", gv, [
      l("div", {
        class: A(["border-input bg-background flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5", e.disabled ? "opacity-50" : ""])
      }, [
        (t(!0), n(z, null, j(i.value, (k, S) => (t(), n("span", {
          key: `${k}-${S}`,
          class: "bg-muted flex items-center gap-1 rounded px-2 py-0.5 text-xs"
        }, [
          U(c(k) + " ", 1),
          e.disabled ? b("", !0) : (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground",
            "aria-label": `Remove ${k}`,
            onClick: (w) => v(S)
          }, " × ", 8, hv))
        ]))), 128)),
        ge(l("input", {
          "onUpdate:modelValue": $[0] || ($[0] = (k) => s.value = k),
          type: "text",
          class: "min-w-24 flex-1 bg-transparent text-sm outline-none",
          placeholder: d.value ? "" : e.field.placeholder ?? "Add a tag…",
          disabled: e.disabled || d.value,
          maxlength: e.field.maxLength ?? 40,
          onKeydown: p,
          onBlur: $[1] || ($[1] = (k) => f(s.value))
        }, null, 40, bv), [
          [_e, s.value]
        ])
      ], 2),
      u.value.length > 0 && !d.value && !e.disabled ? (t(), n("div", yv, [
        $[2] || ($[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "Suggestions:", -1)),
        (t(!0), n(z, null, j(u.value, (k) => (t(), n("button", {
          key: k,
          type: "button",
          class: "hover:bg-accent rounded border px-2 py-0.5 text-xs",
          onClick: (S) => f(k)
        }, c(k), 9, xv))), 128))
      ])) : b("", !0),
      d.value ? (t(), n("p", kv, " That is the maximum of " + c(e.field.max ?? 25) + " tags. ", 1)) : b("", !0)
    ]));
  }
}), wv = 4.5, An = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
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
function Cv(e, o, a) {
  if (!An.test(e) || !An.test(o))
    return e;
  const r = Jt(o) > 0.5, s = r ? 0 : 255;
  let i = sa(e);
  for (let d = 0; d <= 20; d++) {
    const u = Sv(i);
    if (ra(u, o) >= a)
      return u;
    i = i.map((f) => f + (s - f) * 0.15);
  }
  return r ? "#000000" : "#ffffff";
}
function Sv(e) {
  return "#" + e.map(
    (o) => Math.round(Math.max(0, Math.min(255, o))).toString(16).padStart(2, "0")
  ).join("");
}
const Mv = { class: "flex flex-col gap-2" }, Bv = { class: "flex items-center gap-2" }, Av = {
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
}, _v = ["value", "disabled", "aria-label"], zv = ["value", "disabled", "placeholder"], Pv = {
  key: 0,
  class: "flex flex-wrap gap-1.5"
}, Lv = ["aria-label", "title", "onClick"], Ov = {
  key: 1,
  class: "text-amber-600 dark:text-amber-500 flex flex-wrap items-center gap-2 text-xs"
}, jv = /* @__PURE__ */ L({
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
      const w = S.startsWith("#") ? S : `#${S}`;
      return s.test(w) ? w.toLowerCase() : S;
    }
    function f(k) {
      r("update:modelValue", u(k.target.value));
    }
    const v = y(() => !d.value || !a.field.contrastBackground || !s.test(a.field.contrastBackground) ? null : ra(i.value, a.field.contrastBackground)), p = y(() => a.field.contrastMinRatio ?? wv), h = y(() => v.value !== null && v.value < p.value);
    function $() {
      a.field.contrastBackground && r(
        "update:modelValue",
        Cv(i.value, a.field.contrastBackground, p.value)
      );
    }
    return (k, S) => (t(), n("div", Mv, [
      l("div", Bv, [
        d.value ? (t(), n("input", {
          key: 1,
          type: "color",
          class: "border-input size-9 shrink-0 cursor-pointer rounded-md border bg-transparent",
          value: i.value,
          disabled: e.disabled,
          "aria-label": `Colour for ${e.field.key}`,
          onInput: S[0] || (S[0] = (w) => r("update:modelValue", w.target.value))
        }, null, 40, _v)) : (t(), n("span", Av)),
        l("input", {
          type: "text",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
          value: i.value,
          disabled: e.disabled,
          placeholder: e.field.placeholder ?? "#1e90ff",
          spellcheck: "false",
          onInput: f
        }, null, 40, zv)
      ]),
      (e.field.presets ?? []).length > 0 && !e.disabled ? (t(), n("div", Pv, [
        (t(!0), n(z, null, j(e.field.presets, (w) => (t(), n("button", {
          key: w,
          type: "button",
          class: A(["size-6 rounded border", i.value.toLowerCase() === w.toLowerCase() ? "ring-ring ring-2" : ""]),
          style: ie({ backgroundColor: w }),
          "aria-label": w,
          title: w,
          onClick: (C) => r("update:modelValue", w.toLowerCase())
        }, null, 14, Lv))), 128))
      ])) : b("", !0),
      h.value ? (t(), n("p", Ov, [
        l("span", null, " This fails contrast at " + c(v.value.toFixed(1)) + ":1 - it needs at least " + c(p.value.toFixed(1)) + ":1 to stay readable. ", 1),
        e.disabled ? b("", !0) : (t(), n("button", {
          key: 0,
          type: "button",
          class: "font-medium underline underline-offset-2",
          onClick: $
        }, " Use a readable shade "))
      ])) : b("", !0)
    ]));
  }
}), Vv = ["aria-disabled"], Dv = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(null);
    let i = null, d = null, u = null;
    const f = y(() => {
      const $ = a.modelValue?.[a.latKey], k = a.modelValue?.[a.lngKey];
      return typeof $ == "number" && typeof k == "number" ? { lat: $, lng: k } : a.center ? a.center : a.markers.length > 0 ? { lat: a.markers[0].lat, lng: a.markers[0].lng } : { lat: 0, lng: 0 };
    });
    async function v() {
      if (!s.value || i)
        return;
      const $ = await import("leaflet");
      await import("leaflet/dist/leaflet.css"), u = $, i = $.map(s.value).setView([f.value.lat, f.value.lng], a.zoom), $.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19
      }).addTo(i), p(), h(), a.pickable && !a.disabled && i.on("click", (k) => {
        r("update:modelValue", {
          [a.latKey]: Number(k.latlng.lat.toFixed(6)),
          [a.lngKey]: Number(k.latlng.lng.toFixed(6))
        });
      });
    }
    function p() {
      if (!(!i || !u))
        for (const $ of a.markers) {
          const k = u.circleMarker([$.lat, $.lng], {
            radius: 7,
            color: "hsl(var(--primary))",
            fillColor: "hsl(var(--primary))",
            fillOpacity: 0.85
          }).addTo(i);
          ($.label || $.popup) && k.bindPopup(
            `<strong>${$.label ?? ""}</strong>${$.popup ? `<br>${$.popup}` : ""}`
          );
        }
    }
    function h() {
      if (!i || !u)
        return;
      const $ = a.modelValue?.[a.latKey], k = a.modelValue?.[a.lngKey];
      if (typeof $ != "number" || typeof k != "number") {
        d && (i.removeLayer(d), d = null);
        return;
      }
      d ? d.setLatLng([$, k]) : d = u.circleMarker([$, k], {
        radius: 8,
        color: "#0f172a",
        fillColor: "#38bdf8",
        fillOpacity: 1,
        weight: 2
      }).addTo(i), i.setView([$, k], i.getZoom());
    }
    return be(() => {
      v();
    }), ke(() => {
      i?.remove(), i = null, d = null;
    }), pe(
      () => a.modelValue,
      () => h(),
      { deep: !0 }
    ), ($, k) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "border-input bg-muted/20 w-full overflow-hidden rounded-md border",
      style: ie({ height: `${e.height}px` }),
      "aria-disabled": e.disabled || void 0
    }, null, 12, Vv));
  }
}), Tv = { class: "flex flex-col gap-2" }, Iv = { class: "text-muted-foreground text-xs font-normal" }, Ev = /* @__PURE__ */ L({
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
    return (u, f) => (t(), n("div", Tv, [
      I(Dv, {
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
      l("p", Iv, [
        U(" Click the map to set " + c(i.value) + " / " + c(d.value) + " ", 1),
        s.value ? (t(), n(z, { key: 0 }, [
          U(" (" + c(s.value[i.value]?.toFixed?.(5) ?? s.value[i.value]) + ", " + c(s.value[d.value]?.toFixed?.(5) ?? s.value[d.value]) + ") ", 1)
        ], 64)) : b("", !0)
      ])
    ]));
  }
}), Fv = { class: "flex flex-col gap-2" }, Nv = ["width", "height"], Rv = ["value", "disabled"], Uv = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal"
}, Hv = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(null), i = y(() => {
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
    }), (f, v) => (t(), n("div", Fv, [
      l("canvas", {
        ref_key: "canvas",
        ref: s,
        class: "border-input bg-background rounded-md border",
        width: d.value,
        height: d.value
      }, null, 8, Nv),
      e.field.from ? (t(), n("p", Uv, "From " + c(e.field.from), 1)) : (t(), n("input", {
        key: 0,
        type: "text",
        class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
        value: e.modelValue == null ? "" : String(e.modelValue),
        disabled: e.disabled,
        placeholder: "QR payload",
        onInput: v[0] || (v[0] = (p) => r("update:modelValue", p.target.value))
      }, null, 40, Rv))
    ]));
  }
}), qv = { class: "flex flex-col gap-2" }, Kv = { class: "border-input bg-background inline-flex min-h-16 items-center justify-center overflow-x-auto rounded-md border p-2" }, Gv = ["aria-label"], Wv = {
  key: 0,
  class: "text-destructive text-xs"
}, Zv = ["value", "disabled"], Jv = {
  key: 2,
  class: "text-muted-foreground text-xs font-normal"
}, Yv = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(null), i = H(null), d = y(() => {
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
        } catch (p) {
          i.value = p instanceof Error ? p.message : "Could not render barcode";
        }
    }
    return be(() => {
      f();
    }), pe([d, u], () => {
      f();
    }), (v, p) => (t(), n("div", qv, [
      l("div", Kv, [
        (t(), n("svg", {
          ref_key: "svg",
          ref: s,
          class: "max-w-full",
          role: "img",
          "aria-label": `Barcode ${u.value}`
        }, null, 8, Gv))
      ]),
      i.value ? (t(), n("p", Wv, c(i.value), 1)) : b("", !0),
      e.field.from ? (t(), n("p", Jv, " From " + c(e.field.from) + " (" + c(u.value) + ") ", 1)) : (t(), n("input", {
        key: 1,
        type: "text",
        class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
        value: e.modelValue == null ? "" : String(e.modelValue),
        disabled: e.disabled,
        placeholder: "Barcode value",
        onInput: p[0] || (p[0] = (h) => r("update:modelValue", h.target.value))
      }, null, 40, Zv))
    ]));
  }
}), Qv = { class: "mr-2 inline-block w-3 opacity-60" }, Xv = {
  key: 0,
  class: "text-muted-foreground p-3"
}, eg = /* @__PURE__ */ L({
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
      for (let p = 0; p < f; p++) {
        const h = d[p], $ = u[p];
        if (h === $) {
          h !== void 0 && v.push({ kind: "same", text: h });
          continue;
        }
        h !== void 0 && v.push({ kind: "del", text: h }), $ !== void 0 && v.push({ kind: "add", text: $ });
      }
      return v;
    });
    return (d, u) => (t(), n("div", {
      class: "border-input bg-background overflow-auto rounded-md border font-mono text-xs leading-5",
      style: ie({ maxHeight: `${(e.field.rows ?? 12) * 1.25}rem` })
    }, [
      (t(!0), n(z, null, j(i.value, (f, v) => (t(), n("div", {
        key: v,
        class: A(["px-2 whitespace-pre-wrap", {
          "bg-destructive/10 text-destructive": f.kind === "del",
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300": f.kind === "add",
          "text-muted-foreground": f.kind === "same"
        }])
      }, [
        l("span", Qv, c(f.kind === "add" ? "+" : f.kind === "del" ? "-" : " "), 1),
        U(" " + c(f.text), 1)
      ], 2))), 128)),
      i.value.length === 0 ? (t(), n("p", Xv, "No differences.")) : b("", !0)
    ], 4));
  }
}), tg = { class: "flex flex-col gap-3" }, ng = { class: "flex items-center justify-between gap-2" }, ag = { class: "text-sm font-medium" }, lg = { class: "text-muted-foreground grid grid-cols-7 gap-1 text-center text-[10px] uppercase" }, og = { class: "grid grid-cols-7 gap-1" }, sg = {
  key: 0,
  class: "text-muted-foreground mb-1 text-[10px]"
}, rg = ["title"], D6 = /* @__PURE__ */ L({
  __name: "PkCalendar",
  props: {
    events: {}
  },
  setup(e) {
    const o = e, a = H(/* @__PURE__ */ new Date()), r = y(() => a.value.getFullYear()), s = y(() => a.value.getMonth()), i = y(
      () => a.value.toLocaleString(void 0, { month: "long", year: "numeric" })
    ), d = y(() => {
      const p = /* @__PURE__ */ new Map();
      for (const h of o.events ?? []) {
        const $ = p.get(h.date) ?? [];
        $.push(h), p.set(h.date, $);
      }
      return p;
    }), u = y(() => {
      const h = new Date(r.value, s.value, 1).getDay(), $ = new Date(r.value, s.value + 1, 0).getDate(), k = [];
      for (let S = 0; S < h; S++)
        k.push({ day: null, key: `pad-${S}`, events: [] });
      for (let S = 1; S <= $; S++) {
        const w = `${r.value}-${String(s.value + 1).padStart(2, "0")}-${String(S).padStart(2, "0")}`;
        k.push({ day: S, key: w, events: d.value.get(w) ?? [] });
      }
      return k;
    });
    function f() {
      a.value = new Date(r.value, s.value - 1, 1);
    }
    function v() {
      a.value = new Date(r.value, s.value + 1, 1);
    }
    return (p, h) => (t(), n("div", tg, [
      l("div", ng, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-sm",
          onClick: f
        }, " Prev "),
        l("p", ag, c(i.value), 1),
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-sm",
          onClick: v
        }, " Next ")
      ]),
      l("div", lg, [
        (t(), n(z, null, j(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ($) => l("span", { key: $ }, c($), 1)), 64))
      ]),
      l("div", og, [
        (t(!0), n(z, null, j(u.value, ($) => (t(), n("div", {
          key: $.key,
          class: A(["border-border/60 min-h-16 rounded-md border p-1", $.day ? "bg-background" : "bg-transparent border-transparent"])
        }, [
          $.day ? (t(), n("p", sg, c($.day), 1)) : b("", !0),
          (t(!0), n(z, null, j($.events.slice(0, 3), (k, S) => (t(), n("p", {
            key: `${$.key}-${S}`,
            class: "bg-primary/10 text-foreground mb-0.5 truncate rounded px-1 text-[10px] leading-4",
            title: k.label
          }, c(k.label), 9, rg))), 128))
        ], 2))), 128))
      ])
    ]));
  }
}), ig = { class: "flex items-center gap-3" }, dg = ["min", "max", "step", "value", "disabled", "aria-label"], ug = { class: "flex shrink-0 items-center gap-1" }, cg = ["min", "max", "step", "value", "disabled"], fg = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, mg = /* @__PURE__ */ L({
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
      const p = Number(a.modelValue);
      return Number.isFinite(p) ? p : s.value;
    }), f = y(
      () => a.modelValue === null || a.modelValue === void 0 || a.modelValue === ""
    );
    function v(p) {
      if (p === "") {
        r("update:modelValue", null);
        return;
      }
      const h = Number(p);
      r("update:modelValue", Number.isFinite(h) ? h : null);
    }
    return (p, h) => (t(), n("div", ig, [
      l("input", {
        type: "range",
        class: "accent-primary h-9 flex-1 cursor-pointer disabled:opacity-50",
        min: s.value,
        max: i.value,
        step: d.value,
        value: u.value,
        disabled: e.disabled,
        "aria-label": `${e.field.key} value`,
        onInput: h[0] || (h[0] = ($) => v($.target.value))
      }, null, 40, dg),
      l("div", ug, [
        l("input", {
          type: "number",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-20 rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
          min: s.value,
          max: i.value,
          step: d.value,
          value: f.value ? "" : u.value,
          disabled: e.disabled,
          onInput: h[1] || (h[1] = ($) => v($.target.value))
        }, null, 40, cg),
        e.field.unit ? (t(), n("span", fg, c(e.field.unit), 1)) : b("", !0)
      ])
    ]));
  }
}), gt = /* @__PURE__ */ new Map();
function It(e, o) {
  gt.set(e, o);
}
function pg(e) {
  return gt.get(e);
}
function T6(e) {
  return gt.has(e);
}
function vg() {
  return [...gt.keys()].sort();
}
function I6() {
  gt.clear();
}
const gg = ["name", "value", "checked", "disabled", "onChange"], hg = {
  key: 0,
  class: "flex shrink-0 scale-75 items-center",
  "aria-hidden": "true"
}, bg = { class: "whitespace-nowrap" }, yg = {
  key: 0,
  class: "text-muted-foreground px-2 py-1 text-xs"
}, xg = ["name", "value", "checked", "disabled", "onChange"], kg = {
  class: "bg-muted/40 flex h-16 items-center justify-center overflow-hidden rounded",
  "aria-hidden": "true"
}, $g = {
  key: 1,
  class: "text-destructive px-1 text-center text-[10px] leading-tight"
}, wg = { class: "text-center text-xs font-medium" }, Cg = {
  key: 0,
  class: "text-muted-foreground col-span-full text-sm"
}, Sg = {
  key: 1,
  class: "text-muted-foreground col-span-full text-xs"
}, Mg = /* @__PURE__ */ L({
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
      () => a.field.preview ? pg(a.field.preview) : void 0
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
    return (v, p) => d.value ? (t(), n("div", {
      key: 0,
      role: "radiogroup",
      class: A(["bg-muted inline-flex w-fit max-w-full items-stretch gap-0.5 rounded-full p-1", e.disabled ? "opacity-50" : ""])
    }, [
      (t(!0), n(z, null, j(e.options, (h) => (t(), n("label", {
        key: String(h.value),
        class: A(["relative flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors", [
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
          onChange: ($) => r("update:modelValue", h.value)
        }, null, 40, gg),
        p[0] || (p[0] = l("span", {
          class: "ring-ring pointer-events-none absolute inset-0 rounded-full peer-focus-visible:ring-2",
          "aria-hidden": "true"
        }, null, -1)),
        s.value ? (t(), n("span", hg, [
          (t(), D(Ce(s.value), {
            value: h.value,
            label: h.label,
            selected: f(h)
          }, null, 8, ["value", "label", "selected"]))
        ])) : b("", !0),
        l("span", bg, c(h.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", yg, " Nothing to choose from yet. ")) : b("", !0)
    ], 2)) : (t(), n("div", {
      key: 1,
      role: "radiogroup",
      class: A(["grid gap-3", u.value])
    }, [
      (t(!0), n(z, null, j(e.options, (h) => (t(), n("label", {
        key: String(h.value),
        class: A(["group relative flex flex-col gap-2 rounded-lg border p-2 transition-colors", [
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
          onChange: ($) => r("update:modelValue", h.value)
        }, null, 40, xg),
        p[1] || (p[1] = l("span", {
          class: "ring-ring pointer-events-none absolute inset-0 rounded-lg peer-focus-visible:ring-2",
          "aria-hidden": "true"
        }, null, -1)),
        l("span", kg, [
          s.value ? (t(), D(Ce(s.value), {
            key: 0,
            value: h.value,
            label: h.label,
            selected: f(h)
          }, null, 8, ["value", "label", "selected"])) : i.value ? (t(), n("span", $g, " no preview ")) : b("", !0)
        ]),
        l("span", wg, c(h.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", Cg, " Nothing to choose from yet. ")) : b("", !0),
      i.value && e.options.length > 0 ? (t(), n("p", Sg, [
        p[2] || (p[2] = U(" No preview registered for ", -1)),
        l("code", null, c(e.field.preview), 1),
        U(". Registered: " + c(x(vg)().join(", ") || "none") + ". ", 1)
      ])) : b("", !0)
    ], 2));
  }
}), Bg = {
  class: "border-border size-10 overflow-hidden rounded-md border",
  style: {
    backgroundImage: "linear-gradient(45deg, rgba(0,0,0,.10) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.10) 75%), linear-gradient(45deg, rgba(0,0,0,.10) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.10) 75%)",
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 4px 4px"
  }
}, Ag = /* @__PURE__ */ L({
  __name: "PkSwatchPreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), n("span", Bg, [
      l("span", {
        class: "block size-full",
        style: ie({ backgroundColor: String(e.value) })
      }, null, 4)
    ]));
  }
}), _g = { class: "flex flex-col items-center gap-1 text-center" }, zg = {
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
    return (s, i) => (t(), n("div", _g, [
      l("div", {
        class: A(["inline-flex items-center justify-center font-mono font-semibold whitespace-nowrap tabular-nums", [
          r.value,
          e.compact ? "px-2 py-1 text-[10px]" : "px-6 py-3 text-xl tracking-[0.2em]"
        ]]),
        style: ie({ borderColor: a.value, color: a.value })
      }, c(e.code), 7),
      e.caption && !e.compact ? (t(), n("p", zg, c(e.caption), 1)) : b("", !0)
    ]));
  }
}), Pg = {
  dusk: "document",
  class: "flex flex-col gap-6 bg-white p-8 text-black"
}, Lg = { class: "flex items-center gap-3" }, Og = ["src"], jg = {
  key: 0,
  class: "mt-1 text-sm text-neutral-600"
}, Vg = {
  key: 1,
  class: "mt-1 font-mono text-sm text-neutral-600"
}, Dg = {
  key: 0,
  class: "text-right text-sm"
}, Tg = { class: "text-neutral-500" }, Ig = { class: "tabular-nums" }, Eg = { key: 1 }, Fg = { class: "text-xs font-semibold tracking-wider text-neutral-500 uppercase" }, Ng = { class: "mt-2 font-medium" }, Rg = { key: 2 }, Ug = { class: "w-full text-sm" }, Hg = { class: "w-full py-3 pr-2" }, qg = {
  key: 0,
  class: "text-xs text-neutral-500"
}, Kg = { key: 0 }, Gg = ["colspan"], Wg = {
  key: 0,
  class: "mt-6 flex break-inside-avoid justify-end"
}, Zg = { class: "w-64 text-sm" }, Jg = { class: "tabular-nums" }, Yg = {
  key: 3,
  class: "py-2"
}, Qg = { key: 4 }, Xg = { class: "text-xs font-semibold tracking-wider text-neutral-500 uppercase" }, eh = { class: "mt-2 flex flex-col gap-1 text-sm" }, th = {
  key: 6,
  class: "mt-auto border-t border-neutral-200 pt-4 text-xs text-neutral-500"
}, nh = { key: 0 }, ah = {
  key: 1,
  class: "mt-1"
}, lh = {
  key: 7,
  class: "rounded border border-dashed border-red-300 p-2 text-xs text-red-600"
}, oh = /* @__PURE__ */ L({
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
    return (f, v) => (t(), n("article", Pg, [
      l("div", Lg, [
        e.document.branding.logoUrl ? (t(), n("img", {
          key: 0,
          src: e.document.branding.logoUrl,
          alt: "",
          class: "max-h-10 max-w-40 object-contain"
        }, null, 8, Og)) : (t(), n("p", {
          key: 1,
          class: "text-lg font-semibold",
          style: ie({ color: a() })
        }, c(e.document.branding.company), 5))
      ]),
      (t(!0), n(z, null, j(e.document.blocks, (p, h) => (t(), n(z, { key: h }, [
        p.type === "header" ? (t(), n("header", {
          key: 0,
          class: "flex items-start justify-between gap-8 border-b pb-4",
          style: ie({ borderColor: a() })
        }, [
          l("div", null, [
            l("h1", {
              class: "text-2xl font-semibold tracking-tight",
              style: ie({ color: a() })
            }, c(p.title), 5),
            p.subtitle ? (t(), n("p", jg, c(p.subtitle), 1)) : b("", !0),
            p.reference ? (t(), n("p", Vg, c(p.reference), 1)) : b("", !0)
          ]),
          r(p).length ? (t(), n("dl", Dg, [
            (t(!0), n(z, null, j(r(p), ($, k) => (t(), n("div", {
              key: k,
              class: "flex justify-end gap-4 py-0.5"
            }, [
              l("dt", Tg, c($.label), 1),
              l("dd", Ig, c($.value), 1)
            ]))), 128))
          ])) : b("", !0)
        ], 4)) : p.type === "party" ? (t(), n("section", Eg, [
          l("h2", Fg, c(p.heading), 1),
          l("p", Ng, c(p.name), 1),
          (t(!0), n(z, null, j(d(p.lines), ($, k) => (t(), n("p", {
            key: k,
            class: "text-sm text-neutral-600"
          }, c($), 1))), 128))
        ])) : p.type === "lines" ? (t(), n("section", Rg, [
          l("table", Ug, [
            l("thead", null, [
              l("tr", {
                class: "border-b-2 text-left",
                style: ie({ borderColor: a() })
              }, [
                (t(!0), n(z, null, j(d(p.columns), ($, k) => (t(), n("th", {
                  key: k,
                  class: A(["pb-2 font-medium", k > 0 ? "pl-3 text-right whitespace-nowrap" : ""])
                }, c($), 3))), 128))
              ], 4)
            ]),
            l("tbody", null, [
              (t(!0), n(z, null, j(s(p), ($, k) => (t(), n("tr", {
                key: k,
                class: "border-b border-neutral-200"
              }, [
                l("td", Hg, [
                  l("p", null, c($.description), 1),
                  $.detail ? (t(), n("p", qg, c($.detail), 1)) : b("", !0)
                ]),
                (t(!0), n(z, null, j($.cells, (S, w) => (t(), n("td", {
                  key: w,
                  class: "py-3 pl-3 text-right whitespace-nowrap tabular-nums"
                }, c(S), 1))), 128))
              ]))), 128)),
              s(p).length === 0 ? (t(), n("tr", Kg, [
                l("td", {
                  colspan: d(p.columns).length || 1,
                  class: "py-6 text-center text-neutral-500"
                }, c(p.empty), 9, Gg)
              ])) : b("", !0)
            ])
          ]),
          i(p).length ? (t(), n("div", Wg, [
            l("dl", Zg, [
              (t(!0), n(z, null, j(i(p), ($, k) => (t(), n("div", {
                key: k,
                class: A([
                  "flex justify-between py-1",
                  $.strong ? "mt-1 border-t-2 pt-2 text-base font-semibold" : ""
                ]),
                style: ie($.strong ? { color: a(), borderColor: a() } : void 0)
              }, [
                l("dt", {
                  class: A($.strong ? "" : "text-neutral-600")
                }, c($.label), 3),
                l("dd", Jg, c($.value), 1)
              ], 6))), 128))
            ])
          ])) : b("", !0)
        ])) : p.type === "code" ? (t(), n("section", Yg, [
          I(ia, {
            code: u(p.code),
            caption: u(p.caption),
            style: ie(u(p.style)),
            accent: e.document.branding.accent,
            mono: e.document.branding.mono
          }, null, 8, ["code", "caption", "style", "accent", "mono"])
        ])) : p.type === "steps" ? (t(), n("section", Qg, [
          l("h2", Xg, c(p.heading), 1),
          l("ol", eh, [
            (t(!0), n(z, null, j(d(p.items), ($, k) => (t(), n("li", {
              key: k,
              class: "flex gap-2"
            }, [
              l("span", {
                class: "font-semibold tabular-nums",
                style: ie({ color: a() })
              }, c(k + 1) + ".", 5),
              l("span", null, c($), 1)
            ]))), 128))
          ])
        ])) : p.type === "note" ? (t(), n("p", {
          key: 5,
          class: A(["text-sm", p.emphasis ? "font-medium" : "text-neutral-600"]),
          style: ie(p.emphasis ? { color: a() } : void 0)
        }, c(p.text), 7)) : p.type === "footer" ? (t(), n("footer", th, [
          p.text ? (t(), n("p", nh, c(p.text), 1)) : b("", !0),
          d(p.contacts).length ? (t(), n("p", ah, c(d(p.contacts).join(" · ")), 1)) : b("", !0)
        ])) : (t(), n("p", lh, " This document contains a “" + c(p.type) + "” block, which this version cannot draw. ", 1))
      ], 64))), 128))
    ]));
  }
}), sh = ["aria-label", "title"], rh = {
  class: "size-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, ih = {
  key: 1,
  d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
}, E6 = /* @__PURE__ */ L({
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
      (t(), n("svg", rh, [
        r.value ? (t(), n(z, { key: 0 }, [
          d[0] || (d[0] = l("circle", {
            cx: "12",
            cy: "12",
            r: "4"
          }, null, -1)),
          d[1] || (d[1] = l("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" }, null, -1))
        ], 64)) : (t(), n("path", ih))
      ]))
    ], 8, sh));
  }
}), dh = ["width", "height"], uh = { key: 0 }, ch = ["x1", "x2", "y1", "y2"], fh = ["x", "y"], mh = ["x1", "x2", "y1", "y2"], ph = ["x", "y"], vh = ["x", "y", "width", "height", "fill-opacity", "onMouseenter"], gh = ["x", "y", "width", "height", "fill", "fill-opacity"], hh = ["x", "y"], bh = ["x", "y"], yh = {
  key: 0,
  class: "bg-popover pointer-events-none absolute top-2 right-2 z-10 min-w-32 rounded-lg border p-2 shadow-lg"
}, xh = { class: "text-muted-foreground mb-1 text-[11px] capitalize" }, kh = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, $h = { class: "text-xs font-semibold tabular-nums" }, wh = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, Ch = { class: "text-muted-foreground" }, _n = 5.6, F6 = /* @__PURE__ */ L({
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
    const i = H(null), d = H(560), u = H(null);
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
    ], p = y(() => (o.series?.length ? o.series : o.data?.length ? [{ name: "", points: o.data }] : []).map((J, V) => ({
      ...J,
      color: J.color ?? v[V % v.length]
    }))), h = y(() => p.value[0]?.points.map((P) => P.label) ?? []), $ = y(() => h.value.length), k = y(() => o.orientation === "horizontal"), S = y(() => Math.max(0, ...h.value.map((P) => P.length))), w = y(() => {
      if (!k.value)
        return o.showAxis ? 44 : 8;
      const P = S.value * _n + 16;
      return Math.round(Math.min(Math.max(60, P), d.value * 0.4));
    }), C = y(() => Math.max(4, Math.floor((w.value - 16) / _n)));
    function B(P) {
      return P.length <= C.value ? P : `${P.slice(0, C.value - 1)}…`;
    }
    const M = y(() => ({
      top: 12,
      right: 12,
      bottom: 26,
      left: w.value
    })), m = y(() => ({
      w: Math.max(1, d.value - M.value.left - M.value.right),
      h: Math.max(1, o.height - M.value.top - M.value.bottom)
    })), g = (P) => o.format ? o.format(P) : _(P);
    function _(P) {
      return Math.abs(P) >= 1e6 ? `${(P / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(P) >= 1e3 ? `${(P / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(P * 100) / 100);
    }
    const T = y(() => {
      const P = h.value.map(
        (te, le) => o.stacked ? p.value.reduce((Y, ne) => Y + Math.max(0, ne.points[le]?.value ?? 0), 0) : Math.max(...p.value.map((Y) => Y.points[le]?.value ?? 0))
      );
      if (o.maxValue)
        return o.maxValue;
      const J = Math.max(...P, 0);
      if (J <= 0)
        return 1;
      const V = 10 ** Math.floor(Math.log10(J));
      return ([1, 2, 2.5, 5, 10].find((te) => J <= te * V) ?? 10) * V;
    }), F = y(
      () => (k.value ? m.value.h : m.value.w) / Math.max(1, $.value)
    ), Z = y(() => F.value * 0.68), G = y(
      () => o.stacked || p.value.length <= 1 ? Z.value : Z.value / p.value.length
    ), X = y(() => {
      const P = [], J = new Array($.value).fill(0);
      return p.value.forEach((V, E) => {
        V.points.forEach((te, le) => {
          const ne = Math.max(0, te.value) / T.value * (k.value ? m.value.w : m.value.h), se = (k.value ? M.value.top : M.value.left) + le * F.value + (F.value - Z.value) / 2, Me = o.stacked ? 0 : E * G.value;
          P.push(
            k.value ? {
              x: M.value.left + J[le],
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
              y: M.value.top + m.value.h - ne - J[le],
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
        value: T.value * (k.value ? P : 1 - P),
        x: M.value.left + m.value.w * P,
        y: M.value.top + m.value.h * P
      }))
    ), K = y(() => Math.max(1, Math.ceil($.value / (k.value ? 14 : 10))));
    function N(P) {
      return P === $.value - 1 || P % K.value === 0;
    }
    function R(P) {
      return (k.value ? M.value.top : M.value.left) + P * F.value + F.value / 2;
    }
    const Q = y(() => u.value === null ? null : {
      label: h.value[u.value],
      rows: p.value.map((P) => ({
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
      $.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(z, { key: 1 }, [
        (t(), n("svg", {
          width: d.value,
          height: e.height,
          onMouseleave: J[0] || (J[0] = (V) => u.value = null)
        }, [
          e.showAxis ? (t(), n("g", uh, [
            k.value ? (t(), n(z, { key: 0 }, [
              (t(!0), n(z, null, j(W.value, (V) => (t(), n("line", {
                key: `g-${V.x}`,
                x1: V.x,
                x2: V.x,
                y1: M.value.top,
                y2: M.value.top + m.value.h,
                stroke: "var(--border)",
                "stroke-width": "1"
              }, null, 8, ch))), 128)),
              (t(!0), n(z, null, j(W.value, (V) => (t(), n("text", {
                key: `gt-${V.x}`,
                x: V.x,
                y: e.height - 6,
                "text-anchor": "middle",
                class: "fill-muted-foreground text-[10px] tabular-nums"
              }, c(_(V.value)), 9, fh))), 128))
            ], 64)) : (t(), n(z, { key: 1 }, [
              (t(!0), n(z, null, j(W.value, (V) => (t(), n("line", {
                key: `g-${V.y}`,
                x1: M.value.left,
                x2: d.value - M.value.right,
                y1: V.y,
                y2: V.y,
                stroke: "var(--border)",
                "stroke-width": "1"
              }, null, 8, mh))), 128)),
              (t(!0), n(z, null, j(W.value, (V) => (t(), n("text", {
                key: `gt-${V.y}`,
                x: M.value.left - 8,
                y: V.y + 3,
                "text-anchor": "end",
                class: "fill-muted-foreground text-[10px] tabular-nums"
              }, c(_(V.value)), 9, ph))), 128))
            ], 64))
          ])) : b("", !0),
          (t(!0), n(z, null, j(h.value, (V, E) => (t(), n("rect", {
            key: `hit-${E}`,
            x: k.value ? M.value.left : M.value.left + E * F.value,
            y: k.value ? M.value.top + E * F.value : M.value.top,
            width: k.value ? m.value.w : F.value,
            height: k.value ? F.value : m.value.h,
            fill: "var(--muted)",
            "fill-opacity": u.value === E ? 0.4 : 0,
            onMouseenter: (te) => u.value = E
          }, null, 40, vh))), 128)),
          (t(!0), n(z, null, j(X.value, (V, E) => (t(), n("rect", {
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
          }, null, 8, gh))), 128)),
          k.value ? (t(!0), n(z, { key: 1 }, j(h.value, (V, E) => ge((t(), n("text", {
            key: `c-${E}`,
            x: M.value.left - 8,
            y: R(E) + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[10px]"
          }, [
            U(c(B(V)) + " ", 1),
            l("title", null, c(V), 1)
          ], 8, hh)), [
            [qe, N(E)]
          ])), 128)) : (t(!0), n(z, { key: 2 }, j(h.value, (V, E) => ge((t(), n("text", {
            key: `c-${E}`,
            x: R(E),
            y: e.height - 8,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, c(V), 9, bh)), [
            [qe, N(E)]
          ])), 128))
        ], 40, dh)),
        Q.value ? (t(), n("div", yh, [
          l("p", xh, c(Q.value.label), 1),
          (t(!0), n(z, null, j(Q.value.rows, (V, E) => (t(), n("div", {
            key: E,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", kh, c(V.name || "Value"), 1),
            l("span", $h, c(g(V.value)), 1)
          ]))), 128))
        ])) : b("", !0),
        e.showLegend && p.value.length > 1 ? (t(), n("div", wh, [
          (t(!0), n(z, null, j(p.value, (V, E) => (t(), n("span", {
            key: E,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", Ch, c(V.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), Sh = ["width", "height"], Mh = ["id"], Bh = ["stop-color"], Ah = ["stop-color"], _h = { key: 0 }, zh = ["x1", "x2", "y1", "y2"], Ph = ["x", "y"], Lh = ["x", "y"], Oh = ["x1", "x2", "y1", "y2"], jh = ["d", "fill"], Vh = ["d", "stroke", "stroke-dasharray"], Dh = ["cx", "cy", "fill"], Th = { key: 1 }, Ih = ["x1", "x2", "y1", "y2"], Eh = ["cx", "cy", "fill"], Fh = ["x", "y"], Nh = { class: "text-muted-foreground mb-1.5 text-[11px] whitespace-nowrap" }, Rh = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, Uh = { class: "text-xs font-semibold tabular-nums" }, Hh = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, qh = { class: "text-muted-foreground" }, Kh = /* @__PURE__ */ L({
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
    const o = e, a = y(() => v.value.some((P) => P.axis === "right")), r = H(null), s = H(560), i = H(null);
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
    }))), p = y(() => v.value[0]?.points.map((P) => P.label) ?? []), h = y(() => p.value.length), $ = y(() => ({
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
    function w(P) {
      const J = Math.max(...P, 0);
      if (J <= 0)
        return 1;
      const V = 10 ** Math.floor(Math.log10(J));
      return ([1, 2, 2.5, 5, 10].find((te) => J <= te * V) ?? 10) * V;
    }
    const C = y(
      () => w(
        v.value.filter((P) => P.axis !== "right").flatMap((P) => P.points.map((J) => J.value))
      )
    ), B = y(
      () => w(
        v.value.filter((P) => P.axis === "right").flatMap((P) => P.points.map((J) => J.value))
      )
    ), M = y(() => ({
      w: Math.max(1, s.value - $.value.left - $.value.right),
      h: Math.max(1, o.height - $.value.top - $.value.bottom)
    }));
    function m(P) {
      return $.value.left + (h.value <= 1 ? 0 : P / (h.value - 1) * M.value.w);
    }
    function g(P, J = "left") {
      const V = J === "right" ? B.value : C.value;
      return $.value.top + M.value.h - P / V * M.value.h;
    }
    const _ = y(
      () => v.value.map((P) => {
        const J = P.points.map((E, te) => ({
          ...E,
          x: m(te),
          y: g(E.value, P.axis ?? "left")
        })), V = P.stepped ? T(J) : F(J);
        return { ...P, pts: J, line: V, area: Z(V, J) };
      })
    );
    function T(P) {
      if (P.length === 0)
        return "";
      let J = `M${P[0].x.toFixed(2)},${P[0].y.toFixed(2)}`;
      for (let V = 1; V < P.length; V++)
        J += ` L${P[V].x.toFixed(2)},${P[V - 1].y.toFixed(2)} L${P[V].x.toFixed(2)},${P[V].y.toFixed(2)}`;
      return J;
    }
    function F(P) {
      const J = P.length;
      if (J === 0)
        return "";
      if (J === 1)
        return `M${P[0].x},${P[0].y}`;
      const V = [], E = [];
      for (let Y = 0; Y < J - 1; Y++)
        V[Y] = P[Y + 1].x - P[Y].x, E[Y] = V[Y] === 0 ? 0 : (P[Y + 1].y - P[Y].y) / V[Y];
      const te = [E[0]];
      for (let Y = 1; Y < J - 1; Y++)
        if (E[Y - 1] * E[Y] <= 0)
          te[Y] = 0;
        else {
          const ne = 2 * V[Y] + V[Y - 1], se = V[Y] + 2 * V[Y - 1];
          te[Y] = (ne + se) / (ne / E[Y - 1] + se / E[Y]);
        }
      te[J - 1] = E[J - 2];
      let le = `M${P[0].x.toFixed(2)},${P[0].y.toFixed(2)}`;
      for (let Y = 0; Y < J - 1; Y++) {
        const ne = V[Y] / 3;
        le += ` C${(P[Y].x + ne).toFixed(2)},${(P[Y].y + te[Y] * ne).toFixed(2)} ${(P[Y + 1].x - ne).toFixed(2)},${(P[Y + 1].y - te[Y + 1] * ne).toFixed(2)} ${P[Y + 1].x.toFixed(2)},${P[Y + 1].y.toFixed(2)}`;
      }
      return le;
    }
    function Z(P, J) {
      if (J.length === 0)
        return "";
      const V = $.value.top + M.value.h;
      return `${P} L${J[J.length - 1].x.toFixed(2)},${V} L${J[0].x.toFixed(2)},${V} Z`;
    }
    const G = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((P) => ({
        y: $.value.top + M.value.h * P,
        value: C.value * (1 - P)
      }))
    ), X = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((P) => ({
        y: $.value.top + M.value.h * P,
        value: B.value * (1 - P)
      }))
    ), W = y(() => Math.max(1, Math.ceil(h.value / 8)));
    function K(P) {
      return P === h.value - 1 || P % W.value === 0;
    }
    function N(P) {
      const J = P.currentTarget.getBoundingClientRect(), V = P.clientX - J.left - $.value.left, E = h.value <= 1 ? 1 : M.value.w / (h.value - 1);
      i.value = Math.min(h.value - 1, Math.max(0, Math.round(V / E)));
    }
    const R = y(() => {
      if (i.value === null || h.value === 0)
        return null;
      const P = i.value;
      return {
        i: P,
        x: m(P),
        label: p.value[P],
        rows: _.value.map((J) => ({
          name: J.name,
          color: J.color,
          value: J.points[P]?.value ?? 0,
          y: J.pts[P]?.y ?? 0
        }))
      };
    }), Q = y(() => {
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
      }, " No data ", 4)) : (t(), n(z, { key: 1 }, [
        (t(), n("svg", {
          width: s.value,
          height: e.height,
          class: "overflow-visible",
          onMousemove: N,
          onMouseleave: J[0] || (J[0] = (V) => i.value = null)
        }, [
          l("defs", null, [
            (t(!0), n(z, null, j(_.value, (V, E) => (t(), n("linearGradient", {
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
              }, null, 8, Bh),
              l("stop", {
                offset: "100%",
                "stop-color": V.color,
                "stop-opacity": "0.01"
              }, null, 8, Ah)
            ], 8, Mh))), 128))
          ]),
          e.showAxis ? (t(), n("g", _h, [
            (t(!0), n(z, null, j(G.value, (V) => (t(), n("line", {
              key: V.y,
              x1: $.value.left,
              x2: s.value - $.value.right,
              y1: V.y,
              y2: V.y,
              stroke: "var(--border)",
              "stroke-width": "1"
            }, null, 8, zh))), 128)),
            (t(!0), n(z, null, j(G.value, (V) => (t(), n("text", {
              key: `t-${V.y}`,
              x: $.value.left - 8,
              y: V.y + 3,
              "text-anchor": "end",
              class: "fill-muted-foreground text-[10px] tabular-nums"
            }, c(S(V.value)), 9, Ph))), 128)),
            a.value ? (t(!0), n(z, { key: 0 }, j(X.value, (V) => (t(), n("text", {
              key: `rt-${V.y}`,
              x: s.value - $.value.right + 8,
              y: V.y + 3,
              "text-anchor": "start",
              class: "fill-muted-foreground text-[10px] tabular-nums"
            }, c(S(V.value)), 9, Lh))), 128)) : b("", !0)
          ])) : b("", !0),
          (t(!0), n(z, null, j(p.value, (V, E) => ge((t(), n("line", {
            key: `v-${E}`,
            x1: m(E),
            x2: m(E),
            y1: $.value.top,
            y2: $.value.top + M.value.h,
            stroke: "var(--border)",
            "stroke-width": "1",
            "stroke-dasharray": "2 4",
            opacity: "0.7"
          }, null, 8, Oh)), [
            [qe, K(E)]
          ])), 128)),
          (t(!0), n(z, null, j(_.value, (V, E) => (t(), n("g", {
            key: `s-${E}`
          }, [
            V.filled ?? e.type === "area" ? (t(), n("path", {
              key: 0,
              d: V.area,
              fill: `url(#pk-fill-${x(f)}-${E})`
            }, null, 8, jh)) : b("", !0),
            l("path", {
              d: V.line,
              fill: "none",
              stroke: V.color,
              "stroke-width": "2",
              "stroke-linejoin": "round",
              "stroke-linecap": "round",
              "stroke-dasharray": V.dashed ? "6 4" : void 0
            }, null, 8, Vh),
            V.pts.length === 1 ? (t(), n("circle", {
              key: 1,
              cx: V.pts[0].x,
              cy: V.pts[0].y,
              r: "3",
              fill: V.color
            }, null, 8, Dh)) : b("", !0)
          ]))), 128)),
          R.value ? (t(), n("g", Th, [
            l("line", {
              x1: R.value.x,
              x2: R.value.x,
              y1: $.value.top,
              y2: $.value.top + M.value.h,
              stroke: "var(--muted-foreground)",
              "stroke-width": "1",
              "stroke-dasharray": "4 3"
            }, null, 8, Ih),
            (t(!0), n(z, null, j(R.value.rows, (V, E) => (t(), n("circle", {
              key: `d-${E}`,
              cx: R.value.x,
              cy: V.y,
              r: "4",
              fill: V.color,
              stroke: "var(--card)",
              "stroke-width": "2"
            }, null, 8, Eh))), 128))
          ])) : b("", !0),
          (t(!0), n(z, null, j(p.value, (V, E) => ge((t(), n("text", {
            key: `x-${E}`,
            x: m(E),
            y: e.height - 6,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px]"
          }, c(V), 9, Fh)), [
            [qe, K(E)]
          ])), 128))
        ], 40, Sh)),
        R.value ? (t(), n("div", {
          key: 0,
          class: "bg-popover pointer-events-none absolute z-10 min-w-36 rounded-lg border p-2 shadow-lg",
          style: ie(Q.value)
        }, [
          l("p", Nh, c(R.value.label), 1),
          (t(!0), n(z, null, j(R.value.rows, (V, E) => (t(), n("div", {
            key: E,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", Rh, c(V.name || "Value"), 1),
            l("span", Uh, c(k(V.value)), 1)
          ]))), 128))
        ], 4)) : b("", !0),
        e.showLegend && v.value.length > 1 ? (t(), n("div", Hh, [
          (t(!0), n(z, null, j(_.value, (V, E) => (t(), n("span", {
            key: E,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: V.color })
            }, null, 4),
            l("span", qh, c(V.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), Gh = { class: "bg-popover pointer-events-none absolute top-2 left-2 z-10 rounded-lg border px-2.5 py-1.5 shadow-lg" }, Wh = { class: "text-muted-foreground text-[11px] capitalize" }, Zh = { class: "text-sm font-semibold tabular-nums" }, Jh = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, ht = /* @__PURE__ */ L({
  __name: "ChartTooltip",
  props: {
    label: {},
    value: {},
    share: { default: null }
  },
  setup(e) {
    return (o, a) => (t(), n("div", Gh, [
      l("p", Wh, c(e.label), 1),
      l("p", Zh, [
        U(c(e.value) + " ", 1),
        e.share ? (t(), n("span", Jh, " (" + c(e.share) + ") ", 1)) : b("", !0)
      ])
    ]));
  }
}), Yh = {
  key: 1,
  class: "relative flex flex-wrap items-center gap-4 sm:flex-nowrap"
}, Qh = ["width", "height", "viewBox", "aria-label"], Xh = ["d", "fill", "fill-opacity", "onMouseenter"], e1 = ["x", "y"], t1 = ["x", "y"], n1 = { class: "flex min-w-0 flex-1 flex-col gap-0.5" }, a1 = ["onMouseenter"], l1 = { class: "min-w-0 flex-1 truncate capitalize" }, o1 = { class: "tabular-nums font-medium" }, s1 = { class: "text-muted-foreground w-9 text-right tabular-nums" }, N6 = /* @__PURE__ */ L({
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
    ], r = y(() => o.data.reduce((C, B) => C + B.value, 0)), s = H(null), i = y(() => o.height), d = y(() => i.value / 2 - 4), u = y(() => o.type === "doughnut" ? d.value * 0.62 : 0);
    function f(C) {
      return a[C % a.length];
    }
    function v(C) {
      return 1 - Math.min(0.55, Math.floor(C / a.length) * 0.28);
    }
    const p = y(() => {
      if (r.value <= 0)
        return [];
      const C = i.value / 2;
      let B = -Math.PI / 2;
      return o.data.map((M, m) => {
        const g = M.value / r.value, _ = g * Math.PI * 2, T = B, F = B + _;
        return B = F, {
          ...M,
          share: g,
          colour: f(m),
          opacity: v(m),
          /*
           * The 100% case. An arc from a point back to itself is degenerate
           * and SVG draws nothing, so it is expressed as two half circles.
           */
          path: g >= 0.9999 ? k(C) : $(C, T, F, d.value, u.value)
        };
      });
    });
    function h(C, B, M) {
      return `${(C + Math.cos(B) * M).toFixed(2)},${(C + Math.sin(B) * M).toFixed(2)}`;
    }
    function $(C, B, M, m, g) {
      const _ = M - B > Math.PI ? 1 : 0;
      return g <= 0 ? `M${C},${C} L${h(C, B, m)} A${m},${m} 0 ${_} 1 ${h(C, M, m)} Z` : [
        `M${h(C, B, m)}`,
        `A${m},${m} 0 ${_} 1 ${h(C, M, m)}`,
        `L${h(C, M, g)}`,
        `A${g},${g} 0 ${_} 0 ${h(C, B, g)}`,
        "Z"
      ].join(" ");
    }
    function k(C) {
      const B = d.value, M = u.value, m = [
        `M${C - B},${C}`,
        `A${B},${B} 0 1 1 ${C + B},${C}`,
        `A${B},${B} 0 1 1 ${C - B},${C}`,
        "Z"
      ];
      return M <= 0 ? m.join(" ") : [
        ...m,
        `M${C - M},${C}`,
        `A${M},${M} 0 1 0 ${C + M},${C}`,
        `A${M},${M} 0 1 0 ${C - M},${C}`,
        "Z"
      ].join(" ");
    }
    const S = (C) => o.format ? o.format(C) : new Intl.NumberFormat().format(C), w = (C) => `${(C * 100).toFixed(C < 0.01 ? 2 : 0)}%`;
    return (C, B) => r.value <= 0 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " No data ", 4)) : (t(), n("div", Yh, [
      (t(), n("svg", {
        width: i.value,
        height: i.value,
        viewBox: `0 0 ${i.value} ${i.value}`,
        class: "shrink-0",
        role: "img",
        "aria-label": `Total ${S(r.value)}`
      }, [
        (t(!0), n(z, null, j(p.value, (M, m) => (t(), n("path", {
          key: m,
          d: M.path,
          fill: M.colour,
          "fill-opacity": s.value === null || s.value === m ? M.opacity : M.opacity * 0.35,
          "fill-rule": "evenodd",
          stroke: "var(--card)",
          "stroke-width": "2",
          class: "cursor-default transition-[fill-opacity]",
          onMouseenter: (g) => s.value = m,
          onMouseleave: B[0] || (B[0] = (g) => s.value = null)
        }, null, 40, Xh))), 128)),
        e.type === "doughnut" ? (t(), n(z, { key: 0 }, [
          l("text", {
            x: i.value / 2,
            y: i.value / 2 - 2,
            "text-anchor": "middle",
            class: "fill-foreground text-base font-semibold tabular-nums"
          }, c(S(s.value === null ? r.value : p.value[s.value].value)), 9, e1),
          l("text", {
            x: i.value / 2,
            y: i.value / 2 + 14,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, c(s.value === null ? "Total" : p.value[s.value].label), 9, t1)
        ], 64)) : b("", !0)
      ], 8, Qh)),
      l("ul", n1, [
        (t(!0), n(z, null, j(p.value, (M, m) => (t(), n("li", {
          key: m,
          class: A(["flex cursor-default items-center gap-2 rounded px-1.5 py-1 text-xs transition-colors", s.value === m ? "bg-muted" : ""]),
          onMouseenter: (g) => s.value = m,
          onMouseleave: B[1] || (B[1] = (g) => s.value = null)
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: M.colour, opacity: M.opacity })
          }, null, 4),
          l("span", l1, c(M.label), 1),
          l("span", o1, c(S(M.value)), 1),
          l("span", s1, c(w(M.share)), 1)
        ], 42, a1))), 128))
      ]),
      s.value !== null && e.type === "pie" ? (t(), D(ht, {
        key: 0,
        label: p.value[s.value].label,
        value: S(p.value[s.value].value),
        share: w(p.value[s.value].share)
      }, null, 8, ["label", "value", "share"])) : b("", !0)
    ]));
  }
}), r1 = ["width", "height", "viewBox", "aria-label"], i1 = { class: "text-border" }, d1 = ["x1", "x2", "y1", "y2", "stroke-dasharray"], u1 = { class: "fill-muted-foreground text-[10px]" }, c1 = ["x", "y"], f1 = ["x", "y"], m1 = ["cx", "cy", "r", "fill", "fill-opacity", "stroke", "opacity", "onMouseenter"], p1 = {
  key: 1,
  class: "mt-2 flex flex-wrap gap-3"
}, R6 = /* @__PURE__ */ L({
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
    ], r = H(null), s = H(560), i = H(null);
    let d = null;
    be(() => {
      d = new ResizeObserver((W) => {
        const K = W[0]?.contentRect.width ?? 0;
        K > 0 && (s.value = K);
      }), r.value && d.observe(r.value);
    }), ke(() => d?.disconnect());
    const u = y(
      () => o.series?.length ? o.series : [{ name: "", points: o.data ?? [] }]
    ), f = (W, K) => K.color ?? a[W % a.length], v = y(() => u.value.flatMap((W) => W.points)), p = y(() => v.value.some((W) => typeof W.r == "number")), h = { top: 12, right: 16, bottom: 32, left: 48 }, $ = y(() => Math.max(10, s.value - h.left - h.right)), k = y(() => Math.max(10, o.height - h.top - h.bottom));
    function S(W) {
      if (W.length === 0)
        return [0, 1];
      const K = Math.min(...W), N = Math.max(...W), R = N - K || Math.abs(N) || 1;
      return [K - R * 0.08, N + R * 0.08];
    }
    const w = y(() => S(v.value.map((W) => W.x))), C = y(() => S(v.value.map((W) => W.y))), B = (W) => {
      const [K, N] = w.value;
      return h.left + (W - K) / (N - K) * $.value;
    }, M = (W) => {
      const [K, N] = C.value;
      return h.top + k.value - (W - K) / (N - K) * k.value;
    }, m = y(() => Math.max(...v.value.map((W) => W.r ?? 0), 0));
    function g(W) {
      if (!p.value || !m.value)
        return 4;
      const K = Math.max(0, W.r ?? 0) / m.value;
      return 3 + Math.sqrt(K) * (o.maxRadius - 3);
    }
    function _([W, K]) {
      return Array.from({ length: 5 }, (N, R) => W + (K - W) / 4 * R);
    }
    const T = y(() => _(w.value)), F = y(() => _(C.value)), Z = (W) => o.formatX?.(W) ?? String(Math.round(W * 100) / 100), G = (W) => o.formatY?.(W) ?? String(Math.round(W * 100) / 100), X = y(() => {
      if (!i.value)
        return null;
      const W = u.value[i.value.s], K = W?.points[i.value.p];
      return K ? { series: W, point: K } : null;
    });
    return (W, K) => (t(), n("div", {
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
        "aria-label": p.value ? "Bubble chart" : "Scatter chart"
      }, [
        l("g", i1, [
          (t(!0), n(z, null, j(F.value, (N, R) => (t(), n("line", {
            key: `gy-${R}`,
            x1: h.left,
            x2: h.left + $.value,
            y1: M(N),
            y2: M(N),
            stroke: "currentColor",
            "stroke-width": "1",
            "stroke-dasharray": R === 0 ? "0" : "3 3",
            opacity: "0.5"
          }, null, 8, d1))), 128))
        ]),
        l("g", u1, [
          (t(!0), n(z, null, j(F.value, (N, R) => (t(), n("text", {
            key: `ty-${R}`,
            x: h.left - 8,
            y: M(N) + 3,
            "text-anchor": "end"
          }, c(G(N)), 9, c1))), 128)),
          (t(!0), n(z, null, j(T.value, (N, R) => (t(), n("text", {
            key: `tx-${R}`,
            x: B(N),
            y: e.height - 10,
            "text-anchor": "middle"
          }, c(Z(N)), 9, f1))), 128))
        ]),
        (t(!0), n(z, null, j(u.value, (N, R) => (t(), n("g", {
          key: `s-${R}`
        }, [
          (t(!0), n(z, null, j(N.points, (Q, P) => (t(), n("circle", {
            key: `p-${R}-${P}`,
            cx: B(Q.x),
            cy: M(Q.y),
            r: g(Q),
            fill: f(R, N),
            "fill-opacity": p.value ? 0.55 : 0.85,
            stroke: f(R, N),
            "stroke-width": "1.5",
            class: "cursor-pointer transition-opacity",
            opacity: i.value && (i.value.s !== R || i.value.p !== P) ? 0.35 : 1,
            onMouseenter: (J) => i.value = { s: R, p: P },
            onMouseleave: K[0] || (K[0] = (J) => i.value = null)
          }, null, 40, m1))), 128))
        ]))), 128))
      ], 8, r1)),
      X.value ? (t(), D(ht, {
        key: 0,
        label: X.value.point.label ?? X.value.series.name ?? "Point",
        value: `${e.xLabel ? e.xLabel + " " : ""}${Z(X.value.point.x)} · ${e.yLabel ? e.yLabel + " " : ""}${G(X.value.point.y)}`,
        share: p.value && X.value.point.r != null ? String(X.value.point.r) : null
      }, null, 8, ["label", "value", "share"])) : b("", !0),
      e.showLegend && u.value.length > 1 ? (t(), n("div", p1, [
        (t(!0), n(z, null, j(u.value, (N, R) => (t(), n("span", {
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
}), v1 = {
  key: 1,
  class: "relative flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap"
}, g1 = ["width", "height", "viewBox"], h1 = ["points"], b1 = ["x1", "y1", "x2", "y2"], y1 = ["points", "fill", "stroke"], x1 = ["cx", "cy", "fill", "onMouseenter"], k1 = ["x", "y", "text-anchor"], $1 = {
  key: 0,
  class: "flex min-w-0 flex-col gap-1.5"
}, w1 = { class: "truncate" }, U6 = /* @__PURE__ */ L({
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
      () => o.series.map((M, m) => ({
        ...M,
        color: M.color ?? a[m % a.length]
      }))
    ), s = y(() => r.value[0]?.points.map((M) => M.label) ?? []), i = y(() => s.value.length), d = y(() => o.height), u = y(() => d.value / 2), f = y(() => d.value / 2 - 34), v = y(() => {
      const M = Math.max(...r.value.flatMap((_) => _.points.map((T) => T.value)), 0);
      if (M <= 0)
        return 1;
      const m = 10 ** Math.floor(Math.log10(M));
      return ([1, 2, 2.5, 5, 10].find((_) => M <= _ * m) ?? 10) * m;
    });
    function p(M) {
      return M / i.value * Math.PI * 2 - Math.PI / 2;
    }
    function h(M, m) {
      const g = p(M);
      return {
        x: u.value + Math.cos(g) * f.value * m,
        y: u.value + Math.sin(g) * f.value * m
      };
    }
    function $(M) {
      return Array.from({ length: i.value }, (m, g) => {
        const _ = h(g, M);
        return `${_.x.toFixed(2)},${_.y.toFixed(2)}`;
      }).join(" ");
    }
    const k = y(() => [0.25, 0.5, 0.75, 1].map((M) => ({ f: M, points: $(M) }))), S = y(
      () => r.value.map((M) => {
        const m = M.points.map((g) => Math.max(0, g.value) / v.value);
        return {
          name: M.name,
          color: M.color,
          values: M.points,
          outline: m.map((g, _) => {
            const T = h(_, g);
            return `${T.x.toFixed(2)},${T.y.toFixed(2)}`;
          }).join(" "),
          dots: m.map((g, _) => h(_, g))
        };
      })
    ), w = y(
      () => s.value.map((M, m) => {
        const g = p(m), _ = u.value + Math.cos(g) * (f.value + 14), T = u.value + Math.sin(g) * (f.value + 14), F = Math.cos(g);
        return {
          label: M,
          x: _,
          y: T + 3,
          anchor: Math.abs(F) < 0.2 ? "middle" : F > 0 ? "start" : "end"
        };
      })
    ), C = H(null), B = (M) => o.format ? o.format(M) : new Intl.NumberFormat().format(M);
    return (M, m) => i.value < 3 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " A radar needs at least three axes ", 4)) : (t(), n("div", v1, [
      (t(), n("svg", {
        width: d.value,
        height: d.value,
        viewBox: `0 0 ${d.value} ${d.value}`,
        class: "shrink-0"
      }, [
        (t(!0), n(z, null, j(k.value, (g) => (t(), n("polygon", {
          key: g.f,
          points: g.points,
          fill: "none",
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, h1))), 128)),
        (t(!0), n(z, null, j(s.value, (g, _) => (t(), n("line", {
          key: `spoke-${_}`,
          x1: u.value,
          y1: u.value,
          x2: h(_, 1).x,
          y2: h(_, 1).y,
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, b1))), 128)),
        (t(!0), n(z, null, j(S.value, (g, _) => (t(), n("g", {
          key: `s-${_}`
        }, [
          l("polygon", {
            points: g.outline,
            fill: g.color,
            "fill-opacity": "0.16",
            stroke: g.color,
            "stroke-width": "2"
          }, null, 8, y1),
          (t(!0), n(z, null, j(g.dots, (T, F) => (t(), n("circle", {
            key: F,
            cx: T.x,
            cy: T.y,
            r: "3",
            fill: g.color,
            stroke: "var(--card)",
            "stroke-width": "1.5",
            class: "cursor-default",
            onMouseenter: (Z) => C.value = {
              series: g.name,
              axis: s.value[F],
              value: g.values[F]?.value ?? 0
            },
            onMouseleave: m[0] || (m[0] = (Z) => C.value = null)
          }, null, 40, x1))), 128))
        ]))), 128)),
        (t(!0), n(z, null, j(w.value, (g, _) => (t(), n("text", {
          key: `l-${_}`,
          x: g.x,
          y: g.y,
          "text-anchor": g.anchor,
          class: "fill-muted-foreground text-[10px] capitalize"
        }, c(g.label), 9, k1))), 128))
      ], 8, g1)),
      e.showLegend ? (t(), n("ul", $1, [
        (t(!0), n(z, null, j(r.value, (g, _) => (t(), n("li", {
          key: _,
          class: "flex items-center gap-2 text-xs"
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: g.color })
          }, null, 4),
          l("span", w1, c(g.name), 1)
        ]))), 128))
      ])) : b("", !0),
      C.value ? (t(), D(ht, {
        key: 1,
        label: `${C.value.series} — ${C.value.axis}`,
        value: B(C.value.value)
      }, null, 8, ["label", "value"])) : b("", !0)
    ]));
  }
}), C1 = {
  key: 1,
  class: "relative flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap"
}, S1 = ["width", "height", "viewBox"], M1 = ["cx", "cy", "r"], B1 = ["d", "fill", "fill-opacity", "onMouseenter"], A1 = {
  key: 0,
  class: "flex min-w-0 flex-col gap-1.5"
}, _1 = { class: "min-w-0 flex-1 truncate capitalize" }, z1 = { class: "font-medium tabular-nums" }, H6 = /* @__PURE__ */ L({
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
    ], r = H(null), s = y(() => o.height), i = y(() => s.value / 2), d = y(() => s.value / 2 - 6), u = y(() => Math.max(...o.data.map(($) => Math.max(0, $.value)), 0)), f = y(() => {
      const $ = o.data.length;
      if ($ === 0 || u.value <= 0)
        return [];
      const k = Math.PI * 2 / $;
      return o.data.map((S, w) => {
        const C = Math.sqrt(Math.max(0, S.value) / u.value), B = d.value * C, M = w * k - Math.PI / 2, m = M + k;
        return {
          ...S,
          color: a[w % a.length],
          share: u.value === 0 ? 0 : S.value / u.value,
          path: v(i.value, M, m, B)
        };
      });
    });
    function v($, k, S, w) {
      if (w <= 0)
        return "";
      if (S - k >= Math.PI * 2 - 1e-6)
        return `M${$ - w},${$} A${w},${w} 0 1 1 ${$ + w},${$} A${w},${w} 0 1 1 ${$ - w},${$} Z`;
      const C = S - k > Math.PI ? 1 : 0, B = $ + Math.cos(k) * w, M = $ + Math.sin(k) * w, m = $ + Math.cos(S) * w, g = $ + Math.sin(S) * w;
      return `M${$},${$} L${B.toFixed(2)},${M.toFixed(2)} A${w.toFixed(2)},${w.toFixed(2)} 0 ${C} 1 ${m.toFixed(2)},${g.toFixed(2)} Z`;
    }
    const p = y(() => [0.5, 0.75, 1].map(($) => d.value * $)), h = ($) => o.format ? o.format($) : new Intl.NumberFormat().format($);
    return ($, k) => f.value.length === 0 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " No data ", 4)) : (t(), n("div", C1, [
      (t(), n("svg", {
        width: s.value,
        height: s.value,
        viewBox: `0 0 ${s.value} ${s.value}`,
        class: "shrink-0"
      }, [
        (t(!0), n(z, null, j(p.value, (S) => (t(), n("circle", {
          key: S,
          cx: i.value,
          cy: i.value,
          r: S,
          fill: "none",
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, M1))), 128)),
        (t(!0), n(z, null, j(f.value, (S, w) => (t(), n("path", {
          key: w,
          d: S.path,
          fill: S.color,
          stroke: "var(--card)",
          "stroke-width": "1.5",
          class: "cursor-default transition-opacity",
          "fill-opacity": r.value === null || r.value === w ? 0.75 : 0.3,
          onMouseenter: (C) => r.value = w,
          onMouseleave: k[0] || (k[0] = (C) => r.value = null)
        }, null, 40, B1))), 128))
      ], 8, S1)),
      e.showLegend ? (t(), n("ul", A1, [
        (t(!0), n(z, null, j(f.value, (S, w) => (t(), n("li", {
          key: w,
          class: "flex items-center gap-2 text-xs"
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: S.color })
          }, null, 4),
          l("span", _1, c(S.label), 1),
          l("span", z1, c(h(S.value)), 1)
        ]))), 128))
      ])) : b("", !0),
      r.value !== null ? (t(), D(ht, {
        key: 1,
        label: f.value[r.value].label,
        value: h(f.value[r.value].value)
      }, null, 8, ["label", "value"])) : b("", !0)
    ]));
  }
}), P1 = ["width", "height"], L1 = ["x1", "x2", "y1", "y2"], O1 = ["x", "y"], j1 = ["x", "y"], V1 = ["x", "y", "width", "height", "fill-opacity", "onMouseenter"], D1 = ["x", "y", "width", "height", "fill", "fill-opacity"], T1 = ["d", "stroke"], I1 = ["cx", "cy", "fill"], E1 = ["x", "y"], F1 = {
  key: 0,
  class: "bg-popover pointer-events-none absolute top-2 right-2 z-10 min-w-36 rounded-lg border p-2 shadow-lg"
}, N1 = { class: "text-muted-foreground mb-1 text-[11px] capitalize" }, R1 = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, U1 = { class: "text-xs font-semibold tabular-nums" }, H1 = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, q1 = { class: "text-muted-foreground" }, q6 = /* @__PURE__ */ L({
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
    const o = e, a = H(null), r = H(560), s = H(null);
    let i = null;
    be(() => {
      i = new ResizeObserver((R) => {
        r.value = Math.max(160, R[0].contentRect.width);
      }), a.value && i.observe(a.value);
    }), ke(() => i?.disconnect());
    const d = ["var(--chart-2)", "var(--chart-4)", "var(--chart-3)"], u = ["var(--primary)", "var(--chart-5)"], f = y(
      () => o.bars.map((R, Q) => ({
        ...R,
        color: R.color ?? d[Q % d.length]
      }))
    ), v = y(
      () => o.lines.map((R, Q) => ({
        ...R,
        color: R.color ?? u[Q % u.length]
      }))
    ), p = y(
      () => f.value[0]?.points.map((R) => R.label) ?? v.value[0]?.points.map((R) => R.label) ?? []
    ), h = y(() => p.value.length), $ = y(() => o.lineAxis === "right"), k = y(() => ({
      top: 12,
      right: $.value ? 44 : 12,
      bottom: 26,
      left: 44
    })), S = y(() => ({
      w: Math.max(1, r.value - k.value.left - k.value.right),
      h: Math.max(1, o.height - k.value.top - k.value.bottom)
    }));
    function w(R) {
      const Q = Math.max(...R, 0);
      if (Q <= 0)
        return 1;
      const P = 10 ** Math.floor(Math.log10(Q));
      return ([1, 2, 2.5, 5, 10].find((V) => Q <= V * P) ?? 10) * P;
    }
    const C = y(
      () => w([
        ...f.value.flatMap((R) => R.points.map((Q) => Q.value)),
        ...$.value ? [] : v.value.flatMap((R) => R.points.map((Q) => Q.value))
      ])
    ), B = y(
      () => $.value ? w(v.value.flatMap((R) => R.points.map((Q) => Q.value))) : C.value
    ), M = y(() => S.value.w / Math.max(1, h.value)), m = y(() => M.value * 0.6), g = y(() => m.value / Math.max(1, f.value.length));
    function _(R) {
      return k.value.left + R * M.value + M.value / 2;
    }
    const T = y(
      () => f.value.flatMap(
        (R, Q) => R.points.map((P, J) => {
          const V = Math.max(0, P.value) / C.value * S.value.h;
          return {
            x: _(J) - m.value / 2 + Q * g.value,
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
    ), F = y(
      () => v.value.map((R) => {
        const Q = R.points.map((P, J) => ({
          x: _(J),
          y: k.value.top + S.value.h - Math.max(0, P.value) / B.value * S.value.h,
          value: P.value
        }));
        return {
          ...R,
          pts: Q,
          d: Q.map((P, J) => `${J === 0 ? "M" : "L"}${P.x.toFixed(2)},${P.y.toFixed(2)}`).join(" ")
        };
      })
    ), Z = y(
      () => [0, 0.25, 0.5, 0.75, 1].map((R) => ({
        y: k.value.top + S.value.h * R,
        left: C.value * (1 - R),
        right: B.value * (1 - R)
      }))
    ), G = y(() => Math.max(1, Math.ceil(h.value / 10)));
    function X(R) {
      return R === h.value - 1 || R % G.value === 0;
    }
    const W = (R) => o.format ? o.format(R) : K(R);
    function K(R) {
      return Math.abs(R) >= 1e6 ? `${(R / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(R) >= 1e3 ? `${(R / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(R * 100) / 100);
    }
    const N = y(() => {
      if (s.value === null)
        return null;
      const R = s.value;
      return {
        label: p.value[R],
        rows: [
          ...f.value.map((Q) => ({
            name: Q.name,
            color: Q.color,
            value: Q.points[R]?.value ?? 0
          })),
          ...v.value.map((Q) => ({
            name: Q.name,
            color: Q.color,
            value: Q.points[R]?.value ?? 0
          }))
        ]
      };
    });
    return (R, Q) => (t(), n("div", {
      ref_key: "host",
      ref: a,
      class: "relative w-full"
    }, [
      h.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(z, { key: 1 }, [
        (t(), n("svg", {
          width: r.value,
          height: e.height,
          class: "overflow-visible",
          onMouseleave: Q[0] || (Q[0] = (P) => s.value = null)
        }, [
          (t(!0), n(z, null, j(Z.value, (P) => (t(), n("line", {
            key: `g-${P.y}`,
            x1: k.value.left,
            x2: r.value - k.value.right,
            y1: P.y,
            y2: P.y,
            stroke: "var(--border)",
            "stroke-width": "1"
          }, null, 8, L1))), 128)),
          (t(!0), n(z, null, j(Z.value, (P) => (t(), n("text", {
            key: `lt-${P.y}`,
            x: k.value.left - 8,
            y: P.y + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[10px] tabular-nums"
          }, c(K(P.left)), 9, O1))), 128)),
          $.value ? (t(!0), n(z, { key: 0 }, j(Z.value, (P) => (t(), n("text", {
            key: `rt-${P.y}`,
            x: r.value - k.value.right + 8,
            y: P.y + 3,
            "text-anchor": "start",
            class: "fill-muted-foreground text-[10px] tabular-nums"
          }, c(K(P.right)), 9, j1))), 128)) : b("", !0),
          (t(!0), n(z, null, j(p.value, (P, J) => (t(), n("rect", {
            key: `hit-${J}`,
            x: k.value.left + J * M.value,
            y: k.value.top,
            width: M.value,
            height: S.value.h,
            fill: "var(--muted)",
            "fill-opacity": s.value === J ? 0.4 : 0,
            onMouseenter: (V) => s.value = J
          }, null, 40, V1))), 128)),
          (t(!0), n(z, null, j(T.value, (P, J) => (t(), n("rect", {
            key: `b-${J}`,
            x: P.x,
            y: P.y,
            width: P.w,
            height: P.h,
            fill: P.color,
            "fill-opacity": s.value === null || s.value === P.index ? 0.85 : 0.3,
            rx: "3",
            "pointer-events": "none"
          }, null, 8, D1))), 128)),
          (t(!0), n(z, null, j(F.value, (P, J) => (t(), n("g", {
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
            }, null, 8, T1),
            s.value !== null && P.pts[s.value] ? (t(), n("circle", {
              key: 0,
              cx: P.pts[s.value].x,
              cy: P.pts[s.value].y,
              r: "4",
              fill: P.color,
              stroke: "var(--card)",
              "stroke-width": "2",
              "pointer-events": "none"
            }, null, 8, I1)) : b("", !0)
          ]))), 128)),
          (t(!0), n(z, null, j(p.value, (P, J) => ge((t(), n("text", {
            key: `x-${J}`,
            x: _(J),
            y: e.height - 8,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, c(P), 9, E1)), [
            [qe, X(J)]
          ])), 128))
        ], 40, P1)),
        N.value ? (t(), n("div", F1, [
          l("p", N1, c(N.value.label), 1),
          (t(!0), n(z, null, j(N.value.rows, (P, J) => (t(), n("div", {
            key: J,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: P.color })
            }, null, 4),
            l("span", R1, c(P.name), 1),
            l("span", U1, c(W(P.value)), 1)
          ]))), 128))
        ])) : b("", !0),
        e.showLegend ? (t(), n("div", H1, [
          (t(!0), n(z, null, j([...f.value, ...v.value], (P, J) => (t(), n("span", {
            key: J,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: P.color })
            }, null, 4),
            l("span", q1, c(P.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), K1 = { class: "mb-3 flex flex-wrap items-center justify-center gap-3" }, G1 = { class: "text-muted-foreground" }, W1 = {
  key: 0,
  class: "text-muted-foreground mb-2 text-center text-xs"
}, Z1 = ["width", "height"], J1 = ["x", "y"], Y1 = ["x", "y", "width", "height", "fill", "fill-opacity", "onMouseenter"], Q1 = ["x", "y"], X1 = {
  key: 1,
  class: "bg-popover pointer-events-none absolute top-0 right-0 z-10 rounded-lg border px-2.5 py-1.5 shadow-lg"
}, eb = { class: "text-[11px] font-medium capitalize" }, tb = { class: "text-muted-foreground text-[11px] capitalize" }, nb = { class: "text-sm font-semibold tabular-nums" }, ab = { class: "text-muted-foreground text-xs font-normal" }, K6 = /* @__PURE__ */ L({
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
    const o = e, a = H(null), r = H(560), s = H(null);
    let i = null;
    be(() => {
      i = new ResizeObserver((m) => {
        r.value = Math.max(160, m[0].contentRect.width);
      }), a.value && i.observe(a.value);
    }), ke(() => i?.disconnect());
    const d = y(() => o.series[0]?.points.map((m) => m.label) ?? []), u = y(() => o.series.length), f = y(() => d.value.length), v = y(() => Math.min(140, Math.max(60, r.value * 0.16))), p = y(() => Math.max(1, r.value - v.value - 8)), h = y(() => p.value / Math.max(1, f.value)), $ = y(() => Math.max(1, (o.height - 8) / Math.max(1, u.value)));
    function k(m) {
      if (m === 0)
        return "var(--muted)";
      const g = Math.max(1, o.buckets.length - 1);
      return `color-mix(in oklch, var(--primary) ${Math.round(m / g * 100)}%, var(--muted))`;
    }
    function S(m) {
      for (let g = 0; g < o.buckets.length; g++) {
        const _ = o.buckets[g].max;
        if (_ === void 0 || m < _)
          return g;
      }
      return o.buckets.length - 1;
    }
    const w = y(
      () => o.series.flatMap(
        (m, g) => m.points.map((_, T) => {
          const F = S(_.value);
          return {
            row: g,
            col: T,
            x: v.value + T * h.value,
            y: 4 + g * $.value,
            w: Math.max(1, h.value - 1),
            h: Math.max(1, $.value - 4),
            colour: k(F),
            label: _.label,
            value: _.value,
            rowName: m.name,
            bucketLabel: o.buckets[F].label
          };
        })
      )
    ), C = y(() => h.value < 2), B = y(() => s.value ? w.value.find((m) => m.row === s.value.row && m.col === s.value.col) ?? null : null), M = (m) => o.format ? o.format(m) : new Intl.NumberFormat().format(m);
    return (m, g) => (t(), n("div", {
      ref_key: "host",
      ref: a,
      class: "relative w-full"
    }, [
      u.value === 0 || f.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(z, { key: 1 }, [
        l("div", K1, [
          (t(!0), n(z, null, j(e.buckets, (_, T) => (t(), n("span", {
            key: T,
            class: "flex items-center gap-1.5 text-[11px]"
          }, [
            l("span", {
              class: "size-3 rounded-sm border",
              style: ie({ background: k(T) })
            }, null, 4),
            l("span", G1, c(_.label), 1)
          ]))), 128))
        ]),
        C.value ? (t(), n("p", W1, c(f.value) + " columns - too many to label individually ", 1)) : b("", !0),
        (t(), n("svg", {
          width: r.value,
          height: e.height,
          class: "overflow-visible",
          onMouseleave: g[0] || (g[0] = (_) => s.value = null)
        }, [
          (t(!0), n(z, null, j(e.series, (_, T) => (t(), n("text", {
            key: `r-${T}`,
            x: v.value - 10,
            y: 4 + T * $.value + $.value / 2 + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[11px] capitalize"
          }, c(_.name), 9, J1))), 128)),
          (t(!0), n(z, null, j(w.value, (_, T) => (t(), n("rect", {
            key: T,
            x: _.x,
            y: _.y,
            width: _.w,
            height: _.h,
            fill: _.colour,
            "fill-opacity": s.value === null || s.value.row === _.row && s.value.col === _.col ? 1 : 0.55,
            rx: "1",
            class: "transition-[fill-opacity]",
            onMouseenter: (F) => s.value = { row: _.row, col: _.col }
          }, null, 40, Y1))), 128)),
          e.showColumnLabels && !C.value ? (t(!0), n(z, { key: 0 }, j(d.value, (_, T) => (t(), n("text", {
            key: `c-${T}`,
            x: v.value + T * h.value + h.value / 2,
            y: e.height - 2,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[9px]"
          }, c(_), 9, Q1))), 128)) : b("", !0)
        ], 40, Z1)),
        B.value ? (t(), n("div", X1, [
          l("p", eb, c(B.value.label), 1),
          l("p", tb, c(B.value.rowName), 1),
          l("p", nb, [
            U(c(M(B.value.value)) + " ", 1),
            l("span", ab, "(" + c(B.value.bucketLabel) + ")", 1)
          ])
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), lb = ["viewBox"], ob = { key: 0 }, sb = ["id"], rb = ["stop-color"], ib = ["stop-color"], db = ["d", "fill"], ub = ["d", "stroke"], zn = 100, rt = 30, Ot = /* @__PURE__ */ L({
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
      const f = Math.min(...u), p = Math.max(...u) - f || 1;
      return u.map((h, $) => ({
        x: $ / (u.length - 1) * zn,
        y: rt - (h - f) / p * (rt - 4) - 2
      }));
    });
    function s(u) {
      const f = u.length;
      if (f < 2)
        return "";
      const v = [], p = [];
      for (let k = 0; k < f - 1; k++)
        v[k] = u[k + 1].x - u[k].x, p[k] = v[k] === 0 ? 0 : (u[k + 1].y - u[k].y) / v[k];
      const h = [p[0]];
      for (let k = 1; k < f - 1; k++)
        if (p[k - 1] * p[k] <= 0)
          h[k] = 0;
        else {
          const S = 2 * v[k] + v[k - 1], w = v[k] + 2 * v[k - 1];
          h[k] = (S + w) / (S / p[k - 1] + w / p[k]);
        }
      h[f - 1] = p[f - 2];
      let $ = `M${u[0].x.toFixed(2)},${u[0].y.toFixed(2)}`;
      for (let k = 0; k < f - 1; k++) {
        const S = v[k] / 3;
        $ += ` C${(u[k].x + S).toFixed(2)},${(u[k].y + h[k] * S).toFixed(2)} ${(u[k + 1].x - S).toFixed(2)},${(u[k + 1].y - h[k + 1] * S).toFixed(2)} ${u[k + 1].x.toFixed(2)},${u[k + 1].y.toFixed(2)}`;
      }
      return $;
    }
    const i = y(() => {
      const u = r.value;
      return u.length < 2 ? "" : o.smooth ? s(u) : u.map((f, v) => `${v === 0 ? "M" : "L"}${f.x.toFixed(2)},${f.y.toFixed(2)}`).join(" ");
    }), d = y(() => {
      const u = r.value;
      return !o.filled || u.length < 2 ? "" : `${i.value} L${u[u.length - 1].x.toFixed(2)},${rt} L${u[0].x.toFixed(2)},${rt} Z`;
    });
    return (u, f) => i.value ? (t(), n("svg", {
      key: 0,
      viewBox: `0 0 ${zn} ${rt}`,
      preserveAspectRatio: "none",
      class: "w-full",
      style: ie({ height: `${e.height}px` }),
      "aria-hidden": "true"
    }, [
      e.filled ? (t(), n("defs", ob, [
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
          }, null, 8, rb),
          l("stop", {
            offset: "100%",
            "stop-color": e.color,
            "stop-opacity": "0"
          }, null, 8, ib)
        ], 8, sb)
      ])) : b("", !0),
      e.filled ? (t(), n("path", {
        key: 1,
        d: d.value,
        fill: `url(#pk-spark-${x(a)})`
      }, null, 8, db)) : b("", !0),
      l("path", {
        d: i.value,
        fill: "none",
        stroke: e.color,
        "stroke-width": "1.5",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "vector-effect": "non-scaling-stroke"
      }, null, 8, ub)
    ], 12, lb)) : b("", !0);
  }
}), cb = { class: "flex items-center gap-1 text-xs" }, fb = {
  "aria-hidden": "true",
  class: "text-[9px]"
}, mb = {
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
    return (d, u) => (t(), n("span", cb, [
      l("span", {
        class: A(["flex items-center gap-0.5 font-medium tabular-nums", r.value])
      }, [
        l("span", fb, c(s.value), 1),
        U(" " + c(i.value), 1)
      ], 2),
      e.comparison ? (t(), n("span", mb, c(e.comparison), 1)) : b("", !0)
    ]));
  }
}), pb = ["data-collapsed", "aria-busy"], vb = { class: "flex flex-wrap items-start justify-between gap-2" }, gb = { class: "flex min-w-0 items-start gap-2" }, hb = {
  key: 0,
  class: "text-muted-foreground mt-0.5 size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, bb = ["d"], yb = { class: "min-w-0" }, xb = { class: "text-sm font-medium" }, kb = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, $b = { class: "flex shrink-0 items-center gap-1.5" }, wb = {
  key: 0,
  class: "bg-muted/60 flex items-center gap-0.5 rounded-md p-0.5",
  role: "group",
  "aria-label": "Period"
}, Cb = ["aria-pressed", "onClick"], Sb = ["aria-expanded", "aria-label", "title"], Mb = ["aria-label"], Bb = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Ab = ["d"], _b = /* @__PURE__ */ L({
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
    const o = e, a = Yt(), r = H(o.defaultCollapsed), s = y(() => !!o.icon && !a.icon), i = y(() => {
      if (!(o.fitBody && !o.loading && !o.error))
        return { minHeight: `${o.bodyHeight}px` };
    });
    return (d, u) => (t(), n("div", {
      class: A(["@container/card bg-card flex w-full flex-col self-start rounded-lg border", r.value ? "px-4 py-2" : "gap-3 p-4"]),
      "data-slot": "chart-card",
      "data-collapsed": r.value ? "true" : "false",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      l("div", vb, [
        l("div", gb, [
          q(d.$slots, "icon", {}, () => [
            s.value ? (t(), n("svg", hb, [
              l("path", {
                d: x(me)(e.icon)
              }, null, 8, bb)
            ])) : b("", !0)
          ]),
          l("div", yb, [
            l("p", xb, c(e.label), 1),
            e.description ? (t(), n("p", kb, c(e.description), 1)) : b("", !0),
            q(d.$slots, "trend")
          ])
        ]),
        l("div", $b, [
          q(d.$slots, "actions"),
          e.periods && e.periods.length ? (t(), n("div", wb, [
            (t(!0), n(z, null, j(e.periods, (f) => (t(), n("button", {
              key: f.value,
              type: "button",
              class: A([
                "rounded px-2 py-1 text-xs transition-colors",
                e.period === f.value ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
              ]),
              "aria-pressed": e.period === f.value,
              onClick: (v) => d.$emit("update:period", f.value)
            }, c(f.label), 11, Cb))), 128))
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
              class: A(["size-4 transition-transform", r.value ? "" : "rotate-180"]),
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
          ], 8, Sb)) : b("", !0),
          e.hideable ? (t(), n("button", {
            key: 2,
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-label": `Hide ${e.label}`,
            title: "Hide",
            onClick: u[1] || (u[1] = (f) => d.$emit("hide"))
          }, [
            (t(), n("svg", Bb, [
              l("path", {
                d: x(me)("eye-off")
              }, null, 8, Ab)
            ]))
          ], 8, Mb)) : b("", !0)
        ])
      ]),
      r.value ? b("", !0) : (t(), n("div", {
        key: 0,
        style: ie(i.value),
        class: "flex flex-col justify-center",
        "data-slot": "chart-card-body"
      }, [
        e.loading ? (t(), D(Pe, {
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
    ], 10, pb));
  }
}), zb = ["aria-pressed", "aria-label", "title"], Pb = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Lb = ["d"], Ob = {
  key: 0,
  class: "flex flex-col items-start gap-2 py-1",
  "data-slot": "shortcuts-empty"
}, jb = {
  key: 1,
  class: "flex flex-wrap items-center gap-x-5 gap-y-2"
}, Vb = ["href"], Db = {
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Tb = ["d"], Ib = ["aria-label", "onClick"], Eb = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Fb = ["d"], Nb = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Rb = ["d"], Ub = {
  key: 0,
  class: "flex flex-col gap-1"
}, Hb = ["onClick"], qb = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Kb = ["d"], Gb = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, Wb = /* @__PURE__ */ L({
  __name: "ShortcutsWidget",
  props: {
    items: {},
    catalog: {},
    hideable: { type: Boolean, default: !1 }
  },
  emits: ["update:items", "hide"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = H(!1), i = H(!1), d = y(
      () => a.catalog.filter((v) => !a.items.some((p) => p.id === v.id))
    );
    function u(v) {
      r(
        "update:items",
        a.items.filter((p) => p.id !== v)
      );
    }
    function f(v) {
      r("update:items", [...a.items, v]), i.value = !1;
    }
    return (v, p) => (t(), n(z, null, [
      I(_b, {
        label: "Shortcuts",
        icon: "star",
        hideable: e.hideable,
        "fit-body": !0,
        "body-height": 72,
        onHide: p[3] || (p[3] = (h) => r("hide"))
      }, {
        actions: O(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-pressed": s.value,
            "aria-label": s.value ? "Done editing shortcuts" : "Edit shortcuts",
            title: s.value ? "Done" : "Edit",
            onClick: p[0] || (p[0] = (h) => s.value = !s.value)
          }, [
            (t(), n("svg", Pb, [
              l("path", {
                d: x(me)(s.value ? "check" : "pencil")
              }, null, 8, Lb)
            ]))
          ], 8, zb)
        ]),
        default: O(() => [
          e.items.length === 0 ? (t(), n("div", Ob, [
            p[7] || (p[7] = l("p", { class: "text-muted-foreground text-sm font-normal" }, "No shortcuts yet.", -1)),
            I(ce, {
              size: "sm",
              variant: "outline",
              onClick: p[1] || (p[1] = (h) => i.value = !0)
            }, {
              default: O(() => [...p[6] || (p[6] = [
                U("Add shortcut", -1)
              ])]),
              _: 1
            })
          ])) : (t(), n("div", jb, [
            (t(!0), n(z, null, j(e.items, (h) => (t(), n("div", {
              key: h.id,
              class: "inline-flex items-center gap-1"
            }, [
              l("a", {
                href: h.href,
                class: "text-primary inline-flex items-center gap-1.5 text-sm hover:underline"
              }, [
                (t(), n("svg", Db, [
                  l("path", {
                    d: x(me)(h.icon)
                  }, null, 8, Tb)
                ])),
                U(" " + c(h.label), 1)
              ], 8, Vb),
              s.value ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "text-muted-foreground hover:text-destructive rounded p-0.5",
                "aria-label": `Remove ${h.label}`,
                onClick: ($) => u(h.id)
              }, [
                (t(), n("svg", Eb, [
                  l("path", {
                    d: x(me)("x")
                  }, null, 8, Fb)
                ]))
              ], 8, Ib)) : b("", !0)
            ]))), 128)),
            s.value ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "text-primary inline-flex items-center gap-1.5 text-sm hover:underline",
              onClick: p[2] || (p[2] = (h) => i.value = !0)
            }, [
              (t(), n("svg", Nb, [
                l("path", {
                  d: x(me)("plus")
                }, null, 8, Rb)
              ])),
              p[8] || (p[8] = U(" Add ", -1))
            ])) : b("", !0)
          ]))
        ]),
        _: 1
      }, 8, ["hideable"]),
      I(ft, {
        open: i.value,
        title: "Add a shortcut",
        description: "Pick a screen this dashboard already knows.",
        onClose: p[5] || (p[5] = (h) => i.value = !1)
      }, {
        footer: O(() => [
          I(ce, {
            variant: "outline",
            onClick: p[4] || (p[4] = (h) => i.value = !1)
          }, {
            default: O(() => [...p[9] || (p[9] = [
              U("Cancel", -1)
            ])]),
            _: 1
          })
        ]),
        default: O(() => [
          d.value.length ? (t(), n("ul", Ub, [
            (t(!0), n(z, null, j(d.value, (h) => (t(), n("li", {
              key: h.id
            }, [
              l("button", {
                type: "button",
                class: "hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                onClick: ($) => f(h)
              }, [
                (t(), n("svg", qb, [
                  l("path", {
                    d: x(me)(h.icon)
                  }, null, 8, Kb)
                ])),
                U(" " + c(h.label), 1)
              ], 8, Hb)
            ]))), 128))
          ])) : (t(), n("p", Gb, " Every catalog shortcut is already on the card. "))
        ]),
        _: 1
      }, 8, ["open"])
    ], 64));
  }
}), Zb = ["aria-busy"], Jb = { class: "flex flex-1 flex-col gap-1 p-4" }, Yb = { class: "text-muted-foreground relative text-xs font-medium" }, Qb = {
  key: 1,
  class: "text-destructive relative flex h-8 items-center gap-3 text-sm",
  role: "alert"
}, Xb = {
  key: 2,
  class: "relative flex h-8 items-center text-2xl font-semibold tabular-nums"
}, ey = {
  key: 4,
  class: "text-muted-foreground relative text-xs"
}, ty = {
  key: 0,
  class: "-mb-px",
  "aria-hidden": "true"
}, G6 = /* @__PURE__ */ L({
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
      l("div", Jb, [
        l("p", Yb, c(e.label), 1),
        e.loading ? (t(), D(Pe, {
          key: 0,
          variant: "number",
          class: "my-1"
        })) : e.error ? (t(), n("div", Qb, [
          r[1] || (r[1] = l("span", null, "Could not load", -1)),
          e.retryable ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-2 py-1 text-xs font-medium transition-colors",
            onClick: r[0] || (r[0] = (s) => a.$emit("retry"))
          }, " Retry ")) : b("", !0)
        ])) : (t(), n("span", Xb, c(o(e.value)), 1)),
        e.trend && !e.loading && !e.error ? (t(), D(da, {
          key: 3,
          class: "relative",
          direction: e.trend.direction,
          percentage: e.trend.percentage,
          comparison: e.comparison,
          inverted: e.inverted
        }, null, 8, ["direction", "percentage", "comparison", "inverted"])) : e.description ? (t(), n("p", ey, c(e.description), 1)) : b("", !0)
      ]),
      e.sparkline && e.sparkline.length > 1 && !e.loading && !e.error ? (t(), n("div", ty, [
        I(Ot, {
          data: e.sparkline,
          height: 44,
          filled: ""
        }, null, 8, ["data"])
      ])) : b("", !0)
    ], 8, Zb));
  }
}), ny = { class: "bg-card relative flex flex-col overflow-hidden rounded-lg border" }, ay = { class: "flex flex-col gap-1 p-4" }, ly = { class: "flex items-start justify-between gap-2" }, oy = { class: "text-sm font-medium" }, sy = {
  key: 0,
  class: "text-muted-foreground font-mono text-xs"
}, ry = { class: "mt-1 flex flex-wrap items-center gap-2" }, iy = {
  key: 1,
  class: "text-xl font-semibold tabular-nums"
}, dy = {
  key: 0,
  class: "-mb-px"
}, At = /* @__PURE__ */ L({
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
    return (i, d) => (t(), n("div", ny, [
      l("div", ay, [
        l("div", ly, [
          l("p", oy, c(e.label), 1),
          q(i.$slots, "menu")
        ]),
        e.caption ? (t(), n("p", sy, c(e.caption), 1)) : b("", !0),
        l("div", ry, [
          e.loading ? (t(), D(Pe, {
            key: 0,
            variant: "number"
          })) : (t(), n("span", iy, c(s.value), 1)),
          e.delta !== null && !e.loading ? (t(), n("span", {
            key: 2,
            class: A(["rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums", r.value])
          }, c(e.delta > 0 ? "+" : "") + c(e.delta) + "% ", 3)) : b("", !0)
        ])
      ]),
      e.series && e.series.length > 1 && !e.loading ? (t(), n("div", dy, [
        I(Ot, {
          data: e.series,
          color: e.color,
          height: 56,
          filled: ""
        }, null, 8, ["data", "color"])
      ])) : b("", !0)
    ]));
  }
}), uy = { class: "relative flex flex-col gap-2" }, cy = ["aria-label"], fy = ["onMouseenter"], my = {
  key: 0,
  class: "flex flex-wrap gap-x-6 gap-y-1"
}, py = { class: "text-muted-foreground flex items-center gap-1.5 text-xs" }, vy = { class: "truncate" }, gy = { class: "text-sm font-semibold tabular-nums" }, W6 = /* @__PURE__ */ L({
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
    ], r = y(() => o.segments.reduce((v, p) => v + Math.max(0, p.value), 0)), s = y(() => Math.max(o.total ?? r.value, r.value, 1)), i = y(
      () => o.segments.map((v, p) => {
        const h = Math.max(0, v.value) / s.value;
        return {
          ...v,
          color: v.color ?? a[p % a.length],
          share: h,
          // A visible sliver rather than nothing, for a non-zero value too
          // small to round to a pixel.
          width: v.value > 0 ? `max(2px, ${(h * 100).toFixed(2)}%)` : "0px"
        };
      })
    ), d = (v) => o.format ? o.format(v) : new Intl.NumberFormat().format(v), u = H(null), f = (v) => `${(v * 100).toFixed(v > 0 && v < 0.01 ? 1 : 0)}%`;
    return (v, p) => (t(), n("div", uy, [
      l("div", {
        class: "bg-muted flex w-full overflow-hidden rounded-full",
        style: ie({ height: `${e.height}px` }),
        role: "img",
        "aria-label": e.segments.map((h) => `${h.label} ${d(h.value)}`).join(", ")
      }, [
        (t(!0), n(z, null, j(i.value, (h, $) => (t(), n("span", {
          key: $,
          class: A(["h-full transition-all", [
            $ === 0 ? "rounded-l-full" : "",
            $ === i.value.length - 1 && !e.total ? "rounded-r-full" : ""
          ]]),
          style: ie({
            width: h.width,
            background: h.color,
            opacity: u.value === null || u.value === $ ? 1 : 0.4
          }),
          onMouseenter: (k) => u.value = $,
          onMouseleave: p[0] || (p[0] = (k) => u.value = null)
        }, null, 46, fy))), 128))
      ], 12, cy),
      e.showLegend ? (t(), n("div", my, [
        (t(!0), n(z, null, j(i.value, (h, $) => (t(), n("div", {
          key: $,
          class: "flex min-w-0 flex-col"
        }, [
          l("span", py, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: h.color })
            }, null, 4),
            l("span", vy, c(h.label), 1)
          ]),
          l("span", gy, c(d(h.value)), 1)
        ]))), 128))
      ])) : b("", !0),
      u.value !== null ? (t(), D(ht, {
        key: 1,
        label: i.value[u.value].label,
        value: d(i.value[u.value].value),
        share: f(i.value[u.value].share)
      }, null, 8, ["label", "value", "share"])) : b("", !0)
    ]));
  }
}), hy = {
  class: "divide-border flex flex-col divide-y",
  "data-slot": "stat-list"
}, by = ["data-heading"], yy = {
  key: 1,
  class: "flex items-center justify-between gap-3 text-sm"
}, xy = { class: "text-muted-foreground truncate" }, ky = ["aria-label"], Z6 = /* @__PURE__ */ L({
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
    return (i, d) => (t(), n("div", hy, [
      (t(!0), n(z, null, j(s.value, (u) => (t(), n("div", {
        key: u.key,
        class: "flex flex-col gap-1.5 py-2.5 first:pt-0 last:pb-0",
        "data-heading": u.heading ? "true" : void 0
      }, [
        u.heading ? (t(), n("div", {
          key: 0,
          class: A(["pt-1 text-xs font-semibold tracking-wide uppercase", u.tone ? a[u.tone] : "text-muted-foreground"])
        }, c(u.label), 3)) : (t(), n("div", yy, [
          l("span", xy, c(u.label), 1),
          l("span", {
            class: A(["shrink-0 font-medium tabular-nums", u.tone ? a[u.tone] : "text-foreground"])
          }, c(u.value), 3)
        ])),
        u.segments.length ? (t(), n("div", {
          key: 2,
          class: "bg-muted flex h-1.5 w-full overflow-hidden rounded-full",
          role: "img",
          "aria-label": u.segments.map((f) => `${f.label} ${f.value}`).join(", ")
        }, [
          (t(!0), n(z, null, j(u.segments, (f, v) => (t(), n("span", {
            key: v,
            class: A(["h-full transition-all", r[f.tone ?? "neutral"]]),
            style: ie({ width: f.width })
          }, null, 6))), 128))
        ], 8, ky)) : b("", !0)
      ], 8, by))), 128))
    ]));
  }
}), $y = {
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
}, wy = {
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "info",
  neutral: "outline"
};
function Cy(e) {
  return e.trim().toLowerCase().replace(/\s+/g, "-");
}
function Sy(e, o) {
  return o || (e ? $y[Cy(e)] ?? "neutral" : "neutral");
}
function My(e, o) {
  return wy[Sy(e, o)];
}
const $e = /* @__PURE__ */ L({
  __name: "PkStatusBadge",
  props: {
    status: { default: null },
    tone: { default: null },
    class: {}
  },
  setup(e) {
    const o = e, a = y(() => My(o.status, o.tone));
    return (r, s) => (t(), D(We, {
      variant: a.value,
      class: A(o.class)
    }, {
      default: O(() => [
        q(r.$slots, "default", {}, () => [
          U(c(e.status), 1)
        ])
      ]),
      _: 3
    }, 8, ["variant", "class"]));
  }
}), By = ["data-layout"], Ay = ["src", "alt"], _y = {
  key: 1,
  class: "text-muted-foreground flex size-full items-center justify-center text-lg font-medium"
}, zy = ["src"], Py = {
  key: 3,
  class: "absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1",
  "data-slot": "catalog-dots"
}, Ly = ["onMouseenter"], Oy = { class: "flex min-w-0 flex-1 items-start justify-between gap-2" }, jy = { class: "min-w-0" }, Vy = { class: "truncate text-sm font-medium" }, Dy = {
  key: 0,
  class: "text-muted-foreground truncate text-xs"
}, Ty = {
  key: 1,
  class: "text-muted-foreground line-clamp-2 text-xs"
}, Iy = { class: "mt-auto flex items-end justify-between gap-2 pt-1" }, Ey = { class: "min-w-0" }, Fy = {
  key: 0,
  class: "text-sm font-semibold tabular-nums"
}, Ny = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal tabular-nums"
}, Ry = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Uy = ["d"], Hy = ["aria-label"], qy = /* @__PURE__ */ L({
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
    }, r = e, s = o, i = H(0);
    function d(w) {
      if (typeof w != "string")
        return null;
      const C = w.trim();
      return C === "" ? null : /^(https?:)?\/\//i.test(C) ? C : null;
    }
    const u = y(() => {
      const w = [r.item.image, ...r.item.images ?? []].map(d).filter((C) => C !== null);
      return [...new Set(w)];
    }), f = y(() => u.value[i.value] ?? u.value[0] ?? null), v = y(
      () => r.item.label.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("")
    ), p = y(() => {
      const w = r.item.progress;
      if (!w)
        return null;
      const C = Math.max(w.total ?? 100, w.value, 1);
      return `${Math.min(100, Math.max(0, w.value / C * 100)).toFixed(2)}%`;
    }), h = y(() => u.value.length > 1 ? u.value[1] : null), $ = y(
      () => (r.item.kind ?? "product") === "product" && r.item.status !== "out-of-stock"
    ), k = y(() => typeof r.item.stock != "number" ? null : `${r.item.stock} in stock`);
    function S(w) {
      w.stopPropagation(), s("cart", r.item.key);
    }
    return (w, C) => (t(), n("article", {
      "data-slot": "catalog-card",
      class: A(["bg-card hover:bg-muted/40 flex w-full cursor-pointer overflow-hidden rounded-lg border text-left transition-colors", e.layout === "list" ? "flex-row items-stretch" : "flex-col"]),
      "data-layout": e.layout,
      role: "button",
      tabindex: "0",
      onClick: C[0] || (C[0] = (B) => s("select", e.item.key)),
      onKeydown: C[1] || (C[1] = Ft(he((B) => s("select", e.item.key), ["prevent"]), ["enter"])),
      onMouseleave: C[2] || (C[2] = (B) => i.value = 0)
    }, [
      l("div", {
        class: A([
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
        }, null, 8, Ay)) : (t(), n("span", _y, c(v.value), 1)),
        e.layout === "grid" && h.value && i.value === 0 ? (t(), n("img", {
          key: 2,
          src: h.value,
          alt: "",
          loading: "lazy",
          class: "ring-background pointer-events-none absolute right-1.5 bottom-1.5 size-10 rounded-md object-cover ring-2",
          "data-slot": "catalog-peek"
        }, null, 8, zy)) : b("", !0),
        e.layout === "grid" && u.value.length > 1 ? (t(), n("div", Py, [
          (t(!0), n(z, null, j(u.value, (B, M) => (t(), n("span", {
            key: M,
            class: A(["size-1.5 rounded-full", M === i.value ? "bg-background" : "bg-background/50"]),
            onMouseenter: (m) => i.value = M
          }, null, 42, Ly))), 128))
        ])) : b("", !0)
      ], 2),
      l("div", {
        class: A(["flex min-w-0 flex-1", e.layout === "list" ? "items-center gap-3 p-3" : "flex-col gap-1 p-3"])
      }, [
        l("div", Oy, [
          l("div", jy, [
            l("p", Vy, c(e.item.label), 1),
            e.item.caption ? (t(), n("p", Dy, c(e.item.caption), 1)) : b("", !0),
            e.item.facts?.length ? (t(), n("p", Ty, c(e.item.facts.join(" · ")), 1)) : b("", !0)
          ]),
          e.item.status ? (t(), D($e, {
            key: 0,
            status: e.item.status,
            tone: e.item.tone
          }, null, 8, ["status", "tone"])) : b("", !0)
        ]),
        l("div", Iy, [
          l("div", Ey, [
            e.item.price ? (t(), n("p", Fy, c(e.item.price), 1)) : b("", !0),
            k.value ? (t(), n("p", Ny, c(k.value), 1)) : b("", !0)
          ]),
          $.value ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-muted inline-flex size-8 shrink-0 items-center justify-center rounded-md border",
            "aria-label": "Add to cart",
            "data-slot": "catalog-cart",
            onClick: S
          }, [
            (t(), n("svg", Ry, [
              l("path", {
                d: x(me)("cart")
              }, null, 8, Uy)
            ]))
          ])) : b("", !0)
        ]),
        p.value && e.layout === "grid" ? (t(), n("div", {
          key: 0,
          class: "bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full",
          role: "img",
          "aria-label": `${e.item.label} ${e.item.progress.value}`
        }, [
          l("span", {
            class: A(["block h-full", a[e.item.progress?.tone ?? "neutral"]]),
            style: ie({ width: p.value })
          }, null, 6)
        ], 8, Hy)) : b("", !0)
      ], 2)
    ], 42, By));
  }
});
function Ky(e) {
  return e === 30 ? "Per month" : e === 365 ? "Per year" : "Lifetime";
}
function Gy(e) {
  return e === !0 || e === !1 ? "" : e === -1 || e === "-1" ? "Unlimited" : Array.isArray(e) ? e.join(", ") : String(e);
}
function Wy(e) {
  return e === !1 || e === 0 || e === "0" || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : !0;
}
const Zy = ["data-featured", "data-recommended"], Jy = { class: "flex flex-col gap-1" }, Yy = {
  key: 0,
  class: "text-muted-foreground mb-1 flex flex-wrap gap-2 text-xs font-medium"
}, Qy = { key: 0 }, Xy = { key: 1 }, ex = { key: 2 }, tx = { key: 3 }, nx = { class: "text-sm font-semibold" }, ax = { class: "flex items-baseline gap-1" }, lx = { class: "text-3xl font-semibold tracking-tight tabular-nums" }, ox = { class: "text-muted-foreground text-sm font-normal" }, sx = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal text-pretty"
}, rx = { class: "text-muted-foreground mt-1 text-xs" }, ix = { class: "flex flex-1 flex-col gap-2 text-sm" }, dx = { class: "flex min-w-0 items-start gap-2" }, ux = {
  key: 0,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, cx = ["d"], fx = {
  key: 1,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, mx = ["d"], px = { class: "capitalize" }, vx = {
  key: 0,
  class: "text-muted-foreground max-w-[40%] shrink-0 text-end text-xs font-medium"
}, gx = { class: "text-foreground font-medium" }, hx = { class: "mt-auto flex gap-2 pt-2" }, bx = /* @__PURE__ */ L({
  __name: "PlanCard",
  props: {
    plan: {},
    canDelete: { type: Boolean }
  },
  emits: ["edit", "delete"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.plan.priceFormatted ?? String(a.plan.price)), i = y(() => !!(a.plan.featured || a.plan.recommended)), d = y(() => {
      const f = a.plan.perks ?? {};
      return Object.entries(f).map(([v, p]) => ({
        key: v,
        label: v.replace(/_/g, " "),
        granted: Wy(p.value),
        display: Gy(p.value)
      }));
    }), u = y(() => a.plan.extraPerks ?? []);
    return (f, v) => (t(), n("article", {
      class: A(["bg-card text-card-foreground flex flex-col gap-4 rounded-lg border p-6", i.value ? "border-primary shadow-sm" : ""]),
      "data-slot": "plan-card",
      "data-featured": e.plan.featured ? "true" : void 0,
      "data-recommended": e.plan.recommended ? "true" : void 0
    }, [
      l("header", Jy, [
        e.plan.recommended || e.plan.featured || e.plan.trial || e.plan.active === !1 ? (t(), n("p", Yy, [
          e.plan.recommended ? (t(), n("span", Qy, "Recommended")) : e.plan.featured ? (t(), n("span", Xy, "Featured")) : b("", !0),
          e.plan.trial ? (t(), n("span", ex, "Trial")) : b("", !0),
          e.plan.active === !1 ? (t(), n("span", tx, "Inactive")) : b("", !0)
        ])) : b("", !0),
        l("h3", nx, c(e.plan.name), 1),
        l("p", ax, [
          l("span", lx, c(s.value), 1),
          l("span", ox, c(x(Ky)(e.plan.days)), 1)
        ]),
        e.plan.shortDescription ? (t(), n("p", sx, c(e.plan.shortDescription), 1)) : b("", !0),
        l("p", rx, " Active seats: " + c(e.plan.activeUsers ?? 0), 1)
      ]),
      l("ul", ix, [
        (t(!0), n(z, null, j(d.value, (p) => (t(), n("li", {
          key: p.key,
          class: "flex items-start justify-between gap-3"
        }, [
          l("span", dx, [
            l("span", {
              class: A(["mt-0.5 shrink-0", p.granted ? "text-success" : "text-muted-foreground"]),
              "aria-hidden": "true"
            }, [
              p.granted ? (t(), n("svg", ux, [
                l("path", {
                  d: x(me)("check")
                }, null, 8, cx)
              ])) : (t(), n("svg", fx, [
                l("path", {
                  d: x(me)("x")
                }, null, 8, mx)
              ]))
            ], 2),
            l("span", px, c(p.label), 1)
          ]),
          p.display ? (t(), n("span", vx, c(p.display), 1)) : b("", !0)
        ]))), 128)),
        (t(!0), n(z, null, j(u.value, (p, h) => (t(), n("li", {
          key: `extra-${h}`,
          class: "text-muted-foreground flex justify-between gap-3 text-sm"
        }, [
          l("span", null, c(p.key), 1),
          l("span", gx, c(p.value), 1)
        ]))), 128))
      ]),
      l("footer", hx, [
        I(ce, {
          class: "flex-1",
          variant: "default",
          size: "sm",
          onClick: v[0] || (v[0] = (p) => r("edit", e.plan.id))
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
          onClick: v[1] || (v[1] = (p) => r("delete", e.plan.id))
        }, {
          default: O(() => [...v[3] || (v[3] = [
            U(" Delete ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 10, Zy));
  }
}), yx = { class: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" }, xx = {
  key: 0,
  class: "text-xl font-semibold tracking-tight sm:text-2xl"
}, kx = {
  key: 1,
  class: "text-muted-foreground mt-1 text-sm"
}, $x = {
  key: 0,
  class: "text-muted-foreground rounded-lg border border-dashed px-6 py-16 text-center text-sm"
}, wx = {
  key: 1,
  class: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
}, J6 = /* @__PURE__ */ L({
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
      class: A(["w-full space-y-6", e.embedded ? "" : x(at)]),
      "data-slot": "plan-grid"
    }, [
      l("header", yx, [
        l("div", null, [
          e.title ? (t(), n("h1", xx, c(e.title), 1)) : b("", !0),
          e.description ? (t(), n("p", kx, c(e.description), 1)) : b("", !0)
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
      e.plans.length === 0 ? (t(), n("p", $x, " No plans yet. Create one to offer organisations a bundle of modules and limits. ")) : (t(), n("div", wx, [
        (t(!0), n(z, null, j(e.plans, (i) => (t(), D(bx, {
          key: i.id,
          plan: i,
          onEdit: s[1] || (s[1] = (d) => a("edit", d)),
          onDelete: s[2] || (s[2] = (d) => a("delete", d))
        }, null, 8, ["plan"]))), 128))
      ]))
    ], 2));
  }
}), Cx = { class: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" }, Sx = { class: "text-xl font-semibold tracking-tight sm:text-2xl" }, Mx = { class: "flex flex-col-reverse items-start gap-6 lg:flex-row" }, Bx = { class: "bg-card w-full flex-1 space-y-4 rounded-lg border p-5" }, Ax = { class: "space-y-1.5" }, _x = { class: "space-y-1.5" }, zx = { class: "space-y-1.5" }, Px = { class: "space-y-1.5" }, Lx = { class: "space-y-1.5" }, Ox = { class: "flex items-center gap-3 text-sm" }, jx = { class: "flex items-center gap-3 text-sm" }, Vx = { class: "flex items-center gap-3 text-sm" }, Dx = {
  key: 0,
  class: "space-y-1.5"
}, Tx = { class: "flex items-center gap-3 text-sm" }, Ix = { class: "bg-card w-full flex-1 space-y-4 rounded-lg border p-5" }, Ex = { class: "space-y-1.5" }, Fx = ["value"], Nx = {
  key: 0,
  class: "flex items-center gap-3 text-sm"
}, Rx = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, Ux = ["id", "value", "onInput"], Hx = { class: "space-y-2" }, qx = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Kx = ["d"], Y6 = /* @__PURE__ */ L({
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
    }), r = e, s = o, i = ct(a());
    function d(M, m) {
      const g = i.perks?.[M]?.value;
      return g ?? m;
    }
    function u(M, m, g) {
      const _ = i.perks?.[M];
      i.perks = {
        ...i.perks ?? {},
        [M]: {
          value: m,
          overview: g ?? _?.overview ?? ""
        }
      };
    }
    function f(M, m) {
      const g = i.perks?.[M];
      i.perks = {
        ...i.perks ?? {},
        [M]: {
          value: g?.value ?? (M === "modules" ? [] : 0),
          overview: m
        }
      };
    }
    function v(M) {
      const m = M ? { ...a(), ...M } : a();
      i.id = m.id, i.name = m.name, i.shortDescription = m.shortDescription ?? "", i.description = m.description ?? "", i.days = m.days, i.price = m.price, i.featured = m.featured ?? !1, i.recommended = m.recommended ?? !1, i.trial = m.trial ?? !1, i.trialDays = m.trialDays ?? 0, i.active = m.active ?? !0, i.perks = { ...m.perks ?? {} }, i.extraPerks = [...m.extraPerks ?? []], i.perks.modules || u("modules", []);
    }
    v(r.plan), pe(
      () => r.plan,
      (M) => v(M),
      { deep: !0 }
    );
    const p = y({
      get: () => {
        const M = d("modules", []);
        return Array.isArray(M) ? M.map(String) : [];
      },
      set: (M) => {
        u(
          "modules",
          $(M.map(String)),
          i.perks?.modules?.overview ?? ""
        );
      }
    }), h = y(
      () => r.modules.map((M) => ({ value: M.key, label: M.label }))
    );
    function $(M) {
      const m = Object.fromEntries(r.modules.map((T) => [T.key, T])), g = new Set(M);
      for (const T of r.modules)
        if (!g.has(T.key))
          for (const F of T.children ?? [])
            g.delete(F);
      let _ = !0;
      for (; _; ) {
        _ = !1;
        for (const T of [...g])
          for (const F of m[T]?.requires ?? [])
            g.has(F) || (g.add(F), _ = !0);
      }
      return [...g];
    }
    function k() {
      i.extraPerks = [...i.extraPerks ?? [], { key: "", value: "" }];
    }
    function S(M) {
      i.extraPerks = (i.extraPerks ?? []).filter((m, g) => g !== M);
    }
    function w() {
      s("save", {
        ...i,
        extraPerks: (i.extraPerks ?? []).filter((M) => M.key.trim() !== "")
      });
    }
    const C = `file:text-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${Ue}`, B = `dark:bg-input/30 border-input min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${Ue}`;
    return (M, m) => (t(), n("form", {
      class: A(["w-full space-y-6", e.embedded ? "" : x(at)]),
      "data-slot": "plan-editor",
      onSubmit: he(w, ["prevent"])
    }, [
      l("header", Cx, [
        l("div", null, [
          l("h1", Sx, c(e.mode === "edit" ? "Edit plan" : "Create plan"), 1),
          m[13] || (m[13] = l("p", { class: "text-muted-foreground mt-1 text-sm" }, " Plans are organisation-wide. Charge a recurring amount. Perks are modules and numeric limits (-1 is Unlimited). ", -1))
        ]),
        I(ce, {
          type: "button",
          variant: "outline",
          onClick: m[0] || (m[0] = (g) => s("cancel"))
        }, {
          default: O(() => [...m[14] || (m[14] = [
            U("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      l("div", Mx, [
        l("section", Bx, [
          m[26] || (m[26] = l("h2", { class: "font-semibold" }, "Plan details", -1)),
          l("div", Ax, [
            I(ze, { for: "plan-name" }, {
              default: O(() => [...m[15] || (m[15] = [
                U("Plan name", -1)
              ])]),
              _: 1
            }),
            I(we, {
              id: "plan-name",
              modelValue: i.name,
              "onUpdate:modelValue": m[1] || (m[1] = (g) => i.name = g),
              required: ""
            }, null, 8, ["modelValue"])
          ]),
          l("div", _x, [
            I(ze, { for: "plan-short" }, {
              default: O(() => [...m[16] || (m[16] = [
                U("Short description (optional)", -1)
              ])]),
              _: 1
            }),
            I(we, {
              id: "plan-short",
              modelValue: i.shortDescription,
              "onUpdate:modelValue": m[2] || (m[2] = (g) => i.shortDescription = g),
              placeholder: "For an organisation getting started"
            }, null, 8, ["modelValue"])
          ]),
          l("div", zx, [
            I(ze, { for: "plan-description" }, {
              default: O(() => [...m[17] || (m[17] = [
                U("Plan description", -1)
              ])]),
              _: 1
            }),
            ge(l("textarea", {
              id: "plan-description",
              "onUpdate:modelValue": m[3] || (m[3] = (g) => i.description = g),
              required: "",
              placeholder: "Shown on the company-wide catalogue",
              class: A(B)
            }, null, 512), [
              [_e, i.description]
            ])
          ]),
          l("div", Px, [
            I(ze, { for: "plan-days" }, {
              default: O(() => [...m[18] || (m[18] = [
                U("Duration", -1)
              ])]),
              _: 1
            }),
            ge(l("select", {
              id: "plan-days",
              "onUpdate:modelValue": m[4] || (m[4] = (g) => i.days = g),
              class: A(C)
            }, [...m[19] || (m[19] = [
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
          l("div", Lx, [
            I(ze, { for: "plan-price" }, {
              default: O(() => [...m[20] || (m[20] = [
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
              "onUpdate:modelValue": m[5] || (m[5] = (g) => i.price = Number(g))
            }, null, 8, ["model-value"])
          ]),
          l("label", Ox, [
            I(x(Je), {
              checked: !!i.featured,
              "onUpdate:checked": m[6] || (m[6] = (g) => i.featured = g)
            }, null, 8, ["checked"]),
            m[21] || (m[21] = U(" Featured ", -1))
          ]),
          l("label", jx, [
            I(x(Je), {
              checked: !!i.recommended,
              "onUpdate:checked": m[7] || (m[7] = (g) => i.recommended = g)
            }, null, 8, ["checked"]),
            m[22] || (m[22] = U(" Recommended ", -1))
          ]),
          l("label", Vx, [
            I(x(Je), {
              checked: !!i.trial,
              "onUpdate:checked": m[8] || (m[8] = (g) => i.trial = g)
            }, null, 8, ["checked"]),
            m[23] || (m[23] = U(" Offer a trial ", -1))
          ]),
          i.trial ? (t(), n("div", Dx, [
            I(ze, { for: "plan-trial-days" }, {
              default: O(() => [...m[24] || (m[24] = [
                U("Trial days", -1)
              ])]),
              _: 1
            }),
            I(we, {
              id: "plan-trial-days",
              "model-value": i.trialDays ?? 0,
              type: "number",
              required: "",
              "onUpdate:modelValue": m[9] || (m[9] = (g) => i.trialDays = Number(g))
            }, null, 8, ["model-value"])
          ])) : b("", !0),
          l("label", Tx, [
            I(x(Je), {
              checked: i.active !== !1,
              "onUpdate:checked": m[10] || (m[10] = (g) => i.active = g)
            }, null, 8, ["checked"]),
            m[25] || (m[25] = U(" Active ", -1))
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
        l("section", Ix, [
          m[33] || (m[33] = l("h2", { class: "font-semibold" }, "Plan perks", -1)),
          l("div", Ex, [
            I(ze, null, {
              default: O(() => [...m[27] || (m[27] = [
                U("Modules access", -1)
              ])]),
              _: 1
            }),
            I(on, {
              modelValue: p.value,
              "onUpdate:modelValue": m[11] || (m[11] = (g) => p.value = g),
              options: h.value,
              placeholder: "Select modules"
            }, null, 8, ["modelValue", "options"]),
            I(ze, { for: "plan-modules-overview" }, {
              default: O(() => [...m[28] || (m[28] = [
                U("Overview", -1)
              ])]),
              _: 1
            }),
            l("textarea", {
              id: "plan-modules-overview",
              value: i.perks?.modules?.overview ?? "",
              class: A(B),
              onInput: m[12] || (m[12] = (g) => f("modules", g.target.value))
            }, null, 40, Fx)
          ]),
          (t(!0), n(z, null, j(e.limits, (g) => (t(), n("div", {
            key: g.key,
            class: "space-y-1.5"
          }, [
            g.kind === "toggle" ? (t(), n("label", Nx, [
              I(x(Je), {
                checked: !!d(g.key, !1),
                "onUpdate:checked": (_) => u(
                  g.key,
                  _,
                  i.perks?.[g.key]?.overview ?? ""
                )
              }, null, 8, ["checked", "onUpdate:checked"]),
              U(" " + c(g.label), 1)
            ])) : (t(), n(z, { key: 1 }, [
              I(ze, {
                for: `plan-limit-${g.key}`
              }, {
                default: O(() => [
                  U(c(g.label), 1)
                ]),
                _: 2
              }, 1032, ["for"]),
              g.hint ? (t(), n("p", Rx, c(g.hint), 1)) : b("", !0),
              I(we, {
                id: `plan-limit-${g.key}`,
                "model-value": Number(d(g.key, 0)),
                type: "number",
                step: g.step ?? 1,
                required: "",
                "onUpdate:modelValue": (_) => u(
                  g.key,
                  Number(_),
                  i.perks?.[g.key]?.overview ?? ""
                )
              }, null, 8, ["id", "model-value", "step", "onUpdate:modelValue"]),
              m[29] || (m[29] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " Use -1 for Unlimited. ", -1))
            ], 64)),
            I(ze, {
              for: `plan-overview-${g.key}`
            }, {
              default: O(() => [...m[30] || (m[30] = [
                U("Overview", -1)
              ])]),
              _: 1
            }, 8, ["for"]),
            l("textarea", {
              id: `plan-overview-${g.key}`,
              value: i.perks?.[g.key]?.overview ?? "",
              class: A(B),
              onInput: (_) => f(g.key, _.target.value)
            }, null, 40, Ux)
          ]))), 128)),
          l("div", Hx, [
            m[32] || (m[32] = l("p", { class: "text-sm font-semibold" }, "Extra perks", -1)),
            (t(!0), n(z, null, j(i.extraPerks ?? [], (g, _) => (t(), n("div", {
              key: _,
              class: "flex items-center gap-2"
            }, [
              I(we, {
                modelValue: g.key,
                "onUpdate:modelValue": (T) => g.key = T,
                placeholder: "Label"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              I(we, {
                modelValue: g.value,
                "onUpdate:modelValue": (T) => g.value = T,
                placeholder: "Value"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              I(ce, {
                type: "button",
                variant: "destructive",
                size: "icon",
                "aria-label": "Remove perk",
                onClick: (T) => S(_)
              }, {
                default: O(() => [
                  (t(), n("svg", qx, [
                    l("path", {
                      d: x(me)("x")
                    }, null, 8, Kx)
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
              default: O(() => [...m[31] || (m[31] = [
                U(" Add extra perk ", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ])
    ], 34));
  }
}), Gx = ["data-current", "data-recommended"], Wx = {
  key: 0,
  class: "bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
}, Zx = {
  key: 1,
  class: "bg-primary/10 text-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold"
}, Jx = { class: "text-sm font-semibold" }, Yx = { class: "flex items-baseline gap-1" }, Qx = { class: "text-4xl font-bold tracking-tight tabular-nums" }, Xx = { class: "text-muted-foreground text-sm font-normal" }, e0 = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal text-pretty"
}, t0 = {
  key: 2,
  class: "flex flex-1 flex-col gap-2 text-sm"
}, n0 = {
  class: "text-success mt-0.5 shrink-0",
  "aria-hidden": "true"
}, a0 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, l0 = ["d"], o0 = { class: "text-muted-foreground" }, s0 = {
  key: 3,
  class: "flex-1"
}, r0 = {
  key: 4,
  class: "mt-auto pt-2"
}, Q6 = /* @__PURE__ */ L({
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
      class: A([
        "bg-card text-card-foreground relative flex flex-col gap-4 rounded-xl border p-6 transition-shadow",
        d.value ? "border-primary shadow-lg ring-1 ring-primary/20" : e.plan.current ? "border-primary/40" : ""
      ]),
      "data-slot": "plan-purchase-card",
      "data-current": e.plan.current ? "true" : void 0,
      "data-recommended": e.plan.recommended ? "true" : void 0
    }, [
      d.value ? (t(), n("span", Wx, " Most popular ")) : e.plan.current ? (t(), n("span", Zx, " Current plan ")) : b("", !0),
      l("header", {
        class: A(["flex flex-col gap-1", d.value || e.plan.current ? "pt-2" : ""])
      }, [
        l("h3", Jx, c(e.plan.name), 1),
        l("p", Yx, [
          l("span", Qx, c(s.value), 1),
          l("span", Xx, "/ " + c(i.value), 1)
        ]),
        e.plan.description ? (t(), n("p", e0, c(e.plan.description), 1)) : b("", !0)
      ], 2),
      e.plan.features?.length ? (t(), n("ul", t0, [
        (t(!0), n(z, null, j(e.plan.features, (v, p) => (t(), n("li", {
          key: p,
          class: "flex items-start gap-2"
        }, [
          l("span", n0, [
            (t(), n("svg", a0, [
              l("path", {
                d: x(me)("check")
              }, null, 8, l0)
            ]))
          ]),
          l("span", o0, c(v), 1)
        ]))), 128))
      ])) : (t(), n("div", s0)),
      e.plan.current ? b("", !0) : (t(), n("footer", r0, [
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
    ], 10, Gx));
  }
}), i0 = {
  key: 0,
  "data-slot": "catalog-toolbar",
  class: "flex flex-col gap-3"
}, d0 = { class: "flex flex-wrap items-center gap-2 sm:flex-nowrap" }, u0 = {
  key: 0,
  class: "relative min-w-0 max-w-sm flex-1"
}, c0 = {
  class: "text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, f0 = ["d"], m0 = {
  key: 1,
  class: "ml-auto inline-flex shrink-0 rounded-md border",
  "data-slot": "catalog-layout",
  role: "group",
  "aria-label": "Layout"
}, p0 = ["aria-pressed"], v0 = ["aria-pressed"], g0 = {
  key: 0,
  class: "flex flex-col gap-2"
}, h0 = ["aria-label"], b0 = {
  key: 0,
  class: "text-muted-foreground mr-1 text-xs font-medium"
}, y0 = ["aria-pressed", "onClick"], x0 = ["aria-label"], k0 = { class: "text-muted-foreground mr-1 text-xs font-medium" }, $0 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, w0 = ["data-slot"], C0 = {
  key: 3,
  class: "flex items-center justify-between gap-3",
  "data-slot": "catalog-pagination"
}, S0 = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, M0 = { class: "flex items-center gap-2" }, B0 = ["disabled"], A0 = ["disabled"], mn = /* @__PURE__ */ L({
  __name: "CatalogGrid",
  props: /* @__PURE__ */ Fe({
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
  emits: /* @__PURE__ */ Fe(["select", "cart", "filter", "scan"], ["update:modelValue"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = H(""), i = pt(e, "modelValue"), d = ct({}), u = ct({});
    pe(s, () => h());
    function f(F) {
      const Z = F.trim();
      if (Z === "")
        return null;
      const G = Number(Z);
      return Number.isFinite(G) ? G : null;
    }
    function v() {
      const F = {};
      for (const [Z, G] of Object.entries(u))
        F[Z] = { min: f(G.min), max: f(G.max) };
      return F;
    }
    function p() {
      return { query: s.value, selected: { ...d }, ranges: v() };
    }
    function h() {
      r("filter", p());
    }
    function $(F, Z) {
      d[F] = d[F] === Z ? null : Z, h();
    }
    function k(F) {
      return u[F] ?? { min: "", max: "" };
    }
    function S(F, Z, G) {
      const X = u[F] ?? { min: "", max: "" };
      u[F] = { ...X, [Z]: G }, h();
    }
    function w(F) {
      F.key === "Enter" && (F.preventDefault(), r("scan", s.value.trim()));
    }
    const C = y(
      () => a.facets.filter((F) => (F.kind ?? "chips") === "chips")
    ), B = y(() => a.facets.filter((F) => F.kind === "range")), M = y(
      () => a.searchable || a.facets.length > 0 || a.layoutToggle
    ), m = H(1);
    pe(
      () => a.items.map((F) => F.key).join(","),
      () => {
        m.value = 1;
      }
    );
    const g = y(() => {
      const F = a.pageSize;
      return !F || F < 1 ? 1 : Math.max(1, Math.ceil(a.items.length / F));
    }), _ = y(() => {
      const F = a.pageSize;
      if (!F || F < 1)
        return a.items;
      const Z = (m.value - 1) * F;
      return a.items.slice(Z, Z + F);
    });
    function T(F) {
      m.value = Math.min(g.value, Math.max(1, F));
    }
    return (F, Z) => (t(), n("div", {
      class: A(["flex flex-col gap-4", x(aa)])
    }, [
      M.value ? (t(), n("div", i0, [
        l("div", d0, [
          e.searchable ? (t(), n("div", u0, [
            (t(), n("svg", c0, [
              l("path", {
                d: x(me)("search")
              }, null, 8, f0)
            ])),
            I(we, {
              modelValue: s.value,
              "onUpdate:modelValue": Z[0] || (Z[0] = (G) => s.value = G),
              type: "search",
              placeholder: e.searchPlaceholder,
              class: "pl-8",
              "aria-label": e.searchPlaceholder,
              autofocus: e.autofocus || void 0,
              onKeydown: w
            }, null, 8, ["modelValue", "placeholder", "aria-label", "autofocus"])
          ])) : b("", !0),
          q(F.$slots, "toolbar"),
          e.layoutToggle ? (t(), n("div", m0, [
            l("button", {
              type: "button",
              class: A([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "grid" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "grid" ? "true" : "false",
              "aria-label": "Grid",
              onClick: Z[1] || (Z[1] = (G) => i.value = "grid")
            }, " Tiles ", 10, p0),
            l("button", {
              type: "button",
              class: A([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "list" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "list" ? "true" : "false",
              "aria-label": "List",
              onClick: Z[2] || (Z[2] = (G) => i.value = "list")
            }, " List ", 10, v0)
          ])) : b("", !0)
        ]),
        C.value.length || B.value.length ? (t(), n("div", g0, [
          (t(!0), n(z, null, j(C.value, (G) => (t(), n("div", {
            key: G.key,
            class: "flex flex-wrap items-center gap-1.5",
            "aria-label": G.label ?? G.key
          }, [
            G.label ? (t(), n("span", b0, c(G.label), 1)) : b("", !0),
            (t(!0), n(z, null, j(G.options ?? [], (X) => (t(), n("button", {
              key: X.value,
              type: "button",
              class: A([
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                d[G.key] === X.value ? "bg-foreground text-background border-foreground" : "bg-background text-foreground hover:bg-muted/60"
              ]),
              "aria-pressed": d[G.key] === X.value ? "true" : "false",
              onClick: (W) => $(G.key, X.value)
            }, c(X.label), 11, y0))), 128))
          ], 8, h0))), 128)),
          (t(!0), n(z, null, j(B.value, (G) => (t(), n("div", {
            key: G.key,
            class: "flex flex-wrap items-center gap-1.5",
            "aria-label": G.label ?? G.key,
            "data-slot": "catalog-range"
          }, [
            l("span", k0, c(G.label ?? G.key), 1),
            I(we, {
              type: "number",
              class: "h-8 w-24 px-2 text-xs",
              placeholder: "From",
              "aria-label": `${G.label ?? G.key} from`,
              "model-value": k(G.key).min,
              "onUpdate:modelValue": (X) => S(G.key, "min", String(X))
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
            Z[7] || (Z[7] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "to", -1)),
            I(we, {
              type: "number",
              class: "h-8 w-24 px-2 text-xs",
              placeholder: "To",
              "aria-label": `${G.label ?? G.key} to`,
              "model-value": k(G.key).max,
              "onUpdate:modelValue": (X) => S(G.key, "max", String(X))
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ], 8, x0))), 128))
        ])) : b("", !0)
      ])) : b("", !0),
      e.items.length === 0 ? (t(), n("p", $0, " No matching items. ")) : (t(), n("div", {
        key: 2,
        class: A(i.value === "list" ? "flex flex-col gap-3" : x(am)),
        "data-slot": i.value === "list" ? "catalog-list" : "catalog-grid"
      }, [
        (t(!0), n(z, null, j(_.value, (G) => (t(), D(qy, {
          key: G.key,
          item: G,
          layout: i.value,
          onSelect: Z[3] || (Z[3] = (X) => r("select", X)),
          onCart: Z[4] || (Z[4] = (X) => r("cart", X))
        }, null, 8, ["item", "layout"]))), 128))
      ], 10, w0)),
      e.pageSize && g.value > 1 ? (t(), n("div", C0, [
        l("p", S0, " Page " + c(m.value) + " of " + c(g.value), 1),
        l("div", M0, [
          l("button", {
            type: "button",
            class: "rounded-md border bg-background px-2.5 py-1 text-xs font-medium disabled:opacity-40",
            disabled: m.value <= 1,
            onClick: Z[5] || (Z[5] = (G) => T(m.value - 1))
          }, " Previous ", 8, B0),
          l("button", {
            type: "button",
            class: "rounded-md border bg-background px-2.5 py-1 text-xs font-medium disabled:opacity-40",
            disabled: m.value >= g.value,
            onClick: Z[6] || (Z[6] = (G) => T(m.value + 1))
          }, " Next ", 8, A0)
        ])
      ])) : b("", !0)
    ], 2));
  }
}), _0 = ["aria-disabled"], z0 = ["disabled"], P0 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, L0 = ["d"], O0 = {
  class: "min-w-6 px-1 text-center text-sm tabular-nums",
  "aria-live": "polite"
}, j0 = ["disabled"], V0 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, D0 = ["d"], T0 = /* @__PURE__ */ L({
  __name: "PkQtyStepper",
  props: /* @__PURE__ */ Fe({
    min: { default: 1 },
    max: { default: null },
    disabled: { type: Boolean, default: !1 }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ Fe(["decrease", "increase"], ["update:modelValue"]),
  setup(e, { emit: o }) {
    const a = pt(e, "modelValue"), r = o, s = y(() => a.value <= e.min), i = y(() => e.max !== null && a.value >= e.max);
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
        (t(), n("svg", P0, [
          l("path", {
            d: x(me)("minus")
          }, null, 8, L0)
        ]))
      ], 8, z0),
      l("span", O0, c(a.value), 1),
      l("button", {
        type: "button",
        class: "hover:bg-muted inline-flex size-8 items-center justify-center disabled:opacity-40",
        disabled: e.disabled || i.value,
        "aria-label": "Increase quantity",
        onClick: f[1] || (f[1] = (v) => d(1))
      }, [
        (t(), n("svg", V0, [
          l("path", {
            d: x(me)("plus")
          }, null, 8, D0)
        ]))
      ], 8, j0)
    ], 8, _0));
  }
}), I0 = { class: "divide-border flex flex-col divide-y" }, E0 = { class: "min-w-0" }, F0 = { class: "truncate text-sm font-medium" }, N0 = {
  key: 0,
  class: "text-muted-foreground mt-0.5 truncate text-xs"
}, R0 = { class: "flex shrink-0 items-center gap-2 text-sm" }, U0 = {
  key: 1,
  class: "text-muted-foreground tabular-nums"
}, H0 = {
  key: 2,
  class: "font-medium tabular-nums"
}, q0 = ["aria-label", "onClick"], K0 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, G0 = ["d"], W0 = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("div", I0, [
      (t(!0), n(z, null, j(e.items, (d) => (t(), n("div", {
        key: d.key,
        class: "flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
      }, [
        l("div", E0, [
          l("p", F0, c(d.label), 1),
          d.detail ? (t(), n("p", N0, c(d.detail), 1)) : b("", !0)
        ]),
        l("div", R0, [
          e.editable ? (t(), D(T0, {
            key: 0,
            "model-value": r(d),
            "onUpdate:modelValue": (u) => a("qty", d.key, u)
          }, null, 8, ["model-value", "onUpdate:modelValue"])) : d.qty !== null && d.qty !== void 0 && d.qty !== "" ? (t(), n("span", U0, " ×" + c(d.qty), 1)) : b("", !0),
          d.amount ? (t(), n("span", H0, c(d.amount), 1)) : b("", !0),
          d.status ? (t(), D($e, {
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
            (t(), n("svg", K0, [
              l("path", {
                d: x(me)("trash")
              }, null, 8, G0)
            ]))
          ], 8, q0)) : b("", !0)
        ])
      ]))), 128))
    ]));
  }
}), Z0 = {
  "data-slot": "cart-panel",
  class: "bg-card flex flex-col overflow-hidden rounded-lg border"
}, J0 = { class: "border-b px-4 py-3" }, Y0 = { class: "text-sm font-medium" }, Q0 = { class: "flex-1 px-4 py-3" }, X0 = {
  key: 0,
  class: "text-muted-foreground py-8 text-center text-sm",
  "data-slot": "cart-empty"
}, ek = { class: "text-foreground block font-medium" }, tk = { class: "mt-1 block" }, nk = {
  key: 0,
  class: "flex flex-col gap-2 border-t px-4 py-3"
}, ak = {
  key: 0,
  class: "flex items-center justify-between text-sm"
}, lk = { class: "tabular-nums" }, ok = {
  key: 1,
  class: "flex items-center justify-between text-sm",
  "data-slot": "cart-discount"
}, sk = { class: "text-muted-foreground" }, rk = {
  key: 0,
  class: "tabular-nums"
}, ik = {
  key: 2,
  class: "flex items-center justify-between text-sm"
}, dk = { class: "text-muted-foreground" }, uk = { class: "tabular-nums" }, ck = {
  key: 3,
  class: "flex items-center justify-between text-sm font-semibold"
}, fk = { class: "tabular-nums" }, mk = {
  key: 4,
  class: "pt-1"
}, pk = /* @__PURE__ */ L({
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
    return (r, s) => (t(), n("aside", Z0, [
      l("header", J0, [
        l("h2", Y0, c(e.title), 1)
      ]),
      l("div", Q0, [
        e.items.length === 0 ? (t(), n("p", X0, [
          l("span", ek, c(e.emptyTitle), 1),
          l("span", tk, c(e.emptyDescription), 1)
        ])) : (t(), D(W0, {
          key: 1,
          items: e.items,
          editable: "",
          onQty: s[0] || (s[0] = (i, d) => a("qty", i, d)),
          onRemove: s[1] || (s[1] = (i) => a("remove", i))
        }, null, 8, ["items"]))
      ]),
      e.items.length > 0 ? (t(), n("footer", nk, [
        e.subtotal ? (t(), n("div", ak, [
          s[2] || (s[2] = l("span", { class: "text-muted-foreground" }, "Subtotal", -1)),
          l("span", lk, c(e.subtotal), 1)
        ])) : b("", !0),
        e.discount || r.$slots.discount ? (t(), n("div", ok, [
          l("span", sk, c(e.discountLabel), 1),
          e.discount ? (t(), n("span", rk, c(e.discount), 1)) : b("", !0),
          q(r.$slots, "discount")
        ])) : b("", !0),
        e.tax ? (t(), n("div", ik, [
          l("span", dk, c(e.taxLabel), 1),
          l("span", uk, c(e.tax), 1)
        ])) : b("", !0),
        e.total ? (t(), n("div", ck, [
          s[3] || (s[3] = l("span", null, "Total", -1)),
          l("span", fk, c(e.total), 1)
        ])) : b("", !0),
        r.$slots.pay ? (t(), n("div", mk, [
          q(r.$slots, "pay")
        ])) : b("", !0)
      ])) : b("", !0)
    ]));
  }
});
function Ee() {
  return { query: "", selected: {}, ranges: {} };
}
function vk(e, o) {
  const a = e.metrics?.[o];
  if (typeof a == "number" && Number.isFinite(a))
    return a;
  const r = e.facets?.[o];
  if (r == null || r === "")
    return null;
  const s = Number(r);
  return Number.isFinite(s) ? s : null;
}
function gk(e, o) {
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
    if (!gk(vk(e, r), s))
      return !1;
  return !0;
}
function hk(e, o) {
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
const bk = { class: "flex flex-col gap-6" }, yk = {
  key: 0,
  class: "flex flex-col gap-1.5"
}, xk = { class: "text-sm font-semibold" }, kk = { class: "flex flex-wrap items-center gap-1.5" }, $k = ["aria-pressed", "onClick"], wk = { class: "text-sm font-semibold" }, Ck = { class: "flex flex-wrap items-center gap-1.5" }, Sk = { key: 0 }, ua = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(""), i = ct({}), d = ct({}), u = y(
      () => a.facets.filter((g) => (g.kind ?? "chips") === "chips")
    ), f = y(() => a.facets.filter((g) => g.kind === "range"));
    function v(g) {
      return g == null ? "" : String(g);
    }
    function p() {
      s.value = a.applied.query ?? "";
      for (const g of Object.keys(i))
        delete i[g];
      for (const [g, _] of Object.entries(a.applied.selected ?? {}))
        i[g] = _;
      for (const g of Object.keys(d))
        delete d[g];
      for (const [g, _] of Object.entries(a.applied.ranges ?? {}))
        d[g] = { min: v(_.min), max: v(_.max) };
    }
    pe(
      () => a.open,
      (g) => {
        g && p();
      }
    );
    function h(g) {
      const _ = g.trim();
      if (_ === "")
        return null;
      const T = Number(_);
      return Number.isFinite(T) ? T : null;
    }
    function $() {
      const g = {};
      for (const [_, T] of Object.entries(d))
        g[_] = { min: h(T.min), max: h(T.max) };
      return g;
    }
    function k() {
      return {
        query: a.hideSearch ? a.applied.query : s.value,
        selected: { ...i },
        ranges: $()
      };
    }
    const S = y(() => {
      let g = a.hideSearch || s.value.trim() === "" ? 0 : 1;
      for (const _ of Object.values(i))
        _ && (g += 1);
      for (const _ of Object.values($()))
        (_.min !== null || _.max !== null) && (g += 1);
      return g;
    });
    function w(g, _) {
      i[g] = i[g] === _ ? null : _;
    }
    function C(g) {
      return d[g] ?? { min: "", max: "" };
    }
    function B(g, _, T) {
      const F = d[g] ?? { min: "", max: "" };
      d[g] = { ...F, [_]: T };
    }
    function M() {
      r("apply", k());
    }
    function m() {
      s.value = "";
      for (const g of Object.keys(i))
        i[g] = null;
      for (const g of Object.keys(d))
        d[g] = { min: "", max: "" };
      r("reset"), r(
        "apply",
        a.hideSearch ? { ...Ee(), query: a.applied.query } : Ee()
      );
    }
    return (g, _) => (t(), D(Pt, {
      open: e.open,
      title: e.title,
      description: e.description || (e.hideSearch ? "Category and stock for this list" : "Search, categories and ranges for this list"),
      size: "sm",
      onClose: _[2] || (_[2] = (T) => r("close"))
    }, {
      footer: O(() => [
        l("button", {
          type: "button",
          class: "text-muted-foreground mr-auto text-xs hover:underline",
          onClick: m
        }, " Reset all "),
        I(ce, {
          variant: "outline",
          size: "sm",
          onClick: _[1] || (_[1] = (T) => r("close"))
        }, {
          default: O(() => [..._[5] || (_[5] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }),
        I(ce, {
          size: "sm",
          onClick: M
        }, {
          default: O(() => [
            _[6] || (_[6] = U(" Apply", -1)),
            S.value ? (t(), n("span", Sk, " (" + c(S.value) + ")", 1)) : b("", !0)
          ]),
          _: 1
        })
      ]),
      default: O(() => [
        l("div", bk, [
          e.hideSearch ? b("", !0) : (t(), n("label", yk, [
            _[3] || (_[3] = l("span", { class: "text-sm font-semibold" }, "Search", -1)),
            I(we, {
              modelValue: s.value,
              "onUpdate:modelValue": _[0] || (_[0] = (T) => s.value = T),
              type: "search",
              placeholder: e.searchPlaceholder,
              "aria-label": e.searchPlaceholder
            }, null, 8, ["modelValue", "placeholder", "aria-label"])
          ])),
          (t(!0), n(z, null, j(u.value, (T) => (t(), n("section", {
            key: T.key,
            class: "flex flex-col gap-2"
          }, [
            l("h3", xk, c(T.label ?? T.key), 1),
            l("div", kk, [
              (t(!0), n(z, null, j(T.options ?? [], (F) => (t(), n("button", {
                key: F.value,
                type: "button",
                class: A([
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  i[T.key] === F.value ? "border-foreground bg-foreground text-background" : "bg-background text-foreground hover:bg-muted/60"
                ]),
                "aria-pressed": i[T.key] === F.value ? "true" : "false",
                onClick: (Z) => w(T.key, F.value)
              }, c(F.label), 11, $k))), 128))
            ])
          ]))), 128)),
          (t(!0), n(z, null, j(f.value, (T) => (t(), n("section", {
            key: T.key,
            class: "flex flex-col gap-2"
          }, [
            l("h3", wk, c(T.label ?? T.key), 1),
            l("div", Ck, [
              I(we, {
                type: "number",
                class: "h-8 w-24 px-2 text-xs",
                placeholder: "From",
                "aria-label": `${T.label ?? T.key} from`,
                "model-value": C(T.key).min,
                "onUpdate:modelValue": (F) => B(T.key, "min", String(F))
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
              _[4] || (_[4] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "to", -1)),
              I(we, {
                type: "number",
                class: "h-8 w-24 px-2 text-xs",
                placeholder: "To",
                "aria-label": `${T.label ?? T.key} to`,
                "model-value": C(T.key).max,
                "onUpdate:modelValue": (F) => B(T.key, "max", String(F))
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])
      ]),
      _: 1
    }, 8, ["open", "title", "description"]));
  }
}), Mk = {
  "data-slot": "catalog-till",
  class: "grid w-full items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
}, Bk = { class: "flex flex-col gap-4" }, Ak = { class: "flex flex-wrap items-start justify-between gap-3" }, _k = { class: "flex items-center gap-2" }, zk = {
  key: 0,
  class: "bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
}, X6 = /* @__PURE__ */ L({
  __name: "CatalogTill",
  props: /* @__PURE__ */ Fe({
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
  emits: /* @__PURE__ */ Fe(["select", "pay"], ["update:cart"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = H(Ee()), i = H(!1), d = pt(e, "cart"), u = H(!1), f = y(
      () => a.items.filter((G) => pn(G, s.value))
    );
    function v(G) {
      s.value = { ...s.value, query: G.query };
    }
    function p(G) {
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
    function $(G, X, W) {
      return {
        ...G,
        qty: X,
        amount: a.formatMoney(W * X)
      };
    }
    function k(G) {
      const X = hk(a.items, G);
      X && S(X.key);
    }
    function S(G) {
      const X = a.items.find((N) => N.key === G);
      if (!X || X.status === "out-of-stock")
        return;
      u.value = !1;
      const W = h(X);
      if (d.value.find((N) => N.key === G)) {
        d.value = d.value.map(
          (N) => N.key === G ? $(N, Number(N.qty ?? 1) + 1, W) : N
        );
        return;
      }
      d.value = [
        ...d.value,
        {
          key: X.key,
          label: X.label,
          detail: X.caption ?? null,
          qty: 1,
          amount: a.formatMoney(W)
        }
      ];
    }
    function w(G, X) {
      const W = a.items.find((N) => N.key === G), K = h(W);
      d.value = d.value.map((N) => N.key === G ? $(N, X, K) : N);
    }
    function C(G) {
      d.value = d.value.filter((X) => X.key !== G);
    }
    const B = y(
      () => d.value.reduce((G, X) => {
        const W = a.items.find((K) => K.key === X.key);
        return G + h(W) * Number(X.qty ?? 1);
      }, 0)
    ), M = y(
      () => a.discountRate > 0 ? Math.round(B.value * a.discountRate) : 0
    ), m = y(
      () => Math.round((B.value - M.value) * a.taxRate)
    ), g = y(() => d.value.length ? a.formatMoney(B.value) : null), _ = y(
      () => d.value.length && M.value > 0 ? `−${a.formatMoney(M.value)}` : null
    ), T = y(
      () => d.value.length && a.taxRate > 0 ? a.formatMoney(m.value) : null
    ), F = y(
      () => d.value.length ? a.formatMoney(B.value - M.value + m.value) : null
    );
    function Z() {
      u.value = !0, r("pay", d.value);
    }
    return (G, X) => (t(), n(z, null, [
      l("div", Mk, [
        l("section", Bk, [
          l("div", Ak, [
            I(Ie, {
              variant: "small",
              title: e.shelfTitle,
              description: e.shelfDescription ?? void 0
            }, null, 8, ["title", "description"]),
            l("div", _k, [
              x(_t)(s.value) ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "text-muted-foreground hover:text-foreground text-xs hover:underline",
                onClick: X[0] || (X[0] = (W) => s.value = {
                  ...x(Ee)(),
                  query: s.value.query
                })
              }, " Clear ")) : b("", !0),
              e.facets.length > 0 ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "relative inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
                onClick: X[1] || (X[1] = (W) => i.value = !0)
              }, [
                X[5] || (X[5] = l("svg", {
                  viewBox: "0 0 24 24",
                  class: "size-4",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  l("path", { d: "M3 5h18M6 12h12M10 19h4" })
                ], -1)),
                X[6] || (X[6] = U(" Filters ", -1)),
                x(_t)(s.value) ? (t(), n("span", zk, " on ")) : b("", !0)
              ])) : b("", !0)
            ])
          ]),
          I(mn, {
            searchable: "",
            autofocus: "",
            "search-placeholder": e.searchPlaceholder,
            items: f.value,
            onFilter: v,
            onSelect: X[2] || (X[2] = (W) => r("select", W)),
            onCart: S,
            onScan: k
          }, null, 8, ["search-placeholder", "items"])
        ]),
        I(pk, {
          class: "lg:sticky lg:top-4",
          title: e.cartTitle,
          items: d.value,
          subtotal: g.value,
          "discount-label": e.discountLabel,
          discount: _.value,
          "tax-label": e.taxLabel,
          tax: T.value,
          total: F.value,
          onQty: w,
          onRemove: C
        }, {
          pay: O(() => [
            q(G.$slots, "pay", {
              cart: d.value,
              paid: u.value,
              pay: Z
            }, () => [
              I(ce, {
                class: "w-full",
                disabled: d.value.length === 0,
                onClick: Z
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
        onClose: X[3] || (X[3] = (W) => i.value = !1),
        onApply: p,
        onReset: X[4] || (X[4] = (W) => s.value = { ...x(Ee)(), query: s.value.query })
      }, null, 8, ["open", "facets", "applied"])
    ], 64));
  }
}), Pk = {
  key: 0,
  class: "flex flex-col gap-5"
}, Lk = { class: "bg-muted aspect-[4/3] overflow-hidden rounded-lg" }, Ok = ["src", "alt"], jk = {
  key: 0,
  class: "flex gap-2 overflow-x-auto"
}, Vk = ["src"], Dk = { class: "flex items-start justify-between gap-3" }, Tk = { class: "text-lg font-semibold tabular-nums" }, Ik = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Ek = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, Fk = { class: "grid grid-cols-2 gap-3" }, Nk = { class: "flex flex-col gap-2" }, Rk = { class: "text-xs font-semibold tracking-wide text-muted-foreground uppercase" }, eS = /* @__PURE__ */ L({
  __name: "CatalogInspect",
  props: {
    open: { type: Boolean },
    item: {}
  },
  emits: ["close", "cart"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s(p) {
      let h = 0;
      for (const $ of p)
        h = h * 31 + $.charCodeAt(0) >>> 0;
      return h;
    }
    function i(p, h) {
      return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((k, S) => ({
        label: k,
        value: Math.max(0, Math.round(p + Math.sin(S + h) * p * 0.18))
      }));
    }
    const d = y(() => a.item?.kind === "unit"), u = y(() => {
      const p = a.item;
      if (!p)
        return [];
      const h = p.stock ?? p.progress?.value ?? p.metrics?.price ?? p.metrics?.rent ?? 12;
      return i(Number(h) || 12, s(p.key) % 7);
    }), f = y(() => {
      const p = a.item;
      if (!p)
        return [];
      const h = p.progress?.value ?? (p.status === "occupied" ? 80 : 20);
      return i(Number(h) || 20, s(p.key) % 5 + 1);
    }), v = y(
      () => !!a.item && !d.value && a.item?.status !== "out-of-stock"
    );
    return (p, h) => (t(), D(Pt, {
      open: e.open,
      title: e.item?.label ?? "Item",
      description: e.item?.caption ?? e.item?.sku ?? null,
      size: "md",
      onClose: h[1] || (h[1] = ($) => r("close"))
    }, ut({
      default: O(() => [
        e.item ? (t(), n("div", Pk, [
          l("div", Lk, [
            e.item.image ? (t(), n("img", {
              key: 0,
              src: e.item.image,
              alt: e.item.label,
              class: "size-full object-cover"
            }, null, 8, Ok)) : b("", !0)
          ]),
          e.item.images?.length ? (t(), n("div", jk, [
            (t(!0), n(z, null, j(e.item.images, ($, k) => (t(), n("img", {
              key: k,
              src: $,
              alt: "",
              class: "size-16 shrink-0 rounded-md object-cover"
            }, null, 8, Vk))), 128))
          ])) : b("", !0),
          l("div", Dk, [
            l("div", null, [
              l("p", Tk, c(e.item.price), 1),
              typeof e.item.stock == "number" ? (t(), n("p", Ik, c(e.item.stock) + " in stock ", 1)) : b("", !0)
            ]),
            e.item.status ? (t(), D($e, {
              key: 0,
              status: e.item.status,
              tone: e.item.tone
            }, null, 8, ["status", "tone"])) : b("", !0)
          ]),
          e.item.facts?.length ? (t(), n("p", Ek, c(e.item.facts.join(" · ")), 1)) : b("", !0),
          l("div", Fk, [
            I(At, {
              label: d.value ? "Occupancy" : "Stock",
              value: d.value ? `${e.item.progress?.value ?? 0}%` : String(e.item.stock ?? e.item.progress?.value ?? 0),
              series: d.value ? f.value : u.value
            }, null, 8, ["label", "value", "series"]),
            I(At, {
              label: "Price",
              value: e.item.price ?? "-",
              series: u.value
            }, null, 8, ["value", "series"])
          ]),
          l("div", Nk, [
            l("p", Rk, c(d.value ? "Occupancy, last 6 months" : "Stock movement, last 6 months"), 1),
            I(Ot, {
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
            onClick: h[0] || (h[0] = ($) => r("cart", e.item.key))
          }, " Add to cart ")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["open", "title", "description"]));
  }
}), Uk = { class: "flex flex-col gap-10" }, Hk = { class: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" }, qk = { class: "flex flex-col gap-3" }, Kk = { class: "bg-muted aspect-[4/3] overflow-hidden rounded-lg border" }, Gk = ["src", "alt"], Wk = {
  key: 0,
  class: "flex gap-2 overflow-x-auto"
}, Zk = ["aria-label", "aria-pressed", "onClick"], Jk = ["src"], Yk = { class: "flex flex-col gap-5" }, Qk = { class: "flex flex-wrap items-start justify-between gap-3" }, Xk = { class: "min-w-0" }, e2 = { class: "text-2xl font-semibold tracking-tight" }, t2 = { class: "text-muted-foreground mt-1 text-sm" }, n2 = { class: "text-2xl font-semibold tabular-nums" }, a2 = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, l2 = { class: "grid grid-cols-2 gap-3 text-sm" }, o2 = {
  key: 0,
  class: "rounded-lg border p-3"
}, s2 = { class: "mt-1 font-medium" }, r2 = { class: "rounded-lg border p-3" }, i2 = { class: "text-muted-foreground text-xs font-medium tracking-wide uppercase" }, d2 = { class: "mt-1 font-medium" }, u2 = { class: "flex flex-col gap-4" }, c2 = { class: "grid gap-4 sm:grid-cols-2" }, f2 = { class: "bg-card rounded-lg border p-4" }, m2 = { class: "mb-3 text-sm font-medium" }, p2 = /* @__PURE__ */ L({
  __name: "CatalogItemDetail",
  props: {
    item: {}
  },
  emits: ["cart"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s(k) {
      let S = 0;
      for (const w of k)
        S = S * 31 + w.charCodeAt(0) >>> 0;
      return S;
    }
    function i(k, S) {
      return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((C, B) => ({
        label: C,
        value: Math.max(0, Math.round(k + Math.sin(B + S) * k * 0.18))
      }));
    }
    const d = y(() => a.item.kind === "unit"), u = y(() => {
      const k = [a.item.image, ...a.item.images ?? []].filter(
        (S) => typeof S == "string" && S !== ""
      );
      return [...new Set(k)];
    }), f = H(0), v = y(() => {
      const k = a.item.stock ?? a.item.progress?.value ?? a.item.metrics?.price ?? a.item.metrics?.rent ?? 12;
      return i(Number(k) || 12, s(a.item.key) % 7);
    }), p = y(() => {
      const k = a.item.progress?.value ?? (a.item.status === "occupied" ? 80 : 20);
      return i(Number(k) || 20, s(a.item.key) % 5 + 1);
    }), h = y(() => d.value ? p.value : v.value), $ = y(() => !d.value && a.item.status !== "out-of-stock");
    return (k, S) => (t(), n("div", Uk, [
      l("div", Hk, [
        l("div", qk, [
          l("div", Kk, [
            u.value[f.value] ? (t(), n("img", {
              key: 0,
              src: u.value[f.value],
              alt: e.item.label,
              class: "size-full object-cover"
            }, null, 8, Gk)) : b("", !0)
          ]),
          u.value.length > 1 ? (t(), n("div", Wk, [
            (t(!0), n(z, null, j(u.value, (w, C) => (t(), n("button", {
              key: w,
              type: "button",
              class: A(["size-16 shrink-0 overflow-hidden rounded-md border", C === f.value ? "ring-2 ring-foreground" : "opacity-80"]),
              "aria-label": `Photo ${C + 1}`,
              "aria-pressed": C === f.value ? "true" : "false",
              onClick: (B) => f.value = C
            }, [
              l("img", {
                src: w,
                alt: "",
                class: "size-full object-cover"
              }, null, 8, Jk)
            ], 10, Zk))), 128))
          ])) : b("", !0)
        ]),
        l("div", Yk, [
          l("div", Qk, [
            l("div", Xk, [
              l("h1", e2, c(e.item.label), 1),
              l("p", t2, c(e.item.caption ?? e.item.sku), 1)
            ]),
            e.item.status ? (t(), D($e, {
              key: 0,
              status: e.item.status,
              tone: e.item.tone
            }, null, 8, ["status", "tone"])) : b("", !0)
          ]),
          l("p", n2, c(e.item.price), 1),
          e.item.facts?.length ? (t(), n("p", a2, c(e.item.facts.join(" · ")), 1)) : b("", !0),
          l("dl", l2, [
            e.item.sku ? (t(), n("div", o2, [
              S[1] || (S[1] = l("dt", { class: "text-muted-foreground text-xs font-medium tracking-wide uppercase" }, " SKU ", -1)),
              l("dd", s2, c(e.item.sku), 1)
            ])) : b("", !0),
            l("div", r2, [
              l("dt", i2, c(d.value ? "Occupancy" : "Stock"), 1),
              l("dd", d2, c(d.value ? `${e.item.progress?.value ?? 0}%` : `${e.item.stock ?? e.item.progress?.value ?? 0} in stock`), 1)
            ])
          ]),
          $.value ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2.5 text-sm font-medium sm:w-auto",
            onClick: S[0] || (S[0] = (w) => r("cart", e.item.key))
          }, " Add to cart ")) : b("", !0)
        ])
      ]),
      l("section", u2, [
        S[2] || (S[2] = l("h2", { class: "text-sm font-semibold tracking-wide text-muted-foreground uppercase" }, " Analytics ", -1)),
        l("div", c2, [
          I(At, {
            label: d.value ? "Occupancy" : "Stock",
            value: d.value ? `${e.item.progress?.value ?? 0}%` : String(e.item.stock ?? e.item.progress?.value ?? 0),
            series: h.value
          }, null, 8, ["label", "value", "series"]),
          I(At, {
            label: "Price",
            value: e.item.price ?? "-",
            series: v.value
          }, null, 8, ["value", "series"])
        ]),
        l("div", f2, [
          l("p", m2, c(d.value ? "Occupancy, last 6 months" : "Stock movement, last 6 months"), 1),
          I(Kh, {
            data: h.value,
            type: "area",
            height: 220
          }, null, 8, ["data"])
        ])
      ])
    ]));
  }
}), v2 = ["href"], tS = /* @__PURE__ */ L({
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
      class: A(["flex w-full flex-col gap-8", e.embedded ? "" : x(at)])
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
      ], 8, v2),
      I(p2, {
        item: e.item,
        onCart: s[0] || (s[0] = (i) => a("cart", i))
      }, null, 8, ["item"])
    ], 2));
  }
}), g2 = {
  key: 0,
  class: "inline-flex w-fit rounded-md border",
  role: "tablist",
  "aria-label": "Catalog section"
}, h2 = ["aria-selected", "onClick"], b2 = {
  class: "flex flex-wrap items-center gap-2 sm:flex-nowrap",
  "data-slot": "catalog-page-toolbar"
}, y2 = {
  key: 0,
  class: "bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
}, x2 = {
  class: "ml-auto inline-flex shrink-0 rounded-md border",
  role: "group",
  "aria-label": "Layout"
}, k2 = ["aria-pressed"], $2 = ["aria-pressed"], nS = /* @__PURE__ */ L({
  __name: "CatalogBrowser",
  props: /* @__PURE__ */ Fe({
    title: { default: "Catalog" },
    description: { default: null },
    tabs: {},
    pageSize: { default: 8 },
    embedded: { type: Boolean, default: !0 }
  }, {
    layout: { default: "grid" },
    layoutModifiers: {}
  }),
  emits: /* @__PURE__ */ Fe(["select", "cart"], ["update:layout"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = H(a.tabs[0]?.key ?? ""), i = pt(e, "layout"), d = H({}), u = H(!1);
    pe(
      () => a.tabs.map((w) => w.key).join(","),
      (w) => {
        w.split(",").includes(s.value) || (s.value = a.tabs[0]?.key ?? "");
      }
    );
    function f(w) {
      return d.value[w] ?? Ee();
    }
    const v = y(
      () => a.tabs.find((w) => w.key === s.value) ?? a.tabs[0] ?? null
    ), p = y(
      () => v.value ? f(v.value.key) : Ee()
    ), h = y(() => {
      const w = v.value;
      return w ? w.items.filter((C) => pn(C, f(w.key))) : [];
    });
    function $(w) {
      const C = v.value?.key;
      C && (d.value = {
        ...d.value,
        [C]: { ...f(C), query: w }
      });
    }
    function k() {
      const w = v.value?.key;
      w && (d.value = { ...d.value, [w]: Ee() });
    }
    function S(w) {
      const C = v.value?.key;
      C && (d.value = { ...d.value, [C]: w }, u.value = !1);
    }
    return (w, C) => (t(), n(z, null, [
      l("div", {
        class: A(["flex w-full flex-col gap-8", e.embedded ? "" : x(at)])
      }, [
        I(Ie, {
          title: e.title,
          description: e.description ?? void 0
        }, null, 8, ["title", "description"]),
        e.tabs.length > 1 ? (t(), n("div", g2, [
          (t(!0), n(z, null, j(e.tabs, (B) => (t(), n("button", {
            key: B.key,
            type: "button",
            class: A(["px-3 py-1.5 text-sm transition-colors", s.value === B.key ? "bg-foreground text-background" : "hover:bg-muted/60"]),
            role: "tab",
            "aria-selected": s.value === B.key ? "true" : "false",
            onClick: (M) => s.value = B.key
          }, c(B.label), 11, h2))), 128))
        ])) : b("", !0),
        l("div", b2, [
          I(we, {
            class: "min-w-0 w-full flex-1 sm:max-w-xs",
            "model-value": p.value.query,
            type: "search",
            placeholder: v.value?.searchPlaceholder ?? "Search…",
            "aria-label": v.value?.searchPlaceholder ?? "Search",
            "onUpdate:modelValue": C[0] || (C[0] = (B) => $(String(B)))
          }, null, 8, ["model-value", "placeholder", "aria-label"]),
          x(_t)(p.value) ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline",
            onClick: k
          }, " Clear ")) : b("", !0),
          (v.value?.facets ?? []).length > 0 ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "relative inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
            onClick: C[1] || (C[1] = (B) => u.value = !0)
          }, [
            C[8] || (C[8] = l("svg", {
              viewBox: "0 0 24 24",
              class: "size-4",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2"
            }, [
              l("path", { d: "M3 5h18M6 12h12M10 19h4" })
            ], -1)),
            C[9] || (C[9] = U(" Filters ", -1)),
            x(_t)(p.value) ? (t(), n("span", y2, " on ")) : b("", !0)
          ])) : b("", !0),
          l("div", x2, [
            l("button", {
              type: "button",
              class: A([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "grid" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "grid" ? "true" : "false",
              "aria-label": "Grid",
              onClick: C[2] || (C[2] = (B) => i.value = "grid")
            }, " Tiles ", 10, k2),
            l("button", {
              type: "button",
              class: A([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "list" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "list" ? "true" : "false",
              "aria-label": "List",
              onClick: C[3] || (C[3] = (B) => i.value = "list")
            }, " List ", 10, $2)
          ])
        ]),
        I(mn, {
          layout: i.value,
          "onUpdate:layout": C[4] || (C[4] = (B) => i.value = B),
          "page-size": e.pageSize,
          items: h.value,
          onSelect: C[5] || (C[5] = (B) => r("select", B)),
          onCart: C[6] || (C[6] = (B) => r("cart", B))
        }, null, 8, ["layout", "page-size", "items"])
      ], 2),
      I(ua, {
        open: u.value,
        title: v.value?.filterTitle ?? "Filters",
        "search-placeholder": v.value?.searchPlaceholder ?? "Search…",
        facets: v.value?.facets ?? [],
        applied: p.value,
        onClose: C[7] || (C[7] = (B) => u.value = !1),
        onApply: S,
        onReset: k
      }, null, 8, ["open", "title", "search-placeholder", "facets", "applied"])
    ], 64));
  }
}), w2 = { class: "flex flex-col gap-4" }, C2 = { class: "flex flex-col gap-4" }, aS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(Ee()), i = y(
      () => a.cards.filter((d) => pn(d, s.value))
    );
    return (d, u) => (t(), n("div", {
      class: A(["flex w-full flex-col gap-10", e.embedded ? "" : x(at)])
    }, [
      I(Ie, {
        title: e.title,
        description: e.description ?? void 0
      }, null, 8, ["title", "description"]),
      l("section", w2, [
        I(Ie, {
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
      l("section", C2, [
        I(Ie, {
          variant: "small",
          title: e.tableTitle,
          description: e.tableDescription ?? void 0
        }, null, 8, ["title", "description"]),
        I(go, {
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
}), S2 = {
  class: "flex flex-col gap-2",
  "data-slot": "signature-pad"
}, M2 = { class: "text-sm font-medium" }, B2 = ["width", "height", "aria-label"], A2 = { class: "flex items-center gap-2" }, _2 = /* @__PURE__ */ L({
  __name: "PkSignaturePad",
  props: {
    width: { default: 480 },
    height: { default: 160 },
    disabled: { type: Boolean, default: !1 },
    label: { default: "Draw your signature" }
  },
  emits: ["save", "clear"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = H(null), i = H(!1);
    let d = null;
    function u() {
      return s.value?.getContext("2d") ?? null;
    }
    function f(w) {
      const C = s.value;
      if (!C)
        return null;
      const B = C.getBoundingClientRect(), M = C.width / B.width, m = C.height / B.height;
      return {
        x: (w.clientX - B.left) * M,
        y: (w.clientY - B.top) * m
      };
    }
    function v(w) {
      a.disabled || (i.value = !0, d = f(w), s.value?.setPointerCapture(w.pointerId));
    }
    function p(w) {
      if (!i.value || a.disabled)
        return;
      const C = u(), B = f(w);
      !C || !B || !d || (C.strokeStyle = "#111827", C.lineWidth = 2.4, C.lineCap = "round", C.lineJoin = "round", C.beginPath(), C.moveTo(d.x, d.y), C.lineTo(B.x, B.y), C.stroke(), d = B);
    }
    function h() {
      i.value = !1, d = null;
    }
    function $() {
      const w = s.value, C = u();
      !w || !C || (C.clearRect(0, 0, w.width, w.height), r("clear"));
    }
    function k() {
      const w = s.value;
      w && r("save", w.toDataURL("image/png"));
    }
    function S() {
      const w = s.value, C = u();
      !w || !C || (C.fillStyle = "#ffffff", C.fillRect(0, 0, w.width, w.height));
    }
    return be(S), ke(() => {
      i.value = !1;
    }), (w, C) => (t(), n("div", S2, [
      l("p", M2, c(e.label), 1),
      l("canvas", {
        ref_key: "canvas",
        ref: s,
        width: e.width,
        height: e.height,
        class: A(["bg-background w-full max-w-full cursor-crosshair touch-none rounded-md border", e.disabled ? "pointer-events-none opacity-50" : ""]),
        "aria-label": e.label,
        onPointerdown: he(v, ["prevent"]),
        onPointermove: he(p, ["prevent"]),
        onPointerup: he(h, ["prevent"]),
        onPointerleave: he(h, ["prevent"])
      }, null, 42, B2),
      l("div", A2, [
        I(ce, {
          variant: "outline",
          size: "sm",
          disabled: e.disabled,
          onClick: $
        }, {
          default: O(() => [...C[0] || (C[0] = [
            U(" Clear ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        I(ce, {
          size: "sm",
          disabled: e.disabled,
          onClick: k
        }, {
          default: O(() => [...C[1] || (C[1] = [
            U("Save signature", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}), z2 = { class: "grid gap-8 lg:grid-cols-2" }, P2 = { class: "flex flex-col gap-3" }, L2 = { class: "text-muted-foreground text-xs font-normal" }, O2 = {
  key: 0,
  class: "flex flex-col gap-3"
}, j2 = { class: "flex flex-wrap gap-3" }, V2 = ["onClick"], D2 = ["src", "alt"], T2 = {
  key: 1,
  class: "flex flex-col gap-3"
}, I2 = { class: "flex flex-wrap gap-3" }, E2 = ["onClick"], F2 = ["src", "alt"], N2 = {
  key: 2,
  class: "flex flex-col gap-4"
}, R2 = { class: "flex flex-wrap items-center gap-2" }, U2 = { class: "mx-auto w-full max-w-3xl overflow-hidden rounded-lg border shadow-sm" }, H2 = { class: "flex items-end justify-between gap-6 bg-white px-8 pb-8 text-black" }, q2 = { class: "flex flex-col gap-2" }, K2 = ["src"], G2 = {
  key: 1,
  class: "text-sm text-neutral-400"
}, W2 = ["src"], lS = /* @__PURE__ */ L({
  __name: "SignatureStudio",
  props: {
    title: { default: "Signatures" },
    description: { default: null },
    documents: { default: () => [] },
    storageKey: { default: null },
    embedded: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = H([]), r = H([]), s = H(null), i = H(null), d = H(null), u = H(o.documents[0]?.key ?? "");
    function f(w) {
      try {
        const C = localStorage.getItem(w), B = C ? JSON.parse(C) : [];
        return Array.isArray(B) ? B : [];
      } catch {
        return [];
      }
    }
    be(() => {
      !o.storageKey || typeof localStorage > "u" || (a.value = f(`${o.storageKey}.signatures`), r.value = f(`${o.storageKey}.stamps`), s.value = a.value[0]?.id ?? null, i.value = r.value[0]?.id ?? null);
    }), pe(
      a,
      (w) => {
        !o.storageKey || typeof localStorage > "u" || localStorage.setItem(`${o.storageKey}.signatures`, JSON.stringify(w));
      },
      { deep: !0 }
    ), pe(
      r,
      (w) => {
        !o.storageKey || typeof localStorage > "u" || localStorage.setItem(`${o.storageKey}.stamps`, JSON.stringify(w));
      },
      { deep: !0 }
    );
    function v(w) {
      const C = {
        id: `sig-${Date.now()}`,
        name: `Signature ${a.value.length + 1}`,
        dataUrl: w
      };
      a.value = [C, ...a.value].slice(0, 8), s.value = C.id;
    }
    async function p(w, C) {
      await cm(w), C(40);
      const B = await new Promise((M, m) => {
        const g = new FileReader();
        g.onload = () => M(String(g.result)), g.onerror = () => m(new Error("Could not read the file")), g.readAsDataURL(w);
      });
      return C(100), { value: B, name: w.name, size: w.size, url: B };
    }
    function h() {
      const w = d.value?.url ?? d.value?.value;
      if (!w)
        return;
      const C = {
        id: `stamp-${Date.now()}`,
        name: d.value?.name ?? "Stamp",
        dataUrl: w
      };
      r.value = [C, ...r.value].slice(0, 8), i.value = C.id;
    }
    const $ = y(
      () => a.value.find((w) => w.id === s.value)?.dataUrl ?? null
    ), k = y(
      () => r.value.find((w) => w.id === i.value)?.dataUrl ?? null
    ), S = y(() => {
      const w = o.documents.find((B) => B.key === u.value)?.document ?? o.documents[0]?.document ?? {}, C = {
        ...w?.branding ?? {},
        logoUrl: d.value?.url ?? null
      };
      return {
        ...w,
        branding: C
      };
    });
    return (w, C) => (t(), n("div", {
      class: A(["flex w-full flex-col gap-10", e.embedded ? "" : x(at)])
    }, [
      I(Ie, {
        title: e.title,
        description: e.description ?? void 0
      }, null, 8, ["title", "description"]),
      l("section", z2, [
        I(_2, {
          label: "Draw a signature",
          onSave: v
        }),
        l("div", P2, [
          C[2] || (C[2] = l("p", { class: "text-sm font-medium" }, "Company logo / stamp", -1)),
          l("p", L2, c(x(la)), 1),
          I(qn, {
            modelValue: d.value,
            "onUpdate:modelValue": C[0] || (C[0] = (B) => d.value = B),
            image: "",
            accept: ["png", "webp"],
            "max-kilobytes": 2048,
            upload: p
          }, null, 8, ["modelValue"]),
          I(ce, {
            size: "sm",
            variant: "outline",
            disabled: !d.value,
            onClick: h
          }, {
            default: O(() => [...C[1] || (C[1] = [
              U(" Save as stamp ", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ]),
      a.value.length ? (t(), n("section", O2, [
        I(Ie, {
          variant: "small",
          title: "Saved signatures"
        }),
        l("div", j2, [
          (t(!0), n(z, null, j(a.value, (B) => (t(), n("button", {
            key: B.id,
            type: "button",
            class: A(["rounded-md border p-2", B.id === s.value ? "ring-ring ring-2" : ""]),
            onClick: (M) => s.value = B.id
          }, [
            l("img", {
              src: B.dataUrl,
              alt: B.name,
              class: "h-12 w-40 bg-white object-contain"
            }, null, 8, D2)
          ], 10, V2))), 128))
        ])
      ])) : b("", !0),
      r.value.length ? (t(), n("section", T2, [
        I(Ie, {
          variant: "small",
          title: "Saved stamps"
        }),
        l("div", I2, [
          (t(!0), n(z, null, j(r.value, (B) => (t(), n("button", {
            key: B.id,
            type: "button",
            class: A(["rounded-md border p-2", B.id === i.value ? "ring-ring ring-2" : ""]),
            onClick: (M) => i.value = B.id
          }, [
            l("img", {
              src: B.dataUrl,
              alt: B.name,
              class: "size-16 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-[length:12px_12px] object-contain"
            }, null, 8, F2)
          ], 10, E2))), 128))
        ])
      ])) : b("", !0),
      e.documents.length ? (t(), n("section", N2, [
        l("div", R2, [
          (t(!0), n(z, null, j(e.documents, (B) => (t(), D(ce, {
            key: B.key,
            size: "sm",
            variant: u.value === B.key ? "default" : "outline",
            onClick: (M) => u.value = B.key
          }, {
            default: O(() => [
              U(c(B.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "onClick"]))), 128))
        ]),
        l("div", U2, [
          I(oh, {
            document: S.value
          }, null, 8, ["document"]),
          l("div", H2, [
            l("div", q2, [
              C[3] || (C[3] = l("p", { class: "text-xs tracking-wider text-neutral-500 uppercase" }, "Signed", -1)),
              $.value ? (t(), n("img", {
                key: 0,
                src: $.value,
                alt: "Signature",
                class: "h-16 w-48 object-contain"
              }, null, 8, K2)) : (t(), n("p", G2, "Draw and save a signature"))
            ]),
            k.value ? (t(), n("img", {
              key: 0,
              src: k.value,
              alt: "Stamp",
              class: "h-20 w-20 object-contain"
            }, null, 8, W2)) : b("", !0)
          ])
        ])
      ])) : b("", !0)
    ], 2));
  }
}), oS = "panel.dashboard.hiddenWidgets", Z2 = /* @__PURE__ */ Symbol("dashboardHide"), J2 = {
  key: 0,
  class: "w-full",
  "data-slot": "dashboard-shortcuts"
}, sS = /* @__PURE__ */ L({
  __name: "DashboardShortcuts",
  props: {
    catalog: {},
    defaults: { default: () => [] },
    storageKey: { default: "panel.dashboard.shortcuts" }
  },
  setup(e) {
    const o = e, a = $t(Z2, null), r = H(
      o.catalog.filter((d) => o.defaults.includes(d.id))
    ), s = H(!1);
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
    return (d, u) => i.value ? b("", !0) : (t(), n("div", J2, [
      I(Wb, {
        items: r.value,
        catalog: e.catalog,
        hideable: "",
        "onUpdate:items": u[0] || (u[0] = (f) => r.value = f),
        onHide: u[1] || (u[1] = (f) => x(a)?.hide("shortcuts", "Shortcuts"))
      }, null, 8, ["items", "catalog"])
    ]));
  }
}), Y2 = ["aria-busy"], Q2 = ["data-slot"], X2 = ["aria-pressed", "aria-label", "title"], e$ = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, t$ = { class: "text-muted-foreground text-[11px] font-semibold tracking-wider uppercase" }, n$ = { class: "flex h-8 items-center" }, a$ = ["aria-label", "title", "onClick"], l$ = ["aria-label", "title", "onClick"], o$ = {
  key: 3,
  class: "truncate text-2xl font-semibold tabular-nums"
}, s$ = {
  key: 1,
  class: "text-muted-foreground truncate text-xs"
}, rS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = H(a.maskable ? !a.hidden : !0), i = H(/* @__PURE__ */ new Set());
    function d(M) {
      return a.maskable && (M.sensitive ?? !0);
    }
    function u(M) {
      return d(M) && !s.value && !i.value.has(M.key);
    }
    const f = y(() => a.segments.some(u)), v = y(() => a.segments.some(d)), p = {
      2: "grid-cols-2",
      3: "grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    }, h = y(() => p[a.columns] ?? p[4]), $ = y(() => {
      const M = a.columns ?? 4, m = Math.floor(a.segments.length / M) * M;
      return a.segments.slice(0, m);
    }), k = y(() => {
      const M = a.columns ?? 4, m = Math.floor(a.segments.length / M) * M;
      return a.segments.slice(m);
    }), S = y(() => {
      const M = [];
      return $.value.length > 0 && M.push({ key: "packed", joined: !0, segments: $.value }), k.value.length > 0 && M.push({ key: "leftover", joined: !1, segments: k.value }), M;
    });
    function w() {
      const M = f.value === !1;
      s.value = !M, i.value = /* @__PURE__ */ new Set(), r("toggle", M);
    }
    function C(M) {
      if (!d(M))
        return;
      const m = new Set(i.value);
      if (u(M))
        m.add(M.key);
      else if (m.delete(M.key), s.value) {
        s.value = !1;
        for (const g of a.segments)
          g.key !== M.key && d(g) && m.add(g.key);
      }
      i.value = m, r("toggle", f.value);
    }
    function B(M) {
      return typeof M == "number" ? new Intl.NumberFormat().format(M) : M;
    }
    return (M, m) => (t(), n("div", {
      class: "flex flex-col gap-3",
      "data-slot": "stat-strip",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      (t(!0), n(z, null, j(S.value, (g) => (t(), n("div", {
        key: g.key,
        class: A(["relative shrink-0", g.joined ? "bg-border overflow-hidden rounded-xl border shadow-sm" : ""]),
        "data-slot": g.joined ? "stat-packed" : "stat-leftover"
      }, [
        e.maskable && v.value && g.key === S.value[0]?.key ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 rounded p-1 transition-colors",
          "aria-pressed": f.value,
          "aria-label": f.value ? "Show all values" : "Hide all values",
          title: f.value ? "Show all values" : "Hide all values",
          onClick: w
        }, [
          (t(), n("svg", e$, [
            f.value ? (t(), n(z, { key: 0 }, [
              m[0] || (m[0] = l("path", { d: "M10.7 6.2A9 9 0 0 1 12 6c5 0 9 4.5 9 6a12 12 0 0 1-2.2 3" }, null, -1)),
              m[1] || (m[1] = l("path", { d: "M6.6 6.9A13 13 0 0 0 3 12c0 1.5 4 6 9 6a9 9 0 0 0 3.7-.8" }, null, -1)),
              m[2] || (m[2] = l("path", { d: "M9.9 9.9a3 3 0 0 0 4.2 4.2" }, null, -1)),
              m[3] || (m[3] = l("path", { d: "m3 3 18 18" }, null, -1))
            ], 64)) : (t(), n(z, { key: 1 }, [
              m[4] || (m[4] = l("path", { d: "M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6Z" }, null, -1)),
              m[5] || (m[5] = l("circle", {
                cx: "12",
                cy: "12",
                r: "3"
              }, null, -1))
            ], 64))
          ]))
        ], 8, X2)) : b("", !0),
        l("div", {
          class: A(["grid", [g.joined ? "gap-px" : "gap-3", h.value]])
        }, [
          (t(!0), n(z, null, j(g.segments, (_) => (t(), n("div", {
            key: _.key,
            class: A(["bg-card flex min-w-0 flex-col gap-2 p-4 sm:p-5", g.joined ? "" : "overflow-hidden rounded-xl border"])
          }, [
            l("p", t$, c(_.label), 1),
            l("div", n$, [
              e.loading ? (t(), D(Pe, {
                key: 0,
                variant: "number"
              })) : u(_) ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "hover:bg-muted/60 -mx-1 flex items-center gap-1.5 rounded px-1 py-1 transition-colors",
                "aria-label": `${_.label} hidden. Show it.`,
                title: `Show ${_.label}`,
                onClick: (T) => C(_)
              }, [
                (t(), n(z, null, j(5, (T) => l("span", {
                  key: T,
                  class: "bg-muted-foreground/70 size-1.5 rounded-full"
                })), 64))
              ], 8, a$)) : d(_) ? (t(), n("button", {
                key: 2,
                type: "button",
                class: "hover:bg-muted/60 -mx-1 truncate rounded px-1 text-2xl font-semibold tabular-nums transition-colors",
                "aria-label": `${_.label}, ${B(_.value)}. Hide it.`,
                title: `Hide ${_.label}`,
                onClick: (T) => C(_)
              }, c(B(_.value)), 9, l$)) : (t(), n("span", o$, c(B(_.value)), 1)),
              _.trend && !e.loading && !u(_) ? (t(), D(da, {
                key: 4,
                direction: _.trend.direction,
                percentage: _.trend.percentage,
                inverted: _.inverted,
                class: "ml-2 shrink-0"
              }, null, 8, ["direction", "percentage", "inverted"])) : b("", !0)
            ]),
            _.sparkline?.length && !e.loading && !u(_) ? (t(), D(Ot, {
              key: 0,
              data: _.sparkline,
              height: 24
            }, null, 8, ["data"])) : b("", !0),
            _.caption || _.comparison && _.trend ? (t(), n("p", s$, c(_.caption ?? _.comparison), 1)) : b("", !0)
          ], 2))), 128))
        ], 2)
      ], 10, Q2))), 128))
    ], 8, Y2));
  }
}), r$ = ["aria-label"], i$ = { class: "flex items-center justify-between gap-3" }, d$ = ["aria-valuenow", "aria-label"], u$ = { class: "flex items-center gap-3" }, c$ = { class: "min-w-0 flex-1 text-sm" }, f$ = { class: "font-medium" }, m$ = {
  key: 0,
  class: "text-muted-foreground mt-0.5 block text-xs sm:mt-0 sm:inline sm:before:content-[':_']"
}, p$ = {
  key: 1,
  class: "flex flex-col gap-3 rounded-lg border bg-card p-4"
}, v$ = { class: "flex items-center justify-between gap-2" }, g$ = { class: "text-sm font-semibold" }, h$ = { class: "flex items-center gap-3" }, b$ = ["href"], y$ = {
  key: 0,
  class: "flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3"
}, x$ = { class: "flex min-w-0 flex-col gap-0.5" }, k$ = { class: "text-sm font-medium" }, $$ = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, w$ = {
  key: 1,
  class: "flex flex-col gap-2"
}, C$ = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-3.5",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, S$ = { class: "flex min-w-0 flex-1 flex-col gap-0.5" }, M$ = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, iS = /* @__PURE__ */ L({
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
    const a = e, r = o, s = y(() => a.items.find((k) => !k.done) ?? null), i = y(() => a.items.filter((k) => k.key !== s.value?.key)), d = y(() => a.items.length), u = y(() => a.items.filter((k) => k.done).length), f = y(
      () => d.value > 0 ? Math.round(u.value / d.value * 100) : 0
    ), v = y(() => {
      const k = a.linkComponent;
      return typeof k == "string" ? k : xa(k);
    }), p = Ye({
      variant: "default",
      size: "sm",
      class: "no-underline mt-2 self-start"
    }), h = Ye({
      variant: "default",
      size: "sm",
      class: "no-underline shrink-0"
    }), $ = Ye({
      variant: "outline",
      size: "sm",
      class: "no-underline shrink-0"
    });
    return (k, S) => e.items.length && e.variant === "onboarding" ? (t(), n("section", {
      key: 0,
      class: "flex flex-col gap-2.5 rounded-md border bg-card p-3",
      "aria-label": e.heading
    }, [
      l("div", i$, [
        l("div", {
          class: "flex flex-1 items-center gap-1",
          role: "progressbar",
          "aria-valuenow": f.value,
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          "aria-label": `${e.heading}, ${f.value} percent complete`
        }, [
          (t(!0), n(z, null, j(e.items, (w, C) => (t(), n("span", {
            key: w.key,
            class: A(["h-1.5 flex-1 rounded-sm transition-colors duration-300", C < u.value ? "bg-amber-500" : "bg-muted"])
          }, null, 2))), 128))
        ], 8, d$),
        e.skipLabel ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline",
          onClick: S[0] || (S[0] = (w) => r("skip"))
        }, c(e.skipLabel), 1)) : b("", !0)
      ]),
      l("div", u$, [
        l("p", c$, [
          l("span", f$, c(s.value ? s.value.title : e.heading), 1),
          s.value?.detail ? (t(), n("span", m$, c(s.value.detail), 1)) : b("", !0)
        ]),
        s.value?.href ? (t(), D(Ce(v.value), {
          key: 0,
          href: s.value.href,
          class: A(x(h))
        }, {
          default: O(() => [
            U(c(s.value.actionLabel || "Open"), 1)
          ]),
          _: 1
        }, 8, ["href", "class"])) : b("", !0)
      ])
    ], 8, r$)) : e.items.length ? (t(), n("section", p$, [
      l("div", v$, [
        l("h2", g$, c(e.heading), 1),
        l("div", h$, [
          e.skipLabel ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-xs text-muted-foreground font-normal hover:text-foreground hover:underline",
            onClick: S[1] || (S[1] = (w) => r("skip"))
          }, c(e.skipLabel), 1)) : b("", !0),
          e.reportHref ? (t(), n("a", {
            key: 1,
            href: e.reportHref,
            class: "text-xs text-muted-foreground font-normal hover:text-foreground hover:underline"
          }, " Full report ", 8, b$)) : b("", !0)
        ])
      ]),
      s.value ? (t(), n("div", y$, [
        S[2] || (S[2] = l("span", {
          class: "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-500",
          "aria-hidden": "true"
        }, null, -1)),
        l("div", x$, [
          l("p", k$, c(s.value.title), 1),
          s.value.detail ? (t(), n("p", $$, c(s.value.detail), 1)) : b("", !0),
          s.value.href ? (t(), D(Ce(v.value), {
            key: 1,
            href: s.value.href,
            class: A(x(p))
          }, {
            default: O(() => [
              U(c(s.value.actionLabel || "Open"), 1)
            ]),
            _: 1
          }, 8, ["href", "class"])) : b("", !0)
        ])
      ])) : b("", !0),
      i.value.length ? (t(), n("ul", w$, [
        (t(!0), n(z, null, j(i.value, (w) => (t(), n("li", {
          key: w.key,
          class: "flex items-start gap-3"
        }, [
          l("span", {
            class: A([
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
              w.done ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "border-2 border-amber-500"
            ]),
            "aria-hidden": "true"
          }, [
            w.done ? (t(), n("svg", C$, [...S[3] || (S[3] = [
              l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
            ])])) : b("", !0)
          ], 2),
          l("div", S$, [
            l("p", {
              class: A(["text-sm", w.done ? "text-muted-foreground line-through" : "font-medium"])
            }, c(w.title), 3),
            !w.done && w.detail ? (t(), n("p", M$, c(w.detail), 1)) : b("", !0)
          ]),
          !w.done && w.href ? (t(), D(Ce(v.value), {
            key: 0,
            href: w.href,
            class: A(x($))
          }, {
            default: O(() => [
              U(c(w.actionLabel || "Open"), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"])) : b("", !0)
        ]))), 128))
      ])) : b("", !0)
    ])) : b("", !0);
  }
}), B$ = {
  class: "flex flex-wrap items-center gap-3 text-sm",
  role: "status"
}, A$ = { class: "hidden items-center gap-2 md:flex" }, _$ = { class: "md:hidden" }, z$ = { class: "border-b px-4 py-3" }, P$ = { class: "text-muted-foreground text-xs font-normal" }, L$ = { class: "flex flex-col gap-2 overflow-y-auto p-4" }, O$ = { class: "font-medium tabular-nums" }, j$ = { class: "ml-auto flex items-center gap-3" }, dS = /* @__PURE__ */ L({
  __name: "SelectionBar",
  props: {
    count: {},
    allMatching: { type: Boolean },
    total: {}
  },
  emits: ["select-all-matching", "clear"],
  setup(e, { emit: o }) {
    const a = o, r = H(!1), s = (i) => new Intl.NumberFormat().format(i);
    return (i, d) => (t(), n("div", B$, [
      l("div", A$, [
        q(i.$slots, "actions")
      ]),
      l("div", _$, [
        l("button", {
          type: "button",
          dusk: "mobile-bulk-actions",
          class: "border-input bg-background hover:bg-accent inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium",
          onClick: d[0] || (d[0] = (u) => r.value = !0)
        }, " Actions "),
        I(sn, {
          open: r.value,
          "onUpdate:open": d[1] || (d[1] = (u) => r.value = u)
        }, {
          default: O(() => [
            I(rn, {
              side: "bottom",
              class: "max-h-[70vh] gap-0 overflow-hidden p-0"
            }, {
              default: O(() => [
                l("div", z$, [
                  d[4] || (d[4] = l("p", { class: "text-sm font-semibold" }, "Bulk actions", -1)),
                  l("p", P$, c(e.allMatching ? "All matching records" : `${s(e.count)} selected`), 1)
                ]),
                l("div", L$, [
                  q(i.$slots, "actions")
                ])
              ]),
              _: 3
            })
          ]),
          _: 3
        }, 8, ["open"])
      ]),
      l("span", O$, [
        e.allMatching ? (t(), n(z, { key: 0 }, [
          U(" All " + c(e.total !== void 0 ? s(e.total) : "") + " records selected ", 1)
        ], 64)) : (t(), n(z, { key: 1 }, [
          U(c(s(e.count)) + " records selected", 1)
        ], 64))
      ]),
      l("div", j$, [
        !e.allMatching && e.total !== void 0 && e.total > e.count ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-primary text-xs font-medium hover:underline",
          onClick: d[2] || (d[2] = (u) => a("select-all-matching"))
        }, " Select all " + c(s(e.total)), 1)) : b("", !0),
        l("button", {
          type: "button",
          class: "text-destructive text-xs font-medium hover:underline",
          onClick: d[3] || (d[3] = (u) => a("clear"))
        }, " Deselect all ")
      ])
    ]));
  }
}), V$ = { class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, D$ = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, T$ = {
  key: 0,
  class: "text-muted-foreground flex items-center gap-2 text-xs"
}, I$ = ["value"], E$ = ["value"], F$ = {
  class: "flex items-center gap-1",
  "aria-label": "Pagination"
}, N$ = ["disabled"], R$ = ["disabled"], U$ = {
  class: "bg-primary/10 text-primary inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-sm font-medium tabular-nums",
  "aria-current": "page"
}, H$ = {
  key: 0,
  class: "text-muted-foreground px-1 text-xs tabular-nums"
}, q$ = ["disabled"], uS = /* @__PURE__ */ L({
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
    return (f, v) => (t(), n("div", V$, [
      l("p", D$, [
        U(" Showing " + c(s(i.value)) + "-" + c(s(d.value)) + " ", 1),
        e.total !== void 0 ? (t(), n(z, { key: 0 }, [
          U("of " + c(s(e.total)), 1)
        ], 64)) : b("", !0)
      ]),
      e.perPageOptions.length > 1 ? (t(), n("label", T$, [
        v[4] || (v[4] = l("span", null, "Per page", -1)),
        l("select", {
          value: e.perPage,
          class: "border-input bg-background text-foreground h-8 rounded-md border px-2 text-xs",
          onChange: v[0] || (v[0] = (p) => r("update:perPage", Number(p.target.value)))
        }, [
          (t(!0), n(z, null, j(e.perPageOptions, (p) => (t(), n("option", {
            key: p,
            value: p
          }, c(p), 9, E$))), 128))
        ], 40, I$)
      ])) : b("", !0),
      l("nav", F$, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30",
          disabled: !e.hasPrevious || e.loading,
          "aria-label": "First page",
          title: "First page",
          onClick: v[1] || (v[1] = (p) => r("first"))
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
        ])], 8, N$),
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30",
          disabled: !e.hasPrevious || e.loading,
          "aria-label": "Previous page",
          title: "Previous page",
          onClick: v[2] || (v[2] = (p) => r("previous"))
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
        ])], 8, R$),
        l("span", U$, c(e.page), 1),
        u.value !== null ? (t(), n("span", H$, " of " + c(s(u.value)), 1)) : b("", !0),
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-30",
          disabled: !e.hasNext || e.loading,
          "aria-label": "Next page",
          title: "Next page",
          onClick: v[3] || (v[3] = (p) => r("next"))
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
        ])], 8, q$)
      ])
    ]));
  }
}), K$ = { class: "pk-tabs bg-muted/40 flex w-fit max-w-full shrink-0 items-center gap-0.5 overflow-x-auto rounded-lg p-1" }, G$ = ["aria-current"], W$ = ["title"], Z$ = ["aria-current", "onClick"], J$ = ["title"], Y$ = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("div", K$, [
      l("button", {
        type: "button",
        class: A([
          "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm capitalize transition-colors",
          e.active === null ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
        ]),
        "aria-current": e.active === null ? "page" : void 0,
        onClick: i[0] || (i[0] = (d) => a("select", null))
      }, [
        i[1] || (i[1] = U(" All ", -1)),
        e.counts ? (t(), n("span", {
          key: 0,
          class: A([
            "rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums",
            e.active === null ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15"
          ]),
          title: new Intl.NumberFormat().format(e.counts.all ?? 0)
        }, c(r(e.counts.all ?? 0)), 11, W$)) : (t(), D(Pe, {
          key: 1,
          variant: "badge",
          label: "Counting"
        }))
      ], 10, G$),
      (t(!0), n(z, null, j(e.tabs, (d) => (t(), n("button", {
        key: d,
        type: "button",
        class: A([
          "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm capitalize transition-colors",
          e.active === d ? "bg-background text-foreground shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
        ]),
        "aria-current": e.active === d ? "page" : void 0,
        onClick: (u) => a("select", d)
      }, [
        U(c(d) + " ", 1),
        e.counts ? (t(), n("span", {
          key: 0,
          class: A([
            "rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums",
            e.active === d ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15"
          ]),
          title: new Intl.NumberFormat().format(e.counts[d] ?? 0)
        }, c(r(e.counts[d] ?? 0)), 11, J$)) : (t(), D(Pe, {
          key: 1,
          variant: "badge",
          label: "Counting"
        }))
      ], 10, Z$))), 128))
    ]));
  }
}), cS = /* @__PURE__ */ zt(Y$, [["__scopeId", "data-v-3967c945"]]), Q$ = { class: "group/saved relative shrink-0" }, X$ = {
  class: "pk-focus-ring inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-md border px-2.5 text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden",
  "aria-label": "Saved table views"
}, ew = {
  key: 0,
  class: "max-w-28 truncate text-xs text-foreground"
}, tw = { class: "bg-popover text-popover-foreground absolute top-full left-0 z-30 mt-2 w-72 rounded-lg border p-2 shadow-xl" }, nw = {
  key: 0,
  class: "mt-1 max-h-56 overflow-y-auto"
}, aw = ["onClick"], lw = ["aria-label", "onClick"], ow = {
  key: 1,
  class: "px-2 py-3 text-xs text-muted-foreground"
}, fS = /* @__PURE__ */ L({
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
    return (s, i) => (t(), n("details", Q$, [
      l("summary", X$, [
        i[0] || (i[0] = U(" Views ", -1)),
        e.active ? (t(), n("span", ew, c(e.active), 1)) : b("", !0),
        i[1] || (i[1] = l("span", { "aria-hidden": "true" }, "⌄", -1))
      ]),
      l("div", tw, [
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
          }, "Save", -1)
        ])], 32),
        e.views.length ? (t(), n("div", nw, [
          (t(!0), n(z, null, j(e.views, (d) => (t(), n("div", {
            key: d.name,
            class: "flex items-center gap-1 rounded-md px-1 hover:bg-muted"
          }, [
            l("button", {
              type: "button",
              class: A(["pk-focus-ring min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left text-sm", d.name === e.active ? "font-medium text-primary" : ""]),
              onClick: (u) => a("apply", d)
            }, c(d.name), 11, aw),
            l("button", {
              type: "button",
              class: "pk-focus-ring rounded px-2 py-1 text-xs text-muted-foreground hover:text-destructive",
              "aria-label": `Delete saved view ${d.name}`,
              onClick: (u) => a("remove", d.name)
            }, "×", 8, lw)
          ]))), 128))
        ])) : (t(), n("p", ow, "Save filters, columns, and layout for quick reuse."))
      ])
    ]));
  }
}), sw = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, rw = { class: "grid gap-2" }, iw = {
  key: 0,
  class: "text-destructive text-sm"
}, dw = { class: "flex gap-2" }, mS = /* @__PURE__ */ L({
  __name: "PkPasskeyRegister",
  emits: ["success"],
  setup(e, { emit: o }) {
    const a = o, s = H((() => {
      const $ = navigator.userAgent, k = [
        { pattern: /Edg|Edge/, name: "Edge" },
        { pattern: /OPR|Opera|OPiOS/, name: "Opera" },
        { pattern: /Firefox|FxiOS/, name: "Firefox" },
        { pattern: /Chrome|CriOS/, name: "Chrome" },
        { pattern: /Safari/, name: "Safari" }
      ].find(({ pattern: w }) => w.test($))?.name, S = [
        { pattern: /iPhone/, name: "iPhone" },
        { pattern: /iPad|Macintosh(?=.*Mobile)/, name: "iPad" },
        { pattern: /Android/, name: "Android" },
        { pattern: /Mac/, name: "Mac" },
        { pattern: /Windows/, name: "Windows" }
      ].find(({ pattern: w }) => w.test($))?.name;
      return [k, S].filter(Boolean).join(" on ") || "";
    })()), i = H(!1), d = ka(null), u = y(() => d.value?.isLoading.value ?? !1), f = y(() => d.value?.error.value ?? null), v = y(() => d.value?.isSupported.value ?? !1);
    be(async () => {
      try {
        const { usePasskeyRegister: $ } = await import("@laravel/passkeys/vue");
        d.value = $({
          onSuccess: () => {
            s.value = "", i.value = !1, a("success");
          }
        });
      } catch {
        d.value = null;
      }
    });
    const p = async ($) => {
      $.preventDefault(), !(!s.value.trim() || d.value === null) && await d.value.register(s.value);
    }, h = () => {
      i.value = !1, s.value = "";
    };
    return ($, k) => v.value ? i.value ? (t(), n("form", {
      key: 2,
      class: "border-border bg-muted/50 space-y-4 rounded-lg border p-4",
      onSubmit: p
    }, [
      l("div", rw, [
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
          [_e, s.value]
        ]),
        k[4] || (k[4] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " A name helps you identify this passkey later. ", -1))
      ]),
      f.value ? (t(), n("p", iw, c(f.value), 1)) : b("", !0),
      l("div", dw, [
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
          default: O(() => [...k[5] || (k[5] = [
            U(" Cancel ", -1)
          ])]),
          _: 1
        })
      ])
    ], 32)) : (t(), D(ce, {
      key: 1,
      variant: "outline",
      onClick: k[0] || (k[0] = (S) => i.value = !0)
    }, {
      default: O(() => [...k[2] || (k[2] = [
        U(" Add passkey ", -1)
      ])]),
      _: 1
    })) : (t(), n("p", sw, " Passkeys are not supported in this browser. "));
  }
}), uw = { class: "pk-form-stack" }, cw = {
  key: 0,
  class: "border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm",
  role: "alert"
}, pS = /* @__PURE__ */ L({
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
        return (v, p) => a.upload(f, v, p);
    }
    return (f, v) => (t(), n("div", uw, [
      d.value ? (t(), n("p", cw, c(d.value), 1)) : b("", !0),
      s.value ? (t(!0), n(z, { key: 1 }, j(e.nodes, (p, h) => (t(), D(Gn, {
        key: h,
        node: p,
        values: e.modelValue,
        errors: e.errors,
        options: e.options,
        processing: e.processing,
        "search-options": e.searchOptions,
        upload: e.upload,
        discard: e.discard,
        onChange: v[0] || (v[0] = ($, k) => r("change", $, k)),
        onAffixAction: v[1] || (v[1] = ($, k) => r("affix-action", $, k))
      }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard"]))), 128)) : (t(), n("div", {
        key: 2,
        class: A(["grid grid-cols-1 gap-4", i.value])
      }, [
        (t(!0), n(z, null, j(e.fields, (p) => (t(), n("div", {
          key: p.key,
          class: A(p.span && p.span >= 2 ? "sm:col-span-2" : "")
        }, [
          I(Ge, {
            field: p,
            value: e.modelValue[p.key],
            error: e.errors[p.key],
            errors: e.errors,
            options: e.options[p.key],
            "child-options": e.options,
            processing: e.processing,
            "search-options": p.searchable && e.searchOptions ? (h) => e.searchOptions(p.key, h) : void 0,
            upload: u(p.key),
            discard: e.discard,
            onChange: (h) => r("change", p.key, h),
            onAffixAction: (h) => r("affix-action", p.key, h)
          }, null, 8, ["field", "value", "error", "errors", "options", "child-options", "processing", "search-options", "upload", "discard", "onChange", "onAffixAction"])
        ], 2))), 128))
      ], 2))
    ]));
  }
}), fw = { class: "min-w-0 flex-1 truncate text-sm font-medium" }, mw = ["disabled"], pw = ["disabled"], vw = ["disabled"], gw = ["disabled"], vS = /* @__PURE__ */ L({
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
    const o = H(!1);
    be(() => {
      o.value = !!document.getElementById("pk-main");
    });
    const a = y(() => o.value ? "#pk-main" : "body"), r = y(() => !o.value), s = y(
      () => o.value ? "pointer-events-none fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 px-3 pb-3 sm:bottom-0 sm:px-4 sm:pb-4" : "pointer-events-none sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 px-3 pb-3 sm:bottom-0 sm:px-4 sm:pb-4"
    ), i = { opacity: "0", transform: "translateY(0.75rem)" }, d = { opacity: "1", transform: "translateY(0)" };
    function u(v, p) {
      const h = v;
      Object.assign(h.style, i, { transition: "none" }), requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          h.style.transition = "opacity 200ms ease-out, transform 200ms ease-out", Object.assign(h.style, d);
        });
      }), setTimeout(p, 200);
    }
    function f(v, p) {
      const h = v;
      Object.assign(h.style, d, {
        transition: "opacity 150ms ease-in, transform 150ms ease-in"
      }), requestAnimationFrame(() => {
        Object.assign(h.style, i);
      }), setTimeout(p, 150);
    }
    return (v, p) => (t(), D(mt, {
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
            class: A(s.value),
            role: "status",
            "aria-live": "polite",
            "data-slot": "unsaved-bar"
          }, [
            l("div", {
              class: A([
                x(ho),
                "pointer-events-auto flex items-center gap-3 rounded-xl border bg-card/95 py-2.5 pr-2.5 pl-4 shadow-md ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10"
              ])
            }, [
              p[4] || (p[4] = l("span", {
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
              l("span", fw, c(e.message), 1),
              e.discardLabel ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "hover:bg-muted rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: p[0] || (p[0] = (h) => v.$emit("discard"))
              }, c(e.discardLabel), 9, mw)) : b("", !0),
              l("button", {
                type: "button",
                class: "bg-muted hover:bg-muted/70 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: p[1] || (p[1] = (h) => v.$emit("cancel"))
              }, c(e.cancelLabel), 9, pw),
              e.extraLabel ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "hover:bg-muted rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: p[2] || (p[2] = (h) => v.$emit("extra"))
              }, c(e.extraLabel), 9, vw)) : b("", !0),
              l("button", {
                type: "button",
                class: "bg-primary text-primary-foreground rounded-md px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50",
                disabled: e.processing,
                onClick: p[3] || (p[3] = (h) => v.$emit("save"))
              }, c(e.processing ? "Saving…" : e.saveLabel), 9, gw)
            ], 2)
          ], 2)) : b("", !0)
        ]),
        _: 1
      })
    ], 8, ["to", "disabled"]));
  }
});
function gS(e, o = {}) {
  const { warnOnUnload: a = !0 } = o, r = H(Et(e.value)), s = y(() => Et(e.value) !== r.value);
  function i() {
    r.value = Et(e.value);
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
function Et(e) {
  return JSON.stringify(e, (o, a) => a === void 0 ? null : a === null || typeof a != "object" || Array.isArray(a) ? a : Object.fromEntries(
    Object.entries(a).sort(([r], [s]) => r.localeCompare(s))
  ));
}
const bt = /* @__PURE__ */ new Map();
function hS(e, o) {
  bt.set(e, o);
}
function hw(e) {
  return bt.get(e);
}
function bS(e) {
  return bt.has(e);
}
function bw() {
  return [...bt.keys()].sort();
}
function yS() {
  bt.clear();
}
const yw = {
  key: 0,
  class: "flex flex-col gap-1"
}, xw = { class: "text-muted-foreground text-[11px] font-medium tracking-wide uppercase" }, kw = { class: "text-foreground text-sm font-medium" }, $w = {
  key: 1,
  class: "text-muted-foreground font-normal"
}, ww = {
  key: 5,
  class: "max-w-full font-normal"
}, Cw = {
  key: 0,
  class: "text-muted-foreground mb-1 font-mono text-[10px] uppercase"
}, Sw = { class: "bg-muted/50 overflow-x-auto rounded-md border p-3 font-mono text-xs font-normal" }, Mw = {
  key: 6,
  class: "font-normal"
}, Bw = {
  key: 0,
  class: "divide-y rounded-md border"
}, Aw = { class: "text-muted-foreground truncate font-medium" }, _w = { class: "text-foreground col-span-2 break-words" }, zw = {
  key: 1,
  class: "text-muted-foreground font-normal"
}, Pw = {
  key: 7,
  class: "flex flex-col gap-3 font-normal"
}, Lw = {
  key: 0,
  class: "text-muted-foreground font-normal"
}, Ow = {
  key: 10,
  class: "text-destructive text-xs font-normal",
  "data-testid": "missing-entry-view"
}, jw = ["href"], Vw = { class: "flex min-w-0 items-start gap-2.5" }, Dw = {
  key: 0,
  class: "bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
  "aria-hidden": "true"
}, Tw = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "size-3.5"
}, Iw = ["d"], Ew = { class: "min-w-0" }, Fw = { class: "flex flex-wrap items-center gap-2" }, Nw = { class: "text-sm font-semibold" }, Rw = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, Uw = ["onClick"], xS = /* @__PURE__ */ L({
  __name: "InfoNode",
  props: {
    node: {},
    record: {},
    depth: { default: 0 }
  },
  emits: ["action"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = H(!a.node.collapsed), i = H(0), d = y(() => a.depth === 0), u = y(() => {
      const C = a.node.columns ?? (a.node.component === "section" ? 2 : 1);
      return C >= 3 ? "sm:grid-cols-3" : C === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
    }), f = {
      date: { year: "numeric", month: "long", day: "numeric" },
      datetime: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    }, v = y(() => a.node.key ? a.record[a.node.key] : null), p = y(() => {
      const C = v.value;
      return C == null || C === "";
    }), h = y(() => {
      if (p.value)
        return "None";
      const C = Number(v.value);
      if (Number.isNaN(C))
        return "None";
      const B = a.node.divideBy ?? 100, M = C / B, m = a.node.currency ?? "USD";
      try {
        return new Intl.NumberFormat(void 0, { style: "currency", currency: m }).format(M);
      } catch {
        return `${m} ${M.toFixed(2)}`;
      }
    }), $ = y(() => {
      if (p.value)
        return "None";
      const C = v.value;
      if (a.node.type === "date" || a.node.type === "datetime")
        return new Date(String(C)).toLocaleDateString(void 0, f[a.node.type]);
      if (a.node.type === "money")
        return h.value;
      let B = String(C);
      return a.node.transform === "upper" && (B = B.toUpperCase()), a.node.transform === "lower" && (B = B.toLowerCase()), [a.node.prefix, B, a.node.suffix].filter(Boolean).join(" ");
    }), k = y(() => {
      const C = typeof v.value == "boolean" ? v.value ? "1" : "" : String(v.value), B = a.node.colors?.[C] ?? a.node.defaultColor ?? "neutral";
      return dn[B] ?? "outline";
    }), S = y(() => {
      const C = typeof a.node.view == "string" ? a.node.view : "";
      return C ? hw(C) : void 0;
    }), w = y(() => {
      const C = typeof a.node.view == "string" ? a.node.view : "";
      if (!C)
        return "ViewEntry has no view name.";
      const B = bw(), M = B.length > 0 ? B.join(", ") : "(none)";
      return `No entry view for [${C}]; registered: ${M}`;
    });
    return (C, B) => {
      const M = Qt("InfoNode", !0);
      return e.node.component === "entry" ? (t(), n("div", yw, [
        l("dt", xw, c(e.node.label), 1),
        l("dd", kw, [
          e.node.type === "badge" && x(Vu)(v.value) ? (t(), D(We, {
            key: 0,
            variant: k.value,
            class: "capitalize"
          }, {
            default: O(() => [
              U(c(v.value), 1)
            ]),
            _: 1
          }, 8, ["variant"])) : e.node.type === "badge" ? (t(), n("span", $w, "None")) : e.node.type === "icon" ? (t(), D(iu, {
            key: 2,
            value: v.value,
            icons: e.node.icons,
            colors: e.node.colors,
            labels: e.node.labels,
            "default-icon": e.node.defaultIcon
          }, null, 8, ["value", "icons", "colors", "labels", "default-icon"])) : e.node.type === "image" ? (t(), D(mu, {
            key: 3,
            src: v.value,
            "fallback-text": e.record[e.node.fallbackFrom ?? "name"],
            rounded: e.node.rounded !== !1,
            size: e.node.size ?? "md",
            fallback: e.node.fallback ?? "initials"
          }, null, 8, ["src", "fallback-text", "rounded", "size", "fallback"])) : e.node.type === "color" || e.node.type === "colour" ? (t(), D(bu, {
            key: 4,
            value: typeof v.value == "string" ? v.value : null,
            "show-value": e.node.showValue !== !1
          }, null, 8, ["value", "show-value"])) : e.node.type === "code" ? (t(), n("div", ww, [
            e.node.language ? (t(), n("p", Cw, c(e.node.language), 1)) : b("", !0),
            l("pre", Sw, [
              l("code", null, c(v.value ?? ""), 1)
            ])
          ])) : e.node.type === "keyvalue" ? (t(), n("div", Mw, [
            v.value && typeof v.value == "object" && !Array.isArray(v.value) && Object.keys(v.value).length ? (t(), n("dl", Bw, [
              (t(!0), n(z, null, j(v.value, (m, g) => (t(), n("div", {
                key: g,
                class: "grid grid-cols-3 gap-2 px-3 py-2 text-sm"
              }, [
                l("dt", Aw, c(g), 1),
                l("dd", _w, c(m), 1)
              ]))), 128))
            ])) : (t(), n("span", zw, "None"))
          ])) : e.node.type === "repeatable" ? (t(), n("div", Pw, [
            (t(!0), n(z, null, j(Array.isArray(v.value) ? v.value : [], (m, g) => (t(), n("div", {
              key: g,
              class: "rounded-md border p-3"
            }, [
              (t(!0), n(z, null, j(e.node.entries ?? [], (_, T) => (t(), D(M, {
                key: T,
                node: _,
                record: m,
                depth: e.depth + 1,
                onAction: B[0] || (B[0] = (F) => r("action", F))
              }, null, 8, ["node", "record", "depth"]))), 128))
            ]))), 128)),
            !Array.isArray(v.value) || v.value.length === 0 ? (t(), n("span", Lw, "None")) : b("", !0)
          ])) : e.node.type === "money" ? (t(), n("span", {
            key: 8,
            class: A(p.value ? "text-muted-foreground font-normal" : "")
          }, c(h.value), 3)) : e.node.type === "view" && S.value ? (t(), D(Ce(S.value), {
            key: 9,
            node: e.node,
            record: e.record,
            value: v.value
          }, null, 8, ["node", "record", "value"])) : e.node.type === "view" ? (t(), n("p", Ow, c(w.value), 1)) : e.node.url && !p.value ? (t(), n("a", {
            key: 11,
            href: e.node.url,
            class: "text-foreground font-medium underline-offset-2 hover:underline"
          }, c($.value), 9, jw)) : (t(), n("span", {
            key: 12,
            class: A([
              p.value || e.node.muted ? "text-muted-foreground font-normal" : "",
              e.node.mono ? "font-mono text-xs" : ""
            ])
          }, c($.value), 3)),
          e.node.action ? (t(), n("button", {
            key: 13,
            type: "button",
            class: "text-muted-foreground hover:text-foreground mt-0.5 text-xs font-normal underline-offset-2 hover:underline",
            onClick: B[1] || (B[1] = (m) => r("action", e.node.action))
          }, c(e.node.action.label), 1)) : b("", !0)
        ])
      ])) : e.node.component === "section" ? (t(), n("section", {
        key: 1,
        class: A(
          d.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("header", {
          class: A(["flex items-start justify-between gap-3", [
            d.value ? "px-4 py-3.5 sm:px-5" : "pb-2",
            e.node.collapsible ? "cursor-pointer select-none" : ""
          ]]),
          onClick: B[2] || (B[2] = (m) => e.node.collapsible && (s.value = !s.value))
        }, [
          l("div", Vw, [
            e.node.icon ? (t(), n("div", Dw, [
              (t(), n("svg", Tw, [
                l("path", {
                  d: x(me)(e.node.icon)
                }, null, 8, Iw)
              ]))
            ])) : b("", !0),
            l("div", Ew, [
              l("div", Fw, [
                l("h3", Nw, c(e.node.label), 1),
                e.node.status ? (t(), D($e, {
                  key: 0,
                  status: e.node.status,
                  class: "capitalize"
                }, null, 8, ["status"])) : b("", !0)
              ]),
              e.node.description ? (t(), n("p", Rw, c(e.node.description), 1)) : b("", !0)
            ])
          ])
        ], 2),
        s.value ? (t(), n("dl", {
          key: 0,
          class: A(["grid grid-cols-1 gap-x-6 gap-y-4", [u.value, d.value ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""]])
        }, [
          (t(!0), n(z, null, j(e.node.children ?? [], (m, g) => (t(), D(M, {
            key: g,
            node: m,
            record: e.record,
            depth: e.depth + 1,
            onAction: B[3] || (B[3] = (_) => r("action", _))
          }, null, 8, ["node", "record", "depth"]))), 128))
        ], 2)) : b("", !0)
      ], 2)) : e.node.component === "grid" ? (t(), n("dl", {
        key: 2,
        class: A(["grid grid-cols-1 gap-x-6 gap-y-4", u.value])
      }, [
        (t(!0), n(z, null, j(e.node.children ?? [], (m, g) => (t(), D(M, {
          key: g,
          node: m,
          record: e.record,
          depth: e.depth + 1,
          onAction: B[4] || (B[4] = (_) => r("action", _))
        }, null, 8, ["node", "record", "depth"]))), 128))
      ], 2)) : e.node.component === "tabs" ? (t(), n("div", {
        key: 3,
        class: A(
          d.value ? "bg-card overflow-hidden rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("div", {
          class: A(["bg-muted/30 flex gap-1 overflow-x-auto p-1", d.value ? "border-b" : "rounded-md"])
        }, [
          (t(!0), n(z, null, j(e.node.children ?? [], (m, g) => (t(), n("button", {
            key: g,
            type: "button",
            class: A([
              "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors",
              i.value === g ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
            ]),
            onClick: (_) => i.value = g
          }, c(m.label), 11, Uw))), 128))
        ], 2),
        (t(!0), n(z, null, j(e.node.children ?? [], (m, g) => ge((t(), n("div", {
          key: g,
          class: A(["flex flex-col gap-5", d.value ? "p-4 sm:p-5" : "pt-4"])
        }, [
          (t(!0), n(z, null, j(m.children ?? [], (_, T) => (t(), D(M, {
            key: T,
            node: _,
            record: e.record,
            depth: e.depth + 1,
            onAction: B[5] || (B[5] = (F) => r("action", F))
          }, null, 8, ["node", "record", "depth"]))), 128))
        ], 2)), [
          [qe, i.value === g]
        ])), 128))
      ], 2)) : b("", !0);
    };
  }
}), Hw = { class: "text-muted-foreground text-sm font-normal" }, qw = { class: "flex items-start gap-3" }, Kw = { class: "min-w-0 flex-1" }, Gw = { class: "flex flex-wrap items-center gap-2" }, Ww = { class: "truncate text-sm font-medium" }, Zw = { class: "text-muted-foreground mt-0.5 text-xs" }, Jw = { class: "text-muted-foreground text-xs font-normal" }, Yw = { class: "mt-auto flex items-center gap-2" }, Qw = /* @__PURE__ */ L({
  __name: "PaymentGateways",
  props: {
    gateways: {}
  },
  emits: ["configure", "toggle"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = y(() => a.gateways.filter((i) => i.connected).length);
    return (i, d) => (t(), n("div", {
      class: A(["flex flex-col gap-4", x(aa)]),
      "data-slot": "payment-gateways"
    }, [
      l("p", Hw, c(s.value) + " of " + c(e.gateways.length) + " connected, showcase only, no live processors. ", 1),
      l("div", {
        class: A(x(nm))
      }, [
        (t(!0), n(z, null, j(e.gateways, (u) => (t(), n("article", {
          key: u.key,
          class: "bg-background flex flex-col gap-4 rounded-lg border p-4"
        }, [
          l("div", qw, [
            l("span", {
              class: "flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white",
              style: ie({ background: u.color }),
              "aria-hidden": "true"
            }, c(u.mark), 5),
            l("div", Kw, [
              l("div", Gw, [
                l("h3", Ww, c(u.label), 1),
                I($e, {
                  status: u.connected ? "connected" : "disconnected"
                }, {
                  default: O(() => [
                    U(c(u.connected ? "Connected" : "Not connected"), 1)
                  ]),
                  _: 2
                }, 1032, ["status"]),
                u.connected && u.enabled !== !1 ? (t(), D($e, {
                  key: 0,
                  status: "offered"
                }, {
                  default: O(() => [...d[0] || (d[0] = [
                    U(" Offered ", -1)
                  ])]),
                  _: 1
                })) : u.connected ? (t(), D($e, {
                  key: 1,
                  status: "disabled"
                }, {
                  default: O(() => [...d[1] || (d[1] = [
                    U(" Disabled ", -1)
                  ])]),
                  _: 1
                })) : b("", !0),
                u.isDefault ? (t(), D($e, {
                  key: 2,
                  status: "default"
                }, {
                  default: O(() => [...d[2] || (d[2] = [
                    U(" Default ", -1)
                  ])]),
                  _: 1
                })) : b("", !0),
                u.connected && u.mode ? (t(), D($e, {
                  key: 3,
                  status: u.mode
                }, {
                  default: O(() => [
                    U(c(u.mode), 1)
                  ]),
                  _: 2
                }, 1032, ["status"])) : b("", !0)
              ]),
              l("p", Zw, c(u.caption), 1)
            ])
          ]),
          l("p", Jw, c(u.methods.join(" · ")), 1),
          l("div", Yw, [
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
}), Xw = { class: "flex flex-col gap-6" }, e4 = { class: "relative" }, t4 = {
  class: "text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, n4 = ["d"], a4 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, l4 = {
  key: 0,
  class: "flex flex-col gap-4"
}, o4 = { class: "flex flex-wrap items-center gap-2" }, s4 = { class: "text-muted-foreground text-sm font-normal" }, r4 = { class: "flex flex-col gap-1 text-sm" }, i4 = ["value"], d4 = {
  key: 0,
  class: "flex flex-col gap-2"
}, u4 = { class: "flex flex-wrap items-center gap-2" }, c4 = {
  key: 1,
  class: "flex items-center gap-2"
}, kS = /* @__PURE__ */ L({
  __name: "PaymentGatewaySettings",
  props: /* @__PURE__ */ Fe({
    title: { default: "Payment gateways" },
    description: { default: null },
    headingVariant: { default: "default" }
  }, {
    gateways: { default: () => [] },
    gatewaysModifiers: {}
  }),
  emits: ["update:gateways"],
  setup(e) {
    const o = pt(e, "gateways"), a = H(null), r = H(""), s = y(
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
        (w) => w.key === k ? { ...w, ...S } : w
      );
    }
    function f(k) {
      a.value = k;
    }
    function v(k) {
      const S = o.value.find((C) => C.key === k);
      if (!S)
        return;
      const w = !S.connected;
      u(k, {
        connected: w,
        mode: w ? S.mode ?? "test" : null,
        enabled: w,
        isDefault: !1
      });
    }
    function p(k, S) {
      const w = o.value.find((C) => C.key === k);
      w?.connected && u(k, { enabled: S, isDefault: S ? w.isDefault : !1 });
    }
    function h(k) {
      const S = o.value.find((w) => w.key === k);
      !S || !d(S) || (o.value = o.value.map((w) => ({
        ...w,
        isDefault: w.key === k
      })));
    }
    function $(k) {
      const S = a.value;
      !S || !o.value.find((C) => C.key === S)?.connected || u(S, { mode: k });
    }
    return (k, S) => (t(), n(z, null, [
      l("div", Xw, [
        I(Ie, {
          variant: e.headingVariant,
          title: e.title,
          description: e.description ?? void 0
        }, null, 8, ["variant", "title", "description"]),
        l("div", e4, [
          (t(), n("svg", t4, [
            l("path", {
              d: x(me)("search")
            }, null, 8, n4)
          ])),
          I(we, {
            modelValue: r.value,
            "onUpdate:modelValue": S[0] || (S[0] = (w) => r.value = w),
            type: "search",
            class: "pl-9",
            placeholder: "Search gateways…",
            "aria-label": "Search payment gateways"
          }, null, 8, ["modelValue"])
        ]),
        i.value.length > 0 ? (t(), D(Qw, {
          key: 0,
          gateways: i.value,
          onConfigure: f,
          onToggle: v
        }, null, 8, ["gateways"])) : (t(), n("p", a4, " No gateways match “" + c(r.value.trim()) + "”. ", 1))
      ]),
      I(Pt, {
        open: s.value !== null,
        title: s.value?.label ?? "Gateway",
        description: "Showcase fields only. Values are not sent anywhere.",
        size: "md",
        onClose: S[8] || (S[8] = (w) => a.value = null)
      }, {
        footer: O(() => [
          I(ce, {
            variant: "outline",
            size: "sm",
            onClick: S[6] || (S[6] = (w) => a.value = null)
          }, {
            default: O(() => [...S[21] || (S[21] = [
              U("Close", -1)
            ])]),
            _: 1
          }),
          s.value ? (t(), D(ce, {
            key: 0,
            size: "sm",
            onClick: S[7] || (S[7] = (w) => v(s.value.key))
          }, {
            default: O(() => [
              U(c(s.value.connected ? "Disconnect" : "Mark connected"), 1)
            ]),
            _: 1
          })) : b("", !0)
        ]),
        default: O(() => [
          s.value ? (t(), n("div", l4, [
            l("div", o4, [
              I($e, {
                status: s.value.connected ? "connected" : "disconnected"
              }, {
                default: O(() => [
                  U(c(s.value.connected ? "Connected" : "Not connected"), 1)
                ]),
                _: 1
              }, 8, ["status"]),
              s.value.connected && s.value.enabled !== !1 ? (t(), D($e, {
                key: 0,
                status: "offered"
              }, {
                default: O(() => [...S[9] || (S[9] = [
                  U(" Offered ", -1)
                ])]),
                _: 1
              })) : s.value.connected ? (t(), D($e, {
                key: 1,
                status: "disabled"
              }, {
                default: O(() => [...S[10] || (S[10] = [
                  U(" Disabled ", -1)
                ])]),
                _: 1
              })) : b("", !0),
              s.value.isDefault ? (t(), D($e, {
                key: 2,
                status: "default"
              }, {
                default: O(() => [...S[11] || (S[11] = [
                  U(" Default ", -1)
                ])]),
                _: 1
              })) : b("", !0),
              s.value.connected && s.value.mode ? (t(), D($e, {
                key: 3,
                status: s.value.mode
              }, {
                default: O(() => [
                  U(c(s.value.mode), 1)
                ]),
                _: 1
              }, 8, ["status"])) : b("", !0)
            ]),
            l("p", s4, c(s.value.caption), 1),
            l("label", r4, [
              S[12] || (S[12] = U(" Display name ", -1)),
              l("input", {
                class: "border-input h-9 rounded-md border bg-transparent px-3 text-sm",
                value: s.value.label,
                readonly: ""
              }, null, 8, i4)
            ]),
            S[20] || (S[20] = l("label", { class: "flex flex-col gap-1 text-sm" }, [
              U(" Merchant / till (placeholder) "),
              l("input", {
                class: "border-input h-9 rounded-md border bg-transparent px-3 text-sm",
                placeholder: "Not stored, demo field",
                autocomplete: "off"
              })
            ], -1)),
            s.value.connected ? (t(), n("div", d4, [
              S[16] || (S[16] = l("p", { class: "text-sm font-medium" }, "Checkout", -1)),
              S[17] || (S[17] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " Disabled gateways stay connected but are not offered at checkout. Only one gateway can be the default tender. ", -1)),
              l("div", u4, [
                I(ce, {
                  size: "sm",
                  variant: s.value.enabled !== !1 ? "default" : "outline",
                  onClick: S[1] || (S[1] = (w) => p(s.value.key, !0))
                }, {
                  default: O(() => [...S[13] || (S[13] = [
                    U(" Enable ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant"]),
                I(ce, {
                  size: "sm",
                  variant: s.value.enabled === !1 ? "default" : "outline",
                  onClick: S[2] || (S[2] = (w) => p(s.value.key, !1))
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
                  onClick: S[3] || (S[3] = (w) => h(s.value.key))
                }, {
                  default: O(() => [...S[15] || (S[15] = [
                    U(" Use as default ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant", "disabled"])
              ])
            ])) : b("", !0),
            s.value.connected ? (t(), n("div", c4, [
              I(ce, {
                size: "sm",
                variant: s.value.mode === "test" ? "default" : "outline",
                onClick: S[4] || (S[4] = (w) => $("test"))
              }, {
                default: O(() => [...S[18] || (S[18] = [
                  U(" Test ", -1)
                ])]),
                _: 1
              }, 8, ["variant"]),
              I(ce, {
                size: "sm",
                variant: s.value.mode === "live" ? "default" : "outline",
                onClick: S[5] || (S[5] = (w) => $("live"))
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
function $S(e) {
  const o = H(Pn(e));
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
function wS(e) {
  const o = H(Ln(e));
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
function CS(e) {
  const { config: o, rows: a, rowKey: r = "id", fetchChanges: s, onResync: i, onInsert: d } = e, u = H(
    o.driver === "none" ? "off" : "connecting"
  ), f = H(/* @__PURE__ */ new Set());
  let v = /* @__PURE__ */ new Map(), p, h, $, k = (/* @__PURE__ */ new Date()).toISOString(), S = null;
  function w(X, W) {
    v.set(X, { ...v.get(X) ?? {}, ...W }), !p && (p = setTimeout(() => {
      p = void 0, C();
    }, o.batchMs));
  }
  function C() {
    if (v.size === 0)
      return;
    const X = v;
    v = /* @__PURE__ */ new Map();
    const W = /* @__PURE__ */ new Set();
    for (const [K, N] of X) {
      const R = a.value.find((Q) => Q[r] === K);
      if (!R) {
        d?.(K, N);
        continue;
      }
      Object.assign(R, N), W.add(K);
    }
    W.size !== 0 && (f.value = /* @__PURE__ */ new Set([...f.value, ...W]), setTimeout(() => {
      const K = new Set(f.value);
      W.forEach((N) => K.delete(N)), f.value = K;
    }, 1500));
  }
  async function B() {
    if (!(!s || a.value.length === 0)) {
      $?.abort(), $ = new AbortController();
      try {
        const X = a.value.map((N) => N[r]), { records: W, at: K } = await s(X, k);
        k = K, u.value = "live";
        for (const N of W)
          w(N[r], N);
      } catch {
        u.value = "connecting";
      }
    }
  }
  function M() {
    m(), u.value = "live", h = setInterval(B, o.intervalMs);
  }
  function m() {
    clearInterval(h), h = void 0, $?.abort();
  }
  function g() {
    return window.Echo ?? null;
  }
  function _() {
    const X = g();
    if (!X || !o.channel) {
      u.value = "connecting", console.warn(
        "[alxtexhpanel] broadcast driver configured but window.Echo is unavailable."
      );
      return;
    }
    S = o.channel;
    const W = X.private(o.channel);
    for (const K of o.events)
      W.listen(K, (N) => {
        N?.[r] !== void 0 && w(N[r], N);
      });
    u.value = "live", X.connector?.pusher?.connection?.bind("connected", () => {
      u.value = "live", i?.();
    }), X.connector?.pusher?.connection?.bind("disconnected", () => {
      u.value = "connecting";
    });
  }
  function T() {
    S && (g()?.leave(S), S = null);
  }
  function F() {
    o.driver === "poll" && M(), o.driver === "broadcast" && _();
  }
  function Z() {
    m(), T(), clearTimeout(p), p = void 0, v = /* @__PURE__ */ new Map();
  }
  function G() {
    o.pauseWhenHidden && (document.hidden ? (Z(), u.value = "paused") : (k = (/* @__PURE__ */ new Date()).toISOString(), F(), i?.()));
  }
  return On() && (be(() => {
    o.driver !== "none" && (F(), o.pauseWhenHidden && document.addEventListener("visibilitychange", G));
  }), ke(() => {
    document.removeEventListener("visibilitychange", G), Z();
  })), { status: u, recentlyChanged: f, applyPatch: w, flush: C, pollOnce: B };
}
const f4 = /^[a-z0-9-]+$/, m4 = /^[a-zA-Z0-9\s.,()%#/-]+$/;
function SS(e) {
  $a(() => {
    if (typeof document > "u")
      return;
    const o = {};
    for (const [a, r] of Object.entries(e.value ?? {}))
      !f4.test(a) || typeof r != "string" || !m4.test(r) || (o[`--${a}`] = r);
    Pc(o);
  });
}
const p4 = { class: "flex items-center gap-0.5" }, v4 = /* @__PURE__ */ L({
  __name: "PkColourModePreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), n("span", p4, [
      String(e.value) === "mono" ? (t(), n(z, { key: 0 }, [
        a[0] || (a[0] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-black" }, null, -1)),
        a[1] || (a[1] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-neutral-500" }, null, -1)),
        a[2] || (a[2] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-white" }, null, -1))
      ], 64)) : (t(), n(z, { key: 1 }, [
        a[3] || (a[3] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-sky-600" }, null, -1)),
        a[4] || (a[4] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-amber-500" }, null, -1)),
        a[5] || (a[5] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-emerald-600" }, null, -1))
      ], 64))
    ]));
  }
}), g4 = /* @__PURE__ */ L({
  __name: "PkVoucherCodeBoxPreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), D(ia, {
      code: "AB-1234",
      style: ie(String(e.value)),
      compact: ""
    }, null, 8, ["style"]));
  }
}), h4 = {
  class: "flex flex-wrap gap-1.5",
  role: "listbox",
  "data-test": "icon-picker-field"
}, b4 = ["aria-selected", "disabled", "title", "onClick"], y4 = /* @__PURE__ */ L({
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
    return (u, f) => (t(), n("div", h4, [
      (t(!0), n(z, null, j(s.value, (v) => (t(), n("button", {
        key: v,
        type: "button",
        role: "option",
        class: A(["border-input hover:bg-accent inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-xs font-medium disabled:opacity-50", [
          x(Be),
          i.value === v ? "border-primary bg-primary/10 text-primary" : ""
        ]]),
        "aria-selected": i.value === v,
        disabled: e.disabled,
        title: v,
        onClick: (p) => d(v)
      }, c(v), 11, b4))), 128))
    ]));
  }
}), x4 = ["value", "placeholder", "disabled"], k4 = /* @__PURE__ */ L({
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
      class: A(["border-input bg-background h-10 w-full rounded-md border px-3 text-sm", x(Be)]),
      value: s.value,
      placeholder: e.field.placeholder ?? "+254712345678",
      disabled: e.disabled,
      "data-test": "phone-field",
      onInput: i
    }, null, 42, x4));
  }
}), $4 = ["aria-label"], w4 = ["disabled", "aria-label", "aria-pressed", "onClick"], C4 = {
  class: "size-5",
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, S4 = { key: 0 }, M4 = ["id"], B4 = ["fill"], A4 = ["disabled"], _4 = /* @__PURE__ */ L({
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
    return (v, p) => (t(), n("div", {
      class: "inline-flex items-center gap-0.5",
      role: "group",
      "aria-label": `Rating out of ${s.value}`,
      "data-test": "rating-field"
    }, [
      (t(!0), n(z, null, j(s.value, (h) => (t(), n("button", {
        key: h,
        type: "button",
        class: "rounded p-0.5 text-amber-500 transition-colors hover:text-amber-600 disabled:opacity-50",
        disabled: e.disabled,
        "aria-label": `${h} of ${s.value}`,
        "aria-pressed": d.value >= h,
        onClick: ($) => u(h)
      }, [
        (t(), n("svg", C4, [
          f(h) === "half" ? (t(), n("defs", S4, [
            l("linearGradient", {
              id: `half-${e.field.key}-${h}`,
              x1: "0",
              x2: "1",
              y1: "0",
              y2: "0"
            }, [...p[1] || (p[1] = [
              l("stop", {
                offset: "50%",
                "stop-color": "currentColor"
              }, null, -1),
              l("stop", {
                offset: "50%",
                "stop-color": "transparent",
                "stop-opacity": "1"
              }, null, -1)
            ])], 8, M4)
          ])) : b("", !0),
          l("path", {
            d: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z",
            fill: f(h) === "full" ? "currentColor" : f(h) === "half" ? `url(#half-${e.field.key}-${h})` : "none",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }, null, 8, B4)
        ]))
      ], 8, w4))), 128)),
      d.value > 0 ? (t(), n("button", {
        key: 0,
        type: "button",
        class: "text-muted-foreground ml-1 text-xs hover:text-foreground disabled:opacity-50",
        disabled: e.disabled,
        onClick: p[0] || (p[0] = (h) => u(0))
      }, " Clear ", 8, A4)) : b("", !0)
    ], 8, $4));
  }
}), z4 = { class: "flex flex-col gap-2" }, P4 = { class: "bg-card rounded-lg border p-4" }, L4 = { class: "text-muted-foreground truncate text-xs" }, O4 = { class: "flex flex-wrap gap-x-4 gap-y-1 text-xs" }, j4 = /* @__PURE__ */ L({
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
    function f(S, w) {
      return S.length <= w ? S : `${S.slice(0, w - 1).trimEnd()}…`;
    }
    const v = y(() => f(s.value, r.value.titleMax)), p = y(() => f(i.value, r.value.descriptionMax));
    function h(S, w, C) {
      return S === 0 ? { tone: "text-muted-foreground", note: "empty" } : S > C ? { tone: "text-amber-600 dark:text-amber-400", note: "truncated" } : S < w ? { tone: "text-muted-foreground", note: "short" } : { tone: "text-emerald-600 dark:text-emerald-400", note: "good" };
    }
    const $ = y(
      () => h(s.value.length, r.value.titleMin, r.value.titleMax)
    ), k = y(
      () => h(i.value.length, r.value.descriptionMin, r.value.descriptionMax)
    );
    return (S, w) => (t(), n("div", z4, [
      l("div", P4, [
        l("p", L4, c(u.value), 1),
        l("p", {
          class: A(["mt-1 truncate text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]", v.value === "" ? "text-muted-foreground italic" : ""])
        }, c(v.value || "Untitled page"), 3),
        l("p", {
          class: A(["text-muted-foreground mt-1 line-clamp-2 text-sm", p.value === "" ? "italic" : ""])
        }, c(p.value || "No description. The engine writes its own from the page text, which is usually a mid-sentence fragment."), 3)
      ]),
      l("div", O4, [
        l("span", {
          class: A($.value.tone)
        }, " Title " + c(s.value.length) + "/" + c(r.value.titleMax) + " · " + c($.value.note), 3),
        l("span", {
          class: A(k.value.tone)
        }, " Description " + c(i.value.length) + "/" + c(r.value.descriptionMax) + " · " + c(k.value.note), 3)
      ]),
      w[0] || (w[0] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " An approximation. Engines measure pixel width rather than characters, and may rewrite a title they judge unhelpful. ", -1))
    ]));
  }
}), V4 = {
  class: "relative",
  "data-test": "tree-select-field"
}, D4 = ["disabled"], T4 = {
  key: 0,
  class: "bg-popover absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-md border p-1 shadow-md"
}, I4 = ["onClick"], E4 = ["onClick"], F4 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PkTreeSelect",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = H(""), i = H(!1), d = y(() => a.field.options ?? []);
    function u(h, $) {
      return !$ || h.label.toLowerCase().includes($) ? !0 : (h.children ?? []).some((k) => u(k, $));
    }
    const f = y(() => {
      const h = s.value.trim().toLowerCase();
      return h ? d.value.filter(($) => u($, h)) : d.value;
    }), v = y(() => {
      const h = ($) => {
        for (const k of $) {
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
    function p(h) {
      a.disabled || (r("update:modelValue", h), i.value = !1);
    }
    return (h, $) => (t(), n("div", V4, [
      l("button", {
        type: "button",
        class: A(["border-input bg-background flex h-10 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50", x(Be)]),
        disabled: e.disabled,
        onClick: $[0] || ($[0] = (k) => i.value = !i.value)
      }, [
        l("span", {
          class: A(v.value ? "" : "text-muted-foreground")
        }, c(v.value ?? "Select…"), 3),
        $[2] || ($[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "▾", -1))
      ], 10, D4),
      i.value ? (t(), n("div", T4, [
        e.field.searchable ? ge((t(), n("input", {
          key: 0,
          "onUpdate:modelValue": $[1] || ($[1] = (k) => s.value = k),
          type: "search",
          class: "border-input mb-1 h-8 w-full rounded border px-2 text-sm",
          placeholder: "Search…"
        }, null, 512)), [
          [_e, s.value]
        ]) : b("", !0),
        (t(!0), n(z, null, j(f.value, (k) => (t(), n(z, {
          key: String(k.value)
        }, [
          l("button", {
            type: "button",
            class: A(["hover:bg-accent flex w-full rounded px-2 py-1.5 text-left text-sm font-medium", e.modelValue === k.value ? "bg-accent" : ""]),
            onClick: (S) => p(k.value)
          }, c(k.label), 11, I4),
          (t(!0), n(z, null, j(k.children ?? [], (S) => (t(), n("button", {
            key: String(S.value),
            type: "button",
            class: A(["hover:bg-accent text-muted-foreground flex w-full rounded py-1.5 pr-2 pl-6 text-left text-sm", e.modelValue === S.value ? "bg-accent text-foreground" : ""]),
            onClick: (w) => p(S.value)
          }, c(S.label), 11, E4))), 128))
        ], 64))), 128))
      ])) : b("", !0)
    ]));
  }
});
function N4() {
  xe("radio", fv), xe("toggle-buttons", Kn), xe("checkboxlist", vv), xe("tags", $v), xe("colour", jv), xe("slider", mg), xe("rating", _4), xe("phone", k4), xe("icon-picker", y4), xe("tree-select", F4), xe("visual-select", Mg), xe("markdown", qp), xe("code", Qp), xe("map", Ev), xe("qrcode", Hv), xe("barcode", Yv), xe("diff", eg), xe("seo-preview", j4), It("swatch", Ag), It("voucher-code-box", g4), It("document-colour-mode", v4);
}
function ca() {
  const e = H(null), o = H(!1);
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
const R4 = /* @__PURE__ */ L({
  __name: "PkReveal",
  props: {
    delay: { default: 0 }
  },
  setup(e) {
    const { el: o, shown: a } = ca();
    return (r, s) => (t(), n("div", {
      ref_key: "el",
      ref: o,
      class: A(["transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none", x(a) ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"]),
      style: ie({ transitionDelay: `${e.delay}ms` })
    }, [
      q(r.$slots, "default")
    ], 6));
  }
}), U4 = ["id"], Se = /* @__PURE__ */ L({
  __name: "PkSection",
  props: {
    muted: { type: Boolean, default: !1 },
    narrow: { type: Boolean, default: !1 },
    id: {}
  },
  setup(e) {
    return (o, a) => (t(), n("section", {
      id: e.id,
      class: A(["pk-landing-section w-full px-4 sm:px-6", e.muted ? "bg-muted/40" : ""])
    }, [
      l("div", {
        class: A(["mx-auto w-full", e.narrow ? "max-w-3xl" : "max-w-6xl"])
      }, [
        I(R4, null, {
          default: O(() => [
            q(o.$slots, "default")
          ]),
          _: 3
        })
      ], 2)
    ], 10, U4));
  }
}), H4 = {
  key: 0,
  class: "text-xs font-semibold tracking-widest text-primary uppercase"
}, q4 = {
  key: 1,
  class: "text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
}, K4 = {
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
      class: A(["flex flex-col gap-3", e.centred ? "items-center text-center" : ""])
    }, [
      e.eyebrow ? (t(), n("p", H4, c(e.eyebrow), 1)) : b("", !0),
      e.title ? (t(), n("h2", q4, c(e.title), 1)) : b("", !0),
      e.body ? (t(), n("p", K4, c(e.body), 1)) : b("", !0)
    ], 2)) : b("", !0);
  }
}), G4 = { class: "flex flex-col gap-10" }, W4 = { class: "grid gap-4 md:grid-cols-3" }, Z4 = {
  key: 0,
  class: "text-xs font-medium text-muted-foreground"
}, J4 = { class: "text-sm font-semibold text-balance" }, Y4 = {
  key: 1,
  class: "text-pretty text-sm text-muted-foreground"
}, Q4 = /* @__PURE__ */ L({
  __name: "PkArticles",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), D(Se, null, {
      default: O(() => [
        l("div", G4, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", W4, [
            (t(!0), n(z, null, j(e.items ?? [], (r, s) => (t(), n("li", { key: s }, [
              (t(), D(Ce(r.href ? "a" : "div"), {
                href: r.href || void 0,
                class: "flex h-full flex-col gap-3 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
              }, {
                default: O(() => [
                  r.meta ? (t(), n("p", Z4, c(r.meta), 1)) : b("", !0),
                  l("h3", J4, c(r.title), 1),
                  r.body ? (t(), n("p", Y4, c(r.body), 1)) : b("", !0)
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
function X4() {
  const e = H(null);
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
const e5 = { class: "pk-tilt-inner relative h-full" }, t5 = /* @__PURE__ */ L({
  __name: "PkTiltCard",
  setup(e) {
    const { el: o } = X4();
    return (a, r) => (t(), n("div", {
      ref_key: "el",
      ref: o,
      class: "pk-tilt group/tilt"
    }, [
      l("div", e5, [
        r[0] || (r[0] = l("span", {
          class: "pk-tilt-glow pointer-events-none absolute inset-0 rounded-lg",
          "aria-hidden": "true"
        }, null, -1)),
        q(a.$slots, "default")
      ])
    ], 512));
  }
}), n5 = { class: "flex flex-col gap-10" }, a5 = { class: "grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-3" }, l5 = { class: "text-base font-semibold" }, o5 = { class: "text-sm text-pretty text-muted-foreground" }, s5 = /* @__PURE__ */ L({
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
    return (a, r) => (t(), D(Se, null, {
      default: O(() => [
        l("div", n5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", a5, [
            (t(!0), n(z, null, j(e.items ?? [], (s, i) => (t(), D(t5, {
              key: i,
              class: A(o(s.span))
            }, {
              default: O(() => [
                l("div", {
                  class: A([
                    "flex h-full flex-col justify-end gap-2 overflow-hidden rounded-xl border p-6 transition-shadow duration-300 hover:shadow-lg",
                    s.accent ? "bg-primary/5 border-primary/30 dark:bg-primary/10" : "bg-card"
                  ])
                }, [
                  l("h3", l5, c(s.title), 1),
                  l("p", o5, c(s.body), 1)
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
}), r5 = { class: "grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center" }, i5 = { class: "flex flex-col gap-4 rounded-xl border bg-card p-6 sm:p-8" }, d5 = { class: "grid gap-4 text-sm" }, u5 = {
  key: 0,
  class: "grid gap-1"
}, c5 = ["href"], f5 = {
  key: 1,
  class: "grid gap-1"
}, m5 = ["href"], p5 = {
  key: 2,
  class: "grid gap-1"
}, v5 = { class: "text-pretty text-muted-foreground" }, g5 = ["href"], h5 = /* @__PURE__ */ L({
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
    return (o, a) => (t(), D(Se, { muted: "" }, {
      default: O(() => [
        l("div", r5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", i5, [
            l("dl", d5, [
              e.email ? (t(), n("div", u5, [
                a[0] || (a[0] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Email ", -1)),
                l("dd", null, [
                  l("a", {
                    href: `mailto:${e.email}`,
                    class: "font-medium text-foreground underline-offset-4 hover:underline"
                  }, c(e.email), 9, c5)
                ])
              ])) : b("", !0),
              e.phone ? (t(), n("div", f5, [
                a[1] || (a[1] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Phone ", -1)),
                l("dd", null, [
                  l("a", {
                    href: `tel:${e.phone.replace(/\s+/g, "")}`,
                    class: "font-medium text-foreground underline-offset-4 hover:underline"
                  }, c(e.phone), 9, m5)
                ])
              ])) : b("", !0),
              e.address ? (t(), n("div", p5, [
                a[2] || (a[2] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Address ", -1)),
                l("dd", v5, c(e.address), 1)
              ])) : b("", !0)
            ]),
            e.label ? (t(), n("a", {
              key: 0,
              href: e.href ?? (e.email ? `mailto:${e.email}` : "#"),
              class: "inline-flex h-11 w-fit items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            }, c(e.label), 9, g5)) : b("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), b5 = { class: "flex flex-col items-center gap-5 rounded-xl border bg-card px-6 py-12 text-center" }, y5 = { class: "max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl" }, x5 = {
  key: 0,
  class: "max-w-xl text-pretty text-muted-foreground"
}, k5 = ["href"], $5 = /* @__PURE__ */ L({
  __name: "PkCta",
  props: {
    title: {},
    body: {},
    label: {},
    href: {}
  },
  setup(e) {
    return (o, a) => (t(), D(Se, null, {
      default: O(() => [
        l("div", b5, [
          l("h2", y5, c(e.title), 1),
          e.body ? (t(), n("p", x5, c(e.body), 1)) : b("", !0),
          e.label ? (t(), n("a", {
            key: 1,
            href: e.href ?? "#",
            class: "inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          }, c(e.label), 9, k5)) : b("", !0)
        ])
      ]),
      _: 1
    }));
  }
}), w5 = { class: "flex flex-col gap-8" }, C5 = { class: "divide-y rounded-lg border" }, S5 = { class: "flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent/50" }, M5 = { class: "px-4 pb-4 text-sm text-pretty text-muted-foreground" }, B5 = /* @__PURE__ */ L({
  __name: "PkFaq",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), D(Se, { narrow: "" }, {
      default: O(() => [
        l("div", w5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", C5, [
            (t(!0), n(z, null, j(e.items ?? [], (r, s) => (t(), n("details", {
              key: s,
              class: "group"
            }, [
              l("summary", S5, [
                U(c(r.question) + " ", 1),
                a[0] || (a[0] = l("span", {
                  class: "text-muted-foreground transition-transform group-open:rotate-45",
                  "aria-hidden": "true"
                }, " + ", -1))
              ]),
              l("p", M5, c(r.answer), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), A5 = { class: "flex flex-col gap-10" }, _5 = { class: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }, z5 = { class: "text-sm font-semibold" }, P5 = { class: "text-sm text-pretty text-muted-foreground" }, L5 = /* @__PURE__ */ L({
  __name: "PkFeatureGrid",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), D(Se, null, {
      default: O(() => [
        l("div", A5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", _5, [
            (t(!0), n(z, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-2 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              l("h3", z5, c(r.title), 1),
              l("p", P5, c(r.body), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), O5 = {
  key: 0,
  class: "pk-hero-brand text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
}, j5 = {
  key: 1,
  class: "rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground"
}, V5 = {
  key: 2,
  class: "max-w-2xl text-lg text-pretty text-muted-foreground"
}, D5 = {
  key: 3,
  class: "flex flex-wrap items-center justify-center gap-3"
}, T5 = ["href"], I5 = ["href"], E5 = {
  key: 4,
  class: "text-xs font-normal text-muted-foreground"
}, F5 = /* @__PURE__ */ L({
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
    return (o, a) => (t(), D(Se, null, {
      default: O(() => [
        l("div", {
          class: A(["flex flex-col items-center gap-6 text-center", e.variant === "bleed" ? "min-h-[70vh] justify-center py-8 sm:py-12" : ""])
        }, [
          e.brand ? (t(), n("p", O5, c(e.brand), 1)) : b("", !0),
          e.eyebrow ? (t(), n("p", j5, c(e.eyebrow), 1)) : b("", !0),
          l("h1", {
            class: A(["max-w-3xl font-semibold tracking-tight text-balance", e.brand ? "text-2xl sm:text-3xl md:text-4xl" : "text-4xl sm:text-5xl"])
          }, c(e.title), 3),
          e.body ? (t(), n("p", V5, c(e.body), 1)) : b("", !0),
          e.primaryLabel || e.secondaryLabel ? (t(), n("div", D5, [
            e.secondaryLabel ? (t(), n("a", {
              key: 0,
              href: e.secondaryHref ?? "#",
              class: "inline-flex h-11 items-center rounded-md border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent"
            }, c(e.secondaryLabel), 9, T5)) : b("", !0),
            e.primaryLabel ? (t(), n("a", {
              key: 1,
              href: e.primaryHref ?? "#",
              class: "inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            }, c(e.primaryLabel), 9, I5)) : b("", !0)
          ])) : b("", !0),
          e.note ? (t(), n("p", E5, c(e.note), 1)) : b("", !0)
        ], 2)
      ]),
      _: 1
    }));
  }
}), N5 = { class: "flex flex-col items-center gap-6" }, R5 = {
  key: 0,
  class: "text-xs font-medium tracking-widest text-muted-foreground uppercase"
}, U5 = { class: "flex flex-wrap items-center justify-center gap-x-10 gap-y-4" }, H5 = /* @__PURE__ */ L({
  __name: "PkLogoCloud",
  props: {
    title: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), D(Se, { muted: "" }, {
      default: O(() => [
        l("div", N5, [
          e.title ? (t(), n("p", R5, c(e.title), 1)) : b("", !0),
          l("ul", U5, [
            (t(!0), n(z, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "text-lg font-semibold text-muted-foreground/70"
            }, c(r.name), 1))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), q5 = {
  key: 0,
  class: "mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
}, K5 = {
  class: "pk-marquee-track",
  role: "list"
}, G5 = ["href"], W5 = {
  key: 1,
  role: "listitem",
  class: "pk-marquee-item"
}, Z5 = /* @__PURE__ */ L({
  __name: "PkMarquee",
  props: {
    title: { default: "" },
    items: { default: () => [] },
    speed: { default: "normal" },
    reverse: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = y(() => [...o.items, ...o.items]);
    return (r, s) => e.items.length ? (t(), D(Se, {
      key: 0,
      class: "overflow-hidden",
      "aria-label": e.title || "Highlights"
    }, {
      default: O(() => [
        e.title ? (t(), n("p", q5, c(e.title), 1)) : b("", !0),
        l("div", {
          class: A(["pk-marquee", [`pk-marquee-${e.speed}`, e.reverse ? "pk-marquee-reverse" : ""]])
        }, [
          l("div", K5, [
            (t(!0), n(z, null, j(a.value, (i, d) => (t(), n(z, {
              key: `${i.name}-${d}`
            }, [
              i.href ? (t(), n("a", {
                key: 0,
                href: i.href,
                role: "listitem",
                class: "pk-marquee-item"
              }, c(i.name), 9, G5)) : (t(), n("span", W5, c(i.name), 1))
            ], 64))), 128))
          ])
        ], 2)
      ]),
      _: 1
    }, 8, ["aria-label"])) : b("", !0);
  }
}), J5 = { class: "flex flex-col gap-10" }, Y5 = {
  key: 0,
  class: "flex items-center justify-center gap-3"
}, Q5 = {
  class: "inline-flex rounded-md border bg-background p-1",
  role: "group"
}, X5 = ["aria-pressed"], e3 = ["aria-pressed"], t3 = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, n3 = { class: "grid gap-4 md:grid-cols-3" }, a3 = { class: "flex flex-col gap-1" }, l3 = { class: "text-sm font-semibold" }, o3 = { class: "flex items-baseline gap-1" }, s3 = { class: "text-3xl font-semibold tracking-tight" }, r3 = {
  key: 0,
  class: "text-sm text-muted-foreground font-normal"
}, i3 = {
  key: 0,
  class: "text-sm text-pretty text-muted-foreground"
}, d3 = { class: "flex flex-col gap-2 text-sm" }, u3 = { class: "text-muted-foreground" }, c3 = ["href"], f3 = /* @__PURE__ */ L({
  __name: "PkPricing",
  props: {
    title: {},
    body: {},
    annualNote: {},
    items: {}
  },
  setup(e) {
    const o = e, a = H(!1), r = y(() => (o.items ?? []).some((i) => !!i.annualPrice));
    function s(i) {
      return a.value && i.annualPrice ? i.annualPrice : i.price;
    }
    return (i, d) => (t(), D(Se, { muted: "" }, {
      default: O(() => [
        l("div", J5, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          r.value ? (t(), n("div", Y5, [
            l("div", Q5, [
              l("button", {
                type: "button",
                class: A([
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  a.value ? "text-muted-foreground" : "bg-primary text-primary-foreground"
                ]),
                "aria-pressed": !a.value,
                onClick: d[0] || (d[0] = (u) => a.value = !1)
              }, " Monthly ", 10, X5),
              l("button", {
                type: "button",
                class: A([
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  a.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                ]),
                "aria-pressed": a.value,
                onClick: d[1] || (d[1] = (u) => a.value = !0)
              }, " Annual ", 10, e3)
            ]),
            e.annualNote ? (t(), n("p", t3, c(e.annualNote), 1)) : b("", !0)
          ])) : b("", !0),
          l("ul", n3, [
            (t(!0), n(z, null, j(e.items ?? [], (u, f) => (t(), n("li", {
              key: f,
              class: A(["flex flex-col gap-4 rounded-lg border bg-card p-6", u.featured ? "border-primary shadow-sm" : ""])
            }, [
              l("div", a3, [
                l("h3", l3, c(u.name), 1),
                l("p", o3, [
                  l("span", s3, c(s(u)), 1),
                  u.period ? (t(), n("span", r3, c(u.period), 1)) : b("", !0)
                ]),
                u.body ? (t(), n("p", i3, c(u.body), 1)) : b("", !0)
              ]),
              l("ul", d3, [
                (t(!0), n(z, null, j(u.features ?? [], (v, p) => (t(), n("li", {
                  key: p,
                  class: "flex items-start gap-2"
                }, [
                  d[2] || (d[2] = l("span", {
                    class: "mt-0.5 text-success",
                    "aria-hidden": "true"
                  }, "✓", -1)),
                  l("span", u3, c(v.title), 1)
                ]))), 128))
              ]),
              u.label ? (t(), n("a", {
                key: 0,
                href: u.href ?? "#",
                class: A([
                  "mt-auto inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                  u.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border bg-background hover:bg-accent"
                ])
              }, c(u.label), 11, c3)) : b("", !0)
            ], 2))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
});
function m3() {
  const e = H(null);
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
const p3 = { class: "mx-auto h-[190vh] w-full max-w-6xl" }, v3 = { class: "sticky top-[12vh] flex flex-col items-center gap-8" }, g3 = { class: "flex max-w-2xl flex-col items-center gap-3 text-center" }, h3 = { class: "text-2xl font-semibold tracking-tight text-balance sm:text-3xl" }, b3 = {
  key: 0,
  class: "text-pretty text-muted-foreground"
}, y3 = { class: "pk-showcase-stage w-full [perspective:1400px]" }, x3 = { class: "pk-showcase-frame overflow-hidden rounded-xl border bg-card shadow-2xl" }, k3 = { class: "flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5" }, $3 = { class: "ml-3 truncate text-xs text-muted-foreground" }, w3 = { class: "flex" }, C3 = { class: "hidden w-40 shrink-0 flex-col gap-2 border-r p-4 sm:flex" }, S3 = { class: "min-w-0 flex-1 p-4" }, M3 = { class: "flex flex-col divide-y rounded-md border" }, B3 = /* @__PURE__ */ L({
  __name: "PkShowcase",
  props: {
    title: {},
    body: {},
    rows: { default: 6 },
    caption: {}
  },
  setup(e) {
    const { el: o } = m3();
    return (a, r) => (t(), n("section", {
      ref_key: "el",
      ref: o,
      class: "pk-showcase relative w-full px-4 sm:px-6"
    }, [
      l("div", p3, [
        l("div", v3, [
          l("div", g3, [
            l("h2", h3, c(e.title), 1),
            e.body ? (t(), n("p", b3, c(e.body), 1)) : b("", !0)
          ]),
          l("div", y3, [
            l("div", x3, [
              l("div", k3, [
                r[0] || (r[0] = l("span", { class: "size-2.5 rounded-full bg-red-400/70" }, null, -1)),
                r[1] || (r[1] = l("span", { class: "size-2.5 rounded-full bg-amber-400/70" }, null, -1)),
                r[2] || (r[2] = l("span", { class: "size-2.5 rounded-full bg-emerald-400/70" }, null, -1)),
                l("span", $3, c(e.caption ?? "yourpanel.example / records"), 1)
              ]),
              l("div", w3, [
                l("div", C3, [
                  (t(), n(z, null, j(6, (s) => l("span", {
                    key: s,
                    class: "h-2.5 rounded bg-foreground/10",
                    style: ie({ width: `${55 + s * 13 % 40}%` })
                  }, null, 4)), 64))
                ]),
                l("div", S3, [
                  r[4] || (r[4] = l("div", { class: "mb-3 flex gap-2" }, [
                    l("span", { class: "h-7 w-28 rounded-md bg-foreground/[0.07]" }),
                    l("span", { class: "h-7 w-20 rounded-md bg-foreground/[0.07]" }),
                    l("span", { class: "ml-auto h-7 w-24 rounded-md bg-primary/25" })
                  ], -1)),
                  l("div", M3, [
                    (t(!0), n(z, null, j(e.rows, (s) => (t(), n("div", {
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
}), A3 = /* @__PURE__ */ L({
  __name: "PkCountUp",
  props: {
    to: {},
    prefix: {},
    suffix: {},
    decimals: { default: 0 },
    duration: { default: 1400 }
  },
  setup(e) {
    const o = e, { el: a, shown: r } = ca(), s = H(0);
    return pe(r, (i) => {
      if (!i)
        return;
      if (typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof requestAnimationFrame > "u") {
        s.value = o.to;
        return;
      }
      const u = performance.now(), f = (v) => {
        const p = Math.min((v - u) / o.duration, 1);
        s.value = o.to * (1 - Math.pow(1 - p, 3)), p < 1 ? requestAnimationFrame(f) : s.value = o.to;
      };
      requestAnimationFrame(f);
    }), (i, d) => (t(), n("span", {
      ref_key: "el",
      ref: a
    }, c(e.prefix ?? "") + c(s.value.toFixed(e.decimals)) + c(e.suffix ?? ""), 513));
  }
}), _3 = { class: "flex flex-col gap-10" }, z3 = { class: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4" }, P3 = { class: "order-2 text-sm text-muted-foreground" }, L3 = { class: "order-1 text-3xl font-semibold tracking-tight sm:text-4xl" }, O3 = /* @__PURE__ */ L({
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
    return (a, r) => (t(), D(Se, { muted: "" }, {
      default: O(() => [
        l("div", _3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("dl", z3, [
            (t(!0), n(z, null, j(e.items ?? [], (s, i) => (t(), n("div", {
              key: i,
              class: "flex flex-col items-center gap-1 text-center"
            }, [
              l("dt", P3, c(s.label), 1),
              l("dd", L3, [
                o(s.value) ? (t(), D(A3, {
                  key: 0,
                  to: o(s.value).number,
                  prefix: o(s.value).prefix,
                  suffix: o(s.value).suffix,
                  decimals: o(s.value).decimals
                }, null, 8, ["to", "prefix", "suffix", "decimals"])) : (t(), n(z, { key: 1 }, [
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
}), j3 = { class: "flex flex-col gap-10" }, V3 = { class: "grid gap-6 md:grid-cols-3" }, D3 = { class: "flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary" }, T3 = { class: "text-sm font-semibold" }, I3 = { class: "text-sm text-pretty text-muted-foreground" }, E3 = /* @__PURE__ */ L({
  __name: "PkSteps",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), D(Se, null, {
      default: O(() => [
        l("div", j3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ol", V3, [
            (t(!0), n(z, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-2"
            }, [
              l("span", D3, c(s + 1), 1),
              l("h3", T3, c(r.title), 1),
              l("p", I3, c(r.body), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), F3 = { class: "flex flex-col gap-10" }, N3 = { class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" }, R3 = ["src"], U3 = {
  key: 1,
  class: "mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-lg font-semibold",
  "aria-hidden": "true"
}, H3 = { class: "min-w-0" }, q3 = { class: "truncate text-sm font-semibold" }, K3 = {
  key: 0,
  class: "truncate text-xs text-muted-foreground"
}, G3 = {
  key: 2,
  class: "text-pretty text-xs text-muted-foreground"
}, W3 = /* @__PURE__ */ L({
  __name: "PkTeam",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), D(Se, null, {
      default: O(() => [
        l("div", F3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", N3, [
            (t(!0), n(z, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-3 rounded-lg border bg-card p-5 text-center transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              r.avatar ? (t(), n("img", {
                key: 0,
                src: r.avatar,
                alt: "",
                class: "mx-auto size-16 rounded-full object-cover"
              }, null, 8, R3)) : (t(), n("span", U3, c((r.name ?? "?").slice(0, 1)), 1)),
              l("div", H3, [
                l("h3", q3, c(r.name), 1),
                r.role ? (t(), n("p", K3, c(r.role), 1)) : b("", !0)
              ]),
              r.bio ? (t(), n("p", G3, c(r.bio), 1)) : b("", !0)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Z3 = { class: "flex flex-col gap-10" }, J3 = { class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, Y3 = { class: "flex h-full flex-col gap-4" }, Q3 = { class: "text-pretty text-sm leading-relaxed" }, X3 = { class: "mt-auto flex items-center gap-3" }, e8 = ["src"], t8 = {
  key: 1,
  class: "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium",
  "aria-hidden": "true"
}, n8 = { class: "min-w-0" }, a8 = { class: "block truncate text-sm font-medium" }, l8 = {
  key: 0,
  class: "block truncate text-xs text-muted-foreground"
}, o8 = /* @__PURE__ */ L({
  __name: "PkTestimonials",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), D(Se, null, {
      default: O(() => [
        l("div", Z3, [
          I(je, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", J3, [
            (t(!0), n(z, null, j(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-4 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              l("figure", Y3, [
                l("blockquote", Q3, " “" + c(r.quote) + "” ", 1),
                l("figcaption", X3, [
                  r.avatar ? (t(), n("img", {
                    key: 0,
                    src: r.avatar,
                    alt: "",
                    class: "size-9 shrink-0 rounded-full object-cover"
                  }, null, 8, e8)) : (t(), n("span", t8, c((r.name ?? "?").slice(0, 1)), 1)),
                  l("span", n8, [
                    l("span", a8, c(r.name), 1),
                    r.role ? (t(), n("span", l8, c(r.role), 1)) : b("", !0)
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
}), MS = /* @__PURE__ */ L({
  __name: "PkLandingSections",
  props: {
    sections: {},
    warnOnUnknown: { type: Boolean, default: !1 }
  },
  setup(e, { expose: o }) {
    const a = e, r = {
      hero: F5,
      logos: H5,
      marquee: Z5,
      features: L5,
      bento: s5,
      showcase: B3,
      steps: E3,
      stats: O3,
      testimonials: o8,
      team: W3,
      articles: Q4,
      contact: h5,
      pricing: f3,
      faq: B5,
      cta: $5
    }, s = y(
      () => (a.sections ?? []).map((i, d) => ({
        key: `${i.type}-${d}`,
        component: r[i.type],
        type: i.type,
        data: i.data ?? {}
      })).filter((i) => (!i.component && a.warnOnUnknown && console.warn(`[alxtexhpanel] Unknown landing section "${i.type}" - skipped.`), !!i.component))
    );
    return o({ known: Object.keys(r) }), (i, d) => (t(!0), n(z, null, j(s.value, (u) => (t(), D(Ce(u.component), de({
      key: u.key
    }, { ref_for: !0 }, u.data), null, 16))), 128));
  }
}), s8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, BS = /* @__PURE__ */ L({
  __name: "PkAuroraBackdrop",
  props: {
    intensity: { default: "full" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", s8, [
      l("div", {
        class: A([
          "pk-blob absolute -top-32 -left-24 size-[38rem] rounded-full blur-3xl",
          e.intensity === "full" ? "opacity-60 dark:opacity-40" : "opacity-30 dark:opacity-20"
        ]),
        style: { background: "radial-gradient(circle at 30% 30%, var(--pk-aurora-1), transparent 70%)", "animation-delay": "0s" }
      }, null, 2),
      l("div", {
        class: A([
          "pk-blob absolute -top-16 right-0 size-[32rem] rounded-full blur-3xl",
          e.intensity === "full" ? "opacity-50 dark:opacity-35" : "opacity-25 dark:opacity-15"
        ]),
        style: { background: "radial-gradient(circle at 60% 40%, var(--pk-aurora-2), transparent 70%)", "animation-delay": "-7s" }
      }, null, 2),
      l("div", {
        class: A([
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
}), r8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, AS = /* @__PURE__ */ L({
  __name: "PkEditorialBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", r8, [...a[0] || (a[0] = [
      dt('<div class="pk-wash absolute inset-0"></div><div class="absolute inset-y-0 left-1/2 hidden w-full max-w-3xl -translate-x-1/2 lg:block"><div class="absolute inset-y-0 left-0 w-px bg-foreground/[0.06]"></div><div class="absolute inset-y-0 right-0 w-px bg-foreground/[0.06]"></div></div><div class="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]" style="background-image:url(&quot;data:image/svg+xml;utf8,&lt;svg xmlns=&#39;http://www.w3.org/2000/svg&#39; width=&#39;160&#39; height=&#39;160&#39;&gt;&lt;filter id=&#39;n&#39;&gt;&lt;feTurbulence type=&#39;fractalNoise&#39; baseFrequency=&#39;0.85&#39; numOctaves=&#39;3&#39;/&gt;&lt;/filter&gt;&lt;rect width=&#39;160&#39; height=&#39;160&#39; filter=&#39;url(%23n)&#39;/&gt;&lt;/svg&gt;&quot;);"></div>', 3)
    ])]));
  }
}), i8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, _S = /* @__PURE__ */ L({
  __name: "PkConsoleBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", i8, [...a[0] || (a[0] = [
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
}), d8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, zS = /* @__PURE__ */ L({
  __name: "PkStudioBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", d8, [...a[0] || (a[0] = [
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
N4();
const PS = "0.0.1";
export {
  bn as ACTION_KEY_ICONS,
  Gt as APPEARANCE_STYLE_ID,
  Zf as Alert,
  Jf as AlertDescription,
  Yf as AlertTitle,
  P6 as AppPageFooter,
  G8 as AppearanceDrawer,
  GC as Avatar,
  WC as AvatarFallback,
  ZC as AvatarImage,
  dn as BADGE_VARIANTS,
  N8 as BadgeResolver,
  F6 as BarChart,
  JC as Breadcrumb,
  YC as BreadcrumbEllipsis,
  QC as BreadcrumbItem,
  XC as BreadcrumbLink,
  e6 as BreadcrumbList,
  t6 as BreadcrumbPage,
  n6 as BreadcrumbSeparator,
  w8 as BulkActions,
  aa as CATALOGUE_CONTAINER,
  nm as CATALOGUE_GRID,
  tC as CATALOGUE_GRID_TIGHT,
  am as CATALOGUE_GRID_TILES,
  k6 as Card,
  $6 as CardAction,
  w6 as CardContent,
  C6 as CardDescription,
  S6 as CardFooter,
  M6 as CardHeader,
  B6 as CardTitle,
  pk as CartPanel,
  nS as CatalogBrowser,
  qy as CatalogCard,
  ua as CatalogFilterSheet,
  mn as CatalogGrid,
  eS as CatalogInspect,
  p2 as CatalogItemDetail,
  tS as CatalogItemView,
  aS as CatalogRegister,
  X6 as CatalogTill,
  _b as ChartCard,
  ht as ChartTooltip,
  ni as Checkbox,
  V8 as CheckboxCell,
  D8 as CodeCell,
  bu as ColourCell,
  q6 as ComboChart,
  li as CreateOptionDialog,
  Yr as CreateOptionError,
  oS as DASHBOARD_HIDDEN_STORAGE_KEY,
  Z2 as DASHBOARD_HIDE_KEY,
  sS as DashboardShortcuts,
  go as DataTable,
  u6 as Dialog,
  c6 as DialogClose,
  f6 as DialogContent,
  m6 as DialogDescription,
  p6 as DialogFooter,
  v6 as DialogHeader,
  jm as DialogOverlay,
  g6 as DialogScrollContent,
  h6 as DialogTitle,
  b6 as DialogTrigger,
  OC as DropdownMenu,
  jC as DropdownMenuCheckboxItem,
  VC as DropdownMenuContent,
  DC as DropdownMenuGroup,
  TC as DropdownMenuItem,
  IC as DropdownMenuLabel,
  jS as DropdownMenuPortal,
  EC as DropdownMenuRadioGroup,
  FC as DropdownMenuRadioItem,
  NC as DropdownMenuSeparator,
  RC as DropdownMenuShortcut,
  UC as DropdownMenuSub,
  HC as DropdownMenuSubContent,
  qC as DropdownMenuSubTrigger,
  KC as DropdownMenuTrigger,
  E8 as EditableCell,
  Be as FOCUS_RING,
  C8 as FOCUS_RING_SOFT,
  xn as FOCUS_RING_WITHIN,
  ho as FORM_MEASURE,
  Ge as FormFieldControl,
  K6 as HeatmapChart,
  xl as ICON_ALIASES,
  kt as ICON_PATHS,
  Ue as INPUT_COPY,
  ti as INPUT_PLACEHOLDER,
  ei as INPUT_TEXT,
  iu as IconCell,
  mu as ImageCell,
  xS as InfoNode,
  R8 as InlineRecordActions,
  sm as JPEG_IMAGE_ERROR,
  T8 as KeyValueCell,
  y6 as Label,
  Kh as LineChart,
  W0 as LineItems,
  k8 as MODAL_PANEL,
  $8 as MODAL_PANEL_FORM,
  wt as MODAL_WIDTH,
  z8 as MUTED_COPY,
  xt as MUTED_COPY_SNUG,
  P8 as MUTED_COPY_XS,
  At as MiniStatCard,
  a6 as NavigationMenu,
  l6 as NavigationMenuContent,
  o6 as NavigationMenuIndicator,
  s6 as NavigationMenuItem,
  r6 as NavigationMenuLink,
  i6 as NavigationMenuList,
  d6 as NavigationMenuTrigger,
  Lm as NavigationMenuViewport,
  om as OPAQUE_IMAGE_ERROR,
  Un as OVERLAY_FORM_MEASURE,
  at as PAGE_SHELL,
  y8 as PAGE_SHELL_COMPACT,
  x8 as PAGE_SHELL_STACK,
  kS as PaymentGatewaySettings,
  Qw as PaymentGateways,
  N6 as PieChart,
  X8 as PkAlertError,
  Q4 as PkArticles,
  BS as PkAuroraBackdrop,
  We as PkBadge,
  Yv as PkBarcode,
  s5 as PkBento,
  W8 as PkBottomNav,
  A6 as PkBoundary,
  V6 as PkBuilder,
  ce as PkButton,
  D6 as PkCalendar,
  _6 as PkCard,
  vv as PkCheckboxList,
  ia as PkCodeBox,
  Qp as PkCodeInput,
  jv as PkColourPicker,
  _S as PkConsoleBackdrop,
  h5 as PkContact,
  A3 as PkCountUp,
  $5 as PkCta,
  L6 as PkDeviceFrame,
  eg as PkDiff,
  oh as PkDocument,
  He as PkDropdown,
  AS as PkEditorialBackdrop,
  Ut as PkEmptyState,
  B5 as PkFaq,
  L5 as PkFeatureGrid,
  ze as PkFieldLabel,
  qn as PkFileUpload,
  Ie as PkHeading,
  F5 as PkHero,
  Li as PkKeyValue,
  MS as PkLandingSections,
  H5 as PkLogoCloud,
  Dv as PkMap,
  Ev as PkMapField,
  qp as PkMarkdownInput,
  Z5 as PkMarquee,
  ft as PkModal,
  on as PkMultiSelect,
  Y8 as PkOtpInput,
  Q8 as PkPageHeader,
  mS as PkPasskeyRegister,
  eC as PkPasswordInput,
  f3 as PkPricing,
  Hv as PkQrCode,
  T0 as PkQtyStepper,
  ks as PkQueryBuilder,
  fv as PkRadioGroup,
  j6 as PkRepeater,
  R4 as PkReveal,
  Ri as PkRichEditor,
  Se as PkSection,
  je as PkSectionHeading,
  O6 as PkSetupWizardCompletion,
  B3 as PkShowcase,
  _2 as PkSignaturePad,
  Pe as PkSkeleton,
  Pt as PkSlideover,
  mg as PkSlider,
  J8 as PkSpinner,
  O3 as PkStats,
  $e as PkStatusBadge,
  Zr as PkStepIndicator,
  E3 as PkSteps,
  zS as PkStudioBackdrop,
  Z8 as PkSubNav,
  Ag as PkSwatchPreview,
  $v as PkTagsInput,
  W3 as PkTeam,
  o8 as PkTestimonials,
  we as PkTextInput,
  t5 as PkTiltCard,
  Kn as PkToggleButtons,
  Mg as PkVisualSelect,
  bx as PlanCard,
  Y6 as PlanEditor,
  J6 as PlanGrid,
  Q6 as PlanPurchaseCard,
  H6 as PolarAreaChart,
  U6 as RadarChart,
  j8 as RatingCell,
  ic as RecordActions,
  pS as RecordForm,
  O8 as RelationCreateDialog,
  M8 as RelationPanel,
  bo as SLIDEOVER_BODY,
  yo as SLIDEOVER_WIDTH,
  $y as STATUS_TONES,
  fS as SavedViews,
  R6 as ScatterChart,
  Gn as SchemaNode,
  W6 as SegmentedBar,
  dS as SelectionBar,
  Bm as Separator,
  iS as SetupChecklist,
  na as ShadcnInput,
  sn as Sheet,
  sC as SheetClose,
  rn as SheetContent,
  fm as SheetDescription,
  rC as SheetFooter,
  mm as SheetHeader,
  pm as SheetTitle,
  iC as SheetTrigger,
  Wb as ShortcutsWidget,
  dC as Sidebar,
  uC as SidebarContent,
  cC as SidebarFooter,
  fC as SidebarGroup,
  mC as SidebarGroupAction,
  pC as SidebarGroupContent,
  vC as SidebarGroupLabel,
  gC as SidebarHeader,
  hC as SidebarInput,
  bC as SidebarInset,
  yC as SidebarMenu,
  xC as SidebarMenuAction,
  kC as SidebarMenuBadge,
  wC as SidebarMenuButton,
  CC as SidebarMenuItem,
  SC as SidebarMenuSkeleton,
  MC as SidebarMenuSub,
  BC as SidebarMenuSubButton,
  AC as SidebarMenuSubItem,
  _C as SidebarProvider,
  zC as SidebarRail,
  PC as SidebarSeparator,
  LC as SidebarTrigger,
  lS as SignatureStudio,
  Ot as Sparkline,
  x6 as Spinner,
  G6 as StatCard,
  Z6 as StatListChart,
  rS as StatStrip,
  Je as Switch,
  la as TRANSPARENT_IMAGE_HELP,
  uS as TablePagination,
  Jo as TableShell,
  cS as TableTabs,
  Br as TableToolbar,
  I8 as TagsCell,
  E6 as ThemeToggle,
  Cm as Tooltip,
  Sm as TooltipContent,
  $C as TooltipProvider,
  Mm as TooltipTrigger,
  da as TrendBadge,
  vS as UnsavedBar,
  qu as actionColorTone,
  Qf as alertVariants,
  _c as appearancePayload,
  Yn as appearanceVars,
  Wt as applyAppearance,
  cm as assertTransparentImage,
  H8 as bootstrapAppearance,
  Ye as buttonClasses,
  _t as catalogFiltersActive,
  oe as cn,
  Xr as createOptionActionLabel,
  Qr as createOptionTitle,
  Ky as cycleLabel,
  Ee as emptyCatalogFilters,
  hw as entryView,
  Jr as fieldControl,
  L8 as fieldErrorsFromPayload,
  hk as findExactSku,
  Gy as formatPerkValue,
  Vu as hasBadgeValue,
  bS as hasEntryView,
  B8 as hasFieldControl,
  T6 as hasOptionPreview,
  me as iconPath,
  dm as imageHasTransparency,
  Qn as initializeAppearance,
  cn as isDark,
  pn as matchCatalogItem,
  lC as mergeLayoutItems,
  Om as navigationMenuTriggerStyle,
  pg as optionPreview,
  nC as packWidgetColumns,
  aC as parseWidgetId,
  Wy as perkGranted,
  fn as readAppearance,
  zc as readServerAppearance,
  N4 as registerBuiltInFieldControls,
  hS as registerEntryView,
  xe as registerFieldControl,
  It as registerOptionPreview,
  bw as registeredEntryViews,
  A8 as registeredFieldTypes,
  vg as registeredOptionPreviews,
  U8 as resetAppearanceBootstrapForTests,
  yS as resetEntryViews,
  _8 as resetFieldControls,
  I6 as resetOptionPreviews,
  Te as resolveActionIcon,
  K8 as setAppearancePersister,
  Am as sidebarMenuButtonVariants,
  My as statusBadgeVariant,
  Sy as statusTone,
  q8 as syncAppearanceFromInertiaPage,
  oC as toPersistedLayout,
  S8 as toUrl,
  ta as useAppearance,
  $S as useColumnVisibility,
  wS as useColumnWidths,
  CS as useLiveUpdates,
  X4 as usePointer,
  ca as useReveal,
  F8 as useSchemaColumns,
  m3 as useScrollProgress,
  z6 as useShellPageFooter,
  Lt as useSidebar,
  SS as useTenantTheme,
  gS as useUnsavedChanges,
  PS as version,
  Cn as widgetId
};
//# sourceMappingURL=index.js.map

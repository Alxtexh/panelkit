import './ui.css';
import { defineComponent as V, useSlots as aa, openBlock as t, createElementBlock as n, normalizeClass as z, unref as y, renderSlot as Z, createElementVNode as l, toDisplayString as f, createCommentVNode as b, computed as h, normalizeStyle as ie, Fragment as P, renderList as O, ref as K, watch as ge, useId as lt, withModifiers as be, createTextVNode as q, createVNode as F, createStaticVNode as vt, createBlock as T, createSlots as gt, withCtx as L, nextTick as Ve, onBeforeUnmount as Me, Teleport as yt, Transition as ot, onMounted as ke, withDirectives as xe, vModelText as Le, mergeProps as re, normalizeProps as De, guardReactiveProps as Ke, resolveDynamicComponent as ze, resolveComponent as na, vModelSelect as et, vModelDynamic as hn, defineAsyncComponent as ya, inject as At, vShow as Ye, withKeys as zt, onUnmounted as bn, isRef as yn, useTemplateRef as xn, onErrorCaptured as kn, provide as qt, reactive as ht, useModel as xt, mergeModels as Ue, markRaw as $n, shallowRef as wn, getCurrentInstance as Da, watchEffect as Cn } from "vue";
import { router as Mn, usePage as la, Link as Gt } from "@inertiajs/vue3";
import { useForwardPropsEmits as we, DialogRoot as Ta, DialogOverlay as oa, DialogPortal as sa, DialogContent as ra, DialogClose as st, CheckboxRoot as Sn, CheckboxIndicator as Bn, SwitchRoot as An, SwitchThumb as zn, DialogDescription as Ia, DialogTitle as Ea, DialogTrigger as Fa, createContext as Pn, Primitive as rt, TooltipRoot as _n, TooltipPortal as Vn, TooltipContent as Ln, TooltipArrow as On, TooltipProvider as Na, TooltipTrigger as jn, Separator as Dn, DropdownMenuRoot as Tn, DropdownMenuCheckboxItem as In, DropdownMenuItemIndicator as Ra, DropdownMenuPortal as En, DropdownMenuContent as Fn, DropdownMenuGroup as Nn, useForwardProps as Te, DropdownMenuItem as Rn, DropdownMenuLabel as Hn, DropdownMenuRadioGroup as Un, DropdownMenuRadioItem as Kn, DropdownMenuSeparator as qn, DropdownMenuSub as Gn, DropdownMenuSubContent as Wn, DropdownMenuSubTrigger as Zn, DropdownMenuTrigger as Yn, AvatarRoot as Jn, AvatarFallback as Qn, AvatarImage as Xn, NavigationMenuViewport as el, NavigationMenuRoot as tl, NavigationMenuContent as al, NavigationMenuIndicator as nl, NavigationMenuItem as ll, NavigationMenuLink as ol, NavigationMenuList as sl, NavigationMenuTrigger as rl, Label as il } from "reka-ui";
import { DropdownMenuPortal as dS } from "reka-ui";
import { X as ia, Check as Ha, AlertCircle as dl, EyeOff as ul, Eye as cl, PanelLeftOpen as fl, PanelLeftClose as ml, Circle as pl, ChevronRight as Ua, MoreHorizontal as vl, ChevronDown as gl, Loader2Icon as hl } from "@lucide/vue";
import { reactiveOmit as ye, useVModel as Ka, useMediaQuery as bl, useEventListener as yl, defaultDocument as xl } from "@vueuse/core";
import { clsx as kl } from "clsx";
import { twMerge as $l } from "tailwind-merge";
import { cva as da } from "class-variance-authority";
const Bt = {
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
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01",
  megaphone: "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14 M8 6v8",
  sparkles: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z M20 2v4 M22 4h-4 M2 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
  // Three tiles (rx omitted - negligible at icon scale): a large header row
  // over two smaller ones, matching Lucide's layout-template exactly.
  "layout-template": "M3 3h18v7H3Z M3 14h9v7H3Z M16 14h5v7h-5Z",
  /*
   * RESOURCE NAVIGATION ICONS missing from this file - a DIFFERENT gap
   * from the "row-menu vocabulary" block above. Desktop's sidebar
   * resolves a resource's `navigationIcon` through `panelIcons.ts` (a
   * Lucide Vue component per name); `PkBottomNav.vue` resolves the SAME
   * name through THIS file's `iconPath()` instead, for the mobile bottom
   * bar and its "More" sheet - two independently-maintained registries
   * for one semantic name. `users` already had a path here (see above);
   * `user`/`receipt`/`shopping-bag`/`shopping-cart`/`life-buoy` did not,
   * so a Users/Invoices/Products/Orders/Tickets-shaped resource that
   * rendered a distinct icon on desktop still fell back to the generic
   * `dot` on mobile. Circles below are converted to two-arc paths (the
   * same substitution `sparkles` above already uses), since this
   * registry is path data only.
   */
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",
  receipt: "M12 17V7 M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8 M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z",
  "shopping-bag": "M16 10a4 4 0 0 1-8 0 M3.103 6.034h17.794 M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
  "shopping-cart": "m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18 M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25 M16 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M6 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
  "life-buoy": "M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M4.93 4.93l4.24 4.24 M14.83 9.17l4.24-4.24 M14.83 14.83l4.24 4.24 M9.17 14.83l-4.24 4.24 M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",
  /*
   * THE SAME GAP AS THE BLOCK ABOVE, found the same way: every name in
   * `PANEL_ICONS` (`panelIcons.ts`, the desktop sidebar's registry) is
   * supposed to also resolve here for the mobile bottom bar - proven now
   * by `IconRegistryParityTest`, not merely hoped. These thirteen were
   * declared there and missing here, so a resource using any of them
   * looked correct on desktop and fell back to the dot on mobile - the
   * PanelKit ↔ Filament release-candidate audit that found `user-cog`
   * (an UNCURATED name, unrelated to this gap - see `PANEL_ICONS`'s own
   * "curated subset" note) is what prompted actually enumerating every
   * curated name and checking it both ways.
   *
   * Copied from `@lucide/vue`'s icon sources, same technique and same
   * `m`→`M` capitalisation care as the blocks above (see that note before
   * touching any of these). `layout-grid`'s four `<rect rx="1">` primitives
   * are hand-expanded to rounded-corner paths, verified by actually
   * rendering this file's icons to PNG and looking - the method this
   * file's own docblock already prescribes for exactly this risk.
   */
  list: "M3 5h.01 M3 12h.01 M3 19h.01 M8 5h13 M8 12h13 M8 19h13",
  "layout-grid": "M4 3H9A1 1 0 0 1 10 4V9A1 1 0 0 1 9 10H4A1 1 0 0 1 3 9V4A1 1 0 0 1 4 3Z M15 3H20A1 1 0 0 1 21 4V9A1 1 0 0 1 20 10H15A1 1 0 0 1 14 9V4A1 1 0 0 1 15 3Z M15 14H20A1 1 0 0 1 21 15V20A1 1 0 0 1 20 21H15A1 1 0 0 1 14 20V15A1 1 0 0 1 15 14Z M4 14H9A1 1 0 0 1 10 15V20A1 1 0 0 1 9 21H4A1 1 0 0 1 3 20V15A1 1 0 0 1 4 14Z",
  "circle-check": "M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M16 9l-5.5 5.5L8 12",
  flag: "M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",
  folder: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
  map: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z M15 5.764v15 M9 3.236v15",
  rocket: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5 M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09 M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05",
  "scroll-text": "M15 12h-5 M15 8h-5 M19 17V5a2 2 0 0 0-2-2H4 M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
  "user-plus": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0 M19 8v6 M22 11h-6",
  webhook: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2 M6 17l3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06 M12 6l3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8",
  help: "M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01",
  faq: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719 M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01",
  building: "M12 10h.01 M12 14h.01 M12 6h.01 M16 10h.01 M16 14h.01 M16 6h.01 M8 10h.01 M8 14h.01 M8 6h.01 M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3 M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z",
  // Two more of the same gap, found by `iconRegistryParity.spec.ts` itself
  // rather than by re-reading `PANEL_ICONS` by eye a second time - exactly
  // what that test exists to catch going forward.
  file: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z M14 2v5a1 1 0 0 0 1 1h5",
  "message-circle": "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"
}, wl = {
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
}, xa = {
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
}, ka = {
  success: "coins",
  danger: "trash",
  warning: "alert",
  primary: "activity",
  info: "info",
  gray: "circle"
};
function me(e) {
  if (!e)
    return Bt.dot;
  const o = wl[e] ?? e;
  return Bt[o] ?? Bt.dot;
}
function Fe(e) {
  if (e.icon) {
    const s = me(e.icon);
    if (s !== Bt.dot || e.icon === "dot")
      return s;
  }
  const o = (e.key ?? "").trim();
  if (o) {
    const s = xa[o] ?? xa[o.replace(/_/g, "-")];
    if (s)
      return me(s);
  }
  const a = Cl(e.label);
  if (a)
    return me(a);
  if (e.destructive)
    return me("trash");
  const r = e.color ?? "";
  return r && ka[r] ? me(ka[r]) : me("circle");
}
function Cl(e) {
  if (!e)
    return null;
  const o = e.toLowerCase();
  return /\b(delete|remove|destroy|trash)\b/.test(o) ? "trash" : /\b(log\s*in|impersonat|sign\s*in\s+as)\b/.test(o) ? "log-in" : /\b(recharge|credit|wallet|top\s*up|topup)\b/.test(o) ? "coins" : /\b(edit|update)\b/.test(o) ? "pencil" : /\b(view|open|show)\b/.test(o) ? "eye" : /\b(restore|undo)\b/.test(o) ? "undo" : /\b(copy|replicate|duplicate)\b/.test(o) ? "copy" : /\b(export|download)\b/.test(o) ? "download" : /\b(suspend|ban|block)\b/.test(o) ? "ban" : /\b(activate|resume|enable)\b/.test(o) ? "play" : null;
}
const Ml = {
  key: 0,
  class: "flex max-w-xs items-center justify-center",
  "aria-hidden": "true"
}, Sl = ["d"], Bl = { class: "flex max-w-sm flex-col gap-1" }, Al = {
  key: 0,
  class: "text-sm font-normal"
}, zl = {
  key: 2,
  class: "mt-1 flex flex-wrap items-center justify-center gap-2"
}, Wt = /* @__PURE__ */ V({
  __name: "PkEmptyState",
  props: {
    title: {},
    description: {},
    icon: { default: "package" },
    compact: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = aa();
    return (a, r) => (t(), n("div", {
      "data-slot": "empty-state",
      class: z(["text-muted-foreground flex flex-col items-center justify-center text-center", e.compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-12"]),
      role: "status"
    }, [
      y(o).illustration ? (t(), n("div", Ml, [
        Z(a.$slots, "illustration")
      ])) : (t(), n("div", {
        key: 1,
        class: z(["bg-muted text-muted-foreground flex items-center justify-center rounded-full", e.compact ? "size-10" : "size-12"]),
        "aria-hidden": "true"
      }, [
        Z(a.$slots, "icon", {}, () => [
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
              d: y(me)(e.icon)
            }, null, 8, Sl)
          ], 2))
        ])
      ], 2)),
      l("div", Bl, [
        l("p", {
          class: z(["text-foreground font-medium", e.compact ? "text-sm" : "text-base"])
        }, f(e.title), 3),
        e.description ? (t(), n("p", Al, f(e.description), 1)) : b("", !0)
      ]),
      a.$slots.actions ? (t(), n("div", zl, [
        Z(a.$slots, "actions")
      ])) : b("", !0)
    ], 2));
  }
}), Pl = ["aria-label"], je = /* @__PURE__ */ V({
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
    }, r = h(() => a[o.variant] ?? a.text), s = h(() => Math.max(1, Math.min(o.count, 50)));
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
      (t(!0), n(P, null, O(s.value, (c) => (t(), n("span", {
        key: c,
        "aria-hidden": "true",
        class: z(["bg-muted motion-safe:animate-pulse rounded", r.value]),
        style: ie({
          width: i(c - 1),
          height: e.height && e.variant === "block" ? `${e.height}px` : void 0
        })
      }, null, 6))), 128))
    ], 12, Pl));
  }
}), _l = { class: "w-max min-w-full border-collapse text-sm" }, Vl = { class: "bg-background sticky top-0 z-10" }, Ll = {
  key: 0,
  class: "bg-muted/40"
}, Ol = {
  key: 0,
  class: "w-8 border-b px-2 py-1.5"
}, jl = {
  key: 1,
  class: "w-10 border-b px-3 py-1.5"
}, Dl = ["colspan"], Tl = {
  key: 2,
  class: "pk-actions bg-muted/40 sticky right-0 w-12 border-b border-l px-2 py-1.5 shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, Il = { class: "bg-muted/50" }, El = {
  key: 0,
  class: "w-8 border-b px-2 py-2.5"
}, Fl = ["id", "checked", "indeterminate"], Nl = ["onClick"], Rl = {
  key: 0,
  class: "text-xs"
}, Hl = {
  key: 1,
  class: "text-xs opacity-40"
}, Ul = { key: 1 }, Kl = ["aria-label", "onPointerdown"], ql = {
  key: 2,
  class: "pk-actions bg-muted/50 sticky right-0 w-12 border-b border-l px-2 py-2.5 shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, Gl = {
  key: 0,
  "data-slot": "table-skeleton",
  class: "transition-opacity"
}, Wl = {
  key: 0,
  class: "w-8 px-2 py-2.5"
}, Zl = {
  key: 1,
  class: "px-3 py-2.5"
}, Yl = {
  key: 2,
  class: "px-2 py-2.5"
}, Jl = {
  key: 0,
  class: "bg-muted/40"
}, Ql = ["colspan"], Xl = ["aria-expanded", "dusk", "onClick"], eo = {
  class: "text-[9px]",
  "aria-hidden": "true"
}, to = {
  key: 1,
  dusk: "group-header"
}, ao = ["draggable", "onDragstart", "onDragover", "onDrop", "onContextmenu", "onClick"], no = {
  key: 0,
  class: "w-8 px-2 py-2 align-middle"
}, lo = ["id", "value", "checked", "disabled", "aria-label", "onClick"], oo = {
  key: 0,
  class: "inline-flex items-center gap-1.5"
}, so = ["aria-label", "onClick"], ro = { class: "text-xs" }, io = {
  key: 1,
  class: "text-muted-foreground"
}, uo = { key: 2 }, co = {
  key: 2,
  class: "pk-actions bg-background group-hover:bg-muted/40 sticky right-0 border-l px-2 py-2 text-right shadow-[-8px_0_8px_-8px_rgb(0_0_0/0.25)]"
}, fo = {
  key: 2,
  class: "bg-muted/40 border-t-2"
}, mo = { key: 0 }, po = { class: "text-muted-foreground block text-[10px] font-medium" }, vo = { class: "font-semibold tabular-nums" }, go = { key: 1 }, ho = 40, bo = /* @__PURE__ */ V({
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
    function r(N) {
      if (!N || !a.groupBy)
        return "";
      if (N.__group !== void 0 && N.__group !== null)
        return String(N.__group);
      const le = N[a.groupBy.key];
      return le == null || le === "" ? "" : String(le);
    }
    function s(N) {
      return a.groupBy ? N === 0 ? !0 : r(a.rows[N]) !== r(a.rows[N - 1]) : !1;
    }
    function i(N) {
      if (N.__groupTitle)
        return String(N.__groupTitle);
      const le = a.groupBy ? N[a.groupBy.key] : null, ne = le == null || le === "" ? "None" : String(le);
      return !a.groupBy || a.groupBy.titlePrefixed === !1 ? ne : `${a.groupBy.label}: ${ne}`;
    }
    const d = K(/* @__PURE__ */ new Set()), u = K(/* @__PURE__ */ new Set());
    function c(N) {
      return a.groupBy?.collapsible ? d.value.has(N) : !1;
    }
    function v(N) {
      if (!a.groupBy?.collapsible)
        return;
      const le = new Set(u.value);
      le.add(N), u.value = le;
      const ne = new Set(d.value);
      ne.has(N) ? ne.delete(N) : ne.add(N), d.value = ne;
    }
    function p(N) {
      return a.groupBy?.collapsible ? !c(r(a.rows[N])) : !0;
    }
    ge(
      () => a.rows,
      (N) => {
        if (!a.groupBy?.collapsible || !a.collapsedGroupsByDefault)
          return;
        const le = new Set(d.value);
        for (const ne of N) {
          const fe = r(ne);
          fe !== "" && !u.value.has(fe) && le.add(fe);
        }
        d.value = le;
      },
      { immediate: !0 }
    );
    const x = K(null), M = K(null);
    function $(N, le) {
      x.value = N, le.dataTransfer?.setData("text/plain", String(N)), le.dataTransfer && (le.dataTransfer.effectAllowed = "move");
    }
    function C() {
      x.value = null, M.value = null;
    }
    function k(N) {
      return x.value === null || M.value !== N ? "" : x.value > N ? "border-primary border-t-2" : "border-primary border-b-2";
    }
    function B(N, le) {
      x.value !== null && (le.preventDefault(), M.value = N);
    }
    function A(N) {
      const le = x.value;
      if (x.value = null, M.value = null, le === null || le === N)
        return;
      const ne = a.rows.map((de) => de[a.rowKey]), [fe] = ne.splice(le, 1);
      ne.splice(N, 0, fe), w("reorder", ne);
    }
    const w = o;
    function m(N, le) {
      !a.rowClickable || a.reordering || le.button !== 0 || le.metaKey || le.ctrlKey || le.shiftKey || le.altKey || le.target?.closest('a, button, input, select, textarea, label, [role="menuitem"]') || (window.getSelection()?.toString().length ?? 0) > 0 || w("row-click", N);
    }
    const g = K(null), S = lt(), I = h(() => a.columns.filter((N) => !a.hidden?.has(N.key))), j = h(() => {
      const N = I.value.find((le) => le.sticky);
      return N ? N.key : a.stickyFirst && I.value.length > 0 ? I.value[0].key : null;
    });
    function X(N) {
      return j.value === N.key;
    }
    function W() {
      return a.selectable && !a.reordering ? `${ho}px` : "0";
    }
    function Q(N) {
      const le = a.columnWidths?.[N.key];
      return typeof le == "number" ? le : N.width;
    }
    function Y(N) {
      const le = Q(N), ne = X(N), fe = {};
      return le !== void 0 && (fe.width = `${le}px`, fe.minWidth = `${le}px`, fe.maxWidth = `${le}px`), ne && (fe.left = W()), Object.keys(fe).length ? fe : void 0;
    }
    function G(N) {
      return a.resizable ? N.resizable !== !1 : !1;
    }
    function R(N, le) {
      if (!G(N))
        return;
      le.preventDefault(), le.stopPropagation();
      const ne = le.clientX, fe = Q(N) ?? 160, de = le.currentTarget;
      try {
        de.setPointerCapture(le.pointerId);
      } catch {
      }
      function Je(ct) {
        const Ft = fe + (ct.clientX - ne);
        w("resize", N.key, Math.min(1200, Math.max(48, Ft)));
      }
      function qe(ct) {
        try {
          de.releasePointerCapture(ct.pointerId);
        } catch {
        }
        de.removeEventListener("pointermove", Je), de.removeEventListener("pointerup", qe), de.removeEventListener("pointercancel", qe);
      }
      de.addEventListener("pointermove", Je), de.addEventListener("pointerup", qe), de.addEventListener("pointercancel", qe);
    }
    const H = h(() => I.value.some((N) => !!N.group)), ae = h(() => {
      const N = [];
      for (const le of I.value) {
        const ne = le.group ?? null, fe = N[N.length - 1];
        fe && fe.label === ne ? fe.span += 1 : N.push({ label: ne, span: 1, key: `${ne ?? "loose"}-${le.key}` });
      }
      return N;
    });
    function _(N) {
      const le = N[a.rowKey];
      return le == null || le === "" ? null : le;
    }
    function ee(N) {
      const le = _(N);
      return le !== null && !!a.selected?.has(le);
    }
    const D = K(null);
    function E(N) {
      return a.rows.findIndex((le) => {
        const ne = _(le);
        return ne !== null && ne === N;
      });
    }
    function U(N, le) {
      const ne = _(N);
      if (ne === null)
        return;
      const fe = le.shiftKey, de = !!a.selected?.has(ne);
      if (fe && D.value !== null && D.value !== ne) {
        const Je = E(D.value), qe = E(ne);
        if (Je !== -1 && qe !== -1) {
          const ct = Math.min(Je, qe), Ft = Math.max(Je, qe), gn = !de;
          for (let Mt = ct; Mt <= Ft; Mt++) {
            if (!p(Mt))
              continue;
            const Nt = _(a.rows[Mt]);
            if (Nt === null)
              continue;
            !!a.selected?.has(Nt) !== gn && w("toggle-row", Nt);
          }
          D.value = ne;
          return;
        }
      }
      w("toggle-row", ne), D.value = ne;
    }
    const J = h(
      () => a.rows.map((N) => _(N)).filter((N) => N !== null)
    ), te = h(
      () => J.value.length > 0 && J.value.every((N) => a.selected?.has(N))
    ), he = h(
      () => !te.value && J.value.some((N) => a.selected?.has(N))
    );
    function ve(N) {
      return N.sortKey ?? N.key;
    }
    function pe(N) {
      return a.sort === ve(N);
    }
    async function $e(N, le, ne) {
      try {
        await navigator.clipboard.writeText(String(ne)), g.value = `${N}-${le.key}`, setTimeout(() => g.value = null, 1200);
      } catch {
      }
    }
    const Xe = h(
      () => !!a.summaries && !!a.summaryValues && Object.keys(a.summaries).length > 0
    );
    function ce(N) {
      return a.summaries?.[N] ?? null;
    }
    function se(N) {
      const le = a.summaries?.[N], ne = a.summaryValues?.[N];
      if (!le)
        return "";
      if (ne == null)
        return "None";
      const fe = le.divideBy ? ne / le.divideBy : ne, de = new Intl.NumberFormat(void 0, {
        minimumFractionDigits: le.decimals,
        maximumFractionDigits: le.decimals
      }).format(fe);
      return `${le.prefix ?? ""}${de}${le.suffix ?? ""}`;
    }
    return (N, le) => (t(), n("div", {
      class: z(["pk-scroll relative min-h-0 w-full min-w-0 max-w-full shrink grow-0 overflow-x-auto overflow-y-auto overscroll-x-contain", e.framed ? "rounded-lg border shadow-sm" : ""])
    }, [
      l("table", _l, [
        l("thead", Vl, [
          H.value ? (t(), n("tr", Ll, [
            e.reordering ? (t(), n("th", Ol)) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("th", jl)) : b("", !0),
            (t(!0), n(P, null, O(ae.value, (ne) => (t(), n("th", {
              key: ne.key,
              colspan: ne.span,
              class: "text-muted-foreground border-b px-3 py-1.5 text-left text-xs font-medium"
            }, f(ne.label ?? ""), 9, Dl))), 128)),
            N.$slots.actions ? (t(), n("th", Tl)) : b("", !0)
          ])) : b("", !0),
          l("tr", Il, [
            e.reordering ? (t(), n("th", El)) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("th", {
              key: 1,
              class: z(["w-10 border-b px-3 py-2.5", j.value ? "bg-muted/50 sticky left-0 z-[11]" : ""])
            }, [
              l("input", {
                id: `${y(S)}-page`,
                type: "checkbox",
                class: "accent-primary size-3.5 cursor-pointer align-middle",
                checked: te.value,
                indeterminate: he.value,
                "aria-label": "Select all rows on this page",
                onClick: le[0] || (le[0] = be(() => {
                }, ["stop"])),
                onChange: le[1] || (le[1] = be((ne) => w("toggle-page", !te.value), ["stop"]))
              }, null, 40, Fl)
            ], 2)) : b("", !0),
            (t(!0), n(P, null, O(I.value, (ne) => (t(), n("th", {
              key: ne.key,
              class: z([
                "text-muted-foreground relative border-b px-3 py-2.5 text-left font-medium whitespace-nowrap",
                X(ne) ? "bg-muted/50 sticky z-[11] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)]" : ""
              ]),
              style: ie(Y(ne))
            }, [
              ne.sortable ? (t(), n("button", {
                key: 0,
                class: "hover:text-foreground inline-flex items-center gap-1 transition-colors",
                onClick: (fe) => w("sort", ve(ne))
              }, [
                q(f(ne.label) + " ", 1),
                pe(ne) ? (t(), n("span", Rl, f(e.direction === "desc" ? "↓" : "↑"), 1)) : (t(), n("span", Hl, "↕"))
              ], 8, Nl)) : (t(), n("span", Ul, f(ne.label), 1)),
              G(ne) ? (t(), n("span", {
                key: 2,
                class: "hover:bg-primary/40 absolute top-0 right-0 z-[12] h-full w-1.5 cursor-col-resize",
                role: "separator",
                "aria-orientation": "vertical",
                "aria-label": `Resize ${ne.label}`,
                onPointerdown: (fe) => R(ne, fe)
              }, null, 40, Kl)) : b("", !0)
            ], 6))), 128)),
            N.$slots.actions ? (t(), n("th", ql, [...le[2] || (le[2] = [
              l("span", { class: "sr-only" }, "Actions", -1)
            ])])) : b("", !0)
          ])
        ]),
        e.loading && e.rows.length === 0 ? (t(), n("tbody", Gl, [
          (t(), n(P, null, O(6, (ne) => l("tr", {
            key: `skel-${ne}`,
            class: "border-b"
          }, [
            e.reordering ? (t(), n("td", Wl, [
              F(je, {
                variant: "circle",
                class: "!size-4"
              })
            ])) : b("", !0),
            e.selectable && !e.reordering ? (t(), n("td", Zl, [
              F(je, {
                variant: "circle",
                class: "!size-4"
              })
            ])) : b("", !0),
            (t(!0), n(P, null, O(I.value, (fe) => (t(), n("td", {
              key: fe.key,
              class: "px-3 py-2.5"
            }, [
              F(je, { variant: "text" })
            ]))), 128)),
            N.$slots.actions ? (t(), n("td", Yl, [
              F(je, {
                variant: "circle",
                class: "!size-4 ml-auto"
              })
            ])) : b("", !0)
          ])), 64))
        ])) : (t(), n("tbody", {
          key: 1,
          class: z(e.loading ? "opacity-50 transition-opacity" : "transition-opacity")
        }, [
          (t(!0), n(P, null, O(e.rows, (ne, fe) => (t(), n(P, {
            key: _(ne) ?? `row-${fe}`
          }, [
            e.groupBy && s(fe) ? (t(), n("tr", Jl, [
              l("td", {
                colspan: e.columns.length + (e.selectable ? 1 : 0) + (e.reordering ? 1 : 0) + 1,
                class: "text-muted-foreground px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase"
              }, [
                e.groupBy.collapsible ? (t(), n("button", {
                  key: 0,
                  type: "button",
                  class: "hover:text-foreground inline-flex items-center gap-1.5",
                  "aria-expanded": !c(r(ne)),
                  dusk: `group-header-${r(ne) || "none"}`,
                  onClick: (de) => v(r(ne))
                }, [
                  l("span", eo, f(c(r(ne)) ? "▸" : "▾"), 1),
                  q(" " + f(i(ne)), 1)
                ], 8, Xl)) : (t(), n("span", to, f(i(ne)), 1))
              ], 8, Ql)
            ])) : b("", !0),
            p(fe) ? (t(), n("tr", {
              key: 1,
              "data-slot": "table-row",
              class: z(["group pk-row border-b transition-colors hover:bg-muted/50", [
                ee(ne) ? "bg-primary/5 shadow-[inset_3px_0_0_0_var(--color-primary)]" : e.striped && fe % 2 === 1 ? "bg-muted/20" : "",
                x.value === fe ? "opacity-40" : "",
                k(fe),
                e.reordering ? "cursor-grab active:cursor-grabbing" : "",
                e.rowClickable && !e.reordering ? "cursor-pointer" : ""
              ]]),
              draggable: e.reordering,
              onDragstart: (de) => $(fe, de),
              onDragover: (de) => B(fe, de),
              onDrop: be((de) => A(fe), ["prevent"]),
              onDragend: C,
              onContextmenu: (de) => w("row-contextmenu", ne, de),
              onClick: (de) => m(ne, de)
            }, [
              e.reordering ? (t(), n("td", no, [...le[3] || (le[3] = [
                vt('<span class="text-muted-foreground/50 flex cursor-grab active:cursor-grabbing" aria-hidden="true" data-v-33b13e51><svg class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-v-33b13e51><circle cx="9" cy="6" r="1.5" data-v-33b13e51></circle><circle cx="15" cy="6" r="1.5" data-v-33b13e51></circle><circle cx="9" cy="12" r="1.5" data-v-33b13e51></circle><circle cx="15" cy="12" r="1.5" data-v-33b13e51></circle><circle cx="9" cy="18" r="1.5" data-v-33b13e51></circle><circle cx="15" cy="18" r="1.5" data-v-33b13e51></circle></svg></span>', 1)
              ])])) : b("", !0),
              e.selectable && !e.reordering ? (t(), n("td", {
                key: 1,
                class: z([
                  "px-3 py-2",
                  j.value ? "bg-background sticky left-0 z-[1] group-hover:bg-muted/50" : ""
                ])
              }, [
                l("input", {
                  id: `${y(S)}-row-${_(ne) ?? fe}`,
                  type: "checkbox",
                  class: "accent-primary size-3.5 cursor-pointer align-middle",
                  value: _(ne) ?? void 0,
                  checked: ee(ne),
                  disabled: _(ne) === null,
                  "aria-label": _(ne) === null ? "This row has no id and cannot be selected" : `Select row ${_(ne)}`,
                  onClick: be((de) => U(ne, de), ["stop"])
                }, null, 8, lo)
              ], 2)) : b("", !0),
              (t(!0), n(P, null, O(I.value, (de) => (t(), n("td", {
                key: de.key,
                class: z(["px-3 py-2 whitespace-nowrap", [
                  de.cellClass,
                  X(de) ? "bg-background sticky z-[1] shadow-[8px_0_8px_-8px_rgb(0_0_0/0.25)] group-hover:bg-muted/50" : ""
                ]]),
                style: ie(Y(de))
              }, [
                Z(N.$slots, `cell:${de.key}`, {
                  row: ne,
                  value: ne[de.key],
                  column: de
                }, () => [
                  de.copyable ? (t(), n("span", oo, [
                    q(f(ne[de.key]) + " ", 1),
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:text-foreground rounded p-0.5 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100",
                      "aria-label": `Copy ${de.label.toLowerCase()}`,
                      onClick: (Je) => $e(String(ne[e.rowKey]), de, ne[de.key])
                    }, [
                      l("span", ro, f(g.value === `${ne[e.rowKey]}-${de.key}` ? "✓" : "⧉"), 1)
                    ], 8, so)
                  ])) : ne[de.key] == null || ne[de.key] === "" ? (t(), n("span", io, "None")) : (t(), n("span", uo, f(ne[de.key]), 1))
                ], !0)
              ], 6))), 128)),
              N.$slots.actions ? (t(), n("td", co, [
                Z(N.$slots, "actions", { row: ne }, void 0, !0)
              ])) : b("", !0)
            ], 42, ao)) : b("", !0)
          ], 64))), 128))
        ], 2)),
        Xe.value ? (t(), n("tfoot", fo, [
          l("tr", null, [
            e.selectable ? (t(), n("td", mo)) : b("", !0),
            (t(!0), n(P, null, O(e.columns, (ne) => (t(), n(P, {
              key: `s-${ne.key}`
            }, [
              e.hidden?.has(ne.key) ? b("", !0) : (t(), n("td", {
                key: 0,
                class: z(["px-3 py-2 align-top text-sm whitespace-nowrap", ne.cellClass])
              }, [
                ce(ne.key) ? (t(), n(P, { key: 0 }, [
                  l("span", po, f(ce(ne.key).label), 1),
                  l("span", vo, f(se(ne.key)), 1)
                ], 64)) : b("", !0)
              ], 2))
            ], 64))), 128)),
            N.$slots.actions ? (t(), n("td", go)) : b("", !0)
          ])
        ])) : b("", !0)
      ]),
      e.rows.length === 0 && !e.loading && e.filtered ? (t(), T(Wt, {
        key: 0,
        compact: "",
        icon: "search",
        title: "Nothing matches these filters",
        description: "Try clearing filters or searching for something else."
      }, gt({ _: 2 }, [
        N.$slots["clear-filters"] ? {
          name: "actions",
          fn: L(() => [
            Z(N.$slots, "clear-filters", {}, void 0, !0)
          ]),
          key: "0"
        } : void 0
      ]), 1024)) : e.rows.length === 0 && !e.loading ? (t(), T(Wt, {
        key: 1,
        icon: e.emptyIcon,
        title: e.emptyTitle,
        description: e.emptyHint
      }, gt({ _: 2 }, [
        N.$slots["empty-actions"] ? {
          name: "actions",
          fn: L(() => [
            Z(N.$slots, "empty-actions", {}, void 0, !0)
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["icon", "title", "description"])) : b("", !0)
    ], 2));
  }
}), it = (e, o) => {
  const a = e.__vccOpts || e;
  for (const [r, s] of o)
    a[r] = s;
  return a;
}, yo = /* @__PURE__ */ it(bo, [["__scopeId", "data-v-33b13e51"]]), dt = "w-full min-w-0 px-4 py-6 sm:px-6", W8 = "w-full min-w-0 p-3 sm:p-4", Z8 = "w-full min-w-0 space-y-6 px-4 py-6 sm:px-6", xo = "w-full max-w-7xl", ko = "px-4 py-4", qa = "w-full min-w-0", $o = {
  /** Filters, short lists (~24rem). */
  sm: "w-full max-w-sm",
  /** Notifications, inspect (~28rem). */
  md: "w-full max-w-md",
  /** Secondary action forms (~36rem). */
  lg: "w-full max-w-xl",
  /** Opt-in CRUD slide-over (~42rem). */
  xl: "w-full max-w-2xl"
}, ft = "bg-popover text-popover-foreground flex w-full max-h-[min(85vh,720px)] flex-col overflow-hidden rounded-xl border shadow-2xl", Pt = {
  /** Short confirmations with no fields (~24rem). */
  sm: `${ft} max-w-md`,
  /** The long-standing default: confirmations and short copy (~32rem). */
  confirm: `${ft} max-w-lg`,
  /** Wider than confirm when an action form needs more room than confirm copy (~36rem). */
  form: `${ft} max-w-xl`,
  /** A field stack too wide for `form` without becoming a page (~42rem). */
  lg: `${ft} max-w-2xl`,
  /** The widest dense modal offers - past this, use PkSlideover instead (~56rem). */
  xl: `${ft} max-w-4xl`
}, Y8 = Pt.confirm, J8 = Pt.form, pt = /* @__PURE__ */ new Set();
let Zt = "";
function Ga(e) {
  typeof document > "u" || pt.has(e) || (pt.size === 0 && (Zt = document.body.style.overflow), pt.add(e), document.body.style.overflow = "hidden");
}
function _t(e) {
  return typeof document > "u" || !pt.delete(e) ? !1 : pt.size === 0 ? (document.body.style.overflow = Zt, Zt = "", !0) : !1;
}
const wo = ["aria-busy", "aria-describedby"], Co = { class: "bg-popover sticky top-0 z-10 shrink-0 border-b px-6 py-5" }, Mo = {
  key: 0,
  "data-slot": "modal-footer",
  class: "bg-muted/30 sticky bottom-0 z-10 flex shrink-0 flex-wrap items-center justify-end gap-3 border-t px-6 py-4 [&>[data-slot='button']]:min-h-10 [&>[data-slot='button']]:min-w-20 [&>[data-slot='button']]:px-4 [&>[data-slot='button'][data-variant='destructive']]:min-w-24"
}, bt = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(null), i = `pk-modal-title-${lt()}`, d = `pk-modal-description-${lt()}`, u = /* @__PURE__ */ Symbol("pk-modal");
    let c = null, v = !1;
    const p = K(!1), x = h(() => Pt[a.size] ?? Pt.confirm);
    function M(k) {
      p.value = k.target === k.currentTarget;
    }
    function $(k) {
      p.value && k.target === k.currentTarget && !a.busy && r("close"), p.value = !1;
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
      const B = s.value.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (B.length === 0)
        return;
      const A = B[0], w = B[B.length - 1];
      k.shiftKey && document.activeElement === A ? (k.preventDefault(), w.focus()) : !k.shiftKey && document.activeElement === w && (k.preventDefault(), A.focus());
    }
    return ge(
      () => a.open,
      (k) => {
        if (k)
          c = document.activeElement, Ga(u), v = !0, document.addEventListener("keydown", C), Ve(
            () => s.value?.querySelector("input, select, textarea, button")?.focus()
          );
        else if (v) {
          const B = _t(u);
          v = !1, document.removeEventListener("keydown", C), B && c?.focus(), c = null;
        }
      },
      { immediate: !0 }
    ), Me(() => {
      document.removeEventListener("keydown", C), v && (_t(u), v = !1);
    }), (k, B) => (t(), T(yt, { to: "body" }, [
      F(ot, {
        "enter-active-class": "transition duration-100 ease-out",
        "enter-from-class": "opacity-0",
        "leave-active-class": "transition duration-75 ease-in",
        "leave-to-class": "opacity-0"
      }, {
        default: L(() => [
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
              class: z(x.value)
            }, [
              l("div", Co, [
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
                  y(qa)
                ])
              }, [
                Z(k.$slots, "default")
              ], 2),
              k.$slots.footer ? (t(), n("div", Mo, [
                Z(k.$slots, "footer")
              ])) : b("", !0)
            ], 10, wo)
          ], 32)) : b("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), So = 160, Ze = /* @__PURE__ */ V({
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
    let c = null;
    function v(m) {
      !a.dismissOnPanelClick || m.target?.closest("input, select, textarea, label, [data-keep-open]") || C();
    }
    async function p() {
      c && (clearTimeout(c), c = null), !r.value && (r.value = !0, await Ve(), k());
    }
    function x() {
      c = setTimeout(C, 180);
    }
    async function M() {
      u.value = null, r.value = !r.value, r.value && (await Ve(), k());
    }
    async function $(m, g) {
      u.value = { x: m, y: g }, r.value = !0, await Ve(), k();
    }
    function C() {
      r.value = !1, u.value = null;
    }
    function k() {
      const m = s.value, g = i.value;
      if (!m || !g)
        return;
      const S = g.getBoundingClientRect(), I = 8, j = u.value ? new DOMRect(u.value.x, u.value.y, 0, 0) : m.getBoundingClientRect();
      let X, W;
      if (a.placement === "bottom")
        X = j.bottom + a.offset, X + S.height > window.innerHeight - I && j.top - S.height - a.offset > I && (X = j.top - S.height - a.offset), W = a.align === "end" && !u.value ? j.right - S.width : j.left;
      else {
        X = j.top;
        const Q = a.placement === "right", Y = j.right + a.offset + S.width < window.innerWidth - I, G = j.left - a.offset - S.width > I;
        W = (Q ? Y || !G : !G && Y) ? j.right + a.offset : j.left - a.offset - S.width;
      }
      W = Math.min(Math.max(I, W), window.innerWidth - S.width - I), X = Math.min(Math.max(I, X), window.innerHeight - S.height - I), d.value = { top: X, left: W, minWidth: Math.max(j.width, So) };
    }
    function B(m) {
      if (!r.value)
        return;
      const g = m.target;
      s.value?.contains(g) || i.value?.contains(g) || (g instanceof Element ? g : g.parentElement)?.closest("[data-pk-overlay]") || C();
    }
    function A(m) {
      m.key === "Escape" && r.value && (m.stopPropagation(), C());
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
    return ke(() => {
      document.addEventListener("pointerdown", B), document.addEventListener("keydown", A), window.addEventListener("scroll", w, !0), window.addEventListener("resize", w);
    }), Me(() => {
      c && clearTimeout(c), document.removeEventListener("pointerdown", B), document.removeEventListener("keydown", A), window.removeEventListener("scroll", w, !0), window.removeEventListener("resize", w);
    }), o({ close: C, openAt: $ }), (m, g) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "relative",
      onPointerenter: g[3] || (g[3] = (S) => e.hoverable && p()),
      onPointerleave: g[4] || (g[4] = (S) => e.hoverable && x())
    }, [
      l("div", {
        onClick: g[0] || (g[0] = (S) => e.hoverable ? p() : M())
      }, [
        Z(m.$slots, "trigger", { open: r.value })
      ]),
      (t(), T(yt, { to: "body" }, [
        F(ot, {
          "enter-active-class": "transition duration-100 ease-out",
          "enter-from-class": "opacity-0 scale-95",
          "leave-active-class": "transition duration-75 ease-in",
          "leave-to-class": "opacity-0 scale-95"
        }, {
          default: L(() => [
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
              onPointerenter: g[1] || (g[1] = (S) => e.hoverable && p()),
              onPointerleave: g[2] || (g[2] = (S) => e.hoverable && x()),
              onClick: v
            }, [
              Z(m.$slots, "panel", { close: C })
            ], 38)) : b("", !0)
          ]),
          _: 3
        })
      ]))
    ], 544));
  }
}), Bo = ["disabled", "aria-label", "aria-busy"], Ao = {
  key: 0,
  class: "size-4 animate-spin",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, zo = {
  key: 1,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Po = {
  key: 2,
  class: "bg-primary-foreground/15 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums"
}, _o = {
  key: 3,
  class: "size-4 opacity-80",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Vo = { class: "min-w-[14rem] p-1.5" }, Lo = {
  key: 0,
  class: "text-muted-foreground px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
}, Oo = ["disabled", "onClick"], jo = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Do = ["d"], To = { class: "min-w-0 flex-1 truncate" }, Io = ["disabled"], Eo = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Fo = ["d"], No = {
  key: 2,
  class: "mt-1 border-t px-0 pt-1"
}, Ro = ["disabled", "onClick"], Ho = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Uo = ["d"], Ko = { class: "min-w-0 flex-1 truncate" }, qo = { class: "text-muted-foreground text-sm font-normal" }, Go = { class: "text-foreground font-medium tabular-nums" }, Wo = {
  key: 0,
  class: "text-destructive mt-1 text-xs"
}, Zo = ["disabled"], Yo = { class: "text-muted-foreground text-sm font-normal" }, Jo = { class: "text-foreground font-medium tabular-nums" }, Qo = {
  key: 0,
  class: "text-destructive mt-1 text-xs"
}, Xo = ["disabled"], Q8 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(null), i = K(!1), d = h(() => a.allMatching ? a.total : a.count), u = h(() => d.value !== void 0), c = h(() => u.value && d.value === 0), v = h(() => a.actions.filter((w) => !w.destructive)), p = h(() => a.actions.filter((w) => w.destructive)), x = h(
      () => v.value.length + p.value.length + (a.canExport ? 1 : 0)
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
    function B() {
      i.value = !1, r("export");
    }
    const A = (w) => new Intl.NumberFormat().format(w);
    return (w, m) => (t(), n(P, null, [
      F(Ze, null, {
        trigger: L(() => [
          l("button", {
            type: "button",
            class: "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-60",
            disabled: e.busy,
            "aria-haspopup": "menu",
            "aria-label": e.busy ? "Bulk actions are running" : "Open bulk actions",
            "aria-busy": e.busy
          }, [
            e.busy ? (t(), n("svg", Ao, [...m[5] || (m[5] = [
              l("path", { d: "M12 3a9 9 0 1 0 9 9" }, null, -1)
            ])])) : (t(), n("svg", zo, [...m[6] || (m[6] = [
              l("path", { d: "M4 6h16M7 12h10M10 18h4" }, null, -1)
            ])])),
            l("span", null, f(e.busy ? "Working…" : "Bulk actions"), 1),
            !e.busy && x.value ? (t(), n("span", Po, f(x.value), 1)) : b("", !0),
            e.busy ? b("", !0) : (t(), n("svg", _o, [...m[7] || (m[7] = [
              l("path", { d: "m6 9 6 6 6-6" }, null, -1)
            ])]))
          ], 8, Bo)
        ]),
        panel: L(() => [
          l("div", Vo, [
            v.value.length || e.canExport ? (t(), n("div", Lo, " Actions ")) : b("", !0),
            (t(!0), n(P, null, O(v.value, (g) => (t(), n("button", {
              key: g.key,
              type: "button",
              role: "menuitem",
              class: z(["hover:bg-accent focus:bg-accent flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50", $(g)]),
              disabled: e.busy,
              onClick: (S) => C(g)
            }, [
              (t(), n("svg", jo, [
                l("path", {
                  d: y(Fe)(g)
                }, null, 8, Do)
              ])),
              l("span", To, f(g.label), 1)
            ], 10, Oo))), 128)),
            e.canExport ? (t(), n("button", {
              key: 1,
              type: "button",
              role: "menuitem",
              class: "text-foreground hover:bg-accent focus:bg-accent flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              disabled: e.busy,
              onClick: m[0] || (m[0] = (g) => i.value = !0)
            }, [
              (t(), n("svg", Eo, [
                l("path", {
                  d: y(me)("download")
                }, null, 8, Fo)
              ])),
              m[8] || (m[8] = q(" Export CSV ", -1))
            ], 8, Io)) : b("", !0),
            p.value.length ? (t(), n("div", No, [
              m[9] || (m[9] = l("div", { class: "text-destructive/80 px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em]" }, " Destructive ", -1)),
              (t(!0), n(P, null, O(p.value, (g) => (t(), n("button", {
                key: g.key,
                type: "button",
                role: "menuitem",
                class: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex min-h-10 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                disabled: e.busy,
                onClick: (S) => C(g)
              }, [
                (t(), n("svg", Ho, [
                  l("path", {
                    d: y(Fe)({ ...g, destructive: !0 })
                  }, null, 8, Uo)
                ])),
                l("span", Ko, f(g.label), 1)
              ], 8, Ro))), 128))
            ])) : b("", !0)
          ])
        ]),
        _: 1
      }),
      F(bt, {
        open: s.value !== null,
        title: s.value?.label ?? "",
        description: s.value?.confirmation ?? "",
        onClose: m[2] || (m[2] = (g) => s.value = null)
      }, {
        footer: L(() => [
          l("button", {
            type: "button",
            class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm",
            onClick: m[1] || (m[1] = (g) => s.value = null)
          }, " Cancel "),
          l("button", {
            type: "button",
            class: z([
              "rounded-md px-3 py-1.5 text-sm font-medium disabled:pointer-events-none disabled:opacity-50",
              s.value?.destructive ? "bg-destructive text-white hover:opacity-90" : "bg-primary text-primary-foreground hover:opacity-90"
            ]),
            disabled: !u.value || c.value,
            onClick: k
          }, f(s.value?.label), 11, Zo)
        ]),
        default: L(() => [
          l("p", qo, [
            m[10] || (m[10] = q(" This will affect ", -1)),
            l("span", Go, [
              u.value ? (t(), n(P, { key: 1 }, [
                q(f(A(d.value)) + " record" + f(d.value === 1 ? "" : "s"), 1)
              ], 64)) : (t(), n(P, { key: 0 }, [
                q("…")
              ], 64))
            ]),
            m[11] || (m[11] = q(" . ", -1))
          ]),
          c.value ? (t(), n("p", Wo, " Nothing matches the current filters - there is nothing to " + f(s.value?.label?.toLowerCase()) + ". ", 1)) : b("", !0)
        ]),
        _: 1
      }, 8, ["open", "title", "description"]),
      F(bt, {
        open: i.value,
        title: "Export CSV",
        description: "A download link appears once the file is ready.",
        onClose: m[4] || (m[4] = (g) => i.value = !1)
      }, {
        footer: L(() => [
          l("button", {
            type: "button",
            class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm",
            onClick: m[3] || (m[3] = (g) => i.value = !1)
          }, " Cancel "),
          l("button", {
            type: "button",
            class: "bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
            disabled: !u.value || c.value,
            onClick: B
          }, " Export CSV ", 8, Xo)
        ]),
        default: L(() => [
          l("p", Yo, [
            m[12] || (m[12] = q(" This will export ", -1)),
            l("span", Jo, [
              u.value ? (t(), n(P, { key: 1 }, [
                q(f(A(d.value)) + " record" + f(d.value === 1 ? "" : "s"), 1)
              ], 64)) : (t(), n(P, { key: 0 }, [
                q("…")
              ], 64))
            ]),
            m[13] || (m[13] = q(". ", -1))
          ]),
          c.value ? (t(), n("p", Qo, " Nothing matches the current filters - there is nothing to export. ")) : b("", !0)
        ]),
        _: 1
      }, 8, ["open"])
    ], 64));
  }
});
function es(e, o, a) {
  const r = Number(o);
  if (Number.isNaN(r))
    return String(o);
  const s = e.major ? r : r / 100, i = e.currencyColumn ? String(a?.[e.currencyColumn] ?? "") : e.currency ?? "";
  if (!i)
    return new Intl.NumberFormat(void 0, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(s);
  try {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: i
    }).format(s);
  } catch {
    return `${new Intl.NumberFormat(void 0, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(s)} ${i}`;
  }
}
const ts = { class: "pk-surface flex min-h-0 w-full min-w-0 shrink grow-0 flex-col overflow-hidden rounded-xl shadow-[0_1px_2px_rgb(0_0_0/0.04),0_14px_32px_-24px_rgb(0_0_0/0.28)]" }, as = {
  key: 0,
  class: "shrink-0 border-b px-3 py-2.5 sm:px-4"
}, ns = {
  key: 1,
  class: "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4"
}, ls = {
  key: 3,
  class: "shrink-0 border-t px-3 py-2.5 sm:px-4"
}, os = /* @__PURE__ */ V({
  __name: "TableShell",
  props: {
    toolbarTint: { default: "none" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", ts, [
      o.$slots.tabs ? (t(), n("div", as, [
        Z(o.$slots, "tabs")
      ])) : b("", !0),
      o.$slots.title ? (t(), n("div", ns, [
        Z(o.$slots, "title")
      ])) : b("", !0),
      o.$slots.toolbar ? (t(), n("div", {
        key: 2,
        class: z(["shrink-0 border-b px-3 py-2.5 sm:px-4", e.toolbarTint === "muted" ? "bg-muted/40" : ""])
      }, [
        Z(o.$slots, "toolbar")
      ], 2)) : b("", !0),
      Z(o.$slots, "default"),
      o.$slots.pagination ? (t(), n("div", ls, [
        Z(o.$slots, "pagination")
      ])) : b("", !0)
    ]));
  }
}), Se = "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", $a = "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]", X8 = "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]", Ge = "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", ss = ["aria-expanded", "aria-activedescendant"], rs = ["aria-label", "onClick"], is = {
  key: 0,
  class: "text-muted-foreground flex-1 text-sm"
}, ds = { class: "ml-auto flex shrink-0 items-center gap-1" }, us = {
  key: 0,
  class: "border-b p-1"
}, cs = ["placeholder"], fs = { class: "max-h-60 overflow-y-auto p-1" }, ms = ["id", "onMouseenter", "onClick"], ps = {
  key: 0,
  class: "text-muted-foreground px-2 py-3 text-sm"
}, ua = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(null), i = K(null), d = K(null), u = `pk-multi-select-${lt()}`, c = K(!1), v = K(""), p = K(0), x = K({ top: 0, left: 0, width: 0 }), M = h(
      () => a.modelValue.map(
        (Y) => a.options.find((G) => G.value === Y) ?? {
          value: Y,
          label: String(Y)
        }
      ).filter(Boolean)
    ), $ = h(() => a.searchable ?? a.options.length > 6), C = h(() => {
      const Y = new Set(a.modelValue), G = v.value.trim().toLowerCase();
      return a.options.filter((R) => !Y.has(R.value)).filter((R) => G ? R.label.toLowerCase().includes(G) : !0);
    }), k = h(() => a.max !== null && a.modelValue.length >= a.max);
    function B() {
      const Y = s.value, G = i.value;
      if (!Y || !G)
        return;
      const R = Y.getBoundingClientRect(), H = G.getBoundingClientRect(), ae = 8;
      let _ = R.bottom + 4;
      _ + H.height > window.innerHeight - ae && R.top - H.height - 4 > ae && (_ = R.top - H.height - 4), x.value = {
        top: _,
        left: Math.min(Math.max(ae, R.left), window.innerWidth - R.width - ae),
        // Matching the trigger's width is what makes it read as one control
        // rather than as a menu that happens to be nearby.
        width: R.width
      };
    }
    async function A() {
      a.disabled || c.value || (c.value = !0, v.value = "", p.value = 0, await Ve(), B(), d.value?.focus());
    }
    function w() {
      c.value = !1, v.value = "";
    }
    function m() {
      c.value ? w() : A();
    }
    function g(Y) {
      k.value || (r("update:modelValue", [...a.modelValue, Y.value]), v.value = "", p.value = 0, Ve(() => {
        B(), d.value?.focus();
      }));
    }
    function S(Y) {
      r(
        "update:modelValue",
        a.modelValue.filter((G) => G !== Y)
      ), Ve(B);
    }
    function I() {
      r("update:modelValue", []), Ve(B);
    }
    function j(Y) {
      if (!a.disabled) {
        if (Y.key === "Escape" && c.value) {
          Y.stopPropagation(), w();
          return;
        }
        if (Y.key === "Backspace" && v.value === "" && a.modelValue.length > 0) {
          S(a.modelValue[a.modelValue.length - 1]);
          return;
        }
        if (!c.value && (Y.key === "ArrowDown" || Y.key === "Enter")) {
          Y.preventDefault(), A();
          return;
        }
        if (c.value) {
          if (Y.key === "ArrowDown")
            Y.preventDefault(), p.value = Math.min(p.value + 1, C.value.length - 1);
          else if (Y.key === "ArrowUp")
            Y.preventDefault(), p.value = Math.max(p.value - 1, 0);
          else if (Y.key === "Enter") {
            Y.preventDefault();
            const G = C.value[p.value];
            G && g(G);
          }
        }
      }
    }
    function X(Y) {
      if (!c.value)
        return;
      const G = Y.target;
      s.value?.contains(G) || i.value?.contains(G) || (G instanceof Element ? G : G.parentElement)?.closest("[data-pk-overlay]") || w();
    }
    function W(Y) {
      return `${u}-option-${Y}`;
    }
    function Q() {
      c.value && B();
    }
    return ge(C, (Y) => {
      p.value > Y.length - 1 && (p.value = Math.max(0, Y.length - 1));
    }), ke(() => {
      document.addEventListener("pointerdown", X), window.addEventListener("scroll", Q, !0), window.addEventListener("resize", Q);
    }), Me(() => {
      document.removeEventListener("pointerdown", X), window.removeEventListener("scroll", Q, !0), window.removeEventListener("resize", Q);
    }), (Y, G) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "relative w-full",
      onKeydown: j
    }, [
      l("div", {
        class: z(["bg-background flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors", [
          c.value ? "ring-ring border-ring ring-2" : "hover:border-ring/50",
          e.disabled ? "cursor-not-allowed opacity-50" : ""
        ]]),
        role: "combobox",
        "aria-expanded": c.value,
        "aria-controls": u,
        "aria-activedescendant": c.value && C.value[p.value] ? W(p.value) : void 0,
        "aria-haspopup": "listbox",
        tabindex: "0",
        onClick: m
      }, [
        (t(!0), n(P, null, O(M.value, (R) => (t(), n("span", {
          key: R.value,
          class: "bg-primary/10 text-primary flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium"
        }, [
          q(f(R.label) + " ", 1),
          l("button", {
            type: "button",
            class: "hover:text-destructive -mr-0.5 leading-none",
            "aria-label": `Remove ${R.label}`,
            onClick: be((H) => S(R.value), ["stop"])
          }, [...G[1] || (G[1] = [
            l("svg", {
              viewBox: "0 0 24 24",
              class: "size-3",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "3"
            }, [
              l("path", { d: "M18 6 6 18M6 6l12 12" })
            ], -1)
          ])], 8, rs)
        ]))), 128)),
        M.value.length === 0 ? (t(), n("span", is, f(e.placeholder), 1)) : b("", !0),
        l("span", ds, [
          M.value.length > 1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground text-xs",
            "aria-label": "Clear all",
            onClick: be(I, ["stop"])
          }, " Clear ")) : b("", !0),
          (t(), n("svg", {
            viewBox: "0 0 24 24",
            class: z(["text-muted-foreground size-4 transition-transform", c.value ? "rotate-180" : ""]),
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "aria-hidden": "true"
          }, [...G[2] || (G[2] = [
            l("path", { d: "m6 9 6 6 6-6" }, null, -1)
          ])], 2))
        ])
      ], 10, ss),
      (t(), T(yt, { to: "body" }, [
        F(ot, {
          "enter-active-class": "transition duration-100 ease-out",
          "enter-from-class": "opacity-0 scale-95",
          "leave-active-class": "transition duration-75 ease-in",
          "leave-to-class": "opacity-0 scale-95"
        }, {
          default: L(() => [
            c.value ? (t(), n("div", {
              key: 0,
              ref_key: "panel",
              ref: i,
              id: u,
              "data-pk-overlay": "",
              class: "bg-popover fixed z-[100] overflow-hidden rounded-md border shadow-lg",
              style: ie({
                top: `${x.value.top}px`,
                left: `${x.value.left}px`,
                width: `${x.value.width}px`
              }),
              role: "listbox"
            }, [
              $.value ? (t(), n("div", us, [
                xe(l("input", {
                  ref_key: "searchInput",
                  ref: d,
                  "onUpdate:modelValue": G[0] || (G[0] = (R) => v.value = R),
                  type: "text",
                  class: "w-full bg-transparent px-2 py-1.5 text-sm outline-none",
                  placeholder: e.searchPlaceholder,
                  onKeydown: j
                }, null, 40, cs), [
                  [Le, v.value]
                ])
              ])) : b("", !0),
              l("div", fs, [
                (t(!0), n(P, null, O(C.value, (R, H) => (t(), n("button", {
                  key: R.value,
                  id: W(H),
                  type: "button",
                  class: z(["flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm transition-colors", H === p.value ? "bg-accent" : "hover:bg-accent/60"]),
                  role: "option",
                  "aria-selected": "false",
                  onMouseenter: (ae) => p.value = H,
                  onClick: (ae) => g(R)
                }, f(R.label), 43, ms))), 128)),
                C.value.length === 0 ? (t(), n("p", ps, [
                  k.value ? (t(), n(P, { key: 0 }, [
                    q("You have selected the maximum.")
                  ], 64)) : v.value ? (t(), n(P, { key: 1 }, [
                    q("Nothing matches “" + f(v.value) + "”.", 1)
                  ], 64)) : (t(), n(P, { key: 2 }, [
                    q("Everything is selected.")
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
}), ca = /* @__PURE__ */ V({
  __name: "Sheet",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean },
    unmountOnHide: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = we(e, o);
    return (i, d) => (t(), T(y(Ta), re({ "data-slot": "sheet" }, y(s)), {
      default: L((u) => [
        Z(i.$slots, "default", De(Ke(u)))
      ]),
      _: 3
    }, 16));
  }
});
function oe(...e) {
  return $l(kl(e));
}
function eC(e) {
  return typeof e == "string" ? e : e?.url ?? "";
}
const vs = /* @__PURE__ */ V({
  __name: "SheetOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(oa), re({
      "data-slot": "sheet-overlay",
      class: y(oe)(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        o.class
      )
    }, y(a)), {
      default: L(() => [
        Z(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), fa = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class", "side"), i = we(s, r);
    return (d, u) => (t(), T(y(sa), null, {
      default: L(() => [
        F(vs),
        F(y(ra), re({
          "data-slot": "sheet-content",
          class: y(oe)(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
            e.side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
            e.side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
            e.side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
            e.side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
            a.class
          )
        }, { ...d.$attrs, ...y(i) }), {
          default: L(() => [
            Z(d.$slots, "default"),
            F(y(st), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
              default: L(() => [
                F(y(ia), { class: "size-4" }),
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
}), gs = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", hs = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
  outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
  link: "text-primary underline-offset-4 hover:underline"
}, bs = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
  "icon-sm": "size-8",
  "icon-lg": "size-10"
};
function at(e = {}) {
  const o = e.variant ?? "default", a = e.size ?? "default";
  return [gs, hs[o], bs[a], e.class].filter(Boolean).join(" ");
}
const ue = /* @__PURE__ */ V({
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
    const o = e, a = h(
      () => at({ variant: o.variant, size: o.size, class: o.class })
    ), r = h(() => o.as === "button" ? o.type : void 0);
    return (s, i) => (t(), T(ze(e.as), {
      "data-slot": "button",
      "data-variant": e.variant,
      "data-size": e.size,
      type: r.value,
      disabled: e.as === "button" ? e.disabled : void 0,
      "aria-disabled": e.as !== "button" && e.disabled ? "true" : void 0,
      class: z(["pk-focus-ring", a.value])
    }, {
      default: L(() => [
        Z(s.$slots, "default")
      ]),
      _: 3
    }, 8, ["data-variant", "data-size", "type", "disabled", "aria-disabled", "class"]));
  }
}), ys = { class: "flex items-center gap-2" }, xs = ["onUpdate:modelValue", "onChange"], ks = ["value"], $s = ["onUpdate:modelValue"], ws = ["value"], Cs = ["onUpdate:modelValue"], Ms = ["onUpdate:modelValue", "multiple"], Ss = ["value"], Bs = ["onUpdate:modelValue", "type"], As = ["aria-label", "onClick"], zs = { class: "flex items-center gap-2" }, Ps = /* @__PURE__ */ V({
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
    ge(
      () => a.modelValue,
      (w) => {
        i.value = w ? structuredClone(w) : s();
      }
    );
    const d = (w) => "rules" in w, u = h(() => Object.keys(a.fields));
    function c(w) {
      const m = w ? a.fields[w]?.kind : void 0;
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
    function x() {
      const w = u.value[0];
      i.value.rules.push({
        field: w,
        operator: c(w)[0],
        value: void 0
      }), p();
    }
    function M() {
      i.value.rules.push(s()), p();
    }
    function $(w) {
      i.value.rules.splice(w, 1), p();
    }
    function C(w) {
      w.operator = c(w.field)[0], w.value = void 0, p();
    }
    const k = h(() => a.depth + 1 < a.maxDepth);
    function B() {
      i.value = s(), p(), r("apply", null);
    }
    function A() {
      r("apply", i.value.rules.length ? i.value : null);
    }
    return (w, m) => {
      const g = na("PkQueryBuilder", !0);
      return t(), n("div", {
        class: z(["flex flex-col gap-2 rounded-lg border p-3", e.depth > 0 ? "bg-muted/30" : "bg-card"])
      }, [
        l("div", ys, [
          xe(l("select", {
            "onUpdate:modelValue": m[0] || (m[0] = (S) => i.value.logic = S),
            class: "border-input bg-background rounded-md border px-2 py-1 text-xs",
            "aria-label": "Match all or any",
            onChange: p
          }, [...m[1] || (m[1] = [
            l("option", { value: "and" }, "Match all", -1),
            l("option", { value: "or" }, "Match any", -1)
          ])], 544), [
            [et, i.value.logic]
          ]),
          m[2] || (m[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "of the following", -1))
        ]),
        (t(!0), n(P, null, O(i.value.rules, (S, I) => (t(), n("div", {
          key: I,
          class: "flex items-start gap-2"
        }, [
          d(S) ? (t(), T(g, {
            key: 0,
            modelValue: i.value.rules[I],
            "onUpdate:modelValue": [(j) => i.value.rules[I] = j, p],
            fields: e.fields,
            operators: e.operators,
            "max-depth": e.maxDepth,
            depth: e.depth + 1,
            root: !1,
            class: "flex-1"
          }, null, 8, ["modelValue", "onUpdate:modelValue", "fields", "operators", "max-depth", "depth"])) : (t(), n(P, { key: 1 }, [
            xe(l("select", {
              "onUpdate:modelValue": (j) => S.field = j,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Field",
              onChange: (j) => C(S)
            }, [
              (t(!0), n(P, null, O(u.value, (j) => (t(), n("option", {
                key: j,
                value: j
              }, f(e.fields[j].label), 9, ks))), 128))
            ], 40, xs), [
              [et, S.field]
            ]),
            xe(l("select", {
              "onUpdate:modelValue": (j) => S.operator = j,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Operator",
              onChange: p
            }, [
              (t(!0), n(P, null, O(c(S.field), (j) => (t(), n("option", {
                key: j,
                value: j
              }, f(v[j] ?? j), 9, ws))), 128))
            ], 40, $s), [
              [et, S.operator]
            ]),
            S.field && e.fields[S.field]?.kind === "boolean" ? xe((t(), n("select", {
              key: 0,
              "onUpdate:modelValue": (j) => S.value = j,
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: p
            }, [...m[3] || (m[3] = [
              l("option", { value: !0 }, "Yes", -1),
              l("option", { value: !1 }, "No", -1)
            ])], 40, Cs)), [
              [et, S.value]
            ]) : S.field && e.fields[S.field]?.options?.length ? xe((t(), n("select", {
              key: 1,
              "onUpdate:modelValue": (j) => S.value = j,
              multiple: e.fields[S.field].kind === "multiselect",
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: p
            }, [
              (t(!0), n(P, null, O(e.fields[S.field].options, (j) => (t(), n("option", {
                key: j,
                value: j
              }, f(j), 9, Ss))), 128))
            ], 40, Ms)), [
              [et, S.value]
            ]) : xe((t(), n("input", {
              key: 2,
              "onUpdate:modelValue": (j) => S.value = j,
              type: S.field && e.fields[S.field]?.kind === "daterange" ? "date" : "text",
              class: "border-input bg-background rounded-md border px-2 py-1 text-sm",
              "aria-label": "Value",
              onChange: p
            }, null, 40, Bs)), [
              [hn, S.value]
            ])
          ], 64)),
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:text-destructive px-1 py-1 text-sm",
            "aria-label": `Remove ${d(S) ? "group" : "rule"}`,
            onClick: (j) => $(I)
          }, " × ", 8, As)
        ]))), 128)),
        l("div", zs, [
          F(ue, {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: x
          }, {
            default: L(() => [...m[4] || (m[4] = [
              q("Add rule", -1)
            ])]),
            _: 1
          }),
          k.value ? (t(), T(ue, {
            key: 0,
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: M
          }, {
            default: L(() => [...m[5] || (m[5] = [
              q(" Add group ", -1)
            ])]),
            _: 1
          })) : b("", !0),
          e.root ? (t(), n(P, { key: 1 }, [
            m[8] || (m[8] = l("span", { class: "flex-1" }, null, -1)),
            F(ue, {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: B
            }, {
              default: L(() => [...m[6] || (m[6] = [
                q(" Clear ", -1)
              ])]),
              _: 1
            }),
            F(ue, {
              type: "button",
              size: "sm",
              onClick: A
            }, {
              default: L(() => [...m[7] || (m[7] = [
                q(" Apply ", -1)
              ])]),
              _: 1
            })
          ], 64)) : b("", !0)
        ])
      ], 2);
    };
  }
}), _s = {
  "data-slot": "table-toolbar",
  class: "flex flex-col gap-2"
}, Vs = { class: "flex items-center gap-2 md:hidden" }, Ls = { class: "relative min-w-0 flex-1" }, Os = ["placeholder", "title", "aria-label"], js = {
  key: 0,
  class: "bg-primary text-primary-foreground inline-flex size-4 items-center justify-center rounded-full text-[10px]"
}, Ds = { class: "flex max-h-[85vh] flex-col" }, Ts = { class: "flex-1 overflow-y-auto px-4 py-3" }, Is = {
  key: 0,
  class: "mb-4 flex flex-col gap-3"
}, Es = { class: "text-xs font-medium" }, Fs = ["value", "onChange"], Ns = ["value"], Rs = { class: "mb-4" }, Hs = { class: "flex flex-col gap-1" }, Us = ["disabled", "onClick"], Ks = {
  key: 0,
  class: "text-primary ml-auto text-xs"
}, qs = {
  key: 1,
  class: "mb-4"
}, Gs = { class: "flex flex-col gap-1" }, Ws = ["onClick"], Zs = { class: "border-t p-4" }, Ys = ["disabled"], Js = { class: "hidden flex-wrap items-center justify-end gap-2 md:flex" }, Qs = { class: "relative min-w-0 flex-1 sm:w-72 sm:flex-none" }, Xs = ["placeholder", "title", "aria-label"], er = ["aria-label"], tr = {
  key: 0,
  class: "bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums"
}, ar = { class: "flex max-h-96 flex-col gap-4 overflow-y-auto px-1 pb-3" }, nr = { class: "text-xs font-medium" }, lr = ["value", "onChange"], or = ["value"], sr = { class: "grid grid-cols-2 gap-2" }, rr = ["value", "onChange"], ir = ["value", "onChange"], dr = {
  key: 3,
  class: "grid grid-cols-2 gap-2"
}, ur = ["value", "onChange"], cr = ["value", "onChange"], fr = {
  key: 4,
  class: "flex items-center gap-2"
}, mr = ["aria-checked", "onClick"], pr = { class: "text-xs" }, vr = ["onClick"], gr = ["value", "onChange"], hr = ["value"], br = ["disabled", "onClick"], yr = { class: "flex max-h-80 flex-col overflow-y-auto py-1" }, xr = ["disabled", "onClick"], kr = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, $r = {
  key: 1,
  class: "size-4 shrink-0",
  "aria-hidden": "true"
}, wr = {
  key: 1,
  class: "border-input inline-flex shrink-0 overflow-hidden rounded-md border",
  role: "group",
  "aria-label": "Index layout"
}, Cr = ["aria-pressed", "aria-label", "title", "onClick"], Mr = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Sr = {
  key: 1,
  viewBox: "0 0 24 24",
  class: "size-4",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Br = ["aria-pressed", "aria-label", "title"], Ar = ["aria-label", "title"], zr = { class: "flex flex-col gap-0.5 p-1" }, Pr = ["onClick"], _r = ["onClick"], Vr = {
  key: 5,
  class: "text-muted-foreground shrink-0 text-xs"
}, Lr = {
  key: 0,
  class: "flex flex-wrap items-center gap-1.5",
  dusk: "filter-indicators"
}, Or = ["dusk"], jr = ["aria-label", "onClick"], Dr = /* @__PURE__ */ V({
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
    ge(
      () => a.search,
      (D) => {
        D !== i.value && (i.value = D);
      }
    );
    let d;
    ge(i, (D) => {
      clearTimeout(d), d = setTimeout(() => {
        D !== a.search && r("update:search", D);
      }, 250);
    }), Me(() => {
      clearTimeout(d);
    });
    const u = K({ ...a.filters });
    ge(
      () => a.filters,
      (D) => {
        u.value = { ...D };
      },
      { deep: !0 }
    );
    const c = h(
      () => a.filterSchema.filter(
        (D) => a.filters[D.key] !== null && a.filters[D.key] !== void 0
      ).length
    ), v = h(() => JSON.stringify(u.value) !== JSON.stringify(a.filters)), p = h(() => a.search !== "" || c.value > 0), x = h(() => a.indicators.length ? a.indicators : a.filterSchema.filter((D) => a.filters[D.key] !== null && a.filters[D.key] !== void 0).map((D) => ({
      key: D.key,
      label: `${D.label}: ${String(a.filters[D.key])}`,
      removable: !0
    })));
    function M(D) {
      r("group", D);
    }
    function $(D) {
      M(D), s.value = !1;
    }
    function C(D, E) {
      M(D), E();
    }
    function k(D) {
      r("clear-filter", D);
    }
    function B(D) {
      return D.type === "multiselect";
    }
    function A(D) {
      const E = u.value[D.key];
      return Array.isArray(E) ? E : E == null ? [] : [E];
    }
    function w(D) {
      return A(D).filter(
        (E) => typeof E == "string" || typeof E == "number"
      );
    }
    function m(D) {
      return Y(D).flatMap(
        (E) => typeof E.value == "string" || typeof E.value == "number" ? [{ value: E.value, label: E.label }] : []
      );
    }
    function g(D, E) {
      u.value = { ...u.value, [D.key]: E === "" ? null : E };
    }
    function S(D, E) {
      const U = u.value[D.key];
      if (typeof U != "string" || !U.includes(".."))
        return "";
      const [J, te] = U.split("..");
      return E === "from" ? J ?? "" : te ?? "";
    }
    function I(D, E, U) {
      const J = E === "from" ? U : S(D, "from"), te = E === "to" ? U : S(D, "to");
      u.value = {
        ...u.value,
        [D.key]: J && te ? `${J}..${te}` : null
      };
    }
    function j(D, E, U) {
      const J = E === "from" ? U : S(D, "from"), te = E === "to" ? U : S(D, "to");
      u.value = {
        ...u.value,
        [D.key]: J || te ? `${J}..${te}` : null
      };
    }
    function X(D) {
      r("apply-filters", { ...u.value }), D();
    }
    function W(D, E) {
      u.value[D] = E, r("apply-filters", { ...u.value });
    }
    function Q() {
      u.value = Object.fromEntries(a.filterSchema.map((D) => [D.key, null]));
    }
    function Y(D) {
      return D.type === "boolean" ? [
        { value: !0, label: D.trueLabel ?? "Yes" },
        { value: !1, label: D.falseLabel ?? "No" }
      ] : D.type === "daterange" ? Object.entries(D.presets ?? {}).map(([E, U]) => ({
        value: E,
        label: U
      })) : (D.options ?? []).map(
        (E) => typeof E == "object" && E !== null && "value" in E ? { value: E.value, label: E.label } : { value: E, label: String(E) }
      );
    }
    const G = K(new Set(a.hidden));
    ge(
      () => a.hidden,
      (D) => {
        G.value = new Set(D);
      },
      { deep: !0 }
    );
    function R(D) {
      const E = new Set(G.value);
      E.has(D) ? E.delete(D) : E.add(D), G.value = E, r("apply-columns", [...E]);
    }
    function H() {
      G.value = /* @__PURE__ */ new Set(), r("apply-columns", []);
    }
    function ae() {
      r("apply-filters", { ...u.value }), s.value = !1;
    }
    function _() {
      i.value = "", r("clear");
    }
    function ee() {
      _(), s.value = !1;
    }
    return (D, E) => (t(), n("div", _s, [
      l("div", Vs, [
        l("div", Ls, [
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
          xe(l("input", {
            "onUpdate:modelValue": E[0] || (E[0] = (U) => i.value = U),
            type: "search",
            placeholder: e.searchPlaceholder,
            title: e.searchHint,
            "aria-label": e.searchHint ?? e.searchPlaceholder,
            class: z([
              "border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors",
              y(Se)
            ])
          }, null, 10, Os), [
            [Le, i.value]
          ])
        ]),
        l("button", {
          type: "button",
          dusk: "mobile-table-tools",
          class: "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border px-3 text-sm",
          onClick: E[1] || (E[1] = (U) => s.value = !0)
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
          E[10] || (E[10] = q(" Tools ", -1)),
          c.value ? (t(), n("span", js, f(c.value), 1)) : b("", !0)
        ]),
        F(ca, {
          open: s.value,
          "onUpdate:open": E[3] || (E[3] = (U) => s.value = U)
        }, {
          default: L(() => [
            F(fa, {
              side: "bottom",
              class: "max-h-[85vh] gap-0 overflow-hidden p-0"
            }, {
              default: L(() => [
                l("div", Ds, [
                  E[15] || (E[15] = l("div", { class: "border-b px-4 py-3" }, [
                    l("p", { class: "text-sm font-semibold" }, "Table tools"),
                    l("p", { class: "text-muted-foreground text-xs font-normal" }, " Filters, columns, and grouping ")
                  ], -1)),
                  l("div", Ts, [
                    e.filterSchema.length ? (t(), n("div", Is, [
                      l("div", { class: "flex items-center justify-between" }, [
                        E[11] || (E[11] = l("span", { class: "text-sm font-medium" }, "Filters", -1)),
                        l("button", {
                          class: "text-destructive text-xs hover:underline",
                          onClick: Q
                        }, " Reset ")
                      ]),
                      (t(!0), n(P, null, O(e.filterSchema, (U) => (t(), n("div", {
                        key: `mobile-${U.key}`,
                        class: "flex flex-col gap-1.5"
                      }, [
                        l("label", Es, f(U.label), 1),
                        U.type !== "multiselect" && U.type !== "querybuilder" && U.type !== "daterange" && U.type !== "numberrange" && U.type !== "boolean" ? (t(), n("select", {
                          key: 0,
                          value: u.value[U.key] ?? "",
                          class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
                          onChange: (J) => g(
                            U,
                            J.target.value
                          )
                        }, [
                          E[12] || (E[12] = l("option", { value: "" }, "All", -1)),
                          (t(!0), n(P, null, O(Y(U), (J) => (t(), n("option", {
                            key: String(J.value),
                            value: J.value
                          }, f(J.label), 9, Ns))), 128))
                        ], 40, Fs)) : b("", !0)
                      ]))), 128))
                    ])) : b("", !0),
                    l("div", Rs, [
                      E[13] || (E[13] = l("p", { class: "mb-2 text-sm font-medium" }, "Columns", -1)),
                      l("div", Hs, [
                        (t(!0), n(P, null, O(e.columns, (U) => (t(), n("button", {
                          key: `mobile-col-${U.key}`,
                          type: "button",
                          class: "hover:bg-accent flex items-center gap-2 rounded px-2 py-1.5 text-sm",
                          disabled: U.locked,
                          onClick: (J) => R(U.key)
                        }, [
                          l("span", null, f(U.label), 1),
                          G.value.has(U.key) ? b("", !0) : (t(), n("span", Ks, "On"))
                        ], 8, Us))), 128))
                      ])
                    ]),
                    e.groups.length ? (t(), n("div", qs, [
                      E[14] || (E[14] = l("p", { class: "mb-2 text-sm font-medium" }, "Grouping", -1)),
                      l("div", Gs, [
                        l("button", {
                          type: "button",
                          class: "hover:bg-accent rounded px-2 py-1.5 text-left text-sm",
                          onClick: E[2] || (E[2] = (U) => $(null))
                        }, " No grouping "),
                        (t(!0), n(P, null, O(e.groups, (U) => (t(), n("button", {
                          key: U.key,
                          type: "button",
                          class: "hover:bg-accent rounded px-2 py-1.5 text-left text-sm",
                          onClick: (J) => $(U.key)
                        }, f(U.label), 9, Ws))), 128))
                      ])
                    ])) : b("", !0)
                  ]),
                  l("div", Zs, [
                    e.filterSchema.length ? (t(), n("button", {
                      key: 0,
                      type: "button",
                      class: "bg-primary text-primary-foreground hover:bg-primary/90 mb-2 h-9 w-full rounded-md text-sm font-medium disabled:opacity-50",
                      disabled: !v.value,
                      onClick: ae
                    }, " Apply filters ", 8, Ys)) : b("", !0),
                    p.value ? (t(), n("button", {
                      key: 1,
                      type: "button",
                      class: "text-muted-foreground hover:text-foreground w-full text-xs underline-offset-2 hover:underline",
                      onClick: ee
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
      l("div", Js, [
        l("div", Qs, [
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
          xe(l("input", {
            "onUpdate:modelValue": E[4] || (E[4] = (U) => i.value = U),
            type: "search",
            placeholder: e.searchPlaceholder,
            title: e.searchHint,
            "aria-label": e.searchHint ?? e.searchPlaceholder,
            class: z([
              "border-input bg-background h-9 w-full rounded-md border pr-8 pl-9 text-sm transition-colors",
              y(Se)
            ])
          }, null, 10, Xs), [
            [Le, i.value]
          ]),
          i.value ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2",
            "aria-label": "Clear search",
            onClick: E[5] || (E[5] = (U) => i.value = "")
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
        e.filterSchema.length ? (t(), T(Ze, {
          key: 0,
          width: "w-80",
          "dismiss-on-panel-click": !1
        }, {
          trigger: L(() => [
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
              c.value ? (t(), n("span", tr, f(c.value), 1)) : b("", !0)
            ], 10, er)
          ]),
          panel: L(({ close: U }) => [
            l("div", { class: "flex items-center justify-between px-1 pt-1 pb-2" }, [
              E[19] || (E[19] = l("span", { class: "text-sm font-semibold" }, "Filters", -1)),
              l("button", {
                class: "text-destructive text-xs hover:underline",
                onClick: Q
              }, " Reset ")
            ]),
            E[22] || (E[22] = l("p", { class: "text-muted-foreground px-1 pb-3 text-xs" }, " Select one or more - all chosen filters must match. ", -1)),
            l("div", ar, [
              (t(!0), n(P, null, O(e.filterSchema, (J) => (t(), n("div", {
                key: J.key,
                class: "flex flex-col gap-1.5"
              }, [
                l("label", nr, f(J.label), 1),
                B(J) ? (t(), T(ua, {
                  key: 0,
                  "model-value": w(J),
                  options: m(J),
                  placeholder: `Any ${J.label.toLowerCase()}`,
                  "onUpdate:modelValue": (te) => u.value[J.key] = te.length ? te : null
                }, null, 8, ["model-value", "options", "placeholder", "onUpdate:modelValue"])) : J.type === "querybuilder" ? (t(), T(Ps, {
                  key: 1,
                  "model-value": u.value[J.key] ?? null,
                  fields: J.fields ?? {},
                  operators: J.operators ?? {},
                  "max-depth": J.maxDepth ?? 5,
                  onApply: (te) => W(J.key, te)
                }, null, 8, ["model-value", "fields", "operators", "max-depth", "onApply"])) : J.type === "daterange" ? (t(), n(P, { key: 2 }, [
                  l("select", {
                    value: typeof u.value[J.key] == "string" && !String(u.value[J.key]).includes("..") ? u.value[J.key] : "",
                    class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
                    onChange: (te) => g(J, te.target.value)
                  }, [
                    E[20] || (E[20] = l("option", { value: "" }, "Any time", -1)),
                    (t(!0), n(P, null, O(Y(J), (te) => (t(), n("option", {
                      key: String(te.value),
                      value: te.value
                    }, f(te.label), 9, or))), 128))
                  ], 40, lr),
                  l("div", sr, [
                    l("input", {
                      type: "date",
                      value: S(J, "from"),
                      "aria-label": "From",
                      class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                      onChange: (te) => I(
                        J,
                        "from",
                        te.target.value
                      )
                    }, null, 40, rr),
                    l("input", {
                      type: "date",
                      value: S(J, "to"),
                      "aria-label": "To",
                      class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                      onChange: (te) => I(
                        J,
                        "to",
                        te.target.value
                      )
                    }, null, 40, ir)
                  ])
                ], 64)) : J.type === "numberrange" ? (t(), n("div", dr, [
                  l("input", {
                    type: "number",
                    value: S(J, "from"),
                    "aria-label": "From",
                    placeholder: "From",
                    class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                    onChange: (te) => j(
                      J,
                      "from",
                      te.target.value
                    )
                  }, null, 40, ur),
                  l("input", {
                    type: "number",
                    value: S(J, "to"),
                    "aria-label": "To",
                    placeholder: "To",
                    class: "border-input bg-background h-9 rounded-md border px-2 text-xs",
                    onChange: (te) => j(
                      J,
                      "to",
                      te.target.value
                    )
                  }, null, 40, cr)
                ])) : J.type === "boolean" ? (t(), n("div", fr, [
                  l("button", {
                    type: "button",
                    role: "switch",
                    "aria-checked": u.value[J.key] === !0,
                    class: z([
                      "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                      u.value[J.key] === !0 ? "bg-primary" : "bg-muted-foreground/30"
                    ]),
                    onClick: (te) => g(J, u.value[J.key] === !0 ? null : !0)
                  }, [
                    l("span", {
                      class: z([
                        "bg-background absolute top-0.5 size-4 rounded-full transition-all",
                        u.value[J.key] === !0 ? "left-4.5" : "left-0.5"
                      ])
                    }, null, 2)
                  ], 10, mr),
                  l("span", pr, f(J.trueLabel ?? "Yes"), 1),
                  l("button", {
                    type: "button",
                    class: z([
                      "text-muted-foreground ml-auto text-xs hover:underline",
                      u.value[J.key] === !1 ? "text-primary font-medium" : ""
                    ]),
                    onClick: (te) => g(J, u.value[J.key] === !1 ? null : !1)
                  }, f(J.falseLabel ?? "No") + " only ", 11, vr)
                ])) : (t(), n("select", {
                  key: 5,
                  value: u.value[J.key] ?? "",
                  class: "border-input bg-background h-9 rounded-md border px-3 text-sm capitalize",
                  onChange: (te) => g(J, te.target.value)
                }, [
                  E[21] || (E[21] = l("option", { value: "" }, "All", -1)),
                  (t(!0), n(P, null, O(Y(J), (te) => (t(), n("option", {
                    key: String(te.value),
                    value: te.value
                  }, f(te.label), 9, hr))), 128))
                ], 40, gr))
              ]))), 128))
            ]),
            l("button", {
              type: "button",
              class: "bg-primary text-primary-foreground hover:bg-primary/90 mt-1 h-9 w-full rounded-md text-sm font-medium transition-colors disabled:opacity-50",
              disabled: !v.value,
              onClick: (J) => X(U)
            }, " Apply filters ", 8, br)
          ]),
          _: 1
        })) : b("", !0),
        F(Ze, { "dismiss-on-panel-click": !1 }, {
          trigger: L(() => [...E[23] || (E[23] = [
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
          panel: L(() => [
            E[26] || (E[26] = l("p", { class: "text-muted-foreground px-3 pt-2.5 pb-1 text-xs font-medium" }, " Toggle columns ", -1)),
            l("div", yr, [
              (t(!0), n(P, null, O(e.columns, (U) => (t(), n("button", {
                key: U.key,
                type: "button",
                class: z(["hover:bg-accent flex items-center gap-2 px-3 py-1.5 text-sm", U.locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"]),
                disabled: U.locked,
                onClick: (J) => R(U.key)
              }, [
                G.value.has(U.key) ? (t(), n("span", $r)) : (t(), n("svg", kr, [...E[24] || (E[24] = [
                  l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
                ])])),
                q(" " + f(U.label), 1)
              ], 10, xr))), 128))
            ]),
            l("div", { class: "border-t" }, [
              l("button", {
                type: "button",
                class: "hover:bg-accent flex w-full items-center gap-2 px-3 py-1.5 text-sm",
                onClick: H
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
                q(" Reset ", -1)
              ])])
            ])
          ]),
          _: 1
        }),
        e.layouts.length > 1 ? (t(), n("div", wr, [
          (t(!0), n(P, null, O(e.layouts, (U) => (t(), n("button", {
            key: U,
            type: "button",
            class: z(["hover:bg-accent inline-flex size-9 items-center justify-center transition-colors", e.layout === U ? "bg-accent text-foreground" : "text-muted-foreground"]),
            "aria-pressed": e.layout === U,
            "aria-label": U === "cards" ? "Card layout" : "Table layout",
            title: U === "cards" ? "Cards" : "Table",
            onClick: (J) => r("layout", U)
          }, [
            U === "table" ? (t(), n("svg", Mr, [...E[27] || (E[27] = [
              l("path", { d: "M3 5h18M3 12h18M3 19h18" }, null, -1)
            ])])) : (t(), n("svg", Sr, [...E[28] || (E[28] = [
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
          ], 10, Cr))), 128))
        ])) : b("", !0),
        e.reorderable ? (t(), n("button", {
          key: 2,
          type: "button",
          class: z(["border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors", e.reordering ? "border-primary text-primary" : ""]),
          "aria-pressed": e.reordering,
          "aria-label": e.reordering ? "Finish reordering" : "Reorder records",
          title: e.reordering ? "Finish reordering" : "Reorder records",
          onClick: E[6] || (E[6] = (U) => r("toggle-reorder"))
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
        ])], 10, Br)) : b("", !0),
        e.groups.length ? (t(), T(Ze, {
          key: 3,
          align: "end"
        }, {
          trigger: L(() => [
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
            ])], 10, Ar)
          ]),
          panel: L(({ close: U }) => [
            l("div", zr, [
              l("button", {
                type: "button",
                class: z(["hover:bg-accent rounded px-2 py-1.5 text-left text-sm", e.groupBy ? "" : "text-primary font-medium"]),
                onClick: (J) => C(null, U)
              }, " No grouping ", 10, Pr),
              (t(!0), n(P, null, O(e.groups, (J) => (t(), n("button", {
                key: J.key,
                type: "button",
                class: z(["hover:bg-accent rounded px-2 py-1.5 text-left text-sm", e.groupBy?.key === J.key ? "text-primary font-medium" : ""]),
                onClick: (te) => C(J.key, U)
              }, f(J.label), 11, _r))), 128))
            ])
          ]),
          _: 1
        })) : b("", !0),
        p.value ? (t(), n("button", {
          key: 4,
          type: "button",
          class: "text-muted-foreground hover:text-foreground shrink-0 text-xs underline-offset-2 hover:underline",
          onClick: _
        }, " Clear ")) : b("", !0),
        e.loading ? (t(), n("span", Vr, "Loading…")) : b("", !0)
      ]),
      x.value.length ? (t(), n("div", Lr, [
        (t(!0), n(P, null, O(x.value, (U) => (t(), n("span", {
          key: U.key + U.label,
          class: "border-input bg-muted/60 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
          dusk: `filter-indicator-${U.key}`
        }, [
          q(f(U.label) + " ", 1),
          U.removable !== !1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "hover:text-foreground text-muted-foreground",
            "aria-label": `Clear ${U.label}`,
            onClick: (J) => k(U.key)
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
          ])], 8, jr)) : b("", !0)
        ], 8, Or))), 128)),
        x.value.length > 1 ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline",
          dusk: "clear-all-filters",
          onClick: E[7] || (E[7] = (U) => r("clear-filters"))
        }, " Clear all ")) : b("", !0)
      ])) : b("", !0)
    ]));
  }
}), Tr = { class: "min-w-0" }, Ir = {
  key: 0,
  class: "text-sm font-semibold tracking-tight"
}, Er = {
  key: 0,
  class: "flex shrink-0 flex-wrap items-center justify-end gap-2"
}, Fr = {
  key: 0,
  class: "text-muted-foreground px-4 py-10 text-center text-sm"
}, Nr = {
  key: 2,
  class: "pk-table-scroll pk-scroll w-full min-w-0 max-w-full overflow-x-auto overflow-y-auto overscroll-x-contain"
}, Rr = { class: "w-max min-w-full border-collapse text-sm" }, Hr = { class: "bg-muted/40" }, Ur = { class: "divide-y" }, Kr = ["onClick"], qr = ["href"], Gr = {
  key: 1,
  class: "text-muted-foreground"
}, Wr = {
  key: 0,
  class: "flex justify-center"
}, Zr = ["disabled"], Yr = {
  key: 1,
  class: "text-muted-foreground text-center text-xs"
}, Jr = ["href"], tC = /* @__PURE__ */ V({
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
    const a = e, r = o, s = aa(), i = h(() => a.columns.filter(($) => $.type !== "image")), d = h(() => !!s.actions), u = h(() => !!a.title || d.value), c = h(() => a.filterSchema.length > 0), v = h(
      () => a.columns.map(($) => ({ key: $.key, label: $.label, locked: !0 }))
    );
    function p($, C, k) {
      return C == null || C === "" ? "-" : $.type === "date" || $.type === "datetime" ? new Date(String(C)).toLocaleString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...$.type === "datetime" ? { hour: "2-digit", minute: "2-digit" } : {}
      }) : $.type === "money" ? es($, C, k) : typeof C == "number" ? new Intl.NumberFormat().format(C) : String(C);
    }
    function x($) {
      return $ == null || $ === "";
    }
    function M($, C) {
      !a.recordBase || $.id == null || C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || C.target?.closest('a, button, input, select, textarea, label, [role="menuitem"]') || (window.getSelection()?.toString().length ?? 0) > 0 || Mn.visit(`${a.recordBase}/${$.id}`);
    }
    return ($, C) => (t(), T(os, null, gt({
      default: L(() => [
        e.loading && e.rows.length === 0 ? (t(), n("div", Fr, " Loading… ")) : e.loaded && e.rows.length === 0 ? (t(), T(Wt, {
          key: 1,
          compact: "",
          icon: "package",
          title: e.emptyTitle,
          description: e.emptyText
        }, gt({ _: 2 }, [
          $.$slots.illustration ? {
            name: "illustration",
            fn: L(() => [
              Z($.$slots, "illustration")
            ]),
            key: "0"
          } : void 0,
          $.$slots["empty-actions"] ? {
            name: "actions",
            fn: L(() => [
              Z($.$slots, "empty-actions")
            ]),
            key: "1"
          } : void 0
        ]), 1032, ["title", "description"])) : e.rows.length > 0 ? (t(), n("div", Nr, [
          l("table", Rr, [
            l("thead", Hr, [
              l("tr", null, [
                (t(!0), n(P, null, O(i.value, (k) => (t(), n("th", {
                  key: k.key,
                  class: "text-muted-foreground px-3 py-2.5 text-left text-xs font-medium whitespace-nowrap"
                }, f(k.label), 1))), 128))
              ])
            ]),
            l("tbody", Ur, [
              (t(!0), n(P, null, O(e.rows, (k, B) => (t(), n("tr", {
                key: k.id ?? B,
                "data-slot": "table-row",
                class: z(["pk-row hover:bg-muted/40 transition-colors", e.recordBase && k.id != null ? "cursor-pointer" : ""]),
                onClick: (A) => M(k, A)
              }, [
                (t(!0), n(P, null, O(i.value, (A) => (t(), n("td", {
                  key: A.key,
                  class: z(["px-3 whitespace-nowrap", [
                    A.mono ? "font-mono text-xs" : "",
                    A.muted ? "text-muted-foreground" : ""
                  ]])
                }, [
                  Z($.$slots, `cell:${A.key}`, {
                    row: k,
                    value: k[A.key],
                    column: A
                  }, () => [
                    e.recordBase && k.id != null && A === i.value[0] ? (t(), n("a", {
                      key: 0,
                      href: `${e.recordBase}/${k.id}`,
                      class: "text-foreground underline-offset-2 hover:underline"
                    }, f(p(A, k[A.key], k)), 9, qr)) : x(k[A.key]) ? (t(), n("span", Gr, " - ")) : (t(), n(P, { key: 2 }, [
                      q(f(p(A, k[A.key], k)), 1)
                    ], 64))
                  ])
                ], 2))), 128))
              ], 10, Kr))), 128))
            ])
          ])
        ])) : b("", !0)
      ]),
      _: 2
    }, [
      u.value ? {
        name: "title",
        fn: L(() => [
          l("div", Tr, [
            e.title ? (t(), n("h3", Ir, f(e.title), 1)) : b("", !0)
          ]),
          d.value ? (t(), n("div", Er, [
            Z($.$slots, "actions")
          ])) : b("", !0)
        ]),
        key: "0"
      } : void 0,
      c.value ? {
        name: "toolbar",
        fn: L(() => [
          F(Dr, {
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
        fn: L(() => [
          e.nextCursor ? (t(), n("div", Wr, [
            l("button", {
              type: "button",
              class: "bg-background hover:bg-accent rounded-md border px-3 py-1.5 text-sm font-medium disabled:opacity-50",
              disabled: e.loading,
              onClick: C[6] || (C[6] = (k) => r("load", e.nextCursor))
            }, f(e.loading ? "Loading…" : "Load more"), 9, Zr)
          ])) : e.capped ? (t(), n("p", Yr, [
            q(" Showing the first " + f(e.rows.length) + ". ", 1),
            e.indexHref ? (t(), n("a", {
              key: 0,
              href: e.indexHref,
              class: "text-foreground underline-offset-2 hover:underline"
            }, " Open the full list ", 8, Jr)) : (t(), n(P, { key: 1 }, [
              q("Open the full list to search or filter the rest.")
            ], 64))
          ])) : b("", !0)
        ]),
        key: "2"
      } : void 0
    ]), 1024));
  }
}), Qr = { class: "flex items-center gap-2 overflow-x-auto" }, Xr = {
  key: 0,
  class: "size-3",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, ei = {
  key: 1,
  class: "size-3",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, ti = { class: "flex flex-col" }, ai = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, ni = {
  key: 0,
  class: "bg-destructive size-1.5 shrink-0 rounded-full",
  "aria-label": "has errors"
}, li = {
  key: 0,
  class: "bg-border h-px w-6 shrink-0",
  "aria-hidden": "true"
}, oi = /* @__PURE__ */ V({
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
    return (c, v) => (t(), n("ol", Qr, [
      (t(!0), n(P, null, O(e.steps, (p, x) => (t(), n("li", {
        key: x,
        class: "flex shrink-0 items-center gap-2"
      }, [
        (t(), T(ze(e.interactive ? "button" : "div"), re({
          type: e.interactive ? "button" : void 0,
          class: ["flex items-center gap-2 text-left text-sm", [
            e.interactive ? "transition-colors disabled:cursor-default" : "",
            i(x)
          ]]
        }, { ref_for: !0 }, e.interactive ? { disabled: x > e.activeStep } : {}, {
          onClick: (M) => e.interactive && x <= e.activeStep && r("update:activeStep", x)
        }), {
          default: L(() => [
            l("span", {
              class: z(["flex size-6 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums", s(x)])
            }, [
              u(x) ? (t(), n("svg", Xr, [...v[0] || (v[0] = [
                l("path", { d: "M18 6 6 18M6 6l12 12" }, null, -1)
              ])])) : d(x) ? (t(), n("svg", ei, [...v[1] || (v[1] = [
                l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
              ])])) : (t(), n(P, { key: 2 }, [
                q(f(x + 1), 1)
              ], 64))
            ], 2),
            l("span", ti, [
              l("span", null, f(p.label), 1),
              p.description ? (t(), n("span", ai, f(p.description), 1)) : b("", !0)
            ]),
            e.hasError(x) ? (t(), n("span", ni)) : b("", !0)
          ]),
          _: 2
        }, 1040, ["type", "class", "onClick"])),
        x < e.steps.length - 1 ? (t(), n("span", li)) : b("", !0)
      ]))), 128))
    ]));
  }
}), si = ["data-variant"], ri = "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden [&>svg]:size-3 [&>svg]:pointer-events-none", Ne = /* @__PURE__ */ V({
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
    }, s = h(() => {
      const i = o.soft ? r[o.variant] ?? a[o.variant] : a[o.variant];
      return [ri, i, o.class].filter(Boolean).join(" ");
    });
    return (i, d) => (t(), n("span", {
      "data-slot": "badge",
      "data-variant": e.variant,
      class: z(s.value)
    }, [
      Z(i.$slots, "default")
    ], 10, si));
  }
}), kt = /* @__PURE__ */ new Map();
function Ce(e, o) {
  kt.set(e, o);
}
function ii(e) {
  return kt.get(e);
}
function aC(e) {
  return kt.has(e);
}
function nC() {
  return [...kt.keys()].sort();
}
function lC() {
  kt.clear();
}
const oC = "text-sm text-muted-foreground font-normal", sC = "text-xs text-muted-foreground font-normal", St = "text-xs text-muted-foreground font-normal leading-snug";
class di extends Error {
  fieldErrors;
  constructor(o, a = {}) {
    super(o), this.name = "CreateOptionError", this.fieldErrors = a;
  }
}
function rC(e) {
  if (!e || typeof e != "object")
    return {};
  const o = {};
  for (const [a, r] of Object.entries(e)) {
    const s = Array.isArray(r) ? r[0] : r;
    typeof s == "string" && s !== "" && (o[a] = s);
  }
  return o;
}
function ui(e) {
  if (e.createOptionLabel)
    return e.createOptionLabel;
  const o = e.label.replace(/\s*id$/i, "").trim();
  return o !== "" ? `Create ${o.toLowerCase()}` : "Create option";
}
function ci(e) {
  if (e.createOptionActionLabel)
    return e.createOptionActionLabel;
  const o = e.label.replace(/\s*id$/i, "").trim();
  return o !== "" ? `Create ${o.toLowerCase()}` : "Create new";
}
const fi = "text-foreground font-normal", mi = "placeholder:text-muted-foreground placeholder:font-normal", We = `${fi} ${mi}`, pi = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(Sn), re({ "data-slot": "checkbox" }, y(i), {
      class: y(oe)(
        "peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        a.class
      )
    }), {
      default: L((c) => [
        F(y(Bn), {
          "data-slot": "checkbox-indicator",
          class: "grid place-content-center text-current transition-none"
        }, {
          default: L(() => [
            Z(d.$slots, "default", De(Ke(c)), () => [
              F(y(Ha), { class: "size-3.5" })
            ])
          ]),
          _: 2
        }, 1024)
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), tt = /* @__PURE__ */ V({
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
    const a = e, r = o, s = we(ye(a, "class"), r);
    return (i, d) => (t(), T(y(An), re({ "data-slot": "switch" }, y(s), {
      class: y(oe)(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        a.class
      )
    }), {
      default: L(() => [
        F(y(zn), {
          "data-slot": "switch-thumb",
          class: "bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        })
      ]),
      _: 1
    }, 16, ["class"]));
  }
}), vi = {
  key: 0,
  class: "text-destructive text-sm",
  role: "alert"
}, gi = /* @__PURE__ */ V({
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
    ge(
      () => a.open,
      (d) => {
        d && (s.value = {});
      }
    );
    function i() {
      r("submit", { ...s.value });
    }
    return (d, u) => (t(), T(bt, {
      open: e.open,
      title: e.title,
      description: e.description,
      size: "form",
      busy: e.processing,
      onClose: u[1] || (u[1] = (c) => r("close"))
    }, {
      footer: L(() => [
        F(ue, {
          type: "button",
          variant: "outline",
          disabled: e.processing,
          onClick: u[0] || (u[0] = (c) => r("close"))
        }, {
          default: L(() => [...u[2] || (u[2] = [
            q(" Cancel ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        F(ue, {
          type: "button",
          disabled: e.processing,
          onClick: i
        }, {
          default: L(() => [
            q(f(e.processing ? "Creating…" : "Create"), 1)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: L(() => [
        l("form", {
          class: "flex flex-col gap-4",
          onSubmit: be(i, ["prevent"])
        }, [
          e.generalError ? (t(), n("p", vi, f(e.generalError), 1)) : b("", !0),
          (t(!0), n(P, null, O(e.fields, (c) => (t(), T(Qe, {
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
}), hi = { class: "relative" }, bi = ["aria-invalid"], yi = ["id", "disabled", "aria-invalid", "aria-describedby", "aria-expanded"], xi = { class: "mb-2 flex items-center justify-between" }, ki = { class: "text-sm font-medium" }, $i = {
  role: "row",
  class: "grid grid-cols-7 gap-0.5"
}, wi = ["aria-label"], Ci = ["aria-label", "aria-selected", "data-iso", "data-selected", "data-today", "tabindex", "disabled", "onClick"], Mi = {
  key: 0,
  class: "mt-3 border-t pt-3"
}, Si = ["value"], Bi = /* @__PURE__ */ V({
  __name: "PkDatePicker",
  props: {
    modelValue: {},
    id: { default: void 0 },
    withTime: { type: Boolean, default: !1 },
    min: { default: null },
    max: { default: null },
    disabled: { type: Boolean, default: !1 },
    invalid: { type: Boolean, default: !1 },
    placeholder: { default: "Pick a date…" },
    describedBy: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s(U) {
      if (!U)
        return null;
      const [J] = U.split("T"), te = /^(\d{4})-(\d{2})-(\d{2})$/.exec(J ?? "");
      if (!te)
        return null;
      const [, he, ve, pe] = te;
      return new Date(Number(he), Number(ve) - 1, Number(pe));
    }
    function i(U) {
      return !U || !U.includes("T") ? "00:00" : U.split("T")[1]?.slice(0, 5) || "00:00";
    }
    function d(U) {
      return String(U).padStart(2, "0");
    }
    function u(U) {
      return `${U.getFullYear()}-${d(U.getMonth() + 1)}-${d(U.getDate())}`;
    }
    function c(U, J) {
      return U.getFullYear() === J.getFullYear() && U.getMonth() === J.getMonth() && U.getDate() === J.getDate();
    }
    const v = K(!1), p = h(() => s(a.modelValue)), x = K(i(a.modelValue)), M = K(p.value ?? /* @__PURE__ */ new Date());
    ge(
      () => a.modelValue,
      (U) => {
        x.value = i(U);
        const J = s(U);
        J && (M.value = J);
      }
    );
    const $ = h(() => s(a.min)), C = h(() => s(a.max));
    function k(U) {
      return $.value && U < $.value ? !0 : !!(C.value && U > C.value);
    }
    const B = h(
      () => M.value.toLocaleDateString(void 0, { month: "long", year: "numeric" })
    ), A = h(() => {
      const U = new Intl.DateTimeFormat(void 0, { weekday: "narrow" }), J = new Intl.DateTimeFormat(void 0, { weekday: "long" }), te = new Date(2023, 0, 1);
      return Array.from({ length: 7 }, (he, ve) => {
        const pe = new Date(te);
        return pe.setDate(te.getDate() + ve), { short: U.format(pe), full: J.format(pe) };
      });
    }), w = h(() => {
      const U = M.value.getFullYear(), J = M.value.getMonth(), he = new Date(U, J, 1).getDay(), ve = new Date(U, J + 1, 0).getDate(), pe = [];
      for (let $e = 0; $e < he; $e++)
        pe.push({ date: new Date(U, J, $e - he + 1), inMonth: !1 });
      for (let $e = 1; $e <= ve; $e++)
        pe.push({ date: new Date(U, J, $e), inMonth: !0 });
      for (; pe.length % 7 !== 0 || pe.length < 42; ) {
        const $e = pe[pe.length - 1].date, Xe = new Date($e);
        Xe.setDate($e.getDate() + 1), pe.push({ date: Xe, inMonth: !1 });
      }
      return pe;
    }), m = h(() => {
      const U = w.value, J = [];
      for (let te = 0; te < U.length; te += 7)
        J.push(U.slice(te, te + 7));
      return J;
    }), g = /* @__PURE__ */ new Date();
    function S(U) {
      return U.toLocaleDateString(void 0, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    function I() {
      M.value = new Date(M.value.getFullYear(), M.value.getMonth() - 1, 1);
    }
    function j() {
      M.value = new Date(M.value.getFullYear(), M.value.getMonth() + 1, 1);
    }
    function X(U, J) {
      r("update:modelValue", a.withTime ? `${u(U)}T${J}` : u(U));
    }
    function W(U) {
      a.disabled || k(U) || (X(U, x.value), a.withTime || (v.value = !1));
    }
    function Q(U) {
      const J = U.target.value || "00:00";
      x.value = J, p.value && X(p.value, J);
    }
    function Y() {
      r("update:modelValue", null);
    }
    const G = h(() => {
      if (!p.value)
        return null;
      const U = p.value.toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      return a.withTime ? `${U}, ${x.value}` : U;
    }), R = K(null), H = K(null);
    async function ae() {
      a.disabled || (v.value = !v.value, v.value && (await Ve(), R.value?.querySelector('[data-selected="true"], [data-today="true"]')?.focus()));
    }
    ge(v, (U, J) => {
      !U && J && H.value?.focus();
    });
    function _(U) {
      const te = document.activeElement?.dataset.iso;
      if (!te)
        return;
      const [he, ve, pe] = te.split("-").map(Number), $e = new Date(he, ve - 1, pe + U);
      ($e.getMonth() !== M.value.getMonth() || $e.getFullYear() !== M.value.getFullYear()) && (M.value = new Date($e.getFullYear(), $e.getMonth(), 1)), Ve(() => {
        R.value?.querySelector(`[data-iso="${u($e)}"]`)?.focus();
      });
    }
    function ee(U) {
      const J = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7
      };
      U.key in J && (U.preventDefault(), _(J[U.key]));
    }
    const D = K(null);
    function E(U) {
      if (U.key === "Escape") {
        U.preventDefault(), v.value = !1;
        return;
      }
      if (U.key !== "Tab" || !D.value)
        return;
      const J = D.value.querySelectorAll(
        'button:not([disabled]):not([tabindex="-1"]), input:not([disabled])'
      );
      if (J.length === 0)
        return;
      const te = J[0], he = J[J.length - 1];
      U.shiftKey && document.activeElement === te ? (U.preventDefault(), he.focus()) : !U.shiftKey && document.activeElement === he && (U.preventDefault(), te.focus());
    }
    return (U, J) => (t(), n("div", hi, [
      l("div", {
        "aria-invalid": e.invalid,
        class: z([
          "border-input bg-background flex h-9 items-center gap-2 rounded-md border px-3 text-sm",
          { "opacity-50": e.disabled },
          y(Se),
          y(Ge)
        ])
      }, [
        l("button", {
          id: e.id,
          ref_key: "triggerRef",
          ref: H,
          type: "button",
          class: "flex flex-1 items-center gap-2 text-left disabled:cursor-not-allowed",
          disabled: e.disabled,
          "aria-invalid": e.invalid,
          "aria-describedby": e.describedBy,
          "aria-expanded": v.value,
          "aria-haspopup": "dialog",
          onClick: ae
        }, [
          J[1] || (J[1] = l("svg", {
            class: "text-muted-foreground size-4 shrink-0",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "aria-hidden": "true"
          }, [
            l("rect", {
              x: "3",
              y: "5",
              width: "18",
              height: "16",
              rx: "2"
            }),
            l("path", { d: "M3 10h18M8 3v4M16 3v4" })
          ], -1)),
          l("span", {
            class: z(G.value ? "" : "text-muted-foreground")
          }, f(G.value ?? e.placeholder), 3)
        ], 8, yi),
        G.value && !e.disabled ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-xs",
          "aria-label": "Clear date",
          onClick: be(Y, ["stop"])
        }, " ✕ ")) : b("", !0)
      ], 10, bi),
      v.value ? (t(), n("div", {
        key: 0,
        ref_key: "dialogRef",
        ref: D,
        class: "bg-popover absolute z-50 mt-1 w-72 rounded-md border p-3 shadow-md",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Choose a date",
        onKeydown: E
      }, [
        l("div", xi, [
          l("button", {
            type: "button",
            class: "hover:bg-accent rounded p-1 text-sm",
            "aria-label": "Previous month",
            onClick: I
          }, " ‹ "),
          l("span", ki, f(B.value), 1),
          l("button", {
            type: "button",
            class: "hover:bg-accent rounded p-1 text-sm",
            "aria-label": "Next month",
            onClick: j
          }, " › ")
        ]),
        l("div", {
          ref_key: "gridRef",
          ref: R,
          role: "grid",
          onKeydown: ee
        }, [
          l("div", $i, [
            (t(!0), n(P, null, O(A.value, (te) => (t(), n("span", {
              key: te.short,
              class: "text-muted-foreground flex h-7 items-center justify-center text-xs",
              role: "columnheader",
              "aria-label": te.full
            }, f(te.short), 9, wi))), 128))
          ]),
          (t(!0), n(P, null, O(m.value, (te, he) => (t(), n("div", {
            key: he,
            role: "row",
            class: "grid grid-cols-7 gap-0.5"
          }, [
            (t(!0), n(P, null, O(te, (ve) => (t(), n("button", {
              key: ve.date.toISOString(),
              type: "button",
              role: "gridcell",
              "aria-label": S(ve.date),
              "aria-selected": !!p.value && c(ve.date, p.value),
              "data-iso": u(ve.date),
              "data-selected": !!p.value && c(ve.date, p.value),
              "data-today": c(ve.date, y(g)),
              tabindex: p.value ? c(ve.date, p.value) ? 0 : -1 : c(ve.date, y(g)) ? 0 : -1,
              disabled: k(ve.date),
              class: z([
                "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
                ve.inMonth ? "" : "text-muted-foreground/50",
                p.value && c(ve.date, p.value) ? "bg-primary text-primary-foreground font-medium" : c(ve.date, y(g)) ? "border-primary/50 border font-medium" : "hover:bg-accent",
                "disabled:pointer-events-none disabled:opacity-30",
                y(Se)
              ]),
              onClick: (pe) => W(ve.date)
            }, f(ve.date.getDate()), 11, Ci))), 128))
          ]))), 128))
        ], 544),
        e.withTime ? (t(), n("div", Mi, [
          J[2] || (J[2] = l("label", { class: "text-muted-foreground mb-1 block text-xs" }, "Time", -1)),
          l("input", {
            type: "time",
            value: x.value,
            class: z([
              "border-input bg-background h-9 w-full rounded-md border px-3 text-sm",
              y(Se)
            ]),
            onChange: Q
          }, null, 42, Si)
        ])) : b("", !0)
      ], 544)) : b("", !0),
      v.value ? (t(), n("div", {
        key: 1,
        class: "fixed inset-0 z-40",
        onClick: J[0] || (J[0] = (te) => v.value = !1)
      })) : b("", !0)
    ]));
  }
}), Ai = ["accept", "disabled"], zi = { class: "text-sm font-medium" }, Pi = { key: 0 }, _i = { key: 1 }, Vi = { class: "text-muted-foreground text-xs font-normal" }, Li = {
  key: 0,
  class: "bg-muted mt-2 h-1 w-40 overflow-hidden rounded-full"
}, Oi = {
  key: 1,
  class: "flex items-center gap-3 rounded-lg border p-3"
}, ji = ["src"], Di = {
  key: 1,
  class: "bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded text-[10px] font-semibold uppercase"
}, Ti = { class: "min-w-0 flex-1" }, Ii = { class: "block truncate text-sm font-medium" }, Ei = { class: "text-muted-foreground text-xs font-normal" }, Fi = ["href"], Ni = {
  key: 2,
  class: "text-destructive mt-1.5 text-xs"
}, Wa = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(null), i = K(!1), d = K(null), u = K(null), c = K(null), v = h(() => a.accept.map((m) => `.${m}`).join(",")), p = h(() => c.value ?? a.modelValue?.url ?? null), x = h(() => `${a.accept.length ? a.accept.join(", ").toUpperCase() : "Any file"} · up to ${M(a.maxKilobytes * 1024)}`);
    function M(m) {
      if (!m)
        return "";
      const g = ["B", "KB", "MB", "GB"];
      let S = m, I = 0;
      for (; S >= 1024 && I < g.length - 1; )
        S /= 1024, I++;
      return `${S.toFixed(S < 10 && I > 0 ? 1 : 0)} ${g[I]}`;
    }
    function $(m) {
      return m.split(".").pop()?.toLowerCase() ?? "";
    }
    function C(m) {
      return a.accept.length && !a.accept.includes($(m.name)) ? `${$(m.name).toUpperCase() || "That"} files are not accepted here.` : m.size > a.maxKilobytes * 1024 ? `That file is ${M(m.size)}; the limit is ${M(a.maxKilobytes * 1024)}.` : null;
    }
    async function k(m) {
      const g = m?.[0];
      if (!(!g || a.disabled) && (u.value = C(g), !u.value)) {
        B(), a.image && g.type.startsWith("image/") && (c.value = URL.createObjectURL(g)), d.value = 0;
        try {
          const S = await a.upload(g, (I) => {
            d.value = I;
          });
          r("update:modelValue", S);
        } catch (S) {
          u.value = S instanceof Error ? S.message : "The upload failed.", B();
        } finally {
          d.value = null, s.value && (s.value.value = "");
        }
      }
    }
    function B() {
      c.value && URL.revokeObjectURL(c.value), c.value = null;
    }
    async function A() {
      const m = a.modelValue;
      B(), u.value = null, r("update:modelValue", null), m && !m.url && a.discard && await a.discard(m.value).catch(() => {
      });
    }
    function w(m) {
      i.value = !1, k(m.dataTransfer?.files ?? null);
    }
    return (m, g) => (t(), n("div", null, [
      e.modelValue ? (t(), n("div", Oi, [
        e.image && p.value ? (t(), n("img", {
          key: 0,
          src: p.value,
          alt: "",
          class: "bg-muted size-12 shrink-0 rounded object-cover"
        }, null, 8, ji)) : (t(), n("span", Di, f($(e.modelValue.name) || "file"), 1)),
        l("span", Ti, [
          l("span", Ii, f(e.modelValue.name), 1),
          l("span", Ei, [
            q(f(M(e.modelValue.size)) + " ", 1),
            e.modelValue.url ? (t(), n(P, { key: 0 }, [
              g[4] || (g[4] = q(" · ", -1)),
              l("a", {
                href: e.modelValue.url,
                class: "hover:underline"
              }, "Download", 8, Fi)
            ], 64)) : (t(), n(P, { key: 1 }, [
              q(" · not saved yet")
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
        onDragover: g[1] || (g[1] = be((S) => i.value = !0, ["prevent"])),
        onDragleave: g[2] || (g[2] = be((S) => i.value = !1, ["prevent"])),
        onDrop: be(w, ["prevent"])
      }, [
        l("input", {
          ref_key: "input",
          ref: s,
          type: "file",
          class: "sr-only",
          accept: v.value,
          disabled: e.disabled,
          onChange: g[0] || (g[0] = (S) => k(S.target.files))
        }, null, 40, Ai),
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
        l("span", zi, [
          d.value === null ? (t(), n("span", Pi, "Drop a file or click to choose")) : (t(), n("span", _i, "Uploading…"))
        ]),
        l("span", Vi, f(x.value), 1),
        d.value !== null ? (t(), n("span", Li, [
          l("span", {
            class: "bg-primary block h-full transition-[width] duration-150",
            style: ie({ width: `${d.value}%` })
          }, null, 4)
        ])) : b("", !0)
      ], 34)),
      u.value ? (t(), n("p", Ni, f(u.value), 1)) : b("", !0)
    ]));
  }
}), Ri = { class: "flex flex-col gap-2" }, Hi = {
  key: 0,
  class: "flex flex-col gap-1.5"
}, Ui = { class: "text-muted-foreground grid grid-cols-[1fr_1fr_auto] gap-2 text-xs" }, Ki = { class: "flex flex-col gap-1" }, qi = ["onUpdate:modelValue", "disabled", "aria-label"], Gi = {
  key: 0,
  class: "text-destructive text-xs",
  role: "alert"
}, Wi = {
  key: 1,
  class: "text-destructive text-xs",
  role: "alert"
}, Zi = ["onUpdate:modelValue", "disabled", "aria-label"], Yi = ["disabled", "aria-label", "onClick"], Ji = {
  key: 1,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, Qi = { class: "flex items-center gap-3" }, Xi = ["disabled"], ed = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal tabular-nums"
}, td = /* @__PURE__ */ V({
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
      return k ? Object.entries(k).map(([B, A]) => ({
        uid: i++,
        key: B,
        value: A ?? ""
      })) : [];
    }
    ge(
      () => a.modelValue,
      (k) => {
        JSON.stringify(k ?? null) !== JSON.stringify(c()) && (d.value = u(k));
      }
    );
    function c() {
      const k = {};
      for (const B of d.value) {
        const A = B.key.trim();
        A !== "" && (k[A] = B.value);
      }
      return Object.keys(k).length ? k : null;
    }
    function v() {
      r("update:modelValue", c());
    }
    const p = h(() => {
      const k = /* @__PURE__ */ new Map();
      for (const B of d.value) {
        const A = B.key.trim();
        A !== "" && k.set(A, (k.get(A) ?? 0) + 1);
      }
      return new Set([...k.entries()].filter(([, B]) => B > 1).map(([B]) => B));
    }), x = h(
      () => new Set(
        d.value.map((k) => k.key.trim()).filter((k) => k !== "" && !s.test(k))
      )
    ), M = h(() => a.maxPairs !== null && d.value.length >= a.maxPairs);
    function $() {
      M.value || a.disabled || d.value.push({ uid: i++, key: "", value: "" });
    }
    function C(k) {
      d.value = d.value.filter((B) => B.uid !== k), v();
    }
    return (k, B) => (t(), n("div", Ri, [
      d.value.length ? (t(), n("div", Hi, [
        l("div", Ui, [
          l("span", null, f(e.keyLabel), 1),
          l("span", null, f(e.valueLabel), 1),
          B[0] || (B[0] = l("span", { class: "w-7" }, null, -1))
        ]),
        (t(!0), n(P, null, O(d.value, (A) => (t(), n("div", {
          key: A.uid,
          class: "grid grid-cols-[1fr_1fr_auto] items-start gap-2"
        }, [
          l("div", Ki, [
            xe(l("input", {
              "onUpdate:modelValue": (w) => A.key = w,
              type: "text",
              class: z([
                "border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
                p.value.has(A.key.trim()) || x.value.has(A.key.trim()) ? "border-destructive" : ""
              ]),
              disabled: e.disabled,
              "aria-label": e.keyLabel,
              onInput: v
            }, null, 42, qi), [
              [Le, A.key]
            ]),
            x.value.has(A.key.trim()) ? (t(), n("p", Gi, " Letters, numbers, underscores and dashes only. ")) : p.value.has(A.key.trim()) ? (t(), n("p", Wi, " Used twice - only the last value will be saved. ")) : b("", !0)
          ]),
          xe(l("input", {
            "onUpdate:modelValue": (w) => A.value = w,
            type: "text",
            class: "border-input bg-background focus-visible:ring-ring h-9 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
            disabled: e.disabled,
            "aria-label": e.valueLabel,
            onInput: v
          }, null, 40, Zi), [
            [Le, A.value]
          ]),
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-9 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-40",
            disabled: e.disabled,
            "aria-label": `Remove ${A.key || "this entry"}`,
            onClick: (w) => C(A.uid)
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
          ])], 8, Yi)
        ]))), 128))
      ])) : (t(), n("p", Ji, " Nothing here yet. ")),
      l("div", Qi, [
        l("button", {
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled || M.value,
          onClick: $
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
          q(" Add " + f(e.keyLabel.toLowerCase()), 1)
        ], 8, Xi),
        e.maxPairs !== null ? (t(), n("p", ed, f(d.value.length) + " of " + f(e.maxPairs), 1)) : b("", !0)
      ])
    ]));
  }
}), ad = { class: "border-input bg-background focus-within:ring-ring overflow-hidden rounded-md border focus-within:ring-2" }, nd = { class: "bg-muted/40 flex flex-wrap items-center gap-0.5 border-b px-1.5 py-1" }, ld = ["disabled", "title", "aria-label", "onClick"], od = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, sd = ["d"], rd = ["disabled"], id = ["contenteditable", "data-placeholder"], dd = {
  key: 0,
  class: "text-muted-foreground border-t px-3 py-1 text-right text-xs tabular-nums"
}, ud = /* @__PURE__ */ V({
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
    ], u = h(() => d.filter((C) => a.toolbar.includes(C.id))), c = h(() => a.toolbar.includes("link")), v = K(0);
    function p() {
      const C = s.value?.innerHTML ?? "", k = (s.value?.innerText ?? "").trim();
      v.value = k.length;
      const B = k === "" ? null : C;
      i = B, r("update:modelValue", B);
    }
    function x(C) {
      a.disabled || (s.value?.focus(), document.execCommand(C.command, !1, C.argument), p());
    }
    function M() {
      if (a.disabled)
        return;
      const C = window.prompt("Link address");
      C && (s.value?.focus(), document.execCommand("createLink", !1, C), p());
    }
    function $(C) {
      C.preventDefault();
      const k = C.clipboardData?.getData("text/plain") ?? "";
      document.execCommand("insertText", !1, k), p();
    }
    return ke(() => {
      s.value && (s.value.innerHTML = a.modelValue ?? "", v.value = s.value.innerText.trim().length);
    }), ge(
      () => a.modelValue,
      (C) => {
        C !== i && s.value && (s.value.innerHTML = C ?? "", v.value = s.value.innerText.trim().length);
      }
    ), (C, k) => (t(), n("div", ad, [
      l("div", nd, [
        (t(!0), n(P, null, O(u.value, (B) => (t(), n("button", {
          key: B.id,
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40",
          disabled: e.disabled,
          title: B.label,
          "aria-label": B.label,
          onMousedown: k[0] || (k[0] = be(() => {
          }, ["prevent"])),
          onClick: (A) => x(B)
        }, [
          (t(), n("svg", od, [
            l("path", {
              d: B.path
            }, null, 8, sd)
          ]))
        ], 40, ld))), 128)),
        c.value ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded transition-colors disabled:opacity-40",
          disabled: e.disabled,
          title: "Link",
          "aria-label": "Link",
          onMousedown: k[1] || (k[1] = be(() => {
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
        ])], 40, rd)) : b("", !0)
      ]),
      l("div", {
        ref_key: "editor",
        ref: s,
        class: z(["pk-prose min-h-28 px-3 py-2 text-sm focus:outline-none", e.disabled ? "pointer-events-none opacity-60" : ""]),
        contenteditable: !e.disabled,
        role: "textbox",
        "aria-multiline": "true",
        "data-placeholder": e.placeholder,
        onInput: p,
        onBlur: p,
        onPaste: $
      }, null, 42, id),
      e.maxLength !== null ? (t(), n("div", dd, f(v.value) + " / " + f(e.maxLength), 1)) : b("", !0)
    ]));
  }
}), cd = /* @__PURE__ */ it(ud, [["__scopeId", "data-v-32c63bc7"]]), fd = { class: "relative" }, md = ["id", "disabled", "aria-invalid", "aria-describedby", "aria-expanded"], pd = { class: "flex shrink-0 items-center gap-1" }, vd = ["aria-label"], gd = ["tabindex", "data-value", "data-selected", "aria-selected", "onClick", "onFocus"], hd = {
  key: 0,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, wa = /* @__PURE__ */ V({
  __name: "PkSelectMenu",
  props: {
    modelValue: {},
    options: {},
    id: { default: void 0 },
    disabled: { type: Boolean, default: !1 },
    invalid: { type: Boolean, default: !1 },
    placeholder: { default: "Select…" },
    clearable: { type: Boolean, default: !0 },
    label: { default: void 0 },
    describedBy: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(!1), i = K(null), d = K(null), u = h(
      () => a.options.find((B) => String(B.value) === String(a.modelValue)) ?? null
    );
    ge(s, (B, A) => {
      !B && A && d.value?.focus();
    });
    const c = h(() => {
      const B = a.options.findIndex((A) => String(A.value) === String(a.modelValue));
      return B >= 0 ? B : 0;
    }), v = K(null);
    function p(B) {
      return B === (v.value ?? c.value) ? 0 : -1;
    }
    async function x() {
      a.disabled || (s.value = !s.value, s.value && (v.value = null, await Ve(), Array.from(i.value?.querySelectorAll('[role="option"]') ?? [])[c.value]?.focus()));
    }
    function M(B) {
      r("update:modelValue", B.value), s.value = !1;
    }
    function $() {
      r("update:modelValue", null);
    }
    function C(B) {
      const A = Array.from(i.value?.querySelectorAll('[role="option"]') ?? []), w = document.activeElement, m = A.indexOf(w);
      A[Math.min(Math.max(m + B, 0), A.length - 1)]?.focus();
    }
    function k(B) {
      if (B.key === "ArrowDown")
        B.preventDefault(), C(1);
      else if (B.key === "ArrowUp")
        B.preventDefault(), C(-1);
      else if (B.key === "Escape" || B.key === "Tab") {
        if (B.key === "Tab") {
          s.value = !1;
          return;
        }
        B.preventDefault(), s.value = !1;
      } else if (B.key === "Enter" || B.key === " ") {
        const A = document.activeElement;
        if (A?.dataset.value !== void 0) {
          B.preventDefault();
          const w = a.options.find((m) => String(m.value) === A.dataset.value);
          w && M(w);
        }
      }
    }
    return (B, A) => (t(), n("div", fd, [
      l("button", {
        id: e.id,
        ref_key: "triggerRef",
        ref: d,
        type: "button",
        class: z([
          "border-input bg-background flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50",
          y(Se),
          y(Ge)
        ]),
        disabled: e.disabled,
        "aria-invalid": e.invalid,
        "aria-describedby": e.describedBy,
        "aria-expanded": s.value,
        "aria-haspopup": "listbox",
        onClick: x
      }, [
        l("span", {
          class: z(["truncate", u.value ? "" : "text-muted-foreground"])
        }, f(u.value?.label ?? e.placeholder), 3),
        l("span", pd, [
          e.clearable && u.value && !e.disabled ? (t(), n("span", {
            key: 0,
            class: "text-muted-foreground hover:text-foreground text-xs",
            role: "button",
            "aria-label": "Clear selection",
            onClick: be($, ["stop"])
          }, " ✕ ")) : b("", !0),
          A[1] || (A[1] = l("svg", {
            class: "text-muted-foreground size-4",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "aria-hidden": "true"
          }, [
            l("path", { d: "m6 9 6 6 6-6" })
          ], -1))
        ])
      ], 10, md),
      s.value ? (t(), n("div", {
        key: 0,
        ref_key: "listRef",
        ref: i,
        role: "listbox",
        "aria-label": e.label,
        class: "bg-popover absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border p-1 shadow-md",
        onKeydown: k
      }, [
        (t(!0), n(P, null, O(e.options, (w, m) => (t(), n("button", {
          key: String(w.value),
          type: "button",
          role: "option",
          tabindex: p(m),
          "data-value": String(w.value),
          "data-selected": String(w.value) === String(e.modelValue),
          "aria-selected": String(w.value) === String(e.modelValue),
          class: z([
            "flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
            String(w.value) === String(e.modelValue) ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent hover:text-accent-foreground",
            y(Se)
          ]),
          onClick: (g) => M(w),
          onFocus: (g) => v.value = m
        }, f(w.label), 43, gd))), 128)),
        e.options.length === 0 ? (t(), n("p", hd, " No options ")) : b("", !0)
      ], 40, vd)) : b("", !0),
      s.value ? (t(), n("div", {
        key: 1,
        class: "fixed inset-0 z-40",
        onClick: A[0] || (A[0] = (w) => s.value = !1)
      })) : b("", !0)
    ]));
  }
}), bd = ["role"], yd = ["title"], xd = ["type", "name", "value", "checked", "disabled", "aria-label", "onChange"], kd = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, $d = ["d"], wd = { key: 1 }, Cd = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Za = /* @__PURE__ */ V({
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
    const a = e, r = o, s = h(() => !!a.field.multiple), i = h(() => !!a.field.grouped), d = h(() => !!a.field.hiddenLabels), u = h(() => a.field.inline !== !1), c = h(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    );
    function v(m) {
      return s.value ? c.value.some((g) => g == m.value) : a.modelValue != null && m.value == a.modelValue;
    }
    function p(m) {
      if (!a.disabled) {
        if (s.value) {
          r(
            "update:modelValue",
            v(m) ? c.value.filter((g) => g != m.value) : [...c.value, m.value]
          );
          return;
        }
        r("update:modelValue", m.value);
      }
    }
    function x(m) {
      return a.field.colors?.[String(m.value)] ?? "primary";
    }
    function M(m) {
      const g = a.field.icons?.[String(m.value)];
      return g ? me(g) : null;
    }
    function $(m) {
      return a.field.tooltips?.[String(m.value)] ?? m.label;
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
    function B(m) {
      const g = x(m), S = v(m);
      return [
        Se,
        "inline-flex items-center justify-center gap-1.5 border px-3 py-1.5 text-sm font-medium transition-colors",
        i.value ? "rounded-none first:rounded-l-md last:rounded-r-md -ml-px first:ml-0" : "rounded-md",
        S ? C[g] ?? C.primary : k[g] ?? k.primary,
        a.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      ].join(" ");
    }
    const A = h(() => {
      if (!(u.value || i.value) && a.field.columns && a.field.columns > 1)
        return { gridTemplateColumns: `repeat(${a.field.columns}, minmax(0, 1fr))` };
    }), w = h(() => i.value ? "inline-flex flex-wrap" : u.value ? "flex flex-wrap gap-2" : "grid gap-2");
    return (m, g) => (t(), n("div", {
      role: s.value ? "group" : "radiogroup",
      class: z(w.value),
      style: ie(A.value),
      "data-test": "toggle-buttons-field"
    }, [
      (t(!0), n(P, null, O(e.options, (S) => (t(), n("label", {
        key: String(S.value),
        class: z(B(S)),
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
          onChange: (I) => p(S)
        }, null, 40, xd),
        M(S) ? (t(), n("svg", kd, [
          l("path", {
            d: M(S)
          }, null, 8, $d)
        ])) : b("", !0),
        d.value ? b("", !0) : (t(), n("span", wd, f(S.label), 1))
      ], 10, yd))), 128)),
      e.options.length === 0 ? (t(), n("p", Cd, " Nothing to choose from yet. ")) : b("", !0)
    ], 14, bd));
  }
}), Md = {
  key: 1,
  class: "flex flex-col gap-2"
}, Sd = { class: "flex items-center justify-between gap-2" }, Bd = ["for"], Ad = {
  key: 0,
  class: "text-destructive",
  "aria-hidden": "true"
}, zd = ["aria-label", "disabled"], Pd = {
  key: 7,
  class: "flex flex-col gap-2"
}, _d = {
  key: 2,
  class: "relative"
}, Vd = ["disabled"], Ld = {
  key: 0,
  class: "bg-popover absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md"
}, Od = { class: "max-h-56 overflow-y-auto p-1" }, jd = ["onClick"], Dd = {
  key: 8,
  class: "relative"
}, Td = ["id", "disabled"], Id = {
  key: 0,
  class: "bg-popover absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md"
}, Ed = { class: "max-h-56 overflow-y-auto p-1" }, Fd = {
  key: 0,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, Nd = {
  key: 1,
  class: "text-muted-foreground px-2 py-2 text-xs"
}, Rd = ["onClick"], Hd = {
  key: 10,
  class: "flex items-center gap-2 text-sm"
}, Ud = {
  key: 11,
  class: "flex items-center gap-2 text-sm"
}, Kd = ["id", "value", "rows", "placeholder", "disabled"], qd = ["aria-invalid"], Gd = {
  key: 0,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Wd = ["aria-label", "disabled"], Zd = ["id", "value", "rows", "placeholder", "disabled"], Yd = {
  key: 2,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, Jd = ["aria-label", "disabled"], Qd = ["id", "type", "value", "placeholder", "autocomplete", "min", "max", "disabled"], Xd = ["aria-invalid"], eu = {
  key: 0,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, tu = ["aria-label", "disabled"], au = ["id", "type", "value", "placeholder", "autocomplete", "min", "max", "disabled"], nu = {
  key: 2,
  class: "bg-muted text-muted-foreground flex items-center px-2 text-sm"
}, lu = ["aria-label", "disabled"], ou = {
  key: 17,
  class: "flex flex-wrap gap-1.5"
}, su = ["disabled", "aria-pressed", "onClick"], ru = {
  key: 18,
  class: "flex flex-wrap gap-1.5"
}, iu = ["title", "disabled", "onClick"], du = ["href"], uu = ["id"], cu = ["id"], Qe = /* @__PURE__ */ V({
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
    const a = ya(() => import("./PkRepeater-J84jGe3T.js")), r = ya(() => import("./PkBuilder-DXeyw3Du.js")), s = e, i = o, d = K(!1), u = K(""), c = K([]), v = K(!1), p = K(null), x = h(
      () => s.options.find((ce) => String(ce.value) === String(s.value))?.label ?? null
    ), M = h(() => p.value ?? x.value);
    let $;
    ge(u, (ce) => {
      s.searchOptions && (clearTimeout($), v.value = !0, $ = setTimeout(async () => {
        try {
          c.value = await s.searchOptions(ce);
        } catch {
        } finally {
          v.value = !1;
        }
      }, 200));
    });
    async function C() {
      if (!(s.processing || s.field.disabled) && (d.value = !0, c.value.length === 0 && s.searchOptions)) {
        v.value = !0;
        try {
          c.value = await s.searchOptions("");
        } finally {
          v.value = !1;
        }
      }
    }
    function k(ce) {
      p.value = ce.label, i("change", ce.value), d.value = !1, u.value = "";
    }
    function B() {
      p.value = null, i("change", null);
    }
    const A = At("panelPicker", null), w = At("panelCreateOption", null), m = K(!1), g = K(!1), S = K({}), I = K(null), j = h(() => ui(s.field)), X = h(() => ci(s.field));
    function W() {
      S.value = {}, I.value = null, m.value = !0, d.value = !1;
    }
    function Q() {
      g.value || (m.value = !1, S.value = {}, I.value = null);
    }
    async function Y(ce) {
      if (w) {
        g.value = !0, S.value = {}, I.value = null;
        try {
          const se = await w.run(s.field.key, { ...ce });
          k(se), m.value = !1;
        } catch (se) {
          se instanceof di ? (S.value = se.fieldErrors, I.value = Object.keys(se.fieldErrors).length === 0 ? se.message : null) : I.value = se instanceof Error ? se.message : "Could not create that option.";
        } finally {
          g.value = !1;
        }
      }
    }
    const G = h(() => {
      if (!s.field.tableSelect || !A?.base)
        return;
      const ce = A.returnUrl || "/";
      return `${A.base}/pick/${s.field.key}?return=${encodeURIComponent(ce)}`;
    }), R = h(() => s.field.morphTo ?? []), H = h(() => {
      const ce = s.value;
      return ce && typeof ce == "object" && !Array.isArray(ce) ? ce : { type: void 0, id: void 0 };
    });
    function ae(ce) {
      i("change", { type: ce || null, id: null });
    }
    function _(ce) {
      i("change", { type: H.value.type ?? null, id: ce });
    }
    function ee(ce) {
      p.value = ce.label, _(ce.value), d.value = !1, u.value = "";
    }
    Me(() => clearTimeout($));
    const D = h(() => ii(s.field.type)), E = h(
      () => !!s.field.prefix || !!s.field.suffix || !!s.field.prefixIcon || !!s.field.suffixIcon || !!s.field.prefixAction || !!s.field.suffixAction
    );
    function U(ce) {
      if (ce) {
        if (ce.copy) {
          const se = s.value == null ? "" : String(s.value);
          se !== "" && typeof navigator < "u" && navigator.clipboard && navigator.clipboard.writeText(se);
          return;
        }
        if (ce.url && typeof window < "u") {
          window.open(ce.url, "_blank", "noopener,noreferrer");
          return;
        }
        ce.key && i("affix-action", ce.key);
      }
    }
    const J = `border-input bg-background h-9 rounded-md border px-3 text-sm disabled:opacity-50 ${We} ${Se} ${Ge}`, te = h(() => `f-${s.field.key}-error`), he = h(() => `f-${s.field.key}-help`), ve = h(() => {
      const ce = [
        s.error ? te.value : null,
        s.field.help && s.field.type !== "toggle" ? he.value : null
      ].filter((se) => se !== null);
      return ce.length > 0 ? ce.join(" ") : void 0;
    }), pe = h(() => ({
      "aria-invalid": !!s.error,
      "aria-describedby": ve.value
    })), $e = `bg-background h-9 min-w-0 flex-1 border-0 bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:outline-none disabled:opacity-50 ${We}`;
    function Xe(ce) {
      const se = document.getElementById(`f-${s.field.key}`);
      if (!(se instanceof HTMLTextAreaElement) && !(se instanceof HTMLInputElement))
        return;
      const N = se.selectionStart ?? se.value.length, le = se.selectionEnd ?? N;
      se.setRangeText(ce, N, le, "end"), se.dispatchEvent(new Event("input", { bubbles: !0 })), se.focus();
    }
    return (ce, se) => (t(), n(P, null, [
      e.field.type === "hidden" ? (t(), n(P, { key: 0 }, [], 64)) : (t(), n("div", Md, [
        l("div", Sd, [
          l("label", {
            for: `f-${e.field.key}`,
            class: z(["text-sm font-medium leading-none", { "sr-only": e.field.labelHidden }])
          }, [
            q(f(e.field.label) + " ", 1),
            e.field.required ? (t(), n("span", Ad, "*")) : b("", !0)
          ], 10, Bd),
          e.field.hint ? (t(), n("span", {
            key: 0,
            class: z(["flex items-center gap-1", y(St)])
          }, [
            q(f(e.field.hint) + " ", 1),
            e.field.hintAction ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "hover:text-foreground rounded px-1",
              "aria-label": e.field.hintAction.label ?? "Copy",
              disabled: e.field.disabled || e.processing,
              onClick: se[0] || (se[0] = (N) => U(e.field.hintAction))
            }, f(e.field.hintAction.label ?? "⧉"), 9, zd)) : b("", !0)
          ], 2)) : b("", !0)
        ]),
        D.value ? (t(), T(ze(D.value), re({ key: 0 }, pe.value, {
          field: e.field,
          "model-value": e.value,
          values: e.values,
          options: e.options,
          errors: e.errors,
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": se[1] || (se[1] = (N) => i("change", N))
        }), null, 16, ["field", "model-value", "values", "options", "errors", "disabled"])) : e.field.type === "file" && e.upload ? (t(), T(Wa, re({ key: 1 }, pe.value, {
          "model-value": e.value ?? null,
          accept: e.field.accept ?? [],
          "max-kilobytes": e.field.maxKilobytes ?? 10240,
          image: e.field.image ?? !1,
          disabled: e.field.disabled || e.processing,
          upload: e.upload,
          discard: e.discard,
          "onUpdate:modelValue": se[2] || (se[2] = (N) => i("change", N))
        }), null, 16, ["model-value", "accept", "max-kilobytes", "image", "disabled", "upload", "discard"])) : e.field.type === "repeater" ? (t(), T(y(a), {
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
          "onUpdate:modelValue": se[3] || (se[3] = (N) => i("change", N))
        }, null, 8, ["model-value", "children", "field-key", "item-label", "min-items", "max-items", "collapsible", "addable", "deletable", "cloneable", "table", "relationship", "disabled", "errors", "child-options"])) : e.field.type === "builder" ? (t(), T(y(r), {
          key: 3,
          "model-value": e.value ?? null,
          blocks: e.field.blocks ?? [],
          "max-blocks": e.field.maxBlocks ?? null,
          disabled: e.field.disabled || e.processing,
          errors: e.errors,
          "onUpdate:modelValue": se[4] || (se[4] = (N) => i("change", N))
        }, null, 8, ["model-value", "blocks", "max-blocks", "disabled", "errors"])) : e.field.type === "richtext" ? (t(), T(cd, re({ key: 4 }, pe.value, {
          "model-value": e.value ?? null,
          toolbar: e.field.toolbar ?? ["bold", "italic", "heading", "list", "link"],
          "max-length": e.field.maxLength ?? null,
          placeholder: e.field.placeholder ?? "Write a note…",
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": se[5] || (se[5] = (N) => i("change", N))
        }), null, 16, ["model-value", "toolbar", "max-length", "placeholder", "disabled"])) : e.field.type === "keyvalue" ? (t(), T(td, re({ key: 5 }, pe.value, {
          "model-value": e.value ?? null,
          "key-label": e.field.keyLabel ?? "Key",
          "value-label": e.field.valueLabel ?? "Value",
          "max-pairs": e.field.maxPairs ?? null,
          disabled: e.field.disabled || e.processing,
          "onUpdate:modelValue": se[6] || (se[6] = (N) => i("change", N))
        }), null, 16, ["model-value", "key-label", "value-label", "max-pairs", "disabled"])) : e.field.type === "multiselect" ? (t(), T(ua, re({ key: 6 }, pe.value, {
          "model-value": Array.isArray(e.value) ? e.value : [],
          options: e.options ?? [],
          disabled: e.field.disabled || e.processing,
          max: e.field.max ?? null,
          placeholder: e.field.placeholder ?? "Select…",
          "onUpdate:modelValue": se[7] || (se[7] = (N) => i("change", N))
        }), null, 16, ["model-value", "options", "disabled", "max", "placeholder"])) : R.value.length ? (t(), n("div", Pd, [
          e.field.morphTypeSelect === "toggle-buttons" ? (t(), T(Za, re({ key: 0 }, pe.value, {
            field: { key: `${e.field.key}-type`, grouped: !0, inline: !0 },
            "model-value": H.value.type ?? null,
            options: R.value.map((N) => ({ value: N.value, label: N.label })),
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": se[8] || (se[8] = (N) => ae(N == null ? "" : String(N)))
          }), null, 16, ["field", "model-value", "options", "disabled"])) : (t(), T(wa, {
            key: 1,
            id: `f-${e.field.key}-type`,
            "model-value": H.value.type ?? null,
            options: R.value,
            disabled: e.field.disabled || e.processing,
            invalid: !!e.error,
            "described-by": ve.value,
            placeholder: "Type",
            "onUpdate:modelValue": se[9] || (se[9] = (N) => ae(N == null ? "" : String(N)))
          }, null, 8, ["id", "model-value", "options", "disabled", "invalid", "described-by"])),
          H.value.type && e.searchOptions ? (t(), n("div", _d, [
            l("button", re({
              type: "button",
              class: [
                "border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50",
                y(Se),
                y(Ge)
              ],
              disabled: e.field.disabled || e.processing
            }, pe.value, { onClick: C }), [
              l("span", {
                class: z(p.value || H.value.id ? "" : "text-muted-foreground")
              }, f(p.value ?? (H.value.id ? String(H.value.id) : "Search…")), 3)
            ], 16, Vd),
            d.value ? (t(), n("div", Ld, [
              xe(l("input", {
                "onUpdate:modelValue": se[10] || (se[10] = (N) => u.value = N),
                type: "search",
                class: "h-9 w-full border-b bg-transparent px-3 text-sm outline-none",
                placeholder: "Type to search…",
                autofocus: ""
              }, null, 512), [
                [Le, u.value]
              ]),
              l("div", Od, [
                (t(!0), n(P, null, O(c.value, (N) => (t(), n("button", {
                  key: String(N.value),
                  type: "button",
                  class: "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
                  onClick: (le) => ee(N)
                }, f(N.label), 9, jd))), 128))
              ])
            ])) : b("", !0),
            d.value ? (t(), n("div", {
              key: 1,
              class: "fixed inset-0 z-40",
              onClick: se[11] || (se[11] = (N) => d.value = !1)
            })) : b("", !0)
          ])) : b("", !0)
        ])) : e.field.type === "select" && e.searchOptions ? (t(), n("div", Dd, [
          l("button", re({
            id: `f-${e.field.key}`,
            type: "button",
            class: [
              "border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50",
              y(Se),
              y(Ge)
            ],
            disabled: e.field.disabled || e.processing
          }, pe.value, { onClick: C }), [
            l("span", {
              class: z(M.value || e.value ? "" : "text-muted-foreground")
            }, f(M.value ?? (e.value ? String(e.value) : "Search…")), 3),
            e.value ? (t(), n("span", {
              key: 0,
              class: "text-muted-foreground hover:text-foreground ml-2 text-xs",
              role: "button",
              "aria-label": "Clear selection",
              onClick: be(B, ["stop"])
            }, " ✕ ")) : b("", !0)
          ], 16, Td),
          d.value ? (t(), n("div", Id, [
            xe(l("input", {
              "onUpdate:modelValue": se[12] || (se[12] = (N) => u.value = N),
              type: "search",
              class: "h-9 w-full border-b bg-transparent px-3 text-sm outline-none",
              placeholder: "Type to search…",
              autofocus: ""
            }, null, 512), [
              [Le, u.value]
            ]),
            l("div", Ed, [
              v.value ? (t(), n("p", Fd, " Searching… ")) : c.value.length === 0 ? (t(), n("p", Nd, " No matches ")) : b("", !0),
              (t(!0), n(P, null, O(c.value, (N) => (t(), n("button", {
                key: String(N.value),
                type: "button",
                class: "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded px-2 py-1.5 text-left text-sm",
                onClick: (le) => k(N)
              }, f(N.label), 9, Rd))), 128)),
              e.field.createOption && y(w) ? (t(), n("button", {
                key: 2,
                type: "button",
                class: "text-primary hover:bg-accent mt-1 flex w-full items-center gap-1.5 rounded border-t px-2 py-2 text-left text-sm font-medium",
                onClick: W
              }, [
                se[26] || (se[26] = l("span", { "aria-hidden": "true" }, "+", -1)),
                q(" " + f(X.value), 1)
              ])) : b("", !0)
            ])
          ])) : b("", !0),
          d.value ? (t(), n("div", {
            key: 1,
            class: "fixed inset-0 z-40",
            onClick: se[13] || (se[13] = (N) => d.value = !1)
          })) : b("", !0)
        ])) : e.field.type === "select" ? (t(), T(wa, {
          key: 9,
          id: `f-${e.field.key}`,
          "model-value": e.value ?? null,
          options: e.options ?? [],
          disabled: e.field.disabled || e.processing,
          invalid: !!e.error,
          placeholder: e.field.placeholder ?? "Select…",
          clearable: !e.field.required,
          label: e.field.label,
          "described-by": ve.value,
          "onUpdate:modelValue": se[14] || (se[14] = (N) => i("change", N))
        }, null, 8, ["id", "model-value", "options", "disabled", "invalid", "placeholder", "clearable", "label", "described-by"])) : e.field.type === "toggle" ? (t(), n("label", Hd, [
          F(y(tt), re({
            id: `f-${e.field.key}`
          }, pe.value, {
            "model-value": !!e.value,
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": se[15] || (se[15] = (N) => i("change", N))
          }), null, 16, ["id", "model-value", "disabled"]),
          l("span", {
            class: z(y(St))
          }, f(e.field.help ?? "Enabled"), 3)
        ])) : e.field.type === "checkbox" ? (t(), n("label", Ud, [
          F(y(pi), re({
            id: `f-${e.field.key}`
          }, pe.value, {
            "model-value": !!e.value,
            disabled: e.field.disabled || e.processing,
            "onUpdate:modelValue": se[16] || (se[16] = (N) => i("change", N === !0))
          }), null, 16, ["id", "model-value", "disabled"]),
          l("span", {
            class: z(y(St))
          }, f(e.field.help ?? e.field.label), 3)
        ])) : e.field.type === "textarea" && !E.value ? (t(), n("textarea", re({
          key: 12,
          id: `f-${e.field.key}`,
          value: e.value ?? "",
          rows: e.field.rows ?? 3,
          placeholder: e.field.placeholder,
          disabled: e.field.disabled || e.processing
        }, pe.value, {
          class: [
            "border-input bg-background rounded-md border px-3 py-2 text-sm disabled:opacity-50",
            y(We),
            y(Se),
            y(Ge)
          ],
          onInput: se[17] || (se[17] = (N) => i("change", N.target.value))
        }), null, 16, Kd)) : e.field.type === "textarea" ? (t(), n("div", {
          key: 13,
          "aria-invalid": !!e.error,
          class: z([
            "border-input flex overflow-hidden rounded-md border",
            y($a),
            y(Ge),
            { "opacity-50": e.field.disabled || e.processing }
          ])
        }, [
          e.field.prefix || e.field.prefixIcon ? (t(), n("span", Gd, f(e.field.prefix ?? e.field.prefixIcon), 1)) : b("", !0),
          e.field.prefixAction ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.prefixAction.label ?? "Action",
            disabled: e.field.disabled || e.processing,
            onClick: se[18] || (se[18] = (N) => U(e.field.prefixAction))
          }, f(e.field.prefixAction.label ?? "⧉"), 9, Wd)) : b("", !0),
          l("textarea", re({
            id: `f-${e.field.key}`,
            value: e.value ?? "",
            rows: e.field.rows ?? 3,
            placeholder: e.field.placeholder,
            disabled: e.field.disabled || e.processing
          }, pe.value, {
            class: [
              "min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm focus-visible:outline-none",
              y(We)
            ],
            onInput: se[19] || (se[19] = (N) => i("change", N.target.value))
          }), null, 16, Zd),
          e.field.suffix || e.field.suffixIcon ? (t(), n("span", Yd, f(e.field.suffix ?? e.field.suffixIcon), 1)) : b("", !0),
          e.field.suffixAction ? (t(), n("button", {
            key: 3,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.suffixAction.label ?? "Copy",
            disabled: e.field.disabled || e.processing,
            onClick: se[20] || (se[20] = (N) => U(e.field.suffixAction))
          }, f(e.field.suffixAction.label ?? "⧉"), 9, Jd)) : b("", !0)
        ], 10, qd)) : e.field.type === "date" || e.field.type === "datetime" ? (t(), T(Bi, {
          key: 14,
          id: `f-${e.field.key}`,
          "model-value": e.value ?? null,
          "with-time": e.field.type === "datetime",
          disabled: e.field.disabled || e.processing,
          invalid: !!e.error,
          "described-by": ve.value,
          "onUpdate:modelValue": se[21] || (se[21] = (N) => i("change", N))
        }, null, 8, ["id", "model-value", "with-time", "disabled", "invalid", "described-by"])) : E.value ? (t(), n("div", {
          key: 16,
          "aria-invalid": !!e.error,
          class: z([
            "border-input flex h-9 overflow-hidden rounded-md border",
            y($a),
            y(Ge),
            { "opacity-50": e.field.disabled || e.processing }
          ])
        }, [
          e.field.prefix || e.field.prefixIcon ? (t(), n("span", eu, f(e.field.prefix ?? e.field.prefixIcon), 1)) : b("", !0),
          e.field.prefixAction ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.prefixAction.label ?? "Action",
            disabled: e.field.disabled || e.processing,
            onClick: se[23] || (se[23] = (N) => U(e.field.prefixAction))
          }, f(e.field.prefixAction.label ?? "⧉"), 9, tu)) : b("", !0),
          l("input", re({
            id: `f-${e.field.key}`,
            type: e.field.type === "number" ? "number" : e.field.type === "password" ? "password" : e.field.inputType ?? "text",
            value: e.value ?? "",
            placeholder: e.field.placeholder,
            autocomplete: e.field.type === "password" ? "new-password" : void 0,
            min: e.field.min,
            max: e.field.max,
            disabled: e.field.disabled || e.processing
          }, pe.value, {
            class: $e,
            onInput: se[24] || (se[24] = (N) => i("change", N.target.value))
          }), null, 16, au),
          e.field.suffix || e.field.suffixIcon ? (t(), n("span", nu, f(e.field.suffix ?? e.field.suffixIcon), 1)) : b("", !0),
          e.field.suffixAction ? (t(), n("button", {
            key: 3,
            type: "button",
            class: "bg-muted text-muted-foreground hover:text-foreground px-2 text-xs",
            "aria-label": e.field.suffixAction.label ?? "Copy",
            disabled: e.field.disabled || e.processing,
            onClick: se[25] || (se[25] = (N) => U(e.field.suffixAction))
          }, f(e.field.suffixAction.label ?? "⧉"), 9, lu)) : b("", !0)
        ], 10, Xd)) : (t(), n("input", re({
          key: 15,
          id: `f-${e.field.key}`,
          type: e.field.type === "number" ? "number" : e.field.type === "password" ? "password" : e.field.inputType ?? "text",
          value: e.value ?? "",
          placeholder: e.field.placeholder,
          autocomplete: e.field.type === "password" ? "new-password" : void 0,
          min: e.field.min,
          max: e.field.max,
          disabled: e.field.disabled || e.processing
        }, pe.value, {
          class: J,
          onInput: se[22] || (se[22] = (N) => i("change", N.target.value))
        }), null, 16, Qd)),
        e.field.type === "number" && e.field.presets?.length ? (t(), n("div", ou, [
          (t(!0), n(P, null, O(e.field.presets, (N) => (t(), n("button", {
            key: N,
            type: "button",
            disabled: e.field.disabled || e.processing,
            class: z([
              "rounded-md border px-2.5 py-1 text-xs transition-colors disabled:opacity-50",
              y(Se),
              // eslint-disable-next-line eqeqeq
              e.value != null && e.value == N ? "border-primary bg-primary/10 text-primary font-medium" : "border-input hover:bg-muted"
            ]),
            "aria-pressed": (
              // eslint-disable-next-line eqeqeq
              e.value != null && e.value == N
            ),
            onClick: (le) => i("change", String(N))
          }, f(N), 11, su))), 128))
        ])) : b("", !0),
        e.field.type === "textarea" && e.field.chips && Object.keys(e.field.chips).length ? (t(), n("div", ru, [
          (t(!0), n(P, null, O(e.field.chips, (N, le) => (t(), n("button", {
            key: le,
            type: "button",
            title: N,
            disabled: e.field.disabled || e.processing,
            class: "border-input hover:bg-muted rounded-md border px-2 py-1 font-mono text-xs transition-colors disabled:opacity-50",
            onClick: (ne) => Xe(String(le))
          }, f(le), 9, iu))), 128))
        ])) : b("", !0),
        G.value ? (t(), n("a", {
          key: 19,
          href: G.value,
          class: "text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
        }, " Browse ", 8, du)) : b("", !0),
        e.error ? (t(), n("p", {
          key: 20,
          id: te.value,
          class: "text-destructive text-xs leading-snug",
          role: "alert"
        }, f(e.error), 9, uu)) : b("", !0),
        e.field.help && e.field.type !== "toggle" ? (t(), n("p", {
          key: 21,
          id: he.value,
          class: z(y(St))
        }, f(e.field.help), 11, cu)) : b("", !0)
      ])),
      e.field.createOption && y(w) ? (t(), T(gi, {
        key: 2,
        open: m.value,
        title: j.value,
        description: e.field.help ?? void 0,
        fields: e.field.createOption,
        processing: g.value,
        errors: S.value,
        "general-error": I.value,
        onClose: Q,
        onSubmit: Y
      }, null, 8, ["open", "title", "description", "fields", "processing", "errors", "general-error"])) : b("", !0)
    ], 64));
  }
}), fu = { class: "flex min-w-0 items-start gap-2.5" }, mu = {
  key: 0,
  class: "bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
  "aria-hidden": "true"
}, pu = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "size-3.5"
}, vu = ["d"], gu = { class: "min-w-0" }, hu = { class: "text-sm font-semibold" }, bu = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, yu = {
  key: 2,
  class: "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10"
}, xu = { class: "border-b px-4 py-3.5 sm:px-5" }, ku = { class: "text-sm font-semibold" }, $u = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, wu = {
  key: 4,
  class: "min-w-0 space-y-4"
}, Cu = {
  key: 7,
  class: "flex flex-col gap-3"
}, Mu = { class: "text-sm font-medium" }, Su = {
  key: 0,
  class: "text-muted-foreground -mt-2 text-sm"
}, Bu = {
  key: 0,
  class: "mb-1 font-medium"
}, Au = ["aria-selected", "onClick"], zu = {
  key: 1,
  class: "bg-destructive size-1.5 rounded-full",
  "aria-label": "has errors"
}, Pu = { class: "flex items-center justify-between gap-3 border-t p-4" }, _u = ["disabled"], Vu = /* @__PURE__ */ V({
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
      const S = new URLSearchParams(window.location.search).get(g), I = S === null ? NaN : Number.parseInt(S, 10), j = a.node.children?.length ?? 0;
      return Number.isInteger(I) && I >= 0 && I < j ? I : 0;
    }
    const d = K(a.node.component === "tabs" ? i() : 0), u = K(a.node.component === "wizard" ? i() : 0);
    function c(g, S) {
      if (!g || typeof window > "u")
        return;
      const I = new URL(window.location.href);
      I.searchParams.set(g, String(S)), window.history.replaceState(window.history.state, "", I);
    }
    ge(d, (g) => c(a.node.persistInQueryString, g)), ge(u, (g) => c(a.node.persistInQueryString, g));
    const v = h(
      () => (a.node.children ?? []).map((g) => ({
        label: g.label ?? "",
        description: g.description
      }))
    ), p = h(() => a.depth === 0), x = h(() => {
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
    }), M = h(() => {
      const g = {
        info: "border-border bg-muted/50 text-foreground",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
        warning: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
        danger: "border-destructive/30 bg-destructive/10 text-destructive"
      };
      return g[a.node.tone ?? "info"] ?? g.info;
    }), $ = h(() => {
      const g = a.node.columns, S = typeof g == "number" ? g : g?.default ?? g?.sm ?? g?.md ?? 1;
      return S >= 3 ? "sm:grid-cols-3" : S === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
    });
    function C(g) {
      const S = g.children?.length ?? 1;
      return S >= 3 ? "md:grid-cols-3" : S === 2 ? "md:grid-cols-2" : "md:grid-cols-1";
    }
    function k(g) {
      const S = g.columns, I = typeof S == "number" ? { default: S } : S, j = {};
      for (const X of ["default", "sm", "md", "lg", "xl", "2xl"]) {
        const W = I?.[X];
        typeof W == "number" && W > 0 && (j[`--pk-grid-cols-${X}`] = String(Math.min(12, Math.max(1, W))));
      }
      return j;
    }
    function B(g = 1) {
      return g >= 4 ? "md:col-span-4" : g === 3 ? "md:col-span-3" : g === 2 ? "md:col-span-2" : "md:col-span-1";
    }
    function A(g) {
      const S = [], I = (j) => {
        j.component === "field" && j.key && S.push(j.key), j.children?.forEach(I);
      };
      return I(g), S.some((j) => a.errors[j]);
    }
    function w(g) {
      if (g.hidden)
        return !1;
      const S = g.visibleWhen;
      return S ? a.values[S.field] == S.value : !0;
    }
    function m(g) {
      if (a.upload)
        return (S, I) => a.upload(g, S, I);
    }
    return (g, S) => {
      const I = na("SchemaNode", !0);
      return e.node.component === "field" && w(e.node) ? (t(), T(Qe, {
        key: 0,
        field: e.node,
        value: e.values[e.node.key],
        values: e.values,
        error: e.errors[e.node.key],
        errors: e.errors,
        options: e.options[e.node.key],
        "child-options": e.options,
        processing: e.processing,
        "search-options": e.node.searchable && e.searchOptions ? (j) => e.searchOptions(e.node.key, j) : void 0,
        upload: m(e.node.key),
        discard: e.discard,
        onChange: S[0] || (S[0] = (j) => r("change", e.node.key, j)),
        onAffixAction: S[1] || (S[1] = (j) => r("affix-action", e.node.key, j))
      }, null, 8, ["field", "value", "values", "error", "errors", "options", "child-options", "processing", "search-options", "upload", "discard"])) : e.node.component === "section" && w(e.node) ? (t(), n("section", {
        key: 1,
        class: z(
          p.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("header", {
          class: z(["flex items-start justify-between gap-3", [
            p.value ? "px-4 py-3.5 sm:px-5" : "pb-2",
            e.node.collapsible ? "cursor-pointer select-none" : ""
          ]]),
          onClick: S[2] || (S[2] = (j) => e.node.collapsible && (s.value = !s.value))
        }, [
          l("div", fu, [
            e.node.icon ? (t(), n("div", mu, [
              (t(), n("svg", pu, [
                l("path", {
                  d: y(me)(e.node.icon)
                }, null, 8, vu)
              ]))
            ])) : b("", !0),
            l("div", gu, [
              l("h3", hu, f(e.node.label), 1),
              e.node.description ? (t(), n("p", bu, f(e.node.description), 1)) : b("", !0)
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
          class: z(["grid grid-cols-1 gap-4", [$.value, p.value ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""]])
        }, [
          (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => (t(), n("div", {
            key: X,
            class: z(j.span && j.span >= 2 ? "sm:col-span-2" : "")
          }, [
            F(I, {
              node: j,
              values: e.values,
              errors: e.errors,
              options: e.options,
              processing: e.processing,
              "search-options": e.searchOptions,
              upload: e.upload,
              discard: e.discard,
              depth: e.depth + 1,
              onChange: S[3] || (S[3] = (W, Q) => r("change", W, Q)),
              onAffixAction: S[4] || (S[4] = (W, Q) => r("affix-action", W, Q))
            }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"])
          ], 2))), 128))
        ], 2)) : b("", !0)
      ], 2)) : e.node.component === "card" && w(e.node) ? (t(), n("section", yu, [
        l("header", xu, [
          l("h3", ku, f(e.node.title), 1),
          e.node.description ? (t(), n("p", $u, f(e.node.description), 1)) : b("", !0)
        ]),
        l("div", {
          class: z(["grid grid-cols-1 gap-4 px-4 py-4", $.value])
        }, [
          (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => (t(), T(I, {
            key: X,
            node: j,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: S[5] || (S[5] = (W, Q) => r("change", W, Q)),
            onAffixAction: S[6] || (S[6] = (W, Q) => r("affix-action", W, Q))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)
      ])) : e.node.component === "columns" && w(e.node) ? (t(), n("div", {
        key: 3,
        class: z(["grid grid-cols-1 gap-4", C(e.node)])
      }, [
        (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => (t(), n("div", {
          key: X,
          class: z(j.component === "column" ? B(j.span) : "")
        }, [
          F(I, {
            node: j,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: S[7] || (S[7] = (W, Q) => r("change", W, Q)),
            onAffixAction: S[8] || (S[8] = (W, Q) => r("affix-action", W, Q))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"])
        ], 2))), 128))
      ], 2)) : e.node.component === "column" && w(e.node) ? (t(), n("div", wu, [
        (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => (t(), T(I, {
          key: X,
          node: j,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: S[9] || (S[9] = (W, Q) => r("change", W, Q)),
          onAffixAction: S[10] || (S[10] = (W, Q) => r("affix-action", W, Q))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ])) : e.node.component === "grid" && w(e.node) ? (t(), n("div", {
        key: 5,
        class: "pk-responsive-grid grid gap-4",
        style: ie(k(e.node))
      }, [
        (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => (t(), T(I, {
          key: X,
          node: j,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: S[11] || (S[11] = (W, Q) => r("change", W, Q)),
          onAffixAction: S[12] || (S[12] = (W, Q) => r("affix-action", W, Q))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ], 4)) : e.node.component === "flex" && w(e.node) ? (t(), n("div", {
        key: 6,
        class: z(["flex", x.value])
      }, [
        (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => (t(), T(I, {
          key: X,
          node: j,
          values: e.values,
          errors: e.errors,
          options: e.options,
          processing: e.processing,
          "search-options": e.searchOptions,
          upload: e.upload,
          discard: e.discard,
          depth: e.depth + 1,
          onChange: S[13] || (S[13] = (W, Q) => r("change", W, Q)),
          onAffixAction: S[14] || (S[14] = (W, Q) => r("affix-action", W, Q))
        }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
      ], 2)) : e.node.component === "fieldset" && w(e.node) ? (t(), n("fieldset", Cu, [
        l("legend", Mu, f(e.node.label), 1),
        e.node.description ? (t(), n("p", Su, f(e.node.description), 1)) : b("", !0),
        l("div", {
          class: z(["grid grid-cols-1 gap-4", $.value])
        }, [
          (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => (t(), T(I, {
            key: X,
            node: j,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: S[15] || (S[15] = (W, Q) => r("change", W, Q)),
            onAffixAction: S[16] || (S[16] = (W, Q) => r("affix-action", W, Q))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)
      ])) : e.node.component === "callout" && w(e.node) ? (t(), n("div", {
        key: 8,
        role: "note",
        class: z(["rounded-lg border px-4 py-3 text-sm", M.value])
      }, [
        e.node.title ? (t(), n("p", Bu, f(e.node.title), 1)) : b("", !0),
        l("p", null, f(e.node.body), 1)
      ], 2)) : e.node.component === "tabs" && w(e.node) ? (t(), n("div", {
        key: 9,
        class: z(
          p.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        l("div", {
          class: z(["bg-muted/30 flex gap-1 overflow-x-auto p-1", p.value ? "rounded-t-lg border-b" : "rounded-md"]),
          role: "tablist",
          "aria-label": "Form sections"
        }, [
          (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => (t(), n("button", {
            key: X,
            type: "button",
            role: "tab",
            class: z([
              "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              d.value === X ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
            ]),
            "aria-selected": d.value === X,
            onClick: (W) => d.value = X
          }, [
            q(f(j.label) + " ", 1),
            j.badge !== null && j.badge !== void 0 ? (t(), T(Ne, {
              key: 0,
              variant: "secondary"
            }, {
              default: L(() => [
                q(f(j.badge), 1)
              ]),
              _: 2
            }, 1024)) : b("", !0),
            A(j) ? (t(), n("span", zu)) : b("", !0)
          ], 10, Au))), 128))
        ], 2),
        (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => xe((t(), n("div", {
          key: X,
          class: z(["flex flex-col gap-5", p.value ? "p-4" : "pt-4"])
        }, [
          (t(!0), n(P, null, O(j.children ?? [], (W, Q) => (t(), T(I, {
            key: Q,
            node: W,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: S[17] || (S[17] = (Y, G) => r("change", Y, G)),
            onAffixAction: S[18] || (S[18] = (Y, G) => r("affix-action", Y, G))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)), [
          [Ye, d.value === X]
        ])), 128))
      ], 2)) : e.node.component === "wizard" && w(e.node) ? (t(), n("div", {
        key: 10,
        class: z(
          p.value ? "bg-card rounded-xl border shadow-sm ring-1 ring-black/5 dark:ring-white/10" : ""
        )
      }, [
        F(oi, {
          class: z(["p-4", p.value ? "border-b" : ""]),
          steps: v.value,
          "active-step": u.value,
          "has-error": (j) => A((e.node.children ?? [])[j]),
          "onUpdate:activeStep": S[19] || (S[19] = (j) => u.value = j)
        }, null, 8, ["class", "steps", "active-step", "has-error"]),
        (t(!0), n(P, null, O(e.node.children ?? [], (j, X) => xe((t(), n("div", {
          key: X,
          class: z(["flex flex-col gap-5", p.value ? "p-4" : "pt-4"])
        }, [
          (t(!0), n(P, null, O(j.children ?? [], (W, Q) => (t(), T(I, {
            key: Q,
            node: W,
            values: e.values,
            errors: e.errors,
            options: e.options,
            processing: e.processing,
            "search-options": e.searchOptions,
            upload: e.upload,
            discard: e.discard,
            depth: e.depth + 1,
            onChange: S[20] || (S[20] = (Y, G) => r("change", Y, G)),
            onAffixAction: S[21] || (S[21] = (Y, G) => r("affix-action", Y, G))
          }, null, 8, ["node", "values", "errors", "options", "processing", "search-options", "upload", "discard", "depth"]))), 128))
        ], 2)), [
          [Ye, u.value === X]
        ])), 128)),
        l("div", Pu, [
          l("button", {
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-sm transition-colors disabled:pointer-events-none disabled:opacity-40",
            disabled: u.value === 0,
            onClick: S[22] || (S[22] = (j) => u.value--)
          }, " Back ", 8, _u),
          u.value < (e.node.children ?? []).length - 1 ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm transition-opacity hover:opacity-90",
            onClick: S[23] || (S[23] = (j) => u.value++)
          }, " Next ")) : b("", !0)
        ])
      ], 2)) : b("", !0);
    };
  }
}), Ya = /* @__PURE__ */ it(Vu, [["__scopeId", "data-v-f2c53774"]]), iC = /* @__PURE__ */ V({
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
    ge(
      () => a.open,
      (d) => {
        d && (s.value = {});
      }
    );
    function i() {
      r("submit", { ...s.value });
    }
    return (d, u) => (t(), T(bt, {
      open: e.open,
      title: e.title,
      size: "form",
      busy: e.processing,
      onClose: u[2] || (u[2] = (c) => r("close"))
    }, {
      footer: L(() => [
        F(ue, {
          variant: "ghost",
          size: "sm",
          disabled: e.processing,
          onClick: u[1] || (u[1] = (c) => r("close"))
        }, {
          default: L(() => [...u[3] || (u[3] = [
            q(" Cancel ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        F(ue, {
          size: "sm",
          disabled: e.processing,
          onClick: i
        }, {
          default: L(() => [
            q(f(e.processing ? "Saving…" : e.title), 1)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: L(() => [
        l("form", {
          class: "flex flex-col gap-4",
          onSubmit: be(i, ["prevent"])
        }, [
          (t(!0), n(P, null, O(e.form?.nodes ?? [], (c, v) => (t(), T(Ya, {
            key: v,
            node: c,
            values: s.value,
            errors: e.errors,
            processing: e.processing,
            options: e.formOptions,
            "search-options": e.searchOptions,
            onChange: u[0] || (u[0] = (p, x) => s.value[p] = x)
          }, null, 8, ["node", "values", "errors", "processing", "options", "search-options"]))), 128))
        ], 32)
      ]),
      _: 1
    }, 8, ["open", "title", "busy"]));
  }
}), Lu = ["title"], Ou = ["aria-label"], ju = ["d"], Du = { class: "sr-only" }, Tu = /* @__PURE__ */ V({
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
    }, s = h(() => o.value === null || o.value === void 0 || o.value === !1 || o.value === 0 || o.value === "0" ? "" : o.value === !0 || o.value === 1 || o.value === "1" ? "1" : String(o.value)), i = h(() => o.icons[s.value] ?? o.defaultIcon), d = h(() => a[i.value] ?? a.dot), u = h(() => r[o.colors[s.value] ?? "neutral"] ?? r.neutral), c = h(() => o.labels[s.value] ?? String(o.value ?? "-"));
    return (v, p) => (t(), n("span", {
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
        l("path", { d: d.value }, null, 8, ju)
      ], 10, Ou)),
      l("span", Du, f(c.value), 1)
    ], 8, Lu));
  }
}), Iu = ["aria-label"], Eu = ["fill"], dC = /* @__PURE__ */ V({
  __name: "RatingCell",
  props: {
    value: {},
    max: { default: 5 }
  },
  setup(e) {
    const o = e, a = h(() => Math.max(1, Math.min(10, Number(o.max ?? 5)))), r = h(() => {
      const s = Number(o.value);
      return Number.isFinite(s) ? Math.max(0, Math.min(a.value, s)) : 0;
    });
    return (s, i) => (t(), n("span", {
      class: "inline-flex items-center gap-0.5 text-amber-500",
      "aria-label": `${r.value} of ${a.value}`,
      "data-test": "rating-cell"
    }, [
      (t(!0), n(P, null, O(a.value, (d) => (t(), n("svg", {
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
        }, null, 8, Eu)
      ]))), 128))
    ], 8, Iu));
  }
}), Fu = ["src"], Nu = {
  key: 2,
  viewBox: "0 0 24 24",
  class: "size-1/2",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Ru = /* @__PURE__ */ V({
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
    ge(
      () => o.src,
      () => a.value = !1
    );
    const r = { sm: "size-6", md: "size-8", lg: "size-10" }, s = h(() => {
      const d = typeof o.src == "string" ? o.src.trim() : "";
      return d === "" ? null : /^(https?:)?\/\//i.test(d) ? d : null;
    }), i = h(() => {
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
      }, null, 40, Fu)) : e.fallback === "initials" ? (t(), n(P, { key: 1 }, [
        q(f(i.value), 1)
      ], 64)) : e.fallback === "icon" ? (t(), n("svg", Nu, [...u[1] || (u[1] = [
        l("path", { d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" }, null, -1)
      ])])) : b("", !0)
    ], 2));
  }
}), Hu = {
  key: 0,
  class: "text-muted-foreground"
}, Uu = {
  key: 1,
  class: "inline-flex items-center gap-2"
}, Ku = {
  key: 0,
  class: "font-mono text-xs"
}, qu = {
  key: 1,
  class: "sr-only"
}, Gu = /* @__PURE__ */ V({
  __name: "ColourCell",
  props: {
    value: { default: null },
    showValue: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$|^[a-z]{3,20}$/i, r = h(() => {
      const s = (o.value ?? "").trim();
      return a.test(s) ? s : null;
    });
    return (s, i) => r.value === null ? (t(), n("span", Hu, "-")) : (t(), n("span", Uu, [
      l("span", {
        class: "size-4 shrink-0 rounded border",
        style: ie({ backgroundColor: r.value }),
        "aria-hidden": "true"
      }, null, 4),
      e.showValue ? (t(), n("span", Ku, f(r.value), 1)) : (t(), n("span", qu, f(r.value), 1))
    ]));
  }
}), Wu = { class: "inline-flex items-center" }, Zu = ["checked", "aria-label"], Yu = { class: "sr-only" }, uC = /* @__PURE__ */ V({
  __name: "CheckboxCell",
  props: {
    value: {},
    trueLabel: { default: null },
    falseLabel: { default: null }
  },
  setup(e) {
    const o = e, a = h(() => {
      const s = o.value;
      return typeof s == "string" ? s !== "" && s !== "0" && s.toLowerCase() !== "false" : !!s;
    }), r = h(
      () => a.value ? o.trueLabel ?? "Yes" : o.falseLabel ?? "No"
    );
    return (s, i) => (t(), n("span", Wu, [
      l("input", {
        type: "checkbox",
        checked: a.value,
        disabled: "",
        "aria-readonly": "true",
        "aria-label": r.value,
        class: "border-input text-primary size-4 rounded disabled:opacity-100"
      }, null, 8, Zu),
      l("span", Yu, f(r.value), 1)
    ]));
  }
}), Ju = {
  key: 0,
  class: "text-muted-foreground"
}, Qu = {
  key: 1,
  class: "block max-w-[28rem] truncate font-mono text-xs"
}, cC = /* @__PURE__ */ V({
  __name: "CodeCell",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, a = h(
      () => String(o.value ?? "").replace(/\s+/g, " ").trim()
    );
    return (r, s) => a.value ? (t(), n("code", Qu, f(a.value), 1)) : (t(), n("span", Ju, "—"));
  }
}), Xu = {
  key: 0,
  class: "font-mono text-xs"
}, ec = {
  key: 1,
  class: "text-muted-foreground"
}, tc = {
  key: 2,
  class: "text-muted-foreground text-sm font-normal"
}, fC = /* @__PURE__ */ V({
  __name: "KeyValueCell",
  props: {
    value: {}
  },
  setup(e) {
    const o = e, a = h(
      () => o.value && typeof o.value == "object" && !Array.isArray(o.value) ? Object.keys(o.value) : null
    );
    return (r, s) => a.value === null && e.value != null ? (t(), n("span", Xu, f(e.value), 1)) : !a.value || a.value.length === 0 ? (t(), n("span", ec, "—")) : (t(), n("span", tc, f(a.value.length) + " " + f(a.value.length === 1 ? "entry" : "entries"), 1));
  }
}), ac = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, nc = {
  key: 1,
  class: "inline-flex flex-wrap items-center gap-1"
}, mC = /* @__PURE__ */ V({
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
    const r = h(() => a(o.value, o.separator)), s = h(() => o.limit === null || o.limit === void 0 || o.limit < 1 ? r.value : r.value.slice(0, o.limit)), i = h(() => Math.max(0, r.value.length - s.value.length));
    return (d, u) => r.value.length === 0 ? (t(), n("span", ac, "-")) : (t(), n("span", nc, [
      (t(!0), n(P, null, O(s.value, (c) => (t(), T(Ne, {
        key: c,
        variant: "secondary"
      }, {
        default: L(() => [
          q(f(c), 1)
        ]),
        _: 2
      }, 1024))), 128)),
      i.value > 0 ? (t(), T(Ne, {
        key: 0,
        variant: "outline"
      }, {
        default: L(() => [
          q("+" + f(i.value), 1)
        ]),
        _: 1
      })) : b("", !0)
    ]));
  }
}), lc = ["aria-checked", "aria-label", "title", "disabled"], oc = ["value", "placeholder", "disabled"], sc = ["value", "disabled"], rc = ["value"], pC = /* @__PURE__ */ V({
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
    const a = e, r = o, s = h(() => a.value === !0 || a.value === 1 || a.value === "1"), i = h(() => a.busy || a.disabled), d = h(
      () => s.value ? a.onLabel ?? "Enabled" : a.offLabel ?? "Disabled"
    );
    function u() {
      i.value || r("change", !s.value);
    }
    function c(M) {
      const $ = M.target.value;
      $ !== String(a.value ?? "") && r("change", $);
    }
    function v(M) {
      const C = M.target.value;
      C !== String(a.value ?? "") && r("change", C);
    }
    function p(M) {
      M.target.blur();
    }
    function x(M) {
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
      onClick: be(u, ["stop"])
    }, [
      l("span", {
        class: z(["bg-background size-4 rounded-full shadow-sm transition-transform", s.value ? "translate-x-4.5" : "translate-x-0.5"])
      }, null, 2)
    ], 10, lc)) : e.type === "text" ? (t(), n("input", {
      key: 1,
      type: "text",
      class: "bg-background hover:bg-accent focus:ring-ring w-full min-w-28 rounded-md border px-2 py-1 text-xs transition-colors focus:ring-2 focus:outline-none disabled:opacity-50",
      value: String(e.value ?? ""),
      placeholder: e.placeholder ?? void 0,
      disabled: i.value,
      onClick: $[0] || ($[0] = be(() => {
      }, ["stop"])),
      onBlur: v,
      onKeydown: [
        zt(p, ["enter"]),
        zt(x, ["esc"])
      ]
    }, null, 40, oc)) : (t(), n("select", {
      key: 2,
      class: "bg-background hover:bg-accent focus:ring-ring w-full min-w-28 rounded-md border px-2 py-1 text-xs transition-colors focus:ring-2 focus:outline-none disabled:opacity-50",
      value: String(e.value ?? ""),
      disabled: i.value,
      onClick: $[1] || ($[1] = be(() => {
      }, ["stop"])),
      onChange: c
    }, [
      (t(!0), n(P, null, O(e.options, (C, k) => (t(), n("option", {
        key: k,
        value: k
      }, f(C), 9, rc))), 128))
    ], 40, sc));
  }
}), ma = {
  success: "success",
  danger: "destructive",
  warning: "warning",
  info: "info",
  neutral: "outline"
};
function ic(e) {
  return e != null && e !== "";
}
function dc(e) {
  const o = [];
  return e.type === "toggle" || e.type === "select" || e.type === "image" ? (e.align === "right" && o.push("text-right"), e.align === "center" && o.push("text-center"), o.join(" ")) : (e.key === "name" && o.push("font-medium"), e.mono && o.push("font-mono text-xs"), e.muted && o.push("text-muted-foreground"), e.transform === "upper" && o.push("uppercase"), e.transform === "lower" && o.push("lowercase"), e.align === "right" && o.push("text-right"), e.align === "center" && o.push("text-center"), o.join(" "));
}
function vC(e) {
  const o = h(
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
      cellClass: dc(s),
      group: s.group
    }))
  ), a = h(() => Object.fromEntries(e.value.map((s) => [s.key, s])));
  function r(s, i) {
    const d = a.value[s];
    if (!d)
      return "outline";
    const u = typeof i == "boolean" ? i ? "1" : "" : String(i), c = d.colors?.[u] ?? d.defaultColor ?? "neutral";
    return ma[c] ?? "outline";
  }
  return { columns: o, byKey: a, badgeVariant: r };
}
const uc = ["disabled", "aria-label", "aria-busy"], cc = {
  class: "text-muted-foreground size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, fc = ["d"], mc = { class: "text-muted-foreground px-2 py-1.5 text-xs font-medium" }, pc = ["disabled", "onClick"], vc = {
  key: 0,
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-label": "Current"
}, gc = ["d"], hc = {
  key: 1,
  class: "size-4 shrink-0",
  "aria-hidden": "true"
}, gC = /* @__PURE__ */ V({
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
    const a = e, r = o, s = h(() => a.busy || a.disabled), i = h(() => String(a.value ?? "")), d = h(() => `Select ${(a.label || "value").trim().toLowerCase()}`);
    function u(x) {
      return typeof x == "boolean" ? x ? "1" : "" : String(x ?? "");
    }
    function c(x) {
      const M = a.colors[u(x)] ?? a.defaultColor ?? "neutral";
      return ma[M] ?? "outline";
    }
    function v(x) {
      return a.options[x] ?? x;
    }
    function p(x, M) {
      if (s.value || x === i.value) {
        M();
        return;
      }
      r("change", x), M();
    }
    return (x, M) => (t(), n("div", {
      onClick: M[0] || (M[0] = be(() => {
      }, ["stop"]))
    }, [
      e.disabled ? (t(), T(Ne, {
        key: 1,
        variant: c(e.value),
        soft: e.soft,
        class: "capitalize"
      }, {
        default: L(() => [
          q(f(v(i.value) || "-"), 1)
        ]),
        _: 1
      }, 8, ["variant", "soft"])) : (t(), T(Ze, {
        key: 0,
        align: "start"
      }, {
        trigger: L(() => [
          l("button", {
            type: "button",
            class: "inline-flex items-center gap-0.5 rounded-full disabled:opacity-50",
            disabled: s.value,
            "aria-label": d.value,
            "aria-busy": e.busy
          }, [
            F(Ne, {
              variant: c(e.value),
              soft: e.soft,
              class: "capitalize"
            }, {
              default: L(() => [
                q(f(v(i.value) || "-"), 1)
              ]),
              _: 1
            }, 8, ["variant", "soft"]),
            (t(), n("svg", cc, [
              l("path", {
                d: y(me)("chevron-down")
              }, null, 8, fc)
            ]))
          ], 8, uc)
        ]),
        panel: L(({ close: $ }) => [
          l("div", mc, f(d.value), 1),
          (t(!0), n(P, null, O(e.options, (C, k) => (t(), n("button", {
            key: k,
            type: "button",
            role: "menuitem",
            class: "hover:bg-accent flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-left disabled:opacity-50",
            disabled: s.value,
            onClick: (B) => p(String(k), $)
          }, [
            F(Ne, {
              variant: c(k),
              soft: e.soft,
              class: "capitalize"
            }, {
              default: L(() => [
                q(f(C), 1)
              ]),
              _: 2
            }, 1032, ["variant", "soft"]),
            String(k) === i.value ? (t(), n("svg", vc, [
              l("path", {
                d: y(me)("check")
              }, null, 8, gc)
            ])) : (t(), n("span", hc))
          ], 8, pc))), 128))
        ]),
        _: 1
      }))
    ]));
  }
}), Ca = {
  primary: "text-primary",
  gray: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-500",
  danger: "text-destructive",
  info: "text-sky-600 dark:text-sky-400"
};
function bc(e) {
  return Ca[e ?? "gray"] ?? Ca.gray;
}
const yc = { class: "flex items-center justify-end" }, xc = ["aria-label"], kc = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, $c = ["d"], wc = ["href"], Cc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Mc = ["d"], Sc = { class: "min-w-0 flex-1 truncate" }, Bc = ["disabled", "onClick"], Ac = ["d"], zc = { class: "min-w-0 flex-1 truncate" }, Pc = {
  key: 0,
  class: "mt-0.5 border-t pt-0.5"
}, _c = ["disabled", "onClick"], Vc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Lc = ["d"], Oc = { class: "min-w-0 flex-1 truncate" }, jc = /* @__PURE__ */ V({
  __name: "RecordActions",
  props: {
    groups: {},
    title: {},
    busy: { default: null }
  },
  emits: ["run"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = K(null), d = K(null), u = h(() => r.groups.flatMap((A) => A.actions)), c = h(() => u.value.filter((A) => !A.destructive)), v = h(() => u.value.filter((A) => A.destructive));
    function p(A) {
      return bc(A.color);
    }
    const x = h(() => u.value.length === 0);
    function M(A) {
      s("run", A);
    }
    function $(A) {
      if (r.busy !== A.key) {
        if (A.link) {
          A.url && window.location.assign(A.url);
          return;
        }
        M(A);
      }
    }
    function C(A, w) {
      const m = w.toLowerCase().split("+").map((I) => I.trim()), g = m.at(-1);
      return !g || A.key.toLowerCase() !== g ? !1 : (A.ctrlKey || A.metaKey) === m.includes("mod") && A.shiftKey === m.includes("shift") && A.altKey === m.includes("alt");
    }
    function k(A) {
      x.value || (A.preventDefault(), i.value?.openAt(A.clientX, A.clientY));
    }
    function B(A) {
      const w = u.value.find(
        (j) => (j.keyBindings ?? []).some((X) => C(A, X))
      );
      if (w) {
        A.preventDefault(), $(w);
        return;
      }
      if (A.key !== "ArrowDown" && A.key !== "ArrowUp")
        return;
      const m = Array.from(
        d.value?.querySelectorAll("[data-menu-item]") ?? []
      );
      if (m.length === 0)
        return;
      A.preventDefault();
      const g = m.indexOf(document.activeElement), S = A.key === "ArrowDown" ? 1 : -1, I = (g + S + m.length) % m.length;
      m[I]?.focus();
    }
    return o({ openContextMenu: k }), (A, w) => (t(), n("div", yc, [
      x.value ? b("", !0) : (t(), T(Ze, {
        key: 0,
        ref_key: "menu",
        ref: i,
        placement: "left"
      }, {
        trigger: L(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring inline-flex size-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none",
            "aria-label": `Actions for ${e.title}`,
            "aria-haspopup": "menu"
          }, [
            (t(), n("svg", kc, [
              l("path", {
                d: y(me)("more-vertical")
              }, null, 8, $c)
            ]))
          ], 8, xc)
        ]),
        panel: L(() => [
          l("div", {
            ref_key: "items",
            ref: d,
            class: "py-0.5",
            onKeydown: B
          }, [
            (t(!0), n(P, null, O(c.value, (m) => (t(), n(P, {
              key: m.key
            }, [
              m.link ? (t(), n("a", {
                key: 0,
                href: m.url ?? "#",
                "data-menu-item": "",
                role: "menuitem",
                class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none", p(m)])
              }, [
                (t(), n("svg", Cc, [
                  l("path", {
                    d: y(Fe)(m)
                  }, null, 8, Mc)
                ])),
                l("span", Sc, f(m.label), 1)
              ], 10, wc)) : (t(), n("button", {
                key: 1,
                type: "button",
                "data-menu-item": "",
                role: "menuitem",
                class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50", p(m)]),
                disabled: e.busy === m.key,
                onClick: (g) => M(m)
              }, [
                (t(), n("svg", {
                  class: z(["size-4 shrink-0", e.busy === m.key && "animate-pulse"]),
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "aria-hidden": "true"
                }, [
                  l("path", {
                    d: y(Fe)(m)
                  }, null, 8, Ac)
                ], 2)),
                l("span", zc, f(m.label), 1)
              ], 10, Bc))
            ], 64))), 128)),
            v.value.length ? (t(), n("div", Pc, [
              (t(!0), n(P, null, O(v.value, (m) => (t(), n("button", {
                key: m.key,
                type: "button",
                "data-menu-item": "",
                role: "menuitem",
                class: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                disabled: e.busy === m.key,
                onClick: (g) => M(m)
              }, [
                (t(), n("svg", Vc, [
                  l("path", {
                    d: y(Fe)({ ...m, destructive: !0 })
                  }, null, 8, Lc)
                ])),
                l("span", Oc, f(m.label), 1)
              ], 8, _c))), 128))
            ])) : b("", !0)
          ], 544)
        ]),
        _: 1
      }, 512))
    ]));
  }
}), Dc = { class: "flex items-center justify-end gap-1" }, Tc = { class: "hidden items-center gap-1 sm:flex" }, Ic = ["href"], Ec = {
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Fc = ["d"], Nc = ["disabled", "onClick"], Rc = ["d"], Hc = {
  type: "button",
  class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors",
  "aria-haspopup": "menu"
}, Uc = {
  key: 0,
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Kc = ["d"], qc = { class: "py-0.5" }, Gc = ["href"], Wc = {
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Zc = ["d"], Yc = { class: "min-w-0 flex-1 truncate" }, Jc = ["disabled", "onClick"], Qc = ["d"], Xc = { class: "min-w-0 flex-1 truncate" }, hC = /* @__PURE__ */ V({
  __name: "InlineRecordActions",
  props: {
    groups: {},
    title: {},
    busy: { default: null }
  },
  emits: ["run"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = K(null), d = h(() => r.groups.filter((A) => !A.label)), u = h(() => r.groups.filter((A) => A.label)), c = h(() => d.value.flatMap((A) => A.actions)), v = h(() => c.value.filter((A) => !A.destructive)), p = h(() => c.value.filter((A) => A.destructive)), x = h(() => r.groups.every((A) => A.actions.length === 0)), M = {
      primary: "text-primary",
      gray: "text-muted-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-600 dark:text-amber-500",
      danger: "text-destructive",
      info: "text-sky-600 dark:text-sky-400"
    };
    function $(A) {
      return M[A.color ?? "gray"] ?? M.gray;
    }
    function C(A) {
      s("run", A);
    }
    function k(A) {
      r.busy !== A.key && C(A);
    }
    function B(A) {
      x.value || i.value?.openContextMenu(A);
    }
    return o({ openContextMenu: B }), (A, w) => (t(), n("div", Dc, [
      l("div", Tc, [
        (t(!0), n(P, null, O([...v.value, ...p.value], (m) => (t(), n(P, {
          key: m.key
        }, [
          m.link ? (t(), n("a", {
            key: 0,
            href: m.url ?? "#",
            class: z(["hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors", $(m)])
          }, [
            (t(), n("svg", Ec, [
              l("path", {
                d: y(Fe)(m)
              }, null, 8, Fc)
            ])),
            l("span", null, f(m.label), 1)
          ], 10, Ic)) : (t(), n("button", {
            key: 1,
            type: "button",
            class: z(["hover:bg-accent inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors disabled:pointer-events-none disabled:opacity-50", $(m)]),
            disabled: e.busy === m.key,
            onClick: (g) => k(m)
          }, [
            (t(), n("svg", {
              class: z(["size-3.5 shrink-0", e.busy === m.key && "animate-pulse"]),
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              "aria-hidden": "true"
            }, [
              l("path", {
                d: y(Fe)(m)
              }, null, 8, Rc)
            ], 2)),
            l("span", null, f(m.label), 1)
          ], 10, Nc))
        ], 64))), 128)),
        (t(!0), n(P, null, O(u.value, (m) => (t(), T(Ze, {
          key: m.label,
          align: "end",
          placement: "left"
        }, {
          trigger: L(() => [
            l("button", Hc, [
              m.icon ? (t(), n("svg", Uc, [
                l("path", {
                  d: y(me)(m.icon)
                }, null, 8, Kc)
              ])) : b("", !0),
              l("span", null, f(m.label), 1)
            ])
          ]),
          panel: L(() => [
            l("div", qc, [
              (t(!0), n(P, null, O([
                ...m.actions.filter((g) => !g.destructive),
                ...m.actions.filter((g) => g.destructive)
              ], (g) => (t(), n(P, {
                key: g.key
              }, [
                g.link ? (t(), n("a", {
                  key: 0,
                  href: g.url ?? "#",
                  role: "menuitem",
                  class: z(["hover:bg-accent focus:bg-accent flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm focus:outline-none", g.destructive ? "text-destructive" : $(g)])
                }, [
                  (t(), n("svg", Wc, [
                    l("path", {
                      d: y(Fe)(g)
                    }, null, 8, Zc)
                  ])),
                  l("span", Yc, f(g.label), 1)
                ], 10, Gc)) : (t(), n("button", {
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
                      d: y(Fe)({
                        ...g,
                        destructive: g.destructive
                      })
                    }, null, 8, Qc)
                  ], 2)),
                  l("span", Xc, f(g.label), 1)
                ], 10, Jc))
              ], 64))), 128))
            ])
          ]),
          _: 2
        }, 1024))), 128))
      ]),
      F(jc, {
        ref_key: "fallback",
        ref: i,
        class: "sm:hidden",
        groups: e.groups,
        title: e.title,
        busy: e.busy,
        onRun: w[0] || (w[0] = (m) => s("run", m))
      }, null, 8, ["groups", "title", "busy"])
    ]));
  }
}), Yt = {
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
}, Jt = {
  neutral: { label: "Neutral", hue: 0, chroma: 0 },
  slate: { label: "Slate", hue: 260, chroma: 0.012 },
  gray: { label: "Gray", hue: 250, chroma: 6e-3 },
  zinc: { label: "Zinc", hue: 280, chroma: 6e-3 },
  stone: { label: "Stone", hue: 60, chroma: 8e-3 },
  warm: { label: "Warm", hue: 40, chroma: 0.014 },
  cool: { label: "Cool", hue: 220, chroma: 0.014 },
  sand: { label: "Sand", hue: 80, chroma: 0.016 }
}, Vt = 12, Lt = 20, ef = [0, 0.25, 0.5, 0.75, 1], pa = "alxtexhpanel.appearance", _e = {
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
}, Ee = K({ ..._e });
let nt = !1;
const Ja = "alxtexhpanel.appearance.vars", Qt = "pk-appearance";
function ut() {
  return typeof window > "u" ? null : window;
}
let Ot = null;
function Qa(e) {
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
function Xa(e) {
  const o = ut();
  o && (o.__panelAppearance = { ...e });
}
function tf(e) {
  if (typeof document > "u")
    return;
  let o = document.getElementById(Qt);
  o || (o = document.createElement("style"), o.id = Qt, document.head.appendChild(o));
  const a = Object.entries(e).map(([r, s]) => `${r}: ${s};`).join(" ");
  o.textContent = `:root { ${a} }`;
}
function bC() {
  nt = !1, Ot = null, Ee.value = { ..._e };
  const e = ut();
  e && (e.__panelAppearanceApplied = !1), typeof document < "u" && document.getElementById(Qt)?.remove();
}
function va(e) {
  return e.theme === "dark";
}
const Ma = {
  compact: "0.25rem",
  comfortable: "0.5rem",
  spacious: "0.875rem"
}, Sa = {
  compact: "0.75rem",
  comfortable: "1rem",
  spacious: "1.5rem"
};
function en(e) {
  const o = Yt[e.primary] ?? Yt.slate, a = Jt[e.surface] ?? Jt.neutral, r = a.chroma, s = a.hue, i = r > 0 ? r : 6e-3, d = r > 0 ? s : 250, c = va(e) ? {
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
    "--pk-row-padding": Ma[e.density] ?? Ma.comfortable,
    "--pk-form-gap": Sa[e.density] ?? Sa.comfortable
  };
}
function af(e) {
  return {
    dark: va(e),
    theme: e.theme,
    vars: en(e),
    sidebar: e.sidebarSide,
    contentLayout: e.contentLayout
  };
}
function ga() {
  if (typeof window > "u")
    return { ..._e };
  try {
    const e = localStorage.getItem(pa);
    if (!e)
      return { ..._e };
    const o = { ..._e, ...JSON.parse(e) };
    o.theme === "system" && (o.theme = _e.theme);
    const a = { small: 14, normal: 16, large: 18 };
    return typeof o.fontSize == "string" && (o.fontSize = a[o.fontSize] ?? _e.fontSize), (typeof o.fontSize != "number" || Number.isNaN(o.fontSize) || o.fontSize < Vt || o.fontSize > Lt) && (o.fontSize = _e.fontSize), o;
  } catch {
    return { ..._e };
  }
}
function nf() {
  const e = ut();
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
function tn(e) {
  const o = ga(), a = e ? { ..._e, ...o, ...e } : { ..._e, ...o }, r = !nt, s = Qa(a);
  if (Ee.value = a, nt = !0, e) {
    Xa(a);
    try {
      localStorage.setItem(pa, JSON.stringify(a));
    } catch {
    }
  }
  const d = ut()?.__panelAppearanceApplied === !0;
  if (Ot !== s) {
    if (r && d && e) {
      Ot = s;
      try {
        const u = af(a);
        localStorage.setItem(Ja, JSON.stringify(u));
      } catch {
      }
      return;
    }
    Xt(a);
  }
}
function yC() {
  tn(nf());
}
function xC(e) {
  const o = e?.props?.appearance;
  o != null && typeof o == "object" && tn(o);
}
let an = null;
function kC(e) {
  an = e;
}
let nn = {};
function lf(e) {
  if (nn = e, !(typeof document > "u") && !ga().primaryChosen)
    for (const [o, a] of Object.entries(e))
      document.documentElement.style.setProperty(o, a);
}
function Xt(e) {
  if (typeof document > "u")
    return;
  const o = document.documentElement, a = en(e), r = { ...a, ...e.primaryChosen ? {} : nn }, s = {
    dark: va(e),
    theme: e.theme,
    vars: r,
    sidebar: e.sidebarSide,
    contentLayout: e.contentLayout
  };
  o.classList.toggle("dark", s.dark);
  for (const [d, u] of Object.entries(r))
    o.style.setProperty(d, u);
  o.dataset.sidebar = s.sidebar, o.dataset.contentLayout = s.contentLayout, tf(a), Xa(e), Ot = Qa(e);
  const i = ut();
  i && (i.__panelAppearanceApplied = !0);
  try {
    localStorage.setItem(Ja, JSON.stringify(s));
  } catch {
  }
}
function ln() {
  function e(r) {
    Xt(r);
  }
  function o(r) {
    const s = r.primary !== void 0 ? { primaryChosen: !0 } : {};
    Ee.value = { ...Ee.value, ...r, ...s };
    try {
      localStorage.setItem(pa, JSON.stringify(Ee.value));
    } catch {
    }
    e(Ee.value), an?.({ ...r, ...s });
  }
  function a() {
    o({ ..._e });
  }
  return ke(() => {
    if (nt || ut()?.__panelAppearanceApplied) {
      nt = !0;
      return;
    }
    nt = !0, Ee.value = ga(), Xt(Ee.value);
  }), {
    appearance: h(() => Ee.value),
    set: o,
    reset: a,
    PRIMARY_COLORS: Yt,
    SURFACE_TINTS: Jt,
    FONT_SIZE_MIN: Vt,
    FONT_SIZE_MAX: Lt,
    RADIUS_OPTIONS: ef
  };
}
const of = ["aria-busy", "aria-describedby"], sf = { class: "bg-background flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3" }, rf = { class: "min-w-0" }, df = { class: "flex shrink-0 items-center gap-2" }, uf = ["disabled"], cf = { class: "min-h-0 flex-1 overflow-y-auto overscroll-contain" }, ff = {
  key: 0,
  class: "bg-muted/30 flex shrink-0 items-center justify-end gap-2 border-t px-4 py-3"
}, Tt = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(null), i = `pk-slideover-title-${lt()}`, d = `pk-slideover-description-${lt()}`, u = /* @__PURE__ */ Symbol("pk-slideover");
    let c = null, v = !1;
    const p = K(!1), x = h(() => a.width ?? $o[a.size]), M = h(
      () => [qa, a.padded ? ko : ""].filter(Boolean).join(" ")
    );
    function $(B) {
      p.value = B.target === B.currentTarget;
    }
    function C(B) {
      p.value && B.target === B.currentTarget && !a.busy && r("close"), p.value = !1;
    }
    function k(B) {
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
      const w = A[0], m = A[A.length - 1];
      B.shiftKey && document.activeElement === w ? (B.preventDefault(), m.focus()) : !B.shiftKey && document.activeElement === m && (B.preventDefault(), w.focus());
    }
    return ge(
      () => a.open,
      async (B) => {
        if (B) {
          c = document.activeElement, Ga(u), v = !0, document.addEventListener("keydown", k), await Ve(), s.value?.querySelector("input, button, [tabindex]")?.focus();
          return;
        }
        if (v) {
          const A = _t(u);
          v = !1, document.removeEventListener("keydown", k), A && c?.focus?.(), c = null;
        }
      },
      { immediate: !0 }
    ), Me(() => {
      document.removeEventListener("keydown", k), v && (_t(u), v = !1);
    }), (B, A) => (t(), T(yt, { to: "body" }, [
      F(ot, {
        "enter-active-class": "transition duration-150 ease-out",
        "enter-from-class": "opacity-0",
        "leave-active-class": "transition duration-100 ease-in",
        "leave-to-class": "opacity-0"
      }, {
        default: L(() => [
          e.open ? (t(), n("div", {
            key: 0,
            class: "fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]",
            onPointerdown: $,
            onPointerup: C
          }, null, 32)) : b("", !0)
        ]),
        _: 1
      }),
      F(ot, {
        "enter-active-class": "transition duration-200 ease-out",
        "enter-from-class": e.side === "left" ? "-translate-x-full" : "translate-x-full",
        "leave-active-class": "transition duration-150 ease-in",
        "leave-to-class": e.side === "left" ? "-translate-x-full" : "translate-x-full"
      }, {
        default: L(() => [
          e.open ? (t(), n("aside", {
            key: 0,
            ref_key: "panel",
            ref: s,
            "data-pk-overlay": "",
            class: z(["bg-background fixed inset-y-0 z-50 flex h-dvh max-h-dvh max-w-full flex-col shadow-2xl", [x.value, e.side === "left" ? "left-0 border-r" : "right-0 border-l"]]),
            role: "dialog",
            "aria-modal": "true",
            "aria-busy": e.busy ? "true" : void 0,
            "aria-labelledby": i,
            "aria-describedby": e.description ? d : void 0
          }, [
            l("header", sf, [
              l("div", rf, [
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
              l("div", df, [
                Z(B.$slots, "header-actions"),
                l("button", {
                  type: "button",
                  class: "text-muted-foreground hover:text-foreground disabled:opacity-50",
                  "aria-label": "Close",
                  disabled: e.busy,
                  onClick: A[0] || (A[0] = (w) => r("close"))
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
                ])], 8, uf)
              ])
            ]),
            l("div", cf, [
              l("div", {
                class: z(M.value)
              }, [
                Z(B.$slots, "default")
              ], 2)
            ]),
            B.$slots.footer ? (t(), n("footer", ff, [
              Z(B.$slots, "footer")
            ])) : b("", !0)
          ], 10, of)) : b("", !0)
        ]),
        _: 3
      }, 8, ["enter-from-class", "leave-to-class"])
    ]));
  }
}), mf = { class: "flex flex-col gap-5 px-4 py-4" }, pf = { class: "flex flex-col gap-2" }, vf = { class: "grid grid-cols-8 gap-2" }, gf = ["title", "aria-label", "aria-pressed", "onClick"], hf = { class: "flex flex-col gap-2" }, bf = { class: "grid grid-cols-8 gap-2" }, yf = ["title", "aria-label", "aria-pressed", "onClick"], xf = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "absolute inset-0 m-auto size-4 text-black",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3.5"
}, kf = { class: "flex flex-col gap-2" }, $f = { class: "bg-muted/50 flex gap-0.5 rounded-md p-0.5" }, wf = ["aria-pressed", "aria-label", "onClick"], Cf = { class: "text-sm font-semibold" }, Mf = { class: "bg-muted/50 flex gap-0.5 rounded-md p-0.5" }, Sf = ["onClick"], Bf = { class: "flex flex-col gap-2" }, Af = { class: "flex items-center justify-between" }, zf = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, Pf = { class: "flex items-center gap-2" }, _f = ["disabled"], Vf = ["min", "max", "value"], Lf = ["disabled"], $C = /* @__PURE__ */ V({
  __name: "AppearanceDrawer",
  setup(e) {
    const { appearance: o, set: a, reset: r, PRIMARY_COLORS: s, SURFACE_TINTS: i, RADIUS_OPTIONS: d } = ln(), u = K(!1), c = h(() => o.value.sidebarSide === "right"), v = h(() => c.value ? "left" : "right"), p = [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" }
    ], x = [
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
    function B(A, w) {
      return `oklch(0.72 ${w * 3} ${A})`;
    }
    return (A, w) => (t(), n(P, null, [
      l("button", {
        type: "button",
        class: "border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors",
        "aria-label": "Appearance settings",
        title: "Appearance",
        onClick: w[0] || (w[0] = (m) => u.value = !0)
      }, [...w[6] || (w[6] = [
        vt('<svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 1 0-20c5 0 9 3.6 9 8 0 2.2-1.8 4-4 4h-2.2a1.8 1.8 0 0 0-1.3 3 1.8 1.8 0 0 1-1.5 3z"></path><circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="10.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="15" cy="8.5" r="1.2" fill="currentColor" stroke="none"></circle></svg>', 1)
      ])]),
      F(Tt, {
        open: u.value,
        title: "Settings",
        side: v.value,
        width: "w-80",
        padded: !1,
        onClose: w[5] || (w[5] = (m) => u.value = !1)
      }, {
        "header-actions": L(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground text-xs font-normal hover:underline",
            onClick: w[1] || (w[1] = //@ts-ignore
            (...m) => y(r) && y(r)(...m))
          }, " Reset ")
        ]),
        default: L(() => [
          l("div", mf, [
            l("section", pf, [
              w[8] || (w[8] = l("h3", { class: "text-sm font-semibold" }, "Primary", -1)),
              l("div", vf, [
                (t(!0), n(P, null, O(y(s), (m, g) => (t(), n("button", {
                  key: g,
                  type: "button",
                  class: "relative size-7 rounded-md transition-transform hover:scale-110",
                  style: ie({ background: m.value }),
                  title: m.label,
                  "aria-label": m.label,
                  "aria-pressed": y(o).primary === g,
                  onClick: (S) => y(a)({ primary: g })
                }, [
                  y(o).primary === g ? (t(), n("svg", {
                    key: 0,
                    viewBox: "0 0 24 24",
                    class: "absolute inset-0 m-auto size-4",
                    style: ie({ color: m.foreground }),
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "3.5"
                  }, [...w[7] || (w[7] = [
                    l("path", { d: "m5 13 4 4L19 7" }, null, -1)
                  ])], 4)) : b("", !0)
                ], 12, gf))), 128))
              ])
            ]),
            l("section", hf, [
              w[10] || (w[10] = l("h3", { class: "text-sm font-semibold" }, "Surface", -1)),
              l("div", bf, [
                (t(!0), n(P, null, O(y(i), (m, g) => (t(), n("button", {
                  key: g,
                  type: "button",
                  class: "relative size-7 rounded-md border transition-transform hover:scale-110",
                  style: ie({ background: B(m.hue, m.chroma) }),
                  title: m.label,
                  "aria-label": m.label,
                  "aria-pressed": y(o).surface === g,
                  onClick: (S) => y(a)({ surface: g })
                }, [
                  y(o).surface === g ? (t(), n("svg", xf, [...w[9] || (w[9] = [
                    l("path", { d: "m5 13 4 4L19 7" }, null, -1)
                  ])])) : b("", !0)
                ], 12, yf))), 128))
              ])
            ]),
            l("section", kf, [
              w[11] || (w[11] = l("h3", { class: "text-sm font-semibold" }, "Radius", -1)),
              l("div", $f, [
                (t(!0), n(P, null, O(y(d), (m) => (t(), n("button", {
                  key: m,
                  type: "button",
                  class: z([
                    "flex flex-1 flex-col items-center gap-1 rounded px-2 py-1.5 text-xs transition-colors",
                    y(o).radius === m ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ]),
                  "aria-pressed": y(o).radius === m,
                  "aria-label": `${m}rem radius`,
                  onClick: (g) => y(a)({ radius: m })
                }, [
                  l("span", {
                    class: "border-foreground/50 block size-4 border-2",
                    style: ie({ borderRadius: `${Math.min(m, 0.5)}rem` })
                  }, null, 4),
                  q(" " + f(m), 1)
                ], 10, wf))), 128))
              ])
            ]),
            (t(!0), n(P, null, O([
              { label: "Color scheme", key: "theme", options: p },
              { label: "Card style", key: "cardStyle", options: M },
              { label: "Density", key: "density", options: x },
              { label: "Sidebar", key: "sidebarSide", options: $ },
              { label: "Content layout", key: "contentLayout", options: C },
              { label: "Menu style", key: "menuStyle", options: k }
            ], (m) => (t(), n("section", {
              key: m.key,
              class: "flex flex-col gap-2"
            }, [
              l("h3", Cf, f(m.label), 1),
              l("div", Mf, [
                (t(!0), n(P, null, O(m.options, (g) => (t(), n("button", {
                  key: String(g.value),
                  type: "button",
                  class: z([
                    "flex-1 rounded px-2 py-1.5 text-xs transition-colors",
                    y(o)[m.key] === g.value ? "bg-background text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
                  ]),
                  onClick: (S) => y(a)({ [m.key]: g.value })
                }, f(g.label), 11, Sf))), 128))
              ])
            ]))), 128)),
            l("section", Bf, [
              l("div", Af, [
                w[12] || (w[12] = l("h3", { class: "text-sm font-semibold" }, "Font size", -1)),
                l("span", zf, f(y(o).fontSize) + "px", 1)
              ]),
              l("div", Pf, [
                l("button", {
                  type: "button",
                  class: "border-input hover:bg-accent size-7 rounded-md border text-sm disabled:opacity-40",
                  disabled: y(o).fontSize <= y(Vt),
                  "aria-label": "Decrease font size",
                  onClick: w[2] || (w[2] = (m) => y(a)({ fontSize: y(o).fontSize - 1 }))
                }, " − ", 8, _f),
                l("input", {
                  type: "range",
                  class: "accent-primary flex-1",
                  min: y(Vt),
                  max: y(Lt),
                  value: y(o).fontSize,
                  "aria-label": "Font size in pixels",
                  onInput: w[3] || (w[3] = (m) => y(a)({
                    fontSize: Number(m.target.value)
                  }))
                }, null, 40, Vf),
                l("button", {
                  type: "button",
                  class: "border-input hover:bg-accent size-7 rounded-md border text-sm disabled:opacity-40",
                  disabled: y(o).fontSize >= y(Lt),
                  "aria-label": "Increase font size",
                  onClick: w[4] || (w[4] = (m) => y(a)({ fontSize: y(o).fontSize + 1 }))
                }, " + ", 8, Lf)
              ])
            ])
          ])
        ]),
        _: 1
      }, 8, ["open", "side"])
    ], 64));
  }
}), Of = {
  class: "bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur sm:hidden",
  "aria-label": "Primary",
  style: { paddingBottom: "env(safe-area-inset-bottom)" }
}, jf = { class: "flex items-stretch" }, Df = ["href", "aria-current"], Tf = {
  class: "size-5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, If = ["d"], Ef = { class: "w-full truncate text-center" }, Ff = {
  key: 0,
  class: "flex-1"
}, Nf = {
  class: "size-5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, Rf = ["d"], Hf = { class: "w-full truncate text-center" }, Rt = 5, wC = /* @__PURE__ */ V({
  __name: "PkBottomNav",
  props: {
    items: {},
    current: { default: "" },
    moreLabel: { default: "More" }
  },
  emits: ["more"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(
      () => a.items.length <= Rt ? a.items : a.items.slice(0, Rt - 1)
    ), i = h(() => a.items.length > Rt);
    function d(u) {
      return u === "/" ? a.current === "/" : a.current === u || a.current.startsWith(`${u}/`);
    }
    return (u, c) => (t(), n("nav", Of, [
      l("ul", jf, [
        (t(!0), n(P, null, O(s.value, (v) => (t(), n("li", {
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
            (t(), n("svg", Tf, [
              l("path", {
                d: y(me)(v.icon)
              }, null, 8, If)
            ])),
            l("span", Ef, f(v.title), 1)
          ], 10, Df)
        ]))), 128)),
        i.value ? (t(), n("li", Ff, [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:text-foreground flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] transition-colors",
            onClick: c[0] || (c[0] = (v) => r("more"))
          }, [
            (t(), n("svg", Nf, [
              l("path", {
                d: y(me)("more-horizontal")
              }, null, 8, Rf)
            ])),
            l("span", Hf, f(e.moreLabel), 1)
          ])
        ])) : b("", !0)
      ])
    ]));
  }
}), Uf = { class: "lg:shrink-0 lg:self-start" }, Kf = { class: "lg:hidden" }, qf = ["aria-expanded", "aria-label"], Gf = { class: "flex min-w-0 items-center gap-2" }, Wf = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Zf = ["d"], Yf = { class: "truncate" }, Jf = ["aria-label"], Qf = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, Xf = ["d"], em = { class: "flex-1" }, tm = {
  key: 0,
  class: "size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, am = ["d"], nm = { class: "sticky top-6 hidden w-60 shrink-0 self-start lg:block" }, lm = ["aria-label"], om = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, sm = ["d"], CC = /* @__PURE__ */ V({
  __name: "PkSubNav",
  props: {
    items: {},
    ariaLabel: { default: "Section" },
    fallbackIcon: { default: "sliders" }
  },
  setup(e) {
    const o = e, a = la();
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
    const i = h(
      () => o.items.find((u) => s(u.href)) ?? o.items[0]
    );
    function d(u) {
      return u?.icon ?? o.fallbackIcon;
    }
    return (u, c) => (t(), n("div", Uf, [
      l("div", Kf, [
        F(Ze, { align: "start" }, {
          trigger: L(({ open: v }) => [
            l("button", {
              type: "button",
              class: "border-input bg-background hover:bg-accent flex h-10 w-full items-center justify-between rounded-md border px-3 text-sm shadow-xs",
              "aria-expanded": v,
              "aria-haspopup": "listbox",
              "aria-label": e.ariaLabel
            }, [
              l("span", Gf, [
                (t(), n("svg", Wf, [
                  l("path", {
                    d: y(me)(d(i.value))
                  }, null, 8, Zf)
                ])),
                l("span", Yf, f(i.value?.title), 1)
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
            ], 8, qf)
          ]),
          panel: L(() => [
            l("div", {
              class: "flex flex-col",
              role: "listbox",
              "aria-label": e.ariaLabel
            }, [
              (t(!0), n(P, null, O(e.items, (v) => (t(), T(y(Gt), {
                key: v.href,
                href: v.href,
                role: "option",
                "aria-selected": s(v.href),
                class: z([
                  "flex items-center gap-2 rounded-sm px-2 py-2 text-sm",
                  s(v.href) ? "bg-muted font-medium" : "hover:bg-muted/70"
                ])
              }, {
                default: L(() => [
                  (t(), n("svg", Qf, [
                    l("path", {
                      d: y(me)(d(v))
                    }, null, 8, Xf)
                  ])),
                  l("span", em, f(v.title), 1),
                  s(v.href) ? (t(), n("svg", tm, [
                    l("path", {
                      d: y(me)("check")
                    }, null, 8, am)
                  ])) : b("", !0)
                ]),
                _: 2
              }, 1032, ["href", "aria-selected", "class"]))), 128))
            ], 8, Jf)
          ]),
          _: 1
        })
      ]),
      l("aside", nm, [
        l("nav", {
          class: "flex flex-col space-y-1",
          "aria-label": e.ariaLabel
        }, [
          (t(!0), n(P, null, O(e.items, (v) => (t(), T(y(Gt), {
            key: v.href,
            href: v.href,
            class: z([
              y(at)({ variant: "ghost" }),
              "w-full justify-start",
              s(v.href) ? "bg-primary/10 text-foreground font-medium ring-1 ring-primary/15" : ""
            ])
          }, {
            default: L(() => [
              (t(), n("svg", om, [
                l("path", {
                  d: y(me)(d(v))
                }, null, 8, sm)
              ])),
              q(" " + f(v.title), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"]))), 128))
        ], 8, lm)
      ])
    ]));
  }
}), rm = ["value"], Ae = /* @__PURE__ */ V({
  __name: "PkTextInput",
  props: {
    defaultValue: {},
    modelValue: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = `file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${We}`;
    return (i, d) => (t(), n("input", {
      "data-slot": "input",
      value: a.modelValue ?? a.defaultValue,
      class: z([s, a.class]),
      onInput: d[0] || (d[0] = (u) => r("update:modelValue", u.target.value))
    }, null, 42, rm));
  }
}), im = ["for"], Oe = /* @__PURE__ */ V({
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
      Z(o.$slots, "default")
    ], 10, im));
  }
}), MC = /* @__PURE__ */ V({
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
}), dm = { class: "relative flex items-center gap-2 has-disabled:opacity-50" }, um = ["id", "name", "value", "disabled", "maxlength"], cm = ["data-active"], fm = {
  key: 0,
  class: "pointer-events-none absolute inset-0 flex items-center justify-center"
}, mm = /* @__PURE__ */ V({
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
    ke(() => {
      a.autofocus && i.value?.focus();
    });
    const u = h(
      () => Array.from({ length: a.length }, (A, w) => a.modelValue[w] ?? "")
    ), c = h(() => Math.min(a.modelValue.length, a.length - 1));
    function v(A) {
      return A.replace(/\D/g, "").slice(0, a.length);
    }
    function p(A) {
      a.disabled || A.length !== a.length || d.value !== A && (d.value = A, r("complete", A));
    }
    function x(A) {
      const w = v(A);
      w !== a.modelValue && r("update:modelValue", w), p(w);
    }
    function M(A) {
      x(A.target.value);
    }
    function $(A) {
      x(A.target.value);
    }
    function C() {
      x(i.value?.value ?? "");
    }
    function k(A) {
      A.animationName === "pkOtpAutofillStart" && C();
    }
    ge(
      () => a.modelValue,
      (A) => {
        A.length < a.length ? d.value = "" : p(A);
      }
    );
    let B;
    return ke(() => {
      B = window.setInterval(() => {
        if (a.disabled || !i.value)
          return;
        (i.value.matches(":-webkit-autofill") || i.value.matches(":autofill") || document.activeElement === i.value) && C();
      }, 250);
    }), bn(() => {
      B !== void 0 && window.clearInterval(B);
    }), (A, w) => (t(), n("div", dm, [
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
        onFocus: w[0] || (w[0] = (m) => s.value = !0),
        onBlur: w[1] || (w[1] = (m) => s.value = !1)
      }, null, 40, um),
      (t(!0), n(P, null, O(u.value, (m, g) => (t(), n("div", {
        key: g,
        "data-slot": "input-otp-slot",
        "data-active": s.value && g === c.value,
        class: "data-[active=true]:border-ring data-[active=true]:ring-ring/50 border-input dark:bg-input/30 relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]"
      }, [
        q(f(m) + " ", 1),
        s.value && g === c.value && m === "" ? (t(), n("div", fm, [...w[2] || (w[2] = [
          l("div", { class: "bg-foreground h-4 w-px animate-pulse duration-1000" }, null, -1)
        ])])) : b("", !0)
      ], 8, cm))), 128))
    ]));
  }
}), SC = /* @__PURE__ */ it(mm, [["__scopeId", "data-v-0fdf60b6"]]), pm = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Re = /* @__PURE__ */ V({
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
      e.description ? (t(), n("p", pm, f(e.description), 1)) : b("", !0)
    ], 2));
  }
}), vm = {
  "data-slot": "page-header",
  class: "pk-section-heading flex flex-wrap items-start justify-between gap-3 pb-0.5"
}, gm = { class: "min-w-0 space-y-1" }, hm = { class: "flex flex-wrap items-center gap-2.5" }, bm = { class: "font-semibold" }, ym = {
  key: 0,
  class: "flex items-center gap-2"
}, xm = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, km = {
  key: 0,
  class: "flex shrink-0 flex-wrap items-center gap-2"
}, BC = /* @__PURE__ */ V({
  __name: "PkPageHeader",
  props: {
    title: {},
    purpose: {}
  },
  setup(e) {
    return (o, a) => (t(), n("header", vm, [
      l("div", gm, [
        l("div", hm, [
          l("h1", bm, f(e.title), 1),
          o.$slots.status ? (t(), n("div", ym, [
            Z(o.$slots, "status")
          ])) : b("", !0)
        ]),
        e.purpose ? (t(), n("p", xm, f(e.purpose), 1)) : b("", !0)
      ]),
      o.$slots.actions ? (t(), n("div", km, [
        Z(o.$slots, "actions")
      ])) : b("", !0)
    ]));
  }
}), $m = /* @__PURE__ */ V({
  __name: "Alert",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    variant: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert",
      class: z(y(oe)(y(Mm)({ variant: e.variant }), o.class)),
      role: "alert"
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), wm = /* @__PURE__ */ V({
  __name: "AlertDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert-description",
      class: z(
        y(oe)(
          "col-start-2 text-sm font-normal text-muted-foreground [&_p]:leading-relaxed",
          o.class
        )
      )
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), Cm = /* @__PURE__ */ V({
  __name: "AlertTitle",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "alert-title",
      class: z(y(oe)("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), Mm = da(
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
), Sm = { class: "list-inside list-disc text-sm" }, AC = /* @__PURE__ */ V({
  __name: "PkAlertError",
  props: {
    errors: {},
    title: { default: "Something went wrong." }
  },
  setup(e) {
    const o = e, a = h(() => Array.from(new Set(o.errors)));
    return (r, s) => (t(), T(y($m), { variant: "destructive" }, {
      default: L(() => [
        F(y(dl), { class: "size-4" }),
        F(y(Cm), null, {
          default: L(() => [
            q(f(e.title), 1)
          ]),
          _: 1
        }),
        F(y(wm), null, {
          default: L(() => [
            l("ul", Sm, [
              (t(!0), n(P, null, O(a.value, (i, d) => (t(), n("li", { key: d }, f(i), 1))), 128))
            ])
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}), on = /* @__PURE__ */ V({
  __name: "Input",
  props: {
    defaultValue: {},
    modelValue: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, s = Ka(a, "modelValue", o, {
      passive: !0,
      defaultValue: a.defaultValue
    });
    return (i, d) => xe((t(), n("input", {
      "onUpdate:modelValue": d[0] || (d[0] = (u) => yn(s) ? s.value = u : null),
      "data-slot": "input",
      class: z(
        y(oe)(
          "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          y(We),
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          a.class
        )
      )
    }, null, 2)), [
      [Le, y(s)]
    ]);
  }
}), Bm = { class: "relative" }, Am = ["aria-label"], zC = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkPasswordInput",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e, { expose: o }) {
    const a = e, r = K(!1), s = xn("inputRef");
    return o({
      $el: s,
      focus: () => s.value?.$el?.focus()
    }), (i, d) => (t(), n("div", Bm, [
      F(y(on), re({
        ref_key: "inputRef",
        ref: s,
        type: r.value ? "text" : "password",
        class: y(oe)("pr-10", a.class)
      }, i.$attrs), null, 16, ["type", "class"]),
      l("button", {
        type: "button",
        class: z(
          y(oe)(
            "text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 focus-visible:ring-[3px] focus-visible:outline-none"
          )
        ),
        "aria-label": r.value ? "Hide password" : "Show password",
        tabindex: -1,
        onClick: d[0] || (d[0] = (u) => r.value = !r.value)
      }, [
        r.value ? (t(), T(y(ul), {
          key: 0,
          class: "size-4"
        })) : (t(), T(y(cl), {
          key: 1,
          class: "size-4"
        }))
      ], 10, Am)
    ]));
  }
}), sn = "@container min-w-0", zm = "grid grid-cols-1 gap-3 @lg:grid-cols-2 @3xl:grid-cols-3", PC = "grid grid-cols-1 gap-2 @lg:grid-cols-2 @3xl:grid-cols-3", Pm = "grid grid-cols-1 gap-4 @lg:grid-cols-2 @lg:gap-5 @3xl:grid-cols-3";
function _m(e) {
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
function _C(e, o) {
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
    _m(d.span) >= 2 ? (i(), r.push({ type: "wide", item: d })) : s.push(d);
  return i(), r;
}
function Ba(e, o) {
  return `${e}:${o}`;
}
function VC(e) {
  const o = /^(stat|chart|table):([a-z0-9_-]+)$/i.exec(e);
  return o ? {
    kind: o[1].toLowerCase(),
    key: o[2]
  } : null;
}
function ea(e, o = 1) {
  return (e ?? o) >= 2 ? 2 : 1;
}
function LC(e, o, a, r) {
  const s = [
    { kind: "stat", items: e },
    { kind: "chart", items: o },
    { kind: "table", items: a }
  ], i = /* @__PURE__ */ new Map();
  for (const c of s)
    for (const v of c.items)
      i.set(Ba(c.kind, v.key), {
        kind: c.kind,
        source: v
      });
  const d = [], u = /* @__PURE__ */ new Set();
  for (const c of r?.widgets ?? []) {
    const v = c.id.toLowerCase(), p = i.get(v);
    p && (u.add(v), d.push({
      id: v,
      kind: p.kind,
      key: p.source.key,
      span: ea(c.span),
      hidden: !!c.hidden,
      source: p.source
    }));
  }
  for (const c of s)
    for (const v of c.items) {
      const p = Ba(c.kind, v.key);
      u.has(p) || d.push({
        id: p,
        kind: c.kind,
        key: v.key,
        span: ea(v.span),
        hidden: !1,
        source: v
      });
    }
  return d;
}
function OC(e) {
  return {
    widgets: e.map((o) => ({
      id: o.id.toLowerCase(),
      span: ea(o.span),
      hidden: !!o.hidden
    }))
  };
}
const rn = "Upload a PNG with a transparent background so it sits on invoices and contracts without a white box.", Vm = "This image has no transparent background. Upload a PNG (or WebP) with alpha so it sits on invoices and contracts without a white box.", Lm = "JPEG files are fully opaque and stamp a white rectangle. Upload a PNG with a transparent background.";
function Om(e) {
  const o = e.name.toLowerCase(), a = e.type.toLowerCase();
  return a === "image/jpeg" || a === "image/jpg" || o.endsWith(".jpg") || o.endsWith(".jpeg");
}
function jm(e) {
  const o = e.name.toLowerCase(), a = e.type.toLowerCase();
  return a === "image/png" || a === "image/webp" || o.endsWith(".png") || o.endsWith(".webp");
}
async function Dm(e) {
  const o = URL.createObjectURL(e);
  try {
    const a = await Tm(o), r = document.createElement("canvas"), s = Math.max(1, a.naturalWidth), i = Math.max(1, a.naturalHeight);
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
function Tm(e) {
  return new Promise((o, a) => {
    const r = new Image();
    r.onload = () => o(r), r.onerror = () => a(new Error("Could not read that image.")), r.src = e;
  });
}
async function Im(e) {
  if (Om(e))
    throw new Error(Lm);
  if (!jm(e))
    throw new Error(rn);
  if (!await Dm(e))
    throw new Error(Vm);
}
const jC = /* @__PURE__ */ V({
  __name: "SheetClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(st), re({ "data-slot": "sheet-close" }, o), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Em = /* @__PURE__ */ V({
  __name: "SheetDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(Ia), re({
      "data-slot": "sheet-description",
      class: y(oe)("text-sm text-muted-foreground font-normal", o.class)
    }, y(a)), {
      default: L(() => [
        Z(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), DC = /* @__PURE__ */ V({
  __name: "SheetFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sheet-footer",
      class: z(y(oe)("mt-auto flex flex-col gap-2 p-4", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), Fm = /* @__PURE__ */ V({
  __name: "SheetHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sheet-header",
      class: z(y(oe)("flex flex-col gap-1.5 p-4", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), Nm = /* @__PURE__ */ V({
  __name: "SheetTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(Ea), re({
      "data-slot": "sheet-title",
      class: y(oe)("text-foreground font-semibold", o.class)
    }, y(a)), {
      default: L(() => [
        Z(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), TC = /* @__PURE__ */ V({
  __name: "SheetTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(Fa), re({ "data-slot": "sheet-trigger" }, o), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Aa = "sidebar_state", Rm = 3600 * 24 * 7, Hm = "16rem", Um = "18rem", Km = "3rem", qm = "b", [It, Gm] = Pn("Sidebar"), Wm = { class: "flex h-full w-full flex-col" }, Zm = ["data-state", "data-collapsible", "data-variant", "data-side"], Ym = {
  "data-sidebar": "sidebar",
  class: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
}, IC = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "Sidebar",
  props: {
    side: { default: "left" },
    variant: { default: "sidebar" },
    collapsible: { default: "offcanvas" },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { isMobile: a, state: r, openMobile: s, setOpenMobile: i } = It();
    return (d, u) => e.collapsible === "none" ? (t(), n("div", re({
      key: 0,
      "data-slot": "sidebar",
      class: y(oe)(
        "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
        o.class
      )
    }, d.$attrs), [
      Z(d.$slots, "default")
    ], 16)) : y(a) ? (t(), T(y(ca), re({
      key: 1,
      open: y(s)
    }, d.$attrs, { "onUpdate:open": y(i) }), {
      default: L(() => [
        F(y(fa), {
          "data-sidebar": "sidebar",
          "data-slot": "sidebar",
          "data-mobile": "true",
          "data-state": "expanded",
          "data-collapsible": "",
          side: e.side,
          class: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) max-w-none min-w-[16rem] p-0 sm:max-w-none [&>button]:hidden",
          style: ie({
            "--sidebar-width": y(Um)
          })
        }, {
          default: L(() => [
            F(Fm, { class: "sr-only" }, {
              default: L(() => [
                F(Nm, null, {
                  default: L(() => [...u[0] || (u[0] = [
                    q("Sidebar", -1)
                  ])]),
                  _: 1
                }),
                F(Em, null, {
                  default: L(() => [...u[1] || (u[1] = [
                    q("Displays the mobile sidebar.", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }),
            l("div", Wm, [
              Z(d.$slots, "default")
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
      "data-state": y(r),
      "data-collapsible": y(r) === "collapsed" ? e.collapsible : "",
      "data-variant": e.variant,
      "data-side": e.side
    }, [
      l("div", {
        class: z(
          y(oe)(
            "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            e.variant === "floating" || e.variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
          )
        )
      }, null, 2),
      l("div", re({
        class: y(oe)(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          e.side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          e.variant === "floating" || e.variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          o.class
        )
      }, d.$attrs), [
        l("div", Ym, [
          Z(d.$slots, "default")
        ])
      ], 16)
    ], 8, Zm));
  }
}), EC = /* @__PURE__ */ V({
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
        y(oe)(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          o.class
        )
      )
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), FC = /* @__PURE__ */ V({
  __name: "SidebarFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      class: z(y(oe)("flex flex-col gap-2 p-2", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), NC = /* @__PURE__ */ V({
  __name: "SidebarGroup",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      class: z(y(oe)("relative flex w-full min-w-0 flex-col p-2", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), RC = /* @__PURE__ */ V({
  __name: "SidebarGroupAction",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(rt), {
      "data-slot": "sidebar-group-action",
      "data-sidebar": "group-action",
      as: e.as,
      "as-child": e.asChild,
      class: z(
        y(oe)(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-sidebar-ring/50 focus-visible:ring-[3px] [&>svg]:size-4 [&>svg]:shrink-0",
          "after:absolute after:-inset-2 md:after:hidden",
          "group-data-[collapsible=icon]:hidden",
          o.class
        )
      )
    }, {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), HC = /* @__PURE__ */ V({
  __name: "SidebarGroupContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      class: z(y(oe)("w-full text-sm", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), UC = /* @__PURE__ */ V({
  __name: "SidebarGroupLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(rt), {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      as: e.as,
      "as-child": e.asChild,
      class: z(
        y(oe)(
          // /70 measured at 4.26:1 against the sidebar background - short of the
          // 4.5:1 WCAG AA floor for normal text. /80 measures ~5.6:1.
          "text-sidebar-foreground/80 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-sidebar-ring/50 focus-visible:ring-[3px] [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          o.class
        )
      )
    }, {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), KC = /* @__PURE__ */ V({
  __name: "SidebarHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      class: z(y(oe)("flex flex-col gap-2 p-2", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), qC = /* @__PURE__ */ V({
  __name: "SidebarInput",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(on), {
      "data-slot": "sidebar-input",
      "data-sidebar": "input",
      class: z(y(oe)("bg-background h-8 w-full shadow-none", o.class))
    }, {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), GC = /* @__PURE__ */ V({
  __name: "SidebarInset",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("main", {
      "data-slot": "sidebar-inset",
      class: z(
        y(oe)(
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
      Z(a.$slots, "default")
    ], 2));
  }
}), WC = /* @__PURE__ */ V({
  __name: "SidebarMenu",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("ul", {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      class: z(y(oe)("flex w-full min-w-0 flex-col gap-1", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), ZC = /* @__PURE__ */ V({
  __name: "SidebarMenuAction",
  props: {
    asChild: { type: Boolean },
    as: { default: "button" },
    showOnHover: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(rt), {
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      class: z(
        y(oe)(
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
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class", "as", "as-child"]));
  }
}), YC = /* @__PURE__ */ V({
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
        y(oe)(
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
      Z(a.$slots, "default")
    ], 2));
  }
}), Jm = /* @__PURE__ */ V({
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
    const s = we(e, o);
    return (i, d) => (t(), T(y(_n), re({ "data-slot": "tooltip" }, y(s)), {
      default: L((u) => [
        Z(i.$slots, "default", De(Ke(u)))
      ]),
      _: 3
    }, 16));
  }
}), Qm = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(Vn), null, {
      default: L(() => [
        F(y(Ln), re({ "data-slot": "tooltip-content" }, { ...y(i), ...d.$attrs }, {
          class: y(oe)(
            "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
            a.class
          )
        }), {
          default: L(() => [
            Z(d.$slots, "default"),
            F(y(On), { class: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), JC = /* @__PURE__ */ V({
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
    return (a, r) => (t(), T(y(Na), De(Ke(o)), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), Xm = /* @__PURE__ */ V({
  __name: "TooltipTrigger",
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(jn), re({ "data-slot": "tooltip-trigger" }, o), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), za = /* @__PURE__ */ V({
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
    return (a, r) => (t(), T(y(rt), re({
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": e.size,
      "data-active": e.isActive,
      class: y(oe)(y(tp)({ variant: e.variant, size: e.size }), o.class),
      as: e.as,
      "as-child": e.asChild
    }, a.$attrs), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-size", "data-active", "class", "as", "as-child"]));
  }
}), QC = /* @__PURE__ */ V({
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
    const o = e, { isMobile: a, state: r } = It(), s = ye(o, "tooltip");
    return (i, d) => e.tooltip ? (t(), T(y(Jm), { key: 1 }, {
      default: L(() => [
        F(y(Xm), { "as-child": "" }, {
          default: L(() => [
            F(za, De(Ke({ ...y(s), ...i.$attrs })), {
              default: L(() => [
                Z(i.$slots, "default")
              ]),
              _: 3
            }, 16)
          ]),
          _: 3
        }),
        F(y(Qm), {
          side: "right",
          align: "center",
          hidden: y(r) !== "collapsed" || y(a)
        }, {
          default: L(() => [
            typeof e.tooltip == "string" ? (t(), n(P, { key: 0 }, [
              q(f(e.tooltip), 1)
            ], 64)) : (t(), T(ze(e.tooltip), { key: 1 }))
          ]),
          _: 1
        }, 8, ["hidden"])
      ]),
      _: 3
    })) : (t(), T(za, De(re({ key: 0 }, { ...y(s), ...i.$attrs })), {
      default: L(() => [
        Z(i.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), XC = /* @__PURE__ */ V({
  __name: "SidebarMenuItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      class: z(y(oe)("group/menu-item relative", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), Pa = "animate-pulse rounded-md bg-primary/10", e6 = /* @__PURE__ */ V({
  __name: "SidebarMenuSkeleton",
  props: {
    showIcon: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = h(() => `${Math.floor(Math.random() * 40) + 50}%`);
    return (r, s) => (t(), n("div", {
      "data-slot": "sidebar-menu-skeleton",
      "data-sidebar": "menu-skeleton",
      class: z(y(oe)("flex h-8 items-center gap-2 rounded-md px-2", o.class))
    }, [
      e.showIcon ? (t(), n("div", {
        key: 0,
        class: z(y(oe)(Pa, "size-4")),
        "data-sidebar": "menu-skeleton-icon"
      }, null, 2)) : b("", !0),
      l("div", {
        class: z(y(oe)(Pa, "h-4 max-w-(--skeleton-width) flex-1")),
        "data-sidebar": "menu-skeleton-text",
        style: ie({ "--skeleton-width": a.value })
      }, null, 6)
    ], 2));
  }
}), t6 = /* @__PURE__ */ V({
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
        y(oe)(
          "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
          "group-data-[collapsible=icon]:hidden",
          o.class
        )
      )
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), a6 = /* @__PURE__ */ V({
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
    return (a, r) => (t(), T(y(rt), {
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      as: e.as,
      "as-child": e.asChild,
      "data-size": e.size,
      "data-active": e.isActive,
      class: z(
        y(oe)(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-sidebar-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
          "data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
          e.size === "sm" && "text-xs",
          e.size === "md" && "text-sm",
          "group-data-[collapsible=icon]:hidden",
          o.class
        )
      )
    }, {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "data-size", "data-active", "class"]));
  }
}), n6 = /* @__PURE__ */ V({
  __name: "SidebarMenuSubItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "sidebar-menu-sub-item",
      "data-sidebar": "menu-sub-item",
      class: z(y(oe)("group/menu-sub-item relative", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), l6 = /* @__PURE__ */ V({
  __name: "SidebarProvider",
  props: {
    defaultOpen: { type: Boolean, default: !xl?.cookie.includes(`${Aa}=false`) },
    open: { type: Boolean, default: void 0 },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = bl("(max-width: 767px)"), i = K(!1), d = Ka(a, "open", r, {
      defaultValue: a.defaultOpen ?? !1,
      passive: a.open === void 0
    });
    function u(x) {
      d.value = x, document.cookie = `${Aa}=${d.value}; path=/; max-age=${Rm}`;
    }
    function c(x) {
      i.value = x;
    }
    function v() {
      return s.value ? c(!i.value) : u(!d.value);
    }
    yl("keydown", (x) => {
      x.key === qm && (x.metaKey || x.ctrlKey) && (x.preventDefault(), v());
    });
    const p = h(() => s.value || d.value ? "expanded" : "collapsed");
    return Gm({
      state: p,
      open: d,
      setOpen: u,
      isMobile: s,
      openMobile: i,
      setOpenMobile: c,
      toggleSidebar: v
    }), (x, M) => (t(), T(y(Na), { "delay-duration": 0 }, {
      default: L(() => [
        l("div", re({
          "data-slot": "sidebar-wrapper",
          style: {
            "--sidebar-width": y(Hm),
            "--sidebar-width-icon": y(Km)
          },
          class: y(oe)(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex h-svh min-h-svh w-full overflow-hidden",
            a.class
          )
        }, x.$attrs), [
          Z(x.$slots, "default")
        ], 16)
      ]),
      _: 3
    }));
  }
}), o6 = /* @__PURE__ */ V({
  __name: "SidebarRail",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { toggleSidebar: a } = It();
    return (r, s) => (t(), n("button", {
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabindex: -1,
      title: "Toggle Sidebar",
      class: z(
        y(oe)(
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
      (...i) => y(a) && y(a)(...i))
    }, [
      Z(r.$slots, "default")
    ], 2));
  }
}), ep = /* @__PURE__ */ V({
  __name: "Separator",
  props: {
    orientation: { default: "horizontal" },
    decorative: { type: Boolean, default: !0 },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(Dn), re({ "data-slot": "separator" }, y(a), {
      class: y(oe)(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        o.class
      )
    }), null, 16, ["class"]));
  }
}), s6 = /* @__PURE__ */ V({
  __name: "SidebarSeparator",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(ep), {
      "data-slot": "sidebar-separator",
      "data-sidebar": "separator",
      class: z(y(oe)("bg-sidebar-border mx-2 w-auto", o.class))
    }, {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), r6 = /* @__PURE__ */ V({
  __name: "SidebarTrigger",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, { isMobile: a, state: r, toggleSidebar: s } = It();
    return (i, d) => (t(), T(ue, {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      class: z(y(oe)("h-7 w-7", o.class)),
      onClick: y(s)
    }, {
      default: L(() => [
        y(a) || y(r) === "collapsed" ? (t(), T(y(fl), { key: 0 })) : (t(), T(y(ml), { key: 1 })),
        d[0] || (d[0] = l("span", { class: "sr-only" }, "Toggle sidebar", -1))
      ]),
      _: 1
    }, 8, ["class", "onClick"]));
  }
}), tp = da(
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
), i6 = /* @__PURE__ */ V({
  __name: "DropdownMenu",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    dir: {},
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = we(e, o);
    return (i, d) => (t(), T(y(Tn), re({ "data-slot": "dropdown-menu" }, y(s)), {
      default: L((u) => [
        Z(i.$slots, "default", De(Ke(u)))
      ]),
      _: 3
    }, 16));
  }
}), ap = { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, d6 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(In), re({ "data-slot": "dropdown-menu-checkbox-item" }, y(i), {
      class: y(oe)(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: L(() => [
        l("span", ap, [
          F(y(Ra), null, {
            default: L(() => [
              Z(d.$slots, "indicator-icon", {}, () => [
                F(y(Ha), { class: "size-4" })
              ])
            ]),
            _: 3
          })
        ]),
        Z(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), u6 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(En), null, {
      default: L(() => [
        F(y(Fn), re({ "data-slot": "dropdown-menu-content" }, { ...d.$attrs, ...y(i) }, {
          class: y(oe)(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--reka-dropdown-menu-content-available-height) min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
            a.class
          )
        }), {
          default: L(() => [
            Z(d.$slots, "default")
          ]),
          _: 3
        }, 16, ["class"])
      ]),
      _: 3
    }));
  }
}), c6 = /* @__PURE__ */ V({
  __name: "DropdownMenuGroup",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(Nn), re({ "data-slot": "dropdown-menu-group" }, o), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), f6 = /* @__PURE__ */ V({
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
    const o = e, a = ye(o, "inset", "variant", "class"), r = Te(a);
    return (s, i) => (t(), T(y(Rn), re({
      "data-slot": "dropdown-menu-item",
      "data-inset": e.inset ? "" : void 0,
      "data-variant": e.variant
    }, y(r), {
      class: y(oe)(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        o.class
      )
    }), {
      default: L(() => [
        Z(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-inset", "data-variant", "class"]));
  }
}), m6 = /* @__PURE__ */ V({
  __name: "DropdownMenuLabel",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] },
    inset: { type: Boolean }
  },
  setup(e) {
    const o = e, a = ye(o, "class", "inset"), r = Te(a);
    return (s, i) => (t(), T(y(Hn), re({
      "data-slot": "dropdown-menu-label",
      "data-inset": e.inset ? "" : void 0
    }, y(r), {
      class: y(oe)("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", o.class)
    }), {
      default: L(() => [
        Z(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["data-inset", "class"]));
  }
}), p6 = /* @__PURE__ */ V({
  __name: "DropdownMenuRadioGroup",
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const s = we(e, o);
    return (i, d) => (t(), T(y(Un), re({ "data-slot": "dropdown-menu-radio-group" }, y(s)), {
      default: L(() => [
        Z(i.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), np = { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, v6 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(Kn), re({ "data-slot": "dropdown-menu-radio-item" }, y(i), {
      class: y(oe)(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: L(() => [
        l("span", np, [
          F(y(Ra), null, {
            default: L(() => [
              Z(d.$slots, "indicator-icon", {}, () => [
                F(y(pl), { class: "size-2 fill-current" })
              ])
            ]),
            _: 3
          })
        ]),
        Z(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), g6 = /* @__PURE__ */ V({
  __name: "DropdownMenuSeparator",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(qn), re({ "data-slot": "dropdown-menu-separator" }, y(a), {
      class: y(oe)("bg-border -mx-1 my-1 h-px", o.class)
    }), null, 16, ["class"]));
  }
}), h6 = /* @__PURE__ */ V({
  __name: "DropdownMenuShortcut",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("span", {
      "data-slot": "dropdown-menu-shortcut",
      class: z(y(oe)("text-muted-foreground ml-auto text-xs tracking-widest", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), b6 = /* @__PURE__ */ V({
  __name: "DropdownMenuSub",
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = we(e, o);
    return (i, d) => (t(), T(y(Gn), re({ "data-slot": "dropdown-menu-sub" }, y(s)), {
      default: L((u) => [
        Z(i.$slots, "default", De(Ke(u)))
      ]),
      _: 3
    }, 16));
  }
}), y6 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(Wn), re({ "data-slot": "dropdown-menu-sub-content" }, y(i), {
      class: y(oe)(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        a.class
      )
    }), {
      default: L(() => [
        Z(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), x6 = /* @__PURE__ */ V({
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
    const o = e, a = ye(o, "class", "inset"), r = Te(a);
    return (s, i) => (t(), T(y(Zn), re({ "data-slot": "dropdown-menu-sub-trigger" }, y(r), {
      "data-inset": e.inset ? "" : void 0,
      class: y(oe)(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground",
        o.class
      )
    }), {
      default: L(() => [
        Z(s.$slots, "default"),
        F(y(Ua), { class: "ml-auto size-4" })
      ]),
      _: 3
    }, 16, ["data-inset", "class"]));
  }
}), k6 = /* @__PURE__ */ V({
  __name: "DropdownMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const a = Te(e);
    return (r, s) => (t(), T(y(Yn), re({ "data-slot": "dropdown-menu-trigger" }, y(a)), {
      default: L(() => [
        Z(r.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), $6 = /* @__PURE__ */ V({
  __name: "Avatar",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(Jn), {
      "data-slot": "avatar",
      class: z(y(oe)("relative flex size-8 shrink-0 overflow-hidden rounded-full", o.class))
    }, {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), w6 = /* @__PURE__ */ V({
  __name: "AvatarFallback",
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(Qn), re({ "data-slot": "avatar-fallback" }, y(a), {
      class: y(oe)("bg-muted flex size-full items-center justify-center rounded-full", o.class)
    }), {
      default: L(() => [
        Z(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), C6 = /* @__PURE__ */ V({
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
    return (a, r) => (t(), T(y(Xn), re({ "data-slot": "avatar-image" }, o, { class: "aspect-square size-full" }), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), M6 = /* @__PURE__ */ V({
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
      Z(a.$slots, "default")
    ], 2));
  }
}), S6 = /* @__PURE__ */ V({
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
      class: z(y(oe)("flex size-9 items-center justify-center", o.class))
    }, [
      Z(a.$slots, "default", {}, () => [
        F(y(vl), { class: "size-4" })
      ]),
      r[0] || (r[0] = l("span", { class: "sr-only" }, "More", -1))
    ], 2));
  }
}), B6 = /* @__PURE__ */ V({
  __name: "BreadcrumbItem",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("li", {
      "data-slot": "breadcrumb-item",
      class: z(y(oe)("inline-flex items-center gap-1.5", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), A6 = /* @__PURE__ */ V({
  __name: "BreadcrumbLink",
  props: {
    asChild: { type: Boolean },
    as: { default: "a" },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(rt), {
      "data-slot": "breadcrumb-link",
      as: e.as,
      "as-child": e.asChild,
      class: z(y(oe)("hover:text-foreground transition-colors", o.class))
    }, {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["as", "as-child", "class"]));
  }
}), z6 = /* @__PURE__ */ V({
  __name: "BreadcrumbList",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("ol", {
      "data-slot": "breadcrumb-list",
      class: z(
        y(oe)(
          "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
          o.class
        )
      )
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), P6 = /* @__PURE__ */ V({
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
      class: z(y(oe)("text-foreground font-normal", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), _6 = /* @__PURE__ */ V({
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
      class: z(y(oe)("[&>svg]:size-3.5", o.class))
    }, [
      Z(a.$slots, "default", {}, () => [
        F(y(Ua))
      ])
    ], 2));
  }
}), lp = { class: "absolute top-full left-0 isolate z-50 flex justify-center" }, op = /* @__PURE__ */ V({
  __name: "NavigationMenuViewport",
  props: {
    forceMount: { type: Boolean },
    align: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class"), r = Te(a);
    return (s, i) => (t(), n("div", lp, [
      F(y(el), re({ "data-slot": "navigation-menu-viewport" }, y(r), {
        class: y(oe)(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--reka-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--reka-navigation-menu-viewport-width)] left-[var(--reka-navigation-menu-viewport-left)]",
          o.class
        )
      }), null, 16, ["class"])
    ]));
  }
}), V6 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class", "viewport"), i = we(s, r);
    return (d, u) => (t(), T(y(tl), re({
      "data-slot": "navigation-menu",
      "data-viewport": e.viewport
    }, y(i), {
      class: y(oe)(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        a.class
      )
    }), {
      default: L((c) => [
        Z(d.$slots, "default", De(Ke(c))),
        e.viewport ? (t(), T(op, { key: 0 })) : b("", !0)
      ]),
      _: 3
    }, 16, ["data-viewport", "class"]));
  }
}), L6 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(al), re({ "data-slot": "navigation-menu-content" }, y(i), {
      class: y(oe)(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        a.class
      )
    }), {
      default: L(() => [
        Z(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), O6 = /* @__PURE__ */ V({
  __name: "NavigationMenuIndicator",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class"), r = Te(a);
    return (s, i) => (t(), T(y(nl), re({ "data-slot": "navigation-menu-indicator" }, y(r), {
      class: y(oe)(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        o.class
      )
    }), {
      default: L(() => [...i[0] || (i[0] = [
        l("div", { class: "bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" }, null, -1)
      ])]),
      _: 1
    }, 16, ["class"]));
  }
}), j6 = /* @__PURE__ */ V({
  __name: "NavigationMenuItem",
  props: {
    value: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(ll), re({ "data-slot": "navigation-menu-item" }, y(a), {
      class: y(oe)("relative", o.class)
    }), {
      default: L(() => [
        Z(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), D6 = /* @__PURE__ */ V({
  __name: "NavigationMenuLink",
  props: {
    active: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["select"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(ol), re({ "data-slot": "navigation-menu-link" }, y(i), {
      class: y(oe)(
        "data-active:focus:bg-accent data-active:hover:bg-accent data-active:bg-accent/50 data-active:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        a.class
      )
    }), {
      default: L(() => [
        Z(d.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), T6 = /* @__PURE__ */ V({
  __name: "NavigationMenuList",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class"), r = Te(a);
    return (s, i) => (t(), T(y(sl), re({ "data-slot": "navigation-menu-list" }, y(r), {
      class: y(oe)("group flex flex-1 list-none items-center justify-center gap-1", o.class)
    }), {
      default: L(() => [
        Z(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), I6 = /* @__PURE__ */ V({
  __name: "NavigationMenuTrigger",
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class"), r = Te(a);
    return (s, i) => (t(), T(y(rl), re({ "data-slot": "navigation-menu-trigger" }, y(r), {
      class: y(oe)(y(sp)(), "group", o.class)
    }), {
      default: L(() => [
        Z(s.$slots, "default"),
        F(y(gl), {
          class: "relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        })
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), sp = da(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
), E6 = /* @__PURE__ */ V({
  __name: "Dialog",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean },
    unmountOnHide: { type: Boolean }
  },
  emits: ["update:open"],
  setup(e, { emit: o }) {
    const s = we(e, o);
    return (i, d) => (t(), T(y(Ta), re({ "data-slot": "dialog" }, y(s)), {
      default: L((u) => [
        Z(i.$slots, "default", De(Ke(u)))
      ]),
      _: 3
    }, 16));
  }
}), F6 = /* @__PURE__ */ V({
  __name: "DialogClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(st), re({ "data-slot": "dialog-close" }, o), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), rp = /* @__PURE__ */ V({
  __name: "DialogOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(oa), re({ "data-slot": "dialog-overlay" }, y(a), {
      class: y(oe)(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        o.class
      )
    }), {
      default: L(() => [
        Z(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), N6 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(sa), null, {
      default: L(() => [
        F(rp),
        F(y(ra), re({ "data-slot": "dialog-content" }, { ...d.$attrs, ...y(i) }, {
          class: y(oe)(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            a.class
          )
        }), {
          default: L(() => [
            Z(d.$slots, "default"),
            e.showCloseButton ? (t(), T(y(st), {
              key: 0,
              "data-slot": "dialog-close",
              class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            }, {
              default: L(() => [
                F(y(ia)),
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
}), R6 = /* @__PURE__ */ V({
  __name: "DialogDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class"), r = Te(a);
    return (s, i) => (t(), T(y(Ia), re({ "data-slot": "dialog-description" }, y(r), {
      class: y(oe)("text-sm text-muted-foreground font-normal", o.class)
    }), {
      default: L(() => [
        Z(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), H6 = /* @__PURE__ */ V({
  __name: "DialogFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    showCloseButton: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "dialog-footer",
      class: z(y(oe)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", o.class))
    }, [
      Z(a.$slots, "default"),
      e.showCloseButton ? (t(), T(y(st), {
        key: 0,
        "as-child": ""
      }, {
        default: L(() => [
          F(ue, { variant: "outline" }, {
            default: L(() => [...r[0] || (r[0] = [
              q(" Close ", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : b("", !0)
    ], 2));
  }
}), U6 = /* @__PURE__ */ V({
  __name: "DialogHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "dialog-header",
      class: z(y(oe)("flex flex-col gap-2 text-center sm:text-left", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), K6 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = ye(a, "class"), i = we(s, r);
    return (d, u) => (t(), T(y(sa), null, {
      default: L(() => [
        F(y(oa), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
          default: L(() => [
            F(y(ra), re({
              class: y(oe)(
                "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                a.class
              )
            }, { ...d.$attrs, ...y(i) }, {
              onPointerDownOutside: u[0] || (u[0] = (c) => {
                const v = c.detail.originalEvent, p = v.target;
                (v.offsetX > p.clientWidth || v.offsetY > p.clientHeight) && c.preventDefault();
              })
            }), {
              default: L(() => [
                Z(d.$slots, "default"),
                F(y(st), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                  default: L(() => [
                    F(y(ia), { class: "w-4 h-4" }),
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
}), q6 = /* @__PURE__ */ V({
  __name: "DialogTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class"), r = Te(a);
    return (s, i) => (t(), T(y(Ea), re({ "data-slot": "dialog-title" }, y(r), {
      class: y(oe)("text-lg leading-none font-semibold", o.class)
    }), {
      default: L(() => [
        Z(s.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), G6 = /* @__PURE__ */ V({
  __name: "DialogTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(Fa), re({ "data-slot": "dialog-trigger" }, o), {
      default: L(() => [
        Z(a.$slots, "default")
      ]),
      _: 3
    }, 16));
  }
}), W6 = /* @__PURE__ */ V({
  __name: "Label",
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e, a = ye(o, "class");
    return (r, s) => (t(), T(y(il), re({ "data-slot": "label" }, y(a), {
      class: y(oe)(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        o.class
      )
    }), {
      default: L(() => [
        Z(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["class"]));
  }
}), Z6 = /* @__PURE__ */ V({
  __name: "Spinner",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), T(y(hl), {
      role: "status",
      "aria-label": "Loading",
      class: z(y(oe)("size-4 animate-spin", o.class))
    }, null, 8, ["class"]));
  }
}), Y6 = /* @__PURE__ */ V({
  __name: "Card",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card",
      class: z(
        y(oe)(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
          o.class
        )
      )
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), J6 = /* @__PURE__ */ V({
  __name: "CardAction",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-action",
      class: z(y(oe)("col-start-2 row-span-2 row-start-1 self-start justify-self-end", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), Q6 = /* @__PURE__ */ V({
  __name: "CardContent",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-content",
      class: z(y(oe)("px-6", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), X6 = /* @__PURE__ */ V({
  __name: "CardDescription",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("p", {
      "data-slot": "card-description",
      class: z(y(oe)("text-sm text-muted-foreground font-normal", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), eM = /* @__PURE__ */ V({
  __name: "CardFooter",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-footer",
      class: z(y(oe)("flex items-center px-6 [.border-t]:pt-6", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), tM = /* @__PURE__ */ V({
  __name: "CardHeader",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("div", {
      "data-slot": "card-header",
      class: z(
        y(oe)(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
          o.class
        )
      )
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), aM = /* @__PURE__ */ V({
  __name: "CardTitle",
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(e) {
    const o = e;
    return (a, r) => (t(), n("h3", {
      "data-slot": "card-title",
      class: z(y(oe)("leading-none font-semibold", o.class))
    }, [
      Z(a.$slots, "default")
    ], 2));
  }
}), ip = {
  key: 0,
  class: "border-destructive/30 bg-destructive/5 rounded-lg border border-dashed p-4"
}, dp = { class: "flex items-start gap-3" }, up = { class: "min-w-0 flex-1" }, cp = { class: "text-foreground text-sm font-medium" }, fp = {
  key: 0,
  class: "text-muted-foreground mt-0.5 truncate text-xs"
}, nM = /* @__PURE__ */ V({
  __name: "PkBoundary",
  props: {
    label: { default: "This section" },
    silent: { type: Boolean, default: !1 },
    fill: { type: Boolean, default: !1 }
  },
  emits: ["error"],
  setup(e, { expose: o, emit: a }) {
    const r = e, s = a, i = K(!1), d = K(null), u = K(0);
    kn((v) => (console.error(`[PkBoundary] ${r.label} failed to render`, v), i.value = !0, d.value = v instanceof Error ? v.message : null, s("error", v), !1));
    function c() {
      i.value = !1, d.value = null, u.value++;
    }
    return o({ retry: c }), (v, p) => (t(), n("div", {
      class: z(e.fill ? "h-full [&>*:only-child]:h-full" : void 0)
    }, [
      i.value && !e.silent ? (t(), n("div", ip, [
        l("div", dp, [
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
          l("div", up, [
            l("p", cp, f(e.label) + " could not be displayed ", 1),
            d.value ? (t(), n("p", fp, f(d.value), 1)) : b("", !0),
            l("button", {
              type: "button",
              class: "text-foreground hover:bg-accent mt-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors",
              onClick: c
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
              q(" Try again ", -1)
            ])])
          ])
        ])
      ])) : i.value ? b("", !0) : Z(v.$slots, "default", { key: u.value })
    ], 2));
  }
}), mp = { class: "pk-surface rounded-lg" }, pp = {
  key: 0,
  class: "flex items-start justify-between gap-4 border-b px-4 py-3"
}, vp = { class: "min-w-0" }, gp = {
  key: 0,
  class: "truncate text-sm font-medium"
}, hp = {
  key: 1,
  class: "text-muted-foreground mt-0.5 text-sm"
}, bp = {
  key: 0,
  class: "flex shrink-0 items-center gap-2"
}, yp = {
  key: 1,
  class: "flex items-center gap-2 border-t px-4 py-3"
}, lM = /* @__PURE__ */ V({
  __name: "PkCard",
  props: {
    title: {},
    description: {},
    padded: { type: Boolean, default: !0 }
  },
  setup(e) {
    return (o, a) => (t(), n("section", mp, [
      e.title || e.description || o.$slots.header || o.$slots.actions ? (t(), n("header", pp, [
        l("div", vp, [
          Z(o.$slots, "header", {}, () => [
            e.title ? (t(), n("h2", gp, f(e.title), 1)) : b("", !0),
            e.description ? (t(), n("p", hp, f(e.description), 1)) : b("", !0)
          ])
        ]),
        o.$slots.actions ? (t(), n("div", bp, [
          Z(o.$slots, "actions")
        ])) : b("", !0)
      ])) : b("", !0),
      l("div", {
        class: z(e.padded ? "p-4" : "")
      }, [
        Z(o.$slots, "default")
      ], 2),
      o.$slots.footer ? (t(), n("footer", yp, [
        Z(o.$slots, "footer")
      ])) : b("", !0)
    ]));
  }
}), dn = /* @__PURE__ */ Symbol("pkPageFooterFromShell");
function oM() {
  const e = la(), o = h(() => e.props.panel?.pageFooter === !0);
  return qt(dn, o), o;
}
const xp = {
  key: 0,
  "data-slot": "app-footer",
  class: "mt-auto shrink-0 border-t bg-background px-4 py-3 text-sm text-muted-foreground sm:px-6"
}, kp = { class: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" }, $p = {
  key: 0,
  class: "flex flex-wrap gap-x-4 gap-y-1",
  "aria-label": "Footer"
}, sM = /* @__PURE__ */ V({
  __name: "AppPageFooter",
  props: {
    host: { type: Boolean }
  },
  setup(e) {
    const o = e, a = la(), r = (/* @__PURE__ */ new Date()).getFullYear(), s = h(() => a.props.panel?.brand || a.props.panelBrand || a.props.name || "Panel"), i = h(() => {
      const c = a.props.panel;
      return Array.isArray(c?.footerLinks) ? c.footerLinks : [];
    }), d = At(
      dn,
      h(() => !1)
    ), u = h(() => !o.host && y(d) === !0);
    return (c, v) => u.value ? b("", !0) : (t(), n("footer", xp, [
      l("div", kp, [
        l("p", null, "© " + f(y(r)) + " " + f(s.value), 1),
        i.value.length ? (t(), n("nav", $p, [
          (t(!0), n(P, null, O(i.value, (p) => (t(), T(y(Gt), {
            key: p.href,
            href: p.href,
            class: "hover:text-foreground"
          }, {
            default: L(() => [
              q(f(p.label), 1)
            ]),
            _: 2
          }, 1032, ["href"]))), 128))
        ])) : b("", !0)
      ])
    ]));
  }
}), wp = { class: "flex shrink-0 flex-col items-center" }, Cp = {
  key: 0,
  class: "absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-neutral-800 dark:bg-neutral-700",
  "aria-hidden": "true"
}, rM = /* @__PURE__ */ V({
  __name: "PkDeviceFrame",
  props: {
    width: { default: 390 },
    height: { default: 844 },
    notch: { type: Boolean, default: !0 },
    kind: { default: "phone" }
  },
  setup(e) {
    const o = e, a = h(() => o.kind === "laptop"), r = h(
      () => a.value ? "rounded-lg border-[6px] border-neutral-800 bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-700" : "rounded-[2.5rem] border-[10px] border-neutral-800 bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-700"
    ), s = h(() => a.value ? "rounded-sm" : "rounded-[2rem]");
    return (i, d) => (t(), n("div", wp, [
      l("div", {
        class: z(["relative box-content shadow-2xl", r.value]),
        style: ie({ width: `${e.width}px`, height: `${e.height}px` })
      }, [
        e.notch && !a.value ? (t(), n("div", Cp)) : b("", !0),
        l("div", {
          class: z(["size-full overflow-hidden bg-white", s.value])
        }, [
          Z(i.$slots, "default")
        ], 2)
      ], 6),
      a.value ? (t(), n(P, { key: 0 }, [
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
}), Mp = { class: "flex flex-col gap-6 text-center sm:text-left" }, Sp = { class: "text-foreground text-xl font-semibold" }, Bp = {
  key: 0,
  class: "flex flex-col gap-2"
}, Ap = { class: "text-foreground font-medium" }, zp = {
  key: 0,
  class: "text-muted-foreground"
}, Pp = {
  key: 1,
  class: "flex flex-col gap-2"
}, _p = { class: "flex flex-col gap-1" }, Vp = {
  key: 2,
  class: "flex flex-wrap justify-center gap-2 sm:justify-start"
}, iM = /* @__PURE__ */ V({
  __name: "PkSetupWizardCompletion",
  props: {
    heading: {},
    summary: { default: () => [] },
    nextSteps: { default: () => [] },
    actions: { default: () => [] },
    linkComponent: { default: "a" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", Mp, [
      l("h1", Sp, f(e.heading), 1),
      e.summary.length ? (t(), n("ul", Bp, [
        (t(!0), n(P, null, O(e.summary, (r, s) => (t(), n("li", {
          key: s,
          class: "flex items-baseline gap-2 text-sm"
        }, [
          l("span", Ap, f(r.label), 1),
          r.detail ? (t(), n("span", zp, "– " + f(r.detail), 1)) : b("", !0)
        ]))), 128))
      ])) : b("", !0),
      e.nextSteps.length ? (t(), n("div", Pp, [
        a[0] || (a[0] = l("p", { class: "text-foreground text-sm font-medium" }, "Next steps", -1)),
        l("ul", _p, [
          (t(!0), n(P, null, O(e.nextSteps, (r, s) => (t(), n("li", { key: s }, [
            (t(), T(ze(e.linkComponent), {
              href: r.href,
              class: "text-primary text-sm hover:underline"
            }, {
              default: L(() => [
                q(f(r.label), 1)
              ]),
              _: 2
            }, 1032, ["href"]))
          ]))), 128))
        ])
      ])) : b("", !0),
      e.actions.length ? (t(), n("div", Vp, [
        (t(!0), n(P, null, O(e.actions, (r, s) => (t(), T(ze(e.linkComponent), {
          key: s,
          href: r.href,
          class: z(y(at)({ variant: r.primary ? "default" : "outline" }))
        }, {
          default: L(() => [
            q(f(r.label), 1)
          ]),
          _: 2
        }, 1032, ["href", "class"]))), 128))
      ])) : b("", !0)
    ]));
  }
}), Lp = {
  key: 0,
  class: "flex justify-end"
}, Op = {
  key: 1,
  class: "flex flex-col gap-2"
}, jp = ["onDrop"], Dp = ["aria-label", "onDragstart"], Tp = ["onClick"], Ip = { class: "font-medium" }, Ep = {
  key: 0,
  class: "text-muted-foreground ml-2 truncate"
}, Fp = {
  key: 2,
  class: "min-w-0 flex-1"
}, Np = {
  key: 1,
  class: "grid grid-cols-1 gap-3 sm:grid-cols-2"
}, Rp = ["aria-label", "onClick"], Hp = ["disabled", "aria-label", "onClick"], Up = ["disabled", "aria-label", "onClick"], Kp = ["disabled", "title", "aria-label", "onClick"], qp = ["disabled", "title", "aria-label", "onClick"], Gp = {
  key: 0,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, Wp = ["disabled"], Zp = {
  key: 2,
  class: "flex flex-col gap-2"
}, Yp = {
  key: 0,
  class: "overflow-x-auto rounded-md border"
}, Jp = { class: "w-full text-sm" }, Qp = { class: "bg-muted/40" }, Xp = {
  key: 0,
  class: "w-8 border-b px-2 py-1.5"
}, ev = {
  key: 0,
  class: "text-destructive",
  "aria-hidden": "true"
}, tv = ["onDrop"], av = {
  key: 0,
  class: "px-2 py-1.5 align-top"
}, nv = ["aria-label", "onDragstart"], lv = { class: "px-2 py-1.5 align-top" }, ov = { class: "mt-0.5 flex items-center gap-0.5" }, sv = ["disabled", "aria-label", "onClick"], rv = ["disabled", "aria-label", "onClick"], iv = ["disabled", "title", "aria-label", "onClick"], dv = ["disabled", "title", "aria-label", "onClick"], uv = {
  key: 1,
  class: "text-muted-foreground rounded-md border border-dashed px-3 py-4 text-xs"
}, cv = ["disabled"], dM = /* @__PURE__ */ V({
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
    function d(G) {
      return Array.isArray(G) ? G.map((R) => ({ uid: s++, data: { ...R } })) : [];
    }
    ge(
      () => a.modelValue,
      (G) => {
        JSON.stringify(G ?? null) !== JSON.stringify(u()) && (i.value = d(G));
      }
    );
    function u() {
      const G = [];
      for (const R of i.value) {
        const H = {};
        let ae = !1;
        a.relationship && R.data._id !== void 0 && (H._id = R.data._id);
        for (const _ of a.children) {
          const ee = R.data[_.key] ?? null;
          H[_.key] = ee, ee !== null && ee !== "" && !(Array.isArray(ee) && ee.length === 0) && (ae = !0);
        }
        ae && G.push(H);
      }
      return G.length ? G : null;
    }
    function c() {
      r("update:modelValue", u());
    }
    const v = h(() => a.maxItems !== null && i.value.length >= a.maxItems), p = h(() => a.minItems !== null && i.value.length <= a.minItems), x = h(() => a.children.length === 1);
    function M() {
      if (v.value || a.disabled || !a.addable)
        return;
      const G = {};
      for (const R of a.children)
        G[R.key] = null;
      i.value.push({ uid: s++, data: G });
    }
    function $(G) {
      i.value = i.value.filter((R) => R.uid !== G), c();
    }
    function C(G) {
      if (v.value || a.disabled || !a.cloneable)
        return;
      const R = i.value.findIndex((ee) => ee.uid === G);
      if (R < 0)
        return;
      const H = i.value[R], ae = {};
      for (const ee of a.children) {
        const D = H.data[ee.key];
        ae[ee.key] = Array.isArray(D) ? [...D] : D;
      }
      const _ = [...i.value];
      _.splice(R + 1, 0, { uid: s++, data: ae }), i.value = _, c();
    }
    function k(G, R) {
      const H = G + R;
      if (H < 0 || H >= i.value.length)
        return;
      const ae = [...i.value], [_] = ae.splice(G, 1);
      ae.splice(H, 0, _), i.value = ae, c();
    }
    function B(G, R, H) {
      const ae = i.value.find((_) => _.uid === G);
      ae && (ae.data[R] = H, c());
    }
    function A(G, R) {
      return a.errors[`${a.fieldKey}.${G}.${R}`];
    }
    const w = K(/* @__PURE__ */ new Set());
    function m(G) {
      return a.collapsible && w.value.has(G);
    }
    function g(G) {
      const R = new Set(w.value);
      R.has(G) ? R.delete(G) : R.add(G), w.value = R;
    }
    const S = h(
      () => i.value.length > 0 && i.value.every((G) => w.value.has(G.uid))
    );
    function I() {
      w.value = S.value ? /* @__PURE__ */ new Set() : new Set(i.value.map((G) => G.uid));
    }
    function j(G) {
      const R = a.children[0];
      if (!R)
        return "";
      const H = G.data[R.key];
      if (typeof H != "string" && typeof H != "number")
        return "";
      const ae = String(H).trim();
      return ae === "" || ae.length > 60 ? "" : ae;
    }
    const X = K(null);
    function W(G, R) {
      if (a.disabled) {
        R.preventDefault();
        return;
      }
      X.value = G, R.dataTransfer?.setData("text/plain", String(G)), R.dataTransfer && (R.dataTransfer.effectAllowed = "move");
    }
    function Q() {
      X.value = null;
    }
    function Y(G, R) {
      R.preventDefault();
      const H = X.value;
      if (X.value = null, a.disabled || H === null || H === G)
        return;
      const ae = [...i.value], _ = ae.findIndex((E) => E.uid === H), ee = ae.findIndex((E) => E.uid === G);
      if (_ < 0 || ee < 0)
        return;
      const [D] = ae.splice(_, 1);
      ae.splice(ee, 0, D), i.value = ae, c();
    }
    return (G, R) => (t(), n(P, null, [
      !e.table && e.collapsible && i.value.length > 1 ? (t(), n("div", Lp, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-xs font-medium",
          onClick: I
        }, f(S.value ? "Expand all" : "Collapse all"), 1)
      ])) : b("", !0),
      e.table ? (t(), n("div", Zp, [
        i.value.length ? (t(), n("div", Yp, [
          l("table", Jp, [
            l("thead", null, [
              l("tr", Qp, [
                e.disabled ? b("", !0) : (t(), n("th", Xp, [...R[9] || (R[9] = [
                  l("span", { class: "sr-only" }, "Reorder", -1)
                ])])),
                (t(!0), n(P, null, O(e.children, (H) => (t(), n("th", {
                  key: H.key,
                  class: "text-muted-foreground border-b px-2 py-1.5 text-left text-xs font-medium"
                }, [
                  q(f(H.label) + " ", 1),
                  H.required ? (t(), n("span", ev, "*")) : b("", !0)
                ]))), 128)),
                R[10] || (R[10] = l("th", { class: "border-b px-2 py-1.5" }, [
                  l("span", { class: "sr-only" }, "Row actions")
                ], -1))
              ])
            ]),
            l("tbody", null, [
              (t(!0), n(P, null, O(i.value, (H, ae) => (t(), n("tr", {
                key: H.uid,
                class: z(["border-b last:border-b-0", X.value === H.uid ? "opacity-40" : ""]),
                onDragover: R[1] || (R[1] = be(() => {
                }, ["prevent"])),
                onDrop: (_) => Y(H.uid, _)
              }, [
                e.disabled ? b("", !0) : (t(), n("td", av, [
                  l("button", {
                    type: "button",
                    class: "text-muted-foreground/60 hover:text-muted-foreground mt-0.5 flex size-6 cursor-grab items-center justify-center active:cursor-grabbing",
                    draggable: "true",
                    "aria-label": `Drag to reorder ${e.itemLabel} ${ae + 1}`,
                    onDragstart: (_) => W(H.uid, _),
                    onDragend: Q
                  }, [...R[11] || (R[11] = [
                    vt('<svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.4"></circle><circle cx="15" cy="6" r="1.4"></circle><circle cx="9" cy="12" r="1.4"></circle><circle cx="15" cy="12" r="1.4"></circle><circle cx="9" cy="18" r="1.4"></circle><circle cx="15" cy="18" r="1.4"></circle></svg>', 1)
                  ])], 40, nv)
                ])),
                (t(!0), n(P, null, O(e.children, (_) => (t(), n("td", {
                  key: _.key,
                  class: "min-w-[8rem] px-2 py-1.5 align-top"
                }, [
                  F(Qe, {
                    field: {
                      ..._,
                      disabled: _.disabled || e.disabled,
                      labelHidden: !0
                    },
                    value: H.data[_.key],
                    error: A(ae, _.key),
                    options: e.childOptions[_.key] ?? [],
                    onChange: (ee) => B(H.uid, _.key, ee)
                  }, null, 8, ["field", "value", "error", "options", "onChange"])
                ]))), 128)),
                l("td", lv, [
                  l("div", ov, [
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || ae === 0,
                      "aria-label": `Move ${e.itemLabel} ${ae + 1} up`,
                      onClick: (_) => k(ae, -1)
                    }, [...R[12] || (R[12] = [
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
                    ])], 8, sv),
                    l("button", {
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || ae === i.value.length - 1,
                      "aria-label": `Move ${e.itemLabel} ${ae + 1} down`,
                      onClick: (_) => k(ae, 1)
                    }, [...R[13] || (R[13] = [
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
                    ])], 8, rv),
                    e.cloneable ? (t(), n("button", {
                      key: 0,
                      type: "button",
                      class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || v.value,
                      title: v.value ? `At most ${e.maxItems} allowed` : void 0,
                      "aria-label": `Duplicate ${e.itemLabel} ${ae + 1}`,
                      onClick: (_) => C(H.uid)
                    }, [...R[14] || (R[14] = [
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
                    ])], 8, iv)) : b("", !0),
                    e.deletable ? (t(), n("button", {
                      key: 1,
                      type: "button",
                      class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
                      disabled: e.disabled || p.value,
                      title: p.value ? `At least ${e.minItems} required` : void 0,
                      "aria-label": `Remove ${e.itemLabel} ${ae + 1}`,
                      onClick: (_) => $(H.uid)
                    }, [...R[15] || (R[15] = [
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
                    ])], 8, dv)) : b("", !0)
                  ])
                ])
              ], 42, tv))), 128))
            ])
          ])
        ])) : (t(), n("p", uv, " No " + f(e.itemLabel.toLowerCase()) + "s yet. ", 1)),
        !v.value && e.addable ? (t(), n("button", {
          key: 2,
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled,
          onClick: M
        }, [
          R[16] || (R[16] = l("svg", {
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
          q(" Add " + f(e.itemLabel.toLowerCase()), 1)
        ], 8, cv)) : b("", !0)
      ])) : (t(), n("div", Op, [
        (t(!0), n(P, null, O(i.value, (H, ae) => (t(), n("div", {
          key: H.uid,
          class: z(["flex items-start gap-2", X.value === H.uid ? "opacity-40" : ""]),
          onDragover: R[0] || (R[0] = be(() => {
          }, ["prevent"])),
          onDrop: (_) => Y(H.uid, _)
        }, [
          e.disabled ? b("", !0) : (t(), n("button", {
            key: 0,
            type: "button",
            class: z(["text-muted-foreground/60 hover:text-muted-foreground flex size-6 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing", x.value ? "mt-1.5" : "mt-0.5"]),
            draggable: "true",
            "aria-label": `Drag to reorder ${e.itemLabel} ${ae + 1}`,
            onDragstart: (_) => W(H.uid, _),
            onDragend: Q
          }, [...R[2] || (R[2] = [
            vt('<svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.4"></circle><circle cx="15" cy="6" r="1.4"></circle><circle cx="9" cy="12" r="1.4"></circle><circle cx="15" cy="12" r="1.4"></circle><circle cx="9" cy="18" r="1.4"></circle><circle cx="15" cy="18" r="1.4"></circle></svg>', 1)
          ])], 42, Dp)),
          l("span", {
            class: z(["bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums", x.value ? "mt-1.5" : "mt-0.5"]),
            "aria-hidden": "true"
          }, f(ae + 1), 3),
          m(H.uid) ? (t(), n("button", {
            key: 1,
            type: "button",
            class: "hover:bg-accent min-w-0 flex-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
            onClick: (_) => g(H.uid)
          }, [
            l("span", Ip, f(e.itemLabel) + " " + f(ae + 1), 1),
            j(H) ? (t(), n("span", Ep, f(j(H)), 1)) : b("", !0)
          ], 8, Tp)) : (t(), n("div", Fp, [
            x.value ? (t(), T(Qe, {
              key: 0,
              field: {
                ...e.children[0],
                disabled: e.children[0].disabled || e.disabled,
                labelHidden: !0
              },
              value: H.data[e.children[0].key],
              error: A(ae, e.children[0].key),
              options: e.childOptions[e.children[0].key] ?? [],
              onChange: (_) => B(H.uid, e.children[0].key, _)
            }, null, 8, ["field", "value", "error", "options", "onChange"])) : (t(), n("div", Np, [
              (t(!0), n(P, null, O(e.children, (_) => (t(), T(Qe, {
                key: _.key,
                field: { ..._, disabled: _.disabled || e.disabled },
                value: H.data[_.key],
                error: A(ae, _.key),
                options: e.childOptions[_.key] ?? [],
                onChange: (ee) => B(H.uid, _.key, ee)
              }, null, 8, ["field", "value", "error", "options", "onChange"]))), 128))
            ]))
          ])),
          l("div", {
            class: z(["flex shrink-0 items-center gap-0.5", x.value ? "mt-1" : "mt-0"])
          }, [
            e.collapsible ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors",
              "aria-label": m(H.uid) ? `Expand ${e.itemLabel} ${ae + 1}` : `Collapse ${e.itemLabel} ${ae + 1}`,
              onClick: (_) => g(H.uid)
            }, [
              (t(), n("svg", {
                class: z(["size-3.5 transition-transform", m(H.uid) ? "" : "rotate-180"]),
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [...R[3] || (R[3] = [
                l("path", { d: "m6 9 6 6 6-6" }, null, -1)
              ])], 2))
            ], 8, Rp)) : b("", !0),
            l("button", {
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || ae === 0,
              "aria-label": `Move ${e.itemLabel} ${ae + 1} up`,
              onClick: (_) => k(ae, -1)
            }, [...R[4] || (R[4] = [
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
            ])], 8, Hp),
            l("button", {
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || ae === i.value.length - 1,
              "aria-label": `Move ${e.itemLabel} ${ae + 1} down`,
              onClick: (_) => k(ae, 1)
            }, [...R[5] || (R[5] = [
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
            ])], 8, Up),
            e.cloneable ? (t(), n("button", {
              key: 1,
              type: "button",
              class: "text-muted-foreground hover:bg-accent hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || v.value,
              title: v.value ? `At most ${e.maxItems} allowed` : void 0,
              "aria-label": `Duplicate ${e.itemLabel} ${ae + 1}`,
              onClick: (_) => C(H.uid)
            }, [...R[6] || (R[6] = [
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
            ])], 8, Kp)) : b("", !0),
            e.deletable ? (t(), n("button", {
              key: 2,
              type: "button",
              class: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive inline-flex size-7 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30",
              disabled: e.disabled || p.value,
              title: p.value ? `At least ${e.minItems} required` : void 0,
              "aria-label": `Remove ${e.itemLabel} ${ae + 1}`,
              onClick: (_) => $(H.uid)
            }, [...R[7] || (R[7] = [
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
            ])], 8, qp)) : b("", !0)
          ], 2)
        ], 42, jp))), 128)),
        i.value.length === 0 ? (t(), n("p", Gp, " No " + f(e.itemLabel.toLowerCase()) + "s yet. ", 1)) : b("", !0),
        !v.value && e.addable ? (t(), n("button", {
          key: 1,
          type: "button",
          class: "text-foreground hover:bg-accent inline-flex w-fit items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
          disabled: e.disabled,
          onClick: M
        }, [
          R[8] || (R[8] = l("svg", {
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
          q(" Add " + f(e.itemLabel.toLowerCase()), 1)
        ], 8, Wp)) : b("", !0)
      ]))
    ], 64));
  }
}), fv = { class: "space-y-1" }, mv = { class: "flex items-center gap-1" }, pv = ["disabled", "title", "aria-label", "onClick"], vv = ["aria-pressed"], gv = ["id", "value", "rows", "disabled"], hv = ["innerHTML"], bv = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(!1), i = h(() => a.modelValue ?? "");
    function d(x) {
      return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    const u = h(
      () => d(i.value).replace(/^### (.*)$/gm, '<h3 class="font-semibold">$1</h3>').replace(/^## (.*)$/gm, '<h2 class="font-semibold text-lg">$1</h2>').replace(/^# (.*)$/gm, '<h1 class="font-semibold text-xl">$1</h1>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*]+?)\*/g, "$1<em>$2</em>").replace(/`([^`]+?)`/g, '<code class="bg-muted rounded px-1">$1</code>').replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" class="underline">$1</a>').replace(/^[-*] (.*)$/gm, '<li class="ml-4 list-disc">$1</li>').replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>")
    );
    function c(x, M = x) {
      const $ = document.getElementById(a.id ?? "");
      if ($ === null)
        return;
      const C = $.selectionStart, k = $.selectionEnd, B = i.value.slice(C, k);
      r(
        "update:modelValue",
        `${i.value.slice(0, C)}${x}${B}${M}${i.value.slice(k)}`
      );
    }
    const v = {
      bold: { label: "B", run: () => c("**") },
      italic: { label: "I", run: () => c("*") },
      code: { label: "</>", run: () => c("`") },
      heading: { label: "H", run: () => c("## ", "") },
      list: { label: "•", run: () => c("- ", "") },
      link: { label: "🔗", run: () => c("[", "](https://)") }
    }, p = h(
      () => (a.toolbar ?? Object.keys(v)).filter((x) => x in v)
    );
    return (x, M) => (t(), n("div", fv, [
      l("div", mv, [
        (t(!0), n(P, null, O(p.value, ($) => (t(), n("button", {
          key: $,
          type: "button",
          disabled: e.disabled,
          title: $,
          "aria-label": $,
          class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-50",
          onClick: (C) => v[$].run()
        }, f(v[$].label), 9, pv))), 128)),
        l("button", {
          type: "button",
          class: "hover:bg-accent ml-auto rounded border px-2 py-0.5 text-xs",
          "aria-pressed": s.value,
          onClick: M[0] || (M[0] = ($) => s.value = !s.value)
        }, " Preview ", 8, vv)
      ]),
      s.value ? (t(), n("div", {
        key: 1,
        class: "bg-card min-h-32 rounded-md border px-3 py-2 text-sm",
        innerHTML: u.value
      }, null, 8, hv)) : (t(), n("textarea", {
        key: 0,
        id: e.id,
        value: i.value,
        rows: e.rows,
        disabled: e.disabled,
        class: "bg-card w-full resize-y rounded-md border px-3 py-2 font-mono text-sm outline-none",
        onInput: M[1] || (M[1] = ($) => r("update:modelValue", $.target.value))
      }, null, 40, gv))
    ]));
  }
}), yv = { class: "space-y-1" }, xv = { class: "bg-card flex overflow-hidden rounded-md border font-mono text-xs" }, kv = {
  "aria-hidden": "true",
  class: "text-muted-foreground bg-muted/40 shrink-0 border-r px-2 py-2 text-right leading-5 select-none"
}, $v = ["id", "value", "rows", "disabled"], wv = { class: "text-muted-foreground text-xs font-normal" }, Cv = {
  key: 0,
  class: "text-destructive text-xs"
}, Mv = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(null), i = K(!0), d = h(() => a.modelValue ?? ""), u = h(() => Math.max(d.value.split(`
`).length, 1)), c = h(() => {
      if (a.language !== "json" || d.value.trim() === "")
        return null;
      try {
        return JSON.parse(d.value), null;
      } catch (x) {
        return x instanceof Error ? x.message : "Not valid JSON.";
      }
    });
    function v(x) {
      r("update:modelValue", x.target.value);
    }
    function p(x) {
      if (x.key === "Escape") {
        i.value = !1;
        return;
      }
      if (x.key !== "Tab" && (i.value = !0), x.key !== "Tab" || !i.value)
        return;
      x.preventDefault();
      const M = x.target, $ = M.selectionStart, C = M.selectionEnd, k = `${d.value.slice(0, $)}    ${d.value.slice(C)}`;
      r("update:modelValue", k), requestAnimationFrame(() => {
        M.selectionStart = M.selectionEnd = $ + 4;
      });
    }
    return (x, M) => (t(), n("div", yv, [
      l("div", xv, [
        l("div", kv, [
          (t(!0), n(P, null, O(u.value, ($) => (t(), n("div", { key: $ }, f($), 1))), 128))
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
        }, null, 40, $v)
      ]),
      l("p", wv, f(e.language === "plain" ? "Plain text" : e.language.toUpperCase()) + ". Tab indents; press Escape first to move focus out. ", 1),
      c.value ? (t(), n("p", Cv, f(c.value), 1)) : b("", !0)
    ]));
  }
}), Sv = { class: "space-y-3" }, Bv = { class: "flex items-center justify-between gap-2 border-b px-3 py-2" }, Av = { class: "text-sm font-medium" }, zv = { class: "flex items-center gap-1" }, Pv = ["disabled", "onClick"], _v = ["disabled", "onClick"], Vv = ["disabled", "onClick"], Lv = { class: "space-y-3 p-3" }, Ov = { class: "flex flex-wrap items-center gap-2" }, jv = ["disabled", "onClick"], Dv = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, uM = /* @__PURE__ */ V({
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
    const a = e, r = o, s = h(() => a.modelValue ?? []), i = h(
      () => Object.fromEntries(a.blocks.map((M) => [M.type, M]))
    ), d = h(() => a.maxBlocks !== null && s.value.length >= a.maxBlocks);
    function u(M) {
      r("update:modelValue", M);
    }
    function c(M) {
      d.value || u([...s.value, { type: M, data: {} }]);
    }
    function v(M) {
      u(s.value.filter(($, C) => C !== M));
    }
    function p(M, $) {
      const C = M + $;
      if (C < 0 || C >= s.value.length)
        return;
      const k = [...s.value], [B] = k.splice(M, 1);
      k.splice(C, 0, B), u(k);
    }
    function x(M, $, C) {
      u(
        s.value.map(
          (k, B) => B === M ? { ...k, data: { ...k.data, [$]: C } } : k
        )
      );
    }
    return (M, $) => (t(), n("div", Sv, [
      (t(!0), n(P, null, O(s.value, (C, k) => (t(), n("div", {
        key: `${C.type}-${k}`,
        class: "bg-card rounded-lg border"
      }, [
        l("div", Bv, [
          l("span", Av, f(i.value[C.type]?.label ?? C.type), 1),
          l("div", zv, [
            l("button", {
              type: "button",
              class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-40",
              disabled: e.disabled || k === 0,
              "aria-label": "Move up",
              onClick: (B) => p(k, -1)
            }, " ↑ ", 8, Pv),
            l("button", {
              type: "button",
              class: "hover:bg-accent rounded border px-2 py-0.5 text-xs disabled:opacity-40",
              disabled: e.disabled || k === s.value.length - 1,
              "aria-label": "Move down",
              onClick: (B) => p(k, 1)
            }, " ↓ ", 8, _v),
            l("button", {
              type: "button",
              class: "text-destructive hover:bg-accent rounded border px-2 py-0.5 text-xs",
              disabled: e.disabled,
              "aria-label": "Remove block",
              onClick: (B) => v(k)
            }, " Remove ", 8, Vv)
          ])
        ]),
        l("div", Lv, [
          (t(!0), n(P, null, O(i.value[C.type]?.fields ?? [], (B) => (t(), T(Qe, {
            key: B.key,
            field: B,
            value: C.data[B.key] ?? null,
            error: e.errors?.[B.key],
            processing: e.disabled,
            onChange: (A) => x(k, B.key, A)
          }, null, 8, ["field", "value", "error", "processing", "onChange"]))), 128))
        ])
      ]))), 128)),
      l("div", Ov, [
        (t(!0), n(P, null, O(e.blocks, (C) => (t(), n("button", {
          key: C.type,
          type: "button",
          class: "hover:bg-accent rounded-md border px-2.5 py-1 text-sm disabled:opacity-50",
          disabled: e.disabled || d.value,
          onClick: (k) => c(C.type)
        }, " + " + f(C.label), 9, jv))), 128)),
        d.value ? (t(), n("span", Dv, f(e.maxBlocks) + " is the maximum here. ", 1)) : b("", !0)
      ])
    ]));
  }
}), Tv = ["name", "value", "checked", "disabled", "onChange"], Iv = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Ev = /* @__PURE__ */ V({
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
      (t(!0), n(P, null, O(e.options, (u) => (t(), n("label", {
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
        }, null, 40, Tv),
        q(" " + f(u.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", Iv, " Nothing to choose from yet. ")) : b("", !0)
    ], 2));
  }
}), Fv = ["value", "checked", "disabled", "onChange"], Nv = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Rv = /* @__PURE__ */ V({
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
    const a = e, r = o, s = h(
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
    const u = h(
      () => a.field.columns && a.field.columns > 1 ? { gridTemplateColumns: `repeat(${a.field.columns}, minmax(0, 1fr))` } : void 0
    );
    return (c, v) => (t(), n("div", {
      class: "grid gap-x-4 gap-y-2",
      style: ie(u.value)
    }, [
      (t(!0), n(P, null, O(e.options, (p) => (t(), n("label", {
        key: String(p.value),
        class: z(["flex items-center gap-2 text-sm", e.disabled ? "opacity-50" : "cursor-pointer"])
      }, [
        l("input", {
          type: "checkbox",
          class: "text-primary focus-visible:ring-ring size-4 shrink-0 rounded border focus-visible:ring-2",
          value: p.value,
          checked: i(p),
          disabled: e.disabled,
          onChange: (x) => d(p)
        }, null, 40, Fv),
        q(" " + f(p.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", Nv, " Nothing to choose from yet. ")) : b("", !0)
    ], 4));
  }
}), Hv = { class: "flex flex-col gap-1.5" }, Uv = ["aria-label", "onClick"], Kv = ["placeholder", "disabled", "maxlength"], qv = {
  key: 0,
  class: "flex flex-wrap items-center gap-1.5"
}, Gv = ["onClick"], Wv = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal"
}, Zv = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkTagsInput",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(""), i = h(
      () => Array.isArray(a.modelValue) ? a.modelValue : []
    ), d = h(() => i.value.length >= (a.field.max ?? 25)), u = h(
      () => (a.field.suggestions ?? []).filter(
        (x) => !i.value.some((M) => M.toLowerCase() === x.toLowerCase())
      )
    );
    function c(x) {
      const M = x.trim().slice(0, a.field.maxLength ?? 40);
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
    function v(x) {
      r(
        "update:modelValue",
        i.value.filter((M, $) => $ !== x)
      );
    }
    function p(x) {
      if (x.key === "Enter" || x.key === ",") {
        x.preventDefault(), c(s.value);
        return;
      }
      x.key === "Backspace" && s.value === "" && i.value.length > 0 && v(i.value.length - 1);
    }
    return (x, M) => (t(), n("div", Hv, [
      l("div", {
        class: z(["border-input bg-background flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5", e.disabled ? "opacity-50" : ""])
      }, [
        (t(!0), n(P, null, O(i.value, ($, C) => (t(), n("span", {
          key: `${$}-${C}`,
          class: "bg-muted flex items-center gap-1 rounded px-2 py-0.5 text-xs"
        }, [
          q(f($) + " ", 1),
          e.disabled ? b("", !0) : (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground",
            "aria-label": `Remove ${$}`,
            onClick: (k) => v(C)
          }, " × ", 8, Uv))
        ]))), 128)),
        xe(l("input", {
          "onUpdate:modelValue": M[0] || (M[0] = ($) => s.value = $),
          type: "text",
          class: "min-w-24 flex-1 bg-transparent text-sm outline-none",
          placeholder: d.value ? "" : e.field.placeholder ?? "Add a tag…",
          disabled: e.disabled || d.value,
          maxlength: e.field.maxLength ?? 40,
          onKeydown: p,
          onBlur: M[1] || (M[1] = ($) => c(s.value))
        }, null, 40, Kv), [
          [Le, s.value]
        ])
      ], 2),
      u.value.length > 0 && !d.value && !e.disabled ? (t(), n("div", qv, [
        M[2] || (M[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "Suggestions:", -1)),
        (t(!0), n(P, null, O(u.value, ($) => (t(), n("button", {
          key: $,
          type: "button",
          class: "hover:bg-accent rounded border px-2 py-0.5 text-xs",
          onClick: (C) => c($)
        }, f($), 9, Gv))), 128))
      ])) : b("", !0),
      d.value ? (t(), n("p", Wv, " That is the maximum of " + f(e.field.max ?? 25) + " tags. ", 1)) : b("", !0)
    ]));
  }
}), Yv = 4.5, _a = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function un(e) {
  let o = e.replace("#", "");
  return o.length === 3 && (o = o[0] + o[0] + o[1] + o[1] + o[2] + o[2]), [parseInt(o.slice(0, 2), 16), parseInt(o.slice(2, 4), 16), parseInt(o.slice(4, 6), 16)];
}
function Ht(e) {
  const o = e / 255;
  return o <= 0.03928 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4;
}
function ta(e) {
  const [o, a, r] = un(e);
  return 0.2126 * Ht(o) + 0.7152 * Ht(a) + 0.0722 * Ht(r);
}
function cn(e, o) {
  const a = ta(e), r = ta(o);
  return (Math.max(a, r) + 0.05) / (Math.min(a, r) + 0.05);
}
function Jv(e, o, a) {
  if (!_a.test(e) || !_a.test(o))
    return e;
  const r = ta(o) > 0.5, s = r ? 0 : 255;
  let i = un(e);
  for (let d = 0; d <= 20; d++) {
    const u = Qv(i);
    if (cn(u, o) >= a)
      return u;
    i = i.map((c) => c + (s - c) * 0.15);
  }
  return r ? "#000000" : "#ffffff";
}
function Qv(e) {
  return "#" + e.map(
    (o) => Math.round(Math.max(0, Math.min(255, o))).toString(16).padStart(2, "0")
  ).join("");
}
const Xv = { class: "flex flex-col gap-2" }, e1 = { class: "flex items-center gap-2" }, t1 = {
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
}, a1 = ["value", "disabled", "aria-label"], n1 = ["value", "disabled", "placeholder"], l1 = {
  key: 0,
  class: "flex flex-wrap gap-1.5"
}, o1 = ["aria-label", "title", "onClick"], s1 = {
  key: 1,
  class: "text-amber-600 dark:text-amber-500 flex flex-wrap items-center gap-2 text-xs"
}, r1 = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkColourPicker",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, i = h(() => typeof a.modelValue == "string" ? a.modelValue : ""), d = h(() => s.test(i.value));
    function u($) {
      const C = $.trim();
      if (C === "")
        return "";
      const k = C.startsWith("#") ? C : `#${C}`;
      return s.test(k) ? k.toLowerCase() : C;
    }
    function c($) {
      r("update:modelValue", u($.target.value));
    }
    const v = h(() => !d.value || !a.field.contrastBackground || !s.test(a.field.contrastBackground) ? null : cn(i.value, a.field.contrastBackground)), p = h(() => a.field.contrastMinRatio ?? Yv), x = h(() => v.value !== null && v.value < p.value);
    function M() {
      a.field.contrastBackground && r(
        "update:modelValue",
        Jv(i.value, a.field.contrastBackground, p.value)
      );
    }
    return ($, C) => (t(), n("div", Xv, [
      l("div", e1, [
        d.value ? (t(), n("input", {
          key: 1,
          type: "color",
          class: "border-input size-9 shrink-0 cursor-pointer rounded-md border bg-transparent",
          value: i.value,
          disabled: e.disabled,
          "aria-label": `Colour for ${e.field.key}`,
          onInput: C[0] || (C[0] = (k) => r("update:modelValue", k.target.value))
        }, null, 40, a1)) : (t(), n("span", t1)),
        l("input", {
          type: "text",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
          value: i.value,
          disabled: e.disabled,
          placeholder: e.field.placeholder ?? "#1e90ff",
          spellcheck: "false",
          onInput: c
        }, null, 40, n1)
      ]),
      (e.field.presets ?? []).length > 0 && !e.disabled ? (t(), n("div", l1, [
        (t(!0), n(P, null, O(e.field.presets, (k) => (t(), n("button", {
          key: k,
          type: "button",
          class: z(["size-6 rounded border", i.value.toLowerCase() === k.toLowerCase() ? "ring-ring ring-2" : ""]),
          style: ie({ backgroundColor: k }),
          "aria-label": k,
          title: k,
          onClick: (B) => r("update:modelValue", k.toLowerCase())
        }, null, 14, o1))), 128))
      ])) : b("", !0),
      x.value ? (t(), n("p", s1, [
        l("span", null, " This fails contrast at " + f(v.value.toFixed(1)) + ":1 - it needs at least " + f(p.value.toFixed(1)) + ":1 to stay readable. ", 1),
        e.disabled ? b("", !0) : (t(), n("button", {
          key: 0,
          type: "button",
          class: "font-medium underline underline-offset-2",
          onClick: M
        }, " Use a readable shade "))
      ])) : b("", !0)
    ]));
  }
}), i1 = ["aria-disabled"], d1 = /* @__PURE__ */ V({
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
    const c = h(() => {
      const M = a.modelValue?.[a.latKey], $ = a.modelValue?.[a.lngKey];
      return typeof M == "number" && typeof $ == "number" ? { lat: M, lng: $ } : a.center ? a.center : a.markers.length > 0 ? { lat: a.markers[0].lat, lng: a.markers[0].lng } : { lat: 0, lng: 0 };
    });
    async function v() {
      if (!s.value || i)
        return;
      const M = await import("leaflet");
      await import("leaflet/dist/leaflet.css"), u = M, i = M.map(s.value).setView([c.value.lat, c.value.lng], a.zoom), M.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19
      }).addTo(i), p(), x(), a.pickable && !a.disabled && i.on("click", ($) => {
        r("update:modelValue", {
          [a.latKey]: Number($.latlng.lat.toFixed(6)),
          [a.lngKey]: Number($.latlng.lng.toFixed(6))
        });
      });
    }
    function p() {
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
    function x() {
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
    return ke(() => {
      v();
    }), Me(() => {
      i?.remove(), i = null, d = null;
    }), ge(
      () => a.modelValue,
      () => x(),
      { deep: !0 }
    ), (M, $) => (t(), n("div", {
      ref_key: "root",
      ref: s,
      class: "border-input bg-muted/20 w-full overflow-hidden rounded-md border",
      style: ie({ height: `${e.height}px` }),
      "aria-disabled": e.disabled || void 0
    }, null, 12, i1));
  }
}), u1 = { class: "flex flex-col gap-2" }, c1 = { class: "text-muted-foreground text-xs font-normal" }, f1 = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkMapField",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(() => a.modelValue && typeof a.modelValue == "object" ? a.modelValue : null), i = h(() => a.field.latKey ?? "lat"), d = h(() => a.field.lngKey ?? "lng");
    return (u, c) => (t(), n("div", u1, [
      F(d1, {
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
      l("p", c1, [
        q(" Click the map to set " + f(i.value) + " / " + f(d.value) + " ", 1),
        s.value ? (t(), n(P, { key: 0 }, [
          q(" (" + f(s.value[i.value]?.toFixed?.(5) ?? s.value[i.value]) + ", " + f(s.value[d.value]?.toFixed?.(5) ?? s.value[d.value]) + ") ", 1)
        ], 64)) : b("", !0)
      ])
    ]));
  }
}), m1 = { class: "flex flex-col gap-2" }, p1 = ["width", "height"], v1 = ["value", "disabled"], g1 = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal"
}, h1 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(null), i = h(() => {
      if (a.field.from) {
        const c = a.values?.[a.field.from];
        return c == null ? "" : String(c);
      }
      return a.modelValue == null ? "" : String(a.modelValue);
    }), d = h(() => a.field.size ?? 160);
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
    return ke(() => {
      u();
    }), ge(i, () => {
      u();
    }), (c, v) => (t(), n("div", m1, [
      l("canvas", {
        ref_key: "canvas",
        ref: s,
        class: "border-input bg-background rounded-md border",
        width: d.value,
        height: d.value
      }, null, 8, p1),
      e.field.from ? (t(), n("p", g1, "From " + f(e.field.from), 1)) : (t(), n("input", {
        key: 0,
        type: "text",
        class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
        value: e.modelValue == null ? "" : String(e.modelValue),
        disabled: e.disabled,
        placeholder: "QR payload",
        onInput: v[0] || (v[0] = (p) => r("update:modelValue", p.target.value))
      }, null, 40, v1))
    ]));
  }
}), b1 = { class: "flex flex-col gap-2" }, y1 = { class: "border-input bg-background inline-flex min-h-16 items-center justify-center overflow-x-auto rounded-md border p-2" }, x1 = ["aria-label"], k1 = {
  key: 0,
  class: "text-destructive text-xs"
}, $1 = ["value", "disabled"], w1 = {
  key: 2,
  class: "text-muted-foreground text-xs font-normal"
}, C1 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(null), i = K(null), d = h(() => {
      if (a.field.from) {
        const v = a.values?.[a.field.from];
        return v == null ? "" : String(v);
      }
      return a.modelValue == null ? "" : String(a.modelValue);
    }), u = h(() => (a.field.format ?? "CODE128").toUpperCase());
    async function c() {
      if (!s.value)
        return;
      const v = d.value.trim();
      for (i.value = null; s.value.firstChild; )
        s.value.removeChild(s.value.firstChild);
      if (v !== "")
        try {
          const x = (await import("jsbarcode")).default;
          x(s.value, v, {
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
    return ke(() => {
      c();
    }), ge([d, u], () => {
      c();
    }), (v, p) => (t(), n("div", b1, [
      l("div", y1, [
        (t(), n("svg", {
          ref_key: "svg",
          ref: s,
          class: "max-w-full",
          role: "img",
          "aria-label": `Barcode ${u.value}`
        }, null, 8, x1))
      ]),
      i.value ? (t(), n("p", k1, f(i.value), 1)) : b("", !0),
      e.field.from ? (t(), n("p", w1, " From " + f(e.field.from) + " (" + f(u.value) + ") ", 1)) : (t(), n("input", {
        key: 1,
        type: "text",
        class: "border-input bg-background h-9 rounded-md border px-3 text-sm",
        value: e.modelValue == null ? "" : String(e.modelValue),
        disabled: e.disabled,
        placeholder: "Barcode value",
        onInput: p[0] || (p[0] = (x) => r("update:modelValue", x.target.value))
      }, null, 40, $1))
    ]));
  }
}), M1 = { class: "mr-2 inline-block w-3 opacity-60" }, S1 = {
  key: 0,
  class: "text-muted-foreground p-3"
}, B1 = /* @__PURE__ */ V({
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
    const r = h(() => {
      if (o.field.originalKey)
        return a(o.values?.[o.field.originalKey]);
      const d = o.modelValue;
      return a(d?.original);
    }), s = h(() => {
      if (o.field.modifiedKey)
        return a(o.values?.[o.field.modifiedKey]);
      const d = o.modelValue;
      return a(d?.modified);
    }), i = h(() => {
      const d = r.value.split(`
`), u = s.value.split(`
`), c = Math.max(d.length, u.length), v = [];
      for (let p = 0; p < c; p++) {
        const x = d[p], M = u[p];
        if (x === M) {
          x !== void 0 && v.push({ kind: "same", text: x });
          continue;
        }
        x !== void 0 && v.push({ kind: "del", text: x }), M !== void 0 && v.push({ kind: "add", text: M });
      }
      return v;
    });
    return (d, u) => (t(), n("div", {
      class: "border-input bg-background overflow-auto rounded-md border font-mono text-xs leading-5",
      style: ie({ maxHeight: `${(e.field.rows ?? 12) * 1.25}rem` })
    }, [
      (t(!0), n(P, null, O(i.value, (c, v) => (t(), n("div", {
        key: v,
        class: z(["px-2 whitespace-pre-wrap", {
          "bg-destructive/10 text-destructive": c.kind === "del",
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300": c.kind === "add",
          "text-muted-foreground": c.kind === "same"
        }])
      }, [
        l("span", M1, f(c.kind === "add" ? "+" : c.kind === "del" ? "-" : " "), 1),
        q(" " + f(c.text), 1)
      ], 2))), 128)),
      i.value.length === 0 ? (t(), n("p", S1, "No differences.")) : b("", !0)
    ], 4));
  }
}), A1 = { class: "flex flex-col gap-3" }, z1 = { class: "flex items-center justify-between gap-2" }, P1 = { class: "text-sm font-medium" }, _1 = { class: "text-muted-foreground grid grid-cols-7 gap-1 text-center text-[10px] uppercase" }, V1 = { class: "grid grid-cols-7 gap-1" }, L1 = {
  key: 0,
  class: "text-muted-foreground mb-1 text-[10px]"
}, O1 = ["title"], cM = /* @__PURE__ */ V({
  __name: "PkCalendar",
  props: {
    events: {}
  },
  setup(e) {
    const o = e, a = K(/* @__PURE__ */ new Date()), r = h(() => a.value.getFullYear()), s = h(() => a.value.getMonth()), i = h(
      () => a.value.toLocaleString(void 0, { month: "long", year: "numeric" })
    ), d = h(() => {
      const p = /* @__PURE__ */ new Map();
      for (const x of o.events ?? []) {
        const M = p.get(x.date) ?? [];
        M.push(x), p.set(x.date, M);
      }
      return p;
    }), u = h(() => {
      const x = new Date(r.value, s.value, 1).getDay(), M = new Date(r.value, s.value + 1, 0).getDate(), $ = [];
      for (let C = 0; C < x; C++)
        $.push({ day: null, key: `pad-${C}`, events: [] });
      for (let C = 1; C <= M; C++) {
        const k = `${r.value}-${String(s.value + 1).padStart(2, "0")}-${String(C).padStart(2, "0")}`;
        $.push({ day: C, key: k, events: d.value.get(k) ?? [] });
      }
      return $;
    });
    function c() {
      a.value = new Date(r.value, s.value - 1, 1);
    }
    function v() {
      a.value = new Date(r.value, s.value + 1, 1);
    }
    return (p, x) => (t(), n("div", A1, [
      l("div", z1, [
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-sm",
          onClick: c
        }, " Prev "),
        l("p", P1, f(i.value), 1),
        l("button", {
          type: "button",
          class: "text-muted-foreground hover:text-foreground text-sm",
          onClick: v
        }, " Next ")
      ]),
      l("div", _1, [
        (t(), n(P, null, O(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], (M) => l("span", { key: M }, f(M), 1)), 64))
      ]),
      l("div", V1, [
        (t(!0), n(P, null, O(u.value, (M) => (t(), n("div", {
          key: M.key,
          class: z(["border-border/60 min-h-16 rounded-md border p-1", M.day ? "bg-background" : "bg-transparent border-transparent"])
        }, [
          M.day ? (t(), n("p", L1, f(M.day), 1)) : b("", !0),
          (t(!0), n(P, null, O(M.events.slice(0, 3), ($, C) => (t(), n("p", {
            key: `${M.key}-${C}`,
            class: "bg-primary/10 text-foreground mb-0.5 truncate rounded px-1 text-[10px] leading-4",
            title: $.label
          }, f($.label), 9, O1))), 128))
        ], 2))), 128))
      ])
    ]));
  }
}), j1 = { class: "flex items-center gap-3" }, D1 = ["min", "max", "step", "value", "disabled", "aria-label"], T1 = { class: "flex shrink-0 items-center gap-1" }, I1 = ["min", "max", "step", "value", "disabled"], E1 = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, F1 = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkSlider",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(() => a.field.min ?? 0), i = h(() => a.field.max ?? 100), d = h(() => a.field.step ?? 1), u = h(() => {
      const p = Number(a.modelValue);
      return Number.isFinite(p) ? p : s.value;
    }), c = h(
      () => a.modelValue === null || a.modelValue === void 0 || a.modelValue === ""
    );
    function v(p) {
      if (p === "") {
        r("update:modelValue", null);
        return;
      }
      const x = Number(p);
      r("update:modelValue", Number.isFinite(x) ? x : null);
    }
    return (p, x) => (t(), n("div", j1, [
      l("input", {
        type: "range",
        class: "accent-primary h-9 flex-1 cursor-pointer disabled:opacity-50",
        min: s.value,
        max: i.value,
        step: d.value,
        value: u.value,
        disabled: e.disabled,
        "aria-label": `${e.field.key} value`,
        onInput: x[0] || (x[0] = (M) => v(M.target.value))
      }, null, 40, D1),
      l("div", T1, [
        l("input", {
          type: "number",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-20 rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50",
          min: s.value,
          max: i.value,
          step: d.value,
          value: c.value ? "" : u.value,
          disabled: e.disabled,
          onInput: x[1] || (x[1] = (M) => v(M.target.value))
        }, null, 40, I1),
        e.field.unit ? (t(), n("span", E1, f(e.field.unit), 1)) : b("", !0)
      ])
    ]));
  }
}), $t = /* @__PURE__ */ new Map();
function Ut(e, o) {
  $t.set(e, o);
}
function N1(e) {
  return $t.get(e);
}
function fM(e) {
  return $t.has(e);
}
function R1() {
  return [...$t.keys()].sort();
}
function mM() {
  $t.clear();
}
const H1 = ["name", "value", "checked", "disabled", "onChange"], U1 = {
  key: 0,
  class: "flex shrink-0 scale-75 items-center",
  "aria-hidden": "true"
}, K1 = { class: "whitespace-nowrap" }, q1 = {
  key: 0,
  class: "text-muted-foreground px-2 py-1 text-xs"
}, G1 = ["name", "value", "checked", "disabled", "onChange"], W1 = {
  class: "bg-muted/40 flex h-16 items-center justify-center overflow-hidden rounded",
  "aria-hidden": "true"
}, Z1 = {
  key: 1,
  class: "text-destructive px-1 text-center text-[10px] leading-tight"
}, Y1 = { class: "text-center text-xs font-medium" }, J1 = {
  key: 0,
  class: "text-muted-foreground col-span-full text-sm"
}, Q1 = {
  key: 1,
  class: "text-muted-foreground col-span-full text-xs"
}, X1 = /* @__PURE__ */ V({
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
    const a = e, r = o, s = h(
      () => a.field.preview ? N1(a.field.preview) : void 0
    ), i = h(() => !!a.field.preview && !s.value), d = h(() => a.field.layout === "segmented"), u = h(() => {
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
    return (v, p) => d.value ? (t(), n("div", {
      key: 0,
      role: "radiogroup",
      class: z(["bg-muted inline-flex w-fit max-w-full items-stretch gap-0.5 rounded-full p-1", e.disabled ? "opacity-50" : ""])
    }, [
      (t(!0), n(P, null, O(e.options, (x) => (t(), n("label", {
        key: String(x.value),
        class: z(["relative flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors", [
          c(x) ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          e.disabled ? "" : "cursor-pointer"
        ]])
      }, [
        l("input", {
          type: "radio",
          class: "peer sr-only",
          name: `f-${e.field.key}`,
          value: x.value,
          checked: c(x),
          disabled: e.disabled,
          onChange: (M) => r("update:modelValue", x.value)
        }, null, 40, H1),
        p[0] || (p[0] = l("span", {
          class: "ring-ring pointer-events-none absolute inset-0 rounded-full peer-focus-visible:ring-2",
          "aria-hidden": "true"
        }, null, -1)),
        s.value ? (t(), n("span", U1, [
          (t(), T(ze(s.value), {
            value: x.value,
            label: x.label,
            selected: c(x)
          }, null, 8, ["value", "label", "selected"]))
        ])) : b("", !0),
        l("span", K1, f(x.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", q1, " Nothing to choose from yet. ")) : b("", !0)
    ], 2)) : (t(), n("div", {
      key: 1,
      role: "radiogroup",
      class: z(["grid gap-3", u.value])
    }, [
      (t(!0), n(P, null, O(e.options, (x) => (t(), n("label", {
        key: String(x.value),
        class: z(["group relative flex flex-col gap-2 rounded-lg border p-2 transition-colors", [
          c(x) ? "border-primary ring-primary/30 bg-primary/5 ring-2" : "border-border hover:border-muted-foreground/40",
          e.disabled ? "opacity-50" : "cursor-pointer"
        ]])
      }, [
        l("input", {
          type: "radio",
          class: "peer sr-only",
          name: `f-${e.field.key}`,
          value: x.value,
          checked: c(x),
          disabled: e.disabled,
          onChange: (M) => r("update:modelValue", x.value)
        }, null, 40, G1),
        p[1] || (p[1] = l("span", {
          class: "ring-ring pointer-events-none absolute inset-0 rounded-lg peer-focus-visible:ring-2",
          "aria-hidden": "true"
        }, null, -1)),
        l("span", W1, [
          s.value ? (t(), T(ze(s.value), {
            key: 0,
            value: x.value,
            label: x.label,
            selected: c(x)
          }, null, 8, ["value", "label", "selected"])) : i.value ? (t(), n("span", Z1, " no preview ")) : b("", !0)
        ]),
        l("span", Y1, f(x.label), 1)
      ], 2))), 128)),
      e.options.length === 0 ? (t(), n("p", J1, " Nothing to choose from yet. ")) : b("", !0),
      i.value && e.options.length > 0 ? (t(), n("p", Q1, [
        p[2] || (p[2] = q(" No preview registered for ", -1)),
        l("code", null, f(e.field.preview), 1),
        q(". Registered: " + f(y(R1)().join(", ") || "none") + ". ", 1)
      ])) : b("", !0)
    ], 2));
  }
}), eg = {
  class: "border-border size-10 overflow-hidden rounded-md border",
  style: {
    backgroundImage: "linear-gradient(45deg, rgba(0,0,0,.10) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.10) 75%), linear-gradient(45deg, rgba(0,0,0,.10) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.10) 75%)",
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 4px 4px"
  }
}, tg = /* @__PURE__ */ V({
  __name: "PkSwatchPreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), n("span", eg, [
      l("span", {
        class: "block size-full",
        style: ie({ backgroundColor: String(e.value) })
      }, null, 4)
    ]));
  }
}), ag = { class: "flex flex-col items-center gap-1 text-center" }, ng = {
  key: 0,
  class: "text-xs text-neutral-500"
}, fn = /* @__PURE__ */ V({
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
    const o = e, a = h(() => o.mono ? "#000000" : o.accent), r = h(() => {
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
    return (s, i) => (t(), n("div", ag, [
      l("div", {
        class: z(["inline-flex items-center justify-center font-mono font-semibold whitespace-nowrap tabular-nums", [
          r.value,
          e.compact ? "px-2 py-1 text-[10px]" : "px-6 py-3 text-xl tracking-[0.2em]"
        ]]),
        style: ie({ borderColor: a.value, color: a.value })
      }, f(e.code), 7),
      e.caption && !e.compact ? (t(), n("p", ng, f(e.caption), 1)) : b("", !0)
    ]));
  }
}), lg = {
  dusk: "document",
  class: "flex flex-col gap-6 bg-white p-8 text-black"
}, og = { class: "flex items-center gap-3" }, sg = ["src"], rg = {
  key: 0,
  class: "mt-1 text-sm text-neutral-600"
}, ig = {
  key: 1,
  class: "mt-1 font-mono text-sm text-neutral-600"
}, dg = {
  key: 0,
  class: "text-right text-sm"
}, ug = { class: "text-neutral-500" }, cg = { class: "tabular-nums" }, fg = { key: 1 }, mg = { class: "text-xs font-semibold tracking-wider text-neutral-500 uppercase" }, pg = { class: "mt-2 font-medium" }, vg = { key: 2 }, gg = { class: "w-full text-sm" }, hg = { class: "w-full py-3 pr-2" }, bg = {
  key: 0,
  class: "text-xs text-neutral-500"
}, yg = { key: 0 }, xg = ["colspan"], kg = {
  key: 0,
  class: "mt-6 flex break-inside-avoid justify-end"
}, $g = { class: "w-64 text-sm" }, wg = { class: "tabular-nums" }, Cg = {
  key: 3,
  class: "py-2"
}, Mg = { key: 4 }, Sg = { class: "text-xs font-semibold tracking-wider text-neutral-500 uppercase" }, Bg = { class: "mt-2 flex flex-col gap-1 text-sm" }, Ag = {
  key: 6,
  class: "mt-auto border-t border-neutral-200 pt-4 text-xs text-neutral-500"
}, zg = { key: 0 }, Pg = {
  key: 1,
  class: "mt-1"
}, _g = {
  key: 7,
  class: "rounded border border-dashed border-red-300 p-2 text-xs text-red-600"
}, Vg = /* @__PURE__ */ V({
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
    return (c, v) => (t(), n("article", lg, [
      l("div", og, [
        e.document.branding.logoUrl ? (t(), n("img", {
          key: 0,
          src: e.document.branding.logoUrl,
          alt: "",
          class: "max-h-10 max-w-40 object-contain"
        }, null, 8, sg)) : (t(), n("p", {
          key: 1,
          class: "text-lg font-semibold",
          style: ie({ color: a() })
        }, f(e.document.branding.company), 5))
      ]),
      (t(!0), n(P, null, O(e.document.blocks, (p, x) => (t(), n(P, { key: x }, [
        p.type === "header" ? (t(), n("header", {
          key: 0,
          class: "flex items-start justify-between gap-8 border-b pb-4",
          style: ie({ borderColor: a() })
        }, [
          l("div", null, [
            l("h1", {
              class: "text-2xl font-semibold tracking-tight",
              style: ie({ color: a() })
            }, f(p.title), 5),
            p.subtitle ? (t(), n("p", rg, f(p.subtitle), 1)) : b("", !0),
            p.reference ? (t(), n("p", ig, f(p.reference), 1)) : b("", !0)
          ]),
          r(p).length ? (t(), n("dl", dg, [
            (t(!0), n(P, null, O(r(p), (M, $) => (t(), n("div", {
              key: $,
              class: "flex justify-end gap-4 py-0.5"
            }, [
              l("dt", ug, f(M.label), 1),
              l("dd", cg, f(M.value), 1)
            ]))), 128))
          ])) : b("", !0)
        ], 4)) : p.type === "party" ? (t(), n("section", fg, [
          l("h2", mg, f(p.heading), 1),
          l("p", pg, f(p.name), 1),
          (t(!0), n(P, null, O(d(p.lines), (M, $) => (t(), n("p", {
            key: $,
            class: "text-sm text-neutral-600"
          }, f(M), 1))), 128))
        ])) : p.type === "lines" ? (t(), n("section", vg, [
          l("table", gg, [
            l("thead", null, [
              l("tr", {
                class: "border-b-2 text-left",
                style: ie({ borderColor: a() })
              }, [
                (t(!0), n(P, null, O(d(p.columns), (M, $) => (t(), n("th", {
                  key: $,
                  class: z(["pb-2 font-medium", $ > 0 ? "pl-3 text-right whitespace-nowrap" : ""])
                }, f(M), 3))), 128))
              ], 4)
            ]),
            l("tbody", null, [
              (t(!0), n(P, null, O(s(p), (M, $) => (t(), n("tr", {
                key: $,
                class: "border-b border-neutral-200"
              }, [
                l("td", hg, [
                  l("p", null, f(M.description), 1),
                  M.detail ? (t(), n("p", bg, f(M.detail), 1)) : b("", !0)
                ]),
                (t(!0), n(P, null, O(M.cells, (C, k) => (t(), n("td", {
                  key: k,
                  class: "py-3 pl-3 text-right whitespace-nowrap tabular-nums"
                }, f(C), 1))), 128))
              ]))), 128)),
              s(p).length === 0 ? (t(), n("tr", yg, [
                l("td", {
                  colspan: d(p.columns).length || 1,
                  class: "py-6 text-center text-neutral-500"
                }, f(p.empty), 9, xg)
              ])) : b("", !0)
            ])
          ]),
          i(p).length ? (t(), n("div", kg, [
            l("dl", $g, [
              (t(!0), n(P, null, O(i(p), (M, $) => (t(), n("div", {
                key: $,
                class: z([
                  "flex justify-between py-1",
                  M.strong ? "mt-1 border-t-2 pt-2 text-base font-semibold" : ""
                ]),
                style: ie(M.strong ? { color: a(), borderColor: a() } : void 0)
              }, [
                l("dt", {
                  class: z(M.strong ? "" : "text-neutral-600")
                }, f(M.label), 3),
                l("dd", wg, f(M.value), 1)
              ], 6))), 128))
            ])
          ])) : b("", !0)
        ])) : p.type === "code" ? (t(), n("section", Cg, [
          F(fn, {
            code: u(p.code),
            caption: u(p.caption),
            style: ie(u(p.style)),
            accent: e.document.branding.accent,
            mono: e.document.branding.mono
          }, null, 8, ["code", "caption", "style", "accent", "mono"])
        ])) : p.type === "steps" ? (t(), n("section", Mg, [
          l("h2", Sg, f(p.heading), 1),
          l("ol", Bg, [
            (t(!0), n(P, null, O(d(p.items), (M, $) => (t(), n("li", {
              key: $,
              class: "flex gap-2"
            }, [
              l("span", {
                class: "font-semibold tabular-nums",
                style: ie({ color: a() })
              }, f($ + 1) + ".", 5),
              l("span", null, f(M), 1)
            ]))), 128))
          ])
        ])) : p.type === "note" ? (t(), n("p", {
          key: 5,
          class: z(["text-sm", p.emphasis ? "font-medium" : "text-neutral-600"]),
          style: ie(p.emphasis ? { color: a() } : void 0)
        }, f(p.text), 7)) : p.type === "footer" ? (t(), n("footer", Ag, [
          p.text ? (t(), n("p", zg, f(p.text), 1)) : b("", !0),
          d(p.contacts).length ? (t(), n("p", Pg, f(d(p.contacts).join(" · ")), 1)) : b("", !0)
        ])) : (t(), n("p", _g, " This document contains a “" + f(p.type) + "” block, which this version cannot draw. ", 1))
      ], 64))), 128))
    ]));
  }
}), Lg = ["aria-label", "title"], Og = {
  class: "size-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, jg = {
  key: 1,
  d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
}, pM = /* @__PURE__ */ V({
  __name: "ThemeToggle",
  setup(e) {
    const { appearance: o, set: a } = ln(), r = h(() => o.value.theme === "dark");
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
      (t(), n("svg", Og, [
        r.value ? (t(), n(P, { key: 0 }, [
          d[0] || (d[0] = l("circle", {
            cx: "12",
            cy: "12",
            r: "4"
          }, null, -1)),
          d[1] || (d[1] = l("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" }, null, -1))
        ], 64)) : (t(), n("path", jg))
      ]))
    ], 8, Lg));
  }
}), Dg = ["width", "height"], Tg = { key: 0 }, Ig = ["x1", "x2", "y1", "y2"], Eg = ["x", "y"], Fg = ["x1", "x2", "y1", "y2"], Ng = ["x", "y"], Rg = ["x", "y", "width", "height", "fill-opacity", "onMouseenter"], Hg = ["x", "y", "width", "height", "fill", "fill-opacity"], Ug = ["x", "y"], Kg = ["x", "y"], qg = {
  key: 0,
  class: "bg-popover pointer-events-none absolute top-2 right-2 z-10 min-w-32 rounded-lg border p-2 shadow-lg"
}, Gg = { class: "text-muted-foreground mb-1 text-[11px] capitalize" }, Wg = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, Zg = { class: "text-xs font-semibold tabular-nums" }, Yg = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, Jg = { class: "text-muted-foreground" }, Va = 5.6, vM = /* @__PURE__ */ V({
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
    function r(_) {
      return a[_] ?? _;
    }
    function s(_, ee) {
      if (!o.thresholds?.length)
        return ee;
      const D = o.thresholds.find((E) => _ < E.max);
      return r(D ? D.color : o.aboveColor);
    }
    const i = K(null), d = K(560), u = K(null);
    let c = null;
    ke(() => {
      c = new ResizeObserver((_) => {
        d.value = Math.max(160, _[0].contentRect.width);
      }), i.value && c.observe(i.value);
    }), Me(() => c?.disconnect());
    const v = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)"
    ], p = h(() => (o.series?.length ? o.series : o.data?.length ? [{ name: "", points: o.data }] : []).map((ee, D) => ({
      ...ee,
      color: ee.color ?? v[D % v.length]
    }))), x = h(() => p.value[0]?.points.map((_) => _.label) ?? []), M = h(() => x.value.length), $ = h(() => o.orientation === "horizontal"), C = h(() => Math.max(0, ...x.value.map((_) => _.length))), k = h(() => {
      if (!$.value)
        return o.showAxis ? 44 : 8;
      const _ = C.value * Va + 16;
      return Math.round(Math.min(Math.max(60, _), d.value * 0.4));
    }), B = h(() => Math.max(4, Math.floor((k.value - 16) / Va)));
    function A(_) {
      return _.length <= B.value ? _ : `${_.slice(0, B.value - 1)}…`;
    }
    const w = h(() => ({
      top: 12,
      right: 12,
      bottom: 26,
      left: k.value
    })), m = h(() => ({
      w: Math.max(1, d.value - w.value.left - w.value.right),
      h: Math.max(1, o.height - w.value.top - w.value.bottom)
    })), g = (_) => o.format ? o.format(_) : S(_);
    function S(_) {
      return Math.abs(_) >= 1e6 ? `${(_ / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(_) >= 1e3 ? `${(_ / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(_ * 100) / 100);
    }
    const I = h(() => {
      const _ = x.value.map(
        (U, J) => o.stacked ? p.value.reduce((te, he) => te + Math.max(0, he.points[J]?.value ?? 0), 0) : Math.max(...p.value.map((te) => te.points[J]?.value ?? 0))
      );
      if (o.maxValue)
        return o.maxValue;
      const ee = Math.max(..._, 0);
      if (ee <= 0)
        return 1;
      const D = 10 ** Math.floor(Math.log10(ee));
      return ([1, 2, 2.5, 5, 10].find((U) => ee <= U * D) ?? 10) * D;
    }), j = h(
      () => ($.value ? m.value.h : m.value.w) / Math.max(1, M.value)
    ), X = h(() => j.value * 0.68), W = h(
      () => o.stacked || p.value.length <= 1 ? X.value : X.value / p.value.length
    ), Q = h(() => {
      const _ = [], ee = new Array(M.value).fill(0);
      return p.value.forEach((D, E) => {
        D.points.forEach((U, J) => {
          const he = Math.max(0, U.value) / I.value * ($.value ? m.value.w : m.value.h), ve = ($.value ? w.value.top : w.value.left) + J * j.value + (j.value - X.value) / 2, pe = o.stacked ? 0 : E * W.value;
          _.push(
            $.value ? {
              x: w.value.left + ee[J],
              y: ve + pe,
              w: he,
              h: Math.max(0, W.value - 2),
              color: s(U.value, D.color),
              label: U.label,
              name: D.name,
              value: U.value,
              index: J
            } : {
              x: ve + pe,
              y: w.value.top + m.value.h - he - ee[J],
              w: Math.max(0, W.value - 2),
              h: he,
              color: s(U.value, D.color),
              label: U.label,
              name: D.name,
              value: U.value,
              index: J
            }
          ), o.stacked && (ee[J] += he);
        });
      }), _;
    }), Y = h(
      () => [0, 0.25, 0.5, 0.75, 1].map((_) => ({
        value: I.value * ($.value ? _ : 1 - _),
        x: w.value.left + m.value.w * _,
        y: w.value.top + m.value.h * _
      }))
    ), G = h(() => Math.max(1, Math.ceil(M.value / ($.value ? 14 : 10))));
    function R(_) {
      return _ === M.value - 1 || _ % G.value === 0;
    }
    function H(_) {
      return ($.value ? w.value.top : w.value.left) + _ * j.value + j.value / 2;
    }
    const ae = h(() => u.value === null ? null : {
      label: x.value[u.value],
      rows: p.value.map((_) => ({
        name: _.name,
        color: _.color,
        value: _.points[u.value]?.value ?? 0
      }))
    });
    return (_, ee) => (t(), n("div", {
      ref_key: "host",
      ref: i,
      class: "relative w-full"
    }, [
      M.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(P, { key: 1 }, [
        (t(), n("svg", {
          width: d.value,
          height: e.height,
          onMouseleave: ee[0] || (ee[0] = (D) => u.value = null)
        }, [
          e.showAxis ? (t(), n("g", Tg, [
            $.value ? (t(), n(P, { key: 0 }, [
              (t(!0), n(P, null, O(Y.value, (D) => (t(), n("line", {
                key: `g-${D.x}`,
                x1: D.x,
                x2: D.x,
                y1: w.value.top,
                y2: w.value.top + m.value.h,
                stroke: "var(--border)",
                "stroke-width": "1"
              }, null, 8, Ig))), 128)),
              (t(!0), n(P, null, O(Y.value, (D) => (t(), n("text", {
                key: `gt-${D.x}`,
                x: D.x,
                y: e.height - 6,
                "text-anchor": "middle",
                class: "fill-muted-foreground text-[10px] tabular-nums"
              }, f(S(D.value)), 9, Eg))), 128))
            ], 64)) : (t(), n(P, { key: 1 }, [
              (t(!0), n(P, null, O(Y.value, (D) => (t(), n("line", {
                key: `g-${D.y}`,
                x1: w.value.left,
                x2: d.value - w.value.right,
                y1: D.y,
                y2: D.y,
                stroke: "var(--border)",
                "stroke-width": "1"
              }, null, 8, Fg))), 128)),
              (t(!0), n(P, null, O(Y.value, (D) => (t(), n("text", {
                key: `gt-${D.y}`,
                x: w.value.left - 8,
                y: D.y + 3,
                "text-anchor": "end",
                class: "fill-muted-foreground text-[10px] tabular-nums"
              }, f(S(D.value)), 9, Ng))), 128))
            ], 64))
          ])) : b("", !0),
          (t(!0), n(P, null, O(x.value, (D, E) => (t(), n("rect", {
            key: `hit-${E}`,
            x: $.value ? w.value.left : w.value.left + E * j.value,
            y: $.value ? w.value.top + E * j.value : w.value.top,
            width: $.value ? m.value.w : j.value,
            height: $.value ? j.value : m.value.h,
            fill: "var(--muted)",
            "fill-opacity": u.value === E ? 0.4 : 0,
            onMouseenter: (U) => u.value = E
          }, null, 40, Rg))), 128)),
          (t(!0), n(P, null, O(Q.value, (D, E) => (t(), n("rect", {
            key: `b-${E}`,
            x: D.x,
            y: D.y,
            width: D.w,
            height: D.h,
            fill: D.color,
            "fill-opacity": u.value === null || u.value === D.index ? 0.9 : 0.35,
            rx: "3",
            class: "transition-[fill-opacity]",
            "pointer-events": "none"
          }, null, 8, Hg))), 128)),
          $.value ? (t(!0), n(P, { key: 1 }, O(x.value, (D, E) => xe((t(), n("text", {
            key: `c-${E}`,
            x: w.value.left - 8,
            y: H(E) + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[10px]"
          }, [
            q(f(A(D)) + " ", 1),
            l("title", null, f(D), 1)
          ], 8, Ug)), [
            [Ye, R(E)]
          ])), 128)) : (t(!0), n(P, { key: 2 }, O(x.value, (D, E) => xe((t(), n("text", {
            key: `c-${E}`,
            x: H(E),
            y: e.height - 8,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, f(D), 9, Kg)), [
            [Ye, R(E)]
          ])), 128))
        ], 40, Dg)),
        ae.value ? (t(), n("div", qg, [
          l("p", Gg, f(ae.value.label), 1),
          (t(!0), n(P, null, O(ae.value.rows, (D, E) => (t(), n("div", {
            key: E,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: D.color })
            }, null, 4),
            l("span", Wg, f(D.name || "Value"), 1),
            l("span", Zg, f(g(D.value)), 1)
          ]))), 128))
        ])) : b("", !0),
        e.showLegend && p.value.length > 1 ? (t(), n("div", Yg, [
          (t(!0), n(P, null, O(p.value, (D, E) => (t(), n("span", {
            key: E,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: D.color })
            }, null, 4),
            l("span", Jg, f(D.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), Qg = ["width", "height"], Xg = ["id"], eh = ["stop-color"], th = ["stop-color"], ah = { key: 0 }, nh = ["x1", "x2", "y1", "y2"], lh = ["x", "y"], oh = ["x", "y"], sh = ["x1", "x2", "y1", "y2"], rh = ["d", "fill"], ih = ["d", "stroke", "stroke-dasharray"], dh = ["cx", "cy", "fill"], uh = { key: 1 }, ch = ["x1", "x2", "y1", "y2"], fh = ["cx", "cy", "fill"], mh = ["x", "y"], ph = { class: "text-muted-foreground mb-1.5 text-[11px] whitespace-nowrap" }, vh = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, gh = { class: "text-xs font-semibold tabular-nums" }, hh = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, bh = { class: "text-muted-foreground" }, yh = /* @__PURE__ */ V({
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
    const o = e, a = h(() => v.value.some((_) => _.axis === "right")), r = K(null), s = K(560), i = K(null);
    let d = null;
    ke(() => {
      d = new ResizeObserver((_) => {
        s.value = Math.max(160, _[0].contentRect.width);
      }), r.value && d.observe(r.value);
    }), Me(() => d?.disconnect());
    const u = [
      "var(--primary)",
      "var(--chart-2)",
      "var(--chart-4)",
      "var(--chart-3)",
      "var(--chart-5)"
    ], c = Math.random().toString(36).slice(2, 9), v = h(() => (o.series?.length ? o.series : o.data?.length ? [{ name: "", points: o.data }] : []).map((ee, D) => ({
      ...ee,
      color: ee.color ?? u[D % u.length]
    }))), p = h(() => v.value[0]?.points.map((_) => _.label) ?? []), x = h(() => p.value.length), M = h(() => ({
      top: 12,
      right: o.showAxis && a.value ? 44 : 12,
      bottom: 22,
      // The axis gutter disappears entirely when the axis is hidden, rather than
      // sitting there as dead space.
      left: o.showAxis ? 44 : 8
    })), $ = (_) => o.format ? o.format(_) : C(_);
    function C(_) {
      return Math.abs(_) >= 1e6 ? `${(_ / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(_) >= 1e3 ? `${(_ / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(_ * 100) / 100);
    }
    function k(_) {
      const ee = Math.max(..._, 0);
      if (ee <= 0)
        return 1;
      const D = 10 ** Math.floor(Math.log10(ee));
      return ([1, 2, 2.5, 5, 10].find((U) => ee <= U * D) ?? 10) * D;
    }
    const B = h(
      () => k(
        v.value.filter((_) => _.axis !== "right").flatMap((_) => _.points.map((ee) => ee.value))
      )
    ), A = h(
      () => k(
        v.value.filter((_) => _.axis === "right").flatMap((_) => _.points.map((ee) => ee.value))
      )
    ), w = h(() => ({
      w: Math.max(1, s.value - M.value.left - M.value.right),
      h: Math.max(1, o.height - M.value.top - M.value.bottom)
    }));
    function m(_) {
      return M.value.left + (x.value <= 1 ? 0 : _ / (x.value - 1) * w.value.w);
    }
    function g(_, ee = "left") {
      const D = ee === "right" ? A.value : B.value;
      return M.value.top + w.value.h - _ / D * w.value.h;
    }
    const S = h(
      () => v.value.map((_) => {
        const ee = _.points.map((E, U) => ({
          ...E,
          x: m(U),
          y: g(E.value, _.axis ?? "left")
        })), D = _.stepped ? I(ee) : j(ee);
        return { ..._, pts: ee, line: D, area: X(D, ee) };
      })
    );
    function I(_) {
      if (_.length === 0)
        return "";
      let ee = `M${_[0].x.toFixed(2)},${_[0].y.toFixed(2)}`;
      for (let D = 1; D < _.length; D++)
        ee += ` L${_[D].x.toFixed(2)},${_[D - 1].y.toFixed(2)} L${_[D].x.toFixed(2)},${_[D].y.toFixed(2)}`;
      return ee;
    }
    function j(_) {
      const ee = _.length;
      if (ee === 0)
        return "";
      if (ee === 1)
        return `M${_[0].x},${_[0].y}`;
      const D = [], E = [];
      for (let te = 0; te < ee - 1; te++)
        D[te] = _[te + 1].x - _[te].x, E[te] = D[te] === 0 ? 0 : (_[te + 1].y - _[te].y) / D[te];
      const U = [E[0]];
      for (let te = 1; te < ee - 1; te++)
        if (E[te - 1] * E[te] <= 0)
          U[te] = 0;
        else {
          const he = 2 * D[te] + D[te - 1], ve = D[te] + 2 * D[te - 1];
          U[te] = (he + ve) / (he / E[te - 1] + ve / E[te]);
        }
      U[ee - 1] = E[ee - 2];
      let J = `M${_[0].x.toFixed(2)},${_[0].y.toFixed(2)}`;
      for (let te = 0; te < ee - 1; te++) {
        const he = D[te] / 3;
        J += ` C${(_[te].x + he).toFixed(2)},${(_[te].y + U[te] * he).toFixed(2)} ${(_[te + 1].x - he).toFixed(2)},${(_[te + 1].y - U[te + 1] * he).toFixed(2)} ${_[te + 1].x.toFixed(2)},${_[te + 1].y.toFixed(2)}`;
      }
      return J;
    }
    function X(_, ee) {
      if (ee.length === 0)
        return "";
      const D = M.value.top + w.value.h;
      return `${_} L${ee[ee.length - 1].x.toFixed(2)},${D} L${ee[0].x.toFixed(2)},${D} Z`;
    }
    const W = h(
      () => [0, 0.25, 0.5, 0.75, 1].map((_) => ({
        y: M.value.top + w.value.h * _,
        value: B.value * (1 - _)
      }))
    ), Q = h(
      () => [0, 0.25, 0.5, 0.75, 1].map((_) => ({
        y: M.value.top + w.value.h * _,
        value: A.value * (1 - _)
      }))
    ), Y = h(() => Math.max(1, Math.ceil(x.value / 8)));
    function G(_) {
      return _ === x.value - 1 || _ % Y.value === 0;
    }
    function R(_) {
      const ee = _.currentTarget.getBoundingClientRect(), D = _.clientX - ee.left - M.value.left, E = x.value <= 1 ? 1 : w.value.w / (x.value - 1);
      i.value = Math.min(x.value - 1, Math.max(0, Math.round(D / E)));
    }
    const H = h(() => {
      if (i.value === null || x.value === 0)
        return null;
      const _ = i.value;
      return {
        i: _,
        x: m(_),
        label: p.value[_],
        rows: S.value.map((ee) => ({
          name: ee.name,
          color: ee.color,
          value: ee.points[_]?.value ?? 0,
          y: ee.pts[_]?.y ?? 0
        }))
      };
    }), ae = h(() => {
      if (!H.value)
        return {};
      const _ = H.value.x > s.value * 0.6;
      return {
        left: `${H.value.x}px`,
        top: "8px",
        transform: _ ? "translateX(-100%) translateX(-12px)" : "translateX(12px)"
      };
    });
    return (_, ee) => (t(), n("div", {
      ref_key: "host",
      ref: r,
      class: "relative w-full"
    }, [
      x.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(P, { key: 1 }, [
        (t(), n("svg", {
          width: s.value,
          height: e.height,
          class: "overflow-visible",
          onMousemove: R,
          onMouseleave: ee[0] || (ee[0] = (D) => i.value = null)
        }, [
          l("defs", null, [
            (t(!0), n(P, null, O(S.value, (D, E) => (t(), n("linearGradient", {
              id: `pk-fill-${y(c)}-${E}`,
              key: E,
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "1"
            }, [
              l("stop", {
                offset: "0%",
                "stop-color": D.color,
                "stop-opacity": "0.25"
              }, null, 8, eh),
              l("stop", {
                offset: "100%",
                "stop-color": D.color,
                "stop-opacity": "0.01"
              }, null, 8, th)
            ], 8, Xg))), 128))
          ]),
          e.showAxis ? (t(), n("g", ah, [
            (t(!0), n(P, null, O(W.value, (D) => (t(), n("line", {
              key: D.y,
              x1: M.value.left,
              x2: s.value - M.value.right,
              y1: D.y,
              y2: D.y,
              stroke: "var(--border)",
              "stroke-width": "1"
            }, null, 8, nh))), 128)),
            (t(!0), n(P, null, O(W.value, (D) => (t(), n("text", {
              key: `t-${D.y}`,
              x: M.value.left - 8,
              y: D.y + 3,
              "text-anchor": "end",
              class: "fill-muted-foreground text-[10px] tabular-nums"
            }, f(C(D.value)), 9, lh))), 128)),
            a.value ? (t(!0), n(P, { key: 0 }, O(Q.value, (D) => (t(), n("text", {
              key: `rt-${D.y}`,
              x: s.value - M.value.right + 8,
              y: D.y + 3,
              "text-anchor": "start",
              class: "fill-muted-foreground text-[10px] tabular-nums"
            }, f(C(D.value)), 9, oh))), 128)) : b("", !0)
          ])) : b("", !0),
          (t(!0), n(P, null, O(p.value, (D, E) => xe((t(), n("line", {
            key: `v-${E}`,
            x1: m(E),
            x2: m(E),
            y1: M.value.top,
            y2: M.value.top + w.value.h,
            stroke: "var(--border)",
            "stroke-width": "1",
            "stroke-dasharray": "2 4",
            opacity: "0.7"
          }, null, 8, sh)), [
            [Ye, G(E)]
          ])), 128)),
          (t(!0), n(P, null, O(S.value, (D, E) => (t(), n("g", {
            key: `s-${E}`
          }, [
            D.filled ?? e.type === "area" ? (t(), n("path", {
              key: 0,
              d: D.area,
              fill: `url(#pk-fill-${y(c)}-${E})`
            }, null, 8, rh)) : b("", !0),
            l("path", {
              d: D.line,
              fill: "none",
              stroke: D.color,
              "stroke-width": "2",
              "stroke-linejoin": "round",
              "stroke-linecap": "round",
              "stroke-dasharray": D.dashed ? "6 4" : void 0
            }, null, 8, ih),
            D.pts.length === 1 ? (t(), n("circle", {
              key: 1,
              cx: D.pts[0].x,
              cy: D.pts[0].y,
              r: "3",
              fill: D.color
            }, null, 8, dh)) : b("", !0)
          ]))), 128)),
          H.value ? (t(), n("g", uh, [
            l("line", {
              x1: H.value.x,
              x2: H.value.x,
              y1: M.value.top,
              y2: M.value.top + w.value.h,
              stroke: "var(--muted-foreground)",
              "stroke-width": "1",
              "stroke-dasharray": "4 3"
            }, null, 8, ch),
            (t(!0), n(P, null, O(H.value.rows, (D, E) => (t(), n("circle", {
              key: `d-${E}`,
              cx: H.value.x,
              cy: D.y,
              r: "4",
              fill: D.color,
              stroke: "var(--card)",
              "stroke-width": "2"
            }, null, 8, fh))), 128))
          ])) : b("", !0),
          (t(!0), n(P, null, O(p.value, (D, E) => xe((t(), n("text", {
            key: `x-${E}`,
            x: m(E),
            y: e.height - 6,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px]"
          }, f(D), 9, mh)), [
            [Ye, G(E)]
          ])), 128))
        ], 40, Qg)),
        H.value ? (t(), n("div", {
          key: 0,
          class: "bg-popover pointer-events-none absolute z-10 min-w-36 rounded-lg border p-2 shadow-lg",
          style: ie(ae.value)
        }, [
          l("p", ph, f(H.value.label), 1),
          (t(!0), n(P, null, O(H.value.rows, (D, E) => (t(), n("div", {
            key: E,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: D.color })
            }, null, 4),
            l("span", vh, f(D.name || "Value"), 1),
            l("span", gh, f($(D.value)), 1)
          ]))), 128))
        ], 4)) : b("", !0),
        e.showLegend && v.value.length > 1 ? (t(), n("div", hh, [
          (t(!0), n(P, null, O(S.value, (D, E) => (t(), n("span", {
            key: E,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: D.color })
            }, null, 4),
            l("span", bh, f(D.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), xh = { class: "bg-popover pointer-events-none absolute top-2 left-2 z-10 rounded-lg border px-2.5 py-1.5 shadow-lg" }, kh = { class: "text-muted-foreground text-[11px] capitalize" }, $h = { class: "text-sm font-semibold tabular-nums" }, wh = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, wt = /* @__PURE__ */ V({
  __name: "ChartTooltip",
  props: {
    label: {},
    value: {},
    share: { default: null }
  },
  setup(e) {
    return (o, a) => (t(), n("div", xh, [
      l("p", kh, f(e.label), 1),
      l("p", $h, [
        q(f(e.value) + " ", 1),
        e.share ? (t(), n("span", wh, " (" + f(e.share) + ") ", 1)) : b("", !0)
      ])
    ]));
  }
}), Ch = {
  key: 1,
  class: "relative flex flex-wrap items-center gap-4 sm:flex-nowrap"
}, Mh = ["width", "height", "viewBox", "aria-label"], Sh = ["d", "fill", "fill-opacity", "onMouseenter"], Bh = ["x", "y"], Ah = ["x", "y"], zh = { class: "flex min-w-0 flex-1 flex-col gap-0.5" }, Ph = ["onMouseenter"], _h = { class: "min-w-0 flex-1 truncate capitalize" }, Vh = { class: "tabular-nums font-medium" }, Lh = { class: "text-muted-foreground w-9 text-right tabular-nums" }, gM = /* @__PURE__ */ V({
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
    ], r = h(() => o.data.reduce((B, A) => B + A.value, 0)), s = K(null), i = h(() => o.height), d = h(() => i.value / 2 - 4), u = h(() => o.type === "doughnut" ? d.value * 0.62 : 0);
    function c(B) {
      return a[B % a.length];
    }
    function v(B) {
      return 1 - Math.min(0.55, Math.floor(B / a.length) * 0.28);
    }
    const p = h(() => {
      if (r.value <= 0)
        return [];
      const B = i.value / 2;
      let A = -Math.PI / 2;
      return o.data.map((w, m) => {
        const g = w.value / r.value, S = g * Math.PI * 2, I = A, j = A + S;
        return A = j, {
          ...w,
          share: g,
          colour: c(m),
          opacity: v(m),
          /*
           * The 100% case. An arc from a point back to itself is degenerate
           * and SVG draws nothing, so it is expressed as two half circles.
           */
          path: g >= 0.9999 ? $(B) : M(B, I, j, d.value, u.value)
        };
      });
    });
    function x(B, A, w) {
      return `${(B + Math.cos(A) * w).toFixed(2)},${(B + Math.sin(A) * w).toFixed(2)}`;
    }
    function M(B, A, w, m, g) {
      const S = w - A > Math.PI ? 1 : 0;
      return g <= 0 ? `M${B},${B} L${x(B, A, m)} A${m},${m} 0 ${S} 1 ${x(B, w, m)} Z` : [
        `M${x(B, A, m)}`,
        `A${m},${m} 0 ${S} 1 ${x(B, w, m)}`,
        `L${x(B, w, g)}`,
        `A${g},${g} 0 ${S} 0 ${x(B, A, g)}`,
        "Z"
      ].join(" ");
    }
    function $(B) {
      const A = d.value, w = u.value, m = [
        `M${B - A},${B}`,
        `A${A},${A} 0 1 1 ${B + A},${B}`,
        `A${A},${A} 0 1 1 ${B - A},${B}`,
        "Z"
      ];
      return w <= 0 ? m.join(" ") : [
        ...m,
        `M${B - w},${B}`,
        `A${w},${w} 0 1 0 ${B + w},${B}`,
        `A${w},${w} 0 1 0 ${B - w},${B}`,
        "Z"
      ].join(" ");
    }
    const C = (B) => o.format ? o.format(B) : new Intl.NumberFormat().format(B), k = (B) => `${(B * 100).toFixed(B < 0.01 ? 2 : 0)}%`;
    return (B, A) => r.value <= 0 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " No data ", 4)) : (t(), n("div", Ch, [
      (t(), n("svg", {
        width: i.value,
        height: i.value,
        viewBox: `0 0 ${i.value} ${i.value}`,
        class: "shrink-0",
        role: "img",
        "aria-label": `Total ${C(r.value)}`
      }, [
        (t(!0), n(P, null, O(p.value, (w, m) => (t(), n("path", {
          key: m,
          d: w.path,
          fill: w.colour,
          "fill-opacity": s.value === null || s.value === m ? w.opacity : w.opacity * 0.35,
          "fill-rule": "evenodd",
          stroke: "var(--card)",
          "stroke-width": "2",
          class: "cursor-default transition-[fill-opacity]",
          onMouseenter: (g) => s.value = m,
          onMouseleave: A[0] || (A[0] = (g) => s.value = null)
        }, null, 40, Sh))), 128)),
        e.type === "doughnut" ? (t(), n(P, { key: 0 }, [
          l("text", {
            x: i.value / 2,
            y: i.value / 2 - 2,
            "text-anchor": "middle",
            class: "fill-foreground text-base font-semibold tabular-nums"
          }, f(C(s.value === null ? r.value : p.value[s.value].value)), 9, Bh),
          l("text", {
            x: i.value / 2,
            y: i.value / 2 + 14,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, f(s.value === null ? "Total" : p.value[s.value].label), 9, Ah)
        ], 64)) : b("", !0)
      ], 8, Mh)),
      l("ul", zh, [
        (t(!0), n(P, null, O(p.value, (w, m) => (t(), n("li", {
          key: m,
          class: z(["flex cursor-default items-center gap-2 rounded px-1.5 py-1 text-xs transition-colors", s.value === m ? "bg-muted" : ""]),
          onMouseenter: (g) => s.value = m,
          onMouseleave: A[1] || (A[1] = (g) => s.value = null)
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: w.colour, opacity: w.opacity })
          }, null, 4),
          l("span", _h, f(w.label), 1),
          l("span", Vh, f(C(w.value)), 1),
          l("span", Lh, f(k(w.share)), 1)
        ], 42, Ph))), 128))
      ]),
      s.value !== null && e.type === "pie" ? (t(), T(wt, {
        key: 0,
        label: p.value[s.value].label,
        value: C(p.value[s.value].value),
        share: k(p.value[s.value].share)
      }, null, 8, ["label", "value", "share"])) : b("", !0)
    ]));
  }
}), Oh = ["width", "height", "viewBox", "aria-label"], jh = { class: "text-border" }, Dh = ["x1", "x2", "y1", "y2", "stroke-dasharray"], Th = { class: "fill-muted-foreground text-[10px]" }, Ih = ["x", "y"], Eh = ["x", "y"], Fh = ["cx", "cy", "r", "fill", "fill-opacity", "stroke", "opacity", "onMouseenter"], Nh = {
  key: 1,
  class: "mt-2 flex flex-wrap gap-3"
}, hM = /* @__PURE__ */ V({
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
    ke(() => {
      d = new ResizeObserver((Y) => {
        const G = Y[0]?.contentRect.width ?? 0;
        G > 0 && (s.value = G);
      }), r.value && d.observe(r.value);
    }), Me(() => d?.disconnect());
    const u = h(
      () => o.series?.length ? o.series : [{ name: "", points: o.data ?? [] }]
    ), c = (Y, G) => G.color ?? a[Y % a.length], v = h(() => u.value.flatMap((Y) => Y.points)), p = h(() => v.value.some((Y) => typeof Y.r == "number")), x = { top: 12, right: 16, bottom: 32, left: 48 }, M = h(() => Math.max(10, s.value - x.left - x.right)), $ = h(() => Math.max(10, o.height - x.top - x.bottom));
    function C(Y) {
      if (Y.length === 0)
        return [0, 1];
      const G = Math.min(...Y), R = Math.max(...Y), H = R - G || Math.abs(R) || 1;
      return [G - H * 0.08, R + H * 0.08];
    }
    const k = h(() => C(v.value.map((Y) => Y.x))), B = h(() => C(v.value.map((Y) => Y.y))), A = (Y) => {
      const [G, R] = k.value;
      return x.left + (Y - G) / (R - G) * M.value;
    }, w = (Y) => {
      const [G, R] = B.value;
      return x.top + $.value - (Y - G) / (R - G) * $.value;
    }, m = h(() => Math.max(...v.value.map((Y) => Y.r ?? 0), 0));
    function g(Y) {
      if (!p.value || !m.value)
        return 4;
      const G = Math.max(0, Y.r ?? 0) / m.value;
      return 3 + Math.sqrt(G) * (o.maxRadius - 3);
    }
    function S([Y, G]) {
      return Array.from({ length: 5 }, (R, H) => Y + (G - Y) / 4 * H);
    }
    const I = h(() => S(k.value)), j = h(() => S(B.value)), X = (Y) => o.formatX?.(Y) ?? String(Math.round(Y * 100) / 100), W = (Y) => o.formatY?.(Y) ?? String(Math.round(Y * 100) / 100), Q = h(() => {
      if (!i.value)
        return null;
      const Y = u.value[i.value.s], G = Y?.points[i.value.p];
      return G ? { series: Y, point: G } : null;
    });
    return (Y, G) => (t(), n("div", {
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
        l("g", jh, [
          (t(!0), n(P, null, O(j.value, (R, H) => (t(), n("line", {
            key: `gy-${H}`,
            x1: x.left,
            x2: x.left + M.value,
            y1: w(R),
            y2: w(R),
            stroke: "currentColor",
            "stroke-width": "1",
            "stroke-dasharray": H === 0 ? "0" : "3 3",
            opacity: "0.5"
          }, null, 8, Dh))), 128))
        ]),
        l("g", Th, [
          (t(!0), n(P, null, O(j.value, (R, H) => (t(), n("text", {
            key: `ty-${H}`,
            x: x.left - 8,
            y: w(R) + 3,
            "text-anchor": "end"
          }, f(W(R)), 9, Ih))), 128)),
          (t(!0), n(P, null, O(I.value, (R, H) => (t(), n("text", {
            key: `tx-${H}`,
            x: A(R),
            y: e.height - 10,
            "text-anchor": "middle"
          }, f(X(R)), 9, Eh))), 128))
        ]),
        (t(!0), n(P, null, O(u.value, (R, H) => (t(), n("g", {
          key: `s-${H}`
        }, [
          (t(!0), n(P, null, O(R.points, (ae, _) => (t(), n("circle", {
            key: `p-${H}-${_}`,
            cx: A(ae.x),
            cy: w(ae.y),
            r: g(ae),
            fill: c(H, R),
            "fill-opacity": p.value ? 0.55 : 0.85,
            stroke: c(H, R),
            "stroke-width": "1.5",
            class: "cursor-pointer transition-opacity",
            opacity: i.value && (i.value.s !== H || i.value.p !== _) ? 0.35 : 1,
            onMouseenter: (ee) => i.value = { s: H, p: _ },
            onMouseleave: G[0] || (G[0] = (ee) => i.value = null)
          }, null, 40, Fh))), 128))
        ]))), 128))
      ], 8, Oh)),
      Q.value ? (t(), T(wt, {
        key: 0,
        label: Q.value.point.label ?? Q.value.series.name ?? "Point",
        value: `${e.xLabel ? e.xLabel + " " : ""}${X(Q.value.point.x)} · ${e.yLabel ? e.yLabel + " " : ""}${W(Q.value.point.y)}`,
        share: p.value && Q.value.point.r != null ? String(Q.value.point.r) : null
      }, null, 8, ["label", "value", "share"])) : b("", !0),
      e.showLegend && u.value.length > 1 ? (t(), n("div", Nh, [
        (t(!0), n(P, null, O(u.value, (R, H) => (t(), n("span", {
          key: `l-${H}`,
          class: "text-muted-foreground flex items-center gap-1.5 text-xs"
        }, [
          l("span", {
            class: "size-2.5 rounded-full",
            style: ie({ backgroundColor: c(H, R) }),
            "aria-hidden": "true"
          }, null, 4),
          q(" " + f(R.name), 1)
        ]))), 128))
      ])) : b("", !0)
    ], 512));
  }
}), Rh = {
  key: 1,
  class: "relative flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap"
}, Hh = ["width", "height", "viewBox"], Uh = ["points"], Kh = ["x1", "y1", "x2", "y2"], qh = ["points", "fill", "stroke"], Gh = ["cx", "cy", "fill", "onMouseenter"], Wh = ["x", "y", "text-anchor"], Zh = {
  key: 0,
  class: "flex min-w-0 flex-col gap-1.5"
}, Yh = { class: "truncate" }, bM = /* @__PURE__ */ V({
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
    ], r = h(
      () => o.series.map((w, m) => ({
        ...w,
        color: w.color ?? a[m % a.length]
      }))
    ), s = h(() => r.value[0]?.points.map((w) => w.label) ?? []), i = h(() => s.value.length), d = h(() => o.height), u = h(() => d.value / 2), c = h(() => d.value / 2 - 34), v = h(() => {
      const w = Math.max(...r.value.flatMap((S) => S.points.map((I) => I.value)), 0);
      if (w <= 0)
        return 1;
      const m = 10 ** Math.floor(Math.log10(w));
      return ([1, 2, 2.5, 5, 10].find((S) => w <= S * m) ?? 10) * m;
    });
    function p(w) {
      return w / i.value * Math.PI * 2 - Math.PI / 2;
    }
    function x(w, m) {
      const g = p(w);
      return {
        x: u.value + Math.cos(g) * c.value * m,
        y: u.value + Math.sin(g) * c.value * m
      };
    }
    function M(w) {
      return Array.from({ length: i.value }, (m, g) => {
        const S = x(g, w);
        return `${S.x.toFixed(2)},${S.y.toFixed(2)}`;
      }).join(" ");
    }
    const $ = h(() => [0.25, 0.5, 0.75, 1].map((w) => ({ f: w, points: M(w) }))), C = h(
      () => r.value.map((w) => {
        const m = w.points.map((g) => Math.max(0, g.value) / v.value);
        return {
          name: w.name,
          color: w.color,
          values: w.points,
          outline: m.map((g, S) => {
            const I = x(S, g);
            return `${I.x.toFixed(2)},${I.y.toFixed(2)}`;
          }).join(" "),
          dots: m.map((g, S) => x(S, g))
        };
      })
    ), k = h(
      () => s.value.map((w, m) => {
        const g = p(m), S = u.value + Math.cos(g) * (c.value + 14), I = u.value + Math.sin(g) * (c.value + 14), j = Math.cos(g);
        return {
          label: w,
          x: S,
          y: I + 3,
          anchor: Math.abs(j) < 0.2 ? "middle" : j > 0 ? "start" : "end"
        };
      })
    ), B = K(null), A = (w) => o.format ? o.format(w) : new Intl.NumberFormat().format(w);
    return (w, m) => i.value < 3 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " A radar needs at least three axes ", 4)) : (t(), n("div", Rh, [
      (t(), n("svg", {
        width: d.value,
        height: d.value,
        viewBox: `0 0 ${d.value} ${d.value}`,
        class: "shrink-0"
      }, [
        (t(!0), n(P, null, O($.value, (g) => (t(), n("polygon", {
          key: g.f,
          points: g.points,
          fill: "none",
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, Uh))), 128)),
        (t(!0), n(P, null, O(s.value, (g, S) => (t(), n("line", {
          key: `spoke-${S}`,
          x1: u.value,
          y1: u.value,
          x2: x(S, 1).x,
          y2: x(S, 1).y,
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, Kh))), 128)),
        (t(!0), n(P, null, O(C.value, (g, S) => (t(), n("g", {
          key: `s-${S}`
        }, [
          l("polygon", {
            points: g.outline,
            fill: g.color,
            "fill-opacity": "0.16",
            stroke: g.color,
            "stroke-width": "2"
          }, null, 8, qh),
          (t(!0), n(P, null, O(g.dots, (I, j) => (t(), n("circle", {
            key: j,
            cx: I.x,
            cy: I.y,
            r: "3",
            fill: g.color,
            stroke: "var(--card)",
            "stroke-width": "1.5",
            class: "cursor-default",
            onMouseenter: (X) => B.value = {
              series: g.name,
              axis: s.value[j],
              value: g.values[j]?.value ?? 0
            },
            onMouseleave: m[0] || (m[0] = (X) => B.value = null)
          }, null, 40, Gh))), 128))
        ]))), 128)),
        (t(!0), n(P, null, O(k.value, (g, S) => (t(), n("text", {
          key: `l-${S}`,
          x: g.x,
          y: g.y,
          "text-anchor": g.anchor,
          class: "fill-muted-foreground text-[10px] capitalize"
        }, f(g.label), 9, Wh))), 128))
      ], 8, Hh)),
      e.showLegend ? (t(), n("ul", Zh, [
        (t(!0), n(P, null, O(r.value, (g, S) => (t(), n("li", {
          key: S,
          class: "flex items-center gap-2 text-xs"
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: g.color })
          }, null, 4),
          l("span", Yh, f(g.name), 1)
        ]))), 128))
      ])) : b("", !0),
      B.value ? (t(), T(wt, {
        key: 1,
        label: `${B.value.series} — ${B.value.axis}`,
        value: A(B.value.value)
      }, null, 8, ["label", "value"])) : b("", !0)
    ]));
  }
}), Jh = {
  key: 1,
  class: "relative flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap"
}, Qh = ["width", "height", "viewBox"], Xh = ["cx", "cy", "r"], eb = ["d", "fill", "fill-opacity", "onMouseenter"], tb = {
  key: 0,
  class: "flex min-w-0 flex-col gap-1.5"
}, ab = { class: "min-w-0 flex-1 truncate capitalize" }, nb = { class: "font-medium tabular-nums" }, yM = /* @__PURE__ */ V({
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
    ], r = K(null), s = h(() => o.height), i = h(() => s.value / 2), d = h(() => s.value / 2 - 6), u = h(() => Math.max(...o.data.map((M) => Math.max(0, M.value)), 0)), c = h(() => {
      const M = o.data.length;
      if (M === 0 || u.value <= 0)
        return [];
      const $ = Math.PI * 2 / M;
      return o.data.map((C, k) => {
        const B = Math.sqrt(Math.max(0, C.value) / u.value), A = d.value * B, w = k * $ - Math.PI / 2, m = w + $;
        return {
          ...C,
          color: a[k % a.length],
          share: u.value === 0 ? 0 : C.value / u.value,
          path: v(i.value, w, m, A)
        };
      });
    });
    function v(M, $, C, k) {
      if (k <= 0)
        return "";
      if (C - $ >= Math.PI * 2 - 1e-6)
        return `M${M - k},${M} A${k},${k} 0 1 1 ${M + k},${M} A${k},${k} 0 1 1 ${M - k},${M} Z`;
      const B = C - $ > Math.PI ? 1 : 0, A = M + Math.cos($) * k, w = M + Math.sin($) * k, m = M + Math.cos(C) * k, g = M + Math.sin(C) * k;
      return `M${M},${M} L${A.toFixed(2)},${w.toFixed(2)} A${k.toFixed(2)},${k.toFixed(2)} 0 ${B} 1 ${m.toFixed(2)},${g.toFixed(2)} Z`;
    }
    const p = h(() => [0.5, 0.75, 1].map((M) => d.value * M)), x = (M) => o.format ? o.format(M) : new Intl.NumberFormat().format(M);
    return (M, $) => c.value.length === 0 ? (t(), n("div", {
      key: 0,
      class: "text-muted-foreground flex items-center justify-center text-sm",
      style: ie({ height: `${e.height}px` })
    }, " No data ", 4)) : (t(), n("div", Jh, [
      (t(), n("svg", {
        width: s.value,
        height: s.value,
        viewBox: `0 0 ${s.value} ${s.value}`,
        class: "shrink-0"
      }, [
        (t(!0), n(P, null, O(p.value, (C) => (t(), n("circle", {
          key: C,
          cx: i.value,
          cy: i.value,
          r: C,
          fill: "none",
          stroke: "var(--border)",
          "stroke-width": "1"
        }, null, 8, Xh))), 128)),
        (t(!0), n(P, null, O(c.value, (C, k) => (t(), n("path", {
          key: k,
          d: C.path,
          fill: C.color,
          stroke: "var(--card)",
          "stroke-width": "1.5",
          class: "cursor-default transition-opacity",
          "fill-opacity": r.value === null || r.value === k ? 0.75 : 0.3,
          onMouseenter: (B) => r.value = k,
          onMouseleave: $[0] || ($[0] = (B) => r.value = null)
        }, null, 40, eb))), 128))
      ], 8, Qh)),
      e.showLegend ? (t(), n("ul", tb, [
        (t(!0), n(P, null, O(c.value, (C, k) => (t(), n("li", {
          key: k,
          class: "flex items-center gap-2 text-xs"
        }, [
          l("span", {
            class: "size-2.5 shrink-0 rounded-sm",
            style: ie({ background: C.color })
          }, null, 4),
          l("span", ab, f(C.label), 1),
          l("span", nb, f(x(C.value)), 1)
        ]))), 128))
      ])) : b("", !0),
      r.value !== null ? (t(), T(wt, {
        key: 1,
        label: c.value[r.value].label,
        value: x(c.value[r.value].value)
      }, null, 8, ["label", "value"])) : b("", !0)
    ]));
  }
}), lb = ["width", "height"], ob = ["x1", "x2", "y1", "y2"], sb = ["x", "y"], rb = ["x", "y"], ib = ["x", "y", "width", "height", "fill-opacity", "onMouseenter"], db = ["x", "y", "width", "height", "fill", "fill-opacity"], ub = ["d", "stroke"], cb = ["cx", "cy", "fill"], fb = ["x", "y"], mb = {
  key: 0,
  class: "bg-popover pointer-events-none absolute top-2 right-2 z-10 min-w-36 rounded-lg border p-2 shadow-lg"
}, pb = { class: "text-muted-foreground mb-1 text-[11px] capitalize" }, vb = { class: "text-muted-foreground min-w-0 flex-1 truncate text-[11px]" }, gb = { class: "text-xs font-semibold tabular-nums" }, hb = {
  key: 1,
  class: "mt-2 flex flex-wrap items-center gap-4"
}, bb = { class: "text-muted-foreground" }, xM = /* @__PURE__ */ V({
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
    ke(() => {
      i = new ResizeObserver((H) => {
        r.value = Math.max(160, H[0].contentRect.width);
      }), a.value && i.observe(a.value);
    }), Me(() => i?.disconnect());
    const d = ["var(--chart-2)", "var(--chart-4)", "var(--chart-3)"], u = ["var(--primary)", "var(--chart-5)"], c = h(
      () => o.bars.map((H, ae) => ({
        ...H,
        color: H.color ?? d[ae % d.length]
      }))
    ), v = h(
      () => o.lines.map((H, ae) => ({
        ...H,
        color: H.color ?? u[ae % u.length]
      }))
    ), p = h(
      () => c.value[0]?.points.map((H) => H.label) ?? v.value[0]?.points.map((H) => H.label) ?? []
    ), x = h(() => p.value.length), M = h(() => o.lineAxis === "right"), $ = h(() => ({
      top: 12,
      right: M.value ? 44 : 12,
      bottom: 26,
      left: 44
    })), C = h(() => ({
      w: Math.max(1, r.value - $.value.left - $.value.right),
      h: Math.max(1, o.height - $.value.top - $.value.bottom)
    }));
    function k(H) {
      const ae = Math.max(...H, 0);
      if (ae <= 0)
        return 1;
      const _ = 10 ** Math.floor(Math.log10(ae));
      return ([1, 2, 2.5, 5, 10].find((D) => ae <= D * _) ?? 10) * _;
    }
    const B = h(
      () => k([
        ...c.value.flatMap((H) => H.points.map((ae) => ae.value)),
        ...M.value ? [] : v.value.flatMap((H) => H.points.map((ae) => ae.value))
      ])
    ), A = h(
      () => M.value ? k(v.value.flatMap((H) => H.points.map((ae) => ae.value))) : B.value
    ), w = h(() => C.value.w / Math.max(1, x.value)), m = h(() => w.value * 0.6), g = h(() => m.value / Math.max(1, c.value.length));
    function S(H) {
      return $.value.left + H * w.value + w.value / 2;
    }
    const I = h(
      () => c.value.flatMap(
        (H, ae) => H.points.map((_, ee) => {
          const D = Math.max(0, _.value) / B.value * C.value.h;
          return {
            x: S(ee) - m.value / 2 + ae * g.value,
            y: $.value.top + C.value.h - D,
            w: Math.max(0, g.value - 2),
            h: D,
            color: H.color,
            index: ee,
            name: H.name,
            value: _.value,
            label: _.label
          };
        })
      )
    ), j = h(
      () => v.value.map((H) => {
        const ae = H.points.map((_, ee) => ({
          x: S(ee),
          y: $.value.top + C.value.h - Math.max(0, _.value) / A.value * C.value.h,
          value: _.value
        }));
        return {
          ...H,
          pts: ae,
          d: ae.map((_, ee) => `${ee === 0 ? "M" : "L"}${_.x.toFixed(2)},${_.y.toFixed(2)}`).join(" ")
        };
      })
    ), X = h(
      () => [0, 0.25, 0.5, 0.75, 1].map((H) => ({
        y: $.value.top + C.value.h * H,
        left: B.value * (1 - H),
        right: A.value * (1 - H)
      }))
    ), W = h(() => Math.max(1, Math.ceil(x.value / 10)));
    function Q(H) {
      return H === x.value - 1 || H % W.value === 0;
    }
    const Y = (H) => o.format ? o.format(H) : G(H);
    function G(H) {
      return Math.abs(H) >= 1e6 ? `${(H / 1e6).toFixed(1).replace(/\.0$/, "")}m` : Math.abs(H) >= 1e3 ? `${(H / 1e3).toFixed(1).replace(/\.0$/, "")}k` : new Intl.NumberFormat().format(Math.round(H * 100) / 100);
    }
    const R = h(() => {
      if (s.value === null)
        return null;
      const H = s.value;
      return {
        label: p.value[H],
        rows: [
          ...c.value.map((ae) => ({
            name: ae.name,
            color: ae.color,
            value: ae.points[H]?.value ?? 0
          })),
          ...v.value.map((ae) => ({
            name: ae.name,
            color: ae.color,
            value: ae.points[H]?.value ?? 0
          }))
        ]
      };
    });
    return (H, ae) => (t(), n("div", {
      ref_key: "host",
      ref: a,
      class: "relative w-full"
    }, [
      x.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(P, { key: 1 }, [
        (t(), n("svg", {
          width: r.value,
          height: e.height,
          class: "overflow-visible",
          onMouseleave: ae[0] || (ae[0] = (_) => s.value = null)
        }, [
          (t(!0), n(P, null, O(X.value, (_) => (t(), n("line", {
            key: `g-${_.y}`,
            x1: $.value.left,
            x2: r.value - $.value.right,
            y1: _.y,
            y2: _.y,
            stroke: "var(--border)",
            "stroke-width": "1"
          }, null, 8, ob))), 128)),
          (t(!0), n(P, null, O(X.value, (_) => (t(), n("text", {
            key: `lt-${_.y}`,
            x: $.value.left - 8,
            y: _.y + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[10px] tabular-nums"
          }, f(G(_.left)), 9, sb))), 128)),
          M.value ? (t(!0), n(P, { key: 0 }, O(X.value, (_) => (t(), n("text", {
            key: `rt-${_.y}`,
            x: r.value - $.value.right + 8,
            y: _.y + 3,
            "text-anchor": "start",
            class: "fill-muted-foreground text-[10px] tabular-nums"
          }, f(G(_.right)), 9, rb))), 128)) : b("", !0),
          (t(!0), n(P, null, O(p.value, (_, ee) => (t(), n("rect", {
            key: `hit-${ee}`,
            x: $.value.left + ee * w.value,
            y: $.value.top,
            width: w.value,
            height: C.value.h,
            fill: "var(--muted)",
            "fill-opacity": s.value === ee ? 0.4 : 0,
            onMouseenter: (D) => s.value = ee
          }, null, 40, ib))), 128)),
          (t(!0), n(P, null, O(I.value, (_, ee) => (t(), n("rect", {
            key: `b-${ee}`,
            x: _.x,
            y: _.y,
            width: _.w,
            height: _.h,
            fill: _.color,
            "fill-opacity": s.value === null || s.value === _.index ? 0.85 : 0.3,
            rx: "3",
            "pointer-events": "none"
          }, null, 8, db))), 128)),
          (t(!0), n(P, null, O(j.value, (_, ee) => (t(), n("g", {
            key: `l-${ee}`
          }, [
            l("path", {
              d: _.d,
              fill: "none",
              stroke: _.color,
              "stroke-width": "2.5",
              "stroke-linejoin": "round",
              "stroke-linecap": "round",
              "pointer-events": "none"
            }, null, 8, ub),
            s.value !== null && _.pts[s.value] ? (t(), n("circle", {
              key: 0,
              cx: _.pts[s.value].x,
              cy: _.pts[s.value].y,
              r: "4",
              fill: _.color,
              stroke: "var(--card)",
              "stroke-width": "2",
              "pointer-events": "none"
            }, null, 8, cb)) : b("", !0)
          ]))), 128)),
          (t(!0), n(P, null, O(p.value, (_, ee) => xe((t(), n("text", {
            key: `x-${ee}`,
            x: S(ee),
            y: e.height - 8,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[10px] capitalize"
          }, f(_), 9, fb)), [
            [Ye, Q(ee)]
          ])), 128))
        ], 40, lb)),
        R.value ? (t(), n("div", mb, [
          l("p", pb, f(R.value.label), 1),
          (t(!0), n(P, null, O(R.value.rows, (_, ee) => (t(), n("div", {
            key: ee,
            class: "flex items-center gap-2 py-0.5"
          }, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: _.color })
            }, null, 4),
            l("span", vb, f(_.name), 1),
            l("span", gb, f(Y(_.value)), 1)
          ]))), 128))
        ])) : b("", !0),
        e.showLegend ? (t(), n("div", hb, [
          (t(!0), n(P, null, O([...c.value, ...v.value], (_, ee) => (t(), n("span", {
            key: ee,
            class: "flex items-center gap-1.5 text-xs"
          }, [
            l("span", {
              class: "size-2 rounded-full",
              style: ie({ background: _.color })
            }, null, 4),
            l("span", bb, f(_.name), 1)
          ]))), 128))
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), yb = { class: "mb-3 flex flex-wrap items-center justify-center gap-3" }, xb = { class: "text-muted-foreground" }, kb = {
  key: 0,
  class: "text-muted-foreground mb-2 text-center text-xs"
}, $b = ["width", "height"], wb = ["x", "y"], Cb = ["x", "y", "width", "height", "fill", "fill-opacity", "onMouseenter"], Mb = ["x", "y"], Sb = {
  key: 1,
  class: "bg-popover pointer-events-none absolute top-0 right-0 z-10 rounded-lg border px-2.5 py-1.5 shadow-lg"
}, Bb = { class: "text-[11px] font-medium capitalize" }, Ab = { class: "text-muted-foreground text-[11px] capitalize" }, zb = { class: "text-sm font-semibold tabular-nums" }, Pb = { class: "text-muted-foreground text-xs font-normal" }, kM = /* @__PURE__ */ V({
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
    ke(() => {
      i = new ResizeObserver((m) => {
        r.value = Math.max(160, m[0].contentRect.width);
      }), a.value && i.observe(a.value);
    }), Me(() => i?.disconnect());
    const d = h(() => o.series[0]?.points.map((m) => m.label) ?? []), u = h(() => o.series.length), c = h(() => d.value.length), v = h(() => Math.min(140, Math.max(60, r.value * 0.16))), p = h(() => Math.max(1, r.value - v.value - 8)), x = h(() => p.value / Math.max(1, c.value)), M = h(() => Math.max(1, (o.height - 8) / Math.max(1, u.value)));
    function $(m) {
      if (m === 0)
        return "var(--muted)";
      const g = Math.max(1, o.buckets.length - 1);
      return `color-mix(in oklch, var(--primary) ${Math.round(m / g * 100)}%, var(--muted))`;
    }
    function C(m) {
      for (let g = 0; g < o.buckets.length; g++) {
        const S = o.buckets[g].max;
        if (S === void 0 || m < S)
          return g;
      }
      return o.buckets.length - 1;
    }
    const k = h(
      () => o.series.flatMap(
        (m, g) => m.points.map((S, I) => {
          const j = C(S.value);
          return {
            row: g,
            col: I,
            x: v.value + I * x.value,
            y: 4 + g * M.value,
            w: Math.max(1, x.value - 1),
            h: Math.max(1, M.value - 4),
            colour: $(j),
            label: S.label,
            value: S.value,
            rowName: m.name,
            bucketLabel: o.buckets[j].label
          };
        })
      )
    ), B = h(() => x.value < 2), A = h(() => s.value ? k.value.find((m) => m.row === s.value.row && m.col === s.value.col) ?? null : null), w = (m) => o.format ? o.format(m) : new Intl.NumberFormat().format(m);
    return (m, g) => (t(), n("div", {
      ref_key: "host",
      ref: a,
      class: "relative w-full"
    }, [
      u.value === 0 || c.value === 0 ? (t(), n("div", {
        key: 0,
        class: "text-muted-foreground flex items-center justify-center text-sm",
        style: ie({ height: `${e.height}px` })
      }, " No data ", 4)) : (t(), n(P, { key: 1 }, [
        l("div", yb, [
          (t(!0), n(P, null, O(e.buckets, (S, I) => (t(), n("span", {
            key: I,
            class: "flex items-center gap-1.5 text-[11px]"
          }, [
            l("span", {
              class: "size-3 rounded-sm border",
              style: ie({ background: $(I) })
            }, null, 4),
            l("span", xb, f(S.label), 1)
          ]))), 128))
        ]),
        B.value ? (t(), n("p", kb, f(c.value) + " columns - too many to label individually ", 1)) : b("", !0),
        (t(), n("svg", {
          width: r.value,
          height: e.height,
          class: "overflow-visible",
          onMouseleave: g[0] || (g[0] = (S) => s.value = null)
        }, [
          (t(!0), n(P, null, O(e.series, (S, I) => (t(), n("text", {
            key: `r-${I}`,
            x: v.value - 10,
            y: 4 + I * M.value + M.value / 2 + 3,
            "text-anchor": "end",
            class: "fill-muted-foreground text-[11px] capitalize"
          }, f(S.name), 9, wb))), 128)),
          (t(!0), n(P, null, O(k.value, (S, I) => (t(), n("rect", {
            key: I,
            x: S.x,
            y: S.y,
            width: S.w,
            height: S.h,
            fill: S.colour,
            "fill-opacity": s.value === null || s.value.row === S.row && s.value.col === S.col ? 1 : 0.55,
            rx: "1",
            class: "transition-[fill-opacity]",
            onMouseenter: (j) => s.value = { row: S.row, col: S.col }
          }, null, 40, Cb))), 128)),
          e.showColumnLabels && !B.value ? (t(!0), n(P, { key: 0 }, O(d.value, (S, I) => (t(), n("text", {
            key: `c-${I}`,
            x: v.value + I * x.value + x.value / 2,
            y: e.height - 2,
            "text-anchor": "middle",
            class: "fill-muted-foreground text-[9px]"
          }, f(S), 9, Mb))), 128)) : b("", !0)
        ], 40, $b)),
        A.value ? (t(), n("div", Sb, [
          l("p", Bb, f(A.value.label), 1),
          l("p", Ab, f(A.value.rowName), 1),
          l("p", zb, [
            q(f(w(A.value.value)) + " ", 1),
            l("span", Pb, "(" + f(A.value.bucketLabel) + ")", 1)
          ])
        ])) : b("", !0)
      ], 64))
    ], 512));
  }
}), _b = ["viewBox"], Vb = { key: 0 }, Lb = ["id"], Ob = ["stop-color"], jb = ["stop-color"], Db = ["d", "fill"], Tb = ["d", "stroke"], La = 100, mt = 30, Et = /* @__PURE__ */ V({
  __name: "Sparkline",
  props: {
    data: {},
    height: { default: 32 },
    color: { default: "var(--primary)" },
    filled: { type: Boolean, default: !1 },
    smooth: { type: Boolean, default: !0 }
  },
  setup(e) {
    const o = e, a = Math.random().toString(36).slice(2, 9), r = h(() => {
      const u = o.data.map((x) => x.value);
      if (u.length < 2)
        return [];
      const c = Math.min(...u), p = Math.max(...u) - c || 1;
      return u.map((x, M) => ({
        x: M / (u.length - 1) * La,
        y: mt - (x - c) / p * (mt - 4) - 2
      }));
    });
    function s(u) {
      const c = u.length;
      if (c < 2)
        return "";
      const v = [], p = [];
      for (let $ = 0; $ < c - 1; $++)
        v[$] = u[$ + 1].x - u[$].x, p[$] = v[$] === 0 ? 0 : (u[$ + 1].y - u[$].y) / v[$];
      const x = [p[0]];
      for (let $ = 1; $ < c - 1; $++)
        if (p[$ - 1] * p[$] <= 0)
          x[$] = 0;
        else {
          const C = 2 * v[$] + v[$ - 1], k = v[$] + 2 * v[$ - 1];
          x[$] = (C + k) / (C / p[$ - 1] + k / p[$]);
        }
      x[c - 1] = p[c - 2];
      let M = `M${u[0].x.toFixed(2)},${u[0].y.toFixed(2)}`;
      for (let $ = 0; $ < c - 1; $++) {
        const C = v[$] / 3;
        M += ` C${(u[$].x + C).toFixed(2)},${(u[$].y + x[$] * C).toFixed(2)} ${(u[$ + 1].x - C).toFixed(2)},${(u[$ + 1].y - x[$ + 1] * C).toFixed(2)} ${u[$ + 1].x.toFixed(2)},${u[$ + 1].y.toFixed(2)}`;
      }
      return M;
    }
    const i = h(() => {
      const u = r.value;
      return u.length < 2 ? "" : o.smooth ? s(u) : u.map((c, v) => `${v === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(" ");
    }), d = h(() => {
      const u = r.value;
      return !o.filled || u.length < 2 ? "" : `${i.value} L${u[u.length - 1].x.toFixed(2)},${mt} L${u[0].x.toFixed(2)},${mt} Z`;
    });
    return (u, c) => i.value ? (t(), n("svg", {
      key: 0,
      viewBox: `0 0 ${La} ${mt}`,
      preserveAspectRatio: "none",
      class: "w-full",
      style: ie({ height: `${e.height}px` }),
      "aria-hidden": "true"
    }, [
      e.filled ? (t(), n("defs", Vb, [
        l("linearGradient", {
          id: `pk-spark-${y(a)}`,
          x1: "0",
          y1: "0",
          x2: "0",
          y2: "1"
        }, [
          l("stop", {
            offset: "0%",
            "stop-color": e.color,
            "stop-opacity": "0.35"
          }, null, 8, Ob),
          l("stop", {
            offset: "100%",
            "stop-color": e.color,
            "stop-opacity": "0"
          }, null, 8, jb)
        ], 8, Lb)
      ])) : b("", !0),
      e.filled ? (t(), n("path", {
        key: 1,
        d: d.value,
        fill: `url(#pk-spark-${y(a)})`
      }, null, 8, Db)) : b("", !0),
      l("path", {
        d: i.value,
        fill: "none",
        stroke: e.color,
        "stroke-width": "1.5",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "vector-effect": "non-scaling-stroke"
      }, null, 8, Tb)
    ], 12, _b)) : b("", !0);
  }
}), Ib = { class: "flex items-center gap-1 text-xs" }, Eb = {
  "aria-hidden": "true",
  class: "text-[9px]"
}, Fb = {
  key: 0,
  class: "text-muted-foreground truncate"
}, mn = /* @__PURE__ */ V({
  __name: "TrendBadge",
  props: {
    direction: {},
    percentage: {},
    comparison: {},
    inverted: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = h(() => o.direction === "flat" ? null : o.direction === "new" ? !o.inverted : o.inverted ? o.direction === "down" : o.direction === "up"), r = h(
      () => a.value === null ? "text-muted-foreground" : a.value ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
    ), s = h(
      () => o.direction === "flat" ? "→" : o.direction === "down" ? "▼" : "▲"
    ), i = h(() => o.direction === "new" ? "New" : o.percentage === null ? "-" : `${Math.abs(o.percentage)}%`);
    return (d, u) => (t(), n("span", Ib, [
      l("span", {
        class: z(["flex items-center gap-0.5 font-medium tabular-nums", r.value])
      }, [
        l("span", Eb, f(s.value), 1),
        q(" " + f(i.value), 1)
      ], 2),
      e.comparison ? (t(), n("span", Fb, f(e.comparison), 1)) : b("", !0)
    ]));
  }
}), Nb = ["data-collapsed", "aria-busy"], Rb = { class: "flex flex-wrap items-start justify-between gap-2" }, Hb = { class: "flex min-w-0 items-start gap-2" }, Ub = {
  key: 0,
  class: "text-muted-foreground mt-0.5 size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Kb = ["d"], qb = { class: "min-w-0" }, Gb = { class: "text-sm font-medium" }, Wb = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, Zb = { class: "flex shrink-0 items-center gap-1.5" }, Yb = {
  key: 0,
  class: "bg-muted/60 flex items-center gap-0.5 rounded-md p-0.5",
  role: "group",
  "aria-label": "Period"
}, Jb = ["aria-pressed", "onClick"], Qb = ["aria-expanded", "aria-label", "title"], Xb = ["aria-label"], e0 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, t0 = ["d"], a0 = /* @__PURE__ */ V({
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
    const o = e, a = aa(), r = K(o.defaultCollapsed), s = h(() => !!o.icon && !a.icon), i = h(() => {
      if (!(o.fitBody && !o.loading && !o.error))
        return { minHeight: `${o.bodyHeight}px` };
    });
    return (d, u) => (t(), n("div", {
      class: z(["@container/card bg-card flex w-full flex-col self-start rounded-lg border", r.value ? "px-4 py-2" : "gap-3 p-4"]),
      "data-slot": "chart-card",
      "data-collapsed": r.value ? "true" : "false",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      l("div", Rb, [
        l("div", Hb, [
          Z(d.$slots, "icon", {}, () => [
            s.value ? (t(), n("svg", Ub, [
              l("path", {
                d: y(me)(e.icon)
              }, null, 8, Kb)
            ])) : b("", !0)
          ]),
          l("div", qb, [
            l("p", Gb, f(e.label), 1),
            e.description ? (t(), n("p", Wb, f(e.description), 1)) : b("", !0),
            Z(d.$slots, "trend")
          ])
        ]),
        l("div", Zb, [
          Z(d.$slots, "actions"),
          e.periods && e.periods.length ? (t(), n("div", Yb, [
            (t(!0), n(P, null, O(e.periods, (c) => (t(), n("button", {
              key: c.value,
              type: "button",
              class: z([
                "rounded px-2 py-1 text-xs transition-colors",
                e.period === c.value ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
              ]),
              "aria-pressed": e.period === c.value,
              onClick: (v) => d.$emit("update:period", c.value)
            }, f(c.label), 11, Jb))), 128))
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
          ], 8, Qb)) : b("", !0),
          e.hideable ? (t(), n("button", {
            key: 2,
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-label": `Hide ${e.label}`,
            title: "Hide",
            onClick: u[1] || (u[1] = (c) => d.$emit("hide"))
          }, [
            (t(), n("svg", e0, [
              l("path", {
                d: y(me)("eye-off")
              }, null, 8, t0)
            ]))
          ], 8, Xb)) : b("", !0)
        ])
      ]),
      r.value ? b("", !0) : (t(), n("div", {
        key: 0,
        style: ie(i.value),
        class: "flex flex-col justify-center",
        "data-slot": "chart-card-body"
      }, [
        e.loading ? (t(), T(je, {
          key: 0,
          variant: "block",
          height: e.bodyHeight
        }, null, 8, ["height"])) : e.error ? (t(), n("p", {
          key: 1,
          class: "text-destructive flex flex-col items-center justify-center gap-3 text-sm",
          style: ie({ height: `${e.bodyHeight}px` }),
          role: "alert"
        }, [
          u[4] || (u[4] = q(" Could not load ", -1)),
          e.retryable ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            onClick: u[2] || (u[2] = (c) => d.$emit("retry"))
          }, " Try again ")) : b("", !0)
        ], 4)) : Z(d.$slots, "default", {}, void 0, void 0, 2)
      ], 4))
    ], 10, Nb));
  }
}), n0 = ["aria-pressed", "aria-label", "title"], l0 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, o0 = ["d"], s0 = {
  key: 0,
  class: "flex flex-col items-start gap-2 py-1",
  "data-slot": "shortcuts-empty"
}, r0 = {
  key: 1,
  class: "flex flex-wrap items-center gap-x-5 gap-y-2"
}, i0 = ["href"], d0 = {
  class: "size-3.5 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, u0 = ["d"], c0 = ["aria-label", "onClick"], f0 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, m0 = ["d"], p0 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, v0 = ["d"], g0 = {
  key: 0,
  class: "flex flex-col gap-1"
}, h0 = ["onClick"], b0 = {
  class: "text-muted-foreground size-4 shrink-0",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, y0 = ["d"], x0 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, k0 = /* @__PURE__ */ V({
  __name: "ShortcutsWidget",
  props: {
    items: {},
    catalog: {},
    hideable: { type: Boolean, default: !1 }
  },
  emits: ["update:items", "hide"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(!1), i = K(!1), d = h(
      () => a.catalog.filter((v) => !a.items.some((p) => p.id === v.id))
    );
    function u(v) {
      r(
        "update:items",
        a.items.filter((p) => p.id !== v)
      );
    }
    function c(v) {
      r("update:items", [...a.items, v]), i.value = !1;
    }
    return (v, p) => (t(), n(P, null, [
      F(a0, {
        label: "Shortcuts",
        icon: "star",
        hideable: e.hideable,
        "fit-body": !0,
        "body-height": 72,
        onHide: p[3] || (p[3] = (x) => r("hide"))
      }, {
        actions: L(() => [
          l("button", {
            type: "button",
            class: "text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors",
            "aria-pressed": s.value,
            "aria-label": s.value ? "Done editing shortcuts" : "Edit shortcuts",
            title: s.value ? "Done" : "Edit",
            onClick: p[0] || (p[0] = (x) => s.value = !s.value)
          }, [
            (t(), n("svg", l0, [
              l("path", {
                d: y(me)(s.value ? "check" : "pencil")
              }, null, 8, o0)
            ]))
          ], 8, n0)
        ]),
        default: L(() => [
          e.items.length === 0 ? (t(), n("div", s0, [
            p[7] || (p[7] = l("p", { class: "text-muted-foreground text-sm font-normal" }, "No shortcuts yet.", -1)),
            F(ue, {
              size: "sm",
              variant: "outline",
              onClick: p[1] || (p[1] = (x) => i.value = !0)
            }, {
              default: L(() => [...p[6] || (p[6] = [
                q("Add shortcut", -1)
              ])]),
              _: 1
            })
          ])) : (t(), n("div", r0, [
            (t(!0), n(P, null, O(e.items, (x) => (t(), n("div", {
              key: x.id,
              class: "inline-flex items-center gap-1"
            }, [
              l("a", {
                href: x.href,
                class: "text-primary inline-flex items-center gap-1.5 text-sm hover:underline"
              }, [
                (t(), n("svg", d0, [
                  l("path", {
                    d: y(me)(x.icon)
                  }, null, 8, u0)
                ])),
                q(" " + f(x.label), 1)
              ], 8, i0),
              s.value ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "text-muted-foreground hover:text-destructive rounded p-0.5",
                "aria-label": `Remove ${x.label}`,
                onClick: (M) => u(x.id)
              }, [
                (t(), n("svg", f0, [
                  l("path", {
                    d: y(me)("x")
                  }, null, 8, m0)
                ]))
              ], 8, c0)) : b("", !0)
            ]))), 128)),
            s.value ? (t(), n("button", {
              key: 0,
              type: "button",
              class: "text-primary inline-flex items-center gap-1.5 text-sm hover:underline",
              onClick: p[2] || (p[2] = (x) => i.value = !0)
            }, [
              (t(), n("svg", p0, [
                l("path", {
                  d: y(me)("plus")
                }, null, 8, v0)
              ])),
              p[8] || (p[8] = q(" Add ", -1))
            ])) : b("", !0)
          ]))
        ]),
        _: 1
      }, 8, ["hideable"]),
      F(bt, {
        open: i.value,
        title: "Add a shortcut",
        description: "Pick a screen this dashboard already knows.",
        onClose: p[5] || (p[5] = (x) => i.value = !1)
      }, {
        footer: L(() => [
          F(ue, {
            variant: "outline",
            onClick: p[4] || (p[4] = (x) => i.value = !1)
          }, {
            default: L(() => [...p[9] || (p[9] = [
              q("Cancel", -1)
            ])]),
            _: 1
          })
        ]),
        default: L(() => [
          d.value.length ? (t(), n("ul", g0, [
            (t(!0), n(P, null, O(d.value, (x) => (t(), n("li", {
              key: x.id
            }, [
              l("button", {
                type: "button",
                class: "hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                onClick: (M) => c(x)
              }, [
                (t(), n("svg", b0, [
                  l("path", {
                    d: y(me)(x.icon)
                  }, null, 8, y0)
                ])),
                q(" " + f(x.label), 1)
              ], 8, h0)
            ]))), 128))
          ])) : (t(), n("p", x0, " Every catalog shortcut is already on the card. "))
        ]),
        _: 1
      }, 8, ["open"])
    ], 64));
  }
}), $0 = ["aria-busy"], w0 = { class: "flex flex-1 flex-col gap-1 p-4" }, C0 = { class: "text-muted-foreground relative text-xs font-medium" }, M0 = {
  key: 1,
  class: "text-destructive relative flex h-8 items-center gap-3 text-sm",
  role: "alert"
}, S0 = {
  key: 2,
  class: "relative flex h-8 items-center text-2xl font-semibold tabular-nums"
}, B0 = {
  key: 4,
  class: "text-muted-foreground relative text-xs"
}, A0 = {
  key: 0,
  class: "-mb-px",
  "aria-hidden": "true"
}, $M = /* @__PURE__ */ V({
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
      l("div", w0, [
        l("p", C0, f(e.label), 1),
        e.loading ? (t(), T(je, {
          key: 0,
          variant: "number",
          class: "my-1"
        })) : e.error ? (t(), n("div", M0, [
          r[1] || (r[1] = l("span", null, "Could not load", -1)),
          e.retryable ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-accent rounded-md border px-2 py-1 text-xs font-medium transition-colors",
            onClick: r[0] || (r[0] = (s) => a.$emit("retry"))
          }, " Retry ")) : b("", !0)
        ])) : (t(), n("span", S0, f(o(e.value)), 1)),
        e.trend && !e.loading && !e.error ? (t(), T(mn, {
          key: 3,
          class: "relative",
          direction: e.trend.direction,
          percentage: e.trend.percentage,
          comparison: e.comparison,
          inverted: e.inverted
        }, null, 8, ["direction", "percentage", "comparison", "inverted"])) : e.description ? (t(), n("p", B0, f(e.description), 1)) : b("", !0)
      ]),
      e.sparkline && e.sparkline.length > 1 && !e.loading && !e.error ? (t(), n("div", A0, [
        F(Et, {
          data: e.sparkline,
          height: 44,
          filled: ""
        }, null, 8, ["data"])
      ])) : b("", !0)
    ], 8, $0));
  }
}), z0 = { class: "bg-card relative flex flex-col overflow-hidden rounded-lg border" }, P0 = { class: "flex flex-col gap-1 p-4" }, _0 = { class: "flex items-start justify-between gap-2" }, V0 = { class: "text-sm font-medium" }, L0 = {
  key: 0,
  class: "text-muted-foreground font-mono text-xs"
}, O0 = { class: "mt-1 flex flex-wrap items-center gap-2" }, j0 = {
  key: 1,
  class: "text-xl font-semibold tabular-nums"
}, D0 = {
  key: 0,
  class: "-mb-px"
}, jt = /* @__PURE__ */ V({
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
    const o = e, a = h(() => o.delta === null || o.delta === 0 ? null : o.inverted ? o.delta < 0 : o.delta > 0), r = h(
      () => a.value === null ? "bg-muted text-muted-foreground" : a.value ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    ), s = h(
      () => typeof o.value == "number" ? new Intl.NumberFormat().format(o.value) : o.value
    );
    return (i, d) => (t(), n("div", z0, [
      l("div", P0, [
        l("div", _0, [
          l("p", V0, f(e.label), 1),
          Z(i.$slots, "menu")
        ]),
        e.caption ? (t(), n("p", L0, f(e.caption), 1)) : b("", !0),
        l("div", O0, [
          e.loading ? (t(), T(je, {
            key: 0,
            variant: "number"
          })) : (t(), n("span", j0, f(s.value), 1)),
          e.delta !== null && !e.loading ? (t(), n("span", {
            key: 2,
            class: z(["rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums", r.value])
          }, f(e.delta > 0 ? "+" : "") + f(e.delta) + "% ", 3)) : b("", !0)
        ])
      ]),
      e.series && e.series.length > 1 && !e.loading ? (t(), n("div", D0, [
        F(Et, {
          data: e.series,
          color: e.color,
          height: 56,
          filled: ""
        }, null, 8, ["data", "color"])
      ])) : b("", !0)
    ]));
  }
}), T0 = { class: "relative flex flex-col gap-2" }, I0 = ["aria-label"], E0 = ["onMouseenter"], F0 = {
  key: 0,
  class: "flex flex-wrap gap-x-6 gap-y-1"
}, N0 = { class: "text-muted-foreground flex items-center gap-1.5 text-xs" }, R0 = { class: "truncate" }, H0 = { class: "text-sm font-semibold tabular-nums" }, wM = /* @__PURE__ */ V({
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
    ], r = h(() => o.segments.reduce((v, p) => v + Math.max(0, p.value), 0)), s = h(() => Math.max(o.total ?? r.value, r.value, 1)), i = h(
      () => o.segments.map((v, p) => {
        const x = Math.max(0, v.value) / s.value;
        return {
          ...v,
          color: v.color ?? a[p % a.length],
          share: x,
          // A visible sliver rather than nothing, for a non-zero value too
          // small to round to a pixel.
          width: v.value > 0 ? `max(2px, ${(x * 100).toFixed(2)}%)` : "0px"
        };
      })
    ), d = (v) => o.format ? o.format(v) : new Intl.NumberFormat().format(v), u = K(null), c = (v) => `${(v * 100).toFixed(v > 0 && v < 0.01 ? 1 : 0)}%`;
    return (v, p) => (t(), n("div", T0, [
      l("div", {
        class: "bg-muted flex w-full overflow-hidden rounded-full",
        style: ie({ height: `${e.height}px` }),
        role: "img",
        "aria-label": e.segments.map((x) => `${x.label} ${d(x.value)}`).join(", ")
      }, [
        (t(!0), n(P, null, O(i.value, (x, M) => (t(), n("span", {
          key: M,
          class: z(["h-full transition-all", [
            M === 0 ? "rounded-l-full" : "",
            M === i.value.length - 1 && !e.total ? "rounded-r-full" : ""
          ]]),
          style: ie({
            width: x.width,
            background: x.color,
            opacity: u.value === null || u.value === M ? 1 : 0.4
          }),
          onMouseenter: ($) => u.value = M,
          onMouseleave: p[0] || (p[0] = ($) => u.value = null)
        }, null, 46, E0))), 128))
      ], 12, I0),
      e.showLegend ? (t(), n("div", F0, [
        (t(!0), n(P, null, O(i.value, (x, M) => (t(), n("div", {
          key: M,
          class: "flex min-w-0 flex-col"
        }, [
          l("span", N0, [
            l("span", {
              class: "size-2 shrink-0 rounded-full",
              style: ie({ background: x.color })
            }, null, 4),
            l("span", R0, f(x.label), 1)
          ]),
          l("span", H0, f(d(x.value)), 1)
        ]))), 128))
      ])) : b("", !0),
      u.value !== null ? (t(), T(wt, {
        key: 1,
        label: i.value[u.value].label,
        value: d(i.value[u.value].value),
        share: c(i.value[u.value].share)
      }, null, 8, ["label", "value", "share"])) : b("", !0)
    ]));
  }
}), U0 = {
  class: "divide-border flex flex-col divide-y",
  "data-slot": "stat-list"
}, K0 = ["data-heading"], q0 = {
  key: 1,
  class: "flex items-center justify-between gap-3 text-sm"
}, G0 = { class: "text-muted-foreground truncate" }, W0 = ["aria-label"], CM = /* @__PURE__ */ V({
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
    }, s = h(
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
    return (i, d) => (t(), n("div", U0, [
      (t(!0), n(P, null, O(s.value, (u) => (t(), n("div", {
        key: u.key,
        class: "flex flex-col gap-1.5 py-2.5 first:pt-0 last:pb-0",
        "data-heading": u.heading ? "true" : void 0
      }, [
        u.heading ? (t(), n("div", {
          key: 0,
          class: z(["pt-1 text-xs font-semibold tracking-wide uppercase", u.tone ? a[u.tone] : "text-muted-foreground"])
        }, f(u.label), 3)) : (t(), n("div", q0, [
          l("span", G0, f(u.label), 1),
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
          (t(!0), n(P, null, O(u.segments, (c, v) => (t(), n("span", {
            key: v,
            class: z(["h-full transition-all", r[c.tone ?? "neutral"]]),
            style: ie({ width: c.width })
          }, null, 6))), 128))
        ], 8, W0)) : b("", !0)
      ], 8, K0))), 128))
    ]));
  }
}), Z0 = {
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
}, Y0 = {
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "info",
  neutral: "outline"
};
function J0(e) {
  return e.trim().toLowerCase().replace(/\s+/g, "-");
}
function Q0(e, o) {
  return o || (e ? Z0[J0(e)] ?? "neutral" : "neutral");
}
function X0(e, o) {
  return Y0[Q0(e, o)];
}
const Be = /* @__PURE__ */ V({
  __name: "PkStatusBadge",
  props: {
    status: { default: null },
    tone: { default: null },
    class: {}
  },
  setup(e) {
    const o = e, a = h(() => X0(o.status, o.tone));
    return (r, s) => (t(), T(Ne, {
      variant: a.value,
      class: z(o.class)
    }, {
      default: L(() => [
        Z(r.$slots, "default", {}, () => [
          q(f(e.status), 1)
        ])
      ]),
      _: 3
    }, 8, ["variant", "class"]));
  }
}), ey = ["data-layout"], ty = ["src", "alt"], ay = {
  key: 1,
  class: "text-muted-foreground flex size-full items-center justify-center text-lg font-medium"
}, ny = ["src"], ly = {
  key: 3,
  class: "absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1",
  "data-slot": "catalog-dots"
}, oy = ["onMouseenter"], sy = { class: "flex min-w-0 flex-1 items-start justify-between gap-2" }, ry = { class: "min-w-0" }, iy = { class: "truncate text-sm font-medium" }, dy = {
  key: 0,
  class: "text-muted-foreground truncate text-xs"
}, uy = {
  key: 1,
  class: "text-muted-foreground line-clamp-2 text-xs"
}, cy = { class: "mt-auto flex items-end justify-between gap-2 pt-1" }, fy = { class: "min-w-0" }, my = {
  key: 0,
  class: "text-sm font-semibold tabular-nums"
}, py = {
  key: 1,
  class: "text-muted-foreground text-xs font-normal tabular-nums"
}, vy = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, gy = ["d"], hy = ["aria-label"], by = /* @__PURE__ */ V({
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
      const B = k.trim();
      return B === "" ? null : /^(https?:)?\/\//i.test(B) ? B : null;
    }
    const u = h(() => {
      const k = [r.item.image, ...r.item.images ?? []].map(d).filter((B) => B !== null);
      return [...new Set(k)];
    }), c = h(() => u.value[i.value] ?? u.value[0] ?? null), v = h(
      () => r.item.label.split(/\s+/).slice(0, 2).map((k) => k[0]?.toUpperCase() ?? "").join("")
    ), p = h(() => {
      const k = r.item.progress;
      if (!k)
        return null;
      const B = Math.max(k.total ?? 100, k.value, 1);
      return `${Math.min(100, Math.max(0, k.value / B * 100)).toFixed(2)}%`;
    }), x = h(() => u.value.length > 1 ? u.value[1] : null), M = h(
      () => (r.item.kind ?? "product") === "product" && r.item.status !== "out-of-stock"
    ), $ = h(() => typeof r.item.stock != "number" ? null : `${r.item.stock} in stock`);
    function C(k) {
      k.stopPropagation(), s("cart", r.item.key);
    }
    return (k, B) => (t(), n("article", {
      "data-slot": "catalog-card",
      class: z(["bg-card hover:bg-muted/40 flex w-full cursor-pointer overflow-hidden rounded-lg border text-left transition-colors", e.layout === "list" ? "flex-row items-stretch" : "flex-col"]),
      "data-layout": e.layout,
      role: "button",
      tabindex: "0",
      onClick: B[0] || (B[0] = (A) => s("select", e.item.key)),
      onKeydown: B[1] || (B[1] = zt(be((A) => s("select", e.item.key), ["prevent"]), ["enter"])),
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
        }, null, 8, ty)) : (t(), n("span", ay, f(v.value), 1)),
        e.layout === "grid" && x.value && i.value === 0 ? (t(), n("img", {
          key: 2,
          src: x.value,
          alt: "",
          loading: "lazy",
          class: "ring-background pointer-events-none absolute right-1.5 bottom-1.5 size-10 rounded-md object-cover ring-2",
          "data-slot": "catalog-peek"
        }, null, 8, ny)) : b("", !0),
        e.layout === "grid" && u.value.length > 1 ? (t(), n("div", ly, [
          (t(!0), n(P, null, O(u.value, (A, w) => (t(), n("span", {
            key: w,
            class: z(["size-1.5 rounded-full", w === i.value ? "bg-background" : "bg-background/50"]),
            onMouseenter: (m) => i.value = w
          }, null, 42, oy))), 128))
        ])) : b("", !0)
      ], 2),
      l("div", {
        class: z(["flex min-w-0 flex-1", e.layout === "list" ? "items-center gap-3 p-3" : "flex-col gap-1 p-3"])
      }, [
        l("div", sy, [
          l("div", ry, [
            l("p", iy, f(e.item.label), 1),
            e.item.caption ? (t(), n("p", dy, f(e.item.caption), 1)) : b("", !0),
            e.item.facts?.length ? (t(), n("p", uy, f(e.item.facts.join(" · ")), 1)) : b("", !0)
          ]),
          e.item.status ? (t(), T(Be, {
            key: 0,
            status: e.item.status,
            tone: e.item.tone
          }, null, 8, ["status", "tone"])) : b("", !0)
        ]),
        l("div", cy, [
          l("div", fy, [
            e.item.price ? (t(), n("p", my, f(e.item.price), 1)) : b("", !0),
            $.value ? (t(), n("p", py, f($.value), 1)) : b("", !0)
          ]),
          M.value ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-foreground hover:bg-muted inline-flex size-8 shrink-0 items-center justify-center rounded-md border",
            "aria-label": "Add to cart",
            "data-slot": "catalog-cart",
            onClick: C
          }, [
            (t(), n("svg", vy, [
              l("path", {
                d: y(me)("cart")
              }, null, 8, gy)
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
            class: z(["block h-full", a[e.item.progress?.tone ?? "neutral"]]),
            style: ie({ width: p.value })
          }, null, 6)
        ], 8, hy)) : b("", !0)
      ], 2)
    ], 42, ey));
  }
});
function yy(e) {
  return e === 30 ? "Per month" : e === 365 ? "Per year" : "Lifetime";
}
function xy(e) {
  return e === !0 || e === !1 ? "" : e === -1 || e === "-1" ? "Unlimited" : Array.isArray(e) ? e.join(", ") : String(e);
}
function ky(e) {
  return e === !1 || e === 0 || e === "0" || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : !0;
}
const $y = ["data-featured", "data-recommended"], wy = { class: "flex flex-col gap-1" }, Cy = {
  key: 0,
  class: "text-muted-foreground mb-1 flex flex-wrap gap-2 text-xs font-medium"
}, My = { key: 0 }, Sy = { key: 1 }, By = { key: 2 }, Ay = { key: 3 }, zy = { class: "text-sm font-semibold" }, Py = { class: "flex items-baseline gap-1" }, _y = { class: "text-3xl font-semibold tracking-tight tabular-nums" }, Vy = { class: "text-muted-foreground text-sm font-normal" }, Ly = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal text-pretty"
}, Oy = { class: "text-muted-foreground mt-1 text-xs" }, jy = { class: "flex flex-1 flex-col gap-2 text-sm" }, Dy = { class: "flex min-w-0 items-start gap-2" }, Ty = {
  key: 0,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Iy = ["d"], Ey = {
  key: 1,
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Fy = ["d"], Ny = { class: "capitalize" }, Ry = {
  key: 0,
  class: "text-muted-foreground max-w-[40%] shrink-0 text-end text-xs font-medium"
}, Hy = { class: "text-foreground font-medium" }, Uy = { class: "mt-auto flex gap-2 pt-2" }, Ky = /* @__PURE__ */ V({
  __name: "PlanCard",
  props: {
    plan: {},
    canDelete: { type: Boolean, default: !0 }
  },
  emits: ["edit", "delete"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(() => a.plan.priceFormatted ?? String(a.plan.price)), i = h(() => !!(a.plan.featured || a.plan.recommended)), d = h(() => {
      const c = a.plan.perks ?? {};
      return Object.entries(c).map(([v, p]) => ({
        key: v,
        label: v.replace(/_/g, " "),
        granted: ky(p.value),
        display: xy(p.value)
      }));
    }), u = h(() => a.plan.extraPerks ?? []);
    return (c, v) => (t(), n("article", {
      class: z(["bg-card text-card-foreground hover:bg-muted/40 flex cursor-pointer flex-col gap-4 rounded-lg border p-6 text-left transition-colors", i.value ? "border-primary shadow-sm" : ""]),
      "data-slot": "plan-card",
      "data-featured": e.plan.featured ? "true" : void 0,
      "data-recommended": e.plan.recommended ? "true" : void 0,
      role: "button",
      tabindex: "0",
      onClick: v[2] || (v[2] = (p) => r("edit", e.plan.id)),
      onKeydown: v[3] || (v[3] = zt(be((p) => r("edit", e.plan.id), ["prevent"]), ["enter"]))
    }, [
      l("header", wy, [
        e.plan.recommended || e.plan.featured || e.plan.trial || e.plan.active === !1 ? (t(), n("p", Cy, [
          e.plan.recommended ? (t(), n("span", My, "Recommended")) : e.plan.featured ? (t(), n("span", Sy, "Featured")) : b("", !0),
          e.plan.trial ? (t(), n("span", By, "Trial")) : b("", !0),
          e.plan.active === !1 ? (t(), n("span", Ay, "Inactive")) : b("", !0)
        ])) : b("", !0),
        l("h3", zy, f(e.plan.name), 1),
        l("p", Py, [
          l("span", _y, f(s.value), 1),
          l("span", Vy, f(y(yy)(e.plan.days)), 1)
        ]),
        e.plan.shortDescription ? (t(), n("p", Ly, f(e.plan.shortDescription), 1)) : b("", !0),
        l("p", Oy, " Active seats: " + f(e.plan.activeUsers ?? 0), 1)
      ]),
      l("ul", jy, [
        (t(!0), n(P, null, O(d.value, (p) => (t(), n("li", {
          key: p.key,
          class: "flex items-start justify-between gap-3"
        }, [
          l("span", Dy, [
            l("span", {
              class: z(["mt-0.5 shrink-0", p.granted ? "text-success" : "text-muted-foreground"]),
              "aria-hidden": "true"
            }, [
              p.granted ? (t(), n("svg", Ty, [
                l("path", {
                  d: y(me)("check")
                }, null, 8, Iy)
              ])) : (t(), n("svg", Ey, [
                l("path", {
                  d: y(me)("x")
                }, null, 8, Fy)
              ]))
            ], 2),
            l("span", Ny, f(p.label), 1)
          ]),
          p.display ? (t(), n("span", Ry, f(p.display), 1)) : b("", !0)
        ]))), 128)),
        (t(!0), n(P, null, O(u.value, (p, x) => (t(), n("li", {
          key: `extra-${x}`,
          class: "text-muted-foreground flex justify-between gap-3 text-sm"
        }, [
          l("span", null, f(p.key), 1),
          l("span", Hy, f(p.value), 1)
        ]))), 128))
      ]),
      l("footer", Uy, [
        F(ue, {
          class: "flex-1",
          variant: "default",
          size: "sm",
          onClick: v[0] || (v[0] = be((p) => r("edit", e.plan.id), ["stop"]))
        }, {
          default: L(() => [...v[4] || (v[4] = [
            q(" Edit ", -1)
          ])]),
          _: 1
        }),
        F(ue, {
          class: "flex-1",
          variant: "outline",
          size: "sm",
          disabled: e.canDelete === !1 || (e.plan.activeUsers ?? 0) > 0,
          onClick: v[1] || (v[1] = be((p) => r("delete", e.plan.id), ["stop"]))
        }, {
          default: L(() => [...v[5] || (v[5] = [
            q(" Delete ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 42, $y));
  }
}), qy = { class: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" }, Gy = {
  key: 0,
  class: "text-xl font-semibold tracking-tight sm:text-2xl"
}, Wy = {
  key: 1,
  class: "text-muted-foreground mt-1 text-sm"
}, Zy = {
  key: 0,
  class: "text-muted-foreground rounded-lg border border-dashed px-6 py-16 text-center text-sm"
}, Yy = {
  key: 1,
  class: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
}, MM = /* @__PURE__ */ V({
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
      class: z(["w-full space-y-6", e.embedded ? "" : y(dt)]),
      "data-slot": "plan-grid"
    }, [
      l("header", qy, [
        l("div", null, [
          e.title ? (t(), n("h1", Gy, f(e.title), 1)) : b("", !0),
          e.description ? (t(), n("p", Wy, f(e.description), 1)) : b("", !0)
        ]),
        F(ue, {
          type: "button",
          onClick: s[0] || (s[0] = (i) => a("create"))
        }, {
          default: L(() => [...s[3] || (s[3] = [
            q("Create plan", -1)
          ])]),
          _: 1
        })
      ]),
      e.plans.length === 0 ? (t(), n("p", Zy, " No plans yet. Create one to offer organisations a bundle of modules and limits. ")) : (t(), n("div", Yy, [
        (t(!0), n(P, null, O(e.plans, (i) => (t(), T(Ky, {
          key: i.id,
          plan: i,
          onEdit: s[1] || (s[1] = (d) => a("edit", d)),
          onDelete: s[2] || (s[2] = (d) => a("delete", d))
        }, null, 8, ["plan"]))), 128))
      ]))
    ], 2));
  }
}), Jy = { class: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" }, Qy = { class: "text-xl font-semibold tracking-tight sm:text-2xl" }, Xy = { class: "flex flex-col-reverse items-start gap-6 lg:flex-row" }, ex = { class: "bg-card w-full flex-1 space-y-4 rounded-lg border p-5" }, tx = { class: "space-y-1.5" }, ax = { class: "space-y-1.5" }, nx = { class: "space-y-1.5" }, lx = { class: "space-y-1.5" }, ox = { class: "space-y-1.5" }, sx = { class: "flex items-center gap-3 text-sm" }, rx = { class: "flex items-center gap-3 text-sm" }, ix = { class: "flex items-center gap-3 text-sm" }, dx = {
  key: 0,
  class: "space-y-1.5"
}, ux = { class: "flex items-center gap-3 text-sm" }, cx = { class: "bg-card w-full flex-1 space-y-4 rounded-lg border p-5" }, fx = { class: "space-y-1.5" }, mx = ["value"], px = {
  key: 0,
  class: "flex items-center gap-3 text-sm"
}, vx = {
  key: 0,
  class: "text-muted-foreground text-xs font-normal"
}, gx = ["id", "value", "onInput"], hx = { class: "space-y-2" }, bx = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, yx = ["d"], SM = /* @__PURE__ */ V({
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
    }), r = e, s = o, i = ht(a());
    function d(w, m) {
      const g = i.perks?.[w]?.value;
      return g ?? m;
    }
    function u(w, m, g) {
      const S = i.perks?.[w];
      i.perks = {
        ...i.perks ?? {},
        [w]: {
          value: m,
          overview: g ?? S?.overview ?? ""
        }
      };
    }
    function c(w, m) {
      const g = i.perks?.[w];
      i.perks = {
        ...i.perks ?? {},
        [w]: {
          value: g?.value ?? (w === "modules" ? [] : 0),
          overview: m
        }
      };
    }
    function v(w) {
      const m = w ? { ...a(), ...w } : a();
      i.id = m.id, i.name = m.name, i.shortDescription = m.shortDescription ?? "", i.description = m.description ?? "", i.days = m.days, i.price = m.price, i.featured = m.featured ?? !1, i.recommended = m.recommended ?? !1, i.trial = m.trial ?? !1, i.trialDays = m.trialDays ?? 0, i.active = m.active ?? !0, i.perks = { ...m.perks ?? {} }, i.extraPerks = [...m.extraPerks ?? []], i.perks.modules || u("modules", []);
    }
    v(r.plan), ge(
      () => r.plan,
      (w) => v(w),
      { deep: !0 }
    );
    const p = h({
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
    }), x = h(
      () => r.modules.map((w) => ({ value: w.key, label: w.label }))
    );
    function M(w) {
      const m = Object.fromEntries(r.modules.map((I) => [I.key, I])), g = new Set(w);
      for (const I of r.modules)
        if (!g.has(I.key))
          for (const j of I.children ?? [])
            g.delete(j);
      let S = !0;
      for (; S; ) {
        S = !1;
        for (const I of [...g])
          for (const j of m[I]?.requires ?? [])
            g.has(j) || (g.add(j), S = !0);
      }
      return [...g];
    }
    function $() {
      i.extraPerks = [...i.extraPerks ?? [], { key: "", value: "" }];
    }
    function C(w) {
      i.extraPerks = (i.extraPerks ?? []).filter((m, g) => g !== w);
    }
    function k() {
      s("save", {
        ...i,
        extraPerks: (i.extraPerks ?? []).filter((w) => w.key.trim() !== "")
      });
    }
    const B = `file:text-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${We}`, A = `dark:bg-input/30 border-input min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${We}`;
    return (w, m) => (t(), n("form", {
      class: z(["w-full space-y-6", e.embedded ? "" : y(dt)]),
      "data-slot": "plan-editor",
      onSubmit: be(k, ["prevent"])
    }, [
      l("header", Jy, [
        l("div", null, [
          l("h1", Qy, f(e.mode === "edit" ? "Edit plan" : "Create plan"), 1),
          m[13] || (m[13] = l("p", { class: "text-muted-foreground mt-1 text-sm" }, " Plans are organisation-wide. Charge a recurring amount. Perks are modules and numeric limits (-1 is Unlimited). ", -1))
        ]),
        F(ue, {
          type: "button",
          variant: "outline",
          onClick: m[0] || (m[0] = (g) => s("cancel"))
        }, {
          default: L(() => [...m[14] || (m[14] = [
            q("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      l("div", Xy, [
        l("section", ex, [
          m[26] || (m[26] = l("h2", { class: "font-semibold" }, "Plan details", -1)),
          l("div", tx, [
            F(Oe, { for: "plan-name" }, {
              default: L(() => [...m[15] || (m[15] = [
                q("Plan name", -1)
              ])]),
              _: 1
            }),
            F(Ae, {
              id: "plan-name",
              modelValue: i.name,
              "onUpdate:modelValue": m[1] || (m[1] = (g) => i.name = g),
              required: ""
            }, null, 8, ["modelValue"])
          ]),
          l("div", ax, [
            F(Oe, { for: "plan-short" }, {
              default: L(() => [...m[16] || (m[16] = [
                q("Short description (optional)", -1)
              ])]),
              _: 1
            }),
            F(Ae, {
              id: "plan-short",
              modelValue: i.shortDescription,
              "onUpdate:modelValue": m[2] || (m[2] = (g) => i.shortDescription = g),
              placeholder: "For an organisation getting started"
            }, null, 8, ["modelValue"])
          ]),
          l("div", nx, [
            F(Oe, { for: "plan-description" }, {
              default: L(() => [...m[17] || (m[17] = [
                q("Plan description", -1)
              ])]),
              _: 1
            }),
            xe(l("textarea", {
              id: "plan-description",
              "onUpdate:modelValue": m[3] || (m[3] = (g) => i.description = g),
              required: "",
              placeholder: "Shown on the company-wide catalogue",
              class: z(A)
            }, null, 512), [
              [Le, i.description]
            ])
          ]),
          l("div", lx, [
            F(Oe, { for: "plan-days" }, {
              default: L(() => [...m[18] || (m[18] = [
                q("Duration", -1)
              ])]),
              _: 1
            }),
            xe(l("select", {
              id: "plan-days",
              "onUpdate:modelValue": m[4] || (m[4] = (g) => i.days = g),
              class: z(B)
            }, [...m[19] || (m[19] = [
              l("option", { value: 30 }, "Monthly", -1),
              l("option", { value: 365 }, "Yearly", -1),
              l("option", { value: 999999 }, "Lifetime", -1)
            ])], 512), [
              [
                et,
                i.days,
                void 0,
                { number: !0 }
              ]
            ])
          ]),
          l("div", ox, [
            F(Oe, { for: "plan-price" }, {
              default: L(() => [...m[20] || (m[20] = [
                q("Price", -1)
              ])]),
              _: 1
            }),
            F(Ae, {
              id: "plan-price",
              "model-value": i.price,
              type: "number",
              step: "any",
              required: "",
              "onUpdate:modelValue": m[5] || (m[5] = (g) => i.price = Number(g))
            }, null, 8, ["model-value"])
          ]),
          l("label", sx, [
            F(y(tt), {
              checked: !!i.featured,
              "onUpdate:checked": m[6] || (m[6] = (g) => i.featured = g)
            }, null, 8, ["checked"]),
            m[21] || (m[21] = q(" Featured ", -1))
          ]),
          l("label", rx, [
            F(y(tt), {
              checked: !!i.recommended,
              "onUpdate:checked": m[7] || (m[7] = (g) => i.recommended = g)
            }, null, 8, ["checked"]),
            m[22] || (m[22] = q(" Recommended ", -1))
          ]),
          l("label", ix, [
            F(y(tt), {
              checked: !!i.trial,
              "onUpdate:checked": m[8] || (m[8] = (g) => i.trial = g)
            }, null, 8, ["checked"]),
            m[23] || (m[23] = q(" Offer a trial ", -1))
          ]),
          i.trial ? (t(), n("div", dx, [
            F(Oe, { for: "plan-trial-days" }, {
              default: L(() => [...m[24] || (m[24] = [
                q("Trial days", -1)
              ])]),
              _: 1
            }),
            F(Ae, {
              id: "plan-trial-days",
              "model-value": i.trialDays ?? 0,
              type: "number",
              required: "",
              "onUpdate:modelValue": m[9] || (m[9] = (g) => i.trialDays = Number(g))
            }, null, 8, ["model-value"])
          ])) : b("", !0),
          l("label", ux, [
            F(y(tt), {
              checked: i.active !== !1,
              "onUpdate:checked": m[10] || (m[10] = (g) => i.active = g)
            }, null, 8, ["checked"]),
            m[25] || (m[25] = q(" Active ", -1))
          ]),
          F(ue, {
            type: "submit",
            disabled: e.processing
          }, {
            default: L(() => [
              q(f(e.mode === "edit" ? "Save plan" : "Create plan"), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ]),
        l("section", cx, [
          m[33] || (m[33] = l("h2", { class: "font-semibold" }, "Plan perks", -1)),
          l("div", fx, [
            F(Oe, null, {
              default: L(() => [...m[27] || (m[27] = [
                q("Modules access", -1)
              ])]),
              _: 1
            }),
            F(ua, {
              modelValue: p.value,
              "onUpdate:modelValue": m[11] || (m[11] = (g) => p.value = g),
              options: x.value,
              placeholder: "Select modules"
            }, null, 8, ["modelValue", "options"]),
            F(Oe, { for: "plan-modules-overview" }, {
              default: L(() => [...m[28] || (m[28] = [
                q("Overview", -1)
              ])]),
              _: 1
            }),
            l("textarea", {
              id: "plan-modules-overview",
              value: i.perks?.modules?.overview ?? "",
              class: z(A),
              onInput: m[12] || (m[12] = (g) => c("modules", g.target.value))
            }, null, 40, mx)
          ]),
          (t(!0), n(P, null, O(e.limits, (g) => (t(), n("div", {
            key: g.key,
            class: "space-y-1.5"
          }, [
            g.kind === "toggle" ? (t(), n("label", px, [
              F(y(tt), {
                checked: !!d(g.key, !1),
                "onUpdate:checked": (S) => u(
                  g.key,
                  S,
                  i.perks?.[g.key]?.overview ?? ""
                )
              }, null, 8, ["checked", "onUpdate:checked"]),
              q(" " + f(g.label), 1)
            ])) : (t(), n(P, { key: 1 }, [
              F(Oe, {
                for: `plan-limit-${g.key}`
              }, {
                default: L(() => [
                  q(f(g.label), 1)
                ]),
                _: 2
              }, 1032, ["for"]),
              g.hint ? (t(), n("p", vx, f(g.hint), 1)) : b("", !0),
              F(Ae, {
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
              m[29] || (m[29] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " Use -1 for Unlimited. ", -1))
            ], 64)),
            F(Oe, {
              for: `plan-overview-${g.key}`
            }, {
              default: L(() => [...m[30] || (m[30] = [
                q("Overview", -1)
              ])]),
              _: 1
            }, 8, ["for"]),
            l("textarea", {
              id: `plan-overview-${g.key}`,
              value: i.perks?.[g.key]?.overview ?? "",
              class: z(A),
              onInput: (S) => c(g.key, S.target.value)
            }, null, 40, gx)
          ]))), 128)),
          l("div", hx, [
            m[32] || (m[32] = l("p", { class: "text-sm font-semibold" }, "Extra perks", -1)),
            (t(!0), n(P, null, O(i.extraPerks ?? [], (g, S) => (t(), n("div", {
              key: S,
              class: "flex items-center gap-2"
            }, [
              F(Ae, {
                modelValue: g.key,
                "onUpdate:modelValue": (I) => g.key = I,
                placeholder: "Label"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              F(Ae, {
                modelValue: g.value,
                "onUpdate:modelValue": (I) => g.value = I,
                placeholder: "Value"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              F(ue, {
                type: "button",
                variant: "destructive",
                size: "icon",
                "aria-label": "Remove perk",
                onClick: (I) => C(S)
              }, {
                default: L(() => [
                  (t(), n("svg", bx, [
                    l("path", {
                      d: y(me)("x")
                    }, null, 8, yx)
                  ]))
                ]),
                _: 1
              }, 8, ["onClick"])
            ]))), 128)),
            F(ue, {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: $
            }, {
              default: L(() => [...m[31] || (m[31] = [
                q(" Add extra perk ", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ])
    ], 34));
  }
}), xx = ["data-current", "data-recommended"], kx = {
  key: 0,
  class: "bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
}, $x = {
  key: 1,
  class: "bg-primary/10 text-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold"
}, wx = { class: "text-sm font-semibold" }, Cx = { class: "flex items-baseline gap-1" }, Mx = { class: "text-4xl font-bold tracking-tight tabular-nums" }, Sx = { class: "text-muted-foreground text-sm font-normal" }, Bx = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal text-pretty"
}, Ax = {
  key: 2,
  class: "flex flex-1 flex-col gap-2 text-sm"
}, zx = {
  class: "text-success mt-0.5 shrink-0",
  "aria-hidden": "true"
}, Px = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, _x = ["d"], Vx = { class: "text-muted-foreground" }, Lx = {
  key: 3,
  class: "flex-1"
}, Ox = {
  key: 4,
  class: "mt-auto pt-2"
}, BM = /* @__PURE__ */ V({
  __name: "PlanPurchaseCard",
  props: {
    plan: {},
    annual: { type: Boolean, default: !1 },
    processing: { type: Boolean, default: !1 }
  },
  emits: ["choose"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(() => a.annual && a.plan.annualPrice !== void 0 ? a.plan.annualPriceFormatted ?? String(a.plan.annualPrice) : a.plan.priceFormatted ?? String(a.plan.price)), i = h(() => a.annual && a.plan.annualPrice !== void 0 ? "year" : a.plan.interval ?? "month"), d = h(() => !!a.plan.recommended && !a.plan.current);
    return (u, c) => (t(), n("article", {
      class: z([
        "bg-card text-card-foreground relative flex flex-col gap-4 rounded-xl border p-6 transition-shadow",
        d.value ? "border-primary shadow-lg ring-1 ring-primary/20" : e.plan.current ? "border-primary/40" : ""
      ]),
      "data-slot": "plan-purchase-card",
      "data-current": e.plan.current ? "true" : void 0,
      "data-recommended": e.plan.recommended ? "true" : void 0
    }, [
      d.value ? (t(), n("span", kx, " Most popular ")) : e.plan.current ? (t(), n("span", $x, " Current plan ")) : b("", !0),
      l("header", {
        class: z(["flex flex-col gap-1", d.value || e.plan.current ? "pt-2" : ""])
      }, [
        l("h3", wx, f(e.plan.name), 1),
        l("p", Cx, [
          l("span", Mx, f(s.value), 1),
          l("span", Sx, "/ " + f(i.value), 1)
        ]),
        e.plan.description ? (t(), n("p", Bx, f(e.plan.description), 1)) : b("", !0)
      ], 2),
      e.plan.features?.length ? (t(), n("ul", Ax, [
        (t(!0), n(P, null, O(e.plan.features, (v, p) => (t(), n("li", {
          key: p,
          class: "flex items-start gap-2"
        }, [
          l("span", zx, [
            (t(), n("svg", Px, [
              l("path", {
                d: y(me)("check")
              }, null, 8, _x)
            ]))
          ]),
          l("span", Vx, f(v), 1)
        ]))), 128))
      ])) : (t(), n("div", Lx)),
      e.plan.current ? b("", !0) : (t(), n("footer", Ox, [
        F(ue, {
          class: "w-full",
          variant: d.value ? "default" : "outline",
          size: "sm",
          disabled: e.processing,
          onClick: c[0] || (c[0] = (v) => r("choose", e.plan.id))
        }, {
          default: L(() => [
            q(f(e.processing ? "Redirecting…" : "Choose plan"), 1)
          ]),
          _: 1
        }, 8, ["variant", "disabled"])
      ]))
    ], 10, xx));
  }
}), jx = {
  key: 0,
  "data-slot": "catalog-toolbar",
  class: "flex flex-col gap-3"
}, Dx = { class: "flex flex-wrap items-center gap-2 sm:flex-nowrap" }, Tx = {
  key: 0,
  class: "relative min-w-0 max-w-sm flex-1"
}, Ix = {
  class: "text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, Ex = ["d"], Fx = {
  key: 1,
  class: "ml-auto inline-flex shrink-0 rounded-md border",
  "data-slot": "catalog-layout",
  role: "group",
  "aria-label": "Layout"
}, Nx = ["aria-pressed"], Rx = ["aria-pressed"], Hx = {
  key: 0,
  class: "flex flex-col gap-2"
}, Ux = ["aria-label"], Kx = {
  key: 0,
  class: "text-muted-foreground mr-1 text-xs font-medium"
}, qx = ["aria-pressed", "onClick"], Gx = ["aria-label"], Wx = { class: "text-muted-foreground mr-1 text-xs font-medium" }, Zx = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, Yx = ["data-slot"], Jx = {
  key: 3,
  class: "flex items-center justify-between gap-3",
  "data-slot": "catalog-pagination"
}, Qx = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, Xx = { class: "flex items-center gap-2" }, e2 = ["disabled"], t2 = ["disabled"], ha = /* @__PURE__ */ V({
  __name: "CatalogGrid",
  props: /* @__PURE__ */ Ue({
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
  emits: /* @__PURE__ */ Ue(["select", "cart", "filter", "scan"], ["update:modelValue"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(""), i = xt(e, "modelValue"), d = ht({}), u = ht({});
    ge(s, () => x());
    function c(j) {
      const X = j.trim();
      if (X === "")
        return null;
      const W = Number(X);
      return Number.isFinite(W) ? W : null;
    }
    function v() {
      const j = {};
      for (const [X, W] of Object.entries(u))
        j[X] = { min: c(W.min), max: c(W.max) };
      return j;
    }
    function p() {
      return { query: s.value, selected: { ...d }, ranges: v() };
    }
    function x() {
      r("filter", p());
    }
    function M(j, X) {
      d[j] = d[j] === X ? null : X, x();
    }
    function $(j) {
      return u[j] ?? { min: "", max: "" };
    }
    function C(j, X, W) {
      const Q = u[j] ?? { min: "", max: "" };
      u[j] = { ...Q, [X]: W }, x();
    }
    function k(j) {
      j.key === "Enter" && (j.preventDefault(), r("scan", s.value.trim()));
    }
    const B = h(
      () => a.facets.filter((j) => (j.kind ?? "chips") === "chips")
    ), A = h(() => a.facets.filter((j) => j.kind === "range")), w = h(
      () => a.searchable || a.facets.length > 0 || a.layoutToggle
    ), m = K(1);
    ge(
      () => a.items.map((j) => j.key).join(","),
      () => {
        m.value = 1;
      }
    );
    const g = h(() => {
      const j = a.pageSize;
      return !j || j < 1 ? 1 : Math.max(1, Math.ceil(a.items.length / j));
    }), S = h(() => {
      const j = a.pageSize;
      if (!j || j < 1)
        return a.items;
      const X = (m.value - 1) * j;
      return a.items.slice(X, X + j);
    });
    function I(j) {
      m.value = Math.min(g.value, Math.max(1, j));
    }
    return (j, X) => (t(), n("div", {
      class: z(["flex flex-col gap-4", y(sn)])
    }, [
      w.value ? (t(), n("div", jx, [
        l("div", Dx, [
          e.searchable ? (t(), n("div", Tx, [
            (t(), n("svg", Ix, [
              l("path", {
                d: y(me)("search")
              }, null, 8, Ex)
            ])),
            F(Ae, {
              modelValue: s.value,
              "onUpdate:modelValue": X[0] || (X[0] = (W) => s.value = W),
              type: "search",
              placeholder: e.searchPlaceholder,
              class: "pl-8",
              "aria-label": e.searchPlaceholder,
              autofocus: e.autofocus || void 0,
              onKeydown: k
            }, null, 8, ["modelValue", "placeholder", "aria-label", "autofocus"])
          ])) : b("", !0),
          Z(j.$slots, "toolbar"),
          e.layoutToggle ? (t(), n("div", Fx, [
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "grid" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "grid" ? "true" : "false",
              "aria-label": "Grid",
              onClick: X[1] || (X[1] = (W) => i.value = "grid")
            }, " Tiles ", 10, Nx),
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "list" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "list" ? "true" : "false",
              "aria-label": "List",
              onClick: X[2] || (X[2] = (W) => i.value = "list")
            }, " List ", 10, Rx)
          ])) : b("", !0)
        ]),
        B.value.length || A.value.length ? (t(), n("div", Hx, [
          (t(!0), n(P, null, O(B.value, (W) => (t(), n("div", {
            key: W.key,
            class: "flex flex-wrap items-center gap-1.5",
            "aria-label": W.label ?? W.key
          }, [
            W.label ? (t(), n("span", Kx, f(W.label), 1)) : b("", !0),
            (t(!0), n(P, null, O(W.options ?? [], (Q) => (t(), n("button", {
              key: Q.value,
              type: "button",
              class: z([
                "rounded-full border px-2.5 py-1 text-xs transition-colors",
                d[W.key] === Q.value ? "bg-foreground text-background border-foreground" : "bg-background text-foreground hover:bg-muted/60"
              ]),
              "aria-pressed": d[W.key] === Q.value ? "true" : "false",
              onClick: (Y) => M(W.key, Q.value)
            }, f(Q.label), 11, qx))), 128))
          ], 8, Ux))), 128)),
          (t(!0), n(P, null, O(A.value, (W) => (t(), n("div", {
            key: W.key,
            class: "flex flex-wrap items-center gap-1.5",
            "aria-label": W.label ?? W.key,
            "data-slot": "catalog-range"
          }, [
            l("span", Wx, f(W.label ?? W.key), 1),
            F(Ae, {
              type: "number",
              class: "h-8 w-24 px-2 text-xs",
              placeholder: "From",
              "aria-label": `${W.label ?? W.key} from`,
              "model-value": $(W.key).min,
              "onUpdate:modelValue": (Q) => C(W.key, "min", String(Q))
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
            X[7] || (X[7] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "to", -1)),
            F(Ae, {
              type: "number",
              class: "h-8 w-24 px-2 text-xs",
              placeholder: "To",
              "aria-label": `${W.label ?? W.key} to`,
              "model-value": $(W.key).max,
              "onUpdate:modelValue": (Q) => C(W.key, "max", String(Q))
            }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
          ], 8, Gx))), 128))
        ])) : b("", !0)
      ])) : b("", !0),
      e.items.length === 0 ? (t(), n("p", Zx, " No matching items. ")) : (t(), n("div", {
        key: 2,
        class: z(i.value === "list" ? "flex flex-col gap-3" : y(Pm)),
        "data-slot": i.value === "list" ? "catalog-list" : "catalog-grid"
      }, [
        (t(!0), n(P, null, O(S.value, (W) => (t(), T(by, {
          key: W.key,
          item: W,
          layout: i.value,
          onSelect: X[3] || (X[3] = (Q) => r("select", Q)),
          onCart: X[4] || (X[4] = (Q) => r("cart", Q))
        }, null, 8, ["item", "layout"]))), 128))
      ], 10, Yx)),
      e.pageSize && g.value > 1 ? (t(), n("div", Jx, [
        l("p", Qx, " Page " + f(m.value) + " of " + f(g.value), 1),
        l("div", Xx, [
          l("button", {
            type: "button",
            class: "rounded-md border bg-background px-2.5 py-1 text-xs font-medium disabled:opacity-40",
            disabled: m.value <= 1,
            onClick: X[5] || (X[5] = (W) => I(m.value - 1))
          }, " Previous ", 8, e2),
          l("button", {
            type: "button",
            class: "rounded-md border bg-background px-2.5 py-1 text-xs font-medium disabled:opacity-40",
            disabled: m.value >= g.value,
            onClick: X[6] || (X[6] = (W) => I(m.value + 1))
          }, " Next ", 8, t2)
        ])
      ])) : b("", !0)
    ], 2));
  }
}), a2 = ["aria-disabled"], n2 = ["disabled"], l2 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, o2 = ["d"], s2 = {
  class: "min-w-6 px-1 text-center text-sm tabular-nums",
  "aria-live": "polite"
}, r2 = ["disabled"], i2 = {
  class: "size-3.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, d2 = ["d"], u2 = /* @__PURE__ */ V({
  __name: "PkQtyStepper",
  props: /* @__PURE__ */ Ue({
    min: { default: 1 },
    max: { default: null },
    disabled: { type: Boolean, default: !1 }
  }, {
    modelValue: { required: !0 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ Ue(["decrease", "increase"], ["update:modelValue"]),
  setup(e, { emit: o }) {
    const a = xt(e, "modelValue"), r = o, s = h(() => a.value <= e.min), i = h(() => e.max !== null && a.value >= e.max);
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
        (t(), n("svg", l2, [
          l("path", {
            d: y(me)("minus")
          }, null, 8, o2)
        ]))
      ], 8, n2),
      l("span", s2, f(a.value), 1),
      l("button", {
        type: "button",
        class: "hover:bg-muted inline-flex size-8 items-center justify-center disabled:opacity-40",
        disabled: e.disabled || i.value,
        "aria-label": "Increase quantity",
        onClick: c[1] || (c[1] = (v) => d(1))
      }, [
        (t(), n("svg", i2, [
          l("path", {
            d: y(me)("plus")
          }, null, 8, d2)
        ]))
      ], 8, r2)
    ], 8, a2));
  }
}), c2 = { class: "divide-border flex flex-col divide-y" }, f2 = { class: "min-w-0" }, m2 = { class: "truncate text-sm font-medium" }, p2 = {
  key: 0,
  class: "text-muted-foreground mt-0.5 truncate text-xs"
}, v2 = { class: "flex shrink-0 items-center gap-2 text-sm" }, g2 = {
  key: 1,
  class: "text-muted-foreground tabular-nums"
}, h2 = {
  key: 2,
  class: "font-medium tabular-nums"
}, b2 = ["aria-label", "onClick"], y2 = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "aria-hidden": "true"
}, x2 = ["d"], k2 = /* @__PURE__ */ V({
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
    return (s, i) => (t(), n("div", c2, [
      (t(!0), n(P, null, O(e.items, (d) => (t(), n("div", {
        key: d.key,
        class: "flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
      }, [
        l("div", f2, [
          l("p", m2, f(d.label), 1),
          d.detail ? (t(), n("p", p2, f(d.detail), 1)) : b("", !0)
        ]),
        l("div", v2, [
          e.editable ? (t(), T(u2, {
            key: 0,
            "model-value": r(d),
            "onUpdate:modelValue": (u) => a("qty", d.key, u)
          }, null, 8, ["model-value", "onUpdate:modelValue"])) : d.qty !== null && d.qty !== void 0 && d.qty !== "" ? (t(), n("span", g2, " ×" + f(d.qty), 1)) : b("", !0),
          d.amount ? (t(), n("span", h2, f(d.amount), 1)) : b("", !0),
          d.status ? (t(), T(Be, {
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
            (t(), n("svg", y2, [
              l("path", {
                d: y(me)("trash")
              }, null, 8, x2)
            ]))
          ], 8, b2)) : b("", !0)
        ])
      ]))), 128))
    ]));
  }
}), $2 = {
  "data-slot": "cart-panel",
  class: "bg-card flex flex-col overflow-hidden rounded-lg border"
}, w2 = { class: "border-b px-4 py-3" }, C2 = { class: "text-sm font-medium" }, M2 = { class: "flex-1 px-4 py-3" }, S2 = {
  key: 0,
  class: "text-muted-foreground py-8 text-center text-sm",
  "data-slot": "cart-empty"
}, B2 = { class: "text-foreground block font-medium" }, A2 = { class: "mt-1 block" }, z2 = {
  key: 0,
  class: "flex flex-col gap-2 border-t px-4 py-3"
}, P2 = {
  key: 0,
  class: "flex items-center justify-between text-sm"
}, _2 = { class: "tabular-nums" }, V2 = {
  key: 1,
  class: "flex items-center justify-between text-sm",
  "data-slot": "cart-discount"
}, L2 = { class: "text-muted-foreground" }, O2 = {
  key: 0,
  class: "tabular-nums"
}, j2 = {
  key: 2,
  class: "flex items-center justify-between text-sm"
}, D2 = { class: "text-muted-foreground" }, T2 = { class: "tabular-nums" }, I2 = {
  key: 3,
  class: "flex items-center justify-between text-sm font-semibold"
}, E2 = { class: "tabular-nums" }, F2 = {
  key: 4,
  class: "pt-1"
}, N2 = /* @__PURE__ */ V({
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
    return (r, s) => (t(), n("aside", $2, [
      l("header", w2, [
        l("h2", C2, f(e.title), 1)
      ]),
      l("div", M2, [
        e.items.length === 0 ? (t(), n("p", S2, [
          l("span", B2, f(e.emptyTitle), 1),
          l("span", A2, f(e.emptyDescription), 1)
        ])) : (t(), T(k2, {
          key: 1,
          items: e.items,
          editable: "",
          onQty: s[0] || (s[0] = (i, d) => a("qty", i, d)),
          onRemove: s[1] || (s[1] = (i) => a("remove", i))
        }, null, 8, ["items"]))
      ]),
      e.items.length > 0 ? (t(), n("footer", z2, [
        e.subtotal ? (t(), n("div", P2, [
          s[2] || (s[2] = l("span", { class: "text-muted-foreground" }, "Subtotal", -1)),
          l("span", _2, f(e.subtotal), 1)
        ])) : b("", !0),
        e.discount || r.$slots.discount ? (t(), n("div", V2, [
          l("span", L2, f(e.discountLabel), 1),
          e.discount ? (t(), n("span", O2, f(e.discount), 1)) : b("", !0),
          Z(r.$slots, "discount")
        ])) : b("", !0),
        e.tax ? (t(), n("div", j2, [
          l("span", D2, f(e.taxLabel), 1),
          l("span", T2, f(e.tax), 1)
        ])) : b("", !0),
        e.total ? (t(), n("div", I2, [
          s[3] || (s[3] = l("span", null, "Total", -1)),
          l("span", E2, f(e.total), 1)
        ])) : b("", !0),
        r.$slots.pay ? (t(), n("div", F2, [
          Z(r.$slots, "pay")
        ])) : b("", !0)
      ])) : b("", !0)
    ]));
  }
});
function He() {
  return { query: "", selected: {}, ranges: {} };
}
function R2(e, o) {
  const a = e.metrics?.[o];
  if (typeof a == "number" && Number.isFinite(a))
    return a;
  const r = e.facets?.[o];
  if (r == null || r === "")
    return null;
  const s = Number(r);
  return Number.isFinite(s) ? s : null;
}
function H2(e, o) {
  return !o || o.min === null && o.max === null ? !0 : !(e === null || o.min !== null && e < o.min || o.max !== null && e > o.max);
}
function ba(e, o) {
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
    if (!H2(R2(e, r), s))
      return !1;
  return !0;
}
function U2(e, o) {
  const a = o.trim().toLowerCase();
  return a === "" ? null : e.find((r) => {
    const s = (r.sku ?? "").trim().toLowerCase(), i = r.key.trim().toLowerCase();
    return s === a || i === a;
  }) ?? null;
}
function Dt(e) {
  return e.query.trim() !== "" || Object.values(e.selected ?? {}).some(Boolean) ? !0 : Object.values(e.ranges ?? {}).some(
    (o) => o.min !== null || o.max !== null
  );
}
const K2 = { class: "flex flex-col gap-6" }, q2 = {
  key: 0,
  class: "flex flex-col gap-1.5"
}, G2 = { class: "text-sm font-semibold" }, W2 = { class: "flex flex-wrap items-center gap-1.5" }, Z2 = ["aria-pressed", "onClick"], Y2 = { class: "text-sm font-semibold" }, J2 = { class: "flex flex-wrap items-center gap-1.5" }, Q2 = { key: 0 }, pn = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(""), i = ht({}), d = ht({}), u = h(
      () => a.facets.filter((g) => (g.kind ?? "chips") === "chips")
    ), c = h(() => a.facets.filter((g) => g.kind === "range"));
    function v(g) {
      return g == null ? "" : String(g);
    }
    function p() {
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
    ge(
      () => a.open,
      (g) => {
        g && p();
      }
    );
    function x(g) {
      const S = g.trim();
      if (S === "")
        return null;
      const I = Number(S);
      return Number.isFinite(I) ? I : null;
    }
    function M() {
      const g = {};
      for (const [S, I] of Object.entries(d))
        g[S] = { min: x(I.min), max: x(I.max) };
      return g;
    }
    function $() {
      return {
        query: a.hideSearch ? a.applied.query : s.value,
        selected: { ...i },
        ranges: M()
      };
    }
    const C = h(() => {
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
    function B(g) {
      return d[g] ?? { min: "", max: "" };
    }
    function A(g, S, I) {
      const j = d[g] ?? { min: "", max: "" };
      d[g] = { ...j, [S]: I };
    }
    function w() {
      r("apply", $());
    }
    function m() {
      s.value = "";
      for (const g of Object.keys(i))
        i[g] = null;
      for (const g of Object.keys(d))
        d[g] = { min: "", max: "" };
      r("reset"), r(
        "apply",
        a.hideSearch ? { ...He(), query: a.applied.query } : He()
      );
    }
    return (g, S) => (t(), T(Tt, {
      open: e.open,
      title: e.title,
      description: e.description || (e.hideSearch ? "Category and stock for this list" : "Search, categories and ranges for this list"),
      size: "sm",
      onClose: S[2] || (S[2] = (I) => r("close"))
    }, {
      footer: L(() => [
        l("button", {
          type: "button",
          class: "text-muted-foreground mr-auto text-xs hover:underline",
          onClick: m
        }, " Reset all "),
        F(ue, {
          variant: "outline",
          size: "sm",
          onClick: S[1] || (S[1] = (I) => r("close"))
        }, {
          default: L(() => [...S[5] || (S[5] = [
            q("Cancel", -1)
          ])]),
          _: 1
        }),
        F(ue, {
          size: "sm",
          onClick: w
        }, {
          default: L(() => [
            S[6] || (S[6] = q(" Apply", -1)),
            C.value ? (t(), n("span", Q2, " (" + f(C.value) + ")", 1)) : b("", !0)
          ]),
          _: 1
        })
      ]),
      default: L(() => [
        l("div", K2, [
          e.hideSearch ? b("", !0) : (t(), n("label", q2, [
            S[3] || (S[3] = l("span", { class: "text-sm font-semibold" }, "Search", -1)),
            F(Ae, {
              modelValue: s.value,
              "onUpdate:modelValue": S[0] || (S[0] = (I) => s.value = I),
              type: "search",
              placeholder: e.searchPlaceholder,
              "aria-label": e.searchPlaceholder
            }, null, 8, ["modelValue", "placeholder", "aria-label"])
          ])),
          (t(!0), n(P, null, O(u.value, (I) => (t(), n("section", {
            key: I.key,
            class: "flex flex-col gap-2"
          }, [
            l("h3", G2, f(I.label ?? I.key), 1),
            l("div", W2, [
              (t(!0), n(P, null, O(I.options ?? [], (j) => (t(), n("button", {
                key: j.value,
                type: "button",
                class: z([
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  i[I.key] === j.value ? "border-foreground bg-foreground text-background" : "bg-background text-foreground hover:bg-muted/60"
                ]),
                "aria-pressed": i[I.key] === j.value ? "true" : "false",
                onClick: (X) => k(I.key, j.value)
              }, f(j.label), 11, Z2))), 128))
            ])
          ]))), 128)),
          (t(!0), n(P, null, O(c.value, (I) => (t(), n("section", {
            key: I.key,
            class: "flex flex-col gap-2"
          }, [
            l("h3", Y2, f(I.label ?? I.key), 1),
            l("div", J2, [
              F(Ae, {
                type: "number",
                class: "h-8 w-24 px-2 text-xs",
                placeholder: "From",
                "aria-label": `${I.label ?? I.key} from`,
                "model-value": B(I.key).min,
                "onUpdate:modelValue": (j) => A(I.key, "min", String(j))
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"]),
              S[4] || (S[4] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "to", -1)),
              F(Ae, {
                type: "number",
                class: "h-8 w-24 px-2 text-xs",
                placeholder: "To",
                "aria-label": `${I.label ?? I.key} to`,
                "model-value": B(I.key).max,
                "onUpdate:modelValue": (j) => A(I.key, "max", String(j))
              }, null, 8, ["aria-label", "model-value", "onUpdate:modelValue"])
            ])
          ]))), 128))
        ])
      ]),
      _: 1
    }, 8, ["open", "title", "description"]));
  }
}), X2 = {
  "data-slot": "catalog-till",
  class: "grid w-full items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
}, ek = { class: "flex flex-col gap-4" }, tk = { class: "flex flex-wrap items-start justify-between gap-3" }, ak = { class: "flex items-center gap-2" }, nk = {
  key: 0,
  class: "bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
}, AM = /* @__PURE__ */ V({
  __name: "CatalogTill",
  props: /* @__PURE__ */ Ue({
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
  emits: /* @__PURE__ */ Ue(["select", "pay"], ["update:cart"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(He()), i = K(!1), d = xt(e, "cart"), u = K(!1), c = h(
      () => a.items.filter((W) => ba(W, s.value))
    );
    function v(W) {
      s.value = { ...s.value, query: W.query };
    }
    function p(W) {
      s.value = {
        ...s.value,
        selected: W.selected,
        ranges: W.ranges,
        query: s.value.query
      }, i.value = !1;
    }
    function x(W) {
      return W ? a.parsePrice(W) : 0;
    }
    function M(W, Q, Y) {
      return {
        ...W,
        qty: Q,
        amount: a.formatMoney(Y * Q)
      };
    }
    function $(W) {
      const Q = U2(a.items, W);
      Q && C(Q.key);
    }
    function C(W) {
      const Q = a.items.find((R) => R.key === W);
      if (!Q || Q.status === "out-of-stock")
        return;
      u.value = !1;
      const Y = x(Q);
      if (d.value.find((R) => R.key === W)) {
        d.value = d.value.map(
          (R) => R.key === W ? M(R, Number(R.qty ?? 1) + 1, Y) : R
        );
        return;
      }
      d.value = [
        ...d.value,
        {
          key: Q.key,
          label: Q.label,
          detail: Q.caption ?? null,
          qty: 1,
          amount: a.formatMoney(Y)
        }
      ];
    }
    function k(W, Q) {
      const Y = a.items.find((R) => R.key === W), G = x(Y);
      d.value = d.value.map((R) => R.key === W ? M(R, Q, G) : R);
    }
    function B(W) {
      d.value = d.value.filter((Q) => Q.key !== W);
    }
    const A = h(
      () => d.value.reduce((W, Q) => {
        const Y = a.items.find((G) => G.key === Q.key);
        return W + x(Y) * Number(Q.qty ?? 1);
      }, 0)
    ), w = h(
      () => a.discountRate > 0 ? Math.round(A.value * a.discountRate) : 0
    ), m = h(
      () => Math.round((A.value - w.value) * a.taxRate)
    ), g = h(() => d.value.length ? a.formatMoney(A.value) : null), S = h(
      () => d.value.length && w.value > 0 ? `−${a.formatMoney(w.value)}` : null
    ), I = h(
      () => d.value.length && a.taxRate > 0 ? a.formatMoney(m.value) : null
    ), j = h(
      () => d.value.length ? a.formatMoney(A.value - w.value + m.value) : null
    );
    function X() {
      u.value = !0, r("pay", d.value);
    }
    return (W, Q) => (t(), n(P, null, [
      l("div", X2, [
        l("section", ek, [
          l("div", tk, [
            F(Re, {
              variant: "small",
              title: e.shelfTitle,
              description: e.shelfDescription ?? void 0
            }, null, 8, ["title", "description"]),
            l("div", ak, [
              y(Dt)(s.value) ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "text-muted-foreground hover:text-foreground text-xs hover:underline",
                onClick: Q[0] || (Q[0] = (Y) => s.value = {
                  ...y(He)(),
                  query: s.value.query
                })
              }, " Clear ")) : b("", !0),
              e.facets.length > 0 ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "relative inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
                onClick: Q[1] || (Q[1] = (Y) => i.value = !0)
              }, [
                Q[5] || (Q[5] = l("svg", {
                  viewBox: "0 0 24 24",
                  class: "size-4",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  l("path", { d: "M3 5h18M6 12h12M10 19h4" })
                ], -1)),
                Q[6] || (Q[6] = q(" Filters ", -1)),
                y(Dt)(s.value) ? (t(), n("span", nk, " on ")) : b("", !0)
              ])) : b("", !0)
            ])
          ]),
          F(ha, {
            searchable: "",
            autofocus: "",
            "search-placeholder": e.searchPlaceholder,
            items: c.value,
            onFilter: v,
            onSelect: Q[2] || (Q[2] = (Y) => r("select", Y)),
            onCart: C,
            onScan: $
          }, null, 8, ["search-placeholder", "items"])
        ]),
        F(N2, {
          class: "lg:sticky lg:top-4",
          title: e.cartTitle,
          items: d.value,
          subtotal: g.value,
          "discount-label": e.discountLabel,
          discount: S.value,
          "tax-label": e.taxLabel,
          tax: I.value,
          total: j.value,
          onQty: k,
          onRemove: B
        }, {
          pay: L(() => [
            Z(W.$slots, "pay", {
              cart: d.value,
              paid: u.value,
              pay: X
            }, () => [
              F(ue, {
                class: "w-full",
                disabled: d.value.length === 0,
                onClick: X
              }, {
                default: L(() => [
                  q(f(u.value ? "Paid" : "Pay"), 1)
                ]),
                _: 1
              }, 8, ["disabled"])
            ])
          ]),
          _: 3
        }, 8, ["title", "items", "subtotal", "discount-label", "discount", "tax-label", "tax", "total"])
      ]),
      F(pn, {
        open: i.value,
        title: "Filter shelf",
        "hide-search": "",
        facets: e.facets,
        applied: s.value,
        onClose: Q[3] || (Q[3] = (Y) => i.value = !1),
        onApply: p,
        onReset: Q[4] || (Q[4] = (Y) => s.value = { ...y(He)(), query: s.value.query })
      }, null, 8, ["open", "facets", "applied"])
    ], 64));
  }
}), lk = {
  key: 0,
  class: "flex flex-col gap-5"
}, ok = { class: "bg-muted aspect-[4/3] overflow-hidden rounded-lg" }, sk = ["src", "alt"], rk = {
  key: 0,
  class: "flex gap-2 overflow-x-auto"
}, ik = ["src"], dk = { class: "flex items-start justify-between gap-3" }, uk = { class: "text-lg font-semibold tabular-nums" }, ck = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, fk = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, mk = { class: "grid grid-cols-2 gap-3" }, pk = { class: "flex flex-col gap-2" }, vk = { class: "text-xs font-semibold tracking-wide text-muted-foreground uppercase" }, zM = /* @__PURE__ */ V({
  __name: "CatalogInspect",
  props: {
    open: { type: Boolean },
    item: {}
  },
  emits: ["close", "cart"],
  setup(e, { emit: o }) {
    const a = e, r = o;
    function s(p) {
      let x = 0;
      for (const M of p)
        x = x * 31 + M.charCodeAt(0) >>> 0;
      return x;
    }
    function i(p, x) {
      return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(($, C) => ({
        label: $,
        value: Math.max(0, Math.round(p + Math.sin(C + x) * p * 0.18))
      }));
    }
    const d = h(() => a.item?.kind === "unit"), u = h(() => {
      const p = a.item;
      if (!p)
        return [];
      const x = p.stock ?? p.progress?.value ?? p.metrics?.price ?? p.metrics?.rent ?? 12;
      return i(Number(x) || 12, s(p.key) % 7);
    }), c = h(() => {
      const p = a.item;
      if (!p)
        return [];
      const x = p.progress?.value ?? (p.status === "occupied" ? 80 : 20);
      return i(Number(x) || 20, s(p.key) % 5 + 1);
    }), v = h(
      () => !!a.item && !d.value && a.item?.status !== "out-of-stock"
    );
    return (p, x) => (t(), T(Tt, {
      open: e.open,
      title: e.item?.label ?? "Item",
      description: e.item?.caption ?? e.item?.sku ?? null,
      size: "md",
      onClose: x[1] || (x[1] = (M) => r("close"))
    }, gt({
      default: L(() => [
        e.item ? (t(), n("div", lk, [
          l("div", ok, [
            e.item.image ? (t(), n("img", {
              key: 0,
              src: e.item.image,
              alt: e.item.label,
              class: "size-full object-cover"
            }, null, 8, sk)) : b("", !0)
          ]),
          e.item.images?.length ? (t(), n("div", rk, [
            (t(!0), n(P, null, O(e.item.images, (M, $) => (t(), n("img", {
              key: $,
              src: M,
              alt: "",
              class: "size-16 shrink-0 rounded-md object-cover"
            }, null, 8, ik))), 128))
          ])) : b("", !0),
          l("div", dk, [
            l("div", null, [
              l("p", uk, f(e.item.price), 1),
              typeof e.item.stock == "number" ? (t(), n("p", ck, f(e.item.stock) + " in stock ", 1)) : b("", !0)
            ]),
            e.item.status ? (t(), T(Be, {
              key: 0,
              status: e.item.status,
              tone: e.item.tone
            }, null, 8, ["status", "tone"])) : b("", !0)
          ]),
          e.item.facts?.length ? (t(), n("p", fk, f(e.item.facts.join(" · ")), 1)) : b("", !0),
          l("div", mk, [
            F(jt, {
              label: d.value ? "Occupancy" : "Stock",
              value: d.value ? `${e.item.progress?.value ?? 0}%` : String(e.item.stock ?? e.item.progress?.value ?? 0),
              series: d.value ? c.value : u.value
            }, null, 8, ["label", "value", "series"]),
            F(jt, {
              label: "Price",
              value: e.item.price ?? "-",
              series: u.value
            }, null, 8, ["value", "series"])
          ]),
          l("div", pk, [
            l("p", vk, f(d.value ? "Occupancy, last 6 months" : "Stock movement, last 6 months"), 1),
            F(Et, {
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
        fn: L(() => [
          l("button", {
            type: "button",
            class: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
            onClick: x[0] || (x[0] = (M) => r("cart", e.item.key))
          }, " Add to cart ")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["open", "title", "description"]));
  }
}), gk = { class: "flex flex-col gap-10" }, hk = { class: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" }, bk = { class: "flex flex-col gap-3" }, yk = { class: "bg-muted aspect-[4/3] overflow-hidden rounded-lg border" }, xk = ["src", "alt"], kk = {
  key: 0,
  class: "flex gap-2 overflow-x-auto"
}, $k = ["aria-label", "aria-pressed", "onClick"], wk = ["src"], Ck = { class: "flex flex-col gap-5" }, Mk = { class: "flex flex-wrap items-start justify-between gap-3" }, Sk = { class: "min-w-0" }, Bk = { class: "text-2xl font-semibold tracking-tight" }, Ak = { class: "text-muted-foreground mt-1 text-sm" }, zk = { class: "text-2xl font-semibold tabular-nums" }, Pk = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, _k = { class: "grid grid-cols-2 gap-3 text-sm" }, Vk = {
  key: 0,
  class: "rounded-lg border p-3"
}, Lk = { class: "mt-1 font-medium" }, Ok = { class: "rounded-lg border p-3" }, jk = { class: "text-muted-foreground text-xs font-medium tracking-wide uppercase" }, Dk = { class: "mt-1 font-medium" }, Tk = { class: "flex flex-col gap-4" }, Ik = { class: "grid gap-4 sm:grid-cols-2" }, Ek = { class: "bg-card rounded-lg border p-4" }, Fk = { class: "mb-3 text-sm font-medium" }, Nk = /* @__PURE__ */ V({
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
      return ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((B, A) => ({
        label: B,
        value: Math.max(0, Math.round($ + Math.sin(A + C) * $ * 0.18))
      }));
    }
    const d = h(() => a.item.kind === "unit"), u = h(() => {
      const $ = [a.item.image, ...a.item.images ?? []].filter(
        (C) => typeof C == "string" && C !== ""
      );
      return [...new Set($)];
    }), c = K(0), v = h(() => {
      const $ = a.item.stock ?? a.item.progress?.value ?? a.item.metrics?.price ?? a.item.metrics?.rent ?? 12;
      return i(Number($) || 12, s(a.item.key) % 7);
    }), p = h(() => {
      const $ = a.item.progress?.value ?? (a.item.status === "occupied" ? 80 : 20);
      return i(Number($) || 20, s(a.item.key) % 5 + 1);
    }), x = h(() => d.value ? p.value : v.value), M = h(() => !d.value && a.item.status !== "out-of-stock");
    return ($, C) => (t(), n("div", gk, [
      l("div", hk, [
        l("div", bk, [
          l("div", yk, [
            u.value[c.value] ? (t(), n("img", {
              key: 0,
              src: u.value[c.value],
              alt: e.item.label,
              class: "size-full object-cover"
            }, null, 8, xk)) : b("", !0)
          ]),
          u.value.length > 1 ? (t(), n("div", kk, [
            (t(!0), n(P, null, O(u.value, (k, B) => (t(), n("button", {
              key: k,
              type: "button",
              class: z(["size-16 shrink-0 overflow-hidden rounded-md border", B === c.value ? "ring-2 ring-foreground" : "opacity-80"]),
              "aria-label": `Photo ${B + 1}`,
              "aria-pressed": B === c.value ? "true" : "false",
              onClick: (A) => c.value = B
            }, [
              l("img", {
                src: k,
                alt: "",
                class: "size-full object-cover"
              }, null, 8, wk)
            ], 10, $k))), 128))
          ])) : b("", !0)
        ]),
        l("div", Ck, [
          l("div", Mk, [
            l("div", Sk, [
              l("h1", Bk, f(e.item.label), 1),
              l("p", Ak, f(e.item.caption ?? e.item.sku), 1)
            ]),
            e.item.status ? (t(), T(Be, {
              key: 0,
              status: e.item.status,
              tone: e.item.tone
            }, null, 8, ["status", "tone"])) : b("", !0)
          ]),
          l("p", zk, f(e.item.price), 1),
          e.item.facts?.length ? (t(), n("p", Pk, f(e.item.facts.join(" · ")), 1)) : b("", !0),
          l("dl", _k, [
            e.item.sku ? (t(), n("div", Vk, [
              C[1] || (C[1] = l("dt", { class: "text-muted-foreground text-xs font-medium tracking-wide uppercase" }, " SKU ", -1)),
              l("dd", Lk, f(e.item.sku), 1)
            ])) : b("", !0),
            l("div", Ok, [
              l("dt", jk, f(d.value ? "Occupancy" : "Stock"), 1),
              l("dd", Dk, f(d.value ? `${e.item.progress?.value ?? 0}%` : `${e.item.stock ?? e.item.progress?.value ?? 0} in stock`), 1)
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
      l("section", Tk, [
        C[2] || (C[2] = l("h2", { class: "text-sm font-semibold tracking-wide text-muted-foreground uppercase" }, " Analytics ", -1)),
        l("div", Ik, [
          F(jt, {
            label: d.value ? "Occupancy" : "Stock",
            value: d.value ? `${e.item.progress?.value ?? 0}%` : String(e.item.stock ?? e.item.progress?.value ?? 0),
            series: x.value
          }, null, 8, ["label", "value", "series"]),
          F(jt, {
            label: "Price",
            value: e.item.price ?? "-",
            series: v.value
          }, null, 8, ["value", "series"])
        ]),
        l("div", Ek, [
          l("p", Fk, f(d.value ? "Occupancy, last 6 months" : "Stock movement, last 6 months"), 1),
          F(yh, {
            data: x.value,
            type: "area",
            height: 220
          }, null, 8, ["data"])
        ])
      ])
    ]));
  }
}), Rk = ["href"], PM = /* @__PURE__ */ V({
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
      class: z(["flex w-full flex-col gap-8", e.embedded ? "" : y(dt)])
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
        q(" " + f(e.backLabel), 1)
      ], 8, Rk),
      F(Nk, {
        item: e.item,
        onCart: s[0] || (s[0] = (i) => a("cart", i))
      }, null, 8, ["item"])
    ], 2));
  }
}), Hk = {
  key: 0,
  class: "inline-flex w-fit rounded-md border",
  role: "tablist",
  "aria-label": "Catalog section"
}, Uk = ["aria-selected", "onClick"], Kk = {
  class: "flex flex-wrap items-center gap-2 sm:flex-nowrap",
  "data-slot": "catalog-page-toolbar"
}, qk = {
  key: 0,
  class: "bg-primary text-primary-foreground ml-0.5 rounded-full px-1.5 text-[10px] font-semibold"
}, Gk = {
  class: "ml-auto inline-flex shrink-0 rounded-md border",
  role: "group",
  "aria-label": "Layout"
}, Wk = ["aria-pressed"], Zk = ["aria-pressed"], _M = /* @__PURE__ */ V({
  __name: "CatalogBrowser",
  props: /* @__PURE__ */ Ue({
    title: { default: "Catalog" },
    description: { default: null },
    tabs: {},
    pageSize: { default: 8 },
    embedded: { type: Boolean, default: !0 }
  }, {
    layout: { default: "grid" },
    layoutModifiers: {}
  }),
  emits: /* @__PURE__ */ Ue(["select", "cart"], ["update:layout"]),
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(a.tabs[0]?.key ?? ""), i = xt(e, "layout"), d = K({}), u = K(!1);
    ge(
      () => a.tabs.map((k) => k.key).join(","),
      (k) => {
        k.split(",").includes(s.value) || (s.value = a.tabs[0]?.key ?? "");
      }
    );
    function c(k) {
      return d.value[k] ?? He();
    }
    const v = h(
      () => a.tabs.find((k) => k.key === s.value) ?? a.tabs[0] ?? null
    ), p = h(
      () => v.value ? c(v.value.key) : He()
    ), x = h(() => {
      const k = v.value;
      return k ? k.items.filter((B) => ba(B, c(k.key))) : [];
    });
    function M(k) {
      const B = v.value?.key;
      B && (d.value = {
        ...d.value,
        [B]: { ...c(B), query: k }
      });
    }
    function $() {
      const k = v.value?.key;
      k && (d.value = { ...d.value, [k]: He() });
    }
    function C(k) {
      const B = v.value?.key;
      B && (d.value = { ...d.value, [B]: k }, u.value = !1);
    }
    return (k, B) => (t(), n(P, null, [
      l("div", {
        class: z(["flex w-full flex-col gap-8", e.embedded ? "" : y(dt)])
      }, [
        F(Re, {
          title: e.title,
          description: e.description ?? void 0
        }, null, 8, ["title", "description"]),
        e.tabs.length > 1 ? (t(), n("div", Hk, [
          (t(!0), n(P, null, O(e.tabs, (A) => (t(), n("button", {
            key: A.key,
            type: "button",
            class: z([
              "rounded px-3 py-1.5 text-sm transition-colors",
              s.value === A.key ? "bg-foreground text-background font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            ]),
            role: "tab",
            "aria-selected": s.value === A.key ? "true" : "false",
            onClick: (w) => s.value = A.key
          }, f(A.label), 11, Uk))), 128))
        ])) : b("", !0),
        l("div", Kk, [
          F(Ae, {
            class: "min-w-0 w-full flex-1 sm:max-w-xs",
            "model-value": p.value.query,
            type: "search",
            placeholder: v.value?.searchPlaceholder ?? "Search…",
            "aria-label": v.value?.searchPlaceholder ?? "Search",
            "onUpdate:modelValue": B[0] || (B[0] = (A) => M(String(A)))
          }, null, 8, ["model-value", "placeholder", "aria-label"]),
          y(Dt)(p.value) ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline",
            onClick: $
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
            B[9] || (B[9] = q(" Filters ", -1)),
            y(Dt)(p.value) ? (t(), n("span", qk, " on ")) : b("", !0)
          ])) : b("", !0),
          l("div", Gk, [
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "grid" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "grid" ? "true" : "false",
              "aria-label": "Grid",
              onClick: B[2] || (B[2] = (A) => i.value = "grid")
            }, " Tiles ", 10, Wk),
            l("button", {
              type: "button",
              class: z([
                "px-2.5 py-1.5 text-xs transition-colors",
                i.value === "list" ? "bg-foreground text-background" : "hover:bg-muted/60"
              ]),
              "aria-pressed": i.value === "list" ? "true" : "false",
              "aria-label": "List",
              onClick: B[3] || (B[3] = (A) => i.value = "list")
            }, " List ", 10, Zk)
          ])
        ]),
        F(ha, {
          layout: i.value,
          "onUpdate:layout": B[4] || (B[4] = (A) => i.value = A),
          "page-size": e.pageSize,
          items: x.value,
          onSelect: B[5] || (B[5] = (A) => r("select", A)),
          onCart: B[6] || (B[6] = (A) => r("cart", A))
        }, null, 8, ["layout", "page-size", "items"])
      ], 2),
      F(pn, {
        open: u.value,
        title: v.value?.filterTitle ?? "Filters",
        "search-placeholder": v.value?.searchPlaceholder ?? "Search…",
        facets: v.value?.facets ?? [],
        applied: p.value,
        onClose: B[7] || (B[7] = (A) => u.value = !1),
        onApply: C,
        onReset: $
      }, null, 8, ["open", "title", "search-placeholder", "facets", "applied"])
    ], 64));
  }
}), Yk = { class: "flex flex-col gap-4" }, Jk = { class: "flex flex-col gap-4" }, VM = /* @__PURE__ */ V({
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
    const a = e, r = o, s = K(He()), i = h(
      () => a.cards.filter((d) => ba(d, s.value))
    );
    return (d, u) => (t(), n("div", {
      class: z(["flex w-full flex-col gap-10", e.embedded ? "" : y(dt)])
    }, [
      F(Re, {
        title: e.title,
        description: e.description ?? void 0
      }, null, 8, ["title", "description"]),
      l("section", Yk, [
        F(Re, {
          variant: "small",
          title: e.cardsTitle,
          description: e.cardsDescription ?? void 0
        }, null, 8, ["title", "description"]),
        F(ha, {
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
      l("section", Jk, [
        F(Re, {
          variant: "small",
          title: e.tableTitle,
          description: e.tableDescription ?? void 0
        }, null, 8, ["title", "description"]),
        F(yo, {
          columns: e.columns,
          rows: e.rows,
          "empty-title": e.emptyTitle
        }, {
          "cell:status": L(({ value: c }) => [
            F(Be, {
              status: String(c)
            }, {
              default: L(() => [
                q(f(c), 1)
              ]),
              _: 2
            }, 1032, ["status"])
          ]),
          _: 1
        }, 8, ["columns", "rows", "empty-title"])
      ])
    ], 2));
  }
}), Qk = {
  class: "flex flex-col gap-2",
  "data-slot": "signature-pad"
}, Xk = { class: "text-sm font-medium" }, e$ = ["width", "height", "aria-label"], t$ = { class: "flex items-center gap-2" }, a$ = /* @__PURE__ */ V({
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
    function c(k) {
      const B = s.value;
      if (!B)
        return null;
      const A = B.getBoundingClientRect(), w = B.width / A.width, m = B.height / A.height;
      return {
        x: (k.clientX - A.left) * w,
        y: (k.clientY - A.top) * m
      };
    }
    function v(k) {
      a.disabled || (i.value = !0, d = c(k), s.value?.setPointerCapture(k.pointerId));
    }
    function p(k) {
      if (!i.value || a.disabled)
        return;
      const B = u(), A = c(k);
      !B || !A || !d || (B.strokeStyle = "#111827", B.lineWidth = 2.4, B.lineCap = "round", B.lineJoin = "round", B.beginPath(), B.moveTo(d.x, d.y), B.lineTo(A.x, A.y), B.stroke(), d = A);
    }
    function x() {
      i.value = !1, d = null;
    }
    function M() {
      const k = s.value, B = u();
      !k || !B || (B.clearRect(0, 0, k.width, k.height), r("clear"));
    }
    function $() {
      const k = s.value;
      k && r("save", k.toDataURL("image/png"));
    }
    function C() {
      const k = s.value, B = u();
      !k || !B || (B.fillStyle = "#ffffff", B.fillRect(0, 0, k.width, k.height));
    }
    return ke(C), Me(() => {
      i.value = !1;
    }), (k, B) => (t(), n("div", Qk, [
      l("p", Xk, f(e.label), 1),
      l("canvas", {
        ref_key: "canvas",
        ref: s,
        width: e.width,
        height: e.height,
        class: z(["bg-background w-full max-w-full cursor-crosshair touch-none rounded-md border", e.disabled ? "pointer-events-none opacity-50" : ""]),
        "aria-label": e.label,
        onPointerdown: be(v, ["prevent"]),
        onPointermove: be(p, ["prevent"]),
        onPointerup: be(x, ["prevent"]),
        onPointerleave: be(x, ["prevent"])
      }, null, 42, e$),
      l("div", t$, [
        F(ue, {
          variant: "outline",
          size: "sm",
          disabled: e.disabled,
          onClick: M
        }, {
          default: L(() => [...B[0] || (B[0] = [
            q(" Clear ", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        F(ue, {
          size: "sm",
          disabled: e.disabled,
          onClick: $
        }, {
          default: L(() => [...B[1] || (B[1] = [
            q("Save signature", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}), n$ = { class: "grid gap-8 lg:grid-cols-2" }, l$ = { class: "flex flex-col gap-3" }, o$ = { class: "text-muted-foreground text-xs font-normal" }, s$ = {
  key: 0,
  class: "flex flex-col gap-3"
}, r$ = { class: "flex flex-wrap gap-3" }, i$ = ["onClick"], d$ = ["src", "alt"], u$ = {
  key: 1,
  class: "flex flex-col gap-3"
}, c$ = { class: "flex flex-wrap gap-3" }, f$ = ["onClick"], m$ = ["src", "alt"], p$ = {
  key: 2,
  class: "flex flex-col gap-4"
}, v$ = { class: "flex flex-wrap items-center gap-2" }, g$ = { class: "mx-auto w-full max-w-3xl overflow-hidden rounded-lg border shadow-sm" }, h$ = { class: "flex items-end justify-between gap-6 bg-white px-8 pb-8 text-black" }, b$ = { class: "flex flex-col gap-2" }, y$ = ["src"], x$ = {
  key: 1,
  class: "text-sm text-neutral-400"
}, k$ = ["src"], LM = /* @__PURE__ */ V({
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
    function c(k) {
      try {
        const B = localStorage.getItem(k), A = B ? JSON.parse(B) : [];
        return Array.isArray(A) ? A : [];
      } catch {
        return [];
      }
    }
    ke(() => {
      !o.storageKey || typeof localStorage > "u" || (a.value = c(`${o.storageKey}.signatures`), r.value = c(`${o.storageKey}.stamps`), s.value = a.value[0]?.id ?? null, i.value = r.value[0]?.id ?? null);
    }), ge(
      a,
      (k) => {
        !o.storageKey || typeof localStorage > "u" || localStorage.setItem(`${o.storageKey}.signatures`, JSON.stringify(k));
      },
      { deep: !0 }
    ), ge(
      r,
      (k) => {
        !o.storageKey || typeof localStorage > "u" || localStorage.setItem(`${o.storageKey}.stamps`, JSON.stringify(k));
      },
      { deep: !0 }
    );
    function v(k) {
      const B = {
        id: `sig-${Date.now()}`,
        name: `Signature ${a.value.length + 1}`,
        dataUrl: k
      };
      a.value = [B, ...a.value].slice(0, 8), s.value = B.id;
    }
    async function p(k, B) {
      await Im(k), B(40);
      const A = await new Promise((w, m) => {
        const g = new FileReader();
        g.onload = () => w(String(g.result)), g.onerror = () => m(new Error("Could not read the file")), g.readAsDataURL(k);
      });
      return B(100), { value: A, name: k.name, size: k.size, url: A };
    }
    function x() {
      const k = d.value?.url ?? d.value?.value;
      if (!k)
        return;
      const B = {
        id: `stamp-${Date.now()}`,
        name: d.value?.name ?? "Stamp",
        dataUrl: k
      };
      r.value = [B, ...r.value].slice(0, 8), i.value = B.id;
    }
    const M = h(
      () => a.value.find((k) => k.id === s.value)?.dataUrl ?? null
    ), $ = h(
      () => r.value.find((k) => k.id === i.value)?.dataUrl ?? null
    ), C = h(() => {
      const k = o.documents.find((A) => A.key === u.value)?.document ?? o.documents[0]?.document ?? {}, B = {
        ...k?.branding ?? {},
        logoUrl: d.value?.url ?? null
      };
      return {
        ...k,
        branding: B
      };
    });
    return (k, B) => (t(), n("div", {
      class: z(["flex w-full flex-col gap-10", e.embedded ? "" : y(dt)])
    }, [
      F(Re, {
        title: e.title,
        description: e.description ?? void 0
      }, null, 8, ["title", "description"]),
      l("section", n$, [
        F(a$, {
          label: "Draw a signature",
          onSave: v
        }),
        l("div", l$, [
          B[2] || (B[2] = l("p", { class: "text-sm font-medium" }, "Company logo / stamp", -1)),
          l("p", o$, f(y(rn)), 1),
          F(Wa, {
            modelValue: d.value,
            "onUpdate:modelValue": B[0] || (B[0] = (A) => d.value = A),
            image: "",
            accept: ["png", "webp"],
            "max-kilobytes": 2048,
            upload: p
          }, null, 8, ["modelValue"]),
          F(ue, {
            size: "sm",
            variant: "outline",
            disabled: !d.value,
            onClick: x
          }, {
            default: L(() => [...B[1] || (B[1] = [
              q(" Save as stamp ", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ]),
      a.value.length ? (t(), n("section", s$, [
        F(Re, {
          variant: "small",
          title: "Saved signatures"
        }),
        l("div", r$, [
          (t(!0), n(P, null, O(a.value, (A) => (t(), n("button", {
            key: A.id,
            type: "button",
            class: z(["rounded-md border p-2", A.id === s.value ? "ring-ring ring-2" : ""]),
            onClick: (w) => s.value = A.id
          }, [
            l("img", {
              src: A.dataUrl,
              alt: A.name,
              class: "h-12 w-40 bg-white object-contain"
            }, null, 8, d$)
          ], 10, i$))), 128))
        ])
      ])) : b("", !0),
      r.value.length ? (t(), n("section", u$, [
        F(Re, {
          variant: "small",
          title: "Saved stamps"
        }),
        l("div", c$, [
          (t(!0), n(P, null, O(r.value, (A) => (t(), n("button", {
            key: A.id,
            type: "button",
            class: z(["rounded-md border p-2", A.id === i.value ? "ring-ring ring-2" : ""]),
            onClick: (w) => i.value = A.id
          }, [
            l("img", {
              src: A.dataUrl,
              alt: A.name,
              class: "size-16 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-[length:12px_12px] object-contain"
            }, null, 8, m$)
          ], 10, f$))), 128))
        ])
      ])) : b("", !0),
      e.documents.length ? (t(), n("section", p$, [
        l("div", v$, [
          (t(!0), n(P, null, O(e.documents, (A) => (t(), T(ue, {
            key: A.key,
            size: "sm",
            variant: u.value === A.key ? "default" : "outline",
            onClick: (w) => u.value = A.key
          }, {
            default: L(() => [
              q(f(A.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "onClick"]))), 128))
        ]),
        l("div", g$, [
          F(Vg, {
            document: C.value
          }, null, 8, ["document"]),
          l("div", h$, [
            l("div", b$, [
              B[3] || (B[3] = l("p", { class: "text-xs tracking-wider text-neutral-500 uppercase" }, "Signed", -1)),
              M.value ? (t(), n("img", {
                key: 0,
                src: M.value,
                alt: "Signature",
                class: "h-16 w-48 object-contain"
              }, null, 8, y$)) : (t(), n("p", x$, "Draw and save a signature"))
            ]),
            $.value ? (t(), n("img", {
              key: 0,
              src: $.value,
              alt: "Stamp",
              class: "h-20 w-20 object-contain"
            }, null, 8, k$)) : b("", !0)
          ])
        ])
      ])) : b("", !0)
    ], 2));
  }
}), OM = "panel.dashboard.hiddenWidgets", $$ = /* @__PURE__ */ Symbol("dashboardHide"), w$ = {
  key: 0,
  class: "w-full",
  "data-slot": "dashboard-shortcuts"
}, jM = /* @__PURE__ */ V({
  __name: "DashboardShortcuts",
  props: {
    catalog: {},
    defaults: { default: () => [] },
    storageKey: { default: "panel.dashboard.shortcuts" }
  },
  setup(e) {
    const o = e, a = At($$, null), r = K(
      o.catalog.filter((d) => o.defaults.includes(d.id))
    ), s = K(!1);
    ke(() => {
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
    }), ge(
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
    const i = h(() => a?.hidden.value.has("shortcuts") ?? !1);
    return (d, u) => i.value ? b("", !0) : (t(), n("div", w$, [
      F(k0, {
        items: r.value,
        catalog: e.catalog,
        hideable: "",
        "onUpdate:items": u[0] || (u[0] = (c) => r.value = c),
        onHide: u[1] || (u[1] = (c) => y(a)?.hide("shortcuts", "Shortcuts"))
      }, null, 8, ["items", "catalog"])
    ]));
  }
}), C$ = ["aria-busy"], M$ = ["data-slot"], S$ = ["aria-pressed", "aria-label", "title"], B$ = {
  class: "size-4",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, A$ = { class: "text-muted-foreground text-[11px] font-semibold tracking-wider uppercase" }, z$ = { class: "flex h-8 items-center" }, P$ = ["aria-label", "title", "onClick"], _$ = ["aria-label", "title", "onClick"], V$ = {
  key: 3,
  class: "truncate text-2xl font-semibold tabular-nums"
}, L$ = {
  key: 1,
  class: "text-muted-foreground truncate text-xs"
}, DM = /* @__PURE__ */ V({
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
    const c = h(() => a.segments.some(u)), v = h(() => a.segments.some(d)), p = {
      2: "grid-cols-2",
      3: "grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    }, x = h(() => p[a.columns] ?? p[4]), M = h(() => {
      const w = a.columns ?? 4, m = Math.floor(a.segments.length / w) * w;
      return a.segments.slice(0, m);
    }), $ = h(() => {
      const w = a.columns ?? 4, m = Math.floor(a.segments.length / w) * w;
      return a.segments.slice(m);
    }), C = h(() => {
      const w = [];
      return M.value.length > 0 && w.push({ key: "packed", joined: !0, segments: M.value }), $.value.length > 0 && w.push({ key: "leftover", joined: !1, segments: $.value }), w;
    });
    function k() {
      const w = c.value === !1;
      s.value = !w, i.value = /* @__PURE__ */ new Set(), r("toggle", w);
    }
    function B(w) {
      if (!d(w))
        return;
      const m = new Set(i.value);
      if (u(w))
        m.add(w.key);
      else if (m.delete(w.key), s.value) {
        s.value = !1;
        for (const g of a.segments)
          g.key !== w.key && d(g) && m.add(g.key);
      }
      i.value = m, r("toggle", c.value);
    }
    function A(w) {
      return typeof w == "number" ? new Intl.NumberFormat().format(w) : w;
    }
    return (w, m) => (t(), n("div", {
      class: "flex flex-col gap-3",
      "data-slot": "stat-strip",
      "aria-busy": e.loading ? "true" : void 0
    }, [
      (t(!0), n(P, null, O(C.value, (g) => (t(), n("div", {
        key: g.key,
        class: z(["relative shrink-0", g.joined ? "bg-border overflow-hidden rounded-xl border shadow-sm" : ""]),
        "data-slot": g.joined ? "stat-packed" : "stat-leftover"
      }, [
        e.maskable && v.value && g.key === C.value[0]?.key ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 rounded p-1 transition-colors",
          "aria-pressed": c.value,
          "aria-label": c.value ? "Show all values" : "Hide all values",
          title: c.value ? "Show all values" : "Hide all values",
          onClick: k
        }, [
          (t(), n("svg", B$, [
            c.value ? (t(), n(P, { key: 0 }, [
              m[0] || (m[0] = l("path", { d: "M10.7 6.2A9 9 0 0 1 12 6c5 0 9 4.5 9 6a12 12 0 0 1-2.2 3" }, null, -1)),
              m[1] || (m[1] = l("path", { d: "M6.6 6.9A13 13 0 0 0 3 12c0 1.5 4 6 9 6a9 9 0 0 0 3.7-.8" }, null, -1)),
              m[2] || (m[2] = l("path", { d: "M9.9 9.9a3 3 0 0 0 4.2 4.2" }, null, -1)),
              m[3] || (m[3] = l("path", { d: "m3 3 18 18" }, null, -1))
            ], 64)) : (t(), n(P, { key: 1 }, [
              m[4] || (m[4] = l("path", { d: "M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6Z" }, null, -1)),
              m[5] || (m[5] = l("circle", {
                cx: "12",
                cy: "12",
                r: "3"
              }, null, -1))
            ], 64))
          ]))
        ], 8, S$)) : b("", !0),
        l("div", {
          class: z(["grid", [g.joined ? "gap-px" : "gap-3", x.value]])
        }, [
          (t(!0), n(P, null, O(g.segments, (S) => (t(), n("div", {
            key: S.key,
            class: z(["bg-card flex min-w-0 flex-col gap-2 p-4 sm:p-5", g.joined ? "" : "overflow-hidden rounded-xl border"])
          }, [
            l("p", A$, f(S.label), 1),
            l("div", z$, [
              e.loading ? (t(), T(je, {
                key: 0,
                variant: "number"
              })) : u(S) ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "hover:bg-muted/60 -mx-1 flex items-center gap-1.5 rounded px-1 py-1 transition-colors",
                "aria-label": `${S.label} hidden. Show it.`,
                title: `Show ${S.label}`,
                onClick: (I) => B(S)
              }, [
                (t(), n(P, null, O(5, (I) => l("span", {
                  key: I,
                  class: "bg-muted-foreground/70 size-1.5 rounded-full"
                })), 64))
              ], 8, P$)) : d(S) ? (t(), n("button", {
                key: 2,
                type: "button",
                class: "hover:bg-muted/60 -mx-1 truncate rounded px-1 text-2xl font-semibold tabular-nums transition-colors",
                "aria-label": `${S.label}, ${A(S.value)}. Hide it.`,
                title: `Hide ${S.label}`,
                onClick: (I) => B(S)
              }, f(A(S.value)), 9, _$)) : (t(), n("span", V$, f(A(S.value)), 1)),
              S.trend && !e.loading && !u(S) ? (t(), T(mn, {
                key: 4,
                direction: S.trend.direction,
                percentage: S.trend.percentage,
                inverted: S.inverted,
                class: "ml-2 shrink-0"
              }, null, 8, ["direction", "percentage", "inverted"])) : b("", !0)
            ]),
            S.sparkline?.length && !e.loading && !u(S) ? (t(), T(Et, {
              key: 0,
              data: S.sparkline,
              height: 24
            }, null, 8, ["data"])) : b("", !0),
            S.caption || S.comparison && S.trend ? (t(), n("p", L$, f(S.caption ?? S.comparison), 1)) : b("", !0)
          ], 2))), 128))
        ], 2)
      ], 10, M$))), 128))
    ], 8, C$));
  }
}), O$ = ["aria-label"], j$ = { class: "flex items-center justify-between gap-3" }, D$ = ["aria-valuenow", "aria-label"], T$ = { class: "flex items-center gap-3" }, I$ = { class: "min-w-0 flex-1 text-sm" }, E$ = { class: "font-medium" }, F$ = {
  key: 0,
  class: "text-muted-foreground mt-0.5 block text-xs sm:mt-0 sm:inline sm:before:content-[':_']"
}, N$ = {
  key: 1,
  class: "flex flex-col gap-3 rounded-lg border bg-card p-4"
}, R$ = { class: "flex items-center justify-between gap-2" }, H$ = { class: "text-sm font-semibold" }, U$ = { class: "flex items-center gap-3" }, K$ = ["href"], q$ = {
  key: 0,
  class: "flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3"
}, G$ = { class: "flex min-w-0 flex-col gap-0.5" }, W$ = { class: "text-sm font-medium" }, Z$ = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, Y$ = {
  key: 1,
  class: "flex flex-col gap-2"
}, J$ = {
  key: 0,
  viewBox: "0 0 24 24",
  class: "size-3.5",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "3",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Q$ = { class: "flex min-w-0 flex-1 flex-col gap-0.5" }, X$ = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, TM = /* @__PURE__ */ V({
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
    const a = e, r = o, s = h(() => a.items.find(($) => !$.done) ?? null), i = h(() => a.items.filter(($) => $.key !== s.value?.key)), d = h(() => a.items.length), u = h(() => a.items.filter(($) => $.done).length), c = h(
      () => d.value > 0 ? Math.round(u.value / d.value * 100) : 0
    ), v = h(() => {
      const $ = a.linkComponent;
      return typeof $ == "string" ? $ : $n($);
    }), p = at({
      variant: "default",
      size: "sm",
      class: "no-underline mt-2 self-start"
    }), x = at({
      variant: "default",
      size: "sm",
      class: "no-underline shrink-0"
    }), M = at({
      variant: "outline",
      size: "sm",
      class: "no-underline shrink-0"
    });
    return ($, C) => e.items.length && e.variant === "onboarding" ? (t(), n("section", {
      key: 0,
      class: "flex flex-col gap-2.5 rounded-md border bg-card p-3",
      "aria-label": e.heading
    }, [
      l("div", j$, [
        l("div", {
          class: "flex flex-1 items-center gap-1",
          role: "progressbar",
          "aria-valuenow": c.value,
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          "aria-label": `${e.heading}, ${c.value} percent complete`
        }, [
          (t(!0), n(P, null, O(e.items, (k, B) => (t(), n("span", {
            key: k.key,
            class: z(["h-1.5 flex-1 rounded-sm transition-colors duration-300", B < u.value ? "bg-amber-500" : "bg-muted"])
          }, null, 2))), 128))
        ], 8, D$),
        e.skipLabel ? (t(), n("button", {
          key: 0,
          type: "button",
          class: "text-muted-foreground hover:text-foreground shrink-0 text-xs hover:underline",
          onClick: C[0] || (C[0] = (k) => r("skip"))
        }, f(e.skipLabel), 1)) : b("", !0)
      ]),
      l("div", T$, [
        l("p", I$, [
          l("span", E$, f(s.value ? s.value.title : e.heading), 1),
          s.value?.detail ? (t(), n("span", F$, f(s.value.detail), 1)) : b("", !0)
        ]),
        s.value?.href ? (t(), T(ze(v.value), {
          key: 0,
          href: s.value.href,
          class: z(y(x))
        }, {
          default: L(() => [
            q(f(s.value.actionLabel || "Open"), 1)
          ]),
          _: 1
        }, 8, ["href", "class"])) : b("", !0)
      ])
    ], 8, O$)) : e.items.length ? (t(), n("section", N$, [
      l("div", R$, [
        l("h2", H$, f(e.heading), 1),
        l("div", U$, [
          e.skipLabel ? (t(), n("button", {
            key: 0,
            type: "button",
            class: "text-xs text-muted-foreground font-normal hover:text-foreground hover:underline",
            onClick: C[1] || (C[1] = (k) => r("skip"))
          }, f(e.skipLabel), 1)) : b("", !0),
          e.reportHref ? (t(), n("a", {
            key: 1,
            href: e.reportHref,
            class: "text-xs text-muted-foreground font-normal hover:text-foreground hover:underline"
          }, " Full report ", 8, K$)) : b("", !0)
        ])
      ]),
      s.value ? (t(), n("div", q$, [
        C[2] || (C[2] = l("span", {
          class: "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-500",
          "aria-hidden": "true"
        }, null, -1)),
        l("div", G$, [
          l("p", W$, f(s.value.title), 1),
          s.value.detail ? (t(), n("p", Z$, f(s.value.detail), 1)) : b("", !0),
          s.value.href ? (t(), T(ze(v.value), {
            key: 1,
            href: s.value.href,
            class: z(y(p))
          }, {
            default: L(() => [
              q(f(s.value.actionLabel || "Open"), 1)
            ]),
            _: 1
          }, 8, ["href", "class"])) : b("", !0)
        ])
      ])) : b("", !0),
      i.value.length ? (t(), n("ul", Y$, [
        (t(!0), n(P, null, O(i.value, (k) => (t(), n("li", {
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
            k.done ? (t(), n("svg", J$, [...C[3] || (C[3] = [
              l("path", { d: "M20 6 9 17l-5-5" }, null, -1)
            ])])) : b("", !0)
          ], 2),
          l("div", Q$, [
            l("p", {
              class: z(["text-sm", k.done ? "text-muted-foreground line-through" : "font-medium"])
            }, f(k.title), 3),
            !k.done && k.detail ? (t(), n("p", X$, f(k.detail), 1)) : b("", !0)
          ]),
          !k.done && k.href ? (t(), T(ze(v.value), {
            key: 0,
            href: k.href,
            class: z(y(M))
          }, {
            default: L(() => [
              q(f(k.actionLabel || "Open"), 1)
            ]),
            _: 2
          }, 1032, ["href", "class"])) : b("", !0)
        ]))), 128))
      ])) : b("", !0)
    ])) : b("", !0);
  }
}), ew = {
  "data-slot": "selection-bar",
  class: "flex min-h-9 flex-wrap items-center gap-x-4 gap-y-2 text-sm",
  role: "status",
  "aria-live": "polite",
  "aria-label": "Selection actions"
}, tw = { class: "text-foreground font-medium tabular-nums" }, aw = { class: "ml-auto hidden items-center gap-2 md:flex" }, nw = { class: "ml-auto md:hidden" }, lw = { class: "border-b px-4 py-4" }, ow = { class: "flex items-start gap-3" }, sw = { class: "text-muted-foreground text-sm font-normal" }, rw = { class: "flex flex-col gap-2 overflow-y-auto p-4" }, IM = /* @__PURE__ */ V({
  __name: "SelectionBar",
  props: {
    count: {},
    allMatching: { type: Boolean },
    total: {}
  },
  emits: ["select-all-matching", "clear"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(!1), i = (u) => new Intl.NumberFormat().format(u), d = h(() => a.allMatching ? a.total !== void 0 ? `All ${i(a.total)} matching records` : "All matching records" : `${i(a.count)} selected`);
    return (u, c) => (t(), n("div", ew, [
      l("span", tw, f(d.value), 1),
      !e.allMatching && e.total !== void 0 && e.total > e.count ? (t(), n("button", {
        key: 0,
        type: "button",
        class: "text-primary font-medium hover:underline",
        onClick: c[0] || (c[0] = (v) => r("select-all-matching"))
      }, " Select all " + f(i(e.total)), 1)) : b("", !0),
      l("button", {
        type: "button",
        class: "text-destructive font-medium hover:underline",
        onClick: c[1] || (c[1] = (v) => r("clear"))
      }, " Deselect all "),
      l("div", aw, [
        Z(u.$slots, "actions")
      ]),
      l("div", nw, [
        l("button", {
          type: "button",
          dusk: "mobile-bulk-actions",
          class: "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium shadow-sm transition-colors",
          onClick: c[2] || (c[2] = (v) => s.value = !0)
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
          q(" Actions ", -1)
        ])]),
        F(ca, {
          open: s.value,
          "onUpdate:open": c[3] || (c[3] = (v) => s.value = v)
        }, {
          default: L(() => [
            F(fa, {
              side: "bottom",
              class: "max-h-[70vh] gap-0 overflow-hidden p-0"
            }, {
              default: L(() => [
                l("div", lw, [
                  l("div", ow, [
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
                      l("p", sw, f(d.value), 1)
                    ])
                  ])
                ]),
                l("div", rw, [
                  Z(u.$slots, "actions")
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
}), iw = { class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, dw = { class: "text-muted-foreground text-xs font-normal tabular-nums" }, uw = {
  key: 0,
  class: "text-muted-foreground flex items-center gap-2 text-xs"
}, cw = ["value"], fw = ["value"], mw = {
  class: "flex items-center gap-1",
  "aria-label": "Pagination"
}, pw = ["disabled"], vw = ["disabled"], gw = {
  class: "bg-primary/10 text-primary inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-sm font-medium tabular-nums",
  "aria-current": "page"
}, hw = {
  key: 0,
  class: "text-muted-foreground px-1 text-xs tabular-nums"
}, bw = ["disabled"], EM = /* @__PURE__ */ V({
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
    const a = e, r = o, s = (c) => new Intl.NumberFormat().format(c), i = h(() => a.rowsOnPage === 0 ? 0 : (a.page - 1) * a.perPage + 1), d = h(() => (a.page - 1) * a.perPage + a.rowsOnPage), u = h(
      () => a.total === void 0 ? null : Math.max(1, Math.ceil(a.total / a.perPage))
    );
    return (c, v) => (t(), n("div", iw, [
      l("p", dw, [
        q(" Showing " + f(s(i.value)) + "-" + f(s(d.value)) + " ", 1),
        e.total !== void 0 ? (t(), n(P, { key: 0 }, [
          q("of " + f(s(e.total)), 1)
        ], 64)) : b("", !0)
      ]),
      e.perPageOptions.length > 1 ? (t(), n("label", uw, [
        v[4] || (v[4] = l("span", null, "Per page", -1)),
        l("select", {
          value: e.perPage,
          class: "border-input bg-background text-foreground h-8 rounded-md border px-2 text-xs",
          onChange: v[0] || (v[0] = (p) => r("update:perPage", Number(p.target.value)))
        }, [
          (t(!0), n(P, null, O(e.perPageOptions, (p) => (t(), n("option", {
            key: p,
            value: p
          }, f(p), 9, fw))), 128))
        ], 40, cw)
      ])) : b("", !0),
      l("nav", mw, [
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
        ])], 8, pw),
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
        ])], 8, vw),
        l("span", gw, f(e.page), 1),
        u.value !== null ? (t(), n("span", hw, " of " + f(s(u.value)), 1)) : b("", !0),
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
        ])], 8, bw)
      ])
    ]));
  }
}), yw = {
  class: "pk-tabs bg-muted/40 flex w-fit max-w-full shrink-0 items-center gap-0.5 overflow-x-auto rounded-lg p-1",
  role: "tablist",
  "aria-label": "Table views"
}, xw = ["aria-current", "aria-selected"], kw = ["title"], $w = ["aria-current", "aria-selected", "onClick"], ww = ["title"], Cw = /* @__PURE__ */ V({
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
    return (s, i) => (t(), n("div", yw, [
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
        i[1] || (i[1] = q(" All ", -1)),
        e.counts ? (t(), n("span", {
          key: 0,
          class: z([
            "rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums",
            e.active === null ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15"
          ]),
          title: new Intl.NumberFormat().format(e.counts.all ?? 0)
        }, f(r(e.counts.all ?? 0)), 11, kw)) : (t(), T(je, {
          key: 1,
          variant: "badge",
          label: "Counting"
        }))
      ], 10, xw),
      (t(!0), n(P, null, O(e.tabs, (d) => (t(), n("button", {
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
        q(f(d) + " ", 1),
        e.counts ? (t(), n("span", {
          key: 0,
          class: z([
            "rounded px-1.5 py-0.5 text-[11px] leading-none tabular-nums",
            e.active === d ? "bg-primary text-primary-foreground" : "bg-muted-foreground/15"
          ]),
          title: new Intl.NumberFormat().format(e.counts[d] ?? 0)
        }, f(r(e.counts[d] ?? 0)), 11, ww)) : (t(), T(je, {
          key: 1,
          variant: "badge",
          label: "Counting"
        }))
      ], 10, $w))), 128))
    ]));
  }
}), FM = /* @__PURE__ */ it(Cw, [["__scopeId", "data-v-8348f90f"]]), Mw = { class: "group/saved relative shrink-0" }, Sw = {
  class: "pk-focus-ring inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-md border px-2.5 text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden",
  "aria-label": "Saved table views"
}, Bw = {
  key: 0,
  class: "max-w-28 truncate text-xs text-foreground"
}, Aw = { class: "bg-popover text-popover-foreground absolute top-full left-0 z-30 mt-2 w-72 rounded-lg border p-2 shadow-xl" }, zw = {
  key: 0,
  class: "mt-1 max-h-56 overflow-y-auto"
}, Pw = ["onClick"], _w = ["aria-label", "onClick"], Vw = {
  key: 1,
  class: "px-2 py-3 text-xs text-muted-foreground"
}, NM = /* @__PURE__ */ V({
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
    return (s, i) => (t(), n("details", Mw, [
      l("summary", Sw, [
        i[0] || (i[0] = q(" Views ", -1)),
        e.active ? (t(), n("span", Bw, f(e.active), 1)) : b("", !0),
        i[1] || (i[1] = l("span", { "aria-hidden": "true" }, "⌄", -1))
      ]),
      l("div", Aw, [
        l("form", {
          class: "flex gap-2 border-b pb-2",
          onSubmit: be(r, ["prevent"])
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
        e.views.length ? (t(), n("div", zw, [
          (t(!0), n(P, null, O(e.views, (d) => (t(), n("div", {
            key: d.name,
            class: "flex items-center gap-1 rounded-md px-1 hover:bg-muted"
          }, [
            l("button", {
              type: "button",
              class: z(["pk-focus-ring min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left text-sm", d.name === e.active ? "font-medium text-primary" : ""]),
              onClick: (u) => a("apply", d)
            }, f(d.name), 11, Pw),
            l("button", {
              type: "button",
              class: "pk-focus-ring rounded px-2 py-1 text-xs text-muted-foreground hover:text-destructive",
              "aria-label": `Delete saved view ${d.name}`,
              onClick: (u) => a("remove", d.name)
            }, " × ", 8, _w)
          ]))), 128))
        ])) : (t(), n("p", Vw, " Save filters, columns, and layout for quick reuse. "))
      ])
    ]));
  }
}), Lw = {
  key: 0,
  class: "text-muted-foreground text-sm font-normal"
}, Ow = { class: "grid gap-2" }, jw = {
  key: 0,
  class: "text-destructive text-sm"
}, Dw = { class: "flex gap-2" }, RM = /* @__PURE__ */ V({
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
    })()), i = K(!1), d = wn(null), u = h(() => d.value?.isLoading.value ?? !1), c = h(() => d.value?.error.value ?? null), v = h(() => d.value?.isSupported.value ?? !1);
    ke(async () => {
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
    const p = async (M) => {
      M.preventDefault(), !(!s.value.trim() || d.value === null) && await d.value.register(s.value);
    }, x = () => {
      i.value = !1, s.value = "";
    };
    return (M, $) => v.value ? i.value ? (t(), n("form", {
      key: 2,
      class: "border-border bg-muted/50 space-y-4 rounded-lg border p-4",
      onSubmit: p
    }, [
      l("div", Ow, [
        $[3] || ($[3] = l("label", {
          for: "pk-passkey-name",
          class: "text-sm font-medium"
        }, " Passkey name ", -1)),
        xe(l("input", {
          id: "pk-passkey-name",
          "onUpdate:modelValue": $[1] || ($[1] = (C) => s.value = C),
          type: "text",
          autofocus: "",
          placeholder: "e.g. MacBook Pro, iPhone",
          class: "border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        }, null, 512), [
          [Le, s.value]
        ]),
        $[4] || ($[4] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " A name helps you identify this passkey later. ", -1))
      ]),
      c.value ? (t(), n("p", jw, f(c.value), 1)) : b("", !0),
      l("div", Dw, [
        F(ue, {
          type: "submit",
          disabled: u.value || !s.value.trim()
        }, {
          default: L(() => [
            q(f(u.value ? "Registering…" : "Register passkey"), 1)
          ]),
          _: 1
        }, 8, ["disabled"]),
        F(ue, {
          type: "button",
          variant: "ghost",
          onClick: x
        }, {
          default: L(() => [...$[5] || ($[5] = [
            q(" Cancel ", -1)
          ])]),
          _: 1
        })
      ])
    ], 32)) : (t(), T(ue, {
      key: 1,
      variant: "outline",
      onClick: $[0] || ($[0] = (C) => i.value = !0)
    }, {
      default: L(() => [...$[2] || ($[2] = [
        q(" Add passkey ", -1)
      ])]),
      _: 1
    })) : (t(), n("p", Lw, " Passkeys are not supported in this browser. "));
  }
}), Tw = { class: "pk-form-stack" }, Iw = {
  key: 0,
  class: "border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm",
  role: "alert"
}, HM = /* @__PURE__ */ V({
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
    qt("panelPicker", {
      get base() {
        return a.pickerBase ?? "";
      },
      get returnUrl() {
        return a.returnUrl ?? "";
      }
    }), qt("panelCreateOption", {
      run(c, v) {
        return a.createOption ? a.createOption(c, v) : Promise.reject(new Error("Create is not available on this field."));
      }
    });
    const r = o, s = h(() => a.nodes.length > 0), i = h(() => a.columns >= 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"), d = h(() => a.errors._conflict);
    function u(c) {
      if (a.upload)
        return (v, p) => a.upload(c, v, p);
    }
    return (c, v) => (t(), n("div", Tw, [
      d.value ? (t(), n("p", Iw, f(d.value), 1)) : b("", !0),
      s.value ? (t(!0), n(P, { key: 1 }, O(e.nodes, (p, x) => (t(), T(Ya, {
        key: x,
        node: p,
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
        (t(!0), n(P, null, O(e.fields, (p) => (t(), n("div", {
          key: p.key,
          class: z(p.span && p.span >= 2 ? "sm:col-span-2" : "")
        }, [
          F(Qe, {
            field: p,
            value: e.modelValue[p.key],
            error: e.errors[p.key],
            errors: e.errors,
            options: e.options[p.key],
            "child-options": e.options,
            processing: e.processing,
            "search-options": p.searchable && e.searchOptions ? (x) => e.searchOptions(p.key, x) : void 0,
            upload: u(p.key),
            discard: e.discard,
            onChange: (x) => r("change", p.key, x),
            onAffixAction: (x) => r("affix-action", p.key, x)
          }, null, 8, ["field", "value", "error", "errors", "options", "child-options", "processing", "search-options", "upload", "discard", "onChange", "onAffixAction"])
        ], 2))), 128))
      ], 2))
    ]));
  }
}), Ew = { class: "min-w-0 flex-1 truncate text-sm font-medium" }, Fw = ["disabled"], Nw = ["disabled"], Rw = ["disabled"], Hw = ["disabled"], Uw = "pointer-events-none sticky inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 px-3 pb-3 sm:bottom-0 sm:px-4 sm:pb-4", UM = /* @__PURE__ */ V({
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
    ke(() => {
      o.value = !!document.getElementById("pk-main");
    });
    const a = h(() => o.value ? "#pk-main" : "body"), r = h(() => !o.value), s = { opacity: "0", transform: "translateY(0.75rem)" }, i = { opacity: "1", transform: "translateY(0)" };
    function d(c, v) {
      const p = c;
      Object.assign(p.style, s, { transition: "none" }), requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          p.style.transition = "opacity 200ms ease-out, transform 200ms ease-out", Object.assign(p.style, i);
        });
      }), setTimeout(v, 200);
    }
    function u(c, v) {
      const p = c;
      Object.assign(p.style, i, {
        transition: "opacity 150ms ease-in, transform 150ms ease-in"
      }), requestAnimationFrame(() => {
        Object.assign(p.style, s);
      }), setTimeout(v, 150);
    }
    return (c, v) => (t(), T(yt, {
      to: a.value,
      disabled: r.value
    }, [
      F(ot, {
        css: !1,
        onEnter: d,
        onLeave: u
      }, {
        default: L(() => [
          e.show ? (t(), n("div", {
            key: 0,
            class: z(Uw),
            role: "status",
            "aria-live": "polite",
            "data-slot": "unsaved-bar"
          }, [
            l("div", {
              class: z([
                y(xo),
                "pointer-events-auto flex items-center gap-3 rounded-xl border bg-card/95 py-3 pr-3 pl-4 shadow-md ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10"
              ])
            }, [
              v[4] || (v[4] = l("span", {
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
              l("span", Ew, f(e.message), 1),
              e.discardLabel ? (t(), n("button", {
                key: 0,
                type: "button",
                class: "hover:bg-muted inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: v[0] || (v[0] = (p) => c.$emit("discard"))
              }, f(e.discardLabel), 9, Fw)) : b("", !0),
              l("button", {
                type: "button",
                class: "bg-muted hover:bg-muted/70 inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: v[1] || (v[1] = (p) => c.$emit("cancel"))
              }, f(e.cancelLabel), 9, Nw),
              e.extraLabel ? (t(), n("button", {
                key: 1,
                type: "button",
                class: "hover:bg-muted inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors disabled:opacity-50",
                disabled: e.processing,
                onClick: v[2] || (v[2] = (p) => c.$emit("extra"))
              }, f(e.extraLabel), 9, Rw)) : b("", !0),
              l("button", {
                type: "button",
                class: z([
                  "inline-flex min-h-9 items-center rounded-lg px-4 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50",
                  e.destructive ? "bg-destructive text-white" : "bg-primary text-primary-foreground"
                ]),
                disabled: e.processing,
                onClick: v[3] || (v[3] = (p) => c.$emit("save"))
              }, f(e.processing ? "Saving…" : e.saveLabel), 11, Hw)
            ], 2)
          ])) : b("", !0)
        ]),
        _: 1
      })
    ], 8, ["to", "disabled"]));
  }
});
function KM(e, o = {}) {
  const { warnOnUnload: a = !0 } = o, r = K(Kt(e.value)), s = h(() => Kt(e.value) !== r.value);
  function i() {
    r.value = Kt(e.value);
  }
  function d() {
    e.value = JSON.parse(r.value);
  }
  function u(c) {
    s.value && (c.preventDefault(), c.returnValue = "");
  }
  return ke(() => {
    a && window.addEventListener("beforeunload", u);
  }), Me(() => {
    window.removeEventListener("beforeunload", u);
  }), { dirty: s, commit: i, discard: d, baseline: r };
}
function Kt(e) {
  return JSON.stringify(e, (o, a) => a === void 0 ? null : a === null || typeof a != "object" || Array.isArray(a) ? a : Object.fromEntries(
    Object.entries(a).sort(([r], [s]) => r.localeCompare(s))
  ));
}
const Ct = /* @__PURE__ */ new Map();
function qM(e, o) {
  Ct.set(e, o);
}
function Kw(e) {
  return Ct.get(e);
}
function GM(e) {
  return Ct.has(e);
}
function qw() {
  return [...Ct.keys()].sort();
}
function WM() {
  Ct.clear();
}
const Gw = {
  key: 0,
  class: "flex flex-col gap-1"
}, Ww = { class: "text-muted-foreground text-[11px] font-medium tracking-wide uppercase" }, Zw = { class: "text-foreground text-sm font-medium" }, Yw = {
  key: 1,
  class: "text-muted-foreground font-normal"
}, Jw = {
  key: 5,
  class: "max-w-full font-normal"
}, Qw = {
  key: 0,
  class: "text-muted-foreground mb-1 font-mono text-[10px] uppercase"
}, Xw = { class: "bg-muted/50 overflow-x-auto rounded-md border p-3 font-mono text-xs font-normal" }, e4 = {
  key: 6,
  class: "font-normal"
}, t4 = {
  key: 0,
  class: "divide-y rounded-md border"
}, a4 = { class: "text-muted-foreground truncate font-medium" }, n4 = { class: "text-foreground col-span-2 break-words" }, l4 = {
  key: 1,
  class: "text-muted-foreground font-normal"
}, o4 = {
  key: 7,
  class: "flex flex-col gap-3 font-normal"
}, s4 = {
  key: 0,
  class: "text-muted-foreground font-normal"
}, r4 = {
  key: 10,
  class: "text-destructive text-xs font-normal",
  "data-testid": "missing-entry-view"
}, i4 = ["href"], d4 = { class: "flex min-w-0 items-start gap-2.5" }, u4 = {
  key: 0,
  class: "bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md",
  "aria-hidden": "true"
}, c4 = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.75",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  class: "size-3.5"
}, f4 = ["d"], m4 = { class: "min-w-0" }, p4 = { class: "flex flex-wrap items-center gap-2" }, v4 = { class: "text-sm font-semibold" }, g4 = {
  key: 0,
  class: "text-muted-foreground mt-0.5 text-xs"
}, h4 = ["aria-selected", "onClick"], b4 = /* @__PURE__ */ V({
  __name: "InfoNode",
  props: {
    node: {},
    record: {},
    depth: { default: 0 }
  },
  emits: ["action"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(!a.node.collapsed), i = K(0), d = h(() => a.depth === 0), u = h(() => {
      const w = a.node.columns, m = typeof w == "number" ? w : w?.default ?? w?.sm ?? w?.md ?? (a.node.component === "section" ? 2 : 1);
      return m >= 3 ? "sm:grid-cols-3" : m === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";
    });
    function c(w) {
      const m = w.columns, g = typeof m == "number" ? { default: m } : m, S = {};
      for (const I of ["default", "sm", "md", "lg", "xl", "2xl"]) {
        const j = g?.[I];
        typeof j == "number" && j > 0 && (S[`--pk-grid-cols-${I}`] = String(Math.min(12, Math.max(1, j))));
      }
      return S;
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
    }, p = h(() => a.node.key ? a.record[a.node.key] : null), x = h(() => {
      const w = p.value;
      return w == null || w === "";
    }), M = h(() => String(p.value ?? "").replace(/[_-]+/g, " ")), $ = h(() => {
      if (x.value)
        return "—";
      const w = Number(p.value);
      if (Number.isNaN(w))
        return "—";
      const m = a.node.divideBy ?? 100, g = w / m, S = a.node.currency ?? "USD";
      try {
        return new Intl.NumberFormat(void 0, { style: "currency", currency: S }).format(g);
      } catch {
        return `${S} ${g.toFixed(2)}`;
      }
    }), C = h(() => {
      if (x.value)
        return "—";
      const w = p.value;
      if (a.node.type === "date" || a.node.type === "datetime")
        return new Date(String(w)).toLocaleDateString(void 0, v[a.node.type]);
      if (a.node.type === "money")
        return $.value;
      let m = String(w);
      return a.node.transform === "upper" && (m = m.toUpperCase()), a.node.transform === "lower" && (m = m.toLowerCase()), [a.node.prefix, m, a.node.suffix].filter(Boolean).join(" ");
    }), k = h(() => {
      const w = typeof p.value == "boolean" ? p.value ? "1" : "" : String(p.value), m = a.node.colors?.[w] ?? a.node.defaultColor ?? "neutral";
      return ma[m] ?? "outline";
    }), B = h(() => {
      const w = typeof a.node.view == "string" ? a.node.view : "";
      return w ? Kw(w) : void 0;
    }), A = h(() => {
      const w = typeof a.node.view == "string" ? a.node.view : "";
      if (!w)
        return "ViewEntry has no view name.";
      const m = qw(), g = m.length > 0 ? m.join(", ") : "(none)";
      return `No entry view for [${w}]; registered: ${g}`;
    });
    return (w, m) => {
      const g = na("InfoNode", !0);
      return e.node.component === "entry" ? (t(), n("div", Gw, [
        l("dt", Ww, f(e.node.label), 1),
        l("dd", Zw, [
          e.node.type === "badge" && y(ic)(p.value) ? (t(), T(Ne, {
            key: 0,
            variant: k.value,
            class: "capitalize"
          }, {
            default: L(() => [
              q(f(M.value), 1)
            ]),
            _: 1
          }, 8, ["variant"])) : e.node.type === "badge" ? (t(), n("span", Yw, "—")) : e.node.type === "icon" ? (t(), T(Tu, {
            key: 2,
            value: p.value,
            icons: e.node.icons,
            colors: e.node.colors,
            labels: e.node.labels,
            "default-icon": e.node.defaultIcon
          }, null, 8, ["value", "icons", "colors", "labels", "default-icon"])) : e.node.type === "image" ? (t(), T(Ru, {
            key: 3,
            src: p.value,
            "fallback-text": e.record[e.node.fallbackFrom ?? "name"],
            rounded: e.node.rounded !== !1,
            size: e.node.size ?? "md",
            fallback: e.node.fallback ?? "initials"
          }, null, 8, ["src", "fallback-text", "rounded", "size", "fallback"])) : e.node.type === "color" || e.node.type === "colour" ? (t(), T(Gu, {
            key: 4,
            value: typeof p.value == "string" ? p.value : null,
            "show-value": e.node.showValue !== !1
          }, null, 8, ["value", "show-value"])) : e.node.type === "code" ? (t(), n("div", Jw, [
            e.node.language ? (t(), n("p", Qw, f(e.node.language), 1)) : b("", !0),
            l("pre", Xw, [
              l("code", null, f(p.value ?? ""), 1)
            ])
          ])) : e.node.type === "keyvalue" ? (t(), n("div", e4, [
            p.value && typeof p.value == "object" && !Array.isArray(p.value) && Object.keys(p.value).length ? (t(), n("dl", t4, [
              (t(!0), n(P, null, O(p.value, (S, I) => (t(), n("div", {
                key: I,
                class: "grid grid-cols-3 gap-2 px-3 py-2 text-sm"
              }, [
                l("dt", a4, f(I), 1),
                l("dd", n4, f(S), 1)
              ]))), 128))
            ])) : (t(), n("span", l4, "—"))
          ])) : e.node.type === "repeatable" ? (t(), n("div", o4, [
            (t(!0), n(P, null, O(Array.isArray(p.value) ? p.value : [], (S, I) => (t(), n("div", {
              key: I,
              class: "rounded-md border p-3"
            }, [
              (t(!0), n(P, null, O(e.node.entries ?? [], (j, X) => (t(), T(g, {
                key: X,
                node: j,
                record: S,
                depth: e.depth + 1,
                onAction: m[0] || (m[0] = (W) => r("action", W))
              }, null, 8, ["node", "record", "depth"]))), 128))
            ]))), 128)),
            !Array.isArray(p.value) || p.value.length === 0 ? (t(), n("span", s4, "—")) : b("", !0)
          ])) : e.node.type === "money" ? (t(), n("span", {
            key: 8,
            class: z(x.value ? "text-muted-foreground font-normal" : "")
          }, f($.value), 3)) : e.node.type === "view" && B.value ? (t(), T(ze(B.value), {
            key: 9,
            node: e.node,
            record: e.record,
            value: p.value
          }, null, 8, ["node", "record", "value"])) : e.node.type === "view" ? (t(), n("p", r4, f(A.value), 1)) : e.node.url && !x.value ? (t(), n("a", {
            key: 11,
            href: e.node.url,
            class: "text-foreground font-medium underline-offset-2 hover:underline"
          }, f(C.value), 9, i4)) : (t(), n("span", {
            key: 12,
            class: z([
              x.value || e.node.muted ? "text-muted-foreground font-normal" : "",
              e.node.mono ? "font-mono text-xs" : ""
            ])
          }, f(C.value), 3)),
          e.node.action ? (t(), n("button", {
            key: 13,
            type: "button",
            class: "text-muted-foreground hover:text-foreground mt-0.5 text-xs font-normal underline-offset-2 hover:underline",
            onClick: m[1] || (m[1] = (S) => r("action", e.node.action))
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
          onClick: m[2] || (m[2] = (S) => e.node.collapsible && (s.value = !s.value))
        }, [
          l("div", d4, [
            e.node.icon ? (t(), n("div", u4, [
              (t(), n("svg", c4, [
                l("path", {
                  d: y(me)(e.node.icon)
                }, null, 8, f4)
              ]))
            ])) : b("", !0),
            l("div", m4, [
              l("div", p4, [
                l("h3", v4, f(e.node.label), 1),
                e.node.status ? (t(), T(Be, {
                  key: 0,
                  status: e.node.status,
                  class: "capitalize"
                }, null, 8, ["status"])) : b("", !0)
              ]),
              e.node.description ? (t(), n("p", g4, f(e.node.description), 1)) : b("", !0)
            ])
          ])
        ], 2),
        s.value ? (t(), n("dl", {
          key: 0,
          class: z(["grid grid-cols-1 gap-x-6 gap-y-4", [u.value, d.value ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""]])
        }, [
          (t(!0), n(P, null, O(e.node.children ?? [], (S, I) => (t(), T(g, {
            key: I,
            node: S,
            record: e.record,
            depth: e.depth + 1,
            onAction: m[3] || (m[3] = (j) => r("action", j))
          }, null, 8, ["node", "record", "depth"]))), 128))
        ], 2)) : b("", !0)
      ], 2)) : e.node.component === "grid" ? (t(), n("dl", {
        key: 2,
        class: "pk-responsive-grid grid gap-x-6 gap-y-4",
        style: ie(c(e.node))
      }, [
        (t(!0), n(P, null, O(e.node.children ?? [], (S, I) => (t(), T(g, {
          key: I,
          node: S,
          record: e.record,
          depth: e.depth + 1,
          onAction: m[4] || (m[4] = (j) => r("action", j))
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
          (t(!0), n(P, null, O(e.node.children ?? [], (S, I) => (t(), n("button", {
            key: I,
            type: "button",
            role: "tab",
            class: z([
              "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors",
              i.value === I ? "bg-background text-foreground font-semibold shadow-sm ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground"
            ]),
            "aria-selected": i.value === I,
            onClick: (j) => i.value = I
          }, [
            q(f(S.label) + " ", 1),
            S.badge !== null && S.badge !== void 0 ? (t(), T(Ne, {
              key: 0,
              variant: "secondary"
            }, {
              default: L(() => [
                q(f(S.badge), 1)
              ]),
              _: 2
            }, 1024)) : b("", !0)
          ], 10, h4))), 128))
        ], 2),
        (t(!0), n(P, null, O(e.node.children ?? [], (S, I) => xe((t(), n("div", {
          key: I,
          class: z(["flex flex-col gap-5", d.value ? "p-4 sm:p-5" : "pt-4"])
        }, [
          (t(!0), n(P, null, O(S.children ?? [], (j, X) => (t(), T(g, {
            key: X,
            node: j,
            record: e.record,
            depth: e.depth + 1,
            onAction: m[5] || (m[5] = (W) => r("action", W))
          }, null, 8, ["node", "record", "depth"]))), 128))
        ], 2)), [
          [Ye, i.value === I]
        ])), 128))
      ], 2)) : b("", !0);
    };
  }
}), ZM = /* @__PURE__ */ it(b4, [["__scopeId", "data-v-e8206bd1"]]), y4 = { class: "text-muted-foreground text-sm font-normal" }, x4 = { class: "flex items-start gap-3" }, k4 = { class: "min-w-0 flex-1" }, $4 = { class: "flex flex-wrap items-center gap-2" }, w4 = { class: "truncate text-sm font-medium" }, C4 = { class: "text-muted-foreground mt-0.5 text-xs" }, M4 = { class: "text-muted-foreground text-xs font-normal" }, S4 = { class: "mt-auto flex items-center gap-2" }, B4 = /* @__PURE__ */ V({
  __name: "PaymentGateways",
  props: {
    gateways: {}
  },
  emits: ["configure", "toggle"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(() => a.gateways.filter((i) => i.connected).length);
    return (i, d) => (t(), n("div", {
      class: z(["flex flex-col gap-4", y(sn)]),
      "data-slot": "payment-gateways"
    }, [
      l("p", y4, f(s.value) + " of " + f(e.gateways.length) + " connected, showcase only, no live processors. ", 1),
      l("div", {
        class: z(y(zm))
      }, [
        (t(!0), n(P, null, O(e.gateways, (u) => (t(), n("article", {
          key: u.key,
          class: "bg-background flex flex-col gap-4 rounded-lg border p-4"
        }, [
          l("div", x4, [
            l("span", {
              class: "flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white",
              style: ie({ background: u.color }),
              "aria-hidden": "true"
            }, f(u.mark), 5),
            l("div", k4, [
              l("div", $4, [
                l("h3", w4, f(u.label), 1),
                F(Be, {
                  status: u.connected ? "connected" : "disconnected"
                }, {
                  default: L(() => [
                    q(f(u.connected ? "Connected" : "Not connected"), 1)
                  ]),
                  _: 2
                }, 1032, ["status"]),
                u.connected && u.enabled !== !1 ? (t(), T(Be, {
                  key: 0,
                  status: "offered"
                }, {
                  default: L(() => [...d[0] || (d[0] = [
                    q(" Offered ", -1)
                  ])]),
                  _: 1
                })) : u.connected ? (t(), T(Be, {
                  key: 1,
                  status: "disabled"
                }, {
                  default: L(() => [...d[1] || (d[1] = [
                    q(" Disabled ", -1)
                  ])]),
                  _: 1
                })) : b("", !0),
                u.isDefault ? (t(), T(Be, {
                  key: 2,
                  status: "default"
                }, {
                  default: L(() => [...d[2] || (d[2] = [
                    q(" Default ", -1)
                  ])]),
                  _: 1
                })) : b("", !0),
                u.connected && u.mode ? (t(), T(Be, {
                  key: 3,
                  status: u.mode
                }, {
                  default: L(() => [
                    q(f(u.mode), 1)
                  ]),
                  _: 2
                }, 1032, ["status"])) : b("", !0)
              ]),
              l("p", C4, f(u.caption), 1)
            ])
          ]),
          l("p", M4, f(u.methods.join(" · ")), 1),
          l("div", S4, [
            F(ue, {
              size: "sm",
              variant: "outline",
              onClick: (c) => r("configure", u.key)
            }, {
              default: L(() => [...d[3] || (d[3] = [
                q(" Configure ", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            F(ue, {
              size: "sm",
              variant: "ghost",
              onClick: (c) => r("toggle", u.key)
            }, {
              default: L(() => [
                q(f(u.connected ? "Disconnect" : "Connect"), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ])
        ]))), 128))
      ], 2)
    ], 2));
  }
}), A4 = { class: "flex flex-col gap-6" }, z4 = { class: "relative" }, P4 = {
  class: "text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true"
}, _4 = ["d"], V4 = {
  key: 1,
  class: "text-muted-foreground text-sm font-normal"
}, L4 = {
  key: 0,
  class: "flex flex-col gap-4"
}, O4 = { class: "flex flex-wrap items-center gap-2" }, j4 = { class: "text-muted-foreground text-sm font-normal" }, D4 = { class: "flex flex-col gap-1 text-sm" }, T4 = ["value"], I4 = {
  key: 0,
  class: "flex flex-col gap-2"
}, E4 = { class: "flex flex-wrap items-center gap-2" }, F4 = {
  key: 1,
  class: "flex items-center gap-2"
}, YM = /* @__PURE__ */ V({
  __name: "PaymentGatewaySettings",
  props: /* @__PURE__ */ Ue({
    title: { default: "Payment gateways" },
    description: { default: null },
    headingVariant: { default: "default" }
  }, {
    gateways: { default: () => [] },
    gatewaysModifiers: {}
  }),
  emits: ["update:gateways"],
  setup(e) {
    const o = xt(e, "gateways"), a = K(null), r = K(""), s = h(
      () => o.value.find(($) => $.key === a.value) ?? null
    ), i = h(() => {
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
    function c($) {
      a.value = $;
    }
    function v($) {
      const C = o.value.find((B) => B.key === $);
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
    function p($, C) {
      const k = o.value.find((B) => B.key === $);
      k?.connected && u($, { enabled: C, isDefault: C ? k.isDefault : !1 });
    }
    function x($) {
      const C = o.value.find((k) => k.key === $);
      !C || !d(C) || (o.value = o.value.map((k) => ({
        ...k,
        isDefault: k.key === $
      })));
    }
    function M($) {
      const C = a.value;
      !C || !o.value.find((B) => B.key === C)?.connected || u(C, { mode: $ });
    }
    return ($, C) => (t(), n(P, null, [
      l("div", A4, [
        F(Re, {
          variant: e.headingVariant,
          title: e.title,
          description: e.description ?? void 0
        }, null, 8, ["variant", "title", "description"]),
        l("div", z4, [
          (t(), n("svg", P4, [
            l("path", {
              d: y(me)("search")
            }, null, 8, _4)
          ])),
          F(Ae, {
            modelValue: r.value,
            "onUpdate:modelValue": C[0] || (C[0] = (k) => r.value = k),
            type: "search",
            class: "pl-9",
            placeholder: "Search gateways…",
            "aria-label": "Search payment gateways"
          }, null, 8, ["modelValue"])
        ]),
        i.value.length > 0 ? (t(), T(B4, {
          key: 0,
          gateways: i.value,
          onConfigure: c,
          onToggle: v
        }, null, 8, ["gateways"])) : (t(), n("p", V4, " No gateways match “" + f(r.value.trim()) + "”. ", 1))
      ]),
      F(Tt, {
        open: s.value !== null,
        title: s.value?.label ?? "Gateway",
        description: "Showcase fields only. Values are not sent anywhere.",
        size: "md",
        onClose: C[8] || (C[8] = (k) => a.value = null)
      }, {
        footer: L(() => [
          F(ue, {
            variant: "outline",
            size: "sm",
            onClick: C[6] || (C[6] = (k) => a.value = null)
          }, {
            default: L(() => [...C[21] || (C[21] = [
              q("Close", -1)
            ])]),
            _: 1
          }),
          s.value ? (t(), T(ue, {
            key: 0,
            size: "sm",
            onClick: C[7] || (C[7] = (k) => v(s.value.key))
          }, {
            default: L(() => [
              q(f(s.value.connected ? "Disconnect" : "Mark connected"), 1)
            ]),
            _: 1
          })) : b("", !0)
        ]),
        default: L(() => [
          s.value ? (t(), n("div", L4, [
            l("div", O4, [
              F(Be, {
                status: s.value.connected ? "connected" : "disconnected"
              }, {
                default: L(() => [
                  q(f(s.value.connected ? "Connected" : "Not connected"), 1)
                ]),
                _: 1
              }, 8, ["status"]),
              s.value.connected && s.value.enabled !== !1 ? (t(), T(Be, {
                key: 0,
                status: "offered"
              }, {
                default: L(() => [...C[9] || (C[9] = [
                  q(" Offered ", -1)
                ])]),
                _: 1
              })) : s.value.connected ? (t(), T(Be, {
                key: 1,
                status: "disabled"
              }, {
                default: L(() => [...C[10] || (C[10] = [
                  q(" Disabled ", -1)
                ])]),
                _: 1
              })) : b("", !0),
              s.value.isDefault ? (t(), T(Be, {
                key: 2,
                status: "default"
              }, {
                default: L(() => [...C[11] || (C[11] = [
                  q(" Default ", -1)
                ])]),
                _: 1
              })) : b("", !0),
              s.value.connected && s.value.mode ? (t(), T(Be, {
                key: 3,
                status: s.value.mode
              }, {
                default: L(() => [
                  q(f(s.value.mode), 1)
                ]),
                _: 1
              }, 8, ["status"])) : b("", !0)
            ]),
            l("p", j4, f(s.value.caption), 1),
            l("label", D4, [
              C[12] || (C[12] = q(" Display name ", -1)),
              l("input", {
                class: "border-input h-9 rounded-md border bg-transparent px-3 text-sm",
                value: s.value.label,
                readonly: ""
              }, null, 8, T4)
            ]),
            C[20] || (C[20] = l("label", { class: "flex flex-col gap-1 text-sm" }, [
              q(" Merchant / till (placeholder) "),
              l("input", {
                class: "border-input h-9 rounded-md border bg-transparent px-3 text-sm",
                placeholder: "Not stored, demo field",
                autocomplete: "off"
              })
            ], -1)),
            s.value.connected ? (t(), n("div", I4, [
              C[16] || (C[16] = l("p", { class: "text-sm font-medium" }, "Checkout", -1)),
              C[17] || (C[17] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " Disabled gateways stay connected but are not offered at checkout. Only one gateway can be the default tender. ", -1)),
              l("div", E4, [
                F(ue, {
                  size: "sm",
                  variant: s.value.enabled !== !1 ? "default" : "outline",
                  onClick: C[1] || (C[1] = (k) => p(s.value.key, !0))
                }, {
                  default: L(() => [...C[13] || (C[13] = [
                    q(" Enable ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant"]),
                F(ue, {
                  size: "sm",
                  variant: s.value.enabled === !1 ? "default" : "outline",
                  onClick: C[2] || (C[2] = (k) => p(s.value.key, !1))
                }, {
                  default: L(() => [...C[14] || (C[14] = [
                    q(" Disable ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant"]),
                F(ue, {
                  size: "sm",
                  variant: s.value.isDefault ? "default" : "outline",
                  disabled: !d(s.value),
                  onClick: C[3] || (C[3] = (k) => x(s.value.key))
                }, {
                  default: L(() => [...C[15] || (C[15] = [
                    q(" Use as default ", -1)
                  ])]),
                  _: 1
                }, 8, ["variant", "disabled"])
              ])
            ])) : b("", !0),
            s.value.connected ? (t(), n("div", F4, [
              F(ue, {
                size: "sm",
                variant: s.value.mode === "test" ? "default" : "outline",
                onClick: C[4] || (C[4] = (k) => M("test"))
              }, {
                default: L(() => [...C[18] || (C[18] = [
                  q(" Test ", -1)
                ])]),
                _: 1
              }, 8, ["variant"]),
              F(ue, {
                size: "sm",
                variant: s.value.mode === "live" ? "default" : "outline",
                onClick: C[5] || (C[5] = (k) => M("live"))
              }, {
                default: L(() => [...C[19] || (C[19] = [
                  q(" Live ", -1)
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
function Oa(e) {
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
function JM(e) {
  const o = K(Oa(e));
  ke(() => {
    o.value = Oa(e);
  }), ge(
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
function ja(e) {
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
function QM(e) {
  const o = K(ja(e));
  Da() && ke(() => {
    o.value = ja(e);
  }), ge(
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
function XM(e) {
  const { config: o, rows: a, rowKey: r = "id", fetchChanges: s, onResync: i, onInsert: d } = e, u = K(
    o.driver === "none" ? "off" : "connecting"
  ), c = K(/* @__PURE__ */ new Set());
  let v = /* @__PURE__ */ new Map(), p, x, M, $ = (/* @__PURE__ */ new Date()).toISOString(), C = null;
  function k(Q, Y) {
    v.set(Q, { ...v.get(Q) ?? {}, ...Y }), !p && (p = setTimeout(() => {
      p = void 0, B();
    }, o.batchMs));
  }
  function B() {
    if (v.size === 0)
      return;
    const Q = v;
    v = /* @__PURE__ */ new Map();
    const Y = /* @__PURE__ */ new Set();
    for (const [G, R] of Q) {
      const H = a.value.find((ae) => ae[r] === G);
      if (!H) {
        d?.(G, R);
        continue;
      }
      Object.assign(H, R), Y.add(G);
    }
    Y.size !== 0 && (c.value = /* @__PURE__ */ new Set([...c.value, ...Y]), setTimeout(() => {
      const G = new Set(c.value);
      Y.forEach((R) => G.delete(R)), c.value = G;
    }, 1500));
  }
  async function A() {
    if (!(!s || a.value.length === 0)) {
      M?.abort(), M = new AbortController();
      try {
        const Q = a.value.map((R) => R[r]), { records: Y, at: G } = await s(Q, $);
        $ = G, u.value = "live";
        for (const R of Y)
          k(R[r], R);
      } catch {
        u.value = "connecting";
      }
    }
  }
  function w() {
    m(), u.value = "live", x = setInterval(A, o.intervalMs);
  }
  function m() {
    clearInterval(x), x = void 0, M?.abort();
  }
  function g() {
    return window.Echo ?? null;
  }
  function S() {
    const Q = g();
    if (!Q || !o.channel) {
      u.value = "connecting", console.warn(
        "[alxtexhpanel] broadcast driver configured but window.Echo is unavailable."
      );
      return;
    }
    C = o.channel;
    const Y = Q.private(o.channel);
    for (const G of o.events)
      Y.listen(G, (R) => {
        R?.[r] !== void 0 && k(R[r], R);
      });
    u.value = "live", Q.connector?.pusher?.connection?.bind("connected", () => {
      u.value = "live", i?.();
    }), Q.connector?.pusher?.connection?.bind("disconnected", () => {
      u.value = "connecting";
    });
  }
  function I() {
    C && (g()?.leave(C), C = null);
  }
  function j() {
    o.driver === "poll" && w(), o.driver === "broadcast" && S();
  }
  function X() {
    m(), I(), clearTimeout(p), p = void 0, v = /* @__PURE__ */ new Map();
  }
  function W() {
    o.pauseWhenHidden && (document.hidden ? (X(), u.value = "paused") : ($ = (/* @__PURE__ */ new Date()).toISOString(), j(), i?.()));
  }
  return Da() && (ke(() => {
    o.driver !== "none" && (j(), o.pauseWhenHidden && document.addEventListener("visibilitychange", W));
  }), Me(() => {
    document.removeEventListener("visibilitychange", W), X();
  })), { status: u, recentlyChanged: c, applyPatch: k, flush: B, pollOnce: A };
}
const N4 = /^[a-z0-9-]+$/, R4 = /^[a-zA-Z0-9\s.,()%#/-]+$/;
function eS(e) {
  Cn(() => {
    if (typeof document > "u")
      return;
    const o = {};
    for (const [a, r] of Object.entries(e.value ?? {}))
      !N4.test(a) || typeof r != "string" || !R4.test(r) || (o[`--${a}`] = r);
    lf(o);
  });
}
const H4 = { class: "flex items-center gap-0.5" }, U4 = /* @__PURE__ */ V({
  __name: "PkColourModePreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), n("span", H4, [
      String(e.value) === "mono" ? (t(), n(P, { key: 0 }, [
        a[0] || (a[0] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-black" }, null, -1)),
        a[1] || (a[1] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-neutral-500" }, null, -1)),
        a[2] || (a[2] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-white" }, null, -1))
      ], 64)) : (t(), n(P, { key: 1 }, [
        a[3] || (a[3] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-sky-600" }, null, -1)),
        a[4] || (a[4] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-amber-500" }, null, -1)),
        a[5] || (a[5] = l("span", { class: "size-3 rounded-[2px] border border-neutral-400 bg-emerald-600" }, null, -1))
      ], 64))
    ]));
  }
}), K4 = /* @__PURE__ */ V({
  __name: "PkVoucherCodeBoxPreview",
  props: {
    value: {},
    label: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (o, a) => (t(), T(fn, {
      code: "AB-1234",
      style: ie(String(e.value)),
      compact: ""
    }, null, 8, ["style"]));
  }
}), q4 = {
  class: "flex flex-wrap gap-1.5",
  role: "listbox",
  "data-test": "icon-picker-field"
}, G4 = ["aria-selected", "disabled", "title", "onClick"], W4 = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkIconPicker",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(() => a.field.icons ?? []), i = h(() => typeof a.modelValue == "string" ? a.modelValue : "");
    function d(u) {
      a.disabled || r("update:modelValue", u === i.value ? null : u);
    }
    return (u, c) => (t(), n("div", q4, [
      (t(!0), n(P, null, O(s.value, (v) => (t(), n("button", {
        key: v,
        type: "button",
        role: "option",
        class: z(["border-input hover:bg-accent inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-xs font-medium disabled:opacity-50", [
          y(Se),
          i.value === v ? "border-primary bg-primary/10 text-primary" : ""
        ]]),
        "aria-selected": i.value === v,
        disabled: e.disabled,
        title: v,
        onClick: (p) => d(v)
      }, f(v), 11, G4))), 128))
    ]));
  }
}), Z4 = ["value", "placeholder", "disabled"], Y4 = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkPhone",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(() => typeof a.modelValue == "string" ? a.modelValue : "");
    function i(d) {
      const u = d.target.value;
      r("update:modelValue", u === "" ? null : u.trim());
    }
    return (d, u) => (t(), n("input", {
      type: "tel",
      inputmode: "tel",
      autocomplete: "tel",
      class: z(["border-input bg-background h-10 w-full rounded-md border px-3 text-sm", y(Se)]),
      value: s.value,
      placeholder: e.field.placeholder ?? "+254712345678",
      disabled: e.disabled,
      "data-test": "phone-field",
      onInput: i
    }, null, 42, Z4));
  }
}), J4 = ["aria-label"], Q4 = ["disabled", "aria-label", "aria-pressed", "onClick"], X4 = {
  class: "size-5",
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, e3 = { key: 0 }, t3 = ["id"], a3 = ["fill"], n3 = ["disabled"], l3 = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkRating",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = h(() => Math.max(1, Math.min(10, Number(a.field.max ?? 5)))), i = h(() => !!a.field.allowHalf), d = h(() => {
      const v = Number(a.modelValue);
      return Number.isFinite(v) ? v : 0;
    });
    function u(v) {
      a.disabled || r("update:modelValue", v);
    }
    function c(v) {
      return d.value >= v ? "full" : i.value && d.value >= v - 0.5 ? "half" : "empty";
    }
    return (v, p) => (t(), n("div", {
      class: "inline-flex items-center gap-0.5",
      role: "group",
      "aria-label": `Rating out of ${s.value}`,
      "data-test": "rating-field"
    }, [
      (t(!0), n(P, null, O(s.value, (x) => (t(), n("button", {
        key: x,
        type: "button",
        class: "rounded p-0.5 text-amber-500 transition-colors hover:text-amber-600 disabled:opacity-50",
        disabled: e.disabled,
        "aria-label": `${x} of ${s.value}`,
        "aria-pressed": d.value >= x,
        onClick: (M) => u(x)
      }, [
        (t(), n("svg", X4, [
          c(x) === "half" ? (t(), n("defs", e3, [
            l("linearGradient", {
              id: `half-${e.field.key}-${x}`,
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
            ])], 8, t3)
          ])) : b("", !0),
          l("path", {
            d: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z",
            fill: c(x) === "full" ? "currentColor" : c(x) === "half" ? `url(#half-${e.field.key}-${x})` : "none",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linejoin": "round"
          }, null, 8, a3)
        ]))
      ], 8, Q4))), 128)),
      d.value > 0 ? (t(), n("button", {
        key: 0,
        type: "button",
        class: "text-muted-foreground ml-1 text-xs hover:text-foreground disabled:opacity-50",
        disabled: e.disabled,
        onClick: p[0] || (p[0] = (x) => u(0))
      }, " Clear ", 8, n3)) : b("", !0)
    ], 8, J4));
  }
}), o3 = { class: "flex flex-col gap-2" }, s3 = { class: "bg-card rounded-lg border p-4" }, r3 = { class: "text-muted-foreground truncate text-xs" }, i3 = { class: "flex flex-wrap gap-x-4 gap-y-1 text-xs" }, d3 = /* @__PURE__ */ V({
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
    }, r = h(() => ({ ...a, ...o.field.limits ?? {} })), s = h(
      () => String(o.values[o.field.watch?.title ?? "seo_title"] ?? "").trim()
    ), i = h(
      () => String(o.values[o.field.watch?.description ?? "seo_description"] ?? "").trim()
    ), d = h(
      () => String(o.field.siteUrl ?? "").replace(/^https?:\/\//, "").replace(/\/+$/, "")
    ), u = h(() => {
      const C = String(o.field.path ?? "/").split("?")[0].replace(/^\/+|\/+$/g, "");
      return C === "" ? d.value : `${d.value} › ${C.split("/").join(" › ")}`;
    });
    function c(C, k) {
      return C.length <= k ? C : `${C.slice(0, k - 1).trimEnd()}…`;
    }
    const v = h(() => c(s.value, r.value.titleMax)), p = h(() => c(i.value, r.value.descriptionMax));
    function x(C, k, B) {
      return C === 0 ? { tone: "text-muted-foreground", note: "empty" } : C > B ? { tone: "text-amber-600 dark:text-amber-400", note: "truncated" } : C < k ? { tone: "text-muted-foreground", note: "short" } : { tone: "text-emerald-600 dark:text-emerald-400", note: "good" };
    }
    const M = h(
      () => x(s.value.length, r.value.titleMin, r.value.titleMax)
    ), $ = h(
      () => x(i.value.length, r.value.descriptionMin, r.value.descriptionMax)
    );
    return (C, k) => (t(), n("div", o3, [
      l("div", s3, [
        l("p", r3, f(u.value), 1),
        l("p", {
          class: z(["mt-1 truncate text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]", v.value === "" ? "text-muted-foreground italic" : ""])
        }, f(v.value || "Untitled page"), 3),
        l("p", {
          class: z(["text-muted-foreground mt-1 line-clamp-2 text-sm", p.value === "" ? "italic" : ""])
        }, f(p.value || "No description. The engine writes its own from the page text, which is usually a mid-sentence fragment."), 3)
      ]),
      l("div", i3, [
        l("span", {
          class: z(M.value.tone)
        }, " Title " + f(s.value.length) + "/" + f(r.value.titleMax) + " · " + f(M.value.note), 3),
        l("span", {
          class: z($.value.tone)
        }, " Description " + f(i.value.length) + "/" + f(r.value.descriptionMax) + " · " + f($.value.note), 3)
      ]),
      k[0] || (k[0] = l("p", { class: "text-muted-foreground text-xs font-normal" }, " An approximation. Engines measure pixel width rather than characters, and may rewrite a title they judge unhelpful. ", -1))
    ]));
  }
}), u3 = {
  class: "relative",
  "data-test": "tree-select-field"
}, c3 = ["disabled"], f3 = {
  key: 0,
  class: "bg-popover absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-md border p-1 shadow-md"
}, m3 = ["onClick"], p3 = ["onClick"], v3 = /* @__PURE__ */ V({
  inheritAttrs: !1,
  __name: "PkTreeSelect",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: o }) {
    const a = e, r = o, s = K(""), i = K(!1), d = h(() => a.field.options ?? []);
    function u(x, M) {
      return !M || x.label.toLowerCase().includes(M) ? !0 : (x.children ?? []).some(($) => u($, M));
    }
    const c = h(() => {
      const x = s.value.trim().toLowerCase();
      return x ? d.value.filter((M) => u(M, x)) : d.value;
    }), v = h(() => {
      const x = (M) => {
        for (const $ of M) {
          if ($.value === a.modelValue)
            return $.label;
          const C = x($.children ?? []);
          if (C)
            return C;
        }
        return null;
      };
      return x(d.value);
    });
    function p(x) {
      a.disabled || (r("update:modelValue", x), i.value = !1);
    }
    return (x, M) => (t(), n("div", u3, [
      l("button", {
        type: "button",
        class: z(["border-input bg-background flex h-10 w-full items-center justify-between rounded-md border px-3 text-left text-sm disabled:opacity-50", y(Se)]),
        disabled: e.disabled,
        onClick: M[0] || (M[0] = ($) => i.value = !i.value)
      }, [
        l("span", {
          class: z(v.value ? "" : "text-muted-foreground")
        }, f(v.value ?? "Select…"), 3),
        M[2] || (M[2] = l("span", { class: "text-muted-foreground text-xs font-normal" }, "▾", -1))
      ], 10, c3),
      i.value ? (t(), n("div", f3, [
        e.field.searchable ? xe((t(), n("input", {
          key: 0,
          "onUpdate:modelValue": M[1] || (M[1] = ($) => s.value = $),
          type: "search",
          class: "border-input mb-1 h-8 w-full rounded border px-2 text-sm",
          placeholder: "Search…"
        }, null, 512)), [
          [Le, s.value]
        ]) : b("", !0),
        (t(!0), n(P, null, O(c.value, ($) => (t(), n(P, {
          key: String($.value)
        }, [
          l("button", {
            type: "button",
            class: z(["hover:bg-accent flex w-full rounded px-2 py-1.5 text-left text-sm font-medium", e.modelValue === $.value ? "bg-accent" : ""]),
            onClick: (C) => p($.value)
          }, f($.label), 11, m3),
          (t(!0), n(P, null, O($.children ?? [], (C) => (t(), n("button", {
            key: String(C.value),
            type: "button",
            class: z(["hover:bg-accent text-muted-foreground flex w-full rounded py-1.5 pr-2 pl-6 text-left text-sm", e.modelValue === C.value ? "bg-accent text-foreground" : ""]),
            onClick: (k) => p(C.value)
          }, f(C.label), 11, p3))), 128))
        ], 64))), 128))
      ])) : b("", !0)
    ]));
  }
});
function g3() {
  Ce("radio", Ev), Ce("toggle-buttons", Za), Ce("checkboxlist", Rv), Ce("tags", Zv), Ce("colour", r1), Ce("slider", F1), Ce("rating", l3), Ce("phone", Y4), Ce("icon-picker", W4), Ce("tree-select", v3), Ce("visual-select", X1), Ce("markdown", bv), Ce("code", Mv), Ce("map", f1), Ce("qrcode", h1), Ce("barcode", C1), Ce("diff", B1), Ce("seo-preview", d3), Ut("swatch", tg), Ut("voucher-code-box", K4), Ut("document-colour-mode", U4);
}
function vn() {
  const e = K(null), o = K(!1);
  let a = null;
  return ke(() => {
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
  }), Me(() => a?.disconnect()), { el: e, shown: o };
}
const h3 = /* @__PURE__ */ V({
  __name: "PkReveal",
  props: {
    delay: { default: 0 }
  },
  setup(e) {
    const { el: o, shown: a } = vn();
    return (r, s) => (t(), n("div", {
      ref_key: "el",
      ref: o,
      class: z(["transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none", y(a) ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"]),
      style: ie({ transitionDelay: `${e.delay}ms` })
    }, [
      Z(r.$slots, "default")
    ], 6));
  }
}), b3 = ["id"], Pe = /* @__PURE__ */ V({
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
        F(h3, null, {
          default: L(() => [
            Z(o.$slots, "default")
          ]),
          _: 3
        })
      ], 2)
    ], 10, b3));
  }
}), y3 = {
  key: 0,
  class: "text-xs font-semibold tracking-widest text-primary uppercase"
}, x3 = {
  key: 1,
  class: "text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
}, k3 = {
  key: 2,
  class: "max-w-2xl text-pretty text-muted-foreground"
}, Ie = /* @__PURE__ */ V({
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
      e.eyebrow ? (t(), n("p", y3, f(e.eyebrow), 1)) : b("", !0),
      e.title ? (t(), n("h2", x3, f(e.title), 1)) : b("", !0),
      e.body ? (t(), n("p", k3, f(e.body), 1)) : b("", !0)
    ], 2)) : b("", !0);
  }
}), $3 = { class: "flex flex-col gap-10" }, w3 = { class: "grid gap-4 md:grid-cols-3" }, C3 = {
  key: 0,
  class: "text-xs font-medium text-muted-foreground"
}, M3 = { class: "text-sm font-semibold text-balance" }, S3 = {
  key: 1,
  class: "text-pretty text-sm text-muted-foreground"
}, B3 = /* @__PURE__ */ V({
  __name: "PkArticles",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Pe, null, {
      default: L(() => [
        l("div", $3, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", w3, [
            (t(!0), n(P, null, O(e.items ?? [], (r, s) => (t(), n("li", { key: s }, [
              (t(), T(ze(r.href ? "a" : "div"), {
                href: r.href || void 0,
                class: "flex h-full flex-col gap-3 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
              }, {
                default: L(() => [
                  r.meta ? (t(), n("p", C3, f(r.meta), 1)) : b("", !0),
                  l("h3", M3, f(r.title), 1),
                  r.body ? (t(), n("p", S3, f(r.body), 1)) : b("", !0)
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
function A3() {
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
  return ke(() => {
    typeof window < "u" && typeof window.matchMedia == "function" && (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover)").matches) || !e.value || (o = e.value, r(), o.addEventListener("pointermove", a, { passive: !0 }), o.addEventListener("pointerleave", r, { passive: !0 }));
  }), Me(() => {
    o?.removeEventListener("pointermove", a), o?.removeEventListener("pointerleave", r);
  }), { el: e };
}
const z3 = { class: "pk-tilt-inner relative h-full" }, P3 = /* @__PURE__ */ V({
  __name: "PkTiltCard",
  setup(e) {
    const { el: o } = A3();
    return (a, r) => (t(), n("div", {
      ref_key: "el",
      ref: o,
      class: "pk-tilt group/tilt"
    }, [
      l("div", z3, [
        r[0] || (r[0] = l("span", {
          class: "pk-tilt-glow pointer-events-none absolute inset-0 rounded-lg",
          "aria-hidden": "true"
        }, null, -1)),
        Z(a.$slots, "default")
      ])
    ], 512));
  }
}), _3 = { class: "flex flex-col gap-10" }, V3 = { class: "grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-3" }, L3 = { class: "text-base font-semibold" }, O3 = { class: "text-sm text-pretty text-muted-foreground" }, j3 = /* @__PURE__ */ V({
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
    return (a, r) => (t(), T(Pe, null, {
      default: L(() => [
        l("div", _3, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", V3, [
            (t(!0), n(P, null, O(e.items ?? [], (s, i) => (t(), T(P3, {
              key: i,
              class: z(o(s.span))
            }, {
              default: L(() => [
                l("div", {
                  class: z([
                    "flex h-full flex-col justify-end gap-2 overflow-hidden rounded-xl border p-6 transition-shadow duration-300 hover:shadow-lg",
                    s.accent ? "bg-primary/5 border-primary/30 dark:bg-primary/10" : "bg-card"
                  ])
                }, [
                  l("h3", L3, f(s.title), 1),
                  l("p", O3, f(s.body), 1)
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
}), D3 = { class: "grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center" }, T3 = { class: "flex flex-col gap-4 rounded-xl border bg-card p-6 sm:p-8" }, I3 = { class: "grid gap-4 text-sm" }, E3 = {
  key: 0,
  class: "grid gap-1"
}, F3 = ["href"], N3 = {
  key: 1,
  class: "grid gap-1"
}, R3 = ["href"], H3 = {
  key: 2,
  class: "grid gap-1"
}, U3 = { class: "text-pretty text-muted-foreground" }, K3 = ["href"], q3 = /* @__PURE__ */ V({
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
    return (o, a) => (t(), T(Pe, { muted: "" }, {
      default: L(() => [
        l("div", D3, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", T3, [
            l("dl", I3, [
              e.email ? (t(), n("div", E3, [
                a[0] || (a[0] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Email ", -1)),
                l("dd", null, [
                  l("a", {
                    href: `mailto:${e.email}`,
                    class: "font-medium text-foreground underline-offset-4 hover:underline"
                  }, f(e.email), 9, F3)
                ])
              ])) : b("", !0),
              e.phone ? (t(), n("div", N3, [
                a[1] || (a[1] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Phone ", -1)),
                l("dd", null, [
                  l("a", {
                    href: `tel:${e.phone.replace(/\s+/g, "")}`,
                    class: "font-medium text-foreground underline-offset-4 hover:underline"
                  }, f(e.phone), 9, R3)
                ])
              ])) : b("", !0),
              e.address ? (t(), n("div", H3, [
                a[2] || (a[2] = l("dt", { class: "text-xs font-medium uppercase tracking-wide text-muted-foreground" }, " Address ", -1)),
                l("dd", U3, f(e.address), 1)
              ])) : b("", !0)
            ]),
            e.label ? (t(), n("a", {
              key: 0,
              href: e.href ?? (e.email ? `mailto:${e.email}` : "#"),
              class: "inline-flex h-11 w-fit items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            }, f(e.label), 9, K3)) : b("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), G3 = { class: "flex flex-col items-center gap-5 rounded-xl border bg-card px-6 py-12 text-center" }, W3 = { class: "max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl" }, Z3 = {
  key: 0,
  class: "max-w-xl text-pretty text-muted-foreground"
}, Y3 = ["href"], J3 = /* @__PURE__ */ V({
  __name: "PkCta",
  props: {
    title: {},
    body: {},
    label: {},
    href: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Pe, null, {
      default: L(() => [
        l("div", G3, [
          l("h2", W3, f(e.title), 1),
          e.body ? (t(), n("p", Z3, f(e.body), 1)) : b("", !0),
          e.label ? (t(), n("a", {
            key: 1,
            href: e.href ?? "#",
            class: "inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          }, f(e.label), 9, Y3)) : b("", !0)
        ])
      ]),
      _: 1
    }));
  }
}), Q3 = { class: "flex flex-col gap-8" }, X3 = { class: "divide-y rounded-lg border" }, e5 = { class: "flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent/50" }, t5 = { class: "px-4 pb-4 text-sm text-pretty text-muted-foreground" }, a5 = /* @__PURE__ */ V({
  __name: "PkFaq",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Pe, { narrow: "" }, {
      default: L(() => [
        l("div", Q3, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("div", X3, [
            (t(!0), n(P, null, O(e.items ?? [], (r, s) => (t(), n("details", {
              key: s,
              class: "group"
            }, [
              l("summary", e5, [
                q(f(r.question) + " ", 1),
                a[0] || (a[0] = l("span", {
                  class: "text-muted-foreground transition-transform group-open:rotate-45",
                  "aria-hidden": "true"
                }, " + ", -1))
              ]),
              l("p", t5, f(r.answer), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), n5 = { class: "flex flex-col gap-10" }, l5 = { class: "grid gap-6 md:grid-cols-2 lg:grid-cols-3" }, o5 = { class: "text-sm font-semibold" }, s5 = { class: "text-sm text-pretty text-muted-foreground" }, r5 = /* @__PURE__ */ V({
  __name: "PkFeatureGrid",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Pe, null, {
      default: L(() => [
        l("div", n5, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", l5, [
            (t(!0), n(P, null, O(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-2 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              l("h3", o5, f(r.title), 1),
              l("p", s5, f(r.body), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), i5 = {
  key: 0,
  class: "pk-hero-brand text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
}, d5 = {
  key: 1,
  class: "rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground"
}, u5 = {
  key: 2,
  class: "max-w-2xl text-lg text-pretty text-muted-foreground"
}, c5 = {
  key: 3,
  class: "flex flex-wrap items-center justify-center gap-3"
}, f5 = ["href"], m5 = ["href"], p5 = {
  key: 4,
  class: "text-xs font-normal text-muted-foreground"
}, v5 = /* @__PURE__ */ V({
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
    return (o, a) => (t(), T(Pe, null, {
      default: L(() => [
        l("div", {
          class: z(["flex flex-col items-center gap-6 text-center", e.variant === "bleed" ? "min-h-[70vh] justify-center py-8 sm:py-12" : ""])
        }, [
          e.brand ? (t(), n("p", i5, f(e.brand), 1)) : b("", !0),
          e.eyebrow ? (t(), n("p", d5, f(e.eyebrow), 1)) : b("", !0),
          l("h1", {
            class: z(["max-w-3xl font-semibold tracking-tight text-balance", e.brand ? "text-2xl sm:text-3xl md:text-4xl" : "text-4xl sm:text-5xl"])
          }, f(e.title), 3),
          e.body ? (t(), n("p", u5, f(e.body), 1)) : b("", !0),
          e.primaryLabel || e.secondaryLabel ? (t(), n("div", c5, [
            e.secondaryLabel ? (t(), n("a", {
              key: 0,
              href: e.secondaryHref ?? "#",
              class: "inline-flex h-11 items-center rounded-md border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent"
            }, f(e.secondaryLabel), 9, f5)) : b("", !0),
            e.primaryLabel ? (t(), n("a", {
              key: 1,
              href: e.primaryHref ?? "#",
              class: "inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            }, f(e.primaryLabel), 9, m5)) : b("", !0)
          ])) : b("", !0),
          e.note ? (t(), n("p", p5, f(e.note), 1)) : b("", !0)
        ], 2)
      ]),
      _: 1
    }));
  }
}), g5 = { class: "flex flex-col items-center gap-6" }, h5 = {
  key: 0,
  class: "text-xs font-medium tracking-widest text-muted-foreground uppercase"
}, b5 = { class: "flex flex-wrap items-center justify-center gap-x-10 gap-y-4" }, y5 = /* @__PURE__ */ V({
  __name: "PkLogoCloud",
  props: {
    title: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Pe, { muted: "" }, {
      default: L(() => [
        l("div", g5, [
          e.title ? (t(), n("p", h5, f(e.title), 1)) : b("", !0),
          l("ul", b5, [
            (t(!0), n(P, null, O(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "text-lg font-semibold text-muted-foreground/70"
            }, f(r.name), 1))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), x5 = {
  key: 0,
  class: "mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
}, k5 = {
  class: "pk-marquee-track",
  role: "list"
}, $5 = ["href"], w5 = {
  key: 1,
  role: "listitem",
  class: "pk-marquee-item"
}, C5 = /* @__PURE__ */ V({
  __name: "PkMarquee",
  props: {
    title: { default: "" },
    items: { default: () => [] },
    speed: { default: "normal" },
    reverse: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, a = h(() => [...o.items, ...o.items]);
    return (r, s) => e.items.length ? (t(), T(Pe, {
      key: 0,
      class: "overflow-hidden",
      "aria-label": e.title || "Highlights"
    }, {
      default: L(() => [
        e.title ? (t(), n("p", x5, f(e.title), 1)) : b("", !0),
        l("div", {
          class: z(["pk-marquee", [`pk-marquee-${e.speed}`, e.reverse ? "pk-marquee-reverse" : ""]])
        }, [
          l("div", k5, [
            (t(!0), n(P, null, O(a.value, (i, d) => (t(), n(P, {
              key: `${i.name}-${d}`
            }, [
              i.href ? (t(), n("a", {
                key: 0,
                href: i.href,
                role: "listitem",
                class: "pk-marquee-item"
              }, f(i.name), 9, $5)) : (t(), n("span", w5, f(i.name), 1))
            ], 64))), 128))
          ])
        ], 2)
      ]),
      _: 1
    }, 8, ["aria-label"])) : b("", !0);
  }
}), M5 = { class: "flex flex-col gap-10" }, S5 = {
  key: 0,
  class: "flex items-center justify-center gap-3"
}, B5 = {
  class: "inline-flex rounded-md border bg-background p-1",
  role: "group"
}, A5 = ["aria-pressed"], z5 = ["aria-pressed"], P5 = {
  key: 0,
  class: "text-xs text-muted-foreground font-normal"
}, _5 = { class: "grid gap-4 md:grid-cols-3" }, V5 = { class: "flex flex-col gap-1" }, L5 = { class: "text-sm font-semibold" }, O5 = { class: "flex items-baseline gap-1" }, j5 = { class: "text-3xl font-semibold tracking-tight" }, D5 = {
  key: 0,
  class: "text-sm text-muted-foreground font-normal"
}, T5 = {
  key: 0,
  class: "text-sm text-pretty text-muted-foreground"
}, I5 = { class: "flex flex-col gap-2 text-sm" }, E5 = { class: "text-muted-foreground" }, F5 = ["href"], N5 = /* @__PURE__ */ V({
  __name: "PkPricing",
  props: {
    title: {},
    body: {},
    annualNote: {},
    items: {}
  },
  setup(e) {
    const o = e, a = K(!1), r = h(() => (o.items ?? []).some((i) => !!i.annualPrice));
    function s(i) {
      return a.value && i.annualPrice ? i.annualPrice : i.price;
    }
    return (i, d) => (t(), T(Pe, { muted: "" }, {
      default: L(() => [
        l("div", M5, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          r.value ? (t(), n("div", S5, [
            l("div", B5, [
              l("button", {
                type: "button",
                class: z([
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  a.value ? "text-muted-foreground" : "bg-primary text-primary-foreground"
                ]),
                "aria-pressed": !a.value,
                onClick: d[0] || (d[0] = (u) => a.value = !1)
              }, " Monthly ", 10, A5),
              l("button", {
                type: "button",
                class: z([
                  "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  a.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                ]),
                "aria-pressed": a.value,
                onClick: d[1] || (d[1] = (u) => a.value = !0)
              }, " Annual ", 10, z5)
            ]),
            e.annualNote ? (t(), n("p", P5, f(e.annualNote), 1)) : b("", !0)
          ])) : b("", !0),
          l("ul", _5, [
            (t(!0), n(P, null, O(e.items ?? [], (u, c) => (t(), n("li", {
              key: c,
              class: z(["flex flex-col gap-4 rounded-lg border bg-card p-6", u.featured ? "border-primary shadow-sm" : ""])
            }, [
              l("div", V5, [
                l("h3", L5, f(u.name), 1),
                l("p", O5, [
                  l("span", j5, f(s(u)), 1),
                  u.period ? (t(), n("span", D5, f(u.period), 1)) : b("", !0)
                ]),
                u.body ? (t(), n("p", T5, f(u.body), 1)) : b("", !0)
              ]),
              l("ul", I5, [
                (t(!0), n(P, null, O(u.features ?? [], (v, p) => (t(), n("li", {
                  key: p,
                  class: "flex items-start gap-2"
                }, [
                  d[2] || (d[2] = l("span", {
                    class: "mt-0.5 text-success",
                    "aria-hidden": "true"
                  }, "✓", -1)),
                  l("span", E5, f(v.title), 1)
                ]))), 128))
              ]),
              u.label ? (t(), n("a", {
                key: 0,
                href: u.href ?? "#",
                class: z([
                  "mt-auto inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                  u.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border bg-background hover:bg-accent"
                ])
              }, f(u.label), 11, F5)) : b("", !0)
            ], 2))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
});
function R5() {
  const e = K(null);
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
  return ke(() => {
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
  }), Me(() => {
    a?.disconnect(), window.removeEventListener("scroll", d), window.removeEventListener("resize", d);
  }), { el: e };
}
const H5 = { class: "mx-auto h-[190vh] w-full max-w-6xl" }, U5 = { class: "sticky top-[12vh] flex flex-col items-center gap-8" }, K5 = { class: "flex max-w-2xl flex-col items-center gap-3 text-center" }, q5 = { class: "text-2xl font-semibold tracking-tight text-balance sm:text-3xl" }, G5 = {
  key: 0,
  class: "text-pretty text-muted-foreground"
}, W5 = { class: "pk-showcase-stage w-full [perspective:1400px]" }, Z5 = { class: "pk-showcase-frame overflow-hidden rounded-xl border bg-card shadow-2xl" }, Y5 = { class: "flex items-center gap-2 border-b bg-muted/40 px-4 py-2.5" }, J5 = { class: "ml-3 truncate text-xs text-muted-foreground" }, Q5 = { class: "flex" }, X5 = { class: "hidden w-40 shrink-0 flex-col gap-2 border-r p-4 sm:flex" }, e8 = { class: "min-w-0 flex-1 p-4" }, t8 = { class: "flex flex-col divide-y rounded-md border" }, a8 = /* @__PURE__ */ V({
  __name: "PkShowcase",
  props: {
    title: {},
    body: {},
    rows: { default: 6 },
    caption: {}
  },
  setup(e) {
    const { el: o } = R5();
    return (a, r) => (t(), n("section", {
      ref_key: "el",
      ref: o,
      class: "pk-showcase relative w-full px-4 sm:px-6"
    }, [
      l("div", H5, [
        l("div", U5, [
          l("div", K5, [
            l("h2", q5, f(e.title), 1),
            e.body ? (t(), n("p", G5, f(e.body), 1)) : b("", !0)
          ]),
          l("div", W5, [
            l("div", Z5, [
              l("div", Y5, [
                r[0] || (r[0] = l("span", { class: "size-2.5 rounded-full bg-red-400/70" }, null, -1)),
                r[1] || (r[1] = l("span", { class: "size-2.5 rounded-full bg-amber-400/70" }, null, -1)),
                r[2] || (r[2] = l("span", { class: "size-2.5 rounded-full bg-emerald-400/70" }, null, -1)),
                l("span", J5, f(e.caption ?? "yourpanel.example / records"), 1)
              ]),
              l("div", Q5, [
                l("div", X5, [
                  (t(), n(P, null, O(6, (s) => l("span", {
                    key: s,
                    class: "h-2.5 rounded bg-foreground/10",
                    style: ie({ width: `${55 + s * 13 % 40}%` })
                  }, null, 4)), 64))
                ]),
                l("div", e8, [
                  r[4] || (r[4] = l("div", { class: "mb-3 flex gap-2" }, [
                    l("span", { class: "h-7 w-28 rounded-md bg-foreground/[0.07]" }),
                    l("span", { class: "h-7 w-20 rounded-md bg-foreground/[0.07]" }),
                    l("span", { class: "ml-auto h-7 w-24 rounded-md bg-primary/25" })
                  ], -1)),
                  l("div", t8, [
                    (t(!0), n(P, null, O(e.rows, (s) => (t(), n("div", {
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
}), n8 = /* @__PURE__ */ V({
  __name: "PkCountUp",
  props: {
    to: {},
    prefix: {},
    suffix: {},
    decimals: { default: 0 },
    duration: { default: 1400 }
  },
  setup(e) {
    const o = e, { el: a, shown: r } = vn(), s = K(0);
    return ge(r, (i) => {
      if (!i)
        return;
      if (typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof requestAnimationFrame > "u") {
        s.value = o.to;
        return;
      }
      const u = performance.now(), c = (v) => {
        const p = Math.min((v - u) / o.duration, 1);
        s.value = o.to * (1 - Math.pow(1 - p, 3)), p < 1 ? requestAnimationFrame(c) : s.value = o.to;
      };
      requestAnimationFrame(c);
    }), (i, d) => (t(), n("span", {
      ref_key: "el",
      ref: a
    }, f(e.prefix ?? "") + f(s.value.toFixed(e.decimals)) + f(e.suffix ?? ""), 513));
  }
}), l8 = { class: "flex flex-col gap-10" }, o8 = { class: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4" }, s8 = { class: "order-2 text-sm text-muted-foreground" }, r8 = { class: "order-1 text-3xl font-semibold tracking-tight sm:text-4xl" }, i8 = /* @__PURE__ */ V({
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
    return (a, r) => (t(), T(Pe, { muted: "" }, {
      default: L(() => [
        l("div", l8, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("dl", o8, [
            (t(!0), n(P, null, O(e.items ?? [], (s, i) => (t(), n("div", {
              key: i,
              class: "flex flex-col items-center gap-1 text-center"
            }, [
              l("dt", s8, f(s.label), 1),
              l("dd", r8, [
                o(s.value) ? (t(), T(n8, {
                  key: 0,
                  to: o(s.value).number,
                  prefix: o(s.value).prefix,
                  suffix: o(s.value).suffix,
                  decimals: o(s.value).decimals
                }, null, 8, ["to", "prefix", "suffix", "decimals"])) : (t(), n(P, { key: 1 }, [
                  q(f(s.value), 1)
                ], 64))
              ])
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), d8 = { class: "flex flex-col gap-10" }, u8 = { class: "grid gap-6 md:grid-cols-3" }, c8 = { class: "flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary" }, f8 = { class: "text-sm font-semibold" }, m8 = { class: "text-sm text-pretty text-muted-foreground" }, p8 = /* @__PURE__ */ V({
  __name: "PkSteps",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Pe, null, {
      default: L(() => [
        l("div", d8, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ol", u8, [
            (t(!0), n(P, null, O(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-2"
            }, [
              l("span", c8, f(s + 1), 1),
              l("h3", f8, f(r.title), 1),
              l("p", m8, f(r.body), 1)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), v8 = { class: "flex flex-col gap-10" }, g8 = { class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" }, h8 = ["src"], b8 = {
  key: 1,
  class: "mx-auto flex size-16 items-center justify-center rounded-full bg-muted text-lg font-semibold",
  "aria-hidden": "true"
}, y8 = { class: "min-w-0" }, x8 = { class: "truncate text-sm font-semibold" }, k8 = {
  key: 0,
  class: "truncate text-xs text-muted-foreground"
}, $8 = {
  key: 2,
  class: "text-pretty text-xs text-muted-foreground"
}, w8 = /* @__PURE__ */ V({
  __name: "PkTeam",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Pe, null, {
      default: L(() => [
        l("div", v8, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", g8, [
            (t(!0), n(P, null, O(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-3 rounded-lg border bg-card p-5 text-center transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              r.avatar ? (t(), n("img", {
                key: 0,
                src: r.avatar,
                alt: "",
                class: "mx-auto size-16 rounded-full object-cover"
              }, null, 8, h8)) : (t(), n("span", b8, f((r.name ?? "?").slice(0, 1)), 1)),
              l("div", y8, [
                l("h3", x8, f(r.name), 1),
                r.role ? (t(), n("p", k8, f(r.role), 1)) : b("", !0)
              ]),
              r.bio ? (t(), n("p", $8, f(r.bio), 1)) : b("", !0)
            ]))), 128))
          ])
        ])
      ]),
      _: 1
    }));
  }
}), C8 = { class: "flex flex-col gap-10" }, M8 = { class: "grid gap-4 md:grid-cols-2 lg:grid-cols-3" }, S8 = { class: "flex h-full flex-col gap-4" }, B8 = { class: "text-pretty text-sm leading-relaxed" }, A8 = { class: "mt-auto flex items-center gap-3" }, z8 = ["src"], P8 = {
  key: 1,
  class: "flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium",
  "aria-hidden": "true"
}, _8 = { class: "min-w-0" }, V8 = { class: "block truncate text-sm font-medium" }, L8 = {
  key: 0,
  class: "block truncate text-xs text-muted-foreground"
}, O8 = /* @__PURE__ */ V({
  __name: "PkTestimonials",
  props: {
    title: {},
    body: {},
    items: {}
  },
  setup(e) {
    return (o, a) => (t(), T(Pe, null, {
      default: L(() => [
        l("div", C8, [
          F(Ie, {
            title: e.title,
            body: e.body
          }, null, 8, ["title", "body"]),
          l("ul", M8, [
            (t(!0), n(P, null, O(e.items ?? [], (r, s) => (t(), n("li", {
              key: s,
              class: "flex flex-col gap-4 rounded-lg border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
            }, [
              l("figure", S8, [
                l("blockquote", B8, " “" + f(r.quote) + "” ", 1),
                l("figcaption", A8, [
                  r.avatar ? (t(), n("img", {
                    key: 0,
                    src: r.avatar,
                    alt: "",
                    class: "size-9 shrink-0 rounded-full object-cover"
                  }, null, 8, z8)) : (t(), n("span", P8, f((r.name ?? "?").slice(0, 1)), 1)),
                  l("span", _8, [
                    l("span", V8, f(r.name), 1),
                    r.role ? (t(), n("span", L8, f(r.role), 1)) : b("", !0)
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
}), tS = /* @__PURE__ */ V({
  __name: "PkLandingSections",
  props: {
    sections: {},
    warnOnUnknown: { type: Boolean, default: !1 }
  },
  setup(e, { expose: o }) {
    const a = e, r = {
      hero: v5,
      logos: y5,
      marquee: C5,
      features: r5,
      bento: j3,
      showcase: a8,
      steps: p8,
      stats: i8,
      testimonials: O8,
      team: w8,
      articles: B3,
      contact: q3,
      pricing: N5,
      faq: a5,
      cta: J3
    }, s = h(
      () => (a.sections ?? []).map((i, d) => ({
        key: `${i.type}-${d}`,
        component: r[i.type],
        type: i.type,
        data: i.data ?? {}
      })).filter((i) => (!i.component && a.warnOnUnknown && console.warn(`[alxtexhpanel] Unknown landing section "${i.type}" - skipped.`), !!i.component))
    );
    return o({ known: Object.keys(r) }), (i, d) => (t(!0), n(P, null, O(s.value, (u) => (t(), T(ze(u.component), re({
      key: u.key
    }, { ref_for: !0 }, u.data), null, 16))), 128));
  }
}), j8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, aS = /* @__PURE__ */ V({
  __name: "PkAuroraBackdrop",
  props: {
    intensity: { default: "full" }
  },
  setup(e) {
    return (o, a) => (t(), n("div", j8, [
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
}), D8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, nS = /* @__PURE__ */ V({
  __name: "PkEditorialBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", D8, [...a[0] || (a[0] = [
      vt('<div class="pk-wash absolute inset-0"></div><div class="absolute inset-y-0 left-1/2 hidden w-full max-w-3xl -translate-x-1/2 lg:block"><div class="absolute inset-y-0 left-0 w-px bg-foreground/[0.06]"></div><div class="absolute inset-y-0 right-0 w-px bg-foreground/[0.06]"></div></div><div class="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]" style="background-image:url(&quot;data:image/svg+xml;utf8,&lt;svg xmlns=&#39;http://www.w3.org/2000/svg&#39; width=&#39;160&#39; height=&#39;160&#39;&gt;&lt;filter id=&#39;n&#39;&gt;&lt;feTurbulence type=&#39;fractalNoise&#39; baseFrequency=&#39;0.85&#39; numOctaves=&#39;3&#39;/&gt;&lt;/filter&gt;&lt;rect width=&#39;160&#39; height=&#39;160&#39; filter=&#39;url(%23n)&#39;/&gt;&lt;/svg&gt;&quot;);"></div>', 3)
    ])]));
  }
}), T8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, lS = /* @__PURE__ */ V({
  __name: "PkConsoleBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", T8, [...a[0] || (a[0] = [
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
}), I8 = {
  class: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
  "aria-hidden": "true"
}, oS = /* @__PURE__ */ V({
  __name: "PkStudioBackdrop",
  setup(e) {
    return (o, a) => (t(), n("div", I8, [...a[0] || (a[0] = [
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
g3();
const sS = "0.0.1";
export {
  xa as ACTION_KEY_ICONS,
  Qt as APPEARANCE_STYLE_ID,
  $m as Alert,
  wm as AlertDescription,
  Cm as AlertTitle,
  sM as AppPageFooter,
  $C as AppearanceDrawer,
  $6 as Avatar,
  w6 as AvatarFallback,
  C6 as AvatarImage,
  ma as BADGE_VARIANTS,
  gC as BadgeResolver,
  vM as BarChart,
  M6 as Breadcrumb,
  S6 as BreadcrumbEllipsis,
  B6 as BreadcrumbItem,
  A6 as BreadcrumbLink,
  z6 as BreadcrumbList,
  P6 as BreadcrumbPage,
  _6 as BreadcrumbSeparator,
  Q8 as BulkActions,
  sn as CATALOGUE_CONTAINER,
  zm as CATALOGUE_GRID,
  PC as CATALOGUE_GRID_TIGHT,
  Pm as CATALOGUE_GRID_TILES,
  Y6 as Card,
  J6 as CardAction,
  Q6 as CardContent,
  X6 as CardDescription,
  eM as CardFooter,
  tM as CardHeader,
  aM as CardTitle,
  N2 as CartPanel,
  _M as CatalogBrowser,
  by as CatalogCard,
  pn as CatalogFilterSheet,
  ha as CatalogGrid,
  zM as CatalogInspect,
  Nk as CatalogItemDetail,
  PM as CatalogItemView,
  VM as CatalogRegister,
  AM as CatalogTill,
  a0 as ChartCard,
  wt as ChartTooltip,
  pi as Checkbox,
  uC as CheckboxCell,
  cC as CodeCell,
  Gu as ColourCell,
  xM as ComboChart,
  gi as CreateOptionDialog,
  di as CreateOptionError,
  OM as DASHBOARD_HIDDEN_STORAGE_KEY,
  $$ as DASHBOARD_HIDE_KEY,
  jM as DashboardShortcuts,
  yo as DataTable,
  E6 as Dialog,
  F6 as DialogClose,
  N6 as DialogContent,
  R6 as DialogDescription,
  H6 as DialogFooter,
  U6 as DialogHeader,
  rp as DialogOverlay,
  K6 as DialogScrollContent,
  q6 as DialogTitle,
  G6 as DialogTrigger,
  i6 as DropdownMenu,
  d6 as DropdownMenuCheckboxItem,
  u6 as DropdownMenuContent,
  c6 as DropdownMenuGroup,
  f6 as DropdownMenuItem,
  m6 as DropdownMenuLabel,
  dS as DropdownMenuPortal,
  p6 as DropdownMenuRadioGroup,
  v6 as DropdownMenuRadioItem,
  g6 as DropdownMenuSeparator,
  h6 as DropdownMenuShortcut,
  b6 as DropdownMenuSub,
  y6 as DropdownMenuSubContent,
  x6 as DropdownMenuSubTrigger,
  k6 as DropdownMenuTrigger,
  pC as EditableCell,
  Se as FOCUS_RING,
  X8 as FOCUS_RING_SOFT,
  $a as FOCUS_RING_WITHIN,
  xo as FORM_MEASURE,
  Qe as FormFieldControl,
  kM as HeatmapChart,
  wl as ICON_ALIASES,
  Bt as ICON_PATHS,
  We as INPUT_COPY,
  mi as INPUT_PLACEHOLDER,
  fi as INPUT_TEXT,
  Tu as IconCell,
  Ru as ImageCell,
  ZM as InfoNode,
  hC as InlineRecordActions,
  Lm as JPEG_IMAGE_ERROR,
  fC as KeyValueCell,
  W6 as Label,
  yh as LineChart,
  k2 as LineItems,
  Y8 as MODAL_PANEL,
  J8 as MODAL_PANEL_FORM,
  Pt as MODAL_WIDTH,
  oC as MUTED_COPY,
  St as MUTED_COPY_SNUG,
  sC as MUTED_COPY_XS,
  jt as MiniStatCard,
  V6 as NavigationMenu,
  L6 as NavigationMenuContent,
  O6 as NavigationMenuIndicator,
  j6 as NavigationMenuItem,
  D6 as NavigationMenuLink,
  T6 as NavigationMenuList,
  I6 as NavigationMenuTrigger,
  op as NavigationMenuViewport,
  Vm as OPAQUE_IMAGE_ERROR,
  qa as OVERLAY_FORM_MEASURE,
  dt as PAGE_SHELL,
  W8 as PAGE_SHELL_COMPACT,
  Z8 as PAGE_SHELL_STACK,
  YM as PaymentGatewaySettings,
  B4 as PaymentGateways,
  gM as PieChart,
  AC as PkAlertError,
  B3 as PkArticles,
  aS as PkAuroraBackdrop,
  Ne as PkBadge,
  C1 as PkBarcode,
  j3 as PkBento,
  wC as PkBottomNav,
  nM as PkBoundary,
  uM as PkBuilder,
  ue as PkButton,
  cM as PkCalendar,
  lM as PkCard,
  Rv as PkCheckboxList,
  fn as PkCodeBox,
  Mv as PkCodeInput,
  r1 as PkColourPicker,
  lS as PkConsoleBackdrop,
  q3 as PkContact,
  n8 as PkCountUp,
  J3 as PkCta,
  rM as PkDeviceFrame,
  B1 as PkDiff,
  Vg as PkDocument,
  Ze as PkDropdown,
  nS as PkEditorialBackdrop,
  Wt as PkEmptyState,
  a5 as PkFaq,
  r5 as PkFeatureGrid,
  Oe as PkFieldLabel,
  Wa as PkFileUpload,
  Re as PkHeading,
  v5 as PkHero,
  td as PkKeyValue,
  tS as PkLandingSections,
  y5 as PkLogoCloud,
  d1 as PkMap,
  f1 as PkMapField,
  bv as PkMarkdownInput,
  C5 as PkMarquee,
  bt as PkModal,
  ua as PkMultiSelect,
  SC as PkOtpInput,
  BC as PkPageHeader,
  RM as PkPasskeyRegister,
  zC as PkPasswordInput,
  N5 as PkPricing,
  h1 as PkQrCode,
  u2 as PkQtyStepper,
  Ps as PkQueryBuilder,
  Ev as PkRadioGroup,
  dM as PkRepeater,
  h3 as PkReveal,
  cd as PkRichEditor,
  Pe as PkSection,
  Ie as PkSectionHeading,
  iM as PkSetupWizardCompletion,
  a8 as PkShowcase,
  a$ as PkSignaturePad,
  je as PkSkeleton,
  Tt as PkSlideover,
  F1 as PkSlider,
  MC as PkSpinner,
  i8 as PkStats,
  Be as PkStatusBadge,
  oi as PkStepIndicator,
  p8 as PkSteps,
  oS as PkStudioBackdrop,
  CC as PkSubNav,
  tg as PkSwatchPreview,
  Zv as PkTagsInput,
  w8 as PkTeam,
  O8 as PkTestimonials,
  Ae as PkTextInput,
  P3 as PkTiltCard,
  Za as PkToggleButtons,
  X1 as PkVisualSelect,
  Ky as PlanCard,
  SM as PlanEditor,
  MM as PlanGrid,
  BM as PlanPurchaseCard,
  yM as PolarAreaChart,
  bM as RadarChart,
  dC as RatingCell,
  jc as RecordActions,
  HM as RecordForm,
  iC as RelationCreateDialog,
  tC as RelationPanel,
  ko as SLIDEOVER_BODY,
  $o as SLIDEOVER_WIDTH,
  Z0 as STATUS_TONES,
  NM as SavedViews,
  hM as ScatterChart,
  Ya as SchemaNode,
  wM as SegmentedBar,
  IM as SelectionBar,
  ep as Separator,
  TM as SetupChecklist,
  on as ShadcnInput,
  ca as Sheet,
  jC as SheetClose,
  fa as SheetContent,
  Em as SheetDescription,
  DC as SheetFooter,
  Fm as SheetHeader,
  Nm as SheetTitle,
  TC as SheetTrigger,
  k0 as ShortcutsWidget,
  IC as Sidebar,
  EC as SidebarContent,
  FC as SidebarFooter,
  NC as SidebarGroup,
  RC as SidebarGroupAction,
  HC as SidebarGroupContent,
  UC as SidebarGroupLabel,
  KC as SidebarHeader,
  qC as SidebarInput,
  GC as SidebarInset,
  WC as SidebarMenu,
  ZC as SidebarMenuAction,
  YC as SidebarMenuBadge,
  QC as SidebarMenuButton,
  XC as SidebarMenuItem,
  e6 as SidebarMenuSkeleton,
  t6 as SidebarMenuSub,
  a6 as SidebarMenuSubButton,
  n6 as SidebarMenuSubItem,
  l6 as SidebarProvider,
  o6 as SidebarRail,
  s6 as SidebarSeparator,
  r6 as SidebarTrigger,
  LM as SignatureStudio,
  Et as Sparkline,
  Z6 as Spinner,
  $M as StatCard,
  CM as StatListChart,
  DM as StatStrip,
  tt as Switch,
  rn as TRANSPARENT_IMAGE_HELP,
  EM as TablePagination,
  os as TableShell,
  FM as TableTabs,
  Dr as TableToolbar,
  mC as TagsCell,
  pM as ThemeToggle,
  Jm as Tooltip,
  Qm as TooltipContent,
  JC as TooltipProvider,
  Xm as TooltipTrigger,
  mn as TrendBadge,
  UM as UnsavedBar,
  bc as actionColorTone,
  Mm as alertVariants,
  af as appearancePayload,
  en as appearanceVars,
  Xt as applyAppearance,
  Im as assertTransparentImage,
  yC as bootstrapAppearance,
  at as buttonClasses,
  Dt as catalogFiltersActive,
  oe as cn,
  ci as createOptionActionLabel,
  ui as createOptionTitle,
  yy as cycleLabel,
  He as emptyCatalogFilters,
  Kw as entryView,
  ii as fieldControl,
  rC as fieldErrorsFromPayload,
  U2 as findExactSku,
  xy as formatPerkValue,
  ic as hasBadgeValue,
  GM as hasEntryView,
  aC as hasFieldControl,
  fM as hasOptionPreview,
  me as iconPath,
  Dm as imageHasTransparency,
  tn as initializeAppearance,
  va as isDark,
  ba as matchCatalogItem,
  LC as mergeLayoutItems,
  sp as navigationMenuTriggerStyle,
  N1 as optionPreview,
  _C as packWidgetColumns,
  VC as parseWidgetId,
  ky as perkGranted,
  ga as readAppearance,
  nf as readServerAppearance,
  g3 as registerBuiltInFieldControls,
  qM as registerEntryView,
  Ce as registerFieldControl,
  Ut as registerOptionPreview,
  qw as registeredEntryViews,
  nC as registeredFieldTypes,
  R1 as registeredOptionPreviews,
  bC as resetAppearanceBootstrapForTests,
  WM as resetEntryViews,
  lC as resetFieldControls,
  mM as resetOptionPreviews,
  Fe as resolveActionIcon,
  kC as setAppearancePersister,
  tp as sidebarMenuButtonVariants,
  X0 as statusBadgeVariant,
  Q0 as statusTone,
  xC as syncAppearanceFromInertiaPage,
  OC as toPersistedLayout,
  eC as toUrl,
  ln as useAppearance,
  JM as useColumnVisibility,
  QM as useColumnWidths,
  XM as useLiveUpdates,
  A3 as usePointer,
  vn as useReveal,
  vC as useSchemaColumns,
  R5 as useScrollProgress,
  oM as useShellPageFooter,
  It as useSidebar,
  eS as useTenantTheme,
  KM as useUnsavedChanges,
  sS as version,
  Ba as widgetId
};
//# sourceMappingURL=index.js.map

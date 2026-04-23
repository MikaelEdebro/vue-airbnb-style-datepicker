# vue-airbnb-style-datepicker (Vue 3 fork)

A polished Vue 3 datepicker inspired by Airbnb’s calendar, updated for Vite builds and modern UX. This fork focuses on a clean API, inline layouts, theming, reservations visualization, and quality-of-life improvements.

Key features
- Vue 3 plugin (app.use) and Vite builds (ES/CJS/UMD) with extracted CSS
- Inline or popup modes; exact months-to-show respected in inline mode
- Flexible inline layout: monthWidth and autoFitInline
- Theming: light, dark, auto (auto follows global dark mode)
- Range selection improvements (backwards selection, smooth reselect flow)
- Pluggable selection strategies: single, range, reservation-aware-range
- Reservations with colors, labels, tooltips, and group hover highlight
- Blocked dates (disabled) support
- Unified interaction events: selection-changed, hover-range-changed, blocked-date-clicked
- Keyboard shortcuts help popup (theme-aware), toggleable, localizable
- Per-instance localization for help lines and labels

Screenshots (from the demo)

<img src="https://github.com/SystemicGlitch/vue-airbnb-style-datepicker/blob/master/docs/images/reservations.png" width="1124" alt="Reservations highlighting and tooltips">
<img src="https://github.com/SystemicGlitch/vue-airbnb-style-datepicker/blob/master/docs/images/monthstoshow.png" width="1124" alt="Three months inline layout">

Legacy inspiration -
- Original examples (legacy): https://mikaeledebro.gitbooks.io/vue-airbnb-style-datepicker/examples.html
- Original docs (legacy GitBooks): https://mikaeledebro.gitbooks.io/vue-airbnb-style-datepicker/

<img src="https://raw.githubusercontent.com/MikaelEdebro/vue-airbnb-style-datepicker/master/docs/images/datepicker-tablet.gif" width="1124" alt="Datepicker on tablet">
<img src="https://raw.githubusercontent.com/MikaelEdebro/vue-airbnb-style-datepicker/master/docs/images/datepicker-mobile.gif" width="425" alt="Datepicker on mobile">

Demo / examples
- Local demo (Vue 3) under dev/
- Static copy: docs/examples.html (uses local dist; run a build first)

```bash
# install deps
npm install

# run the demo from dev/
npm run dev

# build library (ES/CJS/UMD) + demo
npm run build

# preview built demo (served from project root)
npm run preview
```

Install (from GitHub)
This repo is consumable directly from Git. A prepare script builds the library on install.

```bash
# default branch
npm install github:SystemicGlitch/vue-airbnb-style-datepicker#master

# or pin a tag/commit
npm install github:SystemicGlitch/vue-airbnb-style-datepicker#v2.8.0
```

Peer deps
- vue 3.x
- date-fns 1.x (this fork keeps v1 helper APIs)

Quick usage

```js
// main.js / main.ts
import { createApp } from 'vue'
import App from './App.vue'

import VueAirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/style.css'

createApp(App).use(VueAirbnbStyleDatepicker).mount('#app')
```

```vue
<template>
  <div class="datepicker-trigger">
    <input id="datepicker-input" :value="formatted" readonly />

    <airbnb-style-datepicker
      :trigger-element-id="'datepicker-input'"
      :mode="'range'"
      :date-one="dateOne"
      :date-two="dateTwo"
      :months-to-show="2"
      :show-action-buttons="true"
      @date-one-selected="v => (dateOne = v)"
      @date-two-selected="v => (dateTwo = v)"
    />
  </div>

  <!-- Programmatic toggle example -->
  <button @click="isOpen = !isOpen">Toggle</button>
  <airbnb-style-datepicker
    :trigger-element-id="'datepicker-toggle'"
    :trigger="isOpen"
    :mode="'single'"
    :date-one="singleDate"
    @opened="isOpen = true"
    @closed="isOpen = false"
  />
  <input id="datepicker-toggle" />
</template>

<script setup>
import { ref, computed } from 'vue'
import format from 'date-fns/format'

const dateOne = ref('')
const dateTwo = ref('')
const singleDate = ref('')
const isOpen = ref(false)
const dateFormat = 'YYYY-MM-DD'
const formatted = computed(() => {
  if (!dateOne.value && !dateTwo.value) return ''
  const p1 = dateOne.value ? format(dateOne.value, dateFormat) : ''
  const p2 = dateTwo.value ? format(dateTwo.value, dateFormat) : ''
  return p2 ? `${p1} - ${p2}` : p1
})
</script>
```

Inline layout and sizing
- monthWidth?: number (default 300)
- autoFitInline?: boolean (default true)
- showOutsideDays?: boolean (default false)

```vue
<!-- 2 months, auto-fit (default) -->
<airbnb-style-datepicker :inline="true" :months-to-show="2" :month-width="300" />

<!-- 3 fixed-width months (wrap if not enough room) -->
<airbnb-style-datepicker :inline="true" :months-to-show="3" :month-width="300" :auto-fit-inline="false" />

<!-- Show previous/next month days (muted) -->
<airbnb-style-datepicker :inline="true" :months-to-show="2" :show-outside-days="true" />
```

Reservations, disabled dates, and tooltips
- reservations: [{ id?, start, end, label?, tooltip?, color? }]
- disabled-dates: string[] of YYYY-MM-DD
- selection-strategy: 'single' | 'range' | 'reservation-aware-range' (optional)
- Reservation behavior: all days strictly inside a reservation are not selectable; the start and end days remain selectable (typical check-in/out UX).
- Visual behavior: reservation color fill is shown on start/end days; disabled interior days keep the normal disabled appearance.
- Emits:
  - reservation-hovered: payload { id, index, start, end }
  - reservation-clicked: payload { id, start, end, label?, color? }

```vue
<airbnb-style-datepicker
  :inline="true"
  :months-to-show="2"
  :selection-strategy="'reservation-aware-range'"
  :reservations="bookings"
  :disabled-dates="blockedDates"
  @reservation-hovered="onReservationHovered"
  @reservation-clicked="onReservationClicked"
/>
```

Selection strategy
- `single`: one date only
- `range`: standard range selection (no reservation-boundary clamp)
- `reservation-aware-range`: range selection constrained by reservation boundaries (default when `mode='range'`)

```vue
<airbnb-style-datepicker
  :mode="'range'"
  :selection-strategy="'reservation-aware-range'"
/>
```

Floating reservation badges (slot)
- By default, a single floating chip is rendered per reservation (centered or start-aligned).
- Customize the badge via the `#reservation-floating` slot. Slot scope exposes `reservation`.
- Placement controls:
  - `reservationBadgePlacement`: 'center' | 'start-inside' | 'start-edge' (default 'center')
  - `reservationBadgeCenterMode`: 'row' | 'full' (default 'row')
  - `reservationBadgeYOffset`: number px (default 7) — push down to avoid overlapping day number
  - `reservationBadgeOffset`: number px (default 6) — small horizontal padding from start edge
  - `reservationBadgeShadow`: CSS filter string for optional soft shadow
  - `reservationBadgeVisible`: boolean | (reservation) => boolean — show/hide badges per item

```vue
<airbnb-style-datepicker
  :inline="true"
  :months-to-show="2"
  :reservations="bookings"
  :reservation-badge-visible="r => !r.noBadge"
  @reservation-clicked="onReservationClicked"
>
  <template #reservation-floating="{ reservation }">
    <span :style="{ background: reservation.color, color: '#fff', padding: '2px 8px', borderRadius: '10px', display: 'inline-flex', gap: '6px', alignItems: 'center' }">
      <template v-if="reservation.avatar !== false">
        <img :src="'https://i.pravatar.cc/20?u=' + (reservation.id || reservation.label)" width="16" height="16" style="border-radius:50%;" />
      </template>
      <span>{{ reservation.label }}</span>
    </span>
  </template>
</airbnb-style-datepicker>
```

Events (full list)
- Preferred (new unified contract):
  - selection-changed:
    - payload: `{ mode, strategy, startDate, endDate, isSelectingStart, hasSelection, hasCompleteRange, source?, action?, clickedDate? }`
  - hover-range-changed:
    - payload: `{ mode, strategy, hoverDate, startDate, endDate, isPreviewingRange, previewStartDate, previewEndDate, source? }`
  - blocked-date-clicked:
    - payload: `{ mode, strategy, date, reason, minDate, endDate }`
    - reason: `not-selectable | before-min | after-end | disabled`
- date-one-selected: string 'YYYY-MM-DD' | ''
- date-two-selected: string 'YYYY-MM-DD' | ''
- previous-month: string[] of first-visible-month dates
- next-month: string[] of first-visible-month dates
- opened / closed / cancelled / apply
- reservation-hovered: { id, index, start, end } | null (on leave)
- reservation-clicked: { id, start, end, label?, color? }

Deprecation guidance
- `date-one-selected` and `date-two-selected` are still emitted for backward compatibility.
- For new integrations, prefer `selection-changed` and `hover-range-changed`.

Migration to unified events

Before (legacy)
```vue
<airbnb-style-datepicker
  :mode="'range'"
  :date-one="dateOne"
  :date-two="dateTwo"
  @date-one-selected="v => (dateOne = v)"
  @date-two-selected="v => (dateTwo = v)"
/>
```

After (preferred)
```vue
<airbnb-style-datepicker
  :mode="'range'"
  :date-one="dateOne"
  :date-two="dateTwo"
  @selection-changed="onSelectionChanged"
  @hover-range-changed="onHoverRangeChanged"
  @blocked-date-clicked="onBlockedDateClicked"
/>
```

```js
function onSelectionChanged(payload) {
  dateOne.value = payload.startDate || ''
  dateTwo.value = payload.endDate || ''
}
```

Localization (help popup & labels)
- keyboardShortcutsOverride: Array<{ symbol, label, symbolDescription }>
- textsOverride: { apply?, cancel?, keyboardShortcuts? }

```vue
<airbnb-style-datepicker
  :inline="true"
  :keyboard-shortcuts-override="shortcuts"
  :texts-override="{ apply: 'Apply', cancel: 'Cancel', keyboardShortcuts: 'Keyboard Shortcuts' }"
/>
```

Theming
- theme: 'light' | 'dark' | 'auto' (auto follows global dark mode).
- Colors are CSS variable-driven; you can override them globally.

Notable UX details
- Inline mode honors :months-to-show exactly (no mobile caps).
- “?” button toggles the help popup. Popup fits content, is scrollable, and theme-aware.
- Day numbers can be positioned: center | top-left | top-right | bottom-left | bottom-right.
- Extra content slot #day-extra lets you render price/badges without replacing the day number.

Changelog (high level)
- Vue 3 compatibility and Vite builds; extracted CSS
- Inline layout controls: monthWidth, autoFitInline; exact months-to-show in inline
- Range selection improvements and better reselect flow
- Reservations rendering: colors, labels, tooltip (from reservation.tooltip)
- Group hover highlight across reservation dates; hover-only emphasis on fill, not borders
- New event: reservation-hovered with booking id/index
- Disabled dates demo; more sample bookings
- showOutsideDays prop (default false) to render adjacent month days (muted)
- Keyboard shortcuts popup improvements: toggle button, content-fit, theme-aware
- Localization: textsOverride and keyboardShortcutsOverride props

License & attribution
- MIT. Based on the original work by Mikael Edebro. This fork modernizes the implementation for Vue 3 and Vite and adds new UX features.

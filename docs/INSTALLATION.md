# Installation

With NPM:

```
npm install vue-airbnb-style-datepicker --save
```

With Yarn:

```
yarn add vue-airbnb-style-datepicker
```

NB: This plugin is dependant on VueJS 2.x and [date-fns](https://date-fns.org/) (for date manipulation). Make sure you have these dependencies installed.

## [Enable plugin in your app](#enable-plugin)

First off, tell Vue to use the plugin in your main.js:

```javascript
import Vue from 'vue'
import App from './App.vue'

// import component and stylesheet
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css'

// see docs for available options
const datepickerOptions = {}

// make sure we can use it in our components
Vue.use(AirbnbStyleDatepicker, datepickerOptions)

new Vue({
  el: '#app',
  render: h => h(App),
})
```

The `options` is optional. It is only needed if you want to overwrite default colors, texts etc. For example if your site uses another language than english. **Note that `days` and `daysShort` always should start with Monday.** So if you want Sunday as the first day in the week, use `sundayFirst: true` (but days and daysShort should still start with Monday)

## [Use plugin](#use-plugin)

Add datepicker in your component like this:

```html
<template>
  <div>
    <div class="datepicker-trigger">
      <input
        type="text"
        id="datepicker-trigger"
        placeholder="Select dates"
        :value="formatDates(dateOne, dateTwo)"
      >

      <AirbnbStyleDatepicker
        :trigger-element-id="'datepicker-trigger'"
        :mode="'range'"
        :fullscreen-mobile="true"
        :date-one="dateOne"
        :date-two="dateTwo"
        @date-one-selected="val => { dateOne = val }"
        @date-two-selected="val => { dateTwo = val }"
      />
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  data() {
    return {
      dateFormat: 'D MMM',
      dateOne: '',
      dateTwo: ''
    }
  },
  methods: {
    formatDates(dateOne, dateTwo) {
      let formattedDates = ''
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat)
      }
      if (dateTwo) {
        formattedDates += ' - ' + format(dateTwo, this.dateFormat)
      }
      return formattedDates
    }
  }
}
</script>
```

NB: Note that you need to wrap the datepicker in a `<div class="datepicker-trigger">`. This is used as the base for the positioning of the datepicker. Also note that the id of element that triggers the datepicker needs to be the same as prop `:trigger-element`. <br><br> This plugin does not dictate how you show the dates. This allows for more flexibility since you can use whatever trigger element you want. The value is being emitted from the component when a date is selected, and handled in the `@date-one-selected` and `@date-two-selected` methods. Then you just assign the value to your data properties. And it is up to you to decide how you want to display the dates.<br> The `formatDates()` methods is just an example of how it can be solved.

## [Options for `Vue.use(AirbnbStyleDatepicker, datepickerOptions)`](#plugin-options)

| Prop name         | Value                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sundayFirst       | Do you want the week to start on sunday.<br>Type: Boolean, Default: false                                                                                                                                                                                                                                                                                                                      |
| days              | Name of days in your language. **Must start with monday**<br>Type: Array<string>                                                                                                                                                                                                                                                                                                               |
| daysShort         | Short name of days in your language (what's shown in the days legend). **Must start with monday**<br>Type: Array<string>                                                                                                                                                                                                                                                                       |
| monthNames        | Names of months in your language.<br>Type: Array<string>                                                                                                                                                                                                                                                                                                                                       |
| dateLabelFormat   | Used to override the formatting string used for rendering aria labels. Defaults to 'dddd, MMMM D, YYYY'. <br>Type: String                                                                                                                                                                                                                                                                      |
| colors            | Override default colors. Use hex values (#efefef)<br>Type: Object                                                                                                                                                                                                                                                                                                                              |
| texts             | Override default texts (currently only "Cancel", "Apply", and "Keyboard shortcuts")<br>Type: Object                                                                                                                                                                                                                                                                                            |
| ariaLabels        | Override default aria-label texts. Current options include chooseDate, chooseStartDate, chooseEndDate, selectedDate, unavailableDate, previousMonth, nextMonth, close, openKeyboardShortcutsMenu, and openKeyboardShortcutsMenu. Labels that end in `Date` are functions which accept a date string for constructing the label text, the rest of the labels are plain strings.<br>Type: Object |
| keyboardShortcuts | Override the text/labels used inside the keyboard shortcuts menu                                                                                                                                                                                                                                                                                                                               | <br> Type: Array<object> |

_Example with all available options_:

```javascript
Vue.use(AirBnbStyleDatepicker, {
  sundayFirst: false,
  dateLabelFormat: 'dddd, MMMM D, YYYY',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  colors: {
    selected: '#00a699',
    inRange: '#66e2da',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#33dacd',
    disabled: '#fff',
    hoveredInRange: '#67f6ee'
  },
  texts: {
    apply: 'Apply',
    cancel: 'Cancel',
    keyboardShortcuts: 'Keyboard Shortcuts',
  },
  ariaLabels: {
    chooseDate: (date) => date,
    chooseStartDate: (date) => `Choose ${date} as your start date.`,
    chooseEndDate: (date) => `Choose ${date} as your end date.`,
    selectedDate: (date) => `Selected. ${date}`,
    unavailableDate: (date) => `Not available. ${date}`,
    previousMonth: 'Move backward to switch to the previous month.',
    nextMonth: 'Move forward to switch to the next month.',
    closeDatepicker: 'Close calendar',
    openKeyboardShortcutsMenu: 'Open keyboard shortcuts menu.',
    closeKeyboardShortcutsMenu: 'Close keyboard shortcuts menu'
  },
  keyboardShortcuts: [
    {symbol: '↵', label: 'Select the date in focus', symbolDescription: 'Enter key'},
    {symbol: '←/→', label: 'Move backward (left) and forward (right) by one day.', symbolDescription: 'Left or right arrow keys'},
    {symbol: '↑/↓', label: 'Move backward (up) and forward (down) by one week.', symbolDescription: 'Up or down arrow keys'},
    {symbol: 'PgUp/PgDn', label: 'Switch months.', symbolDescription: 'PageUp and PageDown keys'},
    {symbol: 'Home/End', label: 'Go to the first or last day of a week.', symbolDescription: 'Home or End keys'},
    {symbol: 'Esc', label: 'Close this panel', symbolDescription: 'Escape key'},
    {symbol: '?', label: 'Open this panel', symbolDescription: 'Question mark'}
  ],
})
```

## [Properties, events & slots for `<AirbnbStyleDatepicker />`](#props-and-events)

| Prop name                | Value                                                                                                                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| triggerElementId         | The id of the element that user clicks on (without #).<br>Type: String, Required                                                                                                                                                 |
| mode                     | If datepicker should select a range or just a single date.<br>Type: String, Required, Values: `'single'` or `'range'`, Default: `'range'`                                                                                        |
| selectionStrategy        | Selection behavior strategy.<br>Values: `'single' | 'range' | 'reservation-aware-range'`.<br>Default: inferred from mode (`'single'` for `mode='single'`, `'reservation-aware-range'` for `mode='range'`) |
| dateOne                  | Model for first date.<br>Type: String, Required                                                                                                                                                                                  |
| dateTwo                  | Model for second date.<br>Type: String, Required if using `mode="range"`                                                                                                                                                         |
| minDate                  | Disable dates before this.<br>Type: String                                                                                                                                                                                       |
| endDate                  | Disable dates after this.<br>Type: String                                                                                                                                                                                        |
| offsetY                  | Offset vertical position of datepicker (in pixels from `triggerElementId` bottom).<br>Type: Number, Default: 0                                                                                                                   |
| offsetX                  | Offset horisontal position of datepicker (in pixels from `triggerElementId` left or right depending on alignment).<br>Type: Number, Default: 0                                                                                   |
| monthsToShow             | How many months to show. For mobile it's always 1.<br>Type: Number, Default: 2                                                                                                                                                   |
| startOpen                | If you want the datepicker start open<br>Type: Boolean, Default: false                                                                                                                                                           |
| fullscreenMobile         | Show fullscreen view on mobile.<br>Type: Boolean, Default: false                                                                                                                                                                 |
| mobileHeader             | Text to show on mobile header<br>Type: String, Default: 'Select dates'                                                                                                                                                           |
| inline                   | Use inline mode (datepicker always showing)<br>Type: Boolean, Default: false                                                                                                                                                     |
| enabledDates             | Disable all dates, except these ones.<br>Type: Array<string>                                                                                                                                                                     |
| disabledDates            | Disable specific dates.<br>Type: Array<string>                                                                                                                                                                                   |
| customizedDates          | Apply custom CSS class to specific dates.<br>Type: Array of Hashmaps<br> Keys: `cssClass` (String), `dates` (Array)<br>Note: Provided CSS class name will be prefixed with `asd__day--`, so for example if the value of `cssClass` is `booked` applied CSS class will be `asd__day--booked`.                                                                                                                                                                                   |
| showActionButtons        | Show/hide action buttons ("Apply", "Cancel")<br>Type: Boolean, Default: false                                                                                                                                                    |
| showShortcutsMenuTrigger | Show/hide the keyboard shortcuts helper menu trigger ("?")<br>Type: Boolean, Default: true                                                                                                                                       |
| showMonthYearSelect      | Show/hide the month/year select dropdowns <br>Type: Boolean, Default: false           |
| yearsForSelect           | Controls the number of years before/after the startingDate to be shown in the month/year select. Will use minDate/maxDate instead if those are available. <br>Type: Number, Default: 10           |
| trigger                  | To programmatically show datepicker. For example if you want to open the datepicker by clicking some other HTML element. You manually need to reset this variable though in the @closed method.<br>Type: Boolean, Default: false |
| closeAfterSelect         | Automatically close datepicker after all dates have been selected.<br>Type: Boolean, Default: false |
| selectable               | Globally enable/disable selecting dates. Useful for read‑only calendars that only visualize reservations/availability.<br>Type: Boolean, Default: true |
| reservations             | Visualize booked ranges. Array of objects: `{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD', id?: any, label?: string, tooltip?: string, color?: '#RRGGBB' }`<br>Type: Array, Default: `[]` |
| reservationBadgePlacement | Placement for the single floating reservation badge: `'center'` (default) or `'start-inside'` or `'start-edge'`.<br>Type: String, Default: `'center'` |
| reservationBadgeCenterMode | How to center when the reservation spans multiple rows: `'row'` (center on the first suitable row segment) or `'full'` (geometric center across all visible cells).<br>Type: String, Default: `'row'` |
| reservationBadgeMinCellsForRowCenter | When `reservationBadgeCenterMode='row'`, prefer a row segment with at least this many visible days.<br>Type: Number, Default: `2` |
| reservationBadgeYOffset   | Push the floating reservation badge down by N pixels so the day number remains visible.<br>Type: Number, Default: `7` |
| reservationBadgeShadow    | CSS filter applied to the floating badge container. Example: `drop-shadow(0 2px 3px rgba(0,0,0,0.18))`.<br>Type: String, Default: `drop-shadow(0 2px 3px rgba(0,0,0,0.18))` |
| @date-one-selected       | Legacy event emitted when first date changes.<br>Kept for backward compatibility                                                                                                                                                 |
| @date-two-selected       | Event emitted when second date is selected.<br>Required if using `mode="range"`                                                                                                                                                  |
| @selection-changed       | Preferred unified selection event. Payload: `{ mode, strategy, startDate, endDate, isSelectingStart, hasSelection, hasCompleteRange, source?, action?, clickedDate? }`                                                       |
| @hover-range-changed     | Preferred unified hover preview event. Payload: `{ mode, strategy, hoverDate, startDate, endDate, isPreviewingRange, previewStartDate, previewEndDate, source? }`                                                            |
| @blocked-date-clicked    | Emitted when a clicked date cannot be selected. Payload: `{ mode, strategy, date, reason, minDate, endDate }`, where reason is `not-selectable | before-min | after-end | disabled`                                        |
| @opened                  | Event emitted when datepicker is opened.                                                                                                                                                                                         |
| @closed                  | Event emitted when datepicker is closed.                                                                                                                                                                                         |
| @cancelled               | Event emitted when user clicks "Cancel".                                                                                                                                                                                         |
| @apply                   | Event emitted when user clicks "Apply"                                                                                                                                                                                           |
| @reservation-hovered     | Event emitted when the user hovers over a day that belongs to a reservation. Payload: `{ id, index, start, end }`                                                                                                                 |
| @previous-month          | Event emitted when user changes to previous month. Returns array with first date in visible months. `['2019-09-01', '2019-10-01']`                                                                                               |
| @next-month              | Event emitted when user changes to next month. Returns array with first date in visible months. `['2019-09-01', '2019-10-01']`                                                                                                   |
| previous-month-icon      | Optional, slot used to override the previous month left arrow icon. Uses default icon if nothing is passed.                                                                                                                      |
| next-month-icon          | Optional, slot used to override the next month right arrow icon. Uses default icon if nothing is passed.                                                                                                                         |
| close-icon               | Optional, slot used to override the mobile close X icon. Uses default icon if nothing is passed.                                                                                                                                 |
| close-shortcuts-icon     | Optional, slot used to override the modal close X icon in the keyboard shortcuts menu. Uses default icon if nothing is passed.                                                                                                   |
| reservation-floating     | Optional, slot rendered once per reservation (not per day). Lets you provide a custom badge component (e.g., Quasar `QBadge` + `QAvatar`). Slot props: `{ reservation }` with fields `{ id, label, color, start, end, variant, isStart, isEnd }`. |

Deprecation guidance:
- `@date-one-selected` and `@date-two-selected` are still emitted for backward compatibility.
- For new integrations, prefer `@selection-changed` and `@hover-range-changed`.

<br><br> _Example with all properties (not recommended, only to show values)_:

```html
<AirbnbStyleDatepicker
  :trigger-element-id="'datepicker-trigger'"
  :mode="'range'"
  :selection-strategy="'reservation-aware-range'"
  :date-one="dateOne"
  :date-two="dateTwo"
  :min-date="'2018-10-12'"
  :end-date="'2021-01-01'"
  :offset-x="10"
  :offset-y="30"
  :months-to-show="2"
  :start-open="true"
  :fullscreen-mobile="true"
  :mobile-header="'Mobile header text'"
  :inline="true"
  :enabled-dates="['2018-12-01', '2018-12-08']"
  :disabled-dates="['2018-10-20', '2018-10-22']"
  :customized-dates="[
    { cssClass: 'booked', dates: ['2019-03-20', '2019-03-21'] },
    { cssClass: 'not-available', dates: ['2019-04-24', '2019-03-25'] }
  ]"
  :show-action-buttons="true"
  :trigger="someBooleanDataProp"
  :close-after-select="true"
  @date-one-selected="val => { dateOne = val }"
  @date-two-selected="val => { dateTwo = val }"
  @selection-changed="onSelectionChanged"
  @hover-range-changed="onHoverRangeChanged"
  @blocked-date-clicked="onBlockedDateClicked"
  @opened="onOpenedMethod"
  @closed="onClosedMethod"
  @cancelled="onCancelMethod"
  @apply="onApplyMethod"
  @previous-month="onChangeMonthMethod"
  @next-month="onChangeMonthMethod"
/>
```

### Reservations visualization (out of the box)

Add an array of reservations to quickly visualize booked ranges. The component handles back‑to‑back ranges (end and start on the same day), draws the correct start/end triangles, disables only interior dates (start/end stay selectable), and keeps those interior disabled dates visually neutral. No app‑specific CSS is required.

```html
<AirbnbStyleDatepicker
  :inline="true"
  :months-to-show="2"
  :selection-strategy="'reservation-aware-range'"
  :reservations="[
    { id: 101, start: '2026-04-02', end: '2026-04-05', label: 'A1' },
    { id: 102, start: '2026-04-05', end: '2026-04-08', label: 'A2' },
  ]"
  :selectable="false"  <!-- optional: make calendar read‑only -->
/>
```

Customize the single reservation badge or render avatars using the `reservation-floating` slot:

```html
<AirbnbStyleDatepicker :reservations="reservations">
  <template #reservation-floating="{ reservation }">
    <!-- Works with any UI lib; example with plain HTML -->
    <span :style="{ background: reservation.color, color: '#fff', padding: '2px 8px', borderRadius: '10px' }">
      {{ reservation.label }}
    </span>
  </template>
</AirbnbStyleDatepicker>
```

Tuning (all optional, sensible defaults):

- `reservationBadgePlacement`: `'center' | 'start-inside' | 'start-edge'`
- `reservationBadgeCenterMode`: `'row' | 'full'`
- `reservationBadgeMinCellsForRowCenter`: prefer wider row segment (default 2)
- `reservationBadgeYOffset`: vertical nudge to keep day number visible (default 8)
- `reservationBadgeShadow`: built‑in soft drop shadow (overridable)

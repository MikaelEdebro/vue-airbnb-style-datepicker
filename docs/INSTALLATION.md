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
    {symbol: '←/→', label: 'Move backward (left) and forward (down) by one day.', symbolDescription: 'Left or right arrow keys'},
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
| showActionButtons        | Show/hide action buttons ("Apply", "Cancel")<br>Type: Boolean, Default: false                                                                                                                                                    |
| showShortcutsMenuTrigger | Show/hide the keyboard shortcuts helper menu trigger ("?")<br>Type: Boolean, Default: true                                                                                                                                       |
| showMonthYearSelect | Show/hide the month/year select dropdowns <br>Type: Boolean, Default: false           |
| yearsForSelect | Controls the number of years before/after the startingDate to be shown in the month/year select. Will use minDate/maxDate instead if those are available. <br>Type: Number, Default: 10           |
| trigger                  | To programmatically show datepicker. For example if you want to open the datepicker by clicking some other HTML element. You manually need to reset this variable though in the @closed method.<br>Type: Boolean, Default: false |
| @date-one-selected       | Event emitted when second date is selected.<br>Required                                                                                                                                                                          |
| @date-two-selected       | Event emitted when second date is selected.<br>Required if using `mode="range"`                                                                                                                                                  |
| @opened                  | Event emitted when datepicker is opened.                                                                                                                                                                                         |
| @closed                  | Event emitted when datepicker is closed.                                                                                                                                                                                         |
| @cancelled               | Event emitted when user clicks "Cancel".                                                                                                                                                                                         |
| @apply                   | Event emitted when user clicks "Apply"                                                                                                                                                                                           |
| @previous-month          | Event emitted when user changes to previous month. Returns array with first date in visible months. `['2019-09-01', '2019-10-01']`                                                                                               |
| @next-month              | Event emitted when user changes to next month. Returns array with first date in visible months. `['2019-09-01', '2019-10-01']`                                                                                                   |
| previous-month-icon      | Optional, slot used to override the previous month left arrow icon. Uses default icon if nothing is passed.                                                                                                                      |
| next-month-icon          | Optional, slot used to override the next month right arrow icon. Uses default icon if nothing is passed.                                                                                                                         |
| close-icon               | Optional, slot used to override the mobile close X icon. Uses default icon if nothing is passed.                                                                                                                                 |
| close-shortcuts-icon     | Optional, slot used to override the modal close X icon in the keyboard shortcuts menu. Uses default icon if nothing is passed.                                                                                                   |

<br><br> _Example with all properties (not recommended, only to show values)_:

```html
<AirbnbStyleDatepicker
  :trigger-element-id="'datepicker-trigger'"
  :mode="'range'"
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
  :show-action-buttons="true"
  :trigger="someBooleanDataProp"
  @date-one-selected="val => { dateOne = val }"
  @date-two-selected="val => { dateTwo = val }"
  @opened="onOpenedMethod"
  @closed="onClosedMethod"
  @cancelled="onCancelMethod"
  @apply="onApplyMethod"
  @previous-month="onChangeMonthMethod"
  @next-month="onChangeMonthMethod"
/>
```

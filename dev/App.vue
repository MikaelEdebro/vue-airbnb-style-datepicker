<template>
  <div class="app" :class="{ 'align-right': alignRight }">
    <h1>Examples</h1>
    <div class="buttons">
      <label style="margin-right:12px;">
        <input type="checkbox" v-model="useDark" /> Dark mode
      </label>
      <label>
        Locale:
        <select v-model="selectedLocale" style="margin-left:8px;">
          <option v-for="loc in locales" :key="loc.id" :value="loc.id">{{ loc.label }}</option>
        </select>
      </label>
    </div>
    <div class="buttons responsive-controls">
      <label>
        Demo container width:
        <input type="range" min="280" max="1000" v-model.number="demoContainerWidth"
          style="margin: 0 8px; vertical-align: middle;" />
        <span>{{ demoContainerWidth }}px</span>
      </label>
    </div>
    <div class="buttons">
      <button @click="toggleDatepickers">Hide datepickers</button>
      <button @click="toggleAlign">Toggle alignment</button>
      <button @click="toggleTrigger">Toggle trigger</button>
    </div>
    <div class="demo-wrap" :style="{ '--demo-max-width': demoContainerWidth + 'px' }">
      <div v-if="showDatepickers">

        <div class="datepicker-container with-input">
          <h3>Range datepicker with input</h3>
          <div class="datepicker-trigger">
            <input type="text" id="datepicker-input-trigger" :value="formatDates(inputDateOne, inputDateTwo)"
              placeholder="Select dates">

            <airbnb-style-datepicker :trigger-element-id="'datepicker-input-trigger'" :mode="'range'"
              :date-one="inputDateOne" :min-date="'2018-08-28'" :months-to-show="2"
              :month-names-override="currentLocale.monthNames" :days-override="currentLocale.days"
              :days-short-override="currentLocale.daysShort" :keyboard-shortcuts-override="demoShortcuts"
              :texts-override="demoTexts" :show-action-buttons="true" :show-month-year-select="true" :theme="demoTheme"
              :key="selectedLocale" @date-one-selected="val => { inputDateOne = val }"
              @date-two-selected="val => { inputDateTwo = val }" />
          </div>
        </div>

        <div class="datepicker-container single-with-input">
          <h3>Single datepicker with input</h3>
          <div class="datepicker-trigger">
            <input type="text" id="datepicker-input-single-trigger" :value="formatDates(inputSingleDateOne)"
              placeholder="Select dates">

            <airbnb-style-datepicker :trigger-element-id="'datepicker-input-single-trigger'" :mode="'single'"
              :date-one="inputSingleDateOne" :date-two="inputSingleDateTwo" :theme="demoTheme" :key="selectedLocale"
              :month-names-override="currentLocale.monthNames" :days-override="currentLocale.days"
              :days-short-override="currentLocale.daysShort" :keyboard-shortcuts-override="demoShortcuts"
              :texts-override="demoTexts" @date-one-selected="val => { inputSingleDateOne = val }" />
          </div>
        </div>

        <div class="datepicker-container with-button">
          <h3>Range datepicker with button</h3>
          <div class="datepicker-trigger">
            <button id="datepicker-button-trigger">{{ formatDates(buttonDateOne, buttonDateTwo) || 'Select dates'
              }}</button>

            <airbnb-style-datepicker :trigger-element-id="'datepicker-button-trigger'" :mode="'range'"
              :date-one="buttonDateOne" :date-two="buttonDateTwo" :min-date="'2018-04-18'" :fullscreen-mobile="false"
              :months-to-show="2" :trigger="trigger" :offset-y="10" :close-after-select="true" :theme="demoTheme"
              :key="selectedLocale" :month-names-override="currentLocale.monthNames" :days-override="currentLocale.days"
              :days-short-override="currentLocale.daysShort" :keyboard-shortcuts-override="demoShortcuts"
              :texts-override="demoTexts" @date-one-selected="val => { buttonDateOne = val }"
              @date-two-selected="val => { buttonDateTwo = val; trigger = false }" />
          </div>
        </div>

        <div class="datepicker-container inline-with-input">
          <h3>Inline datepicker with input</h3>
          <div class="controls"
            style="margin: 8px 0 12px; display:flex; flex-wrap:wrap; gap:10px 16px; align-items:center;">
            <label>
              Months to show:
              <input type="number" v-model.number="inlineMonthsToShow" min="1" max="6"
                style="width:70px; margin-left:6px;" />
            </label>
            <label v-if="!demoAutoFitInline">
              Month width: <input type="range" min="260" max="360" step="2" v-model.number="demoMonthWidth"
                style="vertical-align: middle; margin: 0 8px;" />
              <span>{{ demoMonthWidth }}px</span>
            </label>
            <label>
              <input type="checkbox" v-model="demoAutoFitInline" /> Auto-fit inline (flex months)
            </label>
            <label>
              <input type="checkbox" v-model="showOutsideDaysDemo" /> Show outside days
            </label>
            <label>
              Day number position:
              <select v-model="demoDayPosition" style="margin-left:6px;">
                <option value="center">Center</option>
                <option value="top-left">Top left</option>
                <option value="top-right">Top right</option>
                <option value="bottom-left">Bottom left</option>
                <option value="bottom-right">Bottom right</option>
              </select>
            </label>
            <label>
              Extra content position:
              <select v-model="demoDayExtraPosition" style="margin-left:6px;">
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
          <input id="datepicker-inline-trigger" :value="formatDates(inlineDateOne)" type="text"
            placeholder="Select date">
          <airbnb-style-datepicker :trigger-element-id="'datepicker-inline-trigger'" :mode="'single'" :inline="true"
            :fullscreen-mobile="false" :date-one="inlineDateOne" :months-to-show="inlineMonthsToShow"
            :month-width="demoMonthWidth" :auto-fit-inline="demoAutoFitInline" :show-outside-days="showOutsideDaysDemo"
            :day-number-position="demoDayPosition" :day-extra-position="demoDayExtraPosition"
            :disabled-dates="['2018-04-30', '2018-05-10', '2018-12-14']"
            :customized-dates="[{ dates: ['2019-03-21', '2019-03-22', '2019-03-23', '2019-03-24'], cssClass: 'booked' }, { dates: ['2019-03-21', '2019-03-22', '2019-03-23', '2019-04-24'], cssClass: 'not-available' }]"
            :theme="demoTheme" :month-names-override="currentLocale.monthNames" :days-override="currentLocale.days"
            :days-short-override="currentLocale.daysShort" :keyboard-shortcuts-override="demoShortcuts"
            :texts-override="demoTexts" :key="selectedLocale" @date-one-selected="val => { inlineDateOne = val }">
            <!-- Example of additional day content: demo price -->
            <template #day-extra="{ day, date }">
              <small class="demo-price" :title="`Price for ${date}`">${{ priceFor(day) }}</small>
            </template>
          </airbnb-style-datepicker>
        </div>

        <div class="datepicker-container inline-with-input">
          <h3>Inline datepicker with disabled dates</h3>
          <input id="datepicker-disabled-dates-trigger" :value="formatDates(withDisabledDatesDateOne)" type="text"
            placeholder="Select date">
          <airbnb-style-datepicker :trigger-element-id="'datepicker-disabled-dates-trigger'" :mode="'single'"
            :inline="true" :date-one="withDisabledDatesDateOne" :months-to-show="2" :month-width="demoMonthWidth"
            :auto-fit-inline="demoAutoFitInline" :show-outside-days="showOutsideDaysDemo"
            :day-number-position="demoDayPosition" :day-extra-position="demoDayExtraPosition"
            :disabled-dates="disabledDates" :theme="demoTheme" :month-names-override="currentLocale.monthNames"
            :days-override="currentLocale.days" :days-short-override="currentLocale.daysShort"
            :keyboard-shortcuts-override="demoShortcuts" :texts-override="demoTexts" :key="selectedLocale"
            @date-one-selected="val => { withDisabledDatesDateOne = val }" />
        </div>

        <div class="datepicker-container with-button">
          <h3>Test callback methods</h3>
          <div class="datepicker-trigger">
            <button id="datepicker-callback-trigger">{{ formatDates(callbackDateOne, callbackDateTwo) || 'Select dates'
              }}</button>

            <airbnb-style-datepicker :trigger-element-id="'datepicker-callback-trigger'" :mode="'range'"
              :date-one="callbackDateOne" :date-two="callbackDateTwo" :fullscreen-mobile="false" :months-to-show="2"
              :offset-y="10" :theme="demoTheme" :month-names-override="currentLocale.monthNames"
              :days-override="currentLocale.days" :days-short-override="currentLocale.daysShort"
              :keyboard-shortcuts-override="demoShortcuts" :texts-override="demoTexts" :key="selectedLocale"
              @date-one-selected="onDateOneSelected" @date-two-selected="onDateTwoSelected" @apply="applyMethod"
              @closed="closedMethod" @cancelled="cancelledMethod" @opened="openedMethod"
              @previous-month="changeMonthMethod" @next-month="changeMonthMethod" />
            <div class="event-log" v-if="eventLog.length">
              <h4>Event log</h4>
              <ul>
                <li v-for="(e, i) in eventLog" :key="i">{{ e }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="datepicker-container with-button">
        <h3>Range datepicker ({{ demoThemeLabel }})</h3>
        <div class="datepicker-trigger">
          <button id="datepicker-button-dark-trigger">{{ formatDates(darkDateOne, darkDateTwo) || 'Select dates'
            }}</button>

          <airbnb-style-datepicker :trigger-element-id="'datepicker-button-dark-trigger'" :mode="'range'"
            :date-one="darkDateOne" :date-two="darkDateTwo" :months-to-show="2" :offset-y="10" :theme="demoTheme"
            :close-after-select="true" :month-names-override="currentLocale.monthNames"
            :days-override="currentLocale.days" :days-short-override="currentLocale.daysShort"
            :keyboard-shortcuts-override="demoShortcuts" :texts-override="demoTexts" :key="selectedLocale"
            @date-one-selected="val => { darkDateOne = val }" @date-two-selected="val => { darkDateTwo = val }" />
        </div>
      </div>

      <!-- Unified Reservations demo -->
      <div class="datepicker-container">
        <h3>Reservations demo</h3>
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px; flex-wrap:wrap;">
          <label><input type="checkbox" v-model="showReservationsDemo" /> Show reservations</label>
          <label><input type="checkbox" v-model="reservationsReadOnly" /> Read-only (disable date selection)</label>
          <label><input type="checkbox" v-model="showFancyBadges" /> Fancy badges (avatars)</label>
          <label>
            Selection strategy:
            <select v-model="demoSelectionStrategy" style="margin-left:6px;">
              <option value="reservation-aware-range">reservation-aware-range (default)</option>
              <option value="range">range</option>
              <option value="single">single</option>
            </select>
          </label>
        </div>
        <airbnb-style-datepicker v-bind="demoPickerProps" :months-to-show="2" :date-one="inlineDateOne"
          :selection-strategy="demoSelectionStrategy"
          :selectable="!reservationsReadOnly" :reservation-badge-visible="reservationBadgeVisible" :theme="demoTheme"
          :month-names-override="currentLocale.monthNames" :days-override="currentLocale.days"
          :days-short-override="currentLocale.daysShort" :reservations="showReservationsDemo ? demoReservations : []"
          :disabled-dates="showReservationsDemo ? demoBlockedDates : []"
          @date-one-selected="val => { inlineDateOne = val }" @reservation-hovered="onReservationHovered"
          @reservation-clicked="onReservationClicked" @selection-changed="onSelectionChanged"
          @hover-range-changed="onHoverRangeChanged" @blocked-date-clicked="onBlockedDateClicked">
          <template v-slot:reservation-floating="{ reservation }">
            <span :style="{
              background: reservation.badgeColor || reservation.color,
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px'
            }">
              <template v-if="showFancyBadges && reservation.avatar !== false">
                <img :src="'https://i.pravatar.cc/20?u=' + (reservation.id || reservation.label)" alt="" width="16"
                  height="16" style="border-radius:50%; display:inline-block;" />
              </template>
              <span>{{ reservation.label }}</span>
            </span>
          </template>
          <template #day-extra="{ day, date }">
            <small class="demo-price" :title="`Price for ${date}`">${{ priceFor(day) }}</small>
          </template>
        </airbnb-style-datepicker>
        <div v-if="lastReservationClickedMsg" style="margin-top:8px; color:#333;">
          <strong>Last reservation clicked:</strong> {{ lastReservationClickedMsg }}
        </div>
        <div v-if="lastSelectionChangedMsg" style="margin-top:6px; color:#333;">
          <strong>selection-changed:</strong> {{ lastSelectionChangedMsg }}
        </div>
        <div v-if="lastBlockedDateMsg" style="margin-top:6px; color:#333;">
          <strong>blocked-date-clicked:</strong> {{ lastBlockedDateMsg }}
        </div>
        <div style="margin-top:6px; color:#666; font-size:12px;">
          Preferred events: <code>selection-changed</code> and <code>hover-range-changed</code>. Legacy
          <code>date-one-selected</code>/<code>date-two-selected</code> are still emitted for backwards compatibility.
        </div>
        <div v-if="showReservationsDemo" style="margin-top:12px;">
          <h4>Bookings</h4>
          <ul style="list-style:none; padding:0; margin:6px 0 0;">
            <li v-for="(r, i) in demoReservations" :key="r.id || i"
              :class="['demo-booking-row', { 'demo-hovered': (hoveredBookingId === (r.id || i)) }]"
              style="display:flex; gap:10px; align-items:center; padding:6px 0;">
              <span
                :style="{ width: '18px', height: '12px', background: r.color || '#bbb', display: 'inline-block', borderRadius: '3px', border: '1px solid rgba(0,0,0,0.08)' }"></span>
              <span style="font-size:0.95em; font-weight:600; min-width: 140px;">{{ r.label || 'Guest' }}</span>
              <span style="font-size:0.95em">{{ r.start }} — {{ r.end }} <small style="color:#666;">{{ r.color ? r.color
                :
                  '(auto color)' }}</small></span>
            </li>
          </ul>
        </div>
      </div>
    </div> <!-- .demo-wrap -->
  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  data() {
    return {
      dateFormat: 'YYYY-MM-DD', //'D MMM',
      inputDateOne: '',
      inputDateTwo: '',
      inputSingleDateOne: '',
      inputSingleDateTwo: '',
      buttonDateOne: '',
      buttonDateTwo: '',
      darkDateOne: '',
      darkDateTwo: '',
      inlineDateOne: '',
      withDisabledDatesDateOne: '',
      callbackDateOne: '',
      callbackDateTwo: '',
      sundayFirst: false,
      alignRight: false,
      showDatepickers: true,
      trigger: false,
      eventLog: [],
      useDark: false,
      inlineMonthsToShow: 2,
      // demo-only locales
      selectedLocale: 'en',
      locales: [
        {
          id: 'en',
          label: 'English',
          monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          daysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        },
        {
          id: 'sv',
          label: 'Svenska',
          monthNames: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
          days: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'],
          daysShort: ['Sö', 'Må', 'Ti', 'On', 'To', 'Fr', 'Lö']
        }
      ],
      // demo-only flags
      demoContainerWidth: 600,
      // For the inline demo, initialize controls to match component defaults
      // so the example "Inline datepicker with input" loads correctly out of the box
      demoMonthWidth: null, // not used when auto-fit is on
      demoAutoFitInline: true, // default is true in component
      demoDayPosition: 'top-left', // default is 'top-left' in component
      demoDayExtraPosition: 'bottom', // show a selected default in the UI
      showOutsideDaysDemo: false,
      // reservations demo
      showReservationsDemo: true,
      demoReservations: [
        { id: 101, start: '2026-03-02', end: '2026-03-04', label: 'Alice Nguyen', tooltip: 'Guest: Alice Nguyen', color: '#e67e22' },
        { id: 102, start: '2026-03-06', end: '2026-03-10', label: "Brian O'Connor", tooltip: "Guest: Brian O'Connor", avatar: false },
        { id: 103, start: '2026-03-12', end: '2026-03-17', label: 'Chen Wei', tooltip: 'Guest: Chen Wei', noBadge: true },
        // One-night stay: check-in 20th, check-out 21st -> diagonal start on 20th and diagonal end on 21st
        { id: 104, start: '2026-03-20', end: '2026-03-21', label: 'Day Guest', tooltip: 'Guest: Day Guest', color: '#8e44ad' },
        { id: 105, start: '2026-03-24', end: '2026-03-27', label: 'Evelyn Park', tooltip: 'Guest: Evelyn Park' },
        { id: 106, start: '2026-03-29', end: '2026-04-02', label: 'Felipe García', tooltip: 'Guest: Felipe García', color: '#16a085' },
        { id: 107, start: '2026-04-05', end: '2026-04-08', label: 'Grace Kim', tooltip: 'Guest: Grace Kim' },
        { id: 108, start: '2026-04-10', end: '2026-04-12', label: 'Hiro Tanaka', tooltip: 'Guest: Hiro Tanaka' },
        // Back-to-back chain: next starts the same day previous ends
        { id: 109, start: '2026-04-12', end: '2026-04-15', label: 'Back-to-Back A1', tooltip: 'Adjacent to previous', color: '#d35400' },
        { id: 110, start: '2026-04-15', end: '2026-04-18', label: 'Back-to-Back A2', tooltip: 'Adjacent to previous' },
        { id: 111, start: '2026-04-18', end: '2026-04-20', label: 'Back-to-Back A3', tooltip: 'Adjacent to previous', color: '#2980b9' },
      ],
      // Blocked dates (disabled) example
      demoBlockedDates: [
        '2026-03-11', '2026-03-18', '2026-03-22', '2026-03-31',
        '2026-04-03', '2026-04-09'
      ],
      hoveredBookingId: null,
      lastReservationClickedMsg: '',
      lastSelectionChangedMsg: '',
      lastBlockedDateMsg: '',
      reservationsReadOnly: false,
      showFancyBadges: true,
      demoSelectionStrategy: 'reservation-aware-range',
    }
  },
  computed: {

    currentLocale() {
      return this.locales.find(l => l.id === this.selectedLocale) || this.locales[0]
    },

    demoTheme() {
      return this.useDark ? 'dark' : undefined
    },
    demoThemeLabel() {
      return this.useDark ? 'Dark theme' : 'Light theme'
    },
    // Localized help/labels used by the demo pickers
    demoShortcuts() {
      // Base English
      const en = [
        { symbol: '↵', label: 'Select the date in focus', symbolDescription: 'Enter key' },
        { symbol: '←/→', label: 'Move backward (left) and forward (right) by one day.', symbolDescription: 'Left or right arrow keys' },
        { symbol: '↑/↓', label: 'Move backward (up) and forward (down) by one week.', symbolDescription: 'Up or down arrow keys' },
        { symbol: 'PgUp/PgDn', label: 'Switch months.', symbolDescription: 'PageUp and PageDown keys' },
        { symbol: 'Home/End', label: 'Go to the first or last day of a week.', symbolDescription: 'Home or End keys' },
        { symbol: 'Esc', label: 'Close this panel', symbolDescription: 'Escape key' },
        { symbol: '?', label: 'Open this panel', symbolDescription: 'Question mark' },
      ]
      if (this.selectedLocale === 'sv') {
        return [
          { symbol: '↵', label: 'Välj markerat datum', symbolDescription: 'Returtangent' },
          { symbol: '←/→', label: 'Flytta bakåt/framåt en dag.', symbolDescription: 'Vänster- eller högerpil' },
          { symbol: '↑/↓', label: 'Flytta uppåt/nedåt en vecka.', symbolDescription: 'Upp- eller nedpil' },
          { symbol: 'PgUp/PgDn', label: 'Byt månad.', symbolDescription: 'Page Up/Down' },
          { symbol: 'Home/End', label: 'Gå till veckans första/sista dag.', symbolDescription: 'Home/End' },
          { symbol: 'Esc', label: 'Stäng panelen', symbolDescription: 'Escape' },
          { symbol: '?', label: 'Öppna panelen', symbolDescription: 'Frågetecken' },
        ]
      }
      return en
    },
    demoTexts() {
      if (this.selectedLocale === 'sv') {
        return { apply: 'Använd', cancel: 'Avbryt', keyboardShortcuts: 'Tangentbordsgenvägar' }
      }
      return { apply: 'Apply', cancel: 'Cancel', keyboardShortcuts: 'Keyboard Shortcuts' }
    },
    // Only pass props to the picker when the demo controls are set
    demoPickerProps() {
      const p = {}
      if (this.demoMonthWidth !== null) p.monthWidth = this.demoMonthWidth
      if (this.demoAutoFitInline !== null) p.autoFitInline = this.demoAutoFitInline
      if (this.demoDayPosition) p.dayNumberPosition = this.demoDayPosition
      if (this.demoDayExtraPosition) p.dayExtraPosition = this.demoDayExtraPosition
      p.showOutsideDays = this.showOutsideDaysDemo
      p.textsOverride = this.demoTexts
      p.keyboardShortcutsOverride = this.demoShortcuts
      // always include inline mode for the reservations demo when used
      p.inline = true
      return p
    },
    disabledDates() {
      // Disable a few dates within the two months currently shown (current & next month)
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth()
      const fmt = d => format(d, 'YYYY-MM-DD')

      const month1Days = [5, 12, 20]
      const month2Days = [3, 15, 27]

      const inMonth = (year, month, days) =>
        days
          .map(day => new Date(year, month, day))
          .filter(d => d.getMonth() === month) // guard invalid dates
          .map(fmt)

      const month1 = inMonth(y, m, month1Days)
      const month2 = inMonth(y, (m + 1) % 12, month2Days.map(d => d))

      // If next month wrapped year, adjust year
      if (m === 11) {
        // December -> January
        const nextYear = y + 1
        const jan = month2Days
          .map(day => new Date(nextYear, 0, day))
          .filter(d => d.getMonth() === 0)
          .map(fmt)
        return [...month1, ...jan]
      }

      return [...month1, ...month2]
    },
  },
  methods: {
    reservationBadgeVisible(reservation) {
      // Demo rule: hide badge when the reservation has noBadge: true
      return !(reservation && reservation.noBadge)
    },
    onReservationHovered(payload) {
      this.hoveredBookingId = payload && (payload.id != null ? payload.id : payload.index)
    },
    onReservationClicked(reservation) {
      try {
        const id = reservation && (reservation.id != null ? reservation.id : reservation.idx)
        const label = reservation && reservation.label ? reservation.label : `Reservation ${id}`
        const start = reservation && reservation.start ? reservation.start : '?'
        const end = reservation && reservation.end ? reservation.end : '?'
        const msg = `reservation-clicked: ${label} (${start} — ${end})`
        console.log(msg)
        this.eventLog.unshift(msg)
        this.lastReservationClickedMsg = `${label} (${start} — ${end})`
      } catch (e) {
        console.log('reservation-clicked')
        this.eventLog.unshift('reservation-clicked')
        this.lastReservationClickedMsg = 'Clicked'
      }
    },
    onSelectionChanged(payload) {
      try {
        const start = payload && payload.startDate ? payload.startDate : '-'
        const end = payload && payload.endDate ? payload.endDate : '-'
        const strategy = payload && payload.strategy ? payload.strategy : this.demoSelectionStrategy
        const source = payload && payload.source ? payload.source : 'unknown'
        const msg = `${start} -> ${end} (${strategy}, ${source})`
        this.lastSelectionChangedMsg = msg
        this.eventLog.unshift(`selection-changed: ${msg}`)
      } catch (e) {
        this.lastSelectionChangedMsg = 'selection changed'
      }
    },
    onHoverRangeChanged(payload) {
      try {
        const hover = payload && payload.hoverDate ? payload.hoverDate : '-'
        const preview = payload && payload.isPreviewingRange ? `${payload.previewStartDate} -> ${payload.previewEndDate}` : 'none'
        this.eventLog.unshift(`hover-range-changed: hover=${hover}, preview=${preview}`)
      } catch (e) {
        this.eventLog.unshift('hover-range-changed')
      }
    },
    onBlockedDateClicked(payload) {
      try {
        const date = payload && payload.date ? payload.date : '?'
        const reason = payload && payload.reason ? payload.reason : 'blocked'
        const msg = `${date} (${reason})`
        this.lastBlockedDateMsg = msg
        this.eventLog.unshift(`blocked-date-clicked: ${msg}`)
      } catch (e) {
        this.lastBlockedDateMsg = 'blocked date'
      }
    },
    priceFor(day) {
      const n = Number(day)
      if (!n || isNaN(n)) return '—'
      return (n * 5).toFixed(0)
    },
    formatDates(dateOne, dateTwo) {
      let formattedDates = ''
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat)
      }
      if (dateTwo) {
        formattedDates += ' - ' + format(dateTwo, this.dateFormat)
      }
      return formattedDates
    },
    toggleAlign() {
      this.alignRight = !this.alignRight
    },
    toggleDatepickers() {
      this.showDatepickers = !this.showDatepickers
    },
    toggleTrigger() {
      this.trigger = !this.trigger
    },
    applyMethod() {
      const msg = `apply: ${this.formatDates(this.callbackDateOne, this.callbackDateTwo)}`
      console.log(msg)
      this.eventLog.unshift(msg)
    },
    openedMethod() {
      const msg = 'opened'
      console.log(msg)
      this.eventLog.unshift(msg)
    },
    closedMethod() {
      const msg = 'closed'
      console.log(msg)
      this.eventLog.unshift(msg)
      this.trigger = false
    },
    cancelledMethod() {
      const msg = 'cancelled'
      console.log(msg)
      this.eventLog.unshift(msg)
    },
    changeMonthMethod(visibleMonths) {
      const msg = `change months: ${visibleMonths.join(' , ')}`
      console.log(msg)
      this.eventLog.unshift(msg)
    },

    onDateOneSelected(val) {
      this.callbackDateOne = val
      const msg = `date-one-selected: ${val || 'cleared'}`
      this.eventLog.unshift(msg)
    },
    onDateTwoSelected(val) {
      this.callbackDateTwo = val
      const msg = `date-two-selected: ${val || 'cleared'}`
      this.eventLog.unshift(msg)
    },
  },
}
</script>

<style lang="scss">
html,
body {
  min-height: 200vh;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
    Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 18px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  padding: 10px;
}

.app {
  &.align-right {
    text-align: right;
  }
}

h1 {
  font-size: 1.8em;
  line-height: 1.5em;
  text-align: center;
}

.datepicker-container {
  padding: 0 30px 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.01);
  max-width: 600px;
  margin: 0 auto 30px;
  border-radius: 12px;
}

#datepicker-button-trigger {
  background: #008489;
  border: 1px solid #008489;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  min-width: 200px;
}

input {
  padding: 6px 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.with-input {
  .datepicker-trigger {
    //padding-right: 40px;
  }
}

.with-button {
  .datepicker-trigger {
    //padding-left: 10px;
  }
}

// .inline-with-input {
//   width: 600px;
//   input {
//     width: 100%;
//   }
// }
.buttons {
  max-width: 800px;
  margin: 0 auto 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px 16px;
  flex-wrap: wrap;

  >* {
    margin: 0 !important;
  }
}

.demo-wrap {
  /* used to pass a CSS var for container max width */
}

.datepicker-container {
  padding: 0 20px 16px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.01);
  max-width: min(100%, var(--demo-max-width, 600px));
  width: 100%;
  /* Ensure the center column (demo block) doesn't get too narrow on larger screens */
  min-width: 520px;
  margin: 0 auto 20px;
  border-radius: 12px;
}

/* Make inputs and controls friendlier on small screens */
@media (max-width: 640px) {
  body {
    padding: 10px 8px;
  }

  .datepicker-container {
    padding: 0 12px 12px;
    min-width: 0;
    /* allow full fluid behavior on small screens */
  }

  .buttons {
    gap: 8px 10px;
  }

  .buttons select,
  .buttons input[type='checkbox'] {
    transform: scale(1.0);
  }

  #datepicker-button-trigger,
  #datepicker-button-dark-trigger {
    width: 100%;
    min-width: 0;
  }

  .with-input input[type='text'] {
    width: 100%;
    box-sizing: border-box;
  }
}

/* Make the datepicker header's center area a bit wider in the demo so month names don't crowd */
@media (min-width: 768px) {
  .asd__datepicker-header {
    padding: 0 96px;
    /* default was 72px in component; give more room between nav buttons */
  }
}

/* Small decoration for custom day slot in the demo */
.demo-day-slot {
  position: relative;
  display: inline-block;
  /* size to content so parent flex alignment is visible */
  width: auto;
  height: auto;
  padding: 0;
  box-sizing: border-box;
  text-align: inherit;
}

.demo-day-slot .demo-star {
  color: #f39c12;
  font-size: 0.72em;
  line-height: 1;
  position: absolute;
  top: 6px;
  right: 6px;
}

.demo-price {
  color: inherit;
  font-weight: 600;
  font-size: 0.95em;
  display: block;
}

/* Highlight a booking row when its reservation is hovered in the calendar */
.demo-booking-row.demo-hovered {
  background: rgba(0, 166, 153, 0.09);
  border-radius: 6px;
}
</style>

<template>
  <transition name="asd__fade">
    <div :id="wrapperId" ref="wrapper" class="asd__wrapper" v-show="showDatepicker" :data-theme="dataTheme"
      :class="wrapperClasses" :style="showFullscreen ? undefined : wrapperStyles" v-click-outside="handleClickOutside"
      @pointerdown="handlePointerDown">
      <div class="asd__mobile-header asd__mobile-only" v-if="showFullscreen">
        <button type="button" class="asd__mobile-close" @click="closeDatepicker"
          :aria-label="ariaLabels.closeDatepicker">
          <slot v-if="$slots['close-icon']" name="close-icon"></slot>
          <div v-else class="asd__mobile-close-icon" aria-hidden="true">X</div>
        </button>
        <h3>{{ mobileHeader || mobileHeaderFallback }}</h3>
      </div>
      <div class="asd__datepicker-header">
        <div class="asd__change-month-button asd__change-month-button--previous">
          <button @click="previousMonth" type="button" :aria-label="ariaLabels.previousMonth">
            <slot v-if="$slots['previous-month-icon']" name="previous-month-icon"></slot>
            <svg v-else viewBox="0 0 1000 1000">
              <path
                d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z">
              </path>
            </svg>
          </button>
        </div>
        <div class="asd__change-month-button asd__change-month-button--next">
          <button @click="nextMonth" type="button" :aria-label="ariaLabels.nextMonth">
            <slot v-if="$slots['next-month-icon']" name="next-month-icon"></slot>
            <svg v-else viewBox="0 0 1000 1000">
              <path
                d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z">
              </path>
            </svg>
          </button>
        </div>

        <!-- Day-name legends are rendered per-month below the month name to ensure correct alignment in all modes -->
      </div>

      <div class="asd__inner-wrapper" :style="innerStyles">
        <transition-group
          name="asd__list-complete"
          tag="div"
          class="asd__months-wrapper"
          @transitionstart="onMonthsTransitionStart"
          @transitionend="onMonthsTransitionEnd"
        >
          <div v-for="(month, monthIndex) in months" :key="month.firstDateOfMonth" class="asd__month"
            :class="{ 'asd__month--hidden': monthIndex === 0 || monthIndex > showMonths }" :style="monthWidthStyles">
            <div class="asd__month-name">
              <template v-if="showMonthYearSelect">
                <select v-model="month.monthName" class="asd__month-year-select"
                  :tabindex="monthIndex === 0 || monthIndex > showMonths ? -1 : 0"
                  @change="updateMonth(monthIndex, month.year, $event)" v-resize-select>
                  <option v-for="(monthName, idx) in monthNames" :value="monthName"
                    :disabled="isMonthDisabled(month.year, idx)" :key="`month-${monthIndex}-${monthName}`">{{ monthName
                    }}</option>
                </select>

                <span aria-hidden="true">&nbsp;</span>

                <select class="asd__month-year-select asd__year-select"
                  :tabindex="monthIndex === 0 || monthIndex > showMonths ? -1 : 0" v-model="month.year"
                  @change="updateYear(monthIndex, month.monthNumber - 1, $event)">
                  <option v-if="years.indexOf(month.year) === -1" :value="month.year"
                    :key="`month-${monthIndex}-${year}`" :disabled="true">{{ month.year }}</option>
                  <option v-for="year in years" :value="year" :key="`month-${monthIndex}-${year}`">{{ year }}</option>
                </select>
              </template>

              <span v-else>{{ month.monthName }} {{ month.year }}</span>
            </div>

            <table class="asd__month-table" role="presentation">
              <!-- Day-name legend immediately above the grid (visible for both popup and inline) -->
              <thead>
                <tr>
                  <th colspan="7" style="padding:6px 0 0; background:transparent; border:none;">
                    <div class="asd__days-legend asd__days-legend--inline"
                      style="display:flex; justify-content:space-between;">
                      <div class="asd__day-title" v-for="(day, index) in daysShort" :key="index"
                        style="flex:1; text-align:center">
                        {{ day }}</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="asd__week" v-for="(week, index) in month.weeks" :key="index">
                  <td class="asd__day" v-for="({ fullDate, dayNumber, outside }, index) in week"
                    :key="index + '_' + dayNumber" :data-date="fullDate" :ref="`date-${fullDate}`"
                    :tabindex="isDateVisible(fullDate) && isSameDate(focusedDate, fullDate) ? 0 : -1"
                    :aria-label="isDateVisible(fullDate) ? getAriaLabelForDate(fullDate) : false"
                    :title="reservationFor(fullDate) ? (reservationFor(fullDate).tooltip || reservationFor(fullDate).label) : null"
                    :class="[{
                      'asd__day--enabled': dayNumber !== 0,
                      'asd__day--empty': dayNumber === 0,
                      'asd__day--disabled': isDisabled(fullDate),
                      'asd__day--has-reservation': !!reservationFor(fullDate),
                      'asd__day--read-only': !selectable,
                      'asd__day--outside': !!outside && dayNumber !== 0,
                      'asd__day--selected': fullDate && (selectedDate1 === fullDate || selectedDate2 === fullDate),
                      'asd__day--in-range': isInRange(fullDate),
                      'asd__day--today': fullDate && isToday(fullDate),
                      'asd__day--hovered': isHoveredInRange(fullDate),
                      'asd__selected-date-one': fullDate && fullDate === selectedDate1,
                      'asd__selected-date-two': fullDate && fullDate === selectedDate2,
                    }, customizedDateClass(fullDate)]" :style="getDayStyles(fullDate)"
                    @mouseover="() => { setHoverDate(fullDate) }" @mouseleave="() => { setHoverDate('') }">
                    <!-- Reservation/blocked overlay (behind the content)
                         Support multiple overlays on the same day (e.g., back-to-back end/start) -->
                    <template v-if="dayNumber">
                      <template v-for="(resv, ri) in reservationOverlaysFor(fullDate)"
                        :key="(resv.id != null ? resv.id : resv.idx) + '-' + resv.variant + '-' + ri">
                        <div class="asd__reservation" :class="[
                          'asd__reservation--' + resv.variant,
                          {
                            'asd__reservation--hover': hoveredReservationIdx !== null,
                            'asd__reservation--hover-match': hoveredReservationIdx !== null && resv.idx === hoveredReservationIdx
                          }
                        ]" :data-resv="resv.idx" :title="resv.label || undefined"
                          :style="{ '--resv-color': resv.color }" />
                      </template>
                    </template>
                    <!-- Optional reservation badge content (e.g., QBadge) provided by parent via slot -->
                    <!-- Per-day reservation badge slot (legacy); prefer single floating slot 'reservation-floating' -->
                    <div v-if="false && dayNumber && reservationFor(fullDate) && $slots['reservation-badge']"
                      class="asd__reservation-badge">
                      <slot name="reservation-badge" :reservation="reservationFor(fullDate)" :date="fullDate"></slot>
                    </div>
                    <button class="asd__day-button" :class="dayNumberPositionClass" type="button" v-if="dayNumber"
                      tabindex="-1" :date="fullDate" :disabled="isDisabled(fullDate)"
                      @click="() => { selectDate(fullDate) }">
                      <slot name="day" :date="fullDate" :day="dayNumber">
                        {{ dayNumber }}
                      </slot>
                      <!-- Optional additional day content (e.g., price, badge) -->
                      <div class="asd__day-extra" :class="dayExtraPositionClass">
                        <slot name="day-extra" :date="fullDate" :day="dayNumber"></slot>
                      </div>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition-group>
        <!-- Single overlay layer for once-per-reservation badges (not clipped by table cells) -->
        <div class="asd__reservation-layer" :class="{ 'asd__reservation-layer--transitioning': isMonthTransitioning }"
          aria-hidden="true">
          <div v-for="pos in reservationBadgePositions"
            :key="'rb-' + (pos.reservation.id != null ? pos.reservation.id : pos.reservationIdx)"
            :class="['asd__reservation-floating', pos.anchorClass]"
            :style="{ left: pos.x + 'px', top: pos.y + 'px', filter: reservationBadgeShadow || undefined }"
            v-show="_isBadgeVisible(pos.reservation)" @click="onReservationBadgeClick(pos.reservation)">
            <slot name="reservation-floating" :reservation="pos.reservation">
              <!-- default presentation if no slot provided -->
              <span class="asd__reservation-chip" :style="{ background: pos.reservation.badgeColor || pos.reservation.color }">{{
                pos.reservation.label
                }}</span>
            </slot>
          </div>
        </div>
        <div v-if="showShortcutsMenuTrigger"
          :class="{ 'asd__keyboard-shortcuts-menu': true, 'asd__keyboard-shortcuts-show': showKeyboardShortcutsMenu }"
          :style="keyboardShortcutsMenuStyles">
          <div class="asd__keyboard-shortcuts-title">{{ texts.keyboardShortcuts }}</div>
          <button class="asd__keyboard-shortcuts-close" ref="keyboard-shortcus-menu-close" tabindex="0"
            @click="closeKeyboardShortcutsMenu" :aria-label="ariaLabels.closeKeyboardShortcutsMenu">
            <slot v-if="$slots['close-shortcuts-icon']" name="close-shortcuts-icon"></slot>
            <div v-else class="asd__mobile-close-icon" aria-hidden="true">X</div>
          </button>
          <ul class="asd__keyboard-shortcuts-list">
            <li v-for="(shortcut, i) in keyboardShortcuts" :key="i">
              <span class="asd__keyboard-shortcuts-symbol" :aria-label="shortcut.symbolDescription">{{ shortcut.symbol
                }}</span>
              {{ shortcut.label }}
            </li>
          </ul>
        </div>
      </div>
      <div class="asd__action-buttons" v-if="mode !== 'single' && showActionButtons">
        <button @click="closeDatepickerCancel" type="button">{{ texts.cancel }}</button>
        <button ref="apply-button" @click="apply" :style="{ color: colors.selected }" type="button">{{ texts.apply
          }}</button>
      </div>
      <div v-if="showShortcutsMenuTrigger" class="asd__keyboard-shortcuts-trigger-wrapper">
        <button class="asd__keyboard-shortcuts-trigger"
          :aria-label="showKeyboardShortcutsMenu ? ariaLabels.closeKeyboardShortcutsMenu : ariaLabels.openKeyboardShortcutsMenu"
          tabindex="0" @click="toggleKeyboardShortcutsMenu">
          <span>?</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import format from 'date-fns/format'
import subMonths from 'date-fns/sub_months'
import addMonths from 'date-fns/add_months'
import lastDayOfMonth from 'date-fns/last_day_of_month'
import getMonth from 'date-fns/get_month'
import setMonth from 'date-fns/set_month'
import getYear from 'date-fns/get_year'
import setYear from 'date-fns/set_year'
import isSameMonth from 'date-fns/is_same_month'
import isSameDay from 'date-fns/is_same_day'
import addDays from 'date-fns/add_days'
import subDays from 'date-fns/sub_days'
import addWeeks from 'date-fns/add_weeks'
import subWeeks from 'date-fns/sub_weeks'
import startOfMonth from 'date-fns/start_of_month'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
import isValid from 'date-fns/is_valid'
import { debounce, copyObject, findAncestor, randomString } from './../helpers'
import ResizeSelect from '../directives/ResizeSelect'
import {
  hexToRgb,
  rgbToHex,
  luminance,
  adjustForContrast,
  lightenColor,
  hashColorFromKey,
} from './logic/colorUtils'
import {
  isReservationInteriorDate as isReservationInteriorDateUtil,
  getNearestReservationBoundary as getNearestReservationBoundaryUtil,
  buildReservationDateInfo,
  reservationForDate,
  reservationsForDate,
  isDateDisabledByReservationInterior,
} from './logic/reservationUtils'
import {
  constrainRangeEndDate as constrainRangeEndDateUtil,
  isInRange as isInRangeUtil,
  isHoveredInRange as isHoveredInRangeUtil,
} from './logic/selectionUtils'
import { computeBadgeAnchor } from './logic/badgeLayout'
import { buildMonth, buildWeeks } from './logic/calendarModel'
import {
  SELECTION_STRATEGIES,
  normalizeSelectionStrategy,
  resolveClickTransitionByStrategy,
  resolveHoverDateByStrategy,
} from './logic/selectionStrategies'

export default {
  name: 'AirbnbStyleDatepicker',
  // Declare all emitted events (Vue 3 best practice)
  emits: [
    'date-one-selected',
    'date-two-selected',
    'previous-month',
    'next-month',
    'opened',
    'closed',
    'cancelled',
    'apply',
    // New: emitted when hovering a reservation date; payload is { id, index, start, end } or null on leave
    'reservation-hovered',
    // Emitted when clicking a floating reservation badge
    'reservation-clicked',
    // New unified event contract
    'selection-changed',
    'hover-range-changed',
    'blocked-date-clicked',
  ],
  directives: {
    // Local click-outside directive (Vue 3): listens on pointerdown and ignores
    // clicks that land inside the element or inside the configured trigger
    clickOutside: {
      beforeMount(el, binding) {
        const handler = event => {
          try {
            // composedPath covers shadow DOM; fallback to event.target checks
            const path = event.composedPath ? event.composedPath() : (event.path || [])
            if (path && path.indexOf(el) > -1) return

            const vm = binding.instance
            const trigger = vm && vm.triggerElement
            if (trigger && (event.target === trigger || trigger.contains(event.target))) return

            if (typeof binding.value === 'function') binding.value(event)
            else if (binding.value && typeof binding.value.handler === 'function') binding.value.handler(event)
          } catch (e) {
            // ignore
          }
        }
        el.__asdClickOutsideHandler__ = handler
        document.addEventListener('pointerdown', handler)
      },
      unmounted(el) {
        try {
          document.removeEventListener('pointerdown', el.__asdClickOutsideHandler__)
        } catch (e) { }
        try { delete el.__asdClickOutsideHandler__ } catch (e) { }
      },
    },
    resizeSelect: ResizeSelect,
  },
  props: {
    triggerElementId: { type: String },
    dateOne: { type: [String, Date] },
    dateTwo: { type: [String, Date] },
    minDate: { type: [String, Date] },
    endDate: { type: [String, Date] },
    mode: { type: String, default: 'range' },
    // Selection behavior strategy:
    // - 'single'
    // - 'range'
    // - 'reservation-aware-range' (default for range mode)
    selectionStrategy: {
      type: String,
      default: undefined,
      validator: v => [undefined, ...SELECTION_STRATEGIES].includes(v),
    },
    offsetY: { type: Number, default: 0 },
    offsetX: { type: Number, default: 0 },
    monthsToShow: { type: Number, default: 2 },
    startOpen: { type: Boolean },
    fullscreenMobile: { type: Boolean },
    inline: { type: Boolean },
    mobileHeader: { type: String },
    disabledDates: { type: Array, default: () => [] },
    enabledDates: { type: Array, default: () => [] },
    customizedDates: { type: Array, default: () => [] },
    showActionButtons: { type: Boolean, default: true },
    showShortcutsMenuTrigger: { type: Boolean, default: true },
    showMonthYearSelect: { type: Boolean, default: false },
    yearsForSelect: { type: Number, default: 10 },
    // Disable all date selection entirely (read-only calendar)
    selectable: { type: Boolean, default: true },
    // Show days from previous/next month inside the grid (faded)
    showOutsideDays: { type: Boolean, default: false },
    // When inline, allow months to flex to fill available space before wrapping
    // If false, each month keeps a fixed width and never stretches
    autoFitInline: { type: Boolean, default: true },
    // Optional: base width per month (px). If omitted, defaults to 300.
    monthWidth: { type: Number },
    isTest: {
      type: Boolean,
      // Avoid relying on webpack-style process.env; use Vite's import.meta.env when available
      default: () => (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'test') || false,
    },
    trigger: { type: Boolean, default: false },
    closeAfterSelect: { type: Boolean, default: false },
    // Theming: 'light' | 'dark' | 'auto' (auto follows app's dark mode, e.g. Quasar q-dark)
    theme: {
      type: String,
      default: 'auto',
      validator: v => ['light', 'dark', 'auto', undefined].includes(v),
    },
    // Optional overrides for localization (demo can pass English arrays)
    monthNamesOverride: { type: Array },
    daysOverride: { type: Array },
    daysShortOverride: { type: Array },
    // Localize the keyboard shortcuts list (array of { symbol, label, symbolDescription })
    keyboardShortcutsOverride: { type: Array },
    // Localize text labels (partial object): { apply?, cancel?, keyboardShortcuts? }
    textsOverride: { type: Object },
    // Day number/content positioning inside the day cell button
    // one of: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    dayNumberPosition: {
      type: String,
      default: 'top-left',
      validator: v => ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(v),
    },
    // Additional day content (day-extra slot) positioning
    // one of: 'center' | 'top' | 'bottom' | 'left' | 'right'
    dayExtraPosition: {
      type: String,
      default: 'bottom',
      validator: v => ['center', 'top', 'bottom', 'left', 'right'].includes(v),
    },
    // Reservation/blocked ranges to visualize
    // [{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD', color?: '#RRGGBB' }]
    reservations: { type: Array, default: () => [] },
    // Placement for single floating reservation badge: 'center' | 'start-inside' | 'start-edge'
    reservationBadgePlacement: {
      type: String,
      default: 'center',
      validator: v => ['center', 'start-inside', 'start-edge'].includes(v),
    },
    // How to compute the center when a reservation spans multiple rows: 'row' | 'full'
    // 'row' -> center on the first visible row segment (stable visual result)
    // 'full' -> geometric center across all visible cells (may land between rows)
    reservationBadgeCenterMode: {
      type: String,
      default: 'row',
      validator: v => ['row', 'full'].includes(v),
    },
    // When centering on a row, prefer a row segment that contains at least this
    // many consecutive visible days. If the first row only has 1 day, we'll
    // fall back to the next row segment that meets this threshold (or the widest).
    reservationBadgeMinCellsForRowCenter: { type: Number, default: 2 },
    // Push the floating badge down a bit so the day number is visible (px)
    reservationBadgeYOffset: { type: Number, default: 7 },
    // Optional CSS filter for a soft drop shadow on the floating badge.
    // Example: 'drop-shadow(0 2px 3px rgba(0,0,0,0.18))'
    reservationBadgeShadow: {
      type: String,
      default: 'drop-shadow(0 2px 3px rgba(0,0,0,0.18))',
    },
    reservationBadgeOffset: { type: Number, default: 6 },
    // Control visibility of floating badges per reservation.
    // Boolean: show all (true) or hide all (false)
    // Function: (reservation) => boolean; return false to hide a specific badge
    reservationBadgeVisible: { type: [Boolean, Function], default: true },
  },
  data() {
    return {
      wrapperId: 'airbnb-style-datepicker-wrapper-' + randomString(5),
      dateFormat: 'YYYY-MM-DD',
      dateLabelFormat: 'dddd, MMMM D, YYYY',
      showDatepicker: false,
      showKeyboardShortcutsMenu: false,
      showMonths: 2,
      colors: {
        selected: '#00a699',
        inRange: '#66e2da',
        selectedText: '#fff',
        text: '#565a5c',
        inRangeBorder: '#33dacd',
        disabled: '#fff',
        hoveredInRange: '#67f6ee',
      },
      sundayFirst: false,
      ariaLabels: {
        chooseDate: date => date,
        chooseStartDate: date => `Choose ${date} as your start date.`,
        chooseEndDate: date => `Choose ${date} as your end date.`,
        selectedDate: date => `Selected. ${date}`,
        unavailableDate: date => `Not available. ${date}`,
        previousMonth: 'Move backward to switch to the previous month.',
        nextMonth: 'Move forward to switch to the next month.',
        closeDatepicker: 'Close calendar',
        openKeyboardShortcutsMenu: 'Open keyboard shortcuts menu.',
        closeKeyboardShortcutsMenu: 'Close keyboard shortcuts menu',
      },
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
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      daysShort: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      texts: {
        apply: 'Apply',
        cancel: 'Cancel',
        keyboardShortcuts: 'Keyboard Shortcuts',
      },
      keyboardShortcuts: [
        { symbol: '↵', label: 'Select the date in focus', symbolDescription: 'Enter key' },
        {
          symbol: '←/→',
          label: 'Move backward (left) and forward (right) by one day.',
          symbolDescription: 'Left or right arrow keys',
        },
        {
          symbol: '↑/↓',
          label: 'Move backward (up) and forward (down) by one week.',
          symbolDescription: 'Up or down arrow keys',
        },
        {
          symbol: 'PgUp/PgDn',
          label: 'Switch months.',
          symbolDescription: 'PageUp and PageDown keys',
        },
        {
          symbol: 'Home/End',
          label: 'Go to the first or last day of a week.',
          symbolDescription: 'Home or End keys',
        },
        { symbol: 'Esc', label: 'Close this panel', symbolDescription: 'Escape key' },
        { symbol: '?', label: 'Open this panel', symbolDescription: 'Question mark' },
      ],
      keys: {
        arrowDown: 40,
        arrowUp: 38,
        arrowRight: 39,
        arrowLeft: 37,
        enter: 13,
        pgUp: 33,
        pgDn: 34,
        end: 35,
        home: 36,
        questionMark: 191,
        esc: 27,
      },
      startingDate: '',
      months: [],
      years: [],
      width: 300,
      selectedDate1: '',
      selectedDate2: '',
      isSelectingDate1: true,
      hoverDate: '',
      hoveredReservationIdx: null,
      focusedDate: '',
      alignRight: false,
      triggerPosition: {},
      triggerWrapperPosition: {},
      viewportWidth: undefined,
      isMobile: undefined,
      isTablet: undefined,
      triggerElement: undefined,
      isDark: false,
      _darkMo: null,
      reservationBadgePositions: [],
      _badgePosTimeout: null,
      isMonthTransitioning: false,
      _activeMonthTransitions: 0,
      _monthTransitionFallbackTimeout: null,
    }
  },
  computed: {
    dayNumberPositionClass() {
      const map = {
        'center': 'asd__daypos--center',
        'top-left': 'asd__daypos--top-left',
        'top-right': 'asd__daypos--top-right',
        'bottom-left': 'asd__daypos--bottom-left',
        'bottom-right': 'asd__daypos--bottom-right',
      }
      return map[this.dayNumberPosition] || 'asd__daypos--center'
    },
    dayExtraPositionClass() {
      const map = {
        'center': 'asd__extrapos--center',
        'top': 'asd__extrapos--top',
        'bottom': 'asd__extrapos--bottom',
        'left': 'asd__extrapos--left',
        'right': 'asd__extrapos--right',
      }
      return map[this.dayExtraPosition] || 'asd__extrapos--center'
    },
    monthWidthNum() {
      return typeof this.monthWidth === 'number' && !isNaN(this.monthWidth)
        ? this.monthWidth
        : this.width
    },
    dataTheme() {
      return this.isDark ? 'dark' : null
    },
    wrapperClasses() {
      return {
        'asd__wrapper--datepicker-open': this.showDatepicker,
        'asd__wrapper--full-screen': this.showFullscreen,
        'asd__wrapper--inline': this.inline,
        'asd__wrapper--auto-fit': this.inline && this.autoFitInline,
      }
    },
    wrapperStyles() {
      return {
        position: this.inline ? 'static' : 'absolute',
        top: this.inline ? '0' : this.triggerPosition.height + this.offsetY + 'px',
        left: !this.alignRight
          ? this.triggerPosition.left - this.triggerWrapperPosition.left + this.offsetX + 'px'
          : '',
        right: this.alignRight
          ? this.triggerWrapperPosition.right - this.triggerPosition.right + this.offsetX + 'px'
          : '',
        // In inline mode, allow the wrapper to be as wide as its container so months can wrap
        width: this.inline ? 'auto' : this.monthWidthNum * this.showMonths + 'px',
        // Expose month min width for CSS (used by auto-fit flex sizing)
        '--asd-month-min': this.monthWidthNum + 'px',
        zIndex: this.inline ? '0' : '100',
      }
    },
    innerStyles() {
      return {
        // When inline, don't offset for the hidden month; we hide it entirely via CSS to enable wrapping
        'margin-left': this.inline ? '0' : (this.showFullscreen ? '-' + this.viewportWidth : `-${this.monthWidthNum}px`),
      }
    },
    keyboardShortcutsMenuStyles() {
      return {
        left: this.showFullscreen ? this.viewportWidth : `${this.monthWidthNum}px`,
      }
    },
    monthWidthStyles() {
      return {
        // Respect the calendar month width in all modes; inline will still wrap via flex container
        width: this.inline
          ? (this.autoFitInline ? 'auto' : (this.monthWidthNum + 'px'))
          : (this.showFullscreen ? this.viewportWidth : this.monthWidthNum + 'px'),
      }
    },
    mobileHeaderFallback() {
      return this.mode === 'range' ? 'Select dates' : 'Select date'
    },
    showFullscreen() {
      return this.isMobile && this.fullscreenMobile
    },
    datesSelected() {
      return !!(
        (this.selectedDate1 && this.selectedDate1 !== '') ||
        (this.selectedDate2 && this.selectedDate2 !== '')
      )
    },
    allDatesSelected() {
      return !!(
        this.selectedDate1 &&
        this.selectedDate1 !== '' &&
        this.selectedDate2 &&
        this.selectedDate2 !== ''
      )
    },
    hasMinDate() {
      return !!(this.minDate && this.minDate !== '')
    },
    isRangeMode() {
      return this.mode === 'range'
    },
    isSingleMode() {
      return this.mode === 'single'
    },
    activeSelectionStrategy() {
      return normalizeSelectionStrategy(this.selectionStrategy, this.mode)
    },
    datepickerWidth() {
      return this.monthWidthNum * this.showMonths
    },
    datePropsCompound() {
      // used to watch for changes in props, and update GUI accordingly
      return this.dateOne + this.dateTwo
    },
    isDateTwoBeforeDateOne() {
      if (!this.dateTwo) {
        return false
      }
      return isBefore(this.dateTwo, this.dateOne)
    },
    visibleMonths() {
      const firstMonthArray = this.months.filter((m, index) => index > 0)
      const numberOfMonthsArray = []
      for (let i = 0; i < this.showMonths; i++) {
        numberOfMonthsArray.push(i)
      }
      return numberOfMonthsArray.map((_, index) => firstMonthArray[index].firstDateOfMonth)
    },
  },
  watch: {
    monthsToShow(newVal, oldVal) {
      // Recompute responsive month count and regenerate months when prop changes
      this.positionDatepicker()
      this.generateMonths()
    },
    monthNamesOverride(newVal) {
      // Re-apply localization overrides when parent changes them
      this.setupDatepicker()
      this.generateMonths()
      this.generateYears()
    },
    daysOverride(newVal) {
      this.setupDatepicker()
    },
    daysShortOverride(newVal) {
      this.setupDatepicker()
    },
    keyboardShortcutsOverride(newVal) {
      this.setupDatepicker()
    },
    textsOverride(newVal) {
      this.setupDatepicker()
    },
    theme() {
      this._applyTheme()
      if (this.theme === 'auto' && !this._darkMo) {
        try {
          const body = document.body
          const html = document.documentElement
          this._darkMo = new MutationObserver(() => this._applyTheme())
          if (body) this._darkMo.observe(body, { attributes: true, attributeFilter: ['class'] })
          if (html) this._darkMo.observe(html, { attributes: true, attributeFilter: ['class'] })
        } catch (e) { }
      } else if (this.theme !== 'auto' && this._darkMo) {
        try { this._darkMo.disconnect() } catch (e) { }
        this._darkMo = null
      }
    },
    selectedDate1(newValue, oldValue) {
      let newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat)
      this.$emit('date-one-selected', newDate)
    },
    selectedDate2(newValue, oldValue) {
      let newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat)
      this.$emit('date-two-selected', newDate)
    },
    mode(newValue, oldValue) {
      this.setStartDates()
    },
    minDate() {
      this.setStartDates()
      this.generateMonths()
      this.generateYears()
    },
    endDate() {
      this.generateYears()
    },
    datePropsCompound(newValue) {
      if (this.dateOne !== this.selectedDate1) {
        this.startingDate = this.dateOne
        this.setStartDates()
        this.generateMonths()
        this.generateYears()
      }
      if (this.isDateTwoBeforeDateOne) {
        this.selectedDate2 = ''
        this.$emit('date-two-selected', '')
      }
    },
    trigger(newValue, oldValue) {
      // Allow external prop to both open and close the datepicker
      // true -> open, false -> close
      setTimeout(() => {
        if (newValue) {
          this.openDatepicker()
        } else {
          this.closeDatepicker()
        }
      }, 0)
    },
    reservations: {
      handler() { this._scheduleReservationBadgePositionsUpdate() },
      deep: true,
    },
    months() {
      this._scheduleReservationBadgePositionsUpdate()
    },
  },
  created() {
    this.setupDatepicker()

    if (this.sundayFirst) {
      this.setSundayToFirstDayInWeek()
    }
  },
  mounted() {
    this.viewportWidth = window.innerWidth + 'px'
    this.isMobile = window.innerWidth < 768
    this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024
    // Initialize theme and attach observer if needed
    this._applyTheme()
    if (this.theme === 'auto') {
      try {
        const body = document.body
        const html = document.documentElement
        this._darkMo = new MutationObserver(() => this._applyTheme())
        if (body) this._darkMo.observe(body, { attributes: true, attributeFilter: ['class'] })
        if (html) this._darkMo.observe(html, { attributes: true, attributeFilter: ['class'] })
      } catch (e) {
        // ignore
      }
    }
    this._handleWindowResizeEvent = debounce(() => {
      this.positionDatepicker()
      this.setStartDates()
    }, 200)
    this._handleWindowClickEvent = event => {
      // toggle when the trigger element (or any of its children) is clicked
      if (!this.triggerElement) return
      const clickedTrigger =
        event.target === this.triggerElement || this.triggerElement.contains(event.target)
      if (clickedTrigger) {
        event.stopPropagation()
        event.preventDefault()
        this.toggleDatepicker()
      }
    }
    window.addEventListener('resize', this._handleWindowResizeEvent)

    this.triggerElement = this.isTest
      ? document.createElement('input')
      : document.getElementById(this.triggerElementId)

    this.setStartDates()
    this.generateMonths()
    this.generateYears()

    if (this.startOpen || this.inline) {
      this.openDatepicker()
    }

    const wrapperEl = this.$refs && this.$refs.wrapper
    if (wrapperEl) {
      wrapperEl.addEventListener('keyup', this.handleKeyboardInput)
      wrapperEl.addEventListener('keydown', this.trapKeyboardInput)
    }
    if (this.triggerElement) {
      this.triggerElement.addEventListener('keyup', this.handleTriggerInput)
      this.triggerElement.addEventListener('click', this._handleWindowClickEvent)
    }

    // Position floating badges after initial render and on resize
    this._scheduleReservationBadgePositionsUpdate()
    this._handleBadgeResizeEvent = debounce(() => this.updateReservationBadgePositions(), 100)
    window.addEventListener('resize', this._handleBadgeResizeEvent)
    try {
      const grid = this.$el.querySelector('.asd__months-wrapper')
      if (grid && 'ResizeObserver' in window) {
        this._gridRo = new ResizeObserver(() => this.updateReservationBadgePositions())
        this._gridRo.observe(grid)
      }
    } catch (e) { }
  },
  unmounted() {
    window.removeEventListener('resize', this._handleWindowResizeEvent)
    if (this._handleBadgeResizeEvent) window.removeEventListener('resize', this._handleBadgeResizeEvent)
    if (this._gridRo) { try { this._gridRo.disconnect() } catch (e) { } this._gridRo = null }
    if (this._badgePosTimeout) { clearTimeout(this._badgePosTimeout); this._badgePosTimeout = null }
    if (this._monthTransitionFallbackTimeout) {
      clearTimeout(this._monthTransitionFallbackTimeout)
      this._monthTransitionFallbackTimeout = null
    }
    if (this._darkMo) {
      try {
        this._darkMo.disconnect()
      } catch (e) { }
      this._darkMo = null
    }
    const wrapperEl = this.$refs && this.$refs.wrapper
    if (wrapperEl) {
      wrapperEl.removeEventListener('keyup', this.handleKeyboardInput)
      wrapperEl.removeEventListener('keydown', this.trapKeyboardInput)
    }
    if (this.triggerElement) {
      this.triggerElement.removeEventListener('keyup', this.handleTriggerInput)
      this.triggerElement.removeEventListener('click', this._handleWindowClickEvent)
    }
  },
  methods: {
    _detectQuasarDark() {
      try {
        const body = document.body
        const html = document.documentElement
        const hasDark = el => !!(el && el.classList && (el.classList.contains('q-dark') || el.classList.contains('body--dark')))
        return hasDark(body) || hasDark(html)
      } catch (e) {
        return false
      }
    },
    _applyTheme() {
      if (this.theme === 'dark') this.isDark = true
      else if (this.theme === 'light') this.isDark = false
      else this.isDark = this._detectQuasarDark()
    },
    // --- Reservation colors & detection ---
    _hexToRgb(c) {
      return hexToRgb(c)
    },
    _rgbToHex({ r, g, b }) {
      return rgbToHex({ r, g, b })
    },
    _luminance({ r, g, b }) {
      return luminance({ r, g, b })
    },
    _adjustForContrast(color) {
      return adjustForContrast(color, this.isDark)
    },
    _lightenColor(color, amount = 0.18) {
      return lightenColor(color, amount)
    },
    _hashColor(key) {
      return hashColorFromKey(key, this.isDark)
    },
    isReservationInteriorDate(date, reservation) {
      return isReservationInteriorDateUtil(date, reservation)
    },
    getNearestReservationBoundary(date, direction) {
      return getNearestReservationBoundaryUtil(date, direction, this.reservations)
    },
    constrainRangeEndDate(startDate, candidateDate) {
      return constrainRangeEndDateUtil({
        startDate,
        candidateDate,
        dateFormat: this.dateFormat,
        getNearestBoundary: (date, direction) => this.getNearestReservationBoundary(date, direction),
        isDateBlocked: date => this.isDateDisabled(date) || this.isBeforeMinDate(date) || this.isAfterEndDate(date),
      })
    },
    constrainRangeEndDateDefaultRange(startDate, candidateDate) {
      return constrainRangeEndDateUtil({
        startDate,
        candidateDate,
        dateFormat: this.dateFormat,
        getNearestBoundary: () => null,
        isDateBlocked: date => this.isDateDisabled(date) || this.isBeforeMinDate(date) || this.isAfterEndDate(date),
      })
    },
    getReservationDateInfo(date, reservation, idx) {
      return buildReservationDateInfo(date, reservation, idx, r => {
        const base = r.color || this._hashColor(`${r.start}|${r.end}`)
        return this._adjustForContrast(base)
      })
    },
    shouldRenderReservationOverlay(reservationDateInfo) {
      return !!reservationDateInfo
    },
    reservationFor(date) {
      return reservationForDate(date, this.reservations, (d, r, i) => this.getReservationDateInfo(d, r, i))
    },
    // Return all reservations that affect a given date (e.g., end of one and start of another on the same day)
    reservationsFor(date) {
      return reservationsForDate(date, this.reservations, (d, r, i) => this.getReservationDateInfo(d, r, i))
    },
    reservationOverlaysFor(date) {
      // Keep selected ranges visually consistent, but allow reservation boundary overlays
      // on selected start/end cells so selection only fills the non-reserved (white) half.
      if (this.isSelected(date)) {
        return this
          .reservationsFor(date)
          .filter(r => r.variant === 'start' || r.variant === 'end' || r.variant === 'single')
          .filter(this.shouldRenderReservationOverlay)
      }
      // During hover preview, preserve reservation boundaries so the reserved half
      // remains colored while hover fills the free half.
      if (this.isHoveredInRange(date)) {
        return this
          .reservationsFor(date)
          .filter(r => r.variant === 'start' || r.variant === 'end' || r.variant === 'single')
          .filter(this.shouldRenderReservationOverlay)
      }
      if (this.isInRange(date)) {
        return []
      }
      return this.reservationsFor(date).filter(this.shouldRenderReservationOverlay)
    },
    getDayStyles(date) {
      // Keep width inline; colors and borders are now driven by CSS variables and state classes
      if (this.inline && this.autoFitInline) {
        // Let CSS handle sizing in auto-fit inline mode
        return {}
      }
      return { width: (this.monthWidthNum - 30) / 7 + 'px' }
    },
    getAriaLabelForDate(date) {
      const dateLabel = format(date, this.dateLabelFormat)

      const isDisabled = this.isDisabled(date)
      if (isDisabled) {
        return this.ariaLabels.unavailableDate(dateLabel)
      }

      const isSelected = this.isSelected(date)
      if (isSelected) {
        return this.ariaLabels.selectedDate(dateLabel)
      }

      if (this.isRangeMode) {
        if (this.isSelectingDate1) {
          return this.ariaLabels.chooseStartDate(dateLabel)
        } else {
          return this.ariaLabels.chooseEndDate(dateLabel)
        }
      } else {
        return this.ariaLabels.chooseDate(dateLabel)
      }
    },
    // Compute screen positions for once-per-reservation floating badges
    _pickVisibleDateCell(ref) {
      const list = Array.isArray(ref) ? ref : [ref]
      if (!list || !list.length) return null

      for (let i = 0; i < list.length; i++) {
        const el = list[i]
        if (!el || !el.closest) continue
        const monthEl = el.closest('.asd__month')
        if (monthEl && monthEl.classList && monthEl.classList.contains('asd__month--hidden')) continue
        const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null
        if (rect && rect.width > 0 && rect.height > 0) return el
      }

      return list[0] || null
    },
    _scheduleReservationBadgePositionsUpdate(afterFirstPass) {
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.updateReservationBadgePositions()
            if (typeof afterFirstPass === 'function') afterFirstPass()
          })
        })
      })
      // Month navigation animates; run a delayed pass after transition settles.
      if (this._badgePosTimeout) clearTimeout(this._badgePosTimeout)
      this._badgePosTimeout = setTimeout(() => this.updateReservationBadgePositions(), 420)
    },
    _armMonthTransitionFallback() {
      this.isMonthTransitioning = true
      if (this._monthTransitionFallbackTimeout) clearTimeout(this._monthTransitionFallbackTimeout)
      this._monthTransitionFallbackTimeout = setTimeout(() => {
        this._activeMonthTransitions = 0
        this._scheduleReservationBadgePositionsUpdate(() => {
          this.isMonthTransitioning = false
        })
      }, 420)
    },
    onMonthsTransitionStart(event) {
      const target = event && event.target
      if (!target || !target.classList || !target.classList.contains('asd__month')) return
      this._activeMonthTransitions += 1
      this.isMonthTransitioning = true
      if (this._monthTransitionFallbackTimeout) clearTimeout(this._monthTransitionFallbackTimeout)
    },
    onMonthsTransitionEnd(event) {
      const target = event && event.target
      if (!target || !target.classList || !target.classList.contains('asd__month')) return
      this._activeMonthTransitions = Math.max(0, this._activeMonthTransitions - 1)
      if (this._activeMonthTransitions === 0) {
        this._scheduleReservationBadgePositionsUpdate(() => {
          this.isMonthTransitioning = false
        })
      }
    },
    updateReservationBadgePositions() {
      try {
        const wrapper = this.$el && this.$el.querySelector && this.$el.querySelector('.asd__inner-wrapper')
        if (!wrapper) { this.reservationBadgePositions = []; return }
        const wrapRect = wrapper.getBoundingClientRect()
        const results = []

        const addOne = (r, reservationIdx) => {
          // Iterate dates from start to end and collect visible cell rects
          let d = r.start
          let guard = 0
          let any = false
          const rects = []
          while (true && guard < 500) {
            const ref = this.$refs[`date-${d}`]
            const el = this._pickVisibleDateCell(ref)
            if (el && el.getBoundingClientRect) {
              const rect = el.getBoundingClientRect()
              rects.push({ d, rect })
              any = true
            }
            if (d === r.end) break
            d = format(addDays(d, 1), this.dateFormat)
            guard++
          }
          if (!any) return

          const anchor = computeBadgeAnchor({
            rects,
            wrapRect,
            startDate: r.start,
            placement: this.reservationBadgePlacement,
            centerMode: this.reservationBadgeCenterMode,
            minCellsForRowCenter: this.reservationBadgeMinCellsForRowCenter,
            offset: this.reservationBadgeOffset || 6,
            yOffset: this.reservationBadgeYOffset || 0,
            clampMargin: 6,
          })
          if (!anchor) return

          const base = r.color || this._hashColor(`${r.start}|${r.end}`)
          const color = this._adjustForContrast(base)
          const id = (r && r.id) != null ? r.id : reservationIdx
          const badgeColor = this._lightenColor(color, 0.16)
          results.push({
            x: anchor.x,
            y: anchor.y,
            reservationIdx,
            reservation: { ...r, id, color, badgeColor },
            anchorClass: anchor.anchorClass,
          })
        }

        if (Array.isArray(this.reservations)) {
          for (let i = 0; i < this.reservations.length; i++) {
            const r = this.reservations[i]
            if (!r || !r.start || !r.end) continue
            addOne(r, i)
          }
        }

        this.reservationBadgePositions = results
      } catch (e) {
        // Non-fatal; skip positions if DOM not ready
        this.reservationBadgePositions = []
      }
    },
    _isBadgeVisible(reservation) {
      try {
        const v = this.reservationBadgeVisible
        if (typeof v === 'function') return !!v(reservation)
        return !!v
      } catch (e) {
        return true
      }
    },
    onReservationBadgeClick(reservation) {
      // Emit a click event with the reservation payload so host apps can open dialogs, etc.
      try {
        if (reservation && reservation.id == null && reservation.idx != null) {
          // normalize id when none provided
          reservation = { ...reservation, id: reservation.idx }
        }
      } catch (e) { }
      this.$emit('reservation-clicked', reservation)
    },
    _selectionEventPayload(extra = {}) {
      return {
        mode: this.mode,
        strategy: this.activeSelectionStrategy,
        startDate: this.selectedDate1 || null,
        endDate: this.selectedDate2 || null,
        isSelectingStart: !!this.isSelectingDate1,
        hasSelection: !!(this.selectedDate1 || this.selectedDate2),
        hasCompleteRange: !!(this.selectedDate1 && this.selectedDate2),
        ...extra,
      }
    },
    emitSelectionChanged(extra = {}) {
      this.$emit('selection-changed', this._selectionEventPayload(extra))
    },
    emitHoverRangeChanged(extra = {}) {
      const hasHover = !!this.hoverDate
      const hasStart = !!this.selectedDate1
      const isPreviewingRange = !this.isSelectingDate1 && hasStart && hasHover
      let previewStartDate = null
      let previewEndDate = null
      if (isPreviewingRange) {
        if (isBefore(this.hoverDate, this.selectedDate1)) {
          previewStartDate = this.hoverDate
          previewEndDate = this.selectedDate1
        } else {
          previewStartDate = this.selectedDate1
          previewEndDate = this.hoverDate
        }
      }
      this.$emit('hover-range-changed', {
        mode: this.mode,
        strategy: this.activeSelectionStrategy,
        hoverDate: this.hoverDate || null,
        startDate: this.selectedDate1 || null,
        endDate: this.selectedDate2 || null,
        isPreviewingRange,
        previewStartDate,
        previewEndDate,
        ...extra,
      })
    },
    clearSelectedDates(reason = 'manual-clear') {
      this.selectedDate1 = ''
      this.selectedDate2 = ''
      this.isSelectingDate1 = true
      this.hoverDate = ''
      this.emitSelectionChanged({ source: reason })
      this.emitHoverRangeChanged({ source: reason })
    },
    handleClickOutside(event) {
      // if click was inside the trigger element, ignore (so trigger toggles work)
      if (!this.showDatepicker || this.inline) return
      const triggerContainsTarget =
        this.triggerElement &&
        typeof this.triggerElement.contains === 'function' &&
        this.triggerElement.contains(event.target)
      if (this.triggerElement && (event.target === this.triggerElement || triggerContainsTarget)) return
      if (this.selectedDate1 || this.selectedDate2) {
        this.clearSelectedDates('outside-click')
      }
      this.closeDatepicker()
    },

    handlePointerDown(event) {
      // If click/pointerdown happened inside a day element, ignore
      if (!this.showDatepicker) return
      const target = event.target
      if (target && target.closest && (target.closest('.asd__day') || target.closest('.asd__day-button'))) {
        return
      }

      // Exit range-select mode: reset hover and set to selecting start
      let changed = false
      if (!this.isSelectingDate1) {
        this.isSelectingDate1 = true
        changed = true
      }
      if (this.hoverDate) {
        this.hoverDate = ''
        changed = true
      }

      // If a start date was selected but no end date yet, clear the tentative start selection
      if (this.selectedDate1 && !this.selectedDate2) {
        this.selectedDate1 = ''
        changed = true
      }
      if (changed) {
        this.emitSelectionChanged({ source: 'pointerdown-reset' })
        this.emitHoverRangeChanged({ source: 'pointerdown-reset' })
      }
    },
    shouldHandleInput(event, key) {
      return (
        event.keyCode === key && (!event.shiftKey || event.keyCode === 191) && this.showDatepicker
      )
    },
    handleTriggerInput(event) {
      if (this.mode === 'single') {
        this.setDateFromText(event.target.value)
      }
    },
    trapKeyboardInput(event) {
      // prevent keys that are used as keyboard shortcuts from propagating out of this element
      // except for the enter key, which is needed to activate buttons
      const shortcutKeyCodes = Object.keys(this.keys).map(key => this.keys[key])
      shortcutKeyCodes.splice(shortcutKeyCodes.indexOf(13), 1)
      const shouldPreventDefault = shortcutKeyCodes.indexOf(event.keyCode) > -1
      if (shouldPreventDefault) event.preventDefault()
    },
    handleKeyboardInput(event) {
      if (this.shouldHandleInput(event, this.keys.esc)) {
        if (this.showKeyboardShortcutsMenu) {
          this.closeKeyboardShortcutsMenu()
        } else {
          this.closeDatepicker()
        }
      } else if (this.showKeyboardShortcutsMenu) {
        // if keyboard shortcutsMenu is open, then esc is the only key we want to have fire events
      } else if (this.shouldHandleInput(event, this.keys.arrowDown)) {
        const newDate = addWeeks(this.focusedDate, 1)
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.nextMonth()
      } else if (this.shouldHandleInput(event, this.keys.arrowUp)) {
        const newDate = subWeeks(this.focusedDate, 1)
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.previousMonth()
      } else if (this.shouldHandleInput(event, this.keys.arrowRight)) {
        const newDate = addDays(this.focusedDate, 1)
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.nextMonth()
      } else if (this.shouldHandleInput(event, this.keys.arrowLeft)) {
        const newDate = subDays(this.focusedDate, 1)
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.previousMonth()
      } else if (this.shouldHandleInput(event, this.keys.enter)) {
        // on enter key, only select the date if a date is currently in focus
        const target = event.target
        if (!this.showKeyboardShortcutsMenu && target && target.tagName === 'TD') {
          this.selectDate(this.focusedDate)
        }
      } else if (this.shouldHandleInput(event, this.keys.pgUp)) {
        this.setFocusedDate(subMonths(this.focusedDate, 1))
        this.previousMonth()
      } else if (this.shouldHandleInput(event, this.keys.pgDn)) {
        this.setFocusedDate(addMonths(this.focusedDate, 1))
        this.nextMonth()
      } else if (this.shouldHandleInput(event, this.keys.home)) {
        const newDate = startOfWeek(this.focusedDate, {
          weekStartsOn: this.sundayFirst ? 0 : 1,
        })
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.previousMonth()
      } else if (this.shouldHandleInput(event, this.keys.end)) {
        const newDate = endOfWeek(this.focusedDate, {
          weekStartsOn: this.sundayFirst ? 0 : 1,
        })
        const changeMonths = !isSameMonth(newDate, this.focusedDate)
        this.setFocusedDate(newDate)
        if (changeMonths) this.nextMonth()
      } else if (this.shouldHandleInput(event, this.keys.questionMark)) {
        this.openKeyboardShortcutsMenu()
      }
    },
    setDateFromText(value) {
      if (!value || value.length < 10) {
        return
      }
      // make sure format is either 'YYYY-MM-DD' or 'DD.MM.YYYY'
      const isFormatYearFirst = value.match(
        /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/
      )
      const isFormatDayFirst = value.match(
        /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])[.](0[1-9]|1[0-2])[.](\d{4})$/
      )

      if (!isFormatYearFirst && !isFormatDayFirst) {
        return
      }
      if (isFormatDayFirst) {
        //convert to YYYY-MM-DD
        value = `${value.substring(6, 10)}-${value.substring(3, 5)}-${value.substring(0, 2)}`
      }

      const valueAsDateObject = new Date(value)
      if (!isValid(valueAsDateObject)) {
        return
      }
      const formattedDate = format(valueAsDateObject, this.dateFormat)
      if (
        this.isDateDisabled(formattedDate) ||
        this.isBeforeMinDate(formattedDate) ||
        this.isAfterEndDate(formattedDate)
      ) {
        return
      }
      this.startingDate = subMonths(formattedDate, 1)
      this.generateMonths()
      this.generateYears()
      this.selectDate(formattedDate)
    },
    isMonthDisabled(year, monthIndex) {
      const monthDate = new Date(year, monthIndex)
      if (this.hasMinDate && isBefore(monthDate, startOfMonth(this.minDate))) {
        return true
      }
      return this.isAfterEndDate(monthDate)
    },
    generateMonths() {
      this.months = []
      let currentMonth = this.startingDate
      for (let i = 0; i < this.showMonths + 2; i++) {
        this.months.push(this.getMonth(currentMonth))
        currentMonth = this.addMonths(currentMonth)
      }
    },
    generateYears() {
      if (!this.showMonthYearSelect) return
      this.years = []
      const currentYear = getYear(this.startingDate)
      const startYear = this.minDate ? getYear(this.minDate) : currentYear - this.yearsForSelect
      const endYear = this.endDate ? getYear(this.endDate) : currentYear + this.yearsForSelect
      for (var year = startYear; year <= endYear; year++) {
        this.years.push(year.toString())
      }
    },
    setupDatepicker() {
      if (this.$options.ariaLabels) {
        this.ariaLabels = copyObject(this.$options.ariaLabels)
      }
      if (this.$options.keyboardShortcuts) {
        this.keyboardShortcuts = copyObject(this.$options.keyboardShortcuts)
      }
      // Per-instance keyboard shortcuts override via prop
      if (this.keyboardShortcutsOverride && Array.isArray(this.keyboardShortcutsOverride) && this.keyboardShortcutsOverride.length) {
        this.keyboardShortcuts = copyObject(this.keyboardShortcutsOverride)
      }
      if (this.$options.dateLabelFormat) {
        this.dateLabelFormat = copyObject(this.$options.dateLabelFormat)
      }
      if (this.$options.sundayFirst) {
        this.sundayFirst = copyObject(this.$options.sundayFirst)
      }
      if (this.$options.colors) {
        const colors = copyObject(this.$options.colors)
        this.colors.selected = colors.selected || this.colors.selected
        this.colors.inRange = colors.inRange || this.colors.inRange
        this.colors.hoveredInRange = colors.hoveredInRange || this.colors.hoveredInRange
        this.colors.selectedText = colors.selectedText || this.colors.selectedText
        this.colors.text = colors.text || this.colors.text
        this.colors.inRangeBorder = colors.inRangeBorder || this.colors.inRangeBorder
        this.colors.disabled = colors.disabled || this.colors.disabled
      }
      // Allow prop-based overrides (higher priority) then global options
      if (this.monthNamesOverride && this.monthNamesOverride.length === 12) {
        this.monthNames = copyObject(this.monthNamesOverride)
      } else if (this.$options.monthNames && this.$options.monthNames.length === 12) {
        this.monthNames = copyObject(this.$options.monthNames)
      }
      if (this.daysOverride && this.daysOverride.length === 7) {
        this.days = copyObject(this.daysOverride)
      } else if (this.$options.days && this.$options.days.length === 7) {
        this.days = copyObject(this.$options.days)
      }
      if (this.daysShortOverride && this.daysShortOverride.length === 7) {
        this.daysShort = copyObject(this.daysShortOverride)
      } else if (this.$options.daysShort && this.$options.daysShort.length === 7) {
        this.daysShort = copyObject(this.$options.daysShort)
      }
      if (this.$options.texts) {
        const texts = copyObject(this.$options.texts)
        this.texts.apply = texts.apply || this.texts.apply
        this.texts.cancel = texts.cancel || this.texts.cancel
        this.texts.keyboardShortcuts = texts.keyboardShortcuts || this.texts.keyboardShortcuts
      }
      // Per-instance texts override via prop
      if (this.textsOverride && typeof this.textsOverride === 'object') {
        const t = this.textsOverride
        if (t.apply) this.texts.apply = t.apply
        if (t.cancel) this.texts.cancel = t.cancel
        if (t.keyboardShortcuts) this.texts.keyboardShortcuts = t.keyboardShortcuts
      }
    },
    setStartDates() {
      let startDate = this.dateOne || new Date()
      if (this.hasMinDate && isBefore(startDate, this.minDate)) {
        startDate = this.minDate
      }
      this.startingDate = this.subtractMonths(startDate)
      this.selectedDate1 = this.dateOne
      this.selectedDate2 = this.dateTwo
      this.focusedDate = startDate
      this.emitSelectionChanged({ source: 'sync-props' })
      this.emitHoverRangeChanged({ source: 'sync-props' })
    },
    setSundayToFirstDayInWeek() {
      const lastDay = this.days.pop()
      this.days.unshift(lastDay)
      const lastDayShort = this.daysShort.pop()
      this.daysShort.unshift(lastDayShort)
    },
    getMonth(date) {
      return buildMonth({
        date,
        monthNames: this.monthNames,
        sundayFirst: this.sundayFirst,
        showOutsideDays: this.showOutsideDays,
      })
    },
    getWeeks(date) {
      return buildWeeks({
        date,
        sundayFirst: this.sundayFirst,
        showOutsideDays: this.showOutsideDays,
      })
    },
    selectDate(date) {
      if (!this.selectable) {
        this.$emit('blocked-date-clicked', {
          mode: this.mode,
          strategy: this.activeSelectionStrategy,
          date,
          reason: 'not-selectable',
          minDate: this.minDate || null,
          endDate: this.endDate || null,
        })
        return
      }
      if (this.isBeforeMinDate(date)) {
        this.$emit('blocked-date-clicked', {
          mode: this.mode,
          strategy: this.activeSelectionStrategy,
          date,
          reason: 'before-min',
          minDate: this.minDate || null,
          endDate: this.endDate || null,
        })
        return
      }
      if (this.isAfterEndDate(date)) {
        this.$emit('blocked-date-clicked', {
          mode: this.mode,
          strategy: this.activeSelectionStrategy,
          date,
          reason: 'after-end',
          minDate: this.minDate || null,
          endDate: this.endDate || null,
        })
        return
      }
      if (this.isDateDisabled(date)) {
        this.$emit('blocked-date-clicked', {
          mode: this.mode,
          strategy: this.activeSelectionStrategy,
          date,
          reason: 'disabled',
          minDate: this.minDate || null,
          endDate: this.endDate || null,
        })
        return
      }
      const transition = resolveClickTransitionByStrategy({
        strategyKey: this.activeSelectionStrategy,
        date,
        selectable: true,
        isOutOfBounds: () => false,
        isDateDisabled: () => false,
        selectedDate1: this.selectedDate1,
        selectedDate2: this.selectedDate2,
        isSelectingDate1: this.isSelectingDate1,
        defaultRangeConstrain: (start, end) => this.constrainRangeEndDateDefaultRange(start, end),
        reservationAwareConstrain: (start, end) => this.constrainRangeEndDate(start, end),
      })
      if (!transition || transition.type === 'noop') return

      this.selectedDate1 = transition.next.selectedDate1
      this.selectedDate2 = transition.next.selectedDate2
      this.isSelectingDate1 = transition.next.isSelectingDate1
      this.emitSelectionChanged({ source: 'date-click', action: transition.type, clickedDate: date })
      this.emitHoverRangeChanged({ source: 'date-click' })

      if (transition.shouldClose) {
        this.closeDatepicker()
        return
      }

      if (transition.shouldFinalizeRange && this.showActionButtons) {
        const applyBtn = this.$refs && this.$refs['apply-button']
        this.focusWithoutScroll(applyBtn)
      }
      if (transition.shouldFinalizeRange && this.allDatesSelected && this.closeAfterSelect) {
        this.closeDatepicker()
      }
    },
    setHoverDate(date) {
      this.hoverDate = resolveHoverDateByStrategy({
        strategyKey: this.activeSelectionStrategy,
        date,
        isSelectingDate1: this.isSelectingDate1,
        selectedDate1: this.selectedDate1,
        defaultRangeConstrain: (start, end) => this.constrainRangeEndDateDefaultRange(start, end),
        reservationAwareConstrain: (start, end) => this.constrainRangeEndDate(start, end),
      })
      this.emitHoverRangeChanged({ source: 'hover' })
      const rr = this.reservationFor(date)
      this.hoveredReservationIdx = rr ? rr.idx : null
      // Emit hovered reservation info so parent apps can react (e.g., highlight a booking row)
      if (rr) {
        const res = this.reservations[rr.idx]
        const id = (res && res.id) != null ? res.id : rr.idx
        this.$emit('reservation-hovered', { id, index: rr.idx, start: res.start, end: res.end })
      } else {
        this.$emit('reservation-hovered', null)
      }
    },
    setFocusedDate(date) {
      const formattedDate = format(date, this.dateFormat)
      this.focusedDate = formattedDate
      const dateElement = this.$refs[`date-${formattedDate}`]
      // handle .focus() on ie11 by adding a short timeout
      if (dateElement && dateElement.length) {
        setTimeout(() => {
          this.focusWithoutScroll(dateElement[0])
        }, 10)
      }
    },
    resetFocusedDate(setToFirst) {
      if (this.focusedDate && !this.isDateVisible(this.focusedDate)) {
        const visibleMonthIdx = setToFirst ? 0 : this.visibleMonths.length - 1
        const targetMonth = this.visibleMonths[visibleMonthIdx]
        const monthIdx = getMonth(targetMonth)
        const year = getYear(targetMonth)
        const newFocusedDate = setYear(setMonth(this.focusedDate, monthIdx), year)
        this.focusedDate = format(newFocusedDate, this.dateFormat)
      }
    },
    isToday(date) {
      return format(new Date(), this.dateFormat) === date
    },
    isSameDate(date1, date2) {
      return isSameDay(date1, date2)
    },
    isSelected(date) {
      if (!date) {
        return
      }
      return this.selectedDate1 === date || this.selectedDate2 === date
    },
    isInRange(date) {
      return isInRangeUtil({
        date,
        selectedDate1: this.selectedDate1,
        selectedDate2: this.selectedDate2,
        hoverDate: this.hoverDate,
        allDatesSelected: this.allDatesSelected,
        isSingleMode: this.isSingleMode,
      })
    },
    isHoveredInRange(date) {
      return isHoveredInRangeUtil({
        date,
        selectedDate1: this.selectedDate1,
        hoverDate: this.hoverDate,
        allDatesSelected: this.allDatesSelected,
        isSelectingDate1: this.isSelectingDate1,
        isSingleMode: this.isSingleMode,
        isSameDate: this.isSameDate,
      })
    },
    isBeforeMinDate(date) {
      if (!this.minDate) {
        return false
      }
      return isBefore(date, this.minDate)
    },
    isAfterEndDate(date) {
      if (!this.endDate) {
        return false
      }
      return isAfter(date, this.endDate)
    },
    isDateVisible(date) {
      if (!date) {
        return false
      }
      const start = subDays(this.visibleMonths[0], 1)
      const end = addDays(lastDayOfMonth(this.visibleMonths[this.monthsToShow - 1]), 1)
      return isAfter(date, start) && isBefore(date, end)
    },
    focusWithoutScroll(el) {
      if (!el || typeof el.focus !== 'function') return
      try {
        el.focus({ preventScroll: true })
      } catch (e) {
        el.focus()
      }
    },
    isDateDisabled(date) {
      // 1) Reservation defaults: disable interior dates, keep start/end selectable.
      if (isDateDisabledByReservationInterior(date, this.reservations)) {
        return true
      }

      // 2) Respect explicit enabledDates/disabledDates lists
      if (this.enabledDates.length > 0) {
        return this.enabledDates.indexOf(date) === -1
      } else {
        return this.disabledDates.indexOf(date) > -1
      }
    },
    customizedDateClass(date) {
      var customizedClasses = ''
      if (this.customizedDates.length > 0) {
        for (var i = 0; i < this.customizedDates.length; i++) {
          if (this.customizedDates[i].dates.indexOf(date) > -1)
            customizedClasses += ` asd__day--${this.customizedDates[i].cssClass}`
        }
      }
      return customizedClasses
    },
    isDisabled(date) {
      if (!this.selectable) return true
      return this.isDateDisabled(date) || this.isBeforeMinDate(date) || this.isAfterEndDate(date)
    },
    previousMonth() {
      this._armMonthTransitionFallback()
      this.startingDate = this.subtractMonths(this.months[0].firstDateOfMonth)

      this.months.unshift(this.getMonth(this.startingDate))
      this.months.splice(this.months.length - 1, 1)
      this.$emit('previous-month', this.visibleMonths)
      this.resetFocusedDate(false)
      this._scheduleReservationBadgePositionsUpdate()
    },
    nextMonth() {
      this._armMonthTransitionFallback()
      this.startingDate = this.addMonths(this.months[this.months.length - 1].firstDateOfMonth)
      this.months.push(this.getMonth(this.startingDate))
      this.months.splice(0, 1)
      this.$emit('next-month', this.visibleMonths)
      this.resetFocusedDate(true)
      this._scheduleReservationBadgePositionsUpdate()
    },
    subtractMonths(date) {
      return format(subMonths(date, 1), this.dateFormat)
    },
    addMonths(date) {
      return format(addMonths(date, 1), this.dateFormat)
    },
    toggleDatepicker() {
      if (this.showDatepicker) {
        this.closeDatepicker()
      } else {
        this.openDatepicker()
      }
    },
    updateMonth(offset, year, event) {
      this._armMonthTransitionFallback()
      const newMonth = event.target.value
      const monthIdx = this.monthNames.indexOf(newMonth)
      const newDate = setYear(setMonth(this.startingDate, monthIdx), year)
      this.startingDate = subMonths(newDate, offset)
      this.generateMonths()
      this._scheduleReservationBadgePositionsUpdate()
    },
    updateYear(offset, monthIdx, event) {
      this._armMonthTransitionFallback()
      const newYear = event.target.value
      const newDate = setYear(setMonth(this.startingDate, monthIdx), newYear)
      this.startingDate = subMonths(newDate, offset)
      this.generateMonths()
      this._scheduleReservationBadgePositionsUpdate()
    },
    openDatepicker() {
      this.positionDatepicker()
      this.setStartDates()
      if (this.triggerElement && this.triggerElement.classList) {
        this.triggerElement.classList.add('datepicker-open')
      }
      this.showDatepicker = true
      this.initialDate1 = this.dateOne
      this.initialDate2 = this.dateTwo
      this.$emit('opened')
      this.$nextTick(() => {
        if (!this.inline) this.setFocusedDate(this.focusedDate)
      })
    },
    closeDatepickerCancel() {
      if (this.showDatepicker) {
        this.selectedDate1 = this.initialDate1
        this.selectedDate2 = this.initialDate2
        this.emitSelectionChanged({ source: 'cancel' })
        this.emitHoverRangeChanged({ source: 'cancel' })
        this.$emit('cancelled')
        this.closeDatepicker()
      }
    },
    closeDatepicker() {
      if (this.inline) {
        return
      }
      this.showDatepicker = false
      this.showKeyboardShortcutsMenu = false
      if (this.triggerElement && this.triggerElement.classList) {
        this.triggerElement.classList.remove('datepicker-open')
      }
      this.$emit('closed')
    },
    openKeyboardShortcutsMenu() {
      this.showKeyboardShortcutsMenu = true
      const shortcutMenuCloseBtn = this.$refs && this.$refs['keyboard-shortcus-menu-close']
      this.$nextTick(() => {
        this.focusWithoutScroll(shortcutMenuCloseBtn)
      })
    },
    closeKeyboardShortcutsMenu() {
      this.showKeyboardShortcutsMenu = false
      this.$nextTick(() => this.setFocusedDate(this.focusedDate))
    },
    toggleKeyboardShortcutsMenu() {
      if (this.showKeyboardShortcutsMenu) this.closeKeyboardShortcutsMenu()
      else this.openKeyboardShortcutsMenu()
    },
    apply() {
      this.$emit('apply')
      this.closeDatepicker()
    },
    positionDatepicker() {
      if (!this.triggerElement) return
      const triggerWrapperElement = findAncestor(this.triggerElement, '.datepicker-trigger')
      this.triggerPosition = this.triggerElement.getBoundingClientRect()
      if (triggerWrapperElement) {
        this.triggerWrapperPosition = triggerWrapperElement.getBoundingClientRect()
      } else {
        this.triggerWrapperPosition = { left: 0, right: 0 }
      }

      const viewportWidth = document.documentElement.clientWidth || window.innerWidth
      this.viewportWidth = viewportWidth + 'px'
      this.isMobile = viewportWidth < 768
      this.isTablet = viewportWidth >= 768 && viewportWidth <= 1024
      // In inline mode, honor the requested months exactly (no responsive caps)
      if (this.inline) {
        this.showMonths = this.monthsToShow
      } else {
        this.showMonths = this.isMobile
          ? 1
          : this.isTablet && this.monthsToShow > 2
            ? 2
            : this.monthsToShow
      }

      this.$nextTick(() => {
        const datepickerWrapper = document.getElementById(this.wrapperId)
        if (!this.triggerElement || !datepickerWrapper) {
          return
        }

        const rightPosition =
          this.triggerElement.getBoundingClientRect().left +
          datepickerWrapper.getBoundingClientRect().width
        this.alignRight = rightPosition > viewportWidth
      })
    },
  },
}
</script>

<style lang="scss">
@use 'sass:math';
@use './../styles/transitions' as transitions;

$transition-time: 0.3s;

/* CSS variables: default (light) theme, scoped to the component */
.asd__wrapper {
  --asd-bg: #ffffff;
  --asd-text: #565a5c;
  --asd-selected: #00a699;
  --asd-selected-text: #ffffff;
  --asd-in-range: #66e2da;
  --asd-in-range-border: #33dacd;
  --asd-hovered-in-range: #67f6ee;
  --asd-disabled: #ffffff;
  --asd-border-color: rgba(0, 0, 0, 0.2);
  --asd-day-hover-bg: #e4e7e7;
  --asd-day-border: #e4e7e7;
  --asd-reservation-separator: #ffffff;
}

/* Manual dark theme override (opt-in) */
.asd__wrapper[data-theme='dark'] {
  --asd-bg: #1f1f1f;
  --asd-text: #e7e7e7;
  --asd-selected: #1db9aa;
  --asd-selected-text: #0b0b0b;
  --asd-in-range: #155e67;
  --asd-in-range-border: #2db9c8;
  --asd-hovered-in-range: #197f8b;
  --asd-disabled: #2a2a2a;
  --asd-border-color: rgba(255, 255, 255, 0.2);
  --asd-day-hover-bg: #2d2d2d;
  --asd-day-border: #3a3a3a;
  --asd-reservation-separator: #111111;
}

$tablet: 768px;
$border-normal: 1px solid var(--asd-border-color);
$border: 1px solid var(--asd-day-border);

.datepicker-trigger {
  position: relative;
  overflow: visible;
}

.asd {
  &__wrapper {
    border: $border-normal;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
    background-color: var(--asd-bg);
    color: var(--asd-text);

    *,
    *:after,
    *:before {
      box-sizing: border-box;
    }

    &--full-screen {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: none;
      z-index: 100;
    }
  }

  &__inner-wrapper {
    transition: all $transition-time ease;
    position: relative;
  }

  /* Inline mode: let months wrap based on container width */
  &__wrapper--inline {
    /* Allow normal wrapping semantics inside inline wrapper */
    white-space: normal;

    /* In inline mode, lay out the months in a flex row that wraps only when needed */
    .asd__inner-wrapper {
      margin-left: 0;
      /* ensure no offset in inline mode */
    }

    .asd__months-wrapper {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 2px 16px;
      /* compact spacing between months */
    }

    .asd__month {
      display: block;
      /* flex item; width comes from inline style (monthWidthStyles) */
      /* Do not stretch months; preserve month size and wrap only when necessary */
      flex: 0 0 auto;
    }

    .asd__month--hidden {
      display: none !important;
      /* don't reserve space for transition buffers */
      visibility: hidden;
      height: 0;
      padding: 0;
      margin: 0;
    }

    /* Make the keyboard shortcuts panel overlay on top of the calendar instead of reserving right-side area */
    .asd__keyboard-shortcuts-menu {
      left: 0 !important;
      right: auto;
      top: 0;
      bottom: auto;
      /* do not stretch full height */
      height: auto;
      max-height: 70vh;
      /* fit content, but cap sensibly */
      margin: 20px;
      /* keep some breathing room around the overlay */
    }
  }

  /* Auto-fit variant: months can grow to fill available row space before wrapping */
  &__wrapper--inline.asd__wrapper--auto-fit {
    .asd__months-wrapper {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 2px 16px;
    }

    .asd__month {
      flex: 1 1 var(--asd-month-min);
      min-width: var(--asd-month-min);
      max-width: 100%;
    }
  }

  &__datepicker-header {
    position: relative;
    /* keep header content away from the left/right month nav buttons */
    padding: 0 72px;

    @media (max-width: 600px) {
      padding: 0 20px;
    }
  }

  &__keyboard-shortcuts-trigger-wrapper {
    position: relative;
  }

  &__keyboard-shortcuts-trigger {
    background-color: transparent;
    cursor: pointer;
    position: absolute;
    bottom: 0px;
    right: 0px;
    font: inherit;
    border-width: 26px 33px 0px 0px;
    border-top: 26px solid transparent;
    border-right: 33px solid rgb(0, 166, 153);

    span {
      color: rgb(255, 255, 255);
      position: absolute;
      bottom: 0px;
      right: -28px;
    }
  }

  &__keyboard-shortcuts-show {
    display: block !important;
  }

  &__keyboard-shortcuts-close {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 7px;
    right: 5px;
    padding: 5px;
    z-index: 100;
    cursor: pointer;
    color: var(--asd-text);
  }

  &__keyboard-shortcuts-menu {
    display: none;
    position: absolute;
    top: 0px;
    bottom: auto;
    /* do not force full container height */
    right: 0px;
    z-index: 200;
    /* above month nav arrows (z-index: 30) */
    overflow: auto;
    background: var(--asd-bg);
    border-width: 1px;
    border-style: solid;
    border-color: var(--asd-border-color);
    border-image: initial;
    border-radius: 2px;
    padding: 22px;
    margin: 33px;
    text-align: left;
    height: auto;
    /* fit content */
    max-height: 70vh;
    /* clamp when content is long */
    color: var(--asd-text);
  }

  &__keyboard-shortcuts-title {
    font-size: 16px;
    font-weight: bold;
    margin: 0px;
  }

  &__keyboard-shortcuts-list {
    list-style: none;
    margin: 6px 0px;
    padding: 0px;
    white-space: initial;
  }

  &__keyboard-shortcuts-symbol {
    font-family: monospace;
    font-size: 12px;
    text-transform: uppercase;
    background: var(--asd-day-hover-bg);
    padding: 2px 6px;
    margin-right: 4px;
  }

  &__change-month-button {
    position: absolute;
    top: 12px;
    z-index: 30;
    background: var(--asd-bg);

    &--previous {
      left: 0;
      padding-left: 15px;
    }

    &--next {
      right: 0;
      padding-right: 15px;
    }

    >button {
      background-color: var(--asd-bg);
      border: $border;
      border-radius: 6px;
      padding: 6px 8px;
      height: 34px;
      width: 34px;
      cursor: pointer;

      &:hover {
        border: 1px solid #c4c4c4;
      }

      >svg {
        height: 19px;
        width: 19px;
        fill: var(--asd-text);
        opacity: 0.8;
      }
    }
  }

  &__days-legend {
    /* Ensure the weekday legend is visible in both popup and inline modes */
    position: relative;
    top: auto;
    left: auto;
    padding: 6px 10px 0;
  }

  &__day-title {
    display: inline-block;
    width: math.percentage(math.div(1, 7));
    text-align: center;
    margin-bottom: 4px;
    color: var(--asd-text);
    opacity: 0.7;
    font-size: 0.8em;
    margin-left: -1px;
  }

  /* Inline mode: keep day legends in the normal flow above months so they remain visible */
  &__wrapper--inline {
    .asd__days-legend {
      /* No special handling now that default uses relative positioning */
    }
  }

  &__month-table {
    border-collapse: collapse;
    border-spacing: 0;
    background: var(--asd-bg);
    width: 100%;
    max-width: 100%;
  }

  &__month {
    transition: all $transition-time ease;
    display: inline-block;
    /* default (popup) uses inline-block; inline mode overrides to flex item */
    padding: 15px;

    &--hidden {
      height: 275px;
      visibility: hidden;
    }
  }

  &__month-name {
    font-size: 1.05em;
    text-align: center;
    margin: 0 0 22px;
    line-height: 1.15em;
    font-weight: 600;
    color: var(--asd-text);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    min-width: 0;
    /* allow children to shrink inside flex */
  }

  &__month-year-select {
    &::-ms-expand {
      display: none;
    }

    -webkit-appearance: none;
    appearance: none;
    display: inline-block;
    min-width: 84px;
    max-width: 140px;
    padding: 6px 30px 6px 10px;
    border: 1px solid var(--asd-day-border);
    border-radius: 6px;
    background-color: var(--asd-bg);
    color: var(--asd-text);
    cursor: pointer;
    font-size: 0.98em;
    font-weight: 500;
    line-height: 1;
    position: relative;
    flex: 0 0 auto;
    box-sizing: border-box;
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: calc(100% - 14px) calc(50% - 2px),
    calc(100% - 9px) calc(50% - 2px);
    background-size: 6px 6px;
    background-repeat: no-repeat;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
    }
  }

  &__year-select {
    min-width: 64px;
    padding: 6px 28px 6px 10px;
    font-size: 0.95em;
  }

  &__day {
    $size: 38px;
    line-height: $size;
    height: $size;
    padding: 0;
    overflow: hidden;
    color: var(--asd-text);
    position: relative;

    /* anchor for reservation overlays */
    &--enabled {
      border: $border;

      &:hover {
        background-color: var(--asd-day-hover-bg);
      }

      &:focus {
        outline: auto 5px Highlight;
        outline: auto 5px -webkit-focus-ring-color;
      }
    }

    /* Disabled cells also carry --enabled class in markup; suppress focus ring there */
    &--enabled.asd__day--disabled:focus {
      outline: none !important;
    }

    &--disabled,
    &--empty {
      opacity: 0.5;

      button {
        cursor: default;
      }

      &:focus {
        outline: none !important;
      }
    }

    /* Keep booked days fully visible even when they are disabled for selection */
    &--disabled.asd__day--has-reservation {
      opacity: 1;
    }

    /* Keep active range visuals at full strength, even if the cell is disabled */
    &--disabled.asd__day--selected,
    &--disabled.asd__day--in-range,
    &--disabled.asd__day--hovered {
      opacity: 1;
    }

    /* Non-clickable reservation dates should never show click/selection border accents */
    &--disabled.asd__day--has-reservation.asd__day--selected,
    &--disabled.asd__day--has-reservation.asd__day--in-range,
    &--disabled.asd__day--has-reservation.asd__day--hovered {
      border: 1px solid transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }

    /* In read-only mode, keep full color/opacity even though the button is disabled */
    &--read-only {
      &.asd__day--disabled {
        opacity: 1;
      }
    }

    &--empty {
      border: none;
    }

    /* Outside days (from previous/next month) are slightly muted by default */
    &--outside {
      opacity: 0.6;
    }

    /* But if an outside day is also selected/in-range/hovered, show at full strength */
    &--outside.asd__day--selected,
    &--outside.asd__day--in-range,
    &--outside.asd__day--hovered {
      opacity: 1;
    }

    &--disabled {
      &:hover {
        background-color: transparent;
      }
    }

    &--selected {
      background: var(--asd-selected) !important;
      color: var(--asd-selected-text) !important;
      border: 1px double var(--asd-selected) !important;
    }

    &--in-range {
      background: var(--asd-selected) !important;
      color: var(--asd-selected-text) !important;
      border: 1px double var(--asd-selected) !important;
    }

    &--hovered {
      background: var(--asd-selected) !important;
      color: var(--asd-selected-text) !important;
      border: 1px double var(--asd-selected) !important;
    }

    /* Make today's number bold regardless of position */
    &--today {
      .asd__day-button {
        font-weight: 700;
      }
    }
  }

  /* Reservation overlay fill */
  &__reservation {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    transition: opacity 0.12s ease, filter 0.12s ease;
    /* only affect the fill, not borders */
  }

  &__reservation--middle {
    background: var(--resv-color);
  }

  &__reservation--single {
    background: var(--resv-color);
  }

  &__reservation--start {
    background: linear-gradient(
      135deg,
      transparent 49.2%,
      var(--asd-reservation-separator) 49.2% 50%,
      var(--resv-color) 50%
    );
  }

  &__reservation--end {
    background: linear-gradient(
      135deg,
      var(--resv-color) 0 50%,
      var(--asd-reservation-separator) 50% 50.8%,
      transparent 50.8%
    );
  }

  /* Group hover: when hovering a reserved day, dim all reservations and emphasize matching group */
  &__reservation--hover {
    opacity: 0.55;
    filter: saturate(0.9);
  }

  /* Emphasize only the colored fill for the hovered reservation; avoid any extra border glow */
  &__reservation--hover-match {
    opacity: 1;
    filter: saturate(1.05) brightness(1.03);
  }

  &__day-button {
    background: transparent;
    width: 100%;
    height: 100%;
    border: none;
    cursor: pointer;
    color: inherit;
    user-select: none;
    font-size: 15px;
    font-weight: inherit;
    padding: 4px;
    /* small padding gives room when aligning to corners */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    /* anchor for additional positioned content */
    /* In read-only mode, show default cursor to signal non-interactive */
    .asd__day--read-only & {
      cursor: default;
    }
  }

  /* Positioning variants for day content inside the cell */
  &__daypos--center {
    align-items: center;
    justify-content: center;
  }

  &__daypos--top-left {
    align-items: flex-start;
    justify-content: flex-start;
  }

  &__daypos--top-right {
    align-items: flex-start;
    justify-content: flex-end;
  }

  &__daypos--bottom-left {
    align-items: flex-end;
    justify-content: flex-start;
  }

  &__daypos--bottom-right {
    align-items: flex-end;
    justify-content: flex-end;
  }

  /* Slightly smaller type when pinned to a corner */
  &__daypos--top-left,
  &__daypos--top-right,
  &__daypos--bottom-left,
  &__daypos--bottom-right {
    font-size: 12px;
  }

  /* Additional content (day-extra slot) */
  &__day-extra {
    position: absolute;
    pointer-events: none;
    /* keep clicks for the day button */
    color: inherit;
    line-height: 1;
    font-size: 13px;
    opacity: 0.9;
  }

  /* Floating once-per-reservation layer */
  &__reservation-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: visible;
    z-index: 2;
    /* above overlays and cells */
    transition: opacity $transition-time ease;
  }

  &__reservation-layer--transitioning {
    opacity: 0;
    pointer-events: none;
  }

  &__reservation-floating {
    position: absolute;
    transform: translate(-50%, -50%);
    max-width: 90%;
    white-space: nowrap;
    pointer-events: auto;
    /* allow clicking the floating badge */
    cursor: pointer;
  }

  &__reservation-floating.asd__badge--start {
    transform: translate(0, -50%);
  }

  &__reservation-floating.asd__badge--center {
    transform: translate(-50%, -50%);
  }

  .asd__reservation-chip {
    display: inline-block;
    color: #fff;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    line-height: 1.1;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08) inset;
  }

  /* Optional badge container for reservation-badge slot */
  &__reservation-badge {
    position: absolute;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
    z-index: 1;
    /* above overlay, below any focus ring */
    max-width: 96%;
    pointer-events: none;
    /* keep clicks for the day button by default */
    color: inherit;
  }

  &__extrapos--center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__extrapos--top {
    top: 3px;
    left: 50%;
    transform: translateX(-50%);
  }

  &__extrapos--bottom {
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
  }

  &__extrapos--left {
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__extrapos--right {
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__action-buttons {
    min-height: 50px;
    padding-top: 10px;
    margin-bottom: 12px;

    button {
      color: var(--asd-text);
      display: block;
      position: relative;
      background: transparent;
      border: none;
      font-weight: bold;
      font-size: 15px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      &:nth-child(1) {
        float: left;
        left: 15px;
      }

      &:nth-child(2) {
        float: right;
        right: 15px;
      }
    }
  }

  &__mobile-header {
    border-bottom: $border-normal;
    position: relative;
    padding: 15px 15px 15px 15px !important;
    text-align: center;
    height: 50px;

    h3 {
      font-size: 20px;
      margin: 0;
    }
  }

  &__mobile-only {
    display: none;

    @media (max-width: 600px) {
      display: block;
    }
  }

  &__mobile-close {
    border: none;
    position: absolute;
    top: 7px;
    right: 5px;
    padding: 5px;
    z-index: 100;
    cursor: pointer;

    &__icon {
      position: relative;
      font-size: 1.6em;
      font-weight: bold;
      padding: 0;
    }
  }
}
</style>

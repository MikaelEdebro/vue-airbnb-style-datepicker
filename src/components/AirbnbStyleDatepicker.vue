<template>
<transition name="fade">
  <div
    id="datepicker-wrapper"
    class="datepicker-wrapper"
    v-if="showDatepicker"
    :class="wrapperClasses"
    :style="showFullscreen ? undefined : wrapperStyles"
    v-click-outside="closeDatepicker"
  >
    <div class="mobile-header mobile-only" v-if="showFullscreen">
      <div class="mobile-close" @click="closeDatepicker">
        <div class="icon">X</div>
      </div>
      <h3>{{mobileHeader}}</h3>
    </div>
    <div class="datepicker-header">
      <div class="change-month-button previous">
        <button @click="previousMonth">
          <svg viewBox="0 0 1000 1000"><path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"></path></svg>
        </button>
      </div>
      <div class="change-month-button next">
        <button @click="nextMonth">
          <svg viewBox="0 0 1000 1000"><path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path></svg>
        </button>
      </div>

      <div class="days-legend" v-for="(month, index) in showMonths" :key="month" :style="[monthWidthStyles, {left: (width * index) + 'px'}]">
        <div class="day-title" v-for="day in daysShort" :key="day">{{day}}</div>
      </div>
    </div>

    <div class="datepicker-inner-wrapper" :style="innerStyles">
      <transition-group name="list-complete" tag="div">
        <div
          v-for="month in months"
          :key="month.firstDateOfMonth"
          class="month"
          :style="monthWidthStyles"
        >
          <div class="month-name">{{ month.monthName }} {{month.year}}</div>

          <table class="month-table" role="presentation">
            <tbody>
              <tr class="week" v-for="(week, index) in month.weeks" :key="index">
                <td
                  class="day"
                  v-for="({fullDate, dayNumber}, index) in week"
                  :key="index + '_' + dayNumber"
                  :class="{
                    enabled: dayNumber !== 0,
                    empty: dayNumber === 0,
                    disabled: (isBeforeMinDate(fullDate) || isAfterEndDate(fullDate)),
                    selected: selectedDate1 === fullDate || selectedDate2 === fullDate,
                    'in-range': isInRange(fullDate)
                  }"
                  :style="{
                    background: isSelected(fullDate) ? colors.selected : isInRange(fullDate) ? colors.inRange : 'white',
                    color: isSelected(fullDate) ? colors.selectedText : isInRange(fullDate) ? colors.selectedText : colors.text,
                    border: isSelected(fullDate)
                      ? '1px double ' + colors.selected
                      : (isInRange(fullDate) && allDatesSelected) ? '1px double ' + colors.inRangeBorder : ''
                  }"
                  @mouseover="() => { setHoverDate(fullDate) }"
                >
                  <button class="day-button" v-if="dayNumber" :date="fullDate" @click="() => { selectDate(fullDate) }">{{dayNumber}}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition-group>
    </div>
    <div class="action-buttons" v-if="mode !== 'single'">
      <button @click="closeDatepicker">{{texts.cancel}}</button>
      <button @click="closeDatepicker" :style="{color: colors.selected}">{{texts.apply}}</button>
    </div>
  </div>
</transition>
</template>

<script>
import format from 'date-fns/format'
import subMonths from 'date-fns/sub_months'
import addMonths from 'date-fns/add_months'
import getDaysInMonth from 'date-fns/get_days_in_month'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
import { debounce, copyObject } from './../helpers'

export default {
  name: 'airbnb-style-datepicker',
  created() {
    this.setupDatepicker()

    if (this.sundayFirst) {
      this.setSundayToFirstDayInWeek()
    }
    window.addEventListener('resize', debounce(this.positionDatepicker, 200))

    window.addEventListener('click', event => {
      if (event.target.id === this.triggerElementId) {
        event.stopPropagation()
        event.preventDefault()
        this.toggleDatepicker()
      }
    })
  },
  mounted() {
    this.setStartDates()

    for (let i = 0; i < this.showMonths + 2; i++) {
      this.months.push(this.getMonth(this.startingDate))
      this.startingDate = this.addMonths(this.startingDate)
    }

    if (this.startOpen || this.inline) {
      this.openDatepicker()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.positionDatepicker)
  },
  props: {
    triggerElementId: { type: String },
    dateOne: { type: [String, Date], default: format(new Date()) },
    dateTwo: { type: [String, Date] },
    minDate: { type: [String, Date] },
    endDate: { type: [String, Date] },
    mode: { type: String, default: 'range' },
    dateFormat: { type: String, default: 'YYYY-MM-DD' },
    offset: { type: Number, default: 0 },
    monthsToShow: { type: Number, default: 2 },
    startOpen: { type: Boolean },
    fullscreenMobile: { type: Boolean },
    inline: { type: Boolean },
    mobileHeader: { type: String, default: 'Select date' }
  },
  data() {
    return {
      showDatepicker: false,
      showMonths: 2,
      colors: {
        selected: '#00a699',
        inRange: '#66e2da',
        selectedText: '#fff',
        text: '#565a5c',
        inRangeBorder: '#00a699'
      },
      sundayFirst: false,
      days: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      daysShort: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      texts: {
        apply: 'Apply',
        cancel: 'Cancel'
      },
      startingDate: '',
      months: [],
      width: 300,
      selectedDate1: '',
      selectedDate2: '',
      isSelectingDate1: true,
      hoverDate: '',
      alignRight: false,
      triggerPosition: {}
    }
  },
  computed: {
    wrapperClasses() {
      return {
        'full-screen': this.showFullscreen,
        inline: this.inline
      }
    },
    wrapperStyles() {
      return {
        position: this.inline ? 'relative' : 'absolute',
        top: this.inline
          ? '0'
          : this.triggerPosition.height + this.offset + 'px',
        left: !this.alignRight ? '0' : '',
        right: this.alignRight ? '0' : '',
        width: this.width * this.showMonths + 'px',
        zIndex: this.inline ? '0' : '100',
        paddingBottom: this.inline ? '0' : '30px'
      }
    },
    innerStyles() {
      return {
        'margin-left': this.showFullscreen
          ? '-' + this.$viewportWidth
          : `-${this.width}px`
      }
    },
    monthWidthStyles() {
      return {
        width: this.showFullscreen ? this.$viewportWidth : this.width + 'px'
      }
    },
    showFullscreen() {
      return this.$isMobile && this.fullscreenMobile
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
    datepickerWidth() {
      return this.width * this.showMonths
    }
  },
  methods: {
    setupDatepicker() {
      if (this.$options.sundayFirst) {
        this.sundayFirst = copyObject(this.$options.sundayFirst)
      }
      if (this.$options.colors) {
        this.colors = copyObject(this.$options.colors)
      }
      if (this.$options.days) {
        this.days = copyObject(this.$options.days)
      }
      if (this.$options.daysShort) {
        this.daysShort = copyObject(this.$options.daysShort)
      }
      if (this.$options.texts) {
        this.texts = copyObject(this.$options.texts)
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
    },
    setSundayToFirstDayInWeek() {
      let lastDay = this.days.pop()
      this.days.unshift(lastDay)
      let lastDayShort = this.daysShort.pop()
      this.daysShort.unshift(lastDayShort)
    },
    getMonth(date) {
      const firstDateOfMonth = format(date, 'YYYY-MM-01')
      const year = format(date, 'YYYY')
      const monthName = format(date, 'MMMM')
      const monthNumber = parseInt(format(date, 'M'))

      return {
        year,
        firstDateOfMonth,
        monthName,
        monthNumber,
        weeks: this.getWeeks(firstDateOfMonth)
      }
    },
    getWeeks(date) {
      const weekDayNotInMonth = { dayNumber: 0 }
      const daysInMonth = getDaysInMonth(date)
      const year = format(date, 'YYYY')
      const month = format(date, 'MM')
      const firstDayName = format(date, 'dddd')
      const skipDaysUntilFirstInMonth = this.days.findIndex(
        day => day === firstDayName
      )
      let weeks = []
      let week = []

      // add empty days to get first day in correct position
      for (let s = 0; s < skipDaysUntilFirstInMonth; s++) {
        week.push(weekDayNotInMonth)
      }
      for (let d = 0; d < daysInMonth; d++) {
        let isLastDayInMonth = d >= daysInMonth - 1
        let dayNumber = d + 1
        let dayNumberFull = dayNumber < 10 ? '0' + dayNumber : dayNumber
        week.push({
          dayNumber,
          dayNumberFull: dayNumberFull,
          fullDate: year + '-' + month + '-' + dayNumberFull
        })

        if (week.length === 7) {
          weeks.push(week)
          week = []
        } else if (isLastDayInMonth) {
          for (let i = 0; i < 7 - week.length; i++) {
            week.push(weekDayNotInMonth)
          }
          weeks.push(week)
          week = []
        }
      }
      return weeks
    },
    selectDate(date) {
      if (this.isBeforeMinDate(date) || this.isAfterEndDate(date)) {
        return
      }

      if (this.mode === 'single') {
        this.selectedDate1 = date
        this.closeDatepicker()
        return
      }

      if (this.isSelectingDate1 || isBefore(date, this.selectedDate1)) {
        this.selectedDate1 = date
        this.isSelectingDate1 = false

        if (isBefore(this.selectedDate2, date)) {
          this.selectedDate2 = ''
        }
      } else {
        this.selectedDate2 = date
        this.isSelectingDate1 = true

        if (isAfter(this.selectedDate1, date)) {
          this.selectedDate1 = ''
        }
      }
    },
    setHoverDate(date) {
      this.hoverDate = date
    },
    isSelected(date) {
      if (!date) {
        return
      }
      return this.selectedDate1 === date || this.selectedDate2 === date
    },
    isInRange(date) {
      if (!this.allDatesSelected || this.isSingleMode) {
        return false
      }

      return (
        (isAfter(date, this.selectedDate1) &&
          isBefore(date, this.selectedDate2)) ||
        (isAfter(date, this.selectedDate1) &&
          isBefore(date, this.hoverDate) &&
          !this.allDatesSelected)
      )
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
    previousMonth() {
      this.startingDate = this.subtractMonths(this.months[0].firstDateOfMonth)

      this.months.unshift(this.getMonth(this.startingDate))
      this.months.splice(this.months.length - 1, 1)
    },
    nextMonth() {
      this.startingDate = this.addMonths(
        this.months[this.months.length - 1].firstDateOfMonth
      )
      this.months.push(this.getMonth(this.startingDate))

      setTimeout(() => {
        this.months.splice(0, 1)
      }, 100)
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
    openDatepicker() {
      this.getStartingPosition()
      this.setStartDates()
      this.showDatepicker = true
    },
    closeDatepicker() {
      if (this.inline) {
        return
      }
      this.showDatepicker = false
    },
    getStartingPosition() {
      const triggerElement = document.getElementById(this.triggerElementId)
      this.triggerPosition = triggerElement.getBoundingClientRect()

      setTimeout(() => {
        this.positionDatepicker()
      }, 0)
    },
    positionDatepicker() {
      const viewPortWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      )
      const isMobile = viewPortWidth < 768
      const isTablet = viewPortWidth >= 768 && viewPortWidth <= 1024
      this.showMonths = isMobile
        ? 1
        : isTablet && this.monthsToShow > 2 ? 2 : this.monthsToShow

      this.$nextTick(function() {
        const triggerElement = document.getElementById(this.triggerElementId)
        const datepickerWrapper = document.getElementById('datepicker-wrapper')
        if (!triggerElement || !datepickerWrapper) {
          return
        }

        const rightPosition =
          triggerElement.getBoundingClientRect().left +
          datepickerWrapper.getBoundingClientRect().width
        this.alignRight = rightPosition > viewPortWidth
      })
    }
  },
  watch: {
    selectedDate1(newValue, oldValue) {
      let newDate =
        !newValue || newValue === '' ? '' : format(newValue, this.dateFormat)
      this.$emit('dateOneSelected', newDate)
    },
    selectedDate2(newValue, oldValue) {
      let newDate =
        !newValue || newValue === '' ? '' : format(newValue, this.dateFormat)
      this.$emit('dateTwoSelected', newDate)
    },
    mode(newValue, oldValue) {
      this.setStartDates()
    }
  }
}
</script>

<style lang="scss" src="./../styles/datepicker.scss"></style>

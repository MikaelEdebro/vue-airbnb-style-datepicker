<template>
  <transition name="asd__fade">
    <div
      :id="wrapperId"
      class="asd__wrapper"
      v-show="showMonthpicker"
      :class="wrapperClasses"
      :style="showFullscreen ? undefined : wrapperStyles"
      v-click-outside="handleClickOutside"
    >
      <div class="asd__mobile-header asd__mobile-only" v-if="showFullscreen">
        <div class="asd__mobile-close" @click="closeMonthpicker">
          <div class="asd__mobile-close-icon">X</div>
        </div>
        <h3>{{ mobileHeader }}</h3>
      </div>
      <div class="asd__monthpicker-header">
        <div class="asd__change-year-button asd__change-year-button--previous">
          <button @click="previousYear" type="button">
            <svg viewBox="0 0 1000 1000"><path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z" /></svg>
          </button>
        </div>
        <div class="asd__change-year-button asd__change-year-button--next">
          <button @click="nextYear" type="button">
            <svg viewBox="0 0 1000 1000"><path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z" /></svg>
          </button>
        </div>

        <div class="asd__inner-wrapper" :style="innerStyles">
          <transition-group name="asd__list-complete" tag="div">
            <div
              v-for="(year,yearIndex) in years"
              :key="year.name"
              class="asd__month"
              :class="{hidden: yearIndex === 0 || yearIndex > showYears}"
              :style="yearWidthStyles"
            >
              <div class="asd__year-name">{{ year.name }}</div>
              <div class="asd__months-list">
                <div
                  class="asd__month-item"
                  v-for="month in year.months"
                  :key="`${year.name}-${month.name}`"
                  :class="{
                    'asd__month-item--disabled': isDisabled(month),
                    'asd__month-item--enabled' : !isDisabled(month),
                    'asd__month-item--selected': isSameMonth(selectedDate1 , month.firstDay) || isSameMonth(selectedDate2 , month.lastDay),
                    'asd__month-item--in-range': isInRange(month)
                  }"
                  :style="getMonthStyles(month)"
                  @mouseover="() => { setHoverMonth(month) }"
                >
                  <button
                    class="asd__month-button"
                    type="button"
                    :disabled="isDisabled(month)"
                    @click="() => { selectMonth(month) }"
                    :class="{
                      'asd__month-item--disabled': isDisabled(month),
                      'asd__month-item--enabled' : !isDisabled(month),
                      'asd__month-item--selected': isSameMonth(selectedDate1 , month.firstDay) || isSameMonth(selectedDate2 , month.lastDay),
                      'asd__month-item--in-range': isInRange(month)
                    }"
                    :data-date="month.firstDay"
                    v-if="isMobile"
                  >{{ month.shortName }}</button>
                  <button
                    class="asd__month-button"
                    type="button"
                    :disabled="isDisabled(month)"
                    @click="() => { selectMonth(month) }"
                    :data-date="month.firstDay"
                    :class="{
                      'asd__month-button--disabled': isDisabled(month),
                      'asd__month-button--enabled' : !isDisabled(month),
                    }"
                    v-else
                  >{{ month.name }}</button>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
        <div class="asd__action-buttons" v-if="mode !== 'single' && showActionButtons">
          <button @click="closeMonthpickerCancel" type="button">{{ texts.cancel }}</button>
          <button @click="apply" :style="{color: colors.selected}" type="button">{{ texts.apply }}</button>
        </div>
      </div>
  </div></transition>
</template>

<script>
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import isSameMonth from 'date-fns/is_same_month'
import lastDayOfMonth from 'date-fns/last_day_of_month'
import startOfMonth from 'date-fns/start_of_month'
import subMonths from 'date-fns/sub_months'
import subYears from 'date-fns/sub_years'
import addMonths from 'date-fns/add_months'
import addYears from 'date-fns/add_years'
import setMonth from 'date-fns/set_month'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
import isValid from 'date-fns/is_valid'
import { debounce, copyObject, findAncestor, randomString } from './../helpers'

export default {
  name: 'AirbnbStyleMonthpicker',
  props: {
    triggerElementId: { type: String },
    monthOne: { type: [String, Date], default: '' },
    monthTwo: { type: [String, Date], default: '' },
    minDate: { type: [String, Date] },
    maxDate: { type: [String, Date] },
    mode: { type: String, default: 'range' },
    offsetY: { type: Number, default: 0 },
    offsetX: { type: Number, default: 0 },
    yearsToShow: { type: Number, default: 2 },
    startOpen: { type: Boolean },
    fullscreenMobile: { type: Boolean },
    inline: { type: Boolean },
    mobileHeader: { type: String, default: 'Select date' },
    disabledDates: { type: Array, default: () => [] },
    disabledMonths: { type: Array, default: () => [] },
    showActionButtons: { type: Boolean, default: true },
    isTest: {
      type: Boolean,
      default: () => process.env.NODE_ENV === 'test'
    },
    trigger: { type: Boolean, default: false }
  },
  data() {
    return {
      wrapperId: 'airbnb-style-monthpicker-wrapper-' + randomString(5),
      monthFormat: 'MMMM-YYYY',
      showMonthpicker: false,
      showYears: 2,
      colors: {
        selected: '#00a699',
        inRange: '#66e2da',
        selectedText: '#fff',
        text: '#565a5c',
        inRangeBorder: '#33dacd',
        disabled: '#fff'
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
        'December'
      ],
      monthNamesShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      texts: {
        apply: 'Apply',
        cancel: 'Cancel'
      },
      startingYear: '',
      years: [],
      width: 300,
      selectedDate1: '',
      selectedDate2: '',
      isSelectingDate1: true,
      hoverMonth: '',
      alignRight: false,
      triggerPosition: {},
      triggerWrapperPosition: {},
      viewportWidth: window.innerWidth + 'px',
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth <= 1024,
      triggerElement: undefined
    }
  },
  computed: {
    wrapperClasses() {
      return {
        'asd__wrapper--monthpicker-open': this.showMonthpicker,
        'asd__wrapper--full-screen': this.showFullscreen,
        'asd__wrapper--inline': this.inline
      }
    },
    wrapperStyles() {
      return {
        position: this.inline ? 'static' : 'absolute',
        top: this.inline
          ? '0'
          : this.triggerPosition.height + this.offsetY + 'px',
        left: !this.alignRight
          ? this.triggerPosition.left -
        this.triggerWrapperPosition.left +
        this.offsetX +
        'px'
          : '',
        right: this.alignRight
          ? this.triggerWrapperPosition.right -
        this.triggerPosition.right +
        this.offsetX +
        'px'
          : '',
        width: this.width * this.showYears + 'px',
        zIndex: this.inline ? '0' : '100'
      }
    },
    innerStyles() {
      return {
        'margin-left': this.showFullscreen
          ? '-' + this.viewportWidth
          : `-${this.width}px`
      }
    },
    monthWidthStyles() {
      return {
        width: this.showFullscreen ? this.viewportWidth : this.width + 'px'
      }
    },
    yearWidthStyles() {
      return {
        width: this.showFullscreen ? this.viewportWidth : this.width + 'px'
      }
    },
    showFullscreen() {
      return this.isMobile && this.fullscreenMobile
    },
    monthsSelected() {
      return !!(
        (this.selectedDate1 && this.selectedDate1 !== '') ||
        (this.selectedDate2 && this.selectedDate2 !== '')
      )
    },
    allMonthsSelected() {
      if (this.isSingleMode) {
        return !!(this.selectedDate1 &&
          this.selectedDate !== '')
      }
      return !!(
        this.selectedDate1 &&
        this.selectedDate1 !== '' &&
        this.selectedDate2 &&
        this.selectedDate2 !== '' &&
        !isSameMonth(this.selectedDate2, this.selectedDate1)
      )
    },
    hasMinDate() {
      return !!(this.minDate && this.minDate !== '')
    },
    hasMinYear() {
      return !!(this.minYear && this.minYear !== '')
    },
    isRangeMode() {
      return this.mode === 'range'
    },
    isSingleMode() {
      return this.mode === 'single'
    },
    monthpickerWidth() {
      return this.width * this.showYears
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
    }
  },
  watch: {
    selectedDate1(value) {
      this.$emit('date-one-selected', value)
    },
    selectedDate2(value) {
      this.$emit('date-two-selected', value)
    },
    mode(newValue, oldValue) {
      this.setStartMonths()
    },
    datePropsCompound(newValue) {
      if (this.dateOne !== this.selectedDate1) {
        this.startingYear = this.dateOne
        // this.setStartMonths()
        this.generateYears()
      }
      if (this.isDateTwoBeforeDateOne) {
        this.selectedDate2 = ''
        this.$emit('date-two-selected', '')
      }
    },
    trigger(newValue, oldValue) {
      if (newValue) {
        this.openMonthpicker()
      }
    }
  },
  created() {
    this.setupMonthpicker()

    this._handleWindowResizeEvent = debounce(() => {
      this.positionMonthpicker()
      this.setStartMonths()
    }, 200)
    this._handleWindowClickEvent = event => {
      if (event.target.id === this.triggerElementId) {
        event.stopPropagation()
        event.preventDefault()
        this.toggleMonthpicker()
      }
    }
    window.addEventListener('resize', this._handleWindowResizeEvent)
    window.addEventListener('click', this._handleWindowClickEvent)
  },
  mounted() {
    this.triggerElement = this.isTest
      ? document.createElement('input')
      : document.getElementById(this.triggerElementId)

    this.setStartMonths()
    this.generateYears()

    if (this.startOpen || this.inline) {
      this.openMonthpicker()
    }

    this.triggerElement.addEventListener('keyup', this.handleTriggerInput)
  },
  destroyed() {
    window.removeEventListener('resize', this._handleWindowResizeEvent)
    window.removeEventListener('click', this._handleWindowClickEvent)

    this.triggerElement.removeEventListener('keyup', this.handleTriggerInput)
  },
  methods: {
    isSameMonth(month1, month2) {
      return isSameMonth(month1, month2)
    },
    getMonthStyles(month) {
      const isSelected = this.isSelected(month)
      const isInRange = this.isInRange(month)
      const isDisabled = this.isDisabled(month)

      let styles = {
        width: (this.width - 30) / 7 + 'px',
        background: isSelected
          ? this.colors.selected
          : isInRange ? this.colors.inRange : '',
        color: isSelected
          ? this.colors.selectedText
          : isInRange ? this.colors.selectedText : this.colors.text,
        border: isSelected
          ? '1px double ' + this.colors.selected
          : isInRange && this.allMonthsSelected
            ? '1px double ' + this.colors.inRangeBorder
            : ''
      }
      if (isDisabled) {
        styles.background = this.colors.disabled
      }
      return styles
    },
    handleClickOutside(event) {
      if (
        event.target.id === this.triggerElementId ||
        !this.showMonthpicker ||
        this.inline
      ) {
        return
      }
      this.closeMonthpicker()
    },
    handleTriggerInput(event) {
      const keys = {
        arrowDown: 40,
        arrowUp: 38,
        arrowRight: 39,
        arrowLeft: 37
      }
      if (
        event.keyCode === keys.arrowDown &&
      !event.shiftKey &&
      !this.showMonthpicker
      ) {
        this.openMonthpicker()
      } else if (
        event.keyCode === keys.arrowUp &&
    !event.shiftKey &&
    this.showMonthpicker
      ) {
        this.closeMonthpicker()
      } else if (
        event.keyCode === keys.arrowRight &&
    !event.shiftKey &&
    this.showMonthpicker
      ) {
        this.nextMonth()
      } else if (
        event.keyCode === keys.arrowLeft &&
    !event.shiftKey &&
    this.showMonthpicker
      ) {
        this.previousMonth()
      } else {
        if (this.mode === 'single') {
          this.setMonthFromText(event.target.value)
        }
      }
    },
    setMonthFromText(value) {
      if (value.length < 10) {
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
        value = `${value.substring(6, 10)}-${value.substring(
          3,
          5
        )}-${value.substring(0, 2)}`
      }
      const valueAsDateObject = new Date(value)
      if (!isValid(valueAsDateObject)) {
        return
      }
      const formattedDate = format(valueAsDateObject, this.monthFormat)
      if (
        this.isDateDisabled(formattedDate) ||
        this.isBeforeMinDate(formattedDate) ||
        this.isAfterMaxDate(formattedDate)
      ) {
        return
      }
      this.startingYear = subYears(formattedDate, 1)
      this.generateYears()
      let d = new Date(value)
      let m = this.getMonthData(d.getMonth(), value)
      this.selectMonth(m)
    },
    generateYears() {
      this.years = []
      for (let i = 0; i < this.showYears + 2; i++) {
        this.years.push(this.getYear(this.startingYear))
        this.startingYear = this.addYears(this.startingYear)
      }
    },
    getYear(date) {
      const name = date.getFullYear()

      return {
        name,
        months: this.getMonths(date)
      }
    },
    getMonths(date) {
      const months = []
      for (let month = 0; month < 12; month += 1) {
        let data = this.getMonthData(month, date)
        months.push(data)
      }
      return months
    },
    getMonthData(monthNumber, date) {
      return {
        shortName: this.monthNamesShort[monthNumber],
        name: this.monthNames[monthNumber],
        firstDay: startOfMonth(setMonth(date, monthNumber)),
        lastDay: lastDayOfMonth(setMonth(date, monthNumber))

      }
    },
    setupMonthpicker() {
      if (this.$options.colors) {
        const colors = copyObject(this.$options.colors)
        this.colors.selected = colors.selected || this.colors.selected
        this.colors.inRange = colors.inRange || this.colors.inRange
        this.colors.selectedText =
      colors.selectedText || this.colors.selectedText
        this.colors.text = colors.text || this.colors.text
        this.colors.inRangeBorder =
      colors.inRangeBorder || this.colors.inRangeBorder
        this.colors.disabled = colors.disabled || this.colors.disabled
      }
      if (this.$options.monthNames && this.$options.monthNames.length === 12) {
        this.monthNames = copyObject(this.$options.monthNames)
      }
      if (this.$options.texts) {
        const texts = copyObject(this.$options.texts)
        this.texts.apply = texts.apply || this.texts.apply
        this.texts.cancel = texts.cancel || this.texts.cancel
      }
    },
    setStartMonths() {
      let startYear
      if (this.monthOne !== '') {
        startYear = startOfMonth(this.monthOne)
      } else {
        startYear = startOfMonth(new Date())
      }
      if (this.hasMinDate && isBefore(startYear, this.minDate)) {
        startYear = startOfMonth(this.minDate)
      }
      this.startingYear = this.subtractYears(parse(startYear))

      if (this.isSingleMode) {
        if (this.monthOne && this.monthOne !== '') {
          this.selectedDate1 = startOfMonth(this.monthOne)
          this.selectedDate2 = lastDayOfMonth(this.monthOne)
        } else {
          this.selectedDate1 = ''
          this.selectedDate2 = ''
        }
      } else {
        if (this.monthOne && this.monthOne !== '') {
          this.selectedDate1 = startOfMonth(this.monthOne)
        } else {
          this.selectedDate1 = ''
        }
        if (this.monthTwo && this.monthTwo !== '') {
          this.selectedDate2 = lastDayOfMonth(this.monthTwo)
        } else {
          this.selectedDate2 = ''
        }
      }
    },

    selectMonth(month) {
      if (
        this.isBeforeMinDate(month.firstDay) ||
      this.isAfterMaxDate(month.firstDay) ||
      this.isDateDisabled(month.firstDay)) {
        return
      }

      if (this.mode === 'single') {
        this.selectedDate1 = month.firstDay
        this.selectedDate2 = month.lastDay
        this.closeMonthpicker()
        return
      }

      if (this.isSelectingDate1 || isBefore(month.firstDay, this.selectedDate1)) {
        this.selectedDate1 = month.firstDay
        this.isSelectingDate1 = false

        if (isBefore(this.selectedDate2, month.lastDay)) {
          this.selectedDate2 = ''
        }
      } else {
        this.selectedDate2 = month.lastDay
        this.isSelectingDate1 = true

        if (isAfter(this.selectedDate1, month.lastDay)) {
          this.selectedDate1 = ''
        }
      }
    },
    setHoverMonth(month) {
      this.hoverMonth = month.firstDay
    },
    isSelected(month) {
      if (!month) {
        return
      }
      return isSameMonth(this.selectedDate1, month.firstDay) || isSameMonth(this.selectedDate2, month.firstDay)
    },
    isInRange(month) {
      if (!this.allMonthsSelected || this.isSingleMode) {
        return false
      }
      return (
        (isAfter(month.firstDay, this.selectedDate1) &&
      isBefore(month.lastDay, this.selectedDate2)) ||
    (isAfter(month.firstDay, this.selectedDate1) &&
      isBefore(month.firstDay, this.hoverMonth) &&
      !this.allMonthsSelected)
      )
    },
    isBeforeMinDate(month) {
      if (!this.minDate) {
        return false
      }
      return isBefore(month.lastDay, this.minDate)
    },
    isAfterMaxDate(month) {
      if (!this.maxDate) {
        return false
      }
      return isAfter(month.firstDay, this.maxDate)
    },
    isDateDisabled(date) {
      const isDisabled = this.disabledDates.indexOf(date) > -1
      return isDisabled
    },
    isMonthDisabled(month) {
      for (var i = this.disabledMonths.length - 1; i >= 0; i--) {
        if (isSameMonth(month.firstDay, this.disabledMonths[i])) { return true }
      }
      return false
    },
    isDisabled(month) {
      return (
        this.isMonthDisabled(month) ||
    this.isBeforeMinDate(month) ||
    this.isAfterMaxDate(month)
      )
    },
    previousYear() {
      this.startingYear = this.subtractYears(this.years[0].months[0].firstDay)

      this.years.unshift(this.getYear(this.startingYear))
      this.years.splice(this.years.length - 1, 1)
    },
    nextYear() {
      this.startingYear = this.addYears(
        this.years[this.years.length - 1].months[0].firstDay)
      this.years.push(this.getYear(this.startingYear))

      setTimeout(() => {
        this.years.splice(0, 1)
      }, 100)
    },
    subtractYears(date) {
      return subYears(date, 1)
    },
    subtractMonths(date) {
      return subMonths(date, 1)
    },
    addMonths(date) {
      return addMonths(date, 1)
    },
    addYears(date) {
      return addYears(date, 1)
    },
    toggleMonthpicker() {
      if (this.showMonthpicker) {
        this.closeMonthpicker()
      } else {
        this.openMonthpicker()
      }
    },
    openMonthpicker() {
      this.positionMonthpicker()
      this.setStartMonths()
      // this.generateYears()
      this.triggerElement.classList.add('monthpicker-open')
      this.showMonthpicker = true
      this.initialDate1 = this.dateOne
      this.initialDate2 = this.dateTwo
    },
    closeMonthpickerCancel() {
      if (this.showMonthpicker) {
        this.selectedDate1 = this.initialDate1
        this.selectedDate2 = this.initialDate2
        this.closeMonthpicker()
      }
    },
    closeMonthpicker() {
      if (this.inline) {
        return
      }
      this.showMonthpicker = false
      this.triggerElement.classList.remove('monthpicker-open')
      this.$emit('closed')
    },
    apply() {
      const datesSelected = {
        dateOne: this.selectedDate1,
        dateTwo: this.selectedDate2
      }
      this.$emit('apply', datesSelected)
      this.closeMonthpicker()
    },
    positionMonthpicker() {
      const triggerWrapperElement = findAncestor(
        this.triggerElement,
        '.monthpicker-trigger'
      )
      this.triggerPosition = this.triggerElement.getBoundingClientRect()
      if (triggerWrapperElement) {
        this.triggerWrapperPosition = triggerWrapperElement.getBoundingClientRect()
      } else {
        this.triggerWrapperPosition = { left: 0, right: 0 }
      }

      const viewportWidth =
  document.documentElement.clientWidth || window.innerWidth
      this.viewportWidth = viewportWidth + 'px'
      this.isMobile = viewportWidth < 768
      this.isTablet = viewportWidth >= 768 && viewportWidth <= 1024
      this.showYears = this.isMobile
        ? 1
        : this.isTablet && this.yearsToShow > 2 ? 2 : this.yearsToShow

      this.$nextTick(function() {
        const monthpickerWrapper = document.getElementById(this.wrapperId)
        if (!this.triggerElement || !monthpickerWrapper) {
          return
        }

        const rightPosition =
    this.triggerElement.getBoundingClientRect().left +
    monthpickerWrapper.getBoundingClientRect().width
        this.alignRight = rightPosition > viewportWidth
      })
    }
  }
}
</script>

<style lang="scss">
@import './../styles/transitions';

$tablet: 768px;
$color-gray: rgba(0, 0, 0, 0.2);
$border-normal: 1px solid $color-gray;
$border: 1px solid #e4e7e7;
$transition-time: 0.3s;

*,
*:after,
*:before {
  box-sizing: border-box;
}

.monthpicker-trigger {
  position: relative;
  overflow: visible;
}

.asd {
  &__wrapper {
    border: $border-normal;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
    background-color: white;

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

  &__monthpicker-header {
    position: relative;
  }

  &__change-year-button {
    position: absolute;
    top: 12px;
    z-index: 10;
    background: white;

    &--previous {
      left: 0;
      padding-left: 15px;
    }
    &--next {
      right: 0;
      padding-right: 15px;
    }

    > button {
      background-color: white;
      border: $border;
      border-radius: 3px;
      padding: 4px 8px;
      cursor: pointer;

      &:hover {
        border: 1px solid #c4c4c4;
      }

      > svg {
        height: 19px;
        width: 19px;
        fill: #82888a;
      }
    }
  }

  &__year-name {
    font-size: 1.3em;
    text-align: center;
    margin: 0 0 30px;
    line-height: 1.4em;
    text-transform: lowercase;
    font-weight: bold;
  }

  &__month {
    transition: all $transition-time ease;
    display: inline-block;
    padding: 15px;

    &--hidden {
      height: 275px;
      visibility: hidden;
    }
  }

  &__months-list {
    display: flex;
    flex-wrap: wrap;
  }

  &__month-item {
    $size: 40px;
    flex: 1;
    flex-basis: 30%;
    border: 1px solid #e4e7e7;
    margin: 1%;
    line-height: $size;
    height: $size;
    padding: 0;
    overflow: hidden;
    &--enabled {
      border: $border;
      &:hover {
        background-color: #e4e7e7;
      }
    }
    &--disabled {
      opacity: 0.5;
      &:hover {
        background-color: transparent;
      }

      button {
        cursor: default;
      }
    }
  }

  &__month-button {
    background: transparent;
    width: 100%;
    height: 100%;
    border: none;
    cursor: pointer;
    color: inherit;
    text-align: center;
    user-select: none;
    font-size: 15px;
    font-weight: inherit;
    padding: 0;
  }

  &__action-buttons {
    min-height: 50px;
    padding-top: 10px;
    button {
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

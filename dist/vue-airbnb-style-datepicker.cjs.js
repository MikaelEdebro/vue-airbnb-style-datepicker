'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var format = _interopDefault(require('date-fns/format'));
var subMonths = _interopDefault(require('date-fns/sub_months'));
var addMonths = _interopDefault(require('date-fns/add_months'));
var getDaysInMonth = _interopDefault(require('date-fns/get_days_in_month'));
var isBefore = _interopDefault(require('date-fns/is_before'));
var isAfter = _interopDefault(require('date-fns/is_after'));

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
var debounce = function (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) { func.apply(context, args); }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) { func.apply(context, args); }
  };
};

var copyObject = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

var AirbnbStyleDatepicker = { render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('transition', { attrs: { "name": "fade" } }, [_vm.showDatepicker ? _c('div', { directives: [{ name: "click-outside", rawName: "v-click-outside", value: _vm.closeDatepicker, expression: "closeDatepicker" }], staticClass: "datepicker-wrapper", class: _vm.wrapperClasses, style: _vm.showFullscreen ? undefined : _vm.wrapperStyles, attrs: { "id": "datepicker-wrapper" } }, [_vm.showFullscreen ? _c('div', { staticClass: "mobile-header mobile-only" }, [_c('div', { staticClass: "mobile-close", on: { "click": _vm.closeDatepicker } }, [_c('div', { staticClass: "icon" }, [_vm._v("X")])]), _vm._v(" "), _c('h3', [_vm._v(_vm._s(_vm.mobileHeader))])]) : _vm._e(), _vm._v(" "), _c('div', { staticClass: "datepicker-header" }, [_c('div', { staticClass: "change-month-button previous" }, [_c('button', { on: { "click": _vm.previousMonth } }, [_c('svg', { attrs: { "viewBox": "0 0 1000 1000" } }, [_c('path', { attrs: { "d": "M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z" } })])])]), _vm._v(" "), _c('div', { staticClass: "change-month-button next" }, [_c('button', { on: { "click": _vm.nextMonth } }, [_c('svg', { attrs: { "viewBox": "0 0 1000 1000" } }, [_c('path', { attrs: { "d": "M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z" } })])])]), _vm._v(" "), _vm._l(_vm.showMonths, function (month, index) {
      return _c('div', { key: month, staticClass: "days-legend", style: [_vm.monthWidthStyles, { left: _vm.width * index + 'px' }] }, _vm._l(_vm.daysShort, function (day) {
        return _c('div', { key: day, staticClass: "day-title" }, [_vm._v(_vm._s(day))]);
      }));
    })], 2), _vm._v(" "), _c('div', { staticClass: "datepicker-inner-wrapper", style: _vm.innerStyles }, [_c('transition-group', { attrs: { "name": "list-complete", "tag": "div" } }, _vm._l(_vm.months, function (month) {
      return _c('div', { key: month.firstDateOfMonth, staticClass: "month", style: _vm.monthWidthStyles }, [_c('div', { staticClass: "month-name" }, [_vm._v(_vm._s(month.monthName) + " " + _vm._s(month.year))]), _vm._v(" "), _c('table', { staticClass: "month-table", attrs: { "role": "presentation" } }, [_c('tbody', _vm._l(month.weeks, function (week, index) {
        return _c('tr', { key: index, staticClass: "week" }, _vm._l(week, function (ref, index) {
          var fullDate = ref.fullDate;
          var dayNumber = ref.dayNumber;

          return _c('td', { key: index + '_' + dayNumber, staticClass: "day", class: { enabled: dayNumber !== 0, empty: dayNumber === 0, disabled: _vm.isBeforeMinDate(fullDate) || _vm.isAfterEndDate(fullDate), selected: _vm.selectedDate1 === fullDate || _vm.selectedDate2 === fullDate, 'in-range': _vm.isInRange(fullDate) }, style: {
              background: _vm.isSelected(fullDate) ? _vm.colors.selected : _vm.isInRange(fullDate) ? _vm.colors.inRange : 'white',
              color: _vm.isSelected(fullDate) ? _vm.colors.selectedText : _vm.isInRange(fullDate) ? _vm.colors.selectedText : _vm.colors.text,
              border: _vm.isSelected(fullDate) ? '1px double ' + _vm.colors.selected : _vm.isInRange(fullDate) && _vm.allDatesSelected ? '1px double ' + _vm.colors.inRangeBorder : ''
            }, on: { "mouseover": function () {
                _vm.setHoverDate(fullDate);
              } } }, [_vm._v(" H"), dayNumber ? _c('button', { staticClass: "day-button", attrs: { "date": fullDate }, on: { "click": function () {
                _vm.selectDate(fullDate);
              } } }, [_vm._v(_vm._s(dayNumber))]) : _vm._e()]);
        }));
      }))])]);
    }))], 1), _vm._v(" "), _vm.mode !== 'single' ? _c('div', { staticClass: "action-buttons" }, [_c('button', { on: { "click": _vm.closeDatepicker } }, [_vm._v(_vm._s(_vm.texts.cancel))]), _vm._v(" "), _c('button', { style: { color: _vm.colors.selected }, on: { "click": _vm.closeDatepicker } }, [_vm._v(_vm._s(_vm.texts.apply))])]) : _vm._e()]) : _vm._e()]);
  }, staticRenderFns: [],
  name: 'airbnb-style-datepicker',
  created: function created() {
    var this$1 = this;

    this.setupDatepicker();

    if (this.sundayFirst) {
      this.setSundayToFirstDayInWeek();
    }
    window.addEventListener('resize', debounce(this.positionDatepicker, 200));

    window.addEventListener('click', function (event) {
      if (event.target.id === this$1.triggerElementId) {
        event.stopPropagation();
        event.preventDefault();
        this$1.toggleDatepicker();
      }
    });
  },
  mounted: function mounted() {
    var this$1 = this;

    this.setStartDates();

    for (var i = 0; i < this.showMonths + 2; i++) {
      this$1.months.push(this$1.getMonth(this$1.startingDate));
      this$1.startingDate = this$1.addMonths(this$1.startingDate);
    }

    if (this.startOpen || this.inline) {
      this.openDatepicker();
    }
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.positionDatepicker);
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
  data: function data() {
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
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
    };
  },
  computed: {
    wrapperClasses: function wrapperClasses() {
      return {
        'full-screen': this.showFullscreen,
        inline: this.inline
      };
    },
    wrapperStyles: function wrapperStyles() {
      return {
        position: this.inline ? 'relative' : 'absolute',
        top: this.inline ? '0' : this.triggerPosition.height + this.offset + 'px',
        left: !this.alignRight ? '0' : '',
        right: this.alignRight ? '0' : '',
        width: this.width * this.showMonths + 'px',
        zIndex: this.inline ? '0' : '100',
        paddingBottom: this.inline ? '0' : '30px'
      };
    },
    innerStyles: function innerStyles() {
      return {
        'margin-left': this.showFullscreen ? '-' + this.$viewportWidth : ("-" + (this.width) + "px")
      };
    },
    monthWidthStyles: function monthWidthStyles() {
      return {
        width: this.showFullscreen ? this.$viewportWidth : this.width + 'px'
      };
    },
    showFullscreen: function showFullscreen() {
      return this.$isMobile && this.fullscreenMobile;
    },
    datesSelected: function datesSelected() {
      return !!(this.selectedDate1 && this.selectedDate1 !== '' || this.selectedDate2 && this.selectedDate2 !== '');
    },
    allDatesSelected: function allDatesSelected() {
      return !!(this.selectedDate1 && this.selectedDate1 !== '' && this.selectedDate2 && this.selectedDate2 !== '');
    },
    hasMinDate: function hasMinDate() {
      return !!(this.minDate && this.minDate !== '');
    },
    isRangeMode: function isRangeMode() {
      return this.mode === 'range';
    },
    isSingleMode: function isSingleMode() {
      return this.mode === 'single';
    },
    datepickerWidth: function datepickerWidth() {
      return this.width * this.showMonths;
    }
  },
  methods: {
    setupDatepicker: function setupDatepicker() {
      if (this.$options.sundayFirst) {
        this.sundayFirst = copyObject(this.$options.sundayFirst);
      }
      if (this.$options.colors) {
        this.colors = copyObject(this.$options.colors);
      }
      if (this.$options.days) {
        this.days = copyObject(this.$options.days);
      }
      if (this.$options.daysShort) {
        this.daysShort = copyObject(this.$options.daysShort);
      }
      if (this.$options.texts) {
        this.texts = copyObject(this.$options.texts);
      }
    },
    setStartDates: function setStartDates() {
      var startDate = this.dateOne || new Date();
      if (this.hasMinDate && isBefore(startDate, this.minDate)) {
        startDate = this.minDate;
      }
      this.startingDate = this.subtractMonths(startDate);
      this.selectedDate1 = this.dateOne;
      this.selectedDate2 = this.dateTwo;
    },
    setSundayToFirstDayInWeek: function setSundayToFirstDayInWeek() {
      var lastDay = this.days.pop();
      this.days.unshift(lastDay);
      var lastDayShort = this.daysShort.pop();
      this.daysShort.unshift(lastDayShort);
    },
    getMonth: function getMonth(date) {
      var firstDateOfMonth = format(date, 'YYYY-MM-01');
      var year = format(date, 'YYYY');
      var monthName = format(date, 'MMMM');
      var monthNumber = parseInt(format(date, 'M'));

      return {
        year: year,
        firstDateOfMonth: firstDateOfMonth,
        monthName: monthName,
        monthNumber: monthNumber,
        weeks: this.getWeeks(firstDateOfMonth)
      };
    },
    getWeeks: function getWeeks(date) {
      var weekDayNotInMonth = { dayNumber: 0 };
      var daysInMonth = getDaysInMonth(date);
      var year = format(date, 'YYYY');
      var month = format(date, 'MM');
      var firstDayName = format(date, 'dddd');
      var skipDaysUntilFirstInMonth = this.days.findIndex(function (day) { return day === firstDayName; });
      var weeks = [];
      var week = [];

      // add empty days to get first day in correct position
      for (var s = 0; s < skipDaysUntilFirstInMonth; s++) {
        week.push(weekDayNotInMonth);
      }
      for (var d = 0; d < daysInMonth; d++) {
        var isLastDayInMonth = d >= daysInMonth - 1;
        var dayNumber = d + 1;
        var dayNumberFull = dayNumber < 10 ? '0' + dayNumber : dayNumber;
        week.push({
          dayNumber: dayNumber,
          dayNumberFull: dayNumberFull,
          fullDate: year + '-' + month + '-' + dayNumberFull
        });

        if (week.length === 7) {
          weeks.push(week);
          week = [];
        } else if (isLastDayInMonth) {
          for (var i = 0; i < 7 - week.length; i++) {
            week.push(weekDayNotInMonth);
          }
          weeks.push(week);
          week = [];
        }
      }
      return weeks;
    },
    selectDate: function selectDate(date) {
      if (this.isBeforeMinDate(date) || this.isAfterEndDate(date)) {
        return;
      }

      if (this.mode === 'single') {
        this.selectedDate1 = date;
        this.closeDatepicker();
        return;
      }

      if (this.isSelectingDate1 || isBefore(date, this.selectedDate1)) {
        this.selectedDate1 = date;
        this.isSelectingDate1 = false;

        if (isBefore(this.selectedDate2, date)) {
          this.selectedDate2 = '';
        }
      } else {
        this.selectedDate2 = date;
        this.isSelectingDate1 = true;

        if (isAfter(this.selectedDate1, date)) {
          this.selectedDate1 = '';
        }
      }
    },
    setHoverDate: function setHoverDate(date) {
      this.hoverDate = date;
    },
    isSelected: function isSelected(date) {
      if (!date) {
        return;
      }
      return this.selectedDate1 === date || this.selectedDate2 === date;
    },
    isInRange: function isInRange(date) {
      if (!this.allDatesSelected || this.isSingleMode) {
        return false;
      }

      return isAfter(date, this.selectedDate1) && isBefore(date, this.selectedDate2) || isAfter(date, this.selectedDate1) && isBefore(date, this.hoverDate) && !this.allDatesSelected;
    },
    isBeforeMinDate: function isBeforeMinDate(date) {
      if (!this.minDate) {
        return false;
      }
      return isBefore(date, this.minDate);
    },
    isAfterEndDate: function isAfterEndDate(date) {
      if (!this.endDate) {
        return false;
      }
      return isAfter(date, this.endDate);
    },
    previousMonth: function previousMonth() {
      this.startingDate = this.subtractMonths(this.months[0].firstDateOfMonth);

      this.months.unshift(this.getMonth(this.startingDate));
      this.months.splice(this.months.length - 1, 1);
    },
    nextMonth: function nextMonth() {
      var this$1 = this;

      this.startingDate = this.addMonths(this.months[this.months.length - 1].firstDateOfMonth);
      this.months.push(this.getMonth(this.startingDate));

      setTimeout(function () {
        this$1.months.splice(0, 1);
      }, 100);
    },
    subtractMonths: function subtractMonths(date) {
      return format(subMonths(date, 1), this.dateFormat);
    },
    addMonths: function addMonths$1(date) {
      return format(addMonths(date, 1), this.dateFormat);
    },
    toggleDatepicker: function toggleDatepicker() {
      if (this.showDatepicker) {
        this.closeDatepicker();
      } else {
        this.openDatepicker();
      }
    },
    openDatepicker: function openDatepicker() {
      this.getStartingPosition();
      this.setStartDates();
      this.showDatepicker = true;
    },
    closeDatepicker: function closeDatepicker() {
      if (this.inline) {
        return;
      }
      this.showDatepicker = false;
    },
    getStartingPosition: function getStartingPosition() {
      var this$1 = this;

      var triggerElement = document.getElementById(this.triggerElementId);
      this.triggerPosition = triggerElement.getBoundingClientRect();

      setTimeout(function () {
        this$1.positionDatepicker();
      }, 0);
    },
    positionDatepicker: function positionDatepicker() {
      var viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var isMobile = viewPortWidth < 768;
      var isTablet = viewPortWidth >= 768 && viewPortWidth <= 1024;
      this.showMonths = isMobile ? 1 : isTablet && this.monthsToShow > 2 ? 2 : this.monthsToShow;

      this.$nextTick(function () {
        var triggerElement = document.getElementById(this.triggerElementId);
        var datepickerWrapper = document.getElementById('datepicker-wrapper');
        if (!triggerElement || !datepickerWrapper) {
          return;
        }

        var rightPosition = triggerElement.getBoundingClientRect().left + datepickerWrapper.getBoundingClientRect().width;
        this.alignRight = rightPosition > viewPortWidth;
      });
    }
  },
  watch: {
    selectedDate1: function selectedDate1(newValue, oldValue) {
      var newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat);
      this.$emit('dateOneSelected', newDate);
    },
    selectedDate2: function selectedDate2(newValue, oldValue) {
      var newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat);
      this.$emit('dateTwoSelected', newDate);
    },
    mode: function mode(newValue, oldValue) {
      this.setStartDates();
    }
  }
};

var ClickOutside = {
  bind: function (el, binding, vnode) {
    el.event = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.event);
  }
};

var AirbnbStyleDatepickerPlugin = {
  install: function install(Vue, options) {
    Vue.prototype.$viewportWidth = window.innerWidth + 'px';
    Vue.prototype.$isMobile = window.innerWidth < 768;

    Vue.directive('click-outside', ClickOutside);

    Vue.component(AirbnbStyleDatepicker.name, Object.assign({}, options, AirbnbStyleDatepicker));
  }
};
// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AirbnbStyleDatepickerPlugin);
  window.AirbnbStyleDatepicker = AirbnbStyleDatepickerPlugin;
}

exports['default'] = AirbnbStyleDatepickerPlugin;
exports.AirbnbStyleDatepicker = AirbnbStyleDatepicker;

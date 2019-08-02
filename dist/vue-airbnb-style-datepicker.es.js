import format from 'date-fns/format';
import subMonths from 'date-fns/sub_months';
import addMonths from 'date-fns/add_months';
import getDaysInMonth from 'date-fns/get_days_in_month';
import lastDayOfMonth from 'date-fns/last_day_of_month';
import getMonth from 'date-fns/get_month';
import setMonth from 'date-fns/set_month';
import getYear from 'date-fns/get_year';
import setYear from 'date-fns/set_year';
import isSameMonth from 'date-fns/is_same_month';
import isSameDay from 'date-fns/is_same_day';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import addWeeks from 'date-fns/add_weeks';
import subWeeks from 'date-fns/sub_weeks';
import startOfMonth from 'date-fns/start_of_month';
import startOfWeek from 'date-fns/start_of_week';
import endOfWeek from 'date-fns/end_of_week';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import isValid from 'date-fns/is_valid';
import vClickOutside from 'v-click-outside';

/* eslint-disable */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s);
    var i = matches.length;

    while (--i >= 0 && matches.item(i) !== this) {}

    return i > -1;
  };
}

if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {
      var arguments$1 = arguments;


      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments$1[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }

      return to;
    },
    writable: true,
    configurable: true
  });
} // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex


if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

      var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


      var thisArg = arguments[1]; // 5. Let k be 0.

      var k = 0; // 6. Repeat, while k < len

      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];

        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        } // e. Increase k by 1.


        k++;
      } // 7. Return -1.


      return -1;
    }
  });
}

/* eslint-disable */
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
var findAncestor = function (element, selector) {
  if (!element) {
    return null;
  }

  if (typeof element.closest === 'function') {
    return element.closest(selector) || null;
  }

  while (element) {
    if (element.matches(selector)) {
      return element;
    }

    element = element.parentElement;
  }

  return null;
};
var randomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

var ResizeSelect = {
  componentUpdated: resizeSelect,
  inserted: resizeSelect
};

function resizeSelect(el, binding, vnode) {
  var select = document.createElement('select');
  select.className = el.className;
  var option = document.createElement('option');
  option.textContent = el.value;
  select.appendChild(option);
  el.parentNode.appendChild(select);
  el.style.width = select.offsetWidth + 'px';
  select.parentNode.removeChild(select);
}

var AirbnbStyleDatepicker = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"asd__fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showDatepicker),expression:"showDatepicker"},{name:"click-outside",rawName:"v-click-outside",value:(_vm.handleClickOutside),expression:"handleClickOutside"}],staticClass:"asd__wrapper",class:_vm.wrapperClasses,style:(_vm.showFullscreen ? undefined : _vm.wrapperStyles),attrs:{"id":_vm.wrapperId}},[(_vm.showFullscreen)?_c('div',{staticClass:"asd__mobile-header asd__mobile-only"},[_c('button',{staticClass:"asd__mobile-close",attrs:{"type":"button","aria-label":_vm.ariaLabels.closeDatepicker},on:{"click":_vm.closeDatepicker}},[(_vm.$slots['close-icon'])?_vm._t("close-icon"):_c('div',{staticClass:"asd__mobile-close-icon",attrs:{"aria-hidden":"true"}},[_vm._v("X")])],2),_vm._v(" "),_c('h3',[_vm._v(_vm._s(_vm.mobileHeader || _vm.mobileHeaderFallback))])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"asd__datepicker-header"},[_c('div',{staticClass:"asd__change-month-button asd__change-month-button--previous"},[_c('button',{attrs:{"type":"button","aria-label":_vm.ariaLabels.previousMonth},on:{"click":_vm.previousMonth}},[(_vm.$slots['previous-month-icon'])?_vm._t("previous-month-icon"):_c('svg',{attrs:{"viewBox":"0 0 1000 1000"}},[_c('path',{attrs:{"d":"M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"}})])],2)]),_vm._v(" "),_c('div',{staticClass:"asd__change-month-button asd__change-month-button--next"},[_c('button',{attrs:{"type":"button","aria-label":_vm.ariaLabels.nextMonth},on:{"click":_vm.nextMonth}},[(_vm.$slots['next-month-icon'])?_vm._t("next-month-icon"):_c('svg',{attrs:{"viewBox":"0 0 1000 1000"}},[_c('path',{attrs:{"d":"M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"}})])],2)]),_vm._v(" "),_vm._l((_vm.showMonths),function(month,index){return _c('div',{key:month,staticClass:"asd__days-legend",style:([_vm.monthWidthStyles, {left: (_vm.width * index) + 'px'}])},_vm._l((_vm.daysShort),function(day,index){return _c('div',{key:index,staticClass:"asd__day-title"},[_vm._v(_vm._s(day))])}))})],2),_vm._v(" "),_c('div',{staticClass:"asd__inner-wrapper",style:(_vm.innerStyles)},[_c('transition-group',{attrs:{"name":"asd__list-complete","tag":"div"}},_vm._l((_vm.months),function(month,monthIndex){return _c('div',{key:month.firstDateOfMonth,staticClass:"asd__month",class:{'asd__month--hidden': monthIndex === 0 || monthIndex > _vm.showMonths},style:(_vm.monthWidthStyles)},[_c('div',{staticClass:"asd__month-name"},[(_vm.showMonthYearSelect)?_c('select',{directives:[{name:"model",rawName:"v-model",value:(month.monthName),expression:"month.monthName"},{name:"resize-select",rawName:"v-resize-select"}],staticClass:"asd__month-year-select",attrs:{"tabindex":monthIndex === 0 || monthIndex > _vm.showMonths ? -1 : 0},on:{"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(month, "monthName", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);},function($event){_vm.updateMonth(monthIndex, month.year, $event);}]}},_vm._l((_vm.monthNames),function(monthName,idx){return _c('option',{key:("month-" + monthIndex + "-" + monthName),attrs:{"disabled":_vm.isMonthDisabled(month.year, idx)},domProps:{"value":monthName}},[_vm._v(_vm._s(monthName))])})):_c('span',[_vm._v(_vm._s(month.monthName))]),_vm._v(" "),(_vm.showMonthYearSelect)?_c('select',{directives:[{name:"model",rawName:"v-model",value:(month.year),expression:"month.year"}],staticClass:"asd__month-year-select",attrs:{"tabindex":monthIndex === 0 || monthIndex > _vm.showMonths ? -1 : 0},on:{"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(month, "year", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);},function($event){_vm.updateYear(monthIndex, month.monthNumber - 1, $event);}]}},[(_vm.years.indexOf(month.year) === -1)?_c('option',{key:("month-" + monthIndex + "-" + (_vm.year)),attrs:{"disabled":true},domProps:{"value":month.year}},[_vm._v(_vm._s(month.year))]):_vm._e(),_vm._v(" "),_vm._l((_vm.years),function(year){return _c('option',{key:("month-" + monthIndex + "-" + year),domProps:{"value":year}},[_vm._v(_vm._s(year))])})],2):_c('span',[_vm._v(_vm._s(month.year))])]),_vm._v(" "),_c('table',{staticClass:"asd__month-table",attrs:{"role":"presentation"}},[_c('tbody',_vm._l((month.weeks),function(week,index){return _c('tr',{key:index,staticClass:"asd__week"},_vm._l((week),function(ref,index){
var fullDate = ref.fullDate;
var dayNumber = ref.dayNumber;
return _c('td',{key:index + '_' + dayNumber,ref:("date-" + fullDate),refInFor:true,staticClass:"asd__day",class:[{ 'asd__day--enabled': dayNumber !== 0, 'asd__day--empty': dayNumber === 0, 'asd__day--disabled': _vm.isDisabled(fullDate), 'asd__day--selected': fullDate && (_vm.selectedDate1 === fullDate || _vm.selectedDate2 === fullDate), 'asd__day--in-range': _vm.isInRange(fullDate), 'asd__day--today': fullDate && _vm.isToday(fullDate), 'asd__day--hovered': _vm.isHoveredInRange(fullDate), 'asd__selected-date-one': fullDate && fullDate === _vm.selectedDate1, 'asd__selected-date-two': fullDate && fullDate === _vm.selectedDate2, }, _vm.customizedDateClass(fullDate)],style:(_vm.getDayStyles(fullDate)),attrs:{"data-date":fullDate,"tabindex":_vm.isDateVisible(fullDate) && _vm.isSameDate(_vm.focusedDate, fullDate) ? 0 : -1,"aria-label":_vm.isDateVisible(fullDate) ? _vm.getAriaLabelForDate(fullDate) : false},on:{"mouseover":function () { _vm.setHoverDate(fullDate); }}},[(dayNumber)?_c('button',{staticClass:"asd__day-button",attrs:{"type":"button","tabindex":"-1","date":fullDate,"disabled":_vm.isDisabled(fullDate)},on:{"click":function () { _vm.selectDate(fullDate); }}},[_vm._v(_vm._s(dayNumber))]):_vm._e()])}))}))])])})),_vm._v(" "),(_vm.showShortcutsMenuTrigger)?_c('div',{class:{ 'asd__keyboard-shortcuts-menu': true, 'asd__keyboard-shortcuts-show': _vm.showKeyboardShortcutsMenu},style:(_vm.keyboardShortcutsMenuStyles)},[_c('div',{staticClass:"asd__keyboard-shortcuts-title"},[_vm._v(_vm._s(_vm.texts.keyboardShortcuts))]),_vm._v(" "),_c('button',{ref:"keyboard-shortcus-menu-close",staticClass:"asd__keyboard-shortcuts-close",attrs:{"tabindex":"0","aria-label":_vm.ariaLabels.closeKeyboardShortcutsMenu},on:{"click":_vm.closeKeyboardShortcutsMenu}},[(_vm.$slots['close-shortcuts-icon'])?_vm._t("close-shortcuts-icon"):_c('div',{staticClass:"asd__mobile-close-icon",attrs:{"aria-hidden":"true"}},[_vm._v("X")])],2),_vm._v(" "),_c('ul',{staticClass:"asd__keyboard-shortcuts-list"},_vm._l((_vm.keyboardShortcuts),function(shortcut,i){return _c('li',{key:i},[_c('span',{staticClass:"asd__keyboard-shortcuts-symbol",attrs:{"aria-label":shortcut.symbolDescription}},[_vm._v(_vm._s(shortcut.symbol))]),_vm._v(" "+_vm._s(shortcut.label)+" ")])}))]):_vm._e()],1),_vm._v(" "),(_vm.mode !== 'single' && _vm.showActionButtons)?_c('div',{staticClass:"asd__action-buttons"},[_c('button',{attrs:{"type":"button"},on:{"click":_vm.closeDatepickerCancel}},[_vm._v(_vm._s(_vm.texts.cancel))]),_vm._v(" "),_c('button',{ref:"apply-button",style:({color: _vm.colors.selected}),attrs:{"type":"button"},on:{"click":_vm.apply}},[_vm._v(_vm._s(_vm.texts.apply))])]):_vm._e(),_vm._v(" "),(_vm.showShortcutsMenuTrigger)?_c('div',{staticClass:"asd__keyboard-shortcuts-trigger-wrapper"},[_c('button',{staticClass:"asd__keyboard-shortcuts-trigger",attrs:{"aria-label":_vm.ariaLabels.openKeyboardShortcutsMenu,"tabindex":"0"},on:{"click":_vm.openKeyboardShortcutsMenu}},[_c('span',[_vm._v("?")])])]):_vm._e()])])},staticRenderFns: [],
  name: 'AirbnbStyleDatepicker',
  directives: {
    clickOutside: vClickOutside.directive,
    resizeSelect: ResizeSelect,
  },
  props: {
    triggerElementId: { type: String },
    dateOne: { type: [String, Date] },
    dateTwo: { type: [String, Date] },
    minDate: { type: [String, Date] },
    endDate: { type: [String, Date] },
    mode: { type: String, default: 'range' },
    offsetY: { type: Number, default: 0 },
    offsetX: { type: Number, default: 0 },
    monthsToShow: { type: Number, default: 2 },
    startOpen: { type: Boolean },
    fullscreenMobile: { type: Boolean },
    inline: { type: Boolean },
    mobileHeader: { type: String },
    disabledDates: { type: Array, default: function () { return []; } },
    enabledDates: { type: Array, default: function () { return []; } },
    customizedDates: { type: Array, default: function () { return []; } },
    showActionButtons: { type: Boolean, default: true },
    showShortcutsMenuTrigger: { type: Boolean, default: true },
    showMonthYearSelect: { type: Boolean, default: false },
    yearsForSelect: { type: Number, default: 10 },
    isTest: {
      type: Boolean,
      default: function () { return process.env.NODE_ENV === 'test'; },
    },
    trigger: { type: Boolean, default: false },
    closeAfterSelect: { type: Boolean, default: false },
  },
  data: function data() {
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
        chooseDate: function (date) { return date; },
        chooseStartDate: function (date) { return ("Choose " + date + " as your start date."); },
        chooseEndDate: function (date) { return ("Choose " + date + " as your end date."); },
        selectedDate: function (date) { return ("Selected. " + date); },
        unavailableDate: function (date) { return ("Not available. " + date); },
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
        'December' ],
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
        { symbol: '?', label: 'Open this panel', symbolDescription: 'Question mark' } ],
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
      hoverDate: '',
      focusedDate: '',
      alignRight: false,
      triggerPosition: {},
      triggerWrapperPosition: {},
      viewportWidth: undefined,
      isMobile: undefined,
      isTablet: undefined,
      triggerElement: undefined,
    }
  },
  computed: {
    isSelectingDate1: {
      get: function get() {
        return (this.dateOne && !this.dateTwo) ? false : true
      },
      set: function set(newValue) {
        return newValue
      }
    },
    wrapperClasses: function wrapperClasses() {
      return {
        'asd__wrapper--datepicker-open': this.showDatepicker,
        'asd__wrapper--full-screen': this.showFullscreen,
        'asd__wrapper--inline': this.inline,
      }
    },
    wrapperStyles: function wrapperStyles() {
      return {
        position: this.inline ? 'static' : 'absolute',
        top: this.inline ? '0' : this.triggerPosition.height + this.offsetY + 'px',
        left: !this.alignRight
          ? this.triggerPosition.left - this.triggerWrapperPosition.left + this.offsetX + 'px'
          : '',
        right: this.alignRight
          ? this.triggerWrapperPosition.right - this.triggerPosition.right + this.offsetX + 'px'
          : '',
        width: this.width * this.showMonths + 'px',
        zIndex: this.inline ? '0' : '100',
      }
    },
    innerStyles: function innerStyles() {
      return {
        'margin-left': this.showFullscreen ? '-' + this.viewportWidth : ("-" + (this.width) + "px"),
      }
    },
    keyboardShortcutsMenuStyles: function keyboardShortcutsMenuStyles() {
      return {
        left: this.showFullscreen ? this.viewportWidth : ((this.width) + "px"),
      }
    },
    monthWidthStyles: function monthWidthStyles() {
      return {
        width: this.showFullscreen ? this.viewportWidth : this.width + 'px',
      }
    },
    mobileHeaderFallback: function mobileHeaderFallback() {
      return this.mode === 'range' ? 'Select dates' : 'Select date'
    },
    showFullscreen: function showFullscreen() {
      return this.isMobile && this.fullscreenMobile
    },
    datesSelected: function datesSelected() {
      return !!(
        (this.selectedDate1 && this.selectedDate1 !== '') ||
        (this.selectedDate2 && this.selectedDate2 !== '')
      )
    },
    allDatesSelected: function allDatesSelected() {
      return !!(
        this.selectedDate1 &&
        this.selectedDate1 !== '' &&
        this.selectedDate2 &&
        this.selectedDate2 !== ''
      )
    },
    hasMinDate: function hasMinDate() {
      return !!(this.minDate && this.minDate !== '')
    },
    isRangeMode: function isRangeMode() {
      return this.mode === 'range'
    },
    isSingleMode: function isSingleMode() {
      return this.mode === 'single'
    },
    datepickerWidth: function datepickerWidth() {
      return this.width * this.showMonths
    },
    datePropsCompound: function datePropsCompound() {
      // used to watch for changes in props, and update GUI accordingly
      return this.dateOne + this.dateTwo
    },
    isDateTwoBeforeDateOne: function isDateTwoBeforeDateOne() {
      if (!this.dateTwo) {
        return false
      }
      return isBefore(this.dateTwo, this.dateOne)
    },
    visibleMonths: function visibleMonths() {
      var firstMonthArray = this.months.filter(function (m, index) { return index > 0; });
      var numberOfMonthsArray = [];
      for (var i = 0; i < this.showMonths; i++) {
        numberOfMonthsArray.push(i);
      }
      return numberOfMonthsArray.map(function (_, index) { return firstMonthArray[index].firstDateOfMonth; })
    },
  },
  watch: {
    selectedDate1: function selectedDate1(newValue, oldValue) {
      var newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat);
      this.$emit('date-one-selected', newDate);
    },
    selectedDate2: function selectedDate2(newValue, oldValue) {
      var newDate = !newValue || newValue === '' ? '' : format(newValue, this.dateFormat);
      this.$emit('date-two-selected', newDate);
    },
    mode: function mode(newValue, oldValue) {
      this.setStartDates();
    },
    minDate: function minDate() {
      this.setStartDates();
      this.generateMonths();
      this.generateYears();
    },
    endDate: function endDate() {
      this.generateYears();
    },
    datePropsCompound: function datePropsCompound(newValue) {
      if (this.dateOne !== this.selectedDate1) {
        this.startingDate = this.dateOne;
        this.setStartDates();
        this.generateMonths();
        this.generateYears();
      }
      if (this.isDateTwoBeforeDateOne) {
        this.selectedDate2 = '';
        this.$emit('date-two-selected', '');
      }
    },
    trigger: function trigger(newValue, oldValue) {
      var this$1 = this;

      if (newValue) {
        setTimeout(function () {
          this$1.openDatepicker();
        }, 0);
      }
    },
  },
  created: function created() {
    this.setupDatepicker();

    if (this.sundayFirst) {
      this.setSundayToFirstDayInWeek();
    }
  },
  mounted: function mounted() {
    var this$1 = this;

    this.viewportWidth = window.innerWidth + 'px';
    this.isMobile = window.innerWidth < 768;
    this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
    this._handleWindowResizeEvent = debounce(function () {
      this$1.positionDatepicker();
      this$1.setStartDates();
    }, 200);
    this._handleWindowClickEvent = function (event) {
      if (event.target.id === this$1.triggerElementId) {
        event.stopPropagation();
        event.preventDefault();
        this$1.toggleDatepicker();
      }
    };
    window.addEventListener('resize', this._handleWindowResizeEvent);

    this.triggerElement = this.isTest
      ? document.createElement('input')
      : document.getElementById(this.triggerElementId);

    this.setStartDates();
    this.generateMonths();
    this.generateYears();

    if (this.startOpen || this.inline) {
      this.openDatepicker();
    }

    this.$el.addEventListener('keyup', this.handleKeyboardInput);
    this.$el.addEventListener('keydown', this.trapKeyboardInput);
    this.triggerElement.addEventListener('keyup', this.handleTriggerInput);
    this.triggerElement.addEventListener('click', this._handleWindowClickEvent);
  },
  destroyed: function destroyed() {
    window.removeEventListener('resize', this._handleWindowResizeEvent);
    window.removeEventListener('click', this._handleWindowClickEvent);

    this.$el.removeEventListener('keyup', this.handleKeyboardInput);
    this.$el.removeEventListener('keydown', this.trapKeyboardInput);
    this.triggerElement.removeEventListener('keyup', this.handleTriggerInput);
    this.triggerElement.removeEventListener('click', this._handleWindowClickEvent);
  },
  methods: {
    getDayStyles: function getDayStyles(date) {
      var isSelected = this.isSelected(date);
      var isInRange = this.isInRange(date);
      var isDisabled = this.isDisabled(date);
      var isHoveredInRange = this.isHoveredInRange(date);

      var styles = {
        width: (this.width - 30) / 7 + 'px',
        background: isSelected
          ? this.colors.selected
          : isHoveredInRange
          ? this.colors.hoveredInRange
          : isInRange
          ? this.colors.inRange
          : '',
        color: isSelected
          ? this.colors.selectedText
          : isInRange || isHoveredInRange
          ? this.colors.selectedText
          : this.colors.text,
        border: isSelected
          ? '1px double ' + this.colors.selected
          : (isInRange && this.allDatesSelected) || isHoveredInRange
          ? '1px double ' + this.colors.inRangeBorder
          : '',
      };

      if (isDisabled) {
        styles.background = this.colors.disabled;
      }
      return styles
    },
    getAriaLabelForDate: function getAriaLabelForDate(date) {
      var dateLabel = format(date, this.dateLabelFormat);

      var isDisabled = this.isDisabled(date);
      if (isDisabled) {
        return this.ariaLabels.unavailableDate(dateLabel)
      }

      var isSelected = this.isSelected(date);
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
    handleClickOutside: function handleClickOutside(event) {
      if (event.target.id === this.triggerElementId || !this.showDatepicker || this.inline) {
        return
      }
      this.closeDatepicker();
    },
    shouldHandleInput: function shouldHandleInput(event, key) {
      return (
        event.keyCode === key && (!event.shiftKey || event.keyCode === 191) && this.showDatepicker
      )
    },
    handleTriggerInput: function handleTriggerInput(event) {
      if (this.mode === 'single') {
        this.setDateFromText(event.target.value);
      }
    },
    trapKeyboardInput: function trapKeyboardInput(event) {
      var this$1 = this;

      // prevent keys that are used as keyboard shortcuts from propagating out of this element
      // except for the enter key, which is needed to activate buttons
      var shortcutKeyCodes = Object.keys(this.keys).map(function (key) { return this$1.keys[key]; });
      shortcutKeyCodes.splice(shortcutKeyCodes.indexOf(13), 1);
      var shouldPreventDefault = shortcutKeyCodes.indexOf(event.keyCode) > -1;
      if (shouldPreventDefault) { event.preventDefault(); }
    },
    handleKeyboardInput: function handleKeyboardInput(event) {
      if (this.shouldHandleInput(event, this.keys.esc)) {
        if (this.showKeyboardShortcutsMenu) {
          this.closeKeyboardShortcutsMenu();
        } else {
          this.closeDatepicker();
        }
      } else if (this.showKeyboardShortcutsMenu) {
        // if keyboard shortcutsMenu is open, then esc is the only key we want to have fire events
      } else if (this.shouldHandleInput(event, this.keys.arrowDown)) {
        var newDate = addWeeks(this.focusedDate, 1);
        var changeMonths = !isSameMonth(newDate, this.focusedDate);
        this.setFocusedDate(newDate);
        if (changeMonths) { this.nextMonth(); }
      } else if (this.shouldHandleInput(event, this.keys.arrowUp)) {
        var newDate$1 = subWeeks(this.focusedDate, 1);
        var changeMonths$1 = !isSameMonth(newDate$1, this.focusedDate);
        this.setFocusedDate(newDate$1);
        if (changeMonths$1) { this.previousMonth(); }
      } else if (this.shouldHandleInput(event, this.keys.arrowRight)) {
        var newDate$2 = addDays(this.focusedDate, 1);
        var changeMonths$2 = !isSameMonth(newDate$2, this.focusedDate);
        this.setFocusedDate(newDate$2);
        if (changeMonths$2) { this.nextMonth(); }
      } else if (this.shouldHandleInput(event, this.keys.arrowLeft)) {
        var newDate$3 = subDays(this.focusedDate, 1);
        var changeMonths$3 = !isSameMonth(newDate$3, this.focusedDate);
        this.setFocusedDate(newDate$3);
        if (changeMonths$3) { this.previousMonth(); }
      } else if (this.shouldHandleInput(event, this.keys.enter)) {
        // on enter key, only select the date if a date is currently in focus
        var target = event.target;
        if (!this.showKeyboardShortcutsMenu && target && target.tagName === 'TD') {
          this.selectDate(this.focusedDate);
        }
      } else if (this.shouldHandleInput(event, this.keys.pgUp)) {
        this.setFocusedDate(subMonths(this.focusedDate, 1));
        this.previousMonth();
      } else if (this.shouldHandleInput(event, this.keys.pgDn)) {
        this.setFocusedDate(addMonths(this.focusedDate, 1));
        this.nextMonth();
      } else if (this.shouldHandleInput(event, this.keys.home)) {
        var newDate$4 = startOfWeek(this.focusedDate, {
          weekStartsOn: this.sundayFirst ? 0 : 1,
        });
        var changeMonths$4 = !isSameMonth(newDate$4, this.focusedDate);
        this.setFocusedDate(newDate$4);
        if (changeMonths$4) { this.previousMonth(); }
      } else if (this.shouldHandleInput(event, this.keys.end)) {
        var newDate$5 = endOfWeek(this.focusedDate, {
          weekStartsOn: this.sundayFirst ? 0 : 1,
        });
        var changeMonths$5 = !isSameMonth(newDate$5, this.focusedDate);
        this.setFocusedDate(newDate$5);
        if (changeMonths$5) { this.nextMonth(); }
      } else if (this.shouldHandleInput(event, this.keys.questionMark)) {
        this.openKeyboardShortcutsMenu();
      }
    },
    setDateFromText: function setDateFromText(value) {
      if (!value || value.length < 10) {
        return
      }
      // make sure format is either 'YYYY-MM-DD' or 'DD.MM.YYYY'
      var isFormatYearFirst = value.match(
        /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/
      );
      var isFormatDayFirst = value.match(
        /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])[.](0[1-9]|1[0-2])[.](\d{4})$/
      );

      if (!isFormatYearFirst && !isFormatDayFirst) {
        return
      }
      if (isFormatDayFirst) {
        //convert to YYYY-MM-DD
        value = (value.substring(6, 10)) + "-" + (value.substring(3, 5)) + "-" + (value.substring(0, 2));
      }

      var valueAsDateObject = new Date(value);
      if (!isValid(valueAsDateObject)) {
        return
      }
      var formattedDate = format(valueAsDateObject, this.dateFormat);
      if (
        this.isDateDisabled(formattedDate) ||
        this.isBeforeMinDate(formattedDate) ||
        this.isAfterEndDate(formattedDate)
      ) {
        return
      }
      this.startingDate = subMonths(formattedDate, 1);
      this.generateMonths();
      this.generateYears();
      this.selectDate(formattedDate);
    },
    isMonthDisabled: function isMonthDisabled(year, monthIndex) {
      var monthDate = new Date(year, monthIndex);
      if (this.hasMinDate && isBefore(monthDate, startOfMonth(this.minDate))) {
        return true
      }
      return this.isAfterEndDate(monthDate)
    },
    generateMonths: function generateMonths() {
      var this$1 = this;

      this.months = [];
      var currentMonth = this.startingDate;
      for (var i = 0; i < this.showMonths + 2; i++) {
        this$1.months.push(this$1.getMonth(currentMonth));
        currentMonth = this$1.addMonths(currentMonth);
      }
    },
    generateYears: function generateYears() {
      var this$1 = this;

      if (!this.showMonthYearSelect) { return }
      this.years = [];
      var currentYear = getYear(this.startingDate);
      var startYear = this.minDate ? getYear(this.minDate) : currentYear - this.yearsForSelect;
      var endYear = this.endDate ? getYear(this.endDate) : currentYear + this.yearsForSelect;
      for (var year = startYear; year <= endYear; year++) {
        this$1.years.push(year.toString());
      }
    },
    setupDatepicker: function setupDatepicker() {
      if (this.$options.ariaLabels) {
        this.ariaLabels = copyObject(this.$options.ariaLabels);
      }
      if (this.$options.keyboardShortcuts) {
        this.keyboardShortcuts = copyObject(this.$options.keyboardShortcuts);
      }
      if (this.$options.dateLabelFormat) {
        this.dateLabelFormat = copyObject(this.$options.dateLabelFormat);
      }
      if (this.$options.sundayFirst) {
        this.sundayFirst = copyObject(this.$options.sundayFirst);
      }
      if (this.$options.colors) {
        var colors = copyObject(this.$options.colors);
        this.colors.selected = colors.selected || this.colors.selected;
        this.colors.inRange = colors.inRange || this.colors.inRange;
        this.colors.hoveredInRange = colors.hoveredInRange || this.colors.hoveredInRange;
        this.colors.selectedText = colors.selectedText || this.colors.selectedText;
        this.colors.text = colors.text || this.colors.text;
        this.colors.inRangeBorder = colors.inRangeBorder || this.colors.inRangeBorder;
        this.colors.disabled = colors.disabled || this.colors.disabled;
      }
      if (this.$options.monthNames && this.$options.monthNames.length === 12) {
        this.monthNames = copyObject(this.$options.monthNames);
      }
      if (this.$options.days && this.$options.days.length === 7) {
        this.days = copyObject(this.$options.days);
      }
      if (this.$options.daysShort && this.$options.daysShort.length === 7) {
        this.daysShort = copyObject(this.$options.daysShort);
      }
      if (this.$options.texts) {
        var texts = copyObject(this.$options.texts);
        this.texts.apply = texts.apply || this.texts.apply;
        this.texts.cancel = texts.cancel || this.texts.cancel;
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
      this.focusedDate = startDate;
    },
    setSundayToFirstDayInWeek: function setSundayToFirstDayInWeek() {
      var lastDay = this.days.pop();
      this.days.unshift(lastDay);
      var lastDayShort = this.daysShort.pop();
      this.daysShort.unshift(lastDayShort);
    },
    getMonth: function getMonth$$1(date) {
      var firstDateOfMonth = format(date, 'YYYY-MM-01');
      var year = format(date, 'YYYY');
      var monthNumber = parseInt(format(date, 'M'));
      var monthName = this.monthNames[monthNumber - 1];

      return {
        year: year,
        firstDateOfMonth: firstDateOfMonth,
        monthName: monthName,
        monthNumber: monthNumber,
        weeks: this.getWeeks(firstDateOfMonth),
      }
    },
    getWeeks: function getWeeks(date) {
      var weekDayNotInMonth = { dayNumber: 0 };
      var daysInMonth = getDaysInMonth(date);
      var year = format(date, 'YYYY');
      var month = format(date, 'MM');
      var firstDayInWeek = parseInt(format(date, this.sundayFirst ? 'd' : 'E'));
      if (this.sundayFirst) {
        firstDayInWeek++;
      }
      var weeks = [];
      var week = [];

      // add empty days to get first day in correct position
      for (var s = 1; s < firstDayInWeek; s++) {
        week.push(weekDayNotInMonth);
      }
      for (var d = 0; d < daysInMonth; d++) {
        var isLastDayInMonth = d >= daysInMonth - 1;
        var dayNumber = d + 1;
        var dayNumberFull = dayNumber < 10 ? '0' + dayNumber : dayNumber;
        week.push({
          dayNumber: dayNumber,
          dayNumberFull: dayNumberFull,
          fullDate: year + '-' + month + '-' + dayNumberFull,
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
      return weeks
    },
    selectDate: function selectDate(date) {
      if (this.isBeforeMinDate(date) || this.isAfterEndDate(date) || this.isDateDisabled(date)) {
        return
      }

      if (this.mode === 'single') {
        this.selectedDate1 = date;
        this.closeDatepicker();
        return
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
        } else if (this.showActionButtons) {
          // if user has selected both dates, focus the apply button for accessibility
          this.$refs['apply-button'].focus();
        }

        if (this.allDatesSelected && this.closeAfterSelect) {
          this.closeDatepicker();
        }
      }
    },
    setHoverDate: function setHoverDate(date) {
      this.hoverDate = date;
    },
    setFocusedDate: function setFocusedDate(date) {
      var formattedDate = format(date, this.dateFormat);
      this.focusedDate = formattedDate;
      var dateElement = this.$refs[("date-" + formattedDate)];
      // handle .focus() on ie11 by adding a short timeout
      if (dateElement && dateElement.length) {
        setTimeout(function() {
          dateElement[0].focus();
        }, 10);
      }
    },
    resetFocusedDate: function resetFocusedDate(setToFirst) {
      if (this.focusedDate && !this.isDateVisible(this.focusedDate)) {
        var visibleMonthIdx = setToFirst ? 0 : this.visibleMonths.length - 1;
        var targetMonth = this.visibleMonths[visibleMonthIdx];
        var monthIdx = getMonth(targetMonth);
        var year = getYear(targetMonth);
        var newFocusedDate = setYear(setMonth(this.focusedDate, monthIdx), year);
        this.focusedDate = format(newFocusedDate, this.dateFormat);
      }
    },
    isToday: function isToday(date) {
      return format(new Date(), this.dateFormat) === date
    },
    isSameDate: function isSameDate(date1, date2) {
      return isSameDay(date1, date2)
    },
    isSelected: function isSelected(date) {
      if (!date) {
        return
      }
      return this.selectedDate1 === date || this.selectedDate2 === date
    },
    isInRange: function isInRange(date) {
      if (!this.allDatesSelected || this.isSingleMode) {
        return false
      }

      return (
        (isAfter(date, this.selectedDate1) && isBefore(date, this.selectedDate2)) ||
        (isAfter(date, this.selectedDate1) &&
          isBefore(date, this.hoverDate) &&
          !this.allDatesSelected)
      )
    },
    isHoveredInRange: function isHoveredInRange(date) {
      if (this.isSingleMode || this.allDatesSelected) {
        return false
      }

      return (
        (isAfter(date, this.selectedDate1) && isBefore(date, this.hoverDate)) ||
        (isAfter(date, this.hoverDate) && isBefore(date, this.selectedDate1))
      )
    },
    isBeforeMinDate: function isBeforeMinDate(date) {
      if (!this.minDate) {
        return false
      }
      return isBefore(date, this.minDate)
    },
    isAfterEndDate: function isAfterEndDate(date) {
      if (!this.endDate) {
        return false
      }
      return isAfter(date, this.endDate)
    },
    isDateVisible: function isDateVisible(date) {
      if (!date) {
        return false
      }
      var start = subDays(this.visibleMonths[0], 1);
      var end = addDays(lastDayOfMonth(this.visibleMonths[this.monthsToShow - 1]), 1);
      return isAfter(date, start) && isBefore(date, end)
    },
    isDateDisabled: function isDateDisabled(date) {
      if (this.enabledDates.length > 0) {
        return this.enabledDates.indexOf(date) === -1
      } else {
        return this.disabledDates.indexOf(date) > -1
      }
    },
    customizedDateClass: function customizedDateClass(date) {
      var this$1 = this;

      var customizedClasses = '';
      if (this.customizedDates.length > 0) {
        for (var i = 0; i < this.customizedDates.length; i++) {
          if (this$1.customizedDates[i].dates.indexOf(date) > -1)
            { customizedClasses += " asd__day--" + (this$1.customizedDates[i].cssClass); }
        }
      }
      return customizedClasses
    },
    isDisabled: function isDisabled(date) {
      return this.isDateDisabled(date) || this.isBeforeMinDate(date) || this.isAfterEndDate(date)
    },
    previousMonth: function previousMonth() {
      this.startingDate = this.subtractMonths(this.months[0].firstDateOfMonth);

      this.months.unshift(this.getMonth(this.startingDate));
      this.months.splice(this.months.length - 1, 1);
      this.$emit('previous-month', this.visibleMonths);
      this.resetFocusedDate(false);
    },
    nextMonth: function nextMonth() {
      this.startingDate = this.addMonths(this.months[this.months.length - 1].firstDateOfMonth);
      this.months.push(this.getMonth(this.startingDate));
      this.months.splice(0, 1);
      this.$emit('next-month', this.visibleMonths);
      this.resetFocusedDate(true);
    },
    subtractMonths: function subtractMonths(date) {
      return format(subMonths(date, 1), this.dateFormat)
    },
    addMonths: function addMonths$1(date) {
      return format(addMonths(date, 1), this.dateFormat)
    },
    toggleDatepicker: function toggleDatepicker() {
      if (this.showDatepicker) {
        this.closeDatepicker();
      } else {
        this.openDatepicker();
      }
    },
    updateMonth: function updateMonth(offset, year, event) {
      var newMonth = event.target.value;
      var monthIdx = this.monthNames.indexOf(newMonth);
      var newDate = setYear(setMonth(this.startingDate, monthIdx), year);
      this.startingDate = subMonths(newDate, offset);
      this.generateMonths();
    },
    updateYear: function updateYear(offset, monthIdx, event) {
      var newYear = event.target.value;
      var newDate = setYear(setMonth(this.startingDate, monthIdx), newYear);
      this.startingDate = subMonths(newDate, offset);
      this.generateMonths();
    },
    openDatepicker: function openDatepicker() {
      var this$1 = this;

      this.positionDatepicker();
      this.setStartDates();
      this.triggerElement.classList.add('datepicker-open');
      this.showDatepicker = true;
      this.initialDate1 = this.dateOne;
      this.initialDate2 = this.dateTwo;
      this.$emit('opened');
      this.$nextTick(function () {
        if (!this$1.inline) { this$1.setFocusedDate(this$1.focusedDate); }
      });
    },
    closeDatepickerCancel: function closeDatepickerCancel() {
      if (this.showDatepicker) {
        this.selectedDate1 = this.initialDate1;
        this.selectedDate2 = this.initialDate2;
        this.$emit('cancelled');
        this.closeDatepicker();
      }
    },
    closeDatepicker: function closeDatepicker() {
      if (this.inline) {
        return
      }
      this.showDatepicker = false;
      this.showKeyboardShortcutsMenu = false;
      this.triggerElement.classList.remove('datepicker-open');
      this.$emit('closed');
    },
    openKeyboardShortcutsMenu: function openKeyboardShortcutsMenu() {
      this.showKeyboardShortcutsMenu = true;
      var shortcutMenuCloseBtn = this.$refs['keyboard-shortcus-menu-close'];
      this.$nextTick(function () { return shortcutMenuCloseBtn.focus(); });
    },
    closeKeyboardShortcutsMenu: function closeKeyboardShortcutsMenu() {
      var this$1 = this;

      this.showKeyboardShortcutsMenu = false;
      this.$nextTick(function () { return this$1.setFocusedDate(this$1.focusedDate); });
    },
    apply: function apply() {
      this.$emit('apply');
      this.closeDatepicker();
    },
    positionDatepicker: function positionDatepicker() {
      var triggerWrapperElement = findAncestor(this.triggerElement, '.datepicker-trigger');
      this.triggerPosition = this.triggerElement.getBoundingClientRect();
      if (triggerWrapperElement) {
        this.triggerWrapperPosition = triggerWrapperElement.getBoundingClientRect();
      } else {
        this.triggerWrapperPosition = { left: 0, right: 0 };
      }

      var viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      this.viewportWidth = viewportWidth + 'px';
      this.isMobile = viewportWidth < 768;
      this.isTablet = viewportWidth >= 768 && viewportWidth <= 1024;
      this.showMonths = this.isMobile
        ? 1
        : this.isTablet && this.monthsToShow > 2
        ? 2
        : this.monthsToShow;

      this.$nextTick(function() {
        var datepickerWrapper = document.getElementById(this.wrapperId);
        if (!this.triggerElement || !datepickerWrapper) {
          return
        }

        var rightPosition =
          this.triggerElement.getBoundingClientRect().left +
          datepickerWrapper.getBoundingClientRect().width;
        this.alignRight = rightPosition > viewportWidth;
      });
    },
  },
}

var AirbnbStyleDatepickerPlugin = {
  install: function install(Vue, options) {
    Vue.component(AirbnbStyleDatepicker.name, Object.assign({}, options, AirbnbStyleDatepicker));
  }

}; // User has to install the component by themselves, to allow to pass options

if (typeof window !== 'undefined' && window.Vue) {
  window.AirbnbStyleDatepicker = AirbnbStyleDatepickerPlugin;
}

export default AirbnbStyleDatepickerPlugin;

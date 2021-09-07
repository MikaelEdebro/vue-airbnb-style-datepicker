import { shallow, createLocalVue } from '@vue/test-utils'
import AirbnbStyleDatepicker from '@/components/AirbnbStyleDatepicker'
import ClickOutside from '@/directives/ClickOutside'
import ResizeSelect from '@/directives/ResizeSelect'
import TestHelpers from 'test/test-helpers'
import addMonths from 'date-fns/addMonths'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'

const localVue = createLocalVue()
localVue.directive('click-outside', ClickOutside)
localVue.directive('resize-select', ResizeSelect)
let h

const createDatePickerInstance = (propsData, options, slots) => {
  if (!propsData) {
    propsData = {
      dateOne: '2018-12-20',
      dateTwo: '2018-12-25',
      monthsToShow: 2,
    }
  }
  if (!options) {
    options = {}
  }
  const component = {
    ...AirbnbStyleDatepicker,
    ...options,
  }
  const wrapper = shallow(component, {
    localVue,
    propsData,
    slots,
  })
  h = new TestHelpers(wrapper, expect)
  return wrapper
}
const datepickerWrapper = '.asd__wrapper'
let wrapper

describe('AirbnbStyleDatepicker', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.resetModules()
    jest.clearAllMocks()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  describe('lifecycle hooks', () => {
    test('creates correct amount of months', () => {
      wrapper = createDatePickerInstance()
      expect(wrapper.vm.months.length).toEqual(wrapper.props().monthsToShow + 2)
    })
    test('dates are set when initial values are passed', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2018-01-10',
        dateTwo: '2018-01-13',
      })
      expect(wrapper.vm.selectedDate1).toEqual(wrapper.props().dateOne)
      expect(wrapper.vm.selectedDate2).toEqual(wrapper.props().dateTwo)
    })

    test('sunday is first day, if specified', () => {
      wrapper = createDatePickerInstance(null, { sundayFirst: true })
      expect(wrapper.vm.days[0]).toBe('Sunday')
    })
  })

  describe('computed', () => {
    test('datesSelected() works', () => {
      wrapper = createDatePickerInstance({
        mode: 'range',
        dateOne: '2018-01-10',
      })
      expect(wrapper.vm.datesSelected).toEqual(true)
    })
    test('allDatesSelected() works', () => {
      wrapper = createDatePickerInstance({
        mode: 'range',
        dateOne: '2018-01-10',
      })
      expect(wrapper.vm.allDatesSelected).toEqual(false)
    })
  })

  describe('methods', () => {
    test('isDateVisible returns correct values', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-01-10',
      })
      expect(wrapper.vm.isDateVisible('2018-01-20')).toEqual(true)
      expect(wrapper.vm.isDateVisible('2018-02-28')).toEqual(true)
      expect(wrapper.vm.isDateVisible('2018-01-01')).toEqual(true)
      expect(wrapper.vm.isDateVisible('2017-12-20')).toEqual(false)
    })
    test('isSameDate returns correct values', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-11-01',
      })
      expect(wrapper.vm.isSameDate('2018-11-01', '2018-11-01T07:00:00.000Z')).toEqual(true)
      expect(wrapper.vm.isSameDate('2018-01-01', '2019-01-01')).toEqual(false)
    })
    test('setFocusedDate formats and sets date', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-11-10',
      })

      wrapper.vm.setFocusedDate('2018-11-01T07:00:00.000Z')
      expect(wrapper.vm.focusedDate).toEqual('2018-11-01')
    })
    test('resetFocusedDate moves the focused date forward/backward to be visible', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-10',
        focusedDate: '2018-11-10',
      })
      wrapper.vm.resetFocusedDate(true)
      expect(wrapper.vm.focusedDate).toEqual('2018-12-10')

      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-09-10',
        focusedDate: '2018-10-10',
      })
      wrapper.vm.resetFocusedDate(false)
      expect(wrapper.vm.focusedDate).toEqual('2018-09-10')
    })
    test('getMonth() returns correct values', () => {
      let month = wrapper.vm.getMonth('2017-12-01')
      expect(month.monthName).toBe('December')
      expect(month.weeks.length).toBeGreaterThan(0)
    })
    test('getWeeks() returns correct values', () => {
      let weeks = wrapper.vm.getWeeks('2017-12-01')
      expect(weeks.length).toEqual(5)
    })
    test('setHoverDate() sets correct value', () => {
      const wrapper = createDatePickerInstance()
      wrapper.vm.setHoverDate('2017-12-12')
      expect(wrapper.vm.hoverDate).toBe('2017-12-12')
    })
    test('isSelected() works', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-01-10',
      })
      expect(wrapper.vm.isSelected('2017-12-11')).toEqual(false)
      expect(wrapper.vm.isSelected(wrapper.props().dateOne)).toEqual(true)
    })
    test('previousMonth adds month first', () => {
      const firstMonth = wrapper.vm.months[1]
      wrapper.setData({ showDatepicker: true })
      wrapper.vm.previousMonth()
      expect(wrapper.vm.months[0].monthName).not.toEqual(firstMonth.monthName)
    })
    test('nextMonth adds month last', () => {
      const lastMonth = wrapper.vm.months[wrapper.vm.months.length - 1]
      wrapper.setData({ showDatepicker: true })
      wrapper.vm.nextMonth()
      expect(wrapper.vm.months[0].monthName).not.toEqual(lastMonth.monthName)
    })
    test('closeDatepicker sets correct value', () => {
      wrapper.setData({
        triggerElement: document.createElement('div'),
        showDatepicker: true,
      })
      wrapper.vm.closeDatepicker()
      expect(wrapper.vm.showDatepicker).toBe(false)
    })
    test('aria-label generated correctly for selected date', () => {
      wrapper.setData({
        selectedDate1: '2018-01-30',
      })
      expect(wrapper.vm.getAriaLabelForDate('2018-01-30')).toBe(
        'Selected. Tuesday, January 30, 2018'
      )
    })
    test('aria-label generated correctly for unavailable date', () => {
      wrapper.setData({
        selectedDate1: '2018-01-30',
        minDate: '2018-02-01',
      })
      expect(wrapper.vm.getAriaLabelForDate('2018-01-30')).toBe(
        'Not available. Tuesday, January 30, 2018'
      )
    })
    test('aria-label generated correctly for first date selection', () => {
      wrapper.setData({
        selectedDate1: undefined,
        mode: 'range',
        isSelectingDate1: true,
        minDate: undefined,
      })
      expect(wrapper.vm.getAriaLabelForDate('2018-01-30')).toBe(
        'Choose Tuesday, January 30, 2018 as your start date.'
      )
    })
    test('aria-label generated correctly for second date selection', () => {
      wrapper.setData({
        selectedDate1: '2018-01-30',
        mode: 'range',
        isSelectingDate1: false,
        minDate: undefined,
      })
      expect(wrapper.vm.getAriaLabelForDate('2018-02-01')).toBe(
        'Choose Thursday, February 1, 2018 as your end date.'
      )
    })
    test('aria-label generated correctly for single selection', () => {
      wrapper.setData({
        selectedDate1: undefined,
        mode: 'single',
        minDate: undefined,
      })
      expect(wrapper.vm.getAriaLabelForDate('2018-01-30')).toBe('Tuesday, January 30, 2018')
    })
    test('date is in range', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2018-02-20',
        dateTwo: '2018-02-26',
      })
      expect(wrapper.vm.isInRange('2018-03-22')).toBe(false)
      expect(wrapper.vm.isInRange('2018-02-22')).toBe(true)
    })
    test('event is emitted when selecting date', () => {
      wrapper = createDatePickerInstance()
      const dateOne = '2018-01-10'
      const dateTwo = '2018-02-10'
      wrapper.vm.selectDate(dateOne)
      wrapper.vm.selectDate(dateTwo)
      wrapper.vm.$nextTick(function () {
        expect(wrapper.emitted()['date-one-selected'][0]).toEqual([dateOne])
        expect(wrapper.emitted()['date-two-selected'][0]).toEqual([dateTwo])
      })
    })
    test('month of minDate is shown first', () => {
      wrapper = createDatePickerInstance({
        minDate: format(addMonths(new Date(), 2), 'yyyy-MM-dd'),
        startOpen: true,
      })
      const firstVisibleMonth = wrapper.vm.months[1]
      expect(firstVisibleMonth.monthNumber).toBe(parseInt(format(addMonths(new Date(), 2), 'M')))
    })
    test('emits closed event on datepicker close', () => {
      wrapper = createDatePickerInstance()
      wrapper.setData({ triggerElement: document.createElement('div') })
      wrapper.vm.closeDatepicker()
      wrapper.vm.$nextTick(function () {
        expect(wrapper.emitted().closed).toBeTruthy()
      })
    })
    test('emits event when clicking next month', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2022-12-12',
        startOpen: true,
      })
      h.click('.asd__change-month-button--next button')
      jest.runAllTimers()
      expect(wrapper.emitted()['next-month'][0][0]).toEqual(['2023-01-01', '2023-02-01'])
    })
    test('emits event when clicking previous month', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2021-08-14',
        startOpen: true,
      })
      h.click('.asd__change-month-button--previous button')
      jest.runAllTimers()
      expect(wrapper.emitted()['previous-month'][0][0]).toEqual(['2021-07-01', '2021-08-01'])
    })
  })

  describe('month/year select', () => {
    test('constructs year range based on default value of 10 for yearsForSelect', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
        showMonthYearSelect: true,
      })
      expect(wrapper.vm.years.length).toEqual(21)
      expect(wrapper.vm.years[0]).toEqual('2008')
      expect(wrapper.vm.years[20]).toEqual('2028')
    })

    test('constructs year range based on yearsForSelect if present', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
        showMonthYearSelect: true,
        yearsForSelect: 5,
      })
      expect(wrapper.vm.years.length).toEqual(11)
      expect(wrapper.vm.years[0]).toEqual('2013')
      expect(wrapper.vm.years[10]).toEqual('2023')
    })

    test('constructs year range based on minDate/endDate if present', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
        yearsForSelect: 3,
        minDate: '2017-01-01',
        endDate: '2019-12-31',
        showMonthYearSelect: true,
      })
      expect(wrapper.vm.years.length).toEqual(3)
      expect(wrapper.vm.years[0]).toEqual('2017')
      expect(wrapper.vm.years[2]).toEqual('2019')
    })

    test('isMonthDisabled', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
        minDate: '2017-01-03',
        endDate: '2019-12-31',
        showMonthYearSelect: true,
      })
      expect(wrapper.vm.isMonthDisabled(2016, 11)).toEqual(true)
      expect(wrapper.vm.isMonthDisabled(2017, 0)).toEqual(false)
      expect(wrapper.vm.isMonthDisabled(2020, 0)).toEqual(true)
      expect(wrapper.vm.isMonthDisabled(2019, 11)).toEqual(false)
      expect(wrapper.vm.isMonthDisabled(2018, 6)).toEqual(false)
    })

    test('selecting a month updates months array according to offset', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
        showMonthYearSelect: true,
        startOpen: true,
      })
      wrapper.vm.updateMonth(1, 2018, { target: { value: 'January' } })
      expect(wrapper.vm.months[0].year).toEqual('2017')
      expect(wrapper.vm.months[0].monthName).toEqual('December')
      expect(wrapper.vm.months[1].year).toEqual('2018')
      expect(wrapper.vm.months[1].monthName).toEqual('January')
    })

    test('selecting a year updates months array based on offset', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
        showMonthYearSelect: true,
      })

      wrapper.vm.updateYear(1, 0, { target: { value: 2022 } })
      expect(wrapper.vm.months[0].year).toEqual('2021')
      expect(wrapper.vm.months[0].monthName).toEqual('December')
      expect(wrapper.vm.months[1].year).toEqual('2022')
      expect(wrapper.vm.months[1].monthName).toEqual('January')
    })
  })

  describe('accessibility', () => {
    test('arrow keys can be used to focus on dates', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
        disabledDates: ['2018-10-20'],
      })
      wrapper.setData({ showDatepicker: true })

      wrapper.vm.handleKeyboardInput({ keyCode: 38 }) // up
      expect(wrapper.vm.focusedDate).toEqual('2018-12-13')

      wrapper.vm.handleKeyboardInput({ keyCode: 39 }) // right
      expect(wrapper.vm.focusedDate).toEqual('2018-12-14')

      wrapper.vm.handleKeyboardInput({ keyCode: 40 }) // down
      expect(wrapper.vm.focusedDate).toEqual('2018-12-21')

      wrapper.vm.handleKeyboardInput({ keyCode: 37 }) // left
      expect(wrapper.vm.focusedDate).toEqual('2018-12-20')
    })

    test('Home/End can be used to jump to start/end of week', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
      })
      wrapper.setData({ showDatepicker: true })

      wrapper.vm.handleKeyboardInput({ keyCode: 36 }) // home
      expect(wrapper.vm.focusedDate).toEqual('2018-12-17')
      wrapper.vm.handleKeyboardInput({ keyCode: 35 }) // end
      expect(wrapper.vm.focusedDate).toEqual('2018-12-23')
    })

    test('keyboard navigation updates current month as needed', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-11-01',
      })
      wrapper.setData({ showDatepicker: true })
      expect(wrapper.vm.visibleMonths[0]).toEqual('2018-11-01')

      wrapper.vm.handleKeyboardInput({ keyCode: 37 }) // left
      expect(wrapper.vm.focusedDate).toEqual('2018-10-31')
      expect(wrapper.vm.visibleMonths[0]).toEqual('2018-10-01')

      wrapper.vm.handleKeyboardInput({ keyCode: 39 }) // right
      expect(wrapper.vm.focusedDate).toEqual('2018-11-01')
      expect(wrapper.vm.visibleMonths[0]).toEqual('2018-11-01')

      wrapper.vm.handleKeyboardInput({ keyCode: 35 }) // end
      expect(wrapper.vm.focusedDate).toEqual('2018-11-04')
      expect(wrapper.vm.visibleMonths[0]).toEqual('2018-11-01')

      wrapper.vm.handleKeyboardInput({ keyCode: 36 }) // home
      expect(wrapper.vm.focusedDate).toEqual('2018-10-29')
      expect(wrapper.vm.visibleMonths[0]).toEqual('2018-10-01')
    })

    test('PgUp/PgDown can be used to change months', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
      })
      wrapper.setData({ showDatepicker: true })

      wrapper.vm.handleKeyboardInput({ keyCode: 33 }) // PgUp
      expect(wrapper.vm.focusedDate).toEqual('2018-11-20')
      wrapper.vm.handleKeyboardInput({ keyCode: 34 }) // PgDn
      expect(wrapper.vm.focusedDate).toEqual('2018-12-20')
    })

    test('enter key can be used to select the currently focused date', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-12-20',
      })
      wrapper.setData({ showDatepicker: true, focusedDate: '2018-12-25' })
      wrapper.vm.handleKeyboardInput({ keyCode: 13, target: { tagName: 'TD' } }) // enter
      expect(wrapper.vm.selectedDate1).toEqual('2018-12-25')
    })

    test('keyboard shortcut menu is shown when user presses ?', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '',
      })
      wrapper.setData({ showDatepicker: true })
      wrapper.vm.handleKeyboardInput({ keyCode: 191 }) // ?
      expect(wrapper.vm.showKeyboardShortcutsMenu).toEqual(true)
    })

    test('esc key closes the currently opened modal', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '',
      })
      wrapper.setData({ showDatepicker: true, showKeyboardShortcutsMenu: true })
      wrapper.vm.handleKeyboardInput({ keyCode: 27 }) // esc
      expect(wrapper.vm.showKeyboardShortcutsMenu).toEqual(false)
      expect(wrapper.vm.showDatepicker).toEqual(true)

      wrapper.vm.handleKeyboardInput({ keyCode: 27 }) // esc
      expect(wrapper.vm.showKeyboardShortcutsMenu).toEqual(false)
      expect(wrapper.vm.showDatepicker).toEqual(false)
    })

    test('resetFocusedDate is called if next/previous month buttons pushes focusedDate offscreen', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-10-20',
      })
      let arg
      const resetFocusedDateSpy = bool => {
        arg = bool
      }
      wrapper.setMethods({ resetFocusedDate: resetFocusedDateSpy })
      wrapper.vm.previousMonth()
      expect(arg).toEqual(false)
      arg = undefined
      wrapper.vm.nextMonth()
      expect(arg).toEqual(true)
    })
  })

  describe('gui', () => {
    test('months shows month and year', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2017-12-10',
      })
      wrapper.setData({ showDatepicker: true })

      expect(wrapper.contains('.asd__month-name')).toBe(true)
      expect(wrapper.find('.asd__month-name').text()).toContain('November 2017')
    })
    test('datepicker wrapper is correct width', () => {
      wrapper = createDatePickerInstance({
        monthsToShow: 2,
      })
      wrapper.setData({ showDatepicker: true })

      let dWrapper = wrapper.find(datepickerWrapper)
      expect(dWrapper.element.style.width).toBe(wrapper.vm.width * 2 + 'px')
    })
    test('selected date get selected class', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2017-12-10',
        dateTwo: '2017-12-15',
      })
      wrapper.setData({ showDatepicker: true })

      expect(wrapper.contains('.asd__day--selected')).toBe(true)
      expect(wrapper.findAll('.asd__day--selected').length).toBe(2)
      expect(wrapper.contains('.asd__day--in-range')).toBe(true)
      expect(wrapper.findAll('.asd__day--in-range').length).toBe(4)
    })
    test('is fullscreen on mobile', () => {
      wrapper = createDatePickerInstance({
        fullscreenMobile: true,
        monthsToShow: 2,
      })
      wrapper.vm.isMobile = true
      wrapper.vm.viewportWidth = '650px'
      wrapper.setData({ showDatepicker: true })

      let dWrapper = wrapper.find(datepickerWrapper)
      expect(dWrapper.classes()).toContain('asd__wrapper--full-screen')
    })
    test('disabled dates are not selectable', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-10-10',
        disabledDates: ['2018-10-20'],
        openOnFocus: true,
      })
      wrapper.vm.triggerElement.dispatchEvent(new Event('focus'))
      wrapper.update()
      const disabledDate = wrapper.find('.asd__day[data-date="2018-10-20"]')
      expect(disabledDate.classes()).toContain('asd__day--disabled')

      disabledDate.find('button').trigger('click')
      expect(wrapper.emitted()['date-one-selected'][0]).not.toEqual(['2018-10-20'])
    })
    test('date are set if user types a valid date in input', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '',
        disabledDates: ['2018-10-20'],
      })
      wrapper.setData({ showDatepicker: true })
      wrapper.vm.handleTriggerInput({ target: { value: '2018-11-23' } })
      expect(wrapper.vm.selectedDate1).toEqual('2018-11-23')

      wrapper.vm.handleTriggerInput({ target: { value: '2018-10-20' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-20')

      wrapper.vm.handleTriggerInput({ target: { value: '20.10.2018' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-20')

      wrapper.vm.handleTriggerInput({ target: { value: '32.10.2018' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-32')
    })

    test('sets classes for selected date', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2019-01-01',
        dateTwo: '2019-01-03',
        openOnFocus: true,
      })
      wrapper.vm.triggerElement.dispatchEvent(new Event('focus'))
      wrapper.update()
      expect(wrapper.findAll('.asd__selected-date-one').length).toBe(1)
      expect(wrapper.findAll('.asd__selected-date-two').length).toBe(1)

      wrapper = createDatePickerInstance({
        dateOne: '2019-01-01',
        openOnFocus: true,
      })
      wrapper.vm.triggerElement.dispatchEvent(new Event('focus'))
      wrapper.update()
      expect(wrapper.findAll('.asd__selected-date-one').length).toBe(1)
      expect(wrapper.findAll('.asd__selected-date-two').length).toBe(0)
    })

    test('setting dateOne to undefined does not set it to todays date', () => {
      wrapper = createDatePickerInstance({
        dateOne: undefined,
        dateTwo: '',
        mode: 'range',
      })
      wrapper.vm.triggerElement.dispatchEvent(new Event('focus'))
      wrapper.update()
      expect(wrapper.findAll('.asd__selected-date-one').length).toBe(0)
    })

    test('datepicker will close automatically if closeOnSelect is true, and all dates have been selected', () => {
      wrapper = createDatePickerInstance({
        dateOne: '',
        dateTwo: '',
        closeAfterSelect: true,
      })
      wrapper.setData({ showDatepicker: true })
      h.wrapperHasClass('asd__wrapper--datepicker-open')
      const date1 = format(new Date(), 'yyyy-MM-dd')
      const date2 = format(addDays(new Date(), 4), 'yyyy-MM-dd')
      h.click('[data-date="' + date1 + '"] > button')
      h.click('[data-date="' + date2 + '"] > button')
      h.wrapperHasNotClass('asd__wrapper--datepicker-open')
    })

    test('sets css class for todays date', () => {
      wrapper = createDatePickerInstance({
        dateOne: '',
        dateTwo: '',
        mode: 'range',
        openOnFocus: true,
      })
      wrapper.vm.triggerElement.dispatchEvent(new Event('focus'))
      wrapper.update()
      expect(wrapper.findAll('.asd__day--today').length).toBe(1)
    })
    test('svg icons can be overridden by passing a slot', () => {
      wrapper = createDatePickerInstance(
        {
          fullscreenMobile: true,
          startOpen: true,
        },
        {},
        {
          'close-icon': '<span id="close-override">x</span>',
          'close-shortcuts-icon': '<span id="close-shortcuts-override">x</span>',
          'previous-month-icon': '<span id="previous-override">&larr;</span>',
          'next-month-icon': '<span id="next-override">&rarr;</span>',
        }
      )
      wrapper.setData({ isMobile: true })
      expect(wrapper.find('#close-override').exists()).toBe(true)
      expect(wrapper.find('#close-shortcuts-override').exists()).toBe(true)
      expect(wrapper.find('#previous-override').exists()).toBe(true)
      expect(wrapper.find('#next-override').exists()).toBe(true)
    })
  })
})

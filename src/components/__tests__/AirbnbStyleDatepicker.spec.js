import { shallow, createLocalVue } from '@vue/test-utils'
import AirbnbStyleDatepicker from '@/components/AirbnbStyleDatepicker'
import ClickOutside from '@/directives/ClickOutside'
import TestHelpers from 'test/test-helpers'

const localVue = createLocalVue()
localVue.directive('click-outside', ClickOutside)
let h

const createDatePickerInstance = (propsData, options) => {
  if (!propsData) {
    propsData = {
      dateOne: '2018-12-20',
      dateTwo: '2018-12-25',
      monthsToShow: 2
    }
  }
  if (!options) {
    options = {}
  }
  const component = {
    ...AirbnbStyleDatepicker,
    ...options
  }
  const wrapper = shallow(component, {
    localVue,
    propsData
  })
  h = new TestHelpers(wrapper, expect)
  return wrapper
}
const datepickerWrapper = '.airbnb-style-datepicker-wrapper'
let wrapper

describe('AirbnbStyleDatepicker', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('lifecycle hooks', () => {
    test('creates correct amount of months', () => {
      wrapper = createDatePickerInstance()
      expect(wrapper.vm.months.length).toEqual(wrapper.props().monthsToShow + 2)
    })
    test('dates are set when initial values are passed', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2018-01-10',
        dateTwo: '2018-01-13'
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
        dateOne: '2018-01-10'
      })
      expect(wrapper.vm.datesSelected).toEqual(true)
    })
    test('allDatesSelected() works', () => {
      wrapper = createDatePickerInstance({
        mode: 'range',
        dateOne: '2018-01-10'
      })
      expect(wrapper.vm.allDatesSelected).toEqual(false)
    })
  })

  describe('methods', () => {
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
        dateOne: '2018-01-10'
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
        showDatepicker: true
      })
      wrapper.vm.closeDatepicker()
      expect(wrapper.vm.showDatepicker).toBe(false)
    })
    test('date is in range', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2018-02-20',
        dateTwo: '2018-02-26'
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
      wrapper.vm.$nextTick(function() {
        expect(wrapper.emitted()['date-one-selected'][0]).toEqual([dateOne])
        expect(wrapper.emitted()['date-two-selected'][0]).toEqual([dateTwo])
      })
    })
    test('month of minDate is shown first', () => {
      wrapper = createDatePickerInstance({ minDate: '2018-05-14' })
      const firstVisibleMonth = wrapper.vm.months[1]
      expect(firstVisibleMonth.monthNumber).toBe(5)
    })
    test('emits closed event on datepicker close', () => {
      wrapper = createDatePickerInstance()
      wrapper.setData({ triggerElement: document.createElement('div') })
      wrapper.vm.closeDatepicker()
      wrapper.vm.$nextTick(function() {
        expect(wrapper.emitted().closed).toBeTruthy()
      })
    })
  })

  describe('gui', () => {
    test('months shows month and year', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2017-12-10'
      })
      wrapper.setData({ showDatepicker: true })

      expect(wrapper.contains('.month-name')).toBe(true)
      expect(wrapper.find('.month-name').text()).toContain('November 2017')
    })
    test('datepicker wrapper is correct width', () => {
      wrapper = createDatePickerInstance({
        monthsToShow: 2
      })
      wrapper.setData({ showDatepicker: true })

      let dWrapper = wrapper.find(datepickerWrapper)
      expect(dWrapper.element.style.width).toBe(wrapper.vm.width * 2 + 'px')
    })
    test('selected date get selected class', () => {
      wrapper = createDatePickerInstance({
        dateOne: '2017-12-10',
        dateTwo: '2017-12-15'
      })
      wrapper.setData({ showDatepicker: true })

      expect(wrapper.contains('.day.selected')).toBe(true)
      expect(wrapper.findAll('.day.selected').length).toBe(2)
      expect(wrapper.contains('.day.in-range')).toBe(true)
      expect(wrapper.findAll('.day.in-range').length).toBe(4)
    })
    test('is fullscreen on mobile', () => {
      wrapper = createDatePickerInstance({
        fullscreenMobile: true,
        monthsToShow: 2
      })
      wrapper.vm.isMobile = true
      wrapper.vm.viewportWidth = '650px'
      wrapper.setData({ showDatepicker: true })

      let dWrapper = wrapper.find(datepickerWrapper)
      expect(dWrapper.classes()).toContain('full-screen')
    })
    test('disabled dates are not selectable', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '2018-10-10',
        disabledDates: ['2018-10-20']
      })
      wrapper.setData({
        triggerElement: document.createElement('div'),
        showDatepicker: true
      })

      const disabledDate = wrapper.find('.day[data-date="2018-10-20"]')
      expect(disabledDate.classes()).toContain('disabled')

      disabledDate.find('button').trigger('click')
      expect(wrapper.emitted()['date-one-selected']).toBeFalsy()
    })
    test('date are set if user types a valid date in input', () => {
      wrapper = createDatePickerInstance({
        mode: 'single',
        dateOne: '',
        disabledDates: ['2018-10-20']
      })
      const triggerElement = document.createElement('input')
      wrapper.setData({ triggerElement, showDatepicker: true })
      wrapper.vm.handleTriggerInput({ target: { value: '2018-11-23' } })
      expect(wrapper.vm.selectedDate1).toEqual('2018-11-23')

      wrapper.vm.handleTriggerInput({ target: { value: '2018-10-20' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-20')

      wrapper.vm.handleTriggerInput({ target: { value: '20.10.2018' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-20')

      wrapper.vm.handleTriggerInput({ target: { value: '32.10.2018' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-32')
    })
  })
})

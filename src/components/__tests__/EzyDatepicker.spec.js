import { shallow, createLocalVue } from 'vue-test-utils'
import EzyDatepicker from '@/components/datepicker/EzyDatepicker'
import bookSecure from 'test/mock/bookSecure'
import Vuex from 'vuex'
import icons from '@/core/icons'

global.bookSecure = bookSecure

const localVue = createLocalVue()
localVue.use(Vuex)

const createDatePickerInstance = propsData => {
  let store = new Vuex.Store({
    state: {
      bookSecure: {
        i18n: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          daysShort: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
        }
      }
    },
    getters: {
      translations: () => ({
        criteria: {
          datesPlaceholder: 'Select dates'
        }
      })
    }
  })
  if (!propsData) {
    propsData = {
      dateOne: '2017-12-20',
      dateTwo: '2017-12-25',
      monthsToShow: 2
    }
  }
  return shallow(EzyDatepicker, {
    localVue,
    mocks: {
      $icons: icons
    },
    propsData,
    store
  })
}
const datepickerWrapper = '.datepicker-wrapper'
let wrapper

describe('EzyDatepicker.vue', () => {
  beforeEach(() => {
    wrapper = createDatePickerInstance()
    jest.resetModules()
    jest.clearAllMocks()
  })
  //lifecycle hooks
  test('creates correct amount of months', () => {
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
    wrapper = createDatePickerInstance({
      sundayFirst: true
    })
    expect(wrapper.vm.days[0]).toBe('Sunday')
  })

  // computed
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
  test('passing in error shows error message', () => {
    wrapper = createDatePickerInstance({
      dateOne: '',
      error: 'Fail hard'
    })
    expect(wrapper.vm.showError).toBeTruthy()
    expect(wrapper.find('.error-messge')).toBeTruthy()
  })

  // methods
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
    wrapper.setData({ showDatepicker: true })
    wrapper.vm.closeDatepicker()
    expect(wrapper.vm.showDatepicker).toBe(false)
  })
  test('toggleDatepicker sets correct value', () => {
    wrapper.vm.toggleDatepicker()
    expect(wrapper.vm.showDatepicker).toBe(true)
    wrapper.vm.toggleDatepicker()
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
    wrapper = createDatePickerInstance({ mode: 'single' })
    const dateOne = '2018-01-10'
    wrapper.vm.selectDate(dateOne)
    wrapper.vm.$nextTick(function() {
      expect(wrapper.emitted().dateOneSelected[0]).toEqual([dateOne])
    })
  })
  test('month of minDate is shown first', () => {
    wrapper = createDatePickerInstance({ minDate: '2018-05-14' })
    const firstVisibleMonth = wrapper.vm.months[1]
    expect(firstVisibleMonth.monthNumber).toBe(5)
  })

  // gui
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
    wrapper.vm.$isMobile = true
    wrapper.vm.$viewportWidth = '650px'
    wrapper.setData({ showDatepicker: true })

    let dWrapper = wrapper.find(datepickerWrapper)
    expect(dWrapper.classes()).toContain('full-screen')
  })

  // Inline datepicker
  describe('Inline datepicker', () => {
    test('datepicker is shown initially', () => {
      const wrapper = createDatePickerInstance({
        monthsToShow: 1,
        inline: true
      })
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find(datepickerWrapper).is('div')).toBe(true)
      })
    })
    test('cant close datepicker if inline', () => {
      const wrapper = createDatePickerInstance({
        inline: true
      })
      wrapper.vm.closeDatepicker()
      expect(wrapper.vm.showDatepicker).toBe(true)
      wrapper.vm.toggleDatepicker()
      expect(wrapper.vm.showDatepicker).toBe(true)
    })
  })
})

import './polyfills'
import Datepicker from './components/AirbnbStyleDatepicker.vue'
import Monthpicker from './components/AirbnbStyleMonthpicker.vue'
import ClickOutside from './directives/ClickOutside'

const AirBnbStyleDatepicker = {
  install(Vue, options) {
    Vue.directive('click-outside', ClickOutside)

    Vue.component(Datepicker.name, {
      ...options,
      ...Datepicker
    })
  }
}

const AirBnbStyleMonthpicker = {
  install(Vue, options) {
    Vue.directive('click-outside', ClickOutside)

    Vue.component(Monthpicker.name, {
      ...options,
      ...Monthpicker
    })
  }
}
// User has to install the component by themselves, to allow to pass options
if (typeof window !== 'undefined' && window.Vue) {
  window.AirBnbStyleDatepicker = AirBnbStyleDatepicker
  window.AirBnbStyleMonthpicker = AirBnbStyleMonthpicker
}

export { AirBnbStyleDatepicker, AirBnbStyleMonthpicker }

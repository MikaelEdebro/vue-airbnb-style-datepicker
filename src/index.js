import './polyfills'
import AirbnbStyleDatepicker from './components/AirbnbStyleDatepicker.vue'

const AirbnbStyleDatepickerPlugin = {
  install(Vue, options) {
    Vue.component(AirbnbStyleDatepicker.name, {
      ...options,
      ...AirbnbStyleDatepicker,
    })
  },
}
console.log('hello')
// User has to install the component by themselves, to allow to pass options
if (typeof window !== 'undefined' && window.Vue) {
  window.AirbnbStyleDatepicker = AirbnbStyleDatepickerPlugin
}
export default AirbnbStyleDatepickerPlugin

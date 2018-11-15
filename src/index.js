import './polyfills'
import AirbnbStyleDatepicker from './components/AirbnbStyleDatepicker.vue'
import ClickOutside from './directives/ClickOutside'
import ResizeSelect from './directives/ResizeSelect'

const AirbnbStyleDatepickerPlugin = {
  install(Vue, options) {
    Vue.directive('click-outside', ClickOutside)
    Vue.directive('resize-select', ResizeSelect)

    Vue.component(AirbnbStyleDatepicker.name, {
      ...options,
      ...AirbnbStyleDatepicker,
    })
  },
}
// User has to install the component by themselves, to allow to pass options
if (typeof window !== 'undefined' && window.Vue) {
  window.AirbnbStyleDatepicker = AirbnbStyleDatepickerPlugin
}
export default AirbnbStyleDatepickerPlugin

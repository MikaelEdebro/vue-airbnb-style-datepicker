import AirbnbStyleDatepicker from './components/AirbnbStyleDatepicker.vue'
import ClickOutside from './directives/ClickOutside'


const AirbnbStyleDatepickerPlugin = {
  install(Vue) {
    Vue.prototype.$viewportWidth = window.innerWidth + 'px'
    Vue.prototype.$isMobile = window.innerWidth < 768

    Vue.directive('click-outside', ClickOutside)

    Vue.component(AirbnbStyleDatepicker.name, AirbnbStyleDatepicker)
  }
}
// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AirbnbStyleDatepickerPlugin)
  window.AirbnbStyleDatepicker = AirbnbStyleDatepickerPlugin
}
export default AirbnbStyleDatepickerPlugin
export { AirbnbStyleDatepicker }
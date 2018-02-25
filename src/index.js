import Datepicker from './components/Datepicker.vue'
const DatepickerPlugin = {
  install(Vue) {
    Vue.component('datepicker', Datepicker)
  }
}
// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(DatepickerPlugin)
  window.Datepicker = DatepickerPlugin
}
//export default DatepickerPlugin
export {
    Datepicker
}
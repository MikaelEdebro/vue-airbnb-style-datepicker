import './polyfills'
import AirbnbStyleDatepicker from './components/AirbnbStyleDatepicker.vue'

const AirbnbStyleDatepickerPlugin = {
  install(app, options = {}) {
    // create a component definition that merges plugin options into the component's data
    const originalData = AirbnbStyleDatepicker.data
    const mergedComponent = {
      ...AirbnbStyleDatepicker,
      data() {
        const original = typeof originalData === 'function' ? originalData.call(this) : (originalData || {})
        return Object.assign({}, original, options)
      },
      // expose plugin options on the component definition so they are available
      // via `this.$options` inside the component (used by setupDatepicker())
      ariaLabels: options.ariaLabels,
      keyboardShortcuts: options.keyboardShortcuts,
      dateLabelFormat: options.dateLabelFormat,
      sundayFirst: options.sundayFirst,
      colors: options.colors,
      monthNames: options.monthNames,
      days: options.days,
      daysShort: options.daysShort,
      texts: options.texts,
    }

    app.component(AirbnbStyleDatepicker.name, mergedComponent)
  },
}

// expose for <script> tag usage
if (typeof window !== 'undefined') {
  window.AirbnbStyleDatepicker = AirbnbStyleDatepickerPlugin
}

export default AirbnbStyleDatepickerPlugin

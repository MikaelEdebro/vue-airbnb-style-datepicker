import Vue from 'vue'
import App from './App.vue'
import AirBnbStyleDatepicker from './../src/index'

Vue.use(AirBnbStyleDatepicker, {
  sundayFirst: false,
  days: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ],
  daysShort: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
  colors: {
    selected: '#00a699',
    inRange: '#66e2da',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#00a699'
  },
  texts: {
    apply: 'Kör',
    cancel: 'Avbryt'
  }
})

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App)
})


import { createApp } from 'vue'
import App from './App.vue'
import AirBnbStyleDatepicker from './../src/index'

const app = createApp(App)
app.use(AirBnbStyleDatepicker, {
  sundayFirst: false,
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  colors: {
    selected: '#00a699',
    inRange: '#66e2da',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#33dacd',
    disabled: '#fff',
  },
  texts: {
    apply: 'Apply',
    cancel: 'Cancel',
  },
})
app.mount('#app')

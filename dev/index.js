import Vue from 'vue'
import App from './App.vue'
import AirBnbStyleDatepicker from './../src/index'

Vue.use(AirBnbStyleDatepicker, {})

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App)
})

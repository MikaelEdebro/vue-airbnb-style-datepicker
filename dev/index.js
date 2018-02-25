import Vue from 'vue'
import App from './App.vue'
import Datepicker from './../src/index'

Vue.use(Datepicker)

new Vue({
  el: '#app',
  render: h => h(App)
})
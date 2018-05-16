import Vue from 'vue'
import App from './App.vue'
import { AirBnbStyleDatepicker, AirBnbStyleMonthpicker } from './../src/index'

Vue.use(AirBnbStyleDatepicker, {
  sundayFirst: false,
  days: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
  daysShort: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  colors: {
    selected: '#00a699',
    inRange: '#66e2da',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#33dacd',
    disabled: '#fff'
  },
  texts: {
    apply: 'Aceptar',
    cancel: 'Cancelar'
  }
})

Vue.use(AirBnbStyleMonthpicker)

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App)
})

<template>
  <div class="datepicker-trigger">
    <input
      type="text"
      id="datepicker-trigger"
      placeholder="Select dates"
      :value="formatDates(dateOne, dateTwo)"
    >

    <AirbnbStyleDatepicker
      :trigger-element-id="'datepicker-trigger'"
      :mode="'range'"
      :fullscreen-mobile="true"
      :date-one="dateOne"
      :date-two="dateTwo"
      @dateOneSelected="val => { dateOne = val }"
      @dateTwoSelected="val => { dateTwo = val }"
    />
  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  data() {
    return {
      dateFormat: 'D MMM',
      dateOne: '',
      dateTwo: ''
    }
  },
  methods: {
    formatDates(dateOne, dateTwo) {
      let formattedDates = ''
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat)
      }
      if (dateTwo) {
        formattedDates += ' - ' + format(dateTwo, this.dateFormat)
      }
      return formattedDates
    }
  }
}
</script>

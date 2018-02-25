<template>
  <div>
    <h1>Main app</h1>
    <input type="text" :value="formattedDate" id="datepicker-trigger">

    <airbnb-style-datepicker
      :mode="'range'"
      :fullscreen-mobile="true"
      :date-one="dateOne"
      :date-two="dateTwo"
      :min-date="'2018-02-28'"
      :months-to-show="2"
      :label="'Dates'"
      :placeholder="'Select date(s)'"
      :sunday-first="false"
      :error="''"
      :id="'airbnb-style-datepicker'"
      :trigger-element-id="'datepicker-trigger'"
      @dateOneSelected="val => { dateOne = val }"
      @dateTwoSelected="val => { dateTwo = val }"
    ></airbnb-style-datepicker>

  </div>
</template>

<script>
export default {
  data() {
    return {
      dateOne: '',
      dateTwo: ''
    }
  },
  computed: {
    formattedDate() {
      return this.dateOne + ' ' + this.dateTwo
    }
  }
}
</script>

<style>
html, body {
  min-height: 100vh;
}
</style>

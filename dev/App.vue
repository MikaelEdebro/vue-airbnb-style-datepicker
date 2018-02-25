<template>
  <div>
    <h1>airbnb-style-datepicker</h1>

    <div class="datepicker-container with-input">
      <h3>Range datepicker with input</h3>
      <div class="datepicker-trigger">
        <input type="text" :value="formatDates(inputDateOne, inputDateTwo)" id="datepicker-input-trigger" placeholder="Select dates">

        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-input-trigger'"
          :mode="'range'"
          :fullscreen-mobile="true"
          :date-one="inputDateOne"
          :date-two="inputDateTwo"
          :min-date="'2018-02-28'"
          :months-to-show="2"
          :start-open="false"
          :mobile-header="'Välj datum'"
          @dateOneSelected="val => { inputDateOne = val }"
          @dateTwoSelected="val => { inputDateTwo = val }"
        ></airbnb-style-datepicker>
      </div>
    </div>

    <div class="datepicker-container with-button">
      <h3>Range datepicker with button</h3>
      <div class="datepicker-trigger">
        <button id="datepicker-button-trigger">{{formatDates(buttonDateOne, buttonDateTwo) || 'Select dates'}}</button>

        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-button-trigger'"
          :mode="'range'"
          :fullscreen-mobile="true"
          :date-one="buttonDateOne"
          :date-two="buttonDateTwo"
          :min-date="'2018-02-28'"
          :months-to-show="2"
          :start-open="false"
          :offset="10"
          @dateOneSelected="val => { buttonDateOne = val }"
          @dateTwoSelected="val => { buttonDateTwo = val }"
        ></airbnb-style-datepicker>
      </div>
    </div>

    <div class="datepicker-container inline-with-input">
      <h3>Inline datepicker with input</h3>
      <input type="text" :value="formatDates(inlineDateOne)" id="datepicker-inline-trigger" placeholder="Select date">
      <airbnb-style-datepicker
        :trigger-element-id="'datepicker-inline-trigger'"
        :mode="'single'"
        :inline="true"
        :fullscreen-mobile="false"
        :date-one="inlineDateOne"
        :months-to-show="1"
        @dateOneSelected="val => { inlineDateOne = val }"
      ></airbnb-style-datepicker>
    </div>

  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  data() {
    return {
      dateFormat: 'D MMM',
      inputDateOne: '',
      inputDateTwo: '',
      buttonDateOne: '',
      buttonDateTwo: '',
      inlineDateOne: '',
      sundayDateOne: '',
      sundayFirst: false
    }
  },
  computed: {},
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

<style>
html,
body {
  min-height: 100vh;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 18px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
.datepicker-container {
  position: relative;
  margin-bottom: 30px;
}

#datepicker-button-trigger {
  background: #008489;
  border: 1px solid #008489;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  min-width: 200px;
}
input {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.align-right {
  text-align: right;
}
</style>

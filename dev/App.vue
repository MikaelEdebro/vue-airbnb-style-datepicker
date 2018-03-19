<template>
  <div>
    <!-- <TestComponent /> -->

    <div class="datepicker-container with-input">
      <h3>Range datepicker with input</h3>
      <div class="datepicker-trigger">
        <input
          type="text"
          id="datepicker-input-trigger"
          :value="formatDates(inputDateOne, inputDateTwo)"
          placeholder="Select dates"
        >

        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-input-trigger'"
          :mode="'range'"
          :fullscreen-mobile="true"
          :date-one="inputDateOne"
          :date-two="inputDateTwo"
          :min-date="'2018-02-28'"
          :end-date="'2018-05-10'"
          :months-to-show="2"
          :start-open="false"
          @dateOneSelected="val => { inputDateOne = val }"
          @dateTwoSelected="val => { inputDateTwo = val }"
        />
      </div>
    </div>

    <div class="datepicker-container with-button">
      <h3>Range datepicker with button</h3>
      <div class="datepicker-trigger">
        <button id="datepicker-button-trigger">{{ formatDates(buttonDateOne, buttonDateTwo) || 'Select dates' }}</button>

        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-button-trigger'"
          :mode="'range'"
          :fullscreen-mobile="true"
          :date-one="buttonDateOne"
          :date-two="buttonDateTwo"
          :min-date="'2018-02-28'"
          :months-to-show="2"
          :start-open="false"
          :offset-y="10"
          @dateOneSelected="val => { buttonDateOne = val }"
          @dateTwoSelected="val => { buttonDateTwo = val }"
        />
      </div>
    </div>

    <div class="datepicker-container inline-with-input">
      <h3>Inline datepicker with input</h3>
      <input
        id="datepicker-inline-trigger"
        :value="formatDates(inlineDateOne)"
        type="text"
        placeholder="Select date"
      >
      <airbnb-style-datepicker
        :trigger-element-id="'datepicker-inline-trigger'"
        :mode="'single'"
        :inline="true"
        :fullscreen-mobile="false"
        :date-one="inlineDateOne"
        :months-to-show="1"
        @dateOneSelected="val => { inlineDateOne = val }"
      />
    </div>

  </div>
</template>

<script>
import format from 'date-fns/format'
import TestComponent from './TestComponent'

export default {
  components: {
    TestComponent
  },
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

<style lang="scss">
html,
body {
  min-height: 100vh;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 18px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  padding: 10px;
}
h1 {
  font-size: 1.8em;
  line-height: 1.5em;
}
.datepicker-container {
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
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.align-right {
  text-align: right;
}
.with-input {
  text-align: right;
  .datepicker-trigger {
    padding-right: 40px;
  }
}
.with-button {
  .datepicker-trigger {
    padding-left: 10px;
  }
}
.inline-with-input {
  width: 300px;
  input {
    width: 100%;
  }
}
</style>

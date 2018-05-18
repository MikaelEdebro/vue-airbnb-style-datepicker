<template>
  <div class="app" :class="{'align-right': alignRight}">
    <div v-if="showDatepickers">
      <!--  <div class="monthpicker-container with-input">
        <h3>Range monthpicker with input</h3>
        <div class="monthpicker-trigger">
          <input
            type="text"
            id="monthpicker-input-trigger"
            :value="formatDates(inputDateOne, inputDateTwo)"
            placeholder="Select dates"
          >

          <airbnb-style-monthpicker
            :trigger-element-id="'monthpicker-input-trigger'"
            :mode="'range'"

            :min-date="'28-02-2018'"
            :months-to-show="2"
            :show-action-buttons="true"
            @date-one-selected="val => { inputDateOne = val }"
            @date-two-selected="val => { inputDateTwo = val }"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div> -->
      <!--
      <div class="monthpicker-container single-with-input">
        <h3>Single monthpicker with input</h3>
        <div class="monthpicker-trigger">
          <input
            type="text"
            id="monthpicker-input-single-trigger"
            :value="formatDates(inputSingleDateOne)"
            placeholder="Select dates"
          >

          <airbnb-style-monthpicker
            :trigger-element-id="'monthpicker-input-single-trigger'"
            :mode="'single'"
            :months-to-show="2"
            @date-one-selected="val => { inputSingleDateOne = val }"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div> -->

      <div class="monthpicker-container with-button">
        <h3>Range monthpicker with button</h3>
        <div class="monthpicker-trigger">
          <button id="monthpicker-button-trigger-1">{{ formatDates(buttonDateOne, buttonDateTwo) || 'Select dates' }}</button>

          <airbnb-style-monthpicker
            :month-one="''"
            :month-two="''"
            :trigger-element-id="'monthpicker-button-trigger-1'"
            :mode="'range'"
            :fullscreen-mobile="true"
            :months-to-show="2"
            :trigger="trigger"
            :offset-y="10"
            @date-one-selected="val => { buttonDateOne = val }"
            @date-two-selected="val => { buttonDateTwo = val }"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="monthpicker-container with-button">
        <h3>Range monthpicker with button</h3>
        <div class="monthpicker-trigger">
          <button id="monthpicker-button-trigger">{{ formatDates(buttonDateOne, buttonDateTwo) || 'Select dates' }}</button>

          <airbnb-style-monthpicker
            :month-one="'Febrero 2018'"
            :month-two="''"
            :trigger-element-id="'monthpicker-button-trigger'"
            :mode="'range'"
            :inline="true"
            :fullscreen-mobile="true"
            :months-to-show="2"
            :trigger="trigger"
            :offset-y="10"
            @date-one-selected="val => { buttonDateOne = val }"
            @date-two-selected="val => { buttonDateTwo = val }"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="monthpicker-container inline-with-input">
        <h3>Inline monthpicker with input</h3>
        <input
          id="monthpicker-inline-trigger"
          :value="formatDates(inlineDateOne)"
          type="text"
          placeholder="Select date"
        >
        <airbnb-style-monthpicker
          :month-one="''"
          :min-month="'Marzo 2020'"
          :trigger-element-id="'monthpicker-inline-trigger'"
          :mode="'single'"
          :inline="true"
          :fullscreen-mobile="false"
          :months-to-show="2"
          @date-one-selected="val => { inlineDateOne = val }"
          @apply="applyMethod"
          @closed="closedMethod"
        />
      </div>
    </div>

    <button @click="toggleDatepickers">Hide monthpickers</button>
    <button @click="toggleAlign">Toggle alignment</button>
    <button @click="toggleTrigger">Toggle trigger</button>
  </div>
</template>

<script>
import format from 'date-fns/format'

export default {
  data() {
    return {
      dateFormat: 'MMMM YYYY', //'D MMM',
      inputDateOne: '',
      inputDateTwo: '',
      inputSingleDateOne: '',
      buttonDateOne: '',
      buttonDateTwo: '',
      inlineDateOne: '',
      sundayDateOne: '',
      sundayFirst: false,
      alignRight: false,
      showDatepickers: true,
      trigger: false
    }
  },
  computed: {},
  created() {
    // setTimeout(() => {
    //   this.inputDateOne = '2019-01-12'
    //   this.inputDateTwo = '2019-01-15'
    // }, 5000)
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
    },
    toggleAlign() {
      this.alignRight = !this.alignRight
    },
    toggleDatepickers() {
      this.showDatepickers = !this.showDatepickers
    },
    toggleTrigger() {
      this.trigger = !this.trigger
    },
    applyMethod() {
      console.log('apply')
    },
    closedMethod() {
      console.log('closed')
      this.trigger = false
    }
  }
}
</script>

<style lang="scss">
html,
body {
  min-height: 200vh;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
  Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 18px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  padding: 10px;
}
.app {
  &.align-right {
    text-align: right;
  }
}
h1 {
  font-size: 1.8em;
  line-height: 1.5em;
}
.monthpicker-container {
  margin-bottom: 30px;
}

#monthpicker-button-trigger {
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
.with-input {
  .monthpicker-trigger {
    //padding-right: 40px;
  }
}
.with-button {
  .monthpicker-trigger {
    //padding-left: 10px;
  }
}
// .inline-with-input {
  //   width: 600px;
  //   input {
    //     width: 100%;
    //   }
    // }
    </style>

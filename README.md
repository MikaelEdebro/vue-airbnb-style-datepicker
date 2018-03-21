# vue-airbnb-style-datepicker

This is a VueJs version of the popular AirBnb datepicker.

<img src="https://raw.githubusercontent.com/MikaelEdebro/vue-airbnb-style-datepicker/master/docs/images/datepicker-tablet.gif" width="1124" alt="Datepicker on tablet">
<img src="https://raw.githubusercontent.com/MikaelEdebro/vue-airbnb-style-datepicker/master/docs/images/datepicker-mobile.gif" width="425" alt="Datepicker on mobile">

## Installation

With NPM:

```
npm install vue-airbnb-style-datepicker --save
```

With Yarn:

```
yarn add vue-airbnb-style-datepicker
```

NB: This plugin is dependant on VueJS 2.x and [date-fns](https://date-fns.org/) (for date manipulation). Make sure you have these dependencies installed.

## Enable plugin in your app

First off, tell Vue to use the plugin in your main.js:

```javascript
import Vue from 'vue'
import App from './App.vue'

// import component and stylesheet
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/styles.css'

// configure global options (optional)
const datepickerOptions = {
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
    apply: 'Apply',
    cancel: 'Cancel'
  }
}

// make sure we can use it in our components
Vue.use(AirbnbStyleDatepicker, datepickerOptions)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

The `options` is optional. It is only needed if you want to overwrite default colors, texts etc. For example if your site uses another language than english. Note that `days` and `daysShort` always should start with Monday.

## Use plugin

Add datepicker in your component like this:

```html
<template>
  <div>
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
        @date-one-selected="val => { dateOne = val }"
        @date-two-selected="val => { dateTwo = val }"
      />
    </div>
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
```

NB: Note that you need to wrap the datepicker in a `<div class="datepicker-trigger">`. This is used as the base for the positioning of the datepicker.
Also note that the id of element that triggers the datepicker needs to be the same as prop `:trigger-element`.
<br><br>
This plugin does not dictate how you show the dates. This allows for more flexibility since you can use whatever trigger element you want. The value is being emitted from the component when a date is selected, and handled in the `@date-one-selected` and `@date-two-selected` methods. Then you just assign the value to your data properties. And it is up to you to decide how you want to display the dates.<br>
The `formatDates()` methods is just an example of how it can be solved.

### Properties & events for `<AirbnbStyleDatepicker />`
| Prop name  | Value |
| ------------- | ------------- |
| triggerElementId  | The id of the element that user clicks on (without #).<br>Type: String, Required  |
| mode  | If datepicker should select a range or just a single date.<br>Type: String, Required, Values: `'single|range'`, Default: `'range'`  |
| dateOne  | Model for first date.<br>Type: String, Required  |
| dateTwo  | Model for second date.<br>Type: String, Required if using `mode="range"` |
| minDate  | Disable dates before this.<br>Type: String |
| endDate  | Disable dates after this.<br>Type: String |
| offsetY  | Offset vertical position of datepicker (in pixels from `.datepicker-trigger` bottom).<br>Type: Number, Default: 0 |
| offsetX  | Offset horisontal position of datepicker (in pixels from `.datepicker-trigger` left or right depending on alignment).<br>Type: Number, Default: 0 |
| monthsToShow  | How many months to show. For mobile it's always 1.<br>Type: Number, Default: 2 |
| startOpen  | If you want the datepicker start open<br>Type: Boolean, Default: false |
| fullscreenMobile  | Show fullscreen view on mobile.<br>Type: Boolean, Default: false |
| mobileHeader  | Text to show on mobile header<br>Type: String, Default: 'Select dates' |
| inline  | Use inline mode (datepicker always showing)<br>Type: Boolean, Default: false |
| @date-one-selected  | Callback to handle saving date<br>Required |
| @date-two-selected  | Callback to handle saving date<br>Required if using `mode="range"` |

<br><br>
*Example with all properties (not recommended, only to show values)*:
```html
<AirbnbStyleDatepicker
  :trigger-element-id="'datepicker-trigger'"
  :mode="'range'"
  :date-one="dateOne"
  :date-two="dateTwo"
  :min-date="'2018-10-12'"
  :end-date="'2021-01-01'"
  :offset-y="30"
  :months-to-show="2"
  :start-open="true"
  :fullscreen-mobile="true"
  :mobile-header="'Mobile header text'"
  :inline="true"
  @date-one-selected="val => { dateOne = val }"
  @date-two-selected="val => { dateTwo = val }"
/>
```

## Usage in non Single Page App (SPA)
If you're using Vue to enhance your server rendered page, you can use a CDN to load the plugin. This is a simple example:
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Test CDN</title>
  <link rel="stylesheet" href="https://unpkg.com/vue-airbnb-style-datepicker@latest/dist/styles.css">
</head>

<body>
  <div id="app">
    <div class="datepicker-trigger">
      <input type="text" id="trigger" :value="date1">
      <airbnb-style-datepicker
        :trigger-element-id="'trigger'"
        :mode="'single'"
        :date-one="date1"
        v-on:date-one-selected="function(val) { date1 = val }"
      ></airbnb-style-datepicker>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.29.0/date_fns.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-airbnb-style-datepicker@latest/dist/vue-airbnb-style-datepicker.js"></script>
  <script>
    var app = new Vue({
      el: '#app',
      data: {
        date1: ''
      }
    })
  </script>
</body>
</html>
```

## Browser support
This datepicker have been tested with the following browsers:

IE: 9 and higher
Safari: 7.1 and higher

However, these tests have not been extensive. More or less just trying the datepicker out, and see that it doesn't throw any console errors etc. If you're planning on using this in production, make sure that it runs smoothly in the browsers that you're planning on supporting.

## Contribute

I gladly accept contributions to improve this datepicker. However, to avoid you doing a bunch of work in vain, please first create a PR discussion so we can agree that the changes makes sense.

It's very easy to start the development workflow. Just run the commands below.

```
git clone https://github.com/MikaelEdebro/vue-airbnb-style-datepicker.git

npm install

npm run dev
```

This will start the development server and serve the content in `/dev` folder. Then you can just start hacking away.


## Roadmap/todo:s

- Improve logic for positioning of datepicker. Support for showing the datepicker above the input if it doesn't fit below.

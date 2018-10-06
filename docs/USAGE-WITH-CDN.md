# Usage in non Single Page App (SPA)

If you're not using Webpack (or any other JS module bundler), and is just using Vue to enhance your server rendered page, you can use a CDN to load the plugin. This is a simple example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Test CDN</title>
  <link rel="stylesheet" href="https://unpkg.com/vue-airbnb-style-datepicker@2.0.2/dist/vue-airbnb-style-datepicker.min.css">
  <style>
  html, body {
    min-height: 100vh;
  }
  </style>
</head>

<body>
  <div id="app">
    <div class="datepicker-trigger">
      <input type="text" id="trigger-range" :value="date1 + ' - ' + date2" readonly>
      <airbnb-style-datepicker
        :trigger-element-id="'trigger-range'"
        :date-one="date1"
        :date-two="date2"
        v-on:date-one-selected="function(val) { date1 = val }"
        v-on:date-two-selected="function(val) { date2 = val }"
      ></airbnb-style-datepicker>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://unpkg.com/vue-airbnb-style-datepicker@2.0.2/dist/vue-airbnb-style-datepicker.min.js"></script>
  <script>
    // define options (optional)
    var datepickerOptions = {
      sundayFirst: true
    }
    // install plugin
    Vue.use(window.AirbnbStyleDatepicker, datepickerOptions)

    var app = new Vue({
      el: '#app',
      data: {
        date1: '',
        date2: ''
      }
    })
  </script>
</body>
</html>
```

This version comes with the the neccesary [date-fns](https://date-fns.org/) methods bundled, so no need to add date-fns as a dependency. If you however are already using date-fns for your other site logic, I would highly recommend using the version without bundled dependencies. This is much smaller and there's no need to have duplicated code:

```html
<script src="https://unpkg.com/vue-airbnb-style-datepicker@2.0.2/dist/no-dep/vue-airbnb-style-datepicker.min.js"></script>
```

The methods used (and that you need to include in your app) are the following. Note, this only applies if you're using the `no-dep` version:

```javascript
import format from 'date-fns/format'
import subMonths from 'date-fns/sub_months'
import addMonths from 'date-fns/add_months'
import getDaysInMonth from 'date-fns/get_days_in_month'
import lastDayOfMonth from 'date-fns/last_day_of_month'
import getMonth from 'date-fns/get_month'
import setMonth from 'date-fns/set_month'
import getYear from 'date-fns/get_year'
import setYear from 'date-fns/set_year'
import isSameMonth from 'date-fns/is_same_month'
import isSameDay from 'date-fns/is_same_day'
import addDays from 'date-fns/add_days'
import subDays from 'date-fns/sub_days'
import addWeeks from 'date-fns/add_weeks'
import subWeeks from 'date-fns/sub_weeks'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
import isValid from 'date-fns/is_valid'
```

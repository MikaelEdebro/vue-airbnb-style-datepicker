## Usage in non Single Page App (SPA)
If you're using Vue to enhance your server rendered page, you can use a CDN to load the plugin. This is a simple example:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Test CDN</title>
  <link rel="stylesheet" href="https://unpkg.com/vue-airbnb-style-datepicker@latest/dist/styles.css">
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
  <script src="https://unpkg.com/vue-airbnb-style-datepicker@latest/dist/vue-airbnb-style-datepicker.min.js"></script>
  <script>
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

This version comes with the the neccesary [date-fns](https://date-fns.org/) methods bundled, so no need to add date-fns as a dependency.
If you however are already using date-fns for your other site logic, I would highly recommend using the version without bundled dependencies. This is much smaller and there's no need to have duplicated code:
```html
<script src="https://unpkg.com/vue-airbnb-style-datepicker@latest/dist/no-dep/vue-airbnb-style-datepicker.min.js"></script>
```

The methods used (and that you need to include in your app) are the following. Note, this only applies if you're using the `no-dep` version:
```javascript
import format from 'date-fns/format'
import subMonths from 'date-fns/sub_months'
import addMonths from 'date-fns/add_months'
import getDaysInMonth from 'date-fns/get_days_in_month'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
```

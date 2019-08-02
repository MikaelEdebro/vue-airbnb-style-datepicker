(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.vueAirbnbStyleDatepicker = factory());
}(this, (function () { 'use strict';

  /* eslint-disable */
  if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s);
      var i = matches.length;

      while (--i >= 0 && matches.item(i) !== this) {}

      return i > -1;
    };
  }

  if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
      value: function assign(target, varArgs) {
        var arguments$1 = arguments;


        if (target == null) {
          // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments$1[index];

          if (nextSource != null) {
            // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }

        return to;
      },
      writable: true,
      configurable: true
    });
  } // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex


  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

        var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.


        var thisArg = arguments[1]; // 5. Let k be 0.

        var k = 0; // 6. Repeat, while k < len

        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return k.
          var kValue = o[k];

          if (predicate.call(thisArg, kValue, k, o)) {
            return k;
          } // e. Increase k by 1.


          k++;
        } // 7. Return -1.


        return -1;
      }
    });
  }

  /**
   * @category Common Helpers
   * @summary Is the given argument an instance of Date?
   *
   * @description
   * Is the given argument an instance of Date?
   *
   * @param {*} argument - the argument to check
   * @returns {Boolean} the given argument is an instance of Date
   *
   * @example
   * // Is 'mayonnaise' a Date?
   * var result = isDate('mayonnaise')
   * //=> false
   */
  function isDate (argument) {
    return argument instanceof Date
  }

  var is_date = isDate;

  var MILLISECONDS_IN_HOUR = 3600000;
  var MILLISECONDS_IN_MINUTE = 60000;
  var DEFAULT_ADDITIONAL_DIGITS = 2;

  var parseTokenDateTimeDelimeter = /[T ]/;
  var parseTokenPlainTime = /:/;

  // year tokens
  var parseTokenYY = /^(\d{2})$/;
  var parseTokensYYY = [
    /^([+-]\d{2})$/, // 0 additional digits
    /^([+-]\d{3})$/, // 1 additional digit
    /^([+-]\d{4})$/ // 2 additional digits
  ];

  var parseTokenYYYY = /^(\d{4})/;
  var parseTokensYYYYY = [
    /^([+-]\d{4})/, // 0 additional digits
    /^([+-]\d{5})/, // 1 additional digit
    /^([+-]\d{6})/ // 2 additional digits
  ];

  // date tokens
  var parseTokenMM = /^-(\d{2})$/;
  var parseTokenDDD = /^-?(\d{3})$/;
  var parseTokenMMDD = /^-?(\d{2})-?(\d{2})$/;
  var parseTokenWww = /^-?W(\d{2})$/;
  var parseTokenWwwD = /^-?W(\d{2})-?(\d{1})$/;

  // time tokens
  var parseTokenHH = /^(\d{2}([.,]\d*)?)$/;
  var parseTokenHHMM = /^(\d{2}):?(\d{2}([.,]\d*)?)$/;
  var parseTokenHHMMSS = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/;

  // timezone tokens
  var parseTokenTimezone = /([Z+-].*)$/;
  var parseTokenTimezoneZ = /^(Z)$/;
  var parseTokenTimezoneHH = /^([+-])(\d{2})$/;
  var parseTokenTimezoneHHMM = /^([+-])(\d{2}):?(\d{2})$/;

  /**
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If an argument is a string, the function tries to parse it.
   * Function accepts complete ISO 8601 formats as well as partial implementations.
   * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
   *
   * If all above fails, the function passes the given argument to Date constructor.
   *
   * @param {Date|String|Number} argument - the value to convert
   * @param {Object} [options] - the object with options
   * @param {0 | 1 | 2} [options.additionalDigits=2] - the additional number of digits in the extended year format
   * @returns {Date} the parsed date in the local time zone
   *
   * @example
   * // Convert string '2014-02-11T11:30:30' to date:
   * var result = parse('2014-02-11T11:30:30')
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Parse string '+02014101',
   * // if the additional number of digits in the extended year format is 1:
   * var result = parse('+02014101', {additionalDigits: 1})
   * //=> Fri Apr 11 2014 00:00:00
   */
  function parse (argument, dirtyOptions) {
    if (is_date(argument)) {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime())
    } else if (typeof argument !== 'string') {
      return new Date(argument)
    }

    var options = dirtyOptions || {};
    var additionalDigits = options.additionalDigits;
    if (additionalDigits == null) {
      additionalDigits = DEFAULT_ADDITIONAL_DIGITS;
    } else {
      additionalDigits = Number(additionalDigits);
    }

    var dateStrings = splitDateString(argument);

    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    var year = parseYearResult.year;
    var restDateString = parseYearResult.restDateString;

    var date = parseDate(restDateString, year);

    if (date) {
      var timestamp = date.getTime();
      var time = 0;
      var offset;

      if (dateStrings.time) {
        time = parseTime(dateStrings.time);
      }

      if (dateStrings.timezone) {
        offset = parseTimezone(dateStrings.timezone);
      } else {
        // get offset accurate to hour in timezones that change offset
        offset = new Date(timestamp + time).getTimezoneOffset();
        offset = new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE).getTimezoneOffset();
      }

      return new Date(timestamp + time + offset * MILLISECONDS_IN_MINUTE)
    } else {
      return new Date(argument)
    }
  }

  function splitDateString (dateString) {
    var dateStrings = {};
    var array = dateString.split(parseTokenDateTimeDelimeter);
    var timeString;

    if (parseTokenPlainTime.test(array[0])) {
      dateStrings.date = null;
      timeString = array[0];
    } else {
      dateStrings.date = array[0];
      timeString = array[1];
    }

    if (timeString) {
      var token = parseTokenTimezone.exec(timeString);
      if (token) {
        dateStrings.time = timeString.replace(token[1], '');
        dateStrings.timezone = token[1];
      } else {
        dateStrings.time = timeString;
      }
    }

    return dateStrings
  }

  function parseYear (dateString, additionalDigits) {
    var parseTokenYYY = parseTokensYYY[additionalDigits];
    var parseTokenYYYYY = parseTokensYYYYY[additionalDigits];

    var token;

    // YYYY or ±YYYYY
    token = parseTokenYYYY.exec(dateString) || parseTokenYYYYY.exec(dateString);
    if (token) {
      var yearString = token[1];
      return {
        year: parseInt(yearString, 10),
        restDateString: dateString.slice(yearString.length)
      }
    }

    // YY or ±YYY
    token = parseTokenYY.exec(dateString) || parseTokenYYY.exec(dateString);
    if (token) {
      var centuryString = token[1];
      return {
        year: parseInt(centuryString, 10) * 100,
        restDateString: dateString.slice(centuryString.length)
      }
    }

    // Invalid ISO-formatted year
    return {
      year: null
    }
  }

  function parseDate (dateString, year) {
    // Invalid ISO-formatted year
    if (year === null) {
      return null
    }

    var token;
    var date;
    var month;
    var week;

    // YYYY
    if (dateString.length === 0) {
      date = new Date(0);
      date.setUTCFullYear(year);
      return date
    }

    // YYYY-MM
    token = parseTokenMM.exec(dateString);
    if (token) {
      date = new Date(0);
      month = parseInt(token[1], 10) - 1;
      date.setUTCFullYear(year, month);
      return date
    }

    // YYYY-DDD or YYYYDDD
    token = parseTokenDDD.exec(dateString);
    if (token) {
      date = new Date(0);
      var dayOfYear = parseInt(token[1], 10);
      date.setUTCFullYear(year, 0, dayOfYear);
      return date
    }

    // YYYY-MM-DD or YYYYMMDD
    token = parseTokenMMDD.exec(dateString);
    if (token) {
      date = new Date(0);
      month = parseInt(token[1], 10) - 1;
      var day = parseInt(token[2], 10);
      date.setUTCFullYear(year, month, day);
      return date
    }

    // YYYY-Www or YYYYWww
    token = parseTokenWww.exec(dateString);
    if (token) {
      week = parseInt(token[1], 10) - 1;
      return dayOfISOYear(year, week)
    }

    // YYYY-Www-D or YYYYWwwD
    token = parseTokenWwwD.exec(dateString);
    if (token) {
      week = parseInt(token[1], 10) - 1;
      var dayOfWeek = parseInt(token[2], 10) - 1;
      return dayOfISOYear(year, week, dayOfWeek)
    }

    // Invalid ISO-formatted date
    return null
  }

  function parseTime (timeString) {
    var token;
    var hours;
    var minutes;

    // hh
    token = parseTokenHH.exec(timeString);
    if (token) {
      hours = parseFloat(token[1].replace(',', '.'));
      return (hours % 24) * MILLISECONDS_IN_HOUR
    }

    // hh:mm or hhmm
    token = parseTokenHHMM.exec(timeString);
    if (token) {
      hours = parseInt(token[1], 10);
      minutes = parseFloat(token[2].replace(',', '.'));
      return (hours % 24) * MILLISECONDS_IN_HOUR +
        minutes * MILLISECONDS_IN_MINUTE
    }

    // hh:mm:ss or hhmmss
    token = parseTokenHHMMSS.exec(timeString);
    if (token) {
      hours = parseInt(token[1], 10);
      minutes = parseInt(token[2], 10);
      var seconds = parseFloat(token[3].replace(',', '.'));
      return (hours % 24) * MILLISECONDS_IN_HOUR +
        minutes * MILLISECONDS_IN_MINUTE +
        seconds * 1000
    }

    // Invalid ISO-formatted time
    return null
  }

  function parseTimezone (timezoneString) {
    var token;
    var absoluteOffset;

    // Z
    token = parseTokenTimezoneZ.exec(timezoneString);
    if (token) {
      return 0
    }

    // ±hh
    token = parseTokenTimezoneHH.exec(timezoneString);
    if (token) {
      absoluteOffset = parseInt(token[2], 10) * 60;
      return (token[1] === '+') ? -absoluteOffset : absoluteOffset
    }

    // ±hh:mm or ±hhmm
    token = parseTokenTimezoneHHMM.exec(timezoneString);
    if (token) {
      absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10);
      return (token[1] === '+') ? -absoluteOffset : absoluteOffset
    }

    return 0
  }

  function dayOfISOYear (isoYear, week, day) {
    week = week || 0;
    day = day || 0;
    var date = new Date(0);
    date.setUTCFullYear(isoYear, 0, 4);
    var fourthOfJanuaryDay = date.getUTCDay() || 7;
    var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date
  }

  var parse_1 = parse;

  /**
   * @category Year Helpers
   * @summary Return the start of a year for the given date.
   *
   * @description
   * Return the start of a year for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a year
   *
   * @example
   * // The start of a year for 2 September 2014 11:55:00:
   * var result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
   * //=> Wed Jan 01 2014 00:00:00
   */
  function startOfYear (dirtyDate) {
    var cleanDate = parse_1(dirtyDate);
    var date = new Date(0);
    date.setFullYear(cleanDate.getFullYear(), 0, 1);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_year = startOfYear;

  /**
   * @category Day Helpers
   * @summary Return the start of a day for the given date.
   *
   * @description
   * Return the start of a day for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a day
   *
   * @example
   * // The start of a day for 2 September 2014 11:55:00:
   * var result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 02 2014 00:00:00
   */
  function startOfDay (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_day = startOfDay;

  var MILLISECONDS_IN_MINUTE$1 = 60000;
  var MILLISECONDS_IN_DAY = 86400000;

  /**
   * @category Day Helpers
   * @summary Get the number of calendar days between the given dates.
   *
   * @description
   * Get the number of calendar days between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar days
   *
   * @example
   * // How many calendar days are between
   * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
   * var result = differenceInCalendarDays(
   *   new Date(2012, 6, 2, 0, 0),
   *   new Date(2011, 6, 2, 23, 0)
   * )
   * //=> 366
   */
  function differenceInCalendarDays (dirtyDateLeft, dirtyDateRight) {
    var startOfDayLeft = start_of_day(dirtyDateLeft);
    var startOfDayRight = start_of_day(dirtyDateRight);

    var timestampLeft = startOfDayLeft.getTime() -
      startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE$1;
    var timestampRight = startOfDayRight.getTime() -
      startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE$1;

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a day is not constant
    // (e.g. it's different in the day of the daylight saving time clock shift)
    return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY)
  }

  var difference_in_calendar_days = differenceInCalendarDays;

  /**
   * @category Day Helpers
   * @summary Get the day of the year of the given date.
   *
   * @description
   * Get the day of the year of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the day of year
   *
   * @example
   * // Which day of the year is 2 July 2014?
   * var result = getDayOfYear(new Date(2014, 6, 2))
   * //=> 183
   */
  function getDayOfYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var diff = difference_in_calendar_days(date, start_of_year(date));
    var dayOfYear = diff + 1;
    return dayOfYear
  }

  var get_day_of_year = getDayOfYear;

  /**
   * @category Week Helpers
   * @summary Return the start of a week for the given date.
   *
   * @description
   * Return the start of a week for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Date} the start of a week
   *
   * @example
   * // The start of a week for 2 September 2014 11:55:00:
   * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Sun Aug 31 2014 00:00:00
   *
   * @example
   * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
   * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
   * //=> Mon Sep 01 2014 00:00:00
   */
  function startOfWeek (dirtyDate, dirtyOptions) {
    var weekStartsOn = dirtyOptions ? (Number(dirtyOptions.weekStartsOn) || 0) : 0;

    var date = parse_1(dirtyDate);
    var day = date.getDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_week = startOfWeek;

  /**
   * @category ISO Week Helpers
   * @summary Return the start of an ISO week for the given date.
   *
   * @description
   * Return the start of an ISO week for the given date.
   * The result will be in the local timezone.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of an ISO week
   *
   * @example
   * // The start of an ISO week for 2 September 2014 11:55:00:
   * var result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Mon Sep 01 2014 00:00:00
   */
  function startOfISOWeek (dirtyDate) {
    return start_of_week(dirtyDate, {weekStartsOn: 1})
  }

  var start_of_iso_week = startOfISOWeek;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Get the ISO week-numbering year of the given date.
   *
   * @description
   * Get the ISO week-numbering year of the given date,
   * which always starts 3 days before the year's first Thursday.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the ISO week-numbering year
   *
   * @example
   * // Which ISO-week numbering year is 2 January 2005?
   * var result = getISOYear(new Date(2005, 0, 2))
   * //=> 2004
   */
  function getISOYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();

    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
    var startOfNextYear = start_of_iso_week(fourthOfJanuaryOfNextYear);

    var fourthOfJanuaryOfThisYear = new Date(0);
    fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
    var startOfThisYear = start_of_iso_week(fourthOfJanuaryOfThisYear);

    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year
    } else {
      return year - 1
    }
  }

  var get_iso_year = getISOYear;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Return the start of an ISO week-numbering year for the given date.
   *
   * @description
   * Return the start of an ISO week-numbering year,
   * which always starts 3 days before the year's first Thursday.
   * The result will be in the local timezone.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of an ISO year
   *
   * @example
   * // The start of an ISO week-numbering year for 2 July 2005:
   * var result = startOfISOYear(new Date(2005, 6, 2))
   * //=> Mon Jan 03 2005 00:00:00
   */
  function startOfISOYear (dirtyDate) {
    var year = get_iso_year(dirtyDate);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setFullYear(year, 0, 4);
    fourthOfJanuary.setHours(0, 0, 0, 0);
    var date = start_of_iso_week(fourthOfJanuary);
    return date
  }

  var start_of_iso_year = startOfISOYear;

  var MILLISECONDS_IN_WEEK = 604800000;

  /**
   * @category ISO Week Helpers
   * @summary Get the ISO week of the given date.
   *
   * @description
   * Get the ISO week of the given date.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the ISO week
   *
   * @example
   * // Which week of the ISO-week numbering year is 2 January 2005?
   * var result = getISOWeek(new Date(2005, 0, 2))
   * //=> 53
   */
  function getISOWeek (dirtyDate) {
    var date = parse_1(dirtyDate);
    var diff = start_of_iso_week(date).getTime() - start_of_iso_year(date).getTime();

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1
  }

  var get_iso_week = getISOWeek;

  /**
   * @category Common Helpers
   * @summary Is the given date valid?
   *
   * @description
   * Returns false if argument is Invalid Date and true otherwise.
   * Invalid Date is a Date, whose time value is NaN.
   *
   * Time value of Date: http://es5.github.io/#x15.9.1.1
   *
   * @param {Date} date - the date to check
   * @returns {Boolean} the date is valid
   * @throws {TypeError} argument must be an instance of Date
   *
   * @example
   * // For the valid date:
   * var result = isValid(new Date(2014, 1, 31))
   * //=> true
   *
   * @example
   * // For the invalid date:
   * var result = isValid(new Date(''))
   * //=> false
   */
  function isValid (dirtyDate) {
    if (is_date(dirtyDate)) {
      return !isNaN(dirtyDate)
    } else {
      throw new TypeError(toString.call(dirtyDate) + ' is not an instance of Date')
    }
  }

  var is_valid = isValid;

  function buildDistanceInWordsLocale () {
    var distanceInWordsLocale = {
      lessThanXSeconds: {
        one: 'less than a second',
        other: 'less than {{count}} seconds'
      },

      xSeconds: {
        one: '1 second',
        other: '{{count}} seconds'
      },

      halfAMinute: 'half a minute',

      lessThanXMinutes: {
        one: 'less than a minute',
        other: 'less than {{count}} minutes'
      },

      xMinutes: {
        one: '1 minute',
        other: '{{count}} minutes'
      },

      aboutXHours: {
        one: 'about 1 hour',
        other: 'about {{count}} hours'
      },

      xHours: {
        one: '1 hour',
        other: '{{count}} hours'
      },

      xDays: {
        one: '1 day',
        other: '{{count}} days'
      },

      aboutXMonths: {
        one: 'about 1 month',
        other: 'about {{count}} months'
      },

      xMonths: {
        one: '1 month',
        other: '{{count}} months'
      },

      aboutXYears: {
        one: 'about 1 year',
        other: 'about {{count}} years'
      },

      xYears: {
        one: '1 year',
        other: '{{count}} years'
      },

      overXYears: {
        one: 'over 1 year',
        other: 'over {{count}} years'
      },

      almostXYears: {
        one: 'almost 1 year',
        other: 'almost {{count}} years'
      }
    };

    function localize (token, count, options) {
      options = options || {};

      var result;
      if (typeof distanceInWordsLocale[token] === 'string') {
        result = distanceInWordsLocale[token];
      } else if (count === 1) {
        result = distanceInWordsLocale[token].one;
      } else {
        result = distanceInWordsLocale[token].other.replace('{{count}}', count);
      }

      if (options.addSuffix) {
        if (options.comparison > 0) {
          return 'in ' + result
        } else {
          return result + ' ago'
        }
      }

      return result
    }

    return {
      localize: localize
    }
  }

  var build_distance_in_words_locale = buildDistanceInWordsLocale;

  var commonFormatterKeys = [
    'M', 'MM', 'Q', 'D', 'DD', 'DDD', 'DDDD', 'd',
    'E', 'W', 'WW', 'YY', 'YYYY', 'GG', 'GGGG',
    'H', 'HH', 'h', 'hh', 'm', 'mm',
    's', 'ss', 'S', 'SS', 'SSS',
    'Z', 'ZZ', 'X', 'x'
  ];

  function buildFormattingTokensRegExp (formatters) {
    var formatterKeys = [];
    for (var key in formatters) {
      if (formatters.hasOwnProperty(key)) {
        formatterKeys.push(key);
      }
    }

    var formattingTokens = commonFormatterKeys
      .concat(formatterKeys)
      .sort()
      .reverse();
    var formattingTokensRegExp = new RegExp(
      '(\\[[^\\[]*\\])|(\\\\)?' + '(' + formattingTokens.join('|') + '|.)', 'g'
    );

    return formattingTokensRegExp
  }

  var build_formatting_tokens_reg_exp = buildFormattingTokensRegExp;

  function buildFormatLocale () {
    // Note: in English, the names of days of the week and months are capitalized.
    // If you are making a new locale based on this one, check if the same is true for the language you're working on.
    // Generally, formatted dates should look like they are in the middle of a sentence,
    // e.g. in Spanish language the weekdays and months should be in the lowercase.
    var months3char = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var weekdays2char = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var weekdays3char = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var meridiemUppercase = ['AM', 'PM'];
    var meridiemLowercase = ['am', 'pm'];
    var meridiemFull = ['a.m.', 'p.m.'];

    var formatters = {
      // Month: Jan, Feb, ..., Dec
      'MMM': function (date) {
        return months3char[date.getMonth()]
      },

      // Month: January, February, ..., December
      'MMMM': function (date) {
        return monthsFull[date.getMonth()]
      },

      // Day of week: Su, Mo, ..., Sa
      'dd': function (date) {
        return weekdays2char[date.getDay()]
      },

      // Day of week: Sun, Mon, ..., Sat
      'ddd': function (date) {
        return weekdays3char[date.getDay()]
      },

      // Day of week: Sunday, Monday, ..., Saturday
      'dddd': function (date) {
        return weekdaysFull[date.getDay()]
      },

      // AM, PM
      'A': function (date) {
        return (date.getHours() / 12) >= 1 ? meridiemUppercase[1] : meridiemUppercase[0]
      },

      // am, pm
      'a': function (date) {
        return (date.getHours() / 12) >= 1 ? meridiemLowercase[1] : meridiemLowercase[0]
      },

      // a.m., p.m.
      'aa': function (date) {
        return (date.getHours() / 12) >= 1 ? meridiemFull[1] : meridiemFull[0]
      }
    };

    // Generate ordinal version of formatters: M -> Mo, D -> Do, etc.
    var ordinalFormatters = ['M', 'D', 'DDD', 'd', 'Q', 'W'];
    ordinalFormatters.forEach(function (formatterToken) {
      formatters[formatterToken + 'o'] = function (date, formatters) {
        return ordinal(formatters[formatterToken](date))
      };
    });

    return {
      formatters: formatters,
      formattingTokensRegExp: build_formatting_tokens_reg_exp(formatters)
    }
  }

  function ordinal (number) {
    var rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + 'st'
        case 2:
          return number + 'nd'
        case 3:
          return number + 'rd'
      }
    }
    return number + 'th'
  }

  var build_format_locale = buildFormatLocale;

  /**
   * @category Locales
   * @summary English locale.
   */
  var en = {
    distanceInWords: build_distance_in_words_locale(),
    format: build_format_locale()
  };

  /**
   * @category Common Helpers
   * @summary Format the date.
   *
   * @description
   * Return the formatted date string in the given format.
   *
   * Accepted tokens:
   * | Unit                    | Token | Result examples                  |
   * |-------------------------|-------|----------------------------------|
   * | Month                   | M     | 1, 2, ..., 12                    |
   * |                         | Mo    | 1st, 2nd, ..., 12th              |
   * |                         | MM    | 01, 02, ..., 12                  |
   * |                         | MMM   | Jan, Feb, ..., Dec               |
   * |                         | MMMM  | January, February, ..., December |
   * | Quarter                 | Q     | 1, 2, 3, 4                       |
   * |                         | Qo    | 1st, 2nd, 3rd, 4th               |
   * | Day of month            | D     | 1, 2, ..., 31                    |
   * |                         | Do    | 1st, 2nd, ..., 31st              |
   * |                         | DD    | 01, 02, ..., 31                  |
   * | Day of year             | DDD   | 1, 2, ..., 366                   |
   * |                         | DDDo  | 1st, 2nd, ..., 366th             |
   * |                         | DDDD  | 001, 002, ..., 366               |
   * | Day of week             | d     | 0, 1, ..., 6                     |
   * |                         | do    | 0th, 1st, ..., 6th               |
   * |                         | dd    | Su, Mo, ..., Sa                  |
   * |                         | ddd   | Sun, Mon, ..., Sat               |
   * |                         | dddd  | Sunday, Monday, ..., Saturday    |
   * | Day of ISO week         | E     | 1, 2, ..., 7                     |
   * | ISO week                | W     | 1, 2, ..., 53                    |
   * |                         | Wo    | 1st, 2nd, ..., 53rd              |
   * |                         | WW    | 01, 02, ..., 53                  |
   * | Year                    | YY    | 00, 01, ..., 99                  |
   * |                         | YYYY  | 1900, 1901, ..., 2099            |
   * | ISO week-numbering year | GG    | 00, 01, ..., 99                  |
   * |                         | GGGG  | 1900, 1901, ..., 2099            |
   * | AM/PM                   | A     | AM, PM                           |
   * |                         | a     | am, pm                           |
   * |                         | aa    | a.m., p.m.                       |
   * | Hour                    | H     | 0, 1, ... 23                     |
   * |                         | HH    | 00, 01, ... 23                   |
   * |                         | h     | 1, 2, ..., 12                    |
   * |                         | hh    | 01, 02, ..., 12                  |
   * | Minute                  | m     | 0, 1, ..., 59                    |
   * |                         | mm    | 00, 01, ..., 59                  |
   * | Second                  | s     | 0, 1, ..., 59                    |
   * |                         | ss    | 00, 01, ..., 59                  |
   * | 1/10 of second          | S     | 0, 1, ..., 9                     |
   * | 1/100 of second         | SS    | 00, 01, ..., 99                  |
   * | Millisecond             | SSS   | 000, 001, ..., 999               |
   * | Timezone                | Z     | -01:00, +00:00, ... +12:00       |
   * |                         | ZZ    | -0100, +0000, ..., +1200         |
   * | Seconds timestamp       | X     | 512969520                        |
   * | Milliseconds timestamp  | x     | 512969520900                     |
   *
   * The characters wrapped in square brackets are escaped.
   *
   * The result may vary by locale.
   *
   * @param {Date|String|Number} date - the original date
   * @param {String} [format='YYYY-MM-DDTHH:mm:ss.SSSZ'] - the string of tokens
   * @param {Object} [options] - the object with options
   * @param {Object} [options.locale=enLocale] - the locale object
   * @returns {String} the formatted date string
   *
   * @example
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format(
   *   new Date(2014, 1, 11),
   *   'MM/DD/YYYY'
   * )
   * //=> '02/11/2014'
   *
   * @example
   * // Represent 2 July 2014 in Esperanto:
   * var eoLocale = require('date-fns/locale/eo')
   * var result = format(
   *   new Date(2014, 6, 2),
   *   'Do [de] MMMM YYYY',
   *   {locale: eoLocale}
   * )
   * //=> '2-a de julio 2014'
   */
  function format (dirtyDate, dirtyFormatStr, dirtyOptions) {
    var formatStr = dirtyFormatStr ? String(dirtyFormatStr) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    var options = dirtyOptions || {};

    var locale = options.locale;
    var localeFormatters = en.format.formatters;
    var formattingTokensRegExp = en.format.formattingTokensRegExp;
    if (locale && locale.format && locale.format.formatters) {
      localeFormatters = locale.format.formatters;

      if (locale.format.formattingTokensRegExp) {
        formattingTokensRegExp = locale.format.formattingTokensRegExp;
      }
    }

    var date = parse_1(dirtyDate);

    if (!is_valid(date)) {
      return 'Invalid Date'
    }

    var formatFn = buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp);

    return formatFn(date)
  }

  var formatters = {
    // Month: 1, 2, ..., 12
    'M': function (date) {
      return date.getMonth() + 1
    },

    // Month: 01, 02, ..., 12
    'MM': function (date) {
      return addLeadingZeros(date.getMonth() + 1, 2)
    },

    // Quarter: 1, 2, 3, 4
    'Q': function (date) {
      return Math.ceil((date.getMonth() + 1) / 3)
    },

    // Day of month: 1, 2, ..., 31
    'D': function (date) {
      return date.getDate()
    },

    // Day of month: 01, 02, ..., 31
    'DD': function (date) {
      return addLeadingZeros(date.getDate(), 2)
    },

    // Day of year: 1, 2, ..., 366
    'DDD': function (date) {
      return get_day_of_year(date)
    },

    // Day of year: 001, 002, ..., 366
    'DDDD': function (date) {
      return addLeadingZeros(get_day_of_year(date), 3)
    },

    // Day of week: 0, 1, ..., 6
    'd': function (date) {
      return date.getDay()
    },

    // Day of ISO week: 1, 2, ..., 7
    'E': function (date) {
      return date.getDay() || 7
    },

    // ISO week: 1, 2, ..., 53
    'W': function (date) {
      return get_iso_week(date)
    },

    // ISO week: 01, 02, ..., 53
    'WW': function (date) {
      return addLeadingZeros(get_iso_week(date), 2)
    },

    // Year: 00, 01, ..., 99
    'YY': function (date) {
      return addLeadingZeros(date.getFullYear(), 4).substr(2)
    },

    // Year: 1900, 1901, ..., 2099
    'YYYY': function (date) {
      return addLeadingZeros(date.getFullYear(), 4)
    },

    // ISO week-numbering year: 00, 01, ..., 99
    'GG': function (date) {
      return String(get_iso_year(date)).substr(2)
    },

    // ISO week-numbering year: 1900, 1901, ..., 2099
    'GGGG': function (date) {
      return get_iso_year(date)
    },

    // Hour: 0, 1, ... 23
    'H': function (date) {
      return date.getHours()
    },

    // Hour: 00, 01, ..., 23
    'HH': function (date) {
      return addLeadingZeros(date.getHours(), 2)
    },

    // Hour: 1, 2, ..., 12
    'h': function (date) {
      var hours = date.getHours();
      if (hours === 0) {
        return 12
      } else if (hours > 12) {
        return hours % 12
      } else {
        return hours
      }
    },

    // Hour: 01, 02, ..., 12
    'hh': function (date) {
      return addLeadingZeros(formatters['h'](date), 2)
    },

    // Minute: 0, 1, ..., 59
    'm': function (date) {
      return date.getMinutes()
    },

    // Minute: 00, 01, ..., 59
    'mm': function (date) {
      return addLeadingZeros(date.getMinutes(), 2)
    },

    // Second: 0, 1, ..., 59
    's': function (date) {
      return date.getSeconds()
    },

    // Second: 00, 01, ..., 59
    'ss': function (date) {
      return addLeadingZeros(date.getSeconds(), 2)
    },

    // 1/10 of second: 0, 1, ..., 9
    'S': function (date) {
      return Math.floor(date.getMilliseconds() / 100)
    },

    // 1/100 of second: 00, 01, ..., 99
    'SS': function (date) {
      return addLeadingZeros(Math.floor(date.getMilliseconds() / 10), 2)
    },

    // Millisecond: 000, 001, ..., 999
    'SSS': function (date) {
      return addLeadingZeros(date.getMilliseconds(), 3)
    },

    // Timezone: -01:00, +00:00, ... +12:00
    'Z': function (date) {
      return formatTimezone(date.getTimezoneOffset(), ':')
    },

    // Timezone: -0100, +0000, ... +1200
    'ZZ': function (date) {
      return formatTimezone(date.getTimezoneOffset())
    },

    // Seconds timestamp: 512969520
    'X': function (date) {
      return Math.floor(date.getTime() / 1000)
    },

    // Milliseconds timestamp: 512969520900
    'x': function (date) {
      return date.getTime()
    }
  };

  function buildFormatFn (formatStr, localeFormatters, formattingTokensRegExp) {
    var array = formatStr.match(formattingTokensRegExp);
    var length = array.length;

    var i;
    var formatter;
    for (i = 0; i < length; i++) {
      formatter = localeFormatters[array[i]] || formatters[array[i]];
      if (formatter) {
        array[i] = formatter;
      } else {
        array[i] = removeFormattingTokens(array[i]);
      }
    }

    return function (date) {
      var output = '';
      for (var i = 0; i < length; i++) {
        if (array[i] instanceof Function) {
          output += array[i](date, formatters);
        } else {
          output += array[i];
        }
      }
      return output
    }
  }

  function removeFormattingTokens (input) {
    if (input.match(/\[[\s\S]/)) {
      return input.replace(/^\[|]$/g, '')
    }
    return input.replace(/\\/g, '')
  }

  function formatTimezone (offset, delimeter) {
    delimeter = delimeter || '';
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    return sign + addLeadingZeros(hours, 2) + delimeter + addLeadingZeros(minutes, 2)
  }

  function addLeadingZeros (number, targetLength) {
    var output = Math.abs(number).toString();
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return output
  }

  var format_1 = format;

  /**
   * @category Month Helpers
   * @summary Get the number of days in a month of the given date.
   *
   * @description
   * Get the number of days in a month of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the number of days in a month
   *
   * @example
   * // How many days are in February 2000?
   * var result = getDaysInMonth(new Date(2000, 1))
   * //=> 29
   */
  function getDaysInMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();
    var monthIndex = date.getMonth();
    var lastDayOfMonth = new Date(0);
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate()
  }

  var get_days_in_month = getDaysInMonth;

  /**
   * @category Month Helpers
   * @summary Add the specified number of months to the given date.
   *
   * @description
   * Add the specified number of months to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of months to be added
   * @returns {Date} the new date with the months added
   *
   * @example
   * // Add 5 months to 1 September 2014:
   * var result = addMonths(new Date(2014, 8, 1), 5)
   * //=> Sun Feb 01 2015 00:00:00
   */
  function addMonths (dirtyDate, dirtyAmount) {
    var date = parse_1(dirtyDate);
    var amount = Number(dirtyAmount);
    var desiredMonth = date.getMonth() + amount;
    var dateWithDesiredMonth = new Date(0);
    dateWithDesiredMonth.setFullYear(date.getFullYear(), desiredMonth, 1);
    dateWithDesiredMonth.setHours(0, 0, 0, 0);
    var daysInMonth = get_days_in_month(dateWithDesiredMonth);
    // Set the last day of the new month
    // if the original date was the last day of the longer month
    date.setMonth(desiredMonth, Math.min(daysInMonth, date.getDate()));
    return date
  }

  var add_months = addMonths;

  /**
   * @category Month Helpers
   * @summary Subtract the specified number of months from the given date.
   *
   * @description
   * Subtract the specified number of months from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of months to be subtracted
   * @returns {Date} the new date with the months subtracted
   *
   * @example
   * // Subtract 5 months from 1 February 2015:
   * var result = subMonths(new Date(2015, 1, 1), 5)
   * //=> Mon Sep 01 2014 00:00:00
   */
  function subMonths (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_months(dirtyDate, -amount)
  }

  var sub_months = subMonths;

  /**
   * @category Month Helpers
   * @summary Return the last day of a month for the given date.
   *
   * @description
   * Return the last day of a month for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the last day of a month
   *
   * @example
   * // The last day of a month for 2 September 2014 11:55:00:
   * var result = lastDayOfMonth(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 30 2014 00:00:00
   */
  function lastDayOfMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    var month = date.getMonth();
    date.setFullYear(date.getFullYear(), month + 1, 0);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var last_day_of_month = lastDayOfMonth;

  /**
   * @category Month Helpers
   * @summary Get the month of the given date.
   *
   * @description
   * Get the month of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the month
   *
   * @example
   * // Which month is 29 February 2012?
   * var result = getMonth(new Date(2012, 1, 29))
   * //=> 1
   */
  function getMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    var month = date.getMonth();
    return month
  }

  var get_month = getMonth;

  /**
   * @category Month Helpers
   * @summary Set the month to the given date.
   *
   * @description
   * Set the month to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} month - the month of the new date
   * @returns {Date} the new date with the month setted
   *
   * @example
   * // Set February to 1 September 2014:
   * var result = setMonth(new Date(2014, 8, 1), 1)
   * //=> Sat Feb 01 2014 00:00:00
   */
  function setMonth (dirtyDate, dirtyMonth) {
    var date = parse_1(dirtyDate);
    var month = Number(dirtyMonth);
    var year = date.getFullYear();
    var day = date.getDate();

    var dateWithDesiredMonth = new Date(0);
    dateWithDesiredMonth.setFullYear(year, month, 15);
    dateWithDesiredMonth.setHours(0, 0, 0, 0);
    var daysInMonth = get_days_in_month(dateWithDesiredMonth);
    // Set the last day of the new month
    // if the original date was the last day of the longer month
    date.setMonth(month, Math.min(day, daysInMonth));
    return date
  }

  var set_month = setMonth;

  /**
   * @category Year Helpers
   * @summary Get the year of the given date.
   *
   * @description
   * Get the year of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the year
   *
   * @example
   * // Which year is 2 July 2014?
   * var result = getYear(new Date(2014, 6, 2))
   * //=> 2014
   */
  function getYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();
    return year
  }

  var get_year = getYear;

  /**
   * @category Year Helpers
   * @summary Set the year to the given date.
   *
   * @description
   * Set the year to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} year - the year of the new date
   * @returns {Date} the new date with the year setted
   *
   * @example
   * // Set year 2013 to 1 September 2014:
   * var result = setYear(new Date(2014, 8, 1), 2013)
   * //=> Sun Sep 01 2013 00:00:00
   */
  function setYear (dirtyDate, dirtyYear) {
    var date = parse_1(dirtyDate);
    var year = Number(dirtyYear);
    date.setFullYear(year);
    return date
  }

  var set_year = setYear;

  /**
   * @category Month Helpers
   * @summary Are the given dates in the same month?
   *
   * @description
   * Are the given dates in the same month?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same month
   *
   * @example
   * // Are 2 September 2014 and 25 September 2014 in the same month?
   * var result = isSameMonth(
   *   new Date(2014, 8, 2),
   *   new Date(2014, 8, 25)
   * )
   * //=> true
   */
  function isSameMonth (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);
    return dateLeft.getFullYear() === dateRight.getFullYear() &&
      dateLeft.getMonth() === dateRight.getMonth()
  }

  var is_same_month = isSameMonth;

  /**
   * @category Day Helpers
   * @summary Are the given dates in the same day?
   *
   * @description
   * Are the given dates in the same day?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same day
   *
   * @example
   * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
   * var result = isSameDay(
   *   new Date(2014, 8, 4, 6, 0),
   *   new Date(2014, 8, 4, 18, 0)
   * )
   * //=> true
   */
  function isSameDay (dirtyDateLeft, dirtyDateRight) {
    var dateLeftStartOfDay = start_of_day(dirtyDateLeft);
    var dateRightStartOfDay = start_of_day(dirtyDateRight);

    return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime()
  }

  var is_same_day = isSameDay;

  /**
   * @category Day Helpers
   * @summary Add the specified number of days to the given date.
   *
   * @description
   * Add the specified number of days to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of days to be added
   * @returns {Date} the new date with the days added
   *
   * @example
   * // Add 10 days to 1 September 2014:
   * var result = addDays(new Date(2014, 8, 1), 10)
   * //=> Thu Sep 11 2014 00:00:00
   */
  function addDays (dirtyDate, dirtyAmount) {
    var date = parse_1(dirtyDate);
    var amount = Number(dirtyAmount);
    date.setDate(date.getDate() + amount);
    return date
  }

  var add_days = addDays;

  /**
   * @category Day Helpers
   * @summary Subtract the specified number of days from the given date.
   *
   * @description
   * Subtract the specified number of days from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of days to be subtracted
   * @returns {Date} the new date with the days subtracted
   *
   * @example
   * // Subtract 10 days from 1 September 2014:
   * var result = subDays(new Date(2014, 8, 1), 10)
   * //=> Fri Aug 22 2014 00:00:00
   */
  function subDays (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_days(dirtyDate, -amount)
  }

  var sub_days = subDays;

  /**
   * @category Week Helpers
   * @summary Add the specified number of weeks to the given date.
   *
   * @description
   * Add the specified number of week to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of weeks to be added
   * @returns {Date} the new date with the weeks added
   *
   * @example
   * // Add 4 weeks to 1 September 2014:
   * var result = addWeeks(new Date(2014, 8, 1), 4)
   * //=> Mon Sep 29 2014 00:00:00
   */
  function addWeeks (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    var days = amount * 7;
    return add_days(dirtyDate, days)
  }

  var add_weeks = addWeeks;

  /**
   * @category Week Helpers
   * @summary Subtract the specified number of weeks from the given date.
   *
   * @description
   * Subtract the specified number of weeks from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of weeks to be subtracted
   * @returns {Date} the new date with the weeks subtracted
   *
   * @example
   * // Subtract 4 weeks from 1 September 2014:
   * var result = subWeeks(new Date(2014, 8, 1), 4)
   * //=> Mon Aug 04 2014 00:00:00
   */
  function subWeeks (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_weeks(dirtyDate, -amount)
  }

  var sub_weeks = subWeeks;

  /**
   * @category Month Helpers
   * @summary Return the start of a month for the given date.
   *
   * @description
   * Return the start of a month for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a month
   *
   * @example
   * // The start of a month for 2 September 2014 11:55:00:
   * var result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Mon Sep 01 2014 00:00:00
   */
  function startOfMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_month = startOfMonth;

  /**
   * @category Week Helpers
   * @summary Return the end of a week for the given date.
   *
   * @description
   * Return the end of a week for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Date} the end of a week
   *
   * @example
   * // The end of a week for 2 September 2014 11:55:00:
   * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Sat Sep 06 2014 23:59:59.999
   *
   * @example
   * // If the week starts on Monday, the end of the week for 2 September 2014 11:55:00:
   * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
   * //=> Sun Sep 07 2014 23:59:59.999
   */
  function endOfWeek (dirtyDate, dirtyOptions) {
    var weekStartsOn = dirtyOptions ? (Number(dirtyOptions.weekStartsOn) || 0) : 0;

    var date = parse_1(dirtyDate);
    var day = date.getDay();
    var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

    date.setDate(date.getDate() + diff);
    date.setHours(23, 59, 59, 999);
    return date
  }

  var end_of_week = endOfWeek;

  /**
   * @category Common Helpers
   * @summary Is the first date before the second one?
   *
   * @description
   * Is the first date before the second one?
   *
   * @param {Date|String|Number} date - the date that should be before the other one to return true
   * @param {Date|String|Number} dateToCompare - the date to compare with
   * @returns {Boolean} the first date is before the second date
   *
   * @example
   * // Is 10 July 1989 before 11 February 1987?
   * var result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
   * //=> false
   */
  function isBefore (dirtyDate, dirtyDateToCompare) {
    var date = parse_1(dirtyDate);
    var dateToCompare = parse_1(dirtyDateToCompare);
    return date.getTime() < dateToCompare.getTime()
  }

  var is_before = isBefore;

  /**
   * @category Common Helpers
   * @summary Is the first date after the second one?
   *
   * @description
   * Is the first date after the second one?
   *
   * @param {Date|String|Number} date - the date that should be after the other one to return true
   * @param {Date|String|Number} dateToCompare - the date to compare with
   * @returns {Boolean} the first date is after the second date
   *
   * @example
   * // Is 10 July 1989 after 11 February 1987?
   * var result = isAfter(new Date(1989, 6, 10), new Date(1987, 1, 11))
   * //=> true
   */
  function isAfter (dirtyDate, dirtyDateToCompare) {
    var date = parse_1(dirtyDate);
    var dateToCompare = parse_1(dirtyDateToCompare);
    return date.getTime() > dateToCompare.getTime()
  }

  var is_after = isAfter;

  /* eslint-disable */
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  var debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;

      var later = function () {
        timeout = null;
        if (!immediate) { func.apply(context, args); }
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) { func.apply(context, args); }
    };
  };
  var copyObject = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };
  var findAncestor = function (element, selector) {
    if (!element) {
      return null;
    }

    if (typeof element.closest === 'function') {
      return element.closest(selector) || null;
    }

    while (element) {
      if (element.matches(selector)) {
        return element;
      }

      element = element.parentElement;
    }

    return null;
  };
  var randomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var vClickOutside_min_umd = createCommonjsModule(function (module, exports) {
  !function(e,n){module.exports=n();}(commonjsGlobal,function(){var e="ontouchstart"in window||navigator.msMaxTouchPoints>0?["touchstart","click"]:["click"],n=[];function t(n){var t="function"==typeof n;if(!t&&"object"!=typeof n)throw new Error("v-click-outside: Binding value must be a function or an object");return{handler:t?n:n.handler,middleware:n.middleware||function(e){return e},events:n.events||e}}function r(e){var n=e.el,t=e.event,r=e.handler,i=e.middleware;t.target!==n&&!n.contains(t.target)&&i(t,n)&&r(t,n);}var i="undefined"!=typeof window?{bind:function(e,i){var d=t(i.value),o=d.handler,a=d.middleware,u={el:e,eventHandlers:d.events.map(function(n){return{event:n,handler:function(n){return r({event:n,el:e,handler:o,middleware:a})}}})};u.eventHandlers.forEach(function(e){return document.addEventListener(e.event,e.handler)}), n.push(u);},update:function(e,i){var d=t(i.value),o=d.handler,a=d.middleware,u=d.events,c=n.find(function(n){return n.el===e});c.eventHandlers.forEach(function(e){return document.removeEventListener(e.event,e.handler)}), c.eventHandlers=u.map(function(n){return{event:n,handler:function(n){return r({event:n,el:e,handler:o,middleware:a})}}}), c.eventHandlers.forEach(function(e){return document.addEventListener(e.event,e.handler)});},unbind:function(e){n.find(function(n){return n.el===e}).eventHandlers.forEach(function(e){return document.removeEventListener(e.event,e.handler)});},instances:n}:{};return{install:function(e){e.directive("click-outside",i);},directive:i}});

  });

  var ResizeSelect = {
    componentUpdated: resizeSelect,
    inserted: resizeSelect
  };

  function resizeSelect(el, binding, vnode) {
    var select = document.createElement('select');
    select.className = el.className;
    var option = document.createElement('option');
    option.textContent = el.value;
    select.appendChild(option);
    el.parentNode.appendChild(select);
    el.style.width = select.offsetWidth + 'px';
    select.parentNode.removeChild(select);
  }

  var AirbnbStyleDatepicker = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"asd__fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showDatepicker),expression:"showDatepicker"},{name:"click-outside",rawName:"v-click-outside",value:(_vm.handleClickOutside),expression:"handleClickOutside"}],staticClass:"asd__wrapper",class:_vm.wrapperClasses,style:(_vm.showFullscreen ? undefined : _vm.wrapperStyles),attrs:{"id":_vm.wrapperId}},[(_vm.showFullscreen)?_c('div',{staticClass:"asd__mobile-header asd__mobile-only"},[_c('button',{staticClass:"asd__mobile-close",attrs:{"type":"button","aria-label":_vm.ariaLabels.closeDatepicker},on:{"click":_vm.closeDatepicker}},[(_vm.$slots['close-icon'])?_vm._t("close-icon"):_c('div',{staticClass:"asd__mobile-close-icon",attrs:{"aria-hidden":"true"}},[_vm._v("X")])],2),_vm._v(" "),_c('h3',[_vm._v(_vm._s(_vm.mobileHeader || _vm.mobileHeaderFallback))])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"asd__datepicker-header"},[_c('div',{staticClass:"asd__change-month-button asd__change-month-button--previous"},[_c('button',{attrs:{"type":"button","aria-label":_vm.ariaLabels.previousMonth},on:{"click":_vm.previousMonth}},[(_vm.$slots['previous-month-icon'])?_vm._t("previous-month-icon"):_c('svg',{attrs:{"viewBox":"0 0 1000 1000"}},[_c('path',{attrs:{"d":"M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"}})])],2)]),_vm._v(" "),_c('div',{staticClass:"asd__change-month-button asd__change-month-button--next"},[_c('button',{attrs:{"type":"button","aria-label":_vm.ariaLabels.nextMonth},on:{"click":_vm.nextMonth}},[(_vm.$slots['next-month-icon'])?_vm._t("next-month-icon"):_c('svg',{attrs:{"viewBox":"0 0 1000 1000"}},[_c('path',{attrs:{"d":"M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"}})])],2)]),_vm._v(" "),_vm._l((_vm.showMonths),function(month,index){return _c('div',{key:month,staticClass:"asd__days-legend",style:([_vm.monthWidthStyles, {left: (_vm.width * index) + 'px'}])},_vm._l((_vm.daysShort),function(day,index){return _c('div',{key:index,staticClass:"asd__day-title"},[_vm._v(_vm._s(day))])}))})],2),_vm._v(" "),_c('div',{staticClass:"asd__inner-wrapper",style:(_vm.innerStyles)},[_c('transition-group',{attrs:{"name":"asd__list-complete","tag":"div"}},_vm._l((_vm.months),function(month,monthIndex){return _c('div',{key:month.firstDateOfMonth,staticClass:"asd__month",class:{'asd__month--hidden': monthIndex === 0 || monthIndex > _vm.showMonths},style:(_vm.monthWidthStyles)},[_c('div',{staticClass:"asd__month-name"},[(_vm.showMonthYearSelect)?_c('select',{directives:[{name:"model",rawName:"v-model",value:(month.monthName),expression:"month.monthName"},{name:"resize-select",rawName:"v-resize-select"}],staticClass:"asd__month-year-select",attrs:{"tabindex":monthIndex === 0 || monthIndex > _vm.showMonths ? -1 : 0},on:{"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(month, "monthName", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);},function($event){_vm.updateMonth(monthIndex, month.year, $event);}]}},_vm._l((_vm.monthNames),function(monthName,idx){return _c('option',{key:("month-" + monthIndex + "-" + monthName),attrs:{"disabled":_vm.isMonthDisabled(month.year, idx)},domProps:{"value":monthName}},[_vm._v(_vm._s(monthName))])})):_c('span',[_vm._v(_vm._s(month.monthName))]),_vm._v(" "),(_vm.showMonthYearSelect)?_c('select',{directives:[{name:"model",rawName:"v-model",value:(month.year),expression:"month.year"}],staticClass:"asd__month-year-select",attrs:{"tabindex":monthIndex === 0 || monthIndex > _vm.showMonths ? -1 : 0},on:{"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(month, "year", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);},function($event){_vm.updateYear(monthIndex, month.monthNumber - 1, $event);}]}},[(_vm.years.indexOf(month.year) === -1)?_c('option',{key:("month-" + monthIndex + "-" + (_vm.year)),attrs:{"disabled":true},domProps:{"value":month.year}},[_vm._v(_vm._s(month.year))]):_vm._e(),_vm._v(" "),_vm._l((_vm.years),function(year){return _c('option',{key:("month-" + monthIndex + "-" + year),domProps:{"value":year}},[_vm._v(_vm._s(year))])})],2):_c('span',[_vm._v(_vm._s(month.year))])]),_vm._v(" "),_c('table',{staticClass:"asd__month-table",attrs:{"role":"presentation"}},[_c('tbody',_vm._l((month.weeks),function(week,index){return _c('tr',{key:index,staticClass:"asd__week"},_vm._l((week),function(ref,index){
  var fullDate = ref.fullDate;
  var dayNumber = ref.dayNumber;
  return _c('td',{key:index + '_' + dayNumber,ref:("date-" + fullDate),refInFor:true,staticClass:"asd__day",class:[{ 'asd__day--enabled': dayNumber !== 0, 'asd__day--empty': dayNumber === 0, 'asd__day--disabled': _vm.isDisabled(fullDate), 'asd__day--selected': fullDate && (_vm.selectedDate1 === fullDate || _vm.selectedDate2 === fullDate), 'asd__day--in-range': _vm.isInRange(fullDate), 'asd__day--today': fullDate && _vm.isToday(fullDate), 'asd__day--hovered': _vm.isHoveredInRange(fullDate), 'asd__selected-date-one': fullDate && fullDate === _vm.selectedDate1, 'asd__selected-date-two': fullDate && fullDate === _vm.selectedDate2, }, _vm.customizedDateClass(fullDate)],style:(_vm.getDayStyles(fullDate)),attrs:{"data-date":fullDate,"tabindex":_vm.isDateVisible(fullDate) && _vm.isSameDate(_vm.focusedDate, fullDate) ? 0 : -1,"aria-label":_vm.isDateVisible(fullDate) ? _vm.getAriaLabelForDate(fullDate) : false},on:{"mouseover":function () { _vm.setHoverDate(fullDate); }}},[(dayNumber)?_c('button',{staticClass:"asd__day-button",attrs:{"type":"button","tabindex":"-1","date":fullDate,"disabled":_vm.isDisabled(fullDate)},on:{"click":function () { _vm.selectDate(fullDate); }}},[_vm._v(_vm._s(dayNumber))]):_vm._e()])}))}))])])})),_vm._v(" "),(_vm.showShortcutsMenuTrigger)?_c('div',{class:{ 'asd__keyboard-shortcuts-menu': true, 'asd__keyboard-shortcuts-show': _vm.showKeyboardShortcutsMenu},style:(_vm.keyboardShortcutsMenuStyles)},[_c('div',{staticClass:"asd__keyboard-shortcuts-title"},[_vm._v(_vm._s(_vm.texts.keyboardShortcuts))]),_vm._v(" "),_c('button',{ref:"keyboard-shortcus-menu-close",staticClass:"asd__keyboard-shortcuts-close",attrs:{"tabindex":"0","aria-label":_vm.ariaLabels.closeKeyboardShortcutsMenu},on:{"click":_vm.closeKeyboardShortcutsMenu}},[(_vm.$slots['close-shortcuts-icon'])?_vm._t("close-shortcuts-icon"):_c('div',{staticClass:"asd__mobile-close-icon",attrs:{"aria-hidden":"true"}},[_vm._v("X")])],2),_vm._v(" "),_c('ul',{staticClass:"asd__keyboard-shortcuts-list"},_vm._l((_vm.keyboardShortcuts),function(shortcut,i){return _c('li',{key:i},[_c('span',{staticClass:"asd__keyboard-shortcuts-symbol",attrs:{"aria-label":shortcut.symbolDescription}},[_vm._v(_vm._s(shortcut.symbol))]),_vm._v(" "+_vm._s(shortcut.label)+" ")])}))]):_vm._e()],1),_vm._v(" "),(_vm.mode !== 'single' && _vm.showActionButtons)?_c('div',{staticClass:"asd__action-buttons"},[_c('button',{attrs:{"type":"button"},on:{"click":_vm.closeDatepickerCancel}},[_vm._v(_vm._s(_vm.texts.cancel))]),_vm._v(" "),_c('button',{ref:"apply-button",style:({color: _vm.colors.selected}),attrs:{"type":"button"},on:{"click":_vm.apply}},[_vm._v(_vm._s(_vm.texts.apply))])]):_vm._e(),_vm._v(" "),(_vm.showShortcutsMenuTrigger)?_c('div',{staticClass:"asd__keyboard-shortcuts-trigger-wrapper"},[_c('button',{staticClass:"asd__keyboard-shortcuts-trigger",attrs:{"aria-label":_vm.ariaLabels.openKeyboardShortcutsMenu,"tabindex":"0"},on:{"click":_vm.openKeyboardShortcutsMenu}},[_c('span',[_vm._v("?")])])]):_vm._e()])])},staticRenderFns: [],
    name: 'AirbnbStyleDatepicker',
    directives: {
      clickOutside: vClickOutside_min_umd.directive,
      resizeSelect: ResizeSelect,
    },
    props: {
      triggerElementId: { type: String },
      dateOne: { type: [String, Date] },
      dateTwo: { type: [String, Date] },
      minDate: { type: [String, Date] },
      endDate: { type: [String, Date] },
      mode: { type: String, default: 'range' },
      offsetY: { type: Number, default: 0 },
      offsetX: { type: Number, default: 0 },
      monthsToShow: { type: Number, default: 2 },
      startOpen: { type: Boolean },
      fullscreenMobile: { type: Boolean },
      inline: { type: Boolean },
      mobileHeader: { type: String },
      disabledDates: { type: Array, default: function () { return []; } },
      enabledDates: { type: Array, default: function () { return []; } },
      customizedDates: { type: Array, default: function () { return []; } },
      showActionButtons: { type: Boolean, default: true },
      showShortcutsMenuTrigger: { type: Boolean, default: true },
      showMonthYearSelect: { type: Boolean, default: false },
      yearsForSelect: { type: Number, default: 10 },
      isTest: {
        type: Boolean,
        default: function () { return "development" === 'test'; },
      },
      trigger: { type: Boolean, default: false },
      closeAfterSelect: { type: Boolean, default: false },
    },
    data: function data() {
      return {
        wrapperId: 'airbnb-style-datepicker-wrapper-' + randomString(5),
        dateFormat: 'YYYY-MM-DD',
        dateLabelFormat: 'dddd, MMMM D, YYYY',
        showDatepicker: false,
        showKeyboardShortcutsMenu: false,
        showMonths: 2,
        colors: {
          selected: '#00a699',
          inRange: '#66e2da',
          selectedText: '#fff',
          text: '#565a5c',
          inRangeBorder: '#33dacd',
          disabled: '#fff',
          hoveredInRange: '#67f6ee',
        },
        sundayFirst: false,
        ariaLabels: {
          chooseDate: function (date) { return date; },
          chooseStartDate: function (date) { return ("Choose " + date + " as your start date."); },
          chooseEndDate: function (date) { return ("Choose " + date + " as your end date."); },
          selectedDate: function (date) { return ("Selected. " + date); },
          unavailableDate: function (date) { return ("Not available. " + date); },
          previousMonth: 'Move backward to switch to the previous month.',
          nextMonth: 'Move forward to switch to the next month.',
          closeDatepicker: 'Close calendar',
          openKeyboardShortcutsMenu: 'Open keyboard shortcuts menu.',
          closeKeyboardShortcutsMenu: 'Close keyboard shortcuts menu',
        },
        monthNames: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December' ],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        daysShort: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
        texts: {
          apply: 'Apply',
          cancel: 'Cancel',
          keyboardShortcuts: 'Keyboard Shortcuts',
        },
        keyboardShortcuts: [
          { symbol: '↵', label: 'Select the date in focus', symbolDescription: 'Enter key' },
          {
            symbol: '←/→',
            label: 'Move backward (left) and forward (right) by one day.',
            symbolDescription: 'Left or right arrow keys',
          },
          {
            symbol: '↑/↓',
            label: 'Move backward (up) and forward (down) by one week.',
            symbolDescription: 'Up or down arrow keys',
          },
          {
            symbol: 'PgUp/PgDn',
            label: 'Switch months.',
            symbolDescription: 'PageUp and PageDown keys',
          },
          {
            symbol: 'Home/End',
            label: 'Go to the first or last day of a week.',
            symbolDescription: 'Home or End keys',
          },
          { symbol: 'Esc', label: 'Close this panel', symbolDescription: 'Escape key' },
          { symbol: '?', label: 'Open this panel', symbolDescription: 'Question mark' } ],
        keys: {
          arrowDown: 40,
          arrowUp: 38,
          arrowRight: 39,
          arrowLeft: 37,
          enter: 13,
          pgUp: 33,
          pgDn: 34,
          end: 35,
          home: 36,
          questionMark: 191,
          esc: 27,
        },
        startingDate: '',
        months: [],
        years: [],
        width: 300,
        selectedDate1: '',
        selectedDate2: '',
        hoverDate: '',
        focusedDate: '',
        alignRight: false,
        triggerPosition: {},
        triggerWrapperPosition: {},
        viewportWidth: undefined,
        isMobile: undefined,
        isTablet: undefined,
        triggerElement: undefined,
      }
    },
    computed: {
      isSelectingDate1: {
        get: function get() {
          return (this.dateOne && !this.dateTwo) ? false : true
        },
        set: function set(newValue) {
          return newValue
        }
      },
      wrapperClasses: function wrapperClasses() {
        return {
          'asd__wrapper--datepicker-open': this.showDatepicker,
          'asd__wrapper--full-screen': this.showFullscreen,
          'asd__wrapper--inline': this.inline,
        }
      },
      wrapperStyles: function wrapperStyles() {
        return {
          position: this.inline ? 'static' : 'absolute',
          top: this.inline ? '0' : this.triggerPosition.height + this.offsetY + 'px',
          left: !this.alignRight
            ? this.triggerPosition.left - this.triggerWrapperPosition.left + this.offsetX + 'px'
            : '',
          right: this.alignRight
            ? this.triggerWrapperPosition.right - this.triggerPosition.right + this.offsetX + 'px'
            : '',
          width: this.width * this.showMonths + 'px',
          zIndex: this.inline ? '0' : '100',
        }
      },
      innerStyles: function innerStyles() {
        return {
          'margin-left': this.showFullscreen ? '-' + this.viewportWidth : ("-" + (this.width) + "px"),
        }
      },
      keyboardShortcutsMenuStyles: function keyboardShortcutsMenuStyles() {
        return {
          left: this.showFullscreen ? this.viewportWidth : ((this.width) + "px"),
        }
      },
      monthWidthStyles: function monthWidthStyles() {
        return {
          width: this.showFullscreen ? this.viewportWidth : this.width + 'px',
        }
      },
      mobileHeaderFallback: function mobileHeaderFallback() {
        return this.mode === 'range' ? 'Select dates' : 'Select date'
      },
      showFullscreen: function showFullscreen() {
        return this.isMobile && this.fullscreenMobile
      },
      datesSelected: function datesSelected() {
        return !!(
          (this.selectedDate1 && this.selectedDate1 !== '') ||
          (this.selectedDate2 && this.selectedDate2 !== '')
        )
      },
      allDatesSelected: function allDatesSelected() {
        return !!(
          this.selectedDate1 &&
          this.selectedDate1 !== '' &&
          this.selectedDate2 &&
          this.selectedDate2 !== ''
        )
      },
      hasMinDate: function hasMinDate() {
        return !!(this.minDate && this.minDate !== '')
      },
      isRangeMode: function isRangeMode() {
        return this.mode === 'range'
      },
      isSingleMode: function isSingleMode() {
        return this.mode === 'single'
      },
      datepickerWidth: function datepickerWidth() {
        return this.width * this.showMonths
      },
      datePropsCompound: function datePropsCompound() {
        // used to watch for changes in props, and update GUI accordingly
        return this.dateOne + this.dateTwo
      },
      isDateTwoBeforeDateOne: function isDateTwoBeforeDateOne() {
        if (!this.dateTwo) {
          return false
        }
        return is_before(this.dateTwo, this.dateOne)
      },
      visibleMonths: function visibleMonths() {
        var firstMonthArray = this.months.filter(function (m, index) { return index > 0; });
        var numberOfMonthsArray = [];
        for (var i = 0; i < this.showMonths; i++) {
          numberOfMonthsArray.push(i);
        }
        return numberOfMonthsArray.map(function (_, index) { return firstMonthArray[index].firstDateOfMonth; })
      },
    },
    watch: {
      selectedDate1: function selectedDate1(newValue, oldValue) {
        var newDate = !newValue || newValue === '' ? '' : format_1(newValue, this.dateFormat);
        this.$emit('date-one-selected', newDate);
      },
      selectedDate2: function selectedDate2(newValue, oldValue) {
        var newDate = !newValue || newValue === '' ? '' : format_1(newValue, this.dateFormat);
        this.$emit('date-two-selected', newDate);
      },
      mode: function mode(newValue, oldValue) {
        this.setStartDates();
      },
      minDate: function minDate() {
        this.setStartDates();
        this.generateMonths();
        this.generateYears();
      },
      endDate: function endDate() {
        this.generateYears();
      },
      datePropsCompound: function datePropsCompound(newValue) {
        if (this.dateOne !== this.selectedDate1) {
          this.startingDate = this.dateOne;
          this.setStartDates();
          this.generateMonths();
          this.generateYears();
        }
        if (this.isDateTwoBeforeDateOne) {
          this.selectedDate2 = '';
          this.$emit('date-two-selected', '');
        }
      },
      trigger: function trigger(newValue, oldValue) {
        var this$1 = this;

        if (newValue) {
          setTimeout(function () {
            this$1.openDatepicker();
          }, 0);
        }
      },
    },
    created: function created() {
      this.setupDatepicker();

      if (this.sundayFirst) {
        this.setSundayToFirstDayInWeek();
      }
    },
    mounted: function mounted() {
      var this$1 = this;

      this.viewportWidth = window.innerWidth + 'px';
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
      this._handleWindowResizeEvent = debounce(function () {
        this$1.positionDatepicker();
        this$1.setStartDates();
      }, 200);
      this._handleWindowClickEvent = function (event) {
        if (event.target.id === this$1.triggerElementId) {
          event.stopPropagation();
          event.preventDefault();
          this$1.toggleDatepicker();
        }
      };
      window.addEventListener('resize', this._handleWindowResizeEvent);

      this.triggerElement = this.isTest
        ? document.createElement('input')
        : document.getElementById(this.triggerElementId);

      this.setStartDates();
      this.generateMonths();
      this.generateYears();

      if (this.startOpen || this.inline) {
        this.openDatepicker();
      }

      this.$el.addEventListener('keyup', this.handleKeyboardInput);
      this.$el.addEventListener('keydown', this.trapKeyboardInput);
      this.triggerElement.addEventListener('keyup', this.handleTriggerInput);
      this.triggerElement.addEventListener('click', this._handleWindowClickEvent);
    },
    destroyed: function destroyed() {
      window.removeEventListener('resize', this._handleWindowResizeEvent);
      window.removeEventListener('click', this._handleWindowClickEvent);

      this.$el.removeEventListener('keyup', this.handleKeyboardInput);
      this.$el.removeEventListener('keydown', this.trapKeyboardInput);
      this.triggerElement.removeEventListener('keyup', this.handleTriggerInput);
      this.triggerElement.removeEventListener('click', this._handleWindowClickEvent);
    },
    methods: {
      getDayStyles: function getDayStyles(date) {
        var isSelected = this.isSelected(date);
        var isInRange = this.isInRange(date);
        var isDisabled = this.isDisabled(date);
        var isHoveredInRange = this.isHoveredInRange(date);

        var styles = {
          width: (this.width - 30) / 7 + 'px',
          background: isSelected
            ? this.colors.selected
            : isHoveredInRange
            ? this.colors.hoveredInRange
            : isInRange
            ? this.colors.inRange
            : '',
          color: isSelected
            ? this.colors.selectedText
            : isInRange || isHoveredInRange
            ? this.colors.selectedText
            : this.colors.text,
          border: isSelected
            ? '1px double ' + this.colors.selected
            : (isInRange && this.allDatesSelected) || isHoveredInRange
            ? '1px double ' + this.colors.inRangeBorder
            : '',
        };

        if (isDisabled) {
          styles.background = this.colors.disabled;
        }
        return styles
      },
      getAriaLabelForDate: function getAriaLabelForDate(date) {
        var dateLabel = format_1(date, this.dateLabelFormat);

        var isDisabled = this.isDisabled(date);
        if (isDisabled) {
          return this.ariaLabels.unavailableDate(dateLabel)
        }

        var isSelected = this.isSelected(date);
        if (isSelected) {
          return this.ariaLabels.selectedDate(dateLabel)
        }

        if (this.isRangeMode) {
          if (this.isSelectingDate1) {
            return this.ariaLabels.chooseStartDate(dateLabel)
          } else {
            return this.ariaLabels.chooseEndDate(dateLabel)
          }
        } else {
          return this.ariaLabels.chooseDate(dateLabel)
        }
      },
      handleClickOutside: function handleClickOutside(event) {
        if (event.target.id === this.triggerElementId || !this.showDatepicker || this.inline) {
          return
        }
        this.closeDatepicker();
      },
      shouldHandleInput: function shouldHandleInput(event, key) {
        return (
          event.keyCode === key && (!event.shiftKey || event.keyCode === 191) && this.showDatepicker
        )
      },
      handleTriggerInput: function handleTriggerInput(event) {
        if (this.mode === 'single') {
          this.setDateFromText(event.target.value);
        }
      },
      trapKeyboardInput: function trapKeyboardInput(event) {
        var this$1 = this;

        // prevent keys that are used as keyboard shortcuts from propagating out of this element
        // except for the enter key, which is needed to activate buttons
        var shortcutKeyCodes = Object.keys(this.keys).map(function (key) { return this$1.keys[key]; });
        shortcutKeyCodes.splice(shortcutKeyCodes.indexOf(13), 1);
        var shouldPreventDefault = shortcutKeyCodes.indexOf(event.keyCode) > -1;
        if (shouldPreventDefault) { event.preventDefault(); }
      },
      handleKeyboardInput: function handleKeyboardInput(event) {
        if (this.shouldHandleInput(event, this.keys.esc)) {
          if (this.showKeyboardShortcutsMenu) {
            this.closeKeyboardShortcutsMenu();
          } else {
            this.closeDatepicker();
          }
        } else if (this.showKeyboardShortcutsMenu) {
          // if keyboard shortcutsMenu is open, then esc is the only key we want to have fire events
        } else if (this.shouldHandleInput(event, this.keys.arrowDown)) {
          var newDate = add_weeks(this.focusedDate, 1);
          var changeMonths = !is_same_month(newDate, this.focusedDate);
          this.setFocusedDate(newDate);
          if (changeMonths) { this.nextMonth(); }
        } else if (this.shouldHandleInput(event, this.keys.arrowUp)) {
          var newDate$1 = sub_weeks(this.focusedDate, 1);
          var changeMonths$1 = !is_same_month(newDate$1, this.focusedDate);
          this.setFocusedDate(newDate$1);
          if (changeMonths$1) { this.previousMonth(); }
        } else if (this.shouldHandleInput(event, this.keys.arrowRight)) {
          var newDate$2 = add_days(this.focusedDate, 1);
          var changeMonths$2 = !is_same_month(newDate$2, this.focusedDate);
          this.setFocusedDate(newDate$2);
          if (changeMonths$2) { this.nextMonth(); }
        } else if (this.shouldHandleInput(event, this.keys.arrowLeft)) {
          var newDate$3 = sub_days(this.focusedDate, 1);
          var changeMonths$3 = !is_same_month(newDate$3, this.focusedDate);
          this.setFocusedDate(newDate$3);
          if (changeMonths$3) { this.previousMonth(); }
        } else if (this.shouldHandleInput(event, this.keys.enter)) {
          // on enter key, only select the date if a date is currently in focus
          var target = event.target;
          if (!this.showKeyboardShortcutsMenu && target && target.tagName === 'TD') {
            this.selectDate(this.focusedDate);
          }
        } else if (this.shouldHandleInput(event, this.keys.pgUp)) {
          this.setFocusedDate(sub_months(this.focusedDate, 1));
          this.previousMonth();
        } else if (this.shouldHandleInput(event, this.keys.pgDn)) {
          this.setFocusedDate(add_months(this.focusedDate, 1));
          this.nextMonth();
        } else if (this.shouldHandleInput(event, this.keys.home)) {
          var newDate$4 = start_of_week(this.focusedDate, {
            weekStartsOn: this.sundayFirst ? 0 : 1,
          });
          var changeMonths$4 = !is_same_month(newDate$4, this.focusedDate);
          this.setFocusedDate(newDate$4);
          if (changeMonths$4) { this.previousMonth(); }
        } else if (this.shouldHandleInput(event, this.keys.end)) {
          var newDate$5 = end_of_week(this.focusedDate, {
            weekStartsOn: this.sundayFirst ? 0 : 1,
          });
          var changeMonths$5 = !is_same_month(newDate$5, this.focusedDate);
          this.setFocusedDate(newDate$5);
          if (changeMonths$5) { this.nextMonth(); }
        } else if (this.shouldHandleInput(event, this.keys.questionMark)) {
          this.openKeyboardShortcutsMenu();
        }
      },
      setDateFromText: function setDateFromText(value) {
        if (!value || value.length < 10) {
          return
        }
        // make sure format is either 'YYYY-MM-DD' or 'DD.MM.YYYY'
        var isFormatYearFirst = value.match(
          /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/
        );
        var isFormatDayFirst = value.match(
          /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])[.](0[1-9]|1[0-2])[.](\d{4})$/
        );

        if (!isFormatYearFirst && !isFormatDayFirst) {
          return
        }
        if (isFormatDayFirst) {
          //convert to YYYY-MM-DD
          value = (value.substring(6, 10)) + "-" + (value.substring(3, 5)) + "-" + (value.substring(0, 2));
        }

        var valueAsDateObject = new Date(value);
        if (!is_valid(valueAsDateObject)) {
          return
        }
        var formattedDate = format_1(valueAsDateObject, this.dateFormat);
        if (
          this.isDateDisabled(formattedDate) ||
          this.isBeforeMinDate(formattedDate) ||
          this.isAfterEndDate(formattedDate)
        ) {
          return
        }
        this.startingDate = sub_months(formattedDate, 1);
        this.generateMonths();
        this.generateYears();
        this.selectDate(formattedDate);
      },
      isMonthDisabled: function isMonthDisabled(year, monthIndex) {
        var monthDate = new Date(year, monthIndex);
        if (this.hasMinDate && is_before(monthDate, start_of_month(this.minDate))) {
          return true
        }
        return this.isAfterEndDate(monthDate)
      },
      generateMonths: function generateMonths() {
        var this$1 = this;

        this.months = [];
        var currentMonth = this.startingDate;
        for (var i = 0; i < this.showMonths + 2; i++) {
          this$1.months.push(this$1.getMonth(currentMonth));
          currentMonth = this$1.addMonths(currentMonth);
        }
      },
      generateYears: function generateYears() {
        var this$1 = this;

        if (!this.showMonthYearSelect) { return }
        this.years = [];
        var currentYear = get_year(this.startingDate);
        var startYear = this.minDate ? get_year(this.minDate) : currentYear - this.yearsForSelect;
        var endYear = this.endDate ? get_year(this.endDate) : currentYear + this.yearsForSelect;
        for (var year = startYear; year <= endYear; year++) {
          this$1.years.push(year.toString());
        }
      },
      setupDatepicker: function setupDatepicker() {
        if (this.$options.ariaLabels) {
          this.ariaLabels = copyObject(this.$options.ariaLabels);
        }
        if (this.$options.keyboardShortcuts) {
          this.keyboardShortcuts = copyObject(this.$options.keyboardShortcuts);
        }
        if (this.$options.dateLabelFormat) {
          this.dateLabelFormat = copyObject(this.$options.dateLabelFormat);
        }
        if (this.$options.sundayFirst) {
          this.sundayFirst = copyObject(this.$options.sundayFirst);
        }
        if (this.$options.colors) {
          var colors = copyObject(this.$options.colors);
          this.colors.selected = colors.selected || this.colors.selected;
          this.colors.inRange = colors.inRange || this.colors.inRange;
          this.colors.hoveredInRange = colors.hoveredInRange || this.colors.hoveredInRange;
          this.colors.selectedText = colors.selectedText || this.colors.selectedText;
          this.colors.text = colors.text || this.colors.text;
          this.colors.inRangeBorder = colors.inRangeBorder || this.colors.inRangeBorder;
          this.colors.disabled = colors.disabled || this.colors.disabled;
        }
        if (this.$options.monthNames && this.$options.monthNames.length === 12) {
          this.monthNames = copyObject(this.$options.monthNames);
        }
        if (this.$options.days && this.$options.days.length === 7) {
          this.days = copyObject(this.$options.days);
        }
        if (this.$options.daysShort && this.$options.daysShort.length === 7) {
          this.daysShort = copyObject(this.$options.daysShort);
        }
        if (this.$options.texts) {
          var texts = copyObject(this.$options.texts);
          this.texts.apply = texts.apply || this.texts.apply;
          this.texts.cancel = texts.cancel || this.texts.cancel;
        }
      },
      setStartDates: function setStartDates() {
        var startDate = this.dateOne || new Date();
        if (this.hasMinDate && is_before(startDate, this.minDate)) {
          startDate = this.minDate;
        }
        this.startingDate = this.subtractMonths(startDate);
        this.selectedDate1 = this.dateOne;
        this.selectedDate2 = this.dateTwo;
        this.focusedDate = startDate;
      },
      setSundayToFirstDayInWeek: function setSundayToFirstDayInWeek() {
        var lastDay = this.days.pop();
        this.days.unshift(lastDay);
        var lastDayShort = this.daysShort.pop();
        this.daysShort.unshift(lastDayShort);
      },
      getMonth: function getMonth(date) {
        var firstDateOfMonth = format_1(date, 'YYYY-MM-01');
        var year = format_1(date, 'YYYY');
        var monthNumber = parseInt(format_1(date, 'M'));
        var monthName = this.monthNames[monthNumber - 1];

        return {
          year: year,
          firstDateOfMonth: firstDateOfMonth,
          monthName: monthName,
          monthNumber: monthNumber,
          weeks: this.getWeeks(firstDateOfMonth),
        }
      },
      getWeeks: function getWeeks(date) {
        var weekDayNotInMonth = { dayNumber: 0 };
        var daysInMonth = get_days_in_month(date);
        var year = format_1(date, 'YYYY');
        var month = format_1(date, 'MM');
        var firstDayInWeek = parseInt(format_1(date, this.sundayFirst ? 'd' : 'E'));
        if (this.sundayFirst) {
          firstDayInWeek++;
        }
        var weeks = [];
        var week = [];

        // add empty days to get first day in correct position
        for (var s = 1; s < firstDayInWeek; s++) {
          week.push(weekDayNotInMonth);
        }
        for (var d = 0; d < daysInMonth; d++) {
          var isLastDayInMonth = d >= daysInMonth - 1;
          var dayNumber = d + 1;
          var dayNumberFull = dayNumber < 10 ? '0' + dayNumber : dayNumber;
          week.push({
            dayNumber: dayNumber,
            dayNumberFull: dayNumberFull,
            fullDate: year + '-' + month + '-' + dayNumberFull,
          });

          if (week.length === 7) {
            weeks.push(week);
            week = [];
          } else if (isLastDayInMonth) {
            for (var i = 0; i < 7 - week.length; i++) {
              week.push(weekDayNotInMonth);
            }
            weeks.push(week);
            week = [];
          }
        }
        return weeks
      },
      selectDate: function selectDate(date) {
        if (this.isBeforeMinDate(date) || this.isAfterEndDate(date) || this.isDateDisabled(date)) {
          return
        }

        if (this.mode === 'single') {
          this.selectedDate1 = date;
          this.closeDatepicker();
          return
        }

        if (this.isSelectingDate1 || is_before(date, this.selectedDate1)) {
          this.selectedDate1 = date;
          this.isSelectingDate1 = false;

          if (is_before(this.selectedDate2, date)) {
            this.selectedDate2 = '';
          }
        } else {
          this.selectedDate2 = date;
          this.isSelectingDate1 = true;

          if (is_after(this.selectedDate1, date)) {
            this.selectedDate1 = '';
          } else if (this.showActionButtons) {
            // if user has selected both dates, focus the apply button for accessibility
            this.$refs['apply-button'].focus();
          }

          if (this.allDatesSelected && this.closeAfterSelect) {
            this.closeDatepicker();
          }
        }
      },
      setHoverDate: function setHoverDate(date) {
        this.hoverDate = date;
      },
      setFocusedDate: function setFocusedDate(date) {
        var formattedDate = format_1(date, this.dateFormat);
        this.focusedDate = formattedDate;
        var dateElement = this.$refs[("date-" + formattedDate)];
        // handle .focus() on ie11 by adding a short timeout
        if (dateElement && dateElement.length) {
          setTimeout(function() {
            dateElement[0].focus();
          }, 10);
        }
      },
      resetFocusedDate: function resetFocusedDate(setToFirst) {
        if (this.focusedDate && !this.isDateVisible(this.focusedDate)) {
          var visibleMonthIdx = setToFirst ? 0 : this.visibleMonths.length - 1;
          var targetMonth = this.visibleMonths[visibleMonthIdx];
          var monthIdx = get_month(targetMonth);
          var year = get_year(targetMonth);
          var newFocusedDate = set_year(set_month(this.focusedDate, monthIdx), year);
          this.focusedDate = format_1(newFocusedDate, this.dateFormat);
        }
      },
      isToday: function isToday(date) {
        return format_1(new Date(), this.dateFormat) === date
      },
      isSameDate: function isSameDate(date1, date2) {
        return is_same_day(date1, date2)
      },
      isSelected: function isSelected(date) {
        if (!date) {
          return
        }
        return this.selectedDate1 === date || this.selectedDate2 === date
      },
      isInRange: function isInRange(date) {
        if (!this.allDatesSelected || this.isSingleMode) {
          return false
        }

        return (
          (is_after(date, this.selectedDate1) && is_before(date, this.selectedDate2)) ||
          (is_after(date, this.selectedDate1) &&
            is_before(date, this.hoverDate) &&
            !this.allDatesSelected)
        )
      },
      isHoveredInRange: function isHoveredInRange(date) {
        if (this.isSingleMode || this.allDatesSelected) {
          return false
        }

        return (
          (is_after(date, this.selectedDate1) && is_before(date, this.hoverDate)) ||
          (is_after(date, this.hoverDate) && is_before(date, this.selectedDate1))
        )
      },
      isBeforeMinDate: function isBeforeMinDate(date) {
        if (!this.minDate) {
          return false
        }
        return is_before(date, this.minDate)
      },
      isAfterEndDate: function isAfterEndDate(date) {
        if (!this.endDate) {
          return false
        }
        return is_after(date, this.endDate)
      },
      isDateVisible: function isDateVisible(date) {
        if (!date) {
          return false
        }
        var start = sub_days(this.visibleMonths[0], 1);
        var end = add_days(last_day_of_month(this.visibleMonths[this.monthsToShow - 1]), 1);
        return is_after(date, start) && is_before(date, end)
      },
      isDateDisabled: function isDateDisabled(date) {
        if (this.enabledDates.length > 0) {
          return this.enabledDates.indexOf(date) === -1
        } else {
          return this.disabledDates.indexOf(date) > -1
        }
      },
      customizedDateClass: function customizedDateClass(date) {
        var this$1 = this;

        var customizedClasses = '';
        if (this.customizedDates.length > 0) {
          for (var i = 0; i < this.customizedDates.length; i++) {
            if (this$1.customizedDates[i].dates.indexOf(date) > -1)
              { customizedClasses += " asd__day--" + (this$1.customizedDates[i].cssClass); }
          }
        }
        return customizedClasses
      },
      isDisabled: function isDisabled(date) {
        return this.isDateDisabled(date) || this.isBeforeMinDate(date) || this.isAfterEndDate(date)
      },
      previousMonth: function previousMonth() {
        this.startingDate = this.subtractMonths(this.months[0].firstDateOfMonth);

        this.months.unshift(this.getMonth(this.startingDate));
        this.months.splice(this.months.length - 1, 1);
        this.$emit('previous-month', this.visibleMonths);
        this.resetFocusedDate(false);
      },
      nextMonth: function nextMonth() {
        this.startingDate = this.addMonths(this.months[this.months.length - 1].firstDateOfMonth);
        this.months.push(this.getMonth(this.startingDate));
        this.months.splice(0, 1);
        this.$emit('next-month', this.visibleMonths);
        this.resetFocusedDate(true);
      },
      subtractMonths: function subtractMonths(date) {
        return format_1(sub_months(date, 1), this.dateFormat)
      },
      addMonths: function addMonths$1(date) {
        return format_1(add_months(date, 1), this.dateFormat)
      },
      toggleDatepicker: function toggleDatepicker() {
        if (this.showDatepicker) {
          this.closeDatepicker();
        } else {
          this.openDatepicker();
        }
      },
      updateMonth: function updateMonth(offset, year, event) {
        var newMonth = event.target.value;
        var monthIdx = this.monthNames.indexOf(newMonth);
        var newDate = set_year(set_month(this.startingDate, monthIdx), year);
        this.startingDate = sub_months(newDate, offset);
        this.generateMonths();
      },
      updateYear: function updateYear(offset, monthIdx, event) {
        var newYear = event.target.value;
        var newDate = set_year(set_month(this.startingDate, monthIdx), newYear);
        this.startingDate = sub_months(newDate, offset);
        this.generateMonths();
      },
      openDatepicker: function openDatepicker() {
        var this$1 = this;

        this.positionDatepicker();
        this.setStartDates();
        this.triggerElement.classList.add('datepicker-open');
        this.showDatepicker = true;
        this.initialDate1 = this.dateOne;
        this.initialDate2 = this.dateTwo;
        this.$emit('opened');
        this.$nextTick(function () {
          if (!this$1.inline) { this$1.setFocusedDate(this$1.focusedDate); }
        });
      },
      closeDatepickerCancel: function closeDatepickerCancel() {
        if (this.showDatepicker) {
          this.selectedDate1 = this.initialDate1;
          this.selectedDate2 = this.initialDate2;
          this.$emit('cancelled');
          this.closeDatepicker();
        }
      },
      closeDatepicker: function closeDatepicker() {
        if (this.inline) {
          return
        }
        this.showDatepicker = false;
        this.showKeyboardShortcutsMenu = false;
        this.triggerElement.classList.remove('datepicker-open');
        this.$emit('closed');
      },
      openKeyboardShortcutsMenu: function openKeyboardShortcutsMenu() {
        this.showKeyboardShortcutsMenu = true;
        var shortcutMenuCloseBtn = this.$refs['keyboard-shortcus-menu-close'];
        this.$nextTick(function () { return shortcutMenuCloseBtn.focus(); });
      },
      closeKeyboardShortcutsMenu: function closeKeyboardShortcutsMenu() {
        var this$1 = this;

        this.showKeyboardShortcutsMenu = false;
        this.$nextTick(function () { return this$1.setFocusedDate(this$1.focusedDate); });
      },
      apply: function apply() {
        this.$emit('apply');
        this.closeDatepicker();
      },
      positionDatepicker: function positionDatepicker() {
        var triggerWrapperElement = findAncestor(this.triggerElement, '.datepicker-trigger');
        this.triggerPosition = this.triggerElement.getBoundingClientRect();
        if (triggerWrapperElement) {
          this.triggerWrapperPosition = triggerWrapperElement.getBoundingClientRect();
        } else {
          this.triggerWrapperPosition = { left: 0, right: 0 };
        }

        var viewportWidth = document.documentElement.clientWidth || window.innerWidth;
        this.viewportWidth = viewportWidth + 'px';
        this.isMobile = viewportWidth < 768;
        this.isTablet = viewportWidth >= 768 && viewportWidth <= 1024;
        this.showMonths = this.isMobile
          ? 1
          : this.isTablet && this.monthsToShow > 2
          ? 2
          : this.monthsToShow;

        this.$nextTick(function() {
          var datepickerWrapper = document.getElementById(this.wrapperId);
          if (!this.triggerElement || !datepickerWrapper) {
            return
          }

          var rightPosition =
            this.triggerElement.getBoundingClientRect().left +
            datepickerWrapper.getBoundingClientRect().width;
          this.alignRight = rightPosition > viewportWidth;
        });
      },
    },
  }

  var AirbnbStyleDatepickerPlugin = {
    install: function install(Vue, options) {
      Vue.component(AirbnbStyleDatepicker.name, Object.assign({}, options, AirbnbStyleDatepicker));
    }

  }; // User has to install the component by themselves, to allow to pass options

  if (typeof window !== 'undefined' && window.Vue) {
    window.AirbnbStyleDatepicker = AirbnbStyleDatepickerPlugin;
  }

  return AirbnbStyleDatepickerPlugin;

})));

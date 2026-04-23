import format from 'date-fns/format'
import addMonths from 'date-fns/add_months'
import subMonths from 'date-fns/sub_months'
import getDaysInMonth from 'date-fns/get_days_in_month'

export function buildWeeks({ date, sundayFirst, showOutsideDays }) {
  const weekDayNotInMonth = { dayNumber: 0 }
  const daysInMonth = getDaysInMonth(date)
  const year = format(date, 'YYYY')
  const month = format(date, 'MM')
  const dateObj = new Date(date)
  const prevMonthDate = subMonths(dateObj, 1)
  const nextMonthDate = addMonths(dateObj, 1)
  const prevYear = format(prevMonthDate, 'YYYY')
  const prevMonth = format(prevMonthDate, 'MM')
  const nextYear = format(nextMonthDate, 'YYYY')
  const nextMonth = format(nextMonthDate, 'MM')
  const prevMonthDays = getDaysInMonth(prevMonthDate)
  let firstDayInWeek = parseInt(format(date, sundayFirst ? 'd' : 'E'))
  if (sundayFirst) firstDayInWeek++

  const weeks = []
  let week = []

  for (let shift = 1; shift < firstDayInWeek; shift++) {
    if (showOutsideDays) {
      const dayNumber = prevMonthDays - (firstDayInWeek - 1 - shift)
      const dayNumberFull = dayNumber < 10 ? '0' + dayNumber : '' + dayNumber
      week.push({
        dayNumber,
        dayNumberFull,
        fullDate: prevYear + '-' + prevMonth + '-' + dayNumberFull,
        outside: true,
      })
    } else {
      week.push(weekDayNotInMonth)
    }
  }

  for (let dayOffset = 0; dayOffset < daysInMonth; dayOffset++) {
    const isLastDayInMonth = dayOffset >= daysInMonth - 1
    const dayNumber = dayOffset + 1
    const dayNumberFull = dayNumber < 10 ? '0' + dayNumber : dayNumber
    week.push({
      dayNumber,
      dayNumberFull,
      fullDate: year + '-' + month + '-' + dayNumberFull,
      outside: false,
    })

    if (week.length === 7) {
      weeks.push(week)
      week = []
    } else if (isLastDayInMonth) {
      for (let i = 0; i < 7 - week.length; i++) {
        if (showOutsideDays) {
          const outsideDay = i + 1
          const outsideDayFull = outsideDay < 10 ? '0' + outsideDay : '' + outsideDay
          week.push({
            dayNumber: outsideDay,
            dayNumberFull: outsideDayFull,
            fullDate: nextYear + '-' + nextMonth + '-' + outsideDayFull,
            outside: true,
          })
        } else {
          week.push(weekDayNotInMonth)
        }
      }
      weeks.push(week)
      week = []
    }
  }

  return weeks
}

export function buildMonth({ date, monthNames, sundayFirst, showOutsideDays }) {
  const firstDateOfMonth = format(date, 'YYYY-MM-01')
  const year = format(date, 'YYYY')
  const monthNumber = parseInt(format(date, 'M'))
  const monthName = monthNames[monthNumber - 1]

  return {
    year,
    firstDateOfMonth,
    monthName,
    monthNumber,
    weeks: buildWeeks({ date: firstDateOfMonth, sundayFirst, showOutsideDays }),
  }
}

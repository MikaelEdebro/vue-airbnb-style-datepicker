import format from 'date-fns/format'
import addDays from 'date-fns/add_days'
import subDays from 'date-fns/sub_days'
import isAfter from 'date-fns/is_after'
import isBefore from 'date-fns/is_before'

export function constrainRangeEndDate({
  startDate,
  candidateDate,
  dateFormat,
  getNearestBoundary,
  isDateBlocked,
}) {
  if (!startDate || !candidateDate) return candidateDate
  let constrainedCandidate = candidateDate

  if (isAfter(constrainedCandidate, startDate)) {
    const forwardBoundary = getNearestBoundary(startDate, 'forward')
    if (forwardBoundary && isAfter(constrainedCandidate, forwardBoundary)) {
      constrainedCandidate = forwardBoundary
    }
  } else if (isBefore(constrainedCandidate, startDate)) {
    const backwardBoundary = getNearestBoundary(startDate, 'backward')
    if (backwardBoundary && isBefore(constrainedCandidate, backwardBoundary)) {
      constrainedCandidate = backwardBoundary
    }
  }

  if (isAfter(constrainedCandidate, startDate)) {
    let date = format(addDays(startDate, 1), dateFormat)
    let guard = 0
    while ((date === constrainedCandidate || isBefore(date, constrainedCandidate)) && guard < 500) {
      if (isDateBlocked(date)) {
        return format(subDays(date, 1), dateFormat)
      }
      date = format(addDays(date, 1), dateFormat)
      guard++
    }
  } else if (isBefore(constrainedCandidate, startDate)) {
    let date = format(subDays(startDate, 1), dateFormat)
    let guard = 0
    while ((date === constrainedCandidate || isAfter(date, constrainedCandidate)) && guard < 500) {
      if (isDateBlocked(date)) {
        return format(addDays(date, 1), dateFormat)
      }
      date = format(subDays(date, 1), dateFormat)
      guard++
    }
  }

  return constrainedCandidate
}

export function isInRange({
  date,
  selectedDate1,
  selectedDate2,
  hoverDate,
  allDatesSelected,
  isSingleMode,
}) {
  if (!allDatesSelected || isSingleMode) return false
  return (
    (isAfter(date, selectedDate1) && isBefore(date, selectedDate2)) ||
    (isAfter(date, selectedDate1) && isBefore(date, hoverDate) && !allDatesSelected)
  )
}

export function isHoveredInRange({
  date,
  selectedDate1,
  hoverDate,
  allDatesSelected,
  isSelectingDate1,
  isSingleMode,
  isSameDate,
}) {
  if (isSingleMode || allDatesSelected || isSelectingDate1) return false
  if (hoverDate && isSameDate(date, hoverDate)) return true
  return (
    (isAfter(date, selectedDate1) && isBefore(date, hoverDate)) ||
    (isAfter(date, hoverDate) && isBefore(date, selectedDate1))
  )
}

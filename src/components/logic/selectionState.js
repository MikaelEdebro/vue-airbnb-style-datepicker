import isBefore from 'date-fns/is_before'

export function resolveSelectionOnDateClick({
  date,
  mode,
  selectable,
  isOutOfBounds,
  isDateDisabled,
  selectedDate1,
  selectedDate2,
  isSelectingDate1,
  constrainRangeEndDate,
}) {
  const allDatesSelected = !!(selectedDate1 && selectedDate2)

  if (!selectable || isOutOfBounds(date) || isDateDisabled(date)) {
    return { type: 'noop' }
  }

  if (mode === 'single') {
    return {
      type: 'single-selected',
      next: {
        selectedDate1: date,
        selectedDate2: selectedDate2 || '',
        isSelectingDate1: true,
      },
      shouldClose: true,
    }
  }

  if (allDatesSelected && date !== selectedDate1 && date !== selectedDate2) {
    return {
      type: 'clear-existing-range',
      next: {
        selectedDate1: '',
        selectedDate2: '',
        isSelectingDate1: true,
      },
    }
  }

  if (isSelectingDate1) {
    return {
      type: 'start-selected',
      next: {
        selectedDate1: date,
        selectedDate2: '',
        isSelectingDate1: false,
      },
    }
  }

  const start = selectedDate1
  const endCandidate = constrainRangeEndDate(start, date)
  if (isBefore(endCandidate, start)) {
    return {
      type: 'range-selected-backward',
      next: {
        selectedDate1: endCandidate,
        selectedDate2: start,
        isSelectingDate1: true,
      },
      shouldFinalizeRange: true,
    }
  }

  return {
    type: 'range-selected-forward',
    next: {
      selectedDate1: selectedDate1,
      selectedDate2: endCandidate,
      isSelectingDate1: true,
    },
    shouldFinalizeRange: true,
  }
}

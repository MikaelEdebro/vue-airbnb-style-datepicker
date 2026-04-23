import { resolveSelectionOnDateClick } from './selectionState'

export const SELECTION_STRATEGIES = ['single', 'range', 'reservation-aware-range']

export function normalizeSelectionStrategy(selectionStrategy, mode) {
  if (SELECTION_STRATEGIES.indexOf(selectionStrategy) > -1) return selectionStrategy
  return mode === 'single' ? 'single' : 'reservation-aware-range'
}

function pickRangeConstrainFn(strategyKey, defaultRangeConstrain, reservationAwareConstrain) {
  return strategyKey === 'reservation-aware-range' ? reservationAwareConstrain : defaultRangeConstrain
}

export function resolveClickTransitionByStrategy({
  strategyKey,
  date,
  selectable,
  isOutOfBounds,
  isDateDisabled,
  selectedDate1,
  selectedDate2,
  isSelectingDate1,
  defaultRangeConstrain,
  reservationAwareConstrain,
}) {
  const mode = strategyKey === 'single' ? 'single' : 'range'
  const constrainRangeEndDate =
    mode === 'single'
      ? (_start, end) => end
      : pickRangeConstrainFn(strategyKey, defaultRangeConstrain, reservationAwareConstrain)

  return resolveSelectionOnDateClick({
    date,
    mode,
    selectable,
    isOutOfBounds,
    isDateDisabled,
    selectedDate1,
    selectedDate2,
    isSelectingDate1,
    constrainRangeEndDate,
  })
}

export function resolveHoverDateByStrategy({
  strategyKey,
  date,
  isSelectingDate1,
  selectedDate1,
  defaultRangeConstrain,
  reservationAwareConstrain,
}) {
  if (strategyKey === 'single') return date
  if (!isSelectingDate1 && selectedDate1 && date) {
    const constrain =
      strategyKey === 'reservation-aware-range' ? reservationAwareConstrain : defaultRangeConstrain
    return constrain(selectedDate1, date)
  }
  return date
}

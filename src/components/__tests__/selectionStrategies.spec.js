import { describe, expect, it } from 'vitest'
import {
  normalizeSelectionStrategy,
  resolveClickTransitionByStrategy,
  resolveHoverDateByStrategy,
} from '../logic/selectionStrategies'

describe('selectionStrategies', () => {
  it('defaults to reservation-aware-range in range mode', () => {
    expect(normalizeSelectionStrategy(undefined, 'range')).toBe('reservation-aware-range')
  })

  it('defaults to single in single mode', () => {
    expect(normalizeSelectionStrategy(undefined, 'single')).toBe('single')
  })

  it('uses reservation-aware constrain in reservation-aware-range strategy', () => {
    const result = resolveClickTransitionByStrategy({
      strategyKey: 'reservation-aware-range',
      date: '2026-04-20',
      selectable: true,
      isOutOfBounds: () => false,
      isDateDisabled: () => false,
      selectedDate1: '2026-04-10',
      selectedDate2: '',
      isSelectingDate1: false,
      defaultRangeConstrain: (_start, end) => end,
      reservationAwareConstrain: () => '2026-04-15',
    })

    expect(result.next.selectedDate2).toBe('2026-04-15')
  })

  it('uses default range constrain in plain range strategy', () => {
    const result = resolveClickTransitionByStrategy({
      strategyKey: 'range',
      date: '2026-04-20',
      selectable: true,
      isOutOfBounds: () => false,
      isDateDisabled: () => false,
      selectedDate1: '2026-04-10',
      selectedDate2: '',
      isSelectingDate1: false,
      defaultRangeConstrain: () => '2026-04-18',
      reservationAwareConstrain: () => '2026-04-15',
    })

    expect(result.next.selectedDate2).toBe('2026-04-18')
  })

  it('constrains hover using selected strategy', () => {
    const hover = resolveHoverDateByStrategy({
      strategyKey: 'reservation-aware-range',
      date: '2026-04-20',
      isSelectingDate1: false,
      selectedDate1: '2026-04-10',
      defaultRangeConstrain: (_start, end) => end,
      reservationAwareConstrain: () => '2026-04-15',
    })

    expect(hover).toBe('2026-04-15')
  })
})

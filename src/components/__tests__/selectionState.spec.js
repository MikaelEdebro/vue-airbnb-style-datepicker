import { describe, expect, it } from 'vitest'
import { resolveSelectionOnDateClick } from '../logic/selectionState'

const noopBounds = () => false
const noopDisabled = () => false

describe('selectionState', () => {
  it('returns noop when date is blocked', () => {
    const result = resolveSelectionOnDateClick({
      date: '2026-04-10',
      mode: 'range',
      selectable: true,
      isOutOfBounds: () => true,
      isDateDisabled: noopDisabled,
      selectedDate1: '',
      selectedDate2: '',
      isSelectingDate1: true,
      constrainRangeEndDate: (_start, end) => end,
    })

    expect(result.type).toBe('noop')
  })

  it('selects single mode and signals close', () => {
    const result = resolveSelectionOnDateClick({
      date: '2026-04-10',
      mode: 'single',
      selectable: true,
      isOutOfBounds: noopBounds,
      isDateDisabled: noopDisabled,
      selectedDate1: '',
      selectedDate2: '',
      isSelectingDate1: true,
      constrainRangeEndDate: (_start, end) => end,
    })

    expect(result.type).toBe('single-selected')
    expect(result.shouldClose).toBe(true)
    expect(result.next.selectedDate1).toBe('2026-04-10')
  })

  it('clears existing range before starting a new one', () => {
    const result = resolveSelectionOnDateClick({
      date: '2026-04-20',
      mode: 'range',
      selectable: true,
      isOutOfBounds: noopBounds,
      isDateDisabled: noopDisabled,
      selectedDate1: '2026-04-10',
      selectedDate2: '2026-04-12',
      isSelectingDate1: true,
      constrainRangeEndDate: (_start, end) => end,
    })

    expect(result.type).toBe('clear-existing-range')
    expect(result.next.selectedDate1).toBe('')
    expect(result.next.selectedDate2).toBe('')
    expect(result.next.isSelectingDate1).toBe(true)
  })

  it('handles backward range selection by swapping dates', () => {
    const result = resolveSelectionOnDateClick({
      date: '2026-04-08',
      mode: 'range',
      selectable: true,
      isOutOfBounds: noopBounds,
      isDateDisabled: noopDisabled,
      selectedDate1: '2026-04-10',
      selectedDate2: '',
      isSelectingDate1: false,
      constrainRangeEndDate: (_start, end) => end,
    })

    expect(result.type).toBe('range-selected-backward')
    expect(result.shouldFinalizeRange).toBe(true)
    expect(result.next.selectedDate1).toBe('2026-04-08')
    expect(result.next.selectedDate2).toBe('2026-04-10')
  })
})

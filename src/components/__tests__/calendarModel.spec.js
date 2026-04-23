import { describe, expect, it } from 'vitest'
import { buildMonth, buildWeeks } from '../logic/calendarModel'

describe('calendarModel', () => {
  it('builds month metadata and weeks', () => {
    const month = buildMonth({
      date: '2026-04-15',
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ],
      sundayFirst: false,
      showOutsideDays: true,
    })

    expect(month.monthName).toBe('April')
    expect(month.firstDateOfMonth).toBe('2026-04-01')
    expect(month.weeks.length).toBeGreaterThan(3)
  })

  it('omits outside days when configured', () => {
    const weeks = buildWeeks({
      date: '2026-04-01',
      sundayFirst: false,
      showOutsideDays: false,
    })

    const hasOutside = weeks.flat().some(day => day && day.outside)
    expect(hasOutside).toBe(false)
  })
})

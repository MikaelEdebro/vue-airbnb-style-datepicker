import { describe, expect, it } from 'vitest'
import { computeBadgeAnchor } from '../logic/badgeLayout'

function rect(left, top, right, bottom) {
  return { left, top, right, bottom }
}

describe('badgeLayout', () => {
  it('computes start-inside anchor from reservation start cell', () => {
    const wrapRect = rect(0, 0, 300, 200)
    const rects = [
      { d: '2026-04-02', rect: rect(10, 10, 50, 48) },
      { d: '2026-04-03', rect: rect(50, 10, 90, 48) },
      { d: '2026-04-04', rect: rect(90, 10, 130, 48) },
    ]

    const anchor = computeBadgeAnchor({
      rects,
      wrapRect,
      startDate: '2026-04-02',
      placement: 'start-inside',
      offset: 6,
      yOffset: 0,
    })

    expect(anchor.anchorClass).toBe('asd__badge--start')
    expect(anchor.x).toBe(16)
    expect(anchor.y).toBe(29)
  })

  it('computes center row anchor for multi-cell reservation', () => {
    const wrapRect = rect(0, 0, 300, 200)
    const rects = [
      { d: '2026-04-10', rect: rect(100, 40, 140, 78) },
      { d: '2026-04-11', rect: rect(140, 40, 180, 78) },
      { d: '2026-04-12', rect: rect(180, 40, 220, 78) },
    ]

    const anchor = computeBadgeAnchor({
      rects,
      wrapRect,
      startDate: '2026-04-10',
      placement: 'center',
      centerMode: 'row',
      minCellsForRowCenter: 2,
    })

    expect(anchor.anchorClass).toBe('asd__badge--center')
    expect(anchor.x).toBe(160)
    expect(anchor.y).toBe(59)
  })

  it('clamps x position to wrapper bounds', () => {
    const wrapRect = rect(0, 0, 120, 120)
    const rects = [
      { d: '2026-04-02', rect: rect(110, 10, 150, 48) },
    ]

    const anchor = computeBadgeAnchor({
      rects,
      wrapRect,
      startDate: '2026-04-02',
      placement: 'start-edge',
      offset: 6,
      clampMargin: 6,
    })

    expect(anchor.x).toBe(114)
  })
})

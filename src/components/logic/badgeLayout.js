export function computeBadgeAnchor({
  rects,
  wrapRect,
  startDate,
  placement = 'start-inside',
  centerMode = 'row',
  minCellsForRowCenter = 2,
  offset = 6,
  yOffset = 0,
  clampMargin = 6,
}) {
  if (!Array.isArray(rects) || !rects.length || !wrapRect) return null
  const wrapWidth = typeof wrapRect.width === 'number' ? wrapRect.width : (wrapRect.right - wrapRect.left)

  const almostEqual = (a, b) => Math.abs(a - b) < 1.0
  const sorted = rects.slice().sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left))
  const rowGroups = []
  for (const item of sorted) {
    const group = rowGroups[rowGroups.length - 1]
    if (!group || !almostEqual(group[0].rect.top, item.rect.top)) rowGroups.push([item])
    else group.push(item)
  }

  const widthForGroup = group => group[group.length - 1].rect.right - group[0].rect.left
  const chosenGroup =
    rowGroups.find(group => group.length >= Math.max(1, minCellsForRowCenter || 2)) ||
    rowGroups.slice().sort((a, b) => widthForGroup(b) - widthForGroup(a))[0] ||
    rowGroups[0]
  if (!chosenGroup || !chosenGroup.length) return null

  const firstRowLeft = chosenGroup[0].rect.left
  const firstRowRight = chosenGroup[chosenGroup.length - 1].rect.right
  const startRectObj = rects.find(item => item.d === startDate) || chosenGroup[0]
  const startRect = startRectObj.rect

  const avg = arr => arr.reduce((sum, value) => sum + value, 0) / Math.max(1, arr.length)
  const avgCenterX = avg(rects.map(item => (item.rect.left + item.rect.right) / 2)) - wrapRect.left
  const avgCenterY = avg(rects.map(item => (item.rect.top + item.rect.bottom) / 2)) - wrapRect.top
  const startCenterY = (startRect.top + startRect.bottom) / 2 - wrapRect.top

  let x
  let y
  let anchorClass
  if (placement === 'center') {
    if (centerMode === 'full') {
      x = avgCenterX
      y = avgCenterY
    } else {
      const rowMidY = (chosenGroup[0].rect.top + chosenGroup[0].rect.bottom) / 2 - wrapRect.top
      const rowMidX = (firstRowLeft + firstRowRight) / 2 - wrapRect.left
      x = rowMidX
      y = rowMidY
    }
    anchorClass = 'asd__badge--center'
  } else if (placement === 'start-edge') {
    x = startRect.right - wrapRect.left + (offset || 0)
    y = startCenterY
    anchorClass = 'asd__badge--start'
  } else {
    x = startRect.left - wrapRect.left + (offset || 0)
    y = startCenterY
    anchorClass = 'asd__badge--start'
  }

  const margin = clampMargin || 0
  x = Math.max(margin, Math.min((wrapWidth - margin), x))
  y += Number(yOffset) || 0

  return { x, y, anchorClass }
}

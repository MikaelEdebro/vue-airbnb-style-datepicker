import isAfter from 'date-fns/is_after'
import isBefore from 'date-fns/is_before'

export function isReservationInteriorDate(date, reservation) {
  if (!date || !reservation || !reservation.start || !reservation.end) return false
  return isAfter(date, reservation.start) && isBefore(date, reservation.end)
}

export function getNearestReservationBoundary(date, direction, reservations) {
  if (!date || !Array.isArray(reservations) || !reservations.length) return null
  let boundary = null

  for (let i = 0; i < reservations.length; i++) {
    const reservation = reservations[i]
    if (!reservation || !reservation.start || !reservation.end) continue

    if (direction === 'forward') {
      if (isAfter(reservation.start, date) && (!boundary || isBefore(reservation.start, boundary))) {
        boundary = reservation.start
      }
    } else if (direction === 'backward') {
      if (isBefore(reservation.end, date) && (!boundary || isAfter(reservation.end, boundary))) {
        boundary = reservation.end
      }
    }
  }

  return boundary
}

export function buildReservationDateInfo(date, reservation, idx, colorFactory) {
  if (!date || !reservation || !reservation.start || !reservation.end) return null
  const inRange =
    (isAfter(date, reservation.start) || date === reservation.start) &&
    (isBefore(date, reservation.end) || date === reservation.end)

  if (!inRange) return null

  const isStart = date === reservation.start
  const isEnd = date === reservation.end
  const variant = isStart && isEnd ? 'single' : isStart ? 'start' : isEnd ? 'end' : 'middle'
  const color = colorFactory(reservation)

  return {
    variant,
    color,
    idx,
    id: reservation.id != null ? reservation.id : idx,
    label: reservation.label,
    tooltip: reservation.tooltip || reservation.label,
    start: reservation.start,
    end: reservation.end,
    isStart,
    isEnd,
  }
}

export function reservationForDate(date, reservations, infoFactory) {
  if (!date || !Array.isArray(reservations) || !reservations.length) return null
  for (let i = 0; i < reservations.length; i++) {
    const reservationDateInfo = infoFactory(date, reservations[i], i)
    if (reservationDateInfo) return reservationDateInfo
  }
  return null
}

export function reservationsForDate(date, reservations, infoFactory) {
  if (!date || !Array.isArray(reservations) || !reservations.length) return []
  const results = []
  for (let i = 0; i < reservations.length; i++) {
    const reservationDateInfo = infoFactory(date, reservations[i], i)
    if (reservationDateInfo) results.push(reservationDateInfo)
  }
  return results
}

export function isDateDisabledByReservationInterior(date, reservations) {
  if (!Array.isArray(reservations) || !reservations.length || !date) return false
  for (let i = 0; i < reservations.length; i++) {
    if (isReservationInteriorDate(date, reservations[i])) return true
  }
  return false
}

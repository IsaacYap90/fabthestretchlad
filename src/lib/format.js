/**
 * Format a date string (YYYY-MM-DD) to a readable format.
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {object} options - Intl.DateTimeFormat options
 */
export function formatDate(dateStr, options) {
  const defaults = { weekday: 'short', day: 'numeric', month: 'short' }
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', options || defaults)
}

/**
 * Format a date string with year included.
 */
export function formatDateLong(dateStr) {
  return formatDate(dateStr, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * Format a date string with full weekday and month.
 */
export function formatDateFull(dateStr) {
  return formatDate(dateStr, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Format a 24h time string (HH:MM) to 12h format (e.g. "2:30 PM").
 * Correctly handles 12:xx as PM and 0:xx as 12:xx AM.
 * @param {string} time - Time in HH:MM format
 */
export function formatTime(time) {
  const [h, m] = time.split(':')
  const hr = parseInt(h, 10)
  const suffix = hr >= 12 ? 'PM' : 'AM'
  const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr
  return `${hr12}:${m} ${suffix}`
}

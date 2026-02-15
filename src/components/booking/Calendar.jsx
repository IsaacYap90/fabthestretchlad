import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar({ selectedDate, onSelectDate, availableDays = [1,2,3,4,5,6] }) {
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  const isAvailable = (day) => {
    const d = new Date(viewYear, viewMonth, day)
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return false
    return availableDays.includes(d.getDay())
  }

  const isSelected = (day) => {
    if (!selectedDate) return false
    const d = new Date(viewYear, viewMonth, day)
    return d.toDateString() === new Date(selectedDate).toDateString()
  }

  const isToday = (day) => {
    return viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate()
  }

  const handleSelect = (day) => {
    if (!isAvailable(day)) return
    const d = new Date(viewYear, viewMonth, day)
    onSelectDate(d.toISOString().split('T')[0])
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-gray-400 hover:text-white p-2">◀</button>
        <h3 className="text-white font-bold">{MONTHS[viewMonth]} {viewYear}</h3>
        <button onClick={nextMonth} className="text-gray-400 hover:text-white p-2">▶</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-xs text-gray-500 font-semibold py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div key={i} className="aspect-square">
            {day && (
              <button
                onClick={() => handleSelect(day)}
                disabled={!isAvailable(day)}
                className={`w-full h-full rounded-lg text-sm font-medium transition-all flex items-center justify-center
                  ${isSelected(day) ? 'bg-red-600 text-white' : ''}
                  ${isToday(day) && !isSelected(day) ? 'border border-red-600/50 text-red-400' : ''}
                  ${isAvailable(day) && !isSelected(day) && !isToday(day) ? 'text-white hover:bg-white/10' : ''}
                  ${!isAvailable(day) ? 'text-gray-700 cursor-not-allowed' : ''}
                `}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

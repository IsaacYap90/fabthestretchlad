export default function TimeSlots({ slots = [], selectedSlot, onSelectSlot, bookedSlots = [] }) {
  const formatTime = (t) => {
    const [h, m] = t.split(':')
    const hr = parseInt(h)
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
  }

  if (!slots.length) {
    return <p className="text-gray-500 text-sm">No available slots for this date</p>
  }

  return (
    <div className="space-y-2">
      {slots.map((slot, i) => {
        const isBooked = bookedSlots.some(b => b.start_time === slot.start_time)
        const isSelected = selectedSlot?.start_time === slot.start_time

        return (
          <button
            key={i}
            onClick={() => !isBooked && onSelectSlot(slot)}
            disabled={isBooked}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-sm
              ${isSelected ? 'bg-red-600/20 border border-red-600 text-white' : ''}
              ${isBooked ? 'bg-white/[0.02] text-gray-600 cursor-not-allowed line-through' : ''}
              ${!isSelected && !isBooked ? 'bg-white/5 border border-transparent hover:border-white/20 text-gray-300' : ''}
            `}
          >
            <span>{formatTime(slot.start_time)} – {formatTime(slot.end_time)}</span>
            {isBooked && <span className="text-xs text-gray-600">Taken</span>}
            {isSelected && <span className="text-red-400 text-xs">Selected ✓</span>}
          </button>
        )
      })}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'

const GREETING = "Hey! 💪 I'm Fab's AI assistant. Tell me what's bothering you — tight shoulders? Back pain? I'll recommend the perfect stretch session for you."

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      // Send only role/content pairs (exclude greeting which is local-only)
      const apiMessages = updated
        .filter((_, i) => i > 0 || updated[0].role === 'user')
        .map(({ role, content }) => ({ role, content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, something went wrong. Please try again!' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops! Couldn't connect. Try again or reach Fab on WhatsApp!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] transition-all duration-300 origin-bottom-right ${
          open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden" style={{ maxHeight: 'min(500px, calc(100vh - 160px))' }}>
          {/* Header */}
          <div className="bg-[#0a0a0a] px-5 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-black">F</div>
              <div>
                <p className="text-white text-sm font-bold leading-tight">Fab's AI Assistant</p>
                <p className="text-green-500 text-[10px]">● Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-neutral-500 hover:text-white transition-colors text-xl leading-none p-1">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: '200px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-red-600 text-white rounded-br-md'
                    : 'bg-white/10 text-neutral-200 rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/10 bg-[#0a0a0a]">
            <form onSubmit={e => { e.preventDefault(); send() }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about stretch therapy..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-red-600/50 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-neutral-600 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600/30 text-white rounded-xl transition-colors text-sm font-bold"
              >
                Send
              </button>
            </form>
            <p className="text-center text-neutral-600 text-[10px] mt-2">🤖 AI-Powered by ChatGPT</p>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg shadow-red-600/20 transition-all duration-300 flex items-center gap-2 text-sm ${
          open ? 'scale-90 opacity-80' : 'scale-100'
        }`}
      >
        {open ? '✕ Close' : '💬 Ask Fab\'s AI'}
      </button>
    </>
  )
}

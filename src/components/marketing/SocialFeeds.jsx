import { useState, useEffect, useRef } from 'react'

function LazyEmbed({ src, title, sandbox }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden" style={{ minHeight: '480px' }}>
      {visible ? (
        <iframe
          src={src}
          className="w-full"
          style={{ minHeight: '480px', border: 'none' }}
          loading="lazy"
          title={title}
          {...(sandbox ? { sandbox } : {})}
        />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[480px] text-gray-500 text-sm">
          Loading {title}...
        </div>
      )}
    </div>
  )
}

export default function SocialFeeds() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Follow the Journey</h2>
          <p className="text-neutral-400">Tips, client transformations, and behind-the-scenes</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl" aria-hidden="true">📸</span>
              <span className="text-white font-bold">Instagram</span>
              <a href="https://www.instagram.com/fab.thestretchlad" target="_blank" rel="noopener noreferrer" className="text-red-500 text-sm hover:underline ml-auto focus-visible:ring-2 focus-visible:ring-red-400 rounded">@fab.thestretchlad</a>
            </div>
            <LazyEmbed src="https://www.instagram.com/fab.thestretchlad/embed" title="Fab Instagram feed" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl" aria-hidden="true">🎵</span>
              <span className="text-white font-bold">TikTok</span>
              <a href="https://www.tiktok.com/@fab.thestretchlad" target="_blank" rel="noopener noreferrer" className="text-red-500 text-sm hover:underline ml-auto focus-visible:ring-2 focus-visible:ring-red-400 rounded">@fab.thestretchlad</a>
            </div>
            <LazyEmbed src="https://www.tiktok.com/embed/@fab.thestretchlad" title="Fab TikTok feed" sandbox="allow-scripts allow-same-origin allow-popups" />
          </div>
        </div>
      </div>
    </section>
  )
}

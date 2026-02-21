export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600/10 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-red-600 text-xs font-semibold uppercase tracking-widest">Now Booking</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] text-white mb-6">
              Your Body<br /><span className="text-red-600">Deserves to</span><br />Move Freely.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Professional stretch & mobility therapy for <span className="text-white font-semibold">everyone</span> — athletes, office workers, weekend warriors, and anyone who wants to feel better in their body.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#book" className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-lg shadow-red-600/10 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">Book Your Session</a>
              <a href="#consult" className="px-7 py-3.5 border border-white/10 hover:border-red-600 text-white font-semibold rounded-full transition-all focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">Free Consultation</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['Weightlifter', 'Yoga', 'Runner', 'Office'].map((label, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-red-600/20 border-2 border-[#0a0a0a] flex items-center justify-center text-sm" aria-label={label}>
                    {['🏋️', '🧘', '🏃', '💼'][i]}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm"><span className="text-white font-semibold">30+ active clients</span> trust Fab monthly</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] rounded-3xl border border-white/10 overflow-hidden">
              <img
                src="/images/fab-hero.jpg"
                alt="Fab performing assisted stretch therapy"
                className="w-full h-full object-cover"
                width={600}
                height={800}
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-4 left-0 bg-[#1a1a1a] rounded-2xl shadow-xl p-4 border border-white/10">
              <p className="text-red-600 font-black text-2xl">RMT</p>
              <p className="text-gray-400 text-xs">Registered Massage<br/>Therapist</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

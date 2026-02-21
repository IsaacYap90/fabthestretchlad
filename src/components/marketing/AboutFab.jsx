export default function AboutFab() {
  return (
    <section id="about" className="py-24 bg-[#111111]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square rounded-3xl border border-white/10 overflow-hidden">
            <img
              src="/images/fab-about.jpg"
              alt="Fabian — The Stretch Lad"
              className="w-full h-full object-cover object-top"
              width={600}
              height={600}
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Meet Fab.</h2>
            <div className="w-12 h-1 bg-red-600 rounded-full mb-6" />
            <p className="text-gray-400 text-base leading-relaxed mb-4">
              <span className="text-white font-semibold">Fabian</span> is a stretch trainer, sports massage therapist and mobility coach with a passion for helping people move and feel better. Known as <span className="text-red-600 font-semibold">"The Stretch Lad"</span>, he works with <span className="text-white font-semibold">office professionals, busy parents, seniors, weekend gym-goers</span> and even ONE Championship athletes.
            </p>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              With a strong foundation in anatomy and physiology, Fab brings a scientific, evidence-based approach to training. His individualized programs address specific areas of tightness or weakness, incorporating dynamic stretching techniques to <span className="text-white font-semibold">improve range of motion and prevent injuries</span>.
            </p>
            <div className="space-y-3">
              {['Trusted by ONE Championship Athletes', 'Sports Massage Therapist', 'Mobility & Stretch Coaching', 'Evidence-Based, Individualized Programs', 'Trusted by 30+ Active Clients Monthly'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 text-xs" aria-hidden="true">✓</span>
                  <span className="text-gray-400 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

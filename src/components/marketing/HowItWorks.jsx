const steps = [
  { num: '01', title: 'Book Online', desc: 'Choose your session length and preferred time slot.' },
  { num: '02', title: 'Assessment', desc: 'Fab evaluates your mobility, posture, and problem areas.' },
  { num: '03', title: 'Stretch & Release', desc: 'Targeted assisted stretching tailored to your body\'s needs.' },
  { num: '04', title: 'Move Better', desc: 'Walk out feeling lighter, looser, and more mobile.' },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">How It Works</h2>
          <div className="w-12 h-1 bg-red-600 rounded-full mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-600/10 flex items-center justify-center">
                <span className="text-red-600 font-black text-lg">{s.num}</span>
              </div>
              <h3 className="font-bold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const audiences = [
  { emoji: '💼', title: 'Office Workers', desc: 'Fix that desk posture. Release tension in your neck, back, and shoulders.' },
  { emoji: '💻', title: 'Remote Workers', desc: 'Hours on the couch or bed with a laptop? Your hips and spine are paying for it.' },
  { emoji: '🧘', title: 'Seniors & Parents', desc: 'Stay mobile and independent. Gentle stretching tailored to your body.' },
  { emoji: '🏃', title: 'Weekend Warriors', desc: 'Train hard, recover harder. Don\'t let tightness hold you back.' },
  { emoji: '🎯', title: 'Everyone', desc: 'If you have a body, you need to stretch. It\'s that simple.' },
  { emoji: '🏋️', title: 'Athletes', desc: 'Recover faster, prevent injuries, and improve range of motion for peak performance.' },
]

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-[#111111]">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Who Is This For?</h2>
          <div className="w-12 h-1 bg-red-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-400 text-lg max-w-lg mx-auto">Everyone needs to stretch. Here's why people come to Fab.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {audiences.map((a, i) => (
            <div key={i} className="group bg-[#1a1a1a] border border-white/10 hover:border-red-600/30 rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/5">
              <div className="text-3xl mb-4" aria-hidden="true">{a.emoji}</div>
              <h3 className="text-lg font-bold text-white mb-2">{a.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

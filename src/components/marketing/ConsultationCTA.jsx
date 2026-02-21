const WHATSAPP_URL = 'https://wa.me/6598778027'

export default function ConsultationCTA() {
  return (
    <section id="consult" className="py-24 bg-neutral-950">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Every Body Is Different.</h2>
        <p className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Book a free consultation with Fab to get a personalised stretch therapy plan tailored to your needs.
        </p>
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent("Hi Fab! I'd like to book a free consultation.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-lg shadow-red-600/10 text-lg focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          Consult Fab via WhatsApp
        </a>
      </div>
    </section>
  )
}

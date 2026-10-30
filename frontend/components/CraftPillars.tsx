export default function CraftPillars() {
  const pillars = [
    {
      icon: 'checkroom',
      bg: 'bg-secondary-container',
      color: 'text-on-secondary-container',
      title: '100% Premium Cotton',
      body: 'Crafted with ultra-soft, long-staple breathable cotton and high-loft winter microfleece for lasting comfort.',
    },
    {
      icon: 'payments',
      bg: 'bg-secondary-fixed',
      color: 'text-on-secondary-fixed',
      title: 'Doorstep COD & UPI',
      body: 'Zero advance required. Pay seamlessly via cash or any scan-to-pay UPI app at the moment of parcel handover.',
    },
    {
      icon: 'spa',
      bg: 'bg-primary-fixed',
      color: 'text-on-primary-fixed',
      title: '100% Breathable & Safe',
      body: 'Gentle, skin-friendly weaves free from harsh chemical finishes—woven for restful, irritation-free sleep.',
    },
    {
      icon: 'published_with_changes',
      bg: 'bg-surface-container-highest',
      color: 'text-on-surface',
      title: '7-Day Doorstep Pickup',
      body: 'Experience total tranquility. If the texture does not enchant you, our courier collects it directly from your home.',
    },
  ];

  return (
    <section
      className="w-full bg-surface py-20 transition-colors duration-300"
      id="craft-pillars"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="p-8 rounded-xl bg-surface-container-low hover:bg-surface-container border border-transparent dark:border-outline-variant/30 transition-colors duration-300 shadow-sm"
            >
              <div
                className={`w-12 h-12 rounded-full ${p.bg} ${p.color} flex items-center justify-center mb-6`}
              >
                <span className="material-symbols-outlined text-2xl">{p.icon}</span>
              </div>
              <h3 className="font-title-lg text-title-lg text-on-surface mb-2">{p.title}</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

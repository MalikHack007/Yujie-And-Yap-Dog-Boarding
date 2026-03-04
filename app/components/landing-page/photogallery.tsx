const photos = [
  { emoji: "🐕", label: "Morning Park Run",    gradient: "from-[var(--color-green-200)] to-[var(--color-green-500)]", large: true },
  { emoji: "🦮", label: "Leash Training",       gradient: "from-[var(--color-amber-100)] to-[var(--color-amber-400)]", large: false },
  { emoji: "🐩", label: "Grooming Day",         gradient: "from-[var(--color-bark-100)]  to-[var(--color-bark-400)]",  large: false },
  { emoji: "🐾", label: "Paw Print Art",        gradient: "from-[var(--color-amber-100)] to-[var(--color-amber-400)]", large: false },
  { emoji: "🏡", label: "Home Away From Home",  gradient: "from-[var(--color-green-200)] to-[var(--color-green-600)]", large: true },
  { emoji: "🎾", label: "Fetch Champion",       gradient: "from-[var(--color-bark-100)]  to-[var(--color-bark-400)]",  large: false },
];

export default function PhotoGallery() {
  return (
    <section className="w-full relative overflow-hidden bg-[var(--color-bg)] pt-[var(--spacing-24)] pb-[var(--spacing-28)]">

      {/* Diagonal top edge */}
      <div
        aria-hidden
        className="
          absolute top-0 left-0 right-0 h-20
          bg-[var(--color-surface)]
          [clip-path:polygon(0_0,100%_0,100%_100%)]
          pointer-events-none
        "
      />

      <div className="max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)] relative z-10">

        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-[var(--spacing-4)] mb-[var(--spacing-10)]">
          <div>
            {/* Eyebrow — text-xs for size, color separate */}
            <p className="
              font-[var(--font-ui)]
              text-xs font-semibold
              tracking-[var(--letter-spacing-widest)] uppercase
              text-[var(--color-primary)]
              mb-[var(--spacing-3)]
            ">
              📸 &nbsp;The Pack in Action
            </p>

            {/* Heading — text-4xl for size, color separate */}
            <h2 className="
              font-[var(--font-display)]
              text-4xl font-bold
              text-[var(--color-text-primary)]
              leading-[var(--line-height-tight)]
              tracking-[var(--letter-spacing-tight)]
            ">
              A glimpse into our
              <br />
              <span className="text-[var(--color-primary)]">happy pack</span>
            </h2>
          </div>

          {/* Caption — text-base for size, color separate */}
          <p className="
            font-[var(--font-body)]
            text-base
            text-[var(--color-text-muted)]
            leading-[var(--line-height-relaxed)]
            max-w-[30ch] text-right
          ">
            Every day is an adventure. Here's what life looks like in our care.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-3 gap-[var(--spacing-4)]">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={[
                photo.large ? "row-span-2" : "row-span-1",
                "relative rounded-[var(--radius-2xl)] overflow-hidden",
                photo.large ? "aspect-[3/4]" : "aspect-square",
                `bg-gradient-to-br ${photo.gradient}`,
                "shadow-[var(--shadow-md)]",
                "flex items-center justify-center",
                // Raw pixel sizes for decorative emoji — no color token, no collision risk
                photo.large ? "text-[64px]" : "text-[40px]",
                "cursor-pointer",
                "transition-all duration-[var(--duration-slow)]",
                "hover:scale-[1.02] hover:shadow-[var(--shadow-xl)]",
              ].join(" ")}
            >
              <span>{photo.emoji}</span>

              {/* Label overlay — text-xs for size, text-white/90 for color (no var collision) */}
              <div className="
                absolute bottom-0 left-0 right-0
                px-[var(--spacing-4)] pb-[var(--spacing-3)] pt-[var(--spacing-8)]
                bg-[linear-gradient(to_top,rgba(22,59,22,0.75)_0%,transparent_100%)]
                rounded-b-[var(--radius-2xl)]
              ">
                <p className="
                  font-[var(--font-ui)]
                  text-xs font-semibold
                  tracking-[var(--letter-spacing-wide)] uppercase
                  text-white/90
                ">
                  {photo.label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
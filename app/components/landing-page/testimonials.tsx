const testimonials = [
  {
    name: "Sarah M.",
    dog: "Bruno, Golden Retriever",
    quote:
      "I was so nervous leaving Bruno for the first time, but the team made us both feel completely at ease. He came home tired and happy — what more could you ask for?",
    rating: 5,
    avatar: "🐶",
  },
  {
    name: "James & Priya K.",
    dog: "Noodle, Dachshund",
    quote:
      "Noodle has separation anxiety, and honestly so do we. The daily photo updates and check-ins were a lifesaver. We booked again for our next trip before we even got home.",
    rating: 5,
    avatar: "🌭",
  },
  {
    name: "Terrence L.",
    dog: "Zeus, German Shepherd",
    quote:
      "Zeus is a big boy and needs an experienced hand. These folks handled him beautifully — firm, kind, and clearly knowledgeable. We won't go anywhere else.",
    rating: 5,
    avatar: "🐺",
  },
];

export default function CustomerTestimonials() {
  return (
    <section className="w-full relative overflow-hidden bg-[var(--color-surface)] pt-[var(--spacing-24)] pb-[var(--spacing-28)]">

      {/* Dot grid background */}
      <div
        aria-hidden
        className="
          absolute inset-0
          [background-image:radial-gradient(var(--color-green-100)_1px,transparent_1px)]
          [background-size:28px_28px]
          opacity-60 pointer-events-none
        "
      />

      <div className="max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)] relative z-10">

        {/* Header */}
        <div className="text-center mb-[var(--spacing-14)]">
          {/* Eyebrow — text-xs for size, color separate */}
          <p className="
            font-[var(--font-ui)]
            text-xs font-semibold
            tracking-[var(--letter-spacing-widest)] uppercase
            text-[var(--color-accent)]
            mb-[var(--spacing-3)]
          ">
            ❤️ &nbsp;Pet Parent Stories
          </p>

          {/* Heading — text-4xl for size, color separate */}
          <h2 className="
            font-[var(--font-display)]
            text-4xl font-bold
            text-[var(--color-text-primary)]
            leading-[var(--line-height-tight)]
            tracking-[var(--letter-spacing-tight)]
            mb-[var(--spacing-4)]
          ">
            What happy pet parents say
          </h2>

          {/* Subheading — text-lg for size, color separate */}
          <p className="
            font-[var(--font-body)]
            text-lg
            text-[var(--color-text-secondary)]
            leading-[var(--line-height-relaxed)]
            max-w-[44ch] mx-auto
          ">
            Don't take our word for it — hear it straight from the humans
            (and pups) who've trusted us.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-6)]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="
                bg-[var(--color-surface)]
                border border-[var(--color-border)]
                rounded-[var(--radius-card)]
                p-[var(--spacing-8)]
                shadow-[var(--shadow-md)]
                flex flex-col gap-[var(--spacing-5)]
                transition-all duration-[var(--duration-slow)]
                hover:-translate-y-1 hover:shadow-[var(--shadow-green)]
                cursor-default
              "
            >
              {/* Stars — text-sm for size, color separate */}
              <div className="flex gap-[var(--spacing-1)]">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <span key={s} className="text-sm text-[var(--color-star)]">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote — text-base for size, color separate */}
              <blockquote className="
                font-[var(--font-body)]
                text-base
                text-[var(--color-text-secondary)]
                leading-[var(--line-height-relaxed)]
                italic m-0 grow
                border-l-[3px] border-[var(--color-primary-light)]
                pl-[var(--spacing-4)]
              ">
                "{t.quote}"
              </blockquote>

              {/* Reviewer */}
              <div className="
                flex items-center gap-[var(--spacing-3)]
                pt-[var(--spacing-4)]
                border-t border-[var(--color-border)]
              ">
                <div className="
                  w-[var(--spacing-10)] h-[var(--spacing-10)]
                  rounded-[var(--radius-avatar)]
                  bg-[var(--color-green-100)]
                  flex items-center justify-center
                  text-[22px] shrink-0
                ">
                  {t.avatar}
                </div>
                <div>
                  {/* Name — text-sm for size, color separate */}
                  <p className="
                    font-[var(--font-ui)]
                    text-sm font-semibold
                    text-[var(--color-text-primary)]
                    leading-[var(--line-height-snug)]
                  ">
                    {t.name}
                  </p>
                  {/* Dog label — text-xs for size, color separate */}
                  <p className="
                    font-[var(--font-ui)]
                    text-xs
                    text-[var(--color-text-muted)]
                    leading-[var(--line-height-snug)]
                  ">
                    {t.dog}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
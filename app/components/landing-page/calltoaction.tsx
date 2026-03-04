import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="w-full relative overflow-hidden bg-[var(--color-green-800)] pt-[var(--spacing-28)] pb-[var(--spacing-28)]">

      {/* Radial glow */}
      <div
        aria-hidden
        className="
          absolute inset-0
          bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,var(--color-green-600)_0%,transparent_70%)]
          opacity-50 pointer-events-none
        "
      />

      {/* Amber accent circle */}
      <div
        aria-hidden
        className="
          absolute -top-24 -right-24
          w-[500px] h-[500px]
          rounded-[var(--radius-full)]
          bg-[radial-gradient(circle,var(--color-amber-400)_0%,transparent_65%)]
          opacity-15 pointer-events-none
        "
      />

      {/* Watermark paw print — raw pixel size, no color token, no collision */}
      <div
        aria-hidden
        className="
          absolute -bottom-10 left-[5%]
          text-[240px] leading-none
          opacity-[0.04] pointer-events-none select-none
        "
      >
        🐾
      </div>

      <div className="
        max-w-[var(--width-4xl)] mx-auto
        px-[var(--spacing-8)]
        relative z-10 text-center
      ">

        {/* Eyebrow — text-xs for size, color separate */}
        <p className="
          font-[var(--font-ui)]
          text-xs font-semibold
          tracking-[var(--letter-spacing-widest)] uppercase
          text-[var(--color-amber-300)]
          mb-[var(--spacing-5)]
        ">
          🐶 &nbsp;Get Started Today
        </p>

        {/* Heading — text-5xl for size, text-white is a named utility (no var collision) */}
        <h2 className="
          font-[var(--font-display)]
          text-5xl font-bold
          text-white
          leading-[var(--line-height-tight)]
          tracking-[var(--letter-spacing-tight)]
          mb-[var(--spacing-6)]
        ">
          Your dog deserves
          <br />
          <span className="text-[var(--color-amber-300)]">the very best.</span>
        </h2>

        {/* Body — text-lg for size, color separate */}
        <p className="
          font-[var(--font-body)]
          text-lg
          text-[var(--color-green-200)]
          leading-[var(--line-height-relaxed)]
          max-w-[44ch] mx-auto
          mb-[var(--spacing-10)]
        ">
          Whether it's a weekend away or a long vacation, we'll make sure your
          pup is loved, safe, and having the time of their life. Let's get
          them booked in.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-[var(--spacing-4)] flex-wrap">

          {/* Primary — text-base for size, color separate */}
          <Link
            href="/book"
            className="
              inline-flex items-center gap-[var(--spacing-2)]
              bg-[var(--color-amber-400)] text-[var(--color-bark-950)]
              font-[var(--font-ui)] text-base font-bold
              tracking-[var(--letter-spacing-wide)]
              px-[var(--spacing-8)] py-[var(--spacing-4)]
              rounded-[var(--radius-button)]
              no-underline
              shadow-[var(--shadow-amber)]
              transition-all duration-[var(--duration-fast)]
              hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--color-amber-300)]
            "
          >
            Book a Stay 🐾
          </Link>

          {/* Secondary — text-base for size, color separate */}
          <Link
            href="/services"
            className="
              inline-flex items-center gap-[var(--spacing-2)]
              bg-transparent text-[var(--color-green-100)]
              font-[var(--font-ui)] text-base font-medium
              tracking-[var(--letter-spacing-wide)]
              px-[var(--spacing-8)] py-[var(--spacing-4)]
              rounded-[var(--radius-button)]
              no-underline
              border border-[var(--color-green-400)]
              transition-all duration-[var(--duration-fast)]
              hover:bg-white/10 hover:text-white
            "
          >
            View Services
          </Link>
        </div>

        {/* Trust note — text-xs for size, color separate */}
        <p className="
          font-[var(--font-ui)]
          text-xs
          text-[var(--color-green-400)]
          tracking-[var(--letter-spacing-wide)]
          mt-[var(--spacing-8)]
        ">
          ✓ No commitment required &nbsp;·&nbsp; ✓ Free meet & greet &nbsp;·&nbsp; ✓ Insured & certified
        </p>

      </div>
    </section>
  );
}
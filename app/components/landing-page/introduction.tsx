export default function Introduction() {
  return (
    <section className="w-full relative overflow-hidden bg-[var(--color-bg)] pt-[var(--spacing-24)] pb-[var(--spacing-32)]">

      {/* Decorative green blob */}
      <div
        aria-hidden
        className="
          absolute -top-20 -right-28
          w-[600px] h-[600px]
          rounded-[var(--radius-full)]
          bg-[radial-gradient(circle,var(--color-green-200)_0%,transparent_70%)]
          opacity-50 pointer-events-none
        "
      />

      {/* Decorative amber blob */}
      <div
        aria-hidden
        className="
          absolute -bottom-16 -left-20
          w-[400px] h-[400px]
          rounded-[var(--radius-full)]
          bg-[radial-gradient(circle,var(--color-amber-200)_0%,transparent_70%)]
          opacity-40 pointer-events-none
        "
      />

      {/* Diagonal bottom edge */}
      <div
        aria-hidden
        className="
          absolute bottom-0 left-0 right-0 h-20
          bg-[var(--color-surface)]
          [clip-path:polygon(0_100%,100%_0,100%_100%)]
          pointer-events-none
        "
      />

      <div className="
        max-w-[var(--width-7xl)] mx-auto
        px-[var(--spacing-8)]
        grid grid-cols-1 md:grid-cols-2
        gap-[var(--spacing-16)]
        items-center
        relative z-10
      ">

        {/* Left: Text */}
        <div>

          {/* Eyebrow — text-xs for size, text-[var(--color-primary)] for color */}
          <p className="
            font-[var(--font-ui)]
            text-xs font-semibold
            tracking-[var(--letter-spacing-widest)] uppercase
            text-[var(--color-primary)]
            mb-[var(--spacing-4)]
          ">
            🐾 &nbsp;Who We Are
          </p>

          {/* Heading — no font-size arbitrary, use named scale; color is safe alone */}
          <h2 className="
            font-[var(--font-display)]
            text-5xl font-bold
            text-[var(--color-text-primary)]
            leading-[var(--line-height-tight)]
            tracking-[var(--letter-spacing-tight)]
            mb-[var(--spacing-6)]
          ">
            Dogs are our
            <br />
            <span className="text-[var(--color-primary)]">whole world.</span>
          </h2>

          {/* Body copy — text-lg for size, color separate */}
          <p className="
            font-[var(--font-body)]
            text-lg
            text-[var(--color-text-secondary)]
            leading-[var(--line-height-relaxed)]
            mb-[var(--spacing-6)]
            max-w-[38ch]
          ">
            We're a small, passionate team of dog lovers who treat every pup
            like family. From daily walks through the park to cozy overnight
            stays, we provide care that's rooted in trust, patience, and
            genuine love for animals.
          </p>

          {/* Secondary body — text-base for size, color separate */}
          <p className="
            font-[var(--font-body)]
            text-base
            text-[var(--color-text-muted)]
            leading-[var(--line-height-relaxed)]
            max-w-[38ch]
          ">
            Founded in 2018, we've built a community of happy pet parents and
            even happier dogs. Every tail wag is a reminder of why we do what
            we do.
          </p>

          {/* Stats row */}
          <div className="flex gap-[var(--spacing-10)] mt-[var(--spacing-10)]">
            {[
              { value: "500+", label: "Happy Pups" },
              { value: "6 yrs", label: "Experience" },
              { value: "100%", label: "5-Star Reviews" },
            ].map(({ value, label }) => (
              <div key={label}>
                {/* Stat value — text-3xl for size, color separate */}
                <p className="
                  font-[var(--font-display)]
                  text-3xl font-bold
                  text-[var(--color-primary)]
                  leading-[var(--line-height-none)]
                ">
                  {value}
                </p>
                {/* Stat label — text-xs for size, color separate */}
                <p className="
                  font-[var(--font-ui)]
                  text-xs font-medium
                  tracking-[var(--letter-spacing-wider)] uppercase
                  text-[var(--color-text-muted)]
                  mt-[var(--spacing-1)]
                ">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual card */}
        <div className="relative flex justify-center">
          <div className="
            w-full max-w-[420px]
            aspect-[4/5]
            rounded-[var(--radius-3xl)]
            bg-[linear-gradient(160deg,var(--color-green-300)_0%,var(--color-green-600)_100%)]
            shadow-[var(--shadow-2xl)]
            flex items-center justify-center
            text-[80px]
          ">
            🐕
          </div>

          {/* Floating rating badge */}
          <div className="
            absolute bottom-[var(--spacing-8)] -left-[var(--spacing-4)]
            bg-[var(--color-surface)]
            rounded-[var(--radius-2xl)]
            px-[var(--spacing-5)] py-[var(--spacing-4)]
            shadow-[var(--shadow-xl)]
            flex items-center gap-[var(--spacing-3)]
            border border-[var(--color-border)]
          ">
            <span className="text-[28px]">⭐</span>
            <div>
              {/* Rating number — text-lg for size, color separate */}
              <p className="
                font-[var(--font-display)]
                text-lg font-bold
                text-[var(--color-text-primary)]
                leading-[var(--line-height-none)]
              ">
                5.0
              </p>
              {/* Rating label — text-xs for size, color separate */}
              <p className="
                font-[var(--font-ui)]
                text-xs
                text-[var(--color-text-muted)]
              ">
                Avg. Rating
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
import Image from "next/image";

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
            🐾 &nbsp;Who I Am
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
            Every dog deserves
            <br />
            <span className="text-[var(--color-primary)]">a place that feels like home.</span>
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
              Hi, I’m Yujie, a dog sitter based in Austin who believes every dog deserves attentive, personal care. I host one dog at a time, giving your pup my full attention in a calm, home environment.

              I focus on enriching exercise, play, and mental stimulation while following your dog’s normal routines—from feeding schedules to potty breaks.

              My own dog Brownie is friendly and social, and he loves having a companion to play and relax with during the day.

              Throughout the stay, I’ll keep you updated so you always know how your dog is doing.
          </p>

          {/* Secondary body — text-base for size, color separate */}
          <p className="
            font-[var(--font-body)]
            text-base
            text-[var(--color-text-muted)]
            leading-[var(--line-height-relaxed)]
            max-w-[38ch]
          ">
              I’ve been a dog parent since 2021 and began caring for dogs professionally on Rover in 2024. 
              Since then, I’ve built trusted relationships with dozens of dog parents who rely on me to care for their pups. 
              Every wagging tail and happy return visit reminds me why I love doing this.
          </p>

          {/* Stats row */}
          <div className="flex gap-[var(--spacing-10)] mt-[var(--spacing-10)]">
            {[
              { value: "250+", label: "Happy Pups" },
              { value: "3 yrs", label: "Experience" },
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
            shadow-[var(--shadow-2xl)]
            overflow-hidden
            relative
          ">
            <Image
              src="/malikandbrownie.JPEG"
              alt="Malik with brownie on his shoulder"
              fill
              className="object-cover"
            />
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
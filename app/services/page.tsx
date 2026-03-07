import Link from "next/link";

const HOLIDAY_RATES_URL =
  "https://support.rover.com/hc/en-us/articles/204706790-What-are-holiday-rates-and-how-do-I-manage-them#h_48ced19e-5889-466d-8b5a-1b4f8a9b7cbd";

const services = [
  {
    icon: "🏡",
    name: "Dog Boarding",
    tagline: "A home away from home",
    description:
      "Your dog stays with me overnight in a warm, loving home environment. I keep them on their routine, send you daily updates, and treat them like one of the family.",
    color: "green",
    tiers: [
      { label: "Per Night",          price: "$55", per: "/ night", note: "First dog" },
      { label: "Additional Dog",     price: "$50", per: "/ night", note: "Same family, each extra dog" },
      { label: "Holiday Rate",       price: "$70", per: "/ night", note: "Subject to change", isHoliday: true },
    ],
    includes: [
      "Daily photo & video updates",
      "Walks, fetch & outdoor play",
      "Cozy indoor sleeping space",
      "Feeding on your schedule",
      "At least 3 potty breaks per day",
      "Medication administration (topical & oral)",
    ],
  },
  {
    icon: "☀️",
    name: "Doggie Daycare",
    tagline: "Fun-filled days while you work",
    description:
      "Drop your pup off for a full or half day of play, socialization, and rest. Perfect for busy work days or when your dog just needs some extra stimulation and company.",
    color: "amber",
    tiers: [
      { label: "Full Day", price: "$45", per: "/ dog", note: "Up to 12 hours" },
      { label: "Half Day", price: "$30", per: "/ dog", note: "Up to 6 hours" },
    ],
    includes: [
      "Structured play sessions",
      "Rest breaks",
      "Fresh water & snacks",
      "Photo updates throughout the day",
      "Your pup goes home happy & tired",
    ],
  },
];

const whyMe = [
  {
    icon: "🐾",
    title: "One dog/family at a time",
    body: "I sit for one dog or one family at a time — always. This means your pup gets my full, undivided attention and never feels overwhelmed by a houseful of strangers.",
  },
  {
    icon: "🐕",
    title: "200+ dogs cared for",
    body: "With over 200 dogs under my care and 5+ years as a dog owner myself, I bring genuine experience and a deep love for animals to every stay.",
  },
  {
    icon: "🤝",
    title: "A built-in best friend",
    body: "My own dog is peaceful and loves making friends. Your pup will have an extra companion during their stay — built-in social time, no extra charge.",
  },
  {
    icon: "💊",
    title: "Medication experience",
    body: "I have plenty of experience with both topical and oral administration of medication, so dogs with medical needs are always welcome.",
  },
  {
    icon: "🏠",
    title: "My space",
    body: "I live in a 1,200 sq ft apartment with a spacious, fully enclosed courtyard right downstairs — perfect for fetch, potty breaks, and fresh air.",
  },
  {
    icon: "✅",
    title: "I don't cancel",
    body: "If a booking is confirmed, I strive to always fulfill it. The last thing I want is to leave you scrambling for a sitter at the last minute.",
  },
];

const dailySchedule = [
  { time: "Morning",   icon: "🎾", title: "Fetch or a walk",       body: "We kick off the day with an energetic game of fetch — or a walk if your dog prefers it. A tired dog is a happy dog." },
  { time: "Throughout", icon: "🌿", title: "Potty & play breaks",   body: "At least 3 potty breaks throughout the day, with extras for puppies or on request. I cater to your dog's specific schedule." },
  { time: "Mealtimes",  icon: "🍽️", title: "Your feeding schedule", body: "I follow your dog's exact feeding routine — times, portions, and any dietary needs — so their belly is never confused." },
  { time: "Evening",    icon: "🌙", title: "Wind down & sleep",     body: "By the end of the day your pup is pleasantly tired, fed, and ready to curl up for the night. Crates are only used if I'm away or sleeping, unless you prefer otherwise." },
];

const policies = [
  {
    icon: "🔒",
    title: "Privacy & drop-off policy",
    body: "For the safety and privacy of both you and me, I don't allow clients to come upstairs to my apartment door. Drop-off and pick-up happen downstairs. If you'd like to see my space, I'm always happy to do a video call.",
  },
  {
    icon: "📋",
    title: "What to share before your dog's stay",
    body: "Please let me know your dog's walking and feeding times, and whether you'll be providing food, bowls, a leash, a crate, toys, or pee pads. If your dog has any prior injuries or medical needs, let me know so I can accommodate them.",
  },
  {
    icon: "⚠️",
    title: "Behavioral requirements",
    body: "I'm very accommodating of behavioral issues and have extensive experience with aggressive and reactive dogs from my time working in doggy daycare. However, I must insist that your dog does not have a history of biting other dogs or people.",
  },
  {
    icon: "👁️",
    title: "Supervision first",
    body: "Crates are only used when I'm away or sleeping at night, unless you specify otherwise. I do this to ensure all of your dog's activities are under my supervision — no safety accidents on my watch.",
  },
];

export default function ServicesPage() {
  return (
    <main className="w-full min-h-screen bg-[var(--color-bg)]">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="
        relative overflow-hidden
        bg-[linear-gradient(135deg,var(--color-green-800)_0%,var(--color-green-600)_60%,var(--color-amber-400)_100%)]
        pt-[var(--spacing-24)] pb-[var(--spacing-32)]
      ">
        <div aria-hidden className="
          absolute inset-0
          bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,var(--color-green-500)_0%,transparent_70%)]
          opacity-40 pointer-events-none
        " />
        <div aria-hidden className="
          absolute -right-10 -bottom-16
          text-[280px] leading-none opacity-[0.06]
          pointer-events-none select-none
        ">🐾</div>
        <div aria-hidden className="
          absolute bottom-0 left-0 right-0 h-20
          bg-[var(--color-bg)]
          [clip-path:polygon(0_100%,100%_0,100%_100%)]
          pointer-events-none
        " />

        <div className="max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)] relative z-10">
          <p className="
            text-xs font-semibold font-[var(--font-ui)]
            tracking-[var(--letter-spacing-widest)] uppercase
            text-[var(--color-amber-300)]
            mb-[var(--spacing-4)]
          ">
            🐾 &nbsp;What I Offer
          </p>
          <h1 className="
            font-[var(--font-display)]
            text-5xl font-bold text-white
            leading-[var(--line-height-tight)]
            tracking-[var(--letter-spacing-tight)]
            mb-[var(--spacing-6)] max-w-[16ch]
          ">
            Services &<br />
            <span className="text-[var(--color-amber-300)]">Pricing</span>
          </h1>
          <p className="
            font-[var(--font-body)] text-lg
            text-[var(--color-green-100)]
            leading-[var(--line-height-relaxed)]
            max-w-[52ch]
          ">
            Straightforward pricing, no hidden fees — and the same high standard
            of genuine, attentive care for every single pup.
          </p>
        </div>
      </section>

      {/* ── Unique Selling Point Banner ─────────────────────── */}
      <section className="
        bg-[var(--color-primary-surface)]
        border-b border-[var(--color-primary-light)]
        py-[var(--spacing-6)]
      ">
        <div className="
          max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]
          flex flex-wrap items-center justify-center
          gap-[var(--spacing-2)] text-center
        ">
          <span className="text-2xl">🐕</span>
          <p className="
            font-[var(--font-display)] text-xl font-bold
            text-[var(--color-primary-dark)]
            tracking-[var(--letter-spacing-tight)]
          ">
            One dog/family at a time.
          </p>
        </div>
      </section>

      {/* ── Service Cards ───────────────────────────────────── */}
      <section className="
        max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]
        pt-[var(--spacing-16)] pb-[var(--spacing-20)]
        grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-8)] items-start
      ">
        {services.map((service) => {
          const isGreen = service.color === "green";
          return (
            <div
              key={service.name}
              className="
                bg-[var(--color-surface)]
                border border-[var(--color-border)]
                rounded-[var(--radius-card)]
                shadow-[var(--shadow-lg)]
                overflow-hidden
              "
            >
              {/* Card header */}
              <div className={`
                px-[var(--spacing-8)] py-[var(--spacing-7)]
                ${isGreen
                  ? "bg-[linear-gradient(135deg,var(--color-green-800)_0%,var(--color-green-600)_100%)]"
                  : "bg-[linear-gradient(135deg,var(--color-amber-700)_0%,var(--color-amber-500)_100%)]"}
              `}>
                <span className="text-[48px] leading-none block mb-[var(--spacing-3)]">
                  {service.icon}
                </span>
                <h2 className="
                  font-[var(--font-display)] text-3xl font-bold text-white
                  leading-[var(--line-height-tight)]
                  tracking-[var(--letter-spacing-tight)]
                  mb-[var(--spacing-1)]
                ">
                  {service.name}
                </h2>
                <p className="text-sm font-medium font-[var(--font-ui)] text-[rgba(255,255,255,0.75)]">
                  {service.tagline}
                </p>
              </div>

              <div className="px-[var(--spacing-8)] py-[var(--spacing-7)] space-y-[var(--spacing-8)]">
                <p className="font-[var(--font-body)] text-base text-[var(--color-text-secondary)] leading-[var(--line-height-relaxed)]">
                  {service.description}
                </p>

                {/* Pricing tiers */}
                <div>
                  <p className="
                    text-xs font-semibold font-[var(--font-ui)]
                    tracking-[var(--letter-spacing-widest)] uppercase
                    text-[var(--color-text-muted)]
                    mb-[var(--spacing-3)]
                  ">
                    Pricing
                  </p>
                  <div className="space-y-[var(--spacing-3)]">
                    {service.tiers.map((tier) => (
                      <div
                        key={tier.label}
                        className={[
                          "flex items-center justify-between",
                          "px-[var(--spacing-5)] py-[var(--spacing-4)]",
                          "rounded-[var(--radius-xl)] border",
                          tier.isHoliday
                            ? "bg-[var(--color-amber-50)] border-[var(--color-amber-200)]"
                            : isGreen
                            ? "bg-[var(--color-primary-surface)] border-[var(--color-primary-light)]"
                            : "bg-[var(--color-accent-surface)] border-[var(--color-accent-light)]",
                        ].join(" ")}
                      >
                        <div>
                          <p className={[
                            "text-sm font-semibold font-[var(--font-ui)]",
                            tier.isHoliday || !isGreen
                              ? "text-[var(--color-accent-dark)]"
                              : "text-[var(--color-primary-dark)]",
                          ].join(" ")}>
                            {tier.label}
                          </p>
                          <p className="text-xs font-[var(--font-ui)] text-[var(--color-text-muted)] mt-[var(--spacing-0-5)]">
                            {tier.note}
                            {tier.isHoliday && (
                              <a
                                href={HOLIDAY_RATES_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                  ml-[var(--spacing-2)]
                                  text-[var(--color-accent)]
                                  underline underline-offset-2
                                  hover:text-[var(--color-accent-dark)]
                                  transition-colors duration-[var(--duration-fast)]
                                "
                              >
                                View holiday schedule ↗
                              </a>
                            )}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={[
                            "font-[var(--font-display)] text-3xl font-bold leading-[var(--line-height-none)]",
                            tier.isHoliday || !isGreen
                              ? "text-[var(--color-accent)]"
                              : "text-[var(--color-primary)]",
                          ].join(" ")}>
                            {tier.price}
                          </span>
                          <span className="text-xs font-[var(--font-ui)] text-[var(--color-text-muted)] ml-[var(--spacing-1)]">
                            {tier.per}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Includes */}
                <div>
                  <p className="
                    text-xs font-semibold font-[var(--font-ui)]
                    tracking-[var(--letter-spacing-widest)] uppercase
                    text-[var(--color-text-muted)]
                    mb-[var(--spacing-3)]
                  ">
                    What's included
                  </p>
                  <ul className="space-y-[var(--spacing-2)]">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-center gap-[var(--spacing-3)]">
                        <span className={[
                          "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                          isGreen
                            ? "bg-[var(--color-primary-surface)] text-[var(--color-primary)]"
                            : "bg-[var(--color-accent-surface)] text-[var(--color-accent)]",
                        ].join(" ")}>
                          ✓
                        </span>
                        <span className="text-sm font-[var(--font-body)] text-[var(--color-text-secondary)]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link
                  href="/book"
                  className={[
                    "w-full inline-flex items-center justify-center gap-[var(--spacing-2)]",
                    "text-sm font-bold font-[var(--font-ui)]",
                    "tracking-[var(--letter-spacing-wide)]",
                    "py-[var(--spacing-4)] rounded-[var(--radius-button)]",
                    "no-underline",
                    "transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]",
                    "hover:-translate-y-px active:translate-y-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isGreen
                      ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-green)] hover:bg-[var(--color-primary-dark)] hover:shadow-[var(--shadow-lg)] focus-visible:ring-[var(--color-border-focus)]"
                      : "bg-[var(--color-accent)] text-[var(--color-bark-950)] shadow-[var(--shadow-amber)] hover:bg-[var(--color-accent-dark)] hover:text-white hover:shadow-[var(--shadow-lg)] focus-visible:ring-[var(--color-accent)]",
                  ].join(" ")}
                >
                  Book {service.name} →
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Why Choose Me ───────────────────────────────────── */}
      <section className="
        bg-[var(--color-surface)]
        border-t border-[var(--color-border)]
        py-[var(--spacing-20)]
      ">
        <div className="max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]">
          <div className="text-center mb-[var(--spacing-14)]">
            <p className="
              text-xs font-semibold font-[var(--font-ui)]
              tracking-[var(--letter-spacing-widest)] uppercase
              text-[var(--color-primary)]
              mb-[var(--spacing-3)]
            ">
              🐕 &nbsp;Why Choose Me
            </p>
            <h2 className="
              font-[var(--font-display)] text-4xl font-bold
              text-[var(--color-text-primary)]
              leading-[var(--line-height-tight)]
              tracking-[var(--letter-spacing-tight)]
              mb-[var(--spacing-4)]
            ">
              Care that goes beyond the basics
            </h2>
            <p className="
              font-[var(--font-body)] text-lg
              text-[var(--color-text-secondary)]
              leading-[var(--line-height-relaxed)]
              max-w-[52ch] mx-auto
            ">
              I'm an experienced pet sitter with 200+ dogs cared for and a responsible dog owner
              of over 5 years. Here's what makes my approach different.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-6)]">
            {whyMe.map((item) => (
              <div
                key={item.title}
                className="
                  bg-[var(--color-bg)]
                  border border-[var(--color-border)]
                  rounded-[var(--radius-2xl)]
                  p-[var(--spacing-6)]
                  flex flex-col gap-[var(--spacing-3)]
                  transition-all duration-[var(--duration-slow)]
                  hover:-translate-y-1 hover:shadow-[var(--shadow-green)]
                "
              >
                <span className="text-[36px] leading-none">{item.icon}</span>
                <h3 className="
                  font-[var(--font-display)] text-lg font-bold
                  text-[var(--color-text-primary)]
                  leading-[var(--line-height-snug)]
                ">
                  {item.title}
                </h3>
                <p className="
                  font-[var(--font-body)] text-sm
                  text-[var(--color-text-secondary)]
                  leading-[var(--line-height-relaxed)]
                ">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A Typical Day ───────────────────────────────────── */}
      <section className="
        bg-[var(--color-bg)]
        border-t border-[var(--color-border)]
        py-[var(--spacing-20)]
      ">
        <div className="max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]">
          <div className="text-center mb-[var(--spacing-14)]">
            <p className="
              text-xs font-semibold font-[var(--font-ui)]
              tracking-[var(--letter-spacing-widest)] uppercase
              text-[var(--color-accent)]
              mb-[var(--spacing-3)]
            ">
              ☀️ &nbsp;A Typical Day
            </p>
            <h2 className="
              font-[var(--font-display)] text-4xl font-bold
              text-[var(--color-text-primary)]
              leading-[var(--line-height-tight)]
              tracking-[var(--letter-spacing-tight)]
              mb-[var(--spacing-4)]
            ">
              What your dog's day looks like
            </h2>
            <p className="
              font-[var(--font-body)] text-lg
              text-[var(--color-text-secondary)]
              leading-[var(--line-height-relaxed)]
              max-w-[48ch] mx-auto
            ">
              Every day is structured, active, and tailored to your pup's needs.
              By bedtime, they'll be one happy, tired dog.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-[var(--width-3xl)] mx-auto">
            {/* Vertical line */}
            <div className="
              absolute left-6 top-0 bottom-0 w-px
              bg-[var(--color-border)]
              hidden sm:block
            " />

            <div className="space-y-[var(--spacing-8)]">
              {dailySchedule.map((step, i) => (
                <div key={i} className="flex gap-[var(--spacing-6)] items-start">
                  {/* Icon bubble */}
                  <div className="
                    shrink-0 relative z-10
                    w-12 h-12
                    rounded-[var(--radius-full)]
                    bg-[var(--color-primary-surface)]
                    border-2 border-[var(--color-primary-light)]
                    flex items-center justify-center
                    text-[22px]
                  ">
                    {step.icon}
                  </div>
                  <div className="pt-[var(--spacing-2)]">
                    <p className="
                      text-xs font-semibold font-[var(--font-ui)]
                      tracking-[var(--letter-spacing-wider)] uppercase
                      text-[var(--color-primary)]
                      mb-[var(--spacing-1)]
                    ">
                      {step.time}
                    </p>
                    <h3 className="
                      font-[var(--font-display)] text-xl font-bold
                      text-[var(--color-text-primary)]
                      leading-[var(--line-height-snug)]
                      mb-[var(--spacing-2)]
                    ">
                      {step.title}
                    </h3>
                    <p className="
                      font-[var(--font-body)] text-base
                      text-[var(--color-text-secondary)]
                      leading-[var(--line-height-relaxed)]
                    ">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Policies ────────────────────────────────────────── */}
      <section className="
        bg-[var(--color-surface)]
        border-t border-[var(--color-border)]
        py-[var(--spacing-20)]
      ">
        <div className="max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]">
          <div className="text-center mb-[var(--spacing-14)]">
            <p className="
              text-xs font-semibold font-[var(--font-ui)]
              tracking-[var(--letter-spacing-widest)] uppercase
              text-[var(--color-text-muted)]
              mb-[var(--spacing-3)]
            ">
              📋 &nbsp;Good to Know
            </p>
            <h2 className="
              font-[var(--font-display)] text-4xl font-bold
              text-[var(--color-text-primary)]
              leading-[var(--line-height-tight)]
              tracking-[var(--letter-spacing-tight)]
            ">
              Policies & what to expect
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--spacing-6)]">
            {policies.map((p) => (
              <div
                key={p.title}
                className="
                  flex gap-[var(--spacing-5)]
                  bg-[var(--color-bg)]
                  border border-[var(--color-border)]
                  rounded-[var(--radius-2xl)]
                  p-[var(--spacing-6)]
                "
              >
                <span className="text-[32px] leading-none shrink-0 mt-[var(--spacing-1)]">
                  {p.icon}
                </span>
                <div>
                  <h3 className="
                    font-[var(--font-display)] text-lg font-bold
                    text-[var(--color-text-primary)]
                    leading-[var(--line-height-snug)]
                    mb-[var(--spacing-2)]
                  ">
                    {p.title}
                  </h3>
                  <p className="
                    font-[var(--font-body)] text-sm
                    text-[var(--color-text-secondary)]
                    leading-[var(--line-height-relaxed)]
                  ">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <section className="
        relative overflow-hidden
        bg-[linear-gradient(135deg,var(--color-green-800)_0%,var(--color-green-600)_100%)]
        py-[var(--spacing-20)] text-center
      ">
        <div aria-hidden className="
          absolute inset-0
          bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,var(--color-green-500)_0%,transparent_70%)]
          opacity-40 pointer-events-none
        " />
        <div aria-hidden className="
          absolute -bottom-10 left-[5%]
          text-[240px] leading-none
          opacity-[0.04] pointer-events-none select-none
        ">🐾</div>
        <div className="max-w-[var(--width-3xl)] mx-auto px-[var(--spacing-8)] relative z-10">
          <h2 className="
            font-[var(--font-display)] text-4xl font-bold text-white
            leading-[var(--line-height-tight)]
            tracking-[var(--letter-spacing-tight)]
            mb-[var(--spacing-4)]
          ">
            Ready to book?
          </h2>
          <p className="
            font-[var(--font-body)] text-lg
            text-[var(--color-green-100)]
            leading-[var(--line-height-relaxed)]
            mb-[var(--spacing-8)]
          ">
            Your pup's next great adventure is one click away. I'd love to meet them.
          </p>
          <Link
            href="/book"
            className="
              inline-flex items-center gap-[var(--spacing-2)]
              bg-[var(--color-amber-400)] text-[var(--color-bark-950)]
              text-base font-bold font-[var(--font-ui)]
              tracking-[var(--letter-spacing-wide)]
              px-[var(--spacing-10)] py-[var(--spacing-4)]
              rounded-[var(--radius-button)]
              no-underline
              shadow-[var(--shadow-amber)]
              transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]
              hover:bg-[var(--color-amber-300)] hover:-translate-y-px hover:shadow-[var(--shadow-lg)]
              active:translate-y-0
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber-300)] focus-visible:ring-offset-2
            "
          >
            Book a Stay 🐾
          </Link>
        </div>
      </section>

    </main>
  );
}
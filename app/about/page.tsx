import Image from "next/image";
import Link from "next/link";

const hobbies = [
  { icon: "🏃", label: "Running" },
  { icon: "🏀", label: "Basketball" },
  { icon: "🎬", label: "Watching movies" },
  { icon: "🥾", label: "Hiking with Brownie" },
];

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-[var(--color-bg)]">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="
        relative overflow-hidden
        bg-[linear-gradient(135deg,var(--color-green-800)_0%,var(--color-green-600)_55%,var(--color-amber-500)_100%)]
        pt-[var(--spacing-24)] pb-[var(--spacing-40)]
      ">
        <div aria-hidden className="
          absolute inset-0
          bg-[radial-gradient(ellipse_60%_70%_at_20%_50%,var(--color-green-500)_0%,transparent_70%)]
          opacity-40 pointer-events-none
        " />
        <div aria-hidden className="
          absolute -right-16 -bottom-20
          text-[300px] leading-none opacity-[0.05]
          pointer-events-none select-none
        ">🐾</div>
        {/* Diagonal bottom */}
        <div aria-hidden className="
          absolute bottom-0 left-0 right-0 h-24
          bg-[var(--color-bg)]
          [clip-path:polygon(0_100%,100%_0,100%_100%)]
          pointer-events-none
        " />

        <div className="
          max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]
          relative z-10
          grid grid-cols-1 md:grid-cols-2
          gap-[var(--spacing-12)] items-center
        ">
          {/* Text */}
          <div>
            <p className="
              text-xs font-semibold font-[var(--font-ui)]
              tracking-[var(--letter-spacing-widest)] uppercase
              text-[var(--color-amber-300)]
              mb-[var(--spacing-4)]
            ">
              🐾 &nbsp;Meet Your Sitter
            </p>
            <h1 className="
              font-[var(--font-display)] text-5xl font-bold text-white
              leading-[var(--line-height-tight)]
              tracking-[var(--letter-spacing-tight)]
              mb-[var(--spacing-5)]
            ">
              Hi, I'm Yujie —<br />
              <span className="text-[var(--color-amber-300)]">and this is Brownie.</span>
            </h1>
            <p className="
              font-[var(--font-body)] text-lg
              text-[var(--color-green-100)]
              leading-[var(--line-height-relaxed)]
              max-w-[46ch]
            ">
              Dog lover, software student, former video editor, and the person
              who will treat your pup like my own while you're away.
            </p>
          </div>

          {/* Hero photo */}
          <div className="relative flex justify-center md:justify-end">
            <div className="
              relative w-full max-w-[400px] aspect-[4/5]
              rounded-[var(--radius-3xl)]
              overflow-hidden
              shadow-[var(--shadow-2xl)]
              border-4 border-[rgba(255,255,255,0.15)]
            ">
              <Image
                src="/about/yujie-and-brownie-hero.JPEG"
                alt="Yujie smiling with Brownie"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Floating stat badge */}
            <div className="
              absolute -bottom-6 -left-4
              bg-[var(--color-surface)]
              rounded-[var(--radius-2xl)]
              px-[var(--spacing-5)] py-[var(--spacing-4)]
              shadow-[var(--shadow-xl)]
              border border-[var(--color-border)]
              flex items-center gap-[var(--spacing-3)]
            ">
              <span className="text-[28px]">🐕</span>
              <div>
                <p className="
                  font-[var(--font-display)] text-2xl font-bold
                  text-[var(--color-primary)]
                  leading-[var(--line-height-none)]
                ">
                  250+
                </p>
                <p className="
                  text-xs font-[var(--font-ui)]
                  text-[var(--color-text-muted)]
                ">
                  Dogs cared for
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── Origin Story ───────────────────────────────────── */}
      <section className="
        max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]
        pt-[var(--spacing-20)] pb-[var(--spacing-16)]
        grid grid-cols-1 md:grid-cols-2
        gap-[var(--spacing-16)] items-center
      ">
        {/* Photo */}
        <div className="relative">
          <div className="
            relative aspect-square max-w-[480px]
            rounded-[var(--radius-3xl)] overflow-hidden
            shadow-[var(--shadow-xl)]
          ">
            <Image
              src="/about/brownie-portrait.JPEG"
              alt="Brownie, Yujie's dog"
              fill
              className="object-cover"
            />
          </div>
          {/* Decorative offset frame */}
          <div className="
            absolute -bottom-4 -right-4
            w-full max-w-[480px] aspect-square
            rounded-[var(--radius-3xl)]
            border-2 border-[var(--color-primary-light)]
            -z-10
          " />
        </div>

        {/* Text */}
        <div>
          <p className="
            text-xs font-semibold font-[var(--font-ui)]
            tracking-[var(--letter-spacing-widest)] uppercase
            text-[var(--color-primary)]
            mb-[var(--spacing-4)]
          ">
            🎓 &nbsp;How It All Started
          </p>
          <h2 className="
            font-[var(--font-display)] text-4xl font-bold
            text-[var(--color-text-primary)]
            leading-[var(--line-height-tight)]
            tracking-[var(--letter-spacing-tight)]
            mb-[var(--spacing-6)]
          ">
            From Austin to Brownie,<br />
            <span className="text-[var(--color-primary)]">and everything after.</span>
          </h2>
          <div className="space-y-[var(--spacing-5)]">
            <p className="
              font-[var(--font-body)] text-base
              text-[var(--color-text-secondary)]
              leading-[var(--line-height-relaxed)]
            ">
              I moved to the United States in 2019 to attend The University of Texas at
              Austin. During my time in college, I adopted my dog Brownie — and that's
              when I discovered just how deep the bond between a person and a dog can be.
              She quickly became my best friend. We spend our days playing fetch, going
              on runs and walks, and of course enjoying plenty of cuddle time.
            </p>
            <p className="
              font-[var(--font-body)] text-base
              text-[var(--color-text-secondary)]
              leading-[var(--line-height-relaxed)]
            ">
              After graduating with a degree in film, I worked professionally as a video
              editor for about a year and a half. Over time, I realized that what truly
              excites me is problem-solving, which led me to pivot toward software
              development. I'm currently pursuing my second bachelor's degree in computer
              science through an online post-baccalaureate program at University of
              Colorado Boulder.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Dog Boarding ───────────────────────────────── */}
      <section className="
        bg-[var(--color-surface)]
        border-t border-[var(--color-border)]
        py-[var(--spacing-20)]
      ">
        <div className="
          max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]
          grid grid-cols-1 md:grid-cols-2
          gap-[var(--spacing-16)] items-center
        ">
          {/* Text */}
          <div>
            <p className="
              text-xs font-semibold font-[var(--font-ui)]
              tracking-[var(--letter-spacing-widest)] uppercase
              text-[var(--color-accent)]
              mb-[var(--spacing-4)]
            ">
              🏡 &nbsp;Why I Do This
            </p>
            <h2 className="
              font-[var(--font-display)] text-4xl font-bold
              text-[var(--color-text-primary)]
              leading-[var(--line-height-tight)]
              tracking-[var(--letter-spacing-tight)]
              mb-[var(--spacing-6)]
            ">
              School, Brownie, and<br />
              <span className="text-[var(--color-primary)]">your pup.</span>
            </h2>
            <div className="space-y-[var(--spacing-5)]">
              <p className="
                font-[var(--font-body)] text-base
                text-[var(--color-text-secondary)]
                leading-[var(--line-height-relaxed)]
              ">
                Because my program is remote, I spend most of my time at home. That's
                what inspired me to start offering personalized in-home dog boarding for
                dog owners in the Austin area. It allows me to earn income while I'm in
                school — but more importantly, it means Brownie always has a companion
                to play with.
              </p>
              <p className="
                font-[var(--font-body)] text-base
                text-[var(--color-text-secondary)]
                leading-[var(--line-height-relaxed)]
              ">
                Over the past year and a half, I've had the opportunity to care for more
                than 250 dogs of different sizes, breeds, and ages, gaining valuable
                experience along the way.
              </p>
              <p className="
                font-[var(--font-body)] text-base
                text-[var(--color-text-secondary)]
                leading-[var(--line-height-relaxed)]
              ">
                When your dog stays with me, my goal is to make sure they feel safe,
                comfortable, and happy until it's time to go home. I also send daily
                photo updates so you can see how your dog is doing and stay connected
                with your furry friend while you're away.
              </p>
            </div>
          </div>

          {/* Photo collage */}
          <div className="grid grid-cols-2 gap-[var(--spacing-4)]">
            <div className="
              relative aspect-[3/4] col-span-1 row-span-2
              rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-lg)]
            ">
              <Image
                src="/about/yujie-with-guest-dog.JPEG"
                alt="Yujie with a guest dog"
                fill
                className="object-cover"
              />
            </div>
            <div className="
              relative aspect-square
              rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-md)]
            ">
              <Image
                src="/about/brownie-wink.JPEG"
                alt="Brownie winks at the camera"
                fill
                className="object-cover"
              />
            </div>
            <div className="
              relative aspect-square
              rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-md)]
            ">
              <Image
                src="/about/brownie-with-kash.JPEG"
                alt="Brownie with a guest dog named Kash"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Outside Dog Care ───────────────────────────────── */}
      <section className="
        max-w-[var(--width-7xl)] mx-auto px-[var(--spacing-8)]
        py-[var(--spacing-20)]
        grid grid-cols-1 md:grid-cols-2
        gap-[var(--spacing-16)] items-center
      ">
        {/* Photo */}
        <div className="
          relative aspect-[4/3] max-w-[520px]
          rounded-[var(--radius-3xl)] overflow-hidden
          shadow-[var(--shadow-xl)]
          order-2 md:order-1
        ">
          <Image
            src="/about/yujie-on-a-horse.JPEG"
            alt="Yujie on a horse"
            fill
            className="object-cover"
          />
          {/* Label overlay */}
          <div className="
            absolute bottom-0 left-0 right-0
            px-[var(--spacing-5)] pb-[var(--spacing-4)] pt-[var(--spacing-10)]
            bg-[linear-gradient(to_top,rgba(22,59,22,0.75)_0%,transparent_100%)]
          ">
            <p className="
              text-xs font-semibold font-[var(--font-ui)]
              tracking-[var(--letter-spacing-wide)] uppercase
              text-[rgba(255,255,255,0.92)]
            ">
                Not just a dog person
            </p>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 md:order-2">
          <p className="
            text-xs font-semibold font-[var(--font-ui)]
            tracking-[var(--letter-spacing-widest)] uppercase
            text-[var(--color-primary)]
            mb-[var(--spacing-4)]
          ">
            🏃 &nbsp;Outside of Dog Care
          </p>
          <h2 className="
            font-[var(--font-display)] text-4xl font-bold
            text-[var(--color-text-primary)]
            leading-[var(--line-height-tight)]
            tracking-[var(--letter-spacing-tight)]
            mb-[var(--spacing-6)]
          ">
            When I'm not studying<br />
            <span className="text-[var(--color-primary)]">or with the pups.</span>
          </h2>
          <p className="
            font-[var(--font-body)] text-base
            text-[var(--color-text-secondary)]
            leading-[var(--line-height-relaxed)]
            mb-[var(--spacing-8)]
          ">
            Outside of dog care and school, I keep myself pretty busy. Brownie comes
            along for as many adventures as possible.
          </p>

          {/* Hobbies grid */}
          <div className="grid grid-cols-2 gap-[var(--spacing-3)]">
            {hobbies.map(({ icon, label }) => (
              <div
                key={label}
                className="
                  flex items-center gap-[var(--spacing-3)]
                  bg-[var(--color-primary-surface)]
                  border border-[var(--color-primary-light)]
                  rounded-[var(--radius-xl)]
                  px-[var(--spacing-4)] py-[var(--spacing-3)]
                "
              >
                <span className="text-[22px] leading-none shrink-0">{icon}</span>
                <span className="
                  text-sm font-semibold font-[var(--font-ui)]
                  text-[var(--color-primary-dark)]
                ">
                  {label}
                </span>
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
            Ready to meet your pup's new best friend?
          </h2>
          <p className="
            font-[var(--font-body)] text-lg
            text-[var(--color-green-100)]
            leading-[var(--line-height-relaxed)]
            mb-[var(--spacing-8)]
          ">
            I'd love to have your pup over. Book a stay or check out my services
            to find the right fit.
          </p>
          <div className="flex items-center justify-center gap-[var(--spacing-4)] flex-wrap">
            <Link
              href="/book"
              className="
                inline-flex items-center gap-[var(--spacing-2)]
                bg-[var(--color-amber-400)] text-[var(--color-bark-950)]
                text-base font-bold font-[var(--font-ui)]
                tracking-[var(--letter-spacing-wide)]
                px-[var(--spacing-8)] py-[var(--spacing-4)]
                rounded-[var(--radius-button)]
                no-underline shadow-[var(--shadow-amber)]
                transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]
                hover:bg-[var(--color-amber-300)] hover:-translate-y-px hover:shadow-[var(--shadow-lg)]
                active:translate-y-0
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber-300)] focus-visible:ring-offset-2
              "
            >
              Book a Stay 🐾
            </Link>
            <Link
              href="/services"
              className="
                inline-flex items-center gap-[var(--spacing-2)]
                bg-transparent text-[var(--color-green-100)]
                text-base font-medium font-[var(--font-ui)]
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
        </div>
      </section>

    </main>
  );
}
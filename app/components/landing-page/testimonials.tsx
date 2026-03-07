import Image from "next/image";

const testimonials = [
  {
    name: "Kelly S.",
    dog: "Luna, Australian Sheperd Dog",
    quote:
      "Yujie watched our little Luna over the holidays and he did a wonderful job! He sent pictures and updates of her everyday and was extremely responsive and timely. Our pup is a little standoffish around new people but by the end of the trip during the hand off, Luna was going back over to Yujie for pets! It seems they became fast friends. I will definitely have Luna stay with Yujie when we're out of town in the future.",
    rating: 5,
    avatar: "/testimonial-profiles/Luna.png",
  },
  {
    name: "Hadley G.",
    dog: "Archie, Bernedoodle",
    quote:
      "Yujie was absolutely amazing! He watched our dog for 5 days over Thanksgiving and went above and beyond. He was so flexible when our flight got delayed, and he kept us updated the entire time with frequent messages and the cutest photos of our very needy pup. It gave us total peace of mind knowing our dog was so well cared for. I highly recommend Yujie — we will definitely be booking with him again!",
    rating: 5,
    avatar: "/testimonial-profiles/Archie.png",
  },
  {
    name: "Sarah F.",
    dog: "Nero, Pitbull Mix",
    quote:
      "Yujie is fantastic. Not only did they offer an early drop off the night before, they sent daily pictures & check-ins while I was out of state. Very accommodating, professional, and kind. Wouldn't hesitate to leave Nero in their care again for future endeavors where he can't join me. Thank you Yujie!",
    rating: 5,
    avatar: "/testimonial-profiles/Nero.png",
  },
];

const ROVER_URL = "https://www.rover.com/members/yujie-z-one-dogfamily-at-a-time/";

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
          <p className="
            font-[var(--font-ui)]
            text-xs font-semibold
            tracking-[var(--letter-spacing-widest)] uppercase
            text-[var(--color-accent)]
            mb-[var(--spacing-3)]
          ">
            ❤️ &nbsp;Pet Parent Stories
          </p>

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

          <p className="
            font-[var(--font-body)]
            text-lg
            text-[var(--color-text-secondary)]
            leading-[var(--line-height-relaxed)]
            max-w-[44ch] mx-auto
            mb-[var(--spacing-6)]
          ">
            The dogs would leave reviews themselves, but they're busy napping. Luckily, their humans had plenty to say.
          </p>

          {/* Rover badge link */}
          <a
            href={ROVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-[var(--spacing-2)]
              text-sm font-semibold font-[var(--font-ui)]
              text-[var(--color-text-secondary)]
              bg-[var(--color-surface)]
              border border-[var(--color-border)]
              px-[var(--spacing-4)] py-[var(--spacing-2)]
              rounded-[var(--radius-full)]
              shadow-[var(--shadow-xs)]
              no-underline
              transition-all duration-[var(--duration-normal)]
              hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:shadow-[var(--shadow-sm)]
            "
          >
            <span className="
              inline-flex items-center justify-center
              w-5 h-5 rounded-full
              bg-[#00B4A0]
            ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </span>
            Read all reviews on Rover
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="opacity-50"
            >
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </a>
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
              {/* Stars */}
              <div className="flex gap-[var(--spacing-1)]">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <span key={s} className="text-sm text-[var(--color-star)]">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
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
                <Image
                  src={t.avatar}
                  alt={`${t.dog} avatar`}
                  width={40}
                  height={40}
                  className="rounded-[var(--radius-avatar)] object-cover shrink-0"
                />
                <div>
                  <p className="
                    font-[var(--font-ui)]
                    text-sm font-semibold
                    text-[var(--color-text-primary)]
                    leading-[var(--line-height-snug)]
                  ">
                    {t.name}
                  </p>
                  <p className="
                    font-[var(--font-ui)]
                    text-xs
                    text-[var(--color-text-muted)]
                    leading-[var(--line-height-snug)]
                  ">
                    {t.dog}
                  </p>
                </div>

                {/* Per-card Rover link */}
                <a
                  href={ROVER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    ml-auto shrink-0
                    inline-flex items-center gap-[var(--spacing-1)]
                    text-xs font-medium font-[var(--font-ui)]
                    text-[var(--color-text-muted)]
                    no-underline
                    transition-colors duration-[var(--duration-fast)]
                    hover:text-[var(--color-primary)]
                  "
                  title="Verified on Rover"
                >
                  <span className="
                    inline-flex items-center justify-center
                    w-4 h-4 rounded-full
                    bg-[#00B4A0]
                    shrink-0
                  ">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </span>
                  Verified
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <div className="
          mt-[var(--spacing-12)]
          flex flex-col sm:flex-row items-center justify-center
          gap-[var(--spacing-4)]
          text-center
        ">
          <p className="
            font-[var(--font-body)]
            text-sm
            text-[var(--color-text-muted)]
          ">
            All reviews sourced directly from Rover — 100% from real pet parents.
          </p>
          <a
            href={ROVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-[var(--spacing-2)]
              text-sm font-semibold font-[var(--font-ui)]
              text-[var(--color-primary-dark)]
              bg-[var(--color-primary-surface)]
              border border-[var(--color-primary-light)]
              px-[var(--spacing-5)] py-[var(--spacing-2-5)]
              rounded-[var(--radius-button)]
              no-underline
              shadow-[var(--shadow-xs)]
              transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]
              hover:bg-[var(--color-green-100)] hover:-translate-y-px hover:shadow-[var(--shadow-green)]
              active:translate-y-0
            "
          >
            View Full Profile on Rover
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
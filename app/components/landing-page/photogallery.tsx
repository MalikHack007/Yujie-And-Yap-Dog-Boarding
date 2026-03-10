import Image from "next/image";

const photos = [
  {
    src: "/dog-photos/Brownie.jpg",
    alt: "Black and tan dog standing",
    label: "Brownie",
    large: true,
  },
  {
    src: "/dog-photos/Dakota.jpg",
    alt: "Miniature Australian Shepherd running towards the camera",
    label: "Dakota",
    large: false,
  },
  {
    src: "/dog-photos/Miller.jpg",
    alt: "An Australian Cattle Dog running towards the camera with a stick in his mouth",
    label: "Miller",
    large: false,
  },
  {
    src: "/dog-photos/Sutton.jpg",
    alt: "An Australian Shepherd running towards the camera with a smile on her face",
    label: "Sutton",
    large: false,
  },
  {
    src: "/dog-photos/Wynnie.jpg",
    alt: "Dog relaxing on the couch during a boarding stay",
    label: "Wynnie",
    large: true,
  },
  {
    src: "/dog-photos/Bowie.jpg",
    alt: "Poodle laying on the ground with a big smile on his face",
    label: "Bowie",
    large: false,
  },
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
            <p className="
              font-[var(--font-ui)]
              text-xs font-semibold
              tracking-[var(--letter-spacing-widest)] uppercase
              text-[var(--color-primary)]
              mb-[var(--spacing-3)]
            ">
              📸 &nbsp;The Pack in Action
            </p>

            <h2 className="
              font-[var(--font-display)]
              text-4xl font-bold
              text-[var(--color-text-primary)]
              leading-[var(--line-height-tight)]
              tracking-[var(--letter-spacing-tight)]
            ">
              A glimpse into the
              <br />
              <span className="text-[var(--color-primary)]">happy pack</span>
            </h2>
          </div>

          <p className="
            font-[var(--font-body)]
            text-base
            text-[var(--color-text-muted)]
            leading-[var(--line-height-relaxed)]
            max-w-[30ch] text-right
          ">
            Every day is an adventure. Here's what life looks like in my care.
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
                "shadow-[var(--shadow-md)]",
                "cursor-pointer",
                "transition-all duration-[var(--duration-slow)]",
                "hover:scale-[1.02] hover:shadow-[var(--shadow-xl)]",
                "group",
              ].join(" ")}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-[var(--duration-slower)] group-hover:scale-105"
                sizes={photo.large
                  ? "(max-width: 768px) 100vw, 33vw"
                  : "(max-width: 768px) 50vw, 22vw"
                }
              />

              {/* Label overlay */}
              <div className="
                absolute bottom-0 left-0 right-0
                px-[var(--spacing-4)] pb-[var(--spacing-3)] pt-[var(--spacing-10)]
                bg-[linear-gradient(to_top,rgba(22,59,22,0.80)_0%,transparent_100%)]
                rounded-b-[var(--radius-2xl)]
              ">
                <p className="
                  font-[var(--font-ui)]
                  text-xs font-semibold
                  tracking-[var(--letter-spacing-wide)] uppercase
                  text-[rgba(255,255,255,0.92)]
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
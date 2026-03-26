export default function ContactScene() {
  return (
    <section className="grid min-h-[78vh] place-items-center">
      <div className="max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
          Contact
        </span>

        <h2 className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          Let’s build
          <span className="block text-white/75">something memorable.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          From concept to production, Rubik Creaciones helps transform ideas
          into visual experiences with real-world impact.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#180d37] transition hover:scale-[1.02]"
          >
            Start project
          </a>

          <a
            href="#"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            See services
          </a>
        </div>
      </div>
    </section>
  );
}
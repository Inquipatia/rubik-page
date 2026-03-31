export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,#6d3cff_0%,#4416a8_22%,#1c103a_58%,#0a0a14_100%)] text-white">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-16">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs text-white/75 backdrop-blur sm:text-sm">
            Rubik Creaciones
          </span>

          <h1 className="mt-5 text-4xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl">
            Turn bold ideas
            <span className="block text-white/75">into visual impact.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base md:text-lg lg:mx-0">
            Signage, structures, branding and production with a premium digital
            experience centered on our animated cube.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start">
            <a
              href="#"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#180d37] transition hover:scale-[1.02] sm:px-6"
            >
              Get started
            </a>

            <a
              href="#"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:px-6"
            >
              See our work
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-5 text-sm text-white/65 lg:justify-start">
            <div>
              <div className="text-2xl font-semibold text-white">+120</div>
              <div>Projects delivered</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">24/7</div>
              <div>Creative support</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">3D</div>
              <div>Interactive visual layer</div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
          <div className="absolute h-52 w-52 rounded-full bg-fuchsia-500/25 blur-3xl sm:h-64 sm:w-64" />
          <div className="absolute -left-2 top-10 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl sm:-left-6 sm:h-56 sm:w-56" />
          <div className="absolute bottom-2 h-14 w-44 rounded-full bg-black/20 blur-2xl sm:bottom-4 sm:h-20 sm:w-56" />

          <div className="cube-stage">
            <div className="cube-hero-reveal">
              <div className="cube-hero-frame">
                <iframe
                  src="https://my.spline.design/cube10-x9gcSdkBA1oo2VIAENSUDbZE/"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  className="cube-scene"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

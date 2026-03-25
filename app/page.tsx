export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,#6d3cff_0%,#4416a8_22%,#1c103a_58%,#0a0a14_100%)] text-white">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <div className="max-w-2xl">
          <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
            Rubik Creaciones
          </span>

          <h1 className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Turn bold ideas
            <span className="block text-white/75">into visual impact.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Signage, structures, branding and production with a premium digital
            experience centered on our animated cube.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#180d37] transition hover:scale-[1.02]"
            >
              Get started
            </a>

            <a
              href="#"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              See our work
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/65">
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

        <div className="relative flex items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="absolute -left-6 top-10 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-4 h-20 w-56 rounded-full bg-black/20 blur-2xl" />

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
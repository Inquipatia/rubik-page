type IntroSceneProps = {
  titleTop: string;
  titleBottom: string;
  description: string;
  primary: string;
  secondary: string;
};

export default function IntroScene({
  titleTop,
  titleBottom,
  description,
  primary,
  secondary,
}: IntroSceneProps) {
  return (
    <section className="grid min-h-[78vh] grid-cols-1 items-center gap-10 lg:grid-cols-2">
      <div className="max-w-2xl">
        <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
          Rubik Creaciones
        </span>

        <h1 className="mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          {titleTop}
          <span className="block text-white/75">{titleBottom}</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#180d37] transition hover:scale-[1.02]"
          >
            {primary}
          </a>

          <a
            href="#"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            {secondary}
          </a>
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
  );
}
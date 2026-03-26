"use client";

type IntroSceneProps = {
  titleTop: string;
  titleBottom: string;
  description: string;
  primary: string;
  secondary: string;
  onCubeHoverChange: (isHovered: boolean) => void;
};

export default function IntroScene({
  titleTop,
  titleBottom,
  description,
  primary,
  secondary,
  onCubeHoverChange,
}: IntroSceneProps) {
  return (
    <section className="grid h-[calc(100vh-110px)] grid-cols-1 items-center gap-4 overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
      {/* IZQUIERDA */}
      <div className="max-w-[620px]">
        <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
          Rubik Creaciones
        </span>

        <h1 className="mt-3 text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-[5.6rem]">
          {titleTop}
          <span className="block text-white/75">{titleBottom}</span>
        </h1>

        <p className="mt-5 max-w-[520px] text-base leading-7 text-white/70 sm:text-lg">
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

      {/* DERECHA */}
      <div className="relative flex items-center justify-center lg:-translate-y-8">
        <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-4 top-8 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-3 h-20 w-56 rounded-full bg-black/20 blur-2xl" />

        <div
          className="relative z-20 h-[330px] w-[330px] overflow-visible sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]"
          onMouseEnter={() => onCubeHoverChange(true)}
          onMouseLeave={() => onCubeHoverChange(false)}
        >
          <div className="h-full w-full overflow-visible rounded-[28px]">
            <iframe
              src="https://my.spline.design/cube10-x9gcSdkBA1oo2VIAENSUDbZE/"
              frameBorder="0"
              width="100%"
              height="100%"
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
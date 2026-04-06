"use client";

export default function FaqScene() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6e38ff_0%,#2e0f67_32%,#12051f_65%,#090414_100%)]" />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/textures/faq-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <span className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
            FAQ
          </span>

          <h2 className="max-w-2xl text-4xl font-light leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
            Everything
            <br />
            you may ask.
          </h2>

          <div className="mt-10 space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md">
              Do you only design, or also produce?
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md">
              Can you help with custom brand activations?
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md">
              Do you work with signage and structures?
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-md">
              Can you adapt solutions to different budgets?
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
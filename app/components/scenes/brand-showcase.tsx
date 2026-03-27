"use client";

import Image from "next/image";

type BrandItem = {
  name: string;
  logo: string;
};

const brands: BrandItem[] = [
  { name: "Santander", logo: "/img/works/3.png" },
  { name: "Coca-Cola", logo: "/img/works/3.png" },
  { name: "Mallplaza", logo: "/img/works/3.png" },
  { name: "Entel", logo: "/img/works/3.png" },
  { name: "Falabella", logo: "/img/works/3.png" },
  { name: "Samsung", logo: "/img/works/3.png" },
  { name: "Nike", logo: "/img/works/3.png" },
  { name: "Adidas", logo: "/img/works/3.png" },
  { name: "Pepsi", logo: "/img/works/3.png" },
  { name: "Banco de Chile", logo: "/img/works/3.png" },
];

export default function BrandShowcase() {
  return (
    <section
      id="brands"
      className="relative mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[720px] text-center">
        <div className="inline-flex rounded-full border border-white/12 bg-white/[0.04] px-4 py-1 text-sm text-white/72 backdrop-blur">
          Marcas
        </div>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
          Marcas que han confiado en Rubik
        </h2>

        <p className="mx-auto mt-3 max-w-[620px] text-sm leading-7 text-white/58 sm:text-base">
          Clientes, colaboraciones y proyectos desarrollados junto a marcas que
          buscan impacto visual real, producción cuidada y soluciones pensadas
          para destacar.
        </p>
      </div>

      <div className="relative mx-auto mt-6 max-w-[1180px] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-[1px] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="relative overflow-hidden rounded-[29px] bg-[linear-gradient(180deg,#181028_0%,#120b20_45%,#0d0818_100%)] px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-6">
          {/* textura sutil del panel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                radial-gradient(rgba(255,255,255,0.18) 0.6px, transparent 0.6px),
                linear-gradient(180deg, rgba(255,255,255,0.05), transparent 35%)
              `,
              backgroundSize: "14px 14px, 100% 100%",
              backgroundPosition: "0 0, 0 0",
            }}
          />

          {/* borde interior del panel */}
          <div className="pointer-events-none absolute inset-3 rounded-[24px] border border-white/[0.05]" />

          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => (
              <article
                key={brand.name}
                className="group relative min-h-[92px] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-[1px] transition duration-300 hover:-translate-y-[2px] hover:border-white/[0.18] hover:shadow-[0_18px_38px_rgba(0,0,0,0.24)]"
              >
                <div className="relative flex h-full min-h-[90px] items-center justify-center overflow-hidden rounded-[19px] bg-[linear-gradient(180deg,#0c0914_0%,#110d1b_40%,#151024_100%)] px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-12px_30px_rgba(0,0,0,0.5)] transition duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-14px_34px_rgba(0,0,0,0.58),0_12px_26px_rgba(0,0,0,0.16)]">
                  {/* fondo suave detrás del logo para separarlo del cristal */}
                  <div className="pointer-events-none absolute inset-[10px] rounded-[14px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.005))]" />

                  {/* capa cristal general más visible */}
                  <div className="pointer-events-none absolute inset-[2px] rounded-[17px] bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03)_38%,rgba(255,255,255,0.012)_100%)] backdrop-blur-[3px]" />

                  {/* borde exterior del vidrio */}
                  <div className="pointer-events-none absolute inset-[2px] rounded-[17px] border border-white/[0.14]" />

                  {/* borde interior */}
                  <div className="pointer-events-none absolute inset-[8px] rounded-[14px] border border-white/[0.09]" />

                  {/* brillo superior principal */}
                  <div className="pointer-events-none absolute inset-x-3 top-2 h-7 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.04))] blur-md opacity-80 transition duration-300 group-hover:opacity-100" />

                  {/* brillo fino superior */}
                  <div className="pointer-events-none absolute inset-x-5 top-[10px] h-px bg-white/30 opacity-70" />

                  {/* reflejo diagonal grande */}
                  <div className="pointer-events-none absolute -left-[28%] top-[-12%] h-[140%] w-[34%] rotate-[18deg] bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.05)_45%,rgba(255,255,255,0.01))] opacity-25 blur-[2px] transition duration-300 group-hover:translate-x-3 group-hover:opacity-40" />

                  {/* reflejo secundario pequeño */}
                  <div className="pointer-events-none absolute right-3 top-3 h-10 w-10 rounded-full bg-white/10 blur-xl opacity-40 transition duration-300 group-hover:opacity-60" />

                  {/* sombra suave en la base del vidrio */}
                  <div className="pointer-events-none absolute inset-x-4 bottom-2 h-5 rounded-full bg-black/20 blur-md opacity-70" />

                  {/* logo */}
                  <div className="relative z-10 h-[28px] w-full transition duration-300 group-hover:scale-[1.03]">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                      className="object-contain opacity-90 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
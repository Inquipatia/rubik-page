"use client";

import Image from "next/image";

type BrandItem = {
  name: string;
  logo: string;
};

const brands: BrandItem[] = [
  { name: "Santander", logo: "/img/works/andina.png" },
  { name: "Coca-Cola", logo: "/img/works/cola.png" },
  { name: "Mallplaza", logo: "/img/works/bec.jpg" },
  { name: "Entel", logo: "/img/works/che.png" },
  { name: "Falabella", logo: "/img/works/falabella.svg" },
  { name: "Samsung", logo: "/img/works/samsung.svg" },
  { name: "Nike", logo: "/img/works/nike.svg" },
  { name: "Adidas", logo: "/img/works/adidas.svg" },
  { name: "Pepsi", logo: "/img/works/pepsi.svg" },
  { name: "Banco de Chile", logo: "/img/brands/bancodechile.svg" },
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
          {/* textura sutil */}
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

          <div className="pointer-events-none absolute inset-3 rounded-[24px] border border-white/[0.05]" />

          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => (
              <article
                key={brand.name}
                className="group relative min-h-[92px] overflow-hidden rounded-[20px] border border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-[1px] transition duration-300 hover:-translate-y-[1px] hover:border-white/[0.12]"
              >
                <div className="relative flex h-full min-h-[90px] items-center justify-center overflow-hidden rounded-[19px] bg-[linear-gradient(180deg,#0c0914_0%,#110d1b_40%,#151024_100%)] px-4 py-5 shadow-[inset_0_2px_2px_rgba(255,255,255,0.04),inset_0_-10px_24px_rgba(0,0,0,0.5)] transition duration-300 group-hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.06),inset_0_-12px_28px_rgba(0,0,0,0.55),0_10px_24px_rgba(0,0,0,0.16)]">
                  <div className="pointer-events-none absolute inset-[9px] rounded-[14px] border border-white/[0.04]" />

                  <div className="pointer-events-none absolute inset-x-4 top-3 h-4 rounded-full bg-white/[0.03] blur-md transition duration-300 group-hover:bg-white/[0.05]" />

                  <div className="relative h-[28px] w-full transition duration-300 group-hover:scale-[1.03]">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain opacity-80 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
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
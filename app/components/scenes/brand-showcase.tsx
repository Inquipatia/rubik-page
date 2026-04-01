"use client";

import Image from "next/image";
import type { SelectedBrand } from "@/app/page";

type BrandShowcaseProps = {
  onOpenBrandDetails: (brand: SelectedBrand) => void;
};

const brands: SelectedBrand[] = [
  {
    brandName: "Santander",
    brandLogo: "/img/works/santa.png",
    description:
      "Desarrollo de soportes gráficos, implementación visual y piezas de alto impacto para espacios de atención y campañas de marca.",
    works: [
      {
        image: "/img/works/santa.png",
        title: "Implementación sucursal",
        description: "Aplicación gráfica en espacio comercial y comunicación visual.",
      },
      {
        image: "/img/works/3.png",
        title: "Señalética corporativa",
        description: "Sistema visual para reforzar navegación y presencia de marca.",
      },
      {
        image: "/img/works/3.png",
        title: "Campaña interior",
        description: "Elementos gráficos para destacar promociones y experiencia de cliente.",
      },
      {
        image: "/img/works/3.png",
        title: "Piezas de apoyo",
        description: "Producción e instalación de recursos visuales complementarios.",
      },
    ],
  },
  {
    brandName: "Chevrolet",
    brandLogo: "/img/works/chevrolet.png",
    description:
      "Producción de piezas visuales para acciones promocionales, exhibición de marca y activaciones en espacios comerciales.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Activación retail",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/works/3.png",
        title: "Display de marca",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
    ],
  },
  {
    brandName: "Complot",
    brandLogo: "/img/works/complot.png",
    description:
      "Aplicaciones de gran formato, piezas promocionales y soluciones visuales orientadas a espacios de alto tráfico.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Gráfica de mall",
        description: "Instalación de piezas promocionales y branding en zonas comunes.",
      },
      {
        image: "/img/works/3.png",
        title: "Campaña estacional",
        description: "Recursos visuales para fechas clave y alto flujo de público.",
      },
    ],
  },
  {
    brandName: "Latam Airlines",
    brandLogo: "/img/works/latam.png",
    description:
      "Implementaciones gráficas y materiales visuales para reforzar comunicación de marca y presencia comercial.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Soporte visual",
        description: "Aplicación de piezas gráficas en entorno comercial.",
      },
      {
        image: "/img/works/3.png",
        title: "Branding interior",
        description: "Refuerzo visual de marca en espacios de atención.",
      },
    ],
  },
  {
    brandName: "Copec",
    brandLogo: "/img/works/copec.png",
    description:
      "Desarrollo de recursos gráficos para exhibición, comunicación comercial y montaje de campañas en tienda.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Campaña visual",
        description: "Piezas para destacar oferta y experiencia en tienda.",
      },
      {
        image: "/img/works/3.png",
        title: "Elementos POP",
        description: "Recursos gráficos orientados a visibilidad de producto.",
      },
    ],
  },
  {
    brandName: "Glam & Co",
    brandLogo: "/img/works/glam.png",
    description:
      "Soportes gráficos y visuales para exhibición de productos, lanzamientos y comunicación tecnológica en espacios físicos.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Exhibición tecnológica",
        description: "Implementación visual enfocada en producto y experiencia.",
      },
      {
        image: "/img/works/3.png",
        title: "Material lanzamiento",
        description: "Piezas para acompañar campañas y comunicación de novedades.",
      },
    ],
  },
  {
    brandName: "Kaufmann",
    brandLogo: "/img/works/kauf.png",
    description:
      "Aplicaciones de marca, ambientación y piezas promocionales para campañas visuales de alto impacto.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Visual de campaña",
        description: "Despliegue gráfico para reforzar storytelling de marca.",
      },
      {
        image: "/img/works/3.png",
        title: "Ambientación retail",
        description: "Piezas y soportes para experiencia de compra.",
      },
    ],
  },
  {
    brandName: "Mistral",
    brandLogo: "/img/works/mistral.png",
    description:
      "Montajes visuales, piezas gráficas y aplicaciones comerciales pensadas para destacar producto y marca.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Instalación gráfica",
        description: "Implementación de recursos visuales para entorno comercial.",
      },
      {
        image: "/img/works/3.png",
        title: "Piezas promocionales",
        description: "Apoyo visual para comunicación de campaña.",
      },
    ],
  },
  {
    brandName: "Pepsi",
    brandLogo: "/img/works/pepsi.png",
    description:
      "Producción e instalación de piezas promocionales y soportes de comunicación para campañas de consumo masivo.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Promoción en punto de venta",
        description: "Implementación visual para reforzar campaña comercial.",
      },
      {
        image: "/img/works/3.png",
        title: "Material de marca",
        description: "Recursos visuales para presencia y recordación.",
      },
    ],
  },
  {
    brandName: "Canada Dry",
    brandLogo: "/img/works/canada.png",
    description:
      "Soluciones gráficas corporativas para espacios de atención, campañas y refuerzo de identidad visual.",
    works: [
      {
        image: "/img/works/3.png",
        title: "Señalética corporativa",
        description: "Aplicación de elementos visuales en entorno institucional.",
      },
      {
        image: "/img/works/3.png",
        title: "Gráfica de apoyo",
        description: "Piezas para comunicación y presencia de marca.",
      },
    ],
  },
];

export default function BrandShowcase({
  onOpenBrandDetails,
}: BrandShowcaseProps) {
  return (
    <section
      id="brands"
      className="relative mx-auto w-full max-w-[1120px] px-6 py-6 sm:px-8 lg:px-12"
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
              <button
                key={brand.brandName}
                type="button"
                onClick={() => onOpenBrandDetails(brand)}
                className="group relative min-h-[92px] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-[1px] text-left transition duration-300 hover:-translate-y-[2px] hover:border-white/[0.18] hover:shadow-[0_18px_38px_rgba(0,0,0,0.24)] focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label={`Ver detalles de ${brand.brandName}`}
              >
                <div className="relative flex h-full min-h-[90px] items-center justify-center overflow-hidden rounded-[19px] bg-[linear-gradient(180deg,#0c0914_0%,#110d1b_40%,#151024_100%)] px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-12px_30px_rgba(0,0,0,0.5)] transition duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-14px_34px_rgba(0,0,0,0.58),0_12px_26px_rgba(0,0,0,0.16)]">
                  <div className="pointer-events-none absolute inset-[10px] rounded-[14px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.005))]" />

                  <div className="pointer-events-none absolute inset-[2px] rounded-[17px] bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03)_38%,rgba(255,255,255,0.012)_100%)] backdrop-blur-[3px]" />

                  <div className="pointer-events-none absolute inset-[2px] rounded-[17px] border border-white/[0.14]" />

                  <div className="pointer-events-none absolute inset-[8px] rounded-[14px] border border-white/[0.09]" />

                  <div className="pointer-events-none absolute inset-x-3 top-2 h-7 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.04))] blur-md opacity-80 transition duration-300 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-x-5 top-[10px] h-px bg-white/30 opacity-70" />

                  <div className="pointer-events-none absolute -left-[28%] top-[-12%] h-[140%] w-[34%] rotate-[18deg] bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.05)_45%,rgba(255,255,255,0.01))] opacity-25 blur-[2px] transition duration-300 group-hover:translate-x-3 group-hover:opacity-40" />

                  <div className="pointer-events-none absolute right-3 top-3 h-10 w-10 rounded-full bg-white/10 blur-xl opacity-40 transition duration-300 group-hover:opacity-60" />

                  <div className="pointer-events-none absolute inset-x-4 bottom-2 h-5 rounded-full bg-black/20 blur-md opacity-70" />

                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[19px]">
                    <div className="absolute left-[-42%] top-0 h-full w-[26%] rotate-[16deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-0 [transform:translateX(0)] transition-transform duration-700 ease-out group-hover:translate-x-[620%] group-hover:opacity-100" />
                  </div>

                  <div className="relative z-10 h-[28px] w-full transition duration-300 group-hover:scale-[1.03]">
                    <Image
                      src={brand.brandLogo || "/img/works/3.png"}
                      alt={brand.brandName}
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                      className="object-contain opacity-90 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
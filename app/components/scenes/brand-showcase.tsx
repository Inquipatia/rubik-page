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
      "Activaciones de verano en Surf Festival, con desarrollo de stands en La Serena y Pichilemu, fabricación en MDF y madera tratada, full branding, volumétricos en acrílico, cortes CNC, aplicaciones en Neon Flex e intervención de escenarios y zonas de competencia e hidratación. Posteriormente, parte de esta estructura fue reutilizada y adaptada para su presencia en el Festival de Viña, incluyendo espacios interiores y VIP en la Quinta Vergara.",
    works: [
      {
        image: "/img/services/SANTANDER/santa (1).png",
        title: "Implementación sucursal",
        description:
          "Aplicación gráfica en espacio comercial y comunicación visual.",
      },
      {
        image: "/img/services/SANTANDER/santa (2).png",
        title: "Señalética corporativa",
        description:
          "Sistema visual para reforzar navegación y presencia de marca.",
      },
      {
        image: "/img/services/SANTANDER/santa (3).png",
        title: "Campaña interior",
        description:
          "Elementos gráficos para destacar promociones y experiencia de cliente.",
      },
      {
        image: "/img/services/SANTANDER/santa (4).png",
        title: "Piezas de apoyo",
        description:
          "Producción e instalación de recursos visuales complementarios.",
      },
    ],
  },

  {
    brandName: "Chevrolet",
    brandLogo: "/img/works/chevrolet.png",
    description:
      "Lanzamiento Eurosail con fuerte protagonismo de estructuras metálicas, arcos de activación y aplicaciones extensivas de Neón Flex, integrando piezas de marca en distintos puntos relevantes del montaje.",
    works: [
      {
        image: "/img/services/CHEVROLET/che (1).png",
        title: "Activación retail",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/services/CHEVROLET/che (2).png",
        title: "Display de marca",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
      {
        image: "/img/services/CHEVROLET/che (3).png",
        title: "Piezas gráficas",
        description: "Aplicaciones visuales en estructura y entorno de marca.",
      },
      {
        image: "/img/services/CHEVROLET/che (4).png",
        title: "Implementación visual",
        description: "Recursos gráficos para activación y experiencia.",
      },
      {
        image: "/img/services/CHEVROLET/che (5).png",
        title: "Soporte promocional",
        description: "Elementos para reforzar presencia en evento.",
      },
      {
        image: "/img/services/CHEVROLET/che (6).png",
        title: "Cierre de montaje",
        description: "Integración visual de piezas y estructura.",
      },
    ],
  },

  {
    brandName: "Copec",
    brandLogo: "/img/works/copec.png",
    description:
      "Activación de verano en playa con fabricación integral de estructura, combinación de MDF y madera nativa, full branding, banderas vela y volumétricos.",
    works: [
      {
        image: "/img/services/COPEC/COPEC (1).png",
        title: "Copec 01",
        description: "Piezas para destacar oferta y experiencia en tienda.",
      },
      {
        image: "/img/services/COPEC/COPEC (2).png",
        title: "Copec 02",
        description: "Recursos gráficos orientados a visibilidad de producto.",
      },
      {
        image: "/img/services/COPEC/COPEC (3).png",
        title: "Copec 03",
        description: "Aplicación visual para presencia de marca.",
      },
    ],
  },

  {
    brandName: "Kaufmann",
    brandLogo: "/img/works/kauf.png",
    description:
      "Activaciones desarrolladas vía agencia Complot, incluyendo estructuras metálicas para exhibición de vehículos, volumétricos en acrílico, piezas gráficas y emplacado en Trovicel.",
    works: [
      {
        image: "/img/services/KAUFMAN/kaufman (1).png",
        title: "Visual de campaña",
        description:
          "Despliegue gráfico para reforzar storytelling de marca.",
      },
      {
        image: "/img/services/KAUFMAN/kaufman (2).png",
        title: "Ambientación retail",
        description: "Piezas y soportes para experiencia de compra.",
      },
      {
        image: "/img/services/KAUFMAN/kaufman (3).png",
        title: "Soporte promocional",
        description: "Aplicaciones visuales para exhibición y marca.",
      },
      {
        image: "/img/services/KAUFMAN/kaufman (4).png",
        title: "Implementación comercial",
        description: "Recursos gráficos en entorno de atención y venta.",
      },
    ],
  },

  {
    brandName: "Latam Airlines",
    brandLogo: "/img/works/Latam.png",
    description:
      "Reacondicionamiento y mantención de volumétricos previamente construidos, incluyendo renovación de lacado, actualización de branding, mantenimiento de iluminación y ajustes en Neon Flex.",
    works: [
      {
        image: "/img/services/LATAM/latam (1).png",
        title: "Soporte visual",
        description: "Aplicación de piezas gráficas en entorno comercial.",
      },
      {
        image: "/img/services/LATAM/latam (2).png",
        title: "Branding interior",
        description: "Refuerzo visual de marca en espacios de atención.",
      },
      {
        image: "/img/services/LATAM/latam (3).png",
        title: "Actualización gráfica",
        description: "Reajuste visual y mantención de presencia de marca.",
      },
      {
        image: "/img/services/LATAM/latam (4).png",
        title: "Volumétrico reacondicionado",
        description: "Renovación de acabados e identidad visual.",
      },
      {
        image: "/img/services/LATAM/latam (5).png",
        title: "Mantención",
        description: "Correcciones visuales y soporte de instalación.",
      },
      {
        image: "/img/services/LATAM/latam (6).png",
        title: "Aplicación final",
        description: "Integración de branding y terminaciones.",
      },
    ],
  },

  {
    brandName: "Mistral",
    brandLogo: "/img/works/mistral.png",
    description:
      "Soluciones gráficas corporativas para espacios de atención, campañas y refuerzo de identidad visual.",
    works: [
      {
        image: "/img/services/MISTRAL/MISTRAL (1).png",
        title: "Señalética corporativa",
        description:
          "Aplicación de elementos visuales en entorno institucional.",
      },
      {
        image: "/img/services/MISTRAL/MISTRAL (2).png",
        title: "Gráfica de apoyo",
        description: "Piezas para comunicación y presencia de marca.",
      },
      {
        image: "/img/services/MISTRAL/MISTRAL (3).png",
        title: "Implementación visual",
        description: "Refuerzo gráfico para espacios y campaña.",
      },
      {
        image: "/img/services/MISTRAL/MISTRAL (4).png",
        title: "Cierre visual",
        description: "Aplicación final de piezas y soportes.",
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
    className="relative mx-auto flex h-full w-full max-w-[980px] items-center px-3 sm:px-4 lg:max-w-[1000px] lg:px-5 xl:max-w-[1040px] xl:px-5 2xl:max-w-[1160px] 2xl:px-8"
  >
    <div className="w-full translate-y-0 sm:translate-y-1 lg:translate-y-2 xl:translate-y-3">
      <div className="mx-auto max-w-[640px] text-center xl:max-w-[660px] 2xl:max-w-[680px]">
        <div className="inline-flex rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70 backdrop-blur sm:text-[12px]">
          Marcas
        </div>

        <h2 className="mt-2 text-[clamp(1.95rem,3.5vw,3.3rem)] font-[300] leading-[1.02] tracking-[-0.05em] text-white">
          Marcas que han confiado en Rubik
        </h2>

        <p className="mx-auto mt-2.5 max-w-[540px] text-[12px] leading-5.5 text-white/54 sm:text-[13px] sm:leading-6">
          Clientes, colaboraciones y proyectos desarrollados junto a marcas que
          buscan impacto visual real, producción cuidada y soluciones pensadas
          para destacar.
        </p>
      </div>

      <div className="relative mx-auto mt-1 max-w-[980px] rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-[1px] shadow-[0_14px_34px_rgba(0,0,0,0.2)] xl:mt-2 xl:max-w-[1000px] 2xl:max-w-[1120px]">
        <div className="relative overflow-hidden rounded-[21px] bg-[linear-gradient(180deg,#181028_0%,#120b20_45%,#0d0818_100%)] px-2.5 py-2.5 sm:px-3 sm:py-3 lg:px-3 lg:py-3 xl:px-3 xl:py-3 2xl:px-4 2xl:py-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage: `
                radial-gradient(rgba(255,255,255,0.18) 0.6px, transparent 0.6px),
                linear-gradient(180deg, rgba(255,255,255,0.05), transparent 35%)
              `,
              backgroundSize: "14px 14px, 100% 100%",
              backgroundPosition: "0 0, 0 0",
            }}
          />

          <div className="pointer-events-none absolute inset-2 rounded-[18px] border border-white/[0.05]" />

          <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 lg:gap-2.5 xl:grid-cols-3 xl:gap-3 2xl:gap-4">
            {brands.map((brand) => (
              <button
                key={brand.brandName}
                type="button"
                onClick={() => onOpenBrandDetails(brand)}
                className="group relative min-h-[76px] overflow-hidden rounded-[16px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-[1px] text-left transition duration-300 hover:-translate-y-[2px] hover:border-white/[0.18] hover:shadow-[0_10px_20px_rgba(0,0,0,0.18)] focus:outline-none focus:ring-2 focus:ring-white/20 sm:min-h-[82px] lg:min-h-[86px] xl:min-h-[92px] 2xl:min-h-[110px]"
                aria-label={`Ver detalles de ${brand.brandName}`}
              >
                <div className="relative flex h-full min-h-[74px] items-center justify-center overflow-hidden rounded-[15px] bg-[linear-gradient(180deg,#0c0914_0%,#110d1b_40%,#151024_100%)] px-2.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-8px_20px_rgba(0,0,0,0.45)] transition duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-10px_24px_rgba(0,0,0,0.52),0_8px_18px_rgba(0,0,0,0.12)] sm:min-h-[80px] lg:min-h-[84px] xl:min-h-[90px] 2xl:min-h-[108px]">
                  <div className="pointer-events-none absolute inset-[6px] rounded-[10px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.005))]" />
                  <div className="pointer-events-none absolute inset-[2px] rounded-[14px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.028)_38%,rgba(255,255,255,0.012)_100%)] backdrop-blur-[3px]" />
                  <div className="pointer-events-none absolute inset-[2px] rounded-[14px] border border-white/[0.12]" />
                  <div className="pointer-events-none absolute inset-[5px] rounded-[11px] border border-white/[0.07]" />
                  <div className="pointer-events-none absolute inset-x-3 top-2 h-4 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.03))] blur-md opacity-70 transition duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-5 top-[8px] h-px bg-white/22 opacity-70" />
                  <div className="pointer-events-none absolute -left-[28%] top-[-12%] h-[140%] w-[34%] rotate-[18deg] bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_45%,rgba(255,255,255,0))] opacity-30 blur-md transition duration-300 group-hover:translate-x-2" />

                  <div className="relative h-[26px] w-[66%] max-w-[180px] sm:h-[28px] lg:h-[30px] xl:h-[32px] 2xl:h-[38px]">
                    <Image
                      src={brand.brandLogo || "/img/works/3.png"}
                      alt={brand.brandName}
                      fill
                      sizes="(max-width: 640px) 42vw, (max-width: 1024px) 26vw, 220px"
                      className="object-contain opacity-[0.96] drop-shadow-[0_1px_8px_rgba(255,255,255,0.08)] transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
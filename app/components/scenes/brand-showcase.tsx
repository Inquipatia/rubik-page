"use client";

import Image from "next/image";
import type { SelectedBrand } from "@/app/page";

type BrandShowcaseProps = {
  onOpenBrandDetails: (brand: SelectedBrand) => void;
};

function buildWorks(
  folder: string,
  prefix: string,
  count: number,
  extension: "jpg" | "jpeg" | "png",
  brandLabel: string,
  firstItems: {
    image: string;
    title: string;
    description: string;
  }[] = []
) {
  const startIndex = firstItems.length + 1;

  return [
    ...firstItems,
    ...Array.from({ length: count - firstItems.length }, (_, i) => ({
      image: `/img/services/${folder}/${prefix} (${i + startIndex}).${extension}`,
      title: `${brandLabel} ${i + startIndex}`,
      description: "Implementación visual enfocada en producto y experiencia.",
    })),
  ];
}

const brands: SelectedBrand[] = [
  {
    brandName: "Santander",
    brandLogo: "/img/works/santa.png",
    description:
      "Activaciones de verano en Surf Festival, con desarrollo de stands en La Serena y Pichilemu, fabricación en MDF y madera tratada, full branding, volumétricos en acrílico, cortes CNC, aplicaciones en Neon Flex e intervención de escenarios y zonas de competencia e hidratación. Posteriormente, parte de esta estructura fue reutilizada y adaptada para su presencia en el Festival de Viña, incluyendo espacios interiores y VIP en la Quinta Vergara.",
    works: buildWorks("SANTANDER", "santa", 35, "jpg", "Santander", [
      {
        image: "/img/services/SANTANDER/santa (1).jpg",
        title: "Implementación sucursal",
        description: "Aplicación gráfica en espacio comercial y comunicación visual.",
      },
      {
        image: "/img/services/SANTANDER/santa (2).jpg",
        title: "Señalética corporativa",
        description: "Sistema visual para reforzar navegación y presencia de marca.",
      },
      {
        image: "/img/services/SANTANDER/santa (3).jpg",
        title: "Campaña interior",
        description: "Elementos gráficos para destacar promociones y experiencia de cliente.",
      },
      {
        image: "/img/services/SANTANDER/santa (4).jpg",
        title: "Piezas de apoyo",
        description: "Producción e instalación de recursos visuales complementarios.",
      },
    ]),
  },
  {
    brandName: "Chevrolet",
    brandLogo: "/img/works/chevrolet.png",
    description:
      "Lanzamiento Eurosail con fuerte protagonismo de estructuras metálicas, arcos de activación y aplicaciones extensivas de Neón Flex, integrando entre 20 y 30 piezas de marca en distintos puntos relevantes del montaje.",
    works: buildWorks("CHEVROLET", "che", 13, "jpeg", "Chevrolet", [
      {
        image: "/img/services/CHEVROLET/che (1).jpeg",
        title: "Activación retail",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/services/CHEVROLET/che (2).jpeg",
        title: "Display de marca",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
    ]),
  },
  {
    brandName: "Complot",
    brandLogo: "/img/works/complot.png",
    description:
      "Activación en mall tipo isla, incorporando mobiliario y branding para punto de contacto comercial.",
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
    brandLogo: "/img/works/Latam.png",
    description:
      "Reacondicionamiento y mantención de volumétricos previamente construidos, incluyendo renovación de lacado, actualización de branding, mantenimiento de iluminación y ajustes en Neon Flex.",
    works: buildWorks("LATAM", "latam", 17, "jpeg", "Latam", [
      {
        image: "/img/services/LATAM/latam (1).jpeg",
        title: "Soporte visual",
        description: "Aplicación de piezas gráficas en entorno comercial.",
      },
      {
        image: "/img/services/LATAM/latam (2).jpeg",
        title: "Branding interior",
        description: "Refuerzo visual de marca en espacios de atención.",
      },
    ]),
  },
  {
    brandName: "Copec",
    brandLogo: "/img/works/copec.png",
    description:
      "Activación de verano en playa con fabricación integral de estructura, combinación de MDF y madera nativa, full branding, banderas vela y volumétricos.",
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
      "Activaciones desarrolladas vía agencia Complot, incluyendo estructuras metálicas para exhibición de vehículos, volumétricos en acrílico, piezas gráficas y emplacado en Trovicel.",
    works: buildWorks("KAUFMAN", "kaufman", 17, "jpg", "Kaufmann", [
      {
        image: "/img/services/KAUFMAN/kaufman (1).jpg",
        title: "Visual de campaña",
        description: "Despliegue gráfico para reforzar storytelling de marca.",
      },
      {
        image: "/img/services/KAUFMAN/kaufman (2).jpg",
        title: "Ambientación retail",
        description: "Piezas y soportes para experiencia de compra.",
      },
    ]),
  },
  {
    brandName: "Mistral",
    brandLogo: "/img/works/mistral.png",
    description:
      "Desarrollo de activaciones con foco en carpintería, especialmente en eventos masivos como Lollapalooza, complementadas con una alta presencia de aplicaciones en Neon Flex.",
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
      "Participación en Lollapalooza mediante branding integral, impresión en PVC y adhesivos, además de fabricación de volumétricos en acrílico y madera.",
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
      className="relative mx-auto w-full max-w-[880px] px-3 py-1 sm:px-4 lg:px-6"
    >
      <div className="mx-auto max-w-[620px] text-center">
        <div className="inline-flex rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70 backdrop-blur sm:text-[12px]">
          Marcas
        </div>

        <h2 className="mt-2 text-[clamp(1.95rem,3.7vw,3.3rem)] font-[300] leading-[1.02] tracking-[-0.05em] text-white">
          Marcas que han confiado en Rubik
        </h2>

        <p className="mx-auto mt-2.5 max-w-[540px] text-[12px] leading-5.5 text-white/54 sm:text-[13px] sm:leading-6">
          Clientes, colaboraciones y proyectos desarrollados junto a marcas que
          buscan impacto visual real, producción cuidada y soluciones pensadas
          para destacar.
        </p>
      </div>

      <div className="relative mx-auto mt-3 max-w-[900px] rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-[1px] shadow-[0_14px_34px_rgba(0,0,0,0.2)]">
        <div className="relative overflow-hidden rounded-[21px] bg-[linear-gradient(180deg,#181028_0%,#120b20_45%,#0d0818_100%)] px-2.5 py-2.5 sm:px-3 sm:py-3 lg:px-3.5 lg:py-3.5">
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

          <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => (
              <button
                key={brand.brandName}
                type="button"
                onClick={() => onOpenBrandDetails(brand)}
                className="group relative min-h-[64px] overflow-hidden rounded-[14px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-[1px] text-left transition duration-300 hover:-translate-y-[2px] hover:border-white/[0.18] hover:shadow-[0_10px_20px_rgba(0,0,0,0.18)] focus:outline-none focus:ring-2 focus:ring-white/20 sm:min-h-[70px]"
                aria-label={`Ver detalles de ${brand.brandName}`}
              >
                <div className="relative flex h-full min-h-[62px] items-center justify-center overflow-hidden rounded-[13px] bg-[linear-gradient(180deg,#0c0914_0%,#110d1b_40%,#151024_100%)] px-2.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-8px_20px_rgba(0,0,0,0.45)] transition duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-10px_24px_rgba(0,0,0,0.52),0_8px_18px_rgba(0,0,0,0.12)] sm:min-h-[68px]">
                  <div className="pointer-events-none absolute inset-[6px] rounded-[10px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.005))]" />

                  <div className="pointer-events-none absolute inset-[2px] rounded-[12px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.028)_38%,rgba(255,255,255,0.012)_100%)] backdrop-blur-[3px]" />

                  <div className="pointer-events-none absolute inset-[2px] rounded-[12px] border border-white/[0.12]" />

                  <div className="pointer-events-none absolute inset-[5px] rounded-[9px] border border-white/[0.07]" />

                  <div className="pointer-events-none absolute inset-x-3 top-2 h-4 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.03))] blur-md opacity-70 transition duration-300 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-x-5 top-[8px] h-px bg-white/22 opacity-70" />

                  <div className="pointer-events-none absolute -left-[28%] top-[-12%] h-[140%] w-[34%] rotate-[18deg] bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_45%,rgba(255,255,255,0.01))] opacity-18 blur-[2px] transition duration-300 group-hover:translate-x-3 group-hover:opacity-30" />

                  <div className="pointer-events-none absolute right-2.5 top-2.5 h-6 w-6 rounded-full bg-white/10 blur-xl opacity-30 transition duration-300 group-hover:opacity-50" />

                  <div className="pointer-events-none absolute inset-x-4 bottom-2 h-3 rounded-full bg-black/20 blur-md opacity-70" />

                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[13px]">
                    <div className="absolute left-[-42%] top-0 h-full w-[26%] rotate-[16deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-0 [transform:translateX(0)] transition-transform duration-700 ease-out group-hover:translate-x-[620%] group-hover:opacity-100" />
                  </div>

                  <div className="relative z-10 h-[18px] w-full transition duration-300 group-hover:scale-[1.03] sm:h-[20px] lg:h-[22px]">
                    <Image
                      src={brand.brandLogo || "/img/works/3.png"}
                      alt={brand.brandName}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 150px"
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
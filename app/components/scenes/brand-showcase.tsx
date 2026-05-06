"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { SelectedBrand } from "@/app/page";

type BrandShowcaseProps = {
  onOpenBrandDetails: (brand: SelectedBrand) => void;
};

const genericWorks = [
  {
    image: "/img/services/MISTRAL/MISTRA(1).png",
    title: "Implementación visual",
    description: "Aplicación de piezas gráficas, soportes y presencia de marca.",
  },
  {
    image: "/img/services/MISTRAL/MISTRAL (1).png",
    title: "Producción gráfica",
    description: "Desarrollo de elementos visuales para espacios y campañas.",
  },
  {
    image: "/img/services/MISTRAL/MISTRAL (2).png",
    title: "Montaje de marca",
    description: "Instalación y ajuste de piezas para comunicación visual.",
  },
  {
    image: "/img/services/MISTRAL/MISTRAL (3).png",
    title: "Cierre visual",
    description: "Terminaciones, soporte e integración final de marca.",
  },
];

const brands: SelectedBrand[] = [
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
      {
        image: "/img/services/COPEC/COPEC (4).png",
        title: "Copec 04",
        description: "Cierre visual y refuerzo de experiencia de campaña.",
      },
      {
        image: "/img/services/COPEC/COPEC (5).png",
        title: "Copec 05",
        description: "Cierre visual y refuerzo de experiencia de campaña.",
      },
    ],
  },
  {
    brandName: "Kaufmann",
    brandLogo: "/img/works/kauf.png",
    description:
      "Activaciones e implementaciones comerciales con desarrollo de estructuras, piezas gráficas, soportes visuales y recursos de exhibición para reforzar presencia de marca.",
    works: [
      {
        image: "/img/services/COPEC/s.png",
        title: "Kaufmann 01",
        description: "Piezas para destacar oferta y experiencia en tienda.",
      },
      {
        image: "/img/services/KAUFMAN/kaufman (2).png",
        title: "Kaufmann 02",
        description: "Recursos gráficos orientados a visibilidad de producto.",
      },
      {
        image: "/img/services/KAUFMAN/kaufman (3).png",
        title: "Kaufmann 03",
        description: "Aplicación visual para presencia de marca.",
      },
      {
        image: "/img/services/KAUFMAN/kaufman (4).png",
        title: "Kaufmann 04",
        description: "Cierre visual y refuerzo de experiencia de campaña.",
      },
      {
        image: "/img/services/KAUFMAN/kaufman (5).png",
        title: "Kaufmann 04",
        description: "Cierre visual y refuerzo de experiencia de campaña.",
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
        title: "Latam 01",
        description: "Aplicación de piezas gráficas en entorno comercial.",
      },
      {
        image: "/img/services/LATAM/latam (2).png",
        title: "Latam 02",
        description: "Refuerzo visual de marca en espacios de atención.",
      },
      {
        image: "/img/services/LATAM/latam (3).png",
        title: "Latam 03",
        description: "Reajuste visual y mantención de presencia de marca.",
      },
      {
        image: "/img/services/LATAM/latam (4).png",
        title: "Latam 04",
        description: "Renovación de acabados e identidad visual.",
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
        title: "Mistral 01",
        description: "Aplicación visual para presencia de marca.",
      },
      {
        image: "/img/services/MISTRAL/MISTRAL (2).png",
        title: "Mistral 02",
        description: "Pieza gráfica aplicada a implementación comercial.",
      },
      {
        image: "/img/services/MISTRAL/MISTRAL (3).png",
        title: "Mistral 03",
        description: "Producción visual para espacio de marca.",
      },
      {
        image: "/img/services/MISTRAL/MISTRAL (4).png",
        title: "Mistral 04",
        description: "Soporte gráfico para comunicación visual.",
      },
      {
        image: "/img/services/MISTRAL/MISTRAL (5).png",
        title: "Mistral 05",
        description: "Cierre visual de implementación.",
      },
    ],
  },
  {
    brandName: "Santander",
    brandLogo: "/img/works/santa.png",
    description:
      "Activaciones de verano en Surf Festival, con desarrollo de stands en La Serena y Pichilemu, fabricación en MDF y madera tratada, full branding, volumétricos en acrílico, cortes CNC, aplicaciones en Neon Flex e intervención de escenarios y zonas de competencia e hidratación.",
    works: [
      {
        image: "/img/services/SANTANDER/santa (1).png",
        title: "Santander 01",
        description: "Aplicación gráfica en espacio comercial y comunicación visual.",
      },
      {
        image: "/img/services/SANTANDER/santa (2).png",
        title: "Santander 02",
        description: "Sistema visual para reforzar navegación y presencia de marca.",
      },
      {
        image: "/img/services/SANTANDER/santa (3).png",
        title: "Santander 03",
        description: "Elementos gráficos para destacar experiencia de cliente.",
      },
      {
        image: "/img/services/SANTANDER/santa (4).png",
        title: "Santander 04",
        description: "Producción e instalación de recursos visuales complementarios.",
      },
      {
        image: "/img/services/SANTANDER/santa (5).png",
        title: "Santander 05",
        description: "Despliegue visual para reforzar presencia de marca.",
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
        title: "Chevrolet 01",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/services/CHEVROLET/che (2).png",
        title: "Chevrolet 02",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
      {
        image: "/img/services/CHEVROLET/che (3).png",
        title: "Chevrolet 03",
        description: "Aplicaciones visuales en estructura y entorno de marca.",
      },
      {
        image: "/img/services/CHEVROLET/che (4).png",
        title: "Chevrolet 04",
        description: "Recursos gráficos para activación y experiencia.",
      },
      {
        image: "/img/services/CHEVROLET/che (5).png",
        title: "Chevrolet 05",
        description: "Elementos para reforzar presencia en evento.",
      },
    ],
  },
  {
    brandName: "Novovet",
    brandLogo: "/img/works/novovet.png",
    description:
      "Soluciones visuales para marca veterinaria, incluyendo aplicaciones gráficas, señalética, merchandising y soporte comercial.",
    works: genericWorks,
  },
  {
    brandName: "BOX",
    brandLogo: "/img/works/box.png",
    description:
      "Producción e implementación de piezas gráficas para presencia de marca, comunicación visual y soporte comercial.",
    works: [
      {
        image: "/img/services/BOX/BOX (1).png",
        title: "BOX 01",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/services/BOX/BOX (2).png",
        title: "BOX 02",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
      {
        image: "/img/services/BOX/BOX (3).png",
        title: "BOX 03",
        description: "Aplicaciones visuales en estructura y entorno de marca.",
      },
      {
        image: "/img/services/BOX/BOX (4).png",
        title: "BOX 04",
        description: "Recursos gráficos para activación y experiencia.",
      },
      {
        image: "/img/services/BOX/BOX (5).png",
        title: "BOX 05",
        description: "Elementos para reforzar presencia en evento.",
      },
    ],
  },
  {
    brandName: "ASI",
    brandLogo: "/img/works/asi.png",
    description:
      "Soluciones de impresión, instalación y comunicación visual para requerimientos corporativos.",
    works: [
      {
        image: "/img/services/ASI/ASI (1).png",
        title: "ASI 01",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/services/ASI/ASI (2).png",
        title: "ASI 02",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
      {
        image: "/img/services/ASI/ASI (3).png",
        title: "ASI 03",
        description: "Aplicaciones visuales en estructura y entorno de marca.",
      },
      {
        image: "/img/services/ASI/ASI (4).png",
        title: "ASI 04",
        description: "Recursos gráficos para activación y experiencia.",
      },
      {
        image: "/img/services/ASI/ASI (5).png",
        title: "ASI 05",
        description: "Elementos para reforzar presencia en evento.",
      },
    ],
  },
  {
    brandName: "Canada Dry",
    brandLogo: "/img/works/canada dry.png",
    description:
      "Producción de piezas gráficas y soportes visuales para activaciones, campañas y presencia de producto.",
    works: [
      {
        image: "/img/services/CANADA/CANADA (1).png",
        title: "Canada Dry 01",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/services/CANADA/CANADA (2).png",
        title: "Canada Dry 02",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
      {
        image: "/img/services/CANADA/CANADA (3).png",
        title: "Canada Dry 03",
        description: "Aplicaciones visuales en estructura y entorno de marca.",
      },
      {
        image: "/img/services/CANADA/CANADA (4).png",
        title: "Canada Dry 04",
        description: "Recursos gráficos para activación y experiencia.",
      },
      {
        image: "/img/services/CANADA/CANADA (5).png",
        title: "Canada Dry 05",
        description: "Elementos para reforzar presencia en evento.",
      },
    ],
  },
  {
    brandName: "Ford",
    brandLogo: "/img/works/ford.png",
    description:
      "Producción gráfica y elementos de apoyo visual para presencia de marca automotriz, eventos y espacios comerciales.",
    works: [
      {
        image: "/img/services/FORD/FORD (1).png",
        title: "Ford 01",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/services/FORD/FORD (2).png",
        title: "Ford 02",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
      {
        image: "/img/services/FORD/FORD (3).png",
        title: "Ford 03",
        description: "Aplicaciones visuales en estructura y entorno de marca.",
      },
      {
        image: "/img/services/FORD/FORD (4).png",
        title: "Ford 04",
        description: "Recursos gráficos para activación y experiencia.",
      },
      {
        image: "/img/services/FORD/FORD (5).png",
        title: "Ford 05",
        description: "Elementos para reforzar presencia en evento.",
      },
    ],
  },
  {
    brandName: "Kersting",
    brandLogo: "/img/works/kersting.png",
    description:
      "Desarrollo de elementos visuales para comunicación comercial, presencia corporativa y soporte de marca.",
    works: [
      {
        image: "/img/services/KERSTING/KERSTING (1).png",
        title: "KERSTING 01",
        description: "Montaje de material visual para campaña promocional.",
      },
      {
        image: "/img/services/KERSTING/KERSTING (2).png",
        title: "KERSTING 02",
        description: "Soportes para reforzar presencia visual en punto de venta.",
      },
      {
        image: "/img/services/KERSTING/KERSTING (3).png",
        title: "KERSTING 03",
        description: "Aplicaciones visuales en estructura y entorno de marca.",
      },
      {
        image: "/img/services/KERSTING/KERSTING (4).png",
        title: "KERSTING 04",
        description: "Recursos gráficos para activación y experiencia.",
      },
      {
        image: "/img/services/KERSTING/KERSTING (5).png",
        title: "KERSTING 05",
        description: "Elementos para reforzar presencia en evento.",
      },
    ],
  },
  {
    brandName: "Glam & Co",
    brandLogo: "/img/works/glam y co.png",
    description:
      "Implementaciones gráficas para espacios de atención, retail y comunicación visual de marca.",
    works: genericWorks,
  },
  {
    brandName: "Otros",
    brandLogo: "/img/works/otras.png",
    description:
      "Otros proyectos desarrollados para marcas, campañas, activaciones y soluciones gráficas especiales.",
    works: genericWorks,
  },
];

export default function BrandShowcase({
  onOpenBrandDetails,
}: BrandShowcaseProps) {
  return (
    <section
      id="brands"
      className="relative mx-auto flex h-full w-full max-w-[1460px] items-center px-4 sm:px-5 lg:px-6 2xl:max-w-[1520px] 2xl:px-8"
    >
      <div className="w-full -translate-y-2 sm:-translate-y-1 lg:-translate-y-3 xl:-translate-y-4">
        <motion.div
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-[760px] text-center xl:max-w-[800px] 2xl:max-w-[840px]"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 14, scale: 0.94 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="omnes-text inline-flex rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-white/78 backdrop-blur sm:text-[13px]"
          >
            Marcas
          </motion.div>

          <h2 className="omnes-title mt-3 overflow-hidden text-[clamp(2rem,3.4vw,3.8rem)] leading-[1.03] tracking-[-0.05em] text-white">
            <motion.span
              className="inline-block"
              initial={{ y: "115%", opacity: 0, filter: "blur(12px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.95,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Marcas que han confiado en Rubik
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.75,
              delay: 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="omnes-text mx-auto mt-3 max-w-[680px] text-[13px] leading-6 text-white/72 sm:text-[14px]"
          >
            Clientes, colaboraciones y proyectos desarrollados junto a marcas que
            buscan impacto visual real, producción cuidada y soluciones pensadas
            para destacar.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.985, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.75,
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mx-auto mt-4 max-w-[1380px] rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-[1px] shadow-[0_14px_34px_rgba(0,0,0,0.2)] xl:max-w-[1420px] 2xl:max-w-[1480px]"
        >
          <div className="relative overflow-hidden rounded-[21px] bg-[linear-gradient(180deg,#181028_0%,#120b20_45%,#0d0818_100%)] px-3 py-3 sm:px-3.5 sm:py-3.5 lg:px-4 lg:py-4">
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

            <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5 lg:grid-cols-7 lg:gap-2.5 xl:gap-3 2xl:gap-3.5">
              {brands.map((brand, index) => (
                <motion.button
                  key={brand.brandName}
                  type="button"
                  onClick={() => onOpenBrandDetails(brand)}
                  initial={{
                    opacity: 0,
                    y: 24,
                    scale: 0.94,
                    filter: "blur(10px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.65 + index * 0.035,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative min-h-[54px] overflow-hidden rounded-[13px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-[1px] text-left transition duration-300 hover:-translate-y-[2px] hover:border-white/[0.18] hover:shadow-[0_10px_20px_rgba(0,0,0,0.18)] focus:outline-none focus:ring-2 focus:ring-white/20 sm:min-h-[58px] lg:min-h-[62px] xl:min-h-[66px] 2xl:min-h-[72px]"
                  aria-label={`Ver detalles de ${brand.brandName}`}
                >
                  <div className="relative flex h-full min-h-[52px] items-center justify-center overflow-hidden rounded-[12px] bg-[linear-gradient(180deg,#0c0914_0%,#110d1b_40%,#151024_100%)] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-8px_20px_rgba(0,0,0,0.45)] transition duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-10px_24px_rgba(0,0,0,0.52),0_8px_18px_rgba(0,0,0,0.12)] sm:min-h-[56px] lg:min-h-[60px] xl:min-h-[64px] 2xl:min-h-[70px]">
                    <div className="pointer-events-none absolute inset-[5px] rounded-[10px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.005))]" />
                    <div className="pointer-events-none absolute inset-[2px] rounded-[12px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.028)_38%,rgba(255,255,255,0.012)_100%)] backdrop-blur-[3px]" />
                    <div className="pointer-events-none absolute inset-[2px] rounded-[12px] border border-white/[0.12]" />
                    <div className="pointer-events-none absolute inset-[5px] rounded-[9px] border border-white/[0.07]" />
                    <div className="pointer-events-none absolute inset-x-3 top-2 h-3 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.03))] blur-md opacity-70 transition duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-x-5 top-[8px] h-px bg-white/22 opacity-70" />
                    <div className="pointer-events-none absolute -left-[28%] top-[-12%] h-[140%] w-[34%] rotate-[18deg] bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_45%,rgba(255,255,255,0))] opacity-30 blur-md transition duration-300 group-hover:translate-x-2" />

                    <div className="relative h-[22px] w-[78%] max-w-[132px] sm:h-[24px] lg:h-[25px] xl:h-[27px] 2xl:h-[29px]">
                      <Image
                        src={brand.brandLogo || "/img/works/3.png"}
                        alt={brand.brandName}
                        fill
                        sizes="(max-width: 640px) 38vw, (max-width: 1024px) 22vw, 130px"
                        className="object-contain opacity-[0.96] drop-shadow-[0_1px_8px_rgba(255,255,255,0.08)] transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
                      />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
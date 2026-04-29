"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { SelectedBrand } from "@/app/page";

type BrandShowcaseProps = {
  onOpenBrandDetails: (brand: SelectedBrand) => void;
};

const genericWorks = [
  {
    image: "/img/services/MISTRAL/MISTRAL (1).png",
    title: "Implementación visual",
    description: "Aplicación de piezas gráficas, soportes y presencia de marca.",
  },
  {
    image: "/img/services/MISTRAL/MISTRAL (2).png",
    title: "Producción gráfica",
    description: "Desarrollo de elementos visuales para espacios y campañas.",
  },
  {
    image: "/img/services/MISTRAL/MISTRAL (3).png",
    title: "Montaje de marca",
    description: "Instalación y ajuste de piezas para comunicación visual.",
  },
  {
    image: "/img/services/MISTRAL/MISTRAL (4).png",
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
        image: "/img/services/COPEC/COPEC (4).jpg",
        title: "Copec 04",
        description: "Cierre visual y refuerzo de experiencia de campaña.",
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
        description: "Despliegue gráfico para reforzar storytelling de marca.",
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
      {
        image: "/img/services/KAUFMAN/kaufman (5).png",
        title: "Cierre de activación",
        description: "Terminaciones visuales y soporte de marca en montaje.",
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
        description: "Aplicación de elementos visuales en entorno institucional.",
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
  {
    brandName: "Pepsi",
    brandLogo: "/img/works/pepsi.png",
    description:
      "Producción visual para campañas, activaciones y presencia de marca en espacios comerciales.",
    works: genericWorks,
  },
  {
    brandName: "Santander",
    brandLogo: "/img/works/santa.png",
    description:
      "Activaciones de verano en Surf Festival, con desarrollo de stands en La Serena y Pichilemu, fabricación en MDF y madera tratada, full branding, volumétricos en acrílico, cortes CNC, aplicaciones en Neon Flex e intervención de escenarios y zonas de competencia e hidratación.",
    works: [
      {
        image: "/img/services/SANTANDER/santa (1).png",
        title: "Implementación sucursal",
        description: "Aplicación gráfica en espacio comercial y comunicación visual.",
      },
      {
        image: "/img/services/SANTANDER/santa (2).png",
        title: "Señalética corporativa",
        description: "Sistema visual para reforzar navegación y presencia de marca.",
      },
      {
        image: "/img/services/SANTANDER/santa (3).png",
        title: "Campaña interior",
        description: "Elementos gráficos para destacar promociones y experiencia de cliente.",
      },
      {
        image: "/img/services/SANTANDER/santa (4).png",
        title: "Piezas de apoyo",
        description: "Producción e instalación de recursos visuales complementarios.",
      },
      {
        image: "/img/services/SANTANDER/santa (5).png",
        title: "Activación de marca",
        description: "Despliegue visual para reforzar presencia y experiencia de campaña.",
      },
    ],
  },
  {
    brandName: "Kersting",
    brandLogo: "/img/works/kersting.png",
    description:
      "Desarrollo de elementos visuales para comunicación comercial, presencia corporativa y soporte de marca.",
    works: genericWorks,
  },
  {
    brandName: "Glam & Co",
    brandLogo: "/img/works/glam y co.png",
    description:
      "Implementaciones gráficas para espacios de atención, retail y comunicación visual de marca.",
    works: genericWorks,
  },
  {
    brandName: "Canada Dry",
    brandLogo: "/img/works/canada dry.png",
    description:
      "Producción de piezas gráficas y soportes visuales para activaciones, campañas y presencia de producto.",
    works: genericWorks,
  },
  {
    brandName: "ASI",
    brandLogo: "/img/works/asi.png",
    description:
      "Soluciones de impresión, instalación y comunicación visual para requerimientos corporativos.",
    works: genericWorks,
  },
  {
    brandName: "Complot",
    brandLogo: "/img/works/complot.png",
    description:
      "Colaboración en producción, activaciones y ejecución gráfica para campañas y experiencias de marca.",
    works: genericWorks,
  },
  {
    brandName: "Novovet",
    brandLogo: "/img/works/novovet.png",
    description:
      "Soluciones visuales para marca veterinaria, incluyendo aplicaciones gráficas, señalética, merchandising y soporte comercial.",
    works: genericWorks,
  },
  {
    brandName: "Ford",
    brandLogo: "/img/works/ford.png",
    description:
      "Producción gráfica y elementos de apoyo visual para presencia de marca automotriz, eventos y espacios comerciales.",
    works: genericWorks,
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
    ],
  },
  {
    brandName: "Otras",
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
      className="relative mx-auto flex h-full w-full max-w-[1320px] items-center px-4 sm:px-5 lg:px-6 2xl:max-w-[1380px] 2xl:px-8"
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
          className="relative mx-auto mt-4 max-w-[1180px] rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-[1px] shadow-[0_14px_34px_rgba(0,0,0,0.2)] xl:max-w-[1220px] 2xl:max-w-[1280px]"
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

            <div className="relative grid grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3">
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
                  className="group relative min-h-[58px] overflow-hidden rounded-[14px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-[1px] text-left transition duration-300 hover:-translate-y-[2px] hover:border-white/[0.18] hover:shadow-[0_10px_20px_rgba(0,0,0,0.18)] focus:outline-none focus:ring-2 focus:ring-white/20 sm:min-h-[64px] lg:min-h-[70px] xl:min-h-[76px] 2xl:min-h-[82px]"
                  aria-label={`Ver detalles de ${brand.brandName}`}
                >
                  <div className="relative flex h-full min-h-[56px] items-center justify-center overflow-hidden rounded-[13px] bg-[linear-gradient(180deg,#0c0914_0%,#110d1b_40%,#151024_100%)] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-8px_20px_rgba(0,0,0,0.45)] transition duration-300 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-10px_24px_rgba(0,0,0,0.52),0_8px_18px_rgba(0,0,0,0.12)] sm:min-h-[62px] lg:min-h-[68px] xl:min-h-[74px] 2xl:min-h-[80px]">
                    <div className="pointer-events-none absolute inset-[5px] rounded-[10px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.005))]" />
                    <div className="pointer-events-none absolute inset-[2px] rounded-[12px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.028)_38%,rgba(255,255,255,0.012)_100%)] backdrop-blur-[3px]" />
                    <div className="pointer-events-none absolute inset-[2px] rounded-[12px] border border-white/[0.12]" />
                    <div className="pointer-events-none absolute inset-[5px] rounded-[9px] border border-white/[0.07]" />
                    <div className="pointer-events-none absolute inset-x-3 top-2 h-3 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.03))] blur-md opacity-70 transition duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-x-5 top-[8px] h-px bg-white/22 opacity-70" />
                    <div className="pointer-events-none absolute -left-[28%] top-[-12%] h-[140%] w-[34%] rotate-[18deg] bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_45%,rgba(255,255,255,0))] opacity-30 blur-md transition duration-300 group-hover:translate-x-2" />

                    <div className="relative h-[24px] w-[72%] max-w-[150px] sm:h-[26px] lg:h-[28px] xl:h-[30px] 2xl:h-[32px]">
                      <Image
                        src={brand.brandLogo || "/img/works/3.png"}
                        alt={brand.brandName}
                        fill
                        sizes="(max-width: 640px) 20vw, (max-width: 1024px) 18vw, 160px"
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
const neonGallery = Array.from(
  { length: 9 },
  (_, i) => `/img/neon/neon (${i + 1}).jpg`
);

const standsGallery = Array.from(
  { length: 19 },
  (_, i) => `/img/stands/stand (${i + 1}).jpg`
);

const impresionGallery = Array.from(
  { length: 12 },
  (_, i) => `/img/impresion/impre (${i + 1}).jpg`
);

const volumetricasGallery = Array.from(
  { length: 7 },
  (_, i) => `/img/Volumetricos/volu (${i + 1}).jpg`
);

const otrosPublicitariosGallery = [
  "/img/otros/otros (1).jpeg",
  "/img/otros/otros (2).jpeg",
  "/img/otros/otros (3).jpeg",
];

const otrosActivacionesGallery = [
  "/img/otros/otros (4).jpeg",
  "/img/otros/otros (5).jpeg",
  "/img/otros/otros (6).jpeg",
];

export const projects = [
  {
    id: 1,
    slug: "neon",
    title: "Neón Flex",
    subtitle: "Iluminación que transforma espacios y marcas.",
    description:
      "Desarrollamos soluciones en neón flex pensadas para destacar visualmente interiores, vitrinas, puntos de venta y espacios comerciales.",
    longDescription:
      "Cada pieza se proyecta según la identidad de la marca, buscando alto impacto visual, buena lectura y una presencia moderna que aporta carácter al entorno.",
    image: neonGallery[0],
    tag: "Servicio 01",
    gallery: neonGallery,
  },
  {
    id: 2,
    slug: "stands",
    title: "Stands",
    subtitle: "Espacios diseñados para exhibir y conectar.",
    description:
      "Creamos stands publicitarios que integran estructura, gráfica y funcionalidad para potenciar la presencia de marca en ferias, eventos y activaciones.",
    longDescription:
      "Diseñamos cada propuesta según el objetivo comercial, el espacio disponible y la experiencia que se busca generar, cuidando tanto el impacto visual como la correcta exhibición.",
    image: standsGallery[0],
    tag: "Servicio 02",
    gallery: standsGallery,
  },
  {
    id: 3,
    slug: "volumetricas",
    title: "Volumétricas",
    subtitle: "Relieve, presencia e identidad visual.",
    description:
      "Desarrollamos letras y elementos volumétricos pensados para reforzar la presencia de marca en espacios comerciales, corporativos y publicitarios.",
    longDescription:
      "Cada pieza se fabrica considerando proporción, materialidad, terminaciones y tipo de montaje, logrando soluciones visuales con mayor presencia, mejor lectura y una imagen más sólida para cada proyecto.",
    image: volumetricasGallery[0] ?? "/img/services/vercel-c.svg",
    tag: "Servicio 03",
    gallery: volumetricasGallery.length
      ? volumetricasGallery
      : [
          "/img/services/vercel-c.svg",
          "/img/services/vercel-c.svg",
          "/img/services/vercel-c.svg",
        ],
  },
  {
    id: 4,
    slug: "impresion",
    title: "Impresión",
    subtitle: "Gráfica precisa para cada necesidad.",
    description:
      "Realizamos impresiones digitales en alta resolución sobre adhesivos, tela PVC y otros sustratos, adaptando cada material al uso, formato y objetivo del proyecto.",
    longDescription:
      "Trabajamos soluciones gráficas pensadas para comunicar con claridad, optimizar la aplicación en distintos soportes y responder de forma correcta a las necesidades de cada cliente.",
    image: impresionGallery[0],
    tag: "Servicio 04",
    gallery: impresionGallery,
  },
  {
    id: 5,
    slug: "otros",
    tag: "Servicio 05",
    title: "Otros",
    subtitle: "Soluciones complementarias con distintas líneas de trabajo.",
    description:
      "Unificamos aquí desarrollos especiales, activaciones e implementaciones publicitarias que requieren una lectura más flexible.",
    longDescription:
      "Dentro de esta categoría agrupamos proyectos complementarios que se dividen en dos líneas: proyectos publicitarios y activaciones de marca, cada una con su propia galería y enfoque visual.",
    image: otrosPublicitariosGallery[0],
    gallery: otrosPublicitariosGallery,
    tabs: [
      {
        id: "publicitarios",
        label: "Proyectos Publicitarios",
        description:
          "Piezas especiales, soportes, recursos visuales y desarrollos publicitarios a medida.",
        gallery: otrosPublicitariosGallery,
      },
      {
        id: "activaciones",
        label: "Activaciones de Marca",
        description:
          "Implementaciones orientadas a visibilidad, interacción y experiencia de marca.",
        gallery: otrosActivacionesGallery,
      },
    ],
  },
];
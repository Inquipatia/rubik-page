const neonGallery = [
  "/img/neon/neon (1).png",
  "/img/neon/neon (2).jpg",
  "/img/neon/neon (3).jpg",
  "/img/neon/neon (4).jpg",
  "/img/neon/neon (5).jpg",
  "/img/neon/neon (6).jpg",
  "/img/neon/neon (7).jpg",
  "/img/neon/neon (8).jpg",
];

const standsGallery = [
  "/img/stands/stand (1).png",
  "/img/stands/stand (2).jpg",
  "/img/stands/stand (3).jpg",
  "/img/stands/stand (4).jpg",
  "/img/stands/stand (4).png",
  "/img/stands/stand (5).jpg",
  "/img/stands/stand (5).png",
  "/img/stands/stand (6).jpg",
  "/img/stands/stand (7).jpg",
  "/img/stands/stand (8).jpg",
  "/img/stands/stand (9).jpg",
  "/img/stands/stand (10).jpg",
  "/img/stands/stand (11).jpg",
  "/img/stands/stand (12).jpg",
  "/img/stands/stand (13).jpg",
  "/img/stands/stand (14).jpg",
  "/img/stands/stand (15).jpg",
];

const impresionGallery = [
  "/img/impresion/impre (1).jpg",
  "/img/impresion/impre (2).jpg",
  "/img/impresion/impre (3).jpg",
  "/img/impresion/impre (4).jpg",
];

const volumetricasGallery = [
  "/img/Volumetricos/volu (1).jpg",
  "/img/Volumetricos/volu (2).jpg",
  "/img/Volumetricos/volu (3).jpg",
  "/img/Volumetricos/volu (4).jpg",
  "/img/Volumetricos/volu (5).jpg",
];

const otrosPublicitariosGallery = [
  "/img/otros/otros (1).jpeg",
  "/img/otros/otros (2).jpeg",
  "/img/otros/otros (3).jpeg",
];

const otrosActivacionesGallery = [
  "/img/otros/otros (1).jpeg",
  "/img/otros/otros (2).jpeg",
  "/img/otros/otros (3).jpeg",
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
    image: volumetricasGallery[0],
    tag: "Servicio 03",
    gallery: volumetricasGallery,
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
    tag: "SERVICIO 05",
    title: "Otros",
    subtitle: "Soluciones complementarias con distintas líneas de trabajo.",
    description:
      "Selecciona una línea dentro de Otros para revisar proyectos específicos y su enfoque visual.",
    longDescription:
      "Selecciona una línea dentro de Otros para revisar proyectos específicos y su enfoque visual.",
    image: otrosPublicitariosGallery[0],
    gallery: otrosPublicitariosGallery,
    variants: [
      {
        key: "proyectos-publicitarios",
        label: "Proyectos publicitarios",
        tag: "OTROS 01",
        title: "Proyectos publicitarios",
        subtitle: "Aplicaciones visuales para campañas y presencia de marca.",
        description:
          "Desarrollamos piezas y soportes visuales orientados a campañas, exhibición y comunicación de marca.",
        longDescription:
          "Línea enfocada en campañas visuales, soportes promocionales, implementación gráfica y piezas complementarias para reforzar presencia de marca en distintos puntos de contacto.",
        image: otrosPublicitariosGallery[0],
        gallery: otrosPublicitariosGallery,
      },
      {
        key: "activacion-de-marca",
        label: "Activación de marca",
        tag: "OTROS 02",
        title: "Activación de marca",
        subtitle:
          "Experiencias visuales para conectar con audiencia y espacio.",
        description:
          "Creamos recursos visuales y montajes orientados a activaciones, interacción y experiencia de marca.",
        longDescription:
          "Línea pensada para activaciones de marca, experiencias promocionales, intervenciones en espacio y recursos de apoyo para eventos y puntos de contacto de alto impacto.",
        image: otrosActivacionesGallery[0],
        gallery: otrosActivacionesGallery,
      },
    ],
  },
];
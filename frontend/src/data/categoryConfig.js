export const CATEGORY_CONFIG = {
  'motos-nuevas': {
    slug: 'motos-nuevas',
    label: 'Motos nuevas',
    shortLabel: 'Motos nuevas',
    title: 'Motos nuevas con entrega y atención directa',
    intro:
      'Una selección de motos nuevas pensada para quien quiere estrenar con acompañamiento real, revisión previa y gestión ágil.',
    description:
      'Aquí puedes enseñar motos nuevas con una presentación más clara: ficha cuidada, detalles de equipamiento, financiación y stock visible sin mezclarlo con el resto del catálogo.',
    highlights: ['Entrega rápida', 'Asesoramiento en compra', 'Modelos listos para matricular'],
    theme: 'theme-moto',
    image:
      '/kawa.jpg',
    eyebrow: 'Catálogo de motos nuevas',
  },
  'coches-ocasion': {
    slug: 'coches-ocasion',
    label: 'Coches ocasión',
    shortLabel: 'Coches ocasión',
    title: 'Coches de ocasión revisados y listos para enseñar',
    intro:
      'El catálogo principal para turismos y compactos de ocasión, con filtros claros, precios visibles y un enfoque más comercial.',
    description:
      'Esta página está pensada para enseñar los coches de ocasión con una cabecera limpia, argumentos de confianza y un catálogo que prioriza el vehículo antes que el adorno.',
    highlights: ['Stock revisado', 'Fotos y detalle del vehículo', 'Atención personalizada'],
    theme: 'theme-car',
    image:
      '/bmw.jpg',
    eyebrow: 'Catálogo de coches de ocasión',
  },
  aixam: {
    slug: 'aixam',
    label: 'Cuadriciclos Aixam',
    shortLabel: 'Aixam',
    title: 'Cuadriciclos Aixam con espacio propio dentro de la web',
    intro:
      'Una zona dedicada a AIXAM para enseñarla como categoría propia: movilidad urbana, conducción accesible y presencia de marca.',
    description:
      'Aquí puedes separar los cuadriciclos Aixam del resto del stock, explicar mejor su propuesta y mostrar el catálogo con filtros sin que se pierda entre coches y motos.',
    highlights: ['Especialización AIXAM', 'Movilidad urbana', 'Catálogo específico'],
    theme: 'theme-aixam',
    image:
      '/aixam.jpg',
    eyebrow: 'Catálogo AIXAM',
  },
};

export const CATEGORY_OPTIONS = Object.values(CATEGORY_CONFIG).map((item) => ({
  value: item.slug,
  label: item.label,
}));

export function getCategoryConfig(slug) {
  return CATEGORY_CONFIG[slug] || CATEGORY_CONFIG['coches-ocasion'];
}

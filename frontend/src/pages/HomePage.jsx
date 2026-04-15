import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { CATEGORY_CONFIG } from '../data/categoryConfig';

const HOME_BANDS = [
  {
    ...CATEGORY_CONFIG['motos-nuevas'],
    path: '/motos-nuevas',
    panelText: 'Motos nuevas, entrega rápida y catálogo propio.',
  },
  {
    ...CATEGORY_CONFIG['coches-ocasion'],
    path: '/coches-ocasion',
    panelText: 'Coches de ocasión revisados con stock claro y filtros.',
  },
  {
    ...CATEGORY_CONFIG.aixam,
    path: '/cuadriciclos-aixam',
    panelText: 'Cuadriciclos Aixam con espacio propio y movilidad urbana.',
  },
];

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    apiFetch('/api/bikes').then(setVehicles).catch(() => setVehicles([]));
  }, []);

  const counters = useMemo(
    () =>
      HOME_BANDS.reduce((acc, item) => {
        acc[item.slug] = vehicles.filter((vehicle) => vehicle.category === item.slug).length;
        return acc;
      }, {}),
    [vehicles]
  );

  return (
    <section className="home-selector-page home-selector-page-full">
      <div className="home-selector-grid home-selector-grid-full">
        {HOME_BANDS.map((item) => (
          <Link
            to={item.path}
            key={item.slug}
            className={`home-category-band home-category-band-full ${item.theme}`}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(7, 12, 20, 0.12) 0%, rgba(7, 12, 20, 0.82) 100%), url('${item.image}')`,
            }}
          >
            <div className="home-category-band-inner">
              <div className="home-category-copy">
                <span className="home-category-kicker">{item.shortLabel}</span>
                <h2>{item.label}</h2>
                <p>{item.panelText}</p>
              </div>

              <div className="home-category-meta">
                <span>{counters[item.slug] || 0} anuncios</span>
                <strong>Entrar</strong>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
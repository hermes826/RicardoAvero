import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import VehicleCard from '../components/VehicleCard';
import { apiFetch } from '../services/api';

const BRANDS = ['Aixam', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Mini', 'Porsche', 'Seat'];

const HIGHLIGHTS = [
  {
    title: 'Stock revisado',
    text: 'Vehículos seleccionados para que veas rápido lo que realmente merece la pena.',
  },
  {
    title: 'Trato directo',
    text: 'Sin rodeos ni lenguaje de plantilla. Te enseñamos el coche, su estado y sus detalles.',
  },
  {
    title: 'Movilidad urbana y ocasión',
    text: 'Compactos, ocasión y espacio para destacar soluciones Aixam dentro del catálogo.',
  },
];

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    apiFetch('/api/bikes').then(setVehicles).catch(() => setVehicles([]));
    apiFetch('/api/contact').then(setContact).catch(() => setContact(null));
  }, []);

  const featured = useMemo(() => {
    const items = vehicles.filter((item) => item.featured);
    return (items.length ? items : vehicles).slice(0, 6);
  }, [vehicles]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container hero-content hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Ricardo Avero · La Laguna</p>
            <h1>Vehículos de ocasión.</h1>
            <p className="hero-description">
              Encuentra stock disponible, pide información sin complicaciones y descubre un espacio reservado para movilidad urbana y opciones AIXAM.
            </p>



            <div className="hero-cta-row">
              <Link className="btn btn-primary" to="/vehiculos">Ver catálogo</Link>
              <Link className="btn btn-outline-light" to="/contacto">Contáctanos</Link>
            </div>
          </div>

          <HeroSearch vehicles={vehicles} />
        </div>
      </section>

      <section className="trust-strip-section">
        <div className="container trust-strip-grid">
          {HIGHLIGHTS.map((item) => (
            <article className="trust-strip-card" key={item.title}>
              <span className="trust-strip-dot" aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

          <p><p></p></p>

      <section className="aixam-section">
        <div className="container aixam-grid">
          <div className="aixam-card aixam-card-dark">

            <h2>Concesionario especializado en cuadriciclos Aixam.</h2>
            <p>
              Si quieres destacar AIXAM dentro de la web, este bloque ya deja preparada una presencia propia para la marca dentro de la portada.
            </p>
          </div>
          <div className="aixam-card aixam-card-light">
            <p className="aixam-mini-title">Qué transmite ahora</p>
            <ul>
              <li>Más identidad comercial y menos diseño de muestra.</li>
              <li>Mejor jerarquía visual para el catálogo.</li>
              <li>Más espacio para enseñar marcas y stock real.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-dark featured-section">
        <div className="container section-header-row">
          <div>
            <span className="eyebrow">Stock destacado</span>
            <h2>Vehículos listos para enseñar y entregar</h2>
          </div>
          <Link to="/vehiculos" className="btn btn-primary">Ver catálogo completo</Link>
        </div>
        <div className="container vehicle-grid">
          {featured.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
        </div>
      </section>

      <section className="section-light">
        <div className="container info-grid">
          <div className="info-card info-card-emphasis">
            <span className="eyebrow">Por qué funciona mejor</span>
            <h3>Más presencia de marca</h3>
            <p>Ahora la portada ya no parece una plantilla genérica: tiene una cabecera más sobria, mejor composición y un mensaje más comercial.</p>
          </div>
          <div className="info-card">
            <h3>Atención cercana</h3>
            <p>{contact?.address || 'Estamos en La Laguna para enseñarte el vehículo en persona y atenderte con cita o visita directa.'}</p>
          </div>
          <div className="info-card">
            <h3>Compra con claridad</h3>
            <p>Precio visible, información compacta y un catálogo que prioriza el vehículo antes que el adorno.</p>
          </div>
        </div>
      </section>
    </>
  );
}

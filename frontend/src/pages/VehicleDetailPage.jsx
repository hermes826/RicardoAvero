import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch, buildAssetUrl } from '../services/api';
import { getCategoryConfig } from '../data/categoryConfig';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [contact, setContact] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch(`/api/bikes/${id}`).catch(() => null),
      apiFetch('/api/contact').catch(() => null),
    ]).then(([vehicleData, contactData]) => {
      setVehicle(vehicleData);
      setContact(contactData);
      setActiveImage(buildAssetUrl(vehicleData?.images?.[0]) || '');
    });
  }, [id]);

  const category = useMemo(() => vehicle?.category ? getCategoryConfig(vehicle.category) : null, [vehicle]);
  const backLink = category?.slug === 'aixam' ? '/cuadriciclos-aixam' : category?.slug ? `/${category.slug}` : '/vehiculos';

  if (!vehicle) {
    return <section className="section-light"><div className="container"><p>Cargando vehículo...</p></div></section>;
  }

  return (
    <section className="detail-page detail-page-clean">
      <div className="container detail-grid">
        <div>
          <div className="detail-main-image-wrap">
            <img src={activeImage || 'https://placehold.co/1000x700?text=Vehiculo'} alt={vehicle.title} className="detail-main-image" />
          </div>
          <div className="thumb-grid">
            {(vehicle.images || []).map((image) => {
              const url = buildAssetUrl(image);
              return <img key={url} src={url} alt={vehicle.title} onClick={() => setActiveImage(url)} className="detail-thumb" />;
            })}
          </div>
        </div>

        <div className="detail-card detail-card-clean">
          <Link className="detail-back-link" to={backLink}>← Volver a {category?.label || 'catálogo'}</Link>
          <span className="eyebrow">{category?.label || 'Vehículo'}</span>
          <h1>{vehicle.title}</h1>
          <div className="detail-price">{Number(vehicle.price || 0).toLocaleString('es-ES')} €</div>
          <p>{vehicle.description}</p>

          <div className="spec-grid">
            <div><strong>Marca</strong><span>{vehicle.brand || '-'}</span></div>
            <div><strong>Modelo</strong><span>{vehicle.model || '-'}</span></div>
            <div><strong>Año</strong><span>{vehicle.year || '-'}</span></div>
            <div><strong>Kilómetros</strong><span>{Number(vehicle.kilometers || 0).toLocaleString('es-ES')} km</span></div>
            <div><strong>Estado</strong><span>{vehicle.status || 'Disponible'}</span></div>
            <div><strong>Sección</strong><span>{category?.label || 'General'}</span></div>
          </div>

          <div className="detail-actions">
            <Link className="btn btn-primary" to="/contacto">Solicitar información</Link>
            <a className="btn btn-dark" href={`tel:${(contact?.phone || '676606948').replace(/\s+/g, '')}`}>Llamar ahora</a>
          </div>
        </div>
      </div>
    </section>
  );
}

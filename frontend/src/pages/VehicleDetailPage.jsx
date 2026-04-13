import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch, buildAssetUrl } from '../services/api';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    apiFetch(`/api/bikes/${id}`).then((data) => {
      setVehicle(data);
      setActiveImage(buildAssetUrl(data.images?.[0]) || '');
    }).catch(() => setVehicle(null));
  }, [id]);

  if (!vehicle) {
    return <section className="section-dark"><div className="container"><p>Cargando vehículo...</p></div></section>;
  }

  return (
    <section className="detail-page">
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

        <div className="detail-card">
          <span className="eyebrow">{vehicle.condition || 'Ocasión'}</span>
          <h1>{vehicle.title}</h1>
          <div className="detail-price">{Number(vehicle.price || 0).toLocaleString('es-ES')} €</div>
          <p>{vehicle.description}</p>

          <div className="spec-grid">
            <div><strong>Marca</strong><span>{vehicle.brand || '-'}</span></div>
            <div><strong>Modelo</strong><span>{vehicle.model || '-'}</span></div>
            <div><strong>Año</strong><span>{vehicle.year || '-'}</span></div>
            <div><strong>Kilómetros</strong><span>{vehicle.kilometers || 0} km</span></div>
            <div><strong>Estado</strong><span>{vehicle.status || 'Disponible'}</span></div>
          </div>

          <div className="detail-actions">
            <Link className="btn btn-primary" to="/contacto">Solicitar información</Link>
            <a className="btn btn-dark" href="tel:676606948">Llamar ahora</a>
          </div>
        </div>
      </div>
    </section>
  );
}

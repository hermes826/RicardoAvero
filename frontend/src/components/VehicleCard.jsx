import { Link } from 'react-router-dom';
import { buildAssetUrl } from '../services/api';
import { getCategoryConfig } from '../data/categoryConfig';

const statusLabel = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  reservada: 'Reservada',
  vendida: 'Vendida',
  vendido: 'Vendido',
};

const conditionLabel = {
  nuevo: 'Nuevo',
  km0: 'Km 0',
  ocasion: 'Ocasión',
};

export default function VehicleCard({ vehicle }) {
  const image = buildAssetUrl(vehicle.images?.[0]) || 'https://placehold.co/800x500?text=Vehiculo';
  const category = vehicle.category ? getCategoryConfig(vehicle.category) : null;

  return (
    <article className="vehicle-card">
      <div className="vehicle-card-media">
        <img src={image} alt={vehicle.title} className="vehicle-card-image" />
        <div className="vehicle-card-topline">
          <span className="vehicle-chip">{conditionLabel[vehicle.condition] || 'Ocasión'}</span>
          <span className={`vehicle-status vehicle-status-${vehicle.status || 'disponible'}`}>
            {statusLabel[vehicle.status] || 'Disponible'}
          </span>
        </div>
      </div>

      <div className="vehicle-card-body">
        <p className="vehicle-card-brand">{category?.shortLabel || vehicle.brand || 'Vehículo'}</p>
        <h3>{vehicle.title}</h3>
        <div className="vehicle-card-meta">
          <span>{vehicle.year || '---'}</span>
          <span>{Number(vehicle.kilometers || 0).toLocaleString('es-ES')} km</span>
          <span>{vehicle.model || 'Stock disponible'}</span>
        </div>
        <div className="vehicle-card-footer">
          <div>
            <span className="vehicle-card-price-label">Precio</span>
            <strong>{Number(vehicle.price || 0).toLocaleString('es-ES')} €</strong>
          </div>
          <Link to={`/vehiculos/${vehicle.id}`} className="btn btn-primary btn-sm">Ver ficha</Link>
        </div>
      </div>
    </article>
  );
}

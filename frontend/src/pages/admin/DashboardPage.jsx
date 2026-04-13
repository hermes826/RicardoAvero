import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, buildAssetUrl } from '../../services/api';

export default function DashboardPage() {
  const { authHeaders } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  async function loadVehicles() {
    try {
      const data = await apiFetch('/api/bikes', { headers: authHeaders });
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('¿Seguro que quieres eliminar este vehículo?')) return;
    try {
      await apiFetch(`/api/bikes/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      await loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-heading-row">
        <div>
          <h1>Vehículos</h1>
          <p>Gestiona el catálogo desde aquí.</p>
        </div>
        <Link to="/admin/vehiculos/nuevo" className="btn btn-primary">Añadir vehículo</Link>
      </div>

      {error && <p className="status-message">{error}</p>}

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Marca</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td><img className="admin-thumb" src={buildAssetUrl(vehicle.images?.[0]) || 'https://placehold.co/100x70'} alt={vehicle.title} /></td>
                <td>{vehicle.title}</td>
                <td>{Number(vehicle.price || 0).toLocaleString('es-ES')} €</td>
                <td>{vehicle.brand}</td>
                <td>{vehicle.status || 'Disponible'}</td>
                <td className="admin-actions-cell">
                  <Link className="btn btn-sm btn-dark" to={`/admin/vehiculos/${vehicle.id}`}>Editar</Link>
                  <button className="btn btn-sm btn-primary" onClick={() => handleDelete(vehicle.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

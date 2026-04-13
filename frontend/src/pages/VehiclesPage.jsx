import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import { apiFetch } from '../services/api';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    maxKm: searchParams.get('maxKm') || '',
  };

  useEffect(() => {
    apiFetch('/api/bikes').then((data) => {
      setVehicles(data);
      setLoading(false);
    }).catch(() => {
      setVehicles([]);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => vehicles.filter((item) => {
    if (filters.brand && item.brand !== filters.brand) return false;
    if (filters.model && item.model !== filters.model) return false;
    if (filters.maxPrice && Number(item.price || 0) > Number(filters.maxPrice)) return false;
    if (filters.maxKm && Number(item.kilometers || 0) > Number(filters.maxKm)) return false;
    return true;
  }), [vehicles, filters]);

  const brands = [...new Set(vehicles.map((v) => v.brand).filter(Boolean))];
  const models = [...new Set(vehicles.map((v) => v.model).filter(Boolean))];

  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next);
  }

  return (
    <section className="catalog-page">
      <div className="container">
        <div className="section-header catalog-header-card">
          <span className="eyebrow">Catálogo</span>
          <h1>Encuentra tu vehículo sin perderte en una plantilla fría.</h1>
          <p>Filtra por marca, modelo, precio o kilómetros y revisa el stock disponible con una vista más clara.</p>
        </div>

        <div className="catalog-layout">
          <aside className="filters-card">
            <h3>Filtrar stock</h3>
            <select value={filters.brand} onChange={(e) => updateFilter('brand', e.target.value)}>
              <option value="">Todas las marcas</option>
              {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
            </select>
            <select value={filters.model} onChange={(e) => updateFilter('model', e.target.value)}>
              <option value="">Todos los modelos</option>
              {models.map((model) => <option key={model} value={model}>{model}</option>)}
            </select>
            <input type="number" placeholder="Precio máximo" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} />
            <input type="number" placeholder="Kilómetros máximos" value={filters.maxKm} onChange={(e) => updateFilter('maxKm', e.target.value)} />
            <button className="btn btn-dark" onClick={() => setSearchParams({})}>Limpiar filtros</button>
          </aside>

          <div>
            <div className="results-bar">{loading ? 'Cargando vehículos...' : `${filtered.length} vehículos encontrados`}</div>
            <div className="vehicle-grid">
              {filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

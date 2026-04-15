import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import { apiFetch } from '../services/api';
import { CATEGORY_CONFIG, getCategoryConfig } from '../data/categoryConfig';

function CategoryFilters({ vehicles, filters, updateFilter, clearFilters }) {
  const brands = [...new Set(vehicles.map((v) => v.brand).filter(Boolean))];
  const models = [...new Set(vehicles.map((v) => v.model).filter(Boolean))];

  return (
    <aside className="filters-card category-filters-card">
      <h3>Filtrar catálogo</h3>
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
      <button className="btn btn-dark" onClick={clearFilters}>Limpiar filtros</button>
    </aside>
  );
}

export default function CategoryPage({ categorySlug }) {
  const fixedCategory = categorySlug || '';
  const category = fixedCategory ? getCategoryConfig(fixedCategory) : null;
  const [vehicles, setVehicles] = useState([]);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    maxKm: searchParams.get('maxKm') || '',
  };

  useEffect(() => {
    const query = fixedCategory ? `/api/bikes?category=${fixedCategory}` : '/api/bikes';
    Promise.all([
      apiFetch(query).catch(() => []),
      apiFetch('/api/contact').catch(() => null),
    ]).then(([vehiclesData, contactData]) => {
      setVehicles(vehiclesData);
      setContact(contactData);
      setLoading(false);
    });
  }, [fixedCategory]);

  const filtered = useMemo(() => vehicles.filter((item) => {
    if (filters.brand && item.brand !== filters.brand) return false;
    if (filters.model && item.model !== filters.model) return false;
    if (filters.maxPrice && Number(item.price || 0) > Number(filters.maxPrice)) return false;
    if (filters.maxKm && Number(item.kilometers || 0) > Number(filters.maxKm)) return false;
    return true;
  }), [vehicles, filters]);

  const featured = useMemo(() => filtered.filter((item) => item.featured).slice(0, 3), [filtered]);

  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next);
  }

  function clearFilters() {
    setSearchParams({});
  }

  const headerTitle = category?.title || 'Todo el catálogo';
  const headerText = category?.description || 'Todo el stock disponible con filtros claros y una presentación más ordenada.';
  const eyebrow = category?.eyebrow || 'Catálogo completo';
  const heroImage = category?.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80';

  return (
    <section className="category-page">
      <div className={`category-hero ${category?.theme || 'theme-car'}`}>
        <div className="container category-hero-grid">
          <div className="category-hero-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{headerTitle}</h1>
            <p>{headerText}</p>
            {category && (
              <div className="category-highlight-list">
                {category.highlights.map((item) => <span key={item}>{item}</span>)}
              </div>
            )}
            <div className="category-hero-actions">
              <a className="btn btn-primary" href={`tel:${(contact?.phone || '676606948').replace(/\s+/g, '')}`}>Llamar</a>
              <Link className="btn btn-dark" to="/contacto">Pedir información</Link>
            </div>
          </div>
          <div className="category-hero-media">
            <img src={heroImage} alt={headerTitle} />
          </div>
        </div>
      </div>

      <div className="container category-summary-grid">
        <article className="summary-card">
          <span className="summary-label">Vehículos publicados</span>
          <strong>{vehicles.length}</strong>
          <p>Stock visible en esta sección para enseñar solo lo que corresponde a esta página.</p>
        </article>
        <article className="summary-card">
          <span className="summary-label">Destacados</span>
          <strong>{featured.length}</strong>
          <p>Unidades marcadas para portada o para dar prioridad visual dentro del catálogo.</p>
        </article>
        <article className="summary-card">
          <span className="summary-label">Atención</span>
          <strong>{contact?.phone || '676 60 69 48'}</strong>
          <p>{contact?.address || 'La Laguna, Tenerife'}</p>
        </article>
      </div>

      <div className="container catalog-layout category-catalog-layout">
        <CategoryFilters vehicles={vehicles} filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} />

        <div>
          <div className="catalog-header-card compact-header-card">
            <span className="eyebrow">{category?.label || 'Todo el catálogo'}</span>
            <h2>Catálogo filtrado</h2>
            <p>{loading ? 'Cargando vehículos...' : `${filtered.length} vehículo(s) encontrados`}</p>
          </div>

          {filtered.length === 0 && !loading ? (
            <div className="empty-catalog-card">
              <h3>Aún no hay anuncios en esta sección</h3>
              <p>Desde el panel de admin ya puedes elegir en qué página se publica cada anuncio.</p>
            </div>
          ) : (
            <div className="vehicle-grid">
              {filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

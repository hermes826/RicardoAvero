import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSearch({ vehicles = [] }) {
  const navigate = useNavigate();
  const brands = useMemo(() => [...new Set(vehicles.map((v) => v.brand).filter(Boolean))], [vehicles]);
  const models = useMemo(() => [...new Set(vehicles.map((v) => v.model).filter(Boolean))], [vehicles]);
  const prices = vehicles.map((v) => Number(v.price || 0)).filter(Boolean);
  const kms = vehicles.map((v) => Number(v.kilometers || 0)).filter((v) => v >= 0);

  const maxCatalogPrice = prices.length ? Math.max(...prices) : 60000;
  const maxCatalogKm = kms.length ? Math.max(...kms) : 150000;
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const minKm = kms.length ? Math.min(...kms) : 0;

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [maxPrice, setMaxPrice] = useState(maxCatalogPrice);
  const [maxKm, setMaxKm] = useState(maxCatalogKm);

  function submit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (model) params.set('model', model);
    if (maxPrice) params.set('maxPrice', String(maxPrice));
    if (maxKm) params.set('maxKm', String(maxKm));
    navigate(`/vehiculos?${params.toString()}`);
  }

  return (
    <form className="hero-search-card" onSubmit={submit}>
      <div className="hero-search-head">
        <span className="eyebrow">Busca por stock disponible</span>
        <h2>Filtra rápido y entra directo al catálogo.</h2>
      </div>

      <div className="hero-search-grid">
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Marca</option>
          {brands.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="">Modelo</option>
          {models.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div className="range-grid">
        <label>
          <input
            type="range"
            min={minPrice}
            max={maxCatalogPrice}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <div className="range-values">
            <small>{Number(minPrice).toLocaleString('es-ES')} €</small>
            <strong> </strong>
            <small>{Number(maxCatalogPrice).toLocaleString('es-ES')} €</small>
          </div>
        </label>

        <label>
          <input
            type="range"
            min={minKm}
            max={maxCatalogKm}
            value={maxKm}
            onChange={(e) => setMaxKm(e.target.value)}
          />
          <div className="range-values">
            <small>{Number(minKm).toLocaleString('es-ES')} km</small>
            <strong></strong>
            <small>{Number(maxCatalogKm).toLocaleString('es-ES')} km</small>
          </div>
        </label>
      </div>

      <button className="btn btn-primary hero-search-button" type="submit">Buscar vehículo</button>
    </form>
  );
}

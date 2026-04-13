import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, buildAssetUrl } from '../../services/api';

const initialForm = {
  title: '',
  description: '',
  price: '',
  condition: 'ocasion',
  status: 'disponible',
  year: '',
  brand: '',
  model: '',
  kilometers: '',
  featured: false,
};

export default function VehicleFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { authHeaders } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadVehicle() {
    if (!isEdit) return;
    try {
      const data = await apiFetch(`/api/bikes/${id}`, { headers: authHeaders });
      setForm({
        title: data.title || '',
        description: data.description || '',
        price: data.price || '',
        condition: data.condition || 'ocasion',
        status: data.status || 'disponible',
        year: data.year || '',
        brand: data.brand || '',
        model: data.model || '',
        kilometers: data.kilometers || '',
        featured: Boolean(data.featured),
      });
      setImages(data.images || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadVehicle();
  }, [id]);

  async function handleDeleteImage(path) {
    try {
      await apiFetch(`/api/bikes/${id}/images/${encodeURIComponent(path).replace(/%2F/g, '/')}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      await loadVehicle();
    } catch (err) {
      setError(err.message);
    }
  }

  async function uploadPendingImages(vehicleId) {
    for (const file of files) {
      const body = new FormData();
      body.append('file', file);
      await apiFetch(`/api/bikes/${vehicleId}/images`, {
        method: 'POST',
        headers: authHeaders,
        body,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        year: form.year ? Number(form.year) : null,
        kilometers: form.kilometers ? Number(form.kilometers) : 0,
      };

      const data = await apiFetch(isEdit ? `/api/bikes/${id}` : '/api/bikes', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const vehicleId = isEdit ? id : data.id;
      if (files.length) {
        await uploadPendingImages(vehicleId);
      }

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>{isEdit ? 'Editar vehículo' : 'Nuevo vehículo'}</h1>
      <form className="admin-form-card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Marca" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
          <input placeholder="Modelo" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
          <input placeholder="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input placeholder="Año" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          <input placeholder="Kilómetros" type="number" value={form.kilometers} onChange={(e) => setForm({ ...form, kilometers: e.target.value })} />
          <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
            <option value="nuevo">Nuevo</option>
            <option value="km0">Km 0</option>
            <option value="ocasion">Ocasión</option>
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>

        <textarea rows="6" placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <label className="check-row">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Destacar en portada
        </label>

        <label className="file-box">
          <span>Subir imágenes</span>
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        </label>

        {files.length > 0 && (
          <div className="pending-files">{files.length} imagen(es) listas para subir al guardar.</div>
        )}

        {images.length > 0 && (
          <div className="admin-image-grid">
            {images.map((image) => (
              <div key={image} className="admin-image-card">
                <img src={buildAssetUrl(image)} alt="Vehículo" />
                <button type="button" className="btn btn-dark btn-sm" onClick={() => handleDeleteImage(image)}>Quitar</button>
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Guardando...' : 'Guardar vehículo'}</button>
        {error && <p className="status-message">{error}</p>}
      </form>
    </div>
  );
}

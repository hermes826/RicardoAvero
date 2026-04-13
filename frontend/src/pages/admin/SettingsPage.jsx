import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';

export default function SettingsPage() {
  const { authHeaders } = useAuth();
  const [form, setForm] = useState({ phone: '', email: '', address: '', schedule: '', whatsapp: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    apiFetch('/api/contact', { headers: authHeaders }).then((data) => {
      setForm({
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        schedule: data.schedule || '',
        whatsapp: data.whatsapp || '',
      });
    }).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await apiFetch('/api/contact', {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      setStatus('Datos de contacto actualizados.');
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div>
      <h1>Datos de contacto</h1>
      <form className="admin-form-card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <input placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          <input placeholder="Horario" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
        </div>
        <textarea rows="4" placeholder="Dirección" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button className="btn btn-primary" type="submit">Guardar cambios</button>
        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
  );
}

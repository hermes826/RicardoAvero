import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../services/api';

export default function ContactPage() {
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    apiFetch('/api/contact').then(setContact).catch(() => setContact(null));
  }, []);

  const whatsappLink = useMemo(() => {
    const raw = contact?.whatsapp || contact?.phone || '676606948';
    const clean = raw.replace(/\D/g, '');
    const text = encodeURIComponent(`Hola, soy ${form.name || 'un cliente'}. ${form.message || 'Me gustaría recibir información sobre un vehículo.'}`);
    return `https://wa.me/${clean.startsWith('34') ? clean : `34${clean}`}?text=${text}`;
  }, [contact, form]);

  return (
    <section className="section-dark">
      <div className="container contact-layout">
        <div className="contact-card">
          <span className="eyebrow">Contacto</span>
          <h1>Te ayudamos a encontrar tu próximo coche</h1>
          <p>{contact?.address || 'C. Antonio González Ramos, 19, Local Bajo Izq, 38203 La Laguna'}</p>
          <p>{contact?.phone || '676 60 69 48'}</p>
          <p>{contact?.email || 'info@ricardoaveroautomoviles.com'}</p>
          <p>{contact?.schedule || 'Consulta horario por teléfono o WhatsApp.'}</p>
        </div>

        <form id="contact-form" className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Correo electrónico" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea placeholder="Cuéntanos qué vehículo buscas o qué coche quieres vender" rows="6" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <div className="contact-actions">
            <a className="btn btn-primary" href={whatsappLink} target="_blank" rel="noreferrer">Enviar por WhatsApp</a>
            <a className="btn btn-dark" href={`mailto:${contact?.email || 'info@ricardoaveroautomoviles.com'}?subject=Consulta%20web`}>Enviar por email</a>
          </div>
          <p className="status-message">Este formulario está preparado para contacto rápido por WhatsApp o email con los datos configurados en tu backend.</p>
        </form>
      </div>
    </section>
  );
}

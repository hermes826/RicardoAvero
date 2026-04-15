import { Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export default function Layout() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    apiFetch('/api/contact').then(setContact).catch(() => setContact(null));
  }, []);

  const phone = contact?.phone || '676 60 69 48';
  const whatsapp = contact?.whatsapp || phone;
  const email = contact?.email || 'info@ricardoaveroautomoviles.com';
  const address = contact?.address || 'La Laguna, Tenerife';
  const schedule = contact?.schedule || 'Consulta por teléfono o WhatsApp';
  const cleanPhone = phone.replace(/\s+/g, '');
  const cleanWhatsapp = whatsapp.replace(/\D/g, '');
  const whatsappHref = `https://wa.me/${cleanWhatsapp.startsWith('34') ? cleanWhatsapp : `34${cleanWhatsapp}`}`;

  return (
    <div className="site-shell site-shell-home-clean">
      <header className="masthead-banner masthead-banner-clean">
        <div className="container masthead-banner-clean-inner">
          <div className="masthead-branding masthead-branding-clean">
            <Link to="/" className="masthead-name-link">
              <span className="masthead-name">Ricardo Avero</span>
            </Link>
            <span className="masthead-subline">Vehículos y movilidad en Tenerife</span>
          </div>

          <Link className="btn-login-topbar btn-login-subtle" to="/admin/login">
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer footer-dark-contact">
        <div className="container footer-dark-contact-inner">
          <div className="footer-dark-brand">
            <p className="footer-kicker footer-kicker-light">Ricardo Avero</p>
            <h4>Contacto</h4>
            <p>Atención directa para coches de ocasión, motos nuevas y cuadriciclos Aixam.</p>
          </div>

          <div className="footer-dark-grid">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp · {whatsapp}
            </a>
            <a href={`tel:${cleanPhone}`}>
              Teléfono · {phone}
            </a>
            <a href={`mailto:${email}`}>
              Correo · {email}
            </a>
            <Link to="/contacto#contact-form">Formulario</Link>
            <span>Dirección · {address}</span>
            <span>Horario · {schedule}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
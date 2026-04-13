import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export default function Layout() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    apiFetch('/api/contact').then(setContact).catch(() => setContact(null));
  }, []);

  return (
    <div className="site-shell">
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <Link className="btn-login-topbar" to="/admin/login">Iniciar sesión</Link>
            <span className="topbar-divider" />
            <span>Atención personalizada en La Laguna</span>
          </div>
          <div className="topbar-right">
            <span>{contact?.phone || '676 60 69 48'}</span>
            <span className="topbar-divider" />
            <span>{contact?.address || 'La Laguna, Tenerife'}</span>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <div className="brand-mark" aria-hidden="true">
              <span>RA</span>
            </div>
            <div className="brand-text">
              <strong>Ricardo Avero</strong>
              <span>Vehículos de ocasión · Tenerife</span>
            </div>
            <span className="brand-tag">AIXAM</span>
          </Link>

          <nav className="nav">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/vehiculos">Vehículos</NavLink>
            <NavLink to="/nosotros">Nosotros</NavLink>
            <NavLink to="/contacto">Contacto</NavLink>
          </nav>

          <div className="header-actions">
            <a className="header-phone-link" href={`tel:${(contact?.phone || '676606948').replace(/\s+/g, '')}`}>
              {contact?.phone || '676 60 69 48'}
            </a>
            <Link className="btn btn-primary" to="/contacto">Solicita tu vehículo</Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <p className="footer-kicker">Ricardo Avero</p>
            <h4>Vehículos con atención cercana y trato directo.</h4>
            <p>Stock revisado, asesoramiento real y una experiencia de compra más clara y personal.</p>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>{contact?.address || 'C. Antonio González Ramos, 19, La Laguna'}</p>
            <p>{contact?.phone || '676 60 69 48'}</p>
            <p>{contact?.email || 'info@ricardoaveroautomoviles.com'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

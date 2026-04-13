import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">Panel Admin</Link>
        <nav>
          <NavLink end to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/vehiculos/nuevo">Nuevo vehículo</NavLink>
          <NavLink to="/admin/ajustes">Contacto</NavLink>
        </nav>
        <button className="btn btn-dark admin-logout" onClick={logout}>Cerrar sesión</button>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
}

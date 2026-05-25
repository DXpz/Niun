import { useAuth } from '../App'
import './Profile.css'

function Profile() {
  const { user, totalSavings } = useAuth()

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">${totalSavings.toFixed(2)}</span>
            <span className="stat-label">Total Ahorrado</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">Ofertas Guardadas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">8</span>
            <span className="stat-label">Compras Totales</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">4.7</span>
            <span className="stat-label">Rating Promedio</span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          Preferencias de Alerta
        </h3>
        <div className="preferences-list">
          <label className="preference-item">
            <input type="checkbox" defaultChecked />
            <span className="preference-label">
              <span className="preference-name">Supermercado</span>
              <span className="preference-desc">Recibe alertas de ofertas en supermercados</span>
            </span>
            <span className="preference-status active">Activo</span>
          </label>
          <label className="preference-item">
            <input type="checkbox" defaultChecked />
            <span className="preference-label">
              <span className="preference-name">Tecnología</span>
              <span className="preference-desc">Recibe alertas de ofertas en tecnología</span>
            </span>
            <span className="preference-status active">Activo</span>
          </label>
          <label className="preference-item">
            <input type="checkbox" defaultChecked />
            <span className="preference-label">
              <span className="preference-name">Útiles</span>
              <span className="preference-desc">Recibe alertas de ofertas en útiles escolares</span>
            </span>
            <span className="preference-status active">Activo</span>
          </label>
          <label className="preference-item">
            <input type="checkbox" />
            <span className="preference-label">
              <span className="preference-name">Promociones</span>
              <span className="preference-desc">Recibe alertas de promociones generales</span>
            </span>
            <span className="preference-status">Inactivo</span>
          </label>
        </div>
      </div>

      <div className="profile-section">
        <h3>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Ubicación
        </h3>
        <div className="location-card">
          <div className="location-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="location-info">
            <span className="location-name">San Salvador, El Salvador</span>
            <span className="location-zone">Área Metropolitana (AMSS)</span>
          </div>
          <button className="edit-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="profile-section">
        <h3>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          Configuración
        </h3>
        <div className="settings-list">
          <button className="setting-item">
            <span className="setting-name">Notificaciones Push</span>
            <span className="setting-toggle active">ON</span>
          </button>
          <button className="setting-item">
            <span className="setting-name">Alertas por Email</span>
            <span className="setting-toggle">OFF</span>
          </button>
          <button className="setting-item">
            <span className="setting-name">Geolocalización</span>
            <span className="setting-toggle active">ON</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
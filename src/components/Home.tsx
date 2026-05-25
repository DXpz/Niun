import { useState } from 'react'
import { useAuth } from '../App'
import Header from './Header'
import OfferFeed from './OfferFeed'
import MapView from './MapView'
import CategoryFilter from './CategoryFilter'
import Cart from './Cart'
import Profile from './Profile'
import { LocationBanner } from './LocationBanner'
import { useUserLocation } from '../hooks/useUserLocation'
import './Home.css'

type View = 'feed' | 'map' | 'cart' | 'profile'

interface RouteOffer {
  storeName: string
  offerTitle: string
  lat: number
  lng: number
  address: string
  originalPrice?: number
  salePrice?: number
  discount?: number
  rating?: number
}

function Home() {
  const { user, logout, totalSavings } = useAuth()
  const [currentView, setCurrentView] = useState<View>('feed')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMenu, setShowMenu] = useState(false)
  const [sortByProximity, setSortByProximity] = useState(false)
  const [searchRadius, setSearchRadius] = useState(0)
  const [routeToOffer, setRouteToOffer] = useState<RouteOffer | null>(null)
  const { location } = useUserLocation()

  const showLocationBanner = location.status === 'idle'

  const handleLocationGranted = () => {
    setSortByProximity(true)
  }

  const handleShowOnMap = (offer: RouteOffer) => {
    setRouteToOffer(offer)
    setCurrentView('map')
  }

  const handleBackToFeed = () => {
    setRouteToOffer(null)
    setCurrentView('feed')
  }

  return (
    <div className="home">
      <Header user={user} onMenuToggle={() => setShowMenu(!showMenu)} />

      <div className="home-content">
        <div className={`sidebar-overlay ${showMenu ? 'visible' : ''}`} onClick={() => setShowMenu(false)} />
        <aside className={`sidebar ${showMenu ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${currentView === 'feed' ? 'active' : ''}`}
              onClick={() => { setCurrentView('feed'); setShowMenu(false); }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Ofertas
            </button>
            <button
              className={`nav-item ${currentView === 'map' ? 'active' : ''}`}
              onClick={() => { setCurrentView('map'); setShowMenu(false); }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"/>
                <line x1="8" y1="2" x2="8" y2="18"/>
                <line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
              Mapa de Tiendas
            </button>
            <button
              className={`nav-item ${currentView === 'cart' ? 'active' : ''}`}
              onClick={() => { setCurrentView('cart'); setShowMenu(false); }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              Carrito
            </button>
            <button
              className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
              onClick={() => { setCurrentView('profile'); setShowMenu(false); }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Mi Perfil
            </button>
            <button
              className="nav-item business-cta"
              onClick={() => { setCurrentView('profile'); setShowMenu(false); }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <line x1="12" y1="8" x2="12" y2="14"/>
                <line x1="9" y1="11" x2="15" y2="11"/>
              </svg>
              Publica tu Negocio
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-stats">
              <div className="stat-item highlight">
                <span className="stat-value">${totalSavings.toFixed(2)}</span>
                <span className="stat-label">Total Ahorrado</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">154</span>
                <span className="stat-label">Ofertas Verif.</span>
              </div>
            </div>
            <button className="nav-item logout" onClick={logout}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className="main-panel">
          {currentView === 'cart' ? (
            <Cart />
          ) : currentView === 'profile' ? (
            <Profile />
          ) : currentView === 'map' ? (
            <>
              {routeToOffer && (
                <button className="back-to-feed" onClick={handleBackToFeed}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12,19 5,12 12,5"/>
                  </svg>
                  Volver a ofertas
                </button>
              )}
              <MapView
                userLat={location.status === 'granted' ? location.lat : undefined}
                userLng={location.status === 'granted' ? location.lng : undefined}
                routeToOffer={routeToOffer}
              />
            </>
          ) : (
            <>
              {showLocationBanner && (
                <LocationBanner onLocationGranted={handleLocationGranted} />
              )}

              <div className="business-banner">
                <div className="banner-content">
                  <div className="banner-icon">🏪</div>
                  <div className="banner-text">
                    <h4>¿Tienes un negocio?</h4>
                    <p>Llega a más clientes en tu zona</p>
                  </div>
                </div>
                <button className="banner-btn" onClick={() => setCurrentView('profile')}>
                  Ver planes desde $5
                </button>
              </div>

              <div className="search-bar">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input type="text" placeholder="Buscar ofertas, tiendas..." />
              </div>

              <CategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />

              <div className="view-tabs">
                <button className={`tab active`}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Grid
                </button>
                <button
                  className={`tab`}
                  onClick={() => setCurrentView('map')}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"/>
                    <line x1="8" y1="2" x2="8" y2="18"/>
                    <line x1="16" y1="6" x2="16" y2="22"/>
                  </svg>
                  Mapa
                </button>
              </div>

              <div className="content-area">
                <OfferFeed
                  category={selectedCategory}
                  userLat={location.status === 'granted' ? location.lat : undefined}
                  userLng={location.status === 'granted' ? location.lng : undefined}
                  sortByProximity={sortByProximity}
                  searchRadius={searchRadius}
                  onRadiusChange={setSearchRadius}
                  onShowOnMap={handleShowOnMap}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home
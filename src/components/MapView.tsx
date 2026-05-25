import { useEffect, useRef, useState, useCallback } from 'react'
import './MapView.css'

interface Props {
  userLat?: number
  userLng?: number
  routeToOffer?: {
    storeName: string
    offerTitle: string
    lat: number
    lng: number
    address: string
    originalPrice?: number
    salePrice?: number
    discount?: number
    rating?: number
  } | null
}

function MapView({ userLat, userLng, routeToOffer }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  const defaultCenter = { lat: 13.6942, lng: -89.2202 }
  const userLocation = userLat && userLng ? { lat: userLat, lng: userLng } : null

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const center = userLocation || defaultCenter

    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: true
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19
    }).addTo(map)

    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-marker-container',
        html: `
          <div class="user-marker">
            <div class="user-marker-pulse"></div>
            <div class="user-marker-dot"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map)
    }

    if (routeToOffer) {
      const offerIcon = L.divIcon({
        className: 'offer-marker-container',
        html: `
          <div class="offer-marker">
            <div class="offer-marker-pulse"></div>
            <div class="offer-marker-icon">📍</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })
      L.marker([routeToOffer.lat, routeToOffer.lng], { icon: offerIcon }).addTo(map)
    }

    mapInstanceRef.current = map

    setTimeout(() => {
      map.invalidateSize()
      setIsMapReady(true)
    }, 100)
  }, [])

  useEffect(() => {
    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        setIsMapReady(false)
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
    }
  }, [isMapReady])

  useEffect(() => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15)
    }
  }, [userLat, userLng])

  const openGoogleMaps = () => {
    if (!routeToOffer) return
    const lat = routeToOffer.lat
    const lng = routeToOffer.lng
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, '_blank')
  }

  const openAppleMaps = () => {
    if (!routeToOffer) return
    const lat = routeToOffer.lat
    const lng = routeToOffer.lng
    window.open(`http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`, '_blank')
  }

  const openWaze = () => {
    if (!routeToOffer) return
    const lat = routeToOffer.lat
    const lng = routeToOffer.lng
    window.open(`https://waze.com/ul?q=${lat},${lng}&ll=${lat},${lng}&navigate=yes`, '_blank')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (!routeToOffer) {
    return (
      <div className="map-view map-empty">
        <div ref={mapRef} className="leaflet-map" />
        <div className="map-empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>Selecciona una oferta</h3>
          <p>Toca "Ver mapa" en una oferta para ver cómo llegar</p>
        </div>
      </div>
    )
  }

  const discountAmount = routeToOffer.originalPrice && routeToOffer.salePrice
    ? routeToOffer.originalPrice - routeToOffer.salePrice
    : 0

  return (
    <div className="map-view">
      <div ref={mapRef} className="leaflet-map" />

      <div className="map-card">
        <div className="card-header">
          <div className="card-icon offer-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#000" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="card-title">
            <h4>{routeToOffer.offerTitle}</h4>
            <span>{routeToOffer.storeName}</span>
          </div>
          {routeToOffer.discount && (
            <div className="discount-badge">-{routeToOffer.discount}%</div>
          )}
        </div>

        <div className="card-address">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{routeToOffer.address}</span>
        </div>

        {routeToOffer.originalPrice && routeToOffer.salePrice && (
          <div className="offer-pricing">
            <span className="original">{formatPrice(routeToOffer.originalPrice)}</span>
            <span className="sale">{formatPrice(routeToOffer.salePrice)}</span>
            <span className="savings">Ahorras {formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="navigation-section">
          <h5>¿Cómo quieres llegar?</h5>
          <div className="nav-buttons">
            <button className="nav-btn google" onClick={openGoogleMaps}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 4-2.1 5.37z" fill="#4285F4"/>
              </svg>
              <span>Google Maps</span>
            </button>
            <button className="nav-btn apple" onClick={openAppleMaps}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#A3AAAE"/>
              </svg>
              <span>Apple Maps</span>
            </button>
            <button className="nav-btn waze" onClick={openWaze}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#3D5AFE"/>
                <path d="M12 6v6l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Waze</span>
            </button>
          </div>
        </div>

        {routeToOffer.rating && (
          <div className="card-rating">
            <span className="stars">★ ★ ★ ★ ★</span>
            <span className="rating-value">{routeToOffer.rating}</span>
          </div>
        )}
      </div>
    </div>
  )
}

declare var L: any

export default MapView
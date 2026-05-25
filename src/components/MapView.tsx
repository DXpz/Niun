import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import { calcDistance } from '../hooks/useUserLocation'
import './MapView.css'

interface Store {
  id: string
  name: string
  lat: number
  lng: number
  offerCount: number
  category: string
  address: string
}

const stores: Store[] = [
  { id: '1', name: 'Supermercado La Torre', lat: 13.6942, lng: -89.2202, offerCount: 4, category: 'supermercado', address: 'Colonia Escalón, San Salvador' },
  { id: '2', name: 'Almacenes Simán', lat: 13.6924, lng: -89.2189, offerCount: 3, category: 'tecnologia', address: 'Centro Comercial Metro Centro' },
  { id: '3', name: 'Librería Yucatán', lat: 13.6955, lng: -89.2410, offerCount: 4, category: 'utiles', address: 'Boulevard del Hipódromo' },
  { id: '4', name: 'Supermercado César', lat: 13.6967, lng: -89.2356, offerCount: 3, category: 'supermercado', address: 'Colonia San Benito' },
  { id: '5', name: 'Tech Zone SV', lat: 13.6920, lng: -89.2340, offerCount: 3, category: 'tecnologia', address: 'Calle La Reforma' },
  { id: '6', name: 'iStore El Salvador', lat: 13.6930, lng: -89.2150, offerCount: 2, category: 'tecnologia', address: 'Centro Comercial Parque Centro' },
  { id: '7', name: 'Librería Papelería', lat: 13.6980, lng: -89.2300, offerCount: 4, category: 'utiles', address: 'Colonia Floresta' },
  { id: '8', name: 'Farmacia San Andrés', lat: 13.6950, lng: -89.2250, offerCount: 3, category: 'farmacia', address: 'Colonia San Rafael' },
  { id: '9', name: 'Farmacia del Pueblo', lat: 13.6870, lng: -89.2060, offerCount: 2, category: 'farmacia', address: 'Centro Histórico' },
  { id: '10', name: 'HogarExpress', lat: 13.6940, lng: -89.2200, offerCount: 3, category: 'hogar', address: 'Centro Comercial El Ángel' },
  { id: '11', name: 'Bata El Salvador', lat: 13.6924, lng: -89.2189, offerCount: 4, category: 'ropa', address: 'Centro Comercial Metro Centro' },
  { id: '12', name: 'Sports World SV', lat: 13.6924, lng: -89.2189, offerCount: 3, category: 'deportes', address: 'Centro Comercial Metro Centro' },
  { id: '13', name: 'Burger King SV', lat: 13.6924, lng: -89.2189, offerCount: 1, category: 'restaurantes', address: 'Centro Comercial Metro Centro' },
  { id: '14', name: 'Sephora El Salvador', lat: 13.6930, lng: -89.2150, offerCount: 3, category: 'belleza', address: 'Centro Comercial Parque Centro' },
  { id: '15', name: 'Pollo Campero', lat: 13.6940, lng: -89.2200, offerCount: 1, category: 'restaurantes', address: 'Centro Comercial El Ángel' },
  { id: '16', name: 'Perfumería xyz', lat: 13.6942, lng: -89.2202, offerCount: 3, category: 'belleza', address: 'Colonia Escalón' }
]

const categoryColors: Record<string, string> = {
  supermercado: '#48c774',
  tecnologia: '#568cf8',
  utiles: '#fdb848',
  farmacia: '#ff6b6b',
  hogar: '#a064dc',
  ropa: '#ff7f50',
  deportes: '#00c8c8',
  restaurantes: '#ff6347',
  belleza: '#ffb6c1'
}

const categoryNames: Record<string, string> = {
  supermercado: 'Supermercado',
  tecnologia: 'Tecnología',
  utiles: 'Útiles',
  farmacia: 'Farmacia',
  hogar: 'Hogar',
  ropa: 'Ropa',
  deportes: 'Deportes',
  restaurantes: 'Restaurantes',
  belleza: 'Belleza'
}

interface Props {
  userLat?: number
  userLng?: number
  routeToOffer?: {
    storeName: string
    offerTitle: string
    lat: number
    lng: number
    address: string
  } | null
}

function MapView({ userLat, userLng, routeToOffer }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const routeLineRef = useRef<L.Polyline | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const centerLat = userLat || 13.6942
    const centerLng = userLng || -89.2202

    const map = L.map(mapRef.current, {
      center: [centerLat, centerLng],
      zoom: 15,
      zoomControl: true,
      attributionControl: true
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(map)

    if (userLat && userLng) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div class="user-dot"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
      L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
    }

    stores.forEach(store => {
      const color = categoryColors[store.category]
      const icon = L.divIcon({
        className: 'store-marker',
        html: `<div class="store-dot" style="background:${color};border-color:${color}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker([store.lat, store.lng], { icon }).addTo(map)
      marker.on('click', () => {
        setSelectedStore(store)
        if (routeLineRef.current) {
          map.removeLayer(routeLineRef.current)
          routeLineRef.current = null
        }
      })

      markersRef.current.push(marker)
    })

    mapInstanceRef.current = map
    setMapLoaded(true)
  }, [userLat, userLng])

  useEffect(() => {
    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = []
        setMapLoaded(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return

    const map = mapInstanceRef.current

    if (userLat && userLng) {
      map.setView([userLat, userLng], 15)
    }
  }, [userLat, userLng, mapLoaded])

  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !routeToOffer) return

    const map = mapInstanceRef.current
    setLoadingRoute(true)
    setRouteError(null)

    const startLat = userLat || 13.6942
    const startLng = userLng || -89.2202

    fetch(`https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${routeToOffer.lng},${routeToOffer.lat}?overview=full&geometries=geojson`)
      .then(res => {
        if (!res.ok) throw new Error('Network error')
        return res.json()
      })
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          const coordinates = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]])

          if (routeLineRef.current) {
            map.removeLayer(routeLineRef.current)
          }

          const routeLine = L.polyline(coordinates as [number, number][], {
            color: '#FFD322',
            weight: 6,
            opacity: 0.9
          }).addTo(map)

          routeLineRef.current = routeLine

          setRouteInfo({
            distance: `${(route.distance / 1000).toFixed(1)} km`,
            duration: `${Math.round(route.duration / 60)} min`
          })

          map.fitBounds(routeLine.getBounds(), { padding: [80, 80] })
        } else {
          setRouteError('No se encontró ruta')
        }
      })
      .catch(err => {
        console.error('Route error:', err)
        setRouteError('Error al calcular ruta')
      })
      .finally(() => setLoadingRoute(false))
  }, [routeToOffer, mapLoaded, userLat, userLng])

  const openGoogleMaps = () => {
    const lat = routeToOffer?.lat || selectedStore?.lat || 0
    const lng = routeToOffer?.lng || selectedStore?.lng || 0
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, '_blank')
  }

  const openWaze = () => {
    const lat = routeToOffer?.lat || selectedStore?.lat || 0
    const lng = routeToOffer?.lng || selectedStore?.lng || 0
    window.open(`https://waze.com/ul?q=${lat},${lng}&ll=${lat},${lng}`, '_blank')
  }

  const clearRoute = () => {
    if (routeLineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current)
      routeLineRef.current = null
    }
    setRouteInfo(null)
    setRouteError(null)
    if (routeToOffer) {
      const map = mapInstanceRef.current
      if (map) {
        map.setView([routeToOffer.lat, routeToOffer.lng], 16)
      }
    }
  }

  const targetName = routeToOffer?.offerTitle || routeToOffer?.storeName || selectedStore?.name || ''
  const targetAddress = routeToOffer?.address || selectedStore?.address || ''

  return (
    <div className="map-view">
      <div ref={mapRef} className="leaflet-map" />

      {loadingRoute && (
        <div className="map-overlay">
          <div className="loading-spinner" />
          <span>Calculando ruta...</span>
        </div>
      )}

      {(routeToOffer || selectedStore) && (
        <div className="map-card">
          <div className="card-header">
            <div className="card-icon offer">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="card-title">
              <h4>{targetName}</h4>
              {routeToOffer && <span>{routeToOffer.storeName}</span>}
              {!routeToOffer && selectedStore && <span>{categoryNames[selectedStore.category]}</span>}
            </div>
            {!routeToOffer && (
              <button className="card-close" onClick={() => setSelectedStore(null)}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          <div className="card-address">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {targetAddress}
          </div>

          {routeInfo && (
            <div className="route-info-box">
              <div className="route-stat">
                <span className="route-icon">📍</span>
                <span className="route-value">{routeInfo.distance}</span>
                <span className="route-label">Distancia</span>
              </div>
              <div className="route-divider" />
              <div className="route-stat">
                <span className="route-icon">⏱</span>
                <span className="route-value">{routeInfo.duration}</span>
                <span className="route-label">Tiempo</span>
              </div>
            </div>
          )}

          {routeError && (
            <div className="route-error">{routeError}</div>
          )}

          <div className="card-actions">
            <button className="action-btn primary" onClick={openGoogleMaps}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3,11 22,2 13,21 11,13 3,11"/>
              </svg>
              Google Maps
            </button>
            <button className="action-btn secondary" onClick={openWaze}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="12,2 12,12 19,12"/>
              </svg>
              Waze
            </button>
          </div>

          {routeLineRef.current && (
            <button className="clear-route-btn" onClick={clearRoute}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Limpiar ruta
            </button>
          )}
        </div>
      )}

      {!routeToOffer && !selectedStore && (
        <div className="map-hint">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Toca un marcador para ver cómo llegar</span>
        </div>
      )}
    </div>
  )
}

export default MapView
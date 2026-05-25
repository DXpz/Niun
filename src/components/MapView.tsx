import { useEffect, useRef, useState } from 'react'
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
  category: string
  userLat?: number
  userLng?: number
  sortByProximity?: boolean
}

function MapView({ category, userLat, userLng, sortByProximity = false }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const routeLineRef = useRef<L.Polyline | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [showDirections, setShowDirections] = useState(false)
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [loadingRoute, setLoadingRoute] = useState(false)

  const centerLat = userLat || 13.6942
  const centerLng = userLng || -89.2202

  const sortedStores = sortByProximity && userLat && userLng
    ? [...stores].sort((a, b) => {
        const distA = calcDistance(userLat, userLng, a.lat, a.lng)
        const distB = calcDistance(userLat, userLng, b.lat, b.lng)
        return distA - distB
      })
    : stores

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const loadLeaflet = async () => {
      const L = await import('leaflet')

      const map = L.map(mapRef.current!, {
        center: [centerLat, centerLng],
        zoom: 14
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map)

      if (userLat && userLng) {
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: `<div class="user-dot"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })

        const marker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
        userMarkerRef.current = marker
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
          setShowDirections(false)
          setRouteInfo(null)
          if (routeLineRef.current) {
            map.removeLayer(routeLineRef.current)
            routeLineRef.current = null
          }
          map.setView([store.lat, store.lng], 16)
        })

        markersRef.current.push(marker)
      })

      mapInstanceRef.current = map
    }

    loadLeaflet()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [centerLat, centerLng, userLat, userLng])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    const filteredStores = category === 'all'
      ? stores
      : stores.filter(s => s.category === category)

    markersRef.current.forEach((marker, idx) => {
      const store = stores[idx]
      const isVisible = filteredStores.some(s => s.id === store.id)
      const map = mapInstanceRef.current!

      if (isVisible) {
        if (!map.hasLayer(marker)) marker.addTo(map)
      } else {
        marker.remove()
      }
    })
  }, [category])

  useEffect(() => {
    if (!mapInstanceRef.current || !userLat || !userLng) return

    const map = mapInstanceRef.current

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLat, userLng])
    } else {
      import('leaflet').then(L => {
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: `<div class="user-dot"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
        const marker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
        userMarkerRef.current = marker
      })
    }

    map.setView([userLat, userLng], 14)
  }, [userLat, userLng])

  const calculateRoute = async () => {
    if (!selectedStore || !mapInstanceRef.current) return

    if (routeLineRef.current) {
      mapInstanceRef.current.removeLayer(routeLineRef.current)
      routeLineRef.current = null
    }

    setLoadingRoute(true)

    const startLat = userLat || 13.6942
    const startLng = userLng || -89.2202

    const map = mapInstanceRef.current

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${selectedStore.lng},${selectedStore.lat}?overview=full&geometries=geojson`
      )
      const data = await response.json()

      if (data.routes && data.routes.length > 0) {
        const L = await import('leaflet')
        const route = data.routes[0]
        const coordinates = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]])

        const routeLine = L.polyline(coordinates as [number, number][], {
          color: '#FFD322',
          weight: 5,
          opacity: 0.9
        }).addTo(map)

        routeLineRef.current = routeLine

        setRouteInfo({
          distance: `${(route.distance / 1000).toFixed(1)} km`,
          duration: `${Math.round(route.duration / 60)} min`
        })

        setShowDirections(true)
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] })
      }
    } catch (error) {
      console.error('Route error:', error)
    } finally {
      setLoadingRoute(false)
    }
  }

  const openGoogleMaps = () => {
    if (!selectedStore) return
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}&travelmode=driving`, '_blank')
  }

  const getStoreDistance = (store: Store): string => {
    if (!userLat || !userLng) return '-'
    const dist = calcDistance(userLat, userLng, store.lat, store.lng)
    return dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`
  }

  const filteredStores = category === 'all' ? sortedStores : sortedStores.filter(s => s.category === category)

  return (
    <div className="map-view">
      <div ref={mapRef} className="leaflet-map" />

      <div className="map-sidebar">
        <div className="sidebar-header">
          <span>Tiendas</span>
          <span className="count">{filteredStores.length}</span>
        </div>
        <div className="sidebar-list">
          {filteredStores.map(store => (
            <div
              key={store.id}
              className={`sidebar-item ${selectedStore?.id === store.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedStore(store)
                setShowDirections(false)
                setRouteInfo(null)
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([store.lat, store.lng], 16)
                }
              }}
            >
              <div className="item-dot" style={{ background: categoryColors[store.category] }} />
              <div className="item-info">
                <span className="item-name">{store.name}</span>
                <span className="item-cat">{categoryNames[store.category]}</span>
              </div>
              <span className="item-offers">{store.offerCount}</span>
              {sortByProximity && userLat && (
                <span className="item-dist">{getStoreDistance(store)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedStore && (
        <div className="map-card">
          <div className="card-header">
            <div className="card-icon" style={{ background: categoryColors[selectedStore.category] }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="card-title">
              <h4>{selectedStore.name}</h4>
              <span>{categoryNames[selectedStore.category]}</span>
            </div>
            <button className="card-close" onClick={() => setSelectedStore(null)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="card-address">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {selectedStore.address}
          </div>

          <div className="card-stats">
            <div className="stat">
              <span className="val">{selectedStore.offerCount}</span>
              <span className="lbl">Ofertas</span>
            </div>
            <div className="stat">
              <span className="val">{getStoreDistance(selectedStore)}</span>
              <span className="lbl">Distancia</span>
            </div>
            <div className="stat">
              <span className="val">4.5</span>
              <span className="lbl">Rating</span>
            </div>
          </div>

          {showDirections && routeInfo && (
            <div className="card-route">
              <span>{routeInfo.distance}</span>
              <span>{routeInfo.duration}</span>
            </div>
          )}

          <div className="card-btns">
            <button className="btn-primary" onClick={calculateRoute} disabled={loadingRoute}>
              {loadingRoute ? '...' : 'Cómo Llegar'}
            </button>
            <button className="btn-secondary" onClick={openGoogleMaps}>
              Abrir Maps
            </button>
          </div>

          {showDirections && (
            <button
              className="btn-clear"
              onClick={() => {
                if (routeLineRef.current && mapInstanceRef.current) {
                  mapInstanceRef.current.removeLayer(routeLineRef.current)
                  routeLineRef.current = null
                }
                setShowDirections(false)
                setRouteInfo(null)
              }}
            >
              Limpiar ruta
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MapView
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../App'
import './Admin.css'

const categories = [
  { value: 'supermercado', label: 'Supermercado' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'farmacia', label: 'Farmacia' },
  { value: 'utiles', label: 'Útiles' },
  { value: 'ropa', label: 'Ropa' },
  { value: 'hogar', label: 'Hogar' },
  { value: 'deportes', label: 'Deportes' },
  { value: 'otros', label: 'Otros' }
]

const DEFAULT_CENTER: [number, number] = [13.6929, -89.2182]

function Admin() {
  const { user, businessOffers, addBusinessOffer, removeBusinessOffer, userOffersCount } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    salePrice: '',
    category: 'supermercado',
    storeName: '',
    address: '',
    lat: 13.6929,
    lng: -89.2182
  })
  const [success, setSuccess] = useState(false)
  const [totalViews, setTotalViews] = useState(0)
  const [totalSaves, setTotalSaves] = useState(0)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const maxOffers = user?.plan === 'basic' ? 1 : user?.plan === 'professional' ? 3 : 6
  const canAddMore = userOffersCount < maxOffers

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canAddMore && !editingOffer) return

    addBusinessOffer({
      ...formData,
      originalPrice: Number(formData.originalPrice),
      salePrice: Number(formData.salePrice),
      lat: Number(formData.lat) || 13.6929,
      lng: Number(formData.lng) || -89.2182
    })

    setTotalViews(prev => prev + Math.floor(Math.random() * 50))
    setTotalSaves(prev => prev + Math.floor(Math.random() * 10))

    setFormData({
      title: '',
      description: '',
      originalPrice: '',
      salePrice: '',
      category: 'supermercado',
      storeName: '',
      address: '',
      lat: 13.6929,
      lng: -89.2182
    })
    setShowForm(false)
    setEditingOffer(null)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleEdit = (offerId: string) => {
    const offer = businessOffers.find(o => o.id === offerId)
    if (offer) {
      setFormData({
        title: offer.title,
        description: offer.description,
        originalPrice: offer.originalPrice.toString(),
        salePrice: offer.salePrice.toString(),
        category: offer.category,
        storeName: offer.storeName,
        address: offer.address,
        lat: offer.lat,
        lng: offer.lng
      })
      setEditingOffer(offerId)
      setShowForm(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setEditingOffer(null)
    setShowMapPicker(false)
    setFormData({
      title: '',
      description: '',
      originalPrice: '',
      salePrice: '',
      category: 'supermercado',
      storeName: '',
      address: '',
      lat: 13.6929,
      lng: -89.2182
    })
  }

  const openMapPicker = () => {
    setShowMapPicker(true)
  }

  const confirmMapLocation = () => {
    if (markerRef.current) {
      const pos = markerRef.current.getLatLng()
      setFormData(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }))
    }
    setShowMapPicker(false)
  }

  useEffect(() => {
    if (showMapPicker && mapRef.current && !leafletMap.current) {
      const loadLeaflet = async () => {
        const L = await import('leaflet')
        leafletMap.current = L.map(mapRef.current!).setView(DEFAULT_CENTER, 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(leafletMap.current)
        const existingMarker = markerRef.current
        if (existingMarker) {
          existingMarker.addTo(leafletMap.current)
        } else {
          markerRef.current = L.marker(DEFAULT_CENTER, { draggable: true }).addTo(leafletMap.current)
          markerRef.current.on('dragend', (e) => {
            const marker = e.target as L.Marker
            markerRef.current = marker
          })
        }
      }
      loadLeaflet()
    }
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
      }
    }
  }, [showMapPicker])

  return (
    <div className="admin">
      <div className="admin-header">
        <div>
          <h1>Panel de Negocio</h1>
          <p>Bienvenido, {user?.name}</p>
        </div>
        <div className="plan-badge">
          Plan {user?.plan?.charAt(0).toUpperCase()}{user?.plan?.slice(1)} - {userOffersCount}/{maxOffers} ofertas
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalViews}</span>
            <span className="stat-label">Vistas Totales</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalSaves}</span>
            <span className="stat-label">Personas Interesadas</span>
          </div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{userOffersCount}</span>
            <span className="stat-label">Ofertas Activas</span>
          </div>
        </div>
      </div>

      {!canAddMore && (
        <div className="limit-warning">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Has alcanzado el límite de {maxOffers} ofertas. Actualiza tu plan para agregar más.</span>
        </div>
      )}

      {success && (
        <div className="success-banner">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          <span>{editingOffer ? '¡Oferta actualizada exitosamente!' : '¡Oferta publicada exitosamente!'}</span>
        </div>
      )}

      <div className="admin-section">
        <div className="section-header">
          <h2>Mis Ofertas</h2>
          <button className="btn-add" onClick={() => setShowForm(!showForm)} disabled={!canAddMore && !editingOffer}>
            {showForm ? 'Cancelar' : '+ Nueva Oferta'}
          </button>
        </div>

        {showForm && (
          <form className="offer-form" onSubmit={handleSubmit}>
            <h3>{editingOffer ? 'Editar Oferta' : 'Publicar Nueva Oferta'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Título de la Oferta *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Pizza Mediana a $5.99"
                  required
                />
              </div>
              <div className="form-group">
                <label>Categoría *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe los detalles de tu oferta..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio Original ($) *</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="9.99"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio de Oferta ($) *</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="5.99"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nombre del Negocio *</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Ej: Mi Tienda SV"
                required
              />
            </div>

            <div className="form-group">
              <label>Dirección *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ej: Calle Principal #123, San Salvador"
                required
              />
            </div>

            <div className="form-group location-group">
              <label>Ubicación en el Mapa *</label>
              <button type="button" className="map-picker-btn" onClick={openMapPicker}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {formData.lat && formData.lng ? 'Ubicación seleccionada' : 'Seleccionar en mapa'}
              </button>
              {formData.lat && formData.lng && (
                <span className="location-coords">
                  {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                </span>
              )}
            </div>

            <div className="form-actions">
              {editingOffer && (
                <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn-submit" disabled={!canAddMore && !editingOffer}>
                {editingOffer ? 'Guardar Cambios' : 'Publicar Oferta'}
              </button>
            </div>
          </form>
        )}

        <div className="offers-list">
          {businessOffers.length === 0 ? (
            <div className="empty-offers">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              <p>No tienes ofertas publicadas</p>
              <span>Publica tu primera oferta para comenzar</span>
            </div>
          ) : (
            businessOffers.map(offer => (
              <div key={offer.id} className="offer-item">
                <div className="offer-status">
                  <span className="status-dot active"></span>
                  <span className="status-text">Activa</span>
                </div>
                <div className="offer-info">
                  <h4>{offer.title}</h4>
                  <p>{offer.storeName} - {offer.address}</p>
                  <div className="offer-meta">
                    <span className={`category-tag ${offer.category}`}>{offer.category}</span>
                    <span className="price-original">${offer.originalPrice.toFixed(2)}</span>
                    <span className="price-sale">${offer.salePrice.toFixed(2)}</span>
                    <span className="discount-tag">
                      -{Math.round((1 - offer.salePrice / offer.originalPrice) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="offer-stats">
                  <div className="mini-stat">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>{Math.floor(Math.random() * 100)}</span>
                  </div>
                  <div className="mini-stat">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                    <span>{Math.floor(Math.random() * 20)}</span>
                  </div>
                </div>
                <div className="offer-actions">
                  <button className="btn-edit" onClick={() => handleEdit(offer.id)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="btn-delete" onClick={() => removeBusinessOffer(offer.id)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showMapPicker && (
        <div className="modal-overlay" onClick={() => setShowMapPicker(false)}>
          <div className="modal map-picker-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowMapPicker(false)}>×</button>
            <h3>Selecciona la ubicación</h3>
            <p className="map-instructions">Arrastra el marcador para ajustar la posición exacta de tu negocio</p>
            <div ref={mapRef} className="map-picker-container" />
            <div className="map-picker-actions">
              <button className="btn-cancel" onClick={() => setShowMapPicker(false)}>Cancelar</button>
              <button className="btn-submit" onClick={confirmMapLocation}>Confirmar Ubicación</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
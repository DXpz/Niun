import { useState } from 'react'
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

function Admin() {
  const { user, businessOffers, addBusinessOffer, removeBusinessOffer, userOffersCount } = useAuth()
  const [showForm, setShowForm] = useState(false)
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

  const maxOffers = user?.plan === 'basic' ? 1 : user?.plan === 'professional' ? 3 : 6
  const canAddMore = userOffersCount < maxOffers

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canAddMore) return

    addBusinessOffer({
      ...formData,
      originalPrice: Number(formData.originalPrice),
      salePrice: Number(formData.salePrice),
      lat: Number(formData.lat) || 13.6929,
      lng: Number(formData.lng) || -89.2182
    })

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
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
          <span>¡Oferta publicada exitosamente!</span>
        </div>
      )}

      <div className="admin-section">
        <div className="section-header">
          <h2>Mis Ofertas</h2>
          <button className="btn-add" onClick={() => setShowForm(!showForm)} disabled={!canAddMore}>
            {showForm ? 'Cancelar' : '+ Nueva Oferta'}
          </button>
        </div>

        {showForm && (
          <form className="offer-form" onSubmit={handleSubmit}>
            <h3>Publicar Nueva Oferta</h3>

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

            <div className="form-row">
              <div className="form-group">
                <label>Latitud</label>
                <input
                  type="number"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  step="0.0001"
                />
              </div>
              <div className="form-group">
                <label>Longitud</label>
                <input
                  type="number"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  step="0.0001"
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={!canAddMore}>
              Publicar Oferta
            </button>
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
                <button className="btn-delete" onClick={() => removeBusinessOffer(offer.id)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
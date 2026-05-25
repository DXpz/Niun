import { useState } from 'react'
import { useUserLocation } from '../hooks/useUserLocation'
import './LocationBanner.css'

interface Props {
  onLocationGranted: () => void
}

export function LocationBanner({ onLocationGranted }: Props) {
  const { grantPermission, denyPermission } = useUserLocation()
  const [visible, setVisible] = useState(true)

  const handleAllow = () => {
    grantPermission()
    setVisible(false)
    onLocationGranted()
  }

  const handleDeny = () => {
    denyPermission()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="location-banner">
      <div className="banner-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#FFD322" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div className="banner-content">
        <h4>Activa tu ubicación</h4>
        <p>Ve ofertas y tiendas cerca de ti</p>
      </div>
      <div className="banner-actions">
        <button className="btn-allow" onClick={handleAllow}>
          Permitir
        </button>
        <button className="btn-deny" onClick={handleDeny}>
          Ahora no
        </button>
      </div>
    </div>
  )
}
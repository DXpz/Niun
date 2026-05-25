import { useState, useEffect, useCallback } from 'react'

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error'

interface UserLocation {
  lat: number
  lng: number
  status: LocationStatus
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({
    lat: 13.6942,
    lng: -89.2202,
    status: 'idle'
  })

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, status: 'error' }))
      return
    }

    setLocation(prev => ({ ...prev, status: 'requesting' }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          status: 'granted'
        })
      },
      () => {
        setLocation(prev => ({ ...prev, status: 'denied' }))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('locationPermission')
    if (stored === 'granted') {
      requestLocation()
    }
  }, [requestLocation])

  const grantPermission = useCallback(() => {
    localStorage.setItem('locationPermission', 'granted')
    requestLocation()
  }, [requestLocation])

  const denyPermission = useCallback(() => {
    localStorage.setItem('locationPermission', 'denied')
    setLocation(prev => ({ ...prev, status: 'denied' }))
  }, [])

  return { location, grantPermission, denyPermission }
}

export function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
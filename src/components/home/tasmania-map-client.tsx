'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const TASMANIA_CENTER: [number, number] = [-42.0, 146.5]
const ZOOM = 7

const LOCATIONS = [
  { position: [-41.4419, 147.1453] as [number, number], label: 'Launceston' },
  { position: [-42.8821, 147.3272] as [number, number], label: 'Hobart' },
  { position: [-41.1767, 145.7071] as [number, number], label: 'Devonport' },
  { position: [-41.0541, 145.9271] as [number, number], label: 'Burnie' },
]

export default function TasmaniaMapClient() {
  useEffect(() => {
    // Fix Leaflet's broken default icon paths when bundled with Webpack
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet') as typeof import('leaflet')
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }, [])

  return (
    <MapContainer
      center={TASMANIA_CENTER}
      zoom={ZOOM}
      scrollWheelZoom={false}
      className="h-full w-full rounded-xl"
      style={{ background: '#162019' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {LOCATIONS.map(({ position, label }) => (
        <Marker key={label} position={position}>
          <Popup>{label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

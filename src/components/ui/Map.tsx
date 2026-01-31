import { cn } from '@/lib/utils'

interface MapProps {
  className?: string
}

export function Map({ className }: MapProps) {
  // Placeholder coordinates - replace with actual location
  const mapUrl =
    'https://frame.mapy.cz/s/gunopabuzo?x=14.4250000&y=50.0833333&z=15'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gray-100',
        className
      )}
    >
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa - Dentální hygiena"
        className="absolute inset-0"
      />
    </div>
  )
}

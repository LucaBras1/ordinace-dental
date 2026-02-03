import { cn } from '@/lib/utils'

interface MapProps {
  className?: string
}

export function Map({ className }: MapProps) {
  // Google Maps embed for Korunní 727/7, Praha 2
  const mapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.5!2d14.4380!3d50.0750!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b948f8e9e0e0f%3A0x0!2sKorunn%C3%AD%20727%2F7%2C%20120%2000%20Praha%202-Vinohrady!5e0!3m2!1scs!2scz!4v1700000000000!5m2!1scs!2scz'

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

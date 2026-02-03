import { cn } from '@/lib/utils'

interface ContactInfoProps {
  className?: string
  showHours?: boolean
}

const contactData = {
  phone: '+420 601 532 676',
  email: 'info@dentalni-hygiena.cz',
  address: {
    street: 'Korunní 727/7',
    city: 'Vinohrady',
    zip: '120 00',
  },
  hours: [
    { day: 'Pondělí', time: '13:00 - 18:00' },
    { day: 'Úterý', time: '8:00 - 12:00' },
    { day: 'Středa', time: '8:00 - 12:00, 13:00 - 14:00' },
    { day: 'Čtvrtek', time: 'Neordinuje' },
    { day: 'Pátek', time: '8:00 - 12:00' },
    { day: 'Sobota', time: 'Zavřeno' },
    { day: 'Neděle', time: 'Zavřeno' },
  ],
}

export function ContactInfo({ className, showHours = true }: ContactInfoProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Phone */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
          <svg
            className="h-6 w-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">Telefon</p>
          <a
            href={`tel:${contactData.phone.replace(/\s/g, '')}`}
            className="text-lg text-primary-600 transition-colors hover:text-primary-700"
          >
            {contactData.phone}
          </a>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
          <svg
            className="h-6 w-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">E-mail</p>
          <a
            href={`mailto:${contactData.email}`}
            className="text-lg text-primary-600 transition-colors hover:text-primary-700"
          >
            {contactData.email}
          </a>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
          <svg
            className="h-6 w-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">Adresa</p>
          <p className="text-gray-600">
            {contactData.address.street}
            <br />
            {contactData.address.zip} {contactData.address.city}
          </p>
        </div>
      </div>

      {/* Opening hours */}
      {showHours && (
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
            <svg
              className="h-6 w-6 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="mb-2 font-medium text-gray-900">Ordinační hodiny</p>
            <div className="space-y-1">
              {contactData.hours.map((item) => (
                <div
                  key={item.day}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600">{item.day}</span>
                  <span
                    className={cn(
                      'font-medium',
                      item.time === 'Zavřeno' || item.time === 'Neordinuje'
                        ? 'text-gray-400'
                        : 'text-gray-900'
                    )}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { contactData }

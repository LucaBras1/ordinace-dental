'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface Service {
  id: string
  name: string
  price: number
  duration: string
  description: string
  features: string[]
  recommended?: boolean
}

interface ServiceComparisonProps {
  services: Service[]
  className?: string
}

export function ServiceComparison({ services, className }: ServiceComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleService = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id)
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id]
      }
      return [...prev, id]
    })
  }

  const selectedServices = services.filter((s) => selectedIds.includes(s.id))
  const allFeatures = Array.from(
    new Set(selectedServices.flatMap((s) => s.features))
  )

  return (
    <div className={cn('space-y-8', className)}>
      {/* Service selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vyberte služby k porovnání (max. 3)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const isSelected = selectedIds.includes(service.id)
            return (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-soft'
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors flex-shrink-0',
                    isSelected
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  )}
                >
                  {isSelected && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{service.name}</span>
                    {service.recommended && (
                      <span className="flex-shrink-0 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700">
                        Doporučeno
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{service.price} Kč</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Comparison table */}
      {selectedServices.length >= 2 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-soft">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-4 text-left text-sm font-medium text-gray-500">
                  Vlastnost
                </th>
                {selectedServices.map((service) => (
                  <th
                    key={service.id}
                    className={cn(
                      'p-4 text-center',
                      service.recommended && 'bg-primary-50'
                    )}
                  >
                    <div className="font-semibold text-gray-900">{service.name}</div>
                    {service.recommended && (
                      <span className="mt-1 inline-block rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700">
                        Doporučeno
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price row */}
              <tr className="border-b border-gray-100">
                <td className="p-4 text-sm font-medium text-gray-700">Cena</td>
                {selectedServices.map((service) => (
                  <td
                    key={service.id}
                    className={cn(
                      'p-4 text-center',
                      service.recommended && 'bg-primary-50/50'
                    )}
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {service.price} Kč
                    </span>
                  </td>
                ))}
              </tr>

              {/* Duration row */}
              <tr className="border-b border-gray-100">
                <td className="p-4 text-sm font-medium text-gray-700">Doba trvání</td>
                {selectedServices.map((service) => (
                  <td
                    key={service.id}
                    className={cn(
                      'p-4 text-center text-gray-600',
                      service.recommended && 'bg-primary-50/50'
                    )}
                  >
                    {service.duration}
                  </td>
                ))}
              </tr>

              {/* Features rows */}
              {allFeatures.map((feature) => (
                <tr key={feature} className="border-b border-gray-100">
                  <td className="p-4 text-sm text-gray-700">{feature}</td>
                  {selectedServices.map((service) => {
                    const hasFeature = service.features.includes(feature)
                    return (
                      <td
                        key={service.id}
                        className={cn(
                          'p-4 text-center',
                          service.recommended && 'bg-primary-50/50'
                        )}
                      >
                        {hasFeature ? (
                          <svg
                            className="mx-auto h-5 w-5 text-accent-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="mx-auto h-5 w-5 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Action row */}
              <tr>
                <td className="p-4"></td>
                {selectedServices.map((service) => (
                  <td
                    key={service.id}
                    className={cn(
                      'p-4 text-center',
                      service.recommended && 'bg-primary-50/50'
                    )}
                  >
                    <Button
                      variant={service.recommended ? 'gradient' : 'outline'}
                      size="sm"
                    >
                      Objednat
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selectedServices.length === 1 && (
        <div className="text-center py-8 text-gray-500">
          Vyberte alespoň 2 služby pro porovnání
        </div>
      )}

      {selectedServices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Vyberte služby, které chcete porovnat
        </div>
      )}
    </div>
  )
}

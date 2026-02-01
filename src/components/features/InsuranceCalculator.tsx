'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/ui/GlassCard'

interface InsuranceCompany {
  id: string
  name: string
  contribution: number
  maxPerYear: number
}

interface Service {
  id: string
  name: string
  price: number
}

interface InsuranceCalculatorProps {
  insuranceCompanies: InsuranceCompany[]
  services: Service[]
  className?: string
}

export function InsuranceCalculator({
  insuranceCompanies,
  services,
  className,
}: InsuranceCalculatorProps) {
  const [selectedInsurance, setSelectedInsurance] = useState<string>('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const insurance = insuranceCompanies.find((i) => i.id === selectedInsurance)

  const calculation = useMemo(() => {
    const totalCost = services
      .filter((s) => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0)

    if (!insurance) {
      return { totalCost, contribution: 0, outOfPocket: totalCost, savings: 0 }
    }

    const contribution = Math.min(
      insurance.contribution * selectedServices.length,
      insurance.maxPerYear,
      totalCost
    )

    return {
      totalCost,
      contribution,
      outOfPocket: totalCost - contribution,
      savings: contribution,
    }
  }, [selectedServices, insurance, services])

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <div className={cn('grid gap-8 lg:grid-cols-2', className)}>
      {/* Selection panel */}
      <div className="space-y-6">
        {/* Insurance selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vaše pojišťovna
          </label>
          <div className="relative">
            <select
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 pr-10 text-gray-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            >
              <option value="">Vyberte pojišťovnu</option>
              {insuranceCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {insurance && (
            <p className="mt-2 text-sm text-gray-500">
              Příspěvek: {insurance.contribution} Kč/ošetření, max {insurance.maxPerYear} Kč/rok
            </p>
          )}
        </div>

        {/* Service selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vyberte služby
          </label>
          <div className="space-y-2">
            {services.map((service) => {
              const isSelected = selectedServices.includes(service.id)
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all',
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
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
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <span className="text-gray-600">{service.price} Kč</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results panel */}
      <div>
        <GlassCard className="sticky top-24" glow={calculation.savings > 0} glowColor="accent">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Kalkulace nákladů
          </h3>

          <div className="space-y-4">
            {/* Total cost */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <span className="text-gray-600">Celková cena služeb</span>
              <span className="text-lg font-semibold text-gray-900">
                {calculation.totalCost.toLocaleString('cs-CZ')} Kč
              </span>
            </div>

            {/* Insurance contribution */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Příspěvek pojišťovny</span>
              <span className={cn(
                'text-lg font-semibold',
                calculation.contribution > 0 ? 'text-accent-600' : 'text-gray-400'
              )}>
                -{calculation.contribution.toLocaleString('cs-CZ')} Kč
              </span>
            </div>

            {/* Out of pocket */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="font-medium text-gray-900">Vaše náklady</span>
              <span className="text-2xl font-bold text-primary-600">
                {calculation.outOfPocket.toLocaleString('cs-CZ')} Kč
              </span>
            </div>
          </div>

          {/* Savings badge */}
          {calculation.savings > 0 && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-accent-100 p-4">
              <svg
                className="h-6 w-6 text-accent-600 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-accent-800">
                  Ušetříte {calculation.savings.toLocaleString('cs-CZ')} Kč
                </p>
                <p className="text-sm text-accent-600">
                  Díky příspěvku od vaší pojišťovny
                </p>
              </div>
            </div>
          )}

          {!selectedInsurance && selectedServices.length > 0 && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-info-light p-4">
              <svg
                className="h-6 w-6 text-info flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-info-dark">
                Vyberte pojišťovnu pro zobrazení možných úspor
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

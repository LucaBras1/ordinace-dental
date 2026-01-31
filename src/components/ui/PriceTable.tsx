import { cn } from '@/lib/utils'

interface PriceItem {
  name: string
  description?: string
  price: string
  note?: string
}

interface PriceTableProps {
  title?: string
  items: PriceItem[]
  className?: string
}

export function PriceTable({ title, items, className }: PriceTableProps) {
  return (
    <div className={cn('rounded-2xl bg-white p-6 shadow-card', className)}>
      {title && <h3 className="heading-4 mb-6">{title}</h3>}
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              {item.description && (
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 sm:text-right">
              <span className="text-lg font-semibold text-primary-600">
                {item.price}
              </span>
              {item.note && (
                <span className="text-sm text-gray-400">({item.note})</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

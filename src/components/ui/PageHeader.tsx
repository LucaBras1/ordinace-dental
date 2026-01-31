import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  centered?: boolean
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  centered = true,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 md:py-20">
      {/* Decorative elements */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent-100/50 blur-3xl" />

      <div className="container-custom relative">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className={centered ? 'flex justify-center' : ''}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div className={centered ? 'text-center' : ''}>
          <h1 className="heading-1 mt-4 text-balance">{title}</h1>
          {subtitle && (
            <p className="body-large mx-auto mt-4 max-w-2xl text-balance">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

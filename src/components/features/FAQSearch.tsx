'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
  category: string
}

interface FAQSearchProps {
  items: FAQItem[]
  categories?: string[]
  className?: string
}

export function FAQSearch({ items, categories, className }: FAQSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const allCategories = useMemo(() => {
    if (categories) return categories
    return Array.from(new Set(items.map((item) => item.category)))
  }, [items, categories])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === null || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, selectedCategory])

  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-primary-100 text-primary-800 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Hledat v otázkách..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Vymazat hledání"
          >
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selectedCategory === null
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Vše
        </button>
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              selectedCategory === category
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-gray-500">
          Nalezeno {filteredItems.length} {filteredItems.length === 1 ? 'výsledek' : filteredItems.length < 5 ? 'výsledky' : 'výsledků'}
        </p>
      )}

      {/* FAQ items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-gray-500">Žádné výsledky nenalezeny</p>
            <p className="text-sm text-gray-400">Zkuste jiný hledaný výraz</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-soft"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {highlightText(item.question, searchQuery)}
                </span>
                <svg
                  className={cn(
                    'h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0',
                    openIndex === index && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <div className="px-5 pb-5 text-gray-600">
                  {highlightText(item.answer, searchQuery)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useToast, type Toast, type ToastType } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  success: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
  warning: (title: string, description?: string) => string
  info: (title: string, description?: string) => string
}

const ToastContext = createContext<ToastContextValue | null>(null)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, addToast, removeToast, clearToasts } = useToast()

  const createToastMethod = (type: ToastType) => (title: string, description?: string) => {
    return addToast({ type, title, description })
  }

  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success: createToastMethod('success'),
    error: createToastMethod('error'),
    warning: createToastMethod('warning'),
    info: createToastMethod('info'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  variantId: string
  title: string
  unitPriceAmount: string
  currencyCode: string
  imageUrl?: string | null
  quantity: number
}

const MAX_LINE_QUANTITY = 20

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
  updateQuantity: (variantId: string, quantity: number) => void
  removeItem: (variantId: string) => void
  clearCart: () => void
  totalQuantity: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity: number) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.variantId === item.variantId)
        if (existing) {
          return prev.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_LINE_QUANTITY) }
              : i,
          )
        }
        return [...prev, { ...item, quantity: Math.min(quantity, MAX_LINE_QUANTITY) }]
      })
    },
    [],
  )

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.variantId !== variantId)
      }
      return prev.map((i) =>
        i.variantId === variantId
          ? { ...i, quantity: Math.min(quantity, MAX_LINE_QUANTITY) }
          : i,
      )
    })
  }, [])

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, clearCart, totalQuantity }),
    [items, addItem, updateQuantity, removeItem, clearCart, totalQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}

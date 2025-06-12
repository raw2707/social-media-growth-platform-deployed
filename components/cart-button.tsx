"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/providers/cart-provider"

export default function CartButton() {
  const { getCartItemCount, setIsCartOpen } = useCart()
  const itemCount = getCartItemCount()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsCartOpen(true)}
      className="relative hover:bg-purple-50 hover:border-purple-300 transition-colors duration-200"
    >
      <ShoppingCart size={16} className="text-gray-700" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-purple-600 text-white text-xs animate-pulse">
          {itemCount}
        </Badge>
      )}
    </Button>
  )
}

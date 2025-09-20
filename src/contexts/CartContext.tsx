import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void; // Changed from number to string
  updateQuantity: (itemId: string, quantity: number) => void; // Changed from number to string
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartInfoOpen: boolean;
  openCartInfo: () => void;
  closeCartInfo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartInfoOpen, setIsCartInfoOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));

    // Auto-close CartInfo when cart becomes empty
    if (cartItems.length === 0) {
      setIsCartInfoOpen(false);
    }
  }, [cartItems]);

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price.replace(/,/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  const openCartInfo = () => {
    setIsCartInfoOpen(true);
  };

  const closeCartInfo = () => {
    setIsCartInfoOpen(false);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartInfoOpen,
    openCartInfo,
    closeCartInfo,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

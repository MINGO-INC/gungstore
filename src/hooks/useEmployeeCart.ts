import { useState, useCallback } from 'react';
import {
  Product,
  OrderItem,
  CUSTOMER_TYPES,
  COMMISSION_RATE,
} from '@/lib/index';

/**
 * Custom hook for managing individual employee cart state
 * Handles complex logic for discounts, commissions, and ledger splits
 */
export function useEmployeeCart() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [customerType, setCustomerTypeState] = useState<string>('standard');

  // Helper to calculate order item details based on current customer type
  const calculateItemDetails = useCallback((product: Product, quantity: number, typeId: string) => {
    const type = Object.values(CUSTOMER_TYPES).find((t) => t.id === typeId) || CUSTOMER_TYPES.STANDARD;
    const discountRate = type.discount;
    
    const unitPrice = product.price;
    const discountedPrice = unitPrice * (1 - discountRate);
    const totalPrice = discountedPrice * quantity;
    const commission = totalPrice * COMMISSION_RATE;

    return {
      productId: product.id,
      name: product.name,
      unitPrice,
      quantity,
      discountedPrice,
      totalPrice,
      commission,
    };
  }, []);

  // Update all items when customer type changes
  const setCustomerType = useCallback((typeId: string) => {
    setCustomerTypeState(typeId);
    setItems((prevItems) =>
      prevItems.map((item) => {
        // Re-calculate based on original product price (stored as unitPrice)
        const type = Object.values(CUSTOMER_TYPES).find((t) => t.id === typeId) || CUSTOMER_TYPES.STANDARD;
        const discountRate = type.discount;
        const discountedPrice = item.unitPrice * (1 - discountRate);
        const totalPrice = discountedPrice * item.quantity;
        const commission = totalPrice * COMMISSION_RATE;

        return {
          ...item,
          discountedPrice,
          totalPrice,
          commission,
        };
      })
    );
  }, []);

  const addToCart = useCallback((product: Product, quantity: number) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQuantity = updated[existingIndex].quantity + quantity;
        const details = calculateItemDetails(product, newQuantity, customerType);
        updated[existingIndex] = details;
        return updated;
      }

      return [...prev, calculateItemDetails(product, quantity, customerType)];
    });
  }, [customerType, calculateItemDetails]);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const resetCart = useCallback(() => {
    setItems([]);
    setCustomerTypeState('standard');
  }, []);

  return {
    items,
    customerType,
    setCustomerType,
    addToCart,
    removeFromCart,
    resetCart,
  };
}

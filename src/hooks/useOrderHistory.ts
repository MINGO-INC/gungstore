import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/lib/index';

const STORAGE_KEY = 'tlca_order_history_v1';

/**
 * Custom hook for managing order history state with localStorage persistence.
 * Designed to handle the long-term storage of completed transactions for the TLCA Gun Register.
 */
export function useOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedOrders = JSON.parse(saved);
          // Ensure dates are handled correctly if needed, though they are stored as strings in the Order interface
          setOrders(parsedOrders);
        }
      } catch (error) {
        console.error('TLCA Register: Failed to load order history from ledger.', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  /**
   * Adds a new order to the top of the history list and persists to localStorage.
   */
  const addOrder = useCallback((order: Order) => {
    setOrders((prevOrders) => {
      const updatedOrders = [order, ...prevOrders];
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
      } catch (error) {
        console.error('TLCA Register: Failed to write transaction to local ledger.', error);
      }
      
      return updatedOrders;
    });
  }, []);

  /**
   * Completely wipes the history from state and storage.
   */
  const clearHistory = useCallback(() => {
    setOrders([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('TLCA Register: Failed to clear ledger.', error);
    }
  }, []);

  /**
   * Retrieves a specific order by ID.
   */
  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id);
  }, [orders]);

  return {
    orders,
    addOrder,
    clearHistory,
    getOrderById,
    isLoading
  };
}

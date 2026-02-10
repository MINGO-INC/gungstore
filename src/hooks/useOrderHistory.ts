import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/lib/index';
import { supabase } from '@/lib/supabase';
import type { Json } from '@/lib/database.types';

const STORAGE_KEY = 'tlca_order_history_v1';
const STORAGE_EVENT = 'tlca_order_history_updated';

/**
 * Custom hook for managing order history state with Supabase database persistence.
 * Falls back to localStorage when database is unavailable (offline mode).
 * Designed to handle the long-term storage of completed transactions for the TLCA Gun Register.
 */
export function useOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useOfflineMode, setUseOfflineMode] = useState(false);

  // Initial load from Supabase (or localStorage if offline)
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) {
          console.warn('TLCA Register: Database unavailable, using offline mode.', error);
          setUseOfflineMode(true);
          // Fallback to localStorage
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsedOrders = JSON.parse(saved);
            setOrders(parsedOrders);
          }
        } else {
          // Convert database format to Order format
          const formattedOrders: Order[] = (data || []).map((dbOrder) => ({
            id: dbOrder.id,
            employeeId: dbOrder.employee_id,
            employeeName: dbOrder.employee_name,
            customerType: dbOrder.customer_type,
            items: dbOrder.items as Order['items'],
            totalAmount: dbOrder.total_amount,
            totalCommission: dbOrder.total_commission,
            ledgerAmount: dbOrder.ledger_amount,
            timestamp: dbOrder.timestamp,
          }));
          setOrders(formattedOrders);
          // Sync to localStorage as backup
          localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedOrders));
        }
      } catch (error) {
        console.error('TLCA Register: Failed to load order history.', error);
        setUseOfflineMode(true);
        // Fallback to localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedOrders = JSON.parse(saved);
          setOrders(parsedOrders);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Load initial data
    loadOrders();

    // Listen for custom event when orders are updated
    const handleOrdersUpdated = () => {
      loadOrders();
    };

    window.addEventListener(STORAGE_EVENT, handleOrdersUpdated);

    return () => {
      window.removeEventListener(STORAGE_EVENT, handleOrdersUpdated);
    };
  }, []);

  /**
   * Adds a new order to the history and persists to Supabase (or localStorage if offline).
   */
  const addOrder = useCallback(async (order: Order) => {
    try {
      if (!useOfflineMode) {
        // Try to save to Supabase
        const { error } = await supabase
          .from('orders')
          .insert({
            id: order.id,
            employee_id: order.employeeId,
            employee_name: order.employeeName,
            customer_type: order.customerType,
            items: order.items as unknown as Json,
            total_amount: order.totalAmount,
            total_commission: order.totalCommission,
            ledger_amount: order.ledgerAmount,
            timestamp: order.timestamp,
          });

        if (error) {
          console.warn('TLCA Register: Failed to save to database, using offline mode.', error);
          setUseOfflineMode(true);
          // Fall through to localStorage save
        } else {
          console.log('TLCA Register: Order saved to database successfully.');
        }
      }
      
      // Update state and localStorage using functional form to avoid race conditions
      setOrders((prevOrders) => {
        const updatedOrders = [order, ...prevOrders];
        // Always save to localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
        return updatedOrders;
      });
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch (error) {
      console.error('TLCA Register: Failed to save order.', error);
      // Ensure localStorage fallback using functional state update
      setOrders((prevOrders) => {
        const updatedOrders = [order, ...prevOrders];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
        return updatedOrders;
      });
      window.dispatchEvent(new Event(STORAGE_EVENT));
    }
  }, [useOfflineMode]);

  /**
   * Completely wipes the history from state and storage (both database and localStorage).
   */
  const clearHistory = useCallback(async () => {
    try {
      if (!useOfflineMode) {
        // Try to delete all orders from Supabase
        const { error } = await supabase
          .from('orders')
          .delete()
          .neq('id', ''); // Delete all records

        if (error) {
          console.warn('TLCA Register: Failed to clear database, clearing locally only.', error);
        } else {
          console.log('TLCA Register: Database history cleared successfully.');
        }
      }
      
      // Always clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      setOrders([]);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch (error) {
      console.error('TLCA Register: Failed to clear history.', error);
      // Clear local state anyway
      localStorage.removeItem(STORAGE_KEY);
      setOrders([]);
      window.dispatchEvent(new Event(STORAGE_EVENT));
    }
  }, [useOfflineMode]);

  /**
   * Retrieves a specific order by ID.
   */
  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id);
  }, [orders]);

  /**
   * Deletes a specific order by ID from both database and localStorage.
   */
  const deleteOrder = useCallback(async (id: string) => {
    try {
      if (!useOfflineMode) {
        // Try to delete from Supabase
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('TLCA Register: Failed to delete from database, deleting locally only.', error);
        } else {
          console.log('TLCA Register: Order deleted from database successfully.');
        }
      }
      
      // Update state and localStorage using functional form to avoid race conditions
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.filter(order => order.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
        return updatedOrders;
      });
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch (error) {
      console.error('TLCA Register: Failed to delete order.', error);
      // Delete locally anyway using functional state update
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.filter(order => order.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
        return updatedOrders;
      });
      window.dispatchEvent(new Event(STORAGE_EVENT));
    }
  }, [useOfflineMode]);

  return {
    orders,
    addOrder,
    clearHistory,
    deleteOrder,
    getOrderById,
    isLoading,
    useOfflineMode
  };
}

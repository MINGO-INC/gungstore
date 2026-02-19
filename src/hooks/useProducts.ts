import { useCallback, useEffect, useMemo, useState } from 'react';
import { Product, PRODUCTS, SPECIALS } from '@/lib/index';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'tlca_products_v1';
const STORAGE_EVENT = 'tlca_products_updated';

const DEFAULT_PRODUCTS: Product[] = [...PRODUCTS, ...SPECIALS];

function createProductId(category: string) {
  return `${category.slice(0, 2).toLowerCase()}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function loadProductsFromStorage(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('TLCA Register: Failed to read product list, using defaults.', error);
  }
  return DEFAULT_PRODUCTS;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => loadProductsFromStorage());
  const [isLoadingFromDB, setIsLoadingFromDB] = useState(true);

  const persistProducts = useCallback((next: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  useEffect(() => {
    const loadFromDatabase = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('id, name, price, category, description')
            .eq('is_active', true);
          if (error) {
            console.warn('Failed to load products from database:', error);
            setIsLoadingFromDB(false);
            return;
          }
          if (data && data.length > 0) {
            const mapped: Product[] = data.map((row) => ({
              id: row.id,
              name: row.name,
              price: row.price,
              category: row.category as Product['category'],
              description: row.description ?? undefined,
            }));
            setProducts(mapped);
            persistProducts(mapped);
          }
        } catch (error) {
          console.warn('Failed to load products from database:', error);
        } finally {
          setIsLoadingFromDB(false);
        }
      } else {
        setIsLoadingFromDB(false);
      }
    };

    loadFromDatabase();

    let unsubscribe: (() => void) | null = null;
    if (supabase) {
      try {
        const subscription = supabase
          .channel('products_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                const row = payload.new as {
                  id: string;
                  name: string;
                  price: number;
                  category: Product['category'];
                  description: string | null;
                  is_active: boolean;
                };
                if (!row.is_active) return;
                const newProduct: Product = {
                  id: row.id,
                  name: row.name,
                  price: row.price,
                  category: row.category,
                  description: row.description ?? undefined,
                };
                setProducts((prev) => {
                  if (prev.find((p) => p.id === newProduct.id)) return prev;
                  const updated = [...prev, newProduct];
                  persistProducts(updated);
                  return updated;
                });
              } else if (payload.eventType === 'UPDATE') {
                const row = payload.new as {
                  id: string;
                  name: string;
                  price: number;
                  category: Product['category'];
                  description: string | null;
                  is_active: boolean;
                };
                setProducts((prev) => {
                  let updated: Product[];
                  if (!row.is_active) {
                    // Deactivated — treat as removal
                    updated = prev.filter((p) => p.id !== row.id);
                  } else {
                    const exists = prev.find((p) => p.id === row.id);
                    const updatedProduct: Product = {
                      id: row.id,
                      name: row.name,
                      price: row.price,
                      category: row.category,
                      description: row.description ?? undefined,
                    };
                    updated = exists
                      ? prev.map((p) => (p.id === row.id ? updatedProduct : p))
                      : [...prev, updatedProduct];
                  }
                  persistProducts(updated);
                  return updated;
                });
              } else if (payload.eventType === 'DELETE') {
                const oldId = (payload.old as { id: string }).id;
                setProducts((prev) => {
                  const updated = prev.filter((p) => p.id !== oldId);
                  persistProducts(updated);
                  return updated;
                });
              }
            }
          )
          .subscribe();

        unsubscribe = () => {
          supabase.removeChannel(subscription);
        };
      } catch (error) {
        console.warn('Failed to subscribe to product updates:', error);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [persistProducts]);

  const handleStorage = useCallback((event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    if (event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue) as Product[];
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        }
      } catch (error) {
        console.warn('TLCA Register: Failed to sync product list.', error);
      }
    }
  }, []);

  const handleCustomEvent = useCallback(() => {
    setProducts(loadProductsFromStorage());
  }, []);

  useEffect(() => {
    window.addEventListener('storage', handleStorage);
    window.addEventListener(STORAGE_EVENT, handleCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleCustomEvent);
    };
  }, []);

  const addProduct = useCallback(
    async (
      name: string,
      price: number,
      category: Product['category'],
      description?: string,
    ) => {
      const trimmedName = name.trim();
      if (!trimmedName || price < 0) return null;

      const newProduct: Product = {
        id: createProductId(category),
        name: trimmedName,
        price,
        category,
        description: description?.trim() || undefined,
      };

      setProducts((prev) => {
        const next = [...prev, newProduct];
        persistProducts(next);
        return next;
      });

      if (supabase) {
        try {
          const { error } = await supabase.from('products').insert({
            id: newProduct.id,
            name: newProduct.name,
            price: newProduct.price,
            category: newProduct.category,
            description: newProduct.description ?? null,
            is_active: true,
            is_special: newProduct.category === 'Specials',
          });
          if (error) {
            console.error('Failed to add product to database:', error);
            setProducts((prev) => prev.filter((p) => p.id !== newProduct.id));
            return null;
          }
        } catch (error) {
          console.error('Failed to add product to database:', error);
          setProducts((prev) => prev.filter((p) => p.id !== newProduct.id));
          return null;
        }
      }

      return newProduct;
    },
    [persistProducts],
  );

  const removeProduct = useCallback(
    async (productId: string) => {
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== productId);
        persistProducts(next);
        return next;
      });

      if (supabase) {
        try {
          // Soft-delete by marking inactive so order history retains references
          await supabase
            .from('products')
            .update({ is_active: false })
            .eq('id', productId);
        } catch (error) {
          console.error('Failed to remove product from database:', error);
        }
      }
    },
    [persistProducts],
  );

  const regularProducts = useMemo(
    () => products.filter((p) => p.category !== 'Specials'),
    [products],
  );

  const specialProducts = useMemo(
    () => products.filter((p) => p.category === 'Specials'),
    [products],
  );

  return {
    products,
    regularProducts,
    specialProducts,
    addProduct,
    removeProduct,
    isLoadingFromDB,
  };
}

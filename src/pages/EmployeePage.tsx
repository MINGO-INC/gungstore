import React, { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useEmployeeCart } from '@/hooks/useEmployeeCart';
import { useEmployees } from '@/hooks/useEmployees';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { CartSummary } from '@/components/CartSummary';
import { springPresets } from '@/lib/motion';

/**
 * Individual Employee Sales Page
 * Provides a tailored sales interface for specific staff members
 */
const EmployeePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { employees } = useEmployees();
  const { products } = useProducts();
  const employee = employees.find((e) => e.slug === slug);
  
  const {
    items,
    customerType,
    setCustomerType,
    addToCart,
    addExtraCharge,
    removeFromCart,
    resetCart,
  } = useEmployeeCart();

  const [activeCategory, setActiveCategory] = useState<string>('Pistols');
  const [productSearch, setProductSearch] = useState('');

  // Use products from the hook (supports real-time updates from Settings)
  const allAvailableProducts = useMemo(() => products, [products]);

  const categoryCounts = useMemo(
    () =>
      allAvailableProducts.reduce<Record<string, number>>((acc, product) => {
        acc[product.category] = (acc[product.category] ?? 0) + 1;
        return acc;
      }, {}),
    [allAvailableProducts]
  );

  // Filter products based on active tab
  const filteredProducts = useMemo(() => {
    const normalizedSearch = productSearch.trim().toLowerCase();
    return allAvailableProducts.filter((p) => {
      if (p.category !== activeCategory) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      return (
        p.name.toLowerCase().includes(normalizedSearch) ||
        p.description?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [allAvailableProducts, activeCategory, productSearch]);

  if (!employee) {
    return <Navigate to="/" replace />;
  }

  const categories = ['Pistols', 'Revolvers', 'Rifles', 'Shotguns', 'Repeaters', 'Consumables', 'Specials'];
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleCheckout = () => {
    // The CartSummary component handles the data persistence to order history internally
    // by using the useOrderHistory hook to add the completed order.
    // This callback handles the page reset and visual feedback.
    resetCart();
    setActiveCategory('Pistols');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-background">
      {/* Main Product Selection Area */}
      <main className="flex-1 p-6 lg:p-8 border-r border-border">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-2 font-mono uppercase tracking-widest text-primary border-primary/30">
                Authorized Agent
              </Badge>
              <h1 className="text-2xl sm:text-4xl font-heading text-foreground">
                {employee.name}'s Register
              </h1>
              <p className="text-muted-foreground font-sans mt-1">
                Log of sales and inventory acquisitions for current shift.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
              <span>Date: {new Date().toLocaleDateString()}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Station: 01-A</span>
            </div>
          </header>

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-card/70 p-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Cart Items</p>
              <p className="text-xl font-semibold">{cartItemCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-card/70 p-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Running Total</p>
              <p className="text-xl font-semibold text-primary">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartTotal)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/70 p-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Customer Type</p>
              <p className="text-sm font-semibold capitalize">{customerType.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder={`Search ${activeCategory.toLowerCase()} inventory...`}
              className="pl-10 bg-card/70"
            />
          </div>

          <Tabs 
            defaultValue="Pistols" 
            onValueChange={setActiveCategory}
            className="w-full space-y-8"
          >
            <div className="overflow-x-auto pb-1">
              <TabsList className="bg-muted/50 p-1 border border-border/50 w-max min-w-full">
                {categories.map((cat) => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat} 
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium"
                  >
                    {cat}
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono leading-none">
                      {categoryCounts[cat] ?? 0}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent 
                key={activeCategory}
                value={activeCategory} 
                className="mt-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={springPresets.gentle}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-muted rounded-xl">
                      <p className="text-muted-foreground font-mono italic">
                        Inventory currently depleted in this category.
                      </p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </main>

      {/* Side Ledger / Cart Summary */}
      <aside className="w-full lg:w-[400px] xl:w-[450px] bg-card/30 flex flex-col">
        <div className="lg:sticky lg:top-20 p-6 lg:p-8 lg:h-[calc(100vh-80px)]">
          <ScrollArea className="lg:h-full pr-4">
            <CartSummary
              employeeId={employee.id}
              employeeName={employee.name}
              cartItems={items}
              customerType={customerType}
              onCustomerTypeChange={setCustomerType}
              onCheckout={handleCheckout}
              onReset={resetCart}
              onRemoveItem={removeFromCart}
              onAddExtraCharge={addExtraCharge}
            />
            
            {/* Additional Ledger Context */}
            <div className="mt-12 p-4 border border-border rounded-lg bg-background/50 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-tighter text-muted-foreground">
                Transaction Policy
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All sales must be logged in the permanent ledger. Employee commissions are calculated at 30% of net profit after discounts. Law & Doc discounts require badge verification.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span>Current Session Efficiency:</span>
                  <span className="text-primary">98.4%</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>
  );
};

export default EmployeePage;
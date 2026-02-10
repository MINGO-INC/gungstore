import React, { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  EMPLOYEES, 
  PRODUCTS, 
  SPECIALS, 
  Product 
} from '@/lib/index';
import { useEmployeeCart } from '@/hooks/useEmployeeCart';
import { ProductCard } from '@/components/ProductCard';
import { CartSummary } from '@/components/CartSummary';
import { springPresets } from '@/lib/motion';

/**
 * Individual Employee Sales Page
 * Provides a tailored sales interface for specific staff members
 */
const EmployeePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const employee = EMPLOYEES.find((e) => e.slug === slug);
  
  const {
    items,
    customerType,
    setCustomerType,
    addToCart,
    resetCart,
    totals,
  } = useEmployeeCart();

  const [activeCategory, setActiveCategory] = useState<string>('Long Arms');

  // Combine regular products and specials for easy filtering
  const allAvailableProducts = useMemo(() => [...PRODUCTS, ...SPECIALS], []);

  // Filter products based on active tab
  const filteredProducts = useMemo(() => {
    return allAvailableProducts.filter((p) => p.category === activeCategory);
  }, [allAvailableProducts, activeCategory]);

  if (!employee) {
    return <Navigate to="/" replace />;
  }

  const categories = ['Long Arms', 'Side Arms', 'Ammo & Accessories', 'Specials'];

  const handleCheckout = () => {
    // The CartSummary component handles the data persistence to order history internally
    // by using the useOrderHistory hook to add the completed order.
    // This callback handles the page reset and visual feedback.
    resetCart();
    setActiveCategory('Long Arms');
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
              <h1 className="text-4xl font-heading text-foreground">
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

          <Tabs 
            defaultValue="Long Arms" 
            onValueChange={setActiveCategory}
            className="w-full space-y-8"
          >
            <TabsList className="bg-muted/50 p-1 border border-border/50">
              {categories.map((cat) => (
                <TabsTrigger 
                  key={cat} 
                  value={cat} 
                  className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

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
        <div className="sticky top-20 p-6 lg:p-8 h-[calc(100vh-80px)]">
          <ScrollArea className="h-full pr-4">
            <CartSummary
              employeeId={employee.id}
              employeeName={employee.name}
              cartItems={items}
              customerType={customerType}
              onCustomerTypeChange={setCustomerType}
              onCheckout={handleCheckout}
              onReset={resetCart}
            />
            
            {/* Additional Ledger Context */}
            <div className="mt-12 p-4 border border-border rounded-lg bg-background/50 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-tighter text-muted-foreground">
                Transaction Policy
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All sales must be logged in the permanent ledger. Employee commissions are calculated at 25% of net profit after discounts. Law & Doc discounts require badge verification.
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
import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

/**
 * ProductCard Component
 * 
 * Displays a firearm or accessory with the TLCA 'Frontier Ledger' aesthetic.
 * Features tactile quantity controls and a primary brass-themed action button.
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAdd = () => {
    onAddToCart(product, quantity);
    // Reset quantity after adding to cart for next selection
    setQuantity(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setQuantity(val);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="group relative flex flex-col h-full bg-card border border-border rounded-md shadow-sm overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Header Section: Category & Price */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-0.5 border border-border rounded-full bg-muted/40">
            {product.category}
          </span>
          <span className="font-mono text-base font-semibold text-secondary-foreground/80">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        {/* Product Info */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 italic mb-6 leading-relaxed">
            "{product.description}"
          </p>
        )}
        
        {/* Action Area: Quantity & Add to Register */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between bg-muted/20 rounded-sm border border-border/50 p-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase px-2 tracking-tighter">
              Quantity
            </span>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleInputChange}
                className="h-8 w-12 text-center font-mono text-sm border-none bg-transparent focus-visible:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Button 
  onClick={handleAdd}
  style={{ backgroundColor: '#0047AB' }}
  className="w-full hover:opacity-90 text-white font-semibold shadow-sm border-t border-white/10 transition-all active:scale-[0.98] cursor-pointer"
>
  <ShoppingCart className="mr-2 h-4 w-4" />
  Add to Cart
</Button>
        </div>
      </div>
      
      {/* Decorative metal trim effect on hover */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}

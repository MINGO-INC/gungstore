import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { OrderItem, CUSTOMER_TYPES, Order } from '@/lib/index';
import {
  Receipt,
  User,
  Gavel,
  RotateCcw,
  CheckCircle2,
  BadgePercent,
  Landmark,
  X,
  ShoppingCart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderHistory } from '@/hooks/useOrderHistory';

interface CartSummaryProps {
  employeeId: string;
  employeeName: string;
  cartItems: OrderItem[];
  customerType: string;
  onCustomerTypeChange: (type: string) => void;
  onCheckout: () => void;
  onReset: () => void;
  onRemoveItem: (productId: string) => void;
}

export function CartSummary({
  employeeId,
  employeeName,
  cartItems,
  customerType,
  onCustomerTypeChange,
  onCheckout,
  onReset,
  onRemoveItem,
}: CartSummaryProps) {
  const { addOrder } = useOrderHistory();
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalCommission = cartItems.reduce((acc, item) => acc + item.commission, 0);
  const ledgerAmount = totalAmount - totalCommission;
  const totalDiscount = subtotal - totalAmount;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Create order object and add to history
    const order: Order = {
      id: crypto.randomUUID(),
      employeeId,
      employeeName,
      customerType,
      items: cartItems,
      totalAmount,
      totalCommission,
      ledgerAmount,
      timestamp: new Date().toISOString(),
    };

    addOrder(order);
    onCheckout();
  };

  return (
    <Card className="border-border shadow-sm bg-card overflow-hidden sticky top-24">
      <CardHeader className="bg-secondary/5 border-b border-border py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Register Summary
          </CardTitle>
          <Badge variant="outline" className="font-mono uppercase tracking-wider">
            {employeeName}'s Ledger
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Customer Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" />
            Customer Designation
          </label>
          <Select value={customerType} onValueChange={onCustomerTypeChange}>
            <SelectTrigger className="bg-background/50 border-border">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CUSTOMER_TYPES).map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="opacity-50" />

        {/* Cart Items List */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
            <ShoppingCart className="w-3 h-3" />
            Items in Cart
          </label>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
              No items added yet
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-background/50 border border-border rounded-lg p-3 flex items-start justify-between gap-2 hover:bg-background/80 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm text-foreground truncate">
                          {item.name}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground shrink-0">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {formatCurrency(item.unitPrice)} ea.
                        </span>
                        {item.discountedPrice < item.unitPrice && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0">
                            -{Math.round((1 - item.discountedPrice / item.unitPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-foreground mt-1">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onRemoveItem(item.productId)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <Separator className="opacity-50" />

        {/* Financial Breakdown */}
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Gross Total ({itemCount} items)</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <AnimatePresence mode="wait">
            {totalDiscount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex justify-between items-center text-destructive"
              >
                <span className="flex items-center gap-1">
                  <BadgePercent className="w-3 h-3" />
                  Applied Discount
                </span>
                <span>-{formatCurrency(totalDiscount)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center text-lg font-bold text-foreground pt-2 border-t border-dashed border-border">
            <span className="font-heading uppercase tracking-tight">Final Total</span>
            <span className="text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Commission/Ledger Split */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
          <div className="flex justify-between items-center text-xs font-semibold uppercase text-muted-foreground">
            <span className="flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              Ledger (75%)
            </span>
            <span>{formatCurrency(ledgerAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold uppercase text-accent-foreground">
            <span className="flex items-center gap-1">
              <Gavel className="w-3 h-3" />
              Commission (35%)
            </span>
            <span>{formatCurrency(totalCommission)}</span>
          </div>
          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden flex">
            <div className="h-full bg-secondary" style={{ width: '75%' }} />
            <div className="h-full bg-primary" style={{ width: '25%' }} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pb-6">
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 shadow-lg active:scale-[0.98] transition-all"
          disabled={cartItems.length === 0}
          onClick={handleCheckout}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          CLOSE REGISTER & CHECKOUT
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive font-medium"
          onClick={onReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Wipe Current Ledger
        </Button>

        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest pt-2">
          Authorized TLCA Signature Required Upon Print
        </p>
      </CardFooter>
    </Card>
  );
}

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
import { OrderItem, CUSTOMER_TYPES } from '@/lib/index';
import {
  Receipt,
  User,
  Wallet,
  Gavel,
  RotateCcw,
  CheckCircle2,
  BadgePercent,
  Landmark,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartSummaryProps {
  employeeName: string;
  cartItems: OrderItem[];
  customerType: string;
  onCustomerTypeChange: (type: string) => void;
  onCheckout: () => void;
  onReset: () => void;
}

export function CartSummary({
  employeeName,
  cartItems,
  customerType,
  onCustomerTypeChange,
  onCheckout,
  onReset,
}: CartSummaryProps) {
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
              Commission (25%)
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
          onClick={onCheckout}
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

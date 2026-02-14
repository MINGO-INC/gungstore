import React, { useMemo } from 'react';
import { Order } from '@/lib/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Package } from 'lucide-react';

interface BestSellersTableProps {
  orders: Order[];
}

interface ProductStats {
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  averagePrice: number;
  totalSales: number;
}

/**
 * Best Sellers Analytics Table
 * Tracks which items are selling best by quantity and revenue.
 * © 2026 TLCA Inventory Systems
 */
export function BestSellersTable({ orders }: BestSellersTableProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const bestSellers = useMemo(() => {
    const productMap = new Map<string, ProductStats>();

    // Aggregate all items from all orders
    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productName = item.name || 'Unknown Product';
          const quantity = item.quantity || 1;
          const totalPrice = item.totalPrice || 0;
          const unitPrice = item.unitPrice || 0;

          if (productMap.has(productName)) {
            const existing = productMap.get(productName)!;
            existing.totalQuantity += quantity;
            existing.totalRevenue += totalPrice;
            existing.totalSales += 1;
            existing.averagePrice = existing.totalRevenue / existing.totalQuantity;
          } else {
            productMap.set(productName, {
              name: productName,
              totalQuantity: quantity,
              totalRevenue: totalPrice,
              averagePrice: unitPrice,
              totalSales: 1,
            });
          }
        });
      }
    });

    // Sort by quantity sold (descending)
    return Array.from(productMap.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );
  }, [orders]);

  if (bestSellers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-xl bg-card/50">
        <Package className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground font-medium">No sales data available.</p>
        <p className="text-sm text-muted-foreground/70">Complete some orders to see best sellers analysis.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <ScrollArea className="h-[600px] w-full">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span>Product Name</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Units Sold</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <span>Transactions</span>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <span>Avg. Price/Unit</span>
              </TableHead>
              <TableHead className="text-right font-semibold text-accent-foreground">
                <span>Total Revenue</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bestSellers.map((product, index) => (
              <TableRow key={product.name} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    {product.name}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-lg">
                  {product.totalQuantity}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {product.totalSales}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(product.averagePrice)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-accent-foreground">
                  {formatCurrency(product.totalRevenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
        <p className="text-xs text-muted-foreground italic">
          * Products ranked by units sold (quantity)
        </p>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Items Sold</p>
            <p className="text-sm font-mono font-bold">
              {bestSellers.reduce((acc, curr) => acc + curr.totalQuantity, 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Revenue</p>
            <p className="text-sm font-mono font-bold text-accent-foreground">
              {formatCurrency(bestSellers.reduce((acc, curr) => acc + curr.totalRevenue, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

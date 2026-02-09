import React from 'react';
import { Order } from '@/lib/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, User, CreditCard, DollarSign, Calendar } from 'lucide-react';

interface OrderHistoryTableProps {
  orders: Order[];
}

/**
 * TLCA Gun Register - Order History Ledger
 * Displays completed transactions in a vintage ledger format.
 * © 2026 TLCA Inventory Systems
 */
export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-xl bg-card/50">
        <History className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground font-medium">The register is currently empty.</p>
        <p className="text-sm text-muted-foreground/70">Completed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <ScrollArea className="h-[600px] w-full">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[180px] font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Timestamp</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>Employee</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span>Customer Type</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">
                <div className="flex items-center justify-end gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>Total</span>
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold text-accent-foreground">Comm. (25%)</TableHead>
              <TableHead className="text-right font-semibold text-secondary-foreground bg-secondary/5">Ledger (75%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/30 transition-colors group">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {formatDate(order.timestamp)}
                </TableCell>
                <TableCell className="font-medium">
                  {order.employeeName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal bg-background">
                    {order.customerType}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell className="text-right font-mono text-accent-foreground">
                  {formatCurrency(order.totalCommission)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-secondary bg-secondary/5">
                  {formatCurrency(order.ledgerAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
        <p className="text-xs text-muted-foreground italic">
          * All records are permanent and timestamped for regulatory compliance.
        </p>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Volume</p>
            <p className="text-sm font-mono font-bold">
              {formatCurrency(orders.reduce((acc, curr) => acc + curr.totalAmount, 0))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Net Ledger</p>
            <p className="text-sm font-mono font-bold text-secondary">
              {formatCurrency(orders.reduce((acc, curr) => acc + curr.ledgerAmount, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

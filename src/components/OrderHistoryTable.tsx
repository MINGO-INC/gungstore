import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { History, User, CreditCard, DollarSign, Calendar, Trash2, ChevronDown } from 'lucide-react';

interface OrderHistoryTableProps {
  orders: Order[];
  onDeleteOrder?: (orderId: string) => void;
}

/**
 * TLCA Gun Register - Order History Ledger
 * Displays completed transactions in a vintage ledger format.
 * © 2026 TLCA Inventory Systems
 */
export function OrderHistoryTable({ orders, onDeleteOrder }: OrderHistoryTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete && onDeleteOrder) {
      onDeleteOrder(orderToDelete.id);
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

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
              <TableHead className="w-[40px]"></TableHead>
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
              <TableHead className="w-[80px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="w-[40px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      title="View items in this order"
                    >
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`}
                      />
                    </Button>
                  </TableCell>
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteClick(order)}
                      title="Delete this sale"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                
                {expandedOrderId === order.id && (
                  <TableRow className="bg-muted/20 hover:bg-muted/30">
                    <TableCell colSpan={8} className="py-4">
                      <div className="space-y-3 pl-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-3 text-foreground">Items in this order:</h4>
                          {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                            <div className="space-y-2">
                              {order.items.map((item: any, idx: number) => (
                                <div 
                                  key={idx} 
                                  className="flex items-center justify-between p-2 bg-background rounded border border-border text-sm"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-foreground">{item.name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity} × {formatCurrency(item.unitPrice || 0)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-mono font-semibold text-foreground">
                                      {formatCurrency(item.totalPrice || 0)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No items recorded for this order.</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sale?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sale? This action cannot be undone.
              {orderToDelete && (
                <div className="mt-4 p-3 bg-muted rounded-md space-y-1">
                  <p className="text-sm font-medium text-foreground">Order Details:</p>
                  <p className="text-xs text-muted-foreground">Date: {orderToDelete.timestamp ? formatDate(orderToDelete.timestamp) : 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">Employee: {orderToDelete.employeeName}</p>
                  <p className="text-xs text-muted-foreground">Total: {formatCurrency(orderToDelete.totalAmount)}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

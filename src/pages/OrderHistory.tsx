import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Trash2, FileText, TrendingUp, Wallet, ShieldCheck } from 'lucide-react';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { OrderHistoryTable } from '@/components/OrderHistoryTable';
import { BestSellersTable } from '@/components/BestSellersTable';
import { EMPLOYEES } from '@/lib/index';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OrderHistory() {
  const { orders, clearHistory, deleteOrder, isLoading } = useOrderHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEmployee = employeeFilter === 'all' || order.employeeId === employeeFilter;

      return matchesSearch && matchesEmployee;
    });
  }, [orders, searchQuery, employeeFilter]);

  const stats = useMemo(() => {
    return filteredOrders.reduce(
      (acc, order) => ({
        totalSales: acc.totalSales + order.totalAmount,
        totalLedger: acc.totalLedger + order.ledgerAmount,
        totalCommission: acc.totalCommission + order.totalCommission,
      }),
      { totalSales: 0, totalLedger: 0, totalCommission: 0 }
    );
  }, [filteredOrders]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading text-secondary">The Ledger</h1>
          <p className="text-muted-foreground">
            Comprehensive record of all transactions for the year 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive"
            onClick={() => {
              if (confirm('Are you sure you want to wipe the ledger? This action cannot be undone.')) {
                clearHistory();
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gross Sales</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatCurrency(stats.totalSales)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ledger Balance (75%)</CardTitle>
            <ShieldCheck className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-secondary">
              {formatCurrency(stats.totalLedger)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Employee Commissions (25%)</CardTitle>
            <Wallet className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold text-primary">
              {formatCurrency(stats.totalCommission)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="history">Order History</TabsTrigger>
            <TabsTrigger value="bestsellers">Best Sellers</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-6 mt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID, Employee, or Customer Type..."
                  className="pl-10 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64 flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Filter by Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {EMPLOYEES.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-64 flex items-center justify-center text-muted-foreground"
                  >
                    Fetching ledger entries...
                  </motion.div>
                ) : filteredOrders.length > 0 ? (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <OrderHistoryTable orders={filteredOrders} onDeleteOrder={deleteOrder} />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-64 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-muted rounded-lg"
                  >
                    <FileText className="w-12 h-12 text-muted-foreground opacity-20" />
                    <div className="space-y-1">
                      <p className="text-lg font-medium">No transactions found</p>
                      <p className="text-sm text-muted-foreground">
                        The ledger is currently empty for the selected filters.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="bestsellers" className="space-y-6 mt-6">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-64 flex items-center justify-center text-muted-foreground"
                  >
                    Analyzing sales data...
                  </motion.div>
                ) : (
                  <motion.div
                    key="bestsellers"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <BestSellersTable orders={orders} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

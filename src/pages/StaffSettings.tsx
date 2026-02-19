import React, { useState } from 'react';
import { UserPlus, Trash2, Settings, Users, PackagePlus, Package } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Employee, Product } from '@/lib/index';

const CATEGORIES: Product['category'][] = [
  'Pistols',
  'Revolvers',
  'Rifles',
  'Shotguns',
  'Repeaters',
  'Consumables',
  'Specials',
];

export default function StaffSettings() {
  // --- Staff state ---
  const { employees, addEmployee, removeEmployee } = useEmployees();
  const [staffName, setStaffName] = useState('');
  const [staffLoading, setStaffLoading] = useState(false);
  const [removeEmployeeDialogOpen, setRemoveEmployeeDialogOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null);

  // --- Product state ---
  const { products, addProduct, removeProduct } = useProducts();
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState<Product['category']>('Pistols');
  const [productDescription, setProductDescription] = useState('');
  const [productLoading, setProductLoading] = useState(false);
  const [removeProductDialogOpen, setRemoveProductDialogOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<Product['category'] | 'All'>('All');

  // --- Staff handlers ---
  const handleAddEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStaffLoading(true);
    try {
      const created = await addEmployee(staffName);
      if (created) setStaffName('');
    } finally {
      setStaffLoading(false);
    }
  };

  const confirmRemoveEmployee = (employee: Employee) => {
    setEmployeeToRemove(employee);
    setRemoveEmployeeDialogOpen(true);
  };

  const handleRemoveEmployee = async () => {
    if (employeeToRemove) {
      setStaffLoading(true);
      try {
        await removeEmployee(employeeToRemove.id);
      } finally {
        setStaffLoading(false);
      }
    }
    setRemoveEmployeeDialogOpen(false);
    setEmployeeToRemove(null);
  };

  // --- Product handlers ---
  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = parseFloat(productPrice);
    if (!productName.trim() || isNaN(price) || price < 0) return;
    setProductLoading(true);
    try {
      const created = await addProduct(productName, price, productCategory, productDescription);
      if (created) {
        setProductName('');
        setProductPrice('');
        setProductDescription('');
      }
    } finally {
      setProductLoading(false);
    }
  };

  const confirmRemoveProduct = (product: Product) => {
    setProductToRemove(product);
    setRemoveProductDialogOpen(true);
  };

  const handleRemoveProduct = async () => {
    if (productToRemove) {
      setProductLoading(true);
      try {
        await removeProduct(productToRemove.id);
      } finally {
        setProductLoading(false);
      }
    }
    setRemoveProductDialogOpen(false);
    setProductToRemove(null);
  };

  const filteredProducts =
    filterCategory === 'All' ? products : products.filter((p) => p.category === filterCategory);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-mono">Settings</span>
          </div>
          <h1 className="text-4xl font-heading text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage staff access and store inventory from one place.
          </p>
        </div>
      </div>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="bg-muted/50 border border-border/50">
          <TabsTrigger value="staff" className="gap-2">
            <Users className="w-4 h-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="store-items" className="gap-2">
            <Package className="w-4 h-4" />
            Store Items
          </TabsTrigger>
        </TabsList>

        {/* ── Staff Tab ── */}
        <TabsContent value="staff" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary" />
                  Add New Staff Member
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                      Name
                    </label>
                    <Input
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="bg-background"
                      disabled={staffLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={staffLoading}>
                    {staffLoading ? 'Adding...' : 'Add Staff Member'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  Active Staff List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.length === 0 ? (
                    <div className="text-sm text-muted-foreground italic">
                      No staff members found. Add someone to get started.
                    </div>
                  ) : (
                    employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between gap-4 rounded-md border border-border bg-background/50 px-4 py-3"
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-foreground">{employee.name}</div>
                          <div className="text-xs font-mono text-muted-foreground">{employee.slug}</div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                          disabled={staffLoading}
                          onClick={() => confirmRemoveEmployee(employee)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Store Items Tab ── */}
        <TabsContent value="store-items" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add product form */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PackagePlus className="w-4 h-4 text-primary" />
                  Add New Store Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                      Name
                    </label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Colt Navy"
                      className="bg-background"
                      disabled={productLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                      Price ($)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="e.g. 150.00"
                      className="bg-background"
                      disabled={productLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                      Category
                    </label>
                    <Select
                      value={productCategory}
                      onValueChange={(val) => setProductCategory(val as Product['category'])}
                      disabled={productLoading}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                      Description <span className="normal-case">(optional)</span>
                    </label>
                    <Input
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="Short description..."
                      className="bg-background"
                      disabled={productLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={productLoading || !productName.trim() || !productPrice}
                  >
                    {productLoading ? 'Adding...' : 'Add Item'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Product list */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="w-4 h-4 text-secondary" />
                  Store Inventory ({filteredProducts.length})
                </CardTitle>
                <Select
                  value={filterCategory}
                  onValueChange={(val) => setFilterCategory(val as Product['category'] | 'All')}
                >
                  <SelectTrigger className="w-36 bg-background text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="max-h-[480px] overflow-y-auto">
                <div className="space-y-2">
                  {filteredProducts.length === 0 ? (
                    <div className="text-sm text-muted-foreground italic">
                      No items found. Add one to get started.
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-4 rounded-md border border-border bg-background/50 px-4 py-3"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">
                            {product.name}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground">
                            {product.category} · ${product.price.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
                          disabled={productLoading}
                          onClick={() => confirmRemoveProduct(product)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Remove employee confirmation */}
      <AlertDialog open={removeEmployeeDialogOpen} onOpenChange={setRemoveEmployeeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Staff Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes register access but keeps all historical sales in the ledger.
              {employeeToRemove && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Removing: <span className="font-medium text-foreground">{employeeToRemove.name}</span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={staffLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveEmployee}
              disabled={staffLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {staffLoading ? 'Removing...' : 'Remove Staff'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove product confirmation */}
      <AlertDialog open={removeProductDialogOpen} onOpenChange={setRemoveProductDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Store Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the item from the store. Historical orders that included this item
              are not affected.
              {productToRemove && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Removing: <span className="font-medium text-foreground">{productToRemove.name}</span>
                  {' '}({productToRemove.category} · ${productToRemove.price.toFixed(2)})
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={productLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveProduct}
              disabled={productLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {productLoading ? 'Removing...' : 'Remove Item'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

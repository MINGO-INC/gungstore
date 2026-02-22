/**
 * TLCA Gun Register - Core Types and Constants
 * (c) 2026 TLCA Inventory Systems
 */

export const ROUTE_PATHS = {
  HOME: '/',
  ORDER_HISTORY: '/history',
  EMPLOYEE: '/employee/:slug',
  STAFF_SETTINGS: '/settings',
};

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Pistols' | 'Revolvers' | 'Rifles' | 'Shotguns' | 'Repeaters' | 'Consumables' | 'Specials';
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  slug: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  discountedPrice: number;
  totalPrice: number;
  commission: number;
}

export interface Order {
  id: string;
  employeeId: string;
  employeeName: string;
  customerType: string;
  items: OrderItem[];
  totalAmount: number;
  totalCommission: number;
  ledgerAmount: number;
  timestamp: string;
}

export const EMPLOYEES: Employee[] = [
  { id: 'emp_1', name: 'Cat', slug: 'cat' },
  { id: 'emp_2', name: 'Tom', slug: 'tom' },
  { id: 'emp_3', name: 'Rob', slug: 'rob' },
  { id: 'emp_4', name: 'Morris', slug: 'morris' },
  { id: 'emp_5', name: 'Extra', slug: 'extra' },
];

export const PISTOLS: Product[] = [
  { id: 'pi_1', name: 'Colt 1911', price: 450.00, category: 'Pistols' },
  { id: 'pi_2', name: 'Mauser', price: 35.00, category: 'Pistols' },
  { id: 'pi_3', name: 'Semi-Auto', price: 35.00, category: 'Pistols' },
  { id: 'pi_4', name: 'Volcanic', price: 35.00, category: 'Pistols' },
  { id: 'pi_5', name: 'Luger', price: 350.00, category: 'Pistols' },
  { id: 'pi_6', name: '1899', price: 450.00, category: 'Pistols' },
];

export const REVOLVERS: Product[] = [
  { id: 'rv_1', name: 'Schofield', price: 10.00, category: 'Revolvers' },
  { id: 'rv_2', name: 'Double Action', price: 25.00, category: 'Revolvers' },
  { id: 'rv_3', name: 'Navy', price: 35.00, category: 'Revolvers' },
  { id: 'rv_4', name: 'LeMat', price: 35.00, category: 'Revolvers' },
  { id: 'rv_5', name: '44 Model 1875', price: 330.00, category: 'Revolvers' },
  { id: 'rv_6', name: "Gambler's", price: 370.00, category: 'Revolvers' },
  { id: 'rv_7', name: 'Webley', price: 370.00, category: 'Revolvers' },
  { id: 'rv_8', name: 'Walker', price: 450.00, category: 'Revolvers' },
  { id: 'rv_9', name: 'Cattleman', price: 5.00, category: 'Revolvers' },
];

export const RIFLES: Product[] = [
  { id: 'rf_1', name: 'Springfield', price: 70.00, category: 'Rifles' },
  { id: 'rf_2', name: 'Tranquilizer', price: 75.00, category: 'Rifles' },
  { id: 'rf_3', name: 'Bolt-Action', price: 75.00, category: 'Rifles' },
  { id: 'rf_4', name: 'Sharps / Martini', price: 350.00, category: 'Rifles' },
  { id: 'rf_5', name: 'Gewehr 98', price: 400.00, category: 'Rifles' },
  { id: 'rf_6', name: 'Lee-Enfield', price: 400.00, category: 'Rifles' },
  { id: 'rf_7', name: 'Mosin', price: 400.00, category: 'Rifles' },
  { id: 'rf_8', name: 'Elephant Rifle', price: 500.00, category: 'Rifles' },
  { id: 'rf_9', name: 'Rolling Block', price: 1000.00, category: 'Rifles' },
  { id: 'rf_10', name: 'Carcano', price: 1000.00, category: 'Rifles' },
];

export const SHOTGUNS: Product[] = [
  { id: 'sg_1', name: 'Sawn-Off', price: 35.00, category: 'Shotguns' },
  { id: 'sg_2', name: 'Double Barrel', price: 45.00, category: 'Shotguns' },
  { id: 'sg_3', name: 'Semi-Auto', price: 55.00, category: 'Shotguns' },
  { id: 'sg_4', name: 'Repeating', price: 70.00, category: 'Shotguns' },
  { id: 'sg_5', name: 'Pump-Action', price: 75.00, category: 'Shotguns' },
  { id: 'sg_6', name: 'Coach Gun', price: 300.00, category: 'Shotguns' },
  { id: 'sg_7', name: 'Exotic Double', price: 400.00, category: 'Shotguns' },
];

export const REPEATERS: Product[] = [
  { id: 'rp_1', name: 'Evans', price: 25.00, category: 'Repeaters' },
  { id: 'rp_2', name: 'Carbine', price: 55.00, category: 'Repeaters' },
  { id: 'rp_3', name: 'Winchester', price: 55.00, category: 'Repeaters' },
  { id: 'rp_4', name: "Mare's Leg", price: 350.00, category: 'Repeaters' },
  { id: 'rp_5', name: 'Henry', price: 370.00, category: 'Repeaters' },
];

export const CONSUMABLES: Product[] = [
  { id: 'co_1', name: 'Gun Oil', price: 0.50, category: 'Consumables' },
  { id: 'co_2', name: 'Pistol Ammo', price: 3.00, category: 'Consumables' },
  { id: 'co_3', name: 'Gunpowder', price: 1.00, category: 'Consumables' },
  { id: 'co_4', name: 'Shell Casting', price: 0.30, category: 'Consumables' },
  { id: 'co_5', name: 'Engraving Plate', price: 20.00, category: 'Consumables' },
];

export const PRODUCTS: Product[] = [
  ...PISTOLS,
  ...REVOLVERS,
  ...RIFLES,
  ...SHOTGUNS,
  ...REPEATERS,
  ...CONSUMABLES,
];

export const SPECIALS: Product[] = [
  { id: 'sp_1', name: 'Exotic Double (Master Crafted)', price: 1200.00, category: 'Specials', description: 'Limited custom-built shotgun.' },
  { id: 'sp_2', name: 'Engraved Rolling Block Rifle', price: 2500.00, category: 'Specials', description: 'Finely engraved long-range rifle.' },
  { id: 'sp_3', name: 'Superior Bow', price: 100.00, category: 'Specials', description: 'Superior bow.' },
];


export const CUSTOMER_TYPES = {
  STANDARD: {
    id: 'standard',
    label: 'Standard Customer',
    discount: 0,
  },
  LAW_DOC: {
    id: 'law_doc',
    label: 'Law & Doc (10%)',
    discount: 0.10,
  },
  EMPLOYEE: {
    id: 'employee',
    label: 'Employee (20%)',
    discount: 0.20,
  },
} as const;

// Business Logic Constants
export const COMMISSION_RATE = 0.35; // 35% employee commission

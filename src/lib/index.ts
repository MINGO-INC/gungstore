/**
 * TLCA Gun Register - Core Types and Constants
 * © 2026 TLCA Inventory Systems
 */

export const ROUTE_PATHS = {
  HOME: '/',
  ORDER_HISTORY: '/history',
  EMPLOYEE: '/employee/:slug',
};

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Long Arms' | 'Side Arms' | 'Ammo & Accessories' | 'Specials';
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
export const PRODUCTS: Product[] = [
  // Long Arms
  { id: 'la_1', name: 'Springfield Rifle', price: 70.00, category: 'Long Arms' },
  { id: 'la_2', name: 'Bolt-Action Rifle', price: 75.00, category: 'Long Arms' },
  { id: 'la_3', name: 'Sharps / Martini Rifle', price: 350.00, category: 'Long Arms' },
  { id: 'la_4', name: 'Gewehr 98', price: 400.00, category: 'Long Arms' },
  { id: 'la_5', name: 'Lee-Enfield', price: 400.00, category: 'Long Arms' },
  { id: 'la_6', name: 'Mosin-Nagant', price: 400.00, category: 'Long Arms' },
  { id: 'la_7', name: 'Elephant Rifle', price: 500.00, category: 'Long Arms' },
  { id: 'la_8', name: 'Rolling Block Rifle', price: 1000.00, category: 'Long Arms' },
  { id: 'la_9', name: 'Carcano Rifle', price: 1000.00, category: 'Long Arms' },
  { id: 'la_10', name: 'Coach Gun', price: 300.00, category: 'Long Arms' },
  { id: 'la_11', name: 'Pump-Action Shotgun', price: 75.00, category: 'Long Arms' },
  { id: 'la_12', name: 'Repeating Shotgun', price: 70.00, category: 'Long Arms' },
  { id: 'la_13', name: 'Double Barrel Shotgun', price: 45.00, category: 'Long Arms' },
  { id: 'la_14', name: 'Sawn-Off Shotgun', price: 35.00, category: 'Long Arms' },
  { id: 'la_15', name: 'Exotic Double Shotgun', price: 400.00, category: 'Long Arms' },
  { id: 'la_16', name: 'Winchester Repeater', price: 55.00, category: 'Long Arms' },
  { id: 'la_17', name: 'Henry Repeater', price: 370.00, category: 'Long Arms' },
  { id: 'la_18', name: 'Evans Repeater', price: 25.00, category: 'Long Arms' },
  { id: 'la_19', name: 'Carbine Repeater', price: 55.00, category: 'Long Arms' },
  { id: 'la_20', name: "Mare's Leg", price: 350.00, category: 'Long Arms' },

  // Side Arms
  { id: 'sa_1', name: 'Colt 1911', price: 450.00, category: 'Side Arms' },
  { id: 'sa_2', name: 'Mauser Pistol', price: 35.00, category: 'Side Arms' },
  { id: 'sa_3', name: 'Semi-Auto Pistol', price: 35.00, category: 'Side Arms' },
  { id: 'sa_4', name: 'Volcanic Pistol', price: 35.00, category: 'Side Arms' },
  { id: 'sa_5', name: 'Luger', price: 350.00, category: 'Side Arms' },
  { id: 'sa_6', name: '1899 Pistol', price: 450.00, category: 'Side Arms' },
  { id: 'sa_7', name: 'Schofield Revolver', price: 10.00, category: 'Side Arms' },
  { id: 'sa_8', name: 'Double Action Revolver', price: 25.00, category: 'Side Arms' },
  { id: 'sa_9', name: 'Navy Revolver', price: 35.00, category: 'Side Arms' },
  { id: 'sa_10', name: 'LeMat Revolver', price: 35.00, category: 'Side Arms' },
  { id: 'sa_11', name: '44 Model 1875 Revolver', price: 330.00, category: 'Side Arms' },
  { id: 'sa_12', name: "Gambler's Revolver", price: 370.00, category: 'Side Arms' },
  { id: 'sa_13', name: 'Webley Revolver', price: 370.00, category: 'Side Arms' },
  { id: 'sa_14', name: 'Walker Revolver', price: 450.00, category: 'Side Arms' },
  { id: 'sa_15', name: 'Tranquilizer Gun', price: 75.00, category: 'Side Arms' },

  // Ammo & Accessories
  { id: 'aa_1', name: 'Gun Oil', price: 0.50, category: 'Ammo & Accessories' },
  { id: 'aa_2', name: 'Pistol Ammo', price: 3.00, category: 'Ammo & Accessories' },
  { id: 'aa_3', name: 'Gunpowder', price: 1.00, category: 'Ammo & Accessories' },
  { id: 'aa_4', name: 'Shell Casting Supplies', price: 0.30, category: 'Ammo & Accessories' },
  { id: 'aa_5', name: 'Engraving Plate', price: 20.00, category: 'Ammo & Accessories' },
];

export const SPECIALS: Product[] = [
  { id: 'sp_1', name: 'Exotic Double (Master Crafted)', price: 1200.00, category: 'Specials', description: 'Limited custom-built shotgun.' },
  { id: 'sp_2', name: 'Engraved Rolling Block Rifle', price: 2500.00, category: 'Specials', description: 'Finely engraved long-range rifle.' },
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
export const COMMISSION_RATE = 0.25; // 25% employee commission
export const LEDGER_RATE = 0.75;     // 75% to ledger

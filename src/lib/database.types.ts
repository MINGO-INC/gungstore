export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          employee_id: string
          employee_name: string
          customer_type: string
          items: Json
          total_amount: number
          total_commission: number
          ledger_amount: number
          timestamp: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          employee_id: string
          employee_name: string
          customer_type: string
          items: Json
          total_amount: number
          total_commission: number
          ledger_amount: number
          timestamp: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          employee_name?: string
          customer_type?: string
          items?: Json
          total_amount?: number
          total_commission?: number
          ledger_amount?: number
          timestamp?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          category: 'Pistols' | 'Revolvers' | 'Rifles' | 'Shotguns' | 'Repeaters' | 'Consumables' | 'Specials'
          description: string | null
          stock_quantity: number
          is_active: boolean
          is_special: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          price: number
          category: 'Pistols' | 'Revolvers' | 'Rifles' | 'Shotguns' | 'Repeaters' | 'Consumables' | 'Specials'
          description?: string | null
          stock_quantity?: number
          is_active?: boolean
          is_special?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          category?: 'Pistols' | 'Revolvers' | 'Rifles' | 'Shotguns' | 'Repeaters' | 'Consumables' | 'Specials'
          description?: string | null
          stock_quantity?: number
          is_active?: boolean
          is_special?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          name: string
          slug: string
          email: string | null
          phone: string | null
          is_active: boolean
          hire_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          slug: string
          email?: string | null
          phone?: string | null
          is_active?: boolean
          hire_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          email?: string | null
          phone?: string | null
          is_active?: boolean
          hire_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory_transactions: {
        Row: {
          id: string
          product_id: string
          transaction_type: 'purchase' | 'sale' | 'adjustment' | 'return'
          quantity: number
          unit_cost: number | null
          total_cost: number | null
          reference_order_id: string | null
          notes: string | null
          transaction_date: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          transaction_type: 'purchase' | 'sale' | 'adjustment' | 'return'
          quantity: number
          unit_cost?: number | null
          total_cost?: number | null
          reference_order_id?: string | null
          notes?: string | null
          transaction_date?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          transaction_type?: 'purchase' | 'sale' | 'adjustment' | 'return'
          quantity?: number
          unit_cost?: number | null
          total_cost?: number | null
          reference_order_id?: string | null
          notes?: string | null
          transaction_date?: string
          created_by?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      product_stock_levels: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          recorded_stock: number
          calculated_stock: number
          is_active: boolean
        }
      }
    }
  }
}

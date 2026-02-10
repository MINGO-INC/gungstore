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
    }
  }
}

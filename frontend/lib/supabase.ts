import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'investor';
          phone: string;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      investors: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          country: string;
          id_number: string;
          id_type: string;
          status: 'active' | 'inactive' | 'pending';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['investors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['investors']['Insert']>;
      };
      lands: {
        Row: {
          id: string;
          investor_id: string | null;
          title: string;
          description: string;
          location: string;
          district: string;
          state: string;
          survey_number: string;
          total_area: number;
          unit: string;
          latitude: number | null;
          longitude: number | null;
          purchase_date: string | null;
          purchase_price: number;
          current_value: number;
          status: 'active' | 'pending' | 'sold' | 'inactive';
          images: string[];
          documents: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lands']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['lands']['Insert']>;
      };
      crops: {
        Row: {
          id: string;
          land_id: string;
          name: string;
          variety: string;
          planted_date: string | null;
          total_plants: number;
          surviving_plants: number;
          growth_stage: 'seedling' | 'sapling' | 'juvenile' | 'mature' | 'harvest_ready';
          expected_harvest_date: string | null;
          height_avg: number;
          health_status: 'excellent' | 'good' | 'fair' | 'poor';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['crops']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['crops']['Insert']>;
      };
      plantation_updates: {
        Row: {
          id: string;
          crop_id: string | null;
          land_id: string | null;
          update_type: string;
          title: string;
          description: string;
          images: string[];
          recorded_by: string | null;
          update_date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plantation_updates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['plantation_updates']['Insert']>;
      };
      investments: {
        Row: {
          id: string;
          investor_id: string;
          land_id: string | null;
          investment_type: string;
          amount: number;
          currency: string;
          investment_date: string;
          maturity_date: string | null;
          expected_returns: number;
          roi_percentage: number;
          status: 'active' | 'matured' | 'withdrawn' | 'pending';
          contract_number: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['investments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['investments']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          investment_id: string | null;
          investor_id: string;
          amount: number;
          currency: string;
          payment_type: string;
          payment_method: string;
          transaction_id: string;
          payment_date: string;
          status: 'completed' | 'pending' | 'failed' | 'refunded';
          receipt_url: string;
          notes: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          investor_id: string | null;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'alert' | 'update';
          is_read: boolean;
          link: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          investor_id: string;
          land_id: string | null;
          title: string;
          description: string;
          file_url: string;
          file_type: string;
          file_size: number;
          category: string;
          is_public: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
    };
  };
};

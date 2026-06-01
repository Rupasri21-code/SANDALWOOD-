/*
  # Sandalwood Land Investment Platform - Full Schema

  ## New Tables
  - `profiles` - Extended user profiles (admin/customer roles)
  - `customers` - Customer investment accounts with contact info
  - `lands` - Land parcels with location, dimensions, documents
  - `crops` - Crop/plantation details per land
  - `plantation_updates` - Growth and maintenance logs
  - `investments` - Investment records per customer/land
  - `payments` - Payment transaction history
  - `notifications` - In-app notification system
  - `media_uploads` - Track uploaded images/videos/documents
  - `documents` - Customer-downloadable documents

  ## Security
  - RLS enabled on all tables
  - Admin role can manage all data
  - Customers can only view their own assigned data
*/

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL UNIQUE,
  phone text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  country text DEFAULT 'India',
  id_number text DEFAULT '',
  id_type text DEFAULT 'Aadhar',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Customers can view own record"
  ON customers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Lands table
CREATE TABLE IF NOT EXISTS lands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  location text DEFAULT '',
  district text DEFAULT '',
  state text DEFAULT '',
  survey_number text DEFAULT '',
  total_area numeric(10,2) DEFAULT 0,
  unit text DEFAULT 'acres',
  latitude numeric(10,6),
  longitude numeric(10,6),
  purchase_date date,
  purchase_price numeric(15,2) DEFAULT 0,
  current_value numeric(15,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'inactive')),
  images jsonb DEFAULT '[]'::jsonb,
  documents jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all lands"
  ON lands FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert lands"
  ON lands FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update lands"
  ON lands FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete lands"
  ON lands FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Customers can view own lands"
  ON lands FOR SELECT
  TO authenticated
  USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Crops table
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  land_id uuid REFERENCES lands(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Sandalwood',
  variety text DEFAULT '',
  planted_date date,
  total_plants integer DEFAULT 0,
  surviving_plants integer DEFAULT 0,
  growth_stage text DEFAULT 'seedling' CHECK (growth_stage IN ('seedling', 'sapling', 'juvenile', 'mature', 'harvest_ready')),
  expected_harvest_date date,
  height_avg numeric(6,2) DEFAULT 0,
  health_status text DEFAULT 'good' CHECK (health_status IN ('excellent', 'good', 'fair', 'poor')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all crops"
  ON crops FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert crops"
  ON crops FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update crops"
  ON crops FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete crops"
  ON crops FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Customers can view crops on own lands"
  ON crops FOR SELECT
  TO authenticated
  USING (
    land_id IN (
      SELECT l.id FROM lands l
      JOIN customers c ON c.id = l.customer_id
      WHERE c.user_id = auth.uid()
    )
  );

-- Plantation updates / maintenance reports
CREATE TABLE IF NOT EXISTS plantation_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id uuid REFERENCES crops(id) ON DELETE CASCADE,
  land_id uuid REFERENCES lands(id) ON DELETE CASCADE,
  update_type text NOT NULL DEFAULT 'general' CHECK (update_type IN ('general', 'maintenance', 'growth', 'pest_control', 'fertilization', 'irrigation', 'harvest')),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  images jsonb DEFAULT '[]'::jsonb,
  recorded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  update_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plantation_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all updates"
  ON plantation_updates FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert updates"
  ON plantation_updates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update updates"
  ON plantation_updates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete updates"
  ON plantation_updates FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Customers can view updates on own lands"
  ON plantation_updates FOR SELECT
  TO authenticated
  USING (
    land_id IN (
      SELECT l.id FROM lands l
      JOIN customers c ON c.id = l.customer_id
      WHERE c.user_id = auth.uid()
    )
  );

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  land_id uuid REFERENCES lands(id) ON DELETE SET NULL,
  investment_type text DEFAULT 'full_purchase' CHECK (investment_type IN ('full_purchase', 'partial', 'lease', 'revenue_share')),
  amount numeric(15,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'INR',
  investment_date date DEFAULT CURRENT_DATE,
  maturity_date date,
  expected_returns numeric(15,2) DEFAULT 0,
  roi_percentage numeric(5,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matured', 'withdrawn', 'pending')),
  contract_number text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all investments"
  ON investments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert investments"
  ON investments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update investments"
  ON investments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete investments"
  ON investments FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Customers can view own investments"
  ON investments FOR SELECT
  TO authenticated
  USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id uuid REFERENCES investments(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  amount numeric(15,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'INR',
  payment_type text DEFAULT 'installment' CHECK (payment_type IN ('installment', 'full', 'returns', 'refund', 'maintenance_fee')),
  payment_method text DEFAULT 'bank_transfer',
  transaction_id text DEFAULT '',
  payment_date date DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
  receipt_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Customers can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert', 'update')),
  is_read boolean DEFAULT false,
  link text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Admins can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  land_id uuid REFERENCES lands(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  file_url text NOT NULL DEFAULT '',
  file_type text DEFAULT 'pdf',
  file_size bigint DEFAULT 0,
  category text DEFAULT 'general' CHECK (category IN ('general', 'title_deed', 'survey', 'investment_contract', 'payment_receipt', 'plantation_report', 'legal')),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Customers can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  );

-- Media uploads table
CREATE TABLE IF NOT EXISTS media_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  file_url text NOT NULL DEFAULT '',
  file_name text DEFAULT '',
  file_type text DEFAULT 'image',
  file_size bigint DEFAULT 0,
  category text DEFAULT 'general',
  related_id uuid,
  related_type text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all media"
  ON media_uploads FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can insert media"
  ON media_uploads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "Admins can delete media"
  ON media_uploads FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_lands_customer_id ON lands(customer_id);
CREATE INDEX IF NOT EXISTS idx_crops_land_id ON crops(land_id);
CREATE INDEX IF NOT EXISTS idx_plantation_updates_land_id ON plantation_updates(land_id);
CREATE INDEX IF NOT EXISTS idx_investments_customer_id ON investments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON documents(customer_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

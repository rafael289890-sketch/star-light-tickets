/*
# Create tickets table (multi-user, owner-scoped)

1. New Tables
- `tickets`
  - `id` (uuid, primary key, auto-generated)
  - `event` (text, name of the event, e.g. "Starlight Festival")
  - `category` (text, ticket category, e.g. "FRONTSTAGE - INTEIRA")
  - `city` (text, event city, e.g. "Brasilia - DF")
  - `date` (text, human-readable event date)
  - `subtotal` (numeric, ticket price before fee)
  - `fee` (numeric, Ticketou service fee)
  - `total` (numeric, subtotal + fee)
  - `order_id` (text, customer-facing order number, e.g. "#SLF123456")
  - `status` (text, either "pending" or "paid")
  - `buyer_email` (text, email the ticket will be sent to)
  - `purchased_at` (timestamptz, when payment was confirmed, nullable)
  - `user_id` (uuid, owner of the ticket, defaults to the authenticated user)
  - `created_at` (timestamptz, row creation time)

2. Security
- Enable RLS on `tickets`.
- Owner-scoped CRUD: each authenticated user can only read, insert, update,
  and delete rows they own (auth.uid() = user_id).
- `user_id` defaults to auth.uid() so inserts from the frontend that omit
  the owner still satisfy the INSERT WITH CHECK policy.

3. Notes
- The frontend Supabase client uses the anon key; only authenticated users
  (signed in) can satisfy the owner-scoped policies, which is the intended
  behavior for an app with a sign-in screen.
- No anon role is granted because tickets are private to each user.
*/

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  category text NOT NULL,
  city text NOT NULL,
  date text NOT NULL,
  subtotal numeric NOT NULL DEFAULT 0,
  fee numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  order_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  buyer_email text,
  purchased_at timestamptz,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tickets" ON tickets;
CREATE POLICY "select_own_tickets"
ON tickets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_tickets" ON tickets;
CREATE POLICY "insert_own_tickets"
ON tickets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_tickets" ON tickets;
CREATE POLICY "update_own_tickets"
ON tickets FOR UPDATE
TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_tickets" ON tickets;
CREATE POLICY "delete_own_tickets"
ON tickets FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON tickets (user_id);
CREATE INDEX IF NOT EXISTS tickets_order_id_idx ON tickets (order_id);

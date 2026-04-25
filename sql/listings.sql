create table if not exists listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  titre text not null,
  description text not null,
  prix text not null,
  categorie text not null,
  image_url text,
  status text not null default 'active' check (status in ('active', 'sold')),
  platforms jsonb default '{}',
  created_at timestamptz default now() not null
);

alter table listings enable row level security;

create policy "Users can view own listings"
  on listings for select
  using (auth.uid() = user_id);

create policy "Users can insert own listings"
  on listings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own listings"
  on listings for update
  using (auth.uid() = user_id);

create policy "Users can delete own listings"
  on listings for delete
  using (auth.uid() = user_id);

-- Add platforms column to existing table (migration)
alter table listings
  add column if not exists platforms jsonb default '{}';

-- ── NEGOTIATIONS ────────────────────────────────────────────────────────────

create table if not exists negotiations (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade not null,
  seller_id uuid references auth.users(id) on delete cascade not null,
  buyer_message text not null,
  seller_reply text,
  offered_price numeric,
  status text not null default 'pending'
    check (status in ('pending', 'replied', 'accepted', 'rejected', 'countered')),
  created_at timestamptz default now() not null
);

alter table negotiations enable row level security;

create policy "Sellers can view own negotiations"
  on negotiations for select
  using (auth.uid() = seller_id);

create policy "Sellers can insert negotiations"
  on negotiations for insert
  with check (auth.uid() = seller_id);

create policy "Sellers can update own negotiations"
  on negotiations for update
  using (auth.uid() = seller_id);

-- ── PRICE HISTORY ───────────────────────────────────────────────────────────

create table if not exists price_history (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  prix_min numeric not null,
  prix_max numeric not null,
  prix_recommande numeric not null,
  "analyse" text,
  created_at timestamptz default now() not null
);

alter table price_history enable row level security;

create policy "Users can view own price history"
  on price_history for select
  using (auth.uid() = user_id);

create policy "Users can insert price history"
  on price_history for insert
  with check (auth.uid() = user_id);

-- ── WAITLIST ────────────────────────────────────────────────────────────────

create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz default now() not null
);

alter table waitlist enable row level security;

create policy "Anyone can join waitlist"
  on waitlist for insert
  with check (true);

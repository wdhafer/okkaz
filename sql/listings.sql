create table if not exists listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  titre text not null,
  description text not null,
  prix text not null,
  categorie text not null,
  image_url text,
  status text not null default 'active' check (status in ('active', 'sold')),
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

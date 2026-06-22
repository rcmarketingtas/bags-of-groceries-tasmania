-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- DONATIONS
-- ============================================================
create table if not exists donations (
  id               uuid primary key default uuid_generate_v4(),
  first_name       text not null,
  last_name        text not null,
  email            text not null,
  amount           integer not null, -- stored in cents
  bags             integer not null default 1,
  message          text,
  stripe_payment_id text unique not null,
  created_at       timestamptz not null default now()
);

alter table donations enable row level security;

-- Only authenticated admin can read donations
create policy "Admins can read donations"
  on donations for select
  to authenticated
  using (true);

-- Service role inserts (via webhook) bypass RLS automatically


-- ============================================================
-- APPLICATIONS
-- ============================================================
create type application_status as enum ('pending', 'approved', 'rejected', 'assisted');

create table if not exists applications (
  id            uuid primary key default uuid_generate_v4(),
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text not null,
  address       text not null,
  suburb        text not null,
  postcode      char(4) not null,
  adults        integer not null check (adults >= 1),
  children      integer not null check (children >= 0),
  circumstances text not null,
  status        application_status not null default 'pending',
  created_at    timestamptz not null default now()
);

alter table applications enable row level security;

-- Anyone (anon) can submit an application
create policy "Anyone can insert applications"
  on applications for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admin can read/update
create policy "Admins can read applications"
  on applications for select
  to authenticated
  using (true);

create policy "Admins can update applications"
  on applications for update
  to authenticated
  using (true)
  with check (true);


-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
create table if not exists contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Anyone can submit a contact message
create policy "Anyone can insert contact messages"
  on contact_messages for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admin can read
create policy "Admins can read contact messages"
  on contact_messages for select
  to authenticated
  using (true);


-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_applications_status    on applications (status);
create index if not exists idx_applications_created   on applications (created_at desc);
create index if not exists idx_donations_created      on donations (created_at desc);
create index if not exists idx_contact_messages_created on contact_messages (created_at desc);

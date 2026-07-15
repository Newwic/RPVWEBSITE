-- RPV Admin phase 1 schema draft.
-- Run this in Supabase SQL Editor after creating a project.
-- Do not commit service role keys or database passwords.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'rpv_content_status') then
    create type public.rpv_content_status as enum ('draft', 'published', 'hidden', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'rpv_admin_role') then
    create type public.rpv_admin_role as enum ('super_admin', 'editor', 'viewer');
  end if;
end $$;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role public.rpv_admin_role not null default 'viewer',
  status text not null default 'active' check (status in ('active', 'invited', 'disabled')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_th text not null,
  name_en text not null,
  description text,
  image_url text,
  status public.rpv_content_status not null default 'draft',
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_th text not null,
  name_en text not null,
  model text,
  short_description_th text,
  short_description_en text,
  description_th text,
  description_en text,
  category_id uuid references public.categories(id),
  cover_image text,
  featured boolean not null default false,
  status public.rpv_content_status not null default 'draft',
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text_th text,
  alt_text_en text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  value_th text,
  value_en text,
  content_type text not null default 'text' check (content_type in ('text', 'textarea', 'image', 'url')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.revision_history (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  changed_by uuid references auth.users(id),
  changed_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists categories_touch_updated_at on public.categories;
create trigger categories_touch_updated_at
before update on public.categories
for each row execute function public.touch_updated_at();

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

create or replace function public.current_admin_role()
returns public.rpv_admin_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.admin_profiles
  where user_id = auth.uid()
    and status = 'active'
  limit 1
$$;

create or replace function public.is_admin_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_admin_role() in ('super_admin', 'editor'), false)
$$;

create or replace function public.is_admin_viewer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_admin_role() in ('super_admin', 'editor', 'viewer'), false)
$$;

alter table public.admin_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.site_content enable row level security;
alter table public.site_settings enable row level security;
alter table public.revision_history enable row level security;

drop policy if exists "admins can read admin profiles" on public.admin_profiles;
create policy "admins can read admin profiles"
on public.admin_profiles for select
to authenticated
using (public.is_admin_viewer());

drop policy if exists "super admins can manage admin profiles" on public.admin_profiles;
create policy "super admins can manage admin profiles"
on public.admin_profiles for all
to authenticated
using (public.current_admin_role() = 'super_admin')
with check (public.current_admin_role() = 'super_admin');

drop policy if exists "public can read published categories" on public.categories;
create policy "public can read published categories"
on public.categories for select
to anon, authenticated
using (status = 'published');

drop policy if exists "admins can read all categories" on public.categories;
create policy "admins can read all categories"
on public.categories for select
to authenticated
using (public.is_admin_viewer());

drop policy if exists "editors can manage categories" on public.categories;
create policy "editors can manage categories"
on public.categories for all
to authenticated
using (public.is_admin_editor())
with check (public.is_admin_editor());

drop policy if exists "public can read published products" on public.products;
create policy "public can read published products"
on public.products for select
to anon, authenticated
using (status = 'published');

drop policy if exists "admins can read all products" on public.products;
create policy "admins can read all products"
on public.products for select
to authenticated
using (public.is_admin_viewer());

drop policy if exists "editors can manage products" on public.products;
create policy "editors can manage products"
on public.products for all
to authenticated
using (public.is_admin_editor())
with check (public.is_admin_editor());

drop policy if exists "public can read published product images" on public.product_images;
create policy "public can read published product images"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and products.status = 'published'
  )
);

drop policy if exists "admins can read all product images" on public.product_images;
create policy "admins can read all product images"
on public.product_images for select
to authenticated
using (public.is_admin_viewer());

drop policy if exists "editors can manage product images" on public.product_images;
create policy "editors can manage product images"
on public.product_images for all
to authenticated
using (public.is_admin_editor())
with check (public.is_admin_editor());

drop policy if exists "public can read site content" on public.site_content;
create policy "public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "editors can manage site content" on public.site_content;
create policy "editors can manage site content"
on public.site_content for all
to authenticated
using (public.is_admin_editor())
with check (public.is_admin_editor());

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "editors can manage site settings" on public.site_settings;
create policy "editors can manage site settings"
on public.site_settings for all
to authenticated
using (public.is_admin_editor())
with check (public.is_admin_editor());

drop policy if exists "admins can read revisions" on public.revision_history;
create policy "admins can read revisions"
on public.revision_history for select
to authenticated
using (public.is_admin_viewer());

drop policy if exists "editors can create revisions" on public.revision_history;
create policy "editors can create revisions"
on public.revision_history for insert
to authenticated
with check (public.is_admin_editor());


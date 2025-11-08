-- Create app role enum
create type public.app_role as enum ('admin', 'editor', 'user');

-- Create user_roles table for role-based access control
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz default now(),
  unique (user_id, role)
);

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create newsletters table
create table public.newsletters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  full_content text not null,
  category text not null,
  author text default 'Maya Joelson',
  published_date date not null,
  is_featured boolean default false,
  external_link text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Enable RLS on all tables
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.newsletters enable row level security;

-- Create security definer function to check roles (prevents infinite recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_newsletters_updated_at
  before update on public.newsletters
  for each row execute function public.update_updated_at_column();

-- RLS Policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert roles"
  on public.user_roles for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete roles"
  on public.user_roles for delete
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for newsletters
create policy "Anyone can view published newsletters"
  on public.newsletters for select
  using (true);

create policy "Admins can insert newsletters"
  on public.newsletters for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update newsletters"
  on public.newsletters for update
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete newsletters"
  on public.newsletters for delete
  using (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
create index idx_newsletters_slug on public.newsletters(slug);
create index idx_newsletters_published_date on public.newsletters(published_date desc);
create index idx_newsletters_is_featured on public.newsletters(is_featured) where is_featured = true;
create index idx_newsletters_category on public.newsletters(category);
create index idx_user_roles_user_id on public.user_roles(user_id);
create index idx_user_roles_role on public.user_roles(role);
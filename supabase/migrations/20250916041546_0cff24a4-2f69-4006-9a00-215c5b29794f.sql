-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum for user roles
create type public.app_role as enum ('admin', 'candidate', 'supporter');

-- Create enum for expense categories
create type public.expense_category as enum (
  'marketing',
  'eventos',
  'material_grafico',
  'combustivel',
  'alimentacao',
  'hospedagem',
  'servicos_profissionais',
  'outros'
);

-- Create enum for payment methods
create type public.payment_method as enum (
  'dinheiro',
  'cartao_credito',
  'cartao_debito',
  'pix',
  'transferencia',
  'cheque'
);

-- Create candidates table
create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  party text,
  number text,
  uf text not null,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create profiles table for users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role app_role not null default 'supporter',
  candidate_id uuid references public.candidates(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create supporters table
create table public.supporters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  role_note text,
  active boolean default true,
  created_at timestamp with time zone default now(),
  unique(user_id, candidate_id)
);

-- Create budgets table
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  year integer not null,
  total_planned decimal(12,2) not null,
  notes text,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create unique constraint for active budgets
create unique index unique_active_budget_per_candidate_year 
on public.budgets (candidate_id, year) 
where active = true;

-- Create expenses table
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  date date not null,
  category expense_category not null,
  description text not null,
  amount decimal(10,2) not null check (amount > 0),
  payment_method payment_method not null,
  document_url text,
  created_by uuid references auth.users(id) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create votes_raw table
create table public.votes_raw (
  id uuid primary key default gen_random_uuid(),
  candidate_number text not null,
  uf text not null,
  municipio text not null,
  zona text,
  secao text,
  turno integer,
  votos integer not null,
  year integer not null,
  candidate_id uuid references public.candidates(id) on delete set null,
  created_at timestamp with time zone default now(),
  unique(candidate_number, uf, municipio, zona, secao, turno, year)
);

-- Create votes_agg table
create table public.votes_agg (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id) on delete cascade not null,
  uf text not null,
  municipio text not null,
  votos_total integer not null,
  year integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(candidate_id, uf, municipio, year)
);

-- Create audit_log table
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  details jsonb,
  timestamp timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.candidates enable row level security;
alter table public.profiles enable row level security;
alter table public.supporters enable row level security;
alter table public.budgets enable row level security;
alter table public.expenses enable row level security;
alter table public.votes_raw enable row level security;
alter table public.votes_agg enable row level security;
alter table public.audit_log enable row level security;

-- Create security definer function to check if user is admin
create or replace function public.is_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = _user_id
      and role = 'admin'
  )
$$;

-- Create security definer function to get user's candidate_id
create or replace function public.get_user_candidate_id(_user_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select candidate_id
  from public.profiles
  where id = _user_id
$$;

-- RLS Policies for candidates
create policy "Admin can view all candidates"
on public.candidates for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can view their own candidate"
on public.candidates for select
to authenticated
using (id = public.get_user_candidate_id(auth.uid()));

create policy "Admin can manage all candidates"
on public.candidates for all
to authenticated
using (public.is_admin(auth.uid()));

-- RLS Policies for profiles
create policy "Users can view their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid());

create policy "Admin can view all profiles"
on public.profiles for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Admin can manage all profiles"
on public.profiles for all
to authenticated
using (public.is_admin(auth.uid()));

-- RLS Policies for supporters
create policy "Admin can view all supporters"
on public.supporters for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can view supporters of their candidate"
on public.supporters for select
to authenticated
using (candidate_id = public.get_user_candidate_id(auth.uid()));

create policy "Admin can manage all supporters"
on public.supporters for all
to authenticated
using (public.is_admin(auth.uid()));

-- RLS Policies for budgets
create policy "Admin can view all budgets"
on public.budgets for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can view budgets of their candidate"
on public.budgets for select
to authenticated
using (candidate_id = public.get_user_candidate_id(auth.uid()));

create policy "Admin can manage all budgets"
on public.budgets for all
to authenticated
using (public.is_admin(auth.uid()));

create policy "Candidates can manage their own budgets"
on public.budgets for all
to authenticated
using (candidate_id = public.get_user_candidate_id(auth.uid()));

-- RLS Policies for expenses
create policy "Admin can view all expenses"
on public.expenses for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can view expenses of their candidate"
on public.expenses for select
to authenticated
using (candidate_id = public.get_user_candidate_id(auth.uid()));

create policy "Admin can manage all expenses"
on public.expenses for all
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can create expenses for their candidate"
on public.expenses for insert
to authenticated
with check (candidate_id = public.get_user_candidate_id(auth.uid()));

create policy "Users can update expenses they created"
on public.expenses for update
to authenticated
using (created_by = auth.uid() and candidate_id = public.get_user_candidate_id(auth.uid()));

-- RLS Policies for votes_raw
create policy "Admin can view all votes_raw"
on public.votes_raw for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can view votes of their candidate"
on public.votes_raw for select
to authenticated
using (candidate_id = public.get_user_candidate_id(auth.uid()));

create policy "Admin can manage all votes_raw"
on public.votes_raw for all
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can create votes for their candidate"
on public.votes_raw for insert
to authenticated
with check (candidate_id = public.get_user_candidate_id(auth.uid()));

-- RLS Policies for votes_agg
create policy "Admin can view all votes_agg"
on public.votes_agg for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can view agg votes of their candidate"
on public.votes_agg for select
to authenticated
using (candidate_id = public.get_user_candidate_id(auth.uid()));

create policy "Admin can manage all votes_agg"
on public.votes_agg for all
to authenticated
using (public.is_admin(auth.uid()));

-- RLS Policies for audit_log
create policy "Admin can view all audit logs"
on public.audit_log for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "Users can view their own audit logs"
on public.audit_log for select
to authenticated
using (user_id = auth.uid());

create policy "All authenticated users can create audit logs"
on public.audit_log for insert
to authenticated
with check (true);

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    'supporter'
  );
  return new;
end;
$$;

-- Trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add update triggers for tables with updated_at
create trigger update_candidates_updated_at
  before update on public.candidates
  for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_budgets_updated_at
  before update on public.budgets
  for each row execute function public.update_updated_at_column();

create trigger update_expenses_updated_at
  before update on public.expenses
  for each row execute function public.update_updated_at_column();

create trigger update_votes_agg_updated_at
  before update on public.votes_agg
  for each row execute function public.update_updated_at_column();

-- Create indexes for better performance
create index idx_profiles_candidate_id on public.profiles(candidate_id);
create index idx_supporters_candidate_id on public.supporters(candidate_id);
create index idx_supporters_user_id on public.supporters(user_id);
create index idx_budgets_candidate_id on public.budgets(candidate_id);
create index idx_expenses_candidate_id on public.expenses(candidate_id);
create index idx_expenses_date on public.expenses(date);
create index idx_votes_raw_candidate_id on public.votes_raw(candidate_id);
create index idx_votes_agg_candidate_id on public.votes_agg(candidate_id);
create index idx_audit_log_user_id on public.audit_log(user_id);
create index idx_audit_log_timestamp on public.audit_log(timestamp);

-- Insert admin user candidate
insert into public.candidates (name, party, uf) values 
('Nailton Administrador', 'Sistema', 'BR');
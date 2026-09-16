-- Apply only when upgrading an existing Supabase installation.
alter table public.properties add column if not exists contract_status text not null default 'unsigned' check (contract_status in ('unsigned','signed'));
alter table public.properties alter column bedrooms drop not null;
alter table public.properties drop constraint if exists properties_strategy_check;
alter table public.properties add constraint properties_strategy_check check (strategy in ('long-term','co-living','undecided'));

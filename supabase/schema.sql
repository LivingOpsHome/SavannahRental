-- NEW PROJECT ONLY: run this complete file once in Supabase SQL Editor.
-- Do not also run historical migrations on a new project.
begin;
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,email text not null,name text not null default '',role text not null default 'owner' check(role in ('owner','admin')));
create table public.properties(id uuid primary key default gen_random_uuid(),owner_id uuid not null references public.profiles(id),title text not null,address text not null,strategy text not null check(strategy in ('long-term','co-living','undecided')),status text not null check(status in ('review','preparing','active','vacant')),bedrooms integer check(bedrooms>=0),contract_status text not null default 'unsigned' check(contract_status in ('unsigned','signed')),notes text not null default '',created_at timestamptz not null default now(),unique(id,owner_id));
-- Financial files are private documents and receive exactly the same owner isolation.
create table public.documents(id uuid primary key default gen_random_uuid(),owner_id uuid not null references public.profiles(id),property_id uuid,title text not null,filename text not null,storage_path text not null unique,mime text not null,size bigint not null check(size>0 and size<=10485760),created_at timestamptz not null default now(),foreign key(property_id,owner_id) references public.properties(id,owner_id));
create table public.member_resources(id uuid primary key default gen_random_uuid(),file text not null unique,filename text not null,mime text not null,format text not null,title text[] not null check(cardinality(title)=2),description text[] not null check(cardinality(description)=2),created_at timestamptz not null default now());
create table public.leads(id uuid primary key default gen_random_uuid(),kind text not null check(kind in ('contact','evaluation')),language text not null check(language in ('en','zh')),name text,"firstName" text,"lastName" text,email text not null,phone text,address text,city text,state text,zip text,bedrooms integer,bathrooms numeric,status text,interest text,rent text,message text,notification text not null default 'pending',created_at timestamptz not null default now());
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$ begin insert into public.profiles(id,email,name,role) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'name',''),'owner'); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create function public.is_admin() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin'); $$;
revoke all on function public.handle_new_user() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.documents enable row level security;
alter table public.member_resources enable row level security;
alter table public.leads enable row level security;
revoke all on public.profiles,public.properties,public.documents,public.member_resources,public.leads from anon;
grant select,insert,update,delete on public.profiles,public.properties,public.documents,public.member_resources,public.leads to authenticated;
grant all on public.profiles,public.properties,public.documents,public.member_resources,public.leads to service_role;
create policy "read own profile" on public.profiles for select to authenticated using(id=(select auth.uid()) or public.is_admin());
create policy "admin profiles" on public.profiles for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "read own properties" on public.properties for select to authenticated using(owner_id=(select auth.uid()) or public.is_admin());
create policy "owner submits property" on public.properties for insert to authenticated with check(owner_id=(select auth.uid()) and strategy='undecided' and status='review' and contract_status='unsigned' and bedrooms is null and notes='');
create policy "admin properties" on public.properties for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "read own documents" on public.documents for select to authenticated using(owner_id=(select auth.uid()) or public.is_admin());
create policy "admin documents" on public.documents for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "members read resources" on public.member_resources for select to authenticated using(true);
create policy "admin resources" on public.member_resources for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admin leads" on public.leads for all to authenticated using(public.is_admin()) with check(public.is_admin());
create index properties_owner_idx on public.properties(owner_id);
create index documents_owner_idx on public.documents(owner_id);
create index documents_property_idx on public.documents(property_id);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('owner-documents','owner-documents',false,10485760,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv','text/plain','image/png','image/jpeg','application/octet-stream']),
('member-resources','member-resources',false,10485760,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv','text/plain','image/png','image/jpeg','application/octet-stream']);
create policy "owner document download" on storage.objects for select to authenticated using(bucket_id='owner-documents' and exists(select 1 from public.documents d where d.storage_path=storage.objects.name and (d.owner_id=(select auth.uid()) or public.is_admin())));
create policy "member resource download" on storage.objects for select to authenticated using(bucket_id='member-resources' and exists(select 1 from public.member_resources r where r.file=storage.objects.name));
create policy "admin storage" on storage.objects for all to authenticated using(bucket_id in ('owner-documents','member-resources') and public.is_admin()) with check(bucket_id in ('owner-documents','member-resources') and public.is_admin());
commit;

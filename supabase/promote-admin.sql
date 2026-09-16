-- Run AFTER registering this mailbox and confirming its email in production.
-- No public signup or user-supplied metadata grants administrator privileges.
do $$
begin
 if not exists(select 1 from auth.users where lower(email)='agentkelly2024@gmail.com' and email_confirmed_at is not null) then
  raise exception 'Register and verify the admin email first';
 end if;
 update public.profiles p set role='admin' from auth.users u where p.id=u.id and lower(u.email)='agentkelly2024@gmail.com' and u.email_confirmed_at is not null;
end $$;

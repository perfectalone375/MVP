
create or replace function add_credits(user_uuid uuid, amount int)
returns void
language plpgsql
security definer
as $$
begin
  update public.users
  set credits = credits + amount
  where id = user_uuid;
end;
$$;

create or replace function deduct_credits(user_uuid uuid, amount int)
returns boolean
language plpgsql
security definer
as $$
declare
  current_credits int;
begin
  select credits into current_credits from public.users where id = user_uuid;
  
  if current_credits >= amount then
    update public.users set credits = credits - amount where id = user_uuid;
    return true;
  else
    return false;
  end if;
end;
$$;

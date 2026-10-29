
-- Helper function to update ATP scores safely
create or replace function update_atp_score(
  user_uuid uuid,
  new_score float,
  category text
)
returns void
language plpgsql
as $$
declare
  query text;
begin
  -- Dynamic column update is risky, but for MVP we mapped category to column name exactly
  -- Valid categories: 'domain_interview_score', 'communication_score', etc.
  
  if category not in ('domain_interview_score', 'communication_score', 'behavioural_score', 'resume_score') then
    raise exception 'Invalid score category';
  end if;

  execute format('update atp set %I = $1, final_atp_score = (identity_score + resume_score + project_depth_score + communication_score + gd_score + behavioural_score + skill_test_score + fraud_risk_score) / 8 where user_id = $2', category)
  using new_score, user_uuid;
  
  -- Insert if not exists (upsert logic handled in app mostly, but good fallback)
  if not found then
    execute format('insert into atp (user_id, %I) values ($1, $2)', category)
    using user_uuid, new_score;
  end if;
end;
$$;

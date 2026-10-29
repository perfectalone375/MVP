
-- Drop existing if exists to avoid conflicts during dev
drop function if exists match_resumes;

create or replace function match_resumes (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  user_id uuid,
  parsed_json jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    resumes.id,
    resumes.user_id,
    resumes.parsed_json,
    1 - (resumes.embeddings_vector <=> query_embedding) as similarity
  from resumes
  where 1 - (resumes.embeddings_vector <=> query_embedding) > match_threshold
  order by resumes.embeddings_vector <=> query_embedding
  limit match_count;
end;
$$;

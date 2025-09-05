-- Enhance chat_messages table with better structure
alter table public.chat_messages 
add column if not exists session_id uuid default gen_random_uuid(),
add column if not exists project_id uuid references public.projects(id) on delete set null,
add column if not exists tokens_used integer default 0,
add column if not exists response_time_ms integer default 0;

-- Create index for better performance
create index if not exists idx_chat_messages_user_session 
on public.chat_messages(user_id, session_id, created_at);

create index if not exists idx_chat_messages_project 
on public.chat_messages(project_id, created_at);

-- Update RLS policies for chat_messages if not exists
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'chat_messages' 
    and policyname = 'chat_messages_select_own'
  ) then
    create policy "chat_messages_select_own"
      on public.chat_messages for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'chat_messages' 
    and policyname = 'chat_messages_insert_own'
  ) then
    create policy "chat_messages_insert_own"
      on public.chat_messages for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'chat_messages' 
    and policyname = 'chat_messages_update_own'
  ) then
    create policy "chat_messages_update_own"
      on public.chat_messages for update
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies 
    where tablename = 'chat_messages' 
    and policyname = 'chat_messages_delete_own'
  ) then
    create policy "chat_messages_delete_own"
      on public.chat_messages for delete
      using (auth.uid() = user_id);
  end if;
end $$;

-- Enable RLS if not already enabled
alter table public.chat_messages enable row level security;

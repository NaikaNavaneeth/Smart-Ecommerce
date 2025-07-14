create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default now()
);

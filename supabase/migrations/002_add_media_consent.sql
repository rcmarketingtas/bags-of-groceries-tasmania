alter table applications
  add column if not exists media_consent boolean not null default false;

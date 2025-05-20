-- Enable admin API access for local development
BEGIN;
  -- Update auth settings in the auth.config table
  UPDATE auth.config
  SET config_value = jsonb_set(
    config_value,
    '{email_confirm_required}',
    'false'
  );

  -- Enable signups
  UPDATE auth.config
  SET config_value = jsonb_set(
    config_value,
    '{enable_signup}',
    'true'
  );

  -- Set JWT expiration times
  UPDATE auth.config
  SET config_value = jsonb_set(
    config_value,
    '{jwt_exp}',
    '3600'
  );

  UPDATE auth.config
  SET config_value = jsonb_set(
    config_value,
    '{jwt_refresh_exp}',
    '86400'
  );
COMMIT;

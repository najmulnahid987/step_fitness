import { validateEnv } from '@/config/env';

describe('Runtime Environment Validation (validateEnv)', () => {
  it('1. falls back to default development environment when EXPO_PUBLIC_APP_ENV is omitted', () => {
    const config = validateEnv({});
    expect(config.appEnv).toBe('development');
    expect(config.isSupabaseConfigured).toBe(false);
  });

  it('2. validates a valid preview environment', () => {
    const config = validateEnv({
      EXPO_PUBLIC_APP_ENV: 'preview',
    });
    expect(config.appEnv).toBe('preview');
  });

  it('3. validates a valid production environment', () => {
    const config = validateEnv({
      EXPO_PUBLIC_APP_ENV: 'production',
    });
    expect(config.appEnv).toBe('production');
  });

  it('4. allows startup when both optional Supabase values are absent or empty', () => {
    const configAbsent = validateEnv({
      EXPO_PUBLIC_APP_ENV: 'development',
    });
    expect(configAbsent.supabaseUrl).toBeNull();
    expect(configAbsent.supabasePublishableKey).toBeNull();
    expect(configAbsent.isSupabaseConfigured).toBe(false);

    const configEmpty = validateEnv({
      EXPO_PUBLIC_APP_ENV: 'development',
      EXPO_PUBLIC_SUPABASE_URL: '   ',
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '',
    });
    expect(configEmpty.supabaseUrl).toBeNull();
    expect(configEmpty.supabasePublishableKey).toBeNull();
    expect(configEmpty.isSupabaseConfigured).toBe(false);
  });

  it('5. succeeds when both valid Supabase URL and publishable key are provided', () => {
    const config = validateEnv({
      EXPO_PUBLIC_APP_ENV: 'production',
      EXPO_PUBLIC_SUPABASE_URL: 'https://testproject.supabase.co',
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sbp_mock_publishable_key_value',
    });

    expect(config.supabaseUrl).toBe('https://testproject.supabase.co');
    expect(config.supabasePublishableKey).toBe('sbp_mock_publishable_key_value');
    expect(config.isSupabaseConfigured).toBe(true);
  });

  it('6. throws an error when Supabase publishable key is provided without Supabase URL', () => {
    expect(() =>
      validateEnv({
        EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sbp_mock_key_without_url',
      }),
    ).toThrow(/EXPO_PUBLIC_SUPABASE_URL is required/);
  });

  it('7. throws an error when Supabase URL is provided without Supabase publishable key', () => {
    expect(() =>
      validateEnv({
        EXPO_PUBLIC_SUPABASE_URL: 'https://testproject.supabase.co',
      }),
    ).toThrow(/EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required/);
  });

  it('8. throws an error when Supabase URL is malformed', () => {
    expect(() =>
      validateEnv({
        EXPO_PUBLIC_SUPABASE_URL: 'not-a-valid-url',
        EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sbp_key',
      }),
    ).toThrow(/EXPO_PUBLIC_SUPABASE_URL must be a valid/);

    expect(() =>
      validateEnv({
        EXPO_PUBLIC_SUPABASE_URL: 'ftp://ftp.example.com',
        EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sbp_key',
      }),
    ).toThrow(/must be a valid HTTP or HTTPS URL/);
  });

  it('9. throws an error when an invalid application environment is specified', () => {
    expect(() =>
      validateEnv({
        EXPO_PUBLIC_APP_ENV: 'staging',
      }),
    ).toThrow(/Invalid application environment/);

    expect(() =>
      validateEnv({
        EXPO_PUBLIC_APP_ENV: 'local',
      }),
    ).toThrow(/Invalid application environment/);
  });

  it('10. never includes the raw secret/key content in error messages', () => {
    const sensitiveKey = 'SUPER_SECRET_TOKEN_DO_NOT_LEAK_12345';
    let caughtMessage = '';

    try {
      validateEnv({
        EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: sensitiveKey,
        // Missing URL triggers error
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        caughtMessage = err.message;
      }
    }

    expect(caughtMessage).toContain('EXPO_PUBLIC_SUPABASE_URL is required');
    expect(caughtMessage).not.toContain(sensitiveKey);
  });
});

import { z } from 'zod';

export type AppEnvironment = 'development' | 'preview' | 'production';

export interface AppEnvConfig {
  appEnv: AppEnvironment;
  supabaseUrl: string | null;
  supabasePublishableKey: string | null;
  isSupabaseConfigured: boolean;
}

const rawEnvSchema = z
  .object({
    EXPO_PUBLIC_APP_ENV: z
      .enum(['development', 'preview', 'production'])
      .optional()
      .default('development'),
    EXPO_PUBLIC_SUPABASE_URL: z.string().optional(),
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const rawUrl = data.EXPO_PUBLIC_SUPABASE_URL?.trim();
    const rawKey = data.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

    const hasUrl = Boolean(rawUrl && rawUrl.length > 0);
    const hasKey = Boolean(rawKey && rawKey.length > 0);

    if (hasUrl && !hasKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY'],
        message:
          'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required when EXPO_PUBLIC_SUPABASE_URL is provided.',
      });
    }

    if (!hasUrl && hasKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['EXPO_PUBLIC_SUPABASE_URL'],
        message:
          'EXPO_PUBLIC_SUPABASE_URL is required when EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY is provided.',
      });
    }

    if (hasUrl) {
      try {
        const parsedUrl = new URL(rawUrl!);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['EXPO_PUBLIC_SUPABASE_URL'],
            message: 'EXPO_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL.',
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['EXPO_PUBLIC_SUPABASE_URL'],
          message: 'EXPO_PUBLIC_SUPABASE_URL must be a valid, well-formed URL.',
        });
      }
    }
  });

export function validateEnv(rawInput: Record<string, string | undefined>): AppEnvConfig {
  // Normalize empty strings to undefined
  const normalizedInput = {
    EXPO_PUBLIC_APP_ENV:
      rawInput.EXPO_PUBLIC_APP_ENV && rawInput.EXPO_PUBLIC_APP_ENV.trim() !== ''
        ? rawInput.EXPO_PUBLIC_APP_ENV.trim()
        : undefined,
    EXPO_PUBLIC_SUPABASE_URL:
      rawInput.EXPO_PUBLIC_SUPABASE_URL && rawInput.EXPO_PUBLIC_SUPABASE_URL.trim() !== ''
        ? rawInput.EXPO_PUBLIC_SUPABASE_URL.trim()
        : undefined,
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      rawInput.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
      rawInput.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.trim() !== ''
        ? rawInput.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.trim()
        : undefined,
  };

  const parseResult = rawEnvSchema.safeParse(normalizedInput);

  if (!parseResult.success) {
    const errorDetails = parseResult.error.issues
      .map((issue) => {
        const field = issue.path.join('.') || 'configuration';
        return `  - [${field}]: ${issue.message}`;
      })
      .join('\n');

    throw new Error(
      `[Runtime Environment Configuration Error]\nInvalid application environment variables:\n${errorDetails}\n\n` +
        'Please inspect your environment settings or .env file (refer to .env.example). ' +
        'Never commit secret keys.',
    );
  }

  const { EXPO_PUBLIC_APP_ENV, EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY } =
    parseResult.data;

  const isConfigured = Boolean(EXPO_PUBLIC_SUPABASE_URL && EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  return {
    appEnv: EXPO_PUBLIC_APP_ENV as AppEnvironment,
    supabaseUrl: EXPO_PUBLIC_SUPABASE_URL ?? null,
    supabasePublishableKey: EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null,
    isSupabaseConfigured: isConfigured,
  };
}

export const env: AppEnvConfig = validateEnv({
  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

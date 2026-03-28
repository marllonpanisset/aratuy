/**
 * Environment configuration helper for Aratuya MVP.
 * 
 * In Lovable, env vars are injected automatically via Lovable Cloud.
 * For self-hosting or local development, create a `.env.local` file
 * at the project root with these variables:
 * 
 * VITE_SUPABASE_URL=https://your-project.supabase.co
 * VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
 * VITE_APP_ENV=development
 */

export const ENV = {
  /** Current environment: 'development' | 'production' */
  MODE: import.meta.env.MODE as string,
  
  /** Custom app env flag (optional override) */
  APP_ENV: (import.meta.env.VITE_APP_ENV || import.meta.env.MODE) as string,
  
  /** Whether we're in production */
  IS_PROD: import.meta.env.PROD,
  
  /** Whether we're in development */
  IS_DEV: import.meta.env.DEV,
  
  /** Supabase URL */
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  
  /** Supabase anon key */
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,

  /** Base API URL for edge functions */
  get API_URL() {
    return `${this.SUPABASE_URL}/functions/v1`;
  },
} as const;

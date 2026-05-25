import { createClient } from '@supabase/supabase-js';

/*
 * for noticeable reasons, I must hide this :sad
 */
const SUPABASE_URL = 'API_URL';
const SUPABASE_PUBLISHABLE_KEY = 'API_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
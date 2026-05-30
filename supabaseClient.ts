import { createClient } from '@supabase/supabase-js';

// Estas credenciales te las tiene que pasar Juan Pablo apenas cree el proyecto en Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

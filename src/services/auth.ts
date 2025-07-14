import { supabase } from '../lib/supabase';

export const signupUser = async (name: string, email: string, password: string) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password }]);

  return { data, error };
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  return { data, error };
};

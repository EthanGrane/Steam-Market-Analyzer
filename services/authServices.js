import { supabase } from "../lib/supabase";

export const tryToLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true };
};

export const tryToLogout = async () => {
    await supabase.auth.signOut();
};
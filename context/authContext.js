import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GetProfile } from '../services/profileServices';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const loadProfile = async (userId) => {
        const profileRes = await GetProfile(userId);
        setProfile(profileRes);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const sessionUser = data.session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) loadProfile(sessionUser.id);
        });


        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) loadProfile(sessionUser.id);
            else setProfile(null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loadProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar en cualquier componente
export const useAuth = () => useContext(AuthContext);
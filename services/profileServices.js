import SteamApi from './SteamServices';
import { supabase } from '../lib/supabase';

const defaultUsernames = [
    "NathanDrake",
    "ArthurMorgan",
    "GeraltOfRivia",
    "Kratos",
    "EllieWilliams",
    "JoelMiller",
    "LaraCroft",
    "MasterChief",
    "MarcusFenix",
    "SolidSnake",
    "BigBoss",
    "CloudStrife",
    "Sephiroth",
    "LinkHero",
    "ZeldaPrincess",
    "SamusAran",
    "RyuHayabusa",
    "JinKazama",
    "SubZero",
    "ScorpionMK",
    "EzioAuditore",
    "ConnorKenway",
    "EdwardKenway",
    "VitoScaletta",
    "MaxPayne"
];

export const GetProfile = async (user_id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user_id)
        .single();

    if (error) return;

    if (!data || data.length === 0) {
        const newProfile = await CreateProfile(user_id);
        return newProfile;
    }

    const avatarURL = SteamApi.getGameIcon(data.avatar_steam_app_id);
    const headerURL = SteamApi.getGameHeader(data.avatar_steam_app_id);

    return {
        username: data.username,
        avatar: avatarURL,
        header: headerURL,
        avatar_steam_app_id: data.avatar_steam_app_id,
    };
};

export const SetNewAvatar = async (user_id, newSteamAppId) => {
    console.log('SetNewAvatar start', user_id, newSteamAppId);

    try {
        const result = await Promise.race([
            supabase
                .from('profiles')
                .update({ avatar_steam_app_id: newSteamAppId })
                .eq('id', user_id)
                .select(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('TIMEOUT')), 5000)
            )
        ]);

        console.log('result:', result);
    } catch (e) {
        console.error('caught:', e.message);
    }
};

export const CreateProfile = async (user_id) => {
    const username =
        defaultUsernames[Math.floor(Math.random() * defaultUsernames.length)] +
        Math.floor(Math.random() * 999);

    const { data, error } = await supabase
        .from('profiles')
        .insert([
            {
                id: user_id,
                username: username,
                avatar_steam_app_id: null,
            },
        ])
        .select();

    if (error) return;

    return data;
};
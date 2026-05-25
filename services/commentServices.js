import { supabase } from '../lib/supabase';

export const fetchComments = async (steam_app_id) => {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('steam_app_id', steam_app_id)
        .eq('enabled', true);   // ← filtra directo en la query

    if (error || !data) return [];

    const formatted = await Promise.all(
        data.map(async (comment) => {
            const { likes, dislikes } = await fetchLikes(comment.id);
            return {
                id: comment.id,
                author: comment.user_id,
                comment: comment.comment,
                date: comment.created_at,
                likes,
                dislikes,
            };
        })
    );

    return formatted;
};

export const fetchLikes = async (comment_id) => {
    const { data, error } = await supabase
        .from('likes')
        .select('value')
        .eq('comment_id', comment_id);

    if (error || !data) return { likes: 0, dislikes: 0 };

    let likes = 0;
    let dislikes = 0;
    data.forEach((c) => {
        if (c.value === 1) likes++;
        if (c.value === -1) dislikes++;
    });

    return { likes, dislikes };
};

export const postComment = async (user_id, steam_app_id, comment) => {
    const { data, error } = await supabase
        .from('comments')
        .insert([{ user_id, steam_app_id, comment }])
        .select();

    if (error) return null;

    const comment_id = data[0].id;

    await voteComment(user_id, comment_id, 1);

    return data;
};

export const voteComment = async (user_id, comment_id, value) => {
    const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user_id)
        .eq('comment_id', comment_id)
        .maybeSingle();

    // 1. NO EXISTE → crear voto
    if (!data) {
        await supabase.from('likes').insert({ user_id, comment_id, value });
        return value === 1 ? { likeDelta: 1, dislikeDelta: 0 } : { likeDelta: 0, dislikeDelta: 1 };
    }

    // 2. MISMO VOTO → toggle off
    if (data.value === value) {
        await supabase.from('likes').delete().eq('id', data.id);
        return value === 1 ? { likeDelta: -1, dislikeDelta: 0 } : { likeDelta: 0, dislikeDelta: -1 };
    }

    // 3. CAMBIO like ↔ dislike
    await supabase.from('likes').update({ value }).eq('id', data.id);
    return value === 1
        ? { likeDelta: 1, dislikeDelta: -1 }
        : { likeDelta: -1, dislikeDelta: 1 };
};

export const deleteComment = async (user_id, comment_id) => {
    const { error } = await supabase
        .from('comments')
        .update(
            {
                enabled: false
            }
        )
        .eq('id', comment_id)
        .eq('user_id', user_id)

    if (error) { console.log(error); return null };

    return true;
}
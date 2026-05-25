import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { TrashIcon, UserIcon } from './Icons';
import { GetProfile } from '../../services/profileServices';
import { fetchComments, postComment, voteComment, deleteComment } from '../../services/commentServices';
import { useAuth } from '../../context/authContext';

// ─── CommentCard ──────────────────────────────────────────────────────────────

function CommentCard({ comment_id, author, date, text, likes, dislikes, onDelete }) {
    const { user } = useAuth();
    const [localLikes, setLocalLikes] = useState(likes);
    const [localDislikes, setLocalDislikes] = useState(dislikes);
    const [activeVote, setActiveVote] = useState(null);
    const [authorProfile, setAuthorProfile] = useState(null);

    useEffect(() => {
        GetProfile(author).then(setAuthorProfile);
    }, [author]);

    const vote = async (value) => {
        if (!user) return;
        const { likeDelta, dislikeDelta } = await voteComment(user.id, comment_id, value);
        setLocalLikes(prev => prev + likeDelta);
        setLocalDislikes(prev => prev + dislikeDelta);
        // toggle off si mismo voto, sino actualizar
        setActiveVote(prev => prev === value ? null : value);
    };

    const isOwner = user?.id === author;

    const handleDelete = async () => {
        if (!user) return;
        await deleteComment(user.id, comment_id);
        onDelete(comment_id);
    };

    return (
        <View style={s.commentCard}>
            <View style={s.commentHeader}>
                <View style={s.avatar}>
                    {authorProfile?.avatar ? (
                        <Image
                            source={{ uri: authorProfile.avatar }}
                            style={{ width: '100%', height: '100%', borderRadius: 24, objectFit: 'contain' }}
                        />
                    ) : (
                        <UserIcon size={24} color="#8b93a7" />
                    )}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={s.commentUser}>{authorProfile?.username ?? 'Anon User'}</Text>
                    <Text style={s.commentDate}>{date.split('T')[0]}</Text>
                </View>

                {/* Botón borrar — solo visible para el autor */}
                {isOwner && (
                    <Pressable onPress={handleDelete} style={s.deleteButton}>
                        <TrashIcon size={12} color='#A32D2D'></TrashIcon>
                    </Pressable>
                )}
            </View>

            <Text style={s.commentText}>{text}</Text>

            <View style={s.voteRow}>
                <Pressable
                    style={[
                        s.voteButton,
                        activeVote === 1 && s.voteButtonLikeActive,
                    ]}
                    onPress={() => vote(1)}
                >
                    <Text style={s.voteIcon}>▲</Text>
                    <Text style={s.voteCount}>{localLikes}</Text>
                </Pressable>
                <Pressable
                    style={[
                        s.voteButton,
                        s.voteButtonDislike,
                        activeVote === -1 && s.voteButtonDislikeActive,
                    ]}
                    onPress={() => vote(-1)}
                >
                    <Text style={[s.voteIcon, s.voteIconDislike]}>▼</Text>
                    <Text style={[s.voteCount, s.voteCountDislike]}>{localDislikes}</Text>
                </Pressable>
            </View>
        </View>
    );
}

// ─── CommentSection ───────────────────────────────────────────────────────────

export default function CommentSection({ steam_app_id }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState('');

    const [posting, setPosting] = useState(false);
    const [posted, setPosted] = useState(false);

    useEffect(() => {
        fetchComments(steam_app_id).then(setComments);
    }, [steam_app_id]);

    const handlePost = async () => {
        if (!userComment.trim() || !user || posting) return;
        setPosting(true);
        await postComment(user.id, steam_app_id, userComment.substring(0, 128));
        setUserComment('');
        await fetchComments(steam_app_id).then(setComments);
        setPosting(false);
        setPosted(true);
        setTimeout(() => setPosted(false), 2000);
    };

    const handleDelete = (comment_id) => {
        setComments(prev => prev.filter(c => c.id !== comment_id));
    };

    return (
        <View style={s.wrapper}>
            <Text style={s.sectionTitle}>Community Comments</Text>

            <View style={s.inputBlock}>
                {user ? (
                    <>
                        <TextInput
                            style={s.input}
                            placeholder="Write a comment..."
                            placeholderTextColor="#555e72"
                            multiline
                            numberOfLines={3}
                            value={userComment}
                            onChangeText={(t) => setUserComment(t.substring(0, 128))}
                        />
                        <Pressable
                            style={({ pressed }) => [
                                s.submitButton,
                                pressed && s.submitButtonPressed,
                                posting && s.submitButtonLoading,
                                posted && s.submitButtonSuccess,
                            ]}
                            onPress={handlePost}
                            disabled={posting}
                        >
                            {posting ? (
                                <ActivityIndicator size="small" color="#4a90d9" />
                            ) : (
                                <Text style={[s.submitText, posted && { color: '#639922' }]}>
                                    {posted ? '✓ Posted' : 'Post'}
                                </Text>
                            )}
                        </Pressable>
                    </>
                ) : (
                    <Text style={{ color: '#555e72', fontStyle: 'italic', margin: 'auto' }}>
                        Log in to post a comment.
                    </Text>
                )}
            </View>

            <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={false}
                style={s.commentList}
                contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
            >
                {comments.length > 0 ? (
                    comments.map((commentData) => {
                        if (!commentData) return null;
                        return (
                            <CommentCard
                                key={commentData.id}
                                comment_id={commentData.id}
                                author={commentData.author}
                                date={commentData.date}
                                text={commentData.comment}
                                likes={commentData.likes}
                                dislikes={commentData.dislikes}
                                onDelete={handleDelete}
                            />
                        )
                    })
                ) : (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={s.loadMoreText}>No comments yet.</Text>
                    </View>
                )}

                <Pressable style={s.loadMoreButton}>
                    <Text style={s.loadMoreText}>Load more comments ↓</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    wrapper: { marginTop: 16 },
    sectionTitle: {
        color: '#4a90d9', fontSize: 11, fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: 1.2,
        marginBottom: 4, borderBottomWidth: 1,
        borderBottomColor: '#1c2333', paddingBottom: 4,
    },
    inputBlock: { marginTop: 10, gap: 8 },
    input: {
        backgroundColor: '#151922', borderRadius: 8, borderWidth: 1,
        borderColor: '#222838', padding: 12, color: '#fff',
        fontSize: 13, textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#151922',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2a3348',
        paddingVertical: 10,
        alignItems: 'center',
        height: 38,                    // altura fija para que no salte al cambiar contenido
        justifyContent: 'center',
    },
    submitButtonPressed: {
        backgroundColor: '#1a2030',
        transform: [{ scale: 0.98 }],
        opacity: 0.85,
    },
    submitButtonLoading: {
        borderColor: '#2a3348',
        opacity: 0.6,
    },
    submitButtonSuccess: {
        borderColor: '#27500a',
        backgroundColor: '#0d1a0a',
    },
    submitText: { color: '#4a90d9', fontSize: 13, fontWeight: '500' },
    commentList: { marginTop: 12 },
    commentCard: {
        backgroundColor: '#151922', borderRadius: 8, borderWidth: 1,
        borderColor: '#222838', padding: 12, gap: 8,
    },
    commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    avatar: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#1a2030', borderWidth: 1,
        borderColor: '#2a3348', alignItems: 'center', justifyContent: 'center',
    },
    commentUser: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
    commentDate: { color: '#555e72', fontSize: 10, fontFamily: 'monospace' },
    commentText: { color: '#9aa3b5', fontSize: 13, lineHeight: 20 },
    voteRow: { flexDirection: 'row', gap: 8 },
    voteButton: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#1a2030', borderRadius: 6, borderWidth: 1,
        borderColor: '#2a3348', paddingHorizontal: 10, paddingVertical: 5,
    },
    voteButtonDislike: { borderColor: '#3d1515' },
    voteIcon: { color: '#639922', fontSize: 11 },
    voteIconDislike: { color: '#A32D2D' },
    voteCount: { color: '#639922', fontSize: 12, fontWeight: '600' },
    voteCountDislike: { color: '#A32D2D' },

    voteButton: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: '#1a2030', borderRadius: 6, borderWidth: 1,
        borderColor: '#2a4a1a',              // ← verde por defecto (like)
        paddingHorizontal: 10, paddingVertical: 5,
    },
    voteButtonDislike: {
        borderColor: '#3d1515',              // ← rojo por defecto (dislike)
    },
    voteButtonLikeActive: {
        backgroundColor: '#0d1a0a',
        borderColor: '#639922',
    },
    voteButtonDislikeActive: {
        backgroundColor: '#1a0a0a',
        borderColor: '#A32D2D',
    },
    loadMoreButton: {
        backgroundColor: '#151922', borderRadius: 8, borderWidth: 1,
        borderColor: '#2a3348', paddingVertical: 10, alignItems: 'center', marginTop: 4,
    },
    loadMoreText: { color: '#555e72', fontSize: 12 },
    deleteButton: {
        marginLeft: 'auto', padding: 4,
        borderRadius: 6,
        borderWidth: 1, borderColor: '#3d1515',
        alignItems: 'center', justifyContent: 'center',
        width: 24, height: 24,
    },
    deleteText: { color: '#A32D2D', fontSize: 11, fontWeight: '700' },
});

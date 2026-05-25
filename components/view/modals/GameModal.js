import {
    Modal,
    View,
    Text,
    Image,
    ScrollView,
    Pressable,
    StyleSheet,
    Dimensions,
    Linking,
} from 'react-native';

import { Svg, Circle, G } from 'react-native-svg';

import CommentSection from '../CommentSection';
import { UserIcon } from '../Icons';
import { colors, typography, spacing, radius } from '../../../assets/ui/tokens';
import {
    StatBox,
    Tag,
    TagRow,
    Section,
    InfoRow,
    ReviewBar,
    Disclaimer,
    AssumptionsBlock,
    AssumptionItem,
    EstimateRow,
    EstimateHeader,
    LinkButton,
    DevNote,
    Collapsible,
} from '../../../assets/ui/components';

import { useState } from 'react';

const { height } = Dimensions.get('window');

// ─── Helpers de dominio ───────────────────────────────────────────────────────

function getReviewColor(positive, total) {
    if (total === 0) return colors.review.none;
    const ratio = positive / total;
    if (ratio >= 0.70) return colors.review.positive;
    if (ratio >= 0.40) return colors.review.mixed;
    return colors.review.negative;
}

function formatPrice(priceOverview) {
    if (!priceOverview) return 'N/A';
    if (priceOverview.final === 0) return 'Free to Play';
    return `${(priceOverview.final / 100).toFixed(2)} ${priceOverview.currency}`;
}

function metacriticColor(score) {
    if (score >= 75) return colors.metacritic.good;
    if (score >= 50) return colors.metacritic.mixed;
    return colors.metacritic.bad;
}

// ─── NB (New Boxleiter) — estimación de ventas ────────────────────────────────
// Fuente: GameDiscoverCo newsletter by Simon Carless
// https://newsletter.gamediscover.co/p/how-that-game-sold-on-steam-using

function getMultiplierForYear(year) {
    const y = parseInt(year) || 2022;
    if (y < 2017) return { low: 50, mid: 74, high: 100 };
    if (y < 2019) return { low: 35, mid: 55, high: 80 };
    if (y < 2020) return { low: 25, mid: 51, high: 70 };
    return { low: 20, mid: 38, high: 60 }; // 2020+
}

function estimateSales(totalReviews, releaseYear) {
    if (!totalReviews || totalReviews === 0) return null;
    const mult = getMultiplierForYear(releaseYear);
    return {
        low: Math.round(totalReviews * mult.low),
        mid: Math.round(totalReviews * mult.mid),
        high: Math.round(totalReviews * mult.high),
        mult,
    };
}

function estimateRevenue(estimatedSales, priceOverview) {
    if (!estimatedSales || !priceOverview) return null;
    const priceEur = (priceOverview.final ?? 0) / 100;
    if (priceEur === 0) return null;
    // ~45% effective discount factor, 30% Steam cut, ~7% refunds
    const effectivePrice = priceEur * 0.55;
    const netPerUnit = effectivePrice * 0.70 * 0.93;
    return {
        grossLow: Math.round(estimatedSales.low * effectivePrice),
        grossMid: Math.round(estimatedSales.mid * effectivePrice),
        grossHigh: Math.round(estimatedSales.high * effectivePrice),
        netLow: Math.round(estimatedSales.low * netPerUnit),
        netMid: Math.round(estimatedSales.mid * netPerUnit),
        netHigh: Math.round(estimatedSales.high * netPerUnit),
        priceEur,
        effectivePrice: effectivePrice.toFixed(2),
        currency: priceOverview.currency || 'EUR',
    };
}

// ─── Secciones del modal ──────────────────────────────────────────────────────

function ReviewSection({ total_reviews, total_positive, total_negative, review_score_desc, reviewColor }) {
    const ratio = total_reviews > 0 ? (total_positive / total_reviews) * 100 : 0;
    return (
        <Section title="Reviews">
            <ReviewPieChart
                total_positive={total_positive}
                total_negative={total_negative}
            />
            <View style={s.statRow}>
                <StatBox label="Score" value={`${Math.round(ratio)}%`} accent={reviewColor} />
                <StatBox label="Rating" value={review_score_desc} accent={reviewColor} />
            </View>
        </Section>
    );
}

function SalesEstimatesSection({ estimatedSales, estimatedRevenue, releaseYear }) {
    if (!estimatedSales) return null;
    return (
        <Section title="Sales & Revenue Estimates" accent={colors.accent.gold}>
            <Disclaimer>
                <Text style={{ fontWeight: typography.weight.bold }}>Rough estimates only — not real data.</Text>{' '}
                Based on the{' '}
                <Text style={{ color: '#c8a030' }}>NB (New Boxleiter) method</Text>
                {' '}by Simon Carless / GameDiscoverCo: multiply public review count by a
                sales-per-review factor. Real figures can differ significantly.
            </Disclaimer>

            <EstimateHeader />

            <EstimateRow
                label="Units sold (lifetime)"
                low={estimatedSales.low} mid={estimatedSales.mid} high={estimatedSales.high}
                midColor={colors.accent.gold}
            />
            <EstimateRow
                label='Units sold (year 1, ~60%)'
                low={Math.round(estimatedSales.low * 0.6)}
                mid={Math.round(estimatedSales.mid * 0.6)}
                high={Math.round(estimatedSales.high * 0.6)}
                midColor={colors.accent.gold}
            />

            {estimatedRevenue && (
                <>
                    <EstimateRow
                        label="Gross revenue (lifetime)"
                        low={estimatedRevenue.grossLow} mid={estimatedRevenue.grossMid} high={estimatedRevenue.grossHigh}
                        prefix="€" midColor={colors.accent.gold}
                    />
                    <EstimateRow
                        label="Dev net (after Steam + refunds)"
                        low={estimatedRevenue.netLow} mid={estimatedRevenue.netMid} high={estimatedRevenue.netHigh}
                        prefix="€" midColor={colors.review.positive}
                    />
                    <EstimateRow
                        label="Dev net year 1 (~60%)"
                        low={Math.round(estimatedRevenue.netLow * 0.6)}
                        mid={Math.round(estimatedRevenue.netMid * 0.6)}
                        high={Math.round(estimatedRevenue.netHigh * 0.6)}
                        prefix="€" midColor={colors.review.positive}
                    />
                </>
            )}

            <AssumptionsBlock>
                <AssumptionItem
                    label="NB multiplier:"
                    value={`×${estimatedSales.mult.low}–${estimatedSales.mult.high}${releaseYear ? ` (${releaseYear} game)` : ''}`}
                />
                {estimatedRevenue && (
                    <>
                        <AssumptionItem
                            label="List price:"
                            value={`${estimatedRevenue.priceEur.toFixed(2)} ${estimatedRevenue.currency}`}
                        />
                        <AssumptionItem
                            label="Effective avg price after discounts:"
                            value={`~€${estimatedRevenue.effectivePrice} (−45%)`}
                        />
                        <AssumptionItem label="Steam cut:" value="30%" />
                        <AssumptionItem label="Refunds:" value="~7%" />
                    </>
                )}
                <AssumptionItem label="Year-1 share:" value="~60% of lifetime" />
            </AssumptionsBlock>
        </Section>
    );
}

function DevResearchSection({ total_reviews, ratio, reviewColor, genres, metacritic, achievements, categories, tags, price_overview }) {
    if (!total_reviews && genres.length === 0) return null;
    return (
        <Collapsible title="Dev Research Notes" accent={colors.accent.purple} defaultOpen={false}>
            <View style={s.devNoteBlock}>
                {total_reviews > 0 && (
                    <DevNote>
                        📊{' '}
                        <Text style={{ color: colors.text.primary }}>{total_reviews.toLocaleString()} reviews</Text>
                        {' '}/ <Text style={{ color: reviewColor }}>{Math.round(ratio)}% positive</Text>
                        {' '}— this game is in the{' '}
                        <Text style={{ color: colors.text.primary }}>
                            {total_reviews > 10000
                                ? 'top tier (10K+ reviews)'
                                : total_reviews > 1000
                                    ? 'mid tier (1K–10K)'
                                    : 'long tail (<1K)'}
                        </Text>
                        {' '}of Steam releases.
                    </DevNote>
                )}
                {genres.length > 0 && (
                    <DevNote>
                        🎮 Genre:{' '}
                        <Text style={{ color: colors.text.primary }}>{genres.map(g => g.description).join(', ')}</Text>.
                        {' '}Read the negative reviews to identify unmet expectations in this genre — that's your opportunity gap.
                    </DevNote>
                )}
                {metacritic?.score ? (
                    <DevNote>
                        🏆 Metacritic{' '}
                        <Text style={{ color: colors.text.primary }}>{metacritic.score}</Text>
                        {' '}—{' '}
                        {metacritic.score >= 80
                            ? 'strong press coverage likely drove significant day-1 traffic.'
                            : metacritic.score >= 65
                                ? 'moderate press presence; community/organic discovery played a larger role.'
                                : 'limited press coverage — this game grew mainly through organic/community channels.'}
                    </DevNote>
                ) : null}
                {achievements?.total ? (
                    <DevNote>
                        🏅{' '}
                        <Text style={{ color: colors.text.primary }}>{achievements.total} achievements</Text>
                        {' '}— signals investment in completionist / replayability design. A factor in player retention.
                    </DevNote>
                ) : null}
                {categories.some(c => c.description?.toLowerCase().includes('multi')) && (
                    <DevNote>
                        👥 Has a multiplayer component — increases word-of-mouth ceiling but also multiplies
                        development and live-ops costs.
                    </DevNote>
                )}
                {price_overview?.final > 0 && (
                    <DevNote>
                        💰 Priced at{' '}
                        <Text style={{ color: colors.text.primary }}>{formatPrice(price_overview)}</Text>.
                        {' '}On Steam, pricing tier strongly signals expected quality/scope to browsers.
                    </DevNote>
                )}
            </View>
        </Collapsible>
    );
}

// SVG

function ReviewPieChart({ total_positive, total_negative }) {
    const total = total_positive + total_negative;
    if (total === 0) return null;

    const SIZE = 120;
    const STROKE = 14;
    const R = (SIZE - STROKE) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * R;
    const positiveRatio = total_positive / total;
    const positiveDash = CIRCUMFERENCE * positiveRatio;
    const negativeDash = CIRCUMFERENCE * (1 - positiveRatio);

    return (
        <View style={{ alignItems: 'center', gap: spacing[2] }}>

            {/* Leyenda encima */}
            <View style={{ flexDirection: 'row', gap: spacing[4] }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.review.positive }} />
                    <Text style={{ color: colors.text.muted, fontSize: typography.size.sm }}>
                        Positive{' '}
                        <Text style={{ color: colors.review.positive, fontWeight: typography.weight.bold }}>
                            {total_positive.toLocaleString()}
                        </Text>
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.review.negative }} />
                    <Text style={{ color: colors.text.muted, fontSize: typography.size.sm }}>
                        Negative{' '}
                        <Text style={{ color: colors.review.negative, fontWeight: typography.weight.bold }}>
                            {total_negative.toLocaleString()}
                        </Text>
                    </Text>
                </View>
            </View>

            {/* Gráfico */}
            <Svg width={SIZE} height={SIZE}>
                <G rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`}>
                    {/* Fondo (negativas) */}
                    <Circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R}
                        stroke={colors.review.negative}
                        strokeWidth={STROKE}
                        fill="none"
                    />
                    {/* Positivas encima */}
                    <Circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R}
                        stroke={colors.review.positive}
                        strokeWidth={STROKE}
                        fill="none"
                        strokeDasharray={`${positiveDash} ${negativeDash}`}
                        strokeLinecap="butt"
                    />
                </G>
            </Svg>

            {/* Total debajo */}
            <Text style={{ color: colors.text.dim, fontSize: typography.size.sm }}>
                {total.toLocaleString()} total reviews
            </Text>

        </View>
    );
}

import { SetNewAvatar } from '../../../services/profileServices';
import { useAuth } from '../../../context/authContext';

// ─── Modal principal ──────────────────────────────────────────────────────────


// ─── Player Stats Section ─────────────────────────────────────────────────────

function PlayerStatsSection({ current_players, peak_ccu, owners, avg_hours_total, avg_hours_2weeks }) {
    if (!current_players && !peak_ccu && !owners) return null;

    const formatHours = (minutes) => {
        if (!minutes) return 'N/A';
        const h = Math.round(minutes / 60);
        return h >= 1 ? `${h.toLocaleString()}h` : `${minutes}m`;
    };

    return (
        <Section title="Player Stats" accent={colors.accent.blue}>
            <View style={s.statRow}>
                {current_players > 0 && (
                    <StatBox
                        label="Playing Now"
                        value={current_players.toLocaleString()}
                        accent={colors.review.positive}
                    />
                )}
                {peak_ccu > 0 && (
                    <StatBox
                        label={"Peak" + "\n" + "Concurrent Users"}
                        value={peak_ccu.toLocaleString()}
                        accent={colors.accent.blue}
                    />
                )}
                {avg_hours_total > 0 && (
                    <StatBox
                        label="Avg Playtime"
                        value={formatHours(avg_hours_total)}
                    />
                )}
                {avg_hours_2weeks > 0 && (
                    <StatBox
                        label="Last 2 Weeks"
                        value={formatHours(avg_hours_2weeks)}
                        accent={colors.accent.gold}
                    />
                )}
            </View>
        </Section>
    );
}

export default function GameModal({ visible, onClose, details, title }) {
    if (!details) return null;

    const { detailsData, reviewData } = details;
    const {
        name, short_description, header_image,
        genres = [], tags = [], categories = [],
        developers = [], publishers = [],
        release_date, metacritic, platforms,
        price_overview, website, steam_appid,
        supported_languages, achievements,
        current_players = 0,
        peak_ccu = 0,
        owners = null,
        avg_hours_total = 0,
        avg_hours_2weeks = 0,
    } = detailsData || {};

    const {
        total_reviews = 0,
        total_positive = 0,
        total_negative = 0,
        review_score_desc = '',
    } = reviewData || {};

    const reviewColor = getReviewColor(total_positive, total_reviews);
    const ratio = total_reviews > 0 ? (total_positive / total_reviews) * 100 : 0;
    const releaseYear = release_date?.date?.match(/\d{4}/)?.[0];
    const steamUrl = steam_appid ? `https://store.steampowered.com/app/${steam_appid}` : null;

    const estimatedSales = estimateSales(total_reviews, releaseYear);
    const estimatedRevenue = estimateRevenue(estimatedSales, price_overview);

    const { user, loadProfile, profile } = useAuth();

    /* Modify avatar */
    const isCurrentAvatar = profile?.avatar_steam_app_id
        ? String(profile.avatar_steam_app_id) === String(steam_appid)
        : false;

    const handleSetAvatar = async () => {
        if (!user || !steam_appid) return;
        await SetNewAvatar(user.id, steam_appid);
        await loadProfile(user.id);
    };


    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
            <Pressable style={s.backdrop} onPress={onClose} />

            <View style={s.wrapper} pointerEvents="box-none">
                <View style={s.modal}>

                    {/* Botón cerrar */}
                    <Pressable style={s.closeButton} onPress={onClose}>
                        <Text style={s.closeButtonText}>✕</Text>
                    </Pressable>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

                        {/* Hero image */}
                        {header_image ? (
                            <Image source={{ uri: header_image }} style={s.heroImage} resizeMode="cover" />
                        ) : null}

                        <View style={s.body}>

                            {/* Título + avatar */}
                            <View style={{ flexDirection: 'row', alignContent: 'space-between' }}>
                                <View>
                                    <Text style={s.title}>{name || title}</Text>
                                    {steam_appid
                                        ? <Text style={s.appId}>App ID: {steam_appid}</Text>
                                        : null}
                                </View>

                                <Pressable
                                    onPress={handleSetAvatar}
                                    style={({ pressed }) => [
                                        s.avatarButton,
                                        isCurrentAvatar && s.avatarButtonActive,
                                        pressed && s.avatarButtonPressed,
                                    ]}
                                >
                                    {isCurrentAvatar ? (
                                        <Text style={s.avatarButtonActiveText}>✓</Text>
                                    ) : (
                                        <>
                                            <UserIcon size={12} color={colors.accent.blue} />
                                            <Text style={s.avatarButtonText}>Set as Avatar</Text>
                                        </>
                                    )}
                                </Pressable>

                            </View>

                            {/* Descripción */}
                            {short_description ? (
                                <Section title="Description">
                                    <Text style={s.description}>{short_description}</Text>
                                </Section>
                            ) : null}

                            {/* Reviews */}
                            <ReviewSection
                                total_reviews={total_reviews}
                                total_positive={total_positive}
                                total_negative={total_negative}
                                review_score_desc={review_score_desc}
                                reviewColor={reviewColor}
                            />

                            {/* Price / Meta / Achievements */}
                            <Section title="Game stats">
                                <StatBox label="Price" value={formatPrice(price_overview)} />

                                <View style={s.statRow}>
                                    {metacritic?.score ? (
                                        <StatBox
                                            label="Metacritic"
                                            value={String(metacritic.score)}
                                            accent={metacriticColor(metacritic.score)}
                                        />
                                    ) : null}

                                    {achievements?.total
                                        ? <StatBox label="Achievements" value={String(achievements.total)} />
                                        : null}
                                    {release_date?.date
                                        ? <StatBox label="Released" value={release_date.date} small />
                                        : null}
                                </View>
                            </Section>

                            {/* Player Stats */}
                            <PlayerStatsSection
                                current_players={current_players}
                                peak_ccu={peak_ccu}
                                owners={owners}
                                avg_hours_total={avg_hours_total}
                                avg_hours_2weeks={avg_hours_2weeks}
                            />

                            {/* Estimaciones de ventas */}
                            <SalesEstimatesSection
                                estimatedSales={estimatedSales}
                                estimatedRevenue={estimatedRevenue}
                                releaseYear={releaseYear}
                            />

                            {/* Notas para desarrolladores */}
                            <DevResearchSection
                                total_reviews={total_reviews}
                                ratio={ratio}
                                reviewColor={reviewColor}
                                genres={genres}
                                metacritic={metacritic}
                                achievements={achievements}
                                categories={categories}
                                price_overview={price_overview}
                                tags={tags}
                            />

                            {/* Plataformas */}
                            {platforms ? (
                                <Collapsible title="Platforms" defaultOpen={false}>
                                    <TagRow>
                                        {platforms.windows && <Tag label="Windows" />}
                                        {platforms.mac && <Tag label="macOS" />}
                                        {platforms.linux && <Tag label="Linux" />}
                                    </TagRow>
                                </Collapsible>
                            ) : null}

                            {/* Géneros */}
                            {genres.length > 0 ? (
                                <Collapsible title="Genres">
                                    <TagRow>
                                        {genres.map(g => <Tag key={g.id} label={g.description} />)}
                                    </TagRow>
                                </Collapsible>
                            ) : null}

                            {/* Categories */}
                            {tags.length > 0 ? (
                                <Collapsible title="Tags">
                                    <TagRow>
                                        {tags.map(c => <Tag key={c} label={c} />)}
                                    </TagRow>
                                </Collapsible>
                            ) : null}

                            {/* Tags */}
                            {categories.length > 0 ? (
                                <Collapsible title="Categories" defaultOpen={false}>
                                    <TagRow>
                                        {categories.map(c => <Tag key={c.id} label={c.description} />)}
                                    </TagRow>
                                </Collapsible>
                            ) : null}

                            {/* Dev / Publisher */}
                            {(developers.length > 0 || publishers.length > 0) ? (
                                <Collapsible title="Dev Info">
                                    {developers.length > 0 && (
                                        <InfoRow label="Developer" value={developers.join(', ')} />
                                    )}
                                    {publishers.length > 0 && (
                                        <InfoRow label="Publisher" value={publishers.join(', ')} />
                                    )}
                                </Collapsible>
                            ) : null}

                            {/* Idiomas */}
                            {supported_languages ? (
                                <Collapsible title="Supported Languages" defaultOpen={false}>
                                    <Text style={s.languagesText}>
                                        {supported_languages.replace(/<[^>]+>/g, '')}
                                    </Text>
                                </Collapsible>
                            ) : null}

                            {/* Comentarios */}
                            <CommentSection steam_app_id={steam_appid} />

                            {/* Links */}
                            <Section title="Links & Dev Resources">
                                {steamUrl && (
                                    <LinkButton label="🔗 Steam Store Page" onPress={() => Linking.openURL(steamUrl)} />
                                )}
                                {metacritic?.url && (
                                    <LinkButton label="📊 Metacritic Page" onPress={() => Linking.openURL(metacritic.url)} />
                                )}
                                {website && (
                                    <LinkButton label="🌐 Official Website" onPress={() => Linking.openURL(website)} />
                                )}
                            </Section>

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

// ─── Estilos locales del modal ────────────────────────────────────────────────

const s = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.bg.overlay,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[10],
    },
    modal: {
        width: '100%',
        maxHeight: height * 0.88,
        backgroundColor: colors.bg.modal,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.border.default,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: radius.full,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontWeight: typography.weight.semibold,
    },
    heroImage: {
        width: '100%',
        height: 180,
    },
    body: {
        padding: spacing[4],
        gap: spacing[1],
    },
    title: {
        color: colors.text.primary,
        fontSize: typography.size['3xl'],
        fontWeight: typography.weight.bold,
        marginBottom: 2,
        maxWidth: 175,
    },
    appId: {
        color: colors.text.dim,
        fontSize: typography.size.sm,
        marginBottom: spacing[3],
        fontFamily: 'monospace',
    },
    description: {
        color: colors.text.muted,
        fontSize: typography.size.md,
        lineHeight: 20,
    },
    statRow: {
        flexDirection: 'row',
        gap: spacing[2],
        flexWrap: 'wrap',
        marginTop: spacing[1],
    },
    languagesText: {
        color: colors.text.muted,
        fontSize: typography.size.base,
        lineHeight: 18,
    },
    devNoteBlock: {
        gap: spacing[3] - 2,
    },

    // Avatar button
    avatarButton: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        paddingHorizontal: spacing[3] - 2,
        paddingVertical: spacing[1],
        backgroundColor: colors.bg.deep,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border.strong,
        alignSelf: 'flex-start',
    },
    avatarButtonPressed: {
        backgroundColor: colors.bg.pressed,
        borderColor: '#3b4a66',
        transform: [{ scale: 0.97 }],
        opacity: 0.8,
    },
    avatarButtonText: {
        color: colors.accent.blue,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
    },

    avatarButtonActive: {
        borderColor: '#27500a',
        backgroundColor: '#0d1a0a',
    },
    avatarButtonActiveText: {
        color: '#639922',
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
    },
});
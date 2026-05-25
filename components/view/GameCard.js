import { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import GameModal from './modals/GameModal';

function getReviewColor(positive, total) {
    if (total === 0) return '#888780';
    const ratio = positive / total;
    if (ratio >= 0.70) return '#639922';
    if (ratio >= 0.40) return '#BA7517';
    return '#A32D2D';
}

function getReviewLabel(positive, total) {
    if (total === 0) return 'Sin reviews';
    const ratio = positive / total;
    if (ratio >= 0.70) return 'Positivas';
    if (ratio >= 0.40) return 'Mixtas';
    return 'Negativas';
}

export default function GameCard({ title, reviewData, image, details }) {
    const [modalVisible, setModalVisible] = useState(false);

    const {
        total_positive = 0,
        total_negative = 0,
        total_reviews = 0,
        review_score_desc: reviewScoreDesc = '',
    } = reviewData || {};

    const color = getReviewColor(total_positive, total_reviews);
    const ratio = total_reviews > 0 ? total_positive / total_reviews : 0;

    return (
        <>
            <Pressable
                style={({ pressed }) => [
                    cardStyles.card,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
                ]}
                onPress={() => setModalVisible(true)}
            >
                {/* Header: imagen de fondo */}
                <View style={cardStyles.imageContainer}>
                    <Image
                        source={image ? { uri: image } : null}
                        style={cardStyles.headerImage}
                        resizeMode="cover"
                    />
                    <View style={cardStyles.overlay} />
                </View>

                <Text style={cardStyles.titleOverlay}>{title}</Text>

                {/* Footer: review bar */}
                <View style={cardStyles.reviewContent}>
                    <View style={cardStyles.reviewHeader}>
                        <Text style={[cardStyles.reviewLabel, { color }]}>
                            {reviewScoreDesc || getReviewLabel(total_positive, total_reviews)}
                        </Text>
                    </View>

                    <View style={cardStyles.barBackground}>
                        <View
                            style={[
                                cardStyles.barFill,
                                { width: `${Math.round(ratio * 100)}%`, backgroundColor: color },
                            ]}
                        />
                    </View>

                    <Text style={cardStyles.reviewCount}>
                        {total_reviews === 0
                            ? 'Sin reviews'
                            : `${total_positive.toLocaleString()} / ${total_reviews.toLocaleString()}`}
                    </Text>
                </View>
            </Pressable>

            <GameModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                details={details}
                title={title}
            />
        </>
    );
}

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#151922',
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#222838',
        overflow: 'hidden',
        padding: 8,
    },
    imageContainer: {
        height: 180,
        position: 'relative',
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    headerImage: {
        borderRadius: 5,
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    titleOverlay: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        marginTop: 8,
    },
    reviewContent: {
        marginTop: 6,
        gap: 4,
    },
    reviewHeader: {
        marginTop: 4,
    },
    reviewLabel: {
        fontSize: 13,
    },
    barBackground: {
        height: 5,
        borderRadius: 4,
        backgroundColor: '#222838',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    reviewCount: {
        fontSize: 11,
        color: '#8b93a7',
    },
});
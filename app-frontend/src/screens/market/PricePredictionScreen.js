import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';

const PricePredictionScreen = ({ route }) => {
    const { cropName = 'Wheat' } = route.params || {};

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                setLoading(true);
                const api = require('../../services/api').default;
                const response = await api.getPredictions(cropName);
                if (response && response.success) {
                    setPrediction(response.prediction);
                }
            } catch (error) {
                console.error("Failed to fetch price predictions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrediction();
    }, [cropName]);

    if (loading || !prediction) {
        return (
            <View style={[commonStyles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Analyzing market trends for {cropName}...</Text>
            </View>
        );
    }

    const priceChange = prediction.predictedPrice - prediction.currentPrice;
    const percentageChange = ((priceChange / prediction.currentPrice) * 100).toFixed(1);

    return (
        <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Price Prediction for {cropName}</Text>

            {/* Current Price Card */}
            <View style={commonStyles.card}>
                <Text style={styles.cardLabel}>Current Market Price</Text>
                <Text style={styles.currentPrice}>₹{prediction.currentPrice}</Text>
                <Text style={styles.priceUnit}>per quintal</Text>
            </View>

            {/* Prediction Card */}
            <View style={[commonStyles.card, styles.predictionCard]}>
                <View style={styles.predictionHeader}>
                    <MaterialIcons
                        name={prediction.trend === 'up' ? 'trending-up' : 'trending-down'}
                        size={32}
                        color={prediction.trend === 'up' ? colors.success : colors.error}
                    />
                    <View style={styles.predictionInfo}>
                        <Text style={styles.cardLabel}>Predicted Price (Next Month)</Text>
                        <Text style={styles.predictedPrice}>₹{prediction.predictedPrice}</Text>
                    </View>
                </View>

                <View style={styles.changeContainer}>
                    <View style={[
                        styles.changeBadge,
                        { backgroundColor: priceChange > 0 ? colors.success + '20' : colors.error + '20' }
                    ]}>
                        <MaterialIcons
                            name={priceChange > 0 ? 'arrow-upward' : 'arrow-downward'}
                            size={16}
                            color={priceChange > 0 ? colors.success : colors.error}
                        />
                        <Text style={[
                            styles.changeText,
                            { color: priceChange > 0 ? colors.success : colors.error }
                        ]}>
                            ₹{Math.abs(priceChange)} ({percentageChange}%)
                        </Text>
                    </View>
                </View>

                <View style={styles.rangeContainer}>
                    <Text style={styles.rangeLabel}>Expected Range</Text>
                    <Text style={styles.rangeText}>
                        ₹{prediction.predictedRange.min} - ₹{prediction.predictedRange.max}
                    </Text>
                </View>
            </View>

            {/* Risk Assessment */}
            <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Risk Assessment</Text>
                <View style={styles.riskContainer}>
                    <View style={[
                        styles.riskBadge,
                        {
                            backgroundColor: prediction.risk === 'low' ? colors.success :
                                prediction.risk === 'medium' ? colors.warning : colors.error
                        }
                    ]}>
                        <Text style={styles.riskText}>
                            {prediction.risk.toUpperCase()} RISK
                        </Text>
                    </View>
                    <Text style={styles.riskDescription}>
                        Market conditions are favorable for this crop
                    </Text>
                </View>
            </View>

            {/* Advice Card */}
            <View style={[commonStyles.card, styles.adviceCard]}>
                <View style={styles.adviceHeader}>
                    <MaterialIcons name="lightbulb" size={24} color={colors.warning} />
                    <Text style={styles.adviceTitle}>Expert Advice</Text>
                </View>
                <Text style={styles.adviceText}>{prediction.advice}</Text>
            </View>

            {/* Factors */}
            <View style={commonStyles.card}>
                <Text style={styles.sectionTitle}>Factors Affecting Price</Text>
                <View style={styles.factorItem}>
                    <MaterialIcons name="check-circle" size={20} color={colors.success} />
                    <Text style={styles.factorText}>High demand in export markets</Text>
                </View>
                <View style={styles.factorItem}>
                    <MaterialIcons name="check-circle" size={20} color={colors.success} />
                    <Text style={styles.factorText}>Lower production this season</Text>
                </View>
                <View style={styles.factorItem}>
                    <MaterialIcons name="warning" size={20} color={colors.warning} />
                    <Text style={styles.factorText}>Monsoon predictions uncertain</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 20,
    },
    cardLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    currentPrice: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    priceUnit: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    predictionCard: {
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
    },
    predictionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    predictionInfo: {
        marginLeft: 16,
        flex: 1,
    },
    predictedPrice: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primary,
    },
    changeContainer: {
        marginBottom: 16,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    rangeContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    rangeLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    rangeText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    riskContainer: {
        alignItems: 'flex-start',
    },
    riskBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 12,
    },
    riskText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.white,
    },
    riskDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    adviceCard: {
        backgroundColor: colors.warning + '10',
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
    },
    adviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    adviceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginLeft: 8,
    },
    adviceText: {
        fontSize: 15,
        color: colors.textPrimary,
        lineHeight: 22,
    },
    factorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    factorText: {
        fontSize: 14,
        color: colors.textPrimary,
        marginLeft: 12,
        flex: 1,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: colors.textSecondary,
        fontSize: 16,
    },
});

export default PricePredictionScreen;

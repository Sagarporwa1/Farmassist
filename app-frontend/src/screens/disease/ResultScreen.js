import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';

const ResultScreen = ({ route, navigation }) => {
    const { caseData } = route.params;

    const treatments = [
        {
            name: 'Copper Oxychloride 50% WP',
            description: 'Spray 2-3 times at 10-day intervals',
            estimatedCost: 450,
        },
        {
            name: 'Mancozeb 75% WP',
            description: 'Apply as preventive measure',
            estimatedCost: 350,
        },
        {
            name: 'Carbendazim 12% + Mancozeb 63% WP',
            description: 'For severe infections',
            estimatedCost: 550,
        },
    ];

    const handleGoHome = () => {
        navigation.navigate('Home');
    };

    return (
        <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
            {/* Image */}
            <Image source={{ uri: caseData.imageUri }} style={styles.image} />

            {/* Diagnosis Result */}
            <View style={[commonStyles.card, styles.resultCard]}>
                <View style={styles.resultHeader}>
                    <MaterialIcons name="warning" size={40} color={colors.warning} />
                    <View style={styles.resultInfo}>
                        <Text style={styles.diseaseLabel}>Detected Disease</Text>
                        <Text style={styles.diseaseName}>{caseData.diseaseName}</Text>
                    </View>
                </View>

                <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceLabel}>Confidence Score</Text>
                    <View style={styles.confidenceBar}>
                        <View
                            style={[
                                styles.confidenceFill,
                                { width: `${caseData.confidence * 100}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.confidenceText}>
                        {(caseData.confidence * 100).toFixed(0)}% Match
                    </Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Crop Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Crop Type:</Text>
                        <Text style={styles.infoValue}>{caseData.cropType}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Land Area:</Text>
                        <Text style={styles.infoValue}>{caseData.landArea} acres</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Soil Type:</Text>
                        <Text style={styles.infoValue}>{caseData.soilType}</Text>
                    </View>
                </View>
            </View>

            {/* Recommended Treatments */}
            <Text style={styles.sectionTitle}>Recommended Treatments</Text>

            {treatments.map((treatment, index) => (
                <View key={index} style={commonStyles.card}>
                    <View style={styles.treatmentHeader}>
                        <Text style={styles.treatmentName}>{treatment.name}</Text>
                        <Text style={styles.treatmentCost}>₹{treatment.estimatedCost}</Text>
                    </View>
                    <Text style={styles.treatmentDescription}>{treatment.description}</Text>
                </View>
            ))}

            {/* Action Buttons */}
            <TouchableOpacity style={commonStyles.buttonOutline}>
                <MaterialIcons name="location-on" size={20} color={colors.primary} />
                <Text style={[commonStyles.buttonOutlineText, styles.buttonWithIcon]}>
                    Find Nearby Shops
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[commonStyles.button, styles.homeButton]}
                onPress={handleGoHome}>
                <Text style={commonStyles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
    },
    resultCard: {
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    resultInfo: {
        marginLeft: 16,
        flex: 1,
    },
    diseaseLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    diseaseName: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    confidenceContainer: {
        marginBottom: 20,
    },
    confidenceLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    confidenceBar: {
        height: 8,
        backgroundColor: colors.gray200,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    confidenceFill: {
        height: '100%',
        backgroundColor: colors.success,
    },
    confidenceText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.success,
    },
    infoSection: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 8,
        marginBottom: 12,
    },
    treatmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    treatmentName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        flex: 1,
    },
    treatmentCost: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
    },
    treatmentDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    buttonWithIcon: {
        marginLeft: 8,
    },
    homeButton: {
        marginTop: 12,
        marginBottom: 20,
    },
});

export default ResultScreen;

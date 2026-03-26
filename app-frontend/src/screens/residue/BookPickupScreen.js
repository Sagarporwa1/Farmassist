import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';

const BookPickupScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        cropDetail: '',
        quantity: '',
        date: '',
        location: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!formData.cropDetail || !formData.quantity || !formData.date || !formData.location) {
            Alert.alert('Incomplete Form', 'Please fill all fields');
            return;
        }

        try {
            setSubmitting(true);
            const api = require('../../services/api').default;
            const response = await api.addResiduePickup(formData);
            
            if (response && response.success) {
                Alert.alert(
                    'Success',
                    'Your pickup request has been submitted successfully. Our team will contact you soon.',
                    [
                        {
                            text: 'View Requests',
                            onPress: () => navigation.navigate('ViewRequests'),
                        },
                        { text: 'OK' },
                    ]
                );

                setFormData({ cropDetail: '', quantity: '', date: '', location: '' });
            } else {
                Alert.alert('Error', response?.error || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Submit pickup error:', error);
            Alert.alert('Error', 'Failed to submit request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
            <View style={styles.infoCard}>
                <MaterialIcons name="info" size={24} color={colors.info} />
                <Text style={styles.infoText}>
                    Book eco-friendly pickup service for your crop residue. Help reduce pollution and earn extra income!
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Pickup Details</Text>

            <Text style={commonStyles.inputLabel}>Crop Residue Type *</Text>
            <TextInput
                style={commonStyles.input}
                placeholder="e.g., Wheat stubble, Rice straw"
                value={formData.cropDetail}
                onChangeText={(text) => setFormData({ ...formData, cropDetail: text })}
            />

            <Text style={commonStyles.inputLabel}>Quantity (in tons) *</Text>
            <TextInput
                style={commonStyles.input}
                placeholder="e.g., 5"
                keyboardType="decimal-pad"
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            />

            <Text style={commonStyles.inputLabel}>Preferred Pickup Date *</Text>
            <TextInput
                style={commonStyles.input}
                placeholder="DD/MM/YYYY"
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
            />

            <Text style={commonStyles.inputLabel}>Farm Location *</Text>
            <TextInput
                style={[commonStyles.input, styles.locationInput]}
                placeholder="Enter your farm address"
                multiline
                numberOfLines={3}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
            />

            <TouchableOpacity style={commonStyles.button} onPress={handleSubmit} disabled={submitting}>
                {submitting ? (
                    <ActivityIndicator size="small" color={colors.white} />
                ) : (
                    <Text style={commonStyles.buttonText}>Submit Pickup Request</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={commonStyles.buttonOutline}
                onPress={() => navigation.navigate('ViewRequests')}>
                <Text style={commonStyles.buttonOutlineText}>View My Previous Requests</Text>
            </TouchableOpacity>

            {/* Benefits Section */}
            <View style={styles.benefitsCard}>
                <Text style={styles.benefitsTitle}>Benefits of Residue Pickup</Text>
                <View style={styles.benefitItem}>
                    <MaterialIcons name="check-circle" size={20} color={colors.success} />
                    <Text style={styles.benefitText}>Earn ₹500-800 per ton</Text>
                </View>
                <View style={styles.benefitItem}>
                    <MaterialIcons name="check-circle" size={20} color={colors.success} />
                    <Text style={styles.benefitText}>Reduce air pollution</Text>
                </View>
                <View style={styles.benefitItem}>
                    <MaterialIcons name="check-circle" size={20} color={colors.success} />
                    <Text style={styles.benefitText}>Free pickup service</Text>
                </View>
                <View style={styles.benefitItem}>
                    <MaterialIcons name="check-circle" size={20} color={colors.success} />
                    <Text style={styles.benefitText}>Contribute to clean environment</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: colors.info + '10',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: colors.info,
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: colors.textPrimary,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 16,
    },
    locationInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    benefitsCard: {
        backgroundColor: colors.success + '10',
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
    },
    benefitsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    benefitText: {
        fontSize: 14,
        color: colors.textPrimary,
        marginLeft: 12,
    },
});

export default BookPickupScreen;

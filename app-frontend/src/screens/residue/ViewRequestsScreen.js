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

const ViewRequestsScreen = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const api = require('../../services/api').default;
                const response = await api.getResidueRequests();
                
                if (response && response.success) {
                    const mappedRequests = response.requests.map((r, index) => ({
                        id: r.id || String(index),
                        cropDetail: r.crop_detail || 'Unknown Crop',
                        quantity: r.quantity || '0',
                        date: r.pickup_date || 'N/A',
                        location: r.location || 'Unknown Location',
                        status: r.status || 'Pending',
                    }));
                    setRequests(mappedRequests);
                }
            } catch (error) {
                console.error('Failed to view residue requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const RequestCard = ({ item }) => {
        const isPending = item.status === 'Pending';
        return (
            <View style={commonStyles.card}>
                <View style={styles.requestHeader}>
                    <View style={styles.requestInfo}>
                        <Text style={styles.cropDetail}>{item.cropDetail}</Text>
                        <Text style={styles.quantity}>{item.quantity} tons</Text>
                    </View>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: isPending ? colors.warning + '20' : colors.success + '20' }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: isPending ? colors.warning : colors.success }
                        ]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <MaterialIcons name="calendar-today" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>Pickup Date: {item.date}</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{item.location}</Text>
                </View>

                {isPending && (
                    <View style={styles.pendingNote}>
                        <MaterialIcons name="info" size={16} color={colors.info} />
                        <Text style={styles.pendingText}>
                            Our team will contact you within 24 hours
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const completedCount = requests.filter(r => r.status === 'Completed').length;

    return (
        <View style={commonStyles.container}>
            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
                <View style={[styles.summaryCard, { backgroundColor: colors.warning + '20' }]}>
                    <Text style={styles.summaryNumber}>{pendingCount}</Text>
                    <Text style={styles.summaryLabel}>Pending</Text>
                </View>
                <View style={[styles.summaryCard, { backgroundColor: colors.success + '20' }]}>
                    <Text style={styles.summaryNumber}>{completedCount}</Text>
                    <Text style={styles.summaryLabel}>Completed</Text>
                </View>
            </View>

            {/* Requests List */}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>All Requests</Text>
                
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Fetching your requests...</Text>
                    </View>
                ) : (
                    <>
                        {requests.map((item) => (
                            <RequestCard key={item.id} item={item} />
                        ))}
                        {requests.length === 0 && (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>No pickup requests found.</Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    summaryContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    summaryCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    summaryNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    content: {
        padding: 16,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    requestInfo: {
        flex: 1,
    },
    cropDetail: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    quantity: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
        flex: 1,
    },
    pendingNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.info + '10',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
    },
    pendingText: {
        fontSize: 12,
        color: colors.info,
        marginLeft: 8,
        flex: 1,
    },
    loadingContainer: {
        paddingVertical: 50,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: colors.textSecondary,
        fontSize: 16,
    },
});

export default ViewRequestsScreen;

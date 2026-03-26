import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';

const MarketScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('prices');

    const [mandiPrices, setMandiPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                setLoading(true);
                // We use the api module we created earlier
                const api = require('../../services/api').default;
                const response = await api.getMandiPrices();
                if (response && response.records) {
                    // Map backend schema to what the UI expects
                    const formattedPrices = response.records.map((item, index) => ({
                        id: item.id || String(index),
                        mandiName: item.market || 'Unknown Mandi',
                        location: item.state || item.district || 'Unknown Location',
                        cropName: item.commodity || 'Unknown Crop',
                        price: item.modal_price || 0,
                        unit: item.unit || 'quintal', // or default to quintal
                        isBestPrice: item.isBestPrice || false,
                    }));
                    setMandiPrices(formattedPrices);
                }
            } catch (error) {
                console.error('Failed to load mandi prices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, []);

    const filteredPrices = mandiPrices.filter(item =>
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mandiName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const PriceCard = ({ item }) => (
        <View style={commonStyles.card}>
            <View style={styles.priceHeader}>
                <View style={styles.priceInfo}>
                    <Text style={styles.cropName}>{item.cropName}</Text>
                    <View style={styles.locationRow}>
                        <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
                        <Text style={styles.locationText}>{item.mandiName}, {item.location}</Text>
                    </View>
                </View>
                {item.isBestPrice && (
                    <View style={styles.bestPriceBadge}>
                        <Text style={styles.bestPriceText}>Best Price</Text>
                    </View>
                )}
            </View>
            <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>₹{item.price}</Text>
                <Text style={styles.priceUnit}>per {item.unit}</Text>
            </View>
        </View>
    );

    return (
        <View style={commonStyles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color={colors.gray500} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search crops or mandis..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'prices' && styles.activeTab]}
                    onPress={() => setActiveTab('prices')}>
                    <Text style={[styles.tabText, activeTab === 'prices' && styles.activeTabText]}>
                        Prices
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'prediction' && styles.activeTab]}
                    onPress={() => {
                        setActiveTab('prediction');
                        navigation.navigate('PricePrediction', { cropName: 'Wheat' });
                    }}>
                    <Text style={[styles.tabText, activeTab === 'prediction' && styles.activeTabText]}>
                        Prediction
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'stocks' && styles.activeTab]}
                    onPress={() => {
                        setActiveTab('stocks');
                        navigation.navigate('MyStocks');
                    }}>
                    <Text style={[styles.tabText, activeTab === 'stocks' && styles.activeTabText]}>
                        My Stocks
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Prices List */}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>
                    {searchQuery ? 'Search Results' : 'Today\'s Mandi Prices'}
                </Text>
                
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Fetching live prices...</Text>
                    </View>
                ) : (
                    <>
                        {filteredPrices.map((item) => (
                            <PriceCard key={item.id} item={item} />
                        ))}
                        {filteredPrices.length === 0 && (
                            <View style={styles.emptyState}>
                                <MaterialIcons name="search-off" size={60} color={colors.gray400} />
                                <Text style={styles.emptyText}>No results found</Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        margin: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: colors.textPrimary,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activeTabText: {
        color: colors.white,
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
    priceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    priceInfo: {
        flex: 1,
    },
    cropName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    bestPriceBadge: {
        backgroundColor: colors.success,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    bestPriceText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.white,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceAmount: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primary,
        marginRight: 8,
    },
    priceUnit: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        color: colors.textSecondary,
        fontSize: 16,
    },
});

export default MarketScreen;

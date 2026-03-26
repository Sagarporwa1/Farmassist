import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';

const MyStocksScreen = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newStock, setNewStock] = useState({
        cropName: '',
        quantity: '',
        purchasePrice: '',
    });
    const [addingStock, setAddingStock] = useState(false);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const api = require('../../services/api').default;
            const response = await api.getStocks();
            if (response && response.success) {
                const mappedStocks = response.stocks.map((item, index) => ({
                    id: item.id || String(index),
                    cropName: item.crop_name,
                    quantity: item.quantity,
                    unit: item.unit || 'quintal',
                    purchasePrice: item.purchase_price,
                    purchaseDate: item.purchase_date || item.created_at.split('T')[0],
                }));
                setStocks(mappedStocks);
            }
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalValue = stocks.reduce((sum, stock) => sum + (stock.quantity * stock.purchasePrice), 0);

    const handleAddStock = async () => {
        if (!newStock.cropName || !newStock.quantity || !newStock.purchasePrice) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            setAddingStock(true);
            const api = require('../../services/api').default;
            const payload = {
                crop_name: newStock.cropName,
                quantity: parseFloat(newStock.quantity),
                unit: 'quintal',
                purchase_price: parseFloat(newStock.purchasePrice),
            };
            const response = await api.addStock(payload);
            
            if (response && response.success) {
                const stock = response.stock;
                setStocks([{
                    id: stock.id,
                    cropName: stock.crop_name,
                    quantity: stock.quantity,
                    unit: stock.unit,
                    purchasePrice: stock.purchase_price,
                    purchaseDate: stock.purchase_date || stock.created_at.split('T')[0],
                }, ...stocks]);
                
                setNewStock({ cropName: '', quantity: '', purchasePrice: '' });
                setModalVisible(false);
                Alert.alert('Success', 'Stock added successfully');
            } else {
                Alert.alert('Error', response?.error || 'Failed to add stock');
            }
        } catch (error) {
            console.error('Failed to add stock:', error);
            Alert.alert('Error', 'An error occurred while adding stock');
        } finally {
            setAddingStock(false);
        }
    };

    const StockCard = ({ item }) => {
        const value = item.quantity * item.purchasePrice;
        return (
            <View style={commonStyles.card}>
                <View style={styles.stockHeader}>
                    <Text style={styles.cropName}>{item.cropName}</Text>
                    <Text style={styles.stockValue}>₹{value.toLocaleString()}</Text>
                </View>
                <View style={styles.stockDetails}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Quantity</Text>
                        <Text style={styles.detailValue}>{item.quantity} {item.unit}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Purchase Price</Text>
                        <Text style={styles.detailValue}>₹{item.purchasePrice}/{item.unit}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Purchase Date</Text>
                        <Text style={styles.detailValue}>{item.purchaseDate}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={commonStyles.container}>
            {/* Summary Card */}
            <View style={[commonStyles.card, styles.summaryCard]}>
                <Text style={styles.summaryLabel}>Total Inventory Value</Text>
                <Text style={styles.summaryValue}>₹{totalValue.toLocaleString()}</Text>
                <Text style={styles.summarySubtext}>{stocks.length} items in stock</Text>
            </View>

            {/* Add Stock Button */}
            <TouchableOpacity
                style={[commonStyles.button, styles.addButton]}
                onPress={() => setModalVisible(true)}>
                <MaterialIcons name="add" size={20} color={colors.white} />
                <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>Add New Stock</Text>
            </TouchableOpacity>

            {/* Stocks List */}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>My Stocks</Text>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Fetching inventory...</Text>
                    </View>
                ) : (
                    <>
                        {stocks.map((item) => (
                            <StockCard key={item.id} item={item} />
                        ))}
                        {stocks.length === 0 && (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>Your inventory is empty.</Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Add Stock Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Stock</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={commonStyles.inputLabel}>Crop Name</Text>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="e.g., Wheat"
                            value={newStock.cropName}
                            onChangeText={(text) => setNewStock({ ...newStock, cropName: text })}
                        />

                        <Text style={commonStyles.inputLabel}>Quantity (quintal)</Text>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="e.g., 50"
                            keyboardType="decimal-pad"
                            value={newStock.quantity}
                            onChangeText={(text) => setNewStock({ ...newStock, quantity: text })}
                        />

                        <Text style={commonStyles.inputLabel}>Purchase Price (per quintal)</Text>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="e.g., 2100"
                            keyboardType="decimal-pad"
                            value={newStock.purchasePrice}
                            onChangeText={(text) => setNewStock({ ...newStock, purchasePrice: text })}
                        />

                        <TouchableOpacity style={commonStyles.button} onPress={handleAddStock} disabled={addingStock}>
                            {addingStock ? (
                                <ActivityIndicator size="small" color={colors.white} />
                            ) : (
                                <Text style={commonStyles.buttonText}>Add Stock</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    summaryCard: {
        margin: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        color: colors.white,
        opacity: 0.9,
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 4,
    },
    summarySubtext: {
        fontSize: 14,
        color: colors.white,
        opacity: 0.8,
    },
    addButton: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
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
    stockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cropName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    stockValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.primary,
    },
    stockDetails: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
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

export default MyStocksScreen;

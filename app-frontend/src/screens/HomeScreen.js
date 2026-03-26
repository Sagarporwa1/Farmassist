import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const HomeScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('Farmer');
    const [currentDate, setCurrentDate] = useState('');
    const [farmingTip, setFarmingTip] = useState('');

    useEffect(() => {
        loadUserData();
        updateDateTime();
        updateFarmingTip();
    }, []);

    const loadUserData = async () => {
        const name = await AsyncStorage.getItem('userName');
        if (name) setUserName(name);
    };

    const updateDateTime = () => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(date.toLocaleDateString('en-IN', options));
    };

    const updateFarmingTip = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 10) {
            setFarmingTip('🌅 Good morning! Best time to irrigate your crops');
        } else if (hour >= 10 && hour < 16) {
            setFarmingTip('☀️ Afternoon! Check for pest activity in your fields');
        } else if (hour >= 16 && hour < 19) {
            setFarmingTip('🌇 Evening! Good time to apply fertilizers');
        } else {
            setFarmingTip('🌙 Night! Plan tomorrow\'s farming activities');
        }
    };

    const DashboardCard = ({ icon, title, subtitle, color, onPress }) => (
        <TouchableOpacity style={styles.dashboardCard} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <MaterialIcons name={icon} size={32} color={color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.gray400} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={commonStyles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Namaste, {userName} 🙏</Text>
                    <Text style={styles.date}>{currentDate}</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile')}>
                    <MaterialIcons name="account-circle" size={40} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Weather Widget */}
                <View style={[commonStyles.card, styles.weatherCard]}>
                    <View style={styles.weatherHeader}>
                        <View>
                            <Text style={styles.temperature}>28°C</Text>
                            <Text style={styles.location}>📍 Your Location</Text>
                        </View>
                        <Text style={styles.weatherIcon}>⛅</Text>
                    </View>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>{farmingTip}</Text>
                    </View>
                </View>

                {/* Dashboard Cards */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <DashboardCard
                    icon="local-hospital"
                    title="Crop Health Monitor"
                    subtitle="Detect diseases using AI"
                    color={colors.error}
                    onPress={() => navigation.navigate('Disease')}
                />

                <DashboardCard
                    icon="store"
                    title="Market Prices"
                    subtitle="Live mandi rates & predictions"
                    color={colors.accent}
                    onPress={() => navigation.navigate('Market')}
                />

                <DashboardCard
                    icon="eco"
                    title="Residue Management"
                    subtitle="Book eco-friendly pickup"
                    color={colors.success}
                    onPress={() => navigation.navigate('Residue')}
                />

                {/* Stats Card */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>Your Farm Stats</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>5</Text>
                            <Text style={styles.statLabel}>Diagnoses</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Market Checks</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>3</Text>
                            <Text style={styles.statLabel}>Pickups</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    greeting: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    date: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    profileButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 16,
    },
    weatherCard: {
        backgroundColor: colors.primary,
    },
    weatherHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    temperature: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.white,
    },
    location: {
        fontSize: 14,
        color: colors.white,
        opacity: 0.9,
        marginTop: 4,
    },
    weatherIcon: {
        fontSize: 60,
    },
    tipContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
    },
    tipText: {
        fontSize: 14,
        color: colors.white,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 8,
        marginBottom: 12,
    },
    dashboardCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.border,
    },
});

export default HomeScreen;

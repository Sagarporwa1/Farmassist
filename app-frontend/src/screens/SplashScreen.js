import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Onboarding');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>🌾</Text>
                <Text style={styles.appName}>Kisan</Text>
                <Text style={styles.tagline}>Your Farming Companion</Text>
            </View>
            <Text style={styles.footer}>Empowering Farmers</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        fontSize: 80,
        marginBottom: 20,
    },
    appName: {
        fontSize: 48,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: colors.white,
        opacity: 0.9,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        fontSize: 14,
        color: colors.white,
        opacity: 0.8,
    },
});

export default SplashScreen;

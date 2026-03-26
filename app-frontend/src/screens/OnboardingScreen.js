import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: 1,
        icon: '🌾',
        title: 'Welcome to Kisan',
        description: 'Your complete farming companion for better crop management and higher yields',
    },
    {
        id: 2,
        icon: '🔬',
        title: 'Disease Detection',
        description: 'Detect crop diseases instantly using AI-powered image analysis',
    },
    {
        id: 3,
        icon: '📊',
        title: 'Market Insights',
        description: 'Get real-time mandi prices and price predictions for better selling decisions',
    },
    {
        id: 4,
        icon: '♻️',
        title: 'Residue Management',
        description: 'Eco-friendly crop residue pickup and management services',
    },
];

const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef(null);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            scrollViewRef.current?.scrollTo({
                x: width * (currentIndex + 1),
                animated: true,
            });
        } else {
            handleGetStarted();
        }
    };

    const handleGetStarted = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        navigation.replace('Login');
    };

    return (
        <View style={commonStyles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                {slides.map((slide) => (
                    <View key={slide.id} style={styles.slide}>
                        <Text style={styles.icon}>{slide.icon}</Text>
                        <Text style={styles.title}>{slide.title}</Text>
                        <Text style={styles.description}>{slide.description}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity style={commonStyles.button} onPress={handleNext}>
                    <Text style={commonStyles.buttonText}>
                        {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>

                {currentIndex < slides.length - 1 && (
                    <TouchableOpacity onPress={handleGetStarted}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        width,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    icon: {
        fontSize: 100,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.gray300,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: colors.primary,
        width: 24,
    },
    skipText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: 16,
        fontSize: 16,
    },
});

export default OnboardingScreen;

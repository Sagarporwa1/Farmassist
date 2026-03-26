import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [initialRoute, setInitialRoute] = useState('Splash');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

            if (isLoggedIn === 'true') {
                setInitialRoute('MainApp');
            } else if (hasSeenOnboarding === 'true') {
                setInitialRoute('Login');
            } else {
                setInitialRoute('Splash');
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setIsReady(true);
        }
    };

    if (!isReady) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainApp" component={TabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

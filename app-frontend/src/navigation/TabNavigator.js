import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

import HomeScreen from '../screens/HomeScreen';
import DiseaseNavigator from './DiseaseNavigator';
import MarketNavigator from './MarketNavigator';
import ResidueNavigator from './ResidueNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.gray500,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
                    paddingTop: 5,
                    height: 60 + (insets.bottom > 0 ? insets.bottom : 0),
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Disease"
                component={DiseaseNavigator}
                options={{
                    tabBarLabel: 'Crop Health',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="local-hospital" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Market"
                component={MarketNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="store" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Residue"
                component={ResidueNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="eco" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;

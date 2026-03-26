import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../styles/colors';

import MarketScreen from '../screens/market/MarketScreen';
import PricePredictionScreen from '../screens/market/PricePredictionScreen';
import MyStocksScreen from '../screens/market/MyStocksScreen';

const Stack = createStackNavigator();

const MarketNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}>
            <Stack.Screen
                name="MarketList"
                component={MarketScreen}
                options={{ title: 'Market Prices' }}
            />
            <Stack.Screen
                name="PricePrediction"
                component={PricePredictionScreen}
                options={{ title: 'Price Prediction' }}
            />
            <Stack.Screen
                name="MyStocks"
                component={MyStocksScreen}
                options={{ title: 'My Stocks' }}
            />
        </Stack.Navigator>
    );
};

export default MarketNavigator;

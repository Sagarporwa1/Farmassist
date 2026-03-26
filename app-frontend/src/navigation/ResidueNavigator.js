import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../styles/colors';

import BookPickupScreen from '../screens/residue/BookPickupScreen';
import ViewRequestsScreen from '../screens/residue/ViewRequestsScreen';

const Stack = createStackNavigator();

const ResidueNavigator = () => {
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
                name="BookPickup"
                component={BookPickupScreen}
                options={{ title: 'Book Residue Pickup' }}
            />
            <Stack.Screen
                name="ViewRequests"
                component={ViewRequestsScreen}
                options={{ title: 'My Requests' }}
            />
        </Stack.Navigator>
    );
};

export default ResidueNavigator;

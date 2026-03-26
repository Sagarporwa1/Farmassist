import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../styles/colors';

import CaptureScreen from '../screens/disease/CaptureScreen';
import FormScreen from '../screens/disease/FormScreen';
import ResultScreen from '../screens/disease/ResultScreen';

const Stack = createStackNavigator();

const DiseaseNavigator = () => {
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
                name="Capture"
                component={CaptureScreen}
                options={{ title: 'Disease Detection' }}
            />
            <Stack.Screen
                name="Form"
                component={FormScreen}
                options={{ title: 'Crop Details' }}
            />
            <Stack.Screen
                name="Result"
                component={ResultScreen}
                options={{ title: 'Diagnosis Result' }}
            />
        </Stack.Navigator>
    );
};

export default DiseaseNavigator;

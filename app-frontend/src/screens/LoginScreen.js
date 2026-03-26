import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = () => {
        if (phoneNumber.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setOtpSent(true);
            setLoading(false);
            Alert.alert('Success', `OTP sent to ${phoneNumber}`);
        }, 1000);
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setTimeout(async () => {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('phoneNumber', phoneNumber);
            setLoading(false);
            navigation.replace('MainApp');
        }, 1000);
    };

    return (
        <KeyboardAvoidingView
            style={commonStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.logo}>🌾</Text>
                    <Text style={commonStyles.heading1}>Welcome to Kisan</Text>
                    <Text style={styles.subtitle}>
                        Login to access your farming dashboard
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={commonStyles.inputLabel}>Phone Number</Text>
                    <TextInput
                        style={commonStyles.input}
                        placeholder="Enter 10-digit phone number"
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        editable={!otpSent}
                    />

                    {!otpSent ? (
                        <TouchableOpacity
                            style={commonStyles.button}
                            onPress={handleSendOTP}
                            disabled={loading}>
                            <Text style={commonStyles.buttonText}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <Text style={commonStyles.inputLabel}>Enter OTP</Text>
                            <TextInput
                                style={commonStyles.input}
                                placeholder="Enter 6-digit OTP"
                                keyboardType="number-pad"
                                maxLength={6}
                                value={otp}
                                onChangeText={setOtp}
                            />

                            <TouchableOpacity
                                style={commonStyles.button}
                                onPress={handleVerifyOTP}
                                disabled={loading}>
                                <Text style={commonStyles.buttonText}>
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setOtpSent(false);
                                    setOtp('');
                                }}>
                                <Text style={styles.resendText}>Resend OTP</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <Text style={styles.footerText}>
                    By continuing, you agree to our Terms & Privacy Policy
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        fontSize: 60,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 30,
    },
    resendText: {
        textAlign: 'center',
        color: colors.primary,
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: 20,
    },
});

export default LoginScreen;

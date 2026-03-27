import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';
import { addCase, initDatabase } from '../../services/db';
import { predictDiseaseFromImage } from '../../services/diseaseInference';

const FormScreen = ({ route, navigation }) => {
    const { imageUri, prediction: initialPrediction } = route.params;
    const [cropType, setCropType] = useState('');
    const [landArea, setLandArea] = useState('');
    const [soilType, setSoilType] = useState('');
    const [seedVariety, setSeedVariety] = useState('');
    const [irrigationType, setIrrigationType] = useState('');
    const [isPredicting, setIsPredicting] = useState(false);

    const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Potato', 'Tomato'];
    const soilTypes = ['Alluvial', 'Black', 'Red', 'Laterite', 'Desert', 'Mountain'];
    const irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'Rainfed'];

    const handleSubmit = async () => {
        if (!cropType || !landArea || !soilType || !seedVariety || !irrigationType) {
            Alert.alert('Incomplete Form', 'Please fill all fields');
            return;
        }

        setIsPredicting(true);

        try {
            const detectedDisease = initialPrediction || (await predictDiseaseFromImage(imageUri));

            const caseData = {
                imageUri,
                cropType,
                landArea,
                soilType,
                seedVariety,
                irrigationType,
                timestamp: new Date().toISOString(),
                rawDiseaseLabel: detectedDisease.rawLabel,
                diseaseName: detectedDisease.diseaseName,
                confidence: detectedDisease.confidence,
            };

            initDatabase();
            addCase(caseData);
            navigation.navigate('Result', { caseData });
        } catch (error) {
            console.error('Error saving case:', error);
            Alert.alert(
                'Inference Failed',
                'Could not run model on this image. Please verify model file setup and try again.'
            );
        } finally {
            setIsPredicting(false);
        }
    };

    const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
        <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>{label}</Text>
            <TextInput
                style={commonStyles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>
    );

    const PickerField = ({ label, value, onValueChange, items }) => (
        <View style={styles.inputGroup}>
            <Text style={commonStyles.inputLabel}>{label}</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={value}
                    onValueChange={onValueChange}
                    style={styles.picker}>
                    <Picker.Item label="Select..." value="" />
                    {items.map((item) => (
                        <Picker.Item key={item} label={item} value={item} />
                    ))}
                </Picker>
            </View>
        </View>
    );

    return (
        <ScrollView style={commonStyles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Crop Information</Text>
            <Text style={styles.subtitle}>
                Provide details about your crop for accurate diagnosis
            </Text>

            <PickerField
                label="Crop Type *"
                value={cropType}
                onValueChange={setCropType}
                items={cropTypes}
            />

            <InputField
                label="Land Area (in acres) *"
                value={landArea}
                onChangeText={setLandArea}
                placeholder="e.g., 2.5"
                keyboardType="decimal-pad"
            />

            <PickerField
                label="Soil Type *"
                value={soilType}
                onValueChange={setSoilType}
                items={soilTypes}
            />

            <InputField
                label="Seed Variety *"
                value={seedVariety}
                onChangeText={setSeedVariety}
                placeholder="e.g., HD-2967"
            />

            <PickerField
                label="Irrigation Type *"
                value={irrigationType}
                onValueChange={setIrrigationType}
                items={irrigationTypes}
            />

            <TouchableOpacity
                style={[commonStyles.button, isPredicting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isPredicting}>
                <Text style={commonStyles.buttonText}>
                    {isPredicting ? 'Running On-Device Model...' : 'Submit for Diagnosis'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 24,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    pickerContainer: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: 16,
    },
    picker: {
        height: 50,
    },
    disabledButton: {
        opacity: 0.7,
    },
});

export default FormScreen;

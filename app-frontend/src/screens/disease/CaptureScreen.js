import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { commonStyles } from '../../styles/commonStyles';
import { predictDiseaseFromImage } from '../../services/diseaseInference';

const CaptureScreen = ({ navigation }) => {
    const [imageUri, setImageUri] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const runInference = async (uri) => {
        setIsAnalyzing(true);
        try {
            const result = await predictDiseaseFromImage(uri);
            setPrediction(result);
        } catch (error) {
            console.error('Error running inference:', error);
            setPrediction(null);
            Alert.alert(
                'Inference Failed',
                'Model could not run on this image. Please verify model setup and try another image.'
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    const requestCameraPermission = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

        if (cameraStatus !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera permission');
            return false;
        }

        return true;
    };

    const requestMediaPermission = async () => {
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (mediaStatus !== 'granted') {
            Alert.alert('Permission Required', 'Please grant media library permission');
            return false;
        }

        return true;
    };

    const handleCamera = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setImageUri(uri);
                runInference(uri);
            }
        } catch (error) {
            console.error('Error opening camera:', error);
            Alert.alert('Camera Error', 'Unable to open camera. Please try again.');
        }
    };

    const handleGallery = async () => {
        const hasPermission = await requestMediaPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setImageUri(uri);
                runInference(uri);
            }
        } catch (error) {
            console.error('Error opening gallery:', error);
            Alert.alert('Gallery Error', 'Unable to open gallery. Please try again.');
        }
    };

    const handleNext = () => {
        if (!imageUri) {
            Alert.alert('No Image', 'Please capture or select an image first');
            return;
        }

        if (isAnalyzing) {
            Alert.alert('Please Wait', 'Image analysis is in progress.');
            return;
        }

        if (!prediction) {
            Alert.alert('No Prediction', 'Please select another image and try again.');
            return;
        }

        navigation.navigate('Form', { imageUri, prediction });
    };

    return (
        <View style={commonStyles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Capture Crop Image</Text>
                <Text style={styles.subtitle}>
                    Take a clear photo of the affected crop area for accurate diagnosis
                </Text>

                {imageUri ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => {
                                setImageUri(null);
                                setPrediction(null);
                            }}>
                            <MaterialIcons name="close" size={24} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        <MaterialIcons name="image" size={80} color={colors.gray400} />
                        <Text style={styles.placeholderText}>No image selected</Text>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[commonStyles.button, styles.actionButton]}
                        onPress={handleCamera}>
                        <MaterialIcons name="camera-alt" size={24} color={colors.white} />
                        <Text style={[commonStyles.buttonText, styles.buttonLabel]}>
                            Take Photo
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[commonStyles.buttonOutline, styles.actionButton]}
                        onPress={handleGallery}>
                        <MaterialIcons name="photo-library" size={24} color={colors.primary} />
                        <Text style={[commonStyles.buttonOutlineText, styles.buttonLabel]}>
                            Choose from Gallery
                        </Text>
                    </TouchableOpacity>
                </View>

                {imageUri && (
                    <View style={styles.analysisContainer}>
                        <Text style={styles.analysisLabel}>
                            {isAnalyzing
                                ? 'Running on-device model...'
                                : prediction
                                  ? `Prediction: ${prediction.diseaseName} (${(
                                        prediction.confidence * 100
                                    ).toFixed(0)}%)`
                                  : 'No prediction generated'}
                        </Text>
                    </View>
                )}

                {imageUri && (
                    <TouchableOpacity
                        style={[
                            commonStyles.button,
                            styles.nextButton,
                            (isAnalyzing || !prediction) && styles.nextButtonDisabled,
                        ]}
                        onPress={handleNext}>
                        <Text style={commonStyles.buttonText}>
                            {isAnalyzing
                                ? 'Analyzing Image...'
                                : 'Next: Enter Crop Details'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
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
    imageContainer: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: colors.error,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.gray300,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    placeholderText: {
        fontSize: 16,
        color: colors.gray500,
        marginTop: 12,
    },
    buttonContainer: {
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        gap: 8,
    },
    buttonLabel: {
        marginLeft: 8,
    },
    nextButton: {
        marginTop: 24,
    },
    nextButtonDisabled: {
        opacity: 0.7,
    },
    analysisContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
    },
    analysisLabel: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '500',
    },
});

export default CaptureScreen;

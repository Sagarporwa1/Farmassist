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

const CaptureScreen = ({ navigation }) => {
    const [imageUri, setImageUri] = useState(null);

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera and media library permissions');
            return false;
        }
        return true;
    };

    const handleCamera = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleNext = () => {
        if (!imageUri) {
            Alert.alert('No Image', 'Please capture or select an image first');
            return;
        }
        navigation.navigate('Form', { imageUri });
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
                            onPress={() => setImageUri(null)}>
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
                    <TouchableOpacity
                        style={[commonStyles.button, styles.nextButton]}
                        onPress={handleNext}>
                        <Text style={commonStyles.buttonText}>Next: Enter Crop Details</Text>
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
});

export default CaptureScreen;

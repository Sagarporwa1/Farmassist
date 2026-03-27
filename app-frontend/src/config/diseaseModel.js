export const DISEASE_MODEL_CONFIG = {
    modelAssetModule: require('../../assets/models/model.tflite'),
    classLabels: require('../../assets/models/labels.json'),
    inputSize: 224,
    normalization: {
        mean: 0,
        std: 255,
    },
    fallbackLabels: [
        'Healthy',
        'Potato___Early_blight',
        'Tomato___Late_blight',
        'Tomato___Early_blight',
        'Potato___Late_blight',
    ],
};

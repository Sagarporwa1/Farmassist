import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { toByteArray } from 'base64-js';
import jpeg from 'jpeg-js';
import { loadTensorflowModel } from 'react-native-fast-tflite';
import { DISEASE_MODEL_CONFIG } from '../config/diseaseModel';

let loadedModel = null;

const loadModel = async () => {
    if (loadedModel) {
        return loadedModel;
    }

    loadedModel = await loadTensorflowModel(DISEASE_MODEL_CONFIG.modelAssetModule);

    return loadedModel;
};

const parseLabels = (parsedJson) => {
    if (Array.isArray(parsedJson)) {
        return parsedJson;
    }

    if (Array.isArray(parsedJson?.labels)) {
        return parsedJson.labels;
    }

    if (parsedJson && typeof parsedJson === 'object') {
        return Object.keys(parsedJson)
            .sort((left, right) => Number(left) - Number(right))
            .map((key) => parsedJson[key]);
    }

    return [];
};

const loadLabels = async () => parseLabels(DISEASE_MODEL_CONFIG.classLabels).filter(Boolean);

export const formatDiseaseLabel = (label) => {
    if (!label) {
        return 'Unknown Disease';
    }

    return label
        .replace(/___/g, ' - ')
        .replace(/_/g, ' ')
        .trim();
};

const preprocessImage = async (imageUri) => {
    const inputSize = DISEASE_MODEL_CONFIG.inputSize;
    const resized = await manipulateAsync(
        imageUri,
        [{ resize: { width: inputSize, height: inputSize } }],
        { compress: 1, format: SaveFormat.JPEG, base64: true }
    );

    if (!resized.base64) {
        throw new Error('Unable to read image for model input.');
    }

    const jpegBytes = toByteArray(resized.base64);
    const decodedImage = jpeg.decode(jpegBytes, { useTArray: true });

    if (!decodedImage?.data?.length) {
        throw new Error('Failed to decode image before inference.');
    }

    const { data } = decodedImage;
    const { mean, std } = DISEASE_MODEL_CONFIG.normalization;
    const floatInput = new Float32Array(inputSize * inputSize * 3);

    for (let pixelIndex = 0, tensorIndex = 0; pixelIndex < data.length; pixelIndex += 4) {
        floatInput[tensorIndex++] = (data[pixelIndex] - mean) / std;
        floatInput[tensorIndex++] = (data[pixelIndex + 1] - mean) / std;
        floatInput[tensorIndex++] = (data[pixelIndex + 2] - mean) / std;
    }

    return floatInput;
};

const extractScores = (outputTensor) => {
    if (!outputTensor) {
        throw new Error('Model returned empty output.');
    }

    if (Array.isArray(outputTensor)) {
        const firstOutput = outputTensor[0];
        if (ArrayBuffer.isView(firstOutput)) {
            return firstOutput;
        }
    }

    if (ArrayBuffer.isView(outputTensor)) {
        return outputTensor;
    }

    throw new Error('Unexpected model output format.');
};

const getTopClass = (scores, labels) => {
    const hasLogits = Array.from(scores).some((score) => score < 0 || score > 1);
    const normalizedScores = hasLogits
        ? (() => {
              let maxScore = Number.NEGATIVE_INFINITY;
              for (let index = 0; index < scores.length; index += 1) {
                  if (scores[index] > maxScore) {
                      maxScore = scores[index];
                  }
              }

              const expScores = new Float32Array(scores.length);
              let expSum = 0;

              for (let index = 0; index < scores.length; index += 1) {
                  const value = Math.exp(scores[index] - maxScore);
                  expScores[index] = value;
                  expSum += value;
              }

              return expScores.map((value) => value / expSum);
          })()
        : scores;

    let topIndex = 0;
    let topScore = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < normalizedScores.length; index += 1) {
        if (normalizedScores[index] > topScore) {
            topScore = normalizedScores[index];
            topIndex = index;
        }
    }

    const rawLabel = labels[topIndex] || `Class_${topIndex}`;

    return {
        rawLabel,
        diseaseName: formatDiseaseLabel(rawLabel),
        confidence: Number.isFinite(topScore) ? topScore : 0,
    };
};

const normalizeConfidence = (confidence) => {
    if (confidence > 1) {
        return Math.min(confidence / 100, 1);
    }
    if (confidence < 0) {
        return 0;
    }
    return confidence;
};

export const predictDiseaseFromImage = async (imageUri) => {
    const model = await loadModel();
    const labels = await loadLabels();
    const inputTensor = await preprocessImage(imageUri);

    let output;
    try {
        output = model.runSync([inputTensor]);
    } catch {
        const uint8Input = Uint8Array.from(inputTensor, (value) => Math.round(value * 255));
        output = model.runSync([uint8Input]);
    }

    const scores = extractScores(output);
    const prediction = getTopClass(scores, labels);

    return {
        rawLabel: prediction.rawLabel,
        diseaseName: prediction.diseaseName,
        confidence: normalizeConfidence(prediction.confidence),
    };
};

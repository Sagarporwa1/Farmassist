const recommendationMap = {
    Potato___healthy: {
        treatment: 'No chemical treatment required. Continue balanced nutrition and field hygiene.',
        urgency: 'Low',
        cost: '₹0-300 per acre',
    },
    Tomato___Late_blight: {
        treatment: 'Apply Metalaxyl + Mancozeb fungicide as per label instructions.',
        urgency: 'Immediate',
        cost: '₹500-1000 per acre',
    },
    Tomato___Early_blight: {
        treatment: 'Spray Chlorothalonil or Mancozeb and remove infected leaves.',
        urgency: 'High',
        cost: '₹400-900 per acre',
    },
    Potato___Early_blight: {
        treatment: 'Use protectant fungicide and avoid overhead irrigation.',
        urgency: 'High',
        cost: '₹450-950 per acre',
    },
    Potato___Late_blight: {
        treatment: 'Start systemic fungicide schedule and monitor spread daily.',
        urgency: 'Immediate',
        cost: '₹600-1200 per acre',
    },
    Tomato_Bacterial_spot: {
        treatment: 'Use copper-based bactericide, avoid overhead irrigation, and remove infected leaves.',
        urgency: 'High',
        cost: '₹450-900 per acre',
    },
    Tomato_Early_blight: {
        treatment: 'Apply protective fungicide and maintain wider plant spacing for airflow.',
        urgency: 'High',
        cost: '₹400-850 per acre',
    },
    Tomato_Late_blight: {
        treatment: 'Start anti-blight fungicide schedule immediately and monitor daily spread.',
        urgency: 'Immediate',
        cost: '₹550-1200 per acre',
    },
    Tomato_Leaf_Mold: {
        treatment: 'Improve ventilation, prune lower leaves, and apply recommended fungicide.',
        urgency: 'Medium',
        cost: '₹350-700 per acre',
    },
    Tomato_healthy: {
        treatment: 'Crop appears healthy. Maintain preventive spray interval and regular scouting.',
        urgency: 'Low',
        cost: '₹0-300 per acre',
    },
};

const normalizeLabelKey = (label = '') =>
    label
        .trim()
        .replace(/\s-\s/g, '___')
        .replace(/\s+/g, '_');

export const getDiseaseRecommendation = (label) => {
    const exact = recommendationMap[label];
    if (exact) {
        return exact;
    }

    const normalized = recommendationMap[normalizeLabelKey(label)];
    if (normalized) {
        return normalized;
    }

    return null;
};

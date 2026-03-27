# Kisan - Farmer Assistance App 🌾

A comprehensive mobile application built with Expo and React Native to assist farmers with crop management, disease detection, market analysis, and residue management.

## Features

### 🔐 Authentication & Onboarding
- Beautiful splash screen with app branding
- Interactive onboarding carousel introducing app features
- Phone number authentication with OTP verification

### 🏠 Home Dashboard
- Personalized greeting and date display
- Weather widget with time-aware farming tips
- Quick action cards for all features
- Farm statistics overview

### 🔬 Disease Detection
- Capture crop images using camera or gallery
- Detailed crop information form
- AI-powered on-device disease diagnosis (TensorFlow Lite)
- Treatment recommendations with estimated costs
- Confidence score visualization

### 📊 Market Analysis
- Real-time mandi prices from nearby markets
- Search functionality for crops and mandis
- Price prediction with trend analysis
- Risk assessment indicators
- Expert advice for selling decisions

### 💼 Stock Management
- Track crop inventory
- Add new stock with purchase details
- View total inventory value
- Manage multiple crop types

### ♻️ Residue Management
- Book eco-friendly residue pickup
- View pickup request history
- Status tracking (Pending/Completed)
- Benefits information

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: JavaScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: React Hooks (useState, useEffect)
- **Local Storage**: AsyncStorage
- **Database**: Expo SQLite
- **Image Picker**: Expo Image Picker
- **Icons**: @expo/vector-icons (MaterialIcons)
- **On-device ML**: TensorFlow Lite (`react-native-fast-tflite`)

## TensorFlow Lite Model Setup

1. Put your trained model file in:
   - `assets/model.tflite`
   - `assets/labels.json`
2. Ensure label index order in `assets/labels.json` matches your model output indices.
3. Optional: customize treatment mapping in `src/config/diseaseRecommendations.js`.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build a native dev app (Expo Go is not supported for TFLite):
   ```bash
   npx expo prebuild --clean
   npx expo run:android
   ```

## Installation

1. **Clone the repository**
   ```bash
   cd e:\epics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Install Expo Go app on your Android/iOS device
   - Scan the QR code from the terminal
   - Or press `a` for Android emulator, `i` for iOS simulator

## Project Structure

```
epics/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.js        # Root stack navigator
│   │   ├── TabNavigator.js        # Bottom tab navigator
│   │   ├── DiseaseNavigator.js    # Disease detection stack
│   │   ├── MarketNavigator.js     # Market analysis stack
│   │   └── ResidueNavigator.js    # Residue management stack
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── OnboardingScreen.js
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── disease/
│   │   │   ├── CaptureScreen.js
│   │   │   ├── FormScreen.js
│   │   │   └── ResultScreen.js
│   │   ├── market/
│   │   │   ├── MarketScreen.js
│   │   │   ├── PricePredictionScreen.js
│   │   │   └── MyStocksScreen.js
│   │   └── residue/
│   │       ├── BookPickupScreen.js
│   │       └── ViewRequestsScreen.js
│   ├── services/
│   │   └── db.js                  # SQLite database service
│   └── styles/
│       ├── colors.js              # Color palette
│       └── commonStyles.js        # Reusable styles
```

## Key Features Implementation

### Database (SQLite)
- Stores disease detection cases locally
- CRUD operations for diagnosis history
- Persistent storage across app sessions

### Navigation Flow
```
Splash → Onboarding → Login → MainApp (Tabs)
                                  ├── Home
                                  ├── Disease (Capture → Form → Result)
                                  ├── Market (Prices/Prediction/Stocks)
                                  └── Residue (BookPickup/ViewRequests)
```

### Mock Data
- Market prices are sample data
- Price predictions are mock forecasts
- Can be replaced with real API integration

## Future Enhancements

- [ ] Connect to live mandi price APIs
- [ ] Add user profile and settings screens
- [ ] Implement real OTP authentication
- [ ] Add multilingual support (Hindi, Punjabi, etc.)
- [ ] Weather API integration
- [ ] Push notifications for price alerts
- [ ] Social features (farmer community)

## Screenshots

The app includes:
- Clean, modern UI with green theme
- Intuitive navigation
- Responsive layouts
- Professional design elements

## Contributing

This is a demonstration project. For production use:
1. Replace mock data with real APIs
2. Implement proper authentication backend
3. Add error handling and validation
4. Implement analytics and crash reporting
5. Add comprehensive testing

## License

MIT License - Feel free to use this project for learning and development.

## Contact

For questions or support, please contact the development team.

---

**Made with ❤️ for Indian Farmers**

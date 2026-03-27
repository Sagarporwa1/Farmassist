# Disease Model Asset

Place your trained TensorFlow Lite model here with this exact filename:

- `assets/model.tflite`
- `assets/labels.json`

The app loads this file for on-device disease prediction.

After adding/changing the model file, rebuild the native app:

```bash
npx expo prebuild --clean
npx expo run:android
```

> Note: TensorFlow Lite native modules do not run in Expo Go. Use a development build (`expo run:android` / `expo run:ios`) or EAS build.

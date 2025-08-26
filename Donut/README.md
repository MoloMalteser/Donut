# 🍩 Donut App

A React Native app that lets users create short text or photo posts and share them offline via Bluetooth with nearby devices. When devices meet, posts automatically sync and "hop" across the local network.

## ✨ Features

- **Create Posts**: Text posts (max 200 chars) or photo posts
- **Local Storage**: SQLite database for on-device post storage
- **Bluetooth Sync**: Offline sharing with nearby devices
- **Hop Count**: Track how many times posts have been shared
- **Spam Prevention**: 2-minute cooldown between posts
- **Content Moderation**: Simulated AI check for inappropriate content
- **24-hour Expiry**: Posts automatically disappear after 24 hours
- **Modern UI**: Beautiful gradients and rounded design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- React Native CLI
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Donut
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install React Native CLI globally**
   ```bash
   npm install -g @react-native/cli
   ```

4. **Install iOS dependencies (macOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

## 📱 Running the App

### Development Mode

1. **Start Metro bundler**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Run on iOS (macOS only)**
   ```bash
   npm run ios
   ```

### Building for Production

#### Android

1. **Build APK**
   ```bash
   npm run build:android
   ```

2. **Build Debug APK**
   ```bash
   npm run build:android-debug
   ```

3. **Clean build artifacts**
   ```bash
   npm run clean
   ```

The APK will be generated at `android/app/build/outputs/apk/release/app-release.apk`

#### iOS

1. **Open Xcode project**
   ```bash
   open ios/Donut.xcworkspace
   ```

2. **Build and archive in Xcode**
   - Select "Any iOS Device" as target
   - Product → Archive
   - Follow the distribution process

## 🏗️ Project Structure

```
Donut/
├── android/                 # Android native code
├── ios/                    # iOS native code
├── src/
│   ├── components/         # Reusable UI components
│   ├── services/          # Business logic services
│   ├── screens/           # App screens
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── App.tsx                # Main app component
├── index.js               # App entry point
├── metro.config.js        # Metro bundler configuration
└── babel.config.js        # Babel configuration
```

## 🔧 Key Components

### Services

- **DatabaseService**: SQLite database operations
- **PostService**: Post creation and management
- **BluetoothService**: Bluetooth sync functionality

### Components

- **Post**: Individual post display
- **PostCreation**: Post creation interface
- **BluetoothSync**: Bluetooth device discovery and sync
- **FeedScreen**: Main feed display

## 📊 Data Models

### Post
```typescript
interface Post {
  id: string;
  content: string;
  type: 'text' | 'photo';
  imageUri?: string;
  timestamp: number;
  authorId: string;
  hopCount: number;
  isLocal: boolean;
}
```

### BluetoothDevice
```typescript
interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  isConnected: boolean;
}
```

## 🔒 Permissions

The app requires the following permissions:

- **Bluetooth**: For device discovery and sync
- **Location**: Required for Bluetooth scanning
- **Camera**: For taking photos
- **Storage**: For saving photos and database

## 🚀 Building with Android Studio

### Prerequisites

1. **Install Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK and build tools

2. **Set up environment variables**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### Build Process

1. **Open project in Android Studio**
   ```bash
   open android/
   ```

2. **Sync Gradle files**
   - Click "Sync Now" when prompted
   - Wait for dependencies to download

3. **Build APK**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be generated in `app/build/outputs/apk/release/`

4. **Install on device**
   - Enable "Install from unknown sources" on your device
   - Transfer and install the APK

## 🧪 Testing

### TypeScript Check
```bash
npx tsc --noEmit
```

### Linting
```bash
npx eslint src/ --ext .ts,.tsx
```

## 🔄 CI/CD

The project includes GitHub Actions workflows for:

- **Automated builds** on push/PR
- **Android APK generation** using React Native CLI
- **iOS project packaging** for Xcode builds
- **Release creation** with build artifacts

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm start -- --reset-cache
   ```

2. **Android build failures**
   ```bash
   cd android && ./gradlew clean && cd ..
   npm run clean
   ```

3. **iOS build issues**
   ```bash
   cd ios && pod deintegrate && pod install && cd ..
   ```

### Debug Mode

- Enable debug mode in React Native
- Use React Native Debugger for enhanced debugging
- Check Metro bundler console for errors

## 📱 Platform Support

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 12.0+
- **React Native**: 0.79.6+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Native community
- Expo team (for initial inspiration)
- Contributors and testers

---

**Built with ❤️ using React Native**

# 🍩 Donut - Offline Social Sharing App

Donut is a React Native mobile app that enables users to create and share short text or photo posts offline via Bluetooth with nearby devices. When devices meet, posts automatically sync and "hop" across the local network.

## ✨ Features

### Core Features
- **Create Posts**: Text posts (max 200 chars) or photo posts
- **Local Storage**: All posts stored locally on device using SQLite
- **Bluetooth Sync**: Automatic post exchange when devices meet
- **Hop Tracking**: Posts increment hop count with each transfer
- **Spam Prevention**: 2-minute cooldown between posts
- **Content Moderation**: Simulated AI content filtering
- **Auto-expiry**: Posts disappear after 24 hours

### Modern UI & Design
- **🍩 Beautiful Rounded Design**: Modern card-based interface with smooth curves
- **🌈 Gradient Accents**: Eye-catching gradients for buttons, badges, and highlights
- **✨ Smooth Animations**: Fluid transitions and micro-interactions
- **📱 Responsive Layout**: Optimized for all screen sizes
- **🎨 Donut Theme**: Consistent branding with donut emojis and colors

### Nice to Have
- 🍩 Donut-themed loading animations
- Hop count display for each post
- Beautiful, modern UI with smooth animations
- Cross-platform (iOS & Android)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

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

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # Android
   npm run android
   
   # iOS (macOS only)
   npm run ios
   
   # Web (for testing)
   npm run web
   ```

## 📱 App Structure

### Screens
- **Feed Screen**: Main feed showing all posts with post creation
- **Sync Screen**: Bluetooth device discovery and synchronization

### Components
- `PostCreation`: Create text or photo posts with modern UI
- `Post`: Display individual posts with gradient borders and metadata
- `BluetoothSync`: Handle device discovery and sync with beautiful animations

### Services
- `PostService`: Post creation, validation, and spam prevention
- `DatabaseService`: Local SQLite storage operations
- `BluetoothService`: Bluetooth device discovery and sync

### Types
- `Post`: Post data structure
- `BluetoothDevice`: Device information
- `SyncResult`: Synchronization results

## 🔧 Configuration

### Bluetooth Permissions
The app requires Bluetooth permissions for device discovery and sync. These are handled automatically by Expo.

### Camera Permissions
Photo posts require camera and photo library permissions, which are requested when needed.

## 🏗️ Building for Production

### Automated Release Workflow

The app includes a complete GitHub Actions workflow that automatically:

1. **Builds both platforms** on every push/PR
2. **Creates releases** with proper versioning
3. **Publishes artifacts**:
   - Android AAB (Play Store)
   - Android APK (Direct install)
   - iOS App (Xcode project)

### Manual Build Commands

```bash
# Using the build script
./scripts/build.sh android      # Build Android APK
./scripts/build.sh android-aab  # Build Android AAB
./scripts/build.sh ios          # Build iOS app
./scripts/build.sh all          # Build all platforms

# Using EAS CLI directly
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Build Profiles

- **Preview**: Internal distribution, APK for Android
- **Production**: Store distribution, AAB for Android, Archive for iOS

## 🧪 Testing

### Manual Testing
1. Create posts using the Feed screen
2. Test spam prevention (2-minute timer)
3. Use Bluetooth Sync to discover devices
4. Test post synchronization between devices

### Simulated Bluetooth
The current implementation simulates Bluetooth functionality for development purposes. Replace the simulation methods in `BluetoothService.ts` with actual Bluetooth APIs for production.

## 🔒 Security & Privacy

- All posts are stored locally on device
- No data is sent to external servers
- Bluetooth sync only occurs when devices are in proximity
- Content moderation is performed locally

## 🚧 Development Notes

### Current Implementation
- Uses simulated Bluetooth for development
- SQLite for local storage
- React Navigation for screen management
- Expo managed workflow
- Modern UI with gradients and rounded design

### Future Enhancements
- Real Bluetooth LE implementation
- Enhanced content moderation
- Post categories and filtering
- User profiles and customization
- Offline-first architecture improvements

## 📚 Documentation

- **[Release Workflow Guide](RELEASE_WORKFLOW.md)**: Complete guide to automated releases
- **[EAS Configuration](eas.json)**: Build profiles and settings
- **[GitHub Actions](.github/workflows/build.yml)**: Automated CI/CD pipeline

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Note**: This is an MVP implementation with modern UI design. The Bluetooth functionality is currently simulated for development purposes. Replace the simulation methods with actual Bluetooth APIs before deploying to production.

## 🎨 UI Design Features

### Modern Components
- **Gradient Borders**: Beautiful gradient borders around post cards
- **Rounded Corners**: Consistent 20-24px border radius throughout
- **Shadow System**: Layered shadows for depth and hierarchy
- **Color Palette**: Carefully chosen colors with proper contrast
- **Typography**: Modern font weights and sizing system

### Interactive Elements
- **Touch Feedback**: Smooth activeOpacity animations
- **Loading States**: Beautiful loading animations with donut emojis
- **Status Indicators**: Color-coded status badges and icons
- **Responsive Buttons**: Adaptive button sizes and states
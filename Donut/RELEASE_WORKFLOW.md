# 🚀 Release Workflow Guide

This document explains how to use the automated release workflow for the Donut app.

## 📋 Overview

The Donut app uses GitHub Actions to automatically build and release:
- **Android AAB** (App Bundle) for Google Play Store
- **Android APK** for direct installation
- **iOS App** as Xcode project files

## 🔄 Automated Workflow

### Triggering Releases

The workflow automatically runs on:
- **Push to main/develop branches**: Builds and tests the app
- **Pull Requests**: Runs tests and security checks
- **Release creation**: Automatically creates GitHub releases with assets
- **Manual trigger**: Use "workflow_dispatch" to manually trigger builds

### Workflow Jobs

1. **Build Android** (`build-android`)
   - Builds AAB (production) and APK (preview)
   - Runs on Ubuntu latest
   - Uses EAS Build service

2. **Build iOS** (`build-ios`)
   - Builds iOS archive
   - Runs on macOS latest
   - Uses EAS Build service

3. **Create Release** (`create-release`)
   - Creates GitHub release with version tag
   - Uploads all build artifacts
   - Generates release notes

4. **Test & Security** (`test`, `security`)
   - Runs TypeScript checks
   - Performs security audits
   - Runs on every push/PR

## 🛠️ Manual Build Commands

### Using the Build Script

```bash
# Navigate to project directory
cd Donut

# Make script executable (first time only)
chmod +x scripts/build.sh

# Build Android APK
./scripts/build.sh android

# Build Android AAB
./scripts/build.sh android-aab

# Build iOS app (macOS only)
./scripts/build.sh ios

# Build for all platforms
./scripts/build.sh all

# Start development server
./scripts/build.sh dev

# Show help
./scripts/build.sh help
```

### Using EAS CLI Directly

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build Android APK
eas build --platform android --profile preview --local

# Build Android AAB
eas build --platform android --profile production --local

# Build iOS
eas build --platform ios --profile production --local
```

## 📱 Build Profiles

### Preview Profile
- **Distribution**: Internal
- **Android**: APK file
- **iOS**: Archive
- **Use case**: Testing and internal distribution

### Production Profile
- **Distribution**: Store
- **Android**: AAB (App Bundle)
- **iOS**: Archive
- **Use case**: App store submission

## 🚀 Release Process

### Automatic Release Creation

1. **Trigger**: Create a new release in GitHub or manually trigger workflow
2. **Build**: All platforms are built automatically
3. **Release**: GitHub release is created with:
   - Version tag (v{run_number})
   - Release notes
   - All build artifacts attached

### Manual Release Creation

1. **Build the app**:
   ```bash
   ./scripts/build.sh all
   ```

2. **Create GitHub release**:
   - Go to GitHub repository
   - Click "Releases" → "Create a new release"
   - Tag: `v1.0.0` (or your version)
   - Title: `Donut App v1.0.0`
   - Description: Add release notes
   - Upload build artifacts manually

## 📦 Build Artifacts

### Android
- **AAB**: `donut-app-v{version}.aab` (Play Store)
- **APK**: `donut-app-v{version}.apk` (Direct install)

### iOS
- **Archive**: `donut-ios-v{version}.zip` (Xcode project)

## 🔧 Configuration

### Required Secrets

Set these in your GitHub repository settings:

1. **EXPO_TOKEN**: Your Expo access token
   ```bash
   # Get token from Expo CLI
   eas login
   # Copy token from ~/.expo/state.json
   ```

2. **GITHUB_TOKEN**: Automatically provided by GitHub Actions

### EAS Configuration

The `eas.json` file contains build profiles. Update these values for production:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./path-to-your-service-account.json",
        "track": "production"
      }
    }
  }
}
```

## 🧪 Testing Before Release

1. **Development testing**:
   ```bash
   ./scripts/build.sh dev
   npm run android  # Test on Android
   npm run ios      # Test on iOS (macOS)
   npm run web      # Test on web
   ```

2. **Build testing**:
   ```bash
   # Test Android build
   ./scripts/build.sh android
   
   # Test iOS build (macOS)
   ./scripts/build.sh ios
   ```

3. **Clean builds**:
   ```bash
   ./scripts/build.sh clean
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**:
   - Check Expo token is valid
   - Verify all dependencies are installed
   - Check EAS configuration

2. **iOS build fails**:
   - Ensure running on macOS
   - Check Xcode installation
   - Verify Apple Developer account

3. **Android build fails**:
   - Check Android SDK installation
   - Verify Java version compatibility
   - Check EAS build logs

### Getting Help

- Check GitHub Actions logs for detailed error messages
- Review EAS build logs in Expo dashboard
- Ensure all required secrets are configured
- Verify build profiles in `eas.json`

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Native Documentation](https://reactnative.dev/)

---

**Note**: This workflow automatically handles the entire release process. For production releases, ensure all tests pass and manually review the generated release notes before publishing.
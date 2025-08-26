#!/bin/bash

# Donut App Build Script
# This script helps build the app for different platforms

set -e

echo "🍩 Building Donut App..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the Donut project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Function to build for Android
build_android() {
    local build_type=${1:-apk}
    
    if [ "$build_type" = "aab" ]; then
        echo "🤖 Building Android AAB (App Bundle)..."
        eas build --platform android --profile production --local
    else
        echo "🤖 Building Android APK..."
        eas build --platform android --profile preview --local
    fi
}

# Function to build for iOS
build_ios() {
    echo "🍎 Building iOS App..."
    
    # Check if we're on macOS
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo "❌ Error: iOS builds require macOS"
        exit 1
    fi
    
    # Check if EAS CLI is installed
    if ! command -v eas &> /dev/null; then
        echo "📱 Installing EAS CLI..."
        npm install -g eas-cli
    fi
    
    # Build iOS app
    eas build --platform ios --profile production --local
}

# Function to build both platforms
build_all() {
    echo "🚀 Building for all platforms..."
    
    # Build Android AAB
    build_android aab
    
    # Build Android APK
    build_android apk
    
    # Build iOS
    build_ios
    
    echo "✅ All builds completed!"
}

# Function to start development server
start_dev() {
    echo "🚀 Starting development server..."
    npm start
}

# Function to run on Android
run_android() {
    echo "🤖 Running on Android..."
    npm run android
}

# Function to run on iOS
run_ios() {
    echo "🍎 Running on iOS..."
    npm run ios
}

# Function to run on web
run_web() {
    echo "🌐 Running on web..."
    npm run web
}

# Function to clean builds
clean_builds() {
    echo "🧹 Cleaning build artifacts..."
    rm -rf .expo
    rm -rf android
    rm -rf ios
    echo "✅ Build artifacts cleaned!"
}

# Function to show help
show_help() {
    echo "🍩 Donut App Build Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  android     Build Android APK (default)"
    echo "  android-aab Build Android AAB (App Bundle)"
    echo "  ios         Build iOS app (macOS only)"
    echo "  all         Build for all platforms"
    echo "  dev         Start development server"
    echo "  run-android Run on Android device/simulator"
    echo "  run-ios     Run on iOS device/simulator (macOS only)"
    echo "  run-web     Run on web browser"
    echo "  clean       Clean build artifacts"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 android     # Build Android APK"
    echo "  $0 android-aab # Build Android AAB"
    echo "  $0 ios         # Build iOS app"
    echo "  $0 all         # Build for all platforms"
    echo "  $0 dev         # Start development server"
    echo ""
    echo "Build Profiles:"
    echo "  - Preview:   Internal distribution, APK for Android"
    echo "  - Production: Store distribution, AAB for Android, Archive for iOS"
}

# Main script logic
case "${1:-help}" in
    "android")
        build_android apk
        ;;
    "android-aab")
        build_android aab
        ;;
    "ios")
        build_ios
        ;;
    "all")
        build_all
        ;;
    "dev")
        start_dev
        ;;
    "run-android")
        run_android
        ;;
    "run-ios")
        run_ios
        ;;
    "run-web")
        run_web
        ;;
    "clean")
        clean_builds
        ;;
    "help"|*)
        show_help
        ;;
esac

echo "✅ Done!"
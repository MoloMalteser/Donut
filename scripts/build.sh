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
    echo "🤖 Building Android APK..."
    
    # Check if EAS CLI is installed
    if ! command -v eas &> /dev/null; then
        echo "📱 Installing EAS CLI..."
        npm install -g eas-cli
    fi
    
    # Build Android APK
    eas build --platform android --profile preview --local
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
    eas build --platform ios --profile preview --local
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

# Function to show help
show_help() {
    echo "🍩 Donut App Build Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  android     Build Android APK"
    echo "  ios         Build iOS app (macOS only)"
    echo "  dev         Start development server"
    echo "  run-android Run on Android device/simulator"
    echo "  run-ios     Run on iOS device/simulator (macOS only)"
    echo "  run-web     Run on web browser"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 android     # Build Android APK"
    echo "  $0 ios         # Build iOS app"
    echo "  $0 dev         # Start development server"
}

# Main script logic
case "${1:-help}" in
    "android")
        build_android
        ;;
    "ios")
        build_ios
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
    "help"|*)
        show_help
        ;;
esac

echo "✅ Done!"
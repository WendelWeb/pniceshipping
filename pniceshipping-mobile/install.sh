#!/bin/bash

# 🚀 Installation Script - Mobile Shipment Feature
# This script installs the required dependencies for the new Add Shipment feature

echo "📦 Installing Mobile Shipment Feature Dependencies..."
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the pniceshipping-mobile directory."
    exit 1
fi

echo "✅ Found package.json"
echo ""

# Install the missing dependency
echo "📥 Installing @react-navigation/native-stack..."
npm install @react-navigation/native-stack@^7.4.3

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation successful!"
    echo ""
    echo "🎉 Next steps:"
    echo "   1. Make sure EXPO_PUBLIC_DATABASE_URL is set in your .env file"
    echo "   2. Run 'npm start' to launch the app"
    echo "   3. Test the new Add Shipment feature in the 'Mes Colis' tab"
    echo ""
    echo "📚 For more information, see:"
    echo "   - INSTALLATION.md (Quick start guide)"
    echo "   - MOBILE_SHIPMENT_FEATURE.md (Complete documentation)"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi

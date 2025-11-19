#!/bin/bash

# Linux Dependencies Installation Script for WhatsApp Automation
# This script installs all required system libraries for Puppeteer/Chromium on Linux

echo "🔧 Installing Linux dependencies for WhatsApp Automation..."
echo ""

# Detect Linux distribution
if [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    echo "📦 Detected Debian/Ubuntu system"
    echo "Installing dependencies..."
    
    sudo apt-get update
    sudo apt-get install -y \
        ca-certificates \
        fonts-liberation \
        libappindicator3-1 \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgbm1 \
        libgcc1 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libstdc++6 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
        lsb-release \
        wget \
        xdg-utils

elif [ -f /etc/redhat-release ]; then
    # RedHat/CentOS/Fedora
    echo "📦 Detected RedHat/CentOS/Fedora system"
    echo "Installing dependencies..."
    
    if command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf install -y \
            alsa-lib \
            atk \
            cups-libs \
            gtk3 \
            ipa-gothic-fonts \
            libXcomposite \
            libXcursor \
            libXdamage \
            libXext \
            libXi \
            libXrandr \
            libXScrnSaver \
            libXtst \
            pango \
            xorg-x11-fonts-100dpi \
            xorg-x11-fonts-75dpi \
            xorg-x11-utils \
            xorg-x11-fonts-cyrillic \
            xorg-x11-fonts-misc \
            xorg-x11-fonts-Type1
    else
        # CentOS/RHEL
        sudo yum install -y \
            alsa-lib \
            atk \
            cups-libs \
            gtk3 \
            ipa-gothic-fonts \
            libXcomposite \
            libXcursor \
            libXdamage \
            libXext \
            libXi \
            libXrandr \
            libXScrnSaver \
            libXtst \
            pango \
            xorg-x11-fonts-100dpi \
            xorg-x11-fonts-75dpi \
            xorg-x11-utils \
            xorg-x11-fonts-cyrillic \
            xorg-x11-fonts-misc \
            xorg-x11-fonts-Type1
    fi
else
    echo "⚠️  Unsupported Linux distribution. Please install dependencies manually."
    echo "Required packages: libatk-1.0, libatk-bridge-2.0, libcups, libdrm, libgtk-3, libgbm, libxkbcommon"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm start"
echo ""


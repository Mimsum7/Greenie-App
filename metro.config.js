const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add ttf to asset extensions to support Google Fonts
config.resolver.assetExts.push('ttf');

module.exports = config;
# SillyTavern-TypefaceR Extension

This is a SillyTavern extension for customizing fonts in chat messages.

## Project Structure

- `manifest.json` - Extension metadata and configuration
- `index.js` - Main extension JavaScript logic
- `style.css` - Extension styling
- `settings.html` - Settings panel UI template

## Features

- Font family selection for chat messages
- Support for local/system fonts
- Google Fonts import functionality
- Font size, weight, line-height customization
- Separate settings for user and character messages
- Font preview functionality
- Settings persistence

## Development

This is a SillyTavern extension. To install:
1. Copy or clone to `SillyTavern/data/<user>/extensions/third-party/`
2. Restart SillyTavern
3. Enable the extension in Extensions menu

## Extension API

Uses SillyTavern's extension API including:
- `getContext()` for accessing SillyTavern context
- `saveSettingsDebounced()` for saving settings
- Event subscriptions for chat updates

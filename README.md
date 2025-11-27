# TypefaceR - Font Customizer for SillyTavern

<p align="center">
  <img src="https://img.shields.io/badge/SillyTavern-Extension-blue" alt="SillyTavern Extension">
  <img src="https://img.shields.io/badge/Version-1.0.0-green" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
</p>

A SillyTavern extension that allows you to customize fonts for chat messages, including support for local system fonts and Google Fonts.

## ✨ Features

### 🎨 Font Customization
- **Font Family Selection** - Use any local/system font or import Google Fonts
- **Font Weight** - Range from 100 (Thin) to 900 (Black)

### 🔤 Google Fonts Integration
- Import any font from [Google Fonts](https://fonts.google.com)
- Automatically loads all font weights (100-900)
- Easy add/remove management
- Fonts persist across sessions

### 👤 Separate User & Character Settings
- **Global Settings** - Apply to all messages
- **User Message Override** - Custom styling for your messages
- **Character Message Override** - Custom styling for AI/character responses

### 👁️ Live Preview
- Real-time preview of your font settings
- See changes instantly before applying

### 💾 Settings Management
- **Export** - Copy settings to clipboard as JSON
- **Import** - Paste settings from clipboard
- **Reset** - Restore all defaults with one click

## 📦 Installation

### Method 1: SillyTavern Extension Installer (Recommended)
1. Open SillyTavern
2. Go to **Extensions** → **Install Extension**
3. Enter the repository URL: `https://github.com/b4bysw0rld/SillyTavern-TypefaceR`
4. Click **Save**
5. Restart SillyTavern

### Method 2: Manual Installation
1. Navigate to your SillyTavern installation directory
2. Go to: `data/<user-handle>/extensions/third-party/`
3. Clone or download this repository:
   ```bash
   git clone https://github.com/b4bysw0rld/SillyTavern-TypefaceR
   ```
4. Restart SillyTavern

### Method 3: Install for All Users
1. Navigate to: `SillyTavern/public/scripts/extensions/third-party/`
2. Clone or copy the extension folder there
3. Restart SillyTavern

## 🚀 Usage

### Basic Setup
1. Open the **Extensions** panel in SillyTavern (puzzle piece icon)
2. Find **TypefaceR - Font Customizer** in the list
3. Click to expand the settings

### Global Font Settings
1. Go to the **Global** tab
2. Enter a font name (e.g., `Arial`, `Georgia`, `'Comic Sans MS'`)
3. Use the quick select buttons for common fonts
4. Adjust size, weight, line height, and letter spacing as desired

### Using Google Fonts
1. Visit [Google Fonts](https://fonts.google.com) and find a font you like
2. In TypefaceR, go to the **Global** tab
3. In the "Google Fonts" section, enter the exact font name (e.g., `Roboto`, `Open Sans`, `Playfair Display`)
4. Click **Add** to import the font
5. Now use that font name in the Font Family field

### User/Character Overrides
1. Go to the **User Messages** or **Character Messages** tab
2. Check "Use Custom Font for [User/Character] Messages"
3. Configure the font settings for that message type
4. These override the global settings when enabled

## 🎨 Font Examples

### System Fonts (No Import Needed)
- `Arial` - Clean sans-serif
- `Georgia` - Elegant serif
- `'Times New Roman'` - Classic serif
- `Verdana` - Wide sans-serif
- `'Courier New'` - Monospace
- `system-ui` - System default

### Popular Google Fonts
- `Roboto` - Modern, versatile
- `Open Sans` - Friendly, readable
- `Lato` - Warm, stable
- `Montserrat` - Geometric, contemporary
- `Playfair Display` - Elegant, editorial
- `Source Code Pro` - Clean monospace

## ⚙️ Settings Structure

```json
{
  "enabled": true,
  "global": {
    "fontFamily": "Georgia",
    "fontWeight": 400
  },
  "user": {
    "overrideEnabled": false,
    "fontFamily": "",
    "fontWeight": 400
  },
  "character": {
    "overrideEnabled": false,
    "fontFamily": "",
    "fontWeight": 400
  },
  "googleFonts": ["Roboto", "Open Sans"]
}
```

## 🔧 Troubleshooting

### Font Not Applying
- Make sure the extension is enabled (checkbox at the top)
- Verify the font name is correct (use quotes for fonts with spaces)
- For Google Fonts, ensure the font was successfully imported
- Try refreshing the page (F5)

### Google Font Not Loading
- Check that the font name matches exactly as shown on Google Fonts
- Look for errors in the browser console (F12 → Console)
- Some fonts may not support all weights

### Settings Not Saving
- Check browser console for errors
- Try exporting and re-importing your settings
- Ensure SillyTavern has proper write permissions

### Conflicts with Theme
- TypefaceR uses `!important` to override theme fonts
- If issues persist, check theme CSS for conflicting styles

## 📁 Project Structure

```
SillyTavern-TypefaceR/
├── manifest.json     # Extension metadata
├── index.js          # Main extension logic
├── style.css         # Extension styling
├── settings.html     # Settings panel UI
├── README.md         # This file
└── LICENSE           # MIT License
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SillyTavern](https://github.com/SillyTavern/SillyTavern) for the amazing platform
- [Google Fonts](https://fonts.google.com) for free web fonts
- The SillyTavern community for inspiration and support

---

Made with ❤️ by [b4bysw0rld](https://github.com/b4bysw0rld)

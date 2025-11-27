/**
 * TypefaceR - Font Customizer Extension for SillyTavern
 * Allows users to customize fonts for chat messages including local fonts and Google Fonts.
 * 
 * @author b4bysw0rld
 * @version 1.0.0
 */

//#region Imports & Constants

import { saveSettingsDebounced } from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";

const EXTENSION_NAME = "SillyTavern-TypefaceR";
const EXTENSION_FOLDER = `scripts/extensions/third-party/${EXTENSION_NAME}`;

// Default settings structure
const DEFAULT_FONT_SETTINGS = {
    fontFamily: "",
    fontWeight: 400,
};

const DEFAULT_SETTINGS = {
    enabled: true,
    global: { ...DEFAULT_FONT_SETTINGS },
    user: {
        overrideEnabled: false,
        ...DEFAULT_FONT_SETTINGS,
    },
    character: {
        overrideEnabled: false,
        ...DEFAULT_FONT_SETTINGS,
    },
    googleFonts: [],
};

//#endregion

//#region Settings Management

/** @type {typeof DEFAULT_SETTINGS} */
let settings;

/**
 * Initializes extension settings, merging saved settings with defaults.
 */
function initializeSettings() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = {};
    }
    
    settings = Object.assign({}, structuredClone(DEFAULT_SETTINGS), extension_settings[EXTENSION_NAME]);
    extension_settings[EXTENSION_NAME] = settings;
    
    // Ensure nested objects have all default keys
    settings.global = { ...DEFAULT_FONT_SETTINGS, ...settings.global };
    settings.user = { overrideEnabled: false, ...DEFAULT_FONT_SETTINGS, ...settings.user };
    settings.character = { overrideEnabled: false, ...DEFAULT_FONT_SETTINGS, ...settings.character };
    settings.googleFonts = settings.googleFonts || [];
}

/**
 * Saves settings with debouncing to prevent excessive writes.
 */
function saveSettings() {
    saveSettingsDebounced();
}

//#endregion

//#region Google Fonts Management

/** @type {HTMLStyleElement} */
let googleFontsStyleSheet;

/**
 * Creates and injects the Google Fonts stylesheet into the document.
 */
function initializeGoogleFontsStyleSheet() {
    googleFontsStyleSheet = document.createElement('style');
    googleFontsStyleSheet.id = 'tfr-google-fonts-stylesheet';
    document.head.appendChild(googleFontsStyleSheet);
}

/**
 * Generates and applies Google Fonts import CSS.
 */
function updateGoogleFontsImport() {
    if (!googleFontsStyleSheet) return;
    
    if (settings.googleFonts.length === 0) {
        googleFontsStyleSheet.textContent = '';
        return;
    }
    
    const fontImports = settings.googleFonts.map(font => {
        const encodedFont = encodeURIComponent(font).replace(/%20/g, '+');
        return `@import url('https://fonts.googleapis.com/css2?family=${encodedFont}:wght@100;200;300;400;500;600;700;800;900&display=swap');`;
    }).join('\n');
    
    googleFontsStyleSheet.textContent = fontImports;
}

/**
 * Adds a Google Font to the imported fonts list.
 * @param {string} fontName - The name of the font to import.
 * @returns {boolean} True if the font was added, false if already exists.
 */
function addGoogleFont(fontName) {
    const trimmedName = fontName.trim();
    if (!trimmedName) return false;
    
    // Check for duplicates (case-insensitive)
    const exists = settings.googleFonts.some(
        f => f.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (exists) {
        console.log(`[TypefaceR] Font "${trimmedName}" is already imported.`);
        return false;
    }
    
    settings.googleFonts.push(trimmedName);
    updateGoogleFontsImport();
    saveSettings();
    updateImportedFontsList();
    
    console.log(`[TypefaceR] Imported Google Font: ${trimmedName}`);
    return true;
}

/**
 * Removes a Google Font from the imported fonts list.
 * @param {string} fontName - The name of the font to remove.
 */
function removeGoogleFont(fontName) {
    const index = settings.googleFonts.findIndex(
        f => f.toLowerCase() === fontName.toLowerCase()
    );
    
    if (index !== -1) {
        settings.googleFonts.splice(index, 1);
        updateGoogleFontsImport();
        saveSettings();
        updateImportedFontsList();
        console.log(`[TypefaceR] Removed Google Font: ${fontName}`);
    }
}

/**
 * Updates the UI list of imported Google Fonts.
 */
function updateImportedFontsList() {
    const listContainer = document.getElementById('tfr-imported-fonts-list');
    if (!listContainer) return;
    
    if (settings.googleFonts.length === 0) {
        listContainer.innerHTML = '<div class="tfr-small-desc" style="text-align: center; padding: 8px;">No fonts imported yet</div>';
        return;
    }
    
    listContainer.innerHTML = settings.googleFonts.map(font => `
        <div class="tfr-imported-font-item">
            <span class="tfr-font-name" style="font-family: '${font}', sans-serif;">${font}</span>
            <span class="tfr-remove-font" data-font="${font}" title="Remove font">
                <i class="fa-solid fa-xmark"></i>
            </span>
        </div>
    `).join('');
    
    // Add remove click handlers
    listContainer.querySelectorAll('.tfr-remove-font').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fontName = e.currentTarget.dataset.font;
            removeGoogleFont(fontName);
        });
    });
}

//#endregion

//#region Font Styling

/** @type {HTMLStyleElement} */
let fontStyleSheet;

/**
 * Creates and injects the main font stylesheet into the document.
 */
function initializeFontStyleSheet() {
    fontStyleSheet = document.createElement('style');
    fontStyleSheet.id = 'tfr-font-stylesheet';
    document.head.appendChild(fontStyleSheet);
}

/**
 * Generates CSS string for font settings.
 * @param {object} fontSettings - The font settings object.
 * @returns {string} CSS properties string.
 */
function generateFontCSS(fontSettings) {
    const parts = [];
    
    if (fontSettings.fontFamily) {
        parts.push(`font-family: ${fontSettings.fontFamily}, sans-serif !important`);
    }
    if (fontSettings.fontWeight) {
        parts.push(`font-weight: ${fontSettings.fontWeight} !important`);
    }
    
    return parts.join('; ');
}

/**
 * Updates all font styles based on current settings.
 */
function updateFontStyles() {
    if (!fontStyleSheet) return;
    
    if (!settings.enabled) {
        fontStyleSheet.textContent = '';
        return;
    }
    
    let css = '';
    
    // Global styles (apply to all messages)
    const globalCSS = generateFontCSS(settings.global);
    if (globalCSS) {
        css += `
            #chat .mes .mes_text {
                ${globalCSS};
            }
        `;
    }
    
    // User message overrides
    if (settings.user.overrideEnabled) {
        const userCSS = generateFontCSS(settings.user);
        if (userCSS) {
            css += `
                #chat .mes[is_user="true"] .mes_text {
                    ${userCSS};
                }
            `;
        }
    }
    
    // Character message overrides
    if (settings.character.overrideEnabled) {
        const charCSS = generateFontCSS(settings.character);
        if (charCSS) {
            css += `
                #chat .mes:not([is_user="true"]) .mes_text {
                    ${charCSS};
                }
            `;
        }
    }
    
    fontStyleSheet.textContent = css;
    updatePreview();
}

/**
 * Updates the live preview with current font settings.
 */
function updatePreview() {
    const userPreview = document.getElementById('tfr-preview-user');
    const charPreview = document.getElementById('tfr-preview-char');
    
    if (!userPreview || !charPreview) return;
    
    // Determine which settings to apply to user preview
    const userSettings = settings.user.overrideEnabled ? settings.user : settings.global;
    const userStyle = generateFontCSS(userSettings).replace(/!important/g, '');
    userPreview.style.cssText = userStyle;
    
    // Determine which settings to apply to character preview
    const charSettings = settings.character.overrideEnabled ? settings.character : settings.global;
    const charStyle = generateFontCSS(charSettings).replace(/!important/g, '');
    charPreview.style.cssText = charStyle;
}

//#endregion

//#region UI Initialization

/**
 * Creates a debounced version of a function.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function} Debounced function.
 */
function debounce(fn, delay = 100) {
    let timeoutId = null;
    return function (...args) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

/**
 * Binds a slider input to update its value display and settings.
 * @param {string} inputId - The slider input element ID.
 * @param {string} valueId - The value display element ID.
 * @param {object} settingsObj - The settings object to update.
 * @param {string} key - The settings key to update.
 * @param {string} suffix - The suffix to display (e.g., 'px').
 */
function bindSlider(inputId, valueId, settingsObj, key, suffix = '') {
    const input = document.getElementById(inputId);
    const valueDisplay = document.getElementById(valueId);
    
    if (!input || !valueDisplay) return;
    
    // Set initial value
    input.value = settingsObj[key];
    valueDisplay.textContent = `${settingsObj[key]}${suffix}`;
    
    // Handle changes
    const updateValue = debounce(() => {
        const value = parseFloat(input.value);
        settingsObj[key] = value;
        valueDisplay.textContent = `${value}${suffix}`;
        saveSettings();
        updateFontStyles();
    }, 50);
    
    input.addEventListener('input', updateValue);
}

/**
 * Binds a text input for font family.
 * @param {string} inputId - The input element ID.
 * @param {object} settingsObj - The settings object to update.
 * @param {string} key - The settings key to update.
 */
function bindFontFamilyInput(inputId, settingsObj, key) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // Set initial value
    input.value = settingsObj[key] || '';
    
    // Handle changes with debounce
    const updateValue = debounce(() => {
        settingsObj[key] = input.value.trim();
        saveSettings();
        updateFontStyles();
    }, 300);
    
    input.addEventListener('input', updateValue);
}

/**
 * Binds a checkbox to toggle settings visibility and state.
 * @param {string} checkboxId - The checkbox element ID.
 * @param {string} contentId - The content container element ID.
 * @param {object} settingsObj - The settings object to update.
 * @param {string} key - The settings key to update.
 */
function bindToggle(checkboxId, contentId, settingsObj, key) {
    const checkbox = document.getElementById(checkboxId);
    const content = document.getElementById(contentId);
    
    if (!checkbox) return;
    
    // Set initial state
    checkbox.checked = settingsObj[key];
    if (content) {
        content.style.display = settingsObj[key] ? 'block' : 'none';
    }
    
    // Handle changes
    checkbox.addEventListener('change', () => {
        settingsObj[key] = checkbox.checked;
        if (content) {
            content.style.display = checkbox.checked ? 'block' : 'none';
        }
        saveSettings();
        updateFontStyles();
    });
}

/**
 * Initializes tab switching functionality.
 */
function initializeTabs() {
    const tabs = document.querySelectorAll('.tfr-extension-settings .tfr-tab');
    const tabContents = document.querySelectorAll('.tfr-extension-settings .tfr-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update tab active states
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content visibility
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tfr-tab-${targetTab}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Initializes quick font buttons.
 */
function initializeQuickFontButtons() {
    document.querySelectorAll('.tfr-quick-font-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const font = btn.dataset.font;
            const target = btn.dataset.target;
            
            let inputId;
            let settingsObj;
            
            if (target === 'user') {
                inputId = 'tfr-user-font-family';
                settingsObj = settings.user;
            } else if (target === 'char') {
                inputId = 'tfr-char-font-family';
                settingsObj = settings.character;
            } else {
                inputId = 'tfr-global-font-family';
                settingsObj = settings.global;
            }
            
            const input = document.getElementById(inputId);
            if (input) {
                input.value = font;
                settingsObj.fontFamily = font;
                saveSettings();
                updateFontStyles();
            }
        });
    });
}

/**
 * Initializes Google Fonts import functionality.
 */
function initializeGoogleFontsUI() {
    const input = document.getElementById('tfr-google-font-input');
    const addButton = document.getElementById('tfr-import-google-font');
    
    if (!input || !addButton) return;
    
    const handleImport = () => {
        const fontName = input.value.trim();
        if (fontName) {
            if (addGoogleFont(fontName)) {
                input.value = '';
            } else {
                // Font already exists - brief visual feedback
                input.style.borderColor = '#ff6b6b';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 1000);
            }
        }
    };
    
    addButton.addEventListener('click', handleImport);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleImport();
        }
    });
    
    // Initialize the list
    updateImportedFontsList();
}

/**
 * Initializes action buttons (export, import, reset).
 */
function initializeActionButtons() {
    // Export settings
    document.getElementById('tfr-export-settings')?.addEventListener('click', () => {
        const exportData = JSON.stringify(settings, null, 2);
        navigator.clipboard.writeText(exportData).then(() => {
            console.log('[TypefaceR] Settings exported to clipboard');
            // Brief visual feedback
            const btn = document.getElementById('tfr-export-settings');
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 1500);
            }
        }).catch(err => {
            console.error('[TypefaceR] Failed to export settings:', err);
        });
    });
    
    // Import settings
    document.getElementById('tfr-import-settings')?.addEventListener('click', async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const importedSettings = JSON.parse(clipboardText);
            
            // Validate and merge settings
            Object.assign(settings, importedSettings);
            extension_settings[EXTENSION_NAME] = settings;
            saveSettings();
            
            // Refresh UI
            updateGoogleFontsImport();
            updateImportedFontsList();
            updateFontStyles();
            
            // Reload UI values
            reloadUIFromSettings();
            
            console.log('[TypefaceR] Settings imported successfully');
            
            // Brief visual feedback
            const btn = document.getElementById('tfr-import-settings');
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Imported!';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 1500);
            }
        } catch (err) {
            console.error('[TypefaceR] Failed to import settings:', err);
            alert('Failed to import settings. Make sure you have valid TypefaceR settings copied to your clipboard.');
        }
    });
    
    // Reset settings
    document.getElementById('tfr-reset-settings')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all TypefaceR settings to defaults?')) {
            Object.assign(settings, structuredClone(DEFAULT_SETTINGS));
            extension_settings[EXTENSION_NAME] = settings;
            saveSettings();
            
            // Refresh everything
            updateGoogleFontsImport();
            updateImportedFontsList();
            updateFontStyles();
            reloadUIFromSettings();
            
            console.log('[TypefaceR] Settings reset to defaults');
        }
    });
}

/**
 * Reloads all UI elements from current settings.
 */
function reloadUIFromSettings() {
    // Enabled toggle
    const enabledCheckbox = document.getElementById('tfr-enabled');
    if (enabledCheckbox) enabledCheckbox.checked = settings.enabled;
    
    // Global settings
    document.getElementById('tfr-global-font-family').value = settings.global.fontFamily || '';
    document.getElementById('tfr-global-font-weight').value = settings.global.fontWeight;
    document.getElementById('tfr-global-font-weight-value').textContent = settings.global.fontWeight;
    
    // User settings
    document.getElementById('tfr-user-override-enabled').checked = settings.user.overrideEnabled;
    document.getElementById('tfr-user-settings-content').style.display = settings.user.overrideEnabled ? 'block' : 'none';
    document.getElementById('tfr-user-font-family').value = settings.user.fontFamily || '';
    document.getElementById('tfr-user-font-weight').value = settings.user.fontWeight;
    document.getElementById('tfr-user-font-weight-value').textContent = settings.user.fontWeight;
    
    // Character settings
    document.getElementById('tfr-char-override-enabled').checked = settings.character.overrideEnabled;
    document.getElementById('tfr-char-settings-content').style.display = settings.character.overrideEnabled ? 'block' : 'none';
    document.getElementById('tfr-char-font-family').value = settings.character.fontFamily || '';
    document.getElementById('tfr-char-font-weight').value = settings.character.fontWeight;
    document.getElementById('tfr-char-font-weight-value').textContent = settings.character.fontWeight;
}

/**
 * Initializes all UI bindings.
 */
function initializeUI() {
    // Main enable toggle
    bindToggle('tfr-enabled', null, settings, 'enabled');
    const enabledCheckbox = document.getElementById('tfr-enabled');
    if (enabledCheckbox) {
        enabledCheckbox.addEventListener('change', () => {
            updateFontStyles();
        });
    }
    
    // Global settings
    bindFontFamilyInput('tfr-global-font-family', settings.global, 'fontFamily');
    bindSlider('tfr-global-font-weight', 'tfr-global-font-weight-value', settings.global, 'fontWeight', '');
    
    // User settings
    bindToggle('tfr-user-override-enabled', 'tfr-user-settings-content', settings.user, 'overrideEnabled');
    bindFontFamilyInput('tfr-user-font-family', settings.user, 'fontFamily');
    bindSlider('tfr-user-font-weight', 'tfr-user-font-weight-value', settings.user, 'fontWeight', '');
    
    // Character settings
    bindToggle('tfr-char-override-enabled', 'tfr-char-settings-content', settings.character, 'overrideEnabled');
    bindFontFamilyInput('tfr-char-font-family', settings.character, 'fontFamily');
    bindSlider('tfr-char-font-weight', 'tfr-char-font-weight-value', settings.character, 'fontWeight', '');
    
    // Initialize other UI components
    initializeTabs();
    initializeQuickFontButtons();
    initializeGoogleFontsUI();
    initializeActionButtons();
}

/**
 * Adds a button to the Extensions dropdown menu for quick access.
 */
function addExtensionMenuButton() {
    const extensionsMenu = document.getElementById('extensionsMenu');
    if (!extensionsMenu) {
        console.warn('[TypefaceR] Extensions menu not found');
        return;
    }
    
    // Check if button already exists
    if (document.getElementById('tfr-extensions-menu-button')) {
        return;
    }
    
    // Create button element
    const button = document.createElement('div');
    button.id = 'tfr-extensions-menu-button';
    button.className = 'list-group-item flex-container flexGap5 interactable';
    button.title = 'Open TypefaceR Font Settings';
    button.setAttribute('tabindex', '0');
    button.innerHTML = `
        <i class="fa-solid fa-font"></i>
        <span>TypefaceR</span>
    `;
    
    extensionsMenu.appendChild(button);
    
    // Click handler to scroll to and open settings
    button.addEventListener('click', () => {
        const settingsDrawer = document.getElementById('tfr-extension-settings');
        if (!settingsDrawer) {
            console.warn('[TypefaceR] Settings drawer not found');
            return;
        }
        
        // Scroll to settings
        settingsDrawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Open the drawer if closed
        const drawerToggle = settingsDrawer.querySelector('.inline-drawer-toggle');
        const drawerContent = settingsDrawer.querySelector('.inline-drawer-content');
        const drawerIcon = settingsDrawer.querySelector('.inline-drawer-icon');
        
        if (drawerToggle && drawerContent && !drawerContent.classList.contains('open')) {
            drawerToggle.classList.add('open');
            drawerContent.classList.add('open');
            if (drawerIcon) {
                drawerIcon.classList.remove('down');
                drawerIcon.classList.add('up');
            }
        }
        
        // Brief highlight effect
        settingsDrawer.style.transition = 'background-color 0.3s ease';
        const originalBg = settingsDrawer.style.backgroundColor;
        settingsDrawer.style.backgroundColor = 'rgba(var(--SmartThemeBodyColor), 0.3)';
        setTimeout(() => {
            settingsDrawer.style.backgroundColor = originalBg;
        }, 600);
    });
}

//#endregion

//#region Main Initialization

jQuery(async ($) => {
    console.log('[TypefaceR] Initializing extension...');
    
    // Initialize settings
    initializeSettings();
    
    // Load and append settings HTML
    try {
        const settingsHtml = await $.get(`${EXTENSION_FOLDER}/settings.html`);
        const extensionsSettings = document.getElementById('extensions_settings2');
        if (extensionsSettings) {
            $(extensionsSettings).append(settingsHtml);
        } else {
            console.error('[TypefaceR] Could not find extensions_settings2 element');
            return;
        }
    } catch (err) {
        console.error('[TypefaceR] Failed to load settings HTML:', err);
        return;
    }
    
    // Initialize stylesheets
    initializeGoogleFontsStyleSheet();
    initializeFontStyleSheet();
    
    // Load Google Fonts
    updateGoogleFontsImport();
    
    // Initialize UI
    initializeUI();
    
    // Add extension menu button
    addExtensionMenuButton();
    
    // Apply initial styles
    updateFontStyles();
    
    console.log('[TypefaceR] Extension initialized successfully');
});

//#endregion

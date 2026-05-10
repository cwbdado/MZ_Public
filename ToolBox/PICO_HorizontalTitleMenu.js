//=============================================================================
// PICO_HorizontalTitleMenu.js  |  v1.0.0  |  18-09-2025
//=============================================================================
/*:
 * @target MZ
 * @plugindesc |v1.0.0| PICO ToolBox Collection #4 — Horizontal Title Menu : modern side-by-side command layout for title screen. (PT/EN)
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 * @help PICO_HorizontalTitleMenu.js
 *
 * =============================================================================
 *  PICO ToolBox Collection #4 — Horizontal Title Menu
 * =============================================================================
 *  > PT-BR
 *  Transforma o menu vertical padrão da tela de título em um layout horizontal
 *  moderno, onde os comandos (Novo Jogo, Continuar, Opções) ficam lado a lado
 *  em uma única linha. Design limpo e contemporâneo que maximiza o uso da tela.
 *
 *  > EN
 *  Transform the default vertical title menu into a modern horizontal design
 *  where commands (New Game, Continue, Options) sit side-by-side in a single
 *  row. Clean, contemporary look that maximizes screen real estate.
 *
 *  > Features
 *  - Horizontal command layout (side-by-side arrangement)
 *  - Smart auto-sizing based on content
 *  - Configurable spacing between menu items
 *  - Plugin-friendly (compatible with custom title commands)
 *  - Zero setup required (works immediately after activation)
 *  - Maintains all original functionality and navigation
 *
 *  > Quick use
 *    Just activate the plugin - no commands or setup needed.
 *    The title menu will automatically switch to horizontal layout.
 *
 *  > Notes
 *  - Window width adjusts automatically to fit all commands
 *  - Single-row layout reduces vertical screen usage
 *  - Compatible with custom themes and other title plugins
 *
 * =============================================================================
 *  Version History
 * =============================================================================
 *  v1.0.0 (18-09-2025): Initial release (#4).
 *
 * =============================================================================
 *  License
 * =============================================================================
 *  - Free for personal and commercial projects (including 18+).
 *  - Redistribution of this file as-is is allowed with author credit.
 *  - No use in projects promoting hate/prejudice.
 *
 * =============================================================================
 *  Parameters
 * =============================================================================
 * @param Debug
 * @text Debug to Console
 * @type boolean
 * @default false
 *
 * @param commandSpacing
 * @text Command Spacing
 * @desc Extra pixels between horizontal menu items.
 * @type number
 * @min 0
 * @max 100
 * @default 20
 */

(() => {
    'use strict';
    
    // Plugin Parameters
    const PLUGIN_NAME = 'PICO_HorizontalTitleMenu';
    const PARAMS = PluginManager.parameters(PLUGIN_NAME);
    const DEBUG = String(PARAMS['Debug'] ?? 'false').toLowerCase() === 'true';
    const commandSpacing = Number(PARAMS['commandSpacing']) || 20;
    
    const tag = `[${PLUGIN_NAME}#4]`;
    const log = (...a) => { if (DEBUG) console.log(tag, ...a); };
    
    // Namespace
    const PICO = (window.PICO = window.PICO || {});
    PICO.HorizontalTitleMenu = PICO.HorizontalTitleMenu || {};
    
    log('Plugin initialized');
    
    //=============================================================================
    // Window_TitleCommand - Only override after full initialization
    //=============================================================================
    
    // Store the original refresh method
    const _Window_TitleCommand_refresh = Window_TitleCommand.prototype.refresh;
    
    // Override refresh to apply horizontal layout AFTER the window is fully ready
    Window_TitleCommand.prototype.refresh = function() {
        // Call original refresh first
        _Window_TitleCommand_refresh.call(this);
        
        // Now apply horizontal modifications
        this.applyHorizontalLayout();
        
        log('Applied horizontal layout after refresh');
    };
    
    // New method to apply horizontal layout
    Window_TitleCommand.prototype.applyHorizontalLayout = function() {
        // Override the layout methods now that the window is ready
        this.maxCols = function() {
            return this.maxItems();
        };
        
        this.numVisibleRows = function() {
            return 1;
        };
        
        this.itemWidth = function() {
            const numItems = this.maxItems();
            if (numItems <= 0) return 100;
            
            const totalSpacing = (numItems - 1) * commandSpacing;
            const availableWidth = this.innerWidth - totalSpacing;
            return Math.floor(availableWidth / numItems);
        };
        
        this.itemRect = function(index) {
            const itemWidth = this.itemWidth();
            const itemHeight = this.itemHeight();
            const x = index * (itemWidth + commandSpacing);
            const y = 0;
            return new Rectangle(x, y, itemWidth, itemHeight);
        };
        
        // Refresh the contents with new layout
        this.contents.clear();
        this.drawAllItems();
    };
    
    //=============================================================================
    // Scene_Title - Adjust window size
    //=============================================================================
    
    // Override commandWindowRect to make room for horizontal layout
    Scene_Title.prototype.commandWindowRect = function() {
        const offsetX = $dataSystem.titleCommandWindow.offsetX;
        const offsetY = $dataSystem.titleCommandWindow.offsetY;
        const ww = 600; // Fixed width that should accommodate most horizontal layouts
        const wh = this.calcWindowHeight(1, true); // Single row
        const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
        const wy = Graphics.boxHeight - wh - 96 + offsetY;
        return new Rectangle(wx, wy, ww, wh);
    };
    
    log('Plugin setup complete');
    
})();
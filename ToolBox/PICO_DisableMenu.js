//=============================================================================
// PICO ToolBox #5 — PICO_DisableMenu.js  |  v1.3.0  |  2026-03-30
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v1.3.0| PICO ToolBox Collection #5 — Game-flow controls: disable menu, dash, touch movement, trim title & limit saves.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #5 — PICO_DisableMenu  v1.3.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * A collection of configurable game-flow controls. Each feature can be
 * toggled independently via the Plugin Manager — enable only what you need.
 *
 *   1. DISABLE MAP MENU
 *      Blocks Cancel/Escape from opening the default menu on the map.
 *
 *   2. HIDE TOUCH MENU BUTTON
 *      Hides the floating touch/click menu button on the map screen.
 *
 *   3. DISABLE DASH
 *      The player never runs — Shift key is ignored entirely.
 *
 *   4. TRIM TITLE MENU
 *      Title screen shows only: New Game, Continue, Exit.
 *
 *   5. DISABLE TOUCH MOVEMENT
 *      Clicking/tapping the map no longer moves the player.
 *      Ideal for keyboard/gamepad-only projects.
 *
 *   6. LIMIT SAVE SLOTS
 *      Sets a custom cap on the number of save files (default: 3).
 *
 * PART OF PICO TOOLBOX
 * ============================================================================
 *   #1 — PICO Debug HUD       Real-time variable/switch monitor
 *   #2 — PICO Set Self Switches  Reliable self-switch controller
 *   #3 — PICO Keyboard+       Full-keyboard input bindings
 *   #4 — PICO Horizontal Title Menu  Modern horizontal title layout
 *   #5 — PICO Disable Menu    Game-flow controls (this plugin)
 *
 * CHANGELOG
 * ============================================================================
 * v1.3.0 (2026-03-30)
 *   - Added option to disable touch/click movement on the map.
 * v1.2.0 (2026-03-30)
 *   - All features are now individually togglable via Plugin Manager.
 *   - Save slot count is now a configurable parameter.
 * v1.1.0 (2026-03-28)
 *   - Added dash disable (player never runs).
 *   - Title menu trimmed to New Game + Continue + Exit only.
 * v1.0.0 (2026-03-28)
 *   - Initial release.
 *
 * LICENSE
 * ============================================================================
 * 1) May be used in personal or commercial projects, including adult content.
 * 2) Do not redistribute without the author's explicit permission.
 * 3) Do not use in projects promoting hate or discrimination.
 *
 * ============================================================================
 *
 * @param --- General ---
 * @text ─────────────────────────────
 *
 * @param DebugMode
 * @text Debug Mode
 * @parent --- General ---
 * @type boolean
 * @default false
 * @desc Logs plugin events to the browser console.
 *
 * @param --- Menu ---
 * @text ─────────────────────────────
 *
 * @param DisableMenu
 * @text Disable Map Menu
 * @parent --- Menu ---
 * @type boolean
 * @default true
 * @desc Blocks Cancel/Escape from opening the menu on the map.
 *
 * @param HideMenuButton
 * @text Hide Touch Menu Button
 * @parent --- Menu ---
 * @type boolean
 * @default true
 * @desc Hides the touch/click menu button on the map screen.
 *
 * @param --- Dash ---
 * @text ─────────────────────────────
 *
 * @param DisableDash
 * @text Disable Dash
 * @parent --- Dash ---
 * @type boolean
 * @default true
 * @desc Prevents the player from dashing/running (Shift key ignored).
 *
 * @param --- Title Screen ---
 * @text ─────────────────────────────
 *
 * @param TrimTitleMenu
 * @text Trim Title Menu
 * @parent --- Title Screen ---
 * @type boolean
 * @default true
 * @desc Shows only New Game, Continue and Exit on the title screen.
 *
 * @param --- Touch Movement ---
 * @text ─────────────────────────────
 *
 * @param DisableTouchMove
 * @text Disable Touch Movement
 * @parent --- Touch Movement ---
 * @type boolean
 * @default false
 * @desc Prevents the player from moving by clicking/tapping on the map.
 *
 * @param --- Save Slots ---
 * @text ─────────────────────────────
 *
 * @param LimitSaveSlots
 * @text Limit Save Slots
 * @parent --- Save Slots ---
 * @type boolean
 * @default true
 * @desc Enables the custom save slot limit below.
 *
 * @param SaveSlotCount
 * @text Save Slot Count
 * @parent --- Save Slots ---
 * @type number
 * @min 1
 * @max 100
 * @default 3
 * @desc Number of save slots available. Only applied if "Limit Save Slots" is ON.
 */

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_DisableMenu";
    const _raw        = PluginManager.parameters(PLUGIN_NAME) || {};

    const DEBUG           = String(_raw["DebugMode"]      || "false").toLowerCase() === "true";
    const DISABLE_MENU    = String(_raw["DisableMenu"]    || "true").toLowerCase()  === "true";
    const HIDE_BUTTON     = String(_raw["HideMenuButton"] || "true").toLowerCase()  === "true";
    const DISABLE_DASH    = String(_raw["DisableDash"]    || "true").toLowerCase()  === "true";
    const TRIM_TITLE      = String(_raw["TrimTitleMenu"]  || "true").toLowerCase()  === "true";
    const LIMIT_SAVES     = String(_raw["LimitSaveSlots"] || "true").toLowerCase()  === "true";
    const SAVE_SLOT_COUNT    = Math.max(1, parseInt(_raw["SaveSlotCount"] || "3", 10));
    const DISABLE_TOUCH_MOVE = String(_raw["DisableTouchMove"] || "false").toLowerCase() === "true";

    function clog() {
        if (!DEBUG) return;
        const args = Array.prototype.slice.call(arguments);
        console.log.apply(console, ["[" + PLUGIN_NAME + "#5]"].concat(args));
    }

    // =========================================================================
    //  Disable Cancel/Escape key opening the menu on the map
    // =========================================================================

    if (DISABLE_MENU) {
        Scene_Map.prototype.callMenu = function () {
            clog("callMenu blocked.");
        };

        Scene_Map.prototype.isMenuCalled = function () {
            return false;
        };

        clog("Map menu disabled.");
    }

    // =========================================================================
    //  Hide the touch/click menu button
    // =========================================================================

    if (HIDE_BUTTON) {
        const _Scene_Map_start = Scene_Map.prototype.start;
        Scene_Map.prototype.start = function () {
            _Scene_Map_start.call(this);
            if (this._menuButton) {
                this._menuButton.visible = false;
                this._menuButton.hide();
                clog("Menu button hidden on start.");
            }
        };

        const _Scene_Map_update = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () {
            _Scene_Map_update.call(this);
            if (this._menuButton && this._menuButton.visible) {
                this._menuButton.visible = false;
                this._menuButton.hide();
            }
        };

        clog("Touch menu button hidden.");
    }

    // =========================================================================
    //  Disable dash
    // =========================================================================

    if (DISABLE_DASH) {
        Game_Player.prototype.isDashing = function () {
            return false;
        };

        clog("Dash disabled.");
    }

    // =========================================================================
    //  Trim title menu to New Game + Continue + Exit
    // =========================================================================

    if (TRIM_TITLE) {
        Window_TitleCommand.prototype.makeCommandList = function () {
            this.addCommand(TextManager.newGame,  "newGame");
            this.addCommand(TextManager.continue_, "continue", this.isContinueEnabled());
            this.addCommand(TextManager.gameEnd,   "gameEnd");
        };

        clog("Title menu trimmed to 3 commands.");
    }

    // =========================================================================
    //  Disable touch/click movement on the map
    // =========================================================================
    // Game_Temp.prototype.isDestinationValid controls whether the destination
    // set by a touch/click is considered valid for pathfinding.
    // Returning false prevents any click-to-move behaviour.

    if (DISABLE_TOUCH_MOVE) {
        Game_Temp.prototype.isDestinationValid = function () {
            return false;
        };

        clog("Touch movement disabled.");
    }

    // =========================================================================
    //  Limit save slots
    // =========================================================================

    if (LIMIT_SAVES) {
        DataManager.maxSavefiles = function () {
            return SAVE_SLOT_COUNT;
        };

        clog("Save slots limited to", SAVE_SLOT_COUNT);
    }

    // =========================================================================
    //  Init log
    // =========================================================================

    console.log("[" + PLUGIN_NAME + "#5] v1.3.0 loaded.");

})();

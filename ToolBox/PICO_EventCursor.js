//=============================================================================
// PICO ToolBox #11 — PICO_EventCursor.js  |  v2.1.0  |  2026-05-01
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v2.1.0| PICO ToolBox #11 — Change the mouse cursor when hovering events, via page comment tags.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #11 — PICO_EventCursor  v2.1.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * Changes the mouse cursor when the player's mouse hovers over an event.
 * The cursor is defined per event page using a comment tag, so different
 * pages of the same event can show different cursors depending on game state.
 *
 * Events with no cursor tag use the browser's default cursor.
 *
 * SETUP
 * ============================================================================
 * 1. Install and activate the plugin.
 * 2. Open an event page in the editor.
 * 3. Add a Comment command anywhere on that page with the tag:
 *
 *      <cursor: TYPE>
 *
 *    Where TYPE is either a CSS cursor keyword or a custom image filename.
 * 4. Done — the cursor will change when the mouse is over that event.
 *
 * CSS CURSOR KEYWORDS
 * ============================================================================
 * Any valid CSS cursor value works. Quick reference:
 *
 *   GENERAL
 *     default        — standard OS arrow
 *     pointer        — hand (links / clickable things)
 *     crosshair      — precision crosshair
 *     move           — four-directional move arrows
 *     grab           — open hand (draggable)
 *     grabbing       — closed hand (dragging)
 *     help           — arrow with question mark
 *     wait           — loading spinner
 *     progress       — arrow + spinner
 *     not-allowed    — circle with line (forbidden)
 *     none           — invisible cursor
 *
 *   TEXT / EDITING
 *     text           — I-beam (selectable text)
 *     vertical-text  — horizontal I-beam
 *
 *   ZOOM
 *     zoom-in        — magnifier with +
 *     zoom-out       — magnifier with −
 *
 *   RESIZE (directional)
 *     n-resize  s-resize  e-resize  w-resize
 *     ne-resize nw-resize se-resize sw-resize
 *     ew-resize ns-resize nesw-resize nwse-resize
 *     col-resize row-resize all-scroll
 *
 *   OTHER
 *     cell           — spreadsheet cell selector
 *     copy           — arrow with + (copy action)
 *     alias          — arrow with shortcut badge
 *     no-drop        — cannot drop here
 *     context-menu   — arrow with small menu
 *
 * Examples:
 *   <cursor: pointer>
 *   <cursor: crosshair>
 *   <cursor: grab>
 *   <cursor: not-allowed>
 *
 * CUSTOM IMAGE CURSORS
 * ============================================================================
 * Place image files in the folder set in the plugin parameter (default:
 * img/cursors/). Supported formats: .png, .gif, .cur, .svg
 *
 * Reference by filename (with or without extension):
 *   <cursor: sword>          → loads img/cursors/sword.png
 *   <cursor: sword.png>      → same
 *   <cursor: sword.cur>      → loads img/cursors/sword.cur
 *
 * The hotspot (click point) defaults to the top-left corner (0,0).
 * You can override it with the HotspotX / HotspotY plugin parameters.
 *
 * NOTE: Browsers cap custom cursor images at 128×128 px. 32×32 is recommended.
 *
 * HOW PAGE-AWARENESS WORKS
 * ============================================================================
 * The plugin reads the comment tags from the event's ACTIVE page only.
 * If the event changes page (e.g. after a switch flips), the cursor updates
 * automatically on the next hover. Events with no tag on the current page
 * revert to the default cursor.
 *
 * PLUGIN COMMANDS
 * ============================================================================
 *
 *   SetDefaultCursor
 *     Change the cursor shown when not hovering any event.
 *     Leave type blank to restore the plugin parameter value.
 *
 *   SetCursor
 *     Override the cursor for a specific event at runtime (ignores comment).
 *     eventId = 0 targets the calling event.
 *     Leave type blank to clear the override and fall back to the comment tag.
 *
 *   ClearCursor
 *     Remove a runtime override for a specific event (falls back to comment).
 *
 *   ClearAllCursors
 *     Remove all runtime overrides on the current map.
 *
 * SCRIPT API
 * ============================================================================
 *   PICO.EventCursor.setDefault(type)     // change default cursor at runtime
 *   PICO.EventCursor.set(eventId, type)   // set runtime override for an event
 *   PICO.EventCursor.clear(eventId)       // clear runtime override
 *   PICO.EventCursor.clearAll()           // clear all overrides
 *
 * PART OF PICO TOOLBOX
 * ============================================================================
 *   #1  — PICO Debug HUD              Real-time variable/switch monitor
 *   #2  — PICO Set Self Switches      Reliable self-switch controller
 *   #3  — PICO Keyboard+              Full-keyboard input bindings
 *   #4  — PICO Horizontal Title Menu  Modern horizontal title layout
 *   #5  — PICO Disable Menu           Game-flow controls
 *   #6  — PICO Loot                   Weighted random loot tables
 *   #7  — PICO Gamepad                Full gamepad manager
 *   #8  — PICO InputMapper            Native key remapper + custom symbols
 *   #9  — PICO Text Input             Native keyboard text/number input
 *   #10 — PICO Event Labels           Floating event name labels
 *   #11 — PICO Event Cursor           Per-event mouse cursor changer (this plugin)
 *
 * CHANGELOG
 * ============================================================================
 * v2.1.0 (2026-05-01)
 *   - New: parâmetro DefaultCursor no Plugin Manager.
 *   - New: Plugin Command SetDefaultCursor para trocar o cursor padrão em runtime.
 *   - New: PICO.EventCursor.setDefault(type) no Script API.
 *
 * v2.0.0 (2026-05-01)
 *   - Rewrite completo: usa TouchInput._onMouseMove + document.body.style.cursor.
 *   - Cursor tag cacheada no Game_Event.setupPage (não relida a cada frame).
 *
 * v1.0.0 (2026-05-01)
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
 * @param DefaultCursor
 * @text Default Cursor
 * @parent --- General ---
 * @type string
 * @default 
 * @desc Cursor shown when not hovering any event. CSS keyword or image filename. Leave blank for the OS default.
 *
 * @param DebugMode
 * @text Debug Mode
 * @parent --- General ---
 * @type boolean
 * @default false
 * @desc Logs cursor changes to the browser console.
 *
 * @param ImageFolder
 * @text Image Folder
 * @parent --- General ---
 * @type string
 * @default img/cursors/
 * @desc Folder (relative to project root) where custom cursor images are stored.
 *
 * @param DefaultExtension
 * @text Default Image Extension
 * @parent --- General ---
 * @type string
 * @default .png
 * @desc Extension appended when the comment tag has no extension (e.g. sword → sword.png).
 *
 * @param HotspotX
 * @text Hotspot X
 * @parent --- General ---
 * @type number
 * @min 0
 * @max 128
 * @default 0
 * @desc Horizontal hotspot (click point) for custom image cursors in pixels.
 *
 * @param HotspotY
 * @text Hotspot Y
 * @parent --- General ---
 * @type number
 * @min 0
 * @max 128
 * @default 0
 * @desc Vertical hotspot (click point) for custom image cursors in pixels.
 *
 * @command SetDefaultCursor
 * @text Set Default Cursor
 * @desc Change the cursor shown when not hovering any event.
 *
 * @arg CursorType
 * @text Cursor Type
 * @type string
 * @default 
 * @desc CSS keyword or image filename. Leave blank to restore the plugin parameter value.
 *
 * @command SetCursor
 * @text Set Cursor
 * @desc Override the cursor for a specific event at runtime.
 *
 * @arg EventId
 * @text Event ID
 * @type number
 * @min 0
 * @default 0
 * @desc Event ID to target. 0 = calling event.
 *
 * @arg CursorType
 * @text Cursor Type
 * @type string
 * @default pointer
 * @desc CSS keyword (pointer, crosshair…) or image filename (sword.png). Leave blank to clear.
 *
 * @command ClearCursor
 * @text Clear Cursor
 * @desc Remove the runtime cursor override for a specific event.
 *
 * @arg EventId
 * @text Event ID
 * @type number
 * @min 0
 * @default 0
 * @desc Event ID to clear. 0 = calling event.
 *
 * @command ClearAllCursors
 * @text Clear All Cursors
 * @desc Remove all runtime cursor overrides on the current map.
 */

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_EventCursor";
    const _raw        = PluginManager.parameters(PLUGIN_NAME) || {};

    const DEBUG = String(_raw["DebugMode"] ?? "false").toLowerCase() === "true";

    // =========================================================================
    //  Logging
    // =========================================================================

    const clog = (...a) => { if (DEBUG) console.log(`[${PLUGIN_NAME}#11]`, ...a); };

    // =========================================================================
    //  Config
    // =========================================================================

    const Config = {
        defaultCursor:    String(_raw["DefaultCursor"]    || "").trim(),
        imageFolder:      String(_raw["ImageFolder"]      || "img/cursors/"),
        defaultExtension: String(_raw["DefaultExtension"] || ".png"),
        hotspotX:         parseInt(_raw["HotspotX"])      || 0,
        hotspotY:         parseInt(_raw["HotspotY"])      || 0,
    };

    // Runtime default cursor (can be changed via plugin command)
    let _defaultCursor = Config.defaultCursor;

    // =========================================================================
    //  Known CSS cursor keywords (used to distinguish CSS from image filenames)
    // =========================================================================

    const CSS_KEYWORDS = new Set([
        "auto", "default", "none", "context-menu", "help", "pointer",
        "progress", "wait", "cell", "crosshair", "text", "vertical-text",
        "alias", "copy", "move", "no-drop", "not-allowed", "grab", "grabbing",
        "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize",
        "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize",
        "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize",
        "zoom-in", "zoom-out",
    ]);

    // =========================================================================
    //  Per-event runtime overrides  { eventId: cursorType }
    // =========================================================================

    const _overrides = {};

    // =========================================================================
    //  Cursor application — applied to document.body (same as DK approach)
    //  This avoids all canvas id / inheritance issues entirely.
    // =========================================================================

    const _isCssKeyword = (type) => CSS_KEYWORDS.has(type.toLowerCase());

    const _hasExtension  = (f)    => /\.\w{2,5}$/.test(f);

    const _buildCursorValue = (type) => {
        if (!type) return "";
        const t = type.trim();
        if (_isCssKeyword(t)) return t;
        const filename = _hasExtension(t) ? t : t + Config.defaultExtension;
        const folder   = Config.imageFolder.replace(/\/?$/, "/");
        return `url("${folder}${filename}") ${Config.hotspotX} ${Config.hotspotY}, auto`;
    };

    let _currentCursor = "";

    const _applyCursor = (type) => {
        const value = _buildCursorValue(type);
        if (value === _currentCursor) return;
        _currentCursor = value;
        document.body.style.cursor = value || "default";
        clog(`Cursor → "${value || "default"}"`);
    };

    const _resetCursor = () => {
        const defValue = _defaultCursor ? _buildCursorValue(_defaultCursor) : "";
        if (_currentCursor === defValue) return;
        _currentCursor = defValue;
        document.body.style.cursor = defValue || "";
        clog(`Cursor → default "${defValue || "(os default)"}"`);
    };

    // =========================================================================
    //  Comment tag parser — called once per page change via Game_Event.setupPage
    //  Returns the cursor type string, or null if no tag found.
    // =========================================================================

    const _TAG_RE = /<cursor:\s*(.+?)>/i;

    const _readCursorTag = (gameEvent) => {
        const page = gameEvent.page();
        if (!page) return null;
        for (const cmd of page.list) {
            if (cmd.code === 108 || cmd.code === 408) {
                const m = _TAG_RE.exec(cmd.parameters[0] || "");
                if (m) return m[1].trim();
            }
        }
        return null;
    };

    // =========================================================================
    //  Game_Event — cache cursor on page setup (runs when page changes)
    // =========================================================================

    const _ptb11_Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function () {
        _ptb11_Game_Event_setupPage.call(this);
        // Cache the cursor for the now-active page (null = no tag)
        this._picoCursor = this._erased ? null : _readCursorTag(this);
        clog(`Event ${this.eventId()} page setup → cursor: "${this._picoCursor ?? "(none)"}"`);
    };

    // =========================================================================
    //  Resolve cursor: runtime override takes priority over page tag
    // =========================================================================

    const _resolveCursor = (gameEvent) => {
        const id = gameEvent.eventId();
        if (_overrides[id] !== undefined) return _overrides[id];
        return gameEvent._picoCursor ?? null;
    };

    // =========================================================================
    //  TouchInput._onMouseMove hook
    //  This is the same approach used by DK_Mouse_System.
    //  At this point TouchInput._x/_y are already in canvas coordinates,
    //  and canvasToMapX/Y works correctly.
    // =========================================================================

    const _ptb11_TouchInput_onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove = function (event) {
        _ptb11_TouchInput_onMouseMove.call(this, event);

        const scene = SceneManager._scene;
        if (!(scene instanceof Scene_Map) || !scene.isActive() || $gameMessage.isBusy()) {
            _resetCursor();
            return;
        }

        const mapX  = $gameMap.canvasToMapX(this._x);
        const mapY  = $gameMap.canvasToMapY(this._y);
        const events = $gameMap.eventsXy(mapX, mapY);

        if (events.length === 0) {
            _resetCursor();
            return;
        }

        // Pick the topmost event that has a cursor assigned
        for (let i = events.length - 1; i >= 0; i--) {
            const cursor = _resolveCursor(events[i]);
            if (cursor !== null) {
                _applyCursor(cursor);
                return;
            }
        }

        _resetCursor();
    };

    // =========================================================================
    //  Reset cursor when leaving the map scene
    // =========================================================================

    const _ptb11_Scene_Map_stop = Scene_Map.prototype.stop;
    Scene_Map.prototype.stop = function () {
        _ptb11_Scene_Map_stop.call(this);
        _resetCursor();
    };

    // =========================================================================
    //  Clear runtime overrides on map transfer
    // =========================================================================

    const _ptb11_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _ptb11_Scene_Map_onMapLoaded.call(this);
        for (const k of Object.keys(_overrides)) delete _overrides[k];
        clog("Overrides cleared (new map).");
    };

    // =========================================================================
    //  Internal helper — resolve event id (0 = calling event)
    // =========================================================================

    const _resolveEventId = (rawId, interpreter) => {
        const id = parseInt(rawId) || 0;
        if (id === 0 && interpreter) return interpreter._eventId;
        return id;
    };

    // =========================================================================
    //  Plugin Command — SetDefaultCursor
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "SetDefaultCursor", function (args) {
        const type = String(args["CursorType"] || "").trim();
        _defaultCursor = type || Config.defaultCursor;
        // Apply immediately if not currently hovering an event
        _resetCursor();
        clog(`SetDefaultCursor → "${_defaultCursor || "(os default)"}"`);
    });

    // =========================================================================
    //  Plugin Command — SetCursor
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "SetCursor", function (args) {
        const id   = _resolveEventId(args["EventId"], this);
        const type = String(args["CursorType"] || "").trim();
        if (type) {
            _overrides[id] = type;
            clog(`SetCursor → eventId ${id} → "${type}"`);
        } else {
            delete _overrides[id];
            clog(`SetCursor (clear) → eventId ${id}`);
        }
    });

    // =========================================================================
    //  Plugin Command — ClearCursor
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "ClearCursor", function (args) {
        const id = _resolveEventId(args["EventId"], this);
        delete _overrides[id];
        clog(`ClearCursor → eventId ${id}`);
    });

    // =========================================================================
    //  Plugin Command — ClearAllCursors
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "ClearAllCursors", function () {
        for (const k of Object.keys(_overrides)) delete _overrides[k];
        clog("ClearAllCursors → all overrides removed.");
    });

    // =========================================================================
    //  Public API
    // =========================================================================

    const PICO = (window.PICO = window.PICO || {});
    PICO.EventCursor = {
        setDefault(type) {
            _defaultCursor = type || Config.defaultCursor;
            _resetCursor();
        },
        set(eventId, type) {
            if (type) _overrides[eventId] = type;
            else      delete _overrides[eventId];
        },
        clear(eventId) {
            delete _overrides[eventId];
        },
        clearAll() {
            for (const k of Object.keys(_overrides)) delete _overrides[k];
        },
    };

    // =========================================================================
    //  Init log
    // =========================================================================

    console.log(`[${PLUGIN_NAME}#11] v2.1.0 loaded.`);

})();

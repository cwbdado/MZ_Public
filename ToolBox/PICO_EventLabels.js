//=============================================================================
// PICO ToolBox #12 — PICO_EventLabels.js  |  v1.1.0  |  2026-05-10
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v1.1.0| PICO ToolBox #12 — Floating PIXI labels above events, always-on or proximity-based with smooth fade.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #12 — PICO_EventLabels  v1.1.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * Displays a floating PIXI label above each event that has a name set in the
 * RPG Maker editor. Labels can be always visible or appear only when the
 * player walks within a configurable tile radius, fading in and out smoothly.
 *
 * Events with no name (empty string) are silently ignored.
 *
 * SETUP
 * ============================================================================
 * 1. Install and activate the plugin.
 * 2. Name your events in the editor (double-click event → top name field).
 * 3. Configure display mode, distance, theme, and font in the Plugin Manager.
 * 4. Done — labels appear automatically on the map.
 *
 * VISIBILITY MODES
 * ============================================================================
 *   Always     — label is visible whenever the event is on screen.
 *   Proximity  — label fades in when the player is within ProximityRadius
 *                tiles and fades out when they walk away.
 *
 * THEMES
 * ============================================================================
 *   Dark        — dark background, light text (default)
 *   Light       — light background, dark text
 *   Neon        — dark background, vivid cyan text with glow
 *   Retrospace  — deep purple background, magenta text with glow
 *
 * EVENT NOTE TAGS
 * ============================================================================
 * Add these tags to an event's Note field (double-click event → Note tab).
 * Tags are parsed once at label build time, except conditions which are
 * evaluated every frame in real-time.
 *
 *   <labelNoBg>
 *     Forces the background OFF for this event, even if Show Background is
 *     enabled globally in the Plugin Manager.
 *     Only the text floats above the event — no pill background.
 *
 *   <labelBg>
 *     Forces the background ON for this event, even if Show Background is
 *     disabled globally in the Plugin Manager.
 *     Useful when most labels are text-only but a few need the bg pill.
 *
 *   <labelIf:switch:ID>
 *     Show the label only while Switch ID is ON.
 *     Example: <labelIf:switch:5>
 *              Shows the label only when Switch 5 is ON.
 *
 *   <labelIf:var:ID:OP:VALUE>
 *     Show the label only while Variable ID satisfies the comparison.
 *     Operators: =  !=  >  >=  <  <=
 *     Example: <labelIf:var:3:>=:10>
 *              Shows the label when Variable 3 is 10 or more.
 *     Example: <labelIf:var:7:=:0>
 *              Shows the label when Variable 7 equals 0.
 *
 *   <labelIf:selfswitch:LETTER>
 *     Show the label only while the event's own Self Switch LETTER is ON.
 *     Letters: A  B  C  D
 *     Example: <labelIf:selfswitch:A>
 *              Shows the label when this event's Self Switch A is ON.
 *
 * NOTE: Multiple <labelIf> tags are supported. ALL conditions must be true
 * for the label to show (logical AND). Combine freely:
 *   <labelIf:switch:3>
 *   <labelIf:var:2:>=:5>
 *   The label appears only when Switch 3 is ON AND Variable 2 >= 5.
 *
 * PLUGIN COMMANDS
 * ============================================================================
 *
 *   ShowLabel / HideLabel / ToggleLabel
 *     Show, hide or toggle the label for a specific event.
 *     eventId = 0 targets the calling event.
 *     Note: Plugin Command overrides take priority over <labelIf> conditions.
 *
 *   SetMode
 *     Switch between Always and Proximity mode at runtime.
 *
 *   SetTheme
 *     Change the visual theme at runtime.
 *
 *   RefreshLabels
 *     Force all labels to rebuild (useful after changing event names via
 *     script calls or other plugins).
 *
 * SCRIPT API
 * ============================================================================
 *   PICO.EventLabels.show(eventId)
 *   PICO.EventLabels.hide(eventId)
 *   PICO.EventLabels.toggle(eventId)
 *   PICO.EventLabels.setMode('always' | 'proximity')
 *   PICO.EventLabels.setTheme('Dark' | 'Light' | 'Neon' | 'Retrospace')
 *   PICO.EventLabels.refresh()
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
 *   #10 — PICO Event Labels           Floating event name labels (this plugin)
 *   #11 — PICO Event Cursor           Per-event mouse cursor changer
 *
 * CHANGELOG
 * ============================================================================
 * v1.1.0 (2026-05-10)
 *   - New: ShowBackground plugin parameter — global default for bg visibility.
 *   - New: <labelBg> note tag — forces background ON for a specific event,
 *     even when ShowBackground is false globally.
 *   - New: <labelNoBg> note tag — forces background OFF for a specific event,
 *     even when ShowBackground is true globally.
 *   - New: <labelIf:switch:ID> note tag — show label only when a switch is ON.
 *   - New: <labelIf:switch:ID> note tag — show label only when a switch is ON.
 *   - New: <labelIf:var:ID:OP:VALUE> note tag — show label based on a variable
 *     comparison (operators: = != > >= < <=). Evaluated every frame.
 *   - New: <labelIf:selfswitch:LETTER> note tag — show label only when the
 *     event's own self switch (A/B/C/D) is ON. Evaluated every frame.
 *   - Multiple <labelIf> tags per event are ANDed together.
 *   - Plugin Command overrides (ShowLabel/HideLabel) still take priority over
 *     all <labelIf> conditions.
 *
 * v1.0.1 (2026-05-01)
 *   - Fix: labels not appearing after returning from the menu scene or any
 *     sub-scene (e.g. map transfer then menu open). Added Scene_Map#start hook
 *     that detects orphaned/missing PIXI containers and rebuilds them.
 *
 * v1.0.0 (2026-05-01)
 *   - Initial release.
 *   - PIXI-based floating labels above events.
 *   - Always-on and proximity modes.
 *   - Smooth fade in/out on proximity transitions.
 *   - Four built-in themes: Dark, Light, Neon, Retrospace.
 *   - Per-event show/hide override via Plugin Commands and Script API.
 *   - Runtime mode and theme switching.
 *   - Events with empty names are silently skipped.
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
 * @desc Logs label creation and updates to the browser console.
 *
 * @param VisibilityMode
 * @text Visibility Mode
 * @parent --- General ---
 * @type select
 * @option Always
 * @value always
 * @option Proximity
 * @value proximity
 * @default always
 * @desc Always: label is always visible. Proximity: fades in/out by distance.
 *
 * @param ProximityRadius
 * @text Proximity Radius (tiles)
 * @parent --- General ---
 * @type number
 * @min 1
 * @max 20
 * @default 3
 * @desc Tile radius within which the label becomes visible (Proximity mode only).
 *
 * @param FadeSpeed
 * @text Fade Speed
 * @parent --- General ---
 * @type number
 * @min 1
 * @max 30
 * @default 8
 * @desc Alpha steps per frame during fade in/out (higher = faster).
 *
 * @param OffsetX
 * @text Label Offset X (pixels)
 * @parent --- General ---
 * @type number
 * @min -400
 * @max 400
 * @default 0
 * @desc Horizontal offset from the event center. 0 = perfectly centered.
 *
 * @param OffsetY
 * @text Label Offset Y (pixels)
 * @parent --- General ---
 * @type number
 * @min -400
 * @max 400
 * @default -14
 * @desc Vertical offset from the event center. 0 = centered on tile, negative moves up.
 *
 * @param --- Appearance ---
 * @text ─────────────────────────────
 *
 * @param Theme
 * @text Theme
 * @parent --- Appearance ---
 * @type select
 * @option Dark
 * @option Light
 * @option Neon
 * @option Retrospace
 * @default Dark
 * @desc Visual theme for all labels.
 *
 * @param FontSize
 * @text Font Size
 * @parent --- Appearance ---
 * @type number
 * @min 8
 * @max 32
 * @default 13
 * @desc Font size in pixels.
 *
 * @param PaddingX
 * @text Padding Horizontal
 * @parent --- Appearance ---
 * @type number
 * @min 0
 * @max 40
 * @default 10
 * @desc Horizontal padding inside the label background.
 *
 * @param PaddingY
 * @text Padding Vertical
 * @parent --- Appearance ---
 * @type number
 * @min 0
 * @max 20
 * @default 4
 * @desc Vertical padding inside the label background.
 *
 * @param CornerRadius
 * @text Corner Radius
 * @parent --- Appearance ---
 * @type number
 * @min 0
 * @max 20
 * @default 5
 * @desc Rounded corner radius of the label background.
 *
 * @param BackgroundAlpha
 * @text Background Alpha
 * @parent --- Appearance ---
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 1.00
 * @default 0.82
 * @desc Opacity of the label background (0.0 = transparent, 1.0 = solid).
 *
 * @param ShowBackground
 * @text Show Background
 * @parent --- Appearance ---
 * @type boolean
 * @default true
 * @desc Default background for all labels. Use <labelNoBg> or <labelBg> in event notes to override per event.
 *
 * @command ShowLabel
 * @text Show Label
 * @desc Force a specific event's label to show, overriding proximity rules and conditions.
 *
 * @arg EventId
 * @text Event ID
 * @type number
 * @min 0
 * @default 0
 * @desc Event ID to show. 0 = calling event.
 *
 * @command HideLabel
 * @text Hide Label
 * @desc Force a specific event's label to hide, overriding proximity rules and conditions.
 *
 * @arg EventId
 * @text Event ID
 * @type number
 * @min 0
 * @default 0
 * @desc Event ID to hide. 0 = calling event.
 *
 * @command ToggleLabel
 * @text Toggle Label
 * @desc Toggle a specific event's label visibility.
 *
 * @arg EventId
 * @text Event ID
 * @type number
 * @min 0
 * @default 0
 * @desc Event ID to toggle. 0 = calling event.
 *
 * @command SetMode
 * @text Set Mode
 * @desc Switch visibility mode at runtime.
 *
 * @arg Mode
 * @text Mode
 * @type select
 * @option Always
 * @value always
 * @option Proximity
 * @value proximity
 * @default always
 * @desc New visibility mode.
 *
 * @command SetTheme
 * @text Set Theme
 * @desc Change the label theme at runtime.
 *
 * @arg Theme
 * @text Theme
 * @type select
 * @option Dark
 * @option Light
 * @option Neon
 * @option Retrospace
 * @default Dark
 * @desc New theme to apply to all labels.
 *
 * @command RefreshLabels
 * @text Refresh Labels
 * @desc Destroy and rebuild all event labels (use after changing event names).
 */

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_EventLabels";
    const _raw        = PluginManager.parameters(PLUGIN_NAME) || {};

    const DEBUG = String(_raw["DebugMode"] ?? "false").toLowerCase() === "true";

    // =========================================================================
    //  Logging
    // =========================================================================

    const clog  = (...a) => { if (DEBUG) console.log(`[${PLUGIN_NAME}#12]`, ...a); };
    const cwarn = (...a) => { if (DEBUG) console.warn(`[${PLUGIN_NAME}#12]`, ...a); };

    // =========================================================================
    //  Config
    // =========================================================================

    const Config = {
        mode:            String(_raw["VisibilityMode"]  || "always"),
        proximityRadius: parseInt(_raw["ProximityRadius"]) || 3,
        fadeSpeed:       parseInt(_raw["FadeSpeed"])       || 8,
        offsetX:         parseInt(_raw["OffsetX"] ?? "0")  || 0,
        offsetY:         _raw["OffsetY"] !== undefined ? parseInt(_raw["OffsetY"]) : -14,
        theme:           String(_raw["Theme"]          || "Dark"),
        fontSize:        parseInt(_raw["FontSize"])        || 13,
        paddingX:        parseInt(_raw["PaddingX"])        || 10,
        paddingY:        parseInt(_raw["PaddingY"])        || 4,
        cornerRadius:    parseInt(_raw["CornerRadius"])    || 5,
        bgAlpha:         parseFloat(_raw["BackgroundAlpha"]) || 0.82,
        showBg:          String(_raw["ShowBackground"] ?? "true").toLowerCase() === "true",
    };

    // =========================================================================
    //  Themes
    // =========================================================================

    const THEMES = {
        Dark: {
            bg:       0x1a1a2e,
            text:     "#e8e8f0",
            glow:     false,
        },
        Light: {
            bg:       0xf0f0f0,
            text:     "#1a1a2e",
            glow:     false,
        },
        Neon: {
            bg:       0x0d0d1a,
            text:     "#00ffe7",
            glow:     true,
            glowColor: 0x00ffe7,
        },
        Retrospace: {
            bg:       0x1a0030,
            text:     "#ff44cc",
            glow:     true,
            glowColor: 0xff44cc,
        },
    };

    const getTheme = () => THEMES[Config.theme] || THEMES.Dark;

    // =========================================================================
    //  Per-event override registry  { eventId: 'show' | 'hide' | null }
    // =========================================================================

    const _overrides = {};

    // =========================================================================
    //  Note tag parser
    //
    //  Reads the event's Note field and extracts:
    //    bgOverride  {null|'show'|'hide'}  — per-event bg override
    //                  null  = inherit Config.showBg (no tag present)
    //                 'show' = <labelBg>   forces bg ON regardless of global setting
    //                 'hide' = <labelNoBg> forces bg OFF regardless of global setting
    //    conditions  {Array}  — list of condition objects to AND together
    //
    //  Condition object shapes:
    //    { type: 'switch',     id }
    //    { type: 'var',        id, op, value }
    //    { type: 'selfswitch', letter }
    // =========================================================================

    const _parseNoteConditions = (rawNote) => {
        const result = { bgOverride: null, conditions: [] };
        if (!rawNote) return result;
        const note = rawNote.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        // <labelNoBg>  — force background OFF for this event
        if (/<labelNoBg>/i.test(note)) {
            result.bgOverride = "hide";
        }
        // <labelBg>  — force background ON for this event
        if (/<labelBg>/i.test(note)) {
            result.bgOverride = "show";
        }

        // <labelIf:...>  — collect all occurrences
        const re = /<labelIf:([^>]+)>/gi;
        let match;
        while ((match = re.exec(note)) !== null) {
            const parts = match[1].split(":");
            const kind  = parts[0].toLowerCase();

            if (kind === "switch" && parts[1]) {
                const id = parseInt(parts[1]);
                if (!isNaN(id) && id > 0) {
                    result.conditions.push({ type: "switch", id });
                    clog(`Note condition parsed: switch ${id}`);
                }

            } else if (kind === "var" && parts.length >= 4) {
                const id    = parseInt(parts[1]);
                const op    = parts[2];
                const value = parseFloat(parts[3]);
                if (!isNaN(id) && id > 0 && !isNaN(value) &&
                    ["=", "!=", ">", ">=", "<", "<="].includes(op)) {
                    result.conditions.push({ type: "var", id, op, value });
                    clog(`Note condition parsed: var ${id} ${op} ${value}`);
                } else {
                    cwarn(`Invalid <labelIf:var:...> tag: "${match[0]}"`);
                }

            } else if (kind === "selfswitch" && parts[1]) {
                const letter = parts[1].toUpperCase();
                if (["A", "B", "C", "D"].includes(letter)) {
                    result.conditions.push({ type: "selfswitch", letter });
                    clog(`Note condition parsed: selfswitch ${letter}`);
                } else {
                    cwarn(`Invalid self switch letter in "${match[0]}" — use A, B, C or D.`);
                }

            } else {
                cwarn(`Unknown <labelIf> kind "${kind}" in "${match[0]}"`);
            }
        }

        return result;
    };

    // =========================================================================
    //  Condition evaluator
    //  Returns true when ALL conditions pass (logical AND).
    // =========================================================================

    const _evalConditions = (conditions, mapId, eventId) => {
        for (const cond of conditions) {
            switch (cond.type) {

                case "switch": {
                    if (!$gameSwitches.value(cond.id)) return false;
                    break;
                }

                case "var": {
                    const actual = $gameVariables.value(cond.id);
                    switch (cond.op) {
                        case "=":  if (actual !== cond.value) return false; break;
                        case "!=": if (actual === cond.value) return false; break;
                        case ">":  if (actual <= cond.value)  return false; break;
                        case ">=": if (actual <  cond.value)  return false; break;
                        case "<":  if (actual >= cond.value)  return false; break;
                        case "<=": if (actual >  cond.value)  return false; break;
                    }
                    break;
                }

                case "selfswitch": {
                    const key = [mapId, eventId, cond.letter];
                    if (!$gameSelfSwitches.value(key)) return false;
                    break;
                }
            }
        }
        return true;
    };

    // =========================================================================
    //  Label sprite (one per event)
    // =========================================================================

    class EventLabel {
        constructor(event) {
            this._event      = event;
            this._container  = null;
            this._text       = null;
            this._bg         = null;
            this._alpha      = 0;
            this._targetAlpha = 0;
            this._built      = false;
            this._name       = "";
            // Note-tag data — populated in build()
            this._noBg       = false;   // resolved: true = no background drawn
            this._conditions = [];
        }

        get eventId() { return this._event.eventId(); }

        _eventName() {
            try { return this._event.event().name || ""; } catch (_) { return ""; }
        }

        _eventNote() {
            try { return this._event.event().note || ""; } catch (_) { return ""; }
        }

        build(pixiStage) {
            const name = this._eventName();
            if (!name) return;

            this._name = name;

            // Parse note tags
            const rawNote = this._eventNote();
            clog(`Event ${this.eventId} note: "${rawNote}"`);
            const noteData       = _parseNoteConditions(rawNote);
            // Resolve background visibility:
            //   note 'hide' → always no bg
            //   note 'show' → always bg
            //   null        → follow Config.showBg global setting
            this._noBg       = noteData.bgOverride === "hide" ? true
                             : noteData.bgOverride === "show" ? false
                             : !Config.showBg;
            this._conditions     = noteData.conditions;

            const theme = getTheme();

            // Container
            this._container = new PIXI.Container();
            this._container.alpha = 0;

            // Text
            this._text = new PIXI.Text(name, {
                fontFamily: "sans-serif",
                fontSize:   Config.fontSize,
                fill:       theme.text,
                fontWeight: "600",
                letterSpacing: 0.5,
            });
            this._text.resolution = window.devicePixelRatio || 1;

            const tw = this._text.width;
            const th = this._text.height;
            const px = Config.paddingX;
            const py = Config.paddingY;
            const cr = Config.cornerRadius;
            const bw = tw + px * 2;
            const bh = th + py * 2;

            // Background (skipped when <labelNoBg> is set)
            if (!this._noBg) {
                this._bg = new PIXI.Graphics();
                this._bg.beginFill(theme.bg, Config.bgAlpha);
                this._bg.drawRoundedRect(0, 0, bw, bh, cr);
                this._bg.endFill();

                // Glow effect (Neon / Retrospace)
                if (theme.glow) {
                    try {
                        const glow = new PIXI.Graphics();
                        glow.beginFill(theme.glowColor, 0.08);
                        glow.drawRoundedRect(-3, -3, bw + 6, bh + 6, cr + 3);
                        glow.endFill();
                        this._container.addChild(glow);
                    } catch (_) { /* PIXI version without filters — skip */ }
                }

                this._container.addChild(this._bg);
            }

            this._text.x = this._noBg ? 0 : px;
            this._text.y = this._noBg ? 0 : py;

            this._container.addChild(this._text);

            // Pivot at center of the label box so offsetX/Y = 0 lands exactly on tile center
            this._container.pivot.x = bw / 2;
            this._container.pivot.y = bh / 2;

            pixiStage.addChild(this._container);
            this._built = true;
            clog(`Label built: "${name}" (eventId ${this.eventId}` +
                 `${this._noBg ? ", noBg" : ""}` +
                 `${this._conditions.length ? `, ${this._conditions.length} condition(s)` : ""})`);
        }

        destroy() {
            if (this._container) {
                this._container.parent && this._container.parent.removeChild(this._container);
                this._container.destroy({ children: true });
                this._container = null;
            }
            this._built = false;
        }

        update(spriteset) {
            if (!this._built || !this._container) return;

            // Reposition to follow the event sprite
            // tileWidth/tileHeight = tile size in pixels
            // adjustX/Y converts tile coords to screen coords
            // + tileWidth/2 = horizontal center of the tile
            // + tileHeight/2 = vertical center of the tile
            // offsetX/offsetY are added on top: 0,0 lands exactly on tile center
            const tileW = $gameMap.tileWidth();
            const tileH = $gameMap.tileHeight();
            const sx = $gameMap.adjustX(this._event._realX) * tileW + tileW / 2 + Config.offsetX;
            const sy = $gameMap.adjustY(this._event._realY) * tileH + tileH / 2 + Config.offsetY;

            this._container.x = sx;
            this._container.y = sy;

            // Determine target alpha
            // Priority: Plugin Command override → note conditions → mode/proximity
            const override = _overrides[this.eventId];
            if (override === "hide") {
                this._targetAlpha = 0;
            } else if (override === "show") {
                this._targetAlpha = 1;
            } else {
                // Evaluate note conditions first (all must pass)
                if (this._conditions.length > 0) {
                    const condPass = _evalConditions(
                        this._conditions,
                        $gameMap.mapId(),
                        this.eventId
                    );
                    if (!condPass) {
                        this._targetAlpha = 0;
                    } else if (Config.mode === "always") {
                        this._targetAlpha = 1;
                    } else {
                        this._targetAlpha = this._proximityAlpha();
                    }
                } else if (Config.mode === "always") {
                    this._targetAlpha = 1;
                } else {
                    this._targetAlpha = this._proximityAlpha();
                }
            }

            // Smooth fade
            const step = Config.fadeSpeed / 255;
            if (this._alpha < this._targetAlpha) {
                this._alpha = Math.min(this._targetAlpha, this._alpha + step);
            } else if (this._alpha > this._targetAlpha) {
                this._alpha = Math.max(this._targetAlpha, this._alpha - step);
            }

            this._container.alpha = this._alpha;
        }

        _proximityAlpha() {
            const player = $gamePlayer;
            const dx     = player._realX - this._event._realX;
            const dy     = player._realY - this._event._realY;
            const dist   = Math.sqrt(dx * dx + dy * dy);
            return dist <= Config.proximityRadius ? 1 : 0;
        }

        rebuildTheme() {
            // Lightweight: just update text style and bg color without full rebuild
            if (!this._built) return;
            const theme = getTheme();
            if (this._text) {
                this._text.style.fill = theme.text;
            }
            if (this._bg) {
                this._bg.clear();
                this._bg.beginFill(theme.bg, Config.bgAlpha);
                const bw = this._text.width + Config.paddingX * 2;
                const bh = this._text.height + Config.paddingY * 2;
                this._bg.drawRoundedRect(0, 0, bw, bh, Config.cornerRadius);
                this._bg.endFill();
            }
        }
    }

    // =========================================================================
    //  Label manager (lives on Spriteset_Map)
    // =========================================================================

    const _labels = new Map(); // eventId → EventLabel
    let   _pixiStage = null;

    const _buildAllLabels = (spriteset) => {
        _destroyAllLabels();
        if (!$gameMap) return;

        _pixiStage = spriteset._tilemap || spriteset;

        for (const event of $gameMap.events()) {
            if (!event.event().name) continue;
            const label = new EventLabel(event);
            label.build(_pixiStage);
            if (label._built) _labels.set(event.eventId(), label);
        }
        clog(`Built ${_labels.size} label(s).`);
    };

    const _destroyAllLabels = () => {
        for (const label of _labels.values()) label.destroy();
        _labels.clear();
    };

    const _updateAllLabels = (spriteset) => {
        for (const label of _labels.values()) label.update(spriteset);
    };

    // =========================================================================
    //  Spriteset_Map hooks
    // =========================================================================

    const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function () {
        _Spriteset_Map_createUpperLayer.call(this);
        _buildAllLabels(this);
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _Spriteset_Map_update.call(this);
        _updateAllLabels(this);
    };

    const _Spriteset_Map_destroy = Spriteset_Map.prototype.destroy;
    Spriteset_Map.prototype.destroy = function (options) {
        _destroyAllLabels();
        _Spriteset_Map_destroy.call(this, options);
    };

    // =========================================================================
    //  Rebuild labels on map transfer
    // =========================================================================

    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _Scene_Map_onMapLoaded.call(this);
        // Clear per-event overrides when entering a new map
        for (const k of Object.keys(_overrides)) delete _overrides[k];
    };

    // =========================================================================
    //  Rebuild labels when returning from menu (or any sub-scene)
    // =========================================================================

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);
        // If labels are gone (e.g. after returning from menu), rebuild them.
        // _labels may be empty either because the map just loaded (fine, createUpperLayer
        // already handled it) or because the PIXI stage was silently reset while the
        // menu was open — in that case we must rebuild here.
        if (_labels.size === 0 && this._spriteset) {
            _buildAllLabels(this._spriteset);
        } else if (_labels.size > 0 && this._spriteset) {
            // Re-validate: if containers lost their parent they need to be re-added.
            let needsRebuild = false;
            for (const label of _labels.values()) {
                if (label._built && label._container && !label._container.parent) {
                    needsRebuild = true;
                    break;
                }
            }
            if (needsRebuild) _buildAllLabels(this._spriteset);
        }
    };

    // =========================================================================
    //  Internal helpers
    // =========================================================================

    const _resolveEventId = (rawId, interpreter) => {
        const id = parseInt(rawId) || 0;
        if (id === 0 && interpreter) return interpreter._eventId;
        return id;
    };

    // =========================================================================
    //  Plugin Command — ShowLabel
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "ShowLabel", function (args) {
        const id = _resolveEventId(args["EventId"], this);
        _overrides[id] = "show";
        clog(`ShowLabel → eventId ${id}`);
    });

    // =========================================================================
    //  Plugin Command — HideLabel
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "HideLabel", function (args) {
        const id = _resolveEventId(args["EventId"], this);
        _overrides[id] = "hide";
        clog(`HideLabel → eventId ${id}`);
    });

    // =========================================================================
    //  Plugin Command — ToggleLabel
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "ToggleLabel", function (args) {
        const id = _resolveEventId(args["EventId"], this);
        if (_overrides[id] === "hide") {
            _overrides[id] = "show";
        } else if (_overrides[id] === "show") {
            _overrides[id] = "hide";
        } else {
            // No override — infer current state from mode
            _overrides[id] = Config.mode === "always" ? "hide" : "show";
        }
        clog(`ToggleLabel → eventId ${id} → ${_overrides[id]}`);
    });

    // =========================================================================
    //  Plugin Command — SetMode
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "SetMode", function (args) {
        Config.mode = String(args["Mode"] || "always").toLowerCase();
        clog(`Mode → ${Config.mode}`);
    });

    // =========================================================================
    //  Plugin Command — SetTheme
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "SetTheme", function (args) {
        Config.theme = String(args["Theme"] || "Dark");
        for (const label of _labels.values()) label.rebuildTheme();
        clog(`Theme → ${Config.theme}`);
    });

    // =========================================================================
    //  Plugin Command — RefreshLabels
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "RefreshLabels", function () {
        if (SceneManager._scene && SceneManager._scene._spriteset) {
            _buildAllLabels(SceneManager._scene._spriteset);
            clog("Labels refreshed.");
        } else {
            cwarn("RefreshLabels: no active spriteset found.");
        }
    });

    // =========================================================================
    //  Public API
    // =========================================================================

    const PICO = (window.PICO = window.PICO || {});
    PICO.EventLabels = {
        show(eventId) {
            _overrides[eventId] = "show";
        },
        hide(eventId) {
            _overrides[eventId] = "hide";
        },
        toggle(eventId) {
            if (_overrides[eventId] === "hide") _overrides[eventId] = "show";
            else if (_overrides[eventId] === "show") _overrides[eventId] = "hide";
            else _overrides[eventId] = Config.mode === "always" ? "hide" : "show";
        },
        setMode(mode) {
            Config.mode = mode;
        },
        setTheme(theme) {
            Config.theme = theme;
            for (const label of _labels.values()) label.rebuildTheme();
        },
        refresh() {
            if (SceneManager._scene && SceneManager._scene._spriteset) {
                _buildAllLabels(SceneManager._scene._spriteset);
            }
        },
    };

    // =========================================================================
    //  Init log
    // =========================================================================

    console.log(`[${PLUGIN_NAME}#12] v1.1.0 loaded.`);

})();

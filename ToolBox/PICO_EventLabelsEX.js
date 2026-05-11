//=============================================================================
// PICO ToolBox #12 — PICO_EventLabelsEX.js  |  v1.7.0  |  2026-05-10
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v1.7.0| PICO ToolBox #12 — Floating PIXI labels above events, driven by page comments with smooth fade.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #12 — PICO_EventLabelsEX  v1.7.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * Displays a floating PIXI label above events. Labels are defined per event
 * page via comment tags — when the active page changes, the label updates
 * automatically with a smooth fade. Pages without a <label:...> tag show no
 * label at all (fades out).
 *
 * SETUP
 * ============================================================================
 * 1. Install and activate the plugin.
 * 2. Open any event page and add a Comment command.
 * 3. Inside the comment, write your tags (see COMMENT TAGS below).
 * 4. Done — labels appear and update automatically as pages change.
 *
 * COMMENT TAGS
 * ============================================================================
 * Add these inside a Comment command on any event page. All tags in that
 * comment block are read together. Tags are case-insensitive.
 *
 *   <label: TEXT>
 *     The text shown in the floating label for this page.
 *     If this tag is absent, no label is shown for this page (fades out).
 *     Example: <label: Ferreiro>
 *     Example: <label: Loja Fechada>
 *     Example: <label: ???>
 *
 *   <labelNoBg>
 *     Forces the background OFF for this page, even if Show Background is
 *     enabled globally in the Plugin Manager. Only the text floats.
 *
 *   <labelBg>
 *     Forces the background ON for this page, even if Show Background is
 *     disabled globally in the Plugin Manager.
 *
 * LABEL TOKENS
 * ============================================================================
 * Embed dynamic content directly inside the <label: TEXT> value using tokens.
 * Tokens are evaluated every frame — values update in real-time automatically.
 * Tokens and plain text can be freely combined.
 *
 *   [i:ID]
 *     Renders icon ID from the project's IconSet.png.
 *     Icon size scales automatically with the label font size.
 *     Example: <label: [i:32] Ferreiro>
 *     Example: <label: [i:208] HP: [v:1]>
 *
 *   [v:ID]
 *     Displays the current value of Variable ID as text.
 *     Updates every frame — no refresh needed.
 *     Example: <label: Ouro: [v:3]>
 *     Example: <label: [v:1] / [v:2]>
 *
 *   [s:ID]
 *     Displays ON or OFF based on the current state of Switch ID.
 *     Example: <label: Porta: [s:5]>
 *
 *   [s:ID:TextoON:TextoOFF]
 *     Displays custom text depending on the switch state.
 *     Example: <label: [s:5:Aberta:Fechada]>
 *     Example: <label: Loja [s:12:Aberta:Fechada]>
 *
 *   [img:NAME]
 *   [img:NAME:SIZE]
 *     Renders a PNG image from img/system/NAME.png inline.
 *     Without size: height scales to match the label font size, width is
 *     proportional to the image aspect ratio.
 *     With size: height is forced to SIZE pixels, width stays proportional.
 *     Example: <label: [img:nuvem] Vendedor>
 *     Example: <label: [img:logo:24] Loja>
 *     Example: <label: [img:icon_hp:16] [v:1] / [v:2]>
 *
 * STYLE TAGS
 * ============================================================================
 * Override individual style properties per page. Unset properties fall back
 * to the active theme values.
 *
 *   <labelColor: VALUE>
 *     Text colour. Accepts any CSS colour: #rrggbb, #rgb, or named colours.
 *     Example: <labelColor: #ff4444>
 *     Example: <labelColor: gold>
 *
 *   <labelBgColor: VALUE>
 *     Background colour. Same format as labelColor.
 *     Suppresses the theme glow effect when set.
 *     Example: <labelBgColor: #1a0030>
 *
 *   <labelFontSize: N>
 *     Font size in pixels.
 *     Example: <labelFontSize: 16>
 *
 *   <labelFontFamily: NAME>
 *     Font family name. Use any font loaded by your project.
 *     Example: <labelFontFamily: GameFont>
 *
 *   <labelOutlineColor: VALUE>
 *     Text stroke colour. Same format as labelColor.
 *     Example: <labelOutlineColor: #000000>
 *
 *   <labelOutlineWidth: N>
 *     Text stroke width in pixels. Defaults to 3 when outlineColor is set.
 *     Example: <labelOutlineWidth: 4>
 *
 *   <labelBold>
 *     Renders the text in bold.
 *
 *   <labelItalic>
 *     Renders the text in italic.
 *
 *   <labelProximity: N>
 *     Per-event proximity override. Ignores the global Visibility Mode setting.
 *     N > 0 : force proximity mode with a radius of N tiles for this event.
 *     N = 0 : force always-visible mode for this event.
 *     Absent : inherits the global Visibility Mode and Proximity Radius.
 *     Example: <labelProximity: 5>   show within 5 tiles
 *     Example: <labelProximity: 0>   always visible regardless of global mode
 *
 * EFFECTS
 * ============================================================================
 * Animate the label per page. All parameters are optional — defaults apply
 * when the tag is used without parameters. Multiple effects can be combined.
 *
 *   <labelFloat>
 *   <labelFloat: speed=N amp=N>
 *     Label bobs up and down smoothly.
 *     speed — oscillation speed (default: 1)
 *     amp   — vertical amplitude in pixels (default: 4)
 *
 *   <labelPulse>
 *   <labelPulse: speed=N min=N max=N>
 *     Label scale oscillates between min and max.
 *     speed — oscillation speed (default: 1)
 *     min   — minimum scale (default: 0.75)
 *     max   — maximum scale (default: 1.0)
 *
 *   <labelShake>
 *   <labelShake: speed=N intensity=N>
 *     Label shakes randomly — good for danger or alert states.
 *     speed     — reserved for future use (default: 3)
 *     intensity — pixel offset per frame (default: 2)
 *
 *   <labelRainbow>
 *   <labelRainbow: speed=N>
 *     Text colour cycles through the full hue spectrum.
 *     speed — cycle speed (default: 1)
 *
 *   <labelTypewriter>
 *   <labelTypewriter: speed=N>
 *     Text appears character by character. Resets on every page change.
 *     speed — characters per second roughly (default: 3, higher = faster)
 *
 * Effects can be freely combined on the same page:
 *   <labelFloat: amp=6>
 *   <labelRainbow: speed=2>
 *
 * CONDITIONS
 * ============================================================================
 *   <labelIf:switch:ID>
 *     Show the label only while Switch ID is ON.
 *     Example: <labelIf:switch:5>
 *
 *   <labelIf:var:ID:OP:VALUE>
 *     Show the label only while Variable ID satisfies the comparison.
 *     Operators: =  !=  >  >=  <  <=
 *     Example: <labelIf:var:3:>=:10>
 *     Example: <labelIf:var:7:=:0>
 *
 *   <labelIf:selfswitch:LETTER>
 *     Show the label only while this event's own Self Switch LETTER is ON.
 *     Letters: A  B  C  D
 *     Example: <labelIf:selfswitch:A>
 *
 * All tags are read from the Comment block(s) on the active page.
 * Multiple <labelIf> tags stack as AND — all must be true for the label to
 * show. Conditions are evaluated every frame in real-time.
 *
 * Full example comment block:
 *   <label: [i:84] Mestre da Guilda [v:3]>
 *   <labelColor: #ffd700>
 *   <labelBgColor: #2a0050>
 *   <labelFontSize: 15>
 *   <labelOutlineColor: #000000>
 *   <labelOutlineWidth: 3>
 *   <labelBold>
 *   <labelProximity: 4>
 *   <labelFloat: speed=1 amp=5>
 *   <labelRainbow: speed=2>
 *   <labelIf:switch:10>
 *   <labelIf:var:3:>=:5>
 *
 * Example comment with multiple tags:
 *   <label: Mestre da Guilda>
 *   <labelIf:switch:10>
 *   <labelIf:var:3:>=:5>
 *   <labelNoBg>
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
 * PLUGIN COMMANDS
 * ============================================================================
 *
 *   ShowLabel / HideLabel / ToggleLabel
 *     Show, hide or toggle the label for a specific event.
 *     eventId = 0 targets the calling event.
 *     Plugin Command overrides take priority over all comment conditions.
 *     Overrides are cleared automatically on map transfer.
 *
 *   SetMode
 *     Switch between Always and Proximity mode at runtime.
 *
 *   SetTheme
 *     Change the visual theme at runtime.
 *
 *   RefreshLabels
 *     Force all labels to reparse their active page comments and rebuild.
 *     Useful after modifying events programmatically.
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
 *   #10 — PICO Movie Player           Fullscreen PIXI video playback
 *   #11 — PICO Event Cursor           Per-event mouse cursor changer
 *   #12 — PICO Event Labels EX        Floating page-aware event labels (this plugin)
 *
 * CHANGELOG
 * ============================================================================
 * v1.7.0 (2026-05-10)
 *   - New: [img:NAME] label token — renders a PNG from img/system/ inline.
 *     Height scales to font size by default, width preserves aspect ratio.
 *   - New: [img:NAME:SIZE] — forced height in pixels, width stays proportional.
 *   - Async texture loading handled gracefully: sprite adjusts on load.
 *   - Freely combinable with [i:], [v:], [s:] and plain text.
 *
 * v1.6.0 (2026-05-10)
 *   - New: [i:ID] label token — renders an icon from IconSet.png inline.
 *     Icon size scales automatically with the label font size.
 *   - New: [v:ID] label token — displays a variable value, updated every frame.
 *   - New: [s:ID] label token — displays ON/OFF for a switch state.
 *   - New: [s:ID:ON_TEXT:OFF_TEXT] — custom text per switch state.
 *   - Tokens can be freely combined with plain text and each other.
 *   - Dynamic segments (var/switch) update every frame without rebuild.
 *
 * v1.5.0 (2026-05-10)
 *   - New: <labelFloat> effect — label bobs up and down (speed, amp).
 *   - New: <labelPulse> effect — scale oscillates between min and max (speed, min, max).
 *   - New: <labelShake> effect — label shakes randomly (intensity).
 *   - New: <labelRainbow> effect — text colour cycles through hue spectrum (speed).
 *   - New: <labelTypewriter> effect — text appears character by character (speed).
 *   - All effect parameters are optional with sensible defaults.
 *   - Multiple effects can be combined on the same page.
 *   - Typewriter state resets automatically on page change.
 *
 * v1.4.0 (2026-05-10)
 *   - New: <labelProximity: N> comment tag — per-event proximity override.
 *     N > 0 forces proximity mode with radius N for that event only.
 *     N = 0 forces always-visible mode for that event only.
 *     Absent inherits the global Visibility Mode and Proximity Radius.
 *
 * v1.3.0 (2026-05-10)
 *   - Rework: labels are now defined via Comment tags on each event page.
 *     The event name field is no longer used.
 *   - New: <label: TEXT> comment tag — sets the label text for the active page.
 *   - New: page-awareness — when the active page changes, the label text,
 *     style, background setting, and conditions update automatically with a
 *     smooth fade. Pages without <label:...> fade out and show nothing.
 *   - New: <labelColor:> — per-page text colour override.
 *   - New: <labelBgColor:> — per-page background colour override.
 *   - New: <labelFontSize:> — per-page font size override.
 *   - New: <labelFontFamily:> — per-page font family override.
 *   - New: <labelOutlineColor:> — per-page text stroke colour.
 *   - New: <labelOutlineWidth:> — per-page text stroke width.
 *   - New: <labelBold> — bold text for this page.
 *   - New: <labelItalic> — italic text for this page.
 *   - All tags (<labelNoBg>, <labelBg>, <labelIf:...>) now live in the
 *     comment block on each page, parsed fresh on every page change.
 *   - One EventLabel container per event, rebuilt in-place on page change
 *     to avoid flicker and preserve the fade state.
 *
 * v1.1.0 (2026-05-10)
 *   - New: ShowBackground plugin parameter — global default for bg visibility.
 *   - New: <labelBg> — forces background ON per event.
 *   - New: <labelNoBg> — forces background OFF per event.
 *   - New: <labelIf:switch:ID>, <labelIf:var:ID:OP:VALUE>,
 *     <labelIf:selfswitch:LETTER> conditional visibility tags.
 *
 * v1.0.1 (2026-05-01)
 *   - Fix: labels not appearing after returning from menu or sub-scene.
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
 * @desc Default background visibility for all labels. Override per page with <labelBg> or <labelNoBg>.
 *
 * @command ShowLabel
 * @text Show Label
 * @desc Force a specific event's label to show, overriding all conditions.
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
 * @desc Force a specific event's label to hide, overriding all conditions.
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
 * @desc Reparse all event page comments and rebuild labels.
 */

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_EventLabelsEX";
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
        Dark:       { bg: 0x1a1a2e, text: "#e8e8f0", glow: false },
        Light:      { bg: 0xf0f0f0, text: "#1a1a2e", glow: false },
        Neon:       { bg: 0x0d0d1a, text: "#00ffe7", glow: true,  glowColor: 0x00ffe7 },
        Retrospace: { bg: 0x1a0030, text: "#ff44cc", glow: true,  glowColor: 0xff44cc },
    };

    const getTheme = () => THEMES[Config.theme] || THEMES.Dark;

    // =========================================================================
    //  Per-event override registry  { eventId: 'show' | 'hide' }
    // =========================================================================

    const _overrides = {};

    // =========================================================================
    //  Comment reader
    //
    //  Scans the active page's command list for Comment blocks (code 108/408)
    //  and concatenates their text into a single string for tag parsing.
    //  Returns "" if the event has no active page.
    // =========================================================================

    const _readPageComment = (gameEvent) => {
        try {
            const page = gameEvent.page();
            if (!page) return "";
            const lines = [];
            for (const cmd of page.list) {
                // 108 = Comment (first line), 408 = Comment (continuation)
                if (cmd.code === 108 || cmd.code === 408) {
                    lines.push(cmd.parameters[0]);
                }
            }
            return lines.join("\n");
        } catch (_) {
            return "";
        }
    };

    // =========================================================================
    //  Label segment parser
    //
    //  Splits a label template string into an ordered array of segments:
    //    { type: 'text',  value: 'string' }
    //    { type: 'icon',  id: N }
    //    { type: 'var',   id: N }
    //    { type: 'switch', id: N, on: 'ON', off: 'OFF' }
    //    { type: 'img',    name: 'filename', size: N|null }
    //
    //  Template syntax (inside <label: ...>):
    //    [i:32]              — icon index 32 from IconSet.png
    //    [v:3]               — current value of Variable 3
    //    [s:5]               — 'ON' or 'OFF' for Switch 5
    //    [s:5:Aberta:Fechada]— custom text per switch state
    //    [img:nuvem]         — img/system/nuvem.png, height = fontSize
    //    [img:nuvem:32]      — img/system/nuvem.png, forced 32px
    // =========================================================================

    const _parseLabelSegments = (template) => {
        const segments = [];
        if (!template) return segments;

        // Regex matches [i:N], [v:N], [s:N], [s:N:text:text], [img:name], [img:name:size]
        const re = /\[([ivs]|img):([^\]]+)\]/gi;
        let last = 0, match;

        while ((match = re.exec(template)) !== null) {
            // Text before this token
            if (match.index > last) {
                segments.push({ type: "text", value: template.slice(last, match.index) });
            }

            const kind   = match[1].toLowerCase();
            const params = match[2].split(":");

            if (kind === "i") {
                const id = parseInt(params[0]);
                if (!isNaN(id)) segments.push({ type: "icon", id });
                else cwarn(`[i:] invalid icon id "${params[0]}"`);

            } else if (kind === "v") {
                const id = parseInt(params[0]);
                if (!isNaN(id) && id > 0) segments.push({ type: "var", id });
                else cwarn(`[v:] invalid variable id "${params[0]}"`);

            } else if (kind === "s") {
                const id  = parseInt(params[0]);
                const on  = params[1] !== undefined ? params[1] : "ON";
                const off = params[2] !== undefined ? params[2] : "OFF";
                if (!isNaN(id) && id > 0) segments.push({ type: "switch", id, on, off });
                else cwarn(`[s:] invalid switch id "${params[0]}"`);

            } else if (kind === "img") {
                const name = params[0] ? params[0].trim() : null;
                const size = params[1] ? parseInt(params[1]) : null; // optional px size
                if (name) segments.push({ type: "img", name, size });
                else cwarn(`[img:] missing filename`);
            }

            last = match.index + match[0].length;
        }

        // Remaining text
        if (last < template.length) {
            segments.push({ type: "text", value: template.slice(last) });
        }

        return segments;
    };

    // Checks whether a segment array contains any dynamic segments (var/switch)
    const _hasDynamicSegments = (segs) =>
        segs.some(s => s.type === "var" || s.type === "switch");

    // =========================================================================
    //  Comment tag parser
    //
    //  Parses a raw comment string and returns:
    //    label       {string|null}        — text from <label: TEXT>, or null
    //    bgOverride  {null|'show'|'hide'} — per-page bg override
    //    conditions  {Array}              — condition objects to AND together
    //
    //  Condition object shapes:
    //    { type: 'switch',     id }
    //    { type: 'var',        id, op, value }
    //    { type: 'selfswitch', letter }
    // =========================================================================

    const _parseComment = (raw) => {
        const result = {
            label:        null,
            bgOverride:   null,   // null | 'show' | 'hide'
            style:        {},     // per-page style overrides
            proximity:    null,   // null = inherit global | number = per-event override
            effects:      {},     // active effects and their params
            conditions:   [],
        };
        if (!raw) return result;
        const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        // <label: TEXT>
        const labelMatch = text.match(/<label:\s*([^>]+)>/i);
        if (labelMatch) {
            result.label = labelMatch[1].trim();
        }

        // <labelNoBg>  — force background OFF
        if (/<labelNoBg>/i.test(text)) {
            result.bgOverride = "hide";
        }
        // <labelBg>  — force background ON (wins over labelNoBg if both present)
        if (/<labelBg>/i.test(text)) {
            result.bgOverride = "show";
        }

        // ── Style tags ────────────────────────────────────────────────────────

        // <labelColor: #rrggbb>  — text colour
        const colorMatch = text.match(/<labelColor:\s*([^>]+)>/i);
        if (colorMatch) result.style.color = colorMatch[1].trim();

        // <labelBgColor: #rrggbb>  — background colour (overrides theme bg)
        const bgColorMatch = text.match(/<labelBgColor:\s*([^>]+)>/i);
        if (bgColorMatch) result.style.bgColor = bgColorMatch[1].trim();

        // <labelFontSize: N>  — font size in pixels
        const fontSizeMatch = text.match(/<labelFontSize:\s*(\d+)>/i);
        if (fontSizeMatch) result.style.fontSize = parseInt(fontSizeMatch[1]);

        // <labelFontFamily: NAME>  — font family name
        const fontFamilyMatch = text.match(/<labelFontFamily:\s*([^>]+)>/i);
        if (fontFamilyMatch) result.style.fontFamily = fontFamilyMatch[1].trim();

        // <labelOutlineColor: #rrggbb>  — text stroke colour
        const outlineColorMatch = text.match(/<labelOutlineColor:\s*([^>]+)>/i);
        if (outlineColorMatch) result.style.outlineColor = outlineColorMatch[1].trim();

        // <labelOutlineWidth: N>  — text stroke width in pixels
        const outlineWidthMatch = text.match(/<labelOutlineWidth:\s*(\d+(?:\.\d+)?)>/i);
        if (outlineWidthMatch) result.style.outlineWidth = parseFloat(outlineWidthMatch[1]);

        // <labelBold>  — bold text
        if (/<labelBold>/i.test(text)) result.style.bold = true;

        // <labelItalic>  — italic text
        if (/<labelItalic>/i.test(text)) result.style.italic = true;

        // <labelProximity: N>  — per-event proximity radius override
        //   N > 0 : force proximity mode with radius N tiles
        //   N = 0 : force always-visible mode
        //   absent: inherit global Config.mode / Config.proximityRadius
        const proximityMatch = text.match(/<labelProximity:\s*(\d+(?:\.\d+)?)>/i);
        if (proximityMatch) result.proximity = parseFloat(proximityMatch[1]);

        // ── Effect tags ───────────────────────────────────────────────────────
        //  Each effect tag is optional. Parameters are key=value pairs inside
        //  the tag, all optional — defaults are applied when omitted.

        const _effectParam = (str, key, fallback) => {
            const m = str && str.match(new RegExp(key + "\\s*=\\s*([\\d.]+)"));
            return m ? parseFloat(m[1]) : fallback;
        };

        // <labelFloat> / <labelFloat: speed=N amp=N>
        const floatMatch = text.match(/<labelFloat(?::\s*([^>]*))?>/i);
        if (floatMatch) {
            const p = floatMatch[1] || "";
            result.effects.float = {
                speed: _effectParam(p, "speed", 1),
                amp:   _effectParam(p, "amp",   4),
            };
        }

        // <labelPulse> / <labelPulse: speed=N min=N max=N>
        const pulseMatch = text.match(/<labelPulse(?::\s*([^>]*))?>/i);
        if (pulseMatch) {
            const p = pulseMatch[1] || "";
            result.effects.pulse = {
                speed: _effectParam(p, "speed", 1),
                min:   _effectParam(p, "min",   0.75),
                max:   _effectParam(p, "max",   1.0),
            };
        }

        // <labelShake> / <labelShake: speed=N intensity=N>
        const shakeMatch = text.match(/<labelShake(?::\s*([^>]*))?>/i);
        if (shakeMatch) {
            const p = shakeMatch[1] || "";
            result.effects.shake = {
                speed:     _effectParam(p, "speed",     3),
                intensity: _effectParam(p, "intensity", 2),
            };
        }

        // <labelRainbow> / <labelRainbow: speed=N>
        const rainbowMatch = text.match(/<labelRainbow(?::\s*([^>]*))?>/i);
        if (rainbowMatch) {
            const p = rainbowMatch[1] || "";
            result.effects.rainbow = {
                speed: _effectParam(p, "speed", 1),
            };
        }

        // <labelTypewriter> / <labelTypewriter: speed=N>
        const typewriterMatch = text.match(/<labelTypewriter(?::\s*([^>]*))?>/i);
        if (typewriterMatch) {
            const p = typewriterMatch[1] || "";
            result.effects.typewriter = {
                speed: _effectParam(p, "speed", 3),
            };
        }

        // ── Condition tags ────────────────────────────────────────────────────

        // <labelIf:...>  — collect all occurrences
        const re = /<labelIf:([^>]+)>/gi;
        let match;
        while ((match = re.exec(text)) !== null) {
            const parts = match[1].split(":");
            const kind  = parts[0].toLowerCase();

            if (kind === "switch" && parts[1]) {
                const id = parseInt(parts[1]);
                if (!isNaN(id) && id > 0) {
                    result.conditions.push({ type: "switch", id });
                    clog(`Condition parsed: switch ${id}`);
                }

            } else if (kind === "var" && parts.length >= 4) {
                const id    = parseInt(parts[1]);
                const op    = parts[2];
                const value = parseFloat(parts[3]);
                if (!isNaN(id) && id > 0 && !isNaN(value) &&
                    ["=", "!=", ">", ">=", "<", "<="].includes(op)) {
                    result.conditions.push({ type: "var", id, op, value });
                    clog(`Condition parsed: var ${id} ${op} ${value}`);
                } else {
                    cwarn(`Invalid <labelIf:var:...>: "${match[0]}"`);
                }

            } else if (kind === "selfswitch" && parts[1]) {
                const letter = parts[1].toUpperCase();
                if (["A", "B", "C", "D"].includes(letter)) {
                    result.conditions.push({ type: "selfswitch", letter });
                    clog(`Condition parsed: selfswitch ${letter}`);
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
    //  EventLabel sprite (one container per event, persists across page changes)
    //
    //  When the active page index changes, _syncPage() reparsed the comment
    //  and calls _rebuildChildren() to swap text/bg in-place inside the
    //  existing container — the alpha state is preserved so the fade
    //  continues without a jump.
    // =========================================================================

    class EventLabel {
        constructor(event) {
            this._event       = event;
            this._container   = null;
            this._text        = null;
            this._bg          = null;
            this._glow        = null;
            this._alpha       = 0;
            this._targetAlpha = 0;
            this._built       = false;

            // Page tracking
            this._pageIndex  = -1;    // last known page index
            this._labelText  = null;  // null = no label this page
            this._noBg       = false;
            this._style      = {};    // per-page style overrides
            this._proximity  = null;  // null = inherit global | number = per-event radius
            this._effects    = {};    // active effects config from comment
            this._effectTime = 0;    // frame counter for effect animation
            this._twIndex    = 0;    // typewriter: current visible char count
            this._twTimer    = 0;    // typewriter: frames until next char
            this._fullText   = null; // typewriter: full label text
            this._segments   = [];   // parsed label segments (text/icon/var/switch)
            this._hasDynamic = false;// true if any segment is var or switch
            this._iconset    = null; // cached PIXI.Texture of IconSet.png
            this._segSprites = [];   // PIXI objects for each segment (Text or Sprite)
            this._conditions = [];
        }

        get eventId() { return this._event.eventId(); }

        // ---------------------------------------------------------------------
        //  build — create the PIXI container and attach to stage.
        //  Called once per event on map load. _syncPage() runs immediately
        //  after to parse the first active page.
        // ---------------------------------------------------------------------

        build(pixiStage) {
            this._container = new PIXI.Container();
            this._container.alpha = 0;
            pixiStage.addChild(this._container);
            this._built = true;
            clog(`Container created for eventId ${this.eventId}`);
            this._syncPage(true);
        }

        destroy() {
            if (this._container) {
                this._container.parent && this._container.parent.removeChild(this._container);
                this._container.destroy({ children: true });
                this._container = null;
            }
            this._built     = false;
            this._pageIndex = -1;
        }

        // ---------------------------------------------------------------------
        //  _syncPage — reparse the active page's comment if the page changed.
        //  force=true skips the page-index check (used on first build).
        // ---------------------------------------------------------------------

        _syncPage(force = false) {
            let currentPageIndex;
            try {
                // _pageIndex is the internal MZ property tracking the active page (0-based, -1 = none)
                currentPageIndex = this._event._pageIndex ?? -1;
            } catch (_) {
                currentPageIndex = -1;
            }

            if (!force && currentPageIndex === this._pageIndex) return;

            this._pageIndex = currentPageIndex;

            const rawComment = _readPageComment(this._event);
            clog(`Event ${this.eventId} page ${currentPageIndex} comment: "${rawComment}"`);

            const parsed = _parseComment(rawComment);

            this._labelText  = parsed.label;
            this._noBg       = parsed.bgOverride === "hide" ? true
                             : parsed.bgOverride === "show" ? false
                             : !Config.showBg;
            this._style      = parsed.style;      // per-page style overrides
            this._proximity  = parsed.proximity;   // null | number
            this._effects    = parsed.effects;
            this._segments   = _parseLabelSegments(parsed.label);
            this._hasDynamic = _hasDynamicSegments(this._segments);
            this._conditions = parsed.conditions;
            // Reset typewriter state on every page change
            this._twIndex    = 0;
            this._twTimer    = 0;
            this._fullText   = parsed.label;
            this._effectTime = 0;

            this._rebuildChildren();

            clog(`Event ${this.eventId} synced: ` +
                 `"${this._labelText ?? "(none)"}" ` +
                 `noBg=${this._noBg} ` +
                 `conds=${this._conditions.length}`);
        }

        // ---------------------------------------------------------------------
        //  _makeTextStyle — build a PIXI TextStyle from theme + per-page style
        // ---------------------------------------------------------------------

        _makeTextStyle() {
            const theme = getTheme();
            const s     = this._style;
            const style = {
                fontFamily:    s.fontFamily  || "sans-serif",
                fontSize:      s.fontSize    || Config.fontSize,
                fill:          s.color       || theme.text,
                fontWeight:    s.bold        ? "700" : "600",
                fontStyle:     s.italic      ? "italic" : "normal",
                letterSpacing: 0.5,
            };
            const strokeColor = s.outlineColor || null;
            if (strokeColor) {
                style.stroke          = strokeColor;
                style.strokeThickness = s.outlineWidth != null ? s.outlineWidth : 3;
            }
            return style;
        }

        // ---------------------------------------------------------------------
        //  _resolveSegmentText — evaluate dynamic value of a segment
        // ---------------------------------------------------------------------

        _resolveSegmentText(seg) {
            if (seg.type === "var")    return String($gameVariables.value(seg.id));
            if (seg.type === "switch") return $gameSwitches.value(seg.id) ? seg.on : seg.off;
            return seg.value || "";
        }

        // ---------------------------------------------------------------------
        //  _getIconset — lazily load IconSet texture
        // ---------------------------------------------------------------------

        _getIconset() {
            if (this._iconset) return this._iconset;
            try {
                this._iconset = PIXI.utils.TextureCache["img/system/IconSet.png"]
                             || PIXI.Texture.from("img/system/IconSet.png");
            } catch (_) { this._iconset = null; }
            return this._iconset;
        }

        // ---------------------------------------------------------------------
        //  _makeIconSprite — create a cropped sprite for one icon index
        // ---------------------------------------------------------------------

        _makeIconSprite(iconIndex, size) {
            const iconset = this._getIconset();
            if (!iconset || !iconset.baseTexture) return null;
            const cols   = 16; // MZ IconSet is 16 icons wide
            const iw     = 32;
            const ih     = 32;
            const col    = iconIndex % cols;
            const row    = Math.floor(iconIndex / cols);
            const frame  = new PIXI.Rectangle(col * iw, row * ih, iw, ih);
            const tex    = new PIXI.Texture(iconset.baseTexture, frame);
            const sprite = new PIXI.Sprite(tex);
            sprite.width  = size;
            sprite.height = size;
            return sprite;
        }

        // ---------------------------------------------------------------------
        //  _makeImageSprite — load a PNG from img/system/ and scale it
        // ---------------------------------------------------------------------

        _makeImageSprite(name, size) {
            try {
                const path   = `img/system/${name}.png`;
                const cached = PIXI.utils.TextureCache[path];
                const tex    = cached || PIXI.Texture.from(path);
                if (!tex || !tex.baseTexture) return null;

                const sprite = new PIXI.Sprite(tex);

                // Scale proportionally to fit within 'size' pixels tall
                // If texture is not yet loaded (async), we set size directly
                // and let PIXI update naturally on next frame
                if (tex.baseTexture.valid && tex.width > 0 && tex.height > 0) {
                    const ratio  = tex.width / tex.height;
                    sprite.height = size;
                    sprite.width  = Math.round(size * ratio);
                } else {
                    sprite.width  = size;
                    sprite.height = size;
                    // Once the texture loads, adjust the ratio
                    tex.baseTexture.on("loaded", () => {
                        if (!sprite.destroyed && tex.width > 0 && tex.height > 0) {
                            const ratio   = tex.width / tex.height;
                            sprite.height = size;
                            sprite.width  = Math.round(size * ratio);
                        }
                    });
                }

                return sprite;
            } catch (e) {
                cwarn(`[img:] failed to load "img/system/${name}.png":`, e);
                return null;
            }
        }

        // ---------------------------------------------------------------------
        //  _rebuildChildren — clear and recreate all PIXI children inside the
        //  existing container. Alpha state is preserved across rebuilds.
        // ---------------------------------------------------------------------

        _rebuildChildren() {
            while (this._container.children.length > 0) {
                const child = this._container.children[0];
                this._container.removeChild(child);
                child.destroy({ texture: false }); // don't destroy shared iconset texture
            }
            this._text       = null;
            this._bg         = null;
            this._glow       = null;
            this._segSprites = [];

            if (!this._labelText) return; // no <label:> tag — alpha will fade to 0

            const theme    = getTheme();
            const s        = this._style;
            const px       = Config.paddingX;
            const py       = Config.paddingY;
            const cr       = Config.cornerRadius;
            const fontSize = s.fontSize || Config.fontSize;
            const iconSize = Math.round(fontSize * 1.1); // icon scales with font
            const textStyle = this._makeTextStyle();
            const gap      = 3; // pixels between segments

            // ── Build segment objects ─────────────────────────────────────────
            // First pass: create all PIXI objects and measure total width/height

            let totalW = 0;
            let maxH   = 0;
            const objs = []; // { obj, w, h }

            for (const seg of this._segments) {
                if (seg.type === "icon") {
                    const sprite = this._makeIconSprite(seg.id, iconSize);
                    if (sprite) {
                        objs.push({ obj: sprite, w: iconSize, h: iconSize, seg });
                        totalW += iconSize + gap;
                        maxH    = Math.max(maxH, iconSize);
                    }
                } else if (seg.type === "img") {
                    const sprite = this._makeImageSprite(seg.name, seg.size || iconSize);
                    if (sprite) {
                        const sw = sprite.width;
                        const sh = sprite.height;
                        objs.push({ obj: sprite, w: sw, h: sh, seg });
                        totalW += sw + gap;
                        maxH    = Math.max(maxH, sh);
                    }
                } else {
                    // text / var / switch — all render as PIXI.Text
                    const txt = seg.type === "text" ? seg.value : this._resolveSegmentText(seg);
                    const node = new PIXI.Text(txt, textStyle);
                    node.resolution = window.devicePixelRatio || 1;
                    objs.push({ obj: node, w: node.width, h: node.height, seg });
                    totalW += node.width + gap;
                    maxH    = Math.max(maxH, node.height);
                }
            }
            if (totalW > 0) totalW -= gap; // remove trailing gap

            const bw = totalW + px * 2;
            const bh = maxH  + py * 2;

            // ── Background ────────────────────────────────────────────────────
            if (!this._noBg) {
                const bgHex = s.bgColor
                    ? parseInt(s.bgColor.replace("#", ""), 16)
                    : theme.bg;

                if (theme.glow && !s.bgColor) {
                    try {
                        this._glow = new PIXI.Graphics();
                        this._glow.beginFill(theme.glowColor, 0.08);
                        this._glow.drawRoundedRect(-3, -3, bw + 6, bh + 6, cr + 3);
                        this._glow.endFill();
                        this._container.addChild(this._glow);
                    } catch (_) { /* skip */ }
                }

                this._bg = new PIXI.Graphics();
                this._bg.beginFill(bgHex, Config.bgAlpha);
                this._bg.drawRoundedRect(0, 0, bw, bh, cr);
                this._bg.endFill();
                this._container.addChild(this._bg);
            }

            // ── Second pass: position and add all segment objects ─────────────
            let curX = this._noBg ? 0 : px;
            for (const { obj, w, h, seg } of objs) {
                obj.x = curX;
                obj.y = (this._noBg ? 0 : py) + (maxH - h) / 2; // vertically centered
                this._container.addChild(obj);
                this._segSprites.push({ obj, seg });
                curX += w + gap;

                // Keep reference to first text node for typewriter / rainbow
                if (!this._text && (seg.type === "text" || seg.type === "var" || seg.type === "switch")) {
                    this._text = obj;
                }
            }

            // Pivot at center
            this._container.pivot.x = bw / 2;
            this._container.pivot.y = bh / 2;
        }

        // ---------------------------------------------------------------------
        //  _refreshDynamic — update text of var/switch segments every frame
        // ---------------------------------------------------------------------

        _refreshDynamic() {
            if (!this._hasDynamic) return;
            for (const { obj, seg } of this._segSprites) {
                if (seg.type === "var" || seg.type === "switch") {
                    const newVal = this._resolveSegmentText(seg);
                    if (obj.text !== newVal) obj.text = newVal;
                }
            }
        }

        // ---------------------------------------------------------------------
        //  update — called every frame
        // ---------------------------------------------------------------------

        update() {
            if (!this._built || !this._container) return;

            // Reparse comment if the active page changed
            this._syncPage();

            // Reposition to follow the event
            const tileW = $gameMap.tileWidth();
            const tileH = $gameMap.tileHeight();
            const sx = $gameMap.adjustX(this._event._realX) * tileW + tileW / 2 + Config.offsetX;
            const sy = $gameMap.adjustY(this._event._realY) * tileH + tileH / 2 + Config.offsetY;
            this._container.x = sx;
            this._container.y = sy;

            // Determine target alpha
            // Priority: Plugin Command override → no label tag → conditions → mode/proximity
            const override = _overrides[this.eventId];
            if (override === "hide") {
                this._targetAlpha = 0;
            } else if (override === "show") {
                // Respect "no label on this page" even when forced to show
                this._targetAlpha = this._labelText ? 1 : 0;
            } else if (!this._labelText) {
                this._targetAlpha = 0;
            } else if (this._conditions.length > 0 &&
                       !_evalConditions(this._conditions, $gameMap.mapId(), this.eventId)) {
                this._targetAlpha = 0;
            } else if (this._proximity !== null) {
                // Per-event proximity override:
                //   radius 0 → always visible
                //   radius N → proximity mode with that radius
                this._targetAlpha = this._proximity === 0 ? 1 : this._proximityAlpha();
            } else if (Config.mode === "always") {
                this._targetAlpha = 1;
            } else {
                this._targetAlpha = this._proximityAlpha();
            }

            // Smooth fade
            const step = Config.fadeSpeed / 255;
            if (this._alpha < this._targetAlpha) {
                this._alpha = Math.min(this._targetAlpha, this._alpha + step);
            } else if (this._alpha > this._targetAlpha) {
                this._alpha = Math.max(this._targetAlpha, this._alpha - step);
            }

            this._container.alpha = this._alpha;

            // Only animate when visible
            if (this._alpha > 0) {
                this._applyEffects();
            }
        }

        // ---------------------------------------------------------------------
        //  _applyEffects — run per-frame effect logic
        // ---------------------------------------------------------------------

        _applyEffects() {
            const fx = this._effects;
            const t  = this._effectTime;

            // Reset transform offsets each frame so effects don't accumulate
            let extraY    = 0;
            let extraX    = 0;
            let scaleVal  = 1;

            // ── Float ─────────────────────────────────────────────────────────
            if (fx.float) {
                const { speed, amp } = fx.float;
                extraY += Math.sin(t * speed * 0.05) * amp;
            }

            // ── Pulse ─────────────────────────────────────────────────────────
            if (fx.pulse) {
                const { speed, min, max } = fx.pulse;
                const norm = (Math.sin(t * speed * 0.05) + 1) / 2; // 0..1
                scaleVal = min + norm * (max - min);
            }

            // ── Shake ─────────────────────────────────────────────────────────
            if (fx.shake) {
                const { intensity } = fx.shake;
                extraX += (Math.random() * 2 - 1) * intensity;
                extraY += (Math.random() * 2 - 1) * intensity;
            }

            // Apply transform
            this._container.position.x += extraX;
            this._container.position.y += extraY;
            this._container.scale.set(scaleVal);

            // ── Rainbow ───────────────────────────────────────────────────────
            if (fx.rainbow && this._text) {
                const { speed } = fx.rainbow;
                const hue = (t * speed * 2) % 360;
                this._text.style.fill = `hsl(${hue}, 100%, 60%)`;
            }

            // ── Typewriter ────────────────────────────────────────────────────
            if (fx.typewriter && this._text && this._fullText) {
                const { speed } = fx.typewriter;
                if (this._twIndex < this._fullText.length) {
                    this._twTimer++;
                    // speed controls frames per character (higher = slower)
                    const framesPerChar = Math.max(1, Math.round(10 / speed));
                    if (this._twTimer >= framesPerChar) {
                        this._twTimer = 0;
                        this._twIndex = Math.min(this._twIndex + 1, this._fullText.length);
                        this._text.text = this._fullText.slice(0, this._twIndex);
                    }
                }
            }

            this._effectTime++;
        }

        _proximityAlpha() {
            const radius = this._proximity !== null ? this._proximity : Config.proximityRadius;
            const dx     = $gamePlayer._realX - this._event._realX;
            const dy     = $gamePlayer._realY - this._event._realY;
            const dist   = Math.sqrt(dx * dx + dy * dy);
            return dist <= radius ? 1 : 0;
        }

        rebuildTheme() {
            if (!this._built) return;
            this._rebuildChildren();
        }
    }

    // =========================================================================
    //  Label manager
    // =========================================================================

    const _labels    = new Map(); // eventId → EventLabel
    let   _pixiStage = null;

    const _buildAllLabels = (spriteset) => {
        _destroyAllLabels();
        if (!$gameMap) return;

        _pixiStage = spriteset._tilemap || spriteset;

        for (const event of $gameMap.events()) {
            const label = new EventLabel(event);
            label.build(_pixiStage);
            if (label._built) _labels.set(event.eventId(), label);
        }
        clog(`Built ${_labels.size} label container(s).`);
    };

    const _destroyAllLabels = () => {
        for (const label of _labels.values()) label.destroy();
        _labels.clear();
    };

    const _updateAllLabels = () => {
        for (const label of _labels.values()) label.update();
    };

    // =========================================================================
    //  Spriteset_Map hooks
    // =========================================================================

    const _PELEX_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function () {
        _PELEX_Spriteset_Map_createUpperLayer.call(this);
        _buildAllLabels(this);
    };

    const _PELEX_Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function () {
        _PELEX_Spriteset_Map_update.call(this);
        _updateAllLabels();
    };

    const _PELEX_Spriteset_Map_destroy = Spriteset_Map.prototype.destroy;
    Spriteset_Map.prototype.destroy = function (options) {
        _destroyAllLabels();
        _PELEX_Spriteset_Map_destroy.call(this, options);
    };

    // =========================================================================
    //  Clear overrides on map transfer
    // =========================================================================

    const _PELEX_Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function () {
        _PELEX_Scene_Map_onMapLoaded.call(this);
        for (const k of Object.keys(_overrides)) delete _overrides[k];
    };

    // =========================================================================
    //  Rebuild labels when returning from menu or any sub-scene
    // =========================================================================

    const _PELEX_Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _PELEX_Scene_Map_start.call(this);
        if (_labels.size === 0 && this._spriteset) {
            _buildAllLabels(this._spriteset);
        } else if (_labels.size > 0 && this._spriteset) {
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
    //  Plugin Commands
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "ShowLabel", function (args) {
        const id = _resolveEventId(args["EventId"], this);
        _overrides[id] = "show";
        clog(`ShowLabel → eventId ${id}`);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "HideLabel", function (args) {
        const id = _resolveEventId(args["EventId"], this);
        _overrides[id] = "hide";
        clog(`HideLabel → eventId ${id}`);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "ToggleLabel", function (args) {
        const id = _resolveEventId(args["EventId"], this);
        if (_overrides[id] === "hide") {
            _overrides[id] = "show";
        } else if (_overrides[id] === "show") {
            _overrides[id] = "hide";
        } else {
            _overrides[id] = Config.mode === "always" ? "hide" : "show";
        }
        clog(`ToggleLabel → eventId ${id} → ${_overrides[id]}`);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetMode", function (args) {
        Config.mode = String(args["Mode"] || "always").toLowerCase();
        clog(`Mode → ${Config.mode}`);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetTheme", function (args) {
        Config.theme = String(args["Theme"] || "Dark");
        for (const label of _labels.values()) label.rebuildTheme();
        clog(`Theme → ${Config.theme}`);
    });

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
        show(eventId)   { _overrides[eventId] = "show"; },
        hide(eventId)   { _overrides[eventId] = "hide"; },
        toggle(eventId) {
            if (_overrides[eventId] === "hide")      _overrides[eventId] = "show";
            else if (_overrides[eventId] === "show") _overrides[eventId] = "hide";
            else _overrides[eventId] = Config.mode === "always" ? "hide" : "show";
        },
        setMode(mode)   { Config.mode = mode; },
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

    console.log(`[${PLUGIN_NAME}#12] v1.7.0 loaded.`);

})();

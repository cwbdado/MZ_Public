//=============================================================================
// PICO ToolBox #10 — PICO_MoviePlayer.js  |  v1.2.0  |  2026-04-29
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v1.2.0| PICO ToolBox Collection #10 — Fullscreen background movie player with gamepad HUD controls.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #10 — PICO_MoviePlayer  v1.2.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * Want cinematic backgrounds, animated environments, or cutscene overlays
 * without touching a video plugin that weighs more than your game? This one's
 * for you.
 *
 * PICO Movie Player plays .webm (or .mp4 fallback) files as a fullscreen
 * background layer wired directly into the PIXI scene graph — always behind
 * pictures and windows, always in sync with the engine. No DOM hacks, no
 * z-index juggling, no backgroundAlpha tricks.
 *
 * Drop it in and your movies just work.
 *
 * Videos must be placed in your project's /movies/ folder.
 *
 * PLUGIN COMMAND — PlayMovie
 * ============================================================================
 * Plays a fullscreen background movie.
 *
 *   filename      — file name without extension (must be in /movies/)
 *   loop          — false : plays once then stops (default)
 *                   true  : loops until StopMovie is called
 *   wait          — true  : event blocks until the movie ends, is escaped,
 *                           or StopMovie is called (default)
 *                   false : event continues immediately after starting
 *   fadeIn        — fade-in duration in frames (0 = instant)
 *   volume        — 0-100
 *   escapable     — if true, the player can press Cancel/Escape to stop
 *                   the movie. Only active while the event is waiting.
 *   escapeFadeOut — fade-out duration in frames when the player escapes
 *                   (0 = instant, default 30)
 *   commonEventId — Common Event to call when movie ends or is escaped
 *                   (0 = none).
 *
 * loop and wait are fully independent — all four combinations are valid:
 *
 *   loop:false  wait:true   plays once, event waits        (cutscene)
 *   loop:false  wait:false  plays once, event continues
 *   loop:true   wait:true   loops, event waits until StopMovie
 *   loop:true   wait:false  loops in background, event continues
 *
 * GAMEPAD HUD
 * ============================================================================
 * An optional floating control bar rendered at the bottom center of the
 * screen — YouTube-style — using icons from your project's IconSet.png.
 *
 * Enable it per-call via the showHud parameter in PlayMovie. Each button
 * shows a gamepad icon (from IconSet.png) and triggers an action.
 *
 * HUD visibility modes (hudMode):
 *   always   — visible the entire time the movie is playing
 *   auto     — appears on any gamepad input, hides after hudTimeout frames
 *
 * Configurable actions (all optional, icon index from IconSet.png):
 *   Pause / Resume   — toggle playback
 *   Seek Back        — rewind N seconds
 *   Seek Forward     — fast-forward N seconds
 *   Speed Down       — decrease playback rate
 *   Speed Up         — increase playback rate
 *   Stop             — stop with fade
 *   Skip             — jump to end (triggers Common Event)
 *
 * Each action maps to a gamepad button index (0-based, standard mapping):
 *   0=A/Cross  1=B/Circle  2=X/Square  3=Y/Triangle
 *   4=L1  5=R1  6=L2  7=R2  8=Select  9=Start
 *   12=DPad Up  13=DPad Down  14=DPad Left  15=DPad Right
 *
 * SCRIPT API
 * ============================================================================
 * PICO.MP.play("filename", {
 *   loop,           // true | false (default false)
 *   wait,           // true | false (default true)
 *   fadeIn,         // frames (default 0)
 *   volume,         // 0-100 (default 100)
 *   escapable,      // true | false (default false)
 *   escapeFadeOut,  // frames (default 30)
 *   commonEventId,  // 0 = none
 *   hud,            // HUD config object (see below) or null
 * });
 *
 * hud config object:
 * {
 *   mode,           // "always" | "auto" (default "always")
 *   timeout,        // frames before auto-hide (default 180)
 *   actions: [
 *     { label, iconIndex, button, action, value }
 *     // action: "pause"|"resume"|"toggle"|"seekBack"|"seekForward"
 *     //         |"speedDown"|"speedUp"|"stop"|"skip"
 *     // value:  seconds for seek, rate step for speed (optional)
 *   ]
 * }
 *
 * PICO.MP.stop(fadeOutFrames);
 * PICO.MP.pause();
 * PICO.MP.resume();
 * PICO.MP.setSpeed(rate);
 * PICO.MP.setVolume(0-100);
 * PICO.MP.setOpacity(0-255, frames);
 * PICO.MP.seek(seconds);
 * PICO.MP.skip();
 * PICO.MP.rewind();
 * PICO.MP.isPlaying();
 *
 * LAYER ORDER
 * ============================================================================
 *   Tilemap / Characters
 *     __picoMovieLayer  <- movie sprite
 *     Pictures (slots 1-100)
 *     __picoHudLayer    <- gamepad HUD (above pictures, below windows)
 *   Windows / UI
 *
 * COMPATIBILITY
 * ============================================================================
 * Safe aliasing (pmp_ prefix on all prototype aliases).
 * No conflicts with PICO ToolBox #1-#9 or standard MZ plugins.
 * Integrates with PICO TextFileDialog Enhanced out of the box.
 *
 * PART OF PICO TOOLBOX
 * ============================================================================
 *   #1  — PICO Debug HUD              Real-time variable/switch monitor
 *   #2  — PICO Set Self Switches      Reliable self-switch controller
 *   #3  — PICO Keyboard+              Full-keyboard input bindings
 *   #4  — PICO Horizontal Title Menu  Modern horizontal title layout
 *   #5  — PICO Disable Menu           Game-flow controls
 *   #6  — PICO Loot                   Weighted random loot tables
 *   #7  — PICO Gamepad                Full gamepad support
 *   #8  — PICO InputMapper            Native input remapping
 *   #9  — PICO Text Input             Keyboard text/number input
 *   #10 — PICO Movie Player           Fullscreen background movies (this plugin)
 *
 * CHANGELOG
 * ============================================================================
 * v1.2.0 (2026-04-29)
 *   - New: gamepad HUD — floating icon bar at bottom center of screen.
 *   - HUD uses IconSet.png icons configured per-action.
 *   - hudMode: "always" (always visible) or "auto" (show on input, auto-hide).
 *   - Configurable actions: pause/resume, seek, speed, stop, skip.
 *   - Each action maps to a configurable gamepad button index.
 *   - HUD fades in/out smoothly on show/hide.
 *   - Full Plugin Manager configuration for all HUD defaults.
 *
 * v1.1.0 (2026-04-29)
 *   - New: loop param — true loops until StopMovie, false plays once.
 *   - New: wait param — true blocks event until movie ends/escaped/stopped.
 *   - New: escapable — player can press Cancel/Escape to stop the movie.
 *   - New: escapeFadeOut — fade-out duration when escaping.
 *   - Common Event fires on natural end and on escape.
 *   - StopMovie unblocks a waiting event immediately.
 *
 * v1.0.0 (2026-04-29)
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
 * @command PlayMovie
 * @text Play Movie
 * @desc Plays a fullscreen background movie.
 *
 * @arg filename
 * @text File Name
 * @type string
 * @default intro
 * @desc File name without extension. Must be in /movies/.
 *
 * @arg loop
 * @text Loop
 * @type boolean
 * @default false
 * @desc If true, the movie loops indefinitely until StopMovie is called.
 *
 * @arg wait
 * @text Wait
 * @type boolean
 * @default true
 * @desc If true, the event is blocked until the movie ends, is escaped, or StopMovie is called.
 *
 * @arg fadeIn
 * @text Fade In (frames)
 * @type number
 * @min 0
 * @default 0
 * @desc Duration of opacity fade-in in frames. 0 = instant.
 *
 * @arg volume
 * @text Volume (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @desc Playback volume.
 *
 * @arg escapable
 * @text Escapable
 * @type boolean
 * @default false
 * @desc If true, Cancel/Escape stops the movie. Only active while event is waiting.
 *
 * @arg escapeFadeOut
 * @text Escape Fade Out (frames)
 * @type number
 * @min 0
 * @default 30
 * @desc Fade-out duration when the player escapes. 0 = instant.
 *
 * @arg commonEventId
 * @text On End: Common Event
 * @type common_event
 * @default 0
 * @desc Common Event called when the movie ends or is escaped (0 = none).
 *
 * @arg showHud
 * @text Show Gamepad HUD
 * @type boolean
 * @default false
 * @desc Show the floating gamepad control bar during playback.
 *
 * @arg hudMode
 * @text HUD Visibility Mode
 * @type select
 * @option Always visible
 * @value always
 * @option Auto-hide (show on input)
 * @value auto
 * @default always
 * @desc always = HUD stays visible. auto = appears on gamepad input, hides after timeout.
 *
 * @arg hudTimeout
 * @text HUD Auto-Hide Timeout (frames)
 * @type number
 * @min 30
 * @default 180
 * @desc Frames of inactivity before HUD hides in auto mode.
 *
 * @command StopMovie
 * @text Stop Movie
 * @desc Stops and removes the current background movie.
 *
 * @arg fadeOut
 * @text Fade Out (frames)
 * @type number
 * @min 0
 * @default 0
 * @desc Duration of opacity fade-out in frames. 0 = instant.
 *
 * @command PauseMovie
 * @text Pause Movie
 * @desc Pauses the current movie.
 *
 * @command ResumeMovie
 * @text Resume Movie
 * @desc Resumes a paused movie.
 *
 * @command SetMovieSpeed
 * @text Set Playback Speed
 * @desc Changes the movie playback rate.
 *
 * @arg rate
 * @text Rate
 * @type select
 * @option 0.25x (very slow)
 * @value 0.25
 * @option 0.5x (slow)
 * @value 0.5
 * @option 1.0x (normal)
 * @value 1.0
 * @option 1.5x (fast)
 * @value 1.5
 * @option 2.0x (very fast)
 * @value 2.0
 * @default 1.0
 * @desc Playback speed multiplier.
 *
 * @command SetMovieVolume
 * @text Set Volume
 * @desc Changes the movie volume.
 *
 * @arg volume
 * @text Volume (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 100
 * @desc New volume level.
 *
 * @command SetMovieOpacity
 * @text Set Opacity
 * @desc Changes movie opacity with an optional smooth transition.
 *
 * @arg opacity
 * @text Opacity (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @desc Target opacity (0 = invisible, 255 = fully opaque).
 *
 * @arg duration
 * @text Duration (frames)
 * @type number
 * @min 0
 * @default 0
 * @desc Transition duration in frames. 0 = instant.
 *
 * @command SeekMovie
 * @text Seek Movie
 * @desc Jumps to a specific position in the movie.
 *
 * @arg seconds
 * @text Position (seconds)
 * @type number
 * @decimals 2
 * @min 0
 * @default 0
 * @desc Target position in seconds.
 *
 * @command ShowHud
 * @text Show Gamepad HUD
 * @desc Shows the gamepad HUD if a movie is playing.
 *
 * @command HideHud
 * @text Hide Gamepad HUD
 * @desc Hides the gamepad HUD.
 *
 * @param --- HUD Defaults ---
 * @text ── Gamepad HUD Defaults ──
 *
 * @param hudIconSize
 * @text Icon Size (px)
 * @parent --- HUD Defaults ---
 * @type number
 * @min 16
 * @max 64
 * @default 32
 * @desc Size of each icon drawn from IconSet.png.
 *
 * @param hudPaddingX
 * @text Horizontal Padding (px)
 * @parent --- HUD Defaults ---
 * @type number
 * @min 0
 * @default 16
 * @desc Horizontal padding between icons.
 *
 * @param hudPaddingY
 * @text Vertical Padding (px)
 * @parent --- HUD Defaults ---
 * @type number
 * @min 0
 * @default 10
 * @desc Vertical padding inside the HUD bar.
 *
 * @param hudMarginBottom
 * @text Margin from Bottom (px)
 * @parent --- HUD Defaults ---
 * @type number
 * @min 0
 * @default 24
 * @desc Distance from the bottom edge of the screen.
 *
 * @param hudBgColor
 * @text Background Color
 * @parent --- HUD Defaults ---
 * @type string
 * @default rgba(0,0,0,0.55)
 * @desc CSS color for the HUD background bar. Supports rgba.
 *
 * @param hudCornerRadius
 * @text Corner Radius (px)
 * @parent --- HUD Defaults ---
 * @type number
 * @min 0
 * @default 8
 * @desc Rounded corner radius of the HUD bar.
 *
 * @param hudFadeDuration
 * @text Fade Duration (frames)
 * @parent --- HUD Defaults ---
 * @type number
 * @min 0
 * @default 20
 * @desc Frames for HUD fade in / fade out.
 *
 * @param --- HUD Actions ---
 * @text ── HUD Button Actions ──
 *
 * @param actionPause
 * @text Pause / Resume
 * @parent --- HUD Actions ---
 * @type struct<HudAction>
 * @default {"enabled":"true","iconIndex":"74","button":"9","label":"Pause"}
 * @desc Toggles pause/resume. Button 9 = Start.
 *
 * @param actionSeekBack
 * @text Seek Back
 * @parent --- HUD Actions ---
 * @type struct<HudAction>
 * @default {"enabled":"true","iconIndex":"167","button":"14","label":"Back","value":"5"}
 * @desc Seeks backward N seconds. Button 14 = DPad Left.
 *
 * @param actionSeekForward
 * @text Seek Forward
 * @parent --- HUD Actions ---
 * @type struct<HudAction>
 * @default {"enabled":"true","iconIndex":"166","button":"15","label":"Fwd","value":"5"}
 * @desc Seeks forward N seconds. Button 15 = DPad Right.
 *
 * @param actionSpeedDown
 * @text Speed Down
 * @parent --- HUD Actions ---
 * @type struct<HudAction>
 * @default {"enabled":"true","iconIndex":"168","button":"4","label":"Slower"}
 * @desc Decreases playback speed. Button 4 = L1.
 *
 * @param actionSpeedUp
 * @text Speed Up
 * @parent --- HUD Actions ---
 * @type struct<HudAction>
 * @default {"enabled":"true","iconIndex":"169","button":"5","label":"Faster"}
 * @desc Increases playback speed. Button 5 = R1.
 *
 * @param actionStop
 * @text Stop
 * @parent --- HUD Actions ---
 * @type struct<HudAction>
 * @default {"enabled":"false","iconIndex":"73","button":"1","label":"Stop"}
 * @desc Stops the movie. Button 1 = B/Circle.
 *
 * @param actionSkip
 * @text Skip
 * @parent --- HUD Actions ---
 * @type struct<HudAction>
 * @default {"enabled":"false","iconIndex":"170","button":"8","label":"Skip"}
 * @desc Jumps to the end. Button 8 = Select.
 *
 */

/*~struct~HudAction:
 * @param enabled
 * @text Enabled
 * @type boolean
 * @default true
 *
 * @param iconIndex
 * @text Icon Index
 * @type number
 * @min 0
 * @default 0
 * @desc Index of the icon in IconSet.png (same as icon picker in events).
 *
 * @param button
 * @text Gamepad Button Index
 * @type number
 * @min 0
 * @max 17
 * @default 0
 * @desc Standard gamepad button index (0=A, 1=B, 4=L1, 5=R1, 9=Start...).
 *
 * @param label
 * @text Label
 * @type string
 * @default Action
 * @desc Short label shown below the icon.
 *
 * @param value
 * @text Value (optional)
 * @type string
 * @default
 * @desc For seek: seconds. For speed: step (e.g. 0.25). Leave blank for default.
 */

// =============================================================================
// IIFE
// =============================================================================

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_MoviePlayer";
    const VERSION     = "1.2.0";
    const SERIES_NUM  = 10;

    // =========================================================================
    //  Logging
    // =========================================================================

    const clog  = (...a) => console.log(`[${PLUGIN_NAME}#${SERIES_NUM}]`, ...a);
    const cwarn = (...a) => console.warn(`[${PLUGIN_NAME}#${SERIES_NUM}]`, ...a);

    // =========================================================================
    //  Plugin Parameters
    // =========================================================================

    const _params = PluginManager.parameters(PLUGIN_NAME);

    function _parseAction(key) {
        try {
            const raw = JSON.parse(_params[key] || "{}");
            return {
                enabled   : raw.enabled !== "false",
                iconIndex : parseInt(raw.iconIndex) || 0,
                button    : parseInt(raw.button)    || 0,
                label     : raw.label || "",
                value     : raw.value !== undefined && raw.value !== "" ? parseFloat(raw.value) : null,
            };
        } catch (e) { return { enabled: false }; }
    }

    const _defaults = {
        iconSize      : parseInt(_params.hudIconSize)      || 32,
        paddingX      : parseInt(_params.hudPaddingX)      || 16,
        paddingY      : parseInt(_params.hudPaddingY)      || 10,
        marginBottom  : parseInt(_params.hudMarginBottom)  || 24,
        bgColor       : _params.hudBgColor                 || "rgba(0,0,0,0.55)",
        cornerRadius  : parseInt(_params.hudCornerRadius)  || 8,
        fadeDuration  : parseInt(_params.hudFadeDuration)  || 20,
        actions: {
            pause      : _parseAction("actionPause"),
            seekBack   : _parseAction("actionSeekBack"),
            seekForward: _parseAction("actionSeekForward"),
            speedDown  : _parseAction("actionSpeedDown"),
            speedUp    : _parseAction("actionSpeedUp"),
            stop       : _parseAction("actionStop"),
            skip       : _parseAction("actionSkip"),
        },
    };

    // Speed steps cycle
    const SPEED_STEPS = [0.25, 0.5, 1.0, 1.5, 2.0];

    // =========================================================================
    //  Internal state — movie
    // =========================================================================

    let _sprite        = null;    // PIXI.Sprite with video texture
    let _texture       = null;    // PIXI.Texture
    let _state         = "idle";  // idle | playing | paused | stopping
    let _currentSpeed  = 1.0;

    // Playback config
    let _loop          = false;
    let _wait          = true;
    let _escapable     = false;
    let _escapeFadeOut = 30;
    let _commonEventId = 0;

    // Wait / escape
    let _waiting       = false;

    // Opacity transition
    let _opacityTarget   = 255;
    let _opacityDuration = 0;
    let _opacityElapsed  = 0;
    let _opacityStart    = 255;

    // =========================================================================
    //  Internal state — HUD
    // =========================================================================

    let _hud           = null;   // PIXI.Container — the HUD bar
    let _hudConfig     = null;   // active HUD config
    let _hudVisible    = false;  // current logical visibility
    let _hudAlpha      = 0;      // current rendered alpha (0-1)
    let _hudTimeout    = 0;      // countdown frames for auto-hide
    let _hudButtons    = [];     // array of { action, buttonIndex, sprite }
    let _gpPrev        = {};     // previous gamepad button states

    // =========================================================================
    //  Helpers — video element
    // =========================================================================

    function _getVideoElement(texture) {
        if (!texture) return null;
        const bt  = texture.baseTexture;
        const res = bt && (bt.resource || bt._resource);
        return (res && res.source && res.source.tagName === "VIDEO")
            ? res.source : null;
    }

    function _getLayer() {
        const scene = SceneManager._scene;
        return scene && scene._spriteset && scene._spriteset.__picoMovieLayer
            ? scene._spriteset.__picoMovieLayer : null;
    }

    function _getHudLayer() {
        const scene = SceneManager._scene;
        return scene && scene._spriteset && scene._spriteset.__picoHudLayer
            ? scene._spriteset.__picoHudLayer : null;
    }

    // =========================================================================
    //  Helpers — gamepad (raw Gamepad API, independent of MZ input)
    // =========================================================================

    function _getGamepad() {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < pads.length; i++) {
            if (pads[i] && pads[i].connected) return pads[i];
        }
        return null;
    }

    // Returns true on the rising edge (pressed this frame, not last frame)
    function _isButtonTriggered(pad, index) {
        if (!pad || index >= pad.buttons.length) return false;
        const pressed = pad.buttons[index].pressed;
        const wasPressed = !!_gpPrev[index];
        _gpPrev[index] = pressed;
        return pressed && !wasPressed;
    }

    // Returns true if any button was just pressed (for auto-hide wakeup)
    function _anyButtonTriggered(pad) {
        if (!pad) return false;
        let any = false;
        for (let i = 0; i < pad.buttons.length; i++) {
            const pressed = pad.buttons[i].pressed;
            if (pressed && !_gpPrev[i]) any = true;
            _gpPrev[i] = pressed;
        }
        return any;
    }

    // =========================================================================
    //  Core — destroy movie
    // =========================================================================

    function _destroySprite() {
        if (!_sprite) return;
        try {
            const vid = _getVideoElement(_texture);
            if (vid) { vid.pause(); vid.src = ""; vid.load(); }
            if (_sprite.parent) _sprite.parent.removeChild(_sprite);
            _sprite.destroy({ children: true, texture: true, baseTexture: true });
        } catch (e) { /* ignore */ }
        _sprite  = null;
        _texture = null;
        _state   = "idle";
    }

    // =========================================================================
    //  Core — onEnd
    // =========================================================================

    function _onMovieEnd(escaped) {
        if (_loop && !escaped) return;
        _waiting = false;
        _state   = "idle";
        if (_commonEventId > 0) $gameTemp.reserveCommonEvent(_commonEventId);
        if (escaped) clog("escaped");
        _destroySprite();
        _destroyHud();
    }

    // =========================================================================
    //  Core — opacity tick
    // =========================================================================

    function _updateOpacity() {
        if (!_sprite || _opacityDuration <= 0) return;
        _opacityElapsed++;
        const t       = Math.min(_opacityElapsed / _opacityDuration, 1);
        const current = _opacityStart + (_opacityTarget - _opacityStart) * t;
        _sprite.alpha = current / 255;
        if (t >= 1) {
            _opacityDuration = 0;
            if (_state === "stopping") _onMovieEnd(false);
        }
    }

    // =========================================================================
    //  Core — escape check
    // =========================================================================

    function _checkEscape() {
        if (!_waiting || !_escapable) return;
        if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
            clog("escape triggered");
            _waiting = false;
            if (_escapeFadeOut > 0) {
                _state           = "stopping";
                _opacityStart    = Math.round((_sprite ? _sprite.alpha : 1) * 255);
                _opacityTarget   = 0;
                _opacityDuration = _escapeFadeOut;
                _opacityElapsed  = 0;
            } else {
                _onMovieEnd(true);
            }
        }
    }

    // =========================================================================
    //  HUD — build
    // =========================================================================

    function _buildHud(cfg) {
        _destroyHud();

        const layer = _getHudLayer();
        if (!layer) { cwarn("HUD: __picoHudLayer not found"); return; }

        const iconSize   = _defaults.iconSize;
        const padX       = _defaults.paddingX;
        const padY       = _defaults.paddingY;
        const fadeDur    = _defaults.fadeDuration;
        const radius     = _defaults.cornerRadius;
        const marginBot  = _defaults.marginBottom;

        // Collect enabled actions in order
        const actionOrder = ["seekBack", "speedDown", "pause", "speedUp", "seekForward", "stop", "skip"];
        const buttons = [];
        for (const key of actionOrder) {
            const def = _defaults.actions[key];
            if (def && def.enabled) buttons.push({ key, def });
        }
        if (buttons.length === 0) return;

        const btnCount  = buttons.length;
        const barW      = btnCount * (iconSize + padX) + padX;
        const barH      = iconSize + padY * 2 + 16; // 16 for label
        const barX      = Math.round((Graphics.width - barW) / 2);
        const barY      = Graphics.height - barH - marginBot;

        // Container
        const container = new PIXI.Container();
        container.alpha = 0;

        // Background rounded rect via Graphics
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0);
        bg.drawRoundedRect(0, 0, barW, barH, radius);
        bg.endFill();

        // Draw bg color from CSS string — parse rgba manually
        const rgba = _parseCssColor(_defaults.bgColor);
        bg.clear();
        bg.beginFill(rgba.hex, rgba.alpha);
        bg.drawRoundedRect(0, 0, barW, barH, radius);
        bg.endFill();
        container.addChild(bg);

        // Icon bitmap (loaded once from IconSet.png)
        const iconBitmap = ImageManager.loadSystem("IconSet");

        _hudButtons = [];

        buttons.forEach((btn, i) => {
            const bx = padX + i * (iconSize + padX);
            const by = padY;

            // Icon sprite using a texture cropped from IconSet
            const iconSprite = new PIXI.Sprite();
            iconSprite.x = bx;
            iconSprite.y = by;
            iconSprite.width  = iconSize;
            iconSprite.height = iconSize;

            // We use a Canvas-drawn sprite to render the RPG Maker icon
            const iconCanvas  = document.createElement("canvas");
            iconCanvas.width  = iconSize;
            iconCanvas.height = iconSize;
            const ctx = iconCanvas.getContext("2d");

            // Draw icon once bitmap is loaded
            const drawIcon = () => {
                const cols = 16; // IconSet has 16 columns
                const iw   = ImageManager.iconWidth  || 32;
                const ih   = ImageManager.iconHeight || 32;
                const idx  = btn.def.iconIndex;
                const sx   = (idx % cols) * iw;
                const sy   = Math.floor(idx / cols) * ih;
                ctx.clearRect(0, 0, iconSize, iconSize);
                ctx.drawImage(iconBitmap._canvas || iconBitmap._image,
                    sx, sy, iw, ih, 0, 0, iconSize, iconSize);
                const tex = PIXI.Texture.fromBuffer(
                    new Uint8Array(ctx.getImageData(0, 0, iconSize, iconSize).data),
                    iconSize, iconSize
                );
                iconSprite.texture = tex;
            };

            if (iconBitmap.isReady()) {
                drawIcon();
            } else {
                iconBitmap.addLoadListener(drawIcon);
            }

            container.addChild(iconSprite);

            // Label
            const label = new PIXI.Text(btn.def.label, {
                fontSize  : 10,
                fill      : 0xffffff,
                align     : "center",
                dropShadow       : true,
                dropShadowBlur   : 3,
                dropShadowColor  : 0x000000,
                dropShadowAlpha  : 0.8,
                dropShadowDistance: 1,
            });
            label.anchor.set(0.5, 0);
            label.x = bx + iconSize / 2;
            label.y = by + iconSize + 2;
            container.addChild(label);

            _hudButtons.push({
                key         : btn.key,
                buttonIndex : btn.def.button,
                value       : btn.def.value,
                sprite      : iconSprite,
            });
        });

        container.x = barX;
        container.y = barY;
        layer.addChild(container);

        _hud        = container;
        _hudConfig  = cfg;
        _hudVisible = false;
        _hudAlpha   = 0;
        _hudTimeout = cfg.timeout || 180;
        _gpPrev     = {};

        // Show immediately if mode is "always"
        if ((cfg.mode || "always") === "always") {
            _showHud();
        }

        clog(`HUD built with ${buttons.length} button(s) mode:${cfg.mode || "always"}`);
    }

    // =========================================================================
    //  HUD — show / hide / destroy
    // =========================================================================

    function _showHud() {
        if (!_hud || _hudVisible) return;
        _hudVisible = true;
        _hudTimeout = (_hudConfig && _hudConfig.timeout) || 180;
    }

    function _hideHud() {
        if (!_hud || !_hudVisible) return;
        _hudVisible = false;
    }

    function _destroyHud() {
        if (!_hud) return;
        try {
            if (_hud.parent) _hud.parent.removeChild(_hud);
            _hud.destroy({ children: true });
        } catch (e) { /* ignore */ }
        _hud       = null;
        _hudConfig = null;
        _hudButtons = [];
        _gpPrev    = {};
    }

    // =========================================================================
    //  HUD — update (called every frame)
    // =========================================================================

    function _updateHud() {
        if (!_hud) return;

        const pad      = _getGamepad();
        const mode     = (_hudConfig && _hudConfig.mode) || "always";
        const fadeDur  = _defaults.fadeDuration || 1;

        // Auto-hide logic
        if (mode === "auto") {
            if (_anyButtonTriggered(pad)) {
                _showHud();
            } else if (_hudVisible && _hudTimeout > 0) {
                _hudTimeout--;
                if (_hudTimeout <= 0) _hideHud();
            }
        } else {
            // "always" — just read buttons without consuming wakeup
            _anyButtonTriggered(pad); // still update _gpPrev
        }

        // Fade alpha toward target
        const targetAlpha = _hudVisible ? 1 : 0;
        if (_hudAlpha < targetAlpha) {
            _hudAlpha = Math.min(_hudAlpha + 1 / fadeDur, 1);
        } else if (_hudAlpha > targetAlpha) {
            _hudAlpha = Math.max(_hudAlpha - 1 / fadeDur, 0);
        }
        _hud.alpha = _hudAlpha;

        // Process button actions (only while HUD is meaningfully visible)
        if (_hudAlpha > 0.1 && pad && _state !== "idle") {
            for (const btn of _hudButtons) {
                if (_isButtonTriggered(pad, btn.buttonIndex)) {
                    _executeHudAction(btn.key, btn.value);
                    // Reset timeout on action
                    _hudTimeout = (_hudConfig && _hudConfig.timeout) || 180;
                }
            }
        }
    }

    // =========================================================================
    //  HUD — execute action
    // =========================================================================

    function _executeHudAction(key, value) {
        clog(`HUD action: ${key}`);
        switch (key) {
            case "pause":
                if (_state === "paused") _resume(); else _pause();
                break;
            case "seekBack": {
                const vid = _getVideoElement(_texture);
                if (vid) vid.currentTime = Math.max(0, vid.currentTime - (value || 5));
                break;
            }
            case "seekForward": {
                const vid = _getVideoElement(_texture);
                if (vid && isFinite(vid.duration))
                    vid.currentTime = Math.min(vid.duration - 0.05, vid.currentTime + (value || 5));
                break;
            }
            case "speedDown": {
                const step = value || 0.25;
                const idx  = SPEED_STEPS.indexOf(_currentSpeed);
                const next = idx > 0 ? SPEED_STEPS[idx - 1] : SPEED_STEPS[0];
                _setSpeed(next);
                break;
            }
            case "speedUp": {
                const step = value || 0.25;
                const idx  = SPEED_STEPS.indexOf(_currentSpeed);
                const next = idx < SPEED_STEPS.length - 1 ? SPEED_STEPS[idx + 1] : SPEED_STEPS[SPEED_STEPS.length - 1];
                _setSpeed(next);
                break;
            }
            case "stop":
                _stop(30);
                break;
            case "skip":
                _skip();
                break;
        }
    }

    // =========================================================================
    //  Helpers — parse CSS color to PIXI hex + alpha
    // =========================================================================

    function _parseCssColor(css) {
        const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m) {
            const r = parseInt(m[1]);
            const g = parseInt(m[2]);
            const b = parseInt(m[3]);
            const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
            return { hex: (r << 16) | (g << 8) | b, alpha: a };
        }
        return { hex: 0x000000, alpha: 0.55 };
    }

    // =========================================================================
    //  API functions
    // =========================================================================

    function _play(filename, options = {}) {
        _destroySprite();
        _destroyHud();

        const loop          = !!options.loop;
        const wait          = options.wait !== undefined ? !!options.wait : true;
        const fadeIn        = options.fadeIn        || 0;
        const volume        = options.volume        !== undefined ? options.volume : 100;
        const escapable     = !!options.escapable;
        const escapeFadeOut = options.escapeFadeOut !== undefined ? options.escapeFadeOut : 30;
        const commonEventId = options.commonEventId || 0;
        const hud           = options.hud           || null;

        _loop          = loop;
        _wait          = wait;
        _escapable     = escapable;
        _escapeFadeOut = escapeFadeOut;
        _commonEventId = commonEventId;
        _waiting       = false;
        _currentSpeed  = 1.0;

        let texture;
        try      { texture = PIXI.Texture.from(`movies/${filename}.webm`); }
        catch (e) {
            try  { texture = PIXI.Texture.from(`movies/${filename}.mp4`);  }
            catch (e2) { cwarn(`play: could not load '${filename}'`); return; }
        }

        const sprite  = new PIXI.Sprite(texture);
        sprite.width  = Graphics.width;
        sprite.height = Graphics.height;

        if (fadeIn > 0) {
            sprite.alpha     = 0;
            _opacityStart    = 0;
            _opacityTarget   = 255;
            _opacityDuration = fadeIn;
            _opacityElapsed  = 0;
        } else {
            sprite.alpha = 1;
        }

        _sprite  = sprite;
        _texture = texture;
        _state   = "playing";

        const applySettings = () => {
            const vid = _getVideoElement(texture);
            if (!vid) return;
            vid.loop   = loop;
            vid.volume = Math.min(Math.max(volume / 100, 0), 1);
            vid.play().catch(() => {});
            if (!loop) {
                vid.addEventListener("ended", () => _onMovieEnd(false), { once: true });
            }
        };

        if (texture.baseTexture.valid) {
            applySettings();
        } else {
            texture.baseTexture.once("loaded", applySettings);
            texture.baseTexture.once("update",  applySettings);
        }

        const layer = _getLayer();
        if (layer) {
            layer.addChild(sprite);
        } else {
            const check = setInterval(() => {
                const l = _getLayer();
                if (l) { l.addChild(sprite); clearInterval(check); }
            }, 50);
        }

        // Build HUD if requested
        if (hud) {
            const hudLayer = _getHudLayer();
            if (hudLayer) {
                _buildHud(hud);
            } else {
                const check = setInterval(() => {
                    const l = _getHudLayer();
                    if (l) { _buildHud(hud); clearInterval(check); }
                }, 50);
            }
        }

        clog(`play '${filename}' loop:${loop} wait:${wait} fadeIn:${fadeIn} vol:${volume} escapable:${escapable} hud:${!!hud}`);
    }

    function _stop(fadeOut = 0) {
        if (!_sprite) return;
        _waiting = false;
        if (fadeOut > 0) {
            _state           = "stopping";
            _opacityStart    = Math.round(_sprite.alpha * 255);
            _opacityTarget   = 0;
            _opacityDuration = fadeOut;
            _opacityElapsed  = 0;
        } else {
            _onMovieEnd(false);
        }
        clog(`stop fadeOut:${fadeOut}`);
    }

    function _pause() {
        const vid = _getVideoElement(_texture);
        if (vid && !vid.paused) { vid.pause(); _state = "paused"; clog("pause"); }
    }

    function _resume() {
        const vid = _getVideoElement(_texture);
        if (vid && vid.paused) { vid.play().catch(() => {}); _state = "playing"; clog("resume"); }
    }

    function _setSpeed(rate) {
        const vid = _getVideoElement(_texture);
        if (vid) {
            vid.playbackRate = rate;
            _currentSpeed    = rate;
            clog(`setSpeed ${rate}`);
        }
    }

    function _setVolume(volume) {
        const vid = _getVideoElement(_texture);
        if (vid) { vid.volume = Math.min(Math.max(volume / 100, 0), 1); clog(`setVolume ${volume}`); }
    }

    function _setOpacity(opacity, duration = 0) {
        if (!_sprite) return;
        const clamped = Math.min(Math.max(opacity, 0), 255);
        if (duration > 0) {
            _opacityStart    = Math.round(_sprite.alpha * 255);
            _opacityTarget   = clamped;
            _opacityDuration = duration;
            _opacityElapsed  = 0;
        } else {
            _sprite.alpha    = clamped / 255;
            _opacityDuration = 0;
        }
        clog(`setOpacity ${opacity} duration:${duration}`);
    }

    function _seek(seconds) {
        const vid = _getVideoElement(_texture);
        if (vid) { vid.currentTime = seconds; clog(`seek ${seconds}s`); }
    }

    function _skip() {
        const vid = _getVideoElement(_texture);
        if (vid && isFinite(vid.duration)) { vid.currentTime = vid.duration - 0.05; clog("skip"); }
    }

    function _rewind() { _seek(0); clog("rewind"); }

    function _isPlaying() { return _state === "playing" || _state === "paused"; }

    // =========================================================================
    //  Plugin Commands
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "PlayMovie", function (args) {
        const loop    = args.loop === "true";
        const wait    = args.wait !== "false";
        const showHud = args.showHud === "true";

        // Build HUD config from plugin command args if requested
        const hud = showHud ? {
            mode   : String(args.hudMode    || "always"),
            timeout: Number(args.hudTimeout || 180),
            // actions come from Plugin Manager defaults
        } : null;

        _play(String(args.filename), {
            loop          : loop,
            wait          : wait,
            fadeIn        : Number(args.fadeIn)        || 0,
            volume        : Number(args.volume)        ?? 100,
            escapable     : args.escapable === "true",
            escapeFadeOut : Number(args.escapeFadeOut) ?? 30,
            commonEventId : Number(args.commonEventId) || 0,
            hud           : hud,
        });

        if (wait && _sprite) {
            _waiting       = true;
            this._waitMode = "picoMovie";
        }
    });

    PluginManager.registerCommand(PLUGIN_NAME, "StopMovie",   function (args) { _stop(Number(args.fadeOut) || 0); });
    PluginManager.registerCommand(PLUGIN_NAME, "PauseMovie",  function ()     { _pause();  });
    PluginManager.registerCommand(PLUGIN_NAME, "ResumeMovie", function ()     { _resume(); });
    PluginManager.registerCommand(PLUGIN_NAME, "ShowHud",     function ()     { _showHud(); });
    PluginManager.registerCommand(PLUGIN_NAME, "HideHud",     function ()     { _hideHud(); });

    PluginManager.registerCommand(PLUGIN_NAME, "SetMovieSpeed", function (args) {
        _setSpeed(Number(args.rate) || 1.0);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetMovieVolume", function (args) {
        _setVolume(Number(args.volume) ?? 100);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetMovieOpacity", function (args) {
        _setOpacity(Number(args.opacity) ?? 255, Number(args.duration) || 0);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SeekMovie", function (args) {
        _seek(Number(args.seconds) || 0);
    });

    // =========================================================================
    //  Game_Interpreter — wait mode "picoMovie"
    // =========================================================================

    const _pmp_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === "picoMovie") {
            if (_waiting) return true;
            this._waitMode = "";
            return false;
        }
        return _pmp_Game_Interpreter_updateWaitMode.call(this);
    };

    // =========================================================================
    //  Spriteset_Base — layers + update tick
    // =========================================================================

    const _pmp_Spriteset_Base_createPictures = Spriteset_Base.prototype.createPictures;
    Spriteset_Base.prototype.createPictures = function () {
        // Movie layer: below pictures
        this.__picoMovieLayer = new PIXI.Container();
        this.addChild(this.__picoMovieLayer);
        // Pictures
        _pmp_Spriteset_Base_createPictures.call(this);
        // HUD layer: above pictures, below windows
        this.__picoHudLayer = new PIXI.Container();
        this.addChild(this.__picoHudLayer);
    };

    const _pmp_Spriteset_Base_update = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function () {
        _pmp_Spriteset_Base_update.call(this);
        _updateOpacity();
        _checkEscape();
        _updateHud();
    };

    // =========================================================================
    //  Scene_Base — clean up on scene change
    // =========================================================================

    const _pmp_Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function () {
        _pmp_Scene_Base_terminate.call(this);
        _destroyHud();
        _destroySprite();
    };

    // =========================================================================
    //  Public API
    // =========================================================================

    const PICO = (window.PICO = window.PICO || {});
    PICO.MP = {
        play       : _play,
        stop       : _stop,
        pause      : _pause,
        resume     : _resume,
        setSpeed   : _setSpeed,
        setVolume  : _setVolume,
        setOpacity : _setOpacity,
        seek       : _seek,
        skip       : _skip,
        rewind     : _rewind,
        isPlaying  : _isPlaying,
        showHud    : _showHud,
        hideHud    : _hideHud,
    };

    // =========================================================================
    //  Init log
    // =========================================================================

    console.log(`[${PLUGIN_NAME}#${SERIES_NUM}] v${VERSION} loaded.`);

})();

//=============================================================================
// PICO ToolBox #8 — PICO_InputMapper.js  |  v1.0.0  |  2026-04-24
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v1.0.0| PICO ToolBox Collection #8 — Remap native MZ keys and register custom input symbols, all from the Plugin Manager.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #8 — PICO_InputMapper  v1.0.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * Two features in one plugin:
 *
 *   1. NATIVE REMAPS — reassign the keys that trigger MZ's built-in actions
 *      (ok, cancel, shift, menu, pageup, pagedown, up, down, left, right).
 *
 *   2. CUSTOM INPUTS — register any key as a free symbol in MZ's input system,
 *      and optionally call a Common Event or a named function when it is pressed.
 *
 * Everything is configured in the Plugin Manager — no code required.
 *
 * KEY CODES
 * ============================================================================
 * Use standard JavaScript KeyboardEvent.code values:
 *
 *   Letters    : KeyA, KeyB, KeyC … KeyZ
 *   Digits     : Digit0, Digit1 … Digit9
 *   Function   : F1, F2 … F12
 *   Numpad     : Numpad0 … Numpad9, NumpadEnter, NumpadAdd …
 *   Navigation : ArrowUp, ArrowDown, ArrowLeft, ArrowRight
 *                Home, End, PageUp, PageDown, Insert, Delete
 *   Common     : Enter, Space, Tab, Escape, Backspace
 *   Punctuation: Minus, Equal, BracketLeft, BracketRight, Semicolon,
 *                Quote, Backquote, Backslash, Comma, Period, Slash
 *
 * Codes are case-sensitive. Use the exact spelling above.
 *
 * NATIVE REMAPS
 * ============================================================================
 * Each entry in the Native Remaps list reassigns one MZ action to a new key.
 *
 *   Action   — the MZ input name to remap (ok, cancel, shift, menu, escape,
 *              pageup, pagedown, up, down, left, right).
 *   Key Code — the key that will trigger this action (e.g. Enter, KeyZ).
 *
 * Multiple entries can point to the same action (aliases are supported).
 * The original MZ defaults are fully replaced — only your configured keys
 * will trigger each action.
 *
 * CUSTOM INPUTS
 * ============================================================================
 * Each entry in the Custom Inputs list registers a new symbol in MZ's input
 * system and optionally fires a response when the key is pressed.
 *
 *   Key Code      — the physical key to listen for.
 *   Symbol        — the name registered in Input.keyMapper (e.g. sprint).
 *                   Use Input.isPressed('sprint') in scripts to read it.
 *   Common Event  — ID of a Common Event to call on key press (0 = none).
 *   Function Name — name of a global function to call on key press (optional).
 *                   The function must exist on window (e.g. window.myFunc).
 *
 * Common Event and Function can be used together or independently.
 * The response fires once per press (rising edge), not every frame.
 *
 * READING CUSTOM INPUTS IN SCRIPTS
 * ============================================================================
 * Once registered, any custom symbol works natively with MZ's input API:
 *
 *   Input.isPressed('sprint')    // true while the key is held
 *   Input.isTriggered('sprint')  // true on the first frame of press
 *   Input.isRepeated('sprint')   // true with auto-repeat
 *
 * PART OF PICO TOOLBOX
 * ============================================================================
 *   #1 — PICO Debug HUD              Real-time variable/switch monitor
 *   #2 — PICO Set Self Switches      Reliable self-switch controller
 *   #3 — PICO Keyboard+              Full-keyboard input bindings
 *   #4 — PICO Horizontal Title Menu  Modern horizontal title layout
 *   #5 — PICO Disable Menu           Game-flow controls
 *   #6 — PICO Loot                   Weighted random loot tables
 *   #7 — PICO Gamepad                Full gamepad manager
 *   #8 — PICO InputMapper            Native key remapping + custom symbols (this plugin)
 *
 * CHANGELOG
 * ============================================================================
 * v1.0.0 (2026-04-24)
 *   - Initial release.
 *   - Native Remaps: reassign any MZ action to any key via Plugin Manager.
 *   - Custom Inputs: register free symbols in Input.keyMapper.
 *   - Custom Inputs: optional Common Event dispatch on key press.
 *   - Custom Inputs: optional global function call on key press.
 *   - All responses fire on rising edge (once per press).
 *
 * LICENSE
 * ============================================================================
 * 1) May be used in personal or commercial projects, including adult content.
 * 2) Do not redistribute without the author's explicit permission.
 * 3) Do not use in projects promoting hate or discrimination.
 *
 * ============================================================================
 *
 * @param --- Native Remaps ---
 * @text ─────────────────────────────
 *
 * @param NativeRemaps
 * @text Native Remaps
 * @parent --- Native Remaps ---
 * @type struct<NativeRemap>[]
 * @default []
 * @desc Reassign MZ's built-in actions to different keys.
 *
 * @param --- Custom Inputs ---
 * @text ─────────────────────────────
 *
 * @param CustomInputs
 * @text Custom Inputs
 * @parent --- Custom Inputs ---
 * @type struct<CustomInput>[]
 * @default []
 * @desc Register new input symbols and optionally trigger a Common Event or function on press.
 *
 * @param --- General ---
 * @text ─────────────────────────────
 *
 * @param DebugMode
 * @text Debug Mode
 * @parent --- General ---
 * @type boolean
 * @default false
 * @desc Logs key events and mapper state to the browser console.
 */

/*~struct~NativeRemap:
 * @param Action
 * @text Action
 * @type select
 * @option ok
 * @option cancel
 * @option shift
 * @option menu
 * @option escape
 * @option pageup
 * @option pagedown
 * @option up
 * @option down
 * @option left
 * @option right
 * @default ok
 * @desc The MZ input action to remap.
 *
 * @param KeyCode
 * @text Key Code
 * @type string
 * @default
 * @desc The key that will trigger this action. Example: Enter, KeyZ, Space.
 */

/*~struct~CustomInput:
 * @param KeyCode
 * @text Key Code
 * @type string
 * @default
 * @desc The physical key to listen for. Example: KeyR, F5, ShiftLeft.
 *
 * @param Symbol
 * @text Symbol
 * @type string
 * @default
 * @desc Name registered in Input.keyMapper. Use Input.isPressed('symbol') in scripts.
 *
 * @param CommonEvent
 * @text Common Event
 * @type common_event
 * @default 0
 * @desc Common Event to call when this key is pressed. 0 = none.
 *
 * @param FunctionName
 * @text Function Name
 * @type string
 * @default
 * @desc Name of a global function (window.myFunc) to call on press. Leave blank to skip.
 */

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_InputMapper";
    const _raw        = PluginManager.parameters(PLUGIN_NAME) || {};

    const DEBUG = String(_raw["DebugMode"] ?? "false").toLowerCase() === "true";

    // =========================================================================
    //  Logging
    // =========================================================================

    const clog  = (...a) => { if (DEBUG) console.log(`[${PLUGIN_NAME}#8]`, ...a); };
    const cwarn = (...a) => { if (DEBUG) console.warn(`[${PLUGIN_NAME}#8]`, ...a); };

    // =========================================================================
    //  Parse structs
    // =========================================================================

    const parseStructArray = raw => {
        let arr;
        try { arr = JSON.parse(raw || "[]"); } catch { return []; }
        return arr.map(s => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
    };

    const parseNativeRemaps = rawArray => rawArray.map(r => ({
        action:  String(r["Action"]  || "").toLowerCase(),
        keyCode: String(r["KeyCode"] || ""),
    })).filter(r => r.action && r.keyCode);

    const parseCustomInputs = rawArray => rawArray.map(c => ({
        keyCode:      String(c["KeyCode"]      || ""),
        symbol:       String(c["Symbol"]       || ""),
        commonEvent:  parseInt(c["CommonEvent"]) || 0,
        functionName: String(c["FunctionName"] || ""),
    })).filter(c => c.keyCode && c.symbol);

    const NativeRemaps  = parseNativeRemaps(parseStructArray(_raw["NativeRemaps"]));
    const CustomInputs  = parseCustomInputs(parseStructArray(_raw["CustomInputs"]));

    clog("Native remaps:", NativeRemaps.map(r => `${r.keyCode} → ${r.action}`));
    clog("Custom inputs:", CustomInputs.map(c => `${c.keyCode} → '${c.symbol}'`));

    // =========================================================================
    //  Key code → MZ keyMapper index
    // =========================================================================
    //  MZ's Input.keyMapper uses KeyboardEvent.keyCode (numeric).
    //  We maintain a lookup from KeyboardEvent.code (string) to keyCode.
    // =========================================================================

    const CODE_TO_KEYCODE = {
        // Letters
        KeyA:32, KeyB:66, KeyC:67, KeyD:68, KeyE:69, KeyF:70, KeyG:71,
        KeyH:72, KeyI:73, KeyJ:74, KeyK:75, KeyL:76, KeyM:77, KeyN:78,
        KeyO:79, KeyP:80, KeyQ:81, KeyR:82, KeyS:83, KeyT:84, KeyU:85,
        KeyV:86, KeyW:87, KeyX:88, KeyY:89, KeyZ:90,
        // Digits
        Digit0:48, Digit1:49, Digit2:50, Digit3:51, Digit4:52,
        Digit5:53, Digit6:54, Digit7:55, Digit8:56, Digit9:57,
        // Function keys
        F1:112,  F2:113,  F3:114,  F4:115,  F5:116,  F6:117,
        F7:118,  F8:119,  F9:120,  F10:121, F11:122, F12:123,
        // Numpad
        Numpad0:96,  Numpad1:97,  Numpad2:98,  Numpad3:99,  Numpad4:100,
        Numpad5:101, Numpad6:102, Numpad7:103, Numpad8:104, Numpad9:105,
        NumpadEnter:13, NumpadAdd:107, NumpadSubtract:109,
        NumpadMultiply:106, NumpadDivide:111, NumpadDecimal:110,
        // Navigation
        ArrowUp:38, ArrowDown:40, ArrowLeft:37, ArrowRight:39,
        Home:36, End:35, PageUp:33, PageDown:34, Insert:45, Delete:46,
        // Common
        Enter:13, Space:32, Tab:9, Escape:27, Backspace:8,
        ShiftLeft:16, ShiftRight:16, ControlLeft:17, ControlRight:17,
        AltLeft:18, AltRight:18,
        // Punctuation
        Minus:189, Equal:187, BracketLeft:219, BracketRight:221,
        Semicolon:186, Quote:222, Backquote:192, Backslash:220,
        Comma:188, Period:190, Slash:191,
    };

    const resolveKeyCode = code => {
        const kc = CODE_TO_KEYCODE[code];
        if (kc === undefined) cwarn(`Unknown key code: "${code}"`);
        return kc;
    };

    // =========================================================================
    //  Apply native remaps to Input.keyMapper
    // =========================================================================

    const applyNativeRemaps = () => {
        // Clear existing mapper entries for every remapped action
        const actionsToReset = new Set(NativeRemaps.map(r => r.action));
        for (const [kc, action] of Object.entries(Input.keyMapper)) {
            if (actionsToReset.has(action)) delete Input.keyMapper[kc];
        }
        // Write new mappings
        for (const remap of NativeRemaps) {
            const kc = resolveKeyCode(remap.keyCode);
            if (kc !== undefined) {
                Input.keyMapper[kc] = remap.action;
                clog(`Native remap: ${remap.keyCode}(${kc}) → '${remap.action}'`);
            }
        }
    };

    // =========================================================================
    //  Register custom input symbols in Input.keyMapper
    // =========================================================================

    const applyCustomInputs = () => {
        for (const input of CustomInputs) {
            const kc = resolveKeyCode(input.keyCode);
            if (kc !== undefined) {
                Input.keyMapper[kc] = input.symbol;
                clog(`Custom input: ${input.keyCode}(${kc}) → '${input.symbol}'`);
            }
        }
    };

    applyNativeRemaps();
    applyCustomInputs();

    // =========================================================================
    //  Rising-edge dispatch for Common Events and function calls
    // =========================================================================

    const _prevState = {};  // symbol → boolean

    const _dispatchCustomInputs = () => {
        if (!$gameTemp) return;

        for (const input of CustomInputs) {
            const pressed    = Input.isPressed(input.symbol);
            const wasPressed = !!_prevState[input.symbol];

            if (pressed && !wasPressed) {
                // Common Event
                if (input.commonEvent > 0) {
                    $gameTemp.reserveCommonEvent(input.commonEvent);
                    clog(`Common Event ${input.commonEvent} reserved (key: ${input.keyCode})`);
                }
                // Global function
                if (input.functionName) {
                    const fn = window[input.functionName];
                    if (typeof fn === "function") {
                        try {
                            fn();
                            clog(`Function '${input.functionName}' called (key: ${input.keyCode})`);
                        } catch (e) {
                            console.error(`[${PLUGIN_NAME}#8] Error in '${input.functionName}':`, e);
                        }
                    } else {
                        cwarn(`Function '${input.functionName}' not found on window.`);
                    }
                }
            }

            _prevState[input.symbol] = pressed;
        }
    };

    // =========================================================================
    //  Hook into Scene_Map and Scene_Battle update loops
    // =========================================================================

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        _dispatchCustomInputs();
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _Scene_Battle_update.call(this);
        _dispatchCustomInputs();
    };

    // =========================================================================
    //  Public API
    // =========================================================================

    const PICO = (window.PICO = window.PICO || {});
    PICO.InputMapper = {
        /** Returns the resolved numeric keyCode for a given code string. */
        resolve: code => resolveKeyCode(code),
        /** Registers a custom symbol at runtime (does not add dispatch logic). */
        register: (keyCode, symbol) => {
            const kc = resolveKeyCode(keyCode);
            if (kc !== undefined) {
                Input.keyMapper[kc] = symbol;
                clog(`Runtime register: ${keyCode}(${kc}) → '${symbol}'`);
            }
        },
    };

    // =========================================================================
    //  Init log
    // =========================================================================

    console.log(`[${PLUGIN_NAME}#8] v1.0.0 loaded.`);

})();

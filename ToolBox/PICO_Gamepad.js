//=============================================================================
// PICO ToolBox #7 — PICO_Gamepad.js  |  v1.0.0  |  2026-04-24
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v1.0.0| PICO ToolBox Collection #7 — Full gamepad manager with button mapping, analog movement, rumble, and axis variables.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #7 — PICO_Gamepad  v1.0.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * Full gamepad support for RPG Maker MZ. Map every physical button to a native
 * MZ action, a Plugin Command, or both. Supports analog stick movement,
 * controller rumble (on supported browsers/devices), and axis mirroring to MZ
 * variables — no code required.
 *
 * BUTTON MAPPING
 * ============================================================================
 * Each entry in the Button Mappings list lets you configure one physical button:
 *
 *   Button Index    — physical index reported by the Gamepad API (0–19).
 *   Label           — display name for the Plugin Manager (informational only).
 *   Native Action   — MZ input action: ok, cancel, shift, menu, escape,
 *                     pageup, pagedown, up, down, left, right.
 *                     Leave blank to skip native mapping.
 *   Trigger Mode    — "press" fires once on button-down edge;
 *                     "hold"  fires every frame while held.
 *   Plugin Name     — exact name of the plugin that registered the command.
 *   Command Name    — exact name of the Plugin Command to call.
 *   Command Args    — JSON object with arguments. Example: {"intensity":"0.8"}
 *
 * A button can have a Native Action AND a Plugin Command at the same time.
 *
 * STANDARD BUTTON INDICES (Xbox / PlayStation)
 * ============================================================================
 *    0  A / Cross          8  Select / Share
 *    1  B / Circle         9  Start / Options
 *    2  X / Square        10  L3
 *    3  Y / Triangle      11  R3
 *    4  LB / L1           12  D-Pad Up
 *    5  RB / R1           13  D-Pad Down
 *    6  LT / L2           14  D-Pad Left
 *    7  RT / R2           15  D-Pad Right
 *
 * ANALOG STICKS
 * ============================================================================
 *   Axis 0 — Left  stick X   |   Axis 2 — Right stick X
 *   Axis 1 — Left  stick Y   |   Axis 3 — Right stick Y
 *
 * Values range from -1.0 to 1.0. Inputs below the Deadzone are treated as 0.
 * Enable "Analog Movement" to let the left stick move the player on the map.
 *
 * AXIS VARIABLES
 * ============================================================================
 * Assign an MZ variable to each axis. While a gamepad is active, that variable
 * is updated every frame with the axis value scaled to -100 ~ 100.
 * Set a variable to 0 to disable mirroring for that axis.
 *
 * RUMBLE
 * ============================================================================
 * Requires browser / platform support for the Vibration Actuator API.
 * "Rumble on Damage" automatically pulses the controller when a player actor
 * takes HP damage in battle. Intensity scales with damage dealt relative
 * to the actor's max HP.
 *
 * PLUGIN COMMAND — Vibrate
 * ============================================================================
 * Triggers a rumble effect on the active gamepad.
 *
 *   Intensity   — strength from 0.0 to 1.0.
 *   Duration    — length in milliseconds.
 *
 * PLUGIN COMMAND — SetDeadzone
 * ============================================================================
 * Changes the analog stick deadzone at runtime.
 *
 *   Value       — new deadzone threshold (0.01 – 0.99).
 *
 * PLUGIN COMMAND — MapButton
 * ============================================================================
 * Remaps a button at runtime without restarting the game.
 *
 *   Button Index    — physical index of the button to remap.
 *   Native Action   — new MZ action (or blank to clear).
 *   Plugin Name     — plugin that owns the command.
 *   Command Name    — name of the Plugin Command.
 *   Command Args    — JSON arguments string.
 *
 * PLUGIN COMMAND — ResetMapping
 * ============================================================================
 * Restores all button mappings to the values set in the Plugin Manager.
 *
 * PLUGIN COMMAND — ToggleButtons
 * ============================================================================
 * Enables or disables Plugin Command dispatching for all mapped buttons.
 * Native actions (MZ input) are not affected.
 *
 *   Enabled     — true to enable, false to disable.
 *
 * SCRIPT API
 * ============================================================================
 * PICO.Gamepad.getAxis(index)
 *   → Returns the current axis value (-1 ~ 1) after deadzone filtering.
 *
 * PICO.Gamepad.getButtonValue(index)
 *   → Returns the raw analog value of a button (0 ~ 1).
 *
 * PICO.Gamepad.isButtonPressed(index)
 *   → Returns true if the button is currently held down.
 *
 * PICO.Gamepad.vibrate(index, intensity, duration)
 *   → Triggers rumble on gamepad at `index` (undefined = active gamepad).
 *
 * Example:
 *   PICO.Gamepad.vibrate(undefined, 0.8, 400);
 *   const x = PICO.Gamepad.getAxis(0); // left stick X
 *
 * PART OF PICO TOOLBOX
 * ============================================================================
 *   #1 — PICO Debug HUD              Real-time variable/switch monitor
 *   #2 — PICO Set Self Switches      Reliable self-switch controller
 *   #3 — PICO Keyboard+              Full-keyboard input bindings
 *   #4 — PICO Horizontal Title Menu  Modern horizontal title layout
 *   #5 — PICO Disable Menu           Game-flow controls
 *   #6 — PICO Loot                   Weighted random loot tables
 *   #7 — PICO Gamepad                Full gamepad manager (this plugin)
 *
 * CHANGELOG
 * ============================================================================
 * v1.0.0 (2026-04-24)
 *   - Initial release.
 *   - Full button mapping: native actions + Plugin Command dispatch.
 *   - Analog stick movement on the map with configurable threshold.
 *   - Rumble support (dual-rumble and pulse actuator types).
 *   - Automatic rumble on actor HP damage.
 *   - Axis values mirrored to MZ variables (-100 ~ 100).
 *   - Runtime commands: Vibrate, SetDeadzone, MapButton, ResetMapping, ToggleButtons.
 *   - Public API under PICO.Gamepad.
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
 * @desc Logs gamepad state and command dispatches to the browser console.
 *
 * @param EnableAnalogMove
 * @text Analog Movement
 * @parent --- General ---
 * @type boolean
 * @default true
 * @desc Allow the left analog stick to move the player on the map.
 *
 * @param AnalogMoveThreshold
 * @text Analog Move Threshold
 * @parent --- General ---
 * @type number
 * @decimals 2
 * @min 0.10
 * @max 1.00
 * @default 0.50
 * @desc Minimum axis value required to trigger player movement.
 *
 * @param Deadzone
 * @text Deadzone
 * @parent --- General ---
 * @type number
 * @decimals 2
 * @min 0.01
 * @max 0.99
 * @default 0.20
 * @desc Axis inputs below this threshold are treated as 0.
 *
 * @param AnalogSensitivity
 * @text Analog Sensitivity
 * @parent --- General ---
 * @type number
 * @decimals 2
 * @min 0.10
 * @max 3.00
 * @default 1.00
 * @desc Multiplier applied to raw axis values before deadzone filtering.
 *
 * @param --- Rumble ---
 * @text ─────────────────────────────
 *
 * @param EnableRumble
 * @text Enable Rumble
 * @parent --- Rumble ---
 * @type boolean
 * @default true
 * @desc Enable controller rumble/vibration (requires browser support).
 *
 * @param RumbleOnDamage
 * @text Rumble on Damage
 * @parent --- Rumble ---
 * @type boolean
 * @default true
 * @desc Automatically rumble when a player actor takes HP damage in battle.
 *
 * @param RumbleIntensity
 * @text Default Intensity
 * @parent --- Rumble ---
 * @type number
 * @decimals 2
 * @min 0.10
 * @max 1.00
 * @default 0.70
 * @desc Default rumble strength used when no intensity is specified.
 *
 * @param RumbleDuration
 * @text Default Duration (ms)
 * @parent --- Rumble ---
 * @type number
 * @min 50
 * @max 2000
 * @default 300
 * @desc Default rumble length in milliseconds.
 *
 * @param --- Button Mapping ---
 * @text ─────────────────────────────
 *
 * @param ButtonMappings
 * @text Button Mappings
 * @parent --- Button Mapping ---
 * @type struct<ButtonMap>[]
 * @default ["{\"ButtonIndex\":\"0\",\"Label\":\"A / Cross\",\"NativeAction\":\"ok\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"1\",\"Label\":\"B / Circle\",\"NativeAction\":\"cancel\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"2\",\"Label\":\"X / Square\",\"NativeAction\":\"shift\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"3\",\"Label\":\"Y / Triangle\",\"NativeAction\":\"menu\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"4\",\"Label\":\"LB / L1\",\"NativeAction\":\"pageup\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"5\",\"Label\":\"RB / R1\",\"NativeAction\":\"pagedown\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"6\",\"Label\":\"LT / L2\",\"NativeAction\":\"\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"7\",\"Label\":\"RT / R2\",\"NativeAction\":\"\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"8\",\"Label\":\"Select / Share\",\"NativeAction\":\"\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"9\",\"Label\":\"Start / Options\",\"NativeAction\":\"escape\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"10\",\"Label\":\"L3\",\"NativeAction\":\"\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"11\",\"Label\":\"R3\",\"NativeAction\":\"\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"12\",\"Label\":\"D-Pad Up\",\"NativeAction\":\"up\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"13\",\"Label\":\"D-Pad Down\",\"NativeAction\":\"down\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"14\",\"Label\":\"D-Pad Left\",\"NativeAction\":\"left\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}","{\"ButtonIndex\":\"15\",\"Label\":\"D-Pad Right\",\"NativeAction\":\"right\",\"TriggerMode\":\"press\",\"PluginName\":\"\",\"CommandName\":\"\",\"CommandArgs\":\"{}\"}"]
 * @desc One entry per button. Each button can have a Native Action and/or a Plugin Command.
 *
 * @param --- Axis Variables ---
 * @text ─────────────────────────────
 *
 * @param AxisLeftXVar
 * @text Variable → Left Stick X
 * @parent --- Axis Variables ---
 * @type variable
 * @default 0
 * @desc MZ variable that mirrors Left Stick X (-100 ~ 100). Set to 0 to disable.
 *
 * @param AxisLeftYVar
 * @text Variable → Left Stick Y
 * @parent --- Axis Variables ---
 * @type variable
 * @default 0
 * @desc MZ variable that mirrors Left Stick Y (-100 ~ 100). Set to 0 to disable.
 *
 * @param AxisRightXVar
 * @text Variable → Right Stick X
 * @parent --- Axis Variables ---
 * @type variable
 * @default 0
 * @desc MZ variable that mirrors Right Stick X (-100 ~ 100). Set to 0 to disable.
 *
 * @param AxisRightYVar
 * @text Variable → Right Stick Y
 * @parent --- Axis Variables ---
 * @type variable
 * @default 0
 * @desc MZ variable that mirrors Right Stick Y (-100 ~ 100). Set to 0 to disable.
 *
 * @command Vibrate
 * @text Vibrate
 * @desc Trigger a rumble effect on the active gamepad.
 *
 * @arg Intensity
 * @text Intensity (0.0 – 1.0)
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 1.00
 * @default 0.70
 * @desc Rumble strength.
 *
 * @arg Duration
 * @text Duration (ms)
 * @type number
 * @min 50
 * @max 3000
 * @default 300
 * @desc Rumble length in milliseconds.
 *
 * @command SetDeadzone
 * @text Set Deadzone
 * @desc Change the analog stick deadzone at runtime.
 *
 * @arg Value
 * @text Value (0.01 – 0.99)
 * @type number
 * @decimals 2
 * @min 0.01
 * @max 0.99
 * @default 0.20
 * @desc New deadzone threshold.
 *
 * @command MapButton
 * @text Map Button
 * @desc Remap a button at runtime without restarting the game.
 *
 * @arg ButtonIndex
 * @text Button Index
 * @type number
 * @min 0
 * @max 19
 * @default 0
 * @desc Physical index of the button to remap.
 *
 * @arg NativeAction
 * @text Native Action
 * @type select
 * @option (none)
 * @value
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
 * @default
 * @desc New MZ input action for this button. Leave blank to clear.
 *
 * @arg PluginName
 * @text Plugin Name
 * @type string
 * @default
 * @desc Exact name of the plugin that registered the command.
 *
 * @arg CommandName
 * @text Command Name
 * @type string
 * @default
 * @desc Exact name of the Plugin Command to call.
 *
 * @arg CommandArgs
 * @text Command Args (JSON)
 * @type string
 * @default {}
 * @desc Arguments passed to the command. Example: {"intensity":"0.8","duration":"500"}
 *
 * @command ResetMapping
 * @text Reset Mapping
 * @desc Restore all button mappings to the values set in the Plugin Manager.
 *
 * @command ToggleButtons
 * @text Toggle Buttons
 * @desc Enable or disable Plugin Command dispatching for all mapped buttons.
 *
 * @arg Enabled
 * @text Enabled
 * @type boolean
 * @default true
 * @desc true = buttons dispatch commands; false = buttons are silent.
 */

/*~struct~ButtonMap:
 * @param ButtonIndex
 * @text Button Index
 * @type number
 * @min 0
 * @max 19
 * @default 0
 * @desc Physical button index as reported by the Gamepad API (0–19).
 *
 * @param Label
 * @text Label (informational)
 * @type string
 * @default Button
 * @desc Display name shown in the Plugin Manager. Does not affect gameplay.
 *
 * @param NativeAction
 * @text Native MZ Action
 * @type select
 * @option (none)
 * @value
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
 * @default
 * @desc MZ input action mapped to this button. Can be combined with a Plugin Command.
 *
 * @param TriggerMode
 * @text Trigger Mode
 * @type select
 * @option Press (once on button-down)
 * @value press
 * @option Hold (every frame while held)
 * @value hold
 * @default press
 * @desc "press" fires on the rising edge; "hold" fires every frame while the button is down.
 *
 * @param PluginName
 * @text Plugin Name
 * @type string
 * @default
 * @desc Exact name of the plugin that registered the command. E.g. PICO_Loot
 *
 * @param CommandName
 * @text Command Name
 * @type string
 * @default
 * @desc Exact name of the Plugin Command to call. Leave blank to skip.
 *
 * @param CommandArgs
 * @text Command Args (JSON)
 * @type string
 * @default {}
 * @desc Arguments passed to the command as a JSON object. E.g. {"intensity":"0.8"}
 */

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_Gamepad";
    const _raw        = PluginManager.parameters(PLUGIN_NAME) || {};

    const DEBUG = String(_raw["DebugMode"] ?? "false").toLowerCase() === "true";

    // =========================================================================
    //  Logging
    // =========================================================================

    const clog  = (...a) => { if (DEBUG) console.log(`[${PLUGIN_NAME}#7]`, ...a); };
    const cwarn = (...a) => { if (DEBUG) console.warn(`[${PLUGIN_NAME}#7]`, ...a); };

    // =========================================================================
    //  Parse parameters
    // =========================================================================

    const parseStructArray = raw => {
        let arr;
        try { arr = JSON.parse(raw || "[]"); } catch { return []; }
        return arr.map(s => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
    };

    const parseMappings = rawArray => rawArray.map(b => ({
        buttonIndex:  parseInt(b["ButtonIndex"])  || 0,
        label:        String(b["Label"]           || "Button"),
        nativeAction: String(b["NativeAction"]    || ""),
        triggerMode:  String(b["TriggerMode"]     || "press"),
        pluginName:   String(b["PluginName"]      || ""),
        commandName:  String(b["CommandName"]     || ""),
        commandArgs:  String(b["CommandArgs"]     || "{}"),
    }));

    const Config = {
        debugMode:           DEBUG,
        enableAnalogMove:    String(_raw["EnableAnalogMove"]    ?? "true").toLowerCase()  === "true",
        analogMoveThreshold: parseFloat(_raw["AnalogMoveThreshold"]) || 0.50,
        deadzone:            parseFloat(_raw["Deadzone"])            || 0.20,
        sensitivity:         parseFloat(_raw["AnalogSensitivity"])   || 1.00,
        enableRumble:        String(_raw["EnableRumble"]    ?? "true").toLowerCase()  === "true",
        rumbleOnDamage:      String(_raw["RumbleOnDamage"]  ?? "true").toLowerCase()  === "true",
        rumbleIntensity:     parseFloat(_raw["RumbleIntensity"]) || 0.70,
        rumbleDuration:      parseInt(_raw["RumbleDuration"])   || 300,
        axisVars: {
            leftX:  parseInt(_raw["AxisLeftXVar"])  || 0,
            leftY:  parseInt(_raw["AxisLeftYVar"])  || 0,
            rightX: parseInt(_raw["AxisRightXVar"]) || 0,
            rightY: parseInt(_raw["AxisRightYVar"]) || 0,
        },
    };

    // =========================================================================
    //  Button mappings + native input mapper
    // =========================================================================

    let ButtonMappings = parseMappings(parseStructArray(_raw["ButtonMappings"]));
    let buttonsEnabled = true;

    const applyNativeMapper = () => {
        const mapper = {};
        for (const map of ButtonMappings) {
            if (map.nativeAction) mapper[map.buttonIndex] = map.nativeAction;
        }
        Input.gamepadMapper = mapper;
    };
    applyNativeMapper();

    clog("Mappings loaded:", ButtonMappings.map(m => `${m.label}(${m.buttonIndex})`));

    // =========================================================================
    //  Gamepad core
    // =========================================================================

    const _Gamepad = {
        _gamepads:    [],
        _prevPressed: {},
        _connected:   false,
        _activeIndex: 0,

        initialize() {
            window.addEventListener("gamepadconnected", e => {
                this._connected = true;
                this._gamepads[e.gamepad.index] = e.gamepad;
                clog(`Connected: "${e.gamepad.id}" (index ${e.gamepad.index})`);
                if (Config.enableRumble) this.vibrate(e.gamepad.index, 0.3, 150);
            });

            window.addEventListener("gamepaddisconnected", e => {
                this._gamepads[e.gamepad.index] = null;
                this._connected = this._gamepads.some(g => !!g);
                clog(`Disconnected: "${e.gamepad.id}"`);
            });
        },

        update() {
            const raw = navigator.getGamepads ? navigator.getGamepads() : [];
            for (let i = 0; i < raw.length; i++) {
                if (raw[i]) this._gamepads[i] = raw[i];
            }
        },

        getActive() {
            return this._gamepads[this._activeIndex] || null;
        },

        isButtonPressed(idx) {
            const gp = this.getActive();
            if (!gp || !gp.buttons[idx]) return false;
            const b = gp.buttons[idx];
            return typeof b === "object" ? b.pressed : b > 0.5;
        },

        getButtonValue(idx) {
            const gp = this.getActive();
            if (!gp || !gp.buttons[idx]) return 0;
            const b = gp.buttons[idx];
            return typeof b === "object" ? b.value : b;
        },

        getAxis(axisIndex) {
            const gp = this.getActive();
            if (!gp || gp.axes[axisIndex] === undefined) return 0;
            const raw = gp.axes[axisIndex] * Config.sensitivity;
            return Math.abs(raw) < Config.deadzone ? 0 : raw;
        },

        vibrate(index, intensity, duration) {
            if (!Config.enableRumble) return;
            const gpIndex = index !== undefined ? index : this._activeIndex;
            const gp      = this._gamepads[gpIndex];
            if (!gp || !gp.vibrationActuator) return;
            const i = intensity !== undefined ? intensity : Config.rumbleIntensity;
            const d = duration  !== undefined ? duration  : Config.rumbleDuration;
            try {
                if (gp.vibrationActuator.type === "dual-rumble") {
                    gp.vibrationActuator.playEffect("dual-rumble", {
                        startDelay: 0, duration: d,
                        weakMagnitude: i * 0.5, strongMagnitude: i,
                    });
                } else {
                    gp.vibrationActuator.pulse(i, d);
                }
            } catch (e) {
                cwarn("Rumble not supported:", e);
            }
        },

        // -------------------------------------------------------------------------
        //  Plugin Command dispatch per button
        // -------------------------------------------------------------------------

        processButtonCommands() {
            if (!buttonsEnabled) return;

            for (const map of ButtonMappings) {
                if (!map.pluginName || !map.commandName) continue;

                const pressed    = this.isButtonPressed(map.buttonIndex);
                const wasPressed = !!this._prevPressed[map.buttonIndex];
                const shouldFire = map.triggerMode === "hold"
                    ? pressed
                    : (pressed && !wasPressed);

                if (shouldFire) this._dispatchCommand(map.pluginName, map.commandName, map.commandArgs);

                this._prevPressed[map.buttonIndex] = pressed;
            }
        },

        _dispatchCommand(pluginName, commandName, argsJson) {
            let args = {};
            try { args = JSON.parse(argsJson); } catch { /* invalid JSON — use empty args */ }

            const handler = PluginManager._commands
                         && PluginManager._commands[pluginName]
                         && PluginManager._commands[pluginName][commandName];

            if (handler) {
                try {
                    handler.call(null, args);
                    clog(`▶ ${pluginName}:${commandName}`, args);
                } catch (e) {
                    console.error(`[${PLUGIN_NAME}#7] Error in ${pluginName}:${commandName}`, e);
                }
            } else {
                cwarn(`Command not found → ${pluginName}:${commandName}`);
            }
        },

        debugLog() {
            const gp = this.getActive();
            if (!gp) return;
            const axes = Array.from(gp.axes).map(v => v.toFixed(2)).join(", ");
            const btns = gp.buttons.map((b, i) => (b.pressed ? i : null)).filter(v => v !== null).join(", ");
            clog(`Axes:[${axes}]  Buttons:[${btns || "—"}]`);
        },
    };

    // =========================================================================
    //  Analog movement on the map
    // =========================================================================

    const _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function () {
        if (!Config.enableAnalogMove) {
            return _Game_Player_moveByInput.call(this);
        }
        const axisX = _Gamepad.getAxis(0);
        const axisY = _Gamepad.getAxis(1);
        const thr   = Config.analogMoveThreshold;

        if ((Math.abs(axisX) >= thr || Math.abs(axisY) >= thr) && !this.isMoving() && this.canMove()) {
            this.moveStraight(
                Math.abs(axisY) > Math.abs(axisX)
                    ? (axisY > 0 ? 2 : 8)
                    : (axisX > 0 ? 6 : 4)
            );
            return;
        }
        _Game_Player_moveByInput.call(this);
    };

    // =========================================================================
    //  Axis variable mirroring
    // =========================================================================

    const _updateAxisVariables = () => {
        if (!$gameVariables) return;
        const v = Config.axisVars;
        if (v.leftX  > 0) $gameVariables.setValue(v.leftX,  Math.round(_Gamepad.getAxis(0) * 100));
        if (v.leftY  > 0) $gameVariables.setValue(v.leftY,  Math.round(_Gamepad.getAxis(1) * 100));
        if (v.rightX > 0) $gameVariables.setValue(v.rightX, Math.round(_Gamepad.getAxis(2) * 100));
        if (v.rightY > 0) $gameVariables.setValue(v.rightY, Math.round(_Gamepad.getAxis(3) * 100));
    };

    // =========================================================================
    //  Main update loop (map + battle)
    // =========================================================================

    const _mainUpdate = () => {
        _Gamepad.update();
        _Gamepad.processButtonCommands();
        _updateAxisVariables();
        if (DEBUG) _Gamepad.debugLog();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function () {
        _Scene_Map_update.call(this);
        _mainUpdate();
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        _Scene_Battle_update.call(this);
        _mainUpdate();
    };

    // =========================================================================
    //  Rumble on actor HP damage
    // =========================================================================

    if (Config.rumbleOnDamage) {
        const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
        Game_Battler.prototype.gainHp = function (value) {
            _Game_Battler_gainHp.call(this, value);
            if (value < 0 && this.isActor()) {
                const intensity = Math.min(Config.rumbleIntensity, Math.abs(value) / (this.mhp || 100) * 2);
                _Gamepad.vibrate(undefined, Math.max(0.2, intensity), Config.rumbleDuration);
            }
        };
    }

    // =========================================================================
    //  Plugin Command — Vibrate
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "Vibrate", args => {
        const intensity = parseFloat(args["Intensity"]) || Config.rumbleIntensity;
        const duration  = parseInt(args["Duration"])    || Config.rumbleDuration;
        _Gamepad.vibrate(undefined, intensity, duration);
        clog(`Vibrate: intensity=${intensity} duration=${duration}`);
    });

    // =========================================================================
    //  Plugin Command — SetDeadzone
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "SetDeadzone", args => {
        Config.deadzone = Math.max(0.01, Math.min(0.99, parseFloat(args["Value"]) || 0.20));
        clog(`Deadzone → ${Config.deadzone}`);
    });

    // =========================================================================
    //  Plugin Command — MapButton
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "MapButton", args => {
        const idx = parseInt(args["ButtonIndex"]) || 0;
        let map   = ButtonMappings.find(m => m.buttonIndex === idx);

        if (!map) {
            map = { buttonIndex: idx, label: `Button ${idx}`, nativeAction: "",
                    triggerMode: "press", pluginName: "", commandName: "", commandArgs: "{}" };
            ButtonMappings.push(map);
        }

        if (args["NativeAction"] !== undefined) map.nativeAction = String(args["NativeAction"]);
        if (args["PluginName"]   !== undefined) map.pluginName   = String(args["PluginName"]);
        if (args["CommandName"]  !== undefined) map.commandName  = String(args["CommandName"]);
        if (args["CommandArgs"]  !== undefined) map.commandArgs  = String(args["CommandArgs"]);

        applyNativeMapper();
        clog(`Button ${idx} remapped:`, map);
    });

    // =========================================================================
    //  Plugin Command — ResetMapping
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "ResetMapping", () => {
        ButtonMappings = parseMappings(parseStructArray(_raw["ButtonMappings"]));
        applyNativeMapper();
        clog("Mapping reset to Plugin Manager defaults.");
    });

    // =========================================================================
    //  Plugin Command — ToggleButtons
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "ToggleButtons", args => {
        buttonsEnabled = String(args["Enabled"] ?? "true").toLowerCase() === "true";
        clog(`Button commands ${buttonsEnabled ? "ON" : "OFF"}`);
    });

    // =========================================================================
    //  Public API
    // =========================================================================

    const PICO = (window.PICO = window.PICO || {});
    PICO.Gamepad = {
        getAxis:          idx => _Gamepad.getAxis(idx),
        getButtonValue:   idx => _Gamepad.getButtonValue(idx),
        isButtonPressed:  idx => _Gamepad.isButtonPressed(idx),
        vibrate: (index, intensity, duration) => _Gamepad.vibrate(index, intensity, duration),
    };

    // =========================================================================
    //  Init
    // =========================================================================

    _Gamepad.initialize();

    console.log(`[${PLUGIN_NAME}#7] v1.0.0 loaded.`);

})();

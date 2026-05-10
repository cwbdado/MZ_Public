//=============================================================================
// PICO ToolBox #9 — PICO_TextInput_MZ.js  |  v1.2.0  |  2026-04-25
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v1.2.0| PICO ToolBox Collection #9 — Native keyboard text and number input for PC, browser and mobile.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #9 — PICO_TextInput_MZ  v1.2.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * Replaces RPG Maker MZ's letter-grid name input with a real keyboard field.
 * The player types naturally on PC/browser. On mobile, the OS keyboard opens
 * automatically and the scene slides up to stay visible above it.
 *
 * Works transparently with the "Change Name" event command — no changes
 * needed in your events. Also exposes Plugin Commands and a JS API so any
 * other plugin or event can open a text or number input anywhere.
 *
 * SCENE_NAME INTEGRATION
 * ============================================================================
 * When OverrideSceneName is ON (default), the native letter-grid is replaced
 * automatically. The actor name is saved exactly as the engine would.
 *
 * PLUGIN COMMAND — OpenTextInput
 * ============================================================================
 * Opens a text input field and saves the result to a game variable.
 *
 *   variableId    — Variable to store the typed text.
 *   maxLength     — Character limit (0 = use DefaultMaxLength).
 *   initialValue  — Pre-filled text (optional).
 *   promptText    — Label shown above the field (optional).
 *   waitForInput  — If ON, the event waits until the player confirms.
 *   posX / posY   — Position in pixels or % (e.g. 400 or 50%).
 *   anchor        — center or top-left.
 *
 * PLUGIN COMMAND — OpenNumberInput
 * ============================================================================
 * Opens a numeric input field. Result is saved as a number in a variable.
 *
 *   variableId    — Variable to store the number.
 *   numberType    — integer | signed | decimal.
 *   minValue      — Minimum value. Accepts literals or JS expressions:
 *                     0  /  $gameParty.gold()  /  $gameVariables.value(3)
 *                   Evaluated at confirm time. Leave blank = no minimum.
 *   maxValue      — Maximum value. Same format as minValue.
 *   decimalPlaces — Max decimal places (decimal type only, 0 = unlimited).
 *   decimalSep    — Decimal separator: . or ,
 *   maxLength     — Character limit for the raw input string.
 *   initialValue  — Pre-filled number (optional, accepts JS expressions).
 *   promptText    — Label shown above the field (optional).
 *   waitForInput  — If ON, the event waits until the player confirms.
 *   errorInvalid  — Custom message when input is not a valid number.
 *   errorMin      — Custom message when value is below minimum.
 *   errorMax      — Custom message when value is above maximum.
 *                   Placeholders: {value} {min} {max} {name}
 *   posX / posY   — Position in pixels or % (e.g. 400 or 50%).
 *   anchor        — center or top-left.
 *
 *   On out-of-range: field shakes and shows the resolved error message.
 *   The player must correct before confirming.
 *
 * SCRIPT API
 * ============================================================================
 * PICO.TextInput.open({ variableId, maxLength, allowed, initial, prompt,
 *                        x, y, anchor, onConfirm, onCancel, onChange });
 *
 * PICO.TextInput.openNumber({
 *   variableId, numberType, min, max, decimalPlaces, decimalSep,
 *   maxLength, initial, prompt, x, y, anchor,
 *   errorInvalid, errorMin, errorMax, onConfirm, onCancel
 * });
 *   min / max accept: number | string expression | () => expression
 *
 * PICO.TextInput.close();      // close and discard
 * PICO.TextInput.confirm();    // confirm programmatically
 * PICO.TextInput.current();    // read current typed value
 * PICO.TextInput.isActive();   // true while a field is open
 *
 * PART OF PICO TOOLBOX
 * ============================================================================
 *   #1 — PICO Debug HUD              Real-time variable/switch monitor
 *   #2 — PICO Set Self Switches      Reliable self-switch controller
 *   #3 — PICO Keyboard+              Full-keyboard input bindings
 *   #4 — PICO Horizontal Title Menu  Modern horizontal title layout
 *   #5 — PICO Disable Menu           Game-flow controls
 *   #6 — PICO Loot                   Weighted random loot tables
 *   #7 — PICO Gamepad                Full gamepad support
 *   #8 — PICO InputMapper            Native input remapping
 *   #9 — PICO Text Input             Keyboard text/number input (this plugin)
 *
 * CHANGELOG
 * ============================================================================
 * v1.2.0 (2026-04-25)
 *   - min/max now accept JS expressions evaluated at confirm time.
 *   - API: min/max accept Function, number or string expression.
 *   - Plugin Command: minValue/maxValue accept JS expressions.
 *   - posX/posY/anchor configurable per command and in Plugin Manager.
 *
 * v1.1.0 (2026-04-25)
 *   - New: OpenNumberInput plugin command.
 *   - Number types: integer, signed, decimal.
 *   - Min/max validation with shake + error feedback.
 *   - Configurable decimal places and separator.
 *   - Custom error messages with placeholders.
 *   - PICO.TextInput.openNumber() JS API.
 *
 * v1.0.0 (2026-04-25)
 *   - Initial release.
 *   - Real keyboard input on PC, browser and mobile.
 *   - Auto-scroll on mobile keyboard open.
 *   - Scene_Name override.
 *   - Plugin Command + JS API.
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
 * @param OverrideSceneName
 * @text Override Name Input Scene
 * @parent --- General ---
 * @type boolean
 * @default true
 * @desc Replace the native letter-grid with the keyboard input field.
 *
 * @param DebugMode
 * @text Debug Mode
 * @parent --- General ---
 * @type boolean
 * @default false
 * @desc Log internal events to the console.
 *
 * @param --- Text Input ---
 * @text ─────────────────────────────
 *
 * @param DefaultMaxLength
 * @text Default Max Length
 * @parent --- Text Input ---
 * @type number
 * @min 1
 * @max 64
 * @default 16
 * @desc Maximum characters allowed when no explicit limit is given.
 *
 * @param AllowedChars
 * @text Allowed Characters (regex)
 * @parent --- Text Input ---
 * @type string
 * @default [^\x00-\x1F]
 * @desc Regex pattern for allowed characters. Default: all printable chars.
 *
 * @param ConfirmOnEnter
 * @text Confirm on Enter
 * @parent --- Text Input ---
 * @type boolean
 * @default true
 * @desc Pressing Enter confirms the input.
 *
 * @param CancelOnEscape
 * @text Cancel on Escape
 * @parent --- Text Input ---
 * @type boolean
 * @default true
 * @desc Pressing Escape cancels and closes without saving.
 *
 * @param ShowCharCounter
 * @text Show Character Counter
 * @parent --- Text Input ---
 * @type boolean
 * @default true
 * @desc Show remaining characters below the input field.
 *
 * @param --- Position ---
 * @text ─────────────────────────────
 *
 * @param DefaultX
 * @text Default X Position
 * @parent --- Position ---
 * @type string
 * @default 50%
 * @desc Default horizontal position. Pixels (ex: 400) or percentage (ex: 50%).
 *
 * @param DefaultY
 * @text Default Y Position
 * @parent --- Position ---
 * @type string
 * @default 50%
 * @desc Default vertical position. Pixels (ex: 300) or percentage (ex: 50%).
 *
 * @param DefaultAnchor
 * @text Default Anchor
 * @parent --- Position ---
 * @type select
 * @option Center — X/Y point to the center of the field
 * @value center
 * @option Top-Left — X/Y point to the top-left corner of the field
 * @value top-left
 * @default center
 * @desc Which point of the field the X/Y coordinates refer to.
 *
 * @param --- Number Input ---
 * @text ─────────────────────────────
 *
 * @param ErrorInvalid
 * @text Error — Invalid Number
 * @parent --- Number Input ---
 * @type string
 * @default Please enter a valid number.
 * @desc Default message when the field is empty or not a valid number.
 *
 * @param ErrorMin
 * @text Error — Below Minimum
 * @parent --- Number Input ---
 * @type string
 * @default Minimum value: {min}
 * @desc Default message when value is below the minimum.
 *       Placeholders: {value} {min} {max} {name}
 *
 * @param ErrorMax
 * @text Error — Above Maximum
 * @parent --- Number Input ---
 * @type string
 * @default Maximum value: {max}
 * @desc Default message when value is above the maximum.
 *       Placeholders: {value} {min} {max} {name}
 *
 * @command OpenTextInput
 * @text Open Text Input
 * @desc Opens a keyboard input field and stores the result in a variable.
 *
 * @arg variableId
 * @text Variable ID
 * @type variable
 * @default 1
 * @desc Game variable that will receive the typed text.
 *
 * @arg maxLength
 * @text Max Length
 * @type number
 * @min 0
 * @default 0
 * @desc Character limit. 0 = use the plugin's DefaultMaxLength.
 *
 * @arg initialValue
 * @text Initial Value
 * @type string
 * @default
 * @desc Text pre-filled in the field (optional).
 *
 * @arg promptText
 * @text Prompt Text
 * @type string
 * @default
 * @desc Label shown above the input field (optional).
 *
 * @arg waitForInput
 * @text Wait for Input
 * @type boolean
 * @default true
 * @desc When ON, the event waits until the player confirms or cancels.
 *
 * @arg posX
 * @text X Position
 * @type string
 * @default
 * @desc Horizontal position. Pixels (ex: 400) or percentage (ex: 50%). Leave blank for default.
 *
 * @arg posY
 * @text Y Position
 * @type string
 * @default
 * @desc Vertical position. Pixels (ex: 300) or percentage (ex: 50%). Leave blank for default.
 *
 * @arg anchor
 * @text Anchor
 * @type select
 * @option Default (use plugin setting)
 * @value
 * @option Center
 * @value center
 * @option Top-Left
 * @value top-left
 * @default
 * @desc Which point of the field X/Y coordinates refer to. Leave blank for default.
 *
 * @command OpenNumberInput
 * @text Open Number Input
 * @desc Opens a numeric keyboard input and stores the result as a number in a variable.
 *
 * @arg variableId
 * @text Variable ID
 * @type variable
 * @default 1
 * @desc Game variable that will receive the numeric result.
 *
 * @arg numberType
 * @text Number Type
 * @type select
 * @option Integer — positive only (0, 1, 42...)
 * @value integer
 * @option Signed integer — with minus sign (-10, 0, 50...)
 * @value signed
 * @option Decimal — floating point (-3.14, 0, 2.5...)
 * @value decimal
 * @default integer
 * @desc Which kind of number the player can enter.
 *
 * @arg minValue
 * @text Minimum Value
 * @type string
 * @default
 * @desc Minimum allowed value. Leave blank for no minimum.
 *
 * @arg maxValue
 * @text Maximum Value
 * @type string
 * @default
 * @desc Maximum allowed value. Leave blank for no maximum.
 *
 * @arg decimalPlaces
 * @text Decimal Places
 * @type number
 * @min 0
 * @max 10
 * @default 2
 * @desc Max decimal places (decimal type only). 0 = unlimited.
 *
 * @arg decimalSep
 * @text Decimal Separator
 * @type select
 * @option Dot (3.14)
 * @value .
 * @option Comma (3,14)
 * @value ,
 * @default .
 * @desc Which character separates the decimal part.
 *
 * @arg maxLength
 * @text Max Length
 * @type number
 * @min 0
 * @default 12
 * @desc Character limit for the raw input string. 0 = use DefaultMaxLength.
 *
 * @arg initialValue
 * @text Initial Value
 * @type string
 * @default
 * @desc Number pre-filled in the field (optional).
 *
 * @arg promptText
 * @text Prompt Text
 * @type string
 * @default
 * @desc Label shown above the input field (optional).
 *
 * @arg waitForInput
 * @text Wait for Input
 * @type boolean
 * @default true
 * @desc When ON, the event waits until the player confirms or cancels.
 *
 * @command OpenNumberInput
 * @text Open Number Input
 * @desc Opens a numeric keyboard input and stores the result as a number in a variable.
 *
 * @arg variableId
 * @text Variable ID
 * @type variable
 * @default 1
 * @desc Game variable that will receive the numeric result.
 *
 * @arg numberType
 * @text Number Type
 * @type select
 * @option Integer — positive only (0, 1, 42...)
 * @value integer
 * @option Signed integer — with minus sign (-10, 0, 50...)
 * @value signed
 * @option Decimal — floating point (-3.14, 0, 2.5...)
 * @value decimal
 * @default integer
 * @desc Which kind of number the player can enter.
 *
 * @arg minValue
 * @text Minimum Value
 * @type string
 * @default
 * @desc Minimum allowed value. Leave blank for no minimum.
 *
 * @arg maxValue
 * @text Maximum Value
 * @type string
 * @default
 * @desc Maximum allowed value. Leave blank for no maximum.
 *
 * @arg decimalPlaces
 * @text Decimal Places
 * @type number
 * @min 0
 * @max 10
 * @default 2
 * @desc Max decimal places (decimal type only). 0 = unlimited.
 *
 * @arg decimalSep
 * @text Decimal Separator
 * @type select
 * @option Dot (3.14)
 * @value .
 * @option Comma (3,14)
 * @value ,
 * @default .
 * @desc Which character separates the decimal part.
 *
 * @arg maxLength
 * @text Max Length
 * @type number
 * @min 0
 * @default 12
 * @desc Character limit for the raw input string. 0 = use DefaultMaxLength.
 *
 * @arg initialValue
 * @text Initial Value
 * @type string
 * @default
 * @desc Number pre-filled in the field (optional).
 *
 * @arg promptText
 * @text Prompt Text
 * @type string
 * @default
 * @desc Label shown above the input field (optional).
 *
 * @arg waitForInput
 * @text Wait for Input
 * @type boolean
 * @default true
 * @desc When ON, the event waits until the player confirms or cancels.
 *
 * @arg errorInvalid
 * @text Error — Invalid
 * @type string
 * @default
 * @desc Message when the value is invalid. Leave blank to use the plugin default.
 *       Placeholders: {value} {min} {max} {name}
 *
 * @arg errorMin
 * @text Error — Below Minimum
 * @type string
 * @default
 * @desc Message when value is below minimum. Leave blank to use the plugin default.
 *       Placeholders: {value} {min} {max} {name}
 *
 * @arg errorMax
 * @text Error — Above Maximum
 * @type string
 * @default
 * @desc Message when value is above maximum. Leave blank to use the plugin default.
 *       Placeholders: {value} {min} {max} {name}
 *
 * @arg posX
 * @text X Position
 * @type string
 * @default
 * @desc Horizontal position. Pixels (ex: 400) or percentage (ex: 50%). Leave blank for default.
 *
 * @arg posY
 * @text Y Position
 * @type string
 * @default
 * @desc Vertical position. Pixels (ex: 300) or percentage (ex: 50%). Leave blank for default.
 *
 * @arg anchor
 * @text Anchor
 * @type select
 * @option Default (use plugin setting)
 * @value
 * @option Center
 * @value center
 * @option Top-Left
 * @value top-left
 * @default
 * @desc Which point of the field X/Y coordinates refer to. Leave blank for default.
 */
// =============================================================================
// IIFE
// =============================================================================

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_TextInput_MZ";
    const VERSION     = "1.2.0";
    const SERIES_NUM  = 9;

    // =========================================================================
    //  Config
    // =========================================================================

    const _raw = PluginManager.parameters(PLUGIN_NAME) || {};

    const TI_Config = {
        overrideSceneName : String(_raw["OverrideSceneName"] || "true").toLowerCase()  === "true",
        defaultMaxLength  : Math.max(1, Number(_raw["DefaultMaxLength"] || 16)),
        allowedChars      : String(_raw["AllowedChars"] || "[^\\x00-\\x1F]"),
        confirmOnEnter    : String(_raw["ConfirmOnEnter"]  || "true").toLowerCase()  === "true",
        cancelOnEscape    : String(_raw["CancelOnEscape"]  || "true").toLowerCase()  === "true",
        showCharCounter   : String(_raw["ShowCharCounter"] || "true").toLowerCase()  === "true",
        debugMode         : String(_raw["DebugMode"]       || "false").toLowerCase() === "true",
        errorInvalid      : String(_raw["ErrorInvalid"] || "Please enter a valid number."),
        errorMin          : String(_raw["ErrorMin"]      || "Minimum value: {min}"),
        errorMax          : String(_raw["ErrorMax"]      || "Maximum value: {max}"),
        defaultX          : String(_raw["DefaultX"]      || "50%").trim(),
        defaultY          : String(_raw["DefaultY"]      || "50%").trim(),
        defaultAnchor     : String(_raw["DefaultAnchor"] || "center").trim().toLowerCase(),
    };

    // =========================================================================
    //  Logging
    // =========================================================================

    const clog  = (...a) => { if (TI_Config.debugMode) console.log(`[${PLUGIN_NAME}#${SERIES_NUM}]`, ...a); };
    const cwarn = (...a) => { if (TI_Config.debugMode) console.warn(`[${PLUGIN_NAME}#${SERIES_NUM}]`, ...a); };

    // =========================================================================
    //  TI_Platform — detecção de ambiente
    // =========================================================================

    const TI_Platform = {
        isMobile() {
            return Utils.isMobileDevice()
                || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        },
        hasVisualViewport() {
            return typeof window.visualViewport !== "undefined";
        }
    };

    // =========================================================================
    //  TI_DOM — gerencia o elemento <input> HTML
    // =========================================================================
    // Um único <input> é criado na inicialização e reutilizado para sempre.
    // Nunca removido do DOM — apenas mostrado/escondido.

    const TI_DOM = {
        _el        : null,   // o elemento <input>
        _overlay   : null,   // wrapper div para posicionamento
        _counter   : null,   // div do contador de chars
        _label     : null,   // div do prompt label
        _opts      : null,   // opções da sessão atual
        _vvHandler : null,   // handler do visualViewport resize
        _origTranslate : "", // translateY original do canvas antes do scroll

        // ── Inicialização ──────────────────────────────────────────────────────
        // Chamado uma única vez quando o plugin carrega.

        init() {
            // Overlay — cobre o canvas inteiro, transparente a eventos exceto o campo
            const overlay = document.createElement("div");
            overlay.id = "pico-ti-overlay";
            Object.assign(overlay.style, {
                position      : "absolute",
                top           : "0",
                left          : "0",
                width         : "100%",
                height        : "100%",
                display       : "none",
                zIndex        : "999",
                pointerEvents : "none",
            });

            // Wrapper — agrupa label + input + counter como coluna vertical.
            // É ele que recebe o posicionamento (absoluto ou centralizado).
            const wrapper = document.createElement("div");
            wrapper.id = "pico-ti-wrapper";
            Object.assign(wrapper.style, {
                position       : "absolute",
                display        : "flex",
                flexDirection  : "column",
                alignItems     : "center",
                pointerEvents  : "none",
                boxSizing      : "border-box",
            });

            // Label / prompt
            const label = document.createElement("div");
            label.id = "pico-ti-label";
            Object.assign(label.style, {
                color         : "#ffffff",
                fontSize      : "20px",
                fontFamily    : this._gameFont(),
                textShadow    : "1px 1px 3px #000",
                marginBottom  : "10px",
                pointerEvents : "none",
                textAlign     : "center",
                maxWidth      : "480px",
                padding       : "0 16px",
                width         : "100%",
            });

            // Campo de texto
            const el = document.createElement("input");
            el.id    = "pico-ti-field";
            el.type  = "text";
            Object.assign(el.style, {
                display       : "block",
                width         : "320px",
                maxWidth      : "80vw",
                padding       : "10px 16px",
                fontSize      : "22px",
                fontFamily    : this._gameFont(),
                color         : "#ffffff",
                background    : "rgba(0,0,0,0.65)",
                border        : "2px solid rgba(255,255,255,0.55)",
                borderRadius  : "6px",
                outline       : "none",
                textAlign     : "center",
                boxSizing      : "border-box",
                pointerEvents : "all",
                caretColor    : "#ffffff",
            });

            // Contador de chars
            const counter = document.createElement("div");
            counter.id = "pico-ti-counter";
            Object.assign(counter.style, {
                color         : "rgba(255,255,255,0.6)",
                fontSize      : "13px",
                fontFamily    : this._gameFont(),
                marginTop     : "6px",
                pointerEvents : "none",
                textAlign     : "center",
                width         : "320px",
                maxWidth      : "80vw",
            });

            wrapper.appendChild(label);
            wrapper.appendChild(el);
            wrapper.appendChild(counter);
            overlay.appendChild(wrapper);
            document.body.appendChild(overlay);

            this._el      = el;
            this._overlay = overlay;
            this._wrapper = wrapper;
            this._counter = counter;
            this._label   = label;

            // Eventos do campo
            el.addEventListener("input",   () => this._onInput());
            el.addEventListener("keydown", (e) => this._onKeydown(e));

            clog("TI_DOM inicializado");
        },

        // ── Sessão ────────────────────────────────────────────────────────────

        open(opts) {
            this._opts = opts;

            const max     = opts.maxLength || TI_Config.defaultMaxLength;
            const initial = opts.initial   || "";
            const prompt  = opts.prompt    || "";

            // Configura o campo
            this._el.maxLength = max;
            this._el.value     = initial;

            // Label
            this._label.textContent  = prompt;
            this._label.style.display = prompt ? "block" : "none";

            // Contador
            this._counter.style.display = TI_Config.showCharCounter ? "block" : "none";
            this._updateCounter(initial.length, max);

            // Mostra o overlay
            this._overlay.style.display = "flex";

            // Posiciona sobre o canvas do MZ
            this._attachToCanvas();

            // Aplica posição e âncora customizadas (ou padrão centralizado)
            this._applyPosition(opts);

            // Foco — pequeno delay para garantir que o DOM está pronto
            setTimeout(() => {
                this._el.focus();
                this._el.select();
                clog("TI_DOM.open focus aplicado");
            }, 80);

            // Mobile: escuta o teclado virtual
            if (TI_Platform.isMobile()) {
                this._bindVisualViewport();
            }

            clog("TI_DOM.open", { max, initial, prompt });
        },

        close() {
            this._overlay.style.display = "none";
            this._el.blur();
            this._unbindVisualViewport();
            this._restoreCanvasPosition();
            this._opts = null;
            clog("TI_DOM.close");
        },

        current() {
            return this._el ? this._el.value : "";
        },

        // ── Handlers internos ─────────────────────────────────────────────────

        _onInput() {
            if (!this._opts) return;

            // Valida caracteres permitidos
            const pattern = this._allowedPattern();
            if (pattern) {
                const filtered = this._el.value.split("").filter(c => pattern.test(c)).join("");
                if (filtered !== this._el.value) {
                    this._el.value = filtered;
                }
            }

            const max = this._opts.maxLength || TI_Config.defaultMaxLength;
            this._updateCounter(this._el.value.length, max);

            if (this._opts.onChange) {
                this._opts.onChange(this._el.value);
            }
        },

        _onKeydown(e) {
            if (!this._opts) return;

            if (TI_Config.confirmOnEnter && e.key === "Enter") {
                e.preventDefault();
                TI_Core.confirm();
                return;
            }

            if (TI_Config.cancelOnEscape && e.key === "Escape") {
                e.preventDefault();
                TI_Core.cancel();
                return;
            }

            // Impede que o engine MZ capture as teclas enquanto o input está ativo
            e.stopPropagation();
        },

        // ── Mobile — visualViewport ───────────────────────────────────────────
        // Quando o teclado virtual abre, visualViewport.height diminui.
        // Calculamos a diferença e translamos o canvas para cima.

        _bindVisualViewport() {
            if (!TI_Platform.hasVisualViewport()) return;

            this._vvHandler = () => {
                const vv             = window.visualViewport;
                const keyboardHeight = window.innerHeight - vv.height - vv.offsetTop;
                const canvas         = document.querySelector("#gameCanvas, canvas");

                if (!canvas) return;

                if (keyboardHeight > 50) {
                    // Teclado abriu — sobe o canvas pela metade da altura do teclado
                    const shift = Math.round(keyboardHeight * 0.5);
                    canvas.style.transition = "transform 0.25s ease";
                    canvas.style.transform  = `translateY(-${shift}px)`;
                    clog("mobile keyboard height:", keyboardHeight, "shift:", shift);
                } else {
                    // Teclado fechou — restaura posição
                    this._restoreCanvasPosition();
                }
            };

            window.visualViewport.addEventListener("resize", this._vvHandler);
            clog("visualViewport listener ativado");
        },

        _unbindVisualViewport() {
            if (this._vvHandler && TI_Platform.hasVisualViewport()) {
                window.visualViewport.removeEventListener("resize", this._vvHandler);
                this._vvHandler = null;
            }
        },

        _restoreCanvasPosition() {
            const canvas = document.querySelector("#gameCanvas, canvas");
            if (canvas) {
                canvas.style.transition = "transform 0.2s ease";
                canvas.style.transform  = "";
            }
        },

        // ── Helpers ───────────────────────────────────────────────────────────

        _attachToCanvas() {
            // Garante que o overlay está no mesmo container do canvas
            const container = document.querySelector("#gameCanvas, canvas");
            const parent    = container ? container.parentElement : document.body;
            if (this._overlay.parentElement !== parent) {
                parent.appendChild(this._overlay);
            }

            // Dimensiona o overlay sobre o canvas
            if (container) {
                const rect = container.getBoundingClientRect();
                Object.assign(this._overlay.style, {
                    left   : rect.left   + "px",
                    top    : rect.top    + "px",
                    width  : rect.width  + "px",
                    height : rect.height + "px",
                });
            }
        },

        // Aplica posição e âncora ao wrapper (label + input + counter).
        // Posiciona o wrapper com left/top absolutos dentro do overlay,
        // usando transform para ajustar o ponto de âncora.
        //
        // Âncora "center"   → transform: translate(-50%, -50%)
        // Âncora "top-left" → transform: translate(0, 0)

        _applyPosition(opts) {
            // Prioridade: Plugin Command > Plugin Manager > default hardcoded
            // opts.x/y/anchor chegam como null quando não definidos no command
            const rawX   = (opts.x      ?? TI_Config.defaultX).toString().trim();
            const rawY   = (opts.y      ?? TI_Config.defaultY).toString().trim();
            const anchor = (opts.anchor ?? TI_Config.defaultAnchor).toString().toLowerCase();

            // Dimensões do canvas para resolver percentuais
            const container = document.querySelector("#gameCanvas, canvas");
            const cw = container ? container.getBoundingClientRect().width  : window.innerWidth;
            const ch = container ? container.getBoundingClientRect().height : window.innerHeight;

            const x = this._resolveCoord(rawX, cw);
            const y = this._resolveCoord(rawY, ch);

            const tx = anchor === "center" ? "-50%" : "0%";
            const ty = anchor === "center" ? "-50%" : "0%";

            Object.assign(this._wrapper.style, {
                left      : x + "px",
                top       : y + "px",
                transform : `translate(${tx}, ${ty})`,
            });

            clog("_applyPosition:", { rawX, rawY, x, y, anchor });
        },

        // Converte string de coordenada para pixels.
        // Aceita "50%" → metade da dimensão, ou "400" → 400px literal.
        _resolveCoord(raw, dimension) {
            const s = String(raw).trim();
            if (s.endsWith("%")) {
                return Math.round((parseFloat(s) / 100) * dimension);
            }
            const n = parseFloat(s);
            return isNaN(n) ? Math.round(dimension / 2) : n;
        },

        _updateCounter(current, max) {
            if (!TI_Config.showCharCounter) return;
            const remaining = max - current;
            const pct       = current / max;

            this._counter.textContent = `${current} / ${max}`;

            // Feedback de cor: normal → amarelo (80%) → vermelho (100%)
            if (pct >= 1.0) {
                this._counter.style.color = "#ff5555";
            } else if (pct >= 0.8) {
                this._counter.style.color = "#ffcc00";
            } else {
                this._counter.style.color = "rgba(255,255,255,0.6)";
            }
        },

        _allowedPattern() {
            const raw = this._opts && this._opts.allowed
                ? this._opts.allowed
                : TI_Config.allowedChars;

            if (!raw) return null;

            try {
                return raw instanceof RegExp ? raw : new RegExp(raw);
            } catch (err) {
                console.warn("[PICO_TextInput] AllowedChars regex inválida:", raw);
                return null;
            }
        },

        _gameFont() {
            // Tenta herdar a fonte do MZ; fallback para sans-serif
            try {
                return FontManager
                    ? FontManager.standardFace() || "sans-serif"
                    : "sans-serif";
            } catch (_) {
                return "sans-serif";
            }
        }
    };

    // =========================================================================
    //  TI_Core — lógica de sessão e integração com o engine
    // =========================================================================

    const TI_Core = {
        _active    : false,
        _waiting   : false,   // true quando um evento está aguardando o input
        _varId     : null,    // variável MZ de destino
        _onConfirm : null,
        _onCancel  : null,

        open(opts = {}) {
            if (this._active) this._forceClose();

            this._active    = true;
            this._varId     = opts.variableId || null;
            this._onConfirm = opts.onConfirm  || null;
            this._onCancel  = opts.onCancel   || null;

            TI_DOM.open(opts);
            clog("TI_Core.open", opts);
        },

        confirm() {
            if (!this._active) return;

            const text = TI_DOM.current().trim();
            clog("TI_Core.confirm", `"${text}"`);

            // Se houver um onConfirm registrado, delega 100% para ele.
            // É responsabilidade do callback decidir se chama _cleanup()
            // (e portanto libera o waiting). Isso permite que validações
            // numéricas rejeitem a confirmação sem fechar o campo.
            if (this._onConfirm) {
                this._onConfirm(text);
                return;
            }

            // Sem onConfirm customizado: comportamento padrão de texto —
            // salva na variável e fecha imediatamente.
            if (this._varId && $gameVariables) {
                $gameVariables.setValue(this._varId, text);
            }
            this._cleanup();
        },

        cancel() {
            if (!this._active) return;
            clog("TI_Core.cancel");

            const cb = this._onCancel;
            this._cleanup();
            if (cb) cb();
        },

        current() {
            return this._active ? TI_DOM.current() : "";
        },

        isActive() {
            return this._active;
        },

        isWaiting() {
            return this._waiting;
        },

        setWaiting(flag) {
            this._waiting = flag;
        },

        _cleanup() {
            this._active    = false;
            this._waiting   = false;
            this._varId     = null;
            this._onConfirm = null;
            this._onCancel  = null;
            TI_DOM.close();
        },

        _forceClose() {
            clog("TI_Core: fechando sessão anterior forçadamente");
            this._cleanup();
        }
    };

    // =========================================================================
    //  Scene_Name override
    // =========================================================================
    // Sobrescreve create() completamente — não instancia Window_NameEdit nem
    // Window_NameInput. Toda a lógica de captura vai para TI_DOM/TI_Core.

    if (TI_Config.overrideSceneName) {

        const _TI_Scene_Name_initialize = Scene_Name.prototype.initialize;
        Scene_Name.prototype.initialize = function () {
            _TI_Scene_Name_initialize.call(this);
        };

        Scene_Name.prototype.create = function () {
            Scene_Base.prototype.create.call(this);
            this._actor     = $gameActors.actor(this._actorId);
            this._inputDone = false;

            // Fundo
            this.createBackground();

            // Abre o input
            TI_Core.open({
                maxLength : this._maxLength,
                initial   : this._actor.name(),
                prompt    : `${this._actor.name()}`,
                onConfirm : (text) => {
                    this._actor._name = text || this._actor.name();
                    this._inputDone   = true;
                    clog("Scene_Name confirm:", this._actor._name);
                    this.popScene();
                },
                onCancel  : () => {
                    this._inputDone = true;
                    this.popScene();
                }
            });
        };

        Scene_Name.prototype.update = function () {
            Scene_Base.prototype.update.call(this);
        };

        Scene_Name.prototype.terminate = function () {
            Scene_Base.prototype.terminate.call(this);
            if (TI_Core.isActive()) TI_Core.cancel();
        };

        // Impede que o Input do MZ interfira enquanto o campo HTML está ativo
        const _TI_Scene_Name_isReady = Scene_Name.prototype.isReady;
        Scene_Name.prototype.isReady = function () {
            return _TI_Scene_Name_isReady.call(this);
        };

        clog("Scene_Name override ativo");
    }

    // =========================================================================
    //  Interpreter — waitForInput
    // =========================================================================
    // Quando waitForInput está ON, o interpretador de eventos pausa até o
    // jogador confirmar ou cancelar.

    const _TI_Game_Interpreter_updateWaitMode =
        Game_Interpreter.prototype.updateWaitMode;

    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === "picoTextInput") {
            if (TI_Core.isWaiting()) {
                return true;   // ainda aguardando
            }
            this._waitMode = "";
            return false;
        }
        return _TI_Game_Interpreter_updateWaitMode.call(this);
    };

    // =========================================================================
    //  Plugin Command — Open Text Input
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "OpenTextInput", function (args) {
        const varId   = Number(args.variableId)  || 0;
        const max     = Number(args.maxLength)    || 0;
        const initial = String(args.initialValue  || "").trim();
        const prompt  = String(args.promptText    || "").trim();
        const wait    = String(args.waitForInput  || "true").toLowerCase() === "true";
        const posX    = String(args.posX || "").trim() || null;
        const posY    = String(args.posY || "").trim() || null;
        const anchor  = String(args.anchor || "").trim() || null;

        if (wait) {
            TI_Core.setWaiting(true);
            this._waitMode = "picoTextInput";
        }

        TI_Core.open({
            variableId : varId || null,
            maxLength  : max   || TI_Config.defaultMaxLength,
            initial,
            prompt,
            x      : posX,
            y      : posY,
            anchor,
            onConfirm  : (text) => {
                if (varId && $gameVariables) $gameVariables.setValue(varId, text);
                TI_Core.setWaiting(false);
                TI_Core._cleanup();
                clog("OpenTextInput confirm:", `"${text}"`, "→ var", varId);
            },
            onCancel   : () => {
                TI_Core.setWaiting(false);
                TI_Core._cleanup();
                clog("OpenTextInput cancel");
            }
        });
    });

    // =========================================================================
    //  TI_NumberInput — validação e formatação de números
    // =========================================================================
    // Responsabilidade única: construir as regras de input para cada tipo
    // numérico e validar o valor final antes de confirmar.

    const TI_NumberInput = {

        // Retorna as opts de TI_DOM para um dado perfil numérico.
        buildOpts(numOpts) {
            const type      = numOpts.numberType  || "integer";
            const sep       = numOpts.decimalSep  || ".";
            const places    = numOpts.decimalPlaces ?? 2;
            const maxLen    = numOpts.maxLength    || TI_Config.defaultMaxLength;
            const initial   = numOpts.initial != null ? String(numOpts.initial) : "";

            return {
                variableId : numOpts.variableId || null,
                maxLength  : maxLen,
                initial    : initial.replace(".", sep),
                prompt     : numOpts.prompt || "",
                allowed    : this._allowedRegex(type, sep),
                x          : numOpts.x      || null,
                y          : numOpts.y      || null,
                anchor     : numOpts.anchor || null,
                onChange   : (raw) => this._enforceDecimalPlaces(raw, sep, places),
                onConfirm  : (raw) => this._handleConfirm(raw, numOpts.variableId, numOpts),
                onCancel   : numOpts.onCancel || null,
            };
        },

        // ── Resolução lazy de limites ─────────────────────────────────────────
        // Aceita três formas:
        //   number   → retorna diretamente          ex: 80
        //   Function → chama e retorna o resultado  ex: () => $gameParty.gold()
        //   string   → avalia como expressão JS     ex: "$gameParty.gold()"
        //
        // Avaliado a cada tentativa de confirm — sempre reflete o estado atual
        // do jogo no momento em que o jogador pressiona Enter.
        //
        // Retorna null se o limite não estiver definido ou a avaliação falhar.

        _resolveLimit(raw) {
            if (raw == null || raw === "") return null;

            // Função direta — API JS
            if (typeof raw === "function") {
                try {
                    const result = raw();
                    const n = parseFloat(result);
                    return isNaN(n) ? null : n;
                } catch (err) {
                    console.warn("[PICO_TextInput] _resolveLimit function error:", err);
                    return null;
                }
            }

            // Número direto — sem avaliação
            if (typeof raw === "number") return isNaN(raw) ? null : raw;

            // String — tenta parseFloat primeiro (valor literal "80")
            // Se não for um número puro, avalia como expressão JS
            const asNum = parseFloat(raw);
            if (!isNaN(asNum) && String(asNum) === String(raw).trim()) return asNum;

            // Expressão JS — eval com contexto do jogo.
            // Suporta três formas de string:
            //   "80"                      → número literal
            //   "$gameParty.gold()"       → expressão que retorna número
            //   "() => $gameParty.gold()" → arrow function — chamada automaticamente
            try {
                /* jshint evil: true */
                let result = eval(raw);  // eslint-disable-line no-eval

                // Se eval retornou uma função (ex: arrow function digitada no editor),
                // chama a função para obter o valor numérico.
                if (typeof result === "function") result = result();

                const n = parseFloat(result);
                if (isNaN(n)) {
                    console.warn("[PICO_TextInput] _resolveLimit: expressão não retornou número:", raw, "→", result);
                    return null;
                }
                clog("_resolveLimit eval:", raw, "→", n);
                return n;
            } catch (err) {
                console.warn("[PICO_TextInput] _resolveLimit eval error:", raw, err);
                return null;
            }
        },

        // ── Resolução de mensagens de erro ────────────────────────────────────
        // Aceita texto fixo com placeholders ou expressão JS.
        //
        // Placeholders suportados:
        //   {value} — valor digitado (após conversão numérica)
        //   {min}   — limite mínimo resolvido
        //   {max}   — limite máximo resolvido
        //   {name}  — nome do ator atual (se disponível)
        //
        // Se a string parece uma expressão JS (contém + ou `), avalia via eval
        // e retorna o resultado como string.

        _resolveMessage(template, ctx) {
            if (!template) return "";

            // Tenta eval se parecer expressão JS (contém backtick ou concatenação)
            if (/`|['"].*\+|^\(/.test(template)) {
                try {
                    // Expõe o contexto como variáveis locais para o eval
                    const { value, min, max, name } = ctx; // eslint-disable-line no-unused-vars
                    let result = eval(template);            // eslint-disable-line no-eval
                    if (typeof result === "function") result = result();
                    return String(result);
                } catch (err) {
                    console.warn("[PICO_TextInput] _resolveMessage eval error:", template, err);
                    // Fallback: trata como texto com placeholders
                }
            }

            // Texto fixo com placeholders
            return template
                .replace(/\{value\}/g, ctx.value ?? "")
                .replace(/\{min\}/g,   ctx.min   ?? "")
                .replace(/\{max\}/g,   ctx.max   ?? "")
                .replace(/\{name\}/g,  ctx.name  ?? "");
        },

        // ── Validação ao confirmar ────────────────────────────────────────────
        // min e max são resolvidos aqui — sempre com o valor atual do jogo.

        _handleConfirm(raw, varId, numOpts) {
            const sep    = numOpts.decimalSep  || ".";
            const type   = numOpts.numberType  || "integer";
            const places = numOpts.decimalPlaces ?? 2;

            // Resolve limites agora (lazy — estado atual do jogo)
            const minResolved = this._resolveLimit(numOpts.min);
            const maxResolved = this._resolveLimit(numOpts.max);

            // Nome do ator atual para placeholders
            const actorName = ($gameParty && $gameParty.members().length > 0)
                ? $gameParty.members()[0].name() : "";

            clog("_handleConfirm limits:", { min: minResolved, max: maxResolved });

            // Normaliza separador para JS (sempre ponto)
            const normalized = raw.trim().replace(sep, ".");
            let value = parseFloat(normalized);

            // Contexto compartilhado para resolução de mensagens
            const msgCtx = {
                value : isNaN(value) ? raw : value,
                min   : minResolved ?? "",
                max   : maxResolved ?? "",
                name  : actorName,
            };

            // Campo vazio ou inválido
            if (normalized === "" || isNaN(value)) {
                const msg = this._resolveMessage(
                    numOpts.errorInvalid || TI_Config.errorInvalid, msgCtx
                );
                TI_DOM._shakeField(msg);
                return;
            }

            // Inteiro: arredonda
            if (type === "integer" || type === "signed") {
                value = Math.round(value);
            }

            // Casas decimais
            if (type === "decimal" && places > 0) {
                value = parseFloat(value.toFixed(places));
            }

            // Atualiza value no contexto após conversão
            msgCtx.value = value;

            // Verifica min
            if (minResolved != null && value < minResolved) {
                const msg = this._resolveMessage(
                    numOpts.errorMin || TI_Config.errorMin, msgCtx
                );
                TI_DOM._shakeField(msg);
                return;
            }

            // Verifica max
            if (maxResolved != null && value > maxResolved) {
                const msg = this._resolveMessage(
                    numOpts.errorMax || TI_Config.errorMax, msgCtx
                );
                TI_DOM._shakeField(msg);
                return;
            }

            // Tudo OK — salva e encerra
            if (varId && $gameVariables) {
                $gameVariables.setValue(varId, value);
            }
            TI_Core.setWaiting(false);

            const cb = numOpts.onConfirm;
            TI_Core._cleanup();
            if (cb) cb(value);

            clog("NumberInput confirm:", value, "→ var", varId);
        },

        // ── Regex de caracteres permitidos por tipo ───────────────────────────

        _allowedRegex(type, sep) {
            const escapedSep = sep === "." ? "\\." : ",";
            switch (type) {
                case "signed"  : return new RegExp(`[0-9\\-]`);
                case "decimal" : return new RegExp(`[0-9\\-${escapedSep}]`);
                default        : return /[0-9]/;   // integer
            }
        },

        // Limita casas decimais em tempo real enquanto o jogador digita.
        _enforceDecimalPlaces(raw, sep, places) {
            if (places <= 0) return;
            const idx = raw.indexOf(sep);
            if (idx === -1) return;
            const decimals = raw.slice(idx + 1);
            if (decimals.length > places) {
                TI_DOM._el.value = raw.slice(0, idx + 1 + places);
            }
        }
    };

    // ── TI_DOM: shake + mensagem de erro ──────────────────────────────────────
    // Adicionado ao objeto TI_DOM existente via atribuição direta.

    TI_DOM._errorMsg   = null;   // elemento de mensagem de erro (criado lazy)
    TI_DOM._shakeField = function (message) {
        // Cria o elemento de erro na primeira chamada
        if (!this._errorMsg) {
            const err = document.createElement("div");
            err.id = "pico-ti-error";
            Object.assign(err.style, {
                color      : "#ff5555",
                fontSize   : "14px",
                fontFamily : this._gameFont(),
                marginTop  : "6px",
                textAlign  : "center",
                minHeight  : "18px",
                transition : "opacity 0.3s",
            });
            this._overlay.appendChild(err);
            this._errorMsg = err;
        }

        // Mostra a mensagem
        this._errorMsg.textContent = message;
        this._errorMsg.style.opacity = "1";

        // Animação de shake via keyframes CSS injetados uma única vez
        if (!document.getElementById("pico-ti-shake-style")) {
            const style = document.createElement("style");
            style.id = "pico-ti-shake-style";
            style.textContent = `
                @keyframes picoShake {
                    0%,100% { transform: translateX(0); }
                    20%     { transform: translateX(-8px); }
                    40%     { transform: translateX( 8px); }
                    60%     { transform: translateX(-5px); }
                    80%     { transform: translateX( 5px); }
                }
                .pico-shake { animation: picoShake 0.35s ease; }
            `;
            document.head.appendChild(style);
        }

        // Dispara o shake
        this._el.classList.remove("pico-shake");
        // Force reflow para reiniciar a animação se já estava rodando
        void this._el.offsetWidth;
        this._el.classList.add("pico-shake");
        this._el.addEventListener("animationend", () => {
            this._el.classList.remove("pico-shake");
        }, { once: true });

        // Apaga a mensagem após 2.5s
        clearTimeout(this._errorTimeout);
        this._errorTimeout = setTimeout(() => {
            if (this._errorMsg) this._errorMsg.style.opacity = "0";
        }, 2500);

        clog("shakeField:", message);
    };

    // =========================================================================
    //  Plugin Command — Open Number Input
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "OpenNumberInput", function (args) {
        const varId  = Number(args.variableId) || 0;
        const type   = String(args.numberType  || "integer").toLowerCase();
        const sep    = String(args.decimalSep  || ".").trim() || ".";
        const places = Number(args.decimalPlaces ?? 2);
        const max    = Number(args.maxLength)  || TI_Config.defaultMaxLength;
        const prompt = String(args.promptText  || "").trim();
        const wait   = String(args.waitForInput || "true").toLowerCase() === "true";

        const minVal = args.minValue != null ? String(args.minValue).trim() : null;
        const maxVal = args.maxValue != null ? String(args.maxValue).trim() : null;
        const initial = args.initialValue !== "" && args.initialValue != null
            ? String(args.initialValue) : "";

        // Mensagens personalizadas — string vazia usa o padrão do Plugin Manager
        const errorInvalid = String(args.errorInvalid || "").trim() || null;
        const errorMin     = String(args.errorMin     || "").trim() || null;
        const errorMax     = String(args.errorMax     || "").trim() || null;

        const posX   = String(args.posX   || "").trim() || null;
        const posY   = String(args.posY   || "").trim() || null;
        const anchor = String(args.anchor || "").trim() || null;

        if (wait) {
            TI_Core.setWaiting(true);
            this._waitMode = "picoTextInput";
        }

        const numOpts = {
            variableId    : varId || null,
            numberType    : type,
            min           : minVal || null,
            max           : maxVal || null,
            decimalPlaces : places,
            decimalSep    : sep,
            maxLength     : max,
            initial,
            prompt,
            x      : posX,
            y      : posY,
            anchor,
            errorInvalid,
            errorMin,
            errorMax,
            onConfirm     : (num) => {
                TI_Core.setWaiting(false);
                clog("OpenNumberInput confirm:", num, "→ var", varId);
            },
            onCancel      : () => {
                TI_Core.setWaiting(false);
                clog("OpenNumberInput cancel");
            }
        };

        TI_Core.open(TI_NumberInput.buildOpts(numOpts));
    });

    // =========================================================================
    //  Public API
    // =========================================================================

    const PICO = (window.PICO = window.PICO || {});
    PICO.TextInput = {
        open       : (opts) => TI_Core.open(opts),
        openNumber : (opts) => TI_Core.open(TI_NumberInput.buildOpts(opts)),
        close      : ()     => TI_Core.cancel(),
        confirm    : ()     => TI_Core.confirm(),
        current    : ()     => TI_Core.current(),
        isActive   : ()     => TI_Core.isActive(),
    };

    // =========================================================================
    //  Init log
    // =========================================================================

    TI_DOM.init();

    console.log(`[${PLUGIN_NAME}#${SERIES_NUM}] v${VERSION} loaded.`);

})();

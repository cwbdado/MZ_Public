//=============================================================================
// PICO_KeyboardPlus.js  |  v1.0.0  |  17-09-2025
//=============================================================================
/*:
 * @target MZ
 * @plugindesc |v1.0.0| PICO ToolBox Collection #3 — Keyboard+ : full-keyboard mapping, custom symbols, and bindings (switch/common event). (PT/EN)
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 * @help PICO_KeyboardPlus.js
 *
 * =============================================================================
 *  PICO ToolBox Collection #3 — Keyboard+
 * =============================================================================
 *  > PT-BR
 *  Libere o uso de (quase) todas as teclas do teclado no RPG Maker MZ:
 *  letras A–Z, dígitos 0–9, F1–F12, numpad, setas, navegação (Home/End/PgUp…),
 *  pontuação e modificadoras. O plugin cria símbolos exclusivos (ex.: "keyA",
 *  "digit1", "f5", "numpad0", "minus", "semicolon" etc.) e permite fazer bind
 *  de cada símbolo a ações (alternar switch, manter switch pressionado, rodar
 *  common event). Não altera o mapeamento padrão (ok/cancel/menu…).
 *
 *  > EN
 *  Unlock (virtually) all keyboard keys in RPG Maker MZ: letters, digits,
 *  function keys, numpad, arrows, navigation, punctuation, modifiers.
 *  The plugin registers unique symbols (e.g., "keyA", "digit1", "f5", "numpad0")
 *  and lets you bind them to actions (toggle switch, hold switch, run CE).
 *  It does NOT override the engine’s default mappings.
 *
 *  > Features
 *  - Full keyboard map -> unique symbols (safe, non-conflicting)
 *  - Plugin commands: bind to Switch (toggle/hold/set), bind to Common Event
 *  - Public API for advanced setups
 *  - Optional debug logging
 *  - Respeita cenas de texto (Scene_Name) por padrão
 *
 *  > Quick use (script calls)
 *    // Toggle Switch #5 when pressing Q:
 *    PICO.KeyboardPlus.bindSwitchToggle('keyQ', 5);
 *    // Hold Switch #10 while holding Space:
 *    PICO.KeyboardPlus.bindSwitchHold('space', 10);
 *    // Run Common Event #12 on F5 press:
 *    PICO.KeyboardPlus.bindCommonEvent('f5', 12);
 *
 *  > Notes
 *  - "Release" é detectado internamente para modos hold.
 *  - Símbolos são *adicionais* ao Input.keyMapper; não removemos os padrões.
 *
 * =============================================================================
 *  Version History
 * =============================================================================
 *  v1.0.0 (17-09-2025): Initial release (#3).
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
 * @param CaptureAssignedKeys
 * @text PreventDefault for assigned keys
 * @type boolean
 * @desc Se true, chama preventDefault em teclas com bind (evita browser hotkeys em deploy web).
 * @default true
 *
 * @param RespectTextInput
 * @text Respect text input scenes
 * @type boolean
 * @desc Pausa processamento em Scene_Name (e cenas similares) para não atrapalhar digitação.
 * @default true
 *
 * =============================================================================
 *  Plugin Commands — PICO_KeyboardPlus (#3)
 * =============================================================================
 * @command BindSwitchToggle
 * @text Bind Switch Toggle
 * @desc Toggle a switch when the key is pressed (symbol).
 * @arg symbol
 * @type string
 * @default keyQ
 * @arg switchId
 * @type number
 * @min 1
 * @default 1
 *
 * @command BindSwitchHold
 * @text Bind Switch Hold
 * @desc Set switch ON while pressed, OFF on release.
 * @arg symbol
 * @type string
 * @default space
 * @arg switchId
 * @type number
 * @min 1
 * @default 1
 *
 * @command BindSwitchSet
 * @text Bind Switch Set (fixed)
 * @desc Set switch to ON or OFF on press (no toggle).
 * @arg symbol
 * @type string
 * @default keyX
 * @arg switchId
 * @type number
 * @min 1
 * @default 1
 * @arg value
 * @type select
 * @option ON
 * @option OFF
 * @default ON
 *
 * @command BindCommonEvent
 * @text Bind Common Event
 * @desc Run Common Event on press.
 * @arg symbol
 * @type string
 * @default f5
 * @arg commonEventId
 * @type number
 * @min 1
 * @default 1
 *
 * @command Unbind
 * @text Unbind Symbol
 * @desc Remove any binding for symbol.
 * @arg symbol
 * @type string
 * @default keyQ
 *
 * @command UnbindAll
 * @text Unbind All
 * @desc Clear all current bindings.
 */
(() => {
  'use strict';

  const PLUGIN_NAME = 'PICO_KeyboardPlus';
  const PARAMS = PluginManager.parameters(PLUGIN_NAME);
  const DEBUG  = String(PARAMS['Debug'] ?? 'false').toLowerCase() === 'true';
  const CAPTURE = String(PARAMS['CaptureAssignedKeys'] ?? 'true').toLowerCase() === 'true';
  const RESPECT_TEXT = String(PARAMS['RespectTextInput'] ?? 'true').toLowerCase() === 'true';

  const tag  = `[${PLUGIN_NAME}#3]`;
  const log  = (...a) => { if (DEBUG) console.log(tag, ...a); };
  const warn = (...a) => { if (DEBUG) console.warn(tag, ...a); };
  const err  = (...a) => console.error(tag, ...a);

  // Namespace
  const PICO = (window.PICO = window.PICO || {});
  PICO.KeyboardPlus = PICO.KeyboardPlus || {};

  //--------------------------------------------------------------------------
  // Map all relevant keyCodes -> unique symbols (non-conflicting)
  //--------------------------------------------------------------------------
  const mapSymbol = (keyCode) => {
    // Letters
    if (keyCode >= 65 && keyCode <= 90) return `key${String.fromCharCode(keyCode)}`; // A..Z
    // Digits
    if (keyCode >= 48 && keyCode <= 57) return `digit${keyCode - 48}`;               // 0..9
    // Numpad 0..9
    if (keyCode >= 96 && keyCode <= 105) return `numpad${keyCode - 96}`;             // 0..9
    // Function
    if (keyCode >= 112 && keyCode <= 123) return `f${keyCode - 111}`;                // F1..F12
    // Arrows
    if (keyCode === 37) return 'arrowLeft';
    if (keyCode === 38) return 'arrowUp';
    if (keyCode === 39) return 'arrowRight';
    if (keyCode === 40) return 'arrowDown';
    // Nav / Controls
    if (keyCode === 8)  return 'backspace';
    if (keyCode === 9)  return 'tab';
    if (keyCode === 13) return 'enter';
    if (keyCode === 16) return 'shift';
    if (keyCode === 17) return 'control';
    if (keyCode === 18) return 'alt';
    if (keyCode === 20) return 'capslock';
    if (keyCode === 27) return 'escape';
    if (keyCode === 32) return 'space';
    if (keyCode === 33) return 'pageup';
    if (keyCode === 34) return 'pagedown';
    if (keyCode === 35) return 'end';
    if (keyCode === 36) return 'home';
    if (keyCode === 45) return 'insert';
    if (keyCode === 46) return 'delete';
    if (keyCode === 144) return 'numlock';
    if (keyCode === 145) return 'scrolllock';
    // Numpad ops
    if (keyCode === 106) return 'numpadMultiply';
    if (keyCode === 107) return 'numpadPlus';
    if (keyCode === 109) return 'numpadMinus';
    if (keyCode === 110) return 'numpadDecimal';
    if (keyCode === 111) return 'numpadDivide';
    // Punctuation
    if (keyCode === 186) return 'semicolon';
    if (keyCode === 187) return 'equal';
    if (keyCode === 188) return 'comma';
    if (keyCode === 189) return 'minus';
    if (keyCode === 190) return 'period';
    if (keyCode === 191) return 'slash';
    if (keyCode === 192) return 'backquote';
    if (keyCode === 219) return 'bracketLeft';
    if (keyCode === 220) return 'backslash';
    if (keyCode === 221) return 'bracketRight';
    if (keyCode === 222) return 'quote';
    return null;
  };

  // Register symbols in Input.keyMapper without touching defaults
  const registerFullKeyboard = () => {
    const added = [];
    for (let code = 0; code <= 255; code++) {
      const sym = mapSymbol(code);
      if (sym && !Object.values(Input.keyMapper).includes(sym)) {
        Input.keyMapper[code] = Input.keyMapper[code] || sym;
        added.push({ code, sym });
      }
    }
    log('Registered symbols:', added.length);
  };

  //--------------------------------------------------------------------------
  // Binding store & helpers
  //--------------------------------------------------------------------------
  const BINDINGS = {}; // symbol -> { type, id, mode }
  // types: 'switch' | 'common'
  // mode for switch: 'toggle' | 'hold' | 'setOn' | 'setOff'

  const wasDown = {}; // symbol -> boolean (last frame)

  const isSceneTyping = () => {
    if (!RESPECT_TEXT) return false;
    const sc = SceneManager._scene;
    // Expand if você tiver outras cenas de texto
    return sc && (sc instanceof Scene_Name);
  };

  const symbolPressedNow = (sym) => Input.isPressed(sym);
  const symbolTriggered = (sym) => Input.isTriggered(sym);

  const symbolReleased = (sym) => {
    const now = symbolPressedNow(sym);
    const before = !!wasDown[sym];
    wasDown[sym] = now;
    return before && !now;
  };

  const doToggleSwitch = (id) => $gameSwitches.setValue(id, !$gameSwitches.value(id));
  const setSwitch = (id, v) => $gameSwitches.setValue(id, !!v);

  const runCommonEvent = (id) => {
    const ce = $dataCommonEvents[id];
    if (!ce) { warn('CommonEvent not found:', id); return; }
    $gameTemp.reserveCommonEvent(id);
  };

  // Process all bindings once per frame (map+battle)
  const processBindings = () => {
    if (isSceneTyping()) return; // respeita digitação
    for (const [sym, b] of Object.entries(BINDINGS)) {
      if (b.type === 'switch') {
        if (b.mode === 'toggle') {
          if (symbolTriggered(sym)) { doToggleSwitch(b.id); }
        } else if (b.mode === 'hold') {
          if (symbolPressedNow(sym)) setSwitch(b.id, true);
          if (symbolReleased(sym))   setSwitch(b.id, false);
        } else if (b.mode === 'setOn') {
          if (symbolTriggered(sym)) setSwitch(b.id, true);
        } else if (b.mode === 'setOff') {
          if (symbolTriggered(sym)) setSwitch(b.id, false);
        }
      } else if (b.type === 'common') {
        if (symbolTriggered(sym)) runCommonEvent(b.id);
      }
    }
  };

  // Hook updates
  const ALIAS = {
    Scene_Map:   { update: Scene_Map.prototype.update },
    Scene_Battle:{ update: Scene_Battle.prototype.update }
  };
  Scene_Map.prototype.update = function() {
    ALIAS.Scene_Map.update.call(this);
    processBindings();
  };
  Scene_Battle.prototype.update = function() {
    ALIAS.Scene_Battle.update.call(this);
    processBindings();
  };

  //--------------------------------------------------------------------------
  // Public API
  //--------------------------------------------------------------------------
  PICO.KeyboardPlus.bindSwitchToggle = function(symbol, switchId) {
    BINDINGS[symbol] = { type: 'switch', id: Number(switchId), mode: 'toggle' };
    log('bindSwitchToggle', symbol, switchId);
  };
  PICO.KeyboardPlus.bindSwitchHold = function(symbol, switchId) {
    BINDINGS[symbol] = { type: 'switch', id: Number(switchId), mode: 'hold' };
    wasDown[symbol] = false;
    log('bindSwitchHold', symbol, switchId);
  };
  PICO.KeyboardPlus.bindSwitchSet = function(symbol, switchId, value) {
    const v = String(value).toLowerCase() === 'on' || value === true;
    BINDINGS[symbol] = { type: 'switch', id: Number(switchId), mode: v ? 'setOn' : 'setOff' };
    log('bindSwitchSet', symbol, switchId, v);
  };
  PICO.KeyboardPlus.bindCommonEvent = function(symbol, commonEventId) {
    BINDINGS[symbol] = { type: 'common', id: Number(commonEventId) };
    log('bindCommonEvent', symbol, commonEventId);
  };
  PICO.KeyboardPlus.unbind = function(symbol) {
    delete BINDINGS[symbol];
    delete wasDown[symbol];
    log('unbind', symbol);
  };
  PICO.KeyboardPlus.unbindAll = function() {
    for (const k of Object.keys(BINDINGS)) delete BINDINGS[k];
    for (const k of Object.keys(wasDown)) delete wasDown[k];
    log('unbindAll');
  };
  // Helpers
  PICO.KeyboardPlus.isPressed = function(symbol) { return Input.isPressed(symbol); };
  PICO.KeyboardPlus.isTriggered = function(symbol) { return Input.isTriggered(symbol); };
  PICO.KeyboardPlus.isReleased = function(symbol) {
    // instantaneous check (without updating state):
    return !!wasDown[symbol] && !Input.isPressed(symbol);
  };

  //--------------------------------------------------------------------------
  // Plugin Commands
  //--------------------------------------------------------------------------
  PluginManager.registerCommand(PLUGIN_NAME, 'BindSwitchToggle', (args) => {
    PICO.KeyboardPlus.bindSwitchToggle(String(args.symbol), Number(args.switchId));
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'BindSwitchHold', (args) => {
    PICO.KeyboardPlus.bindSwitchHold(String(args.symbol), Number(args.switchId));
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'BindSwitchSet', (args) => {
    PICO.KeyboardPlus.bindSwitchSet(String(args.symbol), Number(args.switchId), String(args.value));
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'BindCommonEvent', (args) => {
    PICO.KeyboardPlus.bindCommonEvent(String(args.symbol), Number(args.commonEventId));
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'Unbind', (args) => {
    PICO.KeyboardPlus.unbind(String(args.symbol));
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'UnbindAll', () => {
    PICO.KeyboardPlus.unbindAll();
  });

  //--------------------------------------------------------------------------
  // Capture assigned keys (optional)
  //--------------------------------------------------------------------------
  if (CAPTURE) {
    const _onKeyDown = Input._onKeyDown.bind(Input);
    Input._onKeyDown = function(event) {
      const code = event.keyCode || event.which;
      const sym = Input.keyMapper[code];
      const bound = sym && BINDINGS[sym];
      if (bound) event.preventDefault();
      _onKeyDown(event);
    };
  }

  // Initialize
  registerFullKeyboard();
  log('Loaded with params:', { DEBUG, CAPTURE, RESPECT_TEXT });

})();

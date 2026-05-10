//=============================================================================
// PICO_SetSelfSwitches.js  |  v2.0.0  |  17-09-2025
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v2.0.0| PICO ToolBox Collection #2 — Reliable Self Switch controller (set / toggle / batch) with "this event" support. (PT/EN)
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 * @help PICO_SetSelfSwitches.js
 * 
 * =============================================================================
 *  PICO ToolBox Collection #2 — Set Self Switches
 * =============================================================================
 *  > PT-BR
 *  Parte da série PICO ToolBox para desenvolvedores (este é o #2).
 *  Controle confiável dos Self Switches (A–D): set, toggle e lote, com
 *  suporte a "this event" automático (eventId=0/vazio) e logs opcionais.
 *  Compatível com comandos legados do POG_setSelfSwitches.
 * 
 *  > EN
 *  Part of the PICO ToolBox developer series (this is #2).
 *  Reliable control over Self Switches (A–D): set, toggle & batch,
 *  with automatic “this event” (eventId=0/empty) and optional logs.
 *  Backward-compatible with POG_setSelfSwitches legacy commands.
 * 
 *  > Features
 *  - Single or batch operations for A–D
 *  - true/false/toggle/keep (skip) per key
 *  - Auto target “this event” (eventId=0) and current map (mapId=0)
 *  - Conditional debug logging
 *  - Backward-compatible legacy commands preserved
 * 
 *  > Installation & Usage
 *  - Coloque o plugin na ordem desejada; não requer dependências.
 *  - Configure o parâmetro Debug se quiser logs no console.
 * 
 *  > Related
 *  - PICO ToolBox Collection #1 — Debug HUD (referência de estilo/branding)
 * 
 * =============================================================================
 *  Version History
 * =============================================================================
 *  v2.0.0 (17-09-2025): Full refactor, robust parsing, toggle, batch, API, retrocompat.
 *  v1.x  : Legacy POG_setSelfSwitches (compat preserved).
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
 * =============================================================================
 *  Plugin Commands — PICO_SetSelfSwitches (#2)
 * =============================================================================
 * @command SetOne
 * @text Set One Self Switch
 * @desc Set/toggle one self switch on a target (map/event).
 * 
 * @arg mapId
 * @text Map Id (0 = current)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg eventId
 * @text Event Id (0 = this event)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg key
 * @text Key
 * @type select
 * @option A
 * @option B
 * @option C
 * @option D
 * @default A
 * 
 * @arg op
 * @text Operation
 * @type select
 * @option true
 * @option false
 * @option toggle
 * @default true
 * 
 * @command SetBatch
 * @text Set Batch (A–D)
 * @desc Set/toggle many keys; use "keep" to skip a key.
 * 
 * @arg mapId
 * @text Map Id (0 = current)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg eventId
 * @text Event Id (0 = this event)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg A
 * @text A
 * @type select
 * @option keep
 * @option true
 * @option false
 * @option toggle
 * @default keep
 * 
 * @arg B
 * @text B
 * @type select
 * @option keep
 * @option true
 * @option false
 * @option toggle
 * @default keep
 * 
 * @arg C
 * @text C
 * @type select
 * @option keep
 * @option true
 * @option false
 * @option toggle
 * @default keep
 * 
 * @arg D
 * @text D
 * @type select
 * @option keep
 * @option true
 * @option false
 * @option toggle
 * @default keep
 * 
 * =============================================================================
 *  Backward-Compatible Commands — POG_setSelfSwitches (legacy)
 * =============================================================================
 * @command setSelfSwitches
 * @text [Legacy] SetValue SelfSwitches
 * @desc Assign value to a switch. key: A/B/C/D | value: true/false/toggle
 * 
 * @arg mapId
 * @type number
 * @text MapId
 * @default 0
 * 
 * @arg eventId
 * @type number
 * @text EventId
 * @default 0
 * 
 * @arg key
 * @type string
 * @text Key
 * @default A
 * 
 * @arg value
 * @type string
 * @text Value
 * @default true
 * 
 * @command selfSwitches
 * @text [Legacy] SelfSwitches
 * @desc A/B/C/D: true/false/toggle/none(keep)
 * 
 * @arg mapId
 * @type number
 * @text MapId
 * @default 0
 * 
 * @arg eventId
 * @type number
 * @text EventId
 * @default 0
 * 
 * @arg valueA
 * @type string
 * @text A
 * @default none
 * 
 * @arg valueB
 * @type string
 * @text B
 * @default none
 * 
 * @arg valueC
 * @type string
 * @text C
 * @default none
 * 
 * @arg valueD
 * @type string
 * @text D
 * @default none
 * 
 * @command allSelfSwitches
 * @text [Legacy] All SelfSwitches
 * @desc Force set A–D (true/false). Use SetBatch for toggle/keep.
 * 
 * @arg mapId
 * @type number
 * @text MapId
 * @default 0
 * 
 * @arg eventId
 * @type number
 * @text EventId
 * @default 0
 * 
 * @arg valueA
 * @type boolean
 * @text A
 * @default false
 * 
 * @arg valueB
 * @type boolean
 * @text B
 * @default false
 * 
 * @arg valueC
 * @type boolean
 * @text C
 * @default false
 * 
 * @arg valueD
 * @type boolean
 * @text D
 * @default false
 */

(() => {
  'use strict';

  //--------------------------------------------------------------------------
  // Constants & Params
  //--------------------------------------------------------------------------
  const PLUGIN_NAME = 'PICO_SetSelfSwitches';
  const LEGACY_NAME = 'POG_setSelfSwitches';
  const PARAMS = PluginManager.parameters(PLUGIN_NAME);
  const DEBUG  = String(PARAMS['Debug'] ?? 'false').toLowerCase() === 'true';

  const tag  = `[${PLUGIN_NAME}#2]`;
  const log  = (...a) => { if (DEBUG) console.log(tag, ...a); };
  const warn = (...a) => { if (DEBUG) console.warn(tag, ...a); };
  const err  = (...a) => console.error(tag, ...a);

  const PICO = (window.PICO = window.PICO || {});
  PICO.SetSelfSwitches = PICO.SetSelfSwitches || {};

  //--------------------------------------------------------------------------
  // Utilities
  //--------------------------------------------------------------------------
  const toNum = v => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const sanitizeKey = k => {
    const up = String(k || 'A').toUpperCase();
    return ['A','B','C','D'].includes(up) ? up : 'A';
  };

  // Normalize ops: true/false/toggle/keep (accepts on/off/none)
  const normalizeOp = v => {
    const s = String(v ?? '').trim().toLowerCase();
    if (s === 'true' || s === 'on')   return 'true';
    if (s === 'false' || s === 'off') return 'false';
    if (s === 'toggle')               return 'toggle';
    if (s === 'keep' || s === 'none' || s === '') return 'keep';
    if (s === '1')  return 'true';
    if (s === '0')  return 'false';
    warn('Unknown op, defaulting to keep:', v);
    return 'keep';
  };

  const currentValue = (mapId, eventId, key) =>
    !!$gameSelfSwitches.value([mapId, eventId, key]);

  const applyOp = (cur, op) => {
    if (op === 'keep')   return cur;
    if (op === 'toggle') return !cur;
    return op === 'true';
  };

  const resolveContext = function(mapIdArg, eventIdArg) {
    const ctx = this instanceof Game_Interpreter ? this : null;
    const mapId   = toNum(mapIdArg)   || $gameMap.mapId();
    const eventId = toNum(eventIdArg) || (ctx && typeof ctx.eventId === 'function' ? ctx.eventId() : 0);
    if (!eventId) warn('eventId is 0 and no interpreter context; using 0 (common event?)');
    return { mapId, eventId };
  };

  const setSelfSwitch = (mapId, eventId, key, op) => {
    const cur = currentValue(mapId, eventId, key);
    const val = applyOp(cur, normalizeOp(op));
    $gameSelfSwitches.setValue([mapId, eventId, key], val);
    log('set', { mapId, eventId, key, from: cur, op, to: val });
  };

  const setBatch = (mapId, eventId, ops) => {
    ['A','B','C','D'].forEach(k => {
      const op = normalizeOp(ops[k]);
      if (op !== 'keep') setSelfSwitch(mapId, eventId, k, op);
    });
  };

  //--------------------------------------------------------------------------
  // Public API
  //--------------------------------------------------------------------------
  PICO.SetSelfSwitches.one = function({ mapId = 0, eventId = 0, key = 'A', op = 'true' } = {}) {
    const ctx = resolveContext.call(null, mapId, eventId);
    setSelfSwitch(ctx.mapId, ctx.eventId, sanitizeKey(key), op);
  };

  PICO.SetSelfSwitches.batch = function({ mapId = 0, eventId = 0, A='keep', B='keep', C='keep', D='keep' } = {}) {
    const ctx = resolveContext.call(null, mapId, eventId);
    setBatch(ctx.mapId, ctx.eventId, { A, B, C, D });
  };

  //--------------------------------------------------------------------------
  // PICO Commands (#2)
  //--------------------------------------------------------------------------
  PluginManager.registerCommand(PLUGIN_NAME, 'SetOne', function(args) {
    const { mapId, eventId, key, op } = args;
    const ctx = resolveContext.call(this, mapId, eventId);
    setSelfSwitch(ctx.mapId, ctx.eventId, sanitizeKey(key), op);
  });

  PluginManager.registerCommand(PLUGIN_NAME, 'SetBatch', function(args) {
    const ctx = resolveContext.call(this, args.mapId, args.eventId);
    setBatch(ctx.mapId, ctx.eventId, { A: args.A, B: args.B, C: args.C, D: args.D });
  });

  //--------------------------------------------------------------------------
  // Legacy Commands (POG_setSelfSwitches) — keep projects working
  //--------------------------------------------------------------------------
  PluginManager.registerCommand(LEGACY_NAME, 'setSelfSwitches', function(args) {
    const ctx = resolveContext.call(this, args.mapId, args.eventId);
    setSelfSwitch(ctx.mapId, ctx.eventId, sanitizeKey(args.key), args.value);
  });

  PluginManager.registerCommand(LEGACY_NAME, 'selfSwitches', function(args) {
    const ctx = resolveContext.call(this, args.mapId, args.eventId);
    setBatch(ctx.mapId, ctx.eventId, {
      A: args.valueA, B: args.valueB, C: args.valueC, D: args.valueD
    });
  });

  PluginManager.registerCommand(LEGACY_NAME, 'allSelfSwitches', function(args) {
    const ctx = resolveContext.call(this, args.mapId, args.eventId);
    const toOp = v => (String(v).toLowerCase() === 'true' ? 'true' : 'false');
    setBatch(ctx.mapId, ctx.eventId, {
      A: toOp(args.valueA), B: toOp(args.valueB), C: toOp(args.valueC), D: toOp(args.valueD)
    });
  });

  // Optional: Legacy shim for $gameSystem.setSelfSwitches(...)
  if (!Game_System.prototype.setSelfSwitches) {
    Game_System.prototype.setSelfSwitches = function(mapId, eventId, key, value) {
      const ctx = resolveContext.call(null, mapId, eventId);
      setSelfSwitch(ctx.mapId, ctx.eventId, sanitizeKey(key), value);
    };
  }

  log('Loaded (#2).');
})();

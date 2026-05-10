//=============================================================================
// PICO_DebugHUD.js  |  v2.2.3  |  17-09-2025
//=============================================================================
/*:
 * @target MZ
 * @plugindesc |v2.2.3| PICO ToolBox Collection #1 — Debug HUD for live Variables & Switches (themes, hotkeys, smart fade). (PT/EN)
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 * @help PICO_DebugHUD.js
 * 
 * =============================================================================
 *  PICO ToolBox Collection #1 — Debug HUD
 * =============================================================================
 *  > PT-BR
 *  HUD de depuração para exibir Variáveis e Switches em tempo real.
 *  Inclui temas, hotkeys (F7–F10), opacidade, posição e “smart fade”
 *  (transparência automática quando o jogador chega perto).
 * 
 *  > EN
 *  Real-time debug HUD for Variables and Switches.
 *  Includes themes, hotkeys (F7–F10), opacity, position and smart fade
 *  (auto transparency when the player gets too close).
 * 
 *  > Features
 *  - Real-time Variables & Switches monitor
 *  - Smart fade near player (optional)
 *  - Themes (Dark, Light, Neon, Retrospace)
 *  - Hotkeys: F7 toggle, F8 theme, F9 opacity, F10 lock
 *  - State persistence (per save) via $gameSystem
 * 
 *  > Installation & Usage
 *  - Add the plugin and configure the watch lists (Variables/Switches).
 *  - Use hotkeys or plugin commands to control the HUD.
 * 
 *  > Related
 *  - PICO ToolBox Collection #2 — Set Self Switches
 * 
 * =============================================================================
 *  Version History
 * =============================================================================
 *  v2.2.3 (17-09-2025): Branding #1; stability; added plugin commands; smarter fade.
 *  v2.2.2: Minor fixes.
 *  v2.2.1: Initial public release of simplified variant.
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
 * @param VisibleOnStart
 * @text Visible on Start
 * @type boolean
 * @default true
 * 
 * @param Variables
 * @text Watch Variables (CSV)
 * @type string
 * @desc Ex.: 1,2,3
 * @default 1,2,3
 * 
 * @param Switches
 * @text Watch Switches (CSV)
 * @type string
 * @desc Ex.: 1,2,3
 * @default 1,2,3
 * 
 * @param Theme
 * @text UI Theme
 * @type select
 * @option dark
 * @option light
 * @option neon
 * @option retrospace
 * @default dark
 * 
 * @param X
 * @text HUD X
 * @type number
 * @min 0
 * @default 12
 * 
 * @param Y
 * @text HUD Y
 * @type number
 * @min 0
 * @default 12
 * 
 * @param Width
 * @text HUD Width
 * @type number
 * @min 120
 * @default 280
 * 
 * @param Height
 * @text HUD Height
 * @type number
 * @min 60
 * @default 160
 * 
 * @param Opacity
 * @text HUD Opacity (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 230
 * 
 * @param SmartFade
 * @text Smart Fade (near player)
 * @type boolean
 * @default true
 * 
 * @param FadeDistance
 * @text Fade Distance (px)
 * @type number
 * @min 0
 * @default 64
 * 
 * @param LockPosition
 * @text Lock Position (disable SetPosition)
 * @type boolean
 * @default false
 * 
 * =============================================================================
 *  Plugin Commands — PICO_DebugHUD (#1)
 * =============================================================================
 * @command ToggleHUD
 * @text Toggle HUD
 * @desc Show/Hide the HUD.
 * 
 * @command ShowHUD
 * @text Show HUD
 * @desc Force show HUD.
 * 
 * @command HideHUD
 * @text Hide HUD
 * @desc Force hide HUD.
 * 
 * @command AddVar
 * @text Add Variable ID
 * @desc Adds a variable to watch list.
 * @arg id
 * @type number
 * @min 1
 * @default 1
 * 
 * @command AddSwitch
 * @text Add Switch ID
 * @desc Adds a switch to watch list.
 * @arg id
 * @type number
 * @min 1
 * @default 1
 * 
 * @command RemoveVar
 * @text Remove Variable ID
 * @desc Removes a variable from watch list.
 * @arg id
 * @type number
 * @min 1
 * @default 1
 * 
 * @command RemoveSwitch
 * @text Remove Switch ID
 * @desc Removes a switch from watch list.
 * @arg id
 * @type number
 * @min 1
 * @default 1
 * 
 * @command SetPosition
 * @text Set Position (X,Y)
 * @desc Sets HUD position.
 * @arg x
 * @type number
 * @min 0
 * @default 12
 * @arg y
 * @type number
 * @min 0
 * @default 12
 */
(function() { 
  'use strict';
  const PLUGIN_NAME = 'PICO_DebugHUD';
  const PARAMS = PluginManager.parameters(PLUGIN_NAME);
  const DEBUG  = String(PARAMS['Debug'] ?? 'false').toLowerCase() === 'true';
  const tag  = `[${PLUGIN_NAME}#1]`;
  const log  = (...a) => { if (DEBUG) console.log(tag, ...a); };
  const warn = (...a) => { if (DEBUG) console.warn(tag, ...a); };
  const err  = (...a) => console.error(tag, ...a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const toCSVList = (s) => String(s||'').split(',').map(t=>Number(t.trim())).filter(n=>Number.isInteger(n) && n>0);
  const CFG = {
    visible : String(PARAMS['VisibleOnStart'] ?? 'true').toLowerCase() === 'true',
    vars    : toCSVList(PARAMS['Variables'] ?? '1,2,3'),
    sws     : toCSVList(PARAMS['Switches'] ?? '1,2,3'),
    theme   : String(PARAMS['Theme'] ?? 'dark'),
    x       : Number(PARAMS['X'] ?? 12),
    y       : Number(PARAMS['Y'] ?? 12),
    w       : Number(PARAMS['Width'] ?? 280),
    h       : Number(PARAMS['Height'] ?? 160),
    op      : clamp(Number(PARAMS['Opacity'] ?? 230), 0, 255),
    fade    : String(PARAMS['SmartFade'] ?? 'true').toLowerCase() === 'true',
    dist    : Number(PARAMS['FadeDistance'] ?? 64),
    lockPos : String(PARAMS['LockPosition'] ?? 'false').toLowerCase() === 'true',
  };
  log('Loaded with', CFG);

  // Persistência
  const sys = () => $gameSystem;
  const SYSKEY = '_picoDebugHUD';
  const defaultState = () => ({ 
    visible: CFG.visible, x: CFG.x, y: CFG.y, w: CFG.w, h: CFG.h,
    theme: CFG.theme, op: CFG.op, vars: [...CFG.vars], sws: [...CFG.sws], lock: CFG.lockPos
  });
  const state = () => {
    sys()[SYSKEY] = sys()[SYSKEY] || defaultState();
    return sys()[SYSKEY];
  };

  // Temas
  const THEME = {
    dark:      { backColor: '#111a', textColor: '#fff',  stroke: '#000', pad: 8 },
    light:     { backColor: '#fff8', textColor: '#222',  stroke: '#000', pad: 8 },
    neon:      { backColor: '#001a', textColor: '#0ff',  stroke: '#0ff', pad: 8 },
    retrospace:{ backColor: '#1128', textColor: '#0f0',  stroke: '#0f0', pad: 8 },
  };
  const allThemes = Object.keys(THEME);
  const cycleTheme = (cur) => {
    const i = allThemes.indexOf(cur);
    return allThemes[(i+1) % allThemes.length];
  };

  // Window
  class Window_PICODebugHUD extends Window_Base {
    initialize(rect) {
      super.initialize(rect);
      this._lastText = '';
      this.opacity = 0; // fundo custom
      this.contentsBack.opacity = 0;
      this.contents.fontSize = 18;
      this._counter = 0;
      this._fadeAlpha = 1.0;
      this.refresh();
    }
    update() {
      super.update();
      this._counter++;
      if (this._counter % 10 === 0) this.refresh();
      this.updateFade();
    }
    updateFade() {
      if (!CFG.fade) { this.alpha = 1.0; return; }
      const px = $gamePlayer ? $gamePlayer.screenX() : 0;
      const py = $gamePlayer ? $gamePlayer.screenY() : 0;
      const rx = this.x, ry = this.y, rw = this.width, rh = this.height;
      const cx = clamp(px, rx, rx+rw);
      const cy = clamp(py, ry, ry+rh);
      const dx = px - cx, dy = py - cy;
      const d = Math.hypot(dx, dy);
      const t = clamp((d - CFG.dist) / CFG.dist, 0, 1);
      this._fadeAlpha = 0.35 + 0.65 * t;
      this.alpha = this._fadeAlpha;
    }
    drawBackground() {
      const theme = THEME[state().theme] || THEME.dark;
      const r = 8;
      const c = this.contentsBack;
      c.clear();
      const g = c.context;
      g.save();
      g.fillStyle = theme.backColor;
      g.strokeStyle = theme.stroke;
      g.lineWidth = 2;
      const w = this.innerWidth, h = this.innerHeight;
      g.beginPath();
      g.moveTo(r,0); g.lineTo(w-r,0); g.quadraticCurveTo(w,0,w,r);
      g.lineTo(w,h-r); g.quadraticCurveTo(w,h,w-r,h);
      g.lineTo(r,h); g.quadraticCurveTo(0,h,0,h-r);
      g.lineTo(0,r); g.quadraticCurveTo(0,0,r,0);
      g.closePath();
      g.fill();
      g.stroke();
      g.restore();
    }
    genText() {
      const s = state();
      let lines = [];
      if (s.vars.length) {
        lines.push('Vars:');
        for (const id of s.vars) {
          const v = $gameVariables.value(id);
          lines.push(`  \\C[16]#${id}\\C[0]: ${String(v)}`);
        }
      }
      if (s.sws.length) {
        lines.push('Switches:');
        for (const id of s.sws) {
          const v = $gameSwitches.value(id) ? 'ON' : 'OFF';
          lines.push(`  \\C[16]#${id}\\C[0]: ${v}`);
        }
      }
      return lines.join('\\n');
    }
    refresh() {
      const s = state();
      this.move(s.x, s.y, s.w, s.h);
      this.createContents();
      this.drawBackground();
      this.resetFontSettings();
      this.changeTextColor(ColorManager.textColor(0));
      this.contents.fontSize = 18;
      const text = this.genText();
      if (text === this._lastText) return;
      this._lastText = text;
      this.contents.clear();
      this.drawTextEx(text, 8, 8, this.innerWidth - 16);
      this.contentsBack.paintOpacity = s.op;
    }
  }

  // Scene hooks
  const ALIAS = { 
    Scene_Map: { 
      createAllWindows: Scene_Map.prototype.createAllWindows,
      start: Scene_Map.prototype.start 
    } 
  };
  Scene_Map.prototype.createAllWindows = function() {
    ALIAS.Scene_Map.createAllWindows.call(this);
    const s = state();
    const rect = new Rectangle(s.x, s.y, s.w, s.h);
    this._picoDebugHUD = new Window_PICODebugHUD(rect);
    this.addWindow(this._picoDebugHUD);
    this._picoDebugHUD.visible = !!s.visible;
    this._picoDebugHUD.contentsBack.paintOpacity = s.op;
  };
  Scene_Map.prototype.start = function() {
    ALIAS.Scene_Map.start.call(this);
    if (this._picoDebugHUD) this._picoDebugHUD.refresh();
  };

  // Plugin Commands
  PluginManager.registerCommand(PLUGIN_NAME, 'ToggleHUD', () => {
    const s = state();
    s.visible = !s.visible;
    if (SceneManager._scene && SceneManager._scene._picoDebugHUD) {
      SceneManager._scene._picoDebugHUD.visible = s.visible;
    }
    log('ToggleHUD =>', s.visible);
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'ShowHUD', () => {
    const s = state(); s.visible = true;
    if (SceneManager._scene && SceneManager._scene._picoDebugHUD) {
      SceneManager._scene._picoDebugHUD.visible = true;
    }
    log('ShowHUD');
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'HideHUD', () => {
    const s = state(); s.visible = false;
    if (SceneManager._scene && SceneManager._scene._picoDebugHUD) {
      SceneManager._scene._picoDebugHUD.visible = false;
    }
    log('HideHUD');
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'AddVar', args => {
    const s = state(); const id = Number(args.id||0);
    if (id>0 && !s.vars.includes(id)) s.vars.push(id);
    log('AddVar', id, s.vars);
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'AddSwitch', args => {
    const s = state(); const id = Number(args.id||0);
    if (id>0 && !s.sws.includes(id)) s.sws.push(id);
    log('AddSwitch', id, s.sws);
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'RemoveVar', args => {
    const s = state(); const id = Number(args.id||0);
    s.vars = s.vars.filter(v=>v!==id);
    log('RemoveVar', id, s.vars);
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'RemoveSwitch', args => {
    const s = state(); const id = Number(args.id||0);
    s.sws = s.sws.filter(v=>v!==id);
    log('RemoveSwitch', id, s.sws);
  });
  PluginManager.registerCommand(PLUGIN_NAME, 'SetPosition', args => {
    const s = state(); 
    if (s.lock) { warn('Position locked.'); return; }
    s.x = clamp(Number(args.x||0), 0, Graphics.width - 32);
    s.y = clamp(Number(args.y||0), 0, Graphics.height - 32);
    if (SceneManager._scene && SceneManager._scene._picoDebugHUD) {
      SceneManager._scene._picoDebugHUD.refresh();
    }
    log('SetPosition', s.x, s.y);
  });

  // Hotkeys (F7-F10)
  window.addEventListener('keydown', ev => {
    if (!SceneManager._scene || !(SceneManager._scene instanceof Scene_Map)) return;
    const s = state();
    if (ev.code === 'F7') {
      s.visible = !s.visible;
      SceneManager._scene._picoDebugHUD.visible = s.visible;
      ev.preventDefault();
    } else if (ev.code === 'F8') {
      s.theme = cycleTheme(s.theme);
      SceneManager._scene._picoDebugHUD.refresh();
      ev.preventDefault();
    } else if (ev.code === 'F9') {
      s.op = s.op >= 255 ? 160 : s.op + 48;
      if (SceneManager._scene._picoDebugHUD) {
        SceneManager._scene._picoDebugHUD.opacity = 0;
        SceneManager._scene._picoDebugHUD.contentsBack.paintOpacity = s.op;
        SceneManager._scene._picoDebugHUD.refresh();
      }
      ev.preventDefault();
    } else if (ev.code === 'F10') {
      s.lock = !s.lock;
      SoundManager.playCursor();
      ev.preventDefault();
    }
  });
})();

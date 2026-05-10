//=============================================================================
// PICO ToolBox #6 — PICO_Loot.js  |  v1.1.0  |  2026-04-02
// Part of the PICO ToolBox series for RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc |v1.1.0| PICO ToolBox Collection #6 — Weighted random loot tables with configurable output variables.
 * @author DadoCWB
 * @url https://picopicocs.itch.io/
 *
 * @help
 * ============================================================================
 * PICO ToolBox #6 — PICO_Loot  v1.1.0
 * Part of the PICO ToolBox series for RPG Maker MZ
 * https://picopicocs.itch.io/
 * ============================================================================
 *
 * OVERVIEW
 * ============================================================================
 * Create named loot tables in the Plugin Manager. Each table holds a list of
 * entries with a unique ID and a weight (chance). Use the Roll or RollRange
 * plugin commands to draw entries from a table — results are written to MZ
 * variables.
 *
 * HOW WEIGHTS WORK
 * ============================================================================
 * Weights do not need to add up to 100. They are relative:
 *
 *   Entry A — weight 50
 *   Entry B — weight 30
 *   Entry C — weight 20
 *   Total   — 100  →  A: 50%, B: 30%, C: 20%
 *
 *   Entry A — weight 2
 *   Entry B — weight 1
 *   Total   — 3   →  A: ~67%, B: ~33%
 *
 * OUTPUT VARIABLES
 * ============================================================================
 * Define a list of MZ variable IDs in the "Output Variables" parameter.
 * After every roll, ALL output variables are reset to 0 first. Then results
 * are written in order:
 *
 *   Output Variables: [10, 11, 12]
 *   Roll 2 entries  → Var[10] = 1st result, Var[11] = 2nd result, Var[12] = 0
 *
 * If more entries are rolled than variables available, the extra results are
 * discarded.
 *
 * ALLOW DUPLICATES
 * ============================================================================
 * When ON  — the same entry can appear more than once in a single roll
 *            (sampling with replacement).
 * When OFF — each entry can only appear once per roll (sampling without
 *            replacement). If you request more entries than the table has,
 *            the roll returns as many unique entries as possible.
 *
 * PLUGIN COMMAND — Roll
 * ============================================================================
 * Draws a fixed number of entries from a loot table.
 *
 * Table Name      : name of the table defined in the Plugin Manager.
 * Amount          : how many entries to draw.
 * Allow Duplicates: whether the same ID can appear more than once.
 *
 * PLUGIN COMMAND — RollRange
 * ============================================================================
 * Draws a random number of entries between Min and Max (inclusive).
 * Useful when the drop count itself should be unpredictable.
 *
 * Table Name      : name of the table defined in the Plugin Manager.
 * Min Amount      : minimum number of entries to draw.
 * Max Amount      : maximum number of entries to draw.
 * Allow Duplicates: whether the same ID can appear more than once.
 *
 * SCRIPT API
 * ============================================================================
 * PICO.Loot.roll({ table, amount, allowDuplicates });
 *   → returns an array of ID strings.
 *
 * PICO.Loot.rollRange({ table, min, max, allowDuplicates });
 *   → picks a random amount between min and max, then rolls.
 *
 * Example:
 *   const results = PICO.Loot.rollRange({ table: 'chest_common', min: 1, max: 3 });
 *   console.log(results); // ['sword', 'potion']
 *
 * PART OF PICO TOOLBOX
 * ============================================================================
 *   #1 — PICO Debug HUD            Real-time variable/switch monitor
 *   #2 — PICO Set Self Switches    Reliable self-switch controller
 *   #3 — PICO Keyboard+            Full-keyboard input bindings
 *   #4 — PICO Horizontal Title Menu  Modern horizontal title layout
 *   #5 — PICO Disable Menu         Game-flow controls
 *   #6 — PICO Loot                 Weighted random loot tables (this plugin)
 *
 * CHANGELOG
 * ============================================================================
 * v1.1.0 (2026-04-02)
 *   - Output variables are now all zeroed before writing roll results.
 *   - Added RollRange command: draws a random amount between Min and Max.
 *   - Added PICO.Loot.rollRange() to the public API.
 * v1.0.0 (2026-04-02)
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
 * @desc Logs roll results to the browser console.
 *
 * @param OutputVariables
 * @text Output Variables
 * @parent --- General ---
 * @type variable[]
 * @default []
 * @desc MZ variables that will receive roll results, in order.
 *
 * @param --- Tables ---
 * @text ─────────────────────────────
 *
 * @param Tables
 * @text Loot Tables
 * @parent --- Tables ---
 * @type struct<LootTable>[]
 * @default []
 * @desc List of loot tables available for rolling.
 *
 * @command Roll
 * @text Roll
 * @desc Draw random entries from a loot table and save to variables.
 *
 * @arg TableName
 * @text Table Name
 * @type string
 * @default
 * @desc Name of the loot table to roll from (must match exactly).
 *
 * @arg Amount
 * @text Amount
 * @type number
 * @min 1
 * @default 1
 * @desc How many entries to draw.
 *
 * @arg AllowDuplicates
 * @text Allow Duplicates
 * @type boolean
 * @default true
 * @desc ON: same ID can appear more than once. OFF: each ID appears at most once.
 *
 * @command RollRange
 * @text Roll Range
 * @desc Draw a random number of entries (between Min and Max) from a loot table.
 *
 * @arg TableName
 * @text Table Name
 * @type string
 * @default
 * @desc Name of the loot table to roll from (must match exactly).
 *
 * @arg MinAmount
 * @text Min Amount
 * @type number
 * @min 1
 * @default 1
 * @desc Minimum number of entries to draw.
 *
 * @arg MaxAmount
 * @text Max Amount
 * @type number
 * @min 1
 * @default 3
 * @desc Maximum number of entries to draw.
 *
 * @arg AllowDuplicates
 * @text Allow Duplicates
 * @type boolean
 * @default true
 * @desc ON: same ID can appear more than once. OFF: each ID appears at most once.
 */

/*~struct~LootTable:
 * @param Name
 * @text Table Name
 * @type string
 * @default
 * @desc Unique name used to reference this table in plugin commands.
 *
 * @param Entries
 * @text Entries
 * @type struct<LootEntry>[]
 * @default []
 * @desc List of entries in this table.
 */

/*~struct~LootEntry:
 * @param Id
 * @text ID
 * @type string
 * @default
 * @desc Unique identifier for this entry (e.g. item name, item id, key).
 *
 * @param Weight
 * @text Weight
 * @type number
 * @min 1
 * @default 100
 * @desc Relative chance of this entry being drawn. Higher = more likely.
 */

(function () {
    "use strict";

    const PLUGIN_NAME = "PICO_Loot";
    const _raw        = PluginManager.parameters(PLUGIN_NAME) || {};

    const DEBUG            = String(_raw["DebugMode"] ?? "false").toLowerCase() === "true";
    const OUTPUT_VARIABLES = JSON.parse(_raw["OutputVariables"] || "[]").map(Number);

    // =========================================================================
    //  Logging
    // =========================================================================

    const clog  = (...a) => { if (DEBUG) console.log(`[${PLUGIN_NAME}#6]`, ...a); };
    const cwarn = (...a) => { if (DEBUG) console.warn(`[${PLUGIN_NAME}#6]`, ...a); };

    // =========================================================================
    //  Parse nested structs
    // =========================================================================

    const parseTables = raw => {
        let list;
        try { list = JSON.parse(raw || "[]"); } catch { return []; }

        return list.map(tableStr => {
            let t;
            try { t = JSON.parse(tableStr); } catch { return null; }

            let entries;
            try { entries = JSON.parse(t["Entries"] || "[]"); } catch { entries = []; }

            const parsed = entries.map(entryStr => {
                let e;
                try { e = JSON.parse(entryStr); } catch { return null; }
                const weight = Math.max(1, Number(e["Weight"]) || 1);
                return { id: String(e["Id"] || ""), weight };
            }).filter(Boolean).filter(e => e.id !== "");

            return { name: String(t["Name"] || ""), entries: parsed };
        }).filter(Boolean).filter(t => t.name !== "");
    };

    const TABLES = parseTables(_raw["Tables"]);
    clog("Tables loaded:", TABLES.map(t => `${t.name}(${t.entries.length})`));

    // =========================================================================
    //  Core roll logic
    // =========================================================================

    const weightedRoll = entries => {
        const total = entries.reduce((s, e) => s + e.weight, 0);
        let r = Math.random() * total;
        for (const e of entries) {
            r -= e.weight;
            if (r < 0) return e;
        }
        return entries[entries.length - 1];
    };

    const roll = ({ table, amount = 1, allowDuplicates = true }) => {
        const t = TABLES.find(t => t.name === table);
        if (!t) {
            cwarn(`Table not found: "${table}"`);
            return [];
        }

        if (t.entries.length === 0) {
            cwarn(`Table "${table}" has no entries.`);
            return [];
        }

        const results = [];

        if (allowDuplicates) {
            for (let i = 0; i < amount; i++) {
                results.push(weightedRoll(t.entries).id);
            }
        } else {
            const pool = [...t.entries];
            const count = Math.min(amount, pool.length);

            for (let i = 0; i < count; i++) {
                const picked = weightedRoll(pool);
                results.push(picked.id);
                pool.splice(pool.indexOf(picked), 1);
            }

            if (amount > t.entries.length) {
                cwarn(`Amount (${amount}) exceeds unique entries (${t.entries.length}). Returning ${count}.`);
            }
        }

        clog(`Roll "${table}" x${amount} (dupes: ${allowDuplicates}):`, results);
        return results;
    };

    // =========================================================================
    //  Write results to MZ variables
    // =========================================================================

    const writeToVariables = results => {
        // Always zero every output variable first
        OUTPUT_VARIABLES.forEach(varId => {
            $gameVariables.setValue(varId, 0);
        });
        // Then write results in order
        OUTPUT_VARIABLES.forEach((varId, i) => {
            if (i >= results.length) return;
            $gameVariables.setValue(varId, results[i]);
            clog(`Var[${varId}] = ${results[i]}`);
        });
    };

    // =========================================================================
    //  Public API
    // =========================================================================

    const rollRange = ({ table, min = 1, max = 1, allowDuplicates = true }) => {
        const lo     = Math.max(1, Math.min(min, max));
        const hi     = Math.max(lo, max);
        const amount = lo + Math.floor(Math.random() * (hi - lo + 1));
        clog(`RollRange "${table}" min:${lo} max:${hi} → amount:${amount}`);
        return roll({ table, amount, allowDuplicates });
    };

    const PICO = (window.PICO = window.PICO || {});
    PICO.Loot = { roll, rollRange };

    // =========================================================================
    //  Plugin Command — Roll
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "Roll", function (args) {
        const table           = String(args["TableName"] || "");
        const amount          = Math.max(1, parseInt(args["Amount"]) || 1);
        const allowDuplicates = String(args["AllowDuplicates"] ?? "true").toLowerCase() === "true";

        const results = roll({ table, amount, allowDuplicates });
        writeToVariables(results);
    });

    // =========================================================================
    //  Plugin Command — RollRange
    // =========================================================================

    PluginManager.registerCommand(PLUGIN_NAME, "RollRange", function (args) {
        const table           = String(args["TableName"] || "");
        const min             = Math.max(1, parseInt(args["MinAmount"]) || 1);
        const max             = Math.max(1, parseInt(args["MaxAmount"]) || 1);
        const allowDuplicates = String(args["AllowDuplicates"] ?? "true").toLowerCase() === "true";

        const results = rollRange({ table, min, max, allowDuplicates });
        writeToVariables(results);
    });

    // =========================================================================
    //  Init log
    // =========================================================================

    console.log(`[${PLUGIN_NAME}#6] v1.1.0 loaded.`);

})();

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandStringHelper = exports.expandString = exports.expandValue = exports.Config = void 0;
const vscode = require("vscode");
const utils_1 = require("./utils");
class Config {
    constructor(_config, log) {
        this._config = _config;
        this.log = log;
    }
    get(section, defaultValue) {
        const value = this._config.get(section, defaultValue);
        if (Array.isArray(value)) {
            // @ts-ignore
            return Promise.all(value.map((value) => expandValue(value, this.log, this.getExpandOptions())));
        }
        return expandValue(value, this.log, this.getExpandOptions());
    }
    getExpandOptions() {
        var _a;
        const [rootFolder] = (_a = vscode.workspace.workspaceFolders) !== null && _a !== void 0 ? _a : [];
        return {
            envOverride: {},
            recursive: false,
            doNotSupportCommands: false,
            vars: {
                workspaceFolder: rootFolder === null || rootFolder === void 0 ? void 0 : rootFolder.uri.fsPath,
            },
        };
    }
}
exports.Config = Config;
function expandValue(value, log, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof value === 'string') {
            return expandString(value, log, opts);
        }
        return value;
    });
}
exports.expandValue = expandValue;
/**
 * Replace ${variable} references in the given string with their corresponding
 * values.
 * @param instr The input string
 * @param opts Options for the expansion process
 * @returns A string with the variable references replaced
 */
function expandString(tmpl, log, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tmpl) {
            return tmpl;
        }
        const MAX_RECURSION = 10;
        let result = tmpl;
        let didReplacement = false;
        let i = 0;
        do {
            // TODO: consider a full circular reference check?
            const expansion = yield expandStringHelper(result, log, opts);
            result = expansion.result;
            didReplacement = expansion.didReplacement;
            i++;
        } while (i < MAX_RECURSION && opts.recursive && didReplacement);
        if (i === MAX_RECURSION) {
            log.logInfo('Reached max string expansion recursion. Possible circular reference.');
        }
        return utils_1.replaceAll(result, '${dollar}', '$');
    });
}
exports.expandString = expandString;
function expandStringHelper(tmpl, log, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const envPreNormalize = opts.envOverride
            ? opts.envOverride
            : process.env;
        const env = utils_1.mergeEnvironment(envPreNormalize);
        const repls = opts.vars;
        // We accumulate a list of substitutions that we need to make, preventing
        // recursively expanding or looping forever on bad replacements
        const subs = new Map();
        const var_re = /\$\{(\w+)\}/g;
        let mat = null;
        while ((mat = var_re.exec(tmpl))) {
            const full = mat[0];
            const key = mat[1];
            if (key !== 'dollar') {
                // Replace dollar sign at the very end of the expanding process
                const repl = repls[key];
                if (!repl) {
                    log.logWarning(`Invalid variable reference ${full} in string: ${tmpl}`);
                }
                else {
                    subs.set(full, repl);
                }
            }
        }
        // Regular expression for variable value (between the variable suffix and the next ending curly bracket):
        // .+? matches any character (except line terminators) between one and unlimited times,
        // as few times as possible, expanding as needed (lazy)
        const varValueRegexp = '.+?';
        const env_re = RegExp(`\\$\\{env:(${varValueRegexp})\\}`, 'g');
        while ((mat = env_re.exec(tmpl))) {
            const full = mat[0];
            const varname = mat[1];
            const repl = utils_1.fixPaths(env[utils_1.normalizeEnvironmentVarname(varname)]) || '';
            subs.set(full, repl);
        }
        const env_re2 = RegExp(`\\$\\{env\\.(${varValueRegexp})\\}`, 'g');
        while ((mat = env_re2.exec(tmpl))) {
            const full = mat[0];
            const varname = mat[1];
            const repl = utils_1.fixPaths(env[utils_1.normalizeEnvironmentVarname(varname)]) || '';
            subs.set(full, repl);
        }
        const env_re3 = RegExp(`\\$env\\{(${varValueRegexp})\\}`, 'g');
        while ((mat = env_re3.exec(tmpl))) {
            const full = mat[0];
            const varname = mat[1];
            const repl = utils_1.fixPaths(env[utils_1.normalizeEnvironmentVarname(varname)]) || '';
            subs.set(full, repl);
        }
        const penv_re = RegExp(`\\$penv\\{(${varValueRegexp})\\}`, 'g');
        while ((mat = penv_re.exec(tmpl))) {
            const full = mat[0];
            const varname = mat[1];
            const repl = utils_1.fixPaths(process.env[utils_1.normalizeEnvironmentVarname(varname)] || '') || '';
            subs.set(full, repl);
        }
        const vendor_re = RegExp(`\\$vendor\\{(${varValueRegexp})\\}`, 'g');
        while ((mat = vendor_re.exec(tmpl))) {
            const full = mat[0];
            const varname = mat[1];
            const repl = utils_1.fixPaths(process.env[utils_1.normalizeEnvironmentVarname(varname)] || '') || '';
            subs.set(full, repl);
        }
        if (vscode.workspace.workspaceFolders &&
            vscode.workspace.workspaceFolders.length > 0) {
            const folder_re = RegExp(`\\$\\{workspaceFolder:(${varValueRegexp})\\}`, 'g');
            mat = folder_re.exec(tmpl);
            while (mat) {
                const full = mat[0];
                const folderName = mat[1];
                const f = vscode.workspace.workspaceFolders.find((folder) => folder.name.toLocaleLowerCase() === folderName.toLocaleLowerCase());
                if (f) {
                    subs.set(full, f.uri.fsPath);
                }
                else {
                    log.logWarning(`workspace folder ${folderName} not found`);
                }
                mat = folder_re.exec(tmpl);
            }
        }
        const command_re = RegExp(`\\$\\{command:(${varValueRegexp})\\}`, 'g');
        while ((mat = command_re.exec(tmpl))) {
            if (opts.doNotSupportCommands) {
                log.logWarning(`Commands are not supported for string: ${tmpl}`);
                break;
            }
            const full = mat[0];
            const command = mat[1];
            if (subs.has(full)) {
                continue; // Don't execute commands more than once per string
            }
            try {
                const command_ret = yield vscode.commands.executeCommand(command, opts.vars.workspaceFolder);
                subs.set(full, `${command_ret}`);
            }
            catch (e) {
                log.logWarning(`Exception while executing command ${command} for string: ${tmpl} ${utils_1.errorToString(e)}`);
            }
        }
        let final_str = tmpl;
        let didReplacement = false;
        subs.forEach((value, key) => {
            if (value !== key) {
                final_str = utils_1.replaceAll(final_str, key, value);
                didReplacement = true;
            }
        });
        return { result: final_str, didReplacement };
    });
}
exports.expandStringHelper = expandStringHelper;
//# sourceMappingURL=config.js.map
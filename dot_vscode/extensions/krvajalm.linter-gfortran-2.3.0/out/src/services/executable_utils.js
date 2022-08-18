"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixPaths = exports.normalizeEnvironmentVarname = exports.mergeEnvironment = exports.escapeStringForRegex = exports.replaceAll = exports.errorToString = void 0;
function errorToString(e) {
    if (e.stack) {
        // e.stack has both the message and the stack in it.
        return `\n\t${e.stack}`;
    }
    return `\n\t${e.toString()}`;
}
exports.errorToString = errorToString;
function replaceAll(str, needle, what) {
    const pattern = escapeStringForRegex(needle);
    const re = new RegExp(pattern, 'g');
    return str.replace(re, what);
}
exports.replaceAll = replaceAll;
/**
 * Escape a string so it can be used as a regular expression
 */
function escapeStringForRegex(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
exports.escapeStringForRegex = escapeStringForRegex;
function mergeEnvironment(...env) {
    return env.reduce((acc, vars) => {
        if (process.platform === 'win32') {
            // Env vars on windows are case insensitive, so we take the ones from
            // active env and overwrite the ones in our current process env
            const norm_vars = Object.getOwnPropertyNames(vars).reduce((acc2, key) => {
                acc2[normalizeEnvironmentVarname(key)] = vars[key];
                return acc2;
            }, {});
            return Object.assign(Object.assign({}, acc), norm_vars);
        }
        else {
            return Object.assign(Object.assign({}, acc), vars);
        }
    }, {});
}
exports.mergeEnvironment = mergeEnvironment;
function normalizeEnvironmentVarname(varname) {
    return process.platform === 'win32' ? varname.toUpperCase() : varname;
}
exports.normalizeEnvironmentVarname = normalizeEnvironmentVarname;
/**
 * Fix slashes in Windows paths for CMake
 * @param str The input string
 * @returns The modified string with fixed paths
 */
function fixPaths(str) {
    const fix_paths = /[A-Z]:(\\((?![<>:\"\/\\|\?\*]).)+)*\\?(?!\\)/gi;
    let pathmatch = null;
    let newstr = str;
    while ((pathmatch = fix_paths.exec(str))) {
        const pathfull = pathmatch[0];
        const fixslash = pathfull.replace(/\\/g, '/');
        newstr = newstr.replace(pathfull, fixslash);
    }
    return newstr;
}
exports.fixPaths = fixPaths;
//# sourceMappingURL=utils.js.map
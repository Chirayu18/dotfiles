"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envPath = void 0;
const fs = require("fs");
const path = require("path");
const tools_1 = require("./tools");
let binPathCache = {};
exports.envPath = process.env['PATH'] ||
    (process.platform === 'win32' ? process.env['Path'] : null);
// checks in the PATH defined in the PATH env variables
// for the specified tools and returns its complete path
function getBinPath(tool) {
    if (binPathCache[tool])
        return binPathCache[tool];
    const binDirPaths = exports.envPath.split(path.delimiter);
    const binName = getBinName(tool);
    const possiblePaths = binDirPaths.map(binDirPath => path.join(binDirPath, binName));
    for (let p of possiblePaths) {
        if (fileExists(p)) {
            // save in cache
            binPathCache[tool] = p;
            return p;
        }
    }
    return null;
}
exports.default = getBinPath;
function getBinName(tool) {
    return tools_1.toolBinNames[tool];
}
function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (e) {
        return false;
    }
}
//# sourceMappingURL=paths.js.map
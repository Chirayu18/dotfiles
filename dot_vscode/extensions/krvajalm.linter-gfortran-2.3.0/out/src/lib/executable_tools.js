"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installTool = exports.toolBinNames = exports.LANG_SERVER_TOOL_ID = void 0;
exports.LANG_SERVER_TOOL_ID = 'fortran-langserver';
const cp = require("child_process");
exports.toolBinNames = {
    [exports.LANG_SERVER_TOOL_ID]: 'fortls',
    'gnu-compiler': 'gfortran',
};
function installTool(toolname) {
    if (toolname === exports.LANG_SERVER_TOOL_ID) {
        const installProcess = cp.spawn('pip', 'install fortran-language-server'.split(' '));
        installProcess.on('exit', (code, signal) => {
            if (code !== 0) {
                // extension failed to install
            }
        });
        installProcess.on('error', err => {
            // failed to install
        });
    }
}
exports.installTool = installTool;
//# sourceMappingURL=tools.js.map
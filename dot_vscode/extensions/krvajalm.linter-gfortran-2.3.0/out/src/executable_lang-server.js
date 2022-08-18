"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForLangServer = exports.FortranLangServer = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
const vscode = require("vscode");
const helper_1 = require("./lib/helper");
const tools_1 = require("./lib/tools");
class FortranLangServer {
    constructor(context, config) {
        let langServerFlags = config.get('languageServerFlags', []);
        const serverOptions = {
            command: helper_1.getBinPath(tools_1.LANG_SERVER_TOOL_ID),
            args: [...langServerFlags],
            options: {},
        };
        const clientOptions = {
            documentSelector: [helper_1.FORTRAN_FREE_FORM_ID],
        };
        this.c = new vscode_languageclient_1.LanguageClient('fortran-langserver', serverOptions, clientOptions);
    }
    start() {
        this.c.start();
    }
    onReady() {
        return this.c.onReady();
    }
    getCapabilities() {
        const capabilities = this.c.initializeResult && this.c.initializeResult.capabilities;
        return capabilities;
    }
}
exports.FortranLangServer = FortranLangServer;
function checkForLangServer(config) {
    const useLangServer = false; //config.get('useLanguageServer')
    if (!useLangServer)
        return false;
    if (process.platform === 'win32') {
        vscode.window.showInformationMessage('The Fortran language server is not supported on Windows yet.');
        return false;
    }
    let langServerAvailable = helper_1.getBinPath('fortran-langserver');
    if (!langServerAvailable) {
        helper_1.promptForMissingTool(tools_1.LANG_SERVER_TOOL_ID);
        vscode.window.showInformationMessage('Reload VS Code window after installing the Fortran language server');
    }
    return true;
}
exports.checkForLangServer = checkForLangServer;
//# sourceMappingURL=lang-server.js.map
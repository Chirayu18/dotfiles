"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// src/extension.ts
const vscode = require("vscode");
const linter_provider_1 = require("./features/linter-provider");
const hover_provider_1 = require("./features/hover-provider");
const completion_provider_1 = require("./features/completion-provider");
const document_symbol_provider_1 = require("./features/document-symbol-provider");
const helper_1 = require("./lib/helper");
const lang_server_1 = require("./lang-server");
const logging_service_1 = require("./services/logging-service");
const pkg = require("../package.json");
function activate(context) {
    const loggingService = new logging_service_1.LoggingService();
    const extensionConfig = vscode.workspace.getConfiguration(helper_1.EXTENSION_ID);
    loggingService.logInfo(`Extension Name: ${pkg.displayName}`);
    loggingService.logInfo(`Extension Version: ${pkg.version}`);
    if (extensionConfig.get('linterEnabled', true)) {
        let linter = new linter_provider_1.default(loggingService);
        linter.activate(context.subscriptions);
        vscode.languages.registerCodeActionsProvider(helper_1.FORTRAN_FREE_FORM_ID, linter);
    }
    else {
        loggingService.logInfo('Linter is not enabled');
    }
    if (extensionConfig.get('provideCompletion', true)) {
        let completionProvider = new completion_provider_1.FortranCompletionProvider(loggingService);
        vscode.languages.registerCompletionItemProvider(helper_1.FORTRAN_FREE_FORM_ID, completionProvider);
    }
    else {
        loggingService.logInfo('Completion Provider is not enabled');
    }
    if (extensionConfig.get('provideHover', true)) {
        let hoverProvider = new hover_provider_1.default(loggingService);
        vscode.languages.registerHoverProvider(helper_1.FORTRAN_FREE_FORM_ID, hoverProvider);
    }
    else {
        loggingService.logInfo('Hover Provider is not enabled');
    }
    if (extensionConfig.get('provideSymbols', true)) {
        let symbolProvider = new document_symbol_provider_1.FortranDocumentSymbolProvider();
        vscode.languages.registerDocumentSymbolProvider(helper_1.FORTRAN_FREE_FORM_ID, symbolProvider);
    }
    else {
        loggingService.logInfo('Symbol Provider is not enabled');
    }
    if (lang_server_1.checkForLangServer(extensionConfig)) {
        const langServer = new lang_server_1.FortranLangServer(context, extensionConfig);
        langServer.start();
        langServer.onReady().then(() => {
            const capabilities = langServer.getCapabilities();
            if (!capabilities) {
                return vscode.window.showErrorMessage('The language server is not able to serve any features at the moment.');
            }
        });
    }
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
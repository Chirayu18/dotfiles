"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const helper_1 = require("../lib/helper");
class FortranHoverProvider {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    provideHover(document, position, token) {
        let wordRange = document.getWordRangeAtPosition(position);
        let word = document.getText(wordRange);
        if (helper_1.isIntrinsic(word)) {
            return new vscode_1.Hover(helper_1.loadDocString(word));
        }
    }
}
exports.default = FortranHoverProvider;
//# sourceMappingURL=hover-provider.js.map
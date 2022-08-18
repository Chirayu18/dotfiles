"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FortranCompletionProvider = void 0;
const vscode = require("vscode");
const helper_1 = require("../lib/helper");
const functions_1 = require("../lib/functions");
const helper_2 = require("../lib/helper");
class CaseCoverter {
    constructor(preferredCase = CaseCoverter.LOWER) {
        this.preferredCase = preferredCase;
    }
    convert(word) {
        if (this.preferredCase === CaseCoverter.LOWER) {
            return this.toLower(word);
        }
        else if (this.preferredCase === CaseCoverter.UPPER) {
            return this.toUpper(word);
        }
        throw new Error(`the provided case ${this.preferredCase} is not supported`);
    }
    toLower(word) {
        return word.toLowerCase();
    }
    toUpper(word) {
        return word.toUpperCase();
    }
}
CaseCoverter.LOWER = 'lowercase';
CaseCoverter.UPPER = 'uppercase';
class FortranCompletionProvider {
    constructor(loggingService) {
        this.loggingService = loggingService;
    }
    provideCompletionItems(document, position, token) {
        return this.provideCompletionItemsInternal(document, position, token, vscode.workspace.getConfiguration(helper_2.EXTENSION_ID));
    }
    provideCompletionItemsInternal(document, position, token, config) {
        return new Promise((resolve, reject) => {
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);
            // nothing to complete
            if (lineText.match(/^\s*\/\//)) {
                return resolve([]);
            }
            let inString = helper_1.isPositionInString(document, position);
            if (!inString && lineTillCurrentPosition.endsWith('"')) {
                // completing a string
                return resolve([]);
            }
            let currentWord = this.getCurrentWord(document, position);
            if (currentWord.match(/^\d+$/)) {
                // starts with a number
                return resolve([]);
            }
            const caseConverter = new CaseCoverter(config.get('preferredCase'));
            if (currentWord.length === 0) {
                resolve([]);
            }
            const intrinsicSuggestions = this.getIntrinsicSuggestions(currentWord, caseConverter);
            // add keyword suggestions
            const keywordSuggestions = this.getKeywordSuggestions(currentWord);
            const functionSuggestions = this.getFunctionSuggestions(document, currentWord);
            return resolve([
                ...intrinsicSuggestions,
                ...keywordSuggestions,
                ...functionSuggestions,
            ]);
        });
    }
    getIntrinsicSuggestions(currentWord, caseConverter) {
        return helper_1.intrinsics
            .filter((i) => i.startsWith(currentWord.toUpperCase()))
            .map((intrinsic) => {
            return new vscode.CompletionItem(caseConverter.convert(intrinsic), vscode.CompletionItemKind.Method);
        });
    }
    getKeywordSuggestions(currentWord) {
        return helper_1.FORTRAN_KEYWORDS.filter((keyword) => keyword.startsWith(currentWord.toUpperCase())).map((keyword) => {
            return new vscode.CompletionItem(keyword.toLowerCase(), vscode.CompletionItemKind.Keyword);
        });
    }
    getFunctionSuggestions(document, currentWord) {
        const functions = functions_1.getDeclaredFunctions(document);
        // check for available functions
        return functions
            .filter((fun) => fun.name.startsWith(currentWord))
            .map((fun) => {
            return new vscode.CompletionItem(`${fun.name}(`, vscode.CompletionItemKind.Function);
        });
    }
    getCurrentWord(document, position) {
        let wordAtPosition = document.getWordRangeAtPosition(position);
        let currentWord = '';
        if (wordAtPosition && wordAtPosition.start.character < position.character) {
            let word = document.getText(wordAtPosition);
            currentWord = word.substr(0, position.character - wordAtPosition.start.character);
        }
        return currentWord;
    }
}
exports.FortranCompletionProvider = FortranCompletionProvider;
//# sourceMappingURL=completion-provider.js.map
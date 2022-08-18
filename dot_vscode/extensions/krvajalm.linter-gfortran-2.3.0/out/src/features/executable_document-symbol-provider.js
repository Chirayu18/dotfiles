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
exports.FortranDocumentSymbolProvider = void 0;
const vscode = require("vscode");
const functions_1 = require("../lib/functions");
const variables_1 = require("../lib/variables");
class FortranDocumentSymbolProvider {
    constructor() {
        this.parseDoc = (document) => __awaiter(this, void 0, void 0, function* () {
            let lines = document.lineCount;
            let symbols = [];
            const symbolTypes = this.getSymbolTypes();
            for (let i = 0; i < lines; i++) {
                let line = document.lineAt(i);
                if (line.isEmptyOrWhitespace)
                    continue;
                let initialCharacter = line.text.trim().charAt(0);
                if (initialCharacter === '!' || initialCharacter === '#')
                    continue;
                const symbolsInLine = symbolTypes
                    .map((type) => this.getSymbolsOfType(type))
                    .map((fn) => fn(line))
                    .filter((symb) => symb !== undefined);
                if (symbolsInLine.length > 0) {
                    symbols = symbols.concat(symbolsInLine);
                }
            }
            return symbols;
        });
    }
    provideDocumentSymbols(document, token) {
        const cancel = new Promise((resolve, reject) => {
            token.onCancellationRequested((evt) => {
                reject(0);
            });
        });
        return Promise.race([this.parseDoc(document), cancel]);
    }
    getSymbolsOfType(type) {
        switch (type) {
            case 'subroutine':
                return this.parseSubroutineDefinition;
            case 'function':
                return this.parseFunctionDefinition;
            case 'variable':
                return this.parseVariableDefinition;
            default:
                return () => undefined;
        }
    }
    parseSubroutineDefinition(line) {
        try {
            const subroutine = functions_1.parseSubroutine(line);
            if (subroutine) {
                let range = new vscode.Range(line.range.start, line.range.end);
                return new vscode.SymbolInformation(subroutine.name, vscode.SymbolKind.Function, range);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    parseFunctionDefinition(line) {
        const fun = functions_1.parseFunction(line);
        if (fun) {
            let range = new vscode.Range(line.range.start, line.range.end);
            return new vscode.SymbolInformation(fun.name, vscode.SymbolKind.Function, range);
        }
    }
    parseVariableDefinition(line) {
        const variable = variables_1.parseVars(line);
        if (variable) {
            let range = new vscode.Range(line.range.start, line.range.end);
            return new vscode.SymbolInformation(variable.name, vscode.SymbolKind.Variable, range);
        }
    }
    getSymbolTypes() {
        let config = vscode.workspace.getConfiguration('fortran');
        const symbolTypes = config.get('symbols', [
            'subroutine',
            'function',
        ]);
        return symbolTypes;
    }
}
exports.FortranDocumentSymbolProvider = FortranDocumentSymbolProvider;
//# sourceMappingURL=document-symbol-provider.js.map
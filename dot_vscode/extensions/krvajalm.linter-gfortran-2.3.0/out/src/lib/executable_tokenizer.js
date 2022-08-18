"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["FUNCTION"] = 0] = "FUNCTION";
    TokenType[TokenType["SUBROUTINE"] = 1] = "SUBROUTINE";
    TokenType[TokenType["NUMBER"] = 2] = "NUMBER";
    TokenType[TokenType["VARIABLE"] = 3] = "VARIABLE";
    TokenType[TokenType["END"] = 4] = "END";
    TokenType[TokenType["DO"] = 5] = "DO";
    TokenType[TokenType["IF"] = 6] = "IF";
    TokenType[TokenType["LEFT_PARENTESIS"] = 7] = "LEFT_PARENTESIS";
    TokenType[TokenType["RIGHT_PARENTESIS"] = 8] = "RIGHT_PARENTESIS";
    TokenType[TokenType["COMMA"] = 9] = "COMMA";
    TokenType[TokenType["BINARY_OPERATOR"] = 10] = "BINARY_OPERATOR";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
class Tokenizer {
    constructor() {
        this.tokenInfos = [];
        this.tokens = [];
    }
    add(regex, token) {
        this.tokenInfos.push({ pattern: regex, token: token });
    }
    tokenize(expression) {
        this.tokens = [];
        while (expression !== "") {
            let match = false;
            for (let i = 0; i < this.tokenInfos.length; i++) {
                let info = this.tokenInfos[i];
                let result = info.pattern.exec(expression);
                if (result && result.length > 0) {
                    match = true;
                    this.tokens.push({ token: info.token, sequence: result[0].trim() });
                    expression = expression.replace(info.pattern, "");
                    break;
                }
            }
        }
    }
}
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=tokenizer.js.map
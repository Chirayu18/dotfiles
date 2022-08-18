"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVars = exports.getDeclaredVars = void 0;
const varibleDecRegEx = /([a-zA-Z]{1,}(\([a-zA-Z0-9]{1,}\))?)(\s*,\s*[a-zA-Z\(\)])*\s*::\s*([a-zA-Z_][a-zA-Z0-9_]*)/g;
function getDeclaredVars(document) {
    let lines = document.lineCount;
    let vars = [];
    for (let i = 0; i < lines; i++) {
        let line = document.lineAt(i);
        if (line.isEmptyOrWhitespace)
            continue;
        let newVar = exports.parseVars(line);
        if (newVar) {
            vars.push(Object.assign(Object.assign({}, newVar), { lineNumber: i }));
        }
    }
    return vars;
}
exports.getDeclaredVars = getDeclaredVars;
exports.parseVars = (line) => {
    if (line.text.match(varibleDecRegEx)) {
        let [matchExp, type, kind, props, name] = varibleDecRegEx.exec(line.text);
        return { name: name, type: type };
    }
};
//# sourceMappingURL=variables.js.map
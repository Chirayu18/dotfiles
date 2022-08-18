"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validVariableName = exports.parseArgs = exports._parse = exports.parseSubroutine = exports.parseFunction = exports.getDeclaredSubroutines = exports.getDeclaredFunctions = exports.MethodType = void 0;
var MethodType;
(function (MethodType) {
    MethodType[MethodType["Subroutine"] = 0] = "Subroutine";
    MethodType[MethodType["Function"] = 1] = "Function";
})(MethodType = exports.MethodType || (exports.MethodType = {}));
function getDeclaredFunctions(document) {
    let lines = document.lineCount;
    let funcs = [];
    for (let i = 0; i < lines; i++) {
        let line = document.lineAt(i);
        if (line.isEmptyOrWhitespace)
            continue;
        let newFunc = exports.parseFunction(line);
        if (newFunc) {
            funcs.push(newFunc);
        }
    }
    return funcs;
}
exports.getDeclaredFunctions = getDeclaredFunctions;
function getDeclaredSubroutines(document) {
    let lines = document.lineCount;
    let subroutines = [];
    for (let i = 0; i < lines; i++) {
        let line = document.lineAt(i);
        if (line.isEmptyOrWhitespace)
            continue;
        let newSubroutine = exports.parseSubroutine(line);
        if (newSubroutine) {
            subroutines.push(newSubroutine);
        }
    }
    return subroutines;
}
exports.getDeclaredSubroutines = getDeclaredSubroutines;
exports.parseFunction = (line) => {
    return exports._parse(line, MethodType.Function);
};
exports.parseSubroutine = (line) => {
    return exports._parse(line, MethodType.Subroutine);
};
exports._parse = (line, type) => {
    const functionRegEx = /(?<=([a-zA-Z]+(\([\w.=]+\))*)*)\s*\bfunction\b\s*([a-zA-Z_][a-z0-9_]*)\s*\((\s*[a-z_][a-z0-9_,\s]*)*\s*(?:\)|\&)\s*(result\([a-z_][\w]*(?:\)|\&))*/i;
    const subroutineRegEx = /^\s*(?!\bend\b)\w*\s*\bsubroutine\b\s*([a-z][a-z0-9_]*)\s*(?:\((\s*[a-z][a-z0-9_,\s]*)*\s*(\)|\&))*/i;
    const regEx = type === MethodType.Subroutine ? subroutineRegEx : functionRegEx;
    if (type === MethodType.Subroutine && line.text.toLowerCase().indexOf("subroutine") < 0)
        return;
    if (type === MethodType.Function && line.text.toLowerCase().indexOf("function") < 0)
        return;
    const searchResult = regEx.exec(line.text);
    if (searchResult && type === MethodType.Function) {
        let [attr, kind_descriptor, name, argsstr, result] = searchResult.slice(1, 5);
        let args = argsstr ? exports.parseArgs(argsstr) : [];
        return {
            name: name,
            args: args,
            lineNumber: line.lineNumber
        };
    }
    else if (searchResult && type === MethodType.Subroutine) {
        let [name, argsstr] = searchResult.slice(1);
        let args = argsstr ? exports.parseArgs(argsstr) : [];
        return {
            name: name,
            args: args,
            lineNumber: line.lineNumber
        };
    }
};
exports.parseArgs = (argsstr) => {
    let args = argsstr.trim().split(",");
    let variables = args
        .filter(name => exports.validVariableName(name))
        .map(name => {
        return { name: name };
    });
    return variables;
};
exports.validVariableName = (name) => {
    return name.trim().match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) !== null;
};
//# sourceMappingURL=functions.js.map
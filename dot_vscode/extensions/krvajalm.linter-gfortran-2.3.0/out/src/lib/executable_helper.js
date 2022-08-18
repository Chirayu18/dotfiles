"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptForMissingTool = exports.isPositionInString = exports.getIncludeParams = exports._loadDocString = exports.loadDocString = exports.isIntrinsic = exports.FORTRAN_KEYWORDS = exports.EXTENSION_ID = exports.intrinsics = exports.FORTRAN_FREE_FORM_ID = exports.LANGUAGE_ID = void 0;
const fs = require("fs");
const vscode = require("vscode");
const fortran_intrinsics_1 = require("./fortran-intrinsics");
exports.intrinsics = fortran_intrinsics_1.default;
const tools_1 = require("./tools");
// IMPORTANT: this should match the value
// on the package.json otherwise the extension won't
// work at all
exports.LANGUAGE_ID = 'FortranFreeForm';
exports.FORTRAN_FREE_FORM_ID = { language: exports.LANGUAGE_ID, scheme: 'file' };
exports.EXTENSION_ID = 'fortran';
exports.FORTRAN_KEYWORDS = [
    'FUNCTION',
    'MODULE',
    'SUBROUTINE',
    'CONTAINS',
    'USE',
    'KIND',
    'DO',
    'IF',
    'ELIF',
    'END',
    'IMPLICIT',
];
exports.isIntrinsic = keyword => {
    return (fortran_intrinsics_1.default.findIndex(intrinsic => intrinsic === keyword.toUpperCase()) !==
        -1);
};
exports.loadDocString = keyword => {
    keyword = keyword.toUpperCase();
    let filepath = __dirname + '/../docs/' + keyword + '.json';
    let docstr = fs.readFileSync(filepath).toString();
    let doc = JSON.parse(docstr);
    return doc.docstr;
};
exports._loadDocString = (keyword) => {
    keyword = keyword.toUpperCase();
    let docStringBuffer = fs.readFileSync(__dirname + '/../../../src/docs/' + keyword + '.html');
    let docText = docStringBuffer.toString();
    const codeRegex = /<code>(.+?)<\/code>\n?/g;
    const varRegex = /<var>(.+?)<\/var>/g;
    const spanRegex = /<samp><span class="command">(\w+)<\/span><\/samp>/g;
    const tableRegex = /<table\s*.*>([\s\w<>\/\W]+?)<\/table>/g;
    const codeExampleRegex = /<code class="smallexample"[\s\W\w]*?>([\s\W\w<>]*?)<\/code>/g;
    const headerRegex = /^ *<h(\d)>(.+?)<\/h\1>\n?/gm;
    const defListRegex = /<dt>([\w\W]+?)<\/dt><dd>([\w\W]+?)(<br>)?<\/dd>/g;
    docText = docText
        .replace(varRegex, (match, code) => {
        return '`' + code + '`';
    })
        .replace(spanRegex, (match, code) => `*${code}*`)
        .replace(defListRegex, (match, entry, def) => `**${entry}** ${def}\n`)
        .replace(codeExampleRegex, (match, code) => '```\n' + code + '\n\n```\n')
        .replace(/<td\s*.*?>([\s\w<>\/\W]+?)<\/td>/g, (match, code) => ' | ' + code)
        .replace(/<tr\s*.*?>([\s\w<>\/\W]+?)<\/tr>/g, (match, code) => code + '\n')
        .replace(/<tbody\s*.*?>([\s\w<>\/\W]+?)<\/tbody>/g, (match, code) => code)
        .replace(tableRegex, (match, code) => code)
        .replace(codeRegex, (match, code) => {
        return '`' + code + '`';
    })
        .replace(/<p>\s*?/g, '\n')
        .replace(/<\/p>\s*?/g, '\n')
        .replace(headerRegex, (match, h, code) => {
        let headerLevel = parseInt(h);
        let header = '#'.repeat(headerLevel);
        return `${header} ${code}\n`;
    });
    docText = docText.replace(/^ *<br>\n?/gm, '\n').replace(/<\?dl>/g, '');
    console.log(docText);
    return docText;
};
exports.getIncludeParams = (paths) => {
    return paths.map(path => `-I${path}`);
};
function isPositionInString(document, position) {
    let lineText = document.lineAt(position.line).text;
    let lineTillCurrentPosition = lineText.substr(0, position.character);
    // Count the number of double quotes in the line till current position. Ignore escaped double quotes
    let doubleQuotesCnt = (lineTillCurrentPosition.match(/\"/g) || []).length;
    let escapedDoubleQuotesCnt = (lineTillCurrentPosition.match(/\\\"/g) || [])
        .length;
    doubleQuotesCnt -= escapedDoubleQuotesCnt;
    return doubleQuotesCnt % 2 === 1;
}
exports.isPositionInString = isPositionInString;
let saveKeywordToJson = keyword => {
    let doc = exports._loadDocString(keyword);
    let docObject = JSON.stringify({ keyword: keyword, docstr: doc });
    fs.appendFile('src/docs/' + keyword + '.json', docObject, function (err) {
        if (err)
            throw err;
        console.log('Saved!');
    });
};
var paths_1 = require("./paths");
Object.defineProperty(exports, "getBinPath", { enumerable: true, get: function () { return paths_1.default; } });
function promptForMissingTool(tool) {
    const items = ['Install'];
    let message = '';
    if (tool === 'fortran-langserver') {
        message =
            'You choose to use the fortranLanguageServer functionality but it is not installed. Please press the Install button to install it';
    }
    vscode.window.showInformationMessage(message, ...items).then(selected => {
        if (selected === 'Install') {
            tools_1.installTool(tool);
        }
    });
}
exports.promptForMissingTool = promptForMissingTool;
//# sourceMappingURL=helper.js.map
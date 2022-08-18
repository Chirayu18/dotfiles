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
const path = require("path");
const test_web_1 = require("@vscode/test-web");
function go() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
            const extensionTestsPath = path.resolve(__dirname, './index');
            console.log(extensionDevelopmentPath, extensionTestsPath);
            const attachArgName = '--waitForDebugger=';
            const waitForDebugger = process.argv.find(arg => arg.startsWith(attachArgName));
            const browserTypeName = '--browserType=';
            const browserType = process.argv.find(arg => arg.startsWith(browserTypeName));
            /**
             * Basic usage
             */
            yield test_web_1.runTests({
                browserType: browserType ? browserType.slice(browserTypeName.length) : 'chromium',
                extensionDevelopmentPath,
                extensionTestsPath,
                waitForDebugger: waitForDebugger ? Number(waitForDebugger.slice(attachArgName.length)) : undefined,
                headless: false
            });
        }
        catch (e) {
            console.log(e);
        }
    });
}
go();

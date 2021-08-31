"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showWelcomeScreen = void 0;
const utils_1 = require("./utils");
async function showWelcomeScreen() {
    return await utils_1.fadeIn(utils_1.get('.welcome-container'), 400);
}
exports.showWelcomeScreen = showWelcomeScreen;

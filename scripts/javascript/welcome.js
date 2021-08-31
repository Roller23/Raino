"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideWelcomeScreen = exports.showWelcomeScreen = void 0;
const utils_1 = require("./utils");
const welcomeScreenContainer = utils_1.get('.welcome-container');
async function showWelcomeScreen() {
    return await utils_1.fadeIn(welcomeScreenContainer, 400);
}
exports.showWelcomeScreen = showWelcomeScreen;
async function hideWelcomeScreen() {
    return await utils_1.fadeOut(welcomeScreenContainer, 400);
}
exports.hideWelcomeScreen = hideWelcomeScreen;
utils_1.get('#welcome-discover').addEventListener('click', function (e) {
    // TODO
    hideWelcomeScreen();
});
utils_1.get('#welcome-create').addEventListener('click', function (e) {
    // TODO
    hideWelcomeScreen();
});
utils_1.get('#welcome-invite').addEventListener('click', function (e) {
    // TODO
    hideWelcomeScreen();
});
utils_1.get('#welcome-add-friends').addEventListener('click', function (e) {
    // TODO
    hideWelcomeScreen();
});
utils_1.get('#welcome-get-help').addEventListener('click', function (e) {
    // TODO
    hideWelcomeScreen();
});

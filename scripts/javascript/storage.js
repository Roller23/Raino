"use strict";
/**
 * A collection of function for localStorage management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultStorageValues = void 0;
/**
 * Sets default values for localStorage
 */
function setDefaultStorageValues() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenSelector');
    localStorage.welcomeScreenShown = 'false';
    localStorage.hiddenLeftPanelVisible = 'true';
}
exports.setDefaultStorageValues = setDefaultStorageValues;

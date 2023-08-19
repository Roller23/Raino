"use strict";
/**
 * Start script to be run on every app launch
 */
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("./storage");
if (localStorage.storageInitialized === undefined) {
    storage_1.setDefaultStorageValues();
    localStorage.storageInitialized = 'true';
}

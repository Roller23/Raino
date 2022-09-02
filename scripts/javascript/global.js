"use strict";
/**
 * Global variables to be shared across modules
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
var Global;
(function (Global) {
    Global.token = null;
    Global.tokenSelector = null;
    Global.socket = null;
    Global.timezone = moment_timezone_1.default.tz.guess();
})(Global = exports.Global || (exports.Global = {}));

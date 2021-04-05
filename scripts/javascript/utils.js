"use strict";
/**
 * Global utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSocket = exports.validEmail = exports.parseJson = exports.request = exports.get = void 0;
const global_1 = require("./global");
function get(selector) {
    return document.querySelector(selector);
}
exports.get = get;
async function request(method, url, data) {
    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: method,
        body: JSON.stringify(data)
    };
    return (await fetch(url, options)).text();
}
exports.request = request;
function parseJson(json) {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        console.log('Could not parse json:', json);
        return null;
    }
}
exports.parseJson = parseJson;
function validEmail(value) {
    const input = document.createElement('input');
    input.type = 'email';
    input.required = true;
    input.value = value;
    return input.checkValidity();
}
exports.validEmail = validEmail;
function authSocket() {
    if (!global_1.Global.token || !global_1.Global.socket)
        return;
    console.log(global_1.Global.tokenSelector);
    global_1.Global.socket.emit('authenticate', {
        selector: global_1.Global.tokenSelector,
        token: global_1.Global.token
    });
}
exports.authSocket = authSocket;

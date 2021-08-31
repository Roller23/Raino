"use strict";
/**
 * Global utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.popup = exports.getElementOffset = exports.create = exports.fadeOut = exports.sleep = exports.authSocket = exports.validEmail = exports.parseJson = exports.request = exports.onAll = exports.on = exports.getAll = exports.get = void 0;
const global_1 = require("./global");
function get(selector) {
    return document.querySelector(selector);
}
exports.get = get;
function getAll(selector) {
    return document.querySelectorAll(selector);
}
exports.getAll = getAll;
function on(el, e, callback) {
    const element = typeof el === 'string' ? get(el) : el;
    element.addEventListener(e, callback);
    return element;
}
exports.on = on;
function onAll(el, e, callback) {
    const elements = typeof el === 'string' ? getAll(el) : el;
    elements.forEach(element => on(element, e, callback));
    return elements;
}
exports.onAll = onAll;
async function request(method, url, data = {}) {
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function fadeOut(el, ms) {
    return new Promise(resolve => {
        const oldTransition = el.style.transition;
        const callback = () => {
            el.style.transition = oldTransition;
            el.style.display = 'none';
            el.removeEventListener('transitionend', callback);
            resolve();
        };
        el.addEventListener('transitionend', callback);
        el.style.opacity = '1';
        el.style.transition = `opacity ${ms}ms`;
        el.style.opacity = '0';
    });
}
exports.fadeOut = fadeOut;
function fadeIn(el, ms, display = 'block') {
    return new Promise(resolve => {
        const oldTransition = el.style.transition;
        const callback = () => {
            el.style.transition = oldTransition;
            el.removeEventListener('transitionend', callback);
            resolve();
        };
        el.addEventListener('transitionend', callback);
        el.style.opacity = '0';
        el.style.display = display;
        el.style.transition = `opacity ${ms}ms`;
        setTimeout(() => el.style.opacity = '1', 10);
    });
}
exports.fadeIn = fadeIn;
function create(tag, attrs = {}, text = '') {
    const res = document.createElement(tag);
    Object.keys(attrs).forEach(key => {
        res.setAttribute(key, attrs[key]);
    });
    if (text) {
        res.innerText = text;
    }
    return res;
}
exports.create = create;
/**
 * Returns an element's position relative to the whole document (page).
 *
 * @example getOffset(document.getElementById('#element'));
 *
 * @param el
 * @see https://stackoverflow.com/a/28222246/2391795
 */
const getElementOffset = (el) => {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX + el.offsetWidth,
        top: rect.top + window.scrollY + Math.floor(el.offsetHeight / 2),
    };
};
exports.getElementOffset = getElementOffset;
/**
 * Displays a message to the users
 * For now it's just built-in alert(), but we'll rewrite it to something fancier in the future
 *
 * @param msg message to be displayed
 */
const popup = (msg) => {
    alert(msg);
};
exports.popup = popup;

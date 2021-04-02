"use strict";
/**
 * Global utility functions
 * Mainly for DOM stuff
 */
const get = (selector) => {
    return document.querySelector(selector);
};
HTMLElement.prototype.on = function (event, callback) {
    this.addEventListener(event, callback);
    return this;
};

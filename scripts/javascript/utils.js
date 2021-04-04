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
const request = async (method, url, data) => {
    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: method,
        body: JSON.stringify(data)
    };
    return (await fetch(url, options)).text();
};
const parseJson = (json) => {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        console.log('Could not parse json:', json);
        return null;
    }
};
const validEmail = (value) => {
    const input = document.createElement('input');
    input.type = 'email';
    input.required = true;
    input.value = value;
    return input.checkValidity();
};

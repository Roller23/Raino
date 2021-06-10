"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToolTip = exports.removeTooltips = exports.createTooltip = void 0;
const utils_1 = require("./utils");
/**
 * Creates a tooltip and appends it to <body>
 * @param text tooltip's text
 * @param pos tooltip's fixed position
 */
function createTooltip(text, pos) {
    const tooltip = utils_1.create('div', { class: 'tooltip' }, text);
    tooltip.style.top = `${pos.top}px`;
    tooltip.style.left = `${pos.left + 10}px`;
    document.body.append(tooltip);
    setTimeout(() => tooltip.classList.add('visible'), 20);
}
exports.createTooltip = createTooltip;
/**
 * For now this function assumes that only one tooltip can exists at a time
 * in case that changes this function needs to be rewritten
 */
function removeTooltips() {
    utils_1.getAll('.tooltip').forEach(tooltip => {
        tooltip.classList.remove('visible');
        tooltip.addEventListener('transitionend', e => tooltip.remove());
    });
}
exports.removeTooltips = removeTooltips;
/**
 * Used to create tooltips for dynamic elements
 * @param element element to the tooltip's position will be relative to
 * @param text tooltip text
 */
function addToolTip(element, text) {
    element.addEventListener('mouseenter', function (e) {
        createTooltip(text, utils_1.getElementOffset(this));
    });
    element.addEventListener('mouseleave', removeTooltips);
}
exports.addToolTip = addToolTip;
(() => {
    // Add listeners for static tooltips
    utils_1.getAll('[tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function (e) {
            const tipStr = this.getAttribute('tooltip');
            if (!tipStr)
                return;
            createTooltip(tipStr, utils_1.getElementOffset(this));
        });
        element.addEventListener('mouseleave', removeTooltips);
    });
})();

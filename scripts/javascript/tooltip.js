"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToolTip = exports.removeTooltips = exports.createTooltip = void 0;
const utils_1 = require("./utils");
function createTooltip(text, pos) {
    const tooltip = utils_1.create('div', { class: 'tooltip' }, text);
    tooltip.style.top = `${pos.top}px`;
    tooltip.style.left = `${pos.left + 10}px`;
    document.body.append(tooltip);
    setTimeout(() => tooltip.classList.add('visible'), 20);
}
exports.createTooltip = createTooltip;
function removeTooltips() {
    // for now this function assumes that only one tooltip can exists at a time
    // in case that changes this function needs to be rewritten
    utils_1.getAll('.tooltip').forEach(tooltip => {
        tooltip.classList.remove('visible');
        tooltip.addEventListener('transitionend', e => tooltip.remove());
    });
}
exports.removeTooltips = removeTooltips;
function addToolTip(element, text) {
    // for dynamically created tooltips
    element.addEventListener('mouseenter', function (e) {
        createTooltip(text, utils_1.getElementOffset(this));
    });
    element.addEventListener('mouseleave', removeTooltips);
}
exports.addToolTip = addToolTip;
(() => {
    utils_1.getAll('[tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function (e) {
            const tipStr = this.getAttribute('tooltip');
            if (!tipStr)
                return;
            const pos = utils_1.getElementOffset(this);
            createTooltip(tipStr, pos);
        });
        element.addEventListener('mouseleave', removeTooltips);
    });
})();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const remote = require('electron').remote;
const win = remote.getCurrentWindow();
const isMacOS = (process.platform === "darwin");
if (!isMacOS) {
    utils_1.getAll('.window-controls').forEach(el => el.style.display = 'grid');
}
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};
window.onbeforeunload = () => {
    win.removeAllListeners();
};
function handleWindowControls() {
    utils_1.onAll('.window-controls .minimizeBtn', 'click', e => win.minimize());
    utils_1.onAll('.window-controls .maximizeBtn', 'click', e => win.maximize());
    utils_1.onAll('.window-controls .restoreBtn', 'click', e => win.unmaximize());
    utils_1.onAll('.window-controls .closeBtn', 'click', e => win.hide());
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);
    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            utils_1.getAll('.maximizeBtn').forEach(btn => btn.style.display = 'none');
            utils_1.getAll('.restoreBtn').forEach(btn => btn.style.display = 'flex');
        }
        else {
            utils_1.getAll('.maximizeBtn').forEach(btn => btn.style.display = 'flex');
            utils_1.getAll('.restoreBtn').forEach(btn => btn.style.display = 'none');
        }
    }
}

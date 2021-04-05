"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const remote = require('electron').remote;
const win = remote.getCurrentWindow();
const isMacOS = (process.platform === "darwin");
if (!isMacOS) {
    utils_1.get('.window-controls').style.display = 'grid';
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
    utils_1.get('#minimizeBtn').addEventListener("click", (event) => {
        win.minimize();
    });
    utils_1.get('#maximizeBtn').addEventListener("click", (event) => {
        win.maximize();
    });
    utils_1.get('#restoreBtn').addEventListener("click", (event) => {
        win.unmaximize();
    });
    utils_1.get('#closeBtn').addEventListener("click", (event) => {
        win.hide();
    });
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);
    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            utils_1.get("#maximizeBtn").style.display = "none";
            utils_1.get("#restoreBtn").style.display = "flex";
        }
        else {
            utils_1.get("#maximizeBtn").style.display = "flex";
            utils_1.get("#restoreBtn").style.display = "none";
        }
    }
}

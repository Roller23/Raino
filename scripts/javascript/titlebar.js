"use strict";
const remote = require('electron').remote;
const win = remote.getCurrentWindow();
document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};
window.onbeforeunload = () => {
    win.removeAllListeners();
};
function handleWindowControls() {
    get('#minimizeBtn').on("click", event => {
        win.minimize();
    });
    get('#maximizeBtn').on("click", event => {
        win.maximize();
    });
    get('#restoreBtn').on("click", event => {
        win.unmaximize();
    });
    get('#closeBtn').on("click", event => {
        win.hide();
    });
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);
    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            get("#maximizeBtn").style.display = "none";
            get("#restoreBtn").style.display = "flex";
        }
        else {
            get("#maximizeBtn").style.display = "flex";
            get("#restoreBtn").style.display = "none";
        }
    }
}

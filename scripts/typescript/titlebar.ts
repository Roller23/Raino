import { getAll, onAll } from "./utils";

const remote = require('electron').remote;

const win = remote.getCurrentWindow();
const isMacOS = (process.platform === "darwin")

if (!isMacOS) {
    getAll('.window-controls').forEach(el => el.style.display = 'grid');
}

document.onreadystatechange = (event: Event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

window.onbeforeunload = () => {
    win.removeAllListeners();
}

function handleWindowControls() {
    onAll('.window-controls .minimizeBtn', 'click', e => win.minimize());

    onAll('.window-controls .maximizeBtn', 'click', e => win.maximize());

    onAll('.window-controls .restoreBtn', 'click', e => win.unmaximize());

    onAll('.window-controls .closeBtn', 'click', e => win.hide());

    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons(): void {
        if(win.isMaximized()) {
            getAll('.maximizeBtn').forEach(btn => btn.style.display = 'none');
            getAll('.restoreBtn').forEach(btn => btn.style.display = 'flex');
        }
        else {
            getAll('.maximizeBtn').forEach(btn => btn.style.display = 'flex');
            getAll('.restoreBtn').forEach(btn => btn.style.display = 'none');
        }
    }
}


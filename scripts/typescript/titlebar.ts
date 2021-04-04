import { get } from "./utils";

const remote = require('electron').remote;

const win = remote.getCurrentWindow();
const isMacOS = (process.platform === "darwin")

if (!isMacOS) {
    get('.window-controls')!.style.display = 'grid';
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
    get('#minimizeBtn')!.addEventListener("click", (event: Event) => {
        win.minimize();
    });

    get('#maximizeBtn')!.addEventListener("click", (event: Event) => {
        win.maximize();
    });

    get('#restoreBtn')!.addEventListener("click", (event: Event) => {
        win.unmaximize();
    });

    get('#closeBtn')!.addEventListener("click", (event: Event) => {
        win.hide();
    });

    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons(): void {
        if(win.isMaximized()) {
            get("#maximizeBtn")!.style.display="none";
            get("#restoreBtn")!.style.display="flex";
        }
        else {
            get("#maximizeBtn")!.style.display="flex";
            get("#restoreBtn")!.style.display="none";
        }
    }
}


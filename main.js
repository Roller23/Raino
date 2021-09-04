const { app, Menu, Tray, BrowserWindow, globalShortcut } = require('electron')

const isMacOS = (process.platform === "darwin")
let tray = null

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: isMacOS,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')
}

function manageShortcuts() {
  const zoomInRegister = globalShortcut.register('CommandOrControl+=', () => {
    let focusedWindow = BrowserWindow.getFocusedWindow()
    if(focusedWindow)
    {
      let zoomLevel = focusedWindow.webContents.getZoomLevel()
      if (zoomLevel < 2)
        BrowserWindow.getFocusedWindow().webContents.setZoomLevel(zoomLevel + 0.1)
    }
  })

  const zoomOutRegister = globalShortcut.register('CommandOrControl+-', () => {
    let focusedWindow = BrowserWindow.getFocusedWindow()
    if(focusedWindow)
    {
      let zoomLevel = focusedWindow.webContents.getZoomLevel()
      if (zoomLevel > -0.5)
        BrowserWindow.getFocusedWindow().webContents.setZoomLevel(zoomLevel - 0.1)
    }
  })

  if (!zoomInRegister || !zoomOutRegister) {
    console.log('registration failed')
  }

  globalShortcut.register('CommandOrControl+Shift+=',()=>{});
  // for debuging purposes
  // globalShortcut.register('CommandOrControl+W',()=>{}); 
}

function initTray() {
  if (isMacOS) return; // building Tray breaks builds on MacOS
  tray = new Tray('images/tray-icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: "Show", type: "normal", click: () => {
      BrowserWindow.getAllWindows().forEach((e) => e.show())
    }},
    {label: "Quit", type: "normal", role: "quit"}
  ])
  tray.setToolTip("RAINO")
  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => {
    BrowserWindow.getAllWindows().forEach((e) => e.show())
  })
}

app.whenReady().then(() => {
  initTray()
  createWindow()
  manageShortcuts()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (!isMacOS) {
    app.quit()
  }
})
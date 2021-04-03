const { app, Menu, Tray, BrowserWindow } = require('electron')

const isMacOS = (process.platform === "darwin")
let tray = null

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
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

app.whenReady().then(() => {
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
  createWindow()

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
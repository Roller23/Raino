const { app, BrowserWindow } = require('electron')
const path = require('path')

const isMacOS = (process.platform === "darwin")

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
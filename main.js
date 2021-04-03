const { app, BrowserWindow, globalShortcut} = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {

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
  // BrowserWindow.getFocusedWindow().
  // BrowserWindow.getFocusedWindow().webContents.unregisterAll();

  const zoomInRegister = globalShortcut.register('CommandOrControl+=', () => {
    // console.log('Ctrl with + is pressed')
    let zoomLevel = BrowserWindow.getFocusedWindow().webContents.getZoomLevel();
    if (zoomLevel < 2)
      BrowserWindow.getFocusedWindow().webContents.setZoomLevel(zoomLevel+0.1);
  })

  const zoomOutRegister = globalShortcut.register('CommandOrControl+-', () => {
    // console.log('Ctrl with - is pressed')
    let zoomLevel = BrowserWindow.getFocusedWindow().webContents.getZoomLevel();
    if (zoomLevel > 0.1)
      BrowserWindow.getFocusedWindow().webContents.setZoomLevel(zoomLevel-0.1);
  })

  if (!zoomInRegister || !zoomOutRegister) {
    console.log('registration failed')
  }

  // console.log(globalShortcut.isRegistered('CommandOrControl+='))
  // console.log(globalShortcut.isRegistered('CommandOrControl+-'))
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
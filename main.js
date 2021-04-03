const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    // frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {

    }
  })
  win.loadFile('index.html')
}

function manageShortcuts() {
  const zoomInRegister = globalShortcut.register('CommandOrControl+=', () => {
    let zoomLevel = BrowserWindow.getFocusedWindow().webContents.getZoomLevel();
    if (zoomLevel < 2)
      BrowserWindow.getFocusedWindow().webContents.setZoomLevel(zoomLevel + 0.1);
  })

  const zoomOutRegister = globalShortcut.register('CommandOrControl+-', () => {
    let zoomLevel = BrowserWindow.getFocusedWindow().webContents.getZoomLevel();
    if (zoomLevel > -0.5)
      BrowserWindow.getFocusedWindow().webContents.setZoomLevel(zoomLevel - 0.1);
  })

  if (!zoomInRegister || !zoomOutRegister) {
    console.log('registration failed')
  }

  globalShortcut.register('CommandOrControl+Shift+=',()=>{});
  // globalShortcut.register('CommandOrControl+W',()=>{});

}

app.whenReady().then(() => {
  createWindow()
  manageShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
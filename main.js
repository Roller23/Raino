const { app, BrowserWindow } = require('electron')
const path = require('path')

const isFramed = (process.platform == "darwin")

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    frame: isFramed,
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
})

app.on('window-all-closed', () => {
  if (!isFramed) {
    app.quit()
  }
})
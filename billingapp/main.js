const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const resourcePath = path.join(__dirname, 'path/to/resource');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000'); // Assuming your React app runs on this URL

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipcMain.on('print', (event) => {
  mainWindow.webContents.print({}, (success, failureReason) => {
    if (!success) console.log(failureReason);
    console.log('Print Initiated');
  });
});

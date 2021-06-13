import { app, BrowserWindow, ipcMain, nativeTheme, Menu, Tray } from 'electron'
import { electron } from 'process'
import appIO from "../js/appIO"

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
let settingsWindow
let tray = null

// Setup the Tray Icon
app.whenReady().then(() => {

  if (process.platform == "darwin"){
    app.dock.hide()
  } else if (process.platform == "win32"){
    // Do nothing for now
  } else {
    // Do nothing for now
  }
  tray = new Tray(`C:\\Code\\ClearNotes\\clear-notes-nodejs\\src\\assets\\notes.png`)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Quit Application', type: 'normal', click: ()=>{
      app.quit()
    } }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})

function createSettingsWindow(){
  settingsWindow = new BrowserWindow({
    width: 500,
    height: 600,
    alwaysOnTop: true,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  settingsWindow.loadURL(process.env.APP_URL + "#/settings")

  settingsWindow.on("close", (event)=>{
    settingsWindow = null
  })
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 600,
    height: 800,
    maximizable: false,
    transparent: true,
    frame: false,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.maxState = false;

  mainWindow.setAlwaysOnTop(true, 'pop-up-menu', 1);

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on("close", (event)=>{
    mainWindow = null
  })

  mainWindow.setIgnoreMouseEvents(false)

  ipcMain.on("saveToDisk", (event, jData)=>{
    appIO.saveToFileAsync(jData)
  })

  ipcMain.on("loadNotes", (event)=>{
    console.log("Loading Notes")
    appIO.readFromFileSync(mainWindow.webContents)
  })

  ipcMain.on("windowAction", (event, sWindowCommand)=>{
    if (sWindowCommand == "close"){
      mainWindow.minimize()
    } else if (sWindowCommand == "min"){
      mainWindow.minimize()
    } else if (sWindowCommand == "max"){
        console.log(mainWindow.maxState)
      if (mainWindow.maxState == true){
        console.log("We Should Unmaximize")
        mainWindow.unmaximize()
        mainWindow.maxState = false;
      } else {
        mainWindow.maximize()
        mainWindow.maxState = true;
      }
    } else {
      // Do Nothing
    }
  })

  ipcMain.on("openSettingsWindow",(event)=>{
    if (!settingsWindow){
      createSettingsWindow()
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
      app.quit()
})

app.on('activate', () => {

    if (mainWindow === null) {
      createWindow()
    } else {
      app.show()
  }
})

app.on("before-quit", async ()=>{
  let waitOneSecond = async () => {
    return new Promise ((res)=>{
      setTimeout(()=>{
        res(true)
      }, 1000)
    })
   };
   await waitOneSecond().then(()=>{
     console.log("quitting..")
   })
})
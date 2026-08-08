const path=require('path')

const { app, BrowserWindow,Menu } = require('electron')

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform==="darwin"

//create main window
function createMainWindow(){
    const mainWindow= new BrowserWindow({
        title:'Image Resizer',
        width: isDev? 1000:500,
        height: 600
    })

    //open devtools if in dev env
    if(isDev){
        mainWindow.webContents.openDevTools()
    }

 mainWindow.loadFile(path.join(__dirname,'./renderer/index.html'));
}

//App is ready

app.whenReady().then(() => {
    createMainWindow()

    //Implement menu
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

     app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

//Menu template
const menu = [
  {
    role: 'fileMenu',
   
    
  }
]

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})
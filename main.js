const path=require('path')
const os=require('os')
const fs=require('fs')
const resizeImg=require('resize-img')

const { app, BrowserWindow,Menu,ipcMain,shell } = require('electron')

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform==="darwin"

let mainWindow
//create main window
function createMainWindow(){
     mainWindow= new BrowserWindow({
        title:'PixelForge',
        width: isDev? 1000:500,
        height: 600,
        webPreferences:{
          contextIsolation:true,
          nodeIntegration:true,
          preload: path.join(__dirname,'preload.js')
        }
    })

    //open devtools if in dev env
    if(isDev){
        mainWindow.webContents.openDevTools()
    }

 mainWindow.loadFile(path.join(__dirname,'./renderer/index.html'));
}

//Create about window
function createAboutWindow(){
        const aboutWindow= new BrowserWindow({
        title:'About Image Resizer',
        width: 300,
        height: 300
    })


 aboutWindow.loadFile(path.join(__dirname,'./renderer/about.html'));
  }


//App is ready

app.whenReady().then(() => {
    createMainWindow()

    //Implement menu
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    //Remove mainWindow from memory on close
    mainWindow.on('closed', () => (mainWindow = null))

     app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

//Menu template
const menu = [

  ...(isMac ? [{
    label: app.name,
    submenu: [
      {
        label: 'About',
        click: createAboutWindow
      },
    ]
  }] : []),
  {
    role: 'fileMenu', 
    
  },
  ...(!isMac ? [{
    label: 'Help',
    submenu: [{
      label: 'About',
      click: createAboutWindow
    }]
  }] : [])
]

//Respond to ipcRenderer resize
ipcMain.on('image:resize', (e, options) => {
  if (!options || !options.imgPath) {
    console.log('No image path received for resize.');
    return;
  }

  options.dest = path.join(os.homedir(), 'imageresizer');
  resizeImage(options);
})

//Resize the image
async function resizeImage({ imgPath, width, height, dest }){
  try {
    if (!imgPath || !fs.existsSync(imgPath)) {
      console.log('Image file not found:', imgPath);
      return;
    }

    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: Number(width),
      height: Number(height)
    });

    //Create filename
    const filename = path.basename(imgPath);

    //Create dest folder if not exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    //Write the file to dest
    fs.writeFileSync(path.join(dest, filename), newPath);

    //Send success to renderer
    mainWindow.webContents.send('image:done');

    //Open the dest folder
    shell.openPath(dest);
  } catch (error) {
    console.log(error);
  }
}

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})
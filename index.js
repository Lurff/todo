const { app, BrowserWindow, Tray  } = require("electron")

const createWindow = () => {

    const mainWindow = new BrowserWindow({
        x: 0,
        y: 0, 
        width: 1920, 
        height: 1080,
        icon: "./src/icon/icon.png"
    })
    
    mainWindow.loadFile("./src/index.html")

}

app.on("ready",() => {
    createWindow()
})
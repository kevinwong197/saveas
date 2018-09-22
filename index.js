const {app, BrowserWindow} = require('electron')
const sanitize = require("sanitize-filename")

function createWindow(urlstr) {
  let win = new BrowserWindow({ show: false })
  win.on('closed', () => {
    win = null
  })
  win.webContents.on('did-fail-load', (event, errorCode, errorDesc) => {
    console.log(`${errorDesc}: ${urlstr}`)
    win.close()
  })
  win.webContents.on('did-finish-load', () => {
    let title = sanitize(win.webContents.getTitle())
    win.webContents.savePage(`${title}.mhtml`, 'MHTML', (error) => {
      if (error) {
        console.log(error)
      } else {
        console.log(`${urlstr} => ${title}`)
      }
      win.close()
    })
  })
  win.loadURL(urlstr)
  return win
}

app.on('ready', () => {
  let arg = process.argv[1]
  if (arg) {
    createWindow(arg)
  } else {
    console.log('usage: saveas <url>')
    app.quit()
  }
})

app.on('window-all-closed', () => {
  app.quit()
})

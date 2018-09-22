const {app, BrowserWindow, dialog} = require('electron')
const sanitize = require("sanitize-filename")
const url = require('url')
const path = require('path')
const urlstr = process.argv[1]

function createWindow(urlstr) {
  let win = new BrowserWindow({ show: false })
  win.loadURL(url.format ({
    pathname: path.join(__dirname, 'resources/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.webContents.executeJavaScript(`loadurl("${urlstr}")`);
  return win
}

app.on('ready', () => {
  if (urlstr) {
    createWindow(urlstr)
  } else {
    console.log('usage: saveas <url>')
    app.quit()
  }
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('web-contents-created', (webContentsCreatedEvent, contents) => {
  if (contents.getType() === 'webview') {
    contents.on('did-finish-load', (a) => {
      let title = sanitize(contents.getTitle())
      contents.savePage(`${title}.mhtml`, 'MHTML', (error) => {
        if (error) {
          console.log(error)
        } else {
          console.log(`${urlstr} => ${title}`)
        }
        app.quit()
      })
    })

    contents.on('did-fail-load', (event, errorCode, errorDesc) => {
      console.log(`${errorDesc}: ${urlstr}`)
      app.quit()
    })
  }
})
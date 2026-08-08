const os = require('os')
const path = require('path')
const Toastify = require('toastify-js')
const { contextBridge, ipcRenderer } = require('electron')
const { channel } = require('diagnostics_channel')

contextBridge.exposeInMainWorld('os', {
  homeDir: () => os.homedir()
})

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args)
})

contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast()
})

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (chanel,data) => ipcRenderer.send(chanel,data),
  on:(channel, func) => ipcRenderer.on(channel,(event, ...func) => func(...args))
})


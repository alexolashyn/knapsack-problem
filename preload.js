const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: (callback) =>
    ipcRenderer.on("open-file", (_event, value) => callback(value)),

  saveFile: (callback) => ipcRenderer.on("save-file", (_event) => callback()),

  dataToSave: (value) => ipcRenderer.send("data-to-save", value),

  createFile: (callback) =>
    ipcRenderer.on("create-file", (_event) => callback()),

  algorithm: (value) => ipcRenderer.send("run-algorithm", value),

  algorithmResult: (callback) =>
    ipcRenderer.on("algorithm-result", (_event, value) => callback(value)),

  generateKey: (value) => ipcRenderer.send("generate-key", value),

  inputKey: (value) => ipcRenderer.send("input-key", value),

  getGeneratedKey: (callback) =>
    ipcRenderer.on("get-generated-key", (_event, value) => callback(value)),

  getInputKey: (callback) =>
    ipcRenderer.on("get-input-key", (_event, value) => callback(value)),
});

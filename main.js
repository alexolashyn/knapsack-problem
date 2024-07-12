const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");

const { saveFile } = require("./middleware/file");
const createMenu = require("./middleware/menu");
const { generateKeys, inputKeys } = require("./knapsack/key");
const { encryption, decryption } = require("./knapsack/knapsack");

function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  createMenu();
  mainWindow.loadFile("index.html");

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  ipcMain.on("data-to-save", async (_event, value) => {
    await saveFile(value);
  });

  ipcMain.on("run-algorithm", async (_event, value) => {
    const { operation } = value;
    let result = operation === "en" ? encryption(value) : decryption(value);
    const mainWindow = BrowserWindow.getFocusedWindow();
    mainWindow.webContents.send("algorithm-result", result);
  });

  ipcMain.on("generate-key", (_event, value) => {
    const res = generateKeys(value);
    const mainWindow = BrowserWindow.getFocusedWindow();
    mainWindow.webContents.send("get-generated-key", res);
  });

  ipcMain.on("input-key", (_event, value) => {
    const res = inputKeys(value);
    const mainWindow = BrowserWindow.getFocusedWindow();
    mainWindow.webContents.send("get-input-key", res);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

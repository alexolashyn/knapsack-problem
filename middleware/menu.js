const { BrowserWindow, app, shell, Menu } = require("electron");
const path = require("path");

const { openFile } = require("./file");

const createMenu = () => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

const menuTemplate = [
  {
    label: app.name,
    submenu: [
      {
        label: "Exit",
        click: () => {
          app.quit();
        },
      },
      {
        role: "close",
      },
    ],
  },
  {
    label: "File",
    submenu: [
      {
        label: "Open",
        click: async () => {
          await openFile();
        },
      },
      {
        label: "Create",
        click: () => {
          const mainWindow = BrowserWindow.getFocusedWindow();
          mainWindow.webContents.send("create-file");
        },
      },
      {
        label: "Save",
        click: () => {
          const mainWindow = BrowserWindow.getFocusedWindow();
          mainWindow.webContents.send("save-file");
        },
      },
    ],
  },
  {
    label: "Info",
    submenu: [
      {
        label: "About",
        click: () => {
          let dataWindow = new BrowserWindow({
            fullscreen: true,
            webPreferences: {
              nodeIntegration: true,
            },
          });

          dataWindow.loadFile("dev.html");

          dataWindow.on("closed", () => {
            dataWindow = null;
          });
        },
      },
    ],
  },
];

module.exports = createMenu;

const { BrowserWindow, dialog } = require("electron");

const fs = require("fs");

async function openFile() {
  const mainWindow = BrowserWindow.getFocusedWindow();

  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Text Files", extensions: ["txt"] }],
    properties: ["openFile"],
  });

  if (!canceled) {
    const content = await fs.promises.readFile(filePaths[0], "utf-8");
    mainWindow.webContents.send("open-file", content);
  }
}

async function saveFile(value) {
  const mainWindow = BrowserWindow.getFocusedWindow();
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: "document.txt",
    filters: [{ name: "Text Files", extensions: ["txt"] }],
  });
  if (!canceled) {
    fs.writeFile(filePath, value, "utf-8", (error) => {
      if (error) {
        alert(`Error on saving file: ${error}`);
      }
    });
  }
}

module.exports = {
  openFile,
  saveFile,
};

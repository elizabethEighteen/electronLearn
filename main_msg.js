//渲染进程

//引入ipcRenderer
const electron = require("electron");
const { ipcRenderer } = require("electron");
const { log } = console;

log(ipcRenderer);
ipcRenderer.on("mainMsg", (event, task) => {
  log(task);
  document.getElementById("receive").innerText = task;
});

function sendMain() {
  ipcRenderer.send("task", "退出程序");
}

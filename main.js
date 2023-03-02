// main.js

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const {
  app,
  BrowserWindow,
  nativeImage,
  Tray,
  Menu,
  ipcMain,
} = require("electron");
const path = require("path");

const createWindow = () => {
  // 创建浏览窗口
  const win = new BrowserWindow({
    // frame: false,
    width: 800,
    height: 600,
    webPreferences: {
      //   preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // 是否集成 Nodejs,把之前预加载的js去了，发现也可以运行
      contextIsolation: false,
    },
  });
  // 系统托盘
  // 创建icon我这里使用的是一个png
  const icon = nativeImage.createFromPath(
    path.join(__dirname, "/static/icon.png")
  );
  // 实例化一个 托盘对象，传入的是托盘的图标
  tray = new Tray(icon);
  // 移动到托盘上的提示
  tray.setToolTip("electron demo is running");
  // 还可以设置 titlle
  tray.setTitle("electron demo");

  // 监听托盘右键事件
  tray.on("right-click", () => {
    // 右键菜单模板
    const tempate = [
      {
        label: "无操作",
      },
      {
        label: "退出",
        click: () => app.quit(),
      },
    ];
    //通过 Menu 创建菜单
    const menuConfig = Menu.buildFromTemplate(tempate);
    // 让我们的写的托盘右键的菜单替代原来的
    tray.popUpContextMenu(menuConfig);
  });
  //监听点击托盘的事件
  tray.on("click", () => {
    // 这里来控制窗口的显示和隐藏
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
  // 发送给渲染线程
  setTimeout(() => {
    win.webContents.send("mainMsg", "我是主线程发送的消息");
  }, 3000);
  // 加载 index.html
  win.loadFile("main_msg.html");
  win.webContents.openDevTools();

  // 打开开发工具
  // win.webContents.openDevTools()
};

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
// 2.引入自定义的菜单
require("./menu");
app.on("ready", () => {
  createWindow();
  //   require('@electron/remote/main').initialize()
  app.on("activate", () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。

// 渲染线程向主线程通信
ipcMain.on("task", (event, info) => {
    console.log('qqq')
  if (info === "退出程序") {
    app.quit();
  }
});

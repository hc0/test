import React from "react";
import dva from "dva";
import logger from "redux-logger";
import App from "./containers/App.js";
import picshowModel from "./models/picshowModel.js";
// import router from "./router.js";
const app = dva({
    // onAction : logger
});
// 路由的根组件是App
const router = ()=> <App />;

// 注册路由
app.router(router);
// 注册模型
app.model(picshowModel);
// 挂载上树
app.start("#app");
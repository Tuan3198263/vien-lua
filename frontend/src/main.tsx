import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import "antd/dist/reset.css";

/**
 * Entry point của ứng dụng React
 * - Cấu hình Ant Design với ngôn ngữ tiếng Việt
 * - Render component App chính
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider locale={viVN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

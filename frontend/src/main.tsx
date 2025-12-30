import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { store } from "./stores";
import App from "./App";
import "antd/dist/reset.css";

/**
 * Entry point của ứng dụng React
 * - Setup Redux Provider
 * - Setup React Router
 * - Cấu hình Ant Design với ngôn ngữ tiếng Việt
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={viVN}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </StrictMode>
);

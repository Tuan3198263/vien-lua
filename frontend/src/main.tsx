import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { store } from "./stores";
import App from "./App";
import "antd/dist/reset.css";
import "./styles/global.css";

/**
 * Entry point của ứng dụng React
 * - Setup Redux Provider
 * - Setup React Router
 * - Cấu hình Ant Design với ngôn ngữ tiếng Việt và theme custom
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          // Font chữ đẹp hơn
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          fontSize: 14,
          fontSizeHeading1: 38,
          fontSizeHeading2: 30,
          fontSizeHeading3: 24,
          fontSizeHeading4: 20,
          fontSizeHeading5: 16,
          lineHeight: 1.5715,
        },
        components: {
          Form: {
            // Giảm khoảng cách giữa label và input
            labelHeight: 22,
            verticalLabelPadding: "0 0 4px",
          },
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
);

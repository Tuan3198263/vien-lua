/**
 * Layout chính của ứng dụng
 * Bao gồm Header, Sidebar và Content area
 */

import { useState } from "react";
import { Layout, Flex } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSider from "./AppSider";
import "./MainLayout.css";

const { Content } = Layout;

/**
 * Component layout chính
 */
function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  /**
   * Toggle sidebar collapsed state
   */
  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSider collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <AppHeader
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <Content
          style={{
            margin: "24px 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;

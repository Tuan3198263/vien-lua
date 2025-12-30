/**
 * Layout chính của ứng dụng
 * Bao gồm Header, Sidebar và Content area
 */

import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSider from "./AppSider";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import "./MainLayout.css";

const { Content } = Layout;

/**
 * Component layout chính
 */
function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  // Áp dụng document title động theo route
  useDocumentTitle();

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
            padding: "24px 16px",
            minHeight: 360,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;

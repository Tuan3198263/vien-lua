/**
 * Sidebar component
 * Menu điều hướng chính của ứng dụng
 */

import { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
  LeftOutlined,
  RightOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { ROUTES, ROUTE_LABELS } from "@/constants/routes";
import logoImage from "@/assets/logo.png";

const { Sider } = Layout;

interface AppSiderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>["items"][number];

/**
 * Component sidebar của ứng dụng
 */
function AppSider({ collapsed, onCollapse }: AppSiderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  /**
   * Menu items
   */
  const menuItems: MenuItem[] = [
    {
      key: ROUTES.TRANG_CHU,
      icon: <HomeOutlined />,
      label: ROUTE_LABELS.TRANG_CHU,
    },
    {
      key: ROUTES.TAI_LIEU,
      icon: <FileTextOutlined />,
      label: ROUTE_LABELS.TAI_LIEU,
    },
    {
      key: "phan-quyen",
      icon: <SafetyOutlined />,
      label: ROUTE_LABELS.PHAN_QUYEN,
      children: [
        {
          key: ROUTES.NGUOI_DUNG,
          icon: <UserOutlined />,
          label: ROUTE_LABELS.NGUOI_DUNG,
        },
        {
          key: ROUTES.VAI_TRO,
          icon: <TeamOutlined />,
          label: ROUTE_LABELS.VAI_TRO,
        },
      ],
    },
  ];

  /**
   * Xử lý khi chọn menu item
   */
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };
  /**
   * Xử lý mở/đóng submenu
   */
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  /**
   * Update selected keys khi route thay đổi
   */
  useEffect(() => {
    const path = location.pathname;
    setSelectedKeys([path]);

    // Auto open submenu khi vào page con
    if (path === ROUTES.NGUOI_DUNG || path === ROUTES.VAI_TRO) {
      setOpenKeys(["phan-quyen"]);
    }
  }, [location.pathname]);

  /**
   * Auto collapse sidebar khi màn hình nhỏ
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed) {
        onCollapse(true);
      }
    };

    handleResize(); // Check ngay khi mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed, onCollapse]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      trigger={null}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        left: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
      }}
      theme="light"
    >
      {/* Logo */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
          padding: collapsed ? "12px" : "16px",
        }}
      >
        <img
          src={logoImage}
          alt="Logo"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "48px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onClick={handleMenuClick}
        onOpenChange={handleOpenChange}
        items={menuItems}
        style={{ borderRight: 0, flex: 1 }}
      />

      {/* Trigger button ở dưới cùng - cố định góc phải */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "12px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
          onClick={() => onCollapse(!collapsed)}
          style={{
            width: collapsed ? "100%" : "auto",
            height: "32px",
          }}
        >
          {!collapsed}
        </Button>
      </div>
    </Sider>
  );
}

export default AppSider;

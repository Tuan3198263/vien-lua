/**
 * Header component
 * Hiển thị toggle button, thông tin user và nút đăng xuất
 */

import { Dropdown, Avatar, Space, Modal, Flex } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/stores/authSlice";
import { ROUTES } from "@/constants/routes";
import { notifySuccess } from "@/utils/notification";
import { MESSAGES } from "@/constants";

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Component header của ứng dụng
 */
function AppHeader({ collapsed, onToggleCollapse }: AppHeaderProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  /**
   * Xử lý đăng xuất
   */
  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        dispatch(logout());
        notifySuccess(MESSAGES.SUCCESS.LOGOUT);
        navigate(ROUTES.DANG_NHAP);
      },
    });
  };

  /**
   * Menu dropdown cho user
   */
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
      onClick: () => {
        // Navigate to profile page
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="main-layout-header">
      <Flex justify="space-between" align="center" style={{ height: "100%" }}>
        <Flex align="center">
          {collapsed ? (
            <MenuUnfoldOutlined
              className="trigger"
              onClick={onToggleCollapse}
            />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={onToggleCollapse} />
          )}
        </Flex>

        <Flex align="center">
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="user-info">
              <Avatar
                style={{ backgroundColor: "#52c41a" }}
                icon={<UserOutlined />}
              />
              <span className="user-name">{user?.ho_ten || "User"}</span>
            </Space>
          </Dropdown>
        </Flex>
      </Flex>
    </Header>
  );
}

export default AppHeader;

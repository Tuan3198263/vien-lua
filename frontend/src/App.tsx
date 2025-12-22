import { useState } from "react";
import { Layout, Menu, Card, Statistic, Row, Col, Typography } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

/**
 * Component chính của ứng dụng
 * Hiển thị layout cơ bản với Header, Sidebar và Content
 * Trang Dashboard demo với các thống kê mẫu
 */
function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar Menu */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "VL" : "Viện Lúa"}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Người dùng",
            },
            {
              key: "3",
              icon: <SettingOutlined />,
              label: "Cài đặt",
            },
          ]}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ background: "#fff", padding: "0 24px" }}>
          <Title level={3} style={{ margin: "16px 0" }}>
            Dashboard Quản Lý
          </Title>
        </Header>

        {/* Content - Dashboard Demo */}
        <Content
          style={{ margin: "24px 16px", padding: 24, background: "#f0f2f5" }}
        >
          <Title level={4}>Tổng quan hệ thống</Title>

          {/* Các card thống kê mẫu */}
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng người dùng"
                  value={1128}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Hoạt động"
                  value={93}
                  suffix="/ 100"
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Doanh thu (VNĐ)"
                  value={1234567}
                  precision={0}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Card thông tin mẫu */}
          <Card title="Thông tin hệ thống" style={{ marginTop: 16 }}>
            <p>Đây là trang Dashboard mẫu cho hệ thống quản lý.</p>
            <p>Stack công nghệ: React + TypeScript + Vite + Ant Design</p>
            <p>Backend API: NestJS + TypeORM + MySQL</p>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;

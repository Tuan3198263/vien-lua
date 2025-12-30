/**
 * Trang chủ
 */

import { Card, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

/**
 * Component trang chủ
 */
function TrangChu() {
  return (
    <div>
      <Card>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <HomeOutlined style={{ fontSize: 64, color: "#52c41a" }} />
          <Title level={2}>Chào mừng đến với Vien Lua</Title>
          <Paragraph style={{ fontSize: 16, color: "#8c8c8c" }}>
            Hệ thống quản lý nội bộ
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}

export default TrangChu;

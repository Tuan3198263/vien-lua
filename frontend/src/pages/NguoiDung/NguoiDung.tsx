/**
 * Trang quản lý người dùng
 */

import { Card, Typography, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

/**
 * Component trang quản lý người dùng
 */
function NguoiDung() {
  return (
    <div>
      <Card>
        <Title level={3}>
          <UserOutlined /> Quản lý người dùng
        </Title>
        <Paragraph type="secondary">
          Trang quản lý người dùng trong hệ thống
        </Paragraph>

        <div style={{ marginTop: 40 }}>
          <Empty description="Nội dung đang được phát triển" />
        </div>
      </Card>
    </div>
  );
}

export default NguoiDung;

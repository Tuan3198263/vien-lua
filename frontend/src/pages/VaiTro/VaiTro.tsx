/**
 * Trang quản lý vai trò
 */

import { Card, Typography, Empty } from "antd";
import { TeamOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

/**
 * Component trang quản lý vai trò
 */
function VaiTro() {
  return (
    <div>
      <Card>
        <Title level={3}>
          <TeamOutlined /> Quản lý vai trò
        </Title>
        <Paragraph type="secondary">
          Trang quản lý vai trò và phân quyền trong hệ thống
        </Paragraph>

        <div style={{ marginTop: 40 }}>
          <Empty description="Nội dung đang được phát triển" />
        </div>
      </Card>
    </div>
  );
}

export default VaiTro;

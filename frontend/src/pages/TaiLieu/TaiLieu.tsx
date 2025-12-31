/**
 * Page Tài Liệu (File Hệ Thống)
 * Hiển thị danh sách file, không có form thêm/sửa
 */

import { Card, Typography } from "antd";
import DanhSachFileHeThong from "./DanhSachFileHeThong";
import { ROUTE_LABELS } from "@/constants/routes";

const { Title } = Typography;

/**
 * Component Page Tài Liệu
 */
function TaiLieu() {
  return (
    <Card>
      <Title
        level={3}
        style={{ margin: 0, marginBottom: 24, color: "#52c41a" }}
      >
        {ROUTE_LABELS.TAI_LIEU.toUpperCase()}
      </Title>
      <DanhSachFileHeThong />
    </Card>
  );
}

export default TaiLieu;

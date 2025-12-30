/**
 * Trang không có quyền truy cập
 */

import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

/**
 * Component trang không có quyền
 */
function KhongCoQuyen() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px 0" }}>
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={() => navigate(ROUTES.TRANG_CHU)}>
            Về trang chủ
          </Button>
        }
      />
    </div>
  );
}

export default KhongCoQuyen;

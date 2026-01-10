/**
 * HeaderPageForm Component
 * Header cố định cho các page form (Thêm/Sửa/Chi tiết)
 * Hiển thị icon back arrow và tiêu đề uppercase
 */

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface HeaderPageFormProps {
  /**
   * Tiêu đề hiển thị (VD: "Thêm đề tài", "Sửa đề tài")
   */
  title: string;

  /**
   * URL để quay lại (mặc định: -1 = back)
   */
  backUrl?: string;

  /**
   * Custom handler cho nút back
   */
  onBack?: () => void;
}

/**
 * Component Header cho Page Form
 * - Fixed position, không bị cuộn
 * - Arrow back + Title uppercase
 * - Có thể custom backUrl hoặc onBack handler
 */
function HeaderPageForm({ title, backUrl, onBack }: HeaderPageFormProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <Flex
      align="center"
      gap="middle"
      style={{
        padding: "16px 24px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
    >
      <ArrowLeftOutlined
        style={{
          fontSize: 20,
          cursor: "pointer",
        }}
        onClick={handleBack}
      />
      <Title
        level={3}
        style={{
          margin: 0,
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {title}
      </Title>
    </Flex>
  );
}

export default HeaderPageForm;

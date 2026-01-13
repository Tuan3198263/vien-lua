/**
 * Trang Coming Soon - Tính năng đang phát triển
 */

import { Typography } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { useDocumentTitle } from "@/hooks";

const { Title, Text } = Typography;

interface ComingSoonProps {
  title: string;
  description?: string;
}

/**
 * Component hiển thị trang "Sắp ra mắt"
 */
function ComingSoon({ title, description }: ComingSoonProps) {
  useDocumentTitle();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          backgroundColor: "#fff",
          minHeight: "calc(100vh - 120px)",
          borderRadius: 8,
          overflow: "hidden",
          padding: "60px 40px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              margin: "0 auto 32px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
            }}
          >
            <RocketOutlined
              style={{
                fontSize: 56,
                color: "#fff",
              }}
            />
          </div>

          <Title level={2} style={{ marginBottom: 16, color: "#262626" }}>
            {title}
          </Title>

          <Text
            style={{
              fontSize: 16,
              color: "#595959",
              display: "block",
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            {description ||
              "Tính năng này đang được phát triển và sẽ sớm ra mắt trong thời gian tới."}
          </Text>

          <div
            style={{
              padding: "16px 24px",
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
              marginTop: 32,
            }}
          >
            <Text style={{ color: "#8c8c8c", fontSize: 14 }}>
              💡 Chúng tôi đang nỗ lực hoàn thiện tính năng này để mang đến trải
              nghiệm tốt nhất
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;

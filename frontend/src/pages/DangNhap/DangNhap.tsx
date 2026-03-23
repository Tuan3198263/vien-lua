/**
 * Trang đăng nhập
 * Xử lý authentication và lưu token vào Redux store
 */

import { Form, Input, Button, Card, Flex } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { loginSuccess, setLoading } from "@/stores/authSlice";
import { authApi } from "@/services/api";
import { LoginDto } from "@/interfaces";
import { LOGIN_VALIDATOR } from "@/validators/auth.validator";
import { MESSAGES } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { notifySuccess, notifyError } from "@/utils/notification";
import logoImage from "@/assets/logo.png";
import "./DangNhap.css";

/**
 * Component trang đăng nhập
 */
function DangNhap() {
  const [form] = Form.useForm<LoginDto>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  /**
   * Auto-fill test credentials on component mount
   */
  useEffect(() => {
    form.setFieldsValue({
      tai_khoan: "TESTER",
      mat_khau: "TESTER",
    });
  }, [form]);

  /**
   * Xử lý submit form đăng nhập
   */
  const handleSubmit = async (values: LoginDto) => {
    try {
      dispatch(setLoading(true));
      console.log("Đang đăng nhập với:", values);

      // Gọi API đăng nhập
      const response = await authApi.login(values);
      console.log("Đăng nhập thành công:", response);

      // Lưu token và user vào Redux store & localStorage
      dispatch(loginSuccess(response));

      // Hiển thị thông báo thành công
      notifySuccess(MESSAGES.SUCCESS.LOGIN);

      // Redirect về trang chủ
      navigate(ROUTES.TRANG_CHU);
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      console.error("Chi tiết lỗi:", {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });

      // Hiển thị thông báo lỗi
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        MESSAGES.ERROR.UNKNOWN;
      notifyError("Đăng nhập thất bại", errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Xử lý khi validation form thất bại
   */
  const handleSubmitFailed = (errorInfo: any) => {
    console.log("Validation thất bại:", errorInfo);

    // Lấy lỗi đầu tiên để hiển thị
    const firstError = errorInfo.errorFields[0];
    if (firstError && firstError.errors.length > 0) {
      notifyError("Lỗi:", firstError.errors[0]);
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Card className="dang-nhap-card" bordered={false}>
          <Flex vertical align="center" style={{ marginBottom: 32 }}>
            <img src={logoImage} alt="Logo" className="logo-image" />
          </Flex>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            onFinishFailed={handleSubmitFailed}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Tài khoản"
              name="tai_khoan"
              rules={LOGIN_VALIDATOR.tai_khoan}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Nhập tài khoản"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="mat_khau"
              rules={LOGIN_VALIDATOR.mat_khau}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                className="submit-button"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Flex>
  );
}

export default DangNhap;

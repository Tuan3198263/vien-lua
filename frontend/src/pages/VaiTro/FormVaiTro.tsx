/**
 * Form Vai Trò - UI Component
 * Bao gồm thông tin vai trò và phân quyền module
 */

import { useEffect, useState } from "react";
import { Form, Input, Row, Col, Card, Checkbox, Space, Typography } from "antd";
import { VAI_TRO_RULES } from "@/validators/vaiTro.validator";
import { ModuleInfo, QuyenModuleDto } from "@/interfaces";
import { vaiTroApi } from "@/services/api/vaiTroApi";
import { notifyError } from "@/utils/notification";

const { TextArea } = Input;
const { Text } = Typography;

export interface FormVaiTroValues {
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta?: string;
  permissions?: QuyenModuleDto[];
}

interface FormVaiTroProps {
  form: any;
  mode: "create" | "edit";
  initialValues?: Partial<FormVaiTroValues>;
  onPermissionsChange?: (getPermissions: () => QuyenModuleDto[]) => void;
  key?: string | number; // Thêm key để force re-render khi reset
}

/**
 * Component Form Vai Trò
 */
function FormVaiTro({
  form,
  mode,
  initialValues,
  onPermissionsChange,
}: FormVaiTroProps) {
  const [modules, setModules] = useState<ModuleInfo[]>([]); // Khởi tạo array rỗng
  const [loadingModules, setLoadingModules] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});

  /**
   * Load danh sách module từ backend
   */
  useEffect(() => {
    loadModules();
  }, []);

  /**
   * Set giá trị ban đầu cho form và permissions
   */
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ma_vai_tro: initialValues.ma_vai_tro,
        ten_vai_tro: initialValues.ten_vai_tro,
        mo_ta: initialValues.mo_ta,
      });

      // Set selected permissions từ initialValues
      if (initialValues.permissions) {
        const permMap: Record<string, boolean> = {};
        initialValues.permissions.forEach((perm) => {
          // Kiểm tra có quyền thao_tac không (có thể là string hoặc array)
          const hasThaoTac = Array.isArray(perm.hanh_dong)
            ? perm.hanh_dong.includes("thao_tac")
            : perm.hanh_dong === "thao_tac";
          if (hasThaoTac) {
            permMap[perm.ma_module] = true;
          }
        });
        setSelectedPermissions(permMap);
      }
    } else {
      // Reset permissions khi không có initialValues (form thêm mới)
      setSelectedPermissions({});
    }
  }, [initialValues, form]);

  const loadModules = async () => {
    try {
      setLoadingModules(true);
      const response = await vaiTroApi.getModules();
      setModules(response);
    } catch (error: any) {
      notifyError("Lỗi tải danh sách module", error.message);
    } finally {
      setLoadingModules(false);
    }
  };

  /**
   * Xử lý thay đổi checkbox quyền THAO_TAC
   */
  const handlePermissionChange = (maModule: string, checked: boolean) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [maModule]: checked,
    }));
  };

  /**
   * Lấy danh sách permissions để submit
   */
  const getPermissions = (): QuyenModuleDto[] => {
    return Object.keys(selectedPermissions)
      .filter((maModule) => selectedPermissions[maModule])
      .map((maModule) => ({
        ma_module: maModule,
        hanh_dong: ["thao_tac"], // Chỉ cần THAO_TAC, XEM là mặc định
      }));
  };

  // Expose getPermissions qua callback
  useEffect(() => {
    if (onPermissionsChange) {
      onPermissionsChange(getPermissions);
    }
  }, [selectedPermissions, onPermissionsChange]);

  return (
    <Form form={form} layout="vertical" size="middle">
      {/* Thông tin cơ bản */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Mã vai trò"
            name="ma_vai_tro"
            rules={mode === "create" ? VAI_TRO_RULES.ma_vai_tro : []}
            tooltip="Chỉ chữ IN HOA và dấu gạch dưới (VD: ADMIN, QUAN_LY)"
          >
            <Input
              placeholder="Nhập mã vai trò (VD: ADMIN)"
              disabled={mode === "edit"}
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tên vai trò"
            name="ten_vai_tro"
            rules={VAI_TRO_RULES.ten_vai_tro}
          >
            <Input placeholder="Nhập tên vai trò" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Mô tả" name="mo_ta" rules={VAI_TRO_RULES.mo_ta}>
            <TextArea
              placeholder="Nhập mô tả vai trò"
              rows={2}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Phân quyền */}
      <Row gutter={16}>
        <Col span={24}>
          <Card
            title="Phân quyền trên các module"
            size="small"
            loading={loadingModules}
            style={{ marginTop: 8 }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {modules && modules.length > 0 ? (
                modules.map((module) => (
                  <Card
                    key={module.ma_module}
                    size="small"
                    style={{ backgroundColor: "#fafafa" }}
                  >
                    <Row align="middle" gutter={16}>
                      <Col span={8}>
                        <Text strong>{module.ten_module}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {module.ma_module}
                        </Text>
                      </Col>
                      <Col span={16}>
                        <Space size="large">
                          <Checkbox checked disabled>
                            <Text type="secondary">Xem</Text>
                          </Checkbox>
                          <Checkbox
                            checked={selectedPermissions[module.ma_module]}
                            onChange={(e) =>
                              handlePermissionChange(
                                module.ma_module,
                                e.target.checked
                              )
                            }
                          >
                            <Text>Thao tác toàn quyền</Text>
                          </Checkbox>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <Text type="secondary">Không có module nào</Text>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </Form>
  );
}

export default FormVaiTro;

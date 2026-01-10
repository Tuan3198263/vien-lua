import { Input, Button, Space, DatePicker, InputNumber } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useState } from "react";

/**
 * Custom hook cho column filtering với Ant Design Table
 * Sử dụng filterDropdown để tạo UI filter cho từng cột
 *
 * @example
 * const { getColumnSearchProps, getColumnDateProps } = useColumnFilter();
 *
 * const columns = [
 *   {
 *     title: 'Tài khoản',
 *     dataIndex: 'tai_khoan',
 *     key: 'tai_khoan',
 *     ...getColumnSearchProps('tai_khoan', 'Tài khoản'),
 *   },
 * ];
 */
export const useColumnFilter = () => {
  /**
   * Xử lý khi confirm filter
   */
  const handleSearch = (
    _selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void
  ) => {
    confirm();
  };

  /**
   * Xử lý khi reset filter
   */
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  /**
   * Tạo props cho column search (text)
   * @param dataIndex - Tên field/column
   * @param columnTitle - Tên hiển thị của cột (ví dụ: 'Tài khoản')
   * @returns Props để spread vào column definition
   */
  const getColumnSearchProps = (
    dataIndex: string,
    columnTitle?: string
  ): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: 8, fontWeight: 600, color: "#1890ff" }}>
          Tìm theo {columnTitle || dataIndex}
        </div>
        <Input
          placeholder={`Nhập ${columnTitle || dataIndex}...`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
          >
            Áp dụng
          </Button>
          <Button
            onClick={() => {
              if (clearFilters) {
                handleReset(clearFilters);
                confirm({ closeDropdown: false });
              }
            }}
            size="small"
            icon={<ReloadOutlined />}
          >
            Làm mới
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
  });

  /**
   * Tạo props cho column date filter
   * @param dataIndex - Tên field/column
   * @param columnTitle - Tên hiển thị của cột (ví dụ: 'Ngày sinh')
   * @returns Props để spread vào column definition
   */
  const getColumnDateProps = (
    dataIndex: string,
    columnTitle?: string
  ): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      // Parse selectedKeys[0] thành Dayjs object nếu là string
      const parsedValue = selectedKeys[0]
        ? typeof selectedKeys[0] === "string"
          ? dayjs(selectedKeys[0])
          : dayjs(selectedKeys[0] as any)
        : null;

      return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <div style={{ marginBottom: 8, fontWeight: 600, color: "#1890ff" }}>
            Tìm theo {columnTitle || dataIndex}
          </div>
          <DatePicker
            placeholder={`Chọn ${columnTitle || dataIndex}...`}
            value={parsedValue}
            onChange={(date) => {
              if (date) {
                // Store formatted string YYYY-MM-DD in selectedKeys
                setSelectedKeys([date.format("YYYY-MM-DD")]);
              } else {
                setSelectedKeys([]);
              }
            }}
            format="DD/MM/YYYY"
            style={{ width: "100%", marginBottom: 8 }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys as string[], confirm);
              }}
              icon={<SearchOutlined />}
              size="small"
            >
              Áp dụng
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) {
                  handleReset(clearFilters);
                  confirm({ closeDropdown: false });
                }
              }}
              size="small"
              icon={<ReloadOutlined />}
            >
              Làm mới
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
  });

  /**
   * Tạo props cho column number filter (lọc theo số - chỉ bằng)
   * @param dataIndex - Tên field/column
   * @param columnTitle - Tên hiển thị của cột (ví dụ: 'Năm thực hiện')
   * @returns Props để spread vào column definition
   */
  const getColumnNumberProps = (
    dataIndex: string,
    columnTitle?: string
  ): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      const [value, setValue] = useState<number | undefined>(
        selectedKeys[0] ? Number(selectedKeys[0]) : undefined
      );

      const handleApply = () => {
        const keys: string[] = [];
        if (value !== undefined) {
          keys.push(String(value));
        }
        setSelectedKeys(keys);
        handleSearch(keys, confirm);
      };

      return (
        <div
          style={{ padding: 8, width: 250 }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div style={{ marginBottom: 8, fontWeight: 600, color: "#1890ff" }}>
            Lọc theo {columnTitle || dataIndex}
          </div>

          <InputNumber
            placeholder="Nhập giá trị"
            value={value}
            onChange={(val) => setValue(val ?? undefined)}
            style={{ width: "100%", marginBottom: 8 }}
            onPressEnter={handleApply}
          />

          <Space style={{ marginTop: 8 }}>
            <Button
              type="primary"
              onClick={handleApply}
              icon={<SearchOutlined />}
              size="small"
              disabled={value === undefined}
            >
              Áp dụng
            </Button>
            <Button
              onClick={() => {
                if (clearFilters) {
                  setValue(undefined);
                  handleReset(clearFilters);
                  confirm({ closeDropdown: false });
                }
              }}
              size="small"
              icon={<ReloadOutlined />}
            >
              Làm mới
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
  });

  return { getColumnSearchProps, getColumnDateProps, getColumnNumberProps };
};

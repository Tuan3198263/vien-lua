import * as ExcelJS from 'exceljs';

/**
 * Cấu hình cột cho Excel
 */
export interface ExcelColumnConfig {
  header: string; // Tên cột hiển thị
  key: string; // Key trong data object
  width?: number; // Độ rộng cột (mặc định 15)
}

/**
 * ExcelUtils - Tiện ích tạo file Excel
 * 
 * Sử dụng:
 * ```typescript
 * const columns = [
 *   { header: 'Mã đề tài', key: 'ma_de_tai', width: 15 },
 *   { header: 'Tên đề tài', key: 'ten_de_tai', width: 40 }
 * ];
 * const buffer = await ExcelUtils.generateExcel(data, columns, 'Danh sách đề tài');
 * ```
 */
export class ExcelUtils {
  /**
   * Tạo file Excel từ data và cấu hình cột
   * @param data Mảng dữ liệu cần export
   * @param columns Cấu hình các cột
   * @param sheetName Tên sheet (mặc định: 'Sheet1')
   * @returns Buffer của file Excel
   */
  static async generateExcel(
    data: any[],
    columns: ExcelColumnConfig[],
    sheetName: string = 'Sheet1',
  ): Promise<Buffer> {
    // Tạo workbook mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Cấu hình các cột
    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width || 15,
    }));

    // Style cho header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }, // Màu xám nhạt
    };
    worksheet.getRow(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    // Thêm dữ liệu vào worksheet
    data.forEach((item) => {
      const row = {};
      columns.forEach((col) => {
        // Lấy giá trị từ nested object (ví dụ: danh_muc_linh_vuc.ten)
        let value = this.getNestedValue(item, col.key);
        
        // Format ngày nếu là Date object hoặc ISO string
        if (value && this.isDateField(col.key)) {
          value = this.formatDate(value);
        }
        
        row[col.key] = value;
      });
      worksheet.addRow(row);
    });

    // Auto-filter cho header
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: columns.length },
    };

    // Border cho tất cả các cell có data
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Chuyển workbook thành buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Lấy giá trị từ nested object
   * Ví dụ: getNestedValue(obj, 'danh_muc.ten') => obj.danh_muc.ten
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current?.[key];
    }, obj);
  }

  /**
   * Kiểm tra xem field có phải là ngày hay không
   */
  private static isDateField(key: string): boolean {
    const dateFields = ['ngay', 'thoi_gian', 'date', 'time'];
    return dateFields.some(field => key.toLowerCase().includes(field));
  }

  /**
   * Format ngày từ ISO string hoặc Date object sang DD/MM/YYYY
   */
  private static formatDate(value: any): string {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value; // Không phải ngày hợp lệ, trả về giá trị gốc
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch {
      return value;
    }
  }
}

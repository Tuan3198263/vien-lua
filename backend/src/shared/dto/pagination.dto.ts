import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO cho phân trang và filter
 * Sử dụng cho các API GET danh sách
 * 
 * Logic filter mới:
 * - Nhận filter theo từng field cụ thể (tai_khoan, ho_ten, email...)
 * - Không còn param "search" chung
 * - Không còn sort_field, sort_order (mặc định sort theo ngay_tao DESC)
 * 
 * Lưu ý: DTO này cho phép additional properties để hỗ trợ dynamic filtering
 */
export class PaginationDto {
  /**
   * Số trang hiện tại (bắt đầu từ 1)
   * Mặc định: 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang phải là số nguyên' })
  @Min(1, { message: 'Trang phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  /**
   * Số lượng bản ghi trên mỗi trang
   * Mặc định: 10, Tối đa: 100
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn hoặc bằng 1' })
  @Max(100, { message: 'Limit không được vượt quá 100' })
  limit?: number = 10;

  /**
   * Các trường filter động
   * Mỗi entity sẽ có các field riêng (trừ id)
   * Ví dụ: tai_khoan, ho_ten, email, sdt, gioi_tinh...
   * Frontend sẽ gửi: ?tai_khoan=admin&ho_ten=Nguyen
   * 
   * Sử dụng [key: string]: any để cho phép nhận bất kỳ field nào
   */
  [key: string]: any;
}

/**
 * Interface cho kết quả phân trang
 */
export interface PaginatedResult<T> {
  /**
   * Dữ liệu của trang hiện tại
   */
  data: T[];

  /**
   * Thông tin phân trang
   */
  meta: {
    /**
     * Trang hiện tại
     */
    current_page: number;

    /**
     * Số lượng bản ghi trên mỗi trang
     */
    per_page: number;

    /**
     * Tổng số bản ghi
     */
    total: number;

    /**
     * Tổng số trang
     */
    total_pages: number;

    /**
     * Có trang trước không
     */
    has_previous: boolean;

    /**
     * Có trang sau không
     */
    has_next: boolean;
  };
}

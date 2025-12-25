import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO cho phân trang
 * Sử dụng cho các API GET danh sách
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
   * Trường để sắp xếp
   * Ví dụ: 'ngay_tao', 'ten_vai_tro'
   */
  @IsOptional()
  @IsString({ message: 'Sort field phải là chuỗi' })
  sort_field?: string;

  /**
   * Thứ tự sắp xếp
   * 'ASC': tăng dần, 'DESC': giảm dần
   * Mặc định: 'DESC'
   */
  @IsOptional()
  @IsString({ message: 'Sort order phải là chuỗi' })
  sort_order?: 'ASC' | 'DESC' = 'DESC';

  /**
   * Từ khóa tìm kiếm chung
   * Sẽ tìm kiếm trên nhiều trường tùy theo từng entity
   */
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi' })
  search?: string;
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

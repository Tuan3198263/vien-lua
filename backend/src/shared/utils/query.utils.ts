import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';

/**
 * Utility class để xử lý phân trang và lọc
 * Version mới: Không còn sắp xếp động, chỉ mặc định ngay_tao DESC
 */
export class QueryUtils {
  /**
   * Áp dụng phân trang cho query builder
   * @param queryBuilder - TypeORM query builder
   * @param paginationDto - Thông tin phân trang
   * @returns Query builder đã được áp dụng phân trang
   */
  static applyPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): SelectQueryBuilder<T> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    return queryBuilder.skip(skip).take(limit);
  }

  /**
   * Áp dụng filter theo từng field
   * Loại bỏ các field không hợp lệ (id, page, limit) và áp dụng LIKE cho các field còn lại
   * @param queryBuilder - TypeORM query builder
   * @param paginationDto - DTO chứa các field filter
   * @param alias - Alias của entity trong query
   * @param allowedFields - Danh sách các field được phép filter (không bao gồm id)
   * @returns Query builder đã được áp dụng filter
   */
  static applyFieldFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
    alias: string,
    allowedFields: string[],
  ): SelectQueryBuilder<T> {
    // Các field không được filter
    const excludedKeys = ['page', 'limit', 'id'];

    // Duyệt qua tất cả các key trong paginationDto
    Object.keys(paginationDto).forEach((key) => {
      const value = paginationDto[key];

      // Bỏ qua nếu:
      // - Key nằm trong excludedKeys
      // - Không nằm trong allowedFields
      // - Value null/undefined hoặc empty string
      if (
        excludedKeys.includes(key) ||
        !allowedFields.includes(key) ||
        value === null ||
        value === undefined ||
        value === ''
      ) {
        return;
      }

      // Áp dụng LIKE filter cho field
      queryBuilder.andWhere(`${alias}.${key} LIKE :${key}`, {
        [key]: `%${value}%`,
      });
    });

    return queryBuilder;
  }

  /**
   * Tạo kết quả phân trang với metadata
   * @param data - Dữ liệu của trang hiện tại
   * @param total - Tổng số bản ghi
   * @param paginationDto - Thông tin phân trang
   * @returns Kết quả phân trang với metadata
   */
  static createPaginatedResult<T>(
    data: T[],
    total: number,
    paginationDto: PaginationDto,
  ): PaginatedResult<T> {
    const { page = 1, limit = 10 } = paginationDto;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        current_page: page,
        per_page: limit,
        total,
        total_pages: totalPages,
        has_previous: page > 1,
        has_next: page < totalPages,
      },
    };
  }

  /**
   * Áp dụng tất cả các utilities cho query builder
   * Version mới: Chỉ áp dụng field filtering + phân trang
   * Mặc định sort theo ngay_tao DESC (không thay đổi)
   * 
   * @param queryBuilder - TypeORM query builder
   * @param paginationDto - Thông tin phân trang và filter
   * @param alias - Alias của entity trong query
   * @param allowedFields - Các field được phép filter (không bao gồm id)
   * @returns Query builder đã được áp dụng đầy đủ
   */
  static applyQueryOptions<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
    alias: string,
    allowedFields: string[] = [],
  ): SelectQueryBuilder<T> {
    // 1. Áp dụng field filtering
    if (allowedFields.length > 0) {
      this.applyFieldFilters(queryBuilder, paginationDto, alias, allowedFields);
    }

    // 2. Mặc định sort theo ngay_tao DESC
    queryBuilder.orderBy(`${alias}.ngay_tao`, 'DESC');

    // 3. Áp dụng phân trang
    this.applyPagination(queryBuilder, paginationDto);

    return queryBuilder;
  }
}

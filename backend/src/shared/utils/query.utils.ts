import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';

/**
 * Utility class để xử lý phân trang, lọc và sắp xếp
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
   * Áp dụng sắp xếp cho query builder
   * @param queryBuilder - TypeORM query builder
   * @param paginationDto - Thông tin sắp xếp
   * @param alias - Alias của entity trong query
   * @param defaultSortField - Trường sắp xếp mặc định
   * @returns Query builder đã được áp dụng sắp xếp
   */
  static applySorting<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
    alias: string,
    defaultSortField: string = 'ngay_tao',
  ): SelectQueryBuilder<T> {
    const { sort_field, sort_order = 'DESC' } = paginationDto;
    const sortField = sort_field || defaultSortField;

    return queryBuilder.orderBy(`${alias}.${sortField}`, sort_order);
  }

  /**
   * Áp dụng tìm kiếm cho query builder
   * @param queryBuilder - TypeORM query builder
   * @param searchTerm - Từ khóa tìm kiếm
   * @param searchFields - Các trường cần tìm kiếm
   * @param alias - Alias của entity trong query
   * @returns Query builder đã được áp dụng tìm kiếm
   */
  static applySearch<T>(
    queryBuilder: SelectQueryBuilder<T>,
    searchTerm: string | undefined,
    searchFields: string[],
    alias: string,
  ): SelectQueryBuilder<T> {
    if (!searchTerm || !searchFields.length) {
      return queryBuilder;
    }

    const conditions = searchFields
      .map((field) => `${alias}.${field} LIKE :searchTerm`)
      .join(' OR ');

    return queryBuilder.andWhere(`(${conditions})`, {
      searchTerm: `%${searchTerm}%`,
    });
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
   * Áp dụng tất cả các utilities (phân trang, sắp xếp, tìm kiếm) cho query builder
   * @param queryBuilder - TypeORM query builder
   * @param paginationDto - Thông tin phân trang
   * @param alias - Alias của entity trong query
   * @param searchFields - Các trường cần tìm kiếm
   * @param defaultSortField - Trường sắp xếp mặc định
   * @returns Query builder đã được áp dụng đầy đủ
   */
  static applyQueryOptions<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
    alias: string,
    searchFields: string[] = [],
    defaultSortField: string = 'ngay_tao',
  ): SelectQueryBuilder<T> {
    // Áp dụng tìm kiếm
    if (paginationDto.search && searchFields.length > 0) {
      this.applySearch(queryBuilder, paginationDto.search, searchFields, alias);
    }

    // Áp dụng sắp xếp
    this.applySorting(queryBuilder, paginationDto, alias, defaultSortField);

    // Áp dụng phân trang
    this.applyPagination(queryBuilder, paginationDto);

    return queryBuilder;
  }
}

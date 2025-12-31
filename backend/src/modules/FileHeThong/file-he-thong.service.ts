import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileHeThong } from './file-he-thong.entity';
import { S3Config } from '../../config/s3.config';
import { FileUtils } from '../../shared/utils/file.utils';
import { PaginationDto, PaginatedResult } from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';
import {
  UploadFileDto,
  GetFileDto,
  DeleteFileDto,
  DeleteRecordFilesDto,
  FileResponseDto,
} from './dto/file-he-thong.dto';

/**
 * Service xử lý logic cho module File Hệ Thống
 * Quản lý upload, xóa file trên AWS S3
 */
@Injectable()
export class FileHeThongService {
  constructor(
    @InjectRepository(FileHeThong)
    private fileHeThongRepository: Repository<FileHeThong>,
    private s3Config: S3Config,
  ) {}

  /**
   * Upload file lên S3 và lưu thông tin vào database
   * Nếu đã có file cũ → Xóa file cũ và thay thế
   * 
   * @param file - File từ multer
   * @param uploadDto - Thông tin upload (module, ban_ghi_id, ten_truong)
   * @param nguoi_cap_nhat - ID người upload
   * @returns Thông tin file đã upload
   */
  async uploadFile(
    file: Express.Multer.File,
    uploadDto: UploadFileDto,
    nguoi_cap_nhat: number,
  ): Promise<FileResponseDto> {
    // 1. Validate file
    if (!file) {
      throw new BadRequestException('Không có file để upload');
    }

    if (!FileUtils.isAllowedFileType(file.mimetype)) {
      throw new BadRequestException(
        'Định dạng file không hợp lệ. Chỉ cho phép: PDF, Word, TXT, Image',
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      throw new BadRequestException('Kích thước file không được vượt quá 4MB');
    }

    // 2. Kiểm tra file cũ
    const existingFile = await this.fileHeThongRepository.findOne({
      where: {
        module: uploadDto.module,
        ban_ghi_id: uploadDto.ban_ghi_id,
        ten_truong: uploadDto.ten_truong,
      },
    });

    // 3. Nếu có file cũ → Xóa khỏi S3
    if (existingFile) {
      try {
        await this.xoaKhoiS3(existingFile.ten_luu_tru);
      } catch (error) {
        console.error('Lỗi khi xóa file cũ khỏi S3:', error);
        // Không throw error, vẫn tiếp tục upload file mới
      }
    }

    // 4. Tạo tên file unique
    const tenLuuTru = FileUtils.generateUniqueFileName(file.originalname);
    const bucketName = this.s3Config.getBucketName();
    const duongDanS3 = `${bucketName}/${tenLuuTru}`;

    // 5. Upload lên S3
    try {
      await this.uploadLenS3(tenLuuTru, file.buffer, file.mimetype);
    } catch (error) {
      console.error('Lỗi upload lên S3:', error);
      throw new InternalServerErrorException('Không thể upload file lên S3');
    }

    // 6. Lưu/Update database
    const fileData = {
      ten_goc: file.originalname,
      ten_luu_tru: tenLuuTru,
      duong_dan_s3: duongDanS3,
      kich_thuoc: file.size,
      loai_file: file.mimetype,
      module: uploadDto.module,
      ban_ghi_id: uploadDto.ban_ghi_id,
      ten_truong: uploadDto.ten_truong,
      nguoi_cap_nhat,
    };

    let savedFile: FileHeThong;

    if (existingFile) {
      // Update file cũ
      await this.fileHeThongRepository.update(existingFile.id, fileData);
      savedFile = await this.fileHeThongRepository.findOne({
        where: { id: existingFile.id },
      });
    } else {
      // Insert file mới
      savedFile = await this.fileHeThongRepository.save(fileData);
    }

    // 7. Tạo presigned URL để xem file
    const urlXem = await this.taoPresignedUrl(savedFile.ten_luu_tru);

    return {
      ...savedFile,
      url_xem: urlXem,
    };
  }

  /**
   * Lấy thông tin file theo module, ban_ghi_id, ten_truong
   * 
   * @param getFileDto - Thông tin để tìm file
   * @returns Thông tin file hoặc null nếu không tìm thấy
   */
  async layFile(getFileDto: GetFileDto): Promise<FileResponseDto | null> {
    const file = await this.fileHeThongRepository.findOne({
      where: {
        module: getFileDto.module,
        ban_ghi_id: getFileDto.ban_ghi_id,
        ten_truong: getFileDto.ten_truong,
      },
    });

    if (!file) {
      return null;
    }

    // Tạo presigned URL
    const urlXem = await this.taoPresignedUrl(file.ten_luu_tru);

    return {
      ...file,
      url_xem: urlXem,
    };
  }

  /**
   * Lấy file theo ID
   * 
   * @param id - ID file
   * @returns Thông tin file
   */
  async layFileTheoId(id: number): Promise<FileResponseDto> {
    const file = await this.fileHeThongRepository.findOne({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException('Không tìm thấy file');
    }

    const urlXem = await this.taoPresignedUrl(file.ten_luu_tru);

    return {
      ...file,
      url_xem: urlXem,
    };
  }

  /**
   * Lấy danh sách file (có phân trang, filter)
   * 
   * @param paginationDto - Params phân trang và filter
   * @returns Danh sách file đã phân trang (kèm url_xem)
   */
  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<FileResponseDto>> {
    // Tạo query builder
    const queryBuilder = this.fileHeThongRepository
      .createQueryBuilder('file');

    // Các field được phép filter
    const allowedFields = [
      'module',
      'loai_file',
      'ten_goc',
    ];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      paginationDto,
      'file',
      allowedFields,
    );

    // Lấy dữ liệu và tổng số bản ghi
    const [entities, total] = await queryBuilder.getManyAndCount();

    // Load thông tin người cập nhật cho từng file
    const data = await Promise.all(
      entities.map(async (file) => {
        let nguoi_cap_nhat_info = null;
        
        if (file.nguoi_cap_nhat) {
          // Query để lấy thông tin người dùng
          const nguoiDung = await this.fileHeThongRepository.manager
            .createQueryBuilder()
            .select(['nguoi_dung.id', 'nguoi_dung.ho_ten'])
            .from('nguoi_dung', 'nguoi_dung')
            .where('nguoi_dung.id = :id', { id: file.nguoi_cap_nhat })
            .getRawOne();
          
          if (nguoiDung) {
            nguoi_cap_nhat_info = {
              id: nguoiDung.nguoi_dung_id,
              ho_ten: nguoiDung.nguoi_dung_ho_ten,
            };
          }
        }

        return {
          ...file,
          nguoi_cap_nhat_info,
        };
      })
    );

    // Tạo presigned URL cho từng file
    const dataWithUrls = await Promise.all(
      data.map(async (file) => ({
        ...file,
        url_xem: await this.taoPresignedUrl(file.ten_luu_tru),
      })),
    );

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(dataWithUrls, total, paginationDto);
  }

  /**
   * Xóa file (xóa khỏi S3 và database)
   * 
   * @param deleteFileDto - Thông tin file cần xóa
   */
  async xoaFile(deleteFileDto: DeleteFileDto): Promise<void> {
    const file = await this.fileHeThongRepository.findOne({
      where: {
        module: deleteFileDto.module,
        ban_ghi_id: deleteFileDto.ban_ghi_id,
        ten_truong: deleteFileDto.ten_truong,
      },
    });

    if (!file) {
      return; // Không có file thì không làm gì
    }

    // Xóa khỏi S3
    try {
      await this.xoaKhoiS3(file.ten_luu_tru);
    } catch (error) {
      console.error('Lỗi xóa file khỏi S3:', error);
      // Vẫn tiếp tục xóa trong database
    }

    // Xóa khỏi database
    await this.fileHeThongRepository.delete(file.id);
  }

  /**
   * Xóa tất cả file của 1 bản ghi
   * Dùng khi xóa bản ghi trong module
   * 
   * @param deleteRecordFilesDto - Thông tin bản ghi
   */
  async xoaFileCuaBanGhi(deleteRecordFilesDto: DeleteRecordFilesDto): Promise<void> {
    const files = await this.fileHeThongRepository.find({
      where: {
        module: deleteRecordFilesDto.module,
        ban_ghi_id: deleteRecordFilesDto.ban_ghi_id,
      },
    });

    if (files.length === 0) {
      return;
    }

    // Xóa từng file khỏi S3
    for (const file of files) {
      try {
        await this.xoaKhoiS3(file.ten_luu_tru);
      } catch (error) {
        console.error(`Lỗi xóa file ${file.ten_luu_tru} khỏi S3:`, error);
      }
    }

    // Xóa tất cả records trong database
    await this.fileHeThongRepository.delete({
      module: deleteRecordFilesDto.module,
      ban_ghi_id: deleteRecordFilesDto.ban_ghi_id,
    });
  }

  /**
   * Upload file lên S3
   * 
   * @param key - Tên file trên S3
   * @param buffer - Nội dung file
   * @param contentType - MIME type
   */
  private async uploadLenS3(
    key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.s3Config.getBucketName(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Config.getS3Client().send(command);
  }

  /**
   * Xóa file khỏi S3
   * 
   * @param key - Tên file trên S3
   */
  private async xoaKhoiS3(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.s3Config.getBucketName(),
      Key: key,
    });

    await this.s3Config.getS3Client().send(command);
  }

  /**
   * Tạo presigned URL để xem/download file
   * URL có thời hạn 1 giờ
   * 
   * @param key - Tên file trên S3
   * @returns Presigned URL
   */
  private async taoPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.s3Config.getBucketName(),
      Key: key,
    });

    // URL có hiệu lực trong 1 giờ (3600 giây)
    return await getSignedUrl(this.s3Config.getS3Client(), command, {
      expiresIn: 3600,
    });
  }
}

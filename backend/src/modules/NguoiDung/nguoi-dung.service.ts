import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NguoiDung } from './nguoi-dung.entity';
import {
  CreateNguoiDungDto,
  UpdateNguoiDungDto,
  ChangePasswordDto,
} from './dto/nguoi-dung.dto';
import { RegisterDto, LoginDto, AuthResponse, RegisterResponse } from './dto/auth.dto';
import { PaginationDto, PaginatedResult } from '../../shared/dto/pagination.dto';
import { QueryUtils } from '../../shared/utils/query.utils';
import { VaiTroService } from '../VaiTro/vai-tro.service';
import { BCRYPT_SALT_ROUNDS } from '../../shared/constants/app.constants';

/**
 * Service xử lý logic cho module Người Dùng
 */
@Injectable()
export class NguoiDungService {
  constructor(
    @InjectRepository(NguoiDung)
    private nguoiDungRepository: Repository<NguoiDung>,
    private vaiTroService: VaiTroService,
    private jwtService: JwtService,
  ) {}

  /**
   * Hash mật khẩu sử dụng bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  /**
   * So sánh mật khẩu với hash
   */
  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Tạo JWT token
   */
  private async generateToken(user: NguoiDung): Promise<string> {
    const payload = {
      sub: user.id,
      tai_khoan: user.tai_khoan,
      vai_tro: user.vai_tro,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Đăng ký tài khoản mới
   * Mặc định gán vai trò 'USER' cho người dùng mới
   * Không trả về token, người dùng cần đăng nhập sau khi đăng ký
   */
  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    // Kiểm tra tài khoản đã tồn tại chưa
    const existingUser = await this.nguoiDungRepository.findOne({
      where: [
        { tai_khoan: registerDto.tai_khoan },
        { email: registerDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Tài khoản hoặc email đã tồn tại');
    }

    // Lấy vai trò USER mặc định
    let vaiTro = await this.vaiTroService.findByMaVaiTro('USER');
    
    // Nếu chưa có vai trò USER, tạo mới
    if (!vaiTro) {
      vaiTro = await this.vaiTroService.create({
        ma_vai_tro: 'USER',
        ten_vai_tro: 'Người dùng',
        mo_ta: 'Vai trò mặc định cho người dùng thông thường',
      });
    }

    // Hash mật khẩu
    const hashedPassword = await this.hashPassword(registerDto.mat_khau);

    // Tạo người dùng mới
    const nguoiDung = this.nguoiDungRepository.create({
      tai_khoan: registerDto.tai_khoan,
      mat_khau: hashedPassword,
      ho_ten: registerDto.ho_ten,
      email: registerDto.email,
      vai_tro: vaiTro,
    });

    // Lưu vào database
    const savedUser = await this.nguoiDungRepository.save(nguoiDung);

    // Trả về thông tin user (không có token)
    return {
      message: 'Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.',
      user: {
        id: savedUser.id,
        tai_khoan: savedUser.tai_khoan,
        ho_ten: savedUser.ho_ten,
        email: savedUser.email,
        vai_tro: savedUser.vai_tro,
      },
    };
  }

  /**
   * Đăng nhập
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Tìm người dùng theo tài khoản (bao gồm cả mật khẩu)
    const nguoiDung = await this.nguoiDungRepository
      .createQueryBuilder('nguoi_dung')
      .leftJoinAndSelect('nguoi_dung.vai_tro', 'vai_tro')
      .addSelect('nguoi_dung.mat_khau')
      .where('nguoi_dung.tai_khoan = :tai_khoan', {
        tai_khoan: loginDto.tai_khoan,
      })
      .getOne();

    if (!nguoiDung) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await this.comparePassword(
      loginDto.mat_khau,
      nguoiDung.mat_khau,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    // Tạo token
    const token = await this.generateToken(nguoiDung);

    return {
      access_token: token,
      user: {
        id: nguoiDung.id,
        tai_khoan: nguoiDung.tai_khoan,
        ho_ten: nguoiDung.ho_ten,
        email: nguoiDung.email,
        vai_tro: nguoiDung.vai_tro,
      },
    };
  }

  /**
   * Đăng xuất
   * Ở phía backend chỉ cần trả về message thành công
   * Token sẽ được xóa ở phía client (localStorage/Redux)
   */
  async logout(userId: number): Promise<{ message: string }> {
    // Có thể thêm logic như: blacklist token, log hoạt động, v.v.
    // Hiện tại chỉ trả về message
    return { message: 'Đăng xuất thành công' };
  }

  /**
   * Lấy thông tin profile người dùng hiện tại
   */
  async getProfile(userId: number): Promise<NguoiDung> {
    const nguoiDung = await this.nguoiDungRepository.findOne({
      where: { id: userId },
      relations: ['vai_tro'],
    });

    if (!nguoiDung) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return nguoiDung;
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Lấy người dùng với mật khẩu
    const nguoiDung = await this.nguoiDungRepository
      .createQueryBuilder('nguoi_dung')
      .addSelect('nguoi_dung.mat_khau')
      .where('nguoi_dung.id = :id', { id: userId })
      .getOne();

    if (!nguoiDung) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra mật khẩu cũ
    const isOldPasswordValid = await this.comparePassword(
      changePasswordDto.mat_khau_cu,
      nguoiDung.mat_khau,
    );

    if (!isOldPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    // Hash mật khẩu mới
    nguoiDung.mat_khau = await this.hashPassword(
      changePasswordDto.mat_khau_moi,
    );

    // Lưu thay đổi
    await this.nguoiDungRepository.save(nguoiDung);

    return { message: 'Đổi mật khẩu thành công' };
  }

  /**
   * Tạo người dùng mới (bởi admin)
   */
  async create(createNguoiDungDto: CreateNguoiDungDto): Promise<NguoiDung> {
    // Kiểm tra tài khoản và email đã tồn tại chưa
    const existing = await this.nguoiDungRepository.findOne({
      where: [
        { tai_khoan: createNguoiDungDto.tai_khoan },
        { email: createNguoiDungDto.email },
      ],
    });

    if (existing) {
      throw new ConflictException('Tài khoản hoặc email đã tồn tại');
    }

    // Kiểm tra vai trò có tồn tại không
    const vaiTro = await this.vaiTroService.findOne(
      createNguoiDungDto.vai_tro_id,
    );

    // Hash mật khẩu
    const hashedPassword = await this.hashPassword(createNguoiDungDto.mat_khau);

    // Tạo người dùng mới
    const nguoiDung = this.nguoiDungRepository.create({
      ...createNguoiDungDto,
      mat_khau: hashedPassword,
      vai_tro: vaiTro,
    });

    // Lưu vào database
    return await this.nguoiDungRepository.save(nguoiDung);
  }

  /**
   * Lấy danh sách người dùng với phân trang và lọc theo field
   * Không còn hỗ trợ sort động, mặc định sort theo ngay_tao DESC
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<NguoiDung>> {
    // Tạo query builder
    const queryBuilder = this.nguoiDungRepository
      .createQueryBuilder('nguoi_dung')
      .leftJoinAndSelect('nguoi_dung.vai_tro', 'vai_tro');

    // Các field được phép filter (trừ id, mat_khau)
    const allowedFields = [
      'tai_khoan',
      'ho_ten',
      'email',
      'sdt',
      'dia_chi',
      'ngay_sinh',
      'gioi_tinh',
      'ngay_cap_nhat',
    ];

    // Áp dụng field filtering và phân trang
    QueryUtils.applyQueryOptions(
      queryBuilder,
      paginationDto,
      'nguoi_dung',
      allowedFields,
    );

    // Lấy dữ liệu và tổng số bản ghi
    const [data, total] = await queryBuilder.getManyAndCount();

    // Tạo kết quả phân trang
    return QueryUtils.createPaginatedResult(data, total, paginationDto);
  }

  /**
   * Lấy một người dùng theo ID
   */
  async findOne(id: number): Promise<NguoiDung> {
    const nguoiDung = await this.nguoiDungRepository.findOne({
      where: { id },
      relations: ['vai_tro'],
    });

    if (!nguoiDung) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }

    return nguoiDung;
  }

  /**
   * Cập nhật người dùng
   */
  async update(
    id: number,
    updateNguoiDungDto: UpdateNguoiDungDto,
  ): Promise<NguoiDung> {
    // Kiểm tra người dùng có tồn tại không
    const nguoiDung = await this.findOne(id);

    // Nếu cập nhật email, kiểm tra trùng lặp
    if (updateNguoiDungDto.email && updateNguoiDungDto.email !== nguoiDung.email) {
      const existing = await this.nguoiDungRepository.findOne({
        where: { email: updateNguoiDungDto.email },
      });

      if (existing) {
        throw new ConflictException('Email đã tồn tại');
      }
    }

    // Nếu cập nhật vai trò, kiểm tra vai trò có tồn tại không
    if (updateNguoiDungDto.vai_tro_id) {
      const vaiTro = await this.vaiTroService.findOne(
        updateNguoiDungDto.vai_tro_id,
      );
      nguoiDung.vai_tro = vaiTro;
    }

    // Cập nhật các trường khác (trừ vai_tro_id)
    const { vai_tro_id, ...updateData } = updateNguoiDungDto;
    Object.assign(nguoiDung, updateData);

    // Lưu thay đổi
    return await this.nguoiDungRepository.save(nguoiDung);
  }

  /**
   * Xóa người dùng (soft delete)
   * Không xóa thật khỏi database, chỉ đánh dấu deleted_at
   * Điều này đảm bảo dữ liệu liên quan không bị ảnh hưởng
   */
  async remove(id: number): Promise<{ message: string }> {
    // Kiểm tra người dùng có tồn tại không
    const nguoiDung = await this.findOne(id);

    // Soft delete: đánh dấu deleted_at thay vì xóa thật
    await this.nguoiDungRepository.softRemove(nguoiDung);

    return { message: 'Xóa người dùng thành công' };
  }

  /**
   * Xóa nhiều người dùng (soft delete)
   */
  async removeMultiple(ids: number[]): Promise<{ message: string; count: number }> {
    // Soft delete: sử dụng softDelete thay vì delete
    const result = await this.nguoiDungRepository.softDelete(ids);

    return {
      message: 'Xóa người dùng thành công',
      count: result.affected || 0,
    };
  }
}

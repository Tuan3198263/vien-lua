import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SanPhamThucTe } from './entities/san-pham-thuc-te.entity';
import { CreateSanPhamThucTeDto, UpdateSanPhamThucTeDto } from './dto/de-tai.dto';

@Injectable()
export class SanPhamThucTeService {
  constructor(
    @InjectRepository(SanPhamThucTe)
    private readonly sanPhamThucTeRepository: Repository<SanPhamThucTe>,
  ) {}

  async tao(
    deTaiId: number,
    createDto: CreateSanPhamThucTeDto,
  ): Promise<SanPhamThucTe> {
    const sanPham = this.sanPhamThucTeRepository.create({
      ...createDto,
      de_tai_id: deTaiId,
    });

    return this.sanPhamThucTeRepository.save(sanPham);
  }

  async layDanhSach(deTaiId: number): Promise<SanPhamThucTe[]> {
    return this.sanPhamThucTeRepository.find({
      where: { de_tai_id: deTaiId },
    });
  }

  async layTheoId(id: number): Promise<SanPhamThucTe> {
    const sanPham = await this.sanPhamThucTeRepository.findOne({
      where: { id },
    });

    if (!sanPham) {
      throw new NotFoundException(
        `Không tìm thấy sản phẩm thực tế với id ${id}`,
      );
    }

    return sanPham;
  }

  async capNhat(
    id: number,
    updateDto: UpdateSanPhamThucTeDto,
  ): Promise<SanPhamThucTe> {
    const sanPham = await this.layTheoId(id);
    Object.assign(sanPham, updateDto);
    return this.sanPhamThucTeRepository.save(sanPham);
  }

  async xoa(id: number): Promise<void> {
    const sanPham = await this.layTheoId(id);
    await this.sanPhamThucTeRepository.remove(sanPham);
  }
}

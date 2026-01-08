import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SanPham } from './entities/san-pham.entity';
import { CreateSanPhamDto, UpdateSanPhamDto } from './dto/de-tai.dto';

@Injectable()
export class SanPhamService {
  constructor(
    @InjectRepository(SanPham)
    private readonly sanPhamRepository: Repository<SanPham>,
  ) {}

  async tao(deTaiId: number, createDto: CreateSanPhamDto): Promise<SanPham> {
    const sanPham = this.sanPhamRepository.create({
      ...createDto,
      de_tai_id: deTaiId,
    });

    return this.sanPhamRepository.save(sanPham);
  }

  async layDanhSach(deTaiId: number): Promise<SanPham[]> {
    return this.sanPhamRepository.find({
      where: { de_tai_id: deTaiId },
    });
  }

  async layTheoId(id: number): Promise<SanPham> {
    const sanPham = await this.sanPhamRepository.findOne({
      where: { id },
    });

    if (!sanPham) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với id ${id}`);
    }

    return sanPham;
  }

  async capNhat(id: number, updateDto: UpdateSanPhamDto): Promise<SanPham> {
    const sanPham = await this.layTheoId(id);
    Object.assign(sanPham, updateDto);
    return this.sanPhamRepository.save(sanPham);
  }

  async xoa(id: number): Promise<void> {
    const sanPham = await this.layTheoId(id);
    await this.sanPhamRepository.remove(sanPham);
  }
}

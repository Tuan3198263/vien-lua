import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KinhPhiNam } from './entities/kinh-phi-nam.entity';
import { DeTai } from './entities/de-tai.entity';
import { CreateKinhPhiNamDto, UpdateKinhPhiNamDto } from './dto/de-tai.dto';

@Injectable()
export class KinhPhiNamService {
  constructor(
    @InjectRepository(KinhPhiNam)
    private readonly kinhPhiNamRepository: Repository<KinhPhiNam>,
    @InjectRepository(DeTai)
    private readonly deTaiRepository: Repository<DeTai>,
  ) {}

  async tao(
    deTaiId: number,
    createDto: CreateKinhPhiNamDto,
  ): Promise<KinhPhiNam> {
    const deTai = await this.deTaiRepository.findOne({
      where: { id: deTaiId },
      relations: ['danh_sach_kinh_phi'],
    });

    if (!deTai) {
      throw new NotFoundException(`Không tìm thấy đề tài với id ${deTaiId}`);
    }

    // Validate năm phải nằm trong khoảng ngày bắt đầu và kết thúc
    const namBatDau = new Date(deTai.ngay_bat_dau).getFullYear();
    const namKetThuc = new Date(deTai.ngay_ket_thuc).getFullYear();

    if (createDto.nam < namBatDau || createDto.nam > namKetThuc) {
      throw new BadRequestException(
        `Năm phải nằm trong khoảng ${namBatDau} - ${namKetThuc}`,
      );
    }

    // Validate tổng kinh phí không vượt quá kinh phí tổng
    const tongKinhPhiHienTai = deTai.danh_sach_kinh_phi.reduce(
      (sum, kp) => sum + Number(kp.kinh_phi),
      0,
    );
    const tongKinhPhiMoi = tongKinhPhiHienTai + createDto.kinh_phi;

    if (tongKinhPhiMoi > Number(deTai.kinh_phi_tong)) {
      throw new BadRequestException(
        `Tổng kinh phí (${tongKinhPhiMoi}) vượt quá kinh phí tổng (${deTai.kinh_phi_tong})`,
      );
    }

    const kinhPhiNam = this.kinhPhiNamRepository.create({
      ...createDto,
      de_tai_id: deTaiId,
    });

    return this.kinhPhiNamRepository.save(kinhPhiNam);
  }

  async layDanhSach(deTaiId: number): Promise<KinhPhiNam[]> {
    return this.kinhPhiNamRepository.find({
      where: { de_tai_id: deTaiId },
      order: { nam: 'ASC' },
    });
  }

  async layTheoId(id: number): Promise<KinhPhiNam> {
    const kinhPhi = await this.kinhPhiNamRepository.findOne({
      where: { id },
      relations: ['deTai'],
    });

    if (!kinhPhi) {
      throw new NotFoundException(`Không tìm thấy kinh phí với id ${id}`);
    }

    return kinhPhi;
  }

  async capNhat(
    id: number,
    updateDto: UpdateKinhPhiNamDto,
  ): Promise<KinhPhiNam> {
    const kinhPhi = await this.layTheoId(id);
    const deTai = await this.deTaiRepository.findOne({
      where: { id: kinhPhi.de_tai_id },
      relations: ['danh_sach_kinh_phi'],
    });

    // Validate năm nếu có cập nhật
    if (updateDto.nam) {
      const namBatDau = new Date(deTai.ngay_bat_dau).getFullYear();
      const namKetThuc = new Date(deTai.ngay_ket_thuc).getFullYear();

      if (updateDto.nam < namBatDau || updateDto.nam > namKetThuc) {
        throw new BadRequestException(
          `Năm phải nằm trong khoảng ${namBatDau} - ${namKetThuc}`,
        );
      }
    }

    // Validate tổng kinh phí nếu có cập nhật
    if (updateDto.kinh_phi !== undefined) {
      const tongKinhPhiHienTai = deTai.danh_sach_kinh_phi
        .filter((kp) => kp.id !== id)
        .reduce((sum, kp) => sum + Number(kp.kinh_phi), 0);
      const tongKinhPhiMoi = tongKinhPhiHienTai + updateDto.kinh_phi;

      if (tongKinhPhiMoi > Number(deTai.kinh_phi_tong)) {
        throw new BadRequestException(
          `Tổng kinh phí (${tongKinhPhiMoi}) vượt quá kinh phí tổng (${deTai.kinh_phi_tong})`,
        );
      }
    }

    Object.assign(kinhPhi, updateDto);
    return this.kinhPhiNamRepository.save(kinhPhi);
  }

  async xoa(id: number): Promise<void> {
    const kinhPhi = await this.layTheoId(id);
    await this.kinhPhiNamRepository.remove(kinhPhi);
  }
}

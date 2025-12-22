import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

/**
 * User Service
 * Chứa logic nghiệp vụ của User
 * Đây chỉ là demo structure, chưa có CRUD hoàn chỉnh
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Lấy tất cả users
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Đếm số lượng users
   */
  async count(): Promise<object> {
    const count = await this.userRepository.count();
    return {
      count,
      message: 'Tổng số người dùng',
    };
  }
}

import { Injectable } from '@nestjs/common';
import { Users } from './database/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async createUser(email: string) {
    const user = this.userRepository.create({ email });
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async getHello() {
    const users = await this.findAll();
    console.log(users)
    return users;
  }
}
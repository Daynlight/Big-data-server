import { Injectable } from '@nestjs/common';
import { Files } from './database/files.entity';
import { Users } from './database/users.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findAll() {
    return await this.filesRepository.find();
  }

  async getUser(email: string){
    let user = await this.usersRepository.findOne({
      where: { email },
    });
    if(!user){
      user = this.usersRepository.create({ email });
      await this.usersRepository.save(user);
    }
    
    return user;   
  };

  async createFile(name: string, email: string) {
    const user = await this.getUser(email);

    let file = await this.filesRepository.findOne({
      where: { name: name, user: user },
    });

    if(file)
      return
    
    file = this.filesRepository.create({
      name,
      user,
    });

    return await this.filesRepository.save(file);
  };

  async listFiles() {
    const files = await this.findAll();
    return files;
  }
}
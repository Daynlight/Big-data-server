import { Injectable } from '@nestjs/common';
import { Files } from './database/files.entity';
import { Users } from './database/users.entity'
import { FileChunk } from './database/file-chunk.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(FileChunk)
    private readonly fileChunkRepository: Repository<FileChunk>,
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

  async getFile(name: string, user){
    let file = await this.filesRepository.findOne({
      where: { name: name, user: user },
    });
    if(!file){
      return -1;
    }
    
    return file;   
  };

  async createFile(email: string, name: string, chunks: number) {
    const user = await this.getUser(email);

    let file = await this.filesRepository.findOne({
      where: { name: name, user: user },
    });

    if(file)
      return -1
    
    file = this.filesRepository.create({
      name,
      chunks,
      user,
    });

    await this.filesRepository.save(file);
    return 0
  };

  async createUploadChunk(email: string, name: string, chunkid: number, hash: string, data: Buffer){
    const user = await this.getUser(email);
    const file = await this.getFile(name, user);

    if(file == -1) return

    const file_chunk = this.fileChunkRepository.create({
      idfc: chunkid,
      idf: file.idf,
      file: file,
      hash: hash,
      data: data
    });

    await this.fileChunkRepository.save(file_chunk);

    return 0;
  }

  async listFiles() {
    const files = await this.findAll();
    return files;
  }
}
import { Injectable } from '@nestjs/common';
import { Files } from './database/files.entity';
import { Users } from './database/users.entity'
import { FileChunk } from './database/file-chunk.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';




@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(FileChunk)
    private readonly fileChunkRepository: Repository<FileChunk>,
  ) {};




  async findAllInRange(page: number = 1, limit: number = 10) {
    const [files] = await this.filesRepository.findAndCount({
      relations: ['user'],
      select: {
        idf: true,
        name: true,
        chunks: true,
        user: {
          email: true,
        },
      },
      order: {
        idf: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return files;
  };




  async getUser(email: string){
    let user = await this.usersRepository.findOne({
      where: { email },
    });
    
    if(!user){
      user = this.usersRepository.create({ email });
      await this.usersRepository.save(user);
    };
    
    return user;   
  };




  async getFile(name: string, user){
    let file = await this.filesRepository.findOne({
      where: { name: name, user: user },
    });
    
    return file;   
  };




  async getChunk(file, chunkid){
    const chunk = await this.fileChunkRepository.findOne({
      where: { idfc: chunkid, file: file }
    });

    return chunk;
  };




  async createFile(email: string, name: string, chunks: number) {
    const user = await this.getUser(email);

    let file = await this.getFile(name, user);

    if(file){
      file.name = name;
      file.chunks = chunks;
    }
    else{
      file = this.filesRepository.create({
        name: name,
        chunks: chunks,
        user: user,
      });
    };

    await this.filesRepository.save(file);

    await this.fileChunkRepository.delete({
      file: file,
      idfc: MoreThanOrEqual(chunks)
    });

    return 0;
  };




  async generateHash(data: Buffer): Promise<string> {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  };




  async createUploadChunk(email: string, name: string, chunkid: number, hash: string, data: Buffer){
    const verify_hash = await this.generateHash(data);

    if(verify_hash != hash){
      console.log("hashes doesn't match");
      return -1;
    };
    
    const user = await this.getUser(email);
    const file = await this.getFile(name, user);

    if(!file) return;

    const existing = await this.getChunk(file, chunkid);

    if (existing) {
      existing.hash = hash;
      existing.data = data;
      existing.file = file;

      await this.fileChunkRepository.save(existing);
    } else {
      const file_chunk = this.fileChunkRepository.create({
        idfc: chunkid,
        idf: file.idf,
        file,
        hash,
        data,
      });

      await this.fileChunkRepository.save(file_chunk);
    };
    
    return 0;
  };




  async verifyChunkData(email: string, name: string, chunkid: number, hash: string){
    const user = await this.getUser(email);
    const file = await this.getFile(name, user);

    const chunk = await this.getChunk(file, chunkid);
    
    if(!chunk){
      console.log("chunk doesn't exists");
      return -1;
    };

    if(chunk.hash != hash){
      console.log("chunk hash are different");
      return -1;
    };
      
    console.log("chunks are the same");
    return 0;
  };

  async verifyDownloadChunk(idf: number, chunkid: number, hash: string){
    let file = await this.filesRepository.findOne({
      where: { idf: idf },
    });

    const chunk = await this.getChunk(file, chunkid);
    
    if(!chunk){
      console.log("chunk doesn't exists");
      return -1;
    };

    if(chunk.hash != hash){
      console.log("chunk hash are different");
      return -1;
    };
      
    console.log("chunks are the same");
    return 0;
  };




  async listFiles(page: number) {
    const files = await this.findAllInRange(page);
    return files;
  };




  async downloadChunk(idf: number, chunkid: number){
    let file = await this.filesRepository.findOne({
      where: { idf: idf },
    });
  
    if(!file)
      return -1;

    const chunk = await this.getChunk(file, chunkid);
    if(!chunk)
      return -1;

    return chunk;
  };
};
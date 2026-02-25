import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Files } from './files.entity'
import { FileChunk } from './file-chunk.entity'
import { Users } from './users.entity'




@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_BACKEND_HOST,
      port: 5432,
      username: process.env.POSTGRES_BACKEND_USER,
      password: process.env.POSTGRES_BACKEND_PASSWORD,
      database: process.env.POSTGRES_BACKEND_DB,
      autoLoadEntities: true,
      synchronize: false
    }),
    TypeOrmModule.forFeature([Users, Files, FileChunk])
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {};
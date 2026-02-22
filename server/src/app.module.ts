import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FileService } from './files.service';
import { KeycloakStrategy } from './keycloak.strategy'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Files } from './database/files.entity'
import { FileChunk } from './database/file-chunk.entity'
import { Users } from './database/users.entity'

@Module({
  imports: [PassportModule,
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
  controllers: [AppController],
  providers: [FileService, KeycloakStrategy],
})
export class AppModule {}

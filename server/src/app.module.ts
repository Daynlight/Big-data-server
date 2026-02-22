import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakStrategy } from './keycloak.strategy'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './database/file.entity'
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
    TypeOrmModule.forFeature([Users, File, FileChunk])
  ],
  controllers: [AppController],
  providers: [AppService, KeycloakStrategy],
})
export class AppModule {}

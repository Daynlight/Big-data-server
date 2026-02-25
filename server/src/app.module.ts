import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakStrategy } from './keycloak/keycloak.strategy'
import { PassportModule } from '@nestjs/passport'
import { DatabaseModule } from './database/database.module';




@Module({
  imports: [PassportModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, KeycloakStrategy],
})
export class AppModule {}

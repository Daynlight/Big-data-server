import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeycloakStrategy } from './keycloak.strategy'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule],
  controllers: [AppController],
  providers: [AppService, KeycloakStrategy],
})
export class AppModule {}

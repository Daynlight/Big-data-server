import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('keycloak'))
  @Get()
  getHello(@Req() req) {
    console.log("hello")
    return {
      message: this.appService.getHello(),
      user: req.user
    }
  }
}

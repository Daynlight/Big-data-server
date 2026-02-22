import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('keycloak'))
  @Get()
  async getHello(@Req() req) {
    console.log("hell")
    const users = await this.appService.getHello();
    
    return {
      message: users,
      user: req.user
    }
  }
}

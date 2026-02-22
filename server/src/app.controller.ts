import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { FileService } from './files.service';
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class AppController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard('keycloak'))
  @Get("/list")
  async listFiles(@Req() req) {
    console.log("hell")
    const users = await this.fileService.listFiles();

    return {
      message: users,
      user: req.user
    }
  }

  @UseGuards(AuthGuard('keycloak'))
  @Post("/create")
  async createFile(@Req() req, @Body() body: any){
    await this.fileService.createFile(body.name, req.user.email)
    return {
      message: "Success",
      user: req.user
    }
  }
}

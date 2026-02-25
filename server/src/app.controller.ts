import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport'




@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {};




  @UseGuards(AuthGuard('keycloak'))
  @Post("/list")
  async listFiles(@Req() req, @Body() body: any) {
    const files = await this.appService.listFiles(body.page);

    return {
      message: files,
      user: req.user
    };
  };




  @UseGuards(AuthGuard('keycloak'))
  @Post("/create")
  async createFile(@Req() req, @Body() body: any){
    const res = await this.appService.createFile(req.user.email, body.name, body.chunks);
    
    return {
      message: res,
      user: req.user
    };
  };




  @UseGuards(AuthGuard('keycloak'))
  @Post("/upload_chunk")
  async createUploadChunk(@Req() req, @Body() body: any){
    const res = await this.appService.createUploadChunk(req.user.email, body.name, body.chunkid, body.hash, body.data);
    
    return {
      message: res,
      user: req.user
    };
  };




  @UseGuards(AuthGuard('keycloak'))
  @Post("/verify_chunk")
  async verifyChunkData(@Req() req, @Body() body: any){
    const res = await this.appService.verifyChunkData(req.user.email, body.name, body.chunkid, body.hash);
    
    return {
      message: res,
      user: req.user
    };
  };




  @UseGuards(AuthGuard('keycloak'))
  @Post("/download_chunk")
  async downloadChunk(@Req() req, @Body() body: any){
    const res = await this.appService.downloadChunk(body.idf, body.chunkid);
    
    return {
      message: res,
      user: req.user
    };
  };




  @UseGuards(AuthGuard('keycloak'))
  @Post("/verify_download_chunk")
  async verifyDownloadChunk(@Req() req, @Body() body: any){
    const res = await this.appService.verifyDownloadChunk(body.idf, body.chunkid, body.hash);
    
    return {
      message: res,
      user: req.user
    };
  };
};

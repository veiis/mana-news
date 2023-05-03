import { Body, Param, Query, Controller, UploadedFile, HttpCode, HttpStatus, Get, Put, Post, Delete, UseGuards, UseInterceptors } from '@nestjs/common'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { DeleteVideoDto } from './dto/delete-video.dto'
import { GetOneVideoDto } from './dto/get-one-video.dto'
import { GetAllVideosDto } from './dto/get-all-videos.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { RolesGuard } from 'src/guards/role.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { VideosService } from './videos.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { createStorage, fileFilter, limits } from 'src/tools/multerOptions'
import { fileNameExtractor } from 'src/tools/fileNameExtractor'
import { GetVideoBySlugDto } from './dto/get-video-by-slug.dto'

@Controller('videos')
export class VideosController {

    constructor(private videoService: VideosService) { }

    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('video', { storage: createStorage('videos'), fileFilter, limits: limits }))
    @Post()
    async createVideo(@Body() body: CreateVideoDto, @UploadedFile() file: Express.Multer.File) {
        const fileName = fileNameExtractor(file.path)
        return await this.videoService.createVideo(body, fileName)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('video', { storage: createStorage('videos'), fileFilter, limits: limits }))
    @Put()
    async updateVideo(@Body() body: UpdateVideoDto, @UploadedFile() file: Express.Multer.File) {
        const fileName = fileNameExtractor(file.path)
        return await this.videoService.updateVideo(body, fileName)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Delete('/:id')
    async deleteVideo(@Param() params: DeleteVideoDto) {
        return await this.videoService.deleteVideo(params)
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getOneVideo(@Param() params: GetOneVideoDto) {
        return await this.videoService.getOneVideo(params)
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    async getAllVideos(@Query() queries: GetAllVideosDto) {
        return await this.videoService.getAllVideos(queries)
    }

    @HttpCode(HttpStatus.OK)
    @Get('/s/:slug')
    async getVideoBySlug(@Param() params: GetVideoBySlugDto) {
        return await this.videoService.getVideoBySlug(params)
    }
}
import { Controller, Get, HttpCode, HttpStatus, UseGuards, Req, Post, Body, Query, Put, Param, Delete, UseInterceptors, UploadedFile, Patch } from "@nestjs/common";
import { NewsService } from "./news.service";
import { AuthGuard } from "src/guards/auth.guard";
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/role.guard";
import { CreateNewsDto } from "./dto/create-news.dto";
import { GetAllNewsDto } from "./dto/get-all-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { DeleteNewsDto } from "./dto/delete-news.dto";
import { GetOneNewsDto } from "./dto/get-one-news.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { createStorage, fileFilter, limits } from "src/tools/multerOptions";
import { fileNameExtractor } from "src/tools/fileNameExtractor";
import { LikeOneNewsDto } from "./dto/like-one-news.dto";
import { UnlikeOneNewsDto } from "./dto/unlike-one-news.dto";

@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) { }

    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('image', { storage: createStorage('news'), fileFilter, limits: limits }))
    @Post()
    async createNews(@Body() body: CreateNewsDto, @UploadedFile() file: Express.Multer.File) {
        const fileName = fileNameExtractor(file.path)
        return await this.newsService.createNews(body, fileName)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('image', { storage: createStorage('news'), fileFilter, limits: limits }))
    @Put()
    async updateNews(@Body() body: UpdateNewsDto) {
        return await this.newsService.updateNews(body)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Delete('/:id')
    async deleteNews(@Param() params: DeleteNewsDto) {
        return await this.newsService.deleteNews(params)
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getOneNews(@Param() params: GetOneNewsDto) {
        return await this.newsService.getOneNews(params)
    }

    @HttpCode(HttpStatus.CREATED)
    @Get()
    async getNews(@Query() queries: GetAllNewsDto) {
        return await this.newsService.getAllNews(queries)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Patch('/:id/like')
    async likeOneNews(@Param() params: LikeOneNewsDto) {
        return await this.newsService.likeOneNews(params)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @Patch('/:id/unlike')
    async unlikeOneNews(@Param() params: UnlikeOneNewsDto) {
        return await this.newsService.unlikeOneNews(params)
    }
}
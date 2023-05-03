import { Body, Param, Query, Controller, HttpCode, HttpStatus, Get, Put, Post, Delete, UseGuards } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { DeleteTagDto } from './dto/delete-tag.dto'
import { GetOneTagDto } from './dto/get-one-tag.dto'
import { GetAllTagsDto } from './dto/get-all-tags.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { RolesGuard } from 'src/guards/role.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { TagsService } from './tags.service'

@Controller('tags')
export class TagsController {

    constructor(private tagService: TagsService) { }

    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Post()
    async createTag(@Body() body: CreateTagDto) {
        return await this.tagService.createTag(body)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Put()
    async updateTag(@Body() body: UpdateTagDto) {
        return await this.tagService.updateTag(body)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Delete('/:id')
    async deleteTag(@Param() params: DeleteTagDto) {
        return await this.tagService.deleteTag(params)
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getOneTag(@Param() params: GetOneTagDto) {
        return await this.tagService.getOneTag(params)
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    async getAllTags(@Query() queries: GetAllTagsDto) {
        console.log(queries)
        return await this.tagService.getAllTags(queries)
    }
}
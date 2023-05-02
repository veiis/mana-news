import { Body, Param, Query, Controller, HttpCode, HttpStatus, Get, Put, Post, Delete, UseGuards } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { DeleteCategoryDto } from './dto/delete-category.dto'
import { GetOneCategoryDto } from './dto/get-one-category.dto'
import { GetAllCategoryDto } from './dto/get-all-category.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { RolesGuard } from 'src/guards/role.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { CategoriesService } from './categories.service'

@Controller('categories')
export class CategoriesController {

    constructor(private categoryService: CategoriesService) { }

    @HttpCode(HttpStatus.CREATED)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Post()
    async createCategory(@Body() body: CreateCategoryDto) {
        return await this.categoryService.createCategory(body)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Put()
    async updateCategory(@Body() body: UpdateCategoryDto) {
        return await this.categoryService.updateCategory(body)
    }

    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
    @Delete('/:id')
    async deleteCategory(@Param() params: DeleteCategoryDto) {
        return await this.categoryService.deleteCategory(params)
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getOneCategory(@Param() params: GetOneCategoryDto) {
        return await this.categoryService.getOneCategory(params)
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    async getAllCategories(@Query() queries: GetAllCategoryDto) {
        console.log(queries)
        return await this.categoryService.getAllCategories(queries)
    }
}
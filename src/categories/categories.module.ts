import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { NewsCategory } from 'src/associations/NewsCategory.model';

@Module({
    imports: [SequelizeModule.forFeature([Category, NewsCategory])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})

export class CategoriesModule { }
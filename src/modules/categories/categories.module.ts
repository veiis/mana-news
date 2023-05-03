import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { NewsCategory } from 'src/associations/NewsCategory.model';
import { News } from '../news/models/news.model';

@Module({
    imports: [SequelizeModule.forFeature([Category, News, NewsCategory])],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})

export class CategoriesModule { }
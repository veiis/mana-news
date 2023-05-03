import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from './models/news.model';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { Category } from 'src/modules/categories/models/category.model';
import { MulterModule } from '@nestjs/platform-express';
import { Tag } from '../tags/models/tag.model';

@Module({
    imports: [SequelizeModule.forFeature([News, Category, Tag]),
    MulterModule.register()],
    controllers: [NewsController],
    providers: [NewsService]
})

export class NewsModule { }


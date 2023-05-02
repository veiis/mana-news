import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from './models/news.model';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { Category } from 'src/categories/models/category.model';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [SequelizeModule.forFeature([News, Category]),
    MulterModule.register()],
    controllers: [NewsController],
    providers: [NewsService]
})

export class NewsModule { }


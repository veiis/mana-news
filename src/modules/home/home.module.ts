import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { News } from '../news/models/news.model';

@Module({
    imports: [SequelizeModule.forFeature([News])],
    controllers: [HomeController],
    providers: [HomeService],
})

export class HomeModule { }
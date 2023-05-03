import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize';
import { Video } from './models/video.model';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { Category } from '../categories/models/category.model';

@Module({
    imports: [SequelizeModule.forFeature([Video, Category])],
    controllers: [VideosController],
    providers: [VideosService],
})

export class VideosModule { }
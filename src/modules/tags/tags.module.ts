import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from './models/tag.model';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { NewsTag } from 'src/associations/NewsTag.model';

@Module({
    imports: [SequelizeModule.forFeature([Tag, NewsTag])],
    controllers: [TagsController],
    providers: [TagsService],
})

export class TagsModule { }
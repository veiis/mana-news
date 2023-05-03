import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize";
import { Op, where, col, cast } from "sequelize";
import { GetSlideshowNewsDto } from "./dto/get-slideshow-news.dto";
import sequelize from "sequelize";
import { dateQueryBuilder } from "src/tools/dateQueryBuilder";
import { News } from "../news/models/news.model";
import { Category } from "../categories/models/category.model";
import { Tag } from "../tags/models/tag.model";
import { GetMostViewedNewsDto } from "./dto/get-most-viewed-news.dto";
import { GetPopularNewsDto } from "./dto/get-popular-news.dto";


@Injectable()
export class HomeService {
    constructor(
        @InjectModel(News)
        private newsModel: typeof News
    ) { }

    async getSlideshowNews(data: GetSlideshowNewsDto): Promise<{ items: News[], count: number }> {
        const { page, limit, order, sort } = data
        const offset = (page - 1) * limit

        const query = { isSlideshow: true }

        const news = await this.newsModel.findAll({
            where: query,
            order: [[sort, order]],
            limit,
            offset,
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Tag, through: { attributes: [] } }
            ]
        })

        const count = await this.newsModel.count()
        return { items: news, count }
    }

    async getTrendNews(data: GetSlideshowNewsDto): Promise<{ items: News[], count: number }> {
        const { page, limit, order, sort } = data
        const offset = (page - 1) * limit

        const query = { isTrend: true }

        const news = await this.newsModel.findAll({
            where: query,
            order: [[sort, order]],
            limit,
            offset,
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Tag, through: { attributes: [] } }
            ]
        })

        const count = await this.newsModel.count()
        return { items: news, count }
    }

    async getPopularNews(data: GetPopularNewsDto): Promise<{ items: News[], count: number }> {
        const { page, limit } = data
        const offset = (page - 1) * limit

        const news = await this.newsModel.findAll({
            order: [['likes', 'desc']],
            limit,
            offset,
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Tag, through: { attributes: [] } }
            ]
        })
        const count = await this.newsModel.count()
        return { items: news, count }
    }

    async getMostViewedNews(data: GetMostViewedNewsDto): Promise<{ items: News[], count: number }> {
        const { page, limit } = data
        const offset = (page - 1) * limit

        const news = await this.newsModel.findAll({
            order: [['views', 'desc']],
            limit,
            offset,
            subQuery: false,
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Tag, through: { attributes: [] } }
            ]
        })
        const count = await this.newsModel.count()
        return { items: news, count }
    }
}
import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import sequelize from "sequelize";
import { News } from "./models/news.model"
import { Category } from "src/modules/categories/models/category.model";
import { CreateNewsDto } from "./dto/create-news.dto";
import { dateQueryBuilder } from "src/tools/dateQueryBuilder";
import { Op, cast, col, where } from "sequelize";
import { GetAllNewsDto } from "./dto/get-all-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { DeleteNewsDto } from "./dto/delete-news.dto";
import { GetOneNewsDto } from "./dto/get-one-news.dto";
import { LikeOneNewsDto } from "./dto/like-one-news.dto";

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News)
        private newsModel: typeof News,
        @InjectModel(Category)
        private categoryModel: typeof Category,
    ) { }

    async createNews(data: CreateNewsDto, fileName: string): Promise<News> {
        const { title, description, categories, isSlideshow, isTrend } = data
        const duplicateItem = await this.newsModel.findOne({ where: { title }, raw: true })

        if (duplicateItem) {
            throw new ConflictException(`${title} already exist.`)
        }

        for (let i = 0; i < categories.length; i++) {
            // should use categories service instead of model?
            const currentCategory = await this.categoryModel.findByPk(categories[i])
            if (!currentCategory) {
                throw new NotFoundException(`Category with id ${categories[i]} not found`)
            }
        }

        const item = await this.newsModel.create({ title, description, cover: fileName, isSlideshow, isTrend })

        if (!item) {
            throw new ConflictException(`There was an error while creating resource`);
        }

        await item.$add('categories', categories)

        return item;
    }


    async updateNews(data: UpdateNewsDto): Promise<News> {
        const { id, title, categories, isSlideshow, isTrend } = data

        const news = await this.newsModel.findByPk(id)

        if (!news) {
            throw new NotFoundException(`There is no news with id ${id}`)
        }

        for (let i = 0; i < categories.length; i++) {
            // should use categories service instead of model?
            const currentCategory = await this.categoryModel.findByPk(categories[i])
            if (!currentCategory) {
                throw new NotFoundException(`Category with id ${categories[i]} not found`)
            }
        }

        const duplicateNews = await this.newsModel.findOne({ where: { id: { [Op.ne]: id }, title } })

        if (duplicateNews) {
            throw new ConflictException(`There is already another news with this title ${title}`)
        }

        console.log({ title, isSlideshow, isTrend })
        await news.update({ title, isSlideshow, isTrend })
        await news.$set('categories', categories)

        return news
    }

    async deleteNews(data: DeleteNewsDto): Promise<boolean> {
        const { id } = data

        const news = await this.newsModel.findByPk(id)

        if (!news) {
            throw new NotFoundException(`There is no news with id ${id}`);
        }

        await news.$set('categories', [])
        await news.destroy()

        // delete related files or images

        return true
    }


    async getOneNews(data: GetOneNewsDto): Promise<News> {
        const { id } = data

        const news = await this.newsModel.findByPk(id, { include: { model: Category, through: { attributes: [] } } })

        if (!news) {
            throw new NotFoundException(`There is no news with id ${id}`)
        }

        await news.increment('views', { by: 1 })

        return news
    }

    async getAllNews(data: GetAllNewsDto): Promise<News[]> {
        const { page, limit, order, sort, s, t, id, title } = data
        const offset = (page - 1) * limit

        const query = {}

        if (t) {
            const { start, end } = dateQueryBuilder(t);
            query['createdAt'] = { [Op.gte]: start, [Op.lte]: end };
        }

        if (s) {
            query[Op.or] = [
                {
                    id: sequelize.where(cast(col("id"), "varchar"), { [Op.iLike]: `%${data.s}%` }),
                },
                { title: { [Op.iLike]: `%${data.s}%` } },
            ];
        }

        if (id) {
            query['id'] = where(cast(col("id"), "varchar"), {
                [Op.iLike]: `%${id}%`,
            });
        }
        if (title) query['title'] = { [Op.iLike]: `%${title}%` };

        const news = await this.newsModel.findAndCountAll({
            where: query,
            order: [[sort, order]],
            limit,
            offset,
            include: { model: Category, through: { attributes: [] } }
        })

        if (news.rows.length === 0) {
            throw new NotFoundException()
        }

        return news.rows;
    }

    async likeOneNews(data: LikeOneNewsDto): Promise<News> {
        const { id } = data

        const news = await this.newsModel.findByPk(id)

        if (!news) {
            throw new NotFoundException(`There is no news with id ${id}`)
        }

        await news.increment('likes', { by: 1 })
        return news
    }

    async unlikeOneNews(data: LikeOneNewsDto): Promise<News> {
        const { id } = data

        const news = await this.newsModel.findByPk(id)

        if (!news) {
            throw new NotFoundException(`There is no news with id ${id}`)
        }

        if (news.likes > 0) await news.decrement('likes', { by: 1 });
        return news
    }
}
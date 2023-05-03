import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import sequelize from "sequelize";
import { News } from "./models/news.model"
import { Category } from "src/modules/categories/models/category.model";
import { Tag } from "../tags/models/tag.model";
import { CreateNewsDto } from "./dto/create-news.dto";
import { dateQueryBuilder } from "src/tools/dateQueryBuilder";
import { Op, cast, col, where } from "sequelize";
import { GetAllNewsDto } from "./dto/get-all-news.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";
import { DeleteNewsDto } from "./dto/delete-news.dto";
import { GetOneNewsDto } from "./dto/get-one-news.dto";
import { LikeOneNewsDto } from "./dto/like-one-news.dto";
import { GetNewsBySlugDto } from "./dto/get-news-by-slug.dto";
import { createSlug } from "src/tools/createSlug";

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News) private newsModel: typeof News,
        @InjectModel(Category) private categoryModel: typeof Category,
        @InjectModel(Tag) private tagModel: typeof Tag,
    ) { }

    async createNews(data: CreateNewsDto, fileName: string): Promise<News> {
        const { title, description, categories, tags, isSlideshow, isTrend } = data
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

        for (let i = 0; i < tags.length; i++) {
            const currentTag = await this.tagModel.findByPk(tags[i])
            if (!currentTag) {
                throw new NotFoundException(`Tag with id ${tags[i]} not found`)
            }
        }

        const slug = createSlug(title)
        const duplicateSlug = await this.newsModel.findOne({ where: { slug }, raw: true })

        if (duplicateSlug) {
            throw new ConflictException(`another news with ${slug} slug already exist.`)
        }


        const item = await this.newsModel.create({ title, description, cover: fileName, isSlideshow, isTrend, slug: createSlug(title) })

        if (!item) {
            throw new ConflictException(`There was an error while creating resource`);
        }

        if (categories && categories.length > 0) await item.$add('categories', categories)
        if (tags && tags.length > 0) await item.$add('tags', tags)

        return item;
    }


    async updateNews(data: UpdateNewsDto, fileName: string): Promise<News> {
        const { id, title, categories, tags, isSlideshow, isTrend } = data

        const update = {}
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

        for (let i = 0; i < tags.length; i++) {
            const currentTag = await this.tagModel.findByPk(tags[i])
            if (!currentTag) {
                throw new NotFoundException(`Tag with id ${tags[i]} not found`)
            }
        }

        if (title) {
            update['title'] = title
            const slug = createSlug(title)
            const duplicateSlug = await this.newsModel.findOne({ where: { slug }, raw: true })
            if (duplicateSlug) {
                throw new ConflictException(`another video with ${slug} slug already exist.`)
            }
            update['slug'] = slug
        }
        if (typeof isSlideshow === "boolean") update['isSlideshow'] = isSlideshow
        if (typeof isTrend === "boolean") update['isTrend'] = isTrend
        if (fileName) update['cover'] = fileName

        const duplicateNews = await this.newsModel.findOne({ where: { id: { [Op.ne]: id }, title } })

        if (duplicateNews) {
            throw new ConflictException(`There is already another news with this title ${title}`)
        }

        await news.update(update)
        if (categories && categories.length > 0) await news.$set('categories', categories)
        if (tags && tags.length > 0) await news.$set('tags', tags)

        return news
    }

    async deleteNews(data: DeleteNewsDto): Promise<boolean> {
        const { id } = data

        const news = await this.newsModel.findByPk(id)

        if (!news) {
            throw new NotFoundException(`There is no news with id ${id}`);
        }

        await news.$set('categories', [])
        await news.$set('tags', [])
        await news.destroy()

        // delete related files or images

        return true
    }


    async getOneNews(data: GetOneNewsDto): Promise<News> {
        const { id } = data

        const news = await this.newsModel.findByPk(id, {
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Tag, through: { attributes: [] } }
            ]
        })

        if (!news) {
            throw new NotFoundException(`There is no news with id ${id}`)
        }

        await news.increment('views', { by: 1 })

        return news
    }

    async getAllNews(data: GetAllNewsDto): Promise<{ items: News[], count: number }> {
        const { page, limit, order, sort, s, t, id, title, categories, categoryTitle, tags, tagTitle } = data

        const offset = (page - 1) * limit

        const query = {}

        if (t) {
            const { start, end } = dateQueryBuilder(t);
            query['createdAt'] = { [Op.gte]: start, [Op.lte]: end };
        }

        if (s) {
            query[Op.or] = [
                {
                    id: sequelize.where(cast(col("News.id"), "varchar"), { [Op.iLike]: `%${s}%` }),
                },
                { title: { [Op.iLike]: `%${s}%` } },
                { '$categories.title$': { [Op.iLike]: `%${s}%` } },
                { '$tags.title$': { [Op.iLike]: `%${s}%` } }
            ];
        }

        if (id) {
            query['id'] = where(cast(col("id"), "varchar"), {
                [Op.iLike]: `%${id}%`,
            });
        }
        if (title) query['title'] = { [Op.iLike]: `%${title}%` };

        if (categories && categories.length) query['$categories.id$'] = { [Op.in]: categories }
        if (tags && tags.length) query['$tags.id$'] = { [Op.in]: tags }

        if (categoryTitle) query['$categories.title$'] = { [Op.iLike]: `%${categoryTitle}%` }
        if (tagTitle) query['$categories.title$'] = { [Op.iLike]: `%${tagTitle}%` }

        const news = await this.newsModel.findAndCountAll({
            where: query,
            order: [[sort, order]],
            limit,
            offset,
            subQuery: false,
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Tag, through: { attributes: [] } }
            ]
        })

        // if (news.rows.length === 0) {
        //     throw new NotFoundException()
        // }

        return { items: news.rows, count: news.count };
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

    async getNewsBySlug(data: GetNewsBySlugDto): Promise<News> {
        const { slug } = data

        const news = await this.newsModel.findOne({
            where: { slug },
            include: [
                { model: Category, through: { attributes: [] } },
                { model: Tag, through: { attributes: [] } }
            ]
        })

        if (!news) {
            throw new NotFoundException(`There is no news with slug ${slug}`)
        }

        await news.increment('views', { by: 1 })

        return news
    }
}
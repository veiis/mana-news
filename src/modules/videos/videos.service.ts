import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { CreateVideoDto } from "./dto/create-video.dto";
import { Video } from "./models/video.model";
import { InjectModel } from "@nestjs/sequelize";
import { Op, where, col, cast } from "sequelize";
import { UpdateVideoDto } from "./dto/update-video.dto";
import { DeleteVideoDto } from "./dto/delete-video.dto";
import { GetOneVideoDto } from "./dto/get-one-video.dto";
import { GetAllVideosDto } from "./dto/get-all-videos.dto";
import sequelize from "sequelize";
import { dateQueryBuilder } from "src/tools/dateQueryBuilder";
import { Category } from "../categories/models/category.model";
import { GetVideoBySlugDto } from "./dto/get-video-by-slug.dto";
import { createSlug } from "src/tools/createSlug";


@Injectable()
export class VideosService {
    constructor(
        @InjectModel(Video) private videoModel: typeof Video,
        @InjectModel(Category) private categoryModel: typeof Category
    ) { }

    async createVideo(data: CreateVideoDto, fileName: string): Promise<Video> {
        const { title, categories } = data
        const duplicateVideo = await this.videoModel.findOne({ where: { title }, raw: true })

        if (duplicateVideo) {
            throw new ConflictException(`${title} already exist.`)
        }

        for (let i = 0; i < categories.length; i++) {
            // should use categories service instead of model?
            const currentCategory = await this.categoryModel.findByPk(categories[i])
            if (!currentCategory) {
                throw new NotFoundException(`Category with id ${categories[i]} not found`)
            }
        }
        const slug = createSlug(title)
        const duplicateSlug = await this.videoModel.findOne({ where: { slug }, raw: true })

        if (duplicateSlug) {
            throw new ConflictException(`another video with ${slug} slug already exist.`)
        }

        const video = await this.videoModel.build({ title, link: fileName, slug }).save()

        if (!video) {
            throw new ConflictException(`There was an error while creating resource`)
        }

        if (categories && categories.length > 0) await video.$set('categories', categories)

        return video
    }

    async updateVideo(data: UpdateVideoDto, fileName: string): Promise<Video> {
        const { id, title, categories } = data

        const update = {}

        const video = await this.videoModel.findByPk(id)

        if (!video) {
            throw new NotFoundException(`There is no video with id ${id}`)
        }

        const duplicateVideo = await this.videoModel.findOne({ where: { id: { [Op.ne]: id }, title } })

        if (duplicateVideo) {
            throw new ConflictException(`There is already another video with this title ${title}`)
        }

        for (let i = 0; i < categories.length; i++) {
            // should use categories service instead of model?
            const currentCategory = await this.categoryModel.findByPk(categories[i])
            if (!currentCategory) {
                throw new NotFoundException(`Category with id ${categories[i]} not found`)
            }
        }

        if (title) {
            update['title'] = title

            const slug = createSlug(title)
            const duplicateSlug = await this.videoModel.findOne({ where: { slug }, raw: true })
            if (duplicateSlug) {
                throw new ConflictException(`another video with ${slug} slug already exist.`);
            }
            update['slug'] = slug
        }

        if (fileName) update['link'] = fileName

        await video.update(update)

        if (categories && categories.length > 0) await video.$set('categories', categories)

        return video
    }

    async deleteVideo(data: DeleteVideoDto): Promise<boolean> {
        const { id } = data

        const video = await this.videoModel.findByPk(id)

        if (!video) {
            throw new NotFoundException(`There is no video with id ${id}`);
        }

        await video.destroy()

        return true
    }

    async getOneVideo(data: GetOneVideoDto): Promise<Video> {
        const { id } = data

        const video = await this.videoModel.findByPk(id, { include: { model: Category, through: { attributes: [] } }, })

        if (!video) {
            throw new NotFoundException(`There is no video with id ${id}`)
        }

        return video
    }

    async getAllVideos(data: GetAllVideosDto): Promise<{ items: Video[], count: number }> {
        const { page, limit, order, sort, s, t, id, title, categories, categoryTitle } = data
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

        if (categoryTitle) query['$categories.title$'] = { [Op.iLike]: `%${categoryTitle}%` }
        if (categories && categories.length) query['$categories.id$'] = { [Op.in]: categories }


        const videos = await this.videoModel.findAndCountAll({
            where: query,
            order: [[sort, order]],
            limit,
            offset,
            include: { model: Category, through: { attributes: [] } },
        })

        // if (videos.rows.length === 0) {
        //     throw new NotFoundException()
        // }

        return { items: videos.rows, count: videos.count }
    }

    async getVideoBySlug(data: GetVideoBySlugDto): Promise<Video> {
        const { slug } = data

        const video = await this.videoModel.findOne({ where: { slug }, include: { model: Category, through: { attributes: [] } } })

        if (!video) {
            throw new NotFoundException(`There is no video with slug ${slug}`)
        }

        return video
    }
}
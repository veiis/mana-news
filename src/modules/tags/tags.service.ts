import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from "@nestjs/common"
import { CreateTagDto } from "./dto/create-tag.dto";
import { Tag } from "./models/tag.model";
import { InjectModel } from "@nestjs/sequelize";
import { Op, where, col, cast } from "sequelize";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { DeleteTagDto } from "./dto/delete-tag.dto";
import { GetOneTagDto } from "./dto/get-one-tag.dto";
import { GetAllTagsDto } from "./dto/get-all-tags.dto";
import sequelize from "sequelize";
import { dateQueryBuilder } from "src/tools/dateQueryBuilder";


@Injectable()
export class TagsService {
    constructor(
        @InjectModel(Tag)
        private tagModel: typeof Tag
    ) { }

    async createTag(data: CreateTagDto): Promise<Tag> {
        const { title, color } = data
        const duplicateTag = await this.tagModel.findOne({ where: { title }, raw: true })

        if (duplicateTag) {
            throw new ConflictException(`${title} already exist.`)
        }

        const tag = await this.tagModel.build({ title, color }).save()

        if (!tag) {
            throw new ConflictException(`There was an error while creating resource`)
        }

        return tag
    }

    async updateTag(data: UpdateTagDto): Promise<Tag> {
        const { id, title, color } = data

        const tag = await this.tagModel.findByPk(id)

        if (!tag) {
            throw new NotFoundException(`There is no tag with id ${id}`)
        }

        const duplicateTag = await this.tagModel.findOne({ where: { id: { [Op.ne]: id }, title } })

        if (duplicateTag) {
            throw new ConflictException(`There is already another tag with this title ${title}`)
        }

        await tag.update({ title, color })

        return tag
    }

    async deleteTag(data: DeleteTagDto): Promise<boolean> {
        const { id } = data

        const tag = await this.tagModel.findByPk(id)

        if (!tag) {
            throw new NotFoundException(`There is no tag with id ${id}`)
        }

        await tag.destroy()

        return true
    }

    async getOneTag(data: GetOneTagDto): Promise<Tag> {
        const { id } = data

        const tag = await this.tagModel.findByPk(id)

        if (!tag) {
            throw new NotFoundException(`There is no tag with id ${id}`)
        }

        return tag
    }

    async getAllTags(data: GetAllTagsDto): Promise<{ items: Tag[], count: number }> {
        const { page, limit, order, sort, s, t, id, title, color } = data
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
        if (color) query['color'] = { [Op.iLike]: `%${color}%` };

        const tags = await this.tagModel.findAndCountAll({
            where: query,
            order: [[sort, order]],
            limit,
            offset
        })

        if (tags.rows.length === 0) {
            throw new NotFoundException()
        }

        return { items: tags.rows, count: tags.count }
    }
}
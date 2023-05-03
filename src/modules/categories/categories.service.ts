import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "./models/category.model";
import { InjectModel } from "@nestjs/sequelize";
import { Op, where, col, cast } from "sequelize";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { DeleteCategoryDto } from "./dto/delete-category.dto";
import { GetOneCategoryDto } from "./dto/get-one-category.dto";
import { GetAllCategoryDto } from "./dto/get-all-category.dto";
import sequelize from "sequelize";
import { dateQueryBuilder } from "src/tools/dateQueryBuilder";


@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category)
        private categoryModel: typeof Category
    ) { }

    async createCategory(data: CreateCategoryDto): Promise<Category> {
        const { title } = data
        const duplicateCategory = await this.categoryModel.findOne({ where: { title }, raw: true })

        if (duplicateCategory) {
            throw new ConflictException(`${title} already exist.`)
        }

        const category = await this.categoryModel.build({ title }).save()

        if (!category) {
            throw new ConflictException(`There was an error while creating resource`)
        }

        return category
    }

    async updateCategory(data: UpdateCategoryDto): Promise<Category> {
        const { id, title } = data

        const category = await this.categoryModel.findByPk(id)

        if (!category) {
            throw new NotFoundException(`There is no category with id ${id}`)
        }

        const duplicateCategory = await this.categoryModel.findOne({ where: { id: { [Op.ne]: id }, title } })

        if (duplicateCategory) {
            throw new ConflictException(`There is already another category with this title ${title}`)
        }

        await category.update({ title })

        return category
    }

    async deleteCategory(data: DeleteCategoryDto): Promise<boolean> {
        const { id } = data

        const category = await this.categoryModel.findByPk(id)

        if (!category) {
            throw new NotFoundException(`There is no category with id ${id}`)
        }

        // what happen to news related to this category?
        // const newsRelatedToThisCategory = await this.newsModel.findOne({ where: { category: id }, {raw: true }})

        // scenario 1: throw an error
        // if(newsRelatedToThisCategory) {
        // throw new ConflictException('There is already some new created by this category')
        // }

        // scenario 2: set the news category to null
        // await this.newsModel.update({where: {category: id}, {category: null}})

        // scenario 3: pass an option from front to determine admin's choice
        // const adminChoice = ""
        // if(adminChoice === "deleteNews") { // Delete related news }
        // else { // do another thing }

        // this also could the be achive in model file using after destroy hook

        await category.destroy()

        return true
    }

    async getOneCategory(data: GetOneCategoryDto): Promise<Category> {
        const { id } = data

        const category = await this.categoryModel.findByPk(id)

        if (!category) {
            throw new NotFoundException(`There is no category with id ${id}`)
        }

        return category
    }

    async getAllCategories(data: GetAllCategoryDto): Promise<{ items: Category[], count: number }> {
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

        const categories = await this.categoryModel.findAndCountAll({
            where: query,
            order: [[sort, order]],
            limit,
            offset
        })

        if (categories.rows.length === 0) {
            throw new NotFoundException()
        }

        return { items: categories.rows, count: categories.count }
    }
}
import { Query, Controller, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { GetSlideshowNewsDto } from './dto/get-slideshow-news.dto'
import { HomeService } from './home.service'
import { GetPopularNewsDto } from './dto/get-popular-news.dto'
import { GetMostViewedNewsDto } from './dto/get-most-viewed-news.dto'

@Controller('home')
export class HomeController {

    constructor(private homeService: HomeService) { }

    @HttpCode(HttpStatus.OK)
    @Get('slideshow')
    async getSlideshowNews(@Query() queries: GetSlideshowNewsDto) {
        return await this.homeService.getSlideshowNews(queries)
    }

    @HttpCode(HttpStatus.OK)
    @Get('trends')
    async getTendNews(@Query() queries: GetSlideshowNewsDto) {
        return await this.homeService.getTrendNews(queries)
    }

    @HttpCode(HttpStatus.OK)
    @Get('popular')
    async getPopularNews(@Query() queries: GetPopularNewsDto) {
        return await this.homeService.getPopularNews(queries)
    }

    @HttpCode(HttpStatus.OK)
    @Get('most-viewed')
    async getMostViewedNews(@Query() queries: GetMostViewedNewsDto) {
        return await this.homeService.getMostViewedNews(queries)
    }
}
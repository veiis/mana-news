import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CategoriesModule } from './modules/categories/categories.module';
import { NewsModule } from './modules/news/news.module';
import { TagsModule } from './modules/tags/tags.module';
import { VideosModule } from './modules/videos/videos.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `env/.${process.env.NODE_ENV}.env` }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      logging: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/files'),
      serveRoot: "/files/",
      serveStaticOptions: { index: false }
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    NewsModule,
    TagsModule,
    VideosModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }

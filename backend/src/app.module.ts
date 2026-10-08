import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
  ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'public'),
}),
  

  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: 'users.sqlite',
    autoLoadEntities: true,
    synchronize: true,
  }),

  AuthModule,
  UsersModule,
],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

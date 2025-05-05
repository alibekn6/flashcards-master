import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FolderModule } from './modules/folder/folder.module';
import { FlashcardModule } from './modules/flashcard/flashcard.module';
import { Flashcard } from './modules/flashcard/entities/flashcard.entity';
import { Folder } from './modules/folder/entities/folder.entity';
import { User } from './modules/auth/entities/user.entity';
import { LlmModule } from './modules/llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [User, Folder, Flashcard],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    AuthModule,
    FolderModule,
    FlashcardModule,
    LlmModule,
  ],
})
export class AppModule {}

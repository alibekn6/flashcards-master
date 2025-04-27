import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { User } from '../auth/entities/user.entity';
import { FlashcardModule } from '../flashcard/flashcard.module';
import { Flashcard } from '../flashcard/entities/flashcard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, User, Flashcard]),
    FlashcardModule,
  ],
  providers: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}

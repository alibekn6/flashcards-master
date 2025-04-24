import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { FlashcardController } from './flashcard.controller';
import { FlashcardService } from './flashcard.service';
import { Folder } from '../folder/entities/folder.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flashcard, Folder, User])],
  controllers: [FlashcardController],
  providers: [FlashcardService],
})
export class FlashcardModule {}

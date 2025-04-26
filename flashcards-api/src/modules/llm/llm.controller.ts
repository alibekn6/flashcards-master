import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { LlmService } from './llm.service';
import { FlashcardService } from '../flashcard/flashcard.service';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly flashcardService: FlashcardService,
  ) {}

  @Post('generate-flashcards')
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateFlashcards(
    @Body()
    data: {
      topic: string;
      count?: number;
      folderId: number;
    },
    @AuthenticatedUser() user: User,
  ) {
    const { topic, count = 15, folderId } = data;
    if (!topic) {
      throw new HttpException(
        'Topic is required to generate flashcards.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!folderId) {
      throw new HttpException(
        'Folder ID is required to save flashcards.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (count < 1 || count > 20) {
      throw new HttpException(
        'Count must be between 1 and 20.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const flashcards = await this.llmService.generateFlashcards({
      topic,
      count,
    });
    const savedFlashcards = [];
    for (const flashcard of flashcards) {
      const savedFlashcard = await this.flashcardService.create(
        user.id,
        folderId,
        {
          question: flashcard.question,
          answer: flashcard.answer,
        },
      );
      savedFlashcards.push(savedFlashcard);
    }

    return {
      success: true,
      data: savedFlashcards, // This is now an array of saved flashcard entities
      count: savedFlashcards.length,
    };
  }
}

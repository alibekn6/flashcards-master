import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { FlashcardModule } from '../flashcard/flashcard.module';

@Module({
  imports: [FlashcardModule],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService], // Export LlmService so other modules can use it
})
export class LlmModule {}

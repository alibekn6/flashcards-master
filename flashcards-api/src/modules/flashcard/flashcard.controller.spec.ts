import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardController } from './flashcard.controller';
import { FlashcardService } from './flashcard.service';

describe('FlashcardController', () => {
  let controller: FlashcardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardController],
      providers: [FlashcardService],
    }).compile();

    controller = module.get<FlashcardController>(FlashcardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

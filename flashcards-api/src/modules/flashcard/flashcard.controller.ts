import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { FlashcardService } from './flashcard.service';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

@Controller('flashcards')
@UseGuards(JwtAuthGuard)
export class FlashcardController {
  constructor(private flashcardService: FlashcardService) {}

  @Get(':folderId')
  get(@Request() req: RequestWithUser, @Param('folderId') folderId: number) {
    return this.flashcardService.findByFolder(req.user.id, folderId);
  }

  @Post(':folderId')
  create(
    @Request() req: RequestWithUser,
    @Param('folderId') folderId: number,
    @Body() body: { question: string; answer: string },
  ) {
    return this.flashcardService.create(req.user.id, folderId, body);
  }

  @Put(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
    @Body() body: { question: string; answer: string },
  ) {
    return this.flashcardService.update(req.user.id, id, body);
  }

  @Delete(':id')
  delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    return this.flashcardService.delete(req.user.id, id);
  }
}

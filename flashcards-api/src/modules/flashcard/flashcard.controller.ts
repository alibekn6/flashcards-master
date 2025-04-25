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
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FlashcardService } from './flashcard.service';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';

@ApiTags('Flashcards')
@ApiBearerAuth()
@Controller('flashcards')
@UseGuards(JwtAuthGuard)
export class FlashcardController {
  constructor(private flashcardService: FlashcardService) {}

  @Get(':folderId')
  get(
    @AuthenticatedUser() user: User,
    @Param('folderId', ParseIntPipe) folderId: number,
  ) {
    console.log('User ID in controller:', user.id);
    return this.flashcardService.findByFolder(user.id, folderId);
  }

  @Post(':folderId')
  @ApiParam({ name: 'folderId', type: Number })
  @ApiBody({ type: CreateFlashcardDto })
  create(
    @AuthenticatedUser() user: User,
    @Param('folderId', ParseIntPipe) folderId: number,
    @Body() createFlashcardDto: CreateFlashcardDto,
  ) {
    return this.flashcardService.create(user.id, folderId, createFlashcardDto);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateFlashcardDto })
  update(
    @AuthenticatedUser() user: User,
    @Param('id') id: number,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
  ) {
    return this.flashcardService.update(user.id, id, updateFlashcardDto);
  }

  @Delete(':id')
  delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    return this.flashcardService.delete(req.user.id, id);
  }
}

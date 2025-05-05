import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FlashcardService } from './flashcard.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';

@ApiTags('Flashcards')
@ApiBearerAuth()
@Controller('folders/:folderId/flashcards')
@UseGuards(JwtAuthGuard)
export class FlashcardController {
  constructor(private flashcardService: FlashcardService) {}

  @Get()
  getAllInFolder(
    @AuthenticatedUser() user: User,
    @Param('folderId', ParseIntPipe) folderId: number,
  ) {
    // console.log('User ID in controller:', user.id);
    return this.flashcardService.findByFolder(user.id, folderId);
  }

  @Post()
  @ApiParam({ name: 'folderId', type: Number })
  @ApiBody({ type: CreateFlashcardDto })
  create(
    @AuthenticatedUser() user: User,
    @Param('folderId', ParseIntPipe) folderId: number,
    @Body() createFlashcardDto: CreateFlashcardDto,
  ) {
    return this.flashcardService.create(user.id, folderId, createFlashcardDto);
  }

  @Put(':flashcardId')
  @ApiOperation({ summary: 'Update flashcard' })
  @ApiParam({ name: 'folderId', description: 'ID of the folder', type: Number })
  @ApiParam({
    name: 'flashcardId',
    description: 'ID of the flashcard',
    type: Number,
  })
  @ApiBody({ type: UpdateFlashcardDto })
  update(
    @AuthenticatedUser() user: User,
    @Param('folderId', ParseIntPipe) folderId: number,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
  ) {
    return this.flashcardService.update(
      user.id,
      folderId,
      flashcardId,
      updateFlashcardDto,
    );
  }

  @Delete(':flashcardId')
  @ApiOperation({ summary: 'Delete flashcard' })
  @ApiParam({ name: 'folderId', description: 'ID of the folder', type: Number })
  @ApiParam({
    name: 'flashcardId',
    description: 'ID of the flashcard',
    type: Number,
  })
  async delete(
    @AuthenticatedUser() user: User,
    @Param('folderId', ParseIntPipe) folderId: number,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
  ) {
    return this.flashcardService.delete(user.id, folderId, flashcardId);
  }

  @Patch(':flashcardId/status')
  async updateStatus(
    @AuthenticatedUser() user: User,
    @Param('folderId', ParseIntPipe) folderId: number,
    @Param('flashcardId', ParseIntPipe) flashcardId: number,
    @Body() body: { status: boolean },
  ) {
    return this.flashcardService.updateStatus(
      user.id,
      folderId,
      flashcardId,
      body.status,
    );
  }

  @Get('progress')
  async getProgress(@Param('folderId', ParseIntPipe) folderId: number) {
    return this.flashcardService.getProgress(folderId);
  }
}

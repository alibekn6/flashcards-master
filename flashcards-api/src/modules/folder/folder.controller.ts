import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user';
import { User } from '../auth/entities/user.entity';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFolderDto } from './dto/create-folder.dto';

@ApiTags('Folders')
@ApiBearerAuth()
@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  getFolders(@AuthenticatedUser() user: User) {
    return this.folderService.findByUser(user.id);
  }

  @Post()
  @ApiBody({ type: CreateFolderDto })
  create(
    @AuthenticatedUser() user: User,
    @Body() createFolderDto: CreateFolderDto,
  ) {
    return this.folderService.create(user.id, createFolderDto.name);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Folder not found' })
  async delete(
    @AuthenticatedUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.folderService.delete(user.id, id);
    return { success: true };
  }
}

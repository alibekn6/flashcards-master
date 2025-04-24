import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(private folderService: FolderService) {}

  @Get()
  getFolders(@Request() req: RequestWithUser) {
    return this.folderService.findByUser(req.user.id);
  }

  @Post()
  create(@Request() req: RequestWithUser, @Body() body: { name: string }) {
    return this.folderService.create(req.user.id, body.name);
  }

  @Delete(':id')
  delete(@Request() req: RequestWithUser, @Param('id') id: number) {
    return this.folderService.delete(req.user.id, id);
  }
}

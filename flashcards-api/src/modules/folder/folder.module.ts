import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, User])],
  providers: [FolderService],
  controllers: [FolderController],
})
export class FolderModule {}

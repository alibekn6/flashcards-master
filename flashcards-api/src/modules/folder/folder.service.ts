import {
  Injectable,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../folder/entities/folder.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder) private folderRepo: Repository<Folder>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findByUser(userId: number): Promise<Folder[]> {
    return this.folderRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, name: string): Promise<Folder> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const existingFolder = await this.folderRepo.findOne({
      where: { name, user: { id: userId } },
    });

    if (existingFolder) {
      throw new ConflictException('Folder with this name already exists');
    }

    return this.folderRepo.save(this.folderRepo.create({ name, user }));
  }

  async delete(userId: number, folderId: number) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId },
      relations: ['user'],
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.user.id !== userId) {
      throw new ForbiddenException('You do not own this folder');
    }

    await this.folderRepo.remove(folder);
  }
}

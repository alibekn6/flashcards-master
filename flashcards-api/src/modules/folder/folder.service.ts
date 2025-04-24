import { Injectable, ForbiddenException } from '@nestjs/common';
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

  async findByUser(userId: number) {
    return this.folderRepo.find({ where: { user: { id: userId } } });
  }

  async create(userId: number, name: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const folder = this.folderRepo.create({
      name: name,
      user: user,
    });
    return this.folderRepo.save(folder);
  }

  async delete(userId: number, folderId: number) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId },
      relations: ['user'],
    });
    if (!folder || folder.user.id !== userId) throw new ForbiddenException();
    return this.folderRepo.remove(folder);
  }
}

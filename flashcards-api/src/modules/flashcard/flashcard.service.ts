import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import { Folder } from '../folder/entities/folder.entity';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';

@Injectable()
export class FlashcardService {
  findAll() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Flashcard) private flashcardRepo: Repository<Flashcard>,
    @InjectRepository(Folder) private folderRepo: Repository<Folder>,
  ) {}

  async findByFolder(userId: number, folderId: number) {
    console.log(`Checking access for user ${userId} to folder ${folderId}`);
    const folder = await this.folderRepo.findOne({
      where: { id: folderId },
      relations: ['user'],
    });
    if (!folder || folder.user.id !== userId) throw new ForbiddenException();
    return this.flashcardRepo.find({ where: { folder: { id: folderId } } });
  }

  async create(
    userId: number,
    folderId: number,
    data: { question: string; answer: string },
  ) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId },
      relations: ['user'],
    });
    if (!folder || folder.user.id !== userId) throw new ForbiddenException();
    const card = this.flashcardRepo.create({ ...data, folder });
    return this.flashcardRepo.save(card);
  }

  async update(userId: number, id: number, data: UpdateFlashcardDto) {
    const card = await this.flashcardRepo.findOne({
      where: { id },
      relations: ['folder', 'folder.user'],
    });
    if (!card || card.folder.user.id !== userId) throw new ForbiddenException();
    Object.assign(card, data);
    return this.flashcardRepo.save(card);
  }

  async delete(userId: number, id: number) {
    const card = await this.flashcardRepo.findOne({
      where: { id },
      relations: ['folder', 'folder.user'],
    });
    if (!card || card.folder.user.id !== userId) throw new ForbiddenException();
    return this.flashcardRepo.remove(card);
  }
}

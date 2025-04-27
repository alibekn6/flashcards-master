import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flashcard } from '../flashcard/entities/flashcard.entity';
import { Folder } from '../folder/entities/folder.entity';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';

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
    // console.log(`Checking access for user ${userId} to folder ${folderId}`);
    const folder = await this.folderRepo.findOne({
      where: { id: folderId },
      relations: ['user'],
    });
    if (!folder || folder.user.id !== userId) throw new ForbiddenException();
    return this.flashcardRepo.find({ where: { folder: { id: folderId } } });
  }

  async create(userId: number, folderId: number, data: CreateFlashcardDto) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId },
      relations: ['user'],
    });
    if (!folder || folder.user.id !== userId) throw new ForbiddenException();
    const card = this.flashcardRepo.create({ ...data, folder });
    return this.flashcardRepo.save(card);
  }

  async update(
    userId: number,
    folderId: number,
    flashcardId: number,
    data: UpdateFlashcardDto,
  ) {
    const card = await this.flashcardRepo.findOne({
      where: {
        id: flashcardId,
        folder: {
          id: folderId,
          user: { id: userId },
        },
      },
      relations: ['folder', 'folder.user'],
    });
    if (!card || card.folder.user.id !== userId)
      throw new ForbiddenException(
        'Flashcard not found or you dont have permission',
      );
    if (data.question !== undefined) {
      card.question = data.question;
    }
    if (data.answer !== undefined) {
      card.answer = data.answer;
    }
    return this.flashcardRepo.save(card);
  }

  async delete(userId: number, folderId: number, flashcardId: number) {
    const flashcard = await this.flashcardRepo.findOne({
      where: {
        id: flashcardId,
        folder: { id: folderId, user: { id: userId } },
      },
    });
    if (!flashcard) {
      throw new NotFoundException(
        'Flashcard not found or you dont have permission',
      );
    }

    return this.flashcardRepo.delete(flashcard);
  }
}

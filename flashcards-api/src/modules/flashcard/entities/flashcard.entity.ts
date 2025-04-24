import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Folder } from '../../folder/entities/folder.entity';

@Entity('flashcard')
export class Flashcard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @ManyToOne(() => Folder, (folder: Folder) => folder.flashcards)
  folder: Folder;
}

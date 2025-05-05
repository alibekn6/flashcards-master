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

  @Column({ default: null, type: 'boolean', nullable: true })
  status: boolean | null;

  @ManyToOne(() => Folder, (folder: Folder) => folder.flashcards)
  folder: Folder;
}

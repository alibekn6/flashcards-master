import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Flashcard } from '../../flashcard/entities/flashcard.entity';

@Entity('folder')
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.folders)
  user: User;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.folder)
  flashcards: Flashcard[];
}

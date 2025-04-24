import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Folder } from '../../folder/entities/folder.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => Folder, (folder) => folder.user)
  folders: Folder[];
}

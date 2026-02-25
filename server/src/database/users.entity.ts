import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Files } from './files.entity'




@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  idu: number;

  @Column()
  email: string;

  @OneToMany(() => Files, files => files.user)
  files: Files[];
};
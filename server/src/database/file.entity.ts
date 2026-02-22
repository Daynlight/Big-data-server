import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Users } from './users.entity'
import { FileChunk } from './file-chunk.entity'

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  idf: number

  @Column()
  name: string

  @ManyToOne(() => Users, users => users.files, { onDelete: 'CASCADE' })
  user: Users

  @OneToMany(() => FileChunk, chunk => chunk.file)
  chunks: FileChunk[]
}
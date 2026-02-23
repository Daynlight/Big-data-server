import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { Users } from './users.entity'
import { FileChunk } from './file-chunk.entity'

@Entity()
export class Files {
  @PrimaryGeneratedColumn({ name:"idf" })
  idf: number

  @Column({ name: "name" })
  name: string

  @Column({ name: "chunks", nullable: true})
  chunks: number

  @ManyToOne(() => Users, user => user.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idu' })
  user: Users;

  @OneToMany(() => FileChunk, chunk => chunk.file)
  file_chunk: FileChunk[]
}
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Files } from './files.entity'

@Entity()
export class FileChunk {
  @PrimaryColumn()
  idfc: number

  @PrimaryColumn()
  idf: number

  @Column()
  data: string

  @Column()
  hash: string

  @ManyToOne(() => Files, files => files.chunks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idf' })
  file: File
}
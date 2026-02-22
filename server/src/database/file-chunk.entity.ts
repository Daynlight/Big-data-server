import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { File } from './file.entity'

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

  @ManyToOne(() => File, file => file.chunks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idf' })
  file: File
}
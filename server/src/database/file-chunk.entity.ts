import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Files } from './files.entity';




@Entity("filechunk")
export class FileChunk {
  @PrimaryColumn({ name: "idfc" })
  idfc: number;

  @PrimaryColumn({ name: "idf" })
  idf: number;

  @Column({ name: "data", type: "bytea" })
  data: Buffer;

  @Column({ name: "hash" })
  hash: string;

  @ManyToOne(() => Files, files => files.chunks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idf' })
  file: Files;
};
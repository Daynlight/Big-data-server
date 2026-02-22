import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { File } from './file.entity'

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  idu: number

  @Column()
  email: string

  @OneToMany(() => File, file => file.user)
  files: File[]
}
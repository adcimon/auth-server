import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User
{
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    @Exclude() // Used with class serializer interceptor to exclude from responses.
    createdate: Date;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false })
    @Exclude() // Used with class serializer interceptor to exclude from responses.
    password: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ default: '' })
    avatar: string;

    @Column({ default: '' })
    name: string;

    @Column({ default: '' })
    surname: string;

    @Column({ type: 'date', default: '1900-01-01' })
    birthdate: Date;

    @Column({ type: 'int', default: 0 })
    role: number;

    @Column({ default: false })
    verified: boolean;
}
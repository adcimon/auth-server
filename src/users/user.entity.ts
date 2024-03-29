import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Exclude, Transform } from 'class-transformer'; // Used with ClassSerializerInterceptor to exclude from responses.
import { Role } from '../roles/role.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	@Exclude()
	id: number;

	@CreateDateColumn()
	@Exclude()
	createdate: Date;

	@Column({ unique: true, nullable: false })
	username: string;

	@Column({ nullable: false })
	@Exclude()
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

	@ManyToMany(() => Role)
	@JoinTable()
	@Transform(({ value }) => value.map((x) => x.name)) // Return the array of names.
	roles: Role[];

	@Column({ default: false })
	@Exclude()
	verified: boolean;
}

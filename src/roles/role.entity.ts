import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer'; // Used with ClassSerializerInterceptor to exclude from responses.

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	@Exclude()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;
}

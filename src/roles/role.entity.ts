import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer'; // Used with ClassSerializerInterceptor to exclude from responses.

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	@Exclude() // Exclude from responses.
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;
}

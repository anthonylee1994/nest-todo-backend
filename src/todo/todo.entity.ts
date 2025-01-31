import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "../user/user.entity";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({default: false})
    isDone: boolean;

    @ManyToOne(() => User, user => user.todos)
    user: User;
}

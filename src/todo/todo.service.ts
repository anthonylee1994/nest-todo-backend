import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Todo} from "./todo.entity";
import {Repository} from "typeorm";
import {CreateTodoDto} from "./dto/create-todo.dto";
import {User} from "../user/user.entity";
import {UpdateTodoDto} from "./dto/update-todo.dto";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>
    ) {}

    async create(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
        const todo = this.todoRepository.create({...createTodoDto, user});
        return this.todoRepository.save(todo);
    }

    async findAll(user: User): Promise<Todo[]> {
        return this.todoRepository
            .createQueryBuilder("todo")
            .where("todo.userId = :userId", {
                userId: user.id,
            })
            .getMany();
    }

    async update(id: number, updateTodoDto: UpdateTodoDto, user: User): Promise<Todo | null> {
        await this.todoRepository.update({id, user}, updateTodoDto);
        return this.todoRepository.findOne({where: {id, user}});
    }

    async remove(id: number, user: User): Promise<void> {
        await this.todoRepository.delete({id, user});
    }
}

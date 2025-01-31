import {Body, Controller, Delete, Get, Param, Post, Put, Request} from "@nestjs/common";
import {CreateTodoDto} from "./dto/create-todo.dto";
import {UpdateTodoDto} from "./dto/update-todo.dto";
import {TodoService} from "./todo.service";

@Controller("todos")
export class TodoController {
    constructor(private todoService: TodoService) {}

    @Post()
    async create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
        return this.todoService.create(createTodoDto, req.user);
    }

    @Get()
    async findAll(@Request() req) {
        return this.todoService.findAll(req.user);
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() updateTodoDto: UpdateTodoDto, @Request() req) {
        return this.todoService.update(+id, updateTodoDto, req.user);
    }

    @Delete(":id")
    async remove(@Param("id") id: string, @Request() req) {
        return this.todoService.remove(+id, req.user);
    }
}

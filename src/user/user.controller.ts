import {ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Request, UseInterceptors} from "@nestjs/common";
import {User} from "./user.entity";

@Controller()
export class UserController {
    @Get("/me")
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(ClassSerializerInterceptor)
    me(@Request() req): User {
        return req.user;
    }
}

import {Controller, Get, HttpCode, HttpStatus, Request} from "@nestjs/common";
import {User} from "./user.entity";

@Controller()
export class UserController {
    @Get("/me")
    @HttpCode(HttpStatus.OK)
    me(@Request() req): User {
        return req.user;
    }
}

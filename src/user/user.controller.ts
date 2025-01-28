import {Controller, Get, HttpCode, HttpStatus, Request, UseGuards} from "@nestjs/common";
import {AuthGuard} from "../auth/auth.guard";
import {User} from "./user.entity";

@Controller()
export class UserController {
    @Get('/me')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    me(@Request() req): User {
        return req.user;
    }
}

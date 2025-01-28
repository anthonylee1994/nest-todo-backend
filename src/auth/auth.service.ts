import {ConflictException, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {User} from "../user/user.entity";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async login(username: string, pass: string): Promise<{}> {
        const user = await this.userService.findOne(username);

        if (!user || !bcrypt.compareSync(pass, user.password)) {
            throw new UnauthorizedException();
        }

        return {
            accessToken: this.jwtService.sign({username: user.username, sub: user.id}),
        };
    }

    async register(username: string, pass: string): Promise<User> {
        const user = await this.userService.findOne(username);

        if (user) {
            throw new ConflictException("User already exists");
        }

        return this.userService.createUser(username, pass);
    }
}

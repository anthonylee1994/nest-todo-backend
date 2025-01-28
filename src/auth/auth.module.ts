import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserModule} from "src/user/user.module";

@Module({
    imports: [UserModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}

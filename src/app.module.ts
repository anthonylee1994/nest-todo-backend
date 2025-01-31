import {Module} from "@nestjs/common";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT || "5432"),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: ["dist/**/*.entity{.ts,.js}"],
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
        }),
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}

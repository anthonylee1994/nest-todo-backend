import {Test, TestingModule} from "@nestjs/testing";
import {AuthService} from "./auth.service";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {ConflictException, UnauthorizedException} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import {User} from "../user/user.entity";

describe("AuthService", () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    const mockUser: User = {
        id: 1,
        username: "testuser",
        password: bcrypt.hashSync("password123", 10),
    };

    const mockUserService = {
        findOne: jest.fn(),
        createUser: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("login", () => {
        it("should return access token when credentials are valid", async () => {
            const username = "testuser";
            const password = "password123";
            const token = "jwt-token";

            mockUserService.findOne.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue(token);

            const result = await service.login(username, password);

            expect(result).toEqual({accessToken: token});
            expect(mockUserService.findOne).toHaveBeenCalledWith(username);
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                username: mockUser.username,
                sub: mockUser.id,
            });
        });

        it("should throw UnauthorizedException when user does not exist", async () => {
            mockUserService.findOne.mockResolvedValue(null);

            await expect(service.login("wronguser", "password123")).rejects.toThrow(UnauthorizedException);
        });

        it("should throw UnauthorizedException when password is incorrect", async () => {
            mockUserService.findOne.mockResolvedValue(mockUser);

            await expect(service.login("testuser", "wrongpassword")).rejects.toThrow(UnauthorizedException);
        });
    });

    describe("register", () => {
        it("should create a new user when username is available", async () => {
            const username = "newuser";
            const password = "password123";

            mockUserService.findOne.mockResolvedValue(null);
            mockUserService.createUser.mockResolvedValue({
                ...mockUser,
                username,
            });

            const result = await service.register(username, password);

            expect(result).toBeDefined();
            expect(result.username).toBe(username);
            expect(mockUserService.findOne).toHaveBeenCalledWith(username);
            expect(mockUserService.createUser).toHaveBeenCalledWith(username, expect.any(String));
        });

        it("should throw ConflictException when username already exists", async () => {
            mockUserService.findOne.mockResolvedValue(mockUser);

            await expect(service.register("testuser", "password123")).rejects.toThrow(ConflictException);
        });
    });
});

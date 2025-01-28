import {Test, TestingModule} from "@nestjs/testing";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {RegisterDto} from "./dto/register.dto";

describe("AuthController", () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("login", () => {
        it("should call authService.login with correct credentials", async () => {
            const loginDto: LoginDto = {
                username: "testuser",
                password: "password123",
            };
            const expectedResult = {accessToken: "test-token"};
            mockAuthService.login.mockResolvedValue(expectedResult);

            const result = await controller.login(loginDto);

            expect(result).toBe(expectedResult);
            expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
        });
    });

    describe("register", () => {
        it("should call authService.register with correct credentials", async () => {
            const registerDto: RegisterDto = {
                username: "newuser",
                password: "password123",
            };
            const expectedResult = {id: 1, username: "newuser"};
            mockAuthService.register.mockResolvedValue(expectedResult);

            const result = await controller.register(registerDto);

            expect(result).toBe(expectedResult);
            expect(mockAuthService.register).toHaveBeenCalledWith(registerDto.username, registerDto.password);
        });
    });
});

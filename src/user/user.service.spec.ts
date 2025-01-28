import {Test, TestingModule} from "@nestjs/testing";
import {UserService} from "./user.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import * as bcrypt from "bcryptjs";

describe("UserService", () => {
    let service: UserService;
    let userRepository: Repository<User>;

    const mockUserRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findOne", () => {
        it("should return a user if found", async () => {
            const expectedUser = {
                id: 1,
                username: "testuser",
                password: "hashedpassword",
            };
            mockUserRepository.findOne.mockResolvedValue(expectedUser);

            const result = await service.findOne("testuser");

            expect(result).toBe(expectedUser);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: {username: "testuser"},
            });
        });

        it("should return null if user not found", async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await service.findOne("nonexistent");

            expect(result).toBeNull();
        });
    });

    describe("createUser", () => {
        it("should create and return a new user", async () => {
            const username = "newuser";
            const password = "hashedpassword";
            const newUser = {id: 1, username, password};

            mockUserRepository.create.mockReturnValue(newUser);
            mockUserRepository.save.mockResolvedValue(newUser);

            const result = await service.createUser(username, password);

            expect(result).toBe(newUser);
            expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
        });
    });
});

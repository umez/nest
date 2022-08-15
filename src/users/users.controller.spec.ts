import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {

	let controller: UsersController;
	let fakeUsersService: Partial<UsersService>;
	let fakeAuthService: Partial<AuthService>;

	beforeEach(async () => {
		const users: User[] = [];

		fakeUsersService = {
			findOne: (id: number) => Promise.resolve({id, email: 'asdf@asdf.com', password: 'asdf'} as User),
			// removeUser: (id: number) => Promise.resolve({id}),
			// updateUser: () => {},
			find: (email: string) => {
				// const filteredUsers = users.filter(user => user.email === email);
				// return Promise.resolve(filteredUsers);
				return Promise.resolve([{id: 1, email, password: 'asdf'} as User])
			},
			create: (email: string, password: string) => {
				const user = { id: Math.floor(Math.random() * 99999), email, password } as User;
				users.push(user);
				return Promise.resolve(user);
			}
		};

		fakeAuthService = {
			// signup: () => {},
			signin: (email: string, password: string) => {
				return Promise.resolve({id: 1, email, password} as  User)
			}
		}

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{provide: UsersService, useValue: fakeUsersService},
				{provide: AuthService, useValue: fakeAuthService}
			]
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('find all users returns a list os user with the given email', async () => {	
		const users = await controller.findAllUser('asdf@asdf.com');
		expect(users.length).toEqual(1);
		expect(users[0].email).toEqual('asdf@asdf.com');
	})

	it('find user and return the user',async () => {
		const users = await controller.findUser('1');
		expect(users).toBeDefined();
	})

	it('should throw error if a user is not found',async () => {
		fakeUsersService.findOne = () => null;
		// const users = await controller.findUser('2');
		// expect(users).rejects.toThrowError(NotFoundException);
		await expect(controller.findUser('1')).rejects.toThrowError(NotFoundException)
	})

	it('signin updates session object and returns user', async () => {
		const session = { userId: -10};
		const user = await controller.signin({email: 'asdf@asdf.com', password: 'asdf'}, session)

		expect(user.id).toEqual(1);
		expect(session.userId).toEqual(1)
	})


});

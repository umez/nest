import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';


describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      // find: () => Promise.resolve([]),
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {id: Math.floor(Math.random() * 99999), email, password} as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => { 
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => { 
    const user = await service.signup('asba@ss.com', 'fasdfsadf');
    expect(user.password).not.toEqual('fasdfsadf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'test@test.com', password: 'abc' } as User,
    //   ]);
    // console.log(fakeUsersService);
    await service.signup('test@test.com', 'password');

    try {
      await service.signup('test@test.com', 'password');
    } catch (error) {
      const { message, statusCode } = error.response;
      expect(statusCode).toBe(400);
      expect(message).toBe('email already in use');
    }
  });
 
  it('throws if signin is called with and unused email', async () => {
    await expect(
      service.signin('asdfasdf@asdf.com', 'asdfsadf'),
    ).rejects.toThrowError(NotFoundException);
  });

  it('throws if an invalid password is provided', async() => {
    
      await service.signup('test@test.com', 'asdf');

      await expect(
        service.signin('test@test.com', 'asdfsadf'),
      ).rejects.toThrowError(BadRequestException);         
  })

  it('returns a user if correct password is provided', async() => {
    
    await service.signup('asdf@asdf.com', 'asdf')
    const user = await service.signin('asdf@asdf.com', 'asdf')
    expect(user).toBeDefined();
    
  })
})

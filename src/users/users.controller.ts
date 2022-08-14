import { AuthGuard } from './../guards/auth.guard';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, Session, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Serialize, SerializeInterceptor } from './../interceptors/serialize.interceptor';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {

	constructor(
		private userService: UsersService,
		private authService: AuthService
	) {}

	// @Get('/colors/:color') 
	// setColor(@Param('color') color: string, @Session() session: any) {
	// 	session.color = color;
	// }

	// @Get('/color')
	// getColor(@Session() session: any) {
	// 	return session.color;
	// }

	// @Get('/whoami')
	// whoAmI(@Session() session: any) {
	// 	return this.userService.findOne(session.userId);
	// }

	@Get('/whoami')
	@UseGuards(AuthGuard)
	whoAmI(@CurrentUser() user: User) {
		return user;
	}

	@Post('/signout')
	signOut(@Session() session: any) {
		session.userId = null;
	}

	@Post('/signup')
	async createUser(@Body() body: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signup(body.email, body.password);
		session.userId = user.id;
		return user;
	}

	@Post('/signin')
	async signin(@Body() body: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signin(body.email, body.password);
		session.userId = user.id;
		return user;
	}

	// @UseInterceptors(ClassSerializerInterceptor)
	// @UseInterceptors(new SerializeInterceptor(UserDto))
	
	@Get('/:id') 
	async findUser(@Param('id') id: string) {
		console.log('handler is runing')
		const user = await this.userService.findOne(parseInt(id));
		if(!user) {
			throw new NotFoundException('user not found')
		}
		return user;
	}

	@Get() 
	findAllUser(@Query('email') email: string) {
		return this.userService.find(email)
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string ) {
		return this.userService.remove(parseInt(id));
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.userService.update(parseInt(id), body)
	}

}

import {
	NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from './../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

	constructor(private userService: UsersService){}

	// this is to set current user in the request which needs to be available in currrent user decorator
	// since decorator is not a part of DI system
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ) {
    const request = context.switchToHttp().getRequest();
		const { userId } = request.session || {};

		if(userId) {
			const user = await this.userService.findOne(userId);
			request.currentUser = user;
		}

		return next.handle();
  }
}

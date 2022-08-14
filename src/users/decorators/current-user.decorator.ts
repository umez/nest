import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {   // ExecutionContext is incoming request viz http, grphQL, webshocket   // never is not to pass parameter in the decorator
    // get session object
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  }
);

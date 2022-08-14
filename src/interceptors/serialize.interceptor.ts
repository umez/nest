import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, plainToInstance } from 'class-transformer';

interface ClassConstructor {
	new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

	constructor(private dto: any) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		// run something before a request is handled by the request handler
		// console.log('Iam nuring before the handler / next ', context);
		return next.handle().pipe(
			map((data: any) => {
				return plainToInstance(this.dto, data, {
					excludeExtraneousValues: true
				})
				// run something before the response sent out
				// console.log('I am runig before response is sent out ', data)
			})
		);
	}

}
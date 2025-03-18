import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const now = Date.now();
    return next.handle().pipe(
      tap((data) =>
        this.logger.log({
          request: request.body,
          response: data,
          timeCost: Date.now() - now,
          RequestId: request.body?.RequestId,
        }),
      ),
    );
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface Response<T> {
  data: T;
}

@Injectable()
export class OwnerInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((data) => {
        if (data === undefined) return;

        if (Array.isArray(data)) {
          for (const item of data) {
            delete item.owner.email;
            delete item.owner.password;
          }
        } else {
          delete data.owner.email;
          delete data.owner.password;
        }

        return data;
      }),
    );
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PublicUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((userData: User | User[]) => {
        if (Array.isArray(userData)) {
          for (const user of userData) {
            delete user.email;
          }
        } else {
          delete userData.email;
        }
        return userData;
      }),
    );
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Offer } from '../offers/entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: Wish | Wish[] | undefined) => {
        if (data === undefined) return;

        if (Array.isArray(data)) {
          data.map((wishItem) => {
            for (const offer of wishItem.offers as Offer[]) {
              delete offer.user.password;
            }
            return wishItem;
          });
        } else {
          for (const offer of data.offers as Offer[]) {
            delete offer.user.password;
          }
        }

        return data;
      }),
    );
  }
}

import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

/**
 * Applies a small automatic retry to every outgoing GET request..
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }
  return next(req).pipe(retry({ count: 2, delay: (_, retryCount) => timer(retryCount * 500) }));
};

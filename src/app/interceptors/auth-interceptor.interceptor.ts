import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthService).getToken();  // Clone the request to add the authentication header. 
  const newReq = req;/*req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });*/
  
  console.table(newReq);
  return next(newReq);
};

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUserData = localStorage.getItem('userData');
  const newReq = req.clone({
    headers: req.headers.append('Custom-Auth', storedUserData??""),
  });
  return next(newReq);
};

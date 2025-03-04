import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const headers = req.headers.set(
        'Custom-Auth',
        userData
      );
      req = req.clone({ headers });
    }
  }
  
  return next(req);
};

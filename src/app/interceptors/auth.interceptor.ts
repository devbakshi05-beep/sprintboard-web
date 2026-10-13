import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Ye function har outgoing HTTP request ko intercept karta hai
// aur agar token available hai, to usse "Authorization: Bearer <token>" header me add kar deta hai
// Isse manually har API call me token bhejne ki zaroorat nahi padti
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};

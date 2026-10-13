import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './components/login/login.component';
import { BoardComponent } from './components/board/board.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'board', component: BoardComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Ye line authInterceptor ko wire karti hai — isse har HTTP call me token automatically lagega
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

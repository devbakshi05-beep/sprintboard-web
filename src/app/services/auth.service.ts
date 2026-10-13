import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// IMPORTANT: local development me ye localhost hoga,
// deploy karne ke baad Render wale backend URL se replace karna
const API_URL = 'https://localhost:61723/api/auth';

interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/register`, { fullName, email, password })
      .pipe(tap(res => this.storeToken(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, { email, password })
      .pipe(tap(res => this.storeToken(res)));
  }

  // Token aur user info ko browser ki localStorage me save karo
  private storeToken(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('fullName', res.fullName);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getFullName(): string {
  return localStorage.getItem('fullName') ?? '';
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
  }
}

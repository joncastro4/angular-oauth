import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { CookieService } from 'ngx-cookie-service';

interface registerModel {
  username: string;
  email: string;
  password: string;
}

interface loginModel {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly authBaseURL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  register(data: registerModel) {
    return this.http.post(`${this.authBaseURL}/auth/register`, data);
  }

  login(data: loginModel) {
    return this.http.post(`${this.authBaseURL}/auth/login`, data);
  }

  user(token: string) {
    return this.http.get(`${this.authBaseURL}/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  setCookie(token: string) {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);
    this.cookieService.set('auth_token', token, expireDate, '/');
  }

  getToken() {
    return this.cookieService.get('auth_token');
  }
}

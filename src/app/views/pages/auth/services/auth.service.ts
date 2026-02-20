import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from './localstorage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  refreshTokenTimeout: any;

  constructor(
    private http: HttpClient,
    private _token: LocalstorageService,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.api}auth/signin`, { email, password }).pipe(
      map((res: any) => {
        const token = res?.token || res?.data?.token;
        if (token) this._token.setToken(token);
        return res;
      })
    );
  }

  register(name: string, email: string, password: string, rePassword?: string, phone?: string): Observable<any> {
    const body: any = { name, email, password };
    if (rePassword !== undefined) body.rePassword = rePassword;
    if (phone !== undefined) body.phone = phone;
    return this.http.post<any>(`${environment.api}auth/signup`, body).pipe(
      map((res: any) => {
        const token = res?.token || res?.data?.token;
        if (token) this._token.setToken(token);
        return res;
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.api}auth/forgotPasswords`, { email });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${environment.api}users/changeMyPassword`, {
      currentPassword,
      password: newPassword
    });
  }

  loggedIn(): boolean {
    const token = this._token.getToken();
    if (!token) return false;
    try {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      return Math.floor(new Date().getTime() / 1000) < tokenDecode.exp;
    } catch {
      return false;
    }
  }

  logout() {
    this._token.removeToken();
    this.router.navigate(['/auth']);
  }

  refreshToken(): Observable<any> {
    const token = this._token.getToken();
    return this.http.post<any>(`${environment.api}auth/refreshToken`, { token }).pipe(
      map((response: any) => {
        const newToken = response?.token || response?.data?.token || response?.access_token;
        if (newToken) this._token.setToken(newToken);
        this.startRefreshTokenTimer();
        return true;
      })
    );
  }

  startRefreshTokenTimer(): void {
    const jwtToken = this._token.getToken();
    if (!jwtToken) return;
    try {
      const jwtTokenDecode = JSON.parse(atob(jwtToken.split('.')[1]));
      const expires = new Date(jwtTokenDecode.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      if (timeout > 0) this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    } catch {}
  }

  stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}

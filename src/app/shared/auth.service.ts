import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private popupState = new BehaviorSubject<boolean>(false);
  popupState$ = this.popupState.asObservable();
  API =  `${environment.apiBaseUrl}/auth`;
  constructor(private http:HttpClient){

  }


   open() {
    this.popupState.next(true);
  }

  close() {
    this.popupState.next(false);
  }
loginPassword(data:any) {
  return this.http.post(`${this.API}/login-password`, data);
}

sendLoginOtp(email:string) {
  return this.http.post(`${this.API}/login-otp/send`, { email });
}

verifyLoginOtp(data:any) {
  return this.http.post(`${this.API}/login-otp/verify`, data);
}

register(data:any) {
  return this.http.post(`${this.API}/register`, data);
}

verifyEmailOtp(data:any) {
  return this.http.post(`${this.API}/verify-email-otp`, data);
}

setSession(res: any) {
  localStorage.setItem('token', res.token);
  localStorage.setItem('user', JSON.stringify(res.user));
}

isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}
logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
localStorage.clear()
  // Optional
  sessionStorage.clear();
}

}

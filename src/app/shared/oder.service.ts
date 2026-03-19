import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OderService {
API =  `${environment.apiBaseUrl}/orders`;
  userId: any='';
  constructor(
    private http: HttpClient,
    private authSer: AuthService
  ) { 
       if(this.authSer.isLoggedIn()){
     const userStr = localStorage.getItem('user')
      if (userStr) {
  const user = JSON.parse(userStr);
  this.userId = user.id;
}
       }
      }

  getOrder(){
    return this.http.get(`${this.API}/my-orders`);
  }
  getAllOrder(){
     return this.http.get(`${this.API}/orders`);
  }
}

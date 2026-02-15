import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
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

  createOrder(amount:any){
    return this.http.post(`${this.API}/create-payment`, {amount});
  }


    createCODOrder(payload:any){
    return this.http.post(`${this.API}/create-cod-order`, payload);
  }
  verifyPayment(payload:any){
    payload.userId = this.userId
 return this.http.post(`${this.API}/verify-payment`,payload);
  }


  createShipment(payload:any,id:string){
     return this.http.post(`${environment.apiBaseUrl}/ship/create-shipment/${id}`, payload);
  }
  getTracking(awb:string){
   return this.http.get<any>(`${environment.apiBaseUrl}/ship/track/${awb}`);
}

}

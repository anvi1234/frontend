import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  
  API =  `${environment.apiBaseUrl}/carts`;
private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();


  
  public userId='';

  constructor(private http: HttpClient, private authSer: AuthService) {
      if(this.authSer.isLoggedIn()){
     const userStr = localStorage.getItem('user')
      if (userStr) {
      const user = JSON.parse(userStr);
      this.userId = user.id;
         const sessionCount = sessionStorage.getItem('cartCount');
    this.cartCountSubject.next(sessionCount ? +sessionCount : 0);
}
    }
  }


  getCart() {
       if (!this.authSer.isLoggedIn()) {
      this.authSer.open();
      return EMPTY;
    }
    return this.http.get<any>(`${this.API}/${this.userId}`);
  }
 setCartCount(count: number) {
    sessionStorage.setItem('cartCount', String(count));
    this.cartCountSubject.next(count); // 🔥 this updates header instantly
  }

  incrementCart() {
    const current = this.cartCountSubject.value;
    this.setCartCount(current + 1);
  }

  addToCart(product: any) {
    product.userId = this.userId;
      if (!this.authSer.isLoggedIn()) {
       this.authSer.open();
      localStorage.setItem('pendingCart', JSON.stringify(product));
      return EMPTY;
    }
      const count = Number(sessionStorage.getItem('cartCount')) + 1
      this.setCartCount(count);
   
    return this.http.post(`${this.API}/add`, {
      userId:  this.userId,
      product: { ...product }
    });
  }

  updateQuantity(productId: string, quantity: number) {
    return this.http.put(`${this.API}/update-quantity`, {
      userId:  this.userId,
      productId,
      quantity
    });
  }

  removeItem(productId: string) {
       const count = Number(sessionStorage.getItem('cartCount')) - 1
      this.setCartCount(count);
    return this.http.post(`${this.API}/remove-item`, {
      userId:  this.userId,
      productId
    });
  }

  clearCart() {
    return this.http.post(`${this.API}/clear`, {
      userId: this.userId
    });
  }

  setCount(cart: any) {
    const total = cart.items.reduce((sum: number, i: any) => sum + i.quantity, 0);
      localStorage.setItem("cartCount", total)
  }
}

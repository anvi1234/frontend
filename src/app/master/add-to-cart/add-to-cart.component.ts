import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/cart.service';
import { Cart, CartItem } from './cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  public cartDetails!: Cart;

  constructor(
    private cartSer: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCartData()
  }

  public loadCartData(){
    this.cartSer.getCart().subscribe((res: any) => {

  this.cartDetails = {
    ...res,
    items: res.items.map((item: any) => ({
      ...item,
      updatedPrice: item.updatedprice  // or just item.price
    }))
  };

});
  }

  get totalPrice(): number {
    return this.cartDetails.items.reduce((total, product) => total + product.updatedprice, 0);
  }

  removeProduct(id: string) {
    this.cartSer.removeItem(id).subscribe((res)=>{
this.loadCartData();
    })
  }

  increaseQuantity(product: CartItem) {
    product.quantity += 1;
    product.updatedprice =  product.price * product.quantity;
    this.cartSer.updateQuantity(product.productId, product.quantity).subscribe((res)=>{

    })
  }

  decreaseQuantity(product: CartItem) {
    if (product.quantity > 1) {
      product.quantity -= 1;
       product.updatedprice =  product.price * product.quantity;
       this.cartSer.updateQuantity(product.productId, product.quantity).subscribe((res)=>{

    })
    }
  }

  public clearCart(){
    this.cartSer.clearCart().subscribe((res)=>{
      this.loadCartData();
    })
  }

  checkout() {
   this.router.navigateByUrl("/checkout")
  }

  goToShop(){

  }
}

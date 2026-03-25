import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService } from 'src/app/shared/cart.service';
import { Cart, CartItem } from '../add-to-cart/cart.model';
import { CheckoutService } from 'src/app/shared/checkout.service';
import { Router } from '@angular/router';

declare var Razorpay: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutForm!: FormGroup;

  cartItems!: Cart;
  totalAmount = 0;
  indiaStates: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cartSer: CartService,
    private checkoutSer: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

   const navigation = history.state;

  if (navigation.buyNowProduct) {

    this.cartItems = {
      items: [navigation.buyNowProduct]
    } as any;

    this.calculateTotal();

  } else {

    this.loadCart(); // normal cart flow

  }

  }

  /**
   * Initialize Reactive Form
   */
  private initializeForm(): void {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
       pinCode: ['', [
    Validators.required,
    Validators.pattern(/^[1-9][0-9]{5}$/)
  ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],
      address: ['', Validators.required],
      paymentMode:['online'],
      state:['',Validators.required],
      city:['',Validators.required]
    });
    
  }

  /**
   * Load cart items (mock / service / localStorage)
   */

    public loadCart(){
    this.cartSer.getCart().subscribe((res: any) => {
  this.cartItems = {
    ...res,
    items: res.items.map((item: any) => ({
      ...item,
      updatedPrice: item.updatedprice  // or just item.price
    }))
  };
      this.calculateTotal();
});
  }


  /**
   * Calculate cart total
   */
  private calculateTotal(): void {
    this.totalAmount = this.cartItems.items.reduce(
      (sum, item) => sum + item.updatedprice,
      0
    );
  }

  /**
   * Pay button click
   */
  payNow(): void {
    if (this.checkoutForm.invalid || !this.cartItems.items.length) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
      this.pay()
  
  }



pay() {
  this.checkoutSer.createOrder(1).subscribe((order: any) => {
    const options = {
      key: 'rzp_live_SPsOWUwOGq0yBs',
      amount: order.amount,
      currency: 'INR',
      name: 'Aashirvad Rudraksh & Gems',
      description: 'Payment',
      order_id: order.id,
      prefill: {
        name: this.checkoutForm.value.name,
        email: this.checkoutForm.value.email,
        contact: this.checkoutForm.value.phone
      },
      notes: {
        address: this.checkoutForm.value.address,
        pinCode: this.checkoutForm.value.pinCode
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true
      },
      handler: (response: any) => {
        // Prepare payload for backend
        const payload = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          items: this.cartItems.items,
          totalAmount: this.totalAmount,
          address: {
            name: this.checkoutForm.value.name,
            street: this.checkoutForm.value.address,
            city: this.checkoutForm.value.city,
            pinCode: this.checkoutForm.value.pinCode,
            state: this.checkoutForm.value.state || 'UP',
            country: this.checkoutForm.value.country || 'India',
            phone: this.checkoutForm.value.phone
          }
        };

        this.checkoutSer.verifyPayment(payload).subscribe((res: any) => {
          if (res.status === 'success') {
            this.checkoutForm.reset();
            this.cartItems.items = [];
            this.totalAmount = 0;
             this.createShipment(res.order)
            this.router.navigate(['/payment-success'],{
  queryParams:{
    orderId: this.getOrderId(res._id),
    amount: response.order.totalAmount
  }

});
            alert('Payment Successful ✅');
          } else {
            alert('Payment Verification Failed ❌');
          }
        });
      },
      modal: { escape: true, ondismiss: () => console.log('Payment popup closed') },
      theme: { color: '#FF6600' }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
}

  getOrderId(id:string){
    const orderId = 'Order_' + id.slice(-6);
    return orderId;
  }

 placeOrder() {

 const paymentMode = this.checkoutForm.value.paymentMode;

 if(paymentMode === 'online'){
   this.payNow(); // Razorpay
 } else {
   this.placeCODOrder();
 }

}



placeCODOrder(){
 const payload = {
   items: this.cartItems.items,
   totalAmount: this.totalAmount,
   paymentMode: 'COD',

   address: {
     name: this.checkoutForm.value.name,
     street: this.checkoutForm.value.address,
     pinCode: this.checkoutForm.value.pinCode,
     phone: this.checkoutForm.value.phone,
     city: this.checkoutForm.value.city,
     state: this.checkoutForm.value.state,
   }
 };

 this.checkoutSer.createCODOrder(payload).subscribe((res:any) => {
        this.createShipment(res.order)
   alert('Order placed successfully (COD)');
 });

}



createShipment(newOrder:any){
  const shiprocketPayload = {
   order_id: newOrder._id.toString(), // 👈 IMPORTANT
   order_date: this.formatShiprocketDate(newOrder.createdAt),
   pickup_location: "warehouse",
   billing_customer_name: newOrder.address.name,
   billing_last_name: newOrder.address.name.trim().split(" ")[1],
   billing_address: newOrder.address.street,
   billing_city: newOrder.address.city || "Lucknow",
  delivery_postcode: newOrder.address.pinCode,
   pickup_postcode:"110048",
   billing_pincode:newOrder.address.pinCode,
   billing_state: newOrder.address.state,
   billing_country: "India",
   billing_phone: String(newOrder.address.phone),
   shipping_is_billing: true,
   order_items: newOrder.items.map((item:any)=> ({
    name: item.name,
    sku: `${item.productId}_${item.variantSize}`,
    units: item.quantity,
    selling_price: item.updatedprice || item.price
  })),
   payment_method: newOrder.paymentMode ?? "PrePaid",
   cod : newOrder.paymentMode == "COD"? 1:0,
   sub_total:newOrder.totalAmount,
   length:10,
   breadth:10,
   height:10,
   weight:0.5
}
  this.checkoutSer.createShipment(shiprocketPayload,newOrder._id).subscribe((res)=>{
    this.router.navigate(['/payment-success'],{
  queryParams:{
    orderId: this.getOrderId(newOrder._id),
    amount: newOrder.totalAmount
  }
})
  })
}
    formatShiprocketDate(dateString:any) {

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServiceService } from 'src/app/shared/product-service.service';
import { Product, ProductSection } from './product.model';
import { CartService } from 'src/app/shared/cart.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public productId: string;
  public productDetail!: Product ;
  selectedImage = '';
  quantity: number = 1;
images:any = [];
  public selectVariants: any = [];
  public activeIndexForSelectVariant: number = 0;
  public activeFeatureIndex: any = 0;
  public sections!: ProductSection[]
  public cartName = "AddtoCart";
  staticFinalPrice: any;
  staticPrice: any;
  public featureName: string = '';
  public variantSize: any = '';
  public variantType: any = '';
  public userId = '';


  constructor(
     private route: ActivatedRoute,
     private productSer: ProductServiceService,
     private addToCartSer: CartService,
     private router: Router,
     private authSer: AuthService
  ){
 this.productId = this.route.snapshot.paramMap.get('id') || '';
   if(this.authSer.isLoggedIn()){
     const userStr = localStorage.getItem('user');
       if (userStr) {
        const user = JSON.parse(userStr);
        this.userId = user.id;
    }
  }
  
}



  ngOnInit() {
  if (this.productId) {
      this.productSer.getProductById(this.productId).subscribe((res)=>{
          this.productDetail = res.product;
          this.images = this.productDetail.images;
          this.images.unshift(this.productDetail.mainImage);
           this.selectedImage = this.images[0].url;
            this.staticFinalPrice = this.productDetail.finalPrice;
            this.productDetail.price = this.productDetail.price;
           if(this.productDetail.sections.length>0){
            this.sections = this.productDetail.sections
           }
           if(this.productDetail.features.length > 0){
              this.selectVariant()

           }
      })
  }
}

public selectVariant(){
  this.selectVariants = this.productDetail.features[0].variants;
             this.productDetail.finalPrice = this.productDetail.features[0].variants[0].finalPrice;
              this.productDetail.price =  this.productDetail.features[0].variants[0].price;
              this.productDetail.discount =  this.productDetail.features[0].variants[0].discountPercent;
              this.staticFinalPrice = this.productDetail.features[0].variants[0].finalPrice;
               this.staticPrice =  this.productDetail.features[0].variants[0].price;
               this.variantType = this.productDetail.features[0].variants[0].attribute;
                this.variantSize = this.productDetail.features[0].variants[0].value;
                this.featureName = this.productDetail.features[0].label;
}

public clickOnFeature(data:any,index:number){
  this.featureName = this.productDetail.features[index].label;
   this.quantity = 1;
  this.selectVariants = data;
  this.activeIndexForSelectVariant = 0;
   this.activeFeatureIndex = index;
   this.productDetail.finalPrice = data[0].finalPrice;
     this.productDetail.price =  data[0].price;
      this.productDetail.discount = data[0].discountPercent;
}

selectImage(img: string) {
  this.selectedImage = img;
}

activeIndex: number | null = 0;

toggleSection(index: number) {
  this.activeIndex = this.activeIndex === index ? null : index;
}

setActive(index: number,item:any) {
  this.variantType = item.attribute;
  this.variantSize = item.value;
  this.quantity = 1;
  this.activeIndexForSelectVariant = index;
  this.productDetail.finalPrice = item.finalPrice;
  this.staticFinalPrice = item.finalPrice;
  this.productDetail.price = item.price;
   this.staticPrice = item.price;
  this.productDetail.discount = item.discountPercent;
}

increaseQty() {
  this.quantity++;
   this.productDetail.finalPrice = ((this.staticFinalPrice) * this.quantity) ;
   console.log("===" ,this.productDetail.finalPrice,this.staticFinalPrice,this.quantity)
  this.productDetail.price =  (this.staticFinalPrice)* this.quantity;
   console.log("===1" ,this.productDetail.price)
}

decreaseQty() {
  if (this.quantity > 1) {
    this.quantity--;
    this.productDetail.finalPrice = ((this.staticFinalPrice)*this.quantity) ;
    this.productDetail.price =  (this.staticFinalPrice) * this.quantity;
  }
}

addToCart(){
   const product = {
    userId: this.userId,
    name: this.productDetail.name,
    productId:this.productDetail._id,
    updatedprice: this.productDetail.finalPrice,
    price: this.staticFinalPrice,
    feature:  this.featureName,
    image: this.productDetail.mainImage.url,
    quantity: this.quantity,
    variantType: this.variantType,
    variantSize: this.variantSize
  };


  this.addToCartSer.addToCart(product).subscribe((res)=>{
      if(res){
        this.cartName = "Go To Cart";
        this.quantity = 1;
        this.addToCartSer.setCount(res);
      }
  })

}

goToCart(){
this.router.navigateByUrl("/add-to-cart")
}
}

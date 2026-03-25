import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServiceService } from 'src/app/shared/product-service.service';
import { Product, ProductSection } from './product.model';
import { CartService } from 'src/app/shared/cart.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Title, Meta } from '@angular/platform-browser';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public productId: string ='';
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
  relatedProducts: any;


  constructor(
     private route: ActivatedRoute,
     private productSer: ProductServiceService,
     private addToCartSer: CartService,
     private router: Router,
     private authSer: AuthService,
       private title: Title,
  private meta: Meta
  ){
   if(this.authSer.isLoggedIn()){
     const userStr = localStorage.getItem('user');
       if (userStr) {
        const user = JSON.parse(userStr);
        this.userId = user.id;
    }
  }
  
}



  ngOnInit() {
     this.route.paramMap.subscribe(params => {
      this.productId = params.get('slugName') || '';

      if (this.productId) {
        this.loadProductDetails();
      }
    });
  }

private loadProductDetails(){
  this.resetProductState();
   if (this.productId) {
      this.productSer.getProudctBySlugName(this.productId).subscribe((res)=>{
          this.productDetail = res;
          this.images = this.productDetail.images;
          this.images.unshift(this.productDetail.mainImage);
           this.selectedFile = this.images[0];
           console.log("selectedFile", this.selectedFile)
            this.staticFinalPrice = this.productDetail.finalPrice;
            this.productDetail.price = this.productDetail.price;
           if(this.productDetail.sections.length>0){
            this.sections = this.productDetail.sections
           }
           if(this.productDetail.features.length > 0){
              this.selectVariant()

           }
            if (this.productDetail?.category?.slug) {
      this.getRelatedProducts(this.productDetail.category.slug, this.productDetail._id);
    }
           this.SEOUpdate(this.productDetail);
      })
  }
}
  resetProductState() {
    this.productDetail = {} as Product;
    this.images = [];
    this.selectedImage = '';
    this.quantity = 1;
    this.selectVariants = [];
    this.activeIndexForSelectVariant = 0;
    this.activeFeatureIndex = 0;
    this.sections = [];
    this.relatedProducts = [];
    this.featureName = '';
    this.variantSize = '';
    this.variantType = '';
    this.staticFinalPrice = 0;
    this.staticPrice = 0;
    this.cartName = 'AddtoCart';
    this.activeIndex = 0;
    this.isTabOpen = false;
  }

private setCanonicalURL(url?: string) {

  const link: HTMLLinkElement =
    document.querySelector("link[rel='canonical']") ||
    document.createElement('link');

  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', url || window.location.href);

  document.head.appendChild(link);
}

private SEOUpdate(product:Product){
  this.title.setTitle(product.seo.metaTitle);
this.setCanonicalURL(product.seo.canonicalUrl);
    /* =====================
       META TAGS
    ====================== */

    this.meta.updateTag({
      name: 'description',
      content: product.seo.metaDescription
    });

    this.meta.updateTag({
      name: 'keywords',
      content: product.seo.metaKeywords.join(',')
    });

    this.meta.updateTag({
      name: 'robots',
      content: product.seo.robots
    });

    /* =====================
       OPEN GRAPH
    ====================== */

    this.meta.updateTag({
      property: 'og:title',
      content: product.openGraph.title
    });

    this.meta.updateTag({
      property: 'og:description',
      content: product.openGraph.description
    });

    this.meta.updateTag({
      property: 'og:image',
      content: product.openGraph.image
    });

    this.meta.updateTag({
      property: 'og:type',
      content: product.openGraph.type
    });

    this.meta.updateTag({
      property: 'og:url',
      content: product.seo.canonicalUrl
    });

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
selectedFile:any = null;

// Update select function
selectImage(file: any) {
  this.selectedFile = file;
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
  this.productDetail.price =  (this.staticFinalPrice)* this.quantity;
}

decreaseQty() {
  if (this.quantity > 1) {
    this.quantity--;
    this.productDetail.finalPrice = ((this.staticFinalPrice)*this.quantity) ;
    this.productDetail.price =  (this.staticFinalPrice) * this.quantity;
  }
}

buyNow(){
 if (!this.authSer.isLoggedIn()) {
       this.authSer.open();
      return;
    }
  const buyNowProduct = {
   userId: this.userId,
    name: this.productDetail.name,
    productId:this.productDetail._id,
    updatedprice: this.productDetail.finalPrice,
    price: this.staticFinalPrice,
    feature: this.productDetail.features[0].label,
    image: this.productDetail.mainImage.url,
    quantity: this.quantity,
    variantType: this.variantType,
    variantSize: this.variantSize
  };

  this.router.navigate(['/checkout'], {
    state: { buyNowProduct }
  });


}

addToCart(item?:any){
  let product = {};
  if(item){
    product = {
    userId: item.userId,
    name: item.name,
    productId:item._id,
    updatedprice: item.finalPrice,
    price: item.finalPrice,
    feature:  item?.features[0]?.label,
    image: item.mainImage.url,
    quantity: this.quantity,
    variantType: item.variantType,
    variantSize: item.variantSize,
     slug:item.slug
  };
  }
  else{
    product = {
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

  }
  

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
isTabOpen = false;

toggleTab() {
  this.isTabOpen = !this.isTabOpen;
}

getRelatedProducts(categorySlug: string, currentProductId: string) {
  this.productSer.getProductBySlug(categorySlug).subscribe((res: any) => {
    this.relatedProducts = res
      .filter((item: any) => item._id !== currentProductId);
  });
}
productNavigate(slugName:string){
  this.router.navigateByUrl(`/product-detail/${slugName}`)
}

}

import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/shared/cart.service';
import { ProductServiceService } from 'src/app/shared/product-service.service';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
   encapsulation: ViewEncapsulation.None  
})
export class HomeComponent implements OnInit,AfterViewInit {
  public productData: any =[];
  public staticProductData:any = [];
  public gemsData:any=[];
  public rudrakshData:any =[]

images = ["./assets/images/newbanner1.jpeg", "./assets/images/newbanner2.jpeg", "./assets/images/newbanner3.jpeg"];

  constructor(
    private ProductSer: ProductServiceService,
    private router: Router,
    private addToCartSer: CartService
  ) { 
    this.getProduct();
  }

  ngOnInit(): void {

  }

  paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;
	pauseOnHover = true;
	pauseOnFocus = true;

	@ViewChild('carousel', { static: true }) carousel!: NgbCarousel;



   ngAfterViewInit(): void {
  	$('#slides-shop').superslides({
		inherit_width_from: '.cover-slides',
		inherit_height_from: '.cover-slides',
		play: 5000,
		animation: 'fade',
	});

	$(".cover-slides ul li").append("<div class='overlay-background'></div>");
}

public getProduct(){
  this.ProductSer.getProduct().subscribe((res:any)=>{
    this.staticProductData = res;
   this.productData = res.slice(0, 4);
  })
}

public getRudrakshData(){
    const rudrkashData = this.staticProductData.filter((e:any)=>{
      return e.category.name == "Rudraksh";
    })
  return rudrkashData.slice(0,7)
}

public getGemsData(){
    const GemsData = this.staticProductData.filter((e:any)=>{


      return e.category.name == "Gems";
    })
  return GemsData.slice(0,7)
}

public productNavigate(id:string){
  this.router.navigateByUrl(`/product-detail/${id}`);
}


addToCart(itemDetails:any){
   const product = {
    userId: '',
    name: itemDetails.name,
    productId:itemDetails._id,
    updatedprice: itemDetails.finalPrice,
    price: itemDetails.finalPrice,
    feature: '',
    image: itemDetails.mainImage.url,
    quantity: 1,
    variantType: '',
    variantSize: ''
  };


  this.addToCartSer.addToCart(product).subscribe((res)=>{
      if(res){
        this.addToCartSer.setCount(res);
      }
  })
  
}
}


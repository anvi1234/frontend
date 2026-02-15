import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { CartService } from 'src/app/shared/cart.service';
import { CategoryService } from 'src/app/shared/category.service';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, AfterViewInit {
public   isUserMenuOpen = false;
  public isCategoryOpen: boolean =false;
  public categoryData:any = [];
  public showAuthPopup = false;
  public userName = ''
  public cartCount:string|null = '0';
  constructor(private catSer: CategoryService,
      public authSer: AuthService,
      public router: Router,
      public cartSer: CartService
  ) { 
    if(this.authSer.isLoggedIn()){
     const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr);
        this.userName = user.name;  
}
 this.cartSer.cartCount$.subscribe(count => {
    this.cartCount = String(count);
    console.log("this.cartCount", this.cartCount,count)
  });
    }
    this.getCategory();

  }
    

  ngOnInit(): void {
  }

  loginPopup(){
     if(!this.authSer.isLoggedIn()){
      this.authSer.open();
      this.isUserMenuOpen = false;
     }
   
  }
  ngAfterViewInit(): void {
    	$('.offer-box').inewsticker({
		speed: 3000,
		effect: 'fade',
		dir: 'ltr',
		font_size: 13,
		color: '#ffffff',
		font_family: 'Montserrat, sans-serif',
		delay_after: 1000
	});

  }

  public getCategory(){
    this.catSer.getCategories().subscribe((res)=>{
      this.categoryData = res.filter((e:any)=>{
        return e.isActive
      })
    })
  }


toggleUserMenu() {
  this.isUserMenuOpen = !this.isUserMenuOpen;
      if(this.authSer.isLoggedIn()){
     const userStr = localStorage.getItem('user')
      if (userStr) {
  const user = JSON.parse(userStr);
  this.userName = user.name;
}
    }
   
}

logout() {
  localStorage.clear();
   this.authSer.logout();
   this.cartSer.setCartCount(0)
  this.isUserMenuOpen = false;
  this.router.navigateByUrl("/")
}
toggleCategory(){
  this.isCategoryOpen = !this.isCategoryOpen
}

 onUserIconClick() {
    if (this.authSer.isLoggedIn()) {
      this.toggleUserMenu();
    } else {
      this.openAuthPopup();
    }
  }

  openAuthPopup() {
this.authSer.open()
    this.isUserMenuOpen = false;
  }

   closeAuthPopup() {
    this.showAuthPopup = false;
  }

  navigate(slugName:string){
     this.isCategoryOpen = false;
     this.isMenuOpen = false
    this.router.navigateByUrl(`/product/${slugName}`);

   
  }
  toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
  document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
}
  addToCart() {
    this.isUserMenuOpen = false;
  if (!this.authSer.isLoggedIn()) {
    this.authSer.open(); // popup
    return;
  }

  this.router.navigate(['/add-to-cart']);

}
isMobileMenuOpen = false;


toggleMobileMenu() {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

closeMobileMenu() {
  this.isMobileMenuOpen = false;
  this.isMenuOpen = false
  this.isCategoryOpen = false;
}
isMenuOpen = false;

navigateToOrder(){
  this.isUserMenuOpen = false;
  this.router.navigateByUrl("/order-list");

}


}

import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from 'src/app/shared/product-service.service';
import { Product } from '../product-detail/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/category.service';
import { CartService } from 'src/app/shared/cart.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  public productDetails!: Product[];
  public slugName = '';
  public categoryData:any =[];
public selectedCategories: string[] = [];
public isAllSelected = false;
public cartName = 'AddtoCart';
allProducts: any[] = [];
filteredProducts: any[] = [];

  constructor(
    private productSer: ProductServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private catSer: CategoryService,
    private addToCartSer:CartService
  
  ) {
     this.activatedRoute.paramMap.subscribe(params => {
    this.slugName = params.get('slug')??'';
    if (this.slugName) {
      this.getDataBySlugName(this.slugName);
    } else {
      this.getProduct();
       this.getCategory();
    }
  });
   }

  ngOnInit(): void {
   if (!this.slugName) {
    this.selectAllCategories();
  }
  }

  selectAllCategories() {
  this.selectedCategories = this.categoryData.map((c:any)=>{
    return c.slug;
  })
  this.isAllSelected = true;
  this.applyFilter();
}

onCategoryChange(slug: string, event: any) {
  if (event.target.checked) {
    this.selectedCategories.push(slug);
  } else {
    this.selectedCategories = this.selectedCategories.filter(s => s !== slug);
    this.isAllSelected = false;
  }

  // check if all selected manually
  if (this.selectedCategories.length === this.categoryData.length) {
    this.isAllSelected = true;
  }

  this.applyFilter();
}

toggleAll(event: any) {
  if (event.target.checked) {
    this.selectAllCategories();
  } else {
    this.selectedCategories = [];
    this.isAllSelected = false;
    this.applyFilter();
  }
}

applyFilter() {
    if(this.selectedCategories.length === this.categoryData.length){
      this.getProduct()
    }
    else{
      this.getDataByMultipleSlugName(this.selectedCategories)
    }
    
}

  private getDataBySlugName(slugName:string){
      this.productSer.getProductBySlug(slugName).subscribe({
  next: (res) => {
    this.allProducts = res;
  this.filteredProducts = res; // default
  },
  error: (err) => {
    if (err.status === 404) {
      console.error('No products found for this category');
      this.allProducts  = [];
       this.filteredProducts = [];    
       // clear old data
    } else {
      console.error('Something went wrong', err);
    }
  }
});

  }

    private getDataByMultipleSlugName(categories:string[]){
      this.productSer.getProductByMultipleSlug(categories.join(',')).subscribe({
  next: (res) => {
     this.allProducts = res;
  this.filteredProducts = res; // default
  },
  error: (err) => {
    if (err.status === 404) {
     this.allProducts = [];
  this.filteredProducts = []; // default
    } else {
      console.error('Something went wrong', err);
    }
  }
});

  }


  private getProduct(){
    this.productSer.getProduct().subscribe((res:any)=>{
      this.allProducts = res;
  this.filteredProducts = res; // default
    })
  }

  private getCategory(){
      this.catSer.getCategories().subscribe((res:any)=>{
        this.categoryData = res;
      })
  }

  public productNavigate(id:string){
  this.router.navigateByUrl(`/product-detail/${id}`)
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
        this.cartName = "GoToCart"
        this.addToCartSer.setCount(res);
      }
  })
}


applyPriceFilter(event: Event) {
const type = (event.target as HTMLSelectElement).value;
  if (!type) {
    this.filteredProducts = [...this.allProducts];
    return;
  }

  this.filteredProducts = this.allProducts.filter(product => {
    const price = product.finalPrice ?? product.price;

    if (type === 'low') {
      return price < 2000;
    }

    if (type === 'mid') {
      return price >= 2000 && price <= 5000;
    }

    if (type === 'high') {
      return price > 5000;
    }

    return true;
  });
}

goToCart(){
  this.router.navigateByUrl("/add-to-cart")
}

}

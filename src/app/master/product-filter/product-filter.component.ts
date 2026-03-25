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
  public categoryData: any = [];
  public selectedCategories: string[] = [];
  public isAllSelected = false;
  public cartName = 'AddtoCart';

  allProducts: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  selectedPrice: string = '';
  selectedFilter: any;

  constructor(
    private productSer: ProductServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private catSer: CategoryService,
    private addToCartSer: CartService
  ) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.slugName = params.get('slug') ?? '';

      if (this.slugName) {
        this.getDataBySlugName(this.slugName);
      } else {
        this.getProduct();
        this.getCategory();
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
    this.selectedFilter = params['filter'] || 'all';
    this.applyLocalFilters();
  });
  }

  ngOnInit(): void {}

  selectAllCategories() {
    this.selectedCategories = this.categoryData.map((c: any) => c.slug);
    this.isAllSelected = true;
    this.applyFilter();
  }

  onCategoryChange(slug: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedCategories.includes(slug)) {
        this.selectedCategories.push(slug);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(s => s !== slug);
      this.isAllSelected = false;
    }

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
    if (this.slugName) {
      this.applyLocalFilters();
      return;
    }

    if (this.selectedCategories.length === 0) {
      this.allProducts = [];
      this.filteredProducts = [];
      return;
    }

    if (this.selectedCategories.length === this.categoryData.length) {
      this.getProduct();
    } else {
      this.getDataByMultipleSlugName(this.selectedCategories);
    }
  }



applyLocalFilters() {
  this.filteredProducts = this.allProducts.filter((item: any) => {
    const matchesSearch =
      !this.searchText ||
      item.name?.toLowerCase().includes(this.searchText.toLowerCase().trim());

    const price = item.finalPrice ?? item.price;

    const matchesPrice =
      !this.selectedPrice ||
      (this.selectedPrice === 'low' && price < 2000) ||
      (this.selectedPrice === 'mid' && price >= 2000 && price <= 5000) ||
      (this.selectedPrice === 'high' && price > 5000);

    const matchesType =
      this.selectedFilter === 'all' ||
      (this.selectedFilter === 'top' && item.isTopFeature) ||
      (this.selectedFilter === 'best' && item.isBestSeller);

    return matchesSearch && matchesPrice && matchesType;
  });
}

  applyFilterForFeatureBased(){
     let data = [...this.allProducts];

  if (this.selectedFilter === 'top') {
    data = data.filter((item: any) => item.topFeatured);
  } else if (this.selectedFilter === 'best') {
    data = data.filter((item: any) => item.bestSeller);
  }
 this.filteredProducts = data;
  }

  private getDataBySlugName(slugName: string) {
    this.productSer.getProductBySlug(slugName).subscribe({
      next: (res) => {
        this.allProducts = res;
        this.applyLocalFilters();
      },
      error: (err) => {
        if (err.status === 404) {
          console.error('No products found for this category');
          this.allProducts = [];
          this.filteredProducts = [];
        } else {
          console.error('Something went wrong', err);
        }
      }
    });
  }

  private getDataByMultipleSlugName(categories: string[]) {
    this.productSer.getProductByMultipleSlug(categories.join(',')).subscribe({
      next: (res) => {
        this.allProducts = res;
        this.applyLocalFilters();
      },
      error: (err) => {
        if (err.status === 404) {
          this.allProducts = [];
          this.filteredProducts = [];
        } else {
          console.error('Something went wrong', err);
        }
      }
    });
  }

  private getProduct() {
    this.productSer.getProduct().subscribe((res: any) => {
      this.allProducts = res;
      this.applyLocalFilters();
    });
  }

  private getCategory() {
    this.catSer.getCategories().subscribe((res: any) => {
      this.categoryData = res;

      if (!this.slugName && this.categoryData.length > 0 && this.selectedCategories.length === 0) {
        this.selectAllCategories();
      }
    });
  }

  public productNavigate(slugname: string) {
    this.router.navigateByUrl(`/product-detail/${slugname}`);
  }

  addToCart(itemDetails: any) {
    const product = {
      userId: '',
      name: itemDetails.name,
      productId: itemDetails._id,
      updatedprice: itemDetails.finalPrice,
      price: itemDetails.finalPrice,
      feature: '',
      image: itemDetails.mainImage.url,
      quantity: 1,
      variantType: '',
      variantSize: '',
      slug: itemDetails.slug
    };

    this.addToCartSer.addToCart(product).subscribe((res) => {
      if (res) {
        this.cartName = 'GoToCart';
        this.addToCartSer.setCount(res);
      }
    });
  }

  applyPriceFilter(event: Event) {
    this.selectedPrice = (event.target as HTMLSelectElement).value;
    this.applyLocalFilters();
  }

  filterProducts() {
    this.applyLocalFilters();
  }

  goToCart() {
    this.router.navigateByUrl('/add-to-cart');
  }
}
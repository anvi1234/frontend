import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AdminService } from 'src/app/shared/admin.service';
import { ProductServiceService } from 'src/app/shared/product-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  public products:any = [];
  public searchText: string = '';
public filteredProducts: any[] = [];

  constructor(
    private productSer: ProductServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
      this.getProduct();
  }

  private getProduct(){
    this.productSer.getProduct().subscribe((res)=>{
      this.products = res;
      this.filteredProducts = [...this.products];
    })
  }

  public navigate(){
     this.router.navigate(['/admin/add-product']);
  }

  public edit(id:any){
     this.router.navigate([`admin/add-product/${id}`]);
  }

    deleteProduct(id:any) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  this.productSer.delProduct(id).subscribe({
    next: (res) => {
      alert(res.message || 'Product deleted successfully');
      this.getProduct()
    },
    error: (err) => {
      alert(err.error?.message || 'Delete failed');
    }
  });
}

  filterProductList() {
  const search = this.searchText.toLowerCase().trim();

  this.filteredProducts = this.products.filter((product: any) =>
    product.name.toLowerCase().includes(search)
  );
}
}

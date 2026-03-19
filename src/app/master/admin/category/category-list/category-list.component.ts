import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  public categories:any = []
   selectedCategoryId: string | null = null;
  constructor(
      private categoryService: CategoryService,
      private router: Router
  ) { }

  ngOnInit(): void {

    this.loadCategories();
  }


  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  
  editCategory(id:string) {
    this.router.navigateByUrl(`admin/add-category/${id}`)
  }

  deleteCategory(id: any) {
    console.log("id", id)
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  toggleStatus(id: string) {
    this.categoryService.toggleCategory(id).subscribe(() => {
      this.loadCategories();
    });
  }
  navigate(){
    this.router.navigateByUrl("/admin/add-category")
  }
}

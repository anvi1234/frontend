import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category, CategoryService } from 'src/app/shared/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  selectedCategoryId: string | null = null;
 catKey: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
        private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
       if(id){
        this.catKey = id;
        this.isEditMode = true;
        this.getProductById(id)
       }
  }

getProductById(id:string){
  this.categoryService.getCategoryById(id).subscribe((res:any)=>{
    if(res.success){
      this.edit(res.category);
    }
  })
}
  submitCategory() {
    if (this.categoryForm.invalid){
      this.categoryForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.selectedCategoryId) {
      this.categoryService
        .updateCategory(this.selectedCategoryId, this.categoryForm.value)
        .subscribe(() => {
          alert("Category Updated Successfully")
         
        });
    } else {
      this.categoryService
        .createCategory(this.categoryForm.value)
        .subscribe(() => {
            alert("Category Added Successfully")
          this.resetForm();
        
        });
    }
  }

  edit(category: Category) {
    this.isEditMode = true;
    this.selectedCategoryId = category._id!;
    this.categoryForm.patchValue({ name: category.name });
  }


  toggleStatus(id: string) {
    this.categoryService.toggleCategory(id).subscribe(() => {
      // this.loadCategories();
    });
  }

  resetForm() {
    this.categoryForm.reset();
    this.isEditMode = false;
    this.selectedCategoryId = null;
  }
}


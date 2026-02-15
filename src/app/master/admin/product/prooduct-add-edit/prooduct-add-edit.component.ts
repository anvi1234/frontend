import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { CategoryService } from 'src/app/shared/category.service';
import { ProductServiceService } from 'src/app/shared/product-service.service';

@Component({
  selector: 'app-prooduct-add-edit',
  templateUrl: './prooduct-add-edit.component.html',
  styleUrls: ['./prooduct-add-edit.component.css']
})
export class ProoductAddEditComponent implements OnInit {
  @ViewChild('editor') editor: any;
  productForm!: FormGroup;
  featureTypes = ['Classic','Premium']
  mainImage:File | null = null;
  existingMainImage: any = null;
  productKey:string = '';
existingGalleryImages: any[] = [];
removedImages: any[] = []; // for delete
 public  isEditMode: boolean = false;
  galleryImages: File[] = [];
   modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // headings
      ['bold', 'italic', 'underline'], // styling
      [{ list: 'ordered' }, { list: 'bullet' }], // lists
      ['clean'] // remove formatting
    ]
  };

  attributes = [
  { label: 'Size', value: 'Size' },
  { label: 'Weight', value: 'Weight' },
  { label: 'Type', value: 'Type' }
];
  public categoriesData:any = []
removedMainImage: boolean = false;
removedGalleryImages: any[] = [];

  constructor(private fb: FormBuilder,
    private productSer: ProductServiceService,
    private catSer: CategoryService,
    private activatedRoute: ActivatedRoute
  ) {
    this.getCategory();
       const id = this.activatedRoute.snapshot.paramMap.get('id');
       if(id){
        this.productKey = id;
        this.isEditMode = true;
        this.getProductById(id)
       }
    
  }

  ngOnInit(): void {
    this.createProductForm();
  }

  public getCategory(){
        this.catSer.getCategories().subscribe((res)=>{
          this.categoriesData = res.filter((e)=>{
            return e.isActive;
          })
        })
  }

public getProductById(id: string) {
  this.productSer.getProductById(id).subscribe((res: any) => {
    const product = res.product;

    /* ================= BASIC PATCH ================= */
    this.productForm.patchValue({
      name: product.name,
      subtitle: product.subtitle,
      shortDescription: product.shortDescription,
      price: product.price,
      discount: product.discount,
      finalPrice: product.finalPrice,
      category: product.category?._id,
      stock: product.stock,
      isActive: product.isActive,
      ratings: product.ratings
    });
    this.mainImage = product.mainImage;
    /* ================= IMAGES (PREVIEW ONLY) ================= */
    this.existingMainImage = product.mainImage;
    this.existingGalleryImages = product.images || [];

    /* ================= FEATURES ================= */
    this.patchFeatures(product.features || []);

    /* ================= SECTIONS ================= */
    this.patchSections(product.sections || []);
  });
}

patchFeatures(features: any[]) {
  const featuresArray = this.features;
  featuresArray.clear();

  features.forEach((feature: any) => {
    const featureGroup = this.fb.group({
      label: [feature.label, Validators.required],
      variants: this.fb.array([])
    });

    feature.variants.forEach((variant: any) => {
      (featureGroup.get('variants') as FormArray).push(
        this.fb.group({
          attribute: [variant.attribute, Validators.required],
          value: [variant.value, Validators.required],
          price: [variant.price, Validators.required],
          discountPercent: [variant.discountPercent],
          finalPrice: [{ value: variant.finalPrice, disabled: true }],
          sku: [variant.sku],
          inStock: [variant.inStock]
        })
      );
    });

    featuresArray.push(featureGroup);
  });
}
patchSections(sections: any[]) {
  const sectionsArray = this.sections;
  sectionsArray.clear();

  sections.forEach(section => {
    sectionsArray.push(
      this.fb.group({
        key: [section.key, Validators.required],
        title: [section.title],
        content: [section.content, Validators.required],
        collapsed: [section.collapsed]
      })
    );
  });
}




  
  get features(): FormArray {
    return this.productForm.get('features') as FormArray;
  }

  getFeatures(): FormArray {
  return this.productForm.get('features') as FormArray;
}

getVariants(featureIndex: number): FormArray {
  return this.getFeatures()
    .at(featureIndex)
    .get('variants') as FormArray;
}
  get sections(): FormArray {
    return this.productForm.get('sections') as FormArray;
  }
 
  createFeature(): FormGroup {
    return this.fb.group({
      label: ['', Validators.required],
     variants: this.fb.array([])
    });
  }

  addFeature() {
    this.features.push(this.createFeature());
  }

  public onFeatureChange(featureIndex: number) {
  const featureGroup = this.getFeatures().at(featureIndex) as FormGroup;
  const variantsArray = this.getVariants(featureIndex);
  variantsArray.clear();
variantsArray.push(this.createVariant());

}

addVariant(featureIndex: number) {
  this.getVariants(featureIndex).push(this.createVariant());
}

removeVariant(featureIndex: number, variantIndex: number) {
  if( variantIndex === 0){
    this.getVariants(featureIndex).removeAt(variantIndex);
    this.removeFeature(featureIndex)
  }
  else{
  this.getVariants(featureIndex).removeAt(variantIndex);
  }

}
getFeatureGroup(i: number): FormGroup {
  return this.getFeatures().at(i) as FormGroup;
}

getSectionGroup(i:number):FormGroup {
  return this.sectionsGrp().at(i) as FormGroup
}
public sectionsGrp(): FormArray {
  return this.productForm.get('sections') as FormArray;
}

getVariantGroup(i: number, j: number): FormGroup {
  return this.getVariants(i).at(j) as FormGroup;
}
 
  removeFeature(index: number) {
    this.features.removeAt(index);
  }

  addSection() {
    this.sections.push(
      this.fb.group({
        key: ['', Validators.required],
        title: [''],
        content: ['', Validators.required],
        collapsed: [true]
      })
    );
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
  }

  generateSKU(feature: string, attribute: string, value: string) {
  return `${feature.substring(0,2).toUpperCase()}-${attribute.substring(0,2).toUpperCase()}-${value.replace(/\s+/g, '').toUpperCase()}`;
}

  createProductForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      subtitle: [''],
      shortDescription: ['',Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required,Validators.min(0), Validators.max(100)]],
      finalPrice: [{ value: null, disabled: true }],
      category: [null, Validators.required],
      features: this.fb.array([]),
      sections: this.fb.array([]),
        stock: [1, [Validators.min(0)]],
        isActive: [true],
        ratings: [0]
    });

    this.calculateFinalPrice();
  }

  createVariant(): FormGroup {
    const group = this.fb.group({
      attribute: ['', Validators.required],
      value: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      discountPercent: [0, [Validators.min(0), Validators.max(100)]],
      finalPrice: [{ value: 0, disabled: true }],
      sku: [''],
      inStock: [true]
    });
    group.valueChanges.subscribe(v => {
  const price = v.price || 0;
  const discount = v.discountPercent || 0;
  const final = price - (price * discount) / 100;
  group.get('finalPrice')?.setValue(final, { emitEvent: false });
});

return group;
  }

calculateFinalPrice() {
  this.productForm.get('price')?.valueChanges.subscribe(() => {
    this.updateFinalPrice();
  });

  this.productForm.get('discount')?.valueChanges.subscribe(() => {
    this.updateFinalPrice();
  });
}

updateFinalPrice() {
  const price = this.productForm.get('price')?.value || 0;
  const discount = this.productForm.get('discount')?.value || 0;
  const finalPrice = (price - (price * discount) / 100).toFixed(2);
  this.productForm.get('finalPrice')?.setValue(finalPrice);
}

onMainImageSelect(event: any) {
  this.mainImage = event.target.files[0];
}

onImagesSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const selectedFiles = Array.from(input.files);

  const totalImages =
    this.existingGalleryImages.length +
    this.galleryImages.length +
    selectedFiles.length;

  if (totalImages > 6) {
    alert('Maximum 6 images allowed');
    return;
  }

  this.galleryImages.push(...selectedFiles);
}



submit(): void {
  if(!this.mainImage){
    alert("Please add Main Image");
    return;
  }
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }
  const formData = new FormData();
  const formValue = this.productForm.getRawValue();
  formData.append('name', formValue.name);
  formData.append('subtitle', formValue.subtitle);
  formData.append('shortDescription', formValue.shortDescription || '');
  formData.append('price', formValue.price.toString());
  formData.append('discount', formValue?.discount?.toString());
  formData.append('finalPrice', formValue?.finalPrice?.toString() || '0');

  formData.append('category', formValue.category);
  formData.append('stock', formValue?.stock?.toString()??1);
  formData.append('isActive', String(formValue.isActive));
  formData.append('ratings', formValue?.ratings?.toString() ?? 0);
  if(formValue.features.length > 0){
    formData.append('features', JSON.stringify(formValue?.features));
  }
   if(formValue.sections.length > 0){
    formData.append('sections', JSON.stringify(formValue?.sections));
  }
  if (this.mainImage) {
    formData.append('mainImage', this.mainImage);
  }
  if (this.removedMainImage) {
    formData.append('removeMainImage', 'true');
  }
  if (this.removedGalleryImages.length) {
    formData.append(
      'removeImages',
      JSON.stringify(this.removedGalleryImages)
    );
  }
this.galleryImages.forEach((file: File) => {
    formData.append('images', file);
  });
  if (formValue.mainImage) {
    formData.append(
      'mainImageMeta',
      JSON.stringify(formValue.mainImage)
    );
  }

  if (formValue.images?.length) {
    formData.append(
      'imagesMeta',
      JSON.stringify(formValue.images)
    );
  }
if(this.isEditMode){
 this.productSer.updateProduct(formData, this.productKey).subscribe((res)=>{
   alert("Product Updated Succesfully")
 })
}
else{
   this.productSer.createProduct(formData).subscribe({
  next: res => {
     this.createProductForm();
    alert("Product Created Succesfully")
   
    this.galleryImages = [];
    this.mainImage = null;
  },
  error: err => {
    console.error(err);
  }
});
}
}

removeMainImage() {
  this.removedMainImage = true;
  this.existingMainImage = null;
}

removeExistingGalleryImage(img: any, index: number) {
  this.removedGalleryImages.push(img);
  this.existingGalleryImages.splice(index, 1);
}
}

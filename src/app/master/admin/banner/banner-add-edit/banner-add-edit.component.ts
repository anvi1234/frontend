import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BannerService } from 'src/app/shared/banner.service';

@Component({
  selector: 'app-banner-add-edit',
  templateUrl: './banner-add-edit.component.html',
  styleUrls: ['./banner-add-edit.component.css']
})
export class BannerAddEditComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
bannerForm:any;
banners:any=[];
mainImage:File | null = null;
  constructor(
    private fb:FormBuilder,
    private bannerService:BannerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bannerForm = this.fb.group({
    title:['',Validators.required],
    link:[''],
    position:[0,Validators.required],

  });
  }
saveBanner() {
  this.bannerForm.markAllAsTouched();

  if (!this.mainImage) {
    alert("Please upload banner image");
    return;
  }

  if (this.bannerForm.valid) {

    const formData = new FormData();

    formData.append('title', this.bannerForm.value.title);
    formData.append('link', this.bannerForm.value.link);
    formData.append('position', this.bannerForm.value.position);

    // image
    formData.append('image', this.mainImage);

    this.bannerService.addBanner(formData).subscribe(() => {
      alert("Banner Saved Successfully.");
      this.bannerForm.reset();
       this.mainImage = null;
        this.fileInput.nativeElement.value = '';
      this.router.navigateByUrl("/banner-list");
    });

  }
}
onMainImageSelect(event: any) {
  this.mainImage = event.target.files[0];
}
}

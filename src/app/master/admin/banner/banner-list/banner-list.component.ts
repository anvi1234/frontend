import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BannerService } from 'src/app/shared/banner.service';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.css']
})
export class BannerListComponent implements OnInit {
  bannerData:any = [];

  constructor(
    private router: Router,
    private bannerSer: BannerService
  ) { }

  ngOnInit(): void {
    this.getBanner()
  }

  getBanner(){
    this.bannerSer.getBanners().subscribe((res:any)=>{
      if(res.success){
      this.bannerData = res.data;
      }
     
    })
  }
  navigate(){
    this.router.navigateByUrl("admin/add-banner");
  }
  deleteBanner(id:string){
      this.bannerSer.deleteBanner(id).subscribe((res)=>{
        alert("Banner Deleted Successfully");
        this.getBanner();

      })
  }
}

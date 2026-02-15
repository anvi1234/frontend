import { Component, OnInit } from '@angular/core';
import { AstroServiceService } from 'src/app/shared/astro-service.service';

@Component({
  selector: 'app-astro-edu-list',
  templateUrl: './astro-edu-list.component.html',
  styleUrls: ['./astro-edu-list.component.css']
})
export class AstroEduListComponent implements OnInit {

  data: any = [];

  constructor(private astroSer: AstroServiceService) { }

  ngOnInit(): void {
     this.loadData();
  }

loadData(){
  this.astroSer.getEducations().subscribe((Res)=>{
    this.data = Res;
  })
}

}

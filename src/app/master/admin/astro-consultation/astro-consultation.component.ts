import { Component, OnInit } from '@angular/core';
import { AstroServiceService } from 'src/app/shared/astro-service.service';

@Component({
  selector: 'app-astro-consultation',
  templateUrl: './astro-consultation.component.html',
  styleUrls: ['./astro-consultation.component.css']
})
export class AstroListConsultationComponent implements OnInit {
  data: any = [];

  constructor(private astroSer: AstroServiceService) { }

  ngOnInit(): void {
     this.loadData();
  }

loadData(){
  this.astroSer.getConsultations().subscribe((Res)=>{
    this.data = Res;
  })
}

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sucess-page',
  templateUrl: './sucess-page.component.html',
  styleUrls: ['./sucess-page.component.css']
})
export class SucessPageComponent implements OnInit {

 orderId:any;
  amount:any;

  constructor(private router:Router, private route:ActivatedRoute) {}

  ngOnInit(): void {

    // get data from query params
    this.route.queryParams.subscribe(params=>{
      this.orderId = params['orderId'] || 'N/A';
      this.amount = params['amount'] || '0';
    })

    // optional auto redirect after 6 sec
    setTimeout(()=>{
      this.router.navigate(['/']);
    },6000)

  }

  goHome(){
    this.router.navigate(['/']);
  }
}

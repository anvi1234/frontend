import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/shared/checkout.service';
import { OderService } from 'src/app/shared/oder.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  data: any =[];
  trackingData:any;
  activities:any[]=[];
  orders:any = [];
  showTracking:boolean = false;
  steps = [
  { label: 'Order Confirmed', key: 'confirmed' },
  { label: 'AWB Generated', key: 'awb' },
  { label: 'Pickup Pending', key: 'pickup' },
  { label: 'Out for Delivery', key: 'ofd' },
  { label: 'Delivered', key: 'delivered' }
];


  constructor(
    private orderSer: OderService,
    private checkoutSer: CheckoutService
  ) { }

  ngOnInit(): void {
    this.orderSer.getOrder().subscribe((res)=>{
      this.orders = res;
    })
  }


trackOrder(id:string,order:any){
  this.showTracking = !this.showTracking
  this.checkoutSer.getTracking(id).subscribe((res)=>{
       this.trackingData = res.tracking_data;
      order.showTracking = !order.showTracking;
      order.showDetails = false;
      this.activities =
        this.trackingData.shipment_track_activities || [];
  })
}

showOrderDetails(order:any){
order.showDetails = !order.showDetails;
 order.showTracking = false
}

getCurrentStepIndex(): number {

  const status =
    this.trackingData?.shipment_track?.[0]?.current_status || '';

  if(status.includes('AWB')) return 1;
  if(status.includes('Pickup')) return 2;
  if(status.includes('Out')) return 3;
  if(status.includes('Delivered')) return 4;

  return 0; // default Order Confirmed
}

}

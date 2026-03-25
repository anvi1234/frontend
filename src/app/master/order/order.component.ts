import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { CheckoutService } from 'src/app/shared/checkout.service';
import { OderService } from 'src/app/shared/oder.service';
import { ReviewService } from 'src/app/shared/review.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  data: any =[];
  trackingData:any;
  activities:any[]=[];
  galleryImages: File[] = [];
  orders:any = [];
  showTracking:boolean = false;
  showReviewPopup = false;
selectedRating = 0;
reviewComment:any = '';
selectedItem:any;
selectedOrder:any;
reviewFile:any;
  steps = [
  { label: 'Order Confirmed', key: 'confirmed' },
  { label: 'AWB Generated', key: 'awb' },
  { label: 'Pickup Pending', key: 'pickup' },
  { label: 'Out for Delivery', key: 'ofd' },
  { label: 'Delivered', key: 'delivered' }
];
private loggedUserId = "";

  constructor(
    private orderSer: OderService,
    private checkoutSer: CheckoutService,
    private reviewSer: ReviewService,
    private authSer: AuthService
  ) { 
    this.loggedUserId = this.authSer.getUserId();
  }

  ngOnInit(): void {
  this.orderSer.getOrder().subscribe((res:any)=>{

  this.orders = res.map((order:any) => {

    order.items = order.items.map((item:any) => {

      const reviews = item.productId?.reviews || [];

      // ⭐ find logged user review
      const userReview = reviews.find((r:any) => r.userId === this.loggedUserId);

      if (userReview) {
        item.selectedRating = userReview.rating;
        item.reviewDisabled = true;
        item.hasReviewed = true;

      } else {
        item.selectedRating = 0;
        item.reviewDisabled = false;
        item.hasReviewed = false;

      }

      return item;
    });

    return order;
  });

});

  }

  getOrderId(id:string){
    const orderId = 'Order_' + id.slice(-6);
    return orderId;
  }

trackOrder(id:string,order:any){
  order.showTracking = !order.showTracking;
  order.showDetails = false;
  this.checkoutSer.getTracking(id).subscribe((res)=>{
       this.trackingData = res.tracking_data;
      order.showTracking = !order.showTracking;
      order.showDetails = false;
      this.activities =
        this.trackingData.shipment_track_activities || [];
  })
}

trackOrderInWindows(order: any) {
  const url = order.shipment.trackingUrl; // your tracking URL

  if (url) {
    window.open(url, '_blank'); // opens in new tab
  } else {
    console.error('Tracking URL not available');
  }
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


setRating(order:any,item:any, rating:number) {
  item.rating = rating;
}

openReviewPopup(order:any,item:any,rating?:number){
  this.selectedOrder = order;
  this.selectedItem = item;
  this.galleryImages = [];
  this.reviewComment ='';
  if(rating){
     this.selectedRating = rating;
  }

  this.showReviewPopup = true;
}

closeReview(){
  this.showReviewPopup = false;
}

submitReview(){
  const formData = new FormData();
formData.append('productId', this.selectedItem.productId._id);
formData.append('rating', this.selectedItem.selectedRating);
  formData.append('comment', this.reviewComment);

  if( this.galleryImages.length>0){
    this.galleryImages.forEach((file: File) => {
    formData.append('images', file);
  });   
  }

formData.forEach((value, key) => {
  console.log(key, value);
});

  this.showReviewPopup = false;
  this.reviewSer.addReview(formData).subscribe((res)=>{
    console.log("ress",res);
  })

}

onReviewImageUpload(event:Event){
 const input = event.target as HTMLInputElement;
  if (!input.files) return;
  const selectedFiles = Array.from(input.files);
  this.galleryImages.push(...selectedFiles);
}

}

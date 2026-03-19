import { Component, OnInit } from '@angular/core';
import { OderService } from 'src/app/shared/oder.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderListComponent implements OnInit {
orders: any = [];
filteredOrders: any[] = [];
searchText: string = '';

  constructor(
    private order: OderService
  ) { }

  ngOnInit(): void {
    this.order.getAllOrder().subscribe((res)=>{
       this.orders = res;
           this.filteredOrders = [...this.orders];
    })
  }
applyFilter() {
  const search = this.searchText.toLowerCase();

 try {
   if (!search) {
    this.filteredOrders = [...this.orders];
    return;
  }

  this.filteredOrders = this.orders.filter((order: any) => {
    const orderId = order._id?.toLowerCase() || '';
    const customerName = order.address?.name?.toLowerCase() || '';
    const phone = String(order.address?.phone) || '';
    const city = order.address?.city?.toLowerCase() || '';
    const state = order.address?.state?.toLowerCase() || '';
    const paymentMode = order.paymentMode?.toLowerCase() || '';
    const paymentStatus = order.paymentStatus?.toLowerCase() || '';
    const orderStatus = order.orderStatus?.toLowerCase() || '';
    const totalAmount = String(order.totalAmount || '').toLowerCase();

    const itemMatch = order.items?.some((item: any) => {
      const itemName = item.name?.toLowerCase() || '';
      const feature = item.feature?.toLowerCase() || '';
      const variantSize = item.variantSize?.toLowerCase() || '';
      const variantType = item.variantType?.toLowerCase() || '';
      return (
        itemName.includes(search) ||
        feature.includes(search) ||
        variantSize.includes(search) ||
        variantType.includes(search)
      );
    });

    return (
      orderId.includes(search) ||
      customerName.includes(search) ||
      phone.includes(search) ||
      city.includes(search) ||
      state.includes(search) ||
      paymentMode.includes(search) ||
      paymentStatus.includes(search) ||
      orderStatus.includes(search) ||
      totalAmount.includes(search) ||
      itemMatch
    );
  });
 } catch (error) {
  console.log("error", error)
 }
  console.log('filteredOrders after filter', this.filteredOrders);
}
}

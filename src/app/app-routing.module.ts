import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './master/home/home.component';
import { AboutComponent } from './master/about/about.component';
import { AdminComponent } from './master/admin/admin.component';
import { ProductComponent } from './master/admin/product/product.component';
import { CategoryListComponent } from './master/admin/category/category-list/category-list.component';
import { CategoryComponent } from './master/admin/category/category.component';
import { ProoductAddEditComponent } from './master/admin/product/prooduct-add-edit/prooduct-add-edit.component';
import { ProductDetailComponent } from './master/product-detail/product-detail.component';
import { AddToCartComponent } from './master/add-to-cart/add-to-cart.component';
import { ProductFilterComponent } from './master/product-filter/product-filter.component';
import { CheckoutComponent } from './master/checkout/checkout.component';
import { AstroConsultationComponent } from './master/astro-consultation/astro-consultation.component';
import { AstroEducationComponent } from './master/astro-education/astro-education.component';
import { AstroEduListComponent } from './master/admin/astro-edu-list/astro-edu-list.component';
import { AstroListConsultationComponent } from './master/admin/astro-consultation/astro-consultation.component';
import { OrderComponent } from './master/order/order.component';
import { ShippingpolicyComponent } from './master/shippingpolicy/shippingpolicy.component';
import { PrivacyandpolicyComponent } from './master/privacyandpolicy/privacyandpolicy.component';
import { ReturnPolicyComponent } from './master/return-policy/return-policy.component';
import { TermofserviceComponent } from './master/termofservice/termofservice.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'product', component: ProductComponent },
  { path: 'add-product', component: ProoductAddEditComponent },
  { path: 'add-product/:id', component: ProoductAddEditComponent },
  { path: 'category', component: CategoryListComponent },
  { path: 'add-category', component: CategoryComponent },
  { path: 'add-category/:id', component: CategoryComponent },
  { path: 'add-to-cart', component: AddToCartComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'product-list', component: ProductFilterComponent },
  { path: 'product/:slug', component: ProductFilterComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'astro-consultation', component: AstroConsultationComponent },
   { path: 'astro-education', component: AstroEducationComponent },
    { path: 'astro-consultation-list', component: AstroListConsultationComponent },
  { path: 'astro-education-list', component: AstroEduListComponent },
   { path: 'order-list', component: OrderComponent },
     { path: 'shipping-policy', component: ShippingpolicyComponent },
      { path: 'privacy-policy', component: PrivacyandpolicyComponent },
       { path: 'refund-policy', component: ReturnPolicyComponent },
        { path: 'termofService', component: TermofserviceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

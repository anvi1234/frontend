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
import { AdminGuard } from 'guard/admin.guard';
import { BannerAddEditComponent } from './master/admin/banner/banner-add-edit/banner-add-edit.component';
import { BannerListComponent } from './master/admin/banner/banner-list/banner-list.component';
import { SucessPageComponent } from './master/sucess-page/sucess-page.component';
import { OrderListComponent } from './master/admin/order/order.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'add-to-cart', component: AddToCartComponent },
  { path: 'product-detail/:slugName', component: ProductDetailComponent },
  { path: 'product-list', component: ProductFilterComponent },
  { path: 'product/:slug', component: ProductFilterComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'astro-consultation', component: AstroConsultationComponent },
  { path: 'astro-education', component: AstroEducationComponent },
  { path: 'order-list', component: OrderComponent },
  { path: 'shipping-policy', component: ShippingpolicyComponent },
  { path: 'privacy-policy', component: PrivacyandpolicyComponent },
  { path: 'refund-policy', component: ReturnPolicyComponent },
  { path: 'termofService', component: TermofserviceComponent },
   {path:'payment-success',
  component: SucessPageComponent},
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'products',
        component: ProductComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'categories',
        component: CategoryListComponent,
        canActivate: [AdminGuard],
      },
       {
        path: 'order-list',
        component: OrderListComponent,
        canActivate: [AdminGuard],
      },
      
      {
        path: 'add-product',
        component: ProoductAddEditComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'add-product/:id',
        component: ProoductAddEditComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'add-category',
        component: CategoryComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'add-category/:id',
        component: CategoryComponent,
        canActivate: [AdminGuard],
      },
        {
        path: 'add-banner',
        component: BannerAddEditComponent,
        canActivate: [AdminGuard],
      },
        {
        path: 'banner-list',
        component: BannerListComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'astro-consultation-list',
        component: AstroListConsultationComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'astro-education-list',
        component: AstroEduListComponent,
        canActivate: [AdminGuard],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

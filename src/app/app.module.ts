import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './master/header/header.component';
import { HomeComponent } from './master/home/home.component';
import { AboutComponent } from './master/about/about.component';
import { AdminComponent } from './master/admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminService } from './shared/admin.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './master/admin/product/product.component';
import { ProoductAddEditComponent } from './master/admin/product/prooduct-add-edit/prooduct-add-edit.component';
import { CategoryComponent } from './master/admin/category/category.component';
import { CategoryListComponent } from './master/admin/category/category-list/category-list.component';
import { ErrorWidgetComponent } from './master/admin/error-widget/error-widget.component';
import { ProductServiceService } from './shared/product-service.service';
import { ProductDetailComponent } from './master/product-detail/product-detail.component';
import { QuillModule } from 'ngx-quill';
import { AddToCartComponent } from './master/add-to-cart/add-to-cart.component';
import { ProductFilterComponent } from './master/product-filter/product-filter.component';
import { CheckoutComponent } from './master/checkout/checkout.component';
import { AuthComponent } from './master/auth/auth.component';
import { AstroConsultationComponent } from './master/astro-consultation/astro-consultation.component';
import { AstroEducationComponent } from './master/astro-education/astro-education.component';
import { AstroEduListComponent } from './master/admin/astro-edu-list/astro-edu-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AstroListConsultationComponent } from './master/admin/astro-consultation/astro-consultation.component';
import { OrderComponent } from './master/order/order.component';
import { AuthInterceptor } from 'src/interceptor/auth.interceptor';
import { ReturnPolicyComponent } from './master/return-policy/return-policy.component';
import { PrivacyandpolicyComponent } from './master/privacyandpolicy/privacyandpolicy.component';
import { TermofserviceComponent } from './master/termofservice/termofservice.component';
import { ShippingpolicyComponent } from './master/shippingpolicy/shippingpolicy.component';
import { FooterComponent } from './master/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    AdminComponent,
    ProductComponent,
    ProoductAddEditComponent,
    CategoryComponent,
    CategoryListComponent,
    ErrorWidgetComponent,
    ProductDetailComponent,
    AddToCartComponent,
    ProductFilterComponent,
    CheckoutComponent,
    AuthComponent,
    AstroConsultationComponent,
    AstroEducationComponent,
    AstroEduListComponent,
    AstroListConsultationComponent,
    OrderComponent,
    ReturnPolicyComponent,
    PrivacyandpolicyComponent,
    TermofserviceComponent,
    ShippingpolicyComponent,
    FooterComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
     QuillModule,
    NgbModule
  ],
  exports:[ErrorWidgetComponent,  AuthComponent],
  providers: [ {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },AdminService, ProductServiceService],
  bootstrap: [AppComponent],

})
export class AppModule { }

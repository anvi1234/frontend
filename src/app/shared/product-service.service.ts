import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  public  Environmnet = environment.apiBaseUrl

  constructor(
    private http: HttpClient
  ) { }

 public createProduct(formData: FormData) {
  return this.http.post(
    `${this.Environmnet}/products/create-product`,
    formData
  );
}

public getProduct(){
  return this.http.get(`${this.Environmnet}/products/`);
}

 public getProductById(id: string) {
    return this.http.get<any>(`${this.Environmnet}/products/getProductById/${id}`);
  }
 public updateProduct(payload:any,id: string) {
    return this.http.put<any>(`${this.Environmnet}/products/updateProduct/${id}`,payload);
  }
 public delProduct(id: string) {
    return this.http.delete<any>(`${this.Environmnet}/products/delProductById/${id}`);
  }

   public getProductBySlug(slugName: string) {
    return this.http.get<any>(`${this.Environmnet}/products/getProduct/${slugName}`);
  }
    public getProductByMultipleSlug(slugName: string) {
    return this.http.get<any>(`${this.Environmnet}/products/multiplecategory/${slugName}`);
  }
  getProudctBySlugName(slugName: string){
 return this.http.get<any>(`${this.Environmnet}/products/getProductBySlug/${slugName}`);
  }
}

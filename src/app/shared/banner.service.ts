import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
   private API_URL = `${environment.apiBaseUrl}/banner`;

  constructor(private http: HttpClient) { }
   getBanners(){
    return this.http.get(this.API_URL);
  }

  addBanner(data:any){
    return this.http.post(this.API_URL,data);
  }

  updateBanner(id:any,data:any){
    return this.http.put(`${this.API_URL}/${id}`,data);
  }

  deleteBanner(id:any){
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}

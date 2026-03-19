import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
API =  `${environment.apiBaseUrl}/reviews`;
  constructor(
       private http: HttpClient,
  ) { }

 public addReview(formData: FormData) {
  return this.http.post(
    `${this.API}/`,
    formData
  );
}
}




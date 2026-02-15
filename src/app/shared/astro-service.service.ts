import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AstroServiceService {
private baseUrl =  `${environment.apiBaseUrl}/astro`;

// services/astro.service.ts

  constructor(private http: HttpClient) {}





  addConsultation(data: any) {
    return this.http.post(`${this.baseUrl}/consultation`, data);
  }

  getConsultations() {
    return this.http.get(`${this.baseUrl}/consultation`);
  }

  addEducation(data: any) {
    return this.http.post(`${this.baseUrl}/education`, data);
  }

  getEducations() {
    return this.http.get(`${this.baseUrl}/education`);
  }
}


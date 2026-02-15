import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Category {
  _id?: string;
  name: string;
  slug?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private API_URL = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL);
  }

  createCategory(payload: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.API_URL, payload);
  }

  updateCategory(id: string, payload: Partial<Category>): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, payload);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  toggleCategory(id: string): Observable<Category> {
    return this.http.patch<Category>(`${this.API_URL}/toggle/${id}`, {});
  }


    getCategoryById(id:string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/getCategoryByID/${id}`);
  }
}

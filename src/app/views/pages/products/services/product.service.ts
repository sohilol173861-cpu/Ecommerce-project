import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _HttpClient: HttpClient) {}

  getProduct(page = 1, limit = 20): Observable<any[]> {
    return this._HttpClient.get<any>(`${environment.api}products?page=${page}&limit=${limit}`).pipe(
      map((res: any) => res?.data || res || [])
    );
  }

  getSingleProduct(id: string): Observable<any> {
    return this._HttpClient.get<any>(`${environment.api}products/${id}`).pipe(
      map((res: any) => res?.data || res)
    );
  }

  getProductsByCategory(categoryId: string, page = 1, limit = 20): Observable<any[]> {
    return this._HttpClient.get<any>(`${environment.api}products?category=${categoryId}&page=${page}&limit=${limit}`).pipe(
      map((res: any) => res?.data || res || [])
    );
  }

  getCategories(): Observable<any[]> {
    return this._HttpClient.get<any>(`${environment.api}categories`).pipe(
      map((res: any) => res?.data || res || [])
    );
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Brand {
  id: string;
  name: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) {}

  getBrands(): Observable<Brand[]> {
    return this.http.get<any>(`${environment.api}brands`).pipe(
      map((res: any) => {
        const arr = res?.data || res || [];
        return arr.map((b: any) => ({ id: b._id || b.id, name: b.name, image: b.image }));
      })
    );
  }

  getProductsByBrand(brandId: string, page = 1, limit = 20): Observable<any[]> {
    return this.http.get<any>(`${environment.api}products?brand=${brandId}&page=${page}&limit=${limit}`).pipe(
      map((res: any) => res?.data || res || [])
    );
  }
}

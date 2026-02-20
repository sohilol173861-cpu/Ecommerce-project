import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

export interface OrderItem {
  productId?: string;
  title?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

export interface Order {
  id?: string;
  _id?: string;
  date?: string;
  createdAt?: string;
  status?: string;
  total?: number;
  totalOrderPrice?: number;
  items?: OrderItem[];
  paymentMethod?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private _user: UserService
  ) {}

  getOrders(): Observable<Order[]> {
    return this._user.getUser().pipe(
      switchMap((user) => {
        const userId = user?._id || user?.id;
        return this.http.get<any>(`${environment.api}orders/user/${userId}`);
      }),
      map((res: any) => {
        const data = res?.data || res;
        return Array.isArray(data) ? data : (data?.orders || []);
      })
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<any>(`${environment.api}orders/${id}`).pipe(
      map((res: any) => res?.data || res)
    );
  }

  createOrder(cartId: string, shippingAddress: any, paymentMethod: string): Observable<any> {
    return this.http.post<any>(`${environment.api}orders/checkout-session/${cartId}`, {
      shippingAddress,
      paymentMethod
    });
  }

  createOrderCash(cartId: string, shippingAddress: any): Observable<any> {
    return this.http.post<any>(`${environment.api}orders`, {
      cartId,
      shippingAddress
    }).pipe(
      map((res: any) => res?.data || res)
    );
  }
}

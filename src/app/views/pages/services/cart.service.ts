import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Cart, CartItem } from '../models/cart';
import { AuthService } from '../auth/services/auth.service';
import { environment } from 'src/environments/environment';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private emptyCart: Cart = { items: [] };
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.emptyCart);
  /** Route API: cart id for checkout (when logged in) */
  currentCartId: string | null = null;

  constructor(
    private http: HttpClient,
    private _auth: AuthService
  ) {}

  initCartLocalStorage(): void {
    if (this._auth.loggedIn()) {
      this.getCartFromApi().subscribe();
      return;
    }
    try {
      const cart = this.getCartLocal();
      if (cart?.items) this.cart$.next(cart);
    } catch {
      localStorage.setItem(CART_KEY, JSON.stringify(this.emptyCart));
    }
  }

  getCartLocal(): Cart {
    const s = localStorage.getItem(CART_KEY);
    if (!s) return this.emptyCart;
    try {
      return JSON.parse(s) || this.emptyCart;
    } catch {
      return this.emptyCart;
    }
  }

  clearCart(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.emptyCart));
    this.cart$.next(this.emptyCart);
  }

  getCart(): Cart {
    if (this._auth.loggedIn()) {
      this.getCartFromApi().subscribe();
      return this.cart$.getValue();
    }
    return this.getCartLocal();
  }

  getCartFromApi() {
    return this.http.get<any>(`${environment.api}cart`).pipe(
      map((res: any) => {
        const data = res?.data || res;
        this.currentCartId = data?._id || null;
        const products = data?.products || [];
        const items: CartItem[] = products.map((p: any) => ({
          _id: p._id,
          product: p.product || p,
          quantity: p.count ?? p.quantity ?? 1
        }));
        const cart: Cart = { items };
        this.cart$.next(cart);
        return cart;
      }),
      catchError(() => {
        this.currentCartId = null;
        return of(this.emptyCart);
      })
    );
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart | void {
    const productId = cartItem.product?._id || cartItem.product?.id;
    if (!productId) return;

    if (this._auth.loggedIn()) {
      if (updateCartItem && cartItem._id != null) {
        this.http.put<any>(`${environment.api}cart/${cartItem._id}`, { count: cartItem.quantity }).pipe(
          tap(() => this.getCartFromApi().subscribe())
        ).subscribe();
      } else {
        this.http.post<any>(`${environment.api}cart`, { productId }).pipe(
          tap(() => this.getCartFromApi().subscribe())
        ).subscribe();
      }
      return;
    }

    const cart = this.getCartLocal();
    const id = productId;
    const exist = cart.items?.find((item) => (item.product?._id || item.product?.id) === id);
    if (exist) {
      cart.items = cart.items?.map((item) => {
        const pid = item.product?._id || item.product?.id;
        if (pid === id) {
          item.quantity = updateCartItem ? (cartItem.quantity ?? 1) : (item.quantity! + (cartItem.quantity ?? 1));
        }
        return item;
      }) || [];
    } else {
      cart.items = cart.items || [];
      cart.items.push({ product: cartItem.product, quantity: cartItem.quantity ?? 1 });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productIdOrItemId: string): void {
    if (this._auth.loggedIn()) {
      const cart = this.cart$.getValue();
      const item = cart.items?.find((i) => i._id === productIdOrItemId || (i.product?._id || i.product?.id) === productIdOrItemId);
      const id = item?._id || productIdOrItemId;
      this.http.delete<any>(`${environment.api}cart/${id}`).pipe(
        tap(() => this.getCartFromApi().subscribe())
      ).subscribe();
      return;
    }

    const cart = this.getCartLocal();
    cart.items = cart.items?.filter((item) => (item.product?._id || item.product?.id) !== productIdOrItemId) || [];
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.cart$.next(cart);
  }
}

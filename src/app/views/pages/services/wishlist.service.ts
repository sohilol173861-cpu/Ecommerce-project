import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem, CartItemDetailed } from '../models/cart';
import { WishList } from '../models/wishlist';

export const WISHLIST_KEY = 'wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishList$: BehaviorSubject<WishList> = new BehaviorSubject(this.getWishlist());

  constructor() {}

  initWishlistLocalStorage() {
    const Wishlist: WishList = this.getWishlist();
    if (!Wishlist) {
      const wishListCart = {
        items: []
      };
      const wishListCartJson = JSON.stringify(wishListCart);
      localStorage.setItem(WISHLIST_KEY, wishListCartJson);
    }
  }

  emptyCart() {
    const wishListCart = {
      items: []
    };
    const wishListCartJson = JSON.stringify(wishListCart);
    localStorage.setItem(WISHLIST_KEY, wishListCartJson);
    this.wishList$.next(wishListCart);
  }

  getWishlist(): WishList {
    const s = localStorage.getItem(WISHLIST_KEY);
    if (!s) return { items: [] };
    try {
      return JSON.parse(s) || { items: [] };
    } catch {
      return { items: [] };
    }
  }

  setWishItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const WishList = this.getWishlist();
    const id = cartItem.product?._id || cartItem.product?.id;
    const cartItemExist = WishList.items?.find((item) => (item.product?._id || item.product?.id) === id);
    if (cartItemExist) {
      WishList.items?.map((item) => {
        if ((item.product?._id || item.product?.id) === id) {
          // if (updateCartItem) {
          //   item.quantity = cartItem.quantity;
          // } else {
          //   item.quantity = item.quantity! + cartItem.quantity!;
          // }

          // return item;
        }
      });
    } else {
      WishList.items?.push(cartItem);
    }

    const cartJson = JSON.stringify(WishList);
    localStorage.setItem(WISHLIST_KEY, cartJson);
    this.wishList$.next(WishList);
    return WishList;
  }

  deleteWishItem(productId: string) {
    const WishList = this.getWishlist();
    const newWishList = WishList.items?.filter((item) => (item.product?._id || item.product?.id) !== productId);

    WishList.items = newWishList;

    const wishListJsonString = JSON.stringify(WishList);
    localStorage.setItem(WISHLIST_KEY, wishListJsonString);

    this.wishList$.next(WishList);
  }
}

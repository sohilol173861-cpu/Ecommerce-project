import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartItem } from '../../models/cart';
import { WishItem } from '../../models/wishlist';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  products: any[] = [];
  category: any = null;
  categoryId: string | null = null;
  loading = false;
  WishItems: WishItem[] = [];
  limit = 20;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _cartService: CartService,
    private _wishlistService: WishlistService,
    private _toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryId = params['id'] || null;
      this.products = [];
      this.loadCategoryAndProducts();
    });
    this._wishlistService.wishList$.subscribe((cart) => {
      this.WishItems = cart.items || [];
    });
  }

  loadCategoryAndProducts(): void {
    if (!this.categoryId) return;
    this.loading = true;
    this._productService.getCategories().subscribe({
      next: (cats) => {
        this.category = (cats || []).find((c: any) => (c._id || c.id) === this.categoryId) || { name: 'Category' };
      }
    });
    this._productService.getProductsByCategory(this.categoryId, 1, this.limit).subscribe({
      next: (data) => {
        this.products = data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onScroll(): void {
    if (!this.categoryId || this.loading) return;
    const nextPage = Math.floor(this.products.length / 20) + 2;
    this._productService.getProductsByCategory(this.categoryId, nextPage, 20).subscribe({
      next: (data) => {
        const list = data || [];
        if (list.length) this.products = [...this.products, ...list];
      }
    });
  }

  addProductToCart(item: any): void {
    const cartItem: CartItem = { product: item, quantity: 1 };
    this._cartService.setCartItem(cartItem);
    this._toast.success('Product added to cart', { position: 'top-left' });
  }

  addProductToWishList(item: any, event: any): void {
    const wishItem: WishItem = { product: item };
    const id = item?._id || item?.id;
    if (event.currentTarget.classList.contains('is-favourite')) {
      event.currentTarget.classList.remove('is-favourite');
      this._wishlistService.deleteWishItem(id);
      this._toast.error('Removed from wishlist', { position: 'top-left' });
    } else {
      event.currentTarget.classList.add('is-favourite');
      this._wishlistService.setWishItem(wishItem);
      this._toast.success('Added to wishlist', { position: 'top-left' });
    }
  }

  productInWishList(product: any): boolean {
    const id = product?._id || product?.id;
    return this.WishItems.some((item) => (item.product?._id || item.product?.id) === id);
  }
}

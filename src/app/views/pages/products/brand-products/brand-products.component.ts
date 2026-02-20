import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrandService, Brand } from '../services/brand.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { WishItem } from '../../models/wishlist';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-brand-products',
  templateUrl: './brand-products.component.html',
  styleUrls: ['./brand-products.component.css']
})
export class BrandProductsComponent implements OnInit {
  products: any[] = [];
  brand: Brand | null = null;
  brandId: number | null = null;
  loading = false;
  WishItems: WishItem[] = [];
  limit = 20;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(
    private route: ActivatedRoute,
    private _brandService: BrandService,
    private _wishlistService: WishlistService,
    private _toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.brandId = +params['id'];
      this.products = [];
      this.loadBrandAndProducts();
    });
    this._wishlistService.wishList$.subscribe((cart) => {
      this.WishItems = cart.items || [];
    });
  }

  loadBrandAndProducts(): void {
    if (!this.brandId) return;
    this.loading = true;
    this._brandService.getBrands().subscribe({
      next: (list) => {
        this.brand = (list || []).find((b) => b.id === this.brandId) || null;
      }
    });
    this._brandService.getProductsByBrand(this.brandId, 0, this.limit).subscribe({
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
    if (!this.brandId || this.loading) return;
    const offset = this.products.length;
    this._brandService.getProductsByBrand(this.brandId, offset, 20).subscribe({
      next: (data) => {
        const list = data || [];
        if (list.length) {
          this.products = [...this.products, ...list];
        }
      }
    });
  }
}

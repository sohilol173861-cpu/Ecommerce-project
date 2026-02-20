import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = false;

  constructor(
    private _productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this._productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToCategory(id: string | number): void {
    this.router.navigate(['/products/category', id]);
  }
}

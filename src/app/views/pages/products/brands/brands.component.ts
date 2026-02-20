import { Component, OnInit } from '@angular/core';
import { BrandService, Brand } from '../services/brand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  loading = false;

  constructor(
    private _brandService: BrandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading = true;
    this._brandService.getBrands().subscribe({
      next: (data) => {
        this.brands = data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToBrand(id: number): void {
    this.router.navigate(['/products/brand', id]);
  }
}

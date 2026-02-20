import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule } from '@angular/forms';

import { AllProductsComponent } from './all-products/all-products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsComponent } from './products.component';
import { FilterPipe } from './pipe/filter.pipe';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryProductsComponent } from './category-products/category-products.component';
import { BrandsComponent } from './brands/brands.component';
import { BrandProductsComponent } from './brand-products/brand-products.component';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProductComponent } from './product/product.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      { path: '', component: AllProductsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'category/:id', component: CategoryProductsComponent },
      { path: 'brands', component: BrandsComponent },
      { path: 'brand/:id', component: BrandProductsComponent },
      { path: ':id', component: ProductDetailsComponent },
    ],
  },
];
@NgModule({
  declarations: [
    AllProductsComponent,
    ProductsComponent,
    ProductDetailsComponent,
    FilterPipe,
    ProductComponent,
    CategoriesComponent,
    CategoryProductsComponent,
    BrandsComponent,
    BrandProductsComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxSkeletonLoaderModule,
    InfiniteScrollModule
  ]
})

export class ProductsModule {
}

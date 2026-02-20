import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user.component';
import { ProfileComponent } from './profile/profile.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrdersComponent } from './orders/orders.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from '../../shared/shared.module';
const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ],
  },
];

@NgModule({
  declarations: [
    UserComponent,
    ProfileComponent,
    WishlistComponent,
    OrdersComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class UserModule { }

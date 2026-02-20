import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-complete',
  templateUrl: './checkout-complete.component.html',
  styleUrls: ['./checkout-complete.component.css']
})
export class CheckoutCompleteComponent implements OnInit {

  totalPrice!: number;
  today: number = Date.now();
  paymentMethod = '';

  constructor(
    private router: Router,
    private _cartService: CartService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    if (state && state.paymentMethod) {
      this.paymentMethod = state.paymentMethod;
    }
    this.getTotalPrice();
  }

  navigateToStore() {
    this.router.navigate(['/'])
  }

  getTotalPrice() {
    this._cartService.cart$.subscribe((cart) => {
      this.totalPrice = 0;
      if (cart && cart.items) {
        cart.items.forEach((item) => {
          this.totalPrice += (item.product?.price || 0) * (item.quantity || 1);
        });
      }
    });
  }

}

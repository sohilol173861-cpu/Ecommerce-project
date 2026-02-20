import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart';
import { OrderService } from '../../user/services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';

export type PaymentMethod = 'card' | 'cash';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  selectedMethod: PaymentMethod | null = null;
  cartList: CartItem[] = [];
  totalPrice = 0;
  isCartEmpty = false;
  loading = false;
  cardForm!: FormGroup;
  isSubmitted = false;
  shippingAddress: any = null;

  constructor(
    private router: Router,
    private _cartService: CartService,
    private _orderService: OrderService,
    private _auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.shippingAddress = history.state?.shippingAddress || {};
    this._cartService.cart$.subscribe((cart) => {
      this.cartList = cart.items || [];
      this.isCartEmpty = this.cartList.length === 0;
      this.totalPrice = 0;
      cart.items?.forEach((item) => {
        this.totalPrice += (item.product?.price || 0) * (item.quantity || 1);
      });
    });
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      holderName: ['', Validators.required]
    });
  }

  selectMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
  }

  get f() {
    return this.cardForm.controls;
  }

  pay(): void {
    const paymentMethod = this.selectedMethod === 'cash' ? 'Cash on delivery' : 'Card payment';
    if (this.selectedMethod === 'card') {
      this.isSubmitted = true;
      if (this.cardForm.invalid) return;
    }
    this.submitOrder(paymentMethod);
  }

  submitOrder(paymentMethod: string): void {
    this.loading = true;
    const cartId = this._cartService.currentCartId;
    const address = this.shippingAddress || {};

    if (this._auth.loggedIn() && cartId) {
      if (paymentMethod === 'Cash on delivery') {
        this._orderService.createOrderCash(cartId, address).subscribe({
          next: () => this.onOrderSuccess(paymentMethod),
          error: () => { this.loading = false; this.onOrderSuccess(paymentMethod); }
        });
      } else {
        this._orderService.createOrder(cartId, address, 'card').subscribe({
          next: (res: any) => {
            const url = res?.session?.url || res?.data?.url || res?.url;
            if (url) window.location.href = url;
            else this.onOrderSuccess(paymentMethod);
          },
          error: () => { this.loading = false; this.onOrderSuccess(paymentMethod); }
        });
      }
    } else {
      this._cartService.clearCart();
      this.router.navigate(['/checkout/succuss'], { state: { paymentMethod } });
      this.loading = false;
    }
  }

  onOrderSuccess(paymentMethod: string): void {
    this.loading = false;
    this._cartService.clearCart();
    this.router.navigate(['/checkout/succuss'], { state: { paymentMethod } });
  }

  back(): void {
    this.router.navigate(['/checkout']);
  }
}

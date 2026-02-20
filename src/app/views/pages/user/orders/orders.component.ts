import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from '../services/order.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private _orderService: OrderService,
    private _toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this._orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.orders = [];
        this.errorMessage = err?.error?.message || 'Failed to load orders.';
        this._toast.error(this.errorMessage, { position: 'top-center' });
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'secondary';
    const s = (status || '').toLowerCase();
    if (s.includes('delivered') || s.includes('completed')) return 'success';
    if (s.includes('pending') || s.includes('processing')) return 'warning';
    if (s.includes('cancelled')) return 'danger';
    return 'secondary';
  }
}

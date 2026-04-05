import { Component } from '@angular/core';
import { CartService } from '../../../services/api/cart';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GetOrderGameResponse } from '../../../models/response/get_orders_res';
import { PromoService } from '../../../services/api/promo';
import { GetPromoResponse } from '../../../models/response/get_promo_res';

@Component({
  selector: 'app-shopping-cart',
  imports: [FormsModule, CommonModule],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.scss'
})
export class ShoppingCart {
  cartItems: any[] = [];
  couponCode: string = '';
  coupons: Record<string, number> = {}; // { 'GAME20': 0.9 }

  constructor(
    private cartService: CartService,
    private promoService: PromoService,
    private router: Router
  ) { }

  async ngOnInit() {
    // โหลดรถเข็น
    this.cartService.cart$.subscribe(items => this.cartItems = items);

    // โหลดคูปองจาก DB
    try {
      const promos: GetPromoResponse[] = await this.promoService.getAllPromos();
      promos
        .filter(p => p.is_active === 1)
        .forEach(p => {
          const percent = Number(p.discount_percent);
          this.coupons[p.code.toUpperCase()] = percent / 100;
        });

    } catch (err) {
      console.error('โหลดคูปองไม่สำเร็จ', err);
    }
  }

  get totalPrice(): number {
    return this.cartItems.reduce((sum, g) => sum + Number(g.price || 0), 0);
  }

  //คำนวณลดราคา
  get discountedPrice(): number {
    const code = this.couponCode.trim().toUpperCase();
    let discount = this.coupons[code];

    if (discount === undefined) discount = 0;
    // คำนวณราคา
    const price = this.totalPrice * (1 - discount);

    // กันไม่ให้ติดลบ
    return Math.max(0, Number(price.toFixed(2)));
  }


  removeItem(id: number) {
    this.cartService.removeItem(id);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  async checkout() {
    if (this.cartItems.length === 0) {
      alert('กรุณาเลือกเกมก่อนชำระเงิน');
      return;
    }

    try {
      const res: GetOrderGameResponse = await this.cartService.checkout(
        this.cartItems.map(g => g.id),
        this.couponCode
      );

      if (res.success) {
        alert(`ชำระเงินสำเร็จ!\nOrder ID: ${res.order_id}\nยอดเงินคงเหลือ: ${res.remaining_balance} บาท`);
        this.clearCart();
        this.couponCode = '';
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.error?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  }
}

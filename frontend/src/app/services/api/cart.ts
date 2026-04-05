import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { GetGameResponse } from '../../models/response/get_game_res';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../config/constants';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<GetGameResponse[]>([]);
  cart$ = this.cartItems.asObservable();

  constructor(
    private constants: Constants,
    private http: HttpClient
  ) { }

  /**  ตรวจสอบ Token */
  getValidToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนใช้งานรถเข็น');
      return null;
    }
    return token;
  }

  /**  ดึงรายการเกมในรถเข็น */
  get items() {
    return this.cartItems.value;
  }

  /**  เพิ่มเกมลงรถเข็น (มีเช็ค token) */
  addToCart(game: GetGameResponse) {
    const token = this.getValidToken();
    if (!token) return;

    const current = this.cartItems.value;
    if (!current.find(g => g.id === game.id)) {
      this.cartItems.next([...current, game]);
      alert(`เพิ่ม "${game.name}" เข้ารถเข็นแล้ว`);
    } else {
      alert(`"${game.name}" อยู่ในรถเข็นแล้ว`);
    }
  }

  /** ลบเกมออกจากรถเข็น */
  removeItem(id: number) {
    const token = this.getValidToken();
    console.log('Token:', token);
    if (!token) return;
    this.cartItems.next(this.items.filter(g => Number(g.id) !== Number(id)));
    console.log('ลบเกม id:', id, 'ใน cart:', this.items);


  }

  /**  ล้างรถเข็นทั้งหมด */
  clearCart() {
    const token = this.getValidToken();
    if (!token) return;
    this.cartItems.next([]);
  }

  /** สร้างคำสั่งซื้อ (checkout) */
  async checkout(games: number[], promo_code?: string) {
    const token = this.getValidToken();
    if (!token) return;

    const url = `${this.constants.API_ENDPOINT}/order`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      games,
      promo_code: promo_code || null
    };

    try {
      const response: any = await lastValueFrom(
        this.http.post(url, body, { headers })
      );
      return response;
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการ Checkout:', error);
      throw error;
    }
  }
}

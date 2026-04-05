import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { GetPromoResponse } from '../../models/response/get_promo_res';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  constructor(
    private http: HttpClient,
    private constants: Constants
  ) { }

  public async createPromo(promoData: any): Promise<GetPromoResponse> {
    const url = this.constants.API_ENDPOINT + '/admin/promo';


    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await lastValueFrom(
        this.http.post<GetPromoResponse>(url, promoData, { headers })
      );
      return response;
    } catch (error) {
      console.error('สร้างโค้ดส่วนลดไม่สำเร็จ:', error);
      throw error;
    }
  }

  // ดึงโปรโมทั้งหมด
  public async getAllPromos(): Promise<GetPromoResponse[]> {
    const url = this.constants.API_ENDPOINT + '/promo';
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await lastValueFrom(
        this.http.get<GetPromoResponse[]>(url, { headers })
      );
      return response;
    } catch (error) {
      console.error('ดึงโปรโมไม่สำเร็จ:', error);
      throw error;
    }
  }

  // แก้ไขโปรโมชั่น
  public async updatePromo(id: number, promoData: any): Promise<GetPromoResponse> {
    const url = `${this.constants.API_ENDPOINT}/admin/promo/${id}`;
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await lastValueFrom(
        this.http.put<GetPromoResponse>(url, promoData, { headers })
      );
      return response;
    } catch (err) {
      console.error('แก้ไขโปรโมไม่สำเร็จ', err);
      throw err;
    }
  }

  // ใน PromoService
  public async deletePromo(id: number): Promise<void> {
    const url = `${this.constants.API_ENDPOINT}/admin/promo/${id}`;
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    try {
      await lastValueFrom(this.http.delete<void>(url, { headers }));
    } catch (err) {
      console.error('ลบโปรโมไม่สำเร็จ', err);
      throw err;
    }
  }

}

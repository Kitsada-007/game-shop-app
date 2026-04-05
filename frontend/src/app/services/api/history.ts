import { Injectable } from '@angular/core';
import { GetTransactionsWalletResponse } from '../../models/response/get_transactions_res';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  constructor(private constants: Constants, private http: HttpClient) { }

  // ดึงข้อมูลประวัติ
  public async getHistory(): Promise<GetTransactionsWalletResponse[]> {
    const url = `${this.constants.API_ENDPOINT}/user/transactions`;
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    try {
      const response = await lastValueFrom(
        this.http.get<GetTransactionsWalletResponse[]>(url, { headers })
      );
      return response;
    } catch (error) {
      console.error('โหลดข้อมูลประวัติไม่สำเร็จ:', error);
      throw error;
    }
  }

  // ดึงข้อมูลประวัติของแต่ละคน
  public async getHistoryById(id: string) : Promise<GetTransactionsWalletResponse[]>{
   const url = `${this.constants.API_ENDPOINT}/admin/transactions/${id}`;
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    try {
      const response = await lastValueFrom(
        this.http.get<GetTransactionsWalletResponse[]>(url, { headers })
      );
      return response;
    } catch (error) {
      console.error('โหลดข้อมูลประวัติไม่สำเร็จ:', error);
      throw error;
    }
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GetWalletRequest } from '../../models/request/get_wallet_req';
import { GetWalletResponse } from '../../models/response/get_wallet_res';
import { Constants } from '../../config/constants';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private baseUrl: string;

  constructor(private http: HttpClient, private constants: Constants) {
    this.baseUrl = this.constants.API_ENDPOINT + '/user/wallet';
  }

  // เติมเงิน
  public async topUp(data: GetWalletRequest): Promise<GetWalletResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const response = await lastValueFrom(
      this.http.post<GetWalletResponse>(`${this.baseUrl}/topup`, data, { headers })
    );
    return response;
  }
}

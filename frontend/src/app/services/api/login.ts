import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';

import { lastValueFrom } from 'rxjs';
import { GetLoginRequest } from '../../models/request/get_login_req';
import { GetLoginResponse } from '../../models/response/get_login_res';

@Injectable({
  providedIn: 'root'
})
export class LoginService { 
  constructor(private constants : Constants, private http: HttpClient) {}
  
  // เข้าสู่ระบบ
  public async login(data: GetLoginRequest): Promise<GetLoginResponse> {
    const url = this.constants.API_ENDPOINT + '/login';
    const response = await lastValueFrom(
      this.http.post<GetLoginResponse>(url, data)
    );
    return response;
  }
}

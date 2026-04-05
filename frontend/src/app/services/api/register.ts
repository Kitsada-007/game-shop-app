import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { GetRegisterRequest } from '../../models/request/get_register_req';
import { GetRegisterResponse } from '../../models/response/get_register_res';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private constants: Constants, private http: HttpClient) {}
  
  // สมัครสมาชิก
  public async register(data: GetRegisterRequest): Promise<GetRegisterResponse> {
    const url = this.constants.API_ENDPOINT + '/register';
    const response = await lastValueFrom(
      this.http.post<GetRegisterResponse>(url, data)
    );
    return response;
  }

  
}

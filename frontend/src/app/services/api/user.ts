import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { GetProfileResponse, UserReq } from '../../models/response/get_profile_res';
import { GetLibraryGameResponse } from '../../models/response/get_library_res';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private constants: Constants) { }

  // ข้อมูล user
  public async getUser(): Promise<GetProfileResponse> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const url = this.constants.API_ENDPOINT + '/user';

    const res = await lastValueFrom(this.http.get<GetProfileResponse[]>(url, { headers }));
    console.log('API response:', res);

    return res[0]; // <--- เอา object แรกของ array
  }

  // อัปโหลดรูปโปรไฟล์
  public async uploadProfile(file: File, token: string): Promise<any> {
    const formData = new FormData();
    formData.append('profile', file);

    const url = this.constants.API_ENDPOINT + '/user/upload';

    return await lastValueFrom(
      this.http.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  }

  // แก้ไขโปรไฟล์ user
  public async editUserProfile(userData: Partial<UserReq>): Promise<UserReq> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = this.constants.API_ENDPOINT + '/user';

    const res = await lastValueFrom(
      this.http.put<UserReq>(url, userData, { headers })
    );

    return res;
  }

  // ดึงข้อมูล user admin
  public async getUsers(): Promise<GetProfileResponse[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const url = this.constants.API_ENDPOINT + '/admin/users';

    const res = await lastValueFrom(this.http.get<GetProfileResponse[]>(url, { headers }));
    console.log('API response:', res);

    return res;
  }

  // ดึงคลังเกมของ user
  public async getLibrary(): Promise<GetLibraryGameResponse[]> {
    const url = `${this.constants.API_ENDPOINT}/user/library`;
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const res = await lastValueFrom(this.http.get<GetLibraryGameResponse[]>(url, { headers }));
      return res;
    } catch (error) {
      console.error('โหลดคลังเกมไม่สำเร็จ:', error);
      throw error;
    }
  }


}

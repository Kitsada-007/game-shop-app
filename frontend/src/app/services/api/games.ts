import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { lastValueFrom } from 'rxjs';
import { GetGameResponse } from '../../models/response/get_game_res';
import { GetGameRequest } from '../../models/request/get_game_req';
import { GetTopGameResponse } from '../../models/response/get_top_res';
import { GetLibraryGameResponse } from '../../models/response/get_library_res';


@Injectable({
  providedIn: 'root'
})
export class GamesService {
  constructor(private constants: Constants, private http: HttpClient) { }

  // ดึงข้อมูลเกมทั้งหมด
  public async getGameAll(options?: any) {
    const url = this.constants.API_ENDPOINT + '/games';

    // ดึง token จาก localStorage (หรือ sessionStorage)
    const token = localStorage.getItem('token');

    //ใส่ header Authorization
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await lastValueFrom(this.http.get<GetGameResponse[]>(url, { headers }));
      return response;
    } catch (error) {
      console.error('โหลดข้อมูลเกมไม่สำเร็จ:', error);
      throw error;
    }
  }

  // เพิ่มเกมใหม่ (สำหรับแอดมิน)
  public async addNewGame(game: GetGameRequest, options?: any) {
    const url = this.constants.API_ENDPOINT + '/admin/games';
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await lastValueFrom(
        this.http.post<GetGameResponse>(url, game, { headers })
      );
      return response;
    } catch (error) {
      console.error('เพิ่มเกมไม่สำเร็จ:', error);
      throw error;
    }
  }

  // แก้ไขข้อมูลเกม (สำหรับแอดมิน)
  public async editGame(id: string, game: GetGameRequest, options?: any) {
    const url = `${this.constants.API_ENDPOINT}/admin/games/${id}`;
    const token = localStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    try {
      const response = await lastValueFrom(
        this.http.put<GetGameResponse>(url, game, { headers })
      );
      return response;
    } catch (error) {
      console.error('แก้ไขเกมไม่สำเร็จ:', error);
      throw error;
    }
  }

  // ลบเกม (สำหรับแอดมิน)
  public async deleteGame(id: number) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const url = `${this.constants.API_ENDPOINT}/admin/games/${id}`;
      const response = await lastValueFrom(this.http.delete(url, { headers }));
      return response;
    } catch (err) {
      console.error('ลบเกมไม่สำเร็จ:', err);
      throw err;
    }
  }
  
  // ดึงข้อมูลเกมตาม ID เพื่อแสดงรายละเอียดเกม
  async getGameById(id: number): Promise<GetGameResponse> {
    const url = `${this.constants.API_ENDPOINT}/games/${id}`;
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return await lastValueFrom(this.http.get<GetGameResponse>(url, { headers }));
  }


  // ดึง Top เกม
  public async getTopGame(): Promise<GetTopGameResponse> {
    const url = `${this.constants.API_ENDPOINT}/games/top`;
    const token = localStorage.getItem('token') ?? '';
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    try {
      const response = await lastValueFrom(
        this.http.get<GetTopGameResponse>(url, { headers })
      );
      return response;
    } catch (error) {
      console.error('โหลด Top เกมไม่สำเร็จ:', error);
      throw error;
    }
  }

  // upload image game
  async uploadGameImages(gameId: string, files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file)); 

    const token = localStorage.getItem('token') || '';
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const url = `${this.constants.API_ENDPOINT}/admin/upload-multiple/${gameId}`;
      const response = await lastValueFrom(this.http.post<{ urls: string[] }>(url, formData, { headers }));
      console.log('Upload success:', response.urls);
      return response.urls;
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  }












}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  GetProfileResponse,
  UserReq,
} from '../../../models/response/get_profile_res';
import { UserService } from '../../../services/api/user';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { RouterLink as RouterLink_1 } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, MatButtonModule, MatInputModule, RouterLink_1],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  user?: GetProfileResponse;
  email: string = '';
  username: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile?: File;
  loadingProfile = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private http: HttpClient
  ) { }


  async ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.user = await this.userService.getUser();
      // เพิ่มบรรทัดนี้เพื่อเซ็ตค่าเริ่มต้น
      this.username = this.user?.username || '';
      this.email = this.user?.email || '';
    } catch (err) {
      console.error('Failed to load user', err);
      this.router.navigate(['/login']);
    }
  }

  // เลือกไฟล์
  onFileSelected(event: Event) {
    console.log("test")
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.uploadProfile();
    }
  }

  // อัปโหลดไฟล์ไป Backend
  async uploadProfile() {
    if (!this.selectedFile) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('คุณยังไม่ได้เข้าสู่ระบบ');
      return;
    }
    this.loadingProfile = true;

    try {
      const response: any = await this.userService.uploadProfile(
        this.selectedFile,
        token
      );
      console.log('Upload success:', response);

      if (response.url) {
        this.user!.profile_image = response.url; // อัปเดต UI
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('อัปโหลดรูปโปรไฟล์ล้มเหลว');
    } finally {
      this.loadingProfile = false; // โหลดเสร็จ หยุดหมุน
    }
  }

  async EditProfile() {
    const confirmed = confirm('คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข้อมูล?');
    if (!confirmed) {
      return; // ยกเลิกถ้าไม่ยืนยัน
    }

    try {
      const updatedData = {
        username: this.username,
        email: this.email
      };
      console.log(updatedData.email + " " + updatedData.username)
      const response = await this.userService.editUserProfile(updatedData);

      console.log('Profile updated:', response);


      this.username = response.username;
      this.email = response.email;
      alert('แก้ไขโปรไฟล์สำเร็จ');

      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }



}

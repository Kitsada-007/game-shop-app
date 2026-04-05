import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { GetGameResponse } from '../../../models/response/get_game_res';
import { GamesService } from '../../../services/api/games';
import { CommonModule } from '@angular/common';
import { GetGameRequest } from '../../../models/request/get_game_req';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetProfileResponse } from '../../../models/response/get_profile_res';
import { UserService } from '../../../services/api/user';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderAdmin } from "../../../components/header-admin/header-admin";



@Component({
  selector: 'app-home-admin',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, HeaderAdmin],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.scss'
})
export class HomeAdmin {
  games: GetGameResponse[] = [];
  admin?: GetProfileResponse;
  loading = true;
  gameForm: FormGroup;
  editingGameId: string | null = null;
  uploadingGameId: string | null = null;
  genres: string[] = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Simulation', 'Horror', 'Racing'];

  constructor(private gamesService: GamesService, private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.gameForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      genre: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // มี Token ไหม
  async ngOnInit(): Promise<void> {
    await this.loadGames();
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.admin = await this.userService.getUser();
      console.log('User loaded:', this.admin);
    } catch (err) {
      console.error('Failed to load user', err);
      this.router.navigate(['/login']);
    }
  }
  // ดึงข้อมูลเกมทั้งหมดมาแสดง
  async loadGames() {
    try {
      this.games = await this.gamesService.getGameAll();
    } catch (err) {
      console.error('โหลดข้อมูลเกมไม่สำเร็จ:', err);
    } finally {
      this.loading = false;
    }
  }
  // แปลงวันที่เป็นไทย 
  formatThaiDate(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  }

  //  แก้ไขเกม
  editGame(game: GetGameResponse) {
    this.editingGameId = game.id.toString();
    this.gameForm.patchValue({
      name: game.name,
      price: game.price,
      genre: game.genre,
      description: game.description ?? ''
    });
  }

  //ยกเลิกแก้ไขเกม
  cancelEdit() {
    this.gameForm.reset();
    this.editingGameId = null;
  }

  // เพิ่มเกม
  async submitGame() {
    if (this.gameForm.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    
    // สร้าง Object เพื่อส่งไป Backend
    const gameData: GetGameRequest = {
      name: this.gameForm.value.name.trim(),
      price: Number(this.gameForm.value.price),
      genre: this.gameForm.value.genre.trim(),
      description: this.gameForm.value.description.trim()

    };
    console.log(gameData);

    try {
      if (this.editingGameId) {
        await this.gamesService.editGame(this.editingGameId, gameData);
        alert('แก้ไขเกมสำเร็จ!');
      } else {
        await this.gamesService.addNewGame(gameData);
        alert('เพิ่มเกมสำเร็จ!');
      }

      this.gameForm.reset();
      this.editingGameId = null;
      await this.loadGames();
    } catch (err) {
      console.error('เกิดข้อผิดพลาด:', err);
      alert('ไม่สำเร็จ!');
    }
  }

  // ลบเกม
  async removeGame(game: GetGameResponse) {
    if (!confirm(`คุณแน่ใจไหมว่าจะลบเกม "${game.name}"`)) return;

    try {
      await this.gamesService.deleteGame(game.id);
      alert('ลบเกมสำเร็จ!');
      await this.loadGames();
    } catch (err) {
      console.error('ลบเกมไม่สำเร็จ:', err);
      alert('ลบเกมไม่สำเร็จ!');
    }
  }

  // upload รูปเกม
  async onUploadImageGame(event: any, gameId: string) {
    const files: File[] = Array.from(event.target.files);
    if (!files.length) return;
    this.uploadingGameId = gameId;
    try {
      const urls = await this.gamesService.uploadGameImages(gameId, files);
      console.log('อัปโหลดรูปสำเร็จ:', urls);
      alert('อัปโหลดรูปสำเร็จ!');
      // อัปเดต UI ถ้าต้องการแสดงรูปล่าสุด
      const game = this.games.find(g => g.id.toString() === gameId);
      if (game) game.images = urls;
    } catch (err) {
      console.error('อัปโหลดไม่สำเร็จ:', err);
      alert('อัปโหลดไม่สำเร็จ! ขนาดไฟล์ใหญ่เกินไป');
    } finally {
      this.uploadingGameId = null; // อัปโหลดเสร็จ
    }
  }

  // ล็อคเอ้า
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

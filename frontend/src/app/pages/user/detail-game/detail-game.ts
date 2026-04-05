import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetGameResponse } from '../../../models/response/get_game_res';
import { GamesService } from '../../../services/api/games';
import { CommonModule, DatePipe } from '@angular/common';
import { Datum } from '../../../models/response/get_top_res';
import { CartService } from '../../../services/api/cart';

@Component({
  selector: 'app-detail-game',
  imports: [DatePipe, CommonModule],
  templateUrl: './detail-game.html',
  styleUrl: './detail-game.scss'
})
export class DetailGame {
  gameId!: number;
  game: GetGameResponse | null = null;
  loading = true;
  selectedImage: string | null = null;
  topGames: Datum[] = [];
  gameRanking: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    private cartService: CartService,
    private router: Router

  ) { }

  async ngOnInit() {
    this.gameId = Number(this.route.snapshot.paramMap.get('id'));
    await this.loadTopGames(); // โหลด TopGames ก่อน
    await this.loadGame();     // โหลดเกมปัจจุบัน
  }

  // โหลดข้อมูล Top 5
  async loadTopGames() {
    try {
      const response = await this.gamesService.getTopGame();
      if (response.success) {
        this.topGames = response.data; // เรียงมาแล้วจาก backend
      }
    } catch (err) {
      console.error('โหลด Top เกมไม่สำเร็จ:', err);
    }
  }

  // โหลดข้อมูลเกม
  async loadGame() {
    this.loading = true;
    try {
      const data = await this.gamesService.getGameById(this.gameId);
      this.game = data;

      // เลือกรูปแรกถ้ามี
      if (this.game.images && this.game.images.length > 0) {
        this.selectedImage = this.game.images[0];
      }

      // หา ranking จาก TopGames
      const top = this.topGames.find(g => g.id === this.game!.id);
      this.gameRanking = top ? top.ranking : null;

    } catch (error) {
      console.error('โหลดข้อมูลเกมไม่สำเร็จ', error);
    } finally {
      this.loading = false;
    }
  }

  // กดเข้ารถเข็น
  addToCart() {
    if (!this.game) return;
    this.cartService.addToCart(this.game);
    // this.router.navigate(['/shopping']);
  }

  // เลือกเปลี่ยนรูปมาโชว์
  selectImage(img: string) {
    this.selectedImage = img;
  }

  // แปลงเป็นไทย
  formatThaiDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  }
}

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { GetProfileResponse } from '../../models/response/get_profile_res';
import { UserService } from '../../services/api/user';
import { GamesService } from '../../services/api/games';
import { GetGameResponse } from '../../models/response/get_game_res';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, FormsModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  games: GetGameResponse[] = [];        // เกมทั้งหมด
  featuredGames: GetGameResponse[] = []; // เกมเด่น 3-4 เกม
  displayedGames: GetGameResponse[] = []; // เกมที่แสดงใน popup
  searchTerm: string = '';
  showPopup: boolean = false;
  loading = true;
  user?: GetProfileResponse;

  constructor(
    private router: Router,
    private gamesService: GamesService,
    private userService: UserService,
    private location: Location
  ) { }

  // เช็ค Token
  async ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.user = await this.userService.getUser();
      this.games = await this.gamesService.getGameAll();
      this.featuredGames = this.games.slice(0, 4); // เลือกเกมมาโชว์ใน Dropdown
    } catch (err) {
      console.error('โหลดข้อมูลไม่สำเร็จ', err);
      this.router.navigate(['/login']);
    } finally {
      this.loading = false;
    }
  }

  // ฟังก์ชันค้นหา
  searchGames() {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      // ถ้าไม่พิมพ์อะไร ให้โชว์ featured games
      this.displayedGames = [...this.featuredGames];
      console.log();
    } else {
      this.displayedGames = this.games.filter(
        g => g.name.toLowerCase().includes(term) || g.genre.toLowerCase().includes(term)
      );
    }
  }

  // ไว้ทำให้ POP ค้นหาหายไปเมื่อกดออก
  onBlurSearch() {
    setTimeout(() => {
      this.showPopup = false;
    }, 150);
  }

  // เลือกเกมจาก popup
  selectGame(game: GetGameResponse) {
    this.searchTerm = game.name;
    this.showPopup = false;
    this.router.navigate(['/detail-game', game.id]);
  }

  // ดึงรายชื่อ genre ที่ไม่ซ้ำกัน
  get uniqueGenres(): string[] {
    if (!this.games || this.games.length === 0) {
      return [];
    }
    // ใช้ Set เพื่อเก็บค่าที่ไม่ซ้ำกัน
    const genres = new Set<string>();
    this.games.forEach(game => {
      // ตรวจสอบและเพิ่ม genre ที่ไม่ซ้ำกันเข้าไปใน Set
      if (game.genre) {
        genres.add(game.genre);
      }
    });
    // แปลง Set กลับไปเป็น Array เพื่อนำไปวนลูปใน HTML
    return Array.from(genres);

  }
  getGameImage(game: GetGameResponse): string {
    if (!game.images || game.images.length === 0) return 'assets/Images/no-image.png';
    return game.images[0];
  }

  // ไปยัง หมวดหมู่เกม
  goToCategory(genre: string) {
    this.router.navigate(['/typegame', genre],
      {
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  goBack() {
    this.location.back();
  }

  goForward() {
    this.location.forward();
  }


}


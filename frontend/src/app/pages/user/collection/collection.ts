import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/api/user';
import { GetLibraryGameResponse } from '../../../models/response/get_library_res';
import { GetGameResponse } from '../../../models/response/get_game_res';
import { GamesService } from '../../../services/api/games';

@Component({
  selector: 'app-collection',
  imports: [CommonModule],
  templateUrl: './collection.html',
  styleUrl: './collection.scss'
})
export class Collection {
  games: (GetLibraryGameResponse & { image?: string })[] = [];
  loading = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private gamesService: GamesService
  ) { }

  async ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // ดึงคลังเกมของ user
      const library = await this.userService.getLibrary();

      // สำหรับแต่ละเกมใน library ให้ fetch รูป
      const libraryWithImages = await Promise.all(
        library.map(async (g) => {
          try {
            const gameDetail: GetGameResponse = await this.gamesService.getGameById(g.game_id);
            return { ...g, image: gameDetail.images?.[0] ?? 'assets/Images/no-image.png' };
          } catch (err) {
            console.error('โหลดรูปเกมไม่สำเร็จ:', g.game_id, err);
            return { ...g, image: 'assets/Images/no-image.png' };
          }
        })
      );

      this.games = libraryWithImages;
    } catch (err) {
      console.error('โหลดคลังเกมไม่สำเร็จ:', err);
    } finally {
      this.loading = false;
    }
  }

  goToDetail(gameId: number) {
    this.router.navigate(['/detail-game', gameId]);
  }

}

import { Component } from '@angular/core';
import { GamesService } from '../../../services/api/games';
import { ActivatedRoute, Router } from '@angular/router';
import { GetGameResponse } from '../../../models/response/get_game_res';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typegame',
  imports: [CommonModule],
  templateUrl: './typegame.html',
  styleUrl: './typegame.scss'
})
export class Typegame {
  genre!: string;
  games: GetGameResponse[] = [];
  loading = true;

  private currentGenre: string = ''; // เก็บ genre ปัจจุบัน

  constructor(private route: ActivatedRoute, private gamesService: GamesService, private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const newGenre = decodeURIComponent(params['genre'] || '');

      // ถ้า genre เปลี่ยนจริงๆ ถึงโหลดเกมใหม่
      if (newGenre !== this.currentGenre) {
        this.currentGenre = newGenre;
        this.genre = newGenre;
        this.loadGames();
      }
    });
  }

  async loadGames() {
    this.loading = true;
    try {
      const allGames = await this.gamesService.getGameAll();
      this.games = allGames.filter(g => g.genre === this.genre);
    } catch (err) {
      console.error('โหลดเกมหมวดหมู่ไม่สำเร็จ', err);
    } finally {
      this.loading = false;
    }
  }

  goToDetail(gameId: number) {
    this.router.navigate(['/detail-game', gameId]);
  }
}

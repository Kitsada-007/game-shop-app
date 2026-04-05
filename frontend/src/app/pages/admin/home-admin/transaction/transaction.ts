import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GetProfileResponse } from '../../../../models/response/get_profile_res';
import { GamesService } from '../../../../services/api/games';
import { UserService } from '../../../../services/api/user';
import { RouterLinkActive } from '@angular/router';
import { HeaderAdmin } from "../../../../components/header-admin/header-admin";
@Component({
  selector: 'app-transaction',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, HeaderAdmin],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss'
})
export class Transaction {
  users?: GetProfileResponse[];
  constructor(private gamesService: GamesService, private fb: FormBuilder, private router: Router, private userService: UserService) { }
  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.users = await this.userService.getUsers();
      console.log('User loaded:', this.users);
    } catch (err) {
      console.error('Failed to load user', err);
      this.router.navigate(['/login']);
    }
  }

}

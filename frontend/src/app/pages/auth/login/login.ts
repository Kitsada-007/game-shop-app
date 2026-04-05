import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { GetLoginResponse } from '../../../models/response/get_login_res';
import { LoginService } from '../../../services/api/login';
@Component({
  selector: 'app-login',
  imports: [MatToolbarModule, RouterLink, FormsModule,],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';

  constructor(private loginService: LoginService, private router: Router) { }

  async onLogin() {
    try {
      const res: GetLoginResponse = await this.loginService.login({ email: this.email, password: this.password });

      if (res.success) {
        localStorage.setItem('token', res.token);

        if (res.payload.role === 'admin') {
          this.router.navigate(['/home-admin']);
        } else {
          this.router.navigate(['']);
        }
      }
    } catch (err: any) {
      console.error('Login failed', err);
      if (err.status === 401) {
        alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    }
  }
}

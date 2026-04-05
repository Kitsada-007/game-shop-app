import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatHint } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { GetRegisterRequest } from '../../../models/request/get_register_req';
import { RegisterService } from '../../../services/api/register';
import { F } from '@angular/cdk/keycodes';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  imports: [MatToolbarModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  wallet?: number;

  constructor(private registerService: RegisterService, private router: Router) { }

  async onRegister() {
    const data: GetRegisterRequest = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      wallet: this.wallet || 0
    };

    try {
      console.log(data);
      const res = await this.registerService.register(data);
      console.log(res);
      if (res.success) {
        alert('สมัครสมาชิกสำเร็จ');
        this.router.navigate(['/login']);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error('Register failed', err);
    }
  }
}

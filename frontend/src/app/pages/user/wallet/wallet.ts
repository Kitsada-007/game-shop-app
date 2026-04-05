import { Component } from '@angular/core';
import { GetProfileResponse } from '../../../models/response/get_profile_res';
import { UserService } from '../../../services/api/user';
import { WalletService } from '../../../services/api/wallet';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  imports: [FormsModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss'
})
export class Wallet {
  user?: GetProfileResponse;
  customAmount: number = 0;
  loading = false;

  constructor(
    private walletService: WalletService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    // โหลดข้อมูล user ตอนเปิดหน้า
    this.user = await this.userService.getUser();
  }

  // ฟังก์ชันเติมเงิน
  async addMoney(amount: number) {
    if (!amount || amount <= 0) {
      alert('กรุณากรอกจำนวนเงินที่ถูกต้อง');
      return;
    }

    const isConfirmed = window.confirm(`คุณแน่ใจหรือไม่ที่จะเติมเงิน ${amount} บาท`);
    if (!isConfirmed) {
      return; // ถ้า user กด Cancel จะไม่ทำอะไรต่อ
    }

    try {
      this.loading = true;
      const res = await this.walletService.topUp({ amount });
      alert(`เติมเงินสำเร็จ! ยอดเงินคงเหลือ: ${res.new_balance} บาท`);
      
      // อัปเดตเงิน
      if (this.user) {
        this.user.wallet_balance = res.new_balance.toString();
      }

      this.customAmount = 0; // รีเซ็ต input
    } catch (err) {
      console.error('เติมเงินไม่สำเร็จ', err);
      alert('เติมเงินไม่สำเร็จ');
    } finally {
      this.loading = false;
    }
  }


}

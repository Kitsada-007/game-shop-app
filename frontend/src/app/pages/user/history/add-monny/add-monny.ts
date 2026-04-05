import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HistoryService } from '../../../../services/api/history';
import { GetTransactionsWalletResponse } from '../../../../models/response/get_transactions_res';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-monny',
  imports: [RouterLink, DatePipe, CommonModule],
  templateUrl: './add-monny.html',
  styleUrl: './add-monny.scss'
})
export class AddMonny {
  moneyHistory: GetTransactionsWalletResponse[] = [];
  loading = true;

  constructor(private historyService: HistoryService) { }

  async ngOnInit() {
    try {
      const allHistory = await this.historyService.getHistory();
      // filter แค่เติมเงิน (topup)
      this.moneyHistory = allHistory.filter(item => item.type === 'topup');
    } catch (error) {
      console.error('โหลดข้อมูลประวัติไม่สำเร็จ', error);
    } finally {
      this.loading = false;
    }
  }

  get totalAmount(): number {
    const total =  this.moneyHistory.reduce((sum, item) => sum + Number(item.amount), 0);
    return Number(total.toFixed(2));
  }
}

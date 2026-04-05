import { Component } from '@angular/core';
import {RouterLink } from '@angular/router';
import { HistoryService } from '../../../../services/api/history';
import { GetTransactionsWalletResponse } from '../../../../models/response/get_transactions_res';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-buy-gram',
  imports: [RouterLink, DatePipe, CommonModule],
  templateUrl: './buy-gram.html',
  styleUrl: './buy-gram.scss'
})
export class BuyGram {
  gameHistory: GetTransactionsWalletResponse[] = [];
  loading = true;

  constructor(private historyService: HistoryService) {}

  async ngOnInit() {
    try {
      const allHistory = await this.historyService.getHistory();
      // filter แค่ซื้อเกม (purchase)
      this.gameHistory = allHistory.filter(item => item.type === 'purchase');
    } catch (error) {
      console.error('โหลดข้อมูลประวัติไม่สำเร็จ', error);
    } finally {
      this.loading = false;
    }
  }

  get totalAmount(): number {
    const total =  this.gameHistory.reduce((sum, item) => sum + Number(item.amount), 0);
    return Number(total.toFixed(2));
  }
}

import { Component } from '@angular/core';
import { HeaderAdmin } from "../../../../components/header-admin/header-admin";
import { ActivatedRoute } from '@angular/router';
import { HistoryService } from '../../../../services/api/history';
import { GetTransactionsWalletResponse } from '../../../../models/response/get_transactions_res';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-history-view',
  imports: [HeaderAdmin, CommonModule, DatePipe],
  templateUrl: './history-view.html',
  styleUrl: './history-view.scss'
})
export class HistoryView {
  gameHistory: GetTransactionsWalletResponse[] = [];
  topupHistory: GetTransactionsWalletResponse[] = [];
  loading = true;
  id!: string;
  selectedTab: 'purchase' | 'topup' = 'purchase';

  constructor(
    private historyService: HistoryService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    try {
      const allHistory = await this.historyService.getHistoryById(this.id);
      // แยกข้อมูลตามประเภท
      this.gameHistory = allHistory.filter(item => item.type === 'purchase');
      this.topupHistory = allHistory.filter(item => item.type === 'topup');
    } catch (error) {
      console.error('โหลดข้อมูลประวัติไม่สำเร็จ', error);
    } finally {
      this.loading = false;
    }
  }

  get totalGameAmount(): number {
    return this.gameHistory.reduce((sum, item) => sum + Number(item.amount), 0);
  }

  get totalTopupAmount(): number {
    return this.topupHistory.reduce((sum, item) => sum + Number(item.amount), 0);
  }

  switchTab(tab: 'purchase' | 'topup') {
    this.selectedTab = tab;
  }
}

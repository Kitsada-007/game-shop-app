import { Component } from '@angular/core';
import { HeaderAdmin } from "../../../../components/header-admin/header-admin";
import { PromoService } from '../../../../services/api/promo';
import { GetPromoResponse } from '../../../../models/response/get_promo_res';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promo',
  imports: [HeaderAdmin, FormsModule, CommonModule],
  templateUrl: './promo.html',
  styleUrl: './promo.scss'
})
export class Promo {
  promo = { name: '', price: 0, limit: 0 };
  promos: GetPromoResponse[] = [];
  editingId: number | null = null;

  constructor(private promoService: PromoService) { }

  ngOnInit(): void {
    this.loadPromos();
  }

  async loadPromos() {
    try {
      this.promos = await this.promoService.getAllPromos();
    } catch (err) {
      console.error('โหลดโปรโมไม่สำเร็จ', err);
    }
  }

  async onSubmit() {
    const body = {
      code: this.promo.name,
      discount_percent: Number(this.promo.price),
      max_uses: Number(this.promo.limit)
    };

    try {
      if (this.editingId) {
        await this.promoService.updatePromo(this.editingId, body);
        this.editingId = null;
      } else {
        await this.promoService.createPromo(body);
      }
      this.promo = { name: '', price: 0, limit: 0 };
      this.loadPromos();
    } catch (error) {
      console.error('เกิดข้อผิดพลาด:', error);
    }
  }

  editPromo(promo: GetPromoResponse) {
    this.promo = {
      name: promo.code,
      price: Number(promo.discount_percent),
      limit: promo.max_uses
    };
    this.editingId = promo.id;
  }

  async deletePromo(id: number) {
    const confirmDelete = confirm('แน่ใจหรือไม่ว่าต้องการลบโปรโมชั่นนี้?');
    if (!confirmDelete) return;

    try {
      await this.promoService.deletePromo(id);
      alert('ลบโปรโมชั่นเรียบร้อยแล้ว');
      this.loadPromos();
    } catch (err) {
      console.error('ลบโปรโมไม่สำเร็จ', err);
      alert('เกิดข้อผิดพลาดในการลบโปรโมชั่น');
    }
  }


  cancelEdit() {
    this.resetForm();
    this.editingId = null;
  }

  private resetForm() {
    this.promo = { name: '', price: 0, limit: 0 };
  }


}

import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {
  data: any = {};
  r_data: any = {};
  constructor(public config: DynamicDialogConfig,) { }

  ngOnInit(): void {
    this.r_data = this.config.data;
    this.data = { ...this.config.data.payments };
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { GlobalService } from 'src/app/services/global.service';
import { ProductsService } from 'src/app/services/products.service';
import { combineLatest } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { PaymentDetailComponent } from '../payment-detail/payment-detail.component';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportType='Daily Transaction';
  reportOptions = ['Daily Transaction', 'Sales', 'Credit'];
  constructor() { }
  ngOnInit(): void {
  }
}
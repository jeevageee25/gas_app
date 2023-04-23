import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { CreditSettlementComponent } from './credit-settlement/credit-settlement.component';
import { DailyTransactionComponent } from './daily-transaction/daily-transaction.component';
import { SalesReportComponent } from './sales-report/sales-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent
  }
]

@NgModule({
  declarations: [
    ReportComponent,
    PaymentDetailComponent,
    CreditSettlementComponent,
    DailyTransactionComponent,
    SalesReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers:[DatePipe]
})
export class ReportModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent
  }
]

@NgModule({
  declarations: [
    ReportComponent,
    PaymentDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ReportModule { }

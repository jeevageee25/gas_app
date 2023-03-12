import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditSettlementComponent } from './credit-settlement.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CreditSettlementComponent
  }
]


@NgModule({
  declarations: [CreditSettlementComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CreditSettlementModule { }

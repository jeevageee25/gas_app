import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesEntryComponent } from './sales-entry/sales-entry.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalesProductsComponent } from './sales-products/sales-products.component';

const routes: Routes = [
  {
    path: '',
    component: SalesEntryComponent
  }
]

@NgModule({
  declarations: [
    SalesEntryComponent,
    SalesProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class SalesModule { }

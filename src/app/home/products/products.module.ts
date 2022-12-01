import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductEntryComponent } from './product-entry/product-entry.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProductEntryComponent
  }
]

@NgModule({
  declarations: [
    ProductEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsModule { }

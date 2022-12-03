 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductsService } from './products.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports:[SharedModule],
  declarations: [],
  providers:[
    ProductsService
  ]
})
export class ServicesModule { }

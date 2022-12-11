
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductsService } from './products.service';
import { ToastService } from './toast.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { GlobalService } from './global.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [SharedModule],
  declarations: [],
  providers: [
    ProductsService,
    ToastService,
    MessageService,
    ConfirmationService,
    DialogService,
    GlobalService
  ]
})
export class ServicesModule { }

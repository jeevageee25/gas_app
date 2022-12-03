import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { TableModule } from 'ngx-easy-table';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DividerModule,
    DialogModule,
    AutoCompleteModule,
    FormsModule,
    RadioButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule
  ],
  exports:[
    DividerModule,
    DialogModule,
    AutoCompleteModule,
    FormsModule,
    RadioButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule
  ]
})
export class SharedModule { }

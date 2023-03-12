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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {CheckboxModule} from 'primeng/checkbox';
import {AccordionModule} from 'primeng/accordion';
import {SidebarModule} from 'primeng/sidebar';

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
    ToastModule,
    FontAwesomeModule,
    MultiSelectModule,
    CalendarModule,
    DynamicDialogModule,
    CheckboxModule,
    AccordionModule,
    SidebarModule
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
    ToastModule,
    FontAwesomeModule,
    MultiSelectModule,
    CalendarModule,
    DynamicDialogModule,
    CheckboxModule,
    AccordionModule,
    SidebarModule
  ]
})
export class SharedModule { }

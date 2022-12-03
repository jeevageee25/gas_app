import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllocateExectuveComponent } from './allocate-executive/allocate-executive.component';

const routes: Routes = [
  {
    path: '',
    component: AllocateExectuveComponent
  }
]

@NgModule({
  declarations: [
    AllocateExectuveComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AllocateExecutiveModule { }

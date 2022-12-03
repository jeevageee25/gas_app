import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecutiveEntryComponent } from './executive-entry/executive-entry.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ExecutiveEntryComponent
  }
]

@NgModule({
  declarations: [
    ExecutiveEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ExecutiveModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultEntryComponent } from './default-entry/default-entry.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DefaultEntryComponent
  }
]


@NgModule({
  declarations: [
    DefaultEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DefaultAllocationModule { }

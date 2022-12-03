import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AreaEntryComponent } from './area_entry/area-entry.component';

const routes: Routes = [
  {
    path: '',
    component: AreaEntryComponent
  }
]

@NgModule({
  declarations: [
    AreaEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DeliveryAreaModule { }

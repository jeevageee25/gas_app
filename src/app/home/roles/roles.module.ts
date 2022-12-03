import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolesComponent } from './roles_entry/roles-entry.component';

const routes: Routes = [
  {
    path: '',
    component: RolesComponent
  }
]

@NgModule({
  declarations: [
    RolesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class RolesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'employees',
        loadChildren: () => import('./executive/executive.module').then(m => m.ExecutiveModule)
      },
      {
        path: 'delivery-area',
        loadChildren: () => import('./delivery-area/delivery-area.module').then(m => m.DeliveryAreaModule)
      },
      {
        path: 'area-allocation',
        loadChildren: () => import('./allocate-executive/allocate-executive.module').then(m => m.AllocateExecutiveModule)
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
      },
      {
        path: 'default-area',
        loadChildren: () => import('./default-allocation/default-allocation.module').then(m => m.DefaultAllocationModule)
      },
      {
        path: 'sales-entry',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
      },
      {
        path: 'credit-settlement',
        loadChildren: () => import('./credit-settlement/credit-settlement.module').then(m => m.CreditSettlementModule)
      },
    ]
  }
]

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    TabViewModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }

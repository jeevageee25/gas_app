import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TabViewModule } from 'primeng/tabview';

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
      }
    ]
  }
]

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    TabViewModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }

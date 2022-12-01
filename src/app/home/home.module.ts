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
        path: 'delivery-executive',
        loadChildren: () => import('./delivery-executive/delivery-executive.module').then(m => m.DeliveryExecutiveModule)
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

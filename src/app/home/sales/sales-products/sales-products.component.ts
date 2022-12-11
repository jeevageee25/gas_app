import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sales-products',
  templateUrl: './sales-products.component.html',
  styleUrls: ['./sales-products.component.scss']
})
export class SalesProductsComponent implements OnInit {
  products: any = [];
  productObj: any = {};

  constructor(
    private toastService: ToastService,
    private PService: ProductsService,
    private gs: GlobalService
  ) {
    this.products = this.gs.product_details;
  }

  ngOnInit(): void {
    this.searchProducts();
  }

  searchProducts() {
    this.PService.getProducts({ search_key: {} }).subscribe((res: any) => {
      (res?.data || []).map((i: any) => {
        this.productObj[i._id] = `${i.category} - ${i.name}`;
      })
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  calculateTotal(item: any) {
    return (
      2000 * (item.twoth || 0) +
      500 * (item.fivehrd || 0) +
      100 * (item.hrd || 0) +
      50 * (item.fifty || 0) +
      20 * (item.twenty || 0) +
      10 * (item.ten || 0) +
      5 * (item.five || 0)
    );
  }

  calculateExpectedTotal(item: any) {
    return (item.price ||0 ) * (item.supplied || 0);
  }
}

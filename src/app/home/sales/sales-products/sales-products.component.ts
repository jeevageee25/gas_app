import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  payment_options = [
    { key: 'Cash', value: 'cash' },
    { key: 'Upi', value: 'upi' },
    { key: 'Card', value: 'card' },
    { key: 'Cheque', value: 'cheque' },
  ]

  payment = new FormControl('');
  @Output() back = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<string>();

  constructor(
    private toastService: ToastService,
    private PService: ProductsService,
    private gs: GlobalService
  ) {
    this.products = JSON.parse(JSON.stringify(this.gs.product_details));
  }

  ngOnInit(): void {
    this.searchProducts();
  }

  onModechange(index: any, e: any) {
    if (e.value === 'cash') {
      this.products[index]['payments'] = {
        twoth: 0,
        fivehrd: 0,
        hrd: 0,
        fifty: 0,
        twenty: 0,
        ten: 0,
        five: 0,
      }
    }
    else {
      this.products[index]['payments'] = {
        txn_id: ""
      };
    }
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

  calculateTotal(data: any) {
    const item: any = data.payments;
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
    return (item.price || 0) * (item.supplied || 0);
  }

  onSubmit() {
    this.gs.updated_products = JSON.parse(JSON.stringify(this.products));
    this.confirm.emit();
  }

  onReset() {
    this.products = JSON.parse(JSON.stringify(this.gs.product_details));
  }

  onBack() {
    this.back.emit();
  }
}

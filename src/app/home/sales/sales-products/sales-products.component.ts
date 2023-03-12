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
  payment_options = [
    { key: 'Credit', value: 'credit' },
    { key: 'Cheque', value: 'cheque' },
    { key: 'Credit Card', value: 'c_card' },
    { key: 'Debit Card', value: 'd_card' },
    { key: 'UPI', value: 'upi' },
    { key: 'Cash', value: 'cash' },
  ]

  payment = new FormControl('');
  @Input() productObj:any;
  @Output() back = new EventEmitter<string>();
  @Output() confirm = new EventEmitter<string>();

  constructor(
    private toastService: ToastService,
    private gs: GlobalService
  ) {
    this.products = JSON.parse(JSON.stringify(this.gs.product_details));
  }

  ngOnInit(): void {
  }

  onModechange(index: any, e: any) {
    if (e.value === 'cash') {
      this.products[index]['payments'] = {
        2000: 0,
        500: 0,
        100: 0,
        50: 0,
        20: 0,
        10: 0,
        5: 0,
      }
    }
    else {
      this.products[index]['payments'] = {
        txn_id: ""
      };
    }
  }

  calculateTotal(data: any) {
    const item: any = data.payments;
    return (
      2000 * (item['2000'] || 0) +
      500 * (item['500'] || 0) +
      100 * (item['100'] || 0) +
      50 * (item['50'] || 0) +
      20 * (item['20'] || 0) +
      10 * (item['10'] || 0) +
      5 * (item['5'] || 0)
    );
  }

  calculateExpectedTotal(item: any) {
    return (item.price || 0) * (item.delivery_count || 0);
  }

  onSubmit(item:any) {
    if(item.count-(item.supplied || 0)-(item.delivery_count || 0) <1){
      this.toastService.showWarningToaster('Warning', 'Please check the count !');
      return;
    }
    if(!item.paymentMode){
      this.toastService.showWarningToaster('Warning', 'Please select Payment !');
      return;
    }
    if(item.paymentMode==='credit' && (!item.payments.customer_name || !item.payments.mobile)){
      this.toastService.showWarningToaster('Warning', 'Please enter mandatory fields !');
      return;
    }
    this.gs.data_entry = JSON.parse(JSON.stringify(item));
    this.confirm.emit();
  } 

  onBack() {
    this.back.emit();
  }
}

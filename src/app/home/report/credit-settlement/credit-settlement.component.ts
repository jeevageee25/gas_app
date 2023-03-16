import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Config, DefaultConfig, Columns } from 'ngx-easy-table';
import { ConfirmationService } from 'primeng/api';
import { combineLatest } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-credit-settlement',
  templateUrl: './credit-settlement.component.html',
  styleUrls: ['./credit-settlement.component.scss']
})
export class CreditSettlementComponent implements OnInit {

  roles: any = [];
  configuration: Config = { ...DefaultConfig };
  nestedConfiguration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  nestedColumns: Columns[] = [];
  tableData = [];
  previl = this.gs.getPreviledge('Credit Settlement');


  constructor(private gs: GlobalService, private confirmationService: ConfirmationService, private toastService: ToastService, private fb: FormBuilder, private PService: ProductsService) { }

  ngOnInit(): void {
    this.getData();
    this.initTable();
    this.initConfig();
  }

  initConfig() {
    this.configuration = { ...DefaultConfig };
    this.configuration.detailsTemplate = true;
    this.configuration.fixedColumnWidth = false;
    this.configuration.showDetailsArrow = true;
    this.configuration.rows = 10;
    this.nestedConfiguration = { ...DefaultConfig };
    this.nestedConfiguration.fixedColumnWidth = false;
    this.nestedConfiguration.rows = 5;
  }

  getData() {
    const obs1 = this.PService.searchSales({ search_key: { paymentMode: "credit" } });
    const obs2 = this.PService.searchPayment({ search_key: {} });
    combineLatest(obs1, obs2).subscribe((res: any) => {
      const data = res[0]?.data || [];
      const payments = res[1]?.data || [];
      const grouped: any = this.gs.groupBy(payments, ['name', 'mobile']);
      let tableObj: any = {};
      data.forEach((e: any) => {
        const key = `${e.payments.customer_name}#${e.payments.mobile}`
        tableObj[key] = (tableObj[key] || 0) + (e.supplied * e.price);
      })
      let tableData: any = [];
      Object.entries(tableObj).forEach(([key, v]) => {
        let value:any = v;
        const arr = key.split('#');
        const payments = grouped[arr[0]] && grouped[arr[0]][arr[1]] || [];
        const paid_amount = payments.reduce((t: any, v: any) => t + v.amount, 0)
        tableData.push({ name: arr[0], mobile: arr[1], total_amount: value, paid_amount, remaining_amount: Number((value-paid_amount).toFixed(2)), payments })
      })
      this.tableData = tableData;
    })
  }

  initTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.rows = 10;
    this.columns = [
      { key: '', title: 'SL #' },
      { key: 'name', title: 'Customer Name' },
      { key: 'mobile', title: 'Mobile #' },
      { key: 'total_amount', title: 'Expected Amount' },
      { key: 'paid_amount', title: 'Paid Amount' },
      { key: 'remaining_amount', title: 'Remaining Amount' },
      { key: '', title: 'Actions' }
    ];
    this.nestedColumns = [
      { key: 'date', title: 'Payment Date' },
      { key: 'amount', title: 'Collected Amount' },
    ];
  }
}

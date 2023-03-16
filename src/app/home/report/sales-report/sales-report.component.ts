import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Config, DefaultConfig, Columns } from 'ngx-easy-table';
import { DialogService } from 'primeng/dynamicdialog';
import { combineLatest } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';
import { PaymentDetailComponent } from '../payment-detail/payment-detail.component';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

  dateForm: FormGroup = new FormGroup({});
  configuration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  tableData = [{}];
  d_frequency = ['Daily', 'Weekly', 'Monthly', 'Quaterly', 'Yearly', 'Custom'];
  frequency = 'Custom';

  constructor(private fb: FormBuilder, private PService: ProductsService,
    private toastService: ToastService, private gs: GlobalService, public dialogService: DialogService) { }

  ngOnInit(): void {
    this.createForm();
    this.initTable();
    this.initConfig();
  }


  createForm() {
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    this.dateForm = this.fb.group({
      from_date: [null, Validators.required],
      to_date: [null, Validators.required]
    })
  }

  initTable() {
    this.columns = [
      { key: '', title: 'SL #' },
      { key: 'date', title: 'Date' },
      { key: 'expected', title: 'Expected Amount' },
      { key: 'collected', title: 'Collected Amount' },
      { key: 'credit', title: 'Credit' },
      { key: 'difference', title: 'Difference' },
    ];
  }

  initConfig() {
    this.configuration = { ...DefaultConfig };
    this.configuration.detailsTemplate = true;
    this.configuration.fixedColumnWidth = false;
    this.configuration.rows = 10;
  }

  convertDateFormat(date: any) {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }


  getData() {
    const { from_date, to_date } = this.dateForm.value;
    if (!from_date || !to_date) {
      this.toastService.showWarningToaster('Warning', 'Please select From Date and To Date');
      return;
    }
    combineLatest(
      this.PService.searchSales({ search_key: { ...this.dateForm.value } }),
      this.PService.searchAreaAllocation({ search_key: { ...this.dateForm.value } })
    ).subscribe((res: any) => {
      const sales_entry = res[0]?.data || [];
      const allocation_data = res[1]?.data || [];
      const a_grouped = this.gs.groupBy(allocation_data, ['allocation_date']);
      const s_grouped: any = this.gs.groupBy(sales_entry, ['allocation_date']);
      let tableData = [];

      for (const [date, value] of Object.entries(a_grouped)) {
        let expected = 0;
        let data: any = value;
        data.forEach((d: any) => {
          d.allocation_data.forEach((a: any) => {
            a.allocations.forEach((s: any) => {
              expected += (s.count * s.price);
            })
          })
        })
        const { credit, collected } = this.formatReports(s_grouped[date] || [])
        const difference = Number((credit + collected - expected).toFixed(2));
        tableData.push({ date, credit: Number(credit.toFixed(2)), collected: Number(collected.toFixed(2)), expected: Number(expected.toFixed(2)), difference })
      }
      this.tableData = tableData;
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  formatReports(sales_list: any) {
    let collected = 0;
    let credit = 0;
    sales_list.forEach((sales: any) => {
      if (sales?.paymentMode === 'cash') {
        for (const [c, v] of Object.entries(sales?.payments)) {
          let a: any = c;
          let b: any = v;
          if (v != 0) {
            collected += (a * b);
          }
        }
      }
      else if (sales?.paymentMode === 'credit') {
        collected += sales.supplied * sales.price;
        credit += sales.supplied * sales.price;
      }
      else {
        collected += sales.supplied * sales.price;
      }
    })
    return { credit, collected }
  }
}

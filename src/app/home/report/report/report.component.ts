import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { GlobalService } from 'src/app/services/global.service';
import { ProductsService } from 'src/app/services/products.service';
import { combineLatest } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { PaymentDetailComponent } from '../payment-detail/payment-detail.component';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  dateForm: FormGroup = new FormGroup({});
  configuration: Config = { ...DefaultConfig };
  nestedConfiguration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  nestedColumns: Columns[] = [];
  tableData = [{}];
  areaObj: any = {};
  productObj: any = {};
  executiveObj: any = {};

  constructor(private fb: FormBuilder, private PService: ProductsService,
    private toastService: ToastService, private gs: GlobalService, public dialogService: DialogService) { }

  ngOnInit(): void {
    this.createForm();
    this.initTable();
    this.initConfig();
    this.getAreas();
    this.searchProducts();
    this.getData();
    this.getExecutives();
  }


  createForm() {
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    this.dateForm = this.fb.group({
      allocation_date: [date, Validators.required]
    })
  }

  initTable() {
    this.columns = [
      { key: '', title: 'SL #' },
      { key: 'area', title: 'Area' },
      { key: 'executive_id', title: 'Executive Name' },
      { key: 'allocated', title: 'Allocated' },
      { key: 'returned', title: 'Returned' },
      { key: 'supplied', title: 'Supplied' },
      { key: 'expected_amount', title: 'Expected Amount' },
      { key: 'collected_amount', title: 'Collected Amount' },
      { key: 'difference', title: 'Difference' },
    ];
    this.nestedColumns = [
      { key: 'no', title: 'Sl #', width: '5%' },
      { key: 'product', title: 'Product' },
      { key: 'price', title: 'Price' },
      { key: 'allocated', title: 'Allocated' },
      { key: 'supplied', title: 'Supplied' },
      { key: 'payment_method', title: 'Payment Method' },
      { key: 'expected_amount', title: 'Expected Amount' },
      { key: 'collected_amount', title: 'Collected Amount' },
      { key: 'difference', title: 'Difference' },
    ];
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

  convertDateFormat(date: any) {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  getAreas() {
    this.PService.searchArea({ search_key: {} }).subscribe((res: any) => {
      (res?.data || []).map((i: any) => {
        this.areaObj[i._id] = i.area;
      })
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
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

  getExecutives() {
    this.PService.searchEmployee({ search_key: { role: "Delivery Executive" } }).subscribe((res: any) => {
      (res?.data || [])?.map((i: any) => {
        this.executiveObj[i._id] = i.staff_name;
      })
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  getData() {
    const date = new Date(this.dateForm?.get('allocation_date')?.value);
    date.setHours(0, 0, 0, 0);
    const allocation_date = this.convertDateFormat(date);
    combineLatest(
      this.PService.searchSales({ search_key: { allocation_date } }),
      this.PService.searchAreaAllocation({ search_key: { allocation_date } })
    ).subscribe((res: any) => {
      const sales_entry = res[0]?.data || [];
      const allocation_data = res[1]?.data || [];
      const sales_obj = this.formatSalesData(sales_entry);
      if (allocation_data?.length) {
        this.formatReports(allocation_data, sales_obj);
      }
      else {
        this.tableData = [];
      }
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  formatSalesData(response: any) {
    let sales_obj: any = {};
    response?.forEach((d: any) => {
          const key = `${d.area_id}#${d.executive_id}#${d.product}`;
          if (!sales_obj[key]) sales_obj[key] = [];
          sales_obj[key].push(d);
    })
    return sales_obj;
  }

  formatReports(a: any = [], sales_obj: any) {
    const data = a[0]?.allocation_data;
    let for_grouping: any = [];
    data.forEach((d: any) => {
      d.allocations.forEach((a: any) => {
        for_grouping.push({ executive_id: d.executive_id, ...a })
      })
    })
    const grouped = this.gs.groupBy(for_grouping, ['area_id', 'executive_id']);
    let tableData = [];
    for (const [area_key, area_value] of Object.entries(grouped)) {
      const area_values: any = area_value;
      for (const [exec_key, exec_value] of Object.entries(area_values)) {
        const exec_values: any = exec_value;
        let list: any = [];
        let total_allocated = 0;
        let total_supplied = 0;
        let total_expected_amount = 0;
        let total_collected_amount = 0;

        exec_values?.forEach((e: any) => {
          const key = `${area_key}#${exec_key}#${e.product}`;
          const sales_list = sales_obj[key] || [];
          const supplied = sales_list.reduce((t: any, v: any) => t + (v.supplied || 0), 0)
          total_allocated += e.count;
          total_supplied += supplied;
          total_expected_amount += ((supplied || 0) * e.price);
          let collected = 0;
          sales_list.forEach((sales:any)=>{
          if (sales?.paymentMode === 'cash') {
            for (const [c, v] of Object.entries(sales_list[0]?.payments)) {
              let a: any = c;
              let b: any = v;
              if (v != 0) {
                collected += (a * b);
              }
            }
          }
          else {
            collected = supplied * e.price;
          }
          total_collected_amount += collected;
          const expected_amount = Number(((supplied || 0) * (e.price || 0)).toFixed(2));
          list.push({
            product_id: e.product,
            allocated: e.count,
            price: e.price,
            supplied,
            collected: Number((collected).toFixed(2)),
            difference: Number((expected_amount - collected).toFixed(2)),
            expected_amount,
            payment_method: sales?.paymentMode || '-',
            sales
          })
        })
        })
        tableData.push({
          area_id: area_key,
          executive_id: exec_key,
          allocated: total_allocated,
          supplied: total_supplied,
          collected: Number((total_collected_amount).toFixed(2)),
          expected_amount: Number((total_expected_amount).toFixed(2)),
          difference: Number((total_expected_amount - total_collected_amount).toFixed(2)),
          list
        });
      }
    }
    this.tableData = tableData;
  }

  openPayment(row: any) {
    this.dialogService.open(PaymentDetailComponent, {
      header: 'Payment Details',
      width: '40%',
      data: row.sales
    });
  }

  get areas() {
    return Object.keys(this.tableData)
  }

}

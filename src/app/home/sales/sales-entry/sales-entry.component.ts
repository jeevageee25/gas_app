import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { GlobalService } from 'src/app/services/global.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sales-entry',
  templateUrl: './sales-entry.component.html',
  styleUrls: ['./sales-entry.component.scss']
})
export class SalesEntryComponent implements OnInit {

  tableData: any = {};
  executive_id = "";
  areaObj: any = {};
  showParent = true;
  _id: any = '';
  productObj: any = {};

  constructor(private PService: ProductsService,
    private toastService: ToastService, private gs: GlobalService) {
    const session: any = sessionStorage.getItem('user_info');
    const data: any = JSON.parse(session);
    this.executive_id = data._id;
  }

  ngOnInit(): void {
    this.getAreas();
    this.searchProducts();
    this.searchSales();
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

  searchSales() {
    const allocation_date = this.convertDateFormat(new Date());
    const obs1 = this.PService.searchSales({ search_key: { executive_id: this.executive_id, allocation_date } });
    const obs2 = this.PService.searchAreaAllocation({ search_key: { allocation_date } })
    combineLatest(obs1, obs2).subscribe((res: any) => {
      const data1 = res[0]?.data || [];
      const data2 = res[1]?.data[0] || [];
      this.searchAreaAllocation(data1, data2);
    }, (e: any) => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchAreaAllocation(sales: any, data: any) {
    if (data?.allocation_data?.length) {
      const exec_match = data.allocation_data.find((a: any) => a.executive_id === this.executive_id);
      if (exec_match) {
        this.formatData(exec_match.allocations, sales);
      }
    }
  }

  formatData(data: any, sales: any = []) {
    let grouped: any = this.gs.groupBy(data, ['area_id']);
    const sales_grouped: any = this.gs.groupBy(sales, ['area_id', 'product']);
    for (const [key, value] of Object.entries(grouped)) {
      const val: any = value;
      val.forEach((v: any) => {
        v['supplied'] = sales_grouped[v?.area_id] && sales_grouped[v?.area_id][v?.product]?.reduce((t: any, v: any) => t + v.supplied, 0) || 0;
      })
    }
    this.tableData = grouped;
  }
  onAreaClick(area_id: any) {
    this.gs.product_details = this.tableData[area_id];
    this.showParent = false;
  }

  onConfirm() {
    const data: any = this.gs.data_entry;
    const { price, product, area_id, delivery_count, paymentMode, payments, count } = data;
    const payload = {
      product,
      area_id,
      supplied: delivery_count,
      paymentMode,
      payments,
      price,
      count,
      allocation_date: this.convertDateFormat(new Date()),
      executive_id: this.executive_id,
    };
    this.PService.addSales(payload).subscribe((res: any) => {
      this.searchSales();
      this.toastService.showSuccessToaster('Success', 'Added Successfully !');
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
    this.showParent = true;
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

  get areas() {
    return Object.keys(this.tableData)
  }

}

import { Component, OnInit } from '@angular/core';
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
  executive_id = "63956dd48b1c848d58212097";
  areaObj: any = {};
  showParent = true;
  entries: any = [];
  _id: any = '';

  constructor(private PService: ProductsService,
    private toastService: ToastService, private gs: GlobalService) { }

  ngOnInit(): void {
    this.getAreas();
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

  searchAreaAllocation() {
    const allocation_date = new Date();
    this.PService.searchAreaAllocation({ search_key: { allocation_date: this.convertDateFormat(allocation_date) } }).subscribe((res: any) => {
      const data = res?.data[0] || [];
      if (data?.allocation_data?.length) {
        const exec_match = data.allocation_data.find((a: any) => a.executive_id === this.executive_id);
        this.formatData(exec_match.allocations);
      }
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  formatData(data: any) {
    const grouped = this.gs.groupBy(data, ['area_id']);
    this.tableData = grouped;
    this.entriesData(grouped);
  }

  entriesData(grouped: any) {
    this.entries = [];
    for (const [key, value] of Object.entries(grouped)) {
      const data: any = value;
      let obj: any = { area_id: key, sales: [] };
      data.forEach((d: any) => {
        obj.sales.push({ product_id: d.product, count: d.count, price: d.price })
      })
      this.entries.push(obj);
    }
  }

  onAreaClick(area_id: any) {
    this.gs.product_details = this.tableData[area_id];
    this.showParent = false;
  }

  onConfirm() {
    const updated_products: any = this.gs.updated_products;
    this.entries.forEach((e: any) => {
      if (e.area_id === updated_products[0].area_id) {
        const remove_area_id = updated_products.map((u: any) => {
          delete u.area_id;
          return u;
        })
        e.sales = remove_area_id;
      }
    })
    this._id ? this.updateSales() : this.addSales();
    this.showParent = true;
  }

  addSales() {
    const payload = {
      allocation_date: this.convertDateFormat(new Date()),
      executive_id: this.executive_id,
      entries: this.entries
    }
    this.PService.addSales(payload).subscribe((res: any) => {
      this.searchSales();
      this.toastService.showSuccessToaster('Success', 'Added Successfully !');
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  updateSales() {
    const payload = {
      allocation_date: this.convertDateFormat(new Date()),
      executive_id: this.executive_id,
      entries: this.entries,
      _id: this._id
    }
    this.PService.updateSales(payload).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.searchSales();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchSales() {
    this.PService.searchSales({ search_key: { executive_id: this.executive_id, allocation_date: this.convertDateFormat(new Date()) } }).subscribe((res: any) => {
      const data = res?.data[0] || [];
      if (data && data._id) {
        this._id = data?._id;
        let obj: any = {};
        data.entries.forEach((e: any) => {
          obj[e.area_id] = obj[e.area_id] || [];
          e.sales.forEach((s: any) => {
            obj[e.area_id].push({
              ...s, area_id: e.area_id
            })
          })
        })
        this.tableData = obj;
        this.entriesData(obj);
      }
      else {
        this.searchAreaAllocation();
      }
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  get areas() {
    return Object.keys(this.tableData)
  }

}

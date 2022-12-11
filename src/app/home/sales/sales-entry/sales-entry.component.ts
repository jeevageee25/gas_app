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

  constructor(private PService: ProductsService,
    private toastService: ToastService, private gs: GlobalService) { }

  ngOnInit(): void {
    this.searchAreaAllocation();
    this.getAreas();
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
    console.log('grouped', grouped)
  }

  onAreaClick(area_id: any) {
    this.gs.product_details = this.tableData[area_id];
    this.showParent = false;
  }

  onConfirm() {

  }

  get areas() {
    return Object.keys(this.tableData)
  }

}

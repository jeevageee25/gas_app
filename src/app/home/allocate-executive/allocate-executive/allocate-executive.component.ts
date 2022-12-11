import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ConfirmationService } from 'primeng/api';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-allocate-executive',
  templateUrl: './allocate-executive.component.html',
  styleUrls: ['./allocate-executive.component.scss']
})
export class AllocateExectuveComponent implements OnInit {
  tableData: any = [];
  executiveObj: any = {};
  areaObj: any = {};
  areaData: any = [];
  dateForm: FormGroup = new FormGroup({});
  executives: any = [];
  products: any = [];
  productObj: any = {};
  productPriceObj: any = {};
  executive_id = new FormControl();
  defaultData: any = [];

  constructor(
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private PService: ProductsService) { }

  ngOnInit(): void {
    this.createForm();
    this.getExecutives();
    this.getAreas();
    this.searchProducts();
    this.getDefaultAllocation();
  }

  createForm() {
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    this.dateForm = this.fb.group({
      allocation_date: [date, Validators.required],
      _id: []
    })
    this.searchAreaAllocation();
  }

  convertDateFormat(date: any) {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  getExecutives() {
    this.PService.searchEmployee({ search_key: { role: "Delivery Executive" } }).subscribe((res: any) => {
      const data = res?.data || [];
      data.map((i: any) => {
        this.executiveObj[i._id] = i.staff_name;
      })
      this.executives = data;
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchProducts() {
    this.PService.getProducts({ search_key: {} }).subscribe((res: any) => {
      this.products = res?.data || []
      this.products.map((i: any) => {
        this.productObj[i._id] = `${i.category} - ${i.name}`;
        this.productPriceObj[i._id] = i.price;
      })
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  getAreas() {
    this.PService.searchArea({ search_key: {} }).subscribe((res: any) => {
      this.areaData = res?.data || []
      this.areaData.map((i: any) => {
        this.areaObj[i._id] = i.area;
      })
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  getDefaultAllocation() {
    this.PService.searchDefaultAreaAllocation({ search_key: {} }).subscribe((res: any) => {
      this.defaultData = res?.data.map((t: any) => {
        return {
          allocations: t.area_ids.map((a: any) => {
            return { area_id: a, count: null, product: null }
          }),
          executive_id: t.executive_id
        }
      }) || [];
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  addCard() {
    const e_id = this.executive_id.value;
    if (e_id) {
      const allocations = this.defaultData.find((d: any) => d.executive_id === e_id)?.allocations || [];
      this.tableData.unshift({
        executive_id: e_id,
        allocations
      });
    }
  }

  onAddArea(t: any, item: any) {
    if (item.selectedArea) {
      this.tableData[t].allocations.unshift({ area_id: item.selectedArea, count: null, product: null });
      delete this.tableData[t].selectedArea;
      this.tableData = [...this.tableData];
    }
  }

  removeArea(t: any, a: any) {
    this.tableData[t]?.allocations.splice(a, 1);
    this.tableData = [...this.tableData];
  }

  removeCard(t: any) {
    this.tableData.splice(t, 1);
    this.tableData = [...this.tableData];
  }

  calculateRevenue(allocations: any = []) {
    return allocations.reduce((t: any, v: any) => { return t + ((v.count || 0) * this.productPriceObj[v.product] || 0) }, 0)
  }

  addAreaAllocation() {
    const allocation_data = this.tableData.filter((t: any) => t.allocations.length);
    allocation_data.forEach((a: any) => {
      a.allocations.forEach((b: any) => {
        b.price = this.productPriceObj[b.product];
      })
    })
    const { allocation_date } = this.dateForm.value;
    this.PService.addAreaAllocation({ allocation_date: this.convertDateFormat(allocation_date), allocation_data }).subscribe((res: any) => {
      this.searchAreaAllocation();
      this.toastService.showSuccessToaster('Success', 'Added Successfully !');
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  onSubmit() {
    this.dateForm.value._id ? this.updateAreaAllocation() : this.addAreaAllocation();
  }

  onReset() {
    this.searchAreaAllocation();
  }

  updateAreaAllocation() {
    const { _id } = this.dateForm.value;
    const allocation_data = this.tableData.filter((t: any) => t.allocations.length);
    allocation_data.forEach((a: any) => {
      a.allocations.forEach((b: any) => {
        b.price = this.productPriceObj[b.product];
      })
    })
    this.PService.updateAreaAllocation({ _id, allocation_data }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.searchAreaAllocation();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchAreaAllocation() {
    this.PService.searchAreaAllocation({ search_key: { allocation_date: this.convertDateFormat(this.dateForm.value.allocation_date) } }).subscribe((res: any) => {
      const data = res?.data[0] || [];
      if (!data?.allocation_data?.length) {
        this.tableData = [...this.defaultData];
        this.dateForm.get('_id')?.setValue('');
        this.toastService.showInfoToaster('Info', 'Showing Default Allocation');
      }
      else {
        this.tableData = data.allocation_data;
        this.dateForm.get('_id')?.setValue(data._id);
      }
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  get executive_options() {
    const added_executives = this.tableData.map((t: any) => { return t.executive_id })
    return this.executives.filter((e: any) => !added_executives.includes(e._id))
  }
}
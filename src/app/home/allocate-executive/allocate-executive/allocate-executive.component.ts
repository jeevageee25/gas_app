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
  executive_id = new FormControl();

  constructor(
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private PService: ProductsService) { }

  ngOnInit(): void {
    this.createForm();
    this.getExecutives();
    this.getAreas();
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
      this.tableData = res?.data.map((t: any) => {
        return { area_ids: t.area_ids, executive_id: t.executive_id }
      }) || [];
      this.toastService.showInfoToaster('Info', 'Showing Default Allocation');
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  addCard() {
    if (this.executive_id.value) {
      this.tableData.unshift({
        executive_id: this.executive_id.value,
        area_ids: []
      });
    }
  }

  removeArea(t: any, a: any) {
    this.tableData[t]?.area_ids.splice(a, 1);
    this.tableData = [...this.tableData];
  }

  removeCard(t: any) {
    this.tableData.splice(t, 1);
    this.tableData = [...this.tableData];
  }

  addAreaAllocation() {
    const { allocation_date } = this.dateForm.value;
    this.PService.addAreaAllocation({ allocation_date, allocation_data: this.tableData }).subscribe((res: any) => {
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
    this.PService.updateAreaAllocation({ _id, allocation_data: this.tableData }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.searchAreaAllocation();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchAreaAllocation() {
    this.PService.searchAreaAllocation({ search_key: { allocation_date: this.dateForm.value.allocation_date } }).subscribe((res: any) => {
      const data = res?.data[0] || [];
      if (!data?.allocation_data?.length) {
        this.getDefaultAllocation();
        this.dateForm.get('_id')?.setValue('');
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
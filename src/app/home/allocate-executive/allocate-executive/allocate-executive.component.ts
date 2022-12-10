import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  inputForm: FormGroup = new FormGroup({});
  dateForm: FormGroup = new FormGroup({});
  configuration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  tableData = [];
  executives = [];
  areaData = [];
  areaObj: any = {};
  executiveObj: any = {};
  constructor(private confirmationService: ConfirmationService, private toastService: ToastService, private fb: FormBuilder, private PService: ProductsService) { }

  ngOnInit(): void {
    this.createForm();
    this.initTable();
    this.getExecutives();
    this.getAreas();
  }

  initTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.rows = 10;
    this.columns = [
      { key: '', title: 'SL #' },
      { key: 'executive_id', title: 'Executive Name' },
      { key: 'area', title: 'Allocated Area' },
      { key: '', title: 'Actions' }
    ];
  }

  createForm() {
    this.inputForm = this.fb.group({
      _id: [],
      executive_id: ['', Validators.required],
      area_ids: ['', Validators.required],
    })
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    this.dateForm = this.fb.group({
      allocation_date: [date, Validators.required],
    })
    this.searchAreaAllocation();
  }

  addAreaAllocation() {
    if (this.inputForm.invalid) {
      this.toastService.showWarningToaster('Warning', 'Please fill all the Mandatory Fields !');
      return;
    }
    const { executive_id, area_ids } = this.inputForm.value;
    const find_alloation_exists = this.tableData.some((item: any) => item.executive_id === executive_id);
    if (find_alloation_exists) {
      this.toastService.showWarningToaster('Warning', 'Area is already allocated for this Delivery Executive !');
      return;
    }
    const { allocation_date } = this.dateForm.value;
    this.PService.addAreaAllocation({ allocation_date, executive_id, area_ids }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Added Successfully !');
      this.searchAreaAllocation();
      this.inputForm.reset();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  updateAreaAllocation() {
    if (this.inputForm.invalid) {
      this.toastService.showWarningToaster('Warning', 'Please fill the Mandatory Fields !');
      return;
    }
    const { executive_id, area_ids, _id } = this.inputForm.value;
    this.PService.updateAreaAllocation({ _id, executive_id, area_ids }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.searchAreaAllocation();
      this.inputForm.reset();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  deleteAreaAllocation(row: any) {
    this.PService.deleteAreaAllocation(row._id).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Deleted Successfully !');
      this.searchAreaAllocation();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchAreaAllocation() {
    this.PService.searchAreaAllocation({ search_key: { allocation_date: this.dateForm.value.allocation_date } }).subscribe((res: any) => {
      this.tableData = res?.data || [];
      if (this.tableData.length) {
        this.dateForm.get('date')?.disable();
      }
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  editRow(row: any) {
    this.inputForm.patchValue(row);
  }

  confirm(event: Event, row: any) {
    const target: any = event.target;
    this.confirmationService.confirm({
      target,
      message: "Are you sure that you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteAreaAllocation(row);
      },
      reject: () => {

      }
    });
  }

  getExecutives() {
    this.PService.searchEmployee({ search_key: { role: "Delivery Executive" } }).subscribe((res: any) => {
      this.executives = res?.data || [];
      this.executives.map((i: any) => {
        this.executiveObj[i._id] = i.staff_name;
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

  convertToName(ids: any) {
    return ids.map((i: any) => { return this.areaObj[i] });
  }

  onReset() {
    this.tableData = [];
  }
}

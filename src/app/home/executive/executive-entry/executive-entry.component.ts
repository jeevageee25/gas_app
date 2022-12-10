import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ConfirmationService } from 'primeng/api';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-executive-entry',
  templateUrl: './executive-entry.component.html',
  styleUrls: ['./executive-entry.component.scss']
})
export class ExecutiveEntryComponent implements OnInit {
  inputForm: FormGroup = new FormGroup({});
  roles: any = [];
  configuration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  tableData = [];

  constructor(private confirmationService: ConfirmationService, private toastService: ToastService, private fb: FormBuilder, private PService: ProductsService) { }

  ngOnInit(): void {
    this.createForm();
    this.getRoles();
    this.searchEmployee();
    this.initTable();
  }

  initTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.rows = 10;
    this.columns = [
      { key: 'role', title: 'Role' },
      { key: 'siebel_code', title: 'Siebel Code' },
      { key: 'staff_name', title: 'Staff Name' },
      { key: '', title: 'Actions' }
    ];
  }

  createForm() {
    this.inputForm = this.fb.group({
      _id: [],
      role: ['', Validators.required],
      siebel_code: ['', Validators.required],
      staff_name: ['', Validators.required]
    })
  }

  addEmployee() {
    if (this.inputForm.invalid) {
      this.toastService.showWarningToaster('Warning', 'Please fill all the Mandatory Fields !');
      return;
    }
    const { staff_name, role, siebel_code } = this.inputForm.value;
    this.PService.addEmployee({ staff_name, role, siebel_code }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Added Successfully !');
      this.searchEmployee();
      this.inputForm.reset();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  updateEmployee() {
    if (this.inputForm.invalid) {
      this.toastService.showWarningToaster('Warning', 'Please fill all the Mandatory Fields !');
      return;
    }
    const { _id, staff_name, role, siebel_code } = this.inputForm.value;
    this.PService.updateEmployee({ _id, staff_name, role, siebel_code }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.searchEmployee();
      this.inputForm.reset();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  deleteEmployee(row: any) {
    this.PService.deleteEmployee(row._id).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Deleted Successfully !');
      this.searchEmployee();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchEmployee() {
    this.PService.searchEmployee({ search_key: {} }).subscribe((res: any) => {
      this.tableData = res?.data || []
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  getRoles() {
    this.PService.searchRole({ search_key: {} }).subscribe((res: any) => {
      this.roles = res?.data.map((r: any) => { return r.role }) || []
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
        this.deleteEmployee(row);
      },
      reject: () => {

      }
    });
  }

}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';
import { PreviledgesComponent } from '../previledges/previledges.component';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-roles-entry',
  templateUrl: './roles-entry.component.html',
  styleUrls: ['./roles-entry.component.scss']
})
export class RolesComponent implements OnInit {
  inputForm: FormGroup = new FormGroup({});
  configuration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  tableData = [];
  previl = this.gs.getPreviledge('Roles');

  constructor(private gs: GlobalService, public dialogService: DialogService, private confirmationService: ConfirmationService, private toastService: ToastService, private fb: FormBuilder, private PService: ProductsService) { }

  ngOnInit(): void {
    this.createForm();
    this.searchRole();
    this.initTable();
  }

  initTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.rows = 10;
    this.columns = [
      { key: '', title: 'SL #' },
      { key: 'role', title: 'Roles' },
      { key: 'previledge', title: 'Previledge' },
      { key: '', title: 'Actions' }
    ];
  }

  createForm() {
    this.inputForm = this.fb.group({
      _id: [],
      role: ['', Validators.required]
    })
  }

  addRole() {
    if (!this.previl.create) {
      this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
      return;
    }
    if (this.inputForm.invalid) {
      this.toastService.showWarningToaster('Warning', 'Please fill all the Mandatory Fields !');
      return;
    }
    const { role } = this.inputForm.value;
    this.PService.addRole({ role }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Added Successfully !');
      this.searchRole();
      this.inputForm.reset();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  updateRole() {
    if (!this.previl.update) {
      this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
      return;
    }
    if (this.inputForm.invalid) {
      this.toastService.showWarningToaster('Warning', 'Please fill the Mandatory Fields !');
      return;
    }
    const { _id, role } = this.inputForm.value;
    this.PService.updateRole({ _id, role }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.searchRole();
      this.inputForm.reset();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  deleteRole(row: any) {
    this.PService.deleteRole(row._id).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Deleted Successfully !');
      this.searchRole();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchRole() {
    this.PService.searchRole({ search_key: {} }).subscribe((res: any) => {
      this.tableData = res?.data || []
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  editRow(row: any) {
    this.inputForm.patchValue(row);
  }

  confirm(event: Event, row: any) {
    if (!this.previl.delete) {
      this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
      return;
    }
    const target: any = event.target;
    this.confirmationService.confirm({
      target,
      message: "Are you sure that you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteRole(row);
      },
      reject: () => {

      }
    });
  }

  openPreviledges(row: any) {
    const ref = this.dialogService.open(PreviledgesComponent, {
      header: 'Privileges',
      width: '70%',
      data: row
    });
    ref.onClose.subscribe((res: any) => {
      if (res) {
        this.searchRole();
      }
    });
  }
}

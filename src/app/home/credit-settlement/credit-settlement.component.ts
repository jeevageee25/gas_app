import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Config, DefaultConfig, Columns } from 'ngx-easy-table';
import { ConfirmationService } from 'primeng/api';
import { GlobalService } from 'src/app/services/global.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-credit-settlement',
  templateUrl: './credit-settlement.component.html',
  styleUrls: ['./credit-settlement.component.scss']
})
export class CreditSettlementComponent implements OnInit {

  inputForm: FormGroup = new FormGroup({});
  roles: any = [];
  configuration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  tableData = [];
  previl = this.gs.getPreviledge('Employees');


  constructor(private gs: GlobalService, private confirmationService: ConfirmationService, private toastService: ToastService, private fb: FormBuilder, private PService: ProductsService) { }

  ngOnInit(): void {
    this.createForm();
    this.getData();
    this.initTable();
  }

  getData() {
    this.PService.searchSales({ search_key: { paymentMode: "credit" } }).subscribe((res:any) => {
      this.tableData = res?.data || [];
      
    })
  }
  
  initTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.rows = 10;
    this.columns = [
      { key: '', title: 'SL #' },
      { key: 'name', title: 'Customer Name' },
      { key: 'mobile', title: 'Mobile #' },
      { key: 'total_amount', title: 'Expected Amount' },
      { key: 'paid_amount', title: 'Paid Amount' },
      { key: '', title: 'Actions' }
    ];
  }

  createForm() {
    this.inputForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      amount: ['', Validators.required],
    })
  }

  addEmployee() {
    // if (!this.previl.create) {
    //   this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
    //   return;
    // }
    // if (this.inputForm.invalid) {
    //   this.toastService.showWarningToaster('Warning', 'Please fill all the Mandatory Fields !');
    //   return;
    // }
    // const { staff_name, role, siebel_code, user_name, password } = this.inputForm.value;
    // this.PService.addEmployee({ staff_name, role, siebel_code, user_name, password, profile_update: true }).subscribe((res: any) => {
    //   this.toastService.showSuccessToaster('Success', 'Added Successfully !');
    //   this.getData();
    //   this.inputForm.reset();
    // }, e => {
    //   this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    // })
  }

  updateEmployee() {
    // if (!this.previl.update) {
    //   this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
    //   return;
    // }
    // if (this.inputForm.invalid) {
    //   this.toastService.showWarningToaster('Warning', 'Please fill all the Mandatory Fields !');
    //   return;
    // }
    // const { _id, staff_name, role, siebel_code, user_name, password } = this.inputForm.value;
    // this.PService.updateEmployee({ _id, staff_name, role, siebel_code, user_name, password }).subscribe((res: any) => {
    //   this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
    //   this.getData();
    //   this.inputForm.reset();
    // }, e => {
    //   this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    // })
  }

  deleteEmployee(row: any) {
    // this.PService.deleteEmployee(row._id).subscribe((res: any) => {
    //   this.toastService.showSuccessToaster('Success', 'Deleted Successfully !');
    //   this.getData();
    // }, e => {
    //   this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    // })
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
        this.deleteEmployee(row);
      },
      reject: () => {

      }
    });
  }


}

import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-previledges',
  templateUrl: './previledges.component.html',
  styleUrls: ['./previledges.component.scss']
})
export class PreviledgesComponent implements OnInit {
  configuration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  tableData: any = [];

  constructor(private toastService: ToastService, private PService: ProductsService, public config: DynamicDialogConfig, public ref: DynamicDialogRef) { }

  ngOnInit(): void {
    if (this.config?.data?.previledge) {
      this.tableData = this.config.data.previledge;
    }
    else {
      this.initData();
    }
    this.initTable();
  }

  initTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.paginationEnabled = false;
    this.configuration.rows = 10;
    this.columns = [
      { key: 'screen', title: 'Screens' },
      { key: 'create', title: 'Create' },
      { key: 'view', title: 'View' },
      { key: 'update', title: 'Update' },
      { key: 'delete', title: 'Delete' },
    ];
  }

  initData() {
    this.tableData = [
      { screen: 'Products', create: false, view: false, update: false, delete: false },
      { screen: 'Delivery Area', create: false, view: false, update: false, delete: false },
      { screen: 'Roles', create: false, view: false, update: false, delete: false },
      { screen: 'Employees', create: false, view: false, update: false, delete: false },
    ];
  }

  update() {
    const data = this.config?.data;
    this.PService.updateRole({ _id: data._id, previledge: this.tableData }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.ref.close(true);
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  onReset() {
    this.initData();
  }

  onCancel() {
    this.ref.close(false);
  }

}
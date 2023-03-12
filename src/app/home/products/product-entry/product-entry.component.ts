import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ConfirmationService } from 'primeng/api';
import { GlobalService } from 'src/app/services/global.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-product-entry',
  templateUrl: './product-entry.component.html',
  styleUrls: ['./product-entry.component.scss']
})
export class ProductEntryComponent implements OnInit {
  inputForm: FormGroup = new FormGroup({});
  categories: any = ['Domestic', 'Commercial'];
  configuration: Config = { ...DefaultConfig };
  columns: Columns[] = [];
  tableData = [];
  previl = this.gs.getPreviledge('Products');
  constructor(private gs: GlobalService, private confirmationService: ConfirmationService, private toastService: ToastService, private fb: FormBuilder, private PService: ProductsService) { }

  ngOnInit(): void {
    this.createForm();
    this.searchProducts();
    this.initTable();
  }

  initTable() {
    this.configuration = { ...DefaultConfig };
    this.configuration.rows = 10;
    this.columns = [
      { key: 'name', title: 'Product' },
      { key: 'category', title: 'Category' },
      { key: 'price', title: 'Rate' },
      { key: '', title: 'Actions' }
    ];
  }

  createForm() {
    this.inputForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required]
    })
  }

  addProducts() {
    if (!this.previl.create) {
      this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
      return;
    }
    if (this.inputForm.invalid) {
      this.toastService.showWarningToaster('Warning', 'Please fill all the Mandatory Fields !');
      return;
    }
    const { name, category, price } = this.inputForm.value;
    this.PService.addProducts({ name, category, price }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Added Successfully !');
      this.searchProducts();
      this.inputForm.reset();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  updateProduct() {
    if (!this.previl.update) {
      this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
      return;
    }
    if (this.inputForm.invalid) {
      this.toastService.showWarningToaster('Warning', 'Please fill all the Mandatory Fields !');
      return;
    }
    const { _id, name, category, price } = this.inputForm.value;
    this.PService.updateProducts({ _id, name, category, price }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.searchProducts();
      this.inputForm.reset();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  deleteProduct(row: any) {
    this.PService.deleteProducts(row._id).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Deleted Successfully !');
      this.searchProducts();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchProducts() {
    this.PService.getProducts({ search_key: {} }).subscribe((res: any) => {
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
        this.deleteProduct(row);
      },
      reject: () => {

      }
    });
  }

}

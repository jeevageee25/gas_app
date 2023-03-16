import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ConfirmationService } from 'primeng/api';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-allocate-executive',
  templateUrl: './allocate-executive.component.html',
  styleUrls: ['./allocate-executive.component.scss']
})
export class AllocateExectuveComponent implements OnInit {
  alloationForm: any;
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
  previl = this.gs.getPreviledge('Allocate Executive Area');

  constructor(
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private PService: ProductsService,
    private gs: GlobalService) { }

  ngOnInit(): void {
    this.createForm();
    this.getDefaultAllocation();
    this.getExecutives();
    this.getAreas();
    this.searchProducts();
  }

  createForm() {
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    this.dateForm = this.fb.group({
      allocation_date: [date, Validators.required],
      _id: []
    })
    this.alloationForm = this.fb.group({
      tableData: this.fb.array([])
    })
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
      this.products = res?.data || [];
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
      this.searchAreaAllocation();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  addCard() {
    const e_id = this.executive_id.value;
    if (e_id) {
      const alloc = this.defaultData.find((d: any) => d.executive_id === e_id)?.allocations || [];
      let allocations = this.fb.array([]) as FormArray;
      alloc.forEach((a: any) => {
        allocations.push(
          this.fb.group({
            area_id: new FormControl(a.area_id, Validators.required),
            product: new FormControl(a.product, Validators.required),
            count: new FormControl(a.count, Validators.required)
          })
        )
      })
      this.tableDataCtrls.push(this.fb.group({
        executive_id: new FormControl(e_id, Validators.required),
        selectedArea: new FormControl(''),
        selectedProduct: new FormControl([]),
        allocations
      }))
    }
  }

  onAddArea(t: any, item: any) {
    if (item.value.selectedArea) {
      const formc: any = this.alloationForm.controls['tableData'] as FormArray;
      const formA = formc.controls[t].get('allocations') as FormArray;
      item.value.selectedProduct.forEach((s: any) => {
        formA.push(this.fb.group({
          area_id: new FormControl(item.value.selectedArea, Validators.required),
          product: new FormControl(s, Validators.required),
          count: new FormControl('', Validators.required)
        }));
      })
      formc.controls[t].get('selectedArea').setValue('');
      formc.controls[t].get('selectedProduct').setValue([]);
    }
  }

  removeArea(i: any, j: any) {
    const formc: any = this.alloationForm.controls['tableData'] as FormArray;
    const formA = formc.controls[i].get('allocations') as FormArray;
    formA.removeAt(j);
  }

  removeCard(i: any) {
    this.tableDataCtrls.removeAt(i);
  }

  calculateRevenue(allocations: any = []) {
    return allocations.reduce((t: any, v: any) => { return t + ((v.count || 0) * this.productPriceObj[v.product] || 0) }, 0)
  }

  addAreaAllocation() {
    const allocation_data = this.tableDataCtrls.value.filter((t: any) => t.allocations.length);
    allocation_data.forEach((a: any) => {
      a.allocations.forEach((b: any) => {
        b.price = this.productPriceObj[b.product];
      })
      delete a.selectedArea;
      delete a.selectedProduct;
    })
    const { allocation_date } = this.dateForm.value;
    this.PService.addAreaAllocation({date: allocation_date,  allocation_date: this.convertDateFormat(allocation_date), allocation_data }).subscribe((res: any) => {
      this.searchAreaAllocation();
      this.toastService.showSuccessToaster('Success', 'Added Successfully !');
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  onSubmit() {
    if (!this.previl.create) {
      this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
      return;
    }
    if (this.alloationForm.invalid) {
      this.alloationForm.markAllAsTouched()
      this.toastService.showWarningToaster('Warning', 'Please fill all the fields');
      return;
    }
    this.dateForm.value._id ? this.updateAreaAllocation() : this.addAreaAllocation();
  }

  onReset() {
    this.searchAreaAllocation();
  }

  updateAreaAllocation() {
    if (!this.previl.update) {
      this.toastService.showWarningToaster('Warning', 'Access denied. Please contact administrator !');
      return;
    }
    const { _id } = this.dateForm.value;
    const allocation_data = this.tableDataCtrls.value.filter((t: any) => t.allocations.length);
    allocation_data.forEach((a: any) => {
      a.allocations.forEach((b: any) => {
        b.price = this.productPriceObj[b.product];
      })
      delete a.selectedArea;
      delete a.selectedProduct;
    })
    this.PService.updateAreaAllocation({ _id, allocation_data }).subscribe((res: any) => {
      this.toastService.showSuccessToaster('Success', 'Updated Successfully !');
      this.searchAreaAllocation();
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  searchAreaAllocation() {
    const payload = { search_key: { allocation_date: this.convertDateFormat(this.dateForm.value.allocation_date) } };
    this.PService.searchAreaAllocation(payload).subscribe((res: any) => {
      const data = res?.data[0] || [];
      if (!data?.allocation_data?.length) {
        this.generateDefaultForm([...this.defaultData]);
        this.dateForm.get('_id')?.setValue('');
      }
      else {
        this.generateDefaultForm([...data.allocation_data]);
        this.dateForm.get('_id')?.setValue(data._id);
      }
    }, e => {
      this.toastService.showErrorToaster('Error', 'Something went wrong !. Please try again later.');
    })
  }

  generateDefaultForm(data: any) {
    this.alloationForm = this.fb.group({
      tableData: this.fb.array([])
    })
    data.forEach((d: any) => {
      let allocations = this.fb.array([]) as FormArray;
      d.allocations.forEach((a: any) => {
        allocations.push(
          this.fb.group({
            area_id: new FormControl(a.area_id, Validators.required),
            product: new FormControl(a.product, Validators.required),
            count: new FormControl(a.count, Validators.required)
          })
        )
      })
      this.tableDataCtrls.push(this.fb.group({
        executive_id: new FormControl(d.executive_id, Validators.required),
        selectedArea: new FormControl(''),
        selectedProduct: new FormControl([]),
        allocations
      }))
    })
  }

  get tableDataCtrls() {
    return this.alloationForm.controls['tableData'] as FormArray;
  }

  getAllocationCtrls(t: any) {
    const formc: any = this.alloationForm.controls['tableData'] as FormArray;
    return formc.controls[t].get('allocations')
  }

  isVisibleErrorText(fieldName: string, item: any) {
    return (item.controls[fieldName].dirty || item.controls[fieldName].invalid) && item.controls[fieldName].touched;
  }

  isFieldInvalid(fieldType: string, item: any): boolean {
    return item.controls[fieldType]?.invalid &&
      (item.controls[fieldType]?.touched || item.controls[fieldType]?.dirty);
  }

  get executive_options() {
    const added_executives = this.tableDataCtrls.value?.map((t: any) => { return t.executive_id })
    return this.executives.filter((e: any) => !added_executives?.includes(e._id))
  }
}